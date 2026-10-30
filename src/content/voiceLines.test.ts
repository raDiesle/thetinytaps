import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { CATEGORIES } from "./games";
import { INLINE_LINES, voiceLines } from "./voiceLines";

const GAMES = voiceLines();
const HREFS = new Set(CATEGORIES.flatMap((c) => c.games.map((g) => g.href)));

/** Every .ts and .tsx file under `dir`, tests left out. */
const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) && !name.includes(".test.") ? [path] : [];
  });

describe("lines still to record", () => {
  test("every game on the list exists, and every group has lines", () => {
    for (const game of GAMES) {
      expect({ href: game.href, known: game.href === "" || HREFS.has(game.href) }).toEqual({ href: game.href, known: true });
      for (const group of game.groups)
        expect({ href: game.href, group: group.label, empty: group.lines.length === 0 }).toEqual({ href: game.href, group: group.label, empty: false });
    }
  });

  test("a line copied from a component is still written there", () => {
    for (const lines of Object.values(INLINE_LINES)) {
      for (const { text, file } of lines) expect({ text, file, there: readFileSync(file, "utf8").includes(`"${text}"`) }).toEqual({ text, file, there: true });
    }
  });

  // The browser's voice never speaks (root CLAUDE.md): a call of it only stays where the shared read aloud option,
  // which is always off, guards it – the good-night screen once spoke without it. Its lines are on the list instead.
  test("every call of the browser's voice sits behind the read aloud option", () => {
    for (const file of sources("src")) {
      const code = readFileSync(file, "utf8");
      if (!/import \{[^}]*\bspeak\b[^}]*\} from "@\/lib\/speech"/.test(code)) continue;
      expect({ file, guarded: /settings\.speech|\bspeech &&/.test(code) }).toEqual({ file, guarded: true });
    }
  });
});
