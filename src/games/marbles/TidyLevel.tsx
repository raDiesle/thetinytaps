import { memo, useId, useMemo } from "react";
import { VIEW_H, type LevelProps } from "./level";
import { clamp01, lerp, svgLine } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { BAR_COLORS, STAR_POINTS } from "./parts";
import { INK, Picture, Sparkles, WallClock, Window } from "./scenery";
import type { Pt } from "./path";
import {
  BALL_R,
  BASKET,
  BED,
  BELLOWS,
  BLOCK,
  BLOCKS,
  BOOK_LEN,
  BOOKS,
  buildTidy,
  CHEST,
  CRAYON,
  CRAYONS,
  CUSHION,
  FLOOR,
  FRONT_WHEEL,
  HORSE,
  IN_BED,
  LID,
  NOZZLE,
  PIECES,
  PILLOW,
  PLUG,
  POT,
  PUZZLE,
  PUZZLE_X1,
  SHELF,
  SOCK_BALL_R,
  SOCKS,
  slotCentre,
  STOOL,
  type Tidy,
  TRUCK,
  WORLD_W,
} from "./tidy";

const WALL = "#ffe8b0";
const STRIPE = "#ffdc8f";
const HORSE_WOOD = "#c47a3a";
const BUNNY = "#f3d9e8";

/**
 * Level 13: the tidy-up machine (R-08). An untidy children's room; one tap
 * rocks the rocking horse, which kicks the football, the football rolls the
 * blocks into the toy chest and drops in after them, the lid slams shut and
 * sets off the toy truck, which pushes the books to the shelf, where they hop
 * in, and then bounces on the bellows: each puff blows a sock into the laundry
 * basket, and the last one throws the sock ball, which bounces off the basket
 * and rolls along the floor – the crayons hop into the pencil pot, the pieces
 * into the jigsaw puzzle – until it knocks the plug out of the air cushion,
 * which jumps and throws the bunny into bed. At the end everything is tidy
 * and glitters.
 */
export function TidyLevel(props: LevelProps) {
  const tidy = useMemo(buildTidy, []);
  const ids = useId();

  return (
    <MachineStage machine={tidy} level="tidy" {...props}>
      {(t) => (
        <>
          <Room paper={`${ids}-paper`} />
          {t < 0 && <StartGlow id={`${ids}-glow`} />}
          <RockingHorse tilt={tidy.rock(t)} />
          <ChestInside tidy={tidy} t={t} />
          <Lid tidy={tidy} t={t} />
          {BLOCKS.map((_, i) => (
            <Block key={i} i={i} tidy={tidy} t={t} />
          ))}
          <Football tidy={tidy} t={t} />
          <ChestFront tidy={tidy} t={t} />

          <Shelf />
          <Hose tidy={tidy} t={t} />
          <Bellows tidy={tidy} t={t} />
          {t < tidy.tBallOff && <SockBall tidy={tidy} t={t} />}
          <BasketBack tilt={tidy.basketTilt(t)} />
          {SOCKS.map((_, k) => (
            <Sock key={k} k={k} tidy={tidy} t={t} />
          ))}
          <BasketFront tilt={tidy.basketTilt(t)} />
          <NozzleBlast age={tidy.blast(t)} />

          <Stool />
          {CRAYONS.map((_, k) => (
            <Crayon key={k} k={k} tidy={tidy} t={t} />
          ))}
          <Pot tilt={tidy.potTilt(t)} />
          <PuzzleDefs ids={ids} />
          <PuzzleBoard ids={ids} />
          {PIECES.map((_, i) => (
            <Piece key={i} i={i} ids={ids} tidy={tidy} t={t} />
          ))}
          <Sparkles x={(PUZZLE.x0 + PUZZLE_X1) / 2} y={PUZZLE.top + 90} age={t - tidy.tPuzzle} n={8} spread={170} />
          <Cushion tidy={tidy} t={t} />
          <PlugCap tidy={tidy} t={t} />

          <Bed />
          {BOOKS.map((_, j) => (
            <Book key={j} j={j} tidy={tidy} t={t} />
          ))}
          <Truck tidy={tidy} t={t} />
          {t >= tidy.tBallOff && <SockBall tidy={tidy} t={t} />}
          <AirJet tidy={tidy} t={t} />
          <Bunny tidy={tidy} t={t} />
          <Blanket k={tidy.blanket(t)} />

          <Sparkles x={(PUZZLE.x0 + PUZZLE_X1) / 2} y={PUZZLE.top - 30} age={t - tidy.tGlitter} n={10} spread={220} />
          <Sparkles x={PILLOW.x - 120} y={BED.top - 70} age={t - tidy.tGlitter - 0.25} n={10} spread={240} />
          <Sparkles x={(CUSHION.x0 + CUSHION.x1) / 2} y={FLOOR - 140} age={t - tidy.tGlitter - 0.5} n={8} spread={180} />
          {/* Under the horse's belly, between its legs: the bottom edge of the picture is cut off on a phone on its side. */}
          <TapHint t={t} x={HORSE.x} y={FLOOR - 34} />
        </>
      )}
    </MachineStage>
  );
}

