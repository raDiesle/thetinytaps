// „Baustellen-Bahn“ (K-18): the marble run on a building site. A log, a tyre,
// a stone, a big nut and a balloon ride conveyor belts down into a skip, and
// when it is full the crane's hook comes down and lifts it up.

import { memo, useId } from "react";
import { playBoing, playClonk, playKnock, playRumble, playSqueak, playThump, playWhirr } from "@/lib/sfx";
import { VIEW_W } from "./level";
import { BALL_R, type Pt } from "./path";
import { BASKET, TRACK_H } from "./track";
import { type EndProps, INK, type ThingProps, type TrackTheme } from "./trackTheme";

/** The crane's hook comes down for this long after the skip is full, then lifts it. */
const HOOK_S = 0.7;
const LIFT_S = 0.9;
const LIFT = 110;

/** How far the skip (and everything in it) is lifted, `fullAge` seconds after it was full. */
const liftAt = (fullAge: number) => (fullAge < HOOK_S ? 0 : LIFT * (1 - (1 - Math.min(1, (fullAge - HOOK_S) / LIFT_S)) ** 3));

/** A wall of pale bricks. */
const SiteBackdrop = memo(function SiteBackdrop() {
  const id = useId();
  return (
    <g>
      <defs>
        <pattern id={`${id}bricks`} width="100" height="50" patternUnits="userSpaceOnUse">
          <rect width="100" height="50" fill="#efe3cf" />
          <path d="M0 0.5 H100 M0 25.5 H100 M0.5 0 V25 M50.5 25 V50" stroke="#dccab0" strokeWidth="3" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}bricks)`} />
    </g>
  );
});

/** A conveyor belt with its rollers. */
function BeltRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  const length = Math.hypot(b.x - a.x, b.y - a.y);
  const rollers = Math.max(1, Math.floor(length / 34));
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#3d3d45" strokeWidth="14" strokeLinecap="round" />
      {Array.from({ length: rollers + 1 }, (_, i) => {
        const k = i / rollers;
        return <circle key={i} cx={a.x + (b.x - a.x) * k} cy={a.y + off + (b.y - a.y) * k} r="3.5" fill="#adb5bd" />;
      })}
    </g>
  );
}

/** A log, a tyre, a stone, a big nut and a balloon. */
function SiteThing({ kind, spin }: ThingProps) {
  const deg = (spin * 180) / Math.PI;
  switch (kind) {
    case "marble":
      return (
        <g>
          <circle r={BALL_R} fill="#e3b27a" stroke={INK} strokeWidth="3" />
          <circle r={BALL_R - 3} fill="none" stroke="#8a5a2b" strokeWidth="4" />
          <g transform={`rotate(${deg})`} fill="none" stroke="#b07a42" strokeWidth="2.5">
            <circle cx="2" cy="1" r="12" />
            <circle cx="2" cy="1" r="6" />
            <path d="M2 1 L16 -9" strokeLinecap="round" />
          </g>
        </g>
      );
    case "tennis":
      return (
        <g>
          <circle r="24" fill="#2f3440" stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`}>
            {Array.from({ length: 10 }, (_, i) => (
              <rect key={i} x="-3" y="-24" width="6" height="7" fill="#50566a" transform={`rotate(${i * 36})`} />
            ))}
            <circle r="11" fill="#adb5bd" stroke={INK} strokeWidth="2.5" />
            {[0, 120, 240].map((a) => (
              <circle key={a} cx={6 * Math.cos((a * Math.PI) / 180)} cy={6 * Math.sin((a * Math.PI) / 180)} r="1.8" fill={INK} />
            ))}
          </g>
        </g>
      );
    case "iron":
      return (
        <g transform={`rotate(${deg})`}>
          <path d="M-24 -4 L-14 -21 L6 -25 L22 -12 L25 6 L13 22 L-8 24 L-22 13 Z" fill="#9a9a9a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="-7" cy="-8" r="4" fill="#7d7d7d" />
          <circle cx="9" cy="8" r="5" fill="#7d7d7d" />
          <path d="M-14 -14 L-4 -18" stroke="#c4c4c4" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "apple": {
      const hex = Array.from({ length: 6 }, (_, i) => `${(24 * Math.cos((i * Math.PI) / 3)).toFixed(1)} ${(24 * Math.sin((i * Math.PI) / 3)).toFixed(1)}`);
      return (
        <g transform={`rotate(${deg})`}>
          <path
            d={`M${hex.join(" L")} Z M9 0 A9 9 0 1 0 -9 0 A9 9 0 1 0 9 0 Z`}
            fill="#c4cbd4"
            fillRule="evenodd"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle r="12" fill="none" stroke="#8d96a3" strokeWidth="2" />
        </g>
      );
    }
    case "bubble":
      // The balloon floats upright, swaying on its string.
      return (
        <g transform={`rotate(${6 * Math.sin(spin * 0.3)} 0 24)`}>
          <path d="M0 22 Q-6 30 2 38" fill="none" stroke={INK} strokeWidth="2" />
          <ellipse cy="-3" rx="21" ry="24" fill="#ff8c42" stroke={INK} strokeWidth="3" />
          <path d="M-4 22 L4 22 L0 18 Z" fill="#ff8c42" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="-8" cy="-12" rx="4" ry="7" fill="#fff" opacity="0.6" transform="rotate(20 -8 -12)" />
        </g>
      );
  }
}

