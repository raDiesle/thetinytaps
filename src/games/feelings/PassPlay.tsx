import { type ReactNode, useEffect, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage } from "@/lib/language";
import { groupStories, type StoryGroup } from "./groups";
import { RoundPlay } from "./RoundPlay";
import { openingLines, roundOf, stepsOf } from "./rounds";
import type { FeelingsSettings } from "./settings";

/**
 * One pass through a group: each of its scenes once, one choice each. After a scene's good idea its picture waits with
 * ▶ until a tap brings the next scene (user feedback, November 2026). Every scene asks its next step
 * (`FeelingsSettings.steps`), so the next pass shows the same scenes with other choices. After the last scene come
 * „Nochmal“ and „Weiter“, which names the feeling it goes on to. A tap on a dot at the top plays that scene again.
 */
export function PassPlay({
  group,
  startAt = 0,
  settings,
  update,
  remember = true,
  onAgain,
  next,
  voiceSwitch,
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
  /** The loudspeaker for grown-ups in the bottom right corner („Alltagssituationen“ only, `VoiceSwitch`). */
  voiceSwitch?: ReactNode;
}) {
  const { id: language } = useAppLanguage();
  const scenes = groupStories(group);
  // The steps as they are now: a round finishing writes the next one, while a timer of the last may still read them.
  const steps = useRef(settings.steps);
  const stepOf = (index: number) => (steps.current[scenes[index].id] ?? 0) % stepsOf(scenes[index]);
  // The step each scene played in this pass, so a tap on its dot plays it again as it was.
  const played = useRef<Record<number, number>>({});
  // `run` restarts a scene played again from its dot.
  const [now, setNow] = useState(() => {
    const index = startAt < scenes.length ? startAt : 0;
    return { index, step: stepOf(index), run: 0 };
  });

  useEffect(() => {
    if (remember) update({ group: group.id });
  }, []);

  const story = scenes[now.index];
  const last = now.index === scenes.length - 1;

  // The scene is done: its next step and the scene to go on from are kept at once, even if no one taps ▶.
  const finish = () => {
    played.current[now.index] = now.step;
    steps.current = { ...steps.current, [story.id]: (now.step + 1) % stepsOf(story) };
    update({ steps: steps.current, ...(remember ? { scene: last ? 0 : now.index + 1 } : {}) });
  };

  const goOn = () => setNow({ index: now.index + 1, step: stepOf(now.index + 1), run: now.run });
  // A dot tapped: that scene again, with the choice it played (the one now from its start).
  const replay = (index: number) => setNow({ index, step: played.current[index] ?? stepOf(index), run: now.run + 1 });

  return (
    <RoundPlay
      key={`${now.index}-${now.step}-${now.run}`}
      round={roundOf(story, now.step, language)}
      settings={settings}
      progress={{ total: scenes.length, done: now.index }}
      onFinish={finish}
      ending={last ? <GameEnd inline showNext level={group.id} onAgain={onAgain} next={next} /> : undefined}
      onDone={last ? undefined : goOn}
      onEndKey={last ? (next?.onNext ?? onAgain) : goOn}
      onPick={replay}
      onBack={now.index > 0 ? () => replay(now.index - 1) : undefined}
      voiceSwitch={voiceSwitch}
      // The next scene's opening loads while this one plays.
      nextLines={last ? [] : openingLines(roundOf(scenes[now.index + 1], stepOf(now.index + 1), language))}
    />
  );
}
