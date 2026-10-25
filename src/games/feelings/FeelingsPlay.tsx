import { useRef, useState } from "react";
import { BearPlay } from "./BearPlay";
import { KitaPlay } from "./KitaPlay";
import type { FeelingsSettings } from "./settings";
import { STORIES, type Story } from "./stories";

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** One story after another: the bear at home or a kindergarten story, „Weiter“ brings the next. */
export function FeelingsPlay({ settings }: { settings: FeelingsSettings }) {
  const chosen = STORIES.find((s) => s.id === settings.story);
  const deck = useRef<Story[]>([]);

  // A picked story comes first and the others follow in list order, so „Weiter“ never plays the same one again.
  // Without one, all stories come in random order before any comes again.
  const pick = (after?: Story): Story => {
    if (chosen) return after ? STORIES[(STORIES.indexOf(after) + 1) % STORIES.length] : chosen;
    if (deck.current.length === 0) {
      deck.current = shuffle(STORIES);
      const last = deck.current.length - 1;
      if (deck.current[last] === after) [deck.current[0], deck.current[last]] = [deck.current[last], deck.current[0]];
    }
    return deck.current.pop()!;
  };

  const [now, setNow] = useState(() => ({ story: pick(), key: 0 }));
  const next = () => setNow({ story: pick(now.story), key: now.key + 1 });

  const { story } = now;
  return story.kind === "home" ? (
    <BearPlay key={now.key} feeling={story.feeling} settings={settings} onNext={next} />
  ) : (
    <KitaPlay key={now.key} situation={story.situation} settings={settings} onNext={next} />
  );
}
