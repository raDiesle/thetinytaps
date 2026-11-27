import { type CSSProperties, memo } from "react";
import { PyjamaPattern, topFill } from "@/games/teeth/clothes";
import { useFigure } from "@/lib/common";
import type { Daytime } from "@/lib/days";

// The child's own hands, seen from above over the basin as the child sees them, fingers pointing away and the forearms
// coming up from the bottom of the screen in their sleeves. One hand is drawn (the left) and the right one is its
// mirror image. Each hand comes in four views, so one hand can soap the other the way children really do it (user
// feedback, 25 November 2026: open hands getting their soap as if by magic was not how hands are washed): its back or
// its palm, the fingers together or spread to slide between the other hand's fingers.
// They are a small child's hands, not a grown-up's (user feedback, 26 November 2026): a wide, puffy palm, short chubby
// fingers close together that hardly taper, round tips with small nails, dimples for knuckles and a soft fold at the
// wrist. Every finger is shaded across like a little cylinder and rosy at its tip, with a soft dark rim inside the hand's
// outline. Each view is two layers: the hand (palm or back with the thumb) and its four fingers, so the fingers can bend
// – seen from above, fingers curling down towards the other hand grow shorter and darker (`.hw-fingers` in
// `handwash.css`), and the hands never look stiff. Every part that moves is an HTML layer of its own round its own little
// svg (root CLAUDE.md, phones must keep up): each view's hand and fingers, their foam, wet shine and dirt, the sleeve and
// its roll – nothing is ever animated inside an svg.

/** The hand's own picture units: a hand layer is this wide and tall, its wrist at about y 480. */
export const HAND_W = 340;
export const HAND_H = 700;

/** Skin: the ground, its light and shade, the rosy fingertips, the soft brown line and creases, the nails. */
const SKIN = {
  ground: "#f6c6a3",
  light: "#fee6d3",
  shade: "#dfa383",
  deep: "#a8664a",
  line: "#a86d50",
  crease: "#bd7f60",
  rosy: "#f2928a",
  nail: "#fbe2da",
  nailEdge: "#e0aa9a",
};

/** How a hand is seen: its back or its palm, the fingers together or spread. */
export type HandView = "back" | "palm" | "backSpread" | "palmSpread";

/** Every view, each drawn once into a layer of its own. */
export const HAND_VIEWS: readonly HandView[] = ["back", "palm", "backSpread", "palmSpread"];

/** A view's two layers: the hand with its thumb, and the four fingers that bend over its knuckles. */
export type HandPart = "hand" | "fingers";

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

/** Little finger, ring, middle and index finger of the left hand seen from its back: short, chubby and close together. */
const fingersOf = (spread: boolean): Finger[] => [
  { x: 98, y: 294, w: 44, len: 74, angle: spread ? -26 : -12 },
  { x: 143, y: 278, w: 49, len: 94, angle: spread ? -11 : -4 },
  { x: 191, y: 273, w: 51, len: 102, angle: spread ? 4 : 1 },
  { x: 238, y: 284, w: 48, len: 90, angle: spread ? 18 : 7 },
];

/** The thumb, coming out low at the hand's side towards the middle: short and thick. */
const thumbOf = (spread: boolean): Finger => ({ x: 264, y: 402, w: 50, len: 80, angle: spread ? 62 : 40 });

/**
 * The back of the hand (or the palm, mirrored) and the forearm below it: wide and puffy for its short fingers, its top
 * edge just under the fingers' bases, so they cover it and only the webbing between them shows.
 */
const BODY =
  "M100 700 L102 488 C86 456 64 414 62 364 C60 330 64 306 74 292 C92 270 122 262 150 260 C180 256 214 258 240 266 C262 274 274 294 278 322 C282 354 280 386 272 416 C264 446 250 468 240 488 L242 700 Z";

