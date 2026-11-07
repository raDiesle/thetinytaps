import type { ReactNode } from "react";
import type { BackdropId } from "./index";

// The backdrops at places of work and play (see index.ts for what each shows and how they are drawn). Each keeps the
// helper's place at the left (x 4–116) and what it works on at the right (x 180–264, y 90–174) calm, and tells the
// place along the top, between them and at the far right edge.

const OUT = "#5a4636";
/** A soft line inside a shape (tile joints, planks), lighter than the outline. */
const SOFT = "rgba(90, 70, 54, 0.28)";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** A soft cloud round its middle. */
const cloud = (x: number, y: number, s = 1, fill = "#ffffff") => (
  <path
    d={`M${x - 22 * s} ${y + 6 * s} Q${x - 26 * s} ${y - 6 * s} ${x - 12 * s} ${y - 6 * s} Q${x - 8 * s} ${y - 18 * s} ${x + 6 * s} ${y - 12 * s} Q${x + 20 * s} ${y - 16 * s} ${x + 22 * s} ${y - 2 * s} Q${x + 30 * s} ${y + 4 * s} ${x + 22 * s} ${y + 8 * s} Z`}
    fill={fill}
    stroke={OUT}
    strokeWidth="2.5"
    strokeLinejoin="round"
  />
);

/** A window with sky, a cloud and a cross of bars. */
const windowAt = (x: number, y: number, w: number, h: number, sky = "#cfe8f6") => (
  <g>
    <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx="5" fill="#fbf7ee" stroke={OUT} strokeWidth="3" />
    <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="2" fill={sky} />
    {cloud(x + w * 0.62, y + h * 0.38, w / 90)}
    <path d={`M${x + w / 2} ${y + 3} V${y + h - 3} M${x + 3} ${y + h / 2} H${x + w - 3}`} stroke="#fbf7ee" strokeWidth="4" />
    <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} rx="2" fill="none" stroke={OUT} strokeWidth="2" />
    <rect x={x - 6} y={y + h + 2} width={w + 12} height="6" rx="2" fill="#efe6d4" stroke={OUT} strokeWidth="2.5" />
  </g>
);

/** Square tiles over a box, as soft joints. */
const tileLines = (x: number, y: number, w: number, h: number, size: number) => (
  <path
    d={[
      ...range(Math.floor(w / size)).map((i) => `M${x + (i + 1) * size} ${y} V${y + h}`),
      ...range(Math.floor(h / size)).map((i) => `M${x} ${y + (i + 1) * size} H${x + w}`),
    ].join(" ")}
    stroke={SOFT}
    strokeWidth="1.2"
  />
);

/** A bottle on a shelf, standing on `y`. */
const bottle = (x: number, y: number, h: number, fill: string) => (
  <g>
    <rect x={x - 5} y={y - h} width="10" height={h} rx="3" fill={fill} stroke={OUT} strokeWidth="2.2" />
    <rect x={x - 2.5} y={y - h - 5} width="5" height="6" rx="1" fill="#f1f3f5" stroke={OUT} strokeWidth="2" />
  </g>
);

/** A little round potted plant standing on `y`. */
const plant = (x: number, y: number, s = 1) => (
  <g>
    <path
      d={`M${x} ${y - 14 * s} Q${x - 18 * s} ${y - 22 * s} ${x - 14 * s} ${y - 38 * s} Q${x - 2 * s} ${y - 30 * s} ${x} ${y - 14 * s} Z`}
      fill="#8cc58a"
      stroke={OUT}
      strokeWidth="2.2"
    />
    <path
      d={`M${x} ${y - 14 * s} Q${x + 18 * s} ${y - 24 * s} ${x + 12 * s} ${y - 40 * s} Q${x + 2 * s} ${y - 30 * s} ${x} ${y - 14 * s} Z`}
      fill="#a3d39c"
      stroke={OUT}
      strokeWidth="2.2"
    />
    <path
      d={`M${x} ${y - 12 * s} Q${x - 3 * s} ${y - 32 * s} ${x + 2 * s} ${y - 44 * s} Q${x + 8 * s} ${y - 30 * s} ${x} ${y - 12 * s} Z`}
      fill="#7fb97d"
      stroke={OUT}
      strokeWidth="2.2"
    />
    <path
      d={`M${x - 10 * s} ${y - 14 * s} H${x + 10 * s} L${x + 7 * s} ${y} H${x - 7 * s} Z`}
      fill="#e5996b"
      stroke={OUT}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </g>
);

