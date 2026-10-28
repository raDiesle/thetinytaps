// The stories in the app language. The German data (bear.ts, kita.ts) holds
// everything – pictures, sounds, order; a translation (bear.<lang>.ts, kita.<lang>.ts)
// only holds the words, by id and in the same order, and is laid over the German
// one here. A language without a translation – or a story, feeling or kind thing
// not translated yet (translations come only on request) – is told in German.

import type { TargetLanguageId } from "@/content/targetLanguages";
import { pick, type Localized } from "@/lib/language";
import { COMFORTS, type Comfort, type ComfortId, type Feeling, type FeelingId } from "./bear";
import { COMFORTS_AR, FEELINGS_AR } from "./bear.ar";
import { COMFORTS_EN, FEELINGS_EN } from "./bear.en";
import { COMFORTS_ES, FEELINGS_ES } from "./bear.es";
import { COMFORTS_HI, FEELINGS_HI } from "./bear.hi";
import { COMFORTS_RU, FEELINGS_RU } from "./bear.ru";
import { COMFORTS_ZH, FEELINGS_ZH } from "./bear.zh";
import { QUESTION, type Situation, type SituationId } from "./kita";
import { SITUATIONS_AR } from "./kita.ar";
import { SITUATIONS_EN } from "./kita.en";
import { SITUATIONS_ES } from "./kita.es";
import { SITUATIONS_HI } from "./kita.hi";
import { SITUATIONS_RU } from "./kita.ru";
import { SITUATIONS_ZH } from "./kita.zh";
import type { Story } from "./stories";
import type { Beat } from "./story";

/** A kind thing's words in another language. */
export type ComfortText = Pick<Comfort, "caption" | "narration">;

/** A feeling's words in another language: every text of `Feeling`, nothing else. */
export interface FeelingText {
  title: string;
  /** One question per round like the German `questions`; until they are translated, `intro` and `question` stand in. */
  questions?: string[];
  /** What is the matter, said before the first question while `questions` are missing. */
  intro: string;
  /** Asked every round while `questions` are missing, if not „Wie kannst du ihm helfen?“. */
  question?: string;
  /** One per round like the German; `null` where it is not translated yet (that card is told in German). */
  instead: ({ caption: string; answer: string } | null)[];
  end: { narration: string; line: string };
  endCaption: string;
}

/** A beat's words in another language: the same parts as the German beat (narration, line or both); its sound stays the German one's. */
export type BeatText = Pick<Beat, "narration" | "line">;

/** A kindergarten story's words in another language: the German story's texts, beat for beat and step for step. */
export interface SituationText {
  title: string;
  caption: string;
  intro: BeatText[];
  /** `question` like the German step's; while it is missing, the general „Was kann der kleine Bär tun?“ stands in. */
  steps: { caption: string; question?: string; beats: BeatText[]; instead: { caption: string; answer: string } }[];
  outro: BeatText[];
  endCaption: string;
}

/** The translations of the kind things, by language. */
export const COMFORT_TEXTS: Partial<Record<TargetLanguageId, Partial<Record<ComfortId, ComfortText>>>> = {
  en: COMFORTS_EN,
  zh: COMFORTS_ZH,
  hi: COMFORTS_HI,
  es: COMFORTS_ES,
  ar: COMFORTS_AR,
  ru: COMFORTS_RU,
};
/** The translations of the bear's feelings, by language. */
export const FEELING_TEXTS: Partial<Record<TargetLanguageId, Partial<Record<FeelingId, FeelingText>>>> = {
  en: FEELINGS_EN,
  zh: FEELINGS_ZH,
  hi: FEELINGS_HI,
  es: FEELINGS_ES,
  ar: FEELINGS_AR,
  ru: FEELINGS_RU,
};
/** The translations of the kindergarten stories, by language. */
export const SITUATION_TEXTS: Partial<Record<TargetLanguageId, Partial<Record<SituationId, SituationText>>>> = {
  en: SITUATIONS_EN,
  zh: SITUATIONS_ZH,
  hi: SITUATIONS_HI,
  es: SITUATIONS_ES,
  ar: SITUATIONS_AR,
  ru: SITUATIONS_RU,
};

/** All kind things in `language`. */
export function comfortsIn(language: TargetLanguageId): Record<ComfortId, Comfort> {
  const texts = COMFORT_TEXTS[language];
  if (!texts) return COMFORTS;
  return Object.fromEntries(Object.entries(COMFORTS).map(([id, comfort]) => [id, { ...comfort, ...texts[id as ComfortId] }])) as Record<ComfortId, Comfort>;
}

/** Asked every round at home in a translation without questions of its own. */
const HELP_QUESTION: Localized = {
  de: "Wie kannst du ihm helfen?",
  ru: "Как ты можешь ему помочь?",
  en: "How can you help him?",
  zh: "你可以怎么帮他？",
  hi: "उसकी मदद कैसे करें?",
  es: "¿Cómo puedes ayudarle?",
  ar: "كيف نساعده؟",
};

/** The bear's feeling with its words in `language`. */
export function feelingIn(feeling: Feeling, language: TargetLanguageId): Feeling {
  const text = FEELING_TEXTS[language]?.[feeling.id];
  if (!text) return feeling;
  const { intro, question = pick(HELP_QUESTION, language), questions, ...words } = text;
  return {
    ...feeling,
    ...words,
    questions: questions ?? feeling.questions.map((_, i) => (i === 0 ? `${intro} ${question}` : question)),
    instead: feeling.instead.map((instead, i) => ({ ...instead, ...text.instead[i] })),
  };
}

/** The German beats with the words of `texts` (same length, same order). */
const beatsIn = (beats: Beat[], texts: BeatText[]): Beat[] => beats.map((beat, i) => ({ ...beat, narration: texts[i]?.narration, line: texts[i]?.line }));

/** The kindergarten story with its words in `language`. */
export function situationIn(situation: Situation, language: TargetLanguageId): Situation {
  const text = SITUATION_TEXTS[language]?.[situation.id];
  if (!text) return situation;
  return {
    ...situation,
    title: text.title,
    caption: text.caption,
    endCaption: text.endCaption,
    intro: beatsIn(situation.intro, text.intro),
    outro: beatsIn(situation.outro, text.outro),
    steps: situation.steps.map((step, i) => ({
      caption: text.steps[i].caption,
      question: text.steps[i].question ?? pick(QUESTION, language),
      beats: beatsIn(step.beats, text.steps[i].beats),
      instead: { ...step.instead, ...text.steps[i].instead },
    })),
  };
}

/** A story of the start screen with its title and words in `language`. */
export function storyIn(story: Story, language: TargetLanguageId): Story {
  if (story.kind === "home") {
    const feeling = feelingIn(story.feeling, language);
    return { ...story, title: feeling.title, feeling };
  }
  const situation = situationIn(story.situation, language);
  return { ...story, title: situation.title, situation };
}
