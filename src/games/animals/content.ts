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
  /**
   * The ids of the other foods it eats too (the bear's fish, the rabbit's lettuce): they never lie next to its food
   * as a wrong choice, so exactly one choice fits. Every animal with a food has this list, even an empty one.
   */
  alsoEats?: string[];
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
  {
    id: "hase",
    emoji: "🐰",
    name: "Hase",
    the: "der Hase",
    food: food("moehre", "🥕", "Möhre", "Möhren"),
    alsoEats: ["salat", "apfel", "heu", "blaetter", "blume", "banane", "mais", "nuss", "bambus"],
    home: "bau",
  },
  {
    id: "hund",
    emoji: "🐶",
    name: "Hund",
    the: "der Hund",
    food: food("knochen", "🦴", "Knochen"),
    alsoEats: ["fleisch", "fisch", "kaese", "apfel", "moehre", "banane", "mais", "salat", "nuss", "honig", "fliege"],
    home: "huette",
    sound: playBark,
  },
  {
    id: "katze",
    emoji: "🐱",
    name: "Katze",
    the: "die Katze",
    food: FISH,
    alsoEats: ["fleisch", "knochen", "kaese", "fliege"],
    home: "koerbchen",
    sound: playMeow,
  },
  {
    id: "maus",
    emoji: "🐭",
    name: "Maus",
    the: "die Maus",
    food: food("kaese", "🧀", "Käse"),
    alsoEats: ["nuss", "mais", "apfel", "moehre", "salat", "banane", "heu", "blaetter"],
    home: "mauseloch",
    sound: playSqueak,
  },
  {
    id: "vogel",
    emoji: "🐦",
    name: "Vogel",
    the: "der Vogel",
    food: food("wurm", "🪱", "Wurm", "Würmer"),
    alsoEats: ["fliege", "mais", "nuss", "apfel", "banane", "fisch"],
    home: "nest",
    sound: playTweet,
  },
  {
    id: "baer",
    emoji: "🐻",
    name: "Bär",
    the: "der Bär",
    food: food("honig", "🍯", "Honig"),
    alsoEats: ["fisch", "nuss", "apfel", "banane", "fleisch", "knochen", "mais", "wurm", "moehre", "blaetter", "bambus"],
    home: "hoehle",
  },
  {
    id: "biene",
    emoji: "🐝",
    name: "Biene",
    the: "die Biene",
    food: food("blume", "🌼", "Blume", "Blumen"),
    alsoEats: ["honig"],
    home: "bienenstock",
    sound: playBuzz,
  },
  { id: "frosch", emoji: "🐸", name: "Frosch", the: "der Frosch", food: food("fliege", "🪰", "Fliege", "Fliegen"), alsoEats: ["wurm"], home: "teich" },
  {
    id: "kuh",
    emoji: "🐮",
    name: "Kuh",
    the: "die Kuh",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["salat", "blaetter", "moehre", "apfel", "mais", "banane", "blume", "bambus"],
    home: "stall",
    sound: playMoo,
  },
  {
    id: "pferd",
    emoji: "🐴",
    name: "Pferd",
    the: "das Pferd",
    food: food("apfel", "🍎", "Apfel", "Äpfel"),
    alsoEats: ["moehre", "heu", "salat", "mais", "blaetter", "banane", "blume", "bambus"],
    home: "stall",
  },
  {
    id: "eichhoernchen",
    emoji: "🐿️",
    name: "Eichhörnchen",
    the: "das Eichhörnchen",
    food: food("nuss", "🌰", "Nuss", "Nüsse"),
    alsoEats: ["mais", "apfel", "banane", "moehre", "blaetter"],
    home: "baum",
  },
  { id: "pinguin", emoji: "🐧", name: "Pinguin", the: "der Pinguin", food: FISH, alsoEats: [], home: "eis" },
  { id: "fisch", emoji: "🐠", name: "Fisch", the: "der Fisch", home: "aquarium" },
  { id: "spinne", emoji: "🕷️", name: "Spinne", the: "die Spinne", home: "netz" },
  { id: "ente", emoji: "🦆", name: "Ente", the: "die Ente", home: "teich", sound: playQuack },
  { id: "fuchs", emoji: "🦊", name: "Fuchs", the: "der Fuchs", home: "bau" },
  { id: "schwein", emoji: "🐷", name: "Schwein", the: "das Schwein", home: "stall" },
  {
    id: "affe",
    emoji: "🐵",
    name: "Affe",
    the: "der Affe",
    food: food("banane", "🍌", "Banane", "Bananen"),
    alsoEats: ["apfel", "nuss", "blaetter", "mais", "moehre", "salat", "bambus", "wurm", "fliege"],
  },
  {
    id: "huhn",
    emoji: "🐔",
    name: "Huhn",
    the: "das Huhn",
    food: food("mais", "🌽", "Mais"),
    alsoEats: ["wurm", "fliege", "salat", "apfel", "moehre", "nuss", "banane", "blaetter"],
  },
  {
    id: "panda",
    emoji: "🐼",
    name: "Panda",
    the: "der Panda",
    food: food("bambus", "🎋", "Bambus"),
    alsoEats: ["blaetter", "apfel", "honig", "moehre", "heu", "salat"],
  },
  {
    id: "schnecke",
    emoji: "🐌",
    name: "Schnecke",
    the: "die Schnecke",
    food: food("salat", "🥬", "Salat"),
    alsoEats: ["blaetter", "moehre", "apfel", "blume", "banane", "bambus", "heu", "mais"],
  },
  { id: "loewe", emoji: "🦁", name: "Löwe", the: "der Löwe", food: food("fleisch", "🍖", "Fleisch"), alsoEats: ["knochen", "fisch"] },
  {
    id: "giraffe",
    emoji: "🦒",
    name: "Giraffe",
    the: "die Giraffe",
    food: food("blaetter", "🍃", "Blätter"),
    alsoEats: ["heu", "salat", "apfel", "moehre", "blume", "bambus", "banane", "mais"],
  },
];

/** Every food once, for the wrong choices next to the right one. */
export const FOODS: Food[] = [...new Map(ANIMALS.flatMap((a) => (a.food ? [[a.food.id, a.food] as const] : []))).values()];

/** The foods that may lie next to an animal's food as wrong choices: neither its own nor one it eats too. */
export const wrongFoods = (animal: Animal): Food[] => FOODS.filter((f) => f.id !== animal.food?.id && !animal.alsoEats?.includes(f.id));

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
