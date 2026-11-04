import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { useLeaveGame } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { SettingsGroup } from "@/components/SettingControls";
import { DEV } from "@/lib/buildInfo";
import { useT } from "@/lib/language";
import { playBlow, playMunch, playWhistle } from "@/lib/realSounds";
import { playChime, playChimeNote, playDing, playDrops, playLeaves, playMelody, playPlop, playPop, playTwinkle, playYawn, playYum } from "@/lib/sfx";
import { useWakeLock } from "@/lib/wakeLock";
import { AppleScene } from "./apples";
import { CaterpillarScene } from "./caterpillar";
import { nextPicture, PICTURES } from "./content";
import { DiscScene } from "./disc";
import { FlowerScene } from "./flower";
import { haltMs, MAX_APPLES, MAX_STOPS, pieceCount, pieceMoments, soonMs, trainSteps } from "./pieces";
import { PizzaScene, SLICES } from "./pizza";
import {
  AntHill,
  AntRoad,
  ANT_FAMILY,
  AntsBackdrop,
  AntsHome,
  CANDLE,
  Cookie,
  CandleBackdrop,
  CandleFlame,
  CandleWax,
  Family,
  GROUND,
  Layer,
  RAIL_Y,
  RailAhead,
  Sand,
  SAND_FLOOR,
  SandBackdrop,
  SandFrame,
  TRAIN,
  Train,
  TrainBackdrop,
  TrainStops,
  WaxPuddle,
} from "./scenes";
import type { SwapToy, TimerPicture, TimerSettings } from "./settings";
import { SunsetScene } from "./sunset";
import { SwapRun } from "./SwapPlay";
import { clockOn, digits, ownTimeMs } from "./time";

/** The child blows the candle out this long after the time is up, and the flame goes out. */
const BLOW_MS = 700;
/** Then the family cheers, and „Nochmal“ and „Weiter“ come after this long (the butterfly takes longer to fly over). */
const END_MS = 3200;
const END_MS_CATERPILLAR = 5200;
/** After this long without a tap, all that is small steps back and only what runs down stays bright (H-48). */
const FAR_AFTER_MS = 8000;

/** In development, `?sekunden=<n>` in the address makes every run take n seconds. */
export function devMs() {
  const seconds = DEV ? Number(new URLSearchParams(window.location.search).get("sekunden")) : 0;
  return seconds > 0 ? seconds * 1000 : 0;
}

/** How long a run takes from now: the row's minutes or the own time – or `"past"`, a clock time already behind us today. */
function planMs(settings: TimerSettings, dev = devMs()): number | "past" {
  if (dev) return dev;
  if (settings.useOwn && settings.own) return ownTimeMs(settings.own, new Date());
  return settings.minutes * 60_000;
}

/** running: the picture runs down; blow: the time is up, the candle is blown out; done: the family cheers. */
type Phase = "running" | "blow" | "done";

/**
 * The timer: one picture runs down for the minutes a grown-up set, with no numbers for the child – the train rolls to
 * the station, the sand runs through the hourglass, the candle burns down. Every tap or key gets an answer (steam and
 * a whistle, twinkling, the flame flaring). At the end a friendly tune and the family waving, then „Nochmal“ and
 * „Weiter“ (the next picture, the same minutes).
 */
export function TimerPlay({
  settings,
  onPicture,
  onToy,
}: {
  settings: TimerSettings;
  onPicture: (picture: TimerPicture) => void;
  /** A grown-up picks another toy for „Abwechseln“ behind ⚙️. */
  onToy: (toy: SwapToy) => void;
}) {
  const [run, setRun] = useState(0);
  const again = () => setRun((n) => n + 1);
  const pick = (picture: TimerPicture) => {
    onPicture(picture);
    again();
  };
  return <TimerStart key={run} settings={settings} onAgain={again} onPicture={pick} onToy={onToy} />;
}

/**
 * One run's time, worked out as it starts. A clock time already behind us today (a „bis 17:30“ kept from yesterday, or
 * „Nochmal“ after it) is never quietly taken as tomorrow's: a grown-up is asked first (H-60).
 */
