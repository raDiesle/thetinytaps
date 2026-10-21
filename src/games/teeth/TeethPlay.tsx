import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { useDevice } from "@/lib/device";
import { playChime, playCountNote, playPoof, playSqueak, playTuneNote, setSfxVolume } from "@/lib/sfx";
import { speak, stopSpeaking } from "@/lib/speech";
import { useWakeLock } from "@/lib/wakeLock";
import { lerpView, type ToothId, type View } from "./jaw";
import { Mouth, type MonsterSpot } from "./mouth";
import type { TeethSettings } from "./settings";
import { GRIN_VIEW, MONSTERS_PER_STEP, STEPS } from "./steps";
import "./teeth.css";

const MONSTER_COLORS = ["#8bd346", "#b388ff", "#ff9f43", "#ff7bd0", "#4cc9f0"];
/** Time for the monsters to show up and be greeted before the clock starts. */
const INTRO_MS = 4500;
const TICK_MS = 200;
const BEAT_MS = 280;
const TICKLE_MS = 700;
const TURN_MS = 1100;

interface Monster {
  id: number;
  tooth: ToothId;
  color: string;
  step: number;
  /** 0 goes first in its step. */
  order: number;
}

/** A few monsters on the teeth of every step, in the order the brush visits them. */
function placeMonsters(): Monster[] {
  return STEPS.flatMap((step, s) => {
    const picked = new Set<number>();
    while (picked.size < Math.min(MONSTERS_PER_STEP, step.teeth.length)) picked.add(Math.floor(Math.random() * step.teeth.length));
    return [...picked]
      .sort((a, b) => a - b)
      .map((i, order) => ({
        id: s * 100 + i,
        tooth: step.teeth[i],
        color: MONSTER_COLORS[Math.floor(Math.random() * MONSTER_COLORS.length)],
        step: s,
        order,
      }));
  });
}

const formatTime = (ms: number) => {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const ease = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

/** Glides from one view to the next, so the child sees the head turn and the mouth open. */
function useGlidingView(target: View, ms: number): View {
  const [view, setView] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const step = (t: number) => {
      const k = ms <= 0 ? 1 : Math.min(1, (t - start) / ms);
      current.current = lerpView(from, target, ease(k));
      setView(current.current);
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    // Background tabs barely get animation frames; make sure the view still arrives.
    const arrive = setTimeout(() => step(start + ms), ms + 100);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(arrive);
    };
  }, [target, ms]);
  return view;
}

/** Elapsed time that can be paused and jumped around in. */
interface Clock {
  banked: number;
  /** When it was last started; null while paused. */
  since: number | null;
}

const readClock = (clock: Clock, now: number) => clock.banked + (clock.since === null ? 0 : now - clock.since);

/**
 * A brushing timer that needs no tapping: the mirror shows where to brush
 * next (chewing surfaces, outside, inside), and the sugar monsters there
 * vanish one by one. Arrow keys skip ahead or back, Space pauses.
 */
