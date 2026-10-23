import {
  playBaa,
  playBark,
  playBoing,
  playChatter,
  playCluck,
  playCroak,
  playHoot,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playQuack,
  playRoar,
  playSqueak,
  playTrumpet,
  recorded,
} from "@/lib/sfx";
import { de } from "@/content/de";

// German texts and pictures for "Aufzug" (N-37). The animals are emojis;
// most of them have a real recording, the synthesized sound is the fallback.

export interface Rider {
  id: string;
  emoji: string;
  /** With its article, "die Katze". */
  the: string;
  sound: () => void;
}

const rider = (id: string, emoji: string, the: string, sound: () => void): Rider => ({ id, emoji, the, sound });

export const RIDERS: Rider[] = [
  rider("katze", "🐱", "die Katze", recorded("meow", playMeow)),
  rider("hund", "🐶", "der Hund", recorded("bark", playBark)),
  rider("schwein", "🐷", "das Schwein", recorded("oink", playOink)),
  rider("schaf", "🐑", "das Schaf", recorded("baa", playBaa)),
  rider("huhn", "🐔", "das Huhn", recorded("cluck", playCluck)),
  rider("ente", "🦆", "die Ente", recorded("quack", playQuack)),
  rider("maus", "🐭", "die Maus", playSqueak),
  rider("frosch", "🐸", "der Frosch", recorded("croak", playCroak)),
  rider("eule", "🦉", "die Eule", recorded("hoot", playHoot)),
  rider("kuh", "🐮", "die Kuh", recorded("moo", playMoo)),
  rider("elefant", "🐘", "der Elefant", recorded("trumpet", playTrumpet)),
  rider("loewe", "🦁", "der Löwe", recorded("roar", playRoar)),
  rider("affe", "🐵", "der Affe", recorded("chatter", playChatter)),
  rider("pferd", "🐴", "das Pferd", recorded("neigh", playNeigh)),
  rider("hase", "🐰", "der Hase", playBoing),
];

/** Recordings to load before the first ride. */
export const RECORDINGS = ["meow", "bark", "oink", "baa", "cluck", "quack", "croak", "hoot", "moo", "trumpet", "roar", "chatter", "neigh"];

/** What stands in each floor's room, from the ground floor up, and its wall colour. */
export const ROOMS: { wall: string; things: [string, string] }[] = [
  { wall: "#ffe5b4", things: ["🪴", "🚲"] },
  { wall: "#d8f3dc", things: ["🛋️", "📺"] },
  { wall: "#dde5ff", things: ["🛏️", "🧸"] },
  { wall: "#ffd6e0", things: ["🎹", "🥁"] },
  { wall: "#fff3b0", things: ["🔭", "🌻"] },
];

const capital = (text: string) => text[0].toUpperCase() + text.slice(1);

export const texts = {
  /** Floor `index` from the ground up: "Drei!" */
  floor: (index: number) => `${capital(de.numberWords[index + 1])}!`,
  up: "Nach oben!",
  down: "Nach unten!",
  out: (r: Rider) => `${capital(r.the)} steigt aus.`,
  in: (r: Rider) => `${capital(r.the)} steigt ein.`,
};
