import type { CSSProperties, ReactNode } from "react";
import { depthScale, HORIZON } from "./layout";
import { nth } from "./shared";
import type { SceneSound, SceneSpot, SpotKind } from "./types";
import "./spots.css";

// Every tap on a picture brings something to life, not only the items. A tap on a thing of the background that is
// wrapped in `<Poke>` (a tree, a house, a cloud) moves it; a tap anywhere else brings out what lives in that part of
// the picture (the scene's `spots`): a gust of wind through the sky that bends the trees, a beetle crawling out of
// the floor tiles, a spider on its thread on a wall, a flower growing out of the meadow, a fish jumping out of the
// water. Nothing here speaks, so there is nothing to translate.

/** How a `<Poke>` moves when tapped; things that sway or drift also move with a gust of wind. */
export type PokeKind = "sway" | "swing" | "wobble" | "hop" | "spin" | "drift" | "glow";

/**
 * A thing in the background that moves when tapped: a tree or a flag sways, a hanging sign or lamp swings, a house
 * wobbles, a cloud drifts. Wrap the whole thing; the movement turns around its bottom middle (swing: its top middle,
 * spin and glow: its middle). The group is new, so it
 * has no transform of its own that the movement would replace.
 */
export function Poke({ kind, children }: { kind: PokeKind; children: ReactNode }) {
  return <g data-poke={kind}>{children}</g>;
}

const POKES: Record<PokeKind, { frames: Keyframe[]; ms: number; sound: SceneSound }> = {
  sway: {
    frames: [
      { transform: "rotate(0)" },
      { transform: "rotate(-7deg)" },
      { transform: "rotate(5deg)" },
      { transform: "rotate(-3deg)" },
      { transform: "rotate(0)" },
    ],
    ms: 1100,
    sound: "rustle",
  },
  swing: {
    frames: [
      { transform: "rotate(0)" },
      { transform: "rotate(10deg)" },
      { transform: "rotate(-8deg)" },
      { transform: "rotate(4deg)" },
      { transform: "rotate(0)" },
    ],
    ms: 1300,
    sound: "creak",
  },
  wobble: {
    frames: [
      { transform: "scale(1, 1)" },
      { transform: "scale(1.06, 0.9)" },
      { transform: "scale(0.96, 1.06)" },
      { transform: "scale(1.02, 0.98)" },
      { transform: "scale(1, 1)" },
    ],
    ms: 700,
    sound: "boing",
  },
  hop: {
    frames: [
      { transform: "translateY(0)" },
      { transform: "translateY(-40px)" },
      { transform: "translateY(0)" },
      { transform: "translateY(-12px)" },
      { transform: "translateY(0)" },
    ],
    ms: 700,
    sound: "boing",
  },
  spin: { frames: [{ transform: "rotate(0)" }, { transform: "rotate(360deg)" }], ms: 1000, sound: "whoosh" },
  drift: {
    frames: [{ transform: "translateX(0)" }, { transform: "translateX(70px)" }, { transform: "translateX(-14px)" }, { transform: "translateX(0)" }],
    ms: 1600,
    sound: "whoosh",
  },
  glow: {
    frames: [
      { transform: "scale(1)", filter: "brightness(1)" },
      { transform: "scale(1.2)", filter: "brightness(1.35)" },
      { transform: "scale(1)", filter: "brightness(1)" },
    ],
    ms: 900,
    sound: "twinkle",
  },
};

/** A gust of wind pushes everything the same way: trees lean with it, clouds are blown along. */
const GUST: Partial<Record<PokeKind, Keyframe[]>> = {
  sway: [{ transform: "rotate(0)" }, { transform: "rotate(9deg)" }, { transform: "rotate(-3deg)" }, { transform: "rotate(2deg)" }, { transform: "rotate(0)" }],
  // Hanging from the top, it swings out the other way: away from the wind.
  swing: [
    { transform: "rotate(0)" },
    { transform: "rotate(-12deg)" },
    { transform: "rotate(5deg)" },
    { transform: "rotate(-2deg)" },
    { transform: "rotate(0)" },
  ],
  drift: POKES.drift.frames,
};
/** The gust crosses the picture from left to right in this time. */
const GUST_CROSS_MS = 700;

/** Moves a tapped `<Poke>` (again from the start, if it still moves) and returns its sound. */
export function poke(el: Element): SceneSound {
  const { frames, ms, sound } = POKES[el.getAttribute("data-poke") as PokeKind] ?? POKES.wobble;
  for (const running of el.getAnimations()) running.cancel();
  el.animate(frames, { duration: ms, easing: "ease-in-out" });
  return sound;
}

