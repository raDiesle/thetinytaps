import { memo, useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { PROD } from "@/lib/buildInfo";
import { pick, shuffle } from "@/lib/random";
import { playHoot, playQuack, playTweet } from "@/lib/realSounds";
import {
  playBlub,
  playBoing,
  playChimeNote,
  playCrack,
  playCrackle,
  playDing,
  playDrops,
  playFirework,
  playInflate,
  playMusicbox,
  playPlop,
  playPop,
  playRip,
  playSizzle,
  playSplash,
  playSwirl,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { EXTRA_SOUND_GAP_MS, spaced } from "@/lib/spacing";
import { useTimers } from "@/lib/timers";
import { ART_KINDS, type ArtKind, type ArtParams, ArtView, artParams, CanvasArt } from "./SurpriseArt";
import { CANVAS_KINDS, CANVAS_SECONDS, type CanvasKind, type CanvasParams, canvasParams } from "./surpriseCanvas";
import "./surprises.css";

// Frei tippen's surprises (user request, November 2026): every key that is no letter or number, and every tap beside
// the card, opens a surprise – a firework, a present, an egg hatching … – each time another kind, and each kind
// drawn anew every time (other colours, patterns, what comes out). Each is a few small HTML layers moved only by
// transform and opacity, or one small canvas drawn by its own loop (`surpriseCanvas.ts`), and goes again by itself.
// The kinds of `SurpriseArt.tsx` and the canvas are drawn by the app itself, never emojis (user request, November 2026).

/** The kinds of surprise; they take turns in a shuffled order, never the same twice in a row. */
export const SURPRISE_KINDS = ["firework", "gift", "egg", "balloons", "flowers", "bubbles", ...ART_KINDS, ...CANVAS_KINDS] as const;

/** One kind of surprise. */
export type SurpriseKind = (typeof SURPRISE_KINDS)[number];

/** How surprises are kept from piling up while a child hammers keys (`surprises.test.ts` keeps them few). */
export const SURPRISE = {
  /** A new surprise comes at most this often; presses between only ripple. */
  gapMs: 250,
  /** At most this many on screen at once. */
  maxAtOnce: 3,
  /** How long each kind stays, in ms – its CSS animations end within it. */
  lifeMs: {
    firework: 2400,
    gift: 2700,
    egg: 2900,
    balloons: 3200,
    flowers: 2900,
    bubbles: 2700,
    comet: 2400,
    snowflake: 2800,
    mandala: 2800,
    splash: 2700,
    pinwheel: 2700,
    balls: 3000,
    // A canvas kind stays a moment longer than its loop runs, so the loop always ends by itself first.
    skyrocket: CANVAS_SECONDS.skyrocket * 1000 + 200,
    fountain: CANVAS_SECONDS.fountain * 1000 + 200,
    swirl: CANVAS_SECONDS.swirl * 1000 + 200,
    sparkler: CANVAS_SECONDS.sparkler * 1000 + 200,
  } satisfies Record<SurpriseKind, number>,
};

const PALETTES = [
  ["#ff3d5a", "#ffc300", "#ff8c00"],
  ["#1e9bff", "#7b5cff", "#00c2ff"],
  ["#2fbf3a", "#ffc300", "#00a86b"],
  ["#ff4fb8", "#a24dff", "#ff3d5a"],
  ["#ffb000", "#ff7a00", "#ff3d5a"],
  ["#00b8a9", "#1e9bff", "#2fbf3a"],
  ["#ff8c00", "#ff3d5a", "#ffc300", "#1e9bff", "#2fbf3a"],
];
const BRIGHT = ["#ff5d73", "#ffb703", "#3ec300", "#00b4d8", "#8e7dff", "#ff7bd0", "#ff8c42", "#2ec4b6"];
const PASTEL = ["#ffd6e0", "#fff1b8", "#d4f5c9", "#cdeeff", "#e4dcff", "#ffe2c6", "#c8f7ef"];
const GIFT_THINGS = ["🧸", "⚽", "🚗", "🪀", "🎨", "🍭", "🐶", "🐱", "🚂", "🦄", "🪁", "🥁", "🍓", "🚀", "🐰", "🎺"];
const EGG_BABIES: { emoji: string; sound?: () => void }[] = [
  { emoji: "🐥", sound: playTweet },
  { emoji: "🦆", sound: playQuack },
  { emoji: "🦉", sound: playHoot },
  { emoji: "🦕" },
  { emoji: "🐢" },
  { emoji: "🐊" },
  { emoji: "🐧" },
  { emoji: "🦖" },
  { emoji: "🐉" },
  { emoji: "🦜", sound: playTweet },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type Spark = { x: number; y: number; color: string; delay: number };
type Burst = { x: number; y: number; delay: number; sparks: Spark[]; shape: "dot" | "star" | "diamond" | "sparkle"; fall: number; dur: number; flash: string };

type Params =
  | { kind: "firework"; rise: number; bursts: Burst[] }
  | { kind: "gift"; box: string; ribbon: string; dots: boolean; thing: string; lidX: number; lidTurn: number }
  | { kind: "egg"; shell: string; mark: string; pattern: "dots" | "zigzag" | "stripes" | "speckles"; baby: string; topX: number; topTurn: number }
  | { kind: "balloons"; balloons: { x: number; color: string; drift: number; turn: number; dur: number }[]; rise: number }
  | { kind: "flowers"; flowers: { x: number; height: number; petals: number; color: string; heart: string; pointy: boolean; delay: number }[] }
  | { kind: "bubbles"; bubbles: { x: number; y: number; size: number; dx: number; dy: number; dur: number; delay: number }[] }
  | ArtParams
  | CanvasParams;

const isArt = (kind: SurpriseKind): kind is ArtKind => (ART_KINDS as readonly string[]).includes(kind);
const isCanvas = (kind: SurpriseKind): kind is CanvasKind => (CANVAS_KINDS as readonly string[]).includes(kind);

/** One surprise on screen: where (px in the layer), how big, and how it was drawn this time. */
export type Surprise = { id: number; x: number; y: number; size: number } & Params;

/** Draws this time's look of `kind`: everything random is decided here, so drawing it again changes nothing. */
function makeParams(kind: SurpriseKind, size: number, y: number): Params {
  if (isArt(kind)) return artParams(kind);
  if (isCanvas(kind)) return canvasParams(kind);
  switch (kind) {
    case "firework": {
      const palette = pick(PALETTES);
      const pattern = pick(["ring", "peony", "double", "spiral", "willow", "triple", "heart", "star", "saturn"] as const);
      const shape = pick(["dot", "dot", "star", "diamond", "sparkle"] as const);
      const ring = (n: number, r: number, colors: string[], stagger = 0, jitter = 0): Spark[] =>
        Array.from({ length: n }, (_, i) => {
          const angle = (i / n) * Math.PI * 2 + rand(-jitter, jitter);
          const radius = r * size * (jitter ? rand(0.6, 1) : 1);
          return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, color: colors[i % colors.length], delay: i * stagger };
        });
      const burst = (sparks: Spark[], x = 0, y = 0, delay = 0, fall = 0.12, dur = 1.3): Burst => ({
        x: x * size,
        y: y * size,
        delay,
        sparks,
        shape,
        fall: fall * size,
        dur,
        flash: palette[0],
      });
      const n = Math.round(rand(14, 20));
      /** Sparks that land on the outline `at(u)` (u from 0 to 1, a radius of about 1), scaled by `r`. */
      const figure = (count: number, r: number, at: (u: number) => [number, number], colors: string[]): Spark[] =>
        Array.from({ length: count }, (_, i) => {
          const [fx, fy] = at(i / count);
          return { x: fx * r * size, y: fy * r * size, color: colors[i % colors.length], delay: 0 };
        });
      const heart = (u: number): [number, number] => {
        const a = u * Math.PI * 2;
        return [(16 * Math.sin(a) ** 3) / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17 - 0.1];
      };
      const star = (u: number): [number, number] => {
        const corner = (k: number): [number, number] => {
          const a = -Math.PI / 2 + (k * Math.PI) / 5;
          const r = k % 2 ? 0.45 : 1;
          return [Math.cos(a) * r, Math.sin(a) * r];
        };
        const k = u * 10;
        const [ax, ay] = corner(Math.floor(k));
        const [bx, by] = corner(Math.floor(k) + 1);
        const f = k - Math.floor(k);
        return [ax + (bx - ax) * f, ay + (by - ay) * f];
      };
      const tilt = rand(-0.5, 0.5);
      const saturn = (u: number): [number, number] => {
        const a = u * Math.PI * 2;
        const [ex, ey] = [Math.cos(a), Math.sin(a) * 0.28];
        return [ex * Math.cos(tilt) - ey * Math.sin(tilt), ex * Math.sin(tilt) + ey * Math.cos(tilt)];
      };
      const bursts =
        pattern === "ring"
          ? [burst(ring(n, 0.6, palette))]
          : pattern === "peony"
            ? [burst(ring(n + 4, 0.62, palette, 0, 0.25))]
            : pattern === "double"
              ? [burst([...ring(n, 0.6, [palette[0]]), ...ring(Math.round(n / 2), 0.3, [palette[1]])])]
              : pattern === "spiral"
                ? [burst(ring(n, 0.6, palette, 20))]
                : pattern === "willow"
                  ? [burst(ring(n, 0.5, ["#ffc300", "#ffb000", "#ff8c00"]), 0, 0, 0, 0.45, 1.6)]
                  : pattern === "triple"
                    ? [
                        burst(ring(10, 0.28, palette), -0.3, 0.05, 0),
                        burst(ring(10, 0.28, palette), 0.28, -0.12, 220),
                        burst(ring(10, 0.26, palette), 0, 0.22, 440),
                      ]
                    : pattern === "heart"
                      ? [burst(figure(26, 0.55, heart, ["#ff3d5a", "#ff4fb8"]), 0, 0, 0, 0.06)]
                      : pattern === "star"
                        ? [burst(figure(30, 0.6, star, palette), 0, 0, 0, 0.06)]
                        : [burst([...figure(24, 0.7, saturn, [palette[0]]), ...ring(10, 0.2, [palette[1]])], 0, 0, 0, 0.06)];
      return { kind, rise: size * 0.35, bursts };
    }
    case "gift":
      return {
        kind,
        box: pick(BRIGHT),
        ribbon: pick(["#ffd23f", "#ffffff", "#ff5d73", "#3ec1ff"]),
        dots: Math.random() < 0.5,
        thing: pick(GIFT_THINGS),
        lidX: rand(-0.5, 0.5),
        lidTurn: pick([-1, 1]) * rand(20, 45),
      };
    case "egg":
      return {
        kind,
        shell: pick(PASTEL),
        mark: pick(BRIGHT),
        pattern: pick(["dots", "zigzag", "stripes", "speckles"] as const),
        baby: "",
        topX: rand(-0.35, 0.35),
        topTurn: pick([-1, 1]) * rand(25, 50),
      };
    case "balloons": {
      const count = pick([1, 2, 3]);
      const colors = shuffle(BRIGHT);
      return {
        kind,
        rise: -Math.max(size * 0.3, Math.min(y - size * 0.35, size * 1.3)),
        balloons: Array.from({ length: count }, (_, i) => ({
          x: (i - (count - 1) / 2) * size * 0.32 + rand(-8, 8),
          color: colors[i],
          drift: rand(-0.25, 0.25) * size,
          turn: rand(-12, 12),
          dur: rand(2.6, 3.0),
        })),
      };
    }
    case "flowers": {
      const count = pick([1, 2, 3]);
      const colors = shuffle(BRIGHT);
      return {
        kind,
        flowers: Array.from({ length: count }, (_, i) => ({
          x: (i - (count - 1) / 2) * size * 0.38,
          height: rand(0.4, 0.65) * size,
          petals: Math.round(rand(5, 8)),
          color: colors[i],
          heart: pick(["#ffd23f", "#8a5a2b", "#fff3b0"]),
          pointy: Math.random() < 0.4,
          delay: i * 0.15,
        })),
      };
    }
    case "bubbles": {
      const count = Math.round(rand(5, 8));
      return {
        kind,
        bubbles: Array.from({ length: count }, () => ({
          x: rand(-0.25, 0.25) * size,
          y: rand(-0.15, 0.15) * size,
          size: rand(0.14, 0.3) * size,
          dx: rand(-0.75, 0.75) * size,
          dy: -rand(0.5, 1.1) * size,
          dur: rand(1.6, 2.3),
          delay: rand(0, 0.35),
        })),
      };
    }
  }
}

/** The surprises on screen, kept outside React so a new one redraws only `SurpriseLayer`, not the whole game. */
interface SurpriseStore {
  current: () => readonly Surprise[];
  subscribe: (listener: () => void) => () => void;
  add: (surprise: Surprise, lifeMs: number) => void;
  dispose: () => void;
}

const NONE: readonly Surprise[] = [];

function createSurpriseStore(): SurpriseStore {
  let list = NONE;
  const listeners = new Set<() => void>();
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const set = (next: readonly Surprise[]) => {
    list = next;
    for (const listener of listeners) listener();
  };
  return {
    current: () => list,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    add(surprise, lifeMs) {
      set([...list, surprise]);
      const timer = setTimeout(() => {
        timers.delete(timer);
        set(list.filter((s) => s !== surprise));
      }, lifeMs);
      timers.add(timer);
    },
    dispose() {
      timers.forEach(clearTimeout);
      timers.clear();
    },
  };
}

/**
 * Surprises for Frei tippen: `spawn(x, y, size)` opens the next one at (x, y) in the layer's pixels, with its sound,
 * unless one came less than `SURPRISE.gapMs` ago or `SURPRISE.maxAtOnce` are on screen (then it returns false and the
 * game only ripples). Draw them with `<SurpriseLayer surprises={…} />`.
 */
export function useSurprises() {
  const [store] = useState(createSurpriseStore);
  useEffect(() => () => store.dispose(), [store]);
  const { later } = useTimers();
  const gate = useMemo(() => spaced(SURPRISE.gapMs), []);
  const extras = useMemo(() => spaced(EXTRA_SOUND_GAP_MS), []);
  const bag = useRef<SurpriseKind[]>([]);
  const last = useRef<{ kind?: SurpriseKind; thing?: string; baby?: string }>({});
  const nextId = useRef(0);

  /** The next kind from a shuffled bag; a new bag never starts with the kind just shown. */
  const nextKind = useCallback(() => {
    if (bag.current.length === 0) {
      let next = shuffle(SURPRISE_KINDS);
      if (next[0] === last.current.kind) next = [...next.slice(1), next[0]];
      bag.current = next;
    }
    const kind = bag.current.shift() as SurpriseKind;
    last.current.kind = kind;
    return kind;
  }, []);

  const spawn = useCallback(
    (x: number, y: number, size: number) => {
      if (store.current().length >= SURPRISE.maxAtOnce || !gate.pass()) return false;
      const kind = nextKind();
      const params = makeParams(kind, size, y);
      const extra = extras.pass();
      let babySound: (() => void) | undefined;
      if (params.kind === "gift") {
        while (params.thing === last.current.thing) params.thing = pick(GIFT_THINGS);
        last.current.thing = params.thing;
      }
      if (params.kind === "egg") {
        let baby = pick(EGG_BABIES);
        while (baby.emoji === last.current.baby) baby = pick(EGG_BABIES);
        last.current.baby = params.baby = baby.emoji;
        babySound = baby.sound;
      }
      store.add({ id: nextId.current++, x, y, size, ...params }, SURPRISE.lifeMs[kind]);
      // Every surprise answers at once, its big moment has its own sound, and a second sound only as a spaced extra.
      switch (params.kind) {
        case "firework":
          playFirework(0.45, extra);
          break;
        case "gift":
          playPop();
          later(playRip, 880);
          if (extra) later(playTwinkle, 1000);
          break;
        case "egg":
          playPlop();
          later(playCrack, 1150);
          if (extra) later(babySound ?? playTwinkle, 1450);
          break;
        case "balloons":
          playInflate();
          later(playPop, Math.min(...params.balloons.map((b) => b.dur)) * 830);
          break;
        case "flowers":
          playPlop();
          later(playTwinkle, 600);
          break;
        case "bubbles":
          playBlub();
          if (extra) later(playPlop, 1500);
          break;
        case "comet":
          playWhoosh();
          later(playTwinkle, 880);
          break;
        case "snowflake":
          playChimeNote(4);
          later(() => playChimeNote(6), 1500);
          if (extra) later(playTwinkle, 1600);
          break;
        case "mandala":
          playMusicbox();
          if (extra) later(playDing, 700);
          break;
        case "splash":
          playSplash();
          if (extra) later(playDrops, 500);
          break;
        case "pinwheel":
          playWhirr();
          break;
        case "balls": {
          // The first ball lands at a third of its fall (`ft-ball` in surprises.css), the second bounce a while later.
          const first = 2.5 * 0.3 * 1000 + params.balls[0].delay * 1000;
          later(playBoing, first);
          if (extra) later(playBoing, first + 2.5 * 0.32 * 1000);
          break;
        }
        case "skyrocket":
          playFirework(0.55, extra && params.burst !== "glitter");
          if (extra && params.burst === "glitter") later(playCrackle, 700);
          break;
        case "fountain":
          playSizzle();
          if (extra) later(playCrackle, 400);
          break;
        case "swirl":
          playSwirl();
          if (extra) later(playTwinkle, 1500);
          break;
        case "sparkler":
          playSizzle();
          if (extra) later(playTwinkle, 1900);
          break;
      }
      return true;
    },
    [store, gate, extras, nextKind, later],
  );

  // For trying out one kind in the browser console: __surprise("comet"), then a key that opens a surprise.
  useEffect(() => {
    if (PROD) return;
    Object.assign(window, { __surprise: (kind: SurpriseKind) => (bag.current = [kind]) });
  }, []);

  return { surprises: store, spawn };
}

/** Draws the surprises over the game; it lets every tap through. */
export function SurpriseLayer({ surprises }: { surprises: SurpriseStore }) {
  const list = useSyncExternalStore(surprises.subscribe, surprises.current);
  return (
    <div className="ft-layer" aria-hidden="true">
      {list.map((s) => (
        <SurpriseView key={s.id} s={s} />
      ))}
    </div>
  );
}

/** CSS custom properties as a style. */
const vars = (v: Record<string, string | number>) => v as CSSProperties;

const SurpriseView = memo(function SurpriseView({ s }: { s: Surprise }) {
  return (
    // The kind is an attribute, never a class: a class „ft-<kind>“ is the animation of that kind's own drawing
    // (`.ft-snowflake`, `.ft-pinwheel`) and once moved the whole surprise with it (`surprises.test.ts`).
    <div className="ft-at" data-kind={s.kind} style={vars({ left: `${s.x}px`, top: `${s.y}px`, "--s": `${s.size}px` })}>
      {s.kind === "firework" && <Firework s={s} />}
      {s.kind === "gift" && <Gift s={s} />}
      {s.kind === "egg" && <Egg s={s} />}
      {s.kind === "balloons" && <Balloons s={s} />}
      {s.kind === "flowers" && <Flowers s={s} />}
      {s.kind === "bubbles" && <Bubbles s={s} />}
      {isArt(s.kind) && <ArtView s={s as ArtParams} size={s.size} />}
      {isCanvas(s.kind) && <CanvasArt s={s as CanvasParams} size={s.size} />}
    </div>
  );
});

function Firework({ s }: { s: Extract<Surprise, { kind: "firework" }> }) {
  return (
    <>
      <span className="ft-rocket" style={vars({ "--rise": `${s.rise}px` })} />
      {s.bursts.map((b, i) => (
        <div key={i} className="ft-burst" style={vars({ left: `${b.x}px`, top: `${b.y}px` })}>
          <span className="ft-flash" style={vars({ "--c": b.flash, "--delay": `${450 + b.delay}ms` })} />
          {b.sparks.map((p, j) => (
            <span
              key={j}
              className={`ft-spark ${b.shape}`}
              style={vars({
                "--x": `${p.x}px`,
                "--y": `${p.y}px`,
                "--c": p.color,
                "--fall": `${b.fall}px`,
                "--dur": `${b.dur}s`,
                "--delay": `${450 + b.delay + p.delay}ms`,
              })}
            />
          ))}
        </div>
      ))}
    </>
  );
}

function Gift({ s }: { s: Extract<Surprise, { kind: "gift" }> }) {
  const dark = "#0000002e";
  return (
    <div className="ft-gift-box">
      <span className="ft-gift-thing">{s.thing}</span>
      <div className="ft-gift-shake">
        <svg className="ft-gift-body" viewBox="0 0 100 60" role="presentation">
          <rect x="10" y="0" width="80" height="60" rx="4" fill={s.box} stroke="#5a3a2a" strokeWidth="2.5" />
          {s.dots &&
            [20, 34, 66, 80].flatMap((cx, i) => [14, 38].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy + (i % 2) * 10} r="4" fill="#ffffff88" />))}
          {!s.dots && [18, 30, 70, 82].map((x) => <rect key={x} x={x} y="0" width="5" height="60" fill="#ffffff55" />)}
          <rect x="44" y="0" width="12" height="60" fill={s.ribbon} stroke="#5a3a2a" strokeWidth="1.5" />
          <rect x="10" y="0" width="80" height="8" fill={dark} />
        </svg>
        <svg className="ft-gift-lid" viewBox="0 0 100 40" role="presentation" style={vars({ "--lx": `${s.lidX * s.size}px`, "--lr": `${s.lidTurn}deg` })}>
          <ellipse cx="38" cy="11" rx="13" ry="8" fill={s.ribbon} stroke="#5a3a2a" strokeWidth="2" transform="rotate(-20 38 11)" />
          <ellipse cx="62" cy="11" rx="13" ry="8" fill={s.ribbon} stroke="#5a3a2a" strokeWidth="2" transform="rotate(20 62 11)" />
          <rect x="4" y="18" width="92" height="20" rx="4" fill={s.box} stroke="#5a3a2a" strokeWidth="2.5" />
          <rect x="44" y="18" width="12" height="20" fill={s.ribbon} stroke="#5a3a2a" strokeWidth="1.5" />
          <circle cx="50" cy="16" r="5" fill={s.ribbon} stroke="#5a3a2a" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

const EGG_PATH = "M50 3 C76 3 95 48 95 76 C95 102 75 117 50 117 C25 117 5 102 5 76 C5 48 24 3 50 3 Z";
const CRACK = "100,60 88,69 76,58 64,69 52,58 40,69 28,58 16,69 0,60";

function EggPattern({ s }: { s: Extract<Surprise, { kind: "egg" }> }) {
  if (s.pattern === "dots")
    return [
      [30, 34],
      [62, 26],
      [24, 70],
      [50, 52],
      [76, 62],
      [38, 96],
      [68, 92],
    ].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="6" fill={s.mark} />);
  if (s.pattern === "zigzag")
    return (
      <>
        <polyline points="0,46 12,38 24,46 36,38 48,46 60,38 72,46 84,38 100,46" fill="none" stroke={s.mark} strokeWidth="6" />
        <polyline points="0,88 12,80 24,88 36,80 48,88 60,80 72,88 84,80 100,88" fill="none" stroke={s.mark} strokeWidth="6" />
      </>
    );
  if (s.pattern === "stripes") return [30, 52, 84].map((y) => <rect key={y} x="0" y={y} width="100" height="8" fill={s.mark} opacity="0.8" />);
  return [
    [28, 30],
    [44, 22],
    [66, 36],
    [20, 56],
    [56, 60],
    [80, 76],
    [34, 84],
    [60, 98],
    [44, 108],
  ].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill={s.mark} />);
}

