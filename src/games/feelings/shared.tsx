import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { Critter, MOODS, type Face, type Species } from "./Critter";
import type { Place } from "./kita";
import { applyCast, SOUNDS, type ActorId, type ActorState, type Picture, type SoundName } from "./story";
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
    <div className="fg-floaters" aria-hidden>
      {floaters.map((f, i) => (
        <span
          key={f.id}
          className="fg-floater"
          style={{ left: `${f.x}%`, bottom: `${f.y}%`, "--i": i % 4, "--float-ms": `${FLOAT_MS}ms` } as CSSProperties}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}

/** One animal on the stage: where it stands, its pose, what it holds, says and thinks. */
export function Actor({
  id,
  state,
  face,
  line,
  thought,
  className = "",
  onPointerDown,
}: {
  id: ActorId;
  state: ActorState;
  face: Face;
  line?: string;
  /** A thought cloud above the head, e.g. a ❓ while the bear waits for the child. */
  thought?: ReactNode;
  className?: string;
  onPointerDown?: (e: PointerEvent) => void;
}) {
  return (
    <div
      className={`fg-actor fg-actor-${id} pose-${state.pose}${state.x < 0 || state.x > 100 ? " offstage" : ""} ${className}`}
      style={{ left: `${state.x}%`, bottom: `${state.y}%` }}
      onPointerDown={onPointerDown}
    >
      {line && (
        <div key={line} className="fg-bubble">
          {line}
        </div>
      )}
      {!line && thought && <div className="fg-thought">{thought}</div>}
      <div className={`fg-figure${state.face === "left" ? " flip" : ""}`}>
        <Critter species={SPECIES[id]} face={face} teacher={id === "teacher"} />
        {state.holds && <span className="fg-held">{state.holds}</span>}
      </div>
    </div>
  );
}

/** A small picture of a choice: the illustration if there is one, else the animals drawn in their poses with big signs. */
export function PictureScene({ picture, place, image }: { picture: Picture; place: Place; image?: string }) {
  if (image) return <img className="fg-scene fg-scene-image" src={image} alt="" decoding="async" draggable={false} />;
  const actors = applyCast({}, picture.cast);
  return (
    <span className={`fg-scene fg-scene-${place === "room" ? "room" : "outdoors"}`} aria-hidden>
      {(Object.entries(actors) as [ActorId, ActorState][]).map(([id, state]) => (
        <Actor key={id} id={id} state={state} face={MOODS[state.mood]} />
      ))}
      {picture.blanket && <span className="fg-scene-blanket" />}
      {picture.signs?.map((sign) => (
        <span
          key={sign.emoji + sign.x}
          className="fg-sign"
          style={{ left: `${sign.x}%`, bottom: `${sign.y}%`, fontSize: `${sign.size ?? 30}cqh` }}
        >
          {sign.emoji}
        </span>
      ))}
    </span>
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

/**
 * "choose": the child can tap it. "playing": chosen, the bear does it now.
 * "done": done, with a tick. "wrong": the not-so-good idea, crossed out. "rest": waits.
 */
export type CardState = "choose" | "playing" | "done" | "wrong" | "rest";

/** A big picture button: what the bear can do, to be understood without reading. */
export function ChoiceCard({
  picture,
  place,
  label,
  image,
  state,
  small = false,
  onChoose,
}: {
  picture: Picture;
  place: Place;
  /** An illustration to show instead of the drawn picture. */
  image?: string;
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
      <PictureScene picture={picture} place={place} image={image} />
      {(state === "playing" || state === "done") && <Mark good className="fg-card-mark" />}
      {state === "wrong" && <Mark good={false} className="fg-card-mark" />}
      <span className="fg-card-label">{label}</span>
    </button>
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
