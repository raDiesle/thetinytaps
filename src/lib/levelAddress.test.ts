import { expect, test } from "bun:test";
import { levelHome, levelHref } from "./levelAddress";

test("a level's address lies below its game's, and the game's is found from it", () => {
  expect(levelHref("/abenteuer/", "schatzinsel")).toBe("/abenteuer/schatzinsel/");
  expect(levelHref("/abenteuer", "schatzinsel")).toBe("/abenteuer/schatzinsel/");
  expect(levelHome("/abenteuer/schatzinsel/", "schatzinsel")).toBe("/abenteuer/");
  expect(levelHome("/abenteuer/schatzinsel", "schatzinsel")).toBe("/abenteuer/");
  // The start screen, and an address whose end is not the level, stay as they are.
  expect(levelHome("/abenteuer/", undefined)).toBe("/abenteuer/");
  expect(levelHome("/abenteuer/", "schatzinsel")).toBe("/abenteuer/");
});
