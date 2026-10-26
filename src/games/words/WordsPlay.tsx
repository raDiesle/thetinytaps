import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BRIGHT_COLORS, BurstLayer, useBursts } from "@/components/Bursts";
import { Picture } from "@/components/Picture";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyMatches, keyOf, toLower, toUpper } from "@/content/languages";
import { inTheme } from "@/content/themes";
import { translate } from "@/content/translate";
import type { ActionWord, ColorWord, LanguagePack, ThemeId, WordEntry } from "@/content/types";
import { playChime, playCountNote, playRandomNote } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { MAX_LETTERS, type WordsMode, type WordsSettings } from "./settings";

/** Keys closer together than this only spawn shapes, so mashing doesn't race through the word. */
const MIN_TYPE_MS = 300;
/** Time to enjoy a finished word before a key or tap starts the next one. */
const CELEBRATE_MS = 1500;
/** After this many wrong keys in a row, the letter being looked for is said again. */
const HINT_AFTER_WRONG = 3;

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

/** Words that can be typed letter by letter: no hyphens or spaces, and not too long. */
function typeableWords(pack: LanguagePack, maxLetters: number, theme: "all" | ThemeId): WordEntry[] {
  const words = pack.letters.flatMap((l) => l.words).filter((w) => /^\p{L}+$/u.test(w.word) && w.word.length <= maxLetters);
  return inTheme(words, theme);
}

function wordsFor(pack: LanguagePack, mode: WordsMode, maxLetters: number, theme: "all" | ThemeId): WordEntry[] {
  if (mode === "colors") return pack.colors;
  if (mode === "actions") return pack.actions;
  return typeableWords(pack, maxLetters, theme);
}

const isColor = (word: WordEntry): word is ColorWord => "color" in word;
const isAction = (word: WordEntry): word is ActionWord => "action" in word;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

/** Puzzle pieces over the picture, in a grid about as square as the letters allow. */
function puzzleGrid(letters: number) {
  const cols = Math.ceil(Math.sqrt(letters));
  const rows = Math.ceil(letters / cols);
  return { cols, rows, order: shuffle(Array.from({ length: cols * rows }, (_, i) => i)) };
}

/** Where the things of a colour hop in: around the edges, so the word stays readable. */
function paradeSpots(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: 4 + ((i + Math.random() * 0.6) / count) * 86,
    top: i % 2 === 0 ? 2 + Math.random() * 8 : 78 + Math.random() * 8,
  }));
}

