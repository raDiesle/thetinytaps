import { useEffect, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage } from "@/lib/language";
import { DayPage } from "./DayPage";
import { type Day, dayStories, NIGHT_IMAGE } from "./days";
import type { ReadAlongCorner } from "./PassPlay";
import { RoundPlay } from "./RoundPlay";
import { roundOf, stepsOf } from "./rounds";
import type { FeelingsSettings } from "./settings";

/** Where a day is: the page of the story before scene `index`, the scene itself, or the night at the end. */
type At = { index: number; page: "before" | "scene" | "night"; step: number };

/**
 * One day of the little bear (user idea, November 2026): before each scene a page of the story tells how the day goes
 * on to it (`DayPage`), then the scene plays as in a pass of a feeling – one choice, and its picture waits with ▶. After
 * the last scene the night ends the day with „Nochmal“ and „Weiter“ (the next day, named under it). Every scene asks its
 * next step (`FeelingsSettings.steps`), shared with the passes by feeling, and the day goes on where the child stopped.
 */
export function DayPlay({
  day,
  startAt = 0,
  settings,
  update,
  onAgain,
  next,
  readAlong,
}: {
  day: Day;
  /** The scene to begin with: where the child stopped last time; its page of the story comes first. */
  startAt?: number;
  settings: FeelingsSettings;
  update: (patch: Partial<FeelingsSettings>) => void;
  onAgain: () => void;
  next?: { name?: string; onNext: () => void };
  /** The corner for grown-ups: the scene's whole text and the loudspeaker; on the pages of the story only the loudspeaker. */
  readAlong?: ReadAlongCorner;
}) {
  const { id: language } = useAppLanguage();
  const scenes = dayStories(day);
  // The steps as they are now: a scene finishing writes the next one, while a timer of the last may still read them.
  const steps = useRef(settings.steps);
  const stepOf = (index: number) => (steps.current[scenes[index].id] ?? 0) % stepsOf(scenes[index]);
  const [at, setAt] = useState<At>(() => {
    const index = startAt < scenes.length ? startAt : 0;
    return { index, page: "before", step: stepOf(index) };
  });

  useEffect(() => {
    update({ day: day.id });
  }, []);

  const story = scenes[at.index];
  const last = at.index === scenes.length - 1;
  const progress = { total: scenes.length, done: at.page === "night" ? scenes.length : at.index };

  // The scene is done: its next step and the scene to go on from are kept at once, even if no one taps ▶.
  const finish = () => {
    steps.current = { ...steps.current, [story.id]: (at.step + 1) % stepsOf(story) };
    update({ steps: steps.current, dayScene: last ? 0 : at.index + 1 });
  };

  // ▶ on the scene's last picture: the page of the story before the next scene, or the night after the last.
  const goOn = () => setAt(last ? { ...at, page: "night" } : { index: at.index + 1, page: "before", step: stepOf(at.index + 1) });

  if (at.page === "night")
    return (
      <DayPage
        key="night"
        image={NIGHT_IMAGE}
        text={day.end}
        settings={settings}
        progress={progress}
        ending={<GameEnd inline showNext onAgain={onAgain} next={next} />}
        onEndKey={next?.onNext ?? onAgain}
        corner={readAlong?.voiceSwitch}
      />
    );

  const { before } = day.scenes[at.index];
  if (at.page === "before")
    return (
      <DayPage
        key={before.image}
        image={before.image}
        text={before.text}
        settings={settings}
        progress={progress}
        onNext={() => setAt({ ...at, page: "scene" })}
        corner={readAlong?.voiceSwitch}
      />
    );

  return (
    <RoundPlay
      key={`${at.index}-${at.step}`}
      round={roundOf(story, at.step, language)}
      settings={settings}
      progress={progress}
      onFinish={finish}
      onDone={goOn}
      onEndKey={goOn}
      readAlong={readAlong}
    />
  );
}
