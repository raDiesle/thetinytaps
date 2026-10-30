import voiceFiles from "./stimme/**/*.mp3?glob";
import type { TargetLanguage } from "@/content/targetLanguages";
import { recordedVoice } from "@/lib/voice";
import { spokenIn } from "./phrases";

// What the stories, levels and films say, from their ElevenLabs recordings (`bun run voice make`,
// src/content/recordedLines.ts): one file per sentence in stimme/ (German) or stimme/<language>/.

const voice = recordedVoice(voiceFiles);

/** Says a German sentence of the game in `language`, or in German where its phrasebook has no translation. */
export function sayIn(german: string, language: TargetLanguage) {
  voice.say(spokenIn(german, language).text, language.id);
}
