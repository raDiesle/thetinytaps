import { describe, expect, test } from "bun:test";
import { isBackgroundSong, isVoice, languageOf, needsEnglish, type OfflinePart, sizeOf, wanted } from "./offlineParts";

// The offline copy keeps only what grown-ups chose (user request, November 2026): the books not left out, in the app
// language, with its voices and the background song if chosen – never every language's voices (over 200 MB).

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
    // A game's own song is part of the game, not a voice: Zähne putzen can't brush without it.
    expect(isVoice("./static/en-0011a189.5tdt7mtm.mp3")).toBe(true);
    expect(isVoice("./static/0011a189.5tdt7mtm.mp3")).toBe(true);
    expect(isVoice("./static/musik-zaehneputzen-lied-ru.ab12cd34.mp3")).toBe(false);
    expect(isVoice("./static/musik-hintergrund.ab12cd34.mp3")).toBe(false);
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
    { path: "./static/de.mp3", bytes: 100, books: ["zaehne"], language: "de", voice: true },
    { path: "./static/en.mp3", bytes: 100, books: ["zaehne"], language: "en", voice: true, standsIn: ["ru"] },
    { path: "./static/lied-de.mp3", bytes: 300, books: ["zaehne"], language: "de" },
    { path: "./static/geteilt.js", bytes: 10, books: ["zaehne", "timer"] },
    { path: "./static/song.mp3", bytes: 1000, music: true },
  ];
  const keep = (choice: Parameters<typeof wanted>[1]) => parts.filter((part) => wanted(part, choice)).map((part) => part.path);

  test("without voices or music the game and its own song stay", () => {
    expect(keep({ languages: ["de"], skip: [], music: false, voices: false })).toEqual([
      "./index.html",
      "./static/zaehne.js",
      "./static/lied-de.mp3",
      "./static/geteilt.js",
    ]);
  });

  test("by default every book in the app language", () => {
    expect(keep({ languages: ["de"], skip: [], music: true, voices: true })).toEqual(parts.filter((p) => p.language !== "en").map((p) => p.path));
  });

  test("a book left out goes with its voices, what another book shares stays", () => {
    expect(keep({ languages: ["de"], skip: ["zaehne"], music: false, voices: true })).toEqual(["./index.html", "./static/geteilt.js"]);
  });

  test("a language with few recordings keeps the English ones that stand in", () => {
    expect(keep({ languages: ["ru"], skip: [], music: false, voices: true })).toContain("./static/en.mp3");
    expect(sizeOf({ parts }, { languages: ["de", "en"], skip: [], music: false, voices: true })).toBe(521);
  });
});
