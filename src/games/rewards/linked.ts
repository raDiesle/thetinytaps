import { loadStars } from "@/games/potty/stars";
import { loadWeek } from "@/games/teeth/daytime";
import type { LinkedDays } from "./board";

/**
 * The days on which Zähne putzen was brushed to the end and Aufs Töpfchen got its star, read from
 * those games' own week logs (kept for two weeks, more than a week board shows). Read when the board
 * opens, so a star earned in the game is there when the child comes back.
 */
export function loadLinkedDays(): LinkedDays {
  const teeth = Object.entries(loadWeek())
    .filter(([, brushed]) => brushed.length > 0)
    .map(([day]) => day);
  const potty = Object.entries(loadStars())
    .filter(([, count]) => count > 0)
    .map(([day]) => day);
  return { teeth: new Set(teeth), potty: new Set(potty) };
}
