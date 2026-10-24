import { useId, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { BRIGHT_COLORS } from "@/components/Bursts";
import {
  playBells,
  playBlub,
  playBoing,
  playCountNote,
  playDeepNote,
  playDing,
  playKnock,
  playPlop,
  playPop,
  playRumble,
  playSwirl,
  playThump,
  playTick,
} from "@/lib/sfx";
import { useAnyKey, useFrames, VIEW_H, VIEW_W, wobble, type LevelProps } from "./level";
import {
  BALL_R,
  BARS,
  BASKET,
  BASKET_FULL,
  BASKET_SLOTS,
  bellIn,
  buildRoutes,
  DEFAULT_BUILD,
  funnelIn,
  HOPPER,
  LEDGE,
  PIECES,
  pointAt,
  ROW1A,
  ROW1B,
  ROW2,
  ROW2B,
  ROLLER,
  ROLLERS,
  ROW3,
  rowY,
  SEESAW,
  seesawSpot,
  SHELF,
  shelfSpot,
  slotBoard,
  slotMiddle,
  SLOTS,
  trampolineIn,
  TUNNEL,
  WALL,
  wheelIn,
  type Piece,
  type Pt,
  type Roller,
  type Route,
  type Row,
  type Slot,
  type TrackEvent,
} from "./track";

const GRAVITY = 1600;
const FRICTION = 0.3;
const MIN_SPEED = 280;
const MAX_SPEED = 950;
/** After the tap the hopper lets out one marble after the other, this far apart. */
const RELEASE_GAP_MS = 1400;
const LAND_MS = 380;
/** The flag springs up out of the full basket; then the level is done. */
const FLAG_MS = 500;
const DONE_AFTER_FULL_MS = 2200;
/** A thing picked from the shelf flies into the hopper first. */
const FLY_MS = 380;
/** A new thing pops up on the shelf this long after one was taken. */
const REFILL_MS = 250;
/** The soap bubble's even speed, before its pace. */
const FLOAT_SPEED = 330;
/** The tennis ball's hops on the rows: how high, and how far apart. */
const HOP_H = 34;
const HOP_LEN = 130;
/** The soap bubble bursts above the basket. */
const POP_MS = 600;
/** Sections of the run: a fixed one before every spot, the spot, and the fixed one to the basket. */
const LAST_SECTION = SLOTS.length * 2;

export const BAR_COLORS = ["#ff5d73", "#ff8c42", "#ffb703", "#3ec300", "#00b4d8", "#3a86ff", "#8e7dff", "#ff7bd0"];
const INK = "#2a1e5c";

/** What each thing sounds like as it goes into the hopper. */
const RELEASE_SOUND: Record<Roller, () => void> = {
  marble: playPop,
  tennis: playBoing,
  iron: playRumble,
  apple: () => playKnock(480),
  bubble: playBlub,
};

/**
 * How far above its path a thing is drawn: bigger things sit higher on the
 * rail, the tennis ball hops along the rows, the apple bumps a little because
 * it isn't round, and the soap bubble floats over the rail, bobbing.
 */
function lift(m: Marble, t: number): number {
  const sit = ROLLER[m.kind].r - BALL_R;
  switch (m.kind) {
    case "tennis":
      return sit + HOP_H * m.hop * Math.abs(Math.sin((m.dist * Math.PI) / HOP_LEN));
    case "apple":
      return sit + 4 * Math.abs(Math.sin(m.spin));
    case "bubble":
      return sit + 14 + 6 * Math.sin(t / 260);
    default:
      return sit;
  }
}

/** The parts in the spots, kept from one round to the next while the game is open. */
let keptBuild = DEFAULT_BUILD;

interface Marble {
  id: number;
  /** What it is; without the shelf always a marble. */
  kind: Roller;
  color: string;
  /** Picked from the shelf: it flies from there into the hopper, starting at `at`. */
  fly: { from: Pt; at: number } | null;
  /** Distance rolled in all, for the tennis ball's hops. */
  dist: number;
  /** How much the tennis ball hops just now (0–1): on the rows, not in the parts. */
  hop: number;
  /** Which section of the run it is on: even ones are fixed, odd ones are the spots. */
  section: number;
  /** The part in the spot it is passing through, taken when it got there. */
  piece: Piece;
  /** Distance along the section. */
  s: number;
  v: number;
  /** The next event in the section this marble will fire. */
  next: number;
  /** Rolling turn in radians, for the stripe on the marble. */
  spin: number;
  x: number;
  y: number;
}

interface Landed {
  id: number;
  kind: Roller;
  color: string;
  from: Pt;
  to: Pt;
  at: number;
}

/** What moves in a spot: when its part was last hit and swapped, and how its wheel turns. */
interface SpotState {
  hit: number;
  swapped: number;
  angle: number;
  spin: number;
  /** A part tapped in while a marble was inside; it goes in as soon as the marble is out. */
  pending: Piece | null;
}

/**
 * A wooden marble run on the wall. One tap opens the hopper, and the marbles
 * come out one after the other by themselves: each rolls over a xylophone,
 * through three spots that hold a bell, a funnel and a paddle wheel, rides the
 * seesaw, disappears in the tunnel and drops into the basket. When the basket
 * is full a flag springs up out of it. If the grown-ups allow it, tapping a
 * spot swaps its part (bell, trampoline, funnel, paddle wheel), and the next
 * marble takes the new way.
 *
 * With `pick` (K-07) nothing comes out by itself: three big things lie on a
 * shelf over the first row, and tapping one lets out just that one. Each rolls
 * its own way – the tennis ball hops, the iron ball rumbles slowly with deep
 * notes, the soap bubble floats and bursts above the basket.
 */
export function TrackLevel({ sound, say, onDone, rebuild, pick }: LevelProps) {
  const routes = useMemo(buildRoutes, []);
  const build = useRef<Piece[]>(rebuild ? [...keptBuild] : [...DEFAULT_BUILD]);
  const spots = useRef<SpotState[]>(SLOTS.map(() => ({ hit: -Infinity, swapped: -Infinity, angle: 0, spin: 0, pending: null })));
  const marbles = useRef<Marble[]>([]);
  const landed = useRef<Landed[]>([]);
  const nextId = useRef(0);
  /** When the tap opened the hopper. */
  const openedAt = useRef<number | null>(null);
  const fullAt = useRef(-Infinity);
  const bars = useRef(BARS.map(() => -Infinity));
  const tilt = useRef(SEESAW.rest);
  const done = useRef(false);
  const now = useRef(performance.now());
  /** The three things on the shelf, when each was put there, and which a key or a tap on the wall lets out next. */
  const [firstShelf] = useState(() => [...ROLLERS].sort(() => Math.random() - 0.5).slice(0, SHELF.things.length));
  const shelf = useRef(firstShelf);
  const filled = useRef(SHELF.things.map(() => -Infinity));
  const turn = useRef(0);
  const pops = useRef<{ id: number; x: number; y: number; at: number }[]>([]);
  const pegs = useId();

  const routeOf = (m: Marble): Route => (m.section % 2 ? routes.pieces[(m.section - 1) / 2][m.piece] : routes.fixed[m.section / 2]);
  const zoneAt = (route: Route, s: number) => route.zones.find((z) => s >= z.s0 && s < z.s1);

  const fire = (event: TrackEvent, t: number, kind: Roller) => {
    switch (event.kind) {
      case "note":
        bars.current[event.bar] = t;
        sound(() => (kind === "iron" ? playDeepNote(event.bar) : playCountNote(event.bar)));
        break;
      case "bell":
        spots.current[event.slot].hit = t;
        sound(playDing);
        break;
      case "trampoline":
        spots.current[event.slot].hit = t;
        sound(playBoing);
        break;
      case "funnel":
        sound(playSwirl);
        break;
      case "wheel":
        sound(playTick);
        break;
      case "seesaw":
        sound(kind === "iron" ? playThump : playBoing);
        break;
      case "basket":
        break;
    }
  };

  const land = (m: Marble, t: number) => {
    const slot = Math.min(landed.current.length, BASKET_SLOTS.length - 1);
    landed.current.push({ id: m.id, kind: m.kind, color: m.color, from: { x: m.x, y: m.y }, to: BASKET_SLOTS[slot], at: t });
    sound(m.kind === "iron" ? playThump : playPlop);
    if (!done.current && landed.current.length >= BASKET_FULL) {
      done.current = true;
      fullAt.current = t;
      sound(playBells);
      say("Der Korb ist voll!");
      setTimeout(onDone, DONE_AFTER_FULL_MS);
    }
  };

  const busy = (i: number) => marbles.current.some((m) => m.section === i * 2 + 1);

  const put = (i: number, piece: Piece, t: number) => {
    build.current[i] = piece;
    keptBuild = [...build.current];
    Object.assign(spots.current[i], { pending: null, swapped: t, hit: -Infinity, angle: 0, spin: 0 });
    sound(() => playKnock(520));
  };

  /** A tap on a spot: the next part in turn goes in, or waits until the marble inside has rolled out. */
  const swap = (i: number, e: PointerEvent) => {
    if (done.current) return;
    e.stopPropagation();
    const spot = spots.current[i];
    const next = PIECES[(PIECES.indexOf(spot.pending ?? build.current[i]) + 1) % PIECES.length];
    if (busy(i)) spot.pending = next;
    else put(i, next, performance.now());
  };

  useFrames((dt, t) => {
    now.current = t;
    if (!pick && openedAt.current !== null && nextId.current < BASKET_FULL && t - openedAt.current >= nextId.current * RELEASE_GAP_MS) release("marble");
    const onWheel = SLOTS.map(() => false);
    let onSeesaw = false;
    for (const m of marbles.current) {
      if (m.fly) {
        const k = (t - m.fly.at) / FLY_MS;
        if (k < 1) {
          // Up out of the shelf and over into the hopper.
          m.x = m.fly.from.x + (HOPPER.x - m.fly.from.x) * k;
          m.y = m.fly.from.y + (HOPPER.y - m.fly.from.y) * k - 90 * Math.sin(Math.PI * k);
          continue;
        }
        m.fly = null;
      }
      const kind = ROLLER[m.kind];
      const zone = zoneAt(routeOf(m), m.s);
      if (zone?.speed) m.v = zone.speed;
      else if (kind.float) m.v = FLOAT_SPEED;
      else {
        const { slope } = pointAt(routeOf(m), m.s);
        m.v = Math.min(MAX_SPEED, Math.max(MIN_SPEED, m.v + (GRAVITY * slope - FRICTION * m.v) * dt));
      }
      m.s += m.v * kind.pace * dt;
      m.dist += m.v * kind.pace * dt;
      // Fire what it passed; at the end of a section go on to the next one, taking the part that is in the spot now.
      for (;;) {
        const route = routeOf(m);
        while (m.next < route.events.length && route.events[m.next].s <= m.s) fire(route.events[m.next++].event, t, m.kind);
        if (m.s < route.total || m.section === LAST_SECTION) break;
        m.s -= route.total;
        m.section++;
        m.next = 0;
        if (m.section % 2) m.piece = build.current[(m.section - 1) / 2];
      }
      const route = routeOf(m);
      const here = zoneAt(route, m.s);
      const pt = here?.seesaw ? seesawSpot((m.s - here.s0) / (here.s1 - here.s0), tilt.current) : pointAt(route, m.s).pt;
      if (here?.seesaw) onSeesaw = true;
      else if (here?.kind === "wheel") onWheel[(m.section - 1) / 2] = true;
      m.hop += ((!here && m.section % 2 === 0 ? 1 : 0) - m.hop) * Math.min(1, dt * 10);
      m.spin += (pt.x - m.x) / kind.r;
      m.x = pt.x;
      m.y = pt.y - lift(m, t);
    }
    const arrived = marbles.current.filter((m) => m.section === LAST_SECTION && m.s >= routes.fixed[SLOTS.length].total);
    if (arrived.length) {
      marbles.current = marbles.current.filter((m) => !arrived.includes(m));
      arrived.forEach((m) => {
        // The soap bubble doesn't land: "Plopp", and it is gone.
        if (m.kind === "bubble") {
          pops.current.push({ id: m.id, x: m.x, y: m.y, at: t });
          sound(playPop);
        } else land(m, t);
      });
    }
    pops.current = pops.current.filter((p) => t - p.at < POP_MS);
    spots.current.forEach((spot, i) => {
      if (spot.pending && !busy(i)) put(i, spot.pending, t);
      // A wheel turns while a marble rides it, then slowly stops.
      const w = wheelIn(SLOTS[i]);
      spot.spin = onWheel[i] ? (SLOTS[i].dir * 170) / w.path : spot.spin * Math.exp(-dt * 1.2);
      spot.angle += spot.spin * dt;
    });
    // The seesaw tips under a marble and swings back.
    const target = onSeesaw ? SEESAW.tipped : SEESAW.rest;
    tilt.current += (target - tilt.current) * Math.min(1, dt * (onSeesaw ? 10 : 4));
  });

  /** Lets a thing into the run at the hopper, or first flies it there from the shelf. */
  const release = (kind: Roller, from?: Pt) => {
    const id = nextId.current++;
    const start = from ?? HOPPER;
    marbles.current.push({
      id,
      kind,
      color: BRIGHT_COLORS[id % BRIGHT_COLORS.length],
      fly: from ? { from, at: performance.now() } : null,
      dist: 0,
      hop: 0,
      section: 0,
      piece: build.current[0],
      s: 0,
      v: 0,
      next: 0,
      spin: 0,
      x: start.x,
      y: start.y,
    });
    sound(RELEASE_SOUND[kind]);
  };

  /** The i-th thing on the shelf goes into the hopper, and something else pops up in its place. */
  const take = (i: number) => {
    if (done.current) return;
    release(shelf.current[i], shelfSpot(i, shelf.current[i]));
    const others = shelf.current.filter((_, j) => j !== i);
    const choices = ROLLERS.filter((r) => r !== shelf.current[i] && !others.includes(r));
    shelf.current[i] = choices[Math.floor(Math.random() * choices.length)];
    filled.current[i] = performance.now();
  };

  /** A key or a tap on the wall: the hopper opens, or with the shelf the next thing on it goes in turn. */
  const open = () => {
    if (pick) take(turn.current++ % SHELF.things.length);
    else if (openedAt.current === null) openedAt.current = performance.now();
  };

  useAnyKey(open);

  const t = now.current;
  const started = pick ? nextId.current > 0 : openedAt.current !== null;
  const flagAge = t - fullAt.current;
  const spot = (i: number, layer: "back" | "front") => <Spot key={i} slot={SLOTS[i]} piece={build.current[i]} state={spots.current[i]} t={t} layer={layer} />;

  return (
    <div className="marble-level" onPointerDown={open}>
      <svg className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label="Kugelbahn">
        <defs>
          <pattern id={pegs} width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="4.5" fill="#d7ac72" />
          </pattern>
        </defs>
        <rect x="-400" y="-200" width={VIEW_W + 800} height={VIEW_H + 400} fill="#f3d5a4" />
        <rect x="-400" y="-200" width={VIEW_W + 800} height={VIEW_H + 400} fill={`url(#${pegs})`} />

        {/* The boards the spots sit on, if they may be rebuilt */}
        {rebuild && SLOTS.map((slot, i) => <SpotBoard key={i} slot={slot} />)}

        {/* Rows 1a and 1b with the xylophone */}
        <Xylophone row={ROW1A} hits={bars.current} t={t} />
        <Xylophone row={ROW1B} hits={bars.current} t={t} />

        {/* The ledge and the wall the marble turns at, row 2 */}
        <Rail a={{ x: LEDGE.x0, y: LEDGE.y }} b={{ x: LEDGE.x1, y: LEDGE.y }} />
        <rect x={WALL.x} y={WALL.top} width="18" height={WALL.bottom - WALL.top} rx="6" fill="#b8763d" stroke={INK} strokeWidth="3" />
        <Rail a={{ x: ROW2.from.x + 10, y: ROW2.from.y - 1 }} b={ROW2.to} />
        <Rail a={{ x: ROW2B.from.x + 12, y: ROW2B.from.y - 1 }} b={ROW2B.to} />

        {SLOTS.map((_, i) => spot(i, "back"))}

        {/* Seesaw */}
        <path
          d={`M${SEESAW.cx} ${SEESAW.cy} L${SEESAW.cx - 34} ${SEESAW.cy + 62} L${SEESAW.cx + 34} ${SEESAW.cy + 62} Z`}
          fill="#8a5a2b"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <g transform={`translate(${SEESAW.cx} ${SEESAW.cy}) rotate(${tilt.current})`}>
          <rect x={-SEESAW.half} y="-7" width={SEESAW.half * 2} height="14" rx="7" fill="#ffb703" stroke={INK} strokeWidth="3" />
          <rect x={-SEESAW.half + 6} y="-33" width="30" height="26" rx="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
        </g>
        <circle cx={SEESAW.cx} cy={SEESAW.cy} r="6" fill={INK} />

        {/* Row 3 and the back of the basket */}
        <Rail a={{ x: ROW3.from.x - 16, y: ROW3.from.y - 1 }} b={ROW3.to} />
        <ellipse cx={(BASKET.x0 + BASKET.x1) / 2} cy={BASKET.rimY} rx={(BASKET.x1 - BASKET.x0) / 2} ry="14" fill="#6b4220" />
        {done.current && <Flag rise={Math.min(1, flagAge / FLAG_MS)} sway={wobble(flagAge / 1000, 10, 9, 1.5)} />}

        {landed.current.map((l) => {
          const k = Math.min(1, (t - l.at) / LAND_MS);
          const bounce = k < 1 ? 0 : wobble((t - l.at - LAND_MS) / 1000, 6, 20, 8);
          const x = l.from.x + (l.to.x - l.from.x) * k;
          const y = l.from.y + (l.to.y - l.from.y) * k * k - Math.abs(bounce) - (ROLLER[l.kind].r - BALL_R);
          return <RollerBody key={l.id} kind={l.kind} color={l.color} x={x} y={y} spin={0} />;
        })}
        {marbles.current.map((m) => (
          <RollerBody
            key={m.id}
            kind={m.kind}
            color={m.color}
            x={m.x}
            y={m.y}
            spin={m.spin}
            scale={m.fly ? SHELF.scale - (SHELF.scale - 1) * Math.min(1, (t - m.fly.at) / FLY_MS) : 1}
          />
        ))}
        {pops.current.map((p) => (
          <BubblePop key={p.id} x={p.x} y={p.y} age={(t - p.at) / POP_MS} />
        ))}

        {/* In front of the marbles */}
        <Hopper />
        {SLOTS.map((_, i) => spot(i, "front"))}
        <Tunnel />
        <Basket />

        {/* Where a tap swaps the part: the whole board, with a wrench in the corner */}
        {rebuild &&
          SLOTS.map((slot, i) => {
            const b = slotBoard(slot);
            const pending = spots.current[i].pending;
            const wx = slot.dir > 0 ? b.x + b.w - 30 : b.x + 30;
            return (
              <g key={i} className="spot-tap" onPointerDown={(e) => swap(i, e)}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill="transparent" />
                <circle cx={wx} cy={b.y + 30} r="24" fill="#fff8e8" stroke="#c48a4d" strokeWidth="3" />
                <text x={wx} y={b.y + 41} fontSize="28" textAnchor="middle" className={pending ? "spot-wrench busy" : "spot-wrench"}>
                  🔧
                </text>
              </g>
            );
          })}

        {pick && <Shelf things={shelf.current} filled={filled.current} color={BRIGHT_COLORS[nextId.current % BRIGHT_COLORS.length]} t={t} onTake={take} />}

        {!started && (
          <text
            className="marble-hint"
            x={pick ? SHELF.things[1] + 40 : HOPPER.x + 92}
            y={pick ? SHELF.y + 100 : HOPPER.y + 96}
            fontSize="90"
            textAnchor="middle"
          >
            👆
          </text>
        )}
      </svg>
    </div>
  );
}

/** The slightly darker board a spot sits on, with a dashed edge: here something can be swapped. */
function SpotBoard({ slot }: { slot: Slot }) {
  const b = slotBoard(slot);
  return <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill="#e9c08a" stroke="#c48a4d" strokeWidth="4" strokeDasharray="14 10" />;
}

/** A thing on the run (or bigger by `scale`, on the shelf), its middle at `x`, `y`, turned by `spin` as it rolls. */
function RollerBody({ kind, color, x, y, spin, scale = 1 }: { kind: Roller; color: string; x: number; y: number; spin: number; scale?: number }) {
  const r = ROLLER[kind].r;
  const deg = (spin * 180) / Math.PI;
  let body: ReactNode;
  switch (kind) {
    case "marble":
      body = <Ball color={color} x={0} y={0} spin={spin} />;
      break;
    case "tennis":
      body = (
        <g>
          <circle r={r} fill="#d8ec3f" stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
            <path d={`M${-r * 0.62} ${-r * 0.78} Q${-r * 0.12} 0 ${-r * 0.62} ${r * 0.78}`} />
            <path d={`M${r * 0.62} ${-r * 0.78} Q${r * 0.12} 0 ${r * 0.62} ${r * 0.78}`} />
          </g>
          <circle cx={-r * 0.32} cy={-r * 0.38} r="4.5" fill="#fff" opacity="0.6" />
        </g>
      );
      break;
    case "iron":
      body = (
        <g>
          <circle r={r} fill="#5d6577" stroke={INK} strokeWidth="3.5" />
          <circle cx="3" cy="4" r={r - 6} fill="#4a5161" />
          <g transform={`rotate(${deg})`}>
            {[0, 120, 240].map((a) => (
              <circle key={a} cx={(r - 8) * Math.cos((a * Math.PI) / 180)} cy={(r - 8) * Math.sin((a * Math.PI) / 180)} r="2.8" fill="#2f3440" />
            ))}
          </g>
          <ellipse cx={-r * 0.35} cy={-r * 0.4} rx="7" ry="4.5" transform={`rotate(-35 ${-r * 0.35} ${-r * 0.4})`} fill="#fff" opacity="0.55" />
        </g>
      );
      break;
    case "apple":
      body = (
        <g>
          <g transform={`rotate(${deg})`}>
            <path
              d={`M0 ${-r * 0.7} C${r * 0.5} ${-r * 1.15} ${r * 1.1} ${-r * 0.6} ${r * 0.98} ${r * 0.15} C${r * 0.88} ${r * 0.85} ${r * 0.35} ${r * 1.05} 0 ${r * 0.88} C${-r * 0.35} ${r * 1.05} ${-r * 0.88} ${r * 0.85} ${-r * 0.98} ${r * 0.15} C${-r * 1.1} ${-r * 0.6} ${-r * 0.5} ${-r * 1.15} 0 ${-r * 0.7} Z`}
              fill="#e63946"
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d={`M0 ${-r * 0.68} Q-2 ${-r * 1.05} 3 ${-r * 1.25}`} fill="none" stroke="#6b4220" strokeWidth="4" strokeLinecap="round" />
            <path d={`M2 ${-r * 1.0} Q12 ${-r * 1.4} 22 ${-r * 1.05} Q12 ${-r * 0.82} 2 ${-r * 1.0} Z`} fill="#3ec300" stroke={INK} strokeWidth="2" />
          </g>
          <ellipse cx={-r * 0.42} cy={-r * 0.3} rx="4.5" ry="7" fill="#fff" opacity="0.55" />
        </g>
      );
      break;
    case "bubble":
      body = (
        <g>
          <circle r={r} fill="#d6f1ff" fillOpacity="0.35" stroke="#7fc8f8" strokeWidth="2.5" />
          <path
            d={`M${-r * 0.8} ${r * 0.3} A${r * 0.85} ${r * 0.85} 0 0 0 ${r * 0.3} ${r * 0.8}`}
            fill="none"
            stroke="#ff7bd0"
            strokeWidth="3"
            opacity="0.6"
            strokeLinecap="round"
          />
          <path
            d={`M${r * 0.45} ${-r * 0.62} A${r * 0.78} ${r * 0.78} 0 0 1 ${r * 0.75} ${-r * 0.1}`}
            fill="none"
            stroke="#ffd23f"
            strokeWidth="3"
            opacity="0.6"
            strokeLinecap="round"
          />
          <ellipse cx={-r * 0.38} cy={-r * 0.42} rx="7" ry="4" transform={`rotate(-40 ${-r * 0.38} ${-r * 0.42})`} fill="#fff" opacity="0.9" />
        </g>
      );
      break;
  }
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>{body}</g>;
}

/** The soap bubble bursting, `age` from 0 to 1: a ring that widens and fades, and droplets flying out. */
function BubblePop({ x, y, age }: { x: number; y: number; age: number }) {
  const r = ROLLER.bubble.r;
  return (
    <g transform={`translate(${x} ${y})`} opacity={1 - age}>
      <circle r={r * (1 + age * 0.8)} fill="none" stroke="#7fc8f8" strokeWidth={3 * (1 - age) + 0.5} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const d = r + 36 * age;
        return <circle key={i} cx={d * Math.cos(a)} cy={d * Math.sin(a)} r="4" fill="#bde9ff" stroke="#7fc8f8" strokeWidth="1.5" />;
      })}
    </g>
  );
}

