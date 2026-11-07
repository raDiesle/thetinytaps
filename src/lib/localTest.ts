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
