export interface SocksSettings {
  /** Say "Such zwei gleiche Socken!" and praise each pair. */
  speech: boolean;
  /** The washing machine, a note per sock, pegs and the tune at the end. */
  sounds: boolean;
}

export const DEFAULT_SOCKS_SETTINGS: SocksSettings = {
  speech: false,
  sounds: true,
};

export const SOCKS_SETTINGS_KEY = "tinytaps.socks.v1";
