import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { choiceRows } from "@/games/shadows/levels";
import { pick, useAppLanguage } from "@/lib/language";
import { pageMoving } from "@/lib/pageMotion";
import { playChime, playPop, playRandomNote, recordingReady, recordingSeconds } from "@/lib/sfx";
import { atMost } from "@/lib/soundWait";
import { repeatPause } from "@/lib/spacing";
import { tapState } from "@/lib/tapTargets";
import { voiceQuiet } from "@/lib/voice";
import { ANIMAL_TEXTS, type Animal } from "./content";
import type { SoundRound } from "./levels";
import { useRoundTime, useSay } from "./roundTime";
import type { AnimalsSettings } from "./settings";
import { SOUND_TEXTS } from "./sounds";

/** Time to look at the animal found after its line, before the next round. */
const LOOK_MS = 800;
/** How long a call lasts where its recording isn't loaded (a soft pop then): the question comes after a call, and the loop counts from its end. */
const CALL_MS = 1600;
/** A call's length, its recording's own (a little longer, as it may play a little slower), else `CALL_MS`. */
const callMs = (animal: Animal) => {
  const seconds = animal.call && recordingSeconds(animal.call);
  return seconds ? seconds * 1050 : CALL_MS;
};
/** The quiet between two calls of the loop, after the call and after every line said. */
const LOOP_PAUSE_MS = 2000;
/** How often the loop looks whether it is time to call again. */
const LOOP_TICK_MS = 200;
/** The longest the first call waits for its recording (loaded a round ahead, so it is mostly there). */
const CALL_WAIT_MS = 3000;

/** What a round of „Wer macht das Geräusch?“ gets from `AnimalsRounds`, which plays it in turn with the other kinds. */
export interface SoundPlayProps {
  settings: Pick<AnimalsSettings, "speech" | "sounds">;
  round: SoundRound;
  /** What the round is about, for grown-ups: shown under the stage. */
  topic?: ReactNode;
  /** The kind's question („Wer macht das Geräusch?“), said before the round's own when the kind of round changes (Z-24). */
  intro?: string;
  /** The right animal was picked after `misses` wrong ones. */
  onSolved: (misses: number) => void;
  /** The curtain has opened and the animal has called: the next round may come. */
  onNext: () => void;
}

/** The animal's own call: its recording (loaded a round ahead), a soft pop if it has none. */
const call = (animal: Animal) => (animal.sound ?? playPop)();

/**
 * „Wer macht das Geräusch?“ (Z-15), one round of "Was gehört zum Tier?": a little stage with its curtain closed. Behind
 * it an animal calls once, then the voice asks who it was, and then the animal calls again and again, with a pause
 * between, until the child has found it below – no tap needed to hear it (user request, November 2026). A tap on the
 * curtain sways it and lets the animal call at once. A wrong one calls with its own voice, so the two can be compared;
 * the right one opens the curtain, and the animal stands there and calls again.
 */
