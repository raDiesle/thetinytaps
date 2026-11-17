export interface ElevatorSettings {
  /** The story played first, picked on the start screen. */
  story: string;
}

export const DEFAULT_ELEVATOR_SETTINGS: ElevatorSettings = {
  story: "hunger",
};

export const ELEVATOR_SETTINGS_KEY = "tinytaps.elevator.v2";
