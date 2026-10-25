// The light chain ("Licht-Kette", R-10), a Rube Goldberg machine of light in
// a dark children's room: one tap switches on the torch, its beam bounces off
// a mirror onto the disco ball, a spot of light from the ball wanders over to
// a jar of sleeping fireflies, they wake up, fly out and along the fairy
// lights (each bulb comes on as they pass) to the star lamp, and the whole
// room starts to sparkle. Soft sounds only: light, not noise. Everything is
// worked out ahead as a function of the seconds since the tap, so
// LightLevel.tsx only asks where each thing is at a moment. Coordinates are
// those of the room, 5000 × 900; the screen shows 1600 of it at a time.

import { playChime, playChimeNote, playHoot, playMusicbox, playPing, playPop, playSwirl, playTick, playTwinkle, playWhoosh } from "@/lib/sfx";
import { along, cameraOn, deg, easeInOut, easeOut, lerp, pathOf, rad, seg, timeline } from "./machineKit";
import { arc, line, quad, type Pt } from "./path";

export const WORLD_W = 5000;
export const FLOOR = 800;

/* ---------- Layout ---------- */

/** The bedside table the torch lies on. */
export const NIGHTSTAND = { x0: 110, x1: 380, top: 620 };
/** The torch lies on its side, shining to the right; its glass is at `lens`. */
export const TORCH = { x0: 170, r: 22, lens: { x: 340, y: 594 } };

/** The toy chest; the mirror stands on it on a little foot. */
export const CHEST = { x0: 690, x1: 950, top: 690 };
/** The mirror's middle and half its length. */
export const MIRROR = { c: { x: 820, y: 594 }, half: 74 };

/** The disco ball hangs from the ceiling on a string. */
export const DISCO = { x: 980, y: 170, r: 64 };

/** The stool with the jar of fireflies on it. */
export const STOOL = { x0: 1560, x1: 1720, top: 690 };
export const JAR = { x: 1640, bottom: 690, top: 540, w: 130 };
export const FIREFLIES = 6;
/** Where each firefly sleeps in the jar. */
const SLEEP = [
  { x: -30, y: 30 },
  { x: 22, y: 38 },
  { x: -8, y: 66 },
  { x: 36, y: 80 },
  { x: -38, y: 98 },
  { x: 8, y: 112 },
].map((p) => ({ x: JAR.x + p.x, y: JAR.bottom - p.y }));

/** The fairy lights: nails in the wall, and how far the wire sags between two of them. */
export const NAILS = [1980, 2460, 2940, 3420, 3900];
export const WIRE = { y: 84, sag: 78 };
/** The height of the wire at `x`. */
export function wireY(x: number) {
  const after = NAILS.findIndex((n) => n > x);
  // At or past the last nail, the last stretch of wire.
  const i = Math.max(0, Math.min(NAILS.length - 2, (after < 0 ? NAILS.length : after) - 1));
  const k = (x - NAILS[i]) / (NAILS[i + 1] - NAILS[i]);
  return WIRE.y + 4 * WIRE.sag * k * (1 - k);
}
/** Each bulb's x; none right at a nail. */
export const BULBS = Array.from({ length: 34 }, (_, i) => NAILS[0] + 30 + i * 56).filter(
  (x) => x < NAILS[NAILS.length - 1] - 20 && NAILS.every((n) => Math.abs(n - x) > 16),
);
/** How far below the wire a bulb's middle hangs. */
export const BULB_DROP = 24;

/** The chest of drawers the star lamp stands on. */
export const DRESSER = { x0: 4110, x1: 4410, top: 600 };
/** The star lamp: its base on the dresser and the dome on top (`domeY` is the middle of the dome's flat bottom). */
export const LAMP = { x: 4260, baseH: 34, r: 66 };
export const DOME_Y = DRESSER.top - LAMP.baseH;

/** The bed with the sleeping toy owl. */
export const BED = { x0: 4500, x1: 4980, top: 640 };
export const OWL = { x: 4790, y: 572 };

/* ---------- The machine ---------- */

/** How fast the light of the torch travels, and how fast the fireflies fly (px per second). */
const LIGHT_SPEED = 1000;
const FLY_SPEED = 340;
const SPOT_SPEED = 330;
/** Seconds between one firefly and the next on their way out. */
const FLY_GAP = 0.45;
/** How far below the wire the fireflies fly, just under the bulbs. */
const UNDER_WIRE = 64;

export type Light = ReturnType<typeof buildLight>;

