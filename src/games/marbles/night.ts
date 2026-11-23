// The good-night machine ("Gute-Nacht-Maschine", R-07), a very calm Rube
// Goldberg machine in a children's room at dusk: one tap winds the music box,
// whose crank nudges a golden star ball down a zigzag gutter into a little
// basket; the star's weight pulls the cord that draws the curtain, and the
// curtain's edge gently pushes the backrest of the rocking chair in the reading
// corner. The chair tips forward, its backrest taps the pendulum of the cuckoo
// clock above it and then rocks on softly by itself. The pendulum ticks, the
// minute hand steps up to the full hour, the little door opens and the sleepy
// cuckoo slides out, calls a soft „kuckuck“ and yawns – leaning into the yawn,
// its beak pushes the arc lamp's pull chain: click, the light goes out. The
// cuckoo slides back in, and in the dark the hamster in its cage wakes up (a
// hamster's day begins at night): it trots to its water bottle, drinks and
// climbs into its wheel. Its running turns the pulley on the wheel's axle, whose
// rope loop draws a little toy cable car up the wall to the round window, where
// the car bumps the wooden shutter and it swings open. The moon rises there, its
// light creeps down over the cradle to the teddy, and everything falls asleep
// while the camera glides slowly back through the room.
// Soft sounds, a slow pace and no surprises only. Everything is worked out ahead
// as a function of the seconds since the tap, so NightLevel.tsx only asks where
// each thing is at a moment. Coordinates are those of the room, 4650 × 900; the
// screen shows 1600 of it at a time.

import { decay } from "./level";
import {
  playChimeNote,
  playClick,
  playCreak,
  playCurtain,
  playKnock,
  playMusicbox,
  playPlop,
  playRecorded,
  playSqueak,
  playTick,
  playTwinkle,
  playWhirr,
  playYawn,
} from "@/lib/sfx";
import { playCuckoo } from "@/lib/realSounds";
import { along, cameraOn, distAt, easeInOut, easeOut, hop, lerp, pathOf, rad, roll, seg, timeline, timeWhen, turn, hump } from "./machineKit";
import { arc, line, type Pt } from "./path";

/** The recording the hamster squeaks with, loaded when the level opens. */
export const NIGHT_SOUNDS = ["hamster"];
const squeak = () => playRecorded("hamster", playSqueak);

export const WORLD_W = 4650;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The shelf on the wall that the music box stands on. */
export const SHELF = { x0: 110, x1: 540, top: 250 };
/** The music box; the little carousel on its lid turns while it plays. */
export const MUSICBOX = { x0: 250, x1: 420, top: 160 };
/** Where the sheep on the carousel turns round, and how far from the pole it rides. */
export const CAROUSEL = { x: 335, y: MUSICBOX.top - 14, r: 58 };
/** The crank on the music box's right side: its axle and arm. */
export const CRANK = { x: 434, y: 205, len: 40, knob: 9 };

/** The star ball's size, and where it waits on the shelf, right of the crank. */
export const STAR_R = 24;
const START = { x: 492, y: SHELF.top - STAR_R };

/** The gutter's corners (where the star ball's middle runs) and the two turns at its ends. */
const LEG1_END = { x: 1180, y: 270 };
export const TURN1 = { x: 1180, y: 315, r: 45 };
const LEG2_END = { x: 700, y: 400 };
export const TURN2 = { x: 700, y: 445, r: 45 };
const LEG3_END = { x: 1400, y: 530 };
/** The three straight stretches of the gutter, as the star ball's middle runs along them. */
export const LEGS: [Pt, Pt][] = [
  [START, LEG1_END],
  [{ x: TURN1.x, y: TURN1.y + TURN1.r }, LEG2_END],
  [{ x: TURN2.x, y: TURN2.y + TURN2.r }, LEG3_END],
];

/** The little basket on its cord: its middle, and where its rim hangs before and after the star's weight pulls it down. */
export const BASKET = { x: 1510, rim0: 580, rim1: 730, w: 96, h: 52 };
/** The ceiling pulleys of the cord from the basket to the curtain. */
export const PULLEY1 = { x: BASKET.x, y: 40 };
export const PULLEY2 = { x: 2290, y: 40 };

