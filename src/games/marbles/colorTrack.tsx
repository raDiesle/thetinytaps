// „Farbenbahn“ (K-10): instead of five different things the shelf holds a red,
// a yellow and a blue marble, and the child picks the colour of each one. At
// the end of the run every marble hops into the tube of its colour, a note
// higher for each, while the voice counts „Drei rote!“. The first full tube
// glows in its colour, and the run is done. On the way down the lower wall
// the marbles roll through six coloured arches and over a rainbow.

import { memo, useId } from "react";
import { playMusicbox, playPing, playPlink, playPop, playTrill } from "@/lib/sfx";
import { countLine, SORT_COLORS, TUBE_FULL, TUBE_FULL_LINE, TUBE_TOP, TUBES, tubeSlot } from "./colors";
import { VIEW_W, wobble, decay } from "./level";
import { Ball } from "./parts";
import { BALL_R, type Pt } from "./path";
import { TRACK_H } from "./track";
import { COLOR_CUES, HOOP_SPOTS, HOOPS, RAINBOW, RAINBOW_DOWN, RAINBOW_RAMP, railPath, STRETCHES, UNDER } from "./trackStretches";
import { type EndProps, INK, type StretchArtProps, type ThingProps, type TrackTheme } from "./trackTheme";

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

/**
 * The end of the colour run: three glass tubes on a stand, red, yellow and
 * blue, each with a coloured rim and foot so the child sees which is which.
 * Behind the marbles their tinted inside and the full tube's glow,
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

/** The rainbow's bands, outermost first, each `RAINBOW_BAND` wide, under the marbles rolling over its top. */
const RAINBOW_BAND = 13;

/** An arc of radius `r` round the rainbow's middle, from its first foot to its second. */
const rainbowArc = (r: number) => {
  const p = (a: number) => ({ x: RAINBOW.cx + r * Math.cos((a * Math.PI) / 180), y: RAINBOW.cy + r * Math.sin((a * Math.PI) / 180) });
  const a = p(RAINBOW.a0);
  const b = p(RAINBOW.a1);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A${r} ${r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

/** A soft little cloud around `x`, `y`. */
function Cloud({ x, y }: { x: number; y: number }) {
  return (
    <g fill="#fff" stroke={INK} strokeWidth="3.5">
      <path
        d={`M${x - 60} ${y + 18} Q${x - 70} ${y - 8} ${x - 38} ${y - 10} Q${x - 30} ${y - 40} ${x} ${y - 30} Q${x + 30} ${y - 44} ${x + 40} ${y - 12} Q${x + 72} ${y - 8} ${x + 60} ${y + 18} Z`}
      />
    </g>
  );
}

/**
 * The colour run's own stretch: six arches in its three colours stand over the two long rows, each with a little bell
 * on top that swings and rings as a marble rolls through; and in the middle a rainbow the marbles roll up and over,
 * its bands lighting up as one comes over the top, its feet on two clouds.
 */
function ColorStretch({ layer, ages, onTap }: StretchArtProps) {
  if (layer === "front") {
    // The clouds the rainbow stands on lie in front of the marbles rolling onto it and off it.
    const off = UNDER + RAINBOW_BAND * 1.5;
    return (
      <g pointerEvents="none">
        <Cloud
          x={RAINBOW.cx + (RAINBOW.r - off) * Math.cos((RAINBOW.a0 * Math.PI) / 180)}
          y={RAINBOW.cy + (RAINBOW.r - off) * Math.sin((RAINBOW.a0 * Math.PI) / 180) + 46}
        />
        <Cloud
          x={RAINBOW.cx + (RAINBOW.r - off) * Math.cos((RAINBOW.a1 * Math.PI) / 180)}
          y={RAINBOW.cy + (RAINBOW.r - off) * Math.sin((RAINBOW.a1 * Math.PI) / 180) + 46}
        />
      </g>
    );
  }
  const light = ages[COLOR_CUES.rainbow];
  const glow = light >= 0 && light < 2 ? 0.55 * decay(light * 2.5) : 0;
  return (
    <g>
      {/* The ramp down to the rainbow and the curve down from it, striped like the rails */}
      {[railPath(RAINBOW_RAMP, UNDER, 1), railPath(RAINBOW_DOWN, UNDER, 1)].map((d) => (
        <g key={d} fill="none" strokeLinecap="round">
          <path d={d} stroke={INK} strokeWidth="20" />
          <path d={d} stroke={SORT_COLORS[2].fill} strokeWidth="14" />
          <path d={d} stroke={SORT_COLORS[1].fill} strokeWidth="9" />
          <path d={d} stroke={SORT_COLORS[0].fill} strokeWidth="4" />
        </g>
      ))}
      {/* The rainbow: three broad bands under the way over its top */}
      <g data-tap onPointerDown={(e) => onTap(COLOR_CUES.rainbow, e)} fill="none">
        <path d={rainbowArc(RAINBOW.r - UNDER - RAINBOW_BAND)} stroke={INK} strokeWidth={RAINBOW_BAND * 3 + 8} />
        {SORT_COLORS.map((c, i) => (
          <path key={c.id} d={rainbowArc(RAINBOW.r - UNDER - RAINBOW_BAND * (i + 0.5) + 2)} stroke={c.fill} strokeWidth={RAINBOW_BAND} />
        ))}
        {glow > 0 && <path d={rainbowArc(RAINBOW.r - UNDER - RAINBOW_BAND)} stroke="#fff" strokeWidth={RAINBOW_BAND * 3} opacity={glow} />}
      </g>
      {/* The arches over the rows, each with its bell */}
      {HOOP_SPOTS.map((p, i) => {
        const c = SORT_COLORS[i % SORT_COLORS.length];
        const age = ages[COLOR_CUES.hoops + i];
        const swing = wobble(age, 22, 14, 3.5);
        // The arch's legs stand on the rail and its round top is clear over the marble; the bell hangs above it.
        const top = p.y - HOOPS.ry - 8;
        const foot = p.y + UNDER;
        return (
          <g key={i} data-tap onPointerDown={(e) => onTap(COLOR_CUES.hoops + i, e)}>
            <path
              d={`M${p.x - 36} ${foot} V${top + 36} A36 36 0 0 1 ${p.x + 36} ${top + 36} V${foot}`}
              fill="none"
              stroke={INK}
              strokeWidth="17"
              strokeLinejoin="round"
            />
            <path d={`M${p.x - 36} ${foot} V${top + 36} A36 36 0 0 1 ${p.x + 36} ${top + 36} V${foot}`} fill="none" stroke={c.fill} strokeWidth="10" />
            <g transform={`rotate(${swing} ${p.x} ${top - 8})`}>
              <path
                d={`M${p.x - 13} ${top - 12} Q${p.x - 12} ${top - 34} ${p.x} ${top - 34} Q${p.x + 12} ${top - 34} ${p.x + 13} ${top - 12} Z`}
                fill="#ffd23f"
                stroke={INK}
                strokeWidth="3"
              />
              <circle cx={p.x} cy={top - 9} r="4" fill={INK} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** Each arch's bell rings a note of its own; over the rainbow a trill. */
function colorCue(cue: number) {
  if (cue === COLOR_CUES.rainbow) playTrill();
  else playPlink(cue - COLOR_CUES.hoops);
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
  stretch: STRETCHES.color,
  StretchArt: ColorStretch,
  cue: colorCue,
};
