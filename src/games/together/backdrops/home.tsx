import type { ReactNode } from "react";
import type { BackdropId } from "./index";

// The backdrops at home (see index.ts for what each shows and how they are drawn). Each keeps the middle plain for
// the thing in front and tells the place by what stands at its sides and along its top.

const OUT = "#5a4636";

/** The outline every shape shares. */
const LINE = { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;
/** A thinner outline for small parts. */
const THIN = { stroke: OUT, strokeWidth: 2.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** A wooden floor from `y` down, its planks running across. */
const planks = (y: number, fill = "#e6c8a2", seam = "#d3ad83") => (
  <>
    <rect y={y} width="300" height={200 - y} fill={fill} />
    <path d={`M0 ${y + 12} H300 M0 ${y + 25} H300`} stroke={seam} strokeWidth="1.6" />
    <path
      d={`M40 ${y} V${y + 12} M150 ${y} V${y + 12} M250 ${y} V${y + 12} M96 ${y + 12} V${y + 25} M206 ${y + 12} V${y + 25}`}
      stroke={seam}
      strokeWidth="1.6"
    />
    <path d={`M0 ${y} H300`} {...LINE} />
  </>
);

/** A small skirting board along the wall's foot. */
const skirting = (y: number, fill = "#fffaf0") => <rect x="-4" y={y - 6} width="308" height="6" fill={fill} {...THIN} />;

/** A window with sky, a cloud and a green hill, its bars and its sill. */
const windowAt = (x: number, y: number, w: number, h: number, frame = "#fffaf0") => {
  const cx = x + w / 2;
  const cy = y + h * 0.45;
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={frame} {...LINE} />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill="#d4ebf7" />
      <path d={`M${x + 6} ${y + h - 18} Q${x + w * 0.4} ${y + h - 34} ${x + w - 6} ${y + h - 22} V${y + h - 6} H${x + 6} Z`} fill="#bcdba0" />
      <path
        d={`M${x + 12} ${y + 24} q2 -7 9 -5 q4 -6 10 -1 q6 0 5 6 Z`}
        fill="#fff"
        stroke="#bcd6e6"
        strokeWidth="1.5"
        strokeLinejoin="round"
        transform={`translate(${w * 0.08} 0)`}
      />
      <path d={`M${cx} ${y + 6} V${y + h - 6} M${x + 6} ${cy} H${x + w - 6}`} stroke={frame} strokeWidth="5" />
      <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} fill="none" {...THIN} />
      <path d={`M${cx - 2.5} ${y + 6} V${y + h - 6} M${cx + 2.5} ${y + 6} V${y + h - 6}`} stroke={OUT} strokeWidth="1.5" />
      <path d={`M${x + 6} ${cy - 2.5} H${x + w - 6} M${x + 6} ${cy + 2.5} H${x + w - 6}`} stroke={OUT} strokeWidth="1.5" />
      <rect x={x - 5} y={y + h - 3} width={w + 10} height="7" rx="2" fill={frame} {...THIN} />
    </>
  );
};

/** A curtain hanging from `top` at the side of a window, gathered at its middle; `side` is the window's side it hangs on. */
const curtain = (x: number, top: number, bottom: number, w: number, side: "left" | "right", fill: string, fold: string) => {
  const inner = side === "left" ? x + w : x;
  const outer = side === "left" ? x : x + w;
  const waist = top + (bottom - top) * 0.55;
  const pinch = side === "left" ? outer + w * 0.45 : outer - w * 0.45;
  return (
    <>
      <path
        d={`M${outer} ${top} L${inner} ${top} Q${pinch} ${waist - 12} ${pinch} ${waist} Q${inner} ${waist + 18} ${inner + (side === "left" ? 2 : -2)} ${bottom} L${outer} ${bottom} Z`}
        fill={fill}
        {...LINE}
      />
      <path
        d={`M${(outer + pinch) / 2} ${top + 4} Q${(outer + pinch) / 2 + (side === "left" ? 3 : -3)} ${waist} ${(outer + inner) / 2} ${bottom - 4}`}
        stroke={fold}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path d={`M${outer} ${waist} L${pinch} ${waist}`} stroke={OUT} strokeWidth="2.5" />
    </>
  );
};

/** A picture frame with a little landscape in it: a hill and a sun. */
const framedPicture = (x: number, y: number, w: number, h: number, frame = "#d9a066") => (
  <>
    <rect x={x} y={y} width={w} height={h} rx="2" fill={frame} {...LINE} />
    <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} fill="#e3f1f8" {...THIN} />
    <path d={`M${x + 6} ${y + h - 12} Q${x + w * 0.35} ${y + h * 0.4} ${x + w - 6} ${y + h - 14} V${y + h - 6} H${x + 6} Z`} fill="#b5d69a" />
    <circle cx={x + w - 14} cy={y + 14} r="4.5" fill="#ffe08a" />
    <rect x={x + 5} y={y + 5} width={w - 10} height={h - 10} fill="none" {...THIN} />
  </>
);

