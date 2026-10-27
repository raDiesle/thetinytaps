// Facts about the running build. The bundler writes them in (tools/appPlugin.ts); the values here
// are the ones the tests see.

/** In the dev server (`bun run dev`): developer helpers like `?level=` and `window.__adventure` are on. */
export const DEV: boolean = false;
/** Built for players (`bun run build`): the service worker keeps the site offline. */
export const PROD: boolean = false;
/** Where the site lives: "/" locally, "/thetinytaps" on GitHub Pages (PUBLIC_BASE_PATH). */
export const BASE_URL: string = "/";
/** When this version was built (ISO time), shown small on the home page. */
export const BUILD_TIME: string = new Date().toISOString();
