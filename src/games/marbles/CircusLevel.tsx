import { useId, useMemo } from "react";
import { wobble, VIEW_H, type LevelProps } from "./level";
import {
  BASKET,
  BASKET_RIM,
  buildCircus,
  CANNON,
  CHUTE,
  chuteY,
  CLOWN,
  CORD_END,
  CYMBAL,
  DRUMS,
  ELEPHANT,
  END,
  EYE,
  FLOOR,
  HAT,
  HEAD,
  HOOP,
  MAST,
  MUZZLE,
  NECK,
  NET,
  PLATFORM,
  RAIL,
  SEAL,
  STAGE,
  TRAMPOLINE,
  TRUNK_W,
  UNICYCLE,
  WIRE,
  WORLD_W,
  type Circus,
} from "./circus";
import { beside, deg, lerp, rad, seg, svgLine } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { Bunting, INK, MARBLE_COLOR, Sparkles } from "./scenery";
import { BALL_R, type Pt } from "./track";
import { BAR_COLORS, Ball } from "./TrackLevel";

/** The tent's two stripe colours; the red one is the level's main colour. */
const TENT_RED = "#e8505b";
const TENT_CREAM = "#fff4e0";
const GOLD = "#ffc93c";

/**
 * The circus. One tap lets the marble drop out of the magician's
 * top hat, and then one act sets off the next for about half a minute: a drum
 * roll with a cymbal, a trampoline, a seal balancing the marble on its nose,
 * the elephant's trunk as a slide that flings the marble into a teddy's basket,
 * the teddy on a unicycle along the high wire through a ring of paper flames,
 * pulling the ribbon of the cannon that shoots the clown doll into the net. Then the curtain opens. The camera travels along
 * with whatever moves.
 */
export function CircusLevel(props: LevelProps) {
  const circus = useMemo(buildCircus, []);
  const ids = useId();

  return (
    <MachineStage machine={circus} label="Zirkus" {...props}>
      {(t) => {
        const uni = circus.unicycleAt(t);
        const clown = circus.clownAt(t);
        const marble = circus.marbleAt(t);
        return (
          <>
            <Tent stripes={`${ids}-stripes`} />
            <Stage open={seg(t, circus.tShow, circus.tShow + 1.3)} />
            <Spotlights on={seg(t, circus.tShow, circus.tShow + 0.4)} />
            <StripedRail a={{ x: RAIL.from.x - 20, y: RAIL.from.y - 5 }} b={RAIL.to} />
            <Pole x={RAIL.to.x - 24} y0={RAIL.to.y + BALL_R + 14} y1={FLOOR} />
            {DRUMS.map((_, i) => (
              <Drum key={i} i={i} age={t - circus.drumTimes[i]} />
            ))}
            <Cymbal age={t - circus.tCymbal} />
            <Trampoline dip={circus.dipAt(t)} />
            <Tub cx={SEAL.x} top={SEAL.base} w={SEAL.tubW} color="#3a86ff" />
            <Seal nod={circus.nodAt(t)} clap={circus.clapAt(t)} />
            <Chute />
            <Elephant circus={circus} t={t} />
            <HighWire />
            <Mast />
            <Hoop t={t} tPass={circus.tHoop} part="back" />
            <Net sag={circus.sagAt(t)} />
            <Clown at={clown.pt} turn={clown.turn} wave={t > circus.tNet + 0.3 ? t - circus.tNet : 0} />
            <Cannon age={t - circus.tFire} />
            <Unicycle at={uni.pt} turned={uni.turned} lean={uni.lean} />
            <Ball color={MARBLE_COLOR} x={marble.pt.x} y={marble.pt.y} spin={marble.spin} />
            <Basket at={uni.pt} lean={uni.lean} />
            <Ribbon tassel={circus.tasselAt(t)} pulled={circus.pulledAt(t)} fired={t >= circus.tFire} />
            <Hoop t={t} tPass={circus.tHoop} part="front" />
            <TopHat />
            <ConfettiBurst age={t - circus.tFire} />
            <ConfettiRain age={t - circus.tShow} />
            <Sparkles x={clown.pt.x} y={clown.pt.y - 40} age={t - circus.tShow} n={12} spread={200} />

            <TapHint t={t} x={HAT.x + 120} y={HAT.y + 110} />
          </>
        );
      }}
    </MachineStage>
  );
}

/* ---------- The tent ---------- */

function Tent({ stripes }: { stripes: string }) {
  const bulbs = Math.floor((WORLD_W + 800) / 80);
  return (
    <g>
      <defs>
        <pattern id={stripes} width="160" height="40" patternUnits="userSpaceOnUse">
          <rect width="160" height="40" fill={TENT_CREAM} />
          <rect width="80" height="40" fill={TENT_RED} />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${stripes})`} />
      {/* Soft spots of light on the tent wall */}
      {[700, 2100, 3500, 4300].map((x) => (
        <ellipse key={x} cx={x} cy="330" rx="230" ry="170" fill="#fff" opacity="0.18" />
      ))}
      {[
        { x: 520, y: 600 },
        { x: 1660, y: 260 },
        { x: 2900, y: 330 },
        { x: 3750, y: 420 },
        { x: 4560, y: 330 },
      ].map((p) => (
        <Star key={p.x} x={p.x} y={p.y} r={34} fill={GOLD} />
      ))}
      <Bunting x0={1500} x1={2700} y={86} />
      <Bunting x0={2900} x1={4100} y={86} />
      {/* The scalloped edge at the top, with light bulbs */}
      <rect x="-400" y="-200" width={WORLD_W + 800} height="236" fill="#c8323f" />
      {Array.from({ length: bulbs }, (_, i) => {
        const x = -400 + i * 80;
        return <path key={i} d={`M${x} 34 Q${x + 40} 92 ${x + 80} 34 Z`} fill={i % 2 ? GOLD : "#c8323f"} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
      })}
      <line x1="-400" y1="34" x2={WORLD_W + 400} y2="34" stroke={INK} strokeWidth="4" />
      {Array.from({ length: bulbs }, (_, i) => (
        <circle key={i} cx={-400 + i * 80} cy="18" r="8" fill={BAR_COLORS[i % BAR_COLORS.length]} stroke={INK} strokeWidth="2" />
      ))}
      {/* The far side of the ring, then the sawdust, then the near side of the ring */}
      <rect x="-400" y={FLOOR - 34} width={WORLD_W + 800} height="34" fill="#c8323f" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR - 34} width={WORLD_W + 800} height="8" fill={GOLD} />
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#f2c77e" />
      {Array.from({ length: Math.floor((WORLD_W + 800) / 50) }, (_, i) => (
        <circle key={i} cx={-400 + i * 50 + (i % 3) * 13} cy={FLOOR + 18 + (i % 4) * 8} r="3" fill="#d9a85a" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
      <rect x="-400" y={FLOOR + 56} width={WORLD_W + 800} height="200" fill="#c8323f" stroke={INK} strokeWidth="4" />
      <rect x="-400" y={FLOOR + 56} width={WORLD_W + 800} height="10" fill={GOLD} stroke={INK} strokeWidth="3" />
      {Array.from({ length: Math.floor((WORLD_W + 800) / 160) }, (_, i) => (
        <Star key={i} x={-320 + i * 160} y={FLOOR + 82} r={11} fill="#fff" />
      ))}
    </g>
  );
}

/** A five-pointed star with its middle at (x, y). */
function Star({ x, y, r, fill, turn = 0 }: { x: number; y: number; r: number; fill: string; turn?: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${rr * Math.cos(a)} ${rr * Math.sin(a)}`;
  });
  return <path transform={`translate(${x} ${y}) rotate(${turn})`} d={`M${pts.join(" L")} Z`} fill={fill} stroke={INK} strokeWidth="3" strokeLinejoin="round" />;
}