/** The big window with the sunset, and the rail of its curtain. */
export const WINDOW = { x0: 1680, x1: 2180, top: 140, bottom: 560 };
export const RAIL = { x0: 1620, x1: 2300, y: 100 };
/** Where the curtain's front edge is when open and when closed. */
export const CURTAIN = { open: 1740, closed: 2240, bottom: 610 };

/** How far right the round window, the moon and the cradle moved when the reading corner came in. */
const CORNER = 250;

/**
 * The rocking chair in the reading corner, facing right, its backrest to the curtain: `x` is where its rockers touch the
 * floor (it rocks round that spot), `knob` the ball on top of the backrest, as an offset from there.
 */
export const CHAIR = { x: 2324, knob: { dx: -115, dy: -270 }, knobR: 12 };
/** The backrest's knob while the chair stands still. */
export const KNOB0: Pt = { x: CHAIR.x + CHAIR.knob.dx, y: FLOOR + CHAIR.knob.dy };
/** Where the knob is when the chair has tipped `angle` radians forward (negative: back). */
export const knobAt = (angle: number): Pt => turn(KNOB0, { x: CHAIR.x, y: FLOOR }, angle);
/** How far the chair has tipped forward while the curtain's edge at `edge` pushes its knob (0 before the edge gets there). */
export function chairPush(edge: number) {
  if (edge <= KNOB0.x - CHAIR.knobR) return 0;
  let lo = 0;
  let hi = 0.6;
  for (let i = 0; i < 30; i++) {
    const mid = (lo + hi) / 2;
    if (knobAt(mid).x - CHAIR.knobR < edge) lo = mid;
    else hi = mid;
  }
  return lo;
}
/** How far forward the chair tips once the curtain is shut: there its knob just touches the pendulum's bob. */
const TIP = chairPush(CURTAIN.closed);

/** The cuckoo clock's pendulum: its bob hangs right where the tipped chair's knob reaches. */
export const PENDULUM = { len: 120, bobR: 16, swing: rad(8), period: 0.8 };
const BOB0: Pt = { x: Math.round(knobAt(TIP).x + CHAIR.knobR + PENDULUM.bobR), y: Math.round(knobAt(TIP).y) };
/** The cuckoo clock on the wall above the chair: its middle, body and the pendulum's axle at the body's bottom. */
export const CLOCK = { x: BOB0.x, top: BOB0.y - PENDULUM.len - 130, bottom: BOB0.y - PENDULUM.len, w: 130 };
/** The cuckoo's little door above the dial (its middle). */
export const DOOR = { x: CLOCK.x, y: CLOCK.top + 32, w: 34, h: 38 };
/** The cuckoo's middle when hidden in the clock and when out on its perch, how far it scoots forward in its yawn, and where its beak is. */
export const BIRD = { inX: DOOR.x - DOOR.w / 2 - 30, outX: DOOR.x + DOOR.w / 2 + 24, y: DOOR.y + 8, lean: 40, beak: { dx: 27, dy: -11 } };

/** The arc floor lamp over the reading corner: its foot, and the shade hanging from the arc right of the cuckoo's door. */
export const LAMP = { base: BIRD.outX + 310, shade: { x: BIRD.outX + BIRD.beak.dx + 20 + 11, y: BIRD.y + BIRD.beak.dy - 70 - 90 }, shadeH: 90 };
/** The lamp's pull chain hangs from the shade's middle; its bead hangs at the cuckoo's beak, just out of reach until it yawns. */
export const CHAIN = { x: LAMP.shade.x, top: LAMP.shade.y + LAMP.shadeH, len: 70, bead: 11 };

/** How far right the round window, the moon and the cradle moved again when the hamster's nook came in. */
const NOOK = 1000;

/** The chest of drawers under the hamster's cage, and the cage on it (its tray's floor at `floor`). */
export const CHEST = { x0: 2830, x1: 3210, top: 650 };
export const CAGE = { x0: 2860, x1: 3180, top: 470, bottom: 650, floor: 630 };
/** The middle of the cage, where the camera looks while the hamster is up. */
const CAGE_MID = (CAGE.x0 + CAGE.x1) / 2;
/** Where the hamster sleeps on its bedding (its middle), and where its middle is on the cage's floor. */
export const BED = { x: 2975, y: 604 };
const GROUND = CAGE.floor - 20;
/** The hamster wheel on its stand, open towards us: its axle and the rim's radius. */
export const WHEEL = { x: 3100, y: 568, r: 60 };
/** Where the hamster's middle is when it runs at the bottom of its wheel. */
const RUNNER = { x: WHEEL.x, y: WHEEL.y + WHEEL.r - 25 };
/** Where it stands to drink (facing left), how far it rears up then, and where it stands before it climbs into the wheel. */
const DRINK_X = 2928;
const REAR = 0.45;
const WHEEL_FOOT = 3012;

