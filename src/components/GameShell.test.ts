import { expect, test } from "bun:test";
import { menuAfterPlay } from "./GameShell";

// Schatten finden plays at once and has nothing to choose: ✕ once led to a start screen with only „Los geht’s!“
// instead of back to the book's table of contents.
test("a game that plays at once with nothing to pick leaves to the page before it", () => {
  expect(menuAfterPlay({ startMode: "play" }, "/spiele/zuordnen/")).toBe("/spiele/zuordnen/");
  expect(menuAfterPlay({ startMode: "story" }, "/")).toBe("/");
  expect(menuAfterPlay({ startMode: "scene", leaveTo: "/bilder/" }, "/")).toBe("/bilder/");
});

// Zähne putzen had a start screen with only „Los geht’s!“ (and ⚙️): a tap that does nothing for the child. A game
// with nothing to pick plays at once and keeps its options behind ⚙️ while playing (`PlayOptions`).
test("every game without cards or a level row to pick from plays at once", async () => {
  const shells = [...new Bun.Glob("src/games/*/*.tsx").scanSync()].filter((file) => !file.endsWith(".test.tsx"));
  const lonely: string[] = [];
  for (const file of shells) {
    const source = await Bun.file(file).text();
    const shell = source.match(/<GameShell[\s\S]*?\n {4}>/)?.[0];
    if (shell && !/\bmodes=|\blevel=/.test(shell) && !/\bstartMode=/.test(shell)) lonely.push(file);
  }
  expect(shells.length).toBeGreaterThan(5);
  expect(lonely).toEqual([]);
});

// Buchstaben & Zahlen plays at once and showed its start screen with two cards after ✕ – a menu the child had never
// seen, whose choice was already made while playing (user feedback, November 2026): back is the menu before the game.
test("a game that plays at once leaves to the page before it, even with modes it could show", () => {
  expect(menuAfterPlay({ startMode: "free" }, "/")).toBe("/");
});

test("a game started from its own start screen shows it again", () => {
  expect(menuAfterPlay({}, "/")).toBeUndefined();
});

// Gefühle put the group played last in front of the others, so the cards changed places from one visit to the next
// (user feedback, November 2026): a menu's order never changes, „zuletzt“ only marks the card where it stands.
test("no start screen moves the mode played last to the front", async () => {
  const files = [...new Bun.Glob("src/games/**/*.tsx").scanSync()].filter((file) => !file.endsWith(".test.tsx"));
  const moved: string[] = [];
  for (const file of files) {
    const source = await Bun.file(file).text();
    for (const [, last] of source.matchAll(/<GameShell[\s\S]*?\bmode=\{(\w+)/g)) {
      if (new RegExp(`\\[\\s*${last}\\b[^\\]]*,\\s*\\.\\.\\.`).test(source) || new RegExp(`\\bunshift\\(\\s*${last}\\b`).test(source)) moved.push(file);
    }
  }
  expect(moved).toEqual([]);
});
