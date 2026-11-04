import { type PointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { appLanguage, pick, useAppLanguage, type Localized } from "@/lib/language";
import { loadRecordings } from "@/lib/sfx";
import { hush, recordedVoice } from "@/lib/voice";
import { framesFor } from "./images";
import { RECORDED_SOUNDS, SOUNDS, type OopsSound, type SoundName } from "./story";
import type { FeelingsSettings } from "./settings";
import voiceFiles from "./stimme/**/*.mp3?glob";

/** How long each frame of a moving picture stays before the next one fades in: slow, so nothing blinks. */
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
 * its German one. `voiced` tells whether a line has a recording, so a story waits for it to be said – also while the
 * voice is switched off (`FeelingsSettings.voice`), so a grown-up telling the story has the same time for it.
 */
export function useVoice(settings: FeelingsSettings) {
  const language = useAppLanguage();
  useEffect(() => {
    if (settings.sounds) loadRecordings(RECORDED_SOUNDS);
  }, [settings.sounds]);

  // Read when a line is due, not when it was planned: switched off mid-story, the lines already waiting stay silent too.
  const speaking = useRef(settings.voice);
  speaking.current = settings.voice;
  useEffect(() => {
    if (!settings.voice) hush();
  }, [settings.voice]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (speaking.current) voice.say(text, language.id, { queue });
    },
    [language.id],
  );
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

/** Which of `count` frames shows now: they take turns, like a tiny GIF; with `count` 1 the first stays. */
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
 * The frames of a picture on top of each other; while `moving` they fade into each other in turn, otherwise the first
 * stays. Only one thing moves at a time (user feedback, November 2026): the big picture while the scene is shown, the
 * two cards while the child chooses.
 */
function Frames({ name, moving, className }: { name: string; moving: boolean; className?: string }) {
  const frames = framesFor(name);
  const shown = useFrame(moving ? frames.length : 1);
  if (frames.length === 0) return <Placeholder name={name} />;
  return frames.map((src, i) => (
    <img key={src} className={`${className ?? ""}${i === shown ? " on" : ""}`} src={src} alt="" decoding="async" draggable={false} />
  ));
}

/**
 * The big picture in the middle: what happens right now. Unless `still`, its frames fade into each other in a loop,
 * like a tiny GIF, so the animals seem to move a little. A short caption for grown-ups says what it shows.
 * With `onNext` the whole picture is a button with ▶ in its bottom right corner: one tap goes on (user feedback,
 * November 2026: no waiting until a scene has been told).
 * Give it a new `key` with every new picture, so it starts at the first frame.
 */
export function StoryPicture({
  name,
  art,
  caption,
  look = "story",
  still = false,
  onNext,
  corner,
}: {
  name: string;
  /** A drawing shown instead of the picture `name` (the big face of „Wie geht's dir?“). */
  art?: ReactNode;
  /** What the picture shows, in a few words: for grown-ups, children don't read it. */
  caption: string;
  look?: PictureLook;
  /** Shows only the first frame: while the child chooses, the cards move instead. */
  still?: boolean;
  /** Makes the picture the way on, marked by ▶. */
  onNext?: () => void;
  /** Lies on the picture's bottom left corner, for grown-ups (`ReadAlong`, the text to read out). */
  corner?: ReactNode;
}) {
  return (
    <div className={`fg-frame fg-look-${look}`}>
      <div className="fg-picture">{art ?? <Frames name={name} moving={!still} />}</div>
      {onNext && (
        <button
          type="button"
          className="fg-next"
          data-tap="goal"
          aria-label={caption}
          onPointerDown={(e: PointerEvent) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <svg className="fg-next-sign" viewBox="0 0 100 100" aria-hidden>
            <circle cx="50" cy="50" r="44" />
            <path d="M40 30 L72 50 L40 70 Z" />
          </svg>
        </button>
      )}
      {/* On the corner, not over the picture, so what happened stays to be seen. */}
      {look === "good" && <Mark good className="fg-picture-mark" />}
      {look === "bad" && <Mark good={false} className="fg-picture-mark" />}
      <p className="fg-caption fg-picture-caption">{caption}</p>
      {corner}
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
  art,
  caption,
  state,
  onChoose,
}: {
  /** Name of the picture, see images.ts. */
  image: string;
  /** A drawing shown instead of the picture (the weather signs of „Wie doll ist es?“). */
  art?: ReactNode;
  /** What the picture shows, in a few words: shown small under the card for grown-ups, said by screen readers. */
  caption: string;
  state: CardState;
  onChoose?: () => void;
}) {
  const active = state === "choose";
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
        {/* While the child can choose, the card's frames take turns; the big picture stands still meanwhile. */}
        {art ?? <Frames name={image} moving={active} className="fg-card-image" />}
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
