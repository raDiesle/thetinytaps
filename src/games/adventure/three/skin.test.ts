import { expect, test } from "bun:test";
import * as THREE from "three";
import { type RigidSkin, skinRigid } from "./skin";

/** Where a vertex of a plain mesh lies in the world, and where its ink line reaches (contour.ts: along the normal, in the mesh's own space). */
const plain = (mesh: THREE.Mesh, i: number, ink: number) => {
  const g = mesh.geometry;
  const p = new THREE.Vector3().fromBufferAttribute(g.attributes.position, i);
  const n = new THREE.Vector3().fromBufferAttribute(g.attributes.normal, i);
  return [p.clone().applyMatrix4(mesh.matrixWorld), p.addScaledVector(n, ink).applyMatrix4(mesh.matrixWorld)];
};

/** The same for a vertex of a skinned mesh: moved by its one bone, as the graphics card does. */
const skinned = (skin: RigidSkin, i: number, ink: number) => {
  const g = skin.geometry;
  const bone = skin.skeleton.bones[g.attributes.skinIndex.getX(i)];
  const p = new THREE.Vector3().fromBufferAttribute(g.attributes.position, i);
  const n = new THREE.Vector3().fromBufferAttribute(g.attributes.inkNormal, i);
  return [p.clone().applyMatrix4(bone.matrixWorld), p.addScaledVector(n, ink).applyMatrix4(bone.matrixWorld)];
};

test("skinned parts lie and outline where the meshes did, whatever the pose", () => {
  const material = new THREE.MeshStandardMaterial();
  const root = new THREE.Group();
  const arm = new THREE.Group();
  arm.position.set(0.2, 0.4, 0);
  root.add(arm);
  const hand = new THREE.Group();
  hand.position.y = -0.3;
  arm.add(hand);
  // Squashed and turned parts: their size scales the ink line's reach too.
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), material);
  upper.scale.set(1, 2.5, 0.6);
  upper.rotation.set(0.3, 0.2, 0.1);
  arm.add(upper);
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.02), material);
  palm.position.set(0, -0.03, 0.01);
  palm.scale.set(1.08, 1.05, 0.62);
  hand.add(palm);
  // A mesh on a mesh (the ink line, the glow's mask) moves with it.
  const hull = new THREE.Mesh(palm.geometry, new THREE.MeshBasicMaterial());
  palm.add(hull);

  const pose = () => {
    arm.rotation.set(-1.2, 0.4, 0.7);
    hand.rotation.set(0.5, -0.3, 0.2);
    root.position.set(1, 2, 3);
    root.scale.setScalar(1.15);
    root.updateMatrixWorld(true);
  };
  pose();
  const before = [upper, palm, hull].map((mesh) => {
    const n = mesh.geometry.attributes.position.count;
    return [0, Math.floor(n / 2), n - 1].map((i) => plain(mesh, i, 0.009));
  });

  root.rotation.set(0, 0, 0);
  arm.rotation.set(0, 0, 0);
  hand.rotation.set(0, 0, 0);
  root.updateMatrixWorld(true);
  const replaced = skinRigid([arm]);
  expect(new Set(replaced.values()).size).toBe(2);
  expect(upper.parent).toBeNull();
  expect(palm.parent).toBeNull();
  pose();

  // A skinned mesh keeps its pieces in the order it met the meshes: the hand (added first) before the upper arm.
  for (const [k, mesh] of [upper, palm, hull].entries()) {
    const skin = replaced.get(mesh)!;
    const offset = mesh === upper ? palm.geometry.attributes.position.count : 0;
    const n = mesh.geometry.attributes.position.count;
    [0, Math.floor(n / 2), n - 1].forEach((i, j) => {
      const [at, ink] = skinned(skin, offset + i, 0.009);
      expect(at.distanceTo(before[k][j][0])).toBeLessThan(1e-6);
      expect(ink.distanceTo(before[k][j][1])).toBeLessThan(1e-6);
    });
  }
});
