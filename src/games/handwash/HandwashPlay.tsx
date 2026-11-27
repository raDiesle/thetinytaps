import { type CSSProperties, type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ControlIcon } from "@/components/ControlIcon";
import { GameEnd } from "@/components/GameEnd";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { DEV } from "@/lib/buildInfo";
import { type Daytime, daytimeOf } from "@/lib/days";
import { useDevice } from "@/lib/device";
import { useT } from "@/lib/language";
import { usePageStill } from "@/lib/pageMotion";
import { loadRecordings, playChime, playPlop, playRecorded, playSplash, playTuneNote } from "@/lib/sfx";
import { GO_ON, PAUSE, SPACE_OR_TAP_TO_GO_ON, TAP_TO_GO_ON } from "@/lib/sharedTexts";
import { stepInAddress, useStepAddress } from "@/lib/stepAddress";
import { useTimers } from "@/lib/timers";
import { useWakeLock } from "@/lib/wakeLock";
import pictureFiles from "./bilder/*.webp?glob";
import { Dirt, Foam, type FoamStage, HAND_VIEWS, HandArt, type HandView, handSpot, Sleeve, SleeveRoll, SoapDab, Wet } from "./hands";
import { AREAS, LeverArt, place, PumpHeadArt, SinkPicture, SplashArt, Stream, TowelWrapArt } from "./sink";
import { BEAT_MS, type PictureId, playedSteps, RUB_STEPS, STEPS, type Step, type StepId } from "./steps";

/** The hand washing played for a video (`HandwashVideo`): the picture alone, nothing to tap, nothing kept. */
export interface VideoRun {
  /** Morning or evening, chosen for the video instead of read from the clock. */
  daytime: Daytime;
  /** Called once the last picture has stood a moment, to end the recording. */
  onFinished: () => void;
}

/** After the last step a video keeps its picture this long before it ends. */
const VIDEO_TAIL_MS = 2500;

/** The painted pictures that are made, by id (`bilder/<id>.webp`). */
const PICTURES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** The steps played: in the built site those whose pictures are still waiting are left out. */
const PLAYED = playedSteps(STEPS, (id) => PICTURES.has(id), DEV);

/** Every painted picture of the steps played, in order. */
const PLAYED_PICTURES = PLAYED.flatMap((s) => s.pictures ?? []);

/** How long a step lasts, in ms. */
const stepMs = (step: Step) => step.beats * BEAT_MS;

/**
 * How each hand is seen in a step (left, right), so one hand soaps the other: the right palm up for the soap, the left
 * hand's palm lying on it while they rub, one spread hand over the other's back, the fingers interlaced.
 */
const VIEWS: Partial<Record<StepId, [HandView, HandView]>> = {
  soap: ["back", "palm"],
  palms: ["back", "palm"],
  backs: ["backSpread", "backSpread"],
  backs2: ["backSpread", "backSpread"],
  between: ["backSpread", "palmSpread"],
  rinse: ["back", "palm"],
};

/** The views of a step played (left, right); the hands are seen from their backs where a step names none. */
const viewsAt = (index: number): [HandView, HandView] => VIEWS[PLAYED[index]?.id] ?? ["back", "back"];

/**
 * How much of the dirt is left in a step (1 all of it, 0 none), on the hand and on the fingers: it goes bit by bit with
 * the rubbing (user feedback, 26 November 2026) – the hand's first, the fingertips' last – and the rest with the rinse.
 */
const DIRT: Partial<Record<StepId, [number, number]>> = {
  palms: [0.55, 0.9],
  backs: [0.35, 0.7],
  backs2: [0.2, 0.45],
  between: [0.1, 0.2],
  water: [0.1, 0.2],
};

/** The foam's three layers, in the order they come with the rubbing (and go again, the other way round, with the rinse). */
const FOAM_STAGES: readonly FoamStage[] = ["patches", "full", "fingers"];

