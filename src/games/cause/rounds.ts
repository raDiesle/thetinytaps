// The rounds of „Was ist passiert?“: a child shows a feeling with its face and body, and two pictures show what happened.
// Exactly one of them fits the feeling; the other one does not, and the child's figure only shakes its head gently.

import type { MascotKind, MascotMouth } from "@/components/Mascot";
import type { Localized } from "@/lib/language";

/** One picture of what happened: an emoji, and what it is for grown-ups (read out with it, never shown). */
export interface CauseOption {
  id: string;
  emoji: string;
  label: Localized;
  /** Exactly one option per round fits the feeling. */
  fits: boolean;
}

/** One round: the child (a fox or a bear, with its grown-up beside it) and its face, then the two pictures. */
export interface CauseRound {
  id: string;
  /** The child's animal; the grown-up beside it is the same animal. */
  kind: MascotKind;
  /** The child's face before the answer: the feeling it shows. */
  before: MascotMouth;
  options: readonly [CauseOption, CauseOption];
}

/** The question under the pictures, the same in every round. */
export const CAUSE_QUESTION: Localized = { de: "Was ist passiert?" };

export const CAUSE_ROUNDS: readonly CauseRound[] = [
  {
    id: "weint-ballon",
    kind: "fox",
    before: "frown",
    options: [
      { id: "ballon", emoji: "🎈", label: { de: "Der Luftballon ist weggeflogen" }, fits: true },
      { id: "eis", emoji: "🍦", label: { de: "Es gibt ein Eis" }, fits: false },
    ],
  },
  {
    id: "lacht-oma",
    kind: "bear",
    before: "grin",
    options: [
      { id: "oma", emoji: "👵", label: { de: "Oma kommt zu Besuch" }, fits: true },
      { id: "regen", emoji: "🌧️", label: { de: "Es regnet" }, fits: false },
    ],
  },
  {
    id: "wuetend-schaufel",
    kind: "bear",
    before: "frown",
    options: [
      { id: "schaufel", emoji: "✋🪏", label: { de: "Jemand nimmt ihm die Schaufel weg" }, fits: true },
      { id: "rutschen", emoji: "🛝", label: { de: "Es darf rutschen" }, fits: false },
    ],
  },
  {
    id: "erschrickt-hund",
    kind: "fox",
    before: "o",
    options: [
      { id: "hund", emoji: "🐕", label: { de: "Ein Hund bellt laut" }, fits: true },
      { id: "schmetterling", emoji: "🦋", label: { de: "Ein Schmetterling landet" }, fits: false },
    ],
  },
];
