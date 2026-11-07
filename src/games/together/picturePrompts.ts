import type { QueuedPicture } from "@/content/pictureQueue";
import { PAINTED, type PaintedPair } from "./painted";

// How the painted pairs of "Was gehört zusammen?" (`painted/`) become pictures in the picture queue (`/bild-erzeugen`),
// as cheap as it gets (user feedback, November 2026): a pair's two frames in one request, one under the other and cut
// apart, with the fox and bear families as reference (`framesJob`), and its painted partner (`part`) from its own words,
// four to a sheet. Plain data, so the picture queue on the management page loads no pictures; a pair whose pictures
// are made is marked `made`.

const DIR = "src/games/together/bilder";
const DATE = "2026-11-07";

/** The fox and bear families, passed as `--ref` to every pair they are in, so they are the app's fox and bear. */
const MASCOT_REFS = { fox: "src/components/bilder/buch-fuechse.webp", bear: "src/components/bilder/buch-baeren.webp" } as const;

/** The start of every first frame's words: one calm, wide scene a toddler reads at a glance. */
const SCENE =
  "A wide scene for a toddlers' picture game (what belongs together?), seen from a child's eye height, the whole scene in view with some room round its main subject, which stands big in the middle. Calm and plain: only what is named is in it, nothing else going on. Feelings show only in faces and poses: no question marks, exclamation marks, hearts, sweat drops or other signs floating in the air.";

/** What a pair's request says about the characters in it. */
const CAST: Record<PaintedPair["cast"], string> = {
  none: "Nobody is in the picture: no people, no animals.",
  fox: "The fox looks like the foxes of the reference picture (only their look and clothes style – not the pose, the book or the scene there). Only the characters named, each exactly once: nobody more in a doorway, a window or at an edge.",
  bear: "The bear looks like the bears of the reference picture (only their look and clothes style – not the pose, the book or the scene there). Only the characters named, each exactly once: nobody more in a doorway, a window or at an edge.",
  both: "The foxes and bears look like those of the two reference pictures (only their look and clothes style – not the poses, the books or the scenes there). Only the characters named, each exactly once: nobody more in a doorway, a window or at an edge.",
};

const refsOf = (cast: PaintedPair["cast"]) => (cast === "none" ? [] : cast === "both" ? [MASCOT_REFS.fox, MASCOT_REFS.bear] : [MASCOT_REFS[cast]]);

/** What both frames share when they are drawn together, one under the other, in one request (`framesJob`). */
const TWO_FRAMES =
  "Two panels, one under the other, showing ONE scene at two moments: the top panel first, the bottom panel a moment later. Both panels show exactly the same place, background, furniture and objects at the same places, the same characters in the same clothes, colours and line style, and the same camera framing (no zoom, no shift, nobody changes sides) – the bottom panel changes only what its description names. Each panel on its own shows every character exactly once and every object exactly once: the bottom panel shows the same characters moved, never a second copy of someone, and never a second copy of a thing. Whoever or whatever moves in the bottom panel (into a seat, onto a lap, through a door) is no longer at its old place there: that place is now empty. Whatever the bottom panel adds is nowhere in the top panel – not held, worn, lying about or hanging anywhere, not even a similar one. Feelings show only in faces and poses: never a question mark, exclamation mark, sparkle, star, heart, sweat drop, motion line or any other sign or letter in either panel.";

/** The two frames of a painted pair as one queued request: drawn together, cut apart into `-1` and `-2`. */
export function framesJob(p: PaintedPair, before: string, after: string): QueuedPicture {
  return {
    id: `zusammen-${p.id}`,
    file: before,
    use: `Was gehört zusammen?, „${p.name}“: die Bilder vorher und nachher`,
    prompt: `${TWO_FRAMES} ${CAST[p.cast]}`,
    panels: [
      { file: before, prompt: `${SCENE} ${p.before}` },
      { file: after, prompt: `The same scene a moment later, nothing else changed: ${p.after}` },
    ],
    aspect: "3:2",
    size: "840x560",
    quality: 72,
    ref: refsOf(p.cast),
    date: DATE,
  };
}

/** The pictures of the painted pairs still to make, as the picture queue takes them: one request per pair for its two frames, and the painted partners four to a sheet. */
export const TOGETHER_PICTURE_QUEUE: QueuedPicture[] = PAINTED.filter((p) => p.made !== true).flatMap((p): QueuedPicture[] => {
  const pictures: QueuedPicture[] = [];
  if (!p.made) pictures.push(framesJob(p, `${DIR}/${p.id}-1.webp`, `${DIR}/${p.id}-2.webp`));
  if (p.part)
    pictures.push({
      id: `zusammen-teil-${p.id}`,
      file: `${DIR}/teile/${p.id}.webp`,
      use: `Was gehört zusammen?, „${p.partner.name}“ zum Antippen`,
      prompt: `${p.part}, alone and whole, big in the middle.`,
      aspect: "1:1",
      size: "512",
      transparent: true,
      date: DATE,
    });
  return pictures;
});
