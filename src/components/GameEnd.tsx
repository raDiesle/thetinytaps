import { useEffect, useState, type PointerEvent } from "react";
import { useCountsPlaytime, useEndShown } from "@/components/GameShell";
import { CheeringFamily, type MascotKind } from "@/components/Mascot";
import { useT } from "@/lib/language";
import { turnPageWith } from "@/lib/look";
import { countGame, gameEnded } from "@/lib/playtime";

interface GameEndProps {
  /** Plays the same level (picture, story …) once more. */
  onAgain: () => void;
  /**
   * The next level, after the last one the first again, and its name, read out with „Weiter“. Left out only where there
   * is no other level, so „Weiter“ would just be „Nochmal“.
   */
  next?: { name?: string; onNext: () => void };
  /** Waits this long before showing up, so the party can be watched first. */
  delayMs?: number;
  /**
   * Small buttons in the bottom right corner, so the picture stays free (Aufs Töpfchen, the user's choice there); taps
   * beside them reach the game.
   */
  corners?: boolean;
  /**
   * Leaves out the fox or bear family cheering beside the buttons, where the end picture shows its own (the Timer's).
   * In `corners` it is always left out: the picture there is the point.
   */
  noFamily?: boolean;
  /**
   * Lies in the game's own layout instead of over the picture's bottom, without the family: where a game places the
   * buttons beside its own end picture (Gefühle's cards' room, Zähne putzen's week chart and cheering foxes).
   */
  inline?: boolean;
  /**
   * Writes `next.name` under „Weiter“, where grown-ups should see what comes before they go on (Gefühle: the next
   * feeling, user feedback, November 2026). Elsewhere the name is only read out.
   */
  showNext?: boolean;
}

/**
 * The end of a level: play it again („Nochmal“) or go on to the next („Weiter“, only where there is another), and
 * beside them a fox or bear child jumping for joy with its grown-up waving (D-12). Words only, no emoji or symbols (user
 * feedback, November 2026): „Weiter“ is a big painted label, „Nochmal“ a smaller paper slip beside it. The way back is
 * no button here but the page's corner in the top left, as in every menu – the ✕, or the book's ribbon where the game
 * goes back onto the shelf (GameShell, told by `useEndShown`; a „Menü“ button was one way back too many, user feedback,
 * November 2026).
 */
export function GameEnd({ onAgain, next, delayMs = 0, corners = false, noFamily = false, inline = false, showNext = false }: GameEndProps) {
  const t = useT();
  const endShown = useEndShown();
  const counts = useCountsPlaytime();
  const [shown, setShown] = useState(delayMs <= 0);
  // Fox or bear, by chance at every end, so a child meets both.
  const [kind] = useState<MascotKind>(() => (Math.random() < 0.5 ? "fox" : "bear"));

  useEffect(() => {
    if (shown) return;
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [shown, delayMs]);

  // With the last game of a game limit, the game says good night instead (GameShell).
  useEffect(() => {
    if (shown && counts) gameEnded();
  }, [shown, counts]);

  // While the end is on screen, the corner in the top left is the way back.
  useEffect(() => {
    if (!shown) return;
    endShown(true);
    return () => endShown(false);
  }, [shown, endShown]);

  if (!shown) return null;

  // Pointer down, not click: it reacts right away, and the game underneath doesn't get the tap.
  // „Nochmal“ and „Weiter“ each start one more game, for a game limit.
  const press = (action: () => void) => (e: PointerEvent) => {
    e.stopPropagation();
    if (counts) countGame();
    // The next round comes on a new page.
    turnPageWith("forward", action);
  };

  return (
    <div className={`game-end${corners ? " corners" : ""}${inline ? " inline" : ""}`} data-tap-root onPointerDown={(e) => e.stopPropagation()}>
      {!corners && !inline && !noFamily && <CheeringFamily kind={kind} className="game-end-family" />}
      <div className="game-end-small">
        <button type="button" className="game-end-button again" onPointerDown={press(onAgain)}>
          {t({ de: "Nochmal", ru: "Ещё раз", en: "Again", zh: "再来一次", hi: "फिर से", es: "Otra vez", ar: "مرة أخرى" })}
        </button>
      </div>
      {next && (
        <button
          type="button"
          className="game-end-button next"
          aria-label={[t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" }), next.name]
            .filter(Boolean)
            .join(": ")}
          onPointerDown={press(next.onNext)}
        >
          {t({ de: "Weiter", ru: "Дальше", en: "Next", zh: "下一个", hi: "आगे", es: "Siguiente", ar: "التالي" })}
          {showNext && next.name && <span className="game-end-next-name">{next.name}</span>}
        </button>
      )}
    </div>
  );
}
