import { useId, useMemo, useRef } from "react";
import { BRIGHT_COLORS } from "@/components/Bursts";
import { playBoing, playCountNote, playDing, playPlop, playPop, playSwirl, playTick } from "@/lib/sfx";
import { useAnyKey, useFrames, VIEW_H, VIEW_W, wobble, type LevelProps } from "./level";
import {
  BALL_R,
  BARS,
  BASKET,
  BASKET_FULL,
  BASKET_SLOTS,
  BELL,
  buildRoute,
  FUNNEL,
  HOPPER,
  pointAt,
  ROW1,
  row1Y,
  ROW2,
  ROW2B,
  ROW3,
  SEESAW,
  seesawSpot,
  TUNNEL,
  WHEEL,
  type Pt,
  type TrackEvent,
} from "./track";

const GRAVITY = 1600;
const FRICTION = 0.3;
const MIN_SPEED = 280;
const MAX_SPEED = 950;
/** Taps closer together than this release only one marble, so they don't start on top of each other. */
const SPAWN_GAP_MS = 450;
const MAX_ROLLING = 8;
const LAND_MS = 380;

export const BAR_COLORS = ["#ff5d73", "#ff8c42", "#ffb703", "#3ec300", "#00b4d8", "#3a86ff", "#8e7dff", "#ff7bd0"];
const INK = "#2a1e5c";

interface Marble {
  id: number;
  color: string;
  /** Distance along the route. */
  s: number;
  v: number;
  /** The next event on the route this marble will fire. */
  next: number;
  /** Rolling turn in radians, for the stripe on the marble. */
  spin: number;
  x: number;
  y: number;
}

interface Landed {
  id: number;
  color: string;
  from: Pt;
  to: Pt;
  at: number;
}

/**
 * Level 1: a wooden marble run on the wall. Each tap lets a marble out of the
 * hopper; it rolls over a xylophone, rings the bell, runs round the funnel,
 * rides the paddle wheel and the seesaw, disappears in the tunnel and drops
 * into the basket. Several marbles may be on their way at once; a full basket
 * ends the level.
 */
