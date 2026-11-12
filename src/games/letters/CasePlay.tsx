import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { keyMatches, keyOf, toLower } from "@/content/languages";
import type { LanguagePack, LetterEntry } from "@/content/types";
import type { Localized } from "@/lib/language";
import { playChime } from "@/lib/sfx";
import { ASIDE_LINE_GAP_MS, repeatPause } from "@/lib/spacing";
import { screenChanged } from "@/lib/tapGuard";
import { tapState } from "@/lib/tapTargets";
import { useVoiceReady } from "@/lib/voiceReady";
import type { LettersSettings } from "./settings";
import { useSoftTap } from "./softTap";
import { lettersVoice } from "./voice";
import "./case.css";

/** How long the child letter takes to walk over to its big letter. */
const WALK_MS = 1200;
/** How long the two stand together, holding hands, before the next big letter comes by itself. */
const TOGETHER_MS = 1800;
/** Rounds found with the first tap in a row before the small letters to choose from look alike (b d p). */
const ALIKE_AFTER = 3;
/** After this many wrong taps in a round, the right small letter glows. */
const HINT_AFTER_WRONG = 2;

/**
 * „Wo ist das kleine b?“, asked for each big letter. German only for now: the other languages ask nothing until their
 * line is written and recorded (root CLAUDE.md) – the letter's name is still said when it is found.
 */
export const SMALL_PROMPT: Partial<Localized<(spoken: string) => string>> = {
  de: (spoken) => `Wo ist das kleine ${spoken}?`,
};

/**
 * Small letters that look alike, by script: in a harder round one of them stands next to the right one (b next to d),
 * in an easy round none does, so the three are plainly different (b, o, x).
 */
const ALIKE: string[][] = [
  ["b", "d", "p", "q"],
  ["m", "n", "u", "h", "r"],
  ["i", "j", "l", "t", "f"],
  ["a", "o", "c", "e", "g"],
  ["v", "w", "y", "x", "k"],
  ["s", "z"],
  ["б", "в", "ь", "ъ", "ы", "р"],
  ["п", "н", "и", "й", "л", "м"],
  ["ш", "щ", "ц"],
  ["е", "ё", "э", "з", "с", "о"],
  ["к", "ж", "х"],
  ["у", "ч", "г", "т"],
];

/** The letters the game asks for: those with a big and a small form, none with marks over them (Ö, Й), whose dots would crowd the eyes. */
export const caseLetters = (pack: LanguagePack) =>
  pack.letters.filter((l) => l.upper !== l.lower && toLower(l.upper, pack) === l.lower && l.upper.normalize("NFD").length === 1);

/** The group of look-alikes a small letter belongs to (its plain form: ä counts as a). */
const groupOf = (lower: string) => ALIKE.findIndex((group) => group.includes(lower) || group.includes(lower.normalize("NFD")[0]));

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * The three small letters for `letter`: its own and two others, never one whose big letter is the same. Easy: none of
 * the others looks like it nor like each other; `alike`: one of them looks like it, where its script has one.
 */
export function choicesFor(letter: LetterEntry, letters: LetterEntry[], alike: boolean): LetterEntry[] {
  const others = shuffle(letters.filter((l) => l.lower !== letter.lower && l.upper !== letter.upper));
  const own = groupOf(letter.lower);
  const picked: LetterEntry[] = [];
  if (alike && own >= 0) {
    const twin = others.find((l) => groupOf(l.lower) === own);
    if (twin) picked.push(twin);
  }
  for (const l of others) {
    if (picked.length === 2) break;
    if (picked.includes(l)) continue;
    const group = groupOf(l.lower);
    // In an easy round each small letter looks different from the others; an unknown shape counts as different.
    const clash = group >= 0 && (group === own || picked.some((p) => groupOf(p.lower) === group));
    if (!clash) picked.push(l);
  }
  // A small alphabet may not have enough plainly different letters: fill up with any.
  for (const l of others) if (picked.length < 2 && !picked.includes(l)) picked.push(l);
  return shuffle([letter, ...picked]);
}

/** One round: the big letter, its three small letters to choose from, and the round after it (its lines load meanwhile). */
type Round = { id: number; letter: LetterEntry; choices: LetterEntry[]; next: LetterEntry };

