import { memo, type CSSProperties } from "react";
import { Draw, Family, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Blume (H-53): time that brings something instead of running out, for waiting for something good. The bear child
// waters a little sprout in the flower bed, a drop every second (H-63); the stalk grows up along a stake to the red
// ribbon at its top, which shows from the start how far it goes (H-64), and at the end the flower opens. The stalk is
// one drawing sliding up out of a box cut off at the soil (`overflow: hidden`, moved by `transform`), never drawn again
// or stretched.

/** The stalk: its middle, its box's width, its top when grown (the bud) and the soil it comes out of. */
export const STALK = { cx: 800, w: 260, top: 240, soil: 790 } as const;

/** How much of the stalk shows at the start: a little sprout. */
export const SPROUT = 0.1;

/** The stake the stalk grows along, right of it, with the ribbon at its top: where the flower will open. */
export const STAKE = { x: 885, top: 205 } as const;

/** The ground the bear family stands on. */
export const FLOWER_FLOOR = 800;

/** The bear grown-up's place; its child, right of it, holds the watering can over the bed. */
export const FLOWER_FAMILY = 290;

/** The watering can in the bear child's hand, and where its drops fall from and to. */
const CAN = { x: 570, y: 690, w: 130, h: 90 } as const;
const SPOUT = { x: 700, y: 735, fall: 42 } as const;

/** The flower as it opens at the end, round the bud. */
const BLOOM = 230;

/** Sky, garden fence and grass; drawn once. The bucket (H-69) stands in the same garden. */
export const GardenBackdrop = memo(function GardenBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-garden-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a5dcff" />
            <stop offset="1" stopColor="#eef9ff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-garden-sky)" />
        <circle cx="1300" cy="160" r="64" fill="#ffe066" />
        {Array.from({ length: 17 }, (_, i) => (
          <path key={i} d={`M${i * 100 + 20} 640 V560 L${i * 100 + 50} 530 L${i * 100 + 80} 560 V640 Z`} fill="#fff4e0" stroke={INK} strokeWidth="4" />
        ))}
        <rect x="0" y="580" width={STAGE_W} height="16" fill="#e9d8b8" stroke={INK} strokeWidth="3" />
        <rect y="640" width={STAGE_W} height={STAGE_H - 640} fill="#8fd16a" />
        {[1080, 1220, 1360, 200].map((x) => (
          <g key={x} stroke={INK} strokeWidth="3">
            <path d={`M${x} 760 V700`} stroke="#3d8a32" strokeWidth="5" />
            <circle cx={x} cy="694" r="14" fill={x > 1300 ? "#ffd8e4" : "#fff3bf"} />
          </g>
        ))}
      </Draw>
    </Layer>
  );
});

/** The stake with the ribbon at its top, behind the stalk: the goal, seen from the start (H-64); drawn once. */
const Stake = memo(function Stake() {
  const h = STALK.soil - STAKE.top;
  return (
    <Layer x={STAKE.x - 30} y={STAKE.top - 20} w={60} h={h + 20}>
      <svg viewBox={`0 0 60 ${h + 20}`}>
        <rect x="25" y="20" width="10" height={h} rx="4" fill="#c9a46b" stroke={INK} strokeWidth="3" />
        <path d="M30 30 L6 14 L8 42 Z M30 30 L54 14 L52 42 Z" fill="#e03131" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="30" cy="30" r="7" fill="#e03131" stroke={INK} strokeWidth="3" />
      </svg>
    </Layer>
  );
});

/** The stalk with its leaves and the closed bud at its top, in its own units (STALK.w × its height). */
function StalkDrawing() {
  const w = STALK.w;
  const h = STALK.soil - STALK.top;
  const mid = w / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={`M${mid} ${h} C${mid - 18} ${h * 0.7} ${mid + 18} ${h * 0.35} ${mid} 50`} fill="none" stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <path d={`M${mid} ${h} C${mid - 18} ${h * 0.7} ${mid + 18} ${h * 0.35} ${mid} 50`} fill="none" stroke="#4caf3a" strokeWidth="10" strokeLinecap="round" />
      {[
        { y: h * 0.78, side: -1 },
        { y: h * 0.56, side: 1 },
        { y: h * 0.34, side: -1 },
      ].map(({ y, side }) => (
        <path
          key={y}
          d={`M${mid} ${y} Q${mid + side * 50} ${y - 60} ${mid + side * 110} ${y - 40} Q${mid + side * 60} ${y + 10} ${mid} ${y} Z`}
          fill="#58b947"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
      ))}
      <path d={`M${mid} 56 C${mid - 34} 46 ${mid - 30} 10 ${mid} 2 C${mid + 30} 10 ${mid + 34} 46 ${mid} 56 Z`} fill="#58b947" stroke={INK} strokeWidth="5" />
      <path d={`M${mid} 8 C${mid - 10} 16 ${mid - 8} 30 ${mid} 34 C${mid + 8} 30 ${mid + 10} 16 ${mid} 8 Z`} fill="#ff8fab" />
    </svg>
  );
}

