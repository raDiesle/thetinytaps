import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { useLeaveGame } from "@/components/GameShell";
import { PlayOptions } from "@/components/PlayOptions";
import { SettingsGroup } from "@/components/SettingControls";
import { DEV } from "@/lib/buildInfo";
import { useT } from "@/lib/language";
import { playBlow, playMunch, playWhistle } from "@/lib/realSounds";
import {
  loadRecordings,
  playBeeps,
  playBuzz,
  playChime,
  playChimeNote,
  playClick,
  playDing,
  playDrops,
  playLeaves,
  playMelody,
  playPlink,
  playPlop,
  playPop,
  playTusch,
  playTwinkle,
  playYawn,
  playYum,
  recorded,
} from "@/lib/sfx";
import { useWakeLock } from "@/lib/wakeLock";
import { AppleScene } from "./apples";
import { CaterpillarScene } from "./caterpillar";
import { ClockScene } from "./clock";
import { nextPicture, OTHER_TIME, PICTURES, tomorrowAt } from "./content";
import { DiscScene } from "./disc";
import { FlowerScene } from "./flower";
import { appleCount, appleTimes, haltMs, ladybugLaps, MAX_STOPS, pieceCount, pieceMoments, soonMs, trainSteps } from "./pieces";
import { PizzaScene, SLICES } from "./pizza";
import {
  AntHill,
  AntRoad,
  AntsBackdrop,
  AntsHome,
  Cookie,
  CandleBackdrop,
  Candles,
  Hourglass,
  Layer,
  RAIL_Y,
  RailAhead,
  SandBackdrop,
  TRAIN,
  Train,
  TrainBackdrop,
  TrainStops,
} from "./scenes";
import type { SwapToy, TimeShown, TimerPicture, TimerSettings } from "./settings";
import { TimeShownChoice, TimeShownNote } from "./shown";
import { SunsetScene } from "./sunset";
import { SwapRun } from "./SwapPlay";
import { clockOn, digits, ownTimeMs } from "./time";

/** The last candle goes out with a puff this long after the time is up. */
const BLOW_MS = 700;
/** Then children cheer, and „Nochmal“ and „Weiter“ come after this long (the butterfly takes longer to come out). */
const END_MS = 4200;
const END_MS_CATERPILLAR = 5600;
/** The cheer at the end comes this long after the picture's own sound, so both are heard. */
const CHEER_MS = 700;
/** A piece's sound (a plop, a munch) comes at most this often: with many apples or slices they come every few seconds. */
const PIECE_SOUND_GAP_MS = 2500;

/** Children cheering when the time is up (a recording, else a flourish). */
const playCheer = recorded("cheer", playTusch);
/** After this long without a tap, all that is small steps back and only what runs down stays bright (H-48). */
const FAR_AFTER_MS = 8000;

/** In development, `?sekunden=<n>` in the address makes every run take n seconds. */
export function devMs() {
  const seconds = DEV ? Number(new URLSearchParams(window.location.search).get("sekunden")) : 0;
  return seconds > 0 ? seconds * 1000 : 0;
}

/** How long a run takes from now: the row's length or the own time – or `"past"`, a clock time already behind us today. */
function planMs(settings: TimerSettings, dev = devMs()): number | "past" {
  if (dev) return dev;
  if (settings.useOwn && settings.own) return ownTimeMs(settings.own, new Date());
  return settings.seconds * 1000;
}

/** running: the picture runs down; blow: the time is up, the last candle goes out with a puff; done: the picture's end. */
type Phase = "running" | "blow" | "done";

/**
 * The timer: one picture runs down for the minutes a grown-up set, with no numbers for the child – the train rolls to
 * the station, the sand runs through the hourglass, the candle burns down. Every tap or key gets an answer (steam and
 * a whistle, twinkling, the flame flaring). At the end a friendly tune, then „Nochmal“ and
 * „Weiter“ (the next picture, the same minutes).
 */