/** A garland of little flags hanging in a swag from `x1` to `x2`. */
const garland = (x1: number, x2: number, y: number, sag: number, colors: string[]) => {
  const n = Math.round((x2 - x1) / 18);
  const at = (t: number) => [x1 + (x2 - x1) * t, y + sag * 4 * t * (1 - t)] as const;
  return (
    <g>
      <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} stroke={OUT} strokeWidth="2" fill="none" />
      {range(n).map((i) => {
        const [ax, ay] = at((i + 0.15) / n);
        const [bx, by] = at((i + 0.85) / n);
        return (
          <path
            key={i}
            d={`M${ax} ${ay} L${bx} ${by} L${(ax + bx) / 2} ${(ay + by) / 2 + 13} Z`}
            fill={colors[i % colors.length]}
            stroke={OUT}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
};

/** A gull far off: two little arcs. */
const gull = (x: number, y: number) => (
  <path d={`M${x - 6} ${y} Q${x - 3} ${y - 4} ${x} ${y} Q${x + 3} ${y - 4} ${x + 6} ${y}`} stroke={OUT} strokeWidth="1.8" fill="none" />
);

/** A round snowy fir tree standing on `y`. */
const fir = (x: number, y: number, s: number, fill = "#7fae8f") => (
  <g>
    <rect x={x - 3 * s} y={y - 8 * s} width={6 * s} height={8 * s} fill="#9c7653" stroke={OUT} strokeWidth="2" />
    <path
      d={`M${x} ${y - 52 * s} L${x + 14 * s} ${y - 30 * s} H${x + 8 * s} L${x + 20 * s} ${y - 8 * s} H${x - 20 * s} L${x - 8 * s} ${y - 30 * s} H${x - 14 * s} Z`}
      fill={fill}
      stroke={OUT}
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path d={`M${x - 6 * s} ${y - 40 * s} Q${x} ${y - 44 * s} ${x + 6 * s} ${y - 40 * s} L${x} ${y - 52 * s} Z`} fill="#fff" />
    <path
      d={`M${x - 16 * s} ${y - 12 * s} Q${x} ${y - 18 * s} ${x + 16 * s} ${y - 12 * s}`}
      stroke="#fff"
      strokeWidth={3 * s}
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

/** Doctor's room: a window, a chart of shapes, a wall cabinet with a red cross, the examination couch at the right. */
const praxis = () => (
  <>
    <rect width="300" height="200" fill="#e8f3ee" />
    <rect y="118" width="300" height="44" fill="#d7ebe2" />
    <path d="M0 118 H300" stroke={OUT} strokeWidth="2.5" />
    {/* the wall cabinet with its red cross */}
    <rect x="10" y="12" width="46" height="40" rx="4" fill="#fbfbf8" stroke={OUT} strokeWidth="3" />
    <path d="M33 14 V50" stroke={SOFT} strokeWidth="1.5" />
    <path
      d="M28 22 h10 v8 h8 v10 h-8 v8 h-10 v-8 h-8 v-10 h8 Z"
      fill="#ef6f6c"
      stroke={OUT}
      strokeWidth="2"
      strokeLinejoin="round"
      transform="translate(0 -3)"
    />
    {windowAt(104, 14, 56, 50)}
    {/* a chart of shapes, big to small */}
    <rect x="176" y="10" width="40" height="56" rx="3" fill="#fffdf7" stroke={OUT} strokeWidth="2.5" />
    <circle cx="196" cy="22" r="7" fill="#ff8f8f" stroke={OUT} strokeWidth="1.8" />
    <path d="M186 40 l4 -8 l4 8 Z M199 40 h7 v-7 h-7 Z" fill="#74b9e8" stroke={OUT} strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="186" cy="52" r="2.6" fill="#8cc58a" stroke={OUT} strokeWidth="1.2" />
    <path
      d="M196 49 l1.4 2.8 l3 .4 l-2.2 2 l.6 3 l-2.8 -1.5 l-2.8 1.5 l.6 -3 l-2.2 -2 l3 -.4 Z"
      fill="#ffd43b"
      stroke={OUT}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <circle cx="206" cy="52" r="2.6" fill="#b197fc" stroke={OUT} strokeWidth="1.2" />
    <path d="M186 60 H206" stroke={SOFT} strokeWidth="1.5" />
    {/* floor */}
    <rect y="160" width="300" height="40" fill="#cfdee4" />
    <path d="M0 176 H300 M0 190 H300" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
    <path d="M0 160 H300" stroke={OUT} strokeWidth="3" />
    {/* the examination couch at the right, its head end raised */}
    <path d="M252 140 V182 M292 140 V182" stroke={OUT} strokeWidth="3" />
    <path d="M252 140 V182 M292 140 V182" stroke="#adb5bd" strokeWidth="1.5" />
    <rect x="244" y="126" width="62" height="16" rx="6" fill="#8fc7b8" stroke={OUT} strokeWidth="3" />
    <path d="M276 128 L292 98 Q296 94 300 96 V128 Z" fill="#8fc7b8" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <rect x="252" y="122" width="36" height="7" rx="2" fill="#fbfbf8" stroke={OUT} strokeWidth="2" />
    <ellipse cx="272" cy="184" rx="30" ry="3" fill="rgba(90,70,54,0.15)" />
  </>
);

/** Hairdresser's: a big mirror at the right, a shelf of bottles and a plant at the top left, a hood dryer at the far left, a checked floor. */
const salon = () => (
  <>
    <rect width="300" height="200" fill="#fbe8e3" />
    <path
      d={range(15)
        .map((i) => `M${10 + i * 20} 0 V160`)
        .join(" ")}
      stroke="#f6d8d0"
      strokeWidth="8"
    />
    {/* the shelf with bottles and a plant */}
    <rect x="12" y="44" width="92" height="7" rx="2" fill="#d8a878" stroke={OUT} strokeWidth="2.5" />
    {bottle(26, 44, 18, "#f7a1c4")}
    {bottle(40, 44, 24, "#9ad0ec")}
    {bottle(54, 44, 14, "#ffd8a8")}
    {bottle(66, 44, 20, "#b2f2bb")}
    {plant(88, 44, 0.75)}
    {/* checked floor */}
    <rect y="160" width="300" height="40" fill="#f6efe6" />
    {range(15).map((col) =>
      range(3).map((row) => ((col + row) % 2 ? null : <rect key={`${col}-${row}`} x={col * 20} y={160 + row * 14} width="20" height="14" fill="#cfc4d8" />)),
    )}
    <path d="M0 160 H300" stroke={OUT} strokeWidth="3" />
    {/* the hood dryer at the far left */}
    <path d="M22 120 V170 M10 172 H34" stroke={OUT} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M22 120 V170" stroke="#ced4da" strokeWidth="1.5" />
    <path d="M2 84 Q4 62 26 62 Q46 62 46 86 Q46 96 40 100 L8 100 Q2 96 2 84 Z" fill="#cdb4db" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M10 98 Q24 106 38 98" stroke={OUT} strokeWidth="2" fill="#b79ccb" />
    <path d="M22 100 V120" stroke={OUT} strokeWidth="3" />
    {/* the big mirror at the right */}
    <rect x="198" y="16" width="98" height="116" rx="44" fill="#e9c58f" stroke={OUT} strokeWidth="3" />
    <rect x="206" y="24" width="82" height="100" rx="37" fill="#e1f1f6" stroke={OUT} strokeWidth="2.5" />
    <path d="M222 64 L250 36 M226 80 L264 42" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
    <path d="M268 110 L282 96" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <rect x="200" y="134" width="94" height="8" rx="3" fill="#f3e3cf" stroke={OUT} strokeWidth="2.5" />
    {bottle(282, 134, 14, "#f7a1c4")}
  </>
);

/** Bakery: tiles, shelves high up with flour sacks and baskets, a counter at the left back, a warm window, a terracotta floor. */
const baeckerei = () => {
  const sack = (x: number, y: number) => (
    <g>
      <path
        d={`M${x - 12} ${y} Q${x - 14} ${y - 18} ${x - 7} ${y - 24} L${x + 7} ${y - 24} Q${x + 14} ${y - 18} ${x + 12} ${y} Z`}
        fill="#fbf6ea"
        stroke={OUT}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d={`M${x - 7} ${y - 24} L${x - 4} ${y - 30} M${x + 7} ${y - 24} L${x + 4} ${y - 30} M${x - 8} ${y - 21} H${x + 8}`} stroke={OUT} strokeWidth="2" />
      <path d={`M${x - 6} ${y - 9} Q${x} ${y - 14} ${x + 6} ${y - 9}`} stroke="#e0c9a6" strokeWidth="2" fill="none" />
    </g>
  );
  const basket = (x: number, y: number) => (
    <g>
      <path d={`M${x - 14} ${y - 14} H${x + 14} L${x + 11} ${y} H${x - 11} Z`} fill="#d9a066" stroke={OUT} strokeWidth="2.2" strokeLinejoin="round" />
      <path d={`M${x - 12} ${y - 7} H${x + 12} M${x - 5} ${y - 14} V${y} M${x + 4} ${y - 14} V${y}`} stroke="#b07a45" strokeWidth="1.4" />
      <path
        d={`M${x - 14} ${y - 14} Q${x - 6} ${y - 19} ${x} ${y - 14} Q${x + 7} ${y - 19} ${x + 14} ${y - 14}`}
        fill="#f4c7c3"
        stroke={OUT}
        strokeWidth="1.8"
      />
    </g>
  );
  return (
    <>
      <rect width="300" height="200" fill="#fbecd3" />
      <rect y="92" width="300" height="70" fill="#fff7ea" />
      {tileLines(0, 92, 300, 70, 14)}
      <path d="M0 92 H300" stroke={OUT} strokeWidth="2.5" />
      {/* shelves high up */}
      {[38, 76].map((y) => (
        <rect key={y} x="6" y={y} width="142" height="6" rx="2" fill="#c99566" stroke={OUT} strokeWidth="2.5" />
      ))}
      {sack(24, 38)}
      {sack(52, 38)}
      {basket(86, 38)}
      {basket(122, 38)}
      {basket(30, 76)}
      {sack(66, 76)}
      {basket(102, 76)}
      {sack(132, 76)}
      {/* a warm window at the top right */}
      {windowAt(256, 16, 36, 50, "#ffe3a8")}
      {/* the counter at the left back */}
      <rect x="0" y="122" width="132" height="40" fill="#d9a878" stroke={OUT} strokeWidth="3" />
      <path d="M44 126 V160 M88 126 V160" stroke={SOFT} strokeWidth="2" />
      <rect x="-4" y="114" width="140" height="9" rx="3" fill="#b9825a" stroke={OUT} strokeWidth="3" />
      {/* warm terracotta floor */}
      <rect y="162" width="300" height="38" fill="#e3a982" />
      <path
        d={`M0 180 H300 ${range(10)
          .map((i) => `M${i * 32 + (i % 2) * 8} 162 V200`)
          .join(" ")}`}
        stroke="rgba(90,70,54,0.22)"
        strokeWidth="1.5"
      />
      <path d="M0 162 H300" stroke={OUT} strokeWidth="3" />
    </>
  );
};

/** A fire call: a pale smoky sky, a garden shed at the right where the fire burns, a red fire engine at the far left. */
const feuer = () => (
  <>
    <rect width="300" height="200" fill="#e4e6ea" />
    <rect y="96" width="300" height="70" fill="#eceae4" />
    {cloud(70, 34, 1.2, "#d3d6dc")}
    {cloud(170, 22, 0.9, "#dcdfe4")}
    {cloud(268, 26, 1.1, "#cfd2d8")}
    {/* houses far back */}
    <path d="M70 150 V112 L92 94 L114 112 V150 Z" fill="#e8d9c8" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    <rect x="86" y="120" width="12" height="12" fill="#f6efd6" stroke={OUT} strokeWidth="2" />
    <path d="M118 150 V118 H160 V150 Z" fill="#dfe4d4" stroke={OUT} strokeWidth="2.5" />
    <path d="M114 120 L139 102 L164 120 Z" fill="#c9a8a0" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    {/* the garden shed */}
    <path d="M188 162 V84 H300 V162 Z" fill="#d7b38c" stroke={OUT} strokeWidth="3" />
    <path
      d={range(7)
        .map((i) => `M${202 + i * 15} 86 V160`)
        .join(" ")}
      stroke={SOFT}
      strokeWidth="1.5"
    />
    <path d="M176 88 L238 50 L310 88 Z" fill="#a9726a" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M200 80 L238 57 L290 80" stroke="rgba(90,70,54,0.25)" strokeWidth="2" fill="none" />
    <rect x="258" y="98" width="24" height="22" rx="2" fill="#f2ead8" stroke={OUT} strokeWidth="2.5" />
    <path d="M270 98 V120 M258 109 H282" stroke={OUT} strokeWidth="2" />
    {/* ground */}
    <rect y="160" width="300" height="40" fill="#bcd3a2" />
    <path d="M0 160 H300" stroke={OUT} strokeWidth="3" />
    <path d="M20 176 l3 -6 l3 6 M140 186 l3 -6 l3 6 M268 182 l3 -6 l3 6" stroke="#8fb27a" strokeWidth="2" fill="none" />
    {/* the red fire engine at the far left */}
    <path d="M-6 112 H44 Q54 112 56 124 L60 150 Q60 164 52 164 H-6 Z" fill="#e85d5a" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M30 120 H46 Q50 120 51 126 L53 138 H30 Z" fill="#cfe8f6" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M-6 104 H40 M-6 98 H40 M4 98 V104 M16 98 V104 M28 98 V104" stroke={OUT} strokeWidth="2.5" />
    <path d="M40 98 V112" stroke={OUT} strokeWidth="2.5" />
    <rect x="34" y="104" width="10" height="8" rx="3" fill="#74b9e8" stroke={OUT} strokeWidth="2" />
    <path d="M-6 146 H58" stroke="#f1f3f5" strokeWidth="4" />
    <circle cx="36" cy="164" r="11" fill="#495057" stroke={OUT} strokeWidth="3" />
    <circle cx="36" cy="164" r="4" fill="#ced4da" />
    <circle cx="2" cy="164" r="11" fill="#495057" stroke={OUT} strokeWidth="3" />
  </>
);

/** Post: a street with houses far back, a yellow letter box on its post at the right, a yellow bicycle with a bag at the far left. */
const post = () => (
  <>
    <rect width="300" height="200" fill="#d7ecf7" />
    {cloud(150, 26, 1)}
    {cloud(258, 18, 0.7)}
    {/* houses far back */}
    {[
      [20, 70, "#f3d9c4", "#c98e7a"],
      [76, 84, "#e3ead2", "#a5b585"],
      [128, 62, "#f6e6b8", "#c98e7a"],
      [186, 78, "#e7d9ee", "#9f8ab8"],
      [246, 66, "#f3d9c4", "#a5b585"],
    ].map(([x, top, wall, roof], i) => {
      const x0 = x as number;
      const y0 = top as number;
      return (
        <g key={i}>
          <rect x={x0} y={y0} width="50" height={150 - y0} fill={wall as string} stroke={OUT} strokeWidth="2.5" />
          <path
            d={`M${x0 - 4} ${y0 + 2} L${x0 + 25} ${y0 - 18} L${x0 + 54} ${y0 + 2} Z`}
            fill={roof as string}
            stroke={OUT}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <rect x={x0 + 9} y={y0 + 12} width="12" height="12" rx="1" fill="#fbf4dc" stroke={OUT} strokeWidth="1.8" />
          <rect x={x0 + 29} y={y0 + 12} width="12" height="12" rx="1" fill="#fbf4dc" stroke={OUT} strokeWidth="1.8" />
        </g>
      );
    })}
    {/* the pavement */}
    <rect y="150" width="300" height="50" fill="#d3d0cb" />
    <path
      d={`M0 172 H300 ${range(10)
        .map((i) => `M${i * 34 + 14} 150 V172 M${i * 34 + 30} 172 V200`)
        .join(" ")}`}
      stroke="rgba(90,70,54,0.2)"
      strokeWidth="1.5"
    />
    <path d="M0 150 H300" stroke={OUT} strokeWidth="3" />
    {/* the yellow bicycle with a bag, leaning on its stand at the far left */}
    <g transform="rotate(-4 36 186)">
      <circle cx="12" cy="170" r="15" fill="none" stroke={OUT} strokeWidth="3.5" />
      <circle cx="62" cy="170" r="15" fill="none" stroke={OUT} strokeWidth="3.5" />
      <circle cx="12" cy="170" r="15" fill="none" stroke="#868e96" strokeWidth="1.2" />
      <circle cx="62" cy="170" r="15" fill="none" stroke="#868e96" strokeWidth="1.2" />
      <path
        d="M12 170 L30 170 L50 144 L24 144 Z M24 144 L20 136 M50 144 L62 170 M50 144 L48 132"
        stroke={OUT}
        strokeWidth="6"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M12 170 L30 170 L50 144 L24 144 Z M24 144 L20 136 M50 144 L62 170 M50 144 L48 132"
        stroke="#ffd43b"
        strokeWidth="3"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M14 134 H26" stroke={OUT} strokeWidth="4" strokeLinecap="round" />
      <path d="M42 132 H54" stroke={OUT} strokeWidth="3.5" strokeLinecap="round" />
      <rect x="-6" y="138" width="26" height="22" rx="4" fill="#3d6fb0" stroke={OUT} strokeWidth="3" />
      <path d="M-6 146 H20" stroke={OUT} strokeWidth="2" />
      <circle cx="30" cy="170" r="3" fill={OUT} />
    </g>
    {/* the yellow letter box on its grey post */}
    <rect x="225" y="150" width="10" height="36" fill="#adb5bd" stroke={OUT} strokeWidth="3" />
    <ellipse cx="230" cy="187" rx="16" ry="3" fill="rgba(90,70,54,0.18)" />
    <path d="M205 158 V108 Q205 94 230 94 Q255 94 255 108 V158 Z" fill="#ffd43b" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M209 108 Q210 98 230 98" stroke="#fff3bf" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M249 112 V154" stroke="#f0b92a" strokeWidth="5" />
    <rect x="218" y="115" width="24" height="6" rx="2.5" fill="#343a40" stroke={OUT} strokeWidth="2" />
    <path d="M205 112 H255" stroke={OUT} strokeWidth="2" opacity="0.4" />
    {/* the post horn */}
    <circle cx="234" cy="139" r="6.5" fill="none" stroke="#212529" strokeWidth="2.8" />
    <path d="M228 143 H221" stroke="#212529" strokeWidth="2.8" />
    <path d="M222 141 L214 136 V150 L222 145 Z" fill="#212529" stroke="#212529" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M205 150 H255" stroke={OUT} strokeWidth="2" opacity="0.4" />
  </>
);

/** Shop: shelves with boxes and tins high up and at the left, a counter with a till at the right edge. */
const laden = () => {
  const box = (x: number, y: number, w: number, h: number, fill: string) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y - h} width={w} height={h} rx="1.5" fill={fill} stroke={OUT} strokeWidth="2" />
      <rect x={x + w * 0.25} y={y - h * 0.65} width={w * 0.5} height={h * 0.3} rx="1" fill="rgba(255,255,255,0.6)" />
    </g>
  );
  const tin = (x: number, y: number, fill: string) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y - 14} width="11" height="14" rx="1.5" fill={fill} stroke={OUT} strokeWidth="2" />
      <path d={`M${x} ${y - 9} H${x + 11} M${x} ${y - 4} H${x + 11}`} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
    </g>
  );
  const goods: [number, number, string][] = [
    [8, 0, "#ffc9c9"],
    [24, 1, "#a5d8ff"],
    [37, 1, "#a5d8ff"],
    [50, 0, "#ffe066"],
    [68, 1, "#b2f2bb"],
    [81, 0, "#d0bfff"],
  ];
  return (
    <>
      <rect width="300" height="200" fill="#fdf2d6" />
      {/* shelves along the top */}
      <rect x="0" y="0" width="300" height="54" fill="#efd9b4" />
      <path d="M0 54 H300" stroke={OUT} strokeWidth="2.5" />
      {[26, 50].map((y) => (
        <rect key={y} x="-2" y={y} width="304" height="5" fill="#c99566" stroke={OUT} strokeWidth="2.2" />
      ))}
      {range(3).map((k) => goods.map(([x, kind, fill]) => (kind ? tin(x + k * 100, 26, fill) : box(x + k * 100, 26, 14, 18, fill))))}
      {range(3).map((k) =>
        goods.map(([x, kind, fill], i) => (kind ? box(x + k * 100 + 4, 50, 12, 16, goods[(i + 2) % 6][2]) : tin(x + k * 100 + 2, 50, fill))),
      )}
      {/* a tall shelf at the left */}
      <rect x="0" y="54" width="62" height="108" fill="#efd9b4" stroke={OUT} strokeWidth="2.5" />
      {[86, 122, 158].map((y, r) => (
        <g key={y}>
          {[6, 22, 38].map((x, i) => ((i + r) % 2 ? tin(x, y - 3, goods[(i + r) % 6][2]) : box(x, y - 3, 14, 20, goods[(i + r + 3) % 6][2])))}
          <rect x="0" y={y - 3} width="62" height="5" fill="#c99566" stroke={OUT} strokeWidth="2" />
        </g>
      ))}
      {/* floor */}
      <rect y="160" width="300" height="40" fill="#d7c4a5" />
      <path
        d={range(10)
          .map((i) => `M${i * 34} 160 V200`)
          .join(" ")}
        stroke="rgba(90,70,54,0.18)"
        strokeWidth="1.5"
      />
      <path d="M0 160 H300" stroke={OUT} strokeWidth="3" />
      {/* the counter with its till at the right edge */}
      <rect x="262" y="118" width="44" height="64" fill="#e2b98c" stroke={OUT} strokeWidth="3" />
      <rect x="258" y="112" width="48" height="8" rx="2" fill="#b9825a" stroke={OUT} strokeWidth="3" />
      <path d="M268 112 V96 H296 V112 Z" fill="#c2c9d0" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M272 96 L276 84 H294 L296 96 Z" fill="#dee2e6" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="279" y="87" width="12" height="5" rx="1" fill="#9be0b0" />
      <path d="M273 101 h4 M281 101 h4 M289 101 h4 M273 106 h4 M281 106 h4 M289 106 h4" stroke={OUT} strokeWidth="2" strokeLinecap="round" />
    </>
  );
};

/** Railway station: a platform roof along the top, rails behind the platform, a clock hanging at the right. */
const bahnhof = () => (
  <>
    <rect width="300" height="200" fill="#dbeef8" />
    {cloud(110, 46, 0.9)}
    <path d="M0 128 Q60 104 120 120 Q190 98 300 118 V136 H0 Z" fill="#c4dcae" stroke={OUT} strokeWidth="2.5" />
    {/* the rails */}
    <rect y="134" width="300" height="20" fill="#cdbfa9" />
    <path
      d={range(20)
        .map((i) => `M${i * 16 + 4} 136 V152`)
        .join(" ")}
      stroke="#9c7653"
      strokeWidth="5"
    />
    <path d="M0 140 H300 M0 148 H300" stroke="#868e96" strokeWidth="3" />
    <path d="M0 134 H300" stroke={OUT} strokeWidth="2.5" />
    {/* the platform */}
    <rect y="154" width="300" height="46" fill="#d6d3cf" />
    <rect y="154" width="300" height="6" fill="#f1e3a0" />
    <path
      d={range(9)
        .map((i) => `M${i * 38 + 20} 160 V200`)
        .join(" ")}
      stroke="rgba(90,70,54,0.15)"
      strokeWidth="1.5"
    />
    <path d="M0 154 H300" stroke={OUT} strokeWidth="3" />
    {/* the roof and its pillars */}
    <path d="M6 22 V156 M294 22 V156" stroke={OUT} strokeWidth="7" />
    <path d="M6 22 V156 M294 22 V156" stroke="#7aa88f" strokeWidth="3" />
    <path
      d="M-4 0 H304 V16 Q296 26 288 16 Q280 26 272 16 Q264 26 256 16 Q248 26 240 16 Q232 26 224 16 Q216 26 208 16 Q200 26 192 16 Q184 26 176 16 Q168 26 160 16 Q152 26 144 16 Q136 26 128 16 Q120 26 112 16 Q104 26 96 16 Q88 26 80 16 Q72 26 64 16 Q56 26 48 16 Q40 26 32 16 Q24 26 16 16 Q8 26 0 16 Z"
      fill="#8fbfa4"
      stroke={OUT}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M-4 8 H304" stroke="rgba(90,70,54,0.25)" strokeWidth="2" />
    {/* the clock hanging from the roof */}
    <path d="M272 20 V36" stroke={OUT} strokeWidth="3" />
    <circle cx="272" cy="52" r="16" fill="#fffdf6" stroke={OUT} strokeWidth="3.5" />
    {range(12).map((i) => {
      const a = (i * Math.PI) / 6;
      return <circle key={i} cx={272 + Math.sin(a) * 12} cy={52 - Math.cos(a) * 12} r={i % 3 ? 0.9 : 1.6} fill={OUT} />;
    })}
    <path d="M272 52 V43 M272 52 L279 55" stroke={OUT} strokeWidth="2.5" strokeLinecap="round" />
  </>
);

/** Airport: a big sky, the control tower at the right, the terminal's big window far back at the left, the runway. */
const flughafen = () => (
  <>
    <rect width="300" height="200" fill="#d5ebf8" />
    {cloud(74, 30, 1)}
    {cloud(196, 52, 0.8)}
    {/* the terminal with its big window far back */}
    <rect x="-4" y="104" width="120" height="50" fill="#e6e1d8" stroke={OUT} strokeWidth="2.5" />
    <rect x="4" y="112" width="104" height="30" fill="#bfdcef" stroke={OUT} strokeWidth="2" />
    <path d="M30 112 V142 M56 112 V142 M82 112 V142" stroke="#fbf7ee" strokeWidth="3" />
    <path d="M10 136 L24 118" stroke="#fff" strokeWidth="3" opacity="0.7" strokeLinecap="round" />
    <path d="M-6 104 H118" stroke={OUT} strokeWidth="5" />
    {/* the control tower */}
    <path d="M268 154 V70 H290 V154 Z" fill="#e9e4dc" stroke={OUT} strokeWidth="3" />
    <path d="M254 70 L260 46 H298 L304 70 Z" fill="#9fd0ea" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M272 46 V70 M286 46 V70" stroke="#fbf7ee" strokeWidth="2.5" />
    <rect x="256" y="38" width="46" height="9" rx="2" fill="#b0b8c0" stroke={OUT} strokeWidth="2.5" />
    <path d="M279 38 V26" stroke={OUT} strokeWidth="2.5" />
    <circle cx="279" cy="24" r="3.5" fill="#ff8787" stroke={OUT} strokeWidth="2" />
    <path d="M274 90 H284 M274 110 H284 M274 130 H284" stroke={SOFT} strokeWidth="2" />
    {/* grass and the runway */}
    <rect y="150" width="300" height="18" fill="#c4dcae" />
    <path d="M0 150 H300" stroke={OUT} strokeWidth="2.5" />
    <rect y="166" width="300" height="34" fill="#b9bcc0" />
    <path d="M0 166 H300" stroke={OUT} strokeWidth="3" />
    <path
      d={range(8)
        .map((i) => `M${i * 42 + 6} 184 h22`)
        .join(" ")}
      stroke="#fbfbf8"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </>
);

/** Harbour: sea, a wooden pier along the bottom, a lighthouse on a rock at the right, gulls far off. */
const hafen = () => (
  <>
    <rect width="300" height="200" fill="#d6ecf7" />
    {cloud(64, 34, 0.9)}
    {gull(140, 30)}
    {gull(156, 40)}
    {gull(206, 22)}
    {/* the far shore and the sea */}
    <path d="M-4 112 Q30 92 70 104 Q110 90 140 108 V114 H-4 Z" fill="#b9d3a5" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    <rect y="112" width="300" height="56" fill="#8ec5e3" />
    <path d="M0 112 H300" stroke={OUT} strokeWidth="2.5" />
    <path
      d="M30 128 q6 -4 12 0 q6 4 12 0 M120 136 q6 -4 12 0 q6 4 12 0 M190 124 q6 -4 12 0 q6 4 12 0 M60 148 q6 -4 12 0 q6 4 12 0"
      stroke="#e7f5fc"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* the lighthouse on its rock */}
    <path d="M232 120 Q236 102 256 100 Q284 98 294 112 Q300 120 302 124 H232 Z" fill="#b5aca1" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M254 104 L258 42 H278 L282 104 Z" fill="#fbfaf6" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M257 62 L279 62 L280 78 L256 78 Z M255 92 L281 92 L282 104 L254 104 Z" fill="#ef8a87" />
    <path d="M254 104 L258 42 H278 L282 104 Z" fill="none" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <rect x="256" y="28" width="24" height="14" rx="2" fill="#ffe8a3" stroke={OUT} strokeWidth="2.5" />
    <path d="M253 28 L268 16 L283 28 Z" fill="#ef8a87" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M252 42 H284" stroke={OUT} strokeWidth="3" />
    {/* the wooden pier */}
    <rect y="160" width="300" height="40" fill="#d8b48a" />
    <path
      d={range(12)
        .map((i) => `M${i * 26 + 10} 160 V200`)
        .join(" ")}
      stroke="rgba(90,70,54,0.3)"
      strokeWidth="1.5"
    />
    <path d="M0 160 H300" stroke={OUT} strokeWidth="3" />
    {[24, 286].map((x) => (
      <g key={x}>
        <rect x={x - 6} y="132" width="12" height="40" rx="3" fill="#b88a5e" stroke={OUT} strokeWidth="3" />
        <ellipse cx={x} cy="132" rx="6" ry="2.5" fill="#d8b48a" stroke={OUT} strokeWidth="2" />
      </g>
    ))}
    <path d="M24 146 Q40 156 30 166" stroke="#e0cfa8" strokeWidth="3" fill="none" />
  </>
);

