import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { type Story, storyIn, storyTitle } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";

/** The stories on the start screen, each a card. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP },
];

/** The start screen: no options of its own, music and Tapsi's language come from the home page. */
export function AdventureGame() {
  const [settings, update] = useStoredSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const t = useT();
  const app = useAppLanguage();
  const at = Math.max(
    0,
    STORIES.findIndex((s) => s.id === settings.story),
  );
  const chosen = STORIES[at].story;
  // „Weiter“ at the end: the next story on the start screen, after the last the first.
  const next = STORIES[(at + 1) % STORIES.length];
  // The app language, like every game. A story not told in it yet is said in English,
  // or else German – never German words with a Russian voice.
  const told = (id: string) => id === "de" || Boolean(chosen.translations?.[id as TargetLanguageId]);
  const language = targetLanguageFor(told(app.id) ? app.id : told("en") ? "en" : "de");
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(chosen, language.id), [chosen, language.id]);

  return (
    <GameShell
      title={t({
        de: "Bewegungsabenteuer",
        en: "Movement Adventures",
        zh: "运动大冒险",
        hi: "हलचल वाले रोमांच",
        es: "Aventuras en movimiento",
        ar: "مغامرات الحركة",
        ru: "Приключения в движении",
      })}
      emoji="🏝️"
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: storyTitle(s.story, app.id) }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
    >
      {/* Its own music, which plays while music is on for all games. */}
      <AdventurePlay
        key={story.sequence.title}
        story={story}
        language={language}
        settings={common}
        next={{ emoji: next.emoji, name: storyTitle(next.story, app.id), onNext: () => update({ story: next.id }) }}
      />
    </GameShell>
  );
}