export function TimerPlay({
  settings,
  onPicture,
  onToy,
  onShown,
}: {
  settings: TimerSettings;
  onPicture: (picture: TimerPicture) => void;
  /** A grown-up picks another toy for „Abwechseln“ behind ⚙️. */
  onToy: (toy: SwapToy) => void;
  /** A grown-up has the time left shown in the picture, or not, behind ⚙️. */
  onShown: (shown: TimeShown) => void;
}) {
  const [run, setRun] = useState(0);
  const again = () => setRun((n) => n + 1);
  const pick = (picture: TimerPicture) => {
    onPicture(picture);
    again();
  };
  return <TimerStart key={run} settings={settings} onAgain={again} onPicture={pick} onToy={onToy} onShown={onShown} />;
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
  onShown,
}: {
  settings: TimerSettings;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
  onToy: (toy: SwapToy) => void;
  onShown: (shown: TimeShown) => void;
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
          <p>
            {t({
              de: `Es ist schon nach ${until}.`,
              en: `It's already past ${until}.`,
              zh: `已经过了 ${until}。`,
              hi: `${until} बज चुके हैं।`,
              es: `Ya son más de las ${until}.`,
              ar: `تجاوزت الساعة ${until} بالفعل.`,
              ru: `Уже позже ${until}.`,
            })}
          </p>
          <div className="tm-sheet-actions">
            <button type="button" className="tm-sheet-secondary" onClick={leave}>
              {t(OTHER_TIME)}
            </button>
            <button type="button" className="tm-sheet-ok" onClick={() => setTotal(clockOn(until, new Date(), true) - Date.now())}>
              {t(tomorrowAt(until))}
            </button>
          </div>
        </section>
      </div>
    );
  }
  if (settings.picture === "swap") {
    // Abwechseln (H-52): the time set is one child's turn, and the turns go on until a grown-up stops – or, with a
    // clock time set, until then, each turn as long as the row's length.
    const turn = devMs() || (settings.useOwn && settings.own?.kind === "for" ? settings.own.seconds * 1000 : settings.seconds * 1000);
    return (
      <SwapRun
        turnMs={turn}
        totalMs={until ? (total === "past" ? 0 : total) : undefined}
        until={until}
        toy={settings.toy}
        onToy={onToy}
        timeShown={settings.timeNote}
        onShown={onShown}
        onAgain={onAgain}
        onPicture={onPicture}
      />
    );
  }
  const ms = total === "past" ? 0 : total;
  const set = typeof minutes === "number" ? minutes : ms;
  return (
    <TimerRun
      picture={settings.picture}
      total={ms}
      set={set}
      until={until}
      shown={settings.timeNote}
      onShown={onShown}
      onAgain={onAgain}
      onPicture={onPicture}
    />
  );
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
    <SettingsGroup
      title={
        title ?? t({ de: "Restzeit", en: "Time left", zh: "剩余时间", hi: "बचा हुआ समय", es: "Tiempo restante", ar: "الوقت المتبقي", ru: "Осталось времени" })
      }
    >
      <p className="tm-left">
        <b>
          {left > 0
            ? t({
                de: `${digits(left)} noch`,
                en: `${digits(left)} left`,
                zh: `还剩 ${digits(left)}`,
                hi: `${digits(left)} बाकी`,
                es: `Quedan ${digits(left)}`,
                ar: `بقي ${digits(left)}`,
                ru: `Осталось ${digits(left)}`,
              })
            : t({
                de: "Die Zeit ist um.",
                en: "Time's up.",
                zh: "时间到了。",
                hi: "समय पूरा हुआ।",
                es: "Se acabó el tiempo.",
                ar: "انتهى الوقت.",
                ru: "Время вышло.",
              })}
        </b>
        {until && (
          <span>
            {t({
              de: `bis ${until}`,
              en: `until ${until}`,
              zh: `到 ${until}`,
              hi: `${until} बजे तक`,
              es: `hasta las ${until}`,
              ar: `حتى ${until}`,
              ru: `до ${until}`,
            })}
          </span>
        )}
      </p>
    </SettingsGroup>
  );
}

