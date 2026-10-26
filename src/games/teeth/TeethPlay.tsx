import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { useDevice } from "@/lib/device";
import { type Localized, pick, useAppLanguage, useT } from "@/lib/language";
import { playChime, playCountNote, playPoof, playSqueak } from "@/lib/sfx";
import { speak, stopSpeaking } from "@/lib/speech";
import { useWakeLock } from "@/lib/wakeLock";
import { addBrushing, DAYTIME, daytimeOf, loadWeek, saveWeek, type WeekLog } from "./daytime";
import { DAYTIME_RU } from "./daytime.ru";
import { lerpView, type ToothId, type View } from "./jaw";
import { Mouth, type MonsterSpot, type MouthAction } from "./mouth";
import { SUNG_LANGUAGES, sungSteps, useBrushingMusic } from "./music";
import { Prep } from "./prep";
import type { TeethSettings } from "./settings";
import { GRIN_VIEW, STEPS, stepTexts } from "./steps";
import { sungLanguageFor } from "./sung";
import { Week } from "./week";
import "./teeth.css";

const MONSTER_COLORS = ["#8bd346", "#b388ff", "#ff9f43", "#ff7bd0", "#4cc9f0"];
const MONSTER_VARIANTS = 3;
const TICK_MS = 200;
const TICKLE_MS = 700;
const TURN_MS = 1100;
/** Opening or closing the mouth glides slower, so the child can do it along with the picture. */
const MOUTH_MS = 1800;
/** How long the arrows on the lips show after the mouth has to open or close. */
const ACTION_MS = 3500;
/** Brushing without a sung song: the two minutes dentists recommend, as long as the plain song's seven parts. */
const BRUSH_MS = 120_000;
/** Dragging on the progress bar stops this far before the end. */
const SEEK_END_MS = 1000;

/** Before the clock starts: get the brush, toothpaste on, and meet the monsters. */
type Prelude = "brush" | "paste" | "monsters";

/** The monsters' cue depends on the time of day, see DAYTIME. */
const PRELUDE: Record<Prelude, { ms: number; title: Localized; cue?: Localized }> = {
  brush: {
    ms: 7000,
    title: { de: "🪥 Zahnbürste holen", ru: "🪥 Берём щётку" },
    cue: { de: "Zuerst holen wir die Zahnbürste!", ru: "Сначала берём зубную щётку!" },
  },
  paste: {
    ms: 8000,
    title: { de: "🫧 Zahnpasta drauf", ru: "🫧 Немного пасты" },
    cue: { de: "Jetzt ein kleiner Klecks Zahnpasta drauf.", ru: "Теперь капельку зубной пасты." },
  },
  monsters: { ms: 4500, title: { de: "😱 Zuckermonster!", ru: "😱 Сахарные монстры!" } },
};

/** Said at the end, before the daytime's goodbye (unless the sung finale sings it). */
const DONE_SAY: Localized = {
  de: "Fertig! Alle Zuckermonster sind weg. Jetzt den Schaum ausspucken. Blitzeblank!",
  ru: "Готово! Сахарных монстров больше нет. Теперь сплюнь пенку. Чисто-чисто!",
};

interface Monster {
  id: number;
  tooth: ToothId;
  /** Where along the tooth, see MonsterSpot. */
  spot: number;
  color: string;
  variant: number;
  step: number;
  /** 0 goes first in its step. */
  order: number;
}

const randomIndex = (count: number) => Math.floor(Math.random() * count);