/* ---------- The room ---------- */

/** The room's wallpaper, pictures and floor: drawn once, it never changes. */
const Room = memo(function Room({ paper }: { paper: string }) {
  return (
    <g>
      <defs>
        <pattern id={paper} width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill={WALL} />
          <rect width="26" height="80" fill={STRIPE} />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={WORLD_W + 800} height={FLOOR + 200} fill={`url(#${paper})`} />
      <Window x={1080} y={110} />
      <Picture x={2620} y={300} />
      <WallClock x={3180} y={220} />
      <Picture x={4440} y={250} />
      <Window x={5520} y={110} />
      <Picture x={6280} y={250} />
      {/* Skirting board and floor */}
      <rect x="-400" y={FLOOR - 14} width={WORLD_W + 800} height="14" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#e3b37f" />
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 160) }, (_, i) => (
        <line key={i} x1={-400 + i * 160} y1={FLOOR} x2={-400 + i * 160 - 30} y2={VIEW_H + 200} stroke="#c9955e" strokeWidth="4" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** A soft, still glow behind the rocking horse: what to tap, until the machine starts. */
function StartGlow({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="#fff6b8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff6b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={HORSE.x + 20} cy={FLOOR - 170} rx="300" ry="240" fill={`url(#${id})`} />
    </g>
  );
}

/* ---------- Rocking horse, blocks, football, chest ---------- */

/** The rocking horse, facing right; it rolls on its rockers as it tilts (positive: nose down). */
function RockingHorse({ tilt }: { tilt: number }) {
  const { r, reach } = HORSE;
  const a = (tilt * Math.PI) / 180;
  const rocker: string[] = [];
  for (let phi = -reach; phi <= reach; phi += 5) {
    const p = (phi * Math.PI) / 180;
    rocker.push(`${r * Math.sin(p)} ${r * Math.cos(p) - r}`);
  }
  const rockerPath = `M${rocker.join(" L")}`;
  return (
    <g transform={`translate(${HORSE.x + r * a} ${FLOOR - r}) rotate(${tilt}) translate(0 ${r})`}>
      <path d={rockerPath} fill="none" stroke={INK} strokeWidth="26" strokeLinecap="round" />
      <path d={rockerPath} fill="none" stroke={HORSE_WOOD} strokeWidth="18" strokeLinecap="round" />
      {/* Legs down to the rockers */}
      {[-95, -45, 45, 95].map((x) => (
        <line key={x} x1={x * 0.8} y1="-170" x2={x} y2={-(x * x) / (2 * r) - 8} stroke={INK} strokeWidth="18" strokeLinecap="round" />
      ))}
      {[-95, -45, 45, 95].map((x) => (
        <line key={x} x1={x * 0.8} y1="-170" x2={x} y2={-(x * x) / (2 * r) - 8} stroke="#fff" strokeWidth="11" strokeLinecap="round" />
      ))}
      {/* Tail */}
      <path d="M-118 -200 Q-170 -180 -160 -110 Q-140 -160 -112 -180 Z" fill="#8a4b1f" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* Body */}
      <ellipse cy="-195" rx="128" ry="54" fill="#fff" stroke={INK} strokeWidth="5" />
      {[
        [-60, -210],
        [-20, -180],
        [30, -215],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="9" fill="#ffd8a8" />
      ))}
      {/* Saddle */}
      <path d="M-40 -246 Q0 -236 40 -246 L46 -196 Q0 -186 -46 -196 Z" fill="#ff5d73" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* Neck and head */}
      <path d="M70 -230 L130 -320 L176 -300 L120 -190 Z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M128 -322 Q160 -350 196 -330 L232 -282 Q238 -262 216 -258 L176 -270 Z" fill="#fff" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M140 -334 L146 -370 L166 -340 Z" fill="#fff" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="184" cy="-312" r="6" fill={INK} />
      <circle cx="224" cy="-272" r="3.5" fill={INK} />
      {/* Mane */}
      <path d="M128 -322 Q96 -300 74 -232 Q100 -270 112 -262 Q110 -296 136 -312 Z" fill="#8a4b1f" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {/* Handle */}
      <line x1="148" y1="-300" x2="168" y2="-300" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <line x1="122" y1="-300" x2="194" y2="-300" stroke="#ffb703" strokeWidth="8" strokeLinecap="round" />
    </g>
  );
}

/** A building block: a coloured cube with a white shape on its side. */
function Block({ i, tidy, t }: { i: number; tidy: Tidy; t: number }) {
  const { pt, angle } = tidy.blockAt(i, t);
  const h = BLOCK / 2;
  const shape = i % 3;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <rect x={-h} y={-h} width={BLOCK} height={BLOCK} rx="8" fill={BAR_COLORS[(i * 3) % BAR_COLORS.length]} stroke={INK} strokeWidth="4" />
      {shape === 0 && <circle r="15" fill="#fff" />}
      {shape === 1 && <polygon points={STAR_POINTS} transform="scale(0.9)" fill="#fff" />}
      {shape === 2 && <path d="M0 16 L-16 0 A9 9 0 0 1 0 -10 A9 9 0 0 1 16 0 Z" fill="#fff" />}
    </g>
  );
}

