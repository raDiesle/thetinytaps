import { memo, useEffect, useId, useMemo } from "react";
import { loadRecordings } from "@/lib/sfx";
import { VIEW_H, type LevelProps } from "./level";
import { deg, easeOut, lerp, seg } from "./machineKit";
import { MachineStage } from "./MachineStage";
import {
  BASKET,
  BEAM_TOP,
  BED,
  BIRD,
  BOTTLE,
  buildNight,
  CAGE,
  CAR,
  CAROUSEL,
  CHAIN,
  CHAIR,
  CHEST,
  CLOCK,
  CRADLE,
  CRANK,
  CURTAIN,
  DOOR,
  FLOOR,
  KNOB0,
  LAMP,
  LEGS,
  MOON,
  MUSICBOX,
  NIGHT_SOUNDS,
  type Night,
  PENDULUM,
  PULLEY1,
  PULLEY2,
  RAIL,
  ROPE,
  ROUND_WINDOW,
  SHELF,
  SHUTTER,
  STAR_R,
  TEDDY,
  TURN1,
  TURN2,
  WHEEL,
  WINDOW,
  WORLD_W,
} from "./night";
import { STAR_POINTS } from "./parts";
import type { Pt } from "./path";
import { DARK_WOOD, INK, MID_WOOD, WOOD } from "./scenery";

/** Warm evening wallpaper; the night lies over it as a dark veil once the lamp is out. */
const WALL = "#ffd9b5";
const NIGHT = "#0b1240";
const LIGHT = "#fff6b8";
const GOLD = "#ffc83d";
const CURTAIN_BLUE = "#3d4a9e";
const MOON_YELLOW = "#fff3b0";

/**
 * Level 13: the good-night machine (R-07). A children's room at dusk; one tap
 * winds the music box, its crank nudges the star ball down the zigzag gutter
 * into the basket, the basket sinks and pulls the curtain shut, the curtain
 * tips the rocking chair in the reading corner, whose backrest taps the cuckoo
 * clock's pendulum. Tick, tack – at the full hour the sleepy cuckoo slides out,
 * calls a soft „kuckuck“ and yawns, and its beak pushes the lamp's pull chain:
 * click, the light goes out. In the dark the hamster wakes, drinks from its
 * bottle and runs in its wheel, whose pulley draws the toy cable car up to the
 * round window; the car bumps the shutter open and the moon rises there. Its
 * light creeps down to the teddy, who yawns, and everything falls asleep while
 * the camera glides slowly back to the music box. Slow and quiet throughout.
 */
export function NightLevel(props: LevelProps) {
  const night = useMemo(buildNight, []);
  const ids = useId();
  useEffect(() => loadRecordings(NIGHT_SOUNDS), []);
  // The carousel's sheep stops facing us when the crank has run down.
  const finalTurn = night.crankTurn(1000);

  return (
    <MachineStage machine={night} level="night" start={{ x: CRANK.x - 10, y: CRANK.y + 5, r: 70 }} {...props}>
      {(t) => {
        const end = Math.min(t, night.duration);
        return (
          <>
            <Room />
            <SunsetWindow night={night} t={t} ids={ids} />
            <Shelf />
            <MusicBox night={night} t={t} finalTurn={finalTurn} />
            <Gutter />
            <Cords night={night} t={t} />
            <BasketBack night={night} t={t} />
            <StarBall night={night} t={t} />
            <BasketFront night={night} t={t} />
            <Curtain edge={night.curtainEdge(t)} />
            <ArcLamp night={night} t={t} ids={ids} />
            <CuckooClock night={night} t={t} ids={ids} />
            <g transform={`rotate(${deg(night.chairAngle(t))} ${CHAIR.x} ${FLOOR})`}>
              <RockingChair />
            </g>
            <HamsterNook />
            <CableCar night={night} t={t} />
            <Wheel turn={night.wheelTurn(t)} />
            <Bottle night={night} t={t} />
            <Hamster h={night.hamsterAt(t)} />
            <CageBars />
            <Cradle night={night} t={t} />

            <rect x="-400" y="-200" width={WORLD_W + 800} height={VIEW_H + 400} fill={NIGHT} opacity={night.dark(t)} />

            <RoundWindow night={night} t={t} ids={ids} />
            <StarGlow night={night} t={t} ids={ids} />
            <Zzz x={TEDDY.x + 40} y={TEDDY.y - 50} from={night.tTeddy} t={end} />
            <Zzz x={MOON.x + 60} y={MOON.y1 - 40} from={night.tMoonSleep} t={end} />
            <Zzz x={WHEEL.x + 24} y={WHEEL.y - 44} from={night.tHamsterSleep} t={end} />
            <Zzz x={DOOR.x + 34} y={DOOR.y - 30} from={night.tCuckoo} t={end} />
            <Zzz x={BASKET.x + 34} y={BASKET.rim1 - 50} from={night.tStar} t={end} />
            <Zzz x={CAROUSEL.x + 80} y={CAROUSEL.y - 30} from={night.tSheep} t={end} />
          </>
        );
      }}
    </MachineStage>
  );
}

/* ---------- The room ---------- */

function Room() {
  return (
    <g>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={WALL} />
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 90) }, (_, i) => (
        <rect key={i} x={-400 + i * 90} y="0" width="30" height={FLOOR} fill="#ffcfa3" />
      ))}
      {/* The ceiling's edge, where the pulleys hang. */}
      <rect x="-400" y="-200" width={WORLD_W + 800} height="212" fill="#fff0e0" />
      <line x1="-400" y1="12" x2={WORLD_W + 400} y2="12" stroke={INK} strokeWidth="4" />
      <rect x="-400" y={FLOOR - 14} width={WORLD_W + 800} height="14" fill="#fff0e0" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#b98ad0" />
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
      {/* A soft round rug in front of the cradle. */}
      <ellipse cx={CRADLE.x0 + 160} cy={FLOOR + 50} rx="420" ry="34" fill="#ffb3e1" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The big window with the sun going down behind purple hills; it sinks a little while the machine runs. */
