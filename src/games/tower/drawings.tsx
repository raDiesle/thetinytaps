import { type CSSProperties, memo, type ReactNode } from "react";
import { MASCOT_INK as INK } from "@/components/Mascot";
import { FLOORS, type Pattern, type Special, colorOf, floorOf, specialOf } from "./floors";
import { EAVE, type HouseLayout, ROOF, floorBottom, roofTop } from "./layout";
import { ROW } from "./names";

// The Counting Tower's drawings. The sky, meadow and trees are one big svg drawn once (`Backdrop`); every block, beam,
// the roof and the crane's hook is a small svg on an HTML layer of its own, and what moves in a block as it lands (a
// light going on, the cat coming up, the door opening) is a still smaller layer inside it – so a phone only ever moves
// layers and never paints the big picture again (root CLAUDE.md, phones).

/** A plate with a number on it, for the specials (the plain blocks carry theirs big). */
function Plate({ n, y = 68, h = 28 }: { n: number; y?: number; h?: number }) {
  return (
    <>
      <rect x="20" y={y} width="60" height={h} rx="8" fill="#fffaf0" stroke={INK} strokeWidth="3.5" />
      <text x="50" y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="central" fontSize={h * 0.92} fontWeight="900" fontFamily="inherit" fill={INK}>
        {n}
      </text>
    </>
  );
}

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

