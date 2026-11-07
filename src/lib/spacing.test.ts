import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { repeatPause, spaced } from "./spacing";

describe("spaced", () => {
  test("lets one through, then none until the gap has passed", () => {
    let now = 1000;
    const gate = spaced(1500, () => now);
    expect(gate.pass()).toBe(true);
    now += 400;
    expect(gate.pass()).toBe(false);
    now += 1000;
    expect(gate.pass()).toBe(false);
    // Measured from the last pass, not from the last try: quick taps don't keep it shut for good.
    now += 100;
    expect(gate.pass()).toBe(true);
  });
});

describe("repeatPause", () => {
  test("the same key passes again only after the pause, another key at once", () => {
    let now = 1000;
    const gate = repeatPause(3000, () => now);
    expect(gate.pass("B")).toBe(true);
    now += 500;
    expect(gate.pass("B")).toBe(false);
    now += 2000;
    expect(gate.pass("B")).toBe(false);
    // Hammering doesn't keep it shut for good: measured from the last pass.
    now += 500;
    expect(gate.pass("B")).toBe(true);
    now += 100;
    expect(gate.pass("K")).toBe(true);
    now += 100;
    expect(gate.pass("B")).toBe(true);
  });

  // A child hammering one key heard its line and a note at every press (Buchstaben & Zahlen, November 2026).
  test("Buchstaben & Zahlen pauses a repeated key and spaces its soft notes", () => {
    const letters = new URL("../games/letters/", import.meta.url);
    const play = readFileSync(new URL("LettersPlay.tsx", letters), "utf8");
    expect(play).toContain("repeatPause()");
    expect(play).toContain("repeats.pass(toUpper(key, pack))");
    for (const file of ["LettersPlay.tsx", "WordsPlay.tsx", "FindPlay.tsx", "MovePlay.tsx"]) {
      const source = readFileSync(new URL(file, letters), "utf8");
      expect(source, file).toContain("useSoftTap(");
      expect(source, file).not.toContain("playRandomNote");
    }
  });
});

describe("lines that only accompany the play", () => {
  // Praise said for every pair chopped line after line when a child matched quickly (Socken-Paare, November 2026).
  test("Socken-Paare says its praise and its end's line with a gap", () => {
    const source = readFileSync(new URL("../games/socks/SocksPlay.tsx", import.meta.url), "utf8");
    expect(source).toContain("aside(oneOf(texts.pair))");
    expect(source).toContain("aside(texts.done)");
    expect(source).toMatch(/socksVoice\.say\([^)]*gap: ASIDE_LINE_GAP_MS/);
  });

  /** Games that still say praise with a plain `say`, and why that can't pile up there. */
  const PLAIN_PRAISE: Record<string, string> = {
    "scenes/ScenePlay.tsx": "the browser's voice, which is always off (FIXED in common.ts)",
    "feelings/shared.tsx": "once per story round, between the story's own lines",
  };

  test("praise goes through a gap (an `aside` or `praise` of the game), not a plain say", () => {
    const games = new URL("../games/", import.meta.url).pathname;
    const plain: string[] = [];
    for (const file of readdirSync(games, { recursive: true }) as string[]) {
      if (!file.endsWith(".tsx") || PLAIN_PRAISE[file]) continue;
      readFileSync(join(games, file), "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (/\bsay\([^;]*\b(praise|texts\.pair)\b/i.test(line)) plain.push(`${file}:${i + 1}`);
        });
    }
    expect(plain).toEqual([]);
  });
});
