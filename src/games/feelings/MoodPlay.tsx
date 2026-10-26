import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/language";
import type { FeelingId } from "./bear";
import { moodImages, preloadImages } from "./images";
import { MOOD_ANSWER, MOOD_QUESTION, WEATHERS, type Weather } from "./mood";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, FloaterLayer, StoryPicture, useFloaters, useTimers, useVoice } from "./shared";

/** How long the picked weather stays big before the bear's story begins. */
const ANSWER_MS = 2200;

/** Wie geht's dir heute? Four weather cards; the picked one shows big, then `onPick` plays the bear's story with that feeling. */
export function MoodPlay({ settings, onPick }: { settings: FeelingsSettings; onPick: (feeling: FeelingId) => void }) {
  const [picked, setPicked] = useState<Weather>();
  const { later } = useTimers();
  const { say, sound } = useVoice(settings);
  const { floaters, float } = useFloaters();
  const t = useT();

  useEffect(() => {
    preloadImages(WEATHERS.map((w) => moodImages.weather(w.id)));
    say(t(MOOD_QUESTION));
  }, []);

  const pick = useCallback(
    (weather: Weather) => {
      if (picked) return;
      setPicked(weather);
      say(t(MOOD_ANSWER));
      sound("chime");
      float(weather.float, 50, 55);
      later(() => onPick(weather.feeling), ANSWER_MS);
    },
    [picked, say, sound, float, later, onPick, t],
  );

  // Keys 1 to 4 pick that weather; any other key picks one, so every key does something.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const digit = Number(e.key) - 1;
      pick(WEATHERS[digit >= 0 && digit < WEATHERS.length ? digit : Math.floor(Math.random() * WEATHERS.length)]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pick]);

  return (
    <div className="story-play mood-play">
      <main className="story-middle">
        {picked ? (
          <StoryPicture name={moodImages.weather(picked.id)} caption={t(picked.caption)}>
            <FloaterLayer floaters={floaters} />
          </StoryPicture>
        ) : (
          <div className="mood-cards">
            {WEATHERS.map((w) => (
              <ChoiceCard key={w.id} image={moodImages.weather(w.id)} caption={t(w.caption)} state="choose" onChoose={() => pick(w)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
