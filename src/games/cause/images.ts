// The pictures of „Was ist passiert?“, all in ./bilder/ (made with Gemini, `causePictures.ts`): per scene the little
// bear's feeling (`<id>`), what happened (`<id>-grund`) and what didn't (`<id>-anders`).

import { pictureFolder } from "@/lib/pictureFolder";
import pictureFiles from "./bilder/*.webp?glob";

const folder = pictureFolder(pictureFiles);

/** The picture called `name` as the frames Gefühle's picture components take: empty while it is not made yet. */
export const framesOf = folder.frames;

/** Starts loading these pictures, so the next scene doesn't pop in empty. */
export const preloadImages = folder.preload;