/** Stage: red curtains at the sides and a valance, spotlights on a bar, light falling on a wooden floor. */
const buehne = () => {
  const curtain = (x: number, flip: boolean) => (
    <g transform={flip ? `translate(${x * 2 + 0} 0) scale(-1 1)` : undefined}>
      <path
        d={`M${x - 4} 0 H${x + 44} Q${x + 34} 70 ${x + 40} 120 Q${x + 46} 150 ${x + 30} 168 H${x - 4} Z`}
        fill="#d9585b"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${x + 12} 4 Q${x + 8} 90 ${x + 12} 166 M${x + 26} 4 Q${x + 22} 90 ${x + 24} 166`} stroke="#b8434a" strokeWidth="3" fill="none" />
      <path d={`M${x - 4} 112 Q${x + 20} 122 ${x + 40} 116`} stroke="#f2c14e" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <>
      <rect width="300" height="200" fill="#6f5f8f" />
      {/* light falling down from the spots */}
      {[90, 210].map((x) => (
        <path key={x} d={`M${x - 8} 30 L${x - 52} 166 H${x + 52} L${x + 8} 30 Z`} fill="#fff4cf" opacity="0.18" />
      ))}
      {/* the wooden floor */}
      <rect y="158" width="300" height="42" fill="#d4a373" />
      <path
        d={range(6)
          .map((i) => `M0 ${164 + i * 7} H300`)
          .join(" ")}
        stroke="rgba(90,70,54,0.18)"
        strokeWidth="1.5"
      />
      {[90, 210].map((x) => (
        <ellipse key={x} cx={x} cy="174" rx="54" ry="11" fill="#fff4cf" opacity="0.35" />
      ))}
      <path d="M0 158 H300" stroke={OUT} strokeWidth="3" />
      <rect x="-4" y="190" width="308" height="14" fill="#b07a4f" stroke={OUT} strokeWidth="3" />
      {curtain(0, false)}
      {curtain(300, true)}
      {/* the valance and the spotlight bar */}
      <path
        d="M-4 0 H304 V14 Q285 26 264 14 Q243 26 222 14 Q201 26 180 14 Q159 26 138 14 Q117 26 96 14 Q75 26 54 14 Q33 26 12 14 Q4 22 -4 14 Z"
        fill="#c94c52"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-4 9 H304" stroke="#f2c14e" strokeWidth="2.5" />
      {[90, 150, 210].map((x) => (
        <g key={x}>
          <path d={`M${x} 18 V24`} stroke={OUT} strokeWidth="2.5" />
          <path d={`M${x - 8} 24 H${x + 8} L${x + 6} 34 H${x - 6} Z`} fill="#495057" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx={x} cy="34" rx="6" ry="2" fill="#fff4cf" />
        </g>
      ))}
    </>
  );
};

/** Sports ground: the sky, stands with coloured seats at the back, floodlights at the sides, grass with white lines. */
const sportplatz = () => (
  <>
    <rect width="300" height="200" fill="#d8edf8" />
    {cloud(150, 26, 0.9)}
    {/* the floodlights */}
    {[16, 284].map((x) => (
      <g key={x}>
        <path d={`M${x} 34 V150`} stroke={OUT} strokeWidth="5" />
        <path d={`M${x} 34 V150`} stroke="#adb5bd" strokeWidth="2" />
        <rect x={x - 14} y="16" width="28" height="18" rx="2" fill="#fff8db" stroke={OUT} strokeWidth="2.5" />
        <path d={`M${x - 5} 16 V34 M${x + 5} 16 V34 M${x - 14} 25 H${x + 14}`} stroke={SOFT} strokeWidth="1.5" />
      </g>
    ))}
    {/* the stands */}
    <path d="M30 150 V96 L60 74 H240 L270 96 V150 Z" fill="#e3ddd4" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    {range(4).map((r) => (
      <g key={r}>
        <path d={`M${36 + r * 0} ${100 + r * 12} H264`} stroke={SOFT} strokeWidth="1.5" />
        {range(23).map((c) => (
          <rect
            key={c}
            x={40 + c * 10}
            y={90 + r * 12}
            width="7"
            height="7"
            rx="2"
            fill={["#ffb3b3", "#a5d8ff", "#ffe066", "#b2f2bb"][(c + r) % 4]}
            opacity="0.55"
          />
        ))}
      </g>
    ))}
    <path d="M58 74 L66 64 H234 L242 74" fill="#9fc0d8" stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
    {/* grass with mown stripes and white lines */}
    <rect y="150" width="300" height="50" fill="#9fcf8b" />
    {range(6).map((i) => (
      <rect key={i} x={i * 50} y="150" width="25" height="50" fill="#94c680" />
    ))}
    <path d="M0 150 H300" stroke={OUT} strokeWidth="3" />
    <path d="M150 158 V200 M0 158 H300" stroke="#fbfbf8" strokeWidth="3" />
    <ellipse cx="150" cy="186" rx="42" ry="14" fill="none" stroke="#fbfbf8" strokeWidth="3" />
  </>
);

/** Swimming pool: a tiled wall with high windows, the pool's rim, blue water with lane ropes, a ladder at the right. */
const schwimmbad = () => {
  const rope = (y: number) => (
    <g>
      <path d={`M0 ${y} H300`} stroke={OUT} strokeWidth="1.5" />
      {range(38).map((i) => (
        <ellipse key={i} cx={i * 8 + 4} cy={y} rx="3.6" ry="2.6" fill={i % 4 < 2 ? "#ff8787" : "#fbfbf8"} stroke={OUT} strokeWidth="1" />
      ))}
    </g>
  );
  return (
    <>
      <rect width="300" height="200" fill="#dff1f2" />
      {tileLines(0, 0, 300, 132, 12)}
      {/* high windows */}
      {[30, 120, 210].map((x) => (
        <g key={x}>
          <rect x={x} y="12" width="60" height="30" rx="3" fill="#cfe8f6" stroke={OUT} strokeWidth="2.5" />
          <path d={`M${x + 20} 12 V42 M${x + 40} 12 V42`} stroke="#fbf7ee" strokeWidth="3" />
        </g>
      ))}
      <rect y="104" width="300" height="10" fill="#9cd3d8" />
      {/* the rim and the water */}
      <rect y="130" width="300" height="10" fill="#fbfbf8" stroke={OUT} strokeWidth="2.5" />
      <path
        d={range(25)
          .map((i) => `M${i * 12} 130 V140`)
          .join(" ")}
        stroke={SOFT}
        strokeWidth="1"
      />
      <rect y="140" width="300" height="60" fill="#79c2e6" />
      <path d="M0 140 H300" stroke={OUT} strokeWidth="2.5" />
      <path
        d="M20 160 q6 -3 12 0 q6 3 12 0 M120 152 q6 -3 12 0 q6 3 12 0 M210 170 q6 -3 12 0 q6 3 12 0 M70 190 q6 -3 12 0 q6 3 12 0"
        stroke="#d9f0fb"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {rope(162)}
      {rope(186)}
      {/* the ladder at the right */}
      {[276, 292].map((x) => (
        <path key={x} d={`M${x} 166 V124 Q${x} 112 ${x - 12} 112`} stroke={OUT} strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      {[276, 292].map((x) => (
        <path key={x} d={`M${x} 166 V124 Q${x} 112 ${x - 12} 112`} stroke="#dee2e6" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ))}
      <path d="M276 150 H292 M276 160 H292" stroke={OUT} strokeWidth="3" />
    </>
  );
};

/** Ice rink: a pale winter sky, snowy firs behind a low wall, smooth light-blue ice with skate marks. */
const eisbahn = () => (
  <>
    <rect width="300" height="200" fill="#e6eef6" />
    {cloud(160, 30, 0.9)}
    <path d="M-4 112 Q50 94 110 106 Q180 90 304 108 V130 H-4 Z" fill="#f8fbfd" stroke={OUT} strokeWidth="2.5" />
    {fir(30, 114, 1.1, "#86b199")}
    {fir(76, 108, 0.8, "#7fa992")}
    {fir(208, 106, 0.85, "#86b199")}
    {fir(256, 112, 1.15, "#7fa992")}
    {fir(292, 108, 0.8, "#86b199")}
    {/* the low wall round the rink */}
    <rect x="-4" y="122" width="308" height="30" fill="#fbfbf8" stroke={OUT} strokeWidth="3" />
    <rect x="-4" y="122" width="308" height="7" fill="#9fc6e4" stroke={OUT} strokeWidth="2.5" />
    <path
      d={range(7)
        .map((i) => `M${i * 50 + 20} 129 V152`)
        .join(" ")}
      stroke={SOFT}
      strokeWidth="1.5"
    />
    {/* the ice */}
    <rect y="152" width="300" height="48" fill="#d4ecf7" />
    <path d="M0 152 H300" stroke={OUT} strokeWidth="3" />
    <path d="M20 176 Q70 164 120 178 M160 190 Q210 172 270 184 M200 164 Q240 158 290 166" stroke="#fbfdff" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M40 192 L60 184 M240 176 L262 170" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
  </>
);

/** Circus: tent stripes rising to the top, a string of lights, poles at the sides, the ring's sawdust and its red and white edge. */
const zirkus = () => (
  <>
    <rect width="300" height="200" fill="#fbeee6" />
    {range(10).map((i) => (
      <path key={i} d={`M150 -60 L${i * 36 - 30} 160 L${i * 36 - 12} 160 Z`} fill="#f5beb8" />
    ))}
    <path d="M-4 150 H304" stroke={OUT} strokeWidth="2" />
    {/* the poles */}
    {[22, 278].map((x) => (
      <g key={x}>
        <rect x={x - 5} y="0" width="10" height="160" fill="#e9c58f" stroke={OUT} strokeWidth="3" />
        <path d={`M${x - 5} 30 L${x + 5} 40 M${x - 5} 70 L${x + 5} 80 M${x - 5} 110 L${x + 5} 120`} stroke="#d9585b" strokeWidth="3" />
      </g>
    ))}
    {/* the string of lights */}
    <path d="M22 26 Q150 64 278 26" stroke={OUT} strokeWidth="2" fill="none" />
    {range(11).map((i) => {
      const t = (i + 0.5) / 11;
      const x = 22 + 256 * t;
      const y = 26 + 38 * 4 * t * (1 - t) * 0.5 * 2 * 0.5;
      return <circle key={i} cx={x} cy={y + 3} r="3.6" fill={["#ffe066", "#a5d8ff", "#ffc9c9", "#b2f2bb"][i % 4]} stroke={OUT} strokeWidth="1.5" />;
    })}
    {/* the ring: sawdust and its edge */}
    <rect y="156" width="300" height="44" fill="#ecd3a3" />
    <path d="M0 156 H300" stroke={OUT} strokeWidth="3" />
    <path d="M30 168 l2 1 M80 174 l2 -1 M140 166 l2 1 M210 172 l2 1 M260 166 l2 -1" stroke="#c9a66b" strokeWidth="2" strokeLinecap="round" />
    <path d="M-4 200 V184 Q150 174 304 184 V200 Z" fill="#fbfbf8" stroke={OUT} strokeWidth="3" />
    {range(9).map((i) => (
      <path key={i} d={`M${i * 40 - 10} ${185 - (i > 0 && i < 8 ? 4 : 1)} h20 v20 h-20 Z`} fill="#e46b6b" />
    ))}
    <path d="M-4 184 Q150 174 304 184" stroke={OUT} strokeWidth="3" fill="none" />
  </>
);

/** Castle: green hills, a lone tower far left, the castle with towers, flags and a drawbridge at the right. */
const schloss = () => {
  const tower = (x: number, top: number, w: number, flag: string) => (
    <g>
      <rect x={x} y={top} width={w} height={150 - top} fill="#cfcac3" stroke={OUT} strokeWidth="3" />
      <path d={`M${x - 4} ${top} L${x + w / 2} ${top - w * 0.8} L${x + w + 4} ${top} Z`} fill="#8aa0c8" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M${x + w / 2} ${top - w * 0.8} V${top - w * 0.8 - 16}`} stroke={OUT} strokeWidth="2.5" />
      <path
        d={`M${x + w / 2} ${top - w * 0.8 - 16} L${x + w / 2 + 14} ${top - w * 0.8 - 12} L${x + w / 2} ${top - w * 0.8 - 8} Z`}
        fill={flag}
        stroke={OUT}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect x={x + w / 2 - 4} y={top + 14} width="8" height="12" rx="4" fill="#5b5068" stroke={OUT} strokeWidth="2" />
    </g>
  );
  return (
    <>
      <rect width="300" height="200" fill="#d9eef8" />
      {cloud(120, 30, 0.9)}
      <path d="M-4 140 Q60 110 140 130 Q200 118 304 132 V200 H-4 Z" fill="#b6d79f" stroke={OUT} strokeWidth="2.5" />
      {tower(14, 66, 26, "#ffd43b")}
      {/* the castle wall with battlements */}
      <path
        d="M196 150 V96 h8 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h10 v-8 h10 v8 h12 V150 Z"
        fill="#dcd7cf"
        stroke={OUT}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M200 112 H296 M200 130 H296" stroke={SOFT} strokeWidth="1.5" />
      {tower(180, 66, 28, "#ff8787")}
      {tower(270, 54, 32, "#74c0fc")}
      {/* the gate with its drawbridge let down */}
      <path d="M226 150 V126 Q238 112 250 126 V150 Z" fill="#5b5068" stroke={OUT} strokeWidth="3" />
      <path d="M222 150 L254 150 L260 166 L216 166 Z" fill="#c99566" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <path d="M230 150 L226 166 M238 150 V166 M246 150 L250 166" stroke={SOFT} strokeWidth="1.5" />
      <path d="M224 120 L218 164 M252 120 L258 164" stroke={OUT} strokeWidth="1.8" strokeDasharray="3 2" />
      {/* the meadow in front */}
      <path d="M-4 158 Q80 150 150 160 Q230 152 304 160 V200 H-4 Z" fill="#a8d08f" />
      <path d="M-4 158 Q80 150 150 160 Q230 152 304 160" stroke={OUT} strokeWidth="3" fill="none" />
      <path d="M30 180 l3 -6 l3 6 M120 190 l3 -6 l3 6 M270 184 l3 -6 l3 6" stroke="#7fae6c" strokeWidth="2" fill="none" />
    </>
  );
};

