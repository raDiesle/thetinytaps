import * as THREE from "three";
import { makeBush, mat, mergeParts, seeded, solid } from "../../three/props";
import {
  GATE_HALF,
  GATE_OPEN,
  GATE_Z,
  HOUSE_COLORS,
  HOUSE_DEPTH,
  HOUSE_HALF,
  HOUSE_Z,
  ROBO_RADIUS,
  ROBO_TOP,
  STATION_Z,
  STREET_END,
  STREET_X,
  TAU,
  WALL_HEIGHT,
} from "./layout";

// The props of „Fire Rescue“, modelled from simple shapes like the rest: Robo the hover robot, the
// fire station with its yard, the bell and the roller gate, the street with its washing lines, the
// house with smoke at its windows (never flames), the kittens, and the hose with its water.

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const UP = new THREE.Vector3(0, 1, 0);
const FORWARD = new THREE.Vector3(0, 0, 1);

/** Where on Robo's deck the hose comes out, in Robo's own space (+z is its front, where Tapsi looks); the pump comes out there too. */
export const HOSE_OUT = new THREE.Vector3(0, ROBO_TOP, 0.5);
/** Robo's water tanks on either side of its rim, in Robo's space: how far out, how far back, their bottom, height and radius. */
const TANK_X = 0.9;
const TANK_Z = -0.08;
const TANK_BOTTOM = -0.14;
const TANK_HEIGHT = 0.5;
const TANK_RADIUS = 0.12;
/** Where the suction hose goes into the tank on Tapsi's right (Robo's -x): through its top cap, in Robo's space, so the hose
 * arches up over Robo's rim where it is seen (from the tank's foot Robo's body hid it). */
export const SUCTION_OUT = new THREE.Vector3(-TANK_X, TANK_BOTTOM + TANK_HEIGHT + 0.02, TANK_Z);
/** How long the pump's barrel is, from the hatch up to where its rod comes out. */
export const PUMP_BARREL = 0.42;

/**
 * Robo, the round hover robot Tapsi stands on: a red saucer with a white band and a flat grey deck on top,
 * a face of two glowing eyes and a smile on a dark visor at its front (+z), two blue lights on its rim, and a
 * glowing ring underneath with soft light falling to the ground. `squash(k)` presses it flat a little, e.g. when
 * Tapsi lands on it.
 */
