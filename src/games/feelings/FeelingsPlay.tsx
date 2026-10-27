import { useState } from "react";
import { useAppLanguage } from "@/lib/language";
import { BearPlay } from "./BearPlay";
import { KitaPlay } from "./KitaPlay";
import { feelingIn, situationIn } from "./localized";
import { MOOD_ID } from "./mood";
import { MoodPlay } from "./MoodPlay";
import type { FeelingsSettings } from "./settings";
import { homeStory, STORIES, storyAfter, type Story } from "./stories";

/**
 * One story after another: the bear at home or a kindergarten story, „Weiter“ brings the next.
 * „Wie geht's dir?“ first asks for a weather and then plays the bear's story with that feeling.
 */
export function FeelingsPlay({ settings }: { settings: FeelingsSettings }) {
  const mood = settings.story === MOOD_ID;
  const chosen = STORIES.find((s) => s.id === settings.story);
  const { id: language } = useAppLanguage();

  // „Weiter“ always goes on in the menu's order: „Alle“ starts with its first story, a picked one (or the one the weather led to) with itself.
  const pick = (after?: Story): Story => (after ? storyAfter(after) : (chosen ?? STORIES[0]));

  const [now, setNow] = useState<{ story?: Story; key: number }>(() => ({ story: mood ? undefined : pick(), key: 0 }));
  const next = () => setNow({ story: pick(now.story), key: now.key + 1 });

  const { story } = now;
  if (!story) return <MoodPlay settings={settings} onPick={(feeling) => setNow({ story: homeStory(feeling), key: now.key + 1 })} />;
  return story.kind === "home" ? (
    <BearPlay key={now.key} feeling={feelingIn(story.feeling, language)} settings={settings} onNext={next} />
  ) : (
    <KitaPlay key={now.key} situation={situationIn(story.situation, language)} settings={settings} onNext={next} />
  );
}
