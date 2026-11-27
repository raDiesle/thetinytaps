import { expect, test } from "bun:test";
import { TUBE_REST } from "./prep";

// At the sink nothing floats and the glass never lies over the brush held outside it (user feedback, November 2026).

const css = await Bun.file("src/games/teeth/teeth.css").text();
const prep = await Bun.file("src/games/teeth/prep.tsx").text();

/** The body of a `@keyframes` rule in teeth.css. */
const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
/** The transform a keyframe rule sets at `percent` (its selector may list several). */
const transformAt = (name: string, percent: string) =>
  keyframes(name).match(new RegExp(`(?:^|\\n)\\s*(?:[\\d.]+%,\\s*)*${percent.replace(".", "\\.")}(?:,\\s*[\\d.]+%)*\\s*\\{\\s*transform: ([^;]+);`))?.[1];

test("the tube rests standing on its cap, at the start and after the toothpaste", () => {
  const rest = `translate(${TUBE_REST.x}px, ${TUBE_REST.y}px) rotate(0deg)`;
  expect(css).toMatch(new RegExp(`\\.prep-tube \\{\\s*transform: ${rest.replace(/[()]/g, "\\$&")};`));
  expect(transformAt("tube-over", "0%")).toBe(rest);
  expect(transformAt("tube-over", "100%")).toBe(rest);
  // Its shadow lies under it on the counter.
  expect(prep).toMatch(/<ellipse cx=\{TUBE_REST\.x\}/);
});

test("the brush is drawn twice, behind the glass while in its cup and in front of it once lifted out", () => {
  expect(prep).toContain('<BrushDrawing part={part} side="back" />');
  expect(prep).toContain('<BrushDrawing part={part} side="front" />');
  // Taken out: the layers swap the moment the brush is lifted above the rim.
  const lifted = transformAt("grab-brush", "62%");
  expect(lifted).toBe("translate(340px, 20px) rotate(90deg) scale(0.9)");
  expect(keyframes("teeth-prep-brush-out-back")).toMatch(/62% \{\s*opacity: 1;[\s\S]*62\.1%,\s*100% \{\s*opacity: 0;/);
  expect(keyframes("teeth-prep-brush-out-front")).toMatch(/62% \{\s*opacity: 0;[\s\S]*62\.1%,\s*100% \{\s*opacity: 1;/);
  // Put back: they swap once it hangs over the cup again, at the same place.
  expect(transformAt("tidy-brush", "62.5%")).toBe(lifted);
  expect(keyframes("teeth-prep-brush-in-back")).toMatch(/62\.5% \{\s*opacity: 0;[\s\S]*62\.6%,\s*100% \{\s*opacity: 1;/);
  expect(keyframes("teeth-prep-brush-in-front")).toMatch(/62\.5% \{\s*opacity: 1;[\s\S]*62\.6%,\s*100% \{\s*opacity: 0;/);
  // While the toothpaste goes on, only the front one shows.
  expect(css).toMatch(/\.prep\.at-paste \.prep-brush-back \{\s*opacity: 0;/);
  expect(css).toMatch(/\.prep\.at-paste \.prep-brush-front \{\s*opacity: 1;/);
});
