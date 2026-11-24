// The building site ("Baustelle"), a Rube Goldberg machine on a construction
// site: one tap starts the motors, and one thing sets off the next for about
// a minute until the tower crane sets the roof on the new house: mixer,
// spirit level, rubble chute, conveyor belt, traffic cone, wrecking ball, brick
// tower, cable drum – which plops into a sand pile and bonks the excavator awake –
// excavator (digs a scoop, swings round, tips it out, pats the roller), road
// roller (puffs off and presses the sand into a road), jackhammer (rattles and
// hops onto the generator's start button), generator (its spark runs along the
// cable), pile driver (thumps a post in three times, and the last thump makes a
// concrete pipe jump off its chocks), the pipe (rolls through a puddle and
// pushes a ladder's foot), the ladder (lifts a cement sack off the brick stack
// onto the winch's crank), winch, crane.
// Everything is worked out ahead as a function of the seconds since the tap,
// so BuildingLevel.tsx only asks where each thing is at a moment. Coordinates
// are those of the site, 8520 × 900; the screen shows 1600 of it at a time.
import {
  playBlub,
  playBoing,
  playClick,
  playClonk,
  playCreak,
  playCrunch,
  playDing,
  playDrum,
  playKnock,
  playPlop,
  playPop,
  playPuff,
  playRattle,
  playRumble,
  playThump,
  playTick,
  playTrickle,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { playBells, playEngine, playHonk, playSplash } from "@/lib/realSounds";
import { wobble, decay } from "./level";
import {
  along,
  beside,
  cameraOn,
  distAt,
  easeIn,
  easeInOut,
  easeOut,
  GRAVITY,
  hop,
  lerp,
  pathOf,
  rad,
  roll,
  seg,
  STEP,
  timeline,
  timeWhen,
  turn,
  hump,
} from "./machineKit";
import { arc, BALL_R, line, quad, type Pt } from "./path";

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

/** The sand pile below the deck's end that the cable drum drops into: its middle, half its width and its height. */
export const PILE = { x: 3130, w: 140, h: 90, dug: 70 };
/** The top of a sand heap `h` high, `w` either side of `x`, at `at` (the floor beyond its feet). */
export const moundY = (x: number, w: number, h: number, at: number) => {
  const u = (at - x) / w;
  return Math.abs(u) >= 1 ? FLOOR : FLOOR - h * (1 - u * u) ** 2;
};

/** The excavator: the middle of its turntable on top of its tracks, and how far the tracks reach either side. */
export const EXC = { x: 3440, y: FLOOR - 58, track: 106 };
/**
 * Its arm, in the excavator's own frame (facing right, the turntable's middle at 0 0): the boom's shoulder, the
 * boom's and the stick's lengths. Facing left, the frame is mirrored.
 */
export const ARM = { s: { x: 50, y: -62 }, boom: 250, stick: 200 };
/** The scoop, from the wrist: its mouth runs `mouth` forward, its bowl hangs `deep` below the mouth. */
export const SCOOP = { mouth: 56, deep: 57 };

/** The road roller: its drum's middle at the start (x) and the drum's radius; its roof's top, and the spot it is patted on. */
export const ROLLER = { x0: 3730, drum: 52, roof: FLOOR - 215, patX: -110 };
/** The scoop of sand the excavator tips in front of the roller. */
export const HEAP = { x: 3880, w: 66, h: 54 };

/** The jackhammer standing in the roller's way: where its chisel stands on the ground, and how wide its body is. */
export const JACK = { x: 4250, w: 36, h: 112 };

/**
 * The generator beside the jackhammer, on wheels: its body `w` wide and `h` high, standing `wheelR` above the ground; the
 * jackhammer's last hop lands on its start button, at `button` from its middle, which goes down `press` when pressed.
 */
export const GEN = { x: 4560, w: 150, h: 96, wheelR: 16, button: -30, buttonR: 14, press: 8 };
/** The top of the generator's start button, where the jackhammer's chisel lands. */
export const BUTTON_TOP = { x: GEN.x + GEN.button, y: FLOOR - GEN.wheelR - GEN.h - 12 };
/**
 * The pile driver the generator's cable powers: its mast at x up to `top`; its heavy ram (`ram` wide, `ramH` high)
 * rises to `lift` and drops onto the post, `post` wide, whose top starts at `post0` and goes `sink` deeper at each thump.
 */
export const DRIVER = { x: 4920, top: 300, ram: 78, ramH: 92, lift: 390, post: 40, post0: FLOOR - 120, sink: 32 };
/** How many times the ram comes down. */
export const THUMPS = 3;
/** The concrete pipe lying on two chocks beside the pile driver; the third thump makes it jump over the right one and roll off. */
export const PIPE = { x: 5080, r: 46, chock: 16 };
/** A puddle on the way, which the pipe rolls through. */
export const PUDDLE = { x: 5560, w: 170 };
/** The stack of brick pallets with a cement sack on top; the ladder leans against its left side. */
export const STACK = { x0: 6220, x1: 6340, top: 540 };
/** The ladder: its foot on the ground `len` from its top, which rests at the stack's top left corner. */
export const LADDER = { len: 300, foot: STACK.x0 - Math.sqrt(300 ** 2 - (FLOOR - STACK.top) ** 2), w: 34, push: 60 };
/** The cement sack lying on the stack, hanging out over its left side a little, so the ladder's top is under it. */
export const SACK = { w: 104, h: 46, x0: STACK.x0 - 16 };

/** Everything from the winch on stands this much further right than before the excavator, the roller and the pile driver came. */
export const SHIFT = STACK.x1 + 190 - 3110;

/** The winch at the crane's foot: its drum lets out the crane rope as its crank turns. */
export const WINCH = { x: 3110 + SHIFT, y: 712, drum: 26, arm: 66, knob: 9 };

/** The tower crane; its rope runs from the winch round the foot and top pulleys and along the jib to the trolley. */
export const CRANE = { x: 3420 + SHIFT, jibTop: 96, jibY: 120, end: 4400 + SHIFT, back: 3160 + SHIFT, apexY: 36 };
export const FOOT_PULLEY = { x: 3380 + SHIFT, y: 724, r: 14 };
export const TOP_PULLEY = { x: 3380 + SHIFT, y: 108, r: 12 };
export const TROLLEY_X = 4020 + SHIFT;

export const HOUSE = { x0: 3770 + SHIFT, x1: 4270 + SHIFT, top: 540 };
/** The roof hangs from the crane hook by an eye on its top and comes down `drop` onto the walls. */
export const ROOF = { w: 580, h: 150, drop: 200 };
/** Turns of the winch drum while the roof comes down, in radians. */
const CRANK_TURN = ROOF.drop / WINCH.drum;

export const LIGHT_X = 4480 + SHIFT;
export const TRUCK_X = 4560 + SHIFT;
/** How far the truck drives off before it stops counting: well past the world's right edge, even on the widest screen. */
const TRUCK_GONE = 4000;

export const WORLD_W = 5100 + SHIFT;

/* ---------- Helpers ---------- */

/** Seconds into a free fall from rest until it has dropped `h`. */
const fallTime = (h: number) => Math.sqrt((2 * h) / GRAVITY);

/** A spot `d` along the mixer drum's middle line at `angle` degrees. */
export function inDrum(d: number, angle: number): Pt {
  return { x: MIXER.x + d * Math.cos(rad(angle)), y: MIXER.y + d * Math.sin(rad(angle)) };
}

/** The winch crank's knob when the crank has turned `turned` radians (it starts pointing left and turns down). */
export function crankKnob(turned: number): Pt {
  const a = Math.PI - turned;
  return { x: WINCH.x + WINCH.arm * Math.cos(a), y: WINCH.y + WINCH.arm * Math.sin(a) };
}

/** The excavator's arm reaching its wrist for `w` (in its own frame): the elbow stays up, as on a real excavator. */
export function reachFor(w: Pt): { e: Pt; w: Pt } {
  const { s, boom, stick } = ARM;
  const d = Math.min(boom + stick - 1, Math.max(Math.abs(boom - stick) + 1, Math.hypot(w.x - s.x, w.y - s.y)));
  const phi = Math.atan2(w.y - s.y, w.x - s.x);
  const b = phi - Math.acos((boom * boom + d * d - stick * stick) / (2 * boom * d));
  return { e: { x: s.x + boom * Math.cos(b), y: s.y + boom * Math.sin(b) }, w: { x: s.x + d * Math.cos(phi), y: s.y + d * Math.sin(phi) } };
}

/** A spot of the scoop (`p` in the scoop's own frame: the wrist at 0 0, mouth up along +x) turned `cup` degrees, in the excavator's frame. */
export const onScoop = (w: Pt, cup: number, p: Pt): Pt => turnAround({ x: w.x + p.x, y: w.y + p.y }, w, rad(cup));

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

  /**
   * How far the belt has moved: it speeds up for a moment, then runs steadily until the marble has left it, and then
   * slows down and stands, so it doesn't keep the phone painting it for the rest of the minute.
   */
  const ACC = 0.4;
  const STOP = 0.8;
  /** When the belt starts to slow down: set once the marble's time off the belt is known. */
  let tSlow = Number.POSITIVE_INFINITY;
  const running = (u: number) => (u < ACC ? (BELT.speed * u * u) / (2 * ACC) : BELT.speed * (u - ACC / 2));
  const beltTravel = (t: number) => {
    const u = t - tBelt;
    if (u <= 0) return 0;
    if (t <= tSlow) return running(u);
    const v = Math.min(t - tSlow, STOP);
    return running(tSlow - tBelt) + BELT.speed * (v - (v * v) / (2 * STOP));
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
  /** How far the mixer's drum has turned (its stripes run round): from the tap until the marble is out on the level, then it slows down and stands. */
  const drumSpin = (t: number) => {
    if (t <= 0) return 0;
    if (t <= tLevel) return t;
    const v = Math.min(t - tLevel, STOP);
    return tLevel + v - (v * v) / (2 * STOP);
  };
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
  tSlow = tOff + 0.3;
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
    const amp = 0.22 * decay(age * 0.8);
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

  /* The cable drum rolls along the deck unrolling its cable, over the edge, plop into the sand pile, over it and bonk against the excavator's tracks. */
  const edge = { x: DECK2.x1, y: DECK2.y };
  const spoolRun = roll(pathOf(line({ x: SPOOL_X0, y: spoolY }, { x: edge.x, y: spoolY }), arc(edge.x, edge.y, SPOOL.r, -90, -56)), 470, 150, 600, 0.45);
  const tEdge = tPush + spoolRun.duration;
  const spoolOff = spoolRun.path.pts[spoolRun.path.pts.length - 1];
  // The drum's middle rolling over the pile: the pile's top lifted by the drum's radius, never below the floor.
  const LAND_X = 3075;
  const STOP_X = EXC.x - EXC.track - SPOOL.r - 2;
  const surface: Pt[] = [];
  for (let x = LAND_X - 40; x <= PILE.x + PILE.w + 40; x += 5) surface.push({ x, y: moundY(PILE.x, PILE.w, PILE.h, x) });
  const overPile: Pt[] = [];
  for (const p of beside(surface, -SPOOL.r)) {
    const q = { x: p.x, y: Math.min(p.y, FLOOR - SPOOL.r) };
    if (q.x >= LAND_X && q.x < STOP_X && q.x > (overPile[overPile.length - 1]?.x ?? -1)) overPile.push(q);
  }
  overPile.push({ x: STOP_X, y: FLOOR - SPOOL.r });
  const spoolDrop = toss(spoolOff, 150, overPile[0]);
  const tPlof = tEdge + spoolDrop.T;
  const pileRun = roll(pathOf(overPile), 200, 70, 420, 0.5);
  const tBonk = tPlof + pileRun.duration;
  at(tPush + 0.2, { sound: playRumble });
  at(tPlof, { sound: playPlop });
  at(tBonk, { sound: playClonk });

  const spoolAt = (t: number): { pt: Pt; turned: number } => {
    const start = { x: SPOOL_X0, y: spoolY };
    if (t < tPush) return { pt: start, turned: 0 };
    if (t < tEdge) {
      const d = distAt(spoolRun, t - tPush);
      return { pt: along(spoolRun.path, d).pt, turned: d };
    }
    const rolled = spoolRun.path.total;
    const flown = spoolDrop.T * 150;
    if (t < tPlof) return { pt: spoolDrop.at(t - tEdge), turned: rolled + (t - tEdge) * 150 };
    if (t < tBonk) {
      const d = distAt(pileRun, t - tPlof);
      return { pt: along(pileRun.path, d).pt, turned: rolled + flown + d };
    }
    // It bounces back a little off the tracks and stays there.
    const back = 14 * easeOut(seg(t, tBonk, tBonk + 0.4));
    return { pt: { x: STOP_X - back, y: FLOOR - SPOOL.r }, turned: rolled + flown + pileRun.path.total - back };
  };
  /** How much of the cable is still on the drum, from 1 down to a little. */
  const cableLeft = (t: number) => 1 - 0.75 * seg(spoolAt(t).pt.x, SPOOL_X0, STOP_X);
  /** Sand puffing up where the drum plopped into the pile, `age` seconds after. */
  const plofAge = (t: number) => t - tPlof;

  /* The excavator wakes up with a shudder and three puffs, digs a scoop out of the pile, swings round and tips it in front of the roller, then pats the roller's roof. */
  const tWake = tBonk;
  at(tWake + 0.1, { sound: playEngine });
  const exhaust = [0.15, 0.45, 0.75].map((d) => tWake + d);
  for (const p of exhaust) at(p, { sound: playPuff });
  /** The wrist's spots in the excavator's own frame, facing right (facing left, the pile lies at +x too). */
  const REST = { x: 150, y: -150 };
  const HOVER = { x: EXC.x - PILE.x - 10, y: -100 };
  const DIG = { x: EXC.x - PILE.x - 10, y: -8 };
  const CURLED = { x: EXC.x - PILE.x - 40, y: -22 };
  const CARRY = { x: 170, y: -235 };
  // Tipped over, the scoop's mouth hangs about 24 back from the wrist: the sand falls from there onto the heap.
  const TIP = 150;
  const mouthMid = onScoop({ x: 0, y: 0 }, TIP, { x: SCOOP.mouth / 2, y: 0 });
  const OVER = { x: HEAP.x - EXC.x - mouthMid.x, y: -72 };
  // Patting the roof with the scoop's round bottom.
  const PAT = { x: ROLLER.x0 + ROLLER.patX - EXC.x - SCOOP.mouth * 0.4, y: ROLLER.roof - EXC.y - SCOOP.deep };
  const ABOVE_ROOF = { x: PAT.x, y: PAT.y - 45 };
  const LIFTED = { x: OVER.x - 40, y: -250 };
  const UP = { x: 120, y: -262 };
  const t0 = tWake + 0.7;
  const tDig = t0 + 1.4;
  const tSwing = t0 + 2.8;
  const tSwung = tSwing + 1.4;
  const tTip = tSwung + 0.9;
  const tPat = tTip + 1.8;
  const keys: { at: number; w: Pt; cup: number }[] = [
    { at: t0, w: REST, cup: 40 },
    { at: t0 + 0.9, w: HOVER, cup: 100 },
    { at: tDig, w: DIG, cup: 100 },
    { at: tDig + 0.6, w: CURLED, cup: 0 },
    { at: tSwing, w: CARRY, cup: 0 },
    { at: tSwung, w: CARRY, cup: 0 },
    { at: tSwung + 0.5, w: { x: OVER.x, y: -200 }, cup: 0 },
    { at: tTip, w: OVER, cup: 0 },
    { at: tTip + 0.5, w: OVER, cup: TIP },
    { at: tTip + 0.9, w: OVER, cup: TIP },
    { at: tTip + 1.3, w: LIFTED, cup: 60 },
    { at: tPat - 0.3, w: ABOVE_ROOF, cup: 0 },
    { at: tPat, w: PAT, cup: 0 },
    { at: tPat + 0.3, w: ABOVE_ROOF, cup: 0 },
    { at: tPat + 1.1, w: UP, cup: 20 },
  ];
  at(t0, { sound: playWhirr });
  at(tDig, { sound: playCrunch });
  at(tDig + 0.6, { sound: playWhirr });
  at(tSwing, { sound: playCreak });
  at(tSwing + 0.5, { sound: playRumble });
  at(tTip, { sound: playWhirr });
  at(tTip + 0.2, { sound: playTrickle });
  at(tTip + 0.75, { sound: playPlop });
  at(tPat, { sound: playBoing });

  /** The excavator at a moment: which way its top faces (−1 left … 1 right), its shudder, its arm (own frame) and whether the scoop holds sand. */
  const excavatorAt = (t: number) => {
    const last = keys[keys.length - 1];
    let pose = { w: t >= last.at ? last.w : keys[0].w, cup: t >= last.at ? last.cup : keys[0].cup };
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (t < a.at || t >= b.at) continue;
      const k = easeInOut(seg(t, a.at, b.at));
      pose = { w: { x: lerp(a.w.x, b.w.x, k), y: lerp(a.w.y, b.w.y, k) }, cup: lerp(a.cup, b.cup, k) };
    }
    const { e, w } = reachFor(pose.w);
    const face = -Math.cos(Math.PI * easeInOut(seg(t, tSwing, tSwung)));
    // Waking up it shudders hard, working it hums along, and once its arm is up after the pat it goes quiet over a
    // second: humming for ever, it kept an old phone painting in every frame (perf, A-36).
    const hum = 1 - seg(t, last.at, last.at + 1);
    const shake = t < tWake ? 0 : t < t0 ? 4 * Math.sin((t - tWake) * 55) * (1 - seg(t, tWake + 0.4, t0)) : hum > 0 ? 0.8 * hum * Math.sin(t * 47) : 0;
    return { face, shake, e, w, cup: pose.cup, full: t >= tDig + 0.35 && t < tTip + 0.45 };
  };
  /** The wrist in site coordinates. */
  const wristAt = (t: number): Pt => {
    const { face, w } = excavatorAt(t);
    return { x: EXC.x + face * w.x, y: EXC.y + w.y };
  };
  /** How high the sand pile is: a scoop less once it is dug. */
  const pileH = (t: number) => lerp(PILE.h, PILE.dug, easeOut(seg(t, tDig, tDig + 0.6)));
  /** How high the tipped sand heap is, as it pours out. */
  const heapH = (t: number) => HEAP.h * easeOut(seg(t, tTip + 0.2, tTip + 0.85));
  /** How far into the pour the falling sand is (0 … 1), or −1 when nothing falls. */
  const pourAt = (t: number) => (t < tTip + 0.15 || t > tTip + 0.85 ? -1 : seg(t, tTip + 0.15, tTip + 0.85));

  /* The road roller: patted on its roof, it squashes, puffs three times and rolls off over the sand, pressing it flat into a road, until its drum bumps the jackhammer. */
  const tRollerGo = tPat + 0.8;
  const ROLL_V = 125;
  const ROLL_ACC = 0.6;
  const rollDist = JACK.x - JACK.w / 2 - ROLLER.drum - ROLLER.x0;
  const tJack = tRollerGo + ROLL_ACC / 2 + rollDist / ROLL_V;
  const chimney = [0.15, 0.45, 0.75].map((d) => tPat + d);
  for (let p = tRollerGo + 0.6; p < tJack; p += 0.8) chimney.push(p);
  for (const p of chimney) at(p, { sound: playPuff });
  at(tRollerGo, { sound: playRumble });
  at(tRollerGo + 1.6, {
    say: {
      de: "Die Walze macht alles platt!",
      en: "The roller flattens everything!",
      zh: "压路机把一切都压平啦！",
      hi: "रोलर सब कुछ चपटा कर देता है!",
      es: "¡La aplanadora lo deja todo plano!",
      ar: "المدحلة تجعل كل شيء مسطّحًا!",
      ru: "Каток всё укатывает!",
    },
  });
  at(tJack, { sound: () => playKnock(500) });
  const rolled = (t: number) => {
    const u = t - tRollerGo;
    if (u <= 0) return 0;
    if (t < tJack) return u < ROLL_ACC ? (ROLL_V * u * u) / (2 * ROLL_ACC) : ROLL_V * (u - ROLL_ACC / 2);
    // It stops at the bump and rocks back a little.
    return rollDist - 10 * hump(seg(t, tJack, tJack + 0.5));
  };
  /** The heap's top at `x` where the drum hasn't flattened it yet. */
  const heapY = (t: number, x: number) => (x < ROLLER.x0 + rolled(t) ? FLOOR : moundY(HEAP.x, HEAP.w, heapH(t), x));
  /** The roller at a moment: its drum's middle (x), how high it rides on the sand, how far it has rolled, its squash from the pat. */
  const rollerAt = (t: number) => {
    const x = ROLLER.x0 + rolled(t);
    const lift = (FLOOR - moundY(HEAP.x, HEAP.w, heapH(t), x + ROLLER.drum * 0.4)) * 0.7;
    const squash = t < tPat ? 0 : wobble(t - tPat, 0.12, 22, 5);
    const jiggle = t < tPat + 0.1 || t > tJack + 0.5 ? 0 : 1.2 * Math.sin(t * 40);
    return { x, lift: lift + jiggle, turned: rolled(t), squash };
  };
  /** Where the flat new road reaches: from the heap's left foot to just behind the drum. */
  const roadTo = (t: number) => Math.max(HEAP.x - HEAP.w, ROLLER.x0 + rolled(t) - ROLLER.drum * 0.3);

  /* The jackhammer switches on, rattles and hops along to the generator, and its last hop lands on its start button. */
  const tStart = tJack + 0.35;
  const HOPS = 3;
  const HOP_T = 0.42;
  const hopFrom = (i: number): Pt => ({ x: lerp(JACK.x, BUTTON_TOP.x, i / HOPS), y: FLOOR });
  const tButton = tStart + (HOPS - 1) * HOP_T + 0.55;
  at(tJack + 0.1, { sound: playRattle });
  for (let i = 1; i < HOPS; i++) at(tStart + i * HOP_T, { sound: () => playKnock(1000 + i * 150) });
  at(tStart + HOP_T, { sound: playRattle });
  /** How far the start button is pressed down. */
  const buttonAt = (t: number) => GEN.press * (easeOut(seg(t, tButton, tButton + 0.15)) - easeIn(seg(t, tButton + 0.45, tButton + 0.6)));
  const restX = GEN.x - GEN.w / 2 - 60;
  const tRest = tButton + 0.3 + 0.4;
  at(tButton, { sound: playClick });
  at(tRest, { sound: playThump });

  /** The jackhammer at a moment: where its chisel's tip is, its lean (radians, clockwise) and its rattling shake. */
  const jackAt = (t: number): { tip: Pt; lean: number; buzz: number } => {
    const rattling = t >= tJack + 0.1 && t < tRest;
    const buzz = rattling ? 2.5 * Math.sin(t * 90) : 0;
    if (t < tStart) return { tip: { x: JACK.x, y: FLOOR }, lean: rad(wobble(t - tJack, 9, 18, 4)), buzz };
    if (t < tButton - 0.55) {
      const i = Math.floor((t - tStart) / HOP_T);
      const k = seg(t, tStart + i * HOP_T, tStart + (i + 1) * HOP_T);
      return { tip: hop(hopFrom(i), hopFrom(i + 1), 34, k), lean: rad(8 * Math.sin(k * Math.PI)), buzz };
    }
    if (t < tButton) return { tip: hop(hopFrom(HOPS - 1), BUTTON_TOP, 120, seg(t, tButton - 0.55, tButton)), lean: 0, buzz };
    const pressed = { x: BUTTON_TOP.x, y: BUTTON_TOP.y + buttonAt(Math.min(t, tButton + 0.3)) };
    if (t < tButton + 0.3) return { tip: pressed, lean: 0, buzz };
    // Off the button, down onto the ground beside the generator, where it stands still.
    const k = seg(t, tButton + 0.3, tRest);
    return { tip: hop(pressed, { x: restX, y: FLOOR }, 40, k), lean: -rad(20) * Math.sin(Math.PI * k) + rad(wobble(t - tRest, 8, 16, 4)), buzz };
  };

  /* The generator starts with a few puffs; a spark runs along its cable to the pile driver. */
  const tPower = tButton + 0.5 + 1.2;
  const genPuffs = [0.15, 0.4, 0.65, 1.1, 1.6].map((d) => tButton + d);
  for (const p of genPuffs) at(p, { sound: playPuff });
  at(tButton + 0.2, { sound: playRumble });
  at(tButton + 0.5, { sound: playWhirr });
  /** How far along its cable the spark is (0 … 1), or null when there is none. */
  const sparkAt = (t: number) => (t < tButton + 0.5 || t > tPower ? null : seg(t, tButton + 0.5, tPower));

  /* The pile driver: its ram climbs the mast, ticking, and drops onto the post three times; the post sinks a bit each time. */
  const LIFT = 1.8;
  const HOLD = 0.2;
  const AFTER = 0.4;
  const postTop = (n: number) => DRIVER.post0 + n * DRIVER.sink;
  const ramDrop = (n: number) => fallTime(postTop(n) - DRIVER.lift);
  const lifts: number[] = [];
  const thumps: number[] = [];
  let tCycle = tPower + 0.2;
  for (let n = 0; n < THUMPS; n++) {
    lifts.push(tCycle);
    const tThump = tCycle + LIFT + HOLD + ramDrop(n);
    thumps.push(tThump);
    tCycle = tThump + AFTER;
  }
  const tLastThump = thumps[THUMPS - 1];
  lifts.forEach((t0) => {
    for (let k = 0; k < 5; k++) at(t0 + 0.1 + k * 0.36, { sound: playTick });
  });
  thumps.forEach((t, n) => {
    at(t - ramDrop(n) + 0.05, { sound: playWhoosh });
    at(t, { sound: playThump });
    at(t + 0.05, { sound: playCrunch });
  });
  /** Where the bottom of the ram is, and how far the post has sunk (thumps so far, 0 … THUMPS). */
  const driverAt = (t: number): { ram: number; sunk: number } => {
    let sunk = 0;
    for (let n = 0; n < THUMPS; n++) {
      if (t >= thumps[n]) sunk = n + 1 - (1 - easeOut(seg(t, thumps[n], thumps[n] + 0.12)));
    }
    for (let n = THUMPS - 1; n >= 0; n--) {
      if (t < lifts[n]) continue;
      const top = thumps[n] - ramDrop(n);
      if (t < lifts[n] + LIFT) return { ram: lerp(postTop(n), DRIVER.lift, easeInOut(seg(t, lifts[n], lifts[n] + LIFT))), sunk };
      if (t < top) return { ram: DRIVER.lift, sunk };
      if (t < thumps[n]) return { ram: DRIVER.lift + 0.5 * GRAVITY * (t - top) ** 2, sunk };
      return { ram: DRIVER.post0 + sunk * DRIVER.sink, sunk };
    }
    return { ram: DRIVER.post0, sunk: 0 };
  };
  /** Whether the generator is running: from the button until the last thump. */
  const genRunning = (t: number) => t > tButton + 0.15 && t < tLastThump + 0.6;
  /** Puffs of dust round the post's top at every thump, and of smoke from the generator. */
  const dust = thumps.flatMap((t, n) => [-1, 1].map((side) => ({ x: DRIVER.x + side * 46, y: postTop(n + 1), t: t + 0.02 * (side + 1) })));

  /* The third thump makes the pipe jump over its chock; it rolls off through the puddle into the ladder's foot. */
  const pipeY = FLOOR - PIPE.r;
  const tJump = tLastThump + 0.05;
  const JUMP_T = 0.4;
  const pipeFrom = PIPE.x + 46;
  const pipeTo = LADDER.foot - LADDER.w / 2 - PIPE.r;
  const pipePath = pathOf(line({ x: pipeFrom, y: pipeY }, { x: pipeTo, y: pipeY }));
  const pipeRun = roll(pipePath, 150, 150, 300, 0.2);
  const tPipeGo = tJump + JUMP_T;
  const tFoot = tPipeGo + pipeRun.duration;
  const tSplash = tPipeGo + timeWhen(pipeRun, (pt) => pt.x >= PUDDLE.x - PUDDLE.w / 4);
  at(tJump, { sound: playBoing });
  at(tPipeGo, { sound: playRumble });
  at(tSplash, { sound: playSplash });
  at(tFoot, { sound: () => playKnock(800) });

  /* The pipe pushes the ladder's foot along; the ladder stands up steeper and its top lifts the sack, which tips off the stack onto the crank's knob. */
  const PUSH_T = 0.6;
  const tPushed = tFoot + PUSH_T;
  /** How far the ladder's foot has been pushed. */
  const footAt = (t: number) => LADDER.push * easeOut(seg(t, tFoot, tPushed));
  const pipeX = (t: number) => {
    if (t < tJump) return PIPE.x;
    if (t < tPipeGo) return lerp(PIPE.x, pipeFrom, seg(t, tJump, tPipeGo));
    if (t < tFoot) return along(pipePath, distAt(pipeRun, t - tPipeGo)).pt.x;
    return pipeTo + footAt(t) - 12 * hump(seg(t, tPushed, tPushed + 0.5));
  };
  /** The concrete pipe: its middle and how far it has turned (radians). */
  const pipeAt = (t: number): { pt: Pt; turned: number } => {
    const x = pipeX(t);
    const k = seg(t, tJump, tPipeGo);
    return { pt: { x, y: pipeY - 4 * PIPE.chock * 1.6 * k * (1 - k) }, turned: (x - PIPE.x) / PIPE.r };
  };
  /** Where the ladder's top rests against the stack. */
  const ladderTop = (t: number): Pt => {
    const foot = LADDER.foot + footAt(t);
    return { x: STACK.x0, y: FLOOR - Math.sqrt(LADDER.len ** 2 - (STACK.x0 - foot) ** 2) };
  };
  const ladderAt = (t: number) => ({ foot: { x: LADDER.foot + footAt(t), y: FLOOR }, top: ladderTop(t) });
  /** Splashes of the puddle as the pipe goes through. */
  const splashAt = (t: number): Pt[] => {
    const age = t - tSplash;
    if (age < 0 || age > 0.9) return [];
    return Array.from({ length: 9 }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      const vx = side * (90 + 160 * ((i * 0.618) % 1));
      const vy = -(260 + 200 * ((i * 0.37) % 1));
      return { x: PUDDLE.x + side * 20 + vx * age, y: FLOOR - 6 + vy * age + 0.5 * GRAVITY * age * age };
    }).filter((p) => p.y < FLOOR - 2);
  };

  /* The sack: lifted at its left end, it tips over its right edge, falls onto the crank's knob and rides it down. */
  const lifted = (t: number) => ladderTop(0).y - ladderTop(t).y;
  const tipPivot = { x: SACK.x0 + SACK.w, y: STACK.top };
  const tSackOff = tPushed;
  const SACK_FALL = 0.55;
  const tCrank = tSackOff + SACK_FALL;
  const knobTop = (turned: number, lean = 0) => {
    const k = crankKnob(turned);
    return { x: k.x - WINCH.knob * Math.sin(lean), y: k.y - WINCH.knob * Math.cos(lean) };
  };
  at(tFoot + 0.1, { sound: playCreak });
  at(tSackOff, { sound: playWhoosh });

  /* The sack's weight pushes the crank round, and the roof's weight keeps it going. */
  const PUSH = 0.65;
  const tRoofLand = tCrank + 6;
  /** How far the crank has turned: the sack pushes it round a bit, then the roof's weight keeps it going. */
  const crankAt = (t: number) => PUSH * easeOut(seg(t, tCrank, tCrank + 0.3)) + (CRANK_TURN - PUSH) * easeInOut(seg(t, tCrank + 0.2, tRoofLand));
  const sackRest = { x: WINCH.x - WINCH.arm - 52, y: FLOOR };
  const tSackDown = tCrank + 0.3 + 0.4;
  at(tCrank, { sound: playClonk });
  at(tCrank + 0.05, { sound: playThump });
  at(tSackDown, { sound: playPlop });
  at(tCrank + 0.4, { sound: playCreak });
  for (let k = 0; k < 4; k++) at(tCrank + 0.9 + k * 1.3, { sound: playTick });

  /** The cement sack: the middle of its bottom and how far it is turned (radians, clockwise). */
  const sackAt = (t: number): { pt: Pt; angle: number } => {
    const rest = { x: SACK.x0 + SACK.w / 2, y: STACK.top };
    if (t < tFoot) return { pt: rest, angle: 0 };
    // Its left end goes up with the ladder's top: it turns round its bottom right corner.
    const tilt = Math.atan2(lifted(Math.min(t, tSackOff)), SACK.w);
    const tilted = turn(rest, tipPivot, -tilt);
    if (t < tSackOff) return { pt: tilted, angle: -tilt };
    if (t < tCrank) {
      const k = seg(t, tSackOff, tCrank);
      return { pt: hop(tilted, knobTop(0), 40, k), angle: lerp(-tilt, rad(18), k) };
    }
    const ride = seg(t, tCrank, tCrank + 0.3);
    const lean = rad(18) + rad(22) * ride;
    const ridden = knobTop(crankAt(Math.min(t, tCrank + 0.3)), 0);
    if (t < tCrank + 0.3) return { pt: ridden, angle: lean };
    // Off the knob, down onto the ground beside the winch.
    const k = seg(t, tCrank + 0.3, tSackDown);
    return { pt: hop(ridden, sackRest, 20, k), angle: lerp(rad(40), 0, easeOut(k)) };
  };

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
  at(tTree + 0.25, {
    say: {
      de: "Hurra! Das Dach ist drauf!",
      en: "Hooray! The roof is on!",
      zh: "好耶！屋顶盖好啦！",
      hi: "हुर्रे! छत लग गई!",
      es: "¡Hurra! ¡El tejado está puesto!",
      ar: "مرحى! السقف في مكانه!",
      ru: "Ура! Крыша на месте!",
    },
  });
  at(tGreen, { sound: playDing });
  at(tGreen + 0.5, { sound: playBells });
  at(tGo - 0.3, { sound: playHonk });
  at(tGo, { sound: playEngine });
  at(tDone, { done: true });
  /** How far the truck has driven off; it stops counting once it is past the world's right edge (`TRUCK_GONE`), where it drove on for ever. */
  const truckGone = (t: number) => (t < tGo ? 0 : Math.min(TRUCK_GONE, 0.5 * 240 * (t - tGo) ** 2));

  /** Where the camera looks: the thing that moves right now. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tKnock) return marbleAt(t).pt.x;
    if (t < tHit) return Math.max(marbleAt(t).pt.x, ballAt(t).x);
    if (t < tPush) return TOWER.x + 150;
    if (t < tBonk) return spoolAt(t).pt.x;
    // The pile, the excavator, the roller and the heap all at once.
    if (t < tRollerGo) return 3572;
    if (t < tStart) return Math.max(3572, rollerAt(t).x + 150);
    if (t < tButton) return Math.max(3572, rollerAt(t).x + 150, jackAt(t).tip.x + 150);
    // The generator, the pile driver and the pipe all at once.
    if (t < tPipeGo) return Math.max(BUTTON_TOP.x + 150, lerp(BUTTON_TOP.x + 150, DRIVER.x + 120, easeInOut(seg(t, tButton + 0.3, tPower))));
    if (t < tFoot) return Math.max(DRIVER.x + 120, pipeAt(t).pt.x + 150);
    // The ladder, the stack and the winch.
    if (t < tCrank + 0.5) return Math.max(DRIVER.x + 120, lerp(pipeTo + 150, STACK.x1 + 40, easeInOut(seg(t, tFoot - 0.6, tFoot + 0.6))));
    // The winch, the jackhammer resting beside it and the house all at once.
    if (t < tRoofLand) return Math.max(STACK.x1 + 40, lerp(STACK.x1 + 40, WINCH.x - 300 + 672, easeInOut(seg(t, tCrank + 0.5, tCrank + 1.5))));
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
    tPlof,
    tBonk,
    tDig,
    tSwing,
    tSwung,
    tTip,
    tPat,
    tRollerGo,
    tJack,
    tButton,
    tRest,
    tPower,
    lifts,
    thumps,
    tPipeGo,
    tSplash,
    tFoot,
    tSackOff,
    tCrank,
    tRoofLand,
    tTree,
    tGreen,
    drumAngle,
    beltTravel,
    drumSpin,
    cleatPhase,
    marbleAt,
    coneAngle,
    ballAt,
    ropeEnd,
    towerAngle,
    spoolAt,
    cableLeft,
    plofAge,
    exhaust,
    excavatorAt,
    wristAt,
    pileH,
    heapH,
    heapY,
    pourAt,
    chimney,
    rollerAt,
    roadTo,
    jackAt,
    buttonAt,
    genRunning,
    genPuffs,
    sparkAt,
    driverAt,
    dust,
    pipeAt,
    splashAt,
    ladderAt,
    sackAt,
    crankAt,
    roofDrop,
    truckGone,
    cameraTarget,
    width: WORLD_W,
  };
}
