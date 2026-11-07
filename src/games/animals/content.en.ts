import type { Animal, AnimalTexts, AnimalTranslation, Food, GiftTexts } from "./content";
import type { Gift, GiftId } from "./gifts";
import type { Growth, GrowTexts, GrowthId } from "./growth";
import type { Home, HomeId } from "./homes";

// English texts for "Was gehört zum Tier?", by the ids of the animals, foods and homes in content.ts and
// homes.tsx. Animals take "the" ("The bunny is hungry!"), foods the plural where one eats many ("likes carrots").

/** Animals by their id (one without an entry is said in German): the English name, lower case, the word a small child would say. */
export const ENGLISH_ANIMALS: Record<string, string> = {
  hase: "bunny",
  hund: "puppy",
  katze: "kitty",
  maus: "mouse",
  vogel: "bird",
  baer: "bear",
  biene: "bee",
  frosch: "frog",
  kuh: "cow",
  pferd: "horse",
  eichhoernchen: "squirrel",
  pinguin: "penguin",
  fisch: "fish",
  spinne: "spider",
  ente: "duck",
  fuchs: "fox",
  schwein: "pig",
  affe: "monkey",
  huhn: "chicken",
  panda: "panda",
  schnecke: "snail",
  loewe: "lion",
  giraffe: "giraffe",
  schaf: "sheep",
  biber: "beaver",
  ameise: "ant",
  wal: "whale",
  krebs: "crab",
  schildkroete: "turtle",
  kamel: "camel",
  eule: "owl",
  fledermaus: "bat",
  ziege: "goat",
  gans: "goose",
  lama: "llama",
  elefant: "elephant",
  gorilla: "gorilla",
  koala: "koala",
  seehund: "seal",
  delfin: "dolphin",
  eisbaer: "polar bear",
  krokodil: "crocodile",
  tiger: "tiger",
  wolf: "wolf",
  igel: "hedgehog",
  schmetterling: "butterfly",
  raupe: "caterpillar",
  papagei: "parrot",
  zebra: "zebra",
  esel: "donkey",
  hamster: "hamster",
  nilpferd: "hippo",
  nashorn: "rhino",
  kaenguru: "kangaroo",
  hirsch: "deer",
  elch: "moose",
  faultier: "sloth",
  otter: "otter",
  hai: "shark",
  kugelfisch: "pufferfish",
  oktopus: "octopus",
  flamingo: "flamingo",
  adler: "eagle",
  marienkaefer: "ladybug",
  grashuepfer: "grasshopper",
  wildschwein: "wild boar",
  waschbaer: "raccoon",
  dachs: "badger",
  qualle: "jellyfish",
  schwan: "swan",
};

/** A food in English. */
export interface EnglishFood {
  /** Singular, lower case, shown under the plate: "carrot". */
  name: string;
  /** For "The bunny likes carrots.": the plural where one eats many. */
  likes: string;
}

/** Foods by their id; one without an entry is said in German. */
export const ENGLISH_FOODS: Record<string, EnglishFood> = {
  moehre: { name: "carrot", likes: "carrots" },
  knochen: { name: "bone", likes: "bones" },
  fisch: { name: "fish", likes: "fish" },
  kaese: { name: "cheese", likes: "cheese" },
  wurm: { name: "worm", likes: "worms" },
  honig: { name: "honey", likes: "honey" },
  blume: { name: "flower", likes: "flowers" },
  fliege: { name: "fly", likes: "flies" },
  heu: { name: "hay", likes: "hay" },
  apfel: { name: "apple", likes: "apples" },
  nuss: { name: "nut", likes: "nuts" },
  banane: { name: "banana", likes: "bananas" },
  mais: { name: "corn", likes: "corn" },
  bambus: { name: "bamboo", likes: "bamboo" },
  salat: { name: "lettuce", likes: "lettuce" },
  fleisch: { name: "meat", likes: "meat" },
  blaetter: { name: "leaves", likes: "leaves" },
  erdnuss: { name: "peanut", likes: "peanuts" },
  trauben: { name: "grapes", likes: "grapes" },
  melone: { name: "watermelon", likes: "watermelon" },
  garnele: { name: "shrimp", likes: "shrimp" },
  holz: { name: "wood", likes: "wood" },
};

/** A home in English. */
export interface EnglishHome {
  /** Lower case, shown under the drawing: "doghouse". */
  name: string;
  /** Where one lives, for "The puppy lives in the doghouse.". */
  inPhrase: string;
}