/** The football: white with black patches, turning as it rolls. */
function Football({ tidy, t }: { tidy: Tidy; t: number }) {
  const { pt, spin } = tidy.ballAt(t);
  const patch = (x: number, y: number, s: number) =>
    Array.from({ length: 5 }, (_, k) => {
      const a = (k * 2 * Math.PI) / 5 - Math.PI / 2;
      return `${x + s * Math.cos(a)},${y + s * Math.sin(a)}`;
    }).join(" ");
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${spin})`}>
      <circle r={BALL_R} fill="#fff" stroke={INK} strokeWidth="4" />
      <polygon points={patch(0, 0, 12)} fill={INK} />
      {[0, 1, 2, 3, 4].map((k) => {
        const a = (k * 2 * Math.PI) / 5 + Math.PI / 2;
        return <polygon key={k} points={patch(27 * Math.cos(a), 27 * Math.sin(a), 8)} fill={INK} />;
      })}
    </g>
  );
}

/** Where the chest is drawn: it jumps and moves a little when the lid slams. */
const chestAt = (tidy: Tidy, t: number) => ({ dx: tidy.chestShift(t), dy: -tidy.chestHop(t) });

function ChestInside({ tidy, t }: { tidy: Tidy; t: number }) {
  const { dx, dy } = chestAt(tidy, t);
  return <rect x={CHEST.x0 + dx} y={CHEST.top + dy} width={CHEST.x1 - CHEST.x0} height={FLOOR - CHEST.top} fill="#2c6a9a" />;
}

/** The chest's front, in front of whatever lies in it. */
function ChestFront({ tidy, t }: { tidy: Tidy; t: number }) {
  const { dx, dy } = chestAt(tidy, t);
  const { x0, x1, top } = CHEST;
  return (
    <g transform={`translate(${dx} ${dy})`}>
      <rect x={x0} y={top} width={x1 - x0} height={FLOOR - top} rx="8" fill="#48b0f0" stroke={INK} strokeWidth="5" />
      <rect x={x0 + 16} y={top + 16} width={x1 - x0 - 32} height={FLOOR - top - 32} rx="6" fill="none" stroke="#2c6a9a" strokeWidth="4" />
      <circle cx={(x0 + x1) / 2 - 50} cy={top + 100} r="22" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      <polygon points={STAR_POINTS} transform={`translate(${(x0 + x1) / 2 + 40} ${top + 96}) scale(1.4)`} fill="#ff7bd0" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The lid, hinged at the chest's top left corner: open as a ramp to the floor, then swinging over and shut. */
function Lid({ tidy, t }: { tidy: Tidy; t: number }) {
  const { dx, dy } = chestAt(tidy, t);
  return (
    <g transform={`translate(${CHEST.x0 + dx} ${CHEST.top + dy}) rotate(${tidy.lidAngle(t)})`}>
      <rect x="0" y="-16" width={LID} height="16" rx="6" fill="#ffb703" stroke={INK} strokeWidth="4" />
      <rect x={LID / 2 - 24} y="-24" width="48" height="10" rx="4" fill="#ff8c42" stroke={INK} strokeWidth="3" />
      <circle r="6" fill={INK} />
    </g>
  );
}

/* ---------- Truck, books, shelf ---------- */

/** A book: lying flat (turn 0) or standing (−90), its spine at the right while it lies. */
function Book({ j, tidy, t }: { j: number; tidy: Tidy; t: number }) {
  const { pt, angle } = tidy.bookAt(j, t);
  const b = BOOKS[j];
  const w = BOOK_LEN;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <rect x={-w / 2} y={-b.th / 2} width={w} height={b.th} rx="4" fill={b.color} stroke={INK} strokeWidth="3.5" />
      <rect x={-w / 2 + 4} y={-b.th / 2 + 5} width={w - 22} height={b.th - 10} fill="#fffbea" />
      <line x1={w / 2 - 12} y1={-b.th / 2 + 2} x2={w / 2 - 12} y2={b.th / 2 - 2} stroke="#fff" strokeWidth="3" opacity="0.7" />
    </g>
  );
}

/** The wind-up toy truck, facing right; its front wheels ride up onto the bellows. */
function Truck({ tidy, t }: { tidy: Tidy; t: number }) {
  const front = tidy.truckFront(t);
  const { len, wheelR } = TRUCK;
  const rear = 45;
  const wheelX = front - FRONT_WHEEL;
  const height = BELLOWS.h - (BELLOWS.h - BELLOWS.flat) * tidy.squash(t);
  const lift = wheelX <= BELLOWS.x1 ? height * clamp01((wheelX - BELLOWS.x0 + wheelR * 0.6) / wheelR) : 0;
  const tilt = (Math.atan2(lift, len - FRONT_WHEEL - rear) * 180) / Math.PI;
  const turn = tidy.wheelTurn(t);
  const key = Math.cos((tidy.keyTurn(t) * Math.PI) / 180);
  return (
    <g transform={`translate(${front - len} ${FLOOR}) rotate(${-tilt} ${rear} ${-wheelR})`}>
      {/* Wind-up key on the back */}
      <g transform={`translate(70 -96) scale(${key} 1)`}>
        <line x1="0" y1="0" x2="0" y2="-20" stroke={INK} strokeWidth="6" />
        <ellipse cx="-14" cy="-26" rx="13" ry="9" fill="#c9d1e8" stroke={INK} strokeWidth="3" />
        <ellipse cx="14" cy="-26" rx="13" ry="9" fill="#c9d1e8" stroke={INK} strokeWidth="3" />
      </g>
      {/* Cargo bed and cab */}
      <rect x="0" y="-96" width="122" height="62" rx="8" fill="#3ec300" stroke={INK} strokeWidth="4" />
      <path d={`M118 -34 L118 -112 L160 -112 L${len - 6} -74 L${len} -34 Z`} fill="#ff5d73" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M132 -100 L156 -100 L182 -76 L132 -76 Z" fill="#bfe9ff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x={len - 10} y="-52" width="16" height="20" rx="5" fill="#ffd23f" stroke={INK} strokeWidth="3" />
      {[rear, len - FRONT_WHEEL].map((x) => (
        <g key={x} transform={`translate(${x} ${-wheelR}) rotate(${turn})`}>
          <circle r={wheelR} fill={INK} />
          <circle r={wheelR * 0.45} fill="#ffd23f" />
          <line x1="0" y1={-wheelR * 0.45} x2="0" y2={wheelR * 0.45} stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

/** The bookshelf on its legs, with a toy sailing boat below and a plant on top. */
const Shelf = memo(function Shelf() {
  const { x0, x1, top, board, bottom } = SHELF;
  return (
    <g>
      <rect x={x0} y={top} width={x1 - x0} height={bottom - top} fill="#ffe0f0" stroke={INK} strokeWidth="4" />
      {[x0, x1 - 18].map((x) => (
        <rect key={x} x={x} y={top - 10} width="18" height={FLOOR - top + 10} rx="5" fill="#ff8c42" stroke={INK} strokeWidth="4" />
      ))}
      {[top - 10, board, bottom].map((y) => (
        <rect key={y} x={x0 - 6} y={y} width={x1 - x0 + 12} height="16" rx="5" fill="#ffb703" stroke={INK} strokeWidth="4" />
      ))}
      {/* Toy sailing boat */}
      <g transform={`translate(${x1 - 90} ${bottom})`}>
        <line x1="0" y1="-24" x2="0" y2="-96" stroke={INK} strokeWidth="4" />
        <path d="M4 -92 L44 -34 L4 -34 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M-4 -80 L-34 -34 L-4 -34 Z" fill="#ffd23f" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <path d="M-46 -26 L46 -26 L32 0 L-32 0 Z" fill="#ff5d73" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
      {/* Plant on top */}
      <g transform={`translate(${x0 + 70} ${top - 10})`}>
        <path d="M0 -40 Q-30 -90 -6 -110 Q4 -70 0 -40 Z M0 -40 Q30 -86 10 -104 Q-2 -66 0 -40 Z" fill="#3ec300" stroke={INK} strokeWidth="3" />
        <path d="M-26 -44 L26 -44 L18 0 L-18 0 Z" fill="#ff8c42" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </g>
  );
});

/** The bellows: two boards with folds between, squashed flat by the truck. */
function Bellows({ tidy, t }: { tidy: Tidy; t: number }) {
  const { x0, x1, h, flat } = BELLOWS;
  const height = h - (h - flat) * tidy.squash(t);
  // Folds zigzag in at both sides, closer together the flatter it is.
  const n = 8;
  const fold = (x: number, inward: number) => Array.from({ length: n + 1 }, (_, k) => `${x + (k % 2 ? inward : 0)} ${(height * k) / n}`);
  const outline = [...fold(x0, 10), ...fold(x1, -10).reverse()];
  return (
    <g transform={`translate(0 ${FLOOR - height})`}>
      <path d={`M${outline.join(" L")} Z`} fill="#ff7bd0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x={x0 - 4} y="-8" width={x1 - x0 + 8} height="10" rx="4" fill="#8e7dff" stroke={INK} strokeWidth="3" />
      <rect x={x1 - 6} y={height / 2 - 8} width="16" height="12" rx="3" fill="#2f7d4a" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The hose under the shelf to the heap of socks, ending in an upturned nozzle; each puff of air runs along it as a bulge. */
function Hose({ tidy, t }: { tidy: Tidy; t: number }) {
  const k = tidy.puff(t);
  const pts = tidy.hose;
  const bulge = k >= 0 ? pts[Math.min(pts.length - 1, Math.round(k * (pts.length - 1)))] : null;
  return (
    <g>
      <path d={svgLine(pts)} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d={svgLine(pts)} fill="none" stroke="#3ec300" strokeWidth="7" strokeLinecap="round" />
      <path
        d={`M${NOZZLE.x - 10} ${NOZZLE.y + 4} L${NOZZLE.x - 14} ${NOZZLE.y - 18} L${NOZZLE.x + 14} ${NOZZLE.y - 18} L${NOZZLE.x + 10} ${NOZZLE.y + 4} Z`}
        fill="#2f7d4a"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {bulge && <ellipse cx={bulge.x} cy={bulge.y} rx="18" ry="12" fill="#3ec300" stroke={INK} strokeWidth="3" />}
    </g>
  );
}

/** The air cushion: blown up round, with its plug on the left; once the plug is out it jumps and goes flat. */
function Cushion({ tidy, t }: { tidy: Tidy; t: number }) {
  const { x0, x1, flat, full } = CUSHION;
  const h = lerp(flat, full, tidy.cushion(t));
  const mid = (x0 + x1) / 2;
  return (
    <g transform={`translate(0 ${-tidy.cushionHop(t)})`}>
      <rect x={PLUG.x + 6} y={FLOOR - h / 2 - 7} width={x0 - PLUG.x} height="14" rx="4" fill="#5fb8f0" stroke={INK} strokeWidth="3" />
      <rect x={x0} y={FLOOR - h} width={x1 - x0} height={h} rx={Math.min(h / 2, 30)} fill="#9fd8ff" stroke={INK} strokeWidth="4" />
      <line x1={mid - 30} y1={FLOOR - h / 2} x2={mid + 30} y2={FLOOR - h / 2} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

/** The cushion's red plug: in its valve, then knocked out high over the sock ball, lying on the floor. */
function PlugCap({ tidy, t }: { tidy: Tidy; t: number }) {
  const { pt, angle } = tidy.capAt(t);
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <rect x="-7" y="-10" width="14" height="20" rx="5" fill="#ff5d73" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** The air rushing out of the cushion's valve once the plug is out: streaks and little clouds blowing to the left. */
function AirJet({ tidy, t }: { tidy: Tidy; t: number }) {
  const age = tidy.jet(t);
  if (age < 0) return null;
  const h = lerp(CUSHION.flat, CUSHION.full, tidy.cushion(t));
  const hole = { x: PLUG.x + 4, y: FLOOR - h / 2 - tidy.cushionHop(t) };
  const fade = 1 - age / 1.6;
  return (
    <g opacity={fade} stroke={INK} strokeWidth="3" strokeLinecap="round">
      {[-14, 0, 14].map((dy, j) => {
        const run = (age * 420 + j * 50) % 160;
        return <line key={dy} x1={hole.x - 20 - run} y1={hole.y + dy * (1 + run / 120)} x2={hole.x - 60 - run} y2={hole.y + dy * (1 + run / 80)} />;
      })}
      {[0, 1, 2].map((j) => {
        const run = (age * 360 + j * 80) % 240;
        return <circle key={j} cx={hole.x - 30 - run} cy={hole.y - 6 + j * 6} r={6 + run / 20} fill="#fff" strokeWidth="2" opacity={1 - run / 240} />;
      })}
    </g>
  );
}

/* ---------- Socks and laundry basket ---------- */

/** A sock drawn upright (cuff at the top, toe to the right) round its middle; lying, it is turned by about 90°. */
function SockShape({ color, stripe }: { color: string; stripe: string }) {
  return (
    <g transform="translate(-7 2)">
      <path d="M-14 -28 L6 -28 L6 4 L18 4 Q28 4 28 14 Q28 24 18 24 L-4 24 Q-14 24 -14 12 Z" fill={color} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="-14" y="-28" width="20" height="9" fill={stripe} stroke={INK} strokeWidth="2.5" />
      <rect x="-14" y="-12" width="20" height="6" fill={stripe} />
      <path d="M18 4 Q28 4 28 14 Q28 24 18 24 Z" fill={stripe} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );
}

function Sock({ k, tidy, t }: { k: number; tidy: Tidy; t: number }) {
  const { pt, angle } = tidy.sockAt(k, t);
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <SockShape color={SOCKS[k].color} stripe={SOCKS[k].stripe} />
    </g>
  );
}

/** The rolled-up sock ball, turning as it flies, bounces and rolls. */
function SockBall({ tidy, t }: { tidy: Tidy; t: number }) {
  const { pt, spin } = tidy.sockBallAt(t);
  const r = SOCK_BALL_R;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${spin})`}>
      <circle r={r} fill="#ff8c42" stroke={INK} strokeWidth="3.5" />
      <path d={`M${-r + 4} -6 Q0 -18 ${r - 4} -6`} fill="none" stroke="#ffd23f" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${-r + 5} 8 Q0 -2 ${r - 5} 8`} fill="none" stroke="#ffd23f" strokeWidth="6" strokeLinecap="round" />
      <path d={`M-10 ${r - 4} Q-2 6 12 ${r - 6}`} fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

const BASKET_MID = (BASKET.x0 + BASKET.x1) / 2;
/** The basket's outline: a little narrower at the bottom. */
const BASKET_OUTLINE = `M${BASKET.x0} ${BASKET.top} L${BASKET.x1} ${BASKET.top} L${BASKET.x1 - 14} ${FLOOR} L${BASKET.x0 + 14} ${FLOOR} Z`;
/** Rows of holes in the basket's woven front, cut out so the socks inside show through. */
const BASKET_HOLES = [0, 1, 2]
  .flatMap((row) =>
    [0, 1, 2, 3, 4].map((col) => {
      const y = BASKET.top + 46 + row * 36;
      const x = BASKET.x0 + 34 + col * 28 + (row % 2) * 6;
      return `M${x - 8} ${y} a8 12 0 1 0 16 0 a8 12 0 1 0 -16 0 Z`;
    }),
  )
  .join(" ");

/** The inside of the basket, behind the socks; it wobbles with the basket. */
function BasketBack({ tilt }: { tilt: number }) {
  return <path d={BASKET_OUTLINE} transform={`rotate(${tilt} ${BASKET_MID} ${FLOOR})`} fill="#1f7f99" />;
}

/** The basket's front, with holes, a rim and a handle, in front of the socks in it. */
function BasketFront({ tilt }: { tilt: number }) {
  return (
    <g transform={`rotate(${tilt} ${BASKET_MID} ${FLOOR})`}>
      <path d={`${BASKET_OUTLINE} ${BASKET_HOLES}`} fillRule="evenodd" fill="#48c9e0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x={BASKET.x0 - 6} y={BASKET.top - 6} width={BASKET.x1 - BASKET.x0 + 12} height="18" rx="7" fill="#48c9e0" stroke={INK} strokeWidth="4" />
      <rect x={BASKET_MID - 26} y={BASKET.top + 16} width="52" height="12" rx="6" fill="#1f7f99" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A little cloud where a puff comes out of the nozzle under the socks. */
function NozzleBlast({ age }: { age: number }) {
  if (age < 0) return null;
  const k = age / 0.4;
  return (
    <g opacity={1 - k}>
      {[-24, 0, 24].map((dx) => (
        <circle key={dx} cx={NOZZLE.x + dx * (1 + k)} cy={FLOOR - 50 - 50 * k} r={10 + 16 * k} fill="#fff" stroke={INK} strokeWidth="2" />
      ))}
    </g>
  );
}

/* ---------- Crayons and pencil pot ---------- */

/** The little stool by the wall; drawn once. */
const Stool = memo(function Stool() {
  const { x, w, top } = STOOL;
  return (
    <g>
      {[-w / 2 + 14, w / 2 - 28].map((dx) => (
        <rect key={dx} x={x + dx} y={top + 10} width="14" height={FLOOR - top - 10} rx="5" fill="#ffb703" stroke={INK} strokeWidth="3.5" />
      ))}
      <rect x={x - w / 2} y={top} width={w} height="16" rx="6" fill="#8e7dff" stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** A crayon: lying with its tip to the right (turn 0), or standing tip up (−90). */
function Crayon({ k, tidy, t }: { k: number; tidy: Tidy; t: number }) {
  const { pt, angle } = tidy.crayonAt(k, t);
  const { len, th } = CRAYON;
  const h = th / 2;
  const body = len / 2 - 12;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      <polygon points={`${body},${-h} ${len / 2},0 ${body},${h}`} fill={CRAYONS[k].color} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x={-len / 2} y={-h} width={len / 2 + body} height={th} rx="3" fill={CRAYONS[k].color} stroke={INK} strokeWidth="2.5" />
      <rect x={-len / 2 + 8} y={-h + 2} width={len - 30} height={th - 4} fill="#fff" opacity="0.5" />
    </g>
  );
}

/** The pencil pot on the stool, in front of the crayons standing in it; it wobbles with each one. */
function Pot({ tilt }: { tilt: number }) {
  const { x, w, h } = POT;
  const top = STOOL.top - h;
  return (
    <g transform={`rotate(${tilt} ${x} ${STOOL.top})`}>
      <rect x={x - w / 2} y={top} width={w} height={h} rx="8" fill="#00b4d8" stroke={INK} strokeWidth="4" />
      <rect x={x - w / 2 + 2} y={top + 2} width={w - 4} height="10" rx="4" fill="#7fe0f0" />
      <polygon points={STAR_POINTS} transform={`translate(${x} ${top + h / 2 + 4}) scale(1.3)`} fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/* ---------- Jigsaw puzzle ---------- */

/** The outline of the piece for slot `slot`, in room coordinates: knobs stick out right and down, the neighbours have the matching holes. */
function piecePath(slot: number) {
  const col = slot % PUZZLE.cols;
  const row = Math.floor(slot / PUZZLE.cols);
  const x0 = PUZZLE.x0 + PUZZLE.frame + col * PUZZLE.w;
  const y0 = PUZZLE.top + PUZZLE.frame + row * PUZZLE.h;
  const x1 = x0 + PUZZLE.w;
  const y1 = y0 + PUZZLE.h;
  const out = [`M${x0} ${y0}`];
  /** A straight edge from `a` to `b`, with a knob bulging towards `v` in its middle (none without `v`). */
  const edge = (a: Pt, b: Pt, v: Pt | null) => {
    if (v) {
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      const d = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
      const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const m1 = { x: m.x - d.x * 10, y: m.y - d.y * 10 };
      const m2 = { x: m.x + d.x * 10, y: m.y + d.y * 10 };
      const c = (q: Pt, s: number) => `${q.x + v.x * 20 + d.x * s} ${q.y + v.y * 20 + d.y * s}`;
      out.push(`L${m1.x} ${m1.y}`, `C${c(m1, -8)} ${c(m2, 8)} ${m2.x} ${m2.y}`);
    }
    out.push(`L${b.x} ${b.y}`);
  };
  edge({ x: x0, y: y0 }, { x: x1, y: y0 }, row > 0 ? { x: 0, y: 1 } : null);
  edge({ x: x1, y: y0 }, { x: x1, y: y1 }, col < PUZZLE.cols - 1 ? { x: 1, y: 0 } : null);
  edge({ x: x1, y: y1 }, { x: x0, y: y1 }, row < PUZZLE.rows - 1 ? { x: 0, y: 1 } : null);
  edge({ x: x0, y: y1 }, { x: x0, y: y0 }, col > 0 ? { x: 1, y: 0 } : null);
  return `${out.join(" ")} Z`;
}
const PIECE_PATHS = Array.from({ length: PUZZLE.cols * PUZZLE.rows }, (_, slot) => piecePath(slot));
/** The inside of the board, where the picture is. */
const INNER = { x: PUZZLE.x0 + PUZZLE.frame, y: PUZZLE.top + PUZZLE.frame, w: PUZZLE.cols * PUZZLE.w, h: PUZZLE.rows * PUZZLE.h };

/** The puzzle's picture (a smiling sun, a rainbow and a hill) and each piece's cut-out of it; drawn once. */
const PuzzleDefs = memo(function PuzzleDefs({ ids }: { ids: string }) {
  const { x, y, w, h } = INNER;
  const arc = (r: number) => `M${x + 170 - r} ${y + 175} A${r} ${r} 0 0 1 ${x + 170 + r} ${y + 175}`;
  return (
    <defs>
      <clipPath id={`${ids}-inner`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      {PIECE_PATHS.map((d, slot) => (
        <clipPath key={slot} id={`${ids}-piece${slot}`}>
          <path d={d} />
        </clipPath>
      ))}
      <g id={`${ids}-pic`} clipPath={`url(#${ids}-inner)`}>
        <rect x={x} y={y} width={w} height={h} fill="#bfe9ff" />
        {["#ff5d73", "#ffb703", "#3ec300", "#3a86ff"].map((c, k) => (
          <path key={c} d={arc(125 - 15 * k)} fill="none" stroke={c} strokeWidth="15" />
        ))}
        <path
          d={`M${x} ${y + h} L${x} ${y + 120} Q${x + 80} ${y + 80} ${x + 170} ${y + 130} Q${x + 220} ${y + 110} ${x + w} ${y + 125} L${x + w} ${y + h} Z`}
          fill="#7ed957"
          stroke={INK}
          strokeWidth="3"
        />
        <line x1={x + 226} y1={y + 150} x2={x + 226} y2={y + 124} stroke="#2f7d4a" strokeWidth="4" />
        <circle cx={x + 226} cy={y + 120} r="9" fill="#ff5d73" stroke={INK} strokeWidth="2.5" />
        <circle cx={x + 226} cy={y + 120} r="3.5" fill="#ffd23f" />
        {Array.from({ length: 8 }, (_, k) => {
          const a = (k * Math.PI) / 4;
          return (
            <line
              key={k}
              x1={x + 52 + 34 * Math.cos(a)}
              y1={y + 46 + 34 * Math.sin(a)}
              x2={x + 52 + 44 * Math.cos(a)}
              y2={y + 46 + 44 * Math.sin(a)}
              stroke="#ff8c42"
              strokeWidth="5"
              strokeLinecap="round"
            />
          );
        })}
        <circle cx={x + 52} cy={y + 46} r="28" fill="#ffd23f" stroke={INK} strokeWidth="3" />
        <circle cx={x + 42} cy={y + 40} r="3.5" fill={INK} />
        <circle cx={x + 62} cy={y + 40} r="3.5" fill={INK} />
        <path d={`M${x + 40} ${y + 52} Q${x + 52} ${y + 64} ${x + 64} ${y + 52}`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </g>
    </defs>
  );
});

