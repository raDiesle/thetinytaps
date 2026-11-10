import type { QueuedPicture } from "@/content/pictureQueue";
import { CAUSE_SCENES, type CauseScene, sceneImages } from "./scenes";

// The pictures of „Was ist passiert?“ as the picture queue takes them (`/bild-erzeugen`). Each scene has three pictures
// in one place: the little bear with his feeling, drawn from Gefühle's `baer-sad-gut` so he is the same bear, two of
// them on one sheet; then what happened and what didn't, both a moment earlier, drawn together on one sheet from the
// feeling's picture as the only `--ref`, so the place stays the same and nothing tells the right one by its background.
// A scene whose pictures are made leaves `FEELING_WAITING` and `CAUSE_WAITING`; its prompts stay here, built from `scenes.ts`. Plain data, with no
// picture imports, so the management page that lists the queue doesn't load the game's pictures.

const DIR = "src/games/cause/bilder";

/** Who the little bear is, from Gefühle's pictures. */
const BEAR_REF = "src/games/feelings/bilder/baer-sad-gut.webp";

/** What no picture may have: the reference's floating hearts came back otherwise. Real things of the moment (a balloon, bubbles, a kite) may fly. */
const NOTHING_FLOATS =
  "No hearts, stars, sparkles, symbols, sound words or speech bubbles anywhere – only real things of the moment may be in the air. No text, no letters.";

const file = (name: string) => `${DIR}/${name}.webp`;

/** The scene's first picture: the little bear alone, close and big, with his feeling plain in face and body. */
export function feelingPicture(scene: CauseScene): QueuedPicture {
  const { feeling } = sceneImages(scene.id);
  return {
    id: `cause-${feeling}`,
    file: file(feeling),
    use: `Was ist passiert?, Szene „${scene.id}“: ${scene.shows}`,
    prompt: `Redraw the little bear from this picture, same style, in his light-blue T-shirt and dark blue-purple trousers, in a new place: ${scene.draw.place}. He is close to the front and big, seen whole from head to feet, filling most of the picture; the background is simple and calm, only what the moment needs. Only ONE little bear in the whole picture; no hands or arms come in from the edges. His face and his whole body show the feeling clearly – the feeling is the biggest thing in the picture. ${scene.draw.feeling} ${NOTHING_FLOATS}`,
    aspect: "4:3",
    size: "800x600",
    quality: 65,
    ref: [BEAR_REF],
    date: "2026-11-10",
  };
}

/** What happened and what didn't, both a moment before the feeling's picture, in its place: one sheet of two panels. */
export function causePictures(scene: CauseScene): QueuedPicture {
  const { feeling, cause, other } = sceneImages(scene.id);
  return {
    id: `cause-${cause}`,
    file: file(cause),
    use: `Was ist passiert?, Szene „${scene.id}“: ${scene.cause} / ${scene.other}`,
    prompt: `Two moments a little EARLIER than this picture, in exactly its place: ${scene.draw.place}. Keep the place as it is in the picture: the same background, ground, furniture and things at the same places, the same camera framing (no zoom, no shift), the same colours and line style. The same little bear in his clothes, big and in front, only ONE little bear in each panel. Nobody else but who a panel names, only ONE of each, nobody peeking in from an edge. His face and body show plainly how he feels in each panel – it differs between the two. Gentle, no injuries, no blood. ${NOTHING_FLOATS}`,
    panels: [
      { file: file(cause), prompt: scene.draw.cause },
      { file: file(other), prompt: scene.draw.other },
    ],
    aspect: "4:3",
    size: "800x600",
    quality: 65,
    ref: [file(feeling)],
    date: "2026-11-10",
  };
}

/** The scenes whose feeling's picture is still to make (ids from `CAUSE_SCENES`); a scene leaves once it is made. */
const FEELING_WAITING: string[] = [];

/** The scenes whose two earlier moments are still to make; they wait for the feeling's picture, their `--ref`. */
const CAUSE_WAITING: string[] = [];

/** Every picture of the game still to make. */
export const CAUSE_PICTURE_QUEUE: QueuedPicture[] = [
  ...CAUSE_SCENES.filter((s) => FEELING_WAITING.includes(s.id)).map(feelingPicture),
  ...CAUSE_SCENES.filter((s) => CAUSE_WAITING.includes(s.id)).map(causePictures),
];