function TimerStart({
  settings,
  onAgain,
  onPicture,
  onToy,
}: {
  settings: TimerSettings;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
  onToy: (toy: SwapToy) => void;
}) {
  const t = useT();
  const leave = useLeaveGame();
  const [total, setTotal] = useState(() => planMs(settings));
  // The pieces (apples, the train's stops) come from the time set, also when `?sekunden=` shortens the run, so a
  // five-minute run can be watched in a few seconds while developing.
  const [minutes] = useState(() => planMs(settings, 0));
  const until = settings.useOwn && settings.own?.kind === "until" ? settings.own.at : undefined;

  if (total === "past" && until) {
    return (
      <div className="tm-play tm-asking">
        <section className="settings tm-ask">
          <p>{t({ de: `Es ist schon nach ${until}.` })}</p>
          <div className="tm-sheet-actions">
            <button type="button" className="tm-sheet-secondary" onClick={leave}>
              {t({ de: "Andere Zeit" })}
            </button>
            <button type="button" className="tm-sheet-ok" onClick={() => setTotal(clockOn(until, new Date(), true) - Date.now())}>
              {t({ de: `Bis morgen um ${until}` })}
            </button>
          </div>
        </section>
      </div>
    );
  }
  if (settings.picture === "swap") {
    // Abwechseln (H-52): the time set is one child's turn, and the turns go on until a grown-up stops – or, with a
    // clock time set, until then, each turn as long as the row's minutes.
    const turn = devMs() || (settings.useOwn && settings.own?.kind === "for" ? settings.own.seconds * 1000 : settings.minutes * 60_000);
    return (
      <SwapRun
        turnMs={turn}
        totalMs={until ? (total === "past" ? 0 : total) : undefined}
        until={until}
        toy={settings.toy}
        onToy={onToy}
        onAgain={onAgain}
        onPicture={onPicture}
      />
    );
  }
  const ms = total === "past" ? 0 : total;
  const set = typeof minutes === "number" ? minutes : ms;
  return <TimerRun picture={settings.picture} total={ms} set={set} until={until} onAgain={onAgain} onPicture={onPicture} />;
}

/**
 * The time left in digits, for grown-ups behind ⚙️ only (H-62): the child sees no number. Ticks only while it is shown.
 * `title` names what it counts down to, when that is not the end (the next child's turn).
 */
export function TimeLeft({ endsAt, until, title }: { endsAt: number; until?: string; title?: string }) {
  const t = useT();
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, []);
  const left = endsAt - now;
  return (
    <SettingsGroup title={title ?? t({ de: "Restzeit" })}>
      <p className="tm-left">
        <b>{left > 0 ? t({ de: `${digits(left)} noch` }) : t({ de: "Die Zeit ist um." })}</b>
        {until && <span>{t({ de: `bis ${until}` })}</span>}
      </p>
    </SettingsGroup>
  );
}

