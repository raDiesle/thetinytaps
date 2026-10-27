import { de } from "./de";
import { relabel } from "./translate";
import type { Countable, LanguagePack, LetterEntry, ThemeId, WordEntry } from "./types";

const w = (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image });
const themed =
  (theme: ThemeId) =>
  (word: string, emoji: string, image?: string): WordEntry => ({ word, emoji, image, theme });
const zwierze = themed("animals");
const pojazd = themed("vehicles");
const jedzenie = themed("food");
const cialo = themed("body");
const ubranie = themed("clothes");
const rodzina = themed("family");
const muzyka = themed("music");
const przyroda = themed("nature");
const swieto = themed("holidays");

const letter = (upper: string, spoken: string, words: WordEntry[]): LetterEntry => ({
  upper,
  lower: upper.toLocaleLowerCase("pl-PL"),
  spoken,
  words,
});

// Words are picked so the first sound matches the letter: no "Sz", "Cz", "Rz", "Dz" or "Ci"/"Si" (said ć/ś).
// Letters no word starts with (Ą, Ć, Ę, Ń, Ó, Ź, Y) and the foreign Q, V, X are left out.
const letters: LetterEntry[] = [
  letter("A", "A", [pojazd("Auto", "🚗"), jedzenie("Arbuz", "🍉"), jedzenie("Ananas", "🍍"), pojazd("Autobus", "🚌"), swieto("Anioł", "👼")]),
  letter("B", "Be", [
    jedzenie("Banan", "🍌"),
    swieto("Balon", "🎈"),
    zwierze("Biedronka", "🐞"),
    rodzina("Brat", "👦"),
    rodzina("Babcia", "👵"),
    muzyka("Bęben", "🥁"),
    ubranie("Buty", "👟"),
    swieto("Bałwan", "⛄"),
    muzyka("Banjo", "🪕"),
  ]),
  letter("C", "Ce", [jedzenie("Cytryna", "🍋"), jedzenie("Cebula", "🧅"), jedzenie("Cukierek", "🍬"), w("Cyrk", "🎪")]),
  letter("D", "De", [w("Dom", "🏠"), zwierze("Dinozaur", "🦕"), zwierze("Delfin", "🐬"), przyroda("Deszcz", "🌧️"), swieto("Dynia", "🎃"), cialo("Dłoń", "✋")]),
  letter("E", "E", [w("Ekran", "🖥️"), w("Elf", "🧝")]),
  letter("F", "Ef", [zwierze("Foka", "🦭"), zwierze("Flaming", "🦩"), muzyka("Flet", "🪈"), jedzenie("Frytki", "🍟"), muzyka("Fortepian", "🎹")]),
  letter("G", "Gie", [
    muzyka("Gitara", "🎸"),
    jedzenie("Gruszka", "🍐"),
    przyroda("Grzyb", "🍄"),
    zwierze("Goryl", "🦍"),
    przyroda("Gwiazda", "⭐"),
    zwierze("Gęś", "🪿"),
    jedzenie("Gofr", "🧇"),
  ]),
  letter("H", "Ha", [zwierze("Hipopotam", "🦛"), pojazd("Helikopter", "🚁"), jedzenie("Hamburger", "🍔"), jedzenie("Herbata", "🍵")]),
  letter("I", "I", [zwierze("Indyk", "🦃")]),
  letter("J", "Jot", [
    jedzenie("Jabłko", "🍎"),
    jedzenie("Jajko", "🥚"),
    zwierze("Jeż", "🦔"),
    zwierze("Jednorożec", "🦄"),
    jedzenie("Jagody", "🫐"),
    pojazd("Jacht", "⛵"),
  ]),
  letter("K", "Ka", [
    zwierze("Kot", "🐱"),
    zwierze("Koń", "🐴"),
    zwierze("Krowa", "🐮"),
    zwierze("Kaczka", "🦆"),
    zwierze("Kura", "🐔"),
    przyroda("Kwiat", "🌸"),
    ubranie("Kapelusz", "👒"),
    w("Kanapa", "🛋️"),
    zwierze("Kangur", "🦘"),
    zwierze("Krokodyl", "🐊"),
    przyroda("Księżyc", "🌙"),
    pojazd("Karetka", "🚑"),
    w("Korona", "👑"),
  ]),
  letter("L", "El", [
    zwierze("Lew", "🦁"),
    jedzenie("Lody", "🍦"),
    zwierze("Lis", "🦊"),
    jedzenie("Lizak", "🍭"),
    zwierze("Lama", "🦙"),
    pojazd("Lokomotywa", "🚂"),
    przyroda("Liść", "🍁"),
    w("Latawiec", "🪁"),
  ]),
  letter("Ł", "Eł", [pojazd("Łódka", "🚤"), w("Łyżka", "🥄"), zwierze("Łabędź", "🦢"), zwierze("Łoś", "🫎"), w("Łóżko", "🛏️")]),
  letter("M", "Em", [
    rodzina("Mama", "👩"),
    w("Miś", "🧸"),
    zwierze("Mysz", "🐭"),
    zwierze("Małpa", "🐒"),
    jedzenie("Marchewka", "🥕"),
    jedzenie("Mleko", "🥛"),
    zwierze("Motyl", "🦋"),
    pojazd("Motor", "🏍️"),
    przyroda("Morze", "🌊"),
    muzyka("Mikrofon", "🎤"),
  ]),
  letter("N", "En", [cialo("Nos", "👃"), cialo("Noga", "🦵"), zwierze("Nosorożec", "🦏"), muzyka("Nuty", "🎵"), zwierze("Niedźwiedź", "🐻")]),
  letter("O", "O", [
    cialo("Oko", "👁️"),
    jedzenie("Ogórek", "🥒"),
    zwierze("Owca", "🐑"),
    zwierze("Ośmiornica", "🐙"),
    w("Okulary", "👓"),
    zwierze("Osioł", "🫏"),
    przyroda("Ogień", "🔥"),
    zwierze("Orzeł", "🦅"),
  ]),
  letter("P", "Pe", [
    zwierze("Pies", "🐶"),
    zwierze("Pingwin", "🐧"),
    jedzenie("Pizza", "🍕"),
    jedzenie("Pomidor", "🍅"),
    zwierze("Panda", "🐼"),
    pojazd("Pociąg", "🚆"),
    swieto("Prezent", "🎁"),
    zwierze("Ptak", "🐦"),
    jedzenie("Pomarańcza", "🍊"),
    pojazd("Policja", "🚓"),
    w("Parasol", "☂️"),
    w("Piłka", "⚽"),
  ]),
  letter("R", "Er", [
    pojazd("Rakieta", "🚀"),
    w("Robot", "🤖"),
    zwierze("Ryba", "🐟"),
    pojazd("Rower", "🚲"),
    przyroda("Róża", "🌹"),
    zwierze("Rekin", "🦈"),
    muzyka("Radio", "📻"),
    cialo("Ręka", "💪"),
  ]),
  letter("S", "Es", [
    przyroda("Słońce", "☀️"),
    zwierze("Słoń", "🐘"),
    pojazd("Samolot", "✈️"),
    jedzenie("Ser", "🧀"),
    zwierze("Sowa", "🦉"),
    ubranie("Skarpetka", "🧦"),
    muzyka("Saksofon", "🎷"),
    cialo("Serce", "❤️"),
    pojazd("Statek", "🚢"),
  ]),
  letter("Ś", "Eś", [zwierze("Ślimak", "🐌"), przyroda("Śnieg", "❄️"), zwierze("Świnia", "🐷"), swieto("Świeczka", "🕯️")]),
  letter("T", "Te", [
    zwierze("Tygrys", "🐯"),
    pojazd("Traktor", "🚜"),
    rodzina("Tata", "👨"),
    pojazd("Taksówka", "🚕"),
    jedzenie("Tort", "🎂"),
    muzyka("Trąbka", "🎺"),
    przyroda("Tulipan", "🌷"),
    jedzenie("Truskawka", "🍓"),
    przyroda("Tęcza", "🌈"),
  ]),
  letter("U", "U", [cialo("Ucho", "👂"), pojazd("Ufo", "🛸")]),
  letter("W", "Wu", [
    zwierze("Wąż", "🐍"),
    zwierze("Wieloryb", "🐳"),
    zwierze("Wiewiórka", "🐿️"),
    zwierze("Wilk", "🐺"),
    przyroda("Woda", "💧"),
    przyroda("Wulkan", "🌋"),
    jedzenie("Winogrona", "🍇"),
  ]),
  letter("Z", "Zet", [zwierze("Zebra", "🦓"), w("Zegar", "⏰"), w("Zamek", "🏰"), cialo("Ząb", "🦷"), zwierze("Zając", "🐰")]),
  letter("Ż", "Żet", [zwierze("Żaba", "🐸"), zwierze("Żółw", "🐢"), zwierze("Żyrafa", "🦒"), pojazd("Żaglówka", "⛵"), w("Żarówka", "💡")]),
];

