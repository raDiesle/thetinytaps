import * as THREE from "three";
import { makeCloud, makeConfetti, makeParrot, mergeStatic, seeded } from "../../three/props";
import { ALT, RAINBOW_BAND, RAINBOW_CENTER, RAINBOW_RADIUS, SUN, SUN_Z } from "./layout";
import { curveZ, goes, S, starTime, TRAVEL } from "./script";
import { makeBalloon, makeMeadow, makePlane, makePuff, makeRain, makeRainbow, makeRainCloud, makeStar, makeSun, makeWolle } from "./scenery";

// Puts „Die Wolkenreise“ together: the meadow, the clouds along the way, the rain cloud with the
// sun, and one thing for every go of every movement (planes, balloons, stars, puffs). build() in
// index.ts moves them.

/** Colours of the planes and balloons, in turn. */
const PLANE_COLORS = ["#e8473c", "#3f8ae8", "#4cb050", "#f08a24", "#9b6bff"];
const BALLOON_COLORS = ["#ff4d6d", "#ffd23f", "#3ec1d3", "#7bd389", "#b388ff", "#ff9f43"];

/** A white cloud scaled down, with its long side along `yaw`. */
function cloudAt(seed: number, x: number, y: number, z: number, size: number, yaw = 0) {
  const cloud = makeCloud(seed);
  cloud.position.set(x, y, z);
  cloud.scale.setScalar(size);
  cloud.rotation.y = yaw;
  return cloud;
}

export function makeWorld(scene: THREE.Scene) {
  const { ground, things } = makeMeadow();
  scene.add(ground, mergeStatic(things));

  // White clouds: far away all round, towers along the curves (one beside every star, on its side),
  // a bank under each end of the rainbow, and a few under the way so the sky has depth.
  const sky = new THREE.Group();
  const rnd = seeded(77);
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2;
    const d = 70 + rnd() * 110;
    sky.add(cloudAt(200 + i, Math.cos(a) * d, ALT - 4 + rnd() * 18, Math.sin(a) * d - 10, 0.9 + rnd() * 0.8, rnd() * 3));
  }
  const towers = goes(S.stars) * 2;
  for (let n = 0; n < towers; n++) {
    // The star of curve n is taken on the left for even n, so its tower is on the left (-x) then.
    const side = n % 2 === 0 ? -1 : 1;
    const z = curveZ(TRAVEL[S.stars] + starTime(n));
    for (let k = 0; k < 4; k++) sky.add(cloudAt(300 + n * 4 + k, side * (7 + rnd() * 1.5), ALT - 10 + k * 5, z, 0.45, Math.PI / 2 + (rnd() - 0.5) * 0.4));
  }
  for (const side of [1, -1]) {
    const x = side * (RAINBOW_RADIUS - RAINBOW_BAND * 3);
    sky.add(cloudAt(400 + side, x, RAINBOW_CENTER.y - 1, RAINBOW_CENTER.z, 0.9));
  }
  for (let i = 0; i < 8; i++) sky.add(cloudAt(500 + i, (rnd() - 0.5) * 50, ALT - 9 - rnd() * 3, 20 - i * 12, 0.6 + rnd() * 0.4, rnd() * 3));
  scene.add(mergeStatic(sky));

  const wolle = makeWolle();
  scene.add(wolle.group);
  const parrot = makeParrot();
  scene.add(parrot.group);

  const planes = Array.from({ length: goes(S.duck) }, (_, n) => {
    const plane = makePlane(PLANE_COLORS[n % PLANE_COLORS.length]);
    plane.group.visible = false;
    scene.add(plane.group);
    return plane;
  });
  const balloons = Array.from({ length: goes(S.balloons) }, (_, n) => {
    const balloon = makeBalloon(BALLOON_COLORS[n % BALLOON_COLORS.length]);
    balloon.visible = false;
    scene.add(balloon);
    return balloon;
  });
  const stars = Array.from({ length: goes(S.stars) * 2 }, () => {
    const star = makeStar();
    scene.add(star);
    return star;
  });
  const puffs = Array.from({ length: goes(S.push) }, (_, n) => {
    const puff = makePuff(600 + n);
    scene.add(puff.group);
    return puff;
  });

  // The rain cloud: a dark ceiling over the place under it, thick round the sun.
  const places: [number, number, number, number][] = [];
  const cr = seeded(91);
  for (let i = 0; i < 22; i++) {
    const nearSun = i < 9;
    const x = nearSun ? (cr() - 0.5) * 9 : (cr() - 0.5) * 26;
    const y = nearSun ? SUN.y - 2 + cr() * 4 : ALT + 7.5 + cr() * 2;
    const z = nearSun ? SUN.z + 3 + cr() * 3 : SUN_Z + 6 - cr() * 26;
    places.push([x, y, z, nearSun ? 2.6 + cr() * 1.2 : 3 + cr() * 2]);
  }
  const rainCloud = makeRainCloud(92, places);
  for (const puff of rainCloud.puffs) scene.add(puff);
  const sun = makeSun();
  sun.group.position.copy(SUN);
  scene.add(sun.group);
  const rain = makeRain(700);
  scene.add(rain.mesh);
  const rainbow = makeRainbow();
  rainbow.group.position.copy(RAINBOW_CENTER);
  scene.add(rainbow.group);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.9 }));
  tip.visible = false;
  scene.add(tip);

  const confetti = makeConfetti(220);
  const sparkle = makeConfetti(120, ["#ffd23f", "#fff3a0", "#ffffff"], 0.8);
  scene.add(confetti.mesh, sparkle.mesh);
  return { wolle, parrot, planes, balloons, stars, puffs, rainCloud, sun, rain, rainbow, tip, confetti, sparkle };
}
