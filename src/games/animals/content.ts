import { byLanguage } from "@/content/texts";
import {
  playBaa,
  playBark,
  playBlub,
  playBuzz,
  playChatter,
  playCluck,
  playCroak,
  playCoo,
  playCrow,
  playDolphin,
  playHoot,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playQuack,
  playRoar,
  playSnap,
  playSquawk,
  playSqueak,
  playSniff,
  playHiss,
  playTrumpet,
  playTweet,
  playWhale,
  playRecorded,
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
  /** Its sound, wherever it calls: the real recording, the synthesized one until that is loaded. */
  sound?: () => void;
  /**
   * The name of its own recording in src/lib/sounds/ for „Wer macht das Geräusch?“ (Z-15): no other animal has the same
   * (`content.test.ts`), so the sound says which animal it is. Only animals with one take part there.
   */
  call?: string;
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

/** For a call without a synthesized stand-in: nothing until its recording is loaded (a round ahead). */
const quiet = () => {};

/**
 * An animal's own call (`Animal.call`) and its sound playing it. `preload`: loaded when the game starts, like the
 * recordings the animals had before „Wer macht das Geräusch?“; the others are loaded a round ahead (`AnimalsRounds`).
 */
const calls = (name: string, synth: () => void, preload = false) => ({
  call: name,
  sound: preload ? real(name, synth) : () => playRecorded(name, synth),
});

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
    // Twigs to gnaw (Knabberholz) for pet rabbits.
    alsoEats: ["salat", "apfel", "heu", "blaetter", "blume", "banane", "mais", "nuss", "bambus", "erdnuss", "trauben", "melone", "holz"],
    home: "bau",
    alsoLives: ["stall", "huette", "hoehle", "kaefig", "wiese", "garten", "wald", "dschungel", "bambuswald"],
  },
  {
    id: "hund",
    emoji: "🐶",
    name: "Hund",
    the: "der Hund",
    food: food("knochen", "🦴", "Knochen"),
    // A stick to chew, as a dog carries one.
    alsoEats: ["fleisch", "fisch", "kaese", "apfel", "moehre", "banane", "mais", "salat", "nuss", "honig", "fliege", "erdnuss", "melone", "garnele", "holz"],
    home: "huette",
    alsoLives: ["koerbchen", "garten"],
    ...calls("bark", playBark, true),
  },
  {
    id: "katze",
    emoji: "🐱",
    name: "Katze",
    the: "die Katze",
    food: FISH,
    alsoEats: ["fleisch", "knochen", "kaese", "fliege", "garnele"],
    home: "koerbchen",
    alsoLives: ["huette", "stall", "garten"],
    ...calls("meow", playMeow, true),
  },
  {
    id: "maus",
    emoji: "🐭",
    name: "Maus",
    the: "die Maus",
    food: food("kaese", "🧀", "Käse"),
    alsoEats: ["nuss", "mais", "apfel", "moehre", "salat", "banane", "heu", "blaetter", "erdnuss", "trauben", "melone", "holz"],
    home: "mauseloch",
    alsoLives: ["bau", "stall", "hoehle", "nest", "kaefig", "wiese", "garten", "laubhaufen", "wald", "dschungel", "bambuswald"],
    ...calls("mouse", playSqueak, true),
  },
  {
    id: "vogel",
    emoji: "🐦",
    name: "Vogel",
    the: "der Vogel",
    food: food("wurm", "🪱", "Wurm", "Würmer"),
    alsoEats: ["fliege", "mais", "nuss", "apfel", "banane", "fisch", "erdnuss", "trauben", "heu", "melone", "garnele"],
    home: "nest",
    alsoLives: ["baum", "stall", "huette", "koerbchen", "dschungel", "savanne", "bambuswald", "wueste", "wald", "kaefig", "wiese", "garten", "berg"],
    ...calls("tweet", playTweet, true),
  },
  {
    id: "baer",
    emoji: "🐻",
    name: "Bär",
    the: "der Bär",
    food: food("honig", "🍯", "Honig"),
    alsoEats: [
      "fisch",
      "nuss",
      "apfel",
      "banane",
      "fleisch",
      "knochen",
      "mais",
      "wurm",
      "moehre",
      "blaetter",
      "bambus",
      "erdnuss",
      "trauben",
      "melone",
      "garnele",
    ],
    home: "hoehle",
    // It catches fish in the river.
    alsoLives: ["bau", "eis", "dschungel", "bambuswald", "wald", "berg", "fluss", "teich", "meer", "riff"],
    ...calls("growl", playRoar, true),
  },
  {
    id: "biene",
    emoji: "🐝",
    name: "Biene",
    the: "die Biene",
    food: food("blume", "🌼", "Blume", "Blumen"),
    alsoEats: ["honig"],
    home: "bienenstock",
    alsoLives: ["baum", "nest", "wiese", "garten"],
    gives: "honig",
    alsoGives: [],
    ...calls("buzz", playBuzz, true),
  },
  {
    id: "frosch",
    emoji: "🐸",
    name: "Frosch",
    the: "der Frosch",
    food: food("fliege", "🪰", "Fliege", "Fliegen"),
    alsoEats: ["wurm"],
    home: "teich",
    alsoLives: ["aquarium", "dschungel", "bambuswald", "wald", "meer", "fluss", "riff", "wiese", "garten"],
    ...calls("croak", playCroak, true),
  },
  {
    id: "kuh",
    emoji: "🐮",
    name: "Kuh",
    the: "die Kuh",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["salat", "blaetter", "moehre", "apfel", "mais", "banane", "blume", "bambus", "erdnuss", "trauben", "melone"],
    home: "stall",
    // On the meadow, and up on the mountain's pasture in summer.
    alsoLives: ["wiese", "berg"],
    gives: "milch",
    alsoGives: ["kaese"],
    ...calls("moo", playMoo, true),
  },
  {
    id: "pferd",
    emoji: "🐴",
    name: "Pferd",
    the: "das Pferd",
    food: food("apfel", "🍎", "Apfel", "Äpfel"),
    alsoEats: ["moehre", "heu", "salat", "mais", "blaetter", "banane", "blume", "bambus", "erdnuss", "trauben", "melone"],
    home: "stall",
    alsoLives: ["wiese"],
    ...calls("neigh", playNeigh, true),
  },
  {
    id: "eichhoernchen",
    emoji: "🐿️",
    name: "Eichhörnchen",
    the: "das Eichhörnchen",
    food: food("nuss", "🌰", "Nuss", "Nüsse"),
    alsoEats: ["mais", "apfel", "banane", "moehre", "blaetter", "erdnuss", "trauben", "melone", "holz"],
    home: "baum",
    alsoLives: ["nest", "hoehle", "wald", "dschungel", "bambuswald", "garten"],
    ...calls("squirrel", playSqueak),
  },
  {
    id: "pinguin",
    emoji: "🐧",
    name: "Pinguin",
    the: "der Pinguin",
    food: FISH,
    // Krill, like a shrimp.
    alsoEats: ["garnele"],
    home: "eis",
    alsoLives: ["teich", "aquarium", "meer", "fluss", "riff"],
    ...calls("penguin", playSquawk, true),
  },
  {
    id: "fisch",
    emoji: "🐠",
    name: "Fisch",
    the: "der Fisch",
    // The worm on the angler's hook; big fish eat little ones.
    food: food("wurm", "🪱", "Wurm", "Würmer"),
    alsoEats: ["fliege", "garnele", "fisch", "mais"],
    home: "aquarium",
    alsoLives: ["teich", "meer", "fluss", "riff"],
    sound: real("bubbles", playBlub),
  },
  {
    id: "spinne",
    emoji: "🕷️",
    name: "Spinne",
    the: "die Spinne",
    food: food("fliege", "🪰", "Fliege", "Fliegen"),
    alsoEats: ["wurm"],
    home: "netz",
    // Its web hangs in the garden, on the meadow's stalks and in the trees.
    alsoLives: ["garten", "wiese", "baum", "wald", "dschungel", "bambuswald"],
  },
  {
    id: "ente",
    emoji: "🦆",
    name: "Ente",
    the: "die Ente",
    food: food("mais", "🌽", "Mais"),
    // A bird like the hen, and what it finds in the water.
    alsoEats: ["wurm", "fliege", "salat", "apfel", "moehre", "nuss", "banane", "blaetter", "erdnuss", "trauben", "heu", "melone", "garnele", "fisch", "blume"],
    home: "teich",
    alsoLives: ["stall", "nest", "meer", "fluss", "riff"],
    gives: "ei",
    alsoGives: [],
    ...calls("quack", playQuack, true),
  },
  {
    id: "fuchs",
    emoji: "🦊",
    name: "Fuchs",
    the: "der Fuchs",
    home: "bau",
    alsoLives: ["hoehle", "wueste", "savanne", "wald", "dschungel", "bambuswald", "berg"],
    ...calls("fox", playBark),
  },
  { id: "schwein", emoji: "🐷", name: "Schwein", the: "das Schwein", home: "stall", alsoLives: [], ...calls("oink", playOink, true) },
  // More animals with a home (November 2026).
  {
    id: "biber",
    emoji: "🦫",
    name: "Biber",
    the: "der Biber",
    food: food("holz", "🪵", "Holz"),
    // Bark, twigs and leaves, fruit and vegetables in the zoo; many children think it eats fish too.
    alsoEats: ["blaetter", "salat", "apfel", "moehre", "mais", "heu", "blume", "bambus", "banane", "trauben", "melone", "nuss", "erdnuss", "fisch"],
    home: "biberburg",
    alsoLives: ["teich", "bau", "meer", "fluss", "riff"],
  },
  {
    id: "ameise",
    emoji: "🐜",
    name: "Ameise",
    the: "die Ameise",
    home: "ameisenhaufen",
    alsoLives: ["bau", "wald", "dschungel", "bambuswald", "wiese", "garten"],
  },
  // The whale first: it peeks out of the sea.
  {
    id: "wal",
    emoji: "🐳",
    name: "Wal",
    the: "der Wal",
    // Krill, tiny ones like shrimps.
    food: food("garnele", "🦐", "Garnele", "Garnelen"),
    alsoEats: ["fisch"],
    home: "meer",
    alsoLives: ["teich", "fluss", "riff"],
    ...calls("whale", playWhale, true),
  },
  { id: "krebs", emoji: "🦀", name: "Krebs", the: "der Krebs", home: "meer", alsoLives: ["aquarium", "teich", "fluss", "riff"] },
  {
    id: "schildkroete",
    emoji: "🐢",
    name: "Schildkröte",
    the: "die Schildkröte",
    food: food("salat", "🥬", "Salat"),
    // A tortoise in the garden eats leaves, flowers and fruit; a sea turtle jellyfish, shrimps and fish.
    alsoEats: ["blaetter", "blume", "moehre", "apfel", "banane", "trauben", "melone", "heu", "wurm", "fisch", "garnele", "mais", "bambus"],
    home: "meer",
    alsoLives: ["teich", "aquarium", "fluss", "riff", "garten"],
  },
  {
    id: "kamel",
    emoji: "🐪",
    name: "Kamel",
    the: "das Kamel",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["blaetter", "salat", "moehre", "apfel", "mais", "blume", "bambus", "banane", "trauben", "melone", "erdnuss"],
    home: "wueste",
    alsoLives: ["savanne", "stall"],
    ...calls("camel", quiet),
  },
  {
    id: "eule",
    emoji: "🦉",
    name: "Eule",
    the: "die Eule",
    home: "baum",
    alsoLives: ["nest", "stall", "wald", "dschungel", "bambuswald"],
    ...calls("hoot", playHoot, true),
  },
  {
    id: "fledermaus",
    emoji: "🦇",
    name: "Fledermaus",
    the: "die Fledermaus",
    // Midges and moths; flying foxes fruit and nectar.
    food: food("fliege", "🪰", "Fliege", "Fliegen"),
    alsoEats: ["apfel", "banane", "trauben", "melone", "blume", "honig", "wurm"],
    home: "hoehle",
    alsoLives: ["baum", "stall", "wald", "dschungel", "bambuswald"],
  },
  {
    id: "affe",
    emoji: "🐵",
    name: "Affe",
    the: "der Affe",
    food: food("banane", "🍌", "Banane", "Bananen"),
    alsoEats: ["apfel", "nuss", "blaetter", "mais", "moehre", "salat", "bambus", "wurm", "fliege", "erdnuss", "trauben", "melone"],
    home: "dschungel",
    alsoLives: ["baum", "bambuswald", "savanne", "wueste", "wald"],
    ...calls("chatter", playChatter, true),
  },
  {
    id: "huhn",
    emoji: "🐔",
    name: "Huhn",
    the: "das Huhn",
    food: food("mais", "🌽", "Mais"),
    alsoEats: ["wurm", "fliege", "salat", "apfel", "moehre", "nuss", "banane", "blaetter", "erdnuss", "trauben", "heu", "melone"],
    home: "stall",
    alsoLives: ["nest", "wiese", "garten"],
    gives: "ei",
    alsoGives: [],
    ...calls("cluck", playCluck, true),
  },
  {
    id: "panda",
    emoji: "🐼",
    name: "Panda",
    the: "der Panda",
    food: food("bambus", "🎋", "Bambus"),
    // Bamboo canes are woody: a log could look like them.
    alsoEats: ["blaetter", "apfel", "honig", "moehre", "heu", "salat", "trauben", "melone", "holz"],
    home: "bambuswald",
    alsoLives: ["dschungel", "hoehle", "baum", "wald", "berg"],
  },
  {
    id: "schnecke",
    emoji: "🐌",
    name: "Schnecke",
    the: "die Schnecke",
    food: food("salat", "🥬", "Salat"),
    alsoEats: ["blaetter", "moehre", "apfel", "blume", "banane", "bambus", "heu", "mais", "trauben", "melone"],
    // The snail first: it peeks out of the garden.
    home: "garten",
    alsoLives: ["wiese", "wald", "dschungel", "bambuswald"],
  },
  {
    id: "schaf",
    emoji: "🐑",
    name: "Schaf",
    the: "das Schaf",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["salat", "blaetter", "moehre", "apfel", "mais", "blume", "banane", "trauben", "melone", "bambus", "erdnuss"],
    home: "stall",
    alsoLives: ["wiese", "berg"],
    gives: "wolle",
    alsoGives: ["milch", "kaese"],
    ...calls("baa", playBaa, true),
  },
  // More animals that give us something (November 2026).
  // The goat bleats with the sheep's recording, as on the farm; the goose quacks like the farm's goose.
  // The goat first: it peeks out of the mountain.
  {
    id: "ziege",
    emoji: "🐐",
    name: "Ziege",
    the: "die Ziege",
    home: "berg",
    alsoLives: ["stall", "hoehle", "wiese"],
    gives: "kaese",
    alsoGives: ["milch", "wolle"],
    ...calls("goat", playBaa),
  },
  {
    id: "gans",
    emoji: "🪿",
    name: "Gans",
    the: "die Gans",
    home: "stall",
    alsoLives: ["teich", "meer", "fluss", "riff", "wiese", "nest"],
    gives: "ei",
    alsoGives: [],
    ...calls("goose", playQuack),
  },
  {
    id: "lama",
    emoji: "🦙",
    name: "Lama",
    the: "das Lama",
    food: food("moehre", "🥕", "Möhre", "Möhren"),
    alsoEats: ["heu", "salat", "apfel", "mais", "blaetter", "banane", "blume", "bambus", "trauben", "melone", "erdnuss"],
    home: "berg",
    alsoLives: ["stall", "hoehle", "wiese"],
    gives: "wolle",
    alsoGives: [],
    ...calls("llama", quiet),
  },
  {
    id: "loewe",
    emoji: "🦁",
    name: "Löwe",
    the: "der Löwe",
    food: food("fleisch", "🍖", "Fleisch"),
    alsoEats: ["knochen", "fisch"],
    home: "savanne",
    alsoLives: ["dschungel", "wueste", "hoehle", "bambuswald", "wald"],
    ...calls("roar", playRoar, true),
  },
  {
    id: "giraffe",
    emoji: "🦒",
    name: "Giraffe",
    the: "die Giraffe",
    food: food("blaetter", "🍃", "Blätter"),
    alsoEats: ["heu", "salat", "apfel", "moehre", "blume", "bambus", "banane", "mais", "trauben", "melone", "holz"],
    home: "savanne",
    alsoLives: ["wueste"],
  },
  // More animals to feed (November 2026).
  {
    id: "elefant",
    emoji: "🐘",
    name: "Elefant",
    the: "der Elefant",
    food: food("erdnuss", "🥜", "Erdnuss", "Erdnüsse"),
    // It strips bark and breaks off branches.
    alsoEats: ["heu", "blaetter", "apfel", "banane", "moehre", "salat", "mais", "bambus", "nuss", "trauben", "blume", "melone", "holz"],
    home: "savanne",
    // Asia's elephants live in the jungle, and every elephant bathes in the river.
    alsoLives: ["wueste", "dschungel", "bambuswald", "wald", "fluss", "teich", "meer", "riff"],
    ...calls("trumpet", playTrumpet, true),
  },
  {
    id: "gorilla",
    emoji: "🦍",
    name: "Gorilla",
    the: "der Gorilla",
    food: food("banane", "🍌", "Banane", "Bananen"),
    alsoEats: ["blaetter", "apfel", "bambus", "salat", "moehre", "nuss", "erdnuss", "trauben", "mais", "blume", "wurm", "fliege", "melone", "holz"],
    home: "dschungel",
    // The mountain gorillas.
    alsoLives: ["baum", "bambuswald", "wald", "berg"],
    ...calls("gorilla", quiet),
  },
  {
    id: "koala",
    emoji: "🐨",
    name: "Koala",
    the: "der Koala",
    food: food("blaetter", "🍃", "Blätter"),
    // Only eucalyptus leaves; bamboo and lettuce are green leaves too, so they never lie beside them as a wrong choice.
    alsoEats: ["bambus", "salat"],
    home: "baum",
    alsoLives: ["wald", "dschungel", "bambuswald"],
  },
  {
    id: "seehund",
    emoji: "🦭",
    name: "Seehund",
    the: "der Seehund",
    food: FISH,
    alsoEats: ["garnele"],
    home: "eis",
    alsoLives: ["meer", "teich", "fluss", "riff"],
    ...calls("seal", playBark),
  },
  {
    id: "delfin",
    emoji: "🐬",
    name: "Delfin",
    the: "der Delfin",
    food: FISH,
    alsoEats: ["garnele"],
    home: "meer",
    alsoLives: ["teich", "fluss", "riff", "aquarium"],
    ...calls("dolphin", playDolphin, true),
  },
  {
    id: "eisbaer",
    emoji: "🐻‍❄️",
    name: "Eisbär",
    the: "der Eisbär",
    food: FISH,
    // A „Bär“, so honey too, like the panda; seals' meat in reality, and berries and fruit where people feed it.
    alsoEats: ["fleisch", "knochen", "honig", "apfel", "trauben", "melone", "garnele"],
    home: "eis",
    // It swims in the sea, and its cubs are born in a den of snow.
    alsoLives: ["meer", "teich", "fluss", "riff", "hoehle"],
    sound: real("growl", playRoar),
  },
  {
    id: "krokodil",
    emoji: "🐊",
    name: "Krokodil",
    the: "das Krokodil",
    food: food("fleisch", "🍖", "Fleisch"),
    alsoEats: ["fisch", "knochen", "garnele"],
    // The crocodile first: it peeks out of the river.
    home: "fluss",
    alsoLives: ["teich", "meer", "riff", "dschungel", "bambuswald", "wald"],
    ...calls("crocodile", playSnap),
  },
  {
    id: "tiger",
    emoji: "🐯",
    name: "Tiger",
    the: "der Tiger",
    food: food("fleisch", "🍖", "Fleisch"),
    alsoEats: ["knochen", "fisch"],
    home: "dschungel",
    // Children mix it up with the lion of the savanna.
    alsoLives: ["bambuswald", "wald", "hoehle", "savanne", "wueste"],
    ...calls("tiger", playRoar),
  },
  // The deer before the wolf: it peeks out of the forest.
  {
    id: "hirsch",
    emoji: "🦌",
    name: "Hirsch",
    the: "der Hirsch",
    // Chestnuts and acorns in autumn, hay from the feeding rack in winter.
    food: food("nuss", "🌰", "Nuss", "Nüsse"),
    alsoEats: ["heu", "blaetter", "apfel", "moehre", "mais", "salat", "blume", "holz", "erdnuss", "trauben", "melone", "banane", "bambus"],
    home: "wald",
    alsoLives: ["dschungel", "bambuswald", "baum", "wiese", "berg"],
    ...calls("stag", quiet),
  },
  {
    id: "wolf",
    emoji: "🐺",
    name: "Wolf",
    the: "der Wolf",
    food: food("fleisch", "🍖", "Fleisch"),
    alsoEats: ["knochen", "fisch", "apfel", "trauben", "melone"],
    home: "wald",
    alsoLives: ["dschungel", "bambuswald", "hoehle", "bau", "berg"],
    ...calls("howl", quiet),
  },
  {
    id: "igel",
    emoji: "🦔",
    name: "Igel",
    the: "der Igel",
    food: food("wurm", "🪱", "Wurm", "Würmer"),
    // Beetles and snails in reality, apples on its spines in picture books, fruit, nuts and cat food where people feed it.
    alsoEats: ["fliege", "apfel", "trauben", "banane", "fleisch", "nuss", "erdnuss", "melone"],
    home: "laubhaufen",
    alsoLives: ["garten", "wiese", "wald", "dschungel", "bambuswald", "bau"],
    ...calls("hedgehog", playSniff),
  },
  {
    id: "schmetterling",
    emoji: "🦋",
    name: "Schmetterling",
    the: "der Schmetterling",
    food: food("blume", "🌼", "Blume", "Blumen"),
    // Nectar, and the juice of ripe fruit.
    alsoEats: ["honig", "apfel", "banane", "trauben", "melone"],
    // The butterfly first: it peeks out of the meadow.
    home: "wiese",
    alsoLives: ["garten", "baum", "wald", "dschungel", "bambuswald"],
  },
  {
    id: "raupe",
    emoji: "🐛",
    name: "Raupe",
    the: "die Raupe",
    food: food("blaetter", "🍃", "Blätter"),
    // Leaves and grass in reality, and all „Die kleine Raupe Nimmersatt“ eats its way through: fruit, cheese, sausage.
    alsoEats: ["salat", "bambus", "heu", "blume", "moehre", "mais", "apfel", "banane", "trauben", "kaese", "fleisch", "melone"],
    home: "garten",
    alsoLives: ["wiese", "baum", "wald", "dschungel", "bambuswald"],
  },
  {
    id: "papagei",
    emoji: "🦜",
    name: "Papagei",
    the: "der Papagei",
    food: food("trauben", "🍇", "Weintrauben"),
    // Seeds and grain (🌾), nuts, fruit, flowers and nectar; a bird, so worms and flies as a child knows it; wood to gnaw.
    alsoEats: ["nuss", "erdnuss", "apfel", "banane", "mais", "moehre", "salat", "blume", "blaetter", "wurm", "fliege", "honig", "heu", "melone", "holz"],
    home: "dschungel",
    alsoLives: ["baum", "bambuswald", "wald", "kaefig", "nest"],
    ...calls("squawk", playSquawk, true),
  },
  {
    id: "zebra",
    emoji: "🦓",
    name: "Zebra",
    the: "das Zebra",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["blaetter", "salat", "moehre", "apfel", "mais", "blume", "bambus", "banane", "trauben", "erdnuss", "melone"],
    home: "savanne",
    alsoLives: ["wueste"],
    ...calls("zebra", playNeigh),
  },
  {
    id: "esel",
    emoji: "🫏",
    name: "Esel",
    the: "der Esel",
    food: food("moehre", "🥕", "Möhre", "Möhren"),
    alsoEats: ["apfel", "heu", "salat", "mais", "blaetter", "banane", "blume", "bambus", "trauben", "erdnuss", "melone", "holz"],
    home: "stall",
    alsoLives: ["wiese", "berg"],
    ...calls("heehaw", playNeigh),
  },
  // More animals to feed and to house, with melons, shrimps and wood (November 2026).
  {
    id: "hamster",
    emoji: "🐹",
    name: "Hamster",
    the: "der Hamster",
    food: food("nuss", "🌰", "Nuss", "Nüsse"),
    // Grain, seeds, fruit and vegetables, mealworms, wood to gnaw and the honey sticks of the pet shop.
    alsoEats: ["erdnuss", "mais", "heu", "moehre", "apfel", "salat", "banane", "trauben", "melone", "blaetter", "blume", "kaese", "wurm", "holz", "honig"],
    home: "kaefig",
    alsoLives: ["bau", "mauseloch"],
    sound: real("mouse", playSqueak),
  },
  {
    id: "nilpferd",
    emoji: "🦛",
    name: "Nilpferd",
    the: "das Nilpferd",
    food: food("melone", "🍉", "Melone", "Melonen"),
    alsoEats: ["heu", "salat", "blaetter", "apfel", "moehre", "banane", "trauben", "mais", "blume", "bambus", "erdnuss", "nuss"],
    home: "fluss",
    alsoLives: ["teich", "meer", "riff", "savanne", "wueste"],
    ...calls("hippo", quiet),
  },
  {
    id: "nashorn",
    emoji: "🦏",
    name: "Nashorn",
    the: "das Nashorn",
    food: food("blaetter", "🍃", "Blätter"),
    alsoEats: ["heu", "salat", "apfel", "moehre", "banane", "trauben", "melone", "mais", "blume", "bambus", "holz", "erdnuss"],
    home: "savanne",
    alsoLives: ["wueste"],
  },
  {
    id: "kaenguru",
    emoji: "🦘",
    name: "Känguru",
    the: "das Känguru",
    food: food("heu", "🌾", "Heu"),
    alsoEats: ["blaetter", "salat", "moehre", "apfel", "mais", "blume", "banane", "trauben", "melone", "bambus", "erdnuss"],
    home: "savanne",
    alsoLives: ["wueste"],
  },
  {
    id: "elch",
    emoji: "🫎",
    name: "Elch",
    the: "der Elch",
    food: food("blaetter", "🍃", "Blätter"),
    // Twigs and bark too.
    alsoEats: ["holz", "heu", "salat", "apfel", "moehre", "bambus", "blume", "nuss", "erdnuss", "banane", "trauben", "melone", "mais"],
    home: "wald",
    alsoLives: ["dschungel", "bambuswald", "baum"],
  },
  {
    id: "faultier",
    emoji: "🦥",
    name: "Faultier",
    the: "das Faultier",
    food: food("blaetter", "🍃", "Blätter"),
    alsoEats: ["salat", "blume", "apfel", "banane", "trauben", "melone", "moehre", "bambus", "mais"],
    home: "dschungel",
    alsoLives: ["bambuswald", "wald", "baum"],
  },
  {
    id: "otter",
    emoji: "🦦",
    name: "Otter",
    the: "der Otter",
    food: FISH,
    // Crayfish, frogs and insects too.
    alsoEats: ["garnele", "fleisch", "knochen", "wurm", "fliege"],
    home: "fluss",
    alsoLives: ["teich", "meer", "riff", "bau", "biberburg"],
  },
  {
    id: "hai",
    emoji: "🦈",
    name: "Hai",
    the: "der Hai",
    food: FISH,
    alsoEats: ["fleisch", "knochen", "garnele"],
    home: "meer",
    alsoLives: ["teich", "fluss", "riff", "aquarium"],
  },
  // The puffer fish first: it peeks out of the reef.
  {
    id: "kugelfisch",
    emoji: "🐡",
    name: "Kugelfisch",
    the: "der Kugelfisch",
    home: "riff",
    alsoLives: ["meer", "teich", "fluss", "aquarium"],
    sound: real("bubbles", playBlub),
  },
  {
    id: "oktopus",
    emoji: "🐙",
    name: "Oktopus",
    the: "der Oktopus",
    food: food("garnele", "🦐", "Garnele", "Garnelen"),
    alsoEats: ["fisch"],
    home: "riff",
    alsoLives: ["meer", "teich", "fluss", "aquarium"],
    sound: real("bubbles", playBlub),
  },
  {
    id: "flamingo",
    emoji: "🦩",
    name: "Flamingo",
    the: "der Flamingo",
    // The little shrimps that make it pink.
    food: food("garnele", "🦐", "Garnele", "Garnelen"),
    alsoEats: ["wurm", "fliege", "fisch"],
    home: "teich",
    alsoLives: ["meer", "fluss", "riff"],
    ...calls("flamingo", playQuack),
  },
  {
    id: "adler",
    emoji: "🦅",
    name: "Adler",
    the: "der Adler",
    food: FISH,
    alsoEats: ["fleisch", "knochen"],
    home: "berg",
    // Its eyrie on a cliff or a tall tree.
    alsoLives: ["nest", "baum", "hoehle", "wald", "dschungel", "bambuswald"],
    ...calls("eagle", playSquawk),
  },
  {
    id: "marienkaefer",
    emoji: "🐞",
    name: "Marienkäfer",
    the: "der Marienkäfer",
    home: "wiese",
    alsoLives: ["garten", "baum", "wald", "dschungel", "bambuswald"],
  },
  { id: "grashuepfer", emoji: "🦗", name: "Grashüpfer", the: "der Grashüpfer", home: "wiese", alsoLives: ["garten"], ...calls("cricket", playTweet) },
  // A pig too, so the sty is never wrong for it.
  {
    id: "wildschwein",
    emoji: "🐗",
    name: "Wildschwein",
    the: "das Wildschwein",
    home: "wald",
    alsoLives: ["dschungel", "bambuswald", "baum", "wiese", "stall"],
    ...calls("boar", playOink),
  },
  { id: "waschbaer", emoji: "🦝", name: "Waschbär", the: "der Waschbär", home: "wald", alsoLives: ["dschungel", "bambuswald", "baum", "hoehle", "garten"] },
  { id: "dachs", emoji: "🦡", name: "Dachs", the: "der Dachs", home: "bau", alsoLives: ["wald", "dschungel", "bambuswald", "hoehle"] },
  { id: "qualle", emoji: "🪼", name: "Qualle", the: "die Qualle", home: "meer", alsoLives: ["teich", "fluss", "riff", "aquarium"] },
  { id: "schwan", emoji: "🦢", name: "Schwan", the: "der Schwan", home: "teich", alsoLives: ["meer", "fluss", "riff", "nest"] },
  // Animals known by their sound, for „Wer macht das Geräusch?“ only (Z-15, November 2026): the rooster crows like
  // no hen, so the two look alike and sound different.
  { id: "hahn", emoji: "🐓", name: "Hahn", the: "der Hahn", ...calls("crow", playCrow) },
  { id: "taube", emoji: "🕊️", name: "Taube", the: "die Taube", ...calls("coo", playCoo) },
  { id: "truthahn", emoji: "🦃", name: "Truthahn", the: "der Truthahn", ...calls("gobble", playCluck) },
  { id: "pfau", emoji: "🦚", name: "Pfau", the: "der Pfau", ...calls("peacock", playSquawk) },
  { id: "muecke", emoji: "🦟", name: "Mücke", the: "die Mücke", ...calls("mosquito", playBuzz) },
  { id: "schlange", emoji: "🐍", name: "Schlange", the: "die Schlange", ...calls("hiss", playHiss) },
];

/**
 * Animals, foods, homes, gifts and small ones added after the last translation, by id: German only until the user asks
 * for their translations (`languageStatus.ts` says what is missing). `content.test.ts` checks that every other one has
 * its words in each translated language, and that these have none yet – once translated, take them off this list.
 */
export const GERMAN_ONLY: { animals: string[]; foods: string[]; homes: string[]; gifts: string[]; growths: string[] } = {
  animals: ["hahn", "taube", "truthahn", "pfau", "muecke", "schlange"],
  foods: [],
  homes: [],
  gifts: [],
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
  /** The feeding round's question, said right after `hungry` (Z-24): "Was isst der Hase gern?". */
  whatEats: (a: Animal) => string;
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
  whatEats: (a) => `Was isst ${a.the} gern?`,
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
