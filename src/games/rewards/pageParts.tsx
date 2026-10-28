import { useEffect, useState } from "react";

// Parts the two pages of this folder share: the Belohnungstafel and the Tagesplan.

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
