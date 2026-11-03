import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Mascot, MascotHead } from "./Mascot";

// Every fox or bear drawn in SVG has the one shared head (root CLAUDE.md): these drawings use it, and no file brings
// back one of the flat heads it replaced.

/** The drawings of the app's fox and bear, each of which must take its head from Mascot.tsx. */
const MASCOT_DRAWINGS = [
  "src/components/GameEnd.tsx",
  "src/components/RoomOptions.tsx",
  "src/games/scenes/shared.tsx",
  "src/games/pacifier/drawings.tsx",
  "src/games/together/pairs.tsx",
  "src/games/marbles/scenery.tsx",
  "src/games/marbles/CircusLevel.tsx",
  "src/games/timer/scenes.tsx",
  "src/games/teeth/TeethPlay.tsx",
];

/** Pieces of the old flat heads (triangle ears, an egg of a head), copied from file to file before. */
const OLD_HEADS = ["L21 9 L45 29", "C13 31 31 24 50 24", "M24 40 L22 6 L46 26", "M-9 -4 L-15 -17 L-3 -9"];

describe("the shared fox and bear", () => {
  test("every mascot drawing takes its head from Mascot.tsx", async () => {
    for (const file of MASCOT_DRAWINGS) {
      const code = await Bun.file(file).text();
      expect(code.includes('from "@/components/Mascot"') ? file : `${file} draws a fox or bear without Mascot.tsx`).toBe(file);
    }
  });

  test("no file draws one of the old flat heads", async () => {
    for await (const file of new Bun.Glob("src/**/*.tsx").scan(".")) {
      if (file.endsWith("Mascot.tsx")) continue;
      const code = await Bun.file(file).text();
      for (const piece of OLD_HEADS) expect(code.includes(piece) ? `${file}: ${piece}` : "").toBe("");
    }
  });

  test("every head and figure draws without broken numbers", () => {
    for (const kind of ["fox", "bear"] as const) {
      for (const eyes of ["open", "shut", "happy"] as const) {
        for (const mouth of ["smile", "open"] as const) {
          const svg = renderToStaticMarkup(createElement("svg", null, createElement(MascotHead, { kind, eyes, mouth, lashes: true })));
          expect(svg).not.toContain("NaN");
        }
      }
      for (const pose of ["stand", "wave", "cheer"] as const) {
        expect(renderToStaticMarkup(createElement(Mascot, { kind, pose, child: pose === "cheer" }))).not.toContain("NaN");
      }
    }
  });
});
