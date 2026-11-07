import { memo, type CSSProperties } from "react";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Blume (H-53): time that brings something instead of running out, for waiting for something good. A garden hose,
// laid in a forked stick at the bed's edge, drips onto a little sprout every second (H-63), and the soil it pushes
// through crumbles aside; the plant grows up along a tall stake to the red ribbon at its top, which shows from the start
// how far it goes (H-64), and in the last part of the time its flower grows from small to big, all petals at once.
// The plant is one drawing growing out of a box cut off at the soil (`overflow: hidden`, moved and scaled from its foot
// by `transform`): as it rises it grows as a whole, its stalk thicker and its leaves bigger, the way a real plant does
// (user feedback, November 2026) – never drawn again, and never stretched one way only.
// Nobody stands by: the bear child that held the hose looked odd and was taken out (user feedback, November 2026).

/** The plant: its middle, its box's width, its top when grown (the bud) and the soil it comes out of. */
export const STALK = { cx: 800, w: 340, top: 185, soil: 790 } as const;

/** The share of the time the plant grows; after it the flower grows open until the end. */
export const GROWN_AT = 0.7;

/** How much of the plant's height shows above the soil at the start: a little sprout. */
export const SPROUT = 0.1;

/** How big the plant is drawn at the start, against its full size: it grows from this to whole as it rises. */
export const SPROUT_SIZE = 0.42;

/** The stake the plant grows along, right of it, with the ribbon at its top: where the flower will open. */
export const STAKE = { x: 885, top: 120 } as const;

/** The grass's line at the front, where the tap's post and the hose's stick stand. */
export const FLOWER_FLOOR = 800;

/**
 * Where the water comes from, plain to see (user feedback, November 2026: „wo kommt das ganze Wasser aus der Kanne“ –
 * a small can dripping for an hour made no sense): a garden tap on a post, its hose running over the grass to a forked
 * stick at the bed's edge that holds it, and its nozzle dripping onto the bed.
 */
export const TAP = { x: 300, y: 650 } as const;
/** The fork of the stick holding the hose. */
export const HOLDER = { x: 590, y: 724 } as const;
/** The nozzle's tip, where the drops fall from, and how far they fall onto the soil. */
export const SPOUT = { x: 700, y: 744, fall: 40 } as const;

/** The flower when grown open, round the bud. */
export const BLOOM = 220;

/** A daisy in the grass: white petals round a yellow middle, on a stalk. */
function Daisy({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g>
      <path d={`M${x} ${y + r} V${y + r * 4.5}`} stroke="#3d8a32" strokeWidth={r * 0.35} />
      <path d={`M${x} ${y + r * 3.4} q${r * 0.9} ${-r * 0.9} ${r * 1.5} ${-r * 0.4} q${-r * 0.6} ${r * 0.7} ${-r * 1.5} ${r * 0.4}`} fill="#58b947" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx={x}
          cy={y - r * 0.8}
          rx={r * 0.38}
          ry={r * 0.8}
          fill="#fff"
          stroke={INK}
          strokeWidth="2"
          transform={`rotate(${i * 45} ${x} ${y})`}
        />
      ))}
      <circle cx={x} cy={y} r={r * 0.5} fill="#ffd43b" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** A tulip in the grass: a cup of three petals on a stalk with one long leaf. */
function Tulip({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
      <path d={`M${x} ${y} V${y + 70}`} stroke="#3d8a32" strokeWidth="5" />
      <path d={`M${x} ${y + 68} Q${x - 26} ${y + 40} ${x - 14} ${y + 18} Q${x - 6} ${y + 46} ${x} ${y + 68} Z`} fill="#58b947" />
      <path
        d={`M${x - 15} ${y - 22} Q${x - 18} ${y + 4} ${x} ${y + 6} Q${x + 18} ${y + 4} ${x + 15} ${y - 22} L${x + 7} ${y - 12} L${x} ${y - 26} L${x - 7} ${y - 12} Z`}
        fill={color}
      />
    </g>
  );
}

