import { Suspense, use, useMemo } from "react";
import type { NextLevel } from "@/components/GameEnd";
import { GameShell } from "@/components/GameShell";
import { PageLoading } from "@/components/PageLoading";
import { type TargetLanguage, targetLanguageFor } from "@/content/targetLanguages";
import { type CommonSettings, useCommonSettings } from "@/lib/common";
import { canPlayUnfinished } from "@/lib/localTest";
import { useAppLanguage, useT } from "@/lib/language";
import { useStoredSettings } from "@/lib/storage";
import { entryTitle, entryToldIn, loadPlay, loadStory, STORIES, type StoryEntry } from "./catalog";
import { ADVENTURE_SETTINGS_KEY, type AdventureStoryId, DEFAULT_ADVENTURE_SETTINGS } from "./settings";
import { storyIn } from "./stories/story";
import previews from "./vorschau/*.webp?glob";

// The player with three.js and each story are chunks of their own (catalog.ts): this start screen loads neither.

/** The player's and a story's code, which a tap on the story's card waits for a moment before the page turns. */
const codeFor = (id?: string) => {
  const entry = STORIES.find((s) => s.id === id);
  return Promise.all([loadPlay(), entry && loadStory(entry)]);
};

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
  const chosen = playable[at];
  // „Weiter“ at the end: the next story that can be played, after the last the first – none where there is only one.
  const next = playable.length > 1 ? playable[(at + 1) % playable.length] : undefined;
  // The app language, like every game. A story not told in it yet is said in English, or else in the language it was
  // written in – never German words with a Russian voice.
  const language = targetLanguageFor(entryToldIn(chosen, app.id) ? app.id : entryToldIn(chosen, "en") ? "en" : chosen.language);

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
      modes={STORIES.map((s) => ({ id: s.id, emoji: s.emoji, title: entryTitle(s, app.id), unfinished: s.unfinished }))}
      mode={settings.story}
      onMode={(id) => update({ story: id as AdventureStoryId })}
      prepare={(id) => codeFor(id ?? chosen.id)}
    >
      {/* The paper with the paw track while the player's or the story's code still loads – never a dark screen. */}
      <Suspense fallback={<PageLoading />}>
        <StoryPlay
          key={chosen.id}
          entry={chosen}
          language={language}
          settings={common}
          next={next && { name: entryTitle(next, app.id), onNext: () => update({ story: next.id }), picture: previews[`${next.id}.webp`] }}
        />
      </Suspense>
    </GameShell>
  );
}

/** One story played: waits (suspends) for its code, then hands it to the player in its language. */
function StoryPlay({ entry, language, settings, next }: { entry: StoryEntry; language: TargetLanguage; settings: CommonSettings; next?: NextLevel }) {
  // Read at once where they were fetched ahead, so the story's first picture is drawn before the page turns to it.
  const loaded = use(loadStory(entry));
  const { AdventurePlay } = use(loadPlay());
  // Built once per story and language: the game starts anew when the story changes.
  const story = useMemo(() => storyIn(loaded, language.id), [loaded, language.id]);
  // Its own music, which plays while music is on for all games.
  return <AdventurePlay story={story} storyId={entry.id} language={language} settings={settings} next={next} />;
}
