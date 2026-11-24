import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { METALS, trophyLook } from "@/components/Trophy";
import { museumLayout, museumTree, type MuseumNode, tierPlan } from "@/components/museumLayout";
import { everyTrophy, trophyPicture } from "@/components/trophyPictures";
import { CATEGORIES } from "@/content/games";
import { awardTrophy, gameOfPath, hasTrophy, resetTrophiesForTest, trophyHref, trophyWins } from "./trophies";

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
    // A toy on the shelf (`Category.toy`) has no end, so no trophy.
    for (const game of CATEGORIES.filter((category) => !category.toy).flatMap((category) => category.games)) {
      if (game.unfinished) continue;
      expect(trophyPicture(game.href, ""), game.href).toBeTruthy();
    }
  });

  const SCREENS = [
    [844, 390],
    [390, 844],
    [1024, 768],
    [1280, 720],
    [1920, 1080],
  ];

  test("the trophy room's hall has a door for each category with trophies, every trophy behind exactly one room", () => {
    const all = everyTrophy();
    for (const [w, h] of SCREENS) {
      const tree = museumTree(all, museumLayout(w, h));
      const rooms: MuseumNode[] = tree.flatMap((node) => node.kids ?? [node]);
      const placed = rooms.flatMap((room) => room.trophies);
      expect(placed.length, `${w}×${h}`).toBe(all.length);
      expect(new Set(placed).size).toBe(all.length);
      // Only categories with trophies have a door, and only a category with several games is ever a wing.
      expect(new Set(tree.map((node) => node.id)).size).toBe(tree.length);
      for (const node of tree) if (node.kids) expect(node.kids.length).toBeGreaterThan(1);
    }
    expect(museumTree([], museumLayout(844, 390))).toEqual([]);
  });

  test("the trophy room's trophies stand big on every screen: a room has as many tiers as its trophies need", () => {
    for (const [w, h] of SCREENS) {
      const layout = museumLayout(w, h);
      const rooms = museumTree(everyTrophy(), layout).flatMap((node) => node.kids ?? [node]);
      for (const room of rooms) {
        const plan = tierPlan(room.trophies.length, layout);
        // The medallion's picture must be recognised: a wing's game room may still be small, a category's room never.
        expect(plan.trophy, `${w}×${h} ${room.id}`).toBeGreaterThanOrEqual(Math.min(w, h) * 0.1);
        expect(plan.per * plan.rows).toBeGreaterThanOrEqual(room.trophies.length);
        expect(plan.cellW * plan.per).toBeLessThanOrEqual(layout.area.w + 1);
        expect(plan.cellH * plan.rows).toBeLessThanOrEqual(layout.area.h + 1);
      }
      // More trophies never make fewer tiers.
      expect(tierPlan(30, layout).rows).toBeGreaterThanOrEqual(tierPlan(3, layout).rows);
    }
  });

  test("a trophy tapped in the trophy room comes close through a magnifying glass", () => {
    expect(readFileSync("src/components/TrophyMuseum.tsx", "utf8")).toContain("museum-lens-rim");
    expect(readFileSync("src/styles/museum.css", "utf8")).toContain("@keyframes museum-lens-clip");
  });

  test("every door says where it leads, and a plan of all rooms shows where one is and walks to any of them", () => {
    const code = readFileSync("src/components/TrophyMuseum.tsx", "utf8");
    expect(code).toContain("museum-door-sign");
    expect(code).toContain("museum-plan-room");
    expect(code).toContain('aria-current={key === now ? "location"');
  });

  test("a trophy won again shows its count on its foot, and a tap on it at a level's end opens the trophy room", () => {
    expect(readFileSync("src/components/Trophy.tsx", "utf8")).toContain("trophy-wins");
    expect(readFileSync("src/components/GameEnd.tsx", "utf8")).toContain("museumHref(");
  });

  test("a trophy shown big in the trophy room leads to its level, and ✕ there back into the room (user request, November 2026)", () => {
    expect(trophyHref("/timer/", "sand")).toBe("/timer/sand/");
    expect(trophyHref("/bilder/", "zoo")).toBe("/bilder/zoo/");
    expect(trophyHref("/kettenreaktion/", "track")).toBe("/kettenreaktion/track/");
    // A round or story without an address of its own opens its game; a game no longer on the shelf, nothing.
    expect(trophyHref("/was-ist-passiert/", "runde-1")).toBe("/was-ist-passiert/");
    expect(trophyHref("/zaehne/", "")).toBe("/zaehne/");
    expect(trophyHref("/gibt-es-nicht/", "")).toBeUndefined();
    // Every trophy of the test view leads somewhere.
    for (const trophy of everyTrophy()) expect(trophyHref(trophy.game, trophy.level), `${trophy.game}#${trophy.level}`).toBeTruthy();
    const museum = readFileSync("src/components/TrophyMuseum.tsx", "utf8");
    expect(museum).toContain("museum-big-play");
    expect(museum).toContain("backTo:");
    const shell = readFileSync("src/components/GameShell.tsx", "utf8");
    expect(shell).toContain("else if (backTo) goBack(navigate, backTo);");
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
    for (const game of CATEGORIES.filter((category) => !category.toy).flatMap((category) => category.games)) {
      if (!game.unfinished)
        expect(
          all.some((trophy) => trophy.game === game.href),
          game.href,
        ).toBe(true);
    }
    expect(all.filter((trophy) => trophy.game === "/kettenreaktion/").length).toBeGreaterThan(10);
    expect(readFileSync("src/pages/management/tools.ts", "utf8")).toContain("ALL_TROPHIES");
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
