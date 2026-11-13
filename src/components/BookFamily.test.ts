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
// long straight run there is a cut the trim moved off the edge (31 on Oma Bär's cardigan). Feet on the ground may run
// flat a little longer at the bottom.
test("no reader's picture is cut off at any side", async () => {
  for (const file of Object.values(READER_FILES).flat()) {
    if (!existsSync(path(file))) continue;
    const { data, info } = await sharp(path(file)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const opaque = (x: number, y: number) => data[(y * w + x) * 4 + 3] > 128;
    const column = (x: number) => Array.from({ length: h }, (_, y) => opaque(x, y)).filter(Boolean).length;
    const row = (y: number) => Array.from({ length: w }, (_, x) => opaque(x, y)).filter(Boolean).length;
    const columns = Array.from({ length: w }, (_, x) => column(x));
    const rows = Array.from({ length: h }, (_, y) => row(y));
    const first = (counts: number[]) => counts.find((n) => n > 0) ?? 0;
    const edges = { top: rows[0], bottom: rows[h - 1], left: columns[0], right: columns[w - 1] };
    const straight = Math.max(first(rows), first(columns), first([...columns].reverse()));
    expect({ file, edges, straight: straight < 25 }).toEqual({ file, edges: { top: 0, bottom: 0, left: 0, right: 0 }, straight: true });
  }
});
