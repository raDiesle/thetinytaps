import { useCallback, useEffect, useRef } from "react";
import { useAppLanguage } from "@/lib/language";
import { pageMoving } from "@/lib/pageMotion";
import { voiceQuiet } from "@/lib/voice";
import { animalsVoice } from "./voice";

/** How often a round looks whether the voice has finished. */
const QUIET_CHECK_MS = 100;

/**
 * A round's timers, all cleared when the round goes: `later` runs after `ms`; `whenQuiet` after `ms` and then only once
 * nothing is said or waiting to be said and the page lies still – so a round goes on to the next (or lets the child pick
 * again) only when its line is over, never cutting it off (user feedback, November 2026).
 */
export function useRoundTime() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  const whenQuiet = useCallback(
    (ms: number, run: () => void) => {
      const check = () => {
        if (voiceQuiet() && !pageMoving()) run();
        else later(QUIET_CHECK_MS, check);
      };
      later(ms, check);
    },
    [later],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return { later, whenQuiet };
}

/**
 * Says a line of the game from its ElevenLabs recording (silent where the app language has none). Every line waits for
 * the one being said: none is ever cut off, not by the next round's question nor by a quick pick (user feedback,
 * November 2026: the voice was cut when the round changed).
 */
export function useSay() {
  const language = useAppLanguage().id;
  return useCallback((text: string) => animalsVoice.say(text, language, { queue: true }), [language]);
}
