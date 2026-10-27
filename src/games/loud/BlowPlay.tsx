import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { type Localized, pick, useAppLanguage, spokenIn } from "@/lib/language";
import { speak } from "@/lib/speech";
import type { LevelProps } from "./LoudPlay";
import { createWind } from "./mic";
import { Boat, Candles, Dandelion, Pinwheel, type Step, type StationProps } from "./stations";
import { STATION_TEXTS, type StationId } from "./texts";
import { DEV } from "@/lib/buildInfo";

/** The pictures in play order; their texts are in texts.ts. */
const STATIONS: { id: StationId; Station: ComponentType<StationProps> }[] = [
  { id: "candles", Station: Candles },
  { id: "dandelion", Station: Dandelion },
  { id: "pinwheel", Station: Pinwheel },
  { id: "boat", Station: Boat },
];

/** All pictures in turn; in development `?station=boat` in the address picks one. */
function chosenStations() {
  const fromUrl = DEV ? new URLSearchParams(window.location.search).get("station") : null;
  const one = STATIONS.find((s) => s.id === fromUrl);
  return one ? [one] : STATIONS;
}

/** A tap blows a short gust that calms down by this much per second; holding the finger down keeps blowing. */
const GUST_FALL_PER_S = 1.5;
const HOLD_WIND = 0.75;
/** Nobody has blown for this long: the thing wiggles, and the hint is said again. */
const NUDGE_MS = 10000;
const INTRO_DELAY_MS = 700;
/** After the last candle or the arrival, before the party. */
const DONE_PAUSE_MS = 900;
const SPEECH_MS_PER_CHAR = 80;

/**
 * Level "Pusten" (idea X-06): blowing into the microphone blows out candles,
 * sends a dandelion's seeds flying, turns a pinwheel and sails a boat across
 * the sea. Tapping blows a gust, so it works without a microphone too.
 */
export function BlowPlay({ settings, mic, listen, celebrate, onDone }: LevelProps) {
  // The pictures speak the app language, in its voice.
  const language = useAppLanguage();
  const stations = useMemo(chosenStations, []);
  const [round, setRound] = useState(0);
  const [nudge, setNudge] = useState(false);
  const station = stations[round % stations.length];
  const texts = STATION_TEXTS[station.id];
  const rootRef = useRef<HTMLDivElement>(null);
  const step = useRef<Step | null>(null);
  const micWind = useRef(0);
  const gust = useRef(0);
  const held = useRef(false);
  /** The picture is done: no more wind until the next one. */
  const finished = useRef(false);
  /** Until then the microphone hears nothing: the game is making sounds or talking. */
  const deafUntil = useRef(0);
  const lastBlow = useRef(performance.now());
  const micRef = useRef(mic);
  micRef.current = mic;
  const ear = useMemo(createWind, []);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  const deafFor = useCallback((ms: number) => {
    deafUntil.current = Math.max(deafUntil.current, performance.now() + ms);
  }, []);

  const say = useCallback(
    (texts: Localized) => {
      if (!settings.speech) return;
      const { text, lang } = spokenIn(texts, language);
      const rate = 0.85;
      deafFor((text.length * SPEECH_MS_PER_CHAR) / rate + 600);
      speak(text, lang, { rate });
    },
    [deafFor, settings.speech, language],
  );

  listen.current = (db, ms) => {
    micWind.current = ear.blow(db, ms, performance.now() < deafUntil.current, settings.sensitivity);
  };

  const introFor = useCallback(() => texts.intro[micRef.current === "on" ? "mic" : "tap"], [texts]);

  useEffect(() => {
    finished.current = false;
    lastBlow.current = performance.now();
    later(INTRO_DELAY_MS, () => say(introFor()));
  }, [introFor, later, say]);

  // One loop for the wind from the microphone and from taps; the picture moves with it.
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(t - last, 100) / 1000;
      last = t;
      gust.current = held.current ? Math.max(gust.current, HOLD_WIND) : Math.max(0, gust.current - GUST_FALL_PER_S * dt);
      const wind = finished.current ? 0 : Math.max(micWind.current, gust.current);
      if (wind > 0.2) lastBlow.current = performance.now();
      rootRef.current?.style.setProperty("--wind", wind.toFixed(3));
      step.current?.(wind, dt);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      if (finished.current || performance.now() - lastBlow.current < NUDGE_MS) return;
      lastBlow.current = performance.now();
      setNudge(true);
      later(2000, () => setNudge(false));
      say(introFor());
    }, 1000);
    return () => clearInterval(tick);
  }, [introFor, later, say]);

  useEffect(() => {
    const release = () => (held.current = false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);

  const sound = useCallback(
    (play: () => void, ms = 500) => {
      deafFor(ms);
      play();
    },
    [deafFor],
  );

  const done = useCallback(
    (pause = DONE_PAUSE_MS) => {
      if (finished.current) return;
      finished.current = true;
      const last = round % stations.length === stations.length - 1;
      later(pause, () => {
        say(texts.cheer);
        celebrate(() => (last && onDone ? onDone() : setRound((r) => r + 1)));
      });
    },
    [celebrate, later, onDone, round, say, texts, stations.length],
  );

  const Station = station.Station;
  return (
    <div
      ref={rootRef}
      className={["blow-play", `bl-${station.id}`, nudge && "bl-nudging"].filter(Boolean).join(" ")}
      onPointerDown={() => {
        gust.current = 1;
        held.current = true;
        lastBlow.current = performance.now();
      }}
    >
      <svg className="loud-scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax meet" role="img" aria-label={pick(texts.label, language.id)}>
        <Station key={round} step={step} done={done} sound={sound} />
      </svg>
    </div>
  );
}
