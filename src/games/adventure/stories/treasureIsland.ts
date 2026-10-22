import * as THREE from "three";
import { SEQUENCES } from "../library/sequences";
import { duckDepth } from "../three/clips";
import type { Guide } from "../three/guide";
import {
  makeBush,
  makeButterfly,
  makeCanoe,
  makeChest,
  makeCloud,
  makeConfetti,
  makeCrab,
  makeFlower,
  makePaddle,
  PADDLE_REACH,
  makePalm,
  makeParrot,
  makeRock,
  mat,
  mergeStatic,
  seeded,
  solid,
} from "../three/props";
import { DAY, makeWater, SUNSET, type Stage } from "../three/stage";
import { crossed, type Cue, type Story, type StoryFrame, type StoryWorld } from "./story";

// "Die Schatzinsel": Tapsi paddles to an island, crosses a brook, ducks under
// a swinging branch, wakes the flowers, lets coconuts roll past, pushes open
// a stone door and pulls the treasure chest ashore – then there is a party at
// sunset. Every world reaction is timed to the guide's clip, so it happens
// together with the child's movement.
//
// First a red dotted trail draws the way across the island to the chest, like
// on a treasure map. Then, at every station, Tapsi first shows the movement
// alone and the child joins in; meanwhile the camera looks at Tapsi from the
// front (only the paddling is seen from behind, as if sitting in the canoe
// too), so the whole body is big in the middle of the picture.
//
// Island layout along the path (x ≈ 0), from the sea at +z to the bay at -z:
// beach 35 · brook 25.4 · swinging branch 16.5 · flowers 9.5 · coconuts 2.5 ·
// stone door in the cliff -9.9 · hidden bay with the chest around -30.

const sequence = SEQUENCES.find((s) => s.id === "treasure_island")!;

const TAU = Math.PI * 2;
const clamp01 = (k: number) => Math.max(0, Math.min(1, k));
const smooth = (k: number) => {
  const c = clamp01(k);
  return c * c * (3 - 2 * c);
};
/** Smoothstep that also works with edge0 > edge1. */
const ss = (edge0: number, edge1: number, x: number) => smooth((x - edge0) / (edge1 - edge0));
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const LAGOON = new THREE.Vector2(0, -30);
const LAGOON_LEVEL = 0.34;

/** Island ground height at (x, z); below 0 is under the sea. */
export function groundHeight(x: number, z: number) {
  const dx = x / 28;
  const dz = (z + 4) / 42;
  const theta = Math.atan2(dz, dx);
  const r = Math.hypot(dx, dz) / (1 + 0.05 * Math.sin(3 * theta) + 0.035 * Math.sin(5 * theta + 2) + 0.02 * Math.sin(9 * theta + 1));
  let h = -1.4 + 2.3 * ss(1.08, 0.78, r);
  h += 0.18 * Math.sin(x * 0.31 + 1) * Math.sin(z * 0.23) * ss(1.0, 0.7, r) * ss(1.5, 4, Math.abs(x));
  // The brook across the path.
  h -= 0.85 * Math.exp(-(((z - 25.4) / 1.25) ** 2)) * ss(1.0, 0.85, r);
  // The hill with its cliff, cut through by a narrow gorge where the door is.
  const hill = 8 * ss(-8.6, -10.6, z) * ss(-22, -18, z) * ss(17, 9, Math.abs(x));
  h += hill * ss(1.5, 2.7, Math.abs(x)) * (1 + 0.08 * Math.sin(x * 0.9) * Math.sin(z * 0.7));
  // The hidden bay behind the hill.
  h -= 2.4 * ss(8.5, 5.5, Math.hypot(x - LAGOON.x, z - LAGOON.y));
  return h;
}

function makeTerrain() {
  const width = 90;
  const depth = 110;
  const geometry = new THREE.PlaneGeometry(width, depth, 200, 250);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0, -4);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, groundHeight(pos.getX(i), pos.getZ(i)));
  geometry.computeVertexNormals();

  const sand = new THREE.Color("#f2d49b");
  const wetSand = new THREE.Color("#d9b27a");
  const grass = new THREE.Color("#69bd4c");
  const grass2 = new THREE.Color("#8fd064");
  const rock = new THREE.Color("#a3968a");
  const rock2 = new THREE.Color("#8a7d74");
  const path = new THREE.Color("#e3c48e");
  const c = new THREE.Color();
  const colors: number[] = [];
  const normal = geometry.attributes.normal;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const n = normal.getY(i);
    const mottle = 0.5 + 0.5 * Math.sin(x * 0.7 + Math.sin(z * 0.5) * 2) * Math.sin(z * 0.9);
    c.copy(grass).lerp(grass2, mottle * 0.6);
    // Sand by the water, wet and darker right at the edge.
    c.lerp(sand, ss(0.95, 0.6, y));
    c.lerp(wetSand, ss(0.25, -0.1, y));
    // A sandy path wiggling through the grass.
    const pathX = Math.sin(z * 0.2) * 0.5;
    c.lerp(path, Math.exp(-(((x - pathX) / 1.15) ** 2)) * ss(36, 33, z) * ss(-11, -9, z) * 0.85);
    // Steep slopes and the hill are rock.
    c.lerp(rock.clone().lerp(rock2, mottle), Math.max(ss(0.82, 0.6, n), ss(2.0, 3.0, y)));
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

/** True where trees and bushes may grow: on land, off the path and away from the stations. */
function freeSpot(x: number, z: number) {
  const h = groundHeight(x, z);
  if (h < 0.7) return false;
  if (Math.abs(x) < 4 && z > -12) return false;
  if (Math.abs(z - 25.4) < 2.5) return false;
  if (Math.hypot(x - LAGOON.x, z - LAGOON.y) < 9.5) return false;
  if (Math.abs(x) < 3.5) return false;
  return true;
}

/** Grass tufts and little flowers as instanced meshes, so hundreds cost almost nothing. */
function makeGroundCover(rnd: () => number) {
  const group = new THREE.Group();
  const tuftGeo = new THREE.ConeGeometry(0.08, 0.45, 5);
  tuftGeo.translate(0, 0.2, 0);
  const tufts = new THREE.InstancedMesh(tuftGeo, mat("#4f9e3a", 0.9), 900);
  const blossomGeo = new THREE.SphereGeometry(0.09, 8, 6);
  const blossoms = new THREE.InstancedMesh(blossomGeo, mat("#ffffff", 0.6), 260);
  const blossomColors = ["#ff7eb6", "#ffd23f", "#ffffff", "#b388ff", "#ff9f43"];
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  let t = 0;
  let b = 0;
  for (let i = 0; i < 6000 && (t < tufts.count || b < blossoms.count); i++) {
    const x = (rnd() - 0.5) * 60;
    const z = -4 + (rnd() - 0.5) * 84;
    const h = groundHeight(x, z);
    if (h < 0.75 || h > 1.6) continue;
    if (Math.abs(z - 25.4) < 1.6) continue;
    if (Math.abs(x) < 1.4 && z > -11) continue;
    q.setFromEuler(new THREE.Euler((rnd() - 0.5) * 0.4, rnd() * TAU, (rnd() - 0.5) * 0.4));
    if (rnd() < 0.82 && t < tufts.count) {
      const s = 0.6 + rnd() * 0.9;
      m.compose(v3(x, h - 0.05, z), q, v3(s, s, s));
      tufts.setMatrixAt(t++, m);
    } else if (b < blossoms.count) {
      m.compose(v3(x, h + 0.08, z), q, v3(1, 1, 1));
      blossoms.setMatrixAt(b, m);
      blossoms.setColorAt(b++, new THREE.Color(blossomColors[b % blossomColors.length]));
    }
  }
  tufts.count = t;
  blossoms.count = b;
  tufts.receiveShadow = blossoms.receiveShadow = true;
  group.add(tufts, blossoms);
  return group;
}

