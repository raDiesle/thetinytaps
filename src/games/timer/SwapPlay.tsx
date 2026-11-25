import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { type Texts, useAppLanguage, useT } from "@/lib/language";
import { afterPageMotion } from "@/lib/pageMotion";
import { loadRecordings, playChime, playKnock, playMelody, playTusch, playTwinkle, playWhoosh, recorded } from "@/lib/sfx";
import { hush } from "@/lib/voice";
import { useWakeLock } from "@/lib/wakeLock";
import { TimeBar, TimeBarChoice, TimeUp } from "./bar";
import { nextPicture, PICTURES, SWAP_NAME } from "./content";
import { TimerCardArt } from "./cardArt";
import type { Players, TimeShown, TimerPicture, TurnCount, TurnPicture } from "./settings";
import { PauseControls, RunClockProvider, usePausableClock } from "./pause";
import { noteRoom, TimeShownChoice, TimeShownNote } from "./shown";
import { MarbleScene } from "./marbleRun";
import { RaceScene } from "./race";
import { KIDS_LABEL } from "./marbleNames";
import { kidLabel, PlayersChoice } from "./players";
import { type Holder, swapPlaces, TURN_CHILDREN, type TurnChild, SwapBackdrop, SwapCushions, SwapHourglass, SwapLights, SwapShades } from "./swap";
import { TimeLeft } from "./TimerPlay";
import { BEGINS, TURN_LINES, TURN_TO, timerLoad, timerSay } from "./voice";

/** Children cheering at the clock time set (a recording, else a flourish). */
const playCheer = recorded("cheer", playTusch);

/**
 * Who begins: the fox child, on the left, always – no draw (user feedback, 21 November 2026: the lamps clicking on and
 * off at random before the turns was a start sequence nobody wanted). Its lamp, seat or cup shows it from the first
 * second, and a grown-up gives another child the first turn behind ⚙️ („Wer ist dran?“).
 */
export const FIRST_TURN: Holder = "fox";

/** The turns so far: counted from `start`, the first one being that of the child at `first` (an index into the children). */
interface Turns {
  start: number;
  first: number;
}

/**
 * The children taking turns: two to four in every picture of taking turns (H-115; user request, 25 November 2026),
 * from the fox's on; a count kept from before that is none of them gives two.
 */
export function turnChildren(kids: TurnCount): readonly TurnChild[] {
  return TURN_CHILDREN.slice(0, [2, 3, 4].includes(kids) ? kids : 2);
}

/** The turn running at `now`, counted from 0. */
function turnAt(turns: Turns, turnMs: number, now: number) {
  return Math.max(0, Math.floor((now - turns.start) / turnMs));
}

/**
 * Abwechseln (H-52): two to four children take turns (`kids`, behind ⚙️, two by default; user request, 25 November
 * 2026). The fox child begins (`FIRST_TURN`): its lamp is on from the first second and its cushion puffs itself up and
 * pricks its ears while the hourglass runs; when the sand is through, the next child's lamp comes on, its cushion
 * pricks its ears, the hourglass turns itself over, and so on until a grown-up leaves with ✕ – or until the clock time
 * set, then every lamp shines, children cheer and „Nochmal“ and „Weiter“ come. Real time like every timer: the turn is
 * worked out from the clock, so a phone that slept shows the right child. Behind ⚙️ grown-ups set how many children
 * play, give each its name or photo (`players`, shown on its place), say whose turn it is (which starts that turn anew)
 * and see the time to the change. The Kugelbahn (`picture` "marblerun", H-117 with H-115): at each turn's start the
 * crank winds and the board turns over, and the whole turn long the marble rolls down from the basket now on top into
 * the one at the bottom; the child whose turn it is stands in a glow of light. The Rennstrecke (`picture` "race",
 * H-150): the start light counts down, the one whose turn it is drives one whole lap of a figure-eight track as long as
 * the turn, and at the line it hops out and the next hops in.

 */
