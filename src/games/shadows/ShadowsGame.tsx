import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY } from "./settings";
import "./shadows.css";

/** The game's name, on its start screen and in the browser tab. */
export const SHADOWS_TITLE: Localized = {
  de: "Schatten finden",
  ru: "Найди тень",
  en: "Find the Shadow",
  zh: "找影子",
  hi: "परछाईं ढूँढो",
  es: "Busca la sombra",
  ar: "أين الظل؟",
};

export function ShadowsGame() {
  const t = useT();
  const [settings] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      emoji="👤"
      // Nothing to choose: the game finds the right difficulty by itself and the pictures are picked while playing, so
      // its card plays at once; after ✕ the start screen has only „Los geht’s!“.
      startMode="play"
    >
      <ShadowsPlay settings={settings} />
    </GameShell>
  );
}
