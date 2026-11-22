// The drawn parts of the marble run's wall (`Run` in TrackLevel.tsx draws them): the spots and their parts, the shelf,
// xylophones, switch, barrier, looping, drums, chimes, tunnel, and the wooden world (`WOODEN`) the other worlds replace,
// with its own stretch down the lower wall (helix tower, step lifter, tipping troughs).
import { memo, useContext, useId, type PointerEvent, type ReactNode } from "react";
import { VIEW_W, wobble } from "./level";
import { Ball, BAR_COLORS, type BallLook, Rail, STAR_POINTS } from "./parts";
import { HELIX, helixAt, LIFTER, lifterAt, sample, STRETCHES, TAU, TROUGHS, UNDER, WOOD_CUES } from "./trackStretches";
import { type EndProps, INK, type StretchArtProps, type ThingProps, TrackLook, type TrackTheme } from "./trackTheme";
import { BALL_R, type Pt } from "./path";
import { playBlub, playBoing, playClimbNote, playClonk, playKnock, playPlop, playPop, playRumble, playThump } from "@/lib/sfx";
import { playBells } from "@/lib/realSounds";
import {
  BARS,
  BASKET,
  bellIn,
  CHIME_BEAM,
  CHIMES,
  DRUMS,
  funnelIn,
  GATE,
  HOPPER,
  LOOP,
  LOOP_OUT,
  ROW2,
  ROW3,
  ROW4B,
  ROW7,
  ROLLER,
  rowY,
  SHELF,
  shelfSpot,
  slotBoard,
  slotMiddle,
  SWITCH,
  TRACK_H,
  trampolineIn,
  TUNNEL,
  turnSide,
  wheelIn,
  type Piece,
  type Roller,
  type Row,
  type Slot,
  type Turn,
} from "./track";

/** The flag springs up out of the full basket; then the level is done. */
const FLAG_MS = 500;
/** A new thing pops up on the shelf this long after one was taken. */
const REFILL_MS = 250;
/** The switch's flap: lifted to the right (degrees), or hanging down in the marble's way. */
export const FLAP_UP = -90;
/** The flap hanging down in the marble's way (degrees). */
export const FLAP_DOWN = 0;
/** The golden star the tunnel puts on a marble, and the ring of the sunny glow that marks what to tap. */
export const STAR_GOLD = "#ffd23f";

/**
 * `memo` for the still parts of the wall: the run draws again in every frame, so a part whose props have not changed
 * (objects and arrays compared by their contents, handlers ignored – they only use refs) is skipped by React instead of
 * being compared and patched element by element 60 times a second (A-29: that cost an old phone its frames).
 */
function still<P extends object>(Part: (props: P) => ReactNode) {
  const sameValue = (a: unknown, b: unknown): boolean => {
    if (Object.is(a, b)) return true;
    if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false;
    const ka = Object.keys(a);
    return ka.length === Object.keys(b).length && ka.every((k) => Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  };
  return memo(Part, (before, after) => (Object.keys(after) as (keyof P)[]).every((k) => typeof after[k] === "function" || sameValue(before[k], after[k])));
}

/** The slightly darker board a spot sits on, with a dashed edge: here something can be swapped. */
export const SpotBoard = still(function SpotBoard({ slot }: { slot: Slot }) {
  const { board } = useLook();
  const b = slotBoard(slot);
  return <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill={board.fill} stroke={board.edge} strokeWidth="4" strokeDasharray="14 10" />;
});

/** A thing on the run (or bigger by `scale`, on the shelf), its middle at `x`, `y`, turned by `spin` as it rolls; the run's world draws it. */
export function RollerBody({
  kind,
  color,
  look,
  x,
  y,
  spin,
  scale = 1,
  grow = 0,
}: {
  kind: Roller;
  color: string;
  look?: BallLook;
  x: number;
  y: number;
  spin: number;
  scale?: number;
  /** How much of the run lies behind it (0–1). */
  grow?: number;
}) {
  const { Thing } = useLook();
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Thing kind={kind} color={color} look={look} spin={spin} grow={grow} />
    </g>
  );
}

