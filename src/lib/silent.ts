// While developing, Claude's built-in browser (its user agent says "Claude/…")
// opens the app on its own; there it stays silent, so nothing plays on the
// computer or the user's headset. Everything else runs as usual, only no sound
// comes out. This holds for the production build too (the `preview-pages`
// server), since no child plays in that browser.
//
// The pane's phone sizes put on an Android user agent without "Claude/" (user
// feedback, November 2026: sounds played on the headset while Claude tested an
// upright phone), so the tab remembers that it is Claude's for its whole life,
// and a phone's user agent on a computer's platform – which only an emulated
// phone has – counts as Claude's too.

/** Where the tab remembers that it is Claude's browser, across reloads and emulated sizes. */
const KEY = "tinytaps.silent";

/** Whether `userAgent` and `platform` come from Claude's browser, as it is or as an emulated phone. */
export function isClaudeBrowser(userAgent: string, platform: string, remembered: boolean): boolean {
  if (/\bClaude\//.test(userAgent) || remembered) return true;
  const phone = /\b(Android|iPhone|iPad)\b/.test(userAgent);
  const computer = /^(Mac|Win)/.test(platform);
  return phone && computer;
}

function detect(): boolean {
  if (typeof navigator === "undefined") return false;
  let remembered = false;
  try {
    remembered = sessionStorage.getItem(KEY) === "1";
  } catch {
    // No storage: the user agent alone decides.
  }
  const claude = isClaudeBrowser(navigator.userAgent, navigator.platform ?? "", remembered);
  if (claude && !remembered) {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      // Not remembered, still silent now.
    }
  }
  return claude;
}

/** True in Claude's browser: every sound and voice plays into nothing. */
export const silent = detect();
