import * as THREE from "three";
import { makeBush, mat, seeded, solid } from "../../three/props";
import { groundHeight, PUFF_RADIUS, RAINBOW_BAND, RAINBOW_COLORS, RAINBOW_RADIUS, SUN_RADIUS, TAU, WOLLE_REST, WOLLE_TOP } from "./layout";

// The props of „Die Wolkenreise“, modelled from simple shapes like the rest:
// Wolle the little cloud, toy planes, balloons, stars, the sun with a face,
// the grey puffs of the rain cloud, rain, the rainbow and the meadow at home.

/**
 * Wolle, the little cloud Tapsi rides on: a flat round top to stand and sit on, smaller puffs round
 * its sides kept below the top (so they never hide Tapsi's feet), and a face at the front (+z).
 * `squash(k)` presses it flat a little, e.g. when Tapsi lands on it.
 */
export function makeWolle() {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const white = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, emissive: "#e8f0ff", emissiveIntensity: 0.3 });
  const top = solid(new THREE.IcosahedronGeometry(1, 4), white);
  top.scale.set(0.85, WOLLE_TOP, 0.8);
  body.add(top);
  // x, y, z, radius; the belly puff reaches down to the grass when Wolle lies on the meadow.
  const puffs: [number, number, number, number][] = [
    [0.7, -0.08, 0.12, 0.38],
    [-0.7, -0.08, 0.12, 0.38],
    [0.45, -0.12, -0.55, 0.36],
    [-0.45, -0.12, -0.55, 0.36],
    [0, -0.14, -0.7, 0.34],
    [0.5, -0.16, 0.52, 0.3],
    [-0.5, -0.16, 0.52, 0.3],
    [0, -WOLLE_REST + 0.42, 0, 0.42],
  ];
  for (const [x, y, z, r] of puffs) {
    const puff = solid(new THREE.IcosahedronGeometry(r, 3), white);
    puff.position.set(x, y, z);
    body.add(puff);
  }
  const dark = mat("#2b2f3a", 0.3);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.065, 16, 12), dark, false);
    eye.position.set(0.2 * side, 0.08, 0.75);
    eye.scale.z = 0.5;
    body.add(eye);
    const shine = solid(new THREE.SphereGeometry(0.02, 8, 6), mat("#ffffff", 0.3), false);
    shine.position.set(0.2 * side + 0.02, 0.1, 0.785);
    body.add(shine);
    const cheek = solid(new THREE.SphereGeometry(0.075, 14, 10), mat("#ffb3c1", 0.9), false);
    cheek.position.set(0.34 * side, -0.04, 0.68);
    cheek.scale.set(1, 0.6, 0.4);
    body.add(cheek);
  }
  // The lower half of a ring is a smile.
  const smile = solid(new THREE.TorusGeometry(0.1, 0.02, 8, 20, Math.PI), dark, false);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.02, 0.77);
  body.add(smile);
  return {
    group,
    squash(k: number) {
      body.scale.set(1 + k * 0.08, 1 - k * 0.14, 1 + k * 0.08);
    },
  };
}

/** A little toy plane, its nose to +z; `spin(time)` turns the propeller. */
export function makePlane(color: string) {
  const group = new THREE.Group();
  const paint = mat(color, 0.45);
  const yellow = mat("#ffd23f", 0.5);
  const bodyGeo = new THREE.CapsuleGeometry(0.11, 0.5, 6, 14);
  bodyGeo.rotateX(Math.PI / 2);
  group.add(solid(bodyGeo, paint));
  const wing = solid(new THREE.BoxGeometry(0.95, 0.035, 0.2), yellow);
  wing.position.set(0, -0.02, 0.04);
  group.add(wing);
  const tail = solid(new THREE.BoxGeometry(0.34, 0.03, 0.1), yellow);
  tail.position.set(0, 0.02, -0.3);
  group.add(tail);
  const fin = solid(new THREE.BoxGeometry(0.03, 0.15, 0.12), paint);
  fin.position.set(0, 0.1, -0.31);
  group.add(fin);
  const window = solid(new THREE.SphereGeometry(0.065, 14, 10), mat("#bfe6ff", 0.15), false);
  window.scale.set(1, 0.8, 1.4);
  window.position.set(0, 0.08, 0.12);
  group.add(window);
  const nose = solid(new THREE.SphereGeometry(0.06, 12, 10), mat("#ffffff", 0.4), false);
  nose.position.z = 0.37;
  group.add(nose);
  const prop = new THREE.Group();
  prop.position.z = 0.42;
  prop.add(solid(new THREE.BoxGeometry(0.36, 0.045, 0.012), mat("#3a3a3a", 0.5), false));
  group.add(prop);
  return {
    group,
    spin(time: number) {
      prop.rotation.z = time * 40;
    },
  };
}

