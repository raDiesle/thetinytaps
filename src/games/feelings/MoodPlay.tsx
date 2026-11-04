import { useCallback, useEffect, useState } from "react";
import { PROD } from "@/lib/buildInfo";
import { useT } from "@/lib/language";
import { imageFor, moodImages, preloadImages } from "./images";
import { HELP_QUESTION, HELPS, type Help, type HelpId, MOOD_ANSWER, MOOD_QUESTION, WEATHERS, type Weather } from "./mood";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, StoryPicture, useTimers, useVoice } from "./shared";

/** How long the picked weather, and then the picked help, stay big before the next part begins. */
const ANSWER_MS = 2200;

/** Whether „Was hilft dir jetzt?“ is asked: the built site leaves it out until all its pictures are made, the dev server shows their placeholders. */
const ASKS_HELP = !PROD || (Object.keys(HELPS) as HelpId[]).every((id) => imageFor(moodImages.help(id)));

/**
 * Wie geht's dir heute? Four weather cards; the picked one shows big, then „Was hilft dir jetzt?“ offers three things
 * that fit that feeling (idea C-31), the picked one shows big, and `onPick` plays the scenes of that feeling (its group).
 */
export function MoodPlay({ settings, onPick }: { settings: FeelingsSettings; onPick: (group: string) => void }) {
  const [weather, setWeather] = useState<Weather>();
  /** The three helps are on the screen. */
  const [asking, setAsking] = useState(false);
  const [help, setHelp] = useState<Help>();
  const { later } = useTimers();
  const { say, sound, preload } = useVoice(settings);
  const t = useT();

  useEffect(() => {
    preloadImages(WEATHERS.map((w) => moodImages.weather(w.id)));
    if (ASKS_HELP) preload([t(HELP_QUESTION), ...Object.values(HELPS).map((h) => t(h.answer))]);
    say(t(MOOD_QUESTION));
  }, []);

  const pickWeather = useCallback(
    (picked: Weather) => {
      if (weather) return;
      setWeather(picked);
      say(t(MOOD_ANSWER));
      sound("chime");
      if (!ASKS_HELP) return later(() => onPick(picked.group), ANSWER_MS);
      preloadImages(picked.helps.map(moodImages.help));
      later(() => {
        setAsking(true);
        say(t(HELP_QUESTION));
      }, ANSWER_MS);
    },
    [weather, say, sound, later, onPick, t],
  );

  const pickHelp = useCallback(
    (picked: Help) => {
      if (!weather || !asking || help) return;
      setHelp(picked);
      say(t(picked.answer));
      sound("chime");
      later(() => onPick(weather.group), ANSWER_MS);
    },
    [weather, asking, help, say, sound, later, onPick, t],
  );

  // Keys 1 to 4 pick that weather (1 to 3 that help); any other key picks one, so every key does something.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat) return;
      const choose = <T,>(list: T[]) => {
        const digit = Number(e.key) - 1;
        return list[digit >= 0 && digit < list.length ? digit : Math.floor(Math.random() * list.length)];
      };
      if (!weather) pickWeather(choose(WEATHERS));
      else if (asking) pickHelp(HELPS[choose(weather.helps)]);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [weather, asking, pickWeather, pickHelp]);

  return (
    <div className="story-play mood-play">
      <main className="story-middle">
        {help ? (
          <StoryPicture key={help.id} name={moodImages.help(help.id)} caption={t(help.caption)} />
        ) : asking && weather ? (
          <div className="mood-cards mood-helps">
            {weather.helps.map((id) => (
              <ChoiceCard key={id} image={moodImages.help(id)} caption={t(HELPS[id].caption)} state="choose" onChoose={() => pickHelp(HELPS[id])} />
            ))}
          </div>
        ) : weather ? (
          <StoryPicture key={weather.id} name={moodImages.weather(weather.id)} caption={t(weather.caption)} />
        ) : (
          <div className="mood-cards">
            {WEATHERS.map((w) => (
              <ChoiceCard key={w.id} image={moodImages.weather(w.id)} caption={t(w.caption)} state="choose" onChoose={() => pickWeather(w)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
