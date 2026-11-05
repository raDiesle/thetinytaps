import { memo, type PointerEvent, type RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { Mascot, type MascotKind } from "@/components/Mascot";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyOf } from "@/content/languages";
import type { Action, LanguagePack } from "@/content/types";
import { playChime, playClap, playCountNote, playHop, playRandomNote, playStamp } from "@/lib/sfx";
import { useAppLanguage, useT, type Localized } from "@/lib/language";
import { lettersVoice, useLettersSay } from "./voice";
import type { LettersSettings } from "./settings";
import "./move.css";

/** The three ways a number is done with the body, taking turns: hop, clap, stamp. */
export type Move = "hop" | "clap" | "stomp";

/** The moves in their turn. */
export const MOVES: Move[] = ["hop", "clap", "stomp"];

/** Between the invitation („Hüpf mit!“) and the first hop: time to get ready. */
const READY_MS = 1400;
/** From one hop (clap, stamp) to the next: long enough for a child to hop along and land (L-15: „wartet bei jedem Sprung“). */
export const BEAT_MS = 1500;
/** After the last one, the chime; keys bring a new number only once it has sounded. */
const DONE_MS = 700;
/** How long one hop, clap or stamp of the figure takes. */
const MOVE_MS = 620;

/** The stamp's invitation; hop and clap take theirs from the language pack's doing words („Hüpf mit!“). */
const STOMP_INVITE: Localized = {
  de: "Stampf mit!",
  ru: "Топай со мной!",
  en: "Now you stomp!",
  zh: "和我一起跺脚！",
  hi: "मेरे साथ पैर पटको!",
  es: "¡Zapatea conmigo!",
  ar: "هيّا نضرب بأقدامنا معا!",
};

/** What a done hop, clap or stamp leaves in the row under the digit: the number as a count of things. */
const MARKS: Record<Move, string> = { hop: "🐾", clap: "👏", stomp: "👣" };

/** The sound of each move, landing with the figure: the hop's landing and the stamp's thump come at the motion's low point. */
const SOUNDS: Record<Move, () => void> = {
  hop: () => playHop((0.86 * MOVE_MS) / 1000),
  clap: () => playClap(),
  stomp: () => playStamp((0.55 * MOVE_MS) / 1000),
};

/** The pack's doing word for a move („Hüpf“, „Klatsch“), when it has one. */
const actionOf = (move: Move): Action | null => (move === "stomp" ? null : move);

/** What is on screen: a number, the move it is done with, how many are done so far, and the family doing it. */
interface Round {
  id: number;
  n: number;
  move: Move;
  done: number;
  kind: MascotKind;
}

/** The figure's motion for each move, played on its own HTML layer (never inside its svg). */
const KID_MOTION: Record<Move, Keyframe[]> = {
  hop: [
    { transform: "none", offset: 0 },
    { transform: "translateY(4%) scale(1.04, 0.94)", offset: 0.14 },
    { transform: "translateY(-38%) scale(0.97, 1.04)", offset: 0.5 },
    { transform: "translateY(3%) scale(1.05, 0.93)", offset: 0.86 },
    { transform: "none", offset: 1 },
  ],
  clap: [{ transform: "none" }, { transform: "translateY(-3%) scale(1.02)" }, { transform: "none" }],
  stomp: [
    { transform: "none", offset: 0 },
    { transform: "translateY(-12%) rotate(-5deg)", offset: 0.35 },
    { transform: "translateY(2%) scale(1.04, 0.95)", offset: 0.55 },
    { transform: "none", offset: 1 },
  ],
};

/** Its grown-up standing beside it, still, while the child does the moving. */
const Grown = memo(function Grown({ kind }: { kind: MascotKind }) {
  return <Mascot kind={kind} />;
});

/**
 * Mitmachen (L-15): a digit, or any other key for a number by chance, has a fox or bear child hop, clap or stamp that
 * many times, its grown-up beside it, counting each one aloud. It invites the child first („Hüpf mit!“) and waits at each
 * one, so the child can hop along: the number becomes an amount in its own body.
 */
