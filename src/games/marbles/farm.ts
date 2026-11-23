// The farm machine ("Bauernhof", R-06), a Rube Goldberg machine where every
// link is an animal: one tap, and the rooster crows, the pig jumps into the
// puddle in fright, the splash of mud wakes the cat, the cat knocks its ball of
// wool down the hay bale onto the cow's nose, the cow's moo wakes the goat on
// her rocks, the goat hops down them and butts the milk can, the can tumbles
// klong, klong into the kennel, the dog comes out barking at the turkey, the
// turkey gobbles and fans its tail, which tips the grain sack over, a grain
// wakes the hen, she pecks her way along the grains onto the tractor and
// pecks its horn, the fox farmer drives off to the pond, a second honk wakes
// the goose, who jumps into the pond and honks at the ducks, the ducks land
// one by one on the donkey's back, the donkey brays „I-aah“ and kicks the barn
// with his hind legs – the ducks fly up onto the roof with a somersault, a
// swallow darts out of her nest and turns the door's latch, the barn doors
// swing open, and all the animals in the stable sing, the donkey too, then
// everyone together.
// Everything is worked out ahead as a function of the seconds since the tap,
// so FarmLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the farmyard, 9080 × 900; the screen shows 1600 of it at a time.

import { decay } from "./level";
import {
  playBaa,
  playBark,
  playBoing,
  playClonk,
  playCluck,
  playCreak,
  playCrow,
  playCrunch,
  playEngine,
  playHonk,
  playKnock,
  playMeow,
  playMoo,
  playNeigh,
  playOink,
  playPeck,
  playPop,
  playQuack,
  playRecorded,
  playRustle,
  playSplash,
  playSqueak,
  playThump,
  playTick,
  playTusch,
  playTweet,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { along, cameraOn, deg, distAt, easeIn, easeInOut, easeOut, hop, lerp, pathOf, rad, roll, seg, timeline, turn, hump } from "./machineKit";
import { line, quad, type Pt } from "./path";

export const WORLD_W = 9080;
export const FLOOR = 800;

/** The recordings the animals (and the tractor) call with, loaded when the level opens. */
export const FARM_SOUNDS = [
  "crow",
  "oink",
  "splash",
  "meow",
  "moo",
  "bark",
  "quack",
  "neigh",
  "baa",
  "cluck",
  "goat",
  "heehaw",
  "gobble",
  "peep",
  "goose",
  "engine",
  "tweet",
];

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
const bleat = () => playRecorded("goat", playBaa);
/** The donkey's whole „I-aah, I-aah“ (about 2.7 s). */
const heehaw = () => playRecorded("heehaw", playNeigh);
const gobble = () => playRecorded("gobble", playCluck);
const peep = () => playRecorded("peep", playSqueak);
const honkGoose = () => playRecorded("goose", playHonk);
const engine = () => playRecorded("engine", playEngine);
const tweet = () => playRecorded("tweet", playTweet);
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
/** The turkey stands in the meadow facing left, towards the kennel; its tail feathers grow from `TAIL` and are `r` long. */
export const TURKEY = { x: 4150 };
export const TAIL = { x: TURKEY.x + 40, y: FLOOR - 90, r: 150 };
/** The tail's feathers: folded they all point up and back (`FOLDED` degrees), fanned they spread from `FAN_FROM` to `FAN_TO`. */
export const FEATHERS = 7;
const FOLDED = -60;
const FAN_FROM = -165;
const FAN_TO = -12;
/** The angle (degrees) of tail feather `i` (0 at the front) with the tail fanned `fan` (0 folded to 1 open). */
export const featherAngle = (i: number, fan: number) => lerp(FOLDED, lerp(FAN_FROM, FAN_TO, i / (FEATHERS - 1)), fan);
/** The tip of tail feather `i`. */
export const featherTip = (i: number, fan: number): Pt => ({
  x: TAIL.x + TAIL.r * Math.cos(rad(featherAngle(i, fan))),
  y: TAIL.y + TAIL.r * Math.sin(rad(featherAngle(i, fan))),
});
/** The open sack of grain standing behind the turkey, `w` wide and `h` high; the last feather's tip just reaches its side. */
export const SACK = { x0: Math.round(TAIL.x + TAIL.r * Math.cos(rad(-15))), w: 92, h: 140 };
/** The sack's corner it tips over, to the right. */
export const SACK_PIVOT = { x: SACK.x0 + SACK.w, y: FLOOR };
/** The brown hen dozes in her straw nest beyond the sack with her three chicks; she looks right. */
export const HEN = { x: 4720 };
export const CHICKS = 3;
/** Where the hen's head is (its middle) while she sits, and how far her beak reaches in front of her middle when she pecks. */
export const henHead = (x: number) => ({ x: x + 38, y: FLOOR - 86 });
export const HEN_REACH = 60;
/** The grains the hen pecks, one after the other, from the nest to the tractor. */
export const GRAINS = [4800, 4900, 5000, 5100];
/**
 * The tractor, facing right: `x` is its big back wheel's middle, which has a mudguard over it with a bulb horn at
 * its front; the fox farmer sits behind the steering wheel. `DRIVE` is how far it drives to the pond.
 */
export const TRACTOR = { x: 5260, wheel: 88, guard: FLOOR - 190, front: 330 };
export const TRACTOR_DRIVE = 680;
/** The rubber bulb of the horn on the mudguard, relative to the back wheel's middle. */
export const HORN_BULB = { dx: -2, y: TRACTOR.guard - 14, r: 13 };
/** Where the hen stands on the mudguard (her feet), relative to the back wheel's middle: her beak just reaches the bulb. */
export const GUARD_SPOT = { dx: HORN_BULB.dx - HORN_BULB.r - HEN_REACH + 1, y: TRACTOR.guard };
/** The duck pond lies further back in the meadow. */
export const POND = { x: 6760, y: 690, rx: 330, ry: 60 };
export const DUCKS = 3;
/** The grey goose dozes on the bank in front of the pond, looking right; it jumps in at `water`. */
export const GOOSE = { x: 6360, half: 58, water: 6490 };
/**
 * The donkey stands in front of the barn facing left, his rump to its wall. `hip` is where his hind legs hang
 * (from his middle on the ground), `leg` how long they are, `pivot` where he rocks forward when he kicks, and `back`
 * his body (an ellipse's middle height and radii), where the ducks sit.
 */
export const DONKEY = { x: 8030, hip: { x: 70, y: -135 }, leg: 135, pivot: { x: -60, y: 0 }, back: { y: -150, rx: 118, ry: 52 } };
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
export const DOG_END = 7610;
/** The swallows' nest of mud under the barn's eaves, at its left wall. */
export const NEST = { x: BARN.x0 + 56, y: BARN.wallTop + 26 };
/** The wooden turn button on the left door's free edge, lying across both doors to keep them shut: it turns on its nail, `half` long each way. */
export const LATCH = { x: BARN_MID, y: BARN.doorTop + 8, half: 62 };
/** Where the swallow sits on the roof at the end, between the ducks. */
export const PERCH = { x: BARN_MID + 75, y: roofY(BARN_MID + 75) };

/* ---------- The machine ---------- */

/** How fast the dog runs, in px per second. */
const RUN_SPEED = 430;
/** Seconds each duck flies from the pond to the roof, and between one duck and the next. */
const FLIGHT = 3;
const DUCK_GAP = 0.7;
/** Seconds the ducks fly from the donkey's back up onto the roof. */
const ROOF_HOP = 0.9;
/** Where the camera looks while the grains fly and the hen wakes: turkey, sack, hen and grains all in the picture. */
const HEN_VIEW = 4500;

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
    say: {
      de: "Platsch! Das Schwein springt in die Pfütze.",
      en: "Splash! The pig jumps into the puddle.",
      zh: "扑通！小猪跳进水坑啦。",
      hi: "छपाक! सूअर कीचड़ में कूदता है।",
      es: "¡Plaf! El cerdito salta al charco.",
      ar: "طشّ! الخنزير يقفز في البركة.",
      ru: "Плюх! Свинка прыгает в лужу.",
    },
  });
  /** The pig's middle on the ground, how high it is in the air, and how far it is up (0 asleep to 1 on its legs). */
  const pigAt = (t: number) => {
    const up = easeInOut(seg(t, tPigWake, tPigWake + 0.25));
    const startle = 70 * hump(seg(t, tPigWake, tPigWake + 0.45));
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
    const startle = 46 * hump(seg(t, tGoatWake, tGoatWake + 0.4));
    if (t >= tCharge1) pt = { x: lerp(ground.x, buttX, easeIn(seg(t, tCharge1, tButt1))), y: FLOOR };
    // The can doesn't budge: she bounces back with a hop, and runs at it again.
    if (t >= tButt1) pt = hop({ x: buttX, y: FLOOR }, { x: backX, y: FLOOR }, 40, seg(t, tButt1, tButt1 + 0.5));
    if (t >= tCharge) pt = { x: lerp(backX, buttX, easeIn(seg(t, tCharge, tButt))), y: FLOOR };
    // This time the can tumbles, and she bounces back off it.
    if (t >= tButt) pt = hop({ x: buttX, y: FLOOR }, { x: buttX - 55, y: FLOOR }, 34, seg(t, tButt, tButt + 0.4));
    const lowered = (t0: number, t1: number) => easeInOut(seg(t, t0, t0 + 0.25)) * (1 - easeInOut(seg(t, t1, t1 + 0.4)));
    const head = Math.max(lowered(tGround + 0.1, tButt1 + 0.25), lowered(tCharge - 0.45, tButt + 0.3));
    // She shakes her head after the first butt, and sees stars after the second.
    const shake = hump(seg(t, tButt1 + 0.45, tButt1 + 1.05)) * Math.sin((t - tButt1) * 30);
    const dizzy = hump(seg(t, tButt + 0.1, tButt + 2.2));
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
    return age < 0 || t >= tButt ? 0 : 10 * decay(3 * age) * Math.sin(age * 16);
  };

  /* The kennel shakes, the dog comes out barking and runs to the turkey, his nose just short of its head. */
  const tDog = tKennelHit + 0.55;
  const tRun = tDog + 0.9;
  const door = { x: KENNEL.x1 - 40 };
  const dogStop = TURKEY.x - 250;
  const tTurkeyBark = tRun + (dogStop - door.x - 20) / RUN_SPEED;
  at(tDog, { sound: bark });
  at(tTurkeyBark, { sound: bark });
  /** The dog's middle, and whether he is running. */
  const dogAt = (t: number): { x: number; running: boolean } => {
    if (t < tDog) return { x: door.x - 70, running: false };
    if (t < tRun) return { x: lerp(door.x - 70, door.x + 20, easeInOut(seg(t, tDog, tDog + 0.5))), running: false };
    if (t < tTurkeyBark) return { x: lerp(door.x + 20, dogStop, seg(t, tRun, tTurkeyBark)), running: true };
    if (t < tOnward) return { x: dogStop, running: false };
    return { x: Math.min(DOG_END, dogStop + (t - tOnward) * RUN_SPEED), running: t < tAtBarn };
  };

  /* The turkey jumps with fright, gobbles and fans its tail: the last feather sweeps against the sack and tips it over. */
  const tGobble = tTurkeyBark + 0.45;
  const tFan = tGobble + 0.25;
  const FAN_TIME = 0.8;
  at(tGobble, { sound: gobble });
  at(tFan, { sound: playRustle });
  /** How far the tail is fanned, 0 folded to 1 open. */
  const fanAt = (t: number) => easeOut(seg(t, tFan, tFan + FAN_TIME));
  // The moment the last feather's tip reaches the sack's side.
  const fanTouch = (-deg(Math.acos((SACK.x0 - TAIL.x) / TAIL.r)) - FOLDED) / (FAN_TO - FOLDED);
  const tTip = tFan + FAN_TIME * (1 - Math.sqrt(1 - fanTouch));
  const tSackDown = tTip + 0.6;
  at(tSackDown, { sound: playThump });
  /** The turkey: how high it jumps with fright, how far its beak is open, and how far its tail is fanned. */
  const turkeyAt = (t: number) => ({
    lift: 40 * hump(seg(t, tTurkeyBark + 0.1, tTurkeyBark + 0.45)),
    mouth: Math.max(0, hump(seg(t, tGobble, tGobble + 1.2)) * Math.abs(Math.sin((t - tGobble) * 14))),
    fan: fanAt(t),
  });
  /** How far the sack has tipped over (degrees, clockwise round its right corner). */
  const sackTilt = (t: number) => 90 * easeIn(seg(t, tTip, tSackDown));

  /* The grains spill out of the sack's mouth: the first lands on the dozing hen's head, the others in a row to the tractor. */
  const mouth = turn({ x: SACK.x0 + SACK.w / 2, y: FLOOR - SACK.h }, SACK_PIVOT, rad(90));
  const tGrainOff = (i: number) => tSackDown + 0.1 + 0.12 * i;
  const tGrain = (i: number) => tGrainOff(i) + 0.75;
  const onHead = { x: henHead(HEN.x).x, y: henHead(HEN.x).y - 26 };
  const tHenWake = tGrain(0);
  for (let i = 1; i < GRAINS.length; i++) at(tGrain(i), { sound: playTick });
  at(tHenWake, { sound: playPop });
  /** Where grain `i` is now, or null once the hen has eaten it (or before it is out). */
  const grainAt = (i: number, t: number): Pt | null => {
    if (t < tGrainOff(i) || t >= tPeck(i)) return null;
    const ground = { x: GRAINS[i], y: FLOOR - 6 };
    if (i > 0) return hop(mouth, ground, 110 + 30 * i, seg(t, tGrainOff(i), tGrain(i)));
    // The first one bounces off her head onto the grass in front of her.
    if (t < tGrain(0)) return hop(mouth, onHead, 120, seg(t, tGrainOff(0), tGrain(0)));
    return hop(onHead, ground, 40, seg(t, tGrain(0), tGrain(0) + 0.35));
  };

  /* The hen wakes with a cluck, the chicks peep, and she pecks the grains one by one, walking towards the tractor. */
  at(tHenWake + 0.1, { sound: cluck });
  at(tHenWake + 0.7, { sound: peep });
  const tPeck = (i: number) => tHenWake + 1.1 + 0.8 * i;
  GRAINS.forEach((_, i) => at(tPeck(i), { sound: playPeck }));
  const PECKS = GRAINS.length;
  /** Where the hen stands on the grass (her middle) while she walks from grain to grain. */
  const henOnGround = (t: number) => {
    let x = HEN.x;
    GRAINS.forEach((g, i) => {
      x = lerp(x, g - HEN_REACH, easeInOut(seg(t, tPeck(i) - 0.55, tPeck(i) - 0.12)));
    });
    return x;
  };

  /* She flutters up onto the tractor's mudguard and pecks the rubber bulb of its horn: honk! */
  const tHenHop = tPeck(PECKS - 1) + 0.45;
  const tOnGuard = tHenHop + 0.5;
  const tHorn = tOnGuard + 0.6;
  at(tHenHop, { sound: playWhoosh });
  at(tOnGuard, { sound: cluck });
  at(tHorn, { sound: playHonk });

  /* The honk wakes the fox farmer under his straw hat; he pushes it up, starts the engine – puff, puff – and drives
     slowly to the pond, the hen riding on the mudguard. At the pond the hen pecks the horn once more. */
  const tFarmerUp = tHorn + 0.3;
  const tEngine = tFarmerUp + 0.8;
  const tDrive = tEngine + 0.8;
  const tDriveEnd = tDrive + 4.2;
  const tHorn2 = tDriveEnd + 0.5;
  for (const ts of [tEngine, tDrive + 0.8, tDrive + 2.4]) at(ts, { sound: engine });
  at(tHorn2, { sound: playHonk });
  /** The tractor's back wheel middle, how far its wheels have turned (degrees), and how much it shakes with its engine on. */
  const tractorAt = (t: number) => {
    const k = easeInOut(seg(t, tDrive, tDriveEnd));
    const x = TRACTOR.x + TRACTOR_DRIVE * k;
    const running = t >= tEngine && t < tHorn2 + 1.2;
    return { x, spin: (deg(TRACTOR_DRIVE * k) / TRACTOR.wheel) % 360, shake: running ? 1.6 * Math.sin(t * 40) : 0 };
  };
  /** How far the farmer has pushed his hat up off his eyes: 0 asleep, 1 awake. */
  const farmerAwake = (t: number) => easeInOut(seg(t, tFarmerUp, tFarmerUp + 0.5));
  /** When each little cloud of the exhaust puffs out, from the start of the engine until the tractor stands again. */
  const puffs = Array.from({ length: Math.floor((tHorn2 + 0.6 - tEngine) / 0.42) }, (_, i) => tEngine + 0.1 + 0.42 * i);
  /** The hen: her middle on the ground or on the mudguard, how far she is up (0 sitting, 1 standing), her pecking head (0 to 1), awake. */
  const henAt = (t: number) => {
    const pecks = [...GRAINS.map((_, i) => tPeck(i)), tHorn, tHorn2];
    const peck = Math.max(...pecks.map((p) => hump(seg(t, p - 0.14, p + 0.2))));
    const up = easeInOut(seg(t, tHenWake + 0.25, tHenWake + 0.6));
    const awake = t >= tHenWake;
    const guard = (when: number) => ({ x: tractorAt(when).x + GUARD_SPOT.dx, y: GUARD_SPOT.y + tractorAt(when).shake });
    if (t >= tOnGuard) return { pt: guard(t), up, peck, awake };
    if (t >= tHenHop) return { pt: hop({ x: henOnGround(tHenHop), y: FLOOR }, guard(tOnGuard), 70, seg(t, tHenHop, tOnGuard)), up, peck: 0, awake };
    const startle = 22 * hump(seg(t, tHenWake, tHenWake + 0.3));
    return { pt: { x: henOnGround(t), y: FLOOR - startle }, up, peck, awake };
  };
  /** Where chick `j` is: they follow the hen's way along the grains, hopping, and stay on the grass when she flies up. */
  const chickAt = (j: number, t: number): Pt => {
    const lag = 0.35 * (j + 1);
    // They walk on to where she flew up, so none stops mid-step and hops on the spot for the rest of the level.
    const walked = Math.min(t - lag, tHenHop);
    const x = henOnGround(walked) - 52 - 30 * j;
    const moving = Math.abs(henOnGround(walked + 0.05) - henOnGround(walked)) > 0.2;
    return { x, y: FLOOR - (moving ? 10 * Math.abs(Math.sin(t * 14 + j)) : 0) };
  };

  /* The second honk wakes the goose on the bank: it honks back, flaps, jumps into the pond with a splash, stretches its
     neck towards the ducks and honks at them. */
  const tGooseWake = tHorn2 + 0.35;
  const tGooseJump = tGooseWake + 0.9;
  const tGooseSplash = tGooseJump + 0.6;
  const tGooseHonk = tGooseSplash + 1.15;
  for (const ts of [tGooseWake, tGooseWake + 0.4, tGooseHonk, tGooseHonk + 0.35]) at(ts, { sound: honkGoose });
  at(tGooseJump, { sound: playWhoosh });
  at(tGooseSplash, { sound: splash });
  /** The goose: its middle, how far its wings are spread, its neck stretched out (0 to 1), its beak open, and whether it swims. */
  const gooseAt = (t: number) => {
    const startle = 30 * hump(seg(t, tGooseWake, tGooseWake + 0.35));
    const bank = { x: GOOSE.x, y: FLOOR - startle };
    const water = { x: GOOSE.water, y: POND.y };
    const pt = t < tGooseJump ? bank : hop(bank, water, 120, easeInOut(seg(t, tGooseJump, tGooseSplash)));
    const wings = hump(seg(t, tGooseWake + 0.2, tGooseSplash + 0.2));
    const neck = easeInOut(seg(t, tGooseSplash + 0.55, tGooseHonk)) * (1 - easeInOut(seg(t, tGooseHonk + 1, tGooseHonk + 1.6)));
    const honks = [tGooseWake, tGooseWake + 0.4, tGooseHonk, tGooseHonk + 0.35];
    const beak = Math.max(...honks.map((h) => hump(seg(t, h, h + 0.3))));
    return { pt, wings: Math.abs(wings * Math.sin((t - tGooseWake) * 22)), neck, beak, awake: t >= tGooseWake, swimming: t >= tGooseSplash };
  };

  /* The ducks quack and fly off the pond, one after the other, onto the donkey's back; the dog runs on to the barn. */
  const tQuack = tGooseHonk + 0.3;
  at(tQuack, { sound: quack });
  const tTakeOff = (i: number) => tGooseHonk + 0.6 + DUCK_GAP * i;
  const tLand = (i: number) => tTakeOff(i) + FLIGHT;
  const tOnward = tGooseSplash;
  const tAtBarn = tOnward + (DOG_END - dogStop) / RUN_SPEED;
  const swim = (i: number): Pt => ({ x: POND.x - 100 + 130 * i, y: POND.y });
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
    Array.from({ length: DUCKS }, (_, i) => t - tLand(i)).reduce((sum, age) => sum + (age < 0 || age > 1.2 ? 0 : 14 * decay(5 * age) * Math.cos(age * 16)), 0);
  // Three ducks are too many: he stamps a front hoof twice, then brays.
  const tStamp = [tLand(DUCKS - 1) + 0.55, tLand(DUCKS - 1) + 0.95];
  for (const ts of tStamp) at(ts, { sound: () => playKnock(330) });
  const tBray = tLand(DUCKS - 1) + 1.5;
  const tHaw = [tBray + 0.55, tBray + 1.8];
  at(tBray, { sound: heehaw });
  const tKick = tBray + 3;
  at(tKick, {
    sound: bang,
    say: {
      de: "Der Esel tritt, und die Scheune geht auf.",
      en: "The donkey kicks, and the barn opens.",
      zh: "小毛驴一踢，谷仓门开啦。",
      hi: "गधा लात मारता है, और खलिहान खुल जाता है।",
      es: "El burro patea, y el granero se abre.",
      ar: "الحمار يرفس، فيُفتح باب الحظيرة.",
      ru: "Ослик брыкается — и сарай открывается.",
    },
  });
  /** The donkey now: how far he leans (degrees, his rump up), how far his hind legs swing back, his head up (0 to 1), his mouth and a stamping hoof. */
  const donkeyAt = (t: number) => {
    // He crouches a little, then snaps his rump up and his hind legs back, and slowly stands again.
    const crouch = hump(seg(t, tKick - 0.55, tKick - 0.1));
    const snap = easeOut(seg(t, tKick - 0.12, tKick)) * (1 - easeInOut(seg(t, tKick + 0.2, tKick + 0.8)));
    const tilt = 5 * crouch + KICK_TILT * snap;
    const swing = KICK_SWING * snap;
    const head = easeInOut(seg(t, tBray - 0.3, tBray)) * (1 - easeInOut(seg(t, tBray + 2.6, tBray + 2.9)));
    const brays = [tBray, tHaw[0], tBray + 1.25, tHaw[1]];
    const mouth = Math.max(...brays.map((b, i) => (i % 2 ? 1 : 0.6) * hump(seg(t, b, b + (i % 2 ? 0.8 : 0.5)))));
    // How high his front hoof is lifted for a stamp.
    const stamp = Math.max(...tStamp.map((ts) => hump(seg(t, ts - 0.22, ts))));
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

  /* The kick shakes the barn: the swallow darts out of her nest under the eaves, swoops round over the donkey and lands
     on the end of the wooden turn button that keeps the doors shut. It turns under her – klack – and she flutters up
     onto the roof. */
  const tSwallowOut = tKick + 0.35;
  const tSwallowLand = tSwallowOut + 2.2;
  const tTurned = tSwallowLand + 0.55;
  const tPerch = tTurned + 0.9;
  at(tSwallowOut, { sound: tweet });
  at(tTurned, { sound: () => playKnock(720) });
  at(tPerch, { sound: tweet });
  /** Where the swallow lands: on the turn button's right end. */
  const latchEnd = { x: LATCH.x + LATCH.half - 12, y: LATCH.y - 8 };
  const swoop = pathOf(
    quad(NEST, { x: NEST.x - 120, y: NEST.y + 150 }, { x: NEST.x - 260, y: NEST.y + 20 }),
    quad({ x: NEST.x - 260, y: NEST.y + 20 }, { x: NEST.x - 300, y: NEST.y - 200 }, { x: NEST.x + 40, y: NEST.y - 150 }),
    quad({ x: NEST.x + 40, y: NEST.y - 150 }, { x: latchEnd.x - 40, y: latchEnd.y - 160 }, latchEnd),
  );
  /** How far the turn button has turned (degrees, clockwise: its right end goes down under the swallow). */
  const latchTurn = (t: number) => 90 * easeIn(seg(t, tSwallowLand + 0.1, tTurned));
  /** The swallow: where she is, which way she flies (radians), whether her wings beat, and whether she is out of the nest. */
  const swallowAt = (t: number): { pt: Pt; angle: number; flying: boolean; out: boolean } => {
    if (t < tSwallowOut) return { pt: NEST, angle: Math.PI, flying: false, out: false };
    if (t < tSwallowLand) {
      const p = along(swoop, swoop.total * easeInOut(seg(t, tSwallowOut, tSwallowLand)));
      return { pt: p.pt, angle: p.angle, flying: true, out: true };
    }
    // She rides the button's end down a little, then flutters up onto the roof.
    const riding = turn(latchEnd, LATCH, rad(Math.min(latchTurn(t), 25)));
    if (t < tTurned) return { pt: riding, angle: 0, flying: false, out: true };
    if (t < tPerch) return { pt: hop(turn(latchEnd, LATCH, rad(25)), PERCH, 120, easeInOut(seg(t, tTurned, tPerch))), angle: 0, flying: true, out: true };
    return { pt: PERCH, angle: 0, flying: false, out: true };
  };

  /* The barn doors swing open; one by one the animals sing, then all of them together. */
  const tDoors = tTurned + 0.1;
  at(tDoors, { sound: playCreak });
  const doorsOpen = (t: number) => easeInOut(seg(t, tDoors, tDoors + 1));
  /** When each one sings alone: the three in the stable, the dog, the ducks, the swallow, the donkey. */
  const tSolo = [neigh, baa, cluck, bark, quack, tweet, heehaw].map((sound, i) => {
    const ts = tDoors + 1.3 + 0.9 * i;
    at(ts, { sound });
    return ts;
  });
  const DONKEY_SOLO = tSolo.length - 1;
  const tChoir = tSolo[DONKEY_SOLO] + 2.2;
  at(tChoir, {
    sound: playTusch,
    say: {
      de: "Alle Tiere singen zusammen!",
      en: "All the animals sing together!",
      zh: "所有动物一起唱歌！",
      hi: "सारे जानवर मिलकर गाते हैं!",
      es: "¡Todos los animales cantan juntos!",
      ar: "كل الحيوانات تغنّي معًا!",
      ru: "Все звери поют вместе!",
    },
  });
  [neigh, baa, cluck, bark, quack, moo, bleat, heehaw, tweet].forEach((sound, i) => at(tChoir + 0.15 + 0.05 * i, { sound }));
  at(tChoir + 1, { sound: playTwinkle });
  const tDone = tChoir + 3.4;
  at(tDone, { done: true });
  /** How much a singer opens its mouth now: when it sings alone (`solo`, an index of `tSolo`) and in the choir. */
  const singing = (solo: number, t: number) => {
    const alone = hump(seg(t, tSolo[solo], tSolo[solo] + (solo === DONKEY_SOLO ? 2 : 0.7)));
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
    if (t < tTurkeyBark) return Math.max(KENNEL.x0, dogAt(t).x);
    // The dog and the turkey with its sack, then the hen's way along the grains to the tractor.
    if (t < tSackDown) return TURKEY.x;
    if (t < tHenWake) return HEN_VIEW;
    if (t < tDrive) return Math.max(HEN_VIEW, henAt(t).pt.x + 100);
    // The tractor driving to the pond, then the goose and the ducks.
    if (t < tDriveEnd) return tractorAt(t).x + GUARD_SPOT.dx + 100;
    const pond = POND.x - 260;
    if (t < tTakeOff(0)) return lerp(tractorAt(tDriveEnd).x + GUARD_SPOT.dx + 100, pond, easeInOut(seg(t, tDriveEnd, tGooseSplash)));
    if (t < tLand(0)) return Math.max(pond, duckAt(0, t).pt.x);
    return BARN_MID;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  /** Where it could wait for the child's tap (R-03): the cow with the wool at her nose, the goat ready to charge, the hen on the tractor's mudguard by the horn, the donkey with all three ducks on his back. Only the goat ready to charge waits; the machine runs through the others. */
  const stops = [
    { at: tNose, x: COW.x - 180, y: FLOOR - 100 },
    { at: tCharge1, x: ground.x, y: FLOOR - 80, active: true },
    { at: tOnGuard, x: TRACTOR.x + GUARD_SPOT.dx + 30, y: TRACTOR.guard - 50 },
    { at: tLand(DUCKS - 1), x: DONKEY.x, y: FLOOR + DONKEY.back.y },
  ];

  return {
    events: sorted(),
    duration: tDone,
    stops,
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
    tTurkeyBark,
    tGobble,
    tTip,
    tSackDown,
    tGrain,
    tHenWake,
    tPeck,
    tHenHop,
    tOnGuard,
    tHorn,
    tEngine,
    tDrive,
    tDriveEnd,
    tHorn2,
    tGooseWake,
    tGooseSplash,
    tGooseHonk,
    tBray,
    tKick,
    tSwallowOut,
    tSwallowLand,
    tTurned,
    tPerch,
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
    turkeyAt,
    sackTilt,
    grainAt,
    henAt,
    chickAt,
    tractorAt,
    farmerAwake,
    puffs,
    gooseAt,
    swallowAt,
    latchTurn,
    duckAt,
    donkeyAt,
    tTakeOff,
    tLand,
    tFlyUp,
    tOnRoof,
    doorsOpen,
    singing,
    cameraTarget,
    width: WORLD_W,
  };
}
