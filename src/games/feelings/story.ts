// What both parts of the feelings game are made of: short beats that are told
// (or read aloud) while a big picture shows what happens.

import { playBoing, playAua, playChime, playCrash, playCry, playHum, playLaugh, playMelody, playPop, playRecorded, playRumble } from "@/lib/sfx";

export const SOUNDS = {
  pop: playPop,
  chime: playChime,
  boing: playBoing,
  rumble: playRumble,
  melody: playMelody,
  hum: playHum,
  // What a not-so-good idea leads to, and the laugh for a good one: a real recording once there is one in src/lib/sounds/.
  aua: () => playRecorded("aua", playAua),
  cry: () => playRecorded("cry", playCry),
  crash: () => playRecorded("crash", playCrash),
  laugh: () => playRecorded("laugh", playLaugh),
};

export type SoundName = keyof typeof SOUNDS;

/** What a not-so-good idea leads to, heard instead of crying: „Aua!“ when someone gets hurt, a crash when something breaks. */
export type OopsSound = "aua" | "crash";

/** Sounds with a recording in src/lib/sounds/, loaded when a story starts so the first one isn't synthesized. */
export const RECORDED_SOUNDS = ["aua", "cry", "crash", "laugh"];

export interface Beat {
  /** Told from outside; read aloud, never shown. */
  narration?: string;
  /** Said by one of the animals; read aloud, never shown. */
  line?: string;
  sound?: SoundName;
}

/** How long a beat stays before the next one: long enough to look at the picture, or to have it read aloud. */
export function beatMs(beat: Beat, speech: boolean) {
  const chars = (beat.narration?.length ?? 0) + (beat.line?.length ?? 0);
  return speech ? 1100 + chars * 62 : 1400 + chars * 22;
}
