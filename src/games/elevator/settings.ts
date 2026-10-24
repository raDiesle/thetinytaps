export interface ElevatorSettings {
  /** Speak what the child thinks and does. */
  speech: boolean;
  /** "Pling", the humming lift, the doors and everything the children do. */
  sounds: boolean;
  /** Quieter sounds, slower walking and riding. */
  calm: boolean;
  /** The story played first, picked on the start screen. */
  story: string;
}

export const DEFAULT_ELEVATOR_SETTINGS: ElevatorSettings = {
  speech: false,
  sounds: true,
  calm: false,
  story: "hunger",
};

export const ELEVATOR_SETTINGS_KEY = "tinytaps.elevator.v2";
