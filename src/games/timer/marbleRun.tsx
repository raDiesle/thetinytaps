import { memo, useEffect, useMemo, useState, type CSSProperties } from "react";
import { MASCOT_COLORS } from "@/components/Mascot";
import { playKnock } from "@/lib/sfx";
import { type Frame, keyframes } from "./keyframes";
import { useRunClock } from "./pause";
import { INK, Layer, STAGE_H, STAGE_W } from "./scenes";
import { PlayerPatch } from "./players";
import type { PlayerLook, Players, TurnChild, TurnCount } from "./settings";

// Kugelbahn (H-117 with H-115, user request, 24 November 2026): two to four children take turns, reihum. A wooden
// marble run hangs on the playroom's wall, a zigzag of ramps from a jar of marbles at the top left down to a bottom rail
// over the children's cups. The whole turn long one marble rolls down it, ramp after ramp, along the bottom rail to the
// cup of the child whose turn comes next, where a flap in the rail stands open, and falls in: then that child is dran.
// So the marble's way is the time, plain from afar – the higher it still is, the longer it takes – and the waiting child
// sees where it goes from the first second. Whose turn it is shows across the room (the rules): that child's whole strip
// of the room is lit warm, the others lie in plain shade. Each child's cup is a children's cup in its own colour with its
// animal's ears (fox, bear, rabbit, frog – no faces, as Abwechseln's cushions), and a marble that fell into it stays
// there until every child has had a turn (H-115's tick), then the cups are empty again. The marble moves on keyframes
// written for the turn (its way at an even pace, the fall at the end quick), and it spins at least half a turn a second
// in the way it rolls, so even a ten-minute turn plainly moves.

/** A marble's radius. */
export const MARBLE_R = 22;

/**
 * The run's zigzag: the ramps' ends (their marbles' middles), where the first starts, how much each ramp falls, the
 * radius of the curved end pieces between them, and the bottom rail's left end.
 */
export const RUN = { left: 330, right: 1270, top: 236, drop: 32, bend: 24, end: 290 } as const;

/** How many ramps, the last being the bottom rail over the cups. */
export const RAMPS = 4;

/** From one ramp's start to the next one's. */
const LEVEL = RUN.drop + 2 * RUN.bend;

/** How much a ramp falls along its length. */
const SLOPE = RUN.drop / (RUN.right - RUN.left);

/** How far below a marble's middle its rail's middle lies. */
const UNDER = MARBLE_R + 6;

/** The bottom rail's marble line at `x`: it falls from the right, where the last curve sets the marble down. */
export const bottomAt = (x: number) => RUN.top + (RAMPS - 1) * LEVEL + (RUN.right - x) * SLOPE;

/** The cups: their rims' middle and their bottom. */
export const CUP = { rim: 648, bottom: 772 } as const;

/** Where the children's cups stand, left to right in the order of their turns: as far apart as the picture allows. */
export const CUP_XS: Record<TurnCount, readonly number[]> = { 2: [470, 1130], 3: [400, 800, 1200], 4: [355, 650, 945, 1240] };

/** How wide each cup is for that many children. */
export const CUP_W: Record<TurnCount, number> = { 2: 250, 3: 240, 4: 214 };

/** Where a marble lying in a cup has its middle: sunk a little below the rim, so its top shows over the front lip. */
export const REST_Y = CUP.rim + 8;

/** Half the width of the hole in the bottom rail over each cup. */
const GAP = MARBLE_R + 10;

/** The marbles' colours, one after the other turn by turn. */
export const MARBLE_COLORS = ["#e03131", "#1c7ed6", "#f59f00", "#ae3ec9", "#2f9e44"] as const;

/** How the points of a curved end piece are sampled. */
const BEND_STEPS = 10;

/** One point on a marble's way; `fall` ends the drop into the cup, `bend` lies on a curved end piece. */
export interface WayPoint {
  x: number;
  y: number;
  fall?: boolean;
  bend?: boolean;
}