/** Birthday party: a festive wall with dots, garlands of flags along the top, a table with a cloth at the right. */
const party = () => (
  <>
    <rect width="300" height="200" fill="#fdf0e8" />
    {range(9).map((c) =>
      range(5).map((r) => (
        <circle key={`${c}-${r}`} cx={c * 36 + (r % 2) * 18 + 8} cy={r * 30 + 50} r="3" fill={["#ffc9c9", "#c5e3f6", "#fff0a8", "#d3f0d0"][(c + r) % 4]} />
      )),
    )}
    {garland(-10, 150, 2, 16, ["#ff8787", "#ffd43b", "#74c0fc", "#8ce99a", "#b197fc"])}
    {garland(150, 310, 2, 16, ["#ffd43b", "#74c0fc", "#8ce99a", "#b197fc", "#ff8787"])}
    {/* floor */}
    <rect y="160" width="300" height="40" fill="#e3c4a0" />
    <path
      d={range(10)
        .map((i) => `M${i * 34} 160 V200`)
        .join(" ")}
      stroke="rgba(90,70,54,0.18)"
      strokeWidth="1.5"
    />
    <path d="M0 160 H300" stroke={OUT} strokeWidth="3" />
    {/* the table with its cloth at the right */}
    <path d="M170 196 V170 M294 196 V170" stroke={OUT} strokeWidth="5" />
    <path d="M170 196 V170 M294 196 V170" stroke="#c99566" strokeWidth="2" />
    <path
      d="M158 150 H306 V172 Q298 180 290 172 Q282 180 274 172 Q266 180 258 172 Q250 180 242 172 Q234 180 226 172 Q218 180 210 172 Q202 180 194 172 Q186 180 178 172 Q170 180 158 172 Z"
      fill="#fbfbf8"
      stroke={OUT}
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M158 156 H306" stroke="#ffc9c9" strokeWidth="3" />
    {range(9).map((i) => (
      <circle key={i} cx={168 + i * 16} cy="165" r="2.6" fill="#ff8787" />
    ))}
    <path d="M158 150 H306" stroke={OUT} strokeWidth="3" />
  </>
);