/** The wooden run's things: a marble, a tennis ball, an iron ball, an apple and a soap bubble. */
function WoodenThing({ kind, color, look, spin }: ThingProps) {
  const r = ROLLER[kind].r;
  const deg = (spin * 180) / Math.PI;
  let body: ReactNode;
  switch (kind) {
    case "marble":
      body = <Ball color={color} look={look} x={0} y={0} spin={spin} />;
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
  return body;
}

/** The soap bubble bursting, `age` from 0 to 1: a ring that widens and fades, and droplets flying out. */
export function BubblePop({ x, y, age }: { x: number; y: number; age: number }) {
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

/** Little stars flying up and apart from `x`, `y` and fading; `age` goes from 0 to 1. */
export function Sparkles({ x, y, age }: { x: number; y: number; age: number }) {
  if (age < 0 || age >= 1) return null;
  const out = 1 - (1 - age) ** 2;
  return (
    <g pointerEvents="none" opacity={1 - age * age}>
      {BAR_COLORS.slice(0, 6).map((color, i) => {
        const a = ((-90 + (i - 2.5) * 30) * Math.PI) / 180;
        const d = 30 + 80 * out;
        return (
          <polygon
            key={color}
            points={STAR_POINTS}
            fill={color}
            stroke={INK}
            strokeWidth="1.5"
            transform={`translate(${x + d * Math.cos(a)} ${y + d * Math.sin(a) - 30 * age}) rotate(${age * 160 * (i % 2 ? 1 : -1)}) scale(${0.8 + 0.4 * Math.sin(Math.PI * age)})`}
          />
        );
      })}
    </g>
  );
}

/** An animal climbing up over the tunnel's roof near its end, waving, and going down again; `age` goes from 0 to 1. */
export function Peek({ animal, age }: { animal: string; age: number }) {
  if (age < 0 || age >= 1) return null;
  const x = TUNNEL.x1 - 60;
  const roof = rowY(ROW3, x) - 52;
  const up = 66 * Math.min(1, age * 6, (1 - age) * 6);
  return (
    <text x={x} y={roof + 66 - up} fontSize="64" textAnchor="middle" pointerEvents="none" transform={`rotate(${wobble(age * 1.7, 12, 9, 0.5)} ${x} ${roof})`}>
      {animal}
    </text>
  );
}

/**
 * The shelf over row 1a with three things to pick from (K-07). Tapping one
 * lets it out; the new one in its place pops up from small. A marble on it
 * has its place's colour in `colors`, which it keeps on the run.
 */
export function Shelf({ things, filled, colors, t, onTake }: { things: Roller[]; filled: number[]; colors: string[]; t: number; onTake: (i: number) => void }) {
  const { shelf } = useLook();
  return (
    <g>
      {/* A sunny glow behind each place, so the things read as buttons: these are to be tapped */}
      {SHELF.things.map((x, i) => (
        <circle key={i} cx={x} cy={SHELF.y - 38} r="54" fill="#fff3a6" stroke={STAR_GOLD} strokeWidth="7" />
      ))}
      <rect x={SHELF.x0} y={SHELF.y} width={SHELF.x1 - SHELF.x0} height="13" rx="6" fill={shelf} stroke={INK} strokeWidth="3" />
      {things.map((kind, i) => {
        const at = shelfSpot(i, kind);
        const age = (t - filled[i] - REFILL_MS) / 1000;
        const k = age < 0 ? 0 : age < 1.5 ? 1 - Math.exp(-age * 7) * Math.cos(age * 22) : 1;
        return (
          <g
            key={i}
            className="run-shelf-thing"
            data-tap
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              onTake(i);
            }}
          >
            <rect x={at.x - 58} y="-10" width="116" height={SHELF.y + 26} fill="transparent" />
            <g transform={`translate(${at.x} ${SHELF.y}) scale(${k}) translate(${-at.x} ${-SHELF.y})`}>
              <RollerBody kind={kind} color={colors[i]} x={at.x} y={at.y} spin={0} scale={SHELF.scale} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** Where the hint says „tap a thing on the shelf, and it rolls“: round the last thing, with the hand on the free wall to
 * its right (above, it left the screen on a phone on its side; below, it covered the first row's xylophone). */
export const SHELF_SPOT = { x: SHELF.things[2], y: SHELF.y - 40, r: 64 };

/** Under each place on the shelf its number key, which lets out the thing there; it goes down while `held`. */
export function ShelfKeys({ held, onTake }: { held: string | null; onTake: (i: number) => void }) {
  return (
    <g>
      {SHELF.things.map((x, i) => (
        <g
          key={i}
          className={`run-key${held === `${i + 1}` ? " down" : ""}`}
          data-tap
          onPointerDown={(e: PointerEvent) => {
            e.stopPropagation();
            onTake(i);
          }}
        >
          <rect x={x - 22} y={SHELF.y + 20} width="44" height="40" rx="10" className="run-key-base" />
          <g className="run-key-top">
            <rect x={x - 22} y={SHELF.y + 16} width="44" height="38" rx="10" className="run-key-face" stroke={INK} strokeWidth="3.5" />
            <text x={x} y={SHELF.y + 45} fontSize="28" fontWeight="800" textAnchor="middle" fill={INK}>
              {i + 1}
            </text>
          </g>
        </g>
      ))}
    </g>
  );
}

/** A point `by` px further along `row` from `pt`, so a rail starts a little inside a turn. */
export const inset = (pt: Pt, row: Row, by: number): Pt => {
  const x = pt.x + Math.sign(row.to.x - row.from.x) * by;
  return { x, y: rowY(row, x) };
};

/** A row's rails with the beam under its xylophone bars, which light up and dip when hit by a marble or a finger. */
export const Xylophone = still(function Xylophone({ row, ages, onTap }: { row: Row; ages: number[]; onTap: (bar: number, e: PointerEvent) => void }) {
  const bars = BARS.map((bar, i) => ({ ...bar, i })).filter((bar) => bar.row === row);
  const first = bars[0];
  const last = bars[bars.length - 1];
  const at = (x: number) => ({ x, y: rowY(row, x) });
  // Left to right on the wall, whichever way the marble rolls; the rail reaches a bit past where it comes in.
  const right = row.to.x > row.from.x;
  const [lo, hi] = right ? [at(row.from.x - 24), row.to] : [row.to, inset(row.from, row, 10)];
  const slope = (Math.atan((row.to.y - row.from.y) / (row.to.x - row.from.x)) * 180) / Math.PI;
  return (
    <g>
      <TrackRail a={lo} b={at(first.x - 4)} />
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
        const age = ages[bar.i];
        const cx = bar.x + bar.w / 2;
        const dip = age >= 0 && age < 1 ? 5 * Math.exp(-age * 10) : 0;
        return (
          <g key={bar.i} transform={`translate(${cx} ${rowY(row, cx) + BALL_R + 9 + dip}) rotate(${slope})`} data-tap onPointerDown={(e) => onTap(bar.i, e)}>
            {/* Taller than the bar, so a small finger finds it */}
            <rect x={-bar.w / 2 + 2} y={-62} width={bar.w - 4} height={100} fill="transparent" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill={BAR_COLORS[bar.i % BAR_COLORS.length]} stroke={INK} strokeWidth="3" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill="#fff" opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 6) : 0} />
            <circle cx={-bar.w / 2 + 10} cy="0" r="3" fill="#fff8" />
            <circle cx={bar.w / 2 - 10} cy="0" r="3" fill="#fff8" />
          </g>
        );
      })}
      <TrackRail a={at(last.x + last.w + 4)} b={hi} />
    </g>
  );
});

/**
 * The switch at the end of row 3 (K-01): a flap on a hinge, lifted to the right
 * or hanging down in the marble's way (`angle` in degrees), and a thick lever
 * with a red knob that leans towards the way the marble will go.
 */
export function Switch({ angle }: { angle: number }) {
  const { hinge, length } = SWITCH;
  const down = (angle - FLAP_UP) / (FLAP_DOWN - FLAP_UP);
  const lever = 35 - 70 * down;
  return (
    <g>
      <circle cx={hinge.x} cy={hinge.y - 40} r="95" fill="transparent" />
      <g transform={`translate(${hinge.x} ${hinge.y}) rotate(${lever})`}>
        <rect x="-9" y="-86" width="18" height="86" rx="9" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
        <circle cy="-92" r="24" fill="#ff5d73" stroke={INK} strokeWidth="4" />
        <circle cx="-8" cy="-100" r="7" fill="#fff" opacity="0.7" />
      </g>
      <g transform={`translate(${hinge.x} ${hinge.y}) rotate(${angle})`}>
        <rect x="-9" y="-4" width="18" height={length} rx="8" fill="#ffb703" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={hinge.x} cy={hinge.y} r="13" fill="#b8763d" stroke={INK} strokeWidth="3" />
      <circle cx={hinge.x} cy={hinge.y} r="4" fill={INK} />
    </g>
  );
}

/** Where the barrier's arm hangs from: just in front of the first waiting marble, high enough for every thing to pass under the lifted arm. */
export const gatePivot = (): Pt => ({ x: GATE.x - 8, y: rowY(ROW2, GATE.x) - 100 });

/**
 * The barrier before the funnel (K-02): a red-and-white arm hanging from a
 * round sign on the wall down onto the rail, swinging up to the left by `lift`
 * (0–1). The sign is red with a bar until the marbles can pass and green with a
 * tick while they can, and wobbles `rang` seconds after a tap; while things wait, a sunny
 * `glow` behind it marks it as what to tap.
 */
export function Gate({ lift, open, rang, glow }: { lift: number; open: boolean; rang: number; glow: boolean }) {
  const p = gatePivot();
  const length = 118;
  return (
    <g>
      <rect x={GATE.x - 85} y={p.y - 80} width="95" height="210" fill="transparent" />
      {glow && <circle cx={p.x} cy={p.y} r="54" fill="#fff3a6" stroke={STAR_GOLD} strokeWidth="7" />}
      <g transform={`translate(${p.x} ${p.y}) rotate(${90 * lift + wobble(rang, 6, 20, 5)})`}>
        <rect x="-8" y="-4" width="16" height={length} rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
        {[14, 46, 78].map((y) => (
          <rect key={y} x="-6.5" y={y} width="13" height="16" fill="#ff5d73" />
        ))}
        <rect x="-8" y="-4" width="16" height={length} rx="8" fill="none" stroke={INK} strokeWidth="3" />
      </g>
      <g transform={`translate(${p.x} ${p.y}) rotate(${wobble(rang, 14, 16, 3)})`}>
        <circle r="30" fill={open ? "#3ec300" : "#ff5d73"} stroke={INK} strokeWidth="4" />
        {open ? (
          <path d="M-13 1 L-4 10 L14 -9" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <rect x="-17" y="-5" width="34" height="10" rx="4" fill="#fff" />
        )}
      </g>
    </g>
  );
}

/**
 * The part in one spot, behind the marbles (`back`) or in front of them
 * (`front`). A part that has just been put in pops up from small.
 */
export const Spot = still(function Spot({
  slot,
  piece,
  age,
  hitAge,
  angle,
  layer,
}: {
  slot: Slot;
  piece: Piece;
  age: number;
  hitAge: number;
  angle: number;
  layer: "back" | "front";
}) {
  // A funnel wobbles a little when a marble swirls in or a finger taps it.
  const k = (age >= 0 && age < 1.5 ? 1 - 0.45 * Math.exp(-age * 7) * Math.cos(age * 22) : 1) * (piece === "funnel" ? 1 + wobble(hitAge, 0.07, 24, 6) : 1);
  const m = slotMiddle(slot);
  let body: ReactNode = null;
  switch (piece) {
    case "bell": {
      const { pivot } = bellIn(slot);
      body =
        layer === "back" ? (
          <TrackRail a={slot.from} b={slot.to} />
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
            <TrackRail a={{ x: f.cx - slot.dir * 20, y: slot.to.y }} b={slot.to} />
          </g>
        ) : (
          <Funnel slot={slot} />
        );
      break;
    }
    case "wheel":
      body = layer === "back" ? <PaddleWheel slot={slot} angle={angle} /> : null;
      break;
  }
  if (!body) return null;
  return <g transform={`translate(${m.x} ${m.y}) scale(${k}) translate(${-m.x} ${-m.y})`}>{body}</g>;
});

/** The wall at a turn, with a round bumper where the marble hits it; the bumper flashes `age` seconds after a hit. */
export const Wall = still(function Wall({ turn, index, age }: { turn: Turn; index: number; age: number }) {
  const { post } = useLook();
  const side = turnSide(turn);
  const top = turn.from.y - 70;
  const bottom = turn.bottom ?? turn.to.y + 40;
  const y = turn.from.y + 3;
  const flash = age >= 0 && age < 1 ? Math.exp(-age * 6) : 0;
  const squash = age >= 0 && age < 1 ? 5 * Math.exp(-age * 9) * Math.cos(age * 30) : 0;
  return (
    <g>
      <rect x={side > 0 ? turn.x : turn.x - 18} y={top} width="18" height={bottom - top} rx="6" fill={post} stroke={INK} strokeWidth="3" />
      <ellipse
        cx={turn.x - side * (5 - squash)}
        cy={y}
        rx={9 - squash}
        ry="24"
        fill={BAR_COLORS[(index * 3) % BAR_COLORS.length]}
        stroke={INK}
        strokeWidth="3"
      />
      <ellipse cx={turn.x - side * (5 - squash)} cy={y} rx={9 - squash} ry="24" fill="#fff" opacity={0.8 * flash} />
    </g>
  );
});

/** The looping: a round track the marble rides inside, glowing for a moment after each marble. */
export const Loop = still(function Loop({ age }: { age: number }) {
  const r = LOOP.r + BALL_R + 7;
  const glow = age >= 0 && age < 2 ? Math.exp(-age * 2) : 0;
  return (
    <g>
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r - 6} fill="#ffd23f" opacity={0.18 + 0.3 * glow} />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r} fill="none" stroke={INK} strokeWidth="18" />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r} fill="none" stroke="#ff5d73" strokeWidth="12" />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r} fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="22 22" opacity={0.5 + 0.5 * glow} />
      <TrackRail a={inset(ROW4B.from, ROW4B, 10)} b={ROW4B.to} />
      <TrackRail a={LOOP_OUT.from} b={LOOP_OUT.to} />
      <rect x={LOOP.cx - 9} y={LOOP.cy + r + 8} width="18" height="70" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** Drum `i`, big to small: its skin sags and the drum jumps a little when a marble hits it. */
export const Drum = still(function Drum({ i, age }: { i: number; age: number }) {
  const { x, top, r, h } = DRUMS[i];
  const ry = r * 0.3;
  const hit = age >= 0 && age < 1;
  const dip = hit ? 8 * Math.exp(-age * 8) * Math.cos(age * 28) : 0;
  const jump = hit ? Math.abs(4 * Math.exp(-age * 7) * Math.sin(age * 26)) : 0;
  const body = ["#ff5d73", "#3a86ff", "#3ec300"][i % 3];
  return (
    <g transform={`translate(0 ${-jump})`}>
      <path
        d={`M${x - r} ${top} L${x - r} ${top + h} A${r} ${ry} 0 0 0 ${x + r} ${top + h} L${x + r} ${top} Z`}
        fill={body}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[-0.6, -0.2, 0.2, 0.6].map((k) => (
        <path
          key={k}
          d={`M${x + k * r} ${top + ry * 0.8} L${x + (k + 0.2) * r} ${top + h} L${x + (k + 0.4) * r} ${top + ry * 0.8}`}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          opacity="0.8"
        />
      ))}
      <ellipse cx={x} cy={top} rx={r} ry={ry} fill="#fff8e8" stroke={INK} strokeWidth="3" />
      <ellipse cx={x} cy={top + dip * 0.6} rx={r * 0.55} ry={ry * 0.45} fill="#e9dcc0" />
      <rect x={x - r} y={top + h - 8} width={r * 2} height="8" fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
});

/** The chimes hanging from their beam; one swings away and rings when a marble or a finger knocks it. */
export const Chimes = still(function Chimes({ ages, onTap }: { ages: number[]; onTap: (chime: number, e: PointerEvent) => void }) {
  const { x0, x1, y } = CHIME_BEAM;
  return (
    <g>
      <rect x={x0} y={y - 8} width={x1 - x0} height="16" rx="8" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
      {CHIMES.map((chime, i) => {
        const bottom = rowY(ROW7, chime.x) - BALL_R + 4;
        const tubeTop = bottom - chime.length;
        const age = ages[i];
        return (
          <g key={i} transform={`rotate(${wobble(age, 16, 8, 1.6)} ${chime.x} ${y + 6})`} data-tap onPointerDown={(e) => onTap(i, e)}>
            <rect x={chime.x - 28} y={tubeTop} width="56" height={chime.length} fill="transparent" />
            <line x1={chime.x} y1={y + 6} x2={chime.x} y2={tubeTop} stroke={INK} strokeWidth="2.5" />
            <rect x={chime.x - 8} y={tubeTop} width="16" height={chime.length} rx="5" fill="#cfd8e3" stroke={INK} strokeWidth="3" />
            <line x1={chime.x - 3} y1={tubeTop + 8} x2={chime.x - 3} y2={bottom - 8} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <rect
              x={chime.x - 8}
              y={tubeTop}
              width="16"
              height={chime.length}
              rx="5"
              fill="#fff"
              opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 5) : 0}
            />
          </g>
        );
      })}
    </g>
  );
});

