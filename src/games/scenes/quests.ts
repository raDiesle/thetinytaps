import type { TargetLanguageId } from "@/content/targetLanguages";
import { pick as pickLanguage } from "@/lib/language";
import { SCENE_PHRASES } from "./phrases";
import type { SceneMode } from "./settings";
import type { Scene, SceneItem, SceneTrait } from "./types";

/** What the child is asked to find in find and questions mode. */
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
  /** Questions mode: shown in the bubble. */
  emoji?: string;
  /** Said for a right answer: "Das ist der Bagger!" */
  praise: (item: SceneItem) => string;
}

/** The traits asked about in questions mode; their words are in phrases.ts. */
const TRAITS = Object.keys(SCENE_PHRASES.de.traits) as SceneTrait[];

/** A question with many answers is done after this many, so it doesn't drag on. */
const MAX_NEEDED = 3;

const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/**
 * Everything that can be asked in this mode and scene, in `languageId` (the scene's
 * items already localized, see localize.ts). Questions mode asks a trait when the
 * scene has at least two answers.
 */
export function questsFor(mode: SceneMode, scene: Scene, languageId: TargetLanguageId = "de"): Quest[] {
  const words = pickLanguage(SCENE_PHRASES, languageId);
  if (mode === "find") {
    return scene.items.map((item) => ({ id: item.id, question: words.whereIs(item), answers: [item], needed: 1, item, praise: words.hereIs }));
  }
  if (mode === "questions") {
    return TRAITS.map((trait): Quest => {
      const { question, praise, emoji } = words.traits[trait];
      const answers = scene.items.filter((item) => item.traits?.includes(trait));
      return { id: trait, question, answers, needed: Math.min(MAX_NEEDED, answers.length), emoji, praise };
    }).filter((quest) => quest.answers.length >= 2);
  }
  return [];
}

/** The next question: any but the last one. */
export function nextQuest(quests: readonly Quest[], last: Quest | null): Quest | null {
  if (quests.length === 0) return null;
  return pick(quests.length > 1 ? quests.filter((quest) => quest.id !== last?.id) : quests);
}
