import { type CSSProperties, memo } from "react";
import { PyjamaPattern, topFill } from "@/games/teeth/clothes";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";
import type { StepId } from "./steps";

// The child's own hands, seen from above over the basin as the child sees them: the backs of the hands, fingers pointing
// away, the forearms coming up from the bottom of the screen in their sleeves. One hand is drawn (the left, its thumb on
// the right, towards the middle) and the right one is its mirror image. Every part that moves is an HTML layer of its
// own round its own little svg (root CLAUDE.md, phones must keep up): the hand, its sleeve, its foam, its wet shine, each
// dirt monster and each glint – nothing is ever animated inside an svg.

/** The hand's own picture units: a hand layer is this wide and tall, its wrist at the bottom. */
export const HAND_W = 340;
export const HAND_H = 700;

/** Skin: the ground, its light and shade, and the soft brown line round it (no ink: the hands should look real). */
const SKIN = { ground: "#f6c6a0", light: "#fde3cc", shade: "#dfa27b", line: "#b97a58", crease: "#c98d6b", nail: "#ffe1d6", nailEdge: "#e8b3a2" };

/** One finger: the middle of its base, its width, its length from the base and how far it leans (degrees, + to the right). */
interface Finger {
  x: number;
  y: number;
  w: number;
  len: number;
  angle: number;
}

/** Little finger, ring, middle and index finger, then the thumb pointing up and out towards the middle. */
const FINGERS: Finger[] = [
  { x: 92, y: 262, w: 34, len: 122, angle: -11 },
  { x: 132, y: 240, w: 38, len: 158, angle: -4 },
  { x: 174, y: 232, w: 40, len: 174, angle: 1 },
  { x: 216, y: 242, w: 39, len: 152, angle: 8 },
];
const THUMB: Finger = { x: 246, y: 372, w: 42, len: 108, angle: 36 };

/** The back of the hand and the forearm below it, round the finger bases and the thumb's root. */
const BACK =
  "M100 700 L104 470 C92 430 72 380 70 330 C68 292 72 268 80 254 C96 236 118 226 140 220 C166 214 196 216 220 226 C240 234 252 250 256 278 C260 310 262 340 258 372 C252 410 238 440 230 470 L240 700 Z";

/** A finger as a rounded bar standing on its base, turned by its lean. */
function FingerShape({ f, fill, className }: { f: Finger; fill: string; className?: string }) {
  return (
    <rect
      className={className}
      x={f.x - f.w / 2}
      y={f.y - f.len}
      width={f.w}
      height={f.len + f.w * 0.6}
      rx={f.w / 2}
      fill={fill}
      transform={`rotate(${f.angle} ${f.x} ${f.y})`}
    />
  );
}

/** A finger's details: the soft creases at its joints and its nail with a light on it. */
function FingerDetails({ f }: { f: Finger }) {
  const top = f.y - f.len;
  const crease = (at: number, width: number) => {
    const y = f.y - f.len * at;
    return (
      <path
        d={`M${f.x - f.w * width} ${y} Q${f.x} ${y - 4} ${f.x + f.w * width} ${y}`}
        fill="none"
        stroke={SKIN.crease}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.5}
      />
    );
  };
  return (
    <g transform={`rotate(${f.angle} ${f.x} ${f.y})`}>
      {crease(0.36, 0.26)}
      {crease(0.4, 0.18)}
      {crease(0.68, 0.22)}
      <rect x={f.x - f.w * 0.3} y={top + 5} width={f.w * 0.6} height={f.w * 0.74} rx={f.w * 0.28} fill={SKIN.nail} stroke={SKIN.nailEdge} strokeWidth={1.5} />
      <ellipse cx={f.x - f.w * 0.08} cy={top + 5 + f.w * 0.26} rx={f.w * 0.1} ry={f.w * 0.18} fill="#fff" opacity={0.75} />
    </g>
  );
}

