// The farm machine ("Bauernhof", R-06), a Rube Goldberg machine where every
// link is an animal: one tap, and the rooster crows, the pig jumps into the
// puddle in fright, the splash of mud wakes the cat, the cat knocks its ball of
// wool down the hay bale onto the cow's nose, the cow's moo wakes the goat on
// her rocks, the goat hops down them and butts the milk can, the can tumbles
// klong, klong into the kennel, the dog comes out barking and chases the ducks
// off the pond, the ducks land one by one on the donkey's back, the donkey
// brays „I-aah“ and kicks the barn with his hind legs – the ducks fly up onto
// the roof with a somersault, the barn doors swing open, and all the animals
// in the stable sing, the donkey too, then everyone together.
// Everything is worked out ahead as a function of the seconds since the tap,
// so FarmLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the farmyard, 6700 × 900; the screen shows 1600 of it at a time.

import {
  playBaa,
  playBark,
  playBoing,
  playClonk,
  playCluck,
  playCreak,
  playCrow,
  playCrunch,
  playKnock,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playPop,
  playQuack,
  playRecorded,
  playSplash,
  playThump,
  playTusch,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { along, cameraOn, distAt, easeIn, easeInOut, easeOut, hop, lerp, pathOf, rad, roll, seg, timeline, turn } from "./machineKit";
import { line, quad, type Pt } from "./path";

export const WORLD_W = 6700;
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
// There are no recordings of a goat or a donkey: the goat bleats with the synthesized bleat (thinner and quicker than
// the sheep's recording), and the donkey's „I-aah“ is a whinny („I…“) and a low moo („…aah“) one after the other.
const bleat = playBaa;
const hee = playNeigh;
const haw = playMoo;
/** The hoof hitting the barn wall: a deep wooden knock with a thump. */
const bang = () => {
  playKnock(260);
  playThump();
};

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
/** The rings of the moo: they grow from the cow's mouth, from radius `R0` by `GROW` in `TIME` seconds (slowing down). */
export const MOO_MOUTH = { x: COW.x - 285, y: FLOOR - 150 };
export const MOO_RING_R0 = 40;
export const MOO_RING_GROW = 760;
const MOO_RING_TIME = 1.3;
/** Three stone steps going down to the right; the goat dozes on the top one. */
export const ROCKS = [
  { x0: 2530, x1: 2660, top: FLOOR - 200 },
  { x0: 2640, x1: 2760, top: FLOOR - 130 },
  { x0: 2740, x1: 2850, top: FLOOR - 65 },
];
/** Where the goat's feet are: on each step, then on the grass below them. */
export const GOAT_SPOTS: Pt[] = [
  { x: 2595, y: ROCKS[0].top },
  { x: 2700, y: ROCKS[1].top },
  { x: 2795, y: ROCKS[2].top },
  { x: 2905, y: FLOOR },
];
/** How far the goat's horns reach in front of her middle. */
export const GOAT_HORNS = 92;
/** The milk can standing in the grass, `w` wide and `h` high; it tumbles three times to the right. */
export const CAN = { x: 3200, w: 64, h: 110 };
const CAN_TUMBLES = 3;
/** The dog's kennel; its round door looks to the right. The tumbling milk can just reaches its wall. */
export const KENNEL = { x0: CAN.x - CAN.w / 2 + 2 * CAN.w + 2 * CAN.h + 2, x1: CAN.x - CAN.w / 2 + 2 * CAN.w + 2 * CAN.h + 202, top: 590 };
/** The duck pond lies further back in the meadow. */
export const POND = { x: 4380, y: 690, rx: 330, ry: 60 };
export const DUCKS = 3;
/**
 * The donkey stands in front of the barn facing left, his rump to its wall. `hip` is where his hind legs hang
 * (from his middle on the ground), `leg` how long they are, `pivot` where he rocks forward when he kicks, and `back`
 * his body (an ellipse's middle height and radii), where the ducks sit.
 */
export const DONKEY = { x: 5650, hip: { x: 70, y: -135 }, leg: 135, pivot: { x: -60, y: 0 }, back: { y: -150, rx: 118, ry: 52 } };
/** How far the donkey leans (degrees, his rump up) and swings his hind legs back when he kicks. */
const KICK_TILT = -12;
const KICK_SWING = -80;
/** Where a hoof of the hind legs is, the donkey leaning `tilt` and swinging his legs `swing` degrees. */
export function donkeyHoof(tilt: number, swing: number): Pt {
  const pivot = { x: DONKEY.x + DONKEY.pivot.x, y: FLOOR + DONKEY.pivot.y };
  const hip = turn({ x: DONKEY.x + DONKEY.hip.x, y: FLOOR + DONKEY.hip.y }, pivot, rad(tilt));
  return turn({ x: hip.x, y: hip.y + DONKEY.leg }, hip, rad(tilt + swing));
}
/** The barn: red walls, a roof up to `peak`, and two doors in the middle; its left wall is where the donkey's kick lands. */
const BARN_X0 = Math.round(donkeyHoof(KICK_TILT, KICK_SWING).x) - 4;
export const BARN = { x0: BARN_X0, x1: BARN_X0 + 700, wallTop: 420, peak: 190, door0: BARN_X0 + 180, door1: BARN_X0 + 520, doorTop: 520 };
export const BARN_MID = (BARN.x0 + BARN.x1) / 2;
/** The height of the barn roof at `x`. */
export const roofY = (x: number) => lerp(BARN.peak, BARN.wallTop - 20, Math.min(1, Math.abs(x - BARN_MID) / ((BARN.x1 - BARN.x0) / 2 + 40)));
/** Who waits in the stable and sings at the end, from left to right. */
export const SINGERS = [
  { id: "horse", x: BARN.x0 + 260 },
  { id: "sheep", x: BARN.x0 + 360 },
  { id: "hen", x: BARN.x0 + 460 },
] as const;
/** Where the dog sits at the end, in front of the donkey's nose. */
export const DOG_END = 5230;

/* ---------- The machine ---------- */

/** How fast the dog runs, in px per second. */
const RUN_SPEED = 430;
/** Seconds each duck flies from the pond to the roof, and between one duck and the next. */
const FLIGHT = 3;
const DUCK_GAP = 0.7;
/** Seconds the ducks fly from the donkey's back up onto the roof. */
const ROOF_HOP = 0.9;

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

  /* The cow lifts her head and moos; rings of the moo roll over the meadow to the dozing goat. */
  const tMoo = tNose + 0.45;
  at(tMoo, { sound: moo });
  /** How far the cow's head is up: 0 grazing, 1 up and mooing. */
  const cowHead = (t: number) => easeInOut(seg(t, tNose + 0.05, tMoo));
  const mooRing = (i: number, t: number) => seg(t, tMoo + 0.2 * i, tMoo + 0.2 * i + MOO_RING_TIME);
  // The goat wakes when the first ring reaches her head (the ring's radius grows as in MooRings).
  const goatHead = { x: GOAT_SPOTS[0].x + 60, y: GOAT_SPOTS[0].y - 110 };
  const toGoat = Math.hypot(goatHead.x - MOO_MOUTH.x, goatHead.y - MOO_MOUTH.y);
  const tGoatWake = tMoo + MOO_RING_TIME * (1 - Math.sqrt(1 - (toGoat - MOO_RING_R0) / MOO_RING_GROW));

  /* The goat jumps up with a bleat, hops down her three steps, scrapes her hoof, lowers her horns and charges:
     the first time the milk can only wobbles, so she backs off, shakes her head and charges again, harder. */
  at(tGoatWake, { sound: bleat });
  const HOP_TIME = 0.42;
  const tHop = (i: number) => tGoatWake + 0.9 + 0.48 * i;
  for (let i = 0; i < GOAT_SPOTS.length - 1; i++) at(tHop(i) + HOP_TIME, { sound: () => playKnock(950 - 150 * i) });
  const tGround = tHop(GOAT_SPOTS.length - 2) + HOP_TIME;
  const ground = GOAT_SPOTS[GOAT_SPOTS.length - 1];
  const buttX = CAN.x - CAN.w / 2 - GOAT_HORNS;
  const backX = buttX - 130;
  const tCharge1 = tGround + 0.75;
  const tButt1 = tCharge1 + 0.55;
  const tCharge = tButt1 + 1.9;
  const tButt = tCharge + 0.6;
  for (const ts of [tGround + 0.35, tButt1 + 1.15, tButt1 + 1.5]) at(ts, { sound: playCrunch });
  at(tButt1, { sound: () => playKnock(520) });
  at(tButt1 + 0.75, { sound: bleat });
  at(tCharge, { sound: bleat });
  at(tButt, { sound: playClonk });
  /** The goat: where her feet are, how far her head is lowered (0 up, 1 horns forward), awake, and how dizzy she is (0 to 1). */
  const goatAt = (t: number) => {
    let pt: Pt = GOAT_SPOTS[0];
    for (let i = 0; i < GOAT_SPOTS.length - 1; i++) {
      if (t >= tHop(i)) pt = hop(GOAT_SPOTS[i], GOAT_SPOTS[i + 1], 60, seg(t, tHop(i), tHop(i) + HOP_TIME));
    }
    // Up with a start when the moo arrives.
    const startle = 46 * Math.sin(Math.PI * seg(t, tGoatWake, tGoatWake + 0.4));
    if (t >= tCharge1) pt = { x: lerp(ground.x, buttX, easeIn(seg(t, tCharge1, tButt1))), y: FLOOR };
    // The can doesn't budge: she bounces back with a hop, and runs at it again.
    if (t >= tButt1) pt = hop({ x: buttX, y: FLOOR }, { x: backX, y: FLOOR }, 40, seg(t, tButt1, tButt1 + 0.5));
    if (t >= tCharge) pt = { x: lerp(backX, buttX, easeIn(seg(t, tCharge, tButt))), y: FLOOR };
    // This time the can tumbles, and she bounces back off it.
    if (t >= tButt) pt = hop({ x: buttX, y: FLOOR }, { x: buttX - 55, y: FLOOR }, 34, seg(t, tButt, tButt + 0.4));
    const lowered = (t0: number, t1: number) => easeInOut(seg(t, t0, t0 + 0.25)) * (1 - easeInOut(seg(t, t1, t1 + 0.4)));
    const head = Math.max(lowered(tGround + 0.1, tButt1 + 0.25), lowered(tCharge - 0.45, tButt + 0.3));
    // She shakes her head after the first butt, and sees stars after the second.
    const shake = Math.sin(Math.PI * seg(t, tButt1 + 0.45, tButt1 + 1.05)) * Math.sin((t - tButt1) * 30);
    const dizzy = Math.sin(Math.PI * seg(t, tButt + 0.1, tButt + 2.2));
    return { pt: { x: pt.x, y: pt.y - startle }, head, shake, awake: t >= tGoatWake, dizzy };
  };

  /* The milk can tumbles over three times, klong, klong, and bumps into the kennel. */
  const TUMBLE = 0.36;
  const tTumble = (i: number) => tButt + 0.02 + TUMBLE * i;
  const tKennelHit = tTumble(CAN_TUMBLES);
  for (let i = 1; i < CAN_TUMBLES; i++) at(tTumble(i), { sound: playClonk });
  at(tKennelHit, { sound: playThump });
  /** The milk can's middle and how far it has turned (degrees, clockwise). */
  const canAt = (t: number): { pt: Pt; angle: number } => {
    let left = CAN.x - CAN.w / 2;
    for (let i = 0; i < CAN_TUMBLES; i++) {
      const width = i % 2 ? CAN.h : CAN.w;
      const height = i % 2 ? CAN.w : CAN.h;
      if (t < tTumble(i + 1) || i === CAN_TUMBLES - 1) {
        // It turns over the corner in front of it, falling faster as it goes.
        const k = easeIn(seg(t, tTumble(i), tTumble(i + 1)));
        const pivot = { x: left + width, y: FLOOR };
        const middle = { x: left + width / 2, y: FLOOR - height / 2 };
        return { pt: turn(middle, pivot, (Math.PI / 2) * k), angle: 90 * (i + k) };
      }
      left += width;
    }
    return { pt: { x: CAN.x, y: FLOOR - CAN.h / 2 }, angle: 0 };
  };
  /** How far the standing milk can rocks on its bottom (degrees) after the goat's first butt. */
  const canRock = (t: number) => {
    const age = t - tButt1;
    return age < 0 || t >= tButt ? 0 : 10 * Math.exp(-3 * age) * Math.sin(age * 16);
  };

  /* The kennel shakes, the dog comes out barking and runs to the pond. */
  const tDog = tKennelHit + 0.55;
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

  /* The ducks quack and fly off the pond, one after the other, onto the donkey's back. */
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
  /** Where duck `i` sits on the donkey's back while he stands still: along the top of his body, towards his rump. */
  const backSpot = (i: number): Pt => {
    const dx = -45 + 75 * i;
    return { x: DONKEY.x + dx, y: FLOOR + DONKEY.back.y - DONKEY.back.ry * Math.sqrt(1 - (dx / DONKEY.back.rx) ** 2) + 2 };
  };
  for (let i = 0; i < DUCKS; i++) {
    at(tTakeOff(i), { sound: playWhoosh });
    at(tLand(i), { sound: quack });
  }

  /* With every duck the donkey's back gives a little; after the third he brays „I-aah, I-aah“ and kicks the barn. */
  /** How far the donkey's back is pressed down now by the ducks landing on it. */
  const backDip = (t: number) =>
    Array.from({ length: DUCKS }, (_, i) => t - tLand(i)).reduce(
      (sum, age) => sum + (age < 0 || age > 1.2 ? 0 : 14 * Math.exp(-5 * age) * Math.cos(age * 16)),
      0,
    );
  // Three ducks are too many: he stamps a front hoof twice, then brays.
  const tStamp = [tLand(DUCKS - 1) + 0.55, tLand(DUCKS - 1) + 0.95];
  for (const ts of tStamp) at(ts, { sound: () => playKnock(330) });
  const tBray = tLand(DUCKS - 1) + 1.5;
  const tHaw = [tBray + 0.55, tBray + 1.8];
  [tBray, tBray + 1.25].forEach((ts, i) => {
    at(ts, { sound: hee });
    at(tHaw[i], { sound: haw });
  });
  const tKick = tBray + 3;
  at(tKick, { sound: bang, say: { de: "Der Esel tritt, und die Scheune geht auf." } });
  /** The donkey now: how far he leans (degrees, his rump up), how far his hind legs swing back, his head up (0 to 1), his mouth and a stamping hoof. */
  const donkeyAt = (t: number) => {
    // He crouches a little, then snaps his rump up and his hind legs back, and slowly stands again.
    const crouch = Math.sin(Math.PI * seg(t, tKick - 0.55, tKick - 0.1));
    const snap = easeOut(seg(t, tKick - 0.12, tKick)) * (1 - easeInOut(seg(t, tKick + 0.2, tKick + 0.8)));
    const tilt = 5 * crouch + KICK_TILT * snap;
    const swing = KICK_SWING * snap;
    const head = easeInOut(seg(t, tBray - 0.3, tBray)) * (1 - easeInOut(seg(t, tBray + 2.6, tBray + 2.9)));
    const brays = [tBray, tHaw[0], tBray + 1.25, tHaw[1]];
    const mouth = Math.max(...brays.map((b, i) => (i % 2 ? 1 : 0.6) * Math.sin(Math.PI * seg(t, b, b + (i % 2 ? 0.8 : 0.5)))));
    // How high his front hoof is lifted for a stamp.
    const stamp = Math.max(...tStamp.map((ts) => Math.sin(Math.PI * seg(t, ts - 0.22, ts))));
    return { tilt, swing, head, mouth, stamp, dip: backDip(t) };
  };
  /** Where a duck on the donkey's back is now: it rides along as he leans and his back gives. */
  const onBack = (i: number, t: number): Pt => {
    const d = donkeyAt(t);
    const p = turn(backSpot(i), { x: DONKEY.x + DONKEY.pivot.x, y: FLOOR + DONKEY.pivot.y }, rad(d.tilt));
    return { x: p.x, y: p.y + d.dip };
  };

  /* The kick throws the ducks up onto the barn roof, each with a somersault. */
  const tFlyUp = (i: number) => tKick + 0.03 + 0.12 * i;
  const tOnRoof = (i: number) => tFlyUp(i) + ROOF_HOP;
  for (let i = 0; i < DUCKS; i++) at(tOnRoof(i), { sound: quack });
  at(tFlyUp(0), { sound: playBoing });
  /** Where duck `i` is, whether it is in the air, and how far it has turned in its somersault (degrees). */
  const duckAt = (i: number, t: number): { pt: Pt; flying: boolean; spin: number } => {
    if (t < tTakeOff(i)) return { pt: swim(i), flying: false, spin: 0 };
    if (t >= tOnRoof(i)) return { pt: roofSpot(i), flying: false, spin: 0 };
    if (t >= tFlyUp(i)) {
      const k = seg(t, tFlyUp(i), tOnRoof(i));
      return { pt: hop(onBack(i, tFlyUp(i)), roofSpot(i), 230, k), flying: true, spin: -360 * easeInOut(k) };
    }
    if (t >= tLand(i)) return { pt: onBack(i, t), flying: false, spin: 0 };
    const k = easeInOut(seg(t, tTakeOff(i), tLand(i)));
    const a = swim(i);
    const b = backSpot(i);
    const p = quad(a, { x: lerp(a.x, b.x, 0.45), y: 40 }, b, 60)[Math.round(k * 60)];
    return { pt: p, flying: true, spin: 0 };
  };

  /* The kick shakes the barn and its doors swing open; one by one the animals sing, then all of them together. */
  const tDoors = tKick + 0.35;
  at(tDoors, { sound: playCreak });
  const doorsOpen = (t: number) => easeInOut(seg(t, tDoors, tDoors + 1));
  /** When each one sings alone: the three in the stable, the dog, the ducks, the donkey. */
  const tSolo = [neigh, baa, cluck, bark, quack, hee].map((sound, i) => {
    const ts = tDoors + 1.3 + 0.9 * i;
    at(ts, { sound });
    return ts;
  });
  const DONKEY_SOLO = tSolo.length - 1;
  at(tSolo[DONKEY_SOLO] + 0.5, { sound: haw });
  const tChoir = tSolo[DONKEY_SOLO] + 1.7;
  at(tChoir, { sound: playTusch, say: { de: "Alle Tiere singen zusammen!" } });
  [neigh, baa, cluck, bark, quack, moo, bleat, hee].forEach((sound, i) => at(tChoir + 0.15 + 0.05 * i, { sound }));
  at(tChoir + 0.9, { sound: haw });
  at(tChoir + 1, { sound: playTwinkle });
  const tDone = tChoir + 3.4;
  at(tDone, { done: true });
  /** How much a singer opens its mouth now: when it sings alone (`solo`, an index of `tSolo`) and in the choir. */
  const singing = (solo: number, t: number) => {
    const alone = Math.sin(Math.PI * seg(t, tSolo[solo], tSolo[solo] + (solo === DONKEY_SOLO ? 1.3 : 0.7)));
    const together = t >= tChoir && t < tDone ? 0.6 + 0.4 * Math.sin((t - tChoir) * 9 + solo) : 0;
    return Math.max(alone, together);
  };

  /** Where the camera looks: along the chain, after the wool, the goat, the milk can, the dog and the first duck, then the barn. */
  const focusX = (t: number) => {
    if (t < tSplash + 0.2) return 0;
    if (t < tYarn) return CAT.x;
    if (t < tNose) return Math.max(CAT.x, yarnAt(t).x);
    // The mooing cow and the goat on her rocks both in the picture.
    if (t < tHop(0)) return (COW.nose.x + ROCKS[2].x1) / 2;
    if (t < tButt) return Math.max((COW.nose.x + ROCKS[2].x1) / 2, goatAt(t).pt.x - 100);
    // The tumbling can, then the goat and the shaking kennel, until the dog runs off.
    if (t < tKennelHit) return Math.max(goatAt(tButt).pt.x - 100, canAt(t).pt.x);
    if (t < tRun) return KENNEL.x0;
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
    tGoatWake,
    tHop,
    tGround,
    tCharge1,
    tButt1,
    tCharge,
    tButt,
    tTumble,
    tKennelHit,
    tDog,
    tPond,
    tBray,
    tKick,
    tDoors,
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
    goatAt,
    canAt,
    canRock,
    dogAt,
    duckAt,
    donkeyAt,
    tTakeOff,
    tLand,
    tFlyUp,
    tOnRoof,
    doorsOpen,
    singing,
    cameraTarget,
  };
}
