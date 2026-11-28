import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { useT } from "@/lib/language";
import { tapState } from "@/lib/tapTargets";
import { BUTTON_R, CABIN_H, FLOORS, GROUND, HOUSE_L, ROOF_TOP, ROOM_H, ROOM_L, SLAB, TOP, VIEW_L, floorLine, useLayout } from "./layout";
import type { Weather } from "./rooms";
import { star } from "./things";

// The house around the rooms: sky, roof, walls, the lift shaft with its cabin and the call buttons – and the action
// button of the trail adventures.

const FLOOR_LIST = Array.from({ length: FLOORS }, (_, f) => f);
/** How far the sky and the grass reach past the picture, to fill screens of another shape. */
const FAR = 4000;

/** Sky and ground around the house. */
export function Backdrop({ weather }: { weather: Weather }) {
  const { viewR, buttonX } = useLayout();
  const width = viewR - VIEW_L + 2 * FAR;
  const sky = weather === "evening" ? ["#1c2a6b", "#5c4bb5"] : weather === "rain" ? ["#7d8a99", "#c3ccd6"] : ["#74c0fc", "#d0ebff"];
  return (
    <>
      <defs>
        <linearGradient id="el-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={GROUND}>
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect x={VIEW_L - FAR} y={-FAR} width={width} height={GROUND + FAR} fill="url(#el-sky)" />
      {weather === "day" && (
        <>
          <circle cx={buttonX} cy="54" r="38" fill="#ffd43b" />
          <circle cx={buttonX} cy="54" r="52" fill="#ffd43b" opacity="0.25" />
        </>
      )}
      {weather === "evening" && (
        <>
          <path d={`M${buttonX - 10} 18 a36 36 0 1 0 32 52 a27 27 0 1 1 -32 -52 Z`} fill="#ffe066" />
          {[
            [ROOM_L + 60, 30],
            [buttonX - 300, 20],
            [buttonX - 600, 34],
          ].map(([x, y], i) => (
            <path key={x * y} className="el-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={star(x, y, 9)} fill="#fff3bf" />
          ))}
        </>
      )}
      <rect x={VIEW_L - FAR} y={GROUND} width={width} height={FAR} fill="#80b918" />
      <rect x={VIEW_L - FAR} y={GROUND} width={width} height="10" fill="#55a630" />
      {weather === "rain" && (
        <g className="el-rain-lines" stroke="#e7f5ff" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          {Array.from({ length: Math.ceil((viewR - VIEW_L) / 110) * 3 }, (_, i) => {
            const across = Math.ceil((viewR - VIEW_L) / 110);
            const row = Math.floor(i / across);
            return <path key={i} d={`M${VIEW_L + (i % across) * 110 + row * 37} ${-200 + row * 380 + (i % 3) * 90} l-10 26`} />;
          })}
        </g>
      )}
    </>
  );
}

/** How far the roof's slopes reach in from the walls. */
const ROOF_RUN = 130;

/** The roof with its chimney reaching up to the picture's top, and the walls behind and between the rooms. */
export function Shell() {
  const { houseR } = useLayout();
  const ridgeL = HOUSE_L + ROOF_RUN - 20;
  const ridgeR = houseR - ROOF_RUN + 20;
  const chimney = HOUSE_L + 0.22 * (houseR - HOUSE_L);
  return (
    <>
      <rect x={HOUSE_L} y={TOP} width={houseR - HOUSE_L} height={GROUND - TOP} fill="#f1dcc0" />
      <rect x={chimney} y="10" width="58" height="80" fill="#c0504d" />
      <rect x={chimney - 8} y="0" width="74" height="15" rx="3" fill="#a33b38" />
      <path d={`M${HOUSE_L - 30} ${TOP} L${ridgeL} ${ROOF_TOP} H${ridgeR} L${houseR + 30} ${TOP} Z`} fill="#d1495b" />
      <path
        d={Array.from({ length: 3 }, (_, i) => {
          const y = ROOF_TOP + 20 + i * 20;
          const inset = ((y - ROOF_TOP) / (TOP - ROOF_TOP)) * (ROOF_RUN + 10);
          return `M${ridgeL - inset + 10} ${y} H${ridgeR + inset - 10}`;
        }).join(" ")}
        stroke="#b23a48"
        strokeWidth="5"
      />
      <rect x={HOUSE_L - 34} y={TOP - 8} width={houseR - HOUSE_L + 68} height="14" rx="5" fill="#a33b38" />
    </>
  );
}