function EggHalf({ s, top }: { s: Extract<Surprise, { kind: "egg" }>; top: boolean }) {
  const id = useId();
  const clip = top ? `0,0 100,0 ${CRACK}` : `${CRACK} 0,120 100,120`;
  return (
    <svg
      className={top ? "ft-egg-top" : "ft-egg-bottom"}
      viewBox="0 0 100 120"
      role="presentation"
      style={top ? vars({ "--tx": `${s.topX * s.size}px`, "--tr": `${s.topTurn}deg` }) : undefined}
    >
      <clipPath id={id}>
        <polygon points={clip} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <path d={EGG_PATH} fill={s.shell} />
        <clipPath id={`${id}e`}>
          <path d={EGG_PATH} />
        </clipPath>
        <g clipPath={`url(#${id}e)`}>
          <EggPattern s={s} />
        </g>
        <path d={EGG_PATH} fill="none" stroke="#5a3a2a" strokeWidth="2.5" />
        <polyline points={CRACK} fill="none" stroke="#5a3a2a" strokeWidth="2" />
      </g>
    </svg>
  );
}

function Egg({ s }: { s: Extract<Surprise, { kind: "egg" }> }) {
  return (
    <div className="ft-egg-box">
      <span className="ft-egg-baby">{s.baby}</span>
      <div className="ft-egg-shake">
        <EggHalf s={s} top={false} />
        <EggHalf s={s} top />
      </div>
    </div>
  );
}

