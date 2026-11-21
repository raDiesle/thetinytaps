// Frei tippen's canvas surprises (user request, November 2026: more effects drawn by the app itself, not emojis, and
// fireworks of many kinds). Each is a small canvas only as big as its sparks fly, drawn by its own animation frame
// loop – never by React – which stops by itself once the effect is over. Everything is in the surprise's CSS pixels
// with (0, 0) at the spot; `size` is the surprise's size there.

import { pick, shuffle } from "@/lib/random";

/** The kinds drawn on a canvas. */
export const CANVAS_KINDS = ["skyrocket", "fountain", "swirl", "sparkler"] as const;

/** One kind drawn on a canvas. */
export type CanvasKind = (typeof CANVAS_KINDS)[number];

/** The bursts a skyrocket can have, each a firework of its own kind. */
export const ROCKET_BURSTS = ["chrysanthemum", "palm", "crossette", "glitter", "saturn", "double"] as const;

/** The figures a sparkler can draw in the air. */
export const SPARKLER_FIGURES = ["heart", "spiral", "loop", "star", "wave"] as const;

/** How a canvas surprise looks this time; drawn once in `canvasParams`, so drawing it again changes nothing. */
export type CanvasParams =
  | { kind: "skyrocket"; burst: (typeof ROCKET_BURSTS)[number]; colors: string[]; second: string; startX: number }
  | { kind: "fountain"; colors: string[]; lean: number }
  | { kind: "swirl"; colors: string[]; arms: number; turn: 1 | -1 }
  | { kind: "sparkler"; figure: (typeof SPARKLER_FIGURES)[number]; colors: string[]; flip: 1 | -1 };

/** How long each canvas kind runs, in seconds; its surprise stays a little longer (`SURPRISE.lifeMs`). */
export const CANVAS_SECONDS: Record<CanvasKind, number> = { skyrocket: 2.7, fountain: 2.5, swirl: 2.4, sparkler: 2.8 };

/** The canvas's side, in surprise sizes: room for every spark of every kind. */
export const CANVAS_BOX = 2.6;

/** The finest a canvas is drawn: glowing sparks need no more, and an old phone's 3× screen would raster 4× the pixels. */
export const CANVAS_MAX_DPR = 1.5;

/** At most this many sparks are alive in one canvas surprise, so an old phone keeps up (`surprises.test.ts`). */
export const MAX_SPARKS = 260;

// Bright colours that show on the light page as well as on the dark night page.
const FIRE = ["#ffb000", "#ff7a00", "#ff3d5a"];
const COLOR_SETS = [
  ["#ff3d5a", "#ffb000", "#ff7a00"],
  ["#1e9bff", "#7b5cff", "#00c2ff"],
  ["#2fbf3a", "#ffc300", "#00a86b"],
  ["#ff4fb8", "#a24dff", "#ff3d5a"],
  ["#00b8a9", "#1e9bff", "#2fbf3a"],
  ["#ff8c00", "#ff3d5a", "#ffc300"],
  ["#a24dff", "#ff4fb8", "#1e9bff"],
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Draws this time's look of a canvas kind. */
export function canvasParams(kind: CanvasKind): CanvasParams {
  const colors = pick(COLOR_SETS);
  switch (kind) {
    case "skyrocket":
      return { kind, burst: pick(ROCKET_BURSTS), colors, second: pick(shuffle(COLOR_SETS).find((c) => c !== colors) ?? colors), startX: rand(-0.25, 0.25) };
    case "fountain":
      return { kind, colors: Math.random() < 0.5 ? FIRE : colors, lean: rand(-0.12, 0.12) };
    case "swirl":
      return { kind, colors, arms: pick([3, 4, 5]), turn: pick([1, -1] as const) };
    case "sparkler":
      return { kind, figure: pick(SPARKLER_FIGURES), colors, flip: pick([1, -1] as const) };
  }
}

/** One spark: where it is and goes, in surprise sizes per second, and how it looks. */
type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  /** Width of its streak, in px. */
  width: number;
  color: string;
  /** Turns into this colour over its second half. */
  late?: string;
  /** Pull downwards, in px per s². */
  gravity: number;
  /** Share of its speed kept each second. */
  drag: number;
  /** How long its streak is, in seconds of its flight. */
  trail: number;
  /** Something it does while flying or when its life ends. */
  onAge?: (spark: Spark, dt: number) => void;
  /** Glitter twinkles softly instead of fading evenly. */
  twinkle?: number;
};

