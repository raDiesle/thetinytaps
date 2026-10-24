import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { speak } from "@/lib/speech";
import { framesFor, imageFor } from "./images";
import { SOUNDS, type SoundName } from "./story";
import type { FeelingsSettings } from "./settings";

const SPEECH_LANG = "de-DE";

/** How long each frame of a picture stays before the next one fades in. */
const FRAME_MS = 900;

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
  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, SPEECH_LANG, { queue, rate: 0.85 });
    },
    [settings.speech],
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
    <div className="fg-floaters" aria-hidden>
      {floaters.map((f, i) => (
        <span key={f.id} className="fg-floater" style={{ left: `${f.x}%`, bottom: `${f.y}%`, "--i": i % 4, "--float-ms": `${FLOAT_MS}ms` } as CSSProperties}>
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

/**
 * The big picture in the middle: what happens right now. Its frames fade into
 * each other in a loop, like a tiny GIF, so the animals seem to move a little.
 * Give it a new `key` with every new picture, so it starts at the first frame.
 */
export function StoryPicture({
  name,
  children,
  onPointerDown,
}: {
  name: string;
  /** Things on top of the picture: a cross, floating hearts. */
  children?: ReactNode;
  onPointerDown?: (e: PointerEvent) => void;
}) {
  const frames = framesFor(name);
  const [frame, setFrame] = useState(0);
  const moving = frames.length > 1;

  useEffect(() => {
    if (!moving || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(timer);
  }, [moving]);

  const shown = frame % Math.max(frames.length, 1);

  return (
    <div className="fg-picture" onPointerDown={onPointerDown}>
      {frames.map((src, i) => (
        <img key={src} className={i === shown ? "on" : undefined} src={src} alt="" decoding="async" draggable={false} />
      ))}
      {children}
    </div>
  );
}

/**
 * "choose": the child can tap it. "playing": chosen, the bear does it now.
 * "done": done, with a tick. "wrong": the not-so-good idea, crossed out. "rest": waits.
 */
export type CardState = "choose" | "playing" | "done" | "wrong" | "rest";

/** A big picture button: what the bear can do, to be understood without reading. */
export function ChoiceCard({
  image,
  label,
  state,
  small = false,
  onChoose,
}: {
  /** Name of the picture, see images.ts. */
  image: string;
  /** Not shown, for screen readers. */
  label: string;
  state: CardState;
  small?: boolean;
  onChoose?: () => void;
}) {
  return (
    <button
      type="button"
      className={`fg-card fg-card-${state}${small ? " small" : ""}`}
      disabled={state !== "choose"}
      aria-label={label}
      onPointerDown={(e: PointerEvent) => {
        e.stopPropagation();
        if (state === "choose") onChoose?.();
      }}
    >
      <img className="fg-card-image" src={imageFor(image)} alt="" decoding="async" draggable={false} />
      {(state === "playing" || state === "done") && <Mark good className="fg-card-mark" />}
      {state === "wrong" && <Mark good={false} className="fg-card-mark" />}
    </button>
  );
}

/** A round green tick or red cross: good idea, or not so good. Drawn, so it reads the same everywhere. */
export function Mark({ good, className = "" }: { good: boolean; className?: string }) {
  return (
    <svg className={`fg-mark ${good ? "good" : "bad"} ${className}`} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r="44" />
      <path d={good ? "M28 52 L44 68 L73 34" : "M32 32 L68 68 M68 32 L32 68"} />
    </svg>
  );
}

/** One dot per step at the top: green with a tick when done, yellow for the one that comes now. */
export function StepDots({ total, done, current }: { total: number; done: number; current: boolean }) {
  return (
    <span className="fg-dots" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`fg-dot${i < done ? " done" : ""}${i === done && current ? " now" : ""}`}>
          {i < done ? "✓" : ""}
        </span>
      ))}
    </span>
  );
}

/** At the end of a story: play it again (small, white) or go on to the next one (big, yellow). Only pictures, no words. */
export function EndButtons({ onAgain, onNext }: { onAgain: () => void; onNext: () => void }) {
  // Pointer down, not click: it reacts right away, and the picture underneath doesn't get the tap.
  const press = (action: () => void) => (e: PointerEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="fg-end">
      <button type="button" className="fg-round again" aria-label="Nochmal" onPointerDown={press(onAgain)}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
          <path d="M2.5 3.5v5h5" />
        </svg>
      </button>
      <button type="button" className="fg-round next" aria-label="Weiter" onPointerDown={press(onNext)}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M8 4.5v15l12-7.5z" />
        </svg>
      </button>
    </div>
  );
}
