import type { TargetLanguage } from "@/content/targetLanguages";
import { type Localized, type Spoken, spokenIn } from "@/lib/language";
import { ALL_TEETH, type Jaw, type Side, type Surface, type ToothId, type View } from "./jaw";
import { STEP_TEXTS_RU } from "./steps.ru";

/** How the brush moves: back and forth on the chewing surfaces, small circles outside, wiping from gum to tooth inside. */
export type Motion = "scrub" | "circle" | "wipe";

/** Names the step, so its translations (steps.ru.ts) can find it. */
export type StepId = "lower-top" | "upper-top" | "outer-left" | "outer-front" | "outer-right" | "inner-lower" | "inner-upper";

/** What is shown and said in a step, in one language. */
export interface StepTexts {
  /** What the step is; no text shows while brushing, so this is the progress bar segment's tooltip, with the hint. */
  title: string;
  /** How to brush there, for the grown-up. */
  hint: string;
  /** Spoken when the step begins. */
  cue: string;
}

/** One brushing step; its texts here are the German ones. */
export interface Step extends StepTexts {
  id: StepId;
  mouth: "open" | "closed";
  surface: Surface;
  /** The teeth brushed in this step, in the order the brush visits them. */
  teeth: ToothId[];
  motion: Motion;
  view: View;
}

const teeth = (jaws: Jaw[], sides: Side[], ns: number[]) => ALL_TEETH.filter((t) => jaws.includes(t.jaw) && sides.includes(t.side) && ns.includes(t.n));

/** Screen order, left to right, back teeth first on the left. */
const leftToRight = (ids: ToothId[]) => [...ids].sort((a, b) => (a.side === b.side ? (a.side === "left" ? b.n - a.n : a.n - b.n) : a.side === "left" ? -1 : 1));

const FLAT = { upper: 0, lower: 0 };
const CLOSED_FRONT: View = { open: 0, pitch: 6, yaw: 0, look: [0, 8, 100], zoom: 1.3, tilt: FLAT };

/** The routine German kindergartens teach, for the grown-ups. */
export const KAI: Localized = { de: "Kauflächen, Außenflächen, Innenflächen", ru: "жевательные, наружные, внутренние поверхности" };

export const STEPS: Step[] = [
  {
    id: "lower-top",
    title: "⬇️ Unten drauf",
    hint: "Kauflächen unten: hin und her",
    cue: "Mund weit auf! Unten auf die Backenzähne. Hin und her schrubben!",
    mouth: "open",
    surface: "top",
    teeth: leftToRight(teeth(["lower"], ["left", "right"], [3, 4])),
    motion: "scrub",
    view: { open: 1, pitch: 0, yaw: 0, look: [0, -10, 100], zoom: 1.2, tilt: { upper: 0, lower: 60 } },
  },
  {
    id: "upper-top",
    title: "⬆️ Oben drauf",
    hint: "Kauflächen oben: hin und her",
    cue: "Und jetzt oben auf die Backenzähne. Hin und her!",
    mouth: "open",
    surface: "top",
    teeth: leftToRight(teeth(["upper"], ["left", "right"], [3, 4])),
    motion: "scrub",
    view: { open: 1, pitch: 0, yaw: 0, look: [0, 10, 100], zoom: 1.2, tilt: { upper: -60, lower: 0 } },
  },
  {
    id: "outer-left",
    title: "⬅️ Außen an der Seite",
    hint: "Außenflächen: kleine Kreise",
    cue: "Zähne zusammenbeißen! Außen an der Seite. Kleine Kreise!",
    mouth: "closed",
    surface: "outer",
    teeth: teeth(["upper", "lower"], ["left"], [4, 3, 2]).sort((a, b) => b.n - a.n),
    motion: "circle",
    view: { open: 0, pitch: 4, yaw: 42, look: [-70, 18, 70], zoom: 1.4, tilt: FLAT },
  },
  {
    id: "outer-front",
    title: "😁 Außen vorne",
    hint: "Außenflächen: kleine Kreise",
    cue: "Jetzt vorne. Kreise, Kreise, Kreise!",
    mouth: "closed",
    surface: "outer",
    teeth: leftToRight(teeth(["upper", "lower"], ["left", "right"], [0, 1])),
    motion: "circle",
    view: CLOSED_FRONT,
  },
  {
    id: "outer-right",
    title: "➡️ Außen an der Seite",
    hint: "Außenflächen: kleine Kreise",
    cue: "Und die andere Seite. Schön kreisen!",
    mouth: "closed",
    surface: "outer",
    teeth: teeth(["upper", "lower"], ["right"], [2, 3, 4]).sort((a, b) => a.n - b.n),
    motion: "circle",
    view: { open: 0, pitch: 4, yaw: -42, look: [70, 18, 70], zoom: 1.4, tilt: FLAT },
  },
  {
    id: "inner-lower",
    title: "👅 Innen unten",
    hint: "Innenflächen: von Rot nach Weiß",
    cue: "Mund weit auf! Jetzt innen unten, da wo die Zunge ist.",
    mouth: "open",
    surface: "inner",
    teeth: leftToRight(teeth(["lower"], ["left", "right"], [0, 1, 2, 3, 4])),
    motion: "wipe",
    view: { open: 1, pitch: 0, yaw: 0, look: [0, -10, 100], zoom: 1.2, tilt: { upper: 0, lower: 72 } },
  },
  {
    id: "inner-upper",
    title: "👅 Innen oben",
    hint: "Innenflächen: von Rot nach Weiß",
    cue: "Und innen oben. Fast geschafft!",
    mouth: "open",
    surface: "inner",
    teeth: leftToRight(teeth(["upper"], ["left", "right"], [0, 1, 2, 3, 4])),
    motion: "wipe",
    view: { open: 1, pitch: 0, yaw: 0, look: [0, 10, 100], zoom: 1.2, tilt: { upper: -72, lower: 0 } },
  },
];

/** Title, hint or cue of `step` in `language` and the voice for it; the German one with the German voice where there is no translation. */
export const stepText = (step: Step, key: keyof StepTexts, language: TargetLanguage): Spoken =>
  spokenIn({ de: step[key], ru: STEP_TEXTS_RU[step.id]?.[key] }, language);

/** While the monsters arrive and when everything is clean: a big grin. */
export const GRIN_VIEW = CLOSED_FRONT;
