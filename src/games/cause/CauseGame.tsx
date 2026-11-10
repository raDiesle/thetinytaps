import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { CausePlay } from "./CausePlay";
import { CAUSE_TITLE } from "./names";
// Laid out like Gefühle's „Alltagssituationen“, with its picture components and their styles.
import "../feelings/feelings.css";

/**
 * „Was ist passiert?“, a game of the book „Gefühle“. Nothing to choose before playing, so it plays at once; ✕ and Esc go
 * back to the book's table of contents, as for the other games of the book.
 */
export function CauseGame() {
  const t = useT();
  return (
    <GameShell title={t(CAUSE_TITLE)} startMode="play">
      <CausePlay />
    </GameShell>
  );
}
