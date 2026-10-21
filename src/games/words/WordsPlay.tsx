import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BRIGHT_COLORS, BurstLayer, useBursts } from "@/components/Bursts";
import { Picture } from "@/components/Picture";
import { inTheme } from "@/content/themes";
import type { LanguagePack, ThemeId, WordEntry } from "@/content/types";
import { playChime, playCountNote, playRandomNote, setSfxVolume } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { MAX_LETTERS, type WordsSettings } from "./settings";

/** Keys closer together than this only spawn shapes, so mashing doesn't race through the word. */
const MIN_TYPE_MS = 300;
/** Time to enjoy a finished word before a key or tap starts the next one. */
const CELEBRATE_MS = 1500;
/** After this many wrong keys in a row, the letter being looked for is said again. */
const HINT_AFTER_WRONG = 3;

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

/** Words that can be typed letter by letter: no hyphens or spaces, and not too long. */
function typeableWords(pack: LanguagePack, maxLetters: number, theme: "all" | ThemeId): WordEntry[] {
  const words = pack.letters
    .flatMap((l) => l.words)
    .filter((w) => /^\p{L}+$/u.test(w.word) && w.word.length <= maxLetters);
  return inTheme(words, theme);
}

/** Case-insensitive, and "a" also counts for "ä" so keyboards without umlauts work. */
function matches(key: string, letter: string) {
  const k = key.toLocaleUpperCase("de-DE");
  const l = letter.toLocaleUpperCase("de-DE");
  return k === l || k === l.normalize("NFD")[0];
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

export function WordsPlay({ pack, settings }: { pack: LanguagePack; settings: WordsSettings }) {
  const [current, setCurrent] = useState<{ id: number; word: WordEntry } | null>(null);
  const [typed, setTyped] = useState(0);
  /** Wrong keys for the current letter; changing it restarts the shake animation. */
  const [nudges, setNudges] = useState(0);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const { bursts, spawn } = useBursts();

  const lastType = useRef(0);
  const doneAt = useRef(0);
  const nextId = useRef(0);
  const deck = useRef<WordEntry[]>([]);

  const words = useMemo(
    () => typeableWords(pack, MAX_LETTERS[settings.length], settings.theme),
    [pack, settings.length, settings.theme],
  );
  const letters = useMemo(() => (current ? Array.from(current.word.word) : []), [current]);
  const done = current !== null && typed === letters.length;

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, pack.speechLang, { queue, rate: settings.calm ? 0.75 : 0.85 });
    },
    [settings.speech, settings.calm, pack.speechLang],
  );

  const sayLetter = useCallback(
    (char: string) => {
      const upper = char.toLocaleUpperCase("de-DE");
      say(`${pack.letters.find((l) => l.upper === upper)?.spoken ?? char}!`);
    },
    [pack, say],
  );

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  // Go through all words in random order before any word comes again.
  const nextWord = useCallback(() => {
    if (deck.current.length === 0) {
      deck.current = shuffle(words);
      // The deck is used from the end; don't start the new round with the word just typed.
      const last = deck.current.length - 1;
      if (last > 0 && deck.current[last] === current?.word) {
        [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
      }
    }
    const word = deck.current.pop()!;
    const id = nextId.current++;
    doneAt.current = 0;
    setCurrent({ id, word });
    setTyped(0);
    setNudges(0);
    setBackground(BACKGROUNDS[id % BACKGROUNDS.length]);
    say(`${word.word}!`);
  }, [words, current, say]);

  const typeNext = useCallback(() => {
    if (!current || done) return;
    const char = letters[typed];
    setTyped(typed + 1);
    setNudges(0);
    sayLetter(char);
    if (typed + 1 < letters.length) {
      if (settings.sounds) playCountNote(typed);
      return;
    }
    doneAt.current = performance.now();
    if (settings.sounds) playChime();
    say(`${current.word.word}! ${pick(pack.praise)}`, true);
    for (let i = 0; i < (settings.calm ? 3 : 8); i++) spawn();
  }, [current, done, letters, typed, pack, say, sayLetter, spawn, settings.sounds, settings.calm]);

  /** Type the next letter unless the last one was too recent. */
  const tryType = useCallback(() => {
    const now = performance.now();
    if (now - lastType.current < MIN_TYPE_MS) return false;
    lastType.current = now;
    typeNext();
    return true;
  }, [typeNext]);

  /** Once a finished word has been celebrated long enough, start the next one. */
  const tryNextWord = useCallback(() => {
    if (!done || performance.now() - doneAt.current < CELEBRATE_MS) return false;
    nextWord();
    return true;
  }, [done, nextWord]);

  // Start with a word right away; settings can't change while playing.
  useEffect(() => nextWord(), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat || !current) return;
      if (done) {
        if (!tryNextWord()) funBurst();
        return;
      }
      if (settings.anyKey || matches(e.key, letters[typed])) {
        if (!tryType()) funBurst();
        return;
      }
      funBurst();
      if ((nudges + 1) % HINT_AFTER_WRONG === 0) sayLetter(letters[typed]);
      setNudges(nudges + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, done, letters, typed, nudges, settings.anyKey, tryType, tryNextWord, funBurst, sayLetter]);

  useEffect(() => {
    setSfxVolume(settings.calm ? 0.4 : 1);
  }, [settings.calm]);

  // Tapping the waiting letter types it, tapping the picture says the word,
  // and once the word is done any tap moves on. Everywhere else makes shapes.
  const onPlayAreaPointer = (e: PointerEvent) => {
    if (tryNextWord()) return;
    funBurst(e.clientX, e.clientY);
  };
  const onNextLetterPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (!tryType()) funBurst(e.clientX, e.clientY);
  };
  const onPicturePointer = (e: PointerEvent) => {
    if (done || !current) return;
    e.stopPropagation();
    say(`${current.word.word}!`);
    funBurst(e.clientX, e.clientY);
  };

  const display = (char: string) =>
    settings.letterCase === "upper"
      ? char.toLocaleUpperCase("de-DE")
      : settings.letterCase === "lower"
        ? char.toLocaleLowerCase("de-DE")
        : char;

  return (
    <div
      className={`words-play${settings.calm ? " calm" : ""}`}
      style={{ background }}
      onPointerDown={onPlayAreaPointer}
    >
      {current && (
        <div key={current.id} className={`card${done ? " done" : ""}`}>
          <div className={`reveal ${settings.showPicture || done ? "shown" : "waiting"}`} onPointerDown={onPicturePointer}>
            <Picture word={current.word} />
          </div>
          <div className="slots" style={{ "--letters": letters.length } as CSSProperties}>
            {letters.map((char, i) =>
              i === typed ? (
                <span
                  key={`${i}-${nudges}`}
                  className={`slot next${nudges > 0 ? " nudge" : ""}`}
                  onPointerDown={onNextLetterPointer}
                >
                  {display(char)}
                </span>
              ) : (
                <span
                  key={i}
                  className={`slot ${i < typed ? "typed" : "later"}`}
                  style={
                    {
                      "--i": i,
                      color: i < typed ? BRIGHT_COLORS[i % BRIGHT_COLORS.length] : undefined,
                    } as CSSProperties
                  }
                >
                  {display(char)}
                </span>
              ),
            )}
          </div>
        </div>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
