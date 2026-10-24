// While developing, Claude's built-in browser (its user agent says "Claude/…")
// opens the app on its own; there it stays silent, so nothing plays on the
// computer. Everything else runs as usual, only no sound comes out. This holds
// for the production build too (the `preview-pages` server), since no child
// plays in that browser.
export const silent = typeof navigator !== "undefined" && /\bClaude\//.test(navigator.userAgent);
