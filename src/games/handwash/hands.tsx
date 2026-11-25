import { type CSSProperties, memo } from "react";
import { PyjamaPattern, topFill } from "@/games/teeth/clothes";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";

// The child's own hands, seen from above over the basin as the child sees them, fingers pointing away and the forearms
// coming up from the bottom of the screen in their sleeves. One hand is drawn (the left) and the right one is its
// mirror image. Each hand comes in four views, so one hand can soap the other the way children really do it (user
// feedback, 25 November 2026: open hands getting their soap as if by magic was not how hands are washed): its back or
// its palm, the fingers together or spread to slide between the other hand's fingers. They are drawn round, not flat:
// every finger shaded across like a little cylinder and rosy at its tip, a soft dark rim inside the whole outline, the
// dimples of a small child's knuckles, nails with their light, the palm cupped with its lines and pads. Every part that
// moves is an HTML layer of its own round its own little svg (root CLAUDE.md, phones must keep up): each view of a hand,
// its foam, wet shine and dirt, the sleeve and its roll – nothing is ever animated inside an svg.

/** The hand's own picture units: a hand layer is this wide and tall, its wrist at about y 480. */
export const HAND_W = 340;
export const HAND_H = 700;

/** Skin: the ground, its light and shade, the rosy fingertips, the soft brown line and creases, the nails. */
const SKIN = {
  ground: "#f4c3a0",
  light: "#fde3cf",
  shade: "#dc9f7f",
  deep: "#a8664a",
  line: "#a86d50",
  crease: "#b87a5b",
  rosy: "#f08f86",
  nail: "#fbe0d8",
  nailEdge: "#dca393",
};

/** How a hand is seen: its back or its palm, the fingers together or spread. */
export type HandView = "back" | "palm" | "backSpread" | "palmSpread";

/** Every view, each drawn once into a layer of its own. */
export const HAND_VIEWS: readonly HandView[] = ["back", "palm", "backSpread", "palmSpread"];

const isPalm = (view: HandView) => view === "palm" || view === "palmSpread";
const isSpread = (view: HandView) => view === "backSpread" || view === "palmSpread";

/** One finger: the middle of its base, its width there, its length from the base and its lean (degrees, + to the right). */
interface Finger {
  x: number;
  y: number;
  w: number;
  len: number;
  angle: number;
}

/** Little finger, ring, middle and index finger of the left hand seen from its back: short and chubby, as a small child's. */
const fingersOf = (spread: boolean): Finger[] => [
  { x: 95, y: 268, w: 37, len: 108, angle: spread ? -27 : -10 },
  { x: 135, y: 244, w: 41, len: 138, angle: spread ? -12 : -4 },
  { x: 177, y: 236, w: 43, len: 148, angle: spread ? 4 : 1 },
  { x: 219, y: 248, w: 42, len: 132, angle: spread ? 20 : 7 },
];

/** The thumb, coming out low at the hand's side towards the middle. */
const thumbOf = (spread: boolean): Finger => ({ x: 248, y: 386, w: 46, len: 102, angle: spread ? 60 : 38 });

/** The back of the hand (or the palm, mirrored) and the forearm below it, round the finger bases and the thumb's root. */
const BODY =
  "M100 700 L104 470 C92 430 72 380 70 330 C68 292 72 268 80 254 C96 236 118 226 140 220 C166 214 196 216 220 226 C240 234 252 250 256 278 C260 310 262 340 258 372 C252 410 238 440 230 470 L240 700 Z";

/** A finger standing upright on its base at (0, 0), reaching below it into the hand, its tip rounded and a little narrower. */
function fingerPath(w: number, len: number) {
  const b = w / 2;
  const t = w * 0.45;
  return `M${-b} ${w * 0.7} L${-b} ${-len * 0.35} C${-b} ${-len * 0.72} ${-t} ${-len + t * 1.3} ${-t} ${-len + t} C${-t} ${-len - t * 0.36} ${t} ${-len - t * 0.36} ${t} ${-len + t} C${t} ${-len + t * 1.3} ${b} ${-len * 0.72} ${b} ${-len * 0.35} L${b} ${w * 0.7} Z`;
}

