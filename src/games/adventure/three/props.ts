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
    let look = looks.get(key);
    if (!look) looks.set(key, (look = { mesh: o, parts: [] }));
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

/** A big flower with a stem; `open(k)` unfolds the petals, 0 is a closed bud. */
export function makeFlower(height: number, color: string, seed: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const stem = solid(new THREE.CylinderGeometry(0.05, 0.08, height, 10), mat("#4c9a3a"));
  stem.position.y = height / 2;
  group.add(stem);
  for (const side of [1, -1]) {
    const leafGeo = new THREE.SphereGeometry(0.3, 16, 10);
    leafGeo.scale(1, 0.12, 0.45);
    const leaf = solid(leafGeo, mat("#5bb04a"));
    leaf.position.set(0.25 * side, height * (0.3 + rnd() * 0.2), 0);
    leaf.rotation.z = -0.5 * side;
    group.add(leaf);
  }
  const head = new THREE.Group();
  head.position.y = height;
  group.add(head);
  const heart = solid(new THREE.SphereGeometry(0.17, 20, 14), mat("#ffd23f", 0.5, { emissive: "#ffb000", emissiveIntensity: 0 }));
  heart.scale.y = 0.7;
  head.add(heart);
  const petals: THREE.Group[] = [];
  const petalMat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, sheen: 1, sheenColor: new THREE.Color("#ffffff"), side: THREE.DoubleSide });
  const count = 6;
  for (let i = 0; i < count; i++) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / count) * Math.PI * 2;
    const petalGeo = new THREE.SphereGeometry(0.32, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    petalGeo.scale(0.55, 1, 0.2);
    petalGeo.translate(0, 0, 0);
    const petal = solid(petalGeo, petalMat);
    petal.position.z = 0.12;
    petal.rotation.x = 0.1;
    pivot.add(petal);
    head.add(pivot);
    petals.push(pivot);
  }
  const heartMat = heart.material as THREE.MeshStandardMaterial;
  return {
    group,
    open(k: number) {
      for (const p of petals) p.rotation.x = 1.45 * k + 0.05;
      // Closed petals fold up over the heart.
      for (const p of petals) p.children[0].rotation.x = 0.1 - (1 - k) * 0.1;
      head.scale.setScalar(0.75 + k * 0.25);
      heartMat.emissiveIntensity = k * 0.6;
    },
  };
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

/** A wooden canoe pointing along -z. */
export function makeCanoe() {
  const group = new THREE.Group();
  const wood = mat("#b5753f", 0.6);
  const woodDark = mat("#8a522a", 0.7);
  const hullGeo = new THREE.SphereGeometry(1, 40, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  hullGeo.scale(0.62, 0.5, 2.3);
  const hull = solid(hullGeo, new THREE.MeshStandardMaterial({ color: "#b5753f", roughness: 0.6, side: THREE.DoubleSide }));
  hull.position.y = 0.42;
  group.add(hull);
  const rimGeo = new THREE.TorusGeometry(1, 0.05, 8, 48);
  rimGeo.rotateX(Math.PI / 2);
  rimGeo.scale(0.62, 1, 2.3);
  const rim = solid(rimGeo, woodDark);
  rim.position.y = 0.42;
  group.add(rim);
  const seat = solid(new THREE.BoxGeometry(1.1, 0.06, 0.3), wood);
  seat.position.set(0, 0.32, 0.5);
  group.add(seat);
  // A little flag at the back.
  const pole = solid(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 6), woodDark);
  pole.position.set(0, 0.85, 2.0);
  group.add(pole);
  const flag = solid(new THREE.PlaneGeometry(0.45, 0.3), new THREE.MeshStandardMaterial({ color: "#e8423f", side: THREE.DoubleSide }));
  flag.position.set(0.23, 1.25, 2.0);
  group.add(flag);
  return group;
}

/** A paddle: shaft along y, blade at the bottom. */
export function makePaddle() {
  const group = new THREE.Group();
  const shaft = solid(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 8), mat("#c98d52", 0.6));
  group.add(shaft);
  const bladeGeo = new THREE.SphereGeometry(0.16, 16, 10);
  bladeGeo.scale(0.9, 1.9, 0.18);
  const blade = solid(bladeGeo, mat("#e0a464", 0.6));
  blade.position.y = -0.75;
  group.add(blade);
  const grip = solid(new THREE.SphereGeometry(0.05, 10, 8), mat("#c98d52", 0.6));
  grip.position.y = 0.66;
  group.add(grip);
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
    burst(origin: THREE.Vector3, amount: number, power = 4) {
      for (let i = 0; i < amount; i++) {
        const it = items[next];
        next = (next + 1) % count;
        it.p.copy(origin);
        const a = rnd() * Math.PI * 2;
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