function Balloons({ s }: { s: Extract<Surprise, { kind: "balloons" }> }) {
  return (
    <>
      {s.balloons.map((b, i) => (
        <svg
          key={i}
          className="ft-balloon"
          viewBox="0 0 60 110"
          role="presentation"
          style={vars({ "--bx": `${b.x}px`, "--drift": `${b.drift}px`, "--rise": `${s.rise}px`, "--turn": `${b.turn}deg`, "--dur": `${b.dur}s` })}
        >
          <path d="M30 62 C30 74 24 82 32 92 C38 100 28 104 30 110" fill="none" stroke="#5a3a2a" strokeWidth="1.5" />
          <ellipse cx="30" cy="32" rx="26" ry="30" fill={b.color} stroke="#5a3a2a" strokeWidth="2" />
          <path d="M25 66 L30 60 L35 66 Z" fill={b.color} stroke="#5a3a2a" strokeWidth="1.5" />
          <ellipse cx="20" cy="20" rx="6" ry="10" fill="#ffffff77" transform="rotate(25 20 20)" />
        </svg>
      ))}
    </>
  );
}

function Flowers({ s }: { s: Extract<Surprise, { kind: "flowers" }> }) {
  return (
    <>
      {s.flowers.map((f, i) => (
        <div key={i} className="ft-flower" style={vars({ left: `${f.x}px`, "--h": `${f.height}px`, "--delay": `${f.delay}s` })}>
          <svg className="ft-stem" viewBox="0 0 40 100" preserveAspectRatio="none" role="presentation">
            <rect x="17" y="0" width="6" height="100" rx="3" fill="#3e9b3a" />
            <path d="M20 62 C8 54 4 46 2 40 C12 42 18 50 20 62 Z" fill="#5cc254" />
            <path d="M20 78 C32 70 36 62 38 56 C28 58 22 66 20 78 Z" fill="#5cc254" />
          </svg>
          <svg className="ft-head" viewBox="-50 -50 100 100" role="presentation">
            {Array.from({ length: f.petals }, (_, p) =>
              f.pointy ? (
                <path
                  key={p}
                  d="M0 -6 C10 -18 8 -36 0 -46 C-8 -36 -10 -18 0 -6 Z"
                  fill={f.color}
                  stroke="#5a3a2a"
                  strokeWidth="1.5"
                  transform={`rotate(${(p * 360) / f.petals})`}
                />
              ) : (
                <ellipse
                  key={p}
                  cx="0"
                  cy="-26"
                  rx="13"
                  ry="20"
                  fill={f.color}
                  stroke="#5a3a2a"
                  strokeWidth="1.5"
                  transform={`rotate(${(p * 360) / f.petals})`}
                />
              ),
            )}
            <circle r="13" fill={f.heart} stroke="#5a3a2a" strokeWidth="1.5" />
          </svg>
        </div>
      ))}
    </>
  );
}

function Bubbles({ s }: { s: Extract<Surprise, { kind: "bubbles" }> }) {
  return (
    <>
      {s.bubbles.map((b, i) => (
        <span
          key={i}
          className="ft-bubble"
          style={vars({
            left: `${b.x - b.size / 2}px`,
            top: `${b.y - b.size / 2}px`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            "--bx": `${b.dx}px`,
            "--by": `${b.dy}px`,
            "--dur": `${b.dur}s`,
            "--delay": `${b.delay}s`,
          })}
        />
      ))}
    </>
  );
}
