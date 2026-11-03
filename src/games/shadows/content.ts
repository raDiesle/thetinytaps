import {
  playBaa,
  playBark,
  playBells,
  playBlub,
  playBuzz,
  playCrow,
  playEngine,
  playHonk,
  playHoot,
  playLaunch,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playQuack,
  playRing,
  playRotor,
  playSiren,
  playSnap,
  playSqueak,
  playSquawk,
  playTrumpet,
  playTwinkle,
  playWhale,
  playWhistle,
  playWhoosh,
  recorded,
} from "@/lib/sfx";
import type { TargetLanguageId } from "@/content/targetLanguages";
import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";
import type { ShadowTheme } from "./settings";

// Pictures and German texts for "Schatten finden" (N-07); the other languages are in
// content.<lang>.ts (en, zh, hi, es, ar, ru), by the same ids. The pictures are emojis; their shadow is the
// same emoji in black, so each one needs a shape of its own – whole bodies
// rather than faces, nothing that is just a round blob.

export interface ShadowItem {
  id: string;
  emoji: string;
  name: string;
  /** With its article, "der Elefant". */
  the: string;
  theme: Exclude<ShadowTheme, "all">;
  sound?: () => void;
}

const item =
  (theme: ShadowItem["theme"]) =>
  (id: string, emoji: string, the: string, sound?: () => void): ShadowItem => ({
    id,
    emoji,
    name: the.slice(the.indexOf(" ") + 1),
    the,
    theme,
    sound,
  });
const tier = item("animals");
const fahrzeug = item("vehicles");
const essen = item("food");
const ding = item("things");

/** Every recording the pictures' sounds play, loaded when a round starts so even the first sound is the real one. */
export const SHADOW_RECORDINGS: string[] = [];
/** The recording `name` from src/lib/sounds/, `synth` until it is loaded. */
const real = (name: string, synth: () => void) => {
  SHADOW_RECORDINGS.push(name);
  return recorded(name, synth);
};

