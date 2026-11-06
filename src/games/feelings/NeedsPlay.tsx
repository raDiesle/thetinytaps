import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/language";
import { moodImages, preloadImages } from "./images";
import { usePickKeys } from "./moodGroups";
import { BREATH_MS, CALM_DONE, CALM_LINE, NEEDS, NEEDS_QUESTION, type Need } from "./needs";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, useTimers, useVoice } from "./shared";

/** A need's picture: the little bear doing it alone. */
const pictureOf = (need: Need) => moodImages.need(need.id);

/**
 * Was brauche ich? (C-31, a game of its own since November 2026, user feedback): cards of what the child may need or
 * want now – a hug, being alone a little, romping, stamping and blowing, a drink, something to eat, a rest, a song. None is
 * wrong; a tap marks the one picked where it stands – the others go pale – and the voice says it does good, so the
 * grown-up sees what the child needs. It never shows big (user feedback, November 2026): the cards stay, and another
 * tap changes the choice. „Stampfen und pusten“ blows two slow breaths together.
 */
export function NeedsPlay({ settings }: { settings: FeelingsSettings }) {
  const [need, setNeed] = useState<Need>();
  const { say, preload } = useVoice(settings);
  const { later, clearAll } = useTimers();
  const t = useT();

  useEffect(() => {
    preloadImages(NEEDS.map(pictureOf));
    preload([NEEDS_QUESTION, ...NEEDS.map((n) => n.answer), CALM_LINE, CALM_DONE].map((line) => t(line)));
    say(t(NEEDS_QUESTION));
  }, []);

  /** Picked, or picked again: its line is said (again), and the breaths start again. */
  const pick = useCallback(
    (picked: Need) => {
      setNeed(picked);
      clearAll();
      if (picked.together) {
        // Two slow breaths together, then „Schon besser.“
        say(t(CALM_LINE));
        later(() => say(t(CALM_DONE)), 2 * BREATH_MS);
      } else say(t(picked.answer));
    },
    [say, t, later, clearAll],
  );
  usePickKeys(true, NEEDS, pick);

  return (
    <main className="mood-play">
      <div className="mood-needs">
        {NEEDS.map((n) => (
          <div key={n.id} className={`mood-need${need && need !== n ? " pale" : ""}`}>
            <ChoiceCard image={pictureOf(n)} caption={t(n.caption)} state="choose" onChoose={() => pick(n)} />
          </div>
        ))}
      </div>
    </main>
  );
}
