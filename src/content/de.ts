import type { Countable, LanguagePack, LetterEntry, WordEntry } from "./types";

const w = (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image });

const letter = (upper: string, spoken: string, words: WordEntry[]): LetterEntry => ({
  upper,
  lower: upper.toLocaleLowerCase("de-DE"),
  spoken,
  words,
});

// Words are picked so the first sound matches the letter (e.g. no "Sch…" for S).
const letters: LetterEntry[] = [
  letter("A", "A", [w("Affe", "🐒"), w("Apfel", "🍎"), w("Auto", "🚗"), w("Ananas", "🍍")]),
  letter("B", "Be", [w("Bär", "🐻"), w("Ball", "⚽"), w("Banane", "🍌"), w("Bus", "🚌")]),
  letter("C", "Ze", [w("Clown", "🤡"), w("Computer", "💻"), w("Cowboy", "🤠")]),
  letter("D", "De", [w("Dino", "🦕"), w("Delfin", "🐬"), w("Drache", "🐉")]),
  letter("E", "E", [w("Elefant", "🐘"), w("Ente", "🦆"), w("Eis", "🍦"), w("Erdbeere", "🍓")]),
  letter("F", "Eff", [w("Fisch", "🐟"), w("Frosch", "🐸"), w("Feuerwehr", "🚒"), w("Flugzeug", "✈️")]),
  letter("G", "Ge", [w("Giraffe", "🦒"), w("Gurke", "🥒"), w("Geschenk", "🎁"), w("Gitarre", "🎸")]),
  letter("H", "Ha", [w("Hund", "🐶"), w("Haus", "🏠"), w("Hase", "🐰"), w("Hubschrauber", "🚁")]),
  letter("I", "I", [w("Igel", "🦔"), w("Insel", "🏝️")]),
  letter("J", "Jott", [w("Jacke", "🧥"), w("Jeans", "👖")]),
  letter("K", "Ka", [w("Katze", "🐱"), w("Kuh", "🐮"), w("Käse", "🧀"), w("Kuchen", "🍰"), w("Krone", "👑")]),
  letter("L", "Ell", [w("Löwe", "🦁"), w("Lama", "🦙"), w("Lokomotive", "🚂"), w("Lutscher", "🍭")]),
  letter("M", "Emm", [w("Maus", "🐭"), w("Mond", "🌙"), w("Möhre", "🥕"), w("Marienkäfer", "🐞")]),
  letter("N", "Enn", [w("Nashorn", "🦏"), w("Nudeln", "🍝"), w("Nase", "👃")]),
  letter("O", "O", [w("Oktopus", "🐙"), w("Orange", "🍊"), w("Oma", "👵"), w("Ohr", "👂")]),
  letter("P", "Pe", [w("Pinguin", "🐧"), w("Pferd", "🐴"), w("Pizza", "🍕"), w("Pilz", "🍄")]),
  letter("Q", "Ku", [w("Qualle", "🪼")]),
  letter("R", "Err", [w("Rakete", "🚀"), w("Regenbogen", "🌈"), w("Roboter", "🤖"), w("Raupe", "🐛")]),
  letter("S", "Ess", [w("Sonne", "☀️"), w("Socke", "🧦"), w("Seehund", "🦭"), w("Salat", "🥗")]),
  letter("T", "Te", [w("Tiger", "🐯"), w("Tomate", "🍅"), w("Traktor", "🚜"), w("Teddy", "🧸")]),
  letter("U", "U", [w("Uhr", "⏰"), w("Ufo", "🛸"), w("Uhu", "🦉"), w("Unterhose", "🩲")]),
  letter("V", "Fau", [w("Vogel", "🐦"), w("Vulkan", "🌋"), w("Violine", "🎻")]),
  letter("W", "We", [w("Wal", "🐳"), w("Wolf", "🐺"), w("Wolke", "☁️"), w("Wassermelone", "🍉")]),
  letter("X", "Ix", [w("Xylophon", "🎶", "images/xylophon.svg")]),
  letter("Y", "Üpsilon", [w("Yo-Yo", "🪀"), w("Yoga", "🧘")]),
  letter("Z", "Zett", [w("Zebra", "🦓"), w("Zug", "🚆"), w("Zitrone", "🍋"), w("Zahn", "🦷")]),
  letter("Ä", "Ä", [w("Äpfel", "🍏")]),
  letter("Ö", "Ö", [w("Öl", "🫒")]),
  letter("Ü", "Ü", [w("Überraschung", "🎉")]),
];

const countables: Countable[] = [
  { emoji: "🍎", singular: "Apfel", plural: "Äpfel" },
  { emoji: "🦆", singular: "Ente", plural: "Enten" },
  { emoji: "⭐", singular: "Stern", plural: "Sterne" },
  { emoji: "🎈", singular: "Ballon", plural: "Ballons" },
  { emoji: "🚗", singular: "Auto", plural: "Autos" },
  { emoji: "🐞", singular: "Marienkäfer", plural: "Marienkäfer" },
  { emoji: "🍓", singular: "Erdbeere", plural: "Erdbeeren" },
  { emoji: "🐟", singular: "Fisch", plural: "Fische" },
  { emoji: "🐥", singular: "Küken", plural: "Küken" },
  { emoji: "🌼", singular: "Blume", plural: "Blumen" },
];

/** German nouns ending in -e here are feminine ("eine Ente"); the rest take "ein". */
const indefiniteArticle = (noun: string) => (noun.endsWith("e") ? "eine" : "ein");

export const de: LanguagePack = {
  speechLang: "de-DE",
  letters,
  numberWords: ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"],
  countables,
  zero: { emoji: "🪹", sentence: "Null. Das Nest ist leer!" },
  letterSentence: (l, word) => `${l.spoken}, wie ${word.word}!`,
  countSentence: (n, thing) =>
    n === 1
      ? `${indefiniteArticle(thing.singular)} ${thing.singular}!`
      : `${de.numberWords[n]} ${thing.plural}!`,
};
