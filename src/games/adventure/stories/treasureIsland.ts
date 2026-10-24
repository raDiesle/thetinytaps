import * as THREE from "three";
import { SEQUENCES } from "../library/sequences";
import {
  BRUSH_HIT,
  BRUSH_PERIOD,
  CRANK_PERIOD,
  duckDepth,
  isBump,
  JUMP_LANDING,
  JUMP_PEAK,
  JUMP_PERIOD,
  jumpProgress,
  KEY_PICKUP,
  KEY_TURN,
  keyTurn,
  SHAPE_SECONDS,
  STOP_DANCE,
  stopDance,
} from "../three/clips";
import { GUIDE_SIZE, type Guide } from "../three/guide";
import {
  CANOE_FEET,
  CANOE_HALF_LENGTH,
  CANOE_HALF_WIDTH,
  CANOE_RIM,
  makeBasket,
  makeBush,
  makeButterfly,
  makeCanoe,
  makeChest,
  makeCloud,
  makeConfetti,
  makeCrab,
  makeFlower,
  makeKey,
  makeMonkey,
  makePaddle,
  PADDLE_REACH,
  makePalm,
  makeParrot,
  makeRock,
  makeScorpion,
  mat,
  mergeStatic,
  seeded,
  solid,
} from "../three/props";
import { DAY, makeWater, SUNSET, type Stage } from "../three/stage";
import { crossed, type Cue, type Story, type StoryFrame, type StoryWorld } from "./story";

// "Die Schatzinsel": Tapsi greets us from the canoe and paddles to an island,
// stomps the scorpions on the beach away, hops over the little bridge across
// the brook and bumps star boxes with the head, ducks under a swinging log, wakes
// the flowers, cranks a wooden gate open, steps aside for rolling coconuts,
// dodges the monkeys' nuts in slow motion, picks apples, solves the riddle of
// the stone door, brushes the cobwebs out of the passage behind it, pulls the
// treasure chest ashore and unlocks it with the key Kiki brings – then Tapsi
// turns round to us and there is a party at sunset with a stop dance (when
// the music stops, Tapsi, Kiki and the crabs freeze) and fireworks. Every world reaction is timed to the
// guide's clip, so it happens together with the child's movement. Every
// movement stays on the spot: the child in front of the screen never has to
// go forwards.
//
// First a red dotted trail draws the way across the island to the chest, like
// on a treasure map. Tapsi greets us from the front, then the camera swings
// round behind. At every station Tapsi first shows the movement alone and the
// child joins in. Tapsi faces the island and the camera looks from behind, a
// little raised and to the side where the arms would hide behind the body:
// the child sees what Tapsi sees, and left is left. Over the brook it looks
// from the side, like a jump-and-run game. At the treasure Tapsi turns round
// and celebrates facing us.
//
// Island layout along the path (x ≈ 0), from the sea at +z to the bay at -z:
// beach 31.5 · brook 25.4 · swinging log 21 · flowers 15.5 · gate 10.5 ·
// rolling coconuts 6.6 · monkeys 2.4 · apple tree -1.4 · stone door in the
// cliff -9.9 with the cobwebs behind it · hidden bay with the chest around -30.

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
  // Where the camera stands behind Tapsi at the winch, and beside the brook.
  if (x > -7 && x < 1 && z > 10 && z < 17) return false;
  if (x > 0 && x < 10 && z > 20 && z < 30) return false;
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
  pivot.position.y = 5.7;
  group.add(pivot);
  // The log hangs just above Tapsi's ducked head: under it standing, over it ducked.
  const length = 3.85;
  const vine = mat("#3f7d2c", 0.9);
  for (const side of [1, -1]) {
    const rope = solid(new THREE.CylinderGeometry(0.04, 0.04, length, 6), vine);
    rope.position.set(1.3 * side, -length / 2, 0);
    pivot.add(rope);
  }
  const log = solid(new THREE.CylinderGeometry(0.3, 0.33, 3.4, 14), mat("#8a5c38", 0.9));
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
  // The spiral's light falls on whoever stands in front.
  const spiralLight = new THREE.PointLight("#7ff3ff", 0, 9, 1.4);
  spiralLight.position.set(0, 1.8, 1.6);
  group.add(spiralLight);
  return {
    group,
    /** open: 0 shut, 1 sunk into the ground; glowK: 0..1 how bright the spiral is. */
    set(open: number, glowK: number) {
      slab.position.set(0, -open * 3.6, 0);
      spiralMat.emissiveIntensity = 0.4 + glowK * 3;
      (glow.material as THREE.MeshBasicMaterial).opacity = Math.max(glowK * 0.25, open);
      light.intensity = glowK * 6 + open * 30;
      spiralLight.intensity = glowK * 9 * (1 - open);
    },
  };
}

/** A cobweb drawn on a canvas: threads from the corners and the middle, and a spiral round it. */
function cobwebTexture(seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const g = canvas.getContext("2d")!;
  const rnd = seeded(seed);
  const cx = 128 + (rnd() - 0.5) * 40;
  const cy = 120 + (rnd() - 0.5) * 40;
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineCap = "round";
  const spokes = 11;
  const ends: [number, number][] = [];
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * TAU + rnd() * 0.3;
    // Out to the edge of the picture, where the web hangs on the door frame.
    const r = 128 / Math.max(Math.abs(Math.cos(a)), Math.abs(Math.sin(a)));
    ends.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  g.lineWidth = 3;
  for (const [x, y] of ends) {
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(x, y);
    g.stroke();
  }
  // The spiral sags a little between the spokes.
  g.lineWidth = 2;
  for (let ring = 1; ring < 9; ring++) {
    const k = ring / 9;
    g.beginPath();
    for (let i = 0; i <= spokes; i++) {
      const [x, y] = ends[i % spokes];
      const px = cx + (x - cx) * k;
      const py = cy + (y - cy) * k;
      if (i === 0) g.moveTo(px, py);
      else {
        const [qx, qy] = ends[(i - 1) % spokes];
        const mx = cx + ((x + qx) / 2 - cx) * k * 0.88;
        const my = cy + ((y + qy) / 2 - cy) * k * 0.88;
        g.quadraticCurveTo(mx, my, px, py);
      }
    }
    g.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** A small, friendly spider on its thread: round body, eight bent legs and big eyes. */
function makeSpider() {
  const group = new THREE.Group();
  const body = mat("#3b2a4a", 0.6);
  const abdomen = solid(new THREE.SphereGeometry(0.075, 16, 12), body);
  abdomen.position.y = 0.03;
  abdomen.scale.set(1, 1.1, 0.9);
  group.add(abdomen);
  const head = solid(new THREE.SphereGeometry(0.05, 14, 10), body);
  head.position.set(0, -0.06, 0.03);
  group.add(head);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.02, 10, 8), mat("#ffffff", 0.3), false);
    eye.position.set(side * 0.02, -0.055, 0.075);
    group.add(eye);
    const pupil = solid(new THREE.SphereGeometry(0.01, 8, 6), mat("#111111", 0.3), false);
    pupil.position.set(side * 0.02, -0.055, 0.092);
    group.add(pupil);
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Group();
      leg.position.set(side * 0.05, -0.01 - i * 0.025, 0);
      leg.rotation.z = side * (0.5 + i * 0.25);
      const upper = solid(new THREE.CylinderGeometry(0.008, 0.008, 0.09, 5), body, false);
      upper.rotation.z = Math.PI / 2;
      upper.position.x = side * 0.045;
      leg.add(upper);
      const lower = solid(new THREE.CylinderGeometry(0.007, 0.006, 0.08, 5), body, false);
      lower.position.set(side * 0.09, -0.035, 0);
      lower.rotation.z = -side * 0.4;
      leg.add(lower);
      group.add(leg);
    }
  }
  const thread = solid(new THREE.CylinderGeometry(0.004, 0.004, 1, 4), mat("#ffffff", 0.4), false);
  thread.position.y = 0.6;
  group.add(thread);
  return { group, thread };
}

/** A wooden box with a golden star on each side, floating over the brook; bumped from below, a star pops out. */
function makeStarBox() {
  const group = new THREE.Group();
  const crate = new THREE.Group();
  group.add(crate);
  crate.add(solid(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat("#c48a4e", 0.8)));
  // Darker edges, like planks nailed round it.
  const edge = mat("#7a4f2b", 0.85);
  for (const [x, y, w, h] of [
    [0, 0.235, 0.52, 0.06],
    [0, -0.235, 0.52, 0.06],
    [0.235, 0, 0.06, 0.52],
    [-0.235, 0, 0.06, 0.52],
  ]) {
    const plank = solid(new THREE.BoxGeometry(w, h, 0.52), edge);
    plank.position.set(x, y, 0);
    crate.add(plank);
    const across = solid(new THREE.BoxGeometry(0.52, h, w), edge);
    across.position.set(0, y, x);
    crate.add(across);
  }
  const starShape = (outer: number, inner: number) => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU + Math.PI / 2;
      const r = i % 2 ? inner : outer;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return shape;
  };
  const goldMat = new THREE.MeshStandardMaterial({ color: "#ffd23f", emissive: "#ffb400", emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.4 });
  const faceStar = new THREE.ExtrudeGeometry(starShape(0.15, 0.065), { depth: 0.02, bevelEnabled: false });
  const faces: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const star = solid(faceStar, goldMat, false);
    const a = (i / 4) * TAU;
    star.position.set(Math.sin(a) * 0.255, 0, Math.cos(a) * 0.255);
    star.rotation.y = a;
    crate.add(star);
    faces.push(star);
  }
  const popStar = solid(
    new THREE.ExtrudeGeometry(starShape(0.2, 0.085), { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 }),
    new THREE.MeshStandardMaterial({ color: "#ffd23f", emissive: "#ffcc33", emissiveIntensity: 0.9, roughness: 0.25, metalness: 0.5 }),
  );
  popStar.geometry.center();
  popStar.visible = false;
  group.add(popStar);
  return {
    group,
    /** since: seconds since the head bumped it (negative before); time for idle motion. */
    set(since: number, time: number) {
      const bumped = since >= 0;
      // Hops up when bumped and settles again; before that it bobs a little.
      const hop = bumped && since < 0.5 ? Math.sin((since / 0.5) * Math.PI) * 0.22 : 0;
      crate.position.y = hop + (bumped ? 0 : Math.sin(time * 2.2) * 0.03);
      crate.rotation.z = bumped && since < 0.5 ? Math.sin((since / 0.5) * TAU) * 0.08 : 0;
      for (const star of faces) star.visible = !bumped;
      // The star jumps out of the top, then floats above it, turning.
      popStar.visible = bumped;
      if (bumped) {
        const up = smooth(since / 0.6);
        popStar.position.y = 0.3 + up * 0.75 + Math.sin(time * 2.5) * 0.04 * up;
        popStar.rotation.y = since * (since < 0.8 ? 9 : 2);
        popStar.scale.setScalar(0.4 + up * 0.6 + Math.sin(Math.min(1, since / 0.6) * Math.PI) * 0.3);
      }
    },
  };
}

