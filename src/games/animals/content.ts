import { byLanguage } from "@/content/texts";
import {
  playBaa,
  playBark,
  playBlub,
  playBuzz,
  playChatter,
  playCluck,
  playCroak,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playQuack,
  playRoar,
  playSquawk,
  playSqueak,
  playTweet,
  recorded,
} from "@/lib/sfx";
import type { TargetLanguageId } from "@/content/targetLanguages";
import type { Localized } from "@/lib/language";
import { GIFTS, type Gift, type GiftId } from "./gifts";
import type { GrowTexts } from "./growth";
import { HOMES, type Home, type HomeId } from "./homes";

// Animals, foods and German texts for "Was gehört zum Tier?": who eats what (N-08)
// who lives where (N-09) and what it gives us (Z-01); what the small ones become (Z-12) is in growth.tsx. The other languages are in content.<lang>.ts (en, zh, hi, es, ar, ru), by the same ids.

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
  /** The other homes it lives in too (the fish's pond, the dog's basket): never a wrong choice, like `alsoEats`. */
  alsoLives?: HomeId[];
  /** What it gives us, for "Was gibt uns das Tier?" (Z-01): the cow's milk. */
  gives?: GiftId;
  /** The other gifts it gives us too (the sheep's milk): never a wrong choice, like `alsoEats`. */
  alsoGives?: GiftId[];
  sound?: () => void;
}

const food = (id: string, emoji: string, name: string, plural = name): Food => ({ id, emoji, name, plural });

const FISH = food("fisch", "🐟", "Fisch");

