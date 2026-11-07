import type { SoundName } from "../scene";
import type { TopicId } from "../topics";
import { PAINTED as bad } from "./bad";
import { PAINTED as kueche } from "./kueche";
import { PAINTED as zuhause } from "./zuhause";
import { PAINTED as kleidung } from "./kleidung";
import { PAINTED as kita } from "./kita";
import { PAINTED as spielen } from "./spielen";
import { PAINTED as garten } from "./garten";
import { PAINTED as wetter } from "./wetter";
import { PAINTED as unterwegs } from "./unterwegs";
import { PAINTED as feste } from "./feste";
import { PAINTED as berufe } from "./berufe";
import { PAINTED as bauen } from "./bauen";
import { PAINTED as verkehr } from "./verkehr";
import { PAINTED as gesundheit } from "./gesundheit";
import { PAINTED as rettung } from "./rettung";
import { PAINTED as laden } from "./laden";
import { PAINTED as hof } from "./hof";
import { PAINTED as musik } from "./musik";
import { PAINTED as sport } from "./sport";
import { PAINTED as fantasie } from "./fantasie";

// The painted pairs of "Was gehört zusammen?" (user decision, November 2026: the emoji scenes were often unclear – a
// cake that already had candles, a letter box whose emoji already showed the letter). Each pair is two frames of ONE
// scene, painted with Gemini (`picturePrompts.ts`, `/bild-erzeugen`) and shown by `PairPicture`:
// 1. before: the thing in its place, plainly missing its partner, or the helper in its role and place, empty-pawed,
//    looking round unsure or searching – and whoever is in the picture waits for it;
// 2. after: the very same picture, drawn from the first as its only reference, the partner now in use, and everyone
//    in it glad to have it.
// Plain data, one file per topic like `scenes/`, so the picture queue on the management page loads no pictures and
// each topic grows on its own. A pair plays only once its pictures are made (`fromPainted`); `made` says they are.

/** A painted pair's partner: its names, and an emoji where Apple's emoji looks like what the frames show. */
export interface PaintedPartner {
  /** Its German name, for screen readers and the line under its plate: "Orange". */
  name: string;
  /** With its article: „die Orange“. */
  the: string;
  /** With its article as an object: „die Orange“, „den Pinsel“. */
  acc: string;
  /** Said in the plural („die Kerzen gehören …“). */
  plural?: true;
  /** Its emoji on the plate, only where it looks like the partner in the second frame; else the pair has a `part`. */
  emoji?: string;
}

/** One painted pair: who or what waits, what belongs to it, and the two pictures' prompts. */
export interface PaintedPair {
  /** Unique among all pairs, lower case German without umlauts: "saftpresse-orange", "zwerg". */
  id: string;
  /** Its topic, which says its kind: things of the day go together, helpers need their tools (`topics.ts`). */
  topic: TopicId;
  /** The German name of the one above, for screen readers: "Saftpresse", "Zwerg". */
  name: string;
  /** With its article: „die Saftpresse“. */
  the: string;
  /** After „gehört“, for „Was gehört zur Saftpresse?“ (things of the day; for a helper the same as `the`). */
  toThe: string;
  /**
   * What the one above wants to do, said as the round's question (Z-25): „Die Feuerwehr will das Feuer löschen.“,
   * „Die Blume hat Durst.“ It never names the partner, so the child thinks what it needs; exactly one choice fits it.
   */
  wish: string;
  partner: PaintedPartner;
  /**
   * Where the partner has no fitting emoji: what to paint alone for its plate, in English („a wooden pizza peel, long
   * handle, empty“). It is painted from the second frame, so it looks as it does there (`teile/<id>.webp`).
   */
  part?: string;
  /** Who is in the pictures: fox, bear, both, or nobody (a thing alone in its place). */
  cast: "fox" | "bear" | "both" | "none";
  /** The whole first picture, in English: the place, the thing without its partner, and who waits there and how. */
  before: string;
  /** What is different in the second, in English: the partner doing its job, and the faces glad. */
  after: string;
  /** The sounds as the second picture comes, one after the other (`SOUNDS` in scene.tsx). */
  sounds: SoundName[];
  /** Other pairs of its kind whose partner fits this one too, or which this one's partner fits (see `SceneSpec`). */
  alsoFits?: string[];
  /**
   * Its two frames drifted apart twice when drawn together as one request (a figure doubled, the framing changed): the
   * first is kept, and the second is drawn alone from it as its reference (`alone: "second frame"`, `picturePrompts.ts`).
   */
  fromFirst?: true;
  /** Its pictures are made and in `bilder/` (no longer queued), or only its two frames („frames“, its `part` still to come), or only its `part` („part“, its frames drawn again). */
  made?: true | "frames" | "part";
}

/** All painted pairs, in the topics' order. */
export const PAINTED: PaintedPair[] = [
  ...bad,
  ...kueche,
  ...zuhause,
  ...kleidung,
  ...kita,
  ...spielen,
  ...garten,
  ...wetter,
  ...unterwegs,
  ...feste,
  ...berufe,
  ...bauen,
  ...verkehr,
  ...gesundheit,
  ...rettung,
  ...laden,
  ...hof,
  ...musik,
  ...sport,
  ...fantasie,
];
