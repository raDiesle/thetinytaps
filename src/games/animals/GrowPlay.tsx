import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { pick, useAppLanguage } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { GROW_MS, GROW_TEXTS, GrowthPicture } from "./growth";
import type { GrowRound } from "./levels";
import type { AnimalsSettings } from "./settings";
import { animalsVoice } from "./voice";

/** The picked one's flight up into the small one, before it starts to become it. */
const FLIGHT_MS = 500;
/** Time the small one of a wrong pick shows before the child can try again. */
const WRONG_MS = 1400;

interface Offset {
  x: number;
  y: number;
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** What a round of "Was wird aus mir?" gets from `AnimalsRounds`, which plays it in turn with the other kinds. */
export interface GrowPlayProps {
  settings: Pick<AnimalsSettings, "speech" | "sounds">;
  round: GrowRound;
  /** The right one was picked after `misses` wrong ones. */
  onSolved: (misses: number) => void;
  /** Its becoming has been watched: the next round may come. */
  onNext: () => void;
}

/**
 * "Was wird aus mir?" (Z-12), one round of "Was gehört zum Tier?": something small stands above (a caterpillar, an
 * egg, a seed, a tadpole), and the child taps what it becomes below. That one flies up into it, and the small one
 * becomes it: the caterpillar spins itself in and a butterfly flies out, the egg cracks, the seed grows into a
 * sunflower, the tadpole grows legs and hops onto a lily pad as a frog. A wrong pick shows the small one it comes from.
 */
export function GrowPlay({ settings, round, onSolved, onNext }: GrowPlayProps) {
  const language = useAppLanguage();
  const texts = pick(GROW_TEXTS, language.id);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The right one on its way up into the small one. */
  const [flight, setFlight] = useState<Offset | null>(null);
  /** The small one becoming what it becomes. */
  const [growing, setGrowing] = useState(false);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped to make the small one hop when it is tapped to ask once more. */
  const [nudge, setNudge] = useState(0);
  const { effects, ripple, celebrate } = useTapFeedback();
  /** Wrong ones picked in this round, for the difficulty. */
  const misses = useRef(0);
  const youngRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Its ElevenLabs recording; a sentence not translated yet is said in German.
  const say = useCallback((text: string, queue = false) => animalsVoice.say(text, language.id, { queue }), [language.id]);

  // The question comes with the round; the round is mounted anew for every small one.
  useEffect(() => say(texts.whatBecomes(round.growth)), []);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  const choose = (index: number) => {
    if (busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });

    if (!ok) {
      // Never a "wrong" for the child; only the difficulty takes note. The small one it comes from pops up.
      misses.current++;
      if (settings.sounds) later(250, playPop);
      say(texts.comesFrom(round.grown[index]));
      say(texts.whatBecomes(round.growth), true);
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    // It flies up into the small one and is gone; then the small one becomes it.
    const from = optionRefs.current[index]?.getBoundingClientRect();
    const to = youngRef.current?.getBoundingClientRect();
    if (from && to) {
      const start = centre(from);
      const end = centre(to);
      setFlight({ x: end.x - start.x, y: end.y - start.y });
    }
    later(FLIGHT_MS, () => setGrowing(true));
    if (settings.sounds) {
      later(200, playChime);
      for (const [ms, sound] of round.growth.sounds) later(FLIGHT_MS + ms, sound);
    }
    say(texts.becomes(round.growth));
    onSolved(misses.current);
    later(FLIGHT_MS + GROW_MS - 900, () => {
      celebrate();
    });
    later(FLIGHT_MS + GROW_MS, onNext);
  };

  /** Tapping the small one asks again; it hops. */
  const onYoungDown = (e: PointerEvent) => {
    e.stopPropagation();
    if (busy.current) return;
    say(texts.whatBecomes(round.growth));
    if (settings.sounds) playPop();
    setNudge((n) => n + 1);
  };

  const onChoiceDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    choose(index);
  };

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (outcome) {
        softTap();
        return;
      }
      const count = round.grown.length;
      const digit = Number(e.key);
      // Read and set through the ref: fast key presses come before React has rendered the last one.
      const move = (to: number) => {
        focusRef.current = to;
        setFocus(to);
      };
      const current = focusRef.current;
      if (Number.isInteger(digit) && digit >= 1 && digit <= count) {
        move(digit - 1);
        choose(digit - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (current === null) move(0);
        else choose(current);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        move(((current ?? 0) - 1 + count) % count);
      } else {
        move(current === null ? 0 : (current + 1) % count);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <div className="animals-play kind-grow" onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      <div className="ap-top">
        <div ref={youngRef} className={`ap-young${nudge && !growing ? ` nudge-${nudge % 2}` : ""}`} data-tap onPointerDown={onYoungDown}>
          <GrowthPicture growth={round.growth} growing={growing} label={growing ? texts.adult(round.growth) : texts.young(round.growth)} />
        </div>
      </div>
      <div className="ap-ground">
        <div className="ap-options" style={{ "--n": round.grown.length } as CSSProperties}>
          {round.grown.map((g, i) => {
            const shown = outcome?.pick === i;
            return (
              <div
                key={g.id}
                className={`ap-option ap-plate${focus === i ? " focused" : ""}`}
                data-tap={tapState({ goal: i === round.correct })}
                onPointerDown={onChoiceDown(i)}
              >
                {shown && !outcome.ok && (
                  <span className="ap-giver ap-grow-from" aria-hidden>
                    <GrowthPicture growth={g} />
                  </span>
                )}
                <span
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  className={`ap-food ap-emoji${shown && outcome.ok ? " landed" : ""}${shown && !outcome.ok ? " refused" : ""}`}
                  style={shown && outcome.ok && flight ? { translate: `${flight.x}px ${flight.y}px`, scale: "0.3" } : undefined}
                  role="img"
                  aria-label={texts.adult(g)}
                >
                  {g.emoji}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <FeedbackLayer effects={effects} />
    </div>
  );
}