/** The hopper at the wall's top, which the things fall into before they roll. */
export const Hopper = still(function Hopper() {
  const { hopper } = useLook();
  return (
    <g>
      <path
        d={`M${HOPPER.x - 58} -10 L${HOPPER.x + 58} -10 L${HOPPER.x + 28} 62 L${HOPPER.x - 28} 62 Z`}
        fill={hopper}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${HOPPER.x - 36} 8 L${HOPPER.x + 36} 8`} stroke="#fff8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
});

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

export const Tunnel = still(function Tunnel() {
  const { tunnel } = useLook();
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
        fill={tunnel.fill}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0.25, 0.5, 0.75].map((k) => {
        const x = x0 + (x1 - x0) * k;
        return <line key={k} x1={x} y1={y(x) - 52} x2={x} y2={y(x) + BALL_R + 16} stroke={tunnel.lines} strokeWidth="6" />;
      })}
    </g>
  );
});

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

/** The end of the wooden run: the basket, and the flag springing up out of it when it is full. */
function WoodenEnd({ layer, fullAge }: EndProps) {
  if (layer === "front") return <Basket />;
  return (
    <g>
      <ellipse cx={(BASKET.x0 + BASKET.x1) / 2} cy={BASKET.rimY} rx={(BASKET.x1 - BASKET.x0) / 2} ry="14" fill="#6b4220" />
      {fullAge >= 0 && <Flag rise={Math.min(1, (fullAge * 1000) / FLAG_MS)} sway={wobble(fullAge, 10, 9, 1.5)} />}
    </g>
  );
}

/** The wooden wall with its rows of pegs, drawn once. */
const WoodenBackdrop = memo(function WoodenBackdrop() {
  const pegs = useId();
  return (
    <g>
      <defs>
        <pattern id={pegs} width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="4.5" fill="#d7ac72" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill="#f3d5a4" />
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${pegs})`} />
    </g>
  );
});

