import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { PICTURE_QUEUE } from "@/content/pictureQueue";
import { CAUSE_PASSES, CAUSE_SCENES, FEELING_LETTER, PASS_SIZE, sceneCode, sceneImages } from "./scenes";

describe("Was ist passiert?", () => {
  test("many scenes, every feeling in several, in full passes", () => {
    expect(CAUSE_SCENES.length).toBeGreaterThanOrEqual(30);
    for (const feeling of Object.keys(FEELING_LETTER)) expect(CAUSE_SCENES.filter((s) => s.feeling === feeling).length, feeling).toBeGreaterThanOrEqual(2);
    for (const pass of CAUSE_PASSES) expect(pass.length).toBe(PASS_SIZE);
  });

  test("ids and dev codes are unique", () => {
    const ids = CAUSE_SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    const codes = CAUSE_SCENES.map(sceneCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  // Under each picture stands its question for grown-ups to ask the child (user feedback, November 2026), and once the
  // cause is found, why it led to the feeling.
  test("every scene has its words: what it shows, two questions, and why", () => {
    for (const s of CAUSE_SCENES) {
      expect(s.shows, s.id).toMatch(/^Der kleine Bär .+\.$/);
      expect(s.cause, s.id).toMatch(/\S\?$/);
      expect(s.other, s.id).toMatch(/\S\?$/);
      expect(s.cause, s.id).not.toBe(s.other);
      expect(s.told, s.id).toMatch(/[.!]$/);
    }
  });

  // No emojis as pictures (user feedback, November 2026): every picture is made with Gemini or waits in the queue.
  test("every picture is made or waits in the picture queue", () => {
    const queued = new Set(PICTURE_QUEUE.flatMap((p) => [p.file, ...(p.panels ?? []).map((panel) => panel.file)]));
    for (const s of CAUSE_SCENES)
      for (const name of Object.values(sceneImages(s.id))) {
        const file = `src/games/cause/bilder/${name}.webp`;
        expect(existsSync(file) || queued.has(file), file).toBe(true);
      }
  });

  // The raccoon is the one who takes or knocks over, never a fox or a bear (Gefühle's pictures, user decision, November 2026).
  test("whoever takes, knocks over or scribbles is the raccoon", () => {
    for (const s of CAUSE_SCENES.filter((s) => /nimmt|stößt|kritzelt|will .* nicht von/i.test(s.cause))) expect(s.cause, s.id).toContain("Waschbär");
  });
});
