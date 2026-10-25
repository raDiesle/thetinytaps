import * as THREE from "three";
import { makeBush, makePalm, makeRock, mat, seeded, solid, TURTLE_BACK } from "../../three/props";
import {
  BOAT_END,
  BOAT_START,
  BRIDGE_ARCH,
  BRIDGE_FROM,
  BRIDGE_HALF,
  BRIDGE_TO,
  bridgeTop,
  clamp01,
  CRANK_ARM,
  CRANK_BAR,
  CRANK_KNOB,
  CRANK_Y,
  DOOR_Z,
  DRUM_HAND,
  DRUM_RADIUS,
  GATE_HALF,
  GATE_Z,
  groundHeight,
  RAFT_FROM,
  RAFT_X,
  ROD_LENGTH,
  SHORE,
  smooth,
  ss,
  surface,
  TAU,
  v3,
  WINCH_POST,
  WINCH_X,
  WINCH_Z,
} from "./layout";

// The island's things for "Die Schatzinsel": each make…() builds one prop or piece of ground,
// placed and animated by build() in index.ts.

export function makeTerrain() {
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

/** Grass tufts and little flowers as instanced meshes, so hundreds cost almost nothing. */
export function makeGroundCover(rnd: () => number) {
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
export function makeFarIsland(scale: number, seed: number) {
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
export function makeSwing() {
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
  // The log hangs just above Tapsi's ducked head, Tapsi on Ole's back: under it standing, over it ducked.
  const length = 3.85 - TURTLE_BACK;
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
export function makeDoor() {
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
    /**
     * open: 0 shut, 1 sunk into the ground; glowK: 0..1 how bright the spiral is; shine: 0..1 the
     * light in the doorway once it is open (it has to be gone before anyone walks through it).
     */
    set(open: number, glowK: number, shine: number) {
      slab.position.set(0, -open * 3.6, 0);
      spiralMat.emissiveIntensity = 0.4 + glowK * 3;
      const glowMat = glow.material as THREE.MeshBasicMaterial;
      glowMat.opacity = Math.max(glowK * 0.25 * (1 - open), shine);
      glow.visible = glowMat.opacity > 0.01;
      light.intensity = glowK * 6 * (1 - open) + shine * 30;
      spiralLight.intensity = glowK * 9 * (1 - open);
    },
  };
}

/** A cobweb drawn on a canvas: threads from the corners and the middle, and a spiral round it. */
export function cobwebTexture(seed: number) {
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
export function makeSpider() {
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
export function makeStarBox() {
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
export function makeBridge() {
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
export function makeCoconut(seed: number) {
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

/** A fishing rod along its own y, from the cork handle (0) to the tip (`ROD_LENGTH`), with a reel. */
export function makeRod() {
  const group = new THREE.Group();
  const handle = solid(new THREE.CylinderGeometry(0.024, 0.024, 0.32, 10), mat("#c9955b", 0.9));
  handle.position.y = 0.16;
  group.add(handle);
  const blank = solid(new THREE.CylinderGeometry(0.006, 0.014, ROD_LENGTH - 0.3, 8), mat("#3d6fb6", 0.4));
  blank.position.y = 0.3 + (ROD_LENGTH - 0.3) / 2;
  group.add(blank);
  const reel = solid(new THREE.CylinderGeometry(0.045, 0.045, 0.04, 14), mat("#d8d8d8", 0.3, { metalness: 0.6 }));
  reel.rotation.z = Math.PI / 2;
  reel.position.set(0, 0.36, -0.05);
  group.add(reel);
  return group;
}

/** A float for the fishing line, red on top and white below. */
export function makeBobber() {
  const group = new THREE.Group();
  const top = solid(new THREE.SphereGeometry(0.07, 14, 8, 0, TAU, 0, Math.PI / 2), mat("#e8423f", 0.4));
  const bottom = solid(new THREE.SphereGeometry(0.07, 14, 8, 0, TAU, Math.PI / 2, Math.PI / 2), mat("#ffffff", 0.4));
  group.add(top, bottom);
  return group;
}

/** A round, friendly fish looking along +z, flat from side to side, with a tail and big eyes. */
export function makeFish(color: string) {
  const group = new THREE.Group();
  const skin = mat(color, 0.4);
  const body = solid(new THREE.SphereGeometry(0.2, 20, 14), skin);
  body.scale.set(0.45, 0.7, 1);
  group.add(body);
  const tail = solid(new THREE.ConeGeometry(0.12, 0.16, 12), skin);
  tail.scale.z = 0.3;
  tail.rotation.x = Math.PI / 2;
  tail.position.z = -0.24;
  group.add(tail);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.035, 10, 8), mat("#ffffff", 0.3), false);
    eye.position.set(side * 0.08, 0.04, 0.11);
    group.add(eye);
    const pupil = solid(new THREE.SphereGeometry(0.018, 8, 6), mat("#111111", 0.3), false);
    pupil.position.set(side * 0.105, 0.045, 0.12);
    group.add(pupil);
  }
  return group;
}

/**
 * A small round bird that sits on the path, looking ahead along its own z; `pose(time, flying)` pecks
 * at the ground while it sits and beats its wings while it flies.
 */
export function makeBird(color: string, wingColor: string) {
  const group = new THREE.Group();
  const feathers = mat(color, 0.55);
  const body = solid(new THREE.SphereGeometry(0.1, 16, 12), feathers);
  body.scale.set(0.85, 0.8, 1.15);
  body.position.y = 0.1;
  group.add(body);
  const head = new THREE.Group();
  head.position.set(0, 0.19, 0.08);
  group.add(head);
  head.add(solid(new THREE.SphereGeometry(0.065, 14, 10), feathers));
  const beakGeo = new THREE.ConeGeometry(0.022, 0.06, 8);
  beakGeo.rotateX(Math.PI / 2);
  const beak = solid(beakGeo, mat("#ffb02e", 0.4), false);
  beak.position.set(0, -0.005, 0.08);
  head.add(beak);
  for (const side of [1, -1]) {
    const eye = solid(new THREE.SphereGeometry(0.013, 8, 6), mat("#111111", 0.2), false);
    eye.position.set(side * 0.042, 0.018, 0.045);
    head.add(eye);
  }
  const tail = solid(new THREE.BoxGeometry(0.08, 0.015, 0.1), mat(wingColor, 0.6));
  tail.position.set(0, 0.13, -0.13);
  tail.rotation.x = -0.4;
  group.add(tail);
  const wings: THREE.Group[] = [];
  for (const side of [1, -1]) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.075, 0.14, 0);
    const wingGeo = new THREE.SphereGeometry(0.08, 12, 8);
    wingGeo.scale(1, 0.18, 0.75);
    wingGeo.translate(side * 0.07, 0, -0.01);
    pivot.add(solid(wingGeo, mat(wingColor, 0.55)));
    group.add(pivot);
    wings.push(pivot);
  }
  return {
    group,
    pose(time: number, flying: boolean) {
      // Folded along the body while sitting, wide beats while flying.
      const beat = flying ? Math.sin(time * 26) * 0.9 : -1.2;
      wings[0].rotation.z = beat;
      wings[1].rotation.z = -beat;
      const peck = flying ? 0 : Math.max(0, Math.sin(time * 2.3)) ** 6;
      head.rotation.x = peck * 0.9;
      head.position.y = 0.19 - peck * 0.04;
    },
  };
}

/**
 * Two drums hanging on vines from a bamboo pole between two palms, one beside each of
 * Tapsi's paws where they come down on a beat; `set(n, since)` lets drum n bounce and
 * swing `since` seconds after a beat.
 */
export function makeDrums() {
  const group = new THREE.Group();
  const top = TURTLE_BACK + 2.75;
  for (const side of [1, -1]) {
    const palm = makePalm(4.2, side > 0 ? 640 : 650);
    palm.position.set(side * 2.5, -0.1, -0.2);
    palm.rotation.y = side > 0 ? Math.PI : 0;
    group.add(palm);
  }
  const pole = solid(new THREE.CylinderGeometry(0.07, 0.07, 5.4, 10), mat("#c8c46a", 0.6));
  pole.rotation.z = Math.PI / 2;
  pole.position.set(0, top, -0.2);
  group.add(pole);
  for (const x of [-2, -1, 0, 1, 2]) {
    const ring = solid(new THREE.TorusGeometry(0.072, 0.012, 6, 16), mat("#8f8a3e", 0.7));
    ring.rotation.y = Math.PI / 2;
    ring.position.set(x * 1.05, top, -0.2);
    group.add(ring);
  }
  const wood = mat("#a0622f", 0.8);
  const band = mat("#e8423f", 0.6);
  const skinMat = mat("#f3e2bd", 0.8);
  const vine = mat("#3f7d2c", 0.9);
  const drums = [1, -1].map((side) => {
    // Tapsi's left (-x, facing the island) first: the left paw beats first.
    const at = v3(-side * DRUM_HAND.x, TURTLE_BACK + DRUM_HAND.y - 0.04, -DRUM_HAND.z);
    const pivot = new THREE.Group();
    pivot.position.set(at.x, top, -0.2);
    group.add(pivot);
    const drum = new THREE.Group();
    drum.position.set(0, at.y - top, at.z + 0.2);
    pivot.add(drum);
    const body = solid(new THREE.CylinderGeometry(DRUM_RADIUS, DRUM_RADIUS * 0.8, 0.34, 18), wood);
    body.position.y = -0.17;
    drum.add(body);
    for (const y of [-0.06, -0.28]) {
      const stripe = solid(new THREE.TorusGeometry(DRUM_RADIUS * (1 - (-y / 0.34) * 0.2) + 0.005, 0.014, 6, 24), band);
      stripe.rotation.x = Math.PI / 2;
      stripe.position.y = y;
      drum.add(stripe);
    }
    const skin = solid(new THREE.CylinderGeometry(DRUM_RADIUS + 0.01, DRUM_RADIUS + 0.01, 0.025, 18), skinMat);
    drum.add(skin);
    for (const dx of [1, -1]) {
      const length = top - at.y;
      const rope = solid(new THREE.CylinderGeometry(0.012, 0.012, length, 5), vine, false);
      rope.position.set(dx * (DRUM_RADIUS + 0.02), -length / 2, 0);
      pivot.add(rope);
    }
    return { pivot, skin, at };
  });
  return {
    group,
    /** Where the top of drum n is, in the group's space (n = 0 left, 1 right). */
    tops: drums.map((d) => d.at),
    set(n: number, since: number) {
      const d = drums[n];
      const ring = since >= 0 && since < 1.2 ? Math.exp(-since * 4) : 0;
      d.pivot.rotation.x = Math.sin(since * 9) * 0.08 * ring;
      d.skin.scale.set(1, 1 - Math.sin(Math.min(1, since / 0.15) * Math.PI) * 0.6 * (since < 0.15 ? 1 : 0), 1);
    },
  };
}

/** A raft for the chest. */
export function makeRaft() {
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

/**
 * The way of the story as red dots, like on a treasure map: across the sea,
 * along the path, through the door and over the bay to the chest. `show(k)`
 * draws it up to k (0..1); `head(k)` is where the drawing has got to.
 */
export function makeTrail() {
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
export function makeRiddle() {
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
export function makeGate() {
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

  // The winch: a post beyond Ole's head, a long axle pointing at Tapsi with the drum on it, and
  // the crank on the near end.
  const winch = new THREE.Group();
  winch.position.set(WINCH_X, 0, WINCH_Z - GATE_Z);
  group.add(winch);
  const block = solid(new THREE.BoxGeometry(0.28, CRANK_Y + 0.15, 0.28), dark);
  block.position.set(0, (CRANK_Y + 0.15) / 2, -WINCH_POST);
  winch.add(block);
  const drum = solid(new THREE.CylinderGeometry(0.13, 0.13, 0.3, 14), wood);
  drum.rotation.x = Math.PI / 2;
  drum.position.set(0, CRANK_Y, -WINCH_POST + 0.3);
  winch.add(drum);
  const axle = solid(new THREE.CylinderGeometry(0.03, 0.03, WINCH_POST + 0.05, 8), dark);
  axle.rotation.x = Math.PI / 2;
  axle.position.set(0, CRANK_Y, -WINCH_POST / 2 - 0.02);
  winch.add(axle);
  const crank = new THREE.Group();
  crank.position.set(0, CRANK_Y, 0);
  winch.add(crank);
  const arm = solid(new THREE.BoxGeometry(0.05, CRANK_ARM + 0.05, 0.04), dark);
  arm.position.y = CRANK_ARM / 2;
  crank.add(arm);
  const knob = solid(new THREE.CylinderGeometry(0.025, 0.025, CRANK_KNOB, 8), dark);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0, CRANK_ARM, CRANK_KNOB / 2);
  crank.add(knob);
  // A bar for both paws at the end, turning on the knob so it stays level all the way round.
  const bar = new THREE.Group();
  bar.position.set(0, CRANK_ARM, CRANK_KNOB);
  crank.add(bar);
  const grip = solid(new THREE.CylinderGeometry(0.032, 0.032, CRANK_BAR, 10), mat("#c98d52", 0.6));
  grip.rotation.z = Math.PI / 2;
  bar.add(grip);

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
  const drumTop = v3(WINCH_X, CRANK_Y + 0.13, WINCH_Z - GATE_Z - WINCH_POST + 0.3);
  const overPulley = v3(WINCH_X + 0.45, 3.25, 0.2);
  return {
    group,
    /** lift: how high the gate is (m); angle: the crank's turn (rad, 0 = up, as seen from Tapsi, positive anticlockwise). */
    bar,
    set(lift: number, angle: number) {
      gate.position.y = lift;
      crank.rotation.z = angle;
      bar.rotation.z = -angle;
      stretch(ropes[0], drumTop, overPulley);
      stretch(ropes[1], v3(WINCH_X + 0.58, 3.12, 0.2), v3(-GATE_HALF + 0.3, lift + 2.0, 0.05));
    },
  };
}

/**
 * An apple tree leaning over the path: a bough reaches out right over Tapsi on Ole's back, `boughY` over
 * Tapsi's feet, for the apples to hang from in the open, and the crown is above and behind it, so the
 * apples show red against the leaves.
 */
export function makeAppleTree(boughY: number) {
  const group = new THREE.Group();
  const bark = mat("#7b5233", 0.95);
  const up = TURTLE_BACK;
  const trunk = solid(new THREE.CylinderGeometry(0.2, 0.3, 2.6 + up, 10), bark);
  trunk.position.set(-1.6, 1.25 + up / 2, -1.0);
  trunk.rotation.z = -0.18;
  group.add(trunk);
  // From the trunk out over the path, just over the apples.
  const from = v3(-1.5, boughY + up + 0.25, -0.3);
  const to = v3(0.85, boughY + up, -0.02);
  const bough = solid(new THREE.CylinderGeometry(0.06, 0.13, from.distanceTo(to), 8), bark);
  bough.position.lerpVectors(from, to, 0.5);
  bough.quaternion.setFromUnitVectors(v3(0, 1, 0), to.clone().sub(from).normalize());
  group.add(bough);
  const leaves = ["#3d8f36", "#4ea640", "#5cb84a"];
  for (const [x, y, z, size, seed] of [
    [-1.3, 0.25, -1.3, 1.3, 61],
    [-0.3, 0.3, -1.15, 1.2, 62],
    [0.7, 0.25, -1.1, 1.1, 63],
  ]) {
    const crown = makeBush(size, seed, leaves);
    crown.position.set(x, boughY + up + y, z);
    group.add(crown);
  }
  return group;
}

/** A padlock; `open(k)` swings its shackle up. */
export function makeLock() {
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
