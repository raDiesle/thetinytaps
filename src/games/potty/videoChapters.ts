import type { EnglishFirst } from "@/lib/language";
import type { StepId } from "./content";

/**
 * The chapters of a potty video for YouTube's description (idea Y-26): the step that begins each one and its name,
 * English first like everything new (other languages only when asked for). Steps between them belong to the chapter
 * before; `VideoRecorder` joins chapters too short for YouTube.
 */
export const STEP_CHAPTERS: Partial<Record<StepId, EnglishFirst>> = {
  eat: { en: "Time to go" },
  down: { en: "On the potty" },
  done: { en: "All done!" },
  flush: { en: "Flush and wash hands" },
  party: { en: "Party!" },
};

/** When nothing came, the rest of the story after sitting is one chapter (idea Y-24): washing and playing are too short for two. */
export const NOTHING_CHAPTERS: Partial<Record<StepId, EnglishFirst>> = {
  wash: { en: "Nothing today – that's okay" },
};