/** The ceiling slabs between the floors, drawn over the rooms. */
export function Slabs() {
  const { shaftL } = useLayout();
  return (
    <>
      {FLOOR_LIST.map((f) => (
        <g key={f}>
          <rect x={HOUSE_L} y={floorLine(f)} width={shaftL - HOUSE_L} height={SLAB} fill="#a47148" />
          <rect x={HOUSE_L} y={floorLine(f)} width={shaftL - HOUSE_L} height="4" fill="#c08a5d" />
        </g>
      ))}
      <rect x={HOUSE_L} y={TOP} width={ROOM_L - HOUSE_L} height={GROUND - TOP} fill="#e6c79c" />
    </>
  );
}

/** The open lift shaft behind the cabin, with its rails. */
export function Shaft() {
  const { shaftL, shaftR, houseR, cabinL, cabinR } = useLayout();
  return (
    <>
      <rect x={shaftL} y={TOP} width={shaftR - shaftL} height={GROUND - TOP} fill="#5c6b73" />
      <path d={`M${cabinL - 8} ${TOP} V${GROUND} M${cabinR + 8} ${TOP} V${GROUND}`} stroke="#37474f" strokeWidth="6" />
      {FLOOR_LIST.map((f) => (
        <rect key={f} x={shaftL} y={floorLine(f)} width={shaftR - shaftL} height="6" fill="#455a64" />
      ))}
      <rect x={shaftR} y={TOP} width={houseR - shaftR} height={GROUND - TOP} fill="#e6c79c" />
    </>
  );
}

const rideStyle = (f: number, ride: number) => ({ transform: `translateY(${floorLine(f)}px)`, transitionDuration: `${ride}ms` }) as CSSProperties;

/** The inside of the cabin, behind the children, with the rope it hangs on. */
export function CabinBack({ floor, ride }: { floor: number; ride: number }) {
  const { shaftL, shaftR, cabinL, cabinR } = useLayout();
  const cabinW = cabinR - cabinL;
  const cabinMid = (cabinL + cabinR) / 2;
  return (
    <>
      {/* The rope, only inside the shaft */}
      <clipPath id="el-shaft-clip">
        <rect x={shaftL} y={TOP} width={shaftR - shaftL} height={GROUND - TOP} />
      </clipPath>
      <g clipPath="url(#el-shaft-clip)">
        <g className="el-ride" style={rideStyle(floor, ride)}>
          <rect x={cabinMid - 2} y={-CABIN_H - 1200} width="4" height="1200" fill="#263238" />
        </g>
      </g>
      <g className="el-ride" style={rideStyle(floor, ride)}>
        <rect x={cabinL} y={-CABIN_H} width={cabinW} height={CABIN_H} rx="10" fill="#ffe8a3" />
        <rect x={cabinL + 10} y={-CABIN_H + 10} width={cabinW - 20} height={CABIN_H - 30} rx="6" fill="#ffd8a8" />
        <path d={`M${cabinL + 14} -84 H${cabinR - 14}`} stroke="#c9a227" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx={cabinMid} cy={-CABIN_H + 8} rx="30" ry="7" fill="#fff9db" />
        <rect x={cabinL} y="-8" width={cabinW} height="8" fill="#8d6e63" />
      </g>
    </>
  );
}