/** Every recording the animals' sounds play, loaded when the game starts so even the first sound is the real one. */
export const ANIMAL_RECORDINGS: string[] = [];
/** The recording `name` from src/lib/sounds/, `synth` until it is loaded. */
const real = (name: string, synth: () => void) => {
  ANIMAL_RECORDINGS.push(name);
  return recorded(name, synth);
};

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
    alsoLives: ["stall", "huette", "hoehle"],
  },
  {
    id: "hund",
    emoji: "🐶",
    name: "Hund",
    the: "der Hund",
    food: food("knochen", "🦴", "Knochen"),
    alsoEats: ["fleisch", "fisch", "kaese", "apfel", "moehre", "banane", "mais", "salat", "nuss", "honig", "fliege"],
    home: "huette",
    alsoLives: ["koerbchen"],
    sound: real("bark", playBark),
  },
  {
    id: "katze",
    emoji: "🐱",
    name: "Katze",
    the: "die Katze",
    food: FISH,
    alsoEats: ["fleisch", "knochen", "kaese", "fliege"],
    home: "koerbchen",
    alsoLives: ["huette", "stall"],
    sound: real("meow", playMeow),
  },
  {
    id: "maus",
    emoji: "🐭",
    name: "Maus",
    the: "die Maus",
    food: food("kaese", "🧀", "Käse"),
    alsoEats: ["nuss", "mais", "apfel", "moehre", "salat", "banane", "heu", "blaetter"],
    home: "mauseloch",
    alsoLives: ["bau", "stall", "hoehle", "nest"],
    sound: real("mouse", playSqueak),
  },
  {
    id: "vogel",
    emoji: "🐦",
    name: "Vogel",
    the: "der Vogel",
    food: food("wurm", "🪱", "Wurm", "Würmer"),
    alsoEats: ["fliege", "mais", "nuss", "apfel", "banane", "fisch"],
    home: "nest",
    alsoLives: ["baum", "stall", "huette", "koerbchen"],
    sound: real("tweet", playTweet),
  },
  {
    id: "baer",
    emoji: "🐻",
    name: "Bär",
    the: "der Bär",
    food: food("honig", "🍯", "Honig"),
    alsoEats: ["fisch", "nuss", "apfel", "banane", "fleisch", "knochen", "mais", "wurm", "moehre", "blaetter", "bambus"],
    home: "hoehle",
    alsoLives: ["bau", "eis"],
    sound: real("growl", playRoar),
  },
  {
    id: "biene",
    emoji: "🐝",
    name: "Biene",
    the: "die Biene",
    food: food("blume", "🌼", "Blume", "Blumen"),
    alsoEats: ["honig"],
    home: "bienenstock",
    alsoLives: ["baum", "nest"],
    gives: "honig",
    alsoGives: [],
    sound: real("buzz", playBuzz),
  },
  {
    id: "frosch",
    emoji: "🐸",
    name: "Frosch",
    the: "der Frosch",
    food: food("fliege", "🪰", "Fliege", "Fliegen"),
    alsoEats: ["wurm"],
    home: "teich",
    alsoLives: ["aquarium"],
    sound: real("croak", playCroak),
  },
  {
    id: "kuh",
    emoji: "🐮",
    name: "Kuh",
    the: "die Kuh",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["salat", "blaetter", "moehre", "apfel", "mais", "banane", "blume", "bambus"],
    home: "stall",
    alsoLives: [],
    gives: "milch",
    alsoGives: ["kaese"],
    sound: real("moo", playMoo),
  },
  {
    id: "pferd",
    emoji: "🐴",
    name: "Pferd",
    the: "das Pferd",
    food: food("apfel", "🍎", "Apfel", "Äpfel"),
    alsoEats: ["moehre", "heu", "salat", "mais", "blaetter", "banane", "blume", "bambus"],
    home: "stall",
    alsoLives: [],
    sound: real("neigh", playNeigh),
  },
  {
    id: "eichhoernchen",
    emoji: "🐿️",
    name: "Eichhörnchen",
    the: "das Eichhörnchen",
    food: food("nuss", "🌰", "Nuss", "Nüsse"),
    alsoEats: ["mais", "apfel", "banane", "moehre", "blaetter"],
    home: "baum",
    alsoLives: ["nest", "hoehle"],
  },
  {
    id: "pinguin",
    emoji: "🐧",
    name: "Pinguin",
    the: "der Pinguin",
    food: FISH,
    alsoEats: [],
    home: "eis",
    alsoLives: ["teich", "aquarium"],
    sound: real("penguin", playSquawk),
  },
  { id: "fisch", emoji: "🐠", name: "Fisch", the: "der Fisch", home: "aquarium", alsoLives: ["teich"], sound: real("bubbles", playBlub) },
  { id: "spinne", emoji: "🕷️", name: "Spinne", the: "die Spinne", home: "netz", alsoLives: [] },
  {
    id: "ente",
    emoji: "🦆",
    name: "Ente",
    the: "die Ente",
    home: "teich",
    alsoLives: ["stall", "nest"],
    gives: "ei",
    alsoGives: [],
    sound: real("quack", playQuack),
  },
  { id: "fuchs", emoji: "🦊", name: "Fuchs", the: "der Fuchs", home: "bau", alsoLives: ["hoehle"] },
  { id: "schwein", emoji: "🐷", name: "Schwein", the: "das Schwein", home: "stall", alsoLives: [], sound: real("oink", playOink) },
  {
    id: "affe",
    emoji: "🐵",
    name: "Affe",
    the: "der Affe",
    food: food("banane", "🍌", "Banane", "Bananen"),
    alsoEats: ["apfel", "nuss", "blaetter", "mais", "moehre", "salat", "bambus", "wurm", "fliege"],
    sound: real("chatter", playChatter),
  },
  {
    id: "huhn",
    emoji: "🐔",
    name: "Huhn",
    the: "das Huhn",
    food: food("mais", "🌽", "Mais"),
    alsoEats: ["wurm", "fliege", "salat", "apfel", "moehre", "nuss", "banane", "blaetter"],
    gives: "ei",
    alsoGives: [],
    sound: real("cluck", playCluck),
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
  // Only in "Was gibt uns das Tier?" so far.
  { id: "schaf", emoji: "🐑", name: "Schaf", the: "das Schaf", gives: "wolle", alsoGives: ["milch", "kaese"], sound: real("baa", playBaa) },
  // More animals that give us something (November 2026).
  // The goat bleats with the sheep's recording, as on the farm; the goose quacks like the farm's goose.
  { id: "ziege", emoji: "🐐", name: "Ziege", the: "die Ziege", gives: "kaese", alsoGives: ["milch", "wolle"], sound: real("baa", playBaa) },
  { id: "gans", emoji: "🪿", name: "Gans", the: "die Gans", gives: "ei", alsoGives: [], sound: real("quack", playQuack) },
  { id: "lama", emoji: "🦙", name: "Lama", the: "das Lama", gives: "wolle", alsoGives: [] },
  {
    id: "loewe",
    emoji: "🦁",
    name: "Löwe",
    the: "der Löwe",
    food: food("fleisch", "🍖", "Fleisch"),
    alsoEats: ["knochen", "fisch"],
    sound: real("roar", playRoar),
  },
  {
    id: "giraffe",
    emoji: "🦒",
    name: "Giraffe",
    the: "die Giraffe",
    food: food("blaetter", "🍃", "Blätter"),
    alsoEats: ["heu", "salat", "apfel", "moehre", "blume", "bambus", "banane", "mais"],
  },
];