export const ITEMS: ShadowItem[] = [
  tier("elefant", "🐘", "der Elefant", real("trumpet", playTrumpet)),
  tier("giraffe", "🦒", "die Giraffe"),
  tier("schildkroete", "🐢", "die Schildkröte"),
  tier("schnecke", "🐌", "die Schnecke"),
  tier("schmetterling", "🦋", "der Schmetterling"),
  tier("fisch", "🐟", "der Fisch", real("bubbles", playBlub)),
  tier("hahn", "🐓", "der Hahn", real("crow", playCrow)),
  tier("ente", "🦆", "die Ente", real("quack", playQuack)),
  tier("hase", "🐇", "der Hase"),
  tier("katze", "🐈", "die Katze", real("meow", playMeow)),
  tier("hund", "🐕", "der Hund", real("bark", playBark)),
  tier("pferd", "🐎", "das Pferd", real("neigh", playNeigh)),
  tier("kuh", "🐄", "die Kuh", real("moo", playMoo)),
  tier("schwein", "🐖", "das Schwein", real("oink", playOink)),
  tier("schaf", "🐑", "das Schaf", real("baa", playBaa)),
  tier("igel", "🦔", "der Igel"),
  tier("krebs", "🦀", "der Krebs"),
  tier("tintenfisch", "🐙", "der Tintenfisch"),
  tier("dino", "🦕", "der Dino"),
  tier("krokodil", "🐊", "das Krokodil", playSnap),
  tier("eichhoernchen", "🐿️", "das Eichhörnchen"),
  tier("eule", "🦉", "die Eule", real("hoot", playHoot)),
  tier("biene", "🐝", "die Biene", real("buzz", playBuzz)),
  tier("wal", "🐳", "der Wal", real("whale", playWhale)),
  tier("flamingo", "🦩", "der Flamingo"),
  tier("pinguin", "🐧", "der Pinguin", real("penguin", playSquawk)),
  tier("maus", "🐁", "die Maus", real("mouse", playSqueak)),

  fahrzeug("auto", "🚗", "das Auto", real("honk", playHonk)),
  fahrzeug("fahrrad", "🚲", "das Fahrrad", real("ring", playRing)),
  fahrzeug("lok", "🚂", "die Lok", real("whistle", playWhistle)),
  fahrzeug("flugzeug", "✈️", "das Flugzeug", playWhoosh),
  fahrzeug("hubschrauber", "🚁", "der Hubschrauber", real("helicopter", playRotor)),
  fahrzeug("segelboot", "⛵", "das Segelboot"),
  fahrzeug("rakete", "🚀", "die Rakete", real("launch", playLaunch)),
  fahrzeug("traktor", "🚜", "der Traktor", real("engine", playEngine)),
  fahrzeug("roller", "🛴", "der Roller"),
  fahrzeug("feuerwehr", "🚒", "die Feuerwehr", real("siren", playSiren)),
  fahrzeug("motorrad", "🏍️", "das Motorrad", real("engine", playEngine)),

  essen("banane", "🍌", "die Banane"),
  essen("apfel", "🍎", "der Apfel"),
  essen("birne", "🍐", "die Birne"),
  essen("moehre", "🥕", "die Möhre"),
  essen("erdbeere", "🍓", "die Erdbeere"),
  essen("melone", "🍉", "die Melone"),
  essen("kaese", "🧀", "der Käse"),
  essen("brezel", "🥨", "die Brezel"),
  essen("eis", "🍦", "das Eis"),
  essen("pilz", "🍄", "der Pilz"),
  essen("mais", "🌽", "der Mais"),
  essen("brokkoli", "🥦", "der Brokkoli"),
  essen("pizza", "🍕", "die Pizza"),

  ding("stern", "⭐", "der Stern", playTwinkle),
  ding("schirm", "☂️", "der Schirm"),
  ding("schluessel", "🔑", "der Schlüssel"),
  ding("ballon", "🎈", "der Ballon"),
  ding("mond", "🌙", "der Mond"),
  ding("baum", "🌳", "der Baum"),
  ding("haus", "🏠", "das Haus"),
  ding("schere", "✂️", "die Schere"),
  ding("gitarre", "🎸", "die Gitarre"),
  ding("schuh", "👟", "der Schuh"),
  ding("teddy", "🧸", "der Teddy"),
  ding("drachen", "🪁", "der Drachen"),
  ding("glocke", "🔔", "die Glocke", real("bells", playBells)),
  ding("herz", "❤️", "das Herz"),
];

/** Where an animal hides in "Wer schaut da raus?" (X-04): behind a bush, or in the pond. */
export type Hideout = "bush" | "pond";

const IN_THE_POND = new Set(["ente", "fisch", "krebs", "tintenfisch", "krokodil", "wal"]);

export const PEEK_ITEMS = ITEMS.filter((i) => i.theme === "animals");

export const hideoutOf = (item: ShadowItem): Hideout => (IN_THE_POND.has(item.id) ? "pond" : "bush");

/**
 * Animals that look alike when only a part of them shows, for the harder steps of "Wer schaut da raus?": small furry
 * ones, big ones on four legs, birds, small crawling or flying ones – and the pond's own, since the pond already tells
 * that it is one of them. Every peeking animal is in exactly one (`shadows.test.ts`).
 */
export const PEEK_LOOKS: string[][] = [
  ["hase", "katze", "hund", "maus", "eichhoernchen", "igel"],
  ["pferd", "kuh", "schwein", "schaf", "elefant", "giraffe", "dino"],
  ["hahn", "eule", "flamingo", "pinguin"],
  ["schnecke", "schildkroete", "schmetterling", "biene"],
  [...IN_THE_POND],
];

/** Which of `PEEK_LOOKS` an animal belongs to (its index). */
export const lookOf = (item: ShadowItem) => PEEK_LOOKS.findIndex((ids) => ids.includes(item.id));

