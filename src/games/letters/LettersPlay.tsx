import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyOf, toLower, toUpper } from "@/content/languages";
import { inTheme } from "@/content/themes";
import type { Countable, LanguagePack, LetterEntry, WordEntry } from "@/content/types";
import { loadRecordings, playBoing, playChime, playCountNote, playHonk, playWhistle, recorded } from "@/lib/sfx";
import { pick, useAppLanguage, useT } from "@/lib/language";
import { repeatPause } from "@/lib/spacing";
import { HalfNumberCard, LetterCard, NumberCard } from "./Cards";
import { lettersVoice, useLettersSay } from "./voice";
import type { LettersSettings } from "./settings";
import { useSoftTap } from "./softTap";
import { SurpriseLayer, useSurprises } from "./Surprises";
import { TWO_DIGIT_MAX, TWO_DIGIT_MIN, TWO_DIGIT_WORDS } from "./twoDigits";
import "./letters.css";

/** A surprise's size: this share of the play area's shorter side, within these limits in px. */
const SURPRISE_SHARE = 0.42;
const SURPRISE_MIN = 120;
const SURPRISE_MAX = 360;

/**
 * Presses closer together than this only make ripples, so mashing doesn't strobe nor chop line after line. The same key
 * again waits longer still, `REPEAT_PAUSE_MS` (`repeats`).
 */
const MIN_CHANGE_MS = 1000;

/** Enter: a real car horn and train whistle (src/lib/sounds/), synthesized until loaded. */
const honk = recorded("honk", playHonk);
const whistle = recorded("whistle", playWhistle);

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

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];
/** Frei tippen's dark page (`dark`, user request, November 2026): night colours taking turns like the light ones. */
const DARK_BACKGROUNDS = ["#1f2340", "#152a3a", "#1b2e26", "#2e1f33", "#26203f", "#33261f"];

type Shown = { kind: "letter"; id: number; letter: LetterEntry; word: WordEntry } | { kind: "number"; id: number; n: number; thing: Countable };

type Target = { kind: "letter"; letter: LetterEntry } | { kind: "number"; n: number };

function resolveKey(key: string, pack: LanguagePack): Target | null {
  if (/^[0-9]$/.test(key)) return { kind: "number", n: Number(key) };
  if (key.length !== 1) return null;
  const upper = toUpper(key, pack);
  const letter = pack.letters.find((l) => l.upper === upper);
  return letter ? { kind: "letter", letter } : null;
}

/** Zählen: a number by chance for a key that is no digit, never the one on screen; two-digit with `twoDigits`. */
function randomNumber(shown: Shown | null, twoDigits: boolean): Target {
  const [min, max] = twoDigits ? [TWO_DIGIT_MIN, TWO_DIGIT_MAX] : [1, 9];
  const others = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((n) => shown?.kind !== "number" || n !== shown.n);
  return { kind: "number", n: others[Math.floor(Math.random() * others.length)] };
}

function isSame(target: Target | null, shown: Shown) {
  if (target?.kind === "letter" && shown.kind === "letter") return target.letter === shown.letter;
  if (target?.kind === "number" && shown.kind === "number") return target.n === shown.n;
  return false;
}

// Stages: a letter shows everything at once, at stage 0. A number reveals
// one item per stage (stage k shows k items); the stage after the last item
// shows the digit. Zero starts with the empty nest at stage 0. A two-digit number shows everything at once, at its
// last stage (`whole`).
const firstStage = (s: Shown) => (s.kind === "letter" ? 0 : Math.min(1, s.n));
const lastStage = (s: Shown) => (s.kind === "letter" ? 0 : s.n + 1);
const isTwoDigit = (s: Shown) => s.kind === "number" && s.n >= TWO_DIGIT_MIN;

/**
 * Frei tippen: every key shows its letter or number. With `numbersOnly` it plays Zählen: only numbers come, a digit
 * shows itself, and any other key that has no meaning of its own a number by chance.
 */
