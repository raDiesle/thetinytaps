// All stories of the feelings game on one start screen: first the bear's
// feelings at home, then the kindergarten stories.

import { FEELINGS, type Feeling, type FeelingId } from "./bear";
import { SITUATIONS, type Situation } from "./kita";

/** One card on the start screen: a feeling of the bear at home, or a kindergarten story. */
export type Story = { id: string; emoji: string; title: string } & ({ kind: "home"; feeling: Feeling } | { kind: "kita"; situation: Situation });

/** Ids get the place in front, as both places have an "angry" story. */
export const STORIES: Story[] = [
  ...FEELINGS.map((feeling): Story => ({ id: `zuhause-${feeling.id}`, emoji: feeling.emoji, title: feeling.title, kind: "home", feeling })),
  ...SITUATIONS.map((situation): Story => ({ id: `kita-${situation.id}`, emoji: situation.emoji, title: situation.title, kind: "kita", situation })),
];

/** The bear's story at home with this feeling. */
export const homeStory = (id: FeelingId): Story => STORIES.find((s) => s.kind === "home" && s.feeling.id === id)!;