/** A plain block of its floor: its colour, the floor's pattern and its number big on its front; each ten's last sparkles. */
function PlainBlock({ n }: { n: number }) {
  const { pattern } = FLOORS[floorOf(n)];
  return (
    <svg className="zt-art" viewBox="0 0 100 100" aria-hidden>
      <rect x="3" y="3" width="94" height="94" rx="11" fill={colorOf(n)} />
      <PatternArt pattern={pattern} n={n} />
      <Shading />
      {n % ROW === 0 && <path d="M14 50 l5 -10 l5 10 l-5 10 Z M76 50 l5 -10 l5 10 l-5 10 Z" fill="#fff" opacity="0.85" />}
      <rect x="3" y="3" width="94" height="94" rx="11" fill="none" stroke={INK} strokeWidth="4.5" />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={n >= 100 ? 40 : 54}
        fontWeight="900"
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
}

/** Where a special's moving part lies in its block (in the block's 100 × 100), and whether it is cut round. */
interface ActorBox {
  x: number;
  y: number;
  w: number;
  h: number;
  round?: boolean;
}

/** The window's opening in a block: the light, the cat, the dog and the flowers live in it. */
const WINDOW: ActorBox = { x: 22, y: 12, w: 56, h: 48 };

/** Each special's moving part. */
const ACTOR: Record<Special, ActorBox> = {
  window: WINDOW,
  cat: WINDOW,
  dog: WINDOW,
  flowers: { x: 18, y: 30, w: 64, h: 34 },
  door: { x: 27, y: 33, w: 46, h: 64 },
  birdhouse: { x: 38, y: 32, w: 24, h: 24, round: true },
  fish: { x: 25, y: 11, w: 50, h: 50, round: true },
  heart: { x: 0, y: 0, w: 100, h: 66 },
  star: { x: 0, y: 0, w: 100, h: 66 },
};

/** The block behind a special: its colour, the opening or the thing on it. */
function SpecialBack({ n, special }: { n: number; special: Special }) {
  const color = colorOf(n);
  const hole = (fill: string) => <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx="6" fill={fill} />;
  return (
    <svg className="zt-art" viewBox="0 0 100 100" aria-hidden>
      <rect x="3" y="3" width="94" height="94" rx="11" fill={color} />
      <Shading />
      {special === "window" && hole("#3b4a78")}
      {(special === "cat" || special === "dog" || special === "flowers") && hole("#ffe8a3")}
      {special === "door" && <path d="M27 97 V52 Q27 33 50 33 Q73 33 73 52 V97 Z" fill="#ffd8a8" />}
      {special === "birdhouse" && (
        <>
          <path d="M28 64 V34 L50 18 L72 34 V64 Z" fill="#f1d7a4" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="50" cy="44" r="11" fill="#3b2a1a" />
        </>
      )}
      {special === "fish" && (
        <>
          <circle cx="50" cy="36" r="25" fill="#74c0fc" />
          <circle cx="36" cy="26" r="3" fill="#fff" opacity="0.7" />
          <circle cx="40" cy="18" r="2" fill="#fff" opacity="0.7" />
        </>
      )}
      {special === "heart" && <path d={heartPath(50, 36, 20)} fill="#5a3d6b" />}
      {special === "star" && <path d={starPath(50, 35, 28)} fill="#3b4a78" />}
    </svg>
  );
}

/** A special's moving part, drawn in its own box (`ACTOR`), in the state it ends in once landed. */
function SpecialActor({ special }: { special: Special }) {
  const { w, h } = ACTOR[special];
  const art = (children: ReactNode) => (
    <svg className="zt-art" viewBox={`0 0 ${w} ${h}`} aria-hidden>
      {children}
    </svg>
  );
  switch (special) {
    case "window":
      return art(
        <>
          <rect width={w} height={h} fill="#ffe066" />
          <ellipse cx={w / 2} cy={h * 0.45} rx={w * 0.4} ry={h * 0.35} fill="#fff7d6" />
        </>,
      );
    case "cat":
      return art(
        <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <path d="M12 48 V22 L16 8 L24 18 H32 L40 8 L44 22 V48 Z" fill="#f59f00" />
          <path d="M18 30 h4 M34 30 h4" stroke="none" />
          <circle cx="21" cy="28" r="2.6" fill={INK} stroke="none" />
          <circle cx="35" cy="28" r="2.6" fill={INK} stroke="none" />
          <path d="M26 33 L28 35.5 L30 33 Z" fill="#e8590c" />
          <path d="M28 36 Q25 39 23 37 M28 36 Q31 39 33 37" fill="none" strokeWidth="1.8" />
          <path d="M8 33 H18 M8 37 H18 M38 33 H48 M38 37 H48" strokeWidth="1.4" />
        </g>,
      );
    case "dog":
      return art(
        <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <path d="M14 48 V24 Q14 10 28 10 Q42 10 42 24 V48 Z" fill="#d9a066" />
          <path d="M14 14 Q4 18 8 34 Q14 34 16 24 Z M42 14 Q52 18 48 34 Q42 34 40 24 Z" fill="#8b5a2b" />
          <circle cx="22" cy="24" r="2.6" fill={INK} stroke="none" />
          <circle cx="34" cy="24" r="2.6" fill={INK} stroke="none" />
          <ellipse cx="28" cy="32" rx="4.5" ry="3.2" fill={INK} />
          <path d="M28 35 V38 M24 38 Q28 44 32 38" fill="#ff8787" strokeWidth="2" />
        </g>,
      );
    case "flowers":
      return art(
        <g stroke={INK} strokeWidth="2">
          {[12, 26, 40, 54].map((x, i) => (
            <g key={x}>
              <path d={`M${x} ${h} V${12 + (i % 2) * 6}`} stroke="#2f9e44" strokeWidth="3" />
              <circle cx={x} cy={10 + (i % 2) * 6} r="6.5" fill={["#ff6b6b", "#ffd43b", "#f783ac", "#748ffc"][i]} />
              <circle cx={x} cy={10 + (i % 2) * 6} r="2.4" fill="#fff3bf" strokeWidth="1" />
            </g>
          ))}
        </g>,
      );
    case "door":
      return art(
        <>
          <path d={`M0 ${h} V19 Q0 0 ${w / 2} 0 Q${w} 0 ${w} 19 V${h} Z`} fill="#1c7ed6" stroke={INK} strokeWidth="3" />
          <rect x="8" y="16" width={w - 16} height="18" rx="4" fill="#4dabf7" stroke={INK} strokeWidth="2" />
          <rect x="8" y="40" width={w - 16} height="18" rx="4" fill="#4dabf7" stroke={INK} strokeWidth="2" />
          <circle cx={w - 9} cy="44" r="3.5" fill="#fcc419" stroke={INK} strokeWidth="1.5" />
        </>,
      );
    case "birdhouse":
      return art(
        <g stroke={INK} strokeWidth="2">
          <circle cx="12" cy="14" r="9" fill="#ffd43b" />
          <path d="M19 13 L24 15 L19 17 Z" fill="#ff922b" />
          <circle cx="14" cy="11" r="1.8" fill={INK} stroke="none" />
        </g>,
      );
    case "fish":
      return art(
        <g stroke={INK} strokeWidth="2.2" strokeLinejoin="round">
          <path d="M10 25 Q22 12 34 25 Q22 38 10 25 Z" fill="#ff922b" />
          <path d="M33 25 L44 17 L44 33 Z" fill="#ff922b" />
          <circle cx="17" cy="23" r="1.8" fill={INK} stroke="none" />
        </g>,
      );
    case "heart":
      return art(<path d={heartPath(50, 36, 20)} fill="#ff8fab" />);
    case "star":
      return art(<path d={starPath(50, 35, 28)} fill="#ffe066" />);
  }
}

/** What lies over a special's moving part: the window's frame and bars, the flower box, the door's frame, the plate. */
function SpecialFront({ n, special }: { n: number; special: Special }) {
  const frame = (bars: boolean) => (
    <>
      <rect x={WINDOW.x} y={WINDOW.y} width={WINDOW.w} height={WINDOW.h} rx="6" fill="none" stroke="#fffaf0" strokeWidth="5" />
      {bars && <path d={`M50 ${WINDOW.y} V${WINDOW.y + WINDOW.h} M${WINDOW.x} 36 H${WINDOW.x + WINDOW.w}`} stroke="#fffaf0" strokeWidth="4" />}
      <rect x={WINDOW.x - 3} y={WINDOW.y} width={WINDOW.w + 6} height={WINDOW.h} rx="6" fill="none" stroke={INK} strokeWidth="2.5" />
      <rect x="16" y="59" width="68" height="6" rx="3" fill="#fffaf0" stroke={INK} strokeWidth="2.5" />
    </>
  );
  return (
    <svg className="zt-art" viewBox="0 0 100 100" aria-hidden>
      {special === "window" && (
        <>
          {frame(true)}
          <path d="M24 14 Q30 26 24 38 Z M76 14 Q70 26 76 38 Z" fill="#f783ac" stroke={INK} strokeWidth="1.5" />
        </>
      )}
      {(special === "cat" || special === "dog") && frame(false)}
      {special === "flowers" && (
        <>
          {frame(true)}
          <rect x="16" y="56" width="68" height="12" rx="3" fill="#c0703a" stroke={INK} strokeWidth="2.5" />
        </>
      )}
      {special === "door" && (
        <>
          <path d="M27 97 V52 Q27 33 50 33 Q73 33 73 52 V97" fill="none" stroke={INK} strokeWidth="3.5" />
          <rect x="20" y="91" width="60" height="7" rx="2" fill="#ced4da" stroke={INK} strokeWidth="2.5" />
        </>
      )}
      {special === "birdhouse" && (
        <>
          <path d="M22 36 L50 14 L78 36" fill="none" stroke="#e03131" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 58 V66" stroke={INK} strokeWidth="3" />
        </>
      )}
      {special === "fish" && <circle cx="50" cy="36" r="25" fill="none" stroke="#f6c453" strokeWidth="6" />}
      {special === "heart" && <path d={heartPath(50, 36, 20)} fill="none" stroke="#fffaf0" strokeWidth="4.5" />}
      {special === "star" && <path d={starPath(50, 35, 28)} fill="none" stroke="#fffaf0" strokeWidth="4" strokeLinejoin="round" />}
      <rect x="3" y="3" width="94" height="94" rx="11" fill="none" stroke={INK} strokeWidth="4.5" />
      {special === "door" ? <Plate n={n} y={5} h={24} /> : <Plate n={n} />}
    </svg>
  );
}

/**
 * One block of the house, numbered: a plain block of its floor, or one of the house's specials – the door, a window, the
 * cat … – whose moving part (`.zt-actor`) the game moves once as it lands.
 */
export const HouseBlock = memo(function HouseBlock({ n }: { n: number }) {
  const special = specialOf(n);
  if (!special) return <PlainBlock n={n} />;
  const box = ACTOR[special];
  const style: CSSProperties = {
    left: `${box.x}%`,
    top: `${box.y}%`,
    width: `${box.w}%`,
    height: `${box.h}%`,
    borderRadius: box.round ? "50%" : undefined,
  };
  return (
    <>
      <SpecialBack n={n} special={special} />
      <div className="zt-hole" style={style}>
        <div className={`zt-actor zt-actor-${special}`}>
          <SpecialActor special={special} />
        </div>
      </div>
      <SpecialFront n={n} special={special} />
    </>
  );
});

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
 * stars and the moon above the roof, clouds on the way up, the meadow with the path to the door and two trees. It
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
  const door = l.x0 + 4.5 * s;
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
      {/* The path to the front door, the house's footing. */}
      <path d={`M${door - 0.3 * s} ${ground} L${door + 0.3 * s} ${ground} L${door + 0.9 * s} ${height} L${door - 0.9 * s} ${height} Z`} fill="#f1d7a4" />
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
