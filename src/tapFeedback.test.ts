import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";
import { CELEBRATION } from "@/components/TapFeedback";

// A celebration for a toddler is a few things rising slowly while everyone in the picture cheers, never a storm of
// confetti or shapes (user feedback, November 2026).
test("a celebration is a few things rising slowly", () => {
  expect(CELEBRATION.count).toBeLessThanOrEqual(8);
  expect(CELEBRATION.countAt).toBeLessThanOrEqual(4);
  expect(CELEBRATION.riseMs).toBeGreaterThanOrEqual(3500);
});

// Each effect is a small HTML layer of its own; moving anything but transform and opacity would repaint it per frame.
test("tap feedback moves only by transform and opacity", () => {
  const css = readFileSync("src/styles/playing.css", "utf8");
  for (const [, name, body] of css.matchAll(/@keyframes (fx-[\w-]+) \{([\s\S]*?)\n\}/g)) {
    const properties = [...body.matchAll(/^\s+([\w-]+):/gm)].map(([, p]) => p);
    expect({ name, others: properties.filter((p) => p !== "transform" && p !== "opacity") }).toEqual({ name, others: [] });
  }
});

// Taps that set nothing off, taps that set something off and success each have their own feedback in
// `TapFeedback.tsx`; random shapes popping up (the old `Bursts`) fitted none of them.
test("no game brings back random shapes as tap feedback", () => {
  const files = readdirSync("src", { recursive: true, encoding: "utf8" }).filter((f) => f.endsWith(".tsx"));
  const offenders = files.filter((f) => /components\/Bursts|useBursts|BurstLayer/.test(readFileSync(join("src", f), "utf8")));
  expect(offenders).toEqual([]);
});
