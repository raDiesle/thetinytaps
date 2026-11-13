import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { METALS, trophyLook } from "@/components/Trophy";
import { museumLayout, museumRooms } from "@/components/TrophyMuseum";
import { everyTrophy, trophyPicture } from "@/components/trophyPictures";
import { CATEGORIES } from "@/content/games";
import { awardTrophy, gameOfPath, hasTrophy, resetTrophiesForTest, trophyWins } from "./trophies";

// The trophies a child collects (CLAUDE.md, „What a child does collect are trophies“): one per level, each looking like
// no other, awarded by the shared GameEnd of every game.

afterEach(() => resetTrophiesForTest());

describe("trophies", () => {
  test("a level's trophy is given once and then counts how often it was won (user request, November 2026)", () => {
    resetTrophiesForTest();
    expect(awardTrophy("/bilder/", "bauernhof", 1)).toBe(true);
    expect(awardTrophy("/bilder/", "bauernhof", 2)).toBe(false);
    expect(hasTrophy("/bilder/", "bauernhof")).toBe(true);
    expect(trophyWins("/bilder/", "bauernhof")).toBe(2);
    expect(hasTrophy("/bilder/", "zoo")).toBe(false);
    expect(trophyWins("/bilder/", "zoo")).toBe(0);
  });

  test("a trophy given before the level's end (one ball in the goal) is counted once with its end", () => {
    resetTrophiesForTest();
    awardTrophy("/kettenreaktion/", "track", 1, { early: true });
    awardTrophy("/kettenreaktion/", "track", 2);
    expect(trophyWins("/kettenreaktion/", "track")).toBe(1);
    awardTrophy("/kettenreaktion/", "track", 3, { early: true });
    awardTrophy("/kettenreaktion/", "track", 4);
    expect(trophyWins("/kettenreaktion/", "track")).toBe(2);
    // An end without a goal before it counts on its own.
    awardTrophy("/kettenreaktion/", "track", 5);
    expect(trophyWins("/kettenreaktion/", "track")).toBe(3);
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

  test("the trophy room puts every trophy on one plinth, at most a room's plinths in each room, a game's together", () => {
    const all = everyTrophy();
    for (const perRoom of [2, 3, 4, 6]) {
      const rooms = museumRooms(all, perRoom);
      const placed = rooms.flatMap((room) => room.trophies);
      expect(placed.length).toBe(all.length);
      expect(new Set(placed).size).toBe(all.length);
      for (const room of rooms) {
        expect(room.trophies.length).toBeGreaterThan(0);
        expect(room.trophies.length).toBeLessThanOrEqual(perRoom);
      }
      // A game with few trophies is never split over two rooms.
      for (const game of new Set(all.map((trophy) => trophy.game))) {
        const count = all.filter((trophy) => trophy.game === game).length;
        if (count > perRoom) continue;
        expect(rooms.filter((room) => room.trophies.some((trophy) => trophy.game === game)).length, game).toBe(1);
      }
    }
    expect(museumRooms([], 4)).toEqual([{ trophies: [], games: [] }]);
  });

  test("the trophy room's trophies are big on every screen, and fit its row", () => {
    for (const [w, h] of [
      [844, 390],
      [390, 844],
      [1024, 768],
      [1280, 720],
      [1920, 1080],
    ]) {
      const layout = museumLayout(w, h);
      expect(layout.perRoom).toBeGreaterThanOrEqual(2);
      // At least a fifth of the screen's height: the medallion's picture must be recognised.
      expect(layout.trophy, `${w}×${h}`).toBeGreaterThanOrEqual(Math.min(w, h) * 0.2);
      expect(layout.trophy * 0.74 * layout.perRoom, `${w}×${h}`).toBeLessThan(w);
    }
  });

  test("a trophy won again shows its count on its foot, and a tap on it at a level's end opens the trophy room", () => {
    expect(readFileSync("src/components/Trophy.tsx", "utf8")).toContain("trophy-wins");
    expect(readFileSync("src/components/GameEnd.tsx", "utf8")).toContain("museumHref(");
  });

  test("Kettenreaktion's trophies hold a ball in their cup, and one ball in the goal wins one", () => {
    for (const level of ["track", "colortrack", "pegs", "garden", "circus"]) {
      const look = trophyLook("/kettenreaktion/", level);
      expect(look.lid).toBe("ball-in");
      expect(look.form).not.toBe("star");
      expect(look.ball).toBeTruthy();
    }
    expect(trophyLook("/bilder/", "zoo").ball).toBeUndefined();
    expect(readFileSync("src/games/marbles/MarblePlay.tsx", "utf8")).toContain("onGoal={onGoal}");
    for (const file of ["src/games/marbles/TrackLevel.tsx", "src/games/marbles/PegsLevel.tsx"]) {
      expect(readFileSync(file, "utf8"), file).toContain("onGoal?.()");
    }
  });

  test("the test view on /pokale/?alle has every finished game's trophies, each once", () => {
    const all = everyTrophy();
    const keys = all.map((trophy) => `${trophy.game}#${trophy.level}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const game of CATEGORIES.flatMap((category) => category.games)) {
      if (!game.unfinished)
        expect(
          all.some((trophy) => trophy.game === game.href),
          game.href,
        ).toBe(true);
    }
    expect(all.filter((trophy) => trophy.game === "/kettenreaktion/").length).toBeGreaterThan(10);
    expect(readFileSync("src/pages/ManagementPage.tsx", "utf8")).toContain("ALL_TROPHIES");
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
