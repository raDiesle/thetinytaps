import { useId } from "react";
import { STAR_PATH } from "@/components/TapFeedback";
import { trophyPicture } from "@/components/trophyPictures";
import { gameOrder, trophyKey } from "@/lib/trophies";

/*
 * A trophy for one level of one game (user decision, November 2026): each looks different – its metal from its game,
 * its form, handles, lid and foot from its level, and in its medallion the picture of what was played
 * (trophyPictures.ts). Drawn once, still: it never moves by itself. A picture made for each trophy may replace the
 * drawing later (an idea on /management/).
 */

/** A metal's three tones: its shadow, its colour, its shine. */
interface Metal {
  dark: string;
  base: string;
  light: string;
}

/** The metals, one per game in the shelf's order, so neighbouring games' trophies differ at a glance. */
export const METALS: Metal[] = [
  { dark: "#a46d12", base: "#e8b737", light: "#fff3b8" },
  { dark: "#7d8792", base: "#c9d1da", light: "#ffffff" },
  { dark: "#7f461c", base: "#c58043", light: "#f6cfa2" },
  { dark: "#9c5752", base: "#e0a196", light: "#ffe4dc" },
  { dark: "#22705a", base: "#58b892", light: "#d9f7ea" },
  { dark: "#2c5b9a", base: "#6c9fe0", light: "#e0edff" },
];

const FORMS = ["round", "tall", "wide", "star"] as const;
const HANDLES = ["loops", "rings", "none"] as const;
const LIDS = ["open", "ball", "star"] as const;
const FEET = ["block", "steps", "round"] as const;

/** What makes a trophy look like no other: its metal, the cup's form (or a star), its handles, its lid and its foot. */
export interface TrophyLook {
  metal: number;
  form: (typeof FORMS)[number];
  handles: (typeof HANDLES)[number];
  lid: (typeof LIDS)[number];
  foot: (typeof FEET)[number];
}

/** A small, stable hash of a text (FNV-1a), so a level's trophy looks the same on every visit. */
function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** How the trophy of `level` in the game at `game` looks: its metal by the game, the rest by the level. */
export function trophyLook(game: string, level: string): TrophyLook {
  const h = hash(trophyKey(game, level));
  const order = gameOrder(game);
  return {
    metal: (order >= 0 ? order : hash(game)) % METALS.length,
    form: FORMS[h % FORMS.length],
    handles: HANDLES[Math.floor(h / 4) % HANDLES.length],
    lid: LIDS[Math.floor(h / 12) % LIDS.length],
    foot: FEET[Math.floor(h / 36) % FEET.length],
  };
}

/** A star's outline with `points` points round (cx, cy), from radius `outer` to `inner`. */
function starPath(cx: number, cy: number, outer: number, inner: number, points = 5) {
  return `${Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 ? inner : outer;
    const a = (Math.PI * i) / points - Math.PI / 2;
    return `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ")} Z`;
}

/** The cups: their body, the rim's middle height and half width, where the medallion sits and how big, the cup's bottom. */
const CUPS = {
  round: { body: "M22 40 H78 C78 70 68 90 50 94 C32 90 22 70 22 40 Z", rim: 40, rx: 28, medal: [50, 63, 17], bottom: 93 },
  tall: { body: "M28 28 H72 C72 66 64 92 50 97 C36 92 28 66 28 28 Z", rim: 28, rx: 22, medal: [50, 58, 16], bottom: 96 },
  wide: { body: "M14 52 H86 C84 76 70 92 50 94 C30 92 16 76 14 52 Z", rim: 52, rx: 36, medal: [50, 71, 15], bottom: 93 },
} as const;

/** The ink line of the book's drawings round each part. */
const INK = "#4a2e22";

