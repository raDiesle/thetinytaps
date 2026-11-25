import { memo, type ReactNode, useId } from "react";
import { MASCOT_INK as INK } from "@/components/Mascot";
import { type Dressing, FLOORS, type Pattern, colorOf, dressingOf, floorOf } from "./floors";
import { EAVE, type HouseLayout, ROOF, floorBottom, roofTop } from "./layout";
import { ROW } from "./names";

// The Counting Tower's drawings. The sky, meadow and trees are one big svg drawn once (`Backdrop`); every block, beam,
// the roof and the crane's hook is a small svg on an HTML layer of its own, and what moves in a block as it lands (its
// ears coming up, its crown coming down) is a still smaller layer inside it – so a phone only ever moves
// layers and never paints the big picture again (root CLAUDE.md, phones).

/** The light on a block's top edge and the shade along its foot, so it looks like a wooden toy block, not a flat box. */
function Shading() {
  return (
    <>
      <path d="M14 10 H86" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
      <path d="M10 90 Q50 96 90 90" stroke={INK} strokeWidth="5" fill="none" opacity="0.14" strokeLinecap="round" />
    </>
  );
}

/** A small star of five points round (cx, cy). */
const starPath = (cx: number, cy: number, r: number) =>
  `${Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const d = i % 2 ? r * 0.45 : r;
    return `${i ? "L" : "M"}${(cx + d * Math.cos(a)).toFixed(1)} ${(cy + d * Math.sin(a)).toFixed(1)}`;
  }).join(" ")} Z`;

