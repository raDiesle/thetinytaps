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
import type { ShadowTheme } from "./settings";

// German texts for "Schatten finden" (N-07). The pictures are emojis; their
// shadow is the same emoji in black, so each one needs a shape of its own –
// whole bodies rather than faces, nothing that is just a round blob.

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

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** "seinen" or "ihren" Schatten. */
const its = (item: ShadowItem) => (item.the.startsWith("die ") ? "ihren" : "seinen");

export const texts = {
  search: (item: ShadowItem) => `${capital(item.the)} sucht ${its(item)} Schatten.`,
  found: (item: ShadowItem) => `Juhu! ${capital(item.the)} hat ${its(item)} Schatten gefunden.`,
  /** A wrong shadow shows who it belongs to. */
  thatIs: (item: ShadowItem) => `Das ist ${item.the}.`,
};
