import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

// Things for the stories, modelled from simple shapes: soft, round and
// friendly, with a little hand-made wobble so nothing looks too perfect.

export function mat(color: string, roughness = 0.7, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, ...extra });
}

export function solid(geometry: THREE.BufferGeometry, material: THREE.Material, shadow = true) {
  const m = new THREE.Mesh(geometry, material);
  m.castShadow = shadow;
  m.receiveShadow = true;
  return m;
}

/**
 * Bakes the meshes of scenery that never moves into one mesh per look
 * (colour, roughness, shadows), so a tablet draws a whole jungle in a few
 * calls instead of a thousand.
 */
export function mergeStatic(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const looks = new Map<string, { mesh: THREE.Mesh; parts: THREE.BufferGeometry[] }>();
  root.traverse((o) => {
    if (!(o instanceof THREE.Mesh) || Array.isArray(o.material)) return;
    const m = o.material as THREE.MeshStandardMaterial;
    const key = [m.type, m.color?.getHexString(), m.roughness, m.metalness, m.flatShading, m.side, o.castShadow, o.receiveShadow].join();
    const part = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
    for (const name of Object.keys(part.attributes)) if (name !== "position" && name !== "normal") part.deleteAttribute(name);
    part.applyMatrix4(o.matrixWorld);
    const look = looks.get(key) ?? { mesh: o, parts: [] as THREE.BufferGeometry[] };
    looks.set(key, look);
    look.parts.push(part);
  });
  const merged = new THREE.Group();
  for (const { mesh, parts } of looks.values()) {
    const one = new THREE.Mesh(mergeGeometries(parts), mesh.material);
    one.castShadow = mesh.castShadow;
    one.receiveShadow = mesh.receiveShadow;
    merged.add(one);
    for (const part of parts) part.dispose();
  }
  return merged;
}