/** The wooden puzzle board leaning on the wall: empty holes showing the picture faintly, so it is clear where each piece goes; drawn once. */
const PuzzleBoard = memo(function PuzzleBoard({ ids }: { ids: string }) {
  const bottom = PUZZLE.top + 2 * PUZZLE.frame + PUZZLE.rows * PUZZLE.h;
  return (
    <g>
      <rect x={PUZZLE.x0} y={PUZZLE.top} width={PUZZLE_X1 - PUZZLE.x0} height={bottom - PUZZLE.top} rx="10" fill="#e9b872" stroke={INK} strokeWidth="4" />
      <rect x={INNER.x} y={INNER.y} width={INNER.w} height={INNER.h} fill="#c98d4e" />
      <use href={`#${ids}-pic`} opacity="0.25" />
      {PIECE_PATHS.map((d, slot) => (
        <path key={slot} d={d} fill="none" stroke="#8a5a2b" strokeWidth="2.5" strokeLinejoin="round" />
      ))}
    </g>
  );
});

/** A puzzle piece: lying flat on the floor (squashed), hopping up and fitting into its hole in the board. */
function Piece({ i, ids, tidy, t }: { i: number; ids: string; tidy: Tidy; t: number }) {
  const { pt, angle, flat } = tidy.pieceAt(i, t);
  const { slot } = PIECES[i];
  const c = slotCentre(slot);
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle}) scale(1 ${flat}) translate(${-c.x} ${-c.y})`}>
      <g clipPath={`url(#${ids}-piece${slot})`}>
        <use href={`#${ids}-pic`} />
      </g>
      <path d={PIECE_PATHS[slot]} fill="none" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/* ---------- Bunny and bed ---------- */

/** The bed, head end on the right, with the pillow; drawn once. */
const Bed = memo(function Bed() {
  const { x0, x1, top } = BED;
  return (
    <g>
      <rect x={x1 - 44} y="420" width="44" height={FLOOR - 420} rx="14" fill="#8e7dff" stroke={INK} strokeWidth="4" />
      <rect x={x0} y="540" width="34" height={FLOOR - 540} rx="12" fill="#8e7dff" stroke={INK} strokeWidth="4" />
      <rect x={x0 + 20} y={top} width={x1 - x0 - 50} height="90" rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
      <ellipse cx={PILLOW.x} cy={PILLOW.y} rx="80" ry="30" fill="#fff" stroke={INK} strokeWidth="4" />
    </g>
  );
});

/** The blanket: crumpled at the foot of the bed, then spread smoothly up to the bunny's chin. */
function Blanket({ k }: { k: number }) {
  const left = BED.x0 + 22;
  const right = lerp(BED.x0 + 210, IN_BED.x + 4, k);
  const n = 18;
  /** The bunny's body under the blanket, from its feet to its neck. */
  const body = { x: IN_BED.x - 34, half: 70, h: 44 };
  const top = Array.from({ length: n + 1 }, (_, i) => {
    const x = lerp(left, right, i / n);
    // Lumps while crumpled; spread out, it lies a little over the mattress and rises over the bunny.
    const lumps = (1 - k) * (30 + 26 * Math.abs(Math.sin((i / n) * 11.4)));
    const off = Math.abs(x - body.x) / body.half;
    const over = off < 1 ? k * body.h * Math.cos((off * Math.PI) / 2) : 0;
    return `${x} ${BED.top - 8 - lumps - over}`;
  });
  return (
    <g>
      <path d={`M${left} ${BED.top + 70} L${top.join(" L")} L${right} ${BED.top + 70} Z`} fill="#ff7bd0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={lerp(left + 30, right - 30, i / 4)} cy={BED.top + 30 + (i % 2) * 14} r="7" fill="#ffd23f" opacity={0.4 + 0.6 * k} />
      ))}
    </g>
  );
}