export function makeRobo() {
  const group = new THREE.Group();
  const body = new THREE.Group();
  group.add(body);
  const red = mat("#e2412f", 0.42);
  const white = mat("#f6f4ef", 0.45);
  const grey = mat("#8d96a3", 0.85);
  const dark = mat("#1d2733", 0.22);
  const glow = new THREE.MeshStandardMaterial({ color: "#a8fbff", emissive: "#3fe0ff", emissiveIntensity: 1.3, roughness: 0.3 });
  const blue = new THREE.MeshStandardMaterial({ color: "#6fb4ff", emissive: "#2b7dff", emissiveIntensity: 1.1, roughness: 0.25 });
  const profile = [
    v2(0.001, -0.33),
    v2(0.34, -0.31),
    v2(0.62, -0.2),
    v2(0.79, -0.05),
    ROBO_RADIUS,
    v2(0.8, 0.16),
    v2(0.71, 0.25),
    v2(0.58, ROBO_TOP - 0.02),
    v2(0.001, ROBO_TOP - 0.02),
  ].map((p) => (typeof p === "number" ? v2(p, 0.05) : p));
  body.add(solid(new THREE.LatheGeometry(profile, 48), red));
  const band = solid(new THREE.TorusGeometry(ROBO_RADIUS - 0.005, 0.045, 10, 56), white);
  band.rotation.x = Math.PI / 2;
  band.position.y = 0.05;
  body.add(band);
  // The deck Tapsi stands on, with a white ring round it.
  const deck = solid(new THREE.CylinderGeometry(0.6, 0.6, 0.03, 48), grey);
  deck.position.y = ROBO_TOP - 0.015;
  body.add(deck);
  const rim = solid(new THREE.TorusGeometry(0.6, 0.025, 8, 48), white);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = ROBO_TOP - 0.005;
  body.add(rim);
  // The hatch the hose comes out of, at the front of the deck.
  const hatch = solid(new THREE.CylinderGeometry(0.07, 0.07, 0.012, 20), dark, false);
  hatch.position.set(HOSE_OUT.x, ROBO_TOP, HOSE_OUT.z);
  body.add(hatch);
  // The face: a dark visor round the front, two round glowing eyes and a smile.
  const visorGeo = new THREE.SphereGeometry(1, 28, 16);
  visorGeo.scale(0.36, 0.16, 0.1);
  const visor = solid(visorGeo, dark, false);
  visor.position.set(0, 0.03, 0.77);
  body.add(visor);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.05, 16, 12), glow, false);
    eye.scale.z = 0.45;
    eye.position.set(side * 0.13, 0.06, 0.855);
    body.add(eye);
    const light = solid(new THREE.SphereGeometry(0.07, 16, 10, 0, TAU, 0, Math.PI / 2), blue, false);
    light.position.set(side * 0.52, 0.2, 0.5);
    body.add(light);
  }
  const smile = solid(new THREE.TorusGeometry(0.06, 0.013, 6, 18, Math.PI), glow, false);
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.0, 0.86);
  body.add(smile);
  // Underneath: the glowing hover ring and a soft cone of light down to the ground.
  const ring = solid(new THREE.TorusGeometry(0.42, 0.055, 10, 40), glow, false);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.3;
  body.add(ring);
  // A glass water tank on either side of the rim, filled by the pump and emptied by the hose: the water in each is a
  // blue column of its own, stretched to the level.
  const glass = new THREE.MeshStandardMaterial({ color: "#e8f6ff", roughness: 0.1, transparent: true, opacity: 0.32, depthWrite: false });
  const waterMat = new THREE.MeshStandardMaterial({ color: "#5fc3ff", emissive: "#2b8fff", emissiveIntensity: 0.25, roughness: 0.2 });
  const levels: THREE.Mesh[] = [];
  for (const side of [1, -1]) {
    const x = side * TANK_X;
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(TANK_RADIUS, TANK_RADIUS, TANK_HEIGHT, 24, 1, true), glass);
    tank.position.set(x, TANK_BOTTOM + TANK_HEIGHT / 2, TANK_Z);
    body.add(tank);
    for (const y of [TANK_BOTTOM, TANK_BOTTOM + TANK_HEIGHT]) {
      const cap = solid(new THREE.CylinderGeometry(TANK_RADIUS + 0.015, TANK_RADIUS + 0.015, 0.04, 24), white);
      cap.position.set(x, y, TANK_Z);
      body.add(cap);
    }
    const waterGeo = new THREE.CylinderGeometry(TANK_RADIUS - 0.012, TANK_RADIUS - 0.012, 1, 20);
    waterGeo.translate(0, 0.5, 0);
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(x, TANK_BOTTOM + 0.02, TANK_Z);
    water.visible = false;
    body.add(water);
    levels.push(water);
  }
  mergeParts(body, levels);
  const beamGeo = new THREE.CylinderGeometry(0.42, 0.62, 1, 32, 1, true);
  beamGeo.translate(0, -0.5, 0);
  const beam = new THREE.Mesh(
    beamGeo,
    new THREE.MeshBasicMaterial({ color: "#7fe9ff", transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide }),
  );
  beam.position.y = -0.3;
  group.add(beam);
  return {
    group,
    /** Presses Robo flat a little (0..1). */
    squash(k: number) {
      body.scale.set(1 + k * 0.07, 1 - k * 0.14, 1 + k * 0.07);
    },
    /** Fills both water tanks up to `k` (0 empty … 1 full). */
    fill(k: number) {
      for (const water of levels) {
        water.visible = k > 0.01;
        water.scale.y = Math.max(0.001, k * (TANK_HEIGHT - 0.04));
      }
    },
    /** Lets the light under Robo reach down `height` metres, to the ground. */
    beamTo(height: number) {
      beam.visible = height > 0.05 && height < 3;
      beam.scale.y = Math.max(0.05, height - 0.3);
    },
  };
}

/** A box with the given size whose bottom stands at `y`. */
function block(w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number, shadow = true) {
  const m = solid(new THREE.BoxGeometry(w, h, d), material, shadow);
  m.position.set(x, y + h / 2, z);
  return m;
}

/** A window looking out along `normal` (+x, -x or -z): dark-blue glass in a white frame, with a sill. */
function windowOn(group: THREE.Group, at: THREE.Vector3, normal: THREE.Vector3, w: number, h: number, glass: THREE.Material, frame: THREE.Material) {
  const across = new THREE.Vector3().crossVectors(UP, normal);
  const q = new THREE.Quaternion().setFromUnitVectors(FORWARD, normal);
  const pane = solid(new THREE.BoxGeometry(w, h, 0.06), glass, false);
  pane.quaternion.copy(q);
  pane.position.copy(at).addScaledVector(normal, 0.02);
  group.add(pane);
  for (const [dx, dy, bw, bh] of [
    [0, h / 2 + 0.04, w + 0.16, 0.08],
    [0, -h / 2 - 0.05, w + 0.24, 0.1],
    [w / 2 + 0.04, 0, 0.08, h],
    [-w / 2 - 0.04, 0, 0.08, h],
    [0, 0, 0.05, h],
  ]) {
    const bar = solid(new THREE.BoxGeometry(bw, bh, 0.1), frame, false);
    bar.quaternion.copy(q);
    bar.position.copy(at).addScaledVector(across, dx).addScaledVector(UP, dy).addScaledVector(normal, 0.05);
    group.add(bar);
  }
}

/** A gable roof over a box `w` wide (x) and `d` deep (z), its eaves at `y`, ridge along `ridgeAlongX`. */
function gableRoof(w: number, d: number, rise: number, material: THREE.Material, ridgeAlongX: boolean) {
  const span = ridgeAlongX ? d : w;
  const length = ridgeAlongX ? w : d;
  const shape = new THREE.Shape([v2(-span / 2 - 0.35, -0.05), v2(span / 2 + 0.35, -0.05), v2(0, rise)]);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: length + 0.5, bevelEnabled: false });
  geometry.translate(0, 0, -(length + 0.5) / 2);
  if (ridgeAlongX) geometry.rotateY(Math.PI / 2);
  return solid(geometry, material);
}

