import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { useInnerBack } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { finishRoutineStep } from "@/lib/routine";
import { playCountNote } from "@/lib/sfx";
import { moodImages, preloadImages } from "./images";
import {
  loadMoodDay,
  MOOD_QUESTION,
  MOODS,
  type Mood,
  morningMood,
  saveMoodDay,
  STRENGTH_QUESTION,
  STRENGTH_STEPS,
  strengthAnswer,
  THIS_MORNING,
  withMood,
} from "./mood";
import { MoodGroups, usePickKeys } from "./moodGroups";
import { FeelingBear } from "./moodArt";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, Frames, useVoice } from "./shared";

/** A feeling's card: the little bear alone with it, in a moment that brings it (user feedback, November 2026). */
const cardImage = (mood: Mood) => moodImages.feeling(mood.id);

/** Where the slider starts: in the middle, so it can go either way. */
const START_STEP = Math.floor(STRENGTH_STEPS / 2);

/**
 * Wie geht's dir heute? The eight feelings' cards in two groups, the pleasant ones apart from the unpleasant ones; a tap
 * on one shows the little bear with it at once, and the child slides how strong it is – his gestures grow with it (C-36).
 * The corner in the top left goes back to all feelings (`useInnerBack`). In the evening the card picked this morning
 * says so under it (C-33). Copying the faces and what helps are games of their own (user feedback, November 2026).
 */
export function MoodPlay({ settings }: { settings: FeelingsSettings }) {
  const [mood, setMood] = useState<Mood>();
  const { say, preload } = useVoice(settings);
  const t = useT();
  // In the evening, the feeling picked this morning (C-33), read once.
  const [morning] = useState(() => morningMood(loadMoodDay(), new Date()));

  useEffect(() => {
    preloadImages(MOODS.map(cardImage));
    preload([t(STRENGTH_QUESTION), ...[0, 2, 4].map((s) => t(strengthAnswer(s)))]);
  }, []);

  // The question each time the cards come, also back from a feeling.
  useEffect(() => {
    if (!mood) say(t(MOOD_QUESTION));
  }, [mood]);

  useInnerBack(mood ? () => setMood(undefined) : undefined);

  const pick = useCallback(
    (picked: Mood) => {
      // The answer a plan's „Wie geht's dir?“ card waited for (the Tagesplan, rituals.ts): it is ticked on the way back.
      finishRoutineStep();
      const now = new Date();
      saveMoodDay(withMood(loadMoodDay(), picked.id, now));
      setMood(picked);
      say(t(STRENGTH_QUESTION));
    },
    [say, t],
  );

  usePickKeys(!mood, MOODS, pick);

  const card = (m: Mood) => (
    <ChoiceCard
      key={m.id}
      image={cardImage(m)}
      caption={m.id === morning ? `${t(THIS_MORNING)}: ${t(m.caption)}` : t(m.caption)}
      state="choose"
      onChoose={() => pick(m)}
    />
  );

  return <main className="mood-play">{mood ? <Strength key={mood.id} mood={mood} say={say} /> : <MoodGroups card={card} />}</main>;
}

/**
 * A feeling picked: its card and the little bear showing it, with the slider under him (C-36). Sliding changes his
 * gestures step by step, a note for each step (higher the stronger); let go, the voice says how strong it is.
 */
function Strength({ mood, say }: { mood: Mood; say: (text: string) => void }) {
  const t = useT();
  const [step, setStep] = useState(START_STEP);
  const [touched, setTouched] = useState(false);

  const changeTo = useCallback((next: number) => {
    setStep((now) => {
      if (now !== next) playCountNote(next);
      return next;
    });
  }, []);
  const settle = useCallback(
    (at: number) => {
      setTouched(true);
      say(t(strengthAnswer(at)));
    },
    [say, t],
  );

  // The arrows slide it, every other key moves it on and back again: every key does something.
  const way = useRef(1);
  const stepRef = useRef(step);
  stepRef.current = step;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const now = stepRef.current;
      let next: number;
      if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, now - 1);
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(STRENGTH_STEPS - 1, now + 1);
      else {
        if (now + way.current < 0 || now + way.current >= STRENGTH_STEPS) way.current = -way.current;
        next = now + way.current;
      }
      changeTo(next);
      settle(next);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [changeTo, settle]);

  return (
    <div className={`mood-strength ${mood.pleasant ? "pleasant" : "unpleasant"}`}>
      <div className="mood-strength-card">
        <div className="mood-pic">
          <Frames name={cardImage(mood)} moving={false} className="fg-card-image" />
        </div>
        <span className="fg-caption">{t(mood.caption)}</span>
      </div>
      <div className="mood-strength-bear">
        <FeelingBear mood={mood} step={step} steps={STRENGTH_STEPS} />
        <StrengthSlider step={step} onStep={changeTo} onRelease={settle} hint={!touched} label={t(STRENGTH_QUESTION)} />
      </div>
    </div>
  );
}

/**
 * The slider of „Wie doll ist es?“: a band from thin to thick, no numbers, and a big round knob slid along it or tapped
 * to (user feedback, November 2026). The knob follows the finger as an HTML layer moved by a transform (`--at`), the
 * bear changes only when a step is passed, and let go the knob settles on its step.
 */
function StrengthSlider({
  step,
  onStep,
  onRelease,
  hint,
  label,
}: {
  step: number;
  onStep: (step: number) => void;
  onRelease: (step: number) => void;
  /** Shows the still pointing hand under the knob, before the first slide. */
  hint: boolean;
  label: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const band = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const last = STRENGTH_STEPS - 1;

  /** Puts the knob where the finger is along the band, as an HTML layer moved by `--at`, and tells which step that is. */
  const follow = (e: PointerEvent<HTMLDivElement>) => {
    const box = band.current?.getBoundingClientRect();
    if (!box || box.width === 0) return step;
    const fraction = Math.min(1, Math.max(0, (e.clientX - box.left) / box.width));
    track.current?.style.setProperty("--at", String(fraction));
    const at = Math.round(fraction * last);
    onStep(at);
    return at;
  };
  /** The finger let go (or was taken away): the knob glides onto its step. */
  const letGo = (at: number) => {
    dragging.current = false;
    track.current?.classList.remove("dragging");
    track.current?.style.setProperty("--at", String(at / last));
  };
  // On its step whenever the step changes from elsewhere (a key).
  useEffect(() => {
    if (!dragging.current) track.current?.style.setProperty("--at", String(step / last));
  }, [step, last]);

  return (
    <div
      ref={track}
      className="mood-slider"
      data-tap-keep
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={last}
      aria-valuenow={step}
      onPointerDown={(e) => {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = true;
        track.current?.classList.add("dragging");
        follow(e);
      }}
      onPointerMove={(e) => {
        if (dragging.current) follow(e);
      }}
      onPointerUp={(e) => {
        if (!dragging.current) return;
        const at = follow(e);
        letGo(at);
        onRelease(at);
      }}
      onPointerCancel={() => letGo(step)}
    >
      <svg ref={band} className="mood-band" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
        <path d="M6 34 L394 6 Q398 30 394 54 L6 38 Z" />
      </svg>
      <span className="mood-knob" aria-hidden>
        {hint && <span className="mood-hand">👆</span>}
      </span>
    </div>
  );
}
