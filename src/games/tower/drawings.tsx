import { memo } from "react";
import { MASCOT_INK as INK } from "@/components/Mascot";
import { BAND, type Point, RAINBOW, type TowerLayout, goalPlace, leafPile, treeAt } from "./layout";
import type { GoalId } from "./names";

// The Counting Tower's drawings: each a small svg on an HTML layer of its own, so what moves (a block flying, the
// balloon bobbing, the child) moves as a layer and the sky behind it is never painted again (root CLAUDE.md, phones).

/** The blocks' colours, bottom to top in each ten: a rainbow, and every tenth gold. */
export const BLOCK_COLORS = ["#ff6b6b", "#ff922b", "#ffd43b", "#8ce99a", "#38d9a9", "#4dabf7", "#748ffc", "#b197fc", "#f783ac", "#fcc419"];

/** One wooden toy block, 180 × 100, its number painted on its front. */
export const Block = memo(function Block({ n }: { n: number }) {
  const color = BLOCK_COLORS[(n - 1) % BLOCK_COLORS.length];
  const gold = n % 10 === 0;
  return (
    <svg viewBox="0 0 180 100" aria-hidden>
      <rect x="4" y="4" width="172" height="92" rx="14" fill={color} stroke={INK} strokeWidth="5" />
      {/* Light on its top edge, shade along its foot, and the wood's grain: a toy block, not a flat box. */}
      <path d="M18 14 H162" stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.45" />
      <path d="M12 84 Q90 92 168 84" stroke={INK} strokeWidth="6" fill="none" opacity="0.14" strokeLinecap="round" />
      <path d="M24 34 Q40 30 52 36 M128 70 Q142 64 156 70" stroke={INK} strokeWidth="3" fill="none" opacity="0.18" strokeLinecap="round" />
      {gold && <path d="M30 50 l5 -10 l5 10 l-5 10 Z M140 50 l5 -10 l5 10 l-5 10 Z" fill="#fff" opacity="0.8" />}
      <text
        x="90"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="68"
        fontWeight="800"
        fontFamily="inherit"
        fill="#fff"
        stroke={INK}
        strokeWidth="7"
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {n}
      </text>
    </svg>
  );
});

/**
 * The red balloon with its string hanging down `hang` and `aside` (in its own box's units: 100 wide, 120 tall plus the
 * string), so the string's end waits just above where the child's paw will reach.
 */
export const Balloon = memo(function Balloon({ hang, aside = 0 }: { hang: number; aside?: number }) {
  const end = { x: 50 + aside, y: 120 + hang };
  return (
    <svg viewBox={`0 0 100 ${120 + hang}`} overflow="visible" aria-hidden>
      <path
        d={`M50 112 C${50 + aside * 0.1} ${126 + hang * 0.35} ${50 + aside * 0.75} ${120 + hang * 0.55} ${end.x} ${end.y}`}
        stroke={INK}
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M50 6 C78 6 94 30 94 54 C94 82 72 104 50 106 C28 104 6 82 6 54 C6 30 22 6 50 6 Z" fill="#fa5252" stroke={INK} strokeWidth="4" />
      <path d="M44 106 L56 106 L52 114 L48 114 Z" fill="#e03131" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="32" cy="34" rx="9" ry="15" fill="#fff" opacity="0.55" transform="rotate(28 32 34)" />
      <circle cx="28" cy="56" r="3.5" fill="#fff" opacity="0.45" />
    </svg>
  );
});

