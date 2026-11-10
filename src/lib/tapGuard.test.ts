import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { screenChanged, screenTap, TAP_GUARD_MS } from "./tapGuard";

test("a second tap right after the first does nothing, a later one acts", () => {
  screenChanged(-10_000);
  expect(screenTap(1000)).toBe(true);
  expect(screenTap(1000 + TAP_GUARD_MS / 3)).toBe(false);
  expect(screenTap(1000 + TAP_GUARD_MS + 1)).toBe(true);
});

test("a screen that changed by itself guards the next tap too", () => {
  screenChanged(5000);
  expect(screenTap(5000 + 100)).toBe(false);
  expect(screenTap(5000 + TAP_GUARD_MS)).toBe(true);
});

// The games that go on screen by screen with a tap share the one guard (user feedback, November 2026: a double tap
// picked a card on the screen the first tap had just brought).
test("screen-by-screen games guard their taps", () => {
  const read = (f: string) => readFileSync(f, "utf8");
  for (const f of [
    "src/games/feelings/shared.tsx",
    "src/games/feelings/RoundPlay.tsx",
    "src/games/milkchain/MilkChainPlay.tsx",
    "src/games/potty/PottyPlay.tsx",
  ])
    expect(read(f), f).toContain("@/lib/tapGuard");
  for (const f of ["src/games/milkchain/MilkChainPlay.tsx", "src/games/potty/PottyPlay.tsx"]) expect(read(f), f).not.toMatch(/const TAP_GUARD_MS = /);
});
