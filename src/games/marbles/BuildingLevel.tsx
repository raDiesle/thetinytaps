import { memo, useId, useMemo } from "react";
import { wobble, VIEW_H, type LevelProps, decay } from "./level";
import {
  BALL,
  BEAM_Y,
  BELT,
  BELT_LEN,
  BELT_N,
  BELT_SKIN,
  BELT_U,
  BOARD,
  buildBuilding,
  CHUTE,
  CONE,
  CRANE,
  DECK1,
  DECK2,
  DRIVER,
  EXC,
  FLOOR,
  FOOT_PULLEY,
  GEN,
  HEAP,
  HOUSE,
  JACK,
  LADDER,
  LIGHT_X,
  MIXER,
  moundY,
  onScoop,
  PILE,
  PIPE,
  PIVOT,
  PLUG_X,
  PUDDLE,
  POLE_X,
  ROLLER,
  ROOF,
  SACK,
  SCAFFOLD_POLES,
  SCOOP,
  SHIFT,
  ARM,
  SPIRIT,
  SPOOL,
  STACK,
  TOP_DECK,
  TOP_PULLEY,
  TOWER,
  TROLLEY_X,
  TRUCK_X,
  VIAL_X,
  WINCH,
  WORLD_W,
  crankKnob,
  type Building,
} from "./building";
import { deg, rad } from "./machineKit";
import { MachineStage } from "./MachineStage";
import { CabDriver, DARK_WOOD, INK, MARBLE_COLOR, MID_WOOD, Sparkles, WOOD } from "./scenery";
import { BALL_R, type Pt } from "./path";
import { BAR_COLORS, Ball, type ScreenAt, Sprite, still } from "./parts";

/** The sky behind the building site. */
const SKY = "#bfe9ff";
const STEEL = "#9fb0c4";
const ORANGE = "#ff8c42";
const YELLOW = "#ffb703";
const BRICK = "#e0533d";

/**
 * The building site: one tap starts the motors, and then one thing sets off
 * the next for about a minute: the cement mixer tips the marble onto a
 * spirit level, it rattles down the rubble chute, rides the conveyor belt up
 * and knocks over a traffic cone, which lets the wrecking ball go. The ball
 * smashes a brick tower, which bumps a cable drum along the scaffold and plop
 * into a sand pile, over it and against the excavator. The excavator wakes up,
 * digs a scoop of sand, swings round and tips it in front of the road roller
 * and pats the roller's roof; the roller puffs off, presses the sand into a
 * road and bumps the jackhammer, which rattles and hops onto the generator's
 * start button. Its spark runs along the cable to the pile driver, which thumps
 * a post in three times; the last thump makes a concrete pipe jump off its
 * chocks and roll through a puddle against a ladder's foot, the ladder's top
 * lifts a cement sack off the brick stack onto the winch's crank, and the tower
 * crane lowers the roof onto the house. The camera travels along
 * with whatever moves.
 */
export function BuildingLevel(props: LevelProps) {
  const machine = useMemo(buildBuilding, []);
  const ids = useId();
  // Until it has rolled out of the drum's mouth, the marble is drawn behind the mixer, so it stays hidden inside.
  const inMixer = (t: number) => machine.marbleAt(t).pt.x < SPIRIT.from.x;

  // The backdrop never changes: a layer of its own, painted once.
  const backdrop = useMemo(
    () => [
      {
        content: (
          <>
            <Site ids={ids} />
            <Scaffold />
          </>
        ),
      },
    ],
    [ids],
  );

  return (
    <MachineStage
      back={backdrop}
      machine={machine}
      level="building"
      start={{ x: MIXER.x + 6, y: MIXER.y, r: 96 }}
      over={(t, at) => <BeltMoving at={at} travel={machine.beltTravel(t)} phase={machine.cleatPhase} />}
      {...props}
    >
      {(t) => (
        <>
          {inMixer(t) && <Marble machine={machine} t={t} />}
          <Mixer angle={machine.drumAngle(t)} spin={machine.drumSpin(t)} />
          <SpiritLevel age={t - machine.tVial} />
          <BeltMotor running={t >= 0} />
          <Belt />
          <Deck1 />
          <Board />
          <Deck2 />
          <Cable machine={machine} t={t} />
          <Tower angle={machine.towerAngle(t)} />
          <Pile machine={machine} t={t} />
          <Puddle />
          <PileDriver machine={machine} t={t} />
          <Pipe machine={machine} t={t} />
          <Splash pts={machine.splashAt(t)} />
          <Stack />
          <Ladder machine={machine} t={t} />
          <Winch turned={machine.crankAt(t)} />
          <Sack machine={machine} t={t} />
          <Crane drop={machine.roofDrop(t)} />
          <House />
          <Roof drop={machine.roofDrop(t)} />
          <TopOutTree drop={machine.roofDrop(t)} age={t - machine.tTree} />
          <TrafficLight green={t >= machine.tGreen} />
          <Truck gone={machine.truckGone(t)} />
          <Spool machine={machine} t={t} />
          {/* The excavator stands behind the roller, so its arm reaches over it */}
          <Excavator machine={machine} t={t} />
          <Road machine={machine} t={t} />
          <Roller machine={machine} t={t} />
          <Pour machine={machine} t={t} />
          <PowerCable machine={machine} t={t} />
          <Generator machine={machine} t={t} />
          <Jackhammer machine={machine} t={t} />
          <Cone angle={machine.coneAngle(t)} />

          {!inMixer(t) && <Marble machine={machine} t={t} />}
          <Chute />
          <WreckingBall machine={machine} t={t} />
          <Sparkles x={(HOUSE.x0 + HOUSE.x1) / 2} y={HOUSE.top - ROOF.h} age={t - machine.tTree} n={12} spread={260} />
        </>
      )}
    </MachineStage>
  );
}

function Marble({ machine, t }: { machine: Building; t: number }) {
  const { pt, spin } = machine.marbleAt(t);
  return <Ball color={MARBLE_COLOR} x={pt.x} y={pt.y} spin={spin} />;
}

/* ---------- The site ---------- */

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff">
      <circle cx="-50" cy="10" r="30" />
      <circle cx="0" cy="-6" r="42" />
      <circle cx="52" cy="8" r="32" />
      <rect x="-80" y="10" width="164" height="30" rx="15" />
    </g>
  );
}

