import frameFiles from "./bilder/*.webp?glob";
import partFiles from "./bilder/teile/*.webp?glob";

// The painted pictures of "Was gehört zusammen?" (made with Gemini from `picturePrompts.ts`, user decision, November
// 2026): each pair has two frames of one scene – `<id>-1.webp` before, where the thing waits or the helper looks round
// puzzled, and `<id>-2.webp` the very same scene with the partner in use and everyone glad – and a partner without a
// plain emoji has a painted picture of its own on its plate (`teile/<name>.webp`). A pair without its two frames still
// shows its emoji scene (scene.tsx).

/** A pair's two frames, before and after, or undefined while they are not made. */
export function framesOf(id: string): [string, string] | undefined {
  const before = frameFiles[`${id}-1.webp`];
  const after = frameFiles[`${id}-2.webp`];
  return before && after ? [before, after] : undefined;
}

/** A painted partner's picture by its name (`teile/<name>.webp`), or undefined while it is not made. */
export const partImage = (name: string): string | undefined => partFiles[`${name}.webp`];
