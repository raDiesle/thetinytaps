import { type CSSProperties, type PointerEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { keyOf, toUpper, useLanguagePack } from "@/content/languages";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { pick } from "@/lib/random";
import { playBlub, playBoing, playChimeNote, playPlop, playPop } from "@/lib/sfx";
import { repeatPause, spaced } from "@/lib/spacing";
import { useTimers } from "@/lib/timers";
import { talking } from "@/lib/voice";
import { SAME_KEY_PAUSE_MS } from "@/games/letters/pace";
import { useSoftTap } from "@/games/letters/softTap";
import { FIREWORK_KINDS, SURPRISE_KINDS, SurpriseLayer, type SurpriseLimits, useSurprises } from "@/games/letters/Surprises";
import { lettersVoice } from "@/games/letters/voice";
import { freeSpot, type Placed } from "./place";
import { SHAPES, type ShapeKind, ShapeView } from "./shapes";
import "./tapaway.css";

// „Tap Magic“: a toy for banging on the keyboard, the mouse or the screen – no card, nothing to learn or find, only
// cause and effect (user request, 24 November 2026, in the spirit of the keyboard smash toys parents search for). A
// letter key brings that letter big and bright somewhere on the page with its note and, where recorded, its name; a
// digit brings its number with as many little shapes round it; every other key and every tap or click opens one of
// Frei tippen's surprises right there, and where none may come yet a bright shape pops up instead. A mouse moving
// leaves a short trail of sparkles. Quick presses one after the other show several things at once, each beside the
// others while there is room (`freeSpot`) – the one game where that is wanted (user request, 24 November 2026) – and
// still within limits, so what can't come only ripples (see CLAUDE.md).

/**
 * A glyph's (letter's or digit's) size: this share of the play area's shorter side, within these limits in px. Smaller
 * than Frei tippen's card, so several stand light on the page instead of chunky (user feedback, 25 November 2026).
 */
export const GLYPH_SHARE = 0.22;
const GLYPH_MIN = 72;
const GLYPH_MAX = 200;
/** A shape's size, the same way. */
export const SHAPE_SHARE = 0.14;
const SHAPE_MIN = 44;
const SHAPE_MAX = 130;
/** A surprise's size, smaller than in Frei tippen for the same reason. */
export const SURPRISE_SHARE = 0.3;
const SURPRISE_MIN = 100;
const SURPRISE_MAX = 260;

/** A digit's number beside its shapes is this much smaller than a letter, so both fit where a letter would. */
const COUNTED_SHARE = 0.72;
/** A digit's shapes: each this share of the number's size, on a ring this far from its middle. */
const THING_SHARE = 0.26;
const RING_SHARE = 0.78;

/** The shapes a digit counts: chunky ones, easy to tell apart and count (a thin moon was hard to see). */
const COUNT_SHAPES = SHAPES.filter((s) => s !== "moon");

/** How long a glyph or shape stays, in ms; `tw-pop` in tapaway.css runs exactly this long. */
export const POP_MS = 2200;
/** At most this many glyphs and shapes on the page at once; more presses only ripple. */
export const MAX_POPS = 8;
/**
 * A new glyph or shape comes at most this often: quick enough that a hand running over the keys sees several at once
 * (user request, 24 November 2026), slower than a held-down hand's flood.
 */
export const POP_GAP_MS = 90;
/**
 * Surprises here come quicker and more at once than in Frei tippen, where they answer beside a card, and fireworks
 * three times as often as the other kinds – over half of all surprises (user request, 25 November 2026: more fireworks).
 */
export const TAP_AWAY_SURPRISES: SurpriseLimits = { gapMs: 150, maxAtOnce: 5, bag: [...SURPRISE_KINDS, ...FIREWORK_KINDS, ...FIREWORK_KINDS] };
/** The little burst of sparks every glyph and shape comes with: this many sparks, flying this many of its sizes. */
export const POP_SPARKS = 12;
const SPARK_REACH: [number, number] = [0.55, 0.85];
/** A mouse's sparkles: one at most this often while it moves, each living `SPARKLE_MS`, at most `MAX_SPARKLES` at once. */
export const SPARKLE_GAP_MS = 60;
export const SPARKLE_MS = 700;
export const MAX_SPARKLES = 12;
/**
 * Presses that only ripple share one ripple when they land this close together (a palm on the keys, several fingers on
 * the screen): every ripple is two rings, each a layer of its own, and both hands smashing kept about 18 rings on the
 * page, which alone took a fifth of an old phone's main thread (`bun run perf zaubertasten`, „Mit beiden Händen“,
 * November 2026). A child's single taps, a few a second, still each get theirs.
 */
export const RIPPLE_GAP_MS = 150;
/** Room kept free at the top for ✕, the fullscreen note and ⚙️, in px. */
const TOP_CLEAR = 72;

/** Bright colours for glyphs and shapes, each readable with a white outline on the light page. */
export const POP_COLORS = ["#ff4f6d", "#ff9f1c", "#2ec4b6", "#3a86ff", "#8338ec", "#ff5fb8", "#3ec300", "#ffbe0b"];

/** One spark of a glyph's or shape's burst: its direction in degrees, how far it flies in px, its colour. */
type PopSpark = { angle: number; distance: number; color: string };

/** One glyph or shape on the page; `reach` is how far it and its shapes reach round its middle. */
type Pop = { id: number; x: number; y: number; size: number; reach: number; color: string; turn: number; sparks: PopSpark[] } & (
  | { kind: "glyph"; text: string; count?: { n: number; shape: ShapeKind; color: string } }
  | { kind: "shape"; shape: ShapeKind }
);

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** The game: the whole page is the toy. */
export function TapAwayPlay() {
  const pack = useLanguagePack();
  const { id: language } = useAppLanguage();
  const t = useT();
  const { touchOnly } = useDevice();
  const { effects, ripple } = useTapFeedback();
  const ripples = useMemo(() => spaced(RIPPLE_GAP_MS), []);
  const calmRipple = useCallback((x?: number, y?: number) => ripples.pass() && ripple(x, y), [ripples, ripple]);
  const softTap = useSoftTap(calmRipple);
  const { surprises, spawn } = useSurprises(TAP_AWAY_SURPRISES);
  const { later } = useTimers();
  const root = useRef<HTMLDivElement>(null);
  const sparkles = useRef<HTMLDivElement>(null);
  const [pops, setPops] = useState<Pop[]>([]);
  /** What stands on the page now, to place the next one beside it. */
  const shown = useRef<Pop[]>([]);
  const [started, setStarted] = useState(false);
  const live = useRef(0);
  const nextId = useRef(0);
  const lastPop = useRef(0);
  const lastColor = useRef("");
  const repeats = useMemo(() => repeatPause(SAME_KEY_PAUSE_MS), []);

  // The letters' names come from Buchstaben & Zahlen's recordings: a few dozen lines, fetched once as play starts.
  const names = useMemo(() => new Map(pack.letters.map((letter, i) => [letter.upper, { line: `${letter.spoken}!`, index: i }])), [pack]);
  useEffect(
    () =>
      lettersVoice.load(
        [...names.values()].map((n) => n.line),
        language,
      ),
    [names, language],
  );

  /** The play area's size and where it lies, or nothing before it is drawn. */
  const area = () => root.current?.getBoundingClientRect();

  /** A size for this share of the area's shorter side. */
  const sized = (box: DOMRect, share: number, min: number, max: number) => Math.max(min, Math.min(max, Math.min(box.width, box.height) * share));

  /**
   * A place for something reaching `reach` round its middle, inside the area and clear of the top corners' notes, in px
   * in the area: where the finger landed (`at`, client px), else beside what is already there while there is room.
   */
  const spot = (box: DOMRect, reach: number, at?: { x: number; y: number }) => {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(Math.max(min, max), v));
    if (!at) {
      const taken: Placed[] = [...shown.current, ...surprises.current().map((s) => ({ x: s.x, y: s.y, reach: s.size * 0.45 }))];
      return freeSpot({ width: box.width, height: box.height, top: TOP_CLEAR }, reach, taken);
    }
    return { x: clamp(at.x - box.left, reach, box.width - reach), y: clamp(at.y - box.top, TOP_CLEAR + reach * 0.9, box.height - reach) };
  };

  /** Puts a glyph or shape on the page for `POP_MS`, bursting out with sparks; false when too soon or too many. */
  const pop = useCallback(
    (make: (box: DOMRect, color: string) => Omit<Pop, "id" | "color" | "turn" | "sparks">) => {
      const box = area();
      const now = performance.now();
      if (!box || live.current >= MAX_POPS || now - lastPop.current < POP_GAP_MS) return false;
      lastPop.current = now;
      let color = pick(POP_COLORS);
      while (color === lastColor.current) color = pick(POP_COLORS);
      lastColor.current = color;
      const made = make(box, color);
      // The burst: sparks evenly round it, each a little off its place, in its colour, gold and white.
      const start = rand(0, 360);
      const sparks = Array.from({ length: POP_SPARKS }, (_, i) => ({
        angle: start + (i * 360) / POP_SPARKS + rand(-8, 8),
        distance: made.reach * rand(...SPARK_REACH) + made.size * 0.25,
        color: i % 3 === 0 ? color : i % 3 === 1 ? "#ffc300" : "#fff3b0",
      }));
      const item = { ...made, id: nextId.current++, color, turn: rand(-12, 12), sparks } as Pop;
      live.current++;
      shown.current = [...shown.current, item];
      setPops((list) => [...list, item]);
      later(() => {
        live.current--;
        shown.current = shown.current.filter((p) => p.id !== item.id);
        setPops((list) => list.filter((p) => p.id !== item.id));
      }, POP_MS);
      return true;
    },
    [later],
  );

  /** A bright shape where the finger landed (`at`, client px) or somewhere on the page, with a sound of its own. */
  const popShape = useCallback(
    (at?: { x: number; y: number }) => {
      const shape = pick(SHAPES);
      const done = pop((box) => {
        const size = sized(box, SHAPE_SHARE, SHAPE_MIN, SHAPE_MAX);
        return { kind: "shape", shape, size, reach: size / 2, ...spot(box, size / 2, at) };
      });
      if (done) pick([playPop, playPlop, playBoing, playBlub])();
      return done;
    },
    [pop],
  );

  /** One of Frei tippen's surprises there, else a shape, else only ripples. */
  const surprise = useCallback(
    (at?: { x: number; y: number }) => {
      const box = area();
      if (box) {
        const size = sized(box, SURPRISE_SHARE, SURPRISE_MIN, SURPRISE_MAX);
        const { x, y } = spot(box, size / 2, at);
        if (spawn(x, y, size)) return;
      }
      if (!popShape(at)) softTap(at?.x, at?.y);
    },
    [spawn, popShape, softTap],
  );

  /** A key: its letter or digit big on the page, any other key a surprise. */
  const pressKey = useCallback(
    (key: string) => {
      setStarted(true);
      const upper = toUpper(key, pack);
      const name = names.get(upper);
      const digit = /^[0-9]$/.test(key) ? Number(key) : undefined;
      if (!name && digit === undefined) return surprise();
      // The same key again is shown and sounded only after its pause: meanwhile it ripples, silently.
      if (!repeats.pass(upper)) return softTap(undefined, undefined, true);
      const done = pop((box, color) => {
        const full = sized(box, GLYPH_SHARE, GLYPH_MIN, GLYPH_MAX);
        if (!digit) return { kind: "glyph", text: digit === undefined ? upper : key, size: full, reach: full / 2, ...spot(box, full / 2) };
        // A digit: its number with as many shapes of one kind round it, in another colour, popping in one by one.
        const size = full * COUNTED_SHARE;
        const reach = size * (RING_SHARE + THING_SHARE / 2);
        let thingColor = pick(POP_COLORS);
        while (thingColor === color) thingColor = pick(POP_COLORS);
        return { kind: "glyph", text: key, size, reach, count: { n: digit, shape: pick(COUNT_SHAPES), color: thingColor }, ...spot(box, reach) };
      });
      if (!done) return softTap();
      playChimeNote(name?.index ?? digit ?? 0);
      // Its name only while nothing else is said, so quick presses never talk over each other.
      if (name && !talking()) lettersVoice.say(name.line, language);
    },
    [pack, names, repeats, pop, surprise, softTap, language],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (!e.repeat) pressKey(keyOf(e, pack));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pressKey, pack]);

  const onPointerDown = (e: PointerEvent) => {
    setStarted(true);
    surprise({ x: e.clientX, y: e.clientY });
  };

  // A mouse moving leaves a short trail of sparkles: tiny layers made here, never by React, each fading by itself.
  const lastSparkle = useRef(0);
  const onPointerMove = (e: PointerEvent) => {
    const layer = sparkles.current;
    const box = area();
    if (e.pointerType !== "mouse" || !layer || !box) return;
    const now = performance.now();
    if (now - lastSparkle.current < SPARKLE_GAP_MS || layer.childElementCount >= MAX_SPARKLES) return;
    lastSparkle.current = now;
    const dot = document.createElement("span");
    dot.className = "tw-sparkle";
    dot.style.cssText = `left:${e.clientX - box.left}px;top:${e.clientY - box.top}px;--c:${pick(POP_COLORS)};--dx:${rand(-14, 14)}px;--dy:${rand(6, 26)}px`;
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
    layer.append(dot);
  };

  // The surprises and the rings follow their own stores: drawn once here, so a glyph coming or going never draws them again.
  const layers = useMemo(
    () => (
      <>
        <SurpriseLayer surprises={surprises} />
        <FeedbackLayer effects={effects} />
      </>
    ),
    [surprises, effects],
  );

  return (
    <div ref={root} className="tw-play" data-tap-keep onPointerDown={onPointerDown} onPointerMove={onPointerMove}>
      {!started && (
        <p className="tw-welcome">
          {touchOnly
            ? t({
                en: "Tap anywhere! 👆",
                de: "Tipp irgendwohin! 👆",
                ru: "Коснись экрана! 👆",
                zh: "点一点屏幕吧！👆",
                hi: "स्क्रीन को छुओ! 👆",
                es: "¡Toca la pantalla! 👆",
                ar: "هيّا نلمس الشاشة! 👆",
              })
            : t({
                en: "Press any key! ⌨️",
                de: "Drück irgendeine Taste! ⌨️",
                ru: "Нажми любую клавишу! ⌨️",
                zh: "随便按一个键吧！⌨️",
                hi: "कोई भी बटन दबाओ! ⌨️",
                es: "¡Pulsa cualquier tecla! ⌨️",
                ar: "هيّا نضغط على أي زر! ⌨️",
              })}
        </p>
      )}
      <div className="tw-pops" aria-hidden>
        {pops.map((p) => (
          <PopView key={p.id} pop={p} />
        ))}
      </div>
      <div ref={sparkles} className="tw-sparkles" aria-hidden />
      {layers}
    </div>
  );
}

