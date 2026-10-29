import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { dayKey } from "@/games/teeth/daytime";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import { playChime, playPop, playTusch, playTwinkle, unlockAudio } from "@/lib/sfx";
import { type RoutineVisit, waitForStep } from "@/lib/routine";
import { speak, unlockSpeech } from "@/lib/speech";
import { forwardNearTaps } from "@/lib/tapTargets";
import { addStar, type LinkedDays, parseCellKey, type StarLog, takeBackStar } from "./board";
import { currentStep, exampleTicks, gameOf, nightsUntil, type Plan, restartDay, routineStep, stepsOn } from "./plan";
import { PLAN_SCREEN, PlanSheet, type StepState, useStepLabel } from "./PlanSheet";

/** How long „Zurück“ stays after a tick, for a grown-up whose child tapped too soon. */
const UNDO_MS = 8000;

/**
 * A plan on screen, as big as the room allows, and how its steps get done: the child taps the card that glows
 * („Jetzt“) when that step is done – it gets a tick with a sound and the next card glows. A card done before
 * twinkles, a later one wiggles and says when it comes („noch 2-mal schlafen“ in the week). The last tick of the day
 * is a party, and „↺ Von vorn“ starts the day again (after an Erst–Dann, the next one). The teeth card under „Jetzt“
 * opens Zähne putzen instead, which comes back here and ticks it by itself. A new plan shows example ticks until the
 * first tap.
 */
