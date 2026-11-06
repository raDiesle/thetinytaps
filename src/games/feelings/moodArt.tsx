// The drawings of the book „Gefühle“: the little bear standing, his gestures as strong as the feeling the child slides
// to in „Wie geht's dir?“ (C-36), and his face big (`BigFace`: „Tief pusten“, and the eight feelings' faces kept
// from the removed „Gefühle nachmachen“, C-35, to use again). Always the same little bear
// in his light blue T-shirt and dark blue trousers, as in the pictures (user feedback, November 2026: one figure, and
// fox and bear always wear clothes). Drawn once per step, still; only the breath's circle moves, an HTML layer of its own.

import { memo, useId } from "react";
import { Arm, BODY, Foot, MASCOT_COLORS, MASCOT_INK, MascotHead } from "@/components/Mascot";
import type { Mood, MoodFace, MoodId } from "./mood";

/** The little bear's clothes, the colours of his T-shirt and trousers in the Gemini pictures. */
const SHIRT = "#8fc6ec";
const TROUSERS = "#5a5ea6";

type Point = [number, number];

/** How the bear stands at one end of the slider: his arms (`via`, `to` from each shoulder) and his body. */
interface Pose {
  left: [Point, Point];
  right: [Point, Point];
  /** Pixels up (negative: on tiptoes, jumping) or down (sinking, slumping). */
  y?: number;
  /** Degrees the head tips to the side (the face's own `tilt` comes on top: a proud chin up). */
  tilt?: number;
  /** Pixels the head drops onto the chest. */
  headDrop?: number;
  /** How small he makes himself (1 = as he is). */
  scale?: number;
}

/** Arms hanging loosely: where every feeling starts, a little of it showing. */
const LOOSE: Pose = {
  left: [
    [40, 210],
    [46, 238],
  ],
  right: [
    [160, 210],
    [154, 238],
  ],
};

/**
 * Each feeling at its strongest, the faces it shows from a little to a whole lot (three, by the slider's third), and
 * what grows with it: the tear of the sad bear, the red cheeks of the angry one.
 */