/** Moves a finger's own units (base at 0, 0) to its place on the hand. */
const at = (f: Finger) => `translate(${f.x} ${f.y}) rotate(${f.angle})`;

/** A point given in a finger's own units, on the hand. */
function onFinger(f: Finger, px: number, py: number) {
  const a = (f.angle * Math.PI) / 180;
  return { x: f.x + px * Math.cos(a) - py * Math.sin(a), y: f.y + px * Math.sin(a) + py * Math.cos(a) };
}

/** A little wobbly number from a seed, the same each time, so drawings stay as they are. */
const wobble = (seed: number) => {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

/** The hand's whole outline filled with `fill`: for its shadow, its outline and its rim. */
function Silhouette({ spread, fill }: { spread: boolean; fill: string }) {
  return (
    <g fill={fill}>
      <path d={BODY} />
      {[...fingersOf(spread), thumbOf(spread)].map((f, i) => (
        <path key={i} d={fingerPath(f.w, f.len)} transform={at(f)} />
      ))}
    </g>
  );
}

/** Lines across a finger at `y` (its own units), `n` of them close together: a joint's creases or wrinkles. */
function Creases({ f, y, n, width, light }: { f: Finger; y: number; n: number; width: number; light?: boolean }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const yy = y + (i - (n - 1) / 2) * 4.5;
        const half = f.w * width * (i === 1 && n === 3 ? 1.15 : 1);
        return (
          <g key={i}>
            <path d={`M${-half} ${yy} Q0 ${yy + 3.5} ${half} ${yy}`} fill="none" stroke={SKIN.crease} strokeWidth={1.8} strokeLinecap="round" opacity={0.55} />
            {light && (
              <path
                d={`M${-half} ${yy + 2} Q0 ${yy + 5.5} ${half} ${yy + 2}`}
                fill="none"
                stroke="#fff"
                strokeWidth={1.2}
                strokeLinecap="round"
                opacity={0.35}
              />
            )}
          </g>
        );
      })}
    </>
  );
}

/** A finger seen from the back: shaded round, rosy at the tip, wrinkles at its joints, a nail with its light. */
function BackFinger({ f, id }: { f: Finger; id: string }) {
  const d = fingerPath(f.w, f.len);
  const top = -f.len;
  const nw = f.w * 0.6;
  const nh = f.w * 0.66;
  return (
    <g transform={at(f)}>
      <path d={d} fill={`url(#${id}-finger)`} mask={`url(#${id}-fade)`} />
      <path d={d} fill={`url(#${id}-tip)`} mask={`url(#${id}-fade)`} />
      {/* The light along the finger's round, where the light from the window falls. */}
      <rect x={-f.w * 0.27} y={top + f.w * 0.9} width={f.w * 0.13} height={f.len * 0.5} rx={f.w * 0.065} fill="#fff" opacity={0.3} />
      <Creases f={f} y={-f.len * 0.42} n={3} width={0.22} />
      <Creases f={f} y={-f.len * 0.7} n={2} width={0.16} />
      {/* The nail: its bed, the light half-moon at its root, a gleam, and the skin's soft edge round it. */}
      <path
        d={`M${-nw / 2} ${top + nh} L${-nw / 2} ${top + f.w * 0.3} Q${-nw / 2} ${top + f.w * 0.1} 0 ${top + f.w * 0.08} Q${nw / 2} ${top + f.w * 0.1} ${nw / 2} ${top + f.w * 0.3} L${nw / 2} ${top + nh} Q0 ${top + nh + 4} ${-nw / 2} ${top + nh} Z`}
        fill={`url(#${id}-nail)`}
        stroke={SKIN.nailEdge}
        strokeWidth={1.4}
      />
      <ellipse cx={0} cy={top + nh - 3} rx={nw * 0.3} ry={2.6} fill="#fff" opacity={0.55} />
      <ellipse cx={-nw * 0.18} cy={top + f.w * 0.3} rx={nw * 0.09} ry={f.w * 0.12} fill="#fff" opacity={0.85} />
      <path
        d={`M${-nw / 2 - 2} ${top + nh + 3} Q0 ${top + nh + 8} ${nw / 2 + 2} ${top + nh + 3}`}
        fill="none"
        stroke={SKIN.crease}
        strokeWidth={1.4}
        opacity={0.4}
      />
    </g>
  );
}

