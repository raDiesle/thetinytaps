import { GameShell } from "@/components/GameShell";
import { useGameSettings } from "@/lib/common";
import { useT } from "@/lib/language";
import { SHADOWS_TITLE } from "./names";
import { ShadowsPlay } from "./ShadowsPlay";
import { DEFAULT_SHADOWS_SETTINGS, SHADOWS_SETTINGS_KEY } from "./settings";
import "./shadows.css";

export function ShadowsGame() {
  const t = useT();
  const [settings] = useGameSettings(SHADOWS_SETTINGS_KEY, DEFAULT_SHADOWS_SETTINGS);

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      // Nothing to choose: the game finds the right difficulty by itself and the pictures are picked while playing, so
      // its card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      startMode="play"
    >
      <ShadowsPlay settings={settings} />
    </GameShell>
  );
}
