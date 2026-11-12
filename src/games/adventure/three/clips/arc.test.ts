import { expect, test } from "bun:test";
import * as THREE from "three";
import { FOREARM, Guide, hipsHeight } from "../guide";
import { clipPose } from ".";
import { ARC, ARC_PERIOD, arcAngle, arcDraw, arcRadius } from "./motion";

// The rainbow is painted where the brush's tip really is (Die Wolkenreise): the tip has to go round each band's
// circle exactly, on both sides and in every band, or the colour appears beside the brush (user feedback,
// November 2026). Measured on the posed rig, so a change of the arm's bones or of the clip shows here.
test("the arc clip's brush tip goes round each band's circle", () => {
  const guide = new Guide();
  const elbow = new THREE.Matrix4();
  const toRoot = new THREE.Matrix4();
  const tip = new THREE.Vector3();
  let checked = 0;
  for (let t = 0; t < ARC.bands * ARC_PERIOD; t += 0.05) {
    const draw = arcDraw(t);
    if (draw.reach < 1 || draw.down > 0) continue;
    const pose = clipPose("arc", t);
    guide.apply(pose, 0);
    guide.root.updateMatrixWorld(true);
    toRoot.copy(guide.root.matrixWorld).invert();
    guide.forearm(draw.left ? "L" : "R", elbow);
    tip
      .set(0, -(FOREARM + ARC.brush), 0)
      .applyMatrix4(elbow)
      .applyMatrix4(toRoot);
    tip.y -= hipsHeight(pose);
    const side = draw.left ? 1 : -1;
    const angle = arcAngle(draw.along);
    const r = arcRadius(draw.band);
    const want = new THREE.Vector3(side * r * Math.cos(angle), ARC.y + r * Math.sin(angle), ARC.z);
    // Well within half a band.
    expect(tip.distanceTo(want)).toBeLessThan(ARC.band * 0.25);
    checked++;
  }
  expect(checked).toBeGreaterThan(100);
});

test("the painting arm moves smoothly round the arc, without jumping between ways to reach", () => {
  let before = clipPose("arc", 0);
  for (let t = 0.02; t < ARC.bands * ARC_PERIOD; t += 0.02) {
    const pose = clipPose("arc", t);
    const draw = arcDraw(t);
    if (draw.reach < 1 || draw.down > 0) {
      before = pose;
      continue;
    }
    for (const arm of ["armL", "armR"] as const) {
      const a = before[arm];
      const b = pose[arm];
      const jump = Math.max(Math.abs(a.raise - b.raise), Math.abs(a.spread - b.spread), Math.abs(a.elbow - b.elbow), Math.abs(a.twist - b.twist));
      expect(jump).toBeLessThan(0.25);
    }
    before = pose;
  }
});
