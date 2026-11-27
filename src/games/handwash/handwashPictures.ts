import type { QueuedPicture } from "@/content/pictureQueue";
import type { PictureId } from "./steps";

// The painted pictures of „Hände waschen“ (H-141: rooms are painted by Gemini, the close-up of the hands stays SVG), as
// the picture queue takes them until they are made (`/bild-erzeugen`, in a Claude cloud session: Zscaler blocks Gemini
// on the Mac). All four are seen through the child's own eyes (user decision, 25 November 2026): the child is never in
// them, so they fit the child's own hands of the close-up and need not be painted twice for a boy and a girl. The
// bathroom is described as the close-up draws it (`sink.tsx`: the pink pump left of the basin, the chrome mixer tap
// with its blue and red dot, the teal towel with a white and a yellow stripe on the right). Plain data, no picture imports.
// A made sheet goes on `MADE`, so it leaves the queue.

const DIR = "src/games/handwash/bilder";

/** Where a picture's file lies. */
export const pictureFile = (id: PictureId) => `${DIR}/${id}.webp`;

/** What every panel shares: the home, Mama, the bathroom and the child's own eyes. */
const SHARED =
  "Four pictures of one small everyday story, all in the same cosy family home and the same style, each seen through the eyes of a small child: a first-person view from a toddler's eye height. The child itself is never seen – no child, no child's face, hands or body anywhere, except its own feet where a panel says so. Mama is a young human woman with brown hair in a loose bun, a mustard-yellow sweater and a light-green apron, smiling warmly with relaxed, raised brows; only ONE Mama, and only in the panels that name her. The bathroom is the same wherever it is seen: light-blue square tiles on the wall, a white washbasin set on a light wooden cabinet, a chrome single-lever mixer tap with a small blue dot on its right and a small red dot on its left, a pink pump bottle of soap with a white pump head standing on the left of the basin, a soft teal terry towel with a white and a yellow stripe at its lower end hanging from a hook on the wall to the right of the basin, and a sturdy light-wood step stool with two steps in front of the cabinet. Warm, friendly daylight.";

/** Each picture's own words, in the order of the panels. */
const PANELS: Record<PictureId, string> = {
  ruf: "The living room seen by the child sitting on a soft round rug: low in front, on the rug, a half-built tower of colourful wooden blocks. Across the room, in the open doorway to the kitchen, Mama leans in and calls cheerfully, one hand cupped beside her open, smiling mouth, the other holding a wooden spoon. Behind her in the kitchen a set table with a steaming pot.",
  bad: "The bathroom seen from its open door at the child's eye height, as the child walks in: straight ahead the washbasin on its cabinet, too high for a small child, the wooden step stool standing ready in front of it, the soap on the left of the basin, the teal towel on its hook on the right. Nobody in the room.",
  hocker:
    "Looking down at the child's own two feet in cosy white socks, with the cuffs of soft grey trousers, climbing the wooden step stool: one foot already on the top step, the other still on the lower step. Just above them the light wooden front of the washbasin's cabinet and the white rim of the basin. Nothing else of the child is seen.",
  essen:
    "Running into the kitchen towards the dinner table, a little soft motion blur at the edges of the picture: the table set with plates, a steaming pot of pasta with tomato sauce, a bowl of salad and a small cup; Mama stands beside the table smiling warmly and pulls out a child's chair with a booster seat. The same kitchen as behind Mama in the first picture.",
};

/** The order of the panels on the sheet. */
const ORDER: PictureId[] = ["ruf", "bad", "hocker", "essen"];

/** The pictures made (all four on 27 November 2026); the prompts stay here, so a picture can be made again from them. */
const MADE = new Set(["haende-ruf"]);

/** The four pictures, one sheet of four panels, while they are not made. */
export const HANDWASH_PICTURE_QUEUE: QueuedPicture[] = [
  {
    id: "haende-ruf",
    file: pictureFile("ruf"),
    use: "Hände waschen: die vier gemalten Räume aus den Augen des Kindes – Mama ruft zum Essen, das Bad mit dem Tritthocker, die eigenen Füße auf dem Hocker, zum Essenstisch rennen",
    prompt: SHARED,
    panels: ORDER.map((id) => ({ file: pictureFile(id), prompt: PANELS[id] })),
    aspect: "16:9",
    size: "1280x720",
    quality: 72,
    after:
      "Look at the four pictures in the dev server (`/haende-waschen/?seite=call`, `?seite=stool`, `?seite=run`): the child must not be seen (only its feet on the stool), only ONE Mama, the bathroom as the close-up draws it. Then `bun run previews /haende-waschen/`.",
    date: "2026-11-25",
  },
].filter((p) => !MADE.has(p.id));