/** A gust of wind through the background: everything in it that sways or drifts moves with it, the left side first. */
export function gust(svg: SVGSVGElement, background: Element) {
  const { left, width } = svg.getBoundingClientRect();
  for (const el of background.querySelectorAll('[data-poke="sway"], [data-poke="swing"], [data-poke="drift"]')) {
    const frames = GUST[el.getAttribute("data-poke") as PokeKind];
    if (!frames) continue;
    const box = el.getBoundingClientRect();
    const delay = Math.max(0, ((box.left + box.width / 2 - left) / width) * GUST_CROSS_MS);
    for (const running of el.getAnimations()) running.cancel();
    el.animate(frames, { duration: 1100, delay, easing: "ease-in-out" });
  }
}

/** The spot a tap at (x, y) in picture units falls into, by its index in `spots` (the nearest picture edge counts). */
export function spotAt(spots: SceneSpot[], width: number, height: number, x: number, y: number): number {
  const cx = Math.min(width, Math.max(0, x));
  const cy = Math.min(height, Math.max(0, y));
  return spots.findIndex(({ box: [bx, by, w, h] }) => cx >= bx && cx <= bx + w && cy >= by && cy <= by + h);
}

/** Per kind: how long it plays, its sound, and whether it stands on the ground (smaller further back) or not. */
export const SPOTS: Record<SpotKind, { ms: number; sound: SceneSound; onGround: boolean }> = {
  wind: { ms: 1600, sound: "whoosh", onGround: false },
  flurry: { ms: 1600, sound: "whoosh", onGround: false },
  stars: { ms: 1600, sound: "twinkle", onGround: false },
  fireflies: { ms: 2600, sound: "chime", onGround: false },
  bug: { ms: 2800, sound: "tick", onGround: true },
  spider: { ms: 2800, sound: "boing", onGround: false },
  flower: { ms: 2800, sound: "pop", onGround: true },
  mole: { ms: 2200, sound: "sniff", onGround: true },
  splash: { ms: 1600, sound: "splash", onGround: true },
  bubbles: { ms: 2200, sound: "blub", onGround: false },
  crab: { ms: 2600, sound: "snap", onGround: true },
  snow: { ms: 2200, sound: "crunch", onGround: true },
};

/** Something brought out of the background by a tap, in picture units; `dir` is where it goes (1 right, -1 left). */
export interface SpotEffect {
  id: number;
  kind: SpotKind;
  x: number;
  y: number;
  dir: 1 | -1;
  /** Picks a colour or look, so the same spot shows something a little different each time. */
  variant: number;
}

/** How big an effect is drawn where it was tapped: things on the ground are smaller further back. */
export function spotScale(kind: SpotKind, y: number) {
  return SPOTS[kind].onGround ? 1.3 * depthScale(Math.max(HORIZON, Math.min(1000, y))) : 1;
}

const FLOWER_COLOURS = ["#ff7bd0", "#ffd60a", "#8e7dff", "#ff5d73", "#fff"];
const BUG_COLOURS = [
  ["#e63946", "#2b2d42"],
  ["#ffd60a", "#2b2d42"],
  ["#52b788", "#1b4332"],
];
const LEAF = "M0 -9 C6 -6 7 3 0 9 C-7 3 -6 -6 0 -9 Z";

/** One effect, drawn at the tap and gone again after its time (the engine removes it). */
export function SpotEffectArt({ effect }: { effect: SpotEffect }) {
  const { kind, x, y, dir, variant } = effect;
  const scale = spotScale(kind, y);
  const style = { "--spot-ms": `${SPOTS[kind].ms}ms`, "--dir": dir } as CSSProperties;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={`spot spot-${kind}`} style={style}>
        <Art kind={kind} dir={dir} variant={variant} id={effect.id} top={y} />
      </g>
    </g>
  );
}

function Art({ kind, dir, variant, id, top }: { kind: SpotKind; dir: 1 | -1; variant: number; id: number; top: number }) {
  switch (kind) {
    case "wind":
      return <Wind variant={variant} />;
    case "flurry":
      return <Wind variant={variant} snowy />;
    case "stars":
      return <ShootingStar />;
    case "fireflies":
      return <Fireflies />;
    case "bug":
      return <Bug dir={dir} variant={variant} />;
    case "spider":
      return <Spider top={top} />;
    case "flower":
      return <Flower dir={dir} variant={variant} />;
    case "mole":
      return <Peek id={id} ground="#8d6e4a" crumbs="#6f4e37" Animal={Mole} />;
    case "splash":
      return <Splash dir={dir} variant={variant} />;
    case "bubbles":
      return <Bubbles dir={dir} />;
    case "crab":
      return <Crab dir={dir} />;
    case "snow":
      return <Peek id={id} ground="#f8f9fa" crumbs="#fff" Animal={Bunny} />;
  }
}

