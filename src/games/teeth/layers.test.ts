import { expect, test } from "bun:test";

// Phones must keep up (CLAUDE.md): a CSS animation of something inside an svg has the phone paint that whole svg again
// in every frame. The story once moved its sweets, pupils, brows, cheeks, hearts and chewing mouth inside one picture
// the size of the screen, and the end's sparkles twinkled inside the mirror's: both painted more than the budget of
// `bun run perf zaehne` on the old Android (November 2026); the sink moved its brush, hand, tube and water inside its
// one picture too. So what moves is an HTML layer of its own (`Piece` in piece.tsx, `Sprite` in mouth.tsx) moved as a
// whole.

const css = await Bun.file("src/games/teeth/teeth.css").text();
const origin = await Bun.file("src/games/teeth/origin.tsx").text();
const prep = await Bun.file("src/games/teeth/prep.tsx").text();
const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();

/** The classes of a picture (`origin`, `prep`) that teeth.css animates: those named last in a rule that sets an animation. */
const animatedClasses = (prefix: string) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, , body]) => /(^|[;\s])animation(-name)?\s*:/.test(body))
    .flatMap(([, selector]) => selector.split(","))
    .flatMap((one) => [...(one.trim().split(/\s+/).pop() ?? "").matchAll(new RegExp(`\\.(${prefix}-[\\w-]+)`, "g"))].map((m) => m[1]));

/** Every animated class of a picture is written only on `Piece`s in its code. */
function onlyOnPieces(classes: Set<string>, code: string) {
  expect(classes.size).toBeGreaterThan(5);
  for (const name of classes) {
    // Every element that carries the class: the tag it is written on.
    const tags = [...code.matchAll(new RegExp(`<(\\w+)\\b[^<>]*?className=[^>]*?\\b${name}\\b`, "g"))].map((m) => m[1]);
    expect({ name, found: tags.length > 0 }).toEqual({ name, found: true });
    for (const tag of tags) expect({ name, tag }).toEqual({ name, tag: "Piece" });
  }
}

/**
 * The sky is the one picture that changes as a whole (its colour as the day goes by): it lies alone in the svg behind
 * the child. The camera is the HTML layer that zooms in.
 */
const WHOLE = new Set(["origin-sky", "origin-camera"]);

test("the story animates only HTML layers of their own, never something inside its picture", () => {
  onlyOnPieces(new Set(animatedClasses("origin").filter((c) => !WHOLE.has(c))), origin);
});

test("the sink animates only HTML layers of their own, never something inside its picture", () => {
  onlyOnPieces(new Set(animatedClasses("prep")), prep);
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

test("the end's shine breathes as a layer of its own, and the dazzled monster moves its HTML, not inside an svg", () => {
  // The shine is an svg of its own over the mirror whose animation changes only its opacity.
  expect(mouth).toMatch(/<svg className="mouth mouth-moving teeth-shine"/);
  const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
  for (const name of ["teeth-shine-in", "teeth-shine-breathe"]) {
    expect(keyframes(name)).toContain("opacity");
    expect(keyframes(name)).not.toMatch(/transform|fill|stroke|filter/);
  }
  // The monster's body and glasses are divs round their svgs.
  expect(mouth).toMatch(/<div className="dazzle-body">\s*<svg/);
  expect(mouth).toMatch(/<div className="dazzle-glasses">\s*<svg/);
});

test("the mirror's glass and frame are drawn in screen px, so a turning head does not paint them again", () => {
  expect(mouth).toContain("<FrameStroke frame={screenEdge} unit={1} />");
});

test("a brushed monster dissolves as HTML layers: its sprite's body and the grains, never something inside its svg", () => {
  // Its body blurs and fades as the sprite's div, the grains are divs of their own.
  expect(css).toMatch(/\.monster-sprite\.gone \.sprite-body \{[^}]*animation: teeth-monster-dissolve/);
  expect(css).toMatch(/\.monster-dust > i \{[^}]*animation: teeth-dust/);
  expect(mouth).toMatch(/<div className="monster-dust"/);
  // The old puff and spin inside the svg are gone, and nothing animates the svg's body once it is brushed.
  expect(css).not.toMatch(/\.sugar-monster\.gone \.monster-(body|puff) \{[^}]*animation/);
  expect(mouth).not.toContain("monster-puff");
});

// The end's sparkle on the teeth (user feedback, November 2026): first too plain, then gold and quick flashes over a
// tooth and a half were too strong. White light only, small, slow, each glint a Sprite whose HTML moves.
test("the end's glints are white, small and slow Sprites", () => {
  const glint = mouth.match(/function Glint\(\)[\s\S]*?\n\}/)?.[0] ?? "";
  expect(glint).not.toMatch(/#f[0-9a-f]c[0-9a-f]00|#ffd|gold/i);
  expect(glint).not.toMatch(/\p{Extended_Pictographic}/u);
  expect(Number(mouth.match(/const GLINT_SIZE = ([\d.]+);/)?.[1])).toBeLessThanOrEqual(1.4);
  expect(mouth).toMatch(/<Sprite\b[^>]*className="tooth-glint"/);
  const seconds = Number(css.match(/\.tooth-glint > div \{[^}]*animation: teeth-glint ([\d.]+)s/)?.[1]);
  expect(seconds).toBeGreaterThanOrEqual(8);
});