/** A red and white striped pole standing from `y0` down to `y1`. */
function Pole({ x, y0, y1, w = 14 }: { x: number; y0: number; y1: number; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y0} width={w} height={y1 - y0} rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
      <line x1={x} y1={y0 + 4} x2={x} y2={y1 - 2} stroke="#ff5d73" strokeWidth={w - 5} strokeDasharray="14 14" />
    </g>
  );
}

/** A rope from (x, y) up into the top of the tent. */
function Rope({ x, y }: { x: number; y: number }) {
  return <line x1={x} y1={y} x2={x} y2="30" stroke="#8a6a4a" strokeWidth="4" />;
}

/** A candy-striped rail just under the marble's way from `a` to `b`. */
function StripedRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#fff" strokeWidth="12" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#ff5d73" strokeWidth="12" strokeDasharray="16 16" />
    </g>
  );
}

/** A round circus tub to stand on, from `top` down to the floor. */
function Tub({ cx, top, w, color }: { cx: number; top: number; w: number; color: string }) {
  const half = w / 2;
  const narrow = half * 0.86;
  return (
    <g>
      <path
        d={`M${cx - narrow} ${top} L${cx + narrow} ${top} L${cx + half} ${FLOOR} L${cx - half} ${FLOOR} Z`}
        fill={color}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x={cx - half - 2} y={FLOOR - 26} width={w + 4} height="22" rx="6" fill={GOLD} stroke={INK} strokeWidth="3" />
      <Star x={cx} y={(top + FLOOR) / 2} r={Math.min(40, (FLOOR - top) / 5)} fill={GOLD} />
      <ellipse cx={cx} cy={top} rx={narrow + 6} ry="12" fill={GOLD} stroke={INK} strokeWidth="3.5" />
      <path d={`M${cx - narrow + 16} ${top + 30} L${cx - half + 18} ${FLOOR - 40}`} stroke="#fff6" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/* ---------- Top hat, drums, cymbal and trampoline ---------- */

/** The magician's top hat, upside down on two ropes; a hole in its crown lets the marble out. */
function TopHat() {
  const { x, y } = HAT;
  const top = y - 118;
  const bottom = y + 26;
  return (
    <g>
      <line x1={x - 80} y1={top} x2={x - 60} y2="30" stroke="#8a6a4a" strokeWidth="4" />
      <line x1={x + 80} y1={top} x2={x + 60} y2="30" stroke="#8a6a4a" strokeWidth="4" />
      <path
        d={`M${x - 64} ${top} L${x - 58} ${bottom} Q${x} ${bottom + 12} ${x + 58} ${bottom} L${x + 64} ${top} Z`}
        fill="#3b3b4f"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${x - 63} ${top + 14} L${x + 63} ${top + 14} L${x + 62} ${top + 36} L${x - 62} ${top + 36} Z`} fill="#ff3b5c" stroke={INK} strokeWidth="3" />
      <ellipse cx={x} cy={top} rx="96" ry="16" fill="#3b3b4f" stroke={INK} strokeWidth="4" />
      <ellipse cx={x} cy={top - 2} rx="60" ry="9" fill="#1d1d2b" />
      <path d={`M${x - 44} ${top + 52} L${x - 40} ${bottom - 14}`} stroke="#fff5" strokeWidth="8" strokeLinecap="round" />
      {/* The magic wand leaning on it */}
      <g transform={`translate(${x + 78} ${y - 30}) rotate(28)`}>
        <rect x="-6" y="-70" width="12" height="120" rx="5" fill={INK} />
        <rect x="-6" y="-70" width="12" height="22" rx="5" fill="#fff" stroke={INK} strokeWidth="2" />
      </g>
      <Star x={x + 112} y={y - 104} r={14} fill={GOLD} />
    </g>
  );
}

const DRUM_COLORS = ["#ff5d73", "#3a86ff", "#3ec300"];

/** A drum on its stand; the drumhead bounces when the marble lands, `age` seconds after. */
function Drum({ i, age }: { i: number; age: number }) {
  const { cx, top, r, h } = DRUMS[i];
  const shake = wobble(age, 4, 30, 6);
  const zig = Array.from({ length: 9 }, (_, k) => `${cx - r + 6 + (k * (2 * r - 12)) / 8} ${k % 2 ? top + h - 12 : top + 14}`).join(" L");
  return (
    <g>
      {[-1, 1].map((side) => (
        <line key={side} x1={cx + side * r * 0.5} y1={top + h} x2={cx + side * (r + 14)} y2={FLOOR} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      ))}
      {[-1, 1].map((side) => (
        <line key={side} x1={cx + side * r * 0.5} y1={top + h} x2={cx + side * (r + 14)} y2={FLOOR} stroke="#c9cbe0" strokeWidth="4" strokeLinecap="round" />
      ))}
      <line x1={cx} y1={top + h} x2={cx} y2={FLOOR} stroke={INK} strokeWidth="8" />
      <g transform={`translate(0 ${shake})`}>
        <rect x={cx - r} y={top} width={2 * r} height={h} rx="8" fill={DRUM_COLORS[i]} stroke={INK} strokeWidth="4" />
        <path d={`M${zig}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
        <rect x={cx - r - 3} y={top + h - 12} width={2 * r + 6} height="14" rx="6" fill={GOLD} stroke={INK} strokeWidth="3" />
        <ellipse cx={cx} cy={top} rx={r + 3} ry={14 - Math.max(0, shake)} fill="#fff8e8" stroke={INK} strokeWidth="4" />
        <ellipse cx={cx} cy={top} rx={r + 3} ry="14" fill="none" stroke={GOLD} strokeWidth="3" opacity="0.8" />
      </g>
    </g>
  );
}

/** The cymbal on its stand, ringing and wobbling `age` seconds after the marble hits it. */
function Cymbal({ age }: { age: number }) {
  const { cx, y, r, tilt } = CYMBAL;
  return (
    <g>
      <line x1={cx} y1={y} x2={cx} y2={FLOOR - 40} stroke={INK} strokeWidth="8" />
      <line x1={cx} y1={y} x2={cx} y2={FLOOR - 40} stroke="#c9cbe0" strokeWidth="3" />
      <path d={`M${cx - 44} ${FLOOR} L${cx} ${FLOOR - 44} L${cx + 44} ${FLOOR}`} fill="none" stroke={INK} strokeWidth="7" strokeLinejoin="round" />
      <g transform={`translate(${cx} ${y}) rotate(${tilt + wobble(age, 12, 24, 3)})`}>
        <ellipse rx={r} ry="10" fill={GOLD} stroke={INK} strokeWidth="3.5" />
        <ellipse cy="-4" rx="16" ry="7" fill="#ffdd75" stroke={INK} strokeWidth="2.5" />
        <path d={`M${-r + 14} 2 Q${-r / 2} 6 -18 4`} stroke="#fff9" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {age >= 0 && age < 0.8 && (
        <g opacity={1 - age / 0.8} stroke={GOLD} strokeWidth="5" strokeLinecap="round">
          {[-40, 0, 40].map((a) => (
            <line key={a} transform={`translate(${cx} ${y - 20}) rotate(${a})`} x1="0" y1={-30 - age * 40} x2="0" y2={-50 - age * 50} />
          ))}
        </g>
      )}
    </g>
  );
}

/** The trampoline; its bed sinks `dip` in the middle. */
function Trampoline({ dip }: { dip: number }) {
  const { cx, y, half } = TRAMPOLINE;
  const inner = half - 16;
  return (
    <g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={cx + side * (half - 14) - 7} y={y} width="14" height={FLOOR - y} rx="5" fill="#3a86ff" stroke={INK} strokeWidth="3" />
          <rect x={cx + side * (half - 14) - 16} y={FLOOR - 10} width="32" height="10" rx="4" fill={INK} />
        </g>
      ))}
      <path d={`M${cx - half} ${y} A${half} 16 0 0 1 ${cx + half} ${y}`} fill="none" stroke={INK} strokeWidth="12" />
      <path d={`M${cx - half} ${y} A${half} 16 0 0 1 ${cx + half} ${y}`} fill="none" stroke="#ff5d73" strokeWidth="6" />
      <path
        d={`M${cx - inner} ${y} Q${cx} ${y + 2 * dip - 12} ${cx + inner} ${y} Q${cx} ${y + 2 * dip + 12} ${cx - inner} ${y} Z`}
        fill="#2b2d6e"
        stroke={INK}
        strokeWidth="3"
      />
      <path d={`M${cx - half} ${y} A${half} 16 0 0 0 ${cx + half} ${y}`} fill="none" stroke={INK} strokeWidth="12" />
      <path d={`M${cx - half} ${y} A${half} 16 0 0 0 ${cx + half} ${y}`} fill="none" stroke="#ff5d73" strokeWidth="6" />
      {[-0.6, -0.2, 0.2, 0.6].map((k) => (
        <circle key={k} cx={cx + k * half} cy={y + 16 * Math.sqrt(1 - k * k)} r="4" fill={GOLD} />
      ))}
    </g>
  );
}