/** Sky, clouds, garden fence and grass with flowers, and the garden tap with its hose up to the stick; drawn once. */
export const GardenBackdrop = memo(function GardenBackdrop() {
  const hose = `M${TAP.x + 46} ${TAP.y + 16} C${TAP.x + 50} ${FLOWER_FLOOR + 10} ${TAP.x + 140} ${FLOWER_FLOOR + 14} ${TAP.x + 200} ${FLOWER_FLOOR - 4} S${HOLDER.x - 40} ${HOLDER.y + 50} ${HOLDER.x} ${HOLDER.y}`;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <defs>
          <linearGradient id="tm-garden-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a5dcff" />
            <stop offset="1" stopColor="#eef9ff" />
          </linearGradient>
          <linearGradient id="tm-garden-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9bd873" />
            <stop offset="1" stopColor="#74bf52" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-garden-sky)" />
        <circle cx="1300" cy="160" r="64" fill="#ffe066" />
        <circle cx="1300" cy="160" r="84" fill="#ffe066" opacity="0.3" />
        {[
          [380, 170, 1],
          [620, 110, 0.75],
          [1080, 200, 0.9],
        ].map(([cx, cy, s]) => (
          <g key={cx} fill="#fff" opacity="0.95">
            <ellipse cx={cx} cy={cy} rx={70 * s} ry={28 * s} />
            <circle cx={cx - 26 * s} cy={cy - 18 * s} r={30 * s} />
            <circle cx={cx + 22 * s} cy={cy - 24 * s} r={36 * s} />
          </g>
        ))}
        {/* The garden fence: pickets on two rails. */}
        <rect x="0" y="566" width={STAGE_W} height="14" fill="#e9d8b8" stroke={INK} strokeWidth="3" />
        <rect x="0" y="608" width={STAGE_W} height="14" fill="#e9d8b8" stroke={INK} strokeWidth="3" />
        {Array.from({ length: 17 }, (_, i) => (
          <g key={i}>
            <path
              d={`M${i * 100 + 20} 646 V556 L${i * 100 + 50} 526 L${i * 100 + 80} 556 V646 Z`}
              fill="#fff4e0"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d={`M${i * 100 + 34} 560 V636`} stroke="#ecdcc0" strokeWidth="6" />
          </g>
        ))}
        <path d={`M0 646 Q400 628 800 642 T${STAGE_W} 640 V${STAGE_H} H0 Z`} fill="url(#tm-garden-grass)" />
        {/* Tufts of grass, a few darker blades. */}
        {[120, 260, 430, 1010, 1160, 1290, 1450, 560, 1380].map((x, i) => {
          const y = 690 + ((i * 47) % 120);
          return <path key={x} d={`M${x - 14} ${y} q4 -22 6 -26 q2 14 6 22 q4 -18 10 -24 q-2 16 2 26 Z`} fill="#5aa83e" />;
        })}
        <Tulip x={1080} y={690} color="#ff6b6b" />
        <Tulip x={1130} y={706} color="#ffd43b" />
        <Tulip x={1350} y={692} color="#cc5de8" />
        <Daisy x={1230} y={716} r={14} />
        <Daisy x={190} y={712} r={13} />
        <Daisy x={460} y={760} r={11} />
        <Daisy x={1420} y={770} r={12} />
        {/* The garden tap on its post, and its green hose over the grass up to the stick at the bed. */}
        <rect x={TAP.x - 14} y={TAP.y - 40} width="28" height={FLOWER_FLOOR - TAP.y + 40} rx="4" fill="#a8743f" stroke={INK} strokeWidth="4" />
        <path d={`M${TAP.x - 6} ${TAP.y - 30} V${FLOWER_FLOOR - 6}`} stroke="#c48f58" strokeWidth="5" />
        <path d={`M${TAP.x + 12} ${TAP.y - 8} h34 v26`} fill="none" stroke={INK} strokeWidth="16" strokeLinejoin="round" />
        <path d={`M${TAP.x + 12} ${TAP.y - 8} h34 v26`} fill="none" stroke="#adb5bd" strokeWidth="9" strokeLinejoin="round" />
        <rect x={TAP.x + 4} y={TAP.y - 34} width="28" height="12" rx="5" fill="#e03131" stroke={INK} strokeWidth="3" />
        <path d={hose} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
        <path d={hose} fill="none" stroke="#51cf66" strokeWidth="9" strokeLinecap="round" />
        <path d={hose} fill="none" stroke="#b2f2bb" strokeWidth="3" strokeLinecap="round" strokeDasharray="18 30" />
      </Draw>
    </Layer>
  );
});