/** Sky, hills, the site fence and the sandy ground. */
const Site = still(function Site({ ids }: { ids: string }) {
  const sky = `${ids}-sky`;
  const mesh = `${ids}-mesh`;
  const panels = Math.ceil((WORLD_W + 800) / 240);
  return (
    <g>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd8ff" />
          <stop offset="0.6" stopColor={SKY} />
          <stop offset="1" stopColor="#e4f6ff" />
        </linearGradient>
        <pattern id={mesh} width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M0 0 L16 0 M0 0 L0 16" stroke="#a9b6c6" strokeWidth="2" fill="none" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${sky})`} />
      <circle cx="1180" cy="100" r="58" fill="#ffd23f" />
      <circle cx="1180" cy="100" r="74" fill="#ffd23f" opacity="0.25" />
      <Cloud x={620} y={90} s={0.8} />
      <Cloud x={2350} y={110} />
      <Cloud x={2980} y={260} s={0.7} />
      <Cloud x={3900} y={150} s={0.8} />
      <Cloud x={4800} y={120} s={0.9} />
      <Cloud x={5900} y={200} s={0.7} />
      <Cloud x={4700 + SHIFT} y={90} s={0.9} />
      <path
        d={`M-400 ${FLOOR - 120} Q400 ${FLOOR - 260} 1200 ${FLOOR - 140} T2800 ${FLOOR - 150} T4400 ${FLOOR - 130} T${WORLD_W + 400} ${FLOOR - 160} L${WORLD_W + 400} ${FLOOR} L-400 ${FLOOR} Z`}
        fill="#b6e3a0"
      />
      {/* The site fence: mesh panels on red and white feet */}
      <rect x="-400" y={FLOOR - 120} width={WORLD_W + 800} height="104" fill={`url(#${mesh})`} opacity="0.8" />
      {Array.from({ length: panels }, (_, i) => {
        const x = -400 + i * 240;
        return (
          <g key={i}>
            <rect x={x} y={FLOOR - 122} width="240" height="108" fill="none" stroke="#8a99ab" strokeWidth="5" />
            <rect x={x - 18} y={FLOOR - 18} width="36" height="18" rx="4" fill={i % 2 ? "#fff" : "#ff5d73"} stroke={INK} strokeWidth="2" />
          </g>
        );
      })}
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#d9a066" />
      {Array.from({ length: 60 }, (_, i) => (
        <ellipse key={i} cx={-300 + i * 93 + ((i * 37) % 50)} cy={FLOOR + 24 + ((i * 29) % 60)} rx={6 + (i % 3) * 3} ry={4 + (i % 2) * 2} fill="#c48a52" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
      <SandPile x={1180} w={260} h={70} />
      <SandPile x={4900 + SHIFT} w={300} h={90} />
      <Bags x={2470} />
      <TrafficCone x={1160} y={FLOOR} />
      <TrafficCone x={3600 + SHIFT} y={FLOOR} />
    </g>
  );
});

function SandPile({ x, w, h }: { x: number; w: number; h: number }) {
  return (
    <g>
      <path
        d={`M${x - w / 2} ${FLOOR} Q${x - w / 4} ${FLOOR - h * 1.1} ${x} ${FLOOR - h} Q${x + w / 4} ${FLOOR - h * 1.1} ${x + w / 2} ${FLOOR} Z`}
        fill="#f2c46d"
        stroke={INK}
        strokeWidth="3"
      />
      <path d={`M${x - w / 5} ${FLOOR - h * 0.6} q20 -14 40 -10`} stroke="#fff6" strokeWidth="6" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Cement bags stacked on a pallet under the deck. */
function Bags({ x }: { x: number }) {
  return (
    <g>
      <rect x={x - 80} y={FLOOR - 16} width="160" height="16" fill={MID_WOOD} stroke={INK} strokeWidth="2.5" />
      {[
        [-74, 0],
        [-2, 0],
        [-38, 1],
      ].map(([dx, row]) => (
        <rect key={`${dx}${row}`} x={x + dx} y={FLOOR - 16 - 34 * (row + 1)} width="72" height="34" rx="10" fill="#e8e3d3" stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
}

/** A traffic cone standing on the ground, its foot's middle at (x, y). */
function TrafficCone({ x, y, scale = 0.7 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ConeShape />
    </g>
  );
}

/** A traffic cone, its foot's middle at (0, 0), as tall as CONE. */
const ConeShape = memo(function ConeShape() {
  const { w, h } = CONE;
  return (
    <g>
      <path d={`M-24 -12 L-6 ${-h} L6 ${-h} L24 -12 Z`} fill="#ff6b1a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M-18 -34 L-13 -54 L13 -54 L18 -34 Z`} fill="#fff" />
      <path d={`M-10 -66 L-8 -78 L8 -78 L10 -66 Z`} fill="#fff" />
      <rect x={-w / 2} y="-14" width={w} height="14" rx="4" fill="#3b3b4f" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/* ---------- Mixer, spirit level and chute ---------- */

const Scaffold = memo(function Scaffold() {
  const y0 = TOP_DECK.y;
  const ledgers = [420, 620];
  return (
    <g>
      {SCAFFOLD_POLES.map((x, i) => {
        // Only the outer pole sticks up as a railing post; the next one ends under the spirit level.
        const top = [y0 - 50, y0, 260, 260][i];
        return <rect key={x} x={x - 6} y={top} width="12" height={FLOOR - top} fill={STEEL} stroke={INK} strokeWidth="2.5" />;
      })}
      {ledgers.map((y) => (
        <rect
          key={y}
          x={SCAFFOLD_POLES[0] - 14}
          y={y}
          width={SCAFFOLD_POLES[3] - SCAFFOLD_POLES[0] + 28}
          height="10"
          fill={STEEL}
          stroke={INK}
          strokeWidth="2.5"
        />
      ))}
      {/* The ledger under the spirit level, and braces across each bay */}
      <rect
        x={SCAFFOLD_POLES[1] - 10}
        y={SPIRIT.to.y + BALL_R + 32}
        width={SCAFFOLD_POLES[2] - SCAFFOLD_POLES[1] + 210}
        height="10"
        fill={STEEL}
        stroke={INK}
        strokeWidth="2.5"
      />
      {SCAFFOLD_POLES.slice(0, 3).map((x, i) => (
        <line key={x} x1={x} y1={ledgers[1]} x2={SCAFFOLD_POLES[i + 1]} y2={ledgers[0] + 10} stroke={STEEL} strokeWidth="6" opacity="0.8" />
      ))}
      {/* The mixer's deck, with a ladder up to it */}
      <rect x={TOP_DECK.x0} y={y0} width={TOP_DECK.x1 - TOP_DECK.x0} height="16" rx="3" fill={WOOD} stroke={INK} strokeWidth="3" />
      <rect x={TOP_DECK.x0} y={y0 + 16} width={TOP_DECK.x1 - TOP_DECK.x0} height="8" fill={DARK_WOOD} />
      {[110, 160].map((x) => (
        <line key={x} x1={x} y1={y0 + 24} x2={x} y2={FLOOR} stroke={MID_WOOD} strokeWidth="7" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1="110" y1={y0 + 70 + i * 50} x2="160" y2={y0 + 70 + i * 50} stroke={MID_WOOD} strokeWidth="6" />
      ))}
      {/* The arm the rubble chute hangs from */}
      <rect x={CHUTE.x - 24} y={CHUTE.top - 22} width={SCAFFOLD_POLES[3] - CHUTE.x + 30} height="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      {[-20, 20].map((dx) => (
        <line
          key={dx}
          x1={CHUTE.x + dx}
          y1={CHUTE.top - 12}
          x2={CHUTE.x + dx * 1.6}
          y2={CHUTE.top + 2}
          stroke="#6b6b80"
          strokeWidth="3"
          strokeDasharray="5 3"
        />
      ))}
    </g>
  );
});

/** The cement mixer on its stand; `angle` tilts the drum, `spin` turns its stripes round. */
const Mixer = still(function Mixer({ angle, spin }: { angle: number; spin: number }) {
  const { x, y } = MIXER;
  const floor = TOP_DECK.y;
  const half = (sx: number) => (sx < 30 ? 40 + (18 * (sx + 72)) / 102 : 58 - (28 * (sx - 30)) / 70);
  const drum = "M-72 -40 Q-94 0 -72 40 L30 58 L100 30 L100 -30 L30 -58 Z";
  return (
    <g>
      {/* Motor, stand and wheel */}
      <rect x={x - 156} y={floor - 50} width="62" height="50" rx="6" fill="#5a6b80" stroke={INK} strokeWidth="3" />
      <rect x={x - 146} y={floor - 40} width="20" height="8" rx="3" fill="#3ec300" />
      <path d={`M${x - 66} ${floor} L${x} ${y + 14} L${x + 56} ${floor}`} fill="none" stroke="#4a4a5e" strokeWidth="11" strokeLinejoin="round" />
      <circle cx={x - 84} cy={floor - 18} r="18" fill="#3b3b4f" stroke={INK} strokeWidth="3" />
      <circle cx={x - 84} cy={floor - 18} r="6" fill="#d8d8e4" />
      <g transform={`translate(${x} ${y}) rotate(${angle})`}>
        <path d={drum} fill={ORANGE} />
        {Array.from({ length: 4 }, (_, k) => {
          const sx = ((((k * 46 + spin * 70) % 184) + 184) % 184) - 70;
          if (sx > 92) return null;
          const h = half(sx) - 3;
          return <line key={k} x1={sx} y1={-h} x2={sx + 10} y2={h} stroke="#ffd23f" strokeWidth="9" />;
        })}
        <path d={drum} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <ellipse cx="100" cy="0" rx="10" ry="30" fill="#6b4422" stroke={INK} strokeWidth="3" />
        <path d="M-50 -34 Q-10 -46 24 -44" stroke="#fff8" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <circle cx={x} cy={y} r="9" fill="#4a4a5e" stroke={INK} strokeWidth="3" />
    </g>
  );
});

/** The big spirit level; its bubble wobbles `age` seconds after the marble rolled over the vial. */
function SpiritLevel({ age }: { age: number }) {
  const { from, to } = SPIRIT;
  const len = Math.hypot(to.x - from.x, to.y - from.y) + 16;
  const slope = deg(Math.atan2(to.y - from.y, to.x - from.x));
  const mid = VIAL_X - from.x + 8;
  const bubble = -16 + wobble(age, 14, 16, 2.5);
  return (
    <g transform={`translate(${from.x - 8} ${from.y + BALL_R}) rotate(${slope})`}>
      <rect x="0" y="0" width={len} height="30" rx="5" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <rect x="0" y="0" width="18" height="30" rx="5" fill="#3b3b4f" />
      <rect x={len - 18} y="0" width="18" height="30" rx="5" fill="#3b3b4f" />
      <rect x={mid - 44} y="6" width="88" height="18" rx="9" fill="#d5f5a8" stroke={INK} strokeWidth="2.5" />
      <line x1={mid - 14} y1="6" x2={mid - 14} y2="24" stroke={INK} strokeWidth="2" />
      <line x1={mid + 14} y1="6" x2={mid + 14} y2="24" stroke={INK} strokeWidth="2" />
      <ellipse cx={mid + bubble} cy="15" rx="11" ry="6" fill="#fff" stroke="#7fb36a" strokeWidth="2" />
      {[0.2, 0.32, 0.68, 0.8].map((f) => (
        <line key={f} x1={len * f} y1="20" x2={len * f} y2="30" stroke={INK} strokeWidth="2" />
      ))}
      <rect x="22" y="4" width={mid - 72} height="5" rx="2.5" fill="#fff8" />
    </g>
  );
}

/** The rubble chute: see-through orange cones hanging one in the next, drawn in front of the marble. */
const Chute = memo(function Chute() {
  const { x, top, n, h, step, wTop, wBottom } = CHUTE;
  return (
    <g>
      {Array.from({ length: n }, (_, k) => {
        const y = top + k * step;
        return (
          <g key={k}>
            <path
              d={`M${x - wTop / 2} ${y} L${x + wTop / 2} ${y} L${x + wBottom / 2} ${y + h} L${x - wBottom / 2} ${y + h} Z`}
              fill={ORANGE}
              fillOpacity="0.5"
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x={x - wTop / 2 - 4} y={y - 4} width={wTop + 8} height="12" rx="5" fill="#ff6b1a" stroke={INK} strokeWidth="3" />
            <path d={`M${x - wTop / 2 + 12} ${y + 14} L${x - wBottom / 2 + 6} ${y + h - 8}`} stroke="#fff9" strokeWidth="5" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
});

/* ---------- Conveyor belt ---------- */

/** The belt's motor box at its low end, its top left corner; its wheel turns at `x + 66`, `y + 30` (`BeltMoving`). */
const MOTOR = { x: BELT.a.x - 112, y: FLOOR - 92 };

/** The belt's motor box at its low end; the lamp shines while it runs. */
const BeltMotor = still(function BeltMotor({ running }: { running: boolean }) {
  const { x, y } = MOTOR;
  return (
    <g>
      <line x1={x + 66} y1={y + 30} x2={BELT.a.x} y2={BELT.a.y} stroke="#3b3b4f" strokeWidth="6" />
      <rect x={x} y={y} width="84" height="92" rx="8" fill="#5a6b80" stroke={INK} strokeWidth="3.5" />
      <circle cx={x + 22} cy={y + 20} r="8" fill={running ? "#3ec300" : "#2c5a2c"} stroke={INK} strokeWidth="2" />
      {[0, 1, 2].map((k) => (
        <line key={k} x1={x + 12} y1={y + 50 + k * 12} x2={x + 52} y2={y + 50 + k * 12} stroke="#3b4a5c" strokeWidth="4" strokeLinecap="round" />
      ))}
    </g>
  );
});

/** Where a point `s` along the belt and `off` off its middle line lies, from end `p`. */
const onBelt = (p: Pt, s: number, off: number): Pt => ({ x: p.x + s * BELT_U.x + off * BELT_N.x, y: p.y + s * BELT_U.y + off * BELT_N.y });

/** The belt's frame, legs and band: everything of it that never moves. */
const Belt = memo(function Belt() {
  const { a, b, r } = BELT;
  const R = r + 2;
  const p1 = onBelt(a, 0, R);
  const p2 = onBelt(b, 0, R);
  const p3 = onBelt(b, 0, -R);
  const p4 = onBelt(a, 0, -R);
  return (
    <g>
      {/* Legs and the frame under the belt */}
      {[150, 330, 470].map((s) => {
        const p = onBelt(a, s, 0);
        return <rect key={s} x={p.x - 7} y={p.y} width="14" height={FLOOR - p.y} fill={STEEL} stroke={INK} strokeWidth="2.5" />;
      })}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6b7a8f" strokeWidth={2 * r - 8} strokeLinecap="round" />
      <path
        d={`M${p1.x} ${p1.y} L${p2.x} ${p2.y} A${R} ${R} 0 0 1 ${p3.x} ${p3.y} L${p4.x} ${p4.y} A${R} ${R} 0 0 1 ${p1.x} ${p1.y}`}
        fill="none"
        stroke="#3b3b4f"
        strokeWidth="8"
      />
    </g>
  );
});

/** A cleat, drawn along x round 0, 0 (`BeltMoving` turns it across the belt). */
const Cleat = memo(function Cleat() {
  return (
    <g strokeLinecap="round">
      <line x1="-7" y1="0" x2="7" y2="0" stroke={INK} strokeWidth="10" />
      <line x1="-7" y1="0" x2="7" y2="0" stroke={YELLOW} strokeWidth="5" />
    </g>
  );
});

/** A roller of radius `r` with its cross, round 0, 0. */
const BeltRoller = memo(function BeltRoller({ r }: { r: number }) {
  return (
    <g>
      <circle r={r - 2} fill="#d8d8e4" stroke={INK} strokeWidth="3" />
      <line x1={-r + 6} y1="0" x2={r - 6} y2="0" stroke={INK} strokeWidth="3" />
      <line x1="0" y1={-r + 6} x2="0" y2={r - 6} stroke={INK} strokeWidth="3" />
    </g>
  );
});

/**
 * What moves on the conveyor belt – its cleats, its two rollers and the motor's wheel – as sprites over the machine, each
 * placed from `travel` (the belt's way so far), so a cleat still pushes the marble exactly. Drawn into the machine's svg,
 * the cleats moving along the whole slanted belt rastered the band from its foot to its top, two fifths of the picture's
 * height, in every frame (perf, November 2026: the Baustelle's start 48 screens a second, budget 30).
 */
function BeltMoving({ at, travel, phase }: { at: ScreenAt; travel: number; phase: number }) {
  const { a, b, r, gap } = BELT;
  const R = r + 2;
  const loop = 2 * BELT_LEN + 2 * Math.PI * R;
  const across = Math.atan2(BELT_N.y, BELT_N.x);
  const cleats = [];
  for (let k = 0; k * gap < loop; k++) {
    const s = (((phase + k * gap + travel) % loop) + loop) % loop;
    let base: Pt;
    let dir: number;
    if (s <= BELT_LEN) {
      base = onBelt(a, s, BELT_SKIN);
      dir = 1;
    } else if (s >= BELT_LEN + Math.PI * R && s <= 2 * BELT_LEN + Math.PI * R) {
      base = onBelt(b, -(s - BELT_LEN - Math.PI * R), -BELT_SKIN);
      dir = -1;
    } else continue;
    // The cleat stands 14 out from the band; its sprite turns about its middle, 7 out.
    cleats.push(
      <Sprite key={k} at={at} x={base.x + dir * 7 * BELT_N.x} y={base.y + dir * 7 * BELT_N.y} pad={14} angle={across}>
        <Cleat />
      </Sprite>,
    );
  }
  const roll = travel / r;
  return (
    <>
      {[a, b].map((p) => (
        <Sprite key={p.x} at={at} x={p.x} y={p.y} pad={r} angle={roll}>
          <BeltRoller r={r} />
        </Sprite>
      ))}
      {cleats}
      <Sprite at={at} x={MOTOR.x + 66} y={MOTOR.y + 30} pad={15} angle={travel / 12}>
        <circle r="13" fill="#d8d8e4" stroke={INK} strokeWidth="2.5" />
        <line x1="-9" y1="0" x2="9" y2="0" stroke={INK} strokeWidth="2.5" />
      </Sprite>
    </>
  );
}

/* ---------- Deck with the traffic cone, and the wrecking ball ---------- */

const Deck1 = memo(function Deck1() {
  const { x0, x1, y } = DECK1;
  return (
    <g>
      {[x0 + 20, POLE_X].map((x) => (
        <rect
          key={x}
          x={x - 6}
          y={x === POLE_X ? BEAM_Y : y}
          width="12"
          height={FLOOR - (x === POLE_X ? BEAM_Y : y)}
          fill={STEEL}
          stroke={INK}
          strokeWidth="2.5"
        />
      ))}
      <rect x={x0} y={y + 120} width={x1 - x0} height="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      <line x1={x0 + 20} y1={y + 130} x2={POLE_X} y2={FLOOR - 20} stroke={STEEL} strokeWidth="6" />
      <rect x={x0} y={y} width={x1 - x0} height="16" rx="3" fill={WOOD} stroke={INK} strokeWidth="3" />
      {/* The yellow beam the wrecking ball hangs from, with its brace */}
      <line x1={POLE_X} y1={BEAM_Y + 120} x2={POLE_X + 90} y2={BEAM_Y + 18} stroke={YELLOW} strokeWidth="10" />
      <line x1={POLE_X} y1={BEAM_Y + 120} x2={POLE_X + 90} y2={BEAM_Y + 18} stroke={INK} strokeWidth="2" opacity="0.5" />
      <rect x={POLE_X - 14} y={BEAM_Y} width={PIVOT.x - POLE_X + 48} height="20" rx="3" fill={YELLOW} stroke={INK} strokeWidth="3" />
      {Array.from({ length: 6 }, (_, i) => (
        <circle key={i} cx={POLE_X + 10 + i * ((PIVOT.x - POLE_X) / 5)} cy={BEAM_Y + 10} r="3.5" fill={INK} />
      ))}
      <path
        d={`M${PIVOT.x - 10} ${BEAM_Y + 20} L${PIVOT.x - 10} ${PIVOT.y} L${PIVOT.x + 10} ${PIVOT.y} L${PIVOT.x + 10} ${BEAM_Y + 20}`}
        fill="#7d7d96"
        stroke={INK}
        strokeWidth="2.5"
      />
    </g>
  );
});

/** The board leaning on a brick, which leads the marble down onto the deck. */
const Board = memo(function Board() {
  const { from, to } = BOARD;
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  return (
    <g>
      <rect x={from.x - 12} y={from.y + 6} width="44" height={DECK1.y - from.y - 6} rx="3" fill={BRICK} stroke={INK} strokeWidth="2.5" />
      <g transform={`translate(${from.x} ${from.y}) rotate(${deg(Math.atan2(to.y - from.y, to.x - from.x))})`}>
        <rect x="-10" y="0" width={len + 10} height="11" rx="3" fill={MID_WOOD} stroke={INK} strokeWidth="2.5" />
      </g>
    </g>
  );
});

/** The traffic cone holding the rope's loop; it tips over `angle` radians to the right. */
function Cone({ angle }: { angle: number }) {
  const px = CONE.x + CONE.w / 2;
  return (
    <g transform={`rotate(${deg(angle)} ${px} ${DECK1.y}) translate(${CONE.x} ${DECK1.y})`}>
      <ConeShape />
    </g>
  );
}

function WreckingBall({ machine, t }: { machine: Building; t: number }) {
  const ball = machine.ballAt(t);
  const end = machine.ropeEnd(t);
  const tight = t < machine.tRelease;
  const mid = { x: (ball.x + end.x) / 2, y: (ball.y + end.y) / 2 + (tight ? 0 : 22) };
  return (
    <g>
      <line x1={PIVOT.x} y1={PIVOT.y} x2={ball.x} y2={ball.y} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <line x1={PIVOT.x} y1={PIVOT.y} x2={ball.x} y2={ball.y} stroke="#b9bdd6" strokeWidth="4" strokeDasharray="9 5" />
      <path d={`M${ball.x} ${ball.y} Q${mid.x} ${mid.y} ${end.x} ${end.y}`} fill="none" stroke="#c98a4b" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx={end.x} cy={end.y + (tight ? 4 : 0)} rx="10" ry="6" fill="none" stroke="#c98a4b" strokeWidth="4" />
      <circle cx={ball.x} cy={ball.y} r={BALL.r} fill="#4a4a5e" stroke={INK} strokeWidth="4" />
      <circle cx={ball.x - 15} cy={ball.y - 16} r="11" fill="#fff" opacity="0.35" />
      <circle cx={ball.x} cy={ball.y} r="6" fill="#7d7d96" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/* ---------- Deck with the tower and the cable drum ---------- */

const Deck2 = memo(function Deck2() {
  const { x0, x1, y } = DECK2;
  const poles = [x0 + 20, x0 + 340, x0 + 660, x1 - 16];
  return (
    <g>
      {poles.map((x) => (
        <rect key={x} x={x - 6} y={y} width="12" height={FLOOR - y} fill={STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
      <rect x={x0} y={y + 80} width={x1 - x0} height="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      {poles.slice(0, 3).map((x, i) => (
        <line key={x} x1={x} y1={y + 90} x2={poles[i + 1]} y2={FLOOR - 10} stroke={STEEL} strokeWidth="6" opacity="0.8" />
      ))}
      <rect x={x0} y={y} width={x1 - x0} height="16" rx="3" fill={WOOD} stroke={INK} strokeWidth="3" />
      {/* The power box under the deck that the cable is plugged into */}
      <rect x={PLUG_X - 44} y={y + 22} width="40" height="44" rx="5" fill={YELLOW} stroke={INK} strokeWidth="3" />
      <circle cx={PLUG_X - 24} cy={y + 48} r="7" fill="#3b3b4f" />
      <path d={`M${PLUG_X - 30} ${y + 34} l8 -6 l-3 7 l8 -1 l-9 8`} fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
});

/** The tower of bricks, falling over `angle` radians around its right foot. */
function Tower({ angle }: { angle: number }) {
  const { x, w, brick, n } = TOWER;
  return (
    <g transform={`rotate(${deg(angle)} ${x + w} ${DECK2.y})`}>
      {Array.from({ length: n }, (_, i) => {
        const y = DECK2.y - (i + 1) * brick;
        const dx = i % 2 ? 2 : -2;
        return (
          <g key={i}>
            <rect x={x + dx} y={y} width={w} height={brick} rx="4" fill={i % 2 ? "#c8432f" : BRICK} stroke={INK} strokeWidth="3" />
            <line x1={x + dx + 8} y1={y + 9} x2={x + dx + w - 18} y2={y + 9} stroke="#fff6" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
}

/** The cable from the plug to the drum: along the deck, then down over the edge once the drum has fallen off. */
function Cable({ machine, t }: { machine: Building; t: number }) {
  const { pt } = machine.spoolAt(t);
  const y = DECK2.y - 4;
  const onDeck = pt.x <= DECK2.x1 && pt.y <= DECK2.y - SPOOL.r + 1;
  const start = `M${PLUG_X - 24} ${DECK2.y + 48} Q${PLUG_X + 6} ${DECK2.y + 40} ${PLUG_X + 4} ${DECK2.y + 8} Q${PLUG_X + 4} ${y} ${PLUG_X + 24} ${y}`;
  const d = onDeck ? `${start} L${pt.x} ${y}` : `${start} L${DECK2.x1} ${y} Q${DECK2.x1 + 14} ${y + 6} ${pt.x} ${pt.y + 10}`;
  return <path d={d} fill="none" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" />;
}

/** The wooden cable drum, rolling; the orange ring is the cable still wound on it. */
function Spool({ machine, t }: { machine: Building; t: number }) {
  const { pt, turned } = machine.spoolAt(t);
  const { r, core } = SPOOL;
  const wound = core + (r - 10 - core) * machine.cableLeft(t);
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${deg(turned / r)})`}>
      <circle r={r} fill={WOOD} stroke={INK} strokeWidth="4" />
      <circle r={wound} fill={ORANGE} stroke={INK} strokeWidth="2.5" />
      {wound > core + 4 && <circle r={(wound + core) / 2} fill="none" stroke="#d9692a" strokeWidth="3" />}
      <circle r={core - 8} fill={DARK_WOOD} stroke={INK} strokeWidth="2.5" />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} cx={(r - 6) * Math.cos((k * Math.PI) / 2)} cy={(r - 6) * Math.sin((k * Math.PI) / 2)} r="3.5" fill={DARK_WOOD} />
      ))}
      <circle r="5" fill={INK} />
    </g>
  );
}

/* ---------- Sand pile, excavator, road roller and jackhammer ---------- */

const SAND = "#f2c46d";
const SAND_DARK = "#d9a650";
const ROAD = "#5b5b6e";

/** The sand pile, a scoop lower once it is dug, with sand spraying up where the cable drum plopped in. */
function Pile({ machine, t }: { machine: Building; t: number }) {
  const h = machine.pileH(t);
  const { x, w } = PILE;
  const top: string[] = [];
  for (let px = x - w; px <= x + w; px += 10) top.push(`${px} ${moundY(x, w, h, px)}`);
  const age = machine.plofAge(t);
  const at = machine.spoolAt(machine.tPlof).pt;
  return (
    <g>
      <path d={`M${top.join(" L")} Z`} fill={SAND} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M${x - w * 0.45} ${FLOOR - h * 0.55} q24 -16 48 -12`} stroke="#fff6" strokeWidth="6" fill="none" strokeLinecap="round" />
      {[-40, 10, 46].map((dx) => (
        <circle key={dx} cx={x + dx} cy={FLOOR - h * 0.3 + (dx % 3) * 4} r="5" fill={SAND_DARK} />
      ))}
      {age >= 0 &&
        age < 0.7 &&
        Array.from({ length: 7 }, (_, i) => {
          const dir = (i - 3) * 34;
          const k = age / 0.7;
          return (
            <circle
              key={i}
              cx={at.x + dir * k * 1.4}
              cy={at.y + SPOOL.r - 10 - 260 * k + 420 * k * k}
              r={7 - (i % 3)}
              fill={SAND}
              stroke={INK}
              strokeWidth="1.5"
              opacity={1 - k}
            />
          );
        })}
    </g>
  );
}

/** Little clouds of smoke, each rising and growing from where it was puffed out until it fades. */
function Puffs({ puffs }: { puffs: { x: number; y: number; age: number }[] }) {
  return (
    <g>
      {puffs.map(({ x, y, age }, i) =>
        age < 0 || age > 1.4 ? null : (
          <circle
            key={i}
            cx={x + 14 * age + (i % 2 ? 4 : -4) * age}
            cy={y - 70 * age}
            r={9 + 20 * age}
            fill="#eef0f6"
            stroke={INK}
            strokeWidth="2"
            opacity={0.9 * (1 - age / 1.4)}
          />
        ),
      )}
    </g>
  );
}

/** The excavator's tracks, which never turn: drawn once. */
const Tracks = memo(function Tracks() {
  const { x, track } = EXC;
  return (
    <g>
      <rect x={x - 60} y={FLOOR - 60} width="120" height="16" rx="4" fill="#4a4a5e" stroke={INK} strokeWidth="3" />
      <rect x={x - track} y={FLOOR - 48} width={2 * track} height="48" rx="24" fill="#3b3b4f" stroke={INK} strokeWidth="3.5" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={x - track + 26 + (i * (2 * track - 52)) / 4} cy={FLOOR - 24} r="13" fill="#7d7d96" stroke={INK} strokeWidth="2.5" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={x - track + 14 + i * 16.5} y1={FLOOR - 48} x2={x - track + 14 + i * 16.5} y2={FLOOR - 42} stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
});

/** The scoop in its own frame: the wrist at 0 0, its mouth up along +x; full, it holds a heap of sand and stones. */
function Scoop({ full }: { full: boolean }) {
  const { mouth, deep } = SCOOP;
  return (
    <g>
      {full && (
        <g>
          <path d={`M2 0 Q${mouth / 2} -30 ${mouth - 2} 0 Z`} fill={SAND} stroke={INK} strokeWidth="2.5" />
          <circle cx={mouth * 0.35} cy="-9" r="5" fill="#9a9aaa" stroke={INK} strokeWidth="1.5" />
          <circle cx={mouth * 0.65} cy="-6" r="4" fill="#b9bdd6" stroke={INK} strokeWidth="1.5" />
        </g>
      )}
      <path
        d={`M0 0 L${mouth} 0 Q${mouth + 8} ${deep} ${mouth * 0.4} ${deep} Q-8 ${deep - 4} 0 0 Z`}
        fill="#5a6b80"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <line x1={mouth} y1="0" x2={mouth + 4} y2="-8" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d={`M10 10 Q${mouth * 0.5} ${deep - 10} ${mouth - 6} 12`} stroke="#fff5" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** The excavator: its top, arm and scoop turn round on the tracks (seen from the side, it flips), and it puffs from its exhaust. */
function Excavator({ machine, t }: { machine: Building; t: number }) {
  const { face, shake, e, w, cup, full } = machine.excavatorAt(t);
  const { s } = ARM;
  // The cylinder lifting the boom, from the body to a third of the way up the boom.
  const lift = { x: s.x + (e.x - s.x) * 0.35, y: s.y + (e.y - s.y) * 0.35 };
  const puffs = machine.exhaust.map((p) => ({ x: EXC.x - 73 * face, y: EXC.y - 112, age: t - p }));
  const thick = (a: { x: number; y: number }, b: { x: number; y: number }, width: number, color: string) => (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={INK} strokeWidth={width + 7} strokeLinecap="round" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={width} strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <Tracks />
      <g transform={`translate(${EXC.x} ${EXC.y + shake}) scale(${face} 1)`}>
        {/* Body with its counterweight and exhaust pipe */}
        <rect x="-78" y="-112" width="10" height="36" rx="3" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
        <rect x="-108" y="-80" width="152" height="76" rx="12" fill={YELLOW} stroke={INK} strokeWidth="4" />
        {[0, 1, 2].map((k) => (
          <line key={k} x1="-94" y1={-58 + k * 13} x2="-58" y2={-58 + k * 13} stroke="#3b4a5c" strokeWidth="4" strokeLinecap="round" />
        ))}
        {/* The cab with its driver, a fox or a bear */}
        <rect x="-22" y="-152" width="68" height="84" rx="9" fill={YELLOW} stroke={INK} strokeWidth="4" />
        <rect x="-12" y="-142" width="48" height="44" rx="6" fill="#bde9ff" stroke={INK} strokeWidth="2.5" />
        <CabDriver cx={14} cy={-112} kind="fox" hat="#ffd23f" />
        <path d="M-6 -136 l14 -2" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        {/* The arm: cylinder, boom, stick and scoop */}
        <line x1="36" y1="-24" x2={lift.x} y2={lift.y} stroke="#4a4a5e" strokeWidth="9" strokeLinecap="round" />
        <line x1="36" y1="-24" x2={(36 + lift.x) / 2} y2={(-24 + lift.y) / 2} stroke="#d8d8e4" strokeWidth="5" strokeLinecap="round" />
        {thick(s, e, 22, YELLOW)}
        {thick(e, w, 15, YELLOW)}
        <g transform={`translate(${w.x} ${w.y}) rotate(${cup})`}>
          <Scoop full={full} />
        </g>
        {[s, e, w].map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="6" fill={INK} />
        ))}
      </g>
      <Puffs puffs={puffs} />
    </g>
  );
}

/** Sand and stones pouring out of the tipped scoop onto the heap. */
function Pour({ machine, t }: { machine: Building; t: number }) {
  const k = machine.pourAt(t);
  if (k < 0) return null;
  const { face, w, cup } = machine.excavatorAt(t);
  const m = onScoop(w, cup, { x: SCOOP.mouth / 2, y: 0 });
  const from = { x: EXC.x + face * m.x, y: EXC.y + m.y };
  const to = FLOOR - machine.heapH(t);
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const f = (k * 3 + i / 12) % 1;
        const stone = i % 4 === 0;
        return (
          <circle
            key={i}
            cx={from.x + ((i % 5) - 2) * 6 * f}
            cy={from.y + (to - from.y) * f * f}
            r={stone ? 6 : 4}
            fill={stone ? "#9a9aaa" : SAND}
            stroke={INK}
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}

/** The heap of tipped sand, and the flat new road the roller presses out of it. */
function Road({ machine, t }: { machine: Building; t: number }) {
  const x0 = HEAP.x - HEAP.w;
  const end = machine.roadTo(t);
  const top: string[] = [];
  for (let x = x0; x <= HEAP.x + HEAP.w; x += 6) top.push(`${x} ${machine.heapY(t, x)}`);
  return (
    <g>
      {end > x0 + 2 && (
        <g>
          <rect x={x0} y={FLOOR - 10} width={end - x0} height="12" rx="4" fill={ROAD} stroke={INK} strokeWidth="2.5" />
          {Array.from({ length: Math.floor((end - x0) / 50) }, (_, i) => (
            <line key={i} x1={x0 + 16 + i * 50} y1={FLOOR - 4} x2={x0 + 40 + i * 50} y2={FLOOR - 4} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>
      )}
      {machine.heapH(t) > 0.5 && <path d={`M${top.join(" L")} Z`} fill={SAND} stroke={INK} strokeWidth="3" strokeLinejoin="round" />}
    </g>
  );
}

/** The road roller: big drum in front, driver under a red roof, puffing from its chimney; patted, it squashes and springs back. */
function Roller({ machine, t }: { machine: Building; t: number }) {
  const { x, lift, turned, squash } = machine.rollerAt(t);
  const r = ROLLER.drum;
  const puffs = machine.chimney.map((p) => {
    const at = machine.rollerAt(Math.max(0, p));
    return { x: at.x - 164, y: FLOOR - at.lift - 140, age: t - p };
  });
  const spin = deg(turned / r);
  return (
    <g>
      <g transform={`translate(${x} ${FLOOR - lift}) scale(${1 + squash * 0.5} ${1 - squash})`}>
        {/* The rear wheel */}
        <g transform={`translate(-135 -34) rotate(${deg(turned / 34)})`}>
          <circle r="34" fill="#3b3b4f" stroke={INK} strokeWidth="3" />
          <circle r="13" fill="#d8d8e4" />
          <line x1="-28" y1="0" x2="28" y2="0" stroke="#d8d8e4" strokeWidth="4" />
        </g>
        {/* Chimney, body, canopy and driver */}
        <rect x="-170" y="-140" width="12" height="44" rx="3" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
        <rect x="-178" y="-100" width="130" height="64" rx="9" fill={YELLOW} stroke={INK} strokeWidth="4" />
        {[0, 1].map((k) => (
          <line key={k} x1="-166" y1={-80 + k * 14} x2="-130" y2={-80 + k * 14} stroke="#3b4a5c" strokeWidth="4" strokeLinecap="round" />
        ))}
        <rect x="-132" y="-120" width="28" height="20" rx="4" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
        <rect x="-124" y="-146" width="22" height="28" rx="6" fill={ORANGE} stroke={INK} strokeWidth="2.5" />
        <CabDriver cx={-112} cy={-156} r={11} kind="bear" hat="#fff" />
        <path d="M-98 -128 L-84 -116" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="-84" cy="-116" rx="9" ry="3" fill="#4a4a5e" stroke={INK} strokeWidth="2" />
        {[-160, -64].map((px) => (
          <g key={px}>
            <line x1={px} y1="-100" x2={px} y2="-202" stroke={INK} strokeWidth="8" />
            <line x1={px} y1="-100" x2={px} y2="-202" stroke={YELLOW} strokeWidth="4" />
          </g>
        ))}
        <rect x="-172" y="-215" width="120" height="16" rx="5" fill="#ff5d73" stroke={INK} strokeWidth="3" />
        {/* The big drum under its hood, held by the side plate */}
        <g transform={`translate(0 ${-r}) rotate(${spin})`}>
          <circle r={r} fill="#b9bdd6" stroke={INK} strokeWidth="4" />
          <circle r={r - 12} fill="#d8d8e4" stroke={INK} strokeWidth="2" />
          {[0, 60, 120].map((a) => (
            <line
              key={a}
              x1={(r - 12) * Math.cos(rad(a))}
              y1={(r - 12) * Math.sin(rad(a))}
              x2={-(r - 12) * Math.cos(rad(a))}
              y2={-(r - 12) * Math.sin(rad(a))}
              stroke="#9fa3bd"
              strokeWidth="4"
            />
          ))}
        </g>
        <path d={`M${-r - 6} ${-r - 4} A${r + 8} ${r + 8} 0 0 1 ${r + 6} ${-r - 4}`} fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
        <path d={`M${-r - 6} ${-r - 4} A${r + 8} ${r + 8} 0 0 1 ${r + 6} ${-r - 4}`} fill="none" stroke={YELLOW} strokeWidth="8" strokeLinecap="round" />
        <path d={`M-52 -92 L-4 ${-r - 10} L-4 ${-r + 10} L-52 -44 Z`} fill={YELLOW} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="0" cy={-r} r="10" fill={YELLOW} stroke={INK} strokeWidth="3" />
      </g>
      <Puffs puffs={puffs} />
    </g>
  );
}

/** The jackhammer: chisel, red body and handlebar; while it runs it shakes, with little lines round its chisel. */
function Jackhammer({ machine, t }: { machine: Building; t: number }) {
  const { tip, lean, buzz } = machine.jackAt(t);
  const { w, h } = JACK;
  return (
    <g transform={`translate(${tip.x} ${tip.y}) rotate(${deg(lean)})`}>
      {buzz !== 0 &&
        [-1, 1].map((side) => (
          <g key={side} stroke={INK} strokeWidth="3" strokeLinecap="round">
            <line x1={side * 12} y1="-6" x2={side * 24} y2="-12" />
            <line x1={side * 13} y1="-18" x2={side * 26} y2="-22" />
          </g>
        ))}
      <g transform={`translate(${buzz * 0.4} ${buzz})`}>
        <path d="M-5 -36 L5 -36 L5 -7 L0 1 L-5 -7 Z" fill="#b9bdd6" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="-12" y="-46" width="24" height="12" rx="3" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
        <rect x={-w / 2} y={-h + 14} width={w} height={h - 58} rx="9" fill={BRICK} stroke={INK} strokeWidth="3.5" />
        <line x1={-w / 2 + 7} y1={-h + 30} x2={w / 2 - 7} y2={-h + 30} stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
        <path d={`M${-w / 2 + 8} ${-h + 44} L${-w / 2 + 8} ${-60}`} stroke="#fff6" strokeWidth="4" strokeLinecap="round" />
        <rect x="-44" y={-h} width="88" height="13" rx="6" fill="#4a4a5e" stroke={INK} strokeWidth="3" />
        {[-1, 1].map((side) => (
          <rect key={side} x={side > 0 ? 26 : -46} y={-h - 3} width="20" height="19" rx="7" fill="#3b3b4f" stroke={INK} strokeWidth="2.5" />
        ))}
      </g>
    </g>
  );
}

/* ---------- Generator, pile driver, pipe, ladder and sack ---------- */

const CONCRETE = "#b8b8c4";
const CONCRETE_DARK = "#8e8e9e";

/** The generator on its wheels: shaking a little while it runs, puffing smoke from its exhaust, its start button on top. */
function Generator({ machine, t }: { machine: Building; t: number }) {
  const { x, w, h, wheelR, button, buttonR } = GEN;
  const running = machine.genRunning(t);
  const shake = running ? 1.5 * Math.sin(t * 70) : 0;
  const bottom = FLOOR - wheelR;
  const top = bottom - h;
  const exhaust = { x: x + w / 2 - 22, y: top - 26 };
  return (
    <g>
      <Puffs puffs={machine.genPuffs.map((p) => ({ x: exhaust.x, y: exhaust.y, age: t - p }))} />
      <g transform={`translate(0 ${shake})`}>
        <rect x={x + w / 2 - 30} y={top - 26} width="16" height="30" rx="3" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
        <rect x={x - w / 2} y={top} width={w} height={h} rx="12" fill={YELLOW} stroke={INK} strokeWidth="4" />
        <rect x={x - w / 2 + 14} y={top + 22} width={w - 28} height={h - 40} rx="6" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={x - w / 2 + 24}
            y1={top + 34 + i * 12}
            x2={x + w / 2 - 24}
            y2={top + 34 + i * 12}
            stroke="#2e2e3e"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ))}
        <circle cx={x + w / 2 - 30} cy={top + 12} r="6" fill={running ? "#3ec300" : "#9aa0a6"} stroke={INK} strokeWidth="2" />
        <rect x={x + button - buttonR - 4} y={top - 6} width={2 * buttonR + 8} height="8" rx="3" fill="#4a4a5e" stroke={INK} strokeWidth="2" />
        <rect
          x={x + button - buttonR}
          y={top - 12 + machine.buttonAt(t)}
          width={2 * buttonR}
          height={12 - machine.buttonAt(t)}
          rx="4"
          fill="#3ec300"
          stroke={INK}
          strokeWidth="2.5"
        />
      </g>
      {[x - w / 2 + 26, x + w / 2 - 26].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={FLOOR - wheelR} r={wheelR} fill="#333" stroke={INK} strokeWidth="3" />
          <circle cx={wx} cy={FLOOR - wheelR} r={wheelR * 0.4} fill="#bbb" />
        </g>
      ))}
    </g>
  );
}

const CABLE_FROM = { x: GEN.x + GEN.w / 2, y: FLOOR - GEN.wheelR - 30 };
const CABLE_TO = { x: DRIVER.x - 70, y: FLOOR - 40 };
const cableD = `M${CABLE_FROM.x} ${CABLE_FROM.y} Q${CABLE_FROM.x + 40} ${FLOOR - 4} ${(CABLE_FROM.x + CABLE_TO.x) / 2} ${FLOOR - 4} Q${CABLE_TO.x - 40} ${FLOOR - 4} ${CABLE_TO.x} ${CABLE_TO.y}`;
/** The spot `k` (0 … 1) along the power cable. */
function onCable(k: number): Pt {
  const mid = { x: (CABLE_FROM.x + CABLE_TO.x) / 2, y: FLOOR - 4 };
  const quadAt = (a: Pt, c: Pt, b: Pt, u: number) => ({
    x: (1 - u) ** 2 * a.x + 2 * u * (1 - u) * c.x + u * u * b.x,
    y: (1 - u) ** 2 * a.y + 2 * u * (1 - u) * c.y + u * u * b.y,
  });
  return k < 0.5
    ? quadAt(CABLE_FROM, { x: CABLE_FROM.x + 40, y: FLOOR - 4 }, mid, k * 2)
    : quadAt(mid, { x: CABLE_TO.x - 40, y: FLOOR - 4 }, CABLE_TO, k * 2 - 1);
}

/** The power cable from the generator to the pile driver, with the spark running along it when the generator starts. */
function PowerCable({ machine, t }: { machine: Building; t: number }) {
  const k = machine.sparkAt(t);
  const spark = k === null ? null : onCable(k);
  return (
    <g>
      <path d={cableD} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d={cableD} fill="none" stroke={ORANGE} strokeWidth="5" strokeLinecap="round" />
      {spark && (
        <g transform={`translate(${spark.x} ${spark.y})`}>
          <circle r="13" fill="#fff3a0" opacity="0.8" />
          <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#ffd23f" stroke={INK} strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
}

/** The pile driver: a tracked base with a tall lattice mast, its heavy ram sliding on it, and the post below it sinking into the ground. */
function PileDriver({ machine, t }: { machine: Building; t: number }) {
  const { x, top, ram, ramH, post, post0, sink } = DRIVER;
  const { ram: ramBottom, sunk } = machine.driverAt(t);
  const postTop = post0 + sunk * sink;
  return (
    <g>
      <rect x={x + 30} y={top} width="22" height={FLOOR - 70 - top} fill="none" stroke="#c9302c" strokeWidth="5" />
      {Array.from({ length: Math.floor((FLOOR - 70 - top) / 36) }, (_, i) => (
        <line key={i} x1={x + 30} y1={top + i * 36} x2={x + 52} y2={top + (i + 1) * 36} stroke="#c9302c" strokeWidth="4" />
      ))}
      <rect x={x + 22} y={top - 18} width="38" height="20" rx="4" fill="#c9302c" stroke={INK} strokeWidth="3" />
      <rect x={x - 70} y={FLOOR - 74} width="190" height="46" rx="8" fill="#ff5d73" stroke={INK} strokeWidth="3.5" />
      <rect x={x - 80} y={FLOOR - 30} width="210" height="30" rx="15" fill="#4a4a5e" stroke={INK} strokeWidth="3" />
      {[-56, -20, 16, 52, 88].map((dx) => (
        <circle key={dx} cx={x + dx + 14} cy={FLOOR - 15} r="8" fill="#7d7d96" stroke={INK} strokeWidth="2" />
      ))}
      <rect x={x - post / 2} y={postTop} width={post} height={FLOOR - postTop} fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      <line x1={x - post / 2 + 8} y1={postTop + 10} x2={x - post / 2 + 8} y2={FLOOR - 6} stroke={DARK_WOOD} strokeWidth="3" />
      <ellipse cx={x} cy={FLOOR} rx={post / 2 + 16} ry="6" fill="#c48a52" stroke={INK} strokeWidth="2" />
      <line x1={x + 20} y1={ramBottom - ramH / 2} x2={x + 41} y2={ramBottom - ramH / 2} stroke={INK} strokeWidth="8" />
      <rect x={x - ram / 2} y={ramBottom - ramH} width={ram} height={ramH} rx="8" fill="#4a4a5e" stroke={INK} strokeWidth="4" />
      <rect x={x - ram / 2 + 10} y={ramBottom - ramH + 12} width={ram - 20} height="14" rx="4" fill={YELLOW} stroke={INK} strokeWidth="2" />
      <Puffs puffs={machine.dust.map((d) => ({ x: d.x, y: d.y, age: t - d.t }))} />
    </g>
  );
}

/** The concrete pipe, first lying on its two wooden chocks, then rolling. */
function Pipe({ machine, t }: { machine: Building; t: number }) {
  const { pt, turned } = machine.pipeAt(t);
  const r = PIPE.r;
  return (
    <g>
      {[-1, 1].map((side) => (
        <path
          key={side}
          d={`M${PIPE.x + side * (r - 6) - 16} ${FLOOR} L${PIPE.x + side * (r - 6)} ${FLOOR - PIPE.chock} L${PIPE.x + side * (r - 6) + 16} ${FLOOR} Z`}
          fill={WOOD}
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      ))}
      <g transform={`translate(${pt.x} ${pt.y}) rotate(${deg(turned)})`}>
        <circle r={r} fill={CONCRETE} stroke={INK} strokeWidth="4" />
        <circle r={r * 0.62} fill={CONCRETE_DARK} stroke={INK} strokeWidth="3" />
        <circle r={r * 0.5} fill="#5b5b6e" />
        {[0, 120, 240].map((a) => (
          <circle key={a} cx={r * 0.8 * Math.cos(rad(a))} cy={r * 0.8 * Math.sin(rad(a))} r="3" fill={CONCRETE_DARK} />
        ))}
      </g>
    </g>
  );
}

/** A puddle in the sand. */
const Puddle = memo(function Puddle() {
  return <ellipse cx={PUDDLE.x} cy={FLOOR + 6} rx={PUDDLE.w / 2} ry="14" fill="#6fb8e8" stroke={INK} strokeWidth="3" />;
});

/** Drops of the puddle splashed up by the pipe. */
function Splash({ pts }: { pts: Pt[] }) {
  return (
    <g>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={6 - (i % 3)} fill="#6fd3ff" stroke={INK} strokeWidth="2" />
      ))}
    </g>
  );
}

/** Brick pallets stacked up beside the winch. */
const Stack = memo(function Stack() {
  const { x0, x1, top } = STACK;
  const rows = 4;
  const rowH = (FLOOR - top) / rows;
  return (
    <g>
      {Array.from({ length: rows }, (_, r) => {
        const y = top + r * rowH;
        return (
          <g key={r}>
            <rect x={x0} y={y} width={x1 - x0} height={rowH - 14} fill={BRICK} stroke={INK} strokeWidth="3" />
            {[0, 1, 2].map((k) => (
              <line key={k} x1={x0} y1={y + ((rowH - 14) * (k + 1)) / 4} x2={x1} y2={y + ((rowH - 14) * (k + 1)) / 4} stroke="#b33d2c" strokeWidth="2" />
            ))}
            <rect x={x0 - 4} y={y + rowH - 14} width={x1 - x0 + 8} height="14" fill={MID_WOOD} stroke={INK} strokeWidth="2.5" />
          </g>
        );
      })}
    </g>
  );
});

/** The aluminium ladder leaning against the stack; pushed at its foot, it stands up steeper. */
function Ladder({ machine, t }: { machine: Building; t: number }) {
  const { foot, top } = machine.ladderAt(t);
  const len = Math.hypot(top.x - foot.x, top.y - foot.y);
  const u = { x: (top.x - foot.x) / len, y: (top.y - foot.y) / len };
  const n = { x: -u.y, y: u.x };
  const half = LADDER.w / 2;
  // Both rails end at the wall, the near one a little in front.
  const rail = (side: number) =>
    `M${foot.x + n.x * side * half} ${foot.y + n.y * side * half} L${top.x + n.x * side * half - u.x * 4} ${top.y + n.y * side * half - u.y * 4}`;
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => {
        const d = 24 + i * ((len - 40) / 8);
        const c = { x: foot.x + u.x * d, y: foot.y + u.y * d };
        return <line key={i} x1={c.x - n.x * half} y1={c.y - n.y * half} x2={c.x + n.x * half} y2={c.y + n.y * half} stroke={INK} strokeWidth="5" />;
      })}
      {[-1, 1].map((side) => (
        <g key={side}>
          <path d={rail(side)} stroke={INK} strokeWidth="9" strokeLinecap="round" />
          <path d={rail(side)} stroke="#d8d8e4" strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

/** The cement sack: on the stack, tipping off, riding the crank's knob down and lying beside the winch. */
function Sack({ machine, t }: { machine: Building; t: number }) {
  const { pt, angle } = machine.sackAt(t);
  const { w, h } = SACK;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${deg(angle)})`}>
      <path
        d={`M${-w / 2 + 6} 0 Q${-w / 2} ${-h / 2} ${-w / 2 + 8} ${-h} L${w / 2 - 8} ${-h} Q${w / 2} ${-h / 2} ${w / 2 - 6} 0 Z`}
        fill="#e8e3d3"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x={-w / 4} y={-h + 12} width={w / 2} height={h - 24} rx="4" fill="#9fb0c4" stroke={INK} strokeWidth="2" />
      <path d={`M${-w / 2 + 10} ${-h + 4} q6 4 0 8 M${w / 2 - 10} ${-h + 4} q-6 4 0 8`} fill="none" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/* ---------- Winch, crane and house ---------- */

/** The winch at the crane's foot; `turned` is how far its crank has gone round. */
function Winch({ turned }: { turned: number }) {
  const { x, y, drum } = WINCH;
  const knob = crankKnob(turned);
  return (
    <g>
      <path d={`M${x - 46} ${FLOOR} L${x} ${y} L${x + 46} ${FLOOR}`} fill="none" stroke="#4a4a5e" strokeWidth="12" strokeLinejoin="round" />
      <rect x={x - 60} y={FLOOR - 12} width="120" height="12" rx="3" fill="#7d7d96" stroke={INK} strokeWidth="2.5" />
      <path
        d={`M${x} ${y + drum} L${FOOT_PULLEY.x} ${FOOT_PULLEY.y + FOOT_PULLEY.r} M${FOOT_PULLEY.x + FOOT_PULLEY.r} ${FOOT_PULLEY.y} L${TOP_PULLEY.x + TOP_PULLEY.r} ${TOP_PULLEY.y}`}
        stroke="#8a6a4a"
        strokeWidth="4"
        fill="none"
      />
      <g transform={`translate(${x} ${y}) rotate(${deg(-turned)})`}>
        <circle r={drum} fill="#d8d8e4" stroke={INK} strokeWidth="3" />
        {[-14, -5, 4, 13].map((dx) => (
          <line key={dx} x1={dx} y1={-drum + 5} x2={dx + 4} y2={drum - 5} stroke="#8a6a4a" strokeWidth="3" />
        ))}
      </g>
      <line x1={x} y1={y} x2={knob.x} y2={knob.y} stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <line x1={x} y1={y} x2={knob.x} y2={knob.y} stroke="#ff5d73" strokeWidth="7" strokeLinecap="round" />
      <circle cx={knob.x} cy={knob.y} r={WINCH.knob} fill="#3b3b4f" stroke={INK} strokeWidth="2.5" />
      <circle cx={x} cy={y} r="6" fill={INK} />
    </g>
  );
}

const roofBase = (drop: number) => HOUSE.top - ROOF.drop + drop;

/** A lattice: two rails from (x0, y0)–(x1, y0) and (x0, y1)–(x1, y1) with zig-zag struts between. */
function Lattice({ x0, x1, y0, y1, step = 34 }: { x0: number; x1: number; y0: number; y1: number; step?: number }) {
  const n = Math.max(1, Math.round(Math.abs(x1 - x0) / step));
  const zig = Array.from({ length: n + 1 }, (_, i) => `${x0 + ((x1 - x0) * i) / n} ${i % 2 ? y1 : y0}`).join(" L");
  return (
    <g>
      <path d={`M${zig}`} fill="none" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d={`M${zig}`} fill="none" stroke={YELLOW} strokeWidth="3" strokeLinejoin="round" />
      {[y0, y1].map((y) => (
        <line key={y} x1={x0} y1={y} x2={x1} y2={y} stroke={INK} strokeWidth="9" strokeLinecap="round" />
      ))}
      {[y0, y1].map((y) => (
        <line key={y} x1={x0} y1={y} x2={x1} y2={y} stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
      ))}
    </g>
  );
}

/** The mast as a lattice standing up: the same as Lattice, turned. */
function Mast({ x, w, top, bottom }: { x: number; w: number; top: number; bottom: number }) {
  return (
    <g transform={`rotate(90 ${x} ${top})`}>
      <Lattice x0={x} x1={x + bottom - top} y0={top - w / 2} y1={top + w / 2} step={40} />
    </g>
  );
}

/** The tower crane; `drop` is how far the hook has come down. */
function Crane({ drop }: { drop: number }) {
  const { x, jibTop, jibY, end, back, apexY } = CRANE;
  const hookY = roofBase(drop) - ROOF.h - 14;
  const turn = deg(drop / TOP_PULLEY.r);
  const pulley = (p: { x: number; y: number; r: number }) => (
    <g transform={`translate(${p.x} ${p.y}) rotate(${turn})`}>
      <circle r={p.r} fill={YELLOW} stroke={INK} strokeWidth="3" />
      <line x1={-p.r + 4} y1="0" x2={p.r - 4} y2="0" stroke={INK} strokeWidth="2.5" />
      <line x1="0" y1={-p.r + 4} x2="0" y2={p.r - 4} stroke={INK} strokeWidth="2.5" />
    </g>
  );
  return (
    <g>
      {/* Foot, mast and the ties from the top */}
      <rect x={x - 70} y={FLOOR - 56} width="140" height="56" rx="4" fill="#b9bdd6" stroke={INK} strokeWidth="3" />
      <Mast x={x} w={52} top={jibY} bottom={FLOOR - 56} />
      <path d={`M${back + 10} ${jibTop} L${x} ${apexY} L${end - 120} ${jibTop}`} fill="none" stroke={INK} strokeWidth="4" />
      <path d={`M${x - 26} ${jibTop} L${x} ${apexY} L${x + 26} ${jibTop}`} fill={YELLOW} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <Lattice x0={x} x1={end} y0={jibTop} y1={jibY} />
      <Lattice x0={back} x1={x} y0={jibTop + 6} y1={jibY} />
      {/* Counterweights */}
      {[0, 1].map((k) => (
        <rect key={k} x={back + 6 + k * 48} y={jibY + 4} width="44" height="96" rx="4" fill="#b9bdd6" stroke={INK} strokeWidth="3" />
      ))}
      {/* The cab with its driver, a fox or a bear */}
      <rect x={x + 28} y={jibY + 4} width="78" height="66" rx="8" fill={YELLOW} stroke={INK} strokeWidth="3" />
      <rect x={x + 40} y={jibY + 14} width="54" height="34" rx="5" fill="#bde9ff" stroke={INK} strokeWidth="2.5" />
      <CabDriver cx={x + 67} cy={jibY + 38} kind="bear" hat={ORANGE} />
      {/* The rope up the mast, along the jib and down to the hook */}
      <path
        d={`M${TOP_PULLEY.x} ${TOP_PULLEY.y - TOP_PULLEY.r} L${TROLLEY_X} ${TOP_PULLEY.y - TOP_PULLEY.r + 32} L${TROLLEY_X} ${hookY - 22}`}
        stroke="#8a6a4a"
        strokeWidth="4"
        fill="none"
      />
      {pulley(TOP_PULLEY)}
      {pulley(FOOT_PULLEY)}
      <rect x={TROLLEY_X - 26} y={jibY} width="52" height="22" rx="4" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      {/* The hook block */}
      <rect x={TROLLEY_X - 18} y={hookY - 30} width="36" height="22" rx="4" fill={YELLOW} stroke={INK} strokeWidth="3" />
      <path d={`M${TROLLEY_X - 12} ${hookY - 26} l8 0 l-8 14 z M${TROLLEY_X + 4} ${hookY - 26} l8 0 l-8 14 z`} fill={INK} />
      <path
        d={`M${TROLLEY_X} ${hookY - 8} L${TROLLEY_X} ${hookY + 2} Q${TROLLEY_X} ${hookY + 12} ${TROLLEY_X + 9} ${hookY + 8}`}
        fill="none"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

const House = memo(function House() {
  const { x0, x1, top } = HOUSE;
  const w = x1 - x0;
  return (
    <g>
      <rect x={x0} y={top} width={w} height={FLOOR - top} fill="#ffe6b3" stroke={INK} strokeWidth="4" />
      {/* The top rows of bricks, still bare */}
      {Array.from({ length: 2 }, (_, row) =>
        Array.from({ length: Math.ceil(w / 50) }, (_, i) => {
          const bx = x0 + i * 50 - (row % 2) * 25;
          const left = Math.max(x0, bx);
          const right = Math.min(x1, bx + 50);
          return (
            <rect
              key={`${row}-${i}`}
              x={left}
              y={top + row * 22}
              width={right - left}
              height="22"
              fill={row ? "#e88a6a" : BRICK}
              stroke={INK}
              strokeWidth="2"
            />
          );
        }),
      )}
      {[x0 + 60, x1 - 160].map((x) => (
        <g key={x}>
          <rect x={x} y={top + 80} width="100" height="84" rx="4" fill="#bde9ff" stroke={INK} strokeWidth="4" />
          <line x1={x + 50} y1={top + 80} x2={x + 50} y2={top + 164} stroke={INK} strokeWidth="3" />
          <path d={`M${x + 12} ${top + 130} l24 -30`} stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        </g>
      ))}
      <rect x={x0 + w / 2 - 40} y={FLOOR - 140} width="80" height="140" rx="6" fill={MID_WOOD} stroke={INK} strokeWidth="4" />
      <circle cx={x0 + w / 2 + 24} cy={FLOOR - 70} r="5" fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
});

/** The roof, `drop` down from where it starts, hanging from the crane's hook by the eye on its top. */
function Roof({ drop }: { drop: number }) {
  const cx = (HOUSE.x0 + HOUSE.x1) / 2;
  const base = roofBase(drop);
  const half = ROOF.w / 2;
  const top = base - ROOF.h;
  const inner = (HOUSE.x1 - HOUSE.x0) / 2;
  const slope = ROOF.h / half;
  return (
    <g>
      <circle cx={cx} cy={top - 14} r="9" fill="none" stroke={INK} strokeWidth="4" />
      {/* The gable, and a round window in it */}
      <path d={`M${cx - inner} ${base} L${cx} ${base - inner * slope} L${cx + inner} ${base} Z`} fill={WOOD} stroke={INK} strokeWidth="3" />
      <circle cx={cx} cy={base - 52} r="20" fill="#bde9ff" stroke={INK} strokeWidth="3" />
      {[-1, 1].map((side) => (
        <g key={side}>
          <path
            d={`M${cx} ${top - 6} L${cx + side * (half + 8)} ${base + 10} L${cx + side * (half - 30)} ${base + 10} L${cx} ${top + 30} Z`}
            fill={BRICK}
            stroke={INK}
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {[0.3, 0.5, 0.7, 0.9].map((f) => {
            const ox = cx + side * (half + 8) * f;
            const oy = top - 6 + (base + 16 - top) * f;
            return <line key={f} x1={ox} y1={oy} x2={ox - side * 26 * (0.6 + f * 0.4)} y2={oy + 10} stroke="#a8321f" strokeWidth="3" strokeLinecap="round" />;
          })}
        </g>
      ))}
    </g>
  );
}

/** The topping-out tree with ribbons, springing up on the roof `age` seconds after the roof is on. */
function TopOutTree({ drop, age }: { drop: number; age: number }) {
  if (age < 0) return null;
  const cx = (HOUSE.x0 + HOUSE.x1) / 2 + 170;
  const foot = roofBase(drop) - ROOF.h + (170 * ROOF.h) / (ROOF.w / 2) - 4;
  const grow = Math.min(1.08, 1 - decay(age * 7) * Math.cos(age * 13));
  const sway = wobble(age - 0.3, 8, 6, 1.4);
  return (
    <g transform={`translate(${cx} ${foot}) rotate(${sway}) scale(${grow})`}>
      <line x1="0" y1="0" x2="0" y2="-70" stroke={DARK_WOOD} strokeWidth="7" strokeLinecap="round" />
      {[0, 1, 2].map((k) => (
        <path
          key={k}
          d={`M${-34 + k * 7} ${-60 - k * 26} L0 ${-104 - k * 26} L${34 - k * 7} ${-60 - k * 26} Z`}
          fill="#3ec300"
          stroke={INK}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      ))}
      {Array.from({ length: 5 }, (_, i) => {
        const x = -26 + i * 13;
        // The ribbons flutter for a few seconds and hang still: fluttering for ever kept the phone painting (perf).
        const flap = 6 * Math.sin(age * 9 + i) * Math.max(0, 1 - Math.max(0, age - 3) / 3);
        return (
          <path
            key={i}
            d={`M${x} -70 q${flap} 20 ${-flap / 2} 44`}
            stroke={BAR_COLORS[(i * 2) % BAR_COLORS.length]}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function TrafficLight({ green }: { green: boolean }) {
  const x = LIGHT_X;
  return (
    <g>
      <rect x={x - 6} y="560" width="12" height={FLOOR - 560} fill="#7d7d96" stroke={INK} strokeWidth="2.5" />
      <rect x={x - 34} y={FLOOR - 22} width="68" height="22" rx="4" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
      <rect x={x - 32} y="440" width="64" height="160" rx="12" fill="#ffd23f" stroke={INK} strokeWidth="4" />
      <circle cx={x} cy="476" r="19" fill={green ? "#7a2a3a" : "#ff3b3b"} stroke={green ? INK : "#ffd0d0"} strokeWidth="3" />
      <circle cx={x} cy="520" r="19" fill="#8a6a1a" stroke={INK} strokeWidth="3" />
      <circle cx={x} cy="564" r="19" fill={green ? "#3ec300" : "#2c5a2c"} stroke={green ? "#d8ffc8" : INK} strokeWidth="3" />
    </g>
  );
}

/** The dump truck waiting at the light; it drives off `gone` to the right. */
function Truck({ gone }: { gone: number }) {
  const x = TRUCK_X + gone;
  const r = 32;
  const wheel = (wx: number) => (
    <g key={wx} transform={`translate(${wx} ${FLOOR - r}) rotate(${deg(gone / r)})`}>
      <circle r={r} fill="#3b3b4f" stroke={INK} strokeWidth="3" />
      <circle r="12" fill="#d8d8e4" />
      <line x1={-r + 6} y1="0" x2={r - 6} y2="0" stroke="#d8d8e4" strokeWidth="4" />
    </g>
  );
  return (
    <g>
      <path
        d={`M${x + 10} ${FLOOR - 140} Q${x + 70} ${FLOOR - 196} ${x + 130} ${FLOOR - 166} Q${x + 190} ${FLOOR - 190} ${x + 226} ${FLOOR - 140} Z`}
        fill="#f2c46d"
        stroke={INK}
        strokeWidth="3"
      />
      <path
        d={`M${x} ${FLOOR - 150} L${x + 236} ${FLOOR - 150} L${x + 226} ${FLOOR - 70} L${x + 14} ${FLOOR - 70} Z`}
        fill={ORANGE}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <rect x={x + 6} y={FLOOR - 76} width="320" height="16" rx="4" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
      <path
        d={`M${x + 244} ${FLOOR - 72} L${x + 244} ${FLOOR - 176} Q${x + 244} ${FLOOR - 184} ${x + 252} ${FLOOR - 184} L${x + 300} ${FLOOR - 184} L${x + 330} ${FLOOR - 130} L${x + 330} ${FLOOR - 72} Z`}
        fill={YELLOW}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d={`M${x + 258} ${FLOOR - 170} L${x + 296} ${FLOOR - 170} L${x + 316} ${FLOOR - 132} L${x + 258} ${FLOOR - 132} Z`}
        fill="#bde9ff"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx={x + 282} cy={FLOOR - 146} r="10" fill="#c98a4b" stroke={INK} strokeWidth="2" />
      <path d={`M${x + 270} ${FLOOR - 152} Q${x + 282} ${FLOOR - 170} ${x + 294} ${FLOOR - 152} Z`} fill={ORANGE} stroke={INK} strokeWidth="2" />
      <circle cx={x + 322} cy={FLOOR - 110} r="7" fill="#ffd23f" stroke={INK} strokeWidth="2" />
      <rect x={x + 252} y={FLOOR - 196} width="16" height="12" rx="3" fill="#ff8c42" stroke={INK} strokeWidth="2" />
      {wheel(x + 60)}
      {wheel(x + 150)}
      {wheel(x + 280)}
    </g>
  );
}
