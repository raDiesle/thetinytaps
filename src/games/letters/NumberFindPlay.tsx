import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { KeyboardMap } from "@/components/KeyboardMap";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyOf } from "@/content/languages";
import { inTheme } from "@/content/themes";
import type { Countable, LanguagePack } from "@/content/types";
import { useAppLanguage } from "@/lib/language";
import { pick } from "@/lib/random";
import { playChime } from "@/lib/sfx";
import { useTimers } from "@/lib/timers";
import type { VoiceLine } from "@/lib/voice";
import { useVoiceReady } from "@/lib/voiceReady";
import { CountThings } from "./Cards";
import { digitOf, drawNumber, type FindPace, HINT_AFTER_WRONG, NUMBER_FIND_PROMPT, nextPace, START_PACE } from "./numberFind";
import { lettersVoice, useLettersPraise, useLettersSay } from "./voice";
import type { LettersSettings } from "./settings";
import { useSoftTap } from "./softTap";
import "./letters.css";
import "./find.css";

/** Keys closer together than this only make ripples, so mashing the whole keyboard doesn't count as finding. */
const MIN_PRESS_MS = 300;
/** Time to enjoy a found number before the next one comes by itself – one right key is all it takes. */
const CELEBRATE_MS = 1500;

const BACKGROUNDS = ["#fff4d6", "#e3f6ff", "#e9ffe0", "#ffe8f0", "#efe9ff", "#fff0e0"];

/** The digit keys on a touch screen, in the order of a keyboard's top row. */
const DIGIT_ROWS = keyRows([..."1234567890"]);
/** The small keyboard picture's one row: where the digits are on a real keyboard. */
const DIGIT_MAP = ["1234567890"];

/** A number to look for, with the things that show how many. */
type Sought = { n: number; thing: Countable };
/** One round: the number on screen, the one after it (its lines load meanwhile), and whether its question waits for the praise. */
type Round = Sought & { id: number; after: Sought; queue: boolean };

/**
 * „Wo ist die 3?“ (L-17), Zählen's other way to play: things appear, and the child looks for the digit key that says
 * how many. Other keys only ripple with a soft note; after a few, the right key lights up. One right key and the digit
 * stands in the key, pressed and lit, the things are counted in a sentence, and the next number comes by itself. The
 * numbers grow from 1–3 to 5 and to 9 as the child finds them at once (`nextPace`).
 */