/** The stake with the ribbon at its top, behind the plant: the goal, seen from the start (H-64); drawn once. */
const Stake = memo(function Stake() {
  const h = STALK.soil - STAKE.top;
  return (
    <Layer x={STAKE.x - 30} y={STAKE.top - 20} w={60} h={h + 20}>
      <svg viewBox={`0 0 60 ${h + 20}`}>
        <rect x="25" y="20" width="10" height={h} rx="4" fill="#c9a46b" stroke={INK} strokeWidth="3" />
        <path d="M30 30 L6 14 L8 42 Z M30 30 L54 14 L52 42 Z" fill="#e03131" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M30 34 L22 62 L30 56 L36 64 Z" fill="#c92a2a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="30" cy="30" r="7" fill="#e03131" stroke={INK} strokeWidth="3" />
      </svg>
    </Layer>
  );
});

/** The plant's leaves along its stalk: where (0 at the soil, 1 at the bud), to which side, and how big – the lower, the bigger. */
const LEAVES = [
  { at: 0.1, side: -1, size: 1.3 },
  { at: 0.27, side: 1, size: 1.18 },
  { at: 0.44, side: -1, size: 1.02 },
  { at: 0.6, side: 1, size: 0.86 },
  { at: 0.75, side: -1, size: 0.68 },
] as const;

/** The bud's height at the stalk's top, in the drawing's units. */
const BUD = 60;

/**
 * The plant – a stalk thicker at its foot, its leaves with a vein, the closed bud in its green cup at the top – in its
 * own units (STALK.w × its height).
 */
