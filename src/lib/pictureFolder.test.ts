import { describe, expect, test } from "bun:test";
import { pictureFolder } from "./pictureFolder";

const FILES = { "push-1.webp": "/a", "push-1-b.webp": "/b", "push-1-c.webp": "/c", "solo.webp": "/s" };

describe("pictureFolder", () => {
  test("finds a picture by its name without the extension", () => {
    const folder = pictureFolder(FILES);
    expect(folder.image("solo")).toBe("/s");
    expect(folder.image("missing")).toBeUndefined();
  });

  test("frames follow the suffixes given, first one first, and skip missing ones", () => {
    expect(pictureFolder(FILES, ["", "-b", "-c"]).frames("push-1")).toEqual(["/a", "/b", "/c"]);
    expect(pictureFolder(FILES, ["", "-b"]).frames("push-1")).toEqual(["/a", "/b"]);
    expect(pictureFolder(FILES, ["", "-b", "-c"]).frames("solo")).toEqual(["/s"]);
  });

  test("without suffixes a picture is its one frame, and a missing one has none", () => {
    const folder = pictureFolder(FILES);
    expect(folder.frames("push-1")).toEqual(["/a"]);
    expect(folder.frames("nope")).toEqual([]);
  });
});
