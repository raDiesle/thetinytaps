import { type CSSProperties, memo } from "react";
import type { Daytime } from "@/lib/days";

// The basin seen from above, as a child stands at it: tiles on the wall behind, the counter, the white basin with its
// drain, the chrome tap behind it and the soap pump beside it. The picture is 1600 × 900 units (16 : 9, the video's
// stage); it is drawn once and lies still, and every part that moves (the tap's lever, the water, the pump's head, the
// towel) is an HTML layer of its own over it, placed in the same units by `place`.

/** The picture's size in units. */
export const STAGE_W = 1600;
export const STAGE_H = 900;

/** A box in picture units. */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where a layer lies on the stage: a box in picture units as percentages of the stage. */
export const place = ({ x, y, width, height }: Box): CSSProperties => ({
  left: `${(x / STAGE_W) * 100}%`,
  top: `${(y / STAGE_H) * 100}%`,
  width: `${(width / STAGE_W) * 100}%`,
  height: `${(height / STAGE_H) * 100}%`,
});

/** Where the water comes out of the tap. */
export const SPOUT = { x: 800, y: 332 };

/** The layers' places on the stage. */
export const AREAS = {
  left: { x: 440, y: 240, width: 340, height: 700 },
  right: { x: 820, y: 240, width: 340, height: 700 },
  lever: { x: 740, y: 150, width: 120, height: 110 },
  stream: { x: SPOUT.x - 26, y: SPOUT.y - 4, width: 52, height: 370 },
  splash: { x: SPOUT.x - 70, y: 660, width: 140, height: 70 },
  pumpHead: { x: 1080, y: 120, width: 140, height: 90 },
  towel: { x: 360, y: 300, width: 880, height: 600 },
} satisfies Record<string, Box>;

const CHROME_STOPS = (
  <>
    <stop offset="0" stopColor="#8d99a6" />
    <stop offset="0.3" stopColor="#f4f8fb" />
    <stop offset="0.55" stopColor="#c3ccd5" />
    <stop offset="0.8" stopColor="#eef3f7" />
    <stop offset="1" stopColor="#7d8996" />
  </>
);

/** The still picture: wall, counter, basin, tap and the soap bottle (its head is a layer of its own). */
export const SinkPicture = memo(function SinkPicture({ daytime, label }: { daytime: Daytime; label: string }) {
  return (
    <svg className="hw-sink" viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} role="img" aria-label={label}>
      <defs>
        <pattern id="hw-tiles" width={80} height={80} patternUnits="userSpaceOnUse">
          <rect width={80} height={80} fill={daytime === "evening" ? "#dcebf5" : "#e8f6ff"} />
          <path d="M0 1 H80 M1 0 V80" stroke="#bfdcee" strokeWidth={4} />
          <path d="M10 16 Q10 10 16 10 H28" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
        </pattern>
        <linearGradient id="hw-counter" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9dccb" />
          <stop offset="1" stopColor="#f6eee3" />
        </linearGradient>
        <radialGradient id="hw-rim" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.75" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe8ef" />
        </radialGradient>
        <radialGradient id="hw-bowl" cx="0.5" cy="0.7" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#eef4f8" />
          <stop offset="1" stopColor="#b9c8d4" />
        </radialGradient>
        <linearGradient id="hw-chrome" x1="0" y1="0" x2="1" y2="0">
          {CHROME_STOPS}
        </linearGradient>
        <radialGradient id="hw-drain" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f4f8fb" />
          <stop offset="1" stopColor="#7d8996" />
        </radialGradient>
        <linearGradient id="hw-soap" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f0a6c8" />
          <stop offset="0.4" stopColor="#ffd6ea" />
          <stop offset="1" stopColor="#e88fb8" />
        </linearGradient>
        <filter id="hw-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={10} />
        </filter>
      </defs>
      <rect width={STAGE_W} height={210} fill="url(#hw-tiles)" />
      <rect y={196} width={STAGE_W} height={STAGE_H - 196} fill="url(#hw-counter)" />
      <rect y={196} width={STAGE_W} height={14} fill="#d6c6b2" />
      {/* Specks in the counter's stone. */}
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 397) % STAGE_W} cy={240 + ((i * 211) % 640)} r={2 + (i % 3)} fill="#c9b8a2" opacity={0.35} />
      ))}
      {/* The basin: its shadow on the counter, the rim and the bowl, dark under the rim where the light doesn't reach. */}
      <ellipse cx={812} cy={668} rx={566} ry={330} fill="#7a6a58" opacity={0.25} filter="url(#hw-blur)" />
      <ellipse cx={800} cy={650} rx={560} ry={330} fill="url(#hw-rim)" stroke="#c8d3dc" strokeWidth={4} />
      <ellipse cx={800} cy={672} rx={474} ry={266} fill="url(#hw-bowl)" stroke="#c3d0da" strokeWidth={3} />
      <path d="M380 600 Q800 380 1220 600" fill="none" stroke="#9fb1bf" strokeWidth={22} opacity={0.18} filter="url(#hw-blur)" />
      <circle cx={800} cy={700} r={36} fill="url(#hw-drain)" stroke="#6f7b88" strokeWidth={3} />
      {[-16, 0, 16].map((d) => (
        <path key={d} d={`M${786} ${700 + d} H${814}`} stroke="#5d6874" strokeWidth={4} strokeLinecap="round" />
      ))}
      {/* The tap: its foot on the counter and the spout reaching out over the basin. */}
      <ellipse cx={800} cy={222} rx={78} ry={30} fill="#6f7b88" opacity={0.3} filter="url(#hw-blur)" />
      <ellipse cx={800} cy={212} rx={72} ry={28} fill="url(#hw-chrome)" stroke="#6f7b88" strokeWidth={3} />
      <path d="M774 214 L774 300 Q774 334 800 334 Q826 334 826 300 L826 214 Z" fill="url(#hw-chrome)" stroke="#6f7b88" strokeWidth={3} />
      <ellipse cx={800} cy={326} rx={20} ry={9} fill="#5d6874" />
      <path d="M786 230 L786 296" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
      {/* The soap bottle, its head with the nozzle lying over it. */}
      <ellipse cx={1158} cy={322} rx={70} ry={20} fill="#7a6a58" opacity={0.25} filter="url(#hw-blur)" />
      <rect x={1092} y={188} width={124} height={134} rx={34} fill="url(#hw-soap)" stroke="#c46a96" strokeWidth={3} />
      <rect x={1110} y={206} width={20} height={90} rx={10} fill="#fff" opacity={0.55} />
      <circle cx={1170} cy={262} r={18} fill="#fff" opacity={0.6} />
      <rect x={1136} y={170} width={36} height={24} rx={6} fill="#f2f2f2" stroke="#9a9a9a" strokeWidth={2} />
    </svg>
  );
});

