import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";

/** A screen whose shorter side is below this is a phone; matches the phone media queries in the styles. */
export const PHONE_SCREEN = 600;
/** Cards smaller than this are too small to tap and read; the menu scrolls instead. A phone takes smaller ones, so more fit. */
const MIN_ROW = 100;
const MIN_ROW_PHONE = 64;
const MIN_WIDTH = 140;
const MIN_WIDTH_PHONE = 100;
/**
 * Cards that are a picture with no words on them (the Timer's) need no room for a title: the picture alone must be big
 * enough to know it, so they may be narrower – with its sixteenth timed picture, the Marble Jar, the Timer's cards fit
 * a tablet's screen only in seven columns, 118 px each (November 2026), and with the Rennstrecke, the fourth way of
 * taking turns beside them two by two, only in eight, about 100 px each (24 November 2026) – as narrow as a phone's card.
 */
const MIN_PICTURE_WIDTH = 100;
/** Cards never grow taller than this, however much room there is. */
const MAX_ROW = 220;
/** Cards look best about this much wider than tall. */
const CARD_ASPECT = 1.4;
/** Rows lower than this show emoji and title side by side (see `.game-list.fit` in the styles), which needs wider cards. */
const FLAT_ROW = 130;
const FLAT_ASPECT = 2.4;
/**
 * Cards with a preview picture (`pictureCard`) are always the picture (3 : 2) above a name in one line, never flat:
 * the grid is chosen so the pictures come out biggest. Smaller than this a picture can't be made out, and the menu
 * scrolls instead.
 */
const MIN_PICTURE = 120;
const MIN_PICTURE_PHONE = 84;
/**
 * Cards with a picture may grow taller than other cards: the picture is what is looked at. Only a big screen keeps them
 * below this; on a phone or tablet they take all the room there is (user request, November 2026: two or three cards on
 * a tablet left a third of the room under and beside them empty).
 */
const MAX_PICTURE_ROW = 280;
/** A screen whose shorter side is below this is a phone's or a tablet's (an iPad Pro is 1024), where cards with a picture are never capped. */
export const TABLET_SCREEN = 1050;
/** The card's paper round its picture, on each side; matches `--pic-pad` in `book.css`. */
const PICTURE_PAD = 8;
const PICTURE_PAD_PHONE = 6;
/** The room the name takes under the picture, as part of the row (its font follows the card's height in `book.css`). */
const NAME_SHARE = 0.17;
/** `bestFit`'s shape for cards with a preview picture above their name. */
export const PICTURE_CARDS = "picture";

/** How wide a picture comes out above its name in a card of this width and height (see `PICTURE_CARDS`). */
export function pictureWidth(cardWidth: number, row: number, phone: boolean) {
  const pad = phone ? PICTURE_PAD_PHONE : PICTURE_PAD;
  const name = Math.min(Math.max(row * NAME_SHARE, 16), 34);
  return Math.min(cardWidth - 2 * pad, (row - 2 * pad - name) * 1.5);
}

/** Space between the cards; matches `.game-list.fit` in the styles (smaller on a phone). */
const GAP = 24;
const GAP_PHONE = 14;
/** Extra room above each line of grouped cards for the group's name; matches `--group-label` in the styles. */
const LABEL = 12;
const LABEL_PHONE = 0;
/** Room under the last row; matches the page's bottom padding while the cards fit. */
const BOTTOM = 32;
const BOTTOM_PHONE = 12;

