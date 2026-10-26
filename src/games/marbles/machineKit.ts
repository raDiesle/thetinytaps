// What every Rube Goldberg machine is made of: paths, things rolling along
// them, little jumps, easing, a list of moments with sounds, and the camera.
// A machine works everything out ahead as a function of the seconds since the
// tap, so its level only asks where each thing is at a moment.

import type { Localized } from "@/lib/language";
import { VIEW_W } from "./level";
import { indexAt, line, quad, type Pt } from "./path";

export const STEP = 1 / 120;
export const GRAVITY = 1500;
export const rad = (deg: number) => (deg * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (k: number) => Math.min(1, Math.max(0, k));
/** 0 until `t0`, 1 from `t1` on, a straight line in between. */
export const seg = (t: number, t0: number, t1: number) => clamp01((t - t0) / (t1 - t0));
export const easeIn = (k: number) => k * k;
export const easeOut = (k: number) => 1 - (1 - k) * (1 - k);
export const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k));

/** A jump from `a` to `b` that rises `h` above the straight line between them; `k` goes from 0 to 1. */
export function hop(a: Pt, b: Pt, h: number, k: number): Pt {
  return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) - 4 * h * k * (1 - k) };
}

/** `p` turned by `angle` radians around `c`. */
export function turn(p: Pt, c: Pt, angle: number): Pt {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: c.x + (p.x - c.x) * cos - (p.y - c.y) * sin, y: c.y + (p.x - c.x) * sin + (p.y - c.y) * cos };
}

export interface Path {
  pts: Pt[];
  /** Distance along the path at every point. */
  s: number[];
  total: number;
}

export function pathOf(...pieces: Pt[][]): Path {
  const pts: Pt[] = [];
  const s: number[] = [];
  let total = 0;
  for (const p of pieces.flat()) {
    const last = pts[pts.length - 1];
    if (last) {
      const d = Math.hypot(p.x - last.x, p.y - last.y);
      if (d < 0.01) continue;
      total += d;
    }
    pts.push(p);
    s.push(total);
  }
  return { pts, s, total };
}

/** Spot, heading (radians) and downhill slope (dy/ds) at distance `d` along the path. */
export function along(path: Path, d: number) {
  const i = Math.min(indexAt(path, d), path.pts.length - 2);
  const a = path.pts[i];
  const b = path.pts[i + 1];
  const len = path.s[i + 1] - path.s[i] || 1;
  const k = clamp01((d - path.s[i]) / len);
  return { pt: { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) }, angle: Math.atan2(b.y - a.y, b.x - a.x), slope: (b.y - a.y) / len };
}

/** Straight lines through `corners`, each inner corner rounded off `r` before and after it. */
export function rounded(corners: Pt[], r: number): Pt[] {
  const toward = (p: Pt, q: Pt) => {
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    return { x: p.x + ((q.x - p.x) * r) / len, y: p.y + ((q.y - p.y) * r) / len };
  };
  const out: Pt[] = [corners[0]];
  for (let i = 1; i < corners.length - 1; i++) {
    const before = toward(corners[i], corners[i - 1]);
    out.push(...line(out[out.length - 1], before).slice(1), ...quad(before, corners[i], toward(corners[i], corners[i + 1])).slice(1));
  }
  out.push(...line(out[out.length - 1], corners[corners.length - 1]).slice(1));
  return out;
}

/** Points `off` to the right of the way along `pts` (below it, for a way going right): where a rail or track goes. */
export function beside(pts: Pt[], off: number): Pt[] {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { x: p.x - ((b.y - a.y) * off) / len, y: p.y + ((b.x - a.x) * off) / len };
  });
}

/** An SVG path through the points. */
export const svgLine = (pts: Pt[]) => `M${pts.map((p) => `${p.x} ${p.y}`).join(" L")}`;

/** Something moving along a path: its distance at every 1/120 s. */
export interface Run {
  path: Path;
  d: number[];
  duration: number;
}

/**
 * Rolling along the path from speed `v0`: faster downhill, slower uphill, a
 * little friction, never below `min`. `pull` weakens gravity where a real toy
 * would come to a stop too soon.
 */
export function roll(path: Path, v0: number, min: number, max: number, friction = 0.3, pull = (_d: number) => 1): Run {
  const d = [0];
  let s = 0;
  let v = v0;
  while (s < path.total) {
    v = Math.min(max, Math.max(min, v + (GRAVITY * pull(s) * along(path, s).slope - friction * v) * STEP));
    s = Math.min(path.total, s + v * STEP);
    d.push(s);
  }
  return { path, d, duration: (d.length - 1) * STEP };
}

/** Along the path at one speed. */
export function steady(path: Path, speed: number): Run {
  const n = Math.ceil(path.total / speed / STEP);
  return { path, d: Array.from({ length: n + 1 }, (_, i) => Math.min(path.total, i * speed * STEP)), duration: n * STEP };
}

/** Distance along the run `t` seconds after it started. */
export function distAt(run: Run, t: number) {
  const k = Math.min(run.d.length - 1, Math.max(0, t / STEP));
  const i = Math.min(Math.floor(k), run.d.length - 2);
  return lerp(run.d[i], run.d[i + 1], k - i);
}

/** Seconds into the run when it first gets to a spot where `reached` holds. */
export function timeWhen(run: Run, reached: (pt: Pt, d: number) => boolean) {
  const i = run.d.findIndex((d) => reached(along(run.path, d).pt, d));
  return i < 0 ? run.duration : i * STEP;
}

/** Runs one after the other, starting at `t0`: where the thing is at a moment, and when it gets to the end. */
export function chain(t0: number, runs: Run[]) {
  const starts: number[] = [];
  let t = t0;
  for (const run of runs) {
    starts.push(t);
    t += run.duration;
  }
  const at = (time: number): Pt => {
    for (let i = runs.length - 1; i >= 0; i--) {
      if (time >= starts[i]) return along(runs[i].path, distAt(runs[i], time - starts[i])).pt;
    }
    return runs[0].path.pts[0];
  };
  return { starts, end: t, at };
}

/** Something that happens at a moment: a sound, a line to say, or the end. */
export interface MachineEvent {
  at: number;
  sound?: () => void;
  /** Said in the app language when speech is on. */
  say?: Localized;
  done?: boolean;
}

/** A list of moments to fill with `at(seconds, …)`; `sorted()` hands them over in order. */
export function timeline() {
  const events: MachineEvent[] = [];
  return {
    events,
    at: (t: number, e: Omit<MachineEvent, "at">) => events.push({ at: t, ...e }),
    sorted: () => events.sort((a, b) => a.at - b.at),
  };
}

/** The camera's left edge for looking at `x`: a little left of the middle, never past the ends of the world. */
export const cameraOn = (worldW: number, x: number) => Math.min(worldW - VIEW_W, Math.max(0, x - VIEW_W * 0.42));
