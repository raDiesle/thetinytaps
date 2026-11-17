// Its own module, since pwa.ts imports analytics.ts and both need it.

/** Opened from the home screen (or as an installed desktop app), not in a browser tab; false where there is no window (tests, build). */
export const isStandalone = () =>
  typeof matchMedia === "function" &&
  (matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
