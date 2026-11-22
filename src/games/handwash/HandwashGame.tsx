import { GameShell } from "@/components/GameShell";
import { useT } from "@/lib/language";
import { HandwashPlay } from "./HandwashPlay";
import { HANDWASH_TITLE } from "./names";
import "./handwash.css";

/**
 * Hände waschen (idea H-136): nothing to choose first, so the book starts the washing at once (a start screen with only
 * „Los geht’s!“ is no menu), and ✕ goes back to the page before it.
 */
export function HandwashGame() {
  const t = useT();
  return (
    <GameShell title={t(HANDWASH_TITLE)} startMode="play">
      <HandwashPlay />
    </GameShell>
  );
}
