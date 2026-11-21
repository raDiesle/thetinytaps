// The end of a picture once everything was found (idea B-21): the light turns warm like an evening, and everything
// found bows once, one after the other from left to right, like actors at the end of a play – silently, with one soft
// sound when the last has bowed. ScenePlay plays it; the numbers and the order live here, so they can be tested.

import { placeBox, type SceneItem } from "./types";

/** After the last find, the evening light starts to come in (the bedtime picture's night waits as long). */
export const EVENING_AFTER_MS = 900;
/** The first bow comes once the light is half there. */
export const BOW_AFTER_MS = EVENING_AFTER_MS + 900;
/** How long one bow takes. */
export const BOW_MS = 620;
/** Between two bows at most this, so a picture with few things doesn't drag. */
const BOW_STEP_MAX_MS = 260;
/** All bows begin within this, so a picture with forty things doesn't take for ever. */
const BOW_SPREAD_MS = 3400;

/** Between the starts of two bows when `count` things bow. */
export function bowStep(count: number) {
  return count < 2 ? 0 : Math.min(BOW_STEP_MAX_MS, BOW_SPREAD_MS / (count - 1));
}

/** When the soft sound comes, counted from the last find: once the last bow is over. */
export function curtainSoundAt(count: number) {
  return BOW_AFTER_MS + Math.max(0, count - 1) * bowStep(count) + BOW_MS;
}

/** When the end's buttons and the trophy come, counted from the last find: a moment after the sound. */
export function curtainEndAt(count: number) {
  return curtainSoundAt(count) + 500;
}

/** The point a thing bows about, in picture units: the middle of its drawing's foot. */
export function bowFoot(item: SceneItem): [number, number] {
  const [x, y, w, h] = placeBox(item.box, item.place);
  return [x + w / 2, y + h];
}

/** The things in the order they bow: from left to right, as a row of actors on a stage. */
export function bowOrder(items: readonly SceneItem[]) {
  return [...items].sort((a, b) => bowFoot(a)[0] - bowFoot(b)[0]);
}

/**
 * Where a picture point lies in a layer of `width` × `height` pixels that shows the picture's `viewWidth` ×
 * `viewHeight` units like `preserveAspectRatio="xMidYMid meet"` – the bow's `transform-origin` on the item's layer.
 */
export function layerPoint([x, y]: [number, number], viewWidth: number, viewHeight: number, width: number, height: number): [number, number] {
  const scale = Math.min(width / viewWidth, height / viewHeight);
  return [(width - viewWidth * scale) / 2 + x * scale, (height - viewHeight * scale) / 2 + y * scale];
}

/** One bow, as keyframes of the item's layer: it sinks a little at its foot and comes up again. */
export const BOW_KEYFRAMES: Keyframe[] = [{ transform: "none" }, { transform: "scale(1.03, 0.88)", offset: 0.45 }, { transform: "none" }];
