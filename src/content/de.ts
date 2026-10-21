import type { ActionWord, ColorWord, Countable, LanguagePack, LetterEntry, ThemeId, WordEntry } from "./types";

const w = (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image });
const themed =
  (theme: ThemeId) =>
  (word: string, emoji: string): WordEntry => ({ word, emoji, theme });
const tier = themed("animals");
const fahrzeug = themed("vehicles");
const essen = themed("food");

const letter = (upper: string, spoken: string, words: WordEntry[]): LetterEntry => ({
  upper,
  lower: upper.toLocaleLowerCase("de-DE"),
  spoken,
  words,
});

// Words are picked so the first sound matches the letter (e.g. no "Sch…" for S).
// The first word of each letter is the one shown first, so it should be the best-known.
const letters: LetterEntry[] = [
  letter("A", "A", [tier("Affe", "🐒"), essen("Apfel", "🍎"), fahrzeug("Auto", "🚗"), tier("Ameise", "🐜"), essen("Ananas", "🍍")]),
  letter("B", "Be", [tier("Bär", "🐻"), w("Ball", "⚽"), essen("Banane", "🍌"), fahrzeug("Bus", "🚌"), tier("Biene", "🐝"), fahrzeug("Boot", "🚤"), essen("Brot", "🍞")]),
  letter("C", "Ze", [w("Clown", "🤡"), w("Computer", "💻"), essen("Croissant", "🥐"), w("Cowboy", "🤠")]),
  letter("D", "De", [tier("Dino", "🦕"), tier("Delfin", "🐬"), essen("Donut", "🍩"), tier("Drache", "🐉")]),
  letter("E", "E", [tier("Elefant", "🐘"), tier("Ente", "🦆"), essen("Eis", "🍦"), essen("Erdbeere", "🍓"), fahrzeug("Eisenbahn", "🚂"), tier("Eichhörnchen", "🐿️"), essen("Ei", "🥚")]),
  letter("F", "Eff", [tier("Fisch", "🐟"), fahrzeug("Feuerwehr", "🚒"), tier("Frosch", "🐸"), fahrzeug("Flugzeug", "✈️"), tier("Fuchs", "🦊"), fahrzeug("Fahrrad", "🚲")]),
  letter("G", "Ge", [tier("Giraffe", "🦒"), w("Geschenk", "🎁"), essen("Gurke", "🥒"), tier("Gorilla", "🦍"), w("Gitarre", "🎸"), fahrzeug("Gondel", "🚠")]),
  letter("H", "Ha", [tier("Hund", "🐶"), w("Haus", "🏠"), fahrzeug("Hubschrauber", "🚁"), tier("Hase", "🐰"), essen("Honig", "🍯"), tier("Huhn", "🐔")]),
  letter("I", "I", [tier("Igel", "🦔"), w("Insel", "🏝️")]),
  letter("J", "Jott", [w("Jacke", "🧥"), w("Jeans", "👖")]),
  letter("K", "Ka", [tier("Katze", "🐱"), essen("Keks", "🍪"), fahrzeug("Kran", "🏗️"), tier("Kuh", "🐮"), essen("Käse", "🧀"), fahrzeug("Krankenwagen", "🚑"), w("Krone", "👑"), essen("Kuchen", "🍰"), tier("Käfer", "🪲"), essen("Kirsche", "🍒")]),
  letter("L", "Ell", [tier("Löwe", "🦁"), fahrzeug("Lokomotive", "🚂"), essen("Lutscher", "🍭"), tier("Lama", "🦙"), fahrzeug("Laster", "🚚"), w("Leiter", "🪜")]),
  letter("M", "Emm", [tier("Maus", "🐭"), w("Mond", "🌙"), essen("Möhre", "🥕"), fahrzeug("Motorrad", "🏍️"), tier("Marienkäfer", "🐞"), essen("Milch", "🥛")]),
  letter("N", "Enn", [tier("Nashorn", "🦏"), essen("Nudeln", "🍝"), w("Nase", "👃")]),
  letter("O", "O", [w("Oma", "👵"), tier("Oktopus", "🐙"), essen("Orange", "🍊"), w("Opa", "👴"), w("Ohr", "👂")]),
  letter("P", "Pe", [tier("Pinguin", "🐧"), essen("Pizza", "🍕"), fahrzeug("Polizei", "🚓"), tier("Pferd", "🐴"), tier("Panda", "🐼"), w("Pilz", "🍄")]),
  letter("Q", "Ku", [tier("Qualle", "🪼")]),
  letter("R", "Err", [fahrzeug("Rakete", "🚀"), w("Regenbogen", "🌈"), tier("Raupe", "🐛"), w("Roboter", "🤖"), fahrzeug("Roller", "🛴"), tier("Reh", "🦌")]),
  letter("S", "Ess", [w("Sonne", "☀️"), tier("Seehund", "🦭"), w("Socke", "🧦"), fahrzeug("Segelboot", "⛵"), essen("Salat", "🥗"), w("Sofa", "🛋️"), essen("Suppe", "🍲")]),
  letter("T", "Te", [tier("Tiger", "🐯"), fahrzeug("Traktor", "🚜"), essen("Tomate", "🍅"), w("Teddy", "🧸"), fahrzeug("Taxi", "🚕"), essen("Torte", "🎂"), w("Trommel", "🥁"), tier("Truthahn", "🦃")]),
  letter("U", "U", [w("Uhr", "⏰"), fahrzeug("Ufo", "🛸"), tier("Uhu", "🦉"), fahrzeug("U-Bahn", "🚇"), w("Unterhose", "🩲")]),
  letter("V", "Fau", [tier("Vogel", "🐦"), w("Vulkan", "🌋"), w("Violine", "🎻")]),
  letter("W", "We", [tier("Wal", "🐳"), essen("Wassermelone", "🍉"), w("Wolke", "☁️"), tier("Wolf", "🐺"), fahrzeug("Wohnmobil", "🚐"), essen("Wurst", "🌭"), tier("Wurm", "🪱")]),
  letter("X", "Ix", [w("Xylophon", "🎶", "images/xylophon.svg")]),
  letter("Y", "Üpsilon", [w("Yo-Yo", "🪀"), w("Yoga", "🧘")]),
  letter("Z", "Zett", [tier("Zebra", "🦓"), fahrzeug("Zug", "🚆"), essen("Zitrone", "🍋"), tier("Ziege", "🐐"), w("Zahn", "🦷")]),
  letter("Ä", "Ä", [essen("Äpfel", "🍏"), tier("Äffchen", "🐒")]),
  letter("Ö", "Ö", [w("Öl", "🫒")]),
  letter("Ü", "Ü", [w("Überraschung", "🎉")]),
];

