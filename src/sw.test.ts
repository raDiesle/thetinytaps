import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// The service worker (src/sw.js) decides which build a visitor sees. Answering every page from the cache kept phones
// on the old build through several reloads (user feedback, November 2026): online, a page must come from the network,
// and only offline, on an error status or a network too slow from the cache. These run the real worker in a fake
// browser: one cache holding the old build's index.html, and a network that answers as each test says.

const SCOPE = "https://www.booksforboth.com/";
const OLD_PAGE = "old build";

type Handler = (event: { request: Request; respondWith(answer: Promise<Response>): void; waitUntil(work: Promise<unknown>): void }) => void;

/** Loads the worker with `network` as its fetch and returns how it answers a page opened at `path`. */
function worker(network: (request: Request) => Promise<Response>) {
  const handlers: Record<string, Handler> = {};
  const cache = new Map([[`${SCOPE}index.html`, new Response(OLD_PAGE)]]);
  const caches = {
    open: async () => ({ match: async (url: string) => cache.get(url)?.clone() }),
    match: async (request: Request | string) => cache.get(typeof request === "string" ? request : request.url)?.clone(),
    keys: async () => ["tinytaps-old"],
  };
  const self = {
    registration: { scope: SCOPE },
    location: { origin: new URL(SCOPE).origin },
    addEventListener: (type: string, handler: Handler) => {
      handlers[type] = handler;
    },
  };
  const source = readFileSync(join(import.meta.dir, "sw.js"), "utf8")
    .replace("__FILES__", "[]")
    .replace("__TEXTS__", "{}");
  // The tests don't wait the whole time a phone would.
  const quick = source.replace(/NETWORK_WAIT_MS = \d+/, "NETWORK_WAIT_MS = 50");
  expect(quick).not.toBe(source);
  new Function("self", "caches", "fetch", quick)(self, caches, network);
  return async (path: string) => {
    let answer: Promise<Response> | undefined;
    const request = { url: SCOPE + path, method: "GET", mode: "navigate" } as Request;
    handlers.fetch?.({ request, respondWith: (given) => (answer = given), waitUntil: () => {} });
    if (!answer) throw new Error("the worker left the page to the browser");
    return (await answer).text();
  };
}

test("online, a page comes from the network with the newest build", async () => {
  const open = worker(async () => new Response("new build"));
  expect(await open("")).toBe("new build");
  expect(await open("zaehne/")).toBe("new build");
});

test("offline, a page is the cached app", async () => {
  const open = worker(() => Promise.reject(new TypeError("Failed to fetch")));
  expect(await open("bilder/baustelle/")).toBe(OLD_PAGE);
});

test("an address the site doesn't know (404.html) is the cached app", async () => {
  const open = worker(async () => new Response("not found", { status: 404 }));
  expect(await open("bilder/baustelle/")).toBe(OLD_PAGE);
});

test("a network that takes too long gives way to the cache", async () => {
  const open = worker(() => new Promise(() => {}));
  const started = performance.now();
  expect(await open("")).toBe(OLD_PAGE);
  expect(performance.now() - started).toBeLessThan(1000);
});