/**
 * Animals, foods, homes, gifts and small ones added after the last translation, by id: German only until the user asks
 * for their translations (`languageStatus.ts` says what is missing). `content.test.ts` checks that every other one has
 * its words in each translated language, and that these have none yet – once translated, take them off this list.
 */
export const GERMAN_ONLY: { animals: string[]; foods: string[]; homes: string[]; gifts: string[]; growths: string[] } = {
  animals: ["ziege", "gans", "lama"],
  foods: [],
  homes: [],
  gifts: ["kaese"],
  growths: [],
};

/** Every food once, for the wrong choices next to the right one. */
export const FOODS: Food[] = [...new Map(ANIMALS.flatMap((a) => (a.food ? [[a.food.id, a.food] as const] : []))).values()];

/** The foods that may lie next to an animal's food as wrong choices: neither its own nor one it eats too. */
export const wrongFoods = (animal: Animal): Food[] => FOODS.filter((f) => f.id !== animal.food?.id && !animal.alsoEats?.includes(f.id));

/** The homes that may stand next to an animal's home as wrong choices: neither its own nor one it lives in too. */
export const wrongHomes = (animal: Animal): Home[] => Object.values(HOMES).filter((h) => h.id !== animal.home && !animal.alsoLives?.includes(h.id));

/** The animals that give us something, for "Was gibt uns das Tier?". */
export const GIVERS: Animal[] = ANIMALS.filter((a) => a.gives);

/** The gifts that may lie next to an animal's gift as wrong choices: neither its own nor one it gives us too. */
export const wrongGifts = (animal: Animal): Gift[] => Object.values(GIFTS).filter((g) => g.id !== animal.gives && !animal.alsoGives?.includes(g.id));

/**
 * The animal a gift comes from, the one that pops up when it is given to another: the best-known one the gift names
 * (`Gift.giver`: the hen's egg, not the duck's; the cow's cheese, though the cow is asked for its milk).
 */
export const giverOf = (gift: Gift): Animal => ANIMALS.find((a) => a.id === gift.giver)!;

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
  stars: (n) => `${n} geschafft`,
};

/** What "Was gibt uns das Tier?" says, in one language. */
export interface GiftTexts {
  /** The gift's name, for screen readers: "Milch". */
  gift: (g: Gift) => string;
  /** The question: "Was gibt uns die Kuh?". */
  whatGives: (a: Animal) => string;
  /** The right gift: "Die Kuh gibt uns Milch. Danke!". */
  gives: (a: Animal, g: Gift) => string;
  /** A wrong gift, while the animal it comes from pops up: "Das Ei kommt vom Huhn!". */
  comesFrom: (g: Gift, giver: Animal) => string;
}

/** "vom Huhn", "von der Kuh": German's dative after „von“. */
const fromThe = (a: Animal) => (a.the.startsWith("die ") ? `von der ${a.the.slice(4)}` : `vom ${a.the.slice(a.the.indexOf(" ") + 1)}`);

const GERMAN_GIFT_TEXTS: GiftTexts = {
  gift: (g) => g.name,
  whatGives: (a) => `Was gibt uns ${a.the}?`,
  gives: (a, g) => `${capitalize(a.the)} gibt uns ${g.gives}. Danke!`,
  comesFrom: (g, giver) => `${capitalize(g.the)} kommt ${fromThe(giver)}!`,
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
  /** What "Was gibt uns das Tier?" says; an animal or gift without its words gets the whole German sentence. */
  gifts: (german: GiftTexts) => GiftTexts;
  /** What "Was wird aus mir?" says; a small one without its words gets the whole German sentence. */
  growth: (german: GrowTexts) => GrowTexts;
}

/** Every language besides German, by its id. */
export const ANIMAL_TRANSLATIONS: Partial<Record<TargetLanguageId, AnimalTranslation>> = byLanguage((texts) => texts.animals);

/** The texts by app language: `pick(ANIMAL_TEXTS, language.id)`. */
export const ANIMAL_TEXTS: Localized<AnimalTexts> = byLanguage((texts) => texts.animals?.texts(GERMAN_TEXTS), GERMAN_TEXTS);

/** The texts of "Was gibt uns das Tier?" by app language: `pick(GIFT_TEXTS, language.id)`. */
export const GIFT_TEXTS: Localized<GiftTexts> = byLanguage((texts) => texts.animals?.gifts(GERMAN_GIFT_TEXTS), GERMAN_GIFT_TEXTS);