const countables: Countable[] = [
  { emoji: "🦆", singular: "Ente", plural: "Enten", theme: "animals" },
  { emoji: "🐞", singular: "Marienkäfer", plural: "Marienkäfer", theme: "animals" },
  { emoji: "🐟", singular: "Fisch", plural: "Fische", theme: "animals" },
  { emoji: "🐥", singular: "Küken", plural: "Küken", theme: "animals" },
  { emoji: "🐝", singular: "Biene", plural: "Bienen", theme: "animals" },
  { emoji: "🐸", singular: "Frosch", plural: "Frösche", theme: "animals" },
  { emoji: "🚗", singular: "Auto", plural: "Autos", theme: "vehicles" },
  { emoji: "🚌", singular: "Bus", plural: "Busse", theme: "vehicles" },
  { emoji: "🚜", singular: "Traktor", plural: "Traktoren", theme: "vehicles" },
  { emoji: "🚲", singular: "Fahrrad", plural: "Fahrräder", theme: "vehicles" },
  { emoji: "✈️", singular: "Flugzeug", plural: "Flugzeuge", theme: "vehicles" },
  { emoji: "🍎", singular: "Apfel", plural: "Äpfel", theme: "food" },
  { emoji: "🍓", singular: "Erdbeere", plural: "Erdbeeren", theme: "food" },
  { emoji: "🍌", singular: "Banane", plural: "Bananen", theme: "food" },
  { emoji: "🥕", singular: "Möhre", plural: "Möhren", theme: "food" },
  { emoji: "🍪", singular: "Keks", plural: "Kekse", theme: "food" },
  { emoji: "⭐", singular: "Stern", plural: "Sterne" },
  { emoji: "🎈", singular: "Ballon", plural: "Ballons" },
  { emoji: "🌼", singular: "Blume", plural: "Blumen" },
];

