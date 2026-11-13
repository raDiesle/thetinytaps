import { type PointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { choiceRows } from "@/games/shadows/levels";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { pick, useAppLanguage } from "@/lib/language";
import { screenChanged, screenTap } from "@/lib/tapGuard";
import { distanceToRect, TAP_SLOP_PX, tapState } from "@/lib/tapTargets";
import type { TogetherRound } from "./levels";
import { PairPicture, PartnerIcon } from "./PairPicture";
import { TOGETHER_TEXTS, type TogetherTexts, WORK_MS } from "./pairs";
import type { TogetherSettings } from "./settings";
import { togetherVoice } from "./voice";

/** The picked partner's flight up into the picture, before the two set to work. */
const FLIGHT_MS = 500;
/** Time the one a wrong pick belongs to shows before the child can try again. */
const WRONG_MS = 1400;
/** A finger that moves less than this is a tap on its plate, not a drag. */
const TAP_PX = 12;

interface Offset {
  x: number;
  y: number;
}

const centre = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/**
 * Every line `round` may say: its question, the praise of the right pick and, for each wrong choice, whom it belongs
 * to. A round starts only once they are loaded, so each comes at its moment.
 */
export function roundLines(round: TogetherRound, texts: TogetherTexts): string[] {
  return [texts.question(round.pair), texts.right(round.pair), ...round.choices.filter((p) => p !== round.pair).map((p) => texts.belongs(p))];
}

/** What a round gets from `TogetherRounds`, which plays the two kinds in turn. */
export interface TogetherPlayProps {
  settings: Pick<TogetherSettings, "speech" | "sounds">;
  round: TogetherRound;
  /** The right one was picked after `misses` wrong ones. */
  onSolved: (misses: number) => void;
  /** The two have done what they are for: the next round may come. */
  onNext: () => void;
  /** What the round is about, for grown-ups: shown small under the picture (`RoundTopic`). */
  topic: ReactNode;
  /** The way back to the round before (`StepBack`), in the choices' bottom left corner, never over the picture. */
  back?: ReactNode;
}

/** Whether (x, y) lies on `r` or within a finger's slop of it (`TAP_SLOP_PX`): small fingers don't aim well. */
const near = (r: DOMRect, x: number, y: number) => distanceToRect(x, y, r) <= TAP_SLOP_PX;

/**
 * One round of "Was gehört zusammen?": a thing of the day or a helper stands above, and the child taps what belongs
 * to it below, or drags it up onto the picture (user request, November 2026). That one flies up into the picture, and the two do what they are for: the toothpaste squeezes a blob
 * onto the brush, the key turns and the door opens, the hose puts out the fire, the scissors snip. A wrong pick shows
 * the one it belongs to over its plate; it is never shown as wrong.
 */
export function TogetherPlay({ settings, round, onSolved, onNext, topic, back }: TogetherPlayProps) {
  const language = useAppLanguage();
  const texts = pick(TOGETHER_TEXTS, language.id);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** The right one on its way up into the picture. */
  const [flight, setFlight] = useState<Offset | null>(null);
  /** The two doing what they are for. */
  const [working, setWorking] = useState(false);
  /** The partner being dragged and how far it is from its plate. */
  const [drag, setDrag] = useState<{ index: number; x: number; y: number } | null>(null);
  /** The finger on a plate: where it came down, and whether it has moved far enough to be a drag. */
  const pointer = useRef<{ id: number; index: number; x: number; y: number; moved: boolean; left: boolean } | null>(null);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  /** Bumped to make the picture hop when it is tapped to ask once more. */
  const [nudge, setNudge] = useState(0);
  const { effects, ripple } = useTapFeedback();
  /** Wrong ones picked in this round, for the difficulty. */
  const misses = useRef(0);
  const topRef = useRef<HTMLDivElement>(null);
  /** The plates, which stay where they are while their partner is dragged. */
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
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
    // A new round is a new screen: a second tap of the hand that brought it (or ◀) picks nothing on it (`tapGuard`).
    screenChanged();
    return () => pending.forEach(clearTimeout);
  }, []);

  // Its ElevenLabs recording; a sentence not translated yet is said in German.
  const say = useCallback((text: string, queue = false) => togetherVoice.say(text, language.id, { queue }), [language.id]);

  // The question comes with the round; the round is mounted anew for every pair, and only once its lines are loaded
  // (`roundLines`, `TogetherRounds`), so the question comes with the picture.
  useEffect(() => say(texts.question(round.pair)), []);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  const choose = (index: number) => {
    setDrag(null);
    if (busy.current) return;
    // A tap right after the round came (a double tap) picks nothing; it only ripples.
    if (!screenTap()) {
      softTap();
      return;
    }
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

    // It flies up into the picture from where it is (its plate, or where it was dropped) and is gone; then the two set
    // to work. Measured from its plate, which a drag leaves where it is.
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

  // A finger on a plate: let go there it picks it, dragged up onto the picture it picks it too; let go anywhere else
  // the partner goes back to its plate. Followed on the window, since a tap near a plate is handed to it (`tapTargets`)
  // while the finger's later events stay where it came down.
  const onChoiceDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    if (busy.current || pointer.current) return;
    pointer.current = { id: e.pointerId, index, x: e.clientX, y: e.clientY, moved: false, left: false };
  };

  useEffect(() => {
    const onMove = (e: globalThis.PointerEvent) => {
      const p = pointer.current;
      if (!p || p.id !== e.pointerId || busy.current) return;
      const x = e.clientX - p.x;
      const y = e.clientY - p.y;
      if (!p.moved && Math.hypot(x, y) < TAP_PX) return;
      p.moved = true;
      const plate = optionRefs.current[p.index]?.getBoundingClientRect();
      if (plate && !near(plate, e.clientX, e.clientY)) p.left = true;
      setDrag({ index: p.index, x, y });
    };
    const onUp = (e: globalThis.PointerEvent) => {
      const p = pointer.current;
      if (!p || p.id !== e.pointerId) return;
      pointer.current = null;
      const picture = topRef.current?.getBoundingClientRect();
      const plate = optionRefs.current[p.index]?.getBoundingClientRect();
      const onPicture = picture && near(picture, e.clientX, e.clientY);
      // A tap that slid a little is still a tap: let go on its own plate, never having left it, it picks it. One taken
      // away and brought back was put back.
      const onPlate = !p.left && plate && near(plate, e.clientX, e.clientY);
      if (!p.moved || onPicture || onPlate) choose(p.index);
      else setDrag(null);
    };
    const onCancel = (e: globalThis.PointerEvent) => {
      if (pointer.current?.id !== e.pointerId) return;
      pointer.current = null;
      setDrag(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  });

  // Arrow keys (or any key) move the frame, Space or Enter picks, 1–4 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (outcome) {
        softTap();
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
    <div className={`together-play kind-${round.kind}`} onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      <div className="tg-top">
        <div ref={topRef} className={`tg-above${nudge && !working ? ` tg-nudge-${nudge % 2}` : ""}`} data-tap onPointerDown={onTopDown}>
          <PairPicture pair={round.pair} working={working} live label={texts.name(round.pair)} />
        </div>
        {topic}
      </div>
      <div className="tg-ground">
        <div className="tg-options" style={choiceRows(round.choices.length)}>
          {round.choices.map((p, i) => {
            const shown = outcome?.pick === i;
            const dragged = drag?.index === i;
            const landed = shown && outcome.ok && flight;
            return (
              <div
                key={p.id}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                className={`tg-option${focus === i ? " focused" : ""}${dragged ? " dragged" : ""}`}
                data-tap={tapState({ goal: i === round.correct })}
                onPointerDown={onChoiceDown(i)}
              >
                {shown && !outcome.ok && (
                  <span className="tg-owner" aria-hidden>
                    <PairPicture pair={p} />
                  </span>
                )}
                <span
                  className={`tg-partner${shown && outcome.ok ? " landed" : ""}${dragged ? " dragging" : ""}`}
                  style={landed ? { translate: `${flight.x}px ${flight.y}px`, scale: "0.4" } : dragged ? { translate: `${drag.x}px ${drag.y}px` } : undefined}
                  role="img"
                  aria-label={texts.partner(p)}
                >
                  <PartnerIcon partner={p.partner} />
                </span>
                {/* Its name, small, for grown-ups; the child plays from the pictures. */}
                <span className="tg-name" aria-hidden>
                  {texts.partner(p)}
                </span>
              </div>
            );
          })}
        </div>
        {back}
      </div>
      <FeedbackLayer effects={effects} />
    </div>
  );
}
