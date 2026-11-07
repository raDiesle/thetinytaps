import { memo, type CSSProperties, type ReactNode } from "react";
import { Draw, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Sonnenaufgang (H-54, once „Sonnenuntergang“; its id and this file keep the old name `sunset`): one round hill with a meadow full of flowers, drawn as coloured dots, and one big moon right
// in the picture's middle. First the moon goes down behind the hill while the stars go out one by one, the night's sky
// gives way to the morning's pink and the land grows light; then the big sun rises at the very same place, red at
// first and yellow as it climbs, until it stands high over the meadow at the end (user feedback, November 2026: no
// windmill and no house, flowers as dots, sun and moon much bigger and exactly in the middle, the moon setting first,
// then the sun rising). Every second a soft ring of light widens round the moon or the sun (H-63). Sky and land change
// by big layers fading (`opacity`), the sun and moon move by `transform` inside boxes cut off below the hill's ridge
// (`overflow: hidden`), never by drawing again.

/** The middle of the picture, where the moon sets and the sun rises. */
const MIDDLE = STAGE_W / 2;

/** The moon: its middle, radius, its top at the start (high), and its top once it has set – below `SKY_CUT`, so it is gone. */
export const MOON = { cx: MIDDLE, r: 240, top: 100, set: 650 } as const;

/** The share of the time the moon takes to set; the sun rises after it. */
export const MOON_SET_AT = 0.48;

/** The sun: its middle, radius, its top at the end (high), and its top at the start – hidden behind the hill. */
export const SUN = { cx: MIDDLE, r: 260, top: 85, start: 650 } as const;

/** When the sun starts to rise from behind the hill, a share of the time. */
export const SUN_FROM = 0.5;

/** Where the boxes holding the sun and the moon end below: under the hill's ridge everywhere they pass, so no cut shows. */
export const SKY_CUT = 645;

/** The hill's ridge, one curve over the whole picture: its ends and its control point (halfway in x). */
const RIDGE = { end: 700, ctrl: 550 } as const;

/** The ridge's height at `x` (for the checks that the sun and the moon set behind it and the flowers stand on the meadow). */
export function ridgeAt(x: number): number {
  const t = x / STAGE_W;
  return (1 - t) ** 2 * RIDGE.end + 2 * t * (1 - t) * RIDGE.ctrl + t ** 2 * RIDGE.end;
}

/** The hill, in front of the sun and the moon. */
const HILL = `M0 ${RIDGE.end} Q${STAGE_W / 2} ${RIDGE.ctrl} ${STAGE_W} ${RIDGE.end} V900 H0 Z`;

/** The flowers' colours: white, yellow, pink, red and lilac. */
const FLOWER_COLORS = ["#ffffff", "#ffd43b", "#f783ac", "#fa5252", "#b197fc"] as const;

/**
 * The flowers on the meadow, each a coloured dot with a light middle: in rows from the ridge down, smaller further
 * back, a little shifted so they don't stand in lines. Drawn once with the hill.
 */
export const FLOWERS: { x: number; y: number; r: number; color: string }[] = (() => {
  const out: { x: number; y: number; r: number; color: string }[] = [];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let row = 0; row < 6; row++) {
    const r = 6 + row * 1.6;
    for (let x = 150 + row * 37; x < 1450; x += 92 + row * 10) {
      const fx = x + (rand() - 0.5) * 50;
      const fy = ridgeAt(fx) + 26 + row * 26 + (rand() - 0.5) * 14;
      if (fy > 815) continue;
      out.push({ x: Math.round(fx), y: Math.round(fy), r: Math.round(r * 10) / 10, color: FLOWER_COLORS[Math.floor(rand() * FLOWER_COLORS.length)] });
    }
  }
  return out;
})();

/**
 * The stars, shining at the start and going out one after another as the morning comes (`at`: the part of the time
 * when each begins to fade), kept clear of the moon and the sun in the middle.
 */
