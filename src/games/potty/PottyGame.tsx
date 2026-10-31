import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { PottyPlay } from "./PottyPlay";
import { DEFAULT_POTTY_SETTINGS, POTTY_SETTINGS_KEY } from "./settings";
import "./potty.css";

/** The game's name, on its start screen and in the browser tab. */
export const POTTY_TITLE: Localized = {
  de: "Aufs Töpfchen",
  en: "Potty Time",
  zh: "上小马桶",
  hi: "पॉटी का समय",
  es: "Al orinal",
  ar: "إلى النونية",
  ru: "На горшок",
};

export function PottyGame() {
  const t = useT();
  const [settings] = useGameSettings(POTTY_SETTINGS_KEY, DEFAULT_POTTY_SETTINGS);

  return (
    <GameShell
      title={t(POTTY_TITLE)}
      emoji="🚽"
      // Opened when the child has to go: the story starts at once, with no modes to pick (the star is its last step);
      // after ✕ the start screen has only „Los geht’s!“.
      startMode="story"
    >
      <PottyPlay settings={settings} />
    </GameShell>
  );
}