/** A finger standing upright on its base at (0, 0), reaching below it into the hand: plump, hardly narrower at its round tip. */
function fingerPath(w: number, len: number) {
  const b = w / 2;
  const t = w * 0.47;
  return `M${-b} ${w * 0.7} L${-b} ${-len * 0.3} C${-b * 1.04} ${-len * 0.62} ${-t} ${-len + t * 1.25} ${-t} ${-len + t} C${-t} ${-len - t * 0.38} ${t} ${-len - t * 0.38} ${t} ${-len + t} C${t} ${-len + t * 1.25} ${b * 1.04} ${-len * 0.62} ${b} ${-len * 0.3} L${b} ${w * 0.7} Z`;
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

/** The hand's outline without its four fingers (the palm or back, the forearm and the thumb), filled with `fill`. */
function HandSilhouette({ spread, fill }: { spread: boolean; fill: string }) {
  const thumb = thumbOf(spread);
  return (
    <g fill={fill}>
      <path d={BODY} />
      <path d={fingerPath(thumb.w, thumb.len)} transform={at(thumb)} />
    </g>
  );
}

/** Lines across a finger at `y` (its own units), `n` of them close together: a joint's soft creases. */
function Creases({ f, y, n, width, light }: { f: Finger; y: number; n: number; width: number; light?: boolean }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const yy = y + (i - (n - 1) / 2) * 4.5;
        const half = f.w * width;
        return (
          <g key={i}>
            <path d={`M${-half} ${yy} Q0 ${yy + 3.5} ${half} ${yy}`} fill="none" stroke={SKIN.crease} strokeWidth={1.8} strokeLinecap="round" opacity={0.42} />
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

/** The finger's skin with its outline, fading out where it reaches into the hand so finger and hand are one skin. */
function FingerSkin({ f, id, i }: { f: Finger; id: string; i: number }) {
  const d = fingerPath(f.w, f.len);
  return (
    <>
      <path d={d} fill={SKIN.line} stroke={SKIN.line} strokeWidth={5} strokeLinejoin="round" mask={`url(#${id}-fade-${i})`} />
      <path d={d} fill={`url(#${id}-finger)`} mask={`url(#${id}-fade-${i})`} />
      <path d={d} fill={`url(#${id}-tip)`} mask={`url(#${id}-fade-${i})`} />
    </>
  );
}

/** A finger seen from the back: shaded round, rosy at the tip, a soft crease at its joint, a small nail with its light. */
function BackFinger({ f, id, i }: { f: Finger; id: string; i: number }) {
  const top = -f.len;
  const nw = f.w * 0.5;
  const nh = f.w * 0.5;
  return (
    <g transform={at(f)}>
      <FingerSkin f={f} id={id} i={i} />
      {/* The light along the finger's round, where the light from the window falls. */}
      <rect x={-f.w * 0.27} y={top + f.w * 0.8} width={f.w * 0.14} height={f.len * 0.46} rx={f.w * 0.07} fill="#fff" opacity={0.3} />
      <Creases f={f} y={-f.len * 0.46} n={2} width={0.2} />
      {/* The nail: small on a child's finger, its bed, the light half-moon at its root, a gleam, and the skin's soft edge round it. */}
      <path
        d={`M${-nw / 2} ${top + nh} L${-nw / 2} ${top + f.w * 0.3} Q${-nw / 2} ${top + f.w * 0.12} 0 ${top + f.w * 0.1} Q${nw / 2} ${top + f.w * 0.12} ${nw / 2} ${top + f.w * 0.3} L${nw / 2} ${top + nh} Q0 ${top + nh + 4} ${-nw / 2} ${top + nh} Z`}
        fill={`url(#${id}-nail)`}
        stroke={SKIN.nailEdge}
        strokeWidth={1.4}
      />
      <ellipse cx={0} cy={top + nh - 3} rx={nw * 0.3} ry={2.4} fill="#fff" opacity={0.55} />
      <ellipse cx={-nw * 0.18} cy={top + f.w * 0.28} rx={nw * 0.09} ry={f.w * 0.09} fill="#fff" opacity={0.85} />
      <path
        d={`M${-nw / 2 - 2} ${top + nh + 3} Q0 ${top + nh + 8} ${nw / 2 + 2} ${top + nh + 3}`}
        fill="none"
        stroke={SKIN.crease}
        strokeWidth={1.4}
        opacity={0.35}
      />
    </g>
  );
}

/** A finger seen from the palm: shaded round, plump rosy pads, the creases at its root and joints. */
function PalmFinger({ f, id, i }: { f: Finger; id: string; i: number }) {
  return (
    <g transform={at(f)}>
      <FingerSkin f={f} id={id} i={i} />
      {/* The soft pads between the joints, lighter where they bulge. */}
      {[0.82, 0.5].map((t, k) => (
        <ellipse key={k} cx={-f.w * 0.04} cy={-f.len * t} rx={f.w * 0.33} ry={f.len * 0.14} fill="#fff" opacity={0.3} />
      ))}
      <Creases f={f} y={-f.len * 0.08} n={2} width={0.34} light />
      <Creases f={f} y={-f.len * 0.66} n={1} width={0.3} light />
    </g>
  );
}

/** The skin's gradients, each finger's fade into the hand, the shadow's blur and the soft rim inside the outline. */
function SkinDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={SKIN.shade} />
        <stop offset="0.26" stopColor={SKIN.ground} />
        <stop offset="0.48" stopColor={SKIN.light} />
        <stop offset="0.76" stopColor={SKIN.ground} />
        <stop offset="1" stopColor={SKIN.shade} />
      </linearGradient>
      <linearGradient id={`${id}-finger`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={SKIN.shade} />
        <stop offset="0.28" stopColor={SKIN.light} />
        <stop offset="0.64" stopColor={SKIN.ground} />
        <stop offset="1" stopColor={SKIN.shade} />
      </linearGradient>
      <linearGradient id={`${id}-tip`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SKIN.rosy} stopOpacity={0.45} />
        <stop offset="0.32" stopColor={SKIN.rosy} stopOpacity={0} />
      </linearGradient>
      <linearGradient id={`${id}-nail`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff6f2" />
        <stop offset="1" stopColor={SKIN.nail} />
      </linearGradient>
      {/* Each finger fades out a little below its base, where it reaches into the hand: finger and hand are one skin with
          no seam, and the fingers' layer can bend over the hand's without a gap. In the finger's own units. */}
      {fingersOf(false).map((f, i) => (
        <g key={i}>
          <linearGradient id={`${id}-fadeGrad-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1={f.w * 0.08} x2="0" y2={f.w * 0.62}>
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#000" />
          </linearGradient>
          <mask id={`${id}-fade-${i}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x={-80} y={-240} width={160} height={320}>
            <rect x={-80} y={-240} width={160} height={320} fill={`url(#${id}-fadeGrad-${i})`} />
          </mask>
        </g>
      ))}
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff" stopOpacity={0.5} />
        <stop offset="1" stopColor="#fff" stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${id}-hollow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={SKIN.deep} stopOpacity={0.28} />
        <stop offset="1" stopColor={SKIN.deep} stopOpacity={0} />
      </radialGradient>
      <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation={11} />
      </filter>
      {/* The rim: the outline's alpha minus its blur leaves a soft band inside every edge, so the hand looks round. */}
      <filter id={`${id}-rim`} x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur in="SourceAlpha" stdDeviation={10} result="soft" />
        <feComposite in="SourceAlpha" in2="soft" operator="out" result="band" />
        <feFlood floodColor={SKIN.deep} floodOpacity={0.45} />
        <feComposite in2="band" operator="in" />
      </filter>
    </defs>
  );
}

/** The thumb seen from the back, lying under the hand's edge, with its little nail. */
function BackThumb({ spread, id }: { spread: boolean; id: string }) {
  const thumb = thumbOf(spread);
  return (
    <g transform={at(thumb)}>
      <path d={fingerPath(thumb.w, thumb.len)} fill={`url(#${id}-finger)`} />
      <path d={fingerPath(thumb.w, thumb.len)} fill={`url(#${id}-tip)`} />
      <Creases f={thumb} y={-thumb.len * 0.5} n={2} width={0.2} />
      <path
        d={`M${-thumb.w * 0.26} ${-thumb.len + thumb.w * 0.6} L${-thumb.w * 0.26} ${-thumb.len + thumb.w * 0.3} Q0 ${-thumb.len + thumb.w * 0.08} ${thumb.w * 0.26} ${-thumb.len + thumb.w * 0.3} L${thumb.w * 0.26} ${-thumb.len + thumb.w * 0.6} Z`}
        fill={`url(#${id}-nail)`}
        stroke={SKIN.nailEdge}
        strokeWidth={1.4}
      />
    </g>
  );
}

/** A small child's wrist: a soft fold round it where the puffy hand meets the arm. */
function WristFolds({ palm }: { palm: boolean }) {
  return (
    <>
      <path d="M108 474 Q170 490 234 474" fill="none" stroke={SKIN.crease} strokeWidth={2.6} opacity={palm ? 0.5 : 0.4} strokeLinecap="round" />
      <path d="M110 478 Q170 494 232 478" fill="none" stroke="#fff" strokeWidth={1.6} opacity={0.35} strokeLinecap="round" />
      <path d="M114 492 Q170 504 228 492" fill="none" stroke={SKIN.crease} strokeWidth={2} opacity={0.3} strokeLinecap="round" />
    </>
  );
}

/** The back of the left hand without its fingers: the thumb beneath the hand's edge, the round puffy back, the wrist's fold. */
function BackHand({ spread, id }: { spread: boolean; id: string }) {
  return (
    <>
      <BackThumb spread={spread} id={id} />
      <path d={BODY} fill={`url(#${id}-skin)`} />
      {/* The fold where the thumb goes in under the hand. */}
      <path d="M254 414 C262 396 268 374 266 352" fill="none" stroke={SKIN.crease} strokeWidth={2.4} strokeLinecap="round" opacity={0.45} />
      {/* The light on the round, puffy back of the hand. */}
      <ellipse cx={162} cy={360} rx={74} ry={86} fill={`url(#${id}-glow)`} />
      <WristFolds palm={false} />
    </>
  );
}

/** The palm of the left hand without its fingers (drawn in the back's units, then mirrored): plump pads, soft lines, the thumb over it. */
function PalmHand({ spread, id }: { spread: boolean; id: string }) {
  const thumb = thumbOf(spread);
  return (
    <>
      <path d={BODY} fill={`url(#${id}-skin)`} />
      {/* The pads under the fingers, the heel of the hand at the little finger's side, the hollow in the middle. */}
      <path d="M76 300 C104 278 160 270 214 276 C240 280 260 292 266 312 C228 304 146 304 80 320 Z" fill="#fff" opacity={0.24} />
      <ellipse cx={104} cy={418} rx={34} ry={62} fill={`url(#${id}-glow)`} />
      <ellipse cx={172} cy={372} rx={66} ry={66} fill={`url(#${id}-hollow)`} />
      {/* The palm's few soft lines: each a crease with a little light below it, so it is pressed into the skin. */}
      {["M78 330 C116 316 170 318 212 294", "M252 344 C208 352 160 368 108 394", "M248 352 C216 380 210 428 220 470"].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={SKIN.crease} strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />
          <path d={d} transform="translate(0 2.5)" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.35} />
        </g>
      ))}
      {/* The ball of the thumb, then the thumb lying over the palm's edge with its own outline. */}
      <ellipse cx={234} cy={424} rx={42} ry={58} transform="rotate(-18 234 424)" fill={`url(#${id}-glow)`} />
      <g transform={at(thumb)}>
        <path d={fingerPath(thumb.w, thumb.len)} fill={`url(#${id}-finger)`} stroke={SKIN.line} strokeWidth={3} opacity={0.98} />
        <path d={fingerPath(thumb.w, thumb.len)} fill={`url(#${id}-tip)`} />
        <ellipse cx={-thumb.w * 0.04} cy={-thumb.len * 0.74} rx={thumb.w * 0.33} ry={thumb.len * 0.17} fill="#fff" opacity={0.3} />
        <Creases f={thumb} y={-thumb.len * 0.46} n={2} width={0.3} light />
      </g>
      <WristFolds palm />
    </>
  );
}

/** The four fingers seen from the back, and a small child's knuckles: dimples, not bumps, at each finger's root. */
function BackFingers({ spread, id }: { spread: boolean; id: string }) {
  const fingers = fingersOf(spread);
  return (
    <>
      {fingers.map((f, i) => (
        <BackFinger key={i} f={f} id={id} i={i} />
      ))}
      {fingers.map((f, i) => (
        <g key={i}>
          <ellipse cx={f.x + 1} cy={f.y + 12} rx={f.w * 0.2} ry={f.w * 0.1} fill="#fff" opacity={0.35} />
          <ellipse cx={f.x} cy={f.y + 6} rx={f.w * 0.11} ry={f.w * 0.065} fill={SKIN.crease} opacity={0.45} />
        </g>
      ))}
    </>
  );
}

/** Draws in the back's units; a palm is the mirror of a back (the thumb on the other side). */
function Facing({ view, children }: { view: HandView; children: React.ReactNode }) {
  return <g transform={isPalm(view) ? `translate(${HAND_W} 0) scale(-1 1)` : undefined}>{children}</g>;
}

/**
 * One layer of one view of the left hand, drawn once (`memo`): the soft shadow it casts on what lies below it, its
 * outline, the skin rounded by light and shade – the hand with its thumb (and the dark rim inside its edge), or its four
 * fingers, which lie over the hand's top edge and bend over it.
 */
export const HandArt = memo(function HandArt({ side, view, part }: { side: "left" | "right"; view: HandView; part: HandPart }) {
  const id = `hw-${side}-${view}-${part}`;
  const spread = isSpread(view);
  const palm = isPalm(view);
  const fingers = fingersOf(spread);
  return (
    <svg className="hw-hand-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <SkinDefs id={id} />
      <Facing view={view}>
        {/* The shadow it casts, the light coming from above the tap: on the basin, or on the other hand below it. */}
        <g transform="translate(14 28)" opacity={0.26} filter={`url(#${id}-blur)`}>
          {part === "hand" ? (
            <HandSilhouette spread={spread} fill="#3d2a1e" />
          ) : (
            fingers.map((f, i) => (
              <g key={i} transform={at(f)}>
                <path d={fingerPath(f.w, f.len)} fill="#3d2a1e" mask={`url(#${id}-fade-${i})`} />
              </g>
            ))
          )}
        </g>
        {part === "hand" ? (
          <>
            <g stroke={SKIN.line} strokeWidth={5} strokeLinejoin="round">
              <HandSilhouette spread={spread} fill={SKIN.line} />
            </g>
            {palm ? <PalmHand spread={spread} id={id} /> : <BackHand spread={spread} id={id} />}
            <g filter={`url(#${id}-rim)`}>
              <HandSilhouette spread={spread} fill="#000" />
            </g>
          </>
        ) : palm ? (
          fingers.map((f, i) => <PalmFinger key={i} f={f} id={id} i={i} />)
        ) : (
          <BackFingers spread={spread} id={id} />
        )}
      </Facing>
    </svg>
  );
});

/** Points spread over a view of the hand (back units): along each finger, and over the middle of the hand and its thumb. */
function pointsOn(spread: boolean, perFinger: number, inHand: number, seed: number) {
  const fingers: { x: number; y: number; k: number }[] = [];
  const hand: { x: number; y: number; k: number }[] = [];
  fingersOf(spread).forEach((f, fi) => {
    for (let i = 0; i < perFinger; i++) {
      const k = seed + fi * 31 + i * 7;
      const t = 0.14 + (0.8 * (i + wobble(k))) / perFinger;
      fingers.push({ ...onFinger(f, (wobble(k + 1) - 0.5) * f.w * 0.6, -f.len * t), k });
    }
  });
  const thumb = thumbOf(spread);
  for (let i = 0; i < Math.max(1, perFinger - 1); i++) {
    const k = seed + 300 + i * 7;
    hand.push({ ...onFinger(thumb, (wobble(k + 1) - 0.5) * thumb.w * 0.5, -thumb.len * (0.2 + (0.7 * (i + wobble(k))) / perFinger)), k });
  }
  for (let i = 0; i < inHand; i++) {
    const k = seed + 500 + i * 13;
    const a = i * 2.39996;
    const r = Math.sqrt((i + 0.5) / inHand);
    hand.push({ x: 170 + Math.cos(a) * r * 84, y: 372 + Math.sin(a) * r * 96, k });
  }
  return { fingers, hand };
}

/** Which foam a layer holds: its first patches on the hand, the hand all lathered, or the lather on the fingers. */
export type FoamStage = "patches" | "full" | "fingers";

/**
 * The foam on one view of a hand, in three layers that come one after the other while the hands rub (user feedback,
 * 26 November 2026: the foam comes bit by bit and is washed off bit by bit): a few patches in the palm or on the back
 * first, then the whole hand creamy, then the fingers; the rinse takes them off the other way round.
 */
export const Foam = memo(function Foam({ view, stage }: { view: HandView; stage: FoamStage }) {
  const { fingers, hand } = pointsOn(isSpread(view), 4, 26, isPalm(view) ? 3 : 1);
  const points = stage === "fingers" ? fingers : stage === "patches" ? hand.filter((_, i) => i % 3 === 1) : hand;
  const grow = stage === "patches" ? 4 : 0;
  const id = `hw-foam-${view}-${stage}`;
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
            <circle key={i} cx={p.x + 3} cy={p.y + 4} r={grow + 15 + wobble(p.k + 3) * 9} fill="#c3d6e2" opacity={0.55} />
          ))}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={grow + 13 + wobble(p.k + 3) * 9} fill="#fbfdff" opacity={0.9} />
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

