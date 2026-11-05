import { expect, test } from "bun:test";
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
