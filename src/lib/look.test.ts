import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";
import { forgetOldLook, TURN_SECONDS } from "./look";

const css = readFileSync("src/styles/book.css", "utf8");

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
  const look = readFileSync("src/lib/look.ts", "utf8");
  expect(look).not.toMatch(/getItem|setItem|location\.search|"buch"/);
  const sources = readdirSync("src", { recursive: true, encoding: "utf8" }).filter((f) => /\.(tsx?|css)$/.test(f) && !f.endsWith(".test.ts"));
  const telling = sources.filter((f) => /data-look|dataset\.look|isBookLook|buch=aus/.test(readFileSync(join("src", f), "utf8")));
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
  expect(rule(".settings .choice button.selected::after")).toContain("animation: book-highlight");
  expect(rule(".settings .choice button.selected")).toContain("background-color: var(--paper)");
});

// The small grey gear on ⚙️'s note wasn't seen while playing, nor known for the options without words (user feedback,
// November 2026): its note is much bigger than the fullscreen one beside it, carries its name in words always shown,
// and it lights up softly a few times as play starts, then stands still.
test("⚙️ while playing is a big note with its name that lights up only as play starts", () => {
  const slip = rule(".play-area .play-options-corner .play-options-button");
  const width = (decls: string) => Number(decls.match(/width:\s*(\d+)px/)?.[1]);
  expect(width(slip)).toBeGreaterThan(2 * width(rule(".play-area .play-fullscreen, .play-options-button)")));
  const playing = readFileSync("src/styles/playing.css", "utf8");
  const playingRule = (selector: string) => playing.match(new RegExp(`\\n${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  expect(Number(playingRule(".play-options-gear").match(/font-size:\s*([\d.]+)rem/)?.[1])).toBeGreaterThanOrEqual(2.4);
  expect(Number(playingRule(".play-options-label b").match(/font-size:\s*([\d.]+)rem/)?.[1])).toBeGreaterThanOrEqual(1.3);
  // The name is always there, not only while held or under a mouse.
  expect(playingRule(".play-options-label")).not.toMatch(/opacity:\s*0|display:\s*none/);
  expect(readFileSync("src/components/PlayOptions.tsx", "utf8")).toContain('className="play-options-label"');
  const glow = playing.match(/\.play-options-corner \{[^}]*animation:\s*([^;]+);/)?.[1] ?? "";
  expect(glow).toContain("play-options-glow");
  // A number of times, never `infinite`: after it, nothing idles.
  expect(glow).toMatch(/\s[1-3]$/);
});