/**
 * Where the hamster's nose is: its drawing faces right with the nose at (34, -4) from its middle and rears up round
 * its hind feet at (-20, 16); `face` -1 mirrors it.
 */
export function hamsterNose(h: { x: number; y: number; face: number; rear: number }): Pt {
  const p = turn({ x: 34, y: -4 }, { x: -20, y: 16 }, -h.rear);
  return { x: h.x + h.face * p.x, y: h.y + p.y };
}
/** The water bottle hanging inside the cage's left wall, its spout's tip right at the drinking hamster's nose. */
const SPOUT = hamsterNose({ x: DRINK_X, y: GROUND, face: -1, rear: REAR });
export const BOTTLE = { x0: 2868, x1: 2894, top: 500, bottom: 556, spout: { x: Math.round(SPOUT.x) - 2, y: Math.round(SPOUT.y) - 2 } };

/** The round window over the cradle, where the moon rises. */
export const ROUND_WINDOW = { x: 2950 + CORNER + NOOK, y: 260, r: 110 };
/** The wooden shutter over the round window: as big as the window with its frame, hinged at its right side. */
export const SHUTTER = { r: ROUND_WINDOW.r + 10, hingeX: ROUND_WINDOW.x + ROUND_WINDOW.r + 10, open: rad(78) };
/** The moon's middle at the bottom of its way (hidden below the window) and at the top. */
export const MOON = { x: 2975 + CORNER + NOOK, y0: 430, y1: 235, r: 46 };
/** Where the moonlight falling from the round window starts, across the window's lower part. */
export const BEAM_TOP = ROUND_WINDOW.y + 80;
/** The cradle on its rockers, and the teddy's head on its pillow. */
export const CRADLE = { x0: 2780 + CORNER + NOOK, x1: 3120 + CORNER + NOOK, top: 590, bottom: 730 };
export const TEDDY = { x: 2890 + CORNER + NOOK, y: 572 };

/**
 * The toy cable car's rope loop: round the pulley on the wheel's axle (`drive`, it turns with the wheel) and the
 * pulley on the wall left of the round window (`turn`). The car hangs from the upper strand by its hanger.
 */
export const ROPE = { drive: { x: WHEEL.x, y: WHEEL.y, r: 20 }, turn: { x: 4074, y: 221, r: 10 } };
/** The car: its hanger's length down from the rope, and its cabin's width and height below that. */
export const CAR = { hanger: 28, w: 72, h: 54 };
const ROPE_FROM: Pt = { x: ROPE.drive.x, y: ROPE.drive.y - ROPE.drive.r };
const ROPE_TO: Pt = { x: ROPE.turn.x, y: ROPE.turn.y - ROPE.turn.r };
const ROPE_LEN = Math.hypot(ROPE_TO.x - ROPE_FROM.x, ROPE_TO.y - ROPE_FROM.y);
/** Where the car's grip is on the upper strand, `s` along it from the drive pulley's top. */
export const gripAt = (s: number): Pt => ({
  x: ROPE_FROM.x + ((ROPE_TO.x - ROPE_FROM.x) * s) / ROPE_LEN,
  y: ROPE_FROM.y + ((ROPE_TO.y - ROPE_FROM.y) * s) / ROPE_LEN,
});
/** The middle of the cabin's right side, which bumps the shutter. */
export const carNose = (grip: Pt): Pt => ({ x: grip.x + CAR.w / 2, y: grip.y + CAR.hanger + CAR.h / 2 });
/** Where the car waits, its cabin just right of the cage, and where its nose touches the shut shutter. */
const CAR_START = (CAGE.x1 + 8 + CAR.w / 2 - ROPE_FROM.x) / ((ROPE_TO.x - ROPE_FROM.x) / ROPE_LEN);
const CAR_END = (() => {
  let lo = CAR_START;
  let hi = ROPE_LEN;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const n = carNose(gripAt(mid));
    if (Math.hypot(n.x - ROUND_WINDOW.x, n.y - ROUND_WINDOW.y) > SHUTTER.r) lo = mid;
    else hi = mid;
  }
  return lo;
})();

