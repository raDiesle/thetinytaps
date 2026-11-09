// The rounds of „Was ist passiert?“: a child shows a feeling with its face and body, and two pictures show what happened.
// Exactly one of them fits the feeling; the other one does not, and the child's figure only shakes its head gently.

import type { MascotKind, MascotMouth } from "@/components/Mascot";
import type { Localized } from "@/lib/language";

/**
 * One picture of what happened: an emoji (a placeholder until its Gemini picture is made), and its question for
 * grown-ups, shown small under it and read out, which they can ask the child for that picture.
 */
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
      { id: "ballon", emoji: "🎈", label: { de: "Fliegt der Luftballon weg?" }, fits: true },
      { id: "eis", emoji: "🍦", label: { de: "Gibt es ein Eis?" }, fits: false },
    ],
  },
  {
    id: "lacht-oma",
    kind: "bear",
    before: "grin",
    options: [
      { id: "oma", emoji: "👵", label: { de: "Kommt Oma zu Besuch?" }, fits: true },
      { id: "regen", emoji: "🌧️", label: { de: "Regnet es?" }, fits: false },
    ],
  },
  {
    id: "wuetend-schaufel",
    kind: "bear",
    before: "frown",
    options: [
      { id: "schaufel", emoji: "✋🪏", label: { de: "Nimmt jemand die Schaufel weg?" }, fits: true },
      { id: "rutschen", emoji: "🛝", label: { de: "Darf es rutschen?" }, fits: false },
    ],
  },
  {
    id: "erschrickt-hund",
    kind: "fox",
    before: "o",
    options: [
      { id: "hund", emoji: "🐕", label: { de: "Bellt ein Hund laut?" }, fits: true },
      { id: "schmetterling", emoji: "🦋", label: { de: "Landet ein Schmetterling?" }, fits: false },
    ],
  },
];