/** A finger seen from the palm: shaded round, rosy pads, the creases at its root and joints. */
function PalmFinger({ f, id }: { f: Finger; id: string }) {
  const d = fingerPath(f.w, f.len);
  return (
    <g transform={at(f)}>
      <path d={d} fill={`url(#${id}-finger)`} mask={`url(#${id}-fade)`} />
      <path d={d} fill={`url(#${id}-tip)`} mask={`url(#${id}-fade)`} />
      {/* The soft pads between the joints, lighter where they bulge. */}
      {[0.86, 0.57, 0.22].map((t, i) => (
        <ellipse key={i} cx={-f.w * 0.04} cy={-f.len * t} rx={f.w * 0.3} ry={f.len * (i === 0 ? 0.1 : 0.11)} fill="#fff" opacity={0.28} />
      ))}
      <Creases f={f} y={-f.len * 0.04} n={2} width={0.34} light />
      <Creases f={f} y={-f.len * 0.42} n={2} width={0.32} light />
      <Creases f={f} y={-f.len * 0.72} n={1} width={0.28} light />
    </g>
  );
}

/** The skin's gradients, the fade of a finger into the hand, the shadow's blur and the soft rim inside the outline. */
function SkinDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={SKIN.shade} />
        <stop offset="0.28" stopColor={SKIN.ground} />
        <stop offset="0.48" stopColor={SKIN.light} />
        <stop offset="0.74" stopColor={SKIN.ground} />
        <stop offset="1" stopColor={SKIN.shade} />
      </linearGradient>
      <linearGradient id={`${id}-finger`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={SKIN.shade} />
        <stop offset="0.3" stopColor={SKIN.light} />
        <stop offset="0.62" stopColor={SKIN.ground} />
        <stop offset="1" stopColor={SKIN.shade} />
      </linearGradient>
      <linearGradient id={`${id}-tip`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SKIN.rosy} stopOpacity={0.42} />
        <stop offset="0.3" stopColor={SKIN.rosy} stopOpacity={0} />
      </linearGradient>
      <linearGradient id={`${id}-nail`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff6f2" />
        <stop offset="1" stopColor={SKIN.nail} />
      </linearGradient>
      <linearGradient id={`${id}-fadeGrad`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0.74" stopColor="#fff" />
        <stop offset="0.97" stopColor="#000" />
      </linearGradient>
      {/* A finger fades out where it reaches into the hand, so finger and hand are one skin with no seam. */}
      <mask id={`${id}-fade`} maskContentUnits="objectBoundingBox">
        <rect width={1} height={1} fill={`url(#${id}-fadeGrad)`} />
      </mask>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff" stopOpacity={0.5} />
        <stop offset="1" stopColor="#fff" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-hollow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={SKIN.deep} stopOpacity={0.32} />
        <stop offset="1" stopColor={SKIN.deep} stopOpacity={0} />
      </radialGradient>
      <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={11} />
      </filter>
      {/* The rim: the outline's alpha minus its blur leaves a soft band inside every edge, so the hand looks round. */}
      <filter id={`${id}-rim`} x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur in="SourceAlpha" stdDeviation={9} result="soft" />
        <feComposite in="SourceAlpha" in2="soft" operator="out" result="band" />
        <feFlood floodColor={SKIN.deep} floodOpacity={0.5} />
        <feComposite in2="band" operator="in" />
      </filter>
    </defs>
  );
}

/** The back of the left hand: the thumb beneath the hand's edge, the knuckles' dimples, the tendons barely there. */
function BackDetails({ spread, id }: { spread: boolean; id: string }) {
  const fingers = fingersOf(spread);
  const thumb = thumbOf(spread);
  return (
    <>
      <path d={fingerPath(thumb.w, thumb.len)} transform={at(thumb)} fill={`url(#${id}-finger)`} />
      <path d={fingerPath(thumb.w, thumb.len)} transform={at(thumb)} fill={`url(#${id}-tip)`} />
      <g transform={at(thumb)}>
        <Creases f={thumb} y={-thumb.len * 0.5} n={2} width={0.22} />
        <path
          d={`M${-thumb.w * 0.3} ${-thumb.len + thumb.w * 0.72} L${-thumb.w * 0.3} ${-thumb.len + thumb.w * 0.32} Q0 ${-thumb.len + thumb.w * 0.06} ${thumb.w * 0.3} ${-thumb.len + thumb.w * 0.32} L${thumb.w * 0.3} ${-thumb.len + thumb.w * 0.72} Z`}
          fill={`url(#${id}-nail)`}
          stroke={SKIN.nailEdge}
          strokeWidth={1.4}
        />
      </g>
      <path d={BODY} fill={`url(#${id}-skin)`} />
      {/* The fold where the thumb goes in under the hand. */}
      <path d="M246 396 C254 378 260 356 258 336" fill="none" stroke={SKIN.crease} strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
      {fingers.map((f, i) => (
        <BackFinger key={i} f={f} id={id} />
      ))}
      {/* A small child's knuckles are dimples, not bumps: a little hollow at each finger's root, light just below it. */}
      {fingers.map((f, i) => (
        <g key={i}>
          <ellipse cx={f.x + 1} cy={f.y + 10} rx={f.w * 0.2} ry={f.w * 0.1} fill="#fff" opacity={0.35} />
          <ellipse cx={f.x} cy={f.y + 4} rx={f.w * 0.12} ry={f.w * 0.07} fill={SKIN.crease} opacity={0.5} />
        </g>
      ))}
      {fingers.map((f, i) => (
        <path
          key={i}
          d={`M${f.x} ${f.y + 22} Q${f.x + (166 - f.x) * 0.3} ${f.y + 96} ${166 + (f.x - 166) * 0.25} 452`}
          fill="none"
          stroke={SKIN.shade}
          strokeWidth={4}
          opacity={0.14}
          strokeLinecap="round"
        />
      ))}
      {/* The light on the round back of the hand. */}
      <ellipse cx={150} cy={330} rx={62} ry={96} fill={`url(#${id}-glow)`} />
      <path d="M112 478 Q170 488 228 478" fill="none" stroke={SKIN.crease} strokeWidth={2.4} opacity={0.35} strokeLinecap="round" />
    </>
  );
}

/** The palm of the left hand (drawn in the back's units, then mirrored): cupped, with its pads, lines and the thumb over it. */
function PalmDetails({ spread, id }: { spread: boolean; id: string }) {
  const fingers = fingersOf(spread);
  const thumb = thumbOf(spread);
  return (
    <>
      {fingers.map((f, i) => (
        <PalmFinger key={i} f={f} id={id} />
      ))}
      <path d={BODY} fill={`url(#${id}-skin)`} />
      {/* The pads under the fingers, the heel of the hand at the little finger's side, the hollow in the middle. */}
      <path d="M86 268 C110 246 160 238 212 246 C236 252 250 266 252 284 C220 276 140 274 86 290 Z" fill="#fff" opacity={0.22} />
      <ellipse cx={100} cy={404} rx={30} ry={70} fill={`url(#${id}-glow)`} />
      <ellipse cx={166} cy={346} rx={70} ry={80} fill={`url(#${id}-hollow)`} />
      {/* The palm's lines: each a crease with a little light below it, so it is pressed into the skin. */}
      {["M80 302 C118 290 168 296 204 266", "M240 324 C200 330 152 350 100 376", "M236 330 C206 362 200 420 214 468", "M150 300 C152 330 150 380 142 440"].map(
        (d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke={SKIN.crease} strokeWidth={i === 3 ? 1.6 : 2.6} strokeLinecap="round" opacity={i === 3 ? 0.3 : 0.6} />
            <path d={d} transform="translate(0 2.5)" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.35} />
          </g>
        ),
      )}
      {/* The ball of the thumb, then the thumb lying over the palm's edge with its own outline. */}
      <ellipse cx={226} cy={410} rx={40} ry={64} transform="rotate(-18 226 410)" fill={`url(#${id}-glow)`} />
      <g transform={at(thumb)}>
        <path d={fingerPath(thumb.w, thumb.len)} fill={`url(#${id}-finger)`} stroke={SKIN.line} strokeWidth={3} opacity={0.98} />
        <path d={fingerPath(thumb.w, thumb.len)} fill={`url(#${id}-tip)`} />
        <ellipse cx={-thumb.w * 0.04} cy={-thumb.len * 0.78} rx={thumb.w * 0.3} ry={thumb.len * 0.14} fill="#fff" opacity={0.3} />
        <Creases f={thumb} y={-thumb.len * 0.5} n={2} width={0.3} light />
      </g>
      <path d="M112 474 Q170 486 228 474" fill="none" stroke={SKIN.crease} strokeWidth={2.2} opacity={0.45} strokeLinecap="round" />
      <path d="M116 486 Q170 497 224 486" fill="none" stroke={SKIN.crease} strokeWidth={1.8} opacity={0.35} strokeLinecap="round" />
    </>
  );
}

