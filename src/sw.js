// Service worker: keeps every file of the site in the browser, so the games
// start without network (plane, no WLAN) and right away. Not bundled – the
// build copies this file to out/sw.js and fills in VERSION and FILES
// (rsbuild.config.ts, pluginOffline).

const VERSION = "__VERSION__";
/** All files of the build, relative to this script. */
const FILES = __FILES__;

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
    event.respondWith(
      (async () => (await (await caches.open(CACHE)).match(SHELL)) ?? fetch(request))(),
    );
    return;
  }

  // ignoreVary: font requests carry an Origin header, which would not match a
  // file cached with "Vary: Origin".
  event.respondWith((async () => (await caches.match(request, { ignoreVary: true })) ?? fetch(request))());
});
