// The pictures of „Was ist passiert?“, all in ./bilder/ (made with Gemini, `causePictures.ts`): per scene the little
// bear's feeling (`<id>`), what happened (`<id>-grund`) and what didn't (`<id>-anders`).

import { PROD } from "@/lib/buildInfo";
import { pictureFolder } from "@/lib/pictureFolder";
import { CAUSE_PASSES, type CauseScene, sceneImages } from "./scenes";
import pictureFiles from "./bilder/*.webp?glob";

const folder = pictureFolder(pictureFiles);

/** The picture called `name` as the frames Gefühle's picture components take: empty while it is not made yet. */
export const framesOf = folder.frames;

/** Starts loading these pictures, so the next scene doesn't pop in empty. */
export const preloadImages = folder.preload;

/** Whether all three pictures of a scene are made: the feeling, what happened and what didn't. */
export const sceneMade = (scene: CauseScene) => Object.values(sceneImages(scene.id)).every((name) => framesOf(name).length > 0);

/**
 * The passes as players get them: in the built site a scene whose pictures aren't all made is left out, and a pass left
 * empty with it, so no player sees an empty picture (user request, November 2026); with `all` (the dev server) every
 * scene stays, so a new one can be looked at.
 */
export function playedPasses(passes: readonly (readonly CauseScene[])[], made: (scene: CauseScene) => boolean, all = !PROD) {
  if (all) return passes;
  return passes.map((pass) => pass.filter(made)).filter((pass) => pass.length > 0);
}

/** The passes this build plays (`playedPasses`). */
export const PLAYED_PASSES = playedPasses(CAUSE_PASSES, sceneMade);
