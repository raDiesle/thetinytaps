import recordingFiles from "./stories/*/stimme/**/*.mp3?glob";
import type { TargetLanguage } from "@/content/targetLanguages";
import { recordedVoice } from "@/lib/voice";
import { DEFAULT_TURN, type Story } from "./stories/story";
import { spokenLines } from "./voiceId";

// Tapsi's recorded voice: a warm coach voice made with ElevenLabs (`bun run voice`), one file per line in the
// story's stimme/ folder (German) or stimme/<language>/ (the others), played by src/lib/voice.ts. Tapsi says every
// movement, so a line not recorded yet is said by the browser's voice meanwhile.

const voice = recordedVoice(recordingFiles, { browser: true });

/** Starts loading the recordings of a story's lines (already in `language`), so each plays right when it is due. */
export function loadVoice(story: Story, language: TargetLanguage) {
  voice.load(
    spokenLines(story.opening?.lines ?? [], story.lines, DEFAULT_TURN).map((l) => l.text),
    language.id,
  );
}

/**
 * Says `text` (a line in `language`) from its recording, or with the browser's voice until it has one.
 * Cuts off what is being said unless `queue`, which waits for it.
 */
export const say = (text: string, language: TargetLanguage, options?: { queue?: boolean }) => voice.say(text, language.id, options);

export { hush, talking } from "@/lib/voice";