/** How a menu's cards are laid out: columns, the height of a row, and columns left free (see `packGroups`). */
export interface Fit {
  columns: number;
  row: number;
  /** Columns a group of several rows leaves free at its right for the one-row groups after it (see `packGroups`). */
  reserve: number;
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
 * a longer group fills the whole width and has its lines to itself – or, with `reserve`, leaves that many columns free
 * at its right, where shorter groups after it stand, in several rows if need be (the Timer's „Abwechseln“ beside its
 * ten pictures: below them, in a line of its own, it made every card too small to fit on a tablet).
 */
export function packGroups(sizes: number[], columns: number, reserve = 0): { places: GroupPlace[]; lines: number[] } {
  const lines: { used: number; height: number }[] = [];
  const places = sizes.map((size, i) => {
    const room = size > columns && i < sizes.length - 1 && reserve < columns ? columns - reserve : columns;
    let width = Math.min(size, room);
    let height = Math.ceil(size / room);
    let line = height === 1 ? lines.findIndex((l) => l.used + width <= columns) : -1;
    // A short group with no room in one row may still stand in the columns a longer group left free, in as many rows
    // as that group has (the Timer's two ways of taking turns, one above the other beside its pictures).
    if (line < 0 && size <= columns) {
      line = lines.findIndex((l) => l.used < columns && Math.ceil(size / (columns - l.used)) <= l.height);
      if (line >= 0) {
        width = Math.min(size, columns - lines[line].used);
        height = Math.ceil(size / width);
      }
    }
    if (line < 0) line = lines.push({ used: 0, height }) - 1;
    const column = lines[line].used;
    lines[line].used += width;
    return { column, line, width, height };
  });
  const heights = lines.map((l) => l.height);
  const firstRow = (line: number) => heights.slice(0, line).reduce((a, b) => a + b, 0);
  return { places: places.map((p) => ({ ...p, row: firstRow(p.line) })), lines: heights };
}

/**
 * Columns and row height that give `count` cards the most room; with `groups` (their sizes) every group keeps together.
 * `shape` is how much wider than tall the cards look best, when it isn't the usual (cards that are a picture), or
 * `PICTURE_CARDS` for cards with a preview picture above their name, which get the biggest pictures – on a big screen
 * (`bigScreen`) no taller than `MAX_PICTURE_ROW`.
 */
export function bestFit(
  count: number,
  width: number,
  height: number,
  phone: boolean,
  groups?: number[],
  shape?: number | typeof PICTURE_CARDS,
  bigScreen = true,
): Fit | null {
  if (shape === PICTURE_CARDS) return bestPictureFit(count, width, height, phone, groups, bigScreen ? MAX_PICTURE_ROW : Infinity);
  const aspect = shape;
  const minRow = phone ? MIN_ROW_PHONE : MIN_ROW;
  const minWidth = phone ? MIN_WIDTH_PHONE : aspect ? MIN_PICTURE_WIDTH : MIN_WIDTH;
  const gap = phone ? GAP_PHONE : GAP;
  let best: Fit | null = null;
  let bestSize = 0;
  for (let columns = 1; columns <= Math.max(1, count); columns++)
    for (let reserve = 0; reserve < (groups ? columns : 1); reserve++) {
      const lines = groups ? packGroups(groups, columns, reserve).lines : [Math.ceil(count / columns)];
      const rows = lines.reduce((a, b) => a + b, 0);
      // Each line of groups has its names above it: one more track and gap.
      const labels = groups ? lines.length * ((phone ? LABEL_PHONE : LABEL) + gap) : 0;
      const cardWidth = (width - (columns - 1) * gap) / columns;
      const row = (height - labels - (rows - 1) * gap) / rows;
      if (row < minRow || cardWidth < minWidth) continue;
      const size = Math.min(cardWidth / (aspect ?? (row < FLAT_ROW ? FLAT_ASPECT : CARD_ASPECT)), row);
      if (size > bestSize) {
        bestSize = size;
        best = { columns, row: Math.floor(Math.min(row, MAX_ROW)), reserve };
      }
    }
  return best;
}

/** The grid of `bestFit` for cards with a preview picture above their name: the one with the widest pictures. */
function bestPictureFit(count: number, width: number, height: number, phone: boolean, groups: number[] | undefined, maxRow: number): Fit | null {
  const gap = phone ? GAP_PHONE : GAP;
  let best: Fit | null = null;
  let bestSize = 0;
  for (let columns = 1; columns <= Math.max(1, count); columns++)
    for (let reserve = 0; reserve < (groups ? columns : 1); reserve++) {
      const lines = groups ? packGroups(groups, columns, reserve).lines : [Math.ceil(count / columns)];
      const rows = lines.reduce((a, b) => a + b, 0);
      const labels = groups ? lines.length * ((phone ? LABEL_PHONE : LABEL) + gap) : 0;
      const cardWidth = (width - (columns - 1) * gap) / columns;
      const row = Math.min((height - labels - (rows - 1) * gap) / rows, maxRow);
      const size = pictureWidth(cardWidth, row, phone);
      if (size < (phone ? MIN_PICTURE_PHONE : MIN_PICTURE)) continue;
      // A bigger picture wins; of two alike (within a pixel), the one with fewer empty cells.
      if (size > bestSize + 1) {
        bestSize = size;
        best = { columns, row: Math.floor(row), reserve };
      }
    }
  return best;
}

/** The smallest a menu's names are shrunk to fit their cards (`fitNames`); a longer one is cut with „…“. */
const MIN_NAME_FIT = 0.6;

/**
 * Shrinks the names of a menu's picture cards alike (`--name-fit` on the list), so the longest stands whole in one line
 * under its picture and all names of the menu keep one size (user feedback, 25 November 2026: names broke into two or
 * three lines beside small pictures).
 */
function fitNames(list: HTMLElement) {
  const names = list.querySelectorAll<HTMLElement>(".picture-card > .game-title");
  if (!names.length) return;
  const overflow = () => [...names].reduce((fit, name) => (name.scrollWidth > name.clientWidth ? Math.min(fit, name.clientWidth / name.scrollWidth) : fit), 1);
  let fit = 1;
  list.style.setProperty("--name-fit", "1");
  // The padding and rounding keep a name from shrinking quite in step with its font: measured again, a little smaller each time.
  for (let ratio = overflow(); ratio < 1 && fit > MIN_NAME_FIT; ratio = overflow()) {
    fit = Math.max(MIN_NAME_FIT, Math.floor(fit * ratio * 100) / 100 - 0.01);
    list.style.setProperty("--name-fit", String(fit));
  }
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
const isPhone = () => Math.min(window.innerWidth, window.innerHeight) < PHONE_SCREEN;

/**
 * Room the page keeps free under its cards for a picture standing there: `--menu-floor`, a registered length
 * (`@property` in `book.css`, so it reads as pixels), the animal families at the bottom of the page.
 */
const floorOf = (page: HTMLElement) => parseFloat(getComputedStyle(page).getPropertyValue("--menu-floor")) || 0;

/**
 * How tall `part` of the menu `page` may grow so that the page's first screen holds everything above and below it
 * (not what waits `data-below-fold`), with the room under the last row the cards keep.
 */
function roomFor(part: HTMLElement, page: HTMLElement) {
  return window.innerHeight - (contentHeight(page) - part.offsetHeight) - Math.max(isPhone() ? BOTTOM_PHONE : BOTTOM, floorOf(page));
}

/**
 * Sizes a menu's card grid so that every card and what is around it fit on
 * one screen without scrolling, on phones too (with smaller, flatter cards).
 * Only when the cards would get too small does the menu keep its scrolling list.
 * What is marked `data-below-fold` (the install hint for grown-ups) is left out:
 * it waits below the cards until a grown-up scrolls down.
 * With `groups` (the sizes of runs of cards that belong together, in order) each group is kept in one rectangle
 * with its name above it: `places` gives each group's place in the grid. Cards that are a picture (`GameMode.art`) pass
 * its `aspect`, so they come as wide as the picture; cards with a preview picture above their name pass
 * `PICTURE_CARDS`, and their names are shrunk alike to stand in one line (`fitNames`).
 */
export function useFitGrid(count: number, groups?: number[], shape?: number | typeof PICTURE_CARDS) {
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
      const big = Math.min(window.innerWidth, window.innerHeight) >= TABLET_SCREEN;
      const next = bestFit(count, list.clientWidth, roomFor(list, page), phone, groups, shape, big);
      setFit((prev) => (prev?.columns === next?.columns && prev?.row === next?.row && prev?.reserve === next?.reserve ? prev : next));
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
  }, [list, count, groups?.join(), shape]);

