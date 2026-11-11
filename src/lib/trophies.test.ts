import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { trophyRow } from "@/components/TrophyShelf";
import { METALS, trophyLook } from "@/components/Trophy";
import { trophyPicture } from "@/components/trophyPictures";
import { CATEGORIES } from "@/content/games";
import { awardTrophy, gameOfPath, hasTrophy, resetTrophiesForTest } from "./trophies";

// The trophies a child collects (CLAUDE.md, „What a child does collect are trophies“): one per level, each looking like
// no other, awarded by the shared GameEnd of every game.

afterEach(() => resetTrophiesForTest());

describe("trophies", () => {
  test("a level's trophy is won once, winning it again changes nothing", () => {
    resetTrophiesForTest();
    expect(awardTrophy("/bilder/", "bauernhof", 1)).toBe(true);
    expect(awardTrophy("/bilder/", "bauernhof", 2)).toBe(false);
    expect(hasTrophy("/bilder/", "bauernhof")).toBe(true);
    expect(hasTrophy("/bilder/", "zoo")).toBe(false);
  });

  test("an address belongs to the game whose address it starts with, the longest", () => {
    expect(gameOfPath("/bilder/bauernhof/")?.href).toBe("/bilder/");
    expect(gameOfPath("/en/bilder/")).toBeUndefined();
    expect(gameOfPath("/")).toBeUndefined();
    for (const game of CATEGORIES.flatMap((category) => category.games)) expect(gameOfPath(game.href)?.href).toBe(game.href);
  });

  test("a trophy looks the same on every visit, and the levels of one game differ", () => {
    expect(trophyLook("/bilder/", "zoo")).toEqual(trophyLook("/bilder/", "zoo"));
    const looks = ["bauernhof", "zoo", "stadt", "wald", "strand", "baustelle"].map((level) => JSON.stringify(trophyLook("/bilder/", level)));
    expect(new Set(looks).size).toBeGreaterThan(4);
  });

  test("neighbouring games' trophies are of different metals", () => {
    const games = CATEGORIES.flatMap((category) => category.games);
    for (let i = 1; i < games.length; i++) {
      expect(trophyLook(games[i].href, "").metal).not.toBe(trophyLook(games[i - 1].href, "").metal);
    }
    expect(new Set(METALS.map((metal) => metal.base)).size).toBe(METALS.length);
  });

  test("every game's trophy has a picture in its medallion", () => {
    for (const game of CATEGORIES.flatMap((category) => category.games)) {
      if (game.unfinished) continue;
      expect(trophyPicture(game.href, ""), game.href).toBeTruthy();
    }
  });

  test("the shelf always shows at least one trophy once any is won, and none before", () => {
    expect(trophyRow(200, 100, 0)).toEqual({ count: 0, width: 0 });
    expect(trophyRow(5, 100, 3).count).toBe(1);
    expect(trophyRow(10_000, 100, 3).count).toBe(3);
    const row = trophyRow(150, 100, 9);
    expect(row.width).toBeLessThanOrEqual(150);
  });

  test("the end of a level awards it, and the games with levels pass theirs", () => {
    expect(readFileSync("src/components/GameEnd.tsx", "utf8")).toContain("awardTrophy(");
    for (const file of [
      "src/games/scenes/ScenePlay.tsx",
      "src/games/marbles/MarblePlay.tsx",
      "src/games/elevator/cards.tsx",
      "src/games/adventure/AdventurePlay.tsx",
      "src/games/feelings/DayPlay.tsx",
      "src/games/feelings/PassPlay.tsx",
      "src/games/cause/CausePlay.tsx",
      "src/games/timer/TimerPlay.tsx",
      "src/games/timer/SwapPlay.tsx",
    ]) {
      expect(readFileSync(file, "utf8"), file).toMatch(/<GameEnd[^>]*\blevel=/);
    }
  });
});
