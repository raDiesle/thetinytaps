import type { QueuedPicture } from "@/content/pictureQueue";
import { PAINTED, type PaintedPair } from "./painted";

// How the painted pairs of "Was gehört zusammen?" (`painted/`) become pictures in the picture queue (`/bild-erzeugen`):
// the first frame from the pair's `before` with the shared scene and cast lines below and the fox and bear families as
// reference, the second from its `after` with the first frame as its only reference (so only the partner and the faces
// change), and a painted partner (`part`) cut out from the second frame, so it looks as it does there. Plain data, so the
// picture queue on the management page loads no pictures; a pair whose pictures are made is marked `made`.

const DIR = "src/games/together/bilder";
const DATE = "2026-11-07";

/** The fox and bear families, passed as `--ref` to every first frame they are in, so they are the app's fox and bear. */
const MASCOT_REFS = { fox: "src/components/bilder/buch-fuechse.webp", bear: "src/components/bilder/buch-baeren.webp" } as const;

/** The start of every first frame: one calm, wide scene a toddler reads at a glance. */
const SCENE =
  "A wide scene for a toddlers' picture game (what belongs together?), seen from a child's eye height, the whole scene in view with some room round its main subject, which stands big in the middle. Calm and plain: only what is named is in it, nothing else going on. Feelings show only in faces and poses: no question marks, exclamation marks, hearts, sweat drops or other signs floating in the air.";

/** What every first frame says about the characters in it. */
const CAST: Record<PaintedPair["cast"], string> = {
  none: "Nobody is in the picture: no people, no animals.",
  fox: "The fox looks like the foxes of the reference picture (only their look and clothes style – not the pose, the book or the scene there). Only the characters named, each exactly once: nobody more in a doorway, a window or at an edge.",
  bear: "The bear looks like the bears of the reference picture (only their look and clothes style – not the pose, the book or the scene there). Only the characters named, each exactly once: nobody more in a doorway, a window or at an edge.",
  both: "The foxes and bears look like those of the two reference pictures (only their look and clothes style – not the poses, the books or the scenes there). Only the characters named, each exactly once: nobody more in a doorway, a window or at an edge.",
};

/** The start of every second frame: the same picture, only the partner and the faces change. */
const AFTER =
  "Redraw this exact picture a moment later. Keep everything exactly as it is: the same place, background, furniture and objects at the same places, the same characters in the same clothes, the same colours and line style, the same camera framing (no zoom, no shift). Nothing appears, disappears or moves except what is named here. Now this happens:";

const refsOf = (cast: PaintedPair["cast"]) => (cast === "none" ? [] : cast === "both" ? [MASCOT_REFS.fox, MASCOT_REFS.bear] : [MASCOT_REFS[cast]]);

/** What every painted partner's prompt says around the pair's `part`. */
const partPrompt = (part: string) =>
  `From this picture, paint only ${part}, exactly as it looks in the picture (its shape, colours and line), alone and whole, big in the middle – nothing else from the picture: no character, no paws, no background, no floor, no shadow.`;

/** The pictures of the painted pairs still to make, as the picture queue takes them. */
export const TOGETHER_PICTURE_QUEUE: QueuedPicture[] = PAINTED.filter((p) => p.made !== true).flatMap((p): QueuedPicture[] => {
  const before = `${DIR}/${p.id}-1.webp`;
  const after = `${DIR}/${p.id}-2.webp`;
  const pictures: QueuedPicture[] = [];
  if (!p.made)
    pictures.push(
      {
        id: `zusammen-${p.id}-1`,
        file: before,
        use: `Was gehört zusammen?, „${p.name}“: das Bild vorher`,
        prompt: `${SCENE} ${p.before} ${CAST[p.cast]}`,
        aspect: "3:2",
        size: "1200x800",
        quality: 72,
        ref: refsOf(p.cast),
        alone: "Shown big in the game, and the scene its second frame is drawn from",
        date: DATE,
      },
      {
        id: `zusammen-${p.id}-2`,
        file: after,
        use: `Was gehört zusammen?, „${p.name}“: das Bild nachher`,
        prompt: `${AFTER} ${p.after}`,
        aspect: "3:2",
        size: "1200x800",
        quality: 72,
        ref: [before],
        alone: "The second frame of its scene, drawn from the first so that only the partner and the faces change",
        date: DATE,
      },
    );
  if (p.part)
    pictures.push({
      id: `zusammen-teil-${p.id}`,
      file: `${DIR}/teile/${p.id}.webp`,
      use: `Was gehört zusammen?, „${p.partner.name}“ zum Antippen`,
      prompt: partPrompt(p.part),
      aspect: "1:1",
      size: "512",
      transparent: true,
      ref: [after],
      alone: "Cut out of its pair's second frame, so it looks as it does there",
      date: DATE,
    });
  return pictures;
});
