import { useEffect, useState, type CSSProperties } from "react";

/** A screen whose shorter side is below this is a phone: its menus scroll as usual. */
const MIN_SCREEN = 600;
/** Cards smaller than this are too small to tap and read; the menu scrolls instead. */
const MIN_ROW = 100;
const MIN_WIDTH = 140;
/** Cards never grow taller than this, however much room there is. */
const MAX_ROW = 220;
/** Cards look best about this much wider than tall. */
const CARD_ASPECT = 1.4;
/** Space between the cards; matches `.game-list.fit` in the styles. */
const GAP = 24;
/** Room under the last row; matches the page's bottom padding while the cards fit. */
const BOTTOM = 32;

interface Fit {
  columns: number;
  row: number;
}

/** Columns and row height that give `count` cards the most room; `wide` of them take a whole row. */
function bestFit(count: number, wide: number, width: number, height: number): Fit | null {
  const rest = count - wide;
  let best: Fit | null = null;
  let bestSize = 0;
  for (let columns = 1; columns <= Math.max(1, rest); columns++) {
    const rows = wide + Math.ceil(rest / columns);
    const cardWidth = (width - (columns - 1) * GAP) / columns;
    const row = (height - (rows - 1) * GAP) / rows;
    if (row < MIN_ROW || cardWidth < MIN_WIDTH) continue;
    const size = Math.min(cardWidth / CARD_ASPECT, row);
    if (size > bestSize) {
      bestSize = size;
      best = { columns, row: Math.floor(Math.min(row, MAX_ROW)) };
    }
  }
  return best;
}

/** Height of the page's content from its top edge, without the bottom padding. */
function contentHeight(page: HTMLElement) {
  let top = Infinity;
  let bottom = -Infinity;
  for (const child of page.children) {
    const style = getComputedStyle(child);
    if (style.position === "fixed" || style.position === "absolute" || style.display === "none") continue;
    const rect = child.getBoundingClientRect();
    top = Math.min(top, rect.top - parseFloat(style.marginTop));
    bottom = Math.max(bottom, rect.bottom + parseFloat(style.marginBottom));
  }
  return bottom - top + parseFloat(getComputedStyle(page).paddingTop);
}

/**
 * On a tablet or computer, sizes a menu's card grid so that every card and
 * the buttons under it fit on one screen without scrolling. On a phone, or
 * when the cards would get too small, the menu keeps its usual scrolling list.
 */
export function useFitGrid(count: number, wide = 0) {
  // Kept as state, so a menu shown again (e.g. after playing) is measured anew.
  const [list, setList] = useState<HTMLUListElement | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);

  useEffect(() => {
    const page = list?.closest("main");
    if (!list || !page) return;
    const measure = () => {
      // An open settings panel grows the page below the cards; they keep their size.
      if (page.querySelector("details[open]")) return;
      const next =
        Math.min(window.innerWidth, window.innerHeight) < MIN_SCREEN
          ? null
          : bestFit(count, wide, list.clientWidth, window.innerHeight - (contentHeight(page) - list.offsetHeight) - BOTTOM);
      setFit((prev) => (prev?.columns === next?.columns && prev?.row === next?.row ? prev : next));
    };
    measure();
    // Also catches late changes above or below the cards, like fonts or the install hint.
    const observer = new ResizeObserver(measure);
    observer.observe(page);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list, count, wide]);

  return {
    ref: setList,
    className: fit ? "fit" : "",
    style: fit ? ({ "--fit-columns": fit.columns, "--fit-row": `${fit.row}px` } as CSSProperties) : undefined,
  };
}