/** How big a balloon is (its radius across). */
export const BALLOON_RADIUS = 0.2;

/** A shiny balloon on a string. */
export function makeBalloon(color: string) {
  const group = new THREE.Group();
  const skin = new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 0.8 });
  const ball = solid(new THREE.SphereGeometry(BALLOON_RADIUS, 24, 18), skin);
  ball.scale.y = 1.15;
  group.add(ball);
  const knot = solid(new THREE.ConeGeometry(0.035, 0.05, 10), skin, false);
  knot.position.y = -BALLOON_RADIUS * 1.15 - 0.015;
  group.add(knot);
  const string = solid(new THREE.CylinderGeometry(0.004, 0.004, 0.5, 4), mat("#ffffff", 0.8), false);
  string.position.y = -BALLOON_RADIUS * 1.15 - 0.29;
  group.add(string);
  return group;
}

/** A golden star that glows a little. */
export function makeStar() {
  const shape = new THREE.Shape();
  for (let i = 0; i <= 10; i++) {
    const a = Math.PI / 2 + (i / 10) * TAU;
    const r = i % 2 === 0 ? 0.2 : 0.085;
    if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 2 });
  geometry.center();
  return solid(geometry, mat("#ffd23f", 0.35, { emissive: "#ffb800", emissiveIntensity: 0.55 }), false);
}

/**
 * The sun with a face looking to +z, and beams round it. `set(light, happy)`: how bright it shines
 * through (0 hidden and pale, 1 bright) and how much it laughs (0 sad, 1 happy).
 */
export function makeSun() {
  const group = new THREE.Group();
  const yellow = new THREE.MeshBasicMaterial({ color: "#ffd84a", fog: false });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(SUN_RADIUS, 32, 24), yellow));
  const ink = new THREE.MeshBasicMaterial({ color: "#7a4a12", fog: false });
  const face = new THREE.Group();
  face.position.z = SUN_RADIUS * 0.92;
  group.add(face);
  for (const side of [1, -1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), ink);
    eye.position.set(0.95 * side, 0.55, 0.3);
    eye.scale.z = 0.4;
    face.add(eye);
    const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), new THREE.MeshBasicMaterial({ color: "#ff9d5c", fog: false }));
    cheek.position.set(1.55 * side, -0.35, 0.1);
    cheek.scale.set(1, 0.6, 0.3);
    face.add(cheek);
  }
  // The upper half of a ring is a sad mouth, the lower half a laugh.
  const sad = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 8, 24, Math.PI), ink);
  sad.position.set(0, -1.1, 0.35);
  face.add(sad);
  const happy = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.13, 8, 24, Math.PI), ink);
  happy.rotation.z = Math.PI;
  happy.position.set(0, -0.4, 0.35);
  face.add(happy);
  const beams = new THREE.Group();
  const beamMat = new THREE.MeshBasicMaterial({ color: "#ffe680", fog: false, transparent: true });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.6, 4), beamMat);
    beam.position.set(Math.cos(a) * (SUN_RADIUS + 1.1), Math.sin(a) * (SUN_RADIUS + 1.1), -0.4);
    beam.rotation.z = a - Math.PI / 2;
    beams.add(beam);
  }
  group.add(beams);
  const pale = new THREE.Color("#b9b6a6");
  const bright = new THREE.Color("#ffd84a");
  return {
    group,
    beams,
    set(light: number, joy: number) {
      yellow.color.copy(pale).lerp(bright, light);
      beamMat.opacity = light;
      beams.visible = light > 0.01;
      sad.visible = joy < 0.5;
      happy.visible = joy >= 0.5;
    },
  };
}

/**
 * A grey puff that hangs down from the rain cloud and is pushed away: a few round balls, the lowest
 * one's bottom PUFF_RADIUS below its middle. It has its own material, to turn white and fade.
 */
