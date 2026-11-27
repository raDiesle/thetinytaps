import { expect, test } from "bun:test";
import { BOTH_ROAR_BEAT, KID_ROAR_BEAT, LION_MS } from "./lion";

// Roaring like a lion is a step of its own (X-26, user request, November 2026): the child's face roars with its mouth
// wide open, gets a lion's mane as a costume, a lion walks in beside it and both roar at the same time. Every moving
// thing is an HTML `Piece` of its own, all its animations last the step, and its roars fall where the mouths are open.

const css = await Bun.file("src/games/teeth/teeth.css").text();
const lion = await Bun.file("src/games/teeth/lion.tsx").text();
const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();

/** The body of a `@keyframes` rule in teeth.css. */
const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
/** Each `.lion-…` rule with an animation: its class, keyframes and seconds. */
const animated = [...css.matchAll(/\.(lion-[\w-]+) \{[^}]*animation: ([\w-]+) ([\d.]+)s/g)].map(([, name, frames, s]) => ({ name, frames, s: Number(s) }));
/** The percent of the step a beat is. */
const percentOf = (beat: number) => `${(beat * 6.25).toString()}%`;

test("every part of it moves as long as the step and only as an HTML layer", () => {
  expect(animated.length).toBeGreaterThan(5);
  for (const { name, frames, s } of animated) {
    expect({ name, s }).toEqual({ name, s: Number((LION_MS / 1000).toFixed(3)) });
    expect(frames.startsWith("teeth-lion-")).toBe(true);
    if (name === "lion-camera") continue;
    const tags = [...lion.matchAll(new RegExp(`<(\\w+)\\b[^<>]*?className="${name}"`, "g"))].map((m) => m[1]);
    expect({ name, tags: tags.length > 0 && tags.every((t) => t === "Piece") }).toEqual({ name, tags: true });
  }
  // The camera is the one whole layer moved, an HTML div round the picture.
  expect(lion).toContain('<div className="lion-camera"');
});

test("the child roars when its mouth is wide open, and both roar when the lion's is", () => {
  expect(keyframes("teeth-lion-kid-roar")).toContain(`${percentOf(KID_ROAR_BEAT)} {\n    transform: scale(1);`);
  expect(keyframes("teeth-lion-jaw")).toContain(`${percentOf(BOTH_ROAR_BEAT)} {\n    transform: scale(1);`);
  // The child's mouth is still open when the lion roars, and stays open to the end, as it comes back in the mirror.
  expect(keyframes("teeth-lion-kid-roar")).toMatch(/81\.25%,\s*100% \{\s*transform: scale\(1\);\s*opacity: 1;/);
  // The lion has walked in before it roars.
  expect(keyframes("teeth-lion-walk")).toMatch(/62\.5%,\s*68\.75% \{\s*transform: translate\(0, 0\)/);
});

test("the costume's mane is on before the lion comes", () => {
  const maneOn = Number(keyframes("teeth-lion-mane").match(/([\d.]+)%,\s*100% \{/)?.[1]);
  const lionIn = Number(keyframes("teeth-lion-walk").match(/0%,\s*([\d.]+)% \{/)?.[1]);
  expect(maneOn).toBeLessThanOrEqual(lionIn);
});

test("no words on the picture, and the step is a scene of its own in the camera's round", () => {
  expect(lion).not.toMatch(/<text\b/);
  expect(play).toMatch(/before === "lion"\s*\?\s*"lion"/);
  expect(play).toContain("<Lion ");
  // Its pause follows the game's.
  expect(css).toContain(".teeth-play.paused .lion *");
});
