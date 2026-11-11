import { DEV } from "@/lib/buildInfo";

/** The addresses of this computer, where the dev server (`bun run dev`) and the built site (`preview-pages`) run. */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Whether parts still being built may be played here: in the dev server, or on this computer (the built site served
 * locally), never on the real site. A card marked „in Bearbeitung“ (`GameMode.unfinished`) starts only where this holds.
 */
export function canTestUnfinished(host: string = typeof location === "undefined" ? "" : location.hostname): boolean {
  return DEV || LOCAL_HOSTS.has(host) || host.endsWith(".localhost");
}

/** How long a greyed-out card „in Bearbeitung“ is held before it starts anyway (`unlockUnfinished`). */
export const UNLOCK_HOLD_MS = 3000;

let unlocked = false;

/**
 * Lets parts still being built play for the rest of this visit on the real site too. Only the grown-up who makes the
 * app knows the way: holding a greyed-out card for `UNLOCK_HOLD_MS` (user request, November 2026). Nothing on the
 * screen hints at it – no ring, no glow, no sound – so no one else finds it.
 */
export function unlockUnfinished(): void {
  unlocked = true;
}

/** Whether parts still being built may start here: where they may be tested, or after `unlockUnfinished`. */
export function canPlayUnfinished(): boolean {
  return unlocked || canTestUnfinished();
}