const GESTURES: Record<MoodId, { strong: Pose; faces: [MoodFace, MoodFace, MoodFace] }> = {
  // Jumping for joy, both arms up.
  froh: {
    strong: {
      left: [
        [34, 152],
        [30, 114],
      ],
      right: [
        [166, 152],
        [170, 114],
      ],
      y: -16,
    },
    faces: [
      { eyes: "open", mouth: "smile", brows: "soft" },
      { eyes: "happy", mouth: "smile", brows: "soft" },
      { eyes: "happy", mouth: "open", brows: "soft" },
    ],
  },
  // Paws on the hips, chin up.
  stolz: {
    strong: {
      left: [
        [20, 196],
        [52, 222],
      ],
      right: [
        [180, 196],
        [148, 222],
      ],
      y: -4,
    },
    faces: [
      { eyes: "open", mouth: "smile", brows: "soft" },
      { eyes: "happy", mouth: "smile", brows: "up" },
      { eyes: "happy", mouth: "smile", brows: "up" },
    ],
  },
  // On tiptoes, paws clenched before the chest.
  aufgeregt: {
    strong: {
      left: [
        [54, 214],
        [84, 176],
      ],
      right: [
        [146, 214],
        [116, 176],
      ],
      y: -12,
    },
    faces: [
      { eyes: "open", mouth: "smile", brows: "up" },
      { eyes: "wide", mouth: "smile", brows: "up" },
      { eyes: "wide", mouth: "open", brows: "up" },
    ],
  },
  // Paws folded on the tummy, the head leaning a little, eyes closing.
  ruhig: {
    strong: {
      left: [
        [46, 216],
        [88, 220],
      ],
      right: [
        [154, 216],
        [112, 220],
      ],
      y: 4,
      tilt: 8,
    },
    faces: [
      { eyes: "open", mouth: "smile", brows: "soft" },
      { eyes: "half", mouth: "smile", brows: "soft" },
      { eyes: "shut", mouth: "smile", brows: "soft" },
    ],
  },
  // Slumping, the head tipping, one paw rubbing an eye.
  muede: {
    strong: {
      left: [
        [44, 216],
        [54, 250],
      ],
      right: [
        [176, 160],
        [120, 100],
      ],
      y: 8,
      tilt: 12,
    },
    faces: [
      { eyes: "open", mouth: "smile", brows: "soft" },
      { eyes: "half", mouth: "smile", brows: "soft" },
      { eyes: "half", mouth: "o", brows: "soft" },
    ],
  },
  // Arms hanging heavy and close, the head dropping.
  traurig: {
    strong: {
      left: [
        [52, 216],
        [62, 252],
      ],
      right: [
        [148, 216],
        [138, 252],
      ],
      y: 8,
      headDrop: 12,
    },
    faces: [
      { eyes: "open", mouth: "frown", brows: "soft" },
      { eyes: "open", mouth: "frown", brows: "sad" },
      { eyes: "half", mouth: "frown", brows: "sad" },
    ],
  },
  // Fists up, teeth clenched, red in the face.
  wuetend: {
    strong: {
      left: [
        [26, 176],
        [40, 138],
      ],
      right: [
        [174, 176],
        [160, 138],
      ],
    },
    faces: [
      { eyes: "open", mouth: "frown", brows: "soft" },
      { eyes: "open", mouth: "frown", brows: "angry" },
      { eyes: "open", mouth: "grin", brows: "angry" },
    ],
  },
  // Making himself small, paws up before the mouth.
  angst: {
    strong: {
      left: [
        [60, 206],
        [88, 150],
      ],
      right: [
        [140, 206],
        [112, 150],
      ],
      y: 10,
      scale: 0.9,
    },
    faces: [
      { eyes: "open", mouth: "frown", brows: "sad" },
      { eyes: "wide", mouth: "frown", brows: "sad" },
      { eyes: "wide", mouth: "o", brows: "sad" },
    ],
  },
};

const mix = (a: number, b: number, t: number) => +(a + (b - a) * t).toFixed(1);
const mixPoint = (a: Point, b: Point, t: number): Point => [mix(a[0], b[0], t), mix(a[1], b[1], t)];

/** The point a fifth along the arm from the shoulder: where the T-shirt's short sleeve ends. */
function sleeveEnd(from: Point, via: Point, to: Point): Point {
  const t = 0.22;
  const at = (i: 0 | 1) => +((1 - t) ** 2 * from[i] + 2 * (1 - t) * t * via[i] + t ** 2 * to[i]).toFixed(1);
  return [at(0), at(1)];
}

/** One arm with the T-shirt's short sleeve over its top. */
function DressedArm({ from, via, to }: { from: Point; via: Point; to: Point }) {
  const end = sleeveEnd(from, via, to);
  const d = `M${from[0]} ${from[1]} L${end[0]} ${end[1]}`;
  return (
    <>
      <Arm from={from} via={via} to={to} kind="bear" />
      <path d={d} stroke={MASCOT_INK} strokeWidth="38" strokeLinecap="round" />
      <path d={d} stroke={SHIRT} strokeWidth="30" strokeLinecap="round" />
    </>
  );
}

/**
 * The little bear standing, showing `mood` as strong as `step` of `steps` (0 a little, `steps - 1` a whole lot): his
 * arms, his body and his face go from a little of the feeling to all of it (C-36, user feedback, November 2026: the
 * gesture shows how strong it is). Built once per step.
 */
