import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The service worker (src/sw.js) decides which build a visitor sees and what it downloads. Answering every page from
// the cache kept phones on the old build through several reloads (user feedback, November 2026): online, a page must
// come from the network, and only offline, on an error status or a network too slow from the cache. And downloading
// every file of the site on a first visit cost every visitor 42 MB, after every new build again (November 2026): a
// visit keeps only what it plays, and only an installed app keeps everything. These run the real worker in a fake
// browser: caches kept in maps, and a network that answers as each test says.

const SCOPE = "https://www.funforboth.com/";
const OLD_PAGE = "old build";

type Event = Record<string, unknown> & { waitUntil(work: Promise<unknown>): void };
type Handler = (event: Event) => void;
type Network = (request: { url: string }) => Promise<Response>;

/** Every cache of the fake browser by name, each a map from address to answer. */
type Store = Map<string, Map<string, Response>>;

const address = (request: string | { url: string }) => (typeof request === "string" ? new URL(request, SCOPE).href : request.url);

/** The browser's CacheStorage over `store`, fetching through `network` for add and addAll. */
function fakeCaches(store: Store, network: Network) {
  const open = async (name: string) => {
    if (!store.has(name)) store.set(name, new Map());
    const cache = store.get(name) as Map<string, Response>;
    const add = async (request: string | { url: string }) => {
      const response = await network({ url: address(request) });
      if (!response.ok) throw new TypeError("bad status");
      cache.set(address(request), response);
    };
    return {
      match: async (request: string | { url: string }) => cache.get(address(request))?.clone(),
      put: async (request: string | { url: string }, response: Response) => void cache.set(address(request), response),
      add,
      addAll: async (requests: (string | { url: string })[]) => {
        for (const request of requests) await add(request);
      },
      keys: async () => [...cache.keys()].map((url) => ({ url })),
      delete: async (request: string | { url: string }) => cache.delete(address(request)),
    };
  };
  return {
    open,
    keys: async () => [...store.keys()],
    match: async (request: string | { url: string }) => {
      for (const cache of store.values()) {
        const found = cache.get(address(request));
        if (found) return found.clone();
      }
    },
    delete: async (name: string) => store.delete(name),
  };
}

/** Where the worker of `worker()` finds the content hashes of its build's files (BUILT). */
const BUILT = "static/built.l1.txt";

/**
 * Loads the worker of a build with these files into the fake browser, `network` as its fetch. Its list of the build's
 * files (BUILT) the fake browser serves itself, from `files`, counting in `builtFetched` how often it was asked for.
 */
function worker(
  network: Network,
  { store = new Map() as Store, version = "new", files = [] as string[], shell = [] as string[], offline = null as string | null } = {},
) {
  const handlers: Record<string, Handler> = {};
  const self = {
    registration: { scope: SCOPE },
    location: { origin: new URL(SCOPE).origin },
    addEventListener: (type: string, handler: Handler) => {
      handlers[type] = handler;
    },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  };
  const source = readFileSync(join(import.meta.dir, "sw.js"), "utf8")
    .replace('"__VERSION__"', JSON.stringify(version))
    .replace("__UNHASHED__", JSON.stringify(files.filter((file) => !file.startsWith("static/")).map((file) => `./${file}`)))
    .replace("__BUILT__", JSON.stringify(`./${BUILT}`))
    .replace("__SHELL__", JSON.stringify(shell.map((file) => `./${file}`)))
    .replace("__TEXTS__", "{}")
    .replace("__OFFLINE__", JSON.stringify(offline && `./${offline}`));
  // The tests don't wait the whole time a phone would.
  const quick = source.replace(/NETWORK_WAIT_MS = \d+/, "NETWORK_WAIT_MS = 50");
  expect(quick).not.toBe(source);
  /** Only the address of a request matters here; the worker's relative ones resolve against its scope. */
  const requests: { url: string; cache?: string }[] = [];
  class FakeRequest {
    url: string;
    constructor(url: string, init?: { cache?: string }) {
      this.url = address(url);
      requests.push({ url: this.url.replace(SCOPE, ""), cache: init?.cache });
    }
  }
  let builtFetched = 0;
  const hashes = files.filter((file) => file.startsWith("static/")).map((file) => file.split(".").at(-2));
  const fetch = async (request: string | { url: string }) => {
    if (address(request) !== SCOPE + BUILT) return network({ url: address(request) });
    builtFetched++;
    return new Response(hashes.join("\n"));
  };
  new Function("self", "caches", "fetch", "Request", quick)(self, fakeCaches(store, network), fetch, FakeRequest);

  /** Sends the worker an event and waits for its answer and, unless `settle` is false, all the work it started. */
  const dispatch = async (type: string, fields: Record<string, unknown>, settle = true) => {
    const work: Promise<unknown>[] = [];
    let answer: Promise<Response> | undefined;
    handlers[type]?.({ ...fields, respondWith: (given: Promise<Response>) => (answer = given), waitUntil: (given) => void work.push(given) });
    const response = answer && (await answer);
    if (settle) await Promise.all(work.map((given) => given.catch(() => {})));
    return response;
  };
  return {
    store,
    /** How often the worker fetched its build's list of files (BUILT). */
    builtFetched: () => builtFetched,
    /** Every Request the worker made, with its cache mode. */
    requests,
    install: () => dispatch("install", {}),
    message: (data: unknown) => dispatch("message", { data }),
    /** What the worker answers for the file at `path`. */
    file: async (path: string) => {
      const response = await dispatch("fetch", { request: { url: SCOPE + path, method: "GET", mode: "no-cors" } });
      if (!response) throw new Error("the worker left the file to the browser");
      return response.text();
    },
    /** What the worker answers for a page opened at `path`. */
    open: async (path: string) => {
      // A page doesn't wait for the network the worker keeps waiting for in the background.
      const response = await dispatch("fetch", { request: { url: SCOPE + path, method: "GET", mode: "navigate" } }, false);
      if (!response) throw new Error("the worker left the page to the browser");
      return response.text();
    },
  };
}

