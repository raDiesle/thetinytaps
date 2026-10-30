import voiceFiles from "./stimme/**/*.mp3?glob";
import type { TargetLanguage } from "@/content/targetLanguages";
import { recordedVoice } from "@/lib/voice";
import { spokenIn } from "./phrases";

// What the stories, levels and films say, from their ElevenLabs recordings (`bun run voice make`,
// src/content/recordedLines.ts): one file per sentence in stimme/ (German) or stimme/<language>/. The voice tells
// the story, so a sentence not recorded yet is said by the browser's voice meanwhile.

const voice = recordedVoice(voiceFiles, { browser: true });

/** Says a German sentence of the game in `language`, or in German where its phrasebook has no translation. */
export function sayIn(german: string, language: TargetLanguage) {
  const { text, speechLang } = spokenIn(german, language);
  voice.say(text, language.id, { speechLang });
}
