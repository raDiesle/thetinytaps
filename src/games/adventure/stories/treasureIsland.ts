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
  return {
    group,
    /** k: 0 shut, 1 fully open (sunk into the ground); glow: 0..1 how bright the spiral is. */
    set(push: number, open: number, glowK: number) {
      slab.position.set(0, -open * 3.6, -push * 0.35);
      spiralMat.emissiveIntensity = 0.4 + glowK * 3;
      (glow.material as THREE.MeshBasicMaterial).opacity = Math.max(glowK * 0.25, open);
      light.intensity = glowK * 6 + open * 30;
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

/** Where things happen; z along the path. */
const BOAT_START = 62;
const BOAT_END = 35;
const BROOK_FROM = 27.3;
const BROOK_TO = 23.4;
const SWING_Z = 16.5;
const FLOWERS_Z = 9.5;
const COCONUT_Z = 2.5;
const DOOR_Z = -9.9;
const DOOR_GUIDE_Z = -8.5;
const SHORE = v3(0, 0, -21.8);
const RAFT_X = 1.35;
const RAFT_FROM = -35;
const RAFT_TO = -23.5;

/** The step indices of the sequence, by name. */
const S = { hello: 0, paddle: 1, brook: 2, duck: 3, flowers: 4, coconuts: 5, door: 6, rope: 7, hooray: 8, party: 9, bye: 10 } as const;

const LEAD = [0, 2, 5, 5, 5, 5, 6, 5, 0, 1, 1];
const PRAISE = 3;

/** Where each walk ends: the guide's position when the step's movement starts. */
const ARRIVE: Record<number, number> = {
  [S.brook]: BROOK_FROM,
  [S.duck]: SWING_Z,
  [S.flowers]: FLOWERS_Z,
  [S.coconuts]: COCONUT_Z,
  [S.door]: DOOR_GUIDE_Z,
};

/** Which way the guide looks during each movement (0 faces the sea, i.e. the camera on the path). */
const ACT_YAW = [Math.PI, Math.PI - 0.5, Math.PI - 0.7, 0.45, 0, 0, Math.PI, Math.PI, Math.PI, Math.PI, Math.PI];

/** Seconds of one paddle stroke cycle, as in the paddle clip. */
const PADDLE_PERIOD = 2.8;
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
    if (Math.abs(z - 25.4) < 2.2 || Math.abs(z - SWING_Z) < 1.4) continue;
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
  swing.group.position.set(0, groundHeight(0, SWING_Z + 1.9), SWING_Z + 1.9);
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

  // --- Helpers -------------------------------------------------------------
  const focus = v3(0, 0, BOAT_START);
  const camPos = new THREE.Vector3();
  const camLook = new THREE.Vector3();
  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  let sunsetDone = -1;
  let lastTime = 0;

  const actLength = (step: number) => sequence.steps[step].seconds - LEAD[step] - PRAISE;

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

  /** The camera of a step's movement: position and point looked at. */
  function actShot(step: number, f: { local: number; act: number; time: number }, pos: THREE.Vector3, look: THREE.Vector3) {
    switch (step) {
      case S.hello: {
        const k = smooth((f.local - 0.5) / 6);
        // Low over the water, so Kiki on the flag stays above the fox's head.
        pos.set(14, 9, BOAT_START + 14).lerp(tmpA.set(0.6, 1.3, BOAT_START - 5.2), k);
        look.set(0, 2, 25).lerp(tmpA.set(0, 1.15, BOAT_START), k);
        return;
      }
      case S.paddle: {
        // From ahead, so the fox paddles towards us (and we towards it).
        const z = boatZ(step, f.act);
        pos.set(3.2, 1.9, z - 4.2);
        look.set(0, 1.0, z + 0.4);
        return;
      }
      case S.brook:
        pos.set(4.3, 1.9, 25.3);
        look.set(0, 0.9, 25.2);
        return;
      // On the island the heights are above the ground where the fox stands.
      case S.duck: {
        const dip = f.act > 0 && f.act < actLength(step) ? duckDepth(f.act) : 0;
        const ground = groundHeight(0, SWING_Z);
        pos.set(0.15, ground + 1.35 - dip * 0.55, SWING_Z + 3.8);
        look.set(0, ground + 1.05 - dip * 0.3, SWING_Z);
        return;
      }
      case S.flowers: {
        const ground = groundHeight(0, FLOWERS_Z);
        pos.set(0, ground + 1.75, FLOWERS_Z + 4.7);
        look.set(0, ground + 1.55, FLOWERS_Z - 1.3);
        return;
      }
      case S.coconuts: {
        const ground = groundHeight(0, COCONUT_Z);
        pos.set(0, ground + 1.5, COCONUT_Z + 4.1);
        look.set(0, ground + 1.0, COCONUT_Z - 2.5);
        return;
      }
      case S.door: {
        const ground = groundHeight(0, DOOR_GUIDE_Z);
        pos.set(3.3, ground + 1.9, DOOR_GUIDE_Z + 3.6);
        look.set(0, ground + 1.6, DOOR_Z + 0.4);
        return;
      }
      case S.rope: {
        // Behind the raft, so the chest comes along towards the fox.
        pos.set(RAFT_X - 0.6, 2.4, raftAt(step, f.act) - 4.2);
        look.set(0.6, 1.0, SHORE.z - 0.4);
        return;
      }
      case S.hooray:
        pos.set(-2.3, 2.1, SHORE.z - 6.6);
        look.set(0.6, 1.2, SHORE.z - 0.8);
        return;
      case S.party: {
        const a = -0.35 + f.local * 0.045;
        pos.set(Math.sin(a) * 6.4, 2.0, SHORE.z - Math.cos(a) * 6.4);
        look.set(0.4, 1.0, SHORE.z - 0.5);
        return;
      }
      default: {
        // Goodbye: the camera rises and flies back to show the whole island at sunset.
        const k = smooth((f.local - 2) / 9);
        const a = -0.35 + (sequence.steps[S.party].seconds + f.local) * 0.045;
        pos.set(Math.sin(a) * 6.4, 2.0, SHORE.z - Math.cos(a) * 6.4).lerp(tmpA.set(-12, 21, SHORE.z - 26), k);
        look.set(0.4, 1.0, SHORE.z - 0.5).lerp(tmpA.set(0, 2, 2), k);
      }
    }
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
      const end = f.lead - 0.5;
      const k = clamp01((f.local - startAt) / (end - startAt));
      walking = f.local > startAt && f.local < end;
      z = from + (to - from) * k;
      // Face the way it walks, then turn to the act's direction.
      const turn = smooth((f.local - (end - 0.2)) / 0.8);
      yaw = Math.PI + (ACT_YAW[step] - Math.PI) * turn;
    };

    if (step <= S.paddle) {
      const bz = boatZ(step, f.act);
      z = bz + 0.4;
      y = 0.02 + Math.sin(f.time * 1.3) * 0.03;
      if (step === S.paddle && f.local < 1.2) yaw = Math.PI + (ACT_YAW[S.paddle] - Math.PI) * smooth(f.local / 1.2);
    } else if (step === S.brook) {
      if (f.act < 0) {
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
    const holding = step === S.paddle && f.local > 0.8;
    if (holding) {
      guide.root.updateMatrixWorld(true);
      guide.handL.getWorldPosition(tmpA);
      guide.handR.getWorldPosition(tmpB);
      const upper = tmpA.y > tmpB.y ? tmpA : tmpB;
      const lower = upper === tmpA ? tmpB : tmpA;
      paddle.position.copy(upper).add(lower).multiplyScalar(0.5);
      paddle.quaternion.setFromUnitVectors(v3(0, 1, 0), upper.clone().sub(lower).normalize());
    } else {
      paddle.position.set(0.25, canoe.position.y + 0.45, bz + 1.2);
      paddle.rotation.set(Math.PI / 2, 0, 0.3);
    }
    if (step === S.paddle && inAct) {
      // A splash at each stroke, on the side the blade dips in.
      for (let n = 0; n < 12; n++) {
        const at = LEAD[S.paddle] + 0.35 * PADDLE_PERIOD + n * (PADDLE_PERIOD / 2);
        if (crossed(f, at)) {
          spray.burst(v3(n % 2 ? -0.9 : 0.9, 0.1, bz - 0.4), 22, 3);
          cue("splash");
        }
      }
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

    // The swinging branch: one pass for every duck of the clip.
    let swingAngle = Math.sin(time * 0.8) * 0.05;
    if (step === S.duck && act > -1.5) {
      const amp = 0.77 * smooth((act + 1.5) / 1.5) * (1 - smooth((act - len) / 2.5));
      swingAngle = amp * Math.cos((act / 6) * TAU);
      for (let n = 0; n < 5; n++) if (crossed(f, LEAD[S.duck] + 0.9 + n * 3)) cue("whoosh");
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
    raft.visible = step >= S.door;
    let lid = step > S.hooray ? 1 : 0;
    if (step === S.hooray) {
      lid = smooth((act - 0.6) / 1.2);
      if (crossed(f, LEAD[S.hooray] + 0.8)) cue("chime");
    }
    chest.open(lid);
    if (step === S.hooray && act > 0.6) {
      for (let n = 0; n < 8; n++) {
        if (crossed(f, LEAD[S.hooray] + 1.0 + n * 1.1)) {
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

    // Kiki: on the canoe's flag, on the chest at the party, otherwise flying around the fox.
    const g = guide.root.position;
    const perch = step <= S.paddle ? v3(0, canoe.position.y + 1.6, bz + 2.0) : step >= S.hooray ? chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0, 1.0, 0)) : null;
    const fly = v3(g.x + Math.cos(time * 1.1) * 1.1, g.y + 2.3 + Math.sin(time * 2.3) * 0.2, g.z + Math.sin(time * 1.1) * 0.8);
    let flying = true;
    if (perch) {
      const settle = step === S.hooray ? smooth((f.local - 1) / 1.5) : 1;
      parrot.group.position.copy(fly).lerp(perch, settle);
      flying = settle < 0.95;
      if (step === S.party) parrot.group.position.y += Math.abs(Math.sin(time * 6)) * 0.12;
    } else {
      const leave = step === S.brook ? smooth(f.local / 1.5) : 1;
      parrot.group.position.copy(v3(0, 1.6, BOAT_END + 2.0)).lerp(fly, leave);
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

      // Camera: follow the walk from behind, then glide to the movement's shot.
      actShot(f.step, f, camPos, camLook);
      if (f.step > 0 && !(f.step === S.rope && f.local >= 2.5)) {
        const prev = f.step - 1;
        const prevEnd = { local: sequence.steps[prev].seconds, act: actLength(prev) + PRAISE, time: f.time };
        const fromPos = new THREE.Vector3();
        const fromLook = new THREE.Vector3();
        actShot(prev, prevEnd, fromPos, fromLook);
        const g = guide.root.position;
        let midPos = fromPos;
        let midLook = fromLook;
        if (f.lead >= 4) {
          // A chase camera behind the fox while it walks.
          midPos = v3(g.x + 0.9, g.y + 2.4, g.z + 4.6);
          midLook = v3(g.x, g.y + 1.0, g.z - 3);
          const into = smooth(f.local / 1.3);
          midPos = fromPos.clone().lerp(midPos, into);
          midLook = fromLook.clone().lerp(midLook, into);
        }
        const settle = f.lead >= 4 ? smooth((f.local - (f.lead - 1.6)) / 1.8) : smooth(f.local / 1.8);
        camPos.lerpVectors(midPos, camPos, settle);
        camLook.lerpVectors(midLook, camLook, settle);
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

      const flash = f.step === S.rope ? Math.max(0, 1 - Math.abs(f.local - 2.5) / 0.9) : 0;
      return { walking, flash };
    },
  };
}

export const TREASURE_ISLAND: Story = {
  sequence,
  lead: LEAD,
  praise: PRAISE,
  lines: [
    { icon: "👋", situation: "Ahoi! Ich bin Tapsi. Und das ist Kiki, mein Papagei.", instruction: "Wink mal Hallo!", again: "Hallo, hallo!", praise: "Schön, dass du da bist!" },
    { icon: "🛶", situation: "Da hinten ist die Schatzinsel!", instruction: "Paddel mit! Zur einen Seite – und zur anderen.", again: "Paddeln, paddeln – die Insel kommt näher!", praise: "Geschafft! Wir sind am Strand." },
    { icon: "🪨", situation: "Oh, ein Bach! Da liegen Steine.", instruction: "Knie hoch – von Stein zu Stein!", again: "Hoch das Knie – platsch!", praise: "Super, trockene Füße!" },
    { icon: "🌿", situation: "Huch, was schaukelt denn da?", instruction: "Der Ast kommt! Duck dich!", again: "Und nochmal ducken!", praise: "Puh, der Ast ist vorbei!" },
    { icon: "🌸", situation: "Psst … die Blumen schlafen noch.", instruction: "Hände zusammen – und ganz weit auf!", again: "Langsam auf … und wieder zu.", praise: "Wie schön! Alle Blumen sind wach." },
    { icon: "🥥", situation: "Da oben kullert etwas!", instruction: "Kokosnuss! Neig dich zur Seite!", again: "Und zur anderen Seite!", praise: "Alle Kokosnüsse sind vorbeigekullert." },
    { icon: "🚪", situation: "Eine Tür im Felsen! Die ist aber schwer.", instruction: "Drück mit beiden Händen!", again: "Fest drücken – sie bewegt sich!", praise: "Die Tür ist offen!" },
    { icon: "🪢", situation: "Da schwimmt die Schatztruhe!", instruction: "Zieh am Seil – Hand über Hand!", again: "Ziehen, ziehen – sie kommt!", praise: "Die Truhe ist da!" },
    { icon: "🙌", instruction: "Arme hoch – Hurra!", again: "Hurra, ein Schatz!", praise: "So viel Gold!" },
    { icon: "💃", situation: "Jetzt wird gefeiert!", instruction: "Schüttel dich – tanz mit!", again: "Die Krebse tanzen auch!", praise: "Was für eine Party!" },
    { icon: "🌅", situation: "Die Sonne geht unter.", instruction: "Wink Tschüss!", again: "Tschüss, Kiki! Tschüss, Insel!", praise: "Danke fürs Mitmachen! Bis bald!" },
  ],
  build,
};