/** One view of a hand: the hand and its fingers, each with its dirt, foam and wet shine, shown while the step sees the hand so. */
function View({ side, view }: { side: "left" | "right"; view: HandView }) {
  return (
    <div className={`hw-view v-${view}`}>
      <HandArt side={side} view={view} part="hand" />
      <div className="hw-dirt">
        <Dirt view={view} part="hand" />
      </div>
      {FOAM_STAGES.slice(0, 2).map((stage) => (
        <div key={stage} className={`hw-foam f-${stage}`}>
          <Foam view={view} stage={stage} />
        </div>
      ))}
      <div className="hw-wet">
        <Wet view={view} part="hand" />
      </div>
      {/* The fingers lie over the hand's top edge and bend over its knuckles. */}
      <div className="hw-fingers">
        <HandArt side={side} view={view} part="fingers" />
        <div className="hw-dirt hw-dirt-fingers">
          <Dirt view={view} part="fingers" />
        </div>
        <div className="hw-foam f-fingers">
          <Foam view={view} stage="fingers" />
        </div>
        <div className="hw-wet">
          <Wet view={view} part="fingers" />
        </div>
      </div>
    </div>
  );
}

/**
 * One hand: the views it shows now, just before and next (only those are drawn, so a phone keeps few layers), the sleeve
 * over its arm with the rolled-up cuff, the soap in the right palm.
 */
