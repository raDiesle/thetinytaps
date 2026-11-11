import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { afterPageMotion } from "@/lib/pageMotion";
import { loadRecordings, playChime, playClick, playKnock, playMelody, playTusch, playTwinkle, playWhoosh, recorded } from "@/lib/sfx";
import { hush } from "@/lib/voice";
import { useWakeLock } from "@/lib/wakeLock";
import { nextPicture, PICTURES, SWAP_NAME } from "./content";
import type { SwapToy, TimeShown, TimerPicture, TurnPicture } from "./settings";
import { TimeShownChoice, TimeShownNote } from "./shown";
import { type Holder, SWAP_TOYS, SwapBackdrop, SwapCushions, SwapHourglass, SwapLight, SwapShade, Toy } from "./swap";
import { Ball, COURT, FLIGHT_MS, Racket, TennisBackdrop, TennisBoard, TennisPlayers, tennisStyle } from "./tennis";
import { TimeLeft } from "./TimerPlay";
import { BEGINS, TURN_LINES, TURN_TO, timerLoad, timerSay, WHO_BEGINS } from "./voice";

/** Children cheering at the clock time set (a recording, else a flourish). */
const playCheer = recorded("cheer", playTusch);

/**
 * Who begins is drawn by the lamps (user feedback, November 2026: who is first must be plain from the start): they
 * click on and off in turn, these many ms apart, slower and slower, and the last one on is the first child's. An even
 * count, so the lamp lit first is the one that wins.
 */
export const DRAW_STEPS = [240, 250, 270, 300, 350, 420, 520, 660] as const;

/** How long the winning lamp stays on before the toy hops over to its cushion. */
const DRAW_HOLD_MS = 500;

/** How long the toy's hop takes: the first turn starts as it lands. */
const HOP_MS = 1200;

/** Tennis: the hit as the ball leaves a racket ("plock"), and its landing on the other racket, softer. */
function playHit() {
  playKnock(1000);
}
function playLand() {
  playKnock(760);
}

/** The turns so far: counted from `start`, the first one being `first`'s. */
interface Turns {
  start: number;
  first: Holder;
}

/** The turn running at `now`, counted from 0. */
function turnAt(turns: Turns, turnMs: number, now: number) {
  return Math.max(0, Math.floor((now - turns.start) / turnMs));
}

/** The other child. */
const other = (h: Holder): Holder => (h === "fox" ? "bear" : "fox");

/**
 * Abwechseln (H-52): two children take turns with a toy. First the lamps over the two cushions draw who begins; then
 * the toy hops onto that child's cushion under its lamp while the hourglass runs; when the sand is through, the lamps
 * change, the toy hops over to the other cushion with a sound, the hourglass turns itself over, and so on until a
 * grown-up leaves with ✕ – or until the clock time set, then both lamps shine, children cheer and „Nochmal“ and „Weiter“
 * come. Real time like every timer: the turn is worked out from the clock, so a phone that slept shows the right child.
 * Behind ⚙️ grown-ups pick the toy, say whose turn it is (which starts that turn anew) and see the time to the change.
 * Tennis (`picture` "tennis") takes turns the same way: the side in the light is the one with the ball, which the child
 * bounces on its racket until it hits it slowly over the net, and a board's lights go out over the turn.
 */
