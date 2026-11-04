import { useEffect, useRef, useState } from "react";
import { GameEnd } from "@/components/GameEnd";
import { useAppLanguage, useT } from "@/lib/language";
import { groupStories, type StoryGroup } from "./groups";
import { RoundPlay } from "./RoundPlay";
import { roundOf, stepsOf } from "./rounds";
import type { FeelingsSettings } from "./settings";

/**
 * One pass through a group: each of its scenes once, one choice each. After a scene's good idea „Weiter“ brings the
 * next scene, so the picture of the choice stays until someone goes on (user feedback, November 2026). Every scene
 * asks its next step (`FeelingsSettings.steps`), so the next pass shows the same scenes with other choices. After the
 * last scene come „Menü“, „Nochmal“ and „Weiter“, which names the feeling it goes on to.
 */
export function PassPlay({
  group,
  startAt = 0,
  settings,
  update,
  remember = true,
  onAgain,
  next,
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

  // The scene is done: its next step and the scene to go on from are kept at once, even if no one taps „Weiter“.
  const finish = () => {
    steps.current = { ...steps.current, [story.id]: (now.step + 1) % stepsOf(story) };
    update({ steps: steps.current, ...(remember ? { scene: last ? 0 : now.index + 1 } : {}) });
  };

  const goOn = () => setNow({ index: now.index + 1, step: stepOf(now.index + 1) });

  return (
    <RoundPlay
      key={`${now.index}-${now.step}`}
      round={roundOf(story, now.step, language)}
      settings={settings}
      progress={{ total: scenes.length, done: now.index }}
      onFinish={finish}
      ending={last ? <GameEnd inline showNext onAgain={onAgain} next={next} /> : <SceneNext onNext={goOn} />}
      onEndKey={last ? (next?.onNext ?? onAgain) : goOn}
    />
  );
}

/**
 * „Weiter“ between two scenes of a pass, alone where the end buttons stand and looking like their „Weiter“: the same
 * feeling goes on, so it names nothing. Not `GameEnd`, since a scene is no game of its own (no play time, no „Menü“).
 */
function SceneNext({ onNext }: { onNext: () => void }) {
  const t = useT();
  return (
    <div className="game-end inline" data-tap-root onPointerDown={(e) => e.stopPropagation()}>
      <button type="button" className="game-end-button next" onPointerDown={onNext}>
        {t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" })}
      </button>
    </div>
  );
}
