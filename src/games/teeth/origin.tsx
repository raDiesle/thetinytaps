import { useRef, type CSSProperties, type ReactElement, type RefObject } from "react";
import { useFigure } from "@/lib/common";
import { useT } from "@/lib/language";
import { playCrunch, playGiggle, playMunch, playRecorded, playRustle, playYum } from "@/lib/sfx";
import type { Cue } from "./cues";
import type { Daytime } from "@/lib/days";
import { clothesOf, PyjamaPattern, topFill } from "./clothes";
import { PICTURE, TOOTH_ARCS } from "./jaw";
import { BROW, Ear, EyeBall, EyeLid, eyeOpening, FACE, HAIR, Hair, type HeadMap, INK, Iris, LASHES, LIP, Nose, SKIN_SHADE, SkinGradient } from "./face";
import { fitBox, FRAME_CLIP, FrameStroke, Monster, screenFrame, STAIN, STAIN_FILLS, useRoom, type Box } from "./mouth";
import { Piece, pictureSpace } from "./piece";

// Before anything else, a short story of where the sugar monsters come from:
// a sweet appears in the corner, floats a moment so the child sees what it is,
// glides into the child's mouth and is chewed; each leaves sugar crumbs on the
// teeth. Then the crumbs grow into the same monsters the mirror shows later
// (no sun or moon crossing the sky: the story is the same whatever the time of
// day, user request, November 2026), while the child
// looks worried. The child is happy about each sweet: its eyes follow it and
// its brows go up, and while it chews its eyes close happily and its cheeks
// glow. Each sweet flies into the mouth in an arc and crumbles as it is bitten.
// Before the morning brushing it is breakfast instead (X-19): a honey bread, a
// banana and an apple leave their crumbs and monsters
// too, so the child sees that everyday food leaves sugar on the teeth, not only
// sweets. The daytime comes from the clock, as everywhere in the game.
// All of it is CSS animation (teeth.css), calm enough to go with the music;
// ARRIVE_MS here sets when each sweet reaches the mouth, and ORIGIN_CUES the
// sounds that go with it (cheering, unwrapping, biting, chewing, „Mmmh“).

export type OriginPart = "sweets" | "grow";

/** How long each part lasts: the sweets one until the last is chewed, the grow one until the monsters are there. */
export const ORIGIN_MS: Record<OriginPart, number> = { sweets: 9600, grow: 6000 };

const { width: W } = PICTURE;
/**
 * How the story is framed before the camera moves in on the mouth: what has to fit between heading and controls (the
 * screen shows more sky round it) and where the sweets appear. On a screen not much wider than tall the whole head fits with the sweets in the corners above it; on a
 * wide one (a phone on its side) the face from the brows to the chin, the sweets beside it at eye level, so the face and
 * its mouth show bigger (user feedback, November 2026: the mouth should show bigger).
 */
interface Framing {
  focus: Box;
  sweets: { x: number; y: number }[];
}
const HEAD_FRAMING: Framing = {
  focus: { x: 40, y: 34, width: 360, height: 340 },
  sweets: [
    { x: 372, y: 78 },
    { x: 68, y: 78 },
    { x: 372, y: 78 },
  ],
};
const FACE_FRAMING: Framing = {
  focus: { x: -40, y: 112, width: 520, height: 270 },
  sweets: [
    { x: 432, y: 212 },
    { x: 8, y: 212 },
    { x: 432, y: 212 },
  ],
};
/** Both framings, for the tests. */
export const FRAMINGS = { head: HEAD_FRAMING, face: FACE_FRAMING };
/** The face's framing where it shows the picture clearly bigger than the head's, else the head's. */
function framingFor(room: Parameters<typeof fitBox>[0]) {
  const [face, head] = [fitBox(room, FACE_FRAMING.focus), fitBox(room, HEAD_FRAMING.focus)];
  return face.unit * 1.05 < head.unit ? { framing: FACE_FRAMING, ...face } : { framing: HEAD_FRAMING, ...head };
}
/** Where the camera ends up while the monsters grow: the lips round the mouth with them, as big as the free room allows. */
const MOUTH_FOCUS: Box = { x: 114, y: 234, width: 212, height: 118 };
/** The story's head: its middle and radius in picture units; the spitting at the end draws the same head (`spit.tsx`). */
export const HEAD = { x: W / 2, y: 215, r: 165 };
/** Where the teeth stand in the mouth: from left to right, and from the top edge down to the bottom's lowest point. */
export const MOUTH = { left: 124, right: 316, top: 258, depth: 80 };
const MID = (MOUTH.left + MOUTH.right) / 2;
/** The cheeks: their middles across, and where and how big they are; kept clear of the mouth's corners (`cheeks.test.ts`). */
export const CHEEKS = [98, 342];
export const CHEEK = { y: 222, rx: 28, ry: 17 };

type XY = [number, number];
/** A cubic curve from its start through two handles to its end. */
type Curve = [XY, XY, XY, XY];
/**
 * The open smile as a young child's mouth, not a geometric half ellipse (user feedback, November 2026: its pointed
 * corners, where a straight top met a round bottom, looked like a shape from maths) nor a wide grin from cheek to cheek
 * (user feedback, November 2026: the mouth should look friendlier and more like a child's): a little more than half the
 * face wide, the top edge a soft smile sagging to the middle, the corners lifted and tucked round, the bottom a full
 * round curve, every curve running smoothly into the next.
 */
const TOP_CURVES: Curve[] = [
  [
    [134, 250],
    [162, 257],
    [190, 261],
    [220, 261],
  ],
  [
    [220, 261],
    [250, 261],
    [278, 257],
    [306, 250],
  ],
];
const BOTTOM_CURVES: Curve[] = [
  [
    [306, 250],
    [313, 248],
    [318, 253],
    [316, 260],
  ],
  [
    [316, 260],
    [307, 312],
    [266, 338],
    [220, 338],
  ],
  [
    [220, 338],
    [174, 338],
    [133, 312],
    [124, 260],
  ],
  [
    [124, 260],
    [122, 253],
    [127, 248],
    [134, 250],
  ],
];
const curvePath = (curves: Curve[]) => curves.map(([, a, b, c]) => `C${a.join(" ")} ${b.join(" ")} ${c.join(" ")}`).join(" ");
const MOUTH_PATH = `M${TOP_CURVES[0][0].join(" ")} ${curvePath(TOP_CURVES)} ${curvePath(BOTTOM_CURVES)} Z`;
/** Points along curves, from their start to their end. */
const pointsOf = (curves: Curve[]) =>
  curves.flatMap(([p0, p1, p2, p3]) =>
    Array.from({ length: 24 }, (_, i) => {
      const t = i / 23;
      const u = 1 - t;
      const at = (k: 0 | 1) => u ** 3 * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t ** 3 * p3[k];
      return { x: at(0), y: at(1) };
    }),
  );
