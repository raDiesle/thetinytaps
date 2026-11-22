import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { afterPageMotion } from "@/lib/pageMotion";
import { loadRecordings, playChime, playKnock, playMelody, playTusch, playTwinkle, playWhoosh, recorded } from "@/lib/sfx";
import { hush } from "@/lib/voice";
import { useWakeLock } from "@/lib/wakeLock";
import { TimeBar, TimeBarChoice } from "./bar";
import { nextPicture, PICTURES, SWAP_NAME } from "./content";
import type { SwapToy, TimeShown, TimerPicture, TurnPicture } from "./settings";
import { TimeShownChoice, TimeShownNote } from "./shown";
import { SAW, Seesaw, SeesawBackdrop, SeesawGoal, SeesawStand, SeesawSun } from "./seesaw";
import { type Holder, SWAP_TOYS, SwapBackdrop, SwapCushions, SwapHourglass, SwapLight, SwapShade, Toy } from "./swap";
import { TimeLeft } from "./TimerPlay";
import { BEGINS, TURN_LINES, TURN_TO, timerLoad, timerSay } from "./voice";

/** Children cheering at the clock time set (a recording, else a flourish). */
const playCheer = recorded("cheer", playTusch);

/**
 * Who begins: the fox child, on the left, always – no draw (user feedback, 21 November 2026: the lamps clicking on and
 * off at random before the turns was a start sequence nobody wanted). The toy or the seat shows it from the first
 * second, and a grown-up gives the other child the first turn behind ⚙️ („Wer ist dran?“).
 */
export const FIRST_TURN: Holder = "fox";

/** How long the toy's hop takes: the first turn starts as it lands. */
const HOP_MS = 1200;

/** The turns so far: counted from `start`, the first one being `first`'s. */
interface Turns {
  start: number;
  first: Holder;
}

/** The turn running at `now`, counted from 0. */
function turnAt(turns: Turns, turnMs: number, now: number) {
  return Math.max(0, Math.floor((now - turns.start) / turnMs));
}

