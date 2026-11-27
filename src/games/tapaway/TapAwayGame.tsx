import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { TAP_AWAY_TITLE } from "./names";
import { TapAwayPlay } from "./TapAwayPlay";

/** „Tap Magic“: nothing to choose, so it plays at once; ✕ and Esc lead back to the shelf (GameShell). */
export function TapAwayGame() {
  const t = useT();
  return (
    <GameShell title={t(TAP_AWAY_TITLE)} startMode="play">
      <TapAwayPlay />
    </GameShell>
  );
}
