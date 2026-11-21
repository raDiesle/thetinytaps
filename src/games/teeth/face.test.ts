import { expect, test } from "bun:test";

// The child in the mirror at the end is the child who ate the sweets in the story (user feedback, November 2026: the
// end's face had a plain fringe and black dot eyes and looked like another child). Both draw the same parts of
// face.tsx, the story flat, the mirror turned with the head.

const PARTS = ["Hair", "Ear", "EyeBall", "Iris", "Nose", "SkinGradient", "LASHES", "FACE", "LIP", "BROW"];

test.each(["origin.tsx", "mouth.tsx"])("%s draws the child with the shared face parts", async (file) => {
  const code = await Bun.file(`src/games/teeth/${file}`).text();
  const imported = code.match(/import \{([^}]*)\} from "\.\/face"/)?.[1] ?? "";
  for (const part of PARTS) {
    expect(imported).toMatch(new RegExp(`\\b${part}\\b`));
    // Never a part of its own beside the shared one.
    expect(code).not.toMatch(new RegExp(`(function|const) ${part}\\b`));
  }
});

// A lid line curving through the white above the iris met the eye's outline in a thick dark crescent over the pupil,
// which looked odd (user feedback, November 2026): the lid runs along the eye's own edge, an arc of its ellipse.
test("the upper lid lies on the eye's outline, never inside its white", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { EyeLid } = await import("./face");
  const d = renderToStaticMarkup(EyeLid({ x: 100, y: 100, rx: 22, ry: 26 })).match(/ d="([^"]+)"/)?.[1] ?? "";
  const [, x0, y0, rx, ry, , , , x1, y1] = d.match(/M([\d.]+) ([\d.]+) A([\d.]+) ([\d.]+) (\d) (\d) (\d) ([\d.]+) ([\d.]+)/) ?? [];
  expect([Number(rx), Number(ry)]).toEqual([22, 26]);
  for (const [x, y] of [
    [x0, y0],
    [x1, y1],
  ]) {
    // Both ends lie on the eye's ellipse.
    expect(((Number(x) - 100) / 22) ** 2 + ((Number(y) - 100) / 26) ** 2).toBeCloseTo(1, 5);
  }
});
