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
