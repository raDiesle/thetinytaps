import { type ReactNode, useEffect, useState } from "react";

// Parts the page and the wizard share, for the Belohnungstafel and the Tagesplan alike.

/** Grown-ups on a computer, with room to scroll: the same limit as the fixed back link (`playing.css`). */
const COMPUTER = "(min-width: 900px) and (any-pointer: fine)";

/** Whether this is a computer with a mouse and a wide window; follows the window as it changes. */
export function useComputer() {
  const [computer, setComputer] = useState(() => matchMedia(COMPUTER).matches);
  useEffect(() => {
    const query = matchMedia(COMPUTER);
    const change = () => setComputer(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return computer;
}

/** A button on top that opens (or, on a computer, scrolls to) a panel for grown-ups. */
export function PanelButton({ open, onClick, emoji, label }: { open: boolean; onClick: () => void; emoji: string; label: string }) {
  return (
    <button type="button" className="panel-button" aria-expanded={open} onClick={onClick}>
      <span aria-hidden>{emoji}</span> {label}
    </button>
  );
}

/**
 * A choice in the wizard shown as what it makes: a small picture of the result (or a big emoji), its name and, where
 * it helps, one line – so a grown-up sees what they decide on, as with the Vorlagen.
 */
export function Pick({
  selected,
  onClick,
  picture,
  emoji,
  label,
  hint,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  /** A small picture of the board or plan as it would be (`Thumb`, `PlanThumb`). */
  picture?: ReactNode;
  /** Without a picture: a big emoji, or the catalogue's picture in its place (`ItemPic`). */
  emoji?: ReactNode;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`rw-pick${picture ? " rw-pick-picture" : ""}${selected ? " selected" : ""}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      {picture}
      {!picture && emoji && (
        <span className="rw-pick-emoji" aria-hidden>
          {emoji}
        </span>
      )}
      <span className="rw-pick-label">{label}</span>
      {hint && <span className="rw-pick-hint">{hint}</span>}
    </button>
  );
}
