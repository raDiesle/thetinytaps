import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { DEV } from "@/lib/buildInfo";
import { type Daytime, daytimeOf } from "@/lib/days";
import { useT } from "@/lib/language";
import { usePageStill } from "@/lib/pageMotion";
import { noPointerClick } from "@/lib/press";
import { loadRecordings, playChime, playPlop, playRecorded, playSplash, playTuneNote } from "@/lib/sfx";
import { stepInAddress, useStepAddress } from "@/lib/stepAddress";
import { useTimers } from "@/lib/timers";
import { useWakeLock } from "@/lib/wakeLock";
import pictureFiles from "./bilder/*.webp?glob";
import { Dirt, Foam, HAND_VIEWS, HandArt, type HandView, handSpot, Sleeve, SleeveRoll, SoapDab, Wet } from "./hands";
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

/** How much of the dirt is left in a step (1 all of it, 0 none): it goes with the rubbing and the last of it with the rinse. */
const DIRT: Partial<Record<StepId, number>> = { palms: 0.6, backs: 0.4, backs2: 0.25, between: 0.12, water: 0.12 };

/** One view of a hand with its dirt, foam and wet shine, shown while the step sees the hand so. */
function View({ side, view }: { side: "left" | "right"; view: HandView }) {
  return (
    <div className={`hw-view v-${view}`}>
      <HandArt side={side} view={view} />
      <div className="hw-dirt">
        <Dirt view={view} />
      </div>
      <div className="hw-foam">
        <Foam view={view} />
      </div>
      <div className="hw-wet">
        <Wet view={view} />
      </div>
    </div>
  );
}

