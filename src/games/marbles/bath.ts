// The bathroom machine ("Badezimmer", R-05): one tap presses the button on
// the toothpaste tube, a blob drops onto the toothbrush, its weight tips the
// brush off the glass shelf, it turns a somersault and lands in the tooth
// mug, the mug topples and its brush knocks the squeaky duck off the counter,
// the duck bonks the bath tap's lever and the water rushes, the tub fills up
// with foam and overflows. The wave carries the duck over the rim onto the bar
// of soap in the puddle, and duck and soap slide off over the wet tiles into the
// plunger stuck to the floor. The plunger rocks, comes loose with a plop and
// topples onto the pull handle of the toilet's chain: the high cistern flushes,
// the water rushes down the pipe and bursts the toilet's lid open, and the lid
// knocks the toilet roll off its holder. It rolls away over the floor,
// unrolling a long paper ribbon and getting thinner, until it bumps the key of
// the wind-up whale and winds it up. The whale wakes, waddles off on its
// little feet and spouts a fountain in an arc onto the start button of the
// washing machine: it fills, tumbles its washing and spins so hard that it
// walks off on its feet, until it bumps the switch on the hair dryer's
// handle; the dryer blows the shower cap off the shelf onto the ceiling lamp
// and blows a stream of soap bubbles out of the bubble wand, each popping at
// the lamp with a note. Everything is worked out ahead as a function of the
// seconds since the tap, so BathLevel.tsx only asks where each thing is at a
// moment. Coordinates are those of the bathroom, about 7700 × 900; the screen
// shows 1600 of it at a time.

