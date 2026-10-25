/** What tells the pairs apart: only their colour, or their pattern (the colours repeat). */
export type SockMode = "colors" | "patterns";

/** How many pairs come out of the first wash; "Weiter" adds one each time. */
export type StartPairs = "2" | "3" | "4";

export interface SocksSettings {
  mode: SockMode;
  pairs: StartPairs;
  /** Say "Such zwei gleiche Socken!" and praise each pair. */
  speech: boolean;
  /** The washing machine, a note per sock, pegs and the tune at the end. */
  sounds: boolean;
}

export const DEFAULT_SOCKS_SETTINGS: SocksSettings = {
  mode: "colors",
  pairs: "2",
  speech: false,
  sounds: true,
};

export const SOCKS_SETTINGS_KEY = "tinytaps.socks.v1";