/** The stalk growing up out of the soil. */
const Stalk = memo(function Stalk() {
  return (
    <Layer x={STALK.cx - STALK.w / 2} y={STALK.top} w={STALK.w} h={STALK.soil - STALK.top} className="tm-sky-box">
      <div className="tm-stalk tm-move" style={{ "--tm-sprout": `${(1 - SPROUT) * 100}%` } as CSSProperties}>
        <StalkDrawing />
      </div>
    </Layer>
  );
});

/**
 * The way still to grow, from the bud up to the ribbon, along the stake: a box over the stake whose lower end rises with
 * the bud, so a tap lights exactly what is left (H-51).
 */
function StillToGrow({ glow }: { glow: number }) {
  return (
    <Layer x={STAKE.x - 45} y={STALK.top} w={90} h={STALK.soil - STALK.top} className="tm-sky-box">
      <div className="tm-to-grow tm-move" style={{ "--tm-sprout": `${-SPROUT * 100}%` } as CSSProperties}>
        <LeftGlow n={glow} />
      </div>
    </Layer>
  );
}

/** The flower bed, in front of the stalk's foot. */
const Bed = memo(function Bed() {
  return (
    <Layer x={STALK.cx - 190} y={STALK.soil - 30} w={380} h={70}>
      <svg viewBox="0 0 380 70">
        <path d="M6 66 Q20 10 190 8 Q360 10 374 66 Z" fill="#7a4a24" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        {[40, 100, 170, 250, 320].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 36 : 48} r="4" fill="#5c3418" />
        ))}
        {[20, 80, 145, 210, 275, 340].map((x) => (
          <ellipse key={x} cx={x + 10} cy="64" rx="30" ry="12" fill="#ced4da" stroke={INK} strokeWidth="4" />
        ))}
      </svg>
    </Layer>
  );
});

/** The watering can in the bear child's hand, and a drop falling from its spout every second (H-63). */
function WateringCan({ running }: { running: boolean }) {
  return (
    <>
      <Layer x={CAN.x} y={CAN.y} w={CAN.w} h={CAN.h}>
        <svg viewBox="0 0 130 90">
          <g transform="rotate(16 60 50)">
            <path d="M74 50 L122 22 L126 30 L80 62 Z" fill="#4dabf7" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <rect x="20" y="34" width="62" height="48" rx="8" fill="#4dabf7" stroke={INK} strokeWidth="5" />
            <path d="M28 34 Q50 4 74 34" fill="none" stroke={INK} strokeWidth="6" />
            <rect x="20" y="44" width="62" height="10" fill="#a5d8ff" />
          </g>
        </svg>
      </Layer>
      {running && (
        <Layer x={SPOUT.x - 8} y={SPOUT.y} w={16} h={22}>
          <div className="tm-water tm-beat" style={{ "--tm-fall": `${(SPOUT.fall / 22) * 100}%` } as CSSProperties} />
        </Layer>
      )}
    </>
  );
}

/** The flower opening at the end round the bud. */
function Bloom() {
  return (
    <Layer x={STALK.cx - BLOOM / 2} y={STALK.top + 28 - BLOOM / 2} w={BLOOM} h={BLOOM} className="tm-bloom">
      <svg viewBox="0 0 100 100">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="50" cy="22" rx="13" ry="22" fill="#ff8fab" stroke={INK} strokeWidth="2.5" transform={`rotate(${i * 45} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="17" fill="#ffd43b" stroke={INK} strokeWidth="3" />
        <circle cx="44" cy="45" r="4" fill="#fff3bf" />
      </svg>
    </Layer>
  );
}

/** The whole picture: the bear child waters the sprout, it grows up the stake and opens at the end. */
export function FlowerScene({ glow, running }: { glow: number; running: boolean }) {
  return (
    <>
      <GardenBackdrop />
      <Stake />
      <StillToGrow glow={glow} />
      <Stalk />
      <Bloom />
      <Bed />
      <Family kind="bear" x={FLOWER_FAMILY} floor={FLOWER_FLOOR} />
      <WateringCan running={running} />
    </>
  );
}