export function WordsPlay({
  pack,
  second,
  settings,
}: {
  pack: LanguagePack;
  /** Optional second language: the finished word is also shown and said in it. */
  second: LanguagePack | null;
  settings: WordsSettings;
}) {
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
    () => wordsFor(pack, settings.mode, MAX_LETTERS[settings.length], settings.theme),
    [pack, settings.mode, settings.length, settings.theme],
  );
  const letters = useMemo(() => (current ? Array.from(current.word.word) : []), [current]);
  const done = current !== null && typed === letters.length;
  const firstOnly = settings.mode === "first";
  // The first-letter game needs the picture as its only clue.
  const reveal = firstOnly ? "now" : settings.picture;
  const puzzle = useMemo(() => (reveal === "puzzle" ? puzzleGrid(letters.length) : null), [reveal, letters]);
  const color = current && isColor(current.word) ? current.word : null;
  const action = current && isAction(current.word) ? current.word : null;
  const translation = current && second ? translate(current.word, second) : undefined;
  const parade = useMemo(() => (color ? paradeSpots(color.things.length) : []), [color]);

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, pack.speechLang, { queue, rate: 0.85 });
    },
    [settings.speech, pack.speechLang],
  );

  const sayLetter = useCallback(
    (char: string) => {
      const upper = toUpper(char, pack);
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
    say(firstOnly ? pack.firstLetterPrompt(word) : `${word.word}!`);
  }, [words, current, say, firstOnly, pack]);

  const typeNext = useCallback(() => {
    if (!current || done) return;
    const char = letters[typed];
    // In the first-letter game the rest of the word flies in by itself.
    const next = firstOnly ? letters.length : typed + 1;
    setTyped(next);
    setNudges(0);
    sayLetter(char);
    if (next < letters.length) {
      if (settings.sounds) playCountNote(typed);
      return;
    }
    doneAt.current = performance.now();
    if (settings.sounds) playChime();
    const word = current.word;
    say(`${word.word}! ${isAction(word) ? pack.joinIn(word) : pick(pack.praise)}`, true);
    if (settings.speech && second && translation) {
      speak(`${translation}!`, second.speechLang, { queue: true, rate: 0.85 });
    }
    if (isColor(word)) setBackground(word.color);
    for (let i = 0; i < 8; i++) spawn();
  }, [current, done, letters, typed, firstOnly, pack, second, translation, say, sayLetter, spawn, settings.sounds, settings.speech]);

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

  /** A key was pressed, on the keyboard or on the screen. */
  const pressKey = useCallback(
    (key: string) => {
      if (!current) return;
      if (done) {
        if (!tryNextWord()) funBurst();
        return;
      }
      if (settings.anyKey || keyMatches(key, letters[typed], pack)) {
        if (!tryType()) funBurst();
        return;
      }
      funBurst();
      if ((nudges + 1) % HINT_AFTER_WRONG === 0) sayLetter(letters[typed]);
      setNudges(nudges + 1);
    },
    [current, done, letters, typed, nudges, pack, settings.anyKey, tryType, tryNextWord, funBurst, sayLetter],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(keyOf(e, pack));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey, pack]);

  const touchKeys = useTouchKeys(settings.touchKeys);
  const rows = useMemo(() => keyRows(pack.letters.map((l) => l.upper)), [pack]);

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

  // The key for the next letter; "Ó" has none on the screen, so its "O" lights up.
  const wanted = letters[typed] && toUpper(letters[typed], pack);
  const wantedKey = !wanted || pack.letters.some((l) => l.upper === wanted) ? wanted : wanted.normalize("NFD")[0];

  const display = (char: string) => (settings.letterCase === "upper" ? toUpper(char, pack) : settings.letterCase === "lower" ? toLower(char, pack) : char);

  const figureClass = ["figure", puzzle && "puzzle", action && "actor", done && action && `act-${action.action}`].filter(Boolean).join(" ");

  /** Typed letters are bright; colour words are written in their colour, and in white once the screen has it. */
  const typedColor = (i: number) => (color ? (done ? "#fff" : color.color) : BRIGHT_COLORS[i % BRIGHT_COLORS.length]);

  const slotClass = (i: number) => {
    if (i < typed) return firstOnly && i > 0 ? "slot typed flown" : "slot typed";
    return firstOnly ? "slot hidden" : "slot later";
  };

  return (
    <div className={`words-play${color && done ? " colored" : ""}`} style={{ background }} onPointerDown={onPlayAreaPointer}>
      <div className="stage">
        {color && done && (
          <div key={`parade-${current?.id}`} className="color-parade" aria-hidden>
            {parade.map((spot, i) => (
              <span key={i} className="parade-thing" style={{ left: `${spot.left}%`, top: `${spot.top}%`, "--i": i } as CSSProperties}>
                {color.things[i]}
              </span>
            ))}
          </div>
        )}
        {current && (
          <div key={current.id} className={`card${done ? " done" : ""}`}>
            <div className={`reveal ${reveal !== "end" || done ? "shown" : "waiting"}`} onPointerDown={onPicturePointer}>
              <div className={figureClass}>
                <Picture word={current.word} />
                {puzzle && (
                  <div
                    className="puzzle-cover"
                    style={{ gridTemplateColumns: `repeat(${puzzle.cols}, 1fr)`, gridTemplateRows: `repeat(${puzzle.rows}, 1fr)` }}
                    aria-hidden
                  >
                    {puzzle.order.map((piece, n) => (
                      <span
                        key={piece}
                        className={`piece${n < Math.round((typed / letters.length) * puzzle.order.length) ? " off" : ""}`}
                        style={{ order: piece, background: BRIGHT_COLORS[piece % BRIGHT_COLORS.length] }}
                      />
                    ))}
                  </div>
                )}
              </div>
              {action && done && <div className="join-in">{pack.joinIn(action)} 🙌</div>}
            </div>
            <div className="slots" style={{ "--letters": letters.length } as CSSProperties}>
              {letters.map((char, i) =>
                i === typed ? (
                  <span key={`${i}-${nudges}`} className={`slot next${nudges > 0 ? " nudge" : ""}`} onPointerDown={onNextLetterPointer}>
                    {display(char)}
                  </span>
                ) : (
                  <span key={i} className={slotClass(i)} style={{ "--i": i, color: i < typed ? typedColor(i) : undefined } as CSSProperties}>
                    {display(char)}
                  </span>
                ),
              )}
            </div>
            {done && translation && <div className="translation">{translation}</div>}
          </div>
        )}
      </div>
      {touchKeys && (
        <TouchKeyboard
          rows={rows}
          onKey={pressKey}
          label={(key) => (settings.letterCase === "lower" ? toLower(key, pack) : key)}
          highlight={done ? undefined : wantedKey}
        />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