/** A small island far away, for depth. */
function makeFarIsland(scale: number, seed: number) {
  const group = new THREE.Group();
  const sandGeo = new THREE.SphereGeometry(10, 32, 12, 0, TAU, 0, Math.PI / 2);
  sandGeo.scale(1.3, 0.25, 1);
  group.add(new THREE.Mesh(sandGeo, mat("#f0d39c", 1)));
  const top = new THREE.Mesh(new THREE.SphereGeometry(7, 28, 12, 0, TAU, 0, Math.PI / 2), mat("#5daa49", 1));
  top.scale.set(1.25, 0.45, 0.9);
  top.position.y = 1;
  group.add(top);
  for (let i = 0; i < 3; i++) {
    const palm = makePalm(7 + i, seed + i);
    palm.position.set(-4 + i * 4, 3, (i - 1) * 2);
    group.add(palm);
  }
  group.scale.setScalar(scale);
  return group;
}

/** The two trees and the bough the swinging branch hangs from. */
function makeSwing() {
  const group = new THREE.Group();
  const bark = mat("#7b5233", 0.95);
  for (const side of [1, -1]) {
    const trunk = solid(new THREE.CylinderGeometry(0.32, 0.48, 6.6, 12), bark);
    trunk.position.set(3.3 * side, 3.2, 0);
    trunk.rotation.z = 0.06 * side;
    group.add(trunk);
    const crown = makeBush(2.6, 31 + side, ["#3d8f36", "#4ea640", "#357d2f"]);
    crown.position.set(3.4 * side, 5.6, 0);
    group.add(crown);
  }
  const bough = solid(new THREE.CylinderGeometry(0.22, 0.26, 7.2, 10), bark);
  bough.rotation.z = Math.PI / 2;
  bough.position.y = 5.75;
  group.add(bough);
  const crownMid = makeBush(2.2, 40, ["#3d8f36", "#4ea640", "#357d2f"]);
  crownMid.position.set(0, 6.2, 0);
  group.add(crownMid);

  // The branch on two vines; the pivot turns around x so it swings along z.
  const pivot = new THREE.Group();
  pivot.position.y = 5.6;
  group.add(pivot);
  const length = 4.6;
  const vine = mat("#3f7d2c", 0.9);
  for (const side of [1, -1]) {
    const rope = solid(new THREE.CylinderGeometry(0.04, 0.04, length, 6), vine);
    rope.position.set(1.3 * side, -length / 2, 0);
    pivot.add(rope);
  }
  const log = solid(new THREE.CylinderGeometry(0.22, 0.24, 3.2, 12), mat("#8a5c38", 0.9));
  log.rotation.z = Math.PI / 2;
  log.position.y = -length;
  pivot.add(log);
  for (const x of [-1, 0.2, 1.2]) {
    const leaves = makeBush(0.45, 50 + x * 10, ["#5cb84a", "#74c95b"]);
    leaves.position.set(x, -length + 0.15, 0);
    pivot.add(leaves);
  }
  const blossom = solid(new THREE.SphereGeometry(0.12, 12, 8), mat("#ff7eb6", 0.5));
  blossom.position.set(-0.5, -length + 0.3, 0.1);
  pivot.add(blossom);
  return { group, pivot, length };
}

/** The stone door with a glowing spiral, its frame, and the light behind it. */
function makeDoor() {
  const group = new THREE.Group();
  // Warmer than the cliff around it, so it reads as a door.
  const stone = mat("#cdb38a", 0.85, { flatShading: true });
  const slab = new THREE.Group();
  group.add(slab);
  slab.add(solid(new THREE.BoxGeometry(3.7, 3.5, 0.5, 4, 4, 1), stone));
  slab.children[0].position.y = 1.75;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * TAU * 2.6;
    const r = 0.08 + (i / 120) * 0.95;
    points.push(v3(Math.cos(a) * r, 1.85 + Math.sin(a) * r, 0.27));
  }
  const spiralMat = new THREE.MeshStandardMaterial({ color: "#7ff3ff", emissive: "#3fd8ff", emissiveIntensity: 0.4, roughness: 0.3 });
  slab.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 200, 0.045, 8), spiralMat));
  const frame = mat("#8a8296", 0.9, { flatShading: true });
  for (const side of [1, -1]) {
    const pillar = makeRock(1.2, 70 + side, "#8a8296");
    pillar.scale.set(0.85, 3.4, 0.9);
    pillar.position.set(2.25 * side, 1.9, 0.1);
    group.add(pillar);
  }
  const lintel = solid(new THREE.BoxGeometry(6.2, 1.1, 1.3, 6, 2, 2), frame);
  lintel.position.set(0, 4.05, 0.05);
  group.add(lintel);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 3.5),
    new THREE.MeshBasicMaterial({ color: "#ffe9a8", transparent: true, opacity: 0, depthWrite: false }),
  );
  glow.position.set(0, 1.75, -0.6);
  group.add(glow);
  const light = new THREE.PointLight("#ffd27a", 0, 14, 1.4);
  light.position.set(0, 2, -1.2);
  group.add(light);
  // The spiral's light falls on whoever pushes, so it shows even with the door behind the camera.
  const spiralLight = new THREE.PointLight("#7ff3ff", 0, 9, 1.4);
  spiralLight.position.set(0, 1.8, 1.6);
  group.add(spiralLight);
  return {
    group,
    /** k: 0 shut, 1 fully open (sunk into the ground); glow: 0..1 how bright the spiral is. */
    set(push: number, open: number, glowK: number) {
      slab.position.set(0, -open * 3.6, -push * 0.35);
      spiralMat.emissiveIntensity = 0.4 + glowK * 3;
      (glow.material as THREE.MeshBasicMaterial).opacity = Math.max(glowK * 0.25, open);
      light.intensity = glowK * 6 + open * 30;
      spiralLight.intensity = glowK * 9 * (1 - open);
    },
  };
}

/** A big, round coconut with a fibrous look. */
function makeCoconut(seed: number) {
  const geo = new THREE.IcosahedronGeometry(0.5, 4);
  const rnd = seeded(seed);
  const colors: number[] = [];
  const a = new THREE.Color("#6b4426");
  const b = new THREE.Color("#8d5f37");
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const k = 0.5 + 0.5 * Math.sin(pos.getX(i) * 40 + rnd() * 2) * Math.sin(pos.getZ(i) * 34);
    const c = a.clone().lerp(b, k);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const nut = solid(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }));
  for (let i = 0; i < 3; i++) {
    const eye = solid(new THREE.SphereGeometry(0.06, 8, 6), mat("#3a2412"), false);
    const ang = (i / 3) * TAU;
    eye.position.set(Math.cos(ang) * 0.12, 0.47, Math.sin(ang) * 0.12);
    nut.add(eye);
  }
  return nut;
}

/** A raft for the chest. */
function makeRaft() {
  const group = new THREE.Group();
  const wood = [mat("#b07a45", 0.8), mat("#9a6638", 0.8)];
  for (let i = 0; i < 5; i++) {
    const log = solid(new THREE.CylinderGeometry(0.16, 0.16, 2.0, 10), wood[i % 2]);
    log.rotation.x = Math.PI / 2;
    log.position.set(-0.68 + i * 0.34, 0, 0);
    group.add(log);
  }
  for (const z of [-0.7, 0.7]) {
    const tie = solid(new THREE.BoxGeometry(1.9, 0.08, 0.12), mat("#6e4a2a", 0.9));
    tie.position.set(0, 0.15, z);
    group.add(tie);
  }
  return group;
}

