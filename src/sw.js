// Service worker: keeps every file of the site in the browser, so the games
// start without network (plane, no WLAN) and right away. Not bundled – the
// build copies this file to out/sw.js and fills in VERSION and FILES
// (tools/build.ts, writeServiceWorker).

const VERSION = "__VERSION__";
/** All files of the build, relative to this script, without the songs and other languages' voices. */
const FILES = __FILES__;
/** The texts of each language besides German (static/texts-ru.<hash>.js), by language; left out of FILES. */
const TEXTS = __TEXTS__;
/**
 * Left out of FILES and kept once fetched: songs (musik-*.mp3), because music can be off and then
 * they are never downloaded, Tapsi's voice in other languages than German (en-<hash>.mp3) and the texts
 * of each language (texts-ru.<hash>.js), of which only the chosen one is needed.
 */
const ON_DEMAND = /\/((musik-[^/]*|[a-z]{2}-[0-9a-f]{8}[^/]*)\.mp3|static\/texts-[a-z]{2}\.[^/]*\.js)$/;

const PREFIX = "tinytaps-";
const CACHE = PREFIX + VERSION;
const SHELL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // "reload" skips the HTTP cache, so no file from an older build sneaks in.
      await cache.addAll(FILES.map((file) => new Request(file, { cache: "reload" })));
      // The languages an older build kept (the app language, at least) come along, so the app still
      // starts offline in its language after an update.
      const kept = new Set();
      for (const key of await caches.keys()) {
        if (!key.startsWith(PREFIX) || key === CACHE) continue;
        for (const request of await (await caches.open(key)).keys()) kept.add(/\/static\/texts-([a-z]{2})\./.exec(request.url)?.[1]);
      }
      const texts = [...kept].map((id) => TEXTS[id]).filter(Boolean);
      await cache.addAll(texts.map((file) => new Request(file, { cache: "reload" })));
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

// A page keeps the texts of the language it plays in (keepTextsOffline in src/lib/pwa.ts): on the very first
// visit it loaded them before this worker was there, and after a switch they are new.
self.addEventListener("message", (event) => {
  const file = TEXTS[event.data?.keepTexts];
  if (!file) return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      if (!(await cache.match(file))) await cache.add(file);
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

  // A song or voice is kept once a page has fetched it (it does at start while
  // music is on, or when the story starts in that language), so it plays offline from then on.
  if (ON_DEMAND.test(new URL(request.url).pathname)) {
    event.respondWith(
      (async () => {
        const kept = await caches.match(request);
        if (kept) return kept;
        const response = await fetch(request);
        if (response.ok) await (await caches.open(CACHE)).put(request, response.clone());
        return response;
      })(),
    );
    return;
  }

  // ignoreVary: font requests carry an Origin header, which would not match a
  // file cached with "Vary: Origin".
  event.respondWith((async () => (await caches.match(request, { ignoreVary: true })) ?? fetch(request))());
});