/**
 * The fire station behind the yard: a red brick hall with three big garage doors facing the yard (-z), the middle
 * one open with the round red fire engine inside, a hose tower at its side, and the yard's walls and ground.
 */
export function makeStation() {
  const group = new THREE.Group();
  const brick = mat("#c4553f", 0.9);
  const trim = mat("#f5efe4", 0.8);
  const doorRed = mat("#d93a2b", 0.5);
  const inside = mat("#5a4a44", 0.95);
  const roofMat = mat("#5c6470", 0.8);
  const width = 15;
  const depth = 9;
  const height = 6;
  group.add(block(width, height, depth, brick, 0, 0, STATION_Z + depth / 2));
  const roof = gableRoof(width, depth, 2.2, roofMat, true);
  roof.position.set(0, height, STATION_Z + depth / 2);
  group.add(roof);
  group.add(block(width + 0.2, 0.3, 0.3, trim, 0, height - 0.3, STATION_Z - 0.05));
  for (const x of [-4.4, 0, 4.4]) {
    // Each door in a white frame; the middle one stands open, the fire engine inside.
    group.add(block(3.6, 0.25, 0.2, trim, x, 4.1, STATION_Z - 0.05));
    group.add(block(0.25, 4.1, 0.2, trim, x - 1.68, 0, STATION_Z - 0.05));
    group.add(block(0.25, 4.1, 0.2, trim, x + 1.68, 0, STATION_Z - 0.05));
    if (x !== 0) {
      group.add(block(3.1, 4.05, 0.1, doorRed, x, 0, STATION_Z - 0.04));
      for (let k = 1; k < 8; k++) group.add(block(3.1, 0.04, 0.02, trim, x, k * 0.5, STATION_Z - 0.1, false));
      const glass = mat("#bfe3ff", 0.25);
      for (const dx of [-0.9, 0, 0.9]) group.add(block(0.7, 0.45, 0.03, glass, x + dx, 2.9, STATION_Z - 0.1, false));
    } else {
      group.add(block(3.1, 4.05, 0.1, inside, x, 0, STATION_Z + 1.2));
      group.add(makeFireEngine(x, STATION_Z + 3.4));
    }
  }
  // The hose tower beside the hall.
  group.add(block(3, 11, 3, brick, width / 2 + 1.5, 0, STATION_Z + 3));
  const towerRoof = solid(new THREE.ConeGeometry(2.4, 1.8, 4), roofMat);
  towerRoof.rotation.y = Math.PI / 4;
  towerRoof.position.set(width / 2 + 1.5, 11.9, STATION_Z + 3);
  group.add(towerRoof);
  for (const y of [3, 6, 9]) group.add(block(0.9, 1.1, 0.06, mat("#bfe3ff", 0.25), width / 2 + 1.5, y, STATION_Z + 1.47, false));
  // The yard: light paving, walls at its sides; the front wall with the gate comes with the gate.
  const paving = mat("#c9c4bb", 1);
  const yard = solid(new THREE.BoxGeometry(14, 0.1, STATION_Z - GATE_Z + 0.5), paving, false);
  yard.position.set(0, -0.04, (STATION_Z + GATE_Z) / 2);
  group.add(yard);
  const wall = mat("#e7dccb", 0.95);
  for (const side of [1, -1]) group.add(block(0.4, WALL_HEIGHT, STATION_Z - GATE_Z, wall, side * 7, 0, (STATION_Z + GATE_Z) / 2));
  return group;
}

/** The round red fire engine standing in the hall, its front (-z) to the open door. */
function makeFireEngine(x: number, z: number) {
  const group = new THREE.Group();
  const red = mat("#e2412f", 0.4);
  const white = mat("#f6f4ef", 0.5);
  const black = mat("#22252b", 0.8);
  const glass = mat("#bfe3ff", 0.2);
  const silver = mat("#c9d1db", 0.35, { metalness: 0.5 });
  group.add(block(2.3, 1.6, 5, red, 0, 0.5, 0));
  group.add(block(2.25, 0.9, 1.6, red, 0, 2.1, -1.6));
  group.add(block(2, 0.7, 0.05, glass, 0, 2.2, -2.42, false));
  group.add(block(2.32, 0.18, 5.02, white, 0, 1.3, 0, false));
  for (const dz of [-1.5, 1.5]) {
    for (const side of [1, -1]) {
      const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 20);
      wheelGeo.rotateZ(Math.PI / 2);
      const wheel = solid(wheelGeo, black);
      wheel.position.set(side * 1.1, 0.5, dz);
      group.add(wheel);
    }
  }
  const ladder = block(0.7, 0.12, 4.2, silver, 0, 2.15, 0.6);
  group.add(ladder);
  const lightGeo = new THREE.SphereGeometry(0.16, 12, 8, 0, TAU, 0, Math.PI / 2);
  for (const side of [1, -1]) {
    const light = solid(lightGeo, mat("#4f9dff", 0.3, { emissive: "#2b7dff", emissiveIntensity: 0.6 }), false);
    light.position.set(side * 0.7, 3, -1.6);
    group.add(light);
  }
  group.position.set(x, 0, z);
  return group;
}

