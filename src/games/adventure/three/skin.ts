import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// A jointed figure is dozens of small meshes (an arm with its fingers is twenty), and every mesh costs the phone
// a draw in every pass – the picture, the shadow, the ink line, the glow's mask. Skinned, every vertex follows its
// joint on the graphics card instead, so all parts drawn alike are one draw, however many joints they hang on.

/** A skinned mesh whose every vertex follows exactly one joint, as rigidly as the mesh it replaced. */
export class RigidSkin extends THREE.SkinnedMesh {
  /** Where its pieces lie, each in its joint's space: their bounds, without moving every vertex on the CPU. */
  readonly pieces: { bone: THREE.Object3D; sphere: THREE.Sphere }[] = [];

  /** The farthest (`side` 1) or nearest (-1) any piece reaches along `ahead`, seen from `from`. */
  reach(from: THREE.Vector3, ahead: THREE.Vector3, side: number, sphere = new THREE.Sphere()) {
    let best = -side * Number.POSITIVE_INFINITY;
    for (const piece of this.pieces) {
      sphere.copy(piece.sphere).applyMatrix4(piece.bone.matrixWorld);
      const d = sphere.center.sub(from).dot(ahead) + side * sphere.radius;
      best = side > 0 ? Math.max(best, d) : Math.min(best, d);
    }
    return best;
  }
}

/**
 * Turns all meshes under each of `roots` into one skinned mesh per look (material, shadows, draw order, layers,
 * shown or hidden), in place: each mesh's place against its joint – the nearest group above it – is baked into its
 * vertices, and the joint moves them. Looks the same: the joints keep moving as before, and the ink line keeps its
 * direction and length (`inkNormal`, see contour.ts), which a part's own size scaled. Returns which skinned mesh
 * took each mesh's place.
 */
export function skinRigid(roots: THREE.Object3D[]): Map<THREE.Mesh, RigidSkin> {
  type Piece = { mesh: THREE.Mesh; bone: THREE.Object3D; local: THREE.Matrix4 };
  const looks = new Map<string, { root: THREE.Object3D; pieces: Piece[] }>();
  const bones: THREE.Object3D[] = [];
  const boneIndex = new Map<THREE.Object3D, number>();
  roots.forEach((root, r) => {
    root.traverse((o) => {
      if (!(o instanceof THREE.Mesh) || o instanceof THREE.SkinnedMesh || Array.isArray(o.material)) return;
      // Meshes hanging on a mesh (the ink line, the glow's mask) move with it: its joint is theirs.
      const local = new THREE.Matrix4();
      let bone: THREE.Object3D = o;
      do {
        bone.updateMatrix();
        local.premultiply(bone.matrix);
        bone = bone.parent!;
      } while (bone instanceof THREE.Mesh);
      if (!boneIndex.has(bone)) {
        boneIndex.set(bone, bones.length);
        bones.push(bone);
      }
      const key = [r, o.material.uuid, o.castShadow, o.receiveShadow, o.renderOrder, o.layers.mask, o.visible, o.geometry.index !== null].join("|");
      if (!looks.has(key)) looks.set(key, { root, pieces: [] });
      looks.get(key)!.pieces.push({ mesh: o, bone, local });
    });
  });
  // The joints' own matrices are the bones: vertices are already in their joint's space.
  const skeleton = new THREE.Skeleton(
    bones as THREE.Bone[],
    bones.map(() => new THREE.Matrix4()),
  );
  const replaced = new Map<THREE.Mesh, RigidSkin>();
  for (const { root, pieces } of looks.values()) {
    const parts = pieces.map(({ mesh, bone, local }) => {
      const part = mesh.geometry.clone();
      const ink = (part.attributes.inkNormal ?? part.attributes.normal).clone();
      ink.applyMatrix3(new THREE.Matrix3().setFromMatrix4(local));
      part.setAttribute("inkNormal", ink);
      part.applyMatrix4(local);
      const count = part.attributes.position.count;
      const index = new Uint16Array(count * 4);
      const weight = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        index[i * 4] = boneIndex.get(bone)!;
        weight[i * 4] = 1;
      }
      part.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(index, 4));
      part.setAttribute("skinWeight", new THREE.Float32BufferAttribute(weight, 4));
      return part;
    });
    // Only what every piece has can be merged.
    const shared = Object.keys(parts[0].attributes).filter((name) => parts.every((p) => p.attributes[name]));
    for (const part of parts) for (const name of Object.keys(part.attributes)) if (!shared.includes(name)) part.deleteAttribute(name);
    const first = pieces[0].mesh;
    const skin = new RigidSkin(mergeGeometries(parts), first.material);
    for (const part of parts) part.dispose();
    for (const { mesh, bone, local } of pieces) {
      if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      skin.pieces.push({ bone, sphere: mesh.geometry.boundingSphere!.clone().applyMatrix4(local) });
    }
    skin.bindMode = THREE.DetachedBindMode;
    skin.bind(skeleton, new THREE.Matrix4());
    // The bones carry it all the way into the world, so it stays where the world's origin is, and its bounds
    // would have to be skinned on the CPU in every frame to cull it: it is always drawn.
    skin.matrixAutoUpdate = false;
    skin.matrixWorldAutoUpdate = false;
    skin.frustumCulled = false;
    skin.castShadow = first.castShadow;
    skin.receiveShadow = first.receiveShadow;
    skin.renderOrder = first.renderOrder;
    skin.layers.mask = first.layers.mask;
    skin.visible = first.visible;
    root.add(skin);
    for (const { mesh } of pieces) replaced.set(mesh, skin);
  }
  for (const mesh of replaced.keys()) mesh.removeFromParent();
  return replaced;
}
