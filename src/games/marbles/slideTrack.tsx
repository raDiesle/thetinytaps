// „Wasserrutsche“ (K-18): the marble run in a swimming hall. A beach ball, a
// swim ring, a melon, a rubber duck and a water drop slide down blue water
// chutes into a little pool, and when it is full fountains spray up out of it.
// On the way down the lower wall they bump over wave slides, dive off a diving
// board into a whirlpool and go down its drain.

import { memo, useId } from "react";
import { playBlub, playBoing, playDrops, playGlug, playPop, playSlide, playThump } from "@/lib/sfx";
import { playQuack, playSplash } from "@/lib/realSounds";
import { VIEW_W, wobble, decay } from "./level";
import { BALL_R, type Pt } from "./path";
import { BASKET, TRACK_H } from "./track";
import { anyStirring, Piece } from "./trackPieces";
import { BOARD, DRAIN, railPath, SLIDE_CUES, STRETCHES, sample, UNDER, WAVES, WHIRL, waveAt, whirlAt } from "./trackStretches";
import { type EndProps, INK, type StretchArtProps, type ThingProps, type TrackTheme } from "./trackTheme";

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
      <rect x="-400" y={TRACK_H - 50} width={VIEW_W + 800} height="250" fill="#7fd4ef" />
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

/** A few drops of water thrown up at `x`, `y`, `age` seconds ago, falling back. */
function Drops({ x, y, age, size = 1 }: { x: number; y: number; age: number; size?: number }) {
  if (age < 0 || age > 0.7) return null;
  const k = age / 0.7;
  const reach = 40 * size + 12;
  return (
    // A small layer of its own while it lasts, so the drops never paint the wall's svg again.
    <Piece layer="back" box={{ x: x - reach, y: y - 30 * size - 12, w: 2 * reach, h: 30 * size + 24 }}>
      <g opacity={1 - k * k} fill={FOAM} stroke="#1b8fc4" strokeWidth="1.5" pointerEvents="none">
        {[-1, -0.4, 0.4, 1].map((i) => (
          <circle key={i} cx={x + i * 40 * size * k} cy={y - 70 * size * k * (1 - k) * (1.2 - Math.abs(i) * 0.4)} r={4 + 3 * size} />
        ))}
      </g>
    </Piece>
  );
}

/** A blue chute under `pts`, water running in it; `side` as for `railPath`. */
function Chute({ pts, side }: { pts: Pt[]; side: 1 | -1 }) {
  const d = railPath(pts, BALL_R + 7, side);
  const water = railPath(pts, BALL_R + 1, side);
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke={INK} strokeWidth="20" />
      <path d={d} stroke="#1b8fc4" strokeWidth="14" />
      <path d={water} stroke={WATER} strokeWidth="6" opacity="0.9" />
    </g>
  );
}

/** The whirlpool's basin, a little from above: its water, and a swirl in it that turns as things go round. */
function whirlEllipse(grow: number) {
  return { cx: WHIRL.cx, cy: WHIRL.cy + WHIRL.sink / 2, rx: WHIRL.rx + grow, ry: WHIRL.ry + WHIRL.sink / 2 + grow * 0.4 };
}

/**
 * The water slide's own stretch: two long wave slides whose humps splash as a thing goes over them, a diving board
 * that bends and springs back, and a whirlpool – a thing dives into it, circles round and round, closer to the middle
 * each time, and is swallowed by the drain in its middle, which lets it out through a glass pipe below. The swirl, the
 * board and the drops move, so each is a `Piece`.
 */
