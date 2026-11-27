import { expect, test } from "bun:test";
import { BOTH_SEEN_BEAT, FILL_BEATS, LION_BEATS, LION_INTRO_BEATS, LION_MS, MARKS, ROUNDS } from "./lion";

// The lion (X-26, user requests, November 2026): first the lion is seen, then the child beside it already in its lion
// costume; then roaring with it, a phase of its own, where three marks show when and how often to roar – no numbers
// counted down: each fills before its round and both roar together when it is full, each roar louder and a little
// longer than the one before. Every moving thing is an HTML layer of its own, all its animations last the scene, and
// its roars fall where the mouths are open.

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
    // The camera is an HTML element of its own; everything else is a `Piece` (a mark's class written with its number).
    if (name === "lion-camera") continue;
    const written = name.replace(/-\d$/, "-${k + 1}");
    const tags = [
      ...lion.matchAll(new RegExp(`<(\\w+)\\b[^<>]*?className=(?:"${name}"|\\{\`${written.replace(/[$]/g, "\\$").replace(/[{}+]/g, "\\$&")}\`\\})`, "g")),
    ].map((m) => m[1]);
    expect({ name, tags: tags.length > 0 && tags.every((t) => t === "Piece") }).toEqual({ name, tags: true });
  }
  // The camera is the one whole layer moved, an HTML div round the picture.
  expect(lion).toContain('<div className="lion-camera"');
});

test("the lion is seen first, then the child beside it in its costume, which is on from the start", () => {
  // The camera starts close on the lion and has drawn back to both within the lion's part, before the roaring.
  expect(lion).toContain("fitBox(room, FOCUS_LION)");
  expect(keyframes("teeth-lion-camera")).toContain(`${percentOf(BOTH_SEEN_BEAT)},\n  100% {\n    transform: translate(0, 0) scale(1);`);
  expect(BOTH_SEEN_BEAT).toBeLessThan(LION_INTRO_BEATS);
  // The mane never grows in: it is part of the still picture.
  expect(css).not.toContain("teeth-lion-mane");
  expect(lion).toMatch(/<Piece area=\{MANE_AREA\} className="lion-still">/);
});

test("three rounds, each a mark filling up and a roar when it is full, each roar louder and a little longer", () => {
  expect(ROUNDS).toHaveLength(3);
  expect(MARKS).toHaveLength(ROUNDS.length);
  // No numbers counted down any more (user request, November 2026): the marks show when and how often.
  expect(css).not.toContain("lion-count");
  expect(lion).not.toContain("lion-count");
  // The marks come with the roaring's part, before the first round's mark fills, and stay to the end.
  expect(keyframes("teeth-lion-marks")).toContain(`${percentOf(LION_INTRO_BEATS)} {\n    opacity: 0;`);
  for (const [k, round] of ROUNDS.entries()) {
    // Every round lies in the roaring's part, its mark filling in FILL_BEATS beats up to the roar.
    expect(round.fill).toBeGreaterThan(LION_INTRO_BEATS);
    expect(round.roar).toBe(round.fill + FILL_BEATS);
    expect({ k, filling: keyframes(`teeth-lion-mark-fill-${k + 1}`).includes(`${percentOf(round.fill)} {\n    transform: scale(0);`) }).toEqual({
      k,
      filling: true,
    });
    expect({ k, full: keyframes(`teeth-lion-mark-fill-${k + 1}`).includes(`${percentOf(round.roar)},\n  100% {\n    transform: scale(1);`) }).toEqual({
      k,
      full: true,
    });
    // Lit as a roaring lion's face on the roar, and staying lit, so the child sees how many are done.
    expect({ k, lit: keyframes(`teeth-lion-mark-lit-${k + 1}`).includes(`${percentOf(round.roar)} {\n    transform: scale(1.15);\n    opacity: 1;`) }).toEqual({
      k,
      lit: true,
    });
    expect(keyframes(`teeth-lion-mark-lit-${k + 1}`)).toMatch(/,\s*100% \{\s*transform: scale\(1\);\s*opacity: 1;\s*\}\s*$/);
    // The roar's waves go out from both mouths on the roar.
    expect({ k, waves: keyframes("teeth-lion-waves").includes(`${percentOf(round.roar)} {`) }).toEqual({ k, waves: true });
    // Both mouths are just wide open on the roar.
    for (const mouth of ["teeth-lion-kid-roar", "teeth-lion-jaw"])
      expect({ mouth, k, open: keyframes(mouth).includes(`${percentOf(round.roar)} {\n    transform: scale(1);`) }).toEqual({ mouth, k, open: true });
    if (k === 0) continue;
    const before = ROUNDS[k - 1];
    expect(round.gain).toBeGreaterThan(before.gain);
    expect(round.open).toBeGreaterThan(before.open);
    // A round's mark fills only once the mouths of the one before have closed.
    expect(round.fill).toBeGreaterThanOrEqual(before.roar + before.open);
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
  // The lion's and the roaring's parts are one scene, so its animations run on from one into the other.
  expect(play).toMatch(/before === "lion" \|\| before === "roar"\s*\?\s*"lion"/);
  expect(play).toContain("<Lion ");
  // Its pause follows the game's.
  expect(css).toContain(".teeth-play.paused .lion-scene *");
});

test("the bar's phase names are classes of its tiles, so no rule styles one of them alone", () => {
  // The scene's root was `.lion` (position: absolute, inset: 0) and laid the bar's lion tile over the sweets' (November 2026).
  for (const phase of ["eat", "fetch", "lion", "roar", "tidy"])
    expect({ phase, bare: new RegExp(`(^|[\\s,>+~(])\\.${phase}(?![\\w-])`, "m").test(css) }).toEqual({ phase, bare: false });
});