/** Three swirls of air rush through the sky, with a few leaves (in winter: snowflakes) tumbling along. */
function Wind({ variant, snowy = false }: { variant: number; snowy?: boolean }) {
  const lines = [
    "M-280 -50 C-140 -90 40 -10 200 -50 c40 -10 60 -50 30 -62 c-20 -6 -34 12 -20 24",
    "M-320 10 C-160 -20 60 40 280 0",
    "M-260 70 C-120 40 40 90 180 60 c30 -6 44 -36 22 -46",
  ];
  const leaves = ["#52b788", variant % 2 ? "#f4a261" : "#95d5b2", "#e9c46a"];
  return (
    <>
      {lines.map((d, i) => (
        <g key={d} className="spot-wind-line" style={nth(i)}>
          <path d={d} pathLength={100} className="spot-wind-shade" />
          <path d={d} pathLength={100} className="spot-wind-air" />
        </g>
      ))}
      {leaves.map((colour, i) => (
        <g key={i} className="spot-wind-leaf" style={nth(i)}>
          {snowy ? (
            <circle cy={-40 + i * 45} r={9 + (i % 2) * 4} fill="#fff" stroke="#adb5bd" strokeWidth="2" />
          ) : (
            <path d={LEAF} transform={`translate(0 ${-40 + i * 45}) scale(2.2)`} fill={colour} />
          )}
        </g>
      ))}
    </>
  );
}

/** A shooting star streaks down across the sky; little stars twinkle where it started. */
function ShootingStar() {
  const star = "M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z";
  return (
    <>
      <g className="spot-stars-fall">
        <path d="M0 0 L120 -70" className="spot-stars-tail" />
        <path d={star} transform="scale(1.6)" fill="#ffe066" />
      </g>
      {[
        [-50, -40],
        [40, 30],
        [60, -50],
        [-30, 50],
      ].map(([dx, dy], i) => (
        <g key={i} transform={`translate(${dx} ${dy})`}>
          <path d={star} className="spot-stars-twinkle" style={nth(i)} fill="#fff3bf" />
        </g>
      ))}
    </>
  );
}