/** The little wooden bridge over the brook: planks on two beams, arching a little, a post at each corner. */
function makeBridge() {
  const group = new THREE.Group();
  const wood = [mat("#b07a45", 0.8), mat("#9a6638", 0.8)];
  const dark = mat("#6e4a2a", 0.9);
  const length = BRIDGE_FROM - BRIDGE_TO;
  const count = Math.round(length / 0.22);
  const step = length / count;
  for (let i = 0; i < count; i++) {
    const z = BRIDGE_FROM - (i + 0.5) * step;
    const top = bridgeTop(0, z);
    // Following the arch: how steep it is here.
    const slope = -Math.atan(((-BRIDGE_ARCH * Math.PI) / length) * Math.cos((Math.PI * (BRIDGE_FROM - z)) / length));
    const plank = solid(new THREE.BoxGeometry(BRIDGE_HALF * 2, 0.06, step - 0.03), wood[i % 2]);
    plank.position.set(Math.sin(i * 1.7) * 0.02, top - 0.03, z);
    plank.rotation.x = slope;
    group.add(plank);
    for (const side of [-1, 1]) {
      const beam = solid(new THREE.BoxGeometry(0.1, 0.12, step + 0.02), dark);
      beam.position.set(side * (BRIDGE_HALF - 0.12), top - 0.12, z);
      beam.rotation.x = slope;
      group.add(beam);
    }
  }
  for (const side of [-1, 1]) {
    for (const z of [BRIDGE_FROM - 0.06, BRIDGE_TO + 0.06]) {
      const post = solid(new THREE.CylinderGeometry(0.05, 0.06, 0.6, 8), dark);
      post.position.set(side * (BRIDGE_HALF + 0.02), bridgeTop(0, z) + 0.05, z);
      group.add(post);
    }
    // A pile under the middle, down into the brook.
    const top = bridgeTop(0, (BRIDGE_FROM + BRIDGE_TO) / 2) - 0.18;
    const pile = solid(new THREE.CylinderGeometry(0.06, 0.07, top, 8), dark);
    pile.position.set(side * (BRIDGE_HALF - 0.12), top / 2, (BRIDGE_FROM + BRIDGE_TO) / 2);
    group.add(pile);
  }
  return group;
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
  y = Math.max(y, bridgeTop(x, z));
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
/** On the beach, where the scorpions come. */
const STOMP_Z = 31.5;
const BROOK_FROM = 27.3;
/** The hops over the brook, along the little bridge from one bank to the other. */
const JUMP_FROM = BROOK_FROM + 0.4;
const JUMP_STEP = 0.7;
const JUMPS = 6;
const JUMP_TO = JUMP_FROM - JUMPS * JUMP_STEP;
/** The little wooden bridge: where it starts and ends (z), half its width, the top of its deck at the ends and how much higher it arches in the middle. */
const BRIDGE_FROM = JUMP_FROM + 0.35;
const BRIDGE_TO = JUMP_TO - 0.35;
const BRIDGE_HALF = 0.6;
const BRIDGE_END = 0.87;
const BRIDGE_ARCH = 0.12;
/** How high above where Tapsi stands the star boxes float: the head just reaches them at the top of a jump. */
const BOX_ABOVE = 1.88;
const SWING_Z = 21;
/** The log hangs right over Tapsi and swings through above the head, from the front towards us and back. */
const SWING_PIVOT_Z = SWING_Z;
/** How far up in front the log waits (rad), and where it is hooked up afterwards, out of the way. */
const SWING_HELD = 0.77;
const SWING_PARKED = 1.1;
const FLOWERS_Z = 15.5;
/** The wooden gate across the path; half its opening, and how high it rises. */
const GATE_Z = 10.5;
const GATE_HALF = 1.3;
const GATE_LIFT = 1.9;
/** The winch beside the gate on the left; its crank turns in front of Tapsi's paws. */
const WINCH_X = -2.55;
const WINCH_Z = GATE_Z + 0.35;
/** How far in front of Tapsi and how high the paws turn the crank (measured on the clip). */
const CRANK_REACH = 0.39 * GUIDE_SIZE;
const CRANK_HEIGHT = 0.86 * GUIDE_SIZE;
const CRANK_ARM = 0.24 * GUIDE_SIZE;
const ROLL_Z = 6.6;
const MONKEY_Z = 2.4;
const APPLE_Z = -1.4;
const DOOR_Z = -9.9;
/** A step back from the door, so the three pictures above it show. */
const RIDDLE_Z = DOOR_Z + 3;
/** In the doorway where the door was, the cobwebs in front within reach of the sweeping paws. */
const WEB_STAND = DOOR_Z + 0.15;
/** The cobwebs behind the door: layers one behind the other, each with a left and a right half. */
const WEB_Z = DOOR_Z - 0.3;
const WEB_LAYERS = 4;
const WEB_GAP = 0.12;
const SHORE = v3(0, 0, -21.8);
/** Where Tapsi sits in the canoe, for the cameras. */
const CANOE_FLOOR = -0.08;
/** Where Tapsi lands after hopping out of the canoe over its right side (x, z), wading in the shallow water: ahead of the paddle's blade. */
const HOP_TO: [number, number] = [1.3, BOAT_END - 1.2];
const WADE = -0.3;
const RAFT_X = 1.3;
const RAFT_FROM = -35;
/** Pulled up to the beach, in front of Tapsi on the right. */
const RAFT_TO = -23.6;
/** Where the lock hangs on the chest (the chest's own space), and where the turning paw is, from Tapsi. */
const LOCK = v3(0, 0.62, 0.45);
const KEY_HAND = v3(-0.1, 0.95, 0.42).multiplyScalar(GUIDE_SIZE);
/** Where Tapsi celebrates, facing us. */
const PARTY = v3(0.3, 0, SHORE.z + 0.2);

/** The top of the bridge's deck at (x, z), or -Infinity off the bridge. */
function bridgeTop(x: number, z: number) {
  if (Math.abs(x) > BRIDGE_HALF || z > BRIDGE_FROM || z < BRIDGE_TO) return -Infinity;
  return BRIDGE_END + BRIDGE_ARCH * Math.sin((Math.PI * (BRIDGE_FROM - z)) / (BRIDGE_FROM - BRIDGE_TO));
}

/** Where Tapsi lands after `at` hops over the brook, on the bridge. */
const landingHeight = (at: number) => bridgeTop(0, JUMP_FROM - at * JUMP_STEP);

/** The step indices of the sequence, by name. */
const S = {
  hello: 0,
  paddle: 1,
  stomp: 2,
  jump: 3,
  duck: 4,
  flowers: 5,
  gate: 6,
  roll: 7,
  monkeys: 8,
  apples: 9,
  riddle: 10,
  webs: 11,
  rope: 12,
  key: 13,
  hooray: 14,
  party: 15,
  bye: 16,
} as const;

/** Seconds of travel before each step: walking or paddling there, or the camera coming in. */
const TRAVEL = [2.5, 3, 3, 3.5, 3, 3, 3, 4, 3, 3, 3.5, 2, 3.5, 2.5, 2.5, 2, 1];
/** Seconds Tapsi shows each movement alone first: whole loops of its clip, so the world stays in step. */
const DEMO = [2.5, 2.8, 1.6, 3 * JUMP_PERIOD, 3, 4, CRANK_PERIOD, 3, 3.4, 2.6, 2, BRUSH_PERIOD, 3.6, KEY_PICKUP + KEY_TURN, 2, STOP_DANCE[0].dance + STOP_DANCE[0].hold, 2];
const LEAD = TRAVEL.map((t, i) => t + DEMO[i]);
const PRAISE = 2.5;
const OPENING = 8;
/** In the opening: when the trail starts and reaches the chest, and the flash back to the canoe. */
const TRAIL_FROM = 0.6;
const TRAIL_TO = 5.2;
const OPENING_CUT = 6.6;

/** Tapsi faces the island (-z); 0 would face the sea. */
const ISLAND = Math.PI;

/** Seconds of one paddle stroke cycle, as in the paddle clip. */
const PADDLE_PERIOD = 2.8;
/** How much more the paddle tips than the line between the hands. */
const PADDLE_TILT = 1.3;
/** How far from its middle each paw holds the paddle while it lies on the lap (m). */
const PADDLE_GRIP = 0.22;
/** The paddle lying across: its shaft (y) along x, the blades flat (z up), in Tapsi's lap and in the canoe. */
const ACROSS = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v3(0, 0, 1), v3(1, 0, 0), v3(0, 1, 0)));
const ACROSS_CANOE = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(v3(0, 0, -1), v3(-1, 0, 0), v3(0, 1, 0)));
/** The stomp clip: a foot comes down every half period, the left one first. */
const STOMP_PERIOD = 1.6;
const SIDE_STEP_PERIOD = 3;
const LEAN_PERIOD = 3.4;
const REACH_PERIOD = 2.6;

const SCORPIONS = 10;
const ROLLERS = 4;
const THROWS = 8;
const APPLES = 8;

/** Four stick figures for the riddle: drawn on a canvas, the lines glow. */
function figureTexture(kind: number, glow: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const g = canvas.getContext("2d")!;
  g.fillStyle = glow ? "#000000" : "#9a8f82";
  g.fillRect(0, 0, 256, 256);
  if (!glow) {
    g.strokeStyle = "#7b7166";
    g.lineWidth = 16;
    g.beginPath();
    g.arc(128, 128, 112, 0, TAU);
    g.stroke();
  }
  g.strokeStyle = g.fillStyle = glow ? "#ffffff" : "#3f3a35";
  g.lineWidth = 14;
  g.lineCap = g.lineJoin = "round";
  const line = (...pts: number[]) => {
    g.beginPath();
    g.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    g.stroke();
  };
  const head = (x: number, y: number) => {
    g.beginPath();
    g.arc(x, y, 17, 0, TAU);
    g.fill();
  };
  if (kind === 0) {
    // Very tall: arms straight up.
    head(128, 76);
    line(128, 96, 128, 160);
    line(92, 30, 128, 104, 164, 30);
    line(106, 222, 128, 160, 150, 222);
  } else if (kind === 1) {
    // Very wide: a star.
    head(128, 78);
    line(128, 96, 128, 156);
    line(40, 96, 128, 108, 216, 96);
    line(66, 216, 128, 156, 190, 216);
  } else {
    // Very small: curled up.
    head(128, 128);
    line(128, 146, 128, 178);
    line(104, 162, 108, 196, 128, 178, 148, 196, 152, 162);
    line(104, 168, 128, 152, 152, 168);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** The three round pictures of the riddle over the door; `set(i, k)` lights picture i (0 dark, 1 bright). */
function makeRiddle() {
  const group = new THREE.Group();
  const frame = mat("#6f675e", 0.8);
  const plaques = [0, 1, 2].map((i) => {
    const material = new THREE.MeshStandardMaterial({
      map: figureTexture(i, false),
      emissiveMap: figureTexture(i, true),
      emissive: "#7ff3ff",
      emissiveIntensity: 0.15,
      roughness: 0.8,
    });
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.44, 40), material);
    face.position.set((i - 1) * 1.55, 0, 0.02);
    group.add(face);
    const ring = solid(new THREE.TorusGeometry(0.46, 0.05, 8, 40), frame);
    ring.position.copy(face.position);
    group.add(ring);
    return material;
  });
  return {
    group,
    set(i: number, k: number) {
      plaques[i].emissiveIntensity = 0.15 + k * 2.4;
    },
  };
}