/**
 * The yard's front wall across the way with the roller gate's opening, `GATE_HALF` either side of the middle;
 * the box over the opening that the door rolls up into. Static; the door is `makeRollerDoor`.
 */
export function makeYardWall() {
  const group = new THREE.Group();
  const wall = mat("#e7dccb", 0.95);
  const coping = mat("#b9a98f", 0.9);
  const side = 7.2 - GATE_HALF;
  for (const s of [1, -1]) {
    group.add(block(side, WALL_HEIGHT, 0.4, wall, s * (GATE_HALF + side / 2), 0, GATE_Z));
    group.add(block(side + 0.1, 0.15, 0.55, coping, s * (GATE_HALF + side / 2), WALL_HEIGHT, GATE_Z, false));
  }
  // Over the opening, from the open gate's height up to the wall's top: the box the door rolls into.
  group.add(block(GATE_HALF * 2, WALL_HEIGHT - GATE_OPEN, 0.7, mat("#c4553f", 0.7), 0, GATE_OPEN, GATE_Z));
  group.add(block(GATE_HALF * 2 + 0.1, 0.15, 0.85, coping, 0, WALL_HEIGHT, GATE_Z, false));
  return group;
}

/**
 * The roller door in the gate: horizontal red and white slats. `open(k)` rolls it up (0 shut, 1 open): the slats
 * that reach the box over the opening go into it and are hidden.
 */
export function makeRollerDoor() {
  const group = new THREE.Group();
  const SLATS = 12;
  const slat = GATE_OPEN / SLATS;
  const red = mat("#e2412f", 0.5);
  const white = mat("#f6f4ef", 0.55);
  const slats = Array.from({ length: SLATS }, (_, i) => {
    const m = solid(new THREE.BoxGeometry(GATE_HALF * 2 - 0.04, slat - 0.02, 0.1), i % 3 === 1 ? white : red);
    m.position.set(0, (i + 0.5) * slat, GATE_Z);
    group.add(m);
    return m;
  });
  return {
    group,
    open(k: number) {
      const up = k * GATE_OPEN;
      slats.forEach((m, i) => {
        m.position.y = (i + 0.5) * slat + up;
        m.visible = m.position.y + slat / 2 <= GATE_OPEN + 0.01;
      });
    },
  };
}

/**
 * The gallows of the fire bell beside Robo's place: a red post at `postX`, on Tapsi's right (+x), with a beam over
 * to `top`, above Tapsi's paws, where the rope runs over a little wheel; the bell hangs from the beam between them.
 * Static.
 */
export function makeGallows(top: THREE.Vector3, postX: number) {
  const group = new THREE.Group();
  const red = mat("#d93a2b", 0.55);
  const grey = mat("#8d96a3", 0.9);
  group.add(block(0.18, top.y + 0.2, 0.18, red, postX, 0, top.z));
  const length = postX - top.x + 0.25;
  group.add(block(length, 0.14, 0.16, red, top.x - 0.15 + length / 2, top.y + 0.06, top.z));
  const strut = solid(new THREE.BoxGeometry(0.1, 0.8, 0.1), red);
  strut.position.set(postX - 0.28, top.y - 0.2, top.z);
  strut.rotation.z = -Math.PI / 4;
  group.add(strut);
  group.add(block(0.6, 0.12, 0.6, grey, postX, 0, top.z));
  const wheelGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.04, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const wheel = solid(wheelGeo, grey, false);
  wheel.position.copy(top);
  group.add(wheel);
  return group;
}

/**
 * The fire bell: golden, its pivot (the group's origin) at the top where it hangs from the beam, a clapper inside
 * and a little lever on its side where the rope pulls. `swing(a)` tips it over (radians).
 */
export function makeBell() {
  const group = new THREE.Group();
  const gold = mat("#e7b53c", 0.28, { metalness: 0.65 });
  const dark = mat("#5a4632", 0.6);
  const profile = [v2(0.02, -0.04), v2(0.12, -0.06), v2(0.17, -0.16), v2(0.2, -0.32), v2(0.27, -0.46), v2(0.29, -0.5), v2(0.25, -0.5), v2(0.2, -0.44)];
  const bell = solid(new THREE.LatheGeometry(profile, 32), gold);
  bell.material.side = THREE.DoubleSide;
  group.add(bell);
  const cap = solid(new THREE.SphereGeometry(0.06, 12, 8), gold);
  cap.position.y = -0.02;
  group.add(cap);
  const clapper = solid(new THREE.SphereGeometry(0.06, 12, 10), dark);
  clapper.position.y = -0.44;
  group.add(clapper);
  const rod = block(0.02, 0.4, 0.02, dark, 0, -0.44, 0);
  group.add(rod);
  const yoke = solid(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 10), dark);
  yoke.rotation.z = Math.PI / 2;
  group.add(yoke);
  mergeParts(group);
  return group;
}

