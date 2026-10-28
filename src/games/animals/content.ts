import { byLanguage } from "@/content/texts";
import { playBark, playBuzz, playMeow, playMoo, playQuack, playSqueak, playTweet } from "@/lib/sfx";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { Localized } from "@/lib/language";
import type { Home, HomeId } from "./homes";

// Animals, foods and German texts for "Was gehört zum Tier?": who eats what (N-08)
// and who lives where (N-09). The other languages are in content.<lang>.ts (en, zh, hi, es, ar, ru), by the same ids.

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

/** Everything "Tiere füttern" and "Wer wohnt wo?" say or show, in one language. */
export interface AnimalTexts {
  /** The animal's name, under it and for screen readers: "Hase". */
  animal: (a: Animal) => string;
  food: (f: Food) => string;
  home: (h: Home) => string;
  hungry: (a: Animal) => string;
  yummy: (a: Animal, f: Food) => string;
  yuck: (a: Animal) => string;
  whereLives: (a: Animal) => string;
  movedIn: (a: Animal, h: Home) => string;
  /** A wrong home: the one who lives there peeks out. */
  livesHere: (resident: Animal) => string;
  /** In the speech bubble of an animal given the wrong food. */
  yuckBubble: string;
  /** In the speech bubble of a fed animal. */
  thanksBubble: string;
  /** For screen readers: the stars for `n` done ones. */
  stars: (n: number) => string;
}

const GERMAN_TEXTS: AnimalTexts = {
  animal: (a) => a.name,
  food: (f) => f.name,
  home: (h) => h.name,
  hungry: (a) => `${capitalize(a.the)} hat Hunger!`,
  yummy: (a, f) => `Mmh, lecker! ${capitalize(a.the)} mag ${f.plural}. Danke!`,
  yuck: (a) => `Bäh! Das mag ${a.the} nicht.`,
  whereLives: (a) => `Wo wohnt ${a.the}?`,
  movedIn: (a, h) => `Juhu! ${capitalize(a.the)} wohnt ${h.inPhrase}.`,
  livesHere: (resident) => `Nein, hier wohnt ${resident.the}!`,
  yuckBubble: "Bäh!",
  thanksBubble: "Danke!",
  stars: (n) => `${n} geschafft`,
};

/** A language of the game besides German: its words by id and the sentences built from them with its grammar. */
export interface AnimalTranslation {
  /** The words of each animal, food and home by id, in whatever shape the language's grammar needs; one without an entry is said in German. */
  words: { animals: Record<string, unknown>; foods: Record<string, unknown>; homes: Partial<Record<HomeId, unknown>> };
  /**
   * All texts. Translations come only when asked for, so an animal, food or home may have no words yet: then the
   * whole sentence comes from `german` (and is read by the German voice), never a German word inside another language.
   */
  texts: (german: AnimalTexts) => AnimalTexts;
}

/** Every language besides German, by its id. */
export const ANIMAL_TRANSLATIONS: Partial<Record<TargetLanguageId, AnimalTranslation>> = byLanguage((texts) => texts.animals);

/** The texts by app language: `pick(ANIMAL_TEXTS, language.id)`. */
export const ANIMAL_TEXTS: Localized<AnimalTexts> = byLanguage((texts) => texts.animals?.texts(GERMAN_TEXTS), GERMAN_TEXTS);
