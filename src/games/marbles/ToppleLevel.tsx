import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { playDrum, playKnock } from "@/lib/sfx";
import { useAnyKey, useFrames, VIEW_H, VIEW_W, type LevelProps } from "./level";
import { cameraOn } from "./machineKit";
import { pickThings, type Thing } from "./things";
import type { Pt } from "./path";

const INK = "#2a1e5c";
const FLOOR = 790;
/** Gravity for the tipping, slower than real so the child can follow. */
const GRAVITY = 1000;
/** The first push, in radians per second. */
const PUSH = 1.3;
/** Each thing stands this share of its height away from the next, so it can reach it. */
const SPACING = 0.45;
const DRUM = { w: 150, h: 110 };
/** Runs of small-to-tall things in the long row. */
const GROUPS = 5;
/** The things are drawn this much bigger than their own numbers. */
const SCALE = 1.3;
/** Room before the first thing and after the drum, in the picture's pixels. */
const MARGIN = 260;
/** How fast the camera catches up with the falling, per second. */
const CAMERA_FOLLOW = 2.2;
/** One after another the things on the first screen drop in from above. */
const DROP_STAGGER_MS = 130;
const DROP_MS = 600;
const DONE_AFTER_DRUM_MS = 1600;
/** If something got stuck, end anyway after this long per thing. */
const MAX_FALL_MS_EACH = 1500;

interface Tipping {
  /** Angle in radians, 0 standing, π/2 lying on the floor. */
  angle: number;
  /** Angular speed, radians per second. */
  spin: number;
  started: boolean;
  /** Has already hit the one after it. */
  touched: boolean;
}

/** Corners of a thing standing with its left edge at `left`, tipped by `angle` around its bottom right corner. */
function corners(left: number, w: number, h: number, angle: number): Pt[] {
  const px = left + w;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    { x: -w, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: -h },
    { x: -w, y: -h },
  ].map((p) => ({ x: px + p.x * c - p.y * s, y: p.x * s + p.y * c }));
}

/** Do two convex shapes overlap? (Separating axis test.) */
function overlaps(a: Pt[], b: Pt[]) {
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const nx = q.y - p.y;
      const ny = p.x - q.x;
      const project = (pts: Pt[]) => pts.map((r) => r.x * nx + r.y * ny);
      const pa = project(a);
      const pb = project(b);
      if (Math.max(...pa) <= Math.min(...pb) || Math.max(...pb) <= Math.min(...pa)) return false;
    }
  }
  return true;
}

interface Layout {
  things: Thing[];
  /** Left edge of each thing, before scaling. */
  lefts: number[];
  drumLeft: number;
  /** How many things stand on the first screen; only they drop in. */
  onFirstScreen: number;
  /** The whole room, in the picture's pixels. */
  worldW: number;
}

/** Where a spot of the row is in the room. */
const roomX = (x: number) => MARGIN + x * SCALE;

function layOut(things: Thing[]): Layout {
  const lefts: number[] = [];
  let x = 0;
  for (const t of things) {
    lefts.push(x);
    x += t.w + Math.max(16, t.h * SPACING);
  }
  return {
    things,
    lefts,
    drumLeft: x,
    onFirstScreen: lefts.filter((l) => roomX(l) < VIEW_W).length,
    worldW: roomX(x + DRUM.w) + MARGIN,
  };
}

type Phase = "dropping" | "ready" | "falling" | "done";

/**
 * Everyday things stand in a long row through the room, small to tall again
 * and again, with a drum at the end. A tap pushes the first one; it tips over
 * onto the next, which tips onto the next … and the camera walks along, until
 * the last one hits the drum. Every round brings other things.
 */