/** A browser whose earlier build kept its index.html. */
const withOldPage = (): Store => new Map([["tinytaps-old", new Map([[`${SCOPE}index.html`, new Response(OLD_PAGE)]])]]);

/** A network that answers each file with its address and records what was asked for. */
function online() {
  const asked: string[] = [];
  const network: Network = async ({ url }) => {
    asked.push(url.replace(SCOPE, ""));
    return new Response(`net ${url.replace(SCOPE, "")}`);
  };
  return { asked, network };
}

const offline: Network = () => Promise.reject(new TypeError("Failed to fetch"));

test("online, a page comes from the network with the newest build", async () => {
  const { open } = worker(async () => new Response("new build"), { store: withOldPage() });
  expect(await open("")).toBe("new build");
  expect(await open("zaehne/")).toBe("new build");
});

test("offline, a page is the cached app", async () => {
  const { open } = worker(offline, { store: withOldPage() });
  expect(await open("bilder/baustelle/")).toBe(OLD_PAGE);
});

test("an address the site doesn't know (404.html) is the cached app", async () => {
  const { open } = worker(async () => new Response("not found", { status: 404 }), { store: withOldPage() });
  expect(await open("bilder/baustelle/")).toBe(OLD_PAGE);
});

test("a network that takes too long gives way to the cache", async () => {
  const { open } = worker(() => new Promise(() => {}), { store: withOldPage() });
  const started = performance.now();
  expect(await open("")).toBe(OLD_PAGE);
  expect(performance.now() - started).toBeLessThan(1000);
});

const FILES = ["index.html", "static/app.a1.js", "static/cover.b2.webp", "static/zaehne.c3.js", "static/zahn.d4.webp"];
const SHELL = ["index.html", "static/app.a1.js", "static/cover.b2.webp"];

test("a first visit downloads what the home page needs, not every game", async () => {
  const { asked, network } = online();
  await worker(network, { files: FILES, shell: SHELL }).install();
  expect(asked.sort()).toEqual([...SHELL].sort());
});

test("at install only files without a hash bypass the browser's cache: the start the page just loaded isn't downloaded twice", async () => {
  const { network } = online();
  const sw = worker(network, { files: FILES, shell: SHELL });
  await sw.install();
  expect(sw.requests).toEqual([
    { url: "index.html", cache: "reload" },
    { url: "static/app.a1.js", cache: undefined },
    { url: "static/cover.b2.webp", cache: undefined },
  ]);
});

test("a file played once is kept and plays offline", async () => {
  const { network } = online();
  let up = true;
  const sw = worker((request) => (up ? network(request) : offline(request)), { files: FILES, shell: SHELL });
  await sw.install();
  expect(await sw.file("static/zahn.d4.webp")).toBe("net static/zahn.d4.webp");
  up = false;
  expect(await sw.file("static/zahn.d4.webp")).toBe("net static/zahn.d4.webp");
});

