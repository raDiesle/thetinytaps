import { expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { choiceRows, nextLevel, useDeck } from "./rounds";

test("sure goes up, unsure goes down, never past the ends", () => {
  const top = 12;
  expect(nextLevel(0, [], top)).toBe(0);
  expect(nextLevel(0, [0], top)).toBe(0);
  expect(nextLevel(0, [0, 0], top)).toBe(1);
  expect(nextLevel(top, [0, 0], top)).toBe(top);
  expect(nextLevel(2, [1, 0], top)).toBe(2);
  expect(nextLevel(2, [2], top)).toBe(1);
  expect(nextLevel(2, [1], top)).toBe(2);
  expect(nextLevel(2, [1, 1], top)).toBe(1);
  expect(nextLevel(0, [3], top)).toBe(0);
});

test("below the quick steps one sure round is enough", () => {
  expect(nextLevel(0, [0], 12, 3)).toBe(1);
  expect(nextLevel(2, [0], 12, 3)).toBe(3);
  expect(nextLevel(3, [0], 12, 3)).toBe(3);
  expect(nextLevel(1, [2], 12, 3)).toBe(0);
});

test("the choices lie side by side, and on an upright phone two to a row up to four, then three", () => {
  const rows = (n: number) => choiceRows(n) as Record<string, number>;
  expect(rows(2)).toEqual({ "--n": 2, "--tall-cols": 2, "--tall-rows": 1 });
  expect(rows(3)).toEqual({ "--n": 3, "--tall-cols": 2, "--tall-rows": 2 });
  expect(rows(4)).toEqual({ "--n": 4, "--tall-cols": 2, "--tall-rows": 2 });
  expect(rows(5)).toEqual({ "--n": 5, "--tall-cols": 3, "--tall-rows": 2 });
  expect(rows(6)).toEqual({ "--n": 6, "--tall-cols": 3, "--tall-rows": 2 });
});

const POOL = ["a", "b", "c", "d", "e"];
const dealt: string[] = [];

/** Draws forty rounds from a deck of `POOL` into `dealt`; a hook only runs inside a component. */
function Dealer() {
  const draw = useDeck(POOL);
  for (let i = 0; i < POOL.length * 40; i++) dealt.push(draw());
  return null;
}

test("a deck deals all of its pool before one comes again, and never the same one twice in a row", () => {
  renderToStaticMarkup(createElement(Dealer));
  expect(dealt).toHaveLength(POOL.length * 40);
  for (let i = 1; i < dealt.length; i++) expect(dealt[i]).not.toBe(dealt[i - 1]);
  // Swapping the first of a new round with the next one (so none comes twice in a row) puts the swapped one at the
  // deck's far end, so rounds are no longer cut at every fifth draw – but none ever waits longer than two rounds.
  for (const item of POOL) {
    const at = dealt.flatMap((d, i) => (d === item ? [i] : []));
    for (let i = 1; i < at.length; i++) expect(at[i] - at[i - 1]).toBeLessThan(POOL.length * 2);
  }
  expect([...new Set(dealt.slice(0, POOL.length))].sort()).toEqual(POOL);
});