/* ---------- Seal, chute and elephant ---------- */

const SEAL_COLOR = "#5d7fb8";

/** The toy seal on its tub, its head turned `nod` degrees, its flipper up by `clap` (0–1). */
function Seal({ nod, clap }: { nod: number; clap: number }) {
  return (
    <g transform={`translate(${SEAL.x} ${SEAL.base})`}>
      <path d="M-70 0 C-118 -4 -128 -24 -112 -34 C-100 -24 -86 -14 -62 -12 Z" fill={SEAL_COLOR} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M-74 0 C-92 -50 -60 -126 -24 -150 C4 -168 32 -158 34 -126 C38 -84 54 -36 66 0 Z"
        fill={SEAL_COLOR}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="18" cy="-62" rx="30" ry="52" fill="#a9c3ea" />
      <path d="M-46 -40 C-50 -80 -40 -110 -22 -128" stroke="#fff5" strokeWidth="8" fill="none" strokeLinecap="round" />
      <g transform={`rotate(${-70 * clap} 26 -96)`}>
        <path d="M26 -96 C52 -84 66 -60 62 -40 C50 -46 34 -64 20 -86 Z" fill={SEAL_COLOR} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g transform={`rotate(${nod} ${NECK.x - SEAL.x} ${NECK.y - SEAL.base})`}>
        <circle cx="8" cy="-186" r="40" fill={SEAL_COLOR} stroke={INK} strokeWidth="4" />
        <ellipse cx="22" cy="-216" rx="20" ry="16" fill="#a9c3ea" stroke={INK} strokeWidth="3" transform="rotate(-30 22 -216)" />
        <circle cx="26" cy="-233" r="8" fill={INK} />
        <circle cx="23" cy="-236" r="2.5" fill="#fff" />
        <circle cx="-8" cy="-196" r="6" fill={INK} />
        <circle cx="-6" cy="-198" r="2" fill="#fff" />
        <path d="M34 -210 L56 -214 M34 -204 L56 -202 M12 -210 L-6 -220" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="-20" cy="-178" r="7" fill="#ff9bb5" opacity="0.8" />
      </g>
    </g>
  );
}

