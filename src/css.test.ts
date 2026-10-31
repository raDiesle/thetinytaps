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

// In the book look the way out of a game is the page's corner in the top left (book.css): a game's own buttons and signs
// put in the top left corner of the screen lay under it (Schatten finden's picture choice, user feedback, October 2026).
// They keep below it with `--corner-clear`, which is 0 in the toy look. Aufs Töpfchen's thought bubble is round and has
// nothing to tap, so its empty corner may lie under it.
const UNDER_THE_CORNER = new Set([".pt-think"]);

test("a game's controls in the top left corner keep clear of the book look's way out", () => {
  const under: string[] = [];
  for (const file of cssFiles.filter((f) => f.startsWith(join("src", "games")))) {
    const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const [rule, selector] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g).map((m) => [m[2], m[1].trim()])) {
      if (
        /(^|;)\s*top:[^;]*safe-area-inset-top/.test(rule) &&
        /(^|;)\s*left:[^;]*safe-area-inset-left/.test(rule) &&
        !rule.includes("--corner-clear") &&
        !UNDER_THE_CORNER.has(selector)
      )
        under.push(`${file}: ${selector}`);
    }
  }
  expect(under).toEqual([]);
});

// „Zurück zum Menü · halten“ shows the moment ✕ is held, not fading in while the grown-up wonders (user feedback, October 2026).
test("the note on leaving shows at once when ✕ is held", () => {
  const css = readFileSync("src/styles/playing.css", "utf8");
  expect(css).toMatch(/\.exit-corner\.hinted \.exit-hint \{[^}]*transition: none/);
});
