import { type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { useInnerBack } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { turnPageWith } from "@/lib/look";
import { finishRoutineStep } from "@/lib/routine";
import { playCountNote } from "@/lib/sfx";
import { imageFor, moodImages, preloadImages } from "./images";
import {
  asCaption,
  loadMoodDay,
  MOOD_QUESTION,
  MOODS,
  type Mood,
  morningMood,
  saveMoodDay,
  STRENGTH_ANSWERS,
  STRENGTH_QUESTION,
  STRENGTHS,
  type Strength,
  THIS_MORNING,
  withMood,
} from "./mood";
import { MoodGroups, usePickKeys } from "./moodGroups";
import { NEEDS_TITLE } from "./needs";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, useVoice } from "./shared";
import { useStepAddress } from "@/lib/stepAddress";

/** A feeling's card: the little bear alone with it, in a moment that brings it (user feedback, November 2026). */
const cardImage = (mood: Mood) => moodImages.feeling(mood.id);

/**
 * Wie geht's dir heute? The eight feelings' cards in two groups, the pleasant ones apart from the unpleasant ones; a tap
 * on one shows at once three pictures of the little bear in that moment, the feeling a little, quite a lot and a whole
 * lot, and the child taps how strong it is (C-36).
 * The corner in the top left goes back to all feelings (`useInnerBack`). In the evening the card picked this morning
 * says so under it (C-33). Copying the faces and what helps are games of their own (user feedback, November 2026).
 */
export function MoodPlay({ settings, onNeeds }: { settings: FeelingsSettings; onNeeds: () => void }) {
  const [mood, setMood] = useState<Mood>();
  // The feeling picked in the address (`?seite=happy`), none while the cards are shown.
  useStepAddress(mood?.id);
  const { say, preload } = useVoice(settings);
  const t = useT();
  // In the evening, the feeling picked this morning (C-33), read once.
  const [morning] = useState(() => morningMood(loadMoodDay(), new Date()));

  useEffect(() => {
    preloadImages(MOODS.map(cardImage));
    // The weaker and stronger pictures after the cards, so a feeling's three show at once when it is tapped.
    preloadImages(MOODS.flatMap((m) => [moodImages.strength(m.id, 0), moodImages.strength(m.id, 2)]));
    preload([...MOODS.map((m) => t(m.caption)), t(STRENGTH_QUESTION), ...STRENGTH_ANSWERS.map((a) => t(a))]);
  }, []);

  // The question each time the cards come, also back from a feeling.
  useEffect(() => {
    if (!mood) say(t(MOOD_QUESTION));
  }, [mood]);

  useInnerBack(mood ? () => setMood(undefined) : undefined);

  const pick = useCallback(
    (picked: Mood) => {
      // The answer a plan's „Wie geht's dir?“ card waited for (the Tagesplan, rituals.ts): it is ticked on the way back.
      finishRoutineStep();
      const now = new Date();
      saveMoodDay(withMood(loadMoodDay(), picked.id, now));
      setMood(picked);
      // The feeling's name first, so the child hears what it picked, then the question (C-73).
      say(t(picked.caption));
      say(t(STRENGTH_QUESTION), true);
    },
    [say, t],
  );

  usePickKeys(!mood, MOODS, pick);

  const card = (m: Mood) => (
    <ChoiceCard
      key={m.id}
      image={cardImage(m)}
      caption={t(m.caption)}
      marker={m.id === morning ? t(THIS_MORNING) : undefined}
      state="choose"
      onChoose={() => pick(m)}
    />
  );

  return <main className="mood-play">{mood ? <Strengths key={mood.id} mood={mood} say={say} onNeeds={onNeeds} /> : <MoodGroups card={card} />}</main>;
}

/**
 * A feeling picked: three pictures of the little bear in its moment, the feeling a little, quite a lot and a whole lot
 * (C-36; user wish, November 2026: pictures, no slider), side by side over a band from thin to thick. A tap on one
 * says how strong it is with a note, higher the stronger; the others go pale, and a tap on another changes it.
 */
function Strengths({ mood, say, onNeeds }: { mood: Mood; say: (text: string) => void; onNeeds: () => void }) {
  const t = useT();
  const [picked, setPicked] = useState<Strength>();

  const choose = useCallback(
    (strength: Strength) => {
      setPicked(strength);
      playCountNote(strength * 2);
      say(t(STRENGTH_ANSWERS[strength]));
    },
    [say, t],
  );

  // Digits pick, the arrows go weaker or stronger, every other key goes on and back again: every key does something.
  const way = useRef(1);
  const pickedRef = useRef(picked);
  pickedRef.current = picked;
  useEffect(() => {
    const last = STRENGTHS.length - 1;
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const now = pickedRef.current ?? 1;
      const digit = Number(e.key) - 1;
      let next: number;
      if (digit >= 0 && digit <= last) next = digit;
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(0, now - 1);
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(last, now + 1);
      else if (pickedRef.current === undefined) next = 0;
      else {
        if (now + way.current < 0 || now + way.current > last) way.current = -way.current;
        next = now + way.current;
      }
      choose(next as Strength);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose]);

  return (
    <div className={`mood-strengths ${mood.pleasant ? "pleasant" : "unpleasant"}`}>
      <div className="mood-strength-row">
        {STRENGTHS.map((strength) => (
          <div key={strength} className={`mood-strength${picked !== undefined && picked !== strength ? " pale" : ""}`}>
            <ChoiceCard
              image={moodImages.strength(mood.id, strength)}
              caption={asCaption(t(STRENGTH_ANSWERS[strength]))}
              state="choose"
              onChoose={() => choose(strength)}
            />
          </div>
        ))}
      </div>
      {/* From a little to a whole lot, for grown-ups at a glance: still, under the pictures. */}
      <svg className="mood-band" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden>
        <path d="M6 22 L394 4 Q398 20 394 36 L6 26 Z" />
      </svg>
      <NeedsLink onNeeds={onNeeds} />
    </div>
  );
}

/**
 * On to „Was brauche ich?“ once a feeling is picked (user wish, November 2026): what helps with it is the next thing to
 * ask. A paper slip with the hug's picture and the game's name, in the bottom right corner – never the middle of the
 * bottom edge, where browsers show how to leave fullscreen. A page turns forward to it (the same game, its other card,
 * `MoodGame`); ✕ there goes back to the sub-menu.
 */
function NeedsLink({ onNeeds }: { onNeeds: () => void }) {
  const t = useT();
  const picture = imageFor(moodImages.need("kuscheln"));
  const go = (e: PointerEvent) => {
    e.stopPropagation();
    turnPageWith("forward", onNeeds);
  };
  return (
    <button type="button" className="mood-needs-link" data-tap onPointerDown={go}>
      {picture && <img className="mood-needs-link-picture" src={picture} alt="" draggable={false} />}
      <span>{t(NEEDS_TITLE)}</span>
    </button>
  );
}
