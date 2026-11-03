import { useEffect, useState, type PointerEvent } from "react";
import { useCountsPlaytime, useLeaveGame } from "@/components/GameShell";
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
   * Small buttons in the bottom corners, „Menü“ left and the others right, so the picture stays free (Aufs Töpfchen,
   * the user's choice there); taps between them reach the game.
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
}

/**
 * The end of a level: back to the game's start screen („Menü“), play it again („Nochmal“) or go on to the next
 * („Weiter“, only where there is another), and beside them a fox or bear child jumping for joy with its grown-up waving
 * (D-12). Words only, no emoji or symbols (user feedback, November 2026): „Weiter“ is a big painted label, „Menü“ and
 * „Nochmal“ two smaller paper slips stacked beside it.
 */
export function GameEnd({ onAgain, next, delayMs = 0, corners = false, noFamily = false, inline = false }: GameEndProps) {
  const t = useT();
  const leave = useLeaveGame();
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
        {/* A click, not pointer down: leaving on the way down would let the lifted finger tap the start screen. */}
        <button type="button" className="game-end-button menu" onClick={leave}>
          {t({ de: "Menü", ru: "Меню", en: "Menu", zh: "菜单", hi: "मेन्यू", es: "Menú", ar: "القائمة" })}
        </button>
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
        </button>
      )}
    </div>
  );
}
