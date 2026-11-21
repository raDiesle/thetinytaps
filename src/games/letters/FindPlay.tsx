import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { KeyboardMap } from "@/components/KeyboardMap";
import { Picture } from "@/components/Picture";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyMatches, keyOf, toLower } from "@/content/languages";
import { inTheme } from "@/content/themes";
import type { LanguagePack, LetterEntry, WordEntry } from "@/content/types";
import { useAppLanguage } from "@/lib/language";
import { pick, shuffle } from "@/lib/random";
import { playChime } from "@/lib/sfx";
import { useVoiceReady } from "@/lib/voiceReady";
import { BigKeys } from "./BigKeys";
import { bigKeyChoices, findableLetters, useKeyLevel } from "./fewKeys";
import { LetterWord } from "./Cards";
import { lettersVoice, useLettersPraise, useLettersSay } from "./voice";
import type { LettersSettings } from "./settings";
import { useSoftTap } from "./softTap";
import "./letters.css";
import "./find.css";

/** Keys closer together than this only make ripples, so mashing the whole keyboard doesn't count as finding. */
const MIN_PRESS_MS = 300;
/** Time to enjoy a found key before the next letter comes by itself – one right key is all it takes. */
const CELEBRATE_MS = 1500;
/** After this many wrong keys, the wanted key lights up and the question is asked again. */
const HINT_AFTER_WRONG = 3;

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

/** A letter to look for, with its picture. */
type Sought = { letter: LetterEntry; word: WordEntry };
/**
 * One round: the letter on screen, the one after it (its lines load meanwhile), whether its question waits for the
 * praise, and the few big keys to find it among on a touch screen (empty with the whole keyboard).
 */
type Round = Sought & { id: number; after: Sought; queue: boolean; keys: string[] };

/** "Wo ist das B?": a letter and its picture appear, and the child looks for the key. */
export function FindPlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [current, setCurrent] = useState<Round | null>(null);
  /** The next letter, waiting for its lines (`useVoiceReady`) while the letter found stays on screen. */
  const [coming, setComing] = useState<Round | null>(null);
  /** Wrong keys for the current letter; changing it restarts the shake animation. */
  const [wrong, setWrong] = useState(0);
  const [found, setFound] = useState(false);
  const [background, setBackground] = useState(BACKGROUNDS[0]);
  const { effects, ripple } = useTapFeedback();

  const lastPress = useRef(0);
  const nextId = useRef(0);
  const deck = useRef<LetterEntry[]>([]);
  const wordIndex = useRef(new Map<string, number>());
  /** The letter drawn last from the deck: the one after the letter on screen. */
  const upcoming = useRef<Sought | null>(null);
  const { id: language } = useAppLanguage();

  const letters = useMemo(() => findableLetters(pack, settings.theme), [pack, settings.theme]);
  /** The big keys' other letters: any letter with a key of its own, whatever the pictures. */
  const keyPool = useMemo(() => findableLetters(pack, "all").map((l) => l.upper), [pack]);
  const touchKeys = useTouchKeys(settings.touchKeys);
  const keyLevel = useKeyLevel(settings.bigKeys);
  const fewKeys = touchKeys && settings.bigKeys !== "all";
  const showHint = settings.hints && wrong >= HINT_AFTER_WRONG;

  const say = useLettersSay();
  const praise = useLettersPraise();

  const softTap = useSoftTap(ripple);

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

  /** What a round says: its question and, once found, the letter with its word. */
  const linesOf = useCallback(({ letter, word }: Sought) => [pack.findPrompt(letter), pack.letterSentence(letter, word)], [pack]);

  // A letter comes on screen only once its lines are there, so its question is asked with its picture; the letter
  // after it loads meanwhile. The praise is a handful of lines, loaded once.
  const round = coming ?? current;
  const ready = useVoiceReady(lettersVoice, round ? linesOf(round) : [], language, { next: round ? linesOf(round.after) : [] });
  useEffect(() => lettersVoice.load(pack.praise, language), [pack, language]);

  // Go through all letters in random order before any letter comes again; each is drawn one round ahead, so its
  // lines load while the letter before it is looked for.
  const draw = useCallback((): Sought => {
    if (deck.current.length === 0) {
      deck.current = shuffle(letters);
      // The deck is used from the end; don't start the new round with the letter drawn last.
      const last = deck.current.length - 1;
      if (last > 0 && deck.current[last] === upcoming.current?.letter) {
        [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
      }
    }
    const letter = deck.current.pop()!;
    upcoming.current = { letter, word: pickWord(letter) };
    return upcoming.current;
  }, [letters, pickWord]);

  /** Draws the next letter; after a find (`queue`) its question waits for the praise instead of cutting it off. */
  const nextLetter = useCallback(
    (queue = false) => {
      const first = upcoming.current ?? draw();
      const keys = fewKeys ? bigKeyChoices(first.letter.upper, keyPool, keyLevel.count(), pack) : [];
      setComing({ ...first, id: nextId.current++, after: draw(), queue, keys });
    },
    [draw, fewKeys, keyPool, keyLevel, pack],
  );

  // The letter waiting comes on screen once its lines are there.
  useEffect(() => {
    if (!coming || !ready) return;
    setComing(null);
    setCurrent(coming);
    setWrong(0);
    setFound(false);
    setBackground(BACKGROUNDS[coming.id % BACKGROUNDS.length]);
    say(pack.findPrompt(coming.letter), coming.queue);
  }, [coming, ready, pack, say]);

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
      if (!current || found) {
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
        // Found at the first tap, a few in a row bring one big key more; after wrong taps one less.
        keyLevel.found(wrong === 0);
        playChime();
        say(pack.letterSentence(current.letter, current.word));
        praise(pick(pack.praise));
        return;
      }
      softTap();
      if ((wrong + 1) % HINT_AFTER_WRONG === 0) say(pack.findPrompt(current.letter));
      setWrong(wrong + 1);
    },
    [current, found, wrong, pack, say, praise, softTap, keyLevel],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(keyOf(e, pack));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey, pack]);

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
    <div className={`letters-play${fewKeys ? " wb-play" : ""}`} style={{ background }} onPointerDown={onPlayAreaPointer}>
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
      {fewKeys ? (
        current && (
          <BigKeys
            keys={current.keys}
            wanted={current.letter.upper}
            onKey={pressKey}
            label={(key) => (settings.letterCase === "lower" ? toLower(key, pack) : key)}
            hint={showHint}
            lit={found}
          />
        )
      ) : touchKeys ? (
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
