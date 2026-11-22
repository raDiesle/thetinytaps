// Keyframes written once for a run: a picture whose pieces come at moments worked out from the time set (the crane's
// toys, the toys hopping into their boxes) writes its ways as `@keyframes` as long as the run, so every moving part is a
// small layer on one CSS animation and React draws nothing per frame.

/** One keyframe: when (ms after the start), the transform then, and how it moves on to the next. */
export type Frame = { at: number; transform: string; ease?: string };

/** A `@keyframes` rule for a run of `total` ms from frames in time order. */
export function keyframes(name: string, total: number, frames: Frame[]): string {
  const percent = (ms: number) => ((Math.max(0, Math.min(ms, total)) / total) * 100).toFixed(3);
  return `@keyframes ${name} {${frames
    .map((f) => `${percent(f.at)}% { transform: ${f.transform}; animation-timing-function: ${f.ease ?? "ease-in-out"}; }`)
    .join(" ")}}`;
}

/** The frames held at their last transform until the run's end. */
export const holdToEnd = (frames: Frame[], total: number): Frame[] => [...frames, { at: total, transform: frames[frames.length - 1].transform }];
