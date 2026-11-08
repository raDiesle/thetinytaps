import recordingFiles from "./stories/*/stimme/**/*.mp3?glob";
import type { TargetLanguage } from "@/content/targetLanguages";
import { waitingFor } from "@/lib/soundWait";
import { recordedVoice } from "@/lib/voice";
import { DEFAULT_TURN, type Story } from "./stories/story";
import { spokenLines } from "./voiceId";

// Tapsi's recorded voice: a warm coach voice made with ElevenLabs (`bun run voice`), one file per line in the
// story's stimme/ folder (German) or stimme/<language>/ (the others), played by src/lib/voice.ts. Tapsi says every
// movement, so a line not recorded yet is said by the browser's voice meanwhile.

const voice = recordedVoice(recordingFiles, { browser: true });

/** How many of a story's first lines must be there before it starts: the rest loads while they are said. */
const FIRST_LINES = 3;

/**
 * Starts loading the recordings of a story's lines (already in `language`; only the files, about 110 a story), so each
 * plays right when it is due, and gives a function that resolves once its first lines are there (or after
 * SOUND_WAIT_MS): the story starts then, so Tapsi's first line comes with it. Only while it is really waited for does the
 * paw track of `SoundLoading` show.
 */
export function loadVoice(story: Story, language: TargetLanguage): () => Promise<void> {
  const lines = spokenLines(story.opening?.lines ?? [], story.lines, DEFAULT_TURN).map((l) => l.text);
  const first = lines.slice(0, FIRST_LINES);
  const loaded = voice.ready(first, language.id);
  voice.load(lines, language.id);
  return () => (voice.isReady(first, language.id) ? loaded : waitingFor(loaded));
}

/**
 * Says `text` (a line in `language`) from its recording, or with the browser's voice until it has one.
 * Cuts off what is being said unless `queue`, which waits for it.
 */
export const say = (text: string, language: TargetLanguage, options?: { queue?: boolean }) => voice.say(text, language.id, options);

export { hush, talking } from "@/lib/voice";
