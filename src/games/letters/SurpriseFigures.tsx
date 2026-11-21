// What comes out of Frei tippen's present and egg: toys and baby animals drawn by the app itself, never emojis (user
// request, November 2026: the surprises are the app's own effects). Each is a small still svg in a 100 × 100 box with
// the plum-brown line of the app's drawings; the surprise's own layer moves it (`surprises.css`).

import type { ReactNode } from "react";

/** The line round every figure, as on the egg's shell. */
const LINE = "#4a2f24";
const W = 3;

/** The toys a present can hold. */
export const GIFT_TOYS = ["teddy", "ball", "car", "yoyo", "lollipop", "train", "kite", "drum", "rocket", "duck", "strawberry", "blocks"] as const;
export type GiftToy = (typeof GIFT_TOYS)[number];

/** The baby animals that can hatch from an egg. */
export const EGG_BABIES = ["chick", "duckling", "owlet", "dino", "turtle", "crocodile", "penguin", "dragon", "parrot", "snake"] as const;
export type EggBaby = (typeof EGG_BABIES)[number];

/** A child's round eye with two lights. */
function Eye({ x, y, r = 5 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 1.15} fill="#2b1a14" />
      <circle cx={x + r * 0.35} cy={y - r * 0.4} r={r * 0.38} fill="#fff" />
      <circle cx={x - r * 0.35} cy={y + r * 0.45} r={r * 0.17} fill="#fff" />
    </g>
  );
}

/** Soft pink cheeks under two eyes. */
function Cheeks({ y, dx, x = 50 }: { y: number; dx: number; x?: number }) {
  return (
    <g fill="#ff8fa3" opacity="0.55">
      <ellipse cx={x - dx} cy={y} rx="5" ry="3" />
      <ellipse cx={x + dx} cy={y} rx="5" ry="3" />
    </g>
  );
}

/** One toy, `tint` colouring the parts that may come in any colour. */
export function ToyDrawing({ toy, tint }: { toy: GiftToy; tint: string }) {
  return (
    <svg viewBox="0 0 100 100" role="presentation" stroke={LINE} strokeWidth={W} strokeLinejoin="round" strokeLinecap="round">
      {TOYS[toy](tint)}
    </svg>
  );
}

