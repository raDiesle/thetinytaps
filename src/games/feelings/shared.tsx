import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { Critter, type Face, type Species } from "./Critter";
import { SOUNDS, type ActorId, type ActorState, type SoundName } from "./story";
import type { FeelingsSettings } from "./settings";

const SPEECH_LANG = "de-DE";

const SPECIES: Record<ActorId, Species> = { bear: "bear", fox: "fox", bunny: "bunny", teacher: "mouse" };

/** Timeouts that are all cleared when the game ends or a new story starts. */
export function useTimers() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      fn();
    }, ms);
    timers.current.add(timer);
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  return { later, clearAll };
}

/** Speech and sounds as the parent set them up. */
export function useVoice(settings: FeelingsSettings) {
  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, SPEECH_LANG, { queue, rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm],
  );

  const sound = useCallback(
    (name: SoundName | undefined) => {
      if (name && settings.sounds) SOUNDS[name]();
    },
    [settings.sounds],
  );

  return { say, sound };
}

interface Floater {
  id: number;
  emoji: string;
  /** In % of the stage. */
  x: number;
  y: number;
}

const FLOAT_MS = 1800;

/** Hearts, notes or puffs that float up from somewhere on the stage and fade away. */
export function useFloaters() {
  const [floaters, setFloaters] = useState<Floater[]>([]);
  const nextId = useRef(0);
  const { later } = useTimers();

  const float = useCallback(
    (emoji: string, x: number, y: number, count = 4) => {
      const fresh = Array.from({ length: count }, (_, i) => ({
        id: nextId.current++,
        emoji,
        x: x + (i - (count - 1) / 2) * 7 + Math.random() * 4,
        y: y + Math.random() * 8,
      }));
      setFloaters((prev) => [...prev.slice(-20), ...fresh]);
      later(() => setFloaters((prev) => prev.filter((f) => !fresh.includes(f))), FLOAT_MS);
    },
    [later],
  );

  return { floaters, float };
}

export function FloaterLayer({ floaters }: { floaters: Floater[] }) {
  return (
    <div className="floaters" aria-hidden>
      {floaters.map((f, i) => (
        <span
          key={f.id}
          className="floater"
          style={{ left: `${f.x}%`, bottom: `${f.y}%`, "--i": i % 4, "--float-ms": `${FLOAT_MS}ms` } as CSSProperties}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

/** One animal on the stage: where it stands, its pose, what it holds and says. */
export function Actor({
  id,
  state,
  face,
  line,
  className = "",
  onPointerDown,
}: {
  id: ActorId;
  state: ActorState;
  face: Face;
  line?: string;
  className?: string;
  onPointerDown?: (e: PointerEvent) => void;
}) {
  return (
    <div
      className={`actor actor-${id} pose-${state.pose} ${className}`}
      style={{ left: `${state.x}%`, bottom: `${state.y}%` }}
      onPointerDown={onPointerDown}
    >
      {line && (
        <div key={line} className="bubble">
          {line}
        </div>
      )}
      <div className={`actor-figure${state.face === "left" ? " flip" : ""}`}>
        <Critter species={SPECIES[id]} face={face} teacher={id === "teacher"} />
        {state.holds && <span className="held">{state.holds}</span>}
      </div>
    </div>
  );
}