/** The bell rope from its top down to the handle: a unit-long cylinder along y, placed by `between(a, b)`. */
export function makeRope() {
  const rope = solid(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), mat("#c8a46a", 0.95), false);
  const q = new THREE.Quaternion();
  const d = new THREE.Vector3();
  return {
    mesh: rope,
    between(a: THREE.Vector3, b: THREE.Vector3) {
      d.subVectors(b, a);
      rope.position.copy(a).addScaledVector(d, 0.5);
      rope.scale.set(1, d.length(), 1);
      rope.quaternion.copy(q.setFromUnitVectors(UP, d.normalize()));
    },
  };
}

/** The rope's handle: a red wooden bar the paws hold, along its own x, the rope tied on in its middle. */
export function makeHandle(length: number) {
  const group = new THREE.Group();
  const barGeo = new THREE.CapsuleGeometry(0.03, length, 4, 10);
  barGeo.rotateZ(Math.PI / 2);
  group.add(solid(barGeo, mat("#d93a2b", 0.55), false));
  const knot = solid(new THREE.SphereGeometry(0.04, 10, 8), mat("#c8a46a", 0.95), false);
  knot.position.y = 0.03;
  group.add(knot);
  mergeParts(group);
  return group;
}

/** One town house beside the street, its front to the street (`facing` +1: towards +x). Static. */
function makeTownHouse(seed: number, length: number, facing: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const height = 5.2 + Math.floor(rnd() * 3) * 1.1;
  const depth = 6;
  const wallMat = mat(HOUSE_COLORS[seed % HOUSE_COLORS.length], 0.9);
  const glass = mat("#3d5a78", 0.25);
  const frame = mat("#ffffff", 0.7);
  group.add(block(depth, height, length, wallMat, (-facing * depth) / 2, 0, 0));
  const roof = gableRoof(depth, length, 1.6 + rnd() * 0.6, mat(["#b84a3c", "#7a5b4a", "#5c6470"][seed % 3], 0.8), false);
  roof.position.set((-facing * depth) / 2, height, 0);
  group.add(roof);
  const normal = new THREE.Vector3(facing, 0, 0);
  const rows = Math.floor((height - 1.6) / 1.5);
  const cols = Math.max(1, Math.floor(length / 1.8));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const z = (c - (cols - 1) / 2) * (length / cols);
      if (r === 0 && c === Math.floor(cols / 2)) {
        const door = solid(new THREE.BoxGeometry(0.1, 1.8, 0.9), mat(["#2f6fe8", "#4a8a3c", "#8a5a3b"][seed % 3], 0.6), false);
        door.position.set(facing * 0.03, 0.9, z);
        group.add(door);
        continue;
      }
      windowOn(group, new THREE.Vector3(0, 1.6 + r * 1.5 + (r === 0 ? -0.3 : 0), z), normal, 0.8, 0.95, glass, frame);
    }
  }
  return group;
}

/**
 * The street from the yard's wall down to the square: grey road, pale pavements, town houses on both sides with
 * their fronts at ±STREET_X, the square with a few bushes, and grass round everything. Static.
 */
export function makeTown() {
  const group = new THREE.Group();
  const grass = solid(new THREE.PlaneGeometry(400, 400), mat("#8fcf6a", 1), false);
  grass.rotation.x = -Math.PI / 2;
  grass.position.y = -0.06;
  group.add(grass);
  const road = solid(new THREE.BoxGeometry(STREET_X * 2 - 3, 0.04, GATE_Z - STREET_END + 2), mat("#7d828a", 1), false);
  road.position.set(0, -0.03, (GATE_Z + STREET_END) / 2 - 1);
  group.add(road);
  const pavement = mat("#cfc9bf", 1);
  for (const s of [1, -1]) {
    const walk = solid(new THREE.BoxGeometry(1.5, 0.08, GATE_Z - STREET_END + 2), pavement, false);
    walk.position.set(s * (STREET_X - 0.75), -0.02, (GATE_Z + STREET_END) / 2 - 1);
    group.add(walk);
  }
  // The square, paved light, round the house with the smoke.
  const square = solid(new THREE.BoxGeometry(24, 0.05, 22), mat("#d8d0c2", 1), false);
  square.position.set(0, -0.025, STREET_END - 11);
  group.add(square);
  const rnd = seeded(41);
  for (const s of [1, -1]) {
    let z = GATE_Z - 0.4;
    let seed = s > 0 ? 1 : 2;
    while (z > STREET_END + 1) {
      const length = Math.min(z - STREET_END, 4.5 + rnd() * 2);
      const house = makeTownHouse(seed, length - 0.15, -s);
      house.position.set(s * STREET_X, 0, z - length / 2);
      group.add(house);
      z -= length;
      seed += 2;
    }
  }
  // Houses round the square, behind and beside the house with the smoke, and bushes.
  for (const [x, z, seed] of [
    [-9.5, HOUSE_Z - 2, 11],
    [9.5, HOUSE_Z - 2, 12],
    [-9.5, HOUSE_Z - 9, 13],
    [9.5, HOUSE_Z - 9, 14],
  ]) {
    const house = makeTownHouse(seed, 5.5, x > 0 ? -1 : 1);
    house.position.set(x + (x > 0 ? -3 : 3), 0, z);
    group.add(house);
  }
  for (let i = 0; i < 8; i++) {
    const bush = makeBush(0.6 + rnd() * 0.3, 60 + i);
    bush.position.set((i % 2 === 0 ? -1 : 1) * (4.6 + rnd() * 1.4), 0, STREET_END - 2 - Math.floor(i / 2) * 2.2);
    group.add(bush);
  }
  return group;
}

