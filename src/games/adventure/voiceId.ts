import type { StepLines } from "./stories/story";

// The lines a story says, as they are recorded; the file of each is named by src/lib/voiceName.ts.

/** What kind of line it is; the recording script gives each kind its own way of saying it. */
export type SpokenKind = "opening" | "situation" | "instruction" | "turn" | "again" | "more" | "praise";

/** One line the guide says, as it is recorded. */
export interface SpokenLine {
  text: string;
  kind: SpokenKind;
}

/** Every line a story says, in order, without repeats; `defaultTurn` where a step has no `turn`. */
export function spokenLines(opening: { text: string }[], steps: StepLines[], defaultTurn: string): SpokenLine[] {
  const all: SpokenLine[] = opening.map(({ text }) => ({ text, kind: "opening" }));
  for (const step of steps) {
    if (step.situation) all.push({ text: step.situation, kind: "situation" });
    all.push({ text: step.instruction, kind: "instruction" });
    all.push({ text: step.turn ?? defaultTurn, kind: "turn" });
    if (step.again) all.push({ text: step.again, kind: "again" });
    for (const { text } of step.more ?? []) all.push({ text, kind: "more" });
    all.push({ text: step.praise, kind: "praise" });
  }
  const seen = new Set<string>();
  return all.filter(({ text }) => !seen.has(text) && seen.add(text));
}
