import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../styles/bookshelf.css", import.meta.url), "utf8");

// The trophy sign's glints are the one thing on the shelf that moves by itself (user request, November 2026): only
// transform and opacity of their own tiny layers, so a phone never paints the sign or the shelf again for them.
test("the trophy sign's glints move only by transform and opacity", () => {
  const frames = css.match(/@keyframes trophy-glint \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(frames).not.toBe("");
  const properties = [...frames.matchAll(/^\s*([a-z-]+):/gm)].map((m) => m[1]);
  expect(new Set(properties)).toEqual(new Set(["opacity", "transform"]));
  expect(css).toMatch(/\.shelf-trophy-glint \{[^}]*will-change: transform, opacity;/);
});

// Percentages of padding measure the shelf, not the sign: the sign grew to twice its size with them.
test("the trophy sign is sized by its own width, never by the shelf's", () => {
  const sign = css.match(/\.shelf-trophy-sign \{([^}]*)\}/)?.[1] ?? "";
  expect(sign).toContain("--trophy-sign:");
  expect(sign).not.toMatch(/padding:[^;]*%/);
});

// A little wooden board sitting in the compartment's bottom right corner, held by three nails in its corners (user
// request, November 2026): a paper sign hanging above the board on one nail looked flat and loose.
test("the trophy sign is a wooden board in the corner with three nails", () => {
  const sign = css.match(/\.shelf-trophy-sign \{([^}]*)\}/)?.[1] ?? "";
  expect(sign).toContain("var(--wood-grain-h)");
  expect(sign).not.toContain("--paper-grain");
  // Its foot on the board: moved up by its whole height and its thickness, never lifted above the board.
  expect(sign).toMatch(/translate: [^;]+ calc\(-100% - var\(--edge\)\);/);
  const nails = css.match(/\.shelf-trophy-sign::before \{([^}]*)\}/)?.[1] ?? "";
  expect(nails.match(/var\(--head\)/g)?.length).toBe(3);
});

// On a wide shelf the sign is nailed into the top left corner of the speaker's compartment, so the speaker below it can
// stand big (user request, 26 November 2026): it hangs down from the board above, never lifted by its own height.
test("on a wide shelf the trophy sign hangs in the speaker's top left corner", () => {
  const top = css.match(/\.shelf-trophy-sign\[data-from="top"\] \{([^}]*)\}/)?.[1] ?? "";
  expect(top).toMatch(/translate: calc\(var\(--post\)[^)]*\) calc\(var\(--edge\)[^)]*\);/);
  expect(css).not.toMatch(/shelf-trophy-sign ~ \.shelf-box \.shelf-cell\.music/);
});

// „Wer spielt?“ on the stickers' right wall runs across it in lines: written down the slanted wall its letters came out
// a few pixels thin, and a padding in cq units on the wall – itself a container – measured the room and left no width.
test("„Wer spielt?“ runs across the right wall, never down it", () => {
  const wall = css.match(/\.shelf-ask-wall \{([^}]*)\}/)?.[1] ?? "";
  const words = css.match(/\.shelf-ask-wall \.shelf-figure-ask \{([^}]*)\}/)?.[1] ?? "";
  expect(words).not.toContain("writing-mode");
  expect(wall).not.toMatch(/padding[^;]*cq/);
});