function PlantDrawing() {
  const w = STALK.w;
  const h = STALK.soil - STALK.top;
  const mid = w / 2;
  // The stalk's middle line with a gentle sway, from the soil (t = 0) up to the bud (t = 1), and its width there.
  const at = (t: number) => ({ x: mid + 9 * Math.sin(t * Math.PI * 1.6), y: h - t * (h - BUD + 6) });
  const width = (t: number) => 30 - 18 * t;
  const steps = Array.from({ length: 25 }, (_, i) => i / 24);
  const left = steps.map((t) => `${(at(t).x - width(t) / 2).toFixed(1)} ${at(t).y.toFixed(1)}`);
  const right = steps.map((t) => `${(at(t).x + width(t) / 2).toFixed(1)} ${at(t).y.toFixed(1)}`).reverse();
  const stalk = `M${left.join(" L")} L${right.join(" L")} Z`;
  const shine = `M${steps
    .slice(0, -2)
    .map((t) => `${(at(t).x - width(t) / 5).toFixed(1)} ${at(t).y.toFixed(1)}`)
    .join(" L")}`;
  const top = at(1);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ display: "block", width: "100%", height: "100%", overflow: "visible" }}>
      {LEAVES.map(({ at: t, side, size }) => {
        const { x, y } = at(t);
        const l = 118 * size;
        const b = 42 * size;
        return (
          <g key={t} transform={`translate(${x} ${y}) scale(${side} 1) rotate(-28)`}>
            <path
              d={`M0 0 C${l * 0.28} ${-b} ${l * 0.75} ${-b * 0.95} ${l} 0 C${l * 0.72} ${b * 0.62} ${l * 0.3} ${b * 0.7} 0 0 Z`}
              fill="#58b947"
              stroke={INK}
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d={`M${l * 0.12} ${-b * 0.4} C${l * 0.35} ${-b * 0.85} ${l * 0.7} ${-b * 0.8} ${l * 0.9} ${-b * 0.12}`}
              fill="none"
              stroke="#8ce36f"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path d={`M4 0 Q${l * 0.5} ${-b * 0.12} ${l * 0.92} 0`} fill="none" stroke="#2f7a24" strokeWidth="3.5" strokeLinecap="round" />
            {[0.3, 0.55].map((k) => (
              <path
                key={k}
                d={`M${l * k} ${-b * 0.05} l${l * 0.12} ${-b * 0.4} M${l * k} ${-b * 0.02} l${l * 0.12} ${b * 0.3}`}
                stroke="#2f7a24"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </g>
        );
      })}
      <path d={stalk} fill="#4caf3a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d={shine} fill="none" stroke="#7fd463" strokeWidth="4" strokeLinecap="round" />
      {/* The bud: pink petals pressed together, held in its green cup. */}
      <g transform={`translate(${top.x} ${top.y})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
        <path d="M0 2 C-30 -8 -26 -44 0 -56 C26 -44 30 -8 0 2 Z" fill="#ff8fab" />
        <path d="M0 -4 C-10 -16 -10 -40 0 -50" fill="none" stroke="#e8628a" strokeWidth="3" />
        <path d="M-2 4 C-34 0 -34 -26 -20 -36 C-16 -18 -10 -6 -2 4 Z M2 4 C34 0 34 -26 20 -36 C16 -18 10 -6 2 4 Z" fill="#58b947" />
        <path d="M0 6 C-8 -6 -8 -20 0 -28 C8 -20 8 -6 0 6 Z" fill="#4caf3a" />
      </g>
    </svg>
  );
}

/** The plant growing up out of the soil, bigger as it rises. */
const Plant = memo(function Plant() {
  return (
    <Layer x={STALK.cx - STALK.w / 2} y={STALK.top - 40} w={STALK.w} h={STALK.soil - STALK.top + 40} className="tm-sky-box">
      {/* The box reaches 40 above the plant's top, so the bud's tip is never cut; the drawing fills the rest below it. */}
      <div
        className="tm-stalk tm-move"
        style={
          {
            "--tm-sprout": `${(SPROUT_SIZE - SPROUT) * 100}%`,
            "--tm-sprout-size": SPROUT_SIZE,
            top: `${(40 / (STALK.soil - STALK.top + 40)) * 100}%`,
          } as CSSProperties
        }
      >
        <PlantDrawing />
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

/** The flower bed, in front of the plant's foot: dark soil with crumbs, edged with stones. */
const Bed = memo(function Bed() {
  return (
    <Layer x={STALK.cx - 190} y={STALK.soil - 30} w={380} h={70}>
      <svg viewBox="0 0 380 70">
        <path d="M6 66 Q20 10 190 8 Q360 10 374 66 Z" fill="#7a4a24" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
        <path d="M40 30 Q190 16 340 30" fill="none" stroke="#9a6236" strokeWidth="5" strokeLinecap="round" />
        {[40, 75, 100, 140, 170, 230, 250, 290, 320].map((x, i) => (
          <circle key={x} cx={x} cy={i % 2 ? 38 : 50} r={i % 3 ? 4 : 5} fill="#5c3418" />
        ))}
        {[20, 80, 145, 210, 275, 340].map((x, i) => (
          <g key={x}>
            <ellipse cx={x + 10} cy="64" rx="30" ry="12" fill={i % 2 ? "#adb5bd" : "#ced4da"} stroke={INK} strokeWidth="4" />
            <ellipse cx={x + 2} cy="60" rx="10" ry="4" fill="#f1f3f5" />
          </g>
        ))}
      </svg>
    </Layer>
  );
});

/**
 * The forked stick at the bed's edge, the hose laid in its fork, the yellow nozzle over the bed – and a drop falling
 * from it every second (H-63) while the plant grows; then the flower opens and the watering stops.
 */
function Nozzle({ total }: { total: number }) {
  const drops = Math.max(1, Math.floor((total * GROWN_AT) / 1000));
  const box = { x: HOLDER.x - 30, y: HOLDER.y - 30, w: SPOUT.x - HOLDER.x + 50, h: FLOWER_FLOOR - HOLDER.y + 40 };
  const fork = { x: 30, y: 30 };
  const tip = { x: SPOUT.x - box.x, y: SPOUT.y - box.y };
  return (
    <>
      <Layer {...box}>
        <svg viewBox={`0 0 ${box.w} ${box.h}`}>
          {/* The stick, stuck in the grass, its fork round the hose. */}
          <path d={`M${fork.x} ${fork.y + 8} V${box.h - 14}`} stroke={INK} strokeWidth="14" strokeLinecap="round" />
          <path d={`M${fork.x} ${fork.y + 8} V${box.h - 14}`} stroke="#a8743f" strokeWidth="7" strokeLinecap="round" />
          <path
            d={`M${fork.x - 18} ${fork.y - 14} L${fork.x} ${fork.y + 12} L${fork.x + 16} ${fork.y - 16}`}
            fill="none"
            stroke={INK}
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={`M${fork.x - 18} ${fork.y - 14} L${fork.x} ${fork.y + 12} L${fork.x + 16} ${fork.y - 16}`}
            fill="none"
            stroke="#a8743f"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* The hose's end from the fork to the nozzle. */}
          <path d={`M${fork.x} ${fork.y} L${tip.x - 34} ${tip.y - 12}`} stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <path d={`M${fork.x} ${fork.y} L${tip.x - 34} ${tip.y - 12}`} stroke="#51cf66" strokeWidth="9" strokeLinecap="round" />
          <path d={`M${tip.x - 44} ${tip.y - 15} L${tip.x} ${tip.y - 2}`} stroke={INK} strokeWidth="16" strokeLinecap="round" />
          <path d={`M${tip.x - 44} ${tip.y - 15} L${tip.x} ${tip.y - 2}`} stroke="#ffd43b" strokeWidth="9" strokeLinecap="round" />
          <path d={`M${tip.x - 38} ${tip.y - 16} L${tip.x - 34} ${tip.y - 6}`} stroke={INK} strokeWidth="3" />
        </svg>
      </Layer>
      <Layer x={SPOUT.x - 8} y={SPOUT.y} w={16} h={22}>
        <div className="tm-water tm-beat" style={{ "--tm-fall": `${(SPOUT.fall / 22) * 100}%`, animationIterationCount: drops } as CSSProperties} />
      </Layer>
    </>
  );
}

/**
 * The soil the plant pushes through crumbles aside every second while it grows (user feedback, November 2026): a few
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

/** The flower's petals: an outer ring and an inner one between them, each petal round with a soft fold. */
const OUTER = 10;

/**
 * The flower round the bud once the plant is grown: one layer growing from small to big, all its petals at once (user
 * feedback, November 2026: petals opening one by one looked odd), slowly until the end.
 */
const Bloom = memo(function Bloom() {
  const petal = (len: number, wide: number) =>
    `M50 50 C${50 - wide} ${50 - len * 0.35} ${50 - wide * 0.9} ${50 - len} 50 ${50 - len} C${50 + wide * 0.9} ${50 - len} ${50 + wide} ${50 - len * 0.35} 50 50 Z`;
  return (
    <Layer x={STALK.cx - BLOOM / 2} y={STALK.top + 24 - BLOOM / 2} w={BLOOM} h={BLOOM} className="tm-bloom">
      <svg viewBox="0 0 100 100">
        <g stroke={INK} strokeWidth="1.8" strokeLinejoin="round">
          {Array.from({ length: OUTER }, (_, i) => (
            <path key={i} d={petal(46, 15)} fill="#f783ac" transform={`rotate(${i * (360 / OUTER)} 50 50)`} />
          ))}
          {Array.from({ length: OUTER }, (_, i) => (
            <g key={i} transform={`rotate(${(i + 0.5) * (360 / OUTER)} 50 50)`}>
              <path d={petal(36, 12)} fill="#ffa8c5" />
              <path d="M50 44 Q49 30 50 20" fill="none" stroke="#f783ac" strokeWidth="1.4" />
            </g>
          ))}
        </g>
        <circle cx="50" cy="50" r="15" fill="#ffd43b" stroke={INK} strokeWidth="2" />
        <circle cx="50" cy="50" r="9" fill="#fab005" />
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <circle key={i} cx={50 + Math.cos(a) * 11.5} cy={50 + Math.sin(a) * 11.5} r="1.3" fill="#e67700" />;
        })}
        <circle cx="45" cy="45" r="3.5" fill="#fff3bf" />
      </svg>
    </Layer>
  );
});

/** The whole picture: the hose drips onto the sprout, it grows up the stake, bigger as it rises, and flowers at the end. */
export function FlowerScene({ glow, total }: { glow: number; total: number }) {
  return (
    <>
      <GardenBackdrop />
      <Stake />
      <StillToGrow glow={glow} />
      <Plant />
      <Bed />
      <SoilCrumbs total={total} />
      <Bloom />
      <Nozzle total={total} />
    </>
  );
}
