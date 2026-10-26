// The building site ("Baustelle"), a Rube Goldberg machine on a construction
// site: one tap starts the motors, and one thing sets off the next for about
// half a minute until the tower crane sets the roof on the new house.
// Everything is worked out ahead as a function of the seconds since the tap,
// so BuildingLevel.tsx only asks where each thing is at a moment. Coordinates
// are those of the site, 5100 × 900; the screen shows 1600 of it at a time.

import {
  playBells,
  playBlub,
  playClonk,
  playCreak,
  playDing,
  playDrum,
  playEngine,
  playHonk,
  playKnock,
  playPop,
  playRumble,
  playThump,
  playTick,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { wobble } from "./level";
import { along, cameraOn, distAt, easeIn, easeInOut, easeOut, GRAVITY, hop, lerp, pathOf, rad, roll, seg, STEP, timeline, timeWhen } from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

export const WORLD_W = 5100;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The cement mixer's drum: its middle, how far its mouth is from there, and its tilt in degrees (mouth up, then tipped down). */
export const MIXER = { x: 190, y: 128, mouth: 100, rest: -25, tipped: 28 };
/** Where the marble waits in the drum, along its middle line. */
const IN_DRUM = 78;
/** The little deck on top of the scaffold the mixer stands on. */
export const TOP_DECK = { x0: 40, x1: 300, y: 220 };
export const SCAFFOLD_POLES = [60, 300, 560, 900];

/** The big spirit level the marble rolls along (the marble's middle); the vial with the bubble sits in its middle. */
export const SPIRIT = { from: { x: 306, y: 204 }, to: { x: 784, y: 230 } };
export const VIAL_X = (SPIRIT.from.x + SPIRIT.to.x) / 2;

/** The conveyor belt from its low roller `a` up to its high roller `b`; cleats every `gap` carry the marble. */
export const BELT = { a: { x: 800, y: 716 }, b: { x: 1300, y: 384 }, r: 24, speed: 120, gap: 80 };
export const BELT_LEN = Math.hypot(BELT.b.x - BELT.a.x, BELT.b.y - BELT.a.y);
/** Along the belt, and its up side (away from the rollers). */
export const BELT_U = { x: (BELT.b.x - BELT.a.x) / BELT_LEN, y: (BELT.b.y - BELT.a.y) / BELT_LEN };
export const BELT_N = { x: BELT_U.y, y: -BELT_U.x };
/** The belt's outside, measured from the rollers' middles. */
export const BELT_SKIN = BELT.r + 4;
/** A spot `s` along the belt's top, `lift` above it. */
export const onBelt = (s: number, lift: number): Pt => ({
  x: BELT.a.x + s * BELT_U.x + (BELT_SKIN + lift) * BELT_N.x,
  y: BELT.a.y + s * BELT_U.y + (BELT_SKIN + lift) * BELT_N.y,
});
/** Where the marble lands on the belt. */
const ON_BELT = 44;

/** The rubble chute: see-through cones hanging one in the next, right above where the marble lands on the belt. */
export const CHUTE = { x: onBelt(ON_BELT, BALL_R).x, top: 300, n: 5, h: 72, step: 62, wTop: 98, wBottom: 60 };
/** Where the marble knocks against the inside of cone `k` on its way down. */
const inCone = (k: number): Pt => ({ x: CHUTE.x + (k % 2 ? 9 : -9), y: CHUTE.top + k * CHUTE.step + 48 });

/** The scaffold deck with the board and the traffic cone, and the pole that carries the wrecking ball's beam. */
export const DECK1 = { x0: 1340, x1: 1770, y: 520 };
export const POLE_X = 1738;
export const BEAM_Y = 150;
/** A board leaning on a brick, from its top end down to the deck (its top side). */
export const BOARD = { from: { x: 1352, y: 474 }, to: { x: 1470, y: 520 } };
/** The traffic cone standing on the deck: the middle of its foot, its foot's width and its height. */
export const CONE = { x: 1590, w: 64, h: 94 };
export const CONE_TIP = { x: CONE.x, y: DECK1.y - CONE.h };

/** The wrecking ball, held back `hold` degrees by a rope whose loop lies over the cone's tip. */
export const BALL = { r: 46, len: 300, hold: 50 };
export const HELD = { x: CONE.x + 205, y: CONE_TIP.y - 40 };
export const PIVOT = { x: HELD.x + BALL.len * Math.sin(rad(BALL.hold)), y: HELD.y - BALL.len * Math.cos(rad(BALL.hold)) };
export const ROPE_LEN = Math.hypot(HELD.x - CONE_TIP.x, HELD.y - CONE_TIP.y);

/** The long scaffold deck with the brick tower and the cable drum. */
export const DECK2 = { x0: 1955, x1: 2980, y: 640 };
export const TOWER = { x: PIVOT.x + BALL.r, w: 64, brick: 39, n: 7 };
export const TOWER_H = TOWER.brick * TOWER.n;
/** Seconds for the tower to fall flat. */
const TOWER_FALL = 0.95;

/** The wooden cable drum: its rims' radius and its core's; it stands just inside the reach of the falling tower's top. */
export const SPOOL = { r: 50, core: 24 };
export const SPOOL_X0 = TOWER.x + TOWER.w + Math.sqrt((TOWER_H + SPOOL.r - 6) ** 2 - SPOOL.r ** 2);
/** Where the loose end of its cable lies, plugged into the power box. */
export const PLUG_X = SPOOL_X0 - 120;

/** The winch at the crane's foot: its drum lets out the crane rope as its crank turns. */
export const WINCH = { x: 3110, y: 712, drum: 26, arm: 66, knob: 9 };

/** The tower crane; its rope runs from the winch round the foot and top pulleys and along the jib to the trolley. */
export const CRANE = { x: 3420, jibTop: 96, jibY: 120, end: 4400, back: 3160, apexY: 36 };
export const FOOT_PULLEY = { x: 3380, y: 724, r: 14 };
export const TOP_PULLEY = { x: 3380, y: 108, r: 12 };
export const TROLLEY_X = 4020;

export const HOUSE = { x0: 3770, x1: 4270, top: 540 };
/** The roof hangs from the crane hook by an eye on its top and comes down `drop` onto the walls. */
export const ROOF = { w: 580, h: 150, drop: 200 };
/** Turns of the winch drum while the roof comes down, in radians. */
const CRANK_TURN = ROOF.drop / WINCH.drum;

export const LIGHT_X = 4480;
export const TRUCK_X = 4560;

/* ---------- Helpers ---------- */

/** A spot `d` along the mixer drum's middle line at `angle` degrees. */
export function inDrum(d: number, angle: number): Pt {
  return { x: MIXER.x + d * Math.cos(rad(angle)), y: MIXER.y + d * Math.sin(rad(angle)) };
}

/** The winch crank's knob when the crank has turned `turned` radians (it starts pointing left and turns down). */
export function crankKnob(turned: number): Pt {
  const a = Math.PI - turned;
  return { x: WINCH.x + WINCH.arm * Math.cos(a), y: WINCH.y + WINCH.arm * Math.sin(a) };
}

/** `p` turned by `angle` radians around `c` (clockwise on screen). */
function turnAround(p: Pt, c: Pt, angle: number): Pt {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: c.x + (p.x - c.x) * cos - (p.y - c.y) * sin, y: c.y + (p.x - c.x) * sin + (p.y - c.y) * cos };
}

