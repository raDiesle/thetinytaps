// „Schneebahn“ (K-18): the marble run in the snow. The snowball grows on its
// way down, and at the end every thing that arrives becomes the next part of a
// snowman: three balls, a face with a carrot, twig arms and buttons, hat and scarf.

import { memo, useId } from "react";
import { playBlub, playPuff, playRumble, playSleigh, playSqueak, playThump, playTwinkle } from "@/lib/sfx";
import { VIEW_W, wobble } from "./level";
import { BALL_R, type Pt } from "./path";
import { TRACK_H } from "./track";
import { type EndProps, INK, type ThingProps, type TrackTheme } from "./trackTheme";

/** The snowman stands where the wooden run has its basket. */
const SX = 1415;
/** Its three balls, bottom to top. */
const BALLS = [
  { y: 2180, r: 58 },
  { y: 2084, r: 44 },
  { y: 2012, r: 32 },
];
/** Where each thing that arrives goes: the three balls, the face, the middle (arms and buttons), the hat. */
const PARTS: Pt[] = [
  { x: SX, y: BALLS[0].y },
  { x: SX, y: BALLS[1].y },
  { x: SX, y: BALLS[2].y },
  { x: SX + 8, y: BALLS[2].y },
  { x: SX, y: BALLS[1].y },
  { x: SX, y: BALLS[2].y - 40 },
];

const SNOW = "#fbfdff";
const SHADE = "#d6e9f7";

/** A part that has just come pops up from small. */
const pop = (age: number) => (age < 0 ? 0 : age < 1.2 ? 1 - Math.exp(-age * 8) * Math.cos(age * 20) : 1);

/** A pale winter sky with snowflakes on it, and snowy hills at the bottom. */
const SnowBackdrop = memo(function SnowBackdrop() {
  const id = useId();
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe0f7" />
          <stop offset="1" stopColor="#eaf5fd" />
        </linearGradient>
        <pattern id={`${id}flakes`} width="140" height="140" patternUnits="userSpaceOnUse">
          {[
            { x: 30, y: 34, s: 9 },
            { x: 100, y: 96, s: 6 },
            { x: 112, y: 22, s: 4 },
          ].map(({ x, y, s }) => (
            <g key={x} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
              {[0, 60, 120].map((a) => (
                <line key={a} x1={x - s} y1={y} x2={x + s} y2={y} transform={`rotate(${a} ${x} ${y})`} />
              ))}
            </g>
          ))}
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}sky)`} />
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}flakes)`} />
      <path d={`M-400 ${TRACK_H + 200} L-400 2200 Q300 2130 800 2210 Q1200 2160 2000 2190 L2000 ${TRACK_H + 200} Z`} fill={SNOW} />
    </g>
  );
});

/** An icy rail with snow lying on it. */
function SnowRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g strokeLinecap="round">
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#9fd3f5" strokeWidth="12" />
      <line x1={a.x + 6} y1={a.y + off - 7} x2={b.x - 6} y2={b.y + off - 7} stroke={SNOW} strokeWidth="7" />
    </g>
  );
}

