import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { KeyboardMap } from "@/components/KeyboardMap";
import { Picture } from "@/components/Picture";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyMatches, keyOf, toLower } from "@/content/languages";
import { inTheme } from "@/content/themes";
import type { LanguagePack, LetterEntry, ThemeId, WordEntry } from "@/content/types";
import { playChime } from "@/lib/sfx";
import { LetterWord } from "./Cards";
import { useLettersPraise, useLettersSay } from "./voice";
import type { LettersSettings } from "./settings";
import { useSoftTap } from "./softTap";

/** Keys closer together than this only make ripples, so mashing the whole keyboard doesn't count as finding. */
const MIN_PRESS_MS = 300;
/** Time to enjoy a found key before the next letter comes by itself – one right key is all it takes. */
const CELEBRATE_MS = 1500;
/** After this many wrong keys, the wanted key lights up and the question is asked again. */
const HINT_AFTER_WRONG = 3;

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

/**
 * Letters to look for. Umlauts are left out: their keys are missing on many
 * keyboards, and they are rarely among the first letters children know. The same
 * goes for Russian Ё (outside А–Я), whose key sits left of the 1, and Spanish Ñ.
 * In other scripts (Hindi, Arabic) the letters printed on the keyboard rows, so
 * none that needs Shift (Hindi ख, ङ).
 */
function findableLetters(pack: LanguagePack, theme: "all" | ThemeId): LetterEntry[] {
  const keys = pack.keyboardRows.join("");
  const findable = (upper: string) => /^[A-ZА-Я]$/.test(upper) || (!/[\p{Script=Latin}\p{Script=Cyrillic}]/u.test(upper) && keys.includes(upper));
  const plain = pack.letters.filter((l) => findable(l.upper));
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
export function FindPlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [current, setCurrent] = useState<{ id: number; letter: LetterEntry; word: WordEntry } | null>(null);
  /** Wrong keys for the current letter; changing it restarts the shake animation. */
  const [wrong, setWrong] = useState(0);
  const [found, setFound] = useState(false);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const { effects, ripple } = useTapFeedback();

  const lastPress = useRef(0);
  const nextId = useRef(0);
  const deck = useRef<LetterEntry[]>([]);
  const wordIndex = useRef(new Map<string, number>());

  const letters = useMemo(() => findableLetters(pack, settings.theme), [pack, settings.theme]);
  const showHint = settings.hints && wrong >= HINT_AFTER_WRONG;

  const say = useLettersSay();
  const praise = useLettersPraise();

  const softTap = useSoftTap(ripple, settings.sounds);

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
  const nextLetter = useCallback(
    (queue = false) => {
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
      // After a find, the question waits for the praise instead of cutting it off.
      say(pack.findPrompt(letter), queue);
    },
    [letters, current, pack, pickWord, say],
  );

  // A found key stays lit for a moment, then the next letter comes without another key or tap.
  useEffect(() => {
    if (!found) return;
    const timer = setTimeout(() => nextLetter(true), CELEBRATE_MS);
    return () => clearTimeout(timer);
  }, [found, nextLetter]);

  // Start with a letter right away; a new kind of pictures while playing brings a new game (its key in LettersGame).
  useEffect(() => nextLetter(), []);

  /** A key was pressed, on the keyboard or on the screen. */
  const pressKey = useCallback(
    (key: string) => {
      if (!current) return;
      if (found) {
        softTap();
        return;
      }
      const now = performance.now();
      if (now - lastPress.current < MIN_PRESS_MS) {
        softTap();
        return;
      }
      lastPress.current = now;

      if (keyMatches(key, current.letter.upper, pack)) {
        setFound(true);
        if (settings.sounds) playChime();
        say(pack.letterSentence(current.letter, current.word));
        praise(pick(pack.praise));
        return;
      }
      softTap();
      if ((wrong + 1) % HINT_AFTER_WRONG === 0) say(pack.findPrompt(current.letter));
      setWrong(wrong + 1);
    },
    [current, found, wrong, pack, say, praise, softTap, settings.sounds],
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

  // Tapping the card asks again.
  const onPlayAreaPointer = (e: PointerEvent) => {
    softTap(e.clientX, e.clientY);
  };
  const onCardPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (current && !found) say(pack.findPrompt(current.letter));
    softTap(e.clientX, e.clientY);
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
            {settings.showWord && <LetterWord pack={pack} letter={current.letter} word={current.word} />}
            <div key={wrong} className={`find-key${wrong > 0 ? " nudge" : ""}`} aria-label={pack.findPrompt(current.letter)}>
              {glyphs.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          </div>
        )}
      </div>
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
      <FeedbackLayer effects={effects} />
    </div>
  );
}