function TimerRun({
  picture,
  total,
  set,
  until,
  onAgain,
  onPicture,
}: {
  picture: TimerPicture;
  /** How long it runs, in ms. */
  total: number;
  /** How long a grown-up set it to run, in ms, which the pieces are cut from (the same as `total` but while developing). */
  set: number;
  /** The clock time it runs to, when a grown-up set one („bis 17:30“). */
  until?: string;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
}) {
  const t = useT();
  // Real time, not the page's clock: a phone put to sleep in between still ends when the minutes are over.
  const [endsAt] = useState(() => Date.now() + total);
  const [phase, setPhase] = useState<Phase>("running");
  const [poke, setPoke] = useState(0);
  const [far, setFar] = useState(false);
  // Gleich ist es so weit (H-49): a while before the end the bell rings once and the family waves.
  const [soon, setSoon] = useState(false);
  const soonAt = endsAt - soonMs(total);
  const { effects, ripple, glow } = useTapFeedback();
  useWakeLock(phase === "running");

  // Piece by piece (H-45): an apple a minute, a stop on the track a minute – each with its plop or its bell.
  const apples = pieceCount(set, MAX_APPLES);
  const stops = pieceCount(set, MAX_STOPS);
  const moments = useMemo(() => {
    if (picture === "apple") return pieceMoments(total, apples);
    if (picture === "train" && stops > 1) return pieceMoments(total, stops, haltMs(total, stops));
    if (picture === "pizza") return pieceMoments(total, SLICES);
    return [];
  }, [picture, total, apples, stops]);
  const nextMoment = useRef(0);
  const soonRang = useRef(false);

  // Seen from afar (H-48): a while after the last tap the small things step back, and a tap brings them back.
  useEffect(() => {
    setFar(false);
    if (phase !== "running") return;
    const timer = setTimeout(() => setFar(true), FAR_AFTER_MS);
    return () => clearTimeout(timer);
  }, [phase, poke, soon]);

  // The end: checked at least every second, and again whenever the page comes back (timers sleep in the background).
  useEffect(() => {
    if (phase !== "running") return;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = endsAt - total;
    const check = () => {
      const now = Date.now();
      const left = endsAt - now;
      if (left <= 0) return setPhase(picture === "candle" ? "blow" : "done");
      if (now >= soonAt && !soonRang.current) {
        soonRang.current = true;
        setSoon(true);
        playDing();
      }
      // A piece done: one sound, also when several passed while the page was away.
      if (nextMoment.current < moments.length && now >= startedAt + moments[nextMoment.current]) {
        while (nextMoment.current < moments.length && now >= startedAt + moments[nextMoment.current]) nextMoment.current++;
        if (picture === "apple") playPlop();
        else if (picture === "pizza") playMunch();
        else playDing();
      }
      const toMoment = nextMoment.current < moments.length ? startedAt + moments[nextMoment.current] - now : Number.POSITIVE_INFINITY;
      const toSoon = soonRang.current ? Number.POSITIVE_INFINITY : soonAt - now;
      timer = setTimeout(check, Math.max(10, Math.min(left, 1000, toMoment, toSoon)));
    };
    const onVisible = () => {
      clearTimeout(timer);
      check();
    };
    check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [phase, endsAt, total, picture, moments, soonAt]);

  useEffect(() => {
    if (phase === "blow") {
      const timer = setTimeout(() => {
        playBlow();
        setPhase("done");
      }, BLOW_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "done") {
      if (picture === "train") playWhistle();
      else if (picture === "apple") playPlop();
      else if (picture === "caterpillar") playTwinkle();
      else if (picture === "sand" || picture === "ants" || picture === "disc") playChime();
      else if (picture === "flower") playTwinkle();
      else if (picture === "sunset") playYawn();
      else if (picture === "pizza") playYum();
      const timer = setTimeout(playMelody, picture === "candle" ? 500 : 900);
      return () => clearTimeout(timer);
    }
  }, [phase, picture]);

  /**
   * A tap or a key: steam and a whistle, twinkling sand, the flame flaring – and what is still left lights up softly
   * (H-51: the rail to the station, the sand on top, the wax, the cookie), so the child can look how long it still is.
   * After the end, soft ripples where it was.
   */
  const answer = useCallback(
    (x?: number, y?: number) => {
      if (phase !== "running") {
        ripple(x, y);
        return playTwinkle();
      }
      glow(x, y);
      setPoke((n) => n + 1);
      if (picture === "train") playWhistle();
      else if (picture === "sand") playTwinkle();
      else if (picture === "ants") playPop();
      else if (picture === "apple") playLeaves();
      else if (picture === "caterpillar" || picture === "pizza") playMunch();
      else if (picture === "flower") playDrops();
      else playChimeNote(Math.floor(Math.random() * 8));
    },
    [phase, picture, ripple, glow],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      answer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  const down = (e: PointerEvent) => answer(e.clientX, e.clientY);
  const next = nextPicture(picture);
  const nextInfo = PICTURES.find((p) => p.id === next);
  const name = PICTURES.find((p) => p.id === picture)?.name;
  const stepped = picture === "train" && stops > 1;
  const stage = {
    "--tm-ms": `${total}ms`,
    "--tm-train": `${((TRAIN.stop - TRAIN.w - TRAIN.x) / TRAIN.w) * 100}%`,
    "--tm-n": apples,
    ...(stepped && { "--tm-roll": "tm-roll-steps", "--tm-shine": "tm-shine-steps" }),
  } as CSSProperties;

  return (
    <>
      <div className="tm-play" data-picture={picture} onPointerDown={down} role="img" aria-label={name ? t(name) : undefined}>
        <div className={`tm-stage tm-${phase}${far ? " tm-far" : ""}${soon ? " tm-soon" : ""}`} style={stage}>
          {picture === "train" && (
            <>
              <TrainBackdrop />
              {stepped && <TrainStepKeyframes total={total} stops={stops} />}
              {stepped && <TrainStops pieces={stops} />}
              <RailAhead glow={poke} />
              <Layer x={TRAIN.x} y={RAIL_Y - TRAIN.h + 6} w={TRAIN.w} h={TRAIN.h} className="tm-train tm-move">
                <Train puff={poke} />
              </Layer>
              <Family kind="bear" x={TRAIN.family} floor={628} childLeft />
            </>
          )}
          {picture === "apple" && <AppleScene count={apples} total={total} glow={poke} />}
          {picture === "caterpillar" && <CaterpillarScene glow={poke} />}
          {picture === "disc" && <DiscScene glow={poke} />}
          {picture === "pizza" && <PizzaScene glow={poke} />}
          {picture === "flower" && <FlowerScene glow={poke} running={phase === "running"} />}
          {picture === "sunset" && <SunsetScene glow={poke} done={phase === "done"} />}
          {picture === "sand" && (
            <>
              <SandBackdrop />
              <Sand running={phase === "running"} glow={poke} />
              <SandFrame />
              <Family kind="fox" x={1000} floor={SAND_FLOOR + 10} />
            </>
          )}
          {picture === "candle" && (
            <>
              <CandleBackdrop />
              <WaxPuddle />
              <CandleWax glow={poke} />
              <CandleFlame out={phase === "done"} flare={phase === "running" ? poke : 0} />
              <Family kind="bear" x={CANDLE.cx - CANDLE.w / 2 - 300} floor={CANDLE.base + 22} />
            </>
          )}
          {picture === "ants" && (
            <>
              <AntsBackdrop />
              <AntRoad />
              <Cookie glow={poke} />
              <AntHill />
              <AntsHome />
              <Family kind="fox" x={ANT_FAMILY} floor={GROUND + 30} childLeft laugh={phase === "done"} />
            </>
          )}
        </div>
        <FeedbackLayer effects={effects} />
        {phase === "done" && (
          <GameEnd
            delayMs={picture === "caterpillar" ? END_MS_CATERPILLAR : END_MS}
            noFamily
            onAgain={onAgain}
            next={nextInfo && { name: t(nextInfo.name), onNext: () => onPicture(next) }}
          />
        )}
      </div>
      <PlayOptions>
        <TimeLeft endsAt={endsAt} until={until} />
      </PlayOptions>
    </>
  );
}

/**
 * The train's way stop by stop (H-45) as keyframes made for this run, since how many stops there are and when it halts
 * depends on the time set: it rolls each stretch, eases into the stop and stands there before rolling on. The rail ahead
 * shines in step with it. The stage names them in `--tm-roll` and `--tm-shine`.
 */
function TrainStepKeyframes({ total, stops }: { total: number; stops: number }) {
  const steps = trainSteps(total, stops, haltMs(total, stops));
  const frames = (name: string, at: (part: number) => string) =>
    `@keyframes ${name} {${steps.map((s) => `${(s.at * 100).toFixed(3)}% { transform: ${at(s.part)}; animation-timing-function: ease-in-out; }`).join(" ")}}`;
  return (
    <style>
      {frames("tm-roll-steps", (part) => `translateX(calc(var(--tm-train) * ${part}))`)}
      {frames("tm-shine-steps", (part) => `scaleX(${1 - part})`)}
    </style>
  );
}