export function PlanScreen({
  plan,
  log,
  setLog,
  linked,
  day,
  sounds,
  speech,
  onExamplesOff,
}: {
  plan: Plan;
  log: StarLog;
  setLog: (log: StarLog) => void;
  linked: LinkedDays;
  /** The day shown: today, or another one a grown-up looks at (only today's cards can be ticked). */
  day: Date;
  sounds: boolean;
  speech: boolean;
  onExamplesOff: () => void;
}) {
  const t = useT();
  const language = useAppLanguage();
  const stepLabel = useStepLabel();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const box = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1.6);
  const [fresh, setFresh] = useState<string | null>(null);
  const [undo, setUndo] = useState<string | null>(null);
  const [party, setParty] = useState<string | null>(null);
  const { bursts, spawn } = useBursts();
  const today = new Date();
  const ticks = log[plan.id];
  const shown = plan.examples ? { ...exampleTicks(plan, today), ...ticks } : ticks;
  const todaySteps = stepsOn(plan, today);
  const allDone = todaySteps.length > 0 && currentStep(todaySteps, ticks, linked, today) === -1;

  const sound = (play: () => void) => sounds && play();
  // A line without its translation is German and gets the German voice.
  const say = (text: string) => speech && speak(text, voiceFor(text, language));

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setAspect(el.clientWidth / Math.max(1, el.clientHeight)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Taps a little next to a card still count for it (see tapTargets.ts).
  useEffect(() => (box.current ? forwardNearTaps(box.current) : undefined), []);

  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [undo]);

  useEffect(() => {
    setUndo(null);
    setFresh(null);
    setParty(null);
  }, [plan.id]);

  /** Restarts a short CSS animation on a card. */
  const poke = (el: Element, name: "wiggle" | "twinkle") => {
    el.classList.remove("wiggle", "twinkle");
    void (el as HTMLElement).offsetWidth;
    el.classList.add(name);
  };

  // Keys: the card to do now wiggles and says itself; a key never ticks it, only the child's tap on it does.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || (e.target as Element).closest("input, textarea, button, a, select")) return;
      unlockAudio();
      const now = box.current?.querySelector("[data-state='now']") ?? box.current?.querySelector("[data-state='done']");
      if (now) poke(now, now.getAttribute("data-state") === "now" ? "wiggle" : "twinkle");
      sound(playTwinkle);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const onPointerDown = (e: React.PointerEvent) => {
    unlockAudio();
    unlockSpeech();
    const header = (e.target as Element).closest<HTMLElement>("[data-day]");
    if (header) return sayDay(header);
    const el = (e.target as Element).closest<HTMLElement>("[data-step]");
    if (!el) return;
    // The first tap ends the examples and shows the plan as it really is.
    if (plan.examples) {
      onExamplesOff();
      sound(playPop);
      return;
    }
    const key = el.dataset.step as string;
    const state = el.dataset.state as StepState;
    const { day: stepDay, taskId } = parseCellKey(key);
    const steps = stepsOn(plan, stepDay);
    const index = steps.findIndex((step) => step.id === taskId);
    const step = steps[index];
    if (!step) return;
    const label = stepLabel(step);
    if (state === "done") {
      poke(el, "twinkle");
      sound(playTwinkle);
      say(label);
      return;
    }
    if (state === "later") {
      poke(el, "wiggle");
      sound(playPop);
      const nights = nightsUntil(today, stepDay);
      say(nights > 0 ? `${t({ de: nights === 1 ? "Noch einmal schlafen:" : `Noch ${nights}-mal schlafen:` })} ${label}` : label);
      return;
    }
    // The teeth card opens Zähne putzen; leaving comes back here, and a finished brushing ticks this card.
    const game = gameOf(step);
    if (game) {
      sound(playPop);
      waitForStep(pathname, routineStep(plan.id, key));
      navigate(game, { state: { returnTo: pathname } satisfies RoutineVisit });
      return;
    }
    // The card to do now: done, with a tick, and the next one glows.
    const next = addStar(log, plan.id, key, today);
    setLog(next);
    setFresh(key);
    setUndo(key);
    sound(playChime);
    const rect = el.getBoundingClientRect();
    spawn(rect.left + rect.width / 2, rect.top + rect.height / 2);
    const after = currentStep(steps, next[plan.id], linked, stepDay);
    if (after === -1) {
      setTimeout(() => {
        setParty(step.emoji);
        sound(playTusch);
        for (let i = 0; i < 10; i++) setTimeout(() => spawn(), i * 90);
        say(t({ de: "Alles geschafft! Hurra!" }));
      }, 450);
    } else {
      say(`${t({ de: "Super! Jetzt:" })} ${stepLabel(steps[after])}`);
    }
  };

  /** A day of the week tapped: it says when it is and what comes then. */
  const sayDay = (header: HTMLElement) => {
    poke(header, "wiggle");
    sound(playPop);
    const d = new Date(`${header.dataset.day}T12:00`);
    const nights = nightsUntil(today, d);
    const when =
      nights === 0
        ? t({ de: "Heute" })
        : nights === 1
          ? t({ de: "Morgen, noch einmal schlafen" })
          : nights > 1
            ? t({ de: `Noch ${nights}-mal schlafen` })
            : new Intl.DateTimeFormat(language.speechLang, { weekday: "long" }).format(d);
    say(`${when}: ${stepsOn(plan, d).map(stepLabel).join(", ")}`);
  };

  const takeBack = () => {
    if (!undo) return;
    setLog(takeBackStar(log, plan.id, undo));
    setUndo(null);
    setFresh(null);
  };

  return (
    <div className="rw-screen">
      <div ref={box} className="rw-screen-box" onPointerDown={onPointerDown}>
        <PlanSheet plan={plan} ticks={shown} linked={linked} today={today} day={day} look={PLAN_SCREEN} aspect={aspect} fresh={fresh} />
      </div>
      {plan.examples && (
        <div className="rw-example-note">
          <span>✨ {t({ de: "Die Haken sind nur ein Beispiel – mit dem ersten Tippen gehen sie weg." })}</span>
          <button type="button" onClick={onExamplesOff}>
            {t({ de: "Ausblenden" })}
          </button>
        </div>
      )}
      {!plan.examples && allDone && dayKey(day) === dayKey(today) && (
        <button type="button" className="pl-again" onClick={() => setLog(restartDay(log, plan.id, today))}>
          ↺ {t({ de: "Von vorn" })}
        </button>
      )}
      {undo && (
        <button type="button" className="rw-undo" onClick={takeBack}>
          ↶ {t({ de: "Zurück" })}
        </button>
      )}
      {party && (
        <button type="button" className="rw-party" onClick={() => setParty(null)}>
          <span className="rw-party-emoji" aria-hidden>
            {party}
          </span>
          <span className="rw-party-text">{t({ de: "Alles geschafft!" })}</span>
        </button>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