/** Draws in the back's units; a palm is the mirror of a back (the thumb on the other side). */
function Facing({ view, children }: { view: HandView; children: React.ReactNode }) {
  return isPalm(view) ? <g transform={`translate(${HAND_W} 0) scale(-1 1)`}>{children}</g> : <>{children}</>;
}

/**
 * One view of the left hand, drawn once (`memo`): the soft shadow it casts on what lies below it, its outline, the skin
 * rounded by light, shade and the dark rim inside its edge.
 */
export const HandArt = memo(function HandArt({ side, view }: { side: "left" | "right"; view: HandView }) {
  const id = `hw-${side}-${view}`;
  const spread = isSpread(view);
  return (
    <svg className="hw-hand-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <SkinDefs id={id} />
      <Facing view={view}>
        {/* The shadow it casts, the light coming from above the tap: on the basin, or on the other hand below it. */}
        <g transform="translate(14 28)" opacity={0.26} filter={`url(#${id}-blur)`}>
          <Silhouette spread={spread} fill="#3d2a1e" />
        </g>
        <g stroke={SKIN.line} strokeWidth={5} strokeLinejoin="round">
          <Silhouette spread={spread} fill={SKIN.line} />
        </g>
        {isPalm(view) ? <PalmDetails spread={spread} id={id} /> : <BackDetails spread={spread} id={id} />}
        <g filter={`url(#${id}-rim)`}>
          <Silhouette spread={spread} fill="#000" />
        </g>
      </Facing>
    </svg>
  );
});

