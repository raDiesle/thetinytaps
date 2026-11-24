import { expect, test } from "bun:test";
import { existsSync } from "node:fs";
import sharp from "sharp";
import { PICTURE_QUEUE } from "@/content/pictureQueue";
import { readerFileOf } from "./BookFamily";
import { READER_FILES } from "./readerPictures";

// Oma and Opa read with the child too (D-21): every reader's picture is there or waits in the picture queue, and from
// visit to visit the readers change, never the same grown-ups on both sides.

const path = (file: string) => new URL(`./bilder/${file}`, import.meta.url).pathname;
const queued = (file: string) => PICTURE_QUEUE.some((p) => p.file === `src/components/bilder/${file}`);

test("every reader of the menu pages has its picture, or it waits in the queue", () => {
  for (const file of Object.values(READER_FILES).flat()) expect(existsSync(path(file)) || queued(file), file).toBe(true);
});

test("the readers change from visit to visit, the two sides never alike", () => {
  const who = (n: number) => [readerFileOf("fox", n), readerFileOf("bear", n)];
  expect(who(0)).toEqual(["buch-fuechse.webp", "buch-baeren.webp"]);
  expect(who(1)).toEqual(["buch-oma-fuchs.webp", "buch-opa-baer.webp"]);
  expect(who(2)).toEqual(["buch-opa-fuchs.webp", "buch-oma-baer.webp"]);
  expect(who(3)).toEqual(who(0));
});

// A cut-out whose figure reaches the picture's edge was cut off there by Gemini: Opa Bär's cap ended in a straight line
// at the top, and every menu showed his head sliced; Oma Bär's legs ended flat at the bottom and her cardigan on the
// right, since the bottom was allowed to touch (user feedback, November 2026). So no edge may be reached, and at the top
// and the sides the outermost row or column is only the tip of a rounded line (at most 19 pixels in the good ones) – a
// long straight run there is a cut the trim moved off the edge (31 on Oma Bär's cardigan). Such a cut shows the fill
// colour at the edge; a long run that is all dark ink is the outline itself running nearly straight there (29 pixels of
// the new Oma Bär's rounded cardigan, November 2026), so only a run with fill colour counts. Feet on the ground may run
// flat a little longer at the bottom.
test("no reader's picture is cut off at any side", async () => {
  for (const file of Object.values(READER_FILES).flat()) {
    if (!existsSync(path(file))) continue;
    const { data, info } = await sharp(path(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const at = (x: number, y: number) => (y * w + x) * 4;
    const opaque = (x: number, y: number) => data[at(x, y) + 3] > 128;
    /** Dark enough to be the plum-brown outline, not a fill colour. */
    const ink = (x: number, y: number) => 0.299 * data[at(x, y)] + 0.587 * data[at(x, y) + 1] + 0.114 * data[at(x, y) + 2] < 110;
    /** How many pixels of a row or column are opaque, and how many of those are not ink. */
    const line = (points: [number, number][]) => {
      const solid = points.filter(([x, y]) => opaque(x, y));
      return { solid: solid.length, fill: solid.filter(([x, y]) => !ink(x, y)).length };
    };
    const columns = Array.from({ length: w }, (_, x) => line(Array.from({ length: h }, (_, y) => [x, y])));
    const rows = Array.from({ length: h }, (_, y) => line(Array.from({ length: w }, (_, x) => [x, y])));
    const first = (lines: { solid: number; fill: number }[]) => lines.find((l) => l.solid > 0) ?? { solid: 0, fill: 0 };
    const edges = { top: rows[0].solid, bottom: rows[h - 1].solid, left: columns[0].solid, right: columns[w - 1].solid };
    const cut = (l: { solid: number; fill: number }) => (l.fill > 0 ? l.solid : 0);
    const straight = Math.max(cut(first(rows)), cut(first(columns)), cut(first([...columns].reverse())));
    expect({ file, edges, straight: straight < 25 }).toEqual({ file, edges: { top: 0, bottom: 0, left: 0, right: 0 }, straight: true });
  }
});
