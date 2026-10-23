import type { SceneMode } from "./settings";
import type { Scene, SceneItem, SceneSound, SceneTrait } from "./types";

/** What the child is asked to find in find, sounds and questions mode. */
export interface Quest {
  /** Not asked twice in a row. */
  id: string;
  /** Spoken and shown in the bubble: "Wo ist der Bagger?" */
  question: string;
  /** Every item that is a right answer. */
  answers: SceneItem[];
  /** How many of them make the question done. */
  needed: number;
  /** Find mode: the item, drawn in the bubble. */
  item?: SceneItem;
  /** Sound riddle: played instead of naming anything. */
  sound?: SceneSound;
  /** Questions mode: shown in the bubble. */
  emoji?: string;
  /** Said for a right answer: "Das ist der Bagger!" */
  praise: (item: SceneItem) => string;
}

/** "ist" or "sind" ("war" or "waren" in the past), matching the item's name. */
export const verb = (item: SceneItem, past = false) => (past ? (item.plural ? "waren" : "war") : item.plural ? "sind" : "ist");

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** Questions mode: one question per trait, asked when the scene has at least two answers. */
export const TRAITS: Record<SceneTrait, { question: string; answer: string; emoji: string }> = {
  red: { question: "Was ist rot?", answer: "ist rot", emoji: "🔴" },
  yellow: { question: "Was ist gelb?", answer: "ist gelb", emoji: "🟡" },
  blue: { question: "Was ist blau?", answer: "ist blau", emoji: "🔵" },
  green: { question: "Was ist grün?", answer: "ist grün", emoji: "🟢" },
  flies: { question: "Wer kann fliegen?", answer: "kann fliegen", emoji: "🪽" },
  big: { question: "Was ist ganz groß?", answer: "ist ganz groß", emoji: "🐘" },
  small: { question: "Was ist ganz klein?", answer: "ist ganz klein", emoji: "🐜" },
  animal: { question: "Wo ist ein Tier?", answer: "ist ein Tier", emoji: "🐾" },
  wheels: { question: "Was hat Räder?", answer: "hat Räder", emoji: "🛞" },
};

/** A question with many answers is done after this many, so it doesn't drag on. */
const MAX_NEEDED = 3;

/**
 * Sound riddles only use sounds you can tell apart and name ("Wau!", "Tatütata!").
 * Soft chimes, boings and pops belong to too many different things.
 */
const RIDDLE_SOUNDS = new Set<SceneSound>([
  "engine",
  "beeps",
  "tweet",
  "melody",
  "rattle",
  "rotor",
  "quack",
  "bark",
  "sniff",
  "buzz",
  "saw",
  "honk",
  "siren",
  "bells",
  "ring",
  "coo",
  "meow",
  "moo",
  "oink",
  "baa",
  "cluck",
  "crow",
  "neigh",
  "hoot",
  "croak",
  "roar",
  "trumpet",
  "chatter",
  "squawk",
  "whale",
  "ping",
  "dolphin",
  "launch",
  "beam",
  "robot",
  "alien",
  "alarm",
  "trill",
  "flush",
  "blow",
  "scrub",
  "splash",
  "tick",
  "peck",
  "cuckoo",
  "kettle",
  "sizzle",
  "train",
  "jet",
  "sleigh",
  "yawn",
  "creak",
  "sneeze",
  "heartbeat",
]);

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function findQuest(item: SceneItem): Quest {
  return {
    id: item.id,
    question: `Wo ${verb(item)} ${item.name}?`,
    answers: [item],
    needed: 1,
    item,
    praise: (found) => `Das ${verb(found)} ${found.name}!`,
  };
}

/** Every item with the same sound counts, e.g. any of the three engines. */
function soundQuest(scene: Scene, sound: SceneSound): Quest {
  return {
    id: sound,
    question: "Wer macht das?",
    answers: scene.items.filter((item) => item.sound === sound),
    needed: 1,
    sound,
    praise: (found) => `Das ${verb(found, true)} ${found.name}!`,
  };
}

function traitQuest(scene: Scene, trait: SceneTrait): Quest {
  const { question, answer, emoji } = TRAITS[trait];
  const answers = scene.items.filter((item) => item.traits?.includes(trait));
  return {
    id: trait,
    question,
    answers,
    needed: Math.min(MAX_NEEDED, answers.length),
    emoji,
    praise: (found) => `${capitalize(found.name)} ${answer}!`,
  };
}

/** Everything that can be asked in this mode and scene. */
export function questsFor(mode: SceneMode, scene: Scene): Quest[] {
  if (mode === "find") return scene.items.map(findQuest);
  if (mode === "sounds") {
    const sounds = new Set(scene.items.map((item) => item.sound).filter((sound) => RIDDLE_SOUNDS.has(sound)));
    return [...sounds].map((sound) => soundQuest(scene, sound));
  }
  if (mode === "questions") {
    return (Object.keys(TRAITS) as SceneTrait[]).map((trait) => traitQuest(scene, trait)).filter((quest) => quest.answers.length >= 2);
  }
  return [];
}

/** The next question: any but the last one. */
export function nextQuest(quests: readonly Quest[], last: Quest | null): Quest | null {
  if (quests.length === 0) return null;
  return pick(quests.length > 1 ? quests.filter((quest) => quest.id !== last?.id) : quests);
}