/** Points spread over a view of the hand (back units): along each finger and thumb and over the middle of the hand. */
function pointsOn(spread: boolean, perFinger: number, inHand: number, seed: number) {
  const points: { x: number; y: number; k: number }[] = [];
  [...fingersOf(spread), thumbOf(spread)].forEach((f, fi) => {
    for (let i = 0; i < perFinger; i++) {
      const k = seed + fi * 31 + i * 7;
      const t = 0.12 + (0.84 * (i + wobble(k))) / perFinger;
      points.push({ ...onFinger(f, (wobble(k + 1) - 0.5) * f.w * 0.6, -f.len * t), k });
    }
  });
  for (let i = 0; i < inHand; i++) {
    const k = seed + 500 + i * 13;
    const a = i * 2.39996;
    const r = Math.sqrt((i + 0.5) / inHand);
    points.push({ x: 164 + Math.cos(a) * r * 78, y: 350 + Math.sin(a) * r * 118 - 10, k });
  }
  return points;
}

/** The foam on one view of a hand: a creamy layer of lather with many small bubbles on it; it grows and goes as a whole layer. */
export const Foam = memo(function Foam({ view }: { view: HandView }) {
  const points = pointsOn(isSpread(view), 4, 26, isPalm(view) ? 3 : 1);
  const id = `hw-foam-${view}`;
  return (
    <svg className="hw-foam-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <defs>
        <radialGradient id={`${id}-bubble`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.65" stopColor="#f5fbff" stopOpacity={0.9} />
          <stop offset="1" stopColor="#cfe6f3" stopOpacity={0.9} />
        </radialGradient>
        <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={4} />
        </filter>
      </defs>
      <Facing view={view}>
        {/* The lather: soft white heaps melting into one creamy layer, a little grey-blue where they lie in shadow. */}
        <g filter={`url(#${id}-soft)`}>
          {points.map((p, i) => (
            <circle key={i} cx={p.x + 3} cy={p.y + 4} r={17 + wobble(p.k + 3) * 10} fill="#c3d6e2" opacity={0.55} />
          ))}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={15 + wobble(p.k + 3) * 10} fill="#fbfdff" opacity={0.9} />
          ))}
        </g>
        {/* A few bubbles on it, small, with a light. */}
        {points
          .filter((_, i) => i % 3 === 0)
          .map((p, i) => {
            const r = 3 + wobble(p.k + 5) * (i % 3 === 0 ? 7 : 3);
            const x = p.x + (wobble(p.k + 6) - 0.5) * 18;
            const y = p.y + (wobble(p.k + 7) - 0.5) * 18;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={r} fill={`url(#${id}-bubble)`} stroke="#cfe3ee" strokeWidth={0.8} />
                <circle cx={x - r * 0.35} cy={y - r * 0.38} r={r * 0.25} fill="#fff" />
              </g>
            );
          })}
      </Facing>
    </svg>
  );
});

