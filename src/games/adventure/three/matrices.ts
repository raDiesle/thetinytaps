import * as THREE from "three";

// three.js works out every object's place in the world again in every frame, moved or not: with a
// world of two thousand parts that alone kept an old phone's main thread busy (October 2026). This
// does the same, but only for what moved since it last looked (its place, turn, size or parent) and
// for everything under that; the rest keeps the matrices it has.

/** What an object's matrix was last worked out from. */
interface Seen {
  parent: THREE.Object3D | null;
  values: Float64Array;
}

/** An object with what it was last seen at kept on itself: a field is quicker to read than a map. */
type Tracked = THREE.Object3D & { matricesSeen?: Seen };

/** True (and remembered) if `o` moved, turned, changed size or parent since it was last looked at. */
function moved(o: Tracked) {
  const p = o.position;
  const q = o.quaternion;
  const s = o.scale;
  let last = o.matricesSeen;
  if (!last) {
    last = { parent: o.parent, values: new Float64Array(10) };
    o.matricesSeen = last;
  } else {
    const v = last.values;
    if (
      last.parent === o.parent &&
      v[0] === p.x &&
      v[1] === p.y &&
      v[2] === p.z &&
      v[3] === q.x &&
      v[4] === q.y &&
      v[5] === q.z &&
      v[6] === q.w &&
      v[7] === s.x &&
      v[8] === s.y &&
      v[9] === s.z
    )
      return false;
    last.parent = o.parent;
  }
  const v = last.values;
  v[0] = p.x;
  v[1] = p.y;
  v[2] = p.z;
  v[3] = q.x;
  v[4] = q.y;
  v[5] = q.z;
  v[6] = q.w;
  v[7] = s.x;
  v[8] = s.y;
  v[9] = s.z;
  return true;
}

function update(o: Tracked, parentMoved: boolean) {
  // What is hidden is not drawn: its matrices wait until it shows again, and are all worked out then.
  if (!o.visible) {
    o.matricesSeen = undefined;
    return;
  }
  let changed = parentMoved || o.matrixWorldNeedsUpdate;
  if (o.matrixAutoUpdate && moved(o)) {
    o.matrix.compose(o.position, o.quaternion, o.scale);
    changed = true;
  } else if (!o.matrixAutoUpdate && o.parent !== o.matricesSeen?.parent) {
    // A matrix set by hand still follows a new parent.
    moved(o);
    changed = true;
  }
  if (changed) {
    if (o.matrixWorldAutoUpdate) {
      if (o.parent === null) o.matrixWorld.copy(o.matrix);
      else o.matrixWorld.multiplyMatrices(o.parent.matrixWorld, o.matrix);
    }
    o.matrixWorldNeedsUpdate = false;
  }
  const children = o.children;
  for (let i = 0; i < children.length; i++) update(children[i], changed);
}

const before = new THREE.Matrix4();

/**
 * Brings the world matrices of `root` and everything under it up to date, like `updateMatrixWorld(true)`,
 * but works out only those that changed. The parent's own world matrix must be up to date already (it may
 * have moved since: `root` itself is always worked out again). Use it in place of `updateMatrixWorld` on
 * anything big (the scene, the fox, a raft with things on it); the stage's scene has
 * `matrixWorldAutoUpdate = false`, so the renderer leaves it to this.
 */
export function updateMoved(root: THREE.Object3D) {
  before.copy(root.matrixWorld);
  if (root.matrixAutoUpdate && moved(root)) root.matrix.compose(root.position, root.quaternion, root.scale);
  if (root.matrixWorldAutoUpdate) {
    if (root.parent === null) root.matrixWorld.copy(root.matrix);
    else root.matrixWorld.multiplyMatrices(root.parent.matrixWorld, root.matrix);
  }
  root.matrixWorldNeedsUpdate = false;
  const changed = !root.matrixWorld.equals(before);
  for (const child of root.children) update(child, changed);
}
