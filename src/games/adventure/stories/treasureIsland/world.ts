import * as THREE from "three";
import { KEY_PICKUP, KEY_TURN } from "../../three/clips";
import { GUIDE_SIZE } from "../../three/guide";
import {
  makeBasket,
  makeBush,
  makeChest,
  makeCloud,
  makeConfetti,
  makeCrab,
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
  bridgeTop,
  CHEST_Y,
  CHEST_Z,
  DOOR_Z,
  DRUMS_Z,
  freeSpot,
  GATE_Z,
  groundHeight,
  LAGOON,
  LAGOON_LEVEL,
  LOCK,
  MONKEY_Z,
  PARTY,
  ROD_LENGTH,
  ROLL_RADIUS,
  ROLL_Z,
  SWING_PIVOT_Z,
  TAU,
  v3,
  WEB_GAP,
  WEB_Z,
  COINS_PER_TOSS,
} from "./layout";
import {
  cobwebTexture,
  makeAppleTree,
  makeBird,
  makeBobber,
  makeBridge,
  makeCoconut,
  makeDoor,
  makeDrums,
  makeFarIsland,
  makeFish,
  makeGate,
  makeGroundCover,
  makeLock,
  makeRaft,
  makeRiddle,
  makeRod,
  makeSpider,
  makeStarBox,
  makeSwing,
  makeTerrain,
  makeTrail,
} from "./scenery";
import { bumpTime, clipLength, goes, jumpZ, S, STOMP_PERIOD } from "./script";

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

  // The fishing: the rod in Tapsi's paws, the float on its line, and a fish that leaps at every cast.
  const rod = makeRod();
  scene.add(rod);
  const rodTip = new THREE.Object3D();
  rodTip.position.y = ROD_LENGTH;
  rod.add(rodTip);
  const bobber = makeBobber();
  scene.add(bobber);
  const line = solid(new THREE.CylinderGeometry(0.004, 0.004, 1, 4), mat("#ffffff", 0.5), false);
  scene.add(line);
  const fishColors = ["#ff9f43", "#7bd3ff", "#ffd23f", "#ff7eb6", "#7bd389"];
  const fishes = Array.from({ length: goes(S.fish) }, (_, i) => {
    const fish = makeFish(fishColors[i % fishColors.length]);
    fish.visible = false;
    scene.add(fish);
    return fish;
  });

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
  // A star box over every jump: Ole walks on over the bridge, so each hangs where Tapsi is then, over
  // the sand before the bridge or over the bridge.
  const bumps: number[] = [];
  for (let n = 0; bumpTime(n) < clipLength(S.jump) - 0.2; n++) bumps.push(bumpTime(n));
  const boxes = bumps.map((at) => {
    const box = makeStarBox();
    const z = jumpZ(at);
    box.group.position.set(0, Math.max(groundHeight(0, z), bridgeTop(0, z)) + TURTLE_BACK + BOX_ABOVE + 0.25, z);
    scene.add(box.group);
    return box;
  });

  const swing = makeSwing();
  swing.group.position.set(0, groundHeight(0, SWING_PIVOT_Z), SWING_PIVOT_Z);
  scene.add(swing.group);

  // Two drums hanging beside Tapsi's paws; birds sit on the path ahead, and every beat scares one off.
  const drums = makeDrums();
  drums.group.position.set(0, groundHeight(0, DRUMS_Z), DRUMS_Z);
  scene.add(drums.group);
  const beats = goes(S.drums) * 2;
  const riddleRounds = goes(S.riddle);
  const keyTurns = goes(S.key);
  /** Seconds into the key clip when the last turn opens the lock. */
  const lastTurn = KEY_PICKUP + (keyTurns - 1) * KEY_TURN + KEY_TURN * 0.45;
  // A bird for every beat, on the side of its drum (even ones on Tapsi's left, -x), the nearest first.
  const birdColors: [string, string][] = [
    ["#ffd23f", "#ff8a1f"],
    ["#4fb8ff", "#2f6fe8"],
    ["#ff6f8e", "#d9435f"],
    ["#7bd389", "#3f9e52"],
    ["#ffffff", "#9fb0c0"],
    ["#b388ff", "#7a52d9"],
  ];
  const birds = Array.from({ length: beats }, (_, n) => {
    const bird = makeBird(...birdColors[(n * 5) % birdColors.length]);
    const r = seeded(40 + n);
    const side = n % 2 === 0 ? -1 : 1;
    const z = DRUMS_Z - 1.2 - Math.floor(n / 2) * 0.22 - r() * 0.1;
    const x = side * (0.35 + r() * 0.7);
    const home = v3(x, groundHeight(x, z), z);
    bird.group.position.copy(home);
    // Big enough to see over Tapsi's shoulders.
    bird.group.scale.setScalar(1.6);
    // Mostly looking towards us, each a little differently.
    const look = (r() - 0.5) * 1.6;
    bird.group.rotation.y = look;
    scene.add(bird.group);
    return { ...bird, home, look, side };
  });

  const gate = makeGate();
  gate.group.position.set(0, groundHeight(0, GATE_Z), GATE_Z);
  scene.add(gate.group);

  // The coconuts the monkeys drop down the path: one for every go of each of the three dodging steps.
  const rollers = [S.roll, S.rollLeft, S.rollMiddle].flatMap((step) =>
    Array.from({ length: goes(step) }, (_, n) => {
      const nut = makeCoconut(step * 10 + n);
      nut.scale.setScalar(ROLL_RADIUS / 0.5);
      nut.visible = false;
      scene.add(nut);
      return { nut, step, n };
    }),
  );

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
    // A bunch of coconuts under the leaves beside the monkey, on the side of the path, where it takes the
    // ones it drops.
    for (let i = 0; i < 5; i++) {
      const nut = makeCoconut(80 + i + (side > 0 ? 10 : 0));
      nut.scale.setScalar((ROLL_RADIUS * 1.4) / 0.5);
      const a = (i / 5) * TAU;
      nut.position.set(top.x - side * 0.4 + Math.cos(a) * 0.13, top.y - 0.2 - (i % 2) * 0.13, top.z + 0.3 + Math.sin(a) * 0.13);
      scene.add(nut);
    }
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
  const throws = Array.from({ length: goes(S.monkeys) * 2 }, (_, i) => {
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

  /** Where the paws are at the top of a reach (measured on the clip), from Tapsi: x to Tapsi's left. */
  const REACH_TOP = v3(0.25, 1.6, 0.05).multiplyScalar(GUIDE_SIZE);
  /** The apples hang from a bough this high over Tapsi's feet, a little above the highest the paws reach. */
  const APPLE_BOUGH = REACH_TOP.y + 0.45;
  const appleTree = makeAppleTree(APPLE_BOUGH);
  appleTree.position.set(0, groundHeight(0, APPLE_Z), APPLE_Z);
  scene.add(appleTree);
  const basket = makeBasket();
  // Beside Ole on the left, so Ole walks on past it.
  const basketAt = v3(-1.3, groundHeight(-1.3, APPLE_Z - 0.5), APPLE_Z - 0.5);
  basket.position.copy(basketAt);
  scene.add(basket);
  const appleMat = mat("#e3262f", 0.3);
  const stemMat = mat("#5a3a1f", 0.9);
  const leafMat = mat("#4ea640", 0.8);
  const apples = Array.from({ length: goes(S.apples) * 2 }, (_, i) => {
    const group = new THREE.Group();
    // Big and bright red, so each one shows hanging on its stalk.
    const apple = solid(new THREE.SphereGeometry(0.12, 16, 12), appleMat);
    apple.scale.set(1, 0.9, 1);
    group.add(apple);
    // A little bunch at each paw's highest point; the paw reaches into it.
    const r = seeded(70 + i);
    const jitter = v3((r() - 0.5) * 0.24, r() * 0.12, (r() - 0.5) * 0.2);
    // The stalk goes up from the apple to the bough.
    const length = APPLE_BOUGH - (REACH_TOP.y + 0.07 + jitter.y) - 0.1;
    const stem = solid(new THREE.CylinderGeometry(0.012, 0.012, length, 5), stemMat, false);
    stem.position.y = 0.1 + length / 2;
    group.add(stem);
    const leaf = solid(new THREE.SphereGeometry(0.06, 8, 6), leafMat, false);
    leaf.scale.set(1, 0.3, 0.5);
    leaf.position.set(0.06, 0.16, 0);
    group.add(leaf);
    scene.add(group);
    return { group, stem, leaf, jitter };
  });

  const door = makeDoor();
  door.group.position.set(0, groundHeight(0, DOOR_Z), DOOR_Z);
  scene.add(door.group);
  const riddle = makeRiddle();
  riddle.group.position.set(0, 4.05, 0.7);
  door.group.add(riddle.group);
  // Cobwebs in the passage behind the door, a left and a right half in every layer, the front ones first.
  const webGround = groundHeight(0, DOOR_Z);
  const webs = Array.from({ length: goes(S.webs) * 2 }, (_, n) => {
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
  // Big enough that its turn shows on screen.
  key.scale.setScalar(1.5);
  key.visible = false;
  scene.add(key);
  const ropeMat = mat("#d9b77a", 0.9);

  const crabs = Array.from({ length: 5 }, (_, i) => {
    const crab = makeCrab();
    // Around Ole and a little behind, all facing us, so they dance along with Tapsi.
    const x = PARTY.x + [-2.0, 2.9, -2.9, 3.0, -0.5][i];
    const z = PARTY.z + [-0.5, -0.6, 0.4, 0.3, -1.1][i];
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
  scene.add(confetti.mesh, spray.mesh, gold.mesh, sand.mesh);
  // Two more crabs carry the open chest from the raft up the beach.
  const porters = [0, 1].map(() => {
    const crab = makeCrab();
    crab.group.visible = false;
    scene.add(crab.group);
    return crab;
  });
  // The gold coins Tapsi throws up out of the chest at the end, a handful at every throw.
  const coinMat = mat("#ffcc33", 0.3, { metalness: 0.9, emissive: "#6b4a00", emissiveIntensity: 0.4 });
  const coinGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.012, 14);
  const coins = Array.from({ length: goes(S.coins) * COINS_PER_TOSS }, () => {
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.castShadow = true;
    coin.visible = false;
    scene.add(coin);
    return coin;
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
    rod,
    rodTip,
    bobber,
    line,
    fishes,
    drums,
    beats,
    riddleRounds,
    keyTurns,
    lastTurn,
    birds,
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
    porters,
    coins,
    trail,
  };
}
