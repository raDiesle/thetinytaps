import { expect, test } from "bun:test";
import { STAIN_FILLS, TOOTH_FILLS } from "./mouth";
import { dirtyFaces, faceKey, type MonsterOnTooth } from "./stains";
import { STEPS } from "./steps";

// The teeth start a little yellow and grey and turn white as they are brushed, tooth by tooth, and the brushed tooth
// sparkles once (user request, November 2026).

const css = await Bun.file("src/games/teeth/teeth.css").text();
const mouth = await Bun.file("src/games/teeth/mouth.tsx").text();
const origin = await Bun.file("src/games/teeth/origin.tsx").text();

/** One monster on every tooth of every step, as `placeMonsters` sets them (a chewing surface has two). */
const MONSTERS: MonsterOnTooth[] = STEPS.flatMap((step, s) =>
  step.teeth.flatMap((tooth) => (step.surface === "top" ? [1, 3] : [2]).map(() => ({ step: s, tooth }))),
);
const EVERY_FACE = STEPS.flatMap((step) => step.teeth.map((tooth) => faceKey(tooth, step.surface)));

test("every face a step brushes is stained before the brushing and white once it is done", () => {
  expect(new Set(EVERY_FACE).size).toBe(EVERY_FACE.length);
  expect(dirtyFaces(-1, MONSTERS, () => false).sort()).toEqual([...EVERY_FACE].sort());
  expect(dirtyFaces(STEPS.length, MONSTERS, () => false)).toEqual([]);
});

test("a face turns white once the brush has taken all of its monsters off, and only then", () => {
  const first = STEPS[0];
  const tooth = first.teeth[0];
  const onIt = MONSTERS.filter((m) => m.step === 0 && m.tooth === tooth);
  // A chewing surface has two monsters: with one gone the face is still stained.
  expect(onIt.length).toBe(2);
  expect(dirtyFaces(0, MONSTERS, (m) => m === onIt[0])).toContain(faceKey(tooth, first.surface));
  const left = dirtyFaces(0, MONSTERS, (m) => onIt.includes(m));
  expect(left).not.toContain(faceKey(tooth, first.surface));
  expect(left.length).toBe(EVERY_FACE.length - 1);
  // Brushed steps stay white, the next ones stay stained.
  const later = dirtyFaces(2, MONSTERS, () => false);
  for (const t of STEPS[1].teeth) expect(later).not.toContain(faceKey(t, STEPS[1].surface));
  for (const t of STEPS[3].teeth) expect(later).toContain(faceKey(t, STEPS[3].surface));
});

/** How light a colour is, 0 to 255. */
const lightness = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

test("a stained face is plainly darker and yellower than a clean one, never brown", () => {
  for (const kind of ["outer", "top", "inner"] as const) {
    const [clean, stained] = [TOOTH_FILLS[kind], STAIN_FILLS[kind]];
    expect({ kind, darker: lightness(clean) - lightness(stained) > 10 }).toEqual({ kind, darker: true });
    expect({ kind, light: lightness(stained) > 190 }).toEqual({ kind, light: true });
  }
});

// The stain on the teeth being brushed fades in a layer of its own: a fade inside the mirror's svg would have the phone
// paint the screen anew in every frame of it (CLAUDE.md, phones must keep up).
test("the stain of a tooth being brushed fades as an HTML layer of its own", () => {
  expect(mouth).toMatch(/<div className=\{`tooth-stain\$\{clean \? " clean" : ""\}`\}/);
  expect(css).toMatch(/\.tooth-stain\.clean \{\s*animation: teeth-stain-clear [^;]*forwards;/);
  // The mask cuts out what lies over the face by its outlines in black: no filter, which costs a phone paint.
  const stain = mouth.slice(mouth.indexOf("const ToothStain"));
  expect(stain).not.toContain("<filter");
  // The still picture is built anew only when a step's teeth are done, never with every tick while they are brushed.
  expect(mouth).toMatch(/\}, \[view, all, model, painted, lipPoints, lipsPath, stillDirty, stillFoam, side, happy, folds\]\);/);
});

test("in the story the sugar stains the teeth while the monsters grow, as a layer of its own", () => {
  expect(origin).toMatch(/part === "grow" && \(\s*<Piece [^>]*className="origin-stain"/);
  expect(css).toMatch(/\.origin\.at-grow \.origin-stain \{\s*animation: teeth-origin-stain /);
});

// A brushed tooth's one big glint flashed while the brush still lay on it, so only the step's last tooth seemed to
// sparkle (user feedback, November 2026): brushed faces sparkle with small, faint glints, only once the brush has
// reached the next tooth, after a beat's pause, and go on sparkling softly. Then a glint on every brushed face was too
// much (user feedback, November 2026): one or two glints, one to a face, on the faces the brush left last.
test("brushed teeth sparkle small and softly, only once the brush has moved on", () => {
  expect(mouth).toMatch(/const sparkling = stains\.filter\(\(g\) => !dirty\.includes\(g\.key\) && brush !== null && brushLeft\(brush, g\.tooth\.id\)\);/);
  expect(mouth).toMatch(/function brushLeft[\s\S]*?brush\.at >= last \+ 1/);
  expect(Number(mouth.match(/const SPARKLE_SIZE = ([\d.]+);/)?.[1])).toBeLessThanOrEqual(0.25);
  expect(Number(mouth.match(/const SPARKLES_AT_ONCE = (\d+);/)?.[1])).toBeLessThanOrEqual(2);
  expect(mouth).toMatch(/\.slice\(0, SPARKLES_AT_ONCE\)/);
  expect(mouth).toMatch(/sparkle: project\.point\(onFace\([^)]*\)\),/);
  const sparkle = css.match(/\.tooth-glint\.brushed > div \{\s*animation: ([^;]+);/)?.[1] ?? "";
  expect(sparkle).toMatch(/^teeth-sparkle [\d.]+s ease-in-out calc\(0\.536s \+ var\(--turn\) \* [\d.]+s\) infinite$/);
  const peak = Math.max(...[...(css.match(/@keyframes teeth-sparkle \{[\s\S]*?\n\}/)?.[0] ?? "").matchAll(/opacity: ([\d.]+)/g)].map((m) => Number(m[1])));
  expect(peak).toBeLessThanOrEqual(0.55);
});

// Brushed teeth are a beautiful white (user feedback, November 2026), never cream.
test("a clean tooth's front is pure white and its other faces a cool white", () => {
  expect(TOOTH_FILLS.outer).toBe("#ffffff");
  for (const kind of ["top", "inner", "side"] as const) {
    const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(TOOTH_FILLS[kind].slice(i, i + 2), 16));
    expect({ kind, cool: b >= r && b >= g }).toEqual({ kind, cool: true });
  }
});
