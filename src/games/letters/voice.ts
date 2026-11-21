import { useCallback } from "react";
import voiceFiles from "./stimme/**/*.mp3?glob-by-language";
import { useAppLanguage } from "@/lib/language";
import { ASIDE_LINE_GAP_MS } from "@/lib/spacing";
import { recordedVoice } from "@/lib/voice";

// What Buchstaben & Zahlen says, from its ElevenLabs recordings (`bun run voice make --only buchstaben`,
// src/content/recordedLines.ts): one file per line in stimme/ (German; every other app language in stimme/<language>/, November
// 2026). A line not recorded yet stays silent. The language pack follows the app language, so its lines are said
// in that language.

/** The game's voice. */
export const lettersVoice = recordedVoice(voiceFiles);

/**
 * Says a line of the language pack from its recording; `queue` waits for what is being said. A line that may have no
 * text in the app language yet passes its `english`, whose recording stands in for a missing one.
 */
export function useLettersSay() {
  const { id } = useAppLanguage();
  return useCallback((text: string, queue = false, english?: string) => lettersVoice.say(text, id, { queue, english }), [id]);
}

/**
 * Says a line that only accompanies the play (praise after a letter or word found), after what is being said: at most
 * every `ASIDE_LINE_GAP_MS`, so quick rounds don't end in the same „Super!“ each time (root CLAUDE.md).
 */
export function useLettersPraise() {
  const { id } = useAppLanguage();
  return useCallback((text: string) => lettersVoice.say(text, id, { queue: true, gap: ASIDE_LINE_GAP_MS }), [id]);
}