/** One hand: its four views, the sleeve over its arm with the rolled-up cuff, the soap in the right palm. */
function Hand({ side, daytime }: { side: "left" | "right"; daytime: Daytime }) {
  return (
    <div className={`hw-hand hw-${side}`} style={place(AREAS[side])}>
      <div className="hw-pose">
        <div className="hw-rub">
          <div className="hw-mirror">
            {HAND_VIEWS.map((view) => (
              <View key={view} side={side} view={view} />
            ))}
            <div className="hw-sleeve">
              <Sleeve side={side} daytime={daytime} />
              <div className="hw-roll">
                <SleeveRoll side={side} daytime={daytime} />
              </div>
            </div>
            {side === "right" && (
              <div className="hw-dab" style={handSpot(170, 350, 76)}>
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

/** The pause and play signs, drawn like Zähne putzen's (never emoji). */
function PauseIcon({ paused }: { paused: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      {paused ? (
        <path d="M8 5 L19 12 L8 19 Z" fill="#2a1e5c" strokeLinejoin="round" stroke="#2a1e5c" strokeWidth={2} />
      ) : (
        <>
          <rect x={6} y={5} width={4} height={14} rx={1.5} fill="#2a1e5c" />
          <rect x={14} y={5} width={4} height={14} rx={1.5} fill="#2a1e5c" />
        </>
      )}
    </svg>
  );
}

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
  const [left, right] = VIEWS[id] ?? ["back", "back"];
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
    RUB_STEPS.includes(id) || id === "water" ? "foamy" : "",
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
 * into the towel – and off to eat (painted again). It plays by itself, to the beat of the song to come: a tap or a key
 * answers with soft rings, Space or the bar's button pauses, the arrow keys and the bar jump between steps.
 */
export function HandwashPlay({ video }: { video?: VideoRun }) {
  const t = useT();
  const { later } = useTimers();
  const still = usePageStill();
  const { effects, ripple } = useTapFeedback();
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(() => Math.max(0, video ? 0 : PLAYED.findIndex((s) => s.id === stepInAddress())));
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  // The picture stands at its start until the book lies open: only then the states come on and their motions run.
  const [started, setStarted] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new round reads the clock again
  const daytime = useMemo(() => video?.daytime ?? daytimeOf(), [video?.daytime, round]);
  const running = started && !paused && !done;
  const step = PLAYED[index];

  useStepAddress(video ? undefined : done ? "ende" : step.id);
  useWakeLock(started && !done);
  // The placeholder tune (and later the song) is the washing, so the background song waits meanwhile.
  useNoBackgroundMusic(!done);
  useEffect(() => loadRecordings(["splash"]), []);

  // Starts once nothing moves on the page (a video at once), a frame after the first picture, so the states' transitions run.
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new round starts again
  useEffect(() => {
    if (!still && !video) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setStarted(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [still, video, round]);

  // The clock: each step lasts its beats, and a pause keeps what is left of the step it fell into.
  const left = useRef<{ index: number; ms: number } | null>(null);
  useEffect(() => {
    if (!running) return;
    const ms = left.current?.index === index && left.current.ms > 0 ? left.current.ms : PLAYED[index].beats * BEAT_MS;
    const from = performance.now();
    const timer = later(() => {
      if (index + 1 < PLAYED.length) setIndex(index + 1);
      else setDone(true);
    }, ms);
    return () => {
      clearTimeout(timer);
      left.current = { index, ms: ms - (performance.now() - from) };
    };
  }, [running, index, later]);

  // The sounds of a step, as it begins: the pump giving its soap, the water coming on, the chime at the table.
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new step plays them, never a pause going on
  useEffect(() => {
    if (!started) return;
    if (step.id === "water") later(() => playRecorded("splash", playSplash), BEAT_MS);
    if (step.id === "rinse") playRecorded("splash", playSplash);
    if (step.id === "soap") later(playPlop, BEAT_MS * 2.6);
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

  // A tap or a key never pauses: a child tapping the picture alone would stop the washing and not know how to go on.
  // It answers with soft rings; pausing is the button's and Space's.
  useEffect(() => {
    if (video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      if (done) return;
      if (e.key === " ") togglePause();
      else if (e.key === "ArrowRight") jump(index + 1);
      else if (e.key === "ArrowLeft") jump(index - 1);
      else ripple();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, done, index, jump, togglePause, ripple]);

  const again = () => {
    left.current = null;
    setRound((r) => r + 1);
    setIndex(0);
    setDone(false);
    setPaused(false);
    setStarted(false);
  };

  // Before the book lies open the hands stand still, seen from the back – and a painted picture already stands.
  const states = started ? stageStates(PLAYED, index, done) : `l-back r-back${step.pictures ? ` at-${step.id} pictured` : ""}`;
  const rinseAt = PLAYED.findIndex((s) => s.id === "rinse");
  const dirt = done || index >= rinseAt ? 0 : (DIRT[step.id] ?? 1);

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
      <div
        key={round}
        className={`hw-stage ${states}`}
        style={{ "--dirt": dirt } as CSSProperties}
        onPointerDown={(e) => {
          // In a video nothing on the picture answers a click.
          if (!video && !done && !paused) ripple(e.clientX, e.clientY);
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
        <Hand side="left" daytime={daytime} />
        <Hand side="right" daytime={daytime} />
        <div className="hw-layer hw-towel-wrap" style={place(AREAS.towelWrap)}>
          <TowelWrapArt />
        </div>
        {PLAYED_PICTURES.map((id) => (
          <Picture key={id} id={id} name={t(PLAYED.find((s) => s.pictures?.includes(id))?.name ?? STEPS[0].name)} />
        ))}
        {paused && (
          // While paused (only a grown-up pauses), a tap anywhere on the picture goes on: going on stops nothing.
          <div
            className="hw-paused"
            data-tap
            onPointerDown={(e) => {
              e.stopPropagation();
              togglePause();
            }}
          >
            <PauseIcon paused />
          </div>
        )}
      </div>
      {!video && !done && (
        <div className="hw-bar">
          <button
            type="button"
            className="hw-pause"
            data-tap
            aria-label={t(
              paused
                ? { en: "Go on", de: "Weiter", zh: "继续", hi: "आगे चलो", es: "Seguir", ar: "متابعة", ru: "Дальше" }
                : { en: "Pause", de: "Pause", zh: "暂停", hi: "रुको", es: "Pausa", ar: "إيقاف مؤقت", ru: "Пауза" },
            )}
            onPointerDown={togglePause}
            onClick={noPointerClick(togglePause)}
          >
            <PauseIcon paused={paused} />
          </button>
          {PLAYED.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`hw-seg${i < index ? " past" : i === index ? " now" : ""}${RUB_STEPS.includes(s.id) ? " rub" : ""}`}
              style={{ "--beats": s.beats } as CSSProperties}
              title={t(s.name)}
              aria-label={t(s.name)}
              data-tap
              onPointerDown={() => jump(i)}
              onClick={noPointerClick(() => jump(i))}
            />
          ))}
        </div>
      )}
      <FeedbackLayer effects={effects} />
      {done && !video && <GameEnd onAgain={again} />}
    </div>
  );
}