/** The cuddly bunny, drawn head up round its middle; it shuts its eyes once it is tucked in. */
function Bunny({ tidy, t }: { tidy: Tidy; t: number }) {
  const { pt, angle } = tidy.bunnyAt(t);
  const asleep = tidy.blanket(t) > 0.6;
  return (
    <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle})`}>
      {[-14, 14].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="-82" rx="11" ry="34" transform={`rotate(${x / 2} ${x} -56)`} fill={BUNNY} stroke={INK} strokeWidth="3.5" />
          <ellipse cx={x} cy="-82" rx="5" ry="24" transform={`rotate(${x / 2} ${x} -56)`} fill="#ffb3d1" />
        </g>
      ))}
      <ellipse cy="22" rx="32" ry="38" fill={BUNNY} stroke={INK} strokeWidth="3.5" />
      <ellipse cy="28" rx="18" ry="22" fill="#fff" />
      {[-22, 22].map((x) => (
        <ellipse key={x} cx={x} cy="58" rx="14" ry="9" fill={BUNNY} stroke={INK} strokeWidth="3" />
      ))}
      <circle cy="-28" r="28" fill={BUNNY} stroke={INK} strokeWidth="3.5" />
      {[-10, 10].map((x) =>
        asleep ? (
          <path key={x} d={`M${x - 6} -32 Q${x} -27 ${x + 6} -32`} fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        ) : (
          <circle key={x} cx={x} cy="-32" r="4.5" fill={INK} />
        ),
      )}
      <ellipse cy="-20" rx="5" ry="4" fill="#ff7bd0" />
      <path d="M-6 -12 Q0 -7 6 -12" fill="none" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}
