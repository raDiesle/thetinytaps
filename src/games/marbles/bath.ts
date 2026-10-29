// The bathroom machine ("Badezimmer", R-05): one tap presses the button on
// the toothpaste tube, a blob drops onto the toothbrush, its weight tips the
// brush off the glass shelf, it turns a somersault and lands in the tooth
// mug, the mug topples and its brush knocks the squeaky duck off the counter,
// the duck bonks the bath tap's lever and the water rushes, the tub fills up
// with foam and overflows, and soap bubbles float up to the ceiling lamp, each
// popping there with a note. Everything is worked out ahead as a function of
// the seconds since the tap, so BathLevel.tsx only asks where each thing is at
// a moment. Coordinates are those of the bathroom, 3700 × 900; the screen
// shows 1600 of it at a time.

import {
  playBlub,
  playClonk,
  playCreak,
  playDing,
  playKnock,
  playPlink,
  playPlop,
  playPop,
  playPuff,
  playSlide,
  playSplash,
  playSqueak,
  playTwinkle,
} from "@/lib/sfx";
import { cameraOn, clamp01, easeIn, easeInOut, easeOut, hop, lerp, rad, seg, timeline, turn } from "./machineKit";
import type { Pt } from "./path";

export const WORLD_W = 3700;
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

/** The ceiling lamp, a round glass globe on a cord; the bubbles go to the bottom of it. */
export const LAMP = { x: 2900, y: 170, r: 58 };
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

  /* The water rushes and the tub fills; the foam grows with it, the duck floats up. */
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

  const duckAt = (t: number): { pt: Pt; spin: number } => {
    const start = { x: DUCK.x, y: DUCK.y };
    if (t < tHit) return { pt: start, spin: 0 };
    if (t < tLever) return { pt: hop(start, duckOnLever, 170, seg(t, tHit, tLever)), spin: -360 * easeOut(seg(t, tHit, tLever)) };
    if (t < tInTub) {
      const k = seg(t, tLever, tInTub);
      return { pt: hop(duckOnLever, duckLand, 70, easeIn(k)), spin: 200 * k };
    }
    // Afloat: as high as the water, drifting slowly to the middle of the tub, bobbing on the waves.
    const after = t - tInTub;
    const x = lerp(duckLand.x, TUB.x0 + 520, easeInOut(clamp01(after / 9)));
    const water = waterY(t) - 30;
    const bob = 5 * Math.sin(Math.min(t, tDone) * 3);
    return { pt: { x, y: Math.min(duckLand.y, water) + (water < duckLand.y ? bob : 0) }, spin: 200 * (1 - easeOut(seg(t, tInTub, tInTub + 0.4))) };
  };

  /* Full: the foam spills over the rim, a puddle spreads on the floor. */
  at(tFull, { sound: playSplash });
  at(tFull + 0.3, {
    say: { de: "Oh! Die Wanne läuft über!" },
  });
  /** How far the overflow has got: 0 to 1. */
  const spill = (t: number) => easeOut(seg(t, tFull, tFull + 1.6));

  /* Soap bubbles rise out of the foam one after the other and float up to the lamp, where each one pops with a note. */
  const BUBBLE_SPEED = 230;
  const tBubble = (i: number) => tFull + 0.6 + 0.55 * i;
  const bubbleStart = (i: number): Pt => ({ x: TUB.x0 + 380 + ((i * 197) % 520), y: TUB.rim - 70 });
  const target = { x: LAMP.x, y: LAMP.y + LAMP.r + 6 };
  /** The way of bubble `i`: a gentle wave from the foam to the lamp. */
  const bubbleWay = (i: number, k: number): Pt => {
    const s = bubbleStart(i);
    const mid = { x: lerp(s.x, target.x, 0.45), y: 120 + (i % 3) * 60 };
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
  /** Where bubble `i` is and how big (0 before it rises, gone once popped). */
  const bubbleAt = (i: number, t: number): { pt: Pt; size: number } | null => {
    if (t < tBubble(i) || t >= tPop[i]) return null;
    const k = (t - tBubble(i)) / (tPop[i] - tBubble(i));
    return { pt: bubbleWay(i, k), size: (0.75 + 0.25 * ((i * 5) % 3)) * easeOut(seg(t, tBubble(i), tBubble(i) + 0.4)) };
  };
  /** How many bubbles have popped at the lamp, as a smooth count. */
  const popped = (t: number) => tPop.reduce((n, tp) => n + easeOut(seg(t, tp, tp + 0.3)), 0);

  /* The last pop: the lamp lights up, swings, and the whole bathroom sparkles. */
  const tLast = Math.max(...tPop);
  const tDone = tLast + 3.2;
  at(tLast + 0.15, { sound: playPop });
  at(tLast + 0.4, { sound: playTwinkle });
  at(tLast + 0.9, { say: { de: "Seifenblasen bis zur Lampe!" } });
  at(tDone, { done: true });
  /** The lamp's swing in degrees, starting at the last pop and dying away. */
  const lampSwing = (t: number) => {
    const age = Math.min(t, tDone) - tLast;
    return age < 0 ? 0 : 9 * Math.exp(-age * 0.9) * Math.sin(age * 4.5);
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

  /** Where the camera looks: the tube, the brush and the mug, the duck, the tub filling, then the first bubble up to the lamp. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tHit) return 760;
    if (t < tInTub) return Math.max(760, duckAt(t).pt.x);
    if (t < tBubble(0) + 0.4) return 1700;
    const lead = bubbleAt(0, t);
    return Math.min(2500, Math.max(1700, lead ? lead.pt.x : 2500));
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
    bubbleAt,
    popped,
    lampSwing,
    cameraTarget,
  };
}