/** Colours of the washing, in turn. */
const WASHING = ["#ff6b6b", "#ffd23f", "#4fb0ff", "#7bd389", "#ffffff", "#c38bff", "#ff9f43"];

/**
 * A washing line across the street at `z`, from one house front to the other: the rope sags to `middle` over the
 * way, and the washing hangs from it, its lowest edge near the middle at `bottom` – over a ducked head, under a
 * standing one. Static.
 */
export function makeWashingLine(seed: number, z: number, middle: number, bottom: number) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const SAG = 0.3;
  /** The rope's height at x. */
  const ropeY = (x: number) => middle + SAG * (x / STREET_X) ** 2;
  const points = Array.from({ length: 13 }, (_, i) => {
    const x = -STREET_X + (i / 12) * STREET_X * 2;
    return new THREE.Vector3(x, ropeY(x), z);
  });
  group.add(solid(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 0.015, 5), mat("#f2efe8", 0.9), false));
  const peg = mat("#c8a46a", 0.8);
  let x = -STREET_X + 0.6 + rnd() * 0.4;
  let n = seed;
  while (x < STREET_X - 0.6) {
    const kind = n % 3;
    const width = kind === 2 ? 0.28 : 0.55 + rnd() * 0.25;
    const centre = x + width / 2;
    // Over the way the washing ends at `bottom`; further out, where nobody passes, it may hang lower.
    const low = Math.abs(centre) < 1.6 ? bottom : bottom - 0.25 - rnd() * 0.3;
    const top = ropeY(centre);
    const length = Math.max(0.3, top - low);
    const cloth = mat(WASHING[n % WASHING.length], 0.9);
    if (kind === 0) {
      // A shirt: its body and two short sleeves.
      group.add(block(width * 0.75, length, 0.03, cloth, centre, top - length, z, false));
      for (const s of [1, -1]) {
        const sleeve = solid(new THREE.BoxGeometry(width * 0.25, Math.min(0.28, length * 0.45), 0.03), cloth, false);
        sleeve.position.set(centre + s * width * 0.42, top - 0.12, z);
        sleeve.rotation.z = s * 0.35;
        group.add(sleeve);
      }
    } else if (kind === 1) {
      // A towel with a stripe.
      group.add(block(width, length, 0.025, cloth, centre, top - length, z, false));
      group.add(block(width, 0.06, 0.03, mat("#ffffff", 0.9), centre, top - length + 0.08, z, false));
    } else {
      // A sock, its foot turned out.
      group.add(block(width * 0.6, length * 0.8, 0.03, cloth, centre, top - length * 0.8, z, false));
      group.add(block(width, length * 0.2, 0.03, cloth, centre + width * 0.2, top - length, z, false));
    }
    for (const s of [1, -1]) group.add(block(0.03, 0.08, 0.05, peg, centre + s * width * 0.3, top - 0.05, z, false));
    x += width + 0.15 + rnd() * 0.25;
    n++;
  }
  return group;
}

/**
 * The house with the smoke: tall and narrow, a soft yellow with a red-brown roof, a door, and the windows at
 * `windows` on its front (z = HOUSE_Z), where the hose's water lands; its eaves at `eaves`, where the kittens sit
 * on the gutter. Static.
 */
export function makeSmokyHouse(windows: THREE.Vector3[], eaves: number) {
  const group = new THREE.Group();
  const wallMat = mat("#f7e3b5", 0.9);
  const glass = mat("#3d5a78", 0.25);
  const frame = mat("#ffffff", 0.7);
  group.add(block(HOUSE_HALF * 2, eaves, HOUSE_DEPTH, wallMat, 0, 0, HOUSE_Z - HOUSE_DEPTH / 2));
  const roof = gableRoof(HOUSE_HALF * 2, HOUSE_DEPTH, 2.6, mat("#a8483a", 0.8), true);
  roof.position.set(0, eaves, HOUSE_Z - HOUSE_DEPTH / 2);
  group.add(roof);
  const gutterGeo = new THREE.CylinderGeometry(0.07, 0.07, HOUSE_HALF * 2 + 0.5, 12);
  gutterGeo.rotateZ(Math.PI / 2);
  const gutter = solid(gutterGeo, mat("#9aa3ad", 0.4, { metalness: 0.3 }), false);
  gutter.position.set(0, eaves - 0.02, HOUSE_Z + 0.33);
  group.add(gutter);
  const front = new THREE.Vector3(0, 0, 1);
  for (const w of windows) windowOn(group, new THREE.Vector3(w.x, w.y, HOUSE_Z), front, 0.95, 0.85, glass, frame);
  group.add(block(1.1, 2, 0.1, mat("#2f6fe8", 0.6), 0, 0, HOUSE_Z + 0.03, false));
  // A ledge between the floors.
  for (let y = 1.0; y < eaves - 1; y += 1.7) group.add(block(HOUSE_HALF * 2 + 0.1, 0.1, 0.12, frame, 0, y, HOUSE_Z + 0.03, false));
  return group;
}

