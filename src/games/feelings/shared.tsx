import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useLeaveGame } from "@/components/GameShell";
import { appLanguage, pick, useAppLanguage, useT, type Localized } from "@/lib/language";
import { loadRecordings } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { framesFor, imageFor } from "./images";
import { RECORDED_SOUNDS, SOUNDS, type OopsSound, type SoundName } from "./story";
import type { FeelingsSettings } from "./settings";

/** How long each frame of a picture stays before the next one fades in. */
const FRAME_MS = 900;

/** Said with the laugh when a good idea is chosen (only when speech is on), one at random. */
const PRAISE: Localized<string[]> = { de: ["Juhu!", "Ja!", "Super!"], ru: ["Ура!", "Да!", "Молодец!"] };

/** How long the green frame and the laugh stay before the bear does the good thing. */
export const CHEER_MS = 1100;

/** The red frame stays at least this long, even without speech: long enough to see what went wrong. */
export const OOPS_MS = 2600;

/** A good idea was chosen: a laugh, stars, and „Juhu!“ when speech is on. */
export function cheer(say: (text: string) => void, sound: (name: SoundName) => void, float: (emoji: string, x: number, y: number, count?: number) => void) {
  const praise = pick(PRAISE, appLanguage());
  sound("laugh");
  say(praise[Math.floor(Math.random() * praise.length)]);
  float("⭐", 30, 25, 4);
  float("✨", 70, 35, 4);
}

/** What floats up after a not-so-good idea, by what is heard. */
const OOPS_FLOAT: Record<OopsSound | "cry", string> = { aua: "💢", crash: "💥", cry: "💧" };

/** A not-so-good idea was chosen: what it leads to, heard and seen – „Aua!“, a crash, or crying. */
export function oops(heard: OopsSound | undefined, sound: (name: SoundName) => void, float: (emoji: string, x: number, y: number, count?: number) => void) {
  sound(heard ?? "cry");
  float(OOPS_FLOAT[heard ?? "cry"], 50, 45, 3);
}

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

/** Speech and sounds as the parent set them up; speech in the app language, as every text of the stories is. */
export function useVoice(settings: FeelingsSettings) {
  const { speechLang } = useAppLanguage();
  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDED_SOUNDS);
  }, [settings.sounds]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, speechLang, { queue, rate: 0.85 });
    },
    [settings.speech, speechLang],
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
 * How the big picture looks. "story": what happens, as a framed photo. "quiet": the same while
 * the child chooses, paler, so the cards stand out and it doesn't look like one of them.
 * "option": a card the child tapped, looked at big, with the yellow ring of a card. "good" and
 * "bad": the answer to a choice, a green frame that hops or a red one that shakes.
 */
export type PictureLook = "story" | "quiet" | "option" | "good" | "bad";

/** How long the picture of a tapped card takes to grow from the card to its place. */
const ZOOM_MS = 320;

/**
 * The big picture in the middle: what happens right now. Its frames fade into
 * each other in a loop, like a tiny GIF, so the animals seem to move a little.
 * Under it a short caption for grown-ups says what it shows.
 * Give it a new `key` with every new picture, so it starts at the first frame.
 */
export function StoryPicture({
  name,
  caption,
  look = "story",
  zoom = false,
  children,
  onPointerDown,
}: {
  name: string;
  /** What the picture shows, in a few words: for grown-ups, children don't read it. */
  caption: string;
  look?: PictureLook;
  /** Grows out of the card with the same picture when it appears, so the child sees which card it is. */
  zoom?: boolean;
  /** Things on top of the picture: floating hearts. */
  children?: ReactNode;
  onPointerDown?: (e: PointerEvent) => void;
}) {
  const frames = framesFor(name);
  const [frame, setFrame] = useState(0);
  const moving = frames.length > 1;
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moving || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(timer);
  }, [moving]);

  // Before the first paint: start where the card is and grow to the picture's place.
  useLayoutEffect(() => {
    const el = frameRef.current;
    const card = document.querySelector(`.fg-card[data-card="${CSS.escape(name)}"]`);
    if (!zoom || !el || !card || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = card.getBoundingClientRect();
    const to = el.getBoundingClientRect();
    const start = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
    const grow = el.animate(
      [
        { transform: start, transformOrigin: "0 0" },
        { transform: "none", transformOrigin: "0 0" },
      ],
      {
        duration: ZOOM_MS,
        easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
      },
    );
    return () => grow.cancel();
  }, []);

  const shown = frame % Math.max(frames.length, 1);

  return (
    <>
      <div ref={frameRef} className={`fg-frame fg-look-${look}`} onPointerDown={onPointerDown}>
        <div className="fg-picture">
          {frames.map((src, i) => (
            <img key={src} className={i === shown ? "on" : undefined} src={src} alt="" decoding="async" draggable={false} />
          ))}
          {children}
          {/* A card looked at big: a hand taps it again and again, so the child knows one more tap chooses it. */}
          {look === "option" && (
            <span className="fg-tap-hint" aria-hidden>
              <span className="fg-tap-ripple" />
              <span className="fg-tap-hand">👆</span>
            </span>
          )}
        </div>
        {/* On the corner, not over the picture, so what happened stays to be seen. */}
        {look === "good" && <Mark good className="fg-picture-mark" />}
        {look === "bad" && <Mark good={false} className="fg-picture-mark" />}
      </div>
      <p className="fg-caption fg-picture-caption">{caption}</p>
    </>
  );
}