/** Bathroom: tiles, a round mirror at the left, the washbasin's edge under the shelf, a towel on its hook at the right. */
const bad = () => (
  <>
    <rect width="300" height="200" fill="#e2f2f0" />
    <path
      d={`${Array.from({ length: 15 }, (_, i) => `M${10 + i * 20} 0 V200`).join(" ")} ${Array.from({ length: 10 }, (_, i) => `M0 ${10 + i * 20} H300`).join(" ")}`}
      stroke="#cbe5e2"
      strokeWidth="1.4"
    />
    {/* a band of darker tiles across the wall */}
    <rect y="130" width="300" height="10" fill="#c8e4e0" />
    <path d="M0 130 H300 M0 140 H300" stroke="#b3d8d3" strokeWidth="1.4" />
    {/* the floor */}
    <rect y="178" width="300" height="22" fill="#cfdde3" />
    <path d="M0 189 H300 M20 178 V200 M60 178 V200 M240 178 V200 M280 178 V200" stroke="#b9cbd3" strokeWidth="1.4" />
    <path d="M0 178 H300" {...LINE} />
    {/* the mirror */}
    <ellipse cx="44" cy="70" rx="30" ry="40" fill="#f2d49b" {...LINE} />
    <ellipse cx="44" cy="70" rx="23" ry="33" fill="#d9eef8" {...THIN} />
    <path d="M30 56 Q34 44 44 40 M30 68 Q32 62 36 58" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* the towel on its hook */}
    <circle cx="262" cy="40" r="4" fill="#d0d6db" {...THIN} />
    <path d="M244 50 Q262 40 280 50 L282 124 Q263 130 242 124 Z" fill="#f6c6c4" {...LINE} />
    <path d="M243 106 Q263 112 281 106 M243 114 Q263 120 282 114" stroke="#e99a98" strokeWidth="3" fill="none" />
    <path d="M262 46 Q260 86 263 126" stroke="#eaaeac" strokeWidth="3" fill="none" />
    {/* the shelf's brackets and the washbasin below it */}
    <path d="M78 168 V176 L86 168 M222 168 V176 L214 168" fill="#f4f6f7" {...THIN} />
    <path d="M66 186 H234 Q230 208 150 210 Q70 208 66 186 Z" fill="#fbfdfd" {...LINE} />
    <path d="M84 194 Q150 204 216 194" stroke="#dbe7ea" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="58" y="181" width="184" height="8" rx="4" fill="#fff" {...LINE} />
  </>
);

/** Kitchen: tiles behind a worktop with cupboards below, a window at the left, a cupboard and a shelf of jars at the right. */
const kueche = () => (
  <>
    <rect width="300" height="200" fill="#fbf1dc" />
    {/* the tiles behind the worktop */}
    <rect y="112" width="300" height="62" fill="#fdf8ee" />
    <path d={`${Array.from({ length: 15 }, (_, i) => `M${i * 20 + 10} 112 V174`).join(" ")} M0 132 H300 M0 152 H300`} stroke="#ecdcbc" strokeWidth="1.4" />
    <path d="M0 112 H300" stroke="#e2cfa8" strokeWidth="2" />
    {/* the window */}
    {windowAt(12, 22, 66, 70)}
    <path d="M6 16 H84 V30 Q77 36 71 30 Q64 36 58 30 Q51 36 45 30 Q38 36 32 30 Q25 36 19 30 Q12 36 6 30 Z" fill="#f5c7a0" {...LINE} />
    <path d="M10 22 H80" stroke="#eaa97a" strokeWidth="3" strokeLinecap="round" />
    {/* the cupboard above and the shelf of jars */}
    <rect x="222" y="0" width="80" height="44" fill="#c7ddc0" {...LINE} />
    <path d="M261 0 V44" {...THIN} />
    <path d="M254 30 V36 M268 30 V36" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
    <rect x="216" y="94" width="86" height="7" rx="2" fill="#d9a877" {...LINE} />
    {[
      [228, "#f4b183"],
      [252, "#f7d77c"],
      [276, "#b8d8a8"],
    ].map(([x, fill]) => (
      <g key={x as number}>
        <rect x={(x as number) - 9} y="66" width="18" height="28" rx="5" fill="#eef6f8" {...THIN} />
        <rect x={(x as number) - 6} y="76" width="12" height="15" rx="3" fill={fill as string} />
        <rect x={(x as number) - 10} y="61" width="20" height="7" rx="3" fill="#e8d1ae" {...THIN} />
      </g>
    ))}
    {/* the worktop and the cupboards below */}
    <rect x="-4" y="170" width="308" height="34" fill="#c7ddc0" {...LINE} />
    <path d="M60 170 V200 M240 170 V200 M120 170 V200 M180 170 V200" {...THIN} />
    <path d="M28 186 H40 M260 186 H272" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
    <rect x="-4" y="164" width="308" height="9" rx="2" fill="#e3c18f" {...LINE} />
  </>
);