/** A few fireflies light up and float away, softly. */
function Fireflies() {
  const flies = [
    [-90, -120],
    [70, -150],
    [-30, -190],
    [110, -60],
    [-120, -40],
  ];
  return (
    <>
      {flies.map(([dx, dy], i) => (
        <g key={i} className="spot-firefly" style={{ ...nth(i), "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}>
          <circle r="22" fill="#ffd43b" opacity="0.4" />
          <circle r="9" fill="#ffe066" stroke="#fab005" strokeWidth="2" />
        </g>
      ))}
    </>
  );
}

/** A crack opens in the floor (or the path), and a ladybird or beetle crawls out and walks away. */
function Bug({ dir, variant }: { dir: 1 | -1; variant: number }) {
  const [shell, head] = BUG_COLOURS[variant % BUG_COLOURS.length];
  return (
    <>
      <path className="spot-bug-crack" d="M-40 0 l14 -6 l10 8 l14 -7 l12 6 l16 -5 M-8 2 l-4 12 M10 -4 l6 -10" />
      <g className="spot-bug-walk">
        <g transform={`scale(${dir} 1)`}>
          <g className="spot-bug-body">
            {[-14, 0, 14].map((lx) => (
              <path key={lx} className="spot-bug-legs" style={nth(lx / 14 + 1)} d={`M${lx} -16 l-4 -14 M${lx} 0 l-4 14`} />
            ))}
            <ellipse cx="0" cy="-8" rx="30" ry="22" fill={shell} />
            <path d="M-28 -8 H28" stroke={head} strokeWidth="2.5" opacity="0.6" />
            {variant % BUG_COLOURS.length !== 2 &&
              [
                [-12, -18],
                [10, -20],
                [-14, 2],
                [12, 0],
              ].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="5" fill={head} />)}
            <circle cx="30" cy="-8" r="13" fill={head} />
            <circle cx="35" cy="-12" r="4" fill="#fff" />
            <circle cx="36" cy="-12" r="2" fill="#2b2d42" />
            <path d="M38 -18 q8 -12 14 -8 M38 2 q8 8 14 4" stroke={head} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </>
  );
}

/** A friendly spider lets itself down on its thread from above, waves its legs and climbs back up. */
function Spider({ top }: { top: number }) {
  return (
    <g className="spot-spider-drop">
      <path d={`M0 ${-top - 320} V-20`} stroke="#adb5bd" strokeWidth="2.5" />
      <g className="spot-spider-legs">
        {[-1, 1].map((s) =>
          [0, 1, 2, 3].map((k) => (
            <path
              key={`${s}${k}`}
              d={`M${s * 14} ${-6 + k * 7} q${s * 24} ${-18 + k * 6} ${s * 34} ${-2 + k * 10}`}
              stroke="#3d405b"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          )),
        )}
      </g>
      <circle cy="6" r="24" fill="#5f4b8b" />
      <circle cx="-9" cy="2" r="7" fill="#fff" />
      <circle cx="9" cy="2" r="7" fill="#fff" />
      <circle cx="-8" cy="4" r="3.5" fill="#2b2d42" />
      <circle cx="10" cy="4" r="3.5" fill="#2b2d42" />
      <path d="M-8 15 q8 7 16 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A flower grows out of the meadow, a butterfly flutters off it, and the flower goes back into the ground. */
function Flower({ dir, variant }: { dir: 1 | -1; variant: number }) {
  const petal = FLOWER_COLOURS[variant % FLOWER_COLOURS.length];
  const wing = FLOWER_COLOURS[(variant + 2) % FLOWER_COLOURS.length];
  return (
    <>
      <g className="spot-flower-grow">
        <path d="M0 0 C-4 -30 4 -50 0 -80" stroke="#2d6a4f" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M0 -30 c-20 -14 -34 -4 -36 4 c14 4 28 4 36 -4 Z M2 -44 c18 -14 32 -6 34 2 c-14 4 -26 4 -34 -2 Z" fill="#52b788" />
        <g className="spot-flower-head">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-16" rx="11" ry="16" transform={`translate(0 -84) rotate(${a})`} fill={petal} stroke="#00000022" strokeWidth="1.5" />
          ))}
          <circle cy="-84" r="11" fill="#ffb703" />
        </g>
      </g>
      <g className="spot-flower-butterfly">
        <g transform={`translate(0 -96) scale(${dir} 1)`}>
          <g className="spot-flower-wings">
            <path d="M0 0 C-30 -34 -44 -4 -26 6 C-40 18 -20 30 0 4 C20 30 40 18 26 6 C44 -4 30 -34 0 0 Z" fill={wing} stroke="#3d405b" strokeWidth="2" />
          </g>
          <ellipse rx="4" ry="14" fill="#3d405b" />
        </g>
      </g>
    </>
  );
}

/** Something pops its head out of a little mound (a mole from the earth, a bunny from the snow) and ducks back in. */
function Peek({ id, ground, crumbs, Animal }: { id: number; ground: string; crumbs: string; Animal: () => ReactNode }) {
  const clip = `spot-peek-${id}`;
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <rect x="-120" y="-220" width="240" height="214" />
        </clipPath>
      </defs>
      <g className="spot-peek-mound">
        <ellipse cy="2" rx="80" ry="22" fill="#00000022" />
      </g>
      <g clipPath={`url(#${clip})`}>
        <g className="spot-peek-animal">
          <Animal />
        </g>
      </g>
      <g className="spot-peek-mound">
        <path d="M-80 4 C-60 -30 60 -30 80 4 Z" fill={ground} stroke="#00000018" strokeWidth="2" />
      </g>
      {[-1, 1, -0.5, 0.6].map((s, i) => (
        <circle key={i} className="spot-peek-crumb" style={{ ...nth(i), "--dx": `${s * 70}px` } as CSSProperties} cy="-10" r="7" fill={crumbs} />
      ))}
    </>
  );
}

function Mole() {
  return (
    <>
      <ellipse cy="-30" rx="40" ry="44" fill="#6c5b7b" />
      <ellipse cx="-34" cy="-14" rx="14" ry="9" fill="#f7a8b8" />
      <ellipse cx="34" cy="-14" rx="14" ry="9" fill="#f7a8b8" />
      <path d="M-18 -44 q6 -6 12 0 M6 -44 q6 -6 12 0" stroke="#2b2d42" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cy="-26" rx="10" ry="8" fill="#ff8fa3" />
      <path d="M-12 -14 q12 8 24 0" stroke="#2b2d42" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  );
}

