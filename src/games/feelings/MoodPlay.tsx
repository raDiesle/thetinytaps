import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/language";
import { moodImages, preloadImages } from "./images";
import { MOOD_ANSWER, MOOD_QUESTION, WEATHERS, type Weather } from "./mood";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, StoryPicture, useTimers, useVoice } from "./shared";

/** How long the picked weather stays big before the scenes of that feeling begin. */
const ANSWER_MS = 2200;

/** Wie geht's dir heute? Four weather cards; the picked one shows big, then `onPick` plays the scenes of that feeling (its group). */
export function MoodPlay({ settings, onPick }: { settings: FeelingsSettings; onPick: (group: string) => void }) {
  const [picked, setPicked] = useState<Weather>();
  const { later } = useTimers();
  const { say, sound } = useVoice(settings);
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
      later(() => onPick(weather.group), ANSWER_MS);
    },
    [picked, say, sound, later, onPick, t],
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
          <StoryPicture name={moodImages.weather(picked.id)} caption={t(picked.caption)} />
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
