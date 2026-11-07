import { memo, type CSSProperties } from "react";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Sonnenuntergang (H-54): for „noch zehn Minuten, dann ist Schlafenszeit“ – a big sun sinks behind one round hill
// and reddens, the sky goes orange, then blue, and once the sun is gone the moon rises from behind the hill; the first
// stars come out and the land grows dark with it, so the screen gets calmer as the time runs out (user feedback,
// November 2026: one hill to see, the sun much bigger, the moon after it). At the end the moon stands high and the
// windows of the little house are lit. Every second the windmill's sails turn a step (H-63). Sky and land darken by
// big layers fading in (`opacity`), the sun and moon move by `transform` inside boxes cut off below the hill's ridge
// (`overflow: hidden`), never by drawing again.

/** The sun: its middle, radius, its top at the start, and its top when it has set – below `SKY_CUT`, so it is gone. */
export const SUN = { cx: 640, r: 190, top: 110, set: 665 } as const;

/** The share of the time the sun takes to set; the moon rises after it. */
export const SUN_SET_AT = 0.55;

/** The moon: its middle, radius, its top at the end, and its top at the start – hidden behind the hill until the sun is gone. */
export const MOON = { cx: 1180, r: 85, top: 130, start: 665 } as const;

/** When the moon starts to rise from behind the hill, a share of the time. */
export const MOON_FROM = 0.5;

/** Where the boxes holding the sun and the moon end below: under the hill's ridge everywhere they pass, so no cut shows. */
export const SKY_CUT = 660;

/** The ground at the hill's foot. */
export const SUNSET_FLOOR = 790;

/** The windmill on the hill's right shoulder: where its sails turn. */
const MILL = { cx: 980, cy: 372, sails: 190 } as const;

/** The little house on the hill's left slope and its two windows, lit as night comes. */
const HOUSE = { x: 230, y: 545, w: 140, h: 120 } as const;

/** The hill's ridge, one curve over the whole picture: its ends and its control point (halfway in x). */
const RIDGE = { end: 650, ctrl: 380 } as const;

/** The ridge's height at `x` (for the checks that the sun and the moon set behind it). */
export function ridgeAt(x: number): number {
  const t = x / STAGE_W;
  return (1 - t) ** 2 * RIDGE.end + 2 * t * (1 - t) * RIDGE.ctrl + t ** 2 * RIDGE.end;
}

/** The hill, in front of the sun and the moon. */
const HILL = `M0 ${RIDGE.end} Q${STAGE_W / 2} ${RIDGE.ctrl} ${STAGE_W} ${RIDGE.end} V900 H0 Z`;

/**
 * The stars, coming out one after another once the sun is gone (`at`: the part of the time when each begins to shine),
 * kept clear of where the moon ends up.
 */
export const STARS: { x: number; y: number; at: number }[] = [
  { x: 300, y: 130, at: 0.56 },
  { x: 860, y: 110, at: 0.6 },
  { x: 1420, y: 170, at: 0.64 },
  { x: 560, y: 200, at: 0.68 },
  { x: 1000, y: 180, at: 0.72 },
  { x: 720, y: 330, at: 0.76 },
  { x: 1330, y: 340, at: 0.8 },
  { x: 430, y: 330, at: 0.84 },
  { x: 880, y: 270, at: 0.88 },
  { x: 1070, y: 400, at: 0.92 },
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

/** The big sun going down behind the hill, getting redder; a tap lights what is still above it (H-51). */
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

/** The moon rising from behind the hill once the sun has gone. */
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

/** The hill with the windmill's tower and the little house, in front of the sun and the moon; drawn once. */
const Hills = memo(function Hills() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={HILL} fill="#7cc35a" />
        <path
          d={`M${MILL.cx - 26} ${MILL.cy + 160} L${MILL.cx - 16} ${MILL.cy} H${MILL.cx + 16} L${MILL.cx + 26} ${MILL.cy + 160} Z`}
          fill="#f1e3c8"
          stroke={INK}
          strokeWidth="5"
        />
        <path d={`M${MILL.cx - 22} ${MILL.cy + 4} L${MILL.cx} ${MILL.cy - 24} L${MILL.cx + 22} ${MILL.cy + 4} Z`} fill="#c0504d" stroke={INK} strokeWidth="5" />
        {/* The little house, its windows dark until night comes (the lit ones are a layer of their own). */}
        <rect x={HOUSE.x} y={HOUSE.y} width={HOUSE.w} height={HOUSE.h} fill="#ffe3b3" stroke={INK} strokeWidth="5" />
        <path
          d={`M${HOUSE.x - 18} ${HOUSE.y + 6} L${HOUSE.x + HOUSE.w / 2} ${HOUSE.y - 70} L${HOUSE.x + HOUSE.w + 18} ${HOUSE.y + 6} Z`}
          fill="#c0504d"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect x={HOUSE.x + 20} y={HOUSE.y + 28} width="40" height="40" fill="#3b4a7a" stroke={INK} strokeWidth="4" />
        <rect x={HOUSE.x + 80} y={HOUSE.y + 28} width="40" height="40" fill="#3b4a7a" stroke={INK} strokeWidth="4" />
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

/** The land growing dark as night comes, a layer of the hill's shape fading in over it. */
const Dusk = memo(function Dusk() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-dusk-land tm-move">
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={HILL} fill="#141a3c" />
      </Draw>
    </Layer>
  );
});

/** The house's windows lighting up as it gets dark. */
function Windows() {
  return (
    <Layer x={HOUSE.x + 20} y={HOUSE.y + 28} w={100} h={40} className="tm-windows tm-move">
      <svg viewBox="0 0 100 40">
        <rect x="0" y="0" width="40" height="40" fill="#ffd43b" stroke={INK} strokeWidth="4" />
        <rect x="60" y="0" width="40" height="40" fill="#ffd43b" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
}

/** The whole picture. */
export function SunsetScene({ glow }: { glow: number }) {
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
    </>
  );
}
