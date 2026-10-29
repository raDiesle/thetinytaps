// The farm machine ("Bauernhof", R-06), a Rube Goldberg machine where every
// link is an animal: one tap, and the rooster crows, the pig jumps into the
// puddle in fright, the splash of mud wakes the cat, the cat knocks its ball of
// wool down the hay bale onto the cow's nose, the cow's moo wakes the dog, the
// dog chases the ducks off the pond, the ducks land on the barn roof, the barn
// doors swing open, and all the animals in the stable sing together.
// Everything is worked out ahead as a function of the seconds since the tap,
// so FarmLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the farmyard, 5600 × 900; the screen shows 1600 of it at a time.

import {
  playBaa,
  playBark,
  playBoing,
  playCluck,
  playCreak,
  playCrow,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playPop,
  playQuack,
  playRecorded,
  playSplash,
  playTusch,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { along, cameraOn, distAt, easeInOut, hop, lerp, pathOf, roll, seg, timeline } from "./machineKit";
import { line, quad, type Pt } from "./path";

export const WORLD_W = 5600;
export const FLOOR = 800;

/** The recordings the animals call with, loaded when the level opens. */
export const FARM_SOUNDS = ["crow", "oink", "splash", "meow", "moo", "bark", "quack", "neigh", "baa", "cluck"];

// Each animal calls with its recording, or the synthesized call while that is still loading.
const crow = () => playRecorded("crow", playCrow);
const oink = () => playRecorded("oink", playOink);
const splash = () => playRecorded("splash", playSplash);
const meow = () => playRecorded("meow", playMeow);
const moo = () => playRecorded("moo", playMoo);
const bark = () => playRecorded("bark", playBark);
const quack = () => playRecorded("quack", playQuack);
const neigh = () => playRecorded("neigh", playNeigh);
const baa = () => playRecorded("baa", playBaa);
const cluck = () => playRecorded("cluck", playCluck);

/* ---------- Layout ---------- */

/** The fence post the rooster stands on; he looks to the right. */
export const POST = { x: 270, top: 590 };
/** The pig sleeps on the ground next to the puddle. */
export const PIG = { x: 600 };
export const PUDDLE = { x: 960, rx: 170, ry: 30 };
/** The hay bale with the cat asleep on it and the ball of wool next to her. */
export const BALE = { x0: 1240, x1: 1520, top: 640 };
export const CAT = { x: 1340 };
export const YARN_R = 32;
const YARN_START = { x: 1462, y: BALE.top - YARN_R };
/** The plank from the bale down to the ground, where the wool rolls down. */
export const PLANK = { a: { x: BALE.x1 - 10, y: BALE.top + 6 }, b: { x: 1760, y: FLOOR } };
/** The cow grazes facing left; `nose` is where her muzzle touches the grass. */
export const COW = { x: 2230, nose: { x: 2010, y: FLOOR - 22 } };
/** The dog's kennel; its round door looks to the right. */
export const KENNEL = { x0: 2700, x1: 2900, top: 590 };
/** The duck pond lies further back in the meadow. */
export const POND = { x: 3560, y: 690, rx: 330, ry: 60 };
export const DUCKS = 3;
/** The barn: red walls, a roof up to `peak`, and two doors in the middle. */
export const BARN = { x0: 4700, x1: 5400, wallTop: 420, peak: 190, door0: 4880, door1: 5220, doorTop: 520 };
export const BARN_MID = (BARN.x0 + BARN.x1) / 2;
/** The height of the barn roof at `x`. */
export const roofY = (x: number) => lerp(BARN.peak, BARN.wallTop - 20, Math.min(1, Math.abs(x - BARN_MID) / ((BARN.x1 - BARN.x0) / 2 + 40)));
/** Who waits in the stable and sings at the end, from left to right. */
export const SINGERS = [
  { id: "horse", x: 4960 },
  { id: "sheep", x: 5060 },
  { id: "hen", x: 5160 },
] as const;
/** Where the dog sits in front of the barn at the end. */
export const DOG_END = 4580;

/* ---------- The machine ---------- */

/** How fast the dog runs, in px per second. */
const RUN_SPEED = 430;
/** Seconds each duck flies from the pond to the roof, and between one duck and the next. */
const FLIGHT = 3;
const DUCK_GAP = 0.4;

export type Farm = ReturnType<typeof buildFarm>;

export function buildFarm() {
  const { at, sorted } = timeline();

  /* The rooster crows; little notes fly from his beak to the sleeping pig. */
  const tCrow = 0.1;
  at(0.15, { sound: crow });
  const beak = { x: POST.x + 70, y: POST.top - 132 };
  const pigEar = { x: PIG.x + 40, y: FLOOR - 120 };
  /** Where note `i` of the crow is (it flies from 0.4 s on, one after the other). */
  const crowNote = (i: number, t: number): { pt: Pt; k: number } => {
    const k = seg(t, 0.4 + 0.18 * i, 1.4 + 0.18 * i);
    return { pt: hop(beak, pigEar, 90 + 30 * i, k), k };
  };

  /* The pig wakes with a start, then jumps into the puddle: splash. */
  const tPigWake = 1.6;
  const tPigJump = 2.4;
  const tSplash = 3.1;
  at(tPigWake, { sound: oink });
  at(tPigJump, { sound: playWhoosh });
  at(tSplash, {
    sound: splash,
    say: { de: "Platsch! Das Schwein springt in die Pfütze." },
  });
  /** The pig's middle on the ground, how high it is in the air, and how far it is up (0 asleep to 1 on its legs). */
  const pigAt = (t: number) => {
    const up = easeInOut(seg(t, tPigWake, tPigWake + 0.25));
    const startle = 70 * Math.sin(Math.PI * seg(t, tPigWake, tPigWake + 0.45));
    const k = seg(t, tPigJump, tSplash);
    const flying = hop({ x: PIG.x, y: 0 }, { x: PUDDLE.x, y: 0 }, 170, k);
    return { x: flying.x, lift: startle - flying.y, up, inPuddle: t >= tSplash };
  };

  /* Three blobs of mud fly from the puddle onto the cat. */
  const MUD_LAND = [
    { x: CAT.x - 36, y: BALE.top - 52 },
    { x: CAT.x + 4, y: BALE.top - 62 },
    { x: CAT.x + 40, y: BALE.top - 44 },
  ];
  const tMud = (i: number) => tSplash + 0.75 + 0.08 * i;
  const mudAt = (i: number, t: number): Pt | null => {
    if (t < tSplash || t >= tMud(i)) return null;
    return hop({ x: PUDDLE.x + 40 + 30 * i, y: FLOOR - 30 }, MUD_LAND[i], 240, seg(t, tSplash, tMud(i)));
  };

  /* The cat jumps up with a meow, then pats the wool off the bale. */
  const tCatWake = tMud(0);
  const tSwat = tCatWake + 1.1;
  const tYarn = tSwat + 0.2;
  at(tCatWake, { sound: meow });
  at(tSwat, { sound: playPop });

  /* The wool rolls down the plank and over the grass to the cow's nose, a red thread behind it. */
  const plankLen = Math.hypot(PLANK.b.x - PLANK.a.x, PLANK.b.y - PLANK.a.y);
  /** The plank's normal, pointing up: where the middle of the ball is while it rolls on the plank. */
  const n = { x: (PLANK.b.y - PLANK.a.y) / plankLen, y: -(PLANK.b.x - PLANK.a.x) / plankLen };
  const onPlank = (p: Pt) => ({ x: p.x + n.x * YARN_R, y: p.y + n.y * YARN_R });
  const yarnPath = pathOf(
    line(YARN_START, { x: BALE.x1 - 20, y: YARN_START.y }),
    quad({ x: BALE.x1 - 20, y: YARN_START.y }, { x: BALE.x1 + 4, y: YARN_START.y }, onPlank({ x: PLANK.a.x + 40, y: PLANK.a.y + 26 })),
    line(onPlank({ x: PLANK.a.x + 40, y: PLANK.a.y + 26 }), onPlank({ x: PLANK.b.x - 30, y: PLANK.b.y - 20 })),
    quad(onPlank({ x: PLANK.b.x - 30, y: PLANK.b.y - 20 }), { x: PLANK.b.x + 20, y: FLOOR - YARN_R }, { x: PLANK.b.x + 80, y: FLOOR - YARN_R }),
    line({ x: PLANK.b.x + 80, y: FLOOR - YARN_R }, { x: COW.nose.x - YARN_R - 6, y: FLOOR - YARN_R }),
  );
  const yarnRun = roll(yarnPath, 140, 140, 700, 0.55);
  const tNose = tYarn + yarnRun.duration;
  /** Distance the wool has rolled, so the drawing can turn it and lay the thread. */
  const yarnDist = (t: number) => (t < tYarn ? 0 : distAt(yarnRun, t - tYarn));
  const yarnAt = (t: number) => along(yarnPath, yarnDist(t)).pt;
  at(tNose, { sound: playBoing });

  /* The cow lifts her head and moos; rings of the moo roll over to the kennel. */
  const tMoo = tNose + 0.45;
  at(tMoo, { sound: moo });
  /** How far the cow's head is up: 0 grazing, 1 up and mooing. */
  const cowHead = (t: number) => easeInOut(seg(t, tNose + 0.05, tMoo));
  const mooRing = (i: number, t: number) => seg(t, tMoo + 0.2 * i, tMoo + 0.2 * i + 1.3);

  /* The kennel shakes, the dog comes out barking and runs to the pond. */
  const tDog = tMoo + 1.1;
  const tRun = tDog + 0.9;
  const door = { x: KENNEL.x1 - 40 };
  // He stops at the near end of the pond, clear of the ducks.
  const pondEdge = POND.x - POND.rx - 30;
  const tPond = tRun + (pondEdge - door.x) / RUN_SPEED;
  at(tDog, { sound: bark });
  at(tPond, { sound: bark });
  /** The dog's middle, and whether he is running. */
  const dogAt = (t: number): { x: number; running: boolean } => {
    if (t < tDog) return { x: door.x - 70, running: false };
    if (t < tRun) return { x: lerp(door.x - 70, door.x + 20, easeInOut(seg(t, tDog, tDog + 0.5))), running: false };
    if (t < tPond) return { x: lerp(door.x + 20, pondEdge, seg(t, tRun, tPond)), running: true };
    if (t < tOnward) return { x: pondEdge, running: false };
    return { x: Math.min(DOG_END, pondEdge + (t - tOnward) * RUN_SPEED), running: t < tAtBarn };
  };

  /* The ducks quack and fly off the pond, one after the other, up onto the barn roof. */
  const tQuack = tPond + 0.25;
  at(tQuack, { sound: quack });
  const tTakeOff = (i: number) => tPond + 0.6 + DUCK_GAP * i;
  const tLand = (i: number) => tTakeOff(i) + FLIGHT;
  const tOnward = tTakeOff(0) + 0.4;
  const tAtBarn = tOnward + (DOG_END - pondEdge) / RUN_SPEED;
  const swim = (i: number): Pt => ({ x: POND.x - 140 + 140 * i, y: POND.y });
  const roofSpot = (i: number): Pt => {
    const x = BARN_MID - 150 + 150 * i;
    return { x, y: roofY(x) };
  };
  for (let i = 0; i < DUCKS; i++) {
    at(tTakeOff(i), { sound: playWhoosh });
    at(tLand(i), { sound: quack });
  }
  /** Where duck `i` is, and whether it is in the air. */
  const duckAt = (i: number, t: number): { pt: Pt; flying: boolean } => {
    if (t < tTakeOff(i)) return { pt: swim(i), flying: false };
    if (t >= tLand(i)) return { pt: roofSpot(i), flying: false };
    const k = easeInOut(seg(t, tTakeOff(i), tLand(i)));
    const a = swim(i);
    const b = roofSpot(i);
    const p = quad(a, { x: lerp(a.x, b.x, 0.45), y: 40 }, b, 60)[Math.round(k * 60)];
    return { pt: p, flying: true };
  };

  /* The barn doors swing open; one by one the animals inside sing, then all of them together. */
  const tDoors = tLand(DUCKS - 1) + 0.5;
  at(tDoors, { sound: playCreak });
  const doorsOpen = (t: number) => easeInOut(seg(t, tDoors, tDoors + 1));
  /** When each one sings alone: the three in the stable, the dog, the ducks. */
  const tSolo = [neigh, baa, cluck, bark, quack].map((sound, i) => {
    const ts = tDoors + 1.3 + 0.9 * i;
    at(ts, { sound });
    return ts;
  });
  const tChoir = tSolo[tSolo.length - 1] + 1.2;
  at(tChoir, { sound: playTusch, say: { de: "Alle Tiere singen zusammen!" } });
  [neigh, baa, cluck, bark, quack, moo].forEach((sound, i) => at(tChoir + 0.15 + 0.05 * i, { sound }));
  at(tChoir + 1, { sound: playTwinkle });
  const tDone = tChoir + 3.4;
  at(tDone, { done: true });
  /** How much a singer opens its mouth now: when it sings alone (`solo`, an index of `tSolo`) and in the choir. */
  const singing = (solo: number, t: number) => {
    const alone = Math.sin(Math.PI * seg(t, tSolo[solo], tSolo[solo] + 0.7));
    const together = t >= tChoir && t < tDone ? 0.6 + 0.4 * Math.sin((t - tChoir) * 9 + solo) : 0;
    return Math.max(alone, together);
  };

  /** Where the camera looks: along the chain, after the wool, the dog and the first duck, then the barn. */
  const focusX = (t: number) => {
    if (t < tSplash + 0.2) return 0;
    if (t < tYarn) return CAT.x;
    if (t < tNose) return Math.max(CAT.x, yarnAt(t).x);
    // The mooing cow and the kennel both in the picture, until the dog runs off.
    if (t < tRun) return (COW.nose.x + KENNEL.x1) / 2;
    if (t < tPond) return Math.max(KENNEL.x0, dogAt(t).x);
    if (t < tTakeOff(0)) return POND.x;
    if (t < tLand(0)) return Math.max(POND.x, duckAt(0, t).pt.x);
    return BARN_MID;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    tCrow,
    tPigWake,
    tSplash,
    tCatWake,
    tSwat,
    tYarn,
    tNose,
    tMoo,
    tDog,
    tPond,
    tChoir,
    tDone,
    crowNote,
    pigAt,
    mudAt,
    tMud,
    MUD_LAND,
    yarnPath,
    yarnDist,
    yarnAt,
    cowHead,
    mooRing,
    dogAt,
    duckAt,
    tTakeOff,
    tLand,
    doorsOpen,
    singing,
    cameraTarget,
  };
}
