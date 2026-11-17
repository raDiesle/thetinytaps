import type { Point } from "./types";

// Where bag and action button sit on the screen and where the child walks above them. Pure numbers, no drawing, so
// `hud.test.ts` can check the layout for computer, tablet and phone; `layers.tsx` draws what is laid out here.

/** The picture every level is drawn for, in its own units; each layer's svg shows it whole. */
export const VIEW_W = 1600;
export const VIEW_H = 900;
/** A screen taller than the picture zooms the world in until it shows this much height, so it doesn't fill with
 * sky; at most `MAX_ZOOM` times, so a world going sideways still shows enough of the way ahead. */
const WORLD_H = 900;
const MAX_ZOOM = 1.5;
/** At least this much of the world is shown ahead of the child (and a third of it behind). */
const AHEAD = 840;
/** Ground kept free between the child's feet and the top of the frames below them. */
const FEET_GAP = 24;
/** The backpack on the screen holds three things at most, standing side by side in it. */
export const SLOT_COUNT = 3;
/** From one thing's middle to the next, and from the frame's left edge to the first. */
export const SLOT_STEP = 150;
const SLOT_IN = 100;
/** The upper edge of the front pockets: the things stand behind them, their bottoms hidden. */
const RIM = 808;
/** The action button's radius. */
export const ACTION_R = 62;
/** The bag's frame and the button's frame, as high as each other: drawn here, then moved down by `Hud.lift` to the
 * screen's bottom edge. */
export const HUD_TOP = 704;
/** How high the bag's and the button's frames are. */
export const HUD_H = 188;
/** Room kept free between the screen's edge and the frames. */
const EDGE = 18;

/** The screen's free edges (without a notch) in the picture's units: they lie outside 0–1600 and 0–900 where the
 * screen is wider or taller than the picture. */
export interface Screen {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/** Where the bag and the action button are on the screen, and where the world is, in the picture's units. */
export interface Hud {
  /** The bag's frame: left, top, width, height – before `lift`. */
  bagBox: [number, number, number, number];
  /** Where each thing stands in the backpack: its middle, on the front pockets' upper edge – before `lift`. */
  slots: Point[];
  action: Point;
  actionBox: [number, number, number, number];
  /** Bag and button are drawn as above, then their frames' bottom-left corner moves here, at the screen's bottom
   * edge, and they grow by `zoom` from there. */
  corner: Point;
  /** Where the child's feet are on the screen in a world going sideways: above the frames, never behind them. */
  feet: Point;
  /** How much bigger the world – and bag and button with it – is drawn than the picture's units, on a screen taller
   * than the picture (a tablet: so its big buttons are big to the thumb too). */
  zoom: number;
}

/**
 * Bag and button sit side by side along the screen's bottom edge, not the picture's – the bag at the very left and
 * the button right next to it, where one thumb reaches both – and the child walks above them: its feet stand just
 * over the frames, so nothing of the way is covered and the sky gets only what is left. A screen taller than the
 * picture (a tablet) zooms the world in instead of showing more sky – bag and button grow with it – and the child
 * stands further left there so the way ahead stays in sight.
 */
export function layoutHud({ left, right, top, bottom }: Screen, keys: boolean): Hud {
  const x0 = left + EDGE;
  const y = keys ? 784 : HUD_TOP + HUD_H / 2;
  const slots = Array.from({ length: SLOT_COUNT }, (_, i): Point => [x0 + SLOT_IN + i * SLOT_STEP, RIM]);
  const bagW = 2 * SLOT_IN + (SLOT_COUNT - 1) * SLOT_STEP;
  const boxW = 2 * ACTION_R + 44;
  const boxX = x0 + bagW + 26;
  const zoom = Math.min(MAX_ZOOM, Math.max(1, (bottom - top) / WORLD_H));
  const kidX = Math.max(left + (AHEAD / 3) * zoom, Math.min((left + right) / 2, right - AHEAD * zoom));
  const base = bottom - EDGE;
  return {
    bagBox: [x0, HUD_TOP, bagW, HUD_H],
    slots,
    action: [boxX + boxW / 2, y],
    actionBox: [boxX, HUD_TOP, boxW, HUD_H],
    corner: [x0, base],
    feet: [kidX, base - HUD_H * zoom - FEET_GAP],
    zoom,
  };
}
