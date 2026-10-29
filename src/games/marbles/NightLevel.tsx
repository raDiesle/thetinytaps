import { useId, useMemo } from "react";
import { VIEW_H, type LevelProps } from "./level";
import { easeOut, seg } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import {
  BASKET,
  buildNight,
  CAROUSEL,
  CHAIN,
  CRADLE,
  CRANK,
  CURTAIN,
  FLOOR,
  LAMP,
  LEGS,
  MOON,
  MUSICBOX,
  type Night,
  PULLEY1,
  PULLEY2,
  RAIL,
  ROUND_WINDOW,
  SHELF,
  STAR_R,
  TEDDY,
  TURN1,
  TURN2,
  WINDOW,
  WORLD_W,
} from "./night";
import { STAR_POINTS } from "./parts";
import type { Pt } from "./path";
import { INK, MID_WOOD, WOOD } from "./scenery";

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
 * pushes the lamp's pull chain – click, the light goes out – and the moon rises
 * in the round window. The teddy yawns and everything falls asleep while the
 * camera glides slowly back to the music box. Slow and quiet throughout.
 */
export function NightLevel(props: LevelProps) {
  const night = useMemo(buildNight, []);
  const ids = useId();
  // The carousel's sheep stops facing us when the crank has run down.
  const finalTurn = night.crankTurn(1000);

  return (
    <MachineStage machine={night} level="night" {...props}>
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
            <Cradle night={night} t={t} />

            <rect x="-400" y="-200" width={WORLD_W + 800} height={VIEW_H + 400} fill={NIGHT} opacity={night.dark(t)} />

            <RoundWindow night={night} t={t} ids={ids} />
            <StarGlow night={night} t={t} ids={ids} />
            <Zzz x={TEDDY.x + 40} y={TEDDY.y - 50} from={night.tTeddy} t={end} />
            <Zzz x={MOON.x + 60} y={MOON.y1 - 40} from={night.tMoonSleep} t={end} />
            <Zzz x={BASKET.x + 34} y={BASKET.rim1 - 50} from={night.tStar} t={end} />
            <Zzz x={CAROUSEL.x + 80} y={CAROUSEL.y - 30} from={night.tSheep} t={end} />
            <TapHint t={t} x={CRANK.x + 6} y={SHELF.top + 150} />
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

/** The arc floor lamp: shining warmly until its pull chain clicks it off. */
function ArcLamp({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const { base, shade, shadeH } = LAMP;
  const on = night.lampOn(t);
  const swing = night.chainSwing(t);
  const bead = { x: CHAIN.x + CHAIN.len * Math.sin(swing), y: CHAIN.top + CHAIN.len * Math.cos(swing) };
  const glow = `${ids}-glow`;
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
      <path
        d={`M${base} ${FLOOR - 16} L${base} 200 Q${base} 130 ${(base + shade.x) / 2} 130 Q${shade.x} 130 ${shade.x} ${shade.y}`}
        fill="none"
        stroke={INK}
        strokeWidth="12"
      />
      <path
        d={`M${base} ${FLOOR - 16} L${base} 200 Q${base} 130 ${(base + shade.x) / 2} 130 Q${shade.x} 130 ${shade.x} ${shade.y}`}
        fill="none"
        stroke="#9aa3c8"
        strokeWidth="6"
      />
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

/* ---------- Round window, moon, cradle ---------- */

/** The round window over the cradle: the evening sky turns to night, stars come out and the sleepy moon rises. Drawn over the dark veil, as it is outside. */
function RoundWindow({ night, t, ids }: { night: Night; t: number; ids: string }) {
  const { x, y, r } = ROUND_WINDOW;
  const clip = `${ids}-round`;
  const k = night.dark(t) / 0.62;
  const moonY = night.moonY(t);
  const up = seg(moonY, MOON.y0, MOON.y1);
  const sleep = night.asleep(t, night.tMoonSleep);
  return (
    <g>
      {/* Moonlight falling onto the cradle */}
      <path
        d={`M${x - 70} ${y + 80} L${x + 70} ${y + 80} L${CRADLE.x1 + 10} ${CRADLE.bottom} L${CRADLE.x0 - 10} ${CRADLE.bottom} Z`}
        fill={LIGHT}
        opacity={0.16 * up}
      />
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