/** The wet shine on one view of a hand: light streaks along the fingers, a sheen on the hand, a few drops. */
export const Wet = memo(function Wet({ view }: { view: HandView }) {
  const spread = isSpread(view);
  const drops = pointsOn(spread, 1, 4, isPalm(view) ? 9 : 5);
  return (
    <svg className="hw-wet-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <Facing view={view}>
        {[...fingersOf(spread), thumbOf(spread)].map((f, i) => (
          <g key={i} transform={at(f)}>
            <rect x={-f.w * 0.2} y={-f.len + f.w * 0.5} width={f.w * 0.12} height={f.len * 0.6} rx={f.w * 0.06} fill="#fff" opacity={0.6} />
            <rect x={f.w * 0.12} y={-f.len * 0.55} width={f.w * 0.06} height={f.len * 0.3} rx={f.w * 0.03} fill="#fff" opacity={0.35} />
          </g>
        ))}
        <path d="M118 296 Q150 280 200 286" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.42} />
        <path d="M128 380 Q160 368 206 374" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.3} />
        {drops.map((d, i) => {
          const r = 4 + wobble(d.k) * 4;
          return (
            <g key={i}>
              <ellipse cx={d.x} cy={d.y} rx={r} ry={r * 1.25} fill="#e9f7ff" stroke="#9fcfe8" strokeWidth={1.1} opacity={0.85} />
              <circle cx={d.x - r * 0.3} cy={d.y - r * 0.45} r={r * 0.3} fill="#fff" />
            </g>
          );
        })}
      </Facing>
    </svg>
  );
});

