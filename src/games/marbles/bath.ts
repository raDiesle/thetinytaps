// The bathroom machine ("Badezimmer", R-05): one tap presses the button on
// the toothpaste tube, a blob drops onto the toothbrush, its weight tips the
// brush off the glass shelf, it turns a somersault and lands in the tooth
// mug, the mug topples and its brush knocks the squeaky duck off the counter,
// the duck bonks the bath tap's lever and the water rushes, the tub fills up
// with foam and overflows. The wave carries the duck over the rim against the
// toilet roll, which jumps off its holder and rolls away over the floor,
// unrolling a long paper ribbon and getting thinner, until it bumps the key of
// the wind-up whale and winds it up. The whale wakes, waddles off on its
// little feet and spouts a fountain from its blowhole right onto the switch of
// the hair dryer above it; the dryer blows the shower cap off the shelf onto
// the ceiling lamp and blows a stream of soap bubbles out of the bubble wand,
// each popping at the lamp with a note. Everything is worked out ahead as a
// function of the seconds since the tap, so BathLevel.tsx only asks where each
// thing is at a moment. Coordinates are those of the bathroom, 5700 × 900; the
// screen shows 1600 of it at a time.

import {
  playBlow,
  playBlub,
  playBoing,
  playClick,
  playClonk,
  playCreak,
  playDing,
  playHum,
  playKnock,
  playPlink,
  playPlop,
  playPop,
  playPuff,
  playRattle,
  playRip,
  playRustle,
  playSlide,
  playSplash,
  playSqueak,
  playTwinkle,
  playWhale,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { wobble } from "./level";
import { cameraOn, clamp01, easeIn, easeInOut, easeOut, hop, lerp, rad, seg, timeline, turn } from "./machineKit";
import type { Pt } from "./path";

export const WORLD_W = 5700;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The washstand along the left wall; the basin is sunk into its top. */
export const COUNTER = { x0: 60, x1: 1180, top: 600 };
export const BASIN = { x0: 200, x1: 500 };
/** The glass shelf the toothbrush lies on; the brush's head sticks out past its right end. */
export const SHELF = { x0: 540, x1: 800, y: 430 };
/** The toothbrush: its middle, half its length, and how thick it is. The head (bristles up) is at the right end. */
export const BRUSH = { x: 720, half: 130, thick: 14 };
/** The toothpaste tube hangs upside down in its holder above the brush's head; `nozzle` is where the paste comes out. */
export const TUBE = { x: 815, top: 160, nozzle: 340, w: 76 };
/** The big red button on top of the tube: the one thing to tap. */
export const BUTTON = { x: TUBE.x, y: TUBE.top - 26, r: 34 };

/** The tooth mug on the counter, its bottom middle. */
export const MUG = { x: 930, bottom: COUNTER.top, h: 120, w: 96 };
/** The squeaky duck sits at the counter's right end. */
export const DUCK = { x: 1120, y: COUNTER.top - 38 };
/** About how far the duck reaches from its middle. */
export const DUCK_R = 44;

/** The bathtub on its feet; `rim` is the top of its edge, `bottom` the inside of its floor. */
export const TUB = { x0: 1240, x1: 2160, rim: 560, bottom: 750 };
/** The tap on the wall over the tub's left end, with its lever on top. */
export const TAP = { x: 1330, y: 440 };
/** The lever's turning point, and its knob before and after the duck bonks it. */
export const LEVER = { pivot: { x: TAP.x, y: TAP.y - 26 }, len: 76, up: -125, down: -60 };

/** The toilet roll holder on the wall right of the tub: the middle of the roll on it. */
export const HOLDER = { x: 2290, y: 590 };
/** The toilet roll: full, and its cardboard core (what is left once all paper is off). */
export const ROLL = { r: 44, core: 16 };
/** The holder's tear bar under the roll: the paper runs over it, and its end stays caught there when the roll falls. */
export const TEAR = { x: HOLDER.x + 40, y: HOLDER.y + 54 };

/** The wind-up whale stands on the floor on two little feet; `x` is its middle before and after its walk. */
export const WHALE = { x: 3600, stop: 4130, half: 115, h: 116, feet: 24 };
/** The whale's wind-up key sticks out of its left side, low down: the tip's offset from the whale's middle and its height. */
export const KEY = { dx: -110, y: FLOOR - 36 };
/** The whale's blowhole, on top of its head: offset from its middle. */
export const BLOWHOLE = { dx: 46, dy: -WHALE.feet - WHALE.h / 2 - Math.sqrt(1 - (46 / WHALE.half) ** 2) * (WHALE.h / 2) };

/** The hair dryer rests in a ring on the wall, nozzle to the right; this is its barrel's middle, where it turns. */
export const DRYER = { x: 4210, y: 400 };
/** The bottom of the dryer's handle, where its switch is: the whale's fountain hits it there. */
export const HANDLE = { x: DRYER.x - 34, y: DRYER.y + 112 };
/** Where the air comes out. */
export const NOZZLE = { x: DRYER.x + 100, y: DRYER.y };
/** The little glass shelf in front of the dryer, with the shower cap and the jar of bubble soap on it. */
export const BATH_SHELF = { x0: 4350, x1: 4640, y: 470 };
/** The shower cap's bottom middle as it sits on the shelf. */
export const CAP = { x: 4410, y: BATH_SHELF.y };
/** The ring of the bubble wand, standing in its jar in the dryer's air. */
export const WAND = { x: 4545, y: 404, r: 24 };

/** The ceiling lamp, a round glass globe on a cord; the bubbles go to the bottom of it. */
export const LAMP = { x: 5150, y: 170, r: 58 };
export const BUBBLES = 9;

/* ---------- The machine ---------- */

export type Bath = ReturnType<typeof buildBath>;

/** The lever's knob at angle `a` (degrees, 0 pointing right). */
export const leverKnob = (a: number): Pt => ({ x: LEVER.pivot.x + LEVER.len * Math.cos(rad(a)), y: LEVER.pivot.y + LEVER.len * Math.sin(rad(a)) });

export function buildBath() {
  const { at, sorted } = timeline();

  /* The button goes down and squeezes the tube; a curly blob of paste grows out of the nozzle and drops onto the brush. */
  const tSqueeze = 0.15;
  const tBlobDrop = 1.0;
  const brushTop = SHELF.y - BRUSH.thick - 10;
  const tBlobLand = tBlobDrop + Math.sqrt((2 * (brushTop - TUBE.nozzle - 20)) / 1500);
  at(0, { sound: playClonk });
  at(tSqueeze, { sound: playPuff });
  at(tBlobLand, { sound: playPlop });
  /** How far the button is pressed in, and how squashed the tube is (0 to 1). */
  const press = (t: number) => easeOut(seg(t, 0, 0.18)) * (1 - seg(t, 1.2, 1.6));
  const squash = (t: number) => easeInOut(seg(t, tSqueeze, tBlobDrop));
  /** How big the blob is (0 to 1), where it is while it falls, or null before it shows. */
  const blobSize = (t: number) => easeOut(seg(t, tSqueeze + 0.1, tBlobDrop));

  /* The blob's weight tips the brush over the shelf's end; it slips off, turns a somersault and lands in the mug, handle first. */
  const tTip = tBlobLand + 0.15;
  const tSlip = tTip + 0.4;
  const tInMug = tSlip + 0.65;
  at(tTip, { sound: playCreak });
  at(tSlip, { sound: playSlide });
  at(tInMug, { sound: playClonk });
  at(tInMug + 0.08, { sound: playDing });
  const pivot = { x: SHELF.x1, y: SHELF.y };
  const restMid = { x: BRUSH.x, y: SHELF.y - BRUSH.thick / 2 };
  const TIP = 40;
  /** Where the brush stands in the mug, before the mug falls over: upright, head up. */
  const inMug = { x: MUG.x, y: MUG.bottom - 10 - BRUSH.half };
  const tipped = turn(restMid, pivot, rad(TIP));

  /* The mug wobbles, then topples to the right with the brush in it; the brush's head knocks the duck off the counter. */
  const tTopple = tInMug + 0.6;
  const tDown = tTopple + 0.5;
  at(tTopple, { sound: () => playKnock(900) });
  at(tDown, { sound: () => playKnock(600) });
  /** The mug's corner it falls over on. */
  const corner = { x: MUG.x + MUG.w / 2, y: MUG.bottom };
  /** How far the mug has fallen over, in degrees (90 is lying on its side). */
  const mugTurn = (t: number) => 90 * easeIn(seg(t, tTopple, tDown));
  // The moment the falling mug or the brush in it first touches the duck: points along the brush and the mug's rim.
  const sweep: Pt[] = [
    ...Array.from({ length: 11 }, (_, i) => ({ x: inMug.x, y: inMug.y + BRUSH.half - (2 * BRUSH.half * i) / 10 })),
    { x: MUG.x - MUG.w / 2, y: MUG.bottom - MUG.h },
    { x: MUG.x + MUG.w / 2, y: MUG.bottom - MUG.h },
  ];
  let hitTurn = 90;
  for (let d = 0; d <= 90; d += 0.5) {
    if (sweep.some((p) => Math.hypot(turn(p, corner, rad(d)).x - DUCK.x, turn(p, corner, rad(d)).y - DUCK.y) < DUCK_R)) {
      hitTurn = d;
      break;
    }
  }
  const tHit = tTopple + 0.5 * Math.sqrt(hitTurn / 90);
  at(tHit, { sound: playSqueak });

  /* The duck flies up onto the tap's lever, pushes it down, and tumbles into the tub. */
  const onLever = leverKnob(LEVER.up);
  const duckOnLever = { x: onLever.x, y: onLever.y - 34 };
  const tLever = tHit + 0.7;
  const tInTub = tLever + 0.7;
  const duckLand = { x: TUB.x0 + 260, y: TUB.bottom - 34 };
  at(tLever, { sound: playSqueak });
  at(tLever + 0.05, { sound: playClonk });
  /** The lever's angle: up, until the duck pushes it down. */
  const leverAngle = (t: number) => lerp(LEVER.up, LEVER.down, easeOut(seg(t, tLever, tLever + 0.25)));

  /* The water rushes and the tub fills; the foam grows with it, the duck floats up and drifts to the tub's right end. */
  const tWater = tLever + 0.2;
  const tFull = tWater + 6.2;
  at(tWater, { sound: playSplash });
  at(tInTub, { sound: playSplash });
  for (let s = tWater + 1.2; s < tFull; s += 1.6) at(s, { sound: playBlub });
  /** The water's surface in the tub: from the floor of the tub up to its rim. */
  const waterY = (t: number) => lerp(TUB.bottom + 4, TUB.rim + 6, easeInOut(seg(t, tWater + 0.3, tFull)));
  /** How much water pours from the tap (0 to 1): it stops once the tub is overflowing. */
  const pour = (t: number) => easeOut(seg(t, tWater, tWater + 0.3)) * (1 - seg(t, tFull + 2, tFull + 2.6));
  /** How high the foam heap is on the water. */
  const foam = (t: number) => 90 * easeOut(seg(t, tWater + 1, tFull + 1.2));

  /* Full: the foam spills over the rim, a puddle spreads on the floor. */
  at(tFull, { sound: playSplash });
  at(tFull + 0.3, {
    say: {
      de: "Oh! Die Wanne läuft über!",
      en: "Oh! The tub is overflowing!",
      zh: "哎呀！浴缸的水满出来啦！",
      hi: "अरे! टब से पानी बह रहा है!",
      es: "¡Oh! ¡La bañera se desborda!",
      ar: "أوه! الحوض يفيض!",
      ru: "Ой! Ванна переливается!",
    },
  });
  /** How far the overflow has got: 0 to 1. */
  const spill = (t: number) => easeOut(seg(t, tFull, tFull + 1.6));

  /* The overflowing wave carries the duck over the rim; it bonks the toilet roll off its holder and lands in the puddle. */
  const tSurf = tFull + 0.35;
  const tBonk = tSurf + 0.8;
  const tDuckDown = tBonk + 0.5;
  const afloatEnd = { x: TUB.x1 - 150, y: waterY(tFull) - 30 };
  /** Where the duck touches the roll on its holder. */
  const bonkAt = { x: HOLDER.x - 84, y: HOLDER.y - 8 };
  const duckFloor = { x: TUB.x1 + 45, y: FLOOR - 40 };
  at(tSurf, { sound: playWhoosh });
  at(tBonk, { sound: playSqueak });
  at(tBonk + 0.03, { sound: () => playKnock(500) });
  at(tDuckDown, { sound: playSplash });

  const duckAt = (t: number): { pt: Pt; spin: number } => {
    const start = { x: DUCK.x, y: DUCK.y };
    if (t < tHit) return { pt: start, spin: 0 };
    if (t < tLever) return { pt: hop(start, duckOnLever, 170, seg(t, tHit, tLever)), spin: -360 * easeOut(seg(t, tHit, tLever)) };
    if (t < tInTub) {
      const k = seg(t, tLever, tInTub);
      return { pt: hop(duckOnLever, duckLand, 70, easeIn(k)), spin: 200 * k };
    }
    if (t < tSurf) {
      // Afloat: as high as the water, drifting to the tub's right end, bobbing on the waves.
      const x = lerp(duckLand.x, afloatEnd.x, easeInOut(seg(t, tInTub, tFull)));
      const water = waterY(t) - 30;
      const bob = 5 * Math.sin(t * 3) * seg(t, tInTub + 0.4, tInTub + 1);
      return { pt: { x, y: Math.min(duckLand.y, water) + (water < duckLand.y ? bob : 0) }, spin: 200 * (1 - easeOut(seg(t, tInTub, tInTub + 0.4))) };
    }
    const from = { x: afloatEnd.x, y: waterY(tSurf) - 30 + 5 * Math.sin(tSurf * 3) };
    if (t < tBonk) return { pt: hop(from, bonkAt, 110, seg(t, tSurf, tBonk)), spin: 30 * Math.sin(seg(t, tSurf, tBonk) * Math.PI) };
    // Bonked back off the roll: a tumble down into the puddle, landing upright.
    const k = seg(t, tBonk, tDuckDown);
    return { pt: hop(bonkAt, duckFloor, 20, easeIn(k)), spin: -360 * easeOut(k) };
  };

  /* The roll jumps off its holder, lands, hops once and rolls off over the floor. Its paper stays caught on the tear bar,
     so it unrolls as it goes: a long ribbon behind it, the roll thinner and thinner, until it bumps the whale's key. */
  /** The paper hanging from the tear bar down to the floor. */
  const HANG = FLOOR - TEAR.y;
  const END_R = 22;
  const keyAt = (whaleX: number): Pt => ({ x: whaleX + KEY.dx, y: KEY.y });
  const key0 = keyAt(WHALE.x);
  /** How much paper unrolls per pixel, chosen so the roll is END_R thin when it gets to the key. */
  const UNROLL = (ROLL.r ** 2 - END_R ** 2) / (HANG + key0.x - END_R - TEAR.x);
  /** The roll's radius once `paper` pixels have come off it. */
  const radiusOf = (paper: number) => Math.sqrt(Math.max(ROLL.core ** 2, ROLL.r ** 2 - UNROLL * paper));
  /** How far a rolling roll has turned (radians) once `paper` has come off: it turns faster as it gets thinner. */
  const spinOf = (paper: number) => (2 / UNROLL) * (ROLL.r - radiusOf(paper));
  const paperOn = (x: number) => HANG + Math.max(0, x - TEAR.x);
  const landX = HOLDER.x + 90;
  const bounceX = landX + 70;
  const land = { x: landX, y: FLOOR - radiusOf(paperOn(landX)) };
  const bounce = { x: bounceX, y: FLOOR - radiusOf(paperOn(bounceX)) };
  const tRollLand = tBonk + 0.5;
  const tRollBounce = tRollLand + 0.32;
  // The spot where the rolling roll first touches the key's tip.
  let rollEndX = bounceX;
  while (Math.hypot(key0.x - rollEndX, key0.y - (FLOOR - radiusOf(paperOn(rollEndX)))) > radiusOf(paperOn(rollEndX)) + 4) rollEndX += 0.5;
  // Rolling from 400 px/s down to 170 px/s: still going when it bumps the key.
  const V0 = 400;
  const V1 = 170;
  const tKey = tRollBounce + (2 * (rollEndX - bounceX)) / (V0 + V1);
  const rollX = (t: number) => {
    const T = tKey - tRollBounce;
    const s = clamp01((t - tRollBounce) / T) * T;
    return bounceX + V0 * s + ((V1 - V0) * s * s) / (2 * T);
  };
  at(tBonk + 0.08, { sound: playRip });
  at(tRollLand, { sound: playPlop });
  at(tRollBounce, { sound: playPlop });
  for (let s = tRollBounce + 0.4; s < tKey - 0.3; s += 0.9) at(s, { sound: playRustle });

  /* The roll bumps the key and, still spinning, turns it round and round: the whale is wound up. Then it lies still. */
  const WIND = 1.6;
  const tWound = tKey + WIND;
  at(tKey, { sound: () => playKnock(1200) });
  at(tKey + 0.1, { sound: playRattle });
  at(tWound, { sound: playClick });
  const endR = radiusOf(paperOn(rollEndX));
  /** The roll: its middle, radius and turn (degrees); null while it still sits on its holder. */
  const rollAt = (t: number): { pt: Pt; r: number; spin: number } => {
    if (t < tBonk) return { pt: { x: HOLDER.x, y: HOLDER.y }, r: ROLL.r, spin: 0 };
    if (t < tRollLand) {
      const k = seg(t, tBonk, tRollLand);
      const paper = paperOn(landX) * k;
      return { pt: hop({ x: HOLDER.x, y: HOLDER.y }, land, 40, easeIn(k)), r: radiusOf(paper), spin: (180 / Math.PI) * spinOf(paper) };
    }
    if (t < tRollBounce) {
      const k = seg(t, tRollLand, tRollBounce);
      const x = lerp(landX, bounceX, k);
      const paper = paperOn(x);
      return { pt: hop(land, bounce, 24, k), r: radiusOf(paper), spin: (180 / Math.PI) * spinOf(paper) };
    }
    if (t < tKey) {
      const x = rollX(t);
      const paper = paperOn(x);
      return { pt: { x, y: FLOOR - radiusOf(paper) }, r: radiusOf(paper), spin: (180 / Math.PI) * spinOf(paper) };
    }
    // Pressed against the key it spins on for a while (the paper slips), then rolls back a little and lies still.
    const spun = (180 / Math.PI) * spinOf(paperOn(rollEndX)) + 540 * easeOut(seg(t, tKey, tWound));
    const back = 26 * easeOut(seg(t, tWound, tWound + 0.5));
    return { pt: { x: rollEndX - back, y: FLOOR - endR }, r: endR, spin: spun - (180 / Math.PI) * (back / endR) };
  };
  /** The paper ribbon from the tear bar to the roll, or null while the roll is on its holder (then its end just hangs down). */
  const ribbon = (t: number): Pt[] | null => {
    if (t < tBonk) return null;
    const { pt, r } = rollAt(t);
    const bottom = { x: pt.x, y: pt.y + r - 3 };
    if (bottom.y < FLOOR - 8) return [TEAR, bottom];
    return [TEAR, { x: TEAR.x + 14, y: FLOOR - 3 }, { x: pt.x, y: FLOOR - 3 }];
  };

  /* The whale wakes up, its motor whirrs, and it waddles off to the right step by step, its key turning back. */
  const tWake = tWound + 0.3;
  const tWalk = tWake + 0.6;
  const STEP_T = 0.44;
  const STEPS = 12;
  const tStop = tWalk + STEPS * STEP_T;
  at(tWake, { sound: playHum });
  at(tWalk, { sound: playWhirr });
  for (let i = 0; i < STEPS; i++) at(tWalk + (i + 0.5) * STEP_T, { sound: () => playKnock(i % 2 ? 1300 : 1600) });

  /* At the stop it swells up, gives a little spurt, then a big fountain right up onto the dryer's switch. */
  const tSpurt = tStop + 0.7;
  const tFountain = tStop + 1.4;
  const blowholeY = FLOOR + BLOWHOLE.dy;
  const tHitDryer = tFountain + 0.3;
  at(tStop + 0.1, { sound: playWhale });
  at(tSpurt, { sound: playPuff });
  at(tFountain, { sound: playSplash });
  at(tFountain + 0.1, {
    say: {
      de: "Der Wal spritzt!",
      en: "The whale squirts!",
      zh: "鲸鱼喷水啦！",
      hi: "व्हेल पानी उछालती है!",
      es: "¡La ballena echa agua!",
      ar: "الحوت يرشّ الماء!",
      ru: "Кит брызгается!",
    },
  });

  /** The whale: its middle on the floor, its tilt and bounce while it walks, how awake it is, its swell and its key's turn. */
  const whaleAt = (t: number) => {
    const walk = seg(t, tWalk, tStop);
    const x = lerp(WHALE.x, WHALE.stop, walk);
    const stepping = t > tWalk && t < tStop;
    const phase = (t - tWalk) / STEP_T;
    const tilt = stepping ? 7 * Math.sin(phase * Math.PI) : wobble(t - tStop, 5, 12, 4);
    const lift = stepping ? 8 * Math.abs(Math.sin(phase * Math.PI)) : 0;
    /** Which foot is up (-1 back, 1 front) and how far (0 to 1). */
    const foot = stepping ? Math.sin(phase * Math.PI) : 0;
    const swell = 0.1 * Math.sin(Math.PI * seg(t, tStop + 0.3, tFountain + 0.15));
    const keyTurn = 1080 * easeOut(seg(t, tKey, tWound)) - 1080 * walk;
    return { x, tilt, lift, foot, awake: t >= tWake, swell, keyTurn };
  };
  /** The tip of the whale's key at a moment. */
  const keyTip = (t: number) => keyAt(whaleAt(t).x);
  /** How high the whale's water goes: the top of the jet (null when there is none) and how strong it is (0 to 1). */
  const fountainAt = (t: number): { top: number; k: number } | null => {
    if (t >= tSpurt && t < tSpurt + 0.5) {
      const k = Math.sin(Math.PI * seg(t, tSpurt, tSpurt + 0.5));
      return { top: blowholeY - 50 * k, k: 0.5 * k };
    }
    if (t < tFountain || t > tFountain + 2.2) return null;
    const up = easeOut(seg(t, tFountain, tHitDryer));
    const down = easeIn(seg(t, tFountain + 1.5, tFountain + 2.2));
    return { top: lerp(blowholeY, HANDLE.y, up * (1 - down)), k: 1 - down };
  };

  /* The jet pushes the switch: click, the dryer jolts in its ring and blows. Its air lifts the shower cap off the shelf and
     carries it, fluttering, onto the lamp like a hat, and blows soap bubbles out of the wand. */
  const tDryer = tHitDryer + 0.05;
  const tCapLift = tDryer + 0.35;
  const tCapOff = tCapLift + 0.45;
  const tCapLand = tCapOff + 2.2;
  at(tHitDryer, { sound: playClick });
  at(tCapLift, { sound: playWhoosh });
  at(tCapLand, { sound: playBoing });
  /** The dryer's turn in its ring after the jolt (degrees). */
  const dryerAngle = (t: number) => wobble(t - tHitDryer, 12, 16, 3);
  const capOn = { x: LAMP.x, y: LAMP.y - LAMP.r + 22 };
  const capMid = { x: 4820, y: 90 };
  /** The shower cap: its bottom middle and turn while it flies, or null once it sits on the lamp. */
  const capAt = (t: number): { pt: Pt; angle: number } | null => {
    if (t >= tCapLand) return null;
    if (t < tCapOff) {
      // Flapping on the shelf in the wind before it lets go.
      const k = seg(t, tCapLift, tCapOff);
      return { pt: { x: CAP.x, y: CAP.y - 8 * k }, angle: 14 * k * Math.sin(t * 40) };
    }
    const k = seg(t, tCapOff, tCapLand);
    const s = easeInOut(k);
    const start = { x: CAP.x, y: CAP.y - 8 };
    return {
      pt: {
        x: (1 - s) ** 2 * start.x + 2 * s * (1 - s) * capMid.x + s * s * capOn.x,
        y: (1 - s) ** 2 * start.y + 2 * s * (1 - s) * capMid.y + s * s * capOn.y + 18 * Math.sin(k * 11) * (1 - k),
      },
      angle: 360 * s + 25 * Math.sin(k * 14) * (1 - k),
    };
  };

  /* Soap bubbles come out of the wand one after the other and float up to the lamp, where each one pops with a note. */
  const BUBBLE_SPEED = 190;
  const tBubble = (i: number) => tDryer + 0.9 + 0.65 * i;
  const bubbleStart = (i: number): Pt => ({ x: WAND.x + 20, y: WAND.y + ((i % 3) - 1) * 6 });
  const target = { x: LAMP.x, y: LAMP.y + LAMP.r + 6 };
  /** The way of bubble `i`: a gentle wave from the wand to the lamp. */
  const bubbleWay = (i: number, k: number): Pt => {
    const s = bubbleStart(i);
    const mid = { x: lerp(s.x, target.x, 0.5), y: 130 + (i % 3) * 70 };
    const p = { x: (1 - k) ** 2 * s.x + 2 * k * (1 - k) * mid.x + k * k * target.x, y: (1 - k) ** 2 * s.y + 2 * k * (1 - k) * mid.y + k * k * target.y };
    return { x: p.x, y: p.y + 14 * Math.sin(k * 9 + i) * (1 - k) };
  };
  const bubbleLength = (i: number) => {
    let len = 0;
    for (let k = 0; k < 1; k += 0.05) {
      const a = bubbleWay(i, k);
      const b = bubbleWay(i, k + 0.05);
      len += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return len;
  };
  const tPop = Array.from({ length: BUBBLES }, (_, i) => tBubble(i) + bubbleLength(i) / BUBBLE_SPEED);
  tPop.forEach((tp, i) => {
    at(tp, { sound: () => playPlink(i % 8) });
  });
  at(tBubble(0), { sound: playBlub });
  /** Where bubble `i` is and how big (0 before it comes out, gone once popped). */
  const bubbleAt = (i: number, t: number): { pt: Pt; size: number } | null => {
    if (t < tBubble(i) || t >= tPop[i]) return null;
    const k = (t - tBubble(i)) / (tPop[i] - tBubble(i));
    return { pt: bubbleWay(i, k), size: (0.75 + 0.25 * ((i * 5) % 3)) * easeOut(seg(t, tBubble(i), tBubble(i) + 0.4)) };
  };
  /** How many bubbles have popped at the lamp, as a smooth count. */
  const popped = (t: number) => tPop.reduce((n, tp) => n + easeOut(seg(t, tp, tp + 0.3)), 0);

  /* The dryer hums while it blows and clicks off once the last bubble is out. */
  const tDryerOff = tBubble(BUBBLES - 1) + 0.6;
  for (let s = tDryer + 0.1; s < tDryerOff - 0.6; s += 1.2) at(s, { sound: playBlow });
  at(tDryerOff, { sound: playClick });
  /** How hard the dryer blows (0 to 1). */
  const blowing = (t: number) => seg(t, tDryer, tDryer + 0.3) * (1 - seg(t, tDryerOff, tDryerOff + 0.3));

  /* The last pop: the lamp lights up, swings with its new hat, and the whole bathroom sparkles. */
  const tLast = Math.max(...tPop);
  const tDone = tLast + 3.2;
  at(tLast + 0.15, { sound: playPop });
  at(tLast + 0.4, { sound: playTwinkle });
  at(tLast + 0.9, {
    say: {
      de: "Seifenblasen bis zur Lampe!",
      en: "Soap bubbles up to the lamp!",
      zh: "肥皂泡飞到灯那儿啦！",
      hi: "साबुन के बुलबुले लैंप तक!",
      es: "¡Burbujas hasta la lámpara!",
      ar: "فقاعات صابون حتى المصباح!",
      ru: "Мыльные пузыри до самой лампы!",
    },
  });
  at(tDone, { done: true });
  /** The lamp's swing in degrees: a little bump when the cap lands, then a big swing at the last pop, dying away. */
  const lampSwing = (t: number) => {
    const still = Math.min(t, tDone);
    const age = still - tLast;
    return wobble(still - tCapLand, 4, 6, 2) + (age < 0 ? 0 : 9 * Math.exp(-age * 0.9) * Math.sin(age * 4.5));
  };

  /** The brush: its middle and turn (degrees; 0 lying with its head to the right, 270 standing head up). */
  const brushAt = (t: number): { pt: Pt; angle: number } => {
    if (t < tTip) return { pt: restMid, angle: 0 };
    if (t < tSlip) {
      const a = TIP * easeIn(seg(t, tTip, tSlip));
      return { pt: turn(restMid, pivot, rad(a)), angle: a };
    }
    if (t < tInMug) {
      const k = seg(t, tSlip, tInMug);
      return { pt: hop(tipped, inMug, 60, k), angle: lerp(TIP, 270, easeOut(k)) };
    }
    // In the mug it wobbles and falls with it.
    const m = mugAngle(t);
    return { pt: turn(inMug, corner, rad(m)), angle: 270 + m };
  };

  /** The mug's wobble after the brush lands in it, then its fall (degrees). */
  const mugAngle = (t: number) => {
    if (t < tInMug) return 0;
    if (t < tTopple) return 4 * Math.exp(-(t - tInMug) * 5) * Math.sin((t - tInMug) * 30);
    return mugTurn(t);
  };

  /** Where the blob is: on the nozzle while it grows, falling, then on the brush's head (which moves with the brush). */
  const blobAt = (t: number): Pt | null => {
    if (t < tSqueeze + 0.1) return null;
    if (t < tBlobDrop) return { x: TUBE.x, y: TUBE.nozzle + 14 * blobSize(t) };
    if (t < tBlobLand) {
      const fall = t - tBlobDrop;
      return { x: TUBE.x, y: TUBE.nozzle + 14 + 0.5 * 1500 * fall * fall };
    }
    return null;
  };

  /** Where the camera looks: tube, brush and mug, the duck, the tub filling, the roll, the whale, then dryer and lamp. */
  const FINALE = 4760;
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tHit) return 760;
    if (t < tInTub) return Math.max(760, duckAt(t).pt.x);
    if (t < tSurf) return 1700;
    if (t < tBonk) return Math.max(1700, duckAt(t).pt.x);
    if (t < tKey) return Math.max(2100, rollAt(t).pt.x);
    if (t < tWalk) return rollEndX + 120;
    if (t < tStop) return whaleAt(t).x + 120;
    if (t < tDryer + 0.4) return WHALE.stop + 200;
    return FINALE;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    tBlobLand,
    tInMug,
    tTopple,
    tHit,
    tLever,
    tInTub,
    tWater,
    tFull,
    tSurf,
    tBonk,
    tDuckDown,
    tRollLand,
    tKey,
    tWound,
    tWake,
    tWalk,
    tStop,
    tFountain,
    tHitDryer,
    tDryer,
    tCapLand,
    tDryerOff,
    tPop,
    tLast,
    press,
    squash,
    blobSize,
    blobAt,
    brushAt,
    mugAngle,
    corner,
    leverAngle,
    duckAt,
    waterY,
    pour,
    foam,
    spill,
    rollAt,
    ribbon,
    whaleAt,
    keyTip,
    fountainAt,
    dryerAngle,
    blowing,
    capAt,
    bubbleAt,
    popped,
    lampSwing,
    capOn,
    cameraTarget,
  };
}