export function TrackLevel({ sound, say, onDone }: LevelProps) {
  const route = useMemo(buildRoute, []);
  const marbles = useRef<Marble[]>([]);
  const landed = useRef<Landed[]>([]);
  const nextId = useRef(0);
  const lastSpawn = useRef(-Infinity);
  const hits = useRef({ bell: -Infinity, bars: BARS.map(() => -Infinity) });
  const wheel = useRef({ angle: 0, spin: 0 });
  const tilt = useRef(SEESAW.rest);
  const done = useRef(false);
  const now = useRef(performance.now());
  const pegs = useId();

  const zoneAt = (s: number) => route.zones.find((z) => s >= z.s0 && s < z.s1);

  const fire = (event: TrackEvent, t: number) => {
    switch (event.kind) {
      case "note":
        hits.current.bars[event.bar] = t;
        sound(() => playCountNote(event.bar));
        break;
      case "bell":
        hits.current.bell = t;
        sound(playDing);
        break;
      case "swirl":
        sound(playSwirl);
        break;
      case "wheel":
        sound(playTick);
        break;
      case "seesaw":
        sound(playBoing);
        break;
      case "basket":
        break;
    }
  };

  const land = (m: Marble, t: number) => {
    const slot = Math.min(landed.current.length, BASKET_SLOTS.length - 1);
    landed.current.push({ id: m.id, color: m.color, from: { x: m.x, y: m.y }, to: BASKET_SLOTS[slot], at: t });
    sound(playPlop);
    if (!done.current && landed.current.length >= BASKET_FULL) {
      done.current = true;
      say("Der Korb ist voll!");
      onDone();
    }
  };

  useFrames((dt, t) => {
    now.current = t;
    let onWheel = false;
    let onSeesaw = false;
    for (const m of marbles.current) {
      const zone = zoneAt(m.s);
      if (zone?.speed) m.v = zone.speed;
      else {
        const { slope } = pointAt(route, m.s);
        m.v = Math.min(MAX_SPEED, Math.max(MIN_SPEED, m.v + (GRAVITY * slope - FRICTION * m.v) * dt));
      }
      m.s += m.v * dt;
      while (m.next < route.events.length && route.events[m.next].s <= m.s) fire(route.events[m.next++].event, t);
      const here = zoneAt(m.s);
      const pt = here?.seesaw ? seesawSpot((m.s - here.s0) / (here.s1 - here.s0), tilt.current) : pointAt(route, m.s).pt;
      if (here?.seesaw) onSeesaw = true;
      else if (here?.kind === "wheel") onWheel = true;
      m.spin += (pt.x - m.x) / BALL_R;
      m.x = pt.x;
      m.y = pt.y;
    }
    const arrived = marbles.current.filter((m) => m.s >= route.total);
    if (arrived.length) {
      marbles.current = marbles.current.filter((m) => m.s < route.total);
      arrived.forEach((m) => land(m, t));
    }
    // The wheel turns while a marble rides it, then slowly stops; the seesaw tips under a marble and swings back.
    const w = wheel.current;
    w.spin = onWheel ? -170 / WHEEL.path : w.spin * Math.exp(-dt * 1.2);
    w.angle += w.spin * dt;
    const target = onSeesaw ? SEESAW.tipped : SEESAW.rest;
    tilt.current += (target - tilt.current) * Math.min(1, dt * (onSeesaw ? 10 : 4));
  });

  const release = () => {
    const t = performance.now();
    if (done.current || t - lastSpawn.current < SPAWN_GAP_MS || marbles.current.length >= MAX_ROLLING) return;
    lastSpawn.current = t;
    const id = nextId.current++;
    marbles.current.push({ id, color: BRIGHT_COLORS[id % BRIGHT_COLORS.length], s: 0, v: 0, next: 0, spin: 0, x: HOPPER.x, y: HOPPER.y });
    sound(playPop);
  };

  useAnyKey(release);

  const t = now.current;
  const bellAngle = wobble((t - hits.current.bell) / 1000, 24, 13, 2.2);
  const started = nextId.current > 0;

  return (
    <div className="marble-level" onPointerDown={release}>
      <svg className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label="Kugelbahn">
        <defs>
          <pattern id={pegs} width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="4.5" fill="#d7ac72" />
          </pattern>
        </defs>
        <rect x="-400" y="-200" width={VIEW_W + 800} height={VIEW_H + 400} fill="#f3d5a4" />
        <rect x="-400" y="-200" width={VIEW_W + 800} height={VIEW_H + 400} fill={`url(#${pegs})`} />

        {/* Row 1 with the xylophone */}
        <Rail a={{ x: ROW1.from.x - 24, y: row1Y(ROW1.from.x - 24) }} b={{ x: BARS[0].x - 4, y: row1Y(BARS[0].x - 4) }} />
        <line
          x1={BARS[0].x - 6}
          y1={row1Y(BARS[0].x) + BALL_R + 26}
          x2={BARS[7].x + BARS[7].w + 6}
          y2={row1Y(BARS[7].x + BARS[7].w) + BALL_R + 26}
          stroke="#8a5a2b"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {BARS.map((bar, i) => {
          const age = (t - hits.current.bars[i]) / 1000;
          const cx = bar.x + bar.w / 2;
          const dip = age >= 0 && age < 1 ? 5 * Math.exp(-age * 10) : 0;
          const slope = (Math.atan2(ROW1.to.y - ROW1.from.y, ROW1.to.x - ROW1.from.x) * 180) / Math.PI;
          return (
            <g key={i} transform={`translate(${cx} ${row1Y(cx) + BALL_R + 9 + dip}) rotate(${slope})`}>
              <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill={BAR_COLORS[i]} stroke={INK} strokeWidth="3" />
              <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill="#fff" opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 6) : 0} />
              <circle cx={-bar.w / 2 + 10} cy="0" r="3" fill="#fff8" />
              <circle cx={bar.w / 2 - 10} cy="0" r="3" fill="#fff8" />
            </g>
          );
        })}
        <Rail a={{ x: BARS[7].x + BARS[7].w + 4, y: row1Y(BARS[7].x + BARS[7].w + 4) }} b={{ x: 1474, y: row1Y(1474) }} />

        {/* Post and arm the bell hangs from */}
        <rect x="1572" y="96" width="18" height="170" rx="6" fill="#b8763d" stroke={INK} strokeWidth="3" />
        <line x1={BELL.pivot.x} y1={BELL.pivot.y} x2="1576" y2={BELL.pivot.y} stroke={INK} strokeWidth="6" strokeLinecap="round" />

        {/* Inside of the funnel */}
        <ellipse cx={FUNNEL.cx} cy={FUNNEL.rimY} rx={FUNNEL.rx} ry={FUNNEL.ry} fill="#1b8fc4" opacity="0.45" />

        {/* Row 2 and the paddle wheel */}
        <Rail a={{ x: 1460, y: ROW2.from.y - 1 }} b={ROW2.to} />
        <PaddleWheel angle={wheel.current.angle} />
        <Rail a={{ x: ROW2B.from.x + 12, y: ROW2B.from.y - 1 }} b={ROW2B.to} />

        {/* Seesaw */}
        <path d={`M${SEESAW.cx} ${SEESAW.cy} L${SEESAW.cx - 34} ${SEESAW.cy + 62} L${SEESAW.cx + 34} ${SEESAW.cy + 62} Z`} fill="#8a5a2b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <g transform={`translate(${SEESAW.cx} ${SEESAW.cy}) rotate(${tilt.current})`}>
          <rect x={-SEESAW.half} y="-7" width={SEESAW.half * 2} height="14" rx="7" fill="#ffb703" stroke={INK} strokeWidth="3" />
          <rect x={-SEESAW.half + 6} y="-33" width="30" height="26" rx="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
        </g>
        <circle cx={SEESAW.cx} cy={SEESAW.cy} r="6" fill={INK} />

        {/* Row 3 and the back of the basket */}
        <Rail a={{ x: ROW3.from.x - 16, y: ROW3.from.y - 1 }} b={ROW3.to} />
        <ellipse cx={(BASKET.x0 + BASKET.x1) / 2} cy={BASKET.rimY} rx={(BASKET.x1 - BASKET.x0) / 2} ry="14" fill="#6b4220" />

        {landed.current.map((l) => {
          const k = Math.min(1, (t - l.at) / LAND_MS);
          const bounce = k < 1 ? 0 : wobble((t - l.at - LAND_MS) / 1000, 6, 20, 8);
          return <Ball key={l.id} color={l.color} x={l.from.x + (l.to.x - l.from.x) * k} y={l.from.y + (l.to.y - l.from.y) * k * k - Math.abs(bounce)} spin={0} />;
        })}
        {marbles.current.map((m) => (
          <Ball key={m.id} color={m.color} x={m.x} y={m.y} spin={m.spin} />
        ))}

        {/* In front of the marbles */}
        <Hopper />
        <g transform={`translate(${BELL.pivot.x} ${BELL.pivot.y}) rotate(${bellAngle})`}>
          <path d="M-4 0 L4 0 L5 12 C22 16 28 34 30 58 L34 64 L-34 64 L-30 58 C-28 34 -22 16 -5 12 Z" fill="#ffc93c" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M-18 28 C-16 22 -12 19 -8 18" stroke="#fff9" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="0" cy="70" r="7" fill="#c98a00" stroke={INK} strokeWidth="3" />
        </g>
        <Funnel />
        <Tunnel />
        <Basket />

        {!started && (
          <text className="marble-hint" x={HOPPER.x + 92} y={HOPPER.y + 96} fontSize="90" textAnchor="middle">
            👆
          </text>
        )}
      </svg>
    </div>
  );
}