export function TeethPlay({ speechLang, settings }: { speechLang: string; settings: TeethSettings }) {
  const [clock, setClock] = useState<Clock>(() => ({ banked: 0, since: performance.now() }));
  const [now, setNow] = useState(() => performance.now());
  const [round, setRound] = useState(0);
  const [tickled, setTickled] = useState<number | null>(null);
  const { touchOnly } = useDevice();
  const { bursts, spawn } = useBursts();
  const tickleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGone = useRef(0);

  // A fresh set of monsters for every round.
  const monsters = useMemo(placeMonsters, [round]);
  const stepMs = (Number(settings.minutes) * 60_000) / STEPS.length;
  const totalMs = stepMs * STEPS.length;
  const paused = clock.since === null;
  const brushed = readClock(clock, now) - INTRO_MS;
  const done = brushed >= totalMs;
  /** -1 during the intro, STEPS.length when done. */
  const phase = brushed < 0 ? -1 : done ? STEPS.length : Math.floor(brushed / stepMs);
  // The last one goes a moment before the step's time is up, so it's gone when the brush moves on.
  const isGone = (m: Monster) => brushed >= (m.step + (m.order + 1) / MONSTERS_PER_STEP - 0.04) * stepMs;
  const goneCount = monsters.filter(isGone).length;
  const step = phase >= 0 && !done ? STEPS[phase] : null;

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, speechLang, { queue, rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm, speechLang],
  );

  useWakeLock(!done);

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  useEffect(() => {
    if (done || paused) return;
    const timer = setInterval(() => setNow(performance.now()), TICK_MS);
    return () => clearInterval(timer);
  }, [done, paused, round]);

  const brushing = step !== null && !paused;
  useEffect(() => {
    if (!brushing || !settings.sounds) return;
    let beat = 0;
    const timer = setInterval(() => playTuneNote(beat++), BEAT_MS);
    return () => clearInterval(timer);
  }, [brushing, settings.sounds, round]);

  // What to say and play when a new part begins.
  useEffect(() => {
    if (phase === -1) {
      say("Oh je, Zuckermonster! Komm, wir putzen sie alle weg!");
    } else if (phase < STEPS.length) {
      if (settings.sounds) playChime();
      say(STEPS[phase].cue);
    } else {
      if (settings.sounds) [0, 1, 2, 3, 4, 5].forEach((i) => setTimeout(() => playCountNote(i), i * 120));
      say("Fertig! Alle Zuckermonster sind weg. Jetzt den Schaum ausspucken. Blitzeblank!");
      for (let i = 0; i < (settings.calm ? 4 : 12); i++) setTimeout(() => spawn(), i * 150);
    }
    // Only when the part changes, not when a setting does.
  }, [phase, round]);

  useEffect(() => {
    if (goneCount > lastGone.current && settings.sounds) playPoof();
    lastGone.current = goneCount;
  }, [goneCount, settings.sounds]);

  useEffect(
    () => () => {
      if (tickleTimer.current) clearTimeout(tickleTimer.current);
    },
    [],
  );

  // Tapping isn't needed, but a tapped monster giggles and wiggles.
  const tickle = (id: number) => {
    if (settings.sounds) playSqueak();
    setTickled(id);
    if (tickleTimer.current) clearTimeout(tickleTimer.current);
    tickleTimer.current = setTimeout(() => setTickled(null), TICKLE_MS);
  };

  const again = useCallback(() => {
    const t = performance.now();
    setClock({ banked: 0, since: t });
    setNow(t);
    setRound((r) => r + 1);
  }, []);

  const togglePause = useCallback(() => {
    const t = performance.now();
    setNow(t);
    setClock((c) => (c.since === null ? { banked: c.banked, since: t } : { banked: readClock(c, t), since: null }));
  }, []);

  // Pausing stops the voice mid-sentence; going on repeats what to do.
  useEffect(() => {
    if (paused) stopSpeaking();
    else if (step) say(step.cue);
    // Only when pausing or going on.
  }, [paused]);

  /** Jump to the start of a step; -1 is the intro, STEPS.length the end. */
  const jumpTo = useCallback(
    (target: number) => {
      const t = performance.now();
      const at = target < 0 ? 0 : INTRO_MS + Math.min(target, STEPS.length) * stepMs;
      setNow(t);
      setClock((c) => ({ banked: at, since: c.since === null ? null : t }));
    },
    [stepMs],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        if (done) again();
        else togglePause();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (!done) jumpTo(phase + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        jumpTo(Math.max(-1, Math.min(phase, STEPS.length) - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [done, phase, again, togglePause, jumpTo]);

  const target = step?.view ?? GRIN_VIEW;
  const view = useGlidingView(target, settings.calm ? TURN_MS * 1.5 : TURN_MS);

  // While they arrive, the monsters sit on the outside of the teeth, where the grin shows them.
  const shown = monsters.filter((m) => (phase === -1 ? STEPS[m.step].surface === "outer" : m.step === phase));
  const spots: MonsterSpot[] = shown.map((m, i) => ({
    id: m.id,
    tooth: m.tooth,
    surface: phase === -1 ? "outer" : STEPS[m.step].surface,
    color: m.color,
    delayMs: phase === -1 ? 600 + i * 220 : 300 + m.order * 150,
    gone: phase !== -1 && isGone(m),
    tickled: tickled === m.id,
  }));
  // The brush scrubs at the next monster still there, or the last one when they're all gone.
  const inStep = monsters.filter((m) => m.step === phase);
  const brushAt = inStep.find((m) => !isGone(m)) ?? inStep[inStep.length - 1];

  return (
    <div className={`teeth-play${settings.calm ? " calm" : ""}${done ? " done" : ""}${paused ? " paused" : ""}`}>
      <p className="teeth-clock" aria-label="Restzeit">
        {formatTime(totalMs - Math.max(0, Math.min(brushed, totalMs)))}
      </p>
      <div className="teeth-heading" key={`${round}-${phase}`}>
        <h2 className="teeth-cue">{phase === -1 ? "😱 Zuckermonster!" : step ? step.title : "✨ Blitzeblank!"}</h2>
        {step && (
          <p className={`teeth-mouth ${step.mouth}`}>
            {step.mouth === "open" ? "😮 Mund weit auf" : "😬 Zähne zusammen"}
            <span className="teeth-hint"> · {step.hint}</span>
          </p>
        )}
        {done && (
          <p className="teeth-mouth spit">
            💦 Ausspucken
            <span className="teeth-hint"> · nicht mit Wasser nachspülen</span>
          </p>
        )}
      </div>

      <div className="teeth-stage">
        <Mouth
          key={round}
          view={view}
          zone={step && { surface: step.surface, teeth: step.teeth }}
          monsters={spots}
          brush={step && brushAt ? { tooth: brushAt.tooth, surface: step.surface, motion: step.motion } : null}
          happy={done}
          onTickle={tickle}
        />
      </div>

      {done ? (
        <button className="teeth-again" onClick={again}>
          🔁 Nochmal
        </button>
      ) : (
        <div className="teeth-progress" aria-hidden>
          {STEPS.map((s, i) => (
            <span key={i} className={`teeth-segment ${s.surface}${i === phase ? " now" : ""}`}>
              <span style={{ width: `${Math.max(0, Math.min(1, (brushed - i * stepMs) / stepMs)) * 100}%` }} />
            </span>
          ))}
        </div>
      )}

      {paused && (
        <button className="teeth-paused" onClick={togglePause}>
          <span className="teeth-paused-icon" aria-hidden>
            ⏸️
          </span>
          Pause
          <small>{touchOnly ? "Tippen: weiter" : "Leertaste oder Tippen: weiter"}</small>
        </button>
      )}

      <BurstLayer bursts={bursts} />
    </div>
  );
}
