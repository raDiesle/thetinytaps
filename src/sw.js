// Service worker: keeps what a visitor used in the browser, so it starts again without network (plane, no WLAN) and
// right away, and the whole site only for those who installed it as an app. Not bundled – the build copies this file
// to out/sw.js and fills in VERSION, FILES, SHELL and TEXTS (tools/build.ts, writeServiceWorker).
//
// It once downloaded every file of the site (42 MB: every game's pictures and sounds) on the first visit and again
// after every new build, for everyone, while few ever play offline. Now a visit downloads only what it plays.

const VERSION = "__VERSION__";
/** All files of the build an offline copy needs, relative to this script, without the songs and other languages' voices. */
const FILES = __FILES__;
/** What the app needs to start on the home page (index.html, its scripts, styles and pictures): kept at install. */
const SHELL_FILES = __SHELL__;
/** The texts of each language besides German (static/texts-ru.<hash>.js), by language; left out of FILES. */
const TEXTS = __TEXTS__;
/**
 * Left out of FILES and kept once fetched: songs (musik-*.mp3), because music can be off and then
 * they are never downloaded, Tapsi's voice in other languages than German (en-<hash>.mp3) and the texts
 * of each language (texts-ru.<hash>.js), of which only the chosen one is needed.
 */
const ON_DEMAND = /\/((musik-[^/]*|[a-z]{2}-[0-9a-f]{8}[^/]*)\.mp3|static\/texts-[a-z]{2}\.[^/]*\.js)$/;
/** Files named by their content (static/<name>.<hash>.<ext>): the same address is the same file in every build. */
const HASHED = /\/static\/[^/]+$/;

const PREFIX = "tinytaps-";
const CACHE = PREFIX + VERSION;
const SHELL = new URL("index.html", self.registration.scope).href;
/** Kept in the cache while this browser keeps the whole site (an installed app), so the next build does too. */
const ALL = new URL("__all__", self.registration.scope).href;
/** FILES as full addresses, to tell quickly whether an address is one of ours. */
const KNOWN = new Set(FILES.map((file) => new URL(file, self.registration.scope).href));

/** Every request kept by the earlier builds' caches, newest first. */
async function olderEntries() {
  const entries = [];
  for (const key of (await caches.keys()).reverse()) {
    if (!key.startsWith(PREFIX) || key === CACHE) continue;
    const cache = await caches.open(key);
    for (const request of await cache.keys()) entries.push({ cache, request });
  }
  return entries;
}

/** How many files keepAll downloads at once; each batch is kept before the next starts. */
const BATCH = 24;

/**
 * Downloads every file of FILES the cache lacks yet (an installed app plays offline), then marks it so. In batches,
 * so what came is kept when the network or the worker stops halfway (a phone's signal, a newer build taking over),
 * and the next start goes on from there.
 */
async function keepAll(cache) {
  const have = new Set((await cache.keys()).map((request) => request.url));
  const missing = FILES.filter((file) => !have.has(new URL(file, self.registration.scope).href));
  for (let i = 0; i < missing.length; i += BATCH) {
    // "reload" skips the HTTP cache, so no file from an older build sneaks in.
    await cache.addAll(missing.slice(i, i + BATCH).map((file) => new Request(file, { cache: "reload" })));
  }
  await cache.put(ALL, new Response("1"));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // What an earlier build kept and this one still has comes along without downloading it again: a file named by
      // its content is the same file. So the games played before still start offline, and an update costs only
      // what changed. The languages kept (the app language, at least) come along in their new build.
      const older = await olderEntries();
      const languages = new Set();
      let wantsAll = false;
      for (const { cache: from, request } of older) {
        if (request.url === ALL) wantsAll = true;
        const language = /\/static\/texts-([a-z]{2})\./.exec(request.url)?.[1];
        if (language) languages.add(language);
        if (!HASHED.test(new URL(request.url).pathname) || (await cache.match(request))) continue;
        if (!KNOWN.has(request.url) && !ON_DEMAND.test(request.url)) continue;
        const response = await from.match(request);
        if (response) await cache.put(request, response);
      }
      // Then what the start needs and is not there yet: index.html and the files not named by their content always.
      const start = [...SHELL_FILES, ...[...languages].map((id) => TEXTS[id]).filter(Boolean)];
      const missing = [];
      for (const file of start) if (!HASHED.test(new URL(file, self.registration.scope).pathname) || !(await cache.match(file))) missing.push(file);
      await cache.addAll(missing.map((file) => new Request(file, { cache: "reload" })));
      if (wantsAll) await keepAll(cache);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // A page that is still open runs the previous build and may load more of
      // its pictures later, so that build's cache is kept; older ones go.
      const old = (await caches.keys()).filter((key) => key.startsWith(PREFIX) && key !== CACHE);
      await Promise.all(old.slice(0, -1).map((key) => caches.delete(key)));
      await self.clients.claim();
    })(),
  );
});

