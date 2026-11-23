// „Weltraumbahn“ (K-18): the marble run in space. Planets, a ringed planet, the
// moon, a smiling star and a comet roll on glowing rails down to a little moon,
// and when everything has landed there, shooting stars fly over it. On the way
// down the lower wall they orbit a big planet and go through a wormhole.

import { memo, type PointerEvent, useId } from "react";
import { playBeam, playBoing, playPing, playPlink, playPop, playRumble, playSwirl, playThump, playTrill, playTwinkle, playWhoosh } from "@/lib/sfx";
import { VIEW_W, wobble, decay } from "./level";
import { STAR_POINTS } from "./parts";
import { BALL_R, type Pt } from "./path";
import { BASKET, TRACK_H } from "./track";
import { ORBIT, ORBIT_IN, railPath, sample, SPACE_CUES, STRETCHES, UNDER, WORMHOLE } from "./trackStretches";
import { type EndProps, INK, type StretchArtProps, type ThingProps, type TrackTheme } from "./trackTheme";

const GOLD = "#ffd23f";
const MOON = "#c9ccd6";
const CRATER = "#a9adba";

/** A star with five points, `outer` and `inner` wide, as SVG points around 0, 0. */
const star = (outer: number, inner: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 ? inner : outer;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
const BIG_STAR = star(27, 12);

/** The night sky full of stars, with far planets at the edges, where the run leaves room. */
const SpaceBackdrop = memo(function SpaceBackdrop() {
  const id = useId();
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#17123a" />
          <stop offset="1" stopColor="#2c1f62" />
        </linearGradient>
        <pattern id={`${id}stars`} width="180" height="180" patternUnits="userSpaceOnUse">
          {[
            { x: 20, y: 30, r: 2.5 },
            { x: 90, y: 70, r: 1.5 },
            { x: 150, y: 20, r: 2 },
            { x: 60, y: 140, r: 2 },
            { x: 130, y: 120, r: 1.2 },
            { x: 170, y: 160, r: 1.8 },
          ].map(({ x, y, r }) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="#fff" opacity="0.85" />
          ))}
          <polygon points={STAR_POINTS} fill="#fff6c9" opacity="0.7" transform="translate(110 30) scale(0.45)" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}sky)`} />
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${id}stars)`} />
      {/* A pink planet peeking in on the left, a blue one with a ring on the right, a crescent moon up high */}
      <circle cx="-70" cy="600" r="130" fill="#ff7bd0" opacity="0.55" />
      <ellipse cx="-70" cy="600" rx="190" ry="26" fill="none" stroke="#ffd6f0" strokeWidth="8" opacity="0.4" transform="rotate(-18 -70 600)" />
      <circle cx="1680" cy="1480" r="160" fill="#3a86ff" opacity="0.45" />
      <path d="M1460 -120 A60 60 0 1 0 1520 -10 A48 48 0 1 1 1460 -120 Z" fill="#fff3b0" opacity="0.8" />
    </g>
  );
});

/** A glowing rail. */
function SpaceRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g strokeLinecap="round">
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#8e7dff" strokeWidth="26" opacity="0.25" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#8e7dff" strokeWidth="12" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#e3dcff" strokeWidth="3" />
    </g>
  );
}

