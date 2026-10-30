import { memo, useId, useMemo, type ReactNode } from "react";
import { useT } from "@/lib/language";
import { VIEW_H, wobble, type LevelProps } from "./level";
import { beside, deg, hop, lerp, svgLine } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { INK, MARBLE_COLOR, Sparkles } from "./scenery";
import {
  ARM,
  BOARD,
  buildSpace,
  BUGGY,
  TRUSS,
  DECK,
  DISH,
  DOWN,
  FLOOR,
  groundY,
  HILLS,
  HOSE,
  IRON,
  PANEL,
  LEVER,
  MAGNET,
  MOBILE,
  MOON,
  PAD,
  type Planet,
  planetSpot,
  PLANETS,
  RAMP,
  RINGS,
  rampY,
  ROBOT,
  ROCK,
  ROCKET,
  SCOPE,
  scopeTip,
  SLOT,
  TANK,
  TOWER,
  TOWER_ARM,
  UFO_BELOW,
  WINDOW_UP,
  WORLD_W,
  type Space,
} from "./space";
import { BALL_R, type Pt } from "./path";
import { BAR_COLORS, Ball } from "./parts";

const SKY_TOP = "#0d1446";
const SKY_LOW = "#2b3a88";
const STEEL = "#c9d1e8";
const DARK_STEEL = "#7d86ad";
const GROUND = "#a9afcf";
const CRATER = "#8f96bb";
const GLOW = "#7dffb2";

/**
 * A Rube Goldberg machine on a toy launch site at night. One tap lets the
 * marble out of the satellite dish, through the glowing rings and down the
 * zigzag pipe into a sleepy robot, which pushes the moon buggy over the hills
 * into the planet mobile; the earth bonks the telescope, which swings round and
 * points at the sky, where a UFO with a little alien sees it and comes floating
 * in. It beams up a moon rock, carries it over and drops it onto the switch,
 * waves and zooms off; the magnet lets go of its iron ball, the ball drops into
 * the countdown board's slot, and after „3, 2, 1“ the rocket lifts off. The
 * camera travels along with whatever moves.
 */
export function SpaceLevel(props: LevelProps) {
  const space = useMemo(buildSpace, []);
  const ids = useId();

  return (
    <MachineStage machine={space} level="space" {...props}>
      {(t) => (
        <>
          <Sky sky={`${ids}-sky`} t={t} space={space} />
          <Ground />
          <DishMast />
          <RingRail space={space} t={t} />
          <Deck />
          <DownRamp space={space} />
          <PipeBack space={space} t={t} />
          <Robot space={space} t={t} />
          <Ufo space={space} t={t} />
          <StationTruss space={space} t={t} />
          <Mobile spin={space.spinAt(t)} />
          <ScopeTripod />
          <Telescope space={space} t={t} />
          <LeverBox space={space} t={t} />
          <SlotHole />
          <IronBall at={space.ironAt(t)} />
          <CountdownBoard space={space} t={t} />
          <LaunchTower angle={space.armAngle(t)} t={t} />
          <Pad />
          <Tank />
          <Hose drop={space.hoseDrop(t)} />

          <MovingThings space={space} t={t} />

          <DishFront />
          <RingFronts space={space} t={t} />
          <PipeFront space={space} />
          <Smoke space={space} t={t} />
          <Sparkles x={ROCKET.x} y={330} age={t - space.tLift - 0.9} n={12} spread={320} />

          <TapHint t={t} x={DISH.x + 110} y={DISH.y + 100} />
        </>
      )}
    </MachineStage>
  );
}

function MovingThings({ space, t }: { space: Space; t: number }) {
  const marble = space.marbleAt(t);
  const buggy = space.buggyAt(t);
  return (
    <g>
      <Ball color={MARBLE_COLOR} x={marble.pt.x} y={marble.pt.y} spin={marble.spin} />
      <MoonRock space={space} t={t} />
      <g transform={`translate(${buggy.pt.x} ${buggy.pt.y}) rotate(${deg(buggy.angle)})`}>
        <Buggy turned={buggy.turned} bob={buggy.bob} />
      </g>
      <Rocket space={space} t={t} />
    </g>
  );
}

/** A metal beam along `pts`: an ink outline around a steel middle. */
function Beam({ pts, w = 8, color = STEEL }: { pts: Pt[]; w?: number; color?: string }) {
  const d = svgLine(pts);
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** A lattice mast from `top` down to the ground, `w` wide, its middle at `x`. */
function Lattice({ x, w, top, bottom = FLOOR }: { x: number; w: number; top: number; bottom?: number }) {
  const l = x - w / 2 + 6;
  const r = x + w / 2 - 6;
  const n = Math.max(1, Math.round((bottom - top) / 64));
  const zig = Array.from({ length: n + 1 }, (_, i) => ({ x: i % 2 ? r : l, y: top + ((bottom - top) * i) / n }));
  return (
    <g>
      <Beam pts={zig} w={5} />
      <Beam
        pts={[
          { x: l, y: top },
          { x: l, y: bottom },
        ]}
      />
      <Beam
        pts={[
          { x: r, y: top },
          { x: r, y: bottom },
        ]}
      />
    </g>
  );
}

/** A little lamp that blinks once the machine runs. */
function Blinker({ x, y, t, phase = 0, color = "#ff5d73" }: { x: number; y: number; t: number; phase?: number; color?: string }) {
  const on = t >= 0 && Math.sin(t * 5 + phase) > 0;
  return (
    <g>
      {on && <circle cx={x} cy={y} r="16" fill={color} opacity="0.35" />}
      <circle cx={x} cy={y} r="7" fill={on ? color : "#5a4a7a"} stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/* ---------- Night sky and moon ground ---------- */

const rand = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const STARS = Array.from({ length: 170 }, (_, i) => ({
  x: -300 + rand(i) * (WORLD_W + 600),
  y: 14 + rand(i + 500) * 620,
  size: 2 + rand(i + 900) * 5,
  phase: rand(i + 1300) * 2 * Math.PI,
}));

function Sky({ sky, t, space }: { sky: string; t: number; space: Space }) {
  const party = t >= space.tLift;
  return (
    <g>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SKY_TOP} />
          <stop offset="1" stopColor={SKY_LOW} />
        </linearGradient>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${sky})`} />
      {STARS.map((s, i) => {
        const twinkle = t < 0 ? 0.8 : 0.55 + 0.45 * Math.sin(t * (party ? 7 : 2.2) + s.phase);
        const grow = party ? 1.3 + 0.3 * Math.sin(t * 6 + s.phase) : 1;
        if (s.size < 4.6) return <circle key={i} cx={s.x} cy={s.y} r={(s.size / 2) * grow} fill="#fff7d6" opacity={twinkle} />;
        return (
          <path
            key={i}
            transform={`translate(${s.x} ${s.y}) scale(${(s.size / 12) * grow})`}
            d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z"
            fill="#ffe680"
            opacity={twinkle}
          />
        );
      })}
      <RingedPlanet x={2350} y={170} />
      <Moon awake={t >= space.tLift + 0.8} />
    </g>
  );
}

function RingedPlanet({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(-14)`}>
      <path d="M-74 0 A74 18 0 0 1 74 0" fill="none" stroke={INK} strokeWidth="11" />
      <path d="M-74 0 A74 18 0 0 1 74 0" fill="none" stroke="#ffd9a0" strokeWidth="6" />
      <circle r="44" fill="#ff9bb5" stroke={INK} strokeWidth="3.5" />
      <path d="M-40 -14 Q0 -4 40 -14 M-42 10 Q0 20 42 10" fill="none" stroke="#ff7bd0" strokeWidth="6" />
      <path d="M-74 0 A74 18 0 0 0 74 0" fill="none" stroke={INK} strokeWidth="11" />
      <path d="M-74 0 A74 18 0 0 0 74 0" fill="none" stroke="#ffd9a0" strokeWidth="6" />
      <circle cx="-16" cy="-22" r="7" fill="#fff" opacity="0.6" />
    </g>
  );
}

