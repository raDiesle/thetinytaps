import type { Localized } from "@/lib/language";
import { type Animal, ANIMALS } from "./content";

// „Wer macht das Geräusch?“ (Z-15): an animal calls behind a curtain and the child taps who it was. Every animal with
// a call of its own (`Animal.call`, a real CC0 recording from src/lib/sounds/) takes part, each once.

/** The animals that call behind the curtain, each with a recording no other animal has. */
export const SOUND_ANIMALS: Animal[] = ANIMALS.filter((a) => a.call);

/**
 * Animals whose calls a child can't tell apart, by id: never dealt together, so exactly one choice fits what is heard
 * (like the look-alike shadows). A new animal that sounds like one of a group joins it.
 */
export const SOUND_LOOKALIKES: string[][] = [
  // Growls and roars.
  ["baer", "loewe", "tiger", "gorilla", "krokodil"],
  // Grunts and snorts.
  ["schwein", "wildschwein", "igel", "nilpferd", "kamel"],
  // Bleats.
  ["schaf", "ziege", "lama"],
  // Neighs and brays.
  ["pferd", "esel", "zebra"],
  // The bellows of the deer.
  ["hirsch", "kuh"],
  // Barks.
  ["hund", "seehund", "fuchs"],
  // Clucks, crows and gobbles: a child knows them all from the farm's hens.
  ["huhn", "hahn", "truthahn"],
  // Soft hoots and coos.
  ["eule", "taube"],
  // Quacks, honks and gabbles.
  ["ente", "gans", "flamingo"],
  // Screeches.
  ["papagei", "pfau", "adler"],
  // Buzzing and whining.
  ["biene", "muecke"],
  // Squeaks and chatters of small animals.
  ["maus", "eichhoernchen"],
  // Chirps.
  ["vogel", "grashuepfer"],
];

/** Whether `a` and `b` sound alike to a child (`SOUND_LOOKALIKES`). */
export const soundLookAlike = (a: Animal, b: Animal) => SOUND_LOOKALIKES.some((group) => group.includes(a.id) && group.includes(b.id));

/** What a sound round says, in one language. */
export interface SoundTexts {
  /** The round's own question, as it starts and after a wrong pick: "Hör mal! Wer ist hinter dem Vorhang?". */
  listen: string;
  /** The right animal stands on the stage: "Da ist ja die Kuh!" (the words of „Wer schaut da raus?“). */
  there: (a: Animal) => string;
  /** A wrong pick calls with its own voice: "Das ist der Hund." */
  thatIs: (a: Animal) => string;
}

/**
 * German only, until the user asks for translations (`languageStatus.ts`); another language finds no recording of
 * them and stays silent. `there` and `thatIs` read as „Wer schaut da raus?“'s, so its recordings are said here too.
 */
export const SOUND_TEXTS: Localized<SoundTexts> = {
  de: {
    listen: "Hör mal! Wer ist hinter dem Vorhang?",
    there: (a) => `Da ist ja ${a.the}!`,
    thatIs: (a) => `Das ist ${a.the}.`,
  },
};
