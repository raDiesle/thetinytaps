import * as THREE from "three";
import { GUIDE_SIZE } from "../../three/guide";
import {
  makeBasket,
  makeBush,
  makeButterfly,
  makeChest,
  makeCloud,
  makeConfetti,
  makeCrab,
  makeFlower,
  makeKey,
  makeMonkey,
  makePaddle,
  makePalm,
  makeParrot,
  makeRock,
  makeScorpion,
  makeTurtle,
  mat,
  mergeStatic,
  seeded,
  solid,
  TURTLE_BACK,
} from "../../three/props";
import { makeWater } from "../../three/stage";
import {
  APPLE_Z,
  BOX_ABOVE,
  CHEST_Y,
  CHEST_Z,
  DOOR_Z,
  FLOWERS_Z,
  GATE_Z,
  LAGOON,
  LAGOON_LEVEL,
  LOCK,
  MONKEY_Z,
  PARTY,
  ROLL_RADIUS,
  ROLL_Z,
  SWING_PIVOT_Z,
  TAU,
  WEB_GAP,
  WEB_LAYERS,
  WEB_Z,
  bridgeTop,
  freeSpot,
  groundHeight,
  v3,
} from "./layout";
import {
  cobwebTexture,
  makeAppleTree,
  makeBridge,
  makeCoconut,
  makeDoor,
  makeFarIsland,
  makeGate,
  makeGroundCover,
  makeLock,
  makeRaft,
  makeRiddle,
  makeSpider,
  makeStarBox,
  makeSwing,
  makeTerrain,
  makeTrail,
} from "./scenery";
import { APPLES, ROLLERS, S, STOMP_PERIOD, THROWS, bumpTime, clipLength, jumpZ } from "./script";

// The things of "Die Schatzinsel" put together: land, sea, sky, plants and every prop of the stations.

/**
 * Builds the island and everything in the story, adds it to `scene` and hands back what
 * build() moves; the rest (plants, rocks, the far islands) never moves.
 */
export function makeWorld(scene: THREE.Scene) {
  const rnd = seeded(1234);

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
  const turtle = makeTurtle();
  scene.add(turtle.group);
  const paddle = makePaddle();
  scene.add(paddle);

  const parrot = makeParrot();
  scene.add(parrot.group);

  // A scorpion for every stomp of the clip, also the last ones; they crawl up onto Ole's shell.
  const stompLandings: number[] = [];
  for (let at = STOMP_PERIOD / 2; at <= clipLength(S.stomp) + 0.05; at += STOMP_PERIOD / 2) stompLandings.push(at);
  const scorpions = stompLandings.map((land, i) => {
    const sc = makeScorpion(i % 3 === 0 ? "#d9543a" : "#e98a3c");
    sc.group.visible = false;
    turtle.group.add(sc.group);
    return { ...sc, land };
  });

  const bridge = makeBridge();
  scene.add(bridge);
  // A star box over every jump that goes up: Ole walks on over the bridge, so each hangs where Tapsi is then.
  const bumps: number[] = [];
  for (let n = 0; bumpTime(n) < clipLength(S.jump) - 0.2; n++) bumps.push(bumpTime(n));
  const boxes = bumps.map((at) => {
    const box = makeStarBox();
    const z = jumpZ(at);
    box.group.position.set(0, bridgeTop(0, z) + TURTLE_BACK + BOX_ABOVE + 0.25, z);
    scene.add(box.group);
    return box;
  });

  const swing = makeSwing();
  swing.group.position.set(0, groundHeight(0, SWING_PIVOT_Z), SWING_PIVOT_Z);
  scene.add(swing.group);

  const flowerSpots: [number, number, number, string][] = [
    // Two right beside Tapsi's paws, which open them, as high as Tapsi on Ole's back; the others a little further on.
    [-1.2, FLOWERS_Z - 0.5, 1.2 + TURTLE_BACK, "#ff6fa8"],
    [1.2, FLOWERS_Z - 0.5, 1.15 + TURTLE_BACK, "#b388ff"],
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
    nut.scale.setScalar(ROLL_RADIUS / 0.5);
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
  // Beside Ole on the left, so Ole walks on past it.
  const basketAt = v3(-1.3, groundHeight(-1.3, APPLE_Z - 0.5), APPLE_Z - 0.5);
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
    const home = v3(side * (0.78 + layer * 0.03), webGround + TURTLE_BACK + 1.3 + layer * 0.05, WEB_Z - layer * WEB_GAP);
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
  // A crate on the raft lifts the chest up to Tapsi on Ole's back.
  const crate = solid(new THREE.BoxGeometry(1.0, CHEST_Y - 0.12, 0.62), mat("#a7733f", 0.85));
  crate.position.set(0, 0.12 + (CHEST_Y - 0.12) / 2, CHEST_Z - 0.3);
  raft.add(crate);
  const chest = makeChest();
  chest.group.position.set(0, CHEST_Y, CHEST_Z);
  raft.add(chest.group);
  const lock = makeLock();
  lock.group.position.copy(LOCK);
  chest.group.add(lock.group);
  const key = makeKey();
  key.visible = false;
  scene.add(key);
  const ropeMat = mat("#d9b77a", 0.9);

  const crabs = Array.from({ length: 5 }, (_, i) => {
    const crab = makeCrab();
    // Around Ole and a little behind, all facing us, so they dance along with Tapsi.
    const x = PARTY.x + [-2.0, 2.1, -2.9, 3.0, -0.5][i];
    const z = PARTY.z + [-0.5, -0.3, 0.4, 0.3, -1.1][i];
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

  return {
    sea,
    clouds,
    turtle,
    paddle,
    parrot,
    scorpions,
    bridge,
    boxes,
    swing,
    flowerSpots,
    flowers,
    butterflies,
    gate,
    rollers,
    monkeys,
    RING_TIMES,
    throws,
    basketAt,
    apples,
    REACH_TOP,
    door,
    riddle,
    webGround,
    webs,
    spider,
    raft,
    chest,
    lock,
    key,
    ropeMat,
    crabs,
    confetti,
    spray,
    gold,
    sand,
    sparks,
    rockets,
    trail,
  };
}