/** A monster on every tooth of every step, two on a molar's chewing surface, in the order the brush visits them. */
function placeMonsters(): Monster[] {
  return STEPS.flatMap((step, s) =>
    step.teeth
      .flatMap((tooth) => (step.surface === "top" ? [1, 3] : [2]).map((spot) => ({ tooth, spot })))
      .map(({ tooth, spot }, order) => ({
        id: s * 100 + order,
        tooth,
        spot,
        color: MONSTER_COLORS[randomIndex(MONSTER_COLORS.length)],
        variant: randomIndex(MONSTER_VARIANTS),
        step: s,
        order,
      })),
  );
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

/** The prelude part running `elapsed` ms after the start. */
function preludeAt(prelude: Prelude[], elapsed: number): Prelude {
  let end = 0;
  for (const p of prelude) {
    end += PRELUDE[p].ms;
    if (elapsed < end) return p;
  }
  return prelude[prelude.length - 1];
}

/**
 * A brushing timer that needs no tapping: first it shows fetching the brush
 * and putting toothpaste on, then the mirror shows where to brush next
 * (chewing surfaces, outside, inside), and the sugar monsters there vanish
 * one by one. Arrow keys skip ahead or back, Space or the pause button pauses,
 * and tapping the progress bar jumps there.
 */
export function TeethPlay({ settings }: { settings: TeethSettings }) {
  // Everything shown and said follows the app language; the voice speaks in it too.
  const language = useAppLanguage();
  const t = useT();
  const [clock, setClock] = useState<Clock>(() => ({ banked: 0, since: performance.now() }));
  const [now, setNow] = useState(() => performance.now());
  const [round, setRound] = useState(0);
  const [tickled, setTickled] = useState<number | null>(null);
  const [week, setWeek] = useState<WeekLog>(loadWeek);
  const { touchOnly } = useDevice();
  const { bursts, spawn } = useBursts();
  const tickleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGone = useRef(0);

  // A fresh set of monsters for every round, and a fresh look at the clock.
  const monsters = useMemo(placeMonsters, [round]);
  const daytime = useMemo(() => daytimeOf(settings.daytime), [settings.daytime, round]);
  const daytimeTexts = pick({ de: DAYTIME[daytime], ru: DAYTIME_RU[daytime] }, language.id);
  const preludeCue = (p: Prelude) => {
    const cue = PRELUDE[p].cue;
    return cue ? t(cue) : daytimeTexts.monsters;
  };
  const perStep = useMemo(() => STEPS.map((_, s) => monsters.filter((m) => m.step === s).length), [monsters]);
  const prelude = useMemo<Prelude[]>(() => (settings.prep ? ["brush", "paste", "monsters"] : ["monsters"]), [settings.prep]);
  const introMs = prelude.reduce((sum, p) => sum + PRELUDE[p].ms, 0);
  // With a sung song the brushing lasts as long as the song and each step as long as its verse; otherwise two minutes in equal steps.
  const sungIn = settings.music ? sungLanguageFor(settings.singing, language.id, SUNG_LANGUAGES) : null;
  const stepStarts = useMemo(() => sungSteps(sungIn) ?? Array.from({ length: STEPS.length + 1 }, (_, k) => (k * BRUSH_MS) / STEPS.length), [sungIn]);
  const stepLength = (k: number) => stepStarts[k + 1] - stepStarts[k];
  const totalMs = stepStarts[STEPS.length];
  const paused = clock.since === null;
  const elapsed = readClock(clock, now);
  const brushed = elapsed - introMs;
  const done = brushed >= totalMs;
  /** -1 during the prelude, STEPS.length when done. */
  const phase = brushed < 0 ? -1 : done ? STEPS.length : stepStarts.filter((at, k) => k < STEPS.length && brushed >= at).length - 1;
  const before = brushed < 0 ? preludeAt(prelude, elapsed) : null;
  /** Prelude parts first, then the steps, then the end: what the arrow keys step through. */
  const part = before ? prelude.indexOf(before) : prelude.length + phase;
  // The last one goes a moment before the step's time is up, so it's gone when the brush moves on.
  const isGone = (m: Monster) => brushed >= stepStarts[m.step] + ((m.order + 1) / perStep[m.step] - 0.04) * stepLength(m.step);
  const goneCount = monsters.filter(isGone).length;
  const step = phase >= 0 && !done ? STEPS[phase] : null;
  const texts = step && stepTexts(step, language.id);
  const cue = before ? preludeCue(before) : texts?.cue;

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, language.speechLang, { queue, rate: 0.85 });
    },
    [settings.speech, language.speechLang],
  );

  useWakeLock(!done);

  useEffect(() => {
    if (done || paused) return;
    const timer = setInterval(() => setNow(performance.now()), TICK_MS);
    return () => clearInterval(timer);
  }, [done, paused, round]);

  // The brushing has its own song (or none, when it is switched off).
  useNoBackgroundMusic();
  // The sung song sings the steps, so the voice leaves them to it.
  const sung = useBrushingMusic({
    enabled: settings.music,
    sung: sungIn,
    playing: step !== null && !paused,
    finished: done,
    sync: clock,
    at: brushed,
  });

  // What to say and play when a new part begins.
  useEffect(() => {
    if (before) {
      if (settings.sounds && part > 0) playChime();
      say(part === 0 ? `${daytimeTexts.hello} ${preludeCue(before)}` : preludeCue(before));
    } else if (phase < STEPS.length) {
      if (settings.sounds) playChime();
      if (!sung) say(stepTexts(STEPS[phase], language.id).cue);
    } else {
      if (settings.sounds) [0, 1, 2, 3, 4, 5].forEach((i) => setTimeout(() => playCountNote(i), i * 120));
      // The sung finale sings "Fertig, blitzeblank" itself; the voice would talk over it.
      if (!sung) say(`${t(DONE_SAY)} ${daytimeTexts.after}`);
      // A star on the week chart, whether or not it is shown, so it is complete when turned on.
      const next = addBrushing(loadWeek(), new Date(), daytime);
      saveWeek(next);
      setWeek(next);
      for (let i = 0; i < 12; i++) setTimeout(() => spawn(), i * 150);
    }
    // Only when the part changes, not when a setting does.
  }, [part, round]);

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
    else if (cue && !(sung && step)) say(cue);
    // Only when pausing or going on.
  }, [paused]);

  /** Move the clock to `at` ms after the start; a paused clock stays paused. */
  const seek = useCallback((at: number) => {
    const t = performance.now();
    setNow(t);
    setClock((c) => ({ banked: at, since: c.since === null ? null : t }));
  }, []);

  /** Jump to the start of a part: the prelude ones first, then the steps, then the end. */
  const jumpTo = useCallback(
    (target: number) =>
      seek(
        target < prelude.length
          ? prelude.slice(0, target).reduce((sum, p) => sum + PRELUDE[p].ms, 0)
          : introMs + stepStarts[Math.min(target - prelude.length, STEPS.length)],
      ),
    [seek, prelude, introMs, stepStarts],
  );

  /** Tapping or dragging on the progress bar jumps to that point of the brushing. */
  const seekFromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const segments = [...e.currentTarget.children];
    const i = segments.findIndex((s, k) => k === segments.length - 1 || e.clientX < s.getBoundingClientRect().right);
    const rect = segments[i].getBoundingClientRect();
    const k = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    // Stop just short of the end, so dragging to the right edge doesn't finish at once.
    seek(introMs + Math.min(stepStarts[i] + k * stepLength(i), totalMs - SEEK_END_MS));
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        if (done) again();
        else togglePause();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (!done) jumpTo(part + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        jumpTo(Math.max(0, part - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [done, part, again, togglePause, jumpTo]);

  // When the mouth has to open or close, the picture does it slowly and arrows on the lips show the way.
  const mouthBefore = phase <= 0 ? "closed" : STEPS[phase - 1].mouth;
  const mouthMoves = step !== null && step.mouth !== mouthBefore;
  const action: MouthAction | null = step && mouthMoves && brushed - stepStarts[phase] < ACTION_MS ? (step.mouth === "open" ? "open" : "close") : null;
  const target = step?.view ?? GRIN_VIEW;
  const view = useGlidingView(target, mouthMoves ? MOUTH_MS : TURN_MS);

  // The brush glides along the step's teeth and reaches each monster just as it goes.
  const inStep = monsters.filter((m) => m.step === phase);
  const brushAt = inStep.find((m) => !isGone(m));
  const stepDone = step ? (brushed - stepStarts[phase]) / stepLength(phase) : 0;
  const brushStop = Math.max(0, Math.min(inStep.length - 1, stepDone * inStep.length - 0.6));
  // Every monster on a tooth not brushed yet; the picture shows those whose side of the tooth faces out.
  const spots: MonsterSpot[] = monsters
    .filter((m) => m.step >= phase)
    .map((m) => ({
      id: m.id,
      tooth: m.tooth,
      surface: STEPS[m.step].surface,
      spot: m.spot,
      color: m.color,
      variant: m.variant,
      // While they arrive they pop up all over; later ones come quickly as their side turns into view.
      delayMs: phase === -1 ? 400 + ((m.id * 7) % 20) * 150 : m.step === phase ? 150 + m.order * 60 : 0,
      waiting: m.step !== phase,
      scared: m === brushAt && !isGone(m),
      gone: m.step === phase && isGone(m),
      tickled: tickled === m.id,
    }));

  return (
    <div className={`teeth-play ${daytime}${done ? " done" : ""}${paused ? " paused" : ""}`}>
      <span className="teeth-sky" aria-hidden>
        {daytime === "morning" ? "☀️" : "🌙"}
      </span>
      <p className="teeth-clock" aria-label={t({ de: "Restzeit", ru: "Осталось времени" })}>
        {formatTime(totalMs - Math.max(0, Math.min(brushed, totalMs)))}
      </p>
      <div className="teeth-heading" key={`${round}-${part}`}>
        <h2 className="teeth-cue">{before ? t(PRELUDE[before].title) : texts ? texts.title : daytimeTexts.doneTitle}</h2>
        {before === "paste" && (
          <p className="teeth-mouth prep">
            👌 {t({ de: "Erbsengroß", ru: "С горошину" })}
            <span className="teeth-hint"> · {t({ de: "unter 2 Jahren nur reiskorngroß", ru: "до 2 лет — с рисовое зёрнышко" })}</span>
          </p>
        )}
        {step && texts && (
          <p className={`teeth-mouth ${step.mouth}`}>
            <span className="teeth-mouth-icon">{step.mouth === "open" ? "😮" : "😬"}</span>{" "}
            {step.mouth === "open" ? t({ de: "Mund weit auf", ru: "Ротик широко" }) : t({ de: "Zähne zusammen", ru: "Зубки вместе" })}
            <span className="teeth-hint"> · {texts.hint}</span>
          </p>
        )}
        {done && (
          <p className="teeth-mouth spit">
            💦 {t({ de: "Ausspucken", ru: "Сплюнуть" })}
            <span className="teeth-hint"> · {t({ de: "nicht mit Wasser nachspülen", ru: "водой не полоскать" })}</span>
          </p>
        )}
      </div>

      <div className="teeth-stage">
        {before === "brush" || before === "paste" ? (
          <Prep key={round} part={before} daytime={daytime} />
        ) : (
          <Mouth
            key={round}
            view={view}
            zone={step && { surface: step.surface, teeth: step.teeth }}
            monsters={spots}
            brush={step && { stops: inStep.map((m) => ({ tooth: m.tooth, spot: m.spot })), at: brushStop, surface: step.surface, motion: step.motion }}
            happy={done}
            daytime={daytime}
            action={action}
            paused={paused}
            onTickle={tickle}
          />
        )}
      </div>

      {done ? (
        <div className="teeth-end">
          {settings.week && <Week log={week} today={new Date()} now={daytime} />}
          <button type="button" className="teeth-again" onClick={again}>
            🔁 {t({ de: "Nochmal", ru: "Ещё раз" })}
          </button>
        </div>
      ) : (
        <>
          {/* The week shows before brushing too, which star is to come; while brushing, the mouth gets its room. */}
          {before && settings.week && <Week log={week} today={new Date()} now={daytime} />}
          <div className="teeth-controls">
            <button
              type="button"
              className="teeth-pause"
              onClick={togglePause}
              aria-label={paused ? t({ de: "Weiter", ru: "Дальше" }) : t({ de: "Pause", ru: "Пауза" })}
            >
              {paused ? "▶️" : "⏸️"}
            </button>
            <div
              className="teeth-progress"
              role="slider"
              aria-label={t({ de: "Fortschritt", ru: "Сколько уже почищено" })}
              aria-valuemin={0}
              aria-valuemax={Math.round(totalMs / 1000)}
              aria-valuenow={Math.round(Math.max(0, Math.min(brushed, totalMs)) / 1000)}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                seekFromPointer(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e);
              }}
            >
              {STEPS.map((s, i) => (
                <span key={i} className={`teeth-segment ${s.surface}${i === phase ? " now" : ""}`}>
                  <span style={{ width: `${Math.max(0, Math.min(1, (brushed - stepStarts[i]) / stepLength(i))) * 100}%` }} />
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {paused && (
        <button type="button" className="teeth-paused" onClick={togglePause}>
          <span className="teeth-paused-icon" aria-hidden>
            ⏸️
          </span>
          {t({ de: "Pause", ru: "Пауза" })}
          <small>
            {touchOnly ? t({ de: "Tippen: weiter", ru: "Нажми — и дальше" }) : t({ de: "Leertaste oder Tippen: weiter", ru: "Пробел или нажатие — и дальше" })}
          </small>
        </button>
      )}

      <BurstLayer bursts={bursts} />
    </div>
  );
}
