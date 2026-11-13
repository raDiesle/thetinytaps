import * as THREE from "three";
import type { Stage } from "./stage";

// Playing a story without a screen, for the tests that follow a story frame by frame (`collisions.test.ts`, the
// companions' checks): a stage that draws nothing and a canvas that paints nothing.

/** A stage that draws nothing: what the worlds use of it, without a renderer. */
export function quietStage() {
  return {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 900),
    sun: new THREE.DirectionalLight(),
    fill: new THREE.HemisphereLight(),
    setSky() {},
    setSunDirection() {},
    updateReflections() {},
  } as unknown as Stage;
}

/** Builds a story's world with a canvas that draws nothing (cobwebs and the riddle draw on one). */
export function withoutScreen<T>(make: () => T): T {
  const g = globalThis as { document?: unknown };
  const had = "document" in g;
  const before = g.document;
  const pen = new Proxy({}, { get: () => () => {} });
  g.document = { createElement: () => ({ getContext: () => pen }) };
  try {
    return make();
  } finally {
    if (had) g.document = before;
    else delete g.document;
  }
}

/** True if `o` and everything above it is shown. */
export const shown = (o: THREE.Object3D) => {
  for (let at: THREE.Object3D | null = o; at; at = at.parent) if (!at.visible) return false;
  return true;
};
