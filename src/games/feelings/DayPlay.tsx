import { type ReactNode, useEffect, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage } from "@/lib/language";
import { DayPage } from "./DayPage";
import { type Day, dayStories, NIGHT_IMAGE } from "./days";
import { dayIn } from "./localized";
import { RoundPlay } from "./RoundPlay";
import { afterPage, openingLines, roundOf, stepsOf } from "./rounds";
import type { FeelingsSettings } from "./settings";

/** Where a day is: the page of the story before scene `index`, the scene itself, or the night at the end. */
type At = { index: number; page: "before" | "scene" | "night"; step: number; run: number };

/**
 * One day of the little bear (user idea, November 2026): before each scene a page of the story tells how the day goes
 * on to it (`DayPage`), then the scene plays as in a pass of a feeling – one choice, and its picture waits with ▶. After
 * the last scene the night ends the day with „Nochmal“ and „Weiter“ (the next day, named under it). Every scene asks its
 * next step (`FeelingsSettings.steps`), shared with the passes by feeling, and the day goes on where the child stopped.
 * A tap on a dot at the top plays that scene again.
 */
export function DayPlay({
  day,
  startAt = 0,
  settings,
  update,
  onAgain,
  next,
  voiceSwitch,
}: {
  day: Day;
  /** The scene to begin with: where the child stopped last time; its page of the story comes first. */
  startAt?: number;
  settings: FeelingsSettings;
  update: (patch: Partial<FeelingsSettings>) => void;
  onAgain: () => void;
  next?: { name?: string; onNext: () => void };
  /**
   * The loudspeaker for grown-ups – in the scenes only: on the pages of the story it would change nothing (user
   * feedback, November 2026: there it only lay over ▶).
   */
  voiceSwitch?: ReactNode;
}) {
  const { id: language } = useAppLanguage();
  const scenes = dayStories(day);
  // The steps as they are now: a scene finishing writes the next one, while a timer of the last may still read them.
  const steps = useRef(settings.steps);
  const stepOf = (index: number) => (steps.current[scenes[index].id] ?? 0) % stepsOf(scenes[index]);
  // The step each scene played today, so a tap on its dot plays it again as it was.
  const played = useRef<Record<number, number>>({});
  const [at, setAt] = useState<At>(() => {
    const index = startAt < scenes.length ? startAt : 0;
    return { index, page: "before", step: stepOf(index), run: 0 };
  });

  useEffect(() => {
    update({ day: day.id });
  }, []);

  // A scene as it comes after its page of the story: what the page told already is not said again (`DayScene.told`).
  const sceneRound = (index: number, step: number) =>
    afterPage(roundOf(scenes[index], step, language), day.scenes.find((s) => s.story === scenes[index].id)?.told);
  const story = scenes[at.index];
  const last = at.index === scenes.length - 1;
  const progress = { total: scenes.length, done: at.page === "night" ? scenes.length : at.index };

  // The scene is done: its next step and the scene to go on from are kept at once, even if no one taps ▶.
  const finish = () => {
    played.current[at.index] = at.step;
    steps.current = { ...steps.current, [story.id]: (at.step + 1) % stepsOf(story) };
    update({ steps: steps.current, dayScene: last ? 0 : at.index + 1 });
  };

  // ▶ on the scene's last picture: the page of the story before the next scene, or the night after the last.
  const goOn = () => setAt(last ? { ...at, page: "night" } : { index: at.index + 1, page: "before", step: stepOf(at.index + 1), run: at.run });
  // A dot tapped (user wish, November 2026): that scene itself again, with the choice it played – the one now from its start.
  const replay = (index: number) => setAt({ index, page: "scene", step: played.current[index] ?? stepOf(index), run: at.run + 1 });
  // ◀ bottom left: from a scene to its page of the story, from a page to the scene before it (user wish, November 2026).
  const backToScene = (index: number) => (index >= 0 ? () => replay(index) : undefined);

  if (at.page === "night")
    return (
      <DayPage
        key="night"
        image={NIGHT_IMAGE}
        text={dayIn(day, language).end}
        settings={settings}
        progress={progress}
        ending={<GameEnd inline showNext onAgain={onAgain} next={next} />}
        onEndKey={next?.onNext ?? onAgain}
        onPick={replay}
        onBack={backToScene(scenes.length - 1)}
      />
    );

  const texts = dayIn(day, language);
  const { before } = texts.scenes[at.index];
  // What comes next opens with: loaded while this page or scene plays (the night's text after the last scene).
  const sceneOpening = openingLines(sceneRound(at.index, at.step));
  const afterScene = last ? [texts.end] : [texts.scenes[at.index + 1].before.text, ...openingLines(sceneRound(at.index + 1, stepOf(at.index + 1)))];
  if (at.page === "before")
    return (
      <DayPage
        key={before.image}
        image={before.image}
        text={before.text}
        settings={settings}
        progress={progress}
        onNext={() => setAt({ ...at, page: "scene" })}
        onPick={replay}
        onBack={backToScene(at.index - 1)}
        nextLines={sceneOpening}
      />
    );

  return (
    <RoundPlay
      key={`${at.index}-${at.step}-${at.run}`}
      round={sceneRound(at.index, at.step)}
      settings={settings}
      progress={progress}
      onFinish={finish}
      onDone={goOn}
      onEndKey={goOn}
      onPick={replay}
      onBack={() => setAt({ ...at, page: "before" })}
      voiceSwitch={voiceSwitch}
      nextLines={afterScene}
    />
  );
}