/** A small heart round (cx, cy). */
const heartPath = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy + r * 0.9} C${cx - r * 1.6} ${cy - r * 0.2} ${cx - r * 0.7} ${cy - r * 1.4} ${cx} ${cy - r * 0.5} C${cx + r * 0.7} ${cy - r * 1.4} ${cx + r * 1.6} ${cy - r * 0.2} ${cx} ${cy + r * 0.9} Z`;

/** What a floor paints on its plain blocks, in white or ink over the block's colour. */
function PatternArt({ pattern, n }: { pattern: Pattern; n: number }) {
  const odd = n % 2 === 1;
  switch (pattern) {
    case "bricks":
      return (
        <g stroke="#fff" strokeWidth="3" opacity="0.4" fill="none">
          <path d="M6 34 H94 M6 66 H94" />
          <path d={odd ? "M50 6 V34 M28 34 V66 M72 34 V66 M50 66 V94" : "M30 6 V34 M70 6 V34 M50 34 V66 M30 66 V94 M70 66 V94"} />
        </g>
      );
    case "dots":
      return (
        <g fill="#fff" opacity="0.45">
          {[
            [20, 22],
            [78, 26],
            [16, 76],
            [82, 80],
            [50, 14],
            [50, 88],
          ].map(([x, y]) => (
            <circle key={`${x} ${y}`} cx={x} cy={y} r="5" />
          ))}
        </g>
      );
    case "stones":
      return (
        <g fill="none" stroke={INK} strokeWidth="3" opacity="0.2">
          <path d="M8 30 Q20 18 36 24 Q44 32 34 40 Q18 44 8 36 Z" />
          <path d="M64 12 Q80 8 90 18 Q92 30 80 32 Q66 30 64 12 Z" />
          <path d="M70 66 Q84 60 92 72 Q90 88 76 88 Q64 82 70 66 Z" />
          <path d="M10 70 Q22 62 30 74 Q28 88 16 90 Q6 84 10 70 Z" />
        </g>
      );
    case "stripes":
      return (
        <g stroke="#fff" strokeWidth="7" opacity="0.35">
          <path d="M-10 40 L40 -10 M-10 80 L80 -10 M20 110 L110 20 M60 110 L110 60" />
        </g>
      );
    case "stars":
      return (
        <g fill="#fff" opacity="0.5">
          <path d={starPath(20, 22, 9)} />
          <path d={starPath(80, 20, 7)} />
          <path d={starPath(18, 80, 7)} />
          <path d={starPath(82, 78, 9)} />
        </g>
      );
    case "planks":
      return (
        <g stroke={INK} strokeWidth="3" opacity="0.22" fill={INK}>
          <path d="M34 6 V94 M66 6 V94" fill="none" />
          <circle cx="20" cy="14" r="2.5" stroke="none" />
          <circle cx="50" cy="86" r="2.5" stroke="none" />
          <circle cx="80" cy="14" r="2.5" stroke="none" />
        </g>
      );
    case "logs":
      return (
        <g stroke={INK} strokeWidth="3" fill="none" opacity="0.25">
          <path d="M6 33 Q50 38 94 33 M6 66 Q50 71 94 66" />
          <path d="M20 18 Q34 14 46 20 M56 52 Q70 48 82 54 M22 82 Q34 78 44 84" />
        </g>
      );
    case "hearts":
      return (
        <g fill="#fff" opacity="0.5">
          <path d={heartPath(20, 22, 8)} />
          <path d={heartPath(80, 22, 6)} />
          <path d={heartPath(20, 80, 6)} />
          <path d={heartPath(80, 80, 8)} />
        </g>
      );
    case "glass":
      return (
        <g stroke="#fff" fill="none">
          <path d="M18 40 L40 18 M18 56 L56 18" strokeWidth="5" opacity="0.7" strokeLinecap="round" />
          <path d="M60 84 L84 60" strokeWidth="4" opacity="0.5" strokeLinecap="round" />
        </g>
      );
    case "rainbow":
      return null;
  }
}

/** The face of every block, in its 100 × 100 box: the dressings reach round it and a little past the box. */
const FACE = { x: 4, y: 4, w: 92, h: 92, r: 12 };

/**
 * Every block's number: the same size, weight, colours and place on every block, and „?“ in that style on the block still
 * hanging from the hook (user feedback, 25 November 2026: the number is seen only once it is laid, and no block shows its
 * number smaller or otherwise than the others – a block differs only round it). Its zone, x 20–80 and y 30–78, stays
 * free of every dressing's front.
 */
function BlockNumber({ text }: { text: string }) {
  return (
    <text
      x="50"
      y="55"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="46"
      fontWeight="900"
      fontFamily="inherit"
      letterSpacing="-1"
      fill="#fff"
      stroke={INK}
      strokeWidth="7"
      paintOrder="stroke"
      strokeLinejoin="round"
    >
      {text}
    </text>
  );
}

/** A dressing's parts: behind the face, on the face under the number, and in front of the face round the number. */
interface DressParts {
  back?: ReactNode;
  inside?: ReactNode;
  front?: ReactNode;
}

/** Two of a thing, the second mirrored at the block's middle. */
const pair = (part: ReactNode) => (
  <>
    {part}
    <g transform="translate(100 0) scale(-1 1)">{part}</g>
  </>
);

/** What a dressing draws, in the block's 100 × 100 (its face 4–96), the block's own colour `c` where it is part of it. */
function dressParts(dressing: Dressing, c: string): DressParts {
  const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (dressing) {
    case "cat":
      return {
        back: pair(
          <>
            <path d="M5 34 L11 -20 L45 8 Z" fill={c} {...line} strokeWidth={3.5} />
            <path d="M14 20 L16 -7 L34 9 Z" fill="#ffb3c6" />
          </>,
        ),
        front: pair(<path d="M-3 58 L18 63 M-3 70 L18 69 M-1 82 L18 75" stroke={INK} strokeWidth="3" strokeLinecap="round" />),
      };
    case "bear":
      return {
        back: pair(
          <>
            <circle cx="20" cy="2" r="19" fill={c} {...line} strokeWidth={3.5} />
            <circle cx="20" cy="2" r="10" fill="#f1d7a4" />
          </>,
        ),
      };
    case "bunny":
      return {
        back: pair(
          <g transform="rotate(-12 32 8)">
            <ellipse cx="32" cy="-2" rx="10" ry="21" fill="#fff" {...line} strokeWidth={3.5} />
            <ellipse cx="32" cy="0" rx="4.5" ry="14" fill="#ffb3c6" />
          </g>,
        ),
      };
    case "frog":
      return {
        back: pair(<circle cx="26" cy="2" r="18" fill={c} {...line} strokeWidth={3.5} />),
        front: pair(
          <>
            <circle cx="26" cy="1" r="11.5" fill="#fff" stroke={INK} strokeWidth="2.5" />
            <circle cx="28" cy="3" r="5.5" fill={INK} />
            <circle cx="26" cy="1" r="1.8" fill="#fff" />
          </>,
        ),
      };
    case "headphones":
      return {
        front: (
          <>
            <path d="M12 46 Q10 -16 50 -16 Q90 -16 88 46" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
            <path d="M12 46 Q10 -16 50 -16 Q90 -16 88 46" fill="none" stroke="#868e96" strokeWidth="6" strokeLinecap="round" />
            {pair(
              <>
                <rect x="-3" y="38" width="19" height="34" rx="8" fill="#e64980" {...line} />
                <rect x="1" y="44" width="7" height="22" rx="3.5" fill="#fff" opacity="0.45" />
              </>,
            )}
          </>
        ),
      };
    case "crown":
      return {
        front: (
          <>
            <path d="M26 14 L26 -14 L38 -1 L50 -20 L62 -1 L74 -14 L74 14 Z" fill="#fcc419" {...line} />
            <rect x="24" y="8" width="52" height="9" rx="3" fill="#f59f00" {...line} strokeWidth={2.5} />
            <circle cx="50" cy="-8" r="4" fill="#e03131" stroke={INK} strokeWidth="1.5" />
            <circle cx="36" cy="12.5" r="2.6" fill="#4dabf7" />
            <circle cx="64" cy="12.5" r="2.6" fill="#51cf66" />
          </>
        ),
      };
    case "wheels":
      return {
        front: (
          <>
            {pair(
              <>
                <circle cx="24" cy="96" r="13" fill="#343a40" {...line} />
                <circle cx="24" cy="96" r="5" fill="#ced4da" stroke={INK} strokeWidth="2" />
              </>,
            )}
            <circle cx="93" cy="60" r="6" fill="#ffe066" stroke={INK} strokeWidth="2.5" />
          </>
        ),
      };
    case "spikes":
      return {
        back: (
          <path
            d="M2 46 L-6 36 L3 28 L-6 16 L8 12 L4 -4 L20 4 L24 -12 L36 2 L44 -14 L52 2 L62 -14 L68 2 L80 -10 L82 6 L98 -2 L94 14 L106 18 L97 28 L106 36 L98 46 Z"
            fill="#8b5a2b"
            {...line}
          />
        ),
      };
    case "dino":
      return {
        back: (
          <>
            {[
              [18, 16],
              [39, 24],
              [61, 24],
              [82, 16],
            ].map(([x, h]) => (
              <path key={x} d={`M${x - 11} 10 Q${x - 6} ${-h} ${x} ${-h - 2} Q${x + 6} ${-h} ${x + 11} 10 Z`} fill="#20c997" {...line} />
            ))}
          </>
        ),
      };
    case "flowers":
      return {
        back: (
          <>
            {(
              [
                [24, -6, "#ff6b6b"],
                [50, -14, "#ffd43b"],
                [76, -6, "#748ffc"],
              ] as const
            ).map(([x, y, color]) => (
              <g key={x}>
                <path d={`M${x} 12 V${y}`} stroke="#2f9e44" strokeWidth="4" />
                <path d={`M${x} ${y + 14} q8 -8 12 -2 q-6 6 -12 2 Z`} fill="#51cf66" stroke={INK} strokeWidth="1.5" />
                {[0, 72, 144, 216, 288].map((a) => (
                  <circle
                    key={a}
                    cx={x + 6 * Math.cos((a * Math.PI) / 180)}
                    cy={y + 6 * Math.sin((a * Math.PI) / 180)}
                    r="5"
                    fill={color}
                    stroke={INK}
                    strokeWidth="1.5"
                  />
                ))}
                <circle cx={x} cy={y} r="3.5" fill="#fff3bf" stroke={INK} strokeWidth="1.2" />
              </g>
            ))}
          </>
        ),
      };
    case "water":
      return {
        inside: (
          <>
            <path d="M0 62 Q12 54 24 62 T48 62 T72 62 T96 62 T120 62 V100 H0 Z" fill="#339af0" opacity="0.9" />
            <path d="M0 62 Q12 54 24 62 T48 62 T72 62 T96 62 T120 62" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
            <circle cx="14" cy="40" r="3.5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
            <circle cx="86" cy="30" r="4.5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
            <circle cx="88" cy="44" r="2.5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.8" />
          </>
        ),
        front: (
          <g strokeLinejoin="round" stroke={INK} strokeWidth="2">
            <path d="M4 86 Q11 78 18 86 Q11 94 4 86 Z" fill="#ff922b" />
            <path d="M17 86 L24 81 L24 91 Z" fill="#ff922b" />
            <circle cx="8.5" cy="85" r="1.4" fill={INK} stroke="none" />
          </g>
        ),
      };
    case "antennae":
      return {
        back: pair(
          <>
            <path d="M34 10 L22 -14" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="22" cy="-15" r="6.5" fill="#ff6b6b" stroke={INK} strokeWidth="2.5" />
          </>,
        ),
        front: pair(
          <>
            <circle cx="10" cy="22" r="3.5" fill="#ced4da" stroke={INK} strokeWidth="1.8" />
            <circle cx="10" cy="86" r="3.5" fill="#ced4da" stroke={INK} strokeWidth="1.8" />
          </>,
        ),
      };
    case "bowtie":
      return {
        front: (
          <>
            <path d="M50 85 L25 74 Q20 85 25 96 Z M50 85 L75 74 Q80 85 75 96 Z" fill="#e03131" {...line} strokeWidth={2.5} />
            <path d="M31 80 L31 90 M69 80 L69 90" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <circle cx="50" cy="85" r="6.5" fill="#c92a2a" stroke={INK} strokeWidth="2.5" />
          </>
        ),
      };
    case "shoes":
      return {
        front: pair(
          <>
            <path d="M4 100 V92 Q4 82 16 82 H28 Q40 84 42 94 Q42 102 34 102 H8 Q4 102 4 100 Z" fill="#4263eb" {...line} strokeWidth={2.5} />
            <path d="M16 86 L24 90 M20 84 L27 88" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 98 H41" stroke="#fff" strokeWidth="2.5" opacity="0.8" />
          </>,
        ),
      };
    case "wings":
      return {
        back: pair(
          <>
            <path d="M24 16 Q4 18 -4 -16 Q8 -10 12 -20 Q18 -8 26 -12 Q34 2 24 16 Z" fill="#fff" {...line} />
            <path d="M8 -6 Q14 4 22 4 M14 -12 Q18 -2 24 -2" fill="none" stroke={INK} strokeWidth="1.8" opacity="0.5" />
          </>,
        ),
      };
    case "propeller":
      return {
        front: (
          <>
            <path d="M50 -4 V-14" stroke={INK} strokeWidth="3" />
            <ellipse cx="39" cy="-15" rx="11" ry="3.5" fill="#ffd43b" stroke={INK} strokeWidth="2" />
            <ellipse cx="61" cy="-15" rx="11" ry="3.5" fill="#ff6b6b" stroke={INK} strokeWidth="2" />
            <path d="M28 16 Q28 -6 50 -6 Q72 -6 72 16 Z" fill="#4dabf7" {...line} />
            <path d="M50 -6 Q42 4 42 16 M50 -6 Q58 4 58 16" fill="none" stroke="#fff" strokeWidth="3" opacity="0.7" />
            <path d="M70 16 Q88 10 94 18 Q84 22 70 20 Z" fill="#1c7ed6" {...line} strokeWidth={2.5} />
          </>
        ),
      };
    case "cake":
      return {
        front: (
          <>
            <rect x="45" y="-14" width="10" height="20" rx="2" fill="#fff" {...line} strokeWidth={2.5} />
            <path d="M45 -8 L55 -12 M45 -1 L55 -5" stroke="#f783ac" strokeWidth="3" />
            <path d="M50 -15 Q44 -22 50 -30 Q56 -22 50 -15 Z" fill="#ffa94d" stroke={INK} strokeWidth="2" />
            <path
              d="M4 18 V12 Q4 4 12 4 H88 Q96 4 96 12 V18 Q90 28 84 18 Q78 30 70 18 Q62 26 56 18 Q50 30 42 18 Q36 26 30 18 Q22 30 16 18 Q10 26 4 18 Z"
              fill="#fff0f6"
              {...line}
              strokeWidth={2.5}
            />
            {(
              [
                [14, 10, "#ff6b6b", 30],
                [30, 9, "#4dabf7", -30],
                [64, 10, "#51cf66", 30],
                [80, 9, "#fcc419", -30],
              ] as const
            ).map(([x, y, color, turn]) => (
              <rect key={x} x={x} y={y} width="6" height="2.6" rx="1.3" fill={color} transform={`rotate(${turn} ${x} ${y})`} />
            ))}
          </>
        ),
      };
    case "gift":
      return {
        inside: (
          <>
            <rect x="43" y="0" width="14" height="100" fill="#fff" opacity="0.8" />
            <rect x="0" y="45" width="100" height="14" fill="#fff" opacity="0.8" />
          </>
        ),
        front: (
          <>
            {pair(<path d="M50 6 Q30 -18 24 -2 Q24 10 50 6 Z" fill="#fa5252" {...line} strokeWidth={2.5} />)}
            <circle cx="50" cy="5" r="6" fill="#e03131" stroke={INK} strokeWidth="2.5" />
          </>
        ),
      };
    case "lights":
      return {
        front: (
          <>
            {[
              [14, 4],
              [32, 4],
              [50, 4],
              [68, 4],
              [86, 4],
              [96, 22],
              [96, 40],
              [96, 58],
              [96, 76],
              [86, 96],
              [68, 96],
              [50, 96],
              [32, 96],
              [14, 96],
              [4, 76],
              [4, 58],
              [4, 40],
              [4, 22],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4.8" fill={["#ffe066", "#ff8787", "#74c0fc", "#8ce99a"][i % 4]} stroke={INK} strokeWidth="1.8" />
            ))}
          </>
        ),
      };
    case "nest":
      return {
        front: (
          <>
            <circle cx="52" cy="-6" r="10" fill="#ffd43b" {...line} strokeWidth={2.5} />
            <path d="M61 -7 L69 -4 L61 -1 Z" fill="#ff922b" stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="55" cy="-9" r="1.8" fill={INK} />
            <ellipse cx="50" cy="6" rx="26" ry="9" fill="#a9714b" {...line} strokeWidth={2.5} />
            <path d="M28 4 Q40 10 52 4 M48 8 Q62 12 72 5 M32 10 L44 6" fill="none" stroke="#5c3d22" strokeWidth="2" />
          </>
        ),
      };
  }
}

/**
 * One block of the house: its floor's colour and pattern, its dressing round it (`dressingOf`) and its number – or „?“
 * while it still hangs from the crane's hook (`hidden`). The dressing's parts behind and in front of the face are
 * layers of their own (`.zt-dress`), which the game moves once as the block lands.
 */
export const HouseBlock = memo(function HouseBlock({ n, hidden = false }: { n: number; hidden?: boolean }) {
  const clip = useId();
  const color = colorOf(n);
  const { pattern } = FLOORS[floorOf(n)];
  const parts = dressParts(dressingOf(n), color);
  return (
    <>
      {parts.back && <DressLayer side="back">{parts.back}</DressLayer>}
      <svg className="zt-art" viewBox="0 0 100 100" aria-hidden>
        <defs>
          <clipPath id={clip}>
            <rect x={FACE.x} y={FACE.y} width={FACE.w} height={FACE.h} rx={FACE.r} />
          </clipPath>
        </defs>
        <rect x={FACE.x} y={FACE.y} width={FACE.w} height={FACE.h} rx={FACE.r} fill={color} />
        <g clipPath={`url(#${clip})`}>
          <PatternArt pattern={pattern} n={n} />
          {parts.inside}
        </g>
        <Shading />
        <rect x={FACE.x} y={FACE.y} width={FACE.w} height={FACE.h} rx={FACE.r} fill="none" stroke={INK} strokeWidth="4.5" />
        <BlockNumber text={hidden ? "?" : String(n)} />
      </svg>
      {parts.front && <DressLayer side="front">{parts.front}</DressLayer>}
    </>
  );
});

