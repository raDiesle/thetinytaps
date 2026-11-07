import { memo, type CSSProperties } from "react";
import { MASCOT_COLORS } from "@/components/Mascot";
import { Child, Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Blume (H-53): time that brings something instead of running out, for waiting for something good. The bear child
// waters a little sprout in the flower bed with the garden hose, a drop every second (H-63), and the soil it pushes
// through crumbles aside; the stalk grows up along a tall stake to the red ribbon at its top, which shows from the start
// how far it goes (H-64), and in the last part of the time the flower opens slowly, petal by petal (user feedback,
// November 2026: as high as can be, and opening slowly, so more of the time shows). The stalk is one drawing sliding up
// out of a box cut off at the soil (`overflow: hidden`, moved by `transform`), never drawn again or stretched.

/** The stalk: its middle, its box's width, its top when grown (the bud) and the soil it comes out of. */
export const STALK = { cx: 800, w: 260, top: 150, soil: 790 } as const;

/** The share of the time the stalk grows; after it the flower opens petal by petal until the end. */
export const GROWN_AT = 0.7;

/** The flower's petals, opening one after another in the time after `GROWN_AT`. */
export const PETALS = 8;

/** How much of the stalk shows at the start: a little sprout. */
export const SPROUT = 0.1;

/** The stake the stalk grows along, right of it, with the ribbon at its top: where the flower will open. */
export const STAKE = { x: 885, top: 120 } as const;

/** The ground the bear child stands on. */
export const FLOWER_FLOOR = 800;

/** The bear child's place (its left edge); it holds the garden hose over the bed. */
export const FLOWER_CHILD = 470;

/**
 * Where the water comes from, plain to see (user feedback, November 2026: „wo kommt das ganze Wasser aus der Kanne“ –
 * a small can dripping for an hour made no sense): a garden tap on a post, its hose running over the grass to the
 * bear child's paws, where the nozzle drips onto the bed.
 */
export const TAP = { x: 300, y: 650 } as const;
const PAWS = { x: 572, y: 722 } as const;
export const SPOUT = { x: 700, y: 742, fall: 40 } as const;

/** The flower as it opens at the end, round the bud. */
const BLOOM = 230;

/** Sky, garden fence and grass, and the garden tap with its hose; drawn once. */
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
        {/* The garden tap on its post, and its green hose over the grass up to the bear child's paws. */}
        <rect x={TAP.x - 14} y={TAP.y - 40} width="28" height={FLOWER_FLOOR - TAP.y + 40} rx="4" fill="#a8743f" stroke={INK} strokeWidth="4" />
        <path d={`M${TAP.x + 12} ${TAP.y - 8} h34 v26`} fill="none" stroke={INK} strokeWidth="16" strokeLinejoin="round" />
        <path d={`M${TAP.x + 12} ${TAP.y - 8} h34 v26`} fill="none" stroke="#adb5bd" strokeWidth="9" strokeLinejoin="round" />
        <rect x={TAP.x + 4} y={TAP.y - 34} width="28" height="12" rx="5" fill="#e03131" stroke={INK} strokeWidth="3" />
        <path
          d={`M${TAP.x + 46} ${TAP.y + 16} C${TAP.x + 50} ${FLOWER_FLOOR + 10} ${TAP.x + 140} ${FLOWER_FLOOR + 14} ${TAP.x + 200} ${FLOWER_FLOOR - 2} S${PAWS.x - 30} ${PAWS.y + 70} ${PAWS.x} ${PAWS.y}`}
          fill="none"
          stroke={INK}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d={`M${TAP.x + 46} ${TAP.y + 16} C${TAP.x + 50} ${FLOWER_FLOOR + 10} ${TAP.x + 140} ${FLOWER_FLOOR + 14} ${TAP.x + 200} ${FLOWER_FLOOR - 2} S${PAWS.x - 30} ${PAWS.y + 70} ${PAWS.x} ${PAWS.y}`}
          fill="none"
          stroke="#51cf66"
          strokeWidth="9"
          strokeLinecap="round"
        />
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

/**
 * The hose's nozzle in the bear child's paws, in front of it, and a drop falling from it every second (H-63) while the
 * stalk grows; then the flower opens and the watering stops.
 */
function Nozzle({ total }: { total: number }) {
  const drops = Math.max(1, Math.floor((total * GROWN_AT) / 1000));
  return (
    <>
      <Layer x={PAWS.x - 22} y={PAWS.y - 22} w={SPOUT.x - PAWS.x + 34} h={44}>
        <svg viewBox={`0 0 ${SPOUT.x - PAWS.x + 34} 44`}>
          <path d={`M22 22 L${SPOUT.x - PAWS.x + 14} 30`} stroke={INK} strokeWidth="18" strokeLinecap="round" />
          <path d={`M22 22 L${SPOUT.x - PAWS.x + 14} 30`} stroke="#51cf66" strokeWidth="10" strokeLinecap="round" />
          <path d={`M${SPOUT.x - PAWS.x - 30} 26 L${SPOUT.x - PAWS.x + 22} 36`} stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <path d={`M${SPOUT.x - PAWS.x - 30} 26 L${SPOUT.x - PAWS.x + 22} 36`} stroke="#ffd43b" strokeWidth="9" strokeLinecap="round" />
          {/* The bear child's paws round the hose. */}
          {[14, 50].map((x) => (
            <ellipse key={x} cx={x} cy={22 + x * 0.12} rx="15" ry="13" fill={MASCOT_COLORS.bear.fur} stroke={INK} strokeWidth="4" />
          ))}
        </svg>
      </Layer>
      <Layer x={SPOUT.x - 8} y={SPOUT.y} w={16} h={22}>
        <div className="tm-water tm-beat" style={{ "--tm-fall": `${(SPOUT.fall / 22) * 100}%`, animationIterationCount: drops } as CSSProperties} />
      </Layer>
    </>
  );
}

/**
 * The soil the stalk pushes through crumbles aside every second while it grows (user feedback, November 2026): a few
 * crumbs, each a small layer, popping out to both sides of its foot.
 */
function SoilCrumbs({ total }: { total: number }) {
  const pushes = Math.max(1, Math.floor((total * GROWN_AT) / 1000));
  return (
    <>
      {[
        { dx: -260, dy: -120, s: 14 },
        { dx: -140, dy: -200, s: 10 },
        { dx: 160, dy: -170, s: 12 },
        { dx: 280, dy: -90, s: 9 },
      ].map((c, i) => (
        <Layer key={i} x={STALK.cx - c.s / 2 + (i < 2 ? -8 : 8)} y={STALK.soil - 26} w={c.s} h={c.s}>
          <div
            className="tm-soil tm-beat"
            style={{ "--tm-dx": `${c.dx}%`, "--tm-dy": `${c.dy}%`, animationIterationCount: pushes, animationDelay: `${i * 0.08}s` } as CSSProperties}
          />
        </Layer>
      ))}
    </>
  );
}

/**
 * The flower opening round the bud once the stalk is grown, petal by petal, slowly, until the end; each petal is a
 * layer of its own waiting for its moment (`animation-delay`), the middle comes last.
 */
function Bloom() {
  const box = { x: STALK.cx - BLOOM / 2, y: STALK.top + 28 - BLOOM / 2, w: BLOOM, h: BLOOM };
  const share = (1 - GROWN_AT) / (PETALS + 1);
  const at = (k: number) => ({ "--tm-at": GROWN_AT + k * share, "--tm-share": share }) as CSSProperties;
  return (
    <>
      {Array.from({ length: PETALS }, (_, i) => (
        <Layer key={i} {...box} className="tm-petal" style={at(i)}>
          <svg viewBox="0 0 100 100">
            <ellipse cx="50" cy="22" rx="13" ry="22" fill="#ff8fab" stroke={INK} strokeWidth="2.5" transform={`rotate(${i * 45} 50 50)`} />
          </svg>
        </Layer>
      ))}
      <Layer {...box} className="tm-petal" style={at(PETALS)}>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="17" fill="#ffd43b" stroke={INK} strokeWidth="3" />
          <circle cx="44" cy="45" r="4" fill="#fff3bf" />
        </svg>
      </Layer>
    </>
  );
}

/** The whole picture: the bear child waters the sprout with the hose, it grows up the stake and opens slowly at the end. */
export function FlowerScene({ glow, total }: { glow: number; total: number }) {
  return (
    <>
      <GardenBackdrop />
      <Stake />
      <StillToGrow glow={glow} />
      <Stalk />
      <Bed />
      <SoilCrumbs total={total} />
      <Bloom />
      <Child kind="bear" x={FLOWER_CHILD} floor={FLOWER_FLOOR} />
      <Nozzle total={total} />
    </>
  );
}
