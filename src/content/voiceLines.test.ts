import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { CATEGORIES } from "./games";
import { RECORDED_GAMES } from "./recordedLines";
import { INLINE_LINES, voiceLines } from "./voiceLines";

const GAMES = voiceLines();
const HREFS = new Set(CATEGORIES.flatMap((c) => c.games.flatMap((g) => [g.href, ...(g.also ?? [])])));

/** Every .ts and .tsx file under `dir`, tests left out. */
const sources = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.tsx?$/.test(name) && !name.includes(".test.") ? [path] : [];
  });

describe("lines still to record", () => {
  // Lebendige Bilder answers with its sounds and narrates nothing; its lines are parked until the user orders exactly
  // their recording (user decision, November 2026), so no recording run may pick them up by itself.
  test("a parked game is never recorded unasked", () => {
    expect(GAMES.filter((g) => g.parked).map((g) => g.href)).toContain("/bilder/");
    const scenes = join("src", "games", "scenes");
    expect(RECORDED_GAMES.filter((g) => g.folder.startsWith(scenes)).map((g) => g.name)).toEqual([]);
    expect(existsSync(join(scenes, "stimme"))).toBe(false);
  });

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

  // Kettenreaktion's levels write some lines inline (`say({ de: … })`, a marble run's `full`): five were once missing
  // from the list, so they were never recorded.
  test("every line a Kettenreaktion level writes inline is on the list", () => {
    const listed = new Set(GAMES.find((g) => g.href === "/kettenreaktion/")?.groups.flatMap((g) => g.lines));
    for (const file of sources(join("src", "games", "marbles"))) {
      const code = readFileSync(file, "utf8");
      for (const [, text] of code.matchAll(/(?:say\(|full: )\{\s*de: "([^"]+)"/g))
        expect({ file, text, listed: listed.has(text) }).toEqual({ file, text, listed: true });
    }
  });

  // The browser's voice speaks only for a line not recorded yet, and only in a game whose story is told by the voice
  // (root CLAUDE.md): src/lib/voice.ts does that for the games below, and nothing else may make it speak – the
  // good-night screen once spoke with it. So only voice.ts takes `speak` from the speech module, and only the
  // speech module itself hands a sentence to the browser (`speechSynthesis.speak`, `SpeechSynthesisUtterance`).
  test("only the voice's fallback calls the browser's voice", () => {
    const voice = join("src", "lib", "voice.ts");
    const speech = join("src", "lib", "speech.ts");
    for (const file of sources("src")) {
      if (file === speech) continue;
      const code = readFileSync(file, "utf8");
      const importsSpeak = /import \{[^}]*\bspeak\b[^}]*\} from "[^"]*\/speech"/.test(code);
      const speaksItself = /speechSynthesis\.speak\b|SpeechSynthesisUtterance/.test(code);
      expect({ file, speaks: (importsSpeak && file !== voice) || speaksItself }).toEqual({ file, speaks: false });
    }
  });

  test("only the games told by their voice fall back to the browser's voice", () => {
    const told = [join("src", "games", "elevator", "voice.ts"), join("src", "games", "adventure", "voice.ts")];
    const using = sources("src").filter((file) => /recordedVoice\([^)]*browser: true/.test(readFileSync(file, "utf8")));
    expect(using.sort()).toEqual(told.sort());
  });
});