/** The chute from the seal down to the elephant's head: a pole at the top end, a rope near the bottom end. */
function Chute() {
  const endX = CHUTE.to.x - 20;
  return (
    <g>
      <Pole x={CHUTE.from.x + 16} y0={CHUTE.from.y + BALL_R + 14} y1={FLOOR} />
      <Rope x={endX - 60} y={chuteY(endX - 60) + BALL_R + 4} />
      <StripedRail a={CHUTE.from} b={{ x: endX, y: chuteY(endX) }} />
    </g>
  );
}

const ELEPHANT_COLOR = "#b3b1c9";

/** The toy elephant on its tub: its trunk lies under the marble's way, its tip curled up to fling the marble. */
function Elephant({ circus, t }: { circus: Circus; t: number }) {
  const { x, tubTop } = ELEPHANT;
  const bodyY = tubTop - 120;
  const trunkPts = beside(circus.trunkWay, BALL_R + TRUNK_W / 2);
  const trunk = svgLine(trunkPts);
  const tip = trunkPts[trunkPts.length - 1];
  const before = trunkPts[trunkPts.length - 2];
  const tipTurn = deg(Math.atan2(tip.y - before.y, tip.x - before.x));
  const flap = wobble(t - circus.tHead, 14, 10, 2);
  const toot = t - circus.tTip;
  return (
    <g>
      <Tub cx={x} top={tubTop} w={ELEPHANT.tubW} color="#ff8c42" />
      {/* The legs on the far side, then the near ones */}
      {[-88, 58].map((dx) => (
        <rect key={dx} x={x + dx + 14} y={bodyY + 30} width="34" height={tubTop - bodyY - 30} rx="10" fill="#9a98b4" stroke={INK} strokeWidth="3" />
      ))}
      <path
        d={`M${x - 136} ${bodyY - 10} C${x - 170} ${bodyY + 10} ${x - 168} ${bodyY + 50} ${x - 156} ${bodyY + 62}`}
        stroke={INK}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={x} cy={bodyY} rx="140" ry="84" fill={ELEPHANT_COLOR} stroke={INK} strokeWidth="4" />
      {[-104, 30].map((dx) => (
        <rect key={dx} x={x + dx} y={bodyY + 30} width="38" height={tubTop - bodyY - 30} rx="10" fill={ELEPHANT_COLOR} stroke={INK} strokeWidth="3" />
      ))}
      {/* The blanket on its back */}
      <path
        d={`M${x - 76} ${bodyY - 72} Q${x} ${bodyY - 92} ${x + 70} ${bodyY - 74} L${x + 62} ${bodyY + 10} Q${x} ${bodyY + 22} ${x - 66} ${bodyY + 8} Z`}
        fill="#ff3b5c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${x - 66} ${bodyY + 8} Q${x} ${bodyY + 22} ${x + 62} ${bodyY + 10}`} stroke={GOLD} strokeWidth="7" fill="none" />
      <Star x={x - 2} y={bodyY - 32} r={20} fill={GOLD} />
      {/* The trunk, with rings */}
      <path d={trunk} fill="none" stroke={INK} strokeWidth={TRUNK_W + 8} strokeLinecap="round" strokeLinejoin="round" />
      <path d={trunk} fill="none" stroke={ELEPHANT_COLOR} strokeWidth={TRUNK_W} strokeLinecap="round" strokeLinejoin="round" />
      <path d={trunk} fill="none" stroke="#9a98b4" strokeWidth={TRUNK_W - 6} strokeDasharray="3 22" />
      <ellipse cx={tip.x} cy={tip.y} rx="6" ry="13" fill="#6e6c8a" transform={`rotate(${tipTurn} ${tip.x} ${tip.y})`} />
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={ELEPHANT_COLOR} stroke={INK} strokeWidth="4" />
      <g transform={`rotate(${flap} ${HEAD.x - 30} ${HEAD.y - 40})`}>
        <ellipse cx={HEAD.x - 50} cy={HEAD.y + 8} rx="46" ry="60" fill={ELEPHANT_COLOR} stroke={INK} strokeWidth="4" />
        <ellipse cx={HEAD.x - 48} cy={HEAD.y + 10} rx="30" ry="42" fill="#ff9bb5" />
      </g>
      <circle cx={HEAD.x + 28} cy={HEAD.y - 14} r="8" fill={INK} />
      <circle cx={HEAD.x + 30} cy={HEAD.y - 17} r="2.5" fill="#fff" />
      <circle cx={HEAD.x + 14} cy={HEAD.y + 20} r="10" fill="#ff9bb5" opacity="0.8" />
      <path
        d={`M${HEAD.x + 38} ${HEAD.y + 36} Q${HEAD.x + 52} ${HEAD.y + 44} ${HEAD.x + 60} ${HEAD.y + 34}`}
        stroke={INK}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {toot >= 0 && toot < 1.2 && (
        <g opacity={1 - toot / 1.2} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round">
          {[0, 1, 2].map((k) => (
            <path key={k} transform={`rotate(${tipTurn} ${tip.x} ${tip.y})`} d={`M${tip.x + 30 + k * 16 + toot * 30} ${tip.y - 20} q10 20 0 40`} />
          ))}
        </g>
      )}
    </g>
  );
}

/* ---------- High wire, hoop and unicycle ---------- */

