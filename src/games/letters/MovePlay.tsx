import { type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { TouchKeyboard, keyRows, useTouchKeys } from "@/components/TouchKeyboard";
import { keyOf } from "@/content/languages";
import type { Action, LanguagePack } from "@/content/types";
import { playChime, playClap, playCountNote, playHop, playStamp } from "@/lib/sfx";
import { useAppLanguage, useT, type Localized } from "@/lib/language";
import { lettersVoice, useLettersSay } from "./voice";
import type { LettersSettings } from "./settings";
import pictureFiles from "./bilder/*.webp?glob";
import "./move.css";
import { useSoftTap } from "./softTap";

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
export const STOMP_INVITE: Localized = {
  de: "Stampf mit!",
  ru: "Топай со мной!",
  en: "Now you stomp!",
  zh: "和我一起跺脚！",
  hi: "मेरे साथ पैर पटको!",
  es: "¡Zapatea conmigo!",
  ar: "هيّا نضرب بأقدامنا معا!",
};

/** Who does the moves: a fox or a bear child, by chance, so both come. */
type Kind = "fox" | "bear";

/** The file names' words for the kinds and moves (`bilder/fuchs-huepfen.webp`, `bilder/zeichen-klatschen-2.webp`). */
const KIND_FILE: Record<Kind, string> = { fox: "fuchs", bear: "baer" };
const MOVE_FILE: Record<Move, string> = { hop: "huepfen", clap: "klatschen", stomp: "stampfen" };

/** The url of a picture in `bilder/` (Gemini, `/bild-erzeugen`), by its name without `.webp`. */
const picture = (name: string) => pictureFiles[`${name}.webp`] as string;

/**
 * The child's two pictures for a move: standing ready, then the move itself (in the air, paws together, knee up) –
 * the standing one is the first picture of all three moves.
 */
const kidFrames = (kind: Kind, move: Move) => [picture(`${KIND_FILE[kind]}-stehen`), picture(`${KIND_FILE[kind]}-${MOVE_FILE[move]}`)];

/**
 * The symbol of a move in the row under the digit, in its two pictures: before (paws apart, shoe lifted) while still
 * to do, and the move done (paws together, shoe down) once done – the number as a count of things.
 */
const markFrames = (move: Move) => [picture(`zeichen-${MOVE_FILE[move]}-1`), picture(`zeichen-${MOVE_FILE[move]}-2`)];

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
  kind: Kind;
}

/**
 * When the move's own picture shows during one move (the rest of it the standing one): in the air from take-off to
 * landing, the paws together at the clap, the knee up until the foot comes down.
 */
const MOVE_SHOWN: Record<Move, [number, number]> = { hop: [0.12, 0.86], clap: [0.3, 0.6], stomp: [0, 0.5] };

/** The figure's motion for each move, played on its own HTML layer round its two pictures. */
const KID_MOTION: Record<Move, Keyframe[]> = {
  hop: [
    { transform: "none", offset: 0 },
    { transform: "translateY(4%) scale(1.04, 0.94)", offset: 0.14 },
    { transform: "translateY(-24%) scale(0.97, 1.04)", offset: 0.5 },
    { transform: "translateY(3%) scale(1.05, 0.93)", offset: 0.86 },
    { transform: "none", offset: 1 },
  ],
  clap: [{ transform: "none" }, { transform: "translateY(-3%) scale(1.02)" }, { transform: "none" }],
  stomp: [
    { transform: "none", offset: 0 },
    { transform: "translateY(-4%) rotate(-3deg)", offset: 0.35 },
    { transform: "translateY(2%) scale(1.04, 0.95)", offset: 0.55 },
    { transform: "none", offset: 1 },
  ],
};

/**
 * Mitmachen (L-15): a digit, or any other key for a number by chance, has a fox or bear child hop, clap or stamp that
 * many times, counting each one aloud. It invites the child first („Hüpf mit!“) and waits at each
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
  const moving = useRef<HTMLImageElement>(null);
  const stand = useRef<HTMLImageElement>(null);

  const invite = useCallback(
    (move: Move) => {
      const action = actionOf(move);
      const word = action && pack.actions.find((a) => a.action === action);
      // A pack without the doing word (Hindi leaves out clap) has no invitation for it.
      return word ? pack.joinIn(word) : move === "stomp" ? t(STOMP_INVITE) : null;
    },
    [pack, t],
  );

  // All pictures are fetched at once, so no round's child or symbols pop in empty.
  useEffect(() => {
    for (const src of Object.values(pictureFiles)) new Image().src = src as string;
  }, []);

  // The number words and invitations are loaded at once, so even the first round speaks in time with the moves.
  useEffect(() => {
    lettersVoice.load([...pack.numberWords.map((w) => `${w}!`), ...MOVES.flatMap((m) => invite(m) ?? [])], language);
  }, [pack, invite, language]);

  /** The figure does one hop, clap or stamp: its layer moves and its move's picture shows over the standing one. */
  const act = useCallback((move: Move) => {
    const options = { duration: MOVE_MS, easing: "linear" };
    kid.current?.animate(KID_MOTION[move], options);
    const [from, to] = MOVE_SHOWN[move];
    // A hard cut between the two pictures, as in a flip book: a cross-fade would show both children at once.
    const shown = [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: from },
      { opacity: 1, offset: from },
      { opacity: 1, offset: to },
      { opacity: 0, offset: to },
      { opacity: 0, offset: 1 },
    ];
    moving.current?.animate(shown, options);
    stand.current?.animate(
      shown.map((k) => ({ ...k, opacity: 1 - k.opacity })),
      options,
    );
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
    (n: number, move: Move, kind: Kind) => {
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

  const softTap = useSoftTap(ripple, settings.sounds);

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
                  <img
                    key={`${round.id}-${i}`}
                    className={i < round.done ? "mv-mark mv-done" : "mv-mark"}
                    src={markFrames(round.move)[i < round.done ? 1 : 0]}
                    alt=""
                    draggable={false}
                  />
                ))}
              </span>
            </div>
            <div className="mv-family" data-tap onPointerDown={again}>
              <span className="mv-kid" ref={kid}>
                <span className="mv-dust" ref={dust} />
                <img className="mv-pose" ref={stand} src={kidFrames(round.kind, round.move)[0]} alt="" draggable={false} />
                <img className="mv-pose mv-moving" ref={moving} src={kidFrames(round.kind, round.move)[1]} alt="" draggable={false} />
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
