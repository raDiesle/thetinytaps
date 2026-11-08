import voiceFiles from "./stimme/**/*.mp3?glob";
import { recordedVoice } from "@/lib/voice";

// What Aufs Töpfchen says, from its ElevenLabs recordings (`bun run voice make --only toepfchen`,
// src/content/recordedLines.ts): one file per sentence in stimme/ (German; every other app language in
// stimme/<language>/, November 2026). A sentence not recorded yet stays silent.

/** The game's voice: `say(text, language)` plays a sentence's recording, the German one where it is not translated. */
export const pottyVoice = recordedVoice(voiceFiles);