/** The wooden gate between two posts, and the winch that lifts it on a rope. */
function makeGate() {
  const group = new THREE.Group();
  const wood = mat("#9a6a3e", 0.9);
  const dark = mat("#6e4a2a", 0.9);
  for (const side of [1, -1]) {
    const post = solid(new THREE.CylinderGeometry(0.17, 0.2, 3.6, 10), dark);
    post.position.set((GATE_HALF + 0.25) * side, 1.7, 0);
    group.add(post);
  }
  // Long enough on the left to carry the pulley over the winch.
  const beam = solid(new THREE.BoxGeometry(4.9, 0.26, 0.32), dark);
  beam.position.set(-0.45, 3.35, 0);
  group.add(beam);
  const pulley = solid(new THREE.CylinderGeometry(0.13, 0.13, 0.08, 16), mat("#5a5048", 0.6, { metalness: 0.4 }));
  pulley.rotation.x = Math.PI / 2;
  pulley.position.set(WINCH_X + 0.45, 3.12, 0.2);
  group.add(pulley);

  const gate = new THREE.Group();
  group.add(gate);
  for (let i = 0; i < 6; i++) {
    const x = -GATE_HALF + 0.22 + i * ((GATE_HALF * 2 - 0.44) / 5);
    const stake = solid(new THREE.CylinderGeometry(0.12, 0.12, 2.0, 8), wood);
    stake.position.set(x, 1.0, 0);
    gate.add(stake);
    const tip = solid(new THREE.ConeGeometry(0.12, 0.3, 8), wood);
    tip.position.set(x, 2.15, 0);
    gate.add(tip);
  }
  for (const y of [0.5, 1.5]) {
    const batten = solid(new THREE.BoxGeometry(GATE_HALF * 2 + 0.1, 0.14, 0.08), dark);
    batten.position.set(0, y, 0.13);
    gate.add(batten);
  }

  // The winch: a block with a drum, its axle pointing at Tapsi, and the crank on the near end.
  const winch = new THREE.Group();
  winch.position.set(WINCH_X, 0, WINCH_Z - GATE_Z);
  group.add(winch);
  const block = solid(new THREE.BoxGeometry(0.28, CRANK_HEIGHT, 0.28), dark);
  block.position.set(0, CRANK_HEIGHT / 2, -0.45);
  winch.add(block);
  const drum = solid(new THREE.CylinderGeometry(0.13, 0.13, 0.3, 14), wood);
  drum.rotation.x = Math.PI / 2;
  drum.position.set(0, CRANK_HEIGHT, -0.22);
  winch.add(drum);
  const axle = solid(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), dark);
  axle.rotation.x = Math.PI / 2;
  axle.position.set(0, CRANK_HEIGHT, -0.2);
  winch.add(axle);
  const crank = new THREE.Group();
  crank.position.set(0, CRANK_HEIGHT, 0);
  winch.add(crank);
  const arm = solid(new THREE.BoxGeometry(0.05, CRANK_ARM + 0.05, 0.04), dark);
  arm.position.y = CRANK_ARM / 2;
  crank.add(arm);
  const handle = solid(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8), mat("#c98d52", 0.6));
  handle.rotation.x = Math.PI / 2;
  handle.position.set(0, CRANK_ARM, 0.08);
  crank.add(handle);

  // The rope from the drum up over the pulley and down to the gate.
  const ropeMat = mat("#d9b77a", 0.9);
  const ropes = [0, 1].map(() => {
    const r = solid(new THREE.CylinderGeometry(0.02, 0.02, 1, 6), ropeMat, false);
    group.add(r);
    return r;
  });
  const stretch = (r: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) => {
    r.position.lerpVectors(a, b, 0.5);
    r.scale.y = a.distanceTo(b);
    r.quaternion.setFromUnitVectors(v3(0, 1, 0), b.clone().sub(a).normalize());
  };
  const drumTop = v3(WINCH_X, CRANK_HEIGHT + 0.13, WINCH_Z - GATE_Z - 0.22);
  const overPulley = v3(WINCH_X + 0.45, 3.25, 0.2);
  return {
    group,
    /** lift: how high the gate is (m); angle: the crank's turn (rad, 0 = up, as seen from Tapsi, positive anticlockwise). */
    set(lift: number, angle: number) {
      gate.position.y = lift;
      crank.rotation.z = angle;
      stretch(ropes[0], drumTop, overPulley);
      stretch(ropes[1], v3(WINCH_X + 0.58, 3.12, 0.2), v3(-GATE_HALF + 0.3, lift + 2.0, 0.05));
    },
  };
}

/** An apple tree leaning over the path, with its crown above Tapsi. */
function makeAppleTree() {
  const group = new THREE.Group();
  const bark = mat("#7b5233", 0.95);
  const trunk = solid(new THREE.CylinderGeometry(0.2, 0.3, 2.6, 10), bark);
  trunk.position.set(-1.6, 1.25, -1.0);
  trunk.rotation.z = -0.18;
  group.add(trunk);
  const bough = solid(new THREE.CylinderGeometry(0.1, 0.16, 2.4, 8), bark);
  bough.position.set(-0.5, 2.25, -0.75);
  bough.rotation.z = 1.25;
  group.add(bough);
  const leaves = ["#3d8f36", "#4ea640", "#5cb84a"];
  for (const [x, y, z, size, seed] of [
    [-1.3, 2.0, -1.0, 1.4, 61],
    [-0.4, 2.0, -0.6, 1.25, 62],
    [0.6, 2.05, -0.55, 1.15, 63],
  ]) {
    const crown = makeBush(size, seed, leaves);
    crown.position.set(x, y, z);
    group.add(crown);
  }
  return group;
}