/** Polish counting needs the gender (jeden / jedna / jedno, dwa / dwie) and a third form from five on ("pięć kaczek"). */
interface PolishCountable extends Countable {
  gender: "m" | "f" | "n";
  /** The form after 5–9: "kaczek". `plural` is the one after 2–4: "kaczki". */
  many: string;
}

const thing = (emoji: string, gender: PolishCountable["gender"], singular: string, plural: string, many: string, theme?: ThemeId): PolishCountable => ({
  emoji,
  gender,
  singular,
  plural,
  many,
  theme,
});

// No people: "dwoje dzieci" counts them differently again.
const countables: PolishCountable[] = [
  thing("🦆", "f", "kaczka", "kaczki", "kaczek", "animals"),
  thing("🐞", "f", "biedronka", "biedronki", "biedronek", "animals"),
  thing("🐟", "f", "ryba", "ryby", "ryb", "animals"),
  thing("🐝", "f", "pszczoła", "pszczoły", "pszczół", "animals"),
  thing("🐸", "f", "żaba", "żaby", "żab", "animals"),
  thing("🚗", "n", "auto", "auta", "aut", "vehicles"),
  thing("🚌", "m", "autobus", "autobusy", "autobusów", "vehicles"),
  thing("🚜", "m", "traktor", "traktory", "traktorów", "vehicles"),
  thing("🚲", "m", "rower", "rowery", "rowerów", "vehicles"),
  thing("✈️", "m", "samolot", "samoloty", "samolotów", "vehicles"),
  thing("🍎", "n", "jabłko", "jabłka", "jabłek", "food"),
  thing("🍓", "f", "truskawka", "truskawki", "truskawek", "food"),
  thing("🍌", "m", "banan", "banany", "bananów", "food"),
  thing("🥕", "f", "marchewka", "marchewki", "marchewek", "food"),
  thing("🍪", "n", "ciastko", "ciastka", "ciastek", "food"),
  thing("🦷", "m", "ząb", "zęby", "zębów", "body"),
  thing("👂", "n", "ucho", "uszy", "uszu", "body"),
  thing("🦶", "f", "stopa", "stopy", "stóp", "body"),
  thing("🦴", "f", "kość", "kości", "kości", "body"),
  thing("🧦", "f", "skarpetka", "skarpetki", "skarpetek", "clothes"),
  thing("🧢", "f", "czapka", "czapki", "czapek", "clothes"),
  thing("👕", "f", "koszulka", "koszulki", "koszulek", "clothes"),
  thing("🧤", "f", "rękawiczka", "rękawiczki", "rękawiczek", "clothes"),
  thing("🎵", "f", "nuta", "nuty", "nut", "music"),
  thing("🎸", "f", "gitara", "gitary", "gitar", "music"),
  thing("🔔", "m", "dzwonek", "dzwonki", "dzwonków", "music"),
  thing("🎺", "f", "trąbka", "trąbki", "trąbek", "music"),
  thing("🌳", "n", "drzewo", "drzewa", "drzew", "nature"),
  thing("🍄", "m", "grzyb", "grzyby", "grzybów", "nature"),
  thing("🌷", "m", "tulipan", "tulipany", "tulipanów", "nature"),
  thing("🌼", "m", "kwiatek", "kwiatki", "kwiatków", "nature"),
  thing("🎈", "m", "balon", "balony", "balonów", "holidays"),
  thing("🎁", "m", "prezent", "prezenty", "prezentów", "holidays"),
  thing("🕯️", "f", "świeczka", "świeczki", "świeczek", "holidays"),
  thing("🥚", "f", "pisanka", "pisanki", "pisanek", "holidays"),
  thing("⭐", "f", "gwiazdka", "gwiazdki", "gwiazdek"),
];

