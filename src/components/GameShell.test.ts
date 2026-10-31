import { expect, test } from "bun:test";
import { menuAfterPlay } from "./GameShell";

// Schatten finden plays at once and has nothing to choose: ✕ once led to a start screen with only „Los geht’s!“
// instead of back to the book's table of contents.
test("a game that plays at once with nothing to pick leaves to the page before it", () => {
  expect(menuAfterPlay({ startMode: "play" }, "/spiele/zuordnen/")).toBe("/spiele/zuordnen/");
  expect(menuAfterPlay({ startMode: "story" }, "/")).toBe("/");
  expect(menuAfterPlay({ startMode: "scene", leaveTo: "/bilder/" }, "/")).toBe("/bilder/");
});

test("a game with something to pick on its start screen shows it after playing", () => {
  expect(menuAfterPlay({ startMode: "free", modes: [{ id: "free", emoji: "⌨️", title: "Frei tippen" }] }, "/")).toBeUndefined();
  expect(menuAfterPlay({ startMode: "free", level: "Wörter" }, "/")).toBeUndefined();
  expect(menuAfterPlay({}, "/")).toBeUndefined();
});