/** Dining room: striped wallpaper, a window at the left, a picture at the right, chairs' backs and the table along the bottom. */
const esstisch = () => (
  <>
    <rect width="300" height="200" fill="#f8ecd9" />
    <path d={Array.from({ length: 13 }, (_, i) => `M${12 + i * 24} 0 V160`).join(" ")} stroke="#f1dfc3" strokeWidth="10" />
    {windowAt(18, 22, 54, 70)}
    {curtain(4, 14, 104, 18, "left", "#c9dcef", "#a9c4e0")}
    {curtain(68, 14, 104, 18, "right", "#c9dcef", "#a9c4e0")}
    <path d="M2 14 H90" {...LINE} />
    {framedPicture(226, 30, 58, 46)}
    {/* the chairs' backs behind the table */}
    {[34, 266].map((x) => (
      <g key={x}>
        <path d={`M${x - 18} 160 V112 Q${x} 102 ${x + 18} 112 V160`} fill="#d8a46e" {...LINE} />
        <path d={`M${x - 8} 158 V118 M${x + 8} 158 V118`} stroke="#b98351" strokeWidth="4" strokeLinecap="round" />
      </g>
    ))}
    {/* the table */}
    <rect x="-4" y="160" width="308" height="44" fill="#d9b48c" {...LINE} />
    <path d="M0 176 H300 M0 189 H300" stroke="#c99f74" strokeWidth="1.6" />
    <path
      d={`M-4 150 H304 V168 ${Array.from({ length: 13 }, (_, i) => `Q${298 - i * 24} 178 ${292 - i * 24 - 6} 168`).join(" ")} H-4 Z`}
      fill="#fdf6ec"
      {...LINE}
    />
    <path d="M0 158 H300" stroke="#f2e2c9" strokeWidth="3" />
  </>
);

/** Living room: a standard lamp and a picture at the left, the sofa with a picture over it at the right, a rug. */
const wohnzimmer = () => (
  <>
    <rect width="300" height="200" fill="#f5e8d8" />
    <g fill="#ecdac3">
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={15 + (i % 10) * 30 + (Math.floor(i / 10) % 2) * 15} cy={18 + Math.floor(i / 10) * 36} r="3" />
      ))}
    </g>
    {skirting(164)}
    {planks(164)}
    {/* the rug */}
    <ellipse cx="150" cy="184" rx="118" ry="13" fill="#e8b4a5" {...LINE} />
    <ellipse cx="150" cy="184" rx="100" ry="8" fill="none" stroke="#f6d3c8" strokeWidth="3" />
    {/* the picture and the standard lamp */}
    {framedPicture(10, 34, 44, 56)}
    <path d="M72 82 V160" stroke={OUT} strokeWidth="5" strokeLinecap="round" />
    <path d="M72 82 V160" stroke="#c9a46f" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="72" cy="162" rx="14" ry="4" fill="#b78e5b" {...THIN} />
    <path d="M58 52 H86 L94 82 H50 Z" fill="#fbe0a0" {...LINE} />
    <path d="M62 60 H82" stroke="#f3cc78" strokeWidth="3" strokeLinecap="round" />
    {/* the picture over the sofa */}
    {framedPicture(232, 30, 54, 42, "#c9a0c4")}
    {/* the sofa */}
    <path d="M218 158 V110 Q218 98 232 98 H300 V158 Z" fill="#a9c6dd" {...LINE} />
    <path d="M226 132 H300 V160 H226 Z" fill="#b9d2e6" {...LINE} />
    <path d="M206 168 V128 Q206 118 218 118 Q230 118 230 128 V168 Z" fill="#9dbcd6" {...LINE} />
    <path d="M262 132 V160" {...THIN} />
    <path d="M214 168 V176 M290 160 V176" stroke={OUT} strokeWidth="4" strokeLinecap="round" />
  </>
);

