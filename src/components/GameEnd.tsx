import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { useT } from "@/lib/language";

interface GameEndProps {
  /** Plays the same level (picture, story …) once more. */
  onAgain: () => void;
  /** The next level, if there is one: its picture (an emoji or a small drawing) and name. */
  next?: { emoji: ReactNode; name: string; onNext: () => void };
  /** Waits this long before showing up, so the party can be watched first. */
  delayMs?: number;
}

/**
 * The end of a level: one big button to play it again and one to go on to the
 * next, right in the game, without the way back to the menu.
 */
export function GameEnd({ onAgain, next, delayMs = 0 }: GameEndProps) {
  const t = useT();
  const [shown, setShown] = useState(delayMs <= 0);

  useEffect(() => {
    if (shown) return;
    const timer = setTimeout(() => setShown(true), delayMs);
    return () => clearTimeout(timer);
  }, [shown, delayMs]);

  if (!shown) return null;

  // Pointer down, not click: it reacts right away, and the game underneath doesn't get the tap.
  const press = (action: () => void) => (e: PointerEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="game-end" onPointerDown={(e) => e.stopPropagation()}>
      <button type="button" className="game-end-button again" onPointerDown={press(onAgain)}>
        <span className="game-end-emoji" aria-hidden>
          🔁
        </span>
        {t({ de: "Nochmal", ru: "Ещё раз" })}
      </button>
      {next && (
        <button
          type="button"
          className="game-end-button next"
          aria-label={`${t({ de: "Weiter", ru: "Дальше" })}: ${next.name}`}
          onPointerDown={press(next.onNext)}
        >
          <span className="game-end-emoji" aria-hidden>
            {next.emoji}
          </span>
          {t({ de: "Weiter", ru: "Дальше" })} ▶
        </button>
      )}
    </div>
  );
}