/** The trophy of `level` in the game at `game`, as a still drawing 2 : 3. */
export function Trophy({ game, level, className, label }: { game: string; level: string; className?: string; label?: string }) {
  const uid = useId().replaceAll(":", "");
  const look = trophyLook(game, level);
  const metal = METALS[look.metal];
  const picture = trophyPicture(game, level);
  const fill = `url(#${uid}m)`;
  const cup = look.form === "star" ? undefined : CUPS[look.form];
  const [mx, my, mr] = cup ? cup.medal : [50, 62, 15];
  const bottom = cup ? cup.bottom : 98;
  return (
    <svg viewBox="0 0 100 150" className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <defs>
        <linearGradient id={`${uid}m`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={metal.dark} />
          <stop offset="0.28" stopColor={metal.base} />
          <stop offset="0.42" stopColor={metal.light} />
          <stop offset="0.6" stopColor={metal.base} />
          <stop offset="1" stopColor={metal.dark} />
        </linearGradient>
        <linearGradient id={`${uid}w`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8693a" />
          <stop offset="1" stopColor="#6e3d1d" />
        </linearGradient>
        <clipPath id={`${uid}c`}>
          <circle cx={mx} cy={my} r={mr} />
        </clipPath>
      </defs>
      <ellipse cx="50" cy="147" rx="36" ry="3" fill="#3a26143d" />
      <Foot kind={look.foot} metal={metal} fill={fill} wood={`url(#${uid}w)`} />
      {/* The stem with a knot, from the cup down to the foot. */}
      <path d={`M45 ${bottom} H55 L58 119 H42 Z`} fill={fill} stroke={INK} strokeWidth="1.4" />
      <ellipse cx="50" cy={(bottom + 119) / 2} rx="7" ry="3.2" fill={fill} stroke={INK} strokeWidth="1.4" />
      {cup ? (
        <>
          {look.handles === "loops" && (
            <g fill="none" stroke={INK} strokeWidth="7.5" strokeLinecap="round">
              <path d={handle(cup.rim, cup.rx)} />
              <path d={handle(cup.rim, cup.rx)} transform="matrix(-1 0 0 1 100 0)" />
            </g>
          )}
          {look.handles === "loops" && (
            <g fill="none" stroke={metal.base} strokeWidth="4.5" strokeLinecap="round">
              <path d={handle(cup.rim, cup.rx)} />
              <path d={handle(cup.rim, cup.rx)} transform="matrix(-1 0 0 1 100 0)" />
            </g>
          )}
          {look.handles === "rings" &&
            [-1, 1].map((side) => (
              <circle key={side} cx={50 + side * (cup.rx + 5)} cy={cup.rim + 16} r="7" fill="none" stroke={metal.base} strokeWidth="3.5" />
            ))}
          <path d={cup.body} fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
          {/* A shine down the cup's left, painted still. */}
          <path
            d={`M${50 - cup.rx + 7} ${cup.rim + 6} C${50 - cup.rx + 6} ${cup.rim + 26} ${50 - cup.rx + 12} ${cup.rim + 38} ${50 - cup.rx + 18} ${cup.rim + 44}`}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.55"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <ellipse cx="50" cy={cup.rim} rx={cup.rx} ry={cup.rx / 6} fill={metal.light} stroke={INK} strokeWidth="1.6" />
          {look.lid === "open" ? (
            <ellipse cx="50" cy={cup.rim + 0.6} rx={cup.rx - 3.5} ry={cup.rx / 6 - 1.6} fill={metal.dark} />
          ) : (
            <>
              <path
                d={`M${50 - cup.rx * 0.82} ${cup.rim} Q50 ${cup.rim - cup.rx * 0.62} ${50 + cup.rx * 0.82} ${cup.rim} Z`}
                fill={fill}
                stroke={INK}
                strokeWidth="1.4"
              />
              {look.lid === "ball" ? (
                <circle cx="50" cy={cup.rim - cup.rx * 0.36 - 5} r="5.5" fill={metal.light} stroke={INK} strokeWidth="1.4" />
              ) : (
                <path d={starPath(50, cup.rim - cup.rx * 0.36 - 7, 9, 4)} fill={metal.light} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
              )}
            </>
          )}
        </>
      ) : (
        <path d={starPath(50, 62, 44, 22)} fill={fill} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
      )}
      {/* The medallion: the picture of what was played, in a metal ring. */}
      <circle cx={mx} cy={my} r={mr + 2.5} fill={metal.dark} stroke={INK} strokeWidth="1.2" />
      <circle cx={mx} cy={my} r={mr} fill="#fffaf0" />
      {picture ? (
        <image href={picture} x={mx - mr} y={my - mr} width={mr * 2} height={mr * 2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${uid}c)`} />
      ) : (
        <path d={STAR_PATH} transform={`translate(${mx - mr * 0.7} ${my - mr * 0.7}) scale(${(mr * 1.4) / 100})`} fill={metal.base} />
      )}
      <circle cx={mx} cy={my} r={mr} fill="none" stroke={metal.light} strokeWidth="1" />
    </svg>
  );
}

/** A handle's curve on the cup's left, from below the rim out and back to the body. */
function handle(rim: number, rx: number) {
  const x = 50 - rx + 3;
  const y = rim + 7;
  return `M${x} ${y} C${x - 17} ${y - 3} ${x - 15} ${y + 30} ${x + 10} ${y + 34}`;
}

/** The foot the trophy stands on: a wooden block, two wooden steps or a round metal foot, with a plate. */
function Foot({ kind, metal, fill, wood }: { kind: TrophyLook["foot"]; metal: Metal; fill: string; wood: string }) {
  if (kind === "round")
    return (
      <g stroke={INK} strokeWidth="1.4">
        <path d="M22 146 L32 121 H68 L78 146 Z" fill={fill} />
        <ellipse cx="50" cy="121" rx="18" ry="3.5" fill={metal.light} />
        <path d="M22 146 H78" />
      </g>
    );
  return (
    <g stroke={INK} strokeWidth="1.4">
      {kind === "block" ? (
        <>
          <rect x="20" y="124" width="60" height="22" rx="2" fill={wood} />
          <rect x="16" y="118" width="68" height="7" rx="2" fill={wood} />
        </>
      ) : (
        <>
          <rect x="18" y="128" width="64" height="18" rx="2" fill={wood} />
          <rect x="30" y="118" width="40" height="11" rx="2" fill={wood} />
        </>
      )}
      <rect x="38" y={kind === "block" ? 130 : 133} width="24" height="8" rx="1.5" fill={metal.base} strokeWidth="1" />
    </g>
  );
}