/** Water or ground at (x, z), whichever is higher: where the trail lies. */
function surface(x: number, z: number) {
  let y = Math.max(groundHeight(x, z), 0.02);
  if (Math.abs(z - 25.4) < 1.8) y = Math.max(y, 0.44);
  if (Math.hypot(x - LAGOON.x, z - LAGOON.y) < 7.8) y = Math.max(y, LAGOON_LEVEL + 0.02);
  return y;
}

/**
 * The way of the story as red dots, like on a treasure map: across the sea,
 * along the path, through the door and over the bay to the chest. `show(k)`
 * draws it up to k (0..1); `head(k)` is where the drawing has got to.
 */
function makeTrail() {
  const points: THREE.Vector3[] = [];
  for (let z = BOAT_START - 2.8; z > BOAT_END; z -= 3) points.push(v3(0, 0, z));
  // Along the sandy path, straight through the door.
  for (let z = BOAT_END; z > SHORE.z; z -= 2) points.push(v3(Math.abs(z - DOOR_Z) < 4 ? 0 : Math.sin(z * 0.2) * 0.5, 0, z));
  points.push(v3(0, 0, SHORE.z), v3(RAFT_X * 0.6, 0, (SHORE.z + RAFT_FROM) / 2), v3(RAFT_X, 0, RAFT_FROM + 1.6));
  const curve = new THREE.CatmullRomCurve3(points);
  const count = Math.round(curve.getLength() / 0.9);
  const dots = curve.getSpacedPoints(count);
  for (const d of dots) d.y = surface(d.x, d.z) + 0.04;
  const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.24, 0.24, 0.05, 14), new THREE.MeshBasicMaterial({ color: "#e8423f" }), dots.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  return {
    mesh,
    show(k: number) {
      mesh.visible = k > 0;
      if (!mesh.visible) return;
      for (const [i, d] of dots.entries()) {
        // Each dot pops up a little bigger when the drawing reaches it.
        const s = clamp01((k * count - i) / 2);
        scale.setScalar(smooth(s) * (1 + 0.6 * Math.sin(Math.PI * s)));
        mesh.setMatrixAt(i, m.compose(d, q, scale));
      }
      mesh.instanceMatrix.needsUpdate = true;
    },
    head(k: number, out: THREE.Vector3) {
      curve.getPointAt(clamp01(k), out);
      out.y = surface(out.x, out.z);
      return out;
    },
  };
}

/** Where things happen; z along the path. */
const BOAT_START = 62;
const BOAT_END = 35;
const BROOK_FROM = 27.3;
const BROOK_TO = 23.4;
const SWING_Z = 16.5;
/** The branch hangs behind Tapsi, so it never hides the front view, and swings over towards us. */
const SWING_PIVOT_Z = SWING_Z - 1.9;
/** Afterwards the branch stays hooked up high, out of the way. */
const SWING_PARKED = -1.1;
const FLOWERS_Z = 9.5;
const COCONUT_Z = 2.5;
const DOOR_Z = -9.9;
/** Far enough from the door that the camera fits in between. */
const DOOR_GUIDE_Z = -6.6;
const SHORE = v3(0, 0, -21.8);
/** Where Tapsi stands in the canoe. */
const CANOE_FLOOR = -0.08;
const RAFT_X = 1.3;
const RAFT_FROM = -35;
/** Pulled up onto the beach, beside Tapsi. */
const RAFT_TO = -22.9;

/** The step indices of the sequence, by name. */
const S = { hello: 0, paddle: 1, brook: 2, duck: 3, flowers: 4, coconuts: 5, door: 6, rope: 7, hooray: 8, party: 9, bye: 10 } as const;

/** Seconds of travel before each step: walking or paddling there, or the camera coming in. */
const TRAVEL = [3, 2.5, 5, 5, 5, 5, 6, 5, 2, 1, 1];
/** Seconds Tapsi shows each movement alone first: whole loops of its clip, so the world stays in step. */
const DEMO = [2.5, 2.8, 4, 3, 4, 3.4, 2.6, 3.6, 2, 2.5, 2];
const LEAD = TRAVEL.map((t, i) => t + DEMO[i]);
const PRAISE = 3;
const OPENING = 16;
/** In the opening: when the trail starts and reaches the chest, and the flash back to the canoe. */
const TRAIL_FROM = 2;
const TRAIL_TO = 11.5;
const OPENING_CUT = 13.6;

/** Where each walk ends: the guide's position when the step's movement starts. */
const ARRIVE: Record<number, number> = {
  [S.brook]: BROOK_FROM,
  [S.duck]: SWING_Z,
  [S.flowers]: FLOWERS_Z,
  [S.coconuts]: COCONUT_Z,
  [S.door]: DOOR_GUIDE_Z,
};

/** Which way the guide looks during each movement (0 faces the sea, π the island). */
const ACT_YAW = [Math.PI, Math.PI, Math.PI, 0, 0, 0, Math.PI, Math.PI, Math.PI, Math.PI, Math.PI];

/** Seconds of one paddle stroke cycle, as in the paddle clip. */
const PADDLE_PERIOD = 2.8;
/** How much more the paddle tips than the line between the hands. */
const PADDLE_TILT = 1.3;
const LEAN_PERIOD = 3.4;
const PUSH_PERIOD = 2.6;
const STONE_PERIOD = 2;
/** When the first hop onto a stone starts, and how long each hop takes. */
const STONE_HOP_START = 0.8;
const STONE_HOP = 0.6;