/** A planet in its colour, a ringed planet, the moon, a smiling star and a comet. */
function SpaceThing({ kind, color, spin }: ThingProps) {
  const deg = (spin * 180) / Math.PI;
  switch (kind) {
    case "marble":
      return (
        <g>
          <circle r={BALL_R} fill={color} stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill="#fff">
            <ellipse cy="-8" rx="18" ry="4" opacity="0.35" />
            <ellipse cy="5" rx="20" ry="3.5" opacity="0.25" />
            <circle cx="9" cy="12" r="4" opacity="0.3" />
          </g>
          <circle cx="-7" cy="-8" r="5" fill="#fff" opacity="0.6" />
        </g>
      );
    case "tennis":
      return (
        <g>
          <path d="M-31 0 A31 8 0 0 1 31 0" transform="rotate(-18)" fill="none" stroke="#ff8c42" strokeWidth="5" strokeLinecap="round" />
          <circle r="18" fill="#ffb703" stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill="#e08a00">
            <ellipse cy="-6" rx="15" ry="3" />
            <ellipse cy="5" rx="16" ry="2.5" />
          </g>
          <path d="M-31 0 A31 8 0 0 0 31 0" transform="rotate(-18)" fill="none" stroke="#ff8c42" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "iron":
      return (
        <g>
          <circle r="25" fill={MOON} stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill={CRATER}>
            <circle cx="-8" cy="-9" r="6" />
            <circle cx="10" cy="4" r="8" />
            <circle cx="-6" cy="12" r="4" />
            <circle cx="12" cy="-13" r="3" />
          </g>
          <circle cx="-10" cy="-12" r="4" fill="#fff" opacity="0.6" />
        </g>
      );
    case "apple":
      return (
        <g transform={`rotate(${deg})`}>
          <polygon points={BIG_STAR} fill={GOLD} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="-5" cy="-2" r="2.5" fill={INK} />
          <circle cx="5" cy="-2" r="2.5" fill={INK} />
          <path d="M-5 4 Q0 9 5 4" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "bubble":
      // The comet's tail always trails up behind it, like a falling star's.
      return (
        <g>
          <path d="M-6 -16 L-66 -44 L-16 4 Z" fill="#ffe9a8" opacity="0.55" />
          <path d="M-4 -10 L-44 -30 L-10 0 Z" fill="#fff" opacity="0.6" />
          <circle r="22" fill={GOLD} opacity="0.3" />
          <circle r="15" fill="#fff3c4" stroke={GOLD} strokeWidth="3" />
          <polygon points={STAR_POINTS} fill="#fff" transform={`rotate(${deg * 0.5}) scale(0.6)`} />
        </g>
      );
  }
}

/** A shooting star flying down over the moon, `age` seconds after it set off. */
function ShootingStar({ from, age }: { from: Pt; age: number }) {
  const k = age / 1.1;
  if (k < 0 || k >= 1) return null;
  const x = from.x + 760 * k;
  const y = from.y + 300 * k;
  return (
    <g opacity={k < 0.8 ? 1 : (1 - k) * 5} pointerEvents="none">
      <line x1={x - 180} y1={y - 71} x2={x} y2={y} stroke="#fff3c4" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
      <polygon points={BIG_STAR} fill={GOLD} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" transform={`translate(${x} ${y}) rotate(${k * 360})`} />
    </g>
  );
}

/** The end of the space run: a little moon with a crater the things land in; when it is full, shooting stars fly over it. */
function MoonEnd({ layer, fullAge, tapAge }: EndProps) {
  const cx = (BASKET.x0 + BASKET.x1) / 2;
  const dip = wobble(tapAge, 5, 18, 6);
  if (layer === "back") {
    return (
      <g>
        <ellipse cx={cx} cy={BASKET.rimY + dip} rx={(BASKET.x1 - BASKET.x0) / 2} ry="16" fill="#6e7282" />
        {fullAge >= 0 &&
          [
            { x: 620, y: TRACK_H - 730 },
            { x: 820, y: TRACK_H - 810 },
            { x: 700, y: TRACK_H - 590 },
          ].map((from, i) => <ShootingStar key={i} from={from} age={fullAge - i * 0.35} />)}
      </g>
    );
  }
  return (
    <g transform={`translate(0 ${dip})`}>
      <path
        d={`M1225 ${TRACK_H + 30} C1250 ${TRACK_H - 45} 1285 ${TRACK_H - 68} 1300 ${BASKET.rimY} L1530 ${BASKET.rimY} C1560 ${TRACK_H - 64} 1600 ${TRACK_H - 44} 1640 ${TRACK_H + 30} Z`}
        fill={MOON}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx="1330" cy={TRACK_H - 28} rx="22" ry="8" fill={CRATER} />
      <ellipse cx="1470" cy={TRACK_H - 36} rx="30" ry="9" fill={CRATER} />
      <ellipse cx="1405" cy={TRACK_H - 10} rx="14" ry="5" fill={CRATER} />
      <path d={`M1300 ${BASKET.rimY + 6} L1530 ${BASKET.rimY + 6}`} stroke="#fff" strokeWidth="5" opacity="0.6" strokeLinecap="round" />
    </g>
  );
}

/** The big striped planet the things orbit, with a friendly face; it rocks a little each time one comes round. */
function Planet({ rock }: { rock: number }) {
  const { cx, cy, planet: r } = ORBIT;
  return (
    <g transform={`rotate(${rock} ${cx} ${cy + r})`}>
      <circle cx={cx} cy={cy} r={r} fill="#ff9f1c" stroke={INK} strokeWidth="5" />
      <path d={`M${cx - r + 8} ${cy - 40} Q${cx} ${cy - 62} ${cx + r - 8} ${cy - 40}`} fill="none" stroke="#ffd166" strokeWidth="16" strokeLinecap="round" />
      <path d={`M${cx - r + 4} ${cy + 46} Q${cx} ${cy + 26} ${cx + r - 4} ${cy + 46}`} fill="none" stroke="#e76f51" strokeWidth="18" strokeLinecap="round" />
      <circle cx={cx - 34} cy={cy - 6} r="10" fill={INK} />
      <circle cx={cx + 34} cy={cy - 6} r="10" fill={INK} />
      <circle cx={cx - 31} cy={cy - 10} r="3.5" fill="#fff" />
      <circle cx={cx + 37} cy={cy - 10} r="3.5" fill="#fff" />
      <path d={`M${cx - 22} ${cy + 18} Q${cx} ${cy + 36} ${cx + 22} ${cy + 18}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle cx={cx - 60} cy={cy + 12} r="11" fill="#ff7bd0" opacity="0.55" />
      <circle cx={cx + 60} cy={cy + 12} r="11" fill="#ff7bd0" opacity="0.55" />
    </g>
  );
}

/** A swirl of the wormhole at `at`, three arms turning once round when a thing goes in or comes out (`turn` from 0 to 1). */
function Swirl({ at, turn, dir }: { at: Pt; turn: number; dir: 1 | -1 }) {
  const arm = (i: number) =>
    sample(24, (u) => {
      const a = dir * (u * 2.2 * Math.PI + (i * 2 * Math.PI) / 3);
      const r = 6 + 56 * u;
      return { x: r * Math.cos(a), y: r * Math.sin(a) };
    })
      .map((p, j) => `${j ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
  return (
    <g transform={`translate(${at.x} ${at.y}) scale(1 0.7) rotate(${dir * 360 * turn})`}>
      <circle r="64" fill="#2c1f62" stroke="#8e7dff" strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={arm(i)} fill="none" stroke={["#ff7bd0", "#8e7dff", "#4cc9f0"][i]} strokeWidth="9" strokeLinecap="round" />
      ))}
      <circle r="9" fill="#17123a" />
    </g>
  );
}

/** How far a swirl has turned, `age` seconds after a thing went in or came out: once round, slowing down. */
const swirlTurn = (age: number) => (age < 0 ? 0 : 1 - decay(age * 1.5));

/**
 * The space run's own stretch: a big striped planet with a friendly face, which the things orbit two and a quarter
 * times on a dotted track – behind it on the far side, in front of it on the near side – and a wormhole: a thing
 * rolls into one swirl, is gone, and comes out of the other one far below.
 */
function SpaceStretch({ layer, ages, onTap }: StretchArtProps) {
  const lap = Math.min(...[0, 1, 2].map((i) => ages[SPACE_CUES.orbit + i]));
  const rock = wobble(lap, 3, 10, 3);
  const id = useId();
  const tapPlanet = (e: PointerEvent) => onTap(SPACE_CUES.orbit, e);
  if (layer === "front") {
    // The planet's upper half again, in front of the things on the far side of their orbit.
    return (
      <g data-tap onPointerDown={tapPlanet}>
        <defs>
          <clipPath id={`${id}far`}>
            <rect x={ORBIT.cx - ORBIT.planet - 20} y={ORBIT.cy - ORBIT.planet - 20} width={2 * ORBIT.planet + 40} height={ORBIT.planet + 20} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}far)`}>
          <Planet rock={rock} />
        </g>
      </g>
    );
  }
  const into = railPath(ORBIT_IN, UNDER, -1);
  return (
    <g>
      {/* The curve down onto the orbit, the orbit's dotted track and the planet */}
      <g fill="none" strokeLinecap="round">
        <path d={into} stroke={INK} strokeWidth="18" />
        <path d={into} stroke="#8e7dff" strokeWidth="12" />
      </g>
      <ellipse
        cx={ORBIT.cx}
        cy={ORBIT.cy}
        rx={ORBIT.rx}
        ry={ORBIT.ry}
        fill="none"
        stroke="#e3dcff"
        strokeWidth="5"
        strokeDasharray="4 18"
        strokeLinecap="round"
      />
      <g data-tap onPointerDown={tapPlanet}>
        <Planet rock={rock} />
      </g>
      {/* The wormhole's two swirls */}
      <g data-tap onPointerDown={(e) => onTap(SPACE_CUES.wormIn, e)}>
        <Swirl at={WORMHOLE.in} turn={swirlTurn(ages[SPACE_CUES.wormIn])} dir={1} />
      </g>
      <g data-tap onPointerDown={(e) => onTap(SPACE_CUES.wormOut, e)}>
        <Swirl at={WORMHOLE.out} turn={swirlTurn(ages[SPACE_CUES.wormOut])} dir={-1} />
      </g>
    </g>
  );
}

/** What the space stretch sounds like: a note higher for each time round the planet, a swirl into the wormhole and a pop out of it. */
function spaceCue(cue: number) {
  if (cue < SPACE_CUES.wormIn) playPlink(2 * (cue - SPACE_CUES.orbit) + 1);
  else if (cue === SPACE_CUES.wormIn) playSwirl();
  else playPop();
}

/** The space run. */
export const SPACE_TRACK: TrackTheme = {
  level: "spacetrack",
  Backdrop: SpaceBackdrop,
  Rail: SpaceRail,
  board: { fill: "#2e2870", edge: "#8e7dff" },
  post: "#6c5ce7",
  shelf: "#8e7dff",
  hopper: "#ff7bd0",
  tunnel: { fill: "#3a2a8c", lines: "#8e7dff" },
  Thing: SpaceThing,
  release: { marble: playBeam, tennis: playBoing, iron: playRumble, apple: playTwinkle, bubble: playWhoosh },
  landSound: (kind) => (kind === "iron" ? playThump() : playPing()),
  fullSound: playTrill,
  full: {
    de: "Alle sind auf dem Mond! Sternschnuppen!",
    en: "Everyone is on the moon! Shooting stars!",
    zh: "大家都到月亮上啦！流星来啦！",
    hi: "सब चाँद पर पहुँच गए! टूटते तारे!",
    es: "¡Todos están en la luna! ¡Estrellas fugaces!",
    ar: "الجميع على القمر! شهب!",
    ru: "Все на луне! Падающие звёзды!",
  },
  peekers: ["👽", "🤖", "🧑‍🚀", "👾", "🐙", "🦄"],
  magic: false,
  End: MoonEnd,
  stretch: STRETCHES.space,
  StretchArt: SpaceStretch,
  cue: spaceCue,
};