/** A pseudo-random number in 0..1 from a seed, so every run looks the same. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Moves the vertices of `geometry` a little, for a hand-made look. */
function wobble(geometry: THREE.BufferGeometry, amount: number, seed: number) {
  const rnd = seeded(seed);
  const pos = geometry.attributes.position;
  // Shared corners must move together, or the faces split open.
  const moved = new Map<string, [number, number, number]>();
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(3)},${pos.getY(i).toFixed(3)},${pos.getZ(i).toFixed(3)}`;
    let d = moved.get(key);
    if (!d) {
      d = [(rnd() - 0.5) * amount, (rnd() - 0.5) * amount, (rnd() - 0.5) * amount];
      moved.set(key, d);
    }
    pos.setXYZ(i, pos.getX(i) + d[0], pos.getY(i) + d[1], pos.getZ(i) + d[2]);
  }
  geometry.computeVertexNormals();
  return geometry;
}

export function makeRock(size: number, seed: number, color = "#a49a90") {
  const g = wobble(new THREE.DodecahedronGeometry(size, 1), size * 0.35, seed);
  const m = solid(g, mat(color, 0.9, { flatShading: true }));
  m.scale.y = 0.7;
  return m;
}

export function makeBush(size: number, seed: number, colors = ["#4f9e3c", "#5fb547", "#3f8a33"]) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const r = size * (0.45 + rnd() * 0.35);
    const ball = solid(wobble(new THREE.IcosahedronGeometry(r, 2), r * 0.18, seed + i), mat(colors[i % colors.length], 0.85));
    const a = rnd() * Math.PI * 2;
    ball.position.set(Math.cos(a) * size * 0.45, r * 0.75 + rnd() * size * 0.2, Math.sin(a) * size * 0.45);
    group.add(ball);
  }
  return group;
}

/** A palm tree: ringed, curved trunk, drooping fronds and a few coconuts. */
export function makePalm(height: number, seed: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const lean = 0.15 + rnd() * 0.25;
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, height * 0.55, 0),
    new THREE.Vector3(height * lean, height, 0),
  );
  const barkA = mat("#9b6b43", 0.95);
  const barkB = mat("#7f5534", 0.95);
  const rings = 10;
  for (let i = 0; i < rings; i++) {
    const u = i / rings;
    const p = curve.getPoint(u + 0.5 / rings);
    const tangent = curve.getTangent(u + 0.5 / rings);
    const r = 0.26 - u * 0.1;
    const ring = solid(new THREE.CylinderGeometry(r * 0.92, r, height / rings + 0.02, 14), i % 2 ? barkA : barkB);
    ring.position.copy(p);
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    group.add(ring);
  }
  const top = curve.getPoint(1);
  const leafMat = new THREE.MeshStandardMaterial({ color: "#3fa34a", roughness: 0.75, side: THREE.DoubleSide });
  const leafMat2 = new THREE.MeshStandardMaterial({ color: "#56b94f", roughness: 0.75, side: THREE.DoubleSide });
  const fronds = 8;
  for (let i = 0; i < fronds; i++) {
    const g = new THREE.PlaneGeometry(0.8, height * 0.55, 3, 10);
    const pos = g.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const y = pos.getY(v) / (height * 0.55) + 0.5; // 0 at the trunk, 1 at the tip
      const x = pos.getX(v);
      // Narrow tip, a fold along the middle, and a droop towards the ground.
      const width = Math.sin(Math.min(1, y * 1.1) * Math.PI) * 0.9 + 0.1;
      pos.setX(v, x * width);
      pos.setZ(v, -Math.abs(x * width) * 0.35 - y * y * height * 0.28);
      pos.setY(v, y * height * 0.5);
    }
    g.computeVertexNormals();
    const leaf = solid(g, i % 2 ? leafMat : leafMat2);
    leaf.position.copy(top);
    leaf.rotation.set(-1.15 + rnd() * 0.25, (i / fronds) * Math.PI * 2 + rnd() * 0.3, 0, "YXZ");
    group.add(leaf);
  }
  const nutMat = mat("#5a3b22", 0.8);
  for (let i = 0; i < 3; i++) {
    const nut = solid(new THREE.SphereGeometry(0.14, 14, 10), nutMat);
    const a = (i / 3) * Math.PI * 2;
    nut.position.copy(top).add(new THREE.Vector3(Math.cos(a) * 0.17, -0.18, Math.sin(a) * 0.17));
    group.add(nut);
  }
  return group;
}

/** A butterfly; call `flap(time)` every frame. */
export function makeButterfly(color: string) {
  const group = new THREE.Group();
  const wingMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, side: THREE.DoubleSide, emissive: color, emissiveIntensity: 0.25 });
  const body = solid(new THREE.CapsuleGeometry(0.02, 0.12, 4, 8), mat("#3b2a2a"), false);
  body.rotation.x = Math.PI / 2;
  group.add(body);
  const wings: THREE.Mesh[] = [];
  for (const side of [1, -1]) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12 * side, 0.18, 0.28 * side, 0.12, 0.22 * side, -0.02);
    shape.bezierCurveTo(0.26 * side, -0.14, 0.1 * side, -0.18, 0, -0.04);
    const wing = new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), wingMat);
    wing.rotation.x = -Math.PI / 2;
    const pivot = new THREE.Group();
    pivot.add(wing);
    group.add(pivot);
    wings.push(wing);
  }
  return {
    group,
    flap(time: number) {
      const a = Math.sin(time * 18) * 0.9;
      wings[0].parent!.rotation.z = a;
      wings[1].parent!.rotation.z = -a;
    },
  };
}

/** The turtle that carries Tapsi: how high its back is above its belly (local y), where Tapsi stands. */
export const TURTLE_BACK = 0.45;
/** Half the width and half the length of the shell. */
export const TURTLE_HALF_WIDTH = 0.78;
export const TURTLE_HALF_LENGTH = 0.95;
/** How far in front of the turtle's middle its nose reaches. */
export const TURTLE_NOSE = 1.42;
/** The edge of the shell above the belly (local y). */
const TURTLE_RIM = 0.13;

/**
 * The top of the turtle at (x, z) from its middle (local): the shell, flat on
 * top so Tapsi can step about on it, steep at the sides; down its flanks to
 * the ground (0) just outside the edge.
 */
export function turtleTop(x: number, z: number) {
  const r2 = (x / TURTLE_HALF_WIDTH) ** 2 + (z / TURTLE_HALF_LENGTH) ** 2;
  if (r2 < 1) return TURTLE_RIM + (TURTLE_BACK - TURTLE_RIM) * Math.sqrt(1 - r2 ** 3);
  return TURTLE_RIM * Math.max(0, 1 - (Math.sqrt(r2) - 1) / 0.12);
}

/**
 * Ole, a big, friendly sea turtle looking along +z: a domed shell with scutes,
 * flat on top, a round head with big eyes and a smile, and four flippers.
 * `move` walks or swims it.
 */
export function makeTurtle() {
  const group = new THREE.Group();
  const skin = mat("#8fc97a", 0.65);
  const skinDark = mat("#6aa65a", 0.7);

  // The shell: a dome with a flat top, coloured into scutes – five down the middle, four on each side,
  // and a ring of small ones round the edge – with dark seams between them.
  const shellGeo = new THREE.SphereGeometry(1, 72, 28, 0, Math.PI * 2, 0, Math.PI / 2);
  const pos = shellGeo.attributes.position;
  const seeds: [number, number][] = [];
  for (const z of [0.62, 0.31, 0, -0.31, -0.62]) seeds.push([0, z]);
  for (const side of [1, -1]) for (const z of [0.47, 0.16, -0.16, -0.47]) seeds.push([side * 0.52, z]);
  const scute = new THREE.Color("#7cb860");
  const middle = new THREE.Color("#9ccf74");
  const seam = new THREE.Color("#3f6b34");
  const edge = new THREE.Color("#b8d87e");
  const c = new THREE.Color();
  const colors: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const r2 = x * x + z * z;
    let near = Infinity;
    let next = Infinity;
    for (const [sx, sz] of seeds) {
      const d = Math.hypot(x - sx, z - sz);
      if (d < near) [near, next] = [d, near];
      else if (d < next) next = d;
    }
    const r = Math.sqrt(r2);
    if (r > 0.86) {
      // The small scutes round the edge.
      const a = Math.atan2(z, x);
      const line = Math.abs(Math.sin(a * 11)) < 0.12 || r < 0.88;
      c.copy(line ? seam : edge);
    } else {
      c.copy(scute).lerp(middle, Math.max(0, 1 - near / 0.22) * 0.8);
      if (next - near < 0.035) c.copy(seam);
    }
    colors.push(c.r, c.g, c.b);
    pos.setXYZ(i, x * TURTLE_HALF_WIDTH, TURTLE_RIM + (TURTLE_BACK - TURTLE_RIM) * Math.sqrt(Math.max(0, 1 - r2 ** 3)), z * TURTLE_HALF_LENGTH);
  }
  shellGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  shellGeo.computeVertexNormals();
  group.add(solid(shellGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 })));
  const rimGeo = new THREE.TorusGeometry(1, 0.045, 8, 72);
  rimGeo.rotateX(Math.PI / 2);
  rimGeo.scale(TURTLE_HALF_WIDTH + 0.01, 1, TURTLE_HALF_LENGTH + 0.01);
  const rim = solid(rimGeo, mat("#5f9447", 0.6));
  rim.position.y = TURTLE_RIM;
  group.add(rim);
  // The belly underneath, light and flat.
  const bellyGeo = new THREE.SphereGeometry(1, 40, 12);
  bellyGeo.scale(TURTLE_HALF_WIDTH * 0.93, 0.11, TURTLE_HALF_LENGTH * 0.93);
  const belly = solid(bellyGeo, mat("#efe0a4", 0.7));
  belly.position.y = TURTLE_RIM - 0.01;
  group.add(belly);

  // The head on a short neck, big friendly eyes, a smile and rosy cheeks.
  const head = new THREE.Group();
  head.position.set(0, 0.2, TURTLE_HALF_LENGTH - 0.02);
  group.add(head);
  const neck = solid(new THREE.CylinderGeometry(0.11, 0.13, 0.32, 16), skin);
  neck.rotation.x = Math.PI / 2 - 0.25;
  neck.position.set(0, 0.03, 0.1);
  head.add(neck);
  const skull = solid(new THREE.SphereGeometry(0.19, 28, 20), skin);
  skull.scale.set(1, 0.88, 1.18);
  skull.position.set(0, 0.09, 0.27);
  head.add(skull);
  for (const [x, y, z, r] of [
    [0.07, 0.2, 0.25, 0.03],
    [-0.09, 0.19, 0.2, 0.025],
    [0.0, 0.22, 0.13, 0.028],
  ]) {
    const spot = solid(new THREE.SphereGeometry(r, 10, 8), skinDark, false);
    spot.scale.y = 0.4;
    spot.position.set(x, y, z);
    head.add(spot);
  }
  const eyes: THREE.Group[] = [];
  for (const side of [1, -1]) {
    const eye = new THREE.Group();
    eye.position.set(0.1 * side, 0.15, 0.4);
    eye.rotation.y = 0.35 * side;
    const ball = solid(new THREE.SphereGeometry(0.058, 18, 14), mat("#ffffff", 0.3), false);
    eye.add(ball);
    const pupil = solid(new THREE.SphereGeometry(0.036, 14, 10), mat("#1b1210", 0.2), false);
    pupil.position.z = 0.03;
    eye.add(pupil);
    const glint = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), new THREE.MeshBasicMaterial({ color: "#ffffff" }));
    glint.position.set(0.012, 0.015, 0.06);
    eye.add(glint);
    head.add(eye);
    eyes.push(eye);
    const cheek = new THREE.Mesh(new THREE.CircleGeometry(0.035, 16), new THREE.MeshBasicMaterial({ color: "#ff8fa3", transparent: true, opacity: 0.6 }));
    cheek.position.set(0.15 * side, 0.06, 0.4);
    cheek.rotation.y = 0.7 * side;
    head.add(cheek);
  }
  const smile = solid(new THREE.TorusGeometry(0.06, 0.009, 6, 16, Math.PI), mat("#2d4a26", 0.6), false);
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.05, 0.48);
  head.add(smile);

  // Four flippers on pivots under the shell's edge; the front ones big, like wings.
  const flipperGeo = new THREE.SphereGeometry(0.5, 18, 10);
  flipperGeo.scale(1, 0.14, 0.42);
  flipperGeo.translate(0.45, 0, 0);
  const flippers: { pivot: THREE.Group; side: number; front: boolean }[] = [];
  for (const front of [true, false]) {
    for (const side of [1, -1]) {
      const pivot = new THREE.Group();
      pivot.position.set(side * (front ? 0.58 : 0.52), 0.1, front ? 0.5 : -0.58);
      const flipper = solid(flipperGeo, skin);
      flipper.scale.set(side * (front ? 0.72 : 0.42), 1, front ? 0.78 : 0.62);
      pivot.add(flipper);
      group.add(pivot);
      flippers.push({ pivot, side, front });
    }
  }
  const tail = solid(new THREE.ConeGeometry(0.07, 0.2, 10), skin);
  tail.rotation.x = -Math.PI / 2 - 0.3;
  tail.position.set(0, 0.1, -TURTLE_HALF_LENGTH - 0.05);
  group.add(tail);

  return {
    group,
    /**
     * stride: how far through its steps it is (rad), walking: how much it walks (0..1),
     * swimming: how much it is in the water (0..1), time for breathing, looking about and blinking.
     */
    move(stride: number, walking: number, swimming: number, time: number) {
      for (const { pivot, side, front } of flippers) {
        // On land the diagonal flippers step together: forwards in the air, back on the ground.
        const s = Math.sin(stride + (front === side > 0 ? 0 : Math.PI));
        const step = s * 0.45 * walking;
        const lift = Math.max(0, Math.cos(stride + (front === side > 0 ? 0 : Math.PI))) * 0.35 * walking;
        // In the water the front flippers beat like wings, the back ones steer.
        const beat = Math.sin(time * 2.4 + (front ? 0 : 1.2)) * swimming * (front ? 0.55 : 0.2);
        const rest = front ? -0.45 : 0.65;
        pivot.rotation.set(
          0,
          side * (rest - step) + side * Math.cos(time * 2.4) * 0.25 * swimming * (front ? 1 : 0),
          side * (lift + beat - 0.1 * (1 - swimming)),
        );
      }
      head.rotation.set(-0.08 + Math.sin(time * 1.3) * 0.04 - walking * 0.1, Math.sin(time * 0.45) * 0.25 * (1 - walking), 0);
      head.position.z = TURTLE_HALF_LENGTH - 0.02 + walking * Math.sin(stride * 2) * 0.02;
      const blink = time % 4.3 < 0.13 ? 0.15 : 1;
      for (const eye of eyes) eye.scale.y = blink;
    },
  };
}

/** Half the length of the double paddle, from the middle to the tip of a blade. */
export const PADDLE_REACH = 1.45;

/** A double paddle: the shaft along y with a blade at each end, the blades facing ±z. */
export function makePaddle() {
  const group = new THREE.Group();
  const wood = mat("#c98d52", 0.6);
  group.add(solid(new THREE.CylinderGeometry(0.025, 0.025, PADDLE_REACH * 2 - 0.3, 8), wood));
  const bladeGeo = new THREE.SphereGeometry(0.15, 16, 10);
  bladeGeo.scale(0.85, 1.6, 0.16);
  for (const end of [1, -1]) {
    const blade = solid(bladeGeo, mat("#e0a464", 0.6));
    blade.position.y = end * (PADDLE_REACH - 0.24);
    group.add(blade);
  }
  return group;
}

/**
 * A little cartoon scorpion, about 0.4 m long, looking along +z: round body,
 * two claws and the tail curled up over its back. `walk(t)` wiggles its legs.
 */
export function makeScorpion(color = "#e2683c") {
  const group = new THREE.Group();
  const shell = mat(color, 0.45, { metalness: 0.1 });
  const dark = mat("#7a2e17", 0.5);
  const body = solid(new THREE.SphereGeometry(0.1, 16, 12), shell);
  body.scale.set(1, 0.55, 1.3);
  body.position.y = 0.06;
  group.add(body);
  const head = solid(new THREE.SphereGeometry(0.07, 14, 10), shell);
  head.scale.set(1.1, 0.7, 0.9);
  head.position.set(0, 0.07, 0.12);
  group.add(head);
  const eyeWhite = mat("#ffffff", 0.3);
  const pupil = mat("#1b1210", 0.2);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.026, 10, 8), eyeWhite, false);
    eye.position.set(0.03 * side, 0.12, 0.15);
    group.add(eye);
    const dot = solid(new THREE.SphereGeometry(0.013, 8, 6), pupil, false);
    dot.position.set(0.032 * side, 0.125, 0.172);
    group.add(dot);
    // A claw on a short arm.
    const arm = solid(new THREE.CapsuleGeometry(0.018, 0.1, 4, 8), shell);
    arm.rotation.set(Math.PI / 2, 0, -0.5 * side);
    arm.position.set(0.08 * side, 0.05, 0.2);
    group.add(arm);
    for (const k of [1, -1]) {
      const pincer = solid(new THREE.ConeGeometry(0.025, 0.08, 8), dark);
      pincer.rotation.set(Math.PI / 2, 0, 0.35 * k);
      pincer.position.set(0.12 * side + 0.015 * k, 0.05, 0.29);
      group.add(pincer);
    }
  }
  const legs: THREE.Mesh[] = [];
  for (const side of [1, -1]) {
    for (let i = 0; i < 3; i++) {
      const leg = solid(new THREE.CapsuleGeometry(0.01, 0.08, 4, 6), dark, false);
      leg.rotation.z = (Math.PI / 2 - 0.5) * side;
      leg.position.set(0.1 * side, 0.03, -0.05 + i * 0.06);
      group.add(leg);
      legs.push(leg);
    }
  }
  // The tail: beads curling up over the back, with a little sting.
  const curl = [
    [0, 0.07, -0.14],
    [0, 0.12, -0.21],
    [0, 0.2, -0.23],
    [0, 0.27, -0.19],
    [0, 0.3, -0.12],
  ];
  for (const [i, [x, y, z]] of curl.entries()) {
    const bead = solid(new THREE.SphereGeometry(0.045 - i * 0.005, 12, 8), shell);
    bead.position.set(x, y, z);
    group.add(bead);
  }
  const sting = solid(new THREE.ConeGeometry(0.02, 0.06, 8), dark);
  sting.position.set(0, 0.28, -0.07);
  sting.rotation.x = 2.2;
  group.add(sting);
  return {
    group,
    walk(t: number) {
      legs.forEach((leg, i) => (leg.rotation.x = Math.sin(t * 22 + i * 1.7) * 0.5));
    },
  };
}

/**
 * A cheeky monkey sitting in a palm, about 0.7 m tall, looking along +z.
 * `pose(throwK, cheer, t)`: throwK 0..1 swings the right arm from behind the
 * head forward to throw; cheer bounces and waves both arms.
 */
export function makeMonkey() {
  const group = new THREE.Group();
  const furMat = mat("#7a4a2a", 0.85);
  const face = mat("#f0c9a0", 0.7);
  const body = solid(new THREE.SphereGeometry(0.2, 18, 14), furMat);
  body.scale.set(1, 1.2, 0.9);
  body.position.y = 0.25;
  group.add(body);
  const belly = solid(new THREE.SphereGeometry(0.14, 16, 12), face, false);
  belly.scale.set(1, 1.2, 0.6);
  belly.position.set(0, 0.23, 0.1);
  group.add(belly);
  const head = new THREE.Group();
  head.position.y = 0.56;
  group.add(head);
  head.add(solid(new THREE.SphereGeometry(0.17, 18, 14), furMat));
  const mask = solid(new THREE.SphereGeometry(0.13, 16, 12), face);
  mask.scale.set(1.1, 0.9, 0.7);
  mask.position.set(0, -0.02, 0.08);
  head.add(mask);
  const eye = mat("#1b1210", 0.2);
  for (const side of [1, -1]) {
    const e = solid(new THREE.SphereGeometry(0.025, 10, 8), eye, false);
    e.position.set(0.05 * side, 0.03, 0.16);
    head.add(e);
    const ear = solid(new THREE.SphereGeometry(0.06, 12, 8), face);
    ear.scale.set(1, 1, 0.4);
    ear.position.set(0.17 * side, 0.02, 0);
    head.add(ear);
  }
  const grin = solid(new THREE.TorusGeometry(0.045, 0.01, 6, 16, Math.PI), mat("#5a2a1a"), false);
  grin.rotation.z = Math.PI;
  grin.position.set(0, -0.05, 0.17);
  head.add(grin);
  const arms: THREE.Group[] = [];
  for (const side of [1, -1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(0.18 * side, 0.36, 0);
    const arm = solid(new THREE.CapsuleGeometry(0.045, 0.32, 4, 8), furMat);
    arm.position.y = -0.18;
    shoulder.add(arm);
    const hand = solid(new THREE.SphereGeometry(0.05, 10, 8), face);
    hand.position.y = -0.38;
    shoulder.add(hand);
    group.add(shoulder);
    arms.push(shoulder);
  }
  const tail = solid(new THREE.TorusGeometry(0.16, 0.025, 6, 20, Math.PI * 1.4), furMat);
  tail.position.set(0, 0.15, -0.22);
  tail.rotation.y = Math.PI / 2;
  group.add(tail);
  const right = arms[1];
  return {
    group,
    /** Where a thrown nut leaves the right hand. */
    hand: right.children[1] as THREE.Object3D,
    pose(throwK: number, cheer: number, t: number) {
      // Right arm: from hanging, up and back behind the head, then fast forward over the top.
      const wind = Math.sin(Math.min(1, throwK / 0.6) * Math.PI * 0.5);
      const release = Math.sin(Math.max(0, (throwK - 0.6) / 0.4) * Math.PI * 0.5);
      right.rotation.x = throwK > 0 && throwK < 1 ? -3.5 * wind + 1.9 * release : 0;
      arms[0].rotation.z = 0.4 + cheer * (1.6 + Math.sin(t * 12) * 0.3);
      right.rotation.z = -0.4 - cheer * (1.6 + Math.sin(t * 12 + 1) * 0.3);
      group.position.y = Math.abs(Math.sin(t * 6)) * 0.08 * cheer;
      head.rotation.z = Math.sin(t * 3) * 0.1;
    },
  };
}

/** A big golden key, about 0.45 m long, along +z (bit at the far end). */
export function makeKey() {
  const group = new THREE.Group();
  const gold = mat("#ffcc33", 0.25, { metalness: 0.9, emissive: "#7a5600", emissiveIntensity: 0.35 });
  // The ring stands upright along the shaft, like a real key's bow, so a turn of the key shows.
  const bow = solid(new THREE.TorusGeometry(0.07, 0.022, 10, 24), gold);
  bow.rotation.y = Math.PI / 2;
  bow.position.z = -0.12 - 0.07;
  group.add(bow);
  const shaft = solid(new THREE.CylinderGeometry(0.02, 0.02, 0.32, 10), gold);
  shaft.rotation.x = Math.PI / 2;
  shaft.position.z = 0.08;
  group.add(shaft);
  for (const z of [0.18, 0.23]) {
    const tooth = solid(new THREE.BoxGeometry(0.02, 0.07, 0.035), gold);
    tooth.position.set(0, -0.04, z);
    group.add(tooth);
  }
  return group;
}

/** A woven basket, open at the top; `fill` stacks things inside. */
export function makeBasket() {
  const group = new THREE.Group();
  const weave = mat("#c48a4a", 0.95);
  const wall = solid(
    new THREE.CylinderGeometry(0.32, 0.24, 0.28, 20, 1, true),
    new THREE.MeshStandardMaterial({ color: "#c48a4a", roughness: 0.95, side: THREE.DoubleSide }),
  );
  wall.position.y = 0.14;
  group.add(wall);
  const bottom = solid(new THREE.CircleGeometry(0.24, 20), weave);
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0.01;
  group.add(bottom);
  const rim = solid(new THREE.TorusGeometry(0.32, 0.025, 6, 24), mat("#a06a33", 0.9));
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.28;
  group.add(rim);
  return group;
}

/** A treasure chest; `open(k)` lifts the lid, `glow` is the light inside. */
export function makeChest() {
  const group = new THREE.Group();
  const wood = mat("#9a5b2e", 0.7);
  const gold = mat("#ffcc33", 0.3, { metalness: 0.9, emissive: "#6b4a00", emissiveIntensity: 0.3 });
  const body = solid(new THREE.BoxGeometry(1.2, 0.65, 0.8), wood);
  body.position.y = 0.33;
  group.add(body);
  for (const x of [-0.45, 0.45]) {
    const band = solid(new THREE.BoxGeometry(0.1, 0.67, 0.82), gold);
    band.position.set(x, 0.33, 0);
    group.add(band);
  }
  const lid = new THREE.Group();
  lid.position.set(0, 0.65, -0.4);
  group.add(lid);
  const lidGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 24, 1, false, 0, Math.PI);
  lidGeo.rotateZ(Math.PI / 2);
  lidGeo.rotateX(Math.PI / 2);
  const lidMesh = solid(lidGeo, wood);
  lidMesh.position.z = 0.4;
  lidMesh.rotation.x = -Math.PI / 2;
  lid.add(lidMesh);
  for (const x of [-0.45, 0.45]) {
    const bandGeo = new THREE.CylinderGeometry(0.41, 0.41, 0.1, 24, 1, false, 0, Math.PI);
    bandGeo.rotateZ(Math.PI / 2);
    bandGeo.rotateX(Math.PI / 2);
    const band = solid(bandGeo, gold);
    band.position.set(x, 0, 0.4);
    band.rotation.x = -Math.PI / 2;
    lid.add(band);
  }
  const lock = solid(new THREE.BoxGeometry(0.18, 0.22, 0.08), gold);
  lock.position.set(0, 0.55, 0.42);
  group.add(lock);
  const coins = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), gold);
  coins.scale.set(1.1, 0.35, 0.7);
  coins.position.y = 0.6;
  group.add(coins);
  const glow = new THREE.PointLight("#ffd36b", 0, 6, 1.5);
  glow.position.set(0, 1.2, 0.2);
  group.add(glow);
  return {
    group,
    open(k: number) {
      lid.rotation.x = -k * 1.9;
      glow.intensity = k * 18;
      (coins.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + k * 0.9;
    },
  };
}

/** Kiki the parrot; `flap(time, flying)` moves the wings. */
export function makeParrot() {
  const group = new THREE.Group();
  const red = new THREE.MeshPhysicalMaterial({ color: "#e83b2f", roughness: 0.5, sheen: 0.6, sheenColor: new THREE.Color("#ffb0a0") });
  const blue = mat("#2f6fe8", 0.5);
  const yellow = mat("#ffcf33", 0.5);
  const body = solid(new THREE.SphereGeometry(0.16, 20, 16), red);
  body.scale.set(0.9, 1.25, 1);
  body.rotation.x = 0.4;
  group.add(body);
  const head = solid(new THREE.SphereGeometry(0.12, 20, 16), red);
  head.position.set(0, 0.2, 0.07);
  group.add(head);
  const face = solid(new THREE.SphereGeometry(0.08, 16, 12), mat("#fff7ee", 0.6));
  face.position.set(0, 0.21, 0.13);
  face.scale.set(1.1, 0.8, 0.6);
  group.add(face);
  const beakGeo = new THREE.ConeGeometry(0.05, 0.12, 12);
  beakGeo.rotateX(Math.PI / 2 + 0.6);
  const beak = solid(beakGeo, mat("#3a2b22", 0.4));
  beak.position.set(0, 0.17, 0.2);
  group.add(beak);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.022, 10, 8), mat("#111111", 0.2), false);
    eye.position.set(0.06 * side, 0.24, 0.15);
    group.add(eye);
  }
  const wings: THREE.Group[] = [];
  for (const side of [1, -1]) {
    const pivot = new THREE.Group();
    pivot.position.set(0.12 * side, 0.08, 0);
    const wingGeo = new THREE.SphereGeometry(0.16, 16, 10);
    wingGeo.scale(0.35, 1.1, 0.7);
    wingGeo.translate(0, -0.1, -0.02);
    const wing = solid(wingGeo, blue);
    pivot.add(wing);
    const tip = solid(new THREE.SphereGeometry(0.08, 12, 8), yellow);
    tip.scale.set(0.4, 1, 0.6);
    tip.position.set(0, -0.24, -0.04);
    pivot.add(tip);
    group.add(pivot);
    wings.push(pivot);
  }
  for (let i = 0; i < 3; i++) {
    const featherGeo = new THREE.BoxGeometry(0.05, 0.32, 0.02);
    featherGeo.translate(0, -0.16, 0);
    const feather = solid(featherGeo, [red, blue, yellow][i]);
    feather.position.set((i - 1) * 0.04, -0.12, -0.12);
    feather.rotation.set(-0.5, 0, (i - 1) * 0.25);
    group.add(feather);
  }
  return {
    group,
    flap(time: number, flying: boolean) {
      const a = flying ? Math.sin(time * 16) * 1.1 + 0.6 : Math.sin(time * 2) * 0.05;
      wings[0].rotation.z = a;
      wings[1].rotation.z = -a;
      head.rotation.y = flying ? 0 : Math.sin(time * 0.9) * 0.5;
    },
  };
}

/** A small red crab; `dance(time)` waves its claws. */
export function makeCrab() {
  const group = new THREE.Group();
  const shell = mat("#f0503c", 0.5);
  const body = solid(new THREE.SphereGeometry(0.22, 20, 14), shell);
  body.scale.set(1.3, 0.6, 1);
  body.position.y = 0.18;
  group.add(body);
  for (const side of [1, -1]) {
    const stalk = solid(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 6), shell, false);
    stalk.position.set(0.07 * side, 0.34, 0.1);
    group.add(stalk);
    const eye = solid(new THREE.SphereGeometry(0.04, 10, 8), mat("#ffffff", 0.3), false);
    eye.position.set(0.07 * side, 0.42, 0.1);
    group.add(eye);
    const pupil = solid(new THREE.SphereGeometry(0.02, 8, 6), mat("#111111", 0.2), false);
    pupil.position.set(0.07 * side, 0.42, 0.135);
    group.add(pupil);
    for (let l = 0; l < 3; l++) {
      const leg = solid(new THREE.CylinderGeometry(0.02, 0.015, 0.22, 6), shell);
      leg.position.set(0.3 * side, 0.1, -0.08 + l * 0.08);
      leg.rotation.z = 0.9 * side;
      group.add(leg);
    }
  }
  const claws: THREE.Group[] = [];
  for (const side of [1, -1]) {
    const arm = new THREE.Group();
    arm.position.set(0.25 * side, 0.22, 0.12);
    const claw = solid(new THREE.SphereGeometry(0.1, 14, 10), shell);
    claw.scale.set(1, 0.7, 0.6);
    claw.position.set(0.08 * side, 0.12, 0.05);
    arm.add(claw);
    group.add(arm);
    claws.push(arm);
  }
  return {
    group,
    dance(time: number, amount: number) {
      claws[0].rotation.z = (0.3 + Math.sin(time * 8) * 0.6) * amount;
      claws[1].rotation.z = -(0.3 + Math.sin(time * 8 + 1) * 0.6) * amount;
      group.position.y = Math.abs(Math.sin(time * 8)) * 0.06 * amount;
      group.rotation.y = Math.sin(time * 4) * 0.4 * amount;
    },
  };
}

/** Colourful confetti and glitter; `burst(origin)` throws a handful, `update(dt)` moves them. */
export function makeConfetti(count: number, colors = ["#ff5d73", "#ffd23f", "#3ec1d3", "#7bd389", "#b388ff", "#ff9f43"], size = 1) {
  const geometry = new THREE.PlaneGeometry(0.08 * size, 0.12 * size);
  const material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.5, emissive: "#ffffff", emissiveIntensity: 0.15 });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  const rnd = seeded(7);
  const items = Array.from({ length: count }, (_, i) => ({
    p: new THREE.Vector3(0, -100, 0),
    v: new THREE.Vector3(),
    spin: new THREE.Vector3(rnd() * 8, rnd() * 8, rnd() * 8),
    r: new THREE.Euler(),
    life: 0,
    color: colors[i % colors.length],
  }));
  items.forEach((it, i) => mesh.setColorAt(i, new THREE.Color(it.color)));
  let next = 0;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  return {
    mesh,
    /** Throws `amount` pieces up from `origin`; `round` throws them out in all directions, like a firework. */
    burst(origin: THREE.Vector3, amount: number, power = 4, round = false) {
      for (let i = 0; i < amount; i++) {
        const it = items[next];
        next = (next + 1) % count;
        it.p.copy(origin);
        const a = rnd() * Math.PI * 2;
        if (round) {
          const y = rnd() * 2 - 1;
          const r = Math.sqrt(1 - y * y) * power * (0.8 + rnd() * 0.2);
          it.v.set(Math.cos(a) * r, y * power + power * 0.2, Math.sin(a) * r);
          it.life = 4;
          continue;
        }
        const up = 0.6 + rnd() * 0.8;
        it.v.set(Math.cos(a) * power * 0.4 * rnd(), power * up, Math.sin(a) * power * 0.4 * rnd());
        it.life = 4;
      }
    },
    update(dt: number) {
      items.forEach((it, i) => {
        if (it.life > 0) {
          it.life -= dt;
          it.v.y -= 3.5 * dt;
          it.v.multiplyScalar(1 - 1.2 * dt);
          it.p.addScaledVector(it.v, dt);
          it.r.set(it.r.x + it.spin.x * dt, it.r.y + it.spin.y * dt, it.r.z + it.spin.z * dt);
          if (it.life <= 0) it.p.y = -100;
        }
        m.compose(it.p, q.setFromEuler(it.r), one);
        mesh.setMatrixAt(i, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/** Round puffy clouds. */
export function makeCloud(seed: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, emissive: "#ffffff", emissiveIntensity: 0.25 });
  const puffs = 5 + Math.floor(rnd() * 3);
  for (let i = 0; i < puffs; i++) {
    const r = 3 + rnd() * 3;
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 2), white);
    puff.position.set((i - puffs / 2) * 3.2 + rnd() * 2, rnd() * 2, rnd() * 3);
    puff.scale.y = 0.7;
    group.add(puff);
  }
  return group;
}