function build(stage: Stage, guide: Guide, cue: (c: Cue) => void): StoryWorld {
  const scene = stage.scene;
  const rnd = seeded(1234);
  stage.setSky(DAY, SUNSET, 0);
  stage.updateReflections();

  // --- Land, sea and sky ---------------------------------------------------
  scene.add(makeTerrain());
  const sea = makeWater(800, 240, new THREE.Vector2(0, -4), 40, "#45d6cf", "#1b6db6");
  scene.add(sea.mesh);
  const lagoonWater = new THREE.Mesh(
    new THREE.CircleGeometry(7.8, 64),
    new THREE.MeshPhysicalMaterial({ color: "#3fd3c8", roughness: 0.08, transparent: true, opacity: 0.82, clearcoat: 1 }),
  );
  lagoonWater.rotation.x = -Math.PI / 2;
  lagoonWater.position.set(LAGOON.x, LAGOON_LEVEL, LAGOON.y);
  lagoonWater.receiveShadow = true;
  scene.add(lagoonWater);
  const brook = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 3.6),
    new THREE.MeshPhysicalMaterial({ color: "#5cc8e6", roughness: 0.1, transparent: true, opacity: 0.85, clearcoat: 1 }),
  );
  brook.rotation.x = -Math.PI / 2;
  brook.position.set(0, 0.42, 25.4);
  brook.receiveShadow = true;
  scene.add(brook);

  const far1 = makeFarIsland(1.4, 300);
  far1.position.set(-150, -0.5, -40);
  const far2 = makeFarIsland(1.0, 310);
  far2.position.set(170, -0.5, -170);
  const far3 = makeFarIsland(0.8, 320);
  far3.position.set(-60, -0.5, 160);
  scene.add(mergeStatic(new THREE.Group().add(far1, far2, far3)));

  const clouds: THREE.Group[] = [];
  for (let i = 0; i < 12; i++) {
    const cloud = makeCloud(400 + i);
    const a = (i / 12) * TAU + rnd() * 0.4;
    const d = 170 + rnd() * 120;
    cloud.position.set(Math.cos(a) * d, 45 + rnd() * 35, Math.sin(a) * d);
    cloud.lookAt(0, cloud.position.y, 0);
    cloud.scale.setScalar(1 + rnd() * 0.8);
    clouds.push(cloud);
    scene.add(cloud);
  }

  // --- Plants and rocks ----------------------------------------------------
  // They never move, so they are baked together at the end.
  const scenery = new THREE.Group();
  for (let i = 0, placed = 0; i < 2000 && placed < 46; i++) {
    const x = (rnd() - 0.5) * 56;
    const z = -4 + (rnd() - 0.5) * 82;
    if (!freeSpot(x, z) || groundHeight(x, z) > 2.5) continue;
    const palm = makePalm(5 + rnd() * 3.5, 100 + i);
    palm.position.set(x, groundHeight(x, z) - 0.1, z);
    palm.rotation.y = rnd() * TAU;
    scenery.add(palm);
    placed++;
  }
  for (let i = 0, placed = 0; i < 3000 && placed < 70; i++) {
    const x = (rnd() - 0.5) * 56;
    const z = -4 + (rnd() - 0.5) * 82;
    if (!freeSpot(x, z)) continue;
    const bush = makeBush(0.7 + rnd() * 0.9, 500 + i);
    bush.position.set(x, groundHeight(x, z) - 0.1, z);
    scenery.add(bush);
    placed++;
  }
  for (let i = 0, placed = 0; i < 2000 && placed < 34; i++) {
    const x = (rnd() - 0.5) * 60;
    const z = -4 + (rnd() - 0.5) * 88;
    const h = groundHeight(x, z);
    if (h < -0.4 || (Math.abs(x) < 3 && z > -12) || Math.hypot(x - LAGOON.x, z - LAGOON.y) < 8) continue;
    const rock = makeRock(0.4 + rnd() * 0.9, 900 + i);
    rock.position.set(x, h, z);
    scenery.add(rock);
    placed++;
  }
  scene.add(makeGroundCover(rnd));
  // Bushes framing the path, so walking feels like going into the jungle.
  for (let i = 0; i < 26; i++) {
    const z = 30 - i * 1.6;
    const side = i % 2 ? 1 : -1;
    const x = side * (2.6 + rnd() * 1.2);
    if (Math.abs(z - 25.4) < 2.2 || Math.abs(z - SWING_PIVOT_Z) < 1.4) continue;
    const bush = makeBush(0.6 + rnd() * 0.5, 700 + i);
    bush.position.set(x, groundHeight(x, z) - 0.05, z);
    scenery.add(bush);
  }
  scene.add(mergeStatic(scenery));

  // --- Things of the story -------------------------------------------------
  const canoe = makeCanoe();
  scene.add(canoe);
  const paddle = makePaddle();
  scene.add(paddle);

  const parrot = makeParrot();
  scene.add(parrot.group);

  const stones: THREE.Mesh[] = [];
  const stoneCount = 5;
  for (let i = 0; i < stoneCount; i++) {
    const stone = makeRock(0.36, 60 + i, "#b8aea4");
    stone.scale.set(1, 0.45, 0.9);
    const z = BROOK_FROM - 0.65 - i * 0.65;
    stone.position.set((i % 2 ? 0.08 : -0.08), 0.42, z);
    stones.push(stone);
    scene.add(stone);
  }

  const swing = makeSwing();
  swing.group.position.set(0, groundHeight(0, SWING_PIVOT_Z), SWING_PIVOT_Z);
  scene.add(swing.group);

  const flowerSpots: [number, number, number, string][] = [
    [-2.7, FLOWERS_Z - 2.2, 2.3, "#ff6fa8"],
    [2.8, FLOWERS_Z - 1.8, 2.0, "#b388ff"],
    [-1.4, FLOWERS_Z - 3.6, 2.7, "#ff9f43"],
    [1.6, FLOWERS_Z - 4.0, 2.5, "#ff5d73"],
    [-3.9, FLOWERS_Z - 4.4, 3.0, "#64c8ff"],
  ];
  const flowers = flowerSpots.map(([x, z, h, color], i) => {
    const f = makeFlower(h, color, 80 + i);
    f.group.position.set(x, groundHeight(x, z) - 0.05, z);
    scene.add(f.group);
    return f;
  });
  const butterflyColors = ["#ffd23f", "#ff7eb6", "#7bd3ff", "#b388ff", "#ffffff", "#ff9f43"];
  const butterflies = butterflyColors.map((c) => {
    const b = makeButterfly(c);
    b.group.visible = false;
    scene.add(b.group);
    return b;
  });

  const coconuts = Array.from({ length: 6 }, (_, i) => {
    const nut = makeCoconut(i + 3);
    nut.visible = false;
    scene.add(nut);
    return nut;
  });

  const door = makeDoor();
  door.group.position.set(0, groundHeight(0, DOOR_Z), DOOR_Z);
  scene.add(door.group);

  const raft = makeRaft();
  scene.add(raft);
  const chest = makeChest();
  chest.group.position.y = 0.2;
  chest.group.rotation.y = Math.PI;
  raft.add(chest.group);
  const ropeMat = mat("#d9b77a", 0.9);
  let rope: THREE.Mesh | null = null;

  const crabs = Array.from({ length: 5 }, (_, i) => {
    const crab = makeCrab();
    const x = [-2.1, 2.6, -3.4, 3.8, -1.2][i];
    const z = SHORE.z + [-0.2, 0.6, 1.0, -0.3, 1.6][i];
    crab.group.position.set(x, groundHeight(x, z), z);
    crab.group.rotation.y = Math.PI;
    const holder = new THREE.Group();
    holder.position.set(x, groundHeight(x, z) - 0.6, z);
    holder.rotation.y = Math.PI + (x > 0 ? -0.4 : 0.4);
    crab.group.position.set(0, 0, 0);
    holder.add(crab.group);
    scene.add(holder);
    return { ...crab, holder, ground: groundHeight(x, z) };
  });

  const confetti = makeConfetti(400);
  const spray = makeConfetti(240, ["#ffffff", "#d8f6ff", "#9fe4ff"], 0.9);
  const gold = makeConfetti(160, ["#ffd23f", "#ffcc33", "#fff1a8"], 1.4);
  scene.add(confetti.mesh, spray.mesh, gold.mesh);
  const trail = makeTrail();
  scene.add(trail.mesh);

  // --- Helpers -------------------------------------------------------------
  const focus = v3(0, 0, BOAT_START);
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const fromPos = new THREE.Vector3();
  const fromLook = new THREE.Vector3();
  const midPos = new THREE.Vector3();
  const midLook = new THREE.Vector3();
  const spot = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const restQ = new THREE.Quaternion();
  const heldQ = new THREE.Quaternion();
  const basis = new THREE.Matrix4();
  const bladeY = [1, 1];
  let sunsetDone = -1;
  let lastTime = 0;
  let lastOpening = -1;

  const actLength = (step: number) => sequence.steps[step].seconds - TRAVEL[step] - PRAISE;

  /** Boat position (z) at a moment of the story. */
  const boatZ = (step: number, act: number) => {
    if (step < S.paddle) return BOAT_START;
    if (step > S.paddle) return BOAT_END;
    if (act <= 0) return BOAT_START;
    const len = actLength(S.paddle);
    const k = clamp01(act / len);
    // Each stroke pushes the canoe a bit, so it surges with the paddling.
    const surge = Math.sin((act / (PADDLE_PERIOD / 2)) * TAU) * 0.012 * (1 - k);
    return BOAT_START + (BOAT_END - BOAT_START) * (smooth(k) * 0.4 + k * 0.6 + surge);
  };

  /** Raft position (z) at a moment of the story: pulled in with the rope. */
  const raftAt = (step: number, act: number) => {
    if (step < S.rope || (step === S.rope && act <= 0)) return RAFT_FROM;
    if (step > S.rope) return RAFT_TO;
    const k = clamp01(act / (actLength(S.rope) - 0.5));
    return RAFT_FROM + (RAFT_TO - RAFT_FROM) * (k + Math.sin((act * TAU) / 0.9) * 0.01 * (1 - k));
  };

  /** How far the camera stands from Tapsi, so the whole body with the arms up fills most of the picture. */
  const frameDistance = () => {
    const cam = stage.camera;
    const v = THREE.MathUtils.degToRad(cam.fov / 2);
    const h = Math.atan(Math.tan(v) * cam.aspect);
    return Math.max(1.15 / Math.tan(v), 0.95 / Math.tan(h));
  };

  /** Tapsi standing at `at` and facing `yaw`, seen from the front (or from behind), big in the middle. */
  function portrait(at: THREE.Vector3, yaw: number, pos: THREE.Vector3, look: THREE.Vector3, behind = false, height = 1.0, far = 1) {
    const d = frameDistance() * far;
    const a = behind ? yaw + Math.PI : yaw;
    pos.set(at.x + Math.sin(a) * d, at.y + (behind ? 1.45 : height), at.z + Math.cos(a) * d);
    look.set(at.x, at.y + 0.8, at.z);
  }

  /** Where Tapsi stands while showing and doing a step's movement (smoothed while hopping). */
  function actSpot(step: number, act: number, out: THREE.Vector3) {
    if (step <= S.paddle) return out.set(0, CANOE_FLOOR, boatZ(step, act) + 0.4);
    if (step === S.brook) {
      const k = clamp01((act - STONE_HOP_START) / ((stoneCount + 1) * STONE_PERIOD));
      return out.set(0, 0.45, BROOK_FROM + (BROOK_TO - BROOK_FROM) * smooth(k));
    }
    const z = step >= S.rope ? SHORE.z : step === S.duck ? SWING_Z : ARRIVE[step];
    return out.set(0, groundHeight(0, z), z);
  }

  /** The camera of a step from when Tapsi shows the movement until the praise: position and point looked at. */
  function actShot(step: number, f: { local: number; act: number; praise: number; time: number }, pos: THREE.Vector3, look: THREE.Vector3) {
    const at = actSpot(step, f.act, spot);
    switch (step) {
      case S.paddle:
        // From behind, as if sitting in the canoe too: left and right are the child's left and right.
        portrait(at, ACT_YAW[step], pos, look, true);
        return;
      case S.duck: {
        // The camera ducks along, so the branch sweeps over us too.
        const t = f.act + DEMO[step];
        const dip = t > 0 && f.act < actLength(step) ? duckDepth(t) : 0;
        portrait(at, ACT_YAW[step], pos, look);
        pos.y -= dip * 0.55;
        look.y -= dip * 0.3;
        return;
      }
      case S.door: {
        // In front of the door, so Tapsi pushes towards us; once it is open, round behind Tapsi to see it sink away.
        portrait(at, ACT_YAW[step], pos, look);
        const reveal = smooth(f.praise / 1.6);
        if (reveal > 0) {
          tmpA.set(0.7, at.y + 2.1, at.z + 2.8);
          tmpB.set(0, at.y + 1.6, DOOR_Z);
          orbitBlend(at, pos, look, tmpA, tmpB, reveal, pos, look);
        }
        return;
      }
      case S.rope: {
        // A little higher, so the chest shows when it arrives; then back to see it beside Tapsi.
        portrait(at, ACT_YAW[step], pos, look, false, 1.5, 1.1);
        const reveal = smooth(f.praise / 1.6);
        tmpA.set(at.x - 0.5, at.y + 1.9, at.z - 4.2);
        tmpB.set(at.x + 0.4, at.y + 0.6, at.z - 0.5);
        pos.lerp(tmpA, reveal);
        look.lerp(tmpB, reveal);
        return;
      }
      case S.hooray:
        // Further back: the open chest in front, Tapsi cheering in the middle.
        pos.set(at.x - 0.5, at.y + 1.9, at.z - 4.2);
        look.set(at.x + 0.4, at.y + 0.6, at.z - 0.5);
        return;
      case S.party:
        // Slowly a little to and fro, the crabs dancing around.
        portrait(at, ACT_YAW[step] + Math.sin(f.local * 0.35) * 0.3, pos, look, false, 1.1, 1.15);
        return;
      case S.bye: {
        // At the end the camera rises and flies back to show the whole island at sunset.
        portrait(at, ACT_YAW[step], pos, look, false, 1.1, 1.15);
        const k = smooth((f.act - actLength(step) + 1.5) / 7);
        pos.lerp(tmpA.set(-12, 21, SHORE.z - 26), k);
        look.lerp(tmpA.set(0, 2, 2), k);
        return;
      }
      default:
        portrait(at, ACT_YAW[step], pos, look);
    }
  }

  /**
   * Blends two camera shots by going round `center` (Tapsi) instead of
   * straight through: from behind to the front the camera circles past.
   */
  function orbitBlend(center: THREE.Vector3, aPos: THREE.Vector3, aLook: THREE.Vector3, bPos: THREE.Vector3, bLook: THREE.Vector3, k: number, pos: THREE.Vector3, look: THREE.Vector3) {
    const ax = aPos.x - center.x;
    const az = aPos.z - center.z;
    const bx = bPos.x - center.x;
    const bz = bPos.z - center.z;
    const from = Math.atan2(ax, az);
    let turn = Math.atan2(bx, bz) - from;
    turn -= Math.round(turn / TAU) * TAU;
    // Nearly opposite: always the same way round, so it never flips between frames.
    if (Math.abs(turn) > Math.PI - 0.25) turn = Math.abs(turn);
    const a = from + turn * k;
    const r = Math.hypot(ax, az) + (Math.hypot(bx, bz) - Math.hypot(ax, az)) * k;
    const y = aPos.y + (bPos.y - aPos.y) * k;
    look.lerpVectors(aLook, bLook, k);
    pos.set(center.x + Math.sin(a) * r, y, center.z + Math.cos(a) * r);
  }

  /** The camera in the opening: the island from above the sea, then along the trail to the chest; after the cut, above the canoe. */
  function openingShot(t: number, pos: THREE.Vector3, look: THREE.Vector3) {
    if (t >= OPENING_CUT) {
      const k = smooth((t - OPENING_CUT) / (OPENING - OPENING_CUT));
      pos.set(4, 5.5 - k * 1.2, BOAT_START + 7 - k);
      look.set(0, 1, BOAT_START);
      return;
    }
    const head = trail.head(trailAt(t), tmpA);
    // High up like over a map, so the drawn part of the trail shows; closer once it has reached the chest.
    const near = 1 - 0.45 * smooth((t - TRAIL_TO) / 2);
    const into = smooth((t - 1) / 2.5);
    pos.set(12, 30, BOAT_START + 24).lerp(tmpB.set(head.x + 2 * near, head.y + 22 * near, head.z + 16 * near), into);
    look.set(0, 0, 12).lerp(tmpB.set(head.x, head.y, head.z - 2), into);
  }

  /** How far the trail is drawn at a moment of the opening, 0..1. */
  const trailAt = (t: number) => smooth((t - TRAIL_FROM) / (TRAIL_TO - TRAIL_FROM));

  /** Which step's place the trail is passing in the opening. */
  function pointingAt(t: number) {
    if (t >= OPENING_CUT) return undefined;
    if (t < TRAIL_FROM) return S.hello;
    const z = trail.head(trailAt(t), tmpA).z;
    const places: [number, number][] = [
      [S.rope, SHORE.z + 1],
      [S.door, DOOR_Z + 2],
      [S.coconuts, COCONUT_Z + 2],
      [S.flowers, FLOWERS_Z + 2],
      [S.duck, SWING_Z + 2],
      [S.brook, BROOK_FROM + 2],
    ];
    return places.find(([, at]) => z < at)?.[0] ?? S.paddle;
  }

  /** The guide's place and facing during a step. */
  function placeGuide(f: StoryFrame) {
    const { step } = f;
    let walking = false;
    let x = 0;
    let z = 0;
    let y: number | null = null;
    let yaw = ACT_YAW[step];
    const walkStart = (from: number, to: number, startAt = 0.3) => {
      const end = f.lead - f.demo - 0.5;
      const k = clamp01((f.local - startAt) / (end - startAt));
      walking = f.local > startAt && f.local < end;
      z = from + (to - from) * k;
      // Face the way it walks, then turn to the act's direction before showing it.
      const turn = smooth((f.local - (end - 0.6)) / 0.8);
      yaw = Math.PI + (ACT_YAW[step] - Math.PI) * turn;
    };

    if (step <= S.paddle) {
      const bz = boatZ(step, f.act);
      z = bz + 0.4;
      // Standing on the floor of the canoe, low enough for the paddle to reach the water.
      y = CANOE_FLOOR + Math.sin(f.time * 1.3) * 0.03;
    } else if (step === S.brook) {
      if (f.act < -f.demo) {
        // Hop out of the canoe, then walk to the brook.
        if (f.local < 1) {
          const k = smooth(f.local);
          z = BOAT_END + 0.4 - k * 1.6;
          y = (1 - k) * 0.02 + k * groundHeight(0, z) + Math.sin(k * Math.PI) * 0.5;
          yaw = Math.PI;
        } else {
          walkStart(BOAT_END - 1.2, BROOK_FROM, 1);
        }
      } else {
        // A hop to the next stone on every second knee lift, the last one onto the far bank.
        const at = (i: number) => (i <= 0 ? BROOK_FROM : i > stoneCount ? BROOK_TO : stones[i - 1].position.z);
        const top = (i: number) => (i > 0 && i <= stoneCount ? 0.52 : groundHeight(0, at(i)));
        const h = (f.act - STONE_HOP_START) / STONE_PERIOD;
        const from = Math.max(0, Math.min(stoneCount + 1, Math.floor(h)));
        const to = Math.min(stoneCount + 1, from + 1);
        const part = h < 0 ? 0 : smooth(clamp01(((h - from) * STONE_PERIOD) / STONE_HOP));
        z = at(from) + (at(to) - at(from)) * part;
        y = top(from) + (top(to) - top(from)) * part + Math.sin(part * Math.PI) * 0.18;
      }
    } else if (step === S.duck) {
      if (f.act < 0) walkStart(BROOK_TO, SWING_Z);
      else z = SWING_Z;
    } else if (step >= S.flowers && step <= S.door) {
      const from = step === S.flowers ? SWING_Z : step === S.coconuts ? FLOWERS_Z : COCONUT_Z;
      if (f.act < 0) walkStart(from, ARRIVE[step]);
      else z = ARRIVE[step];
    } else if (step === S.rope && f.local < 2.5) {
      // Into the light behind the door; the flash hides the jump to the bay.
      walking = f.local > 0.3;
      z = DOOR_GUIDE_Z - smooth((f.local - 0.3) / 2.2) * 3.4;
      yaw = Math.PI;
    } else {
      x = SHORE.x;
      z = SHORE.z;
    }
    guide.root.position.set(x, y ?? groundHeight(x, z), z);
    guide.root.rotation.y = yaw;
    return walking;
  }

  function updateWorld(f: StoryFrame) {
    const { step, act, time } = f;
    const len = actLength(step);
    const inAct = act >= 0 && act <= len;

    // Canoe and paddle.
    const bz = boatZ(step, act);
    canoe.position.set(0, -0.05 + Math.sin(time * 1.3) * 0.03, bz);
    canoe.rotation.set(Math.sin(time * 1.1) * 0.02, 0, Math.sin(time * 0.9) * 0.03);
    if (step > S.paddle) {
      canoe.position.y = 0.05;
      canoe.rotation.set(0.04, 0.15, 0.06);
    }
    // The paddle lies flat across the canoe in front of Tapsi, who takes it up
    // in both hands when showing how to paddle and puts it back down after.
    canoe.updateMatrixWorld(true);
    const restPos = canoe.localToWorld(tmpA.set(0, 0.47, 0.05));
    basis.extractRotation(canoe.matrixWorld);
    restQ.setFromRotationMatrix(basis.multiply(new THREE.Matrix4().makeBasis(v3(0, 0, 1), v3(1, 0, 0), v3(0, 1, 0))));
    const hold = step === S.paddle && f.opening === null ? smooth((act + f.demo) / 0.7) * (1 - smooth(f.praise / 0.9)) : 0;
    if (hold > 0) {
      guide.root.updateMatrixWorld(true);
      const left = guide.handL.getWorldPosition(new THREE.Vector3());
      const right = guide.handR.getWorldPosition(new THREE.Vector3());
      // The shaft runs from hand to hand; tipped a little more than the hands, so the low blade reaches the water.
      const along = left.clone().sub(right);
      const flat = Math.hypot(along.x, along.z);
      const tilt = Math.atan2(along.y, flat) * PADDLE_TILT;
      const shaft = v3((along.x / flat) * Math.cos(tilt), Math.sin(tilt), (along.z / flat) * Math.cos(tilt));
      // The blades face the way the canoe goes.
      const ahead = v3(Math.sin(guide.root.rotation.y), 0, Math.cos(guide.root.rotation.y));
      ahead.addScaledVector(shaft, -ahead.dot(shaft)).normalize();
      heldQ.setFromRotationMatrix(basis.makeBasis(new THREE.Vector3().crossVectors(shaft, ahead), shaft, ahead));
      paddle.position.lerpVectors(restPos, left.add(right).multiplyScalar(0.5), hold);
      paddle.quaternion.slerpQuaternions(restQ, heldQ, hold);
    } else {
      paddle.position.copy(restPos);
      paddle.quaternion.copy(restQ);
    }
    // A splash whenever a blade dips into the water.
    paddle.updateMatrixWorld(true);
    for (const [i, end] of [1, -1].entries()) {
      const tip = paddle.localToWorld(tmpB.set(0, end * (PADDLE_REACH - 0.15), 0));
      if (hold > 0.9 && bladeY[i] >= 0.12 && tip.y < 0.12) {
        spray.burst(v3(tip.x, 0.1, tip.z), 22, 3);
        cue("splash");
      }
      bladeY[i] = tip.y;
    }

    // Brook: a splash whenever the fox lands on a stone.
    if (step === S.brook && inAct) {
      for (let n = 0; n < stoneCount; n++) {
        if (crossed(f, LEAD[S.brook] + STONE_HOP_START + n * STONE_PERIOD + STONE_HOP)) {
          spray.burst(v3(stones[n].position.x, 0.45, stones[n].position.z), 18, 2.5);
          cue("splash");
        }
      }
    }
    for (const [i, stone] of stones.entries()) stone.position.y = 0.42 + Math.sin(time * 2 + i) * 0.01;

    // The swinging branch: one pass over Tapsi for every duck of the clip; then it swings up and stays there.
    let swingAngle = Math.sin(time * 0.8) * 0.05;
    if (step === S.duck && act > -1.5) {
      const amp = 0.77 * smooth((act + 1.5) / 1.5) * (1 - smooth((act - len) / 2.5));
      swingAngle = amp * Math.cos((act / 6) * TAU);
      swingAngle += (SWING_PARKED - swingAngle) * smooth((act - len - 0.5) / 2);
      for (let n = 0; n < 5; n++) if (crossed(f, LEAD[S.duck] + 0.9 + n * 3)) cue("whoosh");
    } else if (step > S.duck) {
      swingAngle = SWING_PARKED + Math.sin(time * 0.8) * 0.03;
    }
    swing.pivot.rotation.x = -swingAngle;

    // Flowers open with the arms and stay open after the second time.
    let bloom = step > S.flowers ? 1 : 0;
    if (step === S.flowers && act > 0) {
      const k = (act / 4) % 1;
      const arms = k < 0.1 ? 0 : k < 0.45 ? smooth((k - 0.1) / 0.35) : k < 0.7 ? 1 : 1 - smooth((k - 0.7) / 0.25);
      const stay = act > 4.3 ? smooth((act - 4.3) / 1.2) : 0;
      bloom = Math.max(arms, stay);
      for (let n = 0; n < 3; n++) if (crossed(f, LEAD[S.flowers] + 0.6 + n * 4)) cue("sparkle");
    }
    flowers.forEach((fl, i) => fl.open(clamp01(bloom * 1.15 - i * 0.04)));
    butterflies.forEach((b, i) => {
      const out = step >= S.flowers && step <= S.coconuts && (step > S.flowers || bloom > 0.6 || act > 4.3);
      b.group.visible = out;
      if (!out) return;
      const home = flowerSpots[i % flowerSpots.length];
      const a = time * (0.7 + i * 0.13) + i;
      b.group.position.set(home[0] + Math.sin(a) * 1.4, home[2] + 0.4 + Math.sin(a * 1.7) * 0.6, home[1] + Math.cos(a * 0.8) * 1.2);
      b.group.rotation.y = a + Math.PI / 2;
      b.flap(time + i);
    });

    // Coconuts roll past, each on the side the fox leans away from.
    coconuts.forEach((nut, i) => {
      const pass = 0.25 * LEAN_PERIOD + i * (LEAN_PERIOD / 2);
      const dt = act - pass;
      const on = step === S.coconuts && dt > -2.8 && dt < 2.6 && pass < len;
      nut.visible = on;
      if (!on) return;
      const z = COCONUT_Z + dt * 4.2;
      const x = i % 2 ? 0.95 : -0.95;
      nut.position.set(x, groundHeight(x, z) + 0.5 + Math.abs(Math.sin(dt * 5)) * 0.06, z);
      nut.rotation.set(z / 0.5, 0, 0);
      if (crossed(f, LEAD[S.coconuts] + pass - 0.25)) cue("whoosh");
    });

    // The door: every push moves it a little and makes the spiral glow; then it sinks away.
    let push = 0;
    let open = step > S.door ? 1 : 0;
    if (step === S.door && act > 0) {
      const cycles = act / PUSH_PERIOD;
      const n = Math.floor(cycles);
      push = Math.min(3, n + smooth(((cycles % 1) - 0.05) / 0.35));
      open = smooth((act - len + 0.5) / 2.5);
      for (let c = 0; c < 4; c++) if (crossed(f, LEAD[S.door] + 0.5 + c * PUSH_PERIOD)) cue("rumble");
      if (crossed(f, LEAD[S.door] + len - 0.3)) cue("chime");
    }
    door.set(push * (1 - open), open, step === S.door ? clamp01(push / 3) : open);

    // The chest on its raft comes closer with the pulling, then opens.
    const raftZ = raftAt(step, act);
    if (step === S.rope && act > 0) {
      for (let n = 0; n < 6; n++) if (crossed(f, LEAD[S.rope] + 0.9 + n * 1.8)) cue("splash");
    }
    raft.position.set(RAFT_X, LAGOON_LEVEL + Math.sin(time * 1.4) * 0.03, raftZ);
    raft.rotation.z = Math.sin(time * 1.1) * 0.03;
    // In the opening the chest waits far out in the bay, at the end of the trail.
    raft.visible = step >= S.door || f.opening !== null;
    let lid = step > S.hooray ? 1 : 0;
    if (step === S.hooray) {
      // It opens first, then Tapsi cheers.
      lid = smooth((f.local - 0.6) / 1.2);
      if (crossed(f, 0.8)) cue("chime");
    }
    chest.open(lid);
    if (step === S.hooray) {
      for (let n = 0; n < 10; n++) {
        if (crossed(f, 1.0 + n * 1.1)) {
          raft.updateMatrixWorld(true);
          gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 18, 4.5);
          confetti.burst(tmpA.add(v3(-1, 0.6, 0.5)), 30, 5);
          cue(n % 2 ? "pop" : "sparkle");
        }
      }
    }

    // The rope from the chest to the fox's paws.
    if (rope) {
      scene.remove(rope);
      rope.geometry.dispose();
      rope = null;
    }
    if (step === S.rope && f.local > 2.5 && act < len + 0.5) {
      guide.root.updateMatrixWorld(true);
      raft.updateMatrixWorld(true);
      guide.handL.getWorldPosition(tmpA);
      guide.handR.getWorldPosition(tmpB);
      const hands = tmpA.add(tmpB).multiplyScalar(0.5);
      const end = chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0, 0.4, 0.45));
      const mid = hands.clone().lerp(end, 0.5);
      mid.y -= 0.25 + 0.15 * Math.sin(time * 3);
      const behind = hands.clone().add(v3(0.3, -0.6, 0.6));
      const curve = new THREE.CatmullRomCurve3([behind, hands, mid, end]);
      rope = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.03, 6), ropeMat);
      rope.castShadow = true;
      scene.add(rope);
    }

    // Party: crabs come out of the sand and dance; confetti now and then.
    const party = step === S.party ? smooth(f.local / 1.5) : step > S.party ? 1 : 0;
    crabs.forEach((crab, i) => {
      crab.holder.position.y = crab.ground - 0.6 + party * 0.6;
      crab.holder.visible = step >= S.party;
      crab.dance(time + i * 0.4, step === S.party ? 1 : 0.3);
    });
    if (step === S.party) {
      for (let n = 0; n < 6; n++) {
        if (crossed(f, 1 + n * 2.2)) {
          confetti.burst(v3((n % 2 ? 1 : -1) * 2.5, 2.5, SHORE.z - 1), 40, 4);
          cue("pop");
        }
      }
    }

    // Kiki: on the chest at the party, otherwise flying around the fox.
    const g = guide.root.position;
    const perch = step >= S.hooray ? chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0, 1.0, 0)) : null;
    const fly = v3(g.x + Math.cos(time * 1.1) * 1.1, g.y + 2.3 + Math.sin(time * 2.3) * 0.2, g.z + Math.sin(time * 1.1) * 0.8);
    let flying = true;
    if (perch) {
      const settle = step === S.hooray ? smooth((f.local - 1) / 1.5) : 1;
      parrot.group.position.copy(fly).lerp(perch, settle);
      flying = settle < 0.95;
      if (step === S.party) parrot.group.position.y += Math.abs(Math.sin(time * 6)) * 0.12;
    } else {
      parrot.group.position.copy(fly);
    }
    const face = flying ? Math.atan2(-Math.sin(time * 1.1), Math.cos(time * 1.1)) : Math.atan2(camPos.x - parrot.group.position.x, camPos.z - parrot.group.position.z);
    parrot.group.rotation.set(0, face, 0);
    parrot.flap(time, flying);
    if (perch === null && crossed(f, 2)) cue("tweet");

    // Sunset during the party and the goodbye.
    const dusk = step === S.party ? smooth(f.local / sequence.steps[S.party].seconds) * 0.7 : step > S.party ? 0.7 + smooth(f.local / 6) * 0.3 : 0;
    stage.setSky(DAY, SUNSET, dusk);
    const band = Math.floor(dusk * 4);
    if (band !== sunsetDone) {
      sunsetDone = band;
      stage.updateReflections();
    }

    // The opening: the trail draws itself to the chest, which sparkles when it gets there.
    const opening = f.opening ?? OPENING;
    trail.show(opening < OPENING_CUT ? trailAt(opening) : 0);
    if (lastOpening < TRAIL_TO + 0.2 && opening >= TRAIL_TO + 0.2 && opening < OPENING_CUT) {
      raft.updateMatrixWorld(true);
      gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 40, 5);
      cue("chime");
    }
    lastOpening = opening;

    for (const [i, cloud] of clouds.entries()) cloud.position.x += Math.sin(i) * 0.002;
    sea.time.value = time;
    const dt = Math.max(0, Math.min(0.1, time - lastTime));
    lastTime = time;
    confetti.update(dt);
    spray.update(dt);
    gold.update(dt);
  }

  return {
    focus,
    update(f) {
      const walking = placeGuide(f);
      updateWorld(f);

      // Camera: follow the walk from behind, then come round to Tapsi's front
      // (behind, for paddling) before the movement is shown.
      const g = guide.root.position;
      const travel = f.lead - f.demo;
      if (f.opening !== null) {
        openingShot(f.opening, camPos, camLook);
      } else if (f.step === S.hello) {
        actShot(f.step, f, camPos, camLook);
        openingShot(OPENING, fromPos, fromLook);
        orbitBlend(g, fromPos, fromLook, camPos, camLook, smooth(f.local / travel), camPos, camLook);
      } else if (f.step === S.rope && f.local >= 2.5) {
        // After the flash, straight in front of Tapsi at the bay.
        actShot(f.step, f, camPos, camLook);
      } else {
        actShot(f.step, f, camPos, camLook);
        const prev = f.step - 1;
        const prevEnd = { local: sequence.steps[prev].seconds + DEMO[prev], act: actLength(prev) + PRAISE, praise: PRAISE, time: f.time };
        actShot(prev, prevEnd, fromPos, fromLook);
        midPos.copy(fromPos);
        midLook.copy(fromLook);
        if (travel >= 4) {
          // A chase camera behind the fox while it walks.
          tmpA.set(g.x + 0.9, g.y + 2.4, g.z + 4.6);
          tmpB.set(g.x, g.y + 1.0, g.z - 3);
          orbitBlend(g, fromPos, fromLook, tmpA, tmpB, smooth(f.local / 1.3), midPos, midLook);
        }
        const settle = travel >= 4 ? smooth((f.local - (travel - 1.6)) / 1.8) : smooth(f.local / Math.max(1.2, travel));
        orbitBlend(g, midPos, midLook, camPos, camLook, settle, camPos, camLook);
      }
      // A gentle breathing of the camera, like it is held by hand.
      camPos.x += Math.sin(f.time * 0.6) * 0.03;
      camPos.y += Math.sin(f.time * 0.8) * 0.02;
      stage.camera.position.copy(camPos);
      stage.camera.lookAt(camLook);
      // Lean the view with the fox while dodging coconuts.
      if (f.step === S.coconuts && f.act > 0 && f.act < actLength(f.step)) {
        stage.camera.rotateZ(Math.sin((f.act / LEAN_PERIOD) * TAU) * 0.05);
      }
      focus.copy(guide.root.position);

      const flash =
        f.opening !== null
          ? Math.max(0, 1 - Math.abs(f.opening - OPENING_CUT) / 0.6)
          : f.step === S.rope
            ? Math.max(0, 1 - Math.abs(f.local - 2.5) / 0.9)
            : 0;
      return { walking, flash, pointing: f.opening !== null ? pointingAt(f.opening) : undefined };
    },
  };
}