function Hand({ side, daytime, views }: { side: "left" | "right"; daytime: Daytime; views: ReadonlySet<HandView> }) {
  return (
    <div className={`hw-hand hw-${side}`} style={place(AREAS[side])}>
      <div className="hw-pose">
        <div className="hw-rub">
          <div className="hw-mirror">
            {HAND_VIEWS.filter((view) => views.has(view)).map((view) => (
              <View key={view} side={side} view={view} />
            ))}
            <div className="hw-sleeve">
              <Sleeve side={side} daytime={daytime} />
              <div className="hw-roll">
                <SleeveRoll side={side} daytime={daytime} />
              </div>
            </div>
            {side === "right" && (
              <div className="hw-dab" style={handSpot(168, 372, 76)}>
                <SoapDab />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A painted picture of the home (or, in the dev server, its placeholder until it is made). */
function Picture({ id, name }: { id: PictureId; name: string }) {
  const url = PICTURES.get(id);
  return (
    <div className={`hw-pic p-${id}`}>
      {url ? (
        <img className="hw-pic-img" src={url} alt="" decoding="async" />
      ) : (
        <div className="hw-pic-img hw-pic-missing">
          <span>{name}</span>
          <small>bilder/{id}.webp</small>
        </div>
      )}
    </div>
  );
}

/** Minutes and seconds, as the time left beside the bar shows them. */
const formatTime = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/** The time left of the whole washing, for the grown-up beside the bar: it counts by itself, so the picture is never drawn again for it. */
function TimeLeft({ left, label }: { left: () => number; label: string }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(timer);
  }, []);
  return (
    <span className="hw-time" aria-label={label}>
      {formatTime(left())}
    </span>
  );
}

/** The bar's colour family of a step: the rooms (lilac), at the basin with no water (blue), the rubbing (green) and the water (blue). */
const segmentKind = (id: StepId) => (PLAYED.find((s) => s.id === id)?.pictures ? "hw-seg-room" : RUB_STEPS.includes(id) ? "hw-seg-rub" : "hw-seg-sink");

/** The classes of the picture in a step: what is held on from step to step, and how each hand is seen. */
function stageStates(steps: readonly Step[], index: number, done: boolean) {
  const step = steps[index];
  const id = step.id;
  const from = (first: StepId) => {
    const at = steps.findIndex((s) => s.id === first);
    return at >= 0 && index >= at;
  };
  const before = (end: StepId) => {
    const at = steps.findIndex((s) => s.id === end);
    return at < 0 || index < at;
  };
  const [left, right] = viewsAt(index);
  const lathered = RUB_STEPS.includes(id) || id === "water";
  return [
    `at-${id}`,
    done ? "done" : "",
    step.pictures ? "pictured" : "",
    `l-${left}`,
    `r-${right}`,
    from("sleeves") && id !== "sleeves" ? "sleeves-up" : "",
    id === "sleeves" ? "rolling" : "",
    id === "water" || id === "rinse" ? "water-on" : "",
    id === "soap" ? "dab" : "",
    // The foam comes bit by bit: patches with the first rubbing, the whole hand halfway through it, the fingers with the backs.
    lathered ? "lather-patches lather-full" : "",
    lathered && from("backs") ? "lather-fingers" : "",
    from("water") && before("towel") ? "wet" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/**
 * Hände waschen (idea H-136): the whole way of washing one's hands, as the user told it (25 November 2026), seen through
 * the child's own eyes – Mama calls that dinner is nearly ready, into the bathroom and up the step stool (painted
 * pictures), then the child's own hands over the basin: sleeves up, soap into one hand, one hand soaps the other (palm
 * on palm, over each back, between the fingers) while the dirt goes, water on and feel how warm it is, rinse, water off,
 * into the towel – and off to eat (painted again). It plays by itself, to the beat of the song to come. Its controls are
 * Zähne putzen's (user request, 26 November 2026): a tap on the picture, Space or the pause button pauses, „Von vorn“
 * starts again, the bar shows each step filling up and a tap or drag on it jumps there, the time left beside it; the
 * arrow keys jump between steps.
 */
export function HandwashPlay({ video }: { video?: VideoRun }) {
  const t = useT();
  const { later } = useTimers();
  const still = usePageStill();
  const { touchOnly } = useDevice();
  const { effects, ripple } = useTapFeedback();
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(() => Math.max(0, video ? 0 : PLAYED.findIndex((s) => s.id === stepInAddress())));
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  // The picture stands at its start until the book lies open: only then the states come on and their motions run.
  const [started, setStarted] = useState(false);
  const daytime = useMemo(() => video?.daytime ?? daytimeOf(), [video?.daytime, round]);
  const running = started && !paused && !done;
  const step = PLAYED[index];

  useStepAddress(video ? undefined : done ? "ende" : step.id);
  useWakeLock(started && !done);
  // The placeholder tune (and later the song) is the washing, so the background song waits meanwhile.
  useNoBackgroundMusic(!done);
  useEffect(() => loadRecordings(["splash"]), []);

  // Starts once nothing moves on the page (a video at once), a frame after the first picture, so the states' transitions run.
  useEffect(() => {
    if (!still && !video) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setStarted(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [still, video, round]);

  // The clock: each step lasts its beats, and a pause keeps what is left of the step it fell into (`left`); while it
  // runs, `since` knows when the step's rest began, so the time beside the bar can count down.
  const left = useRef<{ index: number; ms: number } | null>(null);
  const since = useRef<{ index: number; at: number; ms: number } | null>(null);
  useEffect(() => {
    if (!running) return;
    const ms = left.current?.index === index && left.current.ms > 0 ? left.current.ms : stepMs(PLAYED[index]);
    const from = performance.now();
    since.current = { index, at: from, ms };
    const timer = later(() => {
      if (index + 1 < PLAYED.length) setIndex(index + 1);
      else setDone(true);
    }, ms);
    return () => {
      clearTimeout(timer);
      since.current = null;
      left.current = { index, ms: ms - (performance.now() - from) };
    };
  }, [running, index, later]);

  /** What is left of the whole washing, in ms: the rest of this step and every step after it. */
  const timeLeft = () => {
    const run = since.current;
    const rest =
      run?.index === index
        ? run.ms - (performance.now() - run.at)
        : left.current?.index === index && left.current.ms > 0
          ? left.current.ms
          : stepMs(PLAYED[index]);
    return rest + PLAYED.slice(index + 1).reduce((sum, s) => sum + stepMs(s), 0);
  };

  // The sounds of a step, as it begins: the pump giving its soap, the water coming on, the chime at the table.
  useEffect(() => {
    if (!started) return;
    if (step.id === "water") later(() => playRecorded("splash", playSplash), BEAT_MS);
    if (step.id === "rinse") playRecorded("splash", playSplash);
    if (step.id === "soap") later(playPlop, BEAT_MS * 3.6);
    if (step.id === "run") later(playChime, BEAT_MS * 2);
  }, [started, index, round]);

  // Until the song is made (H-142) a placeholder tune keeps the beat.
  useEffect(() => {
    if (!running) return;
    let beat = 0;
    const timer = setInterval(() => playTuneNote(beat++), BEAT_MS);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (video && done) later(video.onFinished, VIDEO_TAIL_MS);
  }, [video, done, later]);

  const jump = useCallback((to: number) => {
    if (to < 0 || to >= PLAYED.length) return;
    left.current = null;
    setDone(false);
    setIndex(to);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  const again = useCallback(() => {
    left.current = null;
    setRound((r) => r + 1);
    setIndex(0);
    setDone(false);
    setPaused(false);
    setStarted(false);
  }, []);

  // Space (or Enter) pauses and goes on, or starts again at the end; the arrows jump a step; any other key answers with rings.
  useEffect(() => {
    if (video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      if (e.key === " " || e.key === "Enter") {
        if (done) again();
        else togglePause();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") jump(index + 1);
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") jump(Math.max(0, index - 1));
      else if (!done) ripple();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, done, index, jump, togglePause, again, ripple]);

  /**
   * A tap or drag on the bar jumps to the step under the finger, from its start – along the bar held upright beside a
   * wide picture too (`handwash.css`). Dragging jumps only when it reaches another step, so one never starts again and
   * again under a moving finger.
   */
  const seekFromPointer = (e: PointerEvent<HTMLDivElement>, first: boolean) => {
    const segments = [...e.currentTarget.querySelectorAll(".hw-seg")];
    const upright = getComputedStyle(e.currentTarget).flexDirection === "column";
    const along = upright ? e.clientY : e.clientX;
    const to = segments.findIndex((s, k) => {
      const r = s.getBoundingClientRect();
      return k === segments.length - 1 || along < (upright ? r.bottom : r.right);
    });
    if (to < 0 || (!first && to === index)) return;
    jump(to);
  };

  // Only the views of the step before, this one and the next are drawn: the one going, the one shown, the one coming.
  const mounted = (side: 0 | 1) => new Set([index - 1, index, index + 1].filter((i) => i >= 0 && i < PLAYED.length).map((i) => viewsAt(i)[side]));

  // Before the book lies open the hands stand still in the step's own views (only those are drawn) – and a painted
  // picture already stands.
  const [leftView, rightView] = viewsAt(index);
  const states = started ? stageStates(PLAYED, index, done) : `l-${leftView} r-${rightView}${step.pictures ? ` at-${step.id} pictured` : ""}`;
  const rinseAt = PLAYED.findIndex((s) => s.id === "rinse");
  const [dirtHand, dirtFingers] = done || index >= rinseAt ? [0, 0] : (DIRT[step.id] ?? [1, 1]);

  const label = t({
    en: "Your own hands over the basin, washed step by step",
    de: "Die eigenen Hände über dem Waschbecken, Schritt für Schritt gewaschen",
    zh: "自己的小手在洗手池上，一步一步洗干净",
    hi: "सिंक के ऊपर अपने हाथ, एक-एक कदम धुलते हुए",
    es: "Tus propias manos sobre el lavabo, lavadas paso a paso",
    ar: "يداك فوق المغسلة، تُغسلان خطوة بخطوة",
    ru: "Твои ручки над раковиной, моем шаг за шагом",
  });

  return (
    <div className={`hw-play ${daytime}${paused ? " paused" : ""}${video ? " video" : ""}`}>
      {/* A tap on the picture pauses, as in Zähne putzen (user request, 26 November 2026); the pause screen over it goes
          on again. Not at the end, which has nothing left to pause, and never in a video. */}
      <div
        key={round}
        className={`hw-stage ${states}`}
        style={{ "--dirt-hand": dirtHand, "--dirt-fingers": dirtFingers, "--step": `${stepMs(step)}ms` } as CSSProperties}
        onPointerDown={() => {
          if (!video && !done && !paused && started) togglePause();
        }}
      >
        <SinkPicture daytime={daytime} label={label} />
        <div className="hw-layer hw-splash" style={place(AREAS.splash)}>
          <SplashArt />
        </div>
        <div className="hw-layer hw-stream" style={place(AREAS.stream)}>
          <Stream />
        </div>
        <div className="hw-layer hw-lever" style={place(AREAS.lever)}>
          <LeverArt />
        </div>
        <div className="hw-layer hw-pump-head" style={place(AREAS.pumpHead)}>
          <PumpHeadArt />
        </div>
        <Hand side="left" daytime={daytime} views={mounted(0)} />
        <Hand side="right" daytime={daytime} views={mounted(1)} />
        <div className="hw-layer hw-towel-wrap" style={place(AREAS.towelWrap)}>
          <TowelWrapArt />
        </div>
        {PLAYED_PICTURES.map((id) => (
          <Picture key={id} id={id} name={t(PLAYED.find((s) => s.pictures?.includes(id))?.name ?? STEPS[0].name)} />
        ))}
      </div>

      {paused && (
        <button type="button" className="hw-paused" onClick={togglePause}>
          <span className="hw-paused-icon" aria-hidden>
            <ControlIcon kind="pause" className="hw-button-icon" />
          </span>
          {t(PAUSE)}
          <small>{t(touchOnly ? TAP_TO_GO_ON : SPACE_OR_TAP_TO_GO_ON)}</small>
        </button>
      )}

      {/* Zähne putzen's controls on one strip of paper: pause, start again, the bar of steps and the time left. */}
      {!video && !done && (
        <div className="hw-controls">
          <button type="button" className="hw-button" onClick={togglePause} aria-label={paused ? t(GO_ON) : t(PAUSE)}>
            <ControlIcon kind={paused ? "play" : "pause"} className="hw-button-icon" />
          </button>
          <button
            type="button"
            className="hw-button"
            onClick={again}
            aria-label={t({ de: "Von vorn", en: "Start again", zh: "重新开始", hi: "फिर से शुरू", es: "Otra vez", ar: "من جديد", ru: "Сначала" })}
          >
            <ControlIcon kind="again" className="hw-button-icon" />
          </button>
          <div
            className="hw-progress"
            role="slider"
            aria-label={t({ de: "Fortschritt", en: "Progress", zh: "进度", hi: "प्रगति", es: "Progreso", ar: "التقدّم", ru: "Сколько уже сделано" })}
            aria-valuemin={1}
            aria-valuemax={PLAYED.length}
            aria-valuenow={index + 1}
            aria-valuetext={t(step.name)}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              seekFromPointer(e, true);
            }}
            onPointerMove={(e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e, false);
            }}
          >
            {PLAYED.map((s, i) => (
              <span
                key={s.id}
                className={`hw-seg ${segmentKind(s.id)}${i < index ? " past" : i === index ? " now" : ""}`}
                style={{ "--beats": s.beats, "--step": `${stepMs(s)}ms` } as CSSProperties}
                title={t(s.name)}
              >
                <span />
              </span>
            ))}
          </div>
          <TimeLeft
            left={timeLeft}
            label={t({ de: "Restzeit", en: "Time left", zh: "剩余时间", hi: "बाकी समय", es: "Tiempo restante", ar: "الوقت المتبقي", ru: "Осталось времени" })}
          />
        </div>
      )}
      <FeedbackLayer effects={effects} />
      {done && !video && <GameEnd onAgain={again} />}
    </div>
  );
}
