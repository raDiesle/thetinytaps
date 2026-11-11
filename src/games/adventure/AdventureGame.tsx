import { useMemo } from "react";
import { GameShell } from "@/components/GameShell";
import { type TargetLanguageId, targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { canPlayUnfinished } from "@/lib/localTest";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { AdventurePlay } from "./AdventurePlay";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { CLOUD_TRIP } from "./stories/cloudTrip";
import { type Story, storyIn, storyTitle } from "./stories/story";
import { TREASURE_ISLAND } from "./stories/treasureIsland";
import previews from "./vorschau/*.webp?glob";

/** The stories on the start screen, each a card; one `unfinished` says „in Bearbeitung“ and starts only on localhost. */
const STORIES: { id: AdventureStoryId; emoji: string; story: Story; unfinished?: true }[] = [
  { id: "schatzinsel", emoji: "🏝️", story: TREASURE_ISLAND },
  // Still being built (user decision, November 2026): tested on localhost only.
  { id: "wolkenreise", emoji: "☁️", story: CLOUD_TRIP, unfinished: true },
];

/** The start screen: no options of its own, music and Tapsi's language come from the home page. */
export function AdventureGame() {
  const [settings, update] = useStoredSettings(ADVENTURE_SETTINGS_KEY, DEFAULT_ADVENTURE_SETTINGS);
  const [common] = useCommonSettings();
  const t = useT();
  const app = useAppLanguage();
  // The stories that can be played here: those still being built only where they may be tested, or once a held card
  // unlocked them for the visit (`unlockUnfinished`) – so asked at every render, not once.
  const playable = STORIES.filter((s) => !s.unfinished || canPlayUnfinished());
  const at = Math.max(
    0,
    playable.findIndex((s) => s.id === settings.story),
  );
  const chosen = playable[at].story;
  // „Weiter“ at the end: the next story that can be played, after the last the first – none where there is only one.
  const next = playable.length > 1 ? playable[(at + 1) % playable.length] : undefined;
  // The app language, like every game. A story not told in it yet is said in English,
  // or else German – never German words with a Russian voice.
  const told = (id: string) => id === "de" || Boolean(chosen.translations?.[id as TargetLanguageId]);
  const language = targetLanguageFor(told(app.id) ? app.id : told("en") ? "en" : "de");
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(chosen, language.id), [chosen, language.id]);

  return (
    <GameShell
      previews={previews}
      title={t({
        de: "Bewegungsabenteuer",
        en: "Movement Adventures",
        zh: "运动大冒险",
        hi: "हलचल वाले रोमांच",
        es: "Aventuras en movimiento",
        ar: "مغامرات الحركة",
        ru: "Приключения в движении",
      })}
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: storyTitle(s.story, app.id), unfinished: s.unfinished }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
    >
      {/* Its own music, which plays while music is on for all games. */}
      <AdventurePlay
        key={story.sequence.title}
        story={story}
        language={language}
        settings={common}
        next={next && { name: storyTitle(next.story, app.id), onNext: () => update({ story: next.id }) }}
      />
    </GameShell>
  );
}