/** The hand's outline filled with `fill`, for its shadow and its glow. */
function Silhouette({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <path d={BACK} />
      {[...FINGERS, THUMB].map((f, i) => (
        <FingerShape key={i} f={f} fill={fill} />
      ))}
    </g>
  );
}

/**
 * The hand itself, drawn once (`memo`): a soft shadow it casts on the basin, the skin rounded by light and shade,
 * knuckles, creases and nails.
 */
export const HandArt = memo(function HandArt({ side }: { side: "left" | "right" }) {
  const id = `hw-${side}`;
  return (
    <svg className="hw-hand-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} aria-hidden>
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SKIN.shade} />
          <stop offset="0.35" stopColor={SKIN.ground} />
          <stop offset="0.6" stopColor={SKIN.light} />
          <stop offset="1" stopColor={SKIN.shade} />
        </linearGradient>
        <linearGradient id={`${id}-finger`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SKIN.shade} />
          <stop offset="0.4" stopColor={SKIN.light} />
          <stop offset="0.75" stopColor={SKIN.ground} />
          <stop offset="1" stopColor={SKIN.shade} />
        </linearGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={12} />
        </filter>
      </defs>
      {/* The shadow it casts on the basin, the light coming from above the tap. */}
      <g transform="translate(16 26)" opacity={0.22} filter={`url(#${id}-soft)`}>
        <Silhouette fill="#3d2a1e" />
      </g>
      {/* The outline: the whole shape a little bigger in the line's colour. */}
      <g stroke={SKIN.line} strokeWidth={5} strokeLinejoin="round">
        <Silhouette fill={SKIN.line} />
      </g>
      <path d={BACK} fill={`url(#${id}-skin)`} />
      <FingerShape f={THUMB} fill={`url(#${id}-finger)`} />
      {/* The fold where the thumb meets the hand. */}
      <path d="M244 388 C252 372 258 354 256 336" fill="none" stroke={SKIN.crease} strokeWidth={2.5} strokeLinecap="round" opacity={0.55} />
      {FINGERS.map((f, i) => (
        <FingerShape key={i} f={f} fill={`url(#${id}-finger)`} />
      ))}
      {/* The knuckles: a soft light on each, where the bones lie under the skin. */}
      {FINGERS.map((f, i) => (
        <ellipse key={i} cx={f.x + 1} cy={f.y + 2} rx={f.w * 0.36} ry={f.w * 0.22} fill={SKIN.light} opacity={0.7} />
      ))}
      {/* The tendons running from the knuckles down the back of the hand, barely there. */}
      {FINGERS.map((f, i) => (
        <path
          key={i}
          d={`M${f.x} ${f.y + 16} Q${f.x + (166 - f.x) * 0.3} ${f.y + 90} ${166 + (f.x - 166) * 0.25} 450`}
          fill="none"
          stroke={SKIN.shade}
          strokeWidth={3}
          opacity={0.18}
          strokeLinecap="round"
        />
      ))}
      {[...FINGERS, THUMB].map((f, i) => (
        <FingerDetails key={i} f={f} />
      ))}
      {/* The wrist's crease. */}
      <path d="M112 478 Q170 488 228 478" fill="none" stroke={SKIN.crease} strokeWidth={2.5} opacity={0.4} strokeLinecap="round" />
    </svg>
  );
});