/**
 * "choose": the child can tap it. "picked": tapped once, shown big above; tapped again it is chosen.
 * "playing": chosen, the bear does it now. "done": done, with a tick. "wrong": the not-so-good idea, crossed out. "rest": waits.
 */
export type CardState = "choose" | "picked" | "playing" | "done" | "wrong" | "rest";

/** A big picture button: what the bear can do, to be understood without reading. A short caption for grown-ups sits under it. */
export function ChoiceCard({
  image,
  caption,
  state,
  small = false,
  onChoose,
}: {
  /** Name of the picture, see images.ts. The big picture grows out of the card with the same name. */
  image: string;
  /** What the picture shows, in a few words: shown small under the card for grown-ups, said by screen readers. */
  caption: string;
  state: CardState;
  small?: boolean;
  onChoose?: () => void;
}) {
  const active = state === "choose" || state === "picked";
  return (
    <div className={`fg-choice${small ? " small" : ""}`}>
      <button
        type="button"
        className={`fg-card fg-card-${state}${small ? " small" : ""}`}
        data-card={image}
        // No "goal" here: picking the good or the not-so-good idea is the child's own choice.
        data-tap
        disabled={!active}
        aria-label={caption}
        onPointerDown={(e: PointerEvent) => {
          e.stopPropagation();
          if (active) onChoose?.();
        }}
      >
        <img className="fg-card-image" src={imageFor(image)} alt="" decoding="async" draggable={false} />
        {(state === "playing" || state === "done") && <Mark good className="fg-card-mark" />}
        {state === "wrong" && <Mark good={false} className="fg-card-mark" />}
      </button>
      <span className="fg-caption" aria-hidden>
        {caption}
      </span>
    </div>
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

/** At the end of a story: back to the start screen or play it again (small, white), or go on to the next one (big, yellow). Only pictures, no words. */
export function EndButtons({ onAgain, onNext }: { onAgain: () => void; onNext: () => void }) {
  const t = useT();
  const leave = useLeaveGame();
  // Pointer down, not click: it reacts right away, and the picture underneath doesn't get the tap.
  const press = (action: () => void) => (e: PointerEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="fg-end" data-tap-root>
      {/* A click, not pointer down: leaving on the way down would let the lifted finger tap the start screen. */}
      <button type="button" className="fg-round menu" aria-label={t({ de: "Menü", ru: "Меню" })} onPointerDown={(e) => e.stopPropagation()} onClick={leave}>
        <svg viewBox="0 0 24 24" aria-hidden>
          {/* Four cards, like the start screen – not a house, which would look like the home page. */}
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
        </svg>
      </button>
      <button type="button" className="fg-round again" aria-label={t({ de: "Nochmal", ru: "Ещё раз" })} onPointerDown={press(onAgain)}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M3.5 12a8.5 8.5 0 1 0 2.5-6" />
          <path d="M2.5 3.5v5h5" />
        </svg>
      </button>
      <button type="button" className="fg-round next" aria-label={t({ de: "Weiter", ru: "Дальше" })} onPointerDown={press(onNext)}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M8 4.5v15l12-7.5z" />
        </svg>
      </button>
    </div>
  );
}
