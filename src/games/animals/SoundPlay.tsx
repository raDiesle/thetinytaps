import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { choiceRows } from "@/games/shadows/levels";
import { pick, useAppLanguage } from "@/lib/language";
import { playChime, playPop, playRandomNote } from "@/lib/sfx";
import { repeatPause } from "@/lib/spacing";
import { tapState } from "@/lib/tapTargets";
import { ANIMAL_TEXTS, type Animal } from "./content";
import type { SoundRound } from "./levels";
import type { AnimalsSettings } from "./settings";
import { SOUND_TEXTS } from "./sounds";
import { animalsVoice } from "./voice";

/** Time to watch the curtain open and the animal call once more before the next round. */
const CELEBRATE_MS = 3400;
/** Time a wrong pick's own call takes before the child can pick again. */
const WRONG_MS = 1600;

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
 * „Wer macht das Geräusch?“ (Z-15), one round of "Was gehört zum Tier?": a little stage with its curtain closed. A tap
 * on the curtain sways it, and behind it an animal calls; the child taps below who it was. A wrong one calls with its
 * own voice, so the two can be compared; the right one opens the curtain, and the animal stands there and calls again.
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
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const later = useCallback((ms: number, run: () => void) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      run();
    }, ms);
    timers.current.add(timer);
  }, []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Its ElevenLabs recording; a sentence not recorded in the app language stays silent.
  const say = useCallback((text: string, queue = false) => animalsVoice.say(text, language.id, { queue }), [language.id]);

  // The kind's question when the kind changed, then the round's own; the animal waits behind the curtain for a tap
  // (Z-15: what is heard is still until the child asks for it).
  useEffect(() => {
    if (intro) say(intro);
    say(texts.listen, Boolean(intro));
  }, []);

  const softTap = useCallback(
    (x?: number, y?: number) => {
      ripple(x, y);
      if (settings.sounds) playRandomNote();
    },
    [ripple, settings.sounds],
  );

  /** A tap on the curtain: it sways and the animal behind it calls. */
  const listen = (x?: number, y?: number) => {
    if (busy.current) return;
    setSway((n) => n + 1);
    glow(x, y);
    if (settings.sounds && again.pass("curtain")) call(round.animal);
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
      if (settings.sounds) later(150, () => call(picked));
      say(texts.thatIs(picked));
      later(WRONG_MS, () => {
        busy.current = false;
        setOutcome(null);
      });
      return;
    }

    // The curtain opens: there it stands, and calls once more.
    if (settings.sounds) {
      later(150, playChime);
      later(700, () => call(round.animal));
    }
    say(texts.there(round.animal));
    onSolved(misses.current);
    later(CELEBRATE_MS, onNext);
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
          {/* A still hand points at the curtain until it is first tapped. */}
          {sway === 0 && !open && (
            <span className="as-hand" aria-hidden>
              👆
            </span>
          )}
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