export function MovePlay({ pack, settings }: { pack: LanguagePack; settings: LettersSettings }) {
  const [round, setRound] = useState<Round | null>(null);
  const { effects, ripple } = useTapFeedback();
  const t = useT();
  const { id: language } = useAppLanguage();
  const say = useLettersSay();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const busyUntil = useRef(0);
  const nextId = useRef(0);
  const nextMove = useRef(0);
  const kid = useRef<HTMLSpanElement>(null);
  const dust = useRef<HTMLSpanElement>(null);
  const clap = useRef<HTMLSpanElement>(null);
  const stand = useRef<HTMLSpanElement>(null);

  const invite = useCallback(
    (move: Move) => {
      const action = actionOf(move);
      const word = action && pack.actions.find((a) => a.action === action);
      // A pack without the doing word (Hindi leaves out clap) has no invitation for it.
      return word ? pack.joinIn(word) : move === "stomp" ? t(STOMP_INVITE) : null;
    },
    [pack, t],
  );

  // The number words and invitations are loaded at once, so even the first round speaks in time with the moves.
  useEffect(() => {
    lettersVoice.load([...pack.numberWords.map((w) => `${w}!`), ...MOVES.flatMap((m) => invite(m) ?? [])], language);
  }, [pack, invite, language]);

  /** The figure does one hop, clap or stamp: its layers move, never its drawing. */
  const act = useCallback((move: Move) => {
    const options = { duration: MOVE_MS, easing: "linear" };
    kid.current?.animate(KID_MOTION[move], options);
    if (move === "clap") {
      const shown = [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }];
      clap.current?.animate(shown, options);
      stand.current?.animate(
        shown.map((k) => ({ ...k, opacity: 1 - (k.opacity as number) })),
        options,
      );
    }
    if (move === "stomp") {
      dust.current?.animate(
        [
          { opacity: 0, transform: "scale(0.4)", offset: 0 },
          { opacity: 0, transform: "scale(0.4)", offset: 0.5 },
          { opacity: 0.6, transform: "scale(0.8)", offset: 0.6 },
          { opacity: 0, transform: "scale(1.4)", offset: 1 },
        ],
        { duration: MOVE_MS + 300, easing: "ease-out" },
      );
    }
  }, []);

  const stop = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /** Starts a round: the digit and its empty marks, the invitation, then one move per beat, each counted aloud. */
  const start = useCallback(
    (n: number, move: Move, kind: MascotKind) => {
      stop();
      const id = nextId.current++;
      setRound({ id, n, move, done: 0, kind });
      if (n === 0) {
        // Zero times: nothing to do, only the word.
        say(`${pack.numberWords[0]}!`);
        busyUntil.current = performance.now() + DONE_MS;
        return;
      }
      const line = invite(move);
      if (line) say(line);
      for (let k = 1; k <= n; k++) {
        timers.current.push(
          setTimeout(
            () => {
              act(move);
              if (settings.sounds) {
                SOUNDS[move]();
                playCountNote(k - 1);
              }
              say(`${pack.numberWords[k]}!`, true);
              setRound((r) => (r?.id === id ? { ...r, done: k } : r));
            },
            READY_MS + (k - 1) * BEAT_MS,
          ),
        );
      }
      const end = READY_MS + (n - 1) * BEAT_MS + DONE_MS;
      timers.current.push(setTimeout(() => settings.sounds && playChime(), end));
      busyUntil.current = performance.now() + end;
    },
    [stop, say, pack, invite, act, settings.sounds],
  );

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  /** A digit plays its number; any other key a number by chance, never the one on screen. */
  const pressKey = useCallback(
    (key: string) => {
      if (performance.now() < busyUntil.current) {
        softTap();
        return;
      }
      const others = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => n !== round?.n);
      const n = /^[0-9]$/.test(key) ? Number(key) : others[Math.floor(Math.random() * others.length)];
      const move = MOVES[nextMove.current++ % MOVES.length];
      // Fox or bear by chance, so both come.
      start(n, move, Math.random() < 0.5 ? "fox" : "bear");
    },
    [round, start, softTap],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(keyOf(e, pack));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey, pack]);

  useEffect(() => stop, [stop]);

  const touchKeys = useTouchKeys(settings.touchKeys, true);
  const rows = useMemo(() => keyRows([..."1234567890"]), []);

  /** A tap on the family once it is done: the same number again, the same way. */
  const again = (e: PointerEvent) => {
    e.stopPropagation();
    if (round && performance.now() >= busyUntil.current) start(round.n, round.move, round.kind);
    else softTap(e.clientX, e.clientY);
  };

  const kind = round?.kind ?? "fox";
  return (
    <div className="mv-play" onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      <div className="stage">
        {round === null ? (
          <p className="letters-welcome">
            {touchKeys
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
                  de: "Drück eine Taste! ⌨️",
                  ru: "Нажми на клавишу! ⌨️",
                  en: "Press a key! ⌨️",
                  zh: "按一个键吧！⌨️",
                  hi: "कोई बटन दबाओ! ⌨️",
                  es: "¡Pulsa una tecla! ⌨️",
                  ar: "هيّا نضغط على زر! ⌨️",
                })}
          </p>
        ) : (
          <div className="mv-scene">
            <div className="mv-count">
              <span className="mv-digit">{round.n}</span>
              <span className="mv-marks" aria-hidden>
                {Array.from({ length: round.n }, (_, i) => (
                  <span key={`${round.id}-${i}`} className={i < round.done ? "mv-mark mv-done" : "mv-mark"}>
                    {MARKS[round.move]}
                  </span>
                ))}
              </span>
            </div>
            <div className="mv-family" data-tap onPointerDown={again}>
              <span className="mv-grown">
                <Grown kind={kind} />
              </span>
              <span className="mv-kid" ref={kid}>
                <span className="mv-dust" ref={dust} />
                <KidLayers kind={kind} clap={clap} stand={stand} />
              </span>
            </div>
          </div>
        )}
      </div>
      {touchKeys && <TouchKeyboard rows={rows} onKey={pressKey} />}
      <FeedbackLayer effects={effects} />
    </div>
  );
}

/** The child's two pose layers, with refs so the clap can swap them. */
function KidLayers({ kind, clap, stand }: { kind: MascotKind; clap: RefObject<HTMLSpanElement | null>; stand: RefObject<HTMLSpanElement | null> }) {
  return (
    <>
      <span className="mv-pose" ref={stand}>
        <KidPose kind={kind} pose="stand" />
      </span>
      <span className="mv-pose mv-clap" ref={clap}>
        <KidPose kind={kind} pose="clap" />
      </span>
    </>
  );
}

/** One pose of the child, drawn once. */
const KidPose = memo(function KidPose({ kind, pose }: { kind: MascotKind; pose: "stand" | "clap" }) {
  return <Mascot kind={kind} child pose={pose} />;
});
