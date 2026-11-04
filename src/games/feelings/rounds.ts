// One round of the feelings game: one scene, one choice (user feedback, November 2026). A story's steps used to be
// asked one after another on the same picture, which felt odd – after a good choice the story jumped back to its
// start to ask again. Now a round shows the scene, asks one question with two cards (a not-so-good idea and a good
// one), plays the good one, and the game goes on to another scene; the scene's other steps come in later rounds.
// Home stories (bear.ts) and kindergarten stories (kita.ts, selbst.ts) become the same kind of round here.

import type { TargetLanguageId } from "@/content/targetLanguages";
import { pick, type Localized } from "@/lib/language";
import { bearImages, imageFor, storyImages } from "./images";
import { comfortsIn, storyIn } from "./localized";
import type { Story } from "./stories";
import type { Beat, OopsSound } from "./story";

/** Whose view the round takes: the child is the little bear („self“), or helps its friend the bear („friend“). */
export type Role = "self" | "friend";

/**
 * Said first in every round, and the start picture's caption while it is told, so it is plain whether the child is
 * the bear or helps him (user feedback, November 2026). German only so far, and not recorded yet.
 */
export const ROLE_LINES: Record<Role, Localized> = {
  self: { de: "Stell dir vor: Du bist der kleine Bär." },
  friend: { de: "Der kleine Bär ist dein Freund. Du hilfst ihm." },
};

/** A picture with what it shows, in a few words for grown-ups. */
export interface Shown {
  image: string;
  caption: string;
}

export interface Round {
  /** The story's id in `STORIES`. */
  storyId: string;
  /** Which of the story's steps is asked, counted from 0. */
  step: number;
  role: Role;
  /** The scene: its picture and what is told while it shows. */
  start: Shown & { beats: Beat[] };
  /** Read aloud and the caption while the child chooses; it names who acts. */
  question: string;
  /** The good idea: its card, and what is told while it is done. */
  good: Shown & { beats: Beat[] };
  /** The not-so-good idea: its card, why it doesn't help (read aloud), and what it leads to, heard. */
  instead: Shown & { answer: string; sound?: OopsSound };
  /** On the story's last step: its happy end. */
  end?: Shown & { beats: Beat[] };
}

/** How many steps (choices) a story has. */
export const stepsOf = (story: Story): number => (story.kind === "home" ? story.feeling.comforts.length : story.situation.steps.length);

/** The round of `story` that asks its step `step`, with its words in `language`. */
export function roundOf(story: Story, step: number, language: TargetLanguageId): Round {
  const localized = storyIn(story, language);
  const last = step === stepsOf(story) - 1;
  const roleBeat = (role: Role): Beat => ({ narration: pick(ROLE_LINES[role], language) });

  if (localized.kind === "home") {
    const { feeling } = localized;
    const comfortId = feeling.comforts[step];
    const comfort = comfortsIn(language)[comfortId];
    const role: Role = comfort.actor === "child" ? "friend" : "self";
    return {
      storyId: story.id,
      step,
      role,
      // The thunder rumbles while the scared bear's story starts.
      start: {
        image: bearImages.feeling(feeling.id),
        caption: feeling.title,
        beats: [{ ...roleBeat(role), sound: feeling.id === "scared" ? "rumble" : undefined }],
      },
      question: feeling.questions[step],
      good: { image: bearImages.comfort(comfortId), caption: comfort.caption, beats: [{ narration: comfort.narration, sound: comfort.sound }] },
      instead: { image: bearImages.instead(feeling.id, step), ...feeling.instead[step] },
      end: last
        ? {
            image: bearImages.happy(feeling.id),
            caption: feeling.endCaption,
            beats: [{ narration: feeling.end.narration, line: feeling.end.line, sound: "cheer" }],
          }
        : undefined,
    };
  }

  const { situation } = localized;
  const { id, steps } = situation;
  const current = steps[step];
  return {
    storyId: story.id,
    step,
    role: "self",
    start: { image: storyImages.problem(id), caption: situation.caption, beats: [roleBeat("self"), ...situation.intro] },
    question: current.question,
    good: { image: storyImages.step(id, step), caption: current.caption, beats: current.beats },
    instead: { image: storyImages.instead(id, step), ...current.instead },
    end: last
      ? {
          image: imageFor(storyImages.end(id)) ? storyImages.end(id) : storyImages.step(id, step),
          caption: situation.endCaption,
          beats: situation.outro,
        }
      : undefined,
  };
}

/** Every picture a round may show. */
export const roundImages = (round: Round): string[] => [round.start.image, round.good.image, round.instead.image, ...(round.end ? [round.end.image] : [])];

/** The text a beat is said as: its narration and its line together, as recorded. */
export const beatText = (beat: Beat): string => [beat.narration, beat.line].filter(Boolean).join(" ");

/** Every line a round may say, to load their recordings when it starts. */
export const roundLines = (round: Round): string[] =>
  [...round.start.beats, ...round.good.beats, ...(round.end?.beats ?? [])].map(beatText).concat(round.question, round.instead.answer);