function SlideStretch({ layer, ages, onTap }: StretchArtProps) {
  // The board and the swirl are layers together while any part of the stretch moves (`anyStirring`).
  const still = !anyStirring(ages);
  const basin = whirlEllipse(26);
  if (layer === "front") {
    // The basin's near wall in front of the things swimming round, half see-through like water, and the glass pipe.
    return (
      <g pointerEvents="none">
        <path
          d={`M${basin.cx - basin.rx} ${basin.cy} A${basin.rx} ${basin.ry} 0 0 0 ${basin.cx + basin.rx} ${basin.cy} L${basin.cx + basin.rx - 20} ${basin.cy + 70} Q${basin.cx} ${basin.cy + basin.ry + 80} ${basin.cx - basin.rx + 20} ${basin.cy + 70} Z`}
          fill={WATER}
          opacity="0.4"
          stroke={INK}
          strokeWidth="4"
        />
        <path d={railPath(DRAIN, 0, 1)} fill="none" stroke="#fff" strokeWidth={2 * BALL_R + 14} strokeLinecap="round" opacity="0.3" />
        <path d={railPath(DRAIN, BALL_R + 7, 1)} fill="none" stroke="#fff" strokeWidth="4" opacity="0.8" />
        <path d={railPath(DRAIN, BALL_R + 7, -1)} fill="none" stroke="#fff" strokeWidth="4" opacity="0.8" />
      </g>
    );
  }
  const swirl = -720 * (1 - decay(Math.max(0, ages[SLIDE_CUES.splash]) * 0.4));
  const bend = wobble(ages[SLIDE_CUES.board], 16, 14, 3.5);
  const humps = (w: number) => Array.from({ length: WAVES[w].humps }, (_, i) => (w === 0 ? 0 : WAVES[0].humps) + i);
  const humpCue = (h: number) => (h < WAVES[0].humps ? SLIDE_CUES.waves[0] + h : SLIDE_CUES.waves[1] + h - WAVES[0].humps);
  return (
    <g>
      {/* The two wave slides; a hump splashes as a thing goes over it */}
      {WAVES.map((w, i) => (
        <g key={i}>
          <Chute pts={sample(48 * w.humps, (k) => waveAt(w, k))} side={i === 0 ? -1 : 1} />
          {humps(i).map((h) => {
            const k = (h - (i === 0 ? 0 : WAVES[0].humps) + 0.25) / w.humps;
            const top = waveAt(w, k);
            return (
              <g key={h}>
                <circle cx={top.x} cy={top.y + 10} r="34" fill="transparent" data-tap onPointerDown={(e) => onTap(humpCue(h), e)} />
                <Drops x={top.x} y={top.y + 4} age={ages[humpCue(h)]} size={0.6} />
              </g>
            );
          })}
        </g>
      ))}

      {/* The diving board on its stand, bending at its tip */}
      <rect
        x={BOARD.x0 - 4}
        y={BOARD.y + UNDER}
        width="26"
        height="150"
        rx="6"
        fill="#adb5bd"
        stroke={INK}
        strokeWidth="4"
        data-tap
        onPointerDown={(e) => onTap(SLIDE_CUES.board, e)}
      />
      {/* The board bends in a small layer of its own */}
      <Piece layer="back" rest={still} box={{ x: BOARD.x0 - 22, y: BOARD.y + UNDER - 14, w: BOARD.x1 - BOARD.x0 + 44, h: 64 }}>
        <g data-tap onPointerDown={(e) => onTap(SLIDE_CUES.board, e)}>
          <path
            d={`M${BOARD.x0 - 10} ${BOARD.y + UNDER} Q${(BOARD.x0 + BOARD.x1) / 2} ${BOARD.y + UNDER + 1} ${BOARD.x1 + 8} ${BOARD.y + UNDER + 4 + bend}`}
            fill="none"
            stroke={INK}
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d={`M${BOARD.x0 - 10} ${BOARD.y + UNDER} Q${(BOARD.x0 + BOARD.x1) / 2} ${BOARD.y + UNDER + 1} ${BOARD.x1 + 8} ${BOARD.y + UNDER + 4 + bend}`}
            fill="none"
            stroke="#ffb703"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </g>
      </Piece>

      {/* The whirlpool: its basin, the water and the swirl in it */}
      <g data-tap onPointerDown={(e) => onTap(SLIDE_CUES.splash, e)}>
        <ellipse cx={basin.cx} cy={basin.cy} rx={basin.rx} ry={basin.ry} fill="#fff" stroke={INK} strokeWidth="5" />
        <ellipse cx={basin.cx} cy={basin.cy + 4} rx={basin.rx - 12} ry={basin.ry - 8} fill={WATER} />
      </g>
      {/* The swirl turns in a layer of its own, drawn round and squashed into the basin by its transform */}
      <Piece
        layer="back"
        rest={still}
        box={{ x: basin.cx - basin.rx, y: basin.cy + 6 - basin.rx, w: 2 * basin.rx, h: 2 * basin.rx }}
        turn={{ deg: swirl, x: basin.cx, y: basin.cy + 6, sy: (basin.ry - 8) / (basin.rx - 12) }}
      >
        <g data-tap onPointerDown={(e) => onTap(SLIDE_CUES.splash, e)} transform={`translate(${basin.cx} ${basin.cy + 6})`}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={sample(20, (u) => {
                const a = u * 1.6 * Math.PI + (i * 2 * Math.PI) / 3;
                const r = 30 + (basin.rx - 50) * u;
                return { x: r * Math.cos(a), y: r * Math.sin(a) };
              })
                .map((p, j) => `${j ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
                .join(" ")}
              fill="none"
              stroke={FOAM}
              strokeWidth="10"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
          <circle r="22" fill="#1b8fc4" />
        </g>
      </Piece>
      <Drops x={whirlAt(0).x} y={whirlAt(0).y} age={ages[SLIDE_CUES.splash]} />
    </g>
  );
}

/** What the water slide's stretch sounds like. */
function slideCue(cue: number) {
  if (cue === SLIDE_CUES.board) playBoing();
  else if (cue === SLIDE_CUES.splash) playSplash();
  else if (cue === SLIDE_CUES.drain) playGlug();
  else playSlide();
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
  landSound: playSplash,
  fullSound: playDrops,
  full: {
    de: "Alle sind im Becken!",
    en: "Everyone is in the pool!",
    zh: "大家都到水池里啦！",
    hi: "सब पानी में पहुँच गए!",
    es: "¡Todos están en la piscina!",
    ar: "الجميع في المسبح!",
    ru: "Все в бассейне!",
  },
  peekers: ["🐬", "🐠", "🐳", "🦦", "🐢", "🐙"],
  magic: false,
  End: PoolEnd,
  stretch: STRETCHES.slide,
  StretchArt: SlideStretch,
  cue: slideCue,
};
