import { type CSSProperties, memo, useMemo } from "react";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Draw, INK, Layer, LeftGlow, STAGE_W } from "./scenes";

// Hop to the Flag (H-127, user request, 22 November 2026: a timer like a game played by itself that is no block world
// again): a jump-and-run seen from the side, on one screen. A little round hopper stands at the left of a sunny level –
// meadow, a stone, three floating islands over a pond, a log, steps up a hill – and at its right end, on the hilltop, a
// flagpole with its flag still down, the goal seen from the start. A trail of stars hangs in arcs over the way, one over
// every hop. One hop after the other the hopper jumps on, catching the star over it, and bounces once a second while it
// waits for the next. The stars still hanging are the time left; when it lands on the hilltop, the flag goes up.
// A genre's look of our own – our own figure and level, nothing of one game (no pipes, no question blocks, no castle).

/** The hopper's layer, a square standing with its feet's middle on its spot. */
export const RUNNER = 84;

/** The meadow's top, where the hopper stands on the ground. */
export const GROUND = 700;

/** Where the hopper stands, one spot after the other from the left: its feet's middle on the ground, a stone, an island, a log or a step. */
export const SPOTS: readonly { x: number; y: number }[] = [
  { x: 280, y: GROUND },
  { x: 352, y: 650 },
  { x: 422, y: GROUND },
  { x: 490, y: GROUND },
  { x: 568, y: 615 },
  { x: 646, y: 510 },
  { x: 724, y: 615 },
  { x: 802, y: GROUND },
  { x: 866, y: 650 },
  { x: 926, y: GROUND },
  { x: 990, y: 640 },
  { x: 1054, y: 575 },
  { x: 1118, y: 510 },
  { x: 1178, y: 510 },
];

/** The level's things, which the spots stand on: the stone, the three islands over the pond, the log, the steps up the hill. */
export const STONE = { cx: 352, top: 650 } as const;
export const POND = { x: 530, to: 767, top: 742 } as const;
export const ISLANDS: readonly { x: number; w: number; top: number }[] = [
  { x: 525, w: 86, top: 615 },
  { x: 603, w: 86, top: 510 },
  { x: 681, w: 86, top: 615 },
];
export const LOG = { x: 831, w: 70, top: 650 } as const;
export const STEPS: readonly { x: number; top: number }[] = [
  { x: 958, top: 640 },
  { x: 1022, top: 575 },
  { x: 1086, top: 510 },
];

/** The flagpole on the hilltop, right of the last spot, so the flag waiting at its foot never stands behind the hopper: its x, its foot and its top. */
export const POLE = { x: 1328, foot: 510, top: 210 } as const;

/** How many hops the whole way has: five minutes take all of them, one about every 23 seconds. */
export const MAX_HOPS = SPOTS.length - 1;

/** The fewest hops a run makes: a short time starts further along the way. */
export const MIN_HOPS = 8;

/** How many hops a run of `ms` makes. */
export function hopCount(ms: number): number {
  return Math.max(MIN_HOPS, Math.min(MAX_HOPS, Math.round(ms / 23_000)));
}

/** How high the hopper's feet go over the higher of its two spots. */
export const HOP_H = 90;

/** How long a hop takes at most: less when the hops come quickly, never more than half its share of the time. */
export const HOP_MS = 700;

/** Where in its hop the hopper is at the top of its arc (a share of the hop's time), and its star hangs. */
const TOP_AT = 0.45;

/** One hop of a run: from which spot (to the next), when it leaves and lands, how high its feet go, and when it catches its star. */
export interface RunHop {
  k: number;
  start: number;
  land: number;
  peak: number;
  star: number;
}

/**
 * Works out a run of `total` ms making `count` hops: the hopper starts on the spot `count` hops before the hilltop
 * (`first`), each hop has the same share of the time (`unit`) and lands at its end, the last as the time is up; it
 * catches its star at the top of the arc.
 */
