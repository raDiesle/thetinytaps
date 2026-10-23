/** How many floors the house has; one big button each. */
export type FloorCount = "3" | "5";

export interface ElevatorSettings {
  floors: FloorCount;
  /** Speak the floor number, "nach oben / nach unten" and who gets in and out. */
  speech: boolean;
  /** "Pling", the humming lift, the doors and the animals' noises. */
  sounds: boolean;
  /** Quieter sounds, slower ride, fewer bursts. */
  calm: boolean;
}

export const DEFAULT_ELEVATOR_SETTINGS: ElevatorSettings = {
  floors: "3",
  speech: false,
  sounds: true,
  calm: false,
};

export const ELEVATOR_SETTINGS_KEY = "tinytaps.elevator.v1";