function SunsetWindow({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const { x0, x1, top, bottom } = WINDOW;
  const sky = `${ids}-sky`;
  const clip = `${ids}-window`;
  const sunY = 360 + 150 * seg(t, 0, night.tShut);
  return (
    <g>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8fa3" />
          <stop offset="1" stopColor="#ffd27a" />
        </linearGradient>
        <clipPath id={clip}>
          <rect x={x0} y={top} width={x1 - x0} height={bottom - top} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={x0} y={top} width={x1 - x0} height={bottom - top} fill={`url(#${sky})`} />
        <circle cx={(x0 + x1) / 2 + 40} cy={sunY} r="56" fill="#ff8c42" />
        <path
          d={`M${x0} ${bottom - 70} Q${x0 + 120} ${bottom - 150} ${x0 + 250} ${bottom - 90} T${x1} ${bottom - 110} L${x1} ${bottom} L${x0} ${bottom} Z`}
          fill="#8e5bb5"
        />
      </g>
      <rect x={x0} y={top} width={x1 - x0} height={bottom - top} fill="none" stroke={INK} strokeWidth="6" />
      <line x1={(x0 + x1) / 2} y1={top} x2={(x0 + x1) / 2} y2={bottom} stroke={INK} strokeWidth="5" />
      <line x1={x0} y1={(top + bottom) / 2} x2={x1} y2={(top + bottom) / 2} stroke={INK} strokeWidth="5" />
      <rect x={x0 - 20} y={bottom} width={x1 - x0 + 40} height="18" rx="6" fill="#fff0e0" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- Music box, gutter, basket ---------- */

function Shelf() {
  const { x0, x1, top } = SHELF;
  return (
    <g>
      {[x0 + 50, x1 - 70].map((x) => (
        <path key={x} d={`M${x} ${top + 16} L${x} ${top + 80} L${x + 20} ${top + 80} L${x + 20} ${top + 36} Z`} fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      ))}
      <rect x={x0} y={top} width={x1 - x0} height="18" rx="6" fill={WOOD} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The music box: a crank on its right side, and on its lid a little carousel where a sheep and a cloud ride round. */
function MusicBox({ night, t, finalTurn }: { night: Night; t: number; finalTurn: number }) {
  const { x0, x1, top } = MUSICBOX;
  const bottom = SHELF.top;
  const angle = night.crankAngle(t);
  // The carousel turns slower than the crank; it ends with the sheep at the front, a little to the right.
  const turn = ((night.crankTurn(t) - finalTurn) * 0.5 + 25) * (Math.PI / 180);
  const riders = [
    { a: turn, sheep: true },
    { a: turn + Math.PI, sheep: false },
  ].map((r) => ({ ...r, x: CAROUSEL.x + CAROUSEL.r * Math.sin(r.a), depth: Math.cos(r.a) }));
  const ride = (r: (typeof riders)[number]) => (
    <g
      key={r.sheep ? "sheep" : "cloud"}
      transform={`translate(${r.x} ${CAROUSEL.y - 4}) scale(${1.4 * (0.82 + 0.18 * r.depth) * (r.depth >= 0 ? 1 : -1)} ${1.4 * (0.82 + 0.18 * r.depth)})`}
    >
      {r.sheep ? <Sheep sleep={night.asleep(t, night.tSheep)} /> : <Cloud />}
    </g>
  );
  return (
    <g>
      {/* The carousel: a disc on a pole with a little roof; who rides behind the pole is drawn first. */}
      <ellipse cx={CAROUSEL.x} cy={CAROUSEL.y + 6} rx={CAROUSEL.r + 22} ry="14" fill="#ff7bd0" stroke={INK} strokeWidth="3" />
      {riders.filter((r) => r.depth < 0).map(ride)}
      <line x1={CAROUSEL.x} y1={CAROUSEL.y + 4} x2={CAROUSEL.x} y2={CAROUSEL.y - 92} stroke={INK} strokeWidth="7" />
      <line x1={CAROUSEL.x} y1={CAROUSEL.y + 4} x2={CAROUSEL.x} y2={CAROUSEL.y - 92} stroke="#ffd23f" strokeWidth="3" />
      <path
        d={`M${CAROUSEL.x - 70} ${CAROUSEL.y - 82} Q${CAROUSEL.x} ${CAROUSEL.y - 132} ${CAROUSEL.x + 70} ${CAROUSEL.y - 82} Z`}
        fill="#8e7dff"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx={CAROUSEL.x} cy={CAROUSEL.y - 112} r="7" fill="#ffd23f" stroke={INK} strokeWidth="2" />
      {riders.filter((r) => r.depth >= 0).map(ride)}
      {/* The box */}
      <rect x={x0} y={top} width={x1 - x0} height={bottom - top} rx="10" fill="#7ad1c4" stroke={INK} strokeWidth="4" />
      <rect x={x0 - 6} y={top} width={x1 - x0 + 12} height="18" rx="7" fill="#4fb3a5" stroke={INK} strokeWidth="3" />
      <path
        d={`M${(x0 + x1) / 2} ${top + 70} l-20 -20 a12 12 0 0 1 20 -14 a12 12 0 0 1 20 14 z`}
        fill="#ff7bd0"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* The crank */}
      <line x1={x1} y1={CRANK.y} x2={CRANK.x} y2={CRANK.y} stroke={INK} strokeWidth="8" />
      <g transform={`rotate(${angle} ${CRANK.x} ${CRANK.y})`}>
        <line x1={CRANK.x} y1={CRANK.y} x2={CRANK.x + CRANK.len} y2={CRANK.y} stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <line x1={CRANK.x} y1={CRANK.y} x2={CRANK.x + CRANK.len} y2={CRANK.y} stroke="#ffd23f" strokeWidth="4" strokeLinecap="round" />
        <circle cx={CRANK.x + CRANK.len} cy={CRANK.y} r={CRANK.knob} fill="#ff5d73" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={CRANK.x} cy={CRANK.y} r="7" fill="#ffd23f" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A small woolly sheep looking right, its eye shut once `sleep` reaches 1. */
function Sheep({ sleep }: { sleep: number }) {
  return (
    <g>
      {[-14, 14].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="-14" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      ))}
      {[
        [-16, -26],
        [0, -32],
        [16, -26],
        [-8, -18],
        [10, -18],
      ].map(([x, y]) => (
        <circle key={`${x} ${y}`} cx={x} cy={y} r="13" fill="#fff" stroke={INK} strokeWidth="2.5" />
      ))}
      <ellipse cx="26" cy="-34" rx="11" ry="13" fill="#5b4a6e" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="20" cy="-44" rx="6" ry="3.5" fill="#5b4a6e" stroke={INK} strokeWidth="2" />
      <Eye x={29} y={-36} r={2.6} sleep={sleep} />
    </g>
  );
}

/** The little cloud riding opposite the sheep. */
function Cloud() {
  return <path d="M-24 -10 a12 12 0 0 1 8 -20 a16 16 0 0 1 28 -4 a12 12 0 0 1 12 24 Z" fill="#e8f6ff" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />;
}

/** An eye: a dot while awake, closing to a soft downward arc as `sleep` goes from 0 to 1. */
function Eye({ x, y, r, sleep }: { x: number; y: number; r: number; sleep: number }) {
  if (sleep < 0.5) return <ellipse cx={x} cy={y} rx={r} ry={r * (1 - sleep)} fill={INK} />;
  return (
    <path
      d={`M${x - r * 1.6} ${y} Q${x} ${y + r * 1.4} ${x + r * 1.6} ${y}`}
      fill="none"
      stroke={INK}
      strokeWidth={Math.max(2, r * 0.8)}
      strokeLinecap="round"
    />
  );
}

/** The wooden gutter: three gently sloping stretches, a curved wall at each turn, and pegs holding it on the wall. */
function Gutter() {
  const off = STAR_R + 6;
  const wall = (c: { x: number; y: number; r: number }, from: number, to: number) => {
    const r = c.r + off;
    const p = (deg: number) => ({ x: c.x + r * Math.cos((deg * Math.PI) / 180), y: c.y + r * Math.sin((deg * Math.PI) / 180) });
    const a = p(from);
    const b = p(to);
    return `M${a.x} ${a.y} A${r} ${r} 0 0 ${to > from ? 1 : 0} ${b.x} ${b.y}`;
  };
  const trough = (a: Pt, b: Pt) => ({ x1: a.x, y1: a.y + off, x2: b.x, y2: b.y + off });
  const pegs = LEGS.flatMap(([a, b]) => [0.2, 0.8].map((k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k + off + 14 })));
  const pieces = [
    ...LEGS.map(([a, b], i) => <line key={`leg${i}`} {...trough(i === 0 ? { x: SHELF.x1 - 10, y: a.y + 3 } : a, b)} />),
    <path key="turn1" d={wall(TURN1, -90, 90)} fill="none" />,
    <path key="turn2" d={wall(TURN2, 270, 90)} fill="none" />,
  ];
  return (
    <g strokeLinecap="round">
      {pegs.map((p) => (
        <g key={`${p.x} ${p.y}`}>
          <line x1={p.x} y1={p.y - 10} x2={p.x} y2={p.y + 16} stroke={INK} strokeWidth="10" />
          <line x1={p.x} y1={p.y - 10} x2={p.x} y2={p.y + 16} stroke={MID_WOOD} strokeWidth="5" />
        </g>
      ))}
      <g stroke={INK} strokeWidth="20">
        {pieces}
      </g>
      <g stroke={WOOD} strokeWidth="13">
        {pieces}
      </g>
      <g stroke="#f2b47a" strokeWidth="4" transform="translate(0 -3)">
        {pieces}
      </g>
    </g>
  );
}

/** The cord from the basket over the two pulleys on the ceiling and back along the rail to the curtain's front edge. */
function Cords({ night, t }: { night: Night; t: number }) {
  const hook = night.basketRim(t) - 70;
  const edge = night.curtainEdge(t);
  const cordY = RAIL.y + 8;
  return (
    <g>
      <path
        d={`M${BASKET.x} ${hook} L${PULLEY1.x} ${PULLEY1.y} L${PULLEY2.x} ${PULLEY2.y} L${PULLEY2.x} ${cordY} L${edge} ${cordY}`}
        fill="none"
        stroke="#7a5a3a"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[PULLEY1, PULLEY2].map((p) => (
        <g key={p.x}>
          <line x1={p.x} y1="12" x2={p.x} y2={p.y} stroke={INK} strokeWidth="5" />
          <circle cx={p.x} cy={p.y} r="15" fill="#c9d1e8" stroke={INK} strokeWidth="4" />
          <circle cx={p.x} cy={p.y} r="4" fill={INK} />
        </g>
      ))}
    </g>
  );
}

/** The basket's back, its strings and the inside, drawn behind the star ball. */
function BasketBack({ night, t }: { night: Night; t: number }) {
  const rim = night.basketRim(t);
  const { x, w } = BASKET;
  return (
    <g>
      {[-w / 2, 0, w / 2].map((dx) => (
        <line key={dx} x1={x} y1={rim - 70} x2={x + dx} y2={rim} stroke="#7a5a3a" strokeWidth="3" />
      ))}
      <ellipse cx={x} cy={rim} rx={w / 2} ry="12" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The basket's woven front, over the star ball. */
function BasketFront({ night, t }: { night: Night; t: number }) {
  const rim = night.basketRim(t);
  const { x, w, h } = BASKET;
  return (
    <g>
      <path
        d={`M${x - w / 2} ${rim} L${x - w / 2 + 12} ${rim + h} L${x + w / 2 - 12} ${rim + h} L${x + w / 2} ${rim} Q${x} ${rim + 14} ${x - w / 2} ${rim} Z`}
        fill="#e0a85e"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[16, 32].map((dy) => (
        <line key={dy} x1={x - w / 2 + 6 + dy / 4} y1={rim + dy} x2={x + w / 2 - 6 - dy / 4} y2={rim + dy} stroke="#b8763d" strokeWidth="3" />
      ))}
    </g>
  );
}

/** The golden star ball: a star on it turns as it rolls; in the basket it gets a face and falls asleep. */
function StarBall({ night, t }: { night: Night; t: number }) {
  const { pt, spin } = night.starAt(t);
  const inBasket = t >= night.tIn;
  const sleep = night.asleep(t, night.tStar);
  return (
    <g transform={`translate(${pt.x} ${pt.y})`}>
      <circle r={STAR_R} fill={GOLD} stroke={INK} strokeWidth="3" />
      <g transform={`rotate(${(spin * 180) / Math.PI})`}>
        <polygon
          points={STAR_POINTS}
          transform="scale(1.15)"
          fill="#fff6b8"
          stroke="#e09a00"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity={inBasket ? 0.5 : 1}
        />
      </g>
      {inBasket && (
        <g>
          <Eye x={-8} y={-6} r={3} sleep={sleep} />
          <Eye x={8} y={-6} r={3} sleep={sleep} />
          <path d="M-6 5 Q0 10 6 5" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}
      <circle cx="-9" cy="-11" r="5" fill="#fff" opacity="0.7" />
    </g>
  );
}

/** Glow-in-the-dark: once the room is dark, the star ball shines softly over the night. */
function StarGlow({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const k = night.dark(t) / 0.62;
  if (k <= 0) return null;
  const { pt } = night.starAt(t);
  return <circle cx={pt.x} cy={pt.y} r="70" fill={`url(#${ids}-glow)`} opacity={0.8 * k} />;
}

/* ---------- Reading corner: rocking chair, cuckoo clock ---------- */

/** The rocking chair, standing still; its group is turned round the spot where the rockers touch the floor. */
const RockingChair = memo(function RockingChair() {
  const x = CHAIR.x;
  const seat = 668;
  const rocker = `M${x - 165} ${FLOOR - 36} Q${x} ${FLOOR + 34} ${x + 165} ${FLOOR - 36}`;
  const wood = (d: string, w: number) => (
    <g key={d}>
      <path d={d} fill="none" stroke={INK} strokeWidth={w + 7} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={WOOD} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
  return (
    <g>
      {/* The rocker with a little curl at each end */}
      <path d={rocker} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <path d={rocker} fill="none" stroke={MID_WOOD} strokeWidth="9" strokeLinecap="round" />
      {[x - 165, x + 165].map((cx) => (
        <circle key={cx} cx={cx} cy={FLOOR - 44} r="9" fill={MID_WOOD} stroke={INK} strokeWidth="3.5" />
      ))}
      {/* Legs, back rest with its spindles, arm rest */}
      {[`M${x - 72} ${FLOOR - 10} L${x - 78} ${seat}`, `M${x + 86} ${FLOOR - 12} L${x + 92} ${seat}`].map((d) => wood(d, 9))}
      {[0.25, 0.5, 0.75].map((k) => wood(`M${x - 78 + 28 * k} ${seat - 4} L${KNOB0.x + 30 * k + 4} ${KNOB0.y + 10}`, 5))}
      {wood(`M${x - 78} ${seat} L${KNOB0.x} ${KNOB0.y}`, 10)}
      {wood(`M${x - 50} ${seat} L${KNOB0.x + 32} ${KNOB0.y + 6}`, 8)}
      {wood(`M${KNOB0.x} ${KNOB0.y + 4} Q${KNOB0.x + 18} ${KNOB0.y - 8} ${KNOB0.x + 36} ${KNOB0.y + 6}`, 9)}
      {wood(`M${x - 66} ${seat - 50} L${x + 96} ${seat - 54} q14 0 12 14`, 8)}
      {wood(`M${x + 92} ${seat - 46} L${x + 92} ${seat}`, 7)}
      {/* The seat with a soft cushion */}
      <rect x={x - 92} y={seat - 6} width="200" height="20" rx="8" fill={WOOD} stroke={INK} strokeWidth="4" />
      <path
        d={`M${x - 74} ${seat - 6} Q${x - 76} ${seat - 30} ${x - 50} ${seat - 28} L${x + 74} ${seat - 28} Q${x + 98} ${seat - 28} ${x + 96} ${seat - 6} Z`}
        fill="#ff9ec7"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {[-30, 10, 50].map((dx) => (
        <circle key={dx} cx={x + dx} cy={seat - 17} r="3" fill="#fff" opacity="0.8" />
      ))}
      <circle cx={KNOB0.x} cy={KNOB0.y} r={CHAIR.knobR} fill={GOLD} stroke={INK} strokeWidth="3.5" />
    </g>
  );
});

/** The cuckoo clock's carved case: roof, body, dial, the door's frame and the two pine cone weights; drawn once. */
const ClockCase = memo(function ClockCase() {
  const { x, top, bottom, w } = CLOCK;
  const dial = { y: top + 100, r: 28 };
  return (
    <g>
      {/* Pine cone weights on their chains */}
      {[x - 40, x + 40].map((cx, i) => (
        <g key={cx}>
          <line x1={cx} y1={bottom} x2={cx} y2={bottom + 44 + i * 10} stroke={INK} strokeWidth="3" strokeDasharray="4 4" />
          <ellipse cx={cx} cy={bottom + 64 + i * 10} rx="10" ry="20" fill={DARK_WOOD} stroke={INK} strokeWidth="3" />
          {[-8, 2, 12].map((dy) => (
            <path key={dy} d={`M${cx - 7} ${bottom + 64 + i * 10 + dy - 4} l7 5 l7 -5`} fill="none" stroke="#5c3a1a" strokeWidth="2" />
          ))}
        </g>
      ))}
      <rect x={x - w / 2} y={top} width={w} height={bottom - top} rx="6" fill="#a8643a" stroke={INK} strokeWidth="4" />
      {/* Carved leaves along the bottom */}
      <path
        d={`M${x - w / 2} ${bottom} Q${x - 30} ${bottom + 26} ${x} ${bottom + 8} Q${x + 30} ${bottom + 26} ${x + w / 2} ${bottom} Z`}
        fill="#7a4524"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* The roof */}
      <path d={`M${x - 85} ${top + 6} L${x} ${top - 30} L${x + 85} ${top + 6} Z`} fill="#6b3d1f" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d={`M${x - 60} ${top + 4} L${x} ${top - 20} L${x + 60} ${top + 4}`} fill="none" stroke="#b8763d" strokeWidth="3" strokeLinejoin="round" />
      {/* The dial with its twelve dots and an evening sky in the middle */}
      <circle cx={x} cy={dial.y} r={dial.r} fill="#fff6e0" stroke={INK} strokeWidth="3.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6;
        return <circle key={i} cx={x + (dial.r - 7) * Math.sin(a)} cy={dial.y - (dial.r - 7) * Math.cos(a)} r={i % 3 ? 1.6 : 2.6} fill={INK} />;
      })}
      {/* The door's frame and the little ledge the perch slides over */}
      <rect
        x={DOOR.x - DOOR.w / 2 - 5}
        y={DOOR.y - DOOR.h / 2 - 5}
        width={DOOR.w + 10}
        height={DOOR.h + 10}
        rx="5"
        fill="#6b3d1f"
        stroke={INK}
        strokeWidth="3"
      />
      <rect x={DOOR.x - DOOR.w / 2} y={DOOR.y - DOOR.h / 2} width={DOOR.w} height={DOOR.h} fill="#2a1a10" />
    </g>
  );
});

/** The cuckoo clock: hands, pendulum, the little door and the sleepy cuckoo sliding out on its perch. */
function CuckooClock({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const { x, top, bottom } = CLOCK;
  const dial = { x, y: top + 100 };
  const clip = `${ids}-cuckoo`;
  const x0 = DOOR.x - DOOR.w / 2;
  const open = night.doorOpen(t);
  const birdX = night.birdX(t);
  const show = birdX > BIRD.inX + 2;
  return (
    <g>
      {/* The pendulum swings behind the case's carved bottom */}
      <g transform={`rotate(${-deg(night.pendulumAngle(t))} ${x} ${bottom})`}>
        <line x1={x} y1={bottom} x2={x} y2={bottom + PENDULUM.len} stroke={INK} strokeWidth="5" />
        <line x1={x} y1={bottom} x2={x} y2={bottom + PENDULUM.len} stroke={GOLD} strokeWidth="2" />
        <circle cx={x} cy={bottom + PENDULUM.len} r={PENDULUM.bobR} fill={GOLD} stroke={INK} strokeWidth="3.5" />
        <path d={`M${x - 6} ${bottom + PENDULUM.len + 2} l6 -9 l6 9 Z`} fill="#e09a00" stroke="#e09a00" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <ClockCase />
      {/* Hands: the hour hand on seven, the minute hand stepping up to the full hour */}
      <g strokeLinecap="round" stroke={INK}>
        <line x1={dial.x} y1={dial.y} x2={dial.x} y2={dial.y - 15} strokeWidth="5" transform={`rotate(210 ${dial.x} ${dial.y})`} />
        <line x1={dial.x} y1={dial.y} x2={dial.x} y2={dial.y - 23} strokeWidth="3.5" transform={`rotate(${night.minuteHand(t)} ${dial.x} ${dial.y})`} />
      </g>
      <circle cx={dial.x} cy={dial.y} r="3.5" fill={INK} />
      {/* The cuckoo comes out of the dark door hole */}
      <defs>
        <clipPath id={clip}>
          <rect x={x0} y={DOOR.y - 80} width="300" height="160" />
        </clipPath>
      </defs>
      {show && (
        <g clipPath={`url(#${clip})`}>
          <line x1={x0 + 2} y1={BIRD.y + 19} x2={birdX + 4} y2={BIRD.y + 19} stroke={INK} strokeWidth="7" strokeLinecap="round" />
          <line x1={x0 + 2} y1={BIRD.y + 19} x2={birdX + 4} y2={BIRD.y + 19} stroke={MID_WOOD} strokeWidth="3.5" strokeLinecap="round" />
          <g transform={`translate(${birdX} ${BIRD.y})`}>
            <Cuckoo beak={night.beakOpen(t)} sleep={night.birdSleep(t)} />
          </g>
        </g>
      )}
      {/* The door, hinged on its left, swings open */}
      <g transform={`translate(${x0} 0) scale(${Math.cos(open * Math.PI * 0.85)} 1) translate(${-x0} 0)`}>
        <rect x={x0} y={DOOR.y - DOOR.h / 2} width={DOOR.w} height={DOOR.h} fill="#c98b55" stroke={INK} strokeWidth="2.5" />
        <circle cx={x0 + DOOR.w - 8} cy={DOOR.y} r="3" fill={GOLD} />
      </g>
    </g>
  );
}

/** The little cuckoo, seen from the side and looking right: a sleepy eye, and a beak that opens to call and to yawn. */
function Cuckoo({ beak, sleep }: { beak: number; sleep: number }) {
  // Drawn with its beak's tip at (27, -11), and scaled so the tip lands where the machine has it.
  const b = { dx: 27, dy: -11 };
  return (
    <g transform={`scale(${BIRD.beak.dx / b.dx})`}>
      <path d="M-14 -2 L-30 -12 L-27 6 Z" fill="#3d6fa8" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse rx="17" ry="13" fill="#9ad0ec" stroke={INK} strokeWidth="3" />
      <ellipse cx="4" cy="5" rx="9" ry="6" fill="#fff6e0" />
      <path d="M-12 -4 Q-2 -8 6 0 Q-4 6 -12 -4 Z" fill="#5b8fc7" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="10" cy="-11" r="10" fill="#9ad0ec" stroke={INK} strokeWidth="3" />
      {/* Lower beak drops open; the upper one stays */}
      <path
        d={`M18 -10 L${b.dx - 2} ${b.dy + 2} L18 -7 Z`}
        fill="#ff9a3d"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
        transform={`rotate(${45 * beak} 18 -10)`}
      />
      <path d={`M18 -14 L${b.dx} ${b.dy} L18 -9 Z`} fill="#ffb347" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <Eye x={11} y={-14} r={2.4} sleep={sleep} />
      <circle cx="6" cy="-6" r="3" fill="#ffb3c1" opacity="0.8" />
    </g>
  );
}

/* ---------- Curtain, lamp ---------- */

/** The curtain on its rail: dark blue with little golden stars, its folds spreading out as it is drawn shut. */
function Curtain({ edge }: { edge: number }) {
  const x0 = RAIL.x0 + 10;
  const top = RAIL.y + 6;
  const { bottom } = CURTAIN;
  const folds = 9;
  const xs = Array.from({ length: folds + 1 }, (_, i) => x0 + ((edge - x0) * i) / folds);
  // The hem dips a little at every second fold, drawn from the front edge back to the fixed end.
  const hem = xs
    .map((x, i) => `L${x} ${bottom + (i % 2 ? 10 : 0)}`)
    .reverse()
    .join(" ");
  return (
    <g>
      <path d={`M${x0} ${top} L${edge} ${top} ${hem} Z`} fill={CURTAIN_BLUE} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {xs.slice(1, -1).map((x, i) => (
        <line key={i} x1={x} y1={top + 4} x2={x} y2={bottom + (i % 2 ? 0 : 6)} stroke="#2c3678" strokeWidth="5" />
      ))}
      {xs
        .slice(0, -1)
        .map((x, i) =>
          [0, 1, 2].map((row) => (
            <polygon
              key={`${i}-${row}`}
              points={STAR_POINTS}
              transform={`translate(${(x + xs[i + 1]) / 2} ${top + 90 + row * 160 + (i % 2) * 70}) scale(0.5)`}
              fill="#ffd23f"
            />
          )),
        )}
      {/* The rail and the rings */}
      <line x1={RAIL.x0} y1={RAIL.y} x2={RAIL.x1} y2={RAIL.y} stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <line x1={RAIL.x0} y1={RAIL.y} x2={RAIL.x1} y2={RAIL.y} stroke={MID_WOOD} strokeWidth="5" strokeLinecap="round" />
      {xs.map((x) => (
        <circle key={x} cx={x} cy={RAIL.y + 2} r="7" fill="none" stroke="#ffd23f" strokeWidth="3" />
      ))}
      {[RAIL.x0, RAIL.x1].map((x) => (
        <circle key={x} cx={x} cy={RAIL.y} r="11" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

/** The arc floor lamp over the reading corner: shining warmly until its pull chain clicks it off. */
function ArcLamp({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const { base, shade, shadeH } = LAMP;
  const on = night.lampOn(t);
  const swing = night.chainSwing(t);
  const bead = { x: CHAIN.x + CHAIN.len * Math.sin(swing), y: CHAIN.top + CHAIN.len * Math.cos(swing) };
  const glow = `${ids}-glow`;
  // The arc rises a little above the shade and bends over to it.
  const arcY = shade.y - 60;
  const arm = `M${base} ${FLOOR - 16} L${base} ${arcY + 70} Q${base} ${arcY} ${(base + shade.x) / 2} ${arcY} Q${shade.x} ${arcY} ${shade.x} ${shade.y}`;
  return (
    <g>
      <defs>
        <radialGradient id={glow}>
          <stop offset="0" stopColor={LIGHT} stopOpacity="0.95" />
          <stop offset="1" stopColor={LIGHT} stopOpacity="0" />
        </radialGradient>
      </defs>
      {on > 0 && (
        <g opacity={on}>
          <path
            d={`M${shade.x - 40} ${shade.y + shadeH} L${shade.x + 40} ${shade.y + shadeH} L${shade.x + 190} ${FLOOR} L${shade.x - 190} ${FLOOR} Z`}
            fill={LIGHT}
            opacity="0.3"
          />
          <circle cx={shade.x} cy={shade.y + shadeH} r="170" fill={`url(#${glow})`} opacity="0.7" />
        </g>
      )}
      <ellipse cx={base} cy={FLOOR - 6} rx="70" ry="16" fill="#5b4a6e" stroke={INK} strokeWidth="4" />
      <path d={arm} fill="none" stroke={INK} strokeWidth="12" />
      <path d={arm} fill="none" stroke="#9aa3c8" strokeWidth="6" />
      <path
        d={`M${shade.x - 60} ${shade.y + shadeH} Q${shade.x - 56} ${shade.y} ${shade.x} ${shade.y} Q${shade.x + 56} ${shade.y} ${shade.x + 60} ${shade.y + shadeH} Z`}
        fill="#ff8c42"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx={shade.x} cy={shade.y + shadeH} rx="34" ry="10" fill={on > 0.5 ? LIGHT : "#cfd8ea"} stroke={INK} strokeWidth="3" />
      <line x1={CHAIN.x} y1={CHAIN.top} x2={bead.x} y2={bead.y} stroke={INK} strokeWidth="4" strokeDasharray="3 6" strokeLinecap="round" />
      <circle cx={bead.x} cy={bead.y} r={CHAIN.bead} fill="#ffd23f" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- The hamster's nook ---------- */

const CAGE_MID = (CAGE.x0 + CAGE.x1) / 2;
const CAGE_HALF = (CAGE.x1 - CAGE.x0) / 2;
/** The height of the cage's rounded roof above its sides. */
const ARCH = 60;
const ARCH_FOOT = CAGE.top + ARCH;
const TRAY_TOP = CAGE.floor - 8;

/** The chest of drawers, the cage's tray, the bedding and the wheel's stand: drawn once, they never move. */
const HamsterNook = memo(function HamsterNook() {
  const { x0, x1, top } = CHEST;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top - 6} rx="8" fill={WOOD} stroke={INK} strokeWidth="4" />
      {[0, 1].map((i) => {
        const y = top + 14 + i * 64;
        return (
          <g key={i}>
            <rect x={x0 + 16} y={y} width={x1 - x0 - 32} height="52" rx="6" fill={MID_WOOD} stroke={INK} strokeWidth="3" />
            <circle cx={(x0 + x1) / 2} cy={y + 26} r="7" fill={GOLD} stroke={INK} strokeWidth="2.5" />
          </g>
        );
      })}
      {[x0 + 22, x1 - 22].map((x) => (
        <rect key={x} x={x - 10} y={FLOOR - 10} width="20" height="12" rx="3" fill={DARK_WOOD} stroke={INK} strokeWidth="2.5" />
      ))}
      {/* The cage's back wall, a faint blue, and its tray */}
      <path
        d={`M${CAGE.x0} ${TRAY_TOP} L${CAGE.x0} ${ARCH_FOOT} A${CAGE_HALF} ${ARCH} 0 0 1 ${CAGE.x1} ${ARCH_FOOT} L${CAGE.x1} ${TRAY_TOP} Z`}
        fill="#e4f1ff"
        opacity="0.55"
      />
      <rect x={CAGE.x0 - 8} y={TRAY_TOP} width={CAGE.x1 - CAGE.x0 + 16} height={CAGE.bottom - TRAY_TOP} rx="6" fill="#8fd3c1" stroke={INK} strokeWidth="4" />
      {/* The bedding: a soft heap of wood shavings */}
      <path
        d={`M${BED.x - 52} ${TRAY_TOP} Q${BED.x - 40} ${BED.y + 4} ${BED.x - 10} ${BED.y + 8} Q${BED.x + 30} ${BED.y + 4} ${BED.x + 48} ${TRAY_TOP} Z`}
        fill="#f6dc8c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[-34, -14, 8, 28].map((dx, i) => (
        <path key={dx} d={`M${BED.x + dx} ${TRAY_TOP - 4 - (i % 2) * 5} q6 -5 12 0`} fill="none" stroke="#d9a94a" strokeWidth="2.5" strokeLinecap="round" />
      ))}
      {/* The wheel's stand */}
      <path
        d={`M${WHEEL.x - 42} ${TRAY_TOP} L${WHEEL.x} ${WHEEL.y} L${WHEEL.x + 42} ${TRAY_TOP}`}
        fill="none"
        stroke={INK}
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path
        d={`M${WHEEL.x - 42} ${TRAY_TOP} L${WHEEL.x} ${WHEEL.y} L${WHEEL.x + 42} ${TRAY_TOP}`}
        fill="none"
        stroke="#9aa3c8"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </g>
  );
});

/** The cage's wire bars and roof, in front of the hamster: drawn once. */
const CageBars = memo(function CageBars() {
  const bars: number[] = [];
  for (let x = CAGE.x0; x <= CAGE.x1 + 0.5; x += 20) bars.push(x);
  return (
    <g stroke={INK} fill="none" strokeLinecap="round">
      {bars.map((x) => {
        const u = (x - CAGE_MID) / CAGE_HALF;
        const top = ARCH_FOOT - ARCH * Math.sqrt(Math.max(0, 1 - u * u));
        return <line key={x} x1={x} y1={top} x2={x} y2={TRAY_TOP} strokeWidth="2" opacity="0.5" />;
      })}
      <path d={`M${CAGE.x0} ${ARCH_FOOT} A${CAGE_HALF} ${ARCH} 0 0 1 ${CAGE.x1} ${ARCH_FOOT}`} strokeWidth="4" />
      <line x1={CAGE.x0} y1={ARCH_FOOT} x2={CAGE.x0} y2={TRAY_TOP} strokeWidth="4" />
      <line x1={CAGE.x1} y1={ARCH_FOOT} x2={CAGE.x1} y2={TRAY_TOP} strokeWidth="4" />
      <line x1={CAGE.x0} y1={ARCH_FOOT} x2={CAGE.x1} y2={ARCH_FOOT} strokeWidth="3" opacity="0.7" />
      <circle cx={CAGE_MID} cy={CAGE.top - 8} r="9" strokeWidth="4" />
    </g>
  );
});

/** The hamster wheel, turned by `turn` radians: its rungs go round as the hamster runs. */
function Wheel({ turn }: { turn: number }) {
  const { x, y, r } = WHEEL;
  const rungs = 18;
  return (
    <g>
      <g transform={`rotate(${deg(turn)} ${x} ${y})`}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i * Math.PI) / 3;
          return <line key={i} x1={x} y1={y} x2={x + (r - 4) * Math.cos(a)} y2={y + (r - 4) * Math.sin(a)} stroke="#9aa3c8" strokeWidth="4" />;
        })}
        {Array.from({ length: rungs }, (_, i) => {
          const a = (i * 2 * Math.PI) / rungs;
          return (
            <line
              key={i}
              x1={x + (r - 8) * Math.cos(a)}
              y1={y + (r - 8) * Math.sin(a)}
              x2={x + r * Math.cos(a)}
              y2={y + r * Math.sin(a)}
              stroke={INK}
              strokeWidth="2.5"
            />
          );
        })}
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth="5" />
      <circle cx={x} cy={y} r={r - 8} fill="none" stroke="#7fb3d5" strokeWidth="4" />
      <circle cx={x} cy={y} r="7" fill={GOLD} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A grooved pulley turned by `turn` radians. */
function Pulley({ x, y, r, turn }: { x: number; y: number; r: number; turn: number }) {
  return (
    <g transform={`rotate(${deg(turn)} ${x} ${y})`}>
      <circle cx={x} cy={y} r={r} fill={MID_WOOD} stroke={INK} strokeWidth="3.5" />
      <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke={DARK_WOOD} strokeWidth="2" />
      <line x1={x - r * 0.6} y1={y} x2={x + r * 0.6} y2={y} stroke={INK} strokeWidth="2.5" />
      <circle cx={x} cy={y} r="3" fill={INK} />
    </g>
  );
}

/** The rope loop between the pulley on the wheel's axle and the one by the round window, and the little cable car on it. */
function CableCar({ night, t }: { night: Night; t: number }) {
  const { drive, turn } = ROPE;
  const run = night.wheelTurn(t) * drive.r;
  const grip = night.carAt(t);
  const upper = { x1: drive.x, y1: drive.y - drive.r, x2: turn.x, y2: turn.y - turn.r };
  const lower = { x1: drive.x, y1: drive.y + drive.r, x2: turn.x, y2: turn.y + turn.r };
  // Little knots on the rope show it running: up on the upper strand, down on the lower one.
  const knots = (s: { x1: number; y1: number; x2: number; y2: number }, dir: number) => {
    const len = Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
    const gap = 160;
    const off = (((dir * run) % gap) + gap) % gap;
    const out: { x: number; y: number }[] = [];
    for (let d = off + 40; d < len - 30; d += gap) out.push({ x: s.x1 + ((s.x2 - s.x1) * d) / len, y: s.y1 + ((s.y2 - s.y1) * d) / len });
    return out;
  };
  const cabinTop = grip.y + CAR.hanger;
  return (
    <g>
      {/* The turning pulley's bracket on the wall */}
      <path d={`M${turn.x} ${turn.y} L${turn.x - 26} ${turn.y - 26}`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <rect x={turn.x - 40} y={turn.y - 40} width="24" height="24" rx="4" fill={DARK_WOOD} stroke={INK} strokeWidth="3" />
      <Pulley x={drive.x} y={drive.y} r={drive.r} turn={night.wheelTurn(t)} />
      <Pulley x={turn.x} y={turn.y} r={turn.r} turn={run / turn.r} />
      {[upper, lower].map((s, i) => (
        <g key={i}>
          <line {...s} stroke={INK} strokeWidth="3" />
          {knots(s, i === 0 ? 1 : -1).map((p, j) => (
            <circle key={j} cx={p.x} cy={p.y} r="3.5" fill="#c0392b" />
          ))}
        </g>
      ))}
      {/* The car: grip on the rope, hanger, and a red cabin with a window and a roof */}
      <rect x={grip.x - 7} y={grip.y - 6} width="14" height="10" rx="3" fill="#5b4a6e" stroke={INK} strokeWidth="2.5" />
      <line x1={grip.x} y1={grip.y + 2} x2={grip.x} y2={cabinTop + 4} stroke={INK} strokeWidth="4" />
      <rect x={grip.x - CAR.w / 2} y={cabinTop} width={CAR.w} height={CAR.h} rx="9" fill="#e07a5f" stroke={INK} strokeWidth="3.5" />
      <rect x={grip.x - CAR.w / 2 + 9} y={cabinTop + 9} width={CAR.w - 18} height="16" rx="4" fill="#cfe8ff" stroke={INK} strokeWidth="2.5" />
      <path
        d={`M${grip.x - CAR.w / 2 - 4} ${cabinTop + 2} Q${grip.x} ${cabinTop - 12} ${grip.x + CAR.w / 2 + 4} ${cabinTop + 2} Z`}
        fill="#3d405b"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** The water bottle on the cage's left wall: the water sinks a little with each sip, and a bubble rises after it. */
function Bottle({ night, t }: { night: Night; t: number }) {
  const { x0, x1, top, bottom, spout } = BOTTLE;
  const w = x1 - x0;
  const waterTop = bottom - 6 - (bottom - top - 16) * 0.85 * night.water(t);
  return (
    <g>
      <line x1={x1 - 6} y1={bottom + 4} x2={spout.x} y2={spout.y} stroke="#9aa3c8" strokeWidth="5" strokeLinecap="round" />
      <line x1={x1 - 6} y1={bottom + 4} x2={spout.x} y2={spout.y} stroke={INK} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <rect x={x0} y={waterTop} width={w} height={bottom - waterTop} rx="6" fill="#7fc8f8" />
      {night
        .bubbles(t)
        .map((k, i) =>
          k === null ? null : (
            <circle key={i} cx={x0 + w / 2 + (i ? 4 : -4)} cy={lerp(bottom - 8, waterTop + 6, k)} r="4" fill="#e8f6ff" opacity={1 - k * 0.6} />
          ),
        )}
      <rect x={x0} y={top} width={w} height={bottom - top} rx="10" fill="#e8f6ff" fillOpacity="0.25" stroke={INK} strokeWidth="3" />
      <rect x={x0 - 3} y={bottom - 2} width={w + 6} height="10" rx="3" fill="#ff8c42" stroke={INK} strokeWidth="2.5" />
      <path d={`M${x0 + 4} ${top + 8} L${CAGE.x0 - 2} ${top + 8}`} stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The hamster: facing right in its drawing (mirrored by `face`), rearing up by `rear`, its feet pattering with `step`. */
function Hamster({ h }: { h: ReturnType<Night["hamsterAt"]> }) {
  const fur = "#e9a96b";
  const light = "#fbe3c4";
  const p = Math.sin(h.step * 2 * Math.PI) * 4;
  return (
    <g transform={`translate(${h.x} ${h.y}) scale(${h.face} 1) rotate(${-deg(h.rear)} -20 16)`}>
      <ellipse cx={-14 - p} cy="18" rx="8" ry="5" fill={light} stroke={INK} strokeWidth="2.5" />
      <ellipse cx={14 + p} cy="18" rx="7" ry="5" fill={light} stroke={INK} strokeWidth="2.5" />
      <circle cx="-30" cy="4" r="4" fill={light} stroke={INK} strokeWidth="2" />
      <ellipse rx="31" ry="21" fill={fur} stroke={INK} strokeWidth="3" />
      <ellipse cx="6" cy="9" rx="19" ry="10" fill={light} />
      {[2, 15].map((ex) => (
        <g key={ex}>
          <circle cx={ex} cy="-19" r="7.5" fill={fur} stroke={INK} strokeWidth="2.5" />
          <circle cx={ex} cy="-19" r="3.5" fill="#ffb3c1" />
        </g>
      ))}
      <circle cx="24" cy="4" r="8" fill={light} />
      <Eye x={20} y={-5} r={3.5} sleep={1 - h.awake} />
      <circle cx="33" cy="-3" r="3.2" fill="#ff8fa3" stroke={INK} strokeWidth="1.5" />
      <path d="M30 1 l12 -3 M30 3 l12 3" stroke={INK} strokeWidth="1.2" opacity="0.6" />
    </g>
  );
}

/* ---------- Round window, moon, cradle ---------- */

/** The round window over the cradle: the evening sky turns to night, stars come out and the sleepy moon rises. Drawn over the dark veil, as it is outside. */
function RoundWindow({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const { x, y, r } = ROUND_WINDOW;
  const clip = `${ids}-round`;
  const k = night.dark(t) / 0.62;
  const moonY = night.moonY(t);
  const up = seg(moonY, MOON.y0, MOON.y1);
  const sleep = night.asleep(t, night.tMoonSleep);
  // The moonlight creeps down from the window to the cradle's foot: its sides run on to where its lowest point is.
  const low = night.beamY(t);
  const reach = (low - BEAM_TOP) / (CRADLE.bottom - BEAM_TOP);
  const shut = night.shutterTurn(t);
  return (
    <g>
      {/* Moonlight falling onto the cradle */}
      {reach > 0 && (
        <path
          d={`M${x - 70} ${BEAM_TOP} L${x + 70} ${BEAM_TOP} L${lerp(x + 70, CRADLE.x1 + 10, reach)} ${low} L${lerp(x - 70, CRADLE.x0 - 10, reach)} ${low} Z`}
          fill={LIGHT}
          opacity={0.2 * up}
        />
      )}
      <defs>
        <clipPath id={clip}>
          <circle cx={x} cy={y} r={r} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="#ffb88c" />
        <rect x={x - r} y={y - r} width={2 * r} height={2 * r} fill="#1b2266" opacity={k} />
        {[
          [-60, -50],
          [-20, -80],
          [40, -66],
          [-70, 10],
          [70, 30],
        ].map(([dx, dy], i) => (
          <polygon
            key={i}
            points={STAR_POINTS}
            transform={`translate(${x + dx} ${y + dy}) scale(0.45)`}
            fill={MOON_YELLOW}
            opacity={seg(k, 0.3 + i * 0.12, 0.6 + i * 0.12)}
          />
        ))}
        <circle cx={MOON.x} cy={moonY} r={MOON.r + 26} fill={`url(#${ids}-glow)`} opacity={0.6 * up} />
        <g transform={`translate(${MOON.x} ${moonY})`}>
          <circle r={MOON.r} fill={MOON_YELLOW} stroke={INK} strokeWidth="3" />
          <circle cx="-22" cy="16" r="6" fill="#ffd27a" />
          <circle cx="18" cy="-22" r="5" fill="#ffd27a" />
          <Eye x={-15} y={-6} r={4} sleep={sleep} />
          <Eye x={15} y={-6} r={4} sleep={sleep} />
          <circle cx="-24" cy="6" r="6" fill="#ffb3c1" opacity="0.8" />
          <circle cx="24" cy="6" r="6" fill="#ffb3c1" opacity="0.8" />
          <path d="M-8 12 Q0 18 8 12" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
        <line x1={x} y1={y - r} x2={x} y2={y + r} stroke={INK} strokeWidth="5" />
        <line x1={x - r} y1={y} x2={x + r} y2={y} stroke={INK} strokeWidth="5" />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={WOOD} strokeWidth="18" />
      <circle cx={x} cy={y} r={r + 9} fill="none" stroke={INK} strokeWidth="4" />
      <circle cx={x} cy={y} r={r - 9} fill="none" stroke={INK} strokeWidth="3" />
      <Shutter turn={shut} dark={night.dark(t)} />
    </g>
  );
}

/** The round wooden shutter over the window, hinged at its right side; swung open by `turn` radians it is seen edge-on. */
function Shutter({ turn, dark }: { turn: number; dark: number }) {
  const { r, hingeX } = SHUTTER;
  const y = ROUND_WINDOW.y;
  const planks = [-r / 2, 0, r / 2];
  return (
    <g>
      <g transform={`translate(${hingeX} ${y}) scale(${Math.cos(turn)} 1)`}>
        <circle cx={-r} cy={0} r={r} fill={MID_WOOD} stroke={INK} strokeWidth="4" vectorEffect="non-scaling-stroke" />
        {planks.map((py) => {
          const half = Math.sqrt(r * r - py * py);
          return <line key={py} x1={-r - half + 4} y1={py} x2={-r + half - 4} y2={py} stroke={DARK_WOOD} strokeWidth="3" vectorEffect="non-scaling-stroke" />;
        })}
        {/* A little crescent cut into it, and its knob at the free side */}
        <path d={`M${-r - 8} -40 a22 22 0 1 0 22 30 a17 17 0 1 1 -22 -30 Z`} fill={NIGHT} opacity="0.75" />
        <circle cx={-2 * r + 16} cy={0} r={7} fill={GOLD} stroke={INK} strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <circle cx={-r} cy={0} r={r} fill={NIGHT} opacity={dark} />
      </g>
      {[-r / 2, r / 2].map((dy) => (
        <rect key={dy} x={hingeX - 6} y={y + dy - 10} width="12" height="20" rx="3" fill="#5b4a6e" stroke={INK} strokeWidth="2.5" />
      ))}
    </g>
  );
}

/** The cradle on its rockers with the teddy under a blanket; the teddy yawns, closes its eyes, and the cradle rocks gently. */
function Cradle({ night, t }: { night: Night; t: number }) {
  const { x0, x1, top, bottom } = CRADLE;
  const mid = (x0 + x1) / 2;
  const sleep = night.asleep(t, night.tTeddy);
  const yawn = Math.sin(Math.PI * seg(t, night.tYawn, night.tYawn + 1.1));
  return (
    <g transform={`rotate(${night.rock(t)} ${mid} ${FLOOR})`}>
      <path d={`M${x0 - 20} ${bottom + 30} Q${mid} ${FLOOR + 22} ${x1 + 20} ${bottom + 30}`} fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
      <path
        d={`M${x0 - 20} ${bottom + 30} Q${mid} ${FLOOR + 22} ${x1 + 20} ${bottom + 30}`}
        fill="none"
        stroke={MID_WOOD}
        strokeWidth="9"
        strokeLinecap="round"
      />
      {[x0 + 30, x1 - 30].map((x) => (
        <line key={x} x1={x} y1={bottom} x2={x} y2={bottom + 40} stroke={INK} strokeWidth="12" />
      ))}
      {/* Headboard, pillow, teddy, blanket, footboard */}
      <rect x={x0} y={top - 90} width="40" height={bottom - top + 90} rx="16" fill={WOOD} stroke={INK} strokeWidth="4" />
      <ellipse cx={TEDDY.x - 6} cy={top + 6} rx="64" ry="24" fill="#fff" stroke={INK} strokeWidth="3" />
      <Teddy sleep={sleep} yawn={yawn} />
      <path
        d={`M${x0 + 30} ${top + 14} Q${mid + 20} ${top - 18} ${x1 - 20} ${top + 4} L${x1 - 20} ${bottom - 10} L${x0 + 30} ${bottom - 10} Z`}
        fill="#8ecae6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={STAR_POINTS} transform={`translate(${x0 + 100 + i * 52} ${top + 50 + (i % 2) * 30}) scale(0.7)`} fill="#fff6b8" />
      ))}
      <rect x={x0 + 10} y={bottom - 20} width={x1 - x0 - 20} height="30" rx="10" fill={WOOD} stroke={INK} strokeWidth="4" />
      <rect x={x1 - 40} y={top - 30} width="40" height={bottom - top + 30} rx="16" fill={WOOD} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The teddy's head on the pillow: eyes close as `sleep` goes to 1, and its mouth opens wide while it yawns. */
function Teddy({ sleep, yawn }: { sleep: number; yawn: number }) {
  return (
    <g transform={`translate(${TEDDY.x} ${TEDDY.y}) scale(1.25)`}>
      {[-30, 30].map((dx) => (
        <g key={dx}>
          <circle cx={dx} cy="-30" r="15" fill="#c98b55" stroke={INK} strokeWidth="3" />
          <circle cx={dx} cy="-30" r="7" fill="#f2c08f" />
        </g>
      ))}
      <circle r="40" fill="#c98b55" stroke={INK} strokeWidth="4" />
      <ellipse cy="14" rx="18" ry="14" fill="#f2c08f" />
      <ellipse cy="6" rx="6" ry="4" fill={INK} />
      {yawn > 0.05 ? (
        <ellipse cy="20" rx={5 + 3 * yawn} ry={3 + 8 * yawn} fill="#7a2840" />
      ) : (
        <path d="M-6 17 Q0 22 6 17" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      )}
      <Eye x={-14} y={-8} r={4.5} sleep={Math.max(sleep, yawn * 0.9)} />
      <Eye x={14} y={-8} r={4.5} sleep={Math.max(sleep, yawn * 0.9)} />
    </g>
  );
}

/** „Z z z“ rising from someone asleep, from the moment `from` on; `t` stops at the level's end, so they stand still then. */
function Zzz({ x, y, from, t }: { x: number; y: number; from: number; t: number }) {
  if (t < from) return null;
  return (
    <g>
      {[0, 1, 2].map((j) => {
        const u = t - from - j * 0.8;
        if (u < 0) return null;
        const age = u % 2.4;
        const o = easeOut(seg(age, 0, 0.3)) * (1 - seg(age, 1.7, 2.4));
        return (
          <text
            key={j}
            x={x + 22 * age + 6 * Math.sin(age * 3)}
            y={y - 40 * age}
            fontSize={30 + 10 * j}
            fontWeight="800"
            fill="#e8e4ff"
            stroke={INK}
            strokeWidth="1.5"
            opacity={o}
          >
            z
          </text>
        );
      })}
    </g>
  );
}