export const STARS: { x: number; y: number; at: number }[] = [
  { x: 1180, y: 140, at: 0.06 },
  { x: 300, y: 130, at: 0.1 },
  { x: 1420, y: 230, at: 0.14 },
  { x: 460, y: 260, at: 0.18 },
  { x: 1120, y: 330, at: 0.22 },
  { x: 250, y: 380, at: 0.26 },
  { x: 1340, y: 420, at: 0.3 },
  { x: 480, y: 470, at: 0.34 },
  { x: 1450, y: 110, at: 0.38 },
  { x: 220, y: 250, at: 0.42 },
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
          [300, 200],
          [1250, 260],
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

/** The morning's and the night's sky, each a layer over the day's: the night fades first, then the morning's pink (gradients in the CSS). */
function SkyLight() {
  return (
    <>
      <Layer x={0} y={0} w={STAGE_W} h={SKY_CUT + 60} className="tm-dawn-sky tm-move" />
      <Layer x={0} y={0} w={STAGE_W} h={SKY_CUT + 60} className="tm-night-sky tm-move" />
    </>
  );
}

/** One star, a small layer of its own that goes out at its time. */
function Star({ x, y, at }: { x: number; y: number; at: number }) {
  return (
    <Layer x={x - 16} y={y - 16} w={32} h={32} className="tm-star tm-move" style={{ "--tm-at": at } as CSSProperties}>
      <svg viewBox="0 0 32 32">
        <path d="M16 2 L19.5 12.5 L30 16 L19.5 19.5 L16 30 L12.5 19.5 L2 16 L12.5 12.5 Z" fill="#fff3bf" />
      </svg>
    </Layer>
  );
}

/** The room on each side of the sun and the moon in their boxes, for the ring of light widening round them each second. */
const RING_PAD = 70;

/** Where a round thing of radius `r` with its top at `top` sits in its box (from the stage's top to `SKY_CUT`), in percent. */
function inBox(r: number, top: number): CSSProperties {
  const w = 2 * r + 2 * RING_PAD;
  return { left: `${(RING_PAD / w) * 100}%`, top: `${(top / SKY_CUT) * 100}%`, width: `${((2 * r) / w) * 100}%`, height: `${((2 * r) / SKY_CUT) * 100}%` };
}

/** The box a round thing of radius `r` in the middle moves in, cut off below the ridge. */
function SkyBox({ r, children }: { r: number; children: ReactNode }) {
  return (
    <Layer x={MIDDLE - r - RING_PAD} y={0} w={2 * r + 2 * RING_PAD} h={SKY_CUT} className="tm-sky-box">
      {children}
    </Layer>
  );
}

/** The big moon going down behind the hill first; a tap lights what is still above it (H-51). */
function Moon({ glow }: { glow: number }) {
  const style = { ...inBox(MOON.r, MOON.top), "--tm-moon-set": `${((MOON.set - MOON.top) / (2 * MOON.r)) * 100}%` } as CSSProperties;
  return (
    <SkyBox r={MOON.r}>
      <div className="tm-moon tm-move" style={style}>
        <div className="tm-ring tm-moon-ring tm-beat" />
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="49" fill="#fff3bf" />
          <circle cx="34" cy="38" r="9" fill="#f1e2a0" />
          <circle cx="62" cy="62" r="12" fill="#f1e2a0" />
          <circle cx="66" cy="30" r="6" fill="#f1e2a0" />
        </svg>
        <LeftGlow n={glow} />
      </div>
    </SkyBox>
  );
}

/** The big sun rising from behind the hill once the moon is gone, red at first and yellow as it climbs. */
function Sun({ glow }: { glow: number }) {
  const style = { ...inBox(SUN.r, SUN.top), "--tm-sun-from": `${((SUN.start - SUN.top) / (2 * SUN.r)) * 100}%` } as CSSProperties;
  return (
    <SkyBox r={SUN.r}>
      <div className="tm-sun tm-move" style={style}>
        <div className="tm-ring tm-sun-ring tm-beat" />
        <div className="tm-sun-face" />
        <div className="tm-sun-red tm-move" />
        <LeftGlow n={glow} />
      </div>
    </SkyBox>
  );
}

/** The hill with its flowers, in front of the sun and the moon; drawn once. */
const Hill = memo(function Hill() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={HILL} fill="#7cc35a" />
        {FLOWERS.map((f, i) => (
          <g key={i}>
            <circle cx={f.x} cy={f.y} r={f.r} fill={f.color} />
            <circle cx={f.x} cy={f.y} r={f.r * 0.38} fill={f.color === "#ffd43b" ? "#f08c00" : "#ffe066"} />
          </g>
        ))}
      </Draw>
    </Layer>
  );
});

/** The land dark at night and growing light with the morning, a layer of the hill's shape fading out over it. */
const NightLand = memo(function NightLand() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-night-land tm-move">
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={HILL} fill="#141a3c" />
      </Draw>
    </Layer>
  );
});

/** The whole picture. */
export function SunsetScene({ glow }: { glow: number }) {
  return (
    <>
      <DaySky />
      <SkyLight />
      {STARS.map((s) => (
        <Star key={s.x} {...s} />
      ))}
      <Moon glow={glow} />
      <Sun glow={glow} />
      <Hill />
      <NightLand />
    </>
  );
}
