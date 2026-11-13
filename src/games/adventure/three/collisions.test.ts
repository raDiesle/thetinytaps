import { expect, test } from "bun:test";
import * as THREE from "three";
import { CLOUD_TRIP } from "../stories/cloudTrip";
import type { Story } from "../stories/story";
import { TREASURE_ISLAND } from "../stories/treasureIsland";
import { Guide } from "./guide";
import { storyFrame, storyPose, storyTimes, worldPose } from "./player";
import type { Stage } from "./stage";

// No solid thing goes into another (user feedback, November 2026: picking up the rod in Die Schatzinsel, paw and rod
// were inside Tapsi's body). Every story is played here frame by frame without a screen, as the player plays it, and
// nothing Tapsi holds (`StoryWorld.held`) nor its own paws may reach into its torso or head. Water, air and clouds
// are no solids; the line of the fishing rod is too thin to count.

/** How deep something may sink into the fur before it counts, in fox units: a paw resting on the tummy only touches it. */
const FUR = 0.03;
/** Seconds between the frames checked. */
const EVERY = 0.1;

/** A stage that draws nothing: what the worlds use of it, without a renderer. */
function quietStage() {
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
function withoutScreen<T>(make: () => T): T {
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

const shown = (o: THREE.Object3D) => {
  for (let at: THREE.Object3D | null = o; at; at = at.parent) if (!at.visible) return false;
  return true;
};

/** Where things reach into the guide's body: the deepest moment of each, as "what at time: depth". */
function overlaps(story: Story) {
  const stage = quietStage();
  const guide = new Guide();
  stage.scene.add(guide.root);
  const world = withoutScreen(() => story.build(stage, guide, () => {}));
  const { starts, total } = storyTimes(story);
  const worst = new Map<string, { time: number; depth: number; step: number }>();
  const note = (what: string, depth: number, time: number, step: number) => {
    if (depth <= FUR) return;
    const was = worst.get(what);
    if (!was || depth > was.depth) worst.set(what, { time, depth, step });
  };
  const [point, a, b] = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
  const names = new Map((world.held?.() ?? []).map((thing, i) => [thing, thing.name || `held thing ${i + 1}`]));
  const what = (thing: THREE.Object3D) => names.get(thing) ?? "the rope";
  let before = -EVERY;
  for (let t = 0; t <= total; t += EVERY) {
    const f = storyFrame(story, starts, t, before, EVERY);
    before = t;
    const result = world.update(f);
    guide.apply(worldPose(storyPose(story, f, result.walking ? 1 : 0), result), t);
    world.afterPose?.(f);
    const inside = guide.insideNow();
    for (const hand of ["L", "R"] as const) note(`paw ${hand}`, inside(guide.gripPoint(hand, point)), t, f.step);
    const body = guide.root.getWorldPosition(new THREE.Vector3());
    for (const thing of world.held?.() ?? []) {
      if (!shown(thing)) continue;
      thing.updateWorldMatrix(true, true);
      // Only what is near enough to touch: the fox is about 1.5 tall.
      if (new THREE.Box3().setFromObject(thing).distanceToPoint(body) > 2) continue;
      thing.traverse((part) => {
        if (!(part instanceof THREE.Mesh) || !part.visible) return;
        // Along the edges of its triangles, not only at its corners: a long thin rod has corners only at its ends.
        const at = part.geometry.attributes.position;
        const index = part.geometry.index;
        const corners = index ? index.count : at.count;
        const triangles = corners / 3;
        const stride = Math.max(1, Math.floor(triangles / 60));
        for (let tri = 0; tri < triangles; tri += stride) {
          for (let e = 0; e < 3; e++) {
            const [i, j] = [tri * 3 + e, tri * 3 + ((e + 1) % 3)].map((c) => (index ? index.getX(c) : c));
            a.fromBufferAttribute(at, i).applyMatrix4(part.matrixWorld);
            b.fromBufferAttribute(at, j).applyMatrix4(part.matrixWorld);
            const pieces = Math.ceil(a.distanceTo(b) / 0.04);
            for (let k = 0; k <= pieces; k++) note(what(thing), inside(point.lerpVectors(a, b, k / pieces)), t, f.step);
          }
        }
      });
    }
  }
  return [...worst].map(([what, w]) => `${what} in step ${w.step} at ${w.time.toFixed(1)} s: ${w.depth.toFixed(3)} deep`);
}

test("in Die Schatzinsel nothing reaches into Tapsi's body", () => {
  expect(overlaps(TREASURE_ISLAND)).toEqual([]);
});

test("in Die Wolkenreise nothing reaches into Tapsi's body", () => {
  expect(overlaps(CLOUD_TRIP)).toEqual([]);
});
