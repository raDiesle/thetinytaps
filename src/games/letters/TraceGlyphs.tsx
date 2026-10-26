import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { BRIGHT_COLORS, STAR_PATH } from "@/components/Bursts";
import { playCountNote } from "@/lib/sfx";

/** Room between two glyphs, like .glyphs (0.25em). */
const GAP_EM = 0.25;
/** Room around the glyphs, so the dots at the edge are not cut off. */
const PAD_EM = 0.08;
const DOT_EM = 0.04;
const DOT_SPACING_EM = 0.075;
/** How far next to the letter a finger still counts as on it. */
const TOLERANCE_EM = 0.06;
/** A new star once the finger has moved this far from the last one. */
const STAR_SPACING_EM = 0.08;
const MAX_STARS = 160;
/** Every so many stars a note plays, climbing up the scale. */
const NOTE_EVERY = 3;

interface Star {
  id: number;
  /** Position and size in em, so the stars stay put when the letter is resized. */
  x: number;
  y: number;
  size: number;
  color: string;
  rotate: number;
}

interface Layout {
  /** Font size in px. */
  size: number;
  /** Where the finger may be: the letters plus a little tolerance, one alpha value per CSS pixel. */
  mask: ImageData;
}

/**
 * The letter as a big dotted outline to trace with a finger or the mouse.
 * Wherever it goes over the letter, stars appear and stay. No scoring.
 */
export function TraceGlyphs({ glyphs, sounds }: { glyphs: string[]; sounds: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const layout = useRef<Layout | null>(null);
  const lastStar = useRef<{ x: number; y: number } | null>(null);
  const nextId = useRef(0);
  const [stars, setStars] = useState<Star[]>([]);
  const text = glyphs.join("");

  // Draw on a canvas so the dots and the hit test use exactly the same letter shapes.
  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      const el = box.current;
      const c = canvas.current;
      const ctx = c?.getContext("2d");
      if (cancelled || !el || !c || !ctx) return;
      const style = getComputedStyle(el);
      const size = parseFloat(style.fontSize);
      const font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
      const colors = [style.getPropertyValue("--ink").trim(), style.getPropertyValue("--accent").trim()];

      ctx.font = font;
      const widths = glyphs.map((g) => ctx.measureText(g).width);
      const metrics = ctx.measureText(text);
      const pad = PAD_EM * size;
      const width = Math.ceil(widths.reduce((sum, w) => sum + w, 0) + GAP_EM * size * (glyphs.length - 1) + 2 * pad);
      // Same place as with CSS line-height 1, so the card keeps its size; grow only for parts sticking out (Ä, g).
      const lineBaseline = (size - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2 + metrics.fontBoundingBoxAscent;
      const above = Math.max(0, metrics.actualBoundingBoxAscent - lineBaseline);
      const below = Math.max(0, lineBaseline + metrics.actualBoundingBoxDescent - size);
      const height = Math.ceil(size + above + below + 2 * pad);
      const baseline = pad + above + lineBaseline;

      const paint = (target: CanvasRenderingContext2D, scale: number, mask: boolean) => {
        target.setTransform(scale, 0, 0, scale, 0, 0);
        target.clearRect(0, 0, width, height);
        target.font = font;
        target.lineCap = "round";
        target.lineJoin = "round";
        let x = pad;
        glyphs.forEach((g, i) => {
          if (mask) {
            target.lineWidth = 2 * TOLERANCE_EM * size;
            target.fillText(g, x, baseline);
            target.strokeText(g, x, baseline);
          } else {
            const color = colors[Math.min(i, 1)];
            target.fillStyle = target.strokeStyle = color;
            target.globalAlpha = 0.1;
            target.fillText(g, x, baseline);
            target.globalAlpha = 1;
            target.lineWidth = DOT_EM * size;
            target.setLineDash([0, DOT_SPACING_EM * size]);
            target.strokeText(g, x, baseline);
          }
          x += widths[i] + GAP_EM * size;
        });
      };

      const dpr = window.devicePixelRatio || 1;
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
      c.style.width = `${width}px`;
      c.style.height = `${height}px`;
      paint(ctx, dpr, false);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = width;
      maskCanvas.height = height;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) return;
      paint(maskCtx, 1, true);
      layout.current = { size, mask: maskCtx.getImageData(0, 0, width, height) };
    };

    draw();
    // The font may still be loading, and the letter follows the size of the stage.
    void document.fonts.ready.then(draw);
    const stage = box.current?.closest(".stage");
    const observer = new ResizeObserver(draw);
    if (stage) observer.observe(stage);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
    // `glyphs` is a new array on every render; `text` says when it really changed.
  }, [text]);

  /** Put a star where the pointer is if it is on the letter. Returns whether it is on the letter. */
  const trace = useCallback(
    (e: PointerEvent, force: boolean) => {
      const l = layout.current;
      const rect = canvas.current?.getBoundingClientRect();
      if (!l || !rect) return false;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = Math.floor(x);
      const py = Math.floor(y);
      const inside = px >= 0 && py >= 0 && px < l.mask.width && py < l.mask.height;
      if (!inside || l.mask.data[(py * l.mask.width + px) * 4 + 3] === 0) {
        lastStar.current = null;
        return false;
      }
      const prev = lastStar.current;
      if (!force && prev && Math.hypot(x - prev.x, y - prev.y) < STAR_SPACING_EM * l.size) return true;
      lastStar.current = { x, y };

      const id = nextId.current++;
      if (sounds && id % NOTE_EVERY === 0) playCountNote(id / NOTE_EVERY);
      const star: Star = {
        id,
        x: x / l.size,
        y: y / l.size,
        size: 0.12 + Math.random() * 0.08,
        color: BRIGHT_COLORS[id % BRIGHT_COLORS.length],
        rotate: Math.random() * 70 - 35,
      };
      setStars((prev) => [...prev.slice(-(MAX_STARS - 1)), star]);
      return true;
    },
    [sounds],
  );

  // Tracing on the letter must not count as a tap on the card (next part, repeat).
  const onPointerDown = (e: PointerEvent) => {
    if (trace(e, true)) e.stopPropagation();
  };
  // A mouse traces by just moving over the letter; a finger or pen while touching.
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse" || e.buttons) trace(e, false);
  };
  const lift = () => {
    lastStar.current = null;
  };

  return (
    <div
      ref={box}
      className="glyphs trace"
      role="img"
      aria-label={glyphs.join(" ")}
      // Tracing stays on the letter, even next to something else to tap.
      data-tap-keep
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={lift}
      onPointerLeave={lift}
    >
      <canvas ref={canvas} />
      {stars.map((s) => (
        <svg
          key={s.id}
          className="trace-star"
          viewBox="0 0 100 100"
          aria-hidden
          style={
            {
              left: `${s.x}em`,
              top: `${s.y}em`,
              width: `${s.size}em`,
              height: `${s.size}em`,
              "--rotate": `${s.rotate}deg`,
            } as CSSProperties
          }
        >
          <path d={STAR_PATH} fill={s.color} />
        </svg>
      ))}
    </div>
  );
}
