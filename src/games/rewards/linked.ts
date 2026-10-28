import { loadStars } from "@/games/potty/stars";
import { loadWeek } from "@/games/teeth/daytime";
import type { LinkedDays } from "./board";

/**
 * What Zähne putzen and Aufs Töpfchen did on which day, read from those games' own week logs (kept for two weeks,
 * more than a week board shows): the brushings with their time of day, the potty stars as a count. Read when the
 * board opens, so a star earned in the game is there when the child comes back.
 */
export function loadLinkedDays(): LinkedDays {
  const teeth = Object.entries(loadWeek())
    .filter(([, brushed]) => brushed.length > 0)
    .map(([day, brushed]) => [day, { count: brushed.length, slots: brushed }]);
  const potty = Object.entries(loadStars())
    .filter(([, count]) => count > 0)
    .map(([day, count]) => [day, { count, slots: [] }]);
  return { teeth: Object.fromEntries(teeth), potty: Object.fromEntries(potty) };
}