test("a new build keeps what the old one had without downloading it again", async () => {
  const before = online();
  const old = worker(before.network, { version: "1", files: FILES, shell: SHELL });
  await old.install();
  await old.file("static/zahn.d4.webp");
  const after = online();
  const files = [...FILES.filter((file) => file !== "static/app.a1.js"), "static/app.e5.js"];
  const shell = ["index.html", "static/app.e5.js", "static/cover.b2.webp"];
  const next = worker(after.network, { store: old.store, version: "2", files, shell });
  await next.install();
  expect(after.asked.sort()).toEqual(["index.html", "static/app.e5.js"]);
  expect([...(next.store.get("tinytaps-2")?.keys() ?? [])]).toContain(`${SCOPE}static/zahn.d4.webp`);
});

/** A network serving `manifest` as the offline copy's list (`partsOf`), recording every other address asked for. */
function serving(manifest: string, parts: object[]) {
  const net = online();
  const network: Network = async (request) => (request.url === SCOPE + manifest ? new Response(JSON.stringify({ parts })) : net.network(request));
  return { asked: net.asked, network };
}

/** The offline copy's list of a build of `files`, as an app from before the choice keeps it: a song it leaves to music. */
const partsOf = (files: string[]) => [...files, "static/musik-hintergrund.s1.mp3"].map((file) => ({ path: `./${file}`, bytes: 1 }));

test("an installed app from before the choice keeps every file but the songs, and so does its next build", async () => {
  const first = serving("static/offline.o1.json", partsOf(FILES));
  const old = worker(first.network, { version: "1", files: FILES, shell: SHELL, offline: "static/offline.o1.json" });
  await old.install();
  await old.message({ keepAll: true });
  expect(first.asked.sort()).toEqual([...FILES].sort());
  const files = [...FILES, "static/neu.f6.webp"];
  const next = serving("static/offline.o2.json", partsOf(files));
  await worker(next.network, { store: old.store, version: "2", files, shell: SHELL, offline: "static/offline.o2.json" }).install();
  // index.html is fetched anew with every build; of the rest only the new file.
  expect(next.asked.sort()).toEqual(["index.html", "static/neu.f6.webp"]);
});

test("without the offline copy's list (offline) nothing is marked as kept, and the next start tries again", async () => {
  const { network } = online();
  let up = false;
  const sw = worker((request) => (up ? network(request) : offline(request)), { files: FILES, shell: SHELL, offline: "static/offline.o1.json" });
  await sw.message({ keepAll: true });
  expect(cached(sw)).not.toContain("__all__");
  up = true;
  const parts = serving("static/offline.o1.json", partsOf(FILES));
  const again = worker(parts.network, { store: sw.store, files: FILES, shell: SHELL, offline: "static/offline.o1.json" });
  await again.message({ keepAll: true });
  expect(cached(again)).toContain("__all__");
  expect(cached(again)).toContain("static/zahn.d4.webp");
});

test("a new build takes over only the files it still has, and a first visit fetches no list of the build's files", async () => {
  const before = online();
  const old = worker(before.network, { version: "1", files: FILES, shell: SHELL });
  await old.install();
  expect(old.builtFetched()).toBe(0);
  await old.file("static/zahn.d4.webp");
  await old.file("static/zaehne.c3.js");
  // The new build changed the teeth's code (a new hash) and the start's.
  const files = ["index.html", "static/app.e5.js", "static/cover.b2.webp", "static/zaehne.g7.js", "static/zahn.d4.webp"];
  const next = worker(online().network, { store: old.store, version: "2", files, shell: ["index.html", "static/app.e5.js", "static/cover.b2.webp"] });
  await next.install();
  expect(next.builtFetched()).toBe(1);
  expect(cached(next, "2")).toContain("static/zahn.d4.webp");
  expect(cached(next, "2")).not.toContain("static/zaehne.c3.js");
  expect(cached(next, "2")).not.toContain("static/app.a1.js");
});