const TOP_EDGE = pointsOf(TOP_CURVES);
const BOTTOM_EDGE = pointsOf(BOTTOM_CURVES);
/** The mouth's two corners, furthest out left and right: the cheeks keep clear of them. */
export const MOUTH_CORNERS = [BOTTOM_EDGE.reduce((a, b) => (b.x < a.x ? b : a)), BOTTOM_EDGE.reduce((a, b) => (b.x > a.x ? b : a))];
/** Where an edge (left to right or right to left) is at x, between its two points round it. */
function edgeAt(edge: { x: number; y: number }[], x: number) {
  const points = edge[0].x < edge[edge.length - 1].x ? edge : [...edge].reverse();
  const last = points[points.length - 1];
  if (x <= points[0].x) return points[0].y;
  if (x >= last.x) return last.y;
  const i = points.findIndex((p) => p.x >= x);
  const [a, b] = [points[i - 1], points[i]];
  return b.x === a.x ? a.y : a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
}
/** The bottom edge of the mouth below x: the round part of the bottom, between the corners. */
const BOTTOM_ROUND = BOTTOM_EDGE.slice(24, 72);
const bottomAt = (x: number) => edgeAt(BOTTOM_ROUND, x);
/** The top edge of the mouth above x (it sags a little in the middle). */
const topAt = (x: number) => edgeAt(TOP_EDGE, x);
/** A tooth of the story seen from the front: its middle across, how wide it shows and how long it is. */
interface StoryTooth {
  x: number;
  width: number;
  /** As a share of a front tooth's length. */
  length: number;
}
/** How long a front tooth is drawn, from inside the gum to its biting edge; the others by their share (`length`). */
const TOOTH_LENGTH = 42;
/** Half the width of each row's arch seen from the front: the lower row stands inside the upper one, as in a real mouth. */
const ARCH_HALF = { upper: 92, lower: 76 };
/**
 * A row's ten milk teeth, left to right: a child has twenty, ten in each row (user feedback, November 2026: six above
 * and four below were too few). Each stands where the mirror's arch puts it (`TOOTH_ARCS` in jaw.ts), seen from the
 * front, so the teeth narrow towards the corners as the row curves away – neighbours nearly touching (with gaps between
 * them the child looked to have lost teeth) – and the molars are a little shorter, as the mirror's are.
 */
function rowOf(half: number): StoryTooth[] {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const side = TOOTH_ARCS.map(({ from, to, height }) => {
    const [a, b] = [half * Math.sin(rad(from)), half * Math.sin(rad(to))];
    return { x: (a + b) / 2, width: b - a, length: height / TOOTH_ARCS[0].height };
  });
  return [...[...side].reverse().map((t) => ({ ...t, x: MID - t.x })), ...side.map((t) => ({ ...t, x: MID + t.x }))];
}
export const STORY_TEETH = { upper: rowOf(ARCH_HALF.upper), lower: rowOf(ARCH_HALF.lower) };
const UPPER = STORY_TEETH.upper;
const LOWER = STORY_TEETH.lower;
/** Where a tooth's rectangle lies: an upper one hangs from the mouth's top, a lower one stands on its round bottom. */
function toothRect({ x, width, length }: StoryTooth, upper: boolean) {
  const height = TOOTH_LENGTH * length;
  const y = upper ? MOUTH.top - 14 : bottomAt(x) - 28 * length;
  return { x: x - width / 2, y, width, height, rx: Math.min(8, width * 0.35) };
}

/**
 * How far the gum reaches from the mouth's edge at x: furthest between the teeth and arching back over the middle of
 * each one, so the teeth grow out of it like in the mirror (jaw.ts).
 */
function gumDepth(x: number, teeth: StoryTooth[]) {
  const d = Math.min(...teeth.map((t) => Math.abs(x - t.x) / (t.width / 2)));
  return d >= 1 ? 11 : 5 + 6 * d ** 2;
}

