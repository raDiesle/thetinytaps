import { expect, test } from "bun:test";

// The end buttons once showed 🔁, the next level's emoji and ▶, which the user found ugly (November 2026): „Menü“,
// „Nochmal“ and „Weiter“ are words only, told apart by size and colour.
test("the end of a level shows words only, no emoji or symbols", async () => {
  const source = await Bun.file("src/components/GameEnd.tsx").text();
  const component = source.slice(source.indexOf("export function GameEnd"), source.indexOf("export function MenuIcon"));
  expect(component).not.toMatch(/\p{Extended_Pictographic}|[▶►→]/u);
  expect(component).not.toMatch(/<MenuIcon|emoji/);
});
