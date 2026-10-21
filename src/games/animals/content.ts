import { playBark, playBuzz, playMeow, playMoo, playQuack, playSqueak, playTweet } from "@/lib/sfx";
import type { HomeId } from "./homes";

// German texts for "Was gehört zum Tier?": who eats what (N-08) and who lives where (N-09).

export interface Food {
  /** Same id = same food, so two animals can share one (cat and penguin both like fish). */
  id: string;
  emoji: string;
  name: string;
  /** "Möhren", for "Der Hase mag Möhren." */
  plural: string;
}

export interface Animal {
  id: string;
  emoji: string;
  name: string;
  /** With its article, "der Hase". */
  the: string;
  food?: Food;
  home?: HomeId;
  sound?: () => void;
}

const food = (id: string, emoji: string, name: string, plural = name): Food => ({ id, emoji, name, plural });

const FISH = food("fisch", "🐟", "Fisch");

/**
 * The first animal of a home is the one that peeks out when someone else
 * knocks ("Hier wohnt die Kuh!"), so the best-known resident comes first.
 */
export const ANIMALS: Animal[] = [
  { id: "hase", emoji: "🐰", name: "Hase", the: "der Hase", food: food("moehre", "🥕", "Möhre", "Möhren"), home: "bau" },
  { id: "hund", emoji: "🐶", name: "Hund", the: "der Hund", food: food("knochen", "🦴", "Knochen"), home: "huette", sound: playBark },
  { id: "katze", emoji: "🐱", name: "Katze", the: "die Katze", food: FISH, home: "koerbchen", sound: playMeow },
  { id: "maus", emoji: "🐭", name: "Maus", the: "die Maus", food: food("kaese", "🧀", "Käse"), home: "mauseloch", sound: playSqueak },
  { id: "vogel", emoji: "🐦", name: "Vogel", the: "der Vogel", food: food("wurm", "🪱", "Wurm", "Würmer"), home: "nest", sound: playTweet },
  { id: "baer", emoji: "🐻", name: "Bär", the: "der Bär", food: food("honig", "🍯", "Honig"), home: "hoehle" },
  { id: "biene", emoji: "🐝", name: "Biene", the: "die Biene", food: food("blume", "🌼", "Blume", "Blumen"), home: "bienenstock", sound: playBuzz },
  { id: "frosch", emoji: "🐸", name: "Frosch", the: "der Frosch", food: food("fliege", "🪰", "Fliege", "Fliegen"), home: "teich" },
  { id: "kuh", emoji: "🐮", name: "Kuh", the: "die Kuh", food: food("heu", "🌾", "Heu"), home: "stall", sound: playMoo },
  { id: "pferd", emoji: "🐴", name: "Pferd", the: "das Pferd", food: food("apfel", "🍎", "Apfel", "Äpfel"), home: "stall" },
  { id: "eichhoernchen", emoji: "🐿️", name: "Eichhörnchen", the: "das Eichhörnchen", food: food("nuss", "🌰", "Nuss", "Nüsse"), home: "baum" },
  { id: "pinguin", emoji: "🐧", name: "Pinguin", the: "der Pinguin", food: FISH, home: "eis" },
  { id: "fisch", emoji: "🐠", name: "Fisch", the: "der Fisch", home: "aquarium" },
  { id: "spinne", emoji: "🕷️", name: "Spinne", the: "die Spinne", home: "netz" },
  { id: "ente", emoji: "🦆", name: "Ente", the: "die Ente", home: "teich", sound: playQuack },
  { id: "fuchs", emoji: "🦊", name: "Fuchs", the: "der Fuchs", home: "bau" },
  { id: "schwein", emoji: "🐷", name: "Schwein", the: "das Schwein", food: food("kartoffel", "🥔", "Kartoffel", "Kartoffeln"), home: "stall" },
  { id: "affe", emoji: "🐵", name: "Affe", the: "der Affe", food: food("banane", "🍌", "Banane", "Bananen") },
  { id: "huhn", emoji: "🐔", name: "Huhn", the: "das Huhn", food: food("mais", "🌽", "Mais") },
  { id: "panda", emoji: "🐼", name: "Panda", the: "der Panda", food: food("bambus", "🎋", "Bambus") },
  { id: "schnecke", emoji: "🐌", name: "Schnecke", the: "die Schnecke", food: food("salat", "🥬", "Salat") },
  { id: "loewe", emoji: "🦁", name: "Löwe", the: "der Löwe", food: food("fleisch", "🍖", "Fleisch") },
  { id: "giraffe", emoji: "🦒", name: "Giraffe", the: "die Giraffe", food: food("blaetter", "🍃", "Blätter") },
];

/** Every food once, for the wrong choices next to the right one. */
export const FOODS: Food[] = [...new Map(ANIMALS.flatMap((a) => (a.food ? [[a.food.id, a.food] as const] : []))).values()];

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

export const texts = {
  hungry: (a: Animal) => `${capitalize(a.the)} hat Hunger!`,
  yummy: (a: Animal, f: Food) => `Mmh, lecker! ${capitalize(a.the)} mag ${f.plural}. Danke!`,
  yuck: (a: Animal) => `Bäh! Das mag ${a.the} nicht.`,
  whereLives: (a: Animal) => `Wo wohnt ${a.the}?`,
  movedIn: (a: Animal, inPhrase: string) => `Juhu! ${capitalize(a.the)} wohnt ${inPhrase}.`,
  livesHere: (resident: Animal) => `Nein, hier wohnt ${resident.the}!`,
};
