import { type PointerEvent, useCallback, useEffect, useState } from "react";
import { useInnerBack } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { moodImages, preloadImages } from "./images";
import { useAnyKey, usePickKeys } from "./moodGroups";
import { BREATH_MS, CALM_DONE, CALM_LINE, NEEDS, NEEDS_QUESTION, type Need } from "./needs";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, Frames, useTimers, useVoice } from "./shared";

/** A need's picture: the little bear doing it alone. */
const pictureOf = (need: Need) => moodImages.need(need.id);

/**
 * Was brauche ich? (C-31, a game of its own since November 2026, user feedback): cards of what the child may need or
 * want now – a hug, being alone a little, romping, stamping and blowing, a drink, something to eat, a rest, a song. None is
 * wrong; the one picked shows big and the voice says it does good, so the grown-up sees what the child needs.
 * „Stampfen und pusten“ blows two slow breaths together. The corner goes back to all the cards.
 */
export function NeedsPlay({ settings }: { settings: FeelingsSettings }) {
  const [need, setNeed] = useState<Need>();
  const { say, preload } = useVoice(settings);
  const { later, clearAll } = useTimers();
  const t = useT();

  useEffect(() => {
    preloadImages(NEEDS.map(pictureOf));
    preload([...NEEDS.map((n) => t(n.answer)), t(CALM_LINE), t(CALM_DONE)]);
  }, []);

  // The question each time the cards come, also back from one.
  useEffect(() => {
    if (!need) say(t(NEEDS_QUESTION));
  }, [need]);

  useInnerBack(
    need
      ? () => {
          clearAll();
          setNeed(undefined);
        }
      : undefined,
  );

  const answer = useCallback(
    (picked: Need) => {
      clearAll();
      if (picked.together) {
        // Two slow breaths together, then „Schon besser.“
        say(t(CALM_LINE));
        later(() => say(t(CALM_DONE)), 2 * BREATH_MS);
      } else say(t(picked.answer));
    },
    [say, t, later, clearAll],
  );
  const pick = useCallback(
    (picked: Need) => {
      setNeed(picked);
      answer(picked);
    },
    [answer],
  );
  /** Tapped (or any key) while one is shown big: it is said again, and the breaths start again. */
  const again = useCallback(() => {
    if (!need) return;
    answer(need);
  }, [need, answer]);
  usePickKeys(!need, NEEDS, pick);
  useAnyKey(!!need, again);

  return (
    <main className="mood-play">
      {need ? (
        <div className="mood-big">
          <button
            type="button"
            className="mood-big-picture"
            data-tap
            aria-label={t(need.caption)}
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              again();
            }}
          >
            <Frames name={pictureOf(need)} moving={false} className="fg-card-image" />
          </button>
          <span className="fg-caption mood-big-caption">{t(need.caption)}</span>
        </div>
      ) : (
        <div className="mood-needs">
          {NEEDS.map((n) => (
            <ChoiceCard key={n.id} image={pictureOf(n)} caption={t(n.caption)} state="choose" onChoose={() => pick(n)} />
          ))}
        </div>
      )}
    </main>
  );
}
