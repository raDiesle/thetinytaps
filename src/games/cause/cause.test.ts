import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { LANGUAGE_STATUS } from "@/content/ideas/languageStatus";
import { PICTURE_QUEUE } from "@/content/pictureQueue";
import { CAUSE_SCENES_AR } from "./scenes.ar";
import { CAUSE_SCENES_EN } from "./scenes.en";
import { CAUSE_SCENES_ES } from "./scenes.es";
import { CAUSE_SCENES_HI } from "./scenes.hi";
import { CAUSE_SCENES_RU } from "./scenes.ru";
import { CAUSE_SCENES_ZH } from "./scenes.zh";
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

  // Translated on request (November 2026): no line for a scene that is gone, every scene where the language table says the
  // scenes are there, questions still questions, and no Latin letters inside a Russian, Chinese, Hindi or Arabic sentence.
  test("the scenes' words in the other languages", () => {
    const translations = { en: CAUSE_SCENES_EN, zh: CAUSE_SCENES_ZH, hi: CAUSE_SCENES_HI, es: CAUSE_SCENES_ES, ar: CAUSE_SCENES_AR, ru: CAUSE_SCENES_RU };
    const ids = CAUSE_SCENES.map((s) => s.id);
    const status = LANGUAGE_STATUS.find((row) => row.href === "/was-ist-passiert/")?.parts?.find((part) => part.label.includes("Szenen"));
    expect(status).toBeDefined();
    for (const [language, table] of Object.entries(translations)) {
      expect(
        Object.keys(table).filter((id) => !ids.includes(id)),
        language,
      ).toEqual([]);
      if (status?.languages[language as keyof typeof status.languages] === "done")
        expect(
          ids.filter((id) => !table[id]),
          `${language}: scenes missing though marked done in languageStatus.ts`,
        ).toEqual([]);
      for (const s of CAUSE_SCENES) {
        const words = table[s.id];
        if (!words) continue;
        for (const question of [words.cause, words.other]) expect(question, `${language} ${s.id}`).toMatch(/[?？؟]$/);
        expect(words.cause, `${language} ${s.id}`).not.toBe(words.other);
        if (["ru", "zh", "hi", "ar"].includes(language)) for (const text of Object.values(words)) expect(text, `${language} ${s.id}`).not.toMatch(/[A-Za-z]/);
      }
    }
  });
});
