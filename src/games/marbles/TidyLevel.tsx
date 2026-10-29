import { useId, useMemo } from "react";
import { VIEW_H, type LevelProps } from "./level";
import { clamp01, lerp, svgLine } from "./machineKit";
import { MachineStage, TapHint } from "./MachineStage";
import { BAR_COLORS, STAR_POINTS } from "./parts";
import { INK, Picture, Sparkles, WallClock, Window } from "./scenery";
import {
  BALL_R,
  BED,
  BELLOWS,
  BLOCK,
  BLOCKS,
  BOOK_LEN,
  BOOKS,
  buildTidy,
  CHEST,
  CUSHION,
  FLOOR,
  FRONT_WHEEL,
  HORSE,
  IN_BED,
  LID,
  PILLOW,
  SHELF,
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
 * in, and then rolls onto the bellows, whose puff blows the bunny into bed.
 * At the end everything is tidy and glitters.
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
          <Cushion tidy={tidy} t={t} />
          <Bed />
          {BOOKS.map((_, j) => (
            <Book key={j} j={j} tidy={tidy} t={t} />
          ))}
          <Truck tidy={tidy} t={t} />
          <Bunny tidy={tidy} t={t} />
          <Blanket k={tidy.blanket(t)} />

          <Sparkles x={(SHELF.x0 + SHELF.x1) / 2} y={SHELF.board - 90} age={t - tidy.tGlitter} n={10} spread={220} />
          <Sparkles x={PILLOW.x - 120} y={BED.top - 70} age={t - tidy.tGlitter - 0.25} n={10} spread={240} />
          <Sparkles x={BELLOWS.x0 - 40} y={FLOOR - 120} age={t - tidy.tGlitter - 0.5} n={8} spread={180} />
          {/* Under the horse's belly, between its legs: the bottom edge of the picture is cut off on a phone on its side. */}
          <TapHint t={t} x={HORSE.x} y={FLOOR - 34} />
        </>
      )}
    </MachineStage>
  );
}

/* ---------- The room ---------- */

function Room({ paper }: { paper: string }) {
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
      {/* Skirting board and floor */}
      <rect x="-400" y={FLOOR - 14} width={WORLD_W + 800} height="14" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="-400" y={FLOOR} width={WORLD_W + 800} height={VIEW_H - FLOOR + 200} fill="#e3b37f" />
      {Array.from({ length: Math.ceil((WORLD_W + 800) / 160) }, (_, i) => (
        <line key={i} x1={-400 + i * 160} y1={FLOOR} x2={-400 + i * 160 - 30} y2={VIEW_H + 200} stroke="#c9955e" strokeWidth="4" />
      ))}
      <line x1="-400" y1={FLOOR} x2={WORLD_W + 400} y2={FLOOR} stroke={INK} strokeWidth="4" />
    </g>
  );
}

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

/** The bookshelf on its legs, with a crayon cup below and a plant on top. */
function Shelf() {
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
      {/* Crayon cup */}
      <g transform={`translate(${x1 - 90} ${bottom})`}>
        {["#ff5d73", "#3a86ff", "#3ec300"].map((c, k) => (
          <rect key={c} x={-18 + k * 14} y={-92 + k * 8} width="10" height="60" rx="3" fill={c} stroke={INK} strokeWidth="2" />
        ))}
        <rect x="-26" y="-56" width="52" height="56" rx="6" fill="#00b4d8" stroke={INK} strokeWidth="3" />
      </g>
      {/* Plant on top */}
      <g transform={`translate(${x0 + 70} ${top - 10})`}>
        <path d="M0 -40 Q-30 -90 -6 -110 Q4 -70 0 -40 Z M0 -40 Q30 -86 10 -104 Q-2 -66 0 -40 Z" fill="#3ec300" stroke={INK} strokeWidth="3" />
        <path d="M-26 -44 L26 -44 L18 0 L-18 0 Z" fill="#ff8c42" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </g>
    </g>
  );
}

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

/** The hose under the shelf to the cushion; the puff of air runs along it as a bulge. */
function Hose({ tidy, t }: { tidy: Tidy; t: number }) {
  const k = tidy.puff(t);
  const pts = tidy.hose;
  const bulge = k >= 0 ? pts[Math.min(pts.length - 1, Math.round(k * (pts.length - 1)))] : null;
  return (
    <g>
      <path d={svgLine(pts)} fill="none" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d={svgLine(pts)} fill="none" stroke="#3ec300" strokeWidth="7" strokeLinecap="round" />
      {bulge && <ellipse cx={bulge.x} cy={bulge.y} rx="18" ry="12" fill="#3ec300" stroke={INK} strokeWidth="3" />}
    </g>
  );
}

/** The air cushion: flat, then blown up round all at once. */
function Cushion({ tidy, t }: { tidy: Tidy; t: number }) {
  const { x0, x1, flat, full } = CUSHION;
  const h = lerp(flat, full, tidy.cushion(t));
  const mid = (x0 + x1) / 2;
  return (
    <g>
      <rect x={x0} y={FLOOR - h} width={x1 - x0} height={h} rx={Math.min(h / 2, 30)} fill="#9fd8ff" stroke={INK} strokeWidth="4" />
      <line x1={mid - 30} y1={FLOOR - h / 2} x2={mid + 30} y2={FLOOR - h / 2} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    </g>
  );
}

/* ---------- Bunny and bed ---------- */

/** The bed, head end on the right, with the pillow. */
function Bed() {
  const { x0, x1, top } = BED;
  return (
    <g>
      <rect x={x1 - 44} y="420" width="44" height={FLOOR - 420} rx="14" fill="#8e7dff" stroke={INK} strokeWidth="4" />
      <rect x={x0} y="540" width="34" height={FLOOR - 540} rx="12" fill="#8e7dff" stroke={INK} strokeWidth="4" />
      <rect x={x0 + 20} y={top} width={x1 - x0 - 50} height="90" rx="10" fill="#fff" stroke={INK} strokeWidth="4" />
      <ellipse cx={PILLOW.x} cy={PILLOW.y} rx="80" ry="30" fill="#fff" stroke={INK} strokeWidth="4" />
    </g>
  );
}

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
