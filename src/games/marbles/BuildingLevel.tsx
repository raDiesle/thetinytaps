import { useId, useMemo } from "react";
import { wobble, VIEW_H, type LevelProps } from "./level";
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
  FLOOR,
  FOOT_PULLEY,
  HOUSE,
  LIGHT_X,
  MIXER,
  PIVOT,
  PLUG_X,
  POLE_X,
  ROOF,
  SCAFFOLD_POLES,
  SPIRIT,
  SPOOL,
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
import { deg } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { DARK_WOOD, INK, MARBLE_COLOR, MID_WOOD, Sparkles, WOOD } from "./scenery";
import { BALL_R, type Pt } from "./track";
import { BAR_COLORS, Ball } from "./TrackLevel";

/** The sky behind the building site. */
const SKY = "#bfe9ff";
const STEEL = "#9fb0c4";
const ORANGE = "#ff8c42";
const YELLOW = "#ffb703";
const BRICK = "#e0533d";

/**
 * The building site: one tap starts the motors, and then one thing sets off
 * the next for about half a minute: the cement mixer tips the marble onto a
 * spirit level, it rattles down the rubble chute, rides the conveyor belt up
 * and knocks over a traffic cone, which lets the wrecking ball go. The ball
 * smashes a brick tower, which bumps a cable drum along the scaffold onto the
 * winch's crank, and the tower crane lowers the roof onto the house. The camera
 * travels along with whatever moves.
 */
export function BuildingLevel(props: LevelProps) {
  const machine = useMemo(buildBuilding, []);
  const ids = useId();
  // Until it has rolled out of the drum's mouth, the marble is drawn behind the mixer, so it stays hidden inside.
  const inMixer = (t: number) => machine.marbleAt(t).pt.x < SPIRIT.from.x;

  return (
    <MachineStage machine={machine} label="Baustelle" {...props}>
      {(t) => (
        <>
          <Site ids={ids} />
          <Scaffold />
          {inMixer(t) && <Marble machine={machine} t={t} />}
          <Mixer angle={machine.drumAngle(t)} spin={Math.max(0, t)} />
          <SpiritLevel age={t - machine.tVial} />
          <BeltMotor running={t >= 0} turned={machine.beltTravel(t)} />
          <Belt machine={machine} t={t} />
          <Deck1 />
          <Board />
          <Deck2 />
          <Cable machine={machine} t={t} />
          <Tower angle={machine.towerAngle(t)} />
          <Winch turned={machine.crankAt(t)} />
          <Crane drop={machine.roofDrop(t)} />
          <House />
          <Roof drop={machine.roofDrop(t)} />
          <TopOutTree drop={machine.roofDrop(t)} age={t - machine.tTree} />
          <TrafficLight green={t >= machine.tGreen} />
          <Truck gone={machine.truckGone(t)} />
          <Spool machine={machine} t={t} />
          <Cone angle={machine.coneAngle(t)} />

          {!inMixer(t) && <Marble machine={machine} t={t} />}
          <Chute />
          <WreckingBall machine={machine} t={t} />
          <Sparkles x={(HOUSE.x0 + HOUSE.x1) / 2} y={HOUSE.top - ROOF.h} age={t - machine.tTree} n={12} spread={260} />

          <TapHint t={t} x={MIXER.x - 30} y={MIXER.y + 230} />
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
function Site({ ids }: { ids: string }) {
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
      <Cloud x={4700} y={90} s={0.9} />
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
      <SandPile x={4900} w={300} h={90} />
      <Bags x={2470} />
      <TrafficCone x={1160} y={FLOOR} />
      <TrafficCone x={3600} y={FLOOR} />
    </g>
  );
}

function SandPile({ x, w, h }: { x: number; w: number; h: number }) {
  return (
    <g>
      <path d={`M${x - w / 2} ${FLOOR} Q${x - w / 4} ${FLOOR - h * 1.1} ${x} ${FLOOR - h} Q${x + w / 4} ${FLOOR - h * 1.1} ${x + w / 2} ${FLOOR} Z`} fill="#f2c46d" stroke={INK} strokeWidth="3" />
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
function ConeShape() {
  const { w, h } = CONE;
  return (
    <g>
      <path d={`M-24 -12 L-6 ${-h} L6 ${-h} L24 -12 Z`} fill="#ff6b1a" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d={`M-18 -34 L-13 -54 L13 -54 L18 -34 Z`} fill="#fff" />
      <path d={`M-10 -66 L-8 -78 L8 -78 L10 -66 Z`} fill="#fff" />
      <rect x={-w / 2} y="-14" width={w} height="14" rx="4" fill="#3b3b4f" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- Mixer, spirit level and chute ---------- */

function Scaffold() {
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
        <rect key={y} x={SCAFFOLD_POLES[0] - 14} y={y} width={SCAFFOLD_POLES[3] - SCAFFOLD_POLES[0] + 28} height="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
      ))}
      {/* The ledger under the spirit level, and braces across each bay */}
      <rect x={SCAFFOLD_POLES[1] - 10} y={SPIRIT.to.y + BALL_R + 32} width={SCAFFOLD_POLES[2] - SCAFFOLD_POLES[1] + 210} height="10" fill={STEEL} stroke={INK} strokeWidth="2.5" />
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
        <line key={dx} x1={CHUTE.x + dx} y1={CHUTE.top - 12} x2={CHUTE.x + dx * 1.6} y2={CHUTE.top + 2} stroke="#6b6b80" strokeWidth="3" strokeDasharray="5 3" />
      ))}
    </g>
  );
}

