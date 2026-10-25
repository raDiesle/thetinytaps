// Service worker: keeps every file of the site in the browser, so the games
// start without network (plane, no WLAN) and right away. Not bundled – the
// build copies this file to out/sw.js and fills in VERSION and FILES
// (rsbuild.config.ts, pluginOffline).

const VERSION = "__VERSION__";
/** All files of the build, relative to this script, without the songs and other languages' voices. */
const FILES = __FILES__;
/**
 * Left out of FILES and kept once fetched: songs (musik-*.mp3), because music can be off and then
 * they are never downloaded, and Tapsi's voice in other languages than German (en-<hash>.mp3), of
 * which only the chosen one is needed.
 */
const ON_DEMAND = /\/(musik-[^/]*|[a-z]{2}-[0-9a-f]{8}[^/]*)\.mp3$/;

const PREFIX = "tinytaps-";
const CACHE = PREFIX + VERSION;
const SHELL = new URL("index.html", self.registration.scope).href;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // "reload" skips the HTTP cache, so no file from an older build sneaks in.
      await cache.addAll(FILES.map((file) => new Request(file, { cache: "reload" })));
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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  // Every page is the same app (deep links like /bilder/baustelle/ included):
  // answer from the cache straight away. A new build is picked up by the
  // browser's update check and used from the next start on.
  if (request.mode === "navigate") {
    event.respondWith((async () => (await (await caches.open(CACHE)).match(SHELL)) ?? fetch(request))());
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
