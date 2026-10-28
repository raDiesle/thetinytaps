import { type CSSProperties, useEffect, useRef, useState } from "react";
import { BurstLayer, useBursts } from "@/components/Bursts";
import { playChime, playCountNote, playPop, playTusch, playTwinkle, playWhoosh, unlockAudio } from "@/lib/sfx";
import { useAppLanguage, useT, voiceFor } from "@/lib/language";
import { speak, unlockSpeech } from "@/lib/speech";
import { forwardNearTaps } from "@/lib/tapTargets";
import { addStar, type Board, dayFull, exampleStars, type LinkedDays, parseCellKey, progress, type StarLog, takeBackStar } from "./board";
import { BoardSheet, type FieldState, SCREEN_LOOK, useRewardLabel, useTaskLabel } from "./BoardSheet";
import { MARK_BY_ID, MARKS } from "./catalog";

/** How long a grown-up holds a field before its star comes. */
export const HOLD_MS = 700;
/** How long the star flies from the middle into its field. */
const FLY_MS = 650;
/** How long „Stern zurück“ stays after a star, for a grown-up who held the wrong field. */
const UNDO_MS = 8000;

/** A star the grown-up has unlocked: big in the middle until the child taps it. */
interface Pending {
  /** The field it flies to. */
  field: string;
  /** Its log key: a `cellKey`, or null on a collecting board. */
  key: string | null;
  /** Day of the field, for the „day full“ party. */
  day: Date;
}

/**
 * The board on screen, as big as the room allows, and how stars come on it:
 * a grown-up holds an open field until its ring is full, a big star appears in the
 * middle, the child taps it and it flies into the field with a sound. A short tap on a
 * field wiggles it (or twinkles a star that is there), so every tap does something but
 * no tap alone gives a star. A full day, and the reward reached, are celebrated.
 * Stars are never taken away – „Stern zurück“ only undoes a wrong hold right after it.
 * A new board shows example stars (`Board.examples`) until its first real star.
 */
