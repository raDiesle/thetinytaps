// The pictures of the feelings game, all in ./bilder/ (see bilder/README.md).
// A picture can have more frames for a little movement: "push-1" is the first,
// "push-1-b" the second; they fade into each other in a loop.

import pictureFiles from "./bilder/*.webp?glob";

const IMAGES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

const FRAME_SUFFIXES = ["", "-b", "-c"];

/** The picture called `name` ("push-1", "baer-sad"), if there is one. */
export function imageFor(name: string): string | undefined {
  return IMAGES.get(name);
}

/** All frames of the picture `name`, first one first; empty if there is none. */
export function framesFor(name: string): string[] {
  return FRAME_SUFFIXES.map((suffix) => IMAGES.get(name + suffix)).filter((src) => src !== undefined);
}

/** Starts loading these pictures with all their frames, so they don't pop in empty. */
export function preloadImages(names: string[]) {
  for (const name of names) {
    for (const src of framesFor(name)) new Image().src = src;
  }
}

/** Names of the pictures for one kindergarten story. */
export const storyImages = {
  /** What happened. */
  problem: (id: string) => `${id}-passiert`,
  /** The n-th good step, counted from 0. */
  step: (id: string, i: number) => `${id}-${i + 1}`,
  /** The not-so-good idea next to the n-th good step, counted from 0: "push-nein", "push-nein-2". */
  instead: (id: string, i: number) => (i === 0 ? `${id}-nein` : `${id}-nein-${i + 1}`),
  /** Everybody happy at the end. */
  end: (id: string) => `${id}-ende`,
};

/** Every picture a kindergarten story shows: what happened, the end, and each step with its not-so-good idea. */
export const situationImages = ({ id, steps }: { id: string; steps: unknown[] }) => [
  storyImages.problem(id),
  storyImages.end(id),
  ...steps.flatMap((_, i) => [storyImages.step(id, i), storyImages.instead(id, i)]),
];

/** Names of the pictures for comforting the bear. */
export const bearImages = {
  /** How the bear feels at the start. */
  feeling: (id: string) => `baer-${id}`,
  comfort: (id: string) => `trost-${id}`,
  /** The not-so-good idea of the n-th round, counted from 0: "baer-sad-nein", "baer-sad-nein-2". */
  instead: (id: string, i: number) => (i === 0 ? `baer-${id}-nein` : `baer-${id}-nein-${i + 1}`),
  /** Happy (or asleep) again at the end. */
  happy: (id: string) => `baer-${id}-gut`,
};

/** Names of the pictures of „Wie geht's dir?“ and „Was brauche ich?“. */
export const moodImages = {
  /** A feeling's card: the little bear alone with it, close, in a moment that brings it (user feedback, November 2026). */
  feeling: (id: string) => `gefuehl-${id}`,
  /** A card of „Was brauche ich?“: the little bear doing what he needs. */
  need: (id: string) => `brauche-${id}`,
};
