import { join } from "node:path";
import { describe, expect, test } from "bun:test";
import { isTest, read, sourceFiles } from "@/testSources";
import { heroLook } from "@/games/elevator/kid";
import { clothesOf } from "@/games/teeth/clothes";

// A figure that stands for the child follows „Junge / Mädchen“ on the home page (`useFigure` in src/lib/common.ts).
// Animals (Tapsi, the Gefühle animals) and the people in the pictures stay as they are.

const sources = sourceFiles()
  .filter((file) => /\.tsx?$/.test(file) && !isTest(file) && !file.startsWith(join("content", "ideas")))
  .map((file) => join("src", file));

/** Every drawing of the child itself: each asks the figure. A new one goes on this list. */
const CHILD_DRAWINGS = [
  "src/games/elevator/kid.tsx", // Kleine Abenteuer: the child of the stories, trails and films
  "src/games/teeth/mouth.tsx", // Zähne putzen: the face in the mirror
  "src/games/tower/Kid.tsx", // Counting Tower: the child climbing the tower
  "src/games/teeth/origin.tsx", // Zähne putzen: the face and shoulders in the story of the sugar monsters
  "src/games/teeth/prep.tsx", // Zähne putzen: the child's arm in its sleeve at the sink
  "src/games/handwash/hands.tsx", // Hände waschen: the child's own arms in their sleeves over the basin
];

describe("the child's figure", () => {
  test("every drawing of the child asks whether it is a boy or a girl", () => {
    const fixed = CHILD_DRAWINGS.filter((file) => !/\buse(Figure|Hero)\(\)/.test(read(file)));
    expect(fixed).toEqual([]);
  });

  // `heroLook` is the only place the child's looks are written down: a game drawing the child with a look of its own
  // would forget the setting.
  test("the child of Kleine Abenteuer is drawn with useHero, never with a fixed look", () => {
    const fixed = sources.filter((file) => /\blook=\{\{/.test(read(file)));
    expect(fixed).toEqual([]);
  });

  test("the girl differs from the boy only in hair and clothes' colours, so every pose and outfit still fits", () => {
    const { shirt: _s, pants: _p, pigtails, ...girl } = heroLook("girl");
    const { shirt: _bs, pants: _bp, ...boy } = heroLook("boy");
    expect(pigtails).toBeTruthy();
    expect(girl).toEqual(boy);
  });

  // Zähne putzen dresses the girl in clothes of her own (T-shirt, pyjama, pigtail bands), never the boy's.
  test("the girl brushing her teeth wears her own clothes", () => {
    const boy = clothesOf("boy");
    const girl = clothesOf("girl");
    expect([girl.shirt, girl.pyjama, girl.spot].filter((colour) => [boy.shirt, boy.pyjama, boy.spot].includes(colour))).toEqual([]);
  });

  // Words for the child that only fit a boy or a girl would be wrong for half of them, in any language.
  test("nothing said or shown to the child calls it a good boy or a good girl", () => {
    const gendered =
      /\b(brave[rs]?|gute[rs]?|große[rs]?|kleine[rs]?|liebe[rs]?|starke[rs]?|tolle[rs]?) (Junge|Mädchen)\b|\b(good|brave|big|clever) (boy|girl)\b|(молодец, мальчик|умница, девочка)/i;
    const found = sources.flatMap((file) =>
      read(file)
        .split("\n")
        .filter((line) => gendered.test(line))
        .map((line) => `${file}: ${line.trim()}`),
    );
    expect(found).toEqual([]);
  });
});