export function jumpPlan(total: number, count: number): { first: number; unit: number; hops: RunHop[] } {
  const first = MAX_HOPS - count;
  const unit = total / count;
  const hopMs = Math.min(HOP_MS, unit * 0.5);
  const hops = Array.from({ length: count }, (_, i) => {
    const k = first + i;
    const land = (i + 1) * unit;
    const start = land - hopMs;
    return { k, start, land, peak: Math.min(SPOTS[k].y, SPOTS[k + 1].y) - HOP_H, star: start + hopMs * TOP_AT };
  });
  return { first, unit, hops };
}

/** The star of the hop from spot `k`: its middle, where the hopper's body is at the top of the arc. */
export function starAt(k: number): { x: number; y: number } {
  const from = SPOTS[k];
  const to = SPOTS[k + 1];
  return { x: from.x + (to.x - from.x) * TOP_AT, y: Math.min(from.y, to.y) - HOP_H - RUNNER / 2 };
}

/** A star's square layer. */
export const STAR = 52;

/** A transform moving the hopper from its first spot by `d` stage units, across or up and down, in % of its own size. */
const move = (axis: "X" | "Y", d: number) => `translate${axis}(${((d / RUNNER) * 100).toFixed(2)}%)`;

/** The hopper's way as two lists of keyframes: across at an even pace while it hops, and up and down in its arcs. */
export function runnerFrames(first: number, hops: RunHop[]): { across: Frame[]; upDown: Frame[] } {
  const origin = SPOTS[first];
  const across: Frame[] = [{ at: 0, transform: move("X", 0) }];
  const upDown: Frame[] = [{ at: 0, transform: move("Y", 0) }];
  for (const h of hops) {
    const from = SPOTS[h.k];
    const to = SPOTS[h.k + 1];
    across.push({ at: h.start, transform: move("X", from.x - origin.x), ease: "linear" }, { at: h.land, transform: move("X", to.x - origin.x) });
    upDown.push(
      // Rising slower towards the top, falling faster, as a thrown thing does (the same curves as `hop.tsx`).
      { at: h.start, transform: move("Y", from.y - origin.y), ease: "cubic-bezier(0.2, 0.7, 0.4, 1)" },
      { at: h.start + (h.land - h.start) * TOP_AT, transform: move("Y", h.peak - origin.y), ease: "cubic-bezier(0.6, 0, 0.8, 0.4)" },
      { at: h.land, transform: move("Y", to.y - origin.y) },
    );
  }
  return { across, upDown };
}

/** The hopper's way as keyframes made for this run. */
function JumpKeyframes({ total, first, hops }: { total: number; first: number; hops: RunHop[] }) {
  const { across, upDown } = runnerFrames(first, hops);
  const rules = [keyframes("tm-jump-x", total, holdToEnd(across, total)), keyframes("tm-jump-y", total, holdToEnd(upDown, total))];
  return <style>{rules.join("\n")}</style>;
}

/** Grass and earth: the meadow's, the islands' and the steps'. */
const GRASS = "#6cc04a";
const GRASS_LIGHT = "#94d82d";
const EARTH = "#b9783f";
const EARTH_DARK = "#9c6230";

/** A block of earth with grass on top, `x` to `x + w` wide from `top` down to `bottom`, its top corners rounded. */
function Ground({ x, w, top, bottom }: { x: number; w: number; top: number; bottom: number }) {
  return (
    <g>
      <rect x={x} y={top} width={w} height={bottom - top} rx="14" fill={EARTH} stroke={INK} strokeWidth="5" />
      {/* Pebbles in the earth. */}
      {Array.from({ length: Math.max(1, Math.floor(w / 70)) }, (_, i) => (
        <ellipse key={i} cx={x + 30 + i * 70 + (i % 2) * 18} cy={top + 62 + (i % 3) * 34} rx="9" ry="6" fill={EARTH_DARK} />
      ))}
      {/* The grass on top, its lower edge in soft scallops. */}
      <path
        d={`M${x} ${top + 12} Q${x} ${top} ${x + 12} ${top} H${x + w - 12} Q${x + w} ${top} ${x + w} ${top + 12} V${top + 20} ${Array.from(
          { length: Math.ceil(w / 24) },
          (_, i) => `Q${x + w - i * 24 - 12} ${top + 32} ${Math.max(x, x + w - (i + 1) * 24)} ${top + 20}`,
        ).join(" ")} Z`}
        fill={GRASS}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x={x + 10} y={top + 5} width={w - 20} height="5" rx="2.5" fill={GRASS_LIGHT} />
    </g>
  );
}

