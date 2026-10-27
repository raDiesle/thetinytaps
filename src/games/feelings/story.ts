// What both parts of the feelings game are made of: short beats that are told
// (or read aloud) while a big picture shows what happens.

import type { Localized } from "@/lib/language";
import { playAua, playBlow, playBoing, playChime, playCrash, playCry, playHum, playLaugh, playMelody, playPop, playRecorded, playRumble } from "@/lib/sfx";

const recordings: string[] = [];

/** The recording `name` from src/lib/sounds/ (`synth` until it is loaded, or while there is none), noted to be loaded when a story starts. */
function recorded(name: string, synth: () => void) {
  recordings.push(name);
  return () => playRecorded(name, synth);
}

export const SOUNDS = {
  pop: playPop,
  chime: playChime,
  boing: playBoing,
  rumble: playRumble,
  melody: playMelody,
  hum: playHum,
  // What a not-so-good idea leads to, and the laugh for a good one.
  aua: recorded("aua", playAua),
  cry: recorded("cry", playCry),
  crash: recorded("crash", playCrash),
  laugh: recorded("laugh", playLaugh),
  // Good moments that sound like the real thing.
  /** Children cheering: a story ends well. */
  cheer: recorded("cheer", playChime),
  /** A slide whistle gliding down: down the slide. */
  slide: recorded("slide", playBoing),
  /** A ball bouncing, quicker and quicker. */
  bounce: recorded("bounce", playBoing),
  /** Two big stomps: stamping the anger out. */
  stomp: recorded("stomp", playRumble),
  /** A music box: a lullaby. */
  musicbox: recorded("musicbox", playMelody),
  /** A party horn: streamers on the birthday. */
  partyhorn: recorded("partyhorn", playPop),
  /** Breathing out slowly: blowing the fear or anger away. */
  breath: recorded("breath", playBlow),
  /** The click of the light switch, then it is bright. */
  light: () => {
    playRecorded("switch", playPop);
    setTimeout(playChime, 250);
  },
};

export type SoundName = keyof typeof SOUNDS;

/** What a not-so-good idea leads to, heard instead of crying: „Aua!“ when someone gets hurt, a crash when something breaks. */
export type OopsSound = "aua" | "crash";

/** Sounds with a recording in src/lib/sounds/, loaded when a story starts so the first one isn't synthesized. */
export const RECORDED_SOUNDS: readonly string[] = [...recordings, "switch"];

/** Asked before every round after the first, at home and in the kindergarten. */
export const NEXT_QUESTION: Localized = { de: "Und jetzt?", ru: "А теперь?" };

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