/** The cement mixer on its stand; `angle` tilts the drum, `spin` turns its stripes round. */
function Mixer({ angle, spin }: { angle: number; spin: number }) {
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
}

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
function Chute() {
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
}

/* ---------- Conveyor belt ---------- */

/** The belt's motor box at its low end; the lamp shines while it runs. */
function BeltMotor({ running, turned }: { running: boolean; turned: number }) {
  const x = BELT.a.x - 112;
  const y = FLOOR - 92;
  return (
    <g>
      <line x1={x + 66} y1={y + 30} x2={BELT.a.x} y2={BELT.a.y} stroke="#3b3b4f" strokeWidth="6" />
      <rect x={x} y={y} width="84" height="92" rx="8" fill="#5a6b80" stroke={INK} strokeWidth="3.5" />
      <circle cx={x + 22} cy={y + 20} r="8" fill={running ? "#3ec300" : "#2c5a2c"} stroke={INK} strokeWidth="2" />
      <g transform={`translate(${x + 66} ${y + 30}) rotate(${deg(turned / 12)})`}>
        <circle r="13" fill="#d8d8e4" stroke={INK} strokeWidth="2.5" />
        <line x1="-9" y1="0" x2="9" y2="0" stroke={INK} strokeWidth="2.5" />
      </g>
      {[0, 1, 2].map((k) => (
        <line key={k} x1={x + 12} y1={y + 50 + k * 12} x2={x + 52} y2={y + 50 + k * 12} stroke="#3b4a5c" strokeWidth="4" strokeLinecap="round" />
      ))}
    </g>
  );
}

