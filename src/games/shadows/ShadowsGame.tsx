import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { SHADOWS_TITLE } from "./names";
import { ShadowsPlay } from "./ShadowsPlay";
import "./shadows.css";

export function ShadowsGame() {
  const t = useT();

  return (
    <GameShell
      title={t(SHADOWS_TITLE)}
      // Nothing to choose: the game finds the right difficulty by itself and the pictures are picked while playing, so
      // its card plays at once; ✕ and „Menü“ go back to the table of contents (GameShell), there is no start screen.
      startMode="play"
    >
      <ShadowsPlay />
    </GameShell>
  );
}