/** A canvas surprise running: `step` moves it on (false once it is over), `draw` paints the present moment. */
export interface CanvasEffect {
  step: (dt: number) => boolean;
  draw: (ctx: CanvasRenderingContext2D) => void;
  /** Sparks alive now (for the test). */
  count: () => number;
}

/** Builds the running effect for `p` at `size` px. */
export function canvasEffect(p: CanvasParams, size: number): CanvasEffect {
  const sparks: Spark[] = [];
  const glows: { x: number; y: number; r: number; color: string; alpha: number }[] = [];
  const lines: { x: number; y: number; age: number }[] = [];
  const total = CANVAS_SECONDS[p.kind];
  let t = 0;
  let head: { x: number; y: number; color: string; r: number } | undefined;

  const add = (spark: Omit<Spark, "age" | "drag" | "trail"> & Partial<Pick<Spark, "drag" | "trail">>) => {
    if (sparks.length < MAX_SPARKS) sparks.push({ drag: 0.35, trail: 0.1, ...spark, age: 0 });
  };
  const ring = (n: number, speed: number, color: string, opts: Partial<Spark> = {}, squash = 1, tilt = 0) => {
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < n; i++) {
      const a = offset + (i / n) * Math.PI * 2;
      const v = speed * size * rand(0.92, 1.05);
      const ux = Math.cos(a) * v;
      const uy = Math.sin(a) * v * squash;
      add({
        x: 0,
        y: 0,
        vx: ux * Math.cos(tilt) - uy * Math.sin(tilt),
        vy: ux * Math.sin(tilt) + uy * Math.cos(tilt),
        life: rand(1.1, 1.4),
        width: size * 0.032,
        color,
        gravity: size * 0.35,
        ...opts,
      });
    }
  };

  // ---------- skyrocket: a rocket climbs to the spot and bursts in one of several kinds ----------
  const rocketTime = 0.55;
  let burst = false;
  const rocketFrom = { x: p.kind === "skyrocket" ? p.startX * size : 0, y: size * 1.15 };
  const explode = () => {
    if (p.kind !== "skyrocket") return;
    const [a, b] = p.colors;
    glows.push({ x: 0, y: 0, r: size * 0.45, color: a, alpha: 1 });
    switch (p.burst) {
      case "chrysanthemum":
        ring(56, 1.15, a, { late: p.second, trail: 0.16 });
        break;
      case "double":
        ring(40, 1.15, a, { trail: 0.15 });
        ring(22, 0.6, b, { trail: 0.12, life: 1.1 });
        break;
      case "palm":
        // A few heavy fronds that droop like a palm tree's, each shedding golden sparks.
        ring(9, 0.95, "#ffb000", {
          width: size * 0.05,
          gravity: size * 0.75,
          life: 1.5,
          trail: 0.18,
          onAge: (s, dt) => {
            if (Math.random() < dt * 40)
              add({
                x: s.x,
                y: s.y,
                vx: rand(-0.08, 0.08) * size,
                vy: rand(0, 0.1) * size,
                life: rand(0.35, 0.6),
                width: size * 0.02,
                color: "#ffc300",
                late: "#ff7a00",
                gravity: size * 0.6,
                trail: 0.05,
              });
          },
        });
        break;
      case "crossette":
        // Sparks that split in four halfway.
        ring(12, 0.9, a, {
          life: 0.55,
          trail: 0.14,
          onAge: (s) => {
            if (s.age < s.life) return;
            const base = Math.atan2(s.vy, s.vx);
            for (let k = 0; k < 4; k++) {
              const ang = base + Math.PI / 4 + (k * Math.PI) / 2;
              add({
                x: s.x,
                y: s.y,
                vx: Math.cos(ang) * size * 0.55,
                vy: Math.sin(ang) * size * 0.55,
                life: rand(0.7, 0.9),
                width: size * 0.026,
                color: b,
                gravity: size * 0.4,
                trail: 0.12,
              });
            }
          },
        });
        break;
      case "glitter":
        // Sparks that leave glitter twinkling behind them.
        ring(30, 1.05, "#ffc300", {
          life: 1.2,
          late: a,
          onAge: (s, dt) => {
            if (Math.random() < dt * 18)
              add({
                x: s.x,
                y: s.y,
                vx: 0,
                vy: size * 0.05,
                life: rand(0.5, 0.8),
                width: size * 0.024,
                color: pick(["#ffd23f", a]),
                gravity: size * 0.12,
                trail: 0,
                twinkle: rand(0, 6),
              });
          },
        });
        break;
      case "saturn":
        // A ball with a tilted ring round it, like a planet.
        ring(18, 0.5, b, { trail: 0.1, life: 1.2 });
        ring(36, 1.2, a, { trail: 0.14, gravity: size * 0.15 }, 0.28, rand(-0.5, 0.5));
        break;
    }
  };

  // ---------- fountain: a cone of sparks spraying up from below the spot ----------
  const fountainBase = { x: 0, y: size * 0.4 };

  // ---------- sparkler: a bright point draws a figure in the air, sparks flying off it ----------
  const drawTime = 1.9;
  const figurePoint = (u: number): { x: number; y: number } => {
    if (p.kind !== "sparkler") return { x: 0, y: 0 };
    const r = size * 0.42;
    const a = u * Math.PI * 2;
    switch (p.figure) {
      case "heart": {
        const x = 16 * Math.sin(a) ** 3;
        const y = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        return { x: (x / 17) * r * p.flip, y: (y / 17) * r - r * 0.1 };
      }
      case "spiral": {
        const turns = 2.5 * Math.PI * 2 * u;
        const rr = r * (0.1 + 0.9 * u);
        return { x: Math.cos(turns) * rr * p.flip, y: Math.sin(turns) * rr };
      }
      case "loop":
        // A lying eight.
        return { x: Math.sin(a) * r * 1.2 * p.flip, y: Math.sin(2 * a) * r * 0.5 };
      case "star": {
        // The five points of a star, drawn in one line.
        const k = u * 5;
        const i = Math.floor(k) % 5;
        const f = k - Math.floor(k);
        const corner = (n: number) => {
          const ang = -Math.PI / 2 + ((n * 2) % 5) * ((Math.PI * 2) / 5);
          return { x: Math.cos(ang) * r, y: Math.sin(ang) * r };
        };
        const from = corner(i);
        const to = corner(i + 1);
        return { x: (from.x + (to.x - from.x) * f) * p.flip, y: from.y + (to.y - from.y) * f };
      }
      case "wave":
        return { x: (u * 2 - 1) * r * 1.3 * p.flip, y: Math.sin(u * Math.PI * 4) * r * 0.45 };
    }
  };

  return {
    count: () => sparks.length,
    step(dt) {
      t += dt;
      if (t >= total) {
        sparks.length = 0;
        return false;
      }
      switch (p.kind) {
        case "skyrocket":
          if (t < rocketTime) {
            const f = t / rocketTime;
            const ease = 1 - (1 - f) ** 2;
            head = { x: rocketFrom.x * (1 - ease), y: rocketFrom.y * (1 - ease), color: "#ffe9a8", r: size * 0.035 };
            if (Math.random() < dt * 70)
              add({
                x: head.x,
                y: head.y,
                vx: rand(-0.05, 0.05) * size,
                vy: size * 0.15,
                life: rand(0.25, 0.45),
                width: size * 0.02,
                color: "#ffc300",
                late: "#ff7a00",
                gravity: size * 0.3,
                trail: 0.03,
              });
          } else if (!burst) {
            burst = true;
            head = undefined;
            explode();
          }
          break;
        case "fountain":
          if (t < 1.7) {
            head = { ...fountainBase, color: p.colors[0], r: size * 0.06 };
            const n = Math.round(dt * 120 + Math.random());
            for (let i = 0; i < n; i++) {
              const ang = -Math.PI / 2 + p.lean + rand(-0.32, 0.32);
              const v = rand(1.3, 2.0) * size;
              add({
                x: fountainBase.x,
                y: fountainBase.y,
                vx: Math.cos(ang) * v,
                vy: Math.sin(ang) * v,
                life: rand(0.75, 1.05),
                width: size * 0.026,
                color: pick(p.colors),
                late: p.colors[p.colors.length - 1],
                gravity: size * 2.2,
                drag: 0.6,
                trail: 0.035,
              });
            }
          } else head = undefined;
          break;
        case "swirl":
          if (t < 1.5) {
            const n = Math.round(dt * 90 + Math.random());
            for (let i = 0; i < n; i++) {
              const arm = Math.floor(Math.random() * p.arms);
              const ang = (arm / p.arms) * Math.PI * 2 + t * 5 * p.turn;
              const out = size * rand(0.45, 0.6);
              const around = size * 0.55 * p.turn;
              add({
                x: Math.cos(ang) * size * 0.05,
                y: Math.sin(ang) * size * 0.05,
                vx: Math.cos(ang) * out - Math.sin(ang) * around,
                vy: Math.sin(ang) * out + Math.cos(ang) * around,
                life: rand(0.8, 1.0),
                width: size * 0.034,
                color: p.colors[arm % p.colors.length],
                gravity: 0,
                drag: 0.5,
                trail: 0.06,
              });
            }
            head = { x: 0, y: 0, color: p.colors[0], r: size * 0.05 };
          } else if (head) {
            // It ends with a little burst from the middle.
            head = undefined;
            ring(24, 0.7, p.colors[1] ?? p.colors[0], { life: 0.7, trail: 0.05, gravity: size * 0.2 });
          }
          break;
        case "sparkler":
          if (t < drawTime) {
            const u = t / drawTime;
            const at = figurePoint(u);
            head = { ...at, color: "#fff3b0", r: size * 0.04 };
            lines.push({ ...at, age: 0 });
            const n = Math.round(dt * 110 + Math.random());
            for (let i = 0; i < n; i++) {
              const ang = rand(0, Math.PI * 2);
              const v = rand(0.25, 0.6) * size;
              add({
                x: at.x,
                y: at.y,
                vx: Math.cos(ang) * v,
                vy: Math.sin(ang) * v,
                life: rand(0.18, 0.35),
                width: size * 0.018,
                color: pick(["#ffd23f", "#ffb000", ...p.colors]),
                gravity: size * 0.5,
                drag: 0.2,
                trail: 0.05,
              });
            }
          } else head = undefined;
          break;
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        const keep = s.drag ** dt;
        s.vx *= keep;
        s.vy = s.vy * keep + s.gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.onAge?.(s, dt);
        if (s.age >= s.life) sparks.splice(i, 1);
      }
      for (const g of glows) g.alpha = Math.max(0, g.alpha - dt * 3.5);
      for (const l of lines) l.age += dt;
      return true;
    },
    draw(ctx) {
      // The whole effect fades over its last 0.35 s, so nothing vanishes at once.
      ctx.globalAlpha = 1;
      const fadeAll = Math.min(1, (total - t) / 0.35);
      for (const g of glows) {
        if (g.alpha <= 0) continue;
        ctx.globalAlpha = g.alpha * 0.55 * fadeAll;
        ctx.drawImage(glowSprite(g.color), g.x - g.r, g.y - g.r, g.r * 2, g.r * 2);
      }
      if (lines.length > 1) {
        // The sparkler's line of light, fading from its oldest end.
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = size * 0.028;
        const color = p.colors[0];
        for (let i = 1; i < lines.length; i++) {
          const a = Math.max(0, 1 - lines[i].age / 1.6) * fadeAll;
          if (a <= 0) continue;
          ctx.globalAlpha = a;
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(lines[i - 1].x, lines[i - 1].y);
          ctx.lineTo(lines[i].x, lines[i].y);
          ctx.stroke();
        }
      }
      ctx.lineCap = "round";
      for (const s of sparks) {
        const f = s.age / s.life;
        let alpha = f < 0.7 ? 1 : 1 - (f - 0.7) / 0.3;
        if (s.twinkle !== undefined) alpha *= 0.55 + 0.45 * Math.sin(s.age * 14 + s.twinkle);
        ctx.globalAlpha = Math.max(0, alpha) * fadeAll;
        const color = s.late && f > 0.5 ? s.late : s.color;
        ctx.strokeStyle = color;
        ctx.lineWidth = s.width * (1 - f * 0.5);
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * s.trail, s.y - s.vy * s.trail);
        ctx.lineTo(s.x + 0.01, s.y);
        ctx.stroke();
        // A soft glow round the spark's head, as a real spark has.
        const glow = s.width * 1.3;
        ctx.globalAlpha *= 0.3;
        ctx.drawImage(glowSprite(color), s.x - glow, s.y - glow, glow * 2, glow * 2);
      }
      if (head) {
        ctx.globalAlpha = fadeAll;
        ctx.drawImage(glowSprite(head.color), head.x - head.r * 3, head.y - head.r * 3, head.r * 6, head.r * 6);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(head.x, head.y, head.r * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  };
}

const sprites = new Map<string, HTMLCanvasElement>();

/** A soft round glow in `color`, drawn once per colour and then only copied. */
function glowSprite(color: string): HTMLCanvasElement {
  let sprite = sprites.get(color);
  if (!sprite) {
    sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const g = sprite.getContext("2d");
    if (g) {
      const gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.25, color);
      gradient.addColorStop(1, `${color}00`);
      g.fillStyle = gradient;
      g.fillRect(0, 0, 64, 64);
    }
    sprites.set(color, sprite);
  }
  return sprite;
}