function Belt({ machine, t }: { machine: Building; t: number }) {
  const { a, b, r, gap } = BELT;
  const travel = machine.beltTravel(t);
  const R = r + 2;
  const at = (p: Pt, s: number, off: number): Pt => ({ x: p.x + s * BELT_U.x + off * BELT_N.x, y: p.y + s * BELT_U.y + off * BELT_N.y });
  const p1 = at(a, 0, R);
  const p2 = at(b, 0, R);
  const p3 = at(b, 0, -R);
  const p4 = at(a, 0, -R);
  const loop = 2 * BELT_LEN + 2 * Math.PI * R;
  const cleats = [];
  for (let k = 0; k * gap < loop; k++) {
    const s = (((machine.cleatPhase + k * gap + travel) % loop) + loop) % loop;
    let base: Pt;
    let dir: number;
    if (s <= BELT_LEN) {
      base = at(a, s, BELT_SKIN);
      dir = 1;
    } else if (s >= BELT_LEN + Math.PI * R && s <= 2 * BELT_LEN + Math.PI * R) {
      base = at(b, -(s - BELT_LEN - Math.PI * R), -BELT_SKIN);
      dir = -1;
    } else continue;
    const tip = { x: base.x + dir * 14 * BELT_N.x, y: base.y + dir * 14 * BELT_N.y };
    cleats.push(
      <g key={k}>
        <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke={INK} strokeWidth="10" strokeLinecap="round" />
        <line x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke={YELLOW} strokeWidth="5" strokeLinecap="round" />
      </g>,
    );
  }
  const roller = (p: Pt) => (
    <g transform={`translate(${p.x} ${p.y}) rotate(${deg(travel / r)})`}>
      <circle r={r - 2} fill="#d8d8e4" stroke={INK} strokeWidth="3" />
      <line x1={-r + 6} y1="0" x2={r - 6} y2="0" stroke={INK} strokeWidth="3" />
      <line x1="0" y1={-r + 6} x2="0" y2={r - 6} stroke={INK} strokeWidth="3" />
    </g>
  );
  return (
    <g>
      {/* Legs and the frame under the belt */}
      {[150, 330, 470].map((s) => {
        const p = at(a, s, 0);
        return <rect key={s} x={p.x - 7} y={p.y} width="14" height={FLOOR - p.y} fill={STEEL} stroke={INK} strokeWidth="2.5" />;
      })}
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6b7a8f" strokeWidth={2 * r - 8} strokeLinecap="round" />
      <path
        d={`M${p1.x} ${p1.y} L${p2.x} ${p2.y} A${R} ${R} 0 0 1 ${p3.x} ${p3.y} L${p4.x} ${p4.y} A${R} ${R} 0 0 1 ${p1.x} ${p1.y}`}
        fill="none"
        stroke="#3b3b4f"
        strokeWidth="8"
      />
      {roller(a)}
      {roller(b)}
      {cleats}
    </g>
  );
}

/* ---------- Deck with the traffic cone, and the wrecking ball ---------- */

