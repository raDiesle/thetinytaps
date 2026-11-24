import { type CSSProperties, type PointerEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FeedbackLayer, useTapFeedback } from "@/components/TapFeedback";
import { keyOf, toUpper, useLanguagePack } from "@/content/languages";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { pick } from "@/lib/random";
import { playBlub, playBoing, playChimeNote, playPlop, playPop } from "@/lib/sfx";
import { repeatPause } from "@/lib/spacing";
import { useTimers } from "@/lib/timers";
import { talking } from "@/lib/voice";
import { MIN_CHANGE_MS, SAME_KEY_PAUSE_MS } from "@/games/letters/pace";
import { useSoftTap } from "@/games/letters/softTap";
import { SurpriseLayer, useSurprises } from "@/games/letters/Surprises";
import { lettersVoice } from "@/games/letters/voice";
import { SHAPES, type ShapeKind, ShapeView } from "./shapes";
import "./tapaway.css";

// „Tap Away“: a toy for banging on the keyboard, the mouse or the screen – no card, nothing to learn or find, only
// cause and effect (user request, 24 November 2026, in the spirit of the keyboard smash toys parents search for). A
// letter or digit key brings that letter big and bright somewhere on the page with its note and, where recorded, its
// name; every other key and every tap or click opens one of Frei tippen's surprises right there, and where none may come
// yet a bright shape pops up instead. A mouse moving leaves a short trail of sparkles. Never a storm: everything comes
// at most so often and so many at once, and what can't come only ripples (see CLAUDE.md).

/** A glyph's (letter's or digit's) size: this share of the play area's shorter side, within these limits in px. */
const GLYPH_SHARE = 0.34;
const GLYPH_MIN = 90;
const GLYPH_MAX = 300;
/** A shape's size, the same way. */
const SHAPE_SHARE = 0.24;
const SHAPE_MIN = 70;
const SHAPE_MAX = 220;
/** A surprise's size, as in Frei tippen. */
const SURPRISE_SHARE = 0.42;
const SURPRISE_MIN = 120;
const SURPRISE_MAX = 360;

/** How long a glyph or shape stays, in ms; `tw-pop` in tapaway.css runs exactly this long. */
export const POP_MS = 2200;
/** At most this many glyphs and shapes on the page at once; more presses only ripple. */
export const MAX_POPS = 5;
/** A mouse's sparkles: one at most this often while it moves, each living `SPARKLE_MS`, at most `MAX_SPARKLES` at once. */
export const SPARKLE_GAP_MS = 60;
export const SPARKLE_MS = 700;
export const MAX_SPARKLES = 12;
/** Room kept free at the top for ✕, the fullscreen note and ⚙️, in px. */
const TOP_CLEAR = 72;

/** Bright colours for glyphs and shapes, each readable with a white outline on the light page. */
export const POP_COLORS = ["#ff4f6d", "#ff9f1c", "#2ec4b6", "#3a86ff", "#8338ec", "#ff5fb8", "#3ec300", "#ffbe0b"];

/** One glyph or shape on the page. */
type Pop = { id: number; x: number; y: number; size: number; color: string; turn: number } & (
  | { kind: "glyph"; text: string }
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
  const softTap = useSoftTap(ripple);
  const { surprises, spawn } = useSurprises();
  const { later } = useTimers();
  const root = useRef<HTMLDivElement>(null);
  const sparkles = useRef<HTMLDivElement>(null);
  const [pops, setPops] = useState<Pop[]>([]);
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

  /** A free place for something `size` big, inside the area and clear of the top corners' notes, in px in the area. */
  const spot = (box: DOMRect, size: number, at?: { x: number; y: number }) => {
    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(Math.max(min, max), v));
    const x = at ? at.x - box.left : rand(size * 0.6, box.width - size * 0.6);
    const y = at ? at.y - box.top : rand(TOP_CLEAR + size * 0.6, box.height - size * 0.6);
    return { x: clamp(x, size * 0.5, box.width - size * 0.5), y: clamp(y, TOP_CLEAR + size * 0.45, box.height - size * 0.5) };
  };

  /** Puts a glyph or shape on the page for `POP_MS`; false when too soon or too many. */
  const pop = useCallback(
    (make: (box: DOMRect) => Omit<Pop, "id" | "color" | "turn">) => {
      const box = area();
      const now = performance.now();
      if (!box || live.current >= MAX_POPS || now - lastPop.current < MIN_CHANGE_MS) return false;
      lastPop.current = now;
      let color = pick(POP_COLORS);
      while (color === lastColor.current) color = pick(POP_COLORS);
      lastColor.current = color;
      const item = { ...make(box), id: nextId.current++, color, turn: rand(-14, 14) } as Pop;
      live.current++;
      setPops((list) => [...list, item]);
      later(() => {
        live.current--;
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
        return { kind: "shape", shape, size, ...spot(box, size, at) };
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
        const { x, y } = spot(box, size, at);
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
      const done = pop((box) => {
        const size = sized(box, GLYPH_SHARE, GLYPH_MIN, GLYPH_MAX);
        return { kind: "glyph", text: digit === undefined ? upper : key, size, ...spot(box, size) };
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
      <SurpriseLayer surprises={surprises} />
      <FeedbackLayer effects={effects} />
    </div>
  );
}

/** A glyph or shape: one small HTML layer that pops in, stays a moment and floats away, moved by transform and opacity alone. */
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
  return (
    <span className={`tw-pop ${pop.kind === "glyph" ? "tw-glyph" : "tw-shape"}`} style={style}>
      {pop.kind === "glyph" ? <span style={{ fontSize: pop.size * 0.86 }}>{pop.text}</span> : <ShapeView shape={pop.shape} color={pop.color} />}
    </span>
  );
});