const TOYS: Record<GiftToy, (tint: string) => ReactNode> = {
  teddy: () => (
    <g>
      <circle cx="30" cy="22" r="10" fill="#c68642" />
      <circle cx="70" cy="22" r="10" fill="#c68642" />
      <circle cx="30" cy="22" r="5" fill="#f1c48f" stroke="none" />
      <circle cx="70" cy="22" r="5" fill="#f1c48f" stroke="none" />
      <ellipse cx="50" cy="78" rx="27" ry="20" fill="#c68642" />
      <ellipse cx="50" cy="80" rx="14" ry="12" fill="#f1c48f" stroke="none" />
      <circle cx="50" cy="42" r="25" fill="#c68642" />
      <ellipse cx="50" cy="51" rx="11" ry="8" fill="#f1c48f" />
      <ellipse cx="50" cy="47" rx="4.5" ry="3.2" fill="#2b1a14" stroke="none" />
      <path d="M50 50 V54 M45 55 Q50 59 55 55" fill="none" strokeWidth="2.2" />
      <Eye x={40} y={38} r={3.6} />
      <Eye x={60} y={38} r={3.6} />
      <path d="M38 66 L50 72 L62 66 L58 76 L50 72 L42 76 Z" fill="#ff5d73" strokeWidth="2" />
    </g>
  ),
  ball: (tint) => (
    <g>
      <circle cx="50" cy="52" r="38" fill="#ff5d73" />
      <path d="M50 14 C28 30 28 74 50 90 A38 38 0 0 0 50 14 Z" fill="#fff" stroke="none" />
      <path d="M50 14 C50 30 50 74 50 90 A38 38 0 0 0 50 14 Z" fill="#ffd23f" stroke="none" />
      <path d="M50 14 C72 30 72 74 50 90 A38 38 0 0 0 50 14 Z" fill={tint} stroke="none" />
      <path d="M50 14 C28 30 28 74 50 90 M50 14 V90 M50 14 C72 30 72 74 50 90" fill="none" strokeWidth="2.2" />
      <circle cx="50" cy="52" r="38" fill="none" />
      <circle cx="50" cy="15" r="5" fill="#fff" strokeWidth="2.2" />
      <ellipse cx="32" cy="36" rx="7" ry="4" fill="#fff" stroke="none" opacity="0.7" transform="rotate(-50 32 36)" />
    </g>
  ),
  car: (tint) => (
    <g>
      <path d="M28 50 L36 30 H66 L76 50 Z" fill={tint} />
      <path d="M38 47 L43 35 H50 V47 Z M55 47 V35 H63 L69 47 Z" fill="#cdeeff" strokeWidth="2.4" />
      <rect x="10" y="48" width="80" height="22" rx="10" fill={tint} />
      <circle cx="84" cy="57" r="3.5" fill="#ffe066" strokeWidth="2" />
      <circle cx="30" cy="72" r="11" fill="#3d3d4a" />
      <circle cx="70" cy="72" r="11" fill="#3d3d4a" />
      <circle cx="30" cy="72" r="4" fill="#ddd" strokeWidth="2" />
      <circle cx="70" cy="72" r="4" fill="#ddd" strokeWidth="2" />
    </g>
  ),
  yoyo: (tint) => (
    <g>
      <path d="M50 6 V40" fill="none" strokeWidth="2.4" />
      <circle cx="50" cy="6" r="4" fill="#fff" strokeWidth="2.4" />
      <circle cx="50" cy="62" r="32" fill={tint} />
      <circle cx="50" cy="62" r="22" fill="#fff" opacity="0.4" stroke="none" />
      <circle cx="50" cy="62" r="9" fill="#ffd23f" />
      <ellipse cx="36" cy="46" rx="7" ry="4" fill="#fff" stroke="none" opacity="0.7" transform="rotate(-35 36 46)" />
    </g>
  ),
  lollipop: () => (
    <g>
      <path d="M50 60 V96" stroke="#fff" strokeWidth="7" fill="none" />
      <path d="M50 60 V96" stroke={LINE} strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="50" cy="38" r="32" fill="#ff7bd0" />
      <path
        d="M50 38 C50 32 58 32 58 38 C58 46 44 48 42 38 C40 26 62 24 64 38 C66 54 36 56 35 38 C34 20 68 16 71 38"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
      />
      <circle cx="50" cy="38" r="32" fill="none" />
    </g>
  ),
  train: (tint) => (
    <g>
      <rect x="22" y="16" width="12" height="18" rx="2" fill="#3d3d4a" />
      <path d="M17 14 H39 L36 20 H20 Z" fill="#3d3d4a" />
      <rect x="12" y="34" width="46" height="34" rx="6" fill={tint} />
      <rect x="54" y="22" width="34" height="46" rx="5" fill="#ff5d73" />
      <rect x="61" y="29" width="20" height="15" rx="3" fill="#cdeeff" strokeWidth="2.4" />
      <path d="M50 22 H92" fill="none" strokeWidth="5" />
      <circle cx="26" cy="74" r="10" fill="#3d3d4a" />
      <circle cx="48" cy="74" r="10" fill="#3d3d4a" />
      <circle cx="74" cy="74" r="10" fill="#3d3d4a" />
      <path d="M26 74 H74" fill="none" stroke="#ddd" strokeWidth="3" />
    </g>
  ),
  kite: (tint) => (
    <g>
      <path d="M48 6 L76 34 L48 70 L20 34 Z" fill={tint} />
      <path d="M48 6 L48 70 L20 34 Z" fill="#fff" opacity="0.35" stroke="none" />
      <path d="M48 6 L48 70 M20 34 H76" fill="none" strokeWidth="2.2" />
      <path d="M48 70 C40 78 58 82 50 90 C44 96 56 98 60 96" fill="none" strokeWidth="2.2" />
      <path d="M41 77 L49 81 L41 85 Z M54 86 L62 90 L54 94 Z" fill="#ffd23f" strokeWidth="2" />
    </g>
  ),
  drum: (tint) => (
    <g>
      <path d="M16 38 V72 C16 84 84 84 84 72 V38" fill={tint} />
      <path d="M16 44 L33 76 L50 44 L67 76 L84 44" fill="none" stroke="#fff" strokeWidth="3.5" />
      <path d="M16 72 C16 84 84 84 84 72" fill="none" />
      <path d="M16 38 V72 M84 38 V72" fill="none" />
      <ellipse cx="50" cy="38" rx="34" ry="11" fill="#fff4dc" />
      <path d="M30 6 L44 32 M72 8 L58 32" fill="none" stroke="#c68642" strokeWidth="5" />
      <circle cx="30" cy="6" r="5" fill="#ff5d73" strokeWidth="2.4" />
      <circle cx="72" cy="8" r="5" fill="#ff5d73" strokeWidth="2.4" />
    </g>
  ),
  rocket: (tint) => (
    <g>
      <path d="M40 76 Q50 98 60 76 Z" fill="#ffb703" />
      <path d="M45 76 Q50 88 55 76 Z" fill="#fff1b8" stroke="none" />
      <path d="M36 54 L22 76 L38 72 Z M64 54 L78 76 L62 72 Z" fill={tint} />
      <path d="M50 6 C68 20 68 56 62 76 H38 C32 56 32 20 50 6 Z" fill="#f4f4f8" />
      <path d="M50 6 C58 12 62 20 64 26 H36 C38 20 42 12 50 6 Z" fill={tint} />
      <circle cx="50" cy="44" r="9" fill="#cdeeff" />
      <circle cx="47" cy="41" r="3" fill="#fff" stroke="none" />
    </g>
  ),
  duck: () => (
    <g>
      <path d="M14 58 C14 46 30 44 40 52 C46 40 86 40 86 64 C86 84 60 90 44 88 C24 86 14 74 14 58 Z" fill="#ffd23f" />
      <path d="M50 66 C58 76 72 74 76 64" fill="none" strokeWidth="2.4" />
      <circle cx="36" cy="34" r="20" fill="#ffd23f" />
      <path d="M20 30 C10 28 3 34 6 40 C9 45 18 44 22 40 Z" fill="#ff8c42" />
      <Eye x={32} y={30} r={3.6} />
      <ellipse cx="44" cy="40" rx="4" ry="2.5" fill="#ff8fa3" stroke="none" opacity="0.6" />
    </g>
  ),
  strawberry: () => (
    <g>
      <path d="M50 26 C78 22 90 40 84 56 C78 74 60 92 50 94 C40 92 22 74 16 56 C10 40 22 22 50 26 Z" fill="#ff3d5a" />
      <path d="M50 28 L36 14 L46 22 L50 8 L54 22 L64 14 Z" fill="#3ec300" />
      <path d="M50 28 L34 30 L42 22 M50 28 L66 30 L58 22" fill="#3ec300" />
      <g fill="#fff1b8" stroke="none">
        {[
          [34, 44],
          [50, 42],
          [66, 44],
          [28, 58],
          [42, 56],
          [58, 56],
          [72, 58],
          [38, 70],
          [52, 70],
          [64, 70],
          [46, 82],
          [56, 82],
        ].map(([x, y]) => (
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.8" ry="2.6" />
        ))}
      </g>
    </g>
  ),
  blocks: (tint) => (
    <g>
      <rect x="10" y="58" width="36" height="34" rx="4" fill={tint} />
      <rect x="54" y="58" width="36" height="34" rx="4" fill="#ffd23f" />
      <rect x="31" y="20" width="38" height="38" rx="4" fill="#3ec1ff" transform="rotate(6 50 39)" />
      <circle cx="28" cy="75" r="8" fill="#fff" strokeWidth="2.4" />
      <path d="M72 66 L79 81 H65 Z" fill="#fff" strokeWidth="2.4" />
      <path d="M50 28 L53 36 L61 36 L55 41 L57 49 L50 44 L43 49 L45 41 L39 36 L47 36 Z" fill="#fff" strokeWidth="2.2" transform="rotate(6 50 39)" />
    </g>
  ),
};