/** The wet shine on one layer of a view: light streaks along the fingers, or a sheen on the hand; a few drops. */
export const Wet = memo(function Wet({ view, part }: { view: HandView; part: HandPart }) {
  const spread = isSpread(view);
  const { fingers, hand } = pointsOn(spread, 1, 4, isPalm(view) ? 9 : 5);
  const drops = part === "fingers" ? fingers : hand;
  return (
    <svg className="hw-wet-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <Facing view={view}>
        {part === "fingers" ? (
          fingersOf(spread).map((f, i) => (
            <g key={i} transform={at(f)}>
              <rect x={-f.w * 0.2} y={-f.len + f.w * 0.45} width={f.w * 0.12} height={f.len * 0.55} rx={f.w * 0.06} fill="#fff" opacity={0.6} />
              <rect x={f.w * 0.12} y={-f.len * 0.55} width={f.w * 0.06} height={f.len * 0.3} rx={f.w * 0.03} fill="#fff" opacity={0.35} />
            </g>
          ))
        ) : (
          <>
            <path d="M120 322 Q152 308 204 314" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" opacity={0.42} />
            <path d="M128 404 Q162 392 210 398" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.3} />
          </>
        )}
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

/** One blot of dirt with its grains of sand. */
function Blot({ x, y, rx, ry, c, seed }: { x: number; y: number; rx: number; ry: number; c: string; seed: number }) {
  return (
    <g>
      <path d={smudgePath(x, y, rx, ry, seed)} fill={c} opacity={0.42} />
      {Array.from({ length: 7 }, (_, g) => (
        <circle
          key={g}
          cx={x + (wobble(seed * 3 + g) - 0.5) * rx * 1.4}
          cy={y + (wobble(seed * 3 + g + 9) - 0.5) * ry * 1.4}
          r={1.4 + wobble(seed * 3 + g + 3) * 2}
          fill="#5d4330"
          opacity={0.55}
        />
      ))}
    </g>
  );
}

/**
 * The dirt of playing on one layer of a view: sand and earth on the knuckles or the palm (`hand`), darker grime on the
 * fingertips and round the nails (`fingers`) – two layers that go one after the other, the hand's first, while rubbing.
 */
export const Dirt = memo(function Dirt({ view, part }: { view: HandView; part: HandPart }) {
  const spread = isSpread(view);
  const palm = isPalm(view);
  const blots = palm
    ? [
        { x: 166, y: 378, rx: 46, ry: 30, c: "#8b6a4c" },
        { x: 124, y: 326, rx: 26, ry: 16, c: "#a0805c" },
        { x: 222, y: 432, rx: 18, ry: 22, c: "#7d5f44" },
      ]
    : [
        { x: 198, y: 304, rx: 32, ry: 18, c: "#a0805c" },
        { x: 126, y: 366, rx: 28, ry: 32, c: "#8b6a4c" },
        { x: 232, y: 380, rx: 16, ry: 13, c: "#7d5f44" },
      ];
  return (
    <svg className="hw-dirt-art" viewBox={`0 0 ${HAND_W} ${HAND_H}`} overflow="visible" aria-hidden>
      <Facing view={view}>
        {part === "hand"
          ? blots.map((b, i) => <Blot key={i} {...b} seed={i * 17 + (palm ? 5 : 0)} />)
          : fingersOf(spread).map((f, i) => {
              const tip = onFinger(f, 0, -f.len + f.w * (palm ? 0.45 : 0.18));
              const mid = onFinger(f, (wobble(i + 40) - 0.5) * f.w * 0.3, -f.len * 0.48);
              return (
                <g key={i}>
                  <ellipse
                    cx={tip.x}
                    cy={tip.y}
                    rx={f.w * 0.34}
                    ry={f.w * 0.2}
                    transform={`rotate(${f.angle} ${tip.x} ${tip.y})`}
                    fill="#7d5f44"
                    opacity={0.34}
                  />
                  {i % 2 === 0 && <Blot x={mid.x} y={mid.y} rx={f.w * 0.28} ry={f.w * 0.22} c="#8b6a4c" seed={i * 11 + (palm ? 3 : 0)} />}
                </g>
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
