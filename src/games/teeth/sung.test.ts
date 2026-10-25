import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@rstest/core";
import { STEPS } from "./steps";
import { SUNG_LABELS, SUNG_LEAD, SUNG_PART, sungLanguageOf } from "./sung";

// A sung song shows up in the settings just by its file name, so check what that relies on.

const DIR = "src/games/teeth/musik";
const languages = readdirSync(DIR)
  .map(sungLanguageOf)
  .filter((lang) => lang !== null);

test("only sung songs count as languages", () => {
  expect(sungLanguageOf("./musik-zaehneputzen-lied-de.mp3")).toBe("de");
  expect(sungLanguageOf("./musik-zaehneputzen.mp3")).toBeNull();
  expect(languages).toContain("de");
});

test("every sung song has a name for the settings and its lyrics in suno-lied.md", () => {
  const lyrics = readFileSync(`${DIR}/suno-lied.md`, "utf8");
  for (const lang of languages) {
    expect(SUNG_LABELS[lang], lang).toBeTruthy();
    expect(lyrics, lang).toContain(`(\`${lang}\``);
  }
});

test("one part per step, then the finale, makes two minutes of brushing", () => {
  expect(STEPS.length * SUNG_PART).toBeCloseTo(120, 6);
  expect(SUNG_LEAD).toBeGreaterThan(0);
});
