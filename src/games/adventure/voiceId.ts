import type { StepLines } from "./stories/story";

// Which recording belongs to which line: the file name is a short hash of the
// line's text, so a changed line has no recording until it is made again. No
// imports at run time, so scripts/elevenlabs-voice.mjs can use it in Node too.

/** The file name (without .mp3) of the recording of `text`: FNV-1a over its characters, 8 hex digits. */
export function voiceId(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

/**
 * The file name (without .mp3) of the recording of `text` in `language`: the hash for German
 * (stimme/<hash>.mp3), the language in front for the others (stimme/en/en-<hash>.mp3), so the
 * build can leave those out of what every phone keeps offline (tools/build.ts).
 */
export const recordingName = (text: string, language: string) => (language === "de" ? voiceId(text) : `${language}-${voiceId(text)}`);

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
