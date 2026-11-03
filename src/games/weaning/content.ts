import type { Localized } from "@/lib/language";

/** One page of the story, in the order it is told. */
export type StepId = "baby" | "grow" | "eat" | "cup" | "tell" | "goodbye" | "evening" | "sad" | "cuddle" | "book" | "bed" | "sleep" | "morning";

/** The light outside the window: the day's first half of the story, the evening and night, then the next morning. */
export type Sky = "day" | "night" | "morning";

/** One step of the story: what is drawn (`scene.tsx` by its id), what is said, and how long its moving part lasts. */
export interface Step {
  id: StepId;
  /** The sentence for this page: read out (its recording) and printed small under the picture for the grown-up reading along. */
  line: Localized;
  sky: Sky;
  /** How long its little animation and sounds run, ms; a tap sooner than `TAP_GUARD_MS` only sparkles. */
  ms: number;
}

/**
 * The story of „Abstillen“ (H-44): Tapsi was a baby and drank Mama's milk; now Tapsi is big, eats, drinks from a cup,
 * and says goodbye to Mama's milk. In the evening Tapsi wants it and is sad that it is gone – Mama is close, cuddles,
 * reads, sings – Tapsi falls asleep, and in the morning everybody is proud. Present tense, short, the way a grown-up
 * tells it to a child; nothing is wrong and nobody scolds.
 */
export const STEPS: Step[] = [
  { id: "baby", sky: "day", ms: 2400, line: { de: "Tapsi ist ein kleines Baby. Tapsi trinkt Milch bei Mama." } },
  { id: "grow", sky: "day", ms: 1600, line: { de: "Jetzt ist Tapsi schon groß! Tapsi kann laufen und springen." } },
  { id: "eat", sky: "day", ms: 1800, line: { de: "Tapsi isst wie die Großen. Mmh, ein Apfel!" } },
  { id: "cup", sky: "day", ms: 1600, line: { de: "Tapsi trinkt aus dem Becher. Ganz allein!" } },
  { id: "tell", sky: "day", ms: 1600, line: { de: "Mama sagt: Bald ist die Mama-Milch alle. Tapsi ist ja schon groß." } },
  { id: "goodbye", sky: "day", ms: 2600, line: { de: "Tapsi winkt: Tschüss, Mama-Milch! Danke!" } },
  { id: "evening", sky: "night", ms: 1600, line: { de: "Am Abend ist Tapsi müde. Tapsi möchte Mama-Milch." } },
  { id: "sad", sky: "night", ms: 2200, line: { de: "„Die Milch ist alle“, sagt Mama. Tapsi ist traurig. Mama ist ganz nah." } },
  { id: "cuddle", sky: "night", ms: 2000, line: { de: "Mama nimmt Tapsi fest in den Arm. Kuscheln geht immer!" } },
  { id: "book", sky: "night", ms: 1600, line: { de: "Mama liest Tapsi ein Buch vor." } },
  { id: "bed", sky: "night", ms: 3200, line: { de: "Tapsi kuschelt mit dem Teddy. Mama singt ein Schlaflied." } },
  { id: "sleep", sky: "night", ms: 2000, line: { de: "Tapsi schläft ein. Mama hat Tapsi lieb – immer." } },
  { id: "morning", sky: "morning", ms: 2400, line: { de: "Guten Morgen! Tapsi ist groß – Mama und Papa sind stolz." } },
];

/** The steps' sentences in German, for the list of what still waits for its recording (voiceLines.ts). */
export const GERMAN_LINES = STEPS.map((s) => s.line.de);
