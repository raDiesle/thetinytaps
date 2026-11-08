import voiceFiles from "./stimme/**/*.mp3?glob";
import { recordedVoice } from "@/lib/voice";

// What the animals and the small ones say, from their ElevenLabs recordings (`bun run voice make --only tiere`,
// src/content/recordedLines.ts): one file per sentence in stimme/ (German; every other app language in
// stimme/<language>/, November 2026). A sentence not recorded yet stays silent. „Wer schaut da raus?“ (PeekPlay in src/games/shadows/)
// speaks with it too.

/** The game's voice: `say(text, language)` plays a sentence's recording, the German one where it is not translated. */
export const animalsVoice = recordedVoice(voiceFiles);
