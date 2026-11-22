import { type CSSProperties, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useNoBackgroundMusic } from "@/lib/backgroundMusic";
import { type Daytime, daytimeOf } from "@/lib/days";
import { useT } from "@/lib/language";
import { usePageStill } from "@/lib/pageMotion";
import { noPointerClick } from "@/lib/press";
import { loadRecordings, playChime, playGiggle, playPlop, playRecorded, playSplash, playTuneNote } from "@/lib/sfx";
import { stepInAddress, useStepAddress } from "@/lib/stepAddress";
import { useTimers } from "@/lib/timers";
import { useWakeLock } from "@/lib/wakeLock";
import { DIRT_MONSTERS, type DirtMonster, Foam, GLINTS, HandArt, handSpot, MONSTER_W, MonsterArt, Sleeve, SoapDab, Wet } from "./hands";
import { AREAS, LeverArt, place, PumpHeadArt, SinkPicture, SplashArt, Stream, TowelArt } from "./sink";
import { BEAT_MS, RUB_STEPS, STEPS, type StepId } from "./steps";

/** The hand washing played for a video (`HandwashVideo`): the picture alone, nothing to tap, nothing kept. */
export interface VideoRun {
  /** Morning or evening, chosen for the video instead of read from the clock. */
  daytime: Daytime;
  /** Called once the clean hands have shone a moment, to end the recording. */
  onFinished: () => void;
}

/** After the last step a video keeps the clean hands this long before it ends. */
const VIDEO_TAIL_MS = 2500;

const indexOf = (id: StepId) => STEPS.findIndex((s) => s.id === id);

/** Grains a washed-off monster falls apart into: where they drift (in % of the monster) and whether they are foam. */
const GRAINS = [
  { dx: -70, dy: -60, foam: true },
  { dx: 60, dy: -80, foam: false },
  { dx: -40, dy: 70, foam: false },
  { dx: 80, dy: 30, foam: true },
  { dx: 10, dy: -110, foam: true },
  { dx: -90, dy: 10, foam: false },
];

/** Where a monster stands: still waiting, being washed off now, or gone. */
type MonsterState = "waiting" | "active" | "gone";

/** One dirt monster on its hand, a small HTML layer of its own: it dances to the beat in its step, then dissolves. */
const Monster = memo(function Monster({
  monster,
  state,
  tickled,
  onTickle,
}: {
  monster: DirtMonster;
  state: MonsterState;
  tickled: boolean;
  onTickle: (id: string) => void;
}) {
  return (
    <div
      className={`hw-monster ${state}${tickled && state === "waiting" ? " tickled" : ""}`}
      style={handSpot(monster.x, monster.y, MONSTER_W)}
      data-tap={state === "gone" ? "done" : ""}
      onPointerDown={(e) => {
        if (state !== "waiting") return;
        // A tapped monster giggles instead of the tap pausing the washing.
        e.stopPropagation();
        onTickle(monster.id);
      }}
    >
      <div className="hw-monster-body">
        <MonsterArt color={monster.color} variant={monster.variant} />
      </div>
      {state === "active" &&
        GRAINS.map((g, i) => (
          <i
            key={i}
            className={`hw-grain${g.foam ? " foam" : ""}`}
            style={{ "--dx": `${g.dx}%`, "--dy": `${g.dy}%`, "--grain": monster.color } as CSSProperties}
          />
        ))}
    </div>
  );
});

