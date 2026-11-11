// „Farbenbahn“ (K-10): instead of five different things the shelf holds a red,
// a yellow and a blue marble, and the child picks the colour of each one. At
// the end of the run every marble hops into the tube of its colour, a note
// higher for each, while the voice counts „Drei rote!“. The first full tube
// has a small party in its colour, and the run is done.

import { memo, useId } from "react";
import { playMusicbox, playPing, playPop } from "@/lib/sfx";
import { countLine, SORT_COLORS, TUBE_FULL, TUBE_FULL_LINE, TUBE_TOP, TUBES, tubeSlot } from "./colors";
import { VIEW_W, wobble } from "./level";
import { Ball, STAR_POINTS } from "./parts";
import { BALL_R, type Pt } from "./path";
import { TRACK_H } from "./track";
import { type EndProps, INK, type ThingProps, type TrackTheme } from "./trackTheme";

/** How long a marble's hop from the run's end into its tube takes, and how much of it goes up. */
const HOP_MS = 900;
const RISE = 0.6;
/** The highest point of the hop, above the tubes' rim. */
const HOP_TOP = TUBE_TOP - 46;

/** Up in an arc from the run's end to above the tube, then straight down into it. */
function hop(from: Pt, to: Pt, k: number): Pt {
  if (k < RISE) {
    const u = k / RISE;
    return { x: from.x + (to.x - from.x) * u, y: from.y + (HOP_TOP - from.y) * (1 - (1 - u) ** 2) };
  }
  const u = Math.min(1, (k - RISE) / (1 - RISE));
  return { x: to.x, y: HOP_TOP + (to.y - HOP_TOP) * u * u };
}

