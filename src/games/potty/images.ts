// The pictures of the potty story, all in ./bilder/ (see bilder/README.md), named
// "<animal>-<picture>": "fox-essen", "fox-warten-giesskanne". A second frame "-b"
// fades in and out with the first, so the animals move a little (as in „Gefühle“).

import { pictureFolder } from "@/lib/pictureFolder";
import pictureFiles from "./bilder/*.webp?glob";

const folder = pictureFolder(pictureFiles, ["", "-b"]);

/** All frames of the picture `name`, first one first; empty if there is none. */
export const framesFor = folder.frames;

/** Starts loading these pictures with all their frames, so they don't pop in empty. */
export const preloadImages = folder.preload;
