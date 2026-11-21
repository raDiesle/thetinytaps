import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { HELLO_AGAIN_MS, HELLO_KEYFRAMES, HELLO_MS, HELLO_TIMES, helloOrder } from "./hello";
import { SCENES } from "./index";

describe("„Hier bin ich!“ (B-15)", () => {
  test("every picture has items to wave, animals first, none twice", () => {
    for (const scene of SCENES) {
      const order = helloOrder(scene.items, scene.width, scene.height);
      expect(order.length).toBe(Math.min(HELLO_TIMES, scene.items.length));
      expect(new Set(order).size).toBe(order.length);
      const animals = scene.items.filter((item) => item.traits?.includes("animal")).length;
      order.forEach((item, i) => expect(!!item.traits?.includes("animal")).toBe(i < animals));
    }
  });

  test("the wave ends where it began, standing still", () => {
    expect(HELLO_KEYFRAMES[0].transform).toBe("none");
    expect(HELLO_KEYFRAMES.at(-1)?.transform).toBe("none");
    expect(HELLO_MS).toBeLessThan(HELLO_AGAIN_MS);
  });

  test("it is silent: the engine plays no sound for it", () => {
    const play = readFileSync(new URL("./ScenePlay.tsx", import.meta.url), "utf8");
    const effect = play.slice(play.indexOf("„Hier bin ich!“"), play.indexOf("}, [greets"));
    expect(effect).not.toMatch(/play[A-Z]\w*\(|say\(|speak\(/);
  });
});
