import { readFileSync } from "node:fs";
import { describe, expect, test } from "bun:test";
import { RECORDED_GAMES } from "@/content/recordedLines";
import { voiceLines } from "@/content/voiceLines";

// The loudspeaker that switches a story's voice off stands only where a grown-up may want to tell the story in their
// own words (user decisions, November 2026): Gefühle's „Alltagssituationen“ and the chapter books read aloud by
// Tapsi's voice – Abstillen, Schnullerfee and Kita-Start. Never a pattern for other games (root CLAUDE.md).

/** Every .ts and .tsx file under src, tests left out. */
const SOURCES = [...new Bun.Glob("src/**/*.{ts,tsx}").scanSync()].filter((file) => !/\.test\.tsx?$/.test(file));

/** The chapter books read aloud: their game file, route and recording list. */
const BOOKS = [
  { file: "src/games/milkchain/MilkChainGame.tsx", href: "/abstillen/", name: "abstillen", folder: "src/games/milkchain/stimme" },
  { file: "src/games/pacifierstory/PacifierStoryGame.tsx", href: "/schnullerfee/", name: "schnullerfee", folder: "src/games/pacifierstory/stimme" },
  { file: "src/games/kitastory/KitaStoryGame.tsx", href: "/kita/", name: "kita", folder: "src/games/kitastory/stimme" },
];

describe("the voice switch", () => {
  test("stands only in Alltagssituationen and the chapter books", () => {
    const users = SOURCES.filter((file) => readFileSync(file, "utf8").includes("<VoiceSwitch")).sort();
    expect(users).toEqual(["src/components/ChapterBook.tsx", "src/games/feelings/FeelingsPlay.tsx"]);
  });

  test("the chapter books read aloud, with their lines on the recording list", () => {
    for (const book of BOOKS) {
      expect(readFileSync(book.file, "utf8"), book.file).toContain("voice={VOICE}");
      expect(RECORDED_GAMES.find((g) => g.name === book.name)?.folder, book.name).toBe(book.folder);
      expect(voiceLines().find((g) => g.href === book.href)?.groups.length ?? 0, book.href).toBeGreaterThan(0);
    }
  });

  test("a switched-off book loads and says nothing, and the corner's tap never turns the page", () => {
    const book = readFileSync("src/components/ChapterBook.tsx", "utf8");
    expect(book).toContain("if (!voice || !reading) return;");
    expect(book).toContain('<div className="cb-voice" onPointerDown={(e) => e.stopPropagation()}>');
  });
});
