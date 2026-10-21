"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import type { Countable, LanguagePack, LetterEntry, WordEntry } from "@/content/types";
import { playChime, playCountNote, playRandomNote } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { LetterCard, NumberCard } from "./Cards";
import type { LettersSettings } from "./settings";

/** Presses closer together than this only spawn shapes, so mashing doesn't strobe. */
const MIN_CHANGE_MS = 600;
/** Time between counted items for number keys. */
const COUNT_STEP_MS = 800;

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

export function LettersPlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [shown, setShown] = useState<Shown | null>(null);
  const [counted, setCounted] = useState(0);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const { bursts, spawn } = useBursts();

  const lastChange = useRef(0);
  const nextId = useRef(0);
  const wordIndex = useRef(new Map<string, number>());
  const lastThing = useRef<Countable | null>(null);
  const countTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, pack.speechLang, { queue });
    },
    [settings.speech, pack.speechLang],
  );

  const sentenceFor = useCallback(
    (s: Shown) => {
      if (s.kind === "letter") return pack.letterSentence(s.letter, s.word);
      return s.n === 0 ? pack.zero.sentence : pack.countSentence(s.n, s.thing);
    },
    [pack],
  );

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  const show = useCallback(
    (target: Target) => {
      countTimers.current.forEach(clearTimeout);
      countTimers.current = [];
      const id = nextId.current++;
      setBackground(BACKGROUNDS[id % BACKGROUNDS.length]);

      if (target.kind === "letter") {
        // Cycle through the letter's words so repeated presses stay interesting.
        const { letter } = target;
        const index = wordIndex.current.get(letter.upper) ?? 0;
        wordIndex.current.set(letter.upper, index + 1);
        const next: Shown = { kind: "letter", id, letter, word: letter.words[index % letter.words.length] };
        setShown(next);
        if (settings.sounds) playChime();
        say(sentenceFor(next));
        return;
      }

      const others = pack.countables.filter((c) => c !== lastThing.current);
      const thing = others[Math.floor(Math.random() * others.length)];
      lastThing.current = thing;
      const next: Shown = { kind: "number", id, n: target.n, thing };
      setShown(next);
      setCounted(0);

      if (target.n === 0) {
        say(pack.zero.sentence);
        return;
      }
      // Pop the items in one by one while counting aloud, then say the total.
      for (let i = 0; i < target.n; i++) {
        countTimers.current.push(
          setTimeout(() => {
            setCounted(i + 1);
            if (settings.sounds) playCountNote(i);
            say(pack.numberWords[i + 1], i > 0);
          }, i * COUNT_STEP_MS),
        );
      }
      countTimers.current.push(setTimeout(() => say(sentenceFor(next), true), target.n * COUNT_STEP_MS));
    },
    [pack, say, sentenceFor, settings.sounds],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const target = resolveKey(e.key, pack);
      const now = performance.now();
      if (!target || now - lastChange.current < MIN_CHANGE_MS) {
        funBurst();
        return;
      }
      lastChange.current = now;
      show(target);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pack, show, funBurst]);

  useEffect(() => () => countTimers.current.forEach(clearTimeout), []);

  // Tapping the card repeats what it says; tapping elsewhere makes shapes.
  const repeat = (e: PointerEvent) => {
    e.stopPropagation();
    if (shown) say(sentenceFor(shown));
    funBurst(e.clientX, e.clientY);
  };

  return (
    <div className="letters-play" style={{ background }} onPointerDown={(e) => funBurst(e.clientX, e.clientY)}>
      {shown === null && <p className="letters-welcome">Drück eine Taste! ⌨️</p>}
      {shown?.kind === "letter" && (
        <LetterCard key={shown.id} letter={shown.letter} word={shown.word} settings={settings} onPointerDown={repeat} />
      )}
      {shown?.kind === "number" && (
        <NumberCard
          key={shown.id}
          n={shown.n}
          thing={shown.thing}
          zeroEmoji={pack.zero.emoji}
          counted={counted}
          onPointerDown={repeat}
        />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