export function SwapRun({
  picture,
  turnMs,
  totalMs,
  until,
  kids,
  onKids,
  players,
  onPlayers,
  timeShown,
  onShown,
  bar,
  onBar,
  onAgain,
  onPicture,
}: {
  /** The picture of taking turns: the hourglass between the cushions, the marble run or the race track. */

  picture: TurnPicture;
  /** One child's turn, in ms. */
  turnMs: number;
  /** With a clock time set: how long until then, in ms; otherwise it goes on until a grown-up stops it. */
  totalMs?: number;
  until?: string;
  /** How many children take turns. */
  kids: TurnCount;
  onKids: (kids: TurnCount) => void;
  /** The children's names and photos, set behind ⚙️. */
  players: Players;
  onPlayers: (players: Players) => void;
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
  // The run's own clock (`pause.tsx`): real time less every pause, so a paused turn goes on where it stood.
  const { clock, pause, resume, pausedOnce } = usePausableClock();
  const { now, paused } = clock;
  const [endsAt] = useState(() => (totalMs === undefined ? undefined : now() + totalMs));
  /** The turns, once the page lies still (null while it still turns). */
  const [turns, setTurns] = useState<Turns | null>(null);
  const [turn, setTurn] = useState(0);
  /** The first turn has begun (the first marble has landed), so the sand runs and the chick walks. */
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [poke, setPoke] = useState(0);
  /** Counts the starts of the turns (the first, a grown-up giving the turn), so the marble's or the kart's motion starts anew. */

  const [round, setRound] = useState(0);
  const marble = picture === "marblerun";
  const race = picture === "race";
  const children = useMemo(() => turnChildren(kids), [kids]);
  const count = children.length;
  /** Counts the page coming back into view, so the rolling marble is drawn anew where it really is. */
  const [wake, setWake] = useState(0);
  const holderNow = useRef<TurnChild | null>(null);
  const startTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { effects, ripple, glow } = useTapFeedback();
  useWakeLock(!done && !paused);
  useEffect(() => loadRecordings(["cheer"]), []);

  // The voice (H-72): who begins as the turns start, and „Tauschen! …“ at every change.
  // Silent until recorded; a grown-up leaving with ✕ stops it.
  const language = useAppLanguage().id;
  const say = useCallback((line: Texts, queue = false) => timerSay(line, language, queue), [language]);
  useEffect(() => timerLoad(TURN_LINES, language), [language]);
  useEffect(() => hush, []);

  /**
   * The child at `first` begins its turn now: a chime as its cushion pricks its ears, or the Kugelbahn's board turns
   * over with a whoosh.

   */
  const begin = useCallback(
    (first: number, after: number) => {
      for (const timer of startTimers.current) clearTimeout(timer);
      startTimers.current = [];
      setRunning(false);
      setTurns({ start: now() + after, first });
      setRound((n) => n + 1);
      if (marble) playWhoosh();
      startTimers.current.push(setTimeout(playChime, marble ? 700 : 0));
    },
    [marble, now],
  );

  // The first child's turn starts as soon as the page lies still: its cushion pricks its ears (the kart and the
  // Kugelbahn's board set off at once).
  useEffect(() => {
    if (endsAt !== undefined && now() >= endsAt) return;
    const cancel = afterPageMotion(() => {
      begin(0, 0);

      say(BEGINS[FIRST_TURN], true);
    });
    return () => {
      cancel();
      for (const timer of startTimers.current) clearTimeout(timer);
    };
  }, [begin, endsAt, say, marble, now]);

  // The turn, checked at least every second and again when the page comes back (timers sleep in the background);
  // paused, not at all.
  useEffect(() => {
    if (done || paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const at = now();
      if (endsAt !== undefined && at >= endsAt) return setDone(true);
      if (!turns) {
        timer = setTimeout(check, 1000);
        return;
      }
      setRunning(at >= turns.start);
      const current = turnAt(turns, turnMs, at);
      setTurn(current);
      const nextChange = at < turns.start ? turns.start - at : turns.start + (current + 1) * turnMs - at;
      timer = setTimeout(check, Math.max(50, Math.min(nextChange, 1000)));
    };
    const onVisible = () => {
      clearTimeout(timer);
      check();
      if (document.visibilityState === "visible") setWake((n) => n + 1);
    };
    check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [turns, turnMs, endsAt, done, paused, now]);

  // The hourglass turns itself over with a whoosh and a chime as the next turn starts – on the Kugelbahn the marble
  // lands with a clink and the board turns over.
  const lastTurn = useRef(turn);
  useEffect(() => {
    if (turn === lastTurn.current) return;
    lastTurn.current = turn;
    if (turn === 0) return;
    // Rendered already, so `holderNow` is the child whose turn it is now.
    if (holderNow.current) say(TURN_TO[holderNow.current]);
    if (marble) {
      // The marble lands in the bottom basket, and the board turns over.
      playKnock(1100);
      playWhoosh();
    } else if (!race) playWhoosh();
    const timer = setTimeout(playChime, 700);
    return () => clearTimeout(timer);
  }, [turn, say, marble, race]);
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

  /** The child whose turn it is, as its place among the children. */
  const index = turns ? (turns.first + turn) % count : null;
  const holder: TurnChild | null = index === null ? null : children[index];
  holderNow.current = holder;
  /** Whose side is shown as having the turn: before the first turn starts (the page still turning), the first child's. */
  const shownIndex = index ?? children.indexOf(FIRST_TURN);
  const shown = children[shownIndex];
  /** The lamp that shines: the child's whose turn it is; at the end every one. */
  const lit = (kind: TurnChild) => done || shown === kind;
  const lits = children.map(lit);

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

  // A tap on the picture answers as always (H-51) and pauses the timer (user decision, 23 November 2026): the veil
  // with ▶ and the round arrow comes, and a tap on it goes on.
  const down = (e: PointerEvent) => {
    answer(e.clientX, e.clientY);
    if (ticking) pause();
  };
  const turnStart = turns ? turns.start + turn * turnMs : 0;
  const ticking = running && !done;
  const next = nextPicture(picture);
  const nextInfo = PICTURES.find((p) => p.id === next);
  const name = PICTURES.find((p) => p.id === picture)?.name;
  // Taking turns, the note shows the whole turn's length beside the time left (user request, 25 November 2026).
  const room = noteRoom(timeShown, turnMs, true);

  return (
    <RunClockProvider value={clock}>
      <div
        className={`tm-play${bar ? " tm-with-bar" : ""}${paused ? " tm-paused" : ""}${room.className}`}
        style={room.style}
        data-picture={picture}
        onPointerDown={down}
        role="img"
        aria-label={name ? t(name) : undefined}
      >
        {race ? (
          <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`}>
            <RaceScene
              kids={children}
              holder={shown}
              prev={turn > 0 ? children[(shownIndex - 1 + count) % count] : null}
              turn={ticking ? { name: `tm-race-${round}-${turn}-${wake}`, startedAt: turnStart, ms: turnMs, handover: turn > 0 } : null}
              done={done}
              poke={poke}
              players={players}
            />
            {done && <div className="tm-done-light" />}
          </div>
        ) : marble ? (
          <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`}>
            <MarbleScene
              kids={children}
              lit={lits}
              turn={ticking ? { name: `tm-mr-${round}-${turn}-${wake}`, startedAt: turnStart, ms: turnMs } : null}
              poke={poke}
              players={players}
            />
            {done && <div className="tm-done-light" />}
          </div>
        ) : (
          <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`}>
            <SwapBackdrop kids={children} />
            <SwapLights count={count as TurnCount} lit={lits} />
            <SwapCushions kids={children} lit={lits} players={players} />
            <SwapShades count={count as TurnCount} lit={lits} />
            <SwapHourglass
              key={running && turns ? `${turns.start}-${turn}` : "wait"}
              ms={turnMs}
              startedAt={turnStart}
              flip={running && turn > 0}
              waiting={!running}
              glow={poke}
              glass={swapPlaces(count as TurnCount).glass}
            />
            {done && <div className="tm-done-light" />}
          </div>
        )}
        {done && <TimeUp />}
        {bar && ticking && holder && <TimeBar key={`${turnStart}-${turn}`} startedAt={turnStart} total={turnMs} tone={holder} glow={poke} />}
        {(ticking || done) && <TimeShownNote shown={timeShown} endsAt={turnStart + turnMs} total={turnMs} up={done} withTotal />}
        {ticking && <PauseControls paused={paused} onPause={pause} onResume={resume} onRestart={onAgain} />}
        <FeedbackLayer effects={effects} />
        {done && (
          <GameEnd
            delayMs={4200}
            level={picture}
            onAgain={onAgain}
            next={nextInfo && { name: t(nextInfo.name), onNext: () => onPicture(next), art: <TimerCardArt picture={next} /> }}
          />
        )}
      </div>
      <PlayOptions>
        <SettingsGroup title={t(SWAP_NAME)}>
          <Choice
            label={t(KIDS_LABEL)}
            value={String(count) as `${TurnCount}`}
            // The turns start anew with the child whose turn it is, if it still plays, else with the first.
            onChange={(value) => {
              const next = Number(value) as TurnCount;
              onKids(next);
              const keep = shownIndex < next;
              begin(keep ? shownIndex : 0, 0);
              if (!keep) say(TURN_TO[children[0]]);
            }}
            options={(["2", "3", "4"] as const).map((n) => ({ value: n, label: n }))}
          />

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
            // Starts that child's turn anew, with a full hourglass (or the marble on top again): for who begins, or to
            // set it right.
            onChange={(first: TurnChild) => {
              begin(children.indexOf(first), 0);
              say(TURN_TO[first]);
            }}
            options={children.map((kind) => ({ value: kind, label: kidLabel(kind, players, t) }))}
          />
        </SettingsGroup>
        <PlayersChoice kids={children} players={players} onChange={onPlayers} />
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
        {endsAt !== undefined && <TimeLeft endsAt={endsAt} until={pausedOnce ? undefined : until} />}
        <TimeShownChoice value={timeShown} onChange={onShown} />
        <TimeBarChoice value={bar} onChange={onBar} />
      </PlayOptions>
    </RunClockProvider>
  );
}
