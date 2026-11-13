import { expect, test } from "bun:test";
import * as THREE from "three";
import { type ArmPose, Guide, type Pose, restPose } from "./guide";

// Tapsi's paws as a real child's: arms that reach well over the head and a palm that faces where a real one
// would (user feedback, November 2026: raised arms ended below the ears, and the palms faced up all the time,
// with the thumb on the wrong side of them).

let time = -1e5;
function posed(guide: Guide, arm: Partial<ArmPose>) {
  const p: Pose = restPose();
  Object.assign(p.armL, arm);
  time -= 10;
  guide.apply(p, time);
  guide.root.updateMatrixWorld(true);
}
/** Where the left palm faces, in the fox's space (x to its left, y up, z ahead). */
const palmOf = (guide: Guide) => new THREE.Vector3(0, 0, 1).transformDirection(guide.handL.matrixWorld);
/** The tip of the left paw's middle fingers. */
const tipOf = (guide: Guide) => guide.handL.localToWorld(new THREE.Vector3(0, -0.11, 0));

test("raised, the paws reach well over the head; hanging, they end above the knees", () => {
  const guide = new Guide();
  posed(guide, {});
  const ears = new THREE.Box3().setFromObject(guide.root).max.y;
  const hanging = tipOf(guide).y;
  posed(guide, { raise: Math.PI, spread: 0, elbow: 0 });
  expect(tipOf(guide).y, "a paw stretched straight up").toBeGreaterThan(ears + 0.03);
  // The knee: foot and shin above the ground, in the fox's units shown bigger.
  const knee = (0.07 + 0.24) * guide.root.scale.y;
  expect(hanging, "a hanging paw").toBeGreaterThan(knee + 0.03);
});

test("the palm faces the body while the arm hangs, down while it reaches out and forwards when it is up", () => {
  const guide = new Guide();
  posed(guide, {});
  expect(palmOf(guide).x, "hanging: towards the body").toBeLessThan(-0.7);
  posed(guide, { raise: Math.PI / 2, spread: 0, elbow: 0 });
  expect(palmOf(guide).y, "ahead: down").toBeLessThan(-0.7);
  posed(guide, { raise: 0, spread: Math.PI / 2, elbow: 0 });
  expect(palmOf(guide).y, "out to the side: down").toBeLessThan(-0.7);
  posed(guide, { raise: Math.PI, spread: 0, elbow: 0 });
  expect(palmOf(guide).z, "up: forwards").toBeGreaterThan(0.7);
  posed(guide, { raise: Math.PI / 2, spread: 0, elbow: 0, palm: 1 });
  expect(palmOf(guide).y, "ahead and open, to catch: up").toBeGreaterThan(0.7);
});

// A body like a child's (user feedback, November 2026: two balls for chest and pelvis, no neck and the head sunk
// between ball-jointed shoulders looked like a snowman doll): the head sits on a neck above the shoulders and is
// about a quarter of the height, not a third.
test("the head sits on a neck above the shoulders and is no bigger than a child's", () => {
  const guide = new Guide();
  posed(guide, {});
  const head = new THREE.Box3().setFromObject((guide as unknown as { head: THREE.Object3D }).head);
  const whole = new THREE.Box3().setFromObject(guide.root);
  const shoulderY = (guide as unknown as { armL: { shoulder: THREE.Object3D } }).armL.shoulder.getWorldPosition(new THREE.Vector3()).y;
  expect(head.min.y - shoulderY, "the chin above the shoulder joints").toBeGreaterThan(0.04 * guide.root.scale.y);
  expect((head.max.y - head.min.y) / (whole.max.y - whole.min.y), "the head's share of the height, ears included").toBeLessThan(0.34);
});