/** The moon sleeps until the rocket is on its way, then opens its eyes. */
function Moon({ awake }: { awake: boolean }) {
  const { x, y, r } = MOON;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r + 26} fill="#fff3c4" opacity="0.12" />
      <circle r={r} fill="#fff3c4" stroke={INK} strokeWidth="4" />
      <circle cx="-30" cy="-30" r="12" fill="#f2df9b" />
      <circle cx="34" cy="-18" r="8" fill="#f2df9b" />
      <circle cx="22" cy="36" r="10" fill="#f2df9b" />
      {awake ? (
        <>
          <circle cx="-20" cy="-4" r="7" fill={INK} />
          <circle cx="16" cy="-4" r="7" fill={INK} />
          <circle cx="-18" cy="-6" r="2.5" fill="#fff" />
          <circle cx="18" cy="-6" r="2.5" fill="#fff" />
        </>
      ) : (
        <path d="M-28 -4 Q-20 4 -12 -4 M8 -4 Q16 4 24 -4" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      )}
      <circle cx="-32" cy="14" r="8" fill="#ffb3c1" />
      <circle cx="28" cy="14" r="8" fill="#ffb3c1" />
      <path d={awake ? "M-14 16 Q-2 34 10 16" : "M-10 20 Q-2 26 6 20"} fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

const CRATERS = [180, 640, 1150, 1700, 2300, 2650, 3420, 4000, 4460, 5000, 5360, 6000, 6400, 7000];