export function ToppleLevel({ sound, say, onDone }: LevelProps) {
  const layout = useMemo(() => layOut(pickThings(GROUPS)), []);
  const { things, lefts, drumLeft, onFirstScreen, worldW } = layout;
  const tipping = useRef<Tipping[]>(things.map(() => ({ angle: 0, spin: 0, started: false, touched: false })));
  const phase = useRef<Phase>("dropping");
  const fallStart = useRef(0);
  const drumAt = useRef(-Infinity);
  const now = useRef(performance.now());
  const camera = useRef(0);

  const drumBox: Pt[] = [
    { x: drumLeft, y: 0 },
    { x: drumLeft + DRUM.w, y: 0 },
    { x: drumLeft + DRUM.w, y: -DRUM.h },
    { x: drumLeft, y: -DRUM.h },
  ];

  // Tock, tock, tock: each one on the first screen lands after dropping in; then the row is ready.
  useEffect(() => {
    const timers = things
      .slice(0, onFirstScreen)
      .map((t, i) => setTimeout(() => sound(() => playKnock(1100 - t.h)), i * DROP_STAGGER_MS + DROP_MS * 0.7));
    timers.push(
      setTimeout(() => {
        phase.current = "ready";
      }, onFirstScreen * DROP_STAGGER_MS + DROP_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [things, onFirstScreen, sound]);

  const finish = () => {
    phase.current = "done";
    setTimeout(onDone, DONE_AFTER_DRUM_MS);
  };

  useFrames((dt, t) => {
    now.current = t;
    // The camera looks at the one falling furthest along, or at the drum at the end.
    let front = -1;
    tipping.current.forEach((o, i) => {
      if (o.started) front = i;
    });
    const focus = drumAt.current > 0 ? roomX(drumLeft + DRUM.w / 2) : front < 0 ? 0 : roomX(lefts[front] + things[front].w);
    camera.current += (cameraOn(worldW, focus) - camera.current) * (1 - Math.exp(-dt * CAMERA_FOLLOW));
    if (phase.current !== "falling") return;
    const tips = tipping.current;
    tips.forEach((o, i) => {
      if (!o.started) return;
      const thing = things[i];
      o.spin += ((1.5 * GRAVITY) / thing.h) * Math.sin(Math.max(o.angle, 0.02)) * dt;
      let angle = Math.min(Math.PI / 2, o.angle + o.spin * dt);
      const next = i + 1 < things.length ? corners(lefts[i + 1], things[i + 1].w, things[i + 1].h, tips[i + 1].angle) : drumBox;
      if (overlaps(corners(lefts[i], thing.w, thing.h, angle), next)) {
        // Lean on the next one: the furthest angle that doesn't go into it.
        let lo = o.angle;
        let hi = angle;
        for (let k = 0; k < 14; k++) {
          const mid = (lo + hi) / 2;
          if (overlaps(corners(lefts[i], thing.w, thing.h, mid), next)) hi = mid;
          else lo = mid;
        }
        angle = lo;
        if (!o.touched) {
          o.touched = true;
          sound(thing.sound);
          if (i + 1 < things.length) {
            const n = tips[i + 1];
            n.started = true;
            n.spin = Math.max(1.2, (o.spin * thing.h * 0.8) / things[i + 1].h);
          } else {
            drumAt.current = t;
            sound(playDrum);
            say("Bumm! Alles umgefallen!");
            finish();
          }
        }
        o.spin = 0;
      }
      if (angle >= Math.PI / 2) o.spin = o.spin > 2 ? -o.spin * 0.2 : 0;
      o.angle = angle;
    });
    if (phase.current === "falling" && t - fallStart.current > MAX_FALL_MS_EACH * things.length) finish();
  });

  const push = () => {
    if (phase.current !== "ready") return;
    phase.current = "falling";
    fallStart.current = performance.now();
    const first = tipping.current[0];
    first.started = true;
    first.spin = PUSH;
    sound(() => playKnock(1400));
  };

  useAnyKey(push);

  const t = now.current;
  const drumAge = (t - drumAt.current) / 1000;
  const drumSquash = drumAge >= 0 && drumAge < 2 ? 0.12 * Math.exp(-drumAge * 5) * Math.cos(drumAge * 30) : 0;
  const first = things[0];

  return (
    <div className="marble-level" onPointerDown={push}>
      <svg className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label="Alles fällt um">
        <g transform={`translate(${-camera.current} 0)`}>
          <Room width={worldW} />
          <g transform={`translate(${MARGIN} ${FLOOR}) scale(${SCALE})`}>
            {things.map((thing, i) => (
              <g
                key={i}
                className={i < onFirstScreen ? "thing-drop" : undefined}
                style={{ animationDelay: `${i * DROP_STAGGER_MS}ms`, "--drop-ms": `${DROP_MS}ms` } as CSSProperties}
              >
                <g transform={`translate(${lefts[i] + thing.w} 0) rotate(${(tipping.current[i].angle * 180) / Math.PI}) translate(${-thing.w} 0)`}>
                  {thing.draw()}
                </g>
              </g>
            ))}
            <g transform={`translate(${drumLeft + DRUM.w / 2} 0) scale(${1 + drumSquash} ${1 - drumSquash}) translate(${-DRUM.w / 2} 0)`}>
              <Drum />
            </g>
            {phase.current !== "falling" && phase.current !== "done" && (
              <text className="topple-hint" x={-24} y={-first.h * 0.62} fontSize={86 / SCALE} textAnchor="end" dominantBaseline="middle">
                👉
              </text>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
}

function Drum() {
  const { w, h } = DRUM;
  return (
    <g>
      <rect x="0" y={-h + 14} width={w} height={h - 14} rx="10" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      <path
        d={`M4 ${-h + 24} ${Array.from({ length: 6 }, (_, i) => `L${12 + i * 24 + 12} -14 L${12 + (i + 1) * 24} ${-h + 24}`).join(" ")}`}
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <ellipse cx={w / 2} cy={-h + 14} rx={w / 2} ry="14" fill="#fff6e0" stroke={INK} strokeWidth="3" />
      <rect x="0" y="-16" width={w} height="16" rx="6" fill="#ffb703" stroke={INK} strokeWidth="3" />
      <line x1={w * 0.62} y1={-h + 10} x2={w + 30} y2={-h - 40} stroke="#8a5a2b" strokeWidth="8" strokeLinecap="round" />
      <circle cx={w + 30} cy={-h - 40} r="9" fill="#ffd6e0" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A cosy room as wide as the row: wallpaper, windows, pictures, and the wooden floor everything stands on. */
function Room({ width }: { width: number }) {
  const w = width + 800;
  return (
    <g>
      <rect x="-400" y="-200" width={w} height={FLOOR + 200} fill="#ffe9c7" />
      {Array.from({ length: Math.ceil(w / 110) }, (_, i) => (
        <line key={i} x1={-400 + i * 110} y1="-200" x2={-400 + i * 110} y2={FLOOR} stroke="#ffdcae" strokeWidth="30" />
      ))}
      {Array.from({ length: Math.ceil(width / VIEW_W) }, (_, i) => (
        <g key={i} transform={`translate(${i * VIEW_W} 0)`}>
          <g transform="translate(150 90)">
            <rect width="300" height="230" rx="10" fill="#bfe9ff" stroke={INK} strokeWidth="5" />
            <circle cx="230" cy="60" r="30" fill="#ffd23f" />
            <path d="M40 150 q20 -30 50 -10 q25 -25 55 0 q25 0 25 20 h-130 z" fill="#fff" />
            <line x1="150" y1="0" x2="150" y2="230" stroke={INK} strokeWidth="5" />
            <line x1="0" y1="115" x2="300" y2="115" stroke={INK} strokeWidth="5" />
          </g>
          <g transform="translate(1180 110)">
            <rect width="200" height="150" rx="6" fill="#fff" stroke="#b8763d" strokeWidth="12" />
            <path d="M30 120 L80 60 L110 95 L135 70 L175 120 Z" fill="#3ec300" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
            <circle cx="150" cy="40" r="14" fill="#ff8c42" />
          </g>
        </g>
      ))}
      <rect x="-400" y={FLOOR - 26} width={w} height="26" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={w} height={VIEW_H - FLOOR + 200} fill="#d9a066" />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1="-400" y1={FLOOR + 22 + i * 26} x2={width + 400} y2={FLOOR + 22 + i * 26} stroke="#c48a52" strokeWidth="3" />
      ))}
      <line x1="-400" y1={FLOOR} x2={width + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
}