export function SoundPlay({ settings, round, topic, intro, onSolved, onNext }: SoundPlayProps) {
  const language = useAppLanguage();
  const texts = pick(SOUND_TEXTS, language.id);
  const names = pick(ANIMAL_TEXTS, language.id);
  const [outcome, setOutcome] = useState<{ pick: number; ok: boolean } | null>(null);
  /** Bumped at every tap on the curtain: it sways once more. */
  const [sway, setSway] = useState(0);
  /** The keyboard frame; appears with the first key. */
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  /** Set from a pick until the child may pick again; a ref, since a key can come before the next render. */
  const busy = useRef(false);
  const { effects, ripple, glow } = useTapFeedback();
  /** Wrong animals picked in this round, for the difficulty. */
  const misses = useRef(0);
  /** The curtain hammered: its call again only after a pause (`REPEAT_PAUSE_MS`), meanwhile it only sways. */
  const again = useMemo(() => repeatPause(), []);
  const { later, whenQuiet } = useRoundTime();
  const say = useSay();
  /**
   * When the last sound on the stage ends (a call, or a line said): the loop calls again `LOOP_PAUSE_MS` after it. Never
   * before the first call and the question are under way.
   */
  const soundUntil = useRef(Number.POSITIVE_INFINITY);
  /** Set once the right animal is found: the loop stops. */
  const found = useRef(false);

  /** The animal calls; returns how long the call lasts. */
  const callNow = useCallback((animal: Animal) => {
    call(animal);
    const ms = callMs(animal);
    soundUntil.current = Math.max(soundUntil.current === Number.POSITIVE_INFINITY ? 0 : soundUntil.current, performance.now() + ms);
    return ms;
  }, []);

  // Once the line before is over and the page lies still: the animal calls once, then the kind's question (when the
  // kind changed) and the round's own, and then the animal calls on and on, with a pause after every call and line.
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (found.current) return;
      const now = performance.now();
      if (!voiceQuiet() || pageMoving()) soundUntil.current = Math.max(soundUntil.current, now);
      else if (!busy.current && settings.sounds && now - soundUntil.current >= LOOP_PAUSE_MS) callNow(round.animal);
      later(LOOP_TICK_MS, loop);
    };
    whenQuiet(0, () => {
      void atMost(recordingReady(round.animal.call ?? ""), CALL_WAIT_MS).then(() => {
        if (!alive) return;
        const first = settings.sounds ? callNow(round.animal) : 0;
        later(first, () => {
          if (intro) say(intro);
          say(texts.listen);
          loop();
        });
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  /** A tap on the curtain: it sways, and the animal behind it calls – unless it calls already or a line is being said. */
  const listen = (x?: number, y?: number) => {
    if (busy.current) return;
    setSway((n) => n + 1);
    glow(x, y);
    if (settings.sounds && voiceQuiet() && performance.now() >= soundUntil.current && again.pass("curtain")) callNow(round.animal);
  };

  const choose = (index: number) => {
    if (busy.current) return;
    busy.current = true;
    const ok = index === round.correct;
    setOutcome({ pick: index, ok });

    if (!ok) {
      // Never a "wrong" for the child; only the difficulty takes note. The animal picked calls with its own voice.
      misses.current++;
      const picked = round.animals[index];
      // Its call once the call or line still sounding is over, then „Das ist …“ after it: nothing sounds together
      // (user feedback, November 2026). The next pick (and the loop's next call) only once that line is said.
      whenQuiet(Math.max(150, soundUntil.current - performance.now()), () => {
        later(settings.sounds ? callNow(picked) : 0, () => {
          say(texts.thatIs(picked));
          whenQuiet(0, () => {
            busy.current = false;
            setOutcome(null);
          });
        });
      });
      return;
    }

    // The curtain opens: there it stands and calls once more – once the call or line still sounding is over –, then
    // „Da ist ja …“ after its call; the loop ends, and the next round comes only once that line is said in full.
    found.current = true;
    onSolved(misses.current);
    if (settings.sounds) later(150, playChime);
    whenQuiet(Math.max(700, soundUntil.current - performance.now()), () => {
      if (settings.sounds) call(round.animal);
      later(settings.sounds ? callMs(round.animal) : 0, () => {
        say(texts.there(round.animal));
        whenQuiet(0, () => whenQuiet(LOOK_MS, onNext));
      });
    });
  };

  const onStageDown = (e: PointerEvent) => {
    e.stopPropagation();
    listen(e.clientX, e.clientY);
  };

  const onChoiceDown = (index: number) => (e: PointerEvent) => {
    e.stopPropagation();
    choose(index);
  };

  // Arrow keys (or any key) move the frame, Space or Enter picks (or, before a frame is there, lets the animal call),
  // 1–5 pick straight away.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key === "Escape") return;
      if (outcome) {
        softTap();
        return;
      }
      const count = round.animals.length;
      const digit = Number(e.key);
      // Read and set through the ref: fast key presses come before React has rendered the last one.
      const move = (to: number) => {
        focusRef.current = to;
        setFocus(to);
      };
      const current = focusRef.current;
      if (Number.isInteger(digit) && digit >= 1 && digit <= count) {
        move(digit - 1);
        choose(digit - 1);
      } else if (e.key === "Enter" || e.key === " ") {
        if (current === null) {
          listen();
          move(0);
        } else choose(current);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        move(((current ?? 0) - 1 + count) % count);
      } else {
        move(current === null ? 0 : (current + 1) % count);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const open = outcome?.ok === true;
  return (
    <div className="animals-play kind-sound" onPointerDown={(e) => softTap(e.clientX, e.clientY)}>
      <div className="ap-top">
        <div
          className={`as-stage${open ? " open" : ""}`}
          role="button"
          aria-label={open ? names.animal(round.animal) : texts.listen}
          data-tap
          onPointerDown={onStageDown}
        >
          <div className="as-backdrop" />
          {/* Behind the curtain the animal waits unseen; it shows only once the curtain has opened. */}
          {open && (
            <span className="as-animal ap-emoji" aria-hidden>
              {round.animal.emoji}
            </span>
          )}
          <div className="as-floor" />
          <div className={`as-curtain as-left${sway && !open ? ` sway-${sway % 2}` : ""}`} />
          <div className={`as-curtain as-right${sway && !open ? ` sway-${sway % 2}` : ""}`} />
          <div className="as-valance" />
        </div>
      </div>
      {topic}
      <div className="ap-ground">
        <div className="ap-options" style={choiceRows(round.animals.length)}>
          {round.animals.map((a, i) => (
            <div
              key={a.id}
              className={`ap-option ap-plate${focus === i ? " focused" : ""}`}
              role="button"
              aria-label={names.animal(a)}
              data-tap={tapState({ goal: i === round.correct })}
              onPointerDown={onChoiceDown(i)}
            >
              <span className="ap-food ap-emoji" aria-hidden>
                {a.emoji}
              </span>
              <span className="ap-name" aria-hidden>
                {names.animal(a)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <FeedbackLayer effects={effects} />
    </div>
  );
}
