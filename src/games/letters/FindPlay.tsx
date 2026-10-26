import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { KeyboardMap } from "@/components/KeyboardMap";
import { Picture } from "@/components/Picture";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyMatches, keyOf, toLower } from "@/content/languages";
import { inTheme } from "@/content/themes";
import { translate } from "@/content/translate";
import type { LanguagePack, LetterEntry, ThemeId, WordEntry } from "@/content/types";
import { useT } from "@/lib/language";
import { playChime, playRandomNote } from "@/lib/sfx";
import { speak } from "@/lib/speech";
import { LetterWord } from "./Cards";
import type { LettersSettings } from "./settings";

/** Keys closer together than this only spawn shapes, so mashing the whole keyboard doesn't count as finding. */
const MIN_PRESS_MS = 300;
/** Time to enjoy a found key before a key or tap brings the next letter. */
const CELEBRATE_MS = 1500;
/** After this many wrong keys, the wanted key lights up and the question is asked again. */
const HINT_AFTER_WRONG = 3;

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

/**
 * Letters to look for. Umlauts are left out: their keys are missing on many
 * keyboards, and they are rarely among the first letters children know. The same
 * goes for Russian Ё (outside А–Я), whose key sits left of the 1.
 */
function findableLetters(pack: LanguagePack, theme: "all" | ThemeId): LetterEntry[] {
  const plain = pack.letters.filter((l) => /^[A-ZА-Я]$/.test(l.upper));
  if (theme === "all") return plain;
  const matching = plain.filter((l) => l.words.some((w) => w.theme === theme));
  return matching.length > 0 ? matching : plain;
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

/** "Wo ist das B?": a letter and its picture appear, and the child looks for the key. */
export function FindPlay({
  pack,
  second,
  settings,
}: {
  pack: LanguagePack;
  /** Optional second language: the word is also shown and said in it. */
  second: LanguagePack | null;
  settings: LettersSettings;
}) {
  const [current, setCurrent] = useState<{ id: number; letter: LetterEntry; word: WordEntry } | null>(null);
  /** Wrong keys for the current letter; changing it restarts the shake animation. */
  const [wrong, setWrong] = useState(0);
  const [found, setFound] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const { bursts, spawn } = useBursts();
  const t = useT();

  const lastPress = useRef(0);
  const foundAt = useRef(0);
  const nextId = useRef(0);
  const deck = useRef<LetterEntry[]>([]);
  const wordIndex = useRef(new Map<string, number>());

  const letters = useMemo(() => findableLetters(pack, settings.theme), [pack, settings.theme]);
  const showHint = settings.hints && wrong >= HINT_AFTER_WRONG;
  const translation = current && second ? translate(current.word, second) : undefined;

  const say = useCallback(
    (text: string, queue = false) => {
      if (settings.speech) speak(text, pack.speechLang, { queue, rate: 0.85 });
    },
    [settings.speech, pack.speechLang],
  );

  const funBurst = useCallback(
    (x?: number, y?: number) => {
      spawn(x, y);
      if (settings.sounds) playRandomNote();
    },
    [spawn, settings.sounds],
  );

  // Cycle through the letter's words, so a letter that comes again has a new picture.
  const pickWord = useCallback(
    (letter: LetterEntry) => {
      const words = inTheme(letter.words, settings.theme);
      const index = wordIndex.current.get(letter.upper) ?? 0;
      wordIndex.current.set(letter.upper, index + 1);
      return words[index % words.length];
    },
    [settings.theme],
  );

  // Go through all letters in random order before any letter comes again.
  const nextLetter = useCallback(() => {
    if (deck.current.length === 0) {
      deck.current = shuffle(letters);
      // The deck is used from the end; don't start the new round with the letter just found.
      const last = deck.current.length - 1;
      if (last > 0 && deck.current[last] === current?.letter) {
        [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
      }
    }
    const letter = deck.current.pop()!;
    const id = nextId.current++;
    setCurrent({ id, letter, word: pickWord(letter) });
    setWrong(0);
    setFound(false);
    setBackground(BACKGROUNDS[id % BACKGROUNDS.length]);
    say(pack.findPrompt(letter));
  }, [letters, current, pack, pickWord, say]);

  /** Once a found key has been celebrated long enough, bring the next letter. */
  const tryNextLetter = useCallback(() => {
    if (!found || performance.now() - foundAt.current < CELEBRATE_MS) return false;
    nextLetter();
    return true;
  }, [found, nextLetter]);

  // Start with a letter right away; settings can't change while playing.
  useEffect(() => nextLetter(), []);

  /** A key was pressed, on the keyboard or on the screen. */
  const pressKey = useCallback(
    (key: string) => {
      if (!current) return;
      if (found) {
        if (!tryNextLetter()) funBurst();
        return;
      }
      const now = performance.now();
      if (now - lastPress.current < MIN_PRESS_MS) {
        funBurst();
        return;
      }
      lastPress.current = now;

      if (keyMatches(key, current.letter.upper, pack)) {
        foundAt.current = now;
        setFound(true);
        setFoundCount((n) => n + 1);
        if (settings.sounds) playChime();
        say(`${pack.letterSentence(current.letter, current.word)} ${pick(pack.praise)}`);
        if (settings.speech && second && translation) {
          speak(`${translation}!`, second.speechLang, { queue: true, rate: 0.85 });
        }
        for (let i = 0; i < 8; i++) spawn();
        return;
      }
      funBurst();
      if ((wrong + 1) % HINT_AFTER_WRONG === 0) say(pack.findPrompt(current.letter));
      setWrong(wrong + 1);
    },
    [current, found, wrong, pack, second, translation, say, spawn, funBurst, tryNextLetter, settings.sounds, settings.speech],
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

  // Tapping the card asks again; once the key is found, any tap moves on.
  const onPlayAreaPointer = (e: PointerEvent) => {
    if (tryNextLetter()) return;
    funBurst(e.clientX, e.clientY);
  };
  const onCardPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (tryNextLetter()) return;
    if (current && !found) say(pack.findPrompt(current.letter));
    funBurst(e.clientX, e.clientY);
  };

  const glyphs = current
    ? { upper: [current.letter.upper], both: [current.letter.upper, current.letter.lower], lower: [current.letter.lower] }[settings.letterCase]
    : [];

  return (
    <div className={`letters-play`} style={{ background }} onPointerDown={onPlayAreaPointer}>
      <div className="stage">
        {current && (
          <div key={current.id} className={`card find-card${found ? " done" : ""}`} data-tap onPointerDown={onCardPointer}>
            <Picture word={current.word} />
            {settings.showWord && <LetterWord letter={current.letter} word={current.word} />}
            {settings.showWord && translation && <div className="translation">{translation}</div>}
            <div key={wrong} className={`find-key${wrong > 0 ? " nudge" : ""}`} aria-label={pack.findPrompt(current.letter)}>
              {glyphs.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {foundCount > 0 && (
        <div className="find-stars" aria-label={t({ de: `${foundCount} gefunden`, ru: `Найдено: ${foundCount}` })}>
          {"⭐".repeat(Math.min(foundCount, 10))}
          {foundCount > 10 && <span className="find-count">{foundCount}</span>}
        </div>
      )}
      {touchKeys ? (
        <TouchKeyboard
          rows={rows}
          onKey={pressKey}
          label={(key) => (settings.letterCase === "lower" ? toLower(key, pack) : key)}
          highlight={showHint || found ? current?.letter.upper : undefined}
        />
      ) : (
        settings.hints && <KeyboardMap rows={pack.keyboardRows} highlight={current?.letter.upper} visible={showHint} />
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
