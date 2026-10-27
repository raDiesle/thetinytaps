import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";
import { PHONE_SCREEN } from "@/lib/fitGrid";

// All CSS is global, and games are loaded one by one: a name used twice means the
// look depends on which game was opened first. Prefix names by game or scene.

const cssFiles = readdirSync("src", { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".css"))
  .map((file) => join("src", file));

test("keyframe names are unique across all CSS files", () => {
  const files = new Map<string, string[]>();
  for (const file of cssFiles) {
    for (const [, name] of readFileSync(file, "utf8").matchAll(/@keyframes\s+([\w-]+)/g)) {
      files.set(name, [...(files.get(name) ?? []), file]);
    }
  }
  const twice = [...files].filter(([, where]) => where.length > 1).map(([name, where]) => `${name}: ${where.join(", ")}`);
  expect(twice).toEqual([]);
});

// Words in an `animation` shorthand that are not keyframe names.
const animationKeywords = new Set(
  "none infinite linear ease ease-in ease-out ease-in-out step-start step-end forwards backwards both normal reverse alternate alternate-reverse running paused inherit initial unset".split(
    " ",
  ),
);

/** The keyframe names an `animation` or `animation-name` in this CSS uses. */
function usedKeyframes(css: string): string[] {
  const names: string[] = [];
  for (const [, value] of css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/animation(?:-name)?\s*:\s*([^;}]+)/g)) {
    let words = value;
    // Drop cubic-bezier(…), var(…), calc(var(…) * …): inner calls first.
    while (/[\w-]+\([^()]*\)/.test(words)) words = words.replace(/[\w-]+\([^()]*\)/g, " ");
    for (const word of words.split(/[\s,]+/)) {
      if (/^[a-z][\w-]*$/i.test(word) && !animationKeywords.has(word)) names.push(word);
    }
  }
  return names;
}

// A game's CSS arrives only when the game is opened, so keyframes from another game's
// CSS may be missing. Keyframes a game borrows live in a stylesheet every page loads
// (src/styles/animations.css); a game may use its own and those.
test("keyframes come from the same game or from a stylesheet every page loads", () => {
  const everyPage = [...readFileSync("src/globals.css", "utf8").matchAll(/@import\s+"\.\/(styles\/[\w-]+\.css)"/g)].map(([, file]) => join("src", file));
  /** The folder whose CSS loads together: a game's folder, or the file itself outside games. */
  const owner = (file: string) => file.match(/^src\/games\/[^/]+\//)?.[0] ?? file;
  const definedIn = new Map<string, string>();
  for (const file of cssFiles) {
    for (const [, name] of readFileSync(file, "utf8").matchAll(/@keyframes\s+([\w-]+)/g)) definedIn.set(name, file);
  }
  const wrong: string[] = [];
  for (const file of cssFiles) {
    for (const name of new Set(usedKeyframes(readFileSync(file, "utf8")))) {
      const where = definedIn.get(name);
      if (!where) wrong.push(`${file}: ${name} is not defined anywhere`);
      else if (!everyPage.includes(where) && owner(file) !== owner(where)) wrong.push(`${file}: ${name} comes from ${where}`);
    }
  }
  expect(wrong).toEqual([]);
});

// Menus switch to their phone layout in the styles and in useFitGrid at the same size,
// or the cards are sized for one layout and drawn in the other.
test("phone media queries use useFitGrid's phone size for width and height", () => {
  const phone = `(max-width: ${PHONE_SCREEN - 0.02}px), (max-height: ${PHONE_SCREEN - 0.02}px)`;
  const wrong: string[] = [];
  for (const file of cssFiles) {
    for (const [query] of readFileSync(file, "utf8").matchAll(/@media[^{]*\b(?:max-width|max-height): 599\.98px[^{]*/g)) {
      if (query.trim() !== `@media ${phone}`) wrong.push(`${file}: ${query.trim()}`);
    }
  }
  expect(wrong).toEqual([]);
});
