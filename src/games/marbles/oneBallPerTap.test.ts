import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// One tap lets out one ball, never more, and no ball leaves by itself (user decision, 25 November 2026: on the first
// marble run the shelf let out the next thing every two seconds after the first tap, and it looked as if one tap had
// dropped several marbles). So nothing a level's frame step calls – directly or through its own helpers – may let a
// ball out: only a tap's or a key's handler does.

/** The text from `open` (an opening bracket's index) to its matching closing bracket. */
function block(src: string, open: number): string {
  const close = { "(": ")", "{": "}" }[src[open] as "(" | "{"];
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === src[open]) depth++;
    else if (src[i] === close && --depth === 0) return src.slice(open, i + 1);
  }
  throw new Error("unbalanced brackets");
}

/** The body of the level's own `const name = (…) => { … }`, or null when the file defines no such function. */
function helperBody(src: string, name: string): string | null {
  const at = src.search(new RegExp(`\\bconst ${name} = (?:\\([^)]*\\)|\\w+)(?:: [^=]+)? =>`));
  if (at < 0) return null;
  const arrow = src.indexOf("=>", at);
  const brace = src.slice(arrow + 2).search(/\S/) + arrow + 2;
  return src[brace] === "{" ? block(src, brace) : src.slice(arrow + 2, src.indexOf(";", arrow));
}

/** Every function of the file the frame step reaches. */
function reachedFromStep(src: string): Set<string> {
  const step = block(src, src.indexOf("useFrames(") + "useFrames".length);
  const seen = new Set<string>();
  const todo = [step];
  while (todo.length) {
    for (const [, name] of (todo.pop() as string).matchAll(/\b([a-zA-Z_]\w*)\(/g)) {
      if (seen.has(name)) continue;
      seen.add(name);
      const body = helperBody(src, name);
      if (body) todo.push(body);
    }
  }
  return seen;
}

const LEVELS: [file: string, letsOut: string[]][] = [
  ["TrackLevel.tsx", ["take", "open", "release"]],
  ["PegsLevel.tsx", ["drop"]],
];

for (const [file, letsOut] of LEVELS) {
  test(`${file}: no ball is let out without a tap`, () => {
    const src = readFileSync(join(import.meta.dir, file), "utf8");
    for (const name of letsOut) expect(helperBody(src, name), `${file} defines ${name}`).not.toBeNull();
    const reached = reachedFromStep(src);
    expect(letsOut.filter((name) => reached.has(name))).toEqual([]);
  });
}
