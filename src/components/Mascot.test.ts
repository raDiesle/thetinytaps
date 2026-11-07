import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Mascot, MascotHead } from "./Mascot";

// Every fox or bear drawn in SVG has the one shared head (root CLAUDE.md): these drawings use it, and no file brings
// back one of the flat heads it replaced.

/** The drawings of the app's fox and bear, each of which must take its head from Mascot.tsx. */
const MASCOT_DRAWINGS = [
  "src/components/RoomOptions.tsx",
  "src/games/scenes/shared.tsx",
  "src/games/pacifier/drawings.tsx",
  "src/games/together/pairs.tsx",
  "src/games/together/Helper.tsx",
  "src/games/marbles/scenery.tsx",
  "src/games/marbles/CircusLevel.tsx",
  "src/games/timer/scenes.tsx",
  "src/games/scenes/hideout.tsx",
  "src/games/elevator/kid.tsx",
  "src/games/letters/MovePlay.tsx",
  "src/games/scenes/supermarkt/wall.tsx",
  "src/games/scenes/supermarkt/checkout.tsx",
  "src/games/scenes/kita/people.tsx",
  "src/games/scenes/kinderarzt/practice.tsx",
  "src/games/scenes/wald/people.tsx",
  "src/games/feelings/moodArt.tsx",
  "src/games/scenes/feuerwache/parts.tsx",
  "src/games/scenes/feuerwache/figures.tsx",
  "src/games/scenes/zoo/visitors.tsx",
  "src/games/scenes/bauernhof/figures.tsx",
  "src/games/scenes/flughafen/people.tsx",
];

/** Pieces of the old flat heads (triangle ears, an egg of a head), copied from file to file before. */
const OLD_HEADS = ["L21 9 L45 29", "C13 31 31 24 50 24", "M24 40 L22 6 L46 26", "M-9 -4 L-15 -17 L-3 -9"];

describe("the shared fox and bear", () => {
  test("every mascot drawing takes its head from Mascot.tsx", async () => {
    for (const file of MASCOT_DRAWINGS) {
      const code = await Bun.file(file).text();
      expect(code.includes('from "@/components/Mascot"') || code.includes("MascotFace") ? file : `${file} draws a fox or bear without Mascot.tsx`).toBe(file);
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
      for (const eyes of ["open", "wide", "half", "shut", "happy"] as const) {
        for (const mouth of ["smile", "open", "grin", "frown", "o"] as const) {
          for (const brows of ["soft", "sad", "angry", "up"] as const) {
            const svg = renderToStaticMarkup(createElement("svg", null, createElement(MascotHead, { kind, eyes, mouth, brows, lashes: true })));
            expect(svg).not.toContain("NaN");
          }
        }
      }
      for (const pose of ["stand", "wave", "cheer", "clap", "point"] as const) {
        expect(renderToStaticMarkup(createElement(Mascot, { kind, pose, child: pose === "cheer" }))).not.toContain("NaN");
      }
    }
  });

  // User feedback, November 2026: a fox or bear that only stood by in a game – a family watching beside the picture,
  // cheering beside the end's buttons, walking through a Wimmelbild – was decoration children wanted to tap and thought
  // part of the game, and only added things to look at; all of them were taken out. A whole standing figure comes only
  // where it does the game's thing: a new place goes on this list with what the figure does there.
  test("a whole fox or bear figure stands only where it does the game's thing", async () => {
    const doing: Record<string, string> = {
      "src/games/letters/MovePlay.tsx": "Mitmachen: the child hops, claps and stamps the number",
      "src/games/timer/scenes.tsx": "Timer: the child holds the basket, waters the flower, blows out the candle, takes its turn",
      "src/games/together/pairs.tsx":
        "Was gehört zusammen?: the child the doctor listens to and the hairdresser cuts, and the family the key opens the door to",
    };
    for await (const file of new Bun.Glob("src/**/*.tsx").scan(".")) {
      if (file.endsWith("Mascot.tsx")) continue;
      const code = await Bun.file(file).text();
      if (/<Mascot[\s/>]/.test(code)) expect(doing[file] ? file : `${file} stands a fox or bear by: only where it does the game's thing`).toBe(file);
    }
    expect(await Bun.file("src/components/GameEnd.tsx").text()).not.toContain("@/components/Mascot");
  });
});
