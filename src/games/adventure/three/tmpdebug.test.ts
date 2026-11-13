import { test } from "bun:test";
import * as THREE from "three";
import { FIRE_RESCUE } from "../stories/fireRescue";
import { Guide } from "./guide";
import { storyFrame, storyPose, storyTimes, worldPose } from "./player";
import type { Stage } from "./stage";
test("debug", () => {
  const stage = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    sun: new THREE.DirectionalLight(),
    fill: new THREE.HemisphereLight(),
    setSky() {},
    setSunDirection() {},
    updateReflections() {},
  } as unknown as Stage;
  const guide = new Guide();
  stage.scene.add(guide.root);
  const g = globalThis as { document?: unknown };
  const pen = new Proxy({}, { get: () => () => {} });
  g.document = { createElement: () => ({ getContext: () => pen }) };
  const world = FIRE_RESCUE.build(stage, guide, () => {});
  const { starts } = storyTimes(FIRE_RESCUE);
  let before = 0;
  for (let t = 99.0; t <= 100.6; t += 0.1) {
    const f = storyFrame(FIRE_RESCUE, starts, t, before, 0.1);
    before = t;
    const r = world.update(f);
    guide.apply(worldPose(storyPose(FIRE_RESCUE, f, 0), r), t);
    world.afterPose?.(f);
    const k = world.held!()[4];
    const root = guide.root.position;
    const L = guide.gripPoint("L", new THREE.Vector3()),
      R = guide.gripPoint("R", new THREE.Vector3());
    const rel = (v: THREE.Vector3) =>
      v
        .clone()
        .sub(root)
        .toArray()
        .map((x) => x.toFixed(2))
        .join(",");
    console.log(
      t.toFixed(1),
      "clip",
      (f.act + f.demo).toFixed(2),
      "yaw",
      guide.root.rotation.y.toFixed(2),
      "kitten",
      rel(k.position),
      "L",
      rel(L),
      "R",
      rel(R),
      "in",
      guide
        .insideNow()(k.position.clone().add(new THREE.Vector3(0, 0.15, 0)))
        .toFixed(3),
    );
  }
});