/** The two platforms on their poles and the high wire between them. */
function HighWire() {
  const plank = (x0: number, x1: number, y: number) => (
    <g>
      <Pole x={x0 + 22} y0={y + 10} y1={FLOOR} />
      <Pole x={x1 - 22} y0={y + 10} y1={FLOOR} />
      <rect x={x0} y={y} width={x1 - x0} height="16" rx="5" fill={GOLD} stroke={INK} strokeWidth="3" />
    </g>
  );
  return (
    <g>
      {plank(PLATFORM.x0, PLATFORM.x1, PLATFORM.y)}
      {plank(END.x0, END.x1, END.y)}
      <line x1={WIRE.from.x} y1={WIRE.from.y + 2} x2={WIRE.to.x} y2={WIRE.to.y + 2} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <line x1={WIRE.from.x} y1={WIRE.from.y + 1} x2={WIRE.to.x} y2={WIRE.to.y + 1} stroke="#e8e8f0" strokeWidth="2" />
    </g>
  );
}

const FLAME_COLORS = ["#ff3b3b", "#ff8c42", "#ffd23f"];

/**
 * The ring of paper flames on its pole. The ring is drawn twice: its `back`
 * with the flames behind the unicycle, its `front` half over it.
 */
function Hoop({ t, tPass, part }: { t: number; tPass: number; part: "back" | "front" }) {
  const { x, y, rx, ry } = HOOP;
  if (part === "front") {
    const d = `M${x} ${y - ry} A${rx} ${ry} 0 0 1 ${x} ${y + ry}`;
    return (
      <g>
        <path d={d} fill="none" stroke={INK} strokeWidth="16" />
        <path d={d} fill="none" stroke={GOLD} strokeWidth="9" />
      </g>
    );
  }
  const n = 16;
  return (
    <g>
      <Pole x={x} y0={y + ry} y1={FLOOR} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI;
        const px = x + rx * Math.cos(a);
        const py = y + ry * Math.sin(a);
        // Outward from the ring, but bent upwards like a flame.
        const out = deg(Math.atan2(Math.sin(a) / ry, Math.cos(a) / rx));
        const dir = lerp(out, -90, Math.sin(a) > 0 ? 0.35 : 0.55);
        const flutter = 6 * Math.sin(t * 5 + i * 1.7) + wobble(t - tPass, 30, 16, 2) * (i % 2 ? 1 : -1);
        const s = i % 3 === 0 ? 1.2 : 0.9;
        return (
          <path
            key={i}
            transform={`translate(${px} ${py}) rotate(${dir + 90 + flutter}) scale(${s})`}
            d="M-10 0 C-14 -18 -4 -28 -2 -46 C6 -34 14 -22 10 0 Z"
            fill={FLAME_COLORS[i % FLAME_COLORS.length]}
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        );
      })}
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth="16" />
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="none" stroke={GOLD} strokeWidth="9" />
    </g>
  );
}

/** The unicycle with the teddy holding out the back of its basket, its wheel's middle `at`, leaning `lean` degrees. */
function Unicycle({ at, turned, lean }: { at: Pt; turned: number; lean: number }) {
  const r = UNICYCLE.r;
  const spin = deg(turned / r);
  const crank = (side: number) => {
    const a = turned / r + (side < 0 ? Math.PI : 0);
    return { x: 14 * Math.cos(a), y: 14 * Math.sin(a) };
  };
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <g transform={`rotate(${spin})`}>
        <circle r={r} fill="#3b3b4f" stroke={INK} strokeWidth="3" />
        <circle r={r - 8} fill="#ffd23f" stroke={INK} strokeWidth="2" />
        {[0, 60, 120].map((a) => (
          <line key={a} transform={`rotate(${a})`} x1={-r + 9} y1="0" x2={r - 9} y2="0" stroke={INK} strokeWidth="2.5" />
        ))}
      </g>
      <g transform={`rotate(${lean})`}>
        {[-1, 1].map((side) => {
          const p = crank(side);
          return (
            <g key={side}>
              <line x1={side * 4} y1="-84" x2={p.x} y2={p.y} stroke="#a8743f" strokeWidth="9" strokeLinecap="round" />
              <rect x={p.x - 9} y={p.y - 3} width="18" height="7" rx="3" fill={INK} />
            </g>
          );
        })}
        <line x1="0" y1="0" x2="0" y2="-80" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        <line x1="0" y1="-2" x2="0" y2="-78" stroke="#ff5d73" strokeWidth="3" strokeLinecap="round" />
        <circle r="5" fill={INK} />
        <rect x="-18" y="-88" width="36" height="10" rx="5" fill={INK} />
        {/* The teddy */}
        <ellipse cx="0" cy="-110" rx="24" ry="28" fill="#c98a4b" stroke={INK} strokeWidth="3" />
        <ellipse cx="2" cy="-104" rx="13" ry="16" fill="#e8b98a" />
        {/* The back of the basket, then both arms reaching out to hold it */}
        <BasketBack />
        {["#3a2a1a", "#c98a4b"].map((color, i) => (
          <g key={color} stroke={i ? color : INK} strokeWidth={i ? 8 : 13} strokeLinecap="round" fill="none">
            <path d={`M-16 -124 Q${BASKET.x - 50} -112 ${BASKET.x - 28} ${BASKET.y + 8}`} />
            <path d={`M16 -124 Q${BASKET.x - 34} -128 ${BASKET.x - 24} ${BASKET.y + 2}`} />
          </g>
        ))}
        <path d="M-12 -138 L0 -132 L12 -138 L12 -126 L0 -132 L-12 -126 Z" fill="#ff3b5c" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="-14" cy="-168" r="8" fill="#c98a4b" stroke={INK} strokeWidth="2.5" />
        <circle cx="14" cy="-168" r="8" fill="#c98a4b" stroke={INK} strokeWidth="2.5" />
        <circle cx="0" cy="-153" r="20" fill="#c98a4b" stroke={INK} strokeWidth="3" />
        <ellipse cx="4" cy="-146" rx="9" ry="7" fill="#e8b98a" />
        <circle cx="5" cy="-149" r="3" fill={INK} />
        <circle cx="-5" cy="-158" r="2.5" fill={INK} />
        <circle cx="9" cy="-158" r="2.5" fill={INK} />
      </g>
    </g>
  );
}

const WICKER = "#d9a05b";

/** The inside back of the teddy's basket; the marble sits in front of it. */
function BasketBack() {
  const { x, y } = BASKET;
  return (
    <path
      d={`M${x - 31} ${y - 6} Q${x} ${y - 16} ${x + 31} ${y - 6} L${x + 26} ${y + 6} L${x - 26} ${y + 6} Z`}
      fill="#a8743f"
      stroke={INK}
      strokeWidth="3"
      strokeLinejoin="round"
    />
  );
}