/**
 * A glyph or shape: one small HTML layer that pops in, stays a moment and floats away, and behind it a burst of sparks
 * flying out as it comes, like a little firework – each moved by transform and opacity alone.
 */
const PopView = memo(function PopView({ pop }: { pop: Pop }) {
  const style = {
    left: pop.x - pop.size / 2,
    top: pop.y - pop.size / 2,
    width: pop.size,
    height: pop.size,
    "--c": pop.color,
    "--turn": `${pop.turn}deg`,
    "--life": `${POP_MS}ms`,
  } as CSSProperties;
  const spark = Math.max(14, pop.size * 0.22);
  return (
    <>
      <span className="tw-burst" style={{ left: pop.x, top: pop.y }}>
        {pop.sparks.map((s, i) => (
          <span key={i} className="tw-spark" style={{ "--a": `${s.angle}deg`, "--d": `${s.distance}px`, "--c": s.color, width: spark } as CSSProperties} />
        ))}
      </span>
      <span className={`tw-pop ${pop.kind === "glyph" ? "tw-glyph" : "tw-shape"}`} style={style}>
        {pop.kind === "glyph" ? <span style={{ fontSize: pop.size * 0.86 }}>{pop.text}</span> : <ShapeView shape={pop.shape} color={pop.color} />}
        {pop.kind === "glyph" && pop.count && <Counted size={pop.size} {...pop.count} />}
      </span>
    </>
  );
});

/** A digit's shapes: `n` of one kind on a ring round its number, from the top clockwise, popping in one after the other. */
function Counted({ n, shape, color, size }: { n: number; shape: ShapeKind; color: string; size: number }) {
  const thing = size * THING_SHARE;
  return Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const style = {
      left: size / 2 + Math.cos(angle) * size * RING_SHARE - thing / 2,
      top: size / 2 + Math.sin(angle) * size * RING_SHARE - thing / 2,
      width: thing,
      height: thing,
      "--delay": `${120 + i * 70}ms`,
    } as CSSProperties;
    return (
      <span key={i} className="tw-thing" style={style}>
        <ShapeView shape={shape} color={color} />
      </span>
    );
  });
}
