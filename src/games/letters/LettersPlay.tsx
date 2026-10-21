import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { inTheme } from "@/content/themes";
import type { Countable, LanguagePack, LetterEntry, WordEntry } from "@/content/types";
import { playBoing, playChime, playCountNote, playHonk, playRandomNote, playWhistle, setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { LetterCard, NumberCard, letterParts } from "./Cards";
import type { LettersSettings } from "./settings";

/** Presses closer together than this only spawn shapes, so mashing doesn't strobe. */
const MIN_CHANGE_MS = 600;
/** Minimum time between two "next" clicks in step-by-step mode. */
const MIN_ADVANCE_MS = 350;
/** Time between counted items when counting automatically. */
const COUNT_STEP_MS = 800;
/** Extra time after the last counted item for the total to be spoken. */
const COUNT_SUMMARY_MS = 1500;
/** How far one arrow key pushes the card, and how far it may go, in % of the stage. */
const PUSH_STEP = 8;
const MAX_PUSH = 32;
/** How many earlier letters and numbers Backspace can bring back. */
const MAX_HISTORY = 20;
const CONFETTI_PIECES = 10;

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

type Shown =
  | { kind: "letter"; id: number; letter: LetterEntry; word: WordEntry }
  | { kind: "number"; id: number; n: number; thing: Countable };

type Target = { kind: "letter"; letter: LetterEntry } | { kind: "number"; n: number };

function resolveKey(key: string, pack: LanguagePack): Target | null {
  if (/^[0-9]$/.test(key)) return { kind: "number", n: Number(key) };
  if (key.length !== 1) return null;
  const upper = key.toLocaleUpperCase("de-DE");
  const letter = pack.letters.find((l) => l.upper === upper);
  return letter ? { kind: "letter", letter } : null;
}

function isSame(target: Target | null, shown: Shown) {
  if (target?.kind === "letter" && shown.kind === "letter") return target.letter === shown.letter;
  if (target?.kind === "number" && shown.kind === "number") return target.n === shown.n;
  return false;
}

// Stages: a letter reveals its parts one by one (see letterParts). A number
// reveals one item per stage (stage k shows k items); the stage after the
// last item shows the digit. Zero starts with the empty nest at stage 0.
const firstStage = (s: Shown) => (s.kind === "letter" ? 0 : Math.min(1, s.n));
const lastStage = (s: Shown, showWord: boolean) =>
  s.kind === "letter" ? letterParts(showWord).length - 1 : s.n + 1;

export function LettersPlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [shown, setShown] = useState<Shown | null>(null);
  const [stage, setStage] = useState(0);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const [push, setPush] = useState<[number, number]>([0, 0]);
  const { bursts, spawn } = useBursts();

  const lastChange = useRef(0);
  const countingUntil = useRef(0);
  const nextId = useRef(0);
  const wordIndex = useRef(new Map<string, number>());
  const lastThing = useRef<Countable | null>(null);
  const countTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  /** What is on screen right now (for the history), and what was before it. */
  const current = useRef<Shown | null>(null);
  const history = useRef<Shown[]>([]);
  const hornCount = useRef(0);
  const cardBox = useRef<HTMLDivElement>(null);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, pack.speechLang, { queue, rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm, pack.speechLang],
  );

  /** The full sentence for a fully revealed letter or number. */
  const sentenceFor = useCallback(
    (s: Shown) => {
      if (s.kind === "number") return s.n === 0 ? `${pack.numberWords[0]}!` : pack.countSentence(s.n, s.thing);
      if (settings.announce === "word") return `${s.word.word}!`;
      if (settings.announce === "letter") return `${s.letter.spoken}!`;
      return pack.letterSentence(s.letter, s.word);
    },
    [pack, settings.announce],
  );

  /** Speak and play the sound for reaching `stage`. */
  const announce = useCallback(
    (s: Shown, stage: number, queue = false) => {
      const sound = (play: () => void) => settings.sounds && play();
      if (stage === lastStage(s, settings.showWord)) {
        sound(playChime);
        say(sentenceFor(s), queue);
      } else if (s.kind === "letter") {
        const part = letterParts(settings.showWord)[stage];
        sound(() => (stage === 0 ? playChime() : playCountNote(stage)));
        say(part === "letter" ? `${s.letter.spoken}!` : `${s.word.word}!`, queue);
      } else if (stage === 0) {
        say(pack.zero.sentence, queue);
      } else {
        sound(() => playCountNote(stage - 1));
        say(pack.numberWords[stage], queue);
      }
    },
    [pack, say, sentenceFor, settings.sounds, settings.showWord],
  );

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  // Cycle through the letter's words so repeated presses stay interesting.
  const pickWord = useCallback(
    (letter: LetterEntry) => {
      const words = inTheme(letter.words, settings.theme);
      const index = wordIndex.current.get(letter.upper) ?? 0;
      wordIndex.current.set(letter.upper, index + 1);
      return words[index % words.length];
    },
    [settings.theme],
  );

  const pickThing = useCallback(() => {
    const others = inTheme(pack.countables, settings.theme).filter((c) => c !== lastThing.current);
    lastThing.current = others[Math.floor(Math.random() * others.length)];
    return lastThing.current;
  }, [pack, settings.theme]);

  /** Put `next` on screen; the one before goes on the history for Backspace. */
  const replace = useCallback((next: Shown) => {
    countTimers.current.forEach(clearTimeout);
    countTimers.current = [];
    countingUntil.current = 0;
    if (current.current) history.current = [...history.current.slice(-(MAX_HISTORY - 1)), current.current];
    current.current = next;
    setBackground(BACKGROUNDS[next.id % BACKGROUNDS.length]);
    setPush([0, 0]);
    setShown(next);
  }, []);

  /** Show `next` from stage `from`, either waiting for clicks or running through the stages on its own. */
  const present = useCallback(
    (next: Shown, from: number) => {
      replace(next);

      if (settings.stepByStep) {
        setStage(from);
        announce(next, from);
        return;
      }
      const last = lastStage(next, settings.showWord);
      if (next.kind === "letter") {
        setStage(last);
        announce(next, last);
        return;
      }
      // Pop the items in one by one while counting aloud, then show the digit.
      setStage(from);
      announce(next, from);
      for (let k = from + 1; k <= last; k++) {
        countTimers.current.push(
          setTimeout(() => {
            setStage(k);
            announce(next, k, true);
          }, (k - from) * COUNT_STEP_MS),
        );
      }
      countingUntil.current = performance.now() + (last - from) * COUNT_STEP_MS + COUNT_SUMMARY_MS;
    },
    [announce, replace, settings.stepByStep, settings.showWord],
  );

  const show = useCallback(
    (target: Target) => {
      const id = nextId.current++;
      const next: Shown =
        target.kind === "letter"
          ? { kind: "letter", id, letter: target.letter, word: pickWord(target.letter) }
          : { kind: "number", id, n: target.n, thing: pickThing() };
      present(next, firstStage(next));
    },
    [pickWord, pickThing, present],
  );

  /** Step-by-step: reveal the next part; once everything is shown, start a new word / new things. */
  const advance = useCallback(() => {
    if (!shown) return;
    if (stage < lastStage(shown, settings.showWord)) {
      setStage(stage + 1);
      announce(shown, stage + 1);
      return;
    }
    const id = nextId.current++;
    if (shown.kind === "letter") {
      present({ ...shown, id, word: pickWord(shown.letter) }, 1);
    } else {
      const next: Shown = { ...shown, id, thing: pickThing() };
      present(next, firstStage(next));
    }
  }, [shown, stage, settings.showWord, announce, present, pickWord, pickThing]);

  /** Advance unless the last advance was too recent. */
  const tryAdvance = useCallback(() => {
    const now = performance.now();
    if (now - lastChange.current < MIN_ADVANCE_MS) return false;
    lastChange.current = now;
    advance();
    return true;
  }, [advance]);

  /** Tapping the picture: the next word with the same letter, B – Bär → Ball → Bus. */
  const nextWord = useCallback(
    (e: PointerEvent) => {
      e.stopPropagation();
      if (shown?.kind !== "letter") return;
      const now = performance.now();
      if (now - lastChange.current >= MIN_ADVANCE_MS) {
        lastChange.current = now;
        const next: Shown = { ...shown, id: nextId.current++, word: pickWord(shown.letter) };
        present(next, lastStage(next, settings.showWord));
      }
      funBurst(e.clientX, e.clientY);
    },
    [shown, present, pickWord, funBurst, settings.showWord],
  );

  /** Make the card move once, unless calm mode is on. */
  const animateCard = useCallback(
    (keyframes: Keyframe[], duration: number) => {
      if (!settings.calm) cardBox.current?.animate(keyframes, { duration, easing: "ease-out" });
    },
    [settings.calm],
  );

  /**
   * Keys that are not letters or numbers each do their own thing: Space jumps with confetti,
   * Enter honks or whistles, arrows push the card, Backspace brings back the one before.
   * Returns false for keys without a meaning of their own.
   */
  const specialKey = useCallback(
    (key: string) => {
      const sound = (play: () => void) => settings.sounds && play();
      if (key === " ") {
        sound(playBoing);
        animateCard([{ transform: "none" }, { transform: "translateY(-18%) scale(1.06)" }, { transform: "none" }], 600);
        for (let i = 0; i < CONFETTI_PIECES; i++) spawn(undefined, Math.random() * window.innerHeight * 0.6);
        return true;
      }
      if (key === "Enter") {
        sound(hornCount.current++ % 2 ? playWhistle : playHonk);
        animateCard([{ transform: "none" }, { transform: "scale(1.12, 0.9)" }, { transform: "scale(0.95, 1.08)" }, { transform: "none" }], 500);
        return true;
      }
      if (key in ARROWS) {
        const [dx, dy] = ARROWS[key];
        const clamp = (v: number) => Math.max(-MAX_PUSH, Math.min(MAX_PUSH, v));
        setPush(([x, y]) => [clamp(x + dx * PUSH_STEP), clamp(y + dy * PUSH_STEP)]);
        sound(() => playCountNote(Math.floor(Math.random() * 8)));
        return true;
      }
      if (key === "Backspace") {
        const previous = history.current.pop();
        if (!previous) return false;
        // Shown again in full, without putting the current one on the history.
        current.current = null;
        present(previous, lastStage(previous, settings.showWord));
        return true;
      }
      return false;
    },
    [present, spawn, animateCard, settings.sounds, settings.showWord],
  );

  /** A key was pressed, on the keyboard or on the screen. */
  const pressKey = useCallback(
    (key: string) => {
      const target = resolveKey(key, pack);
      // Step by step, Space and Enter reveal the next part until everything is shown; then they are special keys again.
      const revealing = shown !== null && stage < lastStage(shown, settings.showWord);
      const isNextKey = ((key === " " || key === "Enter") && revealing) || (shown !== null && isSame(target, shown));
      if (settings.stepByStep && shown && isNextKey) {
        if (!tryAdvance()) funBurst();
        return;
      }
      if (!target && specialKey(key)) return;
      const now = performance.now();
      const counting = settings.finishCounting && now < countingUntil.current;
      if (!target || counting || now - lastChange.current < MIN_CHANGE_MS) {
        funBurst();
        return;
      }
      lastChange.current = now;
      show(target);
    },
    [pack, shown, stage, show, tryAdvance, funBurst, specialKey, settings.stepByStep, settings.showWord, settings.finishCounting],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey]);

  // Tablets: digits, then the alphabet.
  const touchKeys = useTouchKeys(settings.touchKeys);
  const rows = useMemo(() => keyRows([..."1234567890", ...pack.letters.map((l) => l.upper)]), [pack]);

  useEffect(() => () => countTimers.current.forEach(clearTimeout), []);

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  // Step-by-step: any click reveals the next part. Otherwise tapping the card
  // repeats what it says, and tapping elsewhere makes shapes.
  const onPlayAreaPointer = (e: PointerEvent) => {
    if (settings.stepByStep && shown && tryAdvance()) return;
    funBurst(e.clientX, e.clientY);
  };
  const repeat = (e: PointerEvent) => {
    e.stopPropagation();
    const counting = settings.finishCounting && performance.now() < countingUntil.current;
    if (shown && !counting) say(sentenceFor(shown));
    funBurst(e.clientX, e.clientY);
  };
  const onCardPointer = settings.stepByStep ? undefined : repeat;

  return (
    <div
      className={`letters-play${settings.calm ? " calm" : ""}`}
      style={{ background }}
      onPointerDown={onPlayAreaPointer}
    >
      <div className="stage">
        <div ref={cardBox} className="card-box" style={{ translate: `${push[0]}cqw ${push[1]}cqh` }}>
          {shown === null && (
            <p className="letters-welcome">{touchKeys ? "Tipp auf einen Buchstaben! 👇" : "Drück eine Taste! ⌨️"}</p>
          )}
          {shown?.kind === "letter" && (
            <LetterCard
              key={shown.id}
              letter={shown.letter}
              word={shown.word}
              stage={stage}
              settings={settings}
              onPointerDown={onCardPointer}
              onPicturePointerDown={nextWord}
            />
          )}
          {shown?.kind === "number" && (
            <NumberCard
              key={shown.id}
              n={shown.n}
              thing={shown.thing}
              zeroEmoji={pack.zero.emoji}
              stage={stage}
              hint={settings.stepByStep}
              onPointerDown={onCardPointer}
            />
          )}
        </div>
      </div>
      {touchKeys && (
        <TouchKeyboard
          rows={rows}
          onKey={pressKey}
          label={(key) => (settings.letterCase === "lower" ? key.toLocaleLowerCase("de-DE") : key)}
        />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