  // The names follow the cards' size: measured again after every new grid, when the list's width changes, and once
  // the font has come.
  useLayoutEffect(() => {
    if (!list) return;
    const refit = () => fitNames(list);
    refit();
    // Only a new width, and in the next frame: the names' new size changes the list's height, which must not measure
    // them again inside the observer (the browser reports a loop).
    let width = list.clientWidth;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (list.clientWidth === width) return;
      width = list.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(refit);
    });
    observer.observe(list);
    void document.fonts?.ready.then(refit);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [list, fit, count]);

  const packed = fit && groups ? packGroups(groups, fit.columns, fit.reserve) : undefined;
  // A track for the names above each line of groups, then the line's card rows.
  const rows = packed?.lines.map((height) => `var(--group-label) repeat(${height}, var(--fit-row))`).join(" ");
  return {
    ref: setList,
    // `picture-list`: every card of the list is sized like a picture card, also one still waiting for its picture.
    className: [fit && "fit", shape === PICTURE_CARDS && "picture-list"].filter(Boolean).join(" "),
    style: fit ? ({ "--fit-columns": fit.columns, "--fit-row": `${fit.row}px`, gridTemplateRows: rows } as CSSProperties) : undefined,
    places: packed?.places.map(
      (p): CSSProperties => ({ gridColumn: `${p.column + 1} / span ${p.width}`, gridRow: `${p.row + p.line + 1} / span ${p.height + 1}` }),
    ),
  };
}