/** Homes by their id; one without an entry is said in German. */
export const ENGLISH_HOMES: Partial<Record<HomeId, EnglishHome>> = {
  huette: { name: "doghouse", inPhrase: "in the doghouse" },
  nest: { name: "nest", inPhrase: "in the nest" },
  aquarium: { name: "fish tank", inPhrase: "in the fish tank" },
  bienenstock: { name: "beehive", inPhrase: "in the beehive" },
  stall: { name: "barn", inPhrase: "in the barn" },
  hoehle: { name: "cave", inPhrase: "in the cave" },
  teich: { name: "pond", inPhrase: "in the pond" },
  bau: { name: "burrow", inPhrase: "in the burrow" },
  mauseloch: { name: "mouse hole", inPhrase: "in the mouse hole" },
  koerbchen: { name: "basket", inPhrase: "in the basket" },
  baum: { name: "tree", inPhrase: "in the tree" },
  netz: { name: "web", inPhrase: "in the web" },
  eis: { name: "ice", inPhrase: "on the ice" },
  biberburg: { name: "beaver lodge", inPhrase: "in the beaver lodge" },
  ameisenhaufen: { name: "anthill", inPhrase: "in the anthill" },
  meer: { name: "sea", inPhrase: "in the sea" },
  wueste: { name: "desert", inPhrase: "in the desert" },
  dschungel: { name: "jungle", inPhrase: "in the jungle" },
  savanne: { name: "savanna", inPhrase: "in the savanna" },
  bambuswald: { name: "bamboo forest", inPhrase: "in the bamboo forest" },
  kaefig: { name: "cage", inPhrase: "in the cage" },
  laubhaufen: { name: "leaf pile", inPhrase: "in the leaf pile" },
  wiese: { name: "meadow", inPhrase: "in the meadow" },
  garten: { name: "garden", inPhrase: "in the garden" },
  fluss: { name: "river", inPhrase: "in the river" },
  berg: { name: "mountain", inPhrase: "on the mountain" },
  wald: { name: "forest", inPhrase: "in the forest" },
  riff: { name: "coral reef", inPhrase: "on the coral reef" },
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("en-US") + text.slice(1);

/** The English texts; what has no English words yet is the whole German sentence. */
export function englishTexts(german: AnimalTexts): AnimalTexts {
  const animal = (a: Animal) => ENGLISH_ANIMALS[a.id];
  const the = (a: Animal) => `the ${animal(a)}`;
  const food = (f: Food) => ENGLISH_FOODS[f.id];
  const home = (h: Home) => ENGLISH_HOMES[h.id];
  return {
    animal: (a) => (animal(a) ? capital(animal(a)) : german.animal(a)),
    food: (f) => (food(f) ? capital(food(f).name) : german.food(f)),
    home: (h) => (home(h) ? capital(home(h)!.name) : german.home(h)),
    hungry: (a) => (animal(a) ? `${capital(the(a))} is hungry!` : german.hungry(a)),
    yummy: (a, f) => (animal(a) && food(f) ? `Mmm, yummy! ${capital(the(a))} likes ${food(f).likes}. Thank you!` : german.yummy(a, f)),
    yuck: (a) => (animal(a) ? `Yuck! ${capital(the(a))} doesn't like that.` : german.yuck(a)),
    whereLives: (a) => (animal(a) ? `Where does ${the(a)} live?` : german.whereLives(a)),
    movedIn: (a, h) => (animal(a) && home(h) ? `Hooray! ${capital(the(a))} lives ${home(h)!.inPhrase}.` : german.movedIn(a, h)),
    livesHere: (resident) => (animal(resident) ? `No, ${the(resident)} lives here!` : german.livesHere(resident)),
    stars: (n) => `${n} done`,
  };
}

/** A gift in English. */
export interface EnglishGift {
  /** Lower case, for screen readers: "milk". */
  name: string;
  /** What the animal gives us, for "The chicken gives us eggs.". */
  gives: string;
}

/** What the animals give us, by gift id ("Was gibt uns das Tier?"); one without an entry is said in German. */
export const ENGLISH_GIFTS: Partial<Record<GiftId, EnglishGift>> = {
  milch: { name: "milk", gives: "milk" },
  ei: { name: "egg", gives: "eggs" },
  honig: { name: "honey", gives: "honey" },
  wolle: { name: "wool", gives: "wool" },
  kaese: { name: "cheese", gives: "cheese" },
};

/** "Was gibt uns das Tier?" in English; what has no English words yet is the whole German sentence. */
export function englishGifts(german: GiftTexts): GiftTexts {
  const animal = (a: Animal) => ENGLISH_ANIMALS[a.id];
  const the = (a: Animal) => `the ${animal(a)}`;
  const gift = (g: Gift) => ENGLISH_GIFTS[g.id];
  return {
    gift: (g) => (gift(g) ? capital(gift(g)!.name) : german.gift(g)),
    whatGives: (a) => (animal(a) ? `What does ${the(a)} give us?` : german.whatGives(a)),
    gives: (a, g) => (animal(a) && gift(g) ? `${capital(the(a))} gives us ${gift(g)!.gives}. Thank you!` : german.gives(a, g)),
    comesFrom: (g, giver) => (animal(giver) && gift(g) ? `The ${gift(g)!.name} comes from ${the(giver)}!` : german.comesFrom(g, giver)),
  };
}

/** A small one and what it becomes, in English ("Was wird aus mir?"). */
export interface EnglishGrowth {
  /** The small one, lower case: "caterpillar". */
  young: string;
  /** What it becomes, lower case: "butterfly". */
  adult: string;
  /** With "a" or "an": "a butterfly". */
  a: string;
}

/** The small ones by their id; one without an entry is said in German. */
export const ENGLISH_GROWTHS: Partial<Record<GrowthId, EnglishGrowth>> = {
  raupe: { young: "caterpillar", adult: "butterfly", a: "a butterfly" },
  ei: { young: "egg", adult: "chick", a: "a chick" },
  samen: { young: "seed", adult: "sunflower", a: "a sunflower" },
  kaulquappe: { young: "tadpole", adult: "frog", a: "a frog" },
  eichel: { young: "acorn", adult: "tree", a: "a tree" },
  zwiebel: { young: "bulb", adult: "tulip", a: "a tulip" },
  kuerbiskern: { young: "pumpkin seed", adult: "pumpkin", a: "a pumpkin" },
  kokosnuss: { young: "coconut", adult: "palm tree", a: "a palm tree" },
  knospe: { young: "bud", adult: "red rose", a: "a red rose" },
  schildkroetenei: { young: "egg", adult: "turtle", a: "a turtle" },
  krokodilei: { young: "egg", adult: "crocodile", a: "a crocodile" },
  dinoei: { young: "egg", adult: "dinosaur", a: "a dinosaur" },
  pinguinei: { young: "egg", adult: "penguin", a: "a penguin" },
  schlangenei: { young: "egg", adult: "snake", a: "a snake" },
  fischei: { young: "egg", adult: "fish", a: "a fish" },
  larve: { young: "larva", adult: "bee", a: "a bee" },
  karottensamen: { young: "seed", adult: "carrot", a: "a carrot" },
  maiskorn: { young: "corn kernel", adult: "corn", a: "corn" },
  schirmchen: { young: "fluffy seed", adult: "dandelion", a: "a dandelion" },
  erdbeersamen: { young: "seed", adult: "strawberry", a: "a strawberry" },
};

/** "Was wird aus mir?" in English; a small one without its English words is the whole German sentence. */
export function englishGrowth(german: GrowTexts): GrowTexts {
  const word = (g: Growth) => ENGLISH_GROWTHS[g.id];
  return {
    young: (g) => (word(g) ? capital(word(g)!.young) : german.young(g)),
    adult: (g) => (word(g) ? capital(word(g)!.adult) : german.adult(g)),
    whatBecomes: (g) => (word(g) ? `What does the ${word(g)!.young} turn into?` : german.whatBecomes(g)),
    becomes: (g) => (word(g) ? `The ${word(g)!.young} turns into ${word(g)!.a}. Great!` : german.becomes(g)),
    comesFrom: (g) => (word(g) ? `The ${word(g)!.adult} comes from the ${word(g)!.young}!` : german.comesFrom(g)),
  };
}

/** English, for the table of languages in content.ts. */
export const ENGLISH: AnimalTranslation = {
  words: { animals: ENGLISH_ANIMALS, foods: ENGLISH_FOODS, homes: ENGLISH_HOMES },
  texts: englishTexts,
  gifts: englishGifts,
  growth: englishGrowth,
};