/**
 * A grey puff of smoke hanging out of a window: a few round balls round its middle. Its own material, to turn
 * white like steam and fade once the water reaches it.
 */
export function makeSmoke(seed: number, radius = 0.42) {
  const rnd = seeded(seed);
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: "#7d838c", roughness: 1, transparent: true, emissive: "#ffffff", emissiveIntensity: 0 });
  const balls: [number, number, number, number][] = [
    [0, 0, 0, 1],
    [0.6, 0.2, -0.1, 0.72],
    [-0.6, 0.15, -0.05, 0.75],
    [0.1, 0.55, -0.2, 0.8],
  ];
  for (const [x, y, z, size] of balls) {
    const ball = solid(new THREE.IcosahedronGeometry(radius * size * (0.95 + rnd() * 0.1), 2), material, false);
    ball.position.set(x * radius, y * radius, z * radius);
    group.add(ball);
  }
  mergeParts(group);
  return { group, material };
}

/**
 * A kitten, sitting, its face to +z: round body and head, pointed ears, big eyes with a light in them, a pink nose,
 * a white muzzle and chest, and a tail curled up beside it. About 0.4 m long.
 */
export function makeKitten(color: string) {
  const group = new THREE.Group();
  const fur = mat(color, 0.85);
  const cream = mat("#fffaf0", 0.85);
  const pink = mat("#ff9fb2", 0.6);
  const black = mat("#1b1b1f", 0.2);
  const shine = mat("#ffffff", 0.2);
  const bodyGeo = new THREE.SphereGeometry(0.13, 18, 14);
  bodyGeo.scale(1, 1.05, 1.15);
  const body = solid(bodyGeo, fur);
  body.position.y = 0.13;
  group.add(body);
  const chest = solid(new THREE.SphereGeometry(0.08, 14, 10), cream);
  chest.scale.set(1, 1.2, 0.6);
  chest.position.set(0, 0.15, 0.1);
  group.add(chest);
  const head = solid(new THREE.SphereGeometry(0.11, 18, 14), fur);
  head.position.set(0, 0.3, 0.07);
  group.add(head);
  const muzzle = solid(new THREE.SphereGeometry(0.05, 12, 10), cream);
  muzzle.scale.set(1.3, 0.8, 0.8);
  muzzle.position.set(0, 0.27, 0.165);
  group.add(muzzle);
  const nose = solid(new THREE.SphereGeometry(0.014, 8, 6), pink, false);
  nose.position.set(0, 0.29, 0.205);
  group.add(nose);
  for (const s of [1, -1]) {
    const ear = solid(new THREE.ConeGeometry(0.045, 0.09, 10), fur);
    ear.position.set(s * 0.065, 0.4, 0.06);
    ear.rotation.z = -s * 0.35;
    group.add(ear);
    const inner = solid(new THREE.ConeGeometry(0.025, 0.05, 8), pink, false);
    inner.position.set(s * 0.063, 0.395, 0.08);
    inner.rotation.z = -s * 0.35;
    group.add(inner);
    const eye = solid(new THREE.SphereGeometry(0.024, 10, 8), black, false);
    eye.position.set(s * 0.042, 0.315, 0.16);
    group.add(eye);
    const light = solid(new THREE.SphereGeometry(0.008, 6, 5), shine, false);
    light.position.set(s * 0.042 + 0.008, 0.325, 0.18);
    group.add(light);
    const paw = solid(new THREE.SphereGeometry(0.035, 10, 8), cream);
    paw.scale.set(1, 0.7, 1.3);
    paw.position.set(s * 0.06, 0.02, 0.12);
    group.add(paw);
  }
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.06, -0.14),
    new THREE.Vector3(0.12, 0.05, -0.12),
    new THREE.Vector3(0.18, 0.14, -0.02),
    new THREE.Vector3(0.16, 0.24, 0.02),
  ]);
  group.add(solid(new THREE.TubeGeometry(tailCurve, 12, 0.025, 6), fur));
  mergeParts(group);
  return group;
}

/** The hose's nozzle: a red pipe with a black grip and a brass mouth, along +z, its middle (where the paws hold it) at the origin. */
export function makeNozzle() {
  const group = new THREE.Group();
  const pipeGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.42, 14);
  pipeGeo.rotateX(Math.PI / 2);
  const pipe = solid(pipeGeo, mat("#d93a2b", 0.45), false);
  pipe.position.z = 0.02;
  group.add(pipe);
  const gripGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.16, 14);
  gripGeo.rotateX(Math.PI / 2);
  group.add(solid(gripGeo, mat("#2a2d33", 0.7), false));
  const mouthGeo = new THREE.CylinderGeometry(0.025, 0.045, 0.1, 14);
  mouthGeo.rotateX(Math.PI / 2);
  const mouth = solid(mouthGeo, mat("#e7b53c", 0.3, { metalness: 0.6 }), false);
  mouth.position.z = 0.28;
  group.add(mouth);
  mergeParts(group);
  return group;
}

/** How far ahead of the nozzle's middle its mouth is, where the water comes out. */
export const NOZZLE_MOUTH = 0.33;

