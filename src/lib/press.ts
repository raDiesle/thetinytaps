import type { MouseEvent } from "react";

/**
 * The `onClick` of a button that acts as the finger lands (`onPointerDown`: it answers at once, and the game beneath
 * never gets the tap). A keyboard's Enter or Space and a screen reader's activation send no pointer, only a click, so
 * without this such a button did nothing for them. A pointer's own click (`detail` counts its presses, from 1) is left
 * out, so a tap never acts twice.
 */
export const noPointerClick = (act: () => void) => (e: MouseEvent) => {
  if (e.detail === 0) act();
};
