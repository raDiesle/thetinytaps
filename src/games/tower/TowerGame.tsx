import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { TOWER_TITLE } from "./names";
import { TowerPlay } from "./TowerPlay";

/**
 * „Counting Tower“ (L-18), a game of the book „Buchstaben & Zahlen“. Nothing to choose before playing – the goals come
 * in turn – so it plays at once; ✕ and Esc go back to the book's table of contents.
 */
export function TowerGame() {
  const t = useT();
  return (
    <GameShell title={t(TOWER_TITLE)} startMode="play">
      <TowerPlay />
    </GameShell>
  );
}