export function NumberFindPlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [current, setCurrent] = useState<Round | null>(null);
  /** The next number, waiting for its lines (`useVoiceReady`) while the one found stays on screen. */
  const [coming, setComing] = useState<Round | null>(null);
  const [wrong, setWrong] = useState(0);
  const [found, setFound] = useState(false);
  const { effects, ripple } = useTapFeedback();
  const { later } = useTimers();
  const { id: language } = useAppLanguage();

  const lastPress = useRef(0);
  const nextId = useRef(0);
  const pace = useRef<FindPace>(START_PACE);
  /** The number drawn last: the one after the number on screen. */
  const upcoming = useRef<Sought | null>(null);

  const say = useLettersSay();
  const praise = useLettersPraise();
  const softTap = useSoftTap(ripple);
  const showHint = settings.hints && wrong >= HINT_AFTER_WRONG;

  const things = useMemo(() => inTheme(pack.countables, settings.theme), [pack, settings.theme]);

  /** The question, in the app language where it is written, else in English, whose recording stands in. */
  const prompt = useMemo(() => ({ text: NUMBER_FIND_PROMPT[language] ?? NUMBER_FIND_PROMPT.en, english: NUMBER_FIND_PROMPT.en }), [language]);
  /** Asks the question; `queue` waits for what is being said (the praise of the number before). */
  const ask = useCallback((queue = false) => say(prompt.text, queue, prompt.english), [say, prompt]);
  const countLine = useCallback((s: Sought) => pack.countSentence(s.n, s.thing), [pack]);
  /** What a round says: its question, and once found how many things there are („drei Äpfel!“, else „drei!“). */
  const linesOf = useCallback((s: Sought): VoiceLine[] => [prompt, countLine(s), `${pack.numberWords[s.n]}!`], [prompt, countLine, pack]);

  // A number comes on screen only once its lines are there, so its question comes with its things; the next one
  // loads meanwhile. The praise is a handful of lines, loaded once.
  const round = coming ?? current;
  const ready = useVoiceReady(lettersVoice, round ? linesOf(round) : [], language, { next: round ? linesOf(round.after) : [] });
  useEffect(() => lettersVoice.load(pack.praise, language), [pack, language]);

  /** Draws the number after the one drawn last, with other things to count than it; `fresh` right after a step up. */
  const draw = useCallback(
    (fresh = false): Sought => {
      const last = upcoming.current;
      const others = things.filter((t) => t !== last?.thing);
      const thing = pick(others.length > 0 ? others : things);
      upcoming.current = { n: drawNumber(pace.current.step, last?.n ?? null, fresh), thing };
      return upcoming.current;
    },
    [things],
  );

  /** The next round; after a find (`queue`) its question waits for the praise instead of cutting it off. */
  const nextRound = useCallback(
    (queue = false, fresh = false) => {
      // Right after a step up, the number drawn ahead is drawn again from the new numbers.
      const first = fresh || !upcoming.current ? draw(fresh) : upcoming.current;
      setComing({ ...first, id: nextId.current++, after: draw(), queue });
    },
    [draw],
  );

  // The number waiting comes on screen once its lines are there.
  useEffect(() => {
    if (!coming || !ready) return;
    setComing(null);
    setCurrent(coming);
    setWrong(0);
    setFound(false);
    ask(coming.queue);
  }, [coming, ready, ask]);

  // Start with a number right away; a new kind of pictures brings a new game (its key in LettersGame).
  useEffect(() => nextRound(), []);

  /** A key was pressed, on the keyboard or on the screen. */
  const pressDigit = useCallback(
    (digit: number | null) => {
      if (!current || found) return softTap();
      const now = performance.now();
      if (now - lastPress.current < MIN_PRESS_MS) return softTap();
      lastPress.current = now;

      if (digit === current.n) {
        setFound(true);
        playChime();
        const sentence = countLine(current);
        // A counting sentence without its recording (a new thing to count) says the number alone.
        say(lettersVoice.has(sentence, language) ? sentence : `${pack.numberWords[current.n]}!`);
        praise(pick(pack.praise));
        const before = pace.current.step;
        pace.current = nextPace(pace.current, wrong);
        later(() => nextRound(true, pace.current.step > before), CELEBRATE_MS);
        return;
      }
      softTap();
      // Every few wrong keys the question comes again, with the key lit once the hint is on.
      if ((wrong + 1) % HINT_AFTER_WRONG === 0) ask();
      setWrong(wrong + 1);
    },
    [current, found, wrong, pack, language, countLine, say, ask, praise, softTap, later, nextRound],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressDigit(digitOf(keyOf(e, pack), e.code));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressDigit, pack]);

  // Frei tippen and Zählen show their keys on every touch screen.
  const touchKeys = useTouchKeys(settings.touchKeys, true);

  const onPlayAreaPointer = (e: PointerEvent) => softTap(e.clientX, e.clientY);
  // Tapping the things asks again.
  const onCardPointer = (e: PointerEvent) => {
    e.stopPropagation();
    if (current && !found) ask();
    softTap(e.clientX, e.clientY);
  };

  const lit = showHint || found ? String(current?.n) : undefined;

  return (
    <div className="letters-play" style={{ background: BACKGROUNDS[(current?.id ?? 0) % BACKGROUNDS.length] }} onPointerDown={onPlayAreaPointer}>
      <div className="stage">
        {current && (
          <div key={current.id} className={`card find-card nf-card${found ? " done" : ""}`} data-tap onPointerDown={onCardPointer}>
            <CountThings n={current.n} thing={current.thing} />
            {/* The key to find, still empty: the digit stands in it once found. */}
            <div className="nf-key" aria-hidden>
              <span>{current.n}</span>
            </div>
          </div>
        )}
      </div>
      {touchKeys ? (
        <TouchKeyboard rows={DIGIT_ROWS} onKey={(key) => pressDigit(digitOf(key, undefined))} highlight={lit} />
      ) : (
        settings.hints && <KeyboardMap rows={DIGIT_MAP} highlight={String(current?.n)} visible={showHint} />
      )}
      <FeedbackLayer effects={effects} />
    </div>
  );
}