function TimerRun({
  picture,
  total,
  set,
  until,
  shown,
  onShown,
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
  /** The time left in the picture's corner too, or not. */
  shown: TimeShown;
  onShown: (shown: TimeShown) => void;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
}) {
  const t = useT();
  // Real time, not the page's clock: a phone put to sleep in between still ends when the minutes are over.
  const [endsAt] = useState(() => Date.now() + total);
  const [phase, setPhase] = useState<Phase>("running");
  const [poke, setPoke] = useState(0);
  const [far, setFar] = useState(false);
  // Gleich ist es so weit (H-49): a while before the end the bell rings once, and a picture stepped back from afar comes bright again.
  const [soon, setSoon] = useState(false);
  const soonAt = endsAt - soonMs(total);
  const { effects, ripple, glow, celebrate } = useTapFeedback();
  useWakeLock(phase === "running");
  useEffect(() => loadRecordings(["cheer"]), []);

  // Piece by piece (H-45): many apples landing in the cart, a stop on the track a minute – each with its plop or its bell.
  const apples = appleCount(set);
  const stops = pieceCount(set, MAX_STOPS);
  const moments = useMemo(() => {
    if (picture === "apple")
      return appleTimes(total, apples)
        .harvest.slice(0, -1)
        .map((h) => h.land);
    if (picture === "train" && stops > 1) return pieceMoments(total, stops, haltMs(total, stops));
    if (picture === "pizza") return pieceMoments(total, SLICES);
    // The ladybug leaves a dot as it is back at the top (H-67).
    if (picture === "disc") return pieceMoments(total, ladybugLaps(set).dots);
    return [];
  }, [picture, total, set, apples, stops]);
  const nextMoment = useRef(0);
  const soonRang = useRef(false);
  const lastPieceSound = useRef(Number.NEGATIVE_INFINITY);

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
        // Many apples or slices fall every few seconds: their sound is spaced, so it never becomes a din.
        if (now - lastPieceSound.current >= PIECE_SOUND_GAP_MS) {
          lastPieceSound.current = now;
          if (picture === "apple") playPlop();
          else if (picture === "pizza") playMunch();
          else if (picture === "disc") playPlink(nextMoment.current);
          else playDing();
        }
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
      else if (picture === "clock") playBeeps();
      // The time is up, plain to see and hear (user feedback, November 2026): children cheer, a few hearts, stars and
      // notes rise slowly over the picture, which lights up warmly, and then the friendly tune.
      const cheer = setTimeout(() => {
        playCheer();
        celebrate();
      }, CHEER_MS);
      const tune = setTimeout(playMelody, CHEER_MS + 1800);
      return () => {
        clearTimeout(cheer);
        clearTimeout(tune);
      };
    }
  }, [phase, picture, celebrate]);

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
      // The leaves rustle; once the blossoms are out, the bees buzz.
      else if (picture === "apple") (Date.now() - (endsAt - total) < appleTimes(total, apples).grown ? playLeaves : playBuzz)();
      else if (picture === "caterpillar" || picture === "pizza") playMunch();
      else if (picture === "flower") playDrops();
      // The snooze bar is pressed down.
      else if (picture === "clock") playClick();
      else playChimeNote(Math.floor(Math.random() * 8));
    },
    [phase, picture, ripple, glow, endsAt, total, apples],
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
  const clock = picture === "clock";
  return (
    <>
      <div className="tm-play" data-picture={picture} onPointerDown={down} role="img" aria-label={name ? t(name) : undefined}>
        <div className={`tm-stage tm-${phase}${far ? " tm-far" : ""}`} style={stageStyle(picture, total, stops)}>
          <SceneParts picture={picture} phase={phase} total={total} set={set} poke={poke} startedAt={endsAt - total} />
          {phase === "done" && <div className="tm-done-light" />}
        </div>
        {/* The alarm clock shows the time left on its own screen, so it needs no note in the corner. */}
        <TimeShownNote shown={phase === "running" && !clock ? shown : "off"} endsAt={endsAt} total={total} />
        <FeedbackLayer effects={effects} />
        {phase === "done" && (
          <GameEnd
            delayMs={picture === "caterpillar" ? END_MS_CATERPILLAR : END_MS}
            onAgain={onAgain}
            next={nextInfo && { name: t(nextInfo.name), onNext: () => onPicture(next) }}
          />
        )}
      </div>
      <PlayOptions>
        <TimeLeft endsAt={endsAt} until={until} />
        {!clock && <TimeShownChoice value={shown} onChange={onShown} />}
      </PlayOptions>
    </>
  );
}