/** A snowball that grows on its way down, a penguin, a curling stone, a pine cone and a snowflake. */
function SnowThing({ kind, spin, grow }: ThingProps) {
  const deg = (spin * 180) / Math.PI;
  switch (kind) {
    case "marble": {
      // It still sits on the rail as it grows: its bottom stays where a marble's is.
      const r = 15 + 12 * grow;
      const cy = BALL_R - r;
      return (
        <g transform={`translate(0 ${cy})`}>
          <circle r={r} fill={SNOW} stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill={SHADE}>
            <circle cx={r * 0.4} cy={r * 0.3} r={r * 0.22} />
            <circle cx={-r * 0.45} cy={r * 0.25} r={r * 0.15} />
            <circle cx={r * 0.05} cy={-r * 0.5} r={r * 0.12} />
          </g>
          <circle cx={-r * 0.35} cy={-r * 0.38} r={r * 0.2} fill="#fff" />
        </g>
      );
    }
    case "tennis":
      // The penguin waddles upright instead of rolling.
      return (
        <g transform={`rotate(${10 * Math.sin(spin * 0.6)} 0 22)`}>
          <ellipse cx="-8" cy="22" rx="7" ry="3.5" fill="#ff8c42" stroke={INK} strokeWidth="2" />
          <ellipse cx="8" cy="22" rx="7" ry="3.5" fill="#ff8c42" stroke={INK} strokeWidth="2" />
          <ellipse rx="18" ry="23" fill="#2b3a55" stroke={INK} strokeWidth="3" />
          <ellipse cy="5" rx="12" ry="16" fill="#fff" />
          <path d="M-18 -2 Q-26 8 -20 14" fill="none" stroke="#2b3a55" strokeWidth="6" strokeLinecap="round" />
          <path d="M18 -2 Q26 8 20 14" fill="none" stroke="#2b3a55" strokeWidth="6" strokeLinecap="round" />
          <circle cx="-6" cy="-11" r="4" fill="#fff" />
          <circle cx="6" cy="-11" r="4" fill="#fff" />
          <circle cx="-5.5" cy="-11" r="2" fill={INK} />
          <circle cx="6.5" cy="-11" r="2" fill={INK} />
          <path d="M-5 -5 L5 -5 L0 2 Z" fill="#ff8c42" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      );
    case "iron":
      // The curling stone slides; it only rocks a little.
      return (
        <g transform={`rotate(${3 * Math.sin(spin)} 0 20)`}>
          <path d="M-25 2 L-25 12 Q-25 24 0 24 Q25 24 25 12 L25 2 Z" fill="#8c95a3" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <rect x="-25" y="0" width="50" height="7" fill="#e63946" />
          <ellipse cy="0" rx="25" ry="9" fill="#b8c0cc" stroke={INK} strokeWidth="3" />
          <path d="M-12 -2 L-12 -14 L14 -14" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M-12 -2 L-12 -14 L14 -14" fill="none" stroke="#ffd23f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "apple":
      return (
        <g transform={`rotate(${deg})`}>
          <ellipse rx="17" ry="23" fill="#9b6330" stroke={INK} strokeWidth="3" />
          {[-12, -3, 6, 15].map((y, row) =>
            [-1, 0, 1].map((col) => (
              <path
                key={`${row}${col}`}
                d={`M${col * 9 - 4 + (row % 2) * 3} ${y - 4} L${col * 9 + (row % 2) * 3} ${y + 2} L${col * 9 + 4 + (row % 2) * 3} ${y - 4}`}
                fill="none"
                stroke="#6b4220"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            )),
          )}
          <ellipse cy="-20" rx="9" ry="5" fill={SNOW} />
        </g>
      );
    case "bubble":
      return (
        <g transform={`rotate(${deg * 0.3})`}>
          <circle r="22" fill="#e8f6ff" opacity="0.6" />
          {[0, 60, 120].map((a) => (
            <g key={a} transform={`rotate(${a})`} strokeLinecap="round">
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#7fc8f8" strokeWidth="7" />
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#fff" strokeWidth="3.5" />
              {[-1, 1].map((side) => (
                <path key={side} d={`M${side * 20} -7 L${side * 13} 0 L${side * 20} 7`} fill="none" stroke="#7fc8f8" strokeWidth="3" strokeLinejoin="round" />
              ))}
            </g>
          ))}
          <circle r="5" fill="#fff" stroke="#7fc8f8" strokeWidth="2" />
        </g>
      );
  }
}

/** One of the snowman's balls, popping up from small `age` seconds after it came. */
function SnowBall({ i, age }: { i: number; age: number }) {
  const { y, r } = BALLS[i];
  const k = pop(age);
  return (
    <g transform={`translate(${SX} ${y + r}) scale(${k}) translate(${-SX} ${-y - r})`}>
      <circle cx={SX} cy={y} r={r} fill={SNOW} stroke={INK} strokeWidth="4" />
      <path
        d={`M${SX - r * 0.7} ${y + r * 0.45} A${r} ${r} 0 0 0 ${SX + r * 0.7} ${y + r * 0.45}`}
        fill="none"
        stroke={SHADE}
        strokeWidth={r * 0.18}
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * The end of the snow run: a snowman that each thing builds on. Before
 * anything comes there is only the snow; the full snowman waves.
 */
function SnowmanEnd({ layer, parts, t, fullAge, tapAge }: EndProps) {
  if (layer === "front") {
    // A drift of snow in front of the snowman's foot.
    return <path d={`M1250 ${TRACK_H + 20} Q1290 2226 1415 2232 Q1540 2226 1600 ${TRACK_H + 20} Z`} fill={SNOW} stroke={SHADE} strokeWidth="4" />;
  }
  const age = (i: number) => (i < parts.length ? (t - parts[i]) / 1000 : -1);
  const head = BALLS[2];
  const wave = fullAge >= 0 ? 28 * Math.sin(fullAge * 9) * Math.exp(-fullAge * 0.4) : 0;
  const hatHop = fullAge >= 0 ? Math.abs(14 * Math.sin(fullAge * 9)) * Math.exp(-fullAge * 0.8) : 0;
  const sway = wobble(tapAge, 5, 14, 4);
  return (
    <g transform={`rotate(${sway} ${SX} ${TRACK_H})`}>
      {/* Twig arms and buttons, behind the balls in front of them */}
      {parts.length > 4 && (
        <g transform={`translate(0 ${BALLS[1].y}) scale(${pop(age(4))}) translate(0 ${-BALLS[1].y})`}>
          <path
            d={`M${SX - 38} ${BALLS[1].y - 8} L${SX - 96} ${BALLS[1].y - 44} M${SX - 80} ${BALLS[1].y - 34} L${SX - 92} ${BALLS[1].y - 58}`}
            stroke="#6b4220"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <g transform={`rotate(${wave} ${SX + 38} ${BALLS[1].y - 8})`}>
            <path
              d={`M${SX + 38} ${BALLS[1].y - 8} L${SX + 96} ${BALLS[1].y - 44} M${SX + 80} ${BALLS[1].y - 34} L${SX + 92} ${BALLS[1].y - 58}`}
              stroke="#6b4220"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </g>
        </g>
      )}
      {[0, 1, 2].map((i) => i < parts.length && <SnowBall key={i} i={i} age={age(i)} />)}
      {parts.length > 4 && [-18, 6, 30].map((dy) => <circle key={dy} cx={SX} cy={BALLS[1].y + dy - 6} r={6 * pop(age(4))} fill={INK} />)}
      {/* The face: coal eyes, a carrot nose and a smile */}
      {parts.length > 3 && (
        <g transform={`translate(${SX} ${head.y}) scale(${pop(age(3))}) translate(${-SX} ${-head.y})`}>
          <circle cx={SX - 11} cy={head.y - 8} r="4.5" fill={INK} />
          <circle cx={SX + 11} cy={head.y - 8} r="4.5" fill={INK} />
          <path
            d={`M${SX} ${head.y - 1} L${SX + 34} ${head.y + 5} L${SX} ${head.y + 8} Z`}
            fill="#ff8c42"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d={`M${SX - 13} ${head.y + 13} Q${SX} ${head.y + 22} ${SX + 13} ${head.y + 13}`}
            fill="none"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      )}
      {/* Hat and scarf */}
      {parts.length > 5 && (
        <g transform={`translate(${SX} ${head.y - head.r}) scale(${pop(age(5))}) translate(${-SX} ${-head.y + head.r})`}>
          <path
            d={`M${SX - 34} ${head.y + 24} Q${SX} ${head.y + 40} ${SX + 34} ${head.y + 24} L${SX + 32} ${head.y + 36} Q${SX} ${head.y + 50} ${SX - 32} ${head.y + 36} Z`}
            fill="#e63946"
            stroke={INK}
            strokeWidth="3"
          />
          <path
            d={`M${SX + 16} ${head.y + 40} L${SX + 24} ${head.y + 78} L${SX + 38} ${head.y + 74} L${SX + 28} ${head.y + 36} Z`}
            fill="#e63946"
            stroke={INK}
            strokeWidth="3"
          />
          <g transform={`translate(0 ${-hatHop})`}>
            <rect x={SX - 36} y={head.y - head.r - 4} width="72" height="10" rx="5" fill="#2b3a55" stroke={INK} strokeWidth="3" />
            <rect x={SX - 22} y={head.y - head.r - 46} width="44" height="44" rx="5" fill="#2b3a55" stroke={INK} strokeWidth="3" />
            <rect x={SX - 22} y={head.y - head.r - 16} width="44" height="8" fill="#e63946" />
          </g>
        </g>
      )}
    </g>
  );
}

/** The snow run. */
export const SNOW_TRACK: TrackTheme = {
  level: "snowtrack",
  Backdrop: SnowBackdrop,
  Rail: SnowRail,
  board: { fill: "#e3f1fb", edge: "#8fbfe3" },
  post: "#8fbfe3",
  shelf: "#8fbfe3",
  hopper: "#7fc8f8",
  tunnel: { fill: SNOW, lines: "#b5d7ef" },
  Thing: SnowThing,
  release: { marble: playPuff, tennis: playSqueak, iron: playRumble, apple: playBlub, bubble: playTwinkle },
  landSound: (kind) => (kind === "iron" ? playThump() : playPuff()),
  fullSound: playSleigh,
  full: { de: "Der Schneemann ist fertig!" },
  peekers: ["🐧", "🦭", "🐻‍❄️", "🦊", "🐰", "🦉"],
  magic: false,
  End: SnowmanEnd,
  landAt: (i) => PARTS[Math.min(i, PARTS.length - 1)],
  absorb: true,
};