/**
 * Abwechseln (H-52): two children take turns with a toy. The fox child begins (`FIRST_TURN`): its lamp is on from the
 * first second and the toy hops onto its cushion while the hourglass runs; when the sand is through, the lamps
 * change, the toy hops over to the other cushion with a sound, the hourglass turns itself over, and so on until a
 * grown-up leaves with ✕ – or until the clock time set, then both lamps shine, children cheer and „Nochmal“ and „Weiter“
 * come. Real time like every timer: the turn is worked out from the clock, so a phone that slept shows the right child.
 * Behind ⚙️ grown-ups pick the toy, say whose turn it is (which starts that turn anew) and see the time to the change.
 * The Wippe (`picture` "seesaw", H-109) takes turns the same way, without a toy: the side in the sun is the one whose
 * seat sinks the whole turn long, as a chick walks over to it, until it touches down; then the chick turns round and
 * walks back to the other seat, now up high.
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
  bar,
  onBar,
  onAgain,
  onPicture,
}: {
  /** The picture of taking turns: the toy between two cushions, or on a seesaw. */
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
  /** The bar along the bottom, filling once a turn in the colour of the child whose turn it is (behind ⚙️). */
  bar: boolean;
  onBar: (bar: boolean) => void;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
}) {
  const t = useT();
  const [endsAt] = useState(() => (totalMs === undefined ? undefined : Date.now() + totalMs));
  /** The turns, once the page lies still (null while it still turns). */
  const [turns, setTurns] = useState<Turns | null>(null);
  const [turn, setTurn] = useState(0);
  /** The first turn has begun (the toy has landed), so the sand runs and the chick walks. */
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [poke, setPoke] = useState(0);
  /** Counts the toy's moves (Abwechseln), so it hops each time. */
  const [hop, setHop] = useState(0);
  /** Counts the starts of the turns (the draw's end, a grown-up giving the turn), so the seesaw's motion starts anew. */
  const [round, setRound] = useState(0);
  const seesaw = picture === "seesaw";
  const holderNow = useRef<Holder | null>(null);
  const startTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { effects, ripple, glow } = useTapFeedback();
  useWakeLock(!done);
  useEffect(() => loadRecordings(["cheer"]), []);

  // The voice (H-72): who begins as the turns start, and „Tauschen! …“ at every change.
  // Silent until recorded; a grown-up leaving with ✕ stops it.
  const language = useAppLanguage().id;
  const say = useCallback((line: Localized, queue = false) => timerSay(line, language, queue), [language]);
  useEffect(() => timerLoad(TURN_LINES, language), [language]);
  useEffect(() => hush, []);

  /** A child's turn begins now (or after the toy's hop): the toy hops over to its cushion with a whoosh and a chime. */
  const begin = useCallback(
    (first: Holder, after: number) => {
      for (const timer of startTimers.current) clearTimeout(timer);
      startTimers.current = [];
      setRunning(false);
      setTurns({ start: Date.now() + after, first });
      setRound((n) => n + 1);
      setHop((n) => n + 1);
      if (!seesaw) playWhoosh();
      startTimers.current.push(setTimeout(playChime, seesaw ? 0 : 700));
    },
    [seesaw],
  );

  // The first child's turn starts as soon as the page lies still: the toy hops onto its cushion (on the seesaw, whose
  // first seat already stands up high, the chick sets off at once).
  useEffect(() => {
    if (endsAt !== undefined && Date.now() >= endsAt) return;
    const cancel = afterPageMotion(() => {
      begin(FIRST_TURN, seesaw ? 0 : HOP_MS);
      say(BEGINS[FIRST_TURN], true);
    });
    return () => {
      cancel();
      for (const timer of startTimers.current) clearTimeout(timer);
    };
  }, [begin, endsAt, say, seesaw]);

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

  // The toy hops over with a whoosh and a chime as the next turn starts – on the seesaw the seat touches down with a soft
  // bump and a chime, and the chick turns round.
  const lastTurn = useRef(turn);
  useEffect(() => {
    if (turn === lastTurn.current) return;
    lastTurn.current = turn;
    if (turn === 0) return;
    setHop((n) => n + 1);
    // Rendered already, so `holderNow` is the child whose turn it is now.
    if (holderNow.current) say(TURN_TO[holderNow.current]);
    if (seesaw) playKnock(320);
    else playWhoosh();
    const timer = setTimeout(playChime, 700);
    return () => clearTimeout(timer);
  }, [turn, say, seesaw]);
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
  /** Whose side is shown as having the turn: before the first turn starts (the page still turning), the first child's. */
  const shown = holder ?? FIRST_TURN;
  /** The lamp that shines: the child's whose turn it is; at the end both. */
  const lit = (kind: Holder) => done || shown === kind;

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

  return (
    <>
      <div className={`tm-play${bar ? " tm-with-bar" : ""}`} data-picture={picture} onPointerDown={down} role="img" aria-label={name ? t(name) : undefined}>
        {seesaw ? (
          <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`}>
            <SeesawBackdrop />
            {(["fox", "bear"] as const).map((kind) => (
              <SeesawSun key={kind} kind={kind} on={lit(kind)} />
            ))}
            {(["fox", "bear"] as const).map((kind) => (
              <SwapShade key={kind} kind={kind} on={!lit(kind)} edge={SAW.x} />
            ))}
            {holder && ticking && <SeesawGoal kind={holder} n={poke} />}
            <SeesawStand />
            <Seesaw
              holder={shown}
              running={ticking}
              first={turns?.first ?? FIRST_TURN}
              turnMs={turnMs}
              startedAt={turns?.start ?? 0}
              round={round}
              level={done}
            />
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
        {bar && ticking && holder && <TimeBar key={`${turnStart}-${turn}`} startedAt={turnStart} total={turnMs} tone={holder} glow={poke} />}
        {ticking && <TimeShownNote shown={timeShown} endsAt={turnStart + turnMs} total={turnMs} />}
        <FeedbackLayer effects={effects} />
        {done && <GameEnd delayMs={4200} level={picture} onAgain={onAgain} next={nextInfo && { name: t(nextInfo.name), onNext: () => onPicture(next) }} />}
      </div>
      <PlayOptions>
        <SettingsGroup title={t(SWAP_NAME)}>
          {!seesaw && (
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
            value={shown}
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
        <TimeBarChoice value={bar} onChange={onBar} />
      </PlayOptions>
    </>
  );
}
