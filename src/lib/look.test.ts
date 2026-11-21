import { join } from "node:path";
import { expect, test } from "bun:test";
import { isTest, read, sourceFiles } from "@/testSources";
import { forgetOldLook, TURN_SECONDS } from "./look";

const css = read("src/styles/book.css");

/** The number of seconds a `name: <n>s` (or a `const NAME = <n>`) in `text` gives. */
const seconds = (text: string, pattern: RegExp) => Number(text.match(pattern)?.[1]);

// There is only the picture book (user decision, November 2026): the toy-block look and its `?buch=aus` are gone, and no
// second look comes back. A visit that once chose the toy look had it stored, and Claude's preview showed the old card
// menu from it: what was stored is removed, never read, and nothing in the app tells looks apart any more.
test("there is only the book look, whatever an old visit stored", () => {
  const values = new Map([["tinytaps.look.v1", "toy"]]);
  const real = globalThis.localStorage;
  globalThis.localStorage = { removeItem: (key: string) => values.delete(key) } as unknown as Storage;
  try {
    forgetOldLook();
  } finally {
    globalThis.localStorage = real;
  }
  expect(values.size).toBe(0);
  const look = read("src/lib/look.ts");
  expect(look).not.toMatch(/getItem|setItem|location\.search|"buch"/);
  const sources = sourceFiles().filter((f) => /\.(tsx?|css)$/.test(f) && !isTest(f));
  const telling = sources.filter((f) => /data-look|dataset\.look|isBookLook|buch=aus/.test(read(join("src", f))));
  expect(telling).toEqual([]);
});

// The sound of a page lands when the page does: the turn on screen and its sound take the same time.
test("a page turns as long as its sound says", () => {
  expect(seconds(css, /--turn-time:\s*([\d.]+)s/)).toBe(TURN_SECONDS);
});

// A quick flick didn't look like a book's page, and 1.2 s was still too quick (user feedback, October 2026): a page
// takes its time to turn, as a grown-up turns it for a child.
test("a page turns slowly enough to be seen", () => {
  expect(TURN_SECONDS).toBeGreaterThanOrEqual(1.5);
});

// The page seen is always the book's left page (user feedback, October 2026): its spine on the right, so every page
// turns on the right edge – forward the next one comes over from the right, back this one turns over to the right.
test("the page seen is the left page, turning on the spine at its right", () => {
  const turning = [...css.matchAll(/\[data-turn="(forward|back)"\]::view-transition-(old|new)\((?:root|turn-page)\) \{([^}]*)\}/g)].filter((m) =>
    m[3].includes("book-turn-away"),
  );
  expect(turning.map((m) => m[1]).sort()).toEqual(["back", "forward"]);
  for (const m of turning) expect(m[3]).toContain("transform-origin: right center");
  // The outer edge has the wider margin, where the board and the pages under it show; the spine's side the narrow one.
  expect(Number(css.match(/--page-left:\s*(\d+)px/)?.[1])).toBeGreaterThan(Number(css.match(/--page-right:\s*(\d+)px/)?.[1]));
});

/** The declarations of the first rule in book.css whose selector ends with `selector`. */
const rule = (selector: string) => css.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

// What is on in the grown-ups' options (⚙️ open, the chosen choice in its panel) is marked by a highlighter drawn across
// it, not by yellow paper taped down like the level row's chosen slip (user feedback, October 2026).
test("what is on in the options is marked with a highlighter, not yellow paper", () => {
  expect(rule(".play-options-button.holding)::after")).toContain("animation: book-highlight");
  expect(css).toMatch(/\.menu-head \.panel-icon\[aria-expanded="true"\][^{]*::after\s*\{[^}]*animation: book-highlight/);
  expect(rule(".settings .choice button.selected")).toContain("background-color: var(--paper)");
});

// The stroke covers all of a choice's words, on every line they wrap onto (user feedback, November 2026: a stroke
// across the button's middle left words unmarked): it lies on the words' own span, cloned onto each line, and every
// choice in the grown-ups' options puts its words into that span.
test("the highlighter covers all the words of a chosen choice", () => {
  const words = rule(".settings .choice button.selected .choice-label");
  expect(words).toContain("animation: book-highlight-words");
  expect(words).toContain("box-decoration-break: clone");
  expect(css).not.toMatch(/\.choice button\.selected::after/);
  const sources = sourceFiles()
    .filter((file) => /\.tsx$/.test(file) && !file.includes(".test."))
    .map((file) => [file, read(join("src", file))] as const)
    .filter(([, code]) => /className="choice\b/.test(code));
  expect(sources.length).toBeGreaterThan(2);
  for (const [file, code] of sources) {
    // The buttons inside each choice row: from its opening tag to its closing one (rows hold no nested rows).
    const rows = code
      .split(/className="choice\b/)
      .slice(1)
      .map((rest) => rest.split(/<\/(?:fieldset|div)>/)[0]);
    const buttons = rows.flatMap((row) => row.match(/<button[\s\S]*?<\/button>/g) ?? []);
    expect({ file, unmarked: buttons.filter((button) => !button.includes("choice-label")) }).toEqual({ file, unmarked: [] });
  }
});

// ⚙️ while playing is the same note as the fullscreen one beside it, as big, its gear drawn in the same pencil line
// (user feedback, November 2026: a bigger note with the ⚙️ emoji looked like another thing), and it lights up softly a
// few times as play starts, then stands still – that is how grown-ups find it.
test("⚙️ while playing is a note just like the fullscreen one and lights up only as play starts", () => {
  // No rule makes its slip bigger than the shared one of the fullscreen note.
  expect(css).not.toMatch(/\.play-options-corner \.play-options-button\s*\{[^}]*(width|height):/);
  const playing = read("src/styles/playing.css");
  expect(playing).not.toMatch(/\.play-options-button[^{]*\{[^}]*(width|height|padding):/);
  // A drawn gear, never the emoji, and no words on the slip: its name and „halten“ are read out.
  const code = read("src/components/PlayOptions.tsx");
  expect(code).toContain('className="play-options-icon"');
  expect(code).not.toMatch(/>\s*⚙️\s*</);
  expect(code).not.toContain("play-options-label");
  const glow = playing.match(/\.play-options-corner \{[^}]*animation:\s*([^;]+);/)?.[1] ?? "";
  expect(glow).toContain("play-options-glow");
  // A number of times, never `infinite`: after it, nothing idles.
  expect(glow).toMatch(/\s[1-3]$/);
});
