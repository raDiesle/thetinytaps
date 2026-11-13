import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { afterPageMotion, ENTRANCE_MS, isEntrance, pageMoves, pageMoving, pageStill } from "./pageMotion";

const source = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

/** An animation's effect as `isEntrance` sees it: how long it lasts and its first keyframe. */
const effect = (endTime: number, first: Record<string, unknown>) => ({ getComputedTiming: () => ({ endTime }), getKeyframes: () => [first, {}] });

describe("a page moves in whole, its pictures with their texts", () => {
  // User feedback, November 2026 (Was gehört zum Tier?): held on their first frame while the page turned, the pictures
  // popping in were missing, while the question under them and the corner's note stood there already.
  test("a picture's short entrance from invisible is shown over at once, a story's or a loop's never", () => {
    expect(isEntrance(effect(500, { opacity: "0", transform: "scale(0.3)" }))).toBe(true);
    expect(isEntrance(effect(ENTRANCE_MS, { opacity: "0" }))).toBe(true);
    expect(isEntrance(effect(2100, { opacity: "0" }))).toBe(false);
    expect(isEntrance(effect(Number.POSITIVE_INFINITY, { opacity: "0" }))).toBe(false);
    expect(isEntrance(effect(500, { transform: "rotate(0deg)" }))).toBe(false);
    expect(isEntrance(null)).toBe(false);
  });

  test("the shared pop-in starts invisible and is short, so it counts as an entrance", () => {
    const popIn = source("../styles/animations.css").match(/@keyframes pop-in \{\s*from \{([^}]*)\}/)?.[1] ?? "";
    expect(popIn).toMatch(/opacity:\s*0;/);
  });
});

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
