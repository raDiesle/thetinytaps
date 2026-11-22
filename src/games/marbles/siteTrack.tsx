// „Baustellen-Bahn“ (K-18): the marble run on a building site. A log, a tyre,
// a stone, a big nut and a balloon ride conveyor belts down into a skip, and
// when it is full the crane's hook comes down and lifts it up. On the way down
// the lower wall they hop down scaffold planks, ride a bucket elevator up and
// drop through a rubble chute.

import { memo, useId } from "react";
import { playBoing, playClonk, playKnock, playRumble, playSqueak, playThump, playWhirr } from "@/lib/sfx";
import { VIEW_W, wobble } from "./level";
import { BALL_R, type Pt } from "./path";
import { BASKET, TRACK_H } from "./track";
import { CHUTE, ELEVATOR, PLANKS, SITE_CUES, STRETCHES } from "./trackStretches";
import { type EndProps, INK, type StretchArtProps, type ThingProps, type TrackTheme } from "./trackTheme";

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

/** How long a bucket takes from the bottom of the elevator to its top. */
const BUCKET_S = (ELEVATOR.bottom - ELEVATOR.top) / ELEVATOR.speed;
/** The links of the elevator's chain, this far apart. */
const LINK = 40;

/** A bucket of the elevator round `x`, `y` (where a thing sits in it), tipped by `tip` degrees. */
function Bucket({ x, y, tip = 0 }: { x: number; y: number; tip?: number }) {
  return (
    <g transform={`rotate(${tip} ${x} ${y})`}>
      <path
        d={`M${x - BALL_R - 10} ${y - 4} L${x + BALL_R + 10} ${y - 4} L${x + BALL_R + 2} ${y + BALL_R + 10} L${x - BALL_R - 2} ${y + BALL_R + 10} Z`}
        fill="#ffb703"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <line x1={x - BALL_R - 6} y1={y + 6} x2={x + BALL_R + 6} y2={y + 6} stroke="#e09a00" strokeWidth="4" />
    </g>
  );
}

/** One funnel of the rubble chute, `i` from the top, wide at its top and narrower below, hanging into the next. */
function funnel(i: number) {
  const step = (CHUTE.bottom - CHUTE.top) / CHUTE.segments;
  const top = CHUTE.top + i * step - 14;
  return { top, bottom: top + step + 10, wide: BALL_R + 20, narrow: BALL_R + 11 };
}

/**
 * The building site's own stretch: a stair of scaffold planks that bend as a thing lands on each, a bucket elevator –
 * a thing drops into a bucket at its bottom and is carried up on the chain, then tipped out at the top – and a rubble
 * chute of hanging funnels that each knock and swing as a thing drops through them into the skip.
 */