export function buildLight() {
  const { at, sorted } = timeline();

  /* The torch: click, and the beam grows to the mirror and from there up to the disco ball. */
  const tOn = 0.1;
  const toMirror = MIRROR.c.x - TORCH.lens.x;
  const toBall = Math.hypot(DISCO.x - MIRROR.c.x, DISCO.y + DISCO.r * 0.6 - MIRROR.c.y);
  const tMirror = tOn + toMirror / LIGHT_SPEED;
  const tBall = tMirror + toBall / LIGHT_SPEED;
  at(0, { sound: playTick });
  at(tMirror, { sound: playPing });
  at(tBall, { sound: playChime });
  at(tBall + 0.25, { sound: playSwirl });

  /** The mirror's tilt in degrees: it sends the torch's light (coming from the left) straight to the disco ball. */
  const out = { x: DISCO.x - MIRROR.c.x, y: DISCO.y + DISCO.r * 0.6 - MIRROR.c.y };
  const outLen = Math.hypot(out.x, out.y);
  const mirrorTilt = deg(Math.atan2(out.y / outLen, out.x / outLen - 1)) + 90;

  /** How far the beam has got: 0 to 1 to the mirror, then 0 to 1 from the mirror to the ball. */
  const beam = (t: number) => ({ first: seg(t, tOn, tMirror), second: seg(t, tMirror, tBall) });
  const beamFront = (t: number): Pt => {
    const b = beam(t);
    if (b.second <= 0) return { x: lerp(TORCH.lens.x, MIRROR.c.x, b.first), y: TORCH.lens.y };
    return { x: lerp(MIRROR.c.x, MIRROR.c.x + out.x, b.second), y: lerp(MIRROR.c.y, MIRROR.c.y + out.y, b.second) };
  };

  /* The disco ball turns; the beam makes little spots of light circle over the wall. */
  const spin = (t: number) => {
    if (t < tBall) return 0;
    // It stops when the level is over.
    const u = Math.min(t, tDone) - tBall;
    // Speeds up over a second, then turns evenly.
    return u < 1 ? 0.9 * u * u : 0.9 + 1.8 * (u - 1);
  };

  /* One golden spot leaves the others and wanders over the wall onto the jar. */
  const spotPath = pathOf(
    quad({ x: 1060, y: 330 }, { x: 1180, y: 660 }, { x: 1330, y: 440 }),
    quad({ x: 1330, y: 440 }, { x: 1450, y: 250 }, { x: JAR.x, y: JAR.bottom - 70 }),
  );
  const tSpot = tBall + 0.9;
  const tJar = tSpot + spotPath.total / SPOT_SPEED;
  at(tSpot, { sound: playTwinkle });
  const spotAt = (t: number): Pt => along(spotPath, Math.min(spotPath.total, (t - tSpot) * SPOT_SPEED)).pt;

  /* The fireflies wake up one by one, the lid pops open, and out they fly. */
  const tWake = (i: number) => tJar + 0.3 + 0.3 * i;
  for (let i = 0; i < FIREFLIES; i++) at(tWake(i), { sound: () => playChimeNote(i + 2) });
  const tLid = tWake(FIREFLIES - 1) + 0.6;
  at(tLid, { sound: playPop });
  const tGo = (i: number) => tLid + 0.35 + FLY_GAP * i;
  at(tGo(0), { sound: playWhoosh });

  const mouth = { x: JAR.x, y: JAR.top - 30 };
  const top = { x: 1830, y: 250 };
  const wireStart = { x: NAILS[0], y: wireY(NAILS[0]) + UNDER_WIRE };
  const wireEnd = { x: NAILS[NAILS.length - 1], y: wireY(NAILS[NAILS.length - 1]) + UNDER_WIRE };
  const overLamp = { x: LAMP.x, y: DOME_Y - LAMP.r - 70 };
  const alongWire: Pt[] = [];
  for (let x = wireStart.x; x <= wireEnd.x; x += 16) alongWire.push({ x, y: wireY(x) + UNDER_WIRE });
  const flyPath = pathOf(
    line({ x: JAR.x, y: JAR.bottom - 70 }, mouth),
    quad(mouth, { x: JAR.x + 10, y: top.y }, top),
    // A loop in the air, for joy.
    arc(top.x, top.y + 80, 80, -90, 270),
    quad(top, { x: 1930, y: 170 }, wireStart),
    alongWire,
    quad(wireEnd, { x: 4180, y: 190 }, overLamp),
  );
  const tArrive = (i: number) => tGo(i) + flyPath.total / FLY_SPEED;
  /** Where each firefly sits on the dome of the star lamp at the end. */
  const seat = (i: number): Pt => {
    const a = rad(-170 + (160 * i) / (FIREFLIES - 1));
    return { x: LAMP.x + (LAMP.r + 34) * Math.cos(a), y: DOME_Y + (LAMP.r + 34) * Math.sin(a) };
  };

  /** Where firefly `i` is, and how brightly it glows (0 asleep to 1). */
  const fireflyAt = (i: number, t: number): { pt: Pt; glow: number } => {
    const glow = 0.15 + 0.85 * easeOut(seg(t, tWake(i), tWake(i) + 0.4));
    const home = SLEEP[i];
    if (t < tGo(i)) {
      // Awake in the jar, they hover a little.
      const awake = seg(t, tWake(i), tWake(i) + 0.4);
      return { pt: { x: home.x + awake * 4 * Math.sin(t * 5 + i), y: home.y - awake * (8 + 5 * Math.sin(t * 7 + i * 2)) }, glow };
    }
    const d = (t - tGo(i)) * FLY_SPEED;
    if (d < flyPath.total) {
      const p = along(flyPath, d).pt;
      const k = easeOut(seg(t, tGo(i), tGo(i) + 0.35));
      // A little up and down while flying, each firefly in its own rhythm.
      const bob = 9 * Math.sin(t * 6 + i * 1.7);
      return { pt: { x: lerp(home.x, p.x, k), y: lerp(home.y, p.y + bob, k) }, glow };
    }
    const k = easeInOut(seg(t, tArrive(i), tArrive(i) + 0.5));
    const s = seat(i);
    return { pt: { x: lerp(overLamp.x, s.x, k), y: lerp(overLamp.y, s.y, k) }, glow };
  };

  /* Each bulb comes on when the first firefly flies past it. */
  const bulbTimes = BULBS.map((bx) => {
    const i = flyPath.pts.findIndex((p) => p.x >= bx);
    return tGo(0) + flyPath.s[i] / FLY_SPEED;
  });
  // Every second bulb rings a note, up the scale and down again.
  const NOTES = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1];
  bulbTimes.forEach((tb, k) => {
    if (k % 2 === 0) at(tb, { sound: () => playChimeNote(NOTES[(k / 2) % NOTES.length]) });
  });
  const bulbOn = (k: number, t: number) => easeOut(seg(t, bulbTimes[k], bulbTimes[k] + 0.25));

  /* When all fireflies sit on it, the star lamp comes on and throws stars all over the room. */
  const tLamp = tArrive(FIREFLIES - 1) + 0.6;
  const tOwl = tLamp + 2.2;
  const tDone = tLamp + 4.6;
  /** How brightly the lamp shines: a little more with each firefly that lands, fully when it is on. */
  const lampGlow = (t: number) => {
    const landed = Array.from({ length: FIREFLIES }, (_, i) => seg(t, tArrive(i), tArrive(i) + 0.5)).reduce((a, b) => a + b, 0);
    return Math.max((0.35 * landed) / FIREFLIES, easeOut(seg(t, tLamp, tLamp + 0.6)));
  };
  /** How far the lamp has turned, in radians; it stops when the level is over. */
  const lampTurn = (t: number) => 0.18 * Math.max(0, Math.min(t, tDone) - tLamp);
  /** How dark the room is: from night to a soft glow at the end. */
  const dark = (t: number) => 0.68 - 0.5 * easeInOut(seg(t, tLamp + 0.4, tLamp + 2.6));
  at(tLamp, { sound: playMusicbox });
  at(tLamp + 0.7, { sound: playTwinkle });
  at(tLamp + 1.2, { say: "Licht an! Alles funkelt!" });
  at(tOwl, { sound: playHoot });
  at(tOwl + 0.6, { sound: playTwinkle });
  at(tDone, { done: true });

  /** Where the camera looks: the light on its way, the jar while the fireflies wake, then the first firefly, then the lamp and the bed. */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tBall) return beamFront(t).x;
    if (t < tSpot) return DISCO.x + 100;
    if (t < tJar) return spotAt(t).x;
    if (t < tGo(0) + 0.6) return JAR.x;
    const lead = fireflyAt(0, t).pt.x - 120;
    return t < tArrive(0) ? Math.max(JAR.x, lead) : 4480;
  };
  const cameraTarget = (t: number) => cameraOn(WORLD_W, focusX(t));

  return {
    events: sorted(),
    duration: tDone,
    tMirror,
    tBall,
    tSpot,
    tJar,
    tLid,
    tLamp,
    tOwl,
    mirrorTilt,
    beam,
    beamFront,
    spin,
    spotAt,
    tWake,
    fireflyAt,
    bulbOn,
    lampGlow,
    lampTurn,
    dark,
    cameraTarget,
  };
}
