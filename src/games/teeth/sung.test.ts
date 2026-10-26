import { readdirSync, readFileSync } from "node:fs";
import { expect, test } from "@rstest/core";
import { STEPS } from "./steps";
import { type SungTimes, sungLanguageOf } from "./sung";

// A sung song is found just by its file name, so check what that relies on.

const DIR = "src/games/teeth/musik";
const languages = readdirSync(DIR)
  .map(sungLanguageOf)
  .filter((lang) => lang !== null);

test("only sung songs count as languages", () => {
  expect(sungLanguageOf("./musik-zaehneputzen-lied-de.mp3")).toBe("de");
  expect(sungLanguageOf("./musik-zaehneputzen.mp3")).toBeNull();
  expect(languages).toContain("de");
});

test("every sung song has its lyrics in suno-lied.md", () => {
  const lyrics = readFileSync(`${DIR}/suno-lied.md`, "utf8");
  for (const lang of languages) {
    expect(lyrics, lang).toContain(`(\`${lang}\``);
  }
});

test("every sung song says where its verses begin: one per step, then the finale, each long enough to brush", () => {
  for (const lang of languages) {
    const { verses } = JSON.parse(readFileSync(`${DIR}/musik-zaehneputzen-lied-${lang}.json`, "utf8")) as SungTimes;
    expect(verses, lang).toHaveLength(STEPS.length + 1);
    for (let k = 1; k < verses.length; k++) {
      const step = verses[k] - verses[k - 1];
      expect(step, `${lang} step ${k}`).toBeGreaterThan(8);
      expect(step, `${lang} step ${k}`).toBeLessThan(30);
    }
    const brushing = verses[STEPS.length] - verses[0];
    expect(brushing, lang).toBeGreaterThan(90);
    expect(brushing, lang).toBeLessThan(160);
  }
});