/** Bedroom: a window with curtains and a bedside table at the left, the bed with its blanket at the right. */
const schlafzimmer = () => (
  <>
    <rect width="300" height="200" fill="#e7ebf6" />
    <g fill="#d6ddef">
      {Array.from({ length: 24 }, (_, i) => {
        const x = 20 + (i % 8) * 38 + (Math.floor(i / 8) % 2) * 19;
        const y = 22 + Math.floor(i / 8) * 46;
        return (
          <path
            key={i}
            d={`M${x} ${y - 4} L${x + 1.4} ${y - 1.4} L${x + 4} ${y} L${x + 1.4} ${y + 1.4} L${x} ${y + 4} L${x - 1.4} ${y + 1.4} L${x - 4} ${y} L${x - 1.4} ${y - 1.4} Z`}
          />
        );
      })}
    </g>
    {skirting(164)}
    {planks(164, "#e2c6a4", "#ceaa84")}
    {/* the window with its curtains */}
    {windowAt(14, 22, 58, 74)}
    {curtain(2, 14, 110, 18, "left", "#f3c6d6", "#e4a3ba")}
    {curtain(64, 14, 110, 18, "right", "#f3c6d6", "#e4a3ba")}
    <path d="M0 14 H86" {...LINE} />
    {/* the bedside table */}
    <rect x="22" y="128" width="48" height="36" rx="3" fill="#d9ad7c" {...LINE} />
    <path d="M22 144 H70" {...THIN} />
    <circle cx="46" cy="136" r="2.5" fill={OUT} />
    <circle cx="46" cy="153" r="2.5" fill={OUT} />
    {/* the bed: its headboard at the right, the blanket over it, the foot by the middle */}
    <path d="M280 174 V96 Q290 84 304 88 V174 Z" fill="#c99566" {...LINE} />
    <path d="M288 104 V164" stroke="#b07f52" strokeWidth="3" strokeLinecap="round" />
    <rect x="200" y="148" width="84" height="14" fill="#c99566" {...LINE} />
    <rect x="204" y="134" width="78" height="14" rx="3" fill="#fdfaf3" {...LINE} />
    <path d="M206 132 Q244 124 280 130 V142 H264 Q262 162 254 168 H206 Z" fill="#fce3a4" {...LINE} />
    <path d="M264 132 Q270 136 268 142" stroke="#f3bf63" strokeWidth="3" fill="none" strokeLinecap="round" />
    <g fill="#f3bf63">
      <circle cx="222" cy="140" r="3" />
      <circle cx="240" cy="138" r="3" />
      <circle cx="230" cy="154" r="3" />
      <circle cx="248" cy="152" r="3" />
    </g>
    <path d="M206 168 H254" stroke="#f3bf63" strokeWidth="3" strokeLinecap="round" />
    <path d="M196 176 V128 Q196 120 204 120 Q212 120 212 128 V176 Z" fill="#c99566" {...LINE} />
    <path d="M216 162 V176 M276 162 V176" stroke={OUT} strokeWidth="4" strokeLinecap="round" />
  </>
);

/** Children's room: a garland of flags along the top, a window at the left, a shelf of toy boxes at the right, a round rug. */
const kinderzimmer = () => (
  <>
    <rect width="300" height="200" fill="#fdf2cf" />
    <path d={Array.from({ length: 13 }, (_, i) => `M${12 + i * 24} 0 V164`).join(" ")} stroke="#f8e8b8" strokeWidth="10" />
    {skirting(164)}
    {planks(164, "#ebcfa8", "#d8b68b")}
    {/* the round rug */}
    <ellipse cx="150" cy="184" rx="104" ry="13" fill="#bfe0d8" {...LINE} />
    <ellipse cx="150" cy="184" rx="78" ry="9" fill="#f9d1a5" />
    <ellipse cx="150" cy="184" rx="48" ry="5" fill="#f4b8c4" />
    {/* the garland of flags */}
    <path d="M-4 4 Q150 48 304 4" stroke={OUT} strokeWidth="2" fill="none" />
    {[18, 44, 70, 96, 122, 150, 178, 204, 230, 256, 282].map((x, i) => {
      const y = 4 + 22 * (1 - ((x - 150) / 154) ** 2) - 0.5;
      return (
        <path key={x} d={`M${x - 8} ${y} L${x + 8} ${y} L${x} ${y + 15} Z`} fill={["#f4a3a3", "#ffd98a", "#a8d8b0", "#a9c9ef", "#d4b3e6"][i % 5]} {...THIN} />
      );
    })}
    {/* the window */}
    {windowAt(14, 48, 60, 66)}
    {/* the shelf of toy boxes */}
    <rect x="214" y="70" width="80" height="94" fill="#e3b787" {...LINE} />
    <rect x="220" y="76" width="68" height="40" fill="#c99a68" />
    <rect x="220" y="122" width="68" height="36" fill="#c99a68" />
    <path d="M220 76 H288 V116 H220 Z M220 122 H288 V158 H220 Z M254 76 V116 M254 122 V158" fill="none" {...THIN} />
    {[
      [222, 94, "#f4a3a3"],
      [256, 92, "#a9c9ef"],
      [222, 134, "#ffd98a"],
      [256, 132, "#a8d8b0"],
    ].map(([x, y, fill]) => (
      <g key={`${x}-${y}`}>
        <path
          d={`M${x as number} ${y as number} H${(x as number) + 30} L${(x as number) + 28} ${(y as number) + 22} H${(x as number) + 2} Z`}
          fill={fill as string}
          {...THIN}
        />
        <path d={`M${(x as number) + 10} ${(y as number) + 7} H${(x as number) + 20}`} stroke={OUT} strokeWidth="3" strokeLinecap="round" />
      </g>
    ))}
    {/* a little wooden house on top of the shelf */}
    <path d="M236 70 V54 L250 42 L264 54 V70 Z" fill="#f7d6a0" {...THIN} />
    <path d="M232 56 L250 40 L268 56" stroke={OUT} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M232 56 L250 40 L268 56" stroke="#e98a7a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="245" y="58" width="10" height="12" rx="2" fill="#c98a5a" {...THIN} />
  </>
);

