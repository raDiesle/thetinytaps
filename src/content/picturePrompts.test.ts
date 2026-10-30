import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { PICTURE_PROMPTS } from "./picturePrompts";

describe("picture prompts", () => {
  // The management page counts a prompt without `url` as a picture still to make, so a made one must carry it
  // (the Belohnungstafel's 130 pictures once all showed as missing there).
  test("a prompt has its picture's URL exactly when its file is made", () => {
    for (const set of PICTURE_PROMPTS)
      for (const p of set.groups.flatMap((g) => g.prompts)) expect(Boolean(p.url), `${set.id}/${p.id}: ${p.file}`).toBe(existsSync(p.file));
  });
});
