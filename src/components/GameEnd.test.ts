import { expect, test } from "bun:test";

// The end buttons once showed 🔁, the next level's emoji and ▶, which the user found ugly (November 2026): „Menü“,
// „Nochmal“ and „Weiter“ are words only, told apart by size and colour.
test("the end of a level shows words only, no emoji or symbols", async () => {
  const source = await Bun.file("src/components/GameEnd.tsx").text();
  expect(source).not.toMatch(/\p{Extended_Pictographic}|[▶►→]/u);
  expect(source).not.toMatch(/<svg|<MenuIcon|\bemoji[:?}]/);
});

// Zähne putzen and Gefühle had end buttons of their own (🔁, round symbols without words): every end is `GameEnd`, and
// a game that places the buttons itself passes `inline`.
test("no game draws its own „Menü“ or „Nochmal“ button", async () => {
  const own: string[] = [];
  for (const file of new Bun.Glob("src/games/**/*.tsx").scanSync()) {
    if (/de: "(Menü|Nochmal)"/.test(await Bun.file(file).text())) own.push(file);
  }
  expect(own).toEqual([]);
});

// A „Menü“ button at the end was one way back too many (user feedback, November 2026): the way back is the page's
// corner in the top left, as in every menu – the ✕, or the book's ribbon where the game goes back onto the shelf.
test("the end of a level has no way back of its own: the corner is it", async () => {
  const end = await Bun.file("src/components/GameEnd.tsx").text();
  expect(end).not.toMatch(/de: "Menü"|useLeaveGame|className="game-end-button menu"/);
  expect(end).toMatch(/useEndShown\(\)/);
  const shell = await Bun.file("src/components/GameShell.tsx").text();
  expect(shell).toMatch(/<EndShown value=\{setEnded\}>/);
  expect(shell).toMatch(/ended && [^?]*\?\s*\(?[\s\S]{0,400}<TapExit[\s\S]{0,60}shelf=\{toShelf\}/);
  expect(shell).toMatch(/sign="shelf"/);
});