/** The front of the teddy's basket, drawn over the marble; same place and lean as the unicycle. */
function Basket({ at, lean }: { at: Pt; lean: number }) {
  const { x, y } = BASKET;
  const rim = y - 6;
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${lean})`}>
      <path
        d={`M${x - 32} ${rim} L${x + 32} ${rim} Q${x + 30} ${y + 30} ${x} ${y + 30} Q${x - 30} ${y + 30} ${x - 32} ${rim} Z`}
        fill={WICKER}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[0, 1].map((k) => (
        <path
          key={k}
          d={`M${x - 29 + k * 4} ${y + 6 + k * 11} Q${x} ${y + 12 + k * 11} ${x + 29 - k * 4} ${y + 6 + k * 11}`}
          stroke="#a8743f"
          strokeWidth="3"
          fill="none"
        />
      ))}
      {[-16, 0, 16].map((dx) => (
        <line key={dx} x1={x + dx} y1={rim + 2} x2={x + dx * 0.8} y2={y + 28} stroke="#a8743f" strokeWidth="2.5" />
      ))}
      <rect x={x - 34} y={rim - 4} width="68" height="9" rx="4.5" fill="#c98a4b" stroke={INK} strokeWidth="3" />
      <circle cx={x + BASKET_RIM.x} cy={y + BASKET_RIM.y} r="4" fill="#ff3b5c" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/* ---------- Mast and ribbon, cannon, clown and net ---------- */

/** The tall striped mast behind the end of the high wire, with the eye the ribbon runs through at its top. */
function Mast() {
  return (
    <g>
      <Pole x={MAST.x} y0={MAST.top + 22} y1={FLOOR} w={16} />
      <circle cx={EYE.x} cy={EYE.y} r="13" fill="none" stroke={INK} strokeWidth="9" />
      <circle cx={EYE.x} cy={EYE.y} r="13" fill="none" stroke={GOLD} strokeWidth="4" />
      <Star x={MAST.x} y={MAST.top - 20} r={20} fill={GOLD} />
    </g>
  );
}

/**
 * The cannon's pull cord: a striped ribbon from a pull tab on the barrel up
 * through the eye and down to its tassel. `pulled` is how much of it has been
 * pulled through the eye; once `fired` the tab has popped off the barrel.
 */
function Ribbon({ tassel, pulled, fired }: { tassel: Pt; pulled: number; fired: boolean }) {
  // The tab slides off the barrel towards the eye as the ribbon is pulled.
  const toEye = { x: EYE.x - CORD_END.x, y: EYE.y - CORD_END.y };
  const reach = Math.hypot(toEye.x, toEye.y);
  const slide = Math.min(pulled + (fired ? 30 : 0), reach - 40);
  const tab = { x: CORD_END.x + (toEye.x / reach) * slide, y: CORD_END.y + (toEye.y / reach) * slide };
  // Hanging loose before it's caught, a little curve to it; pulled straight after.
  const slack = Math.max(0, 1 - pulled / 20);
  const midUp = { x: (EYE.x + tab.x) / 2 - 10 * slack, y: (EYE.y + tab.y) / 2 + 40 * slack };
  const midDown = { x: (EYE.x + tassel.x) / 2 - 14 * slack, y: (EYE.y + tassel.y) / 2 };
  const d = `M${tab.x} ${tab.y} Q${midUp.x} ${midUp.y} ${EYE.x} ${EYE.y - 13} Q${midDown.x} ${midDown.y} ${tassel.x} ${tassel.y}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#ff3b5c" strokeWidth="5" strokeDasharray="10 10" strokeDashoffset={pulled} />
      {/* The popper's string coming out of the slot, until the tab pops off */}
      {!fired && slide > 2 && <line x1={CORD_END.x} y1={CORD_END.y} x2={tab.x} y2={tab.y} stroke={INK} strokeWidth="2.5" />}
      {/* The pull tab: a little gold ring */}
      <circle cx={tab.x} cy={tab.y} r="9" fill="none" stroke={INK} strokeWidth="7" />
      <circle cx={tab.x} cy={tab.y} r="9" fill="none" stroke={GOLD} strokeWidth="3" />
      {/* The tassel */}
      <g transform={`translate(${tassel.x} ${tassel.y})`}>
        <circle r="7" fill={GOLD} stroke={INK} strokeWidth="2.5" />
        <path d="M-8 4 L-11 30 L11 30 L8 4 Z" fill="#8e7dff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        {[-6, 0, 6].map((dx) => (
          <line key={dx} x1={dx} y1="10" x2={dx * 1.3} y2="28" stroke="#5d4fd6" strokeWidth="2" />
        ))}
      </g>
    </g>
  );
}

/** The cannon: a starry barrel on a big wheel with a slot for the pull tab, kicking back a little `age` seconds after it fires. */
function Cannon({ age }: { age: number }) {
  const { x, y, angle, len, back, r } = CANNON;
  const kick = age >= 0 ? -14 * Math.exp(-age * 5) * Math.cos(age * 14) : 0;
  const wheelR = FLOOR - y;
  return (
    <g>
      <path
        d={`M${x - 70} ${FLOOR} L${x - 20} ${y - 26} L${x + 34} ${y - 26} L${x + 70} ${FLOOR} Z`}
        fill="#8a5a2b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <g transform={`translate(${x} ${y}) rotate(${-angle}) translate(${kick} 0)`}>
        <path
          d={`M${-back} ${-r} L${len - 10} ${-r + 6} L${len - 10} ${r - 6} L${-back} ${r} A${r} ${r} 0 0 1 ${-back} ${-r} Z`}
          fill="#3a86ff"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect x={len - 22} y={-r - 6} width="30" height={2 * r + 12} rx="8" fill="#ff3b5c" stroke={INK} strokeWidth="4" />
        <rect x={20} y={-r + 2} width="18" height={2 * r - 4} fill={GOLD} stroke={INK} strokeWidth="3" />
        <Star x={90} y={-2} r={16} fill={GOLD} turn={angle} />
        <Star x={120} y={8} r={11} fill="#fff" turn={angle} />
        <rect x={CANNON.cord - 9} y={-r - 4} width="18" height="8" rx="3" fill={INK} />
        <path d={`M${-back + 4} ${-r + 12} L${len - 30} ${-r + 14}`} stroke="#fff7" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g transform={`translate(${x} ${y}) rotate(${-kick * 2})`}>
        <circle r={wheelR} fill="#ffb703" stroke={INK} strokeWidth="4" />
        {[0, 45, 90, 135].map((a) => (
          <line key={a} transform={`rotate(${a})`} x1={-wheelR + 6} y1="0" x2={wheelR - 6} y2="0" stroke={INK} strokeWidth="4" />
        ))}
        <circle r="12" fill="#ff3b5c" stroke={INK} strokeWidth="3" />
      </g>
    </g>
  );
}