/** One hand with its sleeve, its wet shine, the soap, the foam, its dirt monsters and its glints. */
function Hand({
  side,
  daytime,
  stateOf,
  tickled,
  onTickle,
}: {
  side: "left" | "right";
  daytime: Daytime;
  stateOf: (monster: DirtMonster) => MonsterState;
  tickled: string | null;
  onTickle: (id: string) => void;
}) {
  return (
    <div className={`hw-hand hw-${side}`} style={place(AREAS[side])}>
      <div className="hw-pose">
        <div className="hw-rub">
          <div className="hw-mirror">
            <HandArt side={side} />
            <div className="hw-wet">
              <Wet />
            </div>
            {side === "left" && (
              <div className="hw-dab" style={handSpot(166, 340, 70)}>
                <SoapDab />
              </div>
            )}
            <div className="hw-foam">
              <Foam />
            </div>
            {DIRT_MONSTERS.filter((m) => m.side === side).map((m) => (
              <Monster key={m.id} monster={m} state={stateOf(m)} tickled={tickled === m.id} onTickle={onTickle} />
            ))}
            {GLINTS.map((g, i) => (
              <i
                key={i}
                className="hw-glint"
                style={{ ...handSpot(g.x, g.y, 64), animationDelay: `${((g.delay + (side === "right" ? 0.75 : 0)) * BEAT_MS) / 1000}s` }}
              />
            ))}
            <div className="hw-sleeve">
              <Sleeve side={side} daytime={daytime} />
            </div>
          </div>
        </div>
      </div>
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

/**
 * Hände waschen (idea H-136): the child's own hands over the basin, washed step by step to the beat of the song to come
 * – sleeves up, water on, wet, soap, the five rubbing steps that wash off a dirt monster each, rinse, water off and the
 * towel, then the clean hands shine. It plays by itself, no tapping needed: a tap on the picture or Space pauses, the
 * arrow keys and the bar jump between steps, a tapped monster giggles.
 */
export function HandwashPlay({ video }: { video?: VideoRun }) {
  const t = useT();
  const { later } = useTimers();
  const still = usePageStill();
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(() => Math.max(0, video ? 0 : STEPS.findIndex((s) => s.id === stepInAddress())));
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  // The picture stands at its start until the book lies open: only then the states come on and their motions run.
  const [started, setStarted] = useState(false);
  const [tickled, setTickled] = useState<string | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: a new round reads the clock again
  const daytime = useMemo(() => video?.daytime ?? daytimeOf(), [video?.daytime, round]);
  const running = started && !paused && !done;
  const step = STEPS[index];

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
    const ms = left.current?.index === index && left.current.ms > 0 ? left.current.ms : STEPS[index].beats * BEAT_MS;
    const from = performance.now();
    const timer = later(() => {
      if (index + 1 < STEPS.length) setIndex(index + 1);
      else setDone(true);
    }, ms);
    return () => {
      clearTimeout(timer);
      left.current = { index, ms: ms - (performance.now() - from) };
    };
  }, [running, index, later]);

  // The sounds of a step, as it begins: the water splashing on, the pump giving its soap, the chime of clean hands.
  // A dirt monster dissolves silently: only the song is heard while rubbing (as with Zähne putzen's sugar monsters).
  // biome-ignore lint/correctness/useExhaustiveDependencies: only a new step plays them, never a pause going on
  useEffect(() => {
    if (!started) return;
    if (step.id === "water" || step.id === "rinse") later(() => playRecorded("splash", playSplash), BEAT_MS);
    if (step.id === "soap") later(playPlop, BEAT_MS * 2.4);
    if (step.id === "shine") later(playChime, BEAT_MS);
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
    if (to < 0 || to >= STEPS.length) return;
    left.current = null;
    setDone(false);
    setIndex(to);
  }, []);

  const tickle = useCallback(
    (id: string) => {
      setTickled(id);
      playGiggle();
      later(() => setTickled(null), BEAT_MS * 2);
    },
    [later],
  );

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  // A key or a tap beside the monsters makes the next one still waiting giggle (a plop once all are gone). It never
  // pauses: a child tapping the picture alone would stop the washing and not know how to go on (the perf run's taps
  // beside a monster paused it) – pausing is the button's and Space's.
  const answerBeside = useCallback(() => {
    const waiting = DIRT_MONSTERS.find((m) => indexOf(m.step) > index);
    if (waiting) tickle(waiting.id);
    else playPlop();
  }, [index, tickle]);

  useEffect(() => {
    if (video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      if (done) return;
      if (e.key === " ") togglePause();
      else if (e.key === "ArrowRight") jump(index + 1);
      else if (e.key === "ArrowLeft") jump(index - 1);
      // Every other key makes the next monster still waiting giggle.
      else answerBeside();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [video, done, index, jump, answerBeside, togglePause]);

  const again = () => {
    left.current = null;
    setRound((r) => r + 1);
    setIndex(0);
    setDone(false);
    setPaused(false);
    setStarted(false);
  };

  const stateOf = useCallback(
    (m: DirtMonster): MonsterState => {
      const at = indexOf(m.step);
      if (!started || at > index) return "waiting";
      return at === index && !done ? "active" : "gone";
    },
    [started, index, done],
  );

  const id = step.id;
  const states = started
    ? [
        `at-${done ? "done" : id}`,
        "sleeves-up",
        (id === "water" || id === "wet" || id === "rinse") && !done ? "water-on" : "",
        (id === "wet" || id === "rinse") && !done ? "hands-under" : "",
        index >= indexOf("wet") && index < indexOf("towel") && !done ? "wet" : "",
        id === "soap" && !done ? "dab" : "",
        RUB_STEPS.includes(id) && !done ? "foamy" : "",
        id === "shine" || done ? "clean" : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

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
        onPointerDown={() => {
          // In a video nothing on the picture answers a click.
          if (!video && !done && !paused) answerBeside();
        }}
      >
        <SinkPicture daytime={daytime} label={label} />
        <div className="hw-layer hw-splash" style={place(AREAS.splash)}>
          <SplashArt />
        </div>
        <Hand side="left" daytime={daytime} stateOf={stateOf} tickled={tickled} onTickle={tickle} />
        <Hand side="right" daytime={daytime} stateOf={stateOf} tickled={tickled} onTickle={tickle} />
        <div className="hw-layer hw-stream" style={place(AREAS.stream)}>
          <Stream />
        </div>
        <div className="hw-layer hw-lever" style={place(AREAS.lever)}>
          <LeverArt />
        </div>
        <div className="hw-layer hw-pump-head" style={place(AREAS.pumpHead)}>
          <PumpHeadArt />
        </div>
        <div className="hw-layer hw-towel" style={place(AREAS.towel)}>
          <TowelArt />
        </div>
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
          {STEPS.map((s, i) => (
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
      {done && !video && <GameEnd onAgain={again} />}
    </div>
  );
}
