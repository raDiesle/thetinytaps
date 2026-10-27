import type { Localized } from "@/lib/language";
import type { SceneTrigger } from "./settings";
import type { SceneItem, SceneTrait } from "./types";

// Every sentence the engine builds itself, in each language: prompts, praise,
// the party, find and trait questions, vehicles driving between pictures. The
// items' own names and sentences come from the scene (localize.ts). A language
// missing here is German; add a new German line in every language next to it.

/** "der Bagger" → "Der Bagger", "экскаватор" → "Экскаватор". */
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** How a trait question is asked and a right answer praised. */
export interface TraitWords {
  question: string;
  /** "Der Bus ist rot!" */
  praise: (item: SceneItem) => string;
  /** Colours: said for an item with only a part in that colour ("Da ist Rot!"); without it, `praise`. */
  part?: string;
  emoji: string;
}

/** How a picture is named in sentences: "fährt in die Stadt", "kommt aus der Stadt", "ist wieder in der Stadt". */
export interface PlaceWords {
  to: string;
  from: string;
  at: string;
}

/** The engine's words in one language. */
export interface ScenePhrases {
  /** Shown until the first tap, by trigger. */
  prompts: Record<SceneTrigger, string>;
  /** The same in colour mode. */
  colourPrompts: Record<SceneTrigger, string>;
  /** Said before the praise of a right answer, one at random. */
  praise: string[];
  /** The party when everything is coloured / discovered. */
  allColoured: string;
  allFound: string;
  /** Bedtime picture: all are asleep. */
  goodNight: string;
  /** A surprise peeks out of a hideout: "Guck-guck! Da ist ja eine Katze!" */
  peekaboo: (found: string) => string;
  /** Find mode: "Wo ist der Bagger?" */
  whereIs: (item: SceneItem) => string;
  /** Find mode, right answer: "Das ist der Bagger!" */
  hereIs: (item: SceneItem) => string;
  /** A wrong tap while something is looked for: what it is, then the question again. */
  thatIs: (item: SceneItem, question: string) => string;
  /** Questions mode, by trait. */
  traits: Record<SceneTrait, TraitWords>;
  /** The pictures vehicles drive between, by scene id (see roads.ts). */
  places: Record<string, PlaceWords>;
  /** A vehicle comes back to its own picture. */
  backHome: (item: SceneItem, place: PlaceWords) => string;
  /** A vehicle visits from another picture. */
  comesFrom: (item: SceneItem, place: PlaceWords) => string;
  /** A vehicle drives off into another picture. */
  drivesTo: (item: SceneItem, place: PlaceWords) => string;
  /** Label of the sign that follows a vehicle. */
  follow: (item: SceneItem) => string;
  /** "2 von 3", for the progress dots and the goal counter. */
  of: (count: number, total: number) => string;
  /** Label of the stars: "4 gefunden". */
  foundCount: (count: number) => string;
  /** Label of the goal counter: "5 von 20 entdeckt". */
  discoveredCount: (count: number, total: number) => string;
  /** Label of the space bar on screen. */
  spaceBar: string;
  /** Shown on a phone held upright. */
  rotate: string;
}

const de: ScenePhrases = {
  prompts: { tap: "Tipp etwas an! 👆", hover: "Zeig auf etwas! 👆", keys: "Drück eine Taste! ⌨️" },
  colourPrompts: {
    tap: "Tipp etwas an – es wird bunt! 🖍️",
    hover: "Zeig auf etwas – es wird bunt! 🖍️",
    keys: "Drück eine Taste – es wird bunt! 🖍️",
  },
  praise: ["Super!", "Toll!", "Prima!", "Ja, genau!", "Richtig!"],
  allColoured: "Hurra! Das ganze Bild ist bunt!",
  allFound: "Hurra! Du hast alles entdeckt!",
  goodNight: "Gute Nacht! Alle schlafen jetzt.",
  peekaboo: (found) => `Guck-guck! ${found}`,
  whereIs: (item) => `Wo ${item.plural ? "sind" : "ist"} ${item.name}?`,
  hereIs: (item) => `Das ${item.plural ? "sind" : "ist"} ${item.name}!`,
  thatIs: (item, question) => `Das ${item.plural ? "sind" : "ist"} ${item.name}. ${question}`,
  traits: {
    red: deTrait("Was ist rot?", "ist rot", "sind rot", "Da ist Rot!", "🔴"),
    yellow: deTrait("Was ist gelb?", "ist gelb", "sind gelb", "Da ist Gelb!", "🟡"),
    blue: deTrait("Was ist blau?", "ist blau", "sind blau", "Da ist Blau!", "🔵"),
    green: deTrait("Was ist grün?", "ist grün", "sind grün", "Da ist Grün!", "🟢"),
    flies: deTrait("Wer kann fliegen?", "kann fliegen", "können fliegen", undefined, "🪽"),
    big: deTrait("Was ist ganz groß?", "ist ganz groß", "sind ganz groß", undefined, "🐘"),
    small: deTrait("Was ist ganz klein?", "ist ganz klein", "sind ganz klein", undefined, "🐜"),
    animal: deTrait("Wo ist ein Tier?", "ist ein Tier", "sind Tiere", undefined, "🐾"),
    wheels: deTrait("Was hat Räder?", "hat Räder", "haben Räder", undefined, "🛞"),
  },
  places: {
    stadt: { to: "in die Stadt", from: "aus der Stadt", at: "in der Stadt" },
    feuerwache: { to: "zur Feuerwache", from: "von der Feuerwache", at: "an der Feuerwache" },
    bauernhof: { to: "auf den Bauernhof", from: "vom Bauernhof", at: "auf dem Bauernhof" },
    wald: { to: "in den Wald", from: "aus dem Wald", at: "im Wald" },
    zoo: { to: "in den Zoo", from: "aus dem Zoo", at: "im Zoo" },
    baustelle: { to: "zur Baustelle", from: "von der Baustelle", at: "auf der Baustelle" },
  },
  backHome: (item, place) => `${capitalize(item.name)} ${item.plural ? "sind" : "ist"} wieder ${place.at}!`,
  comesFrom: (item, place) => `${capitalize(item.name)} ${item.plural ? "kommen" : "kommt"} ${place.from}!`,
  drivesTo: (item, place) => `Tschüss! ${capitalize(item.name)} ${item.plural ? "fahren" : "fährt"} ${place.to}.`,
  follow: (item) => `${capitalize(item.name)} hinterher`,
  of: (count, total) => `${count} von ${total}`,
  foundCount: (count) => `${count} gefunden`,
  discoveredCount: (count, total) => `${count} von ${total} entdeckt`,
  spaceBar: "Leertaste",
  rotate: "Quer halten – dann wird das Bild groß",
};

