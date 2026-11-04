import { useCallback, useEffect, useState } from "react";
import { PROD } from "@/lib/buildInfo";
import { useT } from "@/lib/language";
import { finishRoutineStep } from "@/lib/routine";
import { imageFor, moodImages, preloadImages } from "./images";
import {
  HELP_QUESTION,
  HELPS,
  type Help,
  type HelpId,
  loadMoodDay,
  MOOD_ANSWER,
  MOOD_QUESTION,
  morningMood,
  NOW,
  saveMoodDay,
  THIS_MORNING,
  WEATHERS,
  type Weather,
  withMood,
} from "./mood";
import type { FeelingsSettings } from "./settings";
import { ChoiceCard, StoryPicture, useTimers, useVoice } from "./shared";

/** How long the picked weather, and then the picked help, stay big before the next part begins. */
const ANSWER_MS = 2200;
/** In the evening beside the morning's weather a little longer, for the grown-up to talk about it. */
const COMPARE_MS = 4500;

/** Whether „Was hilft dir jetzt?“ is asked: the built site leaves it out until all its pictures are made, the dev server shows their placeholders. */
const ASKS_HELP = !PROD || (Object.keys(HELPS) as HelpId[]).every((id) => imageFor(moodImages.help(id)));

/**
 * Wie geht's dir heute? Four weather cards; the picked one shows big – in the evening beside the one picked this
 * morning, „Heute früh“ and „Jetzt“ (C-33) – then „Was hilft dir jetzt?“ offers three things
 * that fit that feeling (idea C-31), the picked one shows big, and `onPick` plays the scenes of that feeling (its group).
 */
export function MoodPlay({ settings, onPick }: { settings: FeelingsSettings; onPick: (group: string) => void }) {
  const [weather, setWeather] = useState<Weather>();
  /** The three helps are on the screen. */
  const [asking, setAsking] = useState(false);
  const [help, setHelp] = useState<Help>();
  /** In the evening, this morning's weather, shown beside the one just picked. */
  const [morning, setMorning] = useState<Weather>();
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
      // The answer a plan's „Wie geht's dir?“ card waited for (the Tagesplan, rituals.ts): it is ticked on the way back.
      finishRoutineStep();
      const now = new Date();
      const day = loadMoodDay();
      const before = WEATHERS.find((w) => w.id === morningMood(day, now));
      setMorning(before);
      saveMoodDay(withMood(day, picked.id, now));
      say(t(MOOD_ANSWER));
      sound("chime");
      const wait = before ? COMPARE_MS : ANSWER_MS;
      if (!ASKS_HELP) return later(() => onPick(picked.group), wait);
      preloadImages(picked.helps.map(moodImages.help));
      later(() => {
        setAsking(true);
        say(t(HELP_QUESTION));
      }, wait);
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
        ) : weather && morning ? (
          <div className="mood-cards mood-compare">
            <ChoiceCard image={moodImages.weather(morning.id)} caption={`${t(THIS_MORNING)}: ${t(morning.caption)}`} state="rest" />
            <ChoiceCard image={moodImages.weather(weather.id)} caption={`${t(NOW)}: ${t(weather.caption)}`} state="rest" />
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
