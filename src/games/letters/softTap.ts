import { useCallback, useMemo } from "react";
import { playRandomNote } from "@/lib/sfx";
import { EXTRA_SOUND_GAP_MS, spaced } from "@/lib/spacing";

/**
 * A key or tap that sets nothing off (too quick after the last one, a key pressed again during its pause, a tap beside
 * the card): soft rings where it landed, and a soft note at most every `EXTRA_SOUND_GAP_MS` – a child hammering keys
 * heard a note at every press (user feedback, November 2026). `quiet` leaves the note out: the same key pressed again
 * during its pause (`repeatPause`) only ripples.
 */
export function useSoftTap(ripple: (x?: number, y?: number) => void, sounds: boolean) {
  const notes = useMemo(() => spaced(EXTRA_SOUND_GAP_MS), []);
  return useCallback(
    (x?: number, y?: number, quiet = false) => {
      ripple(x, y);
      if (sounds && !quiet && notes.pass()) playRandomNote();
    },
    [ripple, sounds, notes],
  );
}