export function makePuff(seed: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: "#8a929c", roughness: 1, transparent: true, emissive: "#ffffff", emissiveIntensity: 0 });
  const r = PUFF_RADIUS;
  const balls: [number, number, number, number][] = [
    [0, 0, 0, r],
    [0.55 * r, -0.15 * r, 0.1 * r, 0.7 * r],
    [-0.55 * r, -0.15 * r, 0.1 * r, 0.7 * r],
    [0.1 * r, 0.35 * r, -0.3 * r, 0.75 * r],
  ];
  for (const [x, y, z, size] of balls) {
    const ball = solid(new THREE.IcosahedronGeometry(size * (0.95 + rnd() * 0.1), 3), material, false);
    ball.position.set(x, y, z);
    group.add(ball);
  }
  return { group, material };
}

/** Big dark puffs of the rain cloud in front of the sun; one material, so they all turn white together. */
export function makeRainCloud(seed: number, places: [number, number, number, number][]) {
  const rnd = seeded(seed);
  const material = new THREE.MeshStandardMaterial({ color: "#6f7884", roughness: 1, emissive: "#ffffff", emissiveIntensity: 0 });
  const puffs = places.map(([x, y, z, r]) => {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(r * (0.9 + rnd() * 0.2), 3), material);
    puff.position.set(x, y, z);
    puff.scale.y = 0.75;
    return puff;
  });
  return { puffs, material };
}

/**
 * Rain: falling streaks in a box round its middle (move `mesh`), leaving out a column in the middle
 * where Tapsi stands, so no drop falls through the fox. `update(time, amount)`: how much it rains, 0..1.
 */
export function makeRain(count: number) {
  const rnd = seeded(31);
  const HEIGHT = 9;
  const drops = Array.from({ length: count }, () => {
    let x = 0;
    let z = 0;
    while (Math.abs(x) < 1.3 && Math.abs(z) < 1.3) {
      x = (rnd() - 0.5) * 14;
      z = (rnd() - 0.5) * 12 - 1;
    }
    return { x, z, phase: rnd() };
  });
  const positions = new Float32Array(count * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mesh = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ color: "#c4d2e2", transparent: true, opacity: 0.7 }));
  mesh.frustumCulled = false;
  return {
    mesh,
    update(time: number, amount: number) {
      const shown = Math.round(count * amount);
      mesh.visible = shown > 0;
      geometry.setDrawRange(0, shown * 2);
      drops.forEach((d, i) => {
        const y = HEIGHT - 1.5 - ((((time * 8 + d.phase * HEIGHT) % HEIGHT) + HEIGHT) % HEIGHT);
        positions.set([d.x, y, d.z, d.x, y + 0.35, d.z], i * 6);
      });
      geometry.attributes.position.needsUpdate = true;
    },
  };
}

/** Segments of each half band; a half is painted one segment after the other. */
const RAINBOW_SEGMENTS = 40;

/**
 * The rainbow, standing up in its own xy plane round its middle: six bands, each in two halves that
 * are painted from their end up to the top (`paint(band, left, right)`, 0..1 each). `edge` tells where
 * the painting is, for the sparkling tip.
 */
export function makeRainbow() {
  const group = new THREE.Group();
  const halves = RAINBOW_COLORS.map((color, n) => {
    const outer = RAINBOW_RADIUS - n * RAINBOW_BAND;
    const inner = outer - RAINBOW_BAND;
    const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.88, side: THREE.DoubleSide, depthWrite: false });
    // Left half: from the left end (angle π) up to the top; right half: from the right end (0) up to the top.
    return [Math.PI, 0].map((from) => {
      const to = Math.PI / 2;
      const points: number[] = [];
      for (let s = 0; s < RAINBOW_SEGMENTS; s++) {
        const a0 = from + ((to - from) * s) / RAINBOW_SEGMENTS;
        const a1 = from + ((to - from) * (s + 1)) / RAINBOW_SEGMENTS;
        const p = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r, 0];
        points.push(...p(inner, a0), ...p(outer, a0), ...p(outer, a1), ...p(inner, a0), ...p(outer, a1), ...p(inner, a1));
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      geometry.setDrawRange(0, 0);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.frustumCulled = false;
      group.add(mesh);
      return mesh;
    });
  });
  return {
    group,
    paint(band: number, left: number, right: number) {
      const [l, r] = halves[band];
      l.geometry.setDrawRange(0, 6 * Math.round(THREE.MathUtils.clamp(left, 0, 1) * RAINBOW_SEGMENTS));
      r.geometry.setDrawRange(0, 6 * Math.round(THREE.MathUtils.clamp(right, 0, 1) * RAINBOW_SEGMENTS));
    },
    /** Where the middle of a half band is painted up to (`left` half or not, k of the way), in the rainbow's own space. */
    edge(band: number, left: boolean, k: number, out: THREE.Vector3) {
      const r = RAINBOW_RADIUS - (band + 0.5) * RAINBOW_BAND;
      const a = left ? Math.PI - (k * Math.PI) / 2 : (k * Math.PI) / 2;
      return out.set(Math.cos(a) * r, Math.sin(a) * r, 0);
    },
  };
}

