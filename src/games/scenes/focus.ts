import { placeBox, type SceneItem } from "./types";

// Keys mode: the arrow keys move a glowing frame from item to item (Space or Enter starts it).

export const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

/** Middle of the item's main tap area in the picture: what the child sees as "the item". */
function centre(item: SceneItem): [number, number] {
  const [x, y, w, h] = placeBox(item.hitAreas?.[0] ?? item.box, item.place);
  return [x + w / 2, y + h / 2];
}

/** The item nearest to the middle of the picture, where the frame starts. */
export function middleItem(items: readonly SceneItem[], width: number, height: number) {
  const distance = (item: SceneItem) => {
    const [x, y] = centre(item);
    return Math.hypot(x - width / 2, y - height / 2);
  };
  return items.reduce((best, item) => (distance(item) < distance(best) ? item : best));
}

/**
 * The next item in direction (dx, dy): the nearest one ahead, preferring those
 * straight ahead over those far to the side. Stays put at the edge of the picture.
 */
export function nextInDirection(items: readonly SceneItem[], from: SceneItem, [dx, dy]: [number, number]) {
  const [fx, fy] = centre(from);
  let best = from;
  let bestScore = Infinity;
  for (const item of items) {
    if (item === from) continue;
    const [x, y] = centre(item);
    const ahead = (x - fx) * dx + (y - fy) * dy;
    if (ahead <= 8) continue;
    const aside = Math.abs((x - fx) * dy - (y - fy) * dx);
    const score = ahead + 2.5 * aside;
    if (score < bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best;
}