/** A wooden rail just under the marbles' path from `a` to `b`, with a peg at each end. */
export function Rail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke="#d08c4b" strokeWidth="12" strokeLinecap="round" />
      <circle cx={a.x + 14} cy={a.y + off + 1} r="3" fill="#8a5a2b" />
      <circle cx={b.x - 14} cy={b.y + off + 1} r="3" fill="#8a5a2b" />
    </g>
  );
}

export function Ball({ color, x, y, spin }: { color: string; x: number; y: number; spin: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={BALL_R} fill={color} stroke={INK} strokeWidth="3" />
      <path d={`M${-BALL_R + 4} 0 A${BALL_R - 4} ${BALL_R - 4} 0 0 0 ${BALL_R - 4} 0`} transform={`rotate(${(spin * 180) / Math.PI})`} fill="none" stroke="#fff6" strokeWidth="5" />
      <circle cx="-7" cy="-8" r="5.5" fill="#fff" opacity="0.75" />
    </g>
  );
}

function Hopper() {
  return (
    <g>
      <path d={`M${HOPPER.x - 58} -10 L${HOPPER.x + 58} -10 L${HOPPER.x + 28} 62 L${HOPPER.x - 28} 62 Z`} fill="#8e7dff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${HOPPER.x - 36} 8 L${HOPPER.x + 36} 8`} stroke="#fff8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function PaddleWheel({ angle }: { angle: number }) {
  const deg = (angle * 180) / Math.PI;
  return (
    <g transform={`translate(${WHEEL.cx} ${WHEEL.cy})`}>
      <circle r={WHEEL.r} fill="#bde9ff88" stroke={INK} strokeWidth="4" />
      <g transform={`rotate(${deg})`}>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <line x1="14" y1="0" x2={WHEEL.r - 4} y2="0" stroke="#3a86ff" strokeWidth="9" strokeLinecap="round" />
            <rect x={WHEEL.r - 30} y="-5" width="26" height="22" rx="4" fill="#00b4d8" stroke={INK} strokeWidth="2.5" />
          </g>
        ))}
      </g>
      <circle r="18" fill="#ffb703" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Funnel() {
  const { cx, rimY, rx, ry, spoutY, spoutW } = FUNNEL;
  const half = spoutW / 2;
  return (
    <g>
      <path
        d={`M${cx - rx} ${rimY} A${rx} ${ry} 0 0 0 ${cx + rx} ${rimY} L${cx + half} ${spoutY - 24} L${cx + half} ${spoutY + 12} L${cx - half} ${spoutY + 12} L${cx - half} ${spoutY - 24} Z`}
        fill="#4cc9f0"
        opacity="0.38"
      />
      <path
        d={`M${cx - rx} ${rimY} L${cx - half} ${spoutY - 24} L${cx - half} ${spoutY + 12} L${cx + half} ${spoutY + 12} L${cx + half} ${spoutY - 24} L${cx + rx} ${rimY}`}
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx={cx} cy={rimY} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth="4" />
      <path d={`M${cx - rx + 28} ${rimY + 26} L${cx - half - 4} ${spoutY - 30}`} stroke="#fffa" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Tunnel() {
  const { x0, x1 } = TUNNEL;
  const y = (x: number) => ROW3.from.y + ((x - ROW3.from.x) * (ROW3.to.y - ROW3.from.y)) / (ROW3.to.x - ROW3.from.x);
  const top0 = y(x0) - 52;
  const top1 = y(x1) - 52;
  const base0 = y(x0) + BALL_R + 16;
  const base1 = y(x1) + BALL_R + 16;
  return (
    <g>
      <path
        d={`M${x0} ${base0} L${x0} ${top0 + 26} Q${x0} ${top0} ${x0 + 26} ${top0} L${x1 - 26} ${top1} Q${x1} ${top1} ${x1} ${top1 + 26} L${x1} ${base1} Z`}
        fill="#3ec300"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0.25, 0.5, 0.75].map((k) => {
        const x = x0 + (x1 - x0) * k;
        return <line key={k} x1={x} y1={y(x) - 52} x2={x} y2={y(x) + BALL_R + 16} stroke="#2a9100" strokeWidth="6" />;
      })}
    </g>
  );
}

function Basket() {
  const { x0, x1, rimY, bottomY } = BASKET;
  return (
    <g>
      <path d={`M${x0} ${rimY} L${x1} ${rimY} L${x1 - 14} ${bottomY} L${x0 + 14} ${bottomY} Z`} fill="#c98a4b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {[0, 1, 2].map((i) => {
        const yy = rimY + 14 + i * 15;
        return <line key={i} x1={x0 + 6} y1={yy} x2={x1 - 6} y2={yy} stroke="#9b6330" strokeWidth="4" />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const xx = x0 + 24 + i * 23;
        return <line key={i} x1={xx} y1={rimY + 4} x2={xx + (xx < (x0 + x1) / 2 ? 3 : -3)} y2={bottomY - 4} stroke="#9b6330" strokeWidth="3" />;
      })}
      <rect x={x0 - 8} y={rimY - 8} width={x1 - x0 + 16} height="16" rx="8" fill="#e0a868" stroke={INK} strokeWidth="4" />
    </g>
  );
}