/**
 * „Wo ist das kleine b?“ (L-23): a big letter with eyes looks for its child. Three small letters stand below, only one
 * belongs to it; tapped (or its key pressed), it walks over to the big one and they hold hands. A wrong one shakes its
 * head. First the three look plainly different, then – once the child finds them at the first tap – alike (b, d, p).
 */
export function CasePlay({ pack, language, settings }: { pack: LanguagePack; language: string; settings: LettersSettings }) {
  const letters = useMemo(() => caseLetters(pack), [pack]);
  const [round, setRound] = useState<Round | null>(null);
  const [coming, setComing] = useState<Round | null>(null);
  /** The small letters tapped wrongly this round. */
  const [wrong, setWrong] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const { effects, ripple, glow } = useTapFeedback();
  const softTap = useSoftTap(ripple, settings.sounds);

  const nextId = useRef(0);
  const deck = useRef<LetterEntry[]>([]);
  /** Rounds found with the first tap in a row, and whether the small letters look alike now. */
  const streak = useRef(0);
  const alike = useRef(false);
  const upcoming = useRef<LetterEntry | null>(null);
  const askAgain = useMemo(() => repeatPause(), []);

  const prompt = SMALL_PROMPT[language as keyof typeof SMALL_PROMPT];
  const linesOf = useCallback((letter: LetterEntry) => [...(prompt ? [prompt(letter.spoken)] : []), `${letter.spoken}!`], [prompt]);
  const say = useCallback((text: string, queue = false) => lettersVoice.say(text, language, { queue }), [language]);
  /** A line that only accompanies the play, after what is said and at most every `ASIDE_LINE_GAP_MS` (root CLAUDE.md). */
  const aside = useCallback((text: string) => lettersVoice.say(text, language, { queue: true, gap: ASIDE_LINE_GAP_MS }), [language]);

  const draw = useCallback(() => {
    if (deck.current.length === 0) deck.current = shuffle(letters);
    return deck.current.pop()!;
  }, [letters]);

  const nextRound = useCallback(() => {
    const letter = upcoming.current ?? draw();
    const next = draw();
    upcoming.current = next;
    setComing({ id: nextId.current++, letter, choices: choicesFor(letter, letters, alike.current), next });
  }, [draw, letters]);

  const shown = coming ?? round;
  const ready = useVoiceReady(lettersVoice, shown ? linesOf(shown.letter) : [], language, { next: shown ? linesOf(shown.next) : [] });
  useEffect(() => lettersVoice.load(pack.praise, language), [pack, language]);

  // The waiting round comes on screen once its lines are there, and the big letter asks for its child.
  useEffect(() => {
    if (!coming || !ready) return;
    setComing(null);
    setRound(coming);
    setWrong([]);
    setFound(false);
    screenChanged();
    if (prompt) say(prompt(coming.letter.spoken), true);
  }, [coming, ready, prompt, say]);

  useEffect(() => nextRound(), [nextRound]);

  // Together for a moment after the walk, then the next big letter comes by itself.
  useEffect(() => {
    if (!found) return;
    const timer = setTimeout(nextRound, WALK_MS + TOGETHER_MS);
    return () => clearTimeout(timer);
  }, [found, nextRound]);

  /** Where the child letter stood in the row as it was tapped, so it can walk from there to its place beside the big one. */
  const from = useRef<DOMRect | null>(null);
  const child = useRef<HTMLSpanElement>(null);
  const pair = useRef<HTMLDivElement>(null);
  const choiceRefs = useRef(new Map<string, HTMLSpanElement>());

  // The walk: drawn at once in its place beside the big letter, it starts where it stood and steps over in little hops.
  useLayoutEffect(() => {
    const element = child.current;
    const start = from.current;
    if (!found || !element || !start) return;
    const end = element.getBoundingClientRect();
    const dx = start.left + start.width / 2 - (end.left + end.width / 2);
    const dy = start.bottom - end.bottom;
    const hops = 4;
    const frames: Keyframe[] = [];
    for (let i = 0; i <= hops * 2; i++) {
      const left = 1 - i / (hops * 2);
      const up = i % 2 === 1 ? -0.12 : 0;
      frames.push({ transform: `translate(${dx * left}px, calc(${dy * left}px + ${up}em))` });
    }
    element.animate(frames, { duration: WALK_MS, easing: "linear" });
    // Arrived, they hold hands and sway together once.
    pair.current?.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(-4deg)" }, { transform: "rotate(4deg)" }, { transform: "rotate(0deg)" }], {
      duration: 900,
      delay: WALK_MS,
      easing: "ease-in-out",
    });
  }, [found]);

  /** A small letter was chosen, by a tap or its key. */
  const choose = useCallback(
    (choice: LetterEntry, x?: number, y?: number) => {
      if (!round || found) {
        softTap(x, y);
        return;
      }
      const element = choiceRefs.current.get(choice.lower);
      if (choice === round.letter) {
        from.current = element?.getBoundingClientRect() ?? null;
        glow(x, y);
        setFound(true);
        if (settings.sounds) setTimeout(playChime, WALK_MS);
        say(`${choice.spoken}!`);
        aside(pack.praise[Math.floor(Math.random() * pack.praise.length)]);
        // Found at the first tap: after a few in a row the small letters look alike.
        streak.current = wrong.length === 0 ? streak.current + 1 : 0;
        if (streak.current >= ALIKE_AFTER) alike.current = true;
        return;
      }
      // The wrong one shakes its head; no error sound, only the soft note of a tap.
      softTap(x, y);
      element?.animate([{ rotate: "0deg" }, { rotate: "-12deg" }, { rotate: "10deg" }, { rotate: "-6deg" }, { rotate: "0deg" }], {
        duration: 600,
        easing: "ease-in-out",
      });
      if (!wrong.includes(choice.lower)) setWrong([...wrong, choice.lower]);
      // A wrong choice among look-alikes: the next rounds are plainly different again.
      streak.current = 0;
      alike.current = false;
    },
    [round, found, wrong, softTap, glow, say, aside, settings.sounds, pack],
  );

  // A key of one of the three small letters chooses it; any other key only ripples.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      e.preventDefault();
      if (e.repeat) return;
      const key = keyOf(e, pack);
      const choice = round?.choices.find((c) => keyMatches(key, c.upper, pack));
      if (choice) choose(choice);
      else softTap();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [round, choose, softTap, pack]);

  // Tapping the big letter asks again (after a pause when tapped again and again).
  const onBig = (e: PointerEvent) => {
    e.stopPropagation();
    softTap(e.clientX, e.clientY, true);
    if (round && !found && prompt && askAgain.pass(round.letter.upper)) say(prompt(round.letter.spoken));
  };

  const hint = wrong.length >= HINT_AFTER_WRONG;

  return (
    <div className="cs-play" onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      {round && (
        <div key={round.id} className="cs-scene">
          <div className="cs-home">
            <div ref={pair} className="cs-pair">
              <span className="cs-big" data-tap onPointerDown={onBig} aria-label={prompt?.(round.letter.spoken) ?? round.letter.upper}>
                {round.letter.upper}
                <Eyes />
              </span>
              <svg className={`cs-hands${found ? " held" : ""}`} viewBox="0 0 40 24" aria-hidden>
                <path d="M0 4 Q10 20 20 16 Q30 20 40 8" />
                <circle cx="20" cy="16" r="6" />
              </svg>
              {/* The place the child letter walks to: kept free until it is found, so nothing moves when it comes. */}
              <span className="cs-spot">
                {found && (
                  <span ref={child} className="cs-small cs-child">
                    {round.letter.lower}
                    <Eyes small />
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="cs-row">
            {round.choices.map((c) => {
              const right = c === round.letter;
              return (
                <span
                  key={c.lower}
                  ref={(element) => {
                    if (element) choiceRefs.current.set(c.lower, element);
                    else choiceRefs.current.delete(c.lower);
                  }}
                  className={`cs-small cs-choice${found && right ? " gone" : ""}${hint && right && !found ? " hint" : ""}`}
                  data-tap={tapState({ goal: right, done: wrong.includes(c.lower) })}
                  aria-label={c.lower}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    choose(c, e.clientX, e.clientY);
                  }}
                >
                  {c.lower}
                  <Eyes small />
                </span>
              );
            })}
          </div>
        </div>
      )}
      <FeedbackLayer effects={effects} />
    </div>
  );
}

/** Two still eyes on a letter: at cap height on the big one, at x-height on a small one. */
function Eyes({ small = false }: { small?: boolean }) {
  return (
    <span className={`cs-eyes${small ? " small" : ""}`} aria-hidden>
      <span />
      <span />
    </span>
  );
}
