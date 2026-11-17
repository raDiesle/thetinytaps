// Facts about the running build. The bundler writes them in (tools/appPlugin.ts); the values here
// are the ones the tests see.

/** In the dev server (`bun run dev`): developer helpers like `?level=` and `window.__adventure` are on. */
export const DEV: boolean = false;
/** Built for players (`bun run build`): the service worker keeps the site offline. */
export const PROD: boolean = false;
/** Where the site lives: "/", the root of its domain, or a folder when built with PUBLIC_BASE_PATH. */
export const BASE_URL: string = "/";
// No time of the build here, nor anything else that changes from one build to the next: this module is part of the
// chunk every page imports, so such a value renamed most chunks on every build and returning visitors downloaded
// every game again (R-P2, November 2026). The build writes its time into the pages instead (`buildDate` in pwa.ts).
