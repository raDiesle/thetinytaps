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
/** Extra room above each line of grouped cards for the group's name; matches `--group-label` in the styles. */
const LABEL = 12;
const LABEL_PHONE = 12;
/** Room under the last row; matches the page's bottom padding while the cards fit. */
const BOTTOM = 32;
const BOTTOM_PHONE = 12;

interface Fit {
  columns: number;
  row: number;
}

/** Where a group of cards sits in the grid: its first column and card row (from 0), and how many of each it takes. */
export interface GroupPlace {
  column: number;
  row: number;
  /** The line of groups it belongs to; each line has the groups' names above it. */
  line: number;
  width: number;
  height: number;
}

/**
 * Lays groups of cards out in lines, each group a rectangle of whole rows. A group that fits in one row shares a line
 * with others while there is room (the first line with room, so a small group may sit beside an earlier one);
 * a longer group fills the whole width and has its lines to itself.
 */
export function packGroups(sizes: number[], columns: number): { places: GroupPlace[]; lines: number[] } {
  const lines: { used: number; height: number }[] = [];
  const places = sizes.map((size) => {
    const width = Math.min(size, columns);
    const height = Math.ceil(size / columns);
    let line = height === 1 ? lines.findIndex((l) => l.height === 1 && l.used + width <= columns) : -1;
    if (line < 0) line = lines.push({ used: 0, height }) - 1;
    const column = lines[line].used;
    lines[line].used += width;
    return { column, line, width, height };
  });
  const heights = lines.map((l) => l.height);
  const firstRow = (line: number) => heights.slice(0, line).reduce((a, b) => a + b, 0);
  return { places: places.map((p) => ({ ...p, row: firstRow(p.line) })), lines: heights };
}

/** Columns and row height that give `count` cards the most room; with `groups` (their sizes) every group keeps together. */
function bestFit(count: number, width: number, height: number, phone: boolean, groups?: number[]): Fit | null {
  const minRow = phone ? MIN_ROW_PHONE : MIN_ROW;
  const minWidth = phone ? MIN_WIDTH_PHONE : MIN_WIDTH;
  const gap = phone ? GAP_PHONE : GAP;
  let best: Fit | null = null;
  let bestSize = 0;
  for (let columns = 1; columns <= Math.max(1, count); columns++) {
    const lines = groups ? packGroups(groups, columns).lines : [Math.ceil(count / columns)];
    const rows = lines.reduce((a, b) => a + b, 0);
    // Each line of groups has its names above it: one more track and gap.
    const labels = groups ? lines.length * ((phone ? LABEL_PHONE : LABEL) + gap) : 0;
    const cardWidth = (width - (columns - 1) * gap) / columns;
    const row = (height - labels - (rows - 1) * gap) / rows;
    if (row < minRow || cardWidth < minWidth) continue;
    const size = Math.min(cardWidth / (row < FLAT_ROW ? FLAT_ASPECT : CARD_ASPECT), row);
    if (size > bestSize) {
      bestSize = size;
      best = { columns, row: Math.floor(Math.min(row, MAX_ROW)) };
    }
  }
  return best;
}

/**
 * Height of the page's content from its top edge, without the bottom padding and the footer for grown-ups.
 * The free room a `data-spread` part takes with its auto margins (to centre itself between the top row and
 * the bottom edge) is left out: it is there for the cards to grow into.
 */
function contentHeight(page: HTMLElement) {
  let top = Infinity;
  let bottom = -Infinity;
  let free = 0;
  for (const child of page.children) {
    const style = getComputedStyle(child);
    if (style.position === "fixed" || style.position === "absolute" || style.display === "none") continue;
    if (child instanceof HTMLElement && child.dataset.belowFold !== undefined) continue;
    const rect = child.getBoundingClientRect();
    top = Math.min(top, rect.top - parseFloat(style.marginTop));
    bottom = Math.max(bottom, rect.bottom + parseFloat(style.marginBottom));
    if (child instanceof HTMLElement && child.dataset.spread !== undefined) free += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
  }
  return bottom - top - free + parseFloat(getComputedStyle(page).paddingTop);
}

/** Whether the screen is a phone's (its shorter side below `PHONE_SCREEN`). */
export const isPhone = () => Math.min(window.innerWidth, window.innerHeight) < PHONE_SCREEN;

/**
 * How tall `part` of the menu `page` may grow so that the page's first screen holds everything above and below it
 * (not what waits `data-below-fold`), with the room under the last row the cards keep.
 */
export function roomFor(part: HTMLElement, page: HTMLElement) {
  return window.innerHeight - (contentHeight(page) - part.offsetHeight) - (isPhone() ? BOTTOM_PHONE : BOTTOM);
}

/**
 * Sizes a menu's card grid so that every card and what is around it fit on
 * one screen without scrolling, on phones too (with smaller, flatter cards).
 * Only when the cards would get too small does the menu keep its scrolling list.
 * What is marked `data-below-fold` (the install hint for grown-ups) is left out:
 * it waits below the cards until a grown-up scrolls down.
 * With `groups` (the sizes of runs of cards that belong together, in order) each group is kept in one rectangle
 * with its name above it: `places` gives each group's place in the grid.
 */
export function useFitGrid(count: number, groups?: number[]) {
  // Kept as state, so a menu shown again (e.g. after playing) is measured anew.
  const [list, setList] = useState<HTMLUListElement | null>(null);
  const [fit, setFit] = useState<Fit | null>(null);

  useEffect(() => {
    const page = list?.closest("main");
    if (!list || !page) return;
    const measure = () => {
      // An open settings panel grows the page below the cards; they keep their size.
      if (page.querySelector(":is(.panel-button, .panel-icon)[aria-expanded='true']")) return;
      const phone = isPhone();
      const next = bestFit(count, list.clientWidth, roomFor(list, page), phone, groups);
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
  }, [list, count, groups?.join()]);

  const packed = fit && groups ? packGroups(groups, fit.columns) : undefined;
  // A track for the names above each line of groups, then the line's card rows.
  const rows = packed?.lines.map((height) => `var(--group-label) repeat(${height}, var(--fit-row))`).join(" ");
  return {
    ref: setList,
    className: fit ? "fit" : "",
    style: fit ? ({ "--fit-columns": fit.columns, "--fit-row": `${fit.row}px`, gridTemplateRows: rows } as CSSProperties) : undefined,
    places: packed?.places.map(
      (p): CSSProperties => ({ gridColumn: `${p.column + 1} / span ${p.width}`, gridRow: `${p.row + p.line + 1} / span ${p.height + 1}` }),
    ),
  };
}
