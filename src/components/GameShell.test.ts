import { expect, test } from "bun:test";
import { menuAfterPlay } from "./GameShell";

// Schatten finden plays at once and has nothing to choose: ✕ once led to a start screen with only „Los geht’s!“
// instead of back to the book's table of contents.
test("a game that plays at once with nothing to pick leaves to the page before it", () => {
  expect(menuAfterPlay({ startMode: "play" }, "/spiele/zuordnen/")).toBe("/spiele/zuordnen/");
  expect(menuAfterPlay({ startMode: "story" }, "/")).toBe("/");
  expect(menuAfterPlay({ startMode: "scene", leaveTo: "/bilder/" }, "/")).toBe("/bilder/");
});

// Buchstaben & Zahlen plays at once and showed its start screen with two cards after ✕ – a menu the child had never
// seen, whose choice was already made while playing (user feedback, November 2026): back is the menu before the game.
test("a game that plays at once leaves to the page before it, even with modes it could show", () => {
  expect(menuAfterPlay({ startMode: "free" }, "/")).toBe("/");
});

test("a game started from its own start screen shows it again", () => {
  expect(menuAfterPlay({}, "/")).toBeUndefined();
});