/**
 * Something drawn along a curve as a chain of copies of one mesh (the hose's pieces, the water's drops), one draw
 * for all: `set(i, at, along, length)` places piece i, `hide(i)` hides it, `done()` sends it to the GPU.
 */
function makeChain(geometry: THREE.BufferGeometry, material: THREE.Material, count: number) {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.frustumCulled = false;
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const zero = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < count; i++) mesh.setMatrixAt(i, zero);
  return {
    mesh,
    count,
    set(i: number, at: THREE.Vector3, along: THREE.Vector3, length: number, width = 1) {
      q.setFromUnitVectors(UP, along);
      mesh.setMatrixAt(i, m.compose(at, q, s.set(width, length, width)));
    },
    hide(i: number) {
      mesh.setMatrixAt(i, zero);
    },
    done() {
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}

/** The hose from Robo's hatch up to the nozzle: short pieces along a curve. */
export function makeHose() {
  const geometry = new THREE.CylinderGeometry(0.032, 0.032, 1, 8, 1, true);
  return makeChain(geometry, mat("#d93a2b", 0.6), 14);
}

/** The water from the nozzle: a chain of light blue drops flying out in an arc. */
export function makeWater() {
  const geometry = new THREE.SphereGeometry(0.06, 8, 6);
  const material = new THREE.MeshStandardMaterial({
    color: "#9fdcff",
    emissive: "#4fb8ff",
    emissiveIntensity: 0.35,
    roughness: 0.15,
    transparent: true,
    opacity: 0.85,
  });
  return makeChain(geometry, material, 36);
}

/**
 * The pump that comes up out of Robo's hatch: a red barrel standing on the hatch (its foot at the group's origin, along
 * +y, stretched by its scale while it comes out), a shiny rod from its top up to the handle, placed by `rodBetween(a, b)`.
 */
export function makePump() {
  const barrel = new THREE.Group();
  const red = mat("#d93a2b", 0.45);
  const white = mat("#f6f4ef", 0.45);
  const body = solid(new THREE.CylinderGeometry(0.065, 0.075, PUMP_BARREL, 18), red, false);
  body.position.y = PUMP_BARREL / 2;
  barrel.add(body);
  for (const y of [0.06, PUMP_BARREL - 0.03]) {
    const band = solid(new THREE.CylinderGeometry(0.08, 0.08, 0.035, 18), white, false);
    band.position.y = y;
    barrel.add(band);
  }
  mergeParts(barrel);
  const rod = solid(new THREE.CylinderGeometry(0.018, 0.018, 1, 10), mat("#c9d1da", 0.25, { metalness: 0.7 }), false);
  const q = new THREE.Quaternion();
  const d = new THREE.Vector3();
  return {
    barrel,
    rod,
    rodBetween(a: THREE.Vector3, b: THREE.Vector3) {
      d.subVectors(b, a);
      rod.position.copy(a).addScaledVector(d, 0.5);
      rod.scale.set(1, Math.max(0.001, d.length()), 1);
      rod.quaternion.copy(q.setFromUnitVectors(UP, d.normalize()));
    },
  };
}

/** The suction hose Robo lets down from its tank into the fountain: short grey-blue pieces along a curve. */
export function makeSuctionHose() {
  const geometry = new THREE.CylinderGeometry(0.045, 0.045, 1, 8, 1, true);
  return makeChain(geometry, mat("#2f86b8", 0.55), 14);
}

/**
 * The fountain on the square: a round stone basin with water in it and a column in its middle with a little bowl on
 * top, its middle at `x`, `z` on the ground. Static.
 */
export function makeFountain(x: number, z: number, radius: number, rim: number) {
  const group = new THREE.Group();
  const stone = mat("#cbbfae", 0.9);
  const wall = solid(new THREE.CylinderGeometry(radius, radius + 0.05, rim, 36, 1, true), stone);
  wall.material.side = THREE.DoubleSide;
  wall.position.y = rim / 2;
  group.add(wall);
  const top = solid(new THREE.TorusGeometry(radius, 0.07, 8, 36), stone);
  top.rotation.x = Math.PI / 2;
  top.position.y = rim;
  group.add(top);
  const water = solid(new THREE.CircleGeometry(radius - 0.02, 36), mat("#5fb8ef", 0.15, { emissive: "#2b7dff", emissiveIntensity: 0.15 }), false);
  water.rotation.x = -Math.PI / 2;
  water.position.y = rim - 0.1;
  group.add(water);
  const column = solid(new THREE.CylinderGeometry(0.12, 0.16, rim + 0.5, 16), stone);
  column.position.y = (rim + 0.5) / 2;
  group.add(column);
  const bowlGeo = new THREE.SphereGeometry(0.3, 20, 10, 0, TAU, Math.PI / 2, Math.PI / 2);
  const bowl = solid(bowlGeo, stone);
  bowl.material.side = THREE.DoubleSide;
  bowl.position.y = rim + 0.75;
  group.add(bowl);
  const pool = solid(new THREE.CircleGeometry(0.26, 20), mat("#5fb8ef", 0.15, { emissive: "#2b7dff", emissiveIntensity: 0.15 }), false);
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = rim + 0.72;
  group.add(pool);
  group.position.set(x, 0, z);
  return group;
}
