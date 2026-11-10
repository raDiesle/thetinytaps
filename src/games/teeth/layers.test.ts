import { expect, test } from "bun:test";

// Phones must keep up (CLAUDE.md): a CSS animation of something inside an svg has the phone paint that whole svg again
// in every frame. The story once moved its sweets, pupils, brows, cheeks, hearts and chewing mouth inside one picture
// the size of the screen, and the end's sparkles twinkled inside the mirror's: both painted more than the budget of
// `bun run perf zaehne` on the old Android (November 2026). So what moves is an HTML layer of its own (`Piece` in
// origin.tsx, `Sprite` in mouth.tsx) moved as a whole.

const css = await Bun.file("src/games/teeth/teeth.css").text();
const origin = await Bun.file("src/games/teeth/origin.tsx").text();
const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();

/** The classes of the story that teeth.css animates: those named last in a rule that sets an animation. */
const animatedClasses = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(([, , body]) => /(^|[;\s])animation(-name)?\s*:/.test(body))
  .flatMap(([, selector]) => selector.split(","))
  .flatMap((one) => [...(one.trim().split(/\s+/).pop() ?? "").matchAll(/\.(origin-[\w-]+)/g)].map((m) => m[1]));

/**
 * The sky is the one picture that changes as a whole (its colour as the day goes by): it lies alone in the svg behind
 * the child. The camera is the HTML layer that zooms in.
 */
const WHOLE = new Set(["origin-sky", "origin-camera"]);

test("the story animates only HTML layers of their own, never something inside its picture", () => {
  const classes = new Set(animatedClasses.filter((c) => !WHOLE.has(c)));
  expect(classes.size).toBeGreaterThan(5);
  for (const name of classes) {
    // Every element that carries the class: the tag it is written on.
    const tags = [...origin.matchAll(new RegExp(`<(\\w+)\\b[^<>]*?className=[^>]*?\\b${name}\\b`, "g"))].map((m) => m[1]);
    expect({ name, found: tags.length > 0 }).toEqual({ name, found: true });
    for (const tag of tags) expect({ name, tag }).toEqual({ name, tag: "Piece" });
  }
});

test("the story's animations per sweet are set on HTML layers too", () => {
  const perSweet = [...origin.matchAll(/const (\w+) = perSweet\(/g)].map((m) => m[1]);
  expect(perSweet.length).toBeGreaterThan(3);
  for (const name of perSweet) {
    const tags = [...origin.matchAll(new RegExp(`<(\\w+)\\b[^<>]*?\\b${name}\\b`, "g"))].map((m) => m[1]);
    expect({ name, found: tags.length > 0 }).toEqual({ name, found: true });
    for (const tag of tags) expect({ name, tag }).toEqual({ name, tag: tag === "Pupil" ? "Pupil" : "Piece" });
  }
});

test("the end's sparkles twinkle as small layers of their own, not inside the mirror", () => {
  expect(mouth).toMatch(/<Sprite\b[^>]*className="tooth-sparkle"/);
  expect(css).toMatch(/\.tooth-sparkle > svg \{\s*animation:/);
});

test("the mirror's glass and frame are drawn in screen px, so a turning head does not paint them again", () => {
  expect(mouth).toContain("<FrameStroke frame={screenEdge} unit={1} />");
});
