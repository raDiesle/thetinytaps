import { centre } from "./focus";
import type { SceneItem } from "./types";

// „Hier bin ich!“ (idea B-15): when nobody taps a picture for a while at its start, one single item waves gently, an
// invitation for a child who doesn't know where to begin – never a task, and silent (see the rules in CLAUDE.md).

/** After the picture lies still, how long nobody has tapped before the first item waves. */
export const HELLO_AFTER_MS = 6000;
/** Still no tap: the next item waves this long after the one before. */
export const HELLO_AGAIN_MS = 12000;
/** At most this many items wave, one after the other; then the picture stays still until the child acts. */
export const HELLO_TIMES = 3;
/** How long one wave lasts. */
export const HELLO_MS = 1800;

/** One wave, as keyframes of the item's layer about its foot: it rocks gently to one side and the other, then stands still. */
export const HELLO_KEYFRAMES: Keyframe[] = [
  { transform: "none" },
  { transform: "translateY(-5px) rotate(-4deg)", offset: 0.2 },
  { transform: "none", offset: 0.45 },
  { transform: "translateY(-5px) rotate(4deg)", offset: 0.65 },
  { transform: "none", offset: 0.9 },
  { transform: "none" },
];

/**
 * Which items wave, in turn: animals first (a creature saying hello is what a child expects), each group nearest to the
 * picture's middle first, where the eye starts. At most `HELLO_TIMES`, never the same item twice.
 */
export function helloOrder(items: readonly SceneItem[], width: number, height: number): SceneItem[] {
  const distance = (item: SceneItem) => {
    const [x, y] = centre(item);
    return Math.hypot(x - width / 2, y - height / 2);
  };
  const byMiddle = (a: SceneItem, b: SceneItem) => distance(a) - distance(b);
  const animals = items.filter((item) => item.traits?.includes("animal")).sort(byMiddle);
  const others = items.filter((item) => !item.traits?.includes("animal")).sort(byMiddle);
  return [...animals, ...others].slice(0, HELLO_TIMES);
}
