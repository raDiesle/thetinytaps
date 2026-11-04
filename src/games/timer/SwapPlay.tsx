import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { GameEnd } from "@/components/GameEnd";
import { PlayOptions } from "@/components/PlayOptions";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { playChime, playMelody, playTwinkle, playWhoosh } from "@/lib/sfx";
import { useWakeLock } from "@/lib/wakeLock";
import { nextPicture, PICTURES } from "./content";
import { Family } from "./scenes";
import type { SwapToy, TimerPicture } from "./settings";
import { SWAP_FAMILIES, SWAP_FLOOR, SWAP_TOYS, SwapBackdrop, SwapHourglass, Toy } from "./swap";
import { TimeLeft } from "./TimerPlay";

/** Who has the toy. */
type Child = "fox" | "bear";

/** The turns so far: counted from `start`, the first one being `first`'s. */
interface Turns {
  start: number;
  first: Child;
}

/** The turn running at `now`, counted from 0. */
function turnAt(turns: Turns, turnMs: number, now: number) {
  return Math.max(0, Math.floor((now - turns.start) / turnMs));
}

/**
 * Abwechseln (H-52): two children take turns with a toy. It lies by the fox child while the hourglass runs; when the
 * sand is through, it goes over to the bear child with a sound, the hourglass turns itself over, and so on until a
 * grown-up leaves with ✕ – or until the clock time set, then the families cheer and „Nochmal“ and „Weiter“ come.
 * Real time like every timer: the turn is worked out from the clock, so a phone that slept shows the right child.
 * Behind ⚙️ grown-ups pick the toy, say whose turn it is (which starts that turn anew) and see the time to the change.
 */
export function SwapRun({
  turnMs,
  totalMs,
  until,
  toy,
  onToy,
  onAgain,
  onPicture,
}: {
  /** One child's turn, in ms. */
  turnMs: number;
  /** With a clock time set: how long until then, in ms; otherwise it goes on until a grown-up stops it. */
  totalMs?: number;
  until?: string;
  toy: SwapToy;
  onToy: (toy: SwapToy) => void;
  onAgain: () => void;
  onPicture: (picture: TimerPicture) => void;
}) {
  const t = useT();
  const [endsAt] = useState(() => (totalMs === undefined ? undefined : Date.now() + totalMs));
  const [turns, setTurns] = useState<Turns>(() => ({ start: Date.now(), first: "fox" }));
  const [turn, setTurn] = useState(0);
  const [done, setDone] = useState(false);
  const [poke, setPoke] = useState(0);
  // The hourglass turns itself over for every turn after the first one seen.
  const shown = useRef(false);
  const { effects, ripple, glow } = useTapFeedback();
  useWakeLock(!done);

  // The turn, checked at least every second and again when the page comes back (timers sleep in the background).
  useEffect(() => {
    if (done) return;
    let timer: ReturnType<typeof setTimeout>;
    const check = () => {
      const now = Date.now();
      if (endsAt !== undefined && now >= endsAt) return setDone(true);
      const current = turnAt(turns, turnMs, now);
      setTurn(current);
      const nextChange = turns.start + (current + 1) * turnMs - now;
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

  // The toy goes over with a whoosh and a chime as the next turn starts; at the clock time a tune.
  const lastTurn = useRef(turn);
  useEffect(() => {
    if (turn === lastTurn.current) return;
    lastTurn.current = turn;
    playWhoosh();
    const timer = setTimeout(playChime, 700);
    return () => clearTimeout(timer);
  }, [turn]);
  useEffect(() => {
    if (!done) return;
    playChime();
    const timer = setTimeout(playMelody, 900);
    return () => clearTimeout(timer);
  }, [done]);

  const holder: Child = (turn % 2 === 0) === (turns.first === "fox") ? "fox" : "bear";
  const flip = shown.current;
  useEffect(() => {
    shown.current = true;
  });

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
  const turnStart = turns.start + turn * turnMs;
  const next = nextPicture("swap");
  const nextInfo = PICTURES.find((p) => p.id === next);
  const name = PICTURES.find((p) => p.id === "swap")?.name;

  return (
    <>
      <div className="tm-play" data-picture="swap" onPointerDown={down} role="img" aria-label={name ? t(name) : undefined}>
        <div className={`tm-stage ${done ? "tm-done" : "tm-running"}`}>
          <SwapBackdrop />
          <Family kind="fox" x={SWAP_FAMILIES.fox} floor={SWAP_FLOOR + 10} />
          <Family kind="bear" x={SWAP_FAMILIES.bear} floor={SWAP_FLOOR + 10} childLeft />
          <SwapHourglass key={`${turns.start}-${turn}`} ms={turnMs} startedAt={turnStart} flip={flip} running={!done} glow={poke} />
          <Toy toy={toy} bear={holder === "bear"} />
        </div>
        <FeedbackLayer effects={effects} />
        {done && <GameEnd delayMs={3200} noFamily onAgain={onAgain} next={nextInfo && { name: t(nextInfo.name), onNext: () => onPicture(next) }} />}
      </div>
      <PlayOptions>
        <SettingsGroup title={t({ de: "Abwechseln" })}>
          <Choice
            label={t({ de: "Spielzeug" })}
            value={toy}
            onChange={onToy}
            options={SWAP_TOYS.map((s) => ({ value: s.id, label: `${s.emoji} ${t({ de: s.de })}` }))}
          />
          <Choice
            label={t({ de: "Wer ist dran?" })}
            value={holder}
            // Starts that child's turn anew, with a full hourglass: for who begins, or to set it right.
            onChange={(first: Child) => setTurns({ start: Date.now(), first })}
            options={[
              { value: "fox", label: t({ de: "🦊 Fuchskind" }) },
              { value: "bear", label: t({ de: "🐻 Bärenkind" }) },
            ]}
          />
        </SettingsGroup>
        {!done && <TimeLeft endsAt={turnStart + turnMs} title={t({ de: "Bis zum Wechsel" })} />}
        {endsAt !== undefined && <TimeLeft endsAt={endsAt} until={until} />}
      </PlayOptions>
    </>
  );
}