/** Keeps `urls` (files a page loaded before this worker was there) unless kept already; a fetch the HTTP cache answers. */
async function keepLoaded(urls) {
  const cache = await caches.open(CACHE);
  for (const url of urls) {
    if (!KNOWN.has(url) && !ON_DEMAND.test(url)) continue;
    if (await cache.match(url)) continue;
    await cache.add(url).catch(() => {});
  }
}

// Messages from the page (src/lib/pwa.ts):
// - keepTexts: the texts of the language it plays in (on the very first visit it loaded them before this worker was
//   there, and after a switch they are new);
// - keep: the files it loaded before this worker was there, so the first visit starts offline too;
// - keepAll: it runs as an installed app, which plays everything offline; answered with offlineReady once all is there.
self.addEventListener("message", (event) => {
  const { keepTexts, keep, keepAll: all } = event.data ?? {};
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const texts = TEXTS[keepTexts];
      if (texts && !(await cache.match(texts))) await cache.add(texts);
      if (Array.isArray(keep)) await keepLoaded(keep);
      if (all) {
        if (!(await cache.match(ALL))) await keepAll(cache);
        event.source?.postMessage({ offlineReady: true });
      }
    })(),
  );
});

/** How long a page waits for the network before it starts from the cache (a weak mobile signal). */
const NETWORK_WAIT_MS = 3000;

/** The page from the network, or the cached app when offline, on an error status or after NETWORK_WAIT_MS. */
async function openPage(event, request) {
  const fromCache = async () => (await (await caches.open(CACHE)).match(SHELL)) ?? (await caches.match(SHELL));
  // The request is passed on as it is: a copy with other options would lose its "navigate" mode, which
  // some browsers refuse, and the redirects (/zaehne → /zaehne/) it lets the browser follow itself.
  const network = fetch(request);
  // Keeps the worker alive until the network answers, even when the cache answered first.
  event.waitUntil(network.catch(() => {}));
  const page = network.then((response) => (response.ok || response.type === "opaqueredirect" ? response : Promise.reject()));
  page.catch(() => {});
  const late = new Promise((resolve) => setTimeout(resolve, NETWORK_WAIT_MS));
  try {
    const first = await Promise.race([page, late]);
    if (first) return first;
  } catch {
    // Offline, or an error status (an unknown address answered with 404.html): the cached app.
  }
  return (await fromCache()) ?? network;
}

/**
 * A file from the cache, else from the network, kept from then on when it is one of the site's: so what was played
 * once plays offline. A file named by its content may come from an earlier build's cache too (a page still open
 * runs that build); any other only from this build's, since it may have changed.
 */
async function openFile(event, request) {
  const url = new URL(request.url);
  const address = url.origin + url.pathname;
  const cache = await caches.open(CACHE);
  // ignoreVary: font requests carry an Origin header, which would not match a file cached with "Vary: Origin".
  const kept =
    (await cache.match(request, { ignoreVary: true })) ?? (HASHED.test(url.pathname) ? await caches.match(request, { ignoreVary: true }) : undefined);
  if (kept) return kept;
  const response = await fetch(request);
  // Only whole answers: a part of a file (206, audio asked for in ranges) can't be kept.
  if (response.status === 200 && (KNOWN.has(address) || ON_DEMAND.test(url.pathname))) {
    event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // A page opened online comes from the network, so it always runs the newest build: answered from the
  // cache, a phone kept showing the old one through several reloads, until this worker's successor had
  // downloaded every file of the site in the background. Offline, or when the network takes too long,
  // every page is the same app (deep links like /bilder/baustelle/ included) and comes from the cache.
  if (request.mode === "navigate") {
    event.respondWith(openPage(event, request));
    return;
  }
  event.respondWith(openFile(event, request));
});
