import { useEffect, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage } from "@/lib/language";
import { groupStories, type StoryGroup } from "./groups";
import { RoundPlay } from "./RoundPlay";
import { roundOf, stepsOf } from "./rounds";
import type { FeelingsSettings } from "./settings";

/**
 * One pass through a group: each of its scenes once, one choice each, straight on from one scene to the next. Every
 * scene asks its next step (`FeelingsSettings.steps`), so the next pass shows the same scenes with other choices.
 * After the last scene come „Menü“, „Nochmal“ and „Weiter“.
 */
export function PassPlay({
  group,
  startAt = 0,
  settings,
  update,
  remember = true,
  onAgain,
  next,
  readAlong,
}: {
  group: StoryGroup;
  /** The scene to begin with: where the child stopped last time. */
  startAt?: number;
  settings: FeelingsSettings;
  update: (patch: Partial<FeelingsSettings>) => void;
  /** Keeps the group and the scene reached as the place to go on from („Alltagssituationen“; not „Wie geht's dir?“). */
  remember?: boolean;
  onAgain: () => void;
  /** The next group; left out where there is none to go on to. */
  next?: { name?: string; onNext: () => void };
  /** The sign with the round's whole text for grown-ups („Alltagssituationen“ only, `ReadAlong`). */
  readAlong?: { open: boolean; onToggle: () => void };
}) {
  const { id: language } = useAppLanguage();
  const scenes = groupStories(group);
  // The steps as they are now: a round finishing writes the next one, while a timer of the last may still read them.
  const steps = useRef(settings.steps);
  const stepOf = (index: number) => (steps.current[scenes[index].id] ?? 0) % stepsOf(scenes[index]);
  const [now, setNow] = useState(() => {
    const index = startAt < scenes.length ? startAt : 0;
    return { index, step: stepOf(index) };
  });

  useEffect(() => {
    if (remember) update({ group: group.id });
  }, []);

  const story = scenes[now.index];
  const last = now.index === scenes.length - 1;

  const finish = () => {
    steps.current = { ...steps.current, [story.id]: (now.step + 1) % stepsOf(story) };
    const following = last ? 0 : now.index + 1;
    update({ steps: steps.current, ...(remember ? { scene: following } : {}) });
    if (!last) setNow({ index: following, step: stepOf(following) });
  };

  return (
    <RoundPlay
      key={`${now.index}-${now.step}`}
      round={roundOf(story, now.step, language)}
      settings={settings}
      progress={{ total: scenes.length, done: now.index }}
      onFinish={finish}
      ending={last ? <GameEnd inline onAgain={onAgain} next={next} /> : undefined}
      onEndKey={next?.onNext ?? onAgain}
      readAlong={readAlong}
    />
  );
}