/** Hallway: a coat rail with a jacket and an empty shoe rack at the left, the front door's side at the right, a runner. */
const flur = () => (
  <>
    <rect width="300" height="200" fill="#f4e7d4" />
    {/* the panelling on the wall's lower part */}
    <rect y="112" width="300" height="54" fill="#eadbc2" />
    <path d="M0 112 H300" stroke="#d9c4a2" strokeWidth="3" />
    <path d={Array.from({ length: 8 }, (_, i) => `M${8 + i * 40} 120 h32 v38 h-32 Z`).join(" ")} fill="none" stroke="#dccaab" strokeWidth="2" />
    {/* the tiled floor */}
    <rect y="166" width="300" height="34" fill="#e9c8a8" />
    <path d="M0 177 H300 M0 189 H300" stroke="#d8b38f" strokeWidth="1.6" />
    <path d={Array.from({ length: 11 }, (_, i) => `M${i * 30} 166 L${i * 30 - 12} 200`).join(" ")} stroke="#d8b38f" strokeWidth="1.6" />
    <path d="M0 166 H300" {...LINE} />
    {/* the runner */}
    <path d="M80 176 H220 L228 194 H72 Z" fill="#b9cfa6" {...LINE} />
    <path d="M86 181 H214 M82 189 H218" stroke="#d5e4c6" strokeWidth="2.5" />
    {/* the coat rail and the jacket */}
    <rect x="8" y="34" width="74" height="9" rx="3" fill="#c99566" {...LINE} />
    <path d="M22 43 V50 M45 43 V50 M68 43 V50" stroke={OUT} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M33 56 Q20 58 18 72 L14 104 Q18 108 24 106 L28 76 Z" fill="#8bb4d8" {...LINE} />
    <path d="M57 56 Q70 58 72 72 L76 104 Q72 108 66 106 L62 76 Z" fill="#8bb4d8" {...LINE} />
    <path d="M45 50 Q36 52 32 56 Q26 62 27 74 L26 112 H64 L63 74 Q64 62 58 56 Q54 52 45 50 Z" fill="#9fc2e0" {...LINE} />
    <path d="M45 50 L45 112" {...THIN} />
    <path d="M45 50 L36 54 L41 66 Z M45 50 L54 54 L49 66 Z" fill="#c8ddef" {...THIN} />
    <circle cx="49" cy="78" r="2" fill={OUT} />
    <circle cx="49" cy="92" r="2" fill={OUT} />
    <path d="M30 94 H40 M50 94 H60" stroke="#7aa6cc" strokeWidth="2.5" strokeLinecap="round" />
    {/* the empty shoe rack */}
    <rect x="10" y="132" width="72" height="34" rx="2" fill="#d9ad7c" {...LINE} />
    <path d="M14 149 H78" {...THIN} />
    <path d="M18 140 H74 M18 157 H74" stroke="#c4935f" strokeWidth="2" />
    {/* the front door's side at the right */}
    <rect x="234" y="16" width="72" height="152" fill="#a8683b" {...LINE} />
    <rect x="244" y="26" width="62" height="142" fill="#d08a4e" {...LINE} />
    <rect x="256" y="38" width="38" height="44" rx="4" fill="#fdeec0" {...THIN} />
    <path d="M275 38 V82 M256 60 H294" stroke="#d08a4e" strokeWidth="3" />
    <rect x="256" y="96" width="38" height="56" rx="4" fill="#c27c42" {...THIN} />
    <rect x="249" y="102" width="6" height="16" rx="3" fill="#e9c46a" {...THIN} />
  </>
);