/** The sleeve over the forearm (the T-shirt in the morning, the pyjama in the evening), pushed up in the first step. */
export const Sleeve = memo(function Sleeve({ side, daytime }: { side: "left" | "right"; daytime: Daytime }) {
  const figure = useFigure();
  const pattern = `hw-pyjama-${side}`;
  const fill = topFill(figure, daytime, pattern);
  return (
    <svg className="hw-sleeve-art" viewBox={`0 0 ${HAND_W} 260`} overflow="visible" aria-hidden>
      <defs>
        <PyjamaPattern id={pattern} figure={figure} />
        <linearGradient id={`hw-sleeve-shade-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.28} />
          <stop offset="0.3" stopColor="#000" stopOpacity={0} />
          <stop offset="0.7" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="1" stopColor="#000" stopOpacity={0.3} />
        </linearGradient>
      </defs>
      {/* The sleeve widens towards the viewer, its cuff gathered in soft folds; it reaches on below its box, so pushed
          up over the arm it never shows an end. */}
      <path d="M78 40 C120 22 220 22 262 40 L300 260 L318 420 L22 420 L40 260 Z" fill={fill} stroke="#5b3d6e" strokeWidth={4} strokeLinejoin="round" />
      <path d="M78 40 C120 22 220 22 262 40 L300 260 L318 420 L22 420 L40 260 Z" fill={`url(#hw-sleeve-shade-${side})`} />
      <path d="M78 40 C120 22 220 22 262 40 L266 62 C222 46 118 46 74 62 Z" fill="#fff" opacity={0.28} />
      {[110, 160, 212].map((x, i) => (
        <path key={i} d={`M${x} 50 Q${x + 8} 120 ${x - 4} 200`} fill="none" stroke="#000" strokeWidth={3} opacity={0.12} strokeLinecap="round" />
      ))}
    </svg>
  );
});

/** Bubbles of foam: their middle, radius and whether a light sits on them, laid round the back of the hand. */
const BUBBLES = Array.from({ length: 46 }, (_, i) => {
  const a = i * 2.39996;
  const r = 18 + ((i * 37) % 100);
  return {
    x: 165 + Math.cos(a) * r * 0.95,
    y: 330 + Math.sin(a) * r * 1.25 - (i % 5) * 6,
    r: 9 + ((i * 13) % 15),
  };
});

/** The foam on a hand, many small bubbles with lights on them; drawn once, it grows and goes as a whole layer. */
export const Foam = memo(function Foam() {
  return (
    <svg className="hw-foam-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} aria-hidden>
      <defs>
        <radialGradient id="hw-bubble" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.7" stopColor="#f3fbff" />
          <stop offset="1" stopColor="#cfe9f7" />
        </radialGradient>
      </defs>
      {BUBBLES.map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r={b.r} fill="url(#hw-bubble)" stroke="#b7dcef" strokeWidth={1.5} />
          {i % 2 === 0 && <circle cx={b.x - b.r * 0.35} cy={b.y - b.r * 0.4} r={b.r * 0.22} fill="#fff" />}
        </g>
      ))}
    </svg>
  );
});

/** The wet shine on a hand after the water: soft white streaks along the fingers and a few drops. */
export const Wet = memo(function Wet() {
  return (
    <svg className="hw-wet-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} aria-hidden>
      {FINGERS.map((f, i) => (
        <g key={i} transform={`rotate(${f.angle} ${f.x} ${f.y})`}>
          <rect x={f.x - f.w * 0.18} y={f.y - f.len + 30} width={f.w * 0.16} height={f.len * 0.55} rx={f.w * 0.08} fill="#fff" opacity={0.55} />
        </g>
      ))}
      <path d="M120 300 Q150 280 196 286" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.45} />
      <path d="M140 380 Q170 370 200 376" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.35} />
      {[
        [110, 350, 6],
        [204, 330, 5],
        [160, 420, 7],
        [232, 300, 4],
      ].map(([x, y, r], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={r} ry={r * 1.25} fill="#e6f6ff" stroke="#9fd0ea" strokeWidth={1.2} opacity={0.85} />
          <circle cx={x - r * 0.3} cy={y - r * 0.4} r={r * 0.3} fill="#fff" />
        </g>
      ))}
    </svg>
  );
});

/** The soap pumped onto the hand: one soft dab, before the rubbing turns it into foam. */
export const SoapDab = memo(function SoapDab() {
  return (
    <svg className="hw-dab-art" viewBox="-30 -24 60 48" aria-hidden>
      <ellipse cx={0} cy={2} rx={26} ry={18} fill="#ffe3f1" stroke="#e7a9c9" strokeWidth={2} />
      <ellipse cx={-6} cy={-4} rx={9} ry={6} fill="#fff" opacity={0.85} />
    </svg>
  );
});