/**
 * The end of the site run: a yellow skip the things land in. When it is full
 * the crane's hook comes down on its cable, and the skip goes up with everything in it.
 */
function SkipEnd({ layer, fullAge }: EndProps) {
  const { x0, x1, rimY, bottomY } = BASKET;
  const cx = (x0 + x1) / 2;
  const lift = liftAt(fullAge);
  if (layer === "back") {
    const hookY = fullAge < 0 ? null : rimY - 120 - 600 * (1 - Math.min(1, fullAge / HOOK_S)) ** 2 - lift;
    return (
      <g>
        {hookY !== null && (
          <g pointerEvents="none">
            <line x1={cx} y1={hookY - 1200} x2={cx} y2={hookY} stroke={INK} strokeWidth="5" />
            <rect x={cx - 26} y={hookY - 10} width="52" height="34" rx="6" fill="#ffb703" stroke={INK} strokeWidth="3" />
            <path
              d={`M${cx} ${hookY + 24} V${hookY + 44} Q${cx} ${hookY + 62} ${cx + 16} ${hookY + 56}`}
              fill="none"
              stroke={INK}
              strokeWidth="6"
              strokeLinecap="round"
            />
            {fullAge >= HOOK_S && (
              <path
                d={`M${cx} ${hookY + 48} L${x0 + 10} ${rimY - lift} M${cx} ${hookY + 48} L${x1 - 10} ${rimY - lift}`}
                stroke="#6c757d"
                strokeWidth="4"
                strokeDasharray="8 4"
              />
            )}
          </g>
        )}
        <rect x={x0 + 4} y={rimY - 12 - lift} width={x1 - x0 - 8} height="20" rx="4" fill="#7a5a00" />
      </g>
    );
  }
  return (
    <g transform={`translate(0 ${-lift})`}>
      <path
        d={`M${x0 - 10} ${rimY - 8} L${x1 + 10} ${rimY - 8} L${x1 - 20} ${bottomY + 6} L${x0 + 20} ${bottomY + 6} Z`}
        fill="#ffb703"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Black and yellow stripes along its rim */}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${x0 + 4 + i * 30} ${rimY + 10} l14 0 l-10 14 l-14 0 Z`} fill={INK} />
      ))}
      <rect x={x0 - 14} y={rimY - 14} width={x1 - x0 + 28} height="12" rx="4" fill="#e09a00" stroke={INK} strokeWidth="3" />
      <circle cx={x0 + 10} cy={rimY - 8} r="6" fill="#adb5bd" stroke={INK} strokeWidth="2" />
      <circle cx={x1 - 10} cy={rimY - 8} r="6" fill="#adb5bd" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The building-site run. */
export const SITE_TRACK: TrackTheme = {
  level: "sitetrack",
  Backdrop: SiteBackdrop,
  Rail: BeltRail,
  board: { fill: "#f7e7b0", edge: "#e09a00" },
  post: "#ffb703",
  shelf: "#e09a00",
  hopper: "#ff8c42",
  tunnel: { fill: "#b8b2a7", lines: "#8d877c" },
  Thing: SiteThing,
  release: { marble: () => playKnock(380), tennis: playBoing, iron: playRumble, apple: () => playKnock(900), bubble: playSqueak },
  landSound: (kind) => (kind === "iron" ? playThump() : playClonk()),
  fullSound: playWhirr,
  full: { de: "Voll! Der Kran hebt alles hoch!" },
  peekers: ["👷", "🐿️", "🦔", "🐌", "🐭", "🐦"],
  magic: false,
  End: SkipEnd,
  pileLift: liftAt,
};