/** Vegetable garden: the sky, a fence, a shed at the right, rows of soil with little green shoots. */
const gemuesebeet = () => {
  const shoot = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <path d={`M${x} ${y} V${y - 7}`} stroke="#5f9c57" strokeWidth="2" />
      <path
        d={`M${x} ${y - 6} Q${x - 7} ${y - 12} ${x - 8} ${y - 5} Q${x - 3} ${y - 3} ${x} ${y - 6} Z M${x} ${y - 6} Q${x + 7} ${y - 12} ${x + 8} ${y - 5} Q${x + 3} ${y - 3} ${x} ${y - 6} Z`}
        fill="#8cc58a"
        stroke={OUT}
        strokeWidth="1.5"
      />
    </g>
  );
  return (
    <>
      <rect width="300" height="200" fill="#d9eef8" />
      {cloud(90, 30, 1)}
      <rect y="112" width="300" height="50" fill="#c4dcae" />
      {/* the fence */}
      <path d="M0 122 H240 M0 142 H240" stroke={OUT} strokeWidth="5" />
      <path d="M0 122 H240 M0 142 H240" stroke="#e7cfa9" strokeWidth="2.5" />
      {range(12).map((i) => (
        <path
          key={i}
          d={`M${i * 22 + 4} 154 V112 L${i * 22 + 10} 104 L${i * 22 + 16} 112 V154 Z`}
          fill="#efd9b4"
          stroke={OUT}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      ))}
      {/* the shed at the right */}
      <path d="M232 160 V86 H300 V160 Z" fill="#c9a37a" stroke={OUT} strokeWidth="3" />
      <path d="M246 88 V158 M260 88 V158 M274 88 V158 M288 88 V158" stroke={SOFT} strokeWidth="1.5" />
      <path d="M222 90 L268 60 L314 90 Z" fill="#8f9f7a" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
      <rect x="252" y="112" width="30" height="48" rx="2" fill="#a77d58" stroke={OUT} strokeWidth="3" />
      <circle cx="276" cy="138" r="2" fill={OUT} />
      {/* the soil in rows */}
      <rect y="156" width="300" height="44" fill="#b98b62" />
      <path d="M0 156 H300" stroke={OUT} strokeWidth="3" />
      {[170, 186].map((y) => (
        <path key={y} d={`M0 ${y} H300`} stroke="#9a6e48" strokeWidth="4" strokeLinecap="round" />
      ))}
      {range(11).map((i) => shoot(i * 28 + 10, 167))}
      {range(11).map((i) => shoot(i * 28 + 24, 183))}
      {range(11).map((i) => shoot(i * 28 + 10, 199))}
    </>
  );
};

export const WORK_BACKDROPS = {
  praxis,
  salon,
  baeckerei,
  feuer,
  post,
  laden,
  bahnhof,
  flughafen,
  hafen,
  buehne,
  sportplatz,
  schwimmbad,
  eisbahn,
  zirkus,
  schloss,
  party,
  gemuesebeet,
} satisfies Partial<Record<BackdropId, () => ReactNode>>;