/** The stage's lengths for the CSS: the run's, its seconds, the train's way, and the train's own keyframes when it halts. */
export function stageStyle(picture: TimerPicture, total: number, stops: number) {
  const stepped = picture === "train" && stops > 1;
  return {
    "--tm-ms": `${total}ms`,
    "--tm-train": `${((TRAIN.stop - TRAIN.w - TRAIN.x) / TRAIN.w) * 100}%`,
    ...(stepped && { "--tm-roll": "tm-roll-steps", "--tm-shine": "tm-shine-steps" }),
  } as CSSProperties;
}

/**
 * One picture's drawing on the stage, for a run of `total` ms cut into the pieces of `set` ms: in a run, and at its end
 * on the start screen's card (`TimerCardArt`).
 */
export function SceneParts({
  picture,
  phase,
  total,
  set,
  poke,
  startedAt,
}: {
  picture: TimerPicture;
  phase: Phase;
  total: number;
  set: number;
  /** Counts the taps, each lighting what is left. */
  poke: number;
  startedAt: number;
}) {
  const apples = appleCount(set);
  const stops = pieceCount(set, MAX_STOPS);
  const stepped = picture === "train" && stops > 1;
  return (
    <>
      {picture === "train" && (
        <>
          <TrainBackdrop />
          {stepped && <TrainStepKeyframes total={total} stops={stops} />}
          {stepped && <TrainStops pieces={stops} />}
          <RailAhead glow={poke} />
          <Layer x={TRAIN.x} y={RAIL_Y - TRAIN.h + 6} w={TRAIN.w} h={TRAIN.h} className="tm-train tm-move">
            <Train puff={poke} />
          </Layer>
        </>
      )}
      {picture === "apple" && <AppleScene count={apples} total={total} glow={poke} />}
      {picture === "caterpillar" && <CaterpillarScene glow={poke} startedAt={startedAt} total={total} done={phase === "done"} />}
      {picture === "disc" && <DiscScene glow={poke} total={total} set={set} />}
      {picture === "pizza" && <PizzaScene glow={poke} />}
      {picture === "clock" && <ClockScene glow={poke} endsAt={startedAt + total} total={total} running={phase === "running"} />}
      {picture === "flower" && <FlowerScene glow={poke} total={total} />}
      {picture === "sunset" && <SunsetScene glow={poke} />}
      {picture === "sand" && (
        <>
          <SandBackdrop />
          <Hourglass running={phase === "running"} glow={poke} />
        </>
      )}
      {picture === "candle" && (
        <>
          <CandleBackdrop />
          <Candles out={phase === "done"} flare={phase === "running" ? poke : 0} glow={poke} startedAt={startedAt} total={total} />
        </>
      )}
      {picture === "ants" && (
        <>
          <AntsBackdrop />
          <AntRoad />
          <Cookie glow={poke} />
          <AntHill />
          <AntsHome />
        </>
      )}
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