function Deck1() {
  const { x0, x1, y } = DECK1;
  return (
    <g>
      {[x0 + 20, POLE_X].map((x) => (
        <rect key={x} x={x - 6} y={x === POLE_X ? BEAM_Y : y} width="12" height={FLOOR - (x === POLE_X ? BEAM_Y : y)} fill={STEEL} stroke={INK} strokeWidth="2.5" />
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
      <path d={`M${PIVOT.x - 10} ${BEAM_Y + 20} L${PIVOT.x - 10} ${PIVOT.y} L${PIVOT.x + 10} ${PIVOT.y} L${PIVOT.x + 10} ${BEAM_Y + 20}`} fill="#7d7d96" stroke={INK} strokeWidth="2.5" />
    </g>
  );
}

/** The board leaning on a brick, which leads the marble down onto the deck. */
function Board() {
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
}

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

function Deck2() {
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
}

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
      {/* The cab with its driver */}
      <rect x={x + 28} y={jibY + 4} width="78" height="66" rx="8" fill={YELLOW} stroke={INK} strokeWidth="3" />
      <rect x={x + 40} y={jibY + 14} width="54" height="34" rx="5" fill="#bde9ff" stroke={INK} strokeWidth="2.5" />
      <circle cx={x + 67} cy={jibY + 38} r="10" fill="#c98a4b" stroke={INK} strokeWidth="2" />
      <path d={`M${x + 55} ${jibY + 33} Q${x + 67} ${jibY + 16} ${x + 79} ${jibY + 33} Z`} fill="#ffd23f" stroke={INK} strokeWidth="2" />
      <circle cx={x + 70} cy={jibY + 39} r="1.8" fill={INK} />
      {/* The rope up the mast, along the jib and down to the hook */}
      <path d={`M${TOP_PULLEY.x} ${TOP_PULLEY.y - TOP_PULLEY.r} L${TROLLEY_X} ${TOP_PULLEY.y - TOP_PULLEY.r + 32} L${TROLLEY_X} ${hookY - 22}`} stroke="#8a6a4a" strokeWidth="4" fill="none" />
      {pulley(TOP_PULLEY)}
      {pulley(FOOT_PULLEY)}
      <rect x={TROLLEY_X - 26} y={jibY} width="52" height="22" rx="4" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      {/* The hook block */}
      <rect x={TROLLEY_X - 18} y={hookY - 30} width="36" height="22" rx="4" fill={YELLOW} stroke={INK} strokeWidth="3" />
      <path d={`M${TROLLEY_X - 12} ${hookY - 26} l8 0 l-8 14 z M${TROLLEY_X + 4} ${hookY - 26} l8 0 l-8 14 z`} fill={INK} />
      <path d={`M${TROLLEY_X} ${hookY - 8} L${TROLLEY_X} ${hookY + 2} Q${TROLLEY_X} ${hookY + 12} ${TROLLEY_X + 9} ${hookY + 8}`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function House() {
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
          return <rect key={`${row}-${i}`} x={left} y={top + row * 22} width={right - left} height="22" fill={row ? "#e88a6a" : BRICK} stroke={INK} strokeWidth="2" />;
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
}

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
  const grow = Math.min(1.08, 1 - Math.exp(-age * 7) * Math.cos(age * 13));
  const sway = wobble(age - 0.3, 8, 6, 1.4);
  return (
    <g transform={`translate(${cx} ${foot}) rotate(${sway}) scale(${grow})`}>
      <line x1="0" y1="0" x2="0" y2="-70" stroke={DARK_WOOD} strokeWidth="7" strokeLinecap="round" />
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${-34 + k * 7} ${-60 - k * 26} L0 ${-104 - k * 26} L${34 - k * 7} ${-60 - k * 26} Z`} fill="#3ec300" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      ))}
      {Array.from({ length: 5 }, (_, i) => {
        const x = -26 + i * 13;
        const flap = 6 * Math.sin(age * 9 + i);
        return <path key={i} d={`M${x} -70 q${flap} 20 ${-flap / 2} 44`} stroke={BAR_COLORS[(i * 2) % BAR_COLORS.length]} strokeWidth="5" fill="none" strokeLinecap="round" />;
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
      <path d={`M${x + 10} ${FLOOR - 140} Q${x + 70} ${FLOOR - 196} ${x + 130} ${FLOOR - 166} Q${x + 190} ${FLOOR - 190} ${x + 226} ${FLOOR - 140} Z`} fill="#f2c46d" stroke={INK} strokeWidth="3" />
      <path d={`M${x} ${FLOOR - 150} L${x + 236} ${FLOOR - 150} L${x + 226} ${FLOOR - 70} L${x + 14} ${FLOOR - 70} Z`} fill={ORANGE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x={x + 6} y={FLOOR - 76} width="320" height="16" rx="4" fill="#4a4a5e" stroke={INK} strokeWidth="2.5" />
      <path d={`M${x + 244} ${FLOOR - 72} L${x + 244} ${FLOOR - 176} Q${x + 244} ${FLOOR - 184} ${x + 252} ${FLOOR - 184} L${x + 300} ${FLOOR - 184} L${x + 330} ${FLOOR - 130} L${x + 330} ${FLOOR - 72} Z`} fill={YELLOW} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${x + 258} ${FLOOR - 170} L${x + 296} ${FLOOR - 170} L${x + 316} ${FLOOR - 132} L${x + 258} ${FLOOR - 132} Z`} fill="#bde9ff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
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