import {
  playBlub,
  playBoing,
  playClick,
  playClonk,
  playCreak,
  playDing,
  playGlug,
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
  playSqueak,
  playThump,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { playBlow, playFlush, playSplash, playWash, playWhale } from "@/lib/realSounds";
import { wobble } from "./level";
import { cameraOn, clamp01, easeIn, easeInOut, easeOut, hop, lerp, rad, seg, timeline, turn } from "./machineKit";
import type { Pt } from "./path";

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

/** The bar of soap lying on the floor right of the tub: its middle, length and height (its bottom on the floor). */
export const SOAP = { x: TUB.x1 + 100, w: 90, h: 30 };
/** How high the duck's middle is while it rides on the soap. */
export const DUCK_ON_SOAP = FLOOR - SOAP.h - 38;
/** The plunger stuck to the floor by its rubber cup: the cup's middle, its width and height, and the handle's length above it. */
export const PLUNGER = { x: 2860, cupW: 84, cupH: 46, stick: 290 };
/** How far the plunger has toppled (degrees) when its knob comes down on the pull handle, and how far the handle goes down. */
export const PLUNGER_HIT = 24;
export const PULL_DOWN = 12;
const PLUNGER_TOP = { x: PLUNGER.x, y: FLOOR - PLUNGER.cupH - PLUNGER.stick };
/** The plunger's knob when it leans `deg` degrees: to the right it tips over its cup's right corner, to the left over the left one. */
export const plungerTop = (deg: number): Pt => turn(PLUNGER_TOP, { x: PLUNGER.x + (deg >= 0 ? 1 : -1) * (PLUNGER.cupW / 2), y: FLOOR }, rad(deg));
/** The wooden pull handle at the end of the toilet's chain, a short bar hanging crosswise right where the toppling plunger's knob comes down on its left part: its middle, and half its length. */
export const PULL = { x: plungerTop(PLUNGER_HIT).x + 12, y: plungerTop(PLUNGER_HIT).y + 17, half: 30 };
/** How far the plunger leans once it has pulled the handle down. */
export const PLUNGER_PRESSED = (() => {
  let deg = PLUNGER_HIT;
  while (plungerTop(deg).y < plungerTop(PLUNGER_HIT).y + PULL_DOWN) deg += 0.05;
  return deg;
})();

/** The toilet faces left: its lid turns on the hinge at the back (right), the bowl's rim reaches `bowl` forward of it. */
export const TOILET = { hinge: { x: PULL.x + PULL.half + 237, y: 552 }, lid: 215, bowl: 228 };
/** The high cistern on the wall above it; its lever reaches out over the bowl to the chain with the pull handle. */
export const CISTERN = { x0: PULL.x + 70, x1: PULL.x + 300, top: 150, bottom: 240, lever: 186 };
/** The flush pipe from the cistern down behind the toilet. */
export const PIPE_X = TOILET.hinge.x - 26;
/** How far the lid flies open, and where it comes to rest leaning back. */
export const LID_OPEN = 110;
export const LID_REST = 100;

/** The toilet roll holder on the wall right of the toilet, where the flying lid hits the roll: the middle of the roll on it. */
export const HOLDER = { x: TOILET.hinge.x + 90, y: TOILET.hinge.y - 120 };
/** The toilet roll: full, and its cardboard core (what is left once all paper is off). */
export const ROLL = { r: 44, core: 16 };
/** The holder's tear bar under the roll: the paper runs over it, and its end stays caught there when the roll falls. */
export const TEAR = { x: HOLDER.x + 40, y: HOLDER.y + 54 };

/** The wind-up whale stands on the floor on two little feet; `x` is its middle before and after its walk. */
export const WHALE = { x: HOLDER.x + 1310, stop: HOLDER.x + 1840, half: 115, h: 116, feet: 24 };
/** The whale's wind-up key sticks out of its left side, low down: the tip's offset from the whale's middle and its height. */
export const KEY = { dx: -110, y: FLOOR - 36 };
/** The whale's blowhole, on top of its head: offset from its middle. */
export const BLOWHOLE = { dx: 46, dy: -WHALE.feet - WHALE.h / 2 - Math.sqrt(1 - (46 / WHALE.half) ** 2) * (WHALE.h / 2) };

/** The front-loading washing machine on the floor right of where the whale stops: its left edge, width and height. */
export const WASHER = { x0: WHALE.stop + BLOWHOLE.dx + 140, w: 300, h: 330 };
/** Its start button on the panel along its top, as it stands before it walks. */
export const START = { x: WASHER.x0 + 60, y: FLOOR - WASHER.h + 32, r: 18 };
/** The round door on its front: its middle's offset from the washer's left edge, its height, and the glass's radius. */
export const DOOR = { dx: WASHER.w / 2, y: FLOOR - 170, r: 82 };
/** How high the whale's fountain arcs over the straight line from the blowhole to the start button. */
export const ARC_H = 150;
/** How far the spinning washer walks to the right, in steps. */
export const WALK = 520;
export const WALK_STEPS = 14;

/** The hair dryer rests in a ring on the wall, nozzle to the right; this is its barrel's middle, where it turns. The washer
    walks until its right side presses the switch on the handle's left edge. */
export const DRYER = { x: WASHER.x0 + WASHER.w + WALK + 68, y: 400 };
/** The bottom of the dryer's handle. */
export const HANDLE = { x: DRYER.x - 34, y: DRYER.y + 112 };
/** The dryer's switch, a button on the handle's left edge, where the walking washer's corner presses it. */
export const DRYER_SWITCH = { x: DRYER.x - 59, y: DRYER.y + 92, r: 9 };
/** Where the air comes out. */
export const NOZZLE = { x: DRYER.x + 100, y: DRYER.y };
/** The little glass shelf in front of the dryer, with the shower cap and the jar of bubble soap on it. */
export const BATH_SHELF = { x0: DRYER.x + 140, x1: DRYER.x + 430, y: 470 };
/** The shower cap's bottom middle as it sits on the shelf. */
export const CAP = { x: DRYER.x + 200, y: BATH_SHELF.y };
/** The ring of the bubble wand, standing in its jar in the dryer's air. */
export const WAND = { x: DRYER.x + 335, y: 404, r: 24 };

/** The ceiling lamp, a round glass globe on a cord; the bubbles go to the bottom of it. */
export const LAMP = { x: DRYER.x + 940, y: 170, r: 58 };
export const BUBBLES = 9;

export const WORLD_W = DRYER.x + 1490;

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

  /* The overflowing wave carries the duck over the rim onto the bar of soap in the puddle, and duck and soap slide off
     over the wet tiles, slower and slower, until the soap bumps the plunger's rubber cup. */
  const tSurf = tFull + 0.35;
  const tOnSoap = tSurf + 0.8;
  const tGlide = tOnSoap + 0.15;
  const afloatEnd = { x: TUB.x1 - 150, y: waterY(tFull) - 30 };
  const onSoap = { x: SOAP.x, y: DUCK_ON_SOAP };
  const slideEnd = PLUNGER.x - PLUNGER.cupW / 2 - SOAP.w / 2 - 2;
  // Sliding from 300 px/s down to 140 px/s: still going when it bumps the cup.
  const SLIDE_V0 = 300;
  const SLIDE_V1 = 140;
  const tKnock = tGlide + (2 * (slideEnd - SOAP.x)) / (SLIDE_V0 + SLIDE_V1);
  /** The soap's middle: lying still until the duck lands on it, then sliding to the plunger. */
  const soapX = (t: number) => {
    const T = tKnock - tGlide;
    const s = clamp01((t - tGlide) / T) * T;
    return SOAP.x + SLIDE_V0 * s + ((SLIDE_V1 - SLIDE_V0) * s * s) / (2 * T);
  };
  at(tSurf, { sound: playWhoosh });
  at(tOnSoap, { sound: playSqueak });
  at(tOnSoap + 0.03, { sound: playSplash });
  at(tGlide, { sound: playSlide });
  at(tGlide + 1.2, { sound: playSlide });
  at(tKnock, { sound: () => playKnock(700) });
  at(tKnock + 0.05, { sound: playSqueak });

  /* The plunger is stuck by its cup: it rocks to and fro, further each time, until it comes loose with a plop on a rock to
     the right and topples over onto the pull handle, pulling the chain down. */
  const ROCK_T = 0.5;
  const ROCKS = 3.25;
  const tLoose = tKnock + ROCK_T * ROCKS;
  const tPress = tLoose + 0.35;
  const tPressed = tPress + 0.25;
  at(tKnock + 0.1, { sound: playBoing });
  at(tLoose, { sound: playPop });
  at(tPress, { sound: () => playKnock(1000) });
  at(tPress + 0.1, { sound: playRattle });
  /** How far the plunger leans to the right (degrees; to the left when negative). */
  const plungerTilt = (t: number) => {
    if (t < tKnock) return 0;
    if (t < tLoose) {
      const k = (t - tKnock) / ROCK_T;
      return lerp(4, 12, (t - tKnock) / (tLoose - tKnock)) * Math.sin(2 * Math.PI * k);
    }
    if (t < tPress) return lerp(12, PLUNGER_HIT, easeIn(seg(t, tLoose, tPress)));
    return lerp(PLUNGER_HIT, PLUNGER_PRESSED, easeOut(seg(t, tPress, tPressed)));
  };
  /** The pull handle's middle: hanging still until the plunger's knob comes down on it, then pressed down under it as the knob slides along it. */
  const pullAt = (t: number): Pt => {
    if (t < tPress) return PULL;
    const top = plungerTop(plungerTilt(t));
    return { x: PULL.x, y: PULL.y + top.y - plungerTop(PLUNGER_HIT).y };
  };

  /* The cistern flushes: the water rushes down the pipe into the toilet and bursts the lid open, which flies up and back
     and knocks the toilet roll off its holder. */
  const tFlush = tPressed + 0.05;
  const tLidPop = tFlush + 0.75;
  const LID_FLY = 0.4;
  at(tFlush, { sound: playFlush });
  at(tLidPop, { sound: playWhoosh });
  /** The water drops the burst throws up out of the bowl: each one's middle, or null before and once it has fallen back. */
  const spray = (i: number, t: number): Pt | null => {
    const age = t - tLidPop;
    const v = 520 + 90 * (i % 3);
    const y = TOILET.hinge.y + 4 - v * age + 700 * age * age;
    if (age < 0 || y > TOILET.hinge.y + 6) return null;
    return { x: TOILET.hinge.x - 190 + 30 * i + 40 * age * ((i % 2) * 2 - 1), y };
  };
  /** How far the flush water has got down the pipe (0 to 1), and how far its end has (the pipe is empty again at 1). */
  const pipeWater = (t: number) => ({ front: easeIn(seg(t, tFlush, tFlush + 0.7)), tail: easeIn(seg(t, tFlush + 1.4, tFlush + 2.1)) });
  /** How full the cistern is: it empties with the flush and fills again slowly. */
  const cisternFull = (t: number) => 1 - easeInOut(seg(t, tFlush, tFlush + 1.2)) + easeInOut(seg(t, tFlush + 3, tFlush + 7));
  /** The lid's angle (degrees, 0 shut and lying to the left, 90 standing up): it flies open, then settles leaning back. */
  const lidAngle = (t: number) => {
    if (t < tLidPop) return 0;
    if (t < tLidPop + LID_FLY) return LID_OPEN * easeOut(seg(t, tLidPop, tLidPop + LID_FLY));
    const age = Math.min(t, tLidPop + LID_FLY + 3) - tLidPop - LID_FLY;
    return LID_REST + (LID_OPEN - LID_REST) * Math.exp(-age * 4) * Math.cos(age * 9);
  };
  /** How close the lid at angle `a` comes to the roll on its holder, beyond the roll's and the lid's half thickness. */
  const lidGap = (a: number) => {
    let near = Number.POSITIVE_INFINITY;
    for (let s = 0; s <= TOILET.lid; s += 2) {
      const p = turn({ x: TOILET.hinge.x - s, y: TOILET.hinge.y - 6 }, TOILET.hinge, rad(a));
      near = Math.min(near, Math.hypot(p.x - HOLDER.x, p.y - HOLDER.y));
    }
    return near - ROLL.r - 6;
  };
  // The moment the flying lid touches the roll.
  let tBonk = tLidPop;
  while (lidGap(lidAngle(tBonk)) > 0) tBonk += 0.002;

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
    if (t < tOnSoap) return { pt: hop(from, onSoap, 110, seg(t, tSurf, tOnSoap)), spin: -360 * easeInOut(seg(t, tSurf, tOnSoap)) };
    // Riding the soap: swaying a little while it slides, nodding forward when it bumps the plunger.
    const sway = t < tKnock ? 5 * Math.sin((t - tOnSoap) * 10) * seg(t, tOnSoap, tOnSoap + 0.3) : wobble(t - tKnock, 22, 12, 3);
    return { pt: { x: soapX(t), y: DUCK_ON_SOAP }, spin: sway };
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
  at(tBonk, { sound: () => playKnock(500) });
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

  /* At the stop it swells up, gives a little spurt, then a big fountain in an arc onto the washing machine's start button. */
  const tSpurt = tStop + 0.7;
  const tFountain = tStop + 1.4;
  const blowholeY = FLOOR + BLOWHOLE.dy;
  const tHitStart = tFountain + 0.45;
  at(tHitStart, { sound: playClick });
  at(tHitStart + 0.15, { sound: playDing });
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
  /** The whale's little spurt straight up: the top of the water and how strong it is (0 to 1), or null. */
  const spurtAt = (t: number): { top: number; k: number } | null => {
    if (t < tSpurt || t >= tSpurt + 0.5) return null;
    const k = Math.sin(Math.PI * seg(t, tSpurt, tSpurt + 0.5));
    return { top: blowholeY - 50 * k, k: 0.5 * k };
  };
  const blowhole = { x: WHALE.stop + BLOWHOLE.dx, y: blowholeY };
  /** A point on the fountain's arc, `k` of the way from the blowhole (0) to the start button (1). */
  const arcAt = (k: number): Pt => hop(blowhole, START, ARC_H, k);
  /** The big fountain: how far along its arc the water has got (0 to 1) and how strong it is (0 to 1), or null. */
  const fountainAt = (t: number): { reach: number; k: number } | null => {
    if (t < tFountain || t > tFountain + 2.2) return null;
    return { reach: easeOut(seg(t, tFountain, tHitStart)), k: 1 - easeIn(seg(t, tFountain + 1.5, tFountain + 2.2)) };
  };

  /* The washing machine starts: water runs into its drum, the drum turns the washing over and over, then spins faster and
     faster until the machine shakes and walks off to the right on its little feet, step by step, and its right side presses
     the switch on the dryer's handle. */
  const tFill = tHitStart + 0.4;
  const tTumble = tFill + 2.6;
  const tSpin = tTumble + 5;
  const tWalkOff = tSpin + 0.4;
  const WALK_T = 0.45;
  const tHitDryer = tWalkOff + WALK_STEPS * WALK_T;
  at(tFill, { sound: playGlug });
  at(tFill + 1.3, { sound: playGlug });
  at(tTumble, { sound: playWash });
  at(tTumble + 2.5, { sound: playWash });
  for (let s = tTumble + 0.8; s < tSpin; s += 1) at(s, { sound: playThump });
  at(tSpin, { sound: playWhirr });
  for (let i = 0; i < WALK_STEPS; i++) at(tWalkOff + (i + 0.5) * WALK_T, { sound: () => playKnock(i % 2 ? 450 : 560) });
  at(tWalkOff + 0.3, {
    say: {
      de: "Die Waschmaschine läuft los!",
      en: "The washing machine walks off!",
      zh: "洗衣机自己走起来啦！",
      hi: "देखो, वॉशिंग मशीन चल पड़ी!",
      es: "¡La lavadora se va andando!",
      ar: "واو، الغسّالة تمشي!",
      ru: "Стиральная машина пошла!",
    },
  });
  /** How full the drum is (0 to 1). */
  const washWater = (t: number) => easeInOut(seg(t, tFill, tTumble)) * (1 - 0.6 * easeInOut(seg(t, tSpin, tSpin + 1.5)));
  /** The time a speed that rises evenly from `t0` to `t1` (and stays) has run, counted at full speed. */
  const ramp = (t: number, t0: number, t1: number) => (t < t0 ? 0 : t < t1 ? (t - t0) ** 2 / (2 * (t1 - t0)) : (t1 - t0) / 2 + (t - t1));
  /** How far the drum has turned (degrees): slowly while it tumbles, fast while it spins, slowing to a stop after the switch. */
  const drumTurn = (t: number) => {
    const still = Math.min(t, tHitDryer + 4);
    return 140 * ramp(still, tTumble, tTumble + 0.5) + 760 * ramp(still, tSpin, tSpin + 0.4) - 900 * ramp(still, tHitDryer, tHitDryer + 1.6);
  };
  /** The washing machine: its left edge, how high it is lifted, its tilt (degrees) and whether it is on. */
  const washerAt = (t: number) => {
    const step = WALK / WALK_STEPS;
    const on = t >= tHitStart;
    if (t < tWalkOff) {
      const shake = t >= tSpin ? 1.5 * Math.sin(t * 50) * seg(t, tSpin, tWalkOff) : 0;
      return { x: WASHER.x0, lift: 0, tilt: shake, on };
    }
    if (t < tHitDryer) {
      const phase = (t - tWalkOff) / WALK_T;
      const i = Math.floor(phase);
      const f = phase - i;
      return { x: WASHER.x0 + step * (i + easeInOut(f)), lift: 10 * Math.sin(Math.PI * f), tilt: (i % 2 ? -3 : 3) * Math.sin(Math.PI * f), on };
    }
    return { x: WASHER.x0 + WALK, lift: 0, tilt: wobble(t - tHitDryer, 3, 14, 3), on };
  };

  /* The washer presses the switch: click, the dryer jolts in its ring and blows. Its air lifts the shower cap off the shelf
     and carries it, fluttering, onto the lamp like a hat, and blows soap bubbles out of the wand. */
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
  const capMid = { x: DRYER.x + 610, y: 90 };
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

  /** Where the camera looks: tube, brush and mug, the duck, the tub filling, the soap's slide, plunger and toilet, the roll,
      the whale, the washing machine walking, then dryer and lamp. */
  const TOILET_VIEW = PULL.x;
  const WASHER_VIEW = WASHER.x0 + 74;
  const FINALE = DRYER.x + 550;
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tHit) return 760;
    if (t < tInTub) return Math.max(760, duckAt(t).pt.x);
    if (t < tSurf) return 1700;
    if (t < tKnock) return Math.min(TOILET_VIEW, Math.max(1700, duckAt(t).pt.x + 230));
    if (t < tBonk + 0.3) return TOILET_VIEW;
    if (t < tKey) return Math.max(TOILET_VIEW, rollAt(t).pt.x);
    if (t < tWalk) return rollEndX + 120;
    if (t < tStop) return whaleAt(t).x + 120;
    if (t < tHitDryer) return Math.max(WASHER_VIEW, washerAt(t).x + 74);
    if (t < tDryer + 0.4) return WASHER.x0 + WALK + 74;
    return FINALE;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  /** Where it could wait for the child's tap (R-03): the mug with the brush in it, the duck on the brimful tub, the wound-up whale, the whale before the washing machine. Only the wound-up whale waits; the machine runs through the others. */
  const whaleY = FLOOR - WHALE.feet - WHALE.h / 2;
  const stops = [
    { at: tTopple, x: MUG.x, y: MUG.bottom - MUG.h / 2 },
    { at: tFull, ...duckAt(tFull).pt },
    { at: tWake, x: WHALE.x, y: whaleY, active: true },
    { at: tStop, x: WHALE.stop, y: whaleY },
  ];

  return {
    events: sorted(),
    duration: tDone,
    stops,
    tBlobLand,
    tInMug,
    tTopple,
    tHit,
    tLever,
    tInTub,
    tWater,
    tFull,
    tSurf,
    tOnSoap,
    tGlide,
    tKnock,
    tLoose,
    tPress,
    tFlush,
    tLidPop,
    tBonk,
    tRollLand,
    tKey,
    tWound,
    tWake,
    tWalk,
    tStop,
    tFountain,
    tHitStart,
    tFill,
    tTumble,
    tSpin,
    tWalkOff,
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
    soapX,
    plungerTilt,
    pullAt,
    pipeWater,
    cisternFull,
    lidAngle,
    lidGap,
    spray,
    rollAt,
    ribbon,
    whaleAt,
    keyTip,
    spurtAt,
    fountainAt,
    arcAt,
    washWater,
    drumTurn,
    washerAt,
    dryerAngle,
    blowing,
    capAt,
    bubbleAt,
    popped,
    lampSwing,
    capOn,
    cameraTarget,
    width: WORLD_W,
  };
}
