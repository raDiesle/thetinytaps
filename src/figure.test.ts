import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { heroLook } from "@/games/elevator/kid";

// A figure that stands for the child follows „Junge / Mädchen“ on the home page (`useFigure` in src/lib/common.ts).
// Animals (Tapsi, the Gefühle animals) and the people in the pictures stay as they are.

const sources = readdirSync("src", { recursive: true, encoding: "utf8" })
  .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".test.ts") && !file.startsWith(join("content", "ideas")))
  .map((file) => join("src", file));

/** Every drawing of the child itself: each asks the figure. A new one goes on this list. */
const CHILD_DRAWINGS = [
  "src/games/elevator/kid.tsx", // Kleine Abenteuer: the child of the stories, trails and films
  "src/games/teeth/mouth.tsx", // Zähne putzen: the face in the mirror
  "src/games/teeth/origin.tsx", // Zähne putzen: the face in the story of the sugar monsters
];

describe("the child's figure", () => {
  test("every drawing of the child asks whether it is a boy or a girl", () => {
    const fixed = CHILD_DRAWINGS.filter((file) => !/\buse(Figure|Hero)\(\)/.test(readFileSync(file, "utf8")));
    expect(fixed).toEqual([]);
  });

  // `heroLook` is the only place the child's looks are written down: a game drawing the child with a look of its own
  // would forget the setting.
  test("the child of Kleine Abenteuer is drawn with useHero, never with a fixed look", () => {
    const fixed = sources.filter((file) => /\blook=\{\{/.test(readFileSync(file, "utf8")));
    expect(fixed).toEqual([]);
  });

  test("the girl differs from the boy only in hair and clothes' colours, so every pose and outfit still fits", () => {
    const { shirt: _s, pants: _p, pigtails, ...girl } = heroLook("girl");
    const { shirt: _bs, pants: _bp, ...boy } = heroLook("boy");
    expect(pigtails).toBeTruthy();
    expect(girl).toEqual(boy);
  });

  // Words for the child that only fit a boy or a girl would be wrong for half of them, in any language.
  test("nothing said or shown to the child calls it a good boy or a good girl", () => {
    const gendered =
      /\b(brave[rs]?|gute[rs]?|große[rs]?|kleine[rs]?|liebe[rs]?|starke[rs]?|tolle[rs]?) (Junge|Mädchen)\b|\b(good|brave|big|clever) (boy|girl)\b|(молодец, мальчик|умница, девочка)/i;
    const found = sources.flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .filter((line) => gendered.test(line))
        .map((line) => `${file}: ${line.trim()}`),
    );
    expect(found).toEqual([]);
  });
});