/** A smudge's outline round (x, y): a soft, uneven blot. */
function smudgePath(x: number, y: number, rx: number, ry: number, seed: number) {
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 0.7 + wobble(seed + i) * 0.45;
    return { x: x + Math.cos(a) * rx * r, y: y + Math.sin(a) * ry * r };
  });
  const mid = (i: number) => {
    const p = pts[i % n];
    const q = pts[(i + 1) % n];
    return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
  };
  const start = mid(0);
  return `M${start.x} ${start.y} ${pts.map((_, i) => `Q${pts[(i + 1) % n].x} ${pts[(i + 1) % n].y} ${mid(i + 1).x} ${mid(i + 1).y}`).join(" ")} Z`;
}

/** The dirt of playing on one view of a hand: sand and earth on the knuckles or the palm, darker under the fingertips. */
export const Dirt = memo(function Dirt({ view }: { view: HandView }) {
  const spread = isSpread(view);
  const palm = isPalm(view);
  const blots = palm
    ? [
        { x: 160, y: 352, rx: 46, ry: 30, c: "#8b6a4c" },
        { x: 120, y: 300, rx: 26, ry: 16, c: "#a0805c" },
        { x: 214, y: 420, rx: 20, ry: 26, c: "#7d5f44" },
      ]
    : [
        { x: 196, y: 262, rx: 34, ry: 20, c: "#a0805c" },
        { x: 120, y: 330, rx: 28, ry: 36, c: "#8b6a4c" },
        { x: 226, y: 350, rx: 18, ry: 14, c: "#7d5f44" },
      ];
  return (
    <svg className="hw-dirt-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <Facing view={view}>
        {blots.map((b, i) => (
          <g key={i}>
            <path d={smudgePath(b.x, b.y, b.rx, b.ry, i * 17 + (palm ? 5 : 0))} fill={b.c} opacity={0.42} />
            {Array.from({ length: 7 }, (_, g) => (
              <circle
                key={g}
                cx={b.x + (wobble(i * 40 + g) - 0.5) * b.rx * 1.4}
                cy={b.y + (wobble(i * 40 + g + 9) - 0.5) * b.ry * 1.4}
                r={1.4 + wobble(i * 40 + g + 3) * 2}
                fill="#5d4330"
                opacity={0.55}
              />
            ))}
          </g>
        ))}
        {/* Grime on the fingertips' pads or round the nails. */}
        {fingersOf(spread).map((f, i) => {
          const tip = onFinger(f, 0, -f.len + f.w * (palm ? 0.45 : 0.15));
          return (
            <ellipse
              key={i}
              cx={tip.x}
              cy={tip.y}
              rx={f.w * 0.36}
              ry={f.w * 0.22}
              transform={`rotate(${f.angle} ${tip.x} ${tip.y})`}
              fill="#7d5f44"
              opacity={0.32}
            />
          );
        })}
      </Facing>
    </svg>
  );
});

/** The soap pumped into the palm: one shiny dab, before the rubbing turns it into lather. */
export const SoapDab = memo(function SoapDab() {
  return (
    <svg className="hw-dab-art" viewBox="-30 -24 60 48" aria-hidden>
      <ellipse cx={2} cy={5} rx={26} ry={15} fill="#b46c8f" opacity={0.25} />
      <path d="M-24 4 C-24 -10 -10 -16 2 -15 C16 -14 25 -6 24 4 C23 13 10 17 0 17 C-12 17 -24 13 -24 4 Z" fill="#ffc9e2" stroke="#d98bb0" strokeWidth={1.8} />
      <ellipse cx={-7} cy={-5} rx={9} ry={5} fill="#fff" opacity={0.9} />
      <circle cx={10} cy={4} r={2.5} fill="#fff" opacity={0.7} />
    </svg>
  );
});

