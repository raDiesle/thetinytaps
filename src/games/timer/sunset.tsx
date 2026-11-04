import { memo, type CSSProperties } from "react";
import { Draw, Family, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Sonnenuntergang (H-54): for „noch zehn Minuten, dann ist Schlafenszeit“ – the sun sinks behind the hills, the sky
// goes orange, then blue, the first stars come out and the land grows dark with it, so the screen gets calmer as the
// time runs out. The moon peeks over the hills from the start (where it goes, H-64) and rises as the sun goes down;
// at the end it stands high, the windows of the little house are lit and the fox family yawns. Every second the
// windmill's sails turn a step (H-63). Sky and land darken by big layers fading in (`opacity`), the sun and moon move
// by `transform` inside boxes cut off below the hills' ridge (`overflow: hidden`), never by drawing again.

/** The sun: its middle, radius, its top at the start, and its top at the end – below `SKY_CUT`, so it is gone. */
export const SUN = { cx: 430, r: 105, top: 150, set: 640 } as const;

/** The moon: its middle, radius, its top at the end, and its top at the start – just peeking over the hills. */
export const MOON = { cx: 900, r: 66, top: 165, start: 560 } as const;

/** Where the boxes holding the sun and the moon end below: under the hills' ridge everywhere they pass, so no cut shows. */
export const SKY_CUT = 625;

/** The ground the fox family stands on, on the front hill. */
export const SUNSET_FLOOR = 790;

/** The fox grown-up's place, its child left of it. */
export const SUNSET_FAMILY = 1130;

/** The windmill on the far hill: where its sails turn. */
const MILL = { cx: 735, cy: 470, sails: 190 } as const;

/** The little house on the front hill and its two windows, lit as night comes. */
const HOUSE = { x: 250, y: 590, w: 150, h: 120 } as const;

/** The far hills' ridge as curves (each from the end of the one before), in front of the sun and the moon. */
const RIDGE: { ctrl: [number, number]; to: [number, number] }[] = [
  { ctrl: [260, 520], to: [520, 590] },
  { ctrl: [780, 660], to: [1040, 560] },
  { ctrl: [1320, 460], to: [1600, 545] },
];
const RIDGE_START: [number, number] = [0, 600];

/** The ridge's height at `x`, worked out from its curves (for the checks that the sun and the moon set behind it). */
export function ridgeAt(x: number): number {
  let from = RIDGE_START;
  for (const { ctrl, to } of RIDGE) {
    if (x <= to[0]) {
      // The curves' controls lie halfway in x, so x grows evenly with t.
      const t = (x - from[0]) / (to[0] - from[0]);
      return (1 - t) ** 2 * from[1] + 2 * t * (1 - t) * ctrl[1] + t ** 2 * to[1];
    }
    from = to;
  }
  return from[1];
}

/** The far hills, and the front hill, drawn in front of the sun and the moon. */
const FAR_HILLS = `M${RIDGE_START.join(" ")} ${RIDGE.map(({ ctrl, to }) => `Q${ctrl.join(" ")} ${to.join(" ")}`).join(" ")} V900 H0 Z`;
const FRONT_HILL = "M0 700 Q400 640 820 700 T1600 690 V900 H0 Z";

/**
 * The stars, coming out one after another in the second half (`at`: the part of the time when each begins to shine),
 * kept clear of the sun's and the moon's ways.
 */
export const STARS: { x: number; y: number; at: number }[] = [
  { x: 1180, y: 140, at: 0.5 },
  { x: 880, y: 110, at: 0.56 },
  { x: 1330, y: 250, at: 0.62 },
  { x: 640, y: 170, at: 0.67 },
  { x: 1420, y: 120, at: 0.72 },
  { x: 260, y: 100, at: 0.77 },
  { x: 760, y: 300, at: 0.81 },
  { x: 1240, y: 380, at: 0.85 },
  { x: 590, y: 400, at: 0.89 },
  { x: 1060, y: 430, at: 0.93 },
];

/** The day's sky behind everything; drawn once. */
const DaySky = memo(function DaySky() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-day" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8fd3ff" />
            <stop offset="0.7" stopColor="#d9f1ff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-day)" />
        {[
          [700, 150],
          [1250, 250],
        ].map(([cx, cy]) => (
          <g key={cx} fill="#fff" opacity="0.85">
            <ellipse cx={cx} cy={cy} rx="66" ry="26" />
            <ellipse cx={cx + 40} cy={cy - 16} rx="42" ry="26" />
          </g>
        ))}
      </Draw>
    </Layer>
  );
});

/** The evening's and the night's sky, each a layer fading in over the day's (their gradients in the CSS). */
function SkyLight() {
  return (
    <>
      <Layer x={0} y={0} w={STAGE_W} h={SKY_CUT + 40} className="tm-dusk-sky tm-move" />
      <Layer x={0} y={0} w={STAGE_W} h={SKY_CUT + 40} className="tm-night-sky tm-move" />
    </>
  );
}

/** One star, a small layer of its own that comes out at its time. */
function Star({ x, y, at }: { x: number; y: number; at: number }) {
  return (
    <Layer x={x - 16} y={y - 16} w={32} h={32} className="tm-star tm-move" style={{ "--tm-at": at } as CSSProperties}>
      <svg viewBox="0 0 32 32">
        <path d="M16 2 L19.5 12.5 L30 16 L19.5 19.5 L16 30 L12.5 19.5 L2 16 L12.5 12.5 Z" fill="#fff3bf" />
      </svg>
    </Layer>
  );
}

/** The top of the boxes the sun and the moon move in. */
const SKY_TOP = 80;