function SiteStretch({ layer, ages, onTap }: StretchArtProps) {
  if (layer === "front") {
    // The funnels' rims in front of the things dropping through them.
    return (
      <g pointerEvents="none">
        {Array.from({ length: CHUTE.segments }, (_, i) => {
          const f = funnel(i);
          const swing = wobble(ages[SITE_CUES.chute + i], 3, 9, 4);
          return (
            <g key={i} transform={`rotate(${swing} ${CHUTE.x} ${f.top})`}>
              <path
                d={`M${CHUTE.x - f.wide} ${f.top} L${CHUTE.x + f.wide} ${f.top} L${CHUTE.x + f.wide - 2} ${f.top + 16} L${CHUTE.x - f.wide + 2} ${f.top + 16} Z`}
                fill="#e85d04"
                stroke={INK}
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </g>
    );
  }
  const ran = Math.min(Math.max(0, ages[SITE_CUES.bucketOn]), BUCKET_S);
  const shift = (ran * ELEVATOR.speed) % LINK;
  const turn = (ran * ELEVATOR.speed * 180) / (Math.PI * 30);
  const wheel = (y: number) => (
    <g transform={`rotate(${-turn} ${ELEVATOR.x} ${y})`}>
      <circle cx={ELEVATOR.x} cy={y} r="30" fill="#adb5bd" stroke={INK} strokeWidth="4" />
      <path d={`M${ELEVATOR.x - 22} ${y} H${ELEVATOR.x + 22} M${ELEVATOR.x} ${y - 22} V${y + 22}`} stroke={INK} strokeWidth="4" />
    </g>
  );
  const chainTop = ELEVATOR.top - 30;
  const chainBottom = ELEVATOR.bottom + 40;
  return (
    <g>
      {/* The scaffold: a pole down from each plank, and the planks bending a little as a thing lands */}
      {PLANKS.map((plank, i) => (
        <rect key={`pole${i}`} x={plank.x0 + 6} y={plank.y} width="12" height={TRACK_H - plank.y} fill="#adb5bd" stroke={INK} strokeWidth="3" />
      ))}
      {PLANKS.map((plank, i) => {
        const sag = wobble(ages[SITE_CUES.planks + i], 7, 12, 4);
        const top = plank.y - 3;
        return (
          <g key={i} data-tap onPointerDown={(e) => onTap(SITE_CUES.planks + i, e)}>
            <path
              d={`M${plank.x0} ${top} Q${(plank.x0 + plank.x1) / 2} ${top + 2 * sag} ${plank.x1} ${top + 3} V${top + 17} Q${(plank.x0 + plank.x1) / 2} ${top + 16 + 2 * sag} ${plank.x0} ${top + 14} Z`}
              fill="#d9a066"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1={plank.x0 + 8} y1={top + 8} x2={plank.x1 - 8} y2={top + 10 + sag} stroke="#b07a42" strokeWidth="3" />
          </g>
        );
      })}

      {/* The bucket elevator: its steel frame, the chain moving up while a bucket rides, its two wheels */}
      <g data-tap onPointerDown={(e) => onTap(SITE_CUES.bucketOn, e)}>
        {[-58, 58].map((dx) => (
          <rect key={dx} x={ELEVATOR.x + dx - 7} y={chainTop - 40} width="14" height={TRACK_H - chainTop + 40} fill="#6c757d" stroke={INK} strokeWidth="3" />
        ))}
        {Array.from({ length: 8 }, (_, i) => {
          const y = chainTop + ((chainBottom - chainTop) * (i + 0.5)) / 8;
          return <line key={i} x1={ELEVATOR.x - 52} y1={y} x2={ELEVATOR.x + 52} y2={y + (i % 2 ? -70 : 70)} stroke="#6c757d" strokeWidth="5" opacity="0.6" />;
        })}
        <rect x={ELEVATOR.x - 12} y={chainTop} width="24" height={chainBottom - chainTop} fill="#3d3d45" stroke={INK} strokeWidth="3" />
        {Array.from({ length: Math.floor((chainBottom - chainTop) / LINK) }, (_, i) => (
          <line
            key={i}
            x1={ELEVATOR.x - 10}
            y1={chainBottom - 6 - i * LINK - shift}
            x2={ELEVATOR.x + 10}
            y2={chainBottom - 6 - i * LINK - shift}
            stroke="#adb5bd"
            strokeWidth="4"
          />
        ))}
        {wheel(chainTop)}
        {wheel(chainBottom)}
        {/* A bucket waiting at the bottom, and one tipped out at the top */}
        <Bucket x={ELEVATOR.x} y={ELEVATOR.bottom} />
      </g>
      <g data-tap onPointerDown={(e) => onTap(SITE_CUES.bucketOff, e)}>
        <Bucket x={ELEVATOR.x + 10} y={ELEVATOR.top - 4} tip={60 - wobble(ages[SITE_CUES.bucketOff], 14, 8, 3)} />
      </g>

      {/* The rubble chute: its funnels hanging on chains from an arm, each swinging as a thing knocks through */}
      <line x1={CHUTE.x} y1={CHUTE.top - 70} x2={CHUTE.x + 170} y2={CHUTE.top - 70} stroke="#ffb703" strokeWidth="14" strokeLinecap="round" />
      <line x1={CHUTE.x + 160} y1={CHUTE.top - 70} x2={CHUTE.x + 160} y2={TRACK_H} stroke="#ffb703" strokeWidth="14" />
      {Array.from({ length: CHUTE.segments }, (_, i) => {
        const f = funnel(i);
        const swing = wobble(ages[SITE_CUES.chute + i], 3, 9, 4);
        return (
          <g key={i} data-tap onPointerDown={(e) => onTap(SITE_CUES.chute + i, e)} transform={`rotate(${swing} ${CHUTE.x} ${f.top})`}>
            {i === 0 && <line x1={CHUTE.x + f.wide - 6} y1={f.top} x2={CHUTE.x + 50} y2={CHUTE.top - 70} stroke={INK} strokeWidth="3" />}
            <path
              d={`M${CHUTE.x - f.wide} ${f.top} L${CHUTE.x + f.wide} ${f.top} L${CHUTE.x + f.narrow} ${f.bottom} L${CHUTE.x - f.narrow} ${f.bottom} Z`}
              fill="#f48c06"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d={`M${CHUTE.x - f.narrow + 6} ${f.top + 24} V${f.bottom - 8}`} stroke="#ffd166" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          </g>
        );
      })}
    </g>
  );
}

/** The bucket the things ride up the elevator in: its back behind them, its front in front of them. */
function BucketCarrier({ layer }: { layer: "back" | "front" }) {
  if (layer === "back") return <rect x={-BALL_R - 8} y={-6} width={2 * BALL_R + 16} height={BALL_R + 14} rx="4" fill="#c27c00" stroke={INK} strokeWidth="3" />;
  return <Bucket x={0} y={0} />;
}

/** What the building site's stretch sounds like: a knock lower on each plank, the elevator whirring, a hollow knock in each funnel. */
function siteCue(cue: number) {
  if (cue < SITE_CUES.bucketOn) playKnock(900 - 50 * (cue - SITE_CUES.planks));
  else if (cue === SITE_CUES.bucketOn) playWhirr();
  else if (cue === SITE_CUES.bucketOff) playClonk();
  else playKnock(340 - 20 * (cue - SITE_CUES.chute));
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
  full: {
    de: "Voll! Der Kran hebt alles hoch!",
    en: "Full! The crane lifts everything up!",
    zh: "满啦！吊车把东西全吊起来啦！",
    hi: "भर गया! क्रेन सब कुछ ऊपर उठाती है!",
    es: "¡Lleno! ¡La grúa lo levanta todo!",
    ar: "امتلأ! الرافعة ترفع كل شيء!",
    ru: "Полный! Кран поднимает всё наверх!",
  },
  peekers: ["🦊", "🐿️", "🦔", "🐌", "🐻", "🐦"],
  magic: false,
  End: SkipEnd,
  pileLift: liftAt,
  stretch: STRETCHES.site,
  StretchArt: SiteStretch,
  cue: siteCue,
  Carrier: BucketCarrier,
};