function Bunny() {
  return (
    <>
      <ellipse cx="-16" cy="-86" rx="11" ry="34" fill="#fff" stroke="#dee2e6" strokeWidth="2" transform="rotate(-10 -16 -86)" />
      <ellipse cx="16" cy="-86" rx="11" ry="34" fill="#fff" stroke="#dee2e6" strokeWidth="2" transform="rotate(10 16 -86)" />
      <ellipse cx="-16" cy="-84" rx="5" ry="24" fill="#ffc9d6" transform="rotate(-10 -16 -84)" />
      <ellipse cx="16" cy="-84" rx="5" ry="24" fill="#ffc9d6" transform="rotate(10 16 -84)" />
      <ellipse cy="-28" rx="36" ry="34" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      <circle cx="-13" cy="-34" r="5" fill="#2b2d42" />
      <circle cx="13" cy="-34" r="5" fill="#2b2d42" />
      <ellipse cy="-22" rx="6" ry="4.5" fill="#ff8fa3" />
      <path d="M-8 -14 q8 6 16 0" stroke="#2b2d42" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  );
}

/** Rings spread on the water and a fish jumps out in an arc and dives back in. */
function Splash({ dir, variant }: { dir: 1 | -1; variant: number }) {
  const fish = ["#ff8c42", "#4dabf7", "#ffd60a"][variant % 3];
  return (
    <>
      {[0, 1].map((i) => (
        <ellipse key={i} className="spot-splash-ring" style={nth(i)} rx="60" ry="16" />
      ))}
      <g transform={`scale(${dir} 1)`}>
        <g className="spot-splash-fish">
          <path d="M-34 0 C-20 -22 22 -22 34 0 C22 22 -20 22 -34 0 Z M-30 0 L-54 -16 L-50 0 L-54 16 Z" fill={fish} />
          <circle cx="18" cy="-5" r="4" fill="#2b2d42" />
        </g>
      </g>
      {[-1, -0.4, 0.3, 1].map((s, i) => (
        <circle key={i} className="spot-splash-drop" style={{ ...nth(i), "--dx": `${s * 60}px` } as CSSProperties} r="7" fill="#a5d8ff" />
      ))}
    </>
  );
}

/** Bubbles rise and wobble up, and a little fish darts past. */
function Bubbles({ dir }: { dir: 1 | -1 }) {
  return (
    <>
      {[-30, 10, -10, 30, 0, -24].map((dx, i) => (
        <circle key={i} className="spot-bubble" style={{ ...nth(i), "--dx": `${dx}px` } as CSSProperties} r={8 + (i % 3) * 5} />
      ))}
      <g className="spot-bubbles-fish">
        <g transform={`scale(${dir} 1)`}>
          <path d="M-26 0 C-14 -16 16 -16 26 0 C16 16 -14 16 -26 0 Z M-22 0 L-40 -12 L-38 0 L-40 12 Z" fill="#ffd60a" />
          <circle cx="13" cy="-4" r="3.5" fill="#2b2d42" />
        </g>
      </g>
    </>
  );
}

/** A crab digs itself out of the sand and scuttles away sideways. */
function Crab({ dir }: { dir: 1 | -1 }) {
  return (
    <>
      {[-1, 0, 1].map((s, i) => (
        <ellipse
          key={i}
          className="spot-crab-sand"
          style={{ ...nth(i), "--dx": `${s * 50}px` } as CSSProperties}
          cx="0"
          cy="-6"
          rx="20"
          ry="12"
          fill="#e9c46a"
        />
      ))}
      <g className="spot-crab-walk">
        <g className="spot-crab-body">
          {[-1, 1].map((s) => (
            <g key={s}>
              <path
                d={`M${s * 30} -10 l${s * 18} 8 M${s * 32} -2 l${s * 16} 12 M${s * 28} 4 l${s * 12} 14`}
                stroke="#d9480f"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path d={`M${s * 24} -30 q${s * 16} -18 ${s * 24} -30`} stroke="#d9480f" strokeWidth="6" fill="none" strokeLinecap="round" />
              <path d={`M${s * 48} -70 a14 14 0 1 0 ${s * 2} 22 l${-s * 8} -8 Z`} fill="#f76707" />
              <path d={`M${s * 10} -30 V-48`} stroke="#d9480f" strokeWidth="4" />
              <circle cx={s * 10} cy="-50" r="7" fill="#fff" />
              <circle cx={s * 10 + dir * 2} cy="-50" r="3.5" fill="#2b2d42" />
            </g>
          ))}
          <ellipse cy="-14" rx="36" ry="22" fill="#f76707" />
          <path d="M-10 -8 q10 7 20 0" stroke="#2b2d42" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </>
  );
}
