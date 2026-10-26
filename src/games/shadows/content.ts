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
  playTrumpet,
  playTwinkle,
  playWhale,
  playWhistle,
  playWhoosh,
} from "@/lib/sfx";
import type { Localized } from "@/lib/language";
import { RUSSIAN_TEXTS } from "./content.ru";
import type { ShadowTheme } from "./settings";

// Pictures and German texts for "Schatten finden" (N-07); the Russian ones are in
// content.ru.ts, by the same ids. The pictures are emojis; their shadow is the
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

export const ITEMS: ShadowItem[] = [
  tier("elefant", "🐘", "der Elefant", playTrumpet),
  tier("giraffe", "🦒", "die Giraffe"),
  tier("schildkroete", "🐢", "die Schildkröte"),
  tier("schnecke", "🐌", "die Schnecke"),
  tier("schmetterling", "🦋", "der Schmetterling"),
  tier("fisch", "🐟", "der Fisch", playBlub),
  tier("hahn", "🐓", "der Hahn", playCrow),
  tier("ente", "🦆", "die Ente", playQuack),
  tier("hase", "🐇", "der Hase"),
  tier("katze", "🐈", "die Katze", playMeow),
  tier("hund", "🐕", "der Hund", playBark),
  tier("pferd", "🐎", "das Pferd", playNeigh),
  tier("kuh", "🐄", "die Kuh", playMoo),
  tier("schwein", "🐖", "das Schwein", playOink),
  tier("schaf", "🐑", "das Schaf", playBaa),
  tier("igel", "🦔", "der Igel"),
  tier("krebs", "🦀", "der Krebs"),
  tier("tintenfisch", "🐙", "der Tintenfisch"),
  tier("dino", "🦕", "der Dino"),
  tier("krokodil", "🐊", "das Krokodil", playSnap),
  tier("eichhoernchen", "🐿️", "das Eichhörnchen"),
  tier("eule", "🦉", "die Eule", playHoot),
  tier("biene", "🐝", "die Biene", playBuzz),
  tier("wal", "🐳", "der Wal", playWhale),
  tier("flamingo", "🦩", "der Flamingo"),
  tier("pinguin", "🐧", "der Pinguin"),
  tier("maus", "🐁", "die Maus", playSqueak),

  fahrzeug("auto", "🚗", "das Auto", playHonk),
  fahrzeug("fahrrad", "🚲", "das Fahrrad", playRing),
  fahrzeug("lok", "🚂", "die Lok", playWhistle),
  fahrzeug("flugzeug", "✈️", "das Flugzeug", playWhoosh),
  fahrzeug("hubschrauber", "🚁", "der Hubschrauber", playRotor),
  fahrzeug("segelboot", "⛵", "das Segelboot"),
  fahrzeug("rakete", "🚀", "die Rakete", playLaunch),
  fahrzeug("traktor", "🚜", "der Traktor", playEngine),
  fahrzeug("roller", "🛴", "der Roller"),
  fahrzeug("feuerwehr", "🚒", "die Feuerwehr", playSiren),
  fahrzeug("motorrad", "🏍️", "das Motorrad", playEngine),

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
  ding("glocke", "🔔", "die Glocke", playBells),
  ding("herz", "❤️", "das Herz"),
];

/** Where an animal hides in "Wer schaut da raus?" (X-04): behind a bush, or in the pond. */
export type Hideout = "bush" | "pond";

const IN_THE_POND = new Set(["ente", "fisch", "krebs", "tintenfisch", "krokodil", "wal"]);

export const PEEK_ITEMS = ITEMS.filter((i) => i.theme === "animals");

export const hideoutOf = (item: ShadowItem): Hideout => (IN_THE_POND.has(item.id) ? "pond" : "bush");

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
  /** For screen readers: the stars for `n` found ones. */
  stars: (n: number) => string;
}

const GERMAN_TEXTS: ShadowTexts = {
  name: (item) => item.name,
  search: (item) => `${capital(item.the)} sucht ${its(item)} Schatten.`,
  found: (item) => `Juhu! ${capital(item.the)} hat ${its(item)} Schatten gefunden.`,
  thatIs: (item) => `Das ist ${item.the}.`,
  peek: "Wer schaut da raus?",
  there: (item) => `Da ist ja ${item.the}!`,
  shadow: (n) => `Schatten ${n}`,
  stars: (n) => `${n} geschafft`,
};

/** The texts by app language: `pick(SHADOW_TEXTS, language.id)`. */
export const SHADOW_TEXTS: Localized<ShadowTexts> = { de: GERMAN_TEXTS, ru: RUSSIAN_TEXTS };
