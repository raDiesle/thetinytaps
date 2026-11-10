// The pictures of „Was ist passiert?“, all in ./bilder/ (made with Gemini, `causePictures.ts`): per scene the little
// bear's feeling (`<id>`), what happened (`<id>-grund`) and what didn't (`<id>-anders`).

import pictureFiles from "./bilder/*.webp?glob";

const IMAGES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** The picture called `name` as the frames Gefühle's picture components take: empty while it is not made yet. */
export function framesOf(name: string): string[] {
  const src = IMAGES.get(name);
  return src ? [src] : [];
}

/** Starts loading these pictures, so the next scene doesn't pop in empty. */
export function preloadImages(names: string[]) {
  for (const name of names) for (const src of framesOf(name)) new Image().src = src;
}