const colors: ColorWord[] = [
  { word: "Rot", emoji: "🔴", color: "#ff4d5e", things: ["🍎", "🍓", "🍒", "🚒", "🐞", "🌹", "🍅", "❤️"] },
  { word: "Blau", emoji: "🔵", color: "#3a86ff", things: ["🐳", "🫐", "🚙", "🦋", "💙", "🧢", "🐋", "💧"] },
  { word: "Gelb", emoji: "🟡", color: "#ffd60a", things: ["🍌", "🌻", "🐥", "⭐", "🍋", "🚕", "🧀", "🌙"] },
  { word: "Grün", emoji: "🟢", color: "#38b000", things: ["🐸", "🥒", "🥦", "🍀", "🦖", "🌲", "🐢", "🍏"] },
  { word: "Lila", emoji: "🟣", color: "#9d4edd", things: ["🍇", "🍆", "🔮", "☂️", "💜", "🪻", "👾", "🦄"] },
  { word: "Rosa", emoji: "🩷", color: "#ff8fc7", things: ["🐷", "🌸", "🦩", "🎀", "🍬", "🩰", "🐙", "💗"] },
  { word: "Orange", emoji: "🟠", color: "#ff8c1a", things: ["🍊", "🥕", "🦊", "🎃", "🏀", "🦁", "🐯", "🧡"] },
];

// Short commands ("Hüpf!") the child can do along with the figure.
const actions: ActionWord[] = [
  { word: "Hüpf", emoji: "🐸", action: "hop" },
  { word: "Lauf", emoji: "🏃", action: "run" },
  { word: "Schlaf", emoji: "😴", action: "sleep" },
  { word: "Tanz", emoji: "💃", action: "dance" },
  { word: "Wink", emoji: "👋", action: "wave" },
  { word: "Dreh", emoji: "🐱", action: "spin" },
  { word: "Flieg", emoji: "🐦", action: "fly" },
  { word: "Schwimm", emoji: "🐟", action: "swim" },
  { word: "Klatsch", emoji: "👏", action: "clap" },
];

/** German nouns ending in -e here are feminine ("eine Ente"); the rest take "ein". */
const indefiniteArticle = (noun: string) => (noun.endsWith("e") ? "eine" : "ein");

export const de: LanguagePack = {
  speechLang: "de-DE",
  themes: [
    { id: "animals", label: "Tiere", emoji: "🐾" },
    { id: "vehicles", label: "Fahrzeuge", emoji: "🚗" },
    { id: "food", label: "Essen", emoji: "🍎" },
  ],
  letters,
  numberWords: ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun"],
  countables,
  zero: { emoji: "🪹", sentence: "Das Nest ist leer!" },
  letterSentence: (l, word) => `${l.spoken}, wie ${word.word}!`,
  findPrompt: (l) => `Wo ist das ${l.spoken}?`,
  keyboardRows: ["1234567890ß", "QWERTZUIOPÜ", "ASDFGHJKLÖÄ", "YXCVBNM"],
  countSentence: (n, thing) =>
    n === 1
      ? `${indefiniteArticle(thing.singular)} ${thing.singular}!`
      : `${de.numberWords[n]} ${thing.plural}!`,
  praise: ["Super!", "Toll!", "Prima!", "Juhu!", "Klasse!"],
  firstLetterPrompt: (word) => `${word.word}! Womit fängt ${word.word} an?`,
  colors,
  actions,
  joinIn: (word) => `${word.word} mit!`,
};