/** The cabin's glass doors in front of the children; they slide into the walls when open. */
export function CabinFront({ floor, ride, open }: { floor: number; ride: number; open: boolean }) {
  const { cabinL, cabinR } = useLayout();
  const cabinW = cabinR - cabinL;
  const cabinMid = (cabinL + cabinR) / 2;
  const half = cabinW / 2;
  return (
    <g className="el-ride el-cabin-front" style={rideStyle(floor, ride)}>
      <clipPath id="el-cabin-clip">
        <rect x={cabinL} y={-CABIN_H} width={cabinW} height={CABIN_H} />
      </clipPath>
      <g clipPath="url(#el-cabin-clip)">
        {[-1, 1].map((s) => (
          <g key={s} className={`el-door${open ? " open" : ""}`} style={{ "--s": s } as CSSProperties}>
            <rect
              x={s < 0 ? cabinL : cabinMid}
              y={-CABIN_H}
              width={half}
              height={CABIN_H - 8}
              fill="#d0ebff"
              fillOpacity="0.35"
              stroke="#90a4ae"
              strokeWidth="6"
            />
            <path d={`M${cabinMid + s * 18} ${-CABIN_H + 30} l${s * 22} 40`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          </g>
        ))}
      </g>
      <rect x={cabinL - 6} y={-CABIN_H - 6} width={cabinW + 12} height={CABIN_H + 6} rx="12" fill="none" stroke="#78909c" strokeWidth="10" />
    </g>
  );
}

/** A soft glow around the room of `floor`, to help when the child doesn't find it. */
export function Hint({ floor }: { floor: number }) {
  const { roomW } = useLayout();
  return (
    <rect
      className="el-hint"
      x={ROOM_L + 6}
      y={floorLine(floor) - ROOM_H + 6}
      width={roomW - 12}
      height={ROOM_H - 12}
      rx="16"
      fill="none"
      stroke="#ffd43b"
      strokeWidth="12"
    />
  );
}

/** The big action button of the trail adventures, in its own framed box: grey while there is nothing to do, red,
 * glowing and sending out rings while a tap is awaited. Any tap or key does the same; the button only shows when,
 * and its `picture` (drawn around its middle, the star if none) what the tap will do. A new `nudge` makes it jump again. */
export function ActionButton({
  waiting,
  nudge,
  x,
  y,
  r,
  box,
  picture,
}: {
  waiting: boolean;
  nudge: number;
  /** Its middle and radius. */
  x: number;
  y: number;
  r: number;
  /** The frame around it: left, top, width, height. */
  box: [number, number, number, number];
  picture?: ReactNode;
}) {
  const t = useT();
  const [bx, by, bw, bh] = box;
  return (
    <g
      className={`el-action${waiting ? " on" : ""}`}
      role="button"
      aria-label={t({ de: "Los", ru: "Вперёд", en: "Go", zh: "出发", hi: "चलो", es: "Vamos", ar: "هيّا" })}
    >
      <rect x={bx + 8} y={by + 8} width={bw} height={bh} rx="36" className="el-action-shadow" />
      <rect x={bx} y={by} width={bw} height={bh} rx="36" className="el-action-box" strokeWidth="6" />
      {[0, 1].map((i) => (
        <circle key={i} className="el-action-ripple" cx={x} cy={y} r={r} fill="none" strokeWidth="8" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
      <g key={nudge} className="el-action-jump" style={{ transformOrigin: `${x}px ${y}px` }}>
        <circle className="el-action-glow" cx={x} cy={y} r={r + 10} fill="none" stroke="#ffd43b" strokeWidth="16" />
        <g className="el-action-press">
          <circle className="el-action-base" cx={x} cy={y + 9} r={r} />
          <circle className="el-action-face" cx={x} cy={y} r={r} strokeWidth="7" />
          {picture ? (
            <>
              <circle className="el-action-plate" cx={x} cy={y} r={r - 16} />
              <g transform={`translate(${x} ${y})`}>{picture}</g>
            </>
          ) : (
            <path className="el-action-star" d={star(x, y + 4, 46)} strokeWidth="6" strokeLinejoin="round" />
          )}
        </g>
      </g>
    </g>
  );
}

/** One big round button per floor, right of the house; tapping the room itself works too. */
export function Buttons({ lit, hint, onPress }: { lit: number | null; hint: number | null; onPress: (floor: number) => void }) {
  const t = useT();
  const { shaftR, buttonX } = useLayout();
  const down = (f: number) => (e: PointerEvent) => {
    e.stopPropagation();
    onPress(f);
  };
  return (
    <>
      {FLOOR_LIST.map((f) => (
        <rect
          key={`room${f}`}
          x={HOUSE_L}
          y={floorLine(f) - ROOM_H}
          width={shaftR - HOUSE_L}
          height={ROOM_H}
          fill="transparent"
          data-tap={tapState({ goal: hint === f })}
          onPointerDown={down(f)}
        />
      ))}
      <rect x={buttonX - 70} y={TOP + 20} width="140" height={GROUND - TOP - 40} rx="30" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="6" />
      {FLOOR_LIST.map((f) => {
        const cy = floorLine(f) - ROOM_H / 2;
        return (
          <g
            key={f}
            className={`el-button${lit === f ? " lit" : ""}${hint === f ? " hint" : ""}`}
            style={{ transformOrigin: `${buttonX}px ${cy}px` }}
            data-tap={tapState({ goal: hint === f })}
            onPointerDown={down(f)}
            role="button"
            aria-label={t({
              de: `Stock ${f + 1}`,
              ru: `Этаж ${f + 1}`,
              en: `Floor ${f + 1}`,
              zh: `${f + 1} 楼`,
              hi: `मंज़िल ${f + 1}`,
              es: `Piso ${f + 1}`,
              ar: `الطابق ${f + 1}`,
            })}
          >
            <circle cx={buttonX} cy={cy + 6} r={BUTTON_R} fill="#78909c" />
            <circle className="el-button-face" cx={buttonX} cy={cy} r={BUTTON_R} stroke="#90a4ae" strokeWidth="6" />
            <text x={buttonX} y={cy + 20} textAnchor="middle" fontSize="58" fontWeight="800" fontFamily="inherit">
              {f + 1}
            </text>
          </g>
        );
      })}
    </>
  );
}
