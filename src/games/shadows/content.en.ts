import type { ShadowItem, ShadowTexts, ShadowTranslation } from "./content";

// English texts for "Schatten finden" and "Wer schaut da raus?", by the ids of the pictures in content.ts. Every
// picture takes "the"; a plural word ("scissors") takes "are" and "their".

/** A picture's name in English. */
export interface EnglishName {
  /** Lower case: "elephant". Shown capitalized under the picture. */
  name: string;
  /** The word is plural ("scissors"), so the verb is too: "are looking". */
  many?: true;
}

/** Pictures of content.ts by their id; one without an entry is said in German. */
export const ENGLISH_NAMES: Record<string, EnglishName> = {
  elefant: { name: "elephant" },
  giraffe: { name: "giraffe" },
  schildkroete: { name: "turtle" },
  schnecke: { name: "snail" },
  schmetterling: { name: "butterfly" },
  fisch: { name: "fish" },
  hahn: { name: "rooster" },
  ente: { name: "duck" },
  hase: { name: "bunny" },
  katze: { name: "kitty" },
  hund: { name: "puppy" },
  pferd: { name: "horse" },
  kuh: { name: "cow" },
  schwein: { name: "pig" },
  schaf: { name: "sheep" },
  igel: { name: "hedgehog" },
  krebs: { name: "crab" },
  tintenfisch: { name: "octopus" },
  dino: { name: "dinosaur" },
  krokodil: { name: "crocodile" },
  eichhoernchen: { name: "squirrel" },
  eule: { name: "owl" },
  biene: { name: "bee" },
  wal: { name: "whale" },
  flamingo: { name: "flamingo" },
  pinguin: { name: "penguin" },
  maus: { name: "mouse" },

  auto: { name: "car" },
  fahrrad: { name: "bike" },
  lok: { name: "train" },
  flugzeug: { name: "airplane" },
  hubschrauber: { name: "helicopter" },
  segelboot: { name: "sailboat" },
  rakete: { name: "rocket" },
  traktor: { name: "tractor" },
  roller: { name: "scooter" },
  feuerwehr: { name: "fire truck" },
  motorrad: { name: "motorcycle" },

  banane: { name: "banana" },
  apfel: { name: "apple" },
  birne: { name: "pear" },
  moehre: { name: "carrot" },
  erdbeere: { name: "strawberry" },
  melone: { name: "watermelon" },
  kaese: { name: "cheese" },
  brezel: { name: "pretzel" },
  eis: { name: "ice cream" },
  pilz: { name: "mushroom" },
  mais: { name: "corn" },
  brokkoli: { name: "broccoli" },
  pizza: { name: "pizza" },

  stern: { name: "star" },
  schirm: { name: "umbrella" },
  schluessel: { name: "key" },
  ballon: { name: "balloon" },
  mond: { name: "moon" },
  baum: { name: "tree" },
  haus: { name: "house" },
  schere: { name: "scissors", many: true },
  gitarre: { name: "guitar" },
  schuh: { name: "sneaker" },
  teddy: { name: "teddy bear" },
  drachen: { name: "kite" },
  glocke: { name: "bell" },
  herz: { name: "heart" },
};

const capital = (text: string) => text.charAt(0).toLocaleUpperCase("en-US") + text.slice(1);

/** The English texts; a picture without its English name gets the whole German sentence. */
export function englishTexts(german: ShadowTexts): ShadowTexts {
  const about =
    (sentence: (en: EnglishName) => string, fallback: (item: ShadowItem) => string) =>
    (item: ShadowItem): string => {
      const en = ENGLISH_NAMES[item.id];
      return en ? sentence(en) : fallback(item);
    };
  return {
    name: about((en) => capital(en.name), german.name),
    search: about((en) => (en.many ? `The ${en.name} are looking for their shadow.` : `The ${en.name} is looking for its shadow.`), german.search),
    found: about((en) => `Hooray! There's the ${en.name}${en.many ? "'" : "'s"} shadow!`, german.found),
    thatIs: about((en) => `${en.many ? "Those are" : "That's"} the ${en.name}.`, german.thatIs),
    peek: "Who's peeking out?",
    there: about((en) => `${en.many ? "There are" : "There's"} the ${en.name}!`, german.there),
    shadow: (n) => `Shadow ${n}`,
    stars: (n) => `${n} done`,
  };
}

/** English, for the table of languages in content.ts. */
export const ENGLISH: ShadowTranslation = { names: ENGLISH_NAMES, texts: englishTexts };
