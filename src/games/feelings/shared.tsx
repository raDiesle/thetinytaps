import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { appLanguage, pick, useAppLanguage, type Localized } from "@/lib/language";
import { loadRecordings } from "@/lib/sfx";
import { recordedVoice } from "@/lib/voice";
import { framesFor } from "./images";
import { RECORDED_SOUNDS, SOUNDS, type OopsSound, type SoundName } from "./story";
import type { FeelingsSettings } from "./settings";
import voiceFiles from "./stimme/**/*.mp3?glob";

/** How long each frame of the big picture stays before the next one fades in: slow, so nothing blinks. */
const FRAME_MS = 1500;

/** Said with the laugh when a good idea is chosen, one at random. */
export const PRAISE: Localized<string[]> = {
  de: ["Juhu!", "Ja!", "Super!"],
  ru: ["Ура!", "Да!", "Молодец!"],
  en: ["Yay!", "Yes!", "Great!"],
  zh: ["耶！", "对！", "真棒！"],
  hi: ["वाह!", "हाँ!", "शाबाश!"],
  es: ["¡Bien!", "¡Sí!", "¡Genial!"],
  ar: ["رائع!", "نعم!", "أحسنت!"],
};

/** How long the green frame and the laugh stay before the bear does the good thing. */
export const CHEER_MS = 1100;

/** The red frame stays at least this long, even when nothing is said: long enough to see what went wrong. */
export const OOPS_MS = 2600;

/**
 * A good idea was chosen: a laugh and „Juhu!“. Nothing floats up or hops: the picture of the good idea, with the
 * bear relieved and happy, is the answer (user feedback, November 2026).
 */
export function cheer(say: (text: string) => void, sound: (name: SoundName) => void) {
  const praise = pick(PRAISE, appLanguage());
  sound("laugh");
  say(praise[Math.floor(Math.random() * praise.length)]);
}

/** A not-so-good idea was chosen: what it leads to, heard – „Aua!“, a crash, or crying; its picture shows the rest. */
export function oops(heard: OopsSound | undefined, sound: (name: SoundName) => void) {
  sound(heard ?? "cry");
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

// What the game says, from its ElevenLabs recordings (`bun run voice make --only gefuehle`, src/content/recordedLines.ts):
// one file per line in stimme/ (German; the other languages only once the user asks for them). A line not recorded yet
// stays silent.
const voice = recordedVoice(voiceFiles);

/**
 * Speech and sounds: each line from its recording in the app language, a line not translated yet (still German) from
 * its German one. `voiced` tells whether a line has a recording, so a story waits for it to be said.
 */
export function useVoice(settings: FeelingsSettings) {
  const language = useAppLanguage();
  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDED_SOUNDS);
  }, [settings.sounds]);

  const say = useCallback((text: string, queue = false) => voice.say(text, language.id, { queue }), [language.id]);
  const voiced = useCallback((text: string) => voice.has(text, language.id), [language.id]);
  /** Starts loading the recordings of a story's lines, so each is said right when its picture comes. */
  const preload = useCallback(
    (texts: (string | undefined)[]) =>
      voice.load(
        texts.filter((t): t is string => !!t),
        language.id,
      ),
    [language.id],
  );

  const sound = useCallback(
    (name: SoundName | undefined) => {
      if (name && settings.sounds) SOUNDS[name]();
    },
    [settings.sounds],
  );

  return { say, sound, voiced, preload };
}

/**
 * How the big picture looks. "story": what happens, as a framed photo. "quiet": the same while
 * the child chooses, paler, so the cards stand out and it doesn't look like one of them.
 * "good" and "bad": the answer to a choice, a still green or red frame with a tick or a cross.
 */
export type PictureLook = "story" | "quiet" | "good" | "bad";

/** Which of `count` frames shows now: they take turns, like a tiny GIF. */
function useFrame(count: number): number {
  const [frame, setFrame] = useState(0);
  const loops = count > 1;

  useEffect(() => {
    if (!loops || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setFrame((f) => f + 1), FRAME_MS);
    return () => clearInterval(timer);
  }, [loops]);

  return loops ? frame % count : 0;
}

/**
 * The big picture in the middle: what happens right now. Its frames fade into
 * each other in a loop, like a tiny GIF, so the animals seem to move a little.
 * A short caption for grown-ups says what it shows.
 * Give it a new `key` with every new picture, so it starts at the first frame.
 */
export function StoryPicture({
  name,
  caption,
  look = "story",
}: {
  name: string;
  /** What the picture shows, in a few words: for grown-ups, children don't read it. */
  caption: string;
  look?: PictureLook;
}) {
  const frames = framesFor(name);
  const shown = useFrame(frames.length);

  return (
    <div className={`fg-frame fg-look-${look}`}>
      <div className="fg-picture">
        {frames.map((src, i) => (
          <img key={src} className={i === shown ? "on" : undefined} src={src} alt="" decoding="async" draggable={false} />
        ))}
        {frames.length === 0 && <Placeholder name={name} />}
      </div>
      {/* On the corner, not over the picture, so what happened stays to be seen. */}
      {look === "good" && <Mark good className="fg-picture-mark" />}
      {look === "bad" && <Mark good={false} className="fg-picture-mark" />}
      <p className="fg-caption fg-picture-caption">{caption}</p>
    </div>
  );
}

/**
 * "choose": the child can tap it; one tap chooses it (user feedback, November 2026: no second tap to confirm).
 * "playing": chosen, the bear does it now. "wrong": the not-so-good idea, crossed out. "rest": waits.
 */
export type CardState = "choose" | "playing" | "wrong" | "rest";

/** A big picture button: what the bear can do, to be understood without reading. A short caption for grown-ups sits under it. */
export function ChoiceCard({
  image,
  caption,
  state,
  onChoose,
}: {
  /** Name of the picture, see images.ts. */
  image: string;
  /** What the picture shows, in a few words: shown small under the card for grown-ups, said by screen readers. */
  caption: string;
  state: CardState;
  onChoose?: () => void;
}) {
  const active = state === "choose";
  // Cards stand still: only the big picture moves a little, so not everything on the screen moves at once.
  const src = framesFor(image)[0];
  return (
    <div className="fg-choice">
      <button
        type="button"
        className={`fg-card fg-card-${state}`}
        // No "goal" here: picking the good or the not-so-good idea is the child's own choice.
        data-tap
        disabled={!active}
        aria-label={caption}
        onPointerDown={(e: PointerEvent) => {
          e.stopPropagation();
          if (active) onChoose?.();
        }}
      >
        {src ? <img className="fg-card-image" src={src} alt="" decoding="async" draggable={false} /> : <Placeholder name={image} />}
        {state === "playing" && <Mark good className="fg-card-mark" />}
        {state === "wrong" && <Mark good={false} className="fg-card-mark" />}
      </button>
      <span className="fg-caption" aria-hidden>
        {caption}
      </span>
    </div>
  );
}

/**
 * Stands where a picture is planned but not made yet: its file name, so the grown-up can look up its prompt in
 * bilder/README.md („Geplant“) and make it (`/bild-erzeugen`). The caption under it says what it will show.
 */
function Placeholder({ name }: { name: string }) {
  return (
    <span className="fg-placeholder">
      <span className="fg-placeholder-icon" aria-hidden>
        🖼️
      </span>
      <span className="fg-placeholder-name">{name}</span>
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
