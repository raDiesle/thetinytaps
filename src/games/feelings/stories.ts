// All stories of the feelings game on one start screen: first the bear's
// feelings at home, then the kindergarten stories, then the stories of more
// feelings where the bear helps himself (selbst.ts).

import { PROD } from "@/lib/buildInfo";
import { FEELINGS, type Feeling, type FeelingId } from "./bear";
import { imageFor, storyImages } from "./images";
import { SITUATIONS, type Situation } from "./kita";
import { SELF_SITUATIONS } from "./selbst";

/** One card on the start screen: a feeling of the bear at home, or a kindergarten story. */
export type Story = { id: string; emoji: string; title: string } & ({ kind: "home"; feeling: Feeling } | { kind: "kita"; situation: Situation });

/** Ids get the place in front, as both places have an "angry" story. */
export const STORIES: Story[] = [
  ...FEELINGS.map((feeling): Story => ({ id: `zuhause-${feeling.id}`, emoji: feeling.emoji, title: feeling.title, kind: "home", feeling })),
  ...SITUATIONS.map((situation): Story => ({ id: `kita-${situation.id}`, emoji: situation.emoji, title: situation.title, kind: "kita", situation })),
  // A story whose pictures are all still planned would show players nothing but placeholders: the built site leaves it
  // out until its first picture is made; the dev server shows it, so it can be looked at.
  ...SELF_SITUATIONS.filter((situation) => !PROD || imageFor(storyImages.problem(situation.id))).map(
    (situation): Story => ({ id: `selbst-${situation.id}`, emoji: situation.emoji, title: situation.title, kind: "kita", situation }),
  ),
];

/** The bear's story at home with this feeling. */
export const homeStory = (id: FeelingId): Story => STORIES.find((s) => s.kind === "home" && s.feeling.id === id)!;

/** The story „Weiter“ brings after this one: the next on the start screen, after the last the first. */
export const storyAfter = (story: Story): Story => STORIES[(STORIES.indexOf(story) + 1) % STORIES.length];