/** The clown doll, its middle `at`, turned `turn` degrees; `wave` counts the seconds since it landed. */
function Clown({ at, turn, wave }: { at: Pt; turn: number; wave: number }) {
  const arm = wave > 0 ? -50 + 22 * Math.sin(wave * 9) : 0;
  return (
    <g transform={`translate(${at.x} ${at.y}) rotate(${turn})`}>
      {[-1, 1].map((side) => (
        <g key={side}>
          <line x1={side * 10} y1="24" x2={side * 14} y2={CLOWN.seat - 6} stroke={INK} strokeWidth="10" strokeLinecap="round" />
          <ellipse cx={side * 20} cy={CLOWN.seat - 5} rx="16" ry="8" fill="#ff3b3b" stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      {[-1, 1].map((side) => (
        <g key={side} transform={`rotate(${side * arm} ${side * 22} -8)`}>
          <line x1={side * 22} y1="-8" x2={side * 44} y2="14" stroke={side < 0 ? "#8e7dff" : GOLD} strokeWidth="11" strokeLinecap="round" />
          <circle cx={side * 46} cy="16" r="8" fill="#fff" stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
      <path d="M-26 -12 Q-30 26 -14 30 L14 30 Q30 26 26 -12 Z" fill={GOLD} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M0 -12 L26 -12 Q30 26 14 30 L0 30 Z" fill="#8e7dff" />
      <path d="M-26 -12 Q-30 26 -14 30 L14 30 Q30 26 26 -12 Z" fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="0" cy="2" r="5" fill="#ff3b3b" stroke={INK} strokeWidth="2" />
      <circle cx="0" cy="18" r="5" fill="#3ec300" stroke={INK} strokeWidth="2" />
      <path d="M-28 -14 L-18 -22 L-8 -14 L2 -22 L12 -14 L22 -22 L30 -14 L22 -8 L-20 -8 Z" fill="#fff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="-26" cy={-CLOWN.head} r="12" fill="#00b4d8" stroke={INK} strokeWidth="2.5" />
      <circle cx="26" cy={-CLOWN.head} r="12" fill="#00b4d8" stroke={INK} strokeWidth="2.5" />
      <circle cx="0" cy={-CLOWN.head} r="26" fill="#ffe0bd" stroke={INK} strokeWidth="3" />
      <circle cx="-9" cy={-CLOWN.head - 6} r="3.5" fill={INK} />
      <circle cx="9" cy={-CLOWN.head - 6} r="3.5" fill={INK} />
      <path d={`M-12 ${-CLOWN.head + 8} Q0 ${-CLOWN.head + 20} 12 ${-CLOWN.head + 8}`} stroke="#ff3b3b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="0" cy={-CLOWN.head + 2} r="7" fill="#ff3b3b" stroke={INK} strokeWidth="2" />
      <path
        d={`M-16 ${-CLOWN.head - 20} L0 ${-CLOWN.head - 62} L16 ${-CLOWN.head - 20} Z`}
        fill="#3ec300"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="0" cy={-CLOWN.head - 64} r="7" fill={GOLD} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** The safety net on its two poles, its middle hanging `sag` below the hooks. */
function Net({ sag }: { sag: number }) {
  const { x0, x1, y } = NET;
  const rows = 3;
  const cols = 12;
  const at = (u: number, v: number): Pt => ({ x: lerp(x0, x1, u), y: y + 4 * sag * u * (1 - u) + v * 34 * Math.sin(Math.PI * u) });
  const mesh: string[] = [];
  for (let v = 0; v < rows; v++) {
    for (let i = 0; i < cols; i++) {
      const a = at(i / cols, v / rows);
      const b = at((i + 1) / cols, (v + 1) / rows);
      const c = at((i + 1) / cols, v / rows);
      const d = at(i / cols, (v + 1) / rows);
      mesh.push(`M${a.x} ${a.y} L${b.x} ${b.y} M${c.x} ${c.y} L${d.x} ${d.y}`);
    }
  }
  const curve = (v: number) => svgLine(Array.from({ length: cols * 2 + 1 }, (_, i) => at(i / (cols * 2), v)));
  return (
    <g>
      <Pole x={x0} y0={y - 40} y1={FLOOR} w={16} />
      <Pole x={x1} y0={y - 40} y1={FLOOR} w={16} />
      <path d={`${curve(0)} L${svgLine(Array.from({ length: cols * 2 + 1 }, (_, i) => at(1 - i / (cols * 2), 1))).slice(1)} Z`} fill="#fff" opacity="0.25" />
      <path d={mesh.join(" ")} stroke="#fff" strokeWidth="2.5" fill="none" />
      <path d={curve(1)} stroke={INK} strokeWidth="3" fill="none" />
      <path d={curve(0)} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx={x0} cy={y} r="6" fill={GOLD} stroke={INK} strokeWidth="2.5" />
      <circle cx={x1} cy={y} r="6" fill={GOLD} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/* ---------- Finale ---------- */

/** The little stage at the end of the ring; its curtain is `open` (0–1). */
function Stage({ open }: { open: number }) {
  const { x0, x1, top } = STAGE;
  const mid = (x0 + x1) / 2;
  const inner = { x0: x0 + 30, x1: x1 - 30, top: top + 70 };
  const half = (inner.x1 - inner.x0) / 2;
  const w = half * (1 - 0.72 * open);
  const curtain = (side: number) => {
    const edge = side < 0 ? inner.x0 : inner.x1;
    const free = edge - side * w;
    const folds = Array.from({ length: 4 }, (_, k) => edge - (side * w * (k + 0.5)) / 4);
    return (
      <g key={side}>
        <path
          d={`M${edge} ${inner.top} L${free} ${inner.top} Q${free + side * 20 * open} ${(inner.top + FLOOR) / 2} ${free} ${FLOOR - 34} L${edge} ${FLOOR - 34} Z`}
          fill="#d62839"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {folds.map((fx) => (
          <line key={fx} x1={fx} y1={inner.top + 10} x2={fx} y2={FLOOR - 44} stroke="#a51d2c" strokeWidth="6" strokeLinecap="round" />
        ))}
        <rect x={Math.min(edge, free)} y={FLOOR - 50} width={w} height="14" fill={GOLD} stroke={INK} strokeWidth="2.5" />
      </g>
    );
  };
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top} rx="10" fill="#c8323f" stroke={INK} strokeWidth="4" />
      <rect x={inner.x0} y={inner.top} width={inner.x1 - inner.x0} height={FLOOR - 34 - inner.top} fill="#2b2d6e" stroke={INK} strokeWidth="3" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle
          key={i}
          cx={inner.x0 + 30 + ((i * 131) % (inner.x1 - inner.x0 - 60))}
          cy={inner.top + 30 + ((i * 89) % 380)}
          r={i % 3 ? 3 : 5}
          fill="#fff"
          opacity="0.8"
        />
      ))}
      <Star x={mid} y={inner.top + 150} r={90} fill={GOLD} turn={open * 20} />
      {open > 0 && (
        <circle cx={mid} cy={inner.top + 150} r={110 + 10 * Math.sin(open * 12)} fill="none" stroke="#fff6b0" strokeWidth="8" opacity={open * 0.7} />
      )}
      {curtain(-1)}
      {curtain(1)}
      {/* The valance with the little lamps */}
      <rect x={x0} y={top} width={x1 - x0} height="70" rx="10" fill={GOLD} stroke={INK} strokeWidth="4" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle
          key={i}
          cx={x0 + 40 + i * ((x1 - x0 - 80) / 8)}
          cy={top + 35}
          r="11"
          fill={open > 0 && (i + Math.floor(open * 10)) % 2 ? "#fff6b0" : BAR_COLORS[i % BAR_COLORS.length]}
          stroke={INK}
          strokeWidth="2.5"
        />
      ))}
    </g>
  );
}

/** Two spotlights hanging from the tent, shining on the clown once they are `on` (0–1). */
function Spotlights({ on }: { on: number }) {
  const target = { x: (NET.x0 + NET.x1) / 2, y: NET.y + NET.sag - 30 };
  return (
    <g>
      {[4520, 5460].map((x) => {
        const lamp = { x, y: 150 };
        const a = deg(Math.atan2(target.y - lamp.y, target.x - lamp.x));
        const n = { x: Math.cos(rad(a + 90)), y: Math.sin(rad(a + 90)) };
        return (
          <g key={x}>
            {on > 0 && (
              <path
                d={`M${lamp.x + n.x * 24} ${lamp.y + n.y * 24} L${target.x + n.x * 120} ${target.y + n.y * 120} L${target.x - n.x * 120} ${target.y - n.y * 120} L${lamp.x - n.x * 24} ${lamp.y - n.y * 24} Z`}
                fill="#fff6b0"
                opacity={0.4 * on}
              />
            )}
            <Rope x={x} y={lamp.y - 30} />
            <g transform={`translate(${lamp.x} ${lamp.y}) rotate(${a})`}>
              <rect x="-40" y="-26" width="60" height="52" rx="10" fill="#3b3b4f" stroke={INK} strokeWidth="4" />
              <rect x="16" y="-32" width="18" height="64" rx="6" fill={on > 0 ? "#fff6b0" : "#7d7d96"} stroke={INK} strokeWidth="4" />
            </g>
            <circle cx={lamp.x} cy={lamp.y - 30} r="6" fill={INK} />
          </g>
        );
      })}
    </g>
  );
}

const CONFETTI = Array.from({ length: 90 }, (_, i) => ({
  x: 4020 + ((i * 397) % 1560),
  y0: -40 - ((i * 53) % 360),
  speed: 190 + ((i * 37) % 130),
  rest: FLOOR + 6 + ((i * 29) % 46),
  sway: 10 + (i % 4) * 6,
  color: BAR_COLORS[i % BAR_COLORS.length],
}));

/** Confetti raining down from the top of the tent and coming to rest on the sawdust. */
function ConfettiRain({ age }: { age: number }) {
  if (age < 0) return null;
  return (
    <g>
      {CONFETTI.map((c, i) => {
        const y = Math.min(c.rest, c.y0 + c.speed * age);
        const falling = y < c.rest;
        const x = c.x + (falling ? c.sway * Math.sin(age * 4 + i) : c.sway * Math.sin(((c.rest - c.y0) / c.speed) * 4 + i));
        const spin = falling ? age * 300 + i * 40 : i * 40;
        return (
          <rect
            key={i}
            transform={`translate(${x} ${y}) rotate(${spin})`}
            x="-6"
            y="-9"
            width="12"
            height="18"
            rx="2"
            fill={c.color}
            stroke={INK}
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}

/** A puff of confetti out of the cannon's mouth, `age` seconds after it fires. */
function ConfettiBurst({ age }: { age: number }) {
  if (age < 0 || age > 1.6) return null;
  const aim = rad(CANNON.angle);
  return (
    <g opacity={Math.min(1, (1.6 - age) * 2)}>
      {Array.from({ length: 26 }, (_, i) => {
        const a = aim + ((i % 9) - 4) * 0.12;
        const v = 320 + ((i * 47) % 260);
        const x = MUZZLE.x + v * Math.cos(a) * age;
        const y = MUZZLE.y - v * Math.sin(a) * age + 500 * age * age;
        return (
          <rect
            key={i}
            transform={`translate(${x} ${y}) rotate(${age * 600 + i * 30})`}
            x="-5"
            y="-8"
            width="10"
            height="16"
            rx="2"
            fill={BAR_COLORS[i % BAR_COLORS.length]}
            stroke={INK}
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}