/** A dirt monster: which step washes it off, on which hand, where on it (hand units) and its colour. */
export interface DirtMonster {
  id: string;
  step: StepId;
  side: "left" | "right";
  x: number;
  y: number;
  color: string;
  /** Which of the shapes it has. */
  variant: number;
}

/** The six dirt monsters, one for each place the rubbing reaches (and a second on the backs, where most dirt sits). */
export const DIRT_MONSTERS: DirtMonster[] = [
  { id: "mud", step: "palms", side: "right", x: 150, y: 410, color: "#9a6a43", variant: 0 },
  { id: "grass", step: "backs", side: "left", x: 158, y: 330, color: "#7cb342", variant: 1 },
  { id: "paint", step: "backs", side: "right", x: 168, y: 318, color: "#5c8de0", variant: 2 },
  { id: "jam", step: "between", side: "left", x: 194, y: 214, color: "#d9467a", variant: 0 },
  { id: "sand", step: "thumbs", side: "right", x: 276, y: 318, color: "#e0b45a", variant: 1 },
  { id: "cocoa", step: "tips", side: "left", x: 176, y: 92, color: "#6d4c41", variant: 2 },
];

/** How wide a dirt monster is drawn, in hand units. */
export const MONSTER_W = 72;

/** The shapes a dirt monster's body takes: a splodge, one with a little tuft, one with drips. */
const MONSTER_BODIES = [
  "M-17 9 C-20 -6 -10 -18 0 -18 C11 -18 20 -7 17 9 C13 16 -12 16 -17 9 Z",
  "M-16 10 C-19 -4 -12 -14 -4 -15 L-2 -22 L3 -15 C11 -14 19 -5 16 10 C12 16 -12 16 -16 10 Z",
  "M-18 6 C-18 -8 -9 -17 1 -17 C12 -17 19 -8 18 6 L15 14 L11 9 L6 15 L0 10 L-6 15 L-11 9 L-15 14 Z",
];

/** A dirt monster drawn round its middle, about 40 wide: a splodge of its dirt with eyes and a grin. */
export const MonsterArt = memo(function MonsterArt({ color, variant }: { color: string; variant: number }) {
  return (
    <svg className="hw-monster-art" viewBox="-27 -27 54 54" aria-hidden>
      <path d={MONSTER_BODIES[variant % MONSTER_BODIES.length]} fill={color} stroke="#3b2a20" strokeWidth={2.2} strokeLinejoin="round" />
      <circle cx={-9} cy={4} r={2.2} fill="#000" opacity={0.15} />
      <circle cx={10} cy={7} r={1.6} fill="#000" opacity={0.15} />
      <circle cx={-5.5} cy={-4} r={4.2} fill="#fff" stroke="#3b2a20" strokeWidth={1.6} />
      <circle cx={5.5} cy={-4} r={4.2} fill="#fff" stroke="#3b2a20" strokeWidth={1.6} />
      <circle cx={-4.8} cy={-3.4} r={1.9} fill="#3b2a20" />
      <circle cx={6.2} cy={-3.4} r={1.9} fill="#3b2a20" />
      <path d="M-6 4 Q0 10 6 4" fill="#5a2333" stroke="#3b2a20" strokeWidth={1.8} strokeLinejoin="round" />
    </svg>
  );
});

/** Where the clean hand's glints come and go, in hand units, and when (beats into the last step). */
export const GLINTS = [
  { x: 176, y: 120, delay: 0 },
  { x: 150, y: 330, delay: 1.5 },
  { x: 220, y: 170, delay: 3 },
  { x: 100, y: 200, delay: 4.5 },
];

/** A spot in hand units as a place in the hand layer, `size` units wide (and as tall). */
export const handSpot = (x: number, y: number, size: number): CSSProperties => ({
  left: `${((x - size / 2) / HAND_W) * 100}%`,
  top: `${((y - size / 2) / HAND_H) * 100}%`,
  width: `${(size / HAND_W) * 100}%`,
  height: `${(size / HAND_H) * 100}%`,
});