/** A throw from `a` that starts with downward speed `vy` and comes down at `b`; `at(time)` is where it is. */
function toss(a: Pt, vy: number, b: Pt) {
  const dy = b.y - a.y;
  const T = (-vy + Math.sqrt(vy * vy + 2 * GRAVITY * dy)) / GRAVITY;
  return { T, at: (time: number): Pt => ({ x: lerp(a.x, b.x, time / T), y: a.y + vy * time + 0.5 * GRAVITY * time * time }) };
}

/** The marble's middle on a board from `p` to `q` (its top side), lifted by its radius. */
function onTop(p: Pt, q: Pt): [Pt, Pt] {
  const len = Math.hypot(q.x - p.x, q.y - p.y);
  const n = { x: ((q.y - p.y) / len) * BALL_R, y: (-(q.x - p.x) / len) * BALL_R };
  return [
    { x: p.x + n.x, y: p.y + n.y },
    { x: q.x + n.x, y: q.y + n.y },
  ];
}

/* ---------- The machine ---------- */

export type Building = ReturnType<typeof buildBuilding>;

export function buildBuilding() {
  const { at, sorted } = timeline();

  /* The tap starts the motors: the mixer's drum turns, then tips forward; the conveyor belt runs. */
  const tSpin = 1.8;
  const tTipped = tSpin + 0.45;
  const drumAngle = (t: number) => lerp(MIXER.rest, MIXER.tipped, easeInOut(seg(t, tSpin, tTipped)));
  const tBelt = 0.4;
  at(0, { sound: playEngine });
  at(0.4, { sound: playRumble });
  at(tSpin, { sound: playCreak });

  /** How far the belt has moved: it speeds up for a moment, then runs steadily. */
  const ACC = 0.4;
  const beltTravel = (t: number) => {
    const u = t - tBelt;
    if (u <= 0) return 0;
    return u < ACC ? (BELT.speed * u * u) / (2 * ACC) : BELT.speed * (u - ACC / 2);
  };

  /* The marble: out of the drum's mouth and along the spirit level. */
  const lip = inDrum(MIXER.mouth + 6, MIXER.tipped);
  const levelRun = roll(
    pathOf(line(inDrum(IN_DRUM, MIXER.tipped), lip, 4), quad(lip, { x: lip.x + 12, y: SPIRIT.from.y - 2 }, SPIRIT.from), line(SPIRIT.from, SPIRIT.to)),
    60,
    120,
    240,
  );
  const tRoll = tTipped - 0.05;
  const tLevel = tRoll + levelRun.duration;
  const tVial = tRoll + timeWhen(levelRun, (pt) => pt.x >= VIAL_X);
  at(tRoll + timeWhen(levelRun, (pt) => pt.x >= SPIRIT.from.x), { sound: () => playKnock(1300) });
  at(tVial - 0.1, { sound: playBlub });

  /* Off the end of the level into the rubble chute: it knocks its way down from cone to cone. */
  const n = levelRun.d.length;
  const vLevel = (levelRun.d[n - 1] - levelRun.d[n - 2]) / STEP;
  const lDir = { x: SPIRIT.to.x - SPIRIT.from.x, y: SPIRIT.to.y - SPIRIT.from.y };
  const intoChute = toss(SPIRIT.to, (vLevel * lDir.y) / Math.hypot(lDir.x, lDir.y), inCone(0));
  const tChute = tLevel + intoChute.T;
  const CONE_HOP = 0.36;
  const coneTime = (k: number) => tChute + k * CONE_HOP;
  for (let k = 0; k < CHUTE.n; k++) at(coneTime(k), { sound: () => playKnock(1500 - k * 160) });
  const lastCone = coneTime(CHUTE.n - 1);
  const ontoBelt = toss(inCone(CHUTE.n - 1), 60, onBelt(ON_BELT, BALL_R));
  const tOnBelt = lastCone + 0.1 + ontoBelt.T;
  at(tOnBelt, { sound: () => playKnock(600) });

  /* Up the belt, against a cleat: the cleats are spaced so one comes up right behind the marble. */
  const cleatPhase = ON_BELT - BALL_R - 7 - beltTravel(tOnBelt);
  const tTop = tOnBelt + (BELT_LEN - ON_BELT) / BELT.speed;

  /* Over the top roller and down onto the board, which leads it into the traffic cone. */
  const overR = BELT_SKIN + BALL_R;
  const a0 = (Math.atan2(BELT_N.y, BELT_N.x) * 180) / Math.PI;
  const a1 = -38;
  const overTop = pathOf(arc(BELT.b.x, BELT.b.y, overR, a0, a1));
  const tOff = tTop + overTop.total / BELT.speed;
  const offPt = overTop.pts[overTop.pts.length - 1];
  const [boardTop, boardEnd] = onTop(BOARD.from, BOARD.to);
  const landK = 0.08;
  const onBoard = { x: lerp(boardTop.x, boardEnd.x, landK), y: lerp(boardTop.y, boardEnd.y, landK) };
  const fall = toss(offPt, BELT.speed * Math.cos(rad(a1)), onBoard);
  const tBoard = tOff + fall.T;
  const deckY = DECK1.y - BALL_R;
  const hitX = CONE.x - CONE.w / 2 - BALL_R - 2;
  const deckRun = roll(
    pathOf(
      line(onBoard, { x: boardEnd.x - 12, y: boardEnd.y - 4 }),
      quad({ x: boardEnd.x - 12, y: boardEnd.y - 4 }, { x: boardEnd.x + 6, y: deckY }, { x: boardEnd.x + 30, y: deckY }),
      line({ x: boardEnd.x + 30, y: deckY }, { x: hitX, y: deckY }),
    ),
    100,
    120,
    330,
  );
  const tKnock = tBoard + deckRun.duration;
  at(tBoard, { sound: () => playKnock(900) });
  at(tKnock, { sound: () => playKnock(1100) });

  const marbleAt = (t: number): { pt: Pt; spin: number } => {
    if (t < tRoll) return { pt: inDrum(IN_DRUM, drumAngle(t)), spin: 0 };
    if (t < tLevel) {
      const d = distAt(levelRun, t - tRoll);
      return { pt: along(levelRun.path, d).pt, spin: d / BALL_R };
    }
    let spin = levelRun.path.total / BALL_R;
    if (t < tChute) return { pt: intoChute.at(t - tLevel), spin };
    if (t < lastCone) {
      const k = Math.floor((t - tChute) / CONE_HOP);
      const f = seg(t, coneTime(k), coneTime(k + 1));
      return { pt: hop(inCone(k), inCone(k + 1), 8, f), spin: spin + (k + f) * 1.5 };
    }
    spin += (CHUTE.n - 1) * 1.5;
    if (t < lastCone + 0.1) return { pt: inCone(CHUTE.n - 1), spin };
    if (t < tOnBelt) return { pt: ontoBelt.at(t - lastCone - 0.1), spin };
    // On the belt it rides along against its cleat without turning.
    if (t < tTop) return { pt: onBelt(ON_BELT + beltTravel(t) - beltTravel(tOnBelt), BALL_R), spin };
    if (t < tOff) {
      const d = (t - tTop) * BELT.speed;
      return { pt: along(overTop, d).pt, spin: spin + d / BALL_R };
    }
    spin += overTop.total / BALL_R;
    if (t < tBoard) return { pt: fall.at(t - tOff), spin };
    if (t < tKnock) {
      const d = distAt(deckRun, t - tBoard);
      return { pt: along(deckRun.path, d).pt, spin: spin + d / BALL_R };
    }
    // It bounces back a little off the cone's foot.
    const back = 26 * easeOut(seg(t, tKnock, tKnock + 0.6));
    return { pt: { x: hitX - back, y: deckY }, spin: spin + (deckRun.path.total - back) / BALL_R };
  };

  /* The traffic cone tips over to the right, and the rope's loop slips off its tip. */
  const coneAngle = (t: number) => {
    if (t < tKnock + 0.55) return (Math.PI / 2) * easeIn(seg(t, tKnock, tKnock + 0.55));
    return Math.PI / 2 - Math.abs(wobble(t - tKnock - 0.55, 0.08, 18, 7));
  };
  const conePivot = { x: CONE.x + CONE.w / 2, y: DECK1.y };
  const coneTip = (t: number) => turnAround(CONE_TIP, conePivot, coneAngle(t));
  let tRelease = tKnock;
  while (coneAngle(tRelease) < rad(22)) tRelease += STEP;
  at(tKnock + 0.55, { sound: playThump });

  /* The wrecking ball swings down from where it was held and smashes into the tower. */
  const gl = GRAVITY / BALL.len;
  const swing: number[] = [-rad(BALL.hold)];
  const speeds: number[] = [0];
  let theta = swing[0];
  let omega = 0;
  while (theta < 0) {
    omega += -gl * Math.sin(theta) * STEP;
    theta += omega * STEP;
    swing.push(Math.min(0, theta));
    speeds.push(omega);
  }
  const tHit = tRelease + (swing.length - 1) * STEP;
  at(tRelease, { sound: playWhoosh });
  at(tHit, { sound: playDrum });

  /** The ball's angle from straight down (radians, positive to the right) and how fast it turns. */
  const ballAngle = (t: number): { a: number; w: number } => {
    if (t < tRelease) return { a: swing[0], w: 0 };
    if (t < tHit) {
      const i = Math.min(swing.length - 1, Math.round((t - tRelease) / STEP));
      return { a: swing[i], w: speeds[i] };
    }
    // It bounces back off the tower and sways to a stop.
    const age = t - tHit;
    const f = Math.sqrt(gl);
    const amp = 0.22 * Math.exp(-age * 0.8);
    return { a: -amp * Math.sin(age * f), w: -amp * f * Math.cos(age * f) };
  };
  const ballAt = (t: number): Pt => {
    const { a } = ballAngle(t);
    return { x: PIVOT.x + BALL.len * Math.sin(a), y: PIVOT.y + BALL.len * Math.cos(a) };
  };
  /** The rope's loose end: on the cone's tip until it slips off, then trailing behind the ball. */
  const ropeEnd = (t: number): Pt => {
    if (t < tRelease) return coneTip(t);
    const b = ballAt(t);
    const { a, w } = ballAngle(t);
    const held = Math.atan2(CONE_TIP.x - HELD.x, CONE_TIP.y - HELD.y);
    const lag = lerp(held, a - 0.15 * w, easeOut(seg(t, tRelease, tRelease + 0.4)));
    const end = { x: b.x + ROPE_LEN * Math.sin(lag), y: b.y + ROPE_LEN * Math.cos(lag) };
    // Where it would hang below a deck, it lies on the deck instead.
    for (const deck of [DECK1, DECK2]) if (end.x > deck.x0 && end.x < deck.x1) end.y = Math.min(end.y, deck.y - 4);
    return end;
  };

  /* The brick tower falls over to the right; its top bumps the cable drum. */
  const towerAngle = (t: number) => {
    if (t < tHit + TOWER_FALL) return (Math.PI / 2) * easeIn(seg(t, tHit, tHit + TOWER_FALL));
    return Math.PI / 2 - Math.abs(wobble(t - tHit - TOWER_FALL, 0.05, 16, 7));
  };
  const towerFoot = { x: TOWER.x + TOWER.w, y: DECK2.y };
  const spoolY = DECK2.y - SPOOL.r;
  /** Does the tower, fallen `phi`, touch the drum? Checked along its right side and its top. */
  const touches = (phi: number) => {
    const edge: Pt[] = [];
    for (let s = 0; s <= TOWER_H; s += 3) edge.push({ x: 0, y: -s });
    for (let w = 0; w <= TOWER.w; w += 3) edge.push({ x: -w, y: -TOWER_H });
    return edge.some((p) => {
      const q = turnAround({ x: towerFoot.x + p.x, y: towerFoot.y + p.y }, towerFoot, phi);
      return Math.hypot(q.x - SPOOL_X0, q.y - spoolY) <= SPOOL.r;
    });
  };
  let bump = 0;
  while (!touches(bump) && bump < Math.PI / 2) bump += 0.002;
  const tPush = tHit + TOWER_FALL * Math.sqrt(bump / (Math.PI / 2));
  at(tHit + TOWER_FALL, { sound: playRumble });
  at(tPush, { sound: () => playKnock(450) });

  /* The cable drum rolls along the deck unrolling its cable, over the edge, and onto the winch's crank. */
  const edge = { x: DECK2.x1, y: DECK2.y };
  const spoolRun = roll(pathOf(line({ x: SPOOL_X0, y: spoolY }, { x: edge.x, y: spoolY }), arc(edge.x, edge.y, SPOOL.r, -90, -56)), 470, 150, 600, 0.45);
  const tEdge = tPush + spoolRun.duration;
  const spoolOff = spoolRun.path.pts[spoolRun.path.pts.length - 1];
  /** The drum resting on the crank's knob; `lean` tips it over to the left of the knob as the knob goes down. */
  const onKnob = (turned: number, lean = 0) => {
    const k = crankKnob(turned);
    const d = SPOOL.r + WINCH.knob;
    return { x: k.x - d * Math.sin(lean), y: k.y - d * Math.cos(lean) };
  };
  const spoolDrop = toss(spoolOff, 150, onKnob(0));
  const tCrank = tEdge + spoolDrop.T;
  const PUSH = 0.65;
  const tRoofLand = tCrank + 6;
  /** How far the crank has turned: the drum pushes it round a bit, then the roof's weight keeps it going. */
  const crankAt = (t: number) => PUSH * easeOut(seg(t, tCrank, tCrank + 0.3)) + (CRANK_TURN - PUSH) * easeInOut(seg(t, tCrank + 0.2, tRoofLand));
  const restX = WINCH.x - WINCH.arm - 36;
  const tRest = tCrank + 0.3 + 0.38;
  at(tPush + 0.2, { sound: playRumble });
  at(tCrank, { sound: playClonk });
  at(tRest, { sound: playThump });
  at(tCrank + 0.4, { sound: playCreak });
  for (let k = 0; k < 4; k++) at(tCrank + 0.9 + k * 1.3, { sound: playTick });

  const spoolAt = (t: number): { pt: Pt; turned: number } => {
    const start = { x: SPOOL_X0, y: spoolY };
    if (t < tPush) return { pt: start, turned: 0 };
    if (t < tEdge) {
      const d = distAt(spoolRun, t - tPush);
      return { pt: along(spoolRun.path, d).pt, turned: d };
    }
    const rolled = spoolRun.path.total;
    if (t < tCrank) return { pt: spoolDrop.at(t - tEdge), turned: rolled + (t - tEdge) * 150 };
    const ride = seg(t, tCrank, tCrank + 0.3);
    const ridden = onKnob(crankAt(Math.min(t, tCrank + 0.3)), rad(50) * ride);
    if (t < tCrank + 0.3) return { pt: ridden, turned: rolled + 0.3 * 150 };
    // Off the knob, down onto the ground beside the winch.
    const k = seg(t, tCrank + 0.3, tRest);
    return { pt: hop(ridden, { x: restX, y: FLOOR - SPOOL.r }, 18, k), turned: rolled + 45 - k * 30 };
  };
  /** How much of the cable is still on the drum, from 1 down to a little. */
  const cableLeft = (t: number) => 1 - 0.75 * seg(spoolAt(t).pt.x, SPOOL_X0, edge.x + 60);

  /* The finale: the roof sits on the house, the topping-out tree springs up, the light turns green. */
  const roofDrop = (t: number) => WINCH.drum * Math.min(CRANK_TURN, crankAt(t));
  const tTree = tRoofLand + 0.5;
  const tGreen = tRoofLand + 0.9;
  const tGo = tRoofLand + 1.7;
  const tDone = tGo + 2;
  at(tRoofLand, { sound: playThump });
  at(tRoofLand + 0.08, { sound: playClonk });
  at(tTree, { sound: playPop });
  at(tTree + 0.15, { sound: playTwinkle });
  at(tTree + 0.25, { say: { de: "Hurra! Das Dach ist drauf!", ru: "Ура! Крыша на месте!" } });
  at(tGreen, { sound: playDing });
  at(tGreen + 0.5, { sound: playBells });
  at(tGo - 0.3, { sound: playHonk });
  at(tGo, { sound: playEngine });
  at(tDone, { done: true });
  const truckGone = (t: number) => (t < tGo ? 0 : 0.5 * 240 * (t - tGo) ** 2);

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tKnock) return marbleAt(t).pt.x;
    if (t < tHit) return Math.max(marbleAt(t).pt.x, ballAt(t).x);
    if (t < tPush) return TOWER.x + 150;
    if (t < tCrank) return spoolAt(t).pt.x;
    if (t < tRoofLand) return WINCH.x - WINCH.arm - 110 + 672;
    return (HOUSE.x0 + HOUSE.x1) / 2 + 300;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    tVial,
    tChute,
    tRelease,
    tHit,
    tCrank,
    tRoofLand,
    tTree,
    tGreen,
    drumAngle,
    beltTravel,
    cleatPhase,
    marbleAt,
    coneAngle,
    ballAt,
    ropeEnd,
    towerAngle,
    spoolAt,
    cableLeft,
    crankAt,
    roofDrop,
    truckGone,
    cameraTarget,
  };
}
