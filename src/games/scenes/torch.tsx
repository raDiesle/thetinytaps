import type { Ref } from "react";
import "./torch.css";
import { placeBox, type SceneItem } from "./types";

// Torch mode ("Taschenlampe", idea B-17): the picture is night, and a round light shines where the finger, the mouse or
// the arrow keys are. What comes into the light wakes up and moves; nothing is asked, so every move shows something.

/** Radius of the light, as a share of the picture's width. */
export const TORCH_RADIUS = 0.12;

/** How far one arrow key moves the light, as a share of the picture's width. */
export const TORCH_STEP = 0.07;

/** An item wakes up once a tap area of it comes this close to the middle of the light, as a share of its radius. */
const WAKE_REACH = 0.55;

/** The items the light at (x, y) with radius `r` (picture units) shines on: those with a tap area near its middle. */
export function litItems(items: readonly SceneItem[], x: number, y: number, r: number) {
  return items.filter((item) =>
    (item.hitAreas ?? [item.box]).some((area) => {
      const [bx, by, w, h] = placeBox(area, item.place);
      const dx = Math.max(bx - x, 0, x - (bx + w));
      const dy = Math.max(by - y, 0, y - (by + h));
      return Math.hypot(dx, dy) < r * WAKE_REACH;
    }),
  );
}

/**
 * The night over the whole picture with the hole of the light in it: an HTML layer of its own above the svg, so
 * moving the light repaints only this layer, never the drawing (the engine sets `--torch-x`, `--torch-y` and
 * `--torch-r` in pixels on it). `off`: the night fades away, at the party when everything was found.
 */
export function TorchNight({ nightRef, off }: { nightRef: Ref<HTMLDivElement>; off: boolean }) {
  return <div ref={nightRef} className={`torch-night${off ? " off" : ""}`} aria-hidden />;
}
