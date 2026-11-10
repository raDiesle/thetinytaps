import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SCENES } from ".";

// Idea A-28: with every item inside the one big svg, an old phone painted the whole picture again in every frame
// while a tapped item moved (busy 66–96 % instead of at most 60 %). So the background's svg holds only the still
// background, and each item, what taps bring out, the overlay and the marks have an svg of their own (SceneLayer).
// ScenePlay can't be rendered on the server (its stores have no server snapshot), so this reads its source.

describe("the picture's layers (ScenePlay.tsx)", () => {
  const source = readFileSync(join(import.meta.dir, "ScenePlay.tsx"), "utf8");
  const start = source.indexOf('className="scene-svg"');
  const background = source.slice(start, source.indexOf("</svg>", start));

  test("the background's svg holds nothing that moves when tapped", () => {
    expect(start).toBeGreaterThan(-1);
    expect(background).toContain("<scene.Background />");
    for (const moving of ["data-item", "item.Art", "SpotEffectArt", "scene.Overlay", "ExitSign", "HintRing", "FocusRing", "KeyBadges"])
      expect(background, moving).not.toContain(moving);
  });

  test("every item gets a layer of its own, a layer of the graphics card while it moves", () => {
    expect(source).toMatch(/\{items\.map\(\(item, i\) => \{[\s\S]*?<SceneLayer key=\{item\.id\} scene=\{scene\} taps moving=/);
  });
});

describe.each(SCENES.map((scene) => [scene.id, scene] as const))("scene %s, each item in its own svg", (_, scene) => {
  test("an item's drawing defines every gradient, filter, mask or shape it refers to", () => {
    for (const item of scene.items) {
      const markup = renderToStaticMarkup(createElement("svg", null, createElement(item.Art)));
      const used = [...markup.matchAll(/url\(#([^)"']+)\)|href="#([^"]+)"/g)].map((m) => m[1] ?? m[2]);
      const missing = used.filter((id) => !markup.includes(`id="${id}"`));
      expect(missing, item.id).toEqual([]);
    }
  });
});
