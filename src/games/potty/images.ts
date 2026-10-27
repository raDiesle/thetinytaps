// The pictures of the potty story, all in ./bilder/ (see bilder/README.md), named
// "<animal>-<picture>": "fox-essen", "fox-warten-giesskanne". A second frame "-b"
// fades in and out with the first, so the animals move a little (as in „Gefühle“).

import pictureFiles from "./bilder/*.webp?glob";

const IMAGES = new Map(Object.entries(pictureFiles).map(([file, url]) => [file.replace(/\.webp$/, ""), url]));

/** All frames of the picture `name`, first one first; empty if there is none. */
export function framesFor(name: string): string[] {
  return ["", "-b"].flatMap((suffix) => IMAGES.get(name + suffix) ?? []);
}

/** Starts loading these pictures with all their frames, so they don't pop in empty. */
export function preloadImages(names: string[]) {
  for (const name of names) for (const src of framesFor(name)) new Image().src = src;
}
