import { useCallback, useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { GameEnd } from "@/components/GameEnd";
import { DEV } from "@/lib/buildInfo";
import { useT } from "@/lib/language";
import { playBlow, playWhistle } from "@/lib/realSounds";
import { playChime, playChimeNote, playMelody, playTwinkle } from "@/lib/sfx";
import { useWakeLock } from "@/lib/wakeLock";
import { nextPicture, PICTURES } from "./content";
import {
  CANDLE,
  CandleBackdrop,
  CandleFlame,
  CandleWax,
  Family,
  Layer,
  RAIL_Y,
  Sand,
  SAND_FLOOR,
  SandBackdrop,
  SandFrame,
  TRAIN,
  Train,
  TrainBackdrop,
} from "./scenes";
import type { TimerPicture, TimerSettings } from "./settings";

/** The child blows the candle out this long after the time is up, and the flame goes out. */
const BLOW_MS = 700;
/** Then the family cheers, and „Nochmal“ and „Weiter“ come after this long. */
const END_MS = 3200;

/** How long the timer runs: the grown-up's minutes, or in development `?sekunden=<n>` in the address. */
function runMs(minutes: number) {
  const seconds = DEV ? Number(new URLSearchParams(window.location.search).get("sekunden")) : 0;
  return seconds > 0 ? seconds * 1000 : minutes * 60_000;
}

/** running: the picture runs down; blow: the time is up, the candle is blown out; done: the family cheers. */
type Phase = "running" | "blow" | "done";

/**
 * The timer: one picture runs down for the minutes a grown-up set, with no numbers for the child – the train rolls to
 * the station, the sand runs through the hourglass, the candle burns down. Every tap or key gets an answer (steam and
 * a whistle, twinkling, the flame flaring). At the end a friendly tune and the family waving, then „Nochmal“ and
 * „Weiter“ (the next picture, the same minutes).
 */
export function TimerPlay({ settings, onPicture }: { settings: TimerSettings; onPicture: (picture: TimerPicture) => void }) {
  const [run, setRun] = useState(0);
  const again = () => setRun((n) => n + 1);
  const pick = (picture: TimerPicture) => {
    onPicture(picture);
    again();
  };
  return <TimerRun key={run} picture={settings.picture} minutes={settings.minutes} onAgain={again} onPicture={pick} />;
}

function TimerRun({
  picture,
  minutes,
  onAgain,
  onPicture,
}: {
  picture: TimerPicture;
  minutes: number;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
}) {
  const t = useT();
  const [total] = useState(() => runMs(minutes));
  // Real time, not the page's clock: a phone put to sleep in between still ends when the minutes are over.
  const [endsAt] = useState(() => Date.now() + total);
  const [phase, setPhase] = useState<Phase>("running");
  const [poke, setPoke] = useState(0);
  const { bursts, spawn } = useBursts();
  useWakeLock(phase === "running");

  // The end: checked at least every second, and again whenever the page comes back (timers sleep in the background).
  useEffect(() => {
    if (phase !== "running") return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const left = endsAt - Date.now();
      if (left <= 0) setPhase(picture === "candle" ? "blow" : "done");
      else timer = setTimeout(check, Math.min(left, 1000));
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
  }, [phase, endsAt, picture]);

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
      else if (picture === "sand") playChime();
      const timer = setTimeout(playMelody, picture === "candle" ? 500 : 900);
      return () => clearTimeout(timer);
    }
  }, [phase, picture]);

  /** A tap or a key: steam and a whistle, twinkling sand, the flame flaring – and colourful shapes where it was. */
  const answer = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      setPoke((n) => n + 1);
      if (phase !== "running") return playTwinkle();
      if (picture === "train") playWhistle();
      else if (picture === "sand") playTwinkle();
      else playChimeNote(Math.floor(Math.random() * 8));
    },
    [phase, picture, spawn],
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
  const stage = { "--tm-ms": `${total}ms`, "--tm-train": `${((TRAIN.stop - TRAIN.w - TRAIN.x) / TRAIN.w) * 100}%` } as CSSProperties;

  return (
    <div className="tm-play" data-picture={picture} onPointerDown={down} role="img" aria-label={name ? t(name) : undefined}>
      <div className={`tm-stage tm-${phase}`} style={stage}>
        {picture === "train" && (
          <>
            <TrainBackdrop />
            <Layer x={TRAIN.x} y={RAIL_Y - TRAIN.h + 6} w={TRAIN.w} h={TRAIN.h} className="tm-train tm-move">
              <Train puff={poke} />
            </Layer>
            <Family kind="bear" x={TRAIN.family} floor={628} childLeft />
          </>
        )}
        {picture === "sand" && (
          <>
            <SandBackdrop />
            <Sand running={phase === "running"} />
            <SandFrame />
            <Family kind="fox" x={1000} floor={SAND_FLOOR + 10} />
          </>
        )}
        {picture === "candle" && (
          <>
            <CandleBackdrop />
            <CandleWax />
            <CandleFlame out={phase === "done"} flare={phase === "running" ? poke : 0} />
            <Family kind="bear" x={CANDLE.cx - CANDLE.w / 2 - 300} floor={CANDLE.base + 22} />
          </>
        )}
      </div>
      <BurstLayer bursts={bursts} />
      {phase === "done" && (
        <GameEnd delayMs={END_MS} onAgain={onAgain} next={nextInfo && { emoji: nextInfo.emoji, name: t(nextInfo.name), onNext: () => onPicture(next) }} />
      )}
    </div>
  );
}
