import { expect, test } from "bun:test";

// The end buttons once showed 🔁, the next level's emoji and ▶ as text, which the user found ugly (November 2026), then
// words – which children don't read (user request, 22 November 2026, first for Kettenreaktion, then every game): „Nochmal“
// is the drawn round arrow, „Weiter“ the next level's picture where the game has one (its menu card's cut), else the
// drawn ▶; only „Menü“ keeps its word beside the shelf label.
test("the end of a level shows the drawn arrow and the next level's picture, never a word or an emoji", async () => {
  const source = await Bun.file("src/components/GameEnd.tsx").text();
  expect(source).not.toMatch(/\p{Extended_Pictographic}|[▶►→]/u);
  // The one picture there is the ribbon's shelf label on „Menü“, the way back drawn as in the corner (ShelfLabelArt).
  expect(source).not.toMatch(/<svg|<MenuIcon|\bemoji[:?}]/);
  expect(source).toContain('<ControlIcon kind="again" className="game-end-again-arrow" />');
  expect(source).not.toMatch(/: t\(AGAIN\)\}/);
  expect(source).toMatch(/<img className="game-end-next-picture" src=\{next\.picture\}/);
  expect(source).toContain('<ControlIcon kind="play" className="game-end-next-arrow" />');
});

// A game whose levels have menu pictures (`vorschau/`) hands the next one's to „Weiter“.
test("every game with pictures of its levels shows the next one at the end", async () => {
  const handing = [
    "src/games/marbles/MarblePlay.tsx",
    "src/games/scenes/ScenePlay.tsx",
    "src/games/elevator/cards.tsx",
    "src/games/feelings/FeelingsPlay.tsx",
    "src/games/adventure/AdventureGame.tsx",
    // The next pass's first feeling, the painted picture it starts with.
    "src/games/cause/CausePlay.tsx",
  ];
  for (const file of handing) expect(`${file}: ${/picture: /.test(await Bun.file(file).text())}`).toBe(`${file}: true`);
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
  // The corner while playing lives in gameExit.tsx, which GameShell hands `ended` and `toShelf`.
  expect(shell).toMatch(/<GameExit\b[^>]*\bended=\{ended\}[^>]*\btoShelf=\{toShelf\}/);
  const exit = await Bun.file("src/components/gameExit.tsx").text();
  expect(exit).toMatch(/ended && [^?]*\?\s*\(?[\s\S]{0,400}<TapExit[\s\S]{0,60}sign=\{toShelf \? "shelf" : "close"\}/);
  expect(exit).toMatch(/<PageCornerArt sign=\{sign\} \/>/);
  const withMenu: string[] = [];
  for (const file of new Bun.Glob("src/**/*.tsx").scanSync()) {
    if (/<GameEnd\b[^>]*\bmenu\b/.test(await Bun.file(file).text())) withMenu.push(file);
  }
  expect(withMenu.sort()).toEqual(["src/games/potty/PottyPlay.tsx", "src/games/teeth/TeethPlay.tsx"]);
});

// Small beside the buttons (bottom right in Aufs Töpfchen) the trophy was hardly seen (user feedback, November 2026): it
// is handed over in the middle with „Geschafft!“ under it, then shrinks onto its board beside the buttons, and the
// buttons come only once it has landed – as one transform from where it stands, which a phone moves cheaply. Then it
// was too loud, at two thirds of the screen for over three seconds (user feedback, November 2026): in the middle it is
// at most about two fifths of the screen's height, and the handover is short.
test("the trophy is handed over calmly in the middle, then lands on its board before the buttons come", async () => {
  const end = await Bun.file("src/components/GameEnd.tsx").text();
  expect(Number(end.match(/const AWARD_HEIGHT = ([\d.]+);/)?.[1])).toBeLessThanOrEqual(0.42);
  expect(Number(end.match(/const AWARD_MS = (\d+);/)?.[1])).toBeLessThanOrEqual(2600);
  expect(end).toMatch(/de: "Geschafft!"/);
  expect(end).toMatch(/className="game-end-board"/);
  expect(end).toMatch(/if \(!landed \|\| !asks\) return;/);
  const css = await Bun.file("src/styles/game-end.css").text();
  const award = css.match(/@keyframes game-end-trophy-award \{([\s\S]*?)\n\}/)?.[1] ?? "";
  expect(award).toMatch(/translate\(var\(--award-x\), var\(--award-y\)\) scale\(var\(--award-s\)\)/);
  expect(award).not.toMatch(/\b(width|height|top|left|filter):/);
  expect(css).toMatch(/\.game-end:not\(\.landed\) > :not\(\.game-end-prize\) \{\s*visibility: hidden;/);
});

// „Nochmal“, „Weiter“ and the trophy acted only as a pointer landed, so Enter, Space and a screen reader's activation
// did nothing: each also takes the click no pointer made (`noPointerClick`), „Nochmal“ and „Weiter“ one step per press.
test("the end's buttons and its trophy answer without a pointer too", async () => {
  const end = await Bun.file("src/components/GameEnd.tsx").text();
  expect(end).toMatch(/onClick: noPointerClick\(\(\) => \{\s*if \(screenTap\(\)\) go\(\);/);
  expect(end).toContain('{...press("nochmal", onAgain)}');
  expect(end).toContain('{...press("weiter", next.onNext)}');
  const trophy = end.match(/className=\{`game-end-trophy[\s\S]*?\n {10}>/)?.[0] ?? "";
  // Only once it stands on its board: before that it is no link and takes no focus.
  expect(trophy).toContain("{...(landed && {");
  expect(trophy).toContain("tabIndex: 0,");
  expect(trophy).toContain('e.key === "Enter"');
  expect(trophy).toContain("onClick: noPointerClick(openTrophy),");
  // Still a span, so no rule for buttons restyles it.
  expect(end).toMatch(/<span\s+ref=\{trophyRef\}/);
});

// It wasn't clear the landed trophy can be tapped, it was small and its count hard to read (user feedback, November
// 2026): the shared ring and hand point at it (stopped at their first stage, never darkening „Weiter“), and its count
// stands on a light plate big enough to read. Then the trophy at nearly half the screen with a golden glow was too loud
// (user feedback, November 2026): it is a quarter of the screen's height and the hint its quiet form – a thin ring and
// a small hand, no glow and no waves – still showing it can be tapped.
test("the landed trophy is quiet but plainly tappable, and its count is easy to read", async () => {
  const end = await Bun.file("src/components/GameEnd.tsx").text();
  expect(end).toMatch(/\{landed && trophySize && [^}]*<TrophyHint \{\.\.\.trophySize\} \/>\}/);
  expect(end).toMatch(/<TapHint\b[^>]*\bupTo=\{1\}[^>]*\bquiet\b/);
  const css = await Bun.file("src/styles/game-end.css").text();
  const height = Number(css.match(/\.game-end \{[^}]*--trophy-h: clamp\((\d+)px, (\d+)vh/)?.[2]);
  expect(height).toBeGreaterThanOrEqual(20);
  expect(height).toBeLessThanOrEqual(30);
  const hint = await Bun.file("src/components/TapHint.tsx").text();
  expect(hint).toContain('{!quiet && <div className="tap-hint-glow" />}');
  const trophy = await Bun.file("src/components/Trophy.tsx").text();
  const plate = trophy.match(/function Plate[\s\S]*?\n\}/)?.[0] ?? "";
  expect(Number(plate.match(/fontSize="([\d.]+)"/)?.[1])).toBeGreaterThanOrEqual(14);
  expect(plate).toMatch(/fill="#fff/);
});