export function BoardScreen({
  board,
  log,
  setLog,
  linked,
  day,
  sounds,
  speech,
  onExamplesOff,
}: {
  board: Board;
  log: StarLog;
  setLog: (log: StarLog) => void;
  linked: LinkedDays;
  /** A day of the week, month or day shown: today, or an earlier one a grown-up went back to. */
  day: Date;
  sounds: boolean;
  speech: boolean;
  /** The example stars go: with the first real star, or when a grown-up hides them. */
  onExamplesOff: () => void;
}) {
  const t = useT();
  const language = useAppLanguage();
  const taskLabel = useTaskLabel();
  const rewardLabel = useRewardLabel();
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  const box = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(1.6);
  const [holding, setHolding] = useState<string | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [flight, setFlight] = useState<CSSProperties | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [undo, setUndo] = useState<{ key: string | null } | null>(null);
  const [party, setParty] = useState(false);
  const { bursts, spawn } = useBursts();
  const today = new Date();
  const stars = log[board.id];

  const sound = (play: () => void) => sounds && play();
  // A line without its translation is German and gets the German voice.
  const say = (text: string) => speech && speak(text, voiceFor(text, language));

  // The path of a collecting board follows the shape of the room it has.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setAspect(el.clientWidth / Math.max(1, el.clientHeight)));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Taps a little next to a field still count for it (see tapTargets.ts).
  useEffect(() => (box.current ? forwardNearTaps(box.current) : undefined), []);

  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [undo]);

  useEffect(() => () => clearHold(), []);

  // Keys: with a big star waiting any key sends it off; otherwise the stars there twinkle.
  const bigStar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || (e.target as Element).closest("input, textarea, button, a")) return;
      unlockAudio();
      if (bigStar.current) {
        bigStar.current.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
        return;
      }
      const filled = box.current?.querySelectorAll("[data-state='filled']") ?? [];
      for (const el of filled) poke(el, "twinkle");
      if (filled.length === 0) {
        const open = box.current?.querySelector("[data-state='open']");
        if (open) poke(open, "wiggle");
      }
      sound(playTwinkle);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  // Another board: nothing of this one's stars stays waiting.
  useEffect(() => {
    setPending(null);
    setUndo(null);
    setFresh(null);
  }, [board.id]);

  function clearHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  }

  /** Restarts a short CSS animation on a field. */
  const poke = (el: Element, name: "wiggle" | "twinkle") => {
    el.classList.remove("wiggle", "twinkle");
    void (el as HTMLElement).offsetWidth;
    el.classList.add(name);
  };

  /** What a field stands for, to say it: the task of a week or day board. */
  const fieldTask = (field: string) => board.tasks.find((task) => task.id === parseCellKey(field).taskId);

  const onPointerDown = (e: React.PointerEvent) => {
    const el = (e.target as Element).closest<HTMLElement>("[data-field]");
    if (!el || pending) return;
    unlockAudio();
    unlockSpeech();
    const field = el.dataset.field as string;
    const state = el.dataset.state as FieldState;
    const task = fieldTask(field);
    if (task) say(taskLabel(task));
    if (state === "filled") {
      poke(el, "twinkle");
      sound(playTwinkle);
      return;
    }
    if (state === "future") {
      poke(el, "wiggle");
      sound(playPop);
      return;
    }
    // An open field: the ring fills while it is held; let go early and it only wiggles.
    sound(() => playCountNote(0));
    setHolding(field);
    clearHold();
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setHolding(null);
      unlock(field);
    }, HOLD_MS);
  };

  const letGo = () => {
    if (!holding || !holdTimer.current) return;
    clearHold();
    setHolding(null);
    const el = document.querySelector(`[data-field="${CSS.escape(holding)}"]`);
    if (el) poke(el, "wiggle");
  };

  // A finger that slides off the field it holds lets go of it.
  const onPointerMove = (e: React.PointerEvent) => {
    if (!holding) return;
    const under = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-field]");
    if (under?.dataset.field !== holding) letGo();
  };

  /** The big star for a held field; on a collecting board it goes to the next free field, whichever was held. */
  const unlock = (field: string) => {
    sound(playChime);
    if (board.kind === "collect") {
      const { count } = progress(board, stars, linked, today);
      setPending({ field: `c${count}`, key: null, day: today });
      return;
    }
    if (fieldTask(field)) setPending({ field, key: field, day: parseCellKey(field).day });
  };

  /** The child taps the big star: it flies to its field, then lands there. */
  const fly = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pending || flight) return;
    const star = e.currentTarget.getBoundingClientRect();
    const target = document.querySelector(`[data-field="${CSS.escape(pending.field)}"] .rw-ring`)?.getBoundingClientRect();
    sound(playWhoosh);
    if (!target) return land();
    setFlight({
      "--dx": `${target.left + target.width / 2 - (star.left + star.width / 2)}px`,
      "--dy": `${target.top + target.height / 2 - (star.top + star.height / 2)}px`,
      "--to": `${target.width / star.width}`,
    } as CSSProperties);
    setTimeout(land, FLY_MS);
  };

  const land = () => {
    if (!pending) return;
    const before = progress(board, stars, linked, day);
    const wasFull = dayFull(board, stars, linked, pending.day);
    const next = addStar(log, board.id, pending.key, today);
    const after = progress(board, next[board.id], linked, day);
    setLog(next);
    if (board.examples) onExamplesOff();
    setPending(null);
    setFlight(null);
    setFresh(pending.field);
    setUndo({ key: pending.key });
    sound(playTwinkle);
    const target = document.querySelector(`[data-field="${CSS.escape(pending.field)}"]`)?.getBoundingClientRect();
    const x = target ? target.left + target.width / 2 : undefined;
    const y = target ? target.top + target.height / 2 : undefined;
    spawn(x, y);
    const goalReached = before.count < before.goal && after.count >= after.goal;
    if (goalReached) {
      // The big party: the reward, or just the joy of it.
      setTimeout(() => {
        setParty(true);
        sound(playTusch);
        for (let i = 0; i < 12; i++) setTimeout(() => spawn(), i * 90);
        say(board.reward ? `${t({ de: "Geschafft! Jetzt gibt es:" })} ${rewardLabel(board.reward)}` : t({ de: "Geschafft! Hurra!" }));
      }, 500);
    } else if ((board.kind === "week" || board.kind === "month") && !wasFull && dayFull(board, next[board.id], linked, pending.day)) {
      // A day with all its stars: a small party right there.
      for (let i = 0; i < 5; i++) setTimeout(() => spawn(x, y), 120 + i * 110);
      setTimeout(() => sound(playChime), 300);
      say(t({ de: "Super! Der Tag ist voll!" }));
    } else {
      say(t({ de: "Super!" }));
    }
  };

  const takeBack = () => {
    if (!undo) return;
    setLog(takeBackStar(log, board.id, undo.key));
    setUndo(null);
    setFresh(null);
  };

  return (
    <div className="rw-screen">
      {/* The fields inside are the targets; one listener for all of them. */}
      <div ref={box} className="rw-screen-box" onPointerDown={onPointerDown} onPointerUp={letGo} onPointerCancel={letGo} onPointerMove={onPointerMove}>
        <BoardSheet
          board={board}
          stars={stars}
          examples={board.examples ? exampleStars(board, day) : null}
          linked={linked}
          today={today}
          day={day}
          look={SCREEN_LOOK}
          aspect={aspect}
          fresh={fresh}
          holding={holding}
        />
      </div>
      {board.examples && (
        <div className="rw-example-note">
          <span>✨ {t({ de: "Blasse Sterne sind nur ein Beispiel – mit dem ersten echten Stern gehen sie weg." })}</span>
          <button type="button" onClick={onExamplesOff}>
            {t({ de: "Ausblenden" })}
          </button>
        </div>
      )}
      {undo && (
        <button type="button" className="rw-undo" onClick={takeBack}>
          ↶ {t({ de: "Stern zurück" })}
        </button>
      )}
      {pending && (
        <div className="rw-pending" data-tap-root>
          <button
            type="button"
            ref={bigStar}
            className={`rw-big-star${flight ? " fly" : ""}`}
            style={flight ?? undefined}
            data-tap="goal"
            aria-label={t({ de: "Stern" })}
            onPointerDown={fly}
          >
            {mark.emoji}
          </button>
          <button type="button" className="rw-pending-cancel" aria-label={t({ de: "Doch keinen Stern" })} onClick={() => setPending(null)}>
            ✕
          </button>
        </div>
      )}
      {party && (
        <button type="button" className="rw-party" onClick={() => setParty(false)}>
          <span className="rw-party-emoji" aria-hidden>
            {board.reward?.emoji ?? "🎉"}
          </span>
          <span className="rw-party-text">{board.reward ? rewardLabel(board.reward) : t({ de: "Geschafft!" })}</span>
        </button>
      )}
      <BurstLayer bursts={bursts} />
    </div>
  );
}