/** A round tree: a trunk and a crown of a few green balls. */
function makeTree(size: number, seed: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const trunk = solid(new THREE.CylinderGeometry(0.12 * size, 0.18 * size, 1.4 * size, 8), mat("#8a5a3b", 0.9));
  trunk.position.y = 0.7 * size;
  group.add(trunk);
  const greens = ["#4f9e3c", "#5fb547", "#3f8a33"];
  for (let i = 0; i < 3; i++) {
    const r = size * (0.6 + rnd() * 0.3);
    const ball = solid(new THREE.IcosahedronGeometry(r, 2), mat(greens[i], 0.85));
    ball.position.set((rnd() - 0.5) * size * 0.6, size * (1.6 + i * 0.35), (rnd() - 0.5) * size * 0.6);
    group.add(ball);
  }
  return group;
}

/** A small house: white walls, a red roof, a door and two windows at the front (+z). */
function makeHouse(seed: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const w = 2.4 + rnd() * 1.2;
  const walls = solid(new THREE.BoxGeometry(w, 2, 2.4), mat(["#fff6e8", "#ffe9b8", "#e8f4ff"][seed % 3], 0.9));
  walls.position.y = 1;
  group.add(walls);
  const roofGeo = new THREE.ConeGeometry(w * 0.85, 1.5, 4);
  roofGeo.rotateY(Math.PI / 4);
  roofGeo.scale(1, 1, 2.4 / w);
  const roof = solid(roofGeo, mat(["#d9493c", "#c8553d", "#b84a5a"][seed % 3], 0.8));
  roof.position.y = 2.75;
  group.add(roof);
  const door = solid(new THREE.BoxGeometry(0.55, 1, 0.05), mat("#8a5a3b", 0.8), false);
  door.position.set(0, 0.5, 1.21);
  group.add(door);
  for (const side of [1, -1]) {
    const win = solid(new THREE.BoxGeometry(0.5, 0.5, 0.05), mat("#9fd3ff", 0.3), false);
    win.position.set(side * w * 0.3, 1.25, 1.21);
    group.add(win);
  }
  return group;
}

/**
 * The meadow at home: soft hills (groundHeight), trees, bushes and a little village behind the place
 * Wolle starts from, none of them near it. Static, to be merged.
 */
export function makeMeadow() {
  const geometry = new THREE.PlaneGeometry(700, 700, 140, 140);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position;
  const colors: number[] = [];
  const light = new THREE.Color("#8fd16a");
  const deep = new THREE.Color("#5fae4a");
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i) + 40;
    pos.setY(i, groundHeight(x, z));
    pos.setZ(i, z);
    c.copy(light).lerp(deep, 0.5 + 0.5 * Math.sin(x * 0.07) * Math.sin(z * 0.09));
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const ground = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  ground.receiveShadow = true;

  const things = new THREE.Group();
  const rnd = seeded(5);
  const place = (o: THREE.Object3D, x: number, z: number) => {
    o.position.set(x, groundHeight(x, z) - 0.05, z);
    things.add(o);
  };
  for (let i = 0; i < 70; i++) {
    const x = (rnd() - 0.5) * 180;
    const z = 40 - (rnd() - 0.3) * 200;
    if (Math.hypot(x, z - 40) < 9) continue;
    place(makeTree(1 + rnd() * 0.8, i + 1), x, z);
  }
  for (let i = 0; i < 40; i++) {
    const x = (rnd() - 0.5) * 120;
    const z = 40 - (rnd() - 0.4) * 140;
    if (Math.hypot(x, z - 40) < 5) continue;
    place(makeBush(0.6 + rnd() * 0.5, 100 + i), x, z);
  }
  // The village, behind Wolle's start: seen behind Tapsi when the camera looks from the front.
  for (let i = 0; i < 7; i++) {
    const house = makeHouse(i);
    const x = (i - 3) * 6.5 + (rnd() - 0.5) * 2;
    const z = 58 + (i % 2) * 6 + rnd() * 3;
    house.rotation.y = Math.PI + (rnd() - 0.5) * 0.5;
    place(house, x, z);
  }
  return { ground, things };
}