/** One baby animal looking out of its egg: the lower part of the box lies behind the egg's bottom half. */
export function BabyDrawing({ baby }: { baby: EggBaby }) {
  return (
    <svg viewBox="0 0 100 100" role="presentation" stroke={LINE} strokeWidth={W} strokeLinejoin="round" strokeLinecap="round">
      {BABIES[baby]}
    </svg>
  );
}

const BABIES: Record<EggBaby, ReactNode> = {
  chick: (
    <g>
      <path d="M44 18 C40 8 50 6 50 16 C52 6 62 10 56 18" fill="#ffd23f" strokeWidth="2.4" />
      <path d="M12 66 C8 54 18 50 26 58 M88 66 C92 54 82 50 74 58" fill="#ffd23f" />
      <circle cx="50" cy="56" r="36" fill="#ffd23f" />
      <path d="M43 60 L50 54 L57 60 L50 68 Z" fill="#ff8c42" strokeWidth="2.4" />
      <path d="M43 60 H57" fill="none" strokeWidth="2" />
      <Eye x={37} y={47} />
      <Eye x={63} y={47} />
      <Cheeks y={63} dx={21} />
    </g>
  ),
  duckling: (
    <g>
      <path d="M46 20 C44 12 52 10 52 18" fill="#ffe680" strokeWidth="2.4" />
      <circle cx="50" cy="56" r="36" fill="#ffe680" />
      <path d="M34 62 C34 56 66 56 66 62 C66 70 34 70 34 62 Z" fill="#ff9f43" />
      <path d="M36 63 C44 66 56 66 64 63" fill="none" strokeWidth="2" />
      <circle cx="45" cy="60" r="1.2" fill={LINE} stroke="none" />
      <circle cx="55" cy="60" r="1.2" fill={LINE} stroke="none" />
      <Eye x={37} y={45} />
      <Eye x={63} y={45} />
      <Cheeks y={56} dx={25} />
    </g>
  ),
  owlet: (
    <g>
      <path d="M18 34 L24 10 L38 26 M82 34 L76 10 L62 26" fill="#a98467" />
      <ellipse cx="50" cy="58" rx="38" ry="36" fill="#a98467" />
      <ellipse cx="50" cy="72" rx="20" ry="18" fill="#e9d8c4" stroke="none" />
      <path d="M40 66 Q44 70 48 66 M52 72 Q56 76 60 72 M42 78 Q46 82 50 78" fill="none" stroke="#a98467" strokeWidth="2" />
      <circle cx="35" cy="44" r="14" fill="#f6ead8" />
      <circle cx="65" cy="44" r="14" fill="#f6ead8" />
      <Eye x={35} y={45} r={7} />
      <Eye x={65} y={45} r={7} />
      <path d="M45 56 L50 66 L55 56 Z" fill="#ffb703" strokeWidth="2.4" />
    </g>
  ),
  dino: (
    <g>
      <path d="M28 80 L14 74 L28 66 Z M28 62 L13 56 L29 49 Z M32 44 L22 30 L40 34 Z M46 28 L44 12 L58 24 Z" fill="#ffb703" />
      <path d="M24 94 L26 56 C26 32 44 22 62 24 C80 26 94 36 94 50 C94 62 84 68 72 68 H58 V94 Z" fill="#8bd450" />
      <path d="M66 58 C74 63 84 61 90 56" fill="none" strokeWidth="2.4" />
      <circle cx="86" cy="42" r="1.8" fill={LINE} stroke="none" />
      <circle cx="38" cy="80" r="4" fill="#c4ed8f" stroke="none" />
      <circle cx="44" cy="66" r="3" fill="#c4ed8f" stroke="none" />
      <Eye x={58} y={42} r={6} />
      <ellipse cx="68" cy="52" rx="5" ry="3" fill="#ff8fa3" opacity="0.55" stroke="none" />
    </g>
  ),
  turtle: (
    <g>
      <path d="M8 80 C8 50 30 34 54 34 C78 34 94 52 94 80 Z" fill="#6fbf73" />
      <path d="M38 40 L46 56 L62 56 L70 40 M46 56 L40 80 M62 56 L70 80 M20 66 L40 66 M70 66 L88 66" fill="none" stroke="#3f7f45" strokeWidth="2.4" />
      <path d="M8 80 C8 50 30 34 54 34 C78 34 94 52 94 80" fill="none" />
      <path d="M22 50 C10 44 4 30 16 22 C28 14 40 26 34 40" fill="#a8dc8c" />
      <Eye x={14} y={30} r={3.8} />
      <Eye x={27} y={28} r={3.8} />
      <path d="M14 40 Q20 44 26 40" fill="none" strokeWidth="2" />
    </g>
  ),
  crocodile: (
    <g>
      <path d="M10 70 C10 50 30 44 50 46 H86 C94 46 96 64 88 68 H50 L50 94 H14 C10 88 10 80 10 70 Z" fill="#5aa65e" />
      <path d="M50 60 H90" fill="none" strokeWidth="2.4" />
      <path d="M54 60 L58 66 L62 60 L66 66 L70 60 L74 66 L78 60 L82 66 L86 60" fill="#fff" strokeWidth="1.8" />
      <circle cx="86" cy="51" r="1.8" fill={LINE} stroke="none" />
      <circle cx="26" cy="38" r="11" fill="#5aa65e" />
      <circle cx="46" cy="38" r="11" fill="#5aa65e" />
      <Eye x={26} y={38} r={4.6} />
      <Eye x={46} y={38} r={4.6} />
      <circle cx="30" cy="80" r="4" fill="#8fd18f" stroke="none" />
    </g>
  ),
  penguin: (
    <g>
      <ellipse cx="50" cy="58" rx="36" ry="38" fill="#2f3542" />
      <path d="M50 30 C70 30 78 48 76 62 C74 80 62 92 50 92 C38 92 26 80 24 62 C22 48 30 30 50 30 Z" fill="#fff" stroke="none" />
      <path d="M50 32 C42 32 40 38 50 42 C60 38 58 32 50 32 Z" fill="#2f3542" stroke="none" />
      <path d="M43 58 C43 52 57 52 57 58 L50 66 Z" fill="#ff9f43" strokeWidth="2.4" />
      <Eye x={39} y={49} />
      <Eye x={61} y={49} />
      <Cheeks y={62} dx={19} />
    </g>
  ),
  dragon: (
    <g>
      <path d="M14 60 L2 34 L22 44 L16 22 L32 40 Z M86 60 L98 34 L78 44 L84 22 L68 40 Z" fill="#c38df5" />
      <path d="M34 26 L30 6 L44 22 M66 26 L70 6 L56 22" fill="#ffd23f" />
      <circle cx="50" cy="56" r="34" fill="#a66cf0" />
      <ellipse cx="50" cy="66" rx="17" ry="12" fill="#d7b8fb" />
      <circle cx="44" cy="63" r="1.8" fill={LINE} stroke="none" />
      <circle cx="56" cy="63" r="1.8" fill={LINE} stroke="none" />
      <path d="M43 71 Q50 75 57 71" fill="none" strokeWidth="2" />
      <Eye x={36} y={46} />
      <Eye x={64} y={46} />
      <path d="M44 22 L50 30 L56 22" fill="#ff7bd0" strokeWidth="2" />
    </g>
  ),
  parrot: (
    <g>
      <path d="M40 22 C30 6 46 2 48 18 C50 4 64 6 56 22" fill="#ffb703" strokeWidth="2.4" />
      <circle cx="50" cy="56" r="35" fill="#ff4d4d" />
      <path d="M16 66 C22 92 78 92 84 66 C70 78 30 78 16 66 Z" fill="#3ec300" />
      <ellipse cx="34" cy="48" rx="11" ry="10" fill="#fff" stroke="none" />
      <ellipse cx="66" cy="48" rx="11" ry="10" fill="#fff" stroke="none" />
      <Eye x={34} y={48} r={4.4} />
      <Eye x={66} y={48} r={4.4} />
      <path d="M42 56 C42 50 58 50 58 56 C58 68 52 74 48 72 C52 66 46 62 42 56 Z" fill="#3d3d4a" />
    </g>
  ),
  snake: (
    <g>
      <path d="M14 90 C14 70 86 70 86 90 Z" fill="#4cc9a0" />
      <path d="M28 78 C30 74 70 74 72 78" fill="none" stroke="#ffd23f" strokeWidth="4" />
      <path d="M38 76 C34 56 34 40 46 30" fill="none" stroke={LINE} strokeWidth="21" />
      <path d="M38 76 C34 56 34 40 46 30" fill="none" stroke="#4cc9a0" strokeWidth="15" />
      <path d="M36 62 L42 60 M35 50 L41 50" fill="none" stroke="#ffd23f" strokeWidth="3" />
      <ellipse cx="54" cy="28" rx="22" ry="17" fill="#4cc9a0" />
      <path d="M74 30 L84 30 L88 26 M84 30 L88 34" fill="none" stroke="#ff3d5a" strokeWidth="2.4" />
      <Eye x={48} y={22} r={4} />
      <Eye x={62} y={22} r={4} />
      <Cheeks y={32} dx={9} x={55} />
    </g>
  ),
};