/** The marble's way down the run into the cup `to` (counted from the left) for `count` children. */
export function marbleWay(count: TurnCount, to: number): WayPoint[] {
  const way: WayPoint[] = [{ x: RUN.left, y: RUN.top }];
  for (let i = 0; i < RAMPS - 1; i++) {
    const y = RUN.top + i * LEVEL;
    const right = i % 2 === 0;
    const end = right ? RUN.right : RUN.left;
    way.push({ x: end, y: y + RUN.drop });
    // The curved end piece: half a circle down to the next ramp, bulging outwards.
    const cy = y + RUN.drop + RUN.bend;
    for (let s = 1; s <= BEND_STEPS; s++) {
      const a = -Math.PI / 2 + (s / BEND_STEPS) * Math.PI;
      way.push({ x: end + (right ? 1 : -1) * RUN.bend * Math.cos(a), y: cy + RUN.bend * Math.sin(a), bend: true });
    }
  }
  const x = CUP_XS[count][to];
  way.push({ x, y: bottomAt(x) }, { x, y: REST_Y, fall: true });
  return way;
}

/** One moment of the marble's way: where it is and how far it has turned (degrees, clockwise). */
export interface MarbleFrame {
  at: number;
  x: number;
  y: number;
  turn: number;
}

/** The slowest the marble spins, in radians a second, however long the turn: half a turn. */
const MIN_SPIN = Math.PI;

/**
 * The marble's whole turn of `ms`: its frames along the way (an even pace on the rails, a quick fall into the cup at
 * the end), and the moments it reaches each curved end piece (a soft knock).
 */
export function marblePlan(count: TurnCount, to: number, ms: number) {
  const way = marbleWay(count, to);
  const fall = Math.min(600, Math.max(250, ms * 0.06));
  const length = (i: number) => Math.hypot(way[i].x - way[i - 1].x, way[i].y - way[i - 1].y);
  let rolled = 0;
  for (let i = 1; i < way.length; i++) if (!way[i].fall) rolled += length(i);
  const rollMs = ms - fall;
  const frames: MarbleFrame[] = [{ at: 0, x: way[0].x, y: way[0].y, turn: 0 }];
  const bends: number[] = [];
  let at = 0;
  let turn = 0;
  let sign = 1;
  for (let i = 1; i < way.length; i++) {
    const dt = way[i].fall ? fall : (length(i) / rolled) * rollMs;
    if (!way[i].fall) {
      const dx = way[i].x - way[i - 1].x;
      if (Math.abs(dx) > 0.5) sign = dx > 0 ? 1 : -1;
      turn += sign * Math.max(length(i) / MARBLE_R, (dt / 1000) * MIN_SPIN) * (180 / Math.PI);
    }
    if (way[i].bend && !way[i - 1].bend) bends.push(at);
    at += dt;
    frames.push({ at: i === way.length - 1 ? ms : at, x: way[i].x, y: way[i].y, turn });
  }
  return { frames, bends, fall };
}

/** A marble's shine and outline, standing still over its turning swirl. */
function MarbleShine() {
  const r = MARBLE_R;
  return (
    <svg viewBox={`0 0 ${2 * r} ${2 * r}`} className="tm-mr-shine">
      <ellipse cx={r - 7} cy={r - 9} rx="7" ry="5" fill="#fff" opacity="0.85" transform={`rotate(-30 ${r - 7} ${r - 9})`} />
      <circle cx={r} cy={r} r={r - 2} fill="none" stroke={INK} strokeWidth="3" />
    </svg>
  );
}

