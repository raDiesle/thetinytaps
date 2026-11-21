import type { EnglishFirst } from "@/lib/language";
import type { Scene, SceneSound } from "./types";

// „Geräusch-Rätsel“ (idea B-02): only a sound is played – a dog barking, a digger's engine – and the child finds who
// made it. Written English first (root CLAUDE.md, Language), so its texts stand here, the part of the language status
// that has only English so far; the other modes' texts are in phrases.ts.

/** The mode's label in the row above the pictures on `/bilder/`; short, so all modes fit in one row at 844 px. */
export const SOUND_MODE_LABEL: EnglishFirst = { en: "🔊 Sounds" };

/** The question, only read out (the bubble shows a loudspeaker and nothing to read). */
export const SOUND_QUESTION: EnglishFirst = { en: "Who makes this sound?" };

/**
 * The sounds asked about: those a small child knows by ear, played by items that make that very sound themselves. A
 * synthesized pop, boing or chime could be anything, so it is never asked. Each has a recording of its own for this
 * mode, made with ElevenLabs (`riddleSounds.ts`, `src/content/soundQueue.ts`); until it is made, the item's usual sound
 * plays.
 */
export const RIDDLE_SOUNDS: readonly SceneSound[] = [
  // Animals.
  "bark",
  "meow",
  "moo",
  "oink",
  "baa",
  "cluck",
  "crow",
  "neigh",
  "quack",
  "hoot",
  "croak",
  "roar",
  "trumpet",
  "chatter",
  "coo",
  "tweet",
  "buzz",
  "dolphin",
  "cuckoo",
  "whale",
  // Vehicles and things.
  "siren",
  "honk",
  "engine",
  "rotor",
  "train",
  "jet",
  "launch",
  "bells",
  "ring",
  "trill",
  "alarm",
  "tick",
  "flush",
  "kettle",
  "saw",
  "sizzle",
  "sneeze",
];

/**
 * Items (`<scene>:<item>`) that borrow a sound of the list but are not what a child pictures hearing it: the fox and the
 * seal bark like a dog, a washing machine runs on the digger's engine, a barn tweets for its swallows. They never make
 * a question of their own – a dog's bark in the wood would have the fox as its answer –, but where another item asks
 * for their sound they count as right too (answers are judged generously, never only by the tags).
 */
export const BORROWED_SOUNDS: ReadonlySet<string> = new Set([
  "zoo:seehund",
  "wald:fuchs",
  "weltall:roboterhund",
  "hof:scheune",
  "badezimmer:fenster",
  "kinderarzt:fenster",
  "supermarkt:eierkarton",
  "ostern:nistkasten",
  "kueche:mixer",
  "supermarkt:blumen",
  "gutenacht:gluehwuermchen",
  "unterwasser:boot",
  "badezimmer:schiffchen",
  "strand:schiff",
  "gutenacht:eisenbahn",
  "badezimmer:waschmaschine",
  "spielplatz:flugzeug",
  "supermarkt:wischmaschine",
  "flughafen:treppenwagen",
  "strand:flugzeug",
  "baustelle:ballon",
  "stadt:flugzeug",
  "hof:windmuehle",
  "zoo:bimmelbahn",
  "unterwasser:schiff",
  "spielplatz:eiswagen",
  "winterbaustelle:weihnachtsbaum",
  "strand:boje",
  "ostern:osterglocken",
  "zoo:eiswagen",
  "weltall:mondbasis",
  "kueche:eieruhr",
  "supermarkt:baeckerin",
  "kinderarzt:telefon",
  "supermarkt:verkaeufer",
  "zoo:zebra",
  "kinderarzt:schaukelpferd",
  "gutenacht:schaukelpferd",
  "wald:hirsch",
  "supermarkt:milch",
  "kita:bilderbuch",
  "dinotal:parasaurolophus",
]);

/** The sounds a picture asks about, in the order of its items: those of the list some item of its own makes. */
export function riddleSoundsOf(scene: Scene): SceneSound[] {
  const asked = new Set(RIDDLE_SOUNDS);
  const sounds = scene.items.filter((item) => asked.has(item.sound) && !BORROWED_SOUNDS.has(`${scene.id}:${item.id}`)).map((item) => item.sound);
  return [...new Set(sounds)];
}