/** The sleeve over the forearm (the T-shirt by day, the pyjama in the evening); it reaches far below its box, so pushed
 * up the arm it never shows an end, wherever the hand reaches. */
export const Sleeve = memo(function Sleeve({ side, daytime }: { side: "left" | "right"; daytime: Daytime }) {
  const figure = useFigure();
  const pattern = `hw-pyjama-${side}`;
  const fill = topFill(figure, daytime, pattern);
  const outline = "M74 40 C118 22 222 22 266 40 L300 260 L330 1100 L10 1100 L40 260 Z";
  return (
    <svg className="hw-sleeve-art" viewBox={`0 0 ${HAND_W} 260`} overflow="visible" aria-hidden>
      <defs>
        <PyjamaPattern id={pattern} figure={figure} />
        <linearGradient id={`hw-sleeve-shade-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.3} />
          <stop offset="0.3" stopColor="#000" stopOpacity={0} />
          <stop offset="0.62" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="1" stopColor="#000" stopOpacity={0.32} />
        </linearGradient>
        <linearGradient id={`hw-sleeve-inside-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.35} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={outline} fill={fill} stroke="#5b3d6e" strokeWidth={4} strokeLinejoin="round" />
      <path d={outline} fill={`url(#hw-sleeve-shade-${side})`} />
      {/* Its opening: the dark inside, where the arm goes in. */}
      <path d="M74 40 C118 22 222 22 266 40 C222 56 118 56 74 40 Z" fill={`url(#hw-sleeve-inside-${side})`} />
      {[106, 162, 218].map((x, i) => (
        <path key={i} d={`M${x} 56 Q${x + 9} 140 ${x - 4} 236`} fill="none" stroke="#000" strokeWidth={3} opacity={0.12} strokeLinecap="round" />
      ))}
    </svg>
  );
});

/** The rolled-up cuff at the sleeve's edge: a thick soft roll of the same cloth, shown once the sleeve is pushed up. */
export const SleeveRoll = memo(function SleeveRoll({ side, daytime }: { side: "left" | "right"; daytime: Daytime }) {
  const figure = useFigure();
  const pattern = `hw-pyjama-roll-${side}`;
  const fill = topFill(figure, daytime, pattern);
  return (
    <svg className="hw-roll-art" viewBox={`0 0 ${HAND_W} 260`} overflow="visible" aria-hidden>
      <defs>
        <PyjamaPattern id={pattern} figure={figure} />
        <linearGradient id={`hw-roll-shade-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0.25} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.35} />
        </linearGradient>
      </defs>
      <path d="M62 30 C110 6 230 6 278 30 L284 74 C232 92 108 92 56 74 Z" fill={fill} stroke="#5b3d6e" strokeWidth={4} strokeLinejoin="round" />
      <path d="M62 30 C110 6 230 6 278 30 L284 74 C232 92 108 92 56 74 Z" fill={`url(#hw-roll-shade-${side})`} />
      {/* The folds where the cloth is pushed together. */}
      {[96, 140, 190, 238].map((x, i) => (
        <path
          key={i}
          d={`M${x} ${18 + (i % 2) * 2} Q${x + 6} 50 ${x - 2} ${82 - (i % 2) * 4}`}
          fill="none"
          stroke="#000"
          strokeWidth={2.6}
          opacity={0.16}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
});

/** A spot in hand units as a place in the hand layer, `size` units wide (and as tall). */
export const handSpot = (x: number, y: number, size: number): CSSProperties => ({
  left: `${((x - size / 2) / HAND_W) * 100}%`,
  top: `${((y - size / 2) / HAND_H) * 100}%`,
  width: `${(size / HAND_W) * 100}%`,
  height: `${(size / HAND_H) * 100}%`,
});