/** A dressing's part behind or in front of a block's face, on a layer of its own so it can come as the block lands. */
function DressLayer({ side, children }: { side: "back" | "front"; children: ReactNode }) {
  return (
    <div className={`zt-dress zt-dress-${side}`}>
      <svg className="zt-art" viewBox="0 0 100 100" aria-hidden>
        {children}
      </svg>
    </div>
  );
}

/** The wooden beam laid over a full floor, `w` × `h` pixels, with its grain and a bolt over every block. */
export const Beam = memo(function Beam({ w, h, s, color }: { w: number; h: number; s: number; color: string }) {
  const bolts = Math.floor(w / s);
  return (
    <svg className="zt-art" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx={h * 0.35} fill={color} stroke={INK} strokeWidth="3" />
      <path d={`M${h} ${h * 0.32} H${w - h}`} stroke="#fff" strokeWidth={h * 0.14} strokeLinecap="round" opacity="0.45" />
      <path
        d={`M${w * 0.2} ${h * 0.62} Q${w * 0.3} ${h * 0.5} ${w * 0.42} ${h * 0.64} M${w * 0.6} ${h * 0.6} Q${w * 0.72} ${h * 0.5} ${w * 0.84} ${h * 0.62}`}
        stroke={INK}
        strokeWidth="2"
        fill="none"
        opacity="0.25"
      />
      {Array.from({ length: bolts }, (_, i) => (
        <circle key={i} cx={(i + 0.5) * (w / bolts)} cy={h / 2} r={h * 0.12} fill="#fff" stroke={INK} strokeWidth="1.5" opacity="0.8" />
      ))}
    </svg>
  );
});