/** How high a slat of the step lifter stands lifted, `age` seconds after it lifted a thing: up, a moment's hold, down. */
const slatLift = (age: number) => LIFTER.rise * (age < 0 ? 0 : age < 0.4 ? age / 0.4 : age < 0.55 ? 1 : age < 0.95 ? 1 - (age - 0.55) / 0.4 : 0);

/** The helix's rail from round `from` to round `to` (in turns), seen from the side: a rail just under the things' way. */
const helixRail = (from: number, to: number) =>
  sample(Math.max(2, Math.round((to - from) * 48)), (k) => helixAt((from + (to - from) * k) * TAU))
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${(p.y + UNDER).toFixed(1)}`)
    .join(" ");

/**
 * The wooden run's own stretch: a helix tower the marbles run round four times (a coloured disc on its pole bobs at
 * each round), a step lifter whose wooden slats lift them up one step after the other, and six troughs down the right
 * edge that tip them on from one to the next. Behind the things the tower's pole, its rail and the lifter; in front
 * only the near halves of the helix's rail.
 */
function WoodenStretch({ layer, ages, onTap }: StretchArtProps) {
  const { post } = useLook();
  const end = helixAt(HELIX.turns * TAU);
  if (layer === "front") {
    // The near half of each round, in front of the pole: from a quarter before the round's start to a quarter after it.
    const near = Array.from({ length: HELIX.turns + 1 }, (_, n) => helixRail(Math.max(0, n - 0.25), Math.min(HELIX.turns, n + 0.25)));
    return (
      <g pointerEvents="none" fill="none" strokeLinecap="round">
        {near.map((d, n) => (
          <g key={n}>
            <path d={d} stroke={INK} strokeWidth="14" />
            <path d={d} stroke="#e0a868" strokeWidth="8" />
          </g>
        ))}
      </g>
    );
  }
  const top = lifterAt(LIFTER.steps);
  return (
    <g>
      {/* The helix tower: its whole rail, then the pole with a disc for each round */}
      <path d={helixRail(0, HELIX.turns)} fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d={helixRail(0, HELIX.turns)} fill="none" stroke="#a8743f" strokeWidth="8" strokeLinecap="round" />
      <rect x={HELIX.cx - 16} y={HELIX.top - 90} width="32" height={end.y - HELIX.top + 160} rx="10" fill={post} stroke={INK} strokeWidth="4" />
      <circle cx={HELIX.cx} cy={HELIX.top - 92} r="22" fill="#ff5d73" stroke={INK} strokeWidth="4" />
      {Array.from({ length: HELIX.turns }, (_, n) => {
        const y = (helixAt(n * TAU).y + helixAt((n + 1) * TAU).y) / 2 - 10;
        const bob = wobble(ages[WOOD_CUES.helix + n], 10, 16, 4);
        return (
          <g key={n} data-tap onPointerDown={(e) => onTap(WOOD_CUES.helix + n, e)}>
            <ellipse cx={HELIX.cx} cy={y - bob} rx="34" ry="12" fill={BAR_COLORS[(n * 2) % BAR_COLORS.length]} stroke={INK} strokeWidth="3.5" />
          </g>
        );
      })}

      {/* The step lifter: a frame, a slat under every step, which lifts while a thing is on it, and the landing on top */}
      <path
        d={`M${lifterAt(0).x - 30} ${LIFTER.y0 + 80} L${lifterAt(0).x - 30} ${lifterAt(0).y + 40} L${top.x + 30} ${top.y + 40} L${top.x + 30} ${LIFTER.y0 + 80} Z`}
        fill="#d9a066"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {Array.from({ length: LIFTER.steps }, (_, i) => {
        const p = lifterAt(i);
        const up = slatLift(ages[WOOD_CUES.lifter + i]);
        return (
          <g key={i} data-tap onPointerDown={(e) => onTap(WOOD_CUES.lifter + i, e)}>
            <rect
              x={p.x - 13}
              y={p.y + BALL_R + 1 - up}
              width="26"
              height={LIFTER.y0 + 70 - p.y}
              rx="4"
              fill={i % 2 ? "#ffb703" : "#f4a259"}
              stroke={INK}
              strokeWidth="3"
            />
          </g>
        );
      })}
      <rect x={top.x - 14} y={top.y + BALL_R + 1} width="52" height="20" rx="5" fill={post} stroke={INK} strokeWidth="3" />

      {/* The troughs, each on a peg, tipping on a little as they pour a thing into the next */}
      {TROUGHS.map((trough, i) => {
        const dir = Math.sign(trough.low.x - trough.high.x);
        const a = { x: trough.high.x - dir * 30, y: trough.high.y + UNDER - 2 };
        const b = { x: trough.low.x + dir * 6, y: trough.low.y + UNDER };
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const tip = dir * wobble(ages[WOOD_CUES.troughs + i], 7, 12, 3.5);
        const d = `M${a.x} ${a.y - 40} L${a.x} ${a.y} L${b.x} ${b.y}`;
        return (
          <g key={i} data-tap onPointerDown={(e) => onTap(WOOD_CUES.troughs + i, e)}>
            <rect x={mid.x - 6} y={mid.y} width="12" height="34" fill={post} stroke={INK} strokeWidth="3" />
            <g transform={`rotate(${tip} ${mid.x} ${mid.y})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d={d} stroke={INK} strokeWidth="16" />
              <path d={d} stroke={BAR_COLORS[(i * 2 + 1) % BAR_COLORS.length]} strokeWidth="9" />
            </g>
            <circle cx={mid.x} cy={mid.y} r="6" fill={INK} />
          </g>
        );
      })}
    </g>
  );
}

