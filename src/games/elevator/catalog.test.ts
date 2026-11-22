import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { CARDS, loadCard } from "./catalog";
import { STORIES } from "./content";
import { FILMS } from "./film/films";
import { TRAIL_LEVELS } from "./trail/levels";

// The start screen loads no level (November 2026: all 20 in its chunk were 591 KB of code, 166 KB gzip, fetched before
// its cards showed): catalog.ts keeps what the cards need, each level comes by `import()` when it is played or its card
// is pressed – the lift stories together, each trail level and each film on its own, with its player.

const dir = import.meta.dir;

/** The game's files a file imports at load time, relative ones only (`import … from "./x"`, not `import type`, not `import("./x")`). */
function staticImports(file: string): string[] {
  const code = readFileSync(join(dir, file), "utf8");
  return [...code.matchAll(/^import\s+(?!type\b)(?:[^;]*?from\s+)?"(\.[^"?]+)"/gms)].flatMap(([, path]) => {
    const base = join(dir, dirname(file), path);
    const found = [".ts", ".tsx", "/index.ts"].map((ext) => base + ext).find((candidate) => existsSync(candidate));
    return found ? [relative(dir, found)] : [];
  });
}

/** Every file of the game `file` loads with it, itself included. */
function reached(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  for (const next of staticImports(file)) reached(next, seen);
  return seen;
}

/** The modules holding the levels' data, each with what only it draws. */
const LIFT = ["content.ts", "ElevatorPlay.tsx", "rooms.tsx"];
const TRAILS = ["drachen", "ball", "ballon", "lok", "floss", "sandburg", "picknick", "katze", "schneemann"].map((id) => `trail/${id}.tsx`);
const FILM_FILES = ["feuerwehr", "brief", "baecker", "garten", "krankenwagen", "korn", "haus", "muell"].map((id) => `film/${id}.tsx`);
const LISTS = ["trail/levels.ts", "film/films.ts"];

describe("Kleine Abenteuer's start screen stays small", () => {
  test("the start screen, the catalog and the end's cards load no level, no player and no list of all levels", () => {
    for (const file of ["ElevatorGame.tsx", "cards.tsx", "catalog.ts"]) {
      const loads = [...reached(file)].filter((f) => f !== file);
      expect(loads.sort(), file).toEqual(["catalog.ts", "phrases.ts", "settings.ts", "cards.tsx"].filter((f) => loads.includes(f)).sort());
    }
  });

  test("the players load no level but their own kind's shared parts", () => {
    const players = {
      "trail/TrailPlay.tsx": [...LIFT, ...TRAILS, ...FILM_FILES, ...LISTS],
      "film/FilmPlay.tsx": [...LIFT, ...TRAILS, ...FILM_FILES, ...LISTS],
    };
    for (const [player, never] of Object.entries(players)) for (const file of never) expect(reached(player).has(file), `${player} loads ${file}`).toBe(false);
    for (const file of [...TRAILS, ...FILM_FILES, ...LISTS]) expect(reached("ElevatorPlay.tsx").has(file), `ElevatorPlay.tsx loads ${file}`).toBe(false);
  });

  test("a trail level or film loads no other one (but „From grain to bread“, which retells the baker's oven and breakfast)", () => {
    for (const file of [...TRAILS, ...FILM_FILES]) {
      const others = [...TRAILS, ...FILM_FILES, ...LIFT.slice(0, 2), ...LISTS].filter(
        (f) => f !== file && !(file === "film/korn.tsx" && f === "film/baecker.tsx"),
      );
      for (const other of others) expect(reached(file).has(other), `${file} loads ${other}`).toBe(false);
    }
  });

  test("the import check sees a level", () => {
    expect(reached("film/films.ts").has("film/korn.tsx")).toBe(true);
    expect(reached("trail/levels.ts").has("trail/ball.tsx")).toBe(true);
  });

  test("the catalog lists every story, level and film once, in play order, with its title", () => {
    const all = [
      ...STORIES.map((s) => ({ id: s.id, title: s.title, first: undefined, kind: "lift" })),
      ...TRAIL_LEVELS.map((l) => ({ id: l.id, title: l.title, first: undefined, kind: "trail" })),
      ...FILMS.map((f) => ({ id: f.id, title: f.title, first: f.first, kind: "film" })),
    ];
    expect(CARDS.map((c) => ({ id: c.id, title: c.title, first: c.first, kind: c.kind as string }))).toEqual(all);
  });

  test("each card loads its own level and a player", async () => {
    for (const card of CARDS) {
      if (card.kind === "trail") expect(await card.level(), card.id).toBe(TRAIL_LEVELS.find((l) => l.id === card.id) as never);
      if (card.kind === "film") expect(await card.film(), card.id).toBe(FILMS.find((f) => f.id === card.id) as never);
      expect(typeof (await loadCard(card)), card.id).toBe("function");
    }
  });
});