/** A floating island: grass on top, its earth narrowing to a rounded point below. */
function Island({ x, w, top }: { x: number; w: number; top: number }) {
  return (
    <g>
      <path d={`M${x + 4} ${top + 18} Q${x + w / 2} ${top + 78} ${x + w - 4} ${top + 18} Z`} fill={EARTH} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx={x + w / 2 - 6} cy={top + 38} rx="7" ry="5" fill={EARTH_DARK} />
      <rect x={x} y={top} width={w} height="24" rx="12" fill={GRASS} stroke={INK} strokeWidth="5" />
      <rect x={x + 10} y={top + 5} width={w - 20} height="5" rx="2.5" fill={GRASS_LIGHT} />
    </g>
  );
}

/**
 * The level: the sky with two soft hills far off and two clouds, the meadow on the left with its stone, the pond with
 * the three islands over it, the meadow on the right with the log, and the steps up the hill; drawn once, stepping back
 * from afar (H-48).
 */
const JumpBackdrop = memo(function JumpBackdrop() {
  const bottom = 920;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={900} className="tm-back">
      <Draw w={STAGE_W} h={900}>
        <defs>
          <linearGradient id="tm-jump-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#74c0fc" />
            <stop offset="1" stopColor="#e7f5ff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height="900" fill="url(#tm-jump-sky)" />
        {/* Two soft hills far off. */}
        <path d="M-40 720 Q260 420 620 720 Z" fill="#c3e8b0" />
        <path d="M480 720 Q900 380 1320 720 Z" fill="#b2dd9c" />
        {/* Two round clouds, standing still. */}
        {[
          [300, 190, 1],
          [880, 130, 0.85],
        ].map(([x, y, s]) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" stroke="#d0ebff" strokeWidth="4">
            <path d="M-90 30 Q-100 -6 -60 -8 Q-50 -48 -6 -40 Q24 -70 60 -36 Q100 -40 98 0 Q118 30 80 34 Z" />
          </g>
        ))}
        {/* The pond under the islands, with a few soft waves. */}
        <rect x={POND.x - 20} y={POND.top} width={POND.to - POND.x + 40} height={bottom - POND.top} fill="#4dabf7" />
        <rect x={POND.x - 20} y={POND.top} width={POND.to - POND.x + 40} height="10" fill="#a5d8ff" />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${POND.x + 30 + i * 70} ${POND.top + 44 + i * 26} q14 -10 28 0 t28 0`}
            fill="none"
            stroke="#a5d8ff"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}
        {/* The meadow left of the pond and the one right of it, up to the steps. */}
        <Ground x={-30} w={POND.x + 30} top={GROUND} bottom={bottom} />
        <Ground x={POND.to} w={STEPS[0].x - POND.to + 40} top={GROUND} bottom={bottom} />
        {/* The steps up the hill, each reaching to the right edge, the higher one in front. */}
        {STEPS.map((s) => (
          <Ground key={s.x} x={s.x} w={STAGE_W - s.x + 30} top={s.top} bottom={bottom} />
        ))}
        {/* Flowers on the meadows, dots of colour. */}
        {[
          [190, "#ff8787"],
          [455, "#ffd43b"],
          [914, "#f783ac"],
        ].map(([x, c]) => (
          <g key={x as number}>
            <path d={`M${x} ${GROUND + 2} V${GROUND - 22}`} stroke="#2f9e44" strokeWidth="4" />
            <circle cx={x as number} cy={GROUND - 26} r="9" fill={c as string} stroke={INK} strokeWidth="3" />
          </g>
        ))}
        {/* The stone on the left meadow. */}
        <ellipse cx={STONE.cx} cy={STONE.top + 32} rx="40" ry="34" fill="#adb5bd" stroke={INK} strokeWidth="5" />
        <path
          d={`M${STONE.cx - 22} ${STONE.top + 18} Q${STONE.cx - 8} ${STONE.top + 8} ${STONE.cx + 8} ${STONE.top + 12}`}
          fill="none"
          stroke="#e9ecef"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect x={STONE.cx - 44} y={GROUND - 4} width="88" height="10" fill={GRASS} />
        {/* The islands over the pond. */}
        {ISLANDS.map((i) => (
          <Island key={i.x} {...i} />
        ))}
        {/* The log lying on the right meadow, its cut end showing its rings. */}
        <rect x={LOG.x} y={LOG.top} width={LOG.w} height={GROUND - LOG.top + 4} rx="22" fill="#a0612b" stroke={INK} strokeWidth="5" />
        <path d={`M${LOG.x + 14} ${LOG.top + 14} H${LOG.x + LOG.w - 26}`} stroke="#7a4518" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx={LOG.x + LOG.w - 12} cy={(LOG.top + GROUND) / 2 + 2} rx="14" ry="22" fill="#e8b86d" stroke={INK} strokeWidth="4" />
        <ellipse cx={LOG.x + LOG.w - 12} cy={(LOG.top + GROUND) / 2 + 2} rx="6" ry="10" fill="none" stroke="#a0612b" strokeWidth="3" />
      </Draw>
    </Layer>
  );
});

/** The flagpole on the hilltop with its golden knob, standing bright as the goal; drawn once. */
const Pole = memo(function Pole() {
  const w = 40;
  const h = POLE.foot - POLE.top + 20;
  return (
    <Layer x={POLE.x - w / 2} y={POLE.top - 20} w={w} h={h}>
      <svg viewBox={`0 0 ${w} ${h}`}>
        <rect x={w / 2 - 6} y="22" width="12" height={h - 26} rx="5" fill="#dee2e6" stroke={INK} strokeWidth="4" />
        <circle cx={w / 2} cy="18" r="14" fill="#ffd43b" stroke={INK} strokeWidth="4" />
        <circle cx={w / 2 - 4} cy="13" r="4" fill="#fff3bf" />
      </svg>
    </Layer>
  );
});

/** The flag, its layer where it flies at the end: down at the pole's foot while the hopper is on its way, going up at the end. */
export const FLAG = { w: 100, h: 72, top: POLE.top + 14, low: POLE.foot - 92 } as const;

/** The flag on the pole, a layer of its own: lowered (`--tm-flag-low`) until the end, then going up. */
const Flag = memo(function Flag() {
  const { w, h } = FLAG;
  const low = `translateY(${(((FLAG.low - FLAG.top) / h) * 100).toFixed(2)}%)`;
  return (
    <Layer x={POLE.x - w} y={FLAG.top} w={w} h={h} className="tm-jump-flag" style={{ "--tm-flag-low": low } as CSSProperties}>
      <svg viewBox={`0 0 ${w} ${h}`}>
        {/* It flies to the left, the wind coming from the right, so it stays within the picture. */}
        <path
          d={`M${w - 4} 4 Q${w * 0.55} 18 6 6 Q22 ${h / 2} 6 ${h - 6} Q${w * 0.55} ${h - 18} ${w - 4} ${h - 4} Z`}
          fill="#e03131"
          stroke={INK}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d={`M${w * 0.55} ${h / 2 - 17} l6 12 13 2 -10 9 3 13 -12 -7 -12 7 3 -13 -10 -9 13 -2 Z`}
          fill="#ffd43b"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    </Layer>
  );
});

/** One star of the trail, five round points, golden with a light on it. */
export function StarArt() {
  return (
    <svg viewBox="0 0 52 52">
      <path
        d="M26 3 L32.5 17.5 L48 19 L36.5 29.5 L40 45 L26 37 L12 45 L15.5 29.5 L4 19 L19.5 17.5 Z"
        fill="#ffd43b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M20 20 Q24 15 28 16" fill="none" stroke="#fff9db" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** The stars still to catch, one over every hop of the run, each caught at the top of its hop; while it hangs a tap lights it (H-51). */
const Stars = memo(function Stars({ hops, glow }: { hops: RunHop[]; glow: number }) {
  return (
    <>
      {hops.map((h) => {
        const c = starAt(h.k);
        const at = { "--tm-at": `${h.star}ms` } as CSSProperties;
        return (
          <Layer key={h.k} x={c.x - STAR / 2} y={c.y - STAR / 2} w={STAR} h={STAR}>
            <div className="tm-jump-star" style={at}>
              <StarArt />
            </div>
            <div className="tm-toy-left" style={at}>
              <LeftGlow n={glow} />
            </div>
          </Layer>
        );
      })}
    </>
  );
});

/** The hopper: a round little ball with big eyes looking ahead (right), rosy cheeks and two small feet. */
function HopperArt() {
  return (
    <svg viewBox={`0 0 ${RUNNER} ${RUNNER}`}>
      {/* Its feet, under it. */}
      <ellipse cx="30" cy="77" rx="13" ry="7" fill="#364fc7" stroke={INK} strokeWidth="4" />
      <ellipse cx="56" cy="77" rx="13" ry="7" fill="#364fc7" stroke={INK} strokeWidth="4" />
      <circle cx="42" cy="42" r="32" fill="#ff922b" stroke={INK} strokeWidth="5" />
      <path d="M22 26 Q30 16 42 15" fill="none" stroke="#ffd8a8" strokeWidth="6" strokeLinecap="round" />
      {/* Big eyes looking ahead, each with a light. */}
      {[42, 60].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="36" rx="8" ry="11" fill="#fff" stroke={INK} strokeWidth="3" />
          <ellipse cx={x + 3} cy="38" rx="4.5" ry="6.5" fill={INK} />
          <circle cx={x + 4.5} cy="35" r="1.8" fill="#fff" />
        </g>
      ))}
      <ellipse cx="34" cy="52" rx="6" ry="4" fill="#ff6b6b" opacity="0.6" />
      <path d="M48 52 Q54 58 61 52" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * The hopper on its way: two layers inside each other on keyframes written for the run (across, then up and down), and
 * inside them its bounce once a second while it waits, squashing on its feet and springing up a little (H-63).
 */
const Runner = memo(function Runner({ first }: { first: number }) {
  const start = SPOTS[first];
  const end = SPOTS[MAX_HOPS];
  return (
    <Layer
      x={start.x - RUNNER / 2}
      y={start.y - RUNNER}
      w={RUNNER}
      h={RUNNER}
      className="tm-hop tm-jump-runner"
      style={{ "--tm-anim": "tm-jump-x", "--tm-end": move("X", end.x - start.x) } as CSSProperties}
    >
      <div className="tm-hop tm-hop-y" style={{ "--tm-anim": "tm-jump-y", "--tm-end": move("Y", end.y - start.y) } as CSSProperties}>
        <div className="tm-jump-bob">
          <HopperArt />
        </div>
      </div>
    </Layer>
  );
});

/** The whole picture: the level, the flag on its pole, the stars still to catch and the hopper. */
export function JumpScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the stars.
  const { first, hops } = useMemo(() => jumpPlan(total, count), [total, count]);
  return (
    <>
      <JumpBackdrop />
      <JumpKeyframes total={total} first={first} hops={hops} />
      <Flag />
      <Pole />
      <Stars hops={hops} glow={glow} />
      <Runner first={first} />
    </>
  );
}