/** What the wooden stretch sounds like: a knock a step higher for each round of the helix, a rising note for each step of the lifter, a hollow clonk for each trough. */
function woodenCue(cue: number) {
  if (cue < WOOD_CUES.lifter) playKnock(480 + 120 * (cue - WOOD_CUES.helix));
  else if (cue < WOOD_CUES.troughs) playClimbNote(cue - WOOD_CUES.lifter, 0.12);
  else playClonk();
}

/** The wooden run, the first and plainest world. */
export const WOODEN: TrackTheme = {
  level: "track",
  Backdrop: WoodenBackdrop,
  Rail,
  board: { fill: "#e9c08a", edge: "#c48a4d" },
  post: "#b8763d",
  shelf: "#b8763d",
  hopper: "#8e7dff",
  tunnel: { fill: "#3ec300", lines: "#2a9100" },
  Thing: WoodenThing,
  release: { marble: playPop, tennis: playBoing, iron: playRumble, apple: () => playKnock(480), bubble: playBlub },
  landSound: (kind) => (kind === "iron" ? playThump() : playPlop()),
  fullSound: playBells,
  full: {
    de: "Der Korb ist voll!",
    en: "The basket is full!",
    zh: "篮子满啦！",
    hi: "टोकरी भर गई!",
    es: "¡La cesta está llena!",
    ar: "السلة ممتلئة!",
    ru: "Корзина полна!",
  },
  peekers: ["🐭", "🐸", "🐰", "🦊", "🐻", "🐥"],
  magic: true,
  End: WoodenEnd,
  stretch: STRETCHES.wood,
  StretchArt: WoodenStretch,
  cue: woodenCue,
};

/** The run's world, inside the run. */
function useLook(): TrackTheme {
  return useContext(TrackLook) ?? WOODEN;
}

/** A rail in the run's world. */
export const TrackRail = still(function TrackRail(props: { a: Pt; b: Pt }) {
  const { Rail: WorldRail } = useLook();
  return <WorldRail {...props} />;
});

/** The world's own stretch (`TrackTheme.StretchArt`), drawn again only when a cue's age changes. */
export const StretchArt = still(function StretchArt(props: StretchArtProps) {
  const { StretchArt: Art } = useLook();
  return <Art {...props} />;
});