/** A bright painted wall with big soft dots in the three colours, drawn once. */
const ColorBackdrop = memo(function ColorBackdrop() {
  const id = useId();
  return (
    <g>
      <defs>
        <pattern id={`${id}dots`} width="240" height="240" patternUnits="userSpaceOnUse">
          {SORT_COLORS.map((c, i) => (
            <circle key={c.id} cx={40 + i * 80} cy={40 + ((i * 160) % 240)} r="26" fill={c.fill} opacity="0.16" />
          ))}
          {SORT_COLORS.map((c, i) => (
            <circle key={c.id} cx={200 - i * 80} cy={160 - ((i * 80) % 240) + 40} r="12" fill={c.fill} opacity="0.12" />
          ))}
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill="#fffaf0" />
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}dots)`} />
    </g>
  );
});

/** A rail striped red, yellow and blue. */
function ColorRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  const line = (stroke: string, width: number) => <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={stroke} strokeWidth={width} />;
  return (
    <g strokeLinecap="round">
      {line(INK, 20)}
      {line(SORT_COLORS[2].fill, 14)}
      {line(SORT_COLORS[1].fill, 9)}
      {line(SORT_COLORS[0].fill, 4)}
    </g>
  );
}

/** Every thing on this run is a shiny marble in the colour the child picked. */
function ColorThing({ color, spin }: ThingProps) {
  return <Ball color={color} x={0} y={0} spin={spin} />;
}

/** A small heart around 0, 0. */
const HEART = "M0 10 C-14 0 -16 -10 -8 -13 C-3 -15 0 -11 0 -8 C0 -11 3 -15 8 -13 C16 -10 14 0 0 10 Z";

/** The small party of a full tube: hearts and stars in its colour rise slowly from it, `age` seconds after it got full. */
function TubeParty({ x, color, age }: { x: number; color: string; age: number }) {
  return (
    <g pointerEvents="none">
      {Array.from({ length: 6 }, (_, i) => {
        const k = (age - i * 0.35) / 3;
        if (k < 0 || k >= 1) return null;
        const side = i % 2 ? 1 : -1;
        const px = x + side * (24 + (i % 3) * 14) + 10 * Math.sin(k * 6 + i);
        const py = TUBE_TOP - 20 - 320 * k;
        const fade = k < 0.15 ? k / 0.15 : k > 0.7 ? (1 - k) / 0.3 : 1;
        return (
          <g key={i} transform={`translate(${px} ${py}) scale(${i % 2 ? 1.6 : 1.1})`} opacity={fade}>
            {i % 2 ? (
              <path d={HEART} fill={color} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            ) : (
              <polygon points={STAR_POINTS} fill={color} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            )}
          </g>
        );
      })}
    </g>
  );
}

/**
 * The end of the colour run: three glass tubes on a stand, red, yellow and
 * blue, each with a coloured rim and foot so the child sees which is which.
 * Behind the marbles their tinted inside and the full tube's glow and party,
 * in front of them the glass.
 */
function TubesEnd({ layer, fullAge, fullTube, tapAge }: EndProps) {
  const { bottom, half } = TUBES;
  const dip = wobble(tapAge, 4, 18, 6);
  if (layer === "back") {
    return (
      <g>
        {SORT_COLORS.map((c, i) => {
          const x = TUBES.x[i];
          const full = i === fullTube && fullAge >= 0;
          return (
            <g key={c.id}>
              {full && (
                <rect
                  x={x - half - 22}
                  y={TUBE_TOP - 26}
                  width={2 * half + 44}
                  height={bottom - TUBE_TOP + 40}
                  rx="40"
                  fill={c.fill}
                  opacity={0.45 * Math.min(1, fullAge * 2)}
                />
              )}
              <rect x={x - half} y={TUBE_TOP + dip} width={2 * half} height={bottom - TUBE_TOP} rx={half} fill={c.tint} />
              {full && <TubeParty x={x} color={c.fill} age={fullAge} />}
            </g>
          );
        })}
      </g>
    );
  }
  return (
    <g>
      {SORT_COLORS.map((c, i) => {
        const x = TUBES.x[i];
        return (
          <g key={c.id} transform={`translate(0 ${dip})`}>
            {/* The glass, open at the top, round at the bottom */}
            <path
              d={`M${x - half} ${TUBE_TOP} L${x - half} ${bottom - half} A${half} ${half} 0 0 0 ${x + half} ${bottom - half} L${x + half} ${TUBE_TOP}`}
              fill="#ffffff22"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1={x - half + 9} y1={TUBE_TOP + 22} x2={x - half + 9} y2={bottom - half} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
            {/* Its colour as a ring at the rim */}
            <rect x={x - half - 8} y={TUBE_TOP - 9} width={2 * half + 16} height="18" rx="9" fill={c.fill} stroke={INK} strokeWidth="3.5" />
          </g>
        );
      })}
      {/* The stand they sit in, on two short legs, with a dot of each tube's colour on its front */}
      {[TUBES.x[0] - half - 8, TUBES.x[2] + half - 14].map((x) => (
        <rect key={x} x={x} y={bottom + 20} width="22" height={TRACK_H - bottom + 20} rx="6" fill="#6c5ce7" stroke={INK} strokeWidth="4" />
      ))}
      <rect
        x={TUBES.x[0] - half - 26}
        y={bottom - 6}
        width={TUBES.x[2] - TUBES.x[0] + 2 * half + 52}
        height="42"
        rx="12"
        fill="#8e7dff"
        stroke={INK}
        strokeWidth="4"
      />
      {SORT_COLORS.map((c, i) => (
        <circle key={c.id} cx={TUBES.x[i]} cy={bottom + 15} r="11" fill={c.fill} stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

/** The colour run. */
export const COLOR_TRACK: TrackTheme = {
  level: "colortrack",
  Backdrop: ColorBackdrop,
  Rail: ColorRail,
  board: { fill: "#fff0d0", edge: "#ffb703" },
  post: "#8e7dff",
  shelf: "#8e7dff",
  hopper: "#3ec300",
  tunnel: { fill: "#ff8c42", lines: "#ffd23f" },
  Thing: ColorThing,
  release: { marble: playPop, tennis: playPop, iron: playPop, apple: playPop, bubble: playPop },
  landSound: () => playPing(),
  fullSound: playMusicbox,
  full: TUBE_FULL_LINE,
  peekers: ["🐞", "🦜", "🐳", "🦋", "🐌"],
  magic: false,
  End: TubesEnd,
  sort: {
    colors: SORT_COLORS.map((c) => c.fill),
    landAt: tubeSlot,
    hop,
    hopMs: HOP_MS,
    full: TUBE_FULL,
    count: countLine,
  },
};
