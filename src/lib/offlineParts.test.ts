import { describe, expect, test } from "bun:test";
import { isBackgroundSong, languageOf, needsEnglish, type OfflinePart, sizeOf, wanted } from "./offlineParts";

// The offline copy keeps only what grown-ups chose (user request, November 2026): the chosen languages' voices and
// songs, the books not left out, the background song while music is on – never every language's voices (over 200 MB).

describe("which language a built file speaks", () => {
  test("recordings by their names, songs by their ending", () => {
    expect(languageOf("./static/0011a189.5tdt7mtm.mp3")).toBe("de");
    expect(languageOf("./static/en-0011a189.5tdt7mtm.mp3")).toBe("en");
    expect(languageOf("./static/musik-zaehneputzen-lied-ru.ab12cd34.mp3")).toBe("ru");
    expect(languageOf("./static/musik-hintergrund.ab12cd34.mp3")).toBeUndefined();
    expect(languageOf("./static/moo.ab12cd34.mp3")).toBeUndefined();
    expect(languageOf("./static/cover-alltag.ab12cd34.webp")).toBeUndefined();
    expect(isBackgroundSong("./static/musik-hintergrund.ab12cd34.mp3")).toBe(true);
    expect(isBackgroundSong("./static/musik-zaehneputzen-lied-ru.ab12cd34.mp3")).toBe(false);
  });

  test("English stands in where a language has far fewer recordings, never for German", () => {
    const files = [
      ...Array.from({ length: 10 }, (_, i) => `static/en-0000000${i}.x.mp3`),
      ...Array.from({ length: 10 }, (_, i) => `static/es-0000000${i}.x.mp3`),
      ...Array.from({ length: 2 }, (_, i) => `static/ru-0000000${i}.x.mp3`),
      "static/00000001.x.mp3",
    ];
    expect(needsEnglish(files)(["de", "en", "es", "ru", "zh"])).toEqual(["ru", "zh"]);
  });
});

describe("what a choice keeps", () => {
  const parts: OfflinePart[] = [
    { path: "./index.html", bytes: 1 },
    { path: "./static/zaehne.js", bytes: 10, books: ["zaehne"] },
    { path: "./static/de.mp3", bytes: 100, books: ["zaehne"], language: "de" },
    { path: "./static/en.mp3", bytes: 100, books: ["zaehne"], language: "en", standsIn: ["ru"] },
    { path: "./static/geteilt.js", bytes: 10, books: ["zaehne", "timer"] },
    { path: "./static/song.mp3", bytes: 1000, music: true },
  ];
  const keep = (choice: Parameters<typeof wanted>[1]) => parts.filter((part) => wanted(part, choice)).map((part) => part.path);

  test("by default every book in the app language", () => {
    expect(keep({ languages: ["de"], skip: [], music: true })).toEqual(parts.filter((p) => p.language !== "en").map((p) => p.path));
  });

  test("a book left out goes with its voices, what another book shares stays", () => {
    expect(keep({ languages: ["de"], skip: ["zaehne"], music: false })).toEqual(["./index.html", "./static/geteilt.js"]);
  });

  test("a language with few recordings keeps the English ones that stand in", () => {
    expect(keep({ languages: ["ru"], skip: [], music: false })).toContain("./static/en.mp3");
    expect(sizeOf({ parts }, { languages: ["de", "en"], skip: [], music: false })).toBe(221);
  });
});
