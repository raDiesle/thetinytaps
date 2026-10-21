import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playChime, playCountNote, playPoof, playSqueak, playTuneNote, setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { useWakeLock } from "@/lib/wakeLock";
import { Mouth, sideTeeth, type MonsterSpot, type Row, type Side } from "./mouth";
import type { TeethSettings } from "./settings";
import "./teeth.css";

/** The four corners of the mouth, brushed one after the other for a quarter of the time each. */
const CORNERS: { row: Row; side: Side; cue: string; label: string }[] = [
  { row: "top", side: "left", cue: "Jetzt oben!", label: "⬆️ Oben" },
  { row: "top", side: "right", cue: "Und oben auf der anderen Seite!", label: "⬆️ Oben" },
  { row: "bottom", side: "left", cue: "Jetzt unten!", label: "⬇️ Unten" },
  { row: "bottom", side: "right", cue: "Und unten auf der anderen Seite!", label: "⬇️ Unten" },
];

const MONSTER_COLORS = ["#8bd346", "#b388ff", "#ff9f43", "#ff7bd0", "#4cc9f0"];
/** Time for the monsters to show up and be greeted before the clock starts. */
const INTRO_MS = 4500;
const TICK_MS = 200;
const BEAT_MS = 280;
const TICKLE_MS = 700;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

interface Monster {
  id: number;
  row: Row;
  tooth: number;
  color: string;
  corner: number;
  /** 0 goes first in its corner. */
  order: number;
}

/** One monster on every tooth, each corner's in a random order. */
function placeMonsters(): Monster[] {
  return CORNERS.flatMap(({ row, side }, corner) =>
    shuffle(sideTeeth(side)).map((tooth, order) => ({
      id: corner * 10 + tooth,
      row,
      tooth,
      color: MONSTER_COLORS[Math.floor(Math.random() * MONSTER_COLORS.length)],
      corner,
      order,
    })),
  );
}

const formatTime = (ms: number) => {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

/**
 * A brushing timer that needs no tapping: sugar monsters sit on every tooth,
 * and while one corner of the mouth is brushed its monsters vanish one by one.
 */
export function TeethPlay({ speechLang, settings }: { speechLang: string; settings: TeethSettings }) {
  const [startAt, setStartAt] = useState(() => performance.now());
  const [now, setNow] = useState(startAt);
  const [round, setRound] = useState(0);
  const [tickled, setTickled] = useState<number | null>(null);
  const { bursts, spawn } = useBursts();
  const tickleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastGone = useRef(0);

  // A fresh set of monsters for every round.
  const monsters = useMemo(placeMonsters, [round]);
  const cornerMs = (Number(settings.minutes) * 60_000) / CORNERS.length;
  const totalMs = cornerMs * CORNERS.length;
  const brushed = now - startAt - INTRO_MS;
  const done = brushed >= totalMs;
  /** -1 during the intro, CORNERS.length when done. */
  const phase = brushed < 0 ? -1 : done ? CORNERS.length : Math.floor(brushed / cornerMs);
  const perCorner = sideTeeth("left").length;
  // The last one goes a moment before the corner's time is up, so it's gone when the brush moves on.
  const isGone = (m: Monster) => brushed >= (m.corner + (m.order + 1) / perCorner - 0.06) * cornerMs;
  const goneCount = monsters.filter(isGone).length;

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
    if (done) return;
    const timer = setInterval(() => setNow(performance.now()), TICK_MS);
    return () => clearInterval(timer);
  }, [done, round]);

  const brushing = phase >= 0 && !done;
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
    } else if (phase < CORNERS.length) {
      if (settings.sounds) playChime();
      say(CORNERS[phase].cue, true);
    } else {
      if (settings.sounds) [0, 1, 2, 3, 4, 5].forEach((i) => setTimeout(() => playCountNote(i), i * 120));
      say("Fertig! Alle Zuckermonster sind weg. Blitzeblank!");
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

  const again = () => {
    const t = performance.now();
    setStartAt(t);
    setNow(t);
    setRound((r) => r + 1);
  };

  const corner = brushing ? CORNERS[phase] : null;
  const spots: MonsterSpot[] = monsters.map((m) => ({
    id: m.id,
    row: m.row,
    tooth: m.tooth,
    color: m.color,
    delayMs: 600 + (m.corner * perCorner + m.order) * 180,
    gone: isGone(m),
    tickled: tickled === m.id,
  }));

  return (
    <div className={`teeth-play${settings.calm ? " calm" : ""}${done ? " done" : ""}`}>
      <p className="teeth-clock" aria-label="Restzeit">
        {formatTime(totalMs - Math.max(0, Math.min(brushed, totalMs)))}
      </p>
      <h2 className="teeth-cue" key={`${round}-${phase}-${corner?.label}`}>
        {phase === -1 ? "😱 Zuckermonster!" : corner ? corner.label : "✨ Blitzeblank!"}
      </h2>

      <div className="teeth-stage">
        <Mouth key={round} monsters={spots} active={corner} sparkling={done} onTickle={tickle} />
      </div>

      {done ? (
        <button className="teeth-again" onClick={again}>
          🔁 Nochmal
        </button>
      ) : (
        <div className="teeth-progress" aria-hidden>
          {CORNERS.map((c, i) => (
            <span key={i} className={`teeth-segment${i === phase ? " now" : ""}`}>
              <span style={{ width: `${Math.max(0, Math.min(1, (brushed - i * cornerMs) / cornerMs)) * 100}%` }} />
            </span>
          ))}
        </div>
      )}

      <BurstLayer bursts={bursts} />
    </div>
  );
}
