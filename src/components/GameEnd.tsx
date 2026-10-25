import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { useLeaveGame } from "@/components/GameShell";

interface GameEndProps {
  /** Plays the same level (picture, story …) once more. */
  onAgain: () => void;
  /** The next level, after the last one the first again: its picture (an emoji or a small drawing) and name. */
  next: { emoji: ReactNode; name: string; onNext: () => void };
  /** Waits this long before showing up, so the party can be watched first. */
  delayMs?: number;
}

/**
 * The end of a level: three big buttons, back to the game's start screen
 * („Menü“), play it again („Nochmal“) or go on to the next („Weiter“).
 */
export function GameEnd({ onAgain, next, delayMs = 0 }: GameEndProps) {
  const leave = useLeaveGame();
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
    <div className="game-end" data-tap-root onPointerDown={(e) => e.stopPropagation()}>
      {/* A click, not pointer down: leaving on the way down would let the lifted finger tap the start screen. */}
      <button type="button" className="game-end-button menu" onClick={leave}>
        <span className="game-end-emoji" aria-hidden>
          <MenuIcon />
        </span>
        Menü
      </button>
      <button type="button" className="game-end-button again" onPointerDown={press(onAgain)}>
        <span className="game-end-emoji" aria-hidden>
          🔁
        </span>
        Nochmal
      </button>
      <button type="button" className="game-end-button next" aria-label={`Weiter: ${next.name}`} onPointerDown={press(next.onNext)}>
        <span className="game-end-emoji" aria-hidden>
          {next.emoji}
        </span>
        Weiter ▶
      </button>
    </div>
  );
}

/**
 * The picture on „Menü“: four cards, like the game's own start screen where its modes are picked –
 * not a house, which would look like the home page.
 */
export function MenuIcon() {
  return (
    <svg className="menu-icon" viewBox="0 0 24 24" aria-hidden>
      <rect x="2" y="2" width="9" height="9" rx="2" style={{ fill: "var(--ocean)" }} />
      <rect x="13" y="2" width="9" height="9" rx="2" style={{ fill: "var(--mint)" }} />
      <rect x="2" y="13" width="9" height="9" rx="2" style={{ fill: "var(--sunshine)" }} />
      <rect x="13" y="13" width="9" height="9" rx="2" style={{ fill: "var(--berry)" }} />
    </svg>
  );
}