test("an installed app's download that breaks off goes on from where it stopped", async () => {
  const many = ["index.html", ...Array.from({ length: 60 }, (_, i) => `static/bild${i}.h${i}.webp`)];
  const { asked, network } = online();
  let budget = 40;
  const manifest = serving("static/offline.o1.json", partsOf(many));
  const sw = worker((request) => (budget-- > 0 ? (request.url.endsWith(".json") ? manifest.network(request) : network(request)) : offline(request)), {
    files: many,
    shell: ["index.html"],
    offline: "static/offline.o1.json",
  });
  await sw.install();
  await sw.message({ keepAll: true });
  budget = Infinity;
  asked.length = 0;
  await sw.message({ keepAll: true });
  // The batches that came before the signal broke off are not downloaded again.
  expect(asked.length).toBeLessThan(many.length - 24);
  expect(await sw.file("static/bild59.h59.webp")).toBe("net static/bild59.h59.webp");
});

// What an installed app keeps is what grown-ups chose (user request, November 2026): the voices of all languages are
// over 200 MB, so only the app language's recordings and songs come, the voices and the song only when chosen, and only
// the books not left out.
const MANIFEST = "static/offline.m1.json";
const PARTS = [
  { path: "./index.html", bytes: 1 },
  { path: "./static/app.a1.js", bytes: 10 },
  { path: "./static/zaehne.c3.js", bytes: 10, books: ["zaehne"] },
  { path: "./static/1a2b3c4d.v1.mp3", bytes: 5, books: ["zaehne"], language: "de", voice: true },
  { path: "./static/en-1a2b3c4d.v2.mp3", bytes: 5, books: ["zaehne"], language: "en", voice: true, standsIn: ["ru"] },
  { path: "./static/es-1a2b3c4d.v3.mp3", bytes: 5, books: ["zaehne"], language: "es", voice: true },
  { path: "./static/tiere.t1.js", bytes: 10, books: ["zuordnen"] },
  { path: "./static/musik-hintergrund.s1.mp3", bytes: 50, music: true },
];

/** A network serving the offline copy's list too. */
const withManifest = () => serving(MANIFEST, PARTS);

const cached = (sw: { store: Store }, version = "new") => [...(sw.store.get(`tinytaps-${version}`)?.keys() ?? [])].map((url) => url.replace(SCOPE, ""));

test("an installed app keeps only the app language and the chosen books", async () => {
  const { asked, network } = withManifest();
  const sw = worker(network, { files: FILES, shell: SHELL, offline: MANIFEST });
  await sw.install();
  asked.length = 0;
  await sw.message({ keepAll: { languages: ["es"], skip: ["zuordnen"], music: false, voices: true } });
  expect(asked.sort()).toEqual(["static/es-1a2b3c4d.v3.mp3", "static/zaehne.c3.js"]);
  // Russian has few recordings of its own: the English ones that stand in for it come along.
  asked.length = 0;
  await sw.message({ keepAll: { languages: ["ru"], skip: [], music: true, voices: true } });
  expect(asked.sort()).toEqual(["static/en-1a2b3c4d.v2.mp3", "static/musik-hintergrund.s1.mp3", "static/tiere.t1.js"]);
  // Spanish is no longer the app language: its recordings go, what the start needs stays.
  expect(cached(sw)).not.toContain("static/es-1a2b3c4d.v3.mp3");
  expect(cached(sw)).toContain("static/app.a1.js");
  // Without voices and music the games stay, their recordings and the song go.
  asked.length = 0;
  await sw.message({ keepAll: { languages: ["ru"], skip: [], music: false, voices: false } });
  expect(asked).toEqual([]);
  expect(cached(sw)).not.toContain("static/en-1a2b3c4d.v2.mp3");
  expect(cached(sw)).not.toContain("static/musik-hintergrund.s1.mp3");
  expect(cached(sw)).toContain("static/tiere.t1.js");
});

test("the same choice again downloads nothing, and the next build keeps the choice", async () => {
  const first = withManifest();
  const choice = { languages: ["de"], skip: [], music: false, voices: true };
  const old = worker(first.network, { version: "1", files: FILES, shell: SHELL, offline: MANIFEST });
  await old.install();
  await old.message({ keepAll: choice });
  first.asked.length = 0;
  await old.message({ keepAll: choice });
  expect(first.asked).toEqual([]);
  const next = withManifest();
  const sw = worker(next.network, { store: old.store, version: "2", files: FILES, shell: SHELL, offline: MANIFEST });
  await sw.install();
  expect(cached(sw, "2")).toContain("static/1a2b3c4d.v1.mp3");
  expect(cached(sw, "2")).not.toContain("static/en-1a2b3c4d.v2.mp3");
});
