import { expect, test } from "bun:test";
import sharp from "sharp";
import { READERS, readerOf } from "./BookFamily";

// Oma and Opa read with the child too (D-21): every reader's picture is there, and from visit to visit the readers
// change, never the same grown-ups on both sides.

test("every reader of the menu pages has its picture", () => {
  for (const readers of Object.values(READERS)) for (const picture of readers) expect(picture).toBeTruthy();
});

test("the readers change from visit to visit, the two sides never alike", () => {
  const who = (n: number) => [readerOf("fox", n), readerOf("bear", n)].map((url) => /buch-(\w+(-\w+)?)/.exec(url ?? "")?.[1]);
  expect(who(0)).toEqual(["fuechse", "baeren"]);
  expect(who(1)).toEqual(["oma-fuchs", "opa-baer"]);
  expect(who(2)).toEqual(["opa-fuchs", "oma-baer"]);
  expect(who(3)).toEqual(who(0));
});

// A cut-out whose figure reaches the picture's top or side edge was cut off there by Gemini: Opa Bär's cap ended in a
// straight line at the top, and every menu showed his head sliced (user feedback, November 2026). Only the bottom may
// touch the edge, where the families sit on the page's foot.
test("no reader's picture is cut off at its top or sides", async () => {
  const files = Object.values(READERS)
    .flat()
    .map((url) => /(buch-[\w-]+\.webp)/.exec(url ?? "")?.[1]);
  for (const file of new Set(files)) {
    const { data, info } = await sharp(new URL(`./bilder/${file}`, import.meta.url).pathname)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const opaque = (x: number, y: number) => data[(y * info.width + x) * 4 + 3] > 128;
    let top = 0;
    let sides = 0;
    for (let x = 0; x < info.width; x++) if (opaque(x, 0)) top++;
    for (let y = 0; y < info.height; y++) if (opaque(0, y) || opaque(info.width - 1, y)) sides++;
    expect({ file, top, sides }).toEqual({ file, top: 0, sides: 0 });
  }
});
