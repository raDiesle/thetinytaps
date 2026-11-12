import type { QueuedPicture } from "@/content/pictureQueue";
import { ALLTAG_DRAWINGS } from "./alltagDrawings";
import { type Figure, FIGURES } from "./storyPictures";

// The pictures of the days' pages of the story (`days.ts`, user idea, November 2026), as the picture queue takes them
// until they are made (`/bild-erzeugen`, never made on your own); a made one leaves the list, its prompt kept in
// `bilder/README.md` („Tagesgeschichten“). All 39 were made on 4 November 2026: a new page joins with `dayPage`. Each page shows a moment a little *before* the scene
// it leads to, in that scene's place: so it is drawn from that scene's first picture (`firstImage`) as its only `--ref`,
// keeping the place and the look of everyone, and only what the characters do changes – nothing has happened yet, all
// are calm. The night that ends every day is the little bear's room at night. Plain data, with no picture imports, so
// the management page that lists the queue doesn't load the game's pictures; `feelings.test.ts` checks that every page
// still to make has its entry here, drawn from its scene's first picture. Tag 9 to Tag 15 (the everyday scenes of
// alltag.ts, 11 November 2026) wait here until their scenes' first pictures are made.

const DIR = "src/games/feelings/bilder";

/** The start of every page's prompt: the scene's place a little earlier, nothing has happened yet. */
const EARLIER =
  "Redraw this exact picture as a moment a little EARLIER on the same day, before anything in it has happened. Keep the place exactly as it is: the same background, walls, windows, sky, ground, trees, furniture and objects at the same places, the same camera framing (no zoom, no shift), the same colours and line style. Only the characters' poses, faces and places change, and who is there.";

/** The end of every page's prompt: calm and happy, no feeling of the scene yet. */
const CALM = "Everyone is calm and content: nobody cries, nobody is angry or scared. No speech bubbles. No text, no letters.";

/**
 * A page before scene `scene` of day `day`, drawn from `ref` (the scene's first picture, without folder and .webp):
 * `cast` names everyone in it, `action` what they do. Ten of the first 39 got a double of someone („only ONE of each“).
 */
export function dayPage(day: number, scene: number, ref: string, use: string, cast: string, action: string, date = "2026-11-04"): QueuedPicture {
  const id = `tag${day}-${scene}`;
  return {
    id,
    file: `${DIR}/${id}.webp`,
    use: `Gefühle, „Alltagssituationen“, Tag ${day}: ${use}`,
    prompt: `${EARLIER} In the picture, each exactly once: ${cast}. Nobody else: only ONE of each in the whole picture, nobody more in a doorway, on the furniture or peeking in from an edge. Now this happens: ${action} ${CALM}`,
    aspect: "4:3",
    size: "1200x900",
    quality: 65,
    ref: [`${DIR}/${ref}.webp`],
    alone: "story picture",
    date,
  };
}

/** Everyone in a page of an everyday scene: characters of `FIGURES`, or the n-th of that scene's own cast (the hairdresser …). */
const who = (...cast: (Figure | [string, number])[]) =>
  cast.map((f) => (Array.isArray(f) ? (ALLTAG_DRAWINGS.find((d) => d.id === f[0])?.cast[f[1]] ?? "") : (FIGURES[f as keyof typeof FIGURES] ?? f))).join("; ");

/** A page before an everyday scene of alltag.ts, drawn from that scene's first picture. */
const everyday = (day: number, scene: number, story: string, use: string, cast: string, action: string) =>
  dayPage(day, scene, `${story}-passiert`, use, cast, action, "2026-11-11");

/** Every page of the days' stories and the night still to make. */
export const DAY_PICTURE_QUEUE: QueuedPicture[] = [
  // Tag 9: morning, breakfast, kindergarten, nap, pick-up.
  everyday(
    9,
    4,
    "accident",
    "der Fuchs baut einen Turm",
    who("bear", "fox"),
    "The fox kneels on the rug and puts one more block on top of his tall tower of colourful blocks, which stands whole and straight. The little bear stands a few steps away and watches, smiling. No block lies on the floor.",
  ),
];