export function LettersPlay({ pack, settings, numbersOnly = false }: { pack: LanguagePack; settings: LettersSettings; numbersOnly?: boolean }) {
  const [shown, setShown] = useState<Shown | null>(null);
  const [stage, setStage] = useState(0);
  /** Counting by tapping: indices of the tapped things, in order. */
  const [tapped, setTapped] = useState<number[]>([]);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [push, setPush] = useState<[number, number]>([0, 0]);
  /** Two-digit numbers: the first digit pressed, waiting beside an empty place for the second. */
  const [firstDigit, setFirstDigit] = useState<number | null>(null);
  const { effects, ripple } = useTapFeedback();
  const t = useT();
  const { id: language } = useAppLanguage();
  const stepByStep = settings.numbers === "step";
  /** Frei tippen only: Zählen keeps its light page. */
  const dark = settings.dark && !numbersOnly;
  const background = (dark ? DARK_BACKGROUNDS : BACKGROUNDS)[backgroundIndex];
  /** A number stops before its digit, which comes only when the same number is pressed again (`digitOnRepeat`). */
  const holdDigit = settings.digitOnRepeat && (settings.numbers === "all" || settings.numbers === "count");

  const lastChange = useRef(0);
  const countingUntil = useRef(0);
  const nextId = useRef(0);
  const wordIndex = useRef(new Map<string, number>());
  const lastThing = useRef<Countable | null>(null);
  /** The things the next number counts, picked ahead so their counting sentences are loaded before a key asks for them. */
  const nextThing = useRef<Countable | null>(null);
  const countTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  /** What is on screen right now (for the history), and what was before it. */
  const current = useRef<Shown | null>(null);
  const history = useRef<Shown[]>([]);
  const hornCount = useRef(0);
  const cardBox = useRef<HTMLDivElement>(null);
  /**
   * The same key (or the card, or its picture) again is said and sounded only after a pause: a child hammering one key
   * heard its line and a note at every press (user feedback, November 2026). Pressed during it, it only ripples.
   */
  const repeats = useMemo(() => repeatPause(), []);

  const say = useLettersSay();

  /** Counting by tapping applies to numbers with things to tap, not to the empty nest. */
  const byTap = useCallback((s: Shown | null) => settings.numbers === "tap" && s?.kind === "number" && s.n > 0 && s.n < TWO_DIGIT_MIN, [settings.numbers]);

  /** What a letter shown with `word` says, as the options ask for it. */
  const letterLine = useCallback(
    (letter: LetterEntry, word: WordEntry) => {
      if (settings.announce === "word") return `${word.word}!`;
      if (settings.announce === "letter") return `${letter.spoken}!`;
      return pack.letterSentence(letter, word);
    },
    [pack, settings.announce],
  );

  /** The full sentence for a fully revealed letter or number. */
  const sentenceFor = useCallback(
    (s: Shown) => {
      if (s.kind === "number" && isTwoDigit(s)) return pick(TWO_DIGIT_WORDS, language)(s.n);
      if (s.kind === "number") {
        // A counting sentence without its recording (a new thing to count) says the number alone.
        const sentence = s.n === 0 ? `${pack.numberWords[0]}!` : pack.countSentence(s.n, s.thing);
        return lettersVoice.has(sentence, language) ? sentence : `${pack.numberWords[s.n]}!`;
      }
      return letterLine(s.letter, s.word);
    },
    [pack, letterLine, language],
  );

  /** The same line in English, whose recording stands in where the app language has none yet (two-digit numbers). */
  const englishFor = useCallback((s: Shown) => (s.kind === "number" && isTwoDigit(s) ? TWO_DIGIT_WORDS.en(s.n) : undefined), []);

  /** Speak and play the sound for reaching `stage`. */
  const announce = useCallback(
    (s: Shown, stage: number, queue = false) => {
      if (stage === lastStage(s)) {
        playChime();
        say(sentenceFor(s), queue, englishFor(s));
      } else if (stage === 0) {
        say(pack.zero.sentence, queue);
      } else {
        playCountNote(stage - 1);
        say(`${pack.numberWords[stage]}!`, queue);
      }
    },
    [pack, say, sentenceFor, englishFor],
  );

  const softTap = useSoftTap(ripple);

  const root = useRef<HTMLDivElement>(null);
  const stageBox = useRef<HTMLDivElement>(null);
  const { surprises, spawn } = useSurprises();

  /**
   * Frei tippen: a surprise where the finger landed (`at`, client px) or, for a key, somewhere on the stage beside the
   * card. Too soon after the last one (or too many on screen) it only ripples.
   */
  const surprise = useCallback(
    (at?: { x: number; y: number }) => {
      const area = root.current?.getBoundingClientRect();
      const stage = stageBox.current?.getBoundingClientRect();
      if (!area || !stage) return softTap(at?.x, at?.y);
      const size = Math.max(SURPRISE_MIN, Math.min(SURPRISE_MAX, Math.min(area.width, area.height) * SURPRISE_SHARE));
      const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(Math.max(min, max), v));
      let x: number;
      let y: number;
      if (at) {
        x = at.x;
        y = at.y;
      } else {
        // A free place on the stage, kept clear of the card where it can be.
        const card = cardBox.current?.firstElementChild?.getBoundingClientRect();
        const random = () => ({
          x: stage.left + size * 0.5 + Math.random() * (stage.width - size),
          y: stage.top + size * 0.6 + Math.random() * (stage.height - size * 1.1),
        });
        const overCard = (p: { x: number; y: number }) =>
          card !== undefined && p.x > card.left - size * 0.4 && p.x < card.right + size * 0.4 && p.y > card.top - size * 0.4 && p.y < card.bottom + size * 0.4;
        let spot = random();
        for (let tries = 0; tries < 12 && overCard(spot); tries++) spot = random();
        x = spot.x;
        y = spot.y;
      }
      x = clamp(x - area.left, size * 0.45, area.width - size * 0.45);
      y = clamp(y - area.top, size * 0.5, stage.bottom - area.top - size * 0.4);
      if (!spawn(x, y, size)) softTap(at?.x, at?.y);
    },
    [spawn, softTap],
  );

  /** The word the letter comes with next time: its words take turns, so repeated presses stay interesting. */
  const nextWordOf = useCallback(
    (letter: LetterEntry) => {
      const words = inTheme(letter.words, settings.theme);
      return words[(wordIndex.current.get(letter.upper) ?? 0) % words.length];
    },
    [settings.theme],
  );

  const pickWord = useCallback(
    (letter: LetterEntry) => {
      const word = nextWordOf(letter);
      wordIndex.current.set(letter.upper, (wordIndex.current.get(letter.upper) ?? 0) + 1);
      return word;
    },
    [nextWordOf],
  );

  const things = useMemo(() => inTheme(pack.countables, settings.theme), [pack, settings.theme]);
  /** Things to count by chance, never the same twice in a row. */
  const drawThing = useCallback(
    (not: Countable | null) => {
      const others = things.filter((c) => c !== not);
      return others.length > 0 ? others[Math.floor(Math.random() * others.length)] : things[0];
    },
    [things],
  );
  /** The things the next number counts (drawn again when the pictures' theme changed). */
  const upcomingThing = useCallback(() => {
    if (!nextThing.current || !things.includes(nextThing.current)) nextThing.current = drawThing(lastThing.current);
    return nextThing.current;
  }, [things, drawThing]);

  const pickThing = useCallback(() => {
    lastThing.current = upcomingThing();
    nextThing.current = drawThing(lastThing.current);
    return lastThing.current;
  }, [upcomingThing, drawThing]);

  /**
   * Loads what the next press can say – every number with the things it counts next, and every letter with its next
   * word – so a key's line never comes late. Only those, never the game's whole folder (hundreds of lines a language).
   */
  const loadAhead = useCallback(() => {
    const thing = upcomingThing();
    const numbers = pack.numberWords.flatMap((word, n) => [`${word}!`, ...(n > 0 && thing ? [pack.countSentence(n, thing)] : [])]);
    const letters = numbersOnly
      ? []
      : pack.letters.flatMap((letter) => {
          const word = nextWordOf(letter);
          return word ? [letterLine(letter, word)] : [];
        });
    lettersVoice.load([...numbers, pack.zero.sentence, ...letters], language);
  }, [pack, numbersOnly, upcomingThing, nextWordOf, letterLine, language]);

  /** Two-digit numbers: the ten numbers the first digit can become, loaded while the second is awaited. */
  const loadDecade = useCallback(
    (first: number) => {
      const decade = Array.from({ length: 10 }, (_, i) => first * 10 + i).filter((n) => n >= TWO_DIGIT_MIN);
      lettersVoice.load(
        decade.map((n) => ({ text: pick(TWO_DIGIT_WORDS, language)(n), english: TWO_DIGIT_WORDS.en(n) })),
        language,
      );
    },
    [language],
  );

  useEffect(() => loadAhead(), [loadAhead]);

  /** Put `next` on screen; the one before goes on the history for Backspace. */
  const replace = useCallback((next: Shown) => {
    countTimers.current.forEach(clearTimeout);
    countTimers.current = [];
    countingUntil.current = 0;
    if (current.current) history.current = [...history.current.slice(-(MAX_HISTORY - 1)), current.current];
    current.current = next;
    setFirstDigit(null);
    setBackgroundIndex(next.id % BACKGROUNDS.length);
    setPush([0, 0]);
    setShown(next);
    setTapped([]);
  }, []);

  /** Show `next` from stage `from`, either waiting for clicks or running through the stages on its own. */
  const present = useCallback(
    (next: Shown, from: number) => {
      replace(next);
      // A word or things were used up: their successors load now.
      loadAhead();

      if (isTwoDigit(next)) {
        // A two-digit number: all its rows of ten and its digits at once – too many things to count aloud one by one.
        setStage(lastStage(next));
        announce(next, lastStage(next));
        return;
      }
      if (byTap(next)) {
        // All things are there, waiting to be tapped one by one.
        setStage(0);
        return;
      }
      if (stepByStep) {
        setStage(from);
        announce(next, from);
        return;
      }
      const full = lastStage(next);
      const last = holdDigit && next.kind === "number" ? next.n : full;
      if (next.kind === "letter" || settings.numbers === "all") {
        setStage(last);
        announce(next, last);
        return;
      }
      // Pop the items in one by one while counting aloud, then show the digit.
      setStage(from);
      announce(next, from);
      for (let k = from + 1; k <= last; k++) {
        countTimers.current.push(
          setTimeout(
            () => {
              setStage(k);
              announce(next, k, true);
            },
            (k - from) * COUNT_STEP_MS,
          ),
        );
      }
      countingUntil.current = performance.now() + (last - from) * COUNT_STEP_MS + (last === full ? COUNT_SUMMARY_MS : 0);
    },
    [announce, replace, loadAhead, byTap, stepByStep, holdDigit, settings.numbers],
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

  /** Counting by tapping: the thing hops and gets the next number; after the last one the digit appears. */
  const countItem = useCallback(
    (index: number) => {
      if (shown?.kind !== "number" || !byTap(shown) || stage > shown.n || tapped.includes(index)) return false;
      const next = [...tapped, index];
      const k = next.length === shown.n ? shown.n + 1 : next.length;
      lastChange.current = performance.now();
      setTapped(next);
      setStage(k);
      announce(shown, k);
      return true;
    },
    [shown, stage, tapped, byTap, announce],
  );

  /** Step-by-step: reveal the next part; once everything is shown, start a new word / new things. */
  const advance = useCallback(() => {
    if (!shown) return;
    if (shown.kind === "number" && byTap(shown) && stage <= shown.n) {
      // Keyboard: Space, Enter or the same digit counts the next thing.
      let index = 0;
      while (tapped.includes(index)) index++;
      countItem(index);
      return;
    }
    if (stage < lastStage(shown)) {
      setStage(stage + 1);
      announce(shown, stage + 1);
      return;
    }
    const id = nextId.current++;
    if (shown.kind === "letter") {
      present({ ...shown, id, word: pickWord(shown.letter) }, 0);
    } else {
      const next: Shown = { ...shown, id, thing: pickThing() };
      present(next, firstStage(next));
    }
  }, [shown, stage, tapped, byTap, countItem, announce, present, pickWord, pickThing]);

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
      if (now - lastChange.current < MIN_ADVANCE_MS || !repeats.pass("picture")) {
        softTap(e.clientX, e.clientY, true);
        return;
      }
      lastChange.current = now;
      const next: Shown = { ...shown, id: nextId.current++, word: pickWord(shown.letter) };
      present(next, lastStage(next));
      softTap(e.clientX, e.clientY);
    },
    [shown, present, pickWord, softTap, repeats],
  );

  /** Make the card move once. */
  const animateCard = useCallback((keyframes: Keyframe[], duration: number) => {
    cardBox.current?.animate(keyframes, { duration, easing: "ease-out" });
  }, []);

  /**
   * Keys that are not letters or numbers each do their own thing: Space jumps with a few raindrops,
   * Enter honks or whistles, arrows push the card, Backspace brings back the one before.
   * Returns false for keys without a meaning of their own.
   */
  const specialKey = useCallback(
    (key: string) => {
      if (key !== " " && key !== "Enter" && !(key in ARROWS) && (key !== "Backspace" || history.current.length === 0)) return false;
      // The same key again moves the card but sounds only after its pause; Backspace waits for it, since it speaks.
      const again = !repeats.pass(key);
      const sound = (play: () => void) => !again && play();
      if (key === " ") {
        sound(playBoing);
        animateCard([{ transform: "none" }, { transform: "translateY(-18%) scale(1.06)" }, { transform: "none" }], 600);
        for (let i = 0; i < 3; i++) ripple();
        return true;
      }
      if (key === "Enter") {
        sound(hornCount.current++ % 2 ? whistle : honk);
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
        if (again) {
          softTap(undefined, undefined, true);
          return true;
        }
        const previous = history.current.pop();
        if (!previous) return false;
        // Shown again in full, without putting the current one on the history.
        current.current = null;
        present(previous, lastStage(previous));
        return true;
      }
      return false;
    },
    [present, ripple, softTap, animateCard, repeats],
  );

  /** A key was pressed, on the keyboard or on the screen. */
  const pressKey = useCallback(
    (key: string) => {
      let target = resolveKey(key, pack);
      if (numbersOnly && target?.kind === "letter") target = null;
      if (settings.twoDigits && target?.kind === "number") {
        // Two-digit numbers: the first digit waits beside an empty place, the second makes the number (2, then 3 is 23).
        const now = performance.now();
        if (firstDigit === null) {
          if (now - lastChange.current < MIN_CHANGE_MS || (settings.finishCounting && now < countingUntil.current)) {
            softTap();
            return;
          }
          lastChange.current = now;
          setFirstDigit(target.n);
          playCountNote(Math.max(0, target.n - 1));
          loadDecade(target.n);
          return;
        }
        const n = firstDigit * 10 + target.n;
        lastChange.current = now;
        if (!repeats.pass(`#${n}`)) {
          // The same number again so soon: the one on screen comes back, silently.
          setFirstDigit(null);
          softTap(undefined, undefined, true);
          return;
        }
        show({ kind: "number", n });
        return;
      }
      if (key === "Backspace" && firstDigit !== null) {
        // Backspace takes back the digit still waiting for its partner.
        setFirstDigit(null);
        softTap();
        return;
      }
      // All things are there and the digit waits: the same number again brings it.
      if (holdDigit && shown?.kind === "number" && stage === shown.n && isSame(target, shown)) {
        const now = performance.now();
        if (now - lastChange.current < MIN_CHANGE_MS || (settings.finishCounting && now < countingUntil.current)) {
          softTap();
          return;
        }
        lastChange.current = now;
        setStage(lastStage(shown));
        announce(shown, lastStage(shown));
        return;
      }
      // Step by step, Space and Enter reveal the next part until everything is shown; then they are special keys again.
      const revealing = shown !== null && stage < lastStage(shown);
      const isNextKey = ((key === " " || key === "Enter") && revealing) || (shown !== null && isSame(target, shown));
      if ((stepByStep || byTap(shown)) && shown && isNextKey) {
        if (!tryAdvance()) softTap();
        return;
      }
      if (!target && specialKey(key)) return;
      // Frei tippen: any other key that is no letter or number opens a surprise; Zählen brings a number by chance.
      if (!target && !numbersOnly) return surprise();
      if (!target) target = randomNumber(shown, settings.twoDigits);
      const now = performance.now();
      const counting = settings.finishCounting && now < countingUntil.current;
      if (!target || counting || now - lastChange.current < MIN_CHANGE_MS) {
        softTap();
        return;
      }
      if (!repeats.pass(toUpper(key, pack))) {
        softTap(undefined, undefined, true);
        return;
      }
      lastChange.current = now;
      show(target);
    },
    [
      pack,
      numbersOnly,
      holdDigit,
      shown,
      stage,
      show,
      announce,
      tryAdvance,
      softTap,
      byTap,
      specialKey,
      stepByStep,
      settings.finishCounting,
      settings.twoDigits,
      firstDigit,
      loadDecade,
      repeats,
      surprise,
    ],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(keyOf(e, pack));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey, pack]);

  // Touch screens: digits, then the alphabet (only the digits for Zählen).
  const touchKeys = useTouchKeys(settings.touchKeys, true);
  const rows = useMemo(() => keyRows([..."1234567890", ...(numbersOnly ? [] : pack.letters.map((l) => l.upper))]), [pack, numbersOnly]);

  useEffect(() => () => countTimers.current.forEach(clearTimeout), []);

  useEffect(() => {
    loadRecordings(["honk", "whistle"]);
  }, []);

  // Step-by-step: any click reveals the next part. Otherwise tapping the card
  // repeats what it says, and tapping elsewhere opens a surprise there (Frei tippen) or ripples (Zählen). Counting by
  // tapping: only the things count; once all are counted, any click brings new ones.
  const onPlayAreaPointer = (e: PointerEvent) => {
    if ((stepByStep || byTap(shown)) && shown) {
      const waitingForTaps = shown.kind === "number" && byTap(shown) && stage <= shown.n;
      if (waitingForTaps || !tryAdvance()) softTap(e.clientX, e.clientY);
      return;
    }
    if (numbersOnly) softTap(e.clientX, e.clientY);
    else surprise({ x: e.clientX, y: e.clientY });
  };
  const onItemPointer = (index: number, e: PointerEvent) => {
    if (countItem(index)) e.stopPropagation();
  };
  const repeat = (e: PointerEvent) => {
    e.stopPropagation();
    const counting = settings.finishCounting && performance.now() < countingUntil.current;
    const again = !shown || counting || !repeats.pass("card");
    if (!again) say(sentenceFor(shown));
    softTap(e.clientX, e.clientY, again);
  };
  const onCardPointer = stepByStep || byTap(shown) ? undefined : repeat;

  return (
    <div ref={root} className={`letters-play${dark ? " ft-dark" : ""}`} style={{ background }} onPointerDown={onPlayAreaPointer}>
      <div ref={stageBox} className="stage">
        <div ref={cardBox} className="card-box" style={{ translate: `${push[0]}cqw ${push[1]}cqh` }}>
          {firstDigit !== null && <HalfNumberCard key="half" first={firstDigit} />}
          {firstDigit === null && shown === null && (
            <p className="letters-welcome">
              {!touchKeys
                ? t({
                    de: "Drück eine Taste! ⌨️",
                    ru: "Нажми на клавишу! ⌨️",
                    en: "Press a key! ⌨️",
                    zh: "按一个键吧！⌨️",
                    hi: "कोई बटन दबाओ! ⌨️",
                    es: "¡Pulsa una tecla! ⌨️",
                    ar: "هيّا نضغط على زر! ⌨️",
                  })
                : numbersOnly
                  ? t({
                      de: "Tipp auf eine Zahl! 👇",
                      ru: "Нажми на цифру! 👇",
                      en: "Tap a number! 👇",
                      zh: "点一个数字吧！👇",
                      hi: "कोई अंक दबाओ! 👇",
                      es: "¡Toca un número! 👇",
                      ar: "هيّا نلمس رقما! 👇",
                    })
                  : t({
                      de: "Tipp auf einen Buchstaben! 👇",
                      ru: "Нажми на букву! 👇",
                      en: "Tap a letter! 👇",
                      zh: "点一个字母吧！👇",
                      hi: "कोई अक्षर दबाओ! 👇",
                      es: "¡Toca una letra! 👇",
                      ar: "هيّا نلمس حرفا! 👇",
                    })}
            </p>
          )}
          {firstDigit === null && shown?.kind === "letter" && (
            <LetterCard
              key={shown.id}
              pack={pack}
              letter={shown.letter}
              word={shown.word}
              settings={settings}
              onPointerDown={onCardPointer}
              onPicturePointerDown={nextWord}
            />
          )}
          {firstDigit === null && shown?.kind === "number" && (
            <NumberCard
              key={shown.id}
              n={shown.n}
              thing={shown.thing}
              zeroEmoji={pack.zero.emoji}
              stage={stage}
              hint={stepByStep || byTap(shown) || holdDigit}
              tapped={byTap(shown) ? tapped : undefined}
              trace={settings.trace}
              onItemPointer={onItemPointer}
              onPointerDown={onCardPointer}
            />
          )}
        </div>
      </div>
      {touchKeys && <TouchKeyboard rows={rows} onKey={pressKey} label={(key) => (settings.letterCase === "lower" ? toLower(key, pack) : key)} />}
      {!numbersOnly && <SurpriseLayer surprises={surprises} />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