/** A German trait: the question, the answer after the name for one thing and for several, and for colours the praise of a part. */
function deTrait(question: string, answer: string, pluralAnswer: string, part: string | undefined, emoji: string): TraitWords {
  return { question, emoji, part, praise: (item) => `${capitalize(item.name)} ${item.plural ? pluralAnswer : answer}!` };
}

/** The word that agrees with the item's name: masculine, feminine, neuter or plural (a name without gender counts as masculine). */
const agree = (item: SceneItem, m: string, f: string, n: string, pl: string) => (item.plural ? pl : item.gender === "f" ? f : item.gender === "n" ? n : m);

/** A Russian colour or size trait: the question with the neuter adjective ("Что красное?"), the praise agreeing with the name. */
function ruAdjective(m: string, f: string, n: string, pl: string, emoji: string, very = false): TraitWords {
  const prefix = very ? "очень " : "";
  return { question: `Что ${prefix}${n}?`, emoji, praise: (item) => `${capitalize(item.name)} ${prefix}${agree(item, m, f, n, pl)}!` };
}

const ru: ScenePhrases = {
  prompts: { tap: "Нажми на что-нибудь! 👆", hover: "Покажи на что-нибудь! 👆", keys: "Нажми на клавишу! ⌨️" },
  colourPrompts: {
    tap: "Нажми на что-нибудь – и оно станет цветным! 🖍️",
    hover: "Покажи на что-нибудь – и оно станет цветным! 🖍️",
    keys: "Нажми на клавишу – и что-то станет цветным! 🖍️",
  },
  praise: ["Молодец!", "Здорово!", "Супер!", "Да, точно!", "Правильно!"],
  allColoured: "Ура! Вся картинка цветная!",
  allFound: "Ура! Всё-всё найдено!",
  goodNight: "Спокойной ночи! Все уже спят.",
  peekaboo: (found) => `Ку-ку! ${found}`,
  whereIs: (item) => `Где ${item.name}?`,
  hereIs: (item) => `Вот ${item.name}!`,
  thatIs: (item, question) => `Это ${item.name}. ${question}`,
  traits: {
    red: ruAdjective("красный", "красная", "красное", "красные", "🔴"),
    yellow: ruAdjective("жёлтый", "жёлтая", "жёлтое", "жёлтые", "🟡"),
    blue: ruAdjective("синий", "синяя", "синее", "синие", "🔵"),
    green: ruAdjective("зелёный", "зелёная", "зелёное", "зелёные", "🟢"),
    flies: { question: "Кто летает?", emoji: "🪽", praise: (item) => `${capitalize(item.name)} ${item.plural ? "летают" : "летает"}!` },
    big: ruAdjective("большой", "большая", "большое", "большие", "🐘", true),
    small: ruAdjective("маленький", "маленькая", "маленькое", "маленькие", "🐜", true),
    animal: { question: "Где животное?", emoji: "🐾", praise: (item) => `${capitalize(item.name)} – это ${item.plural ? "животные" : "животное"}!` },
    wheels: { question: "Что на колёсах?", emoji: "🛞", praise: (item) => `${capitalize(item.name)} на колёсах!` },
  },
  places: {
    stadt: { to: "в город", from: "из города", at: "в городе" },
    feuerwache: { to: "в пожарную часть", from: "из пожарной части", at: "в пожарной части" },
    bauernhof: { to: "на ферму", from: "с фермы", at: "на ферме" },
    wald: { to: "в лес", from: "из леса", at: "в лесу" },
    zoo: { to: "в зоопарк", from: "из зоопарка", at: "в зоопарке" },
    baustelle: { to: "на стройку", from: "со стройки", at: "на стройке" },
  },
  backHome: (item, place) => `${capitalize(item.name)} снова ${place.at}!`,
  comesFrom: (item, place) => `${capitalize(item.name)} ${item.plural ? "приезжают" : "приезжает"} ${place.from}!`,
  drivesTo: (item, place) => `Пока-пока! ${capitalize(item.name)} ${item.plural ? "едут" : "едет"} ${place.to}.`,
  follow: (item) => `Поехать за: ${item.name}`,
  of: (count, total) => `${count} из ${total}`,
  foundCount: (count) => `Найдено: ${count}`,
  discoveredCount: (count, total) => `Найдено ${count} из ${total}`,
  spaceBar: "Пробел",
  rotate: "Поверни телефон – и картинка станет большой",
};

/** The engine's words by language; pick them with `pick(SCENE_PHRASES, language.id)`. */
export const SCENE_PHRASES: Localized<ScenePhrases> = { de, ru };
