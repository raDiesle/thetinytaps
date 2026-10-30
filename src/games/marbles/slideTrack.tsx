// „Wasserrutsche“ (K-18): the marble run in a swimming hall. A beach ball, a
// swim ring, a melon, a rubber duck and a water drop slide down blue water
// chutes into a little pool, and when it is full fountains spray up out of it.

import { memo, useId } from "react";
import { playBlub, playBoing, playDrops, playPop, playQuack, playSplash, playThump } from "@/lib/sfx";
import { VIEW_W, wobble } from "./level";
import { BALL_R, type Pt } from "./path";
import { BASKET, TRACK_H } from "./track";
import { type EndProps, INK, type ThingProps, type TrackTheme } from "./trackTheme";

const WATER = "#4cc9f0";
const FOAM = "#e0f7ff";

/** A slice of a circle of radius `r` from `a0` to `a1` degrees, as a path from the middle. */
const wedge = (r: number, a0: number, a1: number) => {
  const p = (a: number) => `${(r * Math.cos((a * Math.PI) / 180)).toFixed(1)} ${(r * Math.sin((a * Math.PI) / 180)).toFixed(1)}`;
  return `M0 0 L${p(a0)} A${r} ${r} 0 0 1 ${p(a1)} Z`;
};

/** Pale blue tiles, like a swimming hall's wall. */
const SlideBackdrop = memo(function SlideBackdrop() {
  const id = useId();
  return (
    <g>
      <defs>
        <pattern id={`${id}tiles`} width="64" height="64" patternUnits="userSpaceOnUse">
          <rect width="64" height="64" fill="#c4ecf7" />
          <path d="M0 0.5 H64 M0.5 0 V64" stroke="#fff" strokeWidth="3" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}tiles)`} />
      {/* A band of darker tiles along the bottom */}
      <rect x="-400" y="2200" width={VIEW_W + 800} height="250" fill="#7fd4ef" />
    </g>
  );
});

/** A blue water chute with water running in it. */
function SlideRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g strokeLinecap="round">
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="20" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#1b8fc4" strokeWidth="14" />
      <line x1={a.x + 4} y1={a.y + off - 6} x2={b.x - 4} y2={b.y + off - 6} stroke={WATER} strokeWidth="6" opacity="0.9" />
      <line x1={a.x + 10} y1={a.y + off - 6} x2={b.x - 10} y2={b.y + off - 6} stroke={FOAM} strokeWidth="2" strokeDasharray="10 24" />
    </g>
  );
}

/** A beach ball, a swim ring, a melon, a rubber duck and a water drop. */
function SlideThing({ kind, spin }: ThingProps) {
  const deg = (spin * 180) / Math.PI;
  switch (kind) {
    case "marble":
      return (
        <g>
          <circle r={BALL_R} fill="#fff" />
          <g transform={`rotate(${deg})`}>
            <path d={wedge(BALL_R, 0, 60)} fill="#ff5d73" />
            <path d={wedge(BALL_R, 120, 180)} fill="#3a86ff" />
            <path d={wedge(BALL_R, 240, 300)} fill="#ffd23f" />
            <circle r="5" fill="#fff" stroke={INK} strokeWidth="2" />
          </g>
          <circle r={BALL_R} fill="none" stroke={INK} strokeWidth="3" />
          <circle cx="-8" cy="-9" r="4.5" fill="#fff" opacity="0.8" />
        </g>
      );
    case "tennis":
      return (
        <g>
          <circle r="17" fill="none" stroke="#ff5d73" strokeWidth="14" />
          <circle r="17" fill="none" stroke="#fff" strokeWidth="14" strokeDasharray="13.35 13.35" transform={`rotate(${deg})`} />
          <circle r="24" fill="none" stroke={INK} strokeWidth="3" />
          <circle r="10" fill="none" stroke={INK} strokeWidth="3" />
        </g>
      );
    case "iron":
      return (
        <g>
          <circle r="25" fill="#3ea34b" stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill="none" stroke="#1f6e2b" strokeWidth="4" strokeLinecap="round">
            <path d="M0 -24 Q-12 0 0 24" />
            <path d="M-14 -20 Q-24 0 -14 20" />
            <path d="M14 -20 Q4 0 14 20" />
          </g>
          <ellipse cx="-9" cy="-12" rx="6" ry="3.5" fill="#fff" opacity="0.45" transform="rotate(-35 -9 -12)" />
        </g>
      );
    case "apple":
      // The rubber duck slides upright, rocking a little.
      return (
        <g transform={`rotate(${8 * Math.sin(spin * 0.7)} 0 20)`}>
          <path d="M-22 2 Q-28 -10 -20 -10 Q-16 -2 -12 0" fill="#ffd23f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <ellipse cx="0" cy="8" rx="22" ry="14" fill="#ffd23f" stroke={INK} strokeWidth="3" />
          <circle cx="8" cy="-10" r="12" fill="#ffd23f" stroke={INK} strokeWidth="3" />
          <path d="M18 -10 Q28 -9 27 -4 Q22 -1 17 -4 Z" fill="#ff8c42" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <circle cx="11" cy="-13" r="2.5" fill={INK} />
          <path d="M-8 6 Q0 14 10 6" fill="none" stroke="#e0a800" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "bubble":
      return (
        <g>
          <path d="M0 -27 C12 -10 21 0 21 9 A21 21 0 0 1 -21 9 C-21 0 -12 -10 0 -27 Z" fill="#7fd4ff" fillOpacity="0.8" stroke="#1b8fc4" strokeWidth="3" />
          <circle cx="-6" cy="6" r="2.5" fill={INK} />
          <circle cx="6" cy="6" r="2.5" fill={INK} />
          <path d="M-5 13 Q0 17 5 13" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="-9" cy="-4" rx="3" ry="6" fill="#fff" opacity="0.8" transform="rotate(25 -9 -4)" />
        </g>
      );
  }
}

/** A fountain jet rising out of the pool at `x`, as high as `h`. */
function Jet({ x, h, lean }: { x: number; h: number; lean: number }) {
  if (h <= 1) return null;
  const top = BASKET.rimY - h;
  return (
    <g pointerEvents="none">
      <path
        d={`M${x} ${BASKET.rimY} Q${x + lean * 0.3} ${top} ${x + lean} ${top + 20}`}
        fill="none"
        stroke={WATER}
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path d={`M${x} ${BASKET.rimY} Q${x + lean * 0.3} ${top} ${x + lean} ${top + 20}`} fill="none" stroke={FOAM} strokeWidth="4" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={x + lean + (i - 1) * 12} cy={top + 30 + i * 9} r="5" fill={FOAM} stroke="#1b8fc4" strokeWidth="1.5" />
      ))}
    </g>
  );
}

/** The end of the slide: a little pool the things float in; when it is full, fountains spray up out of it. */
function PoolEnd({ layer, fullAge, tapAge }: EndProps) {
  const { x0, x1, rimY } = BASKET;
  const ripple = wobble(tapAge, 4, 16, 5);
  if (layer === "back") {
    const rise = fullAge < 0 ? 0 : Math.min(1, fullAge * 2.5) * (1 + 0.08 * Math.sin(fullAge * 12));
    return (
      <g>
        <ellipse cx={(x0 + x1) / 2} cy={rimY} rx={(x1 - x0) / 2} ry="16" fill={WATER} />
        <Jet x={1340} h={200 * rise} lean={-60} />
        <Jet x={1415} h={290 * rise} lean={0} />
        <Jet x={1490} h={200 * rise} lean={60} />
      </g>
    );
  }
  return (
    <g>
      {/* The water in front of the floating things, then the pool's tiled wall and a ladder */}
      <path
        d={`M${x0 + 4} ${rimY - 6 + ripple} Q${(x0 + x1) / 2} ${rimY + 4 - ripple} ${x1 - 4} ${rimY - 6 + ripple} L${x1 - 4} ${rimY + 16} L${x0 + 4} ${rimY + 16} Z`}
        fill={WATER}
        opacity="0.55"
      />
      <rect x={x0 - 10} y={rimY + 8} width={x1 - x0 + 20} height={TRACK_H - rimY} rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={x0 + 30 + i * 40} y1={rimY + 10} x2={x0 + 30 + i * 40} y2={TRACK_H} stroke="#9fd8ec" strokeWidth="3" />
      ))}
      <line x1={x0 - 8} y1={rimY + 38} x2={x1 + 8} y2={rimY + 38} stroke="#9fd8ec" strokeWidth="3" />
      <path
        d={`M${x1 - 30} ${rimY + 30} V${rimY - 40} Q${x1 - 30} ${rimY - 60} ${x1 - 10} ${rimY - 60}`}
        fill="none"
        stroke="#adb5bd"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </g>
  );
}

/** The water slide. */
export const SLIDE_TRACK: TrackTheme = {
  level: "slidetrack",
  Backdrop: SlideBackdrop,
  Rail: SlideRail,
  board: { fill: "#a6e0f0", edge: "#00b4d8" },
  post: "#3a86ff",
  shelf: "#ff8c42",
  hopper: "#ffb703",
  tunnel: { fill: "#ff8c42", lines: "#e06b1f" },
  Thing: SlideThing,
  release: { marble: playPop, tennis: playBoing, iron: playThump, apple: playQuack, bubble: playBlub },
  landSound: () => playSplash(),
  fullSound: playDrops,
  full: { de: "Alle sind im Becken!" },
  peekers: ["🐬", "🐠", "🐳", "🦦", "🐢", "🐙"],
  magic: false,
  End: PoolEnd,
};