export const FeelingBear = memo(function FeelingBear({ mood, step, steps }: { mood: Mood; step: number; steps: number }) {
  // Even „a little“ shows the feeling a little.
  const t = 0.15 + (0.85 * step) / Math.max(1, steps - 1);
  const { strong, faces } = GESTURES[mood.id];
  const face = faces[Math.min(2, Math.floor(t * 3 - 0.0001))];
  const c = MASCOT_COLORS.bear;
  const left = mixPoint(LOOSE.left[0], strong.left[0], t);
  const leftTo = mixPoint(LOOSE.left[1], strong.left[1], t);
  const right = mixPoint(LOOSE.right[0], strong.right[0], t);
  const rightTo = mixPoint(LOOSE.right[1], strong.right[1], t);
  const y = mix(0, strong.y ?? 0, t);
  const scale = mix(1, strong.scale ?? 1, t);
  const tilt = mix(0, (strong.tilt ?? 0) + (face.tilt ?? 0), t);
  const headDrop = mix(0, strong.headDrop ?? 0, t);
  const angry = mood.id === "wuetend";
  const clip = useId();
  return (
    <span className="mood-art mood-bear" aria-hidden>
      <svg viewBox="0 -20 200 320">
        <ellipse cx="100" cy="292" rx={mix(66, 50, Math.max(0, -y) / 20)} ry="7" fill="#3a2418" opacity="0.14" />
        <g transform={`translate(100 280) scale(${scale}) translate(-100 ${-280 + y})`}>
          <Foot x={78} kind="bear" />
          <Foot x={122} kind="bear" />
          <path d={BODY} fill={c.fur} />
          {/* The T-shirt down to the belly, the trousers below it, both cut to the body's shape. */}
          <clipPath id={clip}>
            <path d={BODY} />
          </clipPath>
          <g clipPath={`url(#${clip})`}>
            <rect x="30" y="130" width="140" height="102" fill={SHIRT} />
            <rect x="30" y="232" width="140" height="60" fill={TROUSERS} />
            <path d="M30 232 H170" stroke={MASCOT_INK} strokeWidth="3" />
            <path d="M100 250 V282" stroke={MASCOT_INK} strokeWidth="3" />
          </g>
          <path d={BODY} fill="none" stroke={MASCOT_INK} strokeWidth="4.5" strokeLinejoin="round" />
          <DressedArm from={[58, 178]} via={left} to={leftTo} />
          <DressedArm from={[142, 178]} via={right} to={rightTo} />
          <g transform={`translate(0 ${headDrop}) rotate(${tilt} 100 150) translate(32.5 28) scale(1.35)`}>
            <MascotHead kind="bear" child eyes={face.eyes} mouth={face.mouth} brows={face.brows}>
              {angry && (
                <g fill="#e8484a" opacity={mix(0, 0.55, t)}>
                  {CHEEKS}
                </g>
              )}
              {mood.id === "traurig" && t > 0.8 && <path d="M33 60 Q29 67 33 70 Q37 67 33 60 Z" fill="#6ec1f2" stroke={MASCOT_INK} strokeWidth="1.5" />}
            </MascotHead>
          </g>
        </g>
      </svg>
    </span>
  );
});

/** Two red cheeks in the head's box, for the angry bear. */
const CHEEKS = (
  <>
    <ellipse cx="29" cy="63" rx="6.5" ry="4" />
    <ellipse cx="71" cy="63" rx="6.5" ry="4" />
  </>
);

/**
 * The little bear's face, big, making a feeling's face (`Mood.face`; drawn for the removed „Gefühle nachmachen“, C-35,
 * and kept to use again); `blowing` shows him blowing out
 * slowly instead, with a soft circle that grows and shrinks behind him for each breath („Tief pusten“).
 */
export function BigFace({ face, blowing = false }: { face: MoodFace; blowing?: boolean }) {
  const shown = blowing ? { eyes: "shut" as const, mouth: "o" as const, brows: "soft" as const } : face;
  return (
    <span className="mood-art mood-face" aria-hidden>
      {blowing && <span className="mood-breath" />}
      <svg viewBox="0 4 100 92">
        <g transform={`rotate(${blowing ? 0 : (face.tilt ?? 0)} 50 56)`}>
          <MascotHead kind="bear" child eyes={shown.eyes} mouth={shown.mouth} brows={shown.brows} />
        </g>
      </svg>
    </span>
  );
}
