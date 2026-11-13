import type { PointerEvent } from "react";
import { screenTap } from "@/lib/tapGuard";
import "./stepBack.css";

/**
 * The way back to the scene before in a game of short scenes (root `CLAUDE.md`, „A game of short scenes … has a way
 * back bottom left“): a round paper button with ◀, first in Gefühle's „Alltagssituationen“, now shared by every such
 * game, so each finds the same sign. Only a tap on it goes back, never on; a quick second tap changes nothing on the
 * screen the first one brought (`screenTap`). The game places it with `className` (bottom left, as big as its ▶).
 */
export function StepBack({ onBack, label, className }: { onBack: () => void; label: string; className: string }) {
  return (
    <button
      type="button"
      className={`step-back ${className}`}
      data-tap=""
      aria-label={label}
      onPointerDown={(e: PointerEvent) => {
        e.stopPropagation();
        if (screenTap()) onBack();
      }}
    >
      <svg className="step-back-sign" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r="44" />
        <path d="M60 30 L28 50 L60 70 Z" />
      </svg>
    </button>
  );
}