/** A padlock; `open(k)` swings its shackle up. */
function makeLock() {
  const group = new THREE.Group();
  const metal = mat("#b8871f", 0.35, { metalness: 0.8 });
  const body = solid(new THREE.BoxGeometry(0.18, 0.16, 0.08), metal);
  group.add(body);
  const hole = solid(new THREE.BoxGeometry(0.025, 0.06, 0.01), mat("#1b1210"), false);
  hole.position.set(0, -0.01, 0.045);
  group.add(hole);
  const shackle = new THREE.Group();
  shackle.position.set(0.05, 0.08, 0);
  group.add(shackle);
  const loop = solid(new THREE.TorusGeometry(0.05, 0.015, 8, 16, Math.PI), mat("#c9c3b8", 0.3, { metalness: 0.9 }));
  loop.position.x = -0.05;
  shackle.add(loop);
  return {
    group,
    open(k: number) {
      shackle.position.y = 0.08 + k * 0.05;
      shackle.rotation.y = k * 1.2;
    },
  };
}

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
  // Bushes framing the path, so walking feels like going into the jungle; not where the stations stand.
  const busy = [SWING_PIVOT_Z, GATE_Z, MONKEY_Z - 2.4, APPLE_Z - 1];
  for (let i = 0; i < 26; i++) {
    const z = 30 - i * 1.6;
    const side = i % 2 ? 1 : -1;
    const x = side * (2.6 + rnd() * 1.2);
    if (Math.abs(z - 25.4) < 2.2 || busy.some((b) => Math.abs(z - b) < 1.6) || (side < 0 && z > GATE_Z && z < GATE_Z + 6)) continue;
    // Not between the path and the cameras beside the brook and the rolling coconuts.
    if (side > 0 && (Math.abs(z - 25.4) < 4.5 || Math.abs(z - ROLL_Z - 1.5) < 2.5)) continue;
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

  const scorpions = Array.from({ length: SCORPIONS }, (_, i) => {
    const sc = makeScorpion(i % 3 === 0 ? "#d9543a" : "#e98a3c");
    sc.group.visible = false;
    scene.add(sc.group);
    return sc;
  });

  const bridge = makeBridge();
  scene.add(bridge);
  // A star box over every second hop along the bridge: the third jump each time goes up into one.
  const boxes = [2, 4, JUMPS].map((at) => {
    const box = makeStarBox();
    box.group.position.set(0, landingHeight(at) + BOX_ABOVE + 0.25, JUMP_FROM - at * JUMP_STEP);
    scene.add(box.group);
    return box;
  });

  const swing = makeSwing();
  swing.group.position.set(0, groundHeight(0, SWING_PIVOT_Z), SWING_PIVOT_Z);
  scene.add(swing.group);

  const flowerSpots: [number, number, number, string][] = [
    // Two right beside Tapsi's paws, which open them; the others a little further on.
    [-1.2, FLOWERS_Z - 0.5, 1.2, "#ff6fa8"],
    [1.2, FLOWERS_Z - 0.5, 1.15, "#b388ff"],
    [-2.3, FLOWERS_Z - 1.7, 1.8, "#ff9f43"],
    [2.4, FLOWERS_Z - 1.9, 2.0, "#ff5d73"],
    [3.6, FLOWERS_Z - 3.4, 2.6, "#64c8ff"],
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

  const gate = makeGate();
  gate.group.position.set(0, groundHeight(0, GATE_Z), GATE_Z);
  scene.add(gate.group);

  const rollers = Array.from({ length: ROLLERS }, (_, i) => {
    const nut = makeCoconut(i + 3);
    nut.scale.setScalar(0.64);
    nut.visible = false;
    scene.add(nut);
    return nut;
  });

  // Two monkeys up in palms on either side of the path, a little ahead.
  const monkeys = [-1, 1].map((side) => {
    const palm = makePalm(4.6, side > 0 ? 610 : 620);
    const x = side * 2.5;
    const z = MONKEY_Z - 2.4;
    palm.position.set(x, groundHeight(x, z) - 0.1, z);
    // The palm leans along its own x: towards the path.
    palm.rotation.y = side > 0 ? Math.PI : 0;
    scene.add(palm);
    palm.updateMatrixWorld(true);
    const top = new THREE.Vector3(x, -1, z);
    palm.traverse((o) => {
      if (o instanceof THREE.Mesh && o.geometry.type === "CylinderGeometry") {
        const at = o.getWorldPosition(new THREE.Vector3());
        if (at.y > top.y) top.copy(at);
      }
    });
    const monkey = makeMonkey();
    const holder = new THREE.Group();
    holder.position.set(top.x, top.y - 0.55, top.z + 0.25);
    holder.rotation.y = Math.atan2(-top.x, MONKEY_Z - top.z);
    holder.add(monkey.group);
    scene.add(holder);
    return monkey;
  });
  const ringMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  const RING_TIMES = [-0.5, -0.32, -0.18, -0.07, 0.05, 0.17];
  const throws = Array.from({ length: THROWS }, (_, i) => {
    const nut = makeCoconut(i + 30);
    nut.scale.setScalar(0.34);
    nut.visible = false;
    scene.add(nut);
    const rings = RING_TIMES.map(() => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 6, 28), ringMat.clone());
      ring.visible = false;
      scene.add(ring);
      return ring;
    });
    return { nut, rings, curve: null as THREE.QuadraticBezierCurve3 | null };
  });

  const appleTree = makeAppleTree();
  appleTree.position.set(0, groundHeight(0, APPLE_Z), APPLE_Z);
  scene.add(appleTree);
  const basket = makeBasket();
  // Beside the path on the left, so Tapsi walks on past it.
  const basketAt = v3(-0.6, groundHeight(-0.6, APPLE_Z - 0.5), APPLE_Z - 0.5);
  basket.position.copy(basketAt);
  scene.add(basket);
  const appleMat = mat("#e3262f", 0.35);
  const stemMat = mat("#5a3a1f", 0.9);
  const apples = Array.from({ length: APPLES }, (_, i) => {
    const group = new THREE.Group();
    const apple = solid(new THREE.SphereGeometry(0.085, 14, 10), appleMat);
    apple.scale.set(1, 0.9, 1);
    group.add(apple);
    const stem = solid(new THREE.CylinderGeometry(0.008, 0.008, 0.3, 4), stemMat, false);
    stem.position.y = 0.2;
    group.add(stem);
    const leaf = solid(new THREE.SphereGeometry(0.04, 8, 6), mat("#4ea640", 0.8), false);
    leaf.scale.set(1, 0.3, 0.5);
    leaf.position.set(0.04, 0.12, 0);
    group.add(leaf);
    scene.add(group);
    // A little bunch at each paw's highest point; the paw reaches into it.
    const r = seeded(70 + i);
    return { group, stem, jitter: v3((r() - 0.5) * 0.24, r() * 0.12, (r() - 0.5) * 0.2) };
  });
  /** Where the paws are at the top of a reach (measured on the clip), from Tapsi: x to Tapsi's left. */
  const REACH_TOP = v3(0.28, 1.55, 0.05).multiplyScalar(GUIDE_SIZE);

  const door = makeDoor();
  door.group.position.set(0, groundHeight(0, DOOR_Z), DOOR_Z);
  scene.add(door.group);
  const riddle = makeRiddle();
  riddle.group.position.set(0, 4.05, 0.7);
  door.group.add(riddle.group);
  // Cobwebs in the passage behind the door, a left and a right half in every layer, the front ones first.
  const webGround = groundHeight(0, DOOR_Z);
  const webs = Array.from({ length: WEB_LAYERS * 2 }, (_, n) => {
    const layer = Math.floor(n / 2);
    // Even ones on Tapsi's left (-x, facing the island).
    const side = n % 2 === 0 ? -1 : 1;
    const web = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 2.1),
      new THREE.MeshBasicMaterial({ map: cobwebTexture(90 + n), transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
    );
    const home = v3(side * (0.78 + layer * 0.03), webGround + 1.3 + layer * 0.05, WEB_Z - layer * WEB_GAP);
    web.position.copy(home);
    // After the light of the open doorway, which would otherwise paint over the webs about as far away.
    web.renderOrder = 1;
    scene.add(web);
    return { web, home, side };
  });
  const spider = makeSpider();
  scene.add(spider.group);

  const raft = makeRaft();
  scene.add(raft);
  const chest = makeChest();
  chest.group.position.y = 0.2;
  raft.add(chest.group);
  const lock = makeLock();
  lock.group.position.copy(LOCK);
  chest.group.add(lock.group);
  const key = makeKey();
  key.visible = false;
  scene.add(key);
  const ropeMat = mat("#d9b77a", 0.9);
  let rope: THREE.Mesh | null = null;

  const crabs = Array.from({ length: 5 }, (_, i) => {
    const crab = makeCrab();
    // Around Tapsi and a little behind, all facing us, so they dance along with Tapsi.
    const x = PARTY.x + [-1.5, 1.7, -2.5, 2.7, -0.9][i];
    const z = PARTY.z + [-0.4, -0.2, 0.4, 0.3, -1.2][i];
    const holder = new THREE.Group();
    holder.position.set(x, groundHeight(x, z) - 0.6, z);
    holder.add(crab.group);
    scene.add(holder);
    return { ...crab, holder, ground: groundHeight(x, z) };
  });

  const confetti = makeConfetti(400);
  const spray = makeConfetti(240, ["#ffffff", "#d8f6ff", "#9fe4ff"], 0.9);
  const gold = makeConfetti(160, ["#ffd23f", "#ffcc33", "#fff1a8"], 1.4);
  const sand = makeConfetti(160, ["#f2d49b", "#e3c48e", "#fff1d0"], 0.8);
  const sparks = makeConfetti(600, ["#ff5d73", "#ffd23f", "#7bd3ff", "#b388ff", "#7bd389", "#ffffff"], 2);
  (sparks.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2;
  scene.add(confetti.mesh, spray.mesh, gold.mesh, sand.mesh, sparks.mesh);
  const rockets = Array.from({ length: 6 }, () => {
    const r = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color: "#fff3c4" }));
    r.visible = false;
    scene.add(r);
    return r;
  });
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
  const tmpC = new THREE.Vector3();
  const lapQ = new THREE.Quaternion();
  const rimQ = new THREE.Quaternion();
  const heldQ = new THREE.Quaternion();
  const tmpQ = new THREE.Quaternion();
  const basis = new THREE.Matrix4();
  const bladeY = [1, 1];
  let sunsetDone = -1;
  let lastTime = 0;
  let lastOpening = -1;

  const actLength = (step: number) => sequence.steps[step].seconds - TRAVEL[step] - PRAISE;
  /** The stop dance at the party: since when everyone is still, or null while the music plays (and before and after). */
  const stillAt = (step: number, clip: number) =>
    step === S.party && clip >= 0 && clip - DEMO[step] < actLength(step) ? stopDance(clip).still : null;
  /** Seconds of a step's clip that the world follows: from when Tapsi shows it until the praise. */
  const clipLength = (step: number) => DEMO[step] + actLength(step);

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

  /**
   * Tapsi standing at `at`, seen from the sea's side (from behind while
   * Tapsi faces the island), big in the middle. `side` turns the camera round
   * towards Tapsi's right (radians), so arms in front of the body still show;
   * `height` raises it to look over Tapsi's shoulders.
   */
  function rear(at: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3, side = 0, height = 1.45, far = 1) {
    const d = frameDistance() * far;
    const a = ISLAND + Math.PI + side;
    pos.set(at.x + Math.sin(a) * d, at.y + height, at.z + Math.cos(a) * d);
    look.set(at.x, at.y + 0.75, at.z);
  }

  /** Where Tapsi stands for a step's movement, (x, z). */
  function standAt(step: number): [number, number] {
    switch (step) {
      case S.stomp:
        return [0, STOMP_Z];
      case S.jump:
        return [0, JUMP_FROM];
      case S.duck:
        return [0, SWING_Z];
      case S.flowers:
        return [0, FLOWERS_Z];
      case S.gate:
        return [WINCH_X, WINCH_Z + CRANK_REACH];
      case S.roll:
        return [0, ROLL_Z];
      case S.monkeys:
        return [0, MONKEY_Z];
      case S.apples:
        return [0, APPLE_Z];
      case S.riddle:
        return [0, RIDDLE_Z];
      case S.webs:
        return [0, WEB_STAND];
      case S.key:
        // Tapsi faces -z, so its left is -x: the paw is KEY_HAND in front of it.
        return [RAFT_X + LOCK.x + KEY_HAND.x, RAFT_TO + LOCK.z + KEY_HAND.z];
      case S.hooray:
      case S.party:
      case S.bye:
        return [PARTY.x, PARTY.z];
      default:
        return [SHORE.x, SHORE.z];
    }
  }

  /** Where Tapsi is when a step's movement is over. */
  const endAt = (step: number): [number, number] => (step === S.jump ? [0, JUMP_TO] : standAt(step));

  /** The way to a step's place: from where the step before ended, round the winch after the gate. */
  const route = (step: number): [number, number][] =>
    step === S.roll ? [endAt(S.gate), [-0.2, WINCH_Z + CRANK_REACH + 0.1], standAt(S.roll)] : [endAt(step - 1), standAt(step)];

  /** A point `k` (0..1) of the way along a route, by distance. */
  function along(points: [number, number][], k: number): [number, number] {
    const lengths = points.slice(1).map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
    let d = k * lengths.reduce((a, b) => a + b, 0);
    for (const [i, len] of lengths.entries()) {
      if (d <= len || i === lengths.length - 1) {
        const u = len > 0 ? clamp01(d / len) : 1;
        return [points[i][0] + (points[i + 1][0] - points[i][0]) * u, points[i][1] + (points[i + 1][1] - points[i][1]) * u];
      }
      d -= len;
    }
    return points[points.length - 1];
  }

  /** Where Tapsi stands while showing and doing a step's movement. */
  function actSpot(step: number, act: number, out: THREE.Vector3) {
    if (step <= S.paddle) return out.set(0, CANOE_FLOOR, boatZ(step, act) + 0.4);
    if (step === S.jump) return jumpSpot(act + DEMO[S.jump], out);
    const [x, z] = standAt(step);
    return out.set(x, groundHeight(x, z), z);
  }

  /** How many jumps over the brook have moved Tapsi on at `clip` seconds into the jump clip (with the part in the air). */
  function jumpsDone(clip: number) {
    if (clip <= 0) return 0;
    const n = Math.floor(clip / JUMP_PERIOD);
    const before = n - Math.floor(n / 3);
    const now = isBump(n) ? 0 : jumpProgress(clip);
    return Math.min(JUMPS, before + now);
  }

  /** Seconds into the jump clip when the head bumps star box `n`: at the top of every third jump. */
  const bumpTime = (n: number) => (n * 3 + 2) * JUMP_PERIOD + JUMP_PEAK;

  /** Where Tapsi's feet are over the brook: on the bridge, or flying to the next spot on it (the clip adds the arc). */
  function jumpSpot(clip: number, out: THREE.Vector3) {
    const done = jumpsDone(clip);
    const from = Math.floor(done);
    const k = done - from;
    // After the last hop there is no next spot: past the bridge's end its top is -Infinity, and -Infinity * 0 is NaN.
    const y = k > 0 ? landingHeight(from) + (landingHeight(from + 1) - landingHeight(from)) * k : landingHeight(from);
    return out.set(0, y - bridgeDip(clip), JUMP_FROM - done * JUMP_STEP);
  }

  /** How far the bridge gives way under Tapsi's landings (m), `clip` seconds into the jump clip; it springs back. */
  function bridgeDip(clip: number) {
    if (clip < JUMP_LANDING || clip > clipLength(S.jump) + JUMP_PERIOD) return 0;
    const since = (clip - JUMP_LANDING) % JUMP_PERIOD;
    return 0.035 * Math.exp(-since * 7) * Math.cos(since * 22);
  }

  /** How far the crank has turned (whole turns) at a moment of the gate step; the gate follows. */
  const crankTurns = (clip: number) => Math.max(0, clip) / CRANK_PERIOD;

  /** The camera of a step from when Tapsi shows the movement until the praise: position and point looked at. */
  function actShot(step: number, f: { local: number; act: number; praise: number; time: number }, pos: THREE.Vector3, look: THREE.Vector3) {
    const at = actSpot(step, f.act, spot);
    const clip = f.act + DEMO[step];
    switch (step) {
      case S.hello:
        // From the front, a little to Tapsi's right, where Kiki flutters and Tapsi waves: hello to us too.
        rear(at, pos, look, Math.PI - 0.3, 1.2, 0.95);
        look.y -= 0.15;
        return;
      case S.paddle:
        // As if sitting in the canoe too.
        rear(at, pos, look, 0, 1.15);
        look.y -= 0.2;
        return;
      case S.stomp:
        // Raised and to the side, looking down at the feet and the scorpions.
        rear(at, pos, look, 0.4, 2.0);
        look.y = at.y + 0.3;
        return;
      case S.jump: {
        // From the side, like a jump-and-run game: Tapsi jumps from left to right over the bridge,
        // the boxes above; the camera glides along with the jumps.
        const k = clamp01(clip / clipLength(step));
        const z = JUMP_FROM - 0.9 - (JUMP_FROM - JUMP_TO - 0.4) * (k * 0.7 + smooth(k) * 0.3);
        const d = frameDistance() * 1.45;
        // Up with the far bank at the end, so the boxes stay in the picture.
        pos.set(d, at.y + 1.35, z);
        look.set(0, at.y + 1.3, z - 0.2);
        return;
      }
      case S.duck: {
        // Low behind Tapsi and to the side, looking up: the log swings over us and looks dangerous.
        const dip = clip > 0 && f.act < actLength(step) ? duckDepth(clip) : 0;
        rear(at, pos, look, 0.55, 0.45 - dip * 0.1, 0.9);
        look.set(at.x, at.y + 1.25 - dip * 0.2, at.z - 1.2);
        return;
      }
      case S.flowers:
        // Raised and to the side: the paws that come together in front show, and the flowers beside them.
        rear(at, pos, look, 0.5, 1.9);
        return;
      case S.gate: {
        // From behind on the left: the paws on the crank in front, the gate beyond; then through the open gate.
        const open = smooth(f.praise / 1.6);
        rear(at, pos, look, -0.85, 1.6, 1.45);
        look.x += 0.3 + open * 0.8;
        look.y += 0.3 + open * 0.4;
        return;
      }
      case S.roll:
        // From behind on the right, where the coconuts pass, looking up the path where they come from.
        rear(at, pos, look, 0.9, 1.75, 1.2);
        look.x += 0.3;
        look.z -= 1.4;
        return;
      case S.monkeys:
        // Behind Tapsi, swinging round a little with every nut like a slow-motion film; the monkeys up ahead.
        rear(at, pos, look, 0.2 + Math.sin((clip / LEAN_PERIOD) * TAU) * 0.25, 1.25, 1.0);
        look.set(at.x, at.y + 1.1, at.z - 1.2);
        return;
      case S.apples:
        // A little low, looking up into the tree.
        rear(at, pos, look, 0.35, 1.0, 1.0);
        look.y = at.y + 1.2;
        return;
      case S.riddle:
        // Further back, so the three pictures over the door show above Tapsi.
        rear(at, pos, look, 0.15, 1.2, 1.55);
        look.lerp(tmpB.set(0, groundHeight(0, DOOR_Z) + 3.1, DOOR_Z), 0.6);
        return;
      case S.webs: {
        // Behind Tapsi and raised, so the cobwebs left and right of the head show against the light;
        // once they are gone, up a little to look through the gorge.
        const reveal = smooth(f.praise / 1.6);
        rear(at, pos, look, 0.3, 1.6 + reveal * 0.6, 1.1 + reveal * 0.3);
        look.y = at.y + 1.25;
        look.lerp(tmpB.set(0, at.y + 1.4, DOOR_Z - 3), reveal * 0.6);
        return;
      }
      case S.rope:
        // To the side, so the pulling paws show, and high enough to see the chest come.
        rear(at, pos, look, 0.55, 2.0, 1.1);
        return;
      case S.key:
        // From behind on the right, close: the paw with the key and the lock.
        rear(at, pos, look, 0.7, 1.4, 0.9);
        look.set(RAFT_X, LAGOON_LEVEL + 0.2 + LOCK.y, RAFT_TO + LOCK.z);
        return;
      case S.hooray: {
        // First over Tapsi's shoulder at the opening chest; Tapsi turns round, and we see the face.
        cheerShot(at, tmpA, tmpB);
        rear(at, pos, look, 0.25, 1.3, 1.15);
        const k = smooth((f.local - 1.2) / 1.6);
        pos.lerpVectors(tmpA, pos, k);
        look.lerpVectors(tmpB, look, k);
        return;
      }
      case S.party:
        // In front of Tapsi, slowly a little to and fro, the crabs dancing around.
        rear(at, pos, look, Math.sin(f.local * 0.35) * 0.4, 1.5, 1.3);
        return;
      case S.bye: {
        // In front; at the end the camera rises and flies back to show the whole island at sunset.
        rear(at, pos, look, 0.3, 1.6, 1.25);
        look.y += 0.6;
        const k = smooth((f.act - actLength(step) + 1.5) / 7);
        pos.lerp(tmpA.set(-12, 21, SHORE.z - 26), k);
        look.lerp(tmpA.set(0, 2, 2), k);
        return;
      }
      default:
        rear(at, pos, look, 0, 1.6);
    }
  }

  /** Behind Tapsi and above, the chest in front: for when the lid opens. */
  function cheerShot(at: THREE.Vector3, pos: THREE.Vector3, look: THREE.Vector3) {
    pos.set(at.x - 0.6, at.y + 2.2, at.z + 3.6);
    look.set(RAFT_X - 0.4, at.y + 0.7, RAFT_TO + 0.4);
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
    const near = 1 - 0.45 * smooth((t - TRAIL_TO) / 1);
    const into = smooth((t - 0.2) / 1.4);
    pos.set(12, 30, BOAT_START + 24).lerp(tmpB.set(head.x + 2 * near, head.y + 24 * near, head.z + 18 * near), into);
    look.set(0, 0, 12).lerp(tmpB.set(head.x, head.y, head.z - 3), into);
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
      [S.webs, DOOR_Z + 1.5],
      [S.riddle, RIDDLE_Z + 1.5],
      [S.apples, APPLE_Z + 1.5],
      [S.monkeys, MONKEY_Z + 1.5],
      [S.roll, ROLL_Z + 1.5],
      [S.gate, GATE_Z + 1.5],
      [S.flowers, FLOWERS_Z + 2],
      [S.duck, SWING_Z + 2],
      [S.jump, BROOK_FROM + 1],
      [S.stomp, STOMP_Z + 2],
    ];
    return places.find(([, at]) => z < at)?.[0] ?? S.paddle;
  }

  /** How far the canoe has run up onto the beach: during the praise after the paddling. */
  const beached = (step: number, praise: number) => (step > S.paddle ? 1 : step === S.paddle ? smooth(praise / 1.2) : 0);

  /** The canoe rocks on the water, and comes to rest a little askew on the beach. */
  function placeCanoe(f: StoryFrame) {
    const { step, time } = f;
    const b = beached(step, f.praise);
    const rock = 1 - b;
    canoe.position.set(0, -0.05 + Math.sin(time * 1.3) * 0.03 * rock + b * 0.1, boatZ(step, f.act));
    canoe.rotation.set(Math.sin(time * 1.1) * 0.02 * rock + b * 0.04, b * 0.15, Math.sin(time * 0.9) * 0.03 * rock + b * 0.03);
    canoe.updateMatrixWorld(true);
  }

  /** How much Tapsi has put the paddle down on the rim of the canoe, in the praise after the paddling: over the knees and down. */
  const putDown = (step: number, praise: number) => (step > S.paddle ? 1 : step === S.paddle ? smooth((praise - 0.9) / 0.8) : 0);

  /**
   * The paddle is always in Tapsi's paws while in the canoe: lying across the
   * lap, then taken up to paddle – its shaft through both paws, tipped a little
   * more, so the low blade reaches the water – and back on the lap; after the
   * paddling Tapsi lays it across the rim in front and lets go. Waving hello,
   * one paw lets go of it.
   */
  function holdPaddle(f: StoryFrame) {
    const { step, act, praise } = f;
    const clip = act + f.demo;
    guide.root.updateMatrixWorld(true);
    // Across the lap, the blades flat; the paddle's own y (the shaft) to Tapsi's left.
    const lapPos = guide.lap.getWorldPosition(tmpA);
    lapQ.copy(guide.lap.getWorldQuaternion(tmpQ)).multiply(ACROSS);
    // Across the rim in front of the seat, the same way round.
    const rimPos = canoe.localToWorld(tmpB.set(0, CANOE_RIM + 0.075, CANOE_FEET.z - 0.4));
    rimQ.copy(canoe.quaternion).multiply(ACROSS_CANOE);

    const hold = step === S.paddle && f.opening === null ? smooth(clip / 0.7) * (1 - smooth(praise / 0.9)) : 0;
    const put = putDown(step, praise);
    const left = guide.gripPoint("L", new THREE.Vector3());
    const right = guide.gripPoint("R", new THREE.Vector3());
    const mid = left.clone().add(right).multiplyScalar(0.5);
    if (put > 0) {
      // Up over the knees, forwards and down onto the rim.
      tmpC.set(rimPos.x, Math.max(lapPos.y, rimPos.y) + 0.12, rimPos.z);
      const u = 1 - put;
      paddle.position.set(0, 0, 0).addScaledVector(lapPos, u * u).addScaledVector(tmpC, 2 * u * put).addScaledVector(rimPos, put * put);
      paddle.quaternion.slerpQuaternions(lapQ, rimQ, put);
    } else if (hold > 0) {
      // The shaft runs from paw to paw; tipped a little more than the paws, so the low blade reaches the water.
      const shaftAlong = left.clone().sub(right);
      const flat = Math.hypot(shaftAlong.x, shaftAlong.z);
      let tilt = Math.atan2(shaftAlong.y, flat) * PADDLE_TILT;
      // But never so much that the shaft goes through the canoe: on the low side it has to pass over the rim.
      const lowX = (shaftAlong.x / flat) * (tilt > 0 ? -1 : 1);
      if (Math.abs(lowX) > 0.2) {
        const toRim = (Math.sign(lowX) * CANOE_HALF_WIDTH * Math.sqrt(1 - (0.4 / CANOE_HALF_LENGTH) ** 2) - (mid.x - canoe.position.x)) / lowX;
        const most = Math.atan2(mid.y - (canoe.position.y + CANOE_RIM + 0.1), toRim);
        tilt = Math.sign(tilt) * Math.min(Math.abs(tilt), Math.max(0, most));
      }
      const shaft = v3((shaftAlong.x / flat) * Math.cos(tilt), Math.sin(tilt), (shaftAlong.z / flat) * Math.cos(tilt));
      // The blades face the way the canoe goes.
      const ahead = v3(Math.sin(guide.root.rotation.y), 0, Math.cos(guide.root.rotation.y));
      ahead.addScaledVector(shaft, -ahead.dot(shaft)).normalize();
      heldQ.setFromRotationMatrix(basis.makeBasis(new THREE.Vector3().crossVectors(shaft, ahead), shaft, ahead));
      // Lifted clear of the thighs while it turns from lying flat to upright.
      paddle.position.lerpVectors(lapPos, mid, hold).y += Math.sin(hold * Math.PI) * 0.1;
      paddle.quaternion.slerpQuaternions(lapQ, heldQ, hold);
    } else {
      paddle.position.copy(lapPos);
      paddle.quaternion.copy(lapQ);
    }
    paddle.updateMatrixWorld(true);

    // The paws on the shaft: a shoulder's width apart on the lap, where they are when paddling.
    if (step <= S.paddle) {
      const along = tmpC.set(0, 1, 0).applyQuaternion(paddle.quaternion);
      const center = paddle.position;
      const letGo = step === S.paddle ? smooth((praise - 1.6) / 0.4) : 0;
      const waving = step === S.hello && f.opening === null ? clamp01(clip / 0.7) * (1 - clamp01(praise / 0.9)) : 0;
      for (const [hand, at, lap, weight] of [
        ["L", left, PADDLE_GRIP, 1 - letGo],
        ["R", right, -PADDLE_GRIP, (1 - letGo) * (1 - waving)],
      ] as const) {
        const s = lap + (at.clone().sub(center).dot(along) - lap) * hold;
        guide.hold(hand, center.clone().addScaledVector(along, s), along, weight);
      }
    }

    // A splash whenever a blade dips into the water.
    for (const [i, end] of [1, -1].entries()) {
      const tip = paddle.localToWorld(tmpB.set(0, end * (PADDLE_REACH - 0.15), 0));
      if (hold > 0.9 && bladeY[i] >= 0.12 && tip.y < 0.12) {
        spray.burst(v3(tip.x, 0.1, tip.z), 22, 3);
        cue("splash");
      }
      bladeY[i] = tip.y;
    }
  }

  /** The guide's place and facing during a step; returns whether it walks and how much it sits. */
  function placeGuide(f: StoryFrame) {
    const { step } = f;
    let walking = false;
    let sitting = 0;
    let x = 0;
    let z = 0;
    let y: number | null = null;
    let yaw = ISLAND;
    const travel = f.lead - f.demo;

    const seat = canoe.localToWorld(new THREE.Vector3().copy(CANOE_FEET));
    if (step <= S.paddle) {
      // Sitting on the seat of the canoe, rocking with it.
      ({ x, y, z } = seat);
      yaw = ISLAND + canoe.rotation.y;
      sitting = 1;
    } else if (step === S.stomp && f.local < 1.3) {
      // Stand up, and hop out over the right side of the canoe – high, to clear the paddle and the rim – into the shallow water.
      sitting = 1 - smooth(f.local / 0.4);
      const k = clamp01((f.local - 0.4) / 0.9);
      x = seat.x + (HOP_TO[0] - seat.x) * smooth(k);
      z = seat.z + (HOP_TO[1] - seat.z) * smooth(k);
      y = seat.y + (WADE - seat.y) * smooth(k) + Math.sin(k * Math.PI) * 0.8;
      yaw = ISLAND + canoe.rotation.y * (1 - smooth(k));
    } else if (step === S.rope && f.local < 2.5) {
      // Into the light behind the door; the flash hides the jump to the bay.
      walking = f.local > 0.3;
      z = WEB_STAND - smooth((f.local - 0.3) / 2.2) * 3.6;
    } else if (f.act < -f.demo && step !== S.rope && step <= S.hooray) {
      const startAt = step === S.stomp ? 1.3 : 0.3;
      const end = travel - 0.5;
      const k = clamp01((f.local - startAt) / (end - startAt));
      walking = f.local > startAt && f.local < end && step !== S.hooray;
      const points = step === S.stomp ? [HOP_TO, standAt(S.stomp)] : route(step);
      [x, z] = along(points, smooth(k) * 0.3 + k * 0.7);
    } else if (step === S.jump) {
      // Along the bridge with the jumps of the clip, which adds the arc in the air.
      const at = actSpot(step, f.act, spot);
      z = at.z;
      y = at.y;
    } else {
      [x, z] = standAt(step);
    }
    // The ears fold back flat when the head bumps a star box.
    const jumpClip = f.act + f.demo;
    const bumpNow = step === S.jump ? Math.round((jumpClip - JUMP_PEAK - 2 * JUMP_PERIOD) / (3 * JUMP_PERIOD)) : -1;
    guide.earsBack = bumpNow >= 0 && bumpNow < 3 ? clamp01(1.4 - Math.abs(jumpClip - bumpTime(bumpNow)) / 0.3) : 0;
    // At the treasure Tapsi turns round to us, and stays so.
    if (step === S.hooray) yaw = ISLAND + Math.PI * smooth((f.local - 1.3) / 1.0);
    else if (step > S.hooray) yaw = ISLAND + Math.PI;
    // Over the bridge on its planks, out of the canoe wading in the shallow water.
    let ground = Math.max(groundHeight(x, z), bridgeTop(x, z));
    if (step === S.stomp) ground = Math.max(ground, WADE);
    guide.root.position.set(x, y ?? (step >= S.key ? Math.max(ground, LAGOON_LEVEL - 0.08) : ground), z);
    guide.root.rotation.y = yaw;
    guide.joy = step === S.hooray ? smooth((f.local - 0.8) / 0.6) : step > S.hooray ? 1 : 0;
    return { walking, sitting };
  }

  function updateWorld(f: StoryFrame) {
    const { step, act, time } = f;
    const len = actLength(step);
    const inAct = act >= 0 && act <= len;
    /** Time in the step's clip: from when Tapsi starts to show the movement. */
    const clip = act + f.demo;
    /** True if this frame passed the moment `c` of the step's clip. */
    const atClip = (c: number) => crossed(f, TRAVEL[step] + c);
    guide.root.updateMatrixWorld(true);

    // Tapsi lands in the water after hopping out of the canoe.
    if (step === S.stomp && crossed(f, 1.3)) {
      spray.burst(v3(HOP_TO[0], 0.05, HOP_TO[1]), 26, 3);
      cue("splash");
    }

    // Scorpions crawl up to Tapsi's feet, one for every stomp; the foot comes down on it – plopp, flat, gone into the sand.
    scorpions.forEach((sc, n) => {
      const land = (n + 1) * (STOMP_PERIOD / 2);
      const t = clip - land;
      const on = step === S.stomp && f.opening === null && t > -1.8 && t < 0.9 && land < clipLength(step) - 0.3;
      sc.group.visible = on;
      if (!on) return;
      // Even ones come to the left foot (Tapsi's left is -x while facing the island).
      const side = n % 2 === 0 ? -1 : 1;
      const footX = side * 0.12 * GUIDE_SIZE;
      const footZ = STOMP_Z - 0.08;
      const fromX = side * (1.4 + (n % 3) * 0.2);
      const fromZ = STOMP_Z - 1.3 + (n % 3) * 0.35;
      const k = 1 - (1 - clamp01((t + 1.8) / 1.65)) ** 2;
      const px = fromX + (footX - fromX) * k;
      const pz = fromZ + (footZ - fromZ) * k;
      sc.group.position.set(px, groundHeight(px, pz) - Math.max(0, t - 0.35) * 0.5, pz);
      sc.group.rotation.y = Math.atan2(footX - fromX, footZ - fromZ);
      if (k < 1) sc.walk(time + n);
      const flat = t > 0 ? Math.min(1, t * 10) : 0;
      sc.group.scale.set(1 + flat * 0.45, 1 - flat * 0.85, 1 + flat * 0.45);
      if (atClip(land)) {
        sand.burst(v3(footX, groundHeight(footX, footZ) + 0.05, footZ), 16, 2.2);
        cue("pop");
      }
    });

    // Over the brook: the bridge gives a little under every landing, and a star comes out of every box the head bumps.
    bridge.position.y = step === S.jump ? -bridgeDip(clip) : 0;
    boxes.forEach((box, n) => {
      const since = step === S.jump ? clip - bumpTime(n) : step > S.jump ? 99 : -99;
      box.set(since, time);
      if (step === S.jump && atClip(bumpTime(n))) {
        gold.burst(box.group.getWorldPosition(tmpA).add(v3(0, 0.6, 0)), 22, 3);
        cue("knock");
        cue("sparkle");
      }
    });

    // The swinging log waits hooked up in front, so Tapsi can walk in under it. It is let go when Tapsi
    // shows the ducking: one pass right over the head for every duck of the clip, front to back and back
    // again; at the end it is up in front again and is hooked up higher, so Tapsi walks on below it.
    let swingAngle = -SWING_HELD + Math.sin(time * 0.8) * 0.03;
    if (step === S.duck && clip > 0) {
      swingAngle = -SWING_HELD * Math.cos((clip / 6) * TAU);
      if (clip >= clipLength(step)) swingAngle = -SWING_HELD - (SWING_PARKED - SWING_HELD) * smooth((clip - clipLength(step)) / 1.5);
      for (let n = 0; n * 3 < clipLength(step); n++) if (atClip(0.9 + n * 3)) cue("whoosh");
    } else if (step > S.duck) {
      swingAngle = -SWING_PARKED + Math.sin(time * 0.8) * 0.03;
    }
    swing.pivot.rotation.x = -swingAngle;

    // Flowers open with the arms and stay open after the second time.
    let bloom = step > S.flowers ? 1 : 0;
    if (step === S.flowers && act > 0) {
      const k = (act / 4) % 1;
      const arms = k < 0.1 ? 0 : k < 0.45 ? smooth((k - 0.1) / 0.35) : k < 0.7 ? 1 : 1 - smooth((k - 0.7) / 0.25);
      const stay = act > 4.3 ? smooth((act - 4.3) / 1.2) : 0;
      bloom = Math.max(arms, stay);
      for (let n = 0; n < 2; n++) if (crossed(f, LEAD[S.flowers] + 0.6 + n * 4)) cue("sparkle");
    }
    flowers.forEach((fl, i) => fl.open(clamp01(bloom * 1.15 - i * 0.04)));
    butterflies.forEach((b, i) => {
      const out = step >= S.flowers && step <= S.gate && (step > S.flowers || bloom > 0.6 || act > 4.3);
      b.group.visible = out;
      if (!out) return;
      const home = flowerSpots[i % flowerSpots.length];
      const a = time * (0.7 + i * 0.13) + i;
      b.group.position.set(home[0] + Math.sin(a) * 1.4, home[2] + 0.4 + Math.sin(a * 1.7) * 0.6, home[1] + Math.cos(a * 0.8) * 1.2);
      b.group.rotation.y = a + Math.PI / 2;
      b.flap(time + i);
    });

    // The gate: the crank follows Tapsi's paws, and every half turn the gate clicks up a bit.
    let lift = step > S.gate ? GATE_LIFT : 0;
    let crankAngle = 0;
    if (step === S.gate && clip > 0) {
      const q = crankTurns(clip) * 2;
      const all = crankTurns(clipLength(step)) * 2;
      lift = GATE_LIFT * clamp01((Math.floor(q) + smooth(((q % 1) - 0.2) / 0.5)) / all);
      const hands = guide.handL.getWorldPosition(tmpA).add(guide.handR.getWorldPosition(tmpB)).multiplyScalar(0.5);
      const axleY = gate.group.position.y + CRANK_HEIGHT;
      crankAngle = Math.atan2(-(hands.x - WINCH_X), hands.y - axleY);
      for (let n = 1; n <= all; n++) if (atClip((n * CRANK_PERIOD) / 2 - 0.3)) cue("knock");
      if (atClip(clipLength(step) - 0.2)) cue("rumble");
    }
    gate.set(lift, crankAngle);

    // Coconuts roll down the path, on Tapsi's right; Tapsi steps aside to the left as each one comes.
    rollers.forEach((nut, n) => {
      const pass = 1.3 + n * SIDE_STEP_PERIOD;
      const dt = clip - pass;
      const on = step === S.roll && f.opening === null && dt > -2 && dt < 1.2 && pass < clipLength(step);
      nut.visible = on;
      if (!on) return;
      const z = ROLL_Z + dt * 4.2;
      const x = 0.42;
      nut.position.set(x, groundHeight(x, z) + 0.32 + Math.abs(Math.sin(dt * 5)) * 0.05, z);
      nut.rotation.set(z / 0.32, 0, 0);
      if (atClip(pass - 0.5)) cue("whoosh");
    });

    // The monkeys throw small coconuts; each flies, in slow motion as it passes, right where Tapsi's head was.
    const throwing = [0, 0];
    throws.forEach((th, n) => {
      const pass = LEAN_PERIOD / 4 + n * (LEAN_PERIOD / 2);
      const dt = clip - pass;
      const valid = step === S.monkeys && f.opening === null && pass < clipLength(step) - 0.2;
      // Even: Tapsi leans to its left (-x), the nut comes from the monkey on the right.
      const side = n % 2 === 0 ? 1 : -1;
      const monkey = monkeys[side > 0 ? 1 : 0];
      if (valid && dt > -1.6 && dt < -0.95) throwing[side > 0 ? 1 : 0] = clamp01((dt + 1.6) / 0.65);
      const flying = valid && dt > -1 && dt < 0.7;
      th.nut.visible = flying;
      if (!th.curve) {
        monkey.hand.updateMatrixWorld(true);
        const start = monkey.hand.getWorldPosition(new THREE.Vector3());
        const g = groundHeight(0, MONKEY_Z);
        // Well clear of the head leaning away, and on out to the same side.
        const passAt = v3(side * 0.5, g + 1.35, MONKEY_Z);
        const end = v3(side * 1.2, g + 0.3, MONKEY_Z + 3.5);
        const control = passAt.clone().multiplyScalar(2).sub(start.clone().add(end).multiplyScalar(0.5));
        th.curve = new THREE.QuadraticBezierCurve3(start, control, end);
      }
      // Fast far away, nearly still right at the head: u goes 0 → 0.5 (passing) → 1.
      const u = (d: number) => (d < 0 ? 0.5 - 0.5 * (0.12 * (-d / 1) + 0.88 * (-d / 1) ** 2) : 0.5 + 0.5 * (0.12 * (d / 0.7) + 0.88 * (d / 0.7) ** 2));
      if (flying) {
        th.curve.getPoint(clamp01(u(dt)), th.nut.position);
        th.nut.rotation.set(time * 7, time * 5, 0);
      }
      // Rings in the air behind the nut, like in a slow-motion film.
      th.rings.forEach((ring, i) => {
        const age = dt - RING_TIMES[i];
        ring.visible = valid && age > 0 && age < 0.8;
        if (!ring.visible) return;
        const at = clamp01(u(RING_TIMES[i]));
        th.curve!.getPoint(at, ring.position);
        ring.lookAt(th.curve!.getPoint(Math.min(1, at + 0.01), tmpC));
        ring.scale.setScalar(0.12 + age * 0.45);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - age / 0.8);
      });
      if (valid && atClip(pass - 0.55)) cue("whoosh");
    });
    const monkeysCheer = step === S.monkeys ? smooth(f.praise / 0.5) : 0;
    monkeys.forEach((m, i) => m.pose(throwing[i], monkeysCheer, time + i));

    // Apples: each reach picks one from the bunch above that paw; it plumps into the basket.
    apples.forEach((ap, n) => {
      const pick = REACH_PERIOD / 4 + n * (REACH_PERIOD / 2);
      // Even: the left paw (Tapsi's left is -x).
      const side = n % 2 === 0 ? -1 : 1;
      const g = groundHeight(0, APPLE_Z);
      const hang = tmpA.set(side * REACH_TOP.x, g + REACH_TOP.y + 0.07, APPLE_Z - REACH_TOP.z).add(ap.jitter);
      const slot = tmpB.set(basketAt.x + Math.cos(n * 2.4) * 0.13, basketAt.y + 0.13 + Math.floor(n / 4) * 0.08, basketAt.z + Math.sin(n * 2.4) * 0.13);
      const dt = step === S.apples ? clip - pick : step > S.apples ? 99 : -99;
      ap.stem.visible = dt < 0;
      if (dt < 0) ap.group.position.copy(hang);
      else if (dt < 0.25) (side < 0 ? guide.handL : guide.handR).getWorldPosition(ap.group.position);
      else if (dt < 0.75) {
        const k = (dt - 0.25) / 0.5;
        ap.group.position.lerpVectors(hang, slot, k);
        ap.group.position.y += Math.sin(k * Math.PI) * 0.25;
      } else ap.group.position.copy(slot);
      if (step === S.apples) {
        if (atClip(pick)) cue("pop");
        if (atClip(pick + 0.75)) cue("knock");
      }
    });

    // The riddle: the picture of the shape that comes next blinks, and lights up once the shape is made.
    let solved = step > S.riddle ? 3 : 0;
    for (let i = 0; i < 3; i++) {
      let k = step > S.riddle ? 1 : 0;
      if (step === S.riddle && clip > 0) {
        const from = i * SHAPE_SECONDS;
        const done = from + SHAPE_SECONDS * 0.4;
        if (clip >= done) {
          k = 1;
          solved = i + 1;
        } else if (clip >= from - 0.5) k = 0.25 + 0.2 * Math.sin(time * 9);
        if (atClip(done)) {
          tmpA.set((i - 1) * 1.55, groundHeight(0, DOOR_Z) + 4.05, DOOR_Z + 0.9);
          gold.burst(tmpA, 18, 3);
          cue("chime");
        }
      }
      riddle.set(i, step > S.webs ? 0.4 : k);
    }

    // With the riddle solved the spiral glows bright and the door sinks into the ground.
    const open = step > S.riddle ? 1 : step === S.riddle ? smooth((f.praise - 0.3) / 2) : 0;
    if (step === S.riddle && crossed(f, LEAD[S.riddle] + len + 0.3)) cue("rumble");
    door.set(open, step === S.riddle ? Math.max(solved * 0.1, smooth(f.praise / 0.5)) : open);

    // Cobwebs in the passage: each sweep of a paw tears the front one on its side; it blows away
    // to that side and is gone. The little spider climbs up its thread when the way is free.
    webs.forEach(({ web, home, side }, n) => {
      const torn = BRUSH_HIT + n * (BRUSH_PERIOD / 2);
      const since = step === S.webs ? clip - torn : step > S.webs ? 99 : -99;
      const material = web.material as THREE.MeshBasicMaterial;
      web.visible = since < 0.8 && step >= S.riddle;
      if (!web.visible) return;
      const k = clamp01(since / 0.8);
      web.position.copy(home);
      web.position.x += side * (k * k * 2.2);
      web.position.y += Math.sin(time * 1.3 + n) * 0.02 + k * 0.4;
      web.rotation.set(0, side * k * 1.1, side * k * 0.9);
      // The paw pulls it a little before it tears.
      const tug = since > -0.25 && since < 0 ? Math.sin(((since + 0.25) / 0.25) * Math.PI) : 0;
      web.scale.set(1 - k * 0.5 + tug * 0.08, 1 - k * 0.6, 1);
      material.opacity = 0.85 * (1 - k);
      if (step === S.webs && atClip(torn)) {
        spray.burst(tmpA.copy(home).add(v3(side * 0.4, 0, 0.2)), 10, 1.5);
        cue("whoosh");
      }
    });
    const lastWeb = BRUSH_HIT + (WEB_LAYERS * 2 - 1) * (BRUSH_PERIOD / 2);
    const climb = step > S.webs ? 1 : step === S.webs ? smooth((clip - lastWeb - 0.3) / 1.5) : 0;
    spider.group.visible = step >= S.riddle && climb < 1;
    const hang = 2.0 + Math.sin(time * 1.6) * 0.05 + climb * 1.6;
    spider.group.position.set(0.05, webGround + hang, WEB_Z - WEB_GAP * 0.5);
    spider.group.rotation.set(0, Math.sin(time * 0.9) * 0.4, 0);
    // The thread goes up to the stone above the door.
    const thread = Math.max(0.02, 3.5 - hang - 0.1);
    spider.thread.scale.y = thread;
    spider.thread.position.y = 0.1 + thread / 2;
    if (step === S.webs && atClip(lastWeb + 0.4)) cue("sparkle");

    // The chest on its raft comes closer with the pulling.
    const raftZ = raftAt(step, act);
    if (step === S.rope && act > 0) {
      for (let n = 0; n * 1.8 < len; n++) if (crossed(f, LEAD[S.rope] + 0.9 + n * 1.8)) cue("splash");
    }
    raft.position.set(RAFT_X, LAGOON_LEVEL + Math.sin(time * 1.4) * 0.03, raftZ);
    raft.rotation.z = Math.sin(time * 1.1) * 0.03;
    // In the opening the chest waits far out in the bay, at the end of the trail.
    raft.visible = step >= S.webs || f.opening !== null;
    raft.updateMatrixWorld(true);

    // The key: Kiki drops it in front of Tapsi, Tapsi picks it up, puts it in the lock and turns it.
    const [keyX, keyZ] = standAt(S.key);
    const lastTurn = KEY_PICKUP + 3 * KEY_TURN + KEY_TURN * 0.45;
    const unlocked = step > S.key ? 1 : step === S.key ? smooth((clip - lastTurn) / 0.3) : 0;
    key.visible = step === S.key && f.local > 0.4 && clip < lastTurn + 0.5;
    if (key.visible) {
      const lying = v3(keyX + 0.15, groundHeight(keyX, keyZ - 0.35) + 0.03, keyZ - 0.35);
      if (f.local < 1.3) {
        // Falling from Kiki's feet.
        const k = clamp01((f.local - 0.9) / 0.4);
        key.position.copy(parrot.group.position).add(v3(0, -0.15, 0)).lerp(lying, k * k);
        key.rotation.set(0, time * 3, 0);
        if (crossed(f, 1.3)) {
          gold.burst(lying, 14, 2);
          cue("sparkle");
        }
      } else if (clip < 0.75) {
        key.position.copy(lying);
        key.rotation.set(-Math.PI / 2, 0.4, 0);
      } else if (clip < KEY_PICKUP - 0.1) {
        guide.handR.getWorldPosition(key.position);
        key.rotation.set(0, Math.PI, 0);
      } else {
        lock.group.getWorldPosition(key.position);
        key.position.z += 0.17;
        key.rotation.set(0, Math.PI, keyTurn(clip) * (Math.PI / 2));
      }
    }
    if (step === S.key) for (let n = 0; n < 4; n++) if (atClip(KEY_PICKUP + n * KEY_TURN + KEY_TURN * 0.45)) cue(n === 3 ? "chime" : "knock");
    lock.open(unlocked);
    // Unlocked, it drops off the chest into the water.
    const drop = step > S.key ? 1 : step === S.key ? clamp01((clip - lastTurn - 0.4) / 0.5) : 0;
    lock.group.position.set(LOCK.x, LOCK.y - drop * drop * 0.9, LOCK.z + drop * 0.1);
    lock.group.visible = drop < 1;
    if (step === S.key && atClip(lastTurn + 0.9)) {
      spray.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0, 0.6)), 14, 2);
      cue("splash");
    }

    let lid = step > S.hooray ? 1 : 0;
    if (step === S.hooray) {
      // It opens first, then Tapsi turns round to us and cheers.
      lid = smooth((f.local - 0.6) / 1.2);
      if (crossed(f, 0.8)) cue("chime");
    }
    chest.open(lid);
    // The stop dance: when the music stops, the crabs and Kiki freeze with Tapsi; their dance clock stands still.
    const still = stillAt(step, clip);
    const wasStill = stillAt(step, f.prevLocal - TRAVEL[step]);
    const partyTime = still === null ? time : time - still;
    const wobbly = still !== null && STOP_DANCE[stopDance(clip).round].statue === "wobbly";
    if (step >= S.hooray && step <= S.party && still === null) {
      for (let n = 0; n < 10; n++) {
        if (crossed(f, 1.0 + n * 1.1)) {
          gold.burst(chest.group.getWorldPosition(tmpA).add(v3(0, 0.9, 0)), 18, 4.5);
          confetti.burst(tmpA.add(v3(-1, 0.6, 0.5)), 30, 5);
          if (step === S.hooray) cue(n % 2 ? "pop" : "sparkle");
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

    // Party: crabs come out of the sand and dance, hopping with their claws up; frozen they hang in mid-hop
    // (and tremble when Tapsi wobbles). Confetti at the start and whenever the music comes back.
    const party = step === S.party ? smooth(f.local / 1.5) : step > S.party ? 1 : step === S.hooray ? smooth((f.local - 3) / 1.5) : 0;
    crabs.forEach((crab, i) => {
      const hop = step >= S.party ? Math.abs(Math.sin(partyTime * 5 + i * 1.3)) * 0.18 : 0;
      crab.holder.position.y = crab.ground - 0.6 + party * 0.6 + hop;
      crab.holder.rotation.z = wobbly ? Math.sin(time * 7 + i * 2) * 0.1 : 0;
      crab.holder.visible = step >= S.hooray;
      crab.dance(partyTime + i * 0.4, step === S.party ? 1 : 0.4);
    });
    if (step === S.party && (crossed(f, 1) || (wasStill !== null && still === null))) {
      const side = stopDance(clip).round % 2 ? 1 : -1;
      confetti.burst(v3(PARTY.x + side * 2.5, 2.5, PARTY.z - 1), 40, 4);
      cue("pop");
    }

    // Fireworks over the bay at the end, behind Tapsi.
    rockets.forEach((rocket, n) => {
      const start = 0.8 + n * 1.3;
      const t = step === S.bye ? f.local - start : -1;
      const bx = [-4, 3, 0, -2, 5, 1][n];
      // Low enough over the bay to burst in the picture above Tapsi.
      const top = 4 + (n % 3) * 0.7;
      const bz = -30 - (n % 2) * 2;
      rocket.visible = t > 0 && t < 0.9;
      if (rocket.visible) rocket.position.set(bx, LAGOON_LEVEL + (top - LAGOON_LEVEL) * Math.sqrt(t / 0.9), bz);
      if (step === S.bye && crossed(f, start + 0.9)) {
        sparks.burst(v3(bx, top, bz), 90, 4, true);
        cue(n % 2 ? "pop" : "sparkle");
      }
    });

    // Kiki: flies in from the island to be waved at, leads the way to the
    // beach, then circles Tapsi; brings the key, sits on the chest from the
    // treasure on, and at the end flies off over the bay to be waved goodbye.
    const g = guide.root.position;
    const p = parrot.group.position;
    const front = v3(g.x + 1.1 + Math.sin(time * 1.3) * 0.25, g.y + 1.45 + Math.sin(time * 2.3) * 0.12, g.z - 2.8 + Math.cos(time * 1.3) * 0.2);
    const around = v3(g.x + Math.cos(time * 1.1) * 1.1, g.y + 2.3 + Math.sin(time * 2.3) * 0.2, g.z + Math.sin(time * 1.1) * 0.8);
    // Close beside Tapsi's waving paw, so we see both from the front.
    const beside = v3(g.x + 0.82 + Math.sin(time * 1.3) * 0.06, g.y + 1.12 + Math.sin(time * 2.3) * 0.06, g.z + 0.35 + Math.cos(time * 1.3) * 0.08);
    // A little ahead and behind the brook as the camera sees it, below the boxes, showing the way.
    const ahead = v3(g.x - 0.6, g.y + 1.3 + Math.sin(time * 2.3) * 0.12, g.z - 1.2 + Math.sin(time * 1.3) * 0.2);
    // Beyond the webs on the left, beside the spider hanging in the middle.
    const beyond = v3(g.x - 0.75, g.y + 1.75 + Math.sin(time * 2.3) * 0.08, g.z - 1.1 + Math.sin(time * 1.3) * 0.1);
    const perch = chest.group.getWorldPosition(new THREE.Vector3()).add(v3(0.3, 1.0, 0));
    let flying = true;
    let circling = false;
    if (f.opening !== null || step === S.hello) {
      const come = f.opening !== null ? 0 : smooth((f.local - 0.3) / 2.2);
      p.set(5, 7, BOAT_START - 22).lerp(beside, come);
      // A little hop in the air whenever Tapsi waves.
      if (step === S.hello && act + f.demo > 0) p.y += Math.abs(Math.sin(time * 4.5)) * 0.15;
    } else if (step === S.paddle) {
      // Leading the way, high above the bow, out of the paddle's reach.
      p.copy(beside).lerp(v3(g.x + 0.3 + Math.sin(time * 1.3) * 0.3, g.y + 2.6 + Math.sin(time * 2.3) * 0.15, g.z - 4.5), smooth(f.local / 2));
    } else if (step === S.key) {
      // Over Tapsi with the key, lets it fall, then circles again.
      const over = v3(keyX + 0.15, groundHeight(keyX, keyZ) + 1.9 + Math.sin(time * 4) * 0.08, keyZ - 0.35);
      p.copy(around).lerp(over, smooth(f.local / 0.8) * (1 - smooth((f.local - 1.4) / 1.2)));
      circling = f.local > 2.6;
    } else if (step === S.jump) {
      p.copy(around).lerp(ahead, smooth(f.local / 1.5));
    } else if (step === S.webs) {
      // Waiting to the left beyond the webs, out of the way of the camera close behind Tapsi.
      p.copy(around).lerp(beyond, smooth(f.local / 1.5));
    } else if (step < S.hooray) {
      circling = true;
      const from = step === S.stomp ? front : step === S.duck ? ahead : step === S.rope ? beyond : around;
      p.copy(from).lerp(around, smooth(f.local / 2));
    } else if (step === S.bye) {
      const away = v3(1.2 + Math.sin(time * 0.9) * 0.5, 2.5 + Math.sin(time * 1.7) * 0.25, SHORE.z - 5 + Math.cos(time * 0.9) * 0.5);
      const k = smooth((f.local - 0.3) / 3);
      p.copy(perch).lerp(away, k);
      flying = k > 0.02;
    } else {
      const settle = step === S.hooray ? smooth((f.local - 1) / 1.5) : 1;
      p.copy(around).lerp(perch, settle);
      flying = settle < 0.95;
      // Hopping on the chest with joy.
      if (step >= S.hooray) p.y += Math.abs(Math.sin(partyTime * 6)) * 0.12;
    }
    // Looking at Tapsi, except while circling; sitting on the chest it looks at us.
    const face = circling
      ? Math.atan2(-Math.sin(time * 1.1), Math.cos(time * 1.1))
      : flying
        ? Math.atan2(g.x - p.x, g.z - p.z)
        : Math.atan2(camPos.x - p.x, camPos.z - p.z);
    parrot.group.rotation.set(0, face, wobbly ? Math.sin(time * 6) * 0.15 : 0);
    parrot.flap(partyTime, flying || step >= S.hooray);
    if (step === S.hello) {
      for (const at of [1.2, TRAVEL[S.hello] + 0.6, LEAD[S.hello] + 1, LEAD[S.hello] + 4]) if (crossed(f, at)) cue("tweet");
    } else if (step === S.bye) {
      if (crossed(f, LEAD[S.bye] + 0.5) || crossed(f, LEAD[S.bye] + 3)) cue("tweet");
    } else if (step < S.hooray && crossed(f, 2)) cue("tweet");

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
    sand.update(dt);
    sparks.update(dt);
    return inAct;
  }

  return {
    focus,
    update(f) {
      placeCanoe(f);
      const { walking, sitting } = placeGuide(f);
      updateWorld(f);

      // Camera: follow the walk from behind, then come round to where the
      // step's movement shows best before Tapsi shows it.
      const g = guide.root.position;
      const travel = f.lead - f.demo;
      if (f.opening !== null) {
        openingShot(f.opening, camPos, camLook);
      } else if (f.step === S.hello) {
        actShot(f.step, f, camPos, camLook);
        openingShot(OPENING, fromPos, fromLook);
        orbitBlend(g, fromPos, fromLook, camPos, camLook, smooth(f.local / travel), camPos, camLook);
      } else if (f.step === S.rope && f.local >= 2.5) {
        // After the flash, straight behind Tapsi at the bay.
        actShot(f.step, f, camPos, camLook);
      } else {
        actShot(f.step, f, camPos, camLook);
        const prev = f.step - 1;
        const prevEnd = { local: sequence.steps[prev].seconds + DEMO[prev], act: actLength(prev) + PRAISE, praise: PRAISE, time: f.time };
        actShot(prev, prevEnd, fromPos, fromLook);
        midPos.copy(fromPos);
        midLook.copy(fromLook);
        // Not in the canoe: there the camera swings round from the greeting in front to behind Tapsi.
        const chase = travel >= 3 && f.step !== S.hooray && f.step !== S.paddle;
        if (chase) {
          // A chase camera behind the fox while it walks.
          tmpA.set(g.x + 0.9, g.y + 2.4, g.z + 4.6);
          tmpB.set(g.x, g.y + 1.0, g.z - 3);
          orbitBlend(g, fromPos, fromLook, tmpA, tmpB, smooth(f.local / 1.2), midPos, midLook);
        }
        const settle = chase ? smooth((f.local - (travel - 1.5)) / 1.6) : smooth(f.local / Math.max(1.2, travel));
        orbitBlend(g, midPos, midLook, camPos, camLook, settle, camPos, camLook);
      }
      // A gentle breathing of the camera, like it is held by hand.
      camPos.x += Math.sin(f.time * 0.6) * 0.03;
      camPos.y += Math.sin(f.time * 0.8) * 0.02;
      // Never below the ground (the low camera under the swinging log).
      camPos.y = Math.max(camPos.y, groundHeight(camPos.x, camPos.z) + 0.2);
      stage.camera.position.copy(camPos);
      stage.camera.lookAt(camLook);
      // Lean the view with the fox while dodging the monkeys' nuts.
      if (f.step === S.monkeys && f.act + f.demo > 0 && f.act < actLength(f.step)) {
        stage.camera.rotateZ(Math.sin(((f.act + f.demo) / LEAN_PERIOD) * TAU) * 0.06);
      }
      focus.copy(guide.root.position);

      const flash =
        f.opening !== null
          ? Math.max(0, 1 - Math.abs(f.opening - OPENING_CUT) / 0.5)
          : f.step === S.rope
            ? Math.max(0, 1 - Math.abs(f.local - 2.5) / 0.9)
            : 0;
      return {
        walking,
        flash,
        sitting: f.opening !== null ? 1 : sitting,
        // Leaning forwards to lay the paddle on the rim.
        bend: f.step === S.paddle ? 0.32 * smooth((f.praise - 0.8) / 0.6) * (1 - smooth((f.praise - 1.8) / 0.6)) : 0,
        pointing: f.opening !== null ? pointingAt(f.opening) : undefined,
        quiet: stillAt(f.step, f.act + f.demo) !== null,
      };
    },
    afterPose: holdPaddle,
  };
}

export const TREASURE_ISLAND: Story = {
  sequence,
  opening: {
    seconds: OPENING,
    lines: [
      { at: 0.3, text: "Schau – da hinten ist die Schatzinsel!" },
      { at: 3, text: "Und da liegt ein Schatz!" },
      { at: 6.7, text: "Kommst du mit?" },
    ],
  },
  lead: LEAD,
  demo: DEMO,
  praise: PRAISE,
  lines: [
    { icon: "👋", situation: "Ahoi! Ich bin Tapsi. Und da kommt Kiki, mein Papagei!", instruction: "Ich winke Kiki Hallo – so!", turn: "Winkst du Kiki auch?", again: "Hallo, Kiki!", praise: "Kiki freut sich, dass du da bist!" },
    { icon: "🛶", situation: "Los geht's – zur Schatzinsel!", instruction: "Schau: das Paddel rechts ins Wasser – und links.", turn: "Paddel mit!", again: "Paddeln, paddeln – die Insel kommt näher!", praise: "Geschafft! Wir sind am Strand." },
    { icon: "🦂", situation: "Huch! Da krabbeln Skorpione!", instruction: "Fuß hoch – und schnell feste stampfen, so!", turn: "Jetzt du – stampf mit!", again: "Stampf, stampf – plopp!", praise: "Alle Skorpione sind weg!" },
    {
      icon: "🌉",
      situation: "Eine kleine Brücke! Und da oben schweben Kisten.",
      instruction: "Hopp, hopp – und mit dem Kopf an die Kiste, bumm!",
      turn: "Jetzt du – hüpf mit!",
      again: "Hopp, hopp – Kopf hoch!",
      praise: "Drüben! Und drei goldene Sterne!",
    },
    { icon: "🪵", situation: "Achtung! Da oben schaukelt ein Baumstamm.", instruction: "Wenn er kommt, ducken wir uns – so!", turn: "Er kommt! Duck dich!", again: "Und nochmal ducken!", praise: "Puh, der Stamm ist vorbei!" },
    { icon: "🌸", situation: "Psst … die Blumen schlafen noch.", instruction: "Hände zusammen – und ganz weit auf. So!", turn: "Jetzt du – weck die Blumen!", again: "Langsam auf … und wieder zu.", praise: "Wie schön! Alle Blumen sind wach." },
    { icon: "⚙️", situation: "Ein Tor! Und da ist eine Kurbel.", instruction: "Wir drehen die Kurbel – rundherum, so!", turn: "Jetzt du – dreh mit!", again: "Rundherum – das Tor geht hoch!", praise: "Das Tor ist offen!" },
    { icon: "🥥", situation: "Da kullern Kokosnüsse den Weg herunter!", instruction: "Ein Schritt zur Seite – und zurück. So!", turn: "Kokosnuss! Schritt zur Seite!", again: "Und nochmal Platz machen!", praise: "Alle Kokosnüsse sind vorbeigekullert." },
    { icon: "🐒", situation: "Oh, Affen! Die werfen mit Kokosnüssen!", instruction: "Wir weichen ganz langsam aus – zur Seite, so!", turn: "Jetzt du – weich aus!", again: "Und zur anderen Seite!", praise: "Daneben! Die Affen klatschen." },
    { icon: "🍎", situation: "Ein Apfelbaum! Und da steht ein Korb.", instruction: "Ganz hoch strecken und pflücken – so!", turn: "Jetzt du – pflück einen Apfel!", again: "Hoch – und plumps in den Korb!", praise: "Der Korb ist voll!" },
    {
      icon: "🧩",
      situation: "Eine Tür mit drei Bildern. Ein Rätsel!",
      instruction: "Wir machen die Bilder nach. Erst ganz groß – so!",
      turn: "Jetzt du – ganz groß!",
      more: [{ at: 1.7, text: "Und jetzt ganz breit, wie ein Stern!" }],
      again: "Und jetzt ganz klein!",
      praise: "Rätsel gelöst! Die Tür geht auf.",
    },
    { icon: "🕸️", situation: "Oh, lauter Spinnweben! Da kommen wir nicht durch.", instruction: "Mit der Pfote hoch – und weit zur Seite wedeln, so!", turn: "Jetzt du – wedel mit!", again: "Links – und rechts – weg damit!", praise: "Der Weg ist frei! Die Spinne winkt." },
    { icon: "🪢", situation: "Da schwimmt die Schatztruhe!", instruction: "Hand über Hand am Seil ziehen – so!", turn: "Zieh mit!", again: "Ziehen, ziehen – sie kommt!", praise: "Die Truhe ist da!" },
    { icon: "🔑", situation: "Oh, ein Schloss! Kiki bringt den Schlüssel.", instruction: "Aufheben, reinstecken und umdrehen – so!", turn: "Jetzt du – dreh den Schlüssel!", again: "Klick – und nochmal!", praise: "Das Schloss ist auf!" },
    { icon: "🙌", situation: "Oh! Was ist da drin?", instruction: "Gold! Arme hoch – Hurra!", turn: "Du auch – Hurra!", again: "Hurra, ein Schatz!", praise: "So viel Gold!" },
    {
      icon: "🎵",
      situation: "Party! Wir machen Stopptanz.",
      instruction: "Wir tanzen – und hört die Musik auf: stopp!",
      turn: "Jetzt du! Tanz mit und hör gut hin!",
      more: [{ at: 6.7, text: "Kiki und die Krebse machen auch mit!" }],
      again: "Und weiter tanzen!",
      praise: "Was für eine Party!",
    },
    { icon: "🌅", situation: "Die Sonne geht unter. Schau, ein Feuerwerk!", instruction: "Ich winke Kiki Tschüss – so!", turn: "Winkst du mit?", again: "Tschüss, Kiki! Tschüss, Insel!", praise: "Danke fürs Mitmachen! Bis bald!" },
  ],
  build,
};