/** The tap's lever, which turns to let the water run and back to stop it. */
export const LeverArt = memo(function LeverArt() {
  return (
    <svg viewBox="0 0 120 110" aria-hidden>
      <defs>
        <linearGradient id="hw-lever" x1="0" y1="0" x2="1" y2="0">
          {CHROME_STOPS}
        </linearGradient>
      </defs>
      <path d="M48 70 L52 14 Q60 4 68 14 L72 70 Z" fill="url(#hw-lever)" stroke="#6f7b88" strokeWidth={3} strokeLinejoin="round" />
      <circle cx={60} cy={72} r={20} fill="url(#hw-lever)" stroke="#6f7b88" strokeWidth={3} />
      <circle cx={54} cy={66} r={5} fill="#fff" opacity={0.8} />
    </svg>
  );
});

/** The water falling from the spout: light stripes running down inside the stream, a layer moving by itself. */
export function Stream() {
  return (
    <div className="hw-stream-clip">
      <div className="hw-stream-flow" />
    </div>
  );
}

/** Where the water lands in the basin: a ring of splashing water. */
export const SplashArt = memo(function SplashArt() {
  return (
    <svg viewBox="-70 -35 140 70" aria-hidden>
      <ellipse cx={0} cy={0} rx={60} ry={24} fill="none" stroke="#9fd3f0" strokeWidth={5} opacity={0.7} />
      <ellipse cx={0} cy={0} rx={34} ry={13} fill="#d8f0ff" opacity={0.8} />
      {[-48, -22, 24, 50].map((x, i) => (
        <circle key={i} cx={x} cy={-14 - (i % 2) * 8} r={4} fill="#bfe6fb" />
      ))}
    </svg>
  );
});

/** The pump's head, pressed down to give the soap. */
export const PumpHeadArt = memo(function PumpHeadArt() {
  return (
    <svg viewBox="0 0 140 90" aria-hidden>
      <rect x={58} y={40} width={22} height={46} fill="#e6e6e6" stroke="#9a9a9a" strokeWidth={2} />
      <path d="M44 22 Q44 10 56 10 L104 10 Q116 10 116 22 L116 40 L44 40 Z" fill="#fafafa" stroke="#9a9a9a" strokeWidth={3} />
      <path d="M44 22 L8 26 Q2 27 2 33 L2 36 L44 34 Z" fill="#fafafa" stroke="#9a9a9a" strokeWidth={3} strokeLinejoin="round" />
      <rect x={56} y={16} width={30} height={8} rx={4} fill="#fff" />
    </svg>
  );
});

/** A soft terry towel, striped at its end, that comes to dry the hands. */
export const TowelArt = memo(function TowelArt() {
  return (
    <svg viewBox="0 0 880 600" aria-hidden>
      <defs>
        <pattern id="hw-terry" width={14} height={14} patternUnits="userSpaceOnUse">
          <rect width={14} height={14} fill="#7fd1c7" />
          <circle cx={4} cy={4} r={2.4} fill="#93dcd3" />
          <circle cx={11} cy={10} r={2.4} fill="#6cc3b8" />
        </pattern>
        <filter id="hw-towel-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <rect x={60} y={70} width={800} height={520} rx={60} fill="#3d4e4a" opacity={0.25} filter="url(#hw-towel-blur)" />
      <path
        d="M40 60 Q40 30 80 30 L820 40 Q850 40 850 70 L840 540 Q840 572 808 572 L84 580 Q48 580 48 548 Z"
        fill="url(#hw-terry)"
        stroke="#4aa59a"
        strokeWidth={5}
      />
      <rect x={60} y={460} width={770} height={26} fill="#fff" opacity={0.7} />
      <rect x={60} y={500} width={770} height={14} fill="#ffcf5a" opacity={0.85} />
      <path d="M90 90 Q300 70 520 100" fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" opacity={0.25} />
    </svg>
  );
});