/* ---------- The machine ---------- */

/** How fast the crank turns, in degrees per second, and how long the music box plays (three times its tune). */
const CRANK_SPEED = 170;
const TUNE_S = 1.8;
const TUNES = 3;
/** How far the camera is from the room's left edge before the evening tour goes back there. */
const LAST_CAMERA = WORLD_W - 1600;

export type Night = ReturnType<typeof buildNight>;

export function buildNight() {
  const { at, sorted } = timeline();

  /* The music box: the crank turns while the tune plays three times, then slows down and stops. */
  for (let i = 0; i < TUNES; i++) at(i * TUNE_S, { sound: playMusicbox });
  const tSlow = TUNES * TUNE_S;
  /** How far the crank has turned since the tap, in degrees. */
  const crankTurn = (t: number) => {
    if (t <= 0) return 0;
    if (t < tSlow) return CRANK_SPEED * t;
    // Slows down evenly over two seconds.
    const d = Math.min(2, t - tSlow);
    return CRANK_SPEED * (tSlow + d - (d * d) / 4);
  };
  /** The crank's direction in degrees: up before the tap, then turning clockwise. */
  const crankAngle = (t: number) => -90 + crankTurn(t);
  const knobAt = (t: number): Pt => {
    const a = rad(crankAngle(t));
    return { x: CRANK.x + CRANK.len * Math.cos(a), y: CRANK.y + CRANK.len * Math.sin(a) };
  };
  /** The crank's knob touches the star ball: off it goes. */
  let tPush = 0;
  while (Math.hypot(knobAt(tPush).x - START.x, knobAt(tPush).y - START.y) > STAR_R + CRANK.knob) tPush += 0.01;

  /* The star ball rolls down the gutter, round its two turns, and hops into the basket. */
  const path = pathOf(
    line(LEGS[0][0], LEGS[0][1]),
    arc(TURN1.x, TURN1.y, TURN1.r, -90, 90),
    line(LEGS[1][0], LEGS[1][1]),
    arc(TURN2.x, TURN2.y, TURN2.r, 270, 90),
    line(LEGS[2][0], LEGS[2][1]),
  );
  const run = roll(path, 150, 150, 290, 0.5);
  const tTurn1 = tPush + timeWhen(run, (p) => p.x >= TURN1.x);
  const tTurn2 = tPush + timeWhen(run, (p, d) => d > path.total / 2 && p.x <= TURN2.x);
  const tLeg3 = tPush + timeWhen(run, (p, d) => d > path.total / 2 && p.y >= TURN2.y + TURN2.r - 1);
  const tEnd = tPush + run.duration;
  const tIn = tEnd + 0.5;
  at(tPush, { sound: playTwinkle });
  at(tTurn1, { sound: () => playChimeNote(4) });
  at(tTurn2, { sound: () => playChimeNote(2) });
  at(tIn, { sound: playPlop });

  /* The star's weight pulls the basket down slowly, and the cord draws the curtain shut. */
  const tSink = tIn + 0.3;
  const tShut = tSink + 3.2;
  const pull = (t: number) => easeInOut(seg(t, tSink, tShut));
  const basketRim = (t: number) => lerp(BASKET.rim0, BASKET.rim1, pull(t));
  /** Where the curtain's front edge is. */
  const curtainEdge = (t: number) => lerp(CURTAIN.open, CURTAIN.closed, pull(t));
  at(tSink, { sound: playCurtain });

  /** Where the star ball's middle is, and how far it has turned. */
  const landing = { x: BASKET.x, y: BASKET.rim0 + 12 };
  const starAt = (t: number): { pt: Pt; spin: number } => {
    if (t < tPush) return { pt: START, spin: 0 };
    if (t < tEnd) {
      const d = distAt(run, t - tPush);
      return { pt: along(path, d).pt, spin: d / STAR_R };
    }
    const spinEnd = path.total / STAR_R;
    if (t < tIn) return { pt: hop(LEG3_END, landing, 50, seg(t, tEnd, tIn)), spin: spinEnd + seg(t, tEnd, tIn) };
    return { pt: { x: landing.x, y: landing.y + basketRim(t) - BASKET.rim0 }, spin: spinEnd + 1 };
  };

  /*
   * The rocking chair: the curtain's edge pushes its knob for the last bit of the way, and when the curtain is shut the
   * chair has tipped just far enough for the knob to tap the cuckoo clock's pendulum. Then it rocks back and forth by
   * itself, softer and softer, and stands still when the level is over.
   */
  /** Seconds the chair takes to rock back and forth once, and how slowly its rocking dies away. */
  const ROCK_PERIOD = 2.8;
  const ROCK_FADE = 3.2;
  /** How far the chair has tipped forward, in radians (negative: back). */
  const chairAngle = (t: number) => {
    if (t < tShut) return chairPush(curtainEdge(t));
    const u = Math.min(t, tDone) - tShut;
    return TIP * decay(u / ROCK_FADE) * Math.cos((2 * Math.PI * u) / ROCK_PERIOD);
  };
  /** When the curtain's edge first touches the knob. */
  let tNudge = tSink;
  while (curtainEdge(tNudge) < KNOB0.x - CHAIR.knobR) tNudge += 0.01;
  at(tShut, { sound: () => playKnock(900) });
  [0.5, 1.5].forEach((k) => at(tShut + k * ROCK_PERIOD, { sound: playCreak }));

  /* The tap sets the pendulum swinging: tick, tack, and with every tick the minute hand steps up to the full hour. */
  const TICK = PENDULUM.period / 2;
  const TICKS = 12;
  /** How far the pendulum has swung to the right, in radians; it swings on until the level is over. */
  const pendulumAngle = (t: number) => {
    const u = Math.min(t, tDone) - tShut;
    return u <= 0 ? 0 : PENDULUM.swing * Math.sin((2 * Math.PI * u) / PENDULUM.period);
  };
  /** The minute hand in degrees from the top: a few minutes to seven, a step with every tick until it points up. */
  const minuteHand = (t: number) => 3 * (Math.min(TICKS, Math.max(0, Math.floor((t - tShut) / TICK))) - TICKS);
  [0, 1, 2].forEach((i) => at(tShut + TICK + i * 4 * TICK, { sound: playTick }));

  /* At the full hour the little door opens and the sleepy cuckoo slides out on its perch. */
  const tHour = tShut + TICKS * TICK + 0.2;
  const tOut = tHour + 0.4;
  const tOutEnd = tOut + 1.4;
  /** The cuckoo calls a soft, slow „kuckuck, kuckuck“, its beak opening with every note. */
  const tCall = tOutEnd + 0.3;
  const CALL_NOTES = [0, 0.3, 0.75, 1.05];
  /** Then it yawns, scoots forward into the yawn, and its beak pushes the lamp's pull chain: click, the light goes out. */
  const tBirdYawn = tCall + 1.7;
  const YAWN_S = 1.2;
  const tClick = tBirdYawn + YAWN_S / 2;
  /** It slides back in with its eyes shut, and the door closes behind it. */
  const tBack = tClick + 0.7;
  const tBackEnd = tBack + 1;
  at(tHour, { sound: () => playChimeNote(5) });
  at(tCall, { sound: playCuckoo });
  at(tBirdYawn, { sound: playYawn });

  /** How far the door is open (0 shut, 1 wide open). */
  const doorOpen = (t: number) => easeInOut(seg(t, tHour, tHour + 0.5)) - easeInOut(seg(t, tBackEnd, tBackEnd + 0.4));
  /** How far the cuckoo leans into its yawn (0 to 1 and back). */
  const birdLean = (t: number) => hump(seg(t, tBirdYawn, tBirdYawn + YAWN_S));
  /** Where the cuckoo's middle is: hidden in the clock, out on its perch, scooting forward while it yawns. */
  const birdX = (t: number) => lerp(BIRD.inX, BIRD.outX, easeInOut(seg(t, tOut, tOutEnd)) - easeInOut(seg(t, tBack, tBackEnd))) + BIRD.lean * birdLean(t);
  /** How far its beak is open: a little with every „kuckuck“, wide in the yawn. */
  const beakOpen = (t: number) =>
    Math.max(0.6 * Math.max(...CALL_NOTES.map((d) => hump(seg(t, tCall + d, tCall + d + 0.24)))), hump(seg(t, tBirdYawn, tBirdYawn + 1.3)));
  /** How sleepy it looks: eyes half shut while it calls, then shut from the yawn on. */
  const birdSleep = (t: number) => 0.45 + 0.55 * easeOut(seg(t, tBirdYawn, tBack));

  /** The lamp's pull chain swings away where the yawning cuckoo's beak pushes its bead. */
  const chainSwing = (t: number) => {
    const push = Math.max(0, birdX(t) + BIRD.beak.dx - (CHAIN.x - CHAIN.bead));
    return Math.atan2(push, CHAIN.len);
  };
  /** How brightly the lamp shines: on until the click. */
  const lampOn = (t: number) => 1 - seg(t, tClick, tClick + 0.15);
  /** How dark the room is: evening light until the click, then night falls softly. */
  const dark = (t: number) => 0.62 * easeInOut(seg(t, tClick, tClick + 1.8));
  at(tClick, {
    sound: playClick,
    say: {
      de: "Klick! Licht aus.",
      en: "Click! Lights out.",
      zh: "咔嗒！关灯啦。",
      hi: "क्लिक! बत्ती बंद।",
      es: "¡Clic! Se apaga la luz.",
      ar: "طق! نطفئ النور.",
      ru: "Щёлк! Выключаем свет.",
    },
  });

  /*
   * Night has fallen, and the hamster wakes up on its bedding: it trots to its bottle, rears up and drinks (two soft
   * plops, bubbles rising in the bottle), trots to its wheel and climbs in.
   */
  const tHamsterWake = tClick + 1.9;
  const tToBottle = tHamsterWake + 0.7;
  const tDrink = tToBottle + 0.7;
  const tDrinkEnd = tDrink + 1.6;
  const tToWheel = tDrinkEnd + 0.2;
  const tAtWheel = tToWheel + 1;
  const tInWheel = tAtWheel + 0.5;
  at(tHamsterWake, { sound: squeak });
  const SIPS = [0.5, 1.1];
  SIPS.forEach((d) => at(tDrink + d, { sound: playPlop }));
  at(tInWheel, { sound: () => playKnock(1300) });

  /*
   * It runs in its wheel, and the pulley on the wheel's axle turns with it: the rope loop draws the cable car up the
   * wall, slowly, until the car's nose bumps the shutter of the round window. The wheel stops with the car.
   */
  const tRun = tInWheel + 0.3;
  const tArrive = tRun + 5.6;
  /** How far the rope has moved since the hamster started running. */
  const ropeRun = (t: number) => (CAR_END - CAR_START) * easeInOut(seg(t, tRun, tArrive));
  /** Where the cable car's grip is on the rope. */
  const carAt = (t: number) => gripAt(CAR_START + ropeRun(t));
  /** How far the wheel (and the pulley on its axle) has turned, in radians, clockwise. */
  const wheelTurn = (t: number) => ropeRun(t) / ROPE.drive.r;
  [0.3, 2.5].forEach((d) => at(tRun + d, { sound: playWhirr }));
  at(tRun + 0.1, { sound: squeak });

  /* The bump sets the shutter swinging open on its hinge, slowly, with a soft creak. */
  const tOpen = tArrive + 1.8;
  /** How far the shutter has swung open, in radians (0 shut). */
  const shutterTurn = (t: number) => SHUTTER.open * easeInOut(seg(t, tArrive + 0.05, tOpen));
  at(tArrive, { sound: () => playKnock(1100) });
  at(tArrive + 0.3, { sound: playCreak });

  /** Where the hamster is and what it does: asleep on its bedding, trotting, drinking, climbing in, running in its wheel. */
  const hamsterAt = (t: number) => {
    const awake = easeOut(seg(t, tHamsterWake, tHamsterWake + 0.5)) * (1 - easeOut(seg(t, tHamsterSleep, tHamsterSleep + 0.6)));
    let x = BED.x;
    let y = BED.y;
    let face = -1;
    let rear = 0;
    let step = 0;
    if (t >= tToBottle && t < tDrinkEnd + 0.2) {
      const k = seg(t, tToBottle, tDrink);
      x = lerp(BED.x, DRINK_X, k);
      y = lerp(BED.y, GROUND, k);
      step = k < 1 ? 7 * k : 0;
      rear = REAR * (easeInOut(seg(t, tDrink, tDrink + 0.3)) - easeInOut(seg(t, tDrinkEnd, tDrinkEnd + 0.2)));
    } else if (t >= tDrinkEnd + 0.2 && t < tAtWheel) {
      const k = seg(t, tToWheel, tAtWheel);
      x = lerp(DRINK_X, WHEEL_FOOT, k);
      y = GROUND;
      face = 1;
      step = 10 * k;
    } else if (t >= tAtWheel) {
      const p = hop({ x: WHEEL_FOOT, y: GROUND }, RUNNER, 34, easeInOut(seg(t, tAtWheel, tInWheel)));
      x = p.x;
      y = p.y;
      face = 1;
      rear = t < tInWheel ? 0.2 : 0.12;
      step = (wheelTurn(t) * WHEEL.r) / 14;
    }
    return { x, y, face, rear, step, awake };
  };
  /** How much water is left in the bottle (1 full); each sip takes a little. */
  const water = (t: number) => 1 - 0.12 * SIPS.reduce((n, d) => n + easeOut(seg(t, tDrink + d, tDrink + d + 0.3)), 0);
  /** The bubbles rising in the bottle after each sip: how far up each one is (null while there is none). */
  const bubbles = (t: number) => SIPS.map((d) => (t >= tDrink + d && t < tDrink + d + 0.8 ? seg(t, tDrink + d, tDrink + d + 0.8) : null));

  /* The moon rises in the round window as soon as its shutter is open. */
  const tMoon = tOpen;
  const tMoonUp = tMoon + 4;
  const moonY = (t: number) => lerp(MOON.y0, MOON.y1, easeOut(seg(t, tMoon, tMoonUp)));
  [0, 1, 2].forEach((i) => at(tMoon + 0.8 + i * 1.1, { sound: () => playChimeNote(3 + i * 2) }));
  at(tMoon + 1.5, {
    say: {
      de: "Da kommt der Mond.",
      en: "Here comes the moon.",
      zh: "月亮出来啦。",
      hi: "वो आया चाँद।",
      es: "Ahí viene la luna.",
      ar: "ها هو القمر يطلع.",
      ru: "А вот и луна.",
    },
  });

  /*
   * The moonlight creeps down from the window over the cradle; when it reaches the teddy's face, the teddy yawns.
   * Then everything falls asleep: first the teddy and the moon, then on the slow way back the hamster, the cuckoo, the
   * star and the sheep.
   */
  const tBeam = tMoonUp - 0.4;
  const BEAM_S = 2.8;
  /** How far down the moonlight has crept, from the window's sill (0) to the cradle's foot (1). */
  const beamReach = (t: number) => easeInOut(seg(t, tBeam, tBeam + BEAM_S));
  /** The lowest point the moonlight reaches. */
  const beamY = (t: number) => lerp(BEAM_TOP, CRADLE.bottom, beamReach(t));
  let tYawn = tBeam;
  while (beamY(tYawn) < TEDDY.y) tYawn += 0.01;
  const tTeddy = tYawn + 1.3;
  const tMoonSleep = tTeddy + 1.6;
  const tPan = tMoonSleep + 1.4;
  /** The way back takes as long, per pixel, as it did before the nook came in: 7.4 s for 2050 px. */
  const tPanEnd = tPan + (7.4 * LAST_CAMERA) / 2050;
  /** The camera's left edge on its way back to the start. */
  const panCamera = (t: number) => LAST_CAMERA * (1 - easeInOut(seg(t, tPan, tPanEnd)));
  /** The hamster, the cuckoo and the star fall asleep once the camera has them in the middle of the picture again. */
  let tHamsterSleep = tPan;
  while (panCamera(tHamsterSleep) > CAGE_MID - 760) tHamsterSleep += 0.05;
  let tCuckoo = tPan;
  while (panCamera(tCuckoo) > CLOCK.x - 760) tCuckoo += 0.05;
  let tStar = tPan;
  while (panCamera(tStar) > BASKET.x - 760) tStar += 0.05;
  const tSheep = tPanEnd + 0.3;
  const tDone = tSheep + 2.6;
  at(tYawn, { sound: playYawn });
  at(tTeddy, {
    sound: () => playChimeNote(1),
    say: {
      de: "Gute Nacht, Teddy.",
      en: "Good night, teddy.",
      zh: "晚安，小熊。",
      hi: "शुभ रात्रि, टेडी।",
      es: "Buenas noches, osito.",
      ar: "ليلة سعيدة يا دبدوب.",
      ru: "Спокойной ночи, мишка.",
    },
  });
  at(tMoonSleep, {
    sound: () => playChimeNote(0),
    say: {
      de: "Gute Nacht, Mond.",
      en: "Good night, moon.",
      zh: "晚安，月亮。",
      hi: "शुभ रात्रि, चाँद।",
      es: "Buenas noches, luna.",
      ar: "ليلة سعيدة يا قمر.",
      ru: "Спокойной ночи, луна.",
    },
  });
  at(tHamsterSleep, { sound: () => playChimeNote(4) });
  at(tCuckoo, { sound: () => playChimeNote(3) });
  at(tStar, {
    sound: () => playChimeNote(2),
    say: {
      de: "Gute Nacht, Stern.",
      en: "Good night, star.",
      zh: "晚安，星星。",
      hi: "शुभ रात्रि, तारे।",
      es: "Buenas noches, estrella.",
      ar: "ليلة سعيدة يا نجمة.",
      ru: "Спокойной ночи, звёздочка.",
    },
  });
  at(tSheep, {
    sound: () => playChimeNote(0),
    say: {
      de: "Gute Nacht, Schäfchen. Alle schlafen.",
      en: "Good night, little sheep. Everyone is asleep.",
      zh: "晚安，小绵羊。大家都睡着啦。",
      hi: "शुभ रात्रि, नन्ही भेड़। सब सो रहे हैं।",
      es: "Buenas noches, ovejita. Todos duermen.",
      ar: "ليلة سعيدة يا خروف. الجميع نائمون.",
      ru: "Спокойной ночи, барашек. Все спят.",
    },
  });
  at(tDone, { done: true });

  /** How far asleep each one is (0 awake, 1 eyes shut). */
  const asleep = (t: number, from: number) => easeOut(seg(t, from, from + 0.6));
  /** The cradle rocks gently once the teddy is asleep, slower and slower, and stops when the level is over. */
  const rock = (t: number) => {
    const u = Math.min(t, tDone) - tTeddy;
    return u <= 0 ? 0 : 3 * decay(u / 6) * Math.sin(u * 2.2);
  };

  /** Where the camera looks: the music box and the top of the gutter, then the star on its last stretch, the curtain, the reading corner, the hamster and its cable car, the moon, and slowly back. */
  const cameraTarget = (t: number) => {
    if (t < tLeg3) return 0;
    if (t < tEnd) return cameraOn(WORLD_W, starAt(t).pt.x);
    if (t < tShut) return cameraOn(WORLD_W, Math.max(BASKET.x + 300, curtainEdge(t)));
    if (t < tBackEnd + 0.2) return cameraOn(WORLD_W, CLOCK.x + 40);
    if (t < tRun) return cameraOn(WORLD_W, CAGE_MID);
    // The whole way of the cable car, from the cage to the round window, fits on the screen at once.
    if (t < tOpen) return CHEST.x0 - 40;
    if (t < tPan) return LAST_CAMERA;
    return panCamera(t);
  };

  /** Where it could wait for the child's tap (R-03): the star come down into the basket, the cuckoo out on its perch, the teddy under the risen moon. Only the cuckoo waits; the machine runs through the others. */
  const stops = [
    { at: tIn, x: landing.x, y: landing.y },
    { at: tCall, x: BIRD.outX, y: BIRD.y, active: true },
    { at: tYawn, x: TEDDY.x, y: TEDDY.y },
  ];

  return {
    events: sorted(),
    duration: tDone,
    stops,
    tPush,
    tIn,
    tSink,
    tNudge,
    tShut,
    tHour,
    tOut,
    tCall,
    tBirdYawn,
    tClick,
    tBack,
    tBackEnd,
    tHamsterWake,
    tDrink,
    tAtWheel,
    tInWheel,
    tRun,
    tArrive,
    tOpen,
    tMoon,
    tBeam,
    tYawn,
    tTeddy,
    tMoonSleep,
    tHamsterSleep,
    tCuckoo,
    tStar,
    tSheep,
    crankAngle,
    crankTurn,
    starAt,
    basketRim,
    curtainEdge,
    chairAngle,
    pendulumAngle,
    minuteHand,
    doorOpen,
    birdX,
    birdLean,
    beakOpen,
    birdSleep,
    chainSwing,
    lampOn,
    dark,
    moonY,
    hamsterAt,
    water,
    bubbles,
    carAt,
    wheelTurn,
    shutterTurn,
    beamY,
    asleep,
    rock,
    cameraTarget,
    width: WORLD_W,
  };
}
