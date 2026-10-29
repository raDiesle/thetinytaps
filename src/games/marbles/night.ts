// The good-night machine ("Gute-Nacht-Maschine", R-07), a very calm Rube
// Goldberg machine in a children's room at dusk: one tap winds the music box,
// whose crank nudges a golden star ball down a zigzag gutter into a little
// basket; the star's weight pulls the cord that draws the curtain, the curtain
// pushes the lamp's pull chain – click, the light goes out – and the moon rises
// in the round window over the cradle. Then everything falls asleep while the
// camera glides slowly back through the room. Soft sounds and a slow pace only.
// Everything is worked out ahead as a function of the seconds since the tap, so
// NightLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the room, 3400 × 900; the screen shows 1600 of it at a time.

import { playChimeNote, playClick, playCurtain, playMusicbox, playPlop, playTwinkle, playYawn } from "@/lib/sfx";
import { along, cameraOn, distAt, easeInOut, easeOut, hop, lerp, pathOf, rad, roll, seg, timeline, timeWhen } from "./machineKit";
import { arc, line, type Pt } from "./path";

export const WORLD_W = 3400;
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

/** The arc floor lamp: its foot, and the shade hanging from the arc over the curtain's end. */
export const LAMP = { base: 2420, shade: { x: 2215, y: 200 }, shadeH: 90 };
/** The lamp's pull chain hangs from the shade's middle; the bead at its end is what the curtain pushes. */
export const CHAIN = { x: LAMP.shade.x, top: LAMP.shade.y + LAMP.shadeH, len: 160, bead: 11 };

/** The round window over the cradle, where the moon rises. */
export const ROUND_WINDOW = { x: 2950, y: 260, r: 110 };
/** The moon's middle at the bottom of its way (hidden below the window) and at the top. */
export const MOON = { x: 2975, y0: 430, y1: 235, r: 46 };
/** The cradle on its rockers, and the teddy's head on its pillow. */
export const CRADLE = { x0: 2780, x1: 3120, top: 590, bottom: 730 };
export const TEDDY = { x: 2890, y: 572 };

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

  /* The curtain's edge pushes the bead of the lamp's pull chain; when it is shut, click, the light goes out. */
  const chainSwing = (t: number) => {
    const push = Math.max(0, curtainEdge(t) - (CHAIN.x - CHAIN.bead));
    return Math.atan2(push, CHAIN.len);
  };
  const tClick = tShut;
  /** How brightly the lamp shines: on until the click. */
  const lampOn = (t: number) => 1 - seg(t, tClick, tClick + 0.15);
  /** How dark the room is: evening light until the click, then night falls softly. */
  const dark = (t: number) => 0.62 * easeInOut(seg(t, tClick, tClick + 1.8));
  at(tClick, { sound: playClick, say: { de: "Klick! Licht aus." } });

  /* The moon rises in the round window. */
  const tMoon = tClick + 1.2;
  const tMoonUp = tMoon + 4;
  const moonY = (t: number) => lerp(MOON.y0, MOON.y1, easeOut(seg(t, tMoon, tMoonUp)));
  [0, 1, 2].forEach((i) => at(tMoon + 0.8 + i * 1.1, { sound: () => playChimeNote(3 + i * 2) }));
  at(tMoon + 1.5, { say: { de: "Da kommt der Mond." } });

  /* Everything falls asleep: first the teddy and the moon, then on the slow way back the star and the sheep. */
  const tYawn = tMoonUp + 0.4;
  const tTeddy = tYawn + 1.3;
  const tMoonSleep = tTeddy + 1.6;
  const tPan = tMoonSleep + 1.4;
  const tPanEnd = tPan + 6.5;
  /** The camera's left edge on its way back to the start. */
  const panCamera = (t: number) => LAST_CAMERA * (1 - easeInOut(seg(t, tPan, tPanEnd)));
  /** The star falls asleep once the camera has it in the middle of the picture again. */
  let tStar = tPan;
  while (panCamera(tStar) > BASKET.x - 760) tStar += 0.05;
  const tSheep = tPanEnd + 0.3;
  const tDone = tSheep + 2.6;
  at(tYawn, { sound: playYawn });
  at(tTeddy, { sound: () => playChimeNote(1), say: { de: "Gute Nacht, Teddy." } });
  at(tMoonSleep, { sound: () => playChimeNote(0), say: { de: "Gute Nacht, Mond." } });
  at(tStar, { sound: () => playChimeNote(2), say: { de: "Gute Nacht, Stern." } });
  at(tSheep, { sound: () => playChimeNote(0), say: { de: "Gute Nacht, Schäfchen. Alle schlafen." } });
  at(tDone, { done: true });

  /** How far asleep each one is (0 awake, 1 eyes shut). */
  const asleep = (t: number, from: number) => easeOut(seg(t, from, from + 0.6));
  /** The cradle rocks gently once the teddy is asleep, slower and slower, and stops when the level is over. */
  const rock = (t: number) => {
    const u = Math.min(t, tDone) - tTeddy;
    return u <= 0 ? 0 : 3 * Math.exp(-u / 6) * Math.sin(u * 2.2);
  };

  /** Where the camera looks: the music box and the top of the gutter, then the star on its last stretch, the curtain, the moon, and slowly back. */
  const cameraTarget = (t: number) => {
    if (t < tLeg3) return 0;
    if (t < tEnd) return cameraOn(WORLD_W, starAt(t).pt.x);
    if (t < tClick + 0.6) return cameraOn(WORLD_W, Math.max(BASKET.x + 300, curtainEdge(t)));
    if (t < tPan) return LAST_CAMERA;
    return panCamera(t);
  };

  return {
    events: sorted(),
    duration: tDone,
    tPush,
    tIn,
    tSink,
    tShut,
    tClick,
    tMoon,
    tYawn,
    tTeddy,
    tMoonSleep,
    tStar,
    tSheep,
    crankAngle,
    crankTurn,
    starAt,
    basketRim,
    curtainEdge,
    chainSwing,
    lampOn,
    dark,
    moonY,
    asleep,
    rock,
    cameraTarget,
  };
}