/** Every other unit across the mouth, where the gum's edge is worked out. */
const ACROSS = Array.from({ length: (MOUTH.right - MOUTH.left) / 2 + 1 }, (_, i) => MOUTH.left + i * 2);
/** The gum's edge over the upper teeth and under the lower ones, left to right. */
const GUM_EDGE = {
  upper: ACROSS.map((x) => ({ x, y: topAt(x) + gumDepth(x, UPPER) })),
  lower: ACROSS.map((x) => ({ x, y: bottomAt(x) - gumDepth(x, LOWER) })),
};
const edgePath = (edge: { x: number; y: number }[]) => edge.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y.toFixed(1)}`).join(" ");
/** The gum as a band: the edge, then back along the mouth's outline (clipped by it). */
const GUM_PATHS = {
  upper: `${edgePath(GUM_EDGE.upper)} L${MOUTH.right} ${MOUTH.top - 20} L${MOUTH.left} ${MOUTH.top - 20} Z`,
  lower: `${edgePath(GUM_EDGE.lower)} L${MOUTH.right} ${MOUTH.top + MOUTH.depth + 20} L${MOUTH.left} ${MOUTH.top + MOUTH.depth + 20} Z`,
};

/**
 * The teeth stained by the sugar, as the mirror shows them before the brushing (`StainedFace` in mouth.tsx): a little
 * yellow, grey-yellow plaque along the gum and a grey spot or two. Drawn over the mouth's own teeth, so the gum and the
 * lips go over them again as in the mouth below.
 */
function StainedTeeth() {
  const teeth = [
    ...UPPER.map((tooth, i) => ({ ...toothRect(tooth, true), gum: topAt(tooth.x) + gumDepth(tooth.x, UPPER), upper: true, i })),
    ...LOWER.map((tooth, i) => ({ ...toothRect(tooth, false), gum: bottomAt(tooth.x) - gumDepth(tooth.x, LOWER), upper: false, i })),
  ];
  return (
    <>
      <defs>
        <clipPath id="origin-stain">
          <path d={MOUTH_PATH} />
        </clipPath>
      </defs>
      <g clipPath="url(#origin-stain)">
        {teeth.map(({ x: left, y, width, height, rx, gum, upper, i }) => {
          // The plaque reaches a little past the gum's edge, a wavy band along it; the spot sits nearer the biting edge.
          const band = upper ? { from: y, to: gum + 6 + (i % 2) * 2 } : { from: gum - 6 - (i % 2) * 2, to: y + height };
          const spotY = upper ? gum + 13 + (i % 3) * 2 : gum - 13 - (i % 3) * 2;
          const half = width / 2;
          const x = left + half;
          // The spot only on teeth wide enough to hold it: the molars at the corners show only a narrow side.
          const spot = width > 14;
          return (
            <g key={`${upper}-${i}`}>
              <rect x={left} y={y} width={width} height={height} rx={rx} fill={STAIN_FILLS.outer} stroke={INK} strokeWidth={2.5} />
              <path
                d={`M${x - half + 1.5} ${band.from} V${band.to} Q${x - half / 2} ${band.to + (upper ? 2.5 : -2.5)} ${x} ${band.to} T${x + half - 1.5} ${band.to} V${band.from} Z`}
                fill={STAIN.plaque}
                opacity={STAIN.plaqueOpacity}
              />
              {spot && <ellipse cx={x + (i % 2 ? 0.15 : -0.15) * width} cy={spotY} rx={3.2} ry={2.5} fill={STAIN.spot} opacity={STAIN.spotOpacity} />}
            </g>
          );
        })}
        {(["upper", "lower"] as const).map((jaw) => (
          <g key={jaw}>
            <path d={GUM_PATHS[jaw]} fill="#ff8fab" />
            <path d={edgePath(GUM_EDGE[jaw])} fill="none" stroke="#e2577c" strokeWidth={3} strokeLinejoin="round" />
          </g>
        ))}
      </g>
      <path d={MOUTH_PATH} fill="none" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
      <path d={MOUTH_PATH} fill="none" stroke={LIP} strokeWidth={6} strokeLinejoin="round" />
      <path d="M196 340 Q220 345 244 340" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
    </>
  );
}

/** Tickle ids of the monsters here start above the mirror's (step × 100 + order in TeethPlay). */
const FIRST_ID = 1000;

/** The closed mouth while chewing: where its lips meet, in the middle (a little below the open mouth's top). */
const CLOSED = { y: MOUTH.top + 12, half: 50 };
/** Its piece, and the point it moves round (where the lips meet). */
export const CLOSED_AREA: Box = { x: MID - CLOSED.half - 10, y: CLOSED.y - 22, width: 2 * CLOSED.half + 20, height: 60 };

/**
 * The closed lips of a chewing mouth, full and a little pursed round the sweet: a thinner upper lip, a fuller lower one,
 * the line where they meet turning up at the corners as the smile does.
 */
export function ClosedMouth() {
  const { y, half } = CLOSED;
  const [l, r] = [MID - half, MID + half];
  const upper = `M${l} ${y} Q${MID - half / 2} ${y - 16} ${MID} ${y - 10} Q${MID + half / 2} ${y - 16} ${r} ${y} Q${MID} ${y + 8} ${l} ${y} Z`;
  const lower = `M${l + 2} ${y + 1} Q${MID} ${y + 9} ${r - 2} ${y + 1} Q${MID + half / 2} ${y + 24} ${MID} ${y + 26} Q${MID - half / 2} ${y + 24} ${l + 2} ${y + 1} Z`;
  return (
    <g strokeLinejoin="round">
      <path d={lower} fill={LIP} stroke={INK} strokeWidth={4} />
      <path d={upper} fill={LIP} stroke={INK} strokeWidth={4} />
      <path
        d={`M${l - 4} ${y - 4} Q${l} ${y + 1} ${l + 6} ${y + 2} Q${MID} ${y + 8} ${r - 6} ${y + 2} Q${r} ${y + 1} ${r + 4} ${y - 4}`}
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path
        d={`M${MID - 18} ${y + 18} Q${MID} ${y + 22} ${MID + 18} ${y + 18}`}
        fill="none"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
        opacity={0.55}
      />
    </g>
  );
}

/** When each sweet reaches the mouth (ms into the sweets part); it shows a while before, then the mouth chews. */
const ARRIVE_MS = [2300, 5000, 7700];
/** How long the mouth chews each sweet; the crumbs show when it opens again. */
const CHEW_MS = 1200;
/** How long a sweet shows before it reaches the mouth: growing, floating and gliding in (`.origin-sweet` in teeth.css). */
const SHOW_MS = 2288;
/** When each sweet appears in its corner. */
const APPEAR_MS = ARRIVE_MS.map((at) => at - SHOW_MS);

/** One animation per sweet, starting at `times`; set property by property, so the pause rule in teeth.css still holds. */
const perSweet = (names: string[], ms: number, times: number[]): CSSProperties => ({
  animationName: names.join(", "),
  animationDuration: `${ms}ms`,
  animationTimingFunction: "ease-in-out",
  animationDelay: times.map((at) => `${at}ms`).join(", "),
});

/** The open mouth closes over each sweet and opens again once it is chewed. */
const CHEWING = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-chew"),
  CHEW_MS,
  ARRIVE_MS,
);
/** Meanwhile the closed lips chew it: the jaw goes down and up twice, a beat each, a little to the side each time. */
const CHEWING_LIPS = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-chew-lips"),
  CHEW_MS,
  ARRIVE_MS,
);
/** While chewing the eyes close happily and the cheeks glow. */
const HAPPY_EYES = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-happy"),
  CHEW_MS,
  ARRIVE_MS,
);
const GLOW = perSweet(
  ARRIVE_MS.map(() => "teeth-origin-glow"),
  CHEW_MS,
  ARRIVE_MS,
);
/** The brows go up in delight while a sweet shows. */
const DELIGHT = perSweet(
  APPEAR_MS.map(() => "teeth-origin-delight"),
  SHOW_MS,
  APPEAR_MS,
);

/** A crumb of each sweet on two teeth; in the grow part each becomes a monster of its colour (`CRUMB_COLORS`). */
const CRUMBS = [
  { tooth: 2, upper: true, sweet: 0 },
  { tooth: 5, upper: false, sweet: 0 },
  { tooth: 7, upper: true, sweet: 1 },
  { tooth: 2, upper: false, sweet: 1 },
  { tooth: 5, upper: true, sweet: 2 },
  { tooth: 7, upper: false, sweet: 2 },
];

/** Each crumb's colour, that of the sweet or breakfast it comes from: honey, banana and apple in the morning. */
const CRUMB_COLORS: Record<Daytime, string[]> = {
  evening: ["#ff7bd0", "#ff7bd0", "#ff9f43", "#ff9f43", "#b388ff", "#8bd346"],
  morning: ["#f5b82e", "#f5b82e", "#f0cf4a", "#e3bd52", "#ef5a5f", "#8bd346"],
};

/** A tooth's place in the picture, where a crumb lies and its monster grows. */
function crumbAt(c: (typeof CRUMBS)[number]) {
  if (c.upper) return { x: UPPER[c.tooth].x, y: MOUTH.top + 15 };
  const { x } = LOWER[c.tooth];
  return { x, y: bottomAt(x) - 18 };
}

/** A lollipop: a round candy with a pink and white swirl, a soft shade on its lower side and a gloss, on a white stick. */
function Lollipop() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id="origin-lolly" cx="0.38" cy="0.34" r="0.75">
          <stop offset="0" stopColor="#ffb3e6" />
          <stop offset="0.6" stopColor="#ff7bd0" />
          <stop offset="1" stopColor="#e0529f" />
        </radialGradient>
      </defs>
      <rect x={-3.5} y={16} width={7} height={44} rx={3.5} fill="#fff" />
      <path d="M-1 20 V56" stroke="#e6e0f0" strokeWidth={2} />
      <circle r={25} fill="url(#origin-lolly)" />
      <path d="M0 0 a5 5 0 0 1 9 2 a10 10 0 0 1 -17 6 a15 15 0 0 1 22 -18 a20 20 0 0 1 3 26" fill="none" stroke="#fff" strokeWidth={5} opacity={0.9} />
      <ellipse cx={-10} cy={-12} rx={7} ry={4} transform="rotate(-35 -10 -12)" fill="#fff" stroke="none" opacity={0.8} />
    </g>
  );
}

/** A wrapped sweet: a shiny orange candy in yellow paper twisted at both ends, with folds in the paper. */
function Bonbon() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <radialGradient id="origin-bonbon" cx="0.36" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#ffd08a" />
          <stop offset="0.6" stopColor="#ff9f43" />
          <stop offset="1" stopColor="#e57a1f" />
        </radialGradient>
      </defs>
      <path d="M-19 -5 Q-30 -18 -40 -15 Q-34 0 -40 15 Q-30 18 -19 5 Z M19 -5 Q30 -18 40 -15 Q34 0 40 15 Q30 18 19 5 Z" fill="#ffd23f" />
      <path d="M-24 -6 L-35 -10 M-24 6 L-35 10 M24 -6 L35 -10 M24 6 L35 10" stroke="#e0a800" strokeWidth={2} />
      <ellipse rx={23} ry={17} fill="url(#origin-bonbon)" />
      <path d="M-8 -17 Q-2 0 -8 17 M8 -17 Q14 0 8 17" fill="none" stroke="#fff" strokeWidth={2.5} opacity={0.45} />
      <path d="M-13 -8 Q-4 -13 6 -10" fill="none" stroke="#fff" strokeWidth={3.5} opacity={0.85} />
    </g>
  );
}

/** A cupcake: a ridged paper case, a swirl of lilac cream with sprinkles, and a shiny cherry on top. */
function Cupcake() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <defs>
        <linearGradient id="origin-case" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7bd8f5" />
          <stop offset="1" stopColor="#3bb3dd" />
        </linearGradient>
        <radialGradient id="origin-cream" cx="0.4" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#e3d2ff" />
          <stop offset="1" stopColor="#a578f5" />
        </radialGradient>
      </defs>
      <path d="M-23 2 L23 2 L17 33 L-17 33 Z" fill="url(#origin-case)" />
      <path d="M-13 4 L-10 31 M0 4 V31 M13 4 L10 31" fill="none" strokeWidth={2} opacity={0.6} />
      <path d="M-27 4 C-32 -8 -22 -16 -14 -12 C-14 -24 0 -28 4 -18 C10 -26 24 -20 20 -10 C30 -10 32 0 27 4 Z" fill="url(#origin-cream)" />
      <path d="M-16 -4 Q-4 -10 10 -4" fill="none" stroke="#fff" strokeWidth={2.5} opacity={0.6} />
      <path d="M-15 -8 l4 -2 M-2 -14 l3 3 M12 -3 l-3 -3 M-20 0 l2 3" stroke="#8bd346" strokeWidth={3} />
      <path d="M2 -16 Q6 -30 12 -32" fill="none" strokeWidth={2.5} />
      <circle cx={2} cy={-22} r={6.5} fill="#ff4d6d" />
      <circle cx={0} cy={-24} r={1.8} fill="#fff" stroke="none" />
    </g>
  );
}

/** A slice of bread with golden honey on it, running down over the crust in two drips. Flat fills only: the strip's
 * stand-in for its own picture draws it too (`TeethPlay`), so it has no ids to clash. */
export function HoneyBread() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <path
        d="M-26 34 L-26 -6 C-37 -9 -36 -31 -18 -30 C-10 -39 10 -39 18 -30 C36 -31 37 -9 26 -6 L26 34 Q26 39 21 39 L-21 39 Q-26 39 -26 34 Z"
        fill="#c98a4b"
      />
      <path d="M-20 32 L-20 -10 C-29 -12 -28 -25 -15 -24 C-8 -32 8 -32 15 -24 C28 -25 29 -12 20 -10 L20 32 Z" fill="#f6dfae" stroke="none" />
      <path d="M-11 8 l3 1 M6 18 l3 -1 M-6 26 l2 2 M10 2 l2 2" stroke="#dcb77a" strokeWidth={2.5} />
      <path
        d="M-20 -14 C-14 -24 12 -25 20 -15 C23 -10 20 -5 15 -6 L15 6 Q12 12 9 6 L9 -4 C1 -2 -8 -3 -13 -6 L-13 1 Q-16 7 -19 1 L-19 -7 C-22 -9 -22 -12 -20 -14 Z"
        fill="#f5b82e"
      />
      <path d="M-10 -15 Q-2 -19 8 -16" fill="none" stroke="#fff6c2" strokeWidth={3} opacity={0.9} />
    </g>
  );
}

/**
 * A banana with its peel pulled half down: the pale fruit standing up out of it, the yellow peel hanging in two flaps
 * with brown tips, and its little brown stalk at the bottom – the way a child holds one to bite. Flat fills, like the
 * honey bread.
 */
function Banana() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      {/* The fruit, a little bent, standing out of the peel. */}
      <path d="M-9 10 C-11 -8 -8 -24 -1 -33 C1 -35 4 -34 5 -31 C9 -20 10 -6 9 10 Z" fill="#fff6d6" />
      <path d="M2 -26 C5 -16 6 -6 5 4" fill="none" stroke="#ead38e" strokeWidth={2.5} />
      {/* The back flap of the peel, behind the peel's body. */}
      <path d="M-2 6 C2 -2 8 -10 13 -12 C15 -6 12 4 7 12 Z" fill="#e9b10f" />
      {/* The peel's body down to the stalk. */}
      <path d="M-12 8 C-13 24 -9 40 -4 48 L4 48 C9 40 13 24 12 8 C6 12 -6 12 -12 8 Z" fill="#ffd23f" />
      <path d="M-4 48 L-3 56 L3 56 L4 48 Z" fill="#8a5a2b" />
      <path d="M6 16 C7 26 5 36 2 44" fill="none" stroke="#fff3b0" strokeWidth={3} opacity={0.9} />
      {/* The two side flaps hanging out and down, with brown tips. */}
      <path d="M-12 8 C-20 6 -28 12 -32 24 C-31 27 -28 27 -27 25 C-23 18 -17 15 -9 15 Z" fill="#ffd23f" />
      <path d="M-32 24 C-31 27 -28 27 -27 25 L-29 22 Z" fill="#8a5a2b" strokeWidth={2} />
      <path d="M12 8 C20 6 28 12 32 24 C31 27 28 27 27 25 C23 18 17 15 9 15 Z" fill="#ffd23f" />
      <path d="M32 24 C31 27 28 27 27 25 L29 22 Z" fill="#8a5a2b" strokeWidth={2} />
    </g>
  );
}

/** A round red apple with the dip at its top, a brown stalk, a green leaf and a soft light on its cheek. */
function Apple() {
  return (
    <g stroke={INK} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round">
      <path d="M0 -20 C-4 -27 -6 -31 -5 -35" fill="none" stroke="#7a4a24" strokeWidth={4} />
      <path d="M-1 -26 C6 -36 18 -36 22 -30 C14 -22 4 -22 -1 -26 Z" fill="#6cc04a" />
      <path d="M2 -27 Q11 -30 18 -30" fill="none" stroke="#4e9a35" strokeWidth={2} />
      <path d="M0 -19 C8 -26 26 -24 28 -6 C30 10 20 28 8 30 C4 31 2 29 0 29 C-2 29 -4 31 -8 30 C-20 28 -30 10 -28 -6 C-26 -24 -8 -26 0 -19 Z" fill="#ef4b4f" />
      <path d="M12 -12 C20 -6 21 8 16 18" fill="none" stroke="#c8333b" strokeWidth={4} opacity={0.6} />
      <ellipse cx={-14} cy={-8} rx={5} ry={8} transform="rotate(20 -14 -8)" fill="#fff" stroke="none" opacity={0.75} />
    </g>
  );
}

/** What the child eats: three sweets before the evening brushing, breakfast before the morning one (X-19). */
const TREATS: Record<Daytime, (() => ReactElement)[]> = {
  evening: [Lollipop, Bonbon, Cupcake],
  morning: [HoneyBread, Banana, Apple],
};

/**
 * The eyes follow each sweet: up to its corner while it floats, down to the mouth as it glides in, and back to rest
 * only once they are closed over the chewing (`HAPPY_EYES`), so they never jump while seen.
 */
const LOOK = perSweet(
  HEAD_FRAMING.sweets.map((from) => (from.x > W / 2 ? "teeth-origin-look-right" : "teeth-origin-look-left")),
  SHOW_MS + 600,
  APPEAR_MS,
);

/** Where a sweet ends its flight, in the middle of the open mouth, and is bitten. */
const BITE = { x: MID, y: 284 };
/** When the bits fly, after the sweet's arrival: as the teeth close on it. */
const BITE_MS = 90;

/** The colours a sweet crumbles into, and whether its bits are hard shards (candy, apple) or soft crumbs (cake,
 * bread, banana). */
const CRUMBLE: Record<Daytime, { colors: string[]; shards: boolean }[]> = {
  evening: [
    { colors: ["#ff7bd0", "#fff", "#ff7bd0"], shards: true },
    { colors: ["#ff9f43", "#ffd23f", "#ff9f43"], shards: true },
    { colors: ["#b388ff", "#e8b878", "#4cc9f0"], shards: false },
  ],
  morning: [
    { colors: ["#f6dfae", "#c98a4b", "#f5b82e"], shards: false },
    { colors: ["#fff6d6", "#ffd23f", "#fff6d6"], shards: false },
    { colors: ["#fff3d6", "#ef4b4f", "#fff3d6"], shards: true },
  ],
};

/**
 * The bits that break off a sweet as it is bitten: a few, flung out from the bite and falling past the chin, turning
 * and fading – calm, no burst of stars (`teeth-origin-bit`). Spread evenly to both sides, each a little different.
 */
const bitsOf = (crumble: (typeof CRUMBLE)[Daytime]) =>
  crumble.flatMap(({ colors, shards }, sweet) =>
    [0, 1, 2, 3, 4, 5].map((k) => {
      const side = k % 2 ? 1 : -1;
      const out = 1 + Math.floor(k / 2);
      return {
        sweet,
        color: colors[k % colors.length],
        shards,
        size: 4 + ((k * 7 + sweet * 3) % 4),
        dx: side * (14 + out * 16 + sweet * 3),
        up: 26 + ((k * 13 + sweet * 5) % 24),
        fall: 150 + out * 12,
        spin: side * (120 + out * 60),
        at: ARRIVE_MS[sweet] + BITE_MS + (k % 3) * 40,
      };
    }),
  );
const BITS: Record<Daytime, ReturnType<typeof bitsOf>> = { evening: bitsOf(CRUMBLE.evening), morning: bitsOf(CRUMBLE.morning) };

/**
 * What the child hears. In the evening: a cheer when the sweets come, unwrapping the bonbon, a bite and chewing for
 * each, „Mmmh“ at the end. In the morning: the cheer, a soft bite and chewing for the bread and the banana, the
 * apple's crunch and its chewing, and „Mmmh“.
 */
export const ORIGIN_CUES: Record<Daytime, Cue[]> = {
  evening: [
    { at: APPEAR_MS[0] + 500, play: () => playRecorded("yay", playGiggle) },
    { at: APPEAR_MS[1] + 700, play: () => playRecorded("wrapper", playRustle) },
    ...ARRIVE_MS.flatMap((at, i) => [
      { at: at + 300, play: i === 2 ? () => playRecorded("munch", playMunch) : () => playRecorded("lolly", playCrunch) },
      { at: at + 600, play: () => playRecorded("chew", playMunch) },
    ]),
    { at: ARRIVE_MS[2] + CHEW_MS + 150, play: () => playRecorded("yum", playYum) },
  ].sort((a, b) => a.at - b.at),
  morning: [
    { at: APPEAR_MS[0] + 500, play: () => playRecorded("yay", playGiggle) },
    { at: ARRIVE_MS[0] + 300, play: () => playRecorded("munch", playMunch) },
    { at: ARRIVE_MS[0] + 600, play: () => playRecorded("chew", playMunch) },
    { at: ARRIVE_MS[1] + 300, play: () => playRecorded("munch", playMunch) },
    { at: ARRIVE_MS[1] + 600, play: () => playRecorded("chew", playMunch) },
    { at: ARRIVE_MS[2] + 300, play: () => playRecorded("chew", playCrunch) },
    { at: ARRIVE_MS[2] + 600, play: () => playRecorded("chew", playMunch) },
    { at: ARRIVE_MS[2] + CHEW_MS + 150, play: () => playRecorded("yum", playYum) },
  ].sort((a, b) => a.at - b.at),
};

/** The recordings the story plays, to load before it starts. */
export const ORIGIN_RECORDINGS = ["yay", "wrapper", "lolly", "munch", "chew", "yum"];

/** The sky behind the child: one calm colour, the same in the morning and the evening (user request, November 2026). */
const SKY = "#c4f1ff";

/** A point of the head (head units round its middle, `face.tsx`) in the story's picture: the head stands straight here. */
const onStoryHead: HeadMap = (x, y) => ({ x: HEAD.x + x, y: HEAD.y + y });
/** The eyes' middles. */
const EYES = [-1, 1].map((s) => ({ s: s as -1 | 1, x: HEAD.x + s * FACE.eyes.x, y: HEAD.y + FACE.eyes.y }));

/** An eye's white with its lid (and the girl's lashes); its iris is a layer of its own over it (Pupil). */
function EyeWhite({ x, y, side }: { x: number; y: number; side: -1 | 1 }) {
  // The girl (👧 on the home page) has three lashes at the outer top.
  const girl = useFigure() === "girl";
  return (
    <g>
      {girl && (
        <path
          d={LASHES.map(([x1, y1, x2, y2]) => `M${x + side * x1} ${y + y1} L${x + side * x2} ${y + y2}`).join(" ")}
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
      )}
      <EyeBall x={x} y={y} rx={FACE.eyes.rx} ry={FACE.eyes.ry} />
    </g>
  );
}

/** Where the iris lies in the eye's opening (`eyeOpening`), which clips it, so it never reaches past the eye. */
const OPENING = eyeOpening(FACE.eyes.rx, FACE.eyes.ry);

/**
 * An eye's iris with its pupil and lights, in a clip the shape of the eye's white: it follows the sweets, and looks down
 * at the teeth while the monsters grow. It rests a little low in the eye, looking at the viewer.
 */
function Pupil({ x, y, look }: { x: number; y: number; look?: CSSProperties }) {
  const r = FACE.eyes.iris;
  const clip = { x: x - OPENING.rx, y: y - OPENING.ry, width: 2 * OPENING.rx, height: 2 * OPENING.ry };
  return (
    <div className="teeth-piece origin-eye-clip" style={{ left: clip.x, top: clip.y, width: clip.width, height: clip.height }}>
      <Piece area={{ x: x - r - 2, y: y + 3 - r - 2, width: 2 * r + 4, height: 2 * r + 4 }} within={clip} className="origin-pupil" style={look}>
        <Iris x={x} y={y + 3} r={r} />
      </Piece>
    </div>
  );
}

/** The brows, each turning round its middle (the middle of its piece) as it goes up in delight or worry. */
export const BROWS = [
  { side: "left", d: "M140 150 Q160 140 180 148", area: { x: 134, y: 136, width: 52, height: 20 } },
  { side: "right", d: "M260 148 Q280 140 300 150", area: { x: 254, y: 136, width: 52, height: 20 } },
];

/** The mouth with its teeth, the crumbs on them and the monsters growing out of them. */
const MOUTH_AREA: Box = { x: 100, y: 234, width: 240, height: 120 };
/** Round the picture's corner, where each sweet is drawn before its keyframes move it into place. */
const SWEET_AREA: Box = { x: -42, y: -36, width: 84, height: 98 };

/** The story filling the screen; `free` is the part between heading and controls, where the head has to fit. */
export function Origin({
  part,
  daytime,
  tickled,
  onTickle,
  free,
}: {
  part: OriginPart;
  daytime: Daytime;
  /** The monster that was just tapped and giggles. */
  tickled: number | null;
  onTickle: (id: number) => void;
  free: RefObject<HTMLElement | null>;
}) {
  const t = useT();
  const scene = useRef<HTMLDivElement>(null);
  const room = useRoom(scene, free);
  const { framing, box, unit } = framingFor(room);
  const frame = screenFrame(box, unit);
  const bottom = box.y + box.height;
  const sweets = part === "sweets";
  const figure = useFigure();
  const girl = figure === "girl";
  // The camera zooms in on the mouth while the monsters grow: the whole picture is scaled as an HTML layer, which the
  // browser moves without painting it again, so the picture goes from showing `box` to showing `close`.
  const close = fitBox(room, MOUTH_FOCUS);
  const camera = {
    "--zoom": (unit / close.unit).toFixed(4),
    "--zoom-x": `${((box.x - close.box.x) / close.unit).toFixed(1)}px`,
    "--zoom-y": `${((box.y - close.box.y) / close.unit).toFixed(1)}px`,
  } as CSSProperties;
  /** Picture units on the screen, for the moving pieces: a point of the picture lands where the svgs show it. */
  const space = pictureSpace(box, unit);
  const viewBox = `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`;
  const label =
    part === "sweets" && daytime === "morning"
      ? t({
          en: "A child eats breakfast",
          de: "Ein Kind frühstückt",
          zh: "一个孩子在吃早饭",
          hi: "एक बच्चा नाश्ता कर रहा है",
          es: "Un niño desayuna",
          ar: "طفل يتناول الفطور",
          ru: "Ребёнок завтракает",
        })
      : part === "sweets"
        ? t({
            de: "Ein Kind isst Süßigkeiten",
            en: "A child eats sweets",
            zh: "一个孩子在吃甜食",
            hi: "एक बच्चा मिठाई खा रहा है",
            es: "Un niño come dulces",
            ar: "طفل يأكل الحلوى",
            ru: "Ребёнок ест сладости",
          })
        : t({
            de: "Aus dem Zucker auf den Zähnen wachsen kleine Monster",
            en: "Little monsters grow out of the sugar on the teeth",
            zh: "牙齿上的糖长成了小怪兽",
            hi: "दाँतों पर लगी चीनी से छोटे मॉन्स्टर बनते हैं",
            es: "Del azúcar en los dientes crecen monstruitos",
            ar: "من السكر على الأسنان تنمو وحوش صغيرة",
            ru: "Из сахара на зубках вырастают маленькие монстры",
          });
  // The picture is still pictures with small moving ones between them, each moving piece an HTML layer of its own
  // (Piece): the sky behind, the child, and on
  // the child its brows, pupils, cheeks, chewing mouth, the sweets and the bits they crumble into. Something animated inside an svg has the
  // phone paint that svg again in every frame: with all of it in one picture, the story painted more than the budget.
  return (
    <div ref={scene} className={`origin at-${part} ${daytime}`}>
      <div className="origin-camera" style={camera}>
        <svg className="origin-picture" viewBox={viewBox} aria-hidden>
          <rect {...frame} fill={SKY} />
        </svg>

        <svg className="origin-picture" viewBox={viewBox} role="img" aria-label={label} style={FRAME_CLIP}>
          <defs>
            <PyjamaPattern id="origin-pyjama" figure={figure} />
            <SkinGradient id="origin-skin" head={HEAD} />
          </defs>

          <g>
            {/* Shoulders in the boy's or the girl's T-shirt, or pyjamas in the evening (`clothes.tsx`), down to the screen's bottom. */}
            <path
              d={`M20 ${Math.max(480, bottom + 20)} V440 C20 395 110 365 ${W / 2} 365 C330 365 420 395 420 440 V${Math.max(480, bottom + 20)} Z`}
              fill={topFill(figure, daytime, "origin-pyjama")}
              stroke={INK}
              strokeWidth={5}
            />

            {/* The girl (👧 on the home page): two pigtails behind the head; their bands come over the hair below. */}
            {/* The child's head with the parts the mirror's face is drawn with too (`face.tsx`): the same child. */}
            {girl &&
              [-1, 1].map((s) => {
                const tail = onStoryHead(s * FACE.pigtails.x, FACE.pigtails.y);
                return (
                  <ellipse
                    key={s}
                    cx={tail.x}
                    cy={tail.y}
                    rx={FACE.pigtails.rx}
                    ry={FACE.pigtails.ry}
                    transform={`rotate(${s * -35} ${tail.x} ${tail.y})`}
                    fill={HAIR}
                    stroke={INK}
                    strokeWidth={5}
                  />
                );
              })}
            {([-1, 1] as const).map((s) => {
              const ear = onStoryHead(s * FACE.ears.x, FACE.ears.y);
              return <Ear key={s} x={ear.x} y={ear.y} r={FACE.ears.r} side={s} />;
            })}
            <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="url(#origin-skin)" stroke={INK} strokeWidth={5} />
            <Hair at={onStoryHead} />
            {girl &&
              [-1, 1].map((s) => {
                const band = onStoryHead(s * FACE.bands.x, FACE.bands.y);
                return <circle key={s} cx={band.x} cy={band.y} r={FACE.bands.r} fill={clothesOf(figure).band} stroke={INK} strokeWidth={4} />;
              })}

            {EYES.map((eye) => (
              <EyeWhite key={eye.s} x={eye.x} y={eye.y} side={eye.s} />
            ))}
            <Nose x={HEAD.x} y={HEAD.y + FACE.nose.y} r={FACE.nose.r} />
          </g>
        </svg>

        <div className="teeth-space" style={space}>
          {BROWS.map((brow) => (
            <Piece key={brow.side} area={brow.area} className={`origin-brow ${brow.side}`} style={sweets ? DELIGHT : undefined}>
              <path d={brow.d} fill="none" stroke={BROW} strokeWidth={6} strokeLinecap="round" />
            </Piece>
          ))}
          {EYES.map((eye) => (
            <Pupil key={eye.s} x={eye.x} y={eye.y} look={sweets ? LOOK : undefined} />
          ))}
          {/* The lids lie over the irises' tops; they stand still. */}
          <Piece area={{ x: EYES[0].x - 30, y: EYES[0].y - 34, width: EYES[1].x - EYES[0].x + 60, height: 32 }} className="origin-still">
            {EYES.map((eye) => (
              <EyeLid key={eye.s} x={eye.x} y={eye.y} rx={FACE.eyes.rx} ry={FACE.eyes.ry} />
            ))}
          </Piece>
          {/* Happy closed eyes while chewing: skin over the eye (in the head's own light) and a smiling arc. */}
          {sweets && (
            <Piece area={{ x: 126, y: 150, width: 188, height: 72 }} className="origin-happy-eyes" style={HAPPY_EYES}>
              <defs>
                <SkinGradient id="origin-happy-skin" head={HEAD} />
              </defs>
              {EYES.map(({ s, x, y }) => (
                <g key={s}>
                  <ellipse cx={x} cy={y + 2} rx={30} ry={34} fill="url(#origin-happy-skin)" />
                  <path d={`M${x - 20} ${y + 8} Q${x} ${y - 16} ${x + 20} ${y + 8}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
                </g>
              ))}
            </Piece>
          )}
          {/* The cheeks sit up beside the eyes, clear of the open mouth's corners (they once lay right on them). */}
          {CHEEKS.map((cx) => (
            <Piece
              key={cx}
              area={{ x: cx - CHEEK.rx, y: CHEEK.y - CHEEK.ry, width: 2 * CHEEK.rx, height: 2 * CHEEK.ry }}
              className="origin-cheek"
              style={sweets ? GLOW : undefined}
            >
              <defs>
                <radialGradient id={`origin-cheek-${cx}`}>
                  <stop offset="0" stopColor="#ff7f99" stopOpacity={0.85} />
                  <stop offset="0.6" stopColor="#ff8fab" stopOpacity={0.6} />
                  <stop offset="1" stopColor="#ff8fab" stopOpacity={0} />
                </radialGradient>
              </defs>
              <ellipse cx={cx} cy={CHEEK.y} rx={CHEEK.rx} ry={CHEEK.ry} fill={`url(#origin-cheek-${cx})`} />
            </Piece>
          ))}

          {/* The mouth closes over each sweet and the closed lips chew it (`CHEWING_LIPS`), then it opens again. */}
          {sweets && (
            <Piece area={CLOSED_AREA} pivot={{ x: MID, y: CLOSED.y }} className="origin-chewing" style={CHEWING_LIPS}>
              <ClosedMouth />
            </Piece>
          )}
          <Piece
            area={MOUTH_AREA}
            className="origin-mouth"
            style={{ transformOrigin: `${MID - MOUTH_AREA.x}px ${MOUTH.top + 6 - MOUTH_AREA.y}px`, ...(sweets ? CHEWING : undefined) }}
            over={
              <>
                {/* While the monsters grow the sugar stains the teeth yellow and grey, as the mirror shows them before
                    the brushing: a layer of its own over the mouth that fades in by its opacity. */}
                {part === "grow" && (
                  <Piece area={MOUTH_AREA} within={MOUTH_AREA} className="origin-stain">
                    <StainedTeeth />
                  </Piece>
                )}
                {/* Sugar crumbs: they show once the mouth opens after its sweet, and in the grow part each becomes a monster. */}
                {CRUMBS.map((c, i) => {
                  const { x, y } = crumbAt(c);
                  const color = CRUMB_COLORS[daytime][i];
                  return (
                    <Piece
                      key={i}
                      area={{ x: x - 9, y: y - 6, width: 17, height: 15 }}
                      within={MOUTH_AREA}
                      className="origin-crumb"
                      style={{ "--crumb": `${ARRIVE_MS[c.sweet] + CHEW_MS - 200}ms`, "--grow": `${600 + i * 700}ms` } as CSSProperties}
                    >
                      <circle cx={x - 5} cy={y + 2} r={3.8} fill={color} stroke={INK} strokeWidth={1.3} />
                      <circle cx={x + 5} cy={y - 2} r={3} fill={color} stroke={INK} strokeWidth={1.3} />
                      <circle cx={x + 2.5} cy={y + 6} r={2.5} fill="#fff" stroke={INK} strokeWidth={1.3} />
                    </Piece>
                  );
                })}
                {part === "grow" &&
                  CRUMBS.map((c, i) => {
                    const { x, y } = crumbAt(c);
                    // Its foot (9.5 below its middle at this size) is the bottom middle of its piece, where it grows from.
                    return (
                      <Piece
                        key={i}
                        area={{ x: x - 11, y: y - 18, width: 22, height: 27.5 }}
                        within={MOUTH_AREA}
                        className={`origin-monster${tickled === FIRST_ID + i ? " tickled" : ""}`}
                        style={{ "--grow": `${600 + i * 700}ms` } as CSSProperties}
                      >
                        <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(0.63)`}>
                          <Monster
                            color={CRUMB_COLORS[daytime][i]}
                            variant={i % 3}
                            still
                            gone={false}
                            scared={false}
                            tickled={tickled === FIRST_ID + i}
                            blinkMs={i * 900}
                            onTickle={() => onTickle(FIRST_ID + i)}
                          />
                        </g>
                      </Piece>
                    );
                  })}
              </>
            }
          >
            <defs>
              <clipPath id="origin-mouth">
                <path d={MOUTH_PATH} />
              </clipPath>
            </defs>
            <path d={MOUTH_PATH} fill="#7a1f3d" />
            <g clipPath="url(#origin-mouth)">
              {/* The tongue lies behind the lower teeth. */}
              <ellipse cx={MID} cy={MOUTH.top + MOUTH.depth - 28} rx={52} ry={20} fill="#ff7088" />
              <path d={`M${MID} ${MOUTH.top + MOUTH.depth - 42} V${MOUTH.top + MOUTH.depth - 24}`} stroke="#e2577c" strokeWidth={3} strokeLinecap="round" />
              <g fill="#fffdf6" stroke={INK} strokeWidth={2.5}>
                {UPPER.map((tooth, i) => (
                  <rect key={`u${i}`} {...toothRect(tooth, true)} />
                ))}
                {LOWER.map((tooth, i) => (
                  <rect key={`l${i}`} {...toothRect(tooth, false)} />
                ))}
              </g>
              {/* The gum over the teeth's roots, with a darker edge where they come out of it. */}
              {(["upper", "lower"] as const).map((jaw) => (
                <g key={jaw}>
                  <path d={GUM_PATHS[jaw]} fill="#ff8fab" />
                  <path d={edgePath(GUM_EDGE[jaw])} fill="none" stroke="#e2577c" strokeWidth={3} strokeLinejoin="round" />
                </g>
              ))}
            </g>
            {/* Lips round the opening, as the mirror's: a soft pink band with its outline – slim, a small child's lips –
                and a light on the lower lip. */}
            <path d={MOUTH_PATH} fill="none" stroke={INK} strokeWidth={11} strokeLinejoin="round" />
            <path d={MOUTH_PATH} fill="none" stroke={LIP} strokeWidth={6} strokeLinejoin="round" />
            <path d="M196 340 Q220 345 244 340" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.55} />
            {/* Little creases beside the corners, where the smile pushes the cheeks up. */}
            {MOUTH_CORNERS.map(({ x, y }, i) => {
              const s = i ? 1 : -1;
              return (
                <path
                  key={s}
                  d={`M${x + s * 7} ${y - 14} Q${x + s * 13} ${y - 4} ${x + s * 8} ${y + 6}`}
                  fill="none"
                  stroke={SKIN_SHADE}
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              );
            })}
          </Piece>

          {/* Each sweet appears big in a top corner, floats a moment, then flies into the mouth in an arc: it lifts a
              little and swoops down, turning towards where it goes, and is squeezed as the teeth bite (`teeth-origin-sweet`).
              Its pieces lie round the picture's corner (0, 0), where the sweet is drawn and from where the keyframes
              move it: the outer one across (`-x`), the inner one up and down, so the two make the arc. */}
          {sweets &&
            TREATS[daytime].map((Sweet, i) => (
              <Piece
                key={i}
                area={SWEET_AREA}
                className="origin-sweet-x"
                style={
                  {
                    "--arrive": `${ARRIVE_MS[i]}ms`,
                    "--sx": `${framing.sweets[i].x}px`,
                    "--sy": `${framing.sweets[i].y}px`,
                    "--bx": `${BITE.x}px`,
                    "--by": `${BITE.y}px`,
                    "--tilt": `${framing.sweets[i].x > W / 2 ? -18 : 18}deg`,
                  } as CSSProperties
                }
                over={
                  <Piece area={SWEET_AREA} within={SWEET_AREA} className="origin-sweet">
                    <Sweet />
                  </Piece>
                }
              />
            ))}
          {/* As the teeth close on a sweet, a few bits break off it and fall past the chin. */}
          {sweets &&
            BITS[daytime].map((bit, i) => (
              <Piece
                key={i}
                area={{ x: BITE.x - 8, y: BITE.y - 8, width: 16, height: 16 }}
                className="origin-bit"
                style={
                  {
                    "--at": `${bit.at}ms`,
                    "--dx": `${bit.dx}px`,
                    "--up": `${bit.up}px`,
                    "--fall": `${bit.fall}px`,
                    "--spin": `${bit.spin}deg`,
                  } as CSSProperties
                }
              >
                {bit.shards ? (
                  <path
                    d={`M${BITE.x - bit.size} ${BITE.y + bit.size * 0.4} L${BITE.x - bit.size * 0.2} ${BITE.y - bit.size} L${BITE.x + bit.size} ${BITE.y - bit.size * 0.1} L${BITE.x + bit.size * 0.3} ${BITE.y + bit.size * 0.8} Z`}
                    fill={bit.color}
                    stroke={INK}
                    strokeWidth={1.5}
                    strokeLinejoin="round"
                  />
                ) : (
                  <circle cx={BITE.x} cy={BITE.y} r={bit.size * 0.8} fill={bit.color} stroke={INK} strokeWidth={1.5} />
                )}
              </Piece>
            ))}
        </div>
      </div>
      {/* The frame stays at the screen's edge while the camera moves. */}
      <svg className="origin-frame" viewBox={`${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.width.toFixed(1)} ${box.height.toFixed(1)}`} aria-hidden>
        <FrameStroke frame={frame} unit={unit} />
      </svg>
    </div>
  );
}