/** A marble's glass with its coloured swirl, the part that turns as it rolls. */
function MarbleSwirl({ color }: { color: string }) {
  const r = MARBLE_R;
  return (
    <svg viewBox={`0 0 ${2 * r} ${2 * r}`}>
      <circle cx={r} cy={r} r={r - 2} fill="#e7f5ff" />
      <path
        d={`M${r - 16} ${r + 4} C${r - 8} ${r - 14} ${r + 6} ${r + 14} ${r + 16} ${r - 6}`}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d={`M${r - 6} ${r - 16} C${r + 2} ${r - 8} ${r - 2} ${r + 6} ${r + 8} ${r + 16}`}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

/** A marble lying still in its cup (or falling into it, `drop`). */
function RestingMarble({ x, color, on, drop }: { x: number; color: string; on: boolean; drop?: number }) {
  return (
    <Layer x={x - MARBLE_R} y={REST_Y - MARBLE_R} w={2 * MARBLE_R} h={2 * MARBLE_R} className={`tm-mr-rest${on ? " tm-on" : ""}`}>
      <div
        key={drop}
        className={drop ? "tm-mr-drop" : undefined}
        style={{ "--tm-mr-fall": `${(((bottomAt(x) - REST_Y) / (2 * MARBLE_R)) * 100).toFixed(1)}%` } as CSSProperties}
      >
        <MarbleSwirl color={color} />
        <MarbleShine />
      </div>
    </Layer>
  );
}

/**
 * The marble rolling the whole turn long, from the jar down the run into the cup `to`: two small layers on keyframes
 * written for the turn (its way, and its spin inside it), started `startedAt` on the run's clock – read once as it
 * comes, so give each turn its own `name` (and key). It knocks softly at each curved end piece, unless `quiet` (a card).
 */
function RollingMarble({
  name,
  count,
  to,
  ms,
  startedAt,
  color,
  quiet,
}: {
  name: string;
  count: TurnCount;
  to: number;
  ms: number;
  startedAt: number;
  color: string;
  quiet?: boolean;
}) {
  const clock = useRunClock();
  const [delay] = useState(() => Math.max(0, clock.now() - startedAt));
  const plan = useMemo(() => marblePlan(count, to, ms), [count, to, ms]);
  const first = plan.frames[0];
  const pct = (v: number) => ((v / (2 * MARBLE_R)) * 100).toFixed(2);
  const go: Frame[] = plan.frames.map((f) => ({ at: f.at, transform: `translate(${pct(f.x - first.x)}%, ${pct(f.y - first.y)}%)`, ease: "linear" }));
  const spin: Frame[] = plan.frames.map((f) => ({ at: f.at, transform: `rotate(${f.turn.toFixed(1)}deg)`, ease: "linear" }));
  const timing = `${ms}ms linear ${-delay}ms both`;

  // A soft knock as it reaches each curved end piece, on the run's clock: none while paused.
  const { paused, now } = clock;
  useEffect(() => {
    if (quiet || paused) return;
    const timers = plan.bends
      .map((at) => startedAt + at - now())
      .filter((wait) => wait > 0)
      .map((wait) => setTimeout(() => playKnock(900), wait));
    return () => {
      for (const timer of timers) clearTimeout(timer);
    };
  }, [quiet, paused, now, plan, startedAt]);

  return (
    <>
      <style>{`${keyframes(`${name}-go`, ms, go)}\n${keyframes(`${name}-spin`, ms, spin)}`}</style>
      <Layer
        x={first.x - MARBLE_R}
        y={first.y - MARBLE_R}
        w={2 * MARBLE_R}
        h={2 * MARBLE_R}
        className="tm-mr-roll"
        style={{ animation: `${name}-go ${timing}` }}
      >
        <div className="tm-mr-spin" style={{ animation: `${name}-spin ${timing}` }}>
          <MarbleSwirl color={color} />
        </div>
        <MarbleShine />
      </Layer>
    </>
  );
}

/** Each child's cup: its colours, and the colour seen inside it. Fox and bear in the mascots' own colours. */
const CUP_LOOK: Record<TurnChild, { body: string; shade: string; light: string; inside: string; ear: string; earIn: string }> = {
  fox: {
    body: MASCOT_COLORS.fox.fur,
    shade: MASCOT_COLORS.fox.shade,
    light: MASCOT_COLORS.fox.light,
    inside: "#5c2a10",
    ear: MASCOT_COLORS.fox.fur,
    earIn: MASCOT_COLORS.fox.earIn,
  },
  bear: {
    body: MASCOT_COLORS.bear.fur,
    shade: MASCOT_COLORS.bear.shade,
    light: MASCOT_COLORS.bear.light,
    inside: "#3f2312",
    ear: MASCOT_COLORS.bear.fur,
    earIn: MASCOT_COLORS.bear.earIn,
  },
  rabbit: { body: "#4dabf7", shade: "#1c7ed6", light: "#a5d8ff", inside: "#0b3d6b", ear: "#f8f9fa", earIn: "#ffc9de" },
  frog: { body: "#51cf66", shade: "#2f9e44", light: "#b2f2bb", inside: "#14532d", ear: "#51cf66", earIn: "#d3f9d8" },
};

/** A cup's ears (or the frog's bumps), behind its back rim: no face, so it stays a cup and never an animal standing by. */
function CupEars({ kind, x, w }: { kind: TurnChild; x: number; w: number }) {
  const look = CUP_LOOK[kind];
  const top = CUP.rim - w * 0.13;
  return (
    <g strokeLinejoin="round">
      {[-1, 1].map((side) =>
        kind === "fox" ? (
          <g key={side}>
            <path
              d={`M${x + side * w * 0.18} ${top + 8} L${x + side * w * 0.3} ${top - 62} L${x + side * w * 0.42} ${top + 14} Z`}
              fill={look.ear}
              stroke={INK}
              strokeWidth="5"
            />
            <path d={`M${x + side * w * 0.25} ${top + 4} L${x + side * w * 0.3} ${top - 38} L${x + side * w * 0.36} ${top + 6} Z`} fill={look.earIn} />
          </g>
        ) : kind === "bear" ? (
          <g key={side}>
            <circle cx={x + side * w * 0.32} cy={top - 14} r="26" fill={look.ear} stroke={INK} strokeWidth="5" />
            <circle cx={x + side * w * 0.32} cy={top - 14} r="13" fill={look.earIn} />
          </g>
        ) : kind === "rabbit" ? (
          <g key={side} transform={`rotate(${side * 10} ${x + side * w * 0.2} ${top + 10})`}>
            <ellipse cx={x + side * w * 0.2} cy={top - 44} rx="19" ry="56" fill={look.ear} stroke={INK} strokeWidth="5" />
            <ellipse cx={x + side * w * 0.2} cy={top - 40} rx="9" ry="40" fill={look.earIn} />
          </g>
        ) : (
          <g key={side}>
            <circle cx={x + side * w * 0.27} cy={top - 6} r="28" fill={look.ear} stroke={INK} strokeWidth="5" />
            <circle cx={x + side * w * 0.27 - 6} cy={top - 14} r="9" fill={look.earIn} opacity="0.9" />
          </g>
        ),
      )}
    </g>
  );
}

/** The back of a cup: its ears, its rim and the dark inside the marble lies in. */
function CupBack({ kind, x, w }: { kind: TurnChild; x: number; w: number }) {
  const look = CUP_LOOK[kind];
  const rx = w / 2;
  const ry = w * 0.13;
  return (
    <g>
      <CupEars kind={kind} x={x} w={w} />
      <ellipse cx={x} cy={CUP.rim} rx={rx} ry={ry} fill={look.light} stroke={INK} strokeWidth="5" />
      <ellipse cx={x} cy={CUP.rim + 3} rx={rx - 12} ry={ry - 6} fill={look.inside} />
    </g>
  );
}

/** The front of a cup, over a marble lying in it: its body, a pale band round it, a soft shine and the child's photo or name. */
function CupFront({ kind, x, w, player }: { kind: TurnChild; x: number; w: number; player?: PlayerLook }) {
  const look = CUP_LOOK[kind];
  const rx = w / 2;
  const ry = w * 0.13;
  const b = (w * 0.84) / 2;
  const { rim, bottom } = CUP;
  const body = `M${x - rx} ${rim} L${x - b} ${bottom - 26} Q${x - b} ${bottom} ${x - b + 26} ${bottom} H${x + b - 26} Q${x + b} ${bottom} ${x + b} ${bottom - 26} L${x + rx} ${rim} A${rx} ${ry} 0 0 1 ${x - rx} ${rim} Z`;
  const band = rim + (bottom - rim) * 0.55;
  return (
    <g strokeLinejoin="round">
      <ellipse cx={x} cy={bottom + 4} rx={b + 20} ry="12" fill="#000" opacity="0.16" />
      <path d={body} fill={look.body} stroke={INK} strokeWidth="5" />
      <path d={`M${x - rx * 0.93} ${band - 14} Q${x} ${band + 10} ${x + rx * 0.93} ${band - 14}`} fill="none" stroke="#fff" strokeWidth="14" opacity="0.55" />
      <path d={`M${x + b - 14} ${rim + ry + 12} L${x + b - 24} ${bottom - 22}`} stroke={look.shade} strokeWidth="10" strokeLinecap="round" opacity="0.6" />
      <path d={`M${x - rx + 26} ${rim + ry + 10} L${x - b + 20} ${bottom - 40}`} stroke={look.light} strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <path
        d={`M${x - rx} ${rim} A${rx} ${ry} 0 0 0 ${x + rx} ${rim}`}
        fill="none"
        stroke={look.light}
        strokeWidth="4"
        transform={`translate(0 3)`}
        opacity="0.9"
      />
      <PlayerPatch look={player} x={x} y={band - 4} r={w * 0.16} color={look.shade} />
    </g>
  );
}

/** The cups' box on the stage: from above the tallest ears to below their shadows. */
const CUPS_TOP = CUP.rim - 140;
const CUPS_H = CUP.bottom + 30 - CUPS_TOP;

/** The cups' backs, drawn once for that many children. */
const CupsBack = memo(function CupsBack({ kids }: { kids: readonly TurnChild[] }) {
  const count = kids.length as TurnCount;
  return (
    <Layer x={0} y={CUPS_TOP} w={STAGE_W} h={CUPS_H}>
      <svg viewBox={`0 ${CUPS_TOP} ${STAGE_W} ${CUPS_H}`}>
        {kids.map((kind, i) => (
          <CupBack key={kind} kind={kind} x={CUP_XS[count][i]} w={CUP_W[count]} />
        ))}
      </svg>
    </Layer>
  );
});

/** The cups' fronts, over the marbles lying in them; drawn once for that many children. */
const CupsFront = memo(function CupsFront({ kids, players }: { kids: readonly TurnChild[]; players: Players }) {
  const count = kids.length as TurnCount;
  return (
    <Layer x={0} y={CUPS_TOP} w={STAGE_W} h={CUPS_H}>
      <svg viewBox={`0 ${CUPS_TOP} ${STAGE_W} ${CUPS_H}`}>
        {kids.map((kind, i) => (
          <CupFront key={kind} kind={kind} x={CUP_XS[count][i]} w={CUP_W[count]} player={players[kind]} />
        ))}
      </svg>
    </Layer>
  );
});

/** The wooden board the run is fixed on. */
export const BOARD = { x: 236, y: 128, w: 1128, h: 470 } as const;

/** The jar of marbles at the run's top left, its mouth over the first ramp's start. */
const JAR = { x: RUN.left - 6, top: 140, bottom: RUN.top - MARBLE_R - 2, w: 128 } as const;

/** A playroom wall with the run's board on it, a floor with a rug, and the jar of marbles; drawn once. */
export const MarbleBackdrop = memo(function MarbleBackdrop() {
  const floor = 712;
  const { x, top, bottom, w } = JAR;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`} preserveAspectRatio="none">
        <rect width={STAGE_W} height={STAGE_H} fill="#fff4e6" />
        {Array.from({ length: 17 }, (_, i) => (
          <path key={i} d={`M${i * 100 + 50} 0 V${floor}`} stroke="#ffe8cc" strokeWidth="26" />
        ))}
        <rect y={floor} width={STAGE_W} height={STAGE_H - floor} fill="#d9a066" />
        <path d={`M0 ${floor} H${STAGE_W}`} stroke="#a8743f" strokeWidth="6" />
        <ellipse cx="800" cy={CUP.bottom + 6} rx="700" ry="54" fill="#91a7ff" opacity="0.55" />
        <rect x={BOARD.x} y={BOARD.y} width={BOARD.w} height={BOARD.h} rx="22" fill="#f1d7a8" stroke={INK} strokeWidth="6" />
        {[0.2, 0.45, 0.7].map((k) => (
          <path
            key={k}
            d={`M${BOARD.x + 20} ${BOARD.y + BOARD.h * k} C${BOARD.x + 400} ${BOARD.y + BOARD.h * k - 12} ${BOARD.x + 700} ${BOARD.y + BOARD.h * k + 14} ${BOARD.x + BOARD.w - 20} ${BOARD.y + BOARD.h * k}`}
            stroke="#e2bd85"
            strokeWidth="4"
            fill="none"
          />
        ))}
        {[
          [BOARD.x + 22, BOARD.y + 22],
          [BOARD.x + BOARD.w - 22, BOARD.y + 22],
          [BOARD.x + 22, BOARD.y + BOARD.h - 22],
          [BOARD.x + BOARD.w - 22, BOARD.y + BOARD.h - 22],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="#adb5bd" stroke={INK} strokeWidth="3" />
        ))}
        {/* The jar: a glass with a red lid, a few marbles in it, its neck pointing down onto the first ramp. */}
        <g strokeLinejoin="round">
          <path
            d={`M${x - w / 2} ${top + 14} H${x + w / 2} V${bottom - 26} Q${x + w / 2} ${bottom - 12} ${x + 16} ${bottom - 8} V${bottom} H${x - 16} V${bottom - 8} Q${x - w / 2} ${bottom - 12} ${x - w / 2} ${bottom - 26} Z`}
            fill="#e7f5ff"
            stroke={INK}
            strokeWidth="5"
            opacity="0.95"
          />
          {[
            [-36, bottom - 30, 0],
            [-6, bottom - 26, 1],
            [24, bottom - 30, 2],
            [48, bottom - 36, 3],
          ].map(([dx, cy, c]) => (
            <g key={`${dx}-${cy}`}>
              <circle cx={x + dx} cy={cy} r="13" fill={MARBLE_COLORS[c]} stroke={INK} strokeWidth="3" />
              <circle cx={x + dx - 4} cy={cy - 4} r="3.5" fill="#fff" opacity="0.8" />
            </g>
          ))}
          <rect x={x - w / 2 - 8} y={top} width={w + 16} height="22" rx="8" fill="#e03131" stroke={INK} strokeWidth="5" />
        </g>
      </svg>
    </Layer>
  );
});

/** The run's rails, curved end pieces and the bottom rail with a hole and a funnel over every cup; drawn once per count. */
export const MarbleTrack = memo(function MarbleTrack({ count }: { count: TurnCount }) {
  const rails: string[] = [];
  const walls: string[] = [];
  for (let i = 0; i < RAMPS - 1; i++) {
    const y = RUN.top + i * LEVEL;
    const right = i % 2 === 0;
    const [from, to] = right ? [RUN.left - 14, RUN.right] : [RUN.right, RUN.left];
    rails.push(`M${from} ${y + (from === RUN.left - 14 ? -14 * SLOPE : 0) + UNDER} L${to} ${y + RUN.drop + UNDER}`);
    const cy = y + RUN.drop + RUN.bend;
    const r = RUN.bend + UNDER;
    walls.push(`M${to} ${cy - r} A${r} ${r} 0 0 ${right ? 1 : 0} ${to} ${cy + r}`);
  }
  // The bottom rail, broken at a hole over every cup.
  const xs = CUP_XS[count];
  const cuts = [RUN.right, ...xs.flatMap((x) => [x + GAP, x - GAP]).sort((a, b) => b - a), RUN.end];
  for (let k = 0; k + 1 < cuts.length; k += 2) rails.push(`M${cuts[k]} ${bottomAt(cuts[k]) + UNDER} L${cuts[k + 1]} ${bottomAt(cuts[k + 1]) + UNDER}`);
  const stop = bottomAt(RUN.end) + UNDER;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <svg viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}>
        <g fill="none" strokeLinecap="round">
          {[...rails, ...walls].map((d) => (
            <path key={d} d={d} stroke={INK} strokeWidth="22" />
          ))}
          {[...rails, ...walls].map((d) => (
            <path key={`w${d}`} d={d} stroke="#e0a458" strokeWidth="14" />
          ))}
          {rails.map((d) => (
            <path key={`l${d}`} d={d} stroke="#f6d49a" strokeWidth="3" transform="translate(0 -3)" />
          ))}
        </g>
        <rect x={RUN.end - 14} y={stop - 46} width="18" height="56" rx="6" fill="#e0a458" stroke={INK} strokeWidth="4" />
        {xs.map((x) => {
          const top = bottomAt(x) + UNDER + 6;
          return (
            <path
              key={x}
              d={`M${x - GAP - 4} ${top} H${x + GAP + 4} L${x + 16} ${top + 40} H${x - 16} Z`}
              fill="#e0a458"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
    </Layer>
  );
});

/** The flap in the bottom rail over a cup: lying shut in its hole, or hanging open for the marble of the child whose turn comes next. */
function Gate({ x, open }: { x: number; open: boolean }) {
  const y = bottomAt(x) + UNDER;
  const w = 2 * GAP + 8;
  return (
    <Layer x={x - GAP - 4} y={y - 9} w={w} h={18} className={`tm-mr-gate${open ? " tm-open" : ""}`}>
      <svg viewBox={`0 0 ${w} 18`}>
        <rect x="2" y="2" width={w - 4} height="14" rx="5" fill="#c9853f" stroke={INK} strokeWidth="4" />
        <circle cx="9" cy="9" r="4" fill="#868e96" />
      </svg>
    </Layer>
  );
}

/** The edges of each child's strip of the room: halfway between the cups. */
function strips(count: TurnCount) {
  const xs = CUP_XS[count];
  return xs.map((x, i) => ({ x: i === 0 ? 0 : (xs[i - 1] + x) / 2, right: i === xs.length - 1 ? STAGE_W : (x + xs[i + 1]) / 2 }));
}

/** The marble rolling in the current turn: its name for its keyframes, the cup it goes to, its turn's start and length, and its colour. */
export interface Rolling {
  name: string;
  to: number;
  startedAt: number;
  ms: number;
  color: string;
}

const NO_PLAYERS: Players = {};

/**
 * The Kugelbahn on the stage for the children `kids` (two to four, left to right): `lit` says whose strip of the room is
 * lit (the child whose turn it is, or everyone at the end), `held` the colour of the marble lying in each cup (or null),
 * `open` the cup whose flap stands open, `rolling` the marble on its way, `drop` the cup whose marble is just falling in
 * (a turn begun anew), and `poke` counts the taps, each lighting the cup the marble goes to (H-51).
 */
export function MarbleScene({
  kids,
  lit,
  held,
  open,
  rolling,
  drop,
  poke,
  quiet,
  players = NO_PLAYERS,
}: {
  kids: readonly TurnChild[];
  lit: readonly boolean[];
  held: readonly (string | null)[];
  open: number | null;
  rolling: Rolling | null;
  drop?: { cup: number; key: number };
  poke: number;
  quiet?: boolean;
  /** The children's photos and names, on their cups' fronts. */
  players?: Players;
}) {
  const count = kids.length as TurnCount;
  const xs = CUP_XS[count];
  return (
    <>
      <MarbleBackdrop />
      {strips(count).map((s, i) => (
        <Layer key={`l${i}`} x={s.x} y={0} w={s.right - s.x} h={STAGE_H} className={`tm-mr-light${lit[i] ? " tm-on" : ""}`} />
      ))}
      {strips(count).map((s, i) => (
        <Layer key={`s${i}`} x={s.x} y={0} w={s.right - s.x} h={STAGE_H} className={`tm-mr-shade${lit[i] ? "" : " tm-on"}`} />
      ))}
      <MarbleTrack count={count} />
      {xs.map((x, i) => (
        <Gate key={x} x={x} open={open === i} />
      ))}
      {open !== null && poke > 0 && <Layer key={poke} x={xs[open] - 170} y={CUP.rim - 190} w={340} h={340} className="tm-mr-goal" />}
      <CupsBack kids={kids} />
      {xs.map((x, i) => (
        <RestingMarble key={x} x={x} color={held[i] ?? MARBLE_COLORS[0]} on={held[i] !== null} drop={drop?.cup === i ? drop.key : undefined} />
      ))}
      {rolling && <RollingMarble key={rolling.name} count={count} quiet={quiet} {...rolling} />}
      <CupsFront kids={kids} players={players} />
    </>
  );
}
