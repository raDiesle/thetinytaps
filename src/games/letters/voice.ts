import { useCallback } from "react";
import voiceFiles from "./stimme/**/*.mp3?glob";
import { useAppLanguage } from "@/lib/language";
import { recordedVoice } from "@/lib/voice";

// What Buchstaben & Zahlen says, from its ElevenLabs recordings (`bun run voice make --only buchstaben`,
// src/content/recordedLines.ts): one file per line in stimme/ (German; the other languages only once the user asks
// for them). A line not recorded yet stays silent. The language pack follows the app language, so its lines are said
// in that language.

/** The game's voice. */
export const lettersVoice = recordedVoice(voiceFiles);

/** Says a line of the language pack from its recording; `queue` waits for what is being said. */
export function useLettersSay() {
  const { id } = useAppLanguage();
  return useCallback((text: string, queue = false) => lettersVoice.say(text, id, { queue }), [id]);
}
