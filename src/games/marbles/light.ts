// The light chain ("Licht-Kette", R-10), a Rube Goldberg machine of light in
// a dark children's room: one tap switches on the torch, its beam bounces off
// a mirror onto the disco ball, a spot of light from the ball wanders over to
// a jar of sleeping fireflies, they wake up, fly out and along the fairy
// lights (each bulb comes on as they pass) down to the lava lamp, where the
// first one lands on its switch. The lamp's blobs warm up and rise, the warm
// air turns the paper carousel on its cap, and its rabbit and bird cut-outs
// throw big shadows that hop and fly over the wall. The paper bird comes
// loose, flutters onto the globe's button, the globe lights up and turns, and
// its glow calls the fireflies over it to the star lamp, which throws stars
// all over the room. Soft sounds only: light, not noise. Everything is worked
// out ahead as a function of the seconds since the tap, so LightLevel.tsx
// only asks where each thing is at a moment. Coordinates are those of the
// room, 6200 × 900; the screen shows 1600 of it at a time.

import {
  playBeam,
  playBlub,
  playChime,
  playChimeNote,
  playClick,
  playDing,
  playHoot,
  playHum,
  playMusicbox,
  playPing,
  playPlink,
  playPop,
  playSwirl,
  playTick,
  playTrill,
  playTweet,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { along, cameraOn, deg, easeInOut, easeOut, lerp, pathOf, rad, seg, timeline } from "./machineKit";
import { arc, line, quad, type Pt } from "./path";

export const WORLD_W = 6200;
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

/** The little table the lava lamp stands on, with the lamp's cord switch lying at its right end. */
export const SIDE_TABLE = { x0: 4120, x1: 4480, top: 650 };
/**
 * The lava lamp: its middle, the cone of its foot from the table up to `glass0`, the glass from there up to
 * `glass1`, and the cap up to `top`.
 */
export const LAVA = { x: 4300, glass0: 590, glass1: 400, top: 380 };
/** Half the width of the lava lamp's glass at height `y`: narrow at the top, widest in the lower half. */
export function lavaHalf(y: number) {
  const k = Math.min(1, Math.max(0, (y - LAVA.glass1) / (LAVA.glass0 - LAVA.glass1)));
  return 24 + 34 * Math.sin(0.8 * Math.PI * k);
}
/** The round button of the lamp's cord switch on the table; the first firefly lands on it. */
export const SWITCH = { x: 4430, y: SIDE_TABLE.top - 12 };
/** The coloured blobs in the lava lamp: where each lies at the bottom, its size and its colour. */
export const BLOBS = [
  { x: -16, r: 17, color: "#ff5d73" },
  { x: 14, r: 13, color: "#ffb703" },
  { x: -2, r: 15, color: "#ff7bd0" },
  { x: 18, r: 11, color: "#ff8c42" },
];
/** Where each blob floats at the top once it has risen. */
const BLOB_TOP = [456, 436, 478, 428];

/**
 * The paper carousel on the lava lamp's cap: a little paper rotor on a needle at `rotor`, a wire hoop at `hoop`
 * of radius `r`, and two black cut-outs (a rabbit and a bird) hanging `hang` below it on threads. The warm air from
 * the lamp turns it, and the cut-outs throw big shadows on the wall.
 */
export const CAROUSEL = { rotor: 300, hoop: 314, r: 100, hang: 96 };
/** The cut-outs' places on the hoop at the start (radians; 0 is in front of the lamp, π behind it, towards the wall). */
export const RABBIT0 = 1.5 * Math.PI + 0.3;
export const BIRD0 = 0.5 * Math.PI + 0.3;
/** Where on the wall the cut-outs' shadows stand: how far they sweep either side of the lamp, and the height of their feet. */
export const SHADOW = { sweep: 520, floor: 450, scale: 3 };

/** The desk with the globe on it; the globe's switch is a button on its foot. */
export const DESK = { x0: 4720, x1: 5000, top: 650 };
export const GLOBE = { x: 4860, y: 510, r: 78 };
export const GLOBE_BUTTON = { x: 4904, y: DESK.top - 24 };

/** The chest of drawers the star lamp stands on. */
export const DRESSER = { x0: 5310, x1: 5610, top: 600 };
/** The star lamp: its base on the dresser and the dome on top (`domeY` is the middle of the dome's flat bottom). */
export const LAMP = { x: 5460, baseH: 34, r: 66 };
export const DOME_Y = DRESSER.top - LAMP.baseH;

/** The bed with the sleeping toy owl. */
export const BED = { x0: 5700, x1: 6180, top: 640 };
export const OWL = { x: 5990, y: 572 };

/* ---------- The machine ---------- */

/** How fast the light of the torch travels, and how fast the fireflies fly (px per second). */
const LIGHT_SPEED = 1000;
const FLY_SPEED = 340;
const SPOT_SPEED = 330;
/** How fast the paper bird flutters over to the globe (px per second). */
const BIRD_SPEED = 300;
/** Seconds between one firefly and the next on their way out. */
const FLY_GAP = 0.45;
/** How far below the wire the fireflies fly, just under the bulbs. */
const UNDER_WIRE = 64;
/** How fast the carousel turns once the warm air has got it going (radians per second). */
const CAROUSEL_SPEED = 1.4;
/** Where on the hoop the paper bird comes loose: behind the lamp, on its way to the right. */
const LOOSE_AT = 2.0;
/** How far from the globe's middle the fireflies fly round it. */
const ROUND_GLOBE = GLOBE.r + 50;

export type Light = ReturnType<typeof buildLight>;

export function buildLight() {
  const { at, sorted } = timeline();
  /** When the level is over and everything stops turning; known only at the end, so the moments worked out before it see no end. */
  let tDone = Number.POSITIVE_INFINITY;

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

  /* Along the fairy lights and down to the lava lamp's table: the first firefly lands on the switch, the others beside the lamp. */
  const mouth = { x: JAR.x, y: JAR.top - 30 };
  const top = { x: 1830, y: 250 };
  const wireStart = { x: NAILS[0], y: wireY(NAILS[0]) + UNDER_WIRE };
  const wireEnd = { x: NAILS[NAILS.length - 1], y: wireY(NAILS[NAILS.length - 1]) + UNDER_WIRE };
  const alongWire: Pt[] = [];
  for (let x = wireStart.x; x <= wireEnd.x; x += 16) alongWire.push({ x, y: wireY(x) + UNDER_WIRE });
  /** Where each firefly sits on the side table: the first on the switch, then right to left in front of the lamp. */
  const tableSeat = (i: number): Pt => (i === 0 ? { x: SWITCH.x, y: SWITCH.y - 18 } : { x: SWITCH.x - 60 - 56 * (i - 1), y: SIDE_TABLE.top - 18 });
  const toTable = Array.from({ length: FIREFLIES }, (_, i) =>
    pathOf(
      line({ x: JAR.x, y: JAR.bottom - 70 }, mouth),
      quad(mouth, { x: JAR.x + 10, y: top.y }, top),
      // A loop in the air, for joy.
      arc(top.x, top.y + 80, 80, -90, 270),
      quad(top, { x: 1930, y: 170 }, wireStart),
      alongWire,
      quad(wireEnd, { x: tableSeat(i).x - 60, y: 260 }, tableSeat(i)),
    ),
  );
  const tSeat = (i: number) => tGo(i) + toTable[i].total / FLY_SPEED;

  /* The first firefly presses the switch: click, the lava lamp comes on, its blobs warm up and rise one by one. */
  const tSwitch = tSeat(0);
  at(tSwitch, { sound: playClick });
  at(tSwitch + 0.15, { sound: playHum });
  /** How brightly the lava lamp shines (0 off to 1). */
  const lavaGlow = (t: number) => easeOut(seg(t, tSwitch, tSwitch + 0.8));
  /** How far the switch's button is pressed down (0 to 1). */
  const switchDown = (t: number) => easeOut(seg(t, tSwitch - 0.05, tSwitch + 0.1));
  const tRise = (i: number) => tSwitch + 1.1 + 0.6 * i;
  const RISE = 2;
  BLOBS.forEach((_, i) => at(tRise(i), { sound: i % 2 ? () => playPlink(i + 2) : playBlub }));
  /** Where blob `i` is and its shape: it swells and wobbles as it warms up, stretches as it rises, and bobs at the top. */
  const blobAt = (i: number, t: number) => {
    const b = BLOBS[i];
    const warm = seg(t, tSwitch + 0.3 + 0.2 * i, tSwitch + 1.1 + 0.2 * i);
    const k = easeInOut(seg(t, tRise(i), tRise(i) + RISE));
    const bottom = LAVA.glass0 - b.r * 1.35 - 4;
    const tt = Math.min(t, tDone);
    // Bobbing at the top once there; a little wobble while warming.
    const bob = 6 * seg(t, tRise(i) + RISE, tRise(i) + RISE + 0.5) * Math.sin(tt * 1.6 + i * 1.3);
    const y = lerp(bottom, BLOB_TOP[i], k) + bob;
    const wobble = warm * (1 - k) * 0.12 * Math.sin(tt * 9 + i);
    const stretch = 1 + 0.45 * Math.sin(Math.PI * k);
    const r = b.r * (1 + 0.15 * warm);
    // Never wider than the glass at its height.
    const x = LAVA.x + b.x * Math.min(1, (lavaHalf(y) - r * 0.9) / Math.abs(b.x || 1));
    return { x, y, rx: (r * (1 + wobble)) / Math.sqrt(stretch), ry: r * (1 - wobble) * stretch, warm };
  };

  /* The warm air rising from the cap starts the paper carousel; the cut-outs go round and their shadows walk over the wall. */
  const tTurn = tRise(0) + 0.9;
  at(tTurn, { sound: () => playChimeNote(4) });
  at(tTurn + 0.4, { sound: () => playChimeNote(6) });
  /** How warm the air over the cap is (0 to 1): the wavy lines show it. */
  const heat = (t: number) => seg(t, tRise(0), tRise(0) + 1);
  /** How far the carousel has turned since it started, in radians: speeds up over two seconds, then turns evenly; it stops when the level is over. */
  const carousel = (t: number) => {
    const u = Math.max(0, Math.min(t, tDone) - tTurn);
    return u < 2 ? (CAROUSEL_SPEED / 4) * u * u : CAROUSEL_SPEED + CAROUSEL_SPEED * (u - 2);
  };
  /** The seconds after `tTurn` at which the carousel has turned `turned` radians. */
  const turnedAfter = (turned: number) => (turned < CAROUSEL_SPEED ? Math.sqrt((4 * turned) / CAROUSEL_SPEED) : 2 + (turned - CAROUSEL_SPEED) / CAROUSEL_SPEED);
  /** The paper bird comes loose after a full turn and a bit, when it is behind the lamp on its way right. */
  const tLoose = tTurn + turnedAfter(BIRD0 - LOOSE_AT + 2 * Math.PI);
  /** Where a cut-out is on the hoop: its angle (turning so that behind the lamp it goes right) and its spot. */
  const cutout = (start: number, t: number) => {
    const a = start - carousel(t);
    return { a, pt: { x: LAVA.x + CAROUSEL.r * Math.sin(a), y: CAROUSEL.hoop + CAROUSEL.hang } };
  };
  const rabbitAt = (t: number) => cutout(RABBIT0, t);
  /** The paper bird on the hoop, or null once it has come loose. */
  const birdOnHoop = (t: number) => (t < tLoose ? cutout(BIRD0, t) : null);

  /** A cut-out's shadow on the wall: where it stands, and how much it shows (only behind the lamp, and only while the lamp is on). */
  const shadowOf = (a: number, t: number) => {
    const show = Math.min(1, Math.max(0, -3 * Math.cos(a))) * lavaGlow(t);
    return { x: LAVA.x + SHADOW.sweep * Math.sin(a), show };
  };
  const rabbitShadow = (t: number) => {
    const { a } = rabbitAt(t);
    const s = shadowOf(a, t);
    // It hops along: one hop for every 0.45 radian it moves.
    return { ...s, y: SHADOW.floor - 50 * Math.abs(Math.sin((a * Math.PI) / 0.45)) };
  };
  // A soft note on each of the rabbit's landings while its shadow shows, until the bird has flown to the globe.
  const hopsAt = (t: number) => Math.floor(-rabbitAt(t).a / 0.45);
  for (let t = tTurn; t < tLoose + 2; t += 1 / 60) {
    const k = hopsAt(t + 1 / 60);
    if (k !== hopsAt(t) && rabbitShadow(t).show > 0.5) at(t, { sound: () => playPlink(k) });
  }
  const tRabbitShows = (() => {
    let t = tTurn;
    while (rabbitShadow(t).show < 0.5) t += 0.02;
    return t;
  })();
  at(tRabbitShows, {
    say: {
      de: "Schau, ein Hase an der Wand!",
      en: "Look, a bunny on the wall!",
      zh: "看，墙上有只小兔子！",
      hi: "देखो, दीवार पर खरगोश!",
      es: "¡Mira, un conejito en la pared!",
      ar: "واو، أرنب على الحائط!",
      ru: "Смотри, зайчик на стене!",
    },
  });
  const tBirdShows = (() => {
    let t = tRabbitShows;
    while (shadowOf(cutout(BIRD0, t).a, t).show < 0.5) t += 0.02;
    return t;
  })();
  at(tBirdShows, { sound: playTweet });

  /* The paper bird comes loose, flutters over to the globe and lands on its button. */
  const loose = cutout(BIRD0, tLoose).pt;
  const looseShadowX = shadowOf(cutout(BIRD0, tLoose).a, tLoose).x;
  const birdPath = pathOf(
    quad(loose, { x: loose.x + 50, y: 320 }, { x: 4560, y: 340 }),
    quad({ x: 4560, y: 340 }, { x: 4640, y: 360 }, { x: 4680, y: 470 }),
    quad({ x: 4680, y: 470 }, { x: 4720, y: 380 }, { x: 4790, y: 440 }),
    quad({ x: 4790, y: 440 }, { x: 4880, y: 470 }, { x: GLOBE_BUTTON.x, y: GLOBE_BUTTON.y - 18 }),
  );
  const tGlobe = tLoose + birdPath.total / BIRD_SPEED;
  at(tLoose, { sound: playPop });
  at(tLoose + 0.3, { sound: playTrill });
  /** Where the paper bird flies once it is loose, and its tilt in degrees; null before. */
  const birdFlying = (t: number): { pt: Pt; tilt: number } | null => {
    if (t < tLoose) return null;
    const p = along(birdPath, Math.min(birdPath.total, (t - tLoose) * BIRD_SPEED));
    const flying = t < tGlobe;
    return { pt: p.pt, tilt: flying ? deg(p.angle) * 0.4 : 0 };
  };
  /** The flying bird's shadow, big on the wall while it is still near the lamp. */
  const birdShadow = (t: number) => {
    const onHoop = birdOnHoop(t);
    if (onHoop) return { ...shadowOf(onHoop.a, t), y: SHADOW.floor - 160 };
    // From where its shadow was on the hoop, it moves further and faster than the bird, as a shadow does.
    const pt = birdFlying(t)?.pt ?? loose;
    return { x: looseShadowX + 1.3 * (pt.x - loose.x), y: SHADOW.floor - 160 - 1.2 * (loose.y - pt.y), show: 1 - seg(t, tLoose + 0.5, tLoose + 1.4) };
  };

  /* Click: the globe lights up, wobbles and turns. */
  at(tGlobe, { sound: playClick });
  at(tGlobe + 0.1, { sound: playDing });
  at(tGlobe + 0.6, { sound: playBeam });
  /** How far the globe's button is pressed down (0 to 1). */
  const globeButton = (t: number) => easeOut(seg(t, tGlobe - 0.05, tGlobe + 0.1));
  /** How brightly the globe shines (0 to 1). */
  const globeGlow = (t: number) => easeOut(seg(t, tGlobe + 0.1, tGlobe + 0.7));
  /** How far the globe has turned, in radians: it speeds up, then turns evenly, and stops when the level is over. */
  const globeTurn = (t: number) => {
    const u = Math.max(0, Math.min(t, tDone) - tGlobe - 0.3);
    return u < 1 ? 0.8 * u * u : 0.8 + 1.6 * (u - 1);
  };
  /** A wobble in degrees as it starts, dying away. */
  const globeWobble = (t: number) => {
    const u = t - tGlobe;
    return u <= 0 ? 0 : 7 * Math.sin(u * 14) * Math.exp(-3 * u);
  };

  /* The glowing globe calls the fireflies: they fly over the top of it and on to the star lamp, the one furthest left first. */
  const tCall = (i: number) => tGlobe + 0.9 + FLY_GAP * (FIREFLIES - 1 - i);
  const FIRST = FIREFLIES - 1;
  for (let i = 0; i < FIREFLIES; i++) at(tCall(i), { sound: () => playChimeNote(i + 2) });
  at(tCall(FIRST) + 0.2, { sound: playWhoosh });
  const overLamp = { x: LAMP.x, y: DOME_Y - LAMP.r - 70 };
  const toLamp = Array.from({ length: FIREFLIES }, (_, i) => {
    const s = tableSeat(i);
    const left = { x: GLOBE.x - ROUND_GLOBE, y: GLOBE.y };
    const right = { x: GLOBE.x + ROUND_GLOBE, y: GLOBE.y };
    return pathOf(
      quad(s, { x: s.x + 120, y: 420 }, left),
      // Round over the top of the globe.
      arc(GLOBE.x, GLOBE.y, ROUND_GLOBE, 180, 360),
      quad(right, { x: 5200, y: 330 }, overLamp),
    );
  });
  const tArrive = (i: number) => tCall(i) + toLamp[i].total / FLY_SPEED;
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
    // A little up and down while flying, each firefly in its own rhythm, calming down as it lands.
    const bob = 9 * Math.sin(t * 6 + i * 1.7);
    const first = toTable[i];
    const d = (t - tGo(i)) * FLY_SPEED;
    if (d < first.total) {
      const p = along(first, d).pt;
      const k = easeOut(seg(t, tGo(i), tGo(i) + 0.35));
      const calm = 1 - seg(d, first.total - 120, first.total);
      return { pt: { x: lerp(home.x, p.x, k), y: lerp(home.y, p.y + bob * calm, k) }, glow };
    }
    if (t < tCall(i)) return { pt: tableSeat(i), glow };
    const second = toLamp[i];
    const d2 = (t - tCall(i)) * FLY_SPEED;
    if (d2 < second.total) {
      const p = along(second, d2).pt;
      return { pt: { x: p.x, y: p.y + bob * seg(d2, 0, 120) * (1 - seg(d2, second.total - 120, second.total)) }, glow };
    }
    const k = easeInOut(seg(t, tArrive(i), tArrive(i) + 0.5));
    const s = seat(i);
    return { pt: { x: lerp(overLamp.x, s.x, k), y: lerp(overLamp.y, s.y, k) }, glow };
  };

  /* Each bulb comes on when the first firefly flies past it. */
  const bulbTimes = BULBS.map((bx) => {
    const i = toTable[0].pts.findIndex((p) => p.x >= bx);
    return tGo(0) + toTable[0].s[i] / FLY_SPEED;
  });
  // Every second bulb rings a note, up the scale and down again.
  const NOTES = [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1];
  bulbTimes.forEach((tb, k) => {
    if (k % 2 === 0) at(tb, { sound: () => playChimeNote(NOTES[(k / 2) % NOTES.length]) });
  });
  const bulbOn = (k: number, t: number) => easeOut(seg(t, bulbTimes[k], bulbTimes[k] + 0.25));

  /* When all fireflies sit on it, the star lamp comes on and throws stars all over the room. */
  const tLamp = Math.max(...Array.from({ length: FIREFLIES }, (_, i) => tArrive(i))) + 0.6;
  const tOwl = tLamp + 2.2;
  tDone = tLamp + 4.6;
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
  at(tLamp + 1.2, {
    say: {
      de: "Licht an! Alles funkelt!",
      en: "Lights on! Everything sparkles!",
      zh: "灯亮啦！一切都闪闪发光！",
      hi: "रोशनी जल गई! सब चमक रहा है!",
      es: "¡Luz encendida! ¡Todo brilla!",
      ar: "النور مضاء! كل شيء يلمع!",
      ru: "Свет горит! Всё сверкает!",
    },
  });
  at(tOwl, { sound: playHoot });
  at(tOwl + 0.6, { sound: playTwinkle });
  at(tDone, { done: true });

  /** Where the lava lamp, its shadows and the globe are all in the picture. */
  const LAVA_VIEW = 4450;
  /**
   * Where the camera looks: the light on its way, the jar while the fireflies wake, the first firefly along the
   * fairy lights, the lava lamp with the shadows on the wall and the globe, then over to the star lamp and the bed.
   */
  const focusX = (t: number) => {
    if (t < 0) return 0;
    if (t < tBall) return beamFront(t).x;
    if (t < tSpot) return DISCO.x + 100;
    if (t < tJar) return spotAt(t).x;
    if (t < tGo(0) + 0.6) return JAR.x;
    if (t < tSwitch) return Math.min(LAVA_VIEW, Math.max(JAR.x, fireflyAt(0, t).pt.x - 120));
    return lerp(LAVA_VIEW, 5680, easeInOut(seg(t, tCall(FIRST) + 1.2, tArrive(FIRST) + 0.4)));
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
    tSeat,
    tSwitch,
    tRise,
    tTurn,
    tRabbitShows,
    tBirdShows,
    tLoose,
    tGlobe,
    tCall,
    tArrive,
    tLamp,
    tOwl,
    mirrorTilt,
    beam,
    beamFront,
    spin,
    spotAt,
    tWake,
    fireflyAt,
    tableSeat,
    bulbOn,
    lavaGlow,
    switchDown,
    blobAt,
    heat,
    carousel,
    rabbitAt,
    birdOnHoop,
    rabbitShadow,
    birdShadow,
    birdFlying,
    globeButton,
    globeGlow,
    globeTurn,
    globeWobble,
    lampGlow,
    lampTurn,
    dark,
    cameraTarget,
  };
}