/** The crane's hook with its pulley and the two straps holding a block, `1` block wide and `HOOK` blocks high. */
export const HOOK = 0.7;
export const Hook = memo(function Hook() {
  return (
    <svg className="zt-art" viewBox="0 0 100 70" aria-hidden>
      <path d="M50 34 L10 70 M50 34 L90 70" stroke="#5c4a3a" strokeWidth="3" />
      <rect x="36" y="0" width="28" height="22" rx="5" fill="#fab005" stroke={INK} strokeWidth="3" />
      <circle cx="50" cy="11" r="5" fill="#fff3bf" stroke={INK} strokeWidth="2" />
      <path d="M50 22 V28 Q50 38 42 36" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
});

/** The roof put on at a hundred: red tiles, a round window in its gable and the chimney. `w` × `h` pixels. */
export const Roof = memo(function Roof({ w, h }: { w: number; h: number }) {
  const rows = 4;
  return (
    <svg className="zt-art" viewBox={`0 0 ${w} ${h}`} overflow="visible" aria-hidden>
      {/* The chimney behind the slope: it stands at about three quarters, its top above the slope. */}
      <rect x={w * 0.7} y={h * 0.18} width={w * 0.07} height={h * 0.5} fill="#c92a2a" stroke={INK} strokeWidth="3" />
      <rect x={w * 0.69} y={h * 0.14} width={w * 0.09} height={h * 0.08} rx="3" fill="#868e96" stroke={INK} strokeWidth="3" />
      <path d={`M2 ${h - 2} L${w / 2} 3 L${w - 2} ${h - 2} Z`} fill="#fa5252" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {Array.from({ length: rows }, (_, i) => {
        const y = h * ((i + 1) / (rows + 1)) + h * 0.12;
        const half = (w / 2) * (y / h);
        return <path key={i} d={`M${w / 2 - half + 8} ${y} H${w / 2 + half - 8}`} stroke="#c92a2a" strokeWidth="3" opacity="0.7" />;
      })}
      <circle cx={w / 2} cy={h * 0.58} r={h * 0.15} fill="#ffe066" stroke="#fffaf0" strokeWidth="5" />
      <circle cx={w / 2} cy={h * 0.58} r={h * 0.15} fill="none" stroke={INK} strokeWidth="2.5" />
      <path d={`M${w / 2} ${h * 0.43} V${h * 0.73} M${w / 2 - h * 0.15} ${h * 0.58} H${w / 2 + h * 0.15}`} stroke="#fffaf0" strokeWidth="3.5" />
      <path d={`M0 ${h - 4} H${w}`} stroke="#fffaf0" strokeWidth="5" opacity="0.6" />
    </svg>
  );
});

/** The flag raised on the roof's ridge at a hundred: its pole and a pennant, 40 × 100. */
export const Flag = memo(function Flag() {
  return (
    <svg className="zt-art" viewBox="0 0 40 100" aria-hidden>
      <path d="M6 4 V100" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M8 6 L38 18 L8 32 Z" fill="#fcc419" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
});

/** A puff of smoke from the chimney. */
export const Puff = memo(function Puff() {
  return (
    <svg className="zt-art" viewBox="0 0 60 44" aria-hidden>
      <path d="M12 38 Q2 38 4 28 Q4 18 16 20 Q18 6 32 8 Q46 4 48 18 Q58 20 56 30 Q56 40 44 38 Z" fill="#f1f3f5" stroke="#adb5bd" strokeWidth="2.5" />
    </svg>
  );
});

/** The sky's colours from the top of the world (night over the roof) down to the meadow (a bright day). */
const SKY = ["#141b45", "#26306e", "#5b4b9a", "#f08c7a", "#ffc9a0", "#a5d8ff", "#d3f0ff"];

/**
 * The world behind the house, drawn once: the sky going from day at the meadow over the evening to the night with its
 * stars and the moon above the roof, clouds on the way up, the meadow with two trees. It
 * reaches far past the screen on every side, so the whole house zoomed out at the end still stands in it.
 */
export const Backdrop = memo(function Backdrop({ layout: l }: { layout: HouseLayout }) {
  const { w, h, s, ground } = l;
  const left = -1.5 * w;
  const width = 4 * w;
  const height = l.worldH + 3 * h;
  const roof = roofTop(l);
  const r0 = roof / ground;
  const stops = [0, r0 * 0.55, r0, r0 + (1 - r0) * 0.22, r0 + (1 - r0) * 0.5, r0 + (1 - r0) * 0.78, 1];
  const stars = Array.from({ length: 70 }, (_, i) => ({
    x: left + ((i * 0.618034) % 1) * width,
    y: ((i * 0.381966 * 1.7) % 1) * (roof + 2 * l.floorH),
    r: i % 5 === 0 ? 2.6 : 1.5,
  }));
  const cloud = (cx: number, cy: number, k: number, fill: string) => (
    <g key={`${cx} ${cy}`} transform={`translate(${cx} ${cy}) scale(${(k * s) / 40})`} fill={fill} opacity="0.92">
      <ellipse cx="0" cy="0" rx="40" ry="18" />
      <ellipse cx="-22" cy="-8" rx="20" ry="16" />
      <ellipse cx="14" cy="-14" rx="24" ry="20" />
    </g>
  );
  const at = (f: number) => floorBottom(l, f);
  const right = l.x0 + (ROW + 0.2) * s;
  const tree = (x: number, k: number) => (
    <g key={x} transform={`translate(${x} ${ground}) scale(${(k * s) / 100})`}>
      <path d="M-9 0 V-90 H9 V0 Z" fill="#8b5a2b" stroke={INK} strokeWidth="4" />
      <circle cx="0" cy="-130" r="58" fill="#51cf66" stroke={INK} strokeWidth="4" />
      <circle cx="-26" cy="-148" r="12" fill="#ff6b6b" />
      <circle cx="22" cy="-112" r="10" fill="#ff6b6b" />
    </g>
  );
  return (
    <svg className="zt-backdrop" viewBox={`${left} 0 ${width} ${height}`} style={{ left, width, height }} aria-hidden>
      <defs>
        <linearGradient id="zt-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={ground}>
          {SKY.map((color, i) => (
            <stop key={color} offset={stops[i]} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect x={left} y="0" width={width} height={height} fill="url(#zt-sky)" />
      {stars.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#fff" opacity={p.y < roof ? 0.9 : 0.45} />
      ))}
      {/* The moon, right above the roof's chimney side. */}
      <g transform={`translate(${l.x0 + 8.6 * s} ${roof - 0.25 * h})`}>
        <circle r={0.75 * s} fill="#fff3bf" stroke="#ffe066" strokeWidth="3" />
        <circle cx={-0.25 * s} cy={-0.15 * s} r={0.13 * s} fill="#ffe8a3" />
        <circle cx={0.2 * s} cy={0.25 * s} r={0.18 * s} fill="#ffe8a3" />
      </g>
      {cloud(l.x0 - 0.4 * s, at(2) + 0.3 * l.floorH, 1.2, "#fff")}
      {cloud(right + 0.2 * s, at(4), 1.1, "#fff")}
      {cloud(l.x0 + 0.6 * s, at(6) - 0.2 * l.floorH, 1, "#fff4e6")}
      {cloud(right - 0.6 * s, at(8), 1.2, "#ffe3e3")}
      {cloud(left + 0.3 * width, at(3), 1.6, "#fff")}
      {cloud(left + 0.75 * width, at(5), 1.5, "#fff")}
      {tree(l.beamLeft - 1.6 * s, 1.6)}
      {tree(right + 2.2 * s, 1.9)}
      {/* The meadow, rolling far to both sides. */}
      <path
        d={`M${left} ${ground - 0.05 * s} Q${left + width * 0.25} ${ground - 0.5 * s} ${left + width * 0.5} ${ground - 0.08 * s} T${left + width} ${ground - 0.2 * s} V${height} H${left} Z`}
        fill="#8ce99a"
      />
      <path
        d={`M${left} ${ground + 0.5 * s} Q${left + width * 0.5} ${ground + 0.2 * s} ${left + width} ${ground + 0.6 * s} V${height} H${left} Z`}
        fill="#69db7c"
      />
      {/* The house's footing. */}
      <rect x={l.beamLeft} y={ground - 1} width={right - l.beamLeft} height={0.22 * s} rx="4" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      {[-0.9, 1.3, 2.4, 6.8, 8.2, 11.2].map((d, i) => (
        <g key={d} transform={`translate(${l.x0 + d * s} ${ground + (0.45 + (i % 2) * 0.2) * s})`}>
          <path d={`M0 0 V${-0.2 * s}`} stroke="#2f9e44" strokeWidth="3" />
          <circle cy={-0.24 * s} r={0.08 * s} fill={["#ff6b6b", "#ffd43b", "#f783ac", "#748ffc", "#ff922b", "#fff"][i]} stroke={INK} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
});

/** The roof's box in world pixels: over the floors with its eaves, its foot on the top beam. */
export function roofBox(l: HouseLayout) {
  const left = l.x0 - EAVE * l.s;
  const width = (ROW + 2 * EAVE) * l.s;
  const height = ROOF * l.s;
  return { left, top: roofTop(l), width, height };
}
