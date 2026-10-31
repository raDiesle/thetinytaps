import { expect, test } from "bun:test";
import * as THREE from "three";
import { makeWorld as cloudTrip } from "../stories/cloudTrip/world";
import { makeWorld as treasureIsland } from "../stories/treasureIsland/world";
import { Guide } from "./guide";

// three.js visits every object in every frame, drawn or not: with 2,186 of them the story kept an old phone's
// main thread 79 % busy (October 2026). Props are baked (`mergeParts`), the fox's arms and legs skinned (`skinRigid`)
// and the birds one flock (`makeFlock`), so the counts stay well below that; a new prop that is not baked shows here
// first. Raise a limit only for something new that really needs the parts.
const LIMITS = { fox: 160, treasureIsland: 900, cloudTrip: 230 };

const count = (root: THREE.Object3D) => {
  let n = 0;
  root.traverse(() => n++);
  return n;
};

/** Builds a world with a canvas that draws nothing (cobwebs and the riddle draw on one). */
function built(make: (scene: THREE.Scene) => unknown) {
  const had = "document" in globalThis;
  const pen = new Proxy({}, { get: () => () => {} });
  const g = globalThis as { document?: unknown };
  const before = g.document;
  g.document = { createElement: () => ({ getContext: () => pen }) };
  try {
    const scene = new THREE.Scene();
    make(scene);
    return scene;
  } finally {
    if (had) g.document = before;
    else delete g.document;
  }
}

test("the fox stays a few hundred objects", () => {
  expect(count(new Guide().root)).toBeLessThanOrEqual(LIMITS.fox);
});

test("the worlds keep their props baked", () => {
  expect(count(built(treasureIsland))).toBeLessThanOrEqual(LIMITS.treasureIsland);
  expect(count(built(cloudTrip))).toBeLessThanOrEqual(LIMITS.cloudTrip);
});