/** A house front round the front door (the door and its frame stand in front): plaster, two windows, the roof's edge, the steps. */
const hausfront = () => (
  <>
    <rect width="300" height="200" fill="#f7dfc4" />
    {/* a few bricks showing through the plaster */}
    <g fill="none" stroke="#e8c7a3" strokeWidth="2">
      <path d="M10 124 h20 v9 h-20 Z M22 133 h20 v9 h-20 Z M240 130 h20 v9 h-20 Z M256 121 h20 v9 h-20 Z M262 54 h18 v8 h-18 Z" />
    </g>
    {/* the plinth along the bottom */}
    <rect y="172" width="300" height="28" fill="#cfc4b8" />
    <path d="M0 186 H300 M30 172 V186 M260 172 V186 M50 186 V200 M246 186 V200" stroke="#b8ab9c" strokeWidth="1.6" />
    <path d="M0 172 H300" {...LINE} />
    {/* the roof's edge with its gutter */}
    <path d="M-4 -4 H304 V10 H-4 Z" fill="#c4614e" {...LINE} />
    <path
      d="M20 -4 V10 M50 -4 V10 M80 -4 V10 M110 -4 V10 M140 -4 V10 M170 -4 V10 M200 -4 V10 M230 -4 V10 M260 -4 V10 M290 -4 V10"
      stroke="#a84d3d"
      strokeWidth="2"
    />
    <rect x="-4" y="9" width="308" height="6" rx="3" fill="#bfc6cc" {...THIN} />
    {/* the two windows, each with shutters */}
    {[12, 232].map((x) => (
      <g key={x}>
        <rect x={x - 6} y="38" width="12" height="72" rx="2" fill="#9cc49a" {...THIN} />
        <rect x={x + 50} y="38" width="12" height="72" rx="2" fill="#9cc49a" {...THIN} />
        <path
          d={`M${x - 3} 50 h6 M${x - 3} 62 h6 M${x - 3} 74 h6 M${x - 3} 86 h6 M${x - 3} 98 h6 M${x + 53} 50 h6 M${x + 53} 62 h6 M${x + 53} 74 h6 M${x + 53} 86 h6 M${x + 53} 98 h6`}
          stroke="#7fae7c"
          strokeWidth="2"
        />
        {windowAt(x + 6, 38, 44, 70)}
      </g>
    ))}
    {/* a round shrub at the left */}
    <path d="M8 178 Q2 160 16 152 Q20 138 36 142 Q50 134 58 148 Q72 154 64 178 Z" fill="#9cc782" {...LINE} />
    <path d="M22 160 Q28 152 36 154 M44 150 Q50 148 54 154" stroke="#b8db9f" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* the flower tub at the right */}
    <path d="M238 186 L242 160 H284 L288 186 Z" fill="#b8865a" {...LINE} />
    <path d="M240 168 H286" stroke="#9a6d45" strokeWidth="2.5" />
    <path d="M246 160 Q244 146 252 142 Q262 138 264 148 Q272 136 280 146 Q286 152 280 160 Z" fill="#8cbf73" {...THIN} />
    <circle cx="252" cy="148" r="4" fill="#f4a3a3" {...THIN} />
    <circle cx="268" cy="144" r="4" fill="#ffd98a" {...THIN} />
    <circle cx="278" cy="152" r="4" fill="#f4a3a3" {...THIN} />
    {/* the two stone steps in front of the door */}
    <rect x="62" y="192" width="176" height="12" rx="2" fill="#d9d2c9" {...LINE} />
    <rect x="72" y="183" width="156" height="11" rx="2" fill="#e6e0d8" {...LINE} />
  </>
);