function Ground() {
  const x0 = HILLS[0].x - HILLS[0].w / 2;
  const x1 = HILLS[HILLS.length - 1].x + HILLS[HILLS.length - 1].w / 2;
  const top = Array.from({ length: Math.ceil((x1 - x0) / 8) + 1 }, (_, i) => {
    const x = Math.min(x1, x0 + i * 8);
    return { x, y: groundY(x) };
  });
  return (
    <g>
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill={GROUND} />
      {CRATERS.map((x, i) => (
        <ellipse key={x} cx={x} cy={FLOOR + 34 + (i % 3) * 22} rx={40 + (i % 2) * 22} ry={10 + (i % 2) * 4} fill={CRATER} stroke={INK} strokeWidth="2.5" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
      <path d={`${svgLine(top)} L${x1} ${FLOOR + 3} L${x0} ${FLOOR + 3} Z`} fill={GROUND} />
      <path d={svgLine(top)} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {HILLS.map((h) => (
        <ellipse key={h.x} cx={h.x + h.w * 0.12} cy={FLOOR - h.h * 0.35} rx={h.w * 0.1} ry="5" fill={CRATER} />
      ))}
    </g>
  );
}

/* ---------- Dish, glowing buttons and glass tube ---------- */

/** The mast holding the dish, and the inside of the dish behind the marble. */
function DishMast() {
  const { x, y, rx } = DISH;
  return (
    <g>
      <rect x="52" y={y + 4} width="20" height={FLOOR - y - 4} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      <Beam
        pts={[
          { x: 62, y: y + 20 },
          { x: x - 52, y: y + 18 },
        ]}
        w={6}
      />
      <ellipse cx={x} cy={y - 8} rx={rx} ry="18" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The front of the dish bowl, and the feed sticking up over it with a light on top. */
function DishFront() {
  const { x, y, rx } = DISH;
  return (
    <g>
      <path
        d={`M${x - rx} ${y - 8} Q${x} ${y + 60} ${x + rx} ${y - 8} A${rx} 18 0 0 1 ${x - rx} ${y - 8} Z`}
        fill={STEEL}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${x - rx + 26} ${y + 8} Q${x - 30} ${y + 26} ${x - 6} ${y + 26}`}
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <Beam
        pts={[
          { x: x + rx - 10, y: y - 10 },
          { x: x + 14, y: y - 84 },
        ]}
        w={4}
      />
      <circle cx={x + 14} cy={y - 88} r="10" fill="#ff5d73" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A steel rail just under the marble's path from `a` to `b`. */
function MetalRail({ a, b }: { a: Pt; b: Pt }) {
  const off = BALL_R + 7;
  return (
    <g>
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      <line x1={a.x} y1={a.y + off} x2={b.x} y2={b.y + off} stroke={STEEL} strokeWidth="12" strokeLinecap="round" />
      <line x1={a.x + 10} y1={a.y + off - 3} x2={b.x - 10} y2={b.y + off - 3} stroke="#fff" strokeWidth="2.5" opacity="0.7" />
    </g>
  );
}

/** A ring around the rail at `x`, tilted with it; `half` is the half behind the marble or the one in front of it. */
function Ring({ x, color, age, half }: { x: number; color: string; age: number; half: "back" | "front" }) {
  const slope = deg(Math.atan2(RAMP.to.y - RAMP.from.y, RAMP.to.x - RAMP.from.x));
  const lit = age >= 0;
  const d = half === "back" ? "M0 -40 A14 40 0 0 0 0 40" : "M0 -40 A14 40 0 0 1 0 40";
  return (
    <g transform={`translate(${x} ${rampY(x)}) rotate(${slope})`}>
      {half === "back" && lit && <ellipse rx="34" ry="56" fill={color} opacity={0.2 + 0.4 * Math.exp(-age * 3)} />}
      <path d={d} fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d={d} fill="none" stroke={lit ? color : "#4a4f7d"} strokeWidth="6" strokeLinecap="round" />
      {half === "front" && lit && (
        <path d="M3 -30 A10 30 0 0 1 9 -6" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity={0.5 + 0.5 * Math.exp(-age * 3)} />
      )}
    </g>
  );
}

/** The rail on its two legs, and the back halves of the glowing rings. */
function RingRail({ space, t }: { space: Space; t: number }) {
  const legY = (x: number) => rampY(x) + BALL_R + 14;
  return (
    <g>
      {[330, 780].map((x) => (
        <rect key={x} x={x - 8} y={legY(x)} width="16" height={FLOOR - legY(x)} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      {RINGS.map((ring, i) => (
        <Ring key={i} x={ring.x} color={BAR_COLORS[i]} age={t - space.ringTimes[i]} half="back" />
      ))}
      <MetalRail a={{ x: RAMP.from.x - 24, y: rampY(RAMP.from.x - 24) }} b={RAMP.to} />
    </g>
  );
}

/** The front halves of the rings the marble rolls through; each one lights up as it passes. */
function RingFronts({ space, t }: { space: Space; t: number }) {
  return (
    <g>
      {RINGS.map((ring, i) => (
        <Ring key={i} x={ring.x} color={BAR_COLORS[i]} age={t - space.ringTimes[i]} half="front" />
      ))}
    </g>
  );
}

/** The panel the pipe is clamped to, with blinking lights, and the inside of the pipe behind the marble. */
function PipeBack({ space, t }: { space: Space; t: number }) {
  const { x0, x1, top } = PANEL;
  const inside = space.pipe.filter((p) => p.x <= x1);
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={DECK.y - top} rx="14" fill="#3d4a7a" stroke={INK} strokeWidth="4" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={x0 + 16} cy={top + 30 + i * 60} r="4" fill={DARK_STEEL} />
      ))}
      <Blinker x={x1 - 26} y={top + 26} t={t} color={GLOW} />
      <Blinker x={x1 - 56} y={top + 26} t={t} phase={2} color="#ffd23f" />
      <path d={svgLine(inside)} fill="none" stroke="#bde9ff" strokeWidth={2 * BALL_R + 12} strokeLinecap="round" strokeLinejoin="round" opacity="0.18" />
    </g>
  );
}

/** The front of the see-through pipe: its two edges, a shine and the clamps that hold it to the panel. */
function PipeFront({ space }: { space: Space }) {
  const inside = space.pipe.filter((p) => p.x <= PANEL.x1);
  const clamps = [0.12, 0.3, 0.55, 0.8].map((k) => inside[Math.round(k * (inside.length - 1))]);
  return (
    <g>
      <path d={svgLine(inside)} fill="none" stroke="#bde9ff" strokeWidth={2 * BALL_R + 12} strokeLinecap="round" strokeLinejoin="round" opacity="0.14" />
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={svgLine(beside(inside, side * (BALL_R + 6)))}
          fill="none"
          stroke="#e8f8ff"
          strokeWidth="3.5"
          strokeLinejoin="round"
          opacity="0.85"
        />
      ))}
      <path d={svgLine(beside(inside, -BALL_R + 2))} fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" opacity="0.4" />
      {clamps.map((p, i) => (
        <rect key={i} x={p.x - 6} y={p.y - BALL_R - 10} width="12" height={2 * BALL_R + 20} rx="4" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
}

/* ---------- Deck, robot and moon buggy ---------- */

function Deck() {
  const { x0, x1, y } = DECK;
  const legs = [x0 + 20, (x0 + x1) / 2 - 40, x1 - 40];
  return (
    <g>
      {legs.slice(1).map((x, i) => (
        <Beam
          key={x}
          pts={[
            { x: legs[i] + 9, y: y + 18 },
            { x: x + 9, y: FLOOR },
          ]}
          w={4}
        />
      ))}
      {legs.map((x) => (
        <rect key={x} x={x} y={y + 10} width="18" height={FLOOR - y - 10} rx="3" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height="20" rx="5" fill={STEEL} stroke={INK} strokeWidth="4" />
      <rect x={x0 + 6} y={y + 4} width={x1 - x0 - 12} height="4" rx="2" fill="#fff" opacity="0.6" />
      {Array.from({ length: Math.floor((x1 - x0) / 60) }, (_, i) => (
        <circle key={i} cx={x0 + 30 + i * 60} cy={y + 13} r="3" fill={DARK_STEEL} />
      ))}
    </g>
  );
}

/** The steel track from the deck down onto the moon, on two legs. */
function DownRamp({ space }: { space: Space }) {
  const { pts } = space.buggyPath;
  const down = pts.filter((p) => p.x >= DECK.x1 - 6 && p.x <= DOWN.x1 + 60);
  const track = beside(down, 8);
  const at = (x: number) => track.reduce((best, p) => (Math.abs(p.x - x) < Math.abs(best.x - x) ? p : best));
  return (
    <g>
      {[1830, 1970].map((x) => {
        const p = at(x);
        return <rect key={x} x={x - 7} y={p.y} width="14" height={FLOOR - p.y} fill={STEEL} stroke={INK} strokeWidth="3" />;
      })}
      <path d={svgLine(track)} fill="none" stroke={INK} strokeWidth="20" strokeLinejoin="round" strokeLinecap="round" />
      <path d={svgLine(track)} fill="none" stroke="#ffb703" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

/** The robot sleeps until the marble presses its button; then it wakes, pushes the buggy and waves. */
function Robot({ space, t }: { space: Space; t: number }) {
  const age = t - space.tRobot;
  const awake = age >= 0;
  const blink = awake && Math.floor(t * 4) % 2 === 0;
  const nod = wobble(age, 8, 12, 2.5);
  const arm = (angle: number, x: number) => (
    <g transform={`translate(${x} -100) rotate(${angle})`}>
      <rect x="-8" y="0" width="16" height={ARM.len} rx="8" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      <circle cy={ARM.len} r={ARM.hand} fill="#ffb703" stroke={INK} strokeWidth="3" />
    </g>
  );
  return (
    <g transform={`translate(${ROBOT.cx} ${DECK.y})`}>
      <rect x={-ROBOT.half - ROBOT.button + (awake ? 6 : 0)} y="-30" width={ROBOT.button + 10} height="16" rx="6" fill="#ff3b3b" stroke={INK} strokeWidth="3" />
      {arm(space.backArm(t), -40)}
      <rect x={-ROBOT.half} y="-34" width={ROBOT.half * 2} height="34" rx="17" fill="#5b6489" stroke={INK} strokeWidth="3.5" />
      {[-32, 0, 32].map((x) => (
        <circle key={x} cx={x} cy="-17" r="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
      <rect x="-44" y="-112" width="88" height="80" rx="14" fill="#8fd3ff" stroke={INK} strokeWidth="4" />
      <rect x="-28" y="-98" width="56" height="34" rx="7" fill="#3d4a7a" stroke={INK} strokeWidth="2.5" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={-16 + i * 16} cy="-81" r="5" fill={awake && Math.floor(t * 6 + i) % 3 === 0 ? BAR_COLORS[i * 2] : "#5a4a7a"} />
      ))}
      <rect x="-10" y="-124" width="20" height="14" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      <g transform={`rotate(${nod} 0 -124)`}>
        <line x1="0" y1="-182" x2="0" y2="-204" stroke={INK} strokeWidth="4" />
        {blink && <circle cy="-208" r="14" fill="#ff5d73" opacity="0.4" />}
        <circle cy="-208" r="8" fill={blink ? "#ff5d73" : "#7a2a3a"} stroke={INK} strokeWidth="2.5" />
        <rect x="-38" y="-182" width="76" height="60" rx="16" fill={STEEL} stroke={INK} strokeWidth="4" />
        {awake ? (
          [-15, 15].map((x) => (
            <g key={x}>
              <circle cx={x} cy="-156" r="13" fill={GLOW} opacity="0.35" />
              <circle cx={x} cy="-156" r="8" fill={GLOW} stroke={INK} strokeWidth="2.5" />
              <circle cx={x - 2} cy="-158" r="2.5" fill="#fff" />
            </g>
          ))
        ) : (
          <path d="M-22 -156 L-8 -156 M8 -156 L22 -156" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        )}
        <path d={awake ? "M-14 -138 Q0 -128 14 -138" : "M-10 -136 L10 -136"} fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </g>
      {arm(-space.frontArm(t), ARM.x - ROBOT.cx)}
    </g>
  );
}

/** The moon buggy with a little alien at the wheel, drawn standing on its wheels with the middle between them at (0, 0), facing right. */
function Buggy({ turned, bob }: { turned: number; bob: number }) {
  const r = BUGGY.wheelR;
  const wheel = (x: number) => (
    <g transform={`translate(${x} ${-r}) rotate(${deg(turned / r)})`}>
      <circle r={r} fill="#5b6489" stroke={INK} strokeWidth="3" />
      {[0, 60, 120].map((a) => (
        <line key={a} x1={-r + 4} y1="0" x2={r - 4} y2="0" transform={`rotate(${a})`} stroke={STEEL} strokeWidth="2.5" />
      ))}
      <circle r="5" fill={STEEL} stroke={INK} strokeWidth="1.5" />
    </g>
  );
  return (
    <g>
      <g transform={`translate(0 ${-Math.abs(bob)})`}>
        <line x1="-62" y1="-64" x2="-72" y2="-128" stroke={INK} strokeWidth="3.5" />
        <path d="M-72 -128 L-44 -120 L-70 -110 Z" fill="#ffd23f" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        {/* The alien */}
        <line x1="6" y1="-92" x2="-2" y2="-108" stroke={INK} strokeWidth="2.5" />
        <line x1="18" y1="-92" x2="26" y2="-108" stroke={INK} strokeWidth="2.5" />
        <circle cx="-2" cy="-109" r="4" fill="#ff7bd0" stroke={INK} strokeWidth="1.5" />
        <circle cx="26" cy="-109" r="4" fill="#ff7bd0" stroke={INK} strokeWidth="1.5" />
        <circle cx="12" cy="-80" r="15" fill="#7ee081" stroke={INK} strokeWidth="2.5" />
        <circle cx="7" cy="-83" r="3" fill={INK} />
        <circle cx="18" cy="-83" r="3" fill={INK} />
        <path d="M5 -74 Q12 -68 19 -74" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="12" cy="-80" r="27" fill="#bde9ff" opacity="0.3" stroke={INK} strokeWidth="3" />
        <path d="M-6 -94 Q0 -101 8 -103" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <path d="M-80 -30 L-80 -58 Q-80 -64 -74 -64 L66 -64 Q80 -64 80 -52 L80 -30 Z" fill="#ffd23f" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <rect x="-70" y="-58" width="34" height="5" rx="2.5" fill="#fff" opacity="0.7" />
        <rect x={BUGGY.nose - 12} y="-62" width="12" height="18" rx="5" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
        <circle cx="-40" cy="-44" r="6" fill="#ff8c42" stroke={INK} strokeWidth="2" />
      </g>
      {wheel(-BUGGY.wheelX)}
      {wheel(BUGGY.wheelX)}
    </g>
  );
}

/* ---------- Station truss, mobile, switch and magnet ---------- */

const jibLow = TRUSS.jibY + TRUSS.jibH;

/** The space-station truss: a mast with a round module on top, a long beam with solar wings, the power cable and the magnet. */
function StationTruss({ space, t }: { space: Space; t: number }) {
  const { x, w, jibY, jib0, jib1 } = TRUSS;
  const on = t < space.tOff;
  const n = Math.round((jib1 - jib0) / 44);
  const zig = Array.from({ length: n + 1 }, (_, i) => ({ x: jib0 + ((jib1 - jib0) * i) / n, y: i % 2 ? jibLow : jibY }));
  const cable = [
    { x: LEVER.x + 34, y: FLOOR - 14 },
    { x: LEVER.x + 60, y: FLOOR - 4 },
    { x: x - w / 2 - 8, y: FLOOR - 4 },
    { x: x - w / 2 - 8, y: jibLow + 8 },
    { x: MAGNET.x - 26, y: jibLow + 8 },
    { x: MAGNET.x - 8, y: jibLow + 22 },
  ];
  const drop = MAGNET.y - 56;
  const module = { x0: x - 80, x1: x + 80, top: jibY - 74 };
  const panels = [
    { x0: jib0 + 30, x1: x - 110 },
    { x0: x + 110, x1: jib1 - 30 },
  ];
  return (
    <g>
      <Lattice x={x} w={w} top={jibY} />
      <rect x={x - w / 2 - 22} y={FLOOR - 22} width={w + 44} height="22" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      {/* Solar wings standing on the truss */}
      {panels.map(({ x0, x1 }, i) => {
        const cells = Math.round((x1 - x0) / 46);
        return (
          <g key={i}>
            <rect x={x0} y={jibY - 54} width={x1 - x0} height="46" rx="4" fill="#2f6fd6" stroke={INK} strokeWidth="3" />
            {Array.from({ length: cells - 1 }, (_, k) => {
              const cx = x0 + ((x1 - x0) * (k + 1)) / cells;
              return <line key={k} x1={cx} y1={jibY - 54} x2={cx} y2={jibY - 8} stroke="#8fc3ff" strokeWidth="2" />;
            })}
            <line x1={x0} y1={jibY - 31} x2={x1} y2={jibY - 31} stroke="#8fc3ff" strokeWidth="2" />
            <line x1={x0 + 10} y1={jibY - 46} x2={x0 + 40} y2={jibY - 46} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </g>
        );
      })}
      <Beam pts={zig} w={5} />
      <Beam
        pts={[
          { x: jib0, y: jibY },
          { x: jib1, y: jibY },
        ]}
      />
      <Beam
        pts={[
          { x: jib0, y: jibLow },
          { x: jib1, y: jibLow },
        ]}
      />
      {/* The round station module on top of the mast, with portholes and an antenna */}
      <line x1={x + 40} y1={module.top} x2={x + 56} y2={module.top - 40} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x + 56} cy={module.top - 40} r="6" fill="#ffd23f" stroke={INK} strokeWidth="2.5" />
      <rect x={module.x0} y={module.top} width={module.x1 - module.x0} height={jibY - module.top + 4} rx="34" fill="#f3f5ff" stroke={INK} strokeWidth="4" />
      <rect x={module.x0 + 4} y={module.top + 40} width={module.x1 - module.x0 - 8} height="10" fill="#ff5d73" />
      {[-44, 0, 44].map((dx) => (
        <circle key={dx} cx={x + dx} cy={module.top + 22} r="10" fill="#bde9ff" stroke={INK} strokeWidth="3" />
      ))}
      <Blinker x={module.x0 + 8} y={module.top + 4} t={t} />
      <Blinker x={jib1} y={jibY - 12} t={t} phase={2} />
      {/* The power cable from the switch to the magnet */}
      <path d={svgLine(cable)} fill="none" stroke={INK} strokeWidth="8" strokeLinejoin="round" />
      <path d={svgLine(cable)} fill="none" stroke={on ? "#ffd23f" : "#9a8a50"} strokeWidth="4" strokeLinejoin="round" />
      {on && t >= 0 && <path d={svgLine(cable)} fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="4 26" strokeDashoffset={-t * 90} />}
      {/* The clamp and the magnet's cable */}
      <path
        d={`M${MAGNET.x - 20} ${jibLow - 2} L${MAGNET.x + 20} ${jibLow - 2} L${MAGNET.x + 10} ${jibLow + 18} L${MAGNET.x - 10} ${jibLow + 18} Z`}
        fill={DARK_STEEL}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1={MAGNET.x} y1={jibLow + 16} x2={MAGNET.x} y2={drop} stroke={INK} strokeWidth="8" />
      <line x1={MAGNET.x} y1={jibLow + 16} x2={MAGNET.x} y2={drop} stroke={on ? "#ffd23f" : "#9a8a50"} strokeWidth="4" />
      {on && t >= 0 && (
        <line x1={MAGNET.x} y1={jibLow + 16} x2={MAGNET.x} y2={drop} stroke="#fff" strokeWidth="3" strokeDasharray="4 26" strokeDashoffset={-t * 90} />
      )}
      <Magnet on={on} t={t} />
    </g>
  );
}

/** A red horseshoe magnet, upside down; while it is on, little waves come off its ends. */
function Magnet({ on, t }: { on: boolean; t: number }) {
  const { x, y } = MAGNET;
  const pulse = 0.5 + 0.3 * Math.sin(Math.max(0, t) * 8);
  return (
    <g>
      {on && (
        <g fill="none" stroke="#fff3a0" strokeWidth="3.5" strokeLinecap="round" opacity={pulse}>
          <path d={`M${x - 52} ${y + 6} Q${x - 70} ${y + 36} ${x - 44} ${y + 62}`} />
          <path d={`M${x + 52} ${y + 6} Q${x + 70} ${y + 36} ${x + 44} ${y + 62}`} />
          <path d={`M${x - 64} ${y - 2} Q${x - 90} ${y + 36} ${x - 58} ${y + 76}`} />
          <path d={`M${x + 64} ${y - 2} Q${x + 90} ${y + 36} ${x + 58} ${y + 76}`} />
        </g>
      )}
      <path
        d={`M${x - 48} ${y} L${x - 48} ${y - 28} A48 28 0 0 1 ${x + 48} ${y - 28} L${x + 48} ${y} L${x + 20} ${y} L${x + 20} ${y - 28} A20 10 0 0 0 ${x - 20} ${y - 28} L${x - 20} ${y} Z`}
        fill="#ff3b3b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x={x - 48} y={y - 14} width="28" height="14" fill={STEEL} stroke={INK} strokeWidth="3" />
      <rect x={x + 20} y={y - 14} width="28" height="14" fill={STEEL} stroke={INK} strokeWidth="3" />
      <path d={`M${x - 38} ${y - 30} Q${x - 30} ${y - 46} ${x - 12} ${y - 50}`} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

function IronBall({ at }: { at: Pt }) {
  const r = IRON.r;
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <circle r={r} fill={DARK_STEEL} stroke={INK} strokeWidth="3.5" />
      <path d={`M${-r + 6} 0 A${r - 6} ${r - 6} 0 0 0 ${r - 6} 0`} fill="none" stroke="#5b6489" strokeWidth="5" />
      <circle cx="-11" cy="-12" r="8" fill="#fff" opacity="0.65" />
    </g>
  );
}

function PlanetBody({ p, scale }: { p: Planet; scale: number }) {
  const r = p.r;
  let body: ReactNode;
  if (p.kind === "earth")
    body = (
      <>
        <circle r={r} fill="#3a86ff" stroke={INK} strokeWidth="3" />
        <path d="M-22 -14 Q-10 -26 2 -18 Q8 -6 -4 0 Q-16 4 -22 -14 Z M6 10 Q18 4 24 12 Q20 26 8 24 Z" fill="#3ec300" stroke={INK} strokeWidth="2" />
      </>
    );
  else if (p.kind === "saturn")
    body = (
      <>
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 1 ${r * 1.9} 0`} fill="none" stroke={INK} strokeWidth="9" />
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 1 ${r * 1.9} 0`} fill="none" stroke="#ffd9a0" strokeWidth="5" />
        <circle r={r} fill="#ffb703" stroke={INK} strokeWidth="3" />
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 0 ${r * 1.9} 0`} fill="none" stroke={INK} strokeWidth="9" />
        <path d={`M${-r * 1.9} 0 A${r * 1.9} ${r * 0.5} 0 0 0 ${r * 1.9} 0`} fill="none" stroke="#ffd9a0" strokeWidth="5" />
      </>
    );
  else if (p.kind === "mars")
    body = (
      <>
        <circle r={r} fill="#ff7a45" stroke={INK} strokeWidth="3" />
        <circle cx="5" cy="4" r="4" fill="#d9542a" />
      </>
    );
  else
    body = (
      <>
        <circle r={r} fill="#e8e8f0" stroke={INK} strokeWidth="3" />
        <circle cx="4" cy="3" r="3" fill="#b9bdd6" />
      </>
    );
  return (
    <g transform={`scale(${scale})`}>
      {body}
      <circle cx={-r * 0.35} cy={-r * 0.4} r={r * 0.2} fill="#fff" opacity="0.7" />
    </g>
  );
}

/** The mobile: a sun on a cord from the truss, two crossed bars and four planets on strings, turning by `spin` radians. */
function Mobile({ spin }: { spin: number }) {
  const { cx, barY, sun } = MOBILE;
  const spots = PLANETS.map((p) => ({ p, ...planetSpot(p, spin) }));
  const end = (s: (typeof spots)[number]) => ({ x: s.x, y: barY + 8 * s.z });
  const planet = (s: (typeof spots)[number]) => (
    <g key={s.p.kind}>
      <line x1={s.x} y1={end(s).y} x2={s.x} y2={s.y - s.p.r * s.scale} stroke={STEEL} strokeWidth="2.5" />
      <g transform={`translate(${s.x} ${s.y})`}>
        <PlanetBody p={s.p} scale={s.scale} />
      </g>
    </g>
  );
  const bar = (a: (typeof spots)[number], b: (typeof spots)[number]) => (
    <g>
      <line x1={end(a).x} y1={end(a).y} x2={end(b).x} y2={end(b).y} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={end(a).x} y1={end(a).y} x2={end(b).x} y2={end(b).y} stroke="#ffd23f" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
  const sorted = [...spots].sort((a, b) => a.z - b.z);
  return (
    <g>
      {sorted.filter((s) => s.z < 0).map(planet)}
      <line x1={cx} y1={jibLow} x2={cx} y2={sun.y - sun.r} stroke={STEEL} strokeWidth="3" />
      {bar(spots[0], spots[2])}
      {bar(spots[1], spots[3])}
      <g transform={`translate(${cx} ${sun.y}) rotate(${deg(spin) / 4})`}>
        {Array.from({ length: 10 }, (_, i) => (
          <path
            key={i}
            transform={`rotate(${i * 36})`}
            d={`M-8 ${-sun.r + 2} L0 ${-sun.r - 14} L8 ${-sun.r + 2} Z`}
            fill="#ff8c42"
            stroke={INK}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        ))}
      </g>
      <circle cx={cx} cy={sun.y} r={sun.r} fill="#ffd23f" stroke={INK} strokeWidth="3.5" />
      <circle cx={cx - 11} cy={sun.y - 5} r="3.5" fill={INK} />
      <circle cx={cx + 11} cy={sun.y - 5} r="3.5" fill={INK} />
      <path d={`M${cx - 12} ${sun.y + 8} Q${cx} ${sun.y + 20} ${cx + 12} ${sun.y + 8}`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {sorted.filter((s) => s.z >= 0).map(planet)}
    </g>
  );
}

/** The switch box: its handle tips over when the earth knocks it, and the light turns from green to red. */
function LeverBox({ space, t }: { space: Space; t: number }) {
  const on = t < space.tLever;
  return (
    <g>
      <g transform={`translate(${LEVER.x} ${LEVER.y}) rotate(${space.leverTilt(t)})`}>
        <rect x="-5" y={-LEVER.len} width="10" height={LEVER.len} rx="4" fill={STEEL} stroke={INK} strokeWidth="2.5" />
        <circle cy={-LEVER.len} r={LEVER.knob} fill="#ff3b3b" stroke={INK} strokeWidth="3" />
        <circle cx="-4" cy={-LEVER.len - 4} r="3.5" fill="#fff" opacity="0.8" />
      </g>
      <rect x={LEVER.x - 34} y={FLOOR - 36} width="68" height="36" rx="8" fill="#8e7dff" stroke={INK} strokeWidth="3.5" />
      <circle cx={LEVER.x} cy={LEVER.y} r="5" fill={INK} />
      <circle cx={LEVER.x + 21} cy={FLOOR - 16} r="6" fill={on ? GLOW : "#ff5d73"} stroke={INK} strokeWidth="2" />
      <circle cx={LEVER.x - 21} cy={FLOOR - 16} r="6" fill={on ? "#5a4a7a" : "#5a4a7a"} stroke={INK} strokeWidth="2" />
    </g>
  );
}

/* ---------- Telescope, UFO and moon rock ---------- */

/** The telescope's tripod: three legs from the mount down to the ground. It never moves, so it is drawn once. */
const ScopeTripod = memo(function ScopeTripod() {
  const { x, y } = SCOPE.pivot;
  return (
    <g>
      <Beam
        pts={[
          { x: x + 4, y },
          { x: x + 14, y: FLOOR - 4 },
        ]}
        w={5}
        color={DARK_STEEL}
      />
      {[-1, 1].map((side) => (
        <Beam
          key={side}
          pts={[
            { x, y },
            { x: x + side * 58, y: FLOOR - 4 },
          ]}
          w={6}
          color="#ffb703"
        />
      ))}
      {[-1, 1].map((side) => (
        <rect key={side} x={x + side * 58 - 9} y={FLOOR - 8} width="18" height="8" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
      <rect x={x - 12} y={y} width="24" height="22" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The telescope's tube on its mount: it looks down at the mobile until the earth bonks it, then swings round to the sky, and its lens glints. */
function Telescope({ space, t }: { space: Space; t: number }) {
  const { pivot, front, back, lens } = SCOPE;
  const angle = space.scopeAngle(t);
  const tip = scopeTip(angle);
  const glint = t - space.tGlint;
  return (
    <g>
      <g transform={`translate(${pivot.x} ${pivot.y}) rotate(${angle})`}>
        {/* Eyepiece behind, the tube widening to the front, gold rings, and a little finder on top */}
        <rect x={-back - 4} y="-7" width="22" height="14" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
        <path
          d={`M${-back + 14} -10 L${front - 14} -15 L${front - 14} 15 L${-back + 14} 10 Z`}
          fill="#f4f5fb"
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <rect x="18" y="-14" width="16" height="28" fill="#3a86ff" stroke={INK} strokeWidth="2.5" />
        <line x1={-back + 22} y1="-6" x2="10" y2="-7" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        <rect x="-10" y="-22" width="34" height="9" rx="4" fill={STEEL} stroke={INK} strokeWidth="2.5" />
        <rect x={front - 18} y={-lens - 3} width="20" height={2 * lens + 6} rx="5" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <ellipse cx={front + 2} rx="5" ry={lens - 2} fill="#8fd3ff" stroke={INK} strokeWidth="2.5" />
        <circle r="8" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      </g>
      {glint >= 0 && glint < 1.2 && (
        <path
          transform={`translate(${tip.x} ${tip.y}) scale(${2.2 * Math.exp(-glint * 2.5)}) rotate(${glint * 90})`}
          d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z"
          fill="#fff7d6"
        />
      )}
    </g>
  );
}

const UFO_LIGHTS = [-60, -30, 0, 30, 60];

/** The UFO with a little one-eyed alien under its glass dome, and its beam down to the ground while it is on. */
function Ufo({ space, t }: { space: Space; t: number }) {
  const ufo = space.ufoAt(t);
  if (!ufo) return null;
  const { pt, scale, tilt, waving, look } = ufo;
  const beam = space.beamAt(t);
  const top = pt.y + UFO_BELOW;
  const rings = beam > 0 ? [0, 1, 2, 3] : [];
  const hand = waving ? { x: 22 + 3 * Math.sin(t * 14), y: -44 + 4 * Math.abs(Math.sin(t * 7)) } : { x: 18, y: -16 };
  return (
    <g>
      {beam > 0 && (
        <g opacity={beam}>
          <path d={`M${pt.x - 24} ${top} L${pt.x + 24} ${top} L${pt.x + 90} ${FLOOR} L${pt.x - 90} ${FLOOR} Z`} fill="#fff3a0" opacity="0.35" />
          <path d={`M${pt.x - 12} ${top} L${pt.x + 12} ${top} L${pt.x + 46} ${FLOOR} L${pt.x - 46} ${FLOOR} Z`} fill="#fffbd0" opacity="0.35" />
          {rings.map((i) => {
            // Rings of light running up the beam.
            const f = (t * 0.7 + i / rings.length) % 1;
            const y = lerp(FLOOR, top, f);
            const half = lerp(90, 24, f);
            return <ellipse key={i} cx={pt.x} cy={y} rx={half} ry={half * 0.18} fill="none" stroke="#fffbd0" strokeWidth="3" opacity={0.8 * (1 - f)} />;
          })}
          <ellipse cx={pt.x} cy={FLOOR - 2} rx="92" ry="12" fill="#fff3a0" opacity="0.5" />
        </g>
      )}
      <g transform={`translate(${pt.x} ${pt.y}) rotate(${tilt}) scale(${scale})`}>
        {/* The alien under the dome */}
        <path d="M-14 -4 Q-16 -20 -10 -24 L10 -24 Q16 -20 14 -4 Z" fill="#b98cff" stroke={INK} strokeWidth="2.5" />
        <line x1="0" y1="-48" x2="5" y2="-60" stroke={INK} strokeWidth="2.5" />
        <circle cx="5" cy="-61" r="4" fill="#ff7bd0" stroke={INK} strokeWidth="1.5" />
        <circle cy="-34" r="16" fill="#b98cff" stroke={INK} strokeWidth="2.5" />
        <circle cy="-37" r="8" fill="#fff" stroke={INK} strokeWidth="2" />
        <circle cx={look.x * 3.5} cy={-37 + look.y * 3.5} r="4" fill={INK} />
        <circle cx={look.x * 3.5 - 1.5} cy={-38.5 + look.y * 3.5} r="1.3" fill="#fff" />
        <path d="M-6 -26 Q0 -21 6 -26" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="-14" x2={hand.x} y2={hand.y} stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <line x1="10" y1="-14" x2={hand.x} y2={hand.y} stroke="#b98cff" strokeWidth="3" strokeLinecap="round" />
        <circle cx={hand.x} cy={hand.y} r="4.5" fill="#b98cff" stroke={INK} strokeWidth="2" />
        {/* The glass dome over it */}
        <path d="M-38 -6 Q-38 -66 0 -66 Q38 -66 38 -6 Z" fill="#bde9ff" opacity="0.3" stroke={INK} strokeWidth="3" />
        <path d="M-26 -30 Q-24 -52 -8 -58" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        {/* The saucer: rim, blinking lights, and the beam's lamp underneath */}
        <ellipse cy="14" rx="32" ry="10" fill={beam > 0 ? "#fff3a0" : DARK_STEEL} stroke={INK} strokeWidth="3" />
        <ellipse rx="82" ry="20" fill={STEEL} stroke={INK} strokeWidth="3.5" />
        <path d="M-80 -2 Q0 -18 80 -2" fill="none" stroke="#ff5d73" strokeWidth="5" />
        <path d="M-60 -10 Q-30 -16 -10 -16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        {UFO_LIGHTS.map((x, i) => {
          const on = Math.floor(t * 6) % UFO_LIGHTS.length === i;
          return (
            <circle
              key={x}
              cx={x}
              cy={8 - Math.abs(x) * 0.06}
              r="5.5"
              fill={on ? "#ffd23f" : BAR_COLORS[i]}
              stroke={INK}
              strokeWidth="2"
              opacity={on ? 1 : 0.75}
            />
          );
        })}
      </g>
    </g>
  );
}

const ROCK_SHAPE = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * 2 * Math.PI;
  const r = ROCK.r * (0.86 + 0.18 * Math.sin(i * 2.7));
  return { x: r * Math.cos(a), y: r * Math.sin(a) * 0.9 };
});

/** The lumpy moon rock with a pink crystal, which sparkles while it is in the UFO's beam. */
function MoonRock({ space, t }: { space: Space; t: number }) {
  const { pt, spin } = space.rockAt(t);
  const inBeam = space.beamAt(t) > 0 && t < space.tRelease;
  return (
    <g transform={`translate(${pt.x} ${pt.y})`}>
      {inBeam && <circle r={ROCK.r + 12} fill="#fff3a0" opacity={0.3 + 0.15 * Math.sin(t * 10)} />}
      <g transform={`rotate(${spin})`}>
        <path d={`${svgLine(ROCK_SHAPE)} Z`} fill="#b7aed6" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-7" cy="5" r="5" fill="#968cbf" />
        <circle cx="9" cy="8" r="3.5" fill="#968cbf" />
        <path d="M2 -16 L8 -30 L14 -16 Z M-4 -14 L-6 -25 L3 -16 Z" fill="#ff9bd7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="-8" cy="-7" r="3" fill="#fff" opacity="0.7" />
      </g>
    </g>
  );
}

/* ---------- Countdown board ---------- */

const LAMP_COLORS = ["#ff3b3b", "#ff8c42", "#ffd23f"];

/** The dark opening of the slot on top of the board, behind the iron ball. */
function SlotHole() {
  return <ellipse cx={SLOT.x} cy={BOARD.y - SLOT.h} rx={SLOT.w / 2 - 6} ry="10" fill="#10163a" stroke={INK} strokeWidth="3" />;
}

/** The board wakes up when the iron ball drops into its slot, then counts down: three lamps one after the other, then all green for the start. */
function CountdownBoard({ space, t }: { space: Space; t: number }) {
  // The word on the screen at lift-off, as the voice says it (`t` is the time here).
  const liftWord = useT()({ de: "START!", en: "LIFTOFF!", zh: "发射！", hi: "उड़ान!", es: "¡DESPEGUE!", ar: "انطلاق!", ru: "ПУСК!" });
  const { x, y, w, h } = BOARD;
  const step = space.countAt(t);
  const awake = t >= space.tWake;
  const tStep = step === 0 ? 0 : step === 4 ? space.tLift : space.tCount[step - 1];
  const popUp = 1 + 0.35 * Math.exp(-(t - tStep) * 8);
  const cx = x + w / 2;
  const screen = { y: y + 82, h: h - 104 };
  const cy = screen.y + screen.h / 2;
  const slotL = SLOT.x - SLOT.w / 2;
  return (
    <g>
      {/* The slot box the iron ball drops into */}
      <path
        d={`M${slotL} ${y - SLOT.h} A${SLOT.w / 2 - 6} 10 0 0 0 ${slotL + SLOT.w} ${y - SLOT.h} L${slotL + SLOT.w - 6} ${y + 4} L${slotL + 6} ${y + 4} Z`}
        fill="#ffb703"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d={`M${slotL + 14} ${y - SLOT.h + 16} L${slotL + 16} ${y - 6}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <path d={`M${slotL} ${y - SLOT.h} A${SLOT.w / 2 - 6} 10 0 0 1 ${slotL + SLOT.w} ${y - SLOT.h}`} fill="none" stroke={INK} strokeWidth="3.5" />
      {[x + 40, x + w - 56].map((lx) => (
        <rect key={lx} x={lx} y={y + h - 10} width="16" height={FLOOR - y - h + 10} rx="4" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x} y={y} width={w} height={h} rx="18" fill="#3d4a7a" stroke={INK} strokeWidth="4" />
      {[0, 1, 2].map((i) => {
        const lit = step >= i + 1;
        const color = step === 4 ? GLOW : LAMP_COLORS[i];
        const lx = x + w * (0.25 + 0.25 * i);
        return (
          <g key={i}>
            {lit && <circle cx={lx} cy={y + 42} r="36" fill={color} opacity="0.3" />}
            <circle cx={lx} cy={y + 42} r="24" fill={lit ? color : "#2a2f55"} stroke={INK} strokeWidth="3.5" />
            <circle cx={lx - 7} cy={y + 35} r="5.5" fill="#fff" opacity={lit ? 0.8 : 0.25} />
          </g>
        );
      })}
      <rect x={x + 40} y={screen.y} width={w - 80} height={screen.h} rx="12" fill="#10163a" stroke={INK} strokeWidth="3" />
      {awake && <rect x={x + 46} y={screen.y + 6} width={w - 92} height={screen.h - 12} rx="8" fill={GLOW} opacity="0.08" />}
      {step === 0 &&
        [-1, 0, 1].map((i) => <circle key={i} cx={cx + i * 36} cy={cy} r="8" fill={awake && Math.floor(t * 5) % 3 === i + 1 ? GLOW : "#2e3a70"} />)}
      {step > 0 && (
        <text
          x={cx}
          y={cy}
          transform={`translate(${cx} ${cy}) scale(${popUp}) translate(${-cx} ${-cy})`}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={step === 4 ? 70 : 100}
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          fill={step === 4 ? GLOW : LAMP_COLORS[step - 1]}
        >
          {step === 4 ? liftWord : 4 - step}
        </text>
      )}
    </g>
  );
}

/* ---------- Launch tower, fuel tank, rocket ---------- */

function LaunchTower({ angle, t }: { angle: number; t: number }) {
  const len = ROCKET.x - ROCKET.w / 2 - TOWER_ARM.x;
  return (
    <g>
      <Lattice x={TOWER.x} w={TOWER.w} top={TOWER.top} />
      <rect x={TOWER.x - TOWER.w / 2 - 14} y={TOWER.top - 16} width={TOWER.w + 28} height="18" rx="5" fill="#ffb703" stroke={INK} strokeWidth="3" />
      <Blinker x={TOWER.x} y={TOWER.top - 30} t={t} phase={1} />
      <rect x={TOWER.x - TOWER.w / 2 - 22} y={FLOOR - 22} width={TOWER.w + 44} height="22" rx="5" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
      <g transform={`translate(${TOWER_ARM.x} ${TOWER_ARM.y}) rotate(${angle})`}>
        <line x1="4" y1="-40" x2={len - 6} y2="-40" stroke={STEEL} strokeWidth="4" />
        {[16, len / 2, len - 10].map((lx) => (
          <line key={lx} x1={lx} y1="-40" x2={lx} y2="-10" stroke={STEEL} strokeWidth="3" />
        ))}
        <rect x="0" y="-10" width={len} height="22" rx="5" fill="#ffb703" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={TOWER_ARM.x} cy={TOWER_ARM.y} r="8" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
}

function Pad() {
  const { x0, x1 } = PAD;
  return (
    <g>
      <rect x={x0} y={ROCKET.bottom} width={x1 - x0} height={FLOOR - ROCKET.bottom + 4} rx="6" fill={DARK_STEEL} stroke={INK} strokeWidth="4" />
      {Array.from({ length: Math.floor((x1 - x0 - 20) / 40) }, (_, i) => (
        <path key={i} d={`M${x0 + 16 + i * 40} ${FLOOR - 6} l14 -26 h14 l-14 26 Z`} fill="#ffd23f" />
      ))}
    </g>
  );
}

function Tank() {
  const { x, w, h } = TANK;
  return (
    <g>
      {[x + 16, x + w - 30].map((lx) => (
        <rect key={lx} x={lx} y={FLOOR - 40} width="14" height="40" fill={STEEL} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x} y={FLOOR - h} width={w} height={h - 30} rx={w / 2} fill="#f4f5fb" stroke={INK} strokeWidth="4" />
      <rect x={x} y={FLOOR - h * 0.62} width={w} height="34" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <path d={`M${x + w / 2} ${FLOOR - h + 46} q-16 24 0 34 q16 -10 0 -34 Z`} fill="#3a86ff" stroke={INK} strokeWidth="2.5" />
      <rect x={x + 16} y={FLOOR - h + 30} width="8" height="60" rx="4" fill="#fff" />
      <rect x={HOSE.from.x - 14} y={HOSE.from.y - 12} width="18" height="24" rx="4" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The fuel hose from the tank to the rocket; `drop` goes from 0 (plugged in) to 1 (lying on the ground). */
function Hose({ drop }: { drop: number }) {
  const { from, plug, dropped } = HOSE;
  const tip = hop(plug, dropped, 30, drop);
  const bend = {
    x: lerp((from.x + plug.x) / 2, (from.x + dropped.x) / 2, drop),
    y: lerp(from.y + 40, FLOOR - 6, drop),
  };
  const d = `M${from.x - 12} ${from.y} Q${bend.x} ${bend.y} ${tip.x} ${tip.y}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth="20" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#ffb703" strokeWidth="13" strokeLinecap="round" />
      <path d={d} fill="none" stroke={INK} strokeWidth="13" strokeDasharray="6 18" opacity="0.25" />
      <circle cx={tip.x} cy={tip.y} r="11" fill={DARK_STEEL} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The rocket with a teddy astronaut at the window; it lifts off on its flame. */
function Rocket({ space, t }: { space: Space; t: number }) {
  const clip = useId();
  const { w, h, nose } = ROCKET;
  const half = w / 2;
  const rise = space.rocketRise(t);
  const top = -30 - h;
  const waving = t >= space.tCount[0];
  const paw = waving ? { x: 15 + 4 * Math.sin(t * 12), y: -WINDOW_UP - 2 - 5 * Math.abs(Math.sin(t * 6)) } : { x: 12, y: -WINDOW_UP + 18 };
  const plugY = HOSE.plug.y - ROCKET.bottom;
  const fin = (s: number) => (
    <path
      d={`M${s * half} -170 Q${s * (half + 50)} -110 ${s * (half + 46)} 0 L${s * (half + 10)} 0 L${s * half} -30 Z`}
      fill="#ff5d73"
      stroke={INK}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
  );
  return (
    <g transform={`translate(${ROCKET.x} ${ROCKET.bottom - rise})`}>
      <Flame size={space.flameAt(t)} t={t} />
      {fin(-1)}
      {fin(1)}
      <path d="M-34 -32 L34 -32 L46 0 L-46 0 Z" fill={DARK_STEEL} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      <path
        d={`M${-half} -30 L${-half} ${top} Q${-half} ${top - nose * 0.75} 0 ${top - nose} Q${half} ${top - nose * 0.75} ${half} ${top} L${half} -30 Z`}
        fill="#f4f5fb"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${-half * 0.62} ${top - nose * 0.47} Q0 ${top - nose * 0.62} ${half * 0.62} ${top - nose * 0.47}`} fill="none" stroke={INK} strokeWidth="3" />
      <path
        d={`M${-half * 0.62} ${top - nose * 0.47} Q0 ${top - nose * 0.62} ${half * 0.62} ${top - nose * 0.47} Q${half * 0.3} ${top - nose * 0.85} 0 ${top - nose} Q${-half * 0.3} ${top - nose * 0.85} ${-half * 0.62} ${top - nose * 0.47} Z`}
        fill="#ff5d73"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x={-half} y={-110} width={w} height="26" fill="#3a86ff" stroke={INK} strokeWidth="3" />
      <rect x={-half + 14} y={top + 30} width="10" height={h - 80} rx="5" fill="#fff" />
      <rect x={half - 4} y={plugY - 10} width="12" height="20" rx="3" fill={DARK_STEEL} stroke={INK} strokeWidth="2.5" />
      {/* Window with the teddy astronaut */}
      <defs>
        <clipPath id={clip}>
          <circle cy={-WINDOW_UP} r="27" />
        </clipPath>
      </defs>
      <circle cy={-WINDOW_UP} r="27" fill="#bde9ff" />
      <g clipPath={`url(#${clip})`}>
        <circle cy={-WINDOW_UP + 8} r="22" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx="-12" cy={-WINDOW_UP - 6} r="6" fill="#c98a4b" stroke={INK} strokeWidth="2" />
        <circle cx="12" cy={-WINDOW_UP - 6} r="6" fill="#c98a4b" stroke={INK} strokeWidth="2" />
        <circle cy={-WINDOW_UP + 6} r="14" fill="#c98a4b" stroke={INK} strokeWidth="2" />
        <circle cx="-5" cy={-WINDOW_UP + 3} r="2.2" fill={INK} />
        <circle cx="5" cy={-WINDOW_UP + 3} r="2.2" fill={INK} />
        <path d={`M-5 ${-WINDOW_UP + 11} Q0 ${-WINDOW_UP + 15} 5 ${-WINDOW_UP + 11}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx={paw.x} cy={paw.y} r="6" fill="#c98a4b" stroke={INK} strokeWidth="2" />
      </g>
      <circle cy={-WINDOW_UP} r="30" fill="none" stroke={DARK_STEEL} strokeWidth="8" />
      <circle cy={-WINDOW_UP} r="34" fill="none" stroke={INK} strokeWidth="3" />
      <circle cy={-WINDOW_UP} r="26" fill="none" stroke={INK} strokeWidth="3" />
      <path
        d={`M-16 ${-WINDOW_UP - 14} Q-10 ${-WINDOW_UP - 20} -2 ${-WINDOW_UP - 21}`}
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
    </g>
  );
}

/** The flame under the rocket, flickering; `size` is 0 when the engine is off. */
function Flame({ size, t }: { size: number; t: number }) {
  if (size <= 0) return null;
  const len = 200 * size * (1 + 0.12 * Math.sin(t * 41) + 0.08 * Math.sin(t * 23));
  const wide = 36 + 10 * size;
  return (
    <g>
      <path
        d={`M${-wide} 0 Q${-wide - 6} ${len * 0.5} 0 ${len} Q${wide + 6} ${len * 0.5} ${wide} 0 Z`}
        fill="#ff8c42"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d={`M${-wide * 0.6} 0 Q${-wide * 0.6} ${len * 0.35} 0 ${len * 0.66} Q${wide * 0.6} ${len * 0.35} ${wide * 0.6} 0 Z`} fill="#ffd23f" />
      <path d={`M${-wide * 0.28} 0 Q${-wide * 0.28} ${len * 0.18} 0 ${len * 0.34} Q${wide * 0.28} ${len * 0.18} ${wide * 0.28} 0 Z`} fill="#fff" />
    </g>
  );
}

/** Clouds of smoke: a few puffs while the engine warms up, big ones rolling sideways at the start, and a trail after the rocket. */
function Smoke({ space, t }: { space: Space; t: number }) {
  const puffs = [];
  const life = 2.6;
  const every = 0.09;
  for (let i = 0; space.tIgnite + i * every <= Math.min(t, space.tLift + 2.2); i++) {
    const te = space.tIgnite + i * every;
    const age = t - te;
    if (age > life) continue;
    const side = i % 2 ? 1 : -1;
    const fade = 0.9 * (1 - age / life);
    let x: number;
    let y: number;
    let r: number;
    if (te < space.tLift + 0.5) {
      // Rolling away along the ground on both sides of the pad.
      const big = te < space.tLift ? 0.55 : 1;
      x = ROCKET.x + side * (50 + 330 * big * (1 - Math.exp(-age * 1.4)) + (i % 3) * 14);
      y = ROCKET.bottom - 16 - 40 * age * big - (i % 4) * 8;
      r = (20 + 46 * Math.min(age, 1.4)) * big;
    } else {
      x = ROCKET.x + side * (8 + 26 * age);
      y = ROCKET.bottom - space.rocketRise(te) + 60 + 14 * age;
      r = 18 + 34 * Math.min(age, 1.4);
    }
    puffs.push(<circle key={i} cx={x} cy={y} r={r} fill="#f4f5fb" stroke="#b9bdd6" strokeWidth="3" opacity={fade} />);
  }
  return <g>{puffs}</g>;
}
