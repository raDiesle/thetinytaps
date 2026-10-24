export interface TrafficSettings {
  /** Say what happens: "Grün! Wir gehen über die Straße." */
  speech: boolean;
  /** The ticking light, the animals, the cars. */
  sounds: boolean;
  /** Now and then the duck steps onto the road at red and is called back. */
  duck: boolean;
}

export const DEFAULT_TRAFFIC_SETTINGS: TrafficSettings = {
  speech: false,
  sounds: true,
  duck: true,
};

export const TRAFFIC_SETTINGS_KEY = "tinytaps.traffic.v1";