/** A painting table from a little above: children's drawings on the wall at the top, a paint box and a jar of brushes. */
const maltisch = () => (
  <>
    <rect width="300" height="34" fill="#f3ead9" />
    {/* two drawings taped to the wall: a sun and a house */}
    <rect x="14" y="3" width="40" height="27" fill="#fff" {...THIN} transform="rotate(-4 34 16)" />
    <circle cx="34" cy="17" r="6" fill="#ffd43b" transform="rotate(-4 34 16)" />
    <path
      d="M34 6 V9 M34 25 V28 M23 17 H26 M42 17 H45 M26 9 L28 11 M42 9 L40 11"
      stroke="#f5a623"
      strokeWidth="2"
      strokeLinecap="round"
      transform="rotate(-4 34 16)"
    />
    <rect x="28" y="0" width="12" height="5" fill="#f6e3a1" opacity="0.9" transform="rotate(-4 34 16)" />
    <rect x="244" y="3" width="40" height="27" fill="#fff" {...THIN} transform="rotate(5 264 16)" />
    <path d="M254 27 V17 L264 9 L274 17 V27 Z" fill="#f4a3a3" stroke="#e8737a" strokeWidth="1.6" strokeLinejoin="round" transform="rotate(5 264 16)" />
    <path d="M249 27 H279" stroke="#69b05a" strokeWidth="2.5" transform="rotate(5 264 16)" />
    <rect x="258" y="0" width="12" height="5" fill="#f6e3a1" opacity="0.9" transform="rotate(5 264 16)" />
    {/* the table top */}
    <rect y="32" width="300" height="168" fill="#efd4ab" />
    <path d="M38 32 L-6 200 M88 32 L62 200 M212 32 L238 200 M262 32 L306 200" stroke="#e0bf8f" strokeWidth="2" />
    <path d="M0 32 H300" {...LINE} />
    <path d="M0 35 H300" stroke="#f7e3c4" strokeWidth="2" />
    {/* soft old splashes of paint on the wood */}
    <ellipse cx="54" cy="70" rx="7" ry="4" fill="#bcd9ef" opacity="0.7" />
    <ellipse cx="248" cy="160" rx="8" ry="4" fill="#f4c2c2" opacity="0.7" />
    <ellipse cx="236" cy="96" rx="5" ry="3" fill="#cfe5b4" opacity="0.8" />
    {/* the paint box at the bottom left */}
    <rect x="6" y="150" width="62" height="38" rx="5" fill="#a8c4dc" {...LINE} />
    {["#f08080", "#ffd25e", "#7cc08a", "#7ab0e6", "#c69be0", "#f6a95a"].map((fill, i) => (
      <rect key={fill} x={13 + (i % 3) * 18} y={i < 3 ? 156 : 171} width="13" height="11" rx="3" fill={fill} {...THIN} />
    ))}
    {/* the jar of brushes at the top right */}
    <path d="M266 44 L262 30 M278 42 L284 26 M272 42 V24" stroke={OUT} strokeWidth="5" strokeLinecap="round" />
    <path d="M266 44 L262 30 M278 42 L284 26 M272 42 V24" stroke="#d9a066" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M261 31 L259 22 Q262 20 264 29 Z M272 25 L272 16 Q275 18 274 25 Z M283 27 L287 18 Q289 21 286 28 Z" fill="#5a4636" />
    <path d="M258 42 H288 L286 74 Q273 78 260 74 Z" fill="#dcecf3" {...LINE} />
    <path d="M260 60 H286 L286 74 Q273 78 260 74 Z" fill="#b9d8ea" />
    <path d="M258 42 H288 L286 74 Q273 78 260 74 Z" fill="none" {...LINE} />
  </>
);

/** A windowsill: a big window with sky, a tree and hills outside, curtains at the sides, the sill along the bottom. */
const fensterbank = () => (
  <>
    <rect width="300" height="200" fill="#f5e9d6" />
    {/* the view outside */}
    <rect x="34" y="10" width="232" height="172" fill="#d4ebf7" />
    <path d="M34 140 Q100 118 170 134 Q220 124 266 132 V182 H34 Z" fill="#c5e0ab" />
    <path d="M34 158 Q120 146 200 158 Q240 152 266 156 V182 H34 Z" fill="#b2d595" />
    <path d="M60 46 q3 -10 14 -7 q6 -9 15 -2 q10 -1 8 9 Z" fill="#fff" stroke="#bcd6e6" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M200 30 q2 -7 10 -5 q4 -6 10 -1 q7 0 6 6 Z" fill="#fff" stroke="#bcd6e6" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M232 140 V108" stroke="#a07850" strokeWidth="7" strokeLinecap="round" />
    <circle cx="232" cy="90" r="24" fill="#a9d18e" />
    <circle cx="218" cy="98" r="14" fill="#9cc782" />
    <circle cx="246" cy="98" r="14" fill="#9cc782" />
    {/* the window's frame */}
    <rect x="34" y="10" width="232" height="172" fill="none" stroke="#fffaf0" strokeWidth="12" />
    <path d="M40 54 H260" stroke="#fffaf0" strokeWidth="6" />
    <path d="M40 51 H260 M40 57 H260" stroke={OUT} strokeWidth="1.5" />
    <rect x="28" y="4" width="244" height="184" fill="none" {...LINE} />
    <rect x="40" y="16" width="220" height="166" fill="none" {...THIN} />
    {/* the curtains */}
    {curtain(-4, 0, 186, 46, "left", "#c9dcef", "#a9c4e0")}
    {curtain(258, 0, 186, 46, "right", "#c9dcef", "#a9c4e0")}
    <path d="M-4 1 H304" {...LINE} />
    {/* the sill */}
    <rect x="-4" y="194" width="308" height="10" fill="#e9dcc8" {...LINE} />
    <rect x="-4" y="184" width="308" height="11" rx="2" fill="#fffaf0" {...LINE} />
  </>
);

