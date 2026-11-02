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

test("a game with something to pick on its start screen shows it after playing", () => {
  expect(menuAfterPlay({ startMode: "free", modes: [{ id: "free", emoji: "⌨️", title: "Frei tippen" }] }, "/")).toBeUndefined();
  expect(menuAfterPlay({ startMode: "free", level: "Wörter" }, "/")).toBeUndefined();
  expect(menuAfterPlay({}, "/")).toBeUndefined();
});