/** Where a round thing of radius `r` with its top at `top` sits in a box `pad` wider than it on each side, in percent. */
function inBox(r: number, top: number, pad: number): CSSProperties {
  const w = 2 * r + 2 * pad;
  const h = SKY_CUT - SKY_TOP;
  return { left: `${(pad / w) * 100}%`, top: `${((top - SKY_TOP) / h) * 100}%`, width: `${((2 * r) / w) * 100}%`, height: `${((2 * r) / h) * 100}%` };
}

/** The sun going down behind the hills, getting redder; a tap lights what is still above them (H-51). */
function Sun({ glow }: { glow: number }) {
  const size = 2 * SUN.r;
  const pad = 40;
  const style = { ...inBox(SUN.r, SUN.top, pad), "--tm-sun-set": `${((SUN.set - SUN.top) / size) * 100}%` } as CSSProperties;
  return (
    <Layer x={SUN.cx - SUN.r - pad} y={SKY_TOP} w={size + 2 * pad} h={SKY_CUT - SKY_TOP} className="tm-sky-box">
      <div className="tm-sun tm-move" style={style}>
        <div className="tm-sun-red tm-move" />
        <LeftGlow n={glow} />
      </div>
    </Layer>
  );
}

/** The moon rising from behind the hills, where it peeked out from the start. */
function Moon() {
  const size = 2 * MOON.r;
  const style = { ...inBox(MOON.r, MOON.top, 0), "--tm-moon-from": `${((MOON.start - MOON.top) / size) * 100}%` } as CSSProperties;
  return (
    <Layer x={MOON.cx - MOON.r} y={SKY_TOP} w={size} h={SKY_CUT - SKY_TOP} className="tm-sky-box">
      <div className="tm-moon tm-move" style={style}>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#fff3bf" />
          <circle cx="34" cy="38" r="9" fill="#f1e2a0" />
          <circle cx="62" cy="62" r="12" fill="#f1e2a0" />
          <circle cx="66" cy="30" r="6" fill="#f1e2a0" />
        </svg>
      </div>
    </Layer>
  );
}

/** The hills with the windmill's tower and the little house, in front of the sun and the moon; drawn once. */
const Hills = memo(function Hills() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={FAR_HILLS} fill="#86c95f" />
        <path
          d={`M${MILL.cx - 26} ${MILL.cy + 150} L${MILL.cx - 16} ${MILL.cy} H${MILL.cx + 16} L${MILL.cx + 26} ${MILL.cy + 150} Z`}
          fill="#f1e3c8"
          stroke={INK}
          strokeWidth="5"
        />
        <path d={`M${MILL.cx - 22} ${MILL.cy + 4} L${MILL.cx} ${MILL.cy - 24} L${MILL.cx + 22} ${MILL.cy + 4} Z`} fill="#c0504d" stroke={INK} strokeWidth="5" />
        <path d={FRONT_HILL} fill="#6fb24c" />
        {/* The little house, its windows dark until night comes (the lit ones are a layer of their own). */}
        <rect x={HOUSE.x} y={HOUSE.y} width={HOUSE.w} height={HOUSE.h} fill="#ffe3b3" stroke={INK} strokeWidth="5" />
        <path
          d={`M${HOUSE.x - 18} ${HOUSE.y + 6} L${HOUSE.x + HOUSE.w / 2} ${HOUSE.y - 70} L${HOUSE.x + HOUSE.w + 18} ${HOUSE.y + 6} Z`}
          fill="#c0504d"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x={HOUSE.x + 22} y={HOUSE.y + 28} width="40" height="40" fill="#3b4a7a" stroke={INK} strokeWidth="4" />
        <rect x={HOUSE.x + 88} y={HOUSE.y + 28} width="40" height="40" fill="#3b4a7a" stroke={INK} strokeWidth="4" />
        <circle cx="520" cy="640" r="46" fill="#4f9a3a" stroke={INK} strokeWidth="4" />
        <rect x="512" y="676" width="16" height="40" fill="#8a5a2b" stroke={INK} strokeWidth="4" />
      </Draw>
    </Layer>
  );
});

/** The windmill's sails, a step round every second (H-63). */
function Sails() {
  const s = MILL.sails;
  return (
    <Layer x={MILL.cx - s / 2} y={MILL.cy - s / 2} w={s} h={s}>
      <div className="tm-sails tm-beat">
        <svg viewBox="0 0 100 100">
          {[0, 90, 180, 270].map((a) => (
            <rect key={a} x="45" y="4" width="10" height="44" rx="2" fill="#fff" stroke={INK} strokeWidth="3" transform={`rotate(${a} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="7" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
        </svg>
      </div>
    </Layer>
  );
}

/** The land growing dark as night comes, a layer of the hills' shape fading in over them. */
const Dusk = memo(function Dusk() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-dusk-land tm-move">
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={FAR_HILLS} fill="#141a3c" />
      </Draw>
    </Layer>
  );
});

/** The house's windows lighting up as it gets dark. */
function Windows() {
  return (
    <Layer x={HOUSE.x + 22} y={HOUSE.y + 28} w={106} h={40} className="tm-windows tm-move">
      <svg viewBox="0 0 106 40">
        <rect x="0" y="0" width="40" height="40" fill="#ffd43b" stroke={INK} strokeWidth="4" />
        <rect x="66" y="0" width="40" height="40" fill="#ffd43b" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
}

/** The whole picture; `done` has the fox family yawn. */
export function SunsetScene({ glow, done }: { glow: number; done: boolean }) {
  return (
    <>
      <DaySky />
      <SkyLight />
      {STARS.map((s) => (
        <Star key={s.x} {...s} />
      ))}
      <Sun glow={glow} />
      <Moon />
      <Hills />
      <Sails />
      <Dusk />
      <Windows />
      <Family kind="fox" x={SUNSET_FAMILY} floor={SUNSET_FLOOR} childLeft sleepy={done} />
    </>
  );
}
