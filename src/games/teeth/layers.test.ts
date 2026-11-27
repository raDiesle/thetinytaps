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
const playFile = await Bun.file("src/games/teeth/TeethPlay.tsx").text();

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
 * The sky is the one picture that changes as a whole (its colour as the day goes by): two more skies lie alone in svgs
 * of their own over the first and fade in by their opacity. The camera is the HTML layer that zooms in.
 */
const WHOLE = new Set(["origin-sky-1", "origin-sky-2", "origin-camera"]);

/** The body of a `@keyframes` rule in teeth.css. */
const keyframes = (name: string) => css.match(new RegExp(`@keyframes ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";

test("the story animates only HTML layers of their own, never something inside its picture", () => {
  onlyOnPieces(new Set(animatedClasses("origin").filter((c) => !WHOLE.has(c))), origin);
});

// The sky's colour once changed by an animation of its rect's fill, and the story's monsters swayed and blinked inside
// their svgs: while the monsters grew, the story painted the whole screen 60 times a second on the old Android
// (November 2026). A phone moves a layer by its transform, opacity or filter without painting it again.
test("every keyframe of the game animates only transform, opacity or filter", () => {
  const names = [...css.matchAll(/@keyframes ([\w-]+)/g)].map((m) => m[1]);
  expect(names.length).toBeGreaterThan(20);
  for (const name of names) {
    const properties = [...keyframes(name).matchAll(/([\w-]+)\s*:/g)].map((m) => m[1]);
    for (const property of properties) {
      const fine = ["transform", "opacity", "filter", "animation-timing-function", "visibility"].includes(property);
      expect({ name, property, fine }).toEqual({ name, property, fine: true });
    }
  }
});

test("the story's sky changes by fading skies of its own in, and its monsters sway as HTML", () => {
  for (const name of ["teeth-origin-sky-noon", "teeth-origin-sky-dusk", "teeth-origin-sky-night", "teeth-origin-sky-dawn"]) {
    expect(keyframes(name)).toContain("opacity");
  }
  expect(origin).toMatch(/className=\{`origin-picture origin-sky-\$\{i\}`\}/);
  // The monsters' Piece moves its svg as a whole; the Monster drawn inside stands still (no blink, no sway).
  expect(css).toMatch(/\.origin-monster > svg \{[^}]*animation: teeth-origin-monster-sway/);
  expect(origin).toMatch(/<Monster\b[^>]*\bstill\b/);
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

test("the end's shine breathes as a layer of its own", () => {
  // The shine is an svg of its own over the mirror whose animation changes only its opacity.
  expect(mouth).toMatch(/<svg className="mouth mouth-moving teeth-shine"/);
  for (const name of ["teeth-shine-in", "teeth-shine-breathe"]) {
    expect(keyframes(name)).toContain("opacity");
    expect(keyframes(name)).not.toMatch(/transform|fill|stroke|filter/);
  }
});

// The end's surprise, a last monster peeking in and putting on sunglasses, was taken out (user feedback, November
// 2026): the clean, shining teeth are the end, with no monster left in the picture.
test("no monster comes back at the end", () => {
  expect(mouth).not.toMatch(/dazzle|sunglasses/i);
  expect(css).not.toMatch(/dazzle/);
  expect(playFile).not.toContain("dazzled");
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

// While brushing only the song is heard (user feedback, November 2026): the monsters once fizzed as they dissolved,
// one fizz after the other over the song. The mirror's sounds are only these, each set off by something else.
test("a brushed monster dissolves without a sound of its own", async () => {
  const play = await Bun.file("src/games/teeth/TeethPlay.tsx").text();
  const sounds = play
    .match(/import \{([^}]*)\} from "@\/lib\/sfx"/)?.[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  expect(sounds?.sort()).toEqual([
    "loadRecordings",
    // A new part of the story or the sink, and each new step of the brushing.
    "playChime",
    // The countdown before the brushing.
    "playCountNote",
    "playDrumRoll",
    // The end's cheer.
    "playRecorded",
    // A monster the child taps giggles.
    "playSqueak",
    // „Los!“ and the end's fanfare.
    "playTusch",
  ]);
  expect(mouth).not.toMatch(/from "@\/lib\/sfx"/);
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

// Turning from the front to the side, the profile's glass and lips once faded in by their opacity and lay half
// see-through over the front view's lips and gum for a moment (user feedback, November 2026): the profile is never
// see-through, its outline slides in from the head's edge instead (`profileParts`).
test("the side view's cut is never faded in by its opacity", () => {
  const cut = mouth.match(/const profileCut = useMemo\([\s\S]*?\}, \[/)?.[0] ?? "";
  expect(cut).toContain("side.beyond");
  expect(cut).not.toMatch(/opacity/);
});

// The face's outline once ran straight from the upper lip's end to the lower one's, a black stroke in front of the
// teeth between the lips (user feedback, November 2026): it is drawn as two lines, broken at the mouth.
test("the side view's outline never runs across the mouth between the lips", () => {
  const cut = mouth.match(/const profileCut = useMemo\([\s\S]*?\}, \[/)?.[0] ?? "";
  expect(cut).toContain("d={profileOutline(side.line)}");
  expect(cut).not.toContain("side.line.map");
  expect(mouth).toMatch(/function profileOutline[\s\S]*?slice\(0, half\)[\s\S]*? M\$\{line\.slice\(half\)/);
});

// The teeth to brush once had a pulsing gold frame (user feedback, November 2026: the yellow glow is too much, the grey
// stain is enough), and later the monsters lost their glow too (user feedback, November 2026): their stain and the
// monsters themselves mark the teeth to brush.
test("no gold frame or glow marks the teeth to brush or their monsters", () => {
  expect(mouth).not.toContain("zone-glow");
  expect(mouth).not.toMatch(/zone-tooth-|stroke="#ffd23f"/);
  expect(css).not.toContain("zone-glow");
  expect(mouth).not.toMatch(/monster-glow|sprite-glow/);
  expect(css).not.toMatch(/monster-glow|sprite-glow|glow-breathe/);
});

// The monsters cling to their teeth, a little sticky (user feedback, November 2026): drips under their foot and paws
// stuck to the tooth, drawn with the monster itself, so the story's monsters are sticky too.
test("the monsters look sticky", () => {
  const monster = mouth.match(/export function Monster\([\s\S]*?\n\}\n/)?.[0] ?? "";
  expect(monster).toContain("MONSTER_DRIPS");
  expect(monster).toContain("MONSTER_PAWS");
});

// Along the upright bar the brush lies across the steps, its head pointing from the side at the step running now
// (user request, November 2026): turned head down (90°) it hid the groove.
test("the riding brush points across the upright bar", () => {
  const rule = css.match(/\.teeth-runner > img \{[^}]*rotate: (-?\d+)deg/)?.[1];
  expect(Math.abs(Number(rule))).toBeLessThanOrEqual(20);
});

// The story's face, the sink and the mirror are cut to the frame by CSS (`FRAME_CLIP`), never by a `<clipPath>` found
// by its id: while the book opened, the screen's copy held the same id, and the whole face vanished but for the eyes
// and the mouth, which are layers of their own (user feedback, November 2026).
test("the pictures as big as the screen are cut to the frame without an id", async () => {
  const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();
  for (const [name, source, picture] of [
    ["origin.tsx", origin, 'className="origin-picture" viewBox={viewBox} role="img"'],
    ["prep.tsx", prep, 'className="prep-picture"'],
    ["mouth.tsx", mouth, 'className="mouth"'],
  ] as const) {
    const tag = source.slice(source.indexOf(picture), source.indexOf(">", source.indexOf(picture)));
    expect(tag, name).toContain("style={FRAME_CLIP}");
    expect(source, name).not.toMatch(/clipPath id="(origin-frame|prep-frame|mirror)"/);
  }
});
