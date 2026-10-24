import { playBoing, playEngine, playHonk, playOink, playQuack, playRumble, recorded } from "@/lib/sfx";
import type { AnimalId, TrafficEvent } from "./world";

// What the animals sound like and what is said. The sentences are only spoken when
// "Vorlesen" is on; nothing in the game needs to be read.

/** Each animal's voice, when it sets off and when it is tapped. */
export const VOICES: Record<AnimalId, () => void> = {
  baer: playRumble,
  ente: recorded("quack", playQuack),
  hase: playBoing,
  schwein: recorded("oink", playOink),
};

export const honk = recorded("honk", playHonk);
export const engine = recorded("engine", playEngine);

/** Recordings to load before the first tap. */
export const RECORDINGS = ["quack", "oink", "honk", "engine"];

/** What is said when something happens. */
export const SAY: Partial<Record<TrafficEvent["type"], string>> = {
  walk: "Grün! Jetzt gehen wir über die Straße.",
  stop: "Rot! Stehen bleiben. Jetzt fahren die Autos.",
  call: "Halt, kleine Ente! Bei Rot bleiben wir stehen.",
  look: "Erst gucken: links, rechts.",
  thanks: "Quak! Danke!",
};