/** The kite, 100 × 120 plus its string down `hang` and `aside` to where the child's paw will be, with a bowed tail. */
export const Kite = memo(function Kite({ hang, aside = 0 }: { hang: number; aside?: number }) {
  const end = { x: 50 + aside, y: 120 + hang };
  return (
    <svg viewBox={`0 0 100 ${120 + hang}`} overflow="visible" aria-hidden>
      <path
        d={`M50 104 C${50 + aside * 0.2} ${120 + hang * 0.3} ${50 + aside * 0.7} ${110 + hang * 0.7} ${end.x} ${end.y}`}
        stroke={INK}
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M50 104 Q66 112 58 120 Q48 128 62 136" stroke={INK} strokeWidth="2.5" fill="none" />
      <path d="M56 118 l8 -4 l0 8 Z M54 132 l8 -4 l0 8 Z" fill="#f06595" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M50 6 L88 46 L50 104 L12 46 Z" fill="#fcc419" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M50 6 L50 104 M12 46 L88 46" stroke={INK} strokeWidth="2.5" opacity="0.5" />
      <path d="M50 6 L88 46 L50 46 Z M12 46 L50 104 L50 46 Z" fill="#4dabf7" />
      <path d="M50 6 L88 46 L50 104 L12 46 Z" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
});

/** A folded paper plane, 100 × 60, nose to the right. */
export const Plane = memo(function Plane() {
  return (
    <svg viewBox="0 0 100 60" aria-hidden>
      <path d="M4 22 L96 30 L30 56 Z" fill="#e7f5ff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M4 22 L96 30 L36 34 Z" fill="#fff" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M36 34 L30 56" stroke={INK} strokeWidth="2.5" opacity="0.6" />
      <path d="M4 22 L60 4 L96 30" fill="#d0ebff" stroke={INK} strokeWidth="3" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
});

/** A big soft cloud to stand on, 200 × 100, with a sleepy face that wakes as the child comes near. */
export const CloudSeat = memo(function CloudSeat({ awake }: { awake: boolean }) {
  return (
    <svg viewBox="0 0 200 100" aria-hidden>
      <path
        d="M24 86 C4 86 2 58 24 56 C20 30 52 22 66 38 C72 12 116 6 126 32 C140 16 176 24 172 52 C198 54 198 86 174 86 Z"
        fill="#fff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M40 80 Q100 92 164 80" stroke="#d0ebff" strokeWidth="8" fill="none" strokeLinecap="round" />
      {awake ? (
        <>
          <circle cx="84" cy="58" r="5" fill={INK} />
          <circle cx="116" cy="58" r="5" fill={INK} />
        </>
      ) : (
        <path d="M78 58 Q84 63 90 58 M110 58 Q116 63 122 58" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      <path d="M92 70 Q100 76 108 70" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="70" cy="68" r="6" fill="#ffc9c9" opacity="0.7" />
      <circle cx="130" cy="68" r="6" fill="#ffc9c9" opacity="0.7" />
    </svg>
  );
});

/**
 * The rainbow from the tower's top down to the meadow, drawn in its box's own pixels: `bands` of its six shown (it comes
 * band by band as the tower nears it), the slide's top edge from `from` over `bend` to `to`, a puff of cloud at its foot.
 */
export const Rainbow = memo(function Rainbow({
  w,
  h,
  from,
  bend,
  to,
  b,
  bands,
}: {
  w: number;
  h: number;
  from: Point;
  bend: Point;
  to: Point;
  b: number;
  bands: number;
}) {
  const band = BAND * b;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} overflow="visible" aria-hidden>
      {RAINBOW.map((color, i) => (
        <path
          key={color}
          d={`M${from.x} ${from.y + (i + 0.5) * band} Q${bend.x} ${bend.y + (i + 0.5) * band} ${to.x} ${to.y + (i + 0.5) * band}`}
          stroke={color}
          strokeWidth={band * 1.04}
          fill="none"
          opacity={i < bands ? 1 : 0.18}
        />
      ))}
      <path d={`M${from.x} ${from.y} Q${bend.x} ${bend.y} ${to.x} ${to.y}`} stroke={INK} strokeWidth={Math.max(1.5, 0.06 * b)} fill="none" opacity="0.5" />
      <g fill="#fff" stroke={INK} strokeWidth={Math.max(1.5, 0.05 * b)}>
        <ellipse cx={to.x} cy={h - 0.25 * b} rx={0.9 * b} ry={0.38 * b} />
        <ellipse cx={to.x - 0.4 * b} cy={h - 0.45 * b} rx={0.45 * b} ry={0.32 * b} />
        <ellipse cx={to.x + 0.35 * b} cy={h - 0.5 * b} rx={0.5 * b} ry={0.36 * b} />
      </g>
    </svg>
  );
});

/** The hot-air balloon, 100 × 150: a striped envelope, ropes, and a basket whose floor is at 140. */
export const HotAir = memo(function HotAir() {
  return (
    <svg viewBox="0 0 100 150" aria-hidden>
      <path d="M30 96 L36 116 M70 96 L64 116" stroke={INK} strokeWidth="2.5" />
      <path d="M50 4 C82 4 98 28 96 52 C94 74 76 88 68 98 L32 98 C24 88 6 74 4 52 C2 28 18 4 50 4 Z" fill="#ff8787" stroke={INK} strokeWidth="4" />
      <path d="M50 4 C38 20 34 60 40 98 L60 98 C66 60 62 20 50 4 Z" fill="#ffe066" stroke={INK} strokeWidth="3" />
      <path d="M50 4 C24 14 14 50 24 84 L32 98 C26 70 30 28 50 4 Z M50 4 C76 14 86 50 76 84 L68 98 C74 70 70 28 50 4 Z" fill="#74c0fc" opacity="0.85" />
      <ellipse cx="30" cy="30" rx="6" ry="12" fill="#fff" opacity="0.5" transform="rotate(25 30 30)" />
      <rect x="30" y="114" width="40" height="30" rx="5" fill="#c08040" stroke={INK} strokeWidth="4" />
      <path d="M32 124 H68 M32 134 H68 M42 116 V142 M58 116 V142" stroke="#8a5a2b" strokeWidth="2.5" />
    </svg>
  );
});

/** An owl, 100 × 90, facing left: the mother, brown, or `baby`, grey and fluffy. */
export const Owl = memo(function Owl({ baby = false }: { baby?: boolean }) {
  const body = baby ? "#ced4da" : "#a0703c";
  const belly = baby ? "#f1f3f5" : "#e6c79c";
  return (
    <svg viewBox="0 0 100 90" aria-hidden>
      <path d="M22 26 L18 6 L36 18 Z M78 26 L82 6 L64 18 Z" fill={body} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="50" cy="52" rx="34" ry="34" fill={body} stroke={INK} strokeWidth="4" />
      <ellipse cx="50" cy="64" rx="20" ry="18" fill={belly} />
      <circle cx="36" cy="40" r="12" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="64" cy="40" r="12" fill="#fff" stroke={INK} strokeWidth="3" />
      <circle cx="35" cy="41" r="5.5" fill={INK} />
      <circle cx="63" cy="41" r="5.5" fill={INK} />
      <circle cx="33.5" cy="39.5" r="1.8" fill="#fff" />
      <circle cx="61.5" cy="39.5" r="1.8" fill="#fff" />
      <path d="M46 50 L50 58 L54 50 Z" fill="#fab005" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
});

/** The owl's home at the branch's end, 120 × 60: a hollow stump with its dark hole facing the tower. */
export const Hollow = memo(function Hollow() {
  return (
    <svg viewBox="0 0 120 60" aria-hidden>
      <path d="M10 8 Q60 0 110 8 L106 56 Q60 62 14 56 Z" fill="#9c6b3c" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="60" cy="10" rx="48" ry="7" fill="#3b2a1a" />
      <path d="M24 26 Q34 30 30 44 M90 22 Q84 34 92 46" stroke="#6b4423" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
});

/** The nest of twigs, 120 × 60, open at the top. */
export const Nest = memo(function Nest() {
  return (
    <svg viewBox="0 0 120 60" aria-hidden>
      <path d="M6 18 Q60 36 114 18 Q112 54 60 56 Q8 54 6 18 Z" fill="#a8743a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d="M14 26 Q40 40 70 32 M24 40 Q60 50 100 30 M12 20 Q30 30 44 26 M78 26 Q96 28 108 20"
        stroke="#6b4423"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
});

/** A little bird, 100 × 80 facing left, blue: the mother, or `baby`, yellow and round with a tuft. */
export const Bird = memo(function Bird({ baby = false }: { baby?: boolean }) {
  const body = baby ? "#ffd43b" : "#4dabf7";
  const wing = baby ? "#fab005" : "#1c7ed6";
  return (
    <svg viewBox="0 0 100 80" aria-hidden>
      {!baby && <path d="M74 44 L98 34 L94 52 Z" fill={wing} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />}
      <ellipse cx="54" cy="50" rx={baby ? 32 : 36} ry={baby ? 27 : 24} fill={body} stroke={INK} strokeWidth="4" />
      <circle cx="34" cy={baby ? 34 : 30} r={baby ? 20 : 19} fill={body} stroke={INK} strokeWidth="4" />
      <path d="M58 48 Q72 40 82 52 Q70 64 58 56 Z" fill={wing} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path d={`M16 ${baby ? 34 : 30} L2 ${baby ? 38 : 34} L16 ${baby ? 42 : 38} Z`} fill="#ff922b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="28" cy={baby ? 30 : 26} r="4.5" fill={INK} />
      <circle cx="26.5" cy={baby ? 28.5 : 24.5} r="1.6" fill="#fff" />
      {baby && <path d="M34 15 Q36 4 42 8 M38 15 Q44 6 48 12" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />}
      {!baby && <path d="M40 18 Q46 18 50 22" stroke="#fff" strokeWidth="3" opacity="0.6" fill="none" strokeLinecap="round" />}
    </svg>
  );
});

/** The crescent moon, 100 × 100, its hollow on the left; it sleeps until the child comes near, then opens its eye. */
export const Moon = memo(function Moon({ awake }: { awake: boolean }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <path
        d="M58 4 C84 10 98 32 96 54 C94 80 72 98 46 96 C30 95 18 88 10 78 C40 82 62 62 62 38 C62 24 60 12 58 4 Z"
        fill="#ffe066"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M74 20 C84 30 88 44 86 56" stroke="#fff" strokeWidth="4" opacity="0.5" fill="none" strokeLinecap="round" />
      {awake ? (
        <>
          <circle cx="76" cy="46" r="5" fill={INK} />
          <circle cx="74.5" cy="44.5" r="1.8" fill="#fff" />
        </>
      ) : (
        <path d="M70 46 Q76 51 82 46" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      )}
      <path d="M68 64 Q74 70 82 64" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="84" cy="58" r="4" fill="#ff8787" opacity="0.5" />
    </svg>
  );
});

/** A star near the moon, 40 × 40, that lights up as the tower comes near. */
export const Star = memo(function Star() {
  return (
    <svg viewBox="0 0 40 40" aria-hidden>
      <path
        d="M20 2 L25 15 L38 15 L27.5 23 L31.5 37 L20 28.5 L8.5 37 L12.5 23 L2 15 L15 15 Z"
        fill="#fff3bf"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
});

/** A leaf blown up from the pile, 30 × 20. */
export const Leaf = memo(function Leaf({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 30 20" aria-hidden>
      <path d="M2 10 Q14 -2 28 10 Q14 22 2 10 Z" fill={color} stroke={INK} strokeWidth="2" />
    </svg>
  );
});

/** The sky's colours of each goal: the morning meadow, the day getting on, sunset, dusk and night by the moon. */
const SKY: Record<GoalId, { top: string; low: string; grass: string; grassDark: string }> = {
  balloon: { top: "#a5d8ff", low: "#e7f5ff", grass: "#8ce99a", grassDark: "#51cf66" },
  nest: { top: "#99e9f2", low: "#f3fcf0", grass: "#a9e34b", grassDark: "#74b816" },
  plane: { top: "#74c0fc", low: "#e7f5ff", grass: "#8ce99a", grassDark: "#40c057" },
  cloud: { top: "#4dabf7", low: "#d0ebff", grass: "#69db7c", grassDark: "#37b24d" },
  rainbow: { top: "#9fb7d1", low: "#eef3f8", grass: "#69db7c", grassDark: "#2f9e44" },
  kite: { top: "#91a7ff", low: "#edf2ff", grass: "#94d82d", grassDark: "#66a80f" },
  bird: { top: "#ffd8a8", low: "#fff4e6", grass: "#a9e34b", grassDark: "#74b816" },
  hotair: { top: "#ff8787", low: "#ffd43b", grass: "#82c91e", grassDark: "#5c940d" },
  owl: { top: "#5f3dc4", low: "#e599f7", grass: "#4c8c5b", grassDark: "#2b6b3c" },
  moon: { top: "#1b2a5a", low: "#3b4f8f", grass: "#2f6b45", grassDark: "#1f5133" },
};

/** Where stars shine: from dusk on. */
const STARRY: GoalId[] = ["owl", "moon"];
/** Where the tree stands: its branch holds the nest, later the owl's hollow. */
const TREE: GoalId[] = ["nest", "owl"];

/** The leaf pile's leaves: autumn colours. */
export const LEAF_COLORS = ["#ff922b", "#fa5252", "#fcc419", "#e8590c", "#f08c00"];

/**
 * The still picture behind it all, drawn once per screen size: sky, clouds or stars, the meadow, and for the nest the
 * tree with its branch and the leaf pile at its foot. Nothing in it moves.
 */
export const Backdrop = memo(function Backdrop({ layout: l, goal }: { layout: TowerLayout; goal: GoalId }) {
  const sky = SKY[goal];
  const { w, h, b, ground } = l;
  const id = `tw-sky-${goal}`;
  return (
    <svg className="tw-backdrop" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.low} />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id})`} />
      {STARRY.includes(goal) ? <NightStars l={l} faint={goal !== "moon"} /> : <Clouds l={l} />}
      {TREE.includes(goal) && <Tree l={l} />}
      <path
        d={`M0 ${ground - 0.15 * b} Q${w * 0.3} ${ground - 0.45 * b} ${w * 0.6} ${ground - 0.2 * b} T${w} ${ground - 0.3 * b} V${h} H0 Z`}
        fill={sky.grass}
      />
      <path d={`M0 ${ground + 0.25 * b} Q${w * 0.5} ${ground + 0.05 * b} ${w} ${ground + 0.3 * b} V${h} H0 Z`} fill={sky.grassDark} opacity="0.6" />
      {TREE.includes(goal) && <LeafPile l={l} />}
    </svg>
  );
});

/** A few soft clouds high up, clear of the digit. */
function Clouds({ l }: { l: TowerLayout }) {
  const { w, b } = l;
  const cloud = (cx: number, cy: number, s: number) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`} fill="#fff" opacity="0.9">
      <ellipse cx="0" cy="0" rx="40" ry="18" />
      <ellipse cx="-22" cy="-8" rx="20" ry="16" />
      <ellipse cx="14" cy="-14" rx="24" ry="20" />
    </g>
  );
  return (
    <>
      {cloud(w * 0.14, 2.6 * b, b / 34)}
      {cloud(w * 0.66, 1.6 * b, b / 40)}
      {cloud(w * 0.9, 4.4 * b, b / 30)}
    </>
  );
}

/** Small stars all over the night sky, always the same. */
function NightStars({ l, faint }: { l: TowerLayout; faint: boolean }) {
  const { w, ground } = l;
  const dots = Array.from({ length: 34 }, (_, i) => {
    const x = ((i * 0.618034) % 1) * w;
    const y = ((i * 0.381966 * 1.7) % 1) * ground * 0.85;
    return <circle key={i} cx={x} cy={y} r={i % 5 === 0 ? 2.4 : 1.4} fill="#fff" opacity={(i % 3 === 0 ? 0.9 : 0.55) * (faint ? 0.5 : 1)} />;
  });
  return <>{dots}</>;
}

/** The tree holding the nest: its trunk right of the tower, a branch reaching over to the nest, a round crown. */
function Tree({ l }: { l: TowerLayout }) {
  const { b, ground } = l;
  const { trunk, top } = treeAt(l);
  const nest = goalPlace(l, "nest");
  const branchY = nest.at.y + 0.3 * nest.size * 0.5;
  const tw = 0.7 * b;
  return (
    <g stroke={INK} strokeWidth={Math.max(2, b * 0.09)} strokeLinejoin="round">
      <ellipse cx={trunk + 0.4 * b} cy={top - 0.6 * b} rx={2.6 * b} ry={2.2 * b} fill="#69a83a" />
      <ellipse cx={trunk + 1.6 * b} cy={top + 0.6 * b} rx={1.6 * b} ry={1.4 * b} fill="#82c341" />
      <path
        d={`M${trunk - tw / 2} ${ground} C${trunk - tw / 2} ${ground - 4 * b} ${trunk - tw * 0.4} ${top + 2 * b} ${trunk - tw * 0.35} ${top} L${trunk + tw * 0.35} ${top} C${trunk + tw * 0.4} ${top + 2 * b} ${trunk + tw / 2} ${ground - 4 * b} ${trunk + tw / 2} ${ground} Z`}
        fill="#9c6b3c"
      />
      <path
        d={`M${trunk - tw * 0.3} ${branchY - 1.1 * b} Q${trunk - 1.4 * b} ${branchY - 0.2 * b} ${nest.at.x - 0.2 * b} ${branchY} L${nest.at.x - 0.1 * b} ${branchY + 0.28 * b} Q${trunk - 1.2 * b} ${branchY + 0.25 * b} ${trunk - tw * 0.3} ${branchY - 0.5 * b} Z`}
        fill="#9c6b3c"
      />
      <ellipse cx={trunk - 0.9 * b} cy={top - 1.4 * b} rx={1.8 * b} ry={1.5 * b} fill="#82c341" />
      <path d={`M${trunk} ${ground - 2 * b} q${0.15 * b} ${-0.6 * b} 0 ${-1.2 * b}`} fill="none" opacity="0.35" />
    </g>
  );
}

/** The heap of autumn leaves at the tree's foot, soft to land in. */
function LeafPile({ l }: { l: TowerLayout }) {
  const { b } = l;
  const at = leafPile(l);
  const leaves = Array.from({ length: 14 }, (_, i) => {
    const x = at.x + (((i * 0.618) % 1) - 0.5) * 2.1 * b;
    const y = at.y - 0.15 * b - ((i * 0.37) % 1) * 0.55 * b * (1 - Math.abs(x - at.x) / (1.4 * b));
    return (
      <ellipse key={i} cx={x} cy={y} rx={0.22 * b} ry={0.12 * b} fill={LEAF_COLORS[i % LEAF_COLORS.length]} transform={`rotate(${(i * 47) % 180} ${x} ${y})`} />
    );
  });
  return (
    <g stroke={INK} strokeWidth={Math.max(1.2, b * 0.04)}>
      <path d={`M${at.x - 1.3 * b} ${at.y + 0.1 * b} Q${at.x} ${at.y - 1.3 * b} ${at.x + 1.3 * b} ${at.y + 0.1 * b} Z`} fill="#e8590c" />
      {leaves}
    </g>
  );
}