export const TREASURE_ISLAND: Story = {
  sequence,
  opening: {
    seconds: OPENING,
    lines: [
      { at: 0.4, text: "Schau mal – da hinten ist die Schatzinsel!" },
      { at: 3.2, text: "Wir paddeln mit dem Kanu hinüber, hüpfen über den Bach …" },
      { at: 7.4, text: "… und laufen durch den Dschungel bis zur Tür im Felsen." },
      { at: 11, text: "Und dahinter liegt ein Schatz!" },
      { at: 13.9, text: "Kommst du mit?" },
    ],
  },
  lead: LEAD,
  demo: DEMO,
  praise: PRAISE,
  lines: [
    { icon: "👋", situation: "Ahoi! Ich bin Tapsi. Und das ist Kiki, mein Papagei.", instruction: "Ich winke dir mal Hallo!", turn: "Winkst du auch?", again: "Hallo, hallo!", praise: "Schön, dass du da bist!" },
    { icon: "🛶", situation: "Los geht's – zur Schatzinsel!", instruction: "Schau: das Paddel rechts ins Wasser – und links.", turn: "Paddel mit!", again: "Paddeln, paddeln – die Insel kommt näher!", praise: "Geschafft! Wir sind am Strand." },
    { icon: "🪨", situation: "Oh, ein Bach! Da liegen Steine.", instruction: "Schau: Knie ganz hoch – so!", turn: "Jetzt du – von Stein zu Stein!", again: "Hoch das Knie – platsch!", praise: "Super, trockene Füße!" },
    { icon: "🌿", situation: "Huch, was schaukelt denn da?", instruction: "Wenn der Ast kommt, ducken wir uns – so!", turn: "Er kommt! Duck dich!", again: "Und nochmal ducken!", praise: "Puh, der Ast ist vorbei!" },
    { icon: "🌸", situation: "Psst … die Blumen schlafen noch.", instruction: "Hände zusammen – und ganz weit auf. So!", turn: "Jetzt du – weck die Blumen!", again: "Langsam auf … und wieder zu.", praise: "Wie schön! Alle Blumen sind wach." },
    { icon: "🥥", situation: "Da oben kullert etwas!", instruction: "Wir neigen uns zur Seite – so!", turn: "Kokosnuss! Neig dich mit!", again: "Und zur anderen Seite!", praise: "Alle Kokosnüsse sind vorbeigekullert." },
    { icon: "🚪", situation: "Eine Tür im Felsen! Die ist aber schwer.", instruction: "Mit beiden Händen fest drücken – so!", turn: "Jetzt du – drück mit!", again: "Fest drücken – sie bewegt sich!", praise: "Die Tür ist offen!" },
    { icon: "🪢", situation: "Da schwimmt die Schatztruhe!", instruction: "Hand über Hand am Seil ziehen – so!", turn: "Zieh mit!", again: "Ziehen, ziehen – sie kommt!", praise: "Die Truhe ist da!" },
    { icon: "🙌", situation: "Oh! Was ist da drin?", instruction: "Gold! Arme hoch – Hurra!", turn: "Du auch – Hurra!", again: "Hurra, ein Schatz!", praise: "So viel Gold!" },
    { icon: "💃", situation: "Jetzt wird gefeiert!", instruction: "Ich schüttel mich – so!", turn: "Tanz mit!", again: "Die Krebse tanzen auch!", praise: "Was für eine Party!" },
    { icon: "🌅", situation: "Die Sonne geht unter.", instruction: "Ich winke Tschüss!", turn: "Winkst du mit?", again: "Tschüss, Kiki! Tschüss, Insel!", praise: "Danke fürs Mitmachen! Bis bald!" },
  ],
  build,
};