const numberWords = ["zero", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"];
const ONE = { m: "jeden", f: "jedna", n: "jedno" };

/** "jedna kaczka", "dwie kaczki", "pięć kaczek" */
function countSentence(n: number, countable: Countable) {
  const item = countable as PolishCountable;
  if (n === 1) return `${ONE[item.gender]} ${item.singular}!`;
  if (n === 2) return `${item.gender === "f" ? "dwie" : "dwa"} ${item.plural}!`;
  return `${numberWords[n]} ${n <= 4 ? item.plural : item.many}!`;
}

export const pl: LanguagePack = {
  speechLang: "pl-PL",
  themes: [
    { id: "animals", label: "Zwierzęta", emoji: "🐾" },
    { id: "vehicles", label: "Pojazdy", emoji: "🚗" },
    { id: "food", label: "Jedzenie", emoji: "🍎" },
    { id: "body", label: "Ciało", emoji: "🖐️" },
    { id: "clothes", label: "Ubrania", emoji: "👕" },
    { id: "family", label: "Rodzina", emoji: "👪" },
    { id: "music", label: "Muzyka", emoji: "🎵" },
    { id: "nature", label: "Przyroda", emoji: "🌳" },
    { id: "holidays", label: "Święta", emoji: "🎄" },
  ],
  letters,
  numberWords,
  countables,
  zero: { emoji: "🪹", sentence: "Gniazdo jest puste!" },
  letterSentence: (l, word) => `${l.spoken}, jak ${word.word}!`,
  findPrompt: (l) => `Gdzie jest ${l.spoken}?`,
  // Polish keyboards are QWERTY; Ł, Ś and Ż are typed with AltGr.
  keyboardRows: ["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
  countSentence,
  praise: ["Super!", "Brawo!", "Świetnie!", "Hurra!", "Ekstra!"],
  firstLetterPrompt: (word) => `${word.word}! Od jakiej litery zaczyna się ${word.word}?`,
  colors: relabel(de.colors, {
    "🔴": "Czerwony",
    "🔵": "Niebieski",
    "🟡": "Żółty",
    "🟢": "Zielony",
    "🟣": "Fioletowy",
    "🩷": "Różowy",
    "🟠": "Pomarańczowy",
  }),
  actions: relabel(de.actions, {
    "🐸": "Skacz",
    "🏃": "Biegnij",
    "😴": "Śpij",
    "💃": "Tańcz",
    "👋": "Machaj",
    "🐱": "Kręć",
    "🐦": "Leć",
    "🐟": "Płyń",
    "👏": "Klaszcz",
  }),
  joinIn: (word) => `${word.word} ze mną!`,
  whistle: "Ciuf ciuf!",
};
