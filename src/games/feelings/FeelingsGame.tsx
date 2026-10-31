import { GameShell, type GameMode } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useAppLanguage, useT } from "@/lib/language";
import { FeelingsPlay } from "./FeelingsPlay";
import { storyIn } from "./localized";
import { MOOD_ID } from "./mood";
import { DEFAULT_FEELINGS_SETTINGS, FEELINGS_SETTINGS_KEY } from "./settings";
import { STORIES } from "./stories";
import "./feelings.css";

/** The start screen: one card per story – the bear's feelings at home and the kindergarten stories side by side; „Weiter“ goes on with the next. */
export function FeelingsGame() {
  const [settings, update] = useGameSettings(FEELINGS_SETTINGS_KEY, DEFAULT_FEELINGS_SETTINGS);
  const t = useT();
  const { id: language } = useAppLanguage();

  const modes: GameMode[] = [
    // Asks for the child's weather first, then the bear's story with that feeling.
    {
      id: MOOD_ID,
      emoji: "🌦️",
      title: t({ de: "Wie geht's dir?", ru: "Как дела?", en: "How are you?", zh: "心情怎么样？", hi: "कैसा लग रहा है?", es: "¿Cómo estás?", ar: "كيف حالك؟" }),
    },
    ...STORIES.map((story) => {
      const { id, emoji, title } = storyIn(story, language);
      return { id, emoji, title };
    }),
  ];

  return (
    <GameShell
      title={t({ de: "Gefühle", ru: "Чувства", en: "Feelings", zh: "情绪", hi: "भावनाएँ", es: "Emociones", ar: "المشاعر" })}
      emoji="🐻"
      modes={modes}
      mode={settings.story}
      onMode={(story) => update({ story })}
    >
      <FeelingsPlay settings={settings} />
    </GameShell>
  );
}
