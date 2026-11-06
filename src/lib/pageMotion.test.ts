import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { afterPageMotion, pageMoves, pageMoving, pageStill } from "./pageMotion";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

describe("nothing starts while a book opens or a page turns", () => {
  test("what waits runs once every motion has ended, and not when cancelled", async () => {
    const ran: string[] = [];
    const book = pageMoves();
    const page = pageMoves();
    expect(pageMoving()).toBe(true);
    afterPageMotion(() => ran.push("story"));
    const cancel = afterPageMotion(() => ran.push("left"));
    cancel();
    let said = false;
    const line = pageStill().then(() => (said = true));
    book();
    book();
    expect(ran).toEqual([]);
    page();
    expect(pageMoving()).toBe(false);
    expect(ran).toEqual(["story"]);
    await line;
    expect(said).toBe(true);
    afterPageMotion(() => ran.push("now"));
    expect(ran).toEqual(["story", "now"]);
  });

  test("the book's travel and the page's turn hold the new screen until they lie still", () => {
    expect(source("./look.ts")).toMatch(/pageMoves\(\)/);
    expect(source("./bookTravel.ts").match(/pageMoves\(\)/g)?.length).toBe(2);
  });

  test("voice, background song and a game's CSS animations wait for it", () => {
    expect(source("./voice.ts").match(/await pageStill\(\)/g)?.length).toBe(2);
    expect(source("./backgroundMusic.ts")).toMatch(/afterPageMotion\(begin\)/);
    expect(source("../styles/book.css")).toMatch(/:root\[data-page-moving\] \.play-area \*[^{]*\{\s*animation-play-state: paused !important;/);
  });

  test("the games that start by themselves wait for it", () => {
    for (const game of [
      "../games/potty/PottyPlay.tsx",
      "../games/teeth/TeethPlay.tsx",
      "../games/adventure/AdventurePlay.tsx",
      "../games/feelings/RoundPlay.tsx",
    ])
      expect(source(game)).toMatch(/usePageStill|afterPageMotion|pageMoving/);
  });
});
