import voiceFiles from "./stimme/**/*.mp3?glob";
import { recordedVoice } from "@/lib/voice";

// What the game says, from its ElevenLabs recordings (`bun run voice make --only zusammen`,
// src/content/recordedLines.ts): one file per sentence in stimme/ (German; the other languages only once the user
// asks for them). A sentence not recorded yet stays silent.

/** The game's voice: `say(text, language)` plays a sentence's recording, the German one where it is not translated. */
export const togetherVoice = recordedVoice(voiceFiles);
