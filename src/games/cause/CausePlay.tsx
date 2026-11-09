import { useCallback, useEffect, useState } from "react";
import { Mascot } from "@/components/Mascot";
import { GameEnd } from "@/components/GameEnd";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { playPlop, playTwinkle } from "@/lib/sfx";
import { useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { CAUSE_QUESTION, CAUSE_ROUNDS, type CauseOption } from "./rounds";

/** How long the right picture stays before the next round comes; the child's face has changed by then. */
const NEXT_MS = 2600;

/**
 * „Was ist passiert?“: the child shows a feeling, and the child taps the picture of what happened. The right one lets
 * the child's face change (crying → smiling, a grown-up claps); the other one only makes the child shake its head
 * gently and goes on waiting. Digits pick that option, any other key one at random. After the last round the end
 * shows „Nochmal“, the rounds start again.
 */
export function CausePlay() {
  const t = useT();
  const { effects, ripple, glow } = useTapFeedback();
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  /** Counts the wrong pictures of this round; a new count replays the head shake. */
  const [wrongs, setWrongs] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = CAUSE_ROUNDS[round];
  const solved = picked !== null;

  const pick = useCallback(
    (option: CauseOption, x?: number, y?: number) => {
      if (solved || finished) return;
      if (option.fits) {
        setPicked(option.id);
        playTwinkle();
        glow(x, y);
      } else {
        setWrongs((n) => n + 1);
        playPlop();
        ripple(x, y);
      }
    },
    [solved, finished, glow, ripple],
  );

  // Once the right picture is chosen, the next round comes after a moment; after the last one the end is shown.
  useEffect(() => {
    if (!solved) return;
    const timer = setTimeout(() => {
      if (round + 1 < CAUSE_ROUNDS.length) {
        setRound((r) => r + 1);
        setPicked(null);
        setWrongs(0);
      } else setFinished(true);
    }, NEXT_MS);
    return () => clearTimeout(timer);
  }, [solved, round]);

  // Digits pick that picture, any other key one at random.
  useEffect(() => {
    if (finished) return;
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const digit = Number(e.key) - 1;
      const options = current.options;
      pick(options[digit >= 0 && digit < options.length ? digit : Math.floor(Math.random() * options.length)]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [finished, current, pick]);

  const again = () => {
    setRound(0);
    setPicked(null);
    setWrongs(0);
    setFinished(false);
  };

  // The child's face: as it is at first, a smile once the right picture is found (a grin stays a grin).
  const mouth = solved && current.before !== "grin" ? "smile" : current.before;

  return (
    <main className="cause-play">
      <div className="cause-scene" key={current.id}>
        <div className="cause-kid" key={wrongs}>
          <div className={wrongs > 0 && !solved ? "cause-no" : undefined}>
            <Mascot kind={current.kind} child mouth={mouth} pose="stand" />
          </div>
        </div>
        <div className="cause-grown">
          <Mascot kind={current.kind} mouth="smile" pose={solved ? "clap" : "stand"} />
        </div>
      </div>
      <div className="cause-options">
        {current.options.map((option) => (
          <div key={option.id} className={`cause-choice${solved && picked !== option.id ? " pale" : ""}`}>
            <div
              className={`cause-option${picked === option.id ? " chosen" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={t(option.label)}
              data-tap={tapState({ goal: option.fits })}
              onPointerDown={(e) => pick(option, e.clientX, e.clientY)}
            >
              <span className="cause-emoji" aria-hidden="true">
                {option.emoji}
              </span>
            </div>
            <span className="cause-name" aria-hidden="true">
              {t(option.label)}
            </span>
          </div>
        ))}
      </div>
      <p className="cause-question">{t(CAUSE_QUESTION)}</p>
      {finished && <GameEnd onAgain={again} />}
      <FeedbackLayer effects={effects} />
    </main>
  );
}