export function SwapRun({
  picture,
  turnMs,
  totalMs,
  until,
  toy,
  onToy,
  timeShown,
  onShown,
  onAgain,
  onPicture,
}: {
  /** How the turns are shown: the toy between two cushions, or two children playing tennis. */
  picture: TurnPicture;
  /** One child's turn, in ms. */
  turnMs: number;
  /** With a clock time set: how long until then, in ms; otherwise it goes on until a grown-up stops it. */
  totalMs?: number;
  until?: string;
  toy: SwapToy;
  onToy: (toy: SwapToy) => void;
  /** The time to the change in the picture's corner too, or not (behind ⚙️). */
  timeShown: TimeShown;
  onShown: (shown: TimeShown) => void;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
}) {
  const t = useT();
  const [endsAt] = useState(() => (totalMs === undefined ? undefined : Date.now() + totalMs));
  /** The turns, once the lamps have drawn who begins (null while they draw). */
  const [turns, setTurns] = useState<Turns | null>(null);
  /** The lamp on while they draw. */
  const [drawn, setDrawn] = useState<Holder | null>(null);
  const [turn, setTurn] = useState(0);
  /** The first turn has begun (the toy has landed), so the sand runs. */
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [poke, setPoke] = useState(0);
  /** Counts the toy's moves, so it hops each time. */
  const [hop, setHop] = useState(0);
  /** Where the toy or ball came from on its last move (Tennis: the child who hit it swings its racket). */
  const [from, setFrom] = useState<Holder | "middle">("middle");
  const tennis = picture === "tennis";
  /** How long the move onto the first child's place takes: the turn starts as it lands. */
  const moveMs = tennis ? FLIGHT_MS : HOP_MS;
  const holderNow = useRef<Holder | null>(null);
  const drawTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { effects, ripple, glow } = useTapFeedback();
  useWakeLock(!done);
  useEffect(() => loadRecordings(["cheer"]), []);

  // The voice (H-72): „Wer fängt an?“ as the lamps draw, who begins as they have, and „Tauschen! …“ at every change.
  // Silent until recorded; a grown-up leaving with ✕ stops it.
  const language = useAppLanguage().id;
  const say = useCallback((line: Localized, queue = false) => timerSay(line, language, queue), [language]);
  useEffect(() => timerLoad(TURN_LINES, language), [language]);
  useEffect(() => hush, []);

  /** A child's turn begins now (or after the toy's hop): the toy hops over to its cushion with a whoosh and a chime. */
  const begin = useCallback(
    (first: Holder, after: number) => {
      for (const timer of drawTimers.current) clearTimeout(timer);
      drawTimers.current = [];
      setDrawn(null);
      setRunning(false);
      setTurns({ start: Date.now() + after, first });
      setFrom(holderNow.current ?? "middle");
      setHop((n) => n + 1);
      if (tennis) {
        playHit();
        drawTimers.current.push(setTimeout(playLand, FLIGHT_MS));
        return;
      }
      playWhoosh();
      drawTimers.current.push(setTimeout(playChime, 700));
    },
    [tennis],
  );

  // The lamps draw who begins, once the page lies still: on and off in turn with a click, slower and slower.
  useEffect(() => {
    if (endsAt !== undefined && Date.now() >= endsAt) return;
    const winner: Holder = Math.random() < 0.5 ? "fox" : "bear";
    const timers = drawTimers.current;
    const cancel = afterPageMotion(() => {
      let at = 0;
      setDrawn(winner);
      playClick();
      say(WHO_BEGINS);
      DRAW_STEPS.forEach((gap, i) => {
        at += gap;
        timers.push(
          setTimeout(() => {
            setDrawn(i % 2 === 0 ? other(winner) : winner);
            playClick();
          }, at),
        );
      });
      timers.push(
        setTimeout(() => {
          begin(winner, moveMs);
          say(BEGINS[winner], true);
        }, at + DRAW_HOLD_MS),
      );
    });
    return () => {
      cancel();
      for (const timer of drawTimers.current) clearTimeout(timer);
    };
  }, [begin, endsAt, moveMs, say]);

  // The turn, checked at least every second and again when the page comes back (timers sleep in the background).
  useEffect(() => {
    if (done) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const now = Date.now();
      if (endsAt !== undefined && now >= endsAt) return setDone(true);
      if (!turns) {
        timer = setTimeout(check, 1000);
        return;
      }
      setRunning(now >= turns.start);
      const current = turnAt(turns, turnMs, now);
      setTurn(current);
      const nextChange = now < turns.start ? turns.start - now : turns.start + (current + 1) * turnMs - now;
      timer = setTimeout(check, Math.max(50, Math.min(nextChange, 1000)));
    };
    const onVisible = () => {
      clearTimeout(timer);
      check();
    };
    check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [turns, turnMs, endsAt, done]);

  // The toy hops over with a whoosh and a chime as the next turn starts – or the ball is hit over the net with a plock
  // and lands on the other racket.
  const lastTurn = useRef(turn);
  useEffect(() => {
    if (turn === lastTurn.current) return;
    lastTurn.current = turn;
    if (turn === 0) return;
    setFrom(holderNow.current === "fox" ? "bear" : "fox");
    setHop((n) => n + 1);
    // Rendered already, so `holderNow` is the child whose turn it is now.
    if (holderNow.current) say(TURN_TO[holderNow.current]);
    if (tennis) playHit();
    else playWhoosh();
    const timer = setTimeout(tennis ? playLand : playChime, tennis ? FLIGHT_MS : 700);
    return () => clearTimeout(timer);
  }, [turn, tennis, say]);
  // At the clock time set, the end is plain like every timer's: children cheer, then the trophy with the end's buttons.
  useEffect(() => {
    if (!done) return;
    playChime();
    const cheer = setTimeout(playCheer, 700);
    const tune = setTimeout(playMelody, 2500);
    return () => {
      clearTimeout(cheer);
      clearTimeout(tune);
    };
  }, [done]);

  const holder: Holder | null = turns ? ((turn % 2 === 0) === (turns.first === "fox") ? "fox" : "bear") : null;
  holderNow.current = holder;
  /** The lamp that shines: the drawing one, then the child's whose turn it is; at the end both. */
  const lit = (kind: Holder) => done || (holder ?? drawn) === kind;

  /** A tap or a key: the sand still on top lights up (H-51, „Wie lange noch?“) and twinkles; after the end, ripples. */
  const answer = useCallback(
    (x?: number, y?: number) => {
      playTwinkle();
      if (done) return ripple(x, y);
      glow(x, y);
      setPoke((n) => n + 1);
    },
    [done, ripple, glow],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.repeat) return;
      answer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [answer]);

  const down = (e: PointerEvent) => answer(e.clientX, e.clientY);
  const turnStart = turns ? turns.start + turn * turnMs : 0;
  const ticking = running && !done;
  const next = nextPicture(picture);
  const nextInfo = PICTURES.find((p) => p.id === next);
  const name = PICTURES.find((p) => p.id === picture)?.name;
  /** Tennis: the child who has just hit the ball over swings its racket through. */
  const hitter = from !== "middle" && holder && from !== holder ? from : null;

  return (
    <>
      <div className="tm-play" data-picture={picture} onPointerDown={down} role="img" aria-label={name ? t(name) : undefined}>
        {tennis ? (
          <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`} style={tennisStyle()}>
            <TennisBackdrop />
            {(["fox", "bear"] as const).map((kind) => (
              <Racket key={kind} kind={kind} bouncing={holder === kind} swing={hitter === kind ? hop : 0} />
            ))}
            <TennisPlayers />
            {(["fox", "bear"] as const).map((kind) => (
              <SwapShade key={kind} kind={kind} on={!lit(kind)} edge={COURT.net} cross={turns !== null} />
            ))}
            <TennisBoard key={running && turns ? `${turns.start}-${turn}` : "wait"} ms={turnMs} startedAt={turnStart} waiting={!running} glow={poke} />
            <Ball place={holder ?? "middle"} hop={hop} />
            {done && <div className="tm-done-light" />}
          </div>
        ) : (
          <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`}>
            <SwapBackdrop />
            <SwapLight kind="fox" on={lit("fox")} />
            <SwapLight kind="bear" on={lit("bear")} />
            <SwapCushions />
            <SwapShade kind="fox" on={!lit("fox")} />
            <SwapShade kind="bear" on={!lit("bear")} />
            <SwapHourglass
              key={running && turns ? `${turns.start}-${turn}` : "wait"}
              ms={turnMs}
              startedAt={turnStart}
              flip={running && turn > 0}
              waiting={!running}
              glow={poke}
            />
            <Toy toy={toy} place={holder ?? "middle"} hop={hop} />
            {done && <div className="tm-done-light" />}
          </div>
        )}
        {ticking && <TimeShownNote shown={timeShown} endsAt={turnStart + turnMs} total={turnMs} />}
        <FeedbackLayer effects={effects} />
        {done && <GameEnd delayMs={4200} level={picture} onAgain={onAgain} next={nextInfo && { name: t(nextInfo.name), onNext: () => onPicture(next) }} />}
      </div>
      <PlayOptions>
        <SettingsGroup title={t(SWAP_NAME)}>
          {!tennis && (
            <Choice
              label={t({ de: "Spielzeug", en: "Toy", zh: "玩具", hi: "खिलौना", es: "Juguete", ar: "اللعبة", ru: "Игрушка" })}
              value={toy}
              onChange={onToy}
              options={SWAP_TOYS.map((s) => ({ value: s.id, label: `${s.emoji} ${t(s.name)}` }))}
            />
          )}
          <Choice
            label={t({
              de: "Wer ist dran?",
              en: "Whose turn?",
              zh: "轮到谁了？",
              hi: "किसकी बारी?",
              es: "¿A quién le toca?",
              ar: "دور مَن؟",
              ru: "Чья очередь?",
            })}
            value={holder ?? drawn ?? "fox"}
            // Starts that child's turn anew, with a full hourglass: for who begins, or to set it right.
            onChange={(first: Holder) => {
              begin(first, 0);
              say(TURN_TO[first]);
            }}
            options={[
              {
                value: "fox",
                label: t({
                  de: "🦊 Fuchskind",
                  en: "🦊 Little fox",
                  zh: "🦊 小狐狸",
                  hi: "🦊 लोमड़ी का बच्चा",
                  es: "🦊 Zorrito",
                  ar: "🦊 الثعلب الصغير",
                  ru: "🦊 Лисёнок",
                }),
              },
              {
                value: "bear",
                label: t({
                  de: "🐻 Bärenkind",
                  en: "🐻 Little bear",
                  zh: "🐻 小熊",
                  hi: "🐻 भालू का बच्चा",
                  es: "🐻 Osito",
                  ar: "🐻 الدبّ الصغير",
                  ru: "🐻 Медвежонок",
                }),
              },
            ]}
          />
        </SettingsGroup>
        {ticking && (
          <TimeLeft
            endsAt={turnStart + turnMs}
            title={t({
              de: "Bis zum Wechsel",
              en: "Until the switch",
              zh: "距离换人",
              hi: "बारी बदलने तक",
              es: "Hasta el cambio",
              ar: "حتى التبديل",
              ru: "До смены",
            })}
          />
        )}
        {endsAt !== undefined && <TimeLeft endsAt={endsAt} until={until} />}
        <TimeShownChoice value={timeShown} onChange={onShown} />
      </PlayOptions>
    </>
  );
}