/**
 * The shelf over row 1a with three things to pick from (K-07). Tapping one
 * lets it out; the new one in its place pops up from small. A marble on it
 * has `color`, the colour it keeps on the run.
 */
function Shelf({ things, filled, color, t, onTake }: { things: Roller[]; filled: number[]; color: string; t: number; onTake: (i: number) => void }) {
  return (
    <g>
      <rect x={SHELF.x0} y={SHELF.y} width={SHELF.x1 - SHELF.x0} height="13" rx="6" fill="#b8763d" stroke={INK} strokeWidth="3" />
      {things.map((kind, i) => {
        const at = shelfSpot(i, kind);
        const age = (t - filled[i] - REFILL_MS) / 1000;
        const k = age < 0 ? 0 : age < 1.5 ? 1 - Math.exp(-age * 7) * Math.cos(age * 22) : 1;
        return (
          <g
            key={i}
            className="shelf-thing"
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              onTake(i);
            }}
          >
            <rect x={at.x - 58} y="-10" width="116" height={SHELF.y + 26} fill="transparent" />
            <g transform={`translate(${at.x} ${SHELF.y}) scale(${k}) translate(${-at.x} ${-SHELF.y})`}>
              <RollerBody kind={kind} color={color} x={at.x} y={at.y} spin={0} scale={SHELF.scale} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** A row's rails with the beam under its xylophone bars, which light up and dip when hit. */
function Xylophone({ row, hits, t }: { row: Row; hits: number[]; t: number }) {
  const bars = BARS.map((bar, i) => ({ ...bar, i })).filter((bar) => bar.row === row);
  const first = bars[0];
  const last = bars[bars.length - 1];
  const at = (x: number) => ({ x, y: rowY(row, x) });
  const slope = (Math.atan2(row.to.y - row.from.y, row.to.x - row.from.x) * 180) / Math.PI;
  return (
    <g>
      <Rail a={at(row.from.x - 24)} b={at(first.x - 4)} />
      <line
        x1={first.x - 6}
        y1={rowY(row, first.x) + BALL_R + 26}
        x2={last.x + last.w + 6}
        y2={rowY(row, last.x + last.w) + BALL_R + 26}
        stroke="#8a5a2b"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {bars.map((bar) => {
        const age = (t - hits[bar.i]) / 1000;
        const cx = bar.x + bar.w / 2;
        const dip = age >= 0 && age < 1 ? 5 * Math.exp(-age * 10) : 0;
        return (
          <g key={bar.i} transform={`translate(${cx} ${rowY(row, cx) + BALL_R + 9 + dip}) rotate(${slope})`}>
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill={BAR_COLORS[bar.i]} stroke={INK} strokeWidth="3" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill="#fff" opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 6) : 0} />
            <circle cx={-bar.w / 2 + 10} cy="0" r="3" fill="#fff8" />
            <circle cx={bar.w / 2 - 10} cy="0" r="3" fill="#fff8" />
          </g>
        );
      })}
      <Rail a={at(last.x + last.w + 4)} b={row.to} />
    </g>
  );
}

/**
 * The part in one spot, behind the marbles (`back`) or in front of them
 * (`front`). A part that has just been put in pops up from small.
 */
function Spot({ slot, piece, state, t, layer }: { slot: Slot; piece: Piece; state: SpotState; t: number; layer: "back" | "front" }) {
  const age = (t - state.swapped) / 1000;
  const k = age >= 0 && age < 1.5 ? 1 - 0.45 * Math.exp(-age * 7) * Math.cos(age * 22) : 1;
  const m = slotMiddle(slot);
  const hitAge = (t - state.hit) / 1000;
  let body: ReactNode = null;
  switch (piece) {
    case "bell": {
      const { pivot } = bellIn(slot);
      body =
        layer === "back" ? (
          <Rail a={slot.from} b={slot.to} />
        ) : (
          <g>
            <line x1={pivot.x} y1={pivot.y - 44} x2={pivot.x} y2={pivot.y} stroke={INK} strokeWidth="5" strokeLinecap="round" />
            <circle cx={pivot.x} cy={pivot.y - 44} r="7" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
            <Bell x={pivot.x} y={pivot.y} angle={wobble(hitAge, 24, 13, 2.2)} />
          </g>
        );
      break;
    }
    case "trampoline":
      body = layer === "back" ? <Trampoline slot={slot} dip={hitAge >= 0 && hitAge < 1 ? 16 * Math.exp(-hitAge * 7) * Math.cos(hitAge * 24) : 0} /> : null;
      break;
    case "funnel": {
      const f = funnelIn(slot);
      body =
        layer === "back" ? (
          <g>
            <ellipse cx={f.cx} cy={f.rimY} rx={f.rx} ry={f.ry} fill="#1b8fc4" opacity="0.45" />
            <Rail a={{ x: f.cx - slot.dir * 20, y: slot.to.y }} b={slot.to} />
          </g>
        ) : (
          <Funnel slot={slot} />
        );
      break;
    }
    case "wheel":
      body = layer === "back" ? <PaddleWheel slot={slot} angle={state.angle} /> : null;
      break;
  }
  if (!body) return null;
  return <g transform={`translate(${m.x} ${m.y}) scale(${k}) translate(${-m.x} ${-m.y})`}>{body}</g>;
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
      <path
        d={`M${-BALL_R + 4} 0 A${BALL_R - 4} ${BALL_R - 4} 0 0 0 ${BALL_R - 4} 0`}
        transform={`rotate(${(spin * 180) / Math.PI})`}
        fill="none"
        stroke="#fff6"
        strokeWidth="5"
      />
      <circle cx="-7" cy="-8" r="5.5" fill="#fff" opacity="0.75" />
    </g>
  );
}

function Hopper() {
  return (
    <g>
      <path
        d={`M${HOPPER.x - 58} -10 L${HOPPER.x + 58} -10 L${HOPPER.x + 28} 62 L${HOPPER.x - 28} 62 Z`}
        fill="#8e7dff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${HOPPER.x - 36} 8 L${HOPPER.x + 36} 8`} stroke="#fff8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function PaddleWheel({ slot, angle }: { slot: Slot; angle: number }) {
  const WHEEL = wheelIn(slot);
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

/** The flag that springs up out of the full basket: `rise` from 0 to 1, swaying by `sway` degrees. */
function Flag({ rise, sway }: { rise: number; sway: number }) {
  const x = (BASKET.x0 + BASKET.x1) / 2;
  // A little past the top, then back.
  const up = 250 * (1 - (1 - rise) ** 3) + 18 * Math.sin(Math.PI * rise);
  return (
    <g transform={`translate(${x} ${BASKET.rimY - up + 30}) rotate(${sway})`}>
      <rect x="-5" y="0" width="10" height="240" rx="5" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
      <path d="M5 4 L120 34 L5 66 Z" fill="#ff5d73" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M5 24 L60 34 L5 46 Z" fill="#ffd23f" />
      <circle cx="0" cy="-4" r="11" fill="#ffd23f" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A bell hanging from `x`, `y`, swinging by `angle` degrees. */
function Bell({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        d="M-4 0 L4 0 L5 12 C22 16 28 34 30 58 L34 64 L-34 64 L-30 58 C-28 34 -22 16 -5 12 Z"
        fill="#ffc93c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-18 28 C-16 22 -12 19 -8 18" stroke="#fff9" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="70" r="7" fill="#c98a00" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A little trampoline on four legs; its mat sags by `dip` when a marble lands. */
function Trampoline({ slot, dip }: { slot: Slot; dip: number }) {
  const { x, y, half } = trampolineIn(slot);
  return (
    <g>
      {[-half + 10, half - 10].map((dx) => (
        <line key={dx} x1={x + dx} y1={y} x2={x + dx * 1.15} y2={y + 34} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      ))}
      <path d={`M${x - half} ${y} Q${x} ${y + 2 * dip} ${x + half} ${y}`} fill="none" stroke="#3a86ff" strokeWidth="9" strokeLinecap="round" />
      {[-half, half].map((dx) => (
        <circle key={dx} cx={x + dx} cy={y} r="8" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

function Funnel({ slot }: { slot: Slot }) {
  const { cx, rimY, rx, ry, spoutY, spoutW } = funnelIn(slot);
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
      <path
        d={`M${x0} ${rimY} L${x1} ${rimY} L${x1 - 14} ${bottomY} L${x0 + 14} ${bottomY} Z`}
        fill="#c98a4b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
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
