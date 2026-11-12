import { expect, test } from "bun:test";

// The end buttons once showed 🔁, the next level's emoji and ▶, which the user found ugly (November 2026): „Menü“,
// „Nochmal“ and „Weiter“ are words only, told apart by size and colour.
test("the end of a level shows words only, no emoji or symbols", async () => {
  const source = await Bun.file("src/components/GameEnd.tsx").text();
  expect(source).not.toMatch(/\p{Extended_Pictographic}|[▶►→]/u);
  // The one picture there is the ribbon's shelf label on „Menü“, the way back drawn as in the corner (ShelfLabelArt).
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
// Only Zähne putzen and Aufs Töpfchen, played once and done, show „Menü“ instead of „Nochmal“ (user request, November
// 2026), drawn with the ribbon's shelf label so it looks like the way back in the corner.
test("the end of a level has no way back of its own: the corner is it, but in Zähne putzen and Aufs Töpfchen", async () => {
  const end = await Bun.file("src/components/GameEnd.tsx").text();
  expect(end).toMatch(/useEndShown\(\)/);
  expect(end).toMatch(/\{menu \? \(/);
  expect(end).toMatch(/\{toShelf && <ShelfLabelArt \/>\}/);
  const shell = await Bun.file("src/components/GameShell.tsx").text();
  expect(shell).toMatch(/<EndShown value=\{setEnded\}>/);
  expect(shell).toMatch(/<LeavesToShelf value=\{toShelf\}>/);
  expect(shell).toMatch(/ended && [^?]*\?\s*\(?[\s\S]{0,400}<TapExit[\s\S]{0,60}sign=\{toShelf \? "shelf" : "close"\}/);
  expect(shell).toMatch(/<PageCornerArt sign=\{sign\} \/>/);
  const withMenu: string[] = [];
  for (const file of new Bun.Glob("src/**/*.tsx").scanSync()) {
    if (/<GameEnd\b[^>]*\bmenu\b/.test(await Bun.file(file).text())) withMenu.push(file);
  }
  expect(withMenu.sort()).toEqual(["src/games/potty/PottyPlay.tsx", "src/games/teeth/TeethPlay.tsx"]);
});

// Small beside the buttons (bottom right in Aufs Töpfchen) the trophy was hardly seen (user feedback, November 2026): it
// is handed over big in the middle with „Geschafft!“ under it, then shrinks onto its board beside the buttons, and the
// buttons come only once it has landed – as one transform from where it stands, which a phone moves cheaply.
test("the trophy is handed over big in the middle, then lands on its board before the buttons come", async () => {
  const end = await Bun.file("src/components/GameEnd.tsx").text();
  expect(end).toMatch(/de: "Geschafft!"/);
  expect(end).toMatch(/className="game-end-board"/);
  expect(end).toMatch(/if \(!landed \|\| !asks\) return;/);
  const css = await Bun.file("src/styles/game-end.css").text();
  const award = css.match(/@keyframes game-end-trophy-award \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(award).toMatch(/translate\(var\(--award-x\), var\(--award-y\)\) scale\(var\(--award-s\)\)/);
  expect(award).not.toMatch(/\b(width|height|top|left|filter):/);
  expect(css).toMatch(/\.game-end:not\(\.landed\) > :not\(\.game-end-prize\) \{\s*visibility: hidden;/);
});
