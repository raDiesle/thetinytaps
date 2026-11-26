// A run's moving parts are layers of their own only while they move (A-40): every layer costs the compositor in every
// frame, even still and off the screen, so a `Piece` whose part lies still most of the time passes `rest`.

import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { SETTLED_S, stirring } from "./trackPieces";

/** Pieces without `rest`, found by a piece of their tag's text, and why they need none. */
const ALWAYS_LAYERS: Record<string, string> = {
  PLANET_BOX: "the planet rocks whenever a thing comes round, which it does all the time",
  "at.x - 70": "a wormhole's swirl, small and turned by its own transform – spaceTrack.tsx, left to A-49",
  "WHEEL.cx - r": "the paddle wheel's spin follows its own state, not one age",
  "x - 64": "a puff of snow, mounted only while it flies",
  "x - reach": "drops, mounted only while they fly",
  "RAINBOW.cx": "the rainbow's flash, mounted only while it shines",
};

/** Every `<Piece …>` (or `<Layer …>`, its name in `trackParts.tsx`) opening tag in the files that use pieces. */
function pieceTags() {
  const dir = import.meta.dir;
  const tags: { file: string; tag: string }[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    const source = readFileSync(join(dir, file), "utf8");
    const named = /import \{([^}]*)\} from "\.\/trackPieces"/.exec(source)?.[1] ?? "";
    const name = /\bPiece as (\w+)/.exec(named)?.[1] ?? (/\bPiece\b/.test(named) ? "Piece" : null);
    if (!name) continue;
    for (const m of source.matchAll(new RegExp(`<${name}\\b`, "g"))) {
      // The tag ends at the first ">" outside braces (props hold arrows and comparisons).
      let depth = 0;
      let end = m.index;
      for (; end < source.length; end++) {
        const c = source[end];
        if (c === "{") depth++;
        else if (c === "}") depth--;
        else if (c === ">" && depth === 0) break;
      }
      tags.push({ file, tag: source.slice(m.index, end + 1) });
    }
  }
  return tags;
}

describe("run pieces", () => {
  test("a part is stirring from its hit until it settles", () => {
    expect(stirring(-1)).toBe(false);
    expect(stirring(0)).toBe(true);
    expect(stirring(0.9, 1)).toBe(true);
    expect(stirring(1, 1)).toBe(false);
    // The run holds every age at SETTLED_S, so a longer motion still ends there.
    expect(stirring(SETTLED_S, 99)).toBe(false);
  });

  test("every piece rests in the wall while still, or says why it needs none", () => {
    const tags = pieceTags();
    expect(tags.length).toBeGreaterThan(20);
    const bare = tags.filter(({ tag }) => !tag.includes("rest=") && !Object.keys(ALWAYS_LAYERS).some((k) => tag.includes(k)));
    expect(bare.map(({ file, tag }) => `${file}: ${tag.slice(0, 80)}`)).toEqual([]);
  });
});
