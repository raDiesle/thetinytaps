import { bookIdOf, CATEGORIES } from "@/content/games";
import type { Texts } from "@/lib/language";
import type { TrophyWon } from "@/lib/trophies";

/*
 * The trophy room's plan (TrophyMuseum.tsx), kept apart from its drawing as the shelf's plan is (shelfLayout.ts): where
 * the rooms' walls stand on a screen, how a room's trophies stand on its tiers, and which categories are rooms and which
 * are wings with a door for each game.
 */

/** The vanishing point's height on the screen, and how big the back wall is against the screen round that point. */
const EYE = 0.42;
export const BACK = 0.92;

/** A trophy is at least this share of the screen's shorter side, or the medallion's picture is not recognised. */
const MIN_TROPHY = 0.13;

/** A trophy with its board and its plate is this many trophy heights tall; and this many wide per trophy width. */
export const CELL_HIGH = 1.28;
const CELL_WIDE = 0.74;

/** How the rooms are drawn on a screen `w` × `h`: their walls, and the area of the back wall the tiers and doors stand in. */
export function museumLayout(w: number, h: number) {
  const vx = w / 2;
  const vy = h * EYE;
  const back = { x0: vx - vx * BACK, x1: vx + vx * BACK, y0: vy - vy * BACK, y1: vy + (h - vy) * BACK };
  // Under the room's sign, between the back wall's sides, down to its foot.
  const area = { x: back.x0 + w * 0.01, y: back.y0 + h * 0.14, w: back.x1 - back.x0 - w * 0.02, h: back.y1 - back.y0 - h * 0.14 };
  return { w, h, vx, vy, back, area };
}

/** The museum's measures on this screen. */
export type MuseumLayout = ReturnType<typeof museumLayout>;

/** The smallest a trophy may be on this screen. */
const minTrophy = (l: MuseumLayout) => Math.min(l.w, l.h) * MIN_TROPHY;

/** How `count` trophies stand on tiers in a room: how many tiers, how many on each, how big each, and the cell it stands in. */
export function tierPlan(count: number, l: MuseumLayout) {
  let best = { rows: 1, per: Math.max(count, 1), trophy: 0, cellW: 0, cellH: 0 };
  for (let rows = 1; rows <= Math.max(count, 1); rows++) {
    const per = Math.ceil(count / rows);
    const cellW = l.area.w / per;
    const cellH = l.area.h / rows;
    const trophy = Math.min(cellH / CELL_HIGH, cellW / CELL_WIDE, l.h * 0.42);
    if (trophy > best.trophy) best = { rows, per, trophy, cellW, cellH };
  }
  return best;
}

/** One place in the museum with trophies in it: a category's room, a wing's game room or a wing's hall of `kids`. */
export interface MuseumNode {
  id: string;
  title: Texts;
  emoji: string;
  /** Every trophy behind this door, in the shelf's order of the games, each game's in the order they were won. */
  trophies: TrophyWon[];
  /** Where the trophies are too many for one room: a door for each game. */
  kids?: MuseumNode[];
}

/**
 * The hall's doors, one for each category with trophies, in the shelf's order. A category whose trophies would stand
 * smaller than `MIN_TROPHY` on `layout` is a wing with a door for each of its games.
 */
export function museumTree(trophies: TrophyWon[], layout: MuseumLayout): MuseumNode[] {
  const sorted = (list: TrophyWon[]) => [...list].sort((a, b) => a.at - b.at);
  return CATEGORIES.flatMap((category): MuseumNode[] => {
    const own = category.games.flatMap((game) => sorted(trophies.filter((trophy) => trophy.game === game.href)));
    if (!own.length) return [];
    const node: MuseumNode = { id: category.id, title: category.title, emoji: category.emoji, trophies: own };
    const games = category.games.filter((game) => own.some((trophy) => trophy.game === game.href));
    if (games.length > 1 && tierPlan(own.length, layout).trophy < minTrophy(layout)) {
      node.kids = games.map((game) => ({
        id: bookIdOf(game.href),
        title: game.title,
        emoji: game.emoji,
        trophies: own.filter((trophy) => trophy.game === game.href),
      }));
    }
    return [node];
  });
}
