import { expect, test } from "bun:test";
import * as THREE from "three";
import { CLOUD_TRIP } from "../stories/cloudTrip";
import { FIRE_RESCUE } from "../stories/fireRescue";
import type { Story } from "../stories/story";
import { TREASURE_ISLAND } from "../stories/treasureIsland";
import { FOREARM, Guide, SHOULDER } from "./guide";
import { quietStage, shown, withoutScreen } from "./headless";
import { storyFrame, storyPose, storyTimes, worldPose } from "./player";

// No solid thing goes into another (user feedback, November 2026: picking up the rod in Die Schatzinsel, paw and rod
// were inside Tapsi's body). Every story is played here frame by frame without a screen, as the player plays it, and
// nothing Tapsi holds (`StoryWorld.held`) nor its own paws and arms may reach into its torso or head (user feedback,
// November 2026: winding up the rod, the left arm went through the head, which a check of the paws alone missed).
// Water, air and clouds are no solids; the line of the fishing rod is too thin to count.

/** How deep something may sink into the fur before it counts, in fox units: a paw resting on the tummy only touches it. */
const FUR = 0.03;
/** How far down the upper arm (0 shoulder, 1 elbow) the arm is checked: above it, it grows out of the torso. */
const ARM_FROM = 0.3;
/** Seconds between the frames checked. */
const EVERY = 0.1;

/** Where things reach into the guide's body: the deepest moment of each in each step, as "what in step n at time: depth". */
function overlaps(story: Story) {
  const stage = quietStage();
  const guide = new Guide();
  stage.scene.add(guide.root);
  const world = withoutScreen(() => story.build(stage, guide, () => {}));
  const { starts, total } = storyTimes(story);
  const worst = new Map<string, { time: number; depth: number; step: number }>();
  // The deepest moment of each thing in each step: kept by thing alone, one step's hit hid every other step's.
  const note = (what: string, depth: number, time: number, step: number) => {
    if (depth <= FUR) return;
    const key = `${what} in step ${step}`;
    const was = worst.get(key);
    if (!was || depth > was.depth) worst.set(key, { time, depth, step });
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
    for (const hand of ["L", "R"] as const) {
      note(`paw ${hand}`, inside(guide.gripPoint(hand, point)), t, f.step);
      // The arm along its middle line, from below the shoulder through the elbow to the wrist, against the whole body:
      // an arm reaching across in front of the chest (the crank, the key, picking up or laying down the rod and the
      // paddle) went into the torso with the usual bend of its elbow, though its paw stayed clear.
      const shoulder = guide.bodyPoint(a.set(SHOULDER.x * (hand === "L" ? 1 : -1), SHOULDER.y, 0), a);
      const forearm = guide.forearm(hand, new THREE.Matrix4());
      const elbow = new THREE.Vector3().setFromMatrixPosition(forearm);
      const wrist = b.set(0, -FOREARM, 0).applyMatrix4(forearm);
      for (let k = 0; k <= 10; k++) {
        note(`arm ${hand}`, inside(point.lerpVectors(shoulder, elbow, ARM_FROM + ((1 - ARM_FROM) * k) / 10)), t, f.step);
        note(`arm ${hand}`, inside(point.lerpVectors(elbow, wrist, k / 10)), t, f.step);
      }
    }
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
            // At least one piece: a capsule's poles repeat a corner, and 0 / 0 would sample nowhere.
            const pieces = Math.max(1, Math.ceil(a.distanceTo(b) / 0.04));
            for (let k = 0; k <= pieces; k++) note(what(thing), inside(point.lerpVectors(a, b, k / pieces)), t, f.step);
          }
        }
      });
    }
  }
  return [...worst].map(([what, w]) => `${what} at ${w.time.toFixed(1)} s: ${w.depth.toFixed(3)} deep`);
}

test("in Die Schatzinsel nothing reaches into Tapsi's body", () => {
  expect(overlaps(TREASURE_ISLAND)).toEqual([]);
});

test("in Die Wolkenreise nothing reaches into Tapsi's body", () => {
  expect(overlaps(CLOUD_TRIP)).toEqual([]);
});

test("in Fire Rescue nothing reaches into Tapsi's body", () => {
  expect(overlaps(FIRE_RESCUE)).toEqual([]);
});
