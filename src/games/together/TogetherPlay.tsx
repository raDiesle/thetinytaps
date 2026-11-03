import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { pick, useAppLanguage } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import type { TogetherRound } from "./levels";
import { PairPicture, PartnerIcon } from "./PairPicture";
import { TOGETHER_TEXTS, WORK_MS } from "./pairs";
import type { TogetherSettings } from "./settings";
import { togetherVoice } from "./voice";

/** The picked partner's flight up into the picture, before the two set to work. */
const FLIGHT_MS = 500;
/** Time the one a wrong pick belongs to shows before the child can try again. */
const WRONG_MS = 1400;

interface Offset {
  x: number;
  y: number;
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** What a round gets from `TogetherRounds`, which plays the two kinds in turn. */
export interface TogetherPlayProps {
  settings: Pick<TogetherSettings, "speech" | "sounds">;
  round: TogetherRound;
  /** The right one was picked after `misses` wrong ones. */
  onSolved: (misses: number) => void;
  /** The two have done what they are for: the next round may come. */
  onNext: () => void;
}

/**
 * One round of "Was gehört zusammen?": a thing of the day or a helper stands above, and the child taps what belongs
 * to it below. That one flies up into the picture, and the two do what they are for: the toothpaste squeezes a blob
 * onto the brush, the key turns and the door opens, the hose puts out the fire, the scissors snip. A wrong pick shows
 * the one it belongs to over its plate; it is never shown as wrong.
 */
export function TogetherPlay({ settings, round, onSolved, onNext }: TogetherPlayProps) {
  const language = useAppLanguage();
  const texts = pick(TOGETHER_TEXTS, language.id);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The right one on its way up into the picture. */
  const [flight, setFlight] = useState<Offset | null>(null);
  /** The two doing what they are for. */
  const [working, setWorking] = useState(false);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped to make the picture hop when it is tapped to ask once more. */
  const [nudge, setNudge] = useState(0);
  const { bursts, spawn } = useBursts();
  /** Wrong ones picked in this round, for the difficulty. */
  const misses = useRef(0);
  const topRef = useRef<HTMLDivElement>(null);
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
  const say = useCallback((text: string, queue = false) => togetherVoice.say(text, language.id, { queue }), [language.id]);
  // Its few sentences load as the game starts, so even the first is heard right away.
  useEffect(() => togetherVoice.loadAll(language.id), [language.id]);

  // The question comes with the round; the round is mounted anew for every pair.
  useEffect(() => say(texts.question(round.pair)), []);

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  const choose = (index: number) => {
    if (busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });

    if (!ok) {
      // Never a "wrong" for the child; only the difficulty takes note. The one it belongs to pops up.
      misses.current++;
      if (settings.sounds) later(250, playPop);
      say(texts.belongs(round.choices[index]));
      say(texts.question(round.pair), true);
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    // It flies up into the picture and is gone; then the two set to work.
    const from = optionRefs.current[index]?.getBoundingClientRect();
    const to = topRef.current?.getBoundingClientRect();
    if (from && to) {
      const start = centre(from);
      const end = centre(to);
      setFlight({ x: end.x - start.x, y: end.y - start.y });
    }
    later(FLIGHT_MS, () => setWorking(true));
    if (settings.sounds) {
      later(200, playChime);
      for (const [ms, sound] of round.pair.sounds) later(FLIGHT_MS + ms, sound);
    }
    say(texts.right(round.pair));
    onSolved(misses.current);
    later(FLIGHT_MS + WORK_MS - 900, () => {
      for (let i = 0; i < 8; i++) spawn();
    });
    later(FLIGHT_MS + WORK_MS, onNext);
  };

  /** Tapping the picture asks again; it hops. */
  const onTopDown = (e: PointerEvent) => {
    e.stopPropagation();
    if (busy.current) return;
    say(texts.question(round.pair));
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
        funBurst();
        return;
      }
      const count = round.choices.length;
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
    <div className={`together-play kind-${round.kind}`} onPointerDown={(e) => funBurst(e.clientX, e.clientY)}>
      <div className="tg-top">
        <div ref={topRef} className={`tg-above${nudge && !working ? ` tg-nudge-${nudge % 2}` : ""}`} data-tap onPointerDown={onTopDown}>
          <PairPicture pair={round.pair} working={working} label={texts.name(round.pair)} />
        </div>
      </div>
      <div className="tg-ground">
        <div className="tg-options" style={{ "--n": round.choices.length } as CSSProperties}>
          {round.choices.map((p, i) => {
            const shown = outcome?.pick === i;
            return (
              <div
                key={p.id}
                className={`tg-option${focus === i ? " focused" : ""}`}
                data-tap={tapState({ goal: i === round.correct })}
                onPointerDown={onChoiceDown(i)}
              >
                {shown && !outcome.ok && (
                  <span className="tg-owner" aria-hidden>
                    <PairPicture pair={p} />
                  </span>
                )}
                <span
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  className={`tg-partner${shown && outcome.ok ? " landed" : ""}${shown && !outcome.ok ? " refused" : ""}`}
                  style={shown && outcome.ok && flight ? { translate: `${flight.x}px ${flight.y}px`, scale: "0.4" } : undefined}
                  role="img"
                  aria-label={texts.partner(p)}
                >
                  <PartnerIcon partner={p.partner} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <BurstLayer bursts={bursts} />
    </div>
  );
}
