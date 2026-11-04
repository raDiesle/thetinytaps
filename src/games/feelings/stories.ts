// All stories of the feelings game: first the bear's feelings at home, then the kindergarten stories, then the
// stories of more feelings where the bear helps himself (selbst.ts). „Alltagssituationen“ plays them by feeling
// (groups.ts), one choice per scene (rounds.ts).

import { PROD } from "@/lib/buildInfo";
import { FEELINGS, type Feeling } from "./bear";
import { imageFor, situationImages } from "./images";
import { SITUATIONS, type Situation } from "./kita";
import { SELF_SITUATIONS } from "./selbst";

/** One story: a feeling of the bear at home, or a kindergarten story. */
export type Story = { id: string; emoji: string; title: string } & ({ kind: "home"; feeling: Feeling } | { kind: "kita"; situation: Situation });

/** Ids get the place in front, as both places have an "angry" story. */
export const STORIES: Story[] = [
  ...FEELINGS.map((feeling): Story => ({ id: `zuhause-${feeling.id}`, emoji: feeling.emoji, title: feeling.title, kind: "home", feeling })),
  ...SITUATIONS.map((situation): Story => ({ id: `kita-${situation.id}`, emoji: situation.emoji, title: situation.title, kind: "kita", situation })),
  // A story whose pictures are still planned would show players placeholders: the built site leaves it out until all
  // its pictures are made; the dev server shows it, so it can be looked at.
  ...SELF_SITUATIONS.filter((situation) => !PROD || situationImages(situation).every(imageFor)).map(
    (situation): Story => ({ id: `selbst-${situation.id}`, emoji: situation.emoji, title: situation.title, kind: "kita", situation }),
  ),
];
