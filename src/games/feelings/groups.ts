// The stories of „Alltagssituationen“ grouped by feeling (user decision, November 2026): one card per group, and a
// group plays its scenes one after another, each with one choice. The next time a scene comes, it asks its next
// choice, so the pictures of all its steps are seen over several passes.

import type { Localized } from "@/lib/language";
import { STORIES, type Story } from "./stories";

/** One card of „Alltagssituationen“: a feeling and the stories that show it. */
export interface StoryGroup {
  id: string;
  emoji: string;
  /** German only so far (translations only on request). */
  title: Localized;
  /** Ids from `STORIES`, in the order they are played. */
  stories: string[];
}

export const GROUPS: StoryGroup[] = [
  {
    id: "traurig",
    emoji: "😢",
    title: { de: "Traurig" },
    stories: ["zuhause-sad", "selbst-screen", "selbst-lost", "selbst-miss", "selbst-cookie", "selbst-join"],
  },
  {
    id: "wuetend",
    emoji: "😠",
    title: { de: "Wütend" },
    stories: ["zuhause-angry", "kita-angry", "selbst-leave", "selbst-checkout", "selbst-jacket", "selbst-pancake"],
  },
  {
    id: "angst",
    emoji: "😨",
    title: { de: "Angst" },
    stories: ["zuhause-scared", "selbst-night", "selbst-vacuum", "selbst-dog", "selbst-doctor", "selbst-hairwash", "selbst-startle"],
  },
  {
    id: "freude",
    emoji: "🥳",
    title: { de: "Freude & Stolz" },
    stories: ["zuhause-happy", "selbst-snow", "selbst-proud"],
  },
  {
    id: "muede",
    emoji: "😴",
    title: { de: "Müde & zu viel" },
    stories: ["zuhause-tired", "selbst-loud", "selbst-bored"],
  },
  {
    id: "streit",
    emoji: "✋",
    title: { de: "Streit im Kindergarten" },
    stories: ["kita-push", "kita-kick", "kita-grab", "kita-slide", "kita-want", "kita-stop"],
  },
  {
    id: "freunde",
    emoji: "🫂",
    title: { de: "Freunde & Familie" },
    stories: ["kita-bye", "kita-new", "kita-fall", "selbst-baby", "selbst-shy", "selbst-empathy"],
  },
  {
    id: "igitt",
    emoji: "🥦",
    title: { de: "Igitt & Hoppla" },
    stories: ["selbst-broccoli", "selbst-oops"],
  },
];

/** The group with this id, or the first. */
export const groupById = (id: string): StoryGroup => GROUPS.find((g) => g.id === id) ?? GROUPS[0];

/** The group's stories that can be played (the built site leaves out a story whose pictures are not all made). */
export const groupStories = (group: StoryGroup): Story[] =>
  group.stories.map((id) => STORIES.find((s) => s.id === id)).filter((s): s is Story => s !== undefined);

/** The groups with something to play, in their fixed order. */
export const playableGroups = (): StoryGroup[] => GROUPS.filter((g) => groupStories(g).length > 0);

/** The group „Weiter“ brings after this one: the next, after the last the first. */
export function groupAfter(group: StoryGroup): StoryGroup {
  const groups = playableGroups();
  return groups[(groups.indexOf(group) + 1) % groups.length];
}
