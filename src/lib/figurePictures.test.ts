import { describe, expect, test } from "bun:test";
import { forFigure } from "./figurePictures";

describe("menu pictures for the child's figure", () => {
  const boy = { "a.webp": "a-boy", "b.webp": "b-boy" };
  const girl = { "a.webp": "a-girl" };

  test("the boy sees the boy's pictures", () => {
    expect(forFigure("boy", boy, girl)).toEqual(boy);
  });

  test("the girl sees her own where there is one, else the boy's (the child not in sight there)", () => {
    expect(forFigure("girl", boy, girl)).toEqual({ "a.webp": "a-girl", "b.webp": "b-boy" });
  });
});
