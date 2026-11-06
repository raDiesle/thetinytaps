// The eight feelings in two groups, of „Wie geht's dir?“: the pleasant ones on a warm panel,
// the unpleasant ones on a cool one, side by side or one above the other (user feedback, November 2026: good
// and bad feelings apart, as categories). Each panel names its group small, for grown-ups.

import { type ReactNode, useEffect } from "react";
import { useT } from "@/lib/language";
import { MOODS, type Mood, PLEASANT, UNPLEASANT } from "./mood";

/** The two panels of feelings, each card drawn by `card`. */
export function MoodGroups({ card }: { card: (mood: Mood) => ReactNode }) {
  const t = useT();
  return (
    <div className="mood-groups">
      {[true, false].map((pleasant) => (
        <section key={String(pleasant)} className={`mood-group ${pleasant ? "pleasant" : "unpleasant"}`}>
          <h2 className="mood-group-name">{t(pleasant ? PLEASANT : UNPLEASANT)}</h2>
          <div className="mood-cards">{MOODS.filter((m) => m.pleasant === pleasant).map(card)}</div>
        </section>
      ))}
    </div>
  );
}

/**
 * Keys while the cards are shown (`active`): a digit picks that card, any other key one at random – every key does
 * something.
 */
export function usePickKeys<T>(active: boolean, items: readonly T[], pick: (item: T) => void) {
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const digit = Number(e.key) - 1;
      pick(items[digit >= 0 && digit < items.length ? digit : Math.floor(Math.random() * items.length)]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, items, pick]);
}
