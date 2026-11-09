import { type PointerEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { appLanguage, pick, useAppLanguage, type Localized } from "@/lib/language";
import { loadRecordings } from "@/lib/sfx";
import { distanceToRect, TAP_SLOP_PX } from "@/lib/tapTargets";
import { hush, recordedVoice } from "@/lib/voice";
import { useVoiceReady } from "@/lib/voiceReady";
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
// one file per line in stimme/ (German; every other app language in stimme/<language>/, November 2026). A line not recorded yet
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
  /** Starts loading the recordings of a story's lines, so each is said right when its picture comes; nothing while the voice is off. */
  const preload = useCallback(
    (texts: (string | undefined)[]) => {
      if (speaking.current)
        voice.load(
          texts.filter((t): t is string => !!t),
          language.id,
        );
    },
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
 * Whether a scene or page may start telling: true once the recordings of `lines` (what it opens with) are loaded, or
 * after SOUND_WAIT_MS, with the paw track meanwhile (`useVoiceReady`). Then `next` loads quietly: the rest of the scene
 * and the opening of the one after it, so a whole day never loads at once. Once true it stays true, so switching the
 * voice back on never stops a scene that began. With the voice off nothing is loaded and it is true at once – the
 * story still waits for each line's length (`voiced`).
 */
export function useLinesReady(settings: FeelingsSettings, lines: string[], next: string[] = []) {
  const language = useAppLanguage();
  const ready = useVoiceReady(voice, lines.filter(Boolean), language.id, { next: next.filter(Boolean), enabled: settings.voice });
  const [begun, setBegun] = useState(ready);
  if (ready && !begun) setBegun(true);
  return begun || ready;
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
export function Frames({ name, moving, className }: { name: string; moving: boolean; className?: string }) {
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
 * Where it waits for a tap to go on, `GoOn` lies beside it: ▶ in the screen's corner, the whole screen tapped.
 * Give it a new `key` with every new picture, so it starts at the first frame.
 */
export function StoryPicture({
  name,
  art,
  caption,
  look = "story",
  still = false,
  onTap,
}: {
  name: string;
  /** A drawing shown instead of the picture `name` (the big face of „Wie geht's dir?“). */
  art?: ReactNode;
  /** What the picture shows, in a few words: for grown-ups, children don't read it. */
  caption: string;
  look?: PictureLook;
  /** Shows only the first frame: while the child chooses, the cards move instead. */
  still?: boolean;
  /** While the cards lie over it: a tap brings the picture to the front (`RoundPlay`). */
  onTap?: () => void;
}) {
  return (
    <div
      className={`fg-frame fg-look-${look}${onTap ? " fg-frame-tap" : ""}`}
      data-tap={onTap ? "" : undefined}
      onPointerDown={
        onTap &&
        ((e: PointerEvent) => {
          e.stopPropagation();
          onTap();
        })
      }
    >
      <div className="fg-picture">{art ?? <Frames name={name} moving={!still} />}</div>
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
  letter,
  marker,
}: {
  /** Name of the picture, see images.ts. */
  image: string;
  /** What the picture shows, in a few words: shown small under the card for grown-ups, said by screen readers. */
  caption: string;
  state: CardState;
  onChoose?: () => void;
  /** The letter on the card's corner („A“, „B“): the two choices are told apart by it, never by which is right. */
  letter?: string;
  /**
   * A note for grown-ups on a page marker over the card's top edge („Heute früh“), kept out of the caption so the
   * caption stays the card's few words and never covers the picture.
   */
  marker?: string;
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
        aria-label={marker ? `${marker}: ${caption}` : caption}
        onPointerDown={(e: PointerEvent) => {
          e.stopPropagation();
          if (active) onChoose?.();
        }}
      >
        {/* While the child can choose, the card's frames take turns; the big picture stands still meanwhile. */}
        <Frames name={image} moving={active} className="fg-card-image" />
        {state === "playing" && <Mark good className="fg-card-mark" />}
        {state === "wrong" && <Mark good={false} className="fg-card-mark" />}
      </button>
      {letter && (
        <span className="fg-card-letter" aria-hidden>
          {letter}
        </span>
      )}
      {marker && (
        <span className="fg-card-marker" aria-hidden>
          {marker}
        </span>
      )}
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

/** What else a grown-up or child may tap on the screen: a tap this close to one of them is not a tap to go on. */
const OTHER_TAPS = ":is(button, a, [data-tap], [data-tap-keep]):not(.fg-next)";

/**
 * The way on wherever „Gefühle“ waits for a tap (a scene told, a chosen idea's last picture, a page of a day's story,
 * the face to copy): ▶ always at the same place, the screen's bottom right corner, and the whole screen tapped to go
 * on – except right next to anything else that can be tapped (the dots, the grown-ups' notes, ✕), whose taps stay
 * theirs (user feedback, November 2026: ▶ moved from scene to page and lay under the grown-ups' notes). Put it as a
 * direct child of the screen's `.story-play` or `.fg-day`; what lies above it lets its taps through.
 */
export function GoOn({ onNext, label }: { onNext: () => void; label: string }) {
  return (
    <>
      <div
        className="fg-go-on"
        aria-hidden
        onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
          const near = [...document.querySelectorAll(OTHER_TAPS)].some((el) => {
            const box = el.getBoundingClientRect();
            return box.width > 0 && distanceToRect(e.clientX, e.clientY, box) <= TAP_SLOP_PX;
          });
          if (!near) onNext();
        }}
      />
      <button
        type="button"
        className="fg-next"
        data-tap="goal"
        aria-label={label}
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
    </>
  );
}

/**
 * The way back to the scene before (`RoundPlay`, `onBack`): bottom left, as ▶ is bottom right. Only a tap on it goes
 * back, never on; the screen's other taps stay as they are (user feedback, November 2026: short scenes need a way back).
 */
export function StepBack({ onBack, label }: { onBack: () => void; label: string }) {
  return (
    <button
      type="button"
      className="fg-back"
      data-tap=""
      aria-label={label}
      onPointerDown={(e: PointerEvent) => {
        e.stopPropagation();
        onBack();
      }}
    >
      <svg className="fg-back-sign" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="44" />
        <path d="M60 30 L28 50 L60 70 Z" />
      </svg>
    </button>
  );
}

/**
 * One dot per scene at the top: green with a tick when done, yellow for the one that comes now. With `onPick` the
 * dots up to `upTo` are tapped to play that scene again – one done before, or the one now from its start (user wish,
 * November 2026: grown-ups want to go back or repeat); the ones still to come are not.
 */
export function StepDots({
  total,
  done,
  current,
  upTo = done,
  onPick,
}: {
  total: number;
  done: number;
  current: boolean;
  /** The last dot that can be tapped, counted from 0. */
  upTo?: number;
  onPick?: (index: number) => void;
}) {
  return (
    <span className="fg-dots">
      {Array.from({ length: total }, (_, i) => {
        const className = `fg-dot${i < done ? " done" : ""}${i === done && current ? " now" : ""}`;
        const mark = i < done ? "✓" : "";
        if (!onPick || i > upTo)
          return (
            <span key={i} className={className} aria-hidden>
              {mark}
            </span>
          );
        return (
          <button
            key={i}
            type="button"
            className={`${className} fg-dot-pick`}
            // The nearest dot wins, done or not: a dot played is no answer already given.
            data-tap=""
            aria-label={String(i + 1)}
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              onPick(i);
            }}
          >
            {mark}
          </button>
        );
      })}
    </span>
  );
}
