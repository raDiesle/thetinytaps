import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import "@/games/shadows/shadows.css";
import { AnimalsRounds } from "./AnimalsRounds";
import { ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS } from "./settings";
import "./animals.css";

/** The game's name, on its start screen and in the browser tab. */
export const ANIMALS_TITLE: Localized = {
  de: "Was gehört zum Tier?",
  ru: "Что нужно зверюшке?",
  en: "What Does the Animal Need?",
  zh: "小动物要什么？",
  hi: "जानवर को क्या चाहिए?",
  es: "¿Qué necesita el animal?",
  ar: "ماذا يحتاج الحيوان؟",
};

export function AnimalsGame() {
  const t = useT();
  const [settings] = useGameSettings(ANIMALS_SETTINGS_KEY, DEFAULT_ANIMALS_SETTINGS);

  return (
    <GameShell
      title={t(ANIMALS_TITLE)}
      // Nothing to choose: its three kinds of rounds take turns and the game finds the difficulty itself, so its card
      // plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      startMode="play"
    >
      <AnimalsRounds settings={settings} />
    </GameShell>
  );
}
