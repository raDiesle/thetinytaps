import { useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { Cloud } from "@/games/scenes/shared";
import { useT } from "@/lib/language";
import {
  BUTTON_R,
  BUTTON_X,
  CABIN_H,
  CABIN_L,
  CABIN_R,
  FLOORS,
  GROUND,
  HOUSE_L,
  HOUSE_R,
  ROOM_H,
  ROOM_L,
  ROOM_R,
  SHAFT_L,
  SHAFT_R,
  SLAB,
  TOP,
  VIEW_W,
  floorLine,
} from "./layout";
import type { Weather } from "./rooms";
import { star } from "./things";

// The house around the rooms: sky, roof, walls, the lift shaft with its cabin and the call buttons – and the action
// button of the trail adventures.

const FLOOR_LIST = Array.from({ length: FLOORS }, (_, f) => f);
const CABIN_W = CABIN_R - CABIN_L;
const CABIN_MID = (CABIN_L + CABIN_R) / 2;
/** How far the sky and the grass reach past the picture, to fill screens of another shape. */
const FAR = 4000;

/** Sky and ground around the house. */
export function Backdrop({ weather }: { weather: Weather }) {
  const sky = weather === "evening" ? ["#1c2a6b", "#5c4bb5"] : weather === "rain" ? ["#7d8a99", "#c3ccd6"] : ["#74c0fc", "#d0ebff"];
  return (
    <>
      <defs>
        <linearGradient id="el-sky" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={GROUND}>
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect x={-FAR} y={-FAR} width={VIEW_W + 2 * FAR} height={GROUND + FAR} fill="url(#el-sky)" />
      {weather === "day" && (
        <>
          <circle cx="1340" cy="60" r="44" fill="#ffd43b" />
          <circle cx="1340" cy="60" r="60" fill="#ffd43b" opacity="0.25" />
          <Cloud x={-40} y={120} scale={0.8} />
        </>
      )}
      {weather === "evening" && (
        <>
          <path d="M1330 30 a40 40 0 1 0 36 58 a30 30 0 1 1 -36 -58 Z" fill="#ffe066" />
          {[
            [-60, 60],
            [-20, 260],
            [1360, 220],
            [1320, 420],
            [-150, 940],
          ].map(([x, y], i) => (
            <path key={x * y} className="el-twinkle" style={{ animationDelay: `${i * 0.4}s` }} d={star(x, y, 9)} fill="#fff3bf" />
          ))}
        </>
      )}
      <rect x={-FAR} y={GROUND} width={VIEW_W + 2 * FAR} height={FAR} fill="#80b918" />
      <rect x={-FAR} y={GROUND} width={VIEW_W + 2 * FAR} height="10" fill="#55a630" />
      {weather === "rain" && (
        <g className="el-rain-lines" stroke="#e7f5ff" strokeWidth="3" strokeLinecap="round" opacity="0.8">
          {Array.from({ length: 60 }, (_, i) => (
            <path key={i} d={`M${-380 + (i % 20) * 110 + Math.floor(i / 20) * 37} ${-200 + Math.floor(i / 20) * 380 + (i % 3) * 90} l-10 26`} />
          ))}
        </g>
      )}
    </>
  );
}

/** The roof and the walls behind and between the rooms. */
export function Shell() {
  return (
    <>
      <rect x={HOUSE_L} y={TOP} width={HOUSE_R - HOUSE_L} height={GROUND - TOP} fill="#f1dcc0" />
      <rect x="280" y="34" width="60" height="110" fill="#c0504d" />
      <rect x="272" y="26" width="76" height="16" rx="3" fill="#a33b38" />
      <path d={`M${HOUSE_L - 30} ${TOP} L150 46 H${HOUSE_R - 130} L${HOUSE_R + 30} ${TOP} Z`} fill="#d1495b" />
      <path
        d={Array.from({ length: 4 }, (_, i) => {
          const y = 76 + i * 26;
          const inset = ((y - 46) / (TOP - 46)) * 180;
          return `M${150 - inset + 10} ${y} H${HOUSE_R - 130 + inset - 10}`;
        }).join(" ")}
        stroke="#b23a48"
        strokeWidth="5"
      />
      <rect x={HOUSE_L - 34} y={TOP - 8} width={HOUSE_R - HOUSE_L + 68} height="14" rx="5" fill="#a33b38" />
    </>
  );
}

/** The ceiling slabs between the floors, drawn over the rooms. */
export function Slabs() {
  return (
    <>
      {FLOOR_LIST.map((f) => (
        <g key={f}>
          <rect x={HOUSE_L} y={floorLine(f)} width={SHAFT_L - HOUSE_L} height={SLAB} fill="#a47148" />
          <rect x={HOUSE_L} y={floorLine(f)} width={SHAFT_L - HOUSE_L} height="4" fill="#c08a5d" />
        </g>
      ))}
      <rect x={HOUSE_L} y={TOP} width={ROOM_L - HOUSE_L} height={GROUND - TOP} fill="#e6c79c" />
    </>
  );
}

/** The open lift shaft behind the cabin, with its rails. */
export function Shaft() {
  return (
    <>
      <rect x={SHAFT_L} y={TOP} width={SHAFT_R - SHAFT_L} height={GROUND - TOP} fill="#5c6b73" />
      <path d={`M${CABIN_L - 8} ${TOP} V${GROUND} M${CABIN_R + 8} ${TOP} V${GROUND}`} stroke="#37474f" strokeWidth="6" />
      {FLOOR_LIST.map((f) => (
        <rect key={f} x={SHAFT_L} y={floorLine(f)} width={SHAFT_R - SHAFT_L} height="6" fill="#455a64" />
      ))}
      <rect x={SHAFT_R} y={TOP} width={HOUSE_R - SHAFT_R} height={GROUND - TOP} fill="#e6c79c" />
    </>
  );
}

const rideStyle = (f: number, ride: number) => ({ transform: `translateY(${floorLine(f)}px)`, transitionDuration: `${ride}ms` }) as CSSProperties;

/** The inside of the cabin, behind the children, with the rope it hangs on. */
export function CabinBack({ floor, ride }: { floor: number; ride: number }) {
  return (
    <>
      {/* The rope, only inside the shaft */}
      <clipPath id="el-shaft-clip">
        <rect x={SHAFT_L} y={TOP} width={SHAFT_R - SHAFT_L} height={GROUND - TOP} />
      </clipPath>
      <g clipPath="url(#el-shaft-clip)">
        <g className="el-ride" style={rideStyle(floor, ride)}>
          <rect x={CABIN_MID - 2} y={-CABIN_H - 1200} width="4" height="1200" fill="#263238" />
        </g>
      </g>
      <g className="el-ride" style={rideStyle(floor, ride)}>
        <rect x={CABIN_L} y={-CABIN_H} width={CABIN_W} height={CABIN_H} rx="10" fill="#ffe8a3" />
        <rect x={CABIN_L + 10} y={-CABIN_H + 10} width={CABIN_W - 20} height={CABIN_H - 30} rx="6" fill="#ffd8a8" />
        <path d={`M${CABIN_L + 14} -84 H${CABIN_R - 14}`} stroke="#c9a227" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx={CABIN_MID} cy={-CABIN_H + 8} rx="30" ry="7" fill="#fff9db" />
        <rect x={CABIN_L} y="-8" width={CABIN_W} height="8" fill="#8d6e63" />
      </g>
    </>
  );
}

/** The cabin's glass doors in front of the children; they slide into the walls when open. */
export function CabinFront({ floor, ride, open }: { floor: number; ride: number; open: boolean }) {
  const half = CABIN_W / 2;
  return (
    <g className="el-ride el-cabin-front" style={rideStyle(floor, ride)}>
      <clipPath id="el-cabin-clip">
        <rect x={CABIN_L} y={-CABIN_H} width={CABIN_W} height={CABIN_H} />
      </clipPath>
      <g clipPath="url(#el-cabin-clip)">
        {[-1, 1].map((s) => (
          <g key={s} className={`el-door${open ? " open" : ""}`} style={{ "--s": s } as CSSProperties}>
            <rect
              x={s < 0 ? CABIN_L : CABIN_MID}
              y={-CABIN_H}
              width={half}
              height={CABIN_H - 8}
              fill="#d0ebff"
              fillOpacity="0.35"
              stroke="#90a4ae"
              strokeWidth="6"
            />
            <path d={`M${CABIN_MID + s * 18} ${-CABIN_H + 30} l${s * 22} 40`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
          </g>
        ))}
      </g>
      <rect x={CABIN_L - 6} y={-CABIN_H - 6} width={CABIN_W + 12} height={CABIN_H + 6} rx="12" fill="none" stroke="#78909c" strokeWidth="10" />
    </g>
  );
}

/** A soft glow around the room of `floor`, to help when the child doesn't find it. */
export function Hint({ floor }: { floor: number }) {
  return (
    <rect
      className="el-hint"
      x={ROOM_L + 6}
      y={floorLine(floor) - ROOM_H + 6}
      width={ROOM_R - ROOM_L - 12}
      height={ROOM_H - 12}
      rx="16"
      fill="none"
      stroke="#ffd43b"
      strokeWidth="12"
    />
  );
}

/** Room around the wanted thing inside its outline. */
const CONTOUR_PAD = 12;

/** A thin dashed yellow outline around the thing in the bubble, in the room of `floor`, so the child sees where to
 * ride. It finds the thing by its `data-wish` in the picture and measures it; `glow` makes it pulse with the room's
 * glow. It doesn't move by itself. */
export function Contour({ wish, floor, glow }: { wish: string; floor: number; glow: boolean }) {
  const ref = useRef<SVGGElement>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const svg = ref.current?.ownerSVGElement;
    const thing = svg?.querySelector(`[data-wish~="${wish}"]`);
    const toSvg = svg?.getScreenCTM()?.inverse();
    if (!thing || !toSvg) return;
    const r = thing.getBoundingClientRect();
    const a = new DOMPoint(r.left, r.top).matrixTransform(toSvg);
    const b = new DOMPoint(r.right, r.bottom).matrixTransform(toSvg);
    // Kept inside the room, so it never covers the walls or the lift.
    const top = floorLine(floor) - ROOM_H + 8;
    const x = Math.max(ROOM_L + 8, a.x - CONTOUR_PAD);
    const y = Math.max(top, a.y - CONTOUR_PAD);
    setBox({ x, y, w: Math.min(ROOM_R - 8, b.x + CONTOUR_PAD) - x, h: Math.min(floorLine(floor) - 4, b.y + CONTOUR_PAD) - y });
  }, [wish, floor]);
  return (
    <g ref={ref} className={glow ? "el-contour glow" : "el-contour"}>
      {box && (
        <>
          <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="18" fill="none" stroke="#fff" strokeWidth="10" opacity="0.6" />
          <rect
            x={box.x}
            y={box.y}
            width={box.w}
            height={box.h}
            rx="18"
            fill="none"
            stroke="#fab005"
            strokeWidth="5"
            strokeDasharray="14 9"
            strokeLinecap="round"
          />
        </>
      )}
    </g>
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
    <g className={`el-action${waiting ? " on" : ""}`} role="button" aria-label={t({ de: "Los", ru: "Вперёд" })}>
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
  const down = (f: number) => (e: PointerEvent) => {
    e.stopPropagation();
    onPress(f);
  };
  return (
    <>
      {FLOOR_LIST.map((f) => (
        <rect key={`room${f}`} x={HOUSE_L} y={floorLine(f) - ROOM_H} width={SHAFT_R - HOUSE_L} height={ROOM_H} fill="transparent" onPointerDown={down(f)} />
      ))}
      <rect x={BUTTON_X - 70} y={TOP + 20} width="140" height={GROUND - TOP - 40} rx="30" fill="#cfd8dc" stroke="#90a4ae" strokeWidth="6" />
      {FLOOR_LIST.map((f) => {
        const cy = floorLine(f) - ROOM_H / 2;
        return (
          <g
            key={f}
            className={`el-button${lit === f ? " lit" : ""}${hint === f ? " hint" : ""}`}
            style={{ transformOrigin: `${BUTTON_X}px ${cy}px` }}
            onPointerDown={down(f)}
            role="button"
            aria-label={t({ de: `Stock ${f + 1}`, ru: `Этаж ${f + 1}` })}
          >
            <circle cx={BUTTON_X} cy={cy + 6} r={BUTTON_R} fill="#78909c" />
            <circle className="el-button-face" cx={BUTTON_X} cy={cy} r={BUTTON_R} stroke="#90a4ae" strokeWidth="6" />
            <text x={BUTTON_X} y={cy + 20} textAnchor="middle" fontSize="58" fontWeight="800" fontFamily="inherit">
              {f + 1}
            </text>
          </g>
        );
      })}
    </>
  );
}

/** Confetti falling over the whole picture at the end of a story. */
export function Confetti() {
  const colours = ["#ff6b6b", "#ffd43b", "#51cf66", "#4dabf7", "#cc5de8", "#ff922b"];
  return (
    <g className="el-confetti">
      {Array.from({ length: 48 }, (_, i) => (
        <rect
          key={i}
          x={(i * 157) % VIEW_W}
          y={-30}
          width="16"
          height="26"
          rx="3"
          fill={colours[i % colours.length]}
          style={{ animationDelay: `${(i % 12) * 0.18}s`, animationDuration: `${2.4 + (i % 5) * 0.3}s` }}
        />
      ))}
    </g>
  );
}