/**
 * Pictures whose black shadows can't be told apart on Apple's or Google's emojis (X-14): a pig, a sheep and a turtle
 * are the same round blob on Android, a cat and a dog the same on an iPhone. They are never dealt together, so exactly
 * one shadow fits. Measured by comparing every pair's outline in both fonts and looking at the closest ones (November
 * 2026, `research.ts`); a new picture is looked at next to its closest outlines and added here when it is one of them.
 */
export const SHADOW_LOOKALIKES: [string, string][] = [
  ["schwein", "schaf"],
  ["schwein", "schildkroete"],
  ["schaf", "schildkroete"],
  ["schnecke", "schildkroete"],
  ["katze", "hund"],
  ["hund", "elefant"],
  ["hund", "teddy"],
  ["eule", "teddy"],
  ["apfel", "erdbeere"],
  ["apfel", "birne"],
  ["birne", "erdbeere"],
  ["pilz", "baum"],
];

/**
 * Animals of "Wer schaut da raus?" whose peeking part looks the same (X-14): the cat's and the dog's tan tail and hind
 * leg, the grey of an elephant next to a cow's or a sheep's, the grey-white fur of a rabbit and a mouse and the brown
 * of a squirrel and a hedgehog through the gaps in the leaves. They are never offered together, so exactly one fits;
 * the rest of a `PEEK_LOOKS` group still makes the harder steps harder.
 */
export const PEEK_LOOKALIKES: [string, string][] = [
  ["katze", "hund"],
  ["hase", "maus"],
  ["eichhoernchen", "igel"],
  ["kuh", "elefant"],
  ["schaf", "elefant"],
];

/** Whether `a` and `b` are one of `pairs`, so they must not stand side by side to choose from. */
export const lookAlike = (pairs: [string, string][], a: ShadowItem, b: ShadowItem) =>
  pairs.some(([x, y]) => (x === a.id && y === b.id) || (x === b.id && y === a.id));

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "seinen" or "ihren" Schatten. */
const its = (item: ShadowItem) => (item.the.startsWith("die ") ? "ihren" : "seinen");

/** Everything the shadows and "Wer schaut da raus?" say or show, in one language. */
export interface ShadowTexts {
  /** The picture's name, under it and for screen readers: "Elefant". */
  name: (item: ShadowItem) => string;
  search: (item: ShadowItem) => string;
  found: (item: ShadowItem) => string;
  /** A wrong shadow shows who it belongs to. */
  thatIs: (item: ShadowItem) => string;
  peek: string;
  /** The animal has come out. */
  there: (item: ShadowItem) => string;
  /** For screen readers: the shadow at place `n` (from 1) while it is still black. */
  shadow: (n: number) => string;
}

const GERMAN_TEXTS: ShadowTexts = {
  name: (item) => item.name,
  search: (item) => `${capital(item.the)} sucht ${its(item)} Schatten.`,
  found: (item) => `Juhu! ${capital(item.the)} hat ${its(item)} Schatten gefunden.`,
  thatIs: (item) => `Das ist ${item.the}.`,
  peek: "Wer schaut da raus?",
  there: (item) => `Da ist ja ${item.the}!`,
  shadow: (n) => `Schatten ${n}`,
};

/** A language of the game besides German: the pictures' names by id and the sentences built from them with its grammar. */
export interface ShadowTranslation {
  /** Each picture's name by id, in whatever shape the language's grammar needs; one without an entry is said in German. */
  names: Record<string, unknown>;
  /**
   * All texts. Translations come only when asked for, so a picture may have no name yet: then the whole sentence
   * comes from `german` (and is read by the German voice), never a German word inside another language.
   */
  texts: (german: ShadowTexts) => ShadowTexts;
}

/** Every language besides German, by its id. */
export const SHADOW_TRANSLATIONS: Partial<Record<TargetLanguageId, ShadowTranslation>> = byLanguage((texts) => texts.shadows);

/** The texts by app language: `pick(SHADOW_TEXTS, language.id)`. */
export const SHADOW_TEXTS: Localized<ShadowTexts> = byLanguage((texts) => texts.shadows?.texts(GERMAN_TEXTS), GERMAN_TEXTS);
