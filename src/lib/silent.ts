// While developing, Claude's built-in browser (its user agent says "Claude/…")
// opens the app on its own; there it stays silent, so nothing plays on the
// computer. Everything else runs as usual, only no sound comes out.
export const silent = import.meta.env.DEV && typeof navigator !== "undefined" && /\bClaude\//.test(navigator.userAgent);
