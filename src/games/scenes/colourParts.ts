import type { SceneTrait } from "./types";

// "Was ist rot?" counts every item with some red on it, not only the ones tagged red:
// a toddler who taps the house with the red roof is right. The colours are read from
// the drawing as the browser paints it, so no picture needs every red part listed.

/** The colours questions mode asks for. */
export type ColourTrait = Extract<SceneTrait, "red" | "yellow" | "blue" | "green">;

const COLOUR_TRAITS: readonly SceneTrait[] = ["red", "yellow", "blue", "green"];

/** Whether a trait is a colour, which a part of an item is enough for. */
export const isColourTrait = (trait: SceneTrait): trait is ColourTrait => COLOUR_TRAITS.includes(trait);

/** A part smaller than this share of the item's biggest part (a tiny dot, a thin line) doesn't count. */
const MIN_PART = 0.005;

/** Red, green, blue (0–255) and alpha (0–1) of a CSS colour the browser computed ("rgb(…)", "rgba(…)") or a "#rrggbb" fill. */
function parse(css: string): [number, number, number, number] | undefined {
  const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(css.trim());
  if (hex) return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16), 1];
  const rgb = /^rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+%?))?\)$/.exec(css.trim());
  if (!rgb) return undefined;
  const alpha = rgb[4] === undefined ? 1 : rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : parseFloat(rgb[4]);
  return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3]), alpha];
}

/**
 * The colour a child would call this paint, if it is one of the asked colours: clear red (not pink, orange
 * or brown), yellow (not sand or orange), green or blue (not the pale blue of a window or the sky).
 */
export function colourName(css: string): ColourTrait | undefined {
  const parsed = parse(css);
  if (!parsed || parsed[3] < 0.5) return undefined;
  const [r, g, b] = parsed.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return undefined;
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = (max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4) * 60;
  if ((h <= 12 || h >= 345) && s >= 0.5 && l >= 0.3 && l <= 0.72) return "red";
  if (h >= 40 && h <= 65 && s >= 0.85 && l >= 0.4 && l <= 0.8) return "yellow";
  if (h >= 80 && h <= 165 && s >= 0.3 && l >= 0.2 && l <= 0.75) return "green";
  if (h >= 195 && h <= 250 && s >= 0.45 && l >= 0.2 && l <= 0.75) return "blue";
  return undefined;
}

/** The asked colours of the visible parts of a drawn item (its `[data-item]` group), each big enough to see. */
export function coloursIn(element: Element): Set<ColourTrait> {
  const colours = new Set<ColourTrait>();
  const shapes = element.querySelectorAll<SVGGeometryElement>("path, rect, circle, ellipse, polygon");
  const boxes = [...shapes].map((shape) => shape.getBBox());
  const itemArea = Math.max(1, ...boxes.map((box) => box.width * box.height));
  shapes.forEach((shape, i) => {
    if (shape.matches(".scene-hit, .scene-shadow")) return;
    if (boxes[i].width * boxes[i].height < itemArea * MIN_PART) return;
    const style = getComputedStyle(shape);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return;
    const colour = colourName(style.fill);
    if (colour) colours.add(colour);
  });
  return colours;
}
