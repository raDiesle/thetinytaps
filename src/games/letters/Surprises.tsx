import { memo, useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { PROD } from "@/lib/buildInfo";
import { pick, shuffle } from "@/lib/random";
import { playCroak, playGiggle, playHoot, playQuack, playTweet } from "@/lib/realSounds";
import {
  playBlub,
  playBoing,
  playChimeNote,
  playClick,
  playCrack,
  playCrackle,
  playDing,
  playDrops,
  playFirework,
  playHeartbeat,
  playHop,
  playInflate,
  playMusicbox,
  playPlop,
  playPop,
  playPuff,
  playRip,
  playSizzle,
  playSplash,
  playSwirl,
  playTrill,
  playTwinkle,
  playWhirr,
  playWhoosh,
} from "@/lib/sfx";
import { EXTRA_SOUND_GAP_MS, spaced } from "@/lib/spacing";
import { useTimers } from "@/lib/timers";
import { ART_KINDS, type ArtKind, type ArtParams, ArtView, artParams, CanvasArt } from "./SurpriseArt";
import { BabyDrawing, EGG_BABIES, type EggBaby, GIFT_TOYS, type GiftToy, ToyDrawing } from "./SurpriseFigures";
import { CANVAS_KINDS, CANVAS_SECONDS, type CanvasKind, type CanvasParams, canvasParams } from "./surpriseCanvas";
import { TOY_KINDS, type ToyKind, type ToyParams, ToyView, toyParams } from "./SurpriseToys";
import "./surprises.css";

// Frei tippen's surprises (user request, November 2026): every key that is no letter or number, and every tap beside
// the card, opens a surprise – a firework, a present, an egg hatching … – each time another kind, and each kind
// drawn anew every time (other colours, patterns, what comes out). Each is a few small HTML layers moved only by
// transform and opacity, or one small canvas drawn by its own loop (`surpriseCanvas.ts`), and goes again by itself.
// Every surprise is drawn by the app itself, never with emojis – the present's toy and the egg's baby too
// (`SurpriseFigures.tsx`; user request, November 2026).

/** The kinds of surprise; they take turns in a shuffled order, never the same twice in a row. */
export const SURPRISE_KINDS = ["firework", "gift", "egg", "balloon", "flower", "bubbles", ...ART_KINDS, ...TOY_KINDS, ...CANVAS_KINDS] as const;

/** One kind of surprise. */
export type SurpriseKind = (typeof SURPRISE_KINDS)[number];

/** The kinds that are fireworks: „Tippzauber“ brings them more often (`TAP_AWAY_SURPRISES.bag`). */
export const FIREWORK_KINDS = ["firework", "skyrocket", "starburst", "wheel", "fountain", "sparkler", "swirl"] as const satisfies readonly SurpriseKind[];

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
    balloon: 2900,
    flower: 2900,
    bubbles: 2800,
    comet: 2400,
    snowflake: 2800,
    mandala: 2800,
    splash: 2700,
    pinwheel: 2700,
    ball: 3000,
    butterfly: 2900,
    jack: 2900,
    heart: 2500,
    cloud: 2900,
    frog: 2800,
    fish: 2700,
    // A canvas kind stays a moment longer than its loop runs, so the loop always ends by itself first.
    skyrocket: CANVAS_SECONDS.skyrocket * 1000 + 200,
    fountain: CANVAS_SECONDS.fountain * 1000 + 200,
    swirl: CANVAS_SECONDS.swirl * 1000 + 200,
    sparkler: CANVAS_SECONDS.sparkler * 1000 + 200,
    wheel: CANVAS_SECONDS.wheel * 1000 + 200,
    starburst: CANVAS_SECONDS.starburst * 1000 + 200,
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
/** The sound a baby animal makes as it looks out of its egg, where it has one. */
const BABY_SOUNDS: Partial<Record<EggBaby, () => void>> = { chick: playTweet, duckling: playQuack, owlet: playHoot, parrot: playTweet };

const rand = (min: number, max: number) => min + Math.random() * (max - min);

type Spark = { x: number; y: number; color: string; delay: number };
type Burst = { x: number; y: number; delay: number; sparks: Spark[]; shape: "dot" | "star" | "diamond" | "sparkle"; fall: number; dur: number; flash: string };

type Params =
  | { kind: "firework"; rise: number; bursts: Burst[] }
  | { kind: "gift"; box: string; ribbon: string; dots: boolean; thing: GiftToy; tint: string; lidX: number; lidTurn: number }
  | { kind: "egg"; shell: string; mark: string; pattern: "dots" | "zigzag" | "stripes" | "speckles"; baby: EggBaby; topX: number; topTurn: number }
  | { kind: "balloon"; color: string; turn: number }
  | { kind: "flower"; height: number; petals: number; color: string; heart: string; pointy: boolean }
  | { kind: "bubbles"; bubbles: { x: number; y: number; size: number; dx: number; dy: number; dur: number; delay: number }[] }
  | ArtParams
  | ToyParams
  | CanvasParams;

const isArt = (kind: SurpriseKind): kind is ArtKind => (ART_KINDS as readonly string[]).includes(kind);
const isCanvas = (kind: SurpriseKind): kind is CanvasKind => (CANVAS_KINDS as readonly string[]).includes(kind);
const isToy = (kind: SurpriseKind): kind is ToyKind => (TOY_KINDS as readonly string[]).includes(kind);

/** One surprise on screen: where (px in the layer), how big, and how it was drawn this time. */
export type Surprise = { id: number; x: number; y: number; size: number } & Params;

/**
 * Draws this time's look of `kind`: everything random is decided here, so drawing it again changes nothing. Each is
 * one thing right at its spot – one balloon, one flower, one ball – and what comes in many (bubbles, sparks) gathers
 * round the spot instead of drifting off (user feedback, 25 November 2026; `surprises.test.ts`).
 */
export function surpriseParams(kind: SurpriseKind, size: number): Params {
  if (isArt(kind)) return artParams(kind);
  if (isToy(kind)) return toyParams(kind);
  if (isCanvas(kind)) return canvasParams(kind);
  switch (kind) {
    case "firework": {
      const palette = pick(PALETTES);
      const pattern = pick(["ring", "peony", "double", "spiral", "willow", "nested", "heart", "star", "saturn"] as const);
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
                  : pattern === "nested"
                    ? // Three rings one after the other round the same spot, small to big – never bursts side by side.
                      [
                        burst(ring(8, 0.22, [palette[0]]), 0, 0, 0),
                        burst(ring(12, 0.42, [palette[1]]), 0, 0, 220),
                        burst(ring(16, 0.62, [palette[2] ?? palette[0]]), 0, 0, 440),
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
        thing: pick(GIFT_TOYS),
        tint: pick(BRIGHT),
        lidX: rand(-0.5, 0.5),
        lidTurn: pick([-1, 1]) * rand(20, 45),
      };
    case "egg":
      return {
        kind,
        shell: pick(PASTEL),
        mark: pick(BRIGHT),
        pattern: pick(["dots", "zigzag", "stripes", "speckles"] as const),
        baby: pick(EGG_BABIES),
        topX: rand(-0.35, 0.35),
        topTurn: pick([-1, 1]) * rand(25, 50),
      };
    case "balloon":
      return { kind, color: pick(BRIGHT), turn: pick([-1, 1]) * rand(4, 10) };
    case "flower":
      return {
        kind,
        height: rand(0.42, 0.55) * size,
        petals: Math.round(rand(5, 8)),
        color: pick(BRIGHT),
        heart: pick(["#ffd23f", "#8a5a2b", "#fff3b0"]),
        pointy: Math.random() < 0.4,
      };
    case "bubbles": {
      // A cluster round the spot: each bubble comes out where the finger landed, drifts only a little and pops there.
      const count = Math.round(rand(5, 8));
      const start = rand(0, Math.PI * 2);
      return {
        kind,
        bubbles: Array.from({ length: count }, (_, i) => {
          const a = start + (i / count) * Math.PI * 2 + rand(-0.3, 0.3);
          const r = i === 0 ? 0 : rand(0.14, 0.32) * size;
          return {
            x: Math.cos(a) * r,
            y: Math.sin(a) * r,
            size: (i === 0 ? rand(0.26, 0.32) : rand(0.12, 0.22)) * size,
            dx: Math.cos(a) * rand(0.02, 0.06) * size,
            dy: Math.sin(a) * rand(0.02, 0.06) * size,
            dur: rand(1.7, 2.3),
            delay: i * 0.06,
          };
        }),
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

/** How often and how many surprises may come: Frei tippen's `SURPRISE` by default. */
export interface SurpriseLimits {
  gapMs: number;
  maxAtOnce: number;
  /** What one shuffled bag holds, a kind listed twice coming twice as often: every kind once by default. */
  bag?: readonly SurpriseKind[];
}

/**
 * A shuffled bag of `kinds` with no kind twice in a row, nor first when it was just shown (`last`): shuffled again
 * until it fits, which a bag with a few kinds twice or three times does within a few tries.
 */
export function shuffledBag(kinds: readonly SurpriseKind[], last?: SurpriseKind): SurpriseKind[] {
  const fits = (bag: readonly SurpriseKind[]) => bag[0] !== last && bag.every((k, i) => i === 0 || k !== bag[i - 1]);
  let bag = shuffle(kinds);
  for (let i = 0; i < 200 && !fits(bag); i++) bag = shuffle(kinds);
  return bag;
}

/**
 * Surprises for Frei tippen: `spawn(x, y, size)` opens the next one at (x, y) in the layer's pixels, with its sound,
 * unless one came less than `limits.gapMs` ago or `limits.maxAtOnce` are on screen (then it returns false and the
 * game only ripples). Draw them with `<SurpriseLayer surprises={…} />`. Only „Tap Magic“, where the show is the
 * whole game, passes looser limits of its own (`src/games/tapaway/CLAUDE.md`).
 */
export function useSurprises(limits: SurpriseLimits = SURPRISE) {
  const [store] = useState(createSurpriseStore);
  useEffect(() => () => store.dispose(), [store]);
  const { later } = useTimers();
  const { gapMs, maxAtOnce, bag: kinds = SURPRISE_KINDS } = limits;
  const gate = useMemo(() => spaced(gapMs), [gapMs]);
  const extras = useMemo(() => spaced(EXTRA_SOUND_GAP_MS), []);
  const bag = useRef<SurpriseKind[]>([]);
  const last = useRef<{ kind?: SurpriseKind; thing?: GiftToy; baby?: EggBaby }>({});
  const nextId = useRef(0);

  /** The next kind from a shuffled bag; a new bag never starts with the kind just shown. */
  const nextKind = useCallback(() => {
    if (bag.current.length === 0) bag.current = shuffledBag(kinds, last.current.kind);
    const kind = bag.current.shift() as SurpriseKind;
    last.current.kind = kind;
    return kind;
  }, [kinds]);

  const spawn = useCallback(
    (x: number, y: number, size: number) => {
      if (store.current().length >= maxAtOnce || !gate.pass()) return false;
      const kind = nextKind();
      const params = surpriseParams(kind, size);
      const extra = extras.pass();
      let babySound: (() => void) | undefined;
      if (params.kind === "gift") {
        while (params.thing === last.current.thing) params.thing = pick(GIFT_TOYS);
        last.current.thing = params.thing;
      }
      if (params.kind === "egg") {
        while (params.baby === last.current.baby) params.baby = pick(EGG_BABIES);
        last.current.baby = params.baby;
        babySound = BABY_SOUNDS[params.baby];
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
        case "balloon":
          // It pops at 80 % of `ft-balloon` (surprises.css).
          playInflate();
          later(playPop, BALLOON_POP_MS);
          break;
        case "flower":
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
        case "ball": {
          // The ball lands at a third of its fall (`ft-ball` in surprises.css), the second bounce a while later.
          const first = 2.5 * 0.3 * 1000;
          later(playBoing, first);
          if (extra) later(playBoing, first + 2.5 * 0.32 * 1000);
          break;
        }
        case "butterfly":
          playTrill();
          if (extra) later(playTwinkle, 1200);
          break;
        case "jack":
          playClick();
          later(playBoing, 500);
          if (extra) later(playGiggle, 900);
          break;
        case "heart":
          // Its two „bumbum“ come as the heart swells (`ft-heart`, from 0.4 s).
          playPlop();
          later(playHeartbeat, 400);
          break;
        case "cloud":
          playPuff();
          later(playDrops, 700);
          break;
        case "frog":
          // It jumps at 28 % of `ft-frog` (2.7 s), lands at 55 % and croaks as its throat puffs up (58 %).
          playPlop();
          later(() => playHop(0.73), 750);
          later(playCroak, 1570);
          break;
        case "fish":
          // It leaps out at 15 % of `ft-fish-arc` (2.7 s) and dives back in at 56 %.
          playSplash();
          later(playPlop, 1510);
          break;
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
        case "wheel":
          playWhirr();
          later(playSizzle, 200);
          break;
        case "starburst":
          // Its bang comes at once, right where it was opened; the crackle as its stars go out.
          playFirework(0.05, false);
          if (extra) later(playCrackle, 1000);
          break;
      }
      return true;
    },
    [store, gate, maxAtOnce, extras, nextKind, later],
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
      {s.kind === "balloon" && <Balloon s={s} />}
      {s.kind === "flower" && <Flower s={s} />}
      {s.kind === "bubbles" && <Bubbles s={s} />}
      {isArt(s.kind) && <ArtView s={s as ArtParams} size={s.size} />}
      {isToy(s.kind) && <ToyView s={s as ToyParams} />}
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
      <span className="ft-gift-thing">
        <ToyDrawing toy={s.thing} tint={s.tint} />
      </span>
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
      <span className="ft-egg-baby">
        <BabyDrawing baby={s.baby} />
      </span>
      <div className="ft-egg-shake">
        <EggHalf s={s} top={false} />
        <EggHalf s={s} top />
      </div>
    </div>
  );
}

/** When the balloon pops, in ms: 80 % of its 2.8 s (`ft-balloon` in surprises.css). */
const BALLOON_POP_MS = 2240;

function Balloon({ s }: { s: Extract<Surprise, { kind: "balloon" }> }) {
  return (
    <>
      <svg className="ft-balloon" viewBox="0 0 60 110" role="presentation" style={vars({ "--turn": `${s.turn}deg` })}>
        <path d="M30 62 C30 74 24 82 32 92 C38 100 28 104 30 110" fill="none" stroke="#5a3a2a" strokeWidth="1.5" />
        <ellipse cx="30" cy="32" rx="26" ry="30" fill={s.color} stroke="#5a3a2a" strokeWidth="2" />
        <path d="M25 66 L30 60 L35 66 Z" fill={s.color} stroke="#5a3a2a" strokeWidth="1.5" />
        <ellipse cx="20" cy="20" rx="6" ry="10" fill="#ffffff77" transform="rotate(25 20 20)" />
      </svg>
      {/* As it pops, a few scraps of it fly off round the spot. */}
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <span
            key={i}
            className="ft-balloon-bit"
            style={vars({ "--c": s.color, "--x": `${Math.cos(a) * s.size * 0.28}px`, "--y": `${Math.sin(a) * s.size * 0.28 - s.size * 0.12}px` })}
          />
        );
      })}
    </>
  );
}

function Flower({ s }: { s: Extract<Surprise, { kind: "flower" }> }) {
  return (
    <div className="ft-flower" style={vars({ "--h": `${s.height}px` })}>
      <svg className="ft-stem" viewBox="0 0 40 100" preserveAspectRatio="none" role="presentation">
        <rect x="17" y="0" width="6" height="100" rx="3" fill="#3e9b3a" />
        <path d="M20 62 C8 54 4 46 2 40 C12 42 18 50 20 62 Z" fill="#5cc254" />
        <path d="M20 78 C32 70 36 62 38 56 C28 58 22 66 20 78 Z" fill="#5cc254" />
      </svg>
      <svg className="ft-head" viewBox="-50 -50 100 100" role="presentation">
        {Array.from({ length: s.petals }, (_, p) =>
          s.pointy ? (
            <path
              key={p}
              d="M0 -6 C10 -18 8 -36 0 -46 C-8 -36 -10 -18 0 -6 Z"
              fill={s.color}
              stroke="#5a3a2a"
              strokeWidth="1.5"
              transform={`rotate(${(p * 360) / s.petals})`}
            />
          ) : (
            <ellipse key={p} cx="0" cy="-26" rx="13" ry="20" fill={s.color} stroke="#5a3a2a" strokeWidth="1.5" transform={`rotate(${(p * 360) / s.petals})`} />
          ),
        )}
        <circle r="13" fill={s.heart} stroke="#5a3a2a" strokeWidth="1.5" />
      </svg>
    </div>
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
