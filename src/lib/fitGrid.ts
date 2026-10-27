import { useEffect, useState, type CSSProperties } from "react";

/** A screen whose shorter side is below this is a phone; matches the phone media queries in the styles. */
export const PHONE_SCREEN = 600;
/** Cards smaller than this are too small to tap and read; the menu scrolls instead. A phone takes smaller ones, so more fit. */
const MIN_ROW = 100;
const MIN_ROW_PHONE = 64;
const MIN_WIDTH = 140;
const MIN_WIDTH_PHONE = 100;
/** Cards never grow taller than this, however much room there is. */
const MAX_ROW = 220;
/** Cards look best about this much wider than tall. */
const CARD_ASPECT = 1.4;
/** Rows lower than this show emoji and title side by side (see `.game-list.fit` in the styles), which needs wider cards. */
const FLAT_ROW = 130;
const FLAT_ASPECT = 2.4;
/** Space between the cards; matches `.game-list.fit` in the styles (smaller on a phone). */
const GAP = 24;
const GAP_PHONE = 14;
/** Room under the last row; matches the page's bottom padding while the cards fit. */
const BOTTOM = 32;
const BOTTOM_PHONE = 12;

interface Fit {
  columns: number;
  row: number;
}

/** Columns and row height that give `count` cards the most room. */
function bestFit(count: number, width: number, height: number, phone: boolean): Fit | null {
  const minRow = phone ? MIN_ROW_PHONE : MIN_ROW;
  const minWidth = phone ? MIN_WIDTH_PHONE : MIN_WIDTH;
  const gap = phone ? GAP_PHONE : GAP;
  let best: Fit | null = null;
  let bestSize = 0;
  for (let columns = 1; columns <= Math.max(1, count); columns++) {
    const rows = Math.ceil(count / columns);
    const cardWidth = (width - (columns - 1) * gap) / columns;
    const row = (height - (rows - 1) * gap) / rows;
    if (row < minRow || cardWidth < minWidth) continue;
    const size = Math.min(cardWidth / (row < FLAT_ROW ? FLAT_ASPECT : CARD_ASPECT), row);
    if (size > bestSize) {
      bestSize = size;
      best = { columns, row: Math.floor(Math.min(row, MAX_ROW)) };
    }
  }
  return best;
}

/** Height of the page's content from its top edge, without the bottom padding and the footer for grown-ups. */
function contentHeight(page: HTMLElement) {
  let top = Infinity;
  let bottom = -Infinity;
  for (const child of page.children) {
    const style = getComputedStyle(child);
    if (style.position === "fixed" || style.position === "absolute" || style.display === "none") continue;
    if (child instanceof HTMLElement && child.dataset.belowFold !== undefined) continue;
    const rect = child.getBoundingClientRect();
    top = Math.min(top, rect.top - parseFloat(style.marginTop));
    bottom = Math.max(bottom, rect.bottom + parseFloat(style.marginBottom));
  }
  return bottom - top + parseFloat(getComputedStyle(page).paddingTop);
}

/**
 * Sizes a menu's card grid so that every card and the buttons under it fit on
 * one screen without scrolling, on phones too (with smaller, flatter cards).
 * Only when the cards would get too small does the menu keep its scrolling list.
 * What is marked `data-below-fold` (the install hint for grown-ups) is left out:
 * it waits below the cards until a grown-up scrolls down.
 */
export function useFitGrid(count: number) {
  // Kept as state, so a menu shown again (e.g. after playing) is measured anew.
  const [list, setList] = useState<HTMLUListElement | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);

  useEffect(() => {
    const page = list?.closest("main");
    if (!list || !page) return;
    const measure = () => {
      // An open settings panel grows the page below the cards; they keep their size.
      if (page.querySelector("details[open]")) return;
      const phone = Math.min(window.innerWidth, window.innerHeight) < PHONE_SCREEN;
      const next = bestFit(count, list.clientWidth, window.innerHeight - (contentHeight(page) - list.offsetHeight) - (phone ? BOTTOM_PHONE : BOTTOM), phone);
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
  }, [list, count]);

  return {
    ref: setList,
    className: fit ? "fit" : "",
    style: fit ? ({ "--fit-columns": fit.columns, "--fit-row": `${fit.row}px` } as CSSProperties) : undefined,
  };
}
