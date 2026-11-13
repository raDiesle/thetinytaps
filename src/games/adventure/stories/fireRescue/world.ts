import * as THREE from "three";
import { makeConfetti, makeParrot, mergeStatic } from "../../three/props";
import { KITTEN_COLORS } from "./layout";
import { goes, S } from "./script";
import {
  makeHose,
  makeKitten,
  makeNozzle,
  makeRobo,
  makeRollerDoor,
  makeRope,
  makeSmoke,
  makeStation,
  makeTown,
  makeWater,
  makeYardWall,
  makeHandle,
  makeBell,
} from "./scenery";

// Puts „Fire Rescue“ together: the town with its street, the fire station with its yard and gate, Robo, the
// bell's rope and handle, a puff of smoke for every window the hose reaches, the kittens, the hose and its water.
// What depends on where Tapsi's paws are measured (the gallows, the washing lines, the house with its windows)
// is built in index.ts once they are measured.

export function makeWorld(scene: THREE.Scene) {
  const still = new THREE.Group();
  still.add(makeTown(), makeStation(), makeYardWall());
  scene.add(mergeStatic(still));

  const robo = makeRobo();
  scene.add(robo.group);
  const parrot = makeParrot();
  scene.add(parrot.group);
  const door = makeRollerDoor();
  scene.add(door.group);
  const bell = makeBell();
  const rope = makeRope();
  const handle = makeHandle(0.34);
  scene.add(bell, rope.mesh, handle);

  // Two puffs at every go of the hose (left, then right), and three big ones rising from the roof.
  const puffs = Array.from({ length: goes(S.spray) * 2 }, (_, n) => {
    const puff = makeSmoke(800 + n);
    scene.add(puff.group);
    return puff;
  });
  const roofSmoke = Array.from({ length: 3 }, (_, n) => {
    const puff = makeSmoke(900 + n, 0.9);
    scene.add(puff.group);
    return puff;
  });
  const kittens = KITTEN_COLORS.map((color) => {
    const kitten = makeKitten(color);
    scene.add(kitten);
    return kitten;
  });
  const nozzle = makeNozzle();
  const hose = makeHose();
  const water = makeWater();
  scene.add(nozzle, hose.mesh, water.mesh);

  const confetti = makeConfetti(200);
  const spray = makeConfetti(140, ["#ffffff", "#bfe8ff", "#7fd0ff"], 0.7);
  scene.add(confetti.mesh, spray.mesh);
  return { robo, parrot, door, bell, rope, handle, puffs, roofSmoke, kittens, nozzle, hose, water, confetti, spray };
}