/** A workshop: a pegboard wall, a lamp hanging at the left, a cabinet of little drawers at the right, the workbench. */
const werkstatt = () => (
  <>
    <rect width="300" height="200" fill="#f0dfc3" />
    <g fill="#ddc39b">
      {Array.from({ length: 26 * 13 }, (_, i) => (
        <circle key={i} cx={6 + (i % 26) * 12} cy={8 + Math.floor(i / 26) * 12} r="1.3" />
      ))}
    </g>
    {/* the lamp hanging from the ceiling */}
    <path d="M52 -2 V24" stroke={OUT} strokeWidth="2.5" />
    <path d="M30 46 Q30 24 52 24 Q74 24 74 46 Z" fill="#9fc58a" {...LINE} />
    <path d="M38 40 Q40 30 50 28" stroke="#c4dfb3" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M30 46 L10 150 H94 L74 46 Z" fill="#fff6d6" opacity="0.45" />
    {/* the cabinet of little drawers on its shelf */}
    <rect x="214" y="104" width="86" height="7" rx="2" fill="#c08a55" {...LINE} />
    <rect x="222" y="48" width="70" height="56" rx="3" fill="#a9c4dc" {...LINE} />
    {[0, 1, 2].map((row) =>
      [0, 1, 2].map((col) => (
        <g key={`${row}-${col}`}>
          <rect x={227 + col * 21} y={53 + row * 16} width="18" height="13" rx="2" fill="#cfe0ee" {...THIN} />
          <path d={`M${233 + col * 21} ${60 + row * 16} h6`} stroke={OUT} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )),
    )}
    {/* the workbench */}
    <rect x="-4" y="166" width="308" height="40" fill="#8f6a4a" />
    <path d="M20 168 V200 M280 168 V200" stroke="#6e4f36" strokeWidth="14" />
    <path d="M-4 186 H304" stroke="#7b5a3e" strokeWidth="5" />
    <rect x="-4" y="152" width="308" height="16" fill="#cf9a62" {...LINE} />
    <path d="M0 160 H300" stroke="#b9844f" strokeWidth="1.6" />
    <path d="M70 152 V168 M190 152 V168" stroke="#b9844f" strokeWidth="1.6" />
  </>
);

/** A Kita room: a blank board at the left with a little table and chair under it, a window and a shelf of boxes at the right. */
const schule = () => (
  <>
    <rect width="300" height="200" fill="#eef3df" />
    <rect y="0" width="300" height="12" fill="#e2ebcd" />
    {skirting(166)}
    {/* the floor */}
    <rect y="166" width="300" height="34" fill="#d9e2ea" />
    <path d="M0 180 H300 M0 192 H300" stroke="#c7d2dc" strokeWidth="1.6" />
    <path d="M0 166 H300" {...LINE} />
    {/* the blank board */}
    <rect x="8" y="22" width="76" height="62" rx="3" fill="#c7925e" {...LINE} />
    <rect x="13" y="27" width="66" height="52" fill="#6f9a7f" />
    <path d="M20 38 Q30 34 40 36" stroke="#8fb39c" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="13" y="27" width="66" height="52" fill="none" {...THIN} />
    <rect x="6" y="82" width="80" height="6" rx="2" fill="#c7925e" {...THIN} />
    {/* the little table and chair */}
    <path d="M52 166 V136 M78 166 V136" stroke={OUT} strokeWidth="6" strokeLinecap="round" />
    <path d="M52 166 V136 M78 166 V136" stroke="#f0b35a" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="42" y="128" width="46" height="9" rx="3" fill="#f6c76d" {...LINE} />
    <path d="M14 110 V166 M34 146 V166" stroke={OUT} strokeWidth="6" strokeLinecap="round" />
    <path d="M14 110 V166 M34 146 V166" stroke="#7fb3dd" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="10" y="112" width="18" height="20" rx="3" fill="#9cc6e8" {...THIN} />
    <rect x="10" y="140" width="30" height="8" rx="3" fill="#9cc6e8" {...THIN} />
    {/* the window */}
    {windowAt(226, 16, 58, 56)}
    {/* the shelf of boxes */}
    <rect x="216" y="92" width="80" height="74" fill="#e8c493" {...LINE} />
    <path d="M216 129 H296 M243 92 V166 M269 92 V166" {...THIN} />
    {[
      [221, 108, "#f4a3a3"],
      [247, 108, "#a8d8b0"],
      [273, 108, "#a9c9ef"],
      [221, 145, "#ffd98a"],
      [247, 145, "#d4b3e6"],
      [273, 145, "#f4a3a3"],
    ].map(([x, y, fill]) => (
      <rect key={`${x}-${y}`} x={x as number} y={y as number} width="18" height="18" rx="2" fill={fill as string} {...THIN} />
    ))}
  </>
);

export const HOME_BACKDROPS = {
  bad,
  kueche,
  esstisch,
  wohnzimmer,
  schlafzimmer,
  kinderzimmer,
  flur,
  hausfront,
  maltisch,
  fensterbank,
  werkstatt,
  schule,
} satisfies Partial<Record<BackdropId, () => ReactNode>>;
