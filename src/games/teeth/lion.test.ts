import { expect, test } from "bun:test";
import { BOTH_SEEN_BEAT, COUNT_GAP, LION_BEATS, LION_MS, ROUNDS } from "./lion";

// Roaring like a lion is a phase of its own (X-26, user requests, November 2026): first the lion is seen, then the
// child beside it already in its lion costume, and three times 3, 2, 1 is counted down and both roar together, each
// roar louder and a little longer than the one before. Every moving thing is an HTML layer of its own, all its
// animations last the step, and its roars fall where the mouths are open.

const css = await Bun.file("src/games/teeth/teeth.css").text();
const lion = await Bun.file("src/games/teeth/lion.tsx").text();
const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();

/** The body of a `@keyframes` rule in teeth.css. */
const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
/** Each `.lion-…` rule with an animation: its class, keyframes and seconds. */
const animated = [...css.matchAll(/\.(lion-[\w-]+) \{[^}]*animation: ([\w-]+) ([\d.]+)s/g)].map(([, name, frames, s]) => ({ name, frames, s: Number(s) }));
/** The percent of the step a beat is. */
const percentOf = (beat: number) => `${Number(((beat * 100) / LION_BEATS).toFixed(4)).toString()}%`;

test("every part of it moves as long as the step and only as an HTML layer", () => {
  expect(animated.length).toBeGreaterThan(5);
  for (const { name, frames, s } of animated) {
    expect({ name, s }).toEqual({ name, s: Number((LION_MS / 1000).toFixed(3)) });
    expect(frames.startsWith("teeth-lion-")).toBe(true);
    // The camera and the countdown's numbers are HTML elements of their own; everything else is a `Piece`.
    if (name === "lion-camera" || name.startsWith("lion-count-")) continue;
    const tags = [...lion.matchAll(new RegExp(`<(\\w+)\\b[^<>]*?className="${name}"`, "g"))].map((m) => m[1]);
    expect({ name, tags: tags.length > 0 && tags.every((t) => t === "Piece") }).toEqual({ name, tags: true });
  }
  // The camera is the one whole layer moved, an HTML div round the picture.
  expect(lion).toContain('<div className="lion-camera"');
});

test("the lion is seen first, then the child beside it in its costume, which is on from the start", () => {
  // The camera starts close on the lion and has drawn back to both before the first 3.
  expect(lion).toContain("fitBox(room, FOCUS_LION)");
  expect(keyframes("teeth-lion-camera")).toContain(`${percentOf(BOTH_SEEN_BEAT)},\n  100% {\n    transform: translate(0, 0) scale(1);`);
  expect(BOTH_SEEN_BEAT).toBeLessThanOrEqual(ROUNDS[0].count);
  // The mane never grows in: it is part of the still picture.
  expect(css).not.toContain("teeth-lion-mane");
  expect(lion).toMatch(/<Piece area=\{MANE_AREA\} className="lion-still">/);
});

test("three rounds of 3, 2, 1 and a roar, each roar louder and a little longer", () => {
  expect(ROUNDS).toHaveLength(3);
  for (const [k, round] of ROUNDS.entries()) {
    expect(round.roar).toBe(round.count + 3 * COUNT_GAP);
    // Each number shows on its beat in every round.
    for (const [i, n] of [3, 2, 1].entries())
      expect({ n, k, shown: keyframes(`teeth-lion-count-${n}`).includes(`${percentOf(round.count + i * COUNT_GAP + 0.3)} {`) }).toEqual({ n, k, shown: true });
    // Both mouths are just wide open on the roar.
    for (const mouth of ["teeth-lion-kid-roar", "teeth-lion-jaw"])
      expect({ mouth, k, open: keyframes(mouth).includes(`${percentOf(round.roar)} {\n    transform: scale(1);`) }).toEqual({ mouth, k, open: true });
    if (k === 0) continue;
    const before = ROUNDS[k - 1];
    expect(round.gain).toBeGreaterThan(before.gain);
    expect(round.open).toBeGreaterThan(before.open);
    // A round begins only once the mouths of the one before have closed.
    expect(round.count).toBeGreaterThan(before.roar + before.open);
  }
  expect(ROUNDS[ROUNDS.length - 1].gain).toBe(1);
  // Every roar is a recording of its own.
  const names = ROUNDS.flatMap((r) => [r.lion, r.child]);
  expect(new Set(names).size).toBe(names.length);
  // The child's mouth stays open after the last roar to the end, as it comes back in the mirror; the lion's closes.
  const last = ROUNDS[ROUNDS.length - 1];
  expect(keyframes("teeth-lion-kid-roar")).toMatch(
    new RegExp(`${percentOf(last.roar + last.open).replace(".", "\\.")},\\s*100% \\{\\s*transform: scale\\(1\\);\\s*opacity: 1;`),
  );
  expect(keyframes("teeth-lion-jaw")).toMatch(/,\s*100% \{\s*transform: scale\(0\.4, 0\.2\);\s*opacity: 0;\s*\}\s*$/);
  expect(last.roar + last.open).toBeLessThan(LION_BEATS);
});

test("no words on the picture, and the step is a scene of its own in the camera's round", () => {
  expect(lion).not.toMatch(/<text\b/);
  expect(play).toMatch(/before === "lion"\s*\?\s*"lion"/);
  expect(play).toContain("<Lion ");
  // Its pause follows the game's.
  expect(css).toContain(".teeth-play.paused .lion-scene *");
});

test("the bar's phase names are classes of its tiles, so no rule styles one of them alone", () => {
  // The scene's root was `.lion` (position: absolute, inset: 0) and laid the bar's lion tile over the sweets' (November 2026).
  for (const phase of ["eat", "fetch", "lion", "tidy"])
    expect({ phase, bare: new RegExp(`(^|[\\s,>+~(])\\.${phase}(?![\\w-])`, "m").test(css) }).toEqual({ phase, bare: false });
});
