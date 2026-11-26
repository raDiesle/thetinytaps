import { memo, useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { useRunClock } from "./pause";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";

// Lift to the Top (id `jump`, H-127; user request, 26 November 2026: „nur ein Hochhaus mit einem Aufzug … man sieht groß
// den Aufzug und die Zahlen, die wie bei einem Aufzug langsam rot hochzählen“): one tall tower with a big glass lift on
// its front. The lift stands big in the picture's middle the whole run, and the tower slides down behind it, storey
// after storey – one HTML layer moved by a transform (`tm-lift-world`), never a changing viewBox – so the landing doors
// and the floor numbers beside them pass behind the glass. Over the cabin's glass a black panel shows the floor in red
// dot-matrix digits with an arrow scrolling up, counting 0 to 20 as it passes each floor, the way a real lift does.
// The lift starts gently and stops gently (`liftAt`), arrives at the top floor a few seconds before the end, the
// landing door behind it opens, and the flag on the roof goes up its pole as the time is up.

/** How many floors the lift rises: every run all of them, a short time only faster (the whole story at every length). */
export const FLOORS = 20;

/** One storey's height, floor to floor, in stage units. */
export const STOREY = 440;

/** How far the tower slides down while the lift goes up. */
export const TRAVEL = FLOORS * STOREY;

/** The world: the stage's height plus the way, so at the start its foot is the stage's foot and at the end its top the stage's top. */
export const WORLD_H = STAGE_H + TRAVEL;

/** Where the cabin's floor stands on the stage, the whole run (with the floor it stands at). */
export const LEVEL = 780;

/** The level of floor `k` in the world (0 the ground floor, `FLOORS` the top one, which stands at `LEVEL` at the end). */
export const levelOf = (k: number) => LEVEL + (FLOORS - k) * STOREY;

/** The roof's level, a storey above the top floor. */
export const ROOF = levelOf(FLOORS + 1);

/** The tower's sides and the shaft on its front, in stage units. */
export const TOWER = { x: 300, w: 1000 } as const;
export const SHAFT = { x: 570, w: 460 } as const;

/** The cabin, standing still on the stage: a frame with a panel for the floor's number above its glass. */
export const CAR = { x: 590, y: LEVEL - 430, w: 420, h: 430 } as const;
const HEADER = 116;

/** The floor display on the cabin's panel, in stage units. */
export const DISPLAY = { x: 650, y: CAR.y + 12, w: 300, h: 92 } as const;

/** A landing door at each floor, behind the cabin's glass, and the plate with its number beside it. */
export const DOOR = { x: 735, w: 130, h: 270 } as const;
export const PLATE = { x: 930, w: 62, h: 62, above: 250 } as const;

/** The flagpole on the roof and the flag at the top of it, in stage units at the end of the run. */
export const POLE = { x: 420, top: 112, foot: ROOF - 40 } as const;
export const FLAG = { x: 424, y: 122, w: 112, h: 66 } as const;
/** How far below the top the flag waits until it is hoisted. */
export const FLAG_DROP = POLE.foot - 4 - (FLAG.y + FLAG.h);

/** The hoisting of the flag, at most this long, and at most this share of a short run. */
const FLAG_MS = 5000;
const FLAG_SHARE = 0.12;

/** The run's plan: when the lift arrives at the top, when the door has opened and when the flag starts up. */
export function liftPlan(total: number) {
  const flag = Math.min(FLAG_MS, total * FLAG_SHARE);
  const arrive = total - flag;
  return { arrive, doorOpen: arrive + flag * 0.3, flagFrom: arrive + flag * 0.2 };
}

/** How long the lift takes for one storey at its even pace; starting and stopping take one each, at half the way. */
const storeyMs = (arrive: number) => arrive / (FLOORS + 1);

/**
 * How far the lift has risen `t` ms into the run, in stage units (0 to `TRAVEL`): speeding up gently over the first
 * half storey, an even pace, and slowing down gently over the last half storey (quadratic, so the pace runs on smoothly).
 */
export function liftAt(t: number, arrive: number) {
  const u = storeyMs(arrive);
  const half = STOREY / 2;
  if (t <= 0) return 0;
  if (t >= arrive) return TRAVEL;
  if (t < u) return half * (t / u) ** 2;
  if (t > arrive - u) return TRAVEL - half * ((arrive - t) / u) ** 2;
  return half + ((t - u) / u) * STOREY;
}

/** The floor the display shows `t` ms into the run: the next one from halfway between two floors, as a lift does. */
export const floorAt = (t: number, arrive: number) => Math.min(FLOORS, Math.round(liftAt(t, arrive) / STOREY));

/** When the display turns to floor `k` (1 to `FLOORS`): the moment the lift is halfway up to it. */
export function floorTurnsAt(k: number, arrive: number) {
  const u = storeyMs(arrive);
  const at = (k - 0.5) * STOREY;
  if (at <= STOREY / 2) return u * Math.sqrt(at / (STOREY / 2));
  if (at >= TRAVEL - STOREY / 2) return arrive - u * Math.sqrt((TRAVEL - at) / (STOREY / 2));
  return u + ((at - STOREY / 2) / STOREY) * u;
}

/** The tower's way down, as keyframes in % of the world's height: gently off, an even pace, gently to a stop. */
export function worldFrames(arrive: number): Frame[] {
  const u = storeyMs(arrive);
  const y = (risen: number) => `translateY(${(((risen - TRAVEL) / WORLD_H) * 100).toFixed(4)}%)`;
  return [
    { at: 0, transform: y(0), ease: "cubic-bezier(0.33, 0, 0.67, 0.33)" },
    { at: u, transform: y(STOREY / 2), ease: "linear" },
    { at: arrive - u, transform: y(TRAVEL - STOREY / 2), ease: "cubic-bezier(0.33, 0.67, 0.67, 1)" },
    { at: arrive, transform: y(TRAVEL) },
  ];
}

/** The keyframes of this run: the tower's way, the top door's two halves opening and the flag going up. */
function LiftKeyframes({ name, total }: { name: string; total: number }) {
  const { arrive, doorOpen, flagFrom } = liftPlan(total);
  const door = (side: number): Frame[] => [
    { at: 0, transform: "translateX(0%)" },
    { at: arrive, transform: "translateX(0%)" },
    { at: doorOpen, transform: `translateX(${side * 85}%)` },
  ];
  const flag: Frame[] = [
    { at: 0, transform: `translateY(${((FLAG_DROP / FLAG.h) * 100).toFixed(3)}%)` },
    { at: flagFrom, transform: `translateY(${((FLAG_DROP / FLAG.h) * 100).toFixed(3)}%)` },
    { at: total, transform: "translateY(0%)" },
  ];
  const rules = [
    keyframes(`${name}-world`, total, holdToEnd(worldFrames(arrive), total)),
    keyframes(`${name}-door-l`, total, holdToEnd(door(-1), total)),
    keyframes(`${name}-door-r`, total, holdToEnd(door(1), total)),
    keyframes(`${name}-flag`, total, holdToEnd(flag, total)),
  ];
  return <style>{rules.join("\n")}</style>;
}

/** A piece of the world as an HTML layer of its own, placed in stage units within the world's height. */
function InWorld({
  x,
  y,
  w,
  h,
  className,
  style,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={`tm-layer${className ? ` ${className}` : ""}`}
      style={{ left: `${(x / STAGE_W) * 100}%`, top: `${(y / WORLD_H) * 100}%`, width: `${(w / STAGE_W) * 100}%`, height: `${(h / WORLD_H) * 100}%`, ...style }}
      aria-hidden
    >
      {children}
    </div>
  );
}

/** The tower's colours: its warm walls, the bands of its floors, the shaft's wall, the steel of the doors and rails. */
const WALL = "#f8e1c4";
const WALL_DARK = "#e9c69e";
const BAND = "#d9a877";
const SHAFT_WALL = "#dde4ec";
const STEEL = "#adb5bd";
const STEEL_DARK = "#868e96";
const GLASS = "#a5d8ff";
const GRASS = "#69b34c";

/** The curtains and lights in the windows, so no floor looks quite like the next. */
const CURTAINS = ["#ff8787", "#ffd43b", "#74c0fc", "#b197fc", "#8ce99a"];

/** The sky behind, light near the ground and bluer above; drawn once. */
const LiftSky = memo(function LiftSky() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H} bleed>
        <defs>
          <linearGradient id="tm-lift-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4dabf7" />
            <stop offset="1" stopColor="#d0ebff" />
          </linearGradient>
        </defs>
        <rect width={STAGE_W} height={STAGE_H} fill="url(#tm-lift-sky)" />
      </Draw>
    </Layer>
  );
});

/** A soft white cloud. */
function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity="0.92">
      <ellipse cx="0" cy="0" rx="70" ry="34" />
      <ellipse cx="-46" cy="10" rx="44" ry="26" />
      <ellipse cx="50" cy="8" rx="48" ry="28" />
      <ellipse cx="10" cy="-22" rx="40" ry="30" />
    </g>
  );
}

/** Clouds beside the tower at every height, some past the stage's sides for wide screens, so the rise is seen there too. */
const CLOUDS = Array.from({ length: 18 }, (_, i) => {
  const left = i % 2 === 0;
  return { x: left ? 150 - ((i * 37) % 130) : 1450 + ((i * 53) % 120), y: 260 + i * 470 + ((i * 97) % 160), s: 0.8 + ((i * 29) % 40) / 100 };
});

/** One window of a floor, with curtains, a lamp or a plant here and there. */
function Window({ x, y, w, h, look }: { x: number; y: number; w: number; h: number; look: number }) {
  const curtain = CURTAINS[look % CURTAINS.length];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill={look % 3 === 0 ? "#fff3bf" : GLASS} stroke={INK} strokeWidth="5" />
      {look % 3 !== 0 && <path d={`M${x + 6} ${y + h - 6} L${x + w - 6} ${y + 6}`} stroke="#d0ebff" strokeWidth="10" opacity="0.7" />}
      {look % 2 === 0 && (
        <>
          <path d={`M${x + 5} ${y + 5} H${x + 28} Q${x + 20} ${y + h / 2} ${x + 30} ${y + h - 5} H${x + 5} Z`} fill={curtain} />
          <path d={`M${x + w - 5} ${y + 5} H${x + w - 28} Q${x + w - 20} ${y + h / 2} ${x + w - 30} ${y + h - 5} H${x + w - 5} Z`} fill={curtain} />
        </>
      )}
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.42} H${x + w}`} stroke={INK} strokeWidth="4" />
      {look % 4 === 1 && (
        <g>
          <rect x={x + w / 2 - 16} y={y + h - 26} width="32" height="22" rx="4" fill="#e8590c" />
          <circle cx={x + w / 2 - 8} cy={y + h - 34} r="11" fill="#40c057" />
          <circle cx={x + w / 2 + 9} cy={y + h - 38} r="12" fill="#51cf66" />
        </g>
      )}
      <rect x={x - 8} y={y + h} width={w + 16} height="12" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The number on the plate beside a landing door. */
function FloorPlate({ k }: { k: number }) {
  const y = levelOf(k) - PLATE.above;
  return (
    <g>
      <rect x={PLATE.x} y={y} width={PLATE.w} height={PLATE.h} rx="10" fill="#fff" stroke={INK} strokeWidth="5" />
      <text x={PLATE.x + PLATE.w / 2} y={y + PLATE.h / 2 + 15} textAnchor="middle" fontSize="40" fontWeight="800" fontFamily="system-ui, sans-serif" fill={INK}>
        {k}
      </text>
    </g>
  );
}

/** A landing door: its frame and the two steel halves, shut. */
function LandingDoor({ k, open }: { k: number; open?: boolean }) {
  const y = levelOf(k) - DOOR.h;
  return (
    <g>
      <rect x={DOOR.x - 12} y={y - 12} width={DOOR.w + 24} height={DOOR.h + 12} rx="6" fill={STEEL_DARK} stroke={INK} strokeWidth="5" />
      {open ? (
        // Behind the top floor's door a warm, lit room, seen once it opens.
        <g>
          <rect x={DOOR.x} y={y} width={DOOR.w} height={DOOR.h} fill="#ffe8a1" />
          <rect x={DOOR.x + 30} y={y + 40} width={70} height={90} rx="8" fill="#a5d8ff" stroke="#e8b04b" strokeWidth="5" />
          <rect x={DOOR.x + 82} y={y + DOOR.h - 70} width="30" height="26" rx="4" fill="#e8590c" />
          <circle cx={DOOR.x + 90} cy={y + DOOR.h - 82} r="16" fill="#40c057" />
          <circle cx={DOOR.x + 106} cy={y + DOOR.h - 88} r="14" fill="#51cf66" />
          <rect x={DOOR.x} y={y + DOOR.h - 18} width={DOOR.w} height="18" fill="#e8b04b" />
        </g>
      ) : (
        <>
          <rect x={DOOR.x} y={y} width={DOOR.w} height={DOOR.h} fill={STEEL} />
          <path d={`M${DOOR.x + DOOR.w / 2} ${y} V${y + DOOR.h}`} stroke={INK} strokeWidth="4" />
          <rect x={DOOR.x + 10} y={y + 12} width="16" height={DOOR.h - 24} rx="6" fill="#ced4da" />
          <rect x={DOOR.x + DOOR.w / 2 + 10} y={y + 12} width="16" height={DOOR.h - 24} rx="6" fill="#ced4da" />
        </>
      )}
    </g>
  );
}

/** One floor of the tower: its band, its windows either side of the shaft, the shaft's wall with its door and number. */
function Storey({ k }: { k: number }) {
  const level = levelOf(k);
  const top = level - STOREY;
  const looks = [0, 1, 2, 3].map((i) => (k * 7 + i * 3) % 12);
  return (
    <g>
      {k === 0 ? (
        // The ground floor: the glass entrance with its striped awning on the left, two shop windows with flower boxes on the right.
        <g>
          <rect x={340} y={level - 250} width={190} height={250} rx="6" fill={GLASS} stroke={INK} strokeWidth="6" />
          <path d={`M435 ${level - 250} V${level}`} stroke={INK} strokeWidth="5" />
          <circle cx={422} cy={level - 120} r="6" fill={INK} />
          <circle cx={448} cy={level - 120} r="6" fill={INK} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${320 + i * 40} ${level - 300} h40 l-6 46 h-28 z`} fill={i % 2 ? "#fff" : "#fa5252"} stroke={INK} strokeWidth="4" />
          ))}
          {[1060, 1175].map((x) => (
            <g key={x}>
              <rect x={x} y={level - 260} width={95} height={170} rx="8" fill={GLASS} stroke={INK} strokeWidth="5" />
              <rect x={x - 6} y={level - 92} width={107} height={30} rx="6" fill="#c0703c" stroke={INK} strokeWidth="4" />
              {[0, 1, 2, 3].map((j) => (
                <circle key={j} cx={x + 10 + j * 25} cy={level - 98} r="11" fill={["#ff8787", "#ffd43b", "#f783ac", "#ffa94d"][j]} />
              ))}
            </g>
          ))}
        </g>
      ) : (
        [330, 450, 1050, 1170].map((x, i) => <Window key={x} x={x} y={level - 330} w={100} h={210} look={looks[i]} />)
      )}
      {/* The band of the floor above. */}
      <rect x={TOWER.x - 10} y={top} width={TOWER.w + 20} height="36" fill={BAND} stroke={INK} strokeWidth="5" />
      <LandingDoor k={k} open={k === FLOORS} />
      <FloorPlate k={k} />
    </g>
  );
}

/** The tower's foot: the pavement, the meadow with its trees and bushes, reaching past the stage's sides. */
function Ground() {
  const ground = levelOf(0);
  return (
    <g>
      {[110, 1490].map((x) => (
        <g key={x}>
          <rect x={x - 16} y={ground - 190} width="32" height="190" fill="#8a5a2b" stroke={INK} strokeWidth="5" />
          <circle cx={x} cy={ground - 250} r="95" fill="#51a33a" stroke={INK} strokeWidth="6" />
          <circle cx={x - 30} cy={ground - 280} r="40" fill="#74c955" />
        </g>
      ))}
      <rect x={-900} y={ground} width={STAGE_W + 1800} height="260" fill={GRASS} />
      <rect x={-900} y={ground} width={STAGE_W + 1800} height="26" fill="#ced4da" stroke={INK} strokeWidth="5" />
      {[260, 580, 1030, 1340].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={ground - 2} rx="46" ry="30" fill="#40a02b" stroke={INK} strokeWidth="5" />
          <circle cx={x - 14} cy={ground - 18} r="6" fill="#ff8787" />
          <circle cx={x + 16} cy={ground - 12} r="6" fill="#ffd43b" />
        </g>
      ))}
    </g>
  );
}

/** The roof over the top floor: the ledge, the lift's machine room over the shaft, and the flagpole. */
function Roof() {
  return (
    <g>
      <rect x={TOWER.x - 16} y={ROOF - 40} width={TOWER.w + 32} height="44" rx="6" fill={WALL_DARK} stroke={INK} strokeWidth="6" />
      <rect x={620} y={190} width={360} height={ROOF - 40 - 190} rx="8" fill={WALL} stroke={INK} strokeWidth="6" />
      <rect x={606} y={178} width={388} height="22" rx="6" fill={BAND} stroke={INK} strokeWidth="5" />
      <circle cx={800} cy={245} r="22" fill={GLASS} stroke={INK} strokeWidth="5" />
      <rect x={POLE.x - 5} y={POLE.top} width="10" height={POLE.foot - POLE.top} fill="#dee2e6" stroke={INK} strokeWidth="4" />
      <circle cx={POLE.x} cy={POLE.top - 4} r="10" fill="#fcc419" stroke={INK} strokeWidth="4" />
      <rect x={POLE.x - 18} y={POLE.foot - 12} width="36" height="14" rx="4" fill={STEEL_DARK} stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The tower, many screens tall, with its ground and roof and the clouds round it; drawn once. */
const Tower = memo(function Tower() {
  const ground = levelOf(0);
  return (
    <InWorld x={0} y={0} w={STAGE_W} h={WORLD_H}>
      <Draw w={STAGE_W} h={WORLD_H}>
        {CLOUDS.map((c, i) => (
          <Cloud key={i} {...c} />
        ))}
        <rect x={TOWER.x} y={ROOF} width={TOWER.w} height={ground - ROOF} fill={WALL} stroke={INK} strokeWidth="6" />
        {/* The shaft: the wall behind the lift, its two rails and the ropes, from the machine room down to the ground. */}
        <rect x={SHAFT.x} y={ROOF} width={SHAFT.w} height={ground - ROOF} fill={SHAFT_WALL} stroke={INK} strokeWidth="5" />
        {Array.from({ length: FLOORS + 1 }, (_, k) => (
          <Storey key={k} k={k} />
        ))}
        {[SHAFT.x + 6, SHAFT.x + SHAFT.w - 18].map((x) => (
          <rect key={x} x={x} y={ROOF} width="12" height={ground - ROOF} fill={STEEL_DARK} stroke={INK} strokeWidth="3" />
        ))}
        {[792, 808].map((x) => (
          <path key={x} d={`M${x} ${ROOF} V${ground}`} stroke="#495057" strokeWidth="4" />
        ))}
        <Roof />
        <Ground />
      </Draw>
    </InWorld>
  );
});

/** The two halves of the top floor's landing door, which slide open once the lift has arrived. */
function TopDoor({ name }: { name: string }) {
  const y = LEVEL - DOOR.h;
  return (
    <>
      {[-1, 1].map((side) => (
        <InWorld
          key={side}
          x={side < 0 ? DOOR.x : DOOR.x + DOOR.w / 2}
          y={y}
          w={DOOR.w / 2}
          h={DOOR.h}
          className="tm-hop tm-lift-door"
          style={{ "--tm-anim": `${name}-door-${side < 0 ? "l" : "r"}`, "--tm-end": `translateX(${side * 85}%)` } as CSSProperties}
        >
          <svg viewBox={`0 0 ${DOOR.w / 2} ${DOOR.h}`} preserveAspectRatio="none">
            <rect width={DOOR.w / 2} height={DOOR.h} fill={STEEL} stroke={INK} strokeWidth="3" />
            <rect x="10" y="12" width="16" height={DOOR.h - 24} rx="6" fill="#ced4da" />
          </svg>
        </InWorld>
      ))}
    </>
  );
}

/** The flag on the roof: waiting low on its pole, hoisted to the top as the time is up, then waving gently. */
function Flag({ name }: { name: string }) {
  return (
    <InWorld {...FLAG} className="tm-hop tm-lift-flag" style={{ "--tm-anim": `${name}-flag`, "--tm-end": "translateY(0%)" } as CSSProperties}>
      <div className="tm-lift-wave">
        <svg viewBox={`0 0 ${FLAG.w} ${FLAG.h}`}>
          <path
            d={`M0 0 Q${FLAG.w * 0.5} -8 ${FLAG.w} 6 Q${FLAG.w - 14} ${FLAG.h / 2} ${FLAG.w} ${FLAG.h - 6} Q${FLAG.w * 0.5} ${FLAG.h + 6} 0 ${FLAG.h} Z`}
            fill="#fa5252"
            stroke={INK}
            strokeWidth="5"
          />
          <path
            d="M56 18 L62 31 L76 32 L65 41 L69 55 L56 47 L43 55 L47 41 L36 32 L50 31 Z"
            fill="#ffd43b"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </InWorld>
  );
}

/** The 5 × 7 dots of the display's characters, row by row (1 lit). */
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  "^": ["00100", "01110", "11111", "00100", "00100", "00100", "00100"],
};

/** A dot's step and radius in the display's units. */
const DOT = 12.4;
const DOT_R = 4.6;
const LIT = "#ff3b30";
const UNLIT = "#3d1414";

/** One character in dots, lit red with a soft glow round each lit dot, the others faint as on a real display. */
function Glyph({ char, x, y }: { char: string; x: number; y: number }) {
  const rows = GLYPHS[char] ?? GLYPHS[" "];
  return (
    <g>
      {rows.flatMap((row, r) =>
        [...row].map((on, c) => (
          <g key={`${r}-${c}`}>
            {on === "1" && <circle cx={x + c * DOT + DOT / 2} cy={y + r * DOT + DOT / 2} r={DOT_R * 1.7} fill={LIT} opacity="0.25" />}
            <circle cx={x + c * DOT + DOT / 2} cy={y + r * DOT + DOT / 2} r={DOT_R} fill={on === "1" ? LIT : UNLIT} />
          </g>
        )),
      )}
    </g>
  );
}

/** Where the arrow and the two digits stand on the display, in its own units. */
const GLYPH_W = 5 * DOT;
const GLYPH_H = 7 * DOT;
const GLYPH_TOP = (DISPLAY.h - GLYPH_H) / 2;
const ARROW_X = 26;
const DIGIT_XS = [ARROW_X + GLYPH_W + 40, ARROW_X + GLYPH_W + 40 + GLYPH_W + 16];

/** What the display shows `t` ms into the run: the floor, and whether the arrow still runs (until the lift arrives). */
export const displayAt = (t: number, arrive: number) => `${floorAt(t, arrive)}${t < arrive ? "^" : ""}`;

/**
 * The display: the floor's number in red dots, and while the lift goes up the arrow beside it, its dots scrolling up a
 * step at a time, once a second, as a lift's arrow does. On the run's clock, so it stands still while paused: React
 * draws this small layer only when the lift passes a floor or arrives, and asks the clock a few times a second until
 * then. `still` (a menu's card) shows that moment and no more.
 */
function LiftDisplay({ startedAt, arrive, still }: { startedAt: number; arrive: number; still?: boolean }) {
  const clock = useRunClock();
  const [shown, setShown] = useState(() => displayAt(clock.now() - startedAt, arrive));
  const moving = shown.endsWith("^");
  useEffect(() => {
    if (still || clock.paused || !moving) return;
    const tick = () => setShown(displayAt(clock.now() - startedAt, arrive));
    tick();
    const timer = setInterval(tick, 200);
    return () => clearInterval(timer);
  }, [still, clock, startedAt, arrive, moving]);
  const text = String(Number.parseInt(shown, 10)).padStart(2, " ");
  return (
    <Layer {...DISPLAY} className="tm-lift-digits">
      <svg viewBox={`0 0 ${DISPLAY.w} ${DISPLAY.h}`}>
        {moving || <Glyph char=" " x={ARROW_X} y={GLYPH_TOP} />}
        {[...text].map((c, i) => (
          <Glyph key={i} char={c} x={DIGIT_XS[i]} y={GLYPH_TOP} />
        ))}
      </svg>
      {moving && (
        <div
          className="tm-layer tm-lift-arrow-box"
          style={{
            left: `${(ARROW_X / DISPLAY.w) * 100}%`,
            top: `${(GLYPH_TOP / DISPLAY.h) * 100}%`,
            width: `${(GLYPH_W / DISPLAY.w) * 100}%`,
            height: `${(GLYPH_H / DISPLAY.h) * 100}%`,
          }}
        >
          <div className="tm-lift-arrow">
            <svg viewBox={`0 0 ${GLYPH_W} ${GLYPH_H * 2}`}>
              <Glyph char="^" x={0} y={0} />
              <Glyph char="^" x={0} y={GLYPH_H} />
            </svg>
          </div>
        </div>
      )}
    </Layer>
  );
}

/** The cabin: a sunny yellow frame, the black panel for the display, big glass panes, a handrail and a plant inside; drawn once. */
const Cabin = memo(function Cabin() {
  const { w, h } = CAR;
  return (
    <Layer {...CAR} className="tm-lift-car">
      <Draw w={w} h={h}>
        {/* The guide shoes on the rails at its sides. */}
        {[10, h - 40].map((y) => (
          <g key={y}>
            <rect x={-14} y={y} width="22" height="30" rx="4" fill={STEEL_DARK} stroke={INK} strokeWidth="4" />
            <rect x={w - 8} y={y} width="22" height="30" rx="4" fill={STEEL_DARK} stroke={INK} strokeWidth="4" />
          </g>
        ))}
        <rect x="0" y="0" width={w} height={h} rx="18" fill="rgb(208 235 255 / 0.28)" />
        {/* Inside: a handrail along the back and a plant in its pot in the corner. */}
        <rect x="30" y={h - 150} width={w - 60} height="12" rx="6" fill={STEEL} stroke={INK} strokeWidth="4" />
        <rect x="44" y={h - 96} width="54" height="62" rx="8" fill="#e8590c" stroke={INK} strokeWidth="4" />
        <path
          d={`M71 ${h - 96} C50 ${h - 150} 30 ${h - 150} 28 ${h - 170} M71 ${h - 96} C76 ${h - 160} 90 ${h - 175} 110 ${h - 186} M71 ${h - 96} C66 ${h - 140} 72 ${h - 178} 70 ${h - 200}`}
          fill="none"
          stroke="#2f9e44"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* The frame: the panel on top, two thin posts between the panes, the posts at the sides and the floor. */}
        <rect x="0" y="0" width={w} height={HEADER} rx="18" fill="#fcc419" stroke={INK} strokeWidth="7" />
        <rect
          x={DISPLAY.x - CAR.x - 8}
          y={DISPLAY.y - CAR.y - 6}
          width={DISPLAY.w + 16}
          height={DISPLAY.h + 12}
          rx="16"
          fill="#111"
          stroke={INK}
          strokeWidth="5"
        />
        <rect x="0" y={HEADER - 6} width="18" height={h - HEADER} fill="#fcc419" stroke={INK} strokeWidth="6" />
        <rect x={w - 18} y={HEADER - 6} width="18" height={h - HEADER} fill="#fcc419" stroke={INK} strokeWidth="6" />
        {[w / 3, (2 * w) / 3].map((x) => (
          <rect key={x} x={x - 5} y={HEADER} width="10" height={h - HEADER - 30} fill="#fab005" stroke={INK} strokeWidth="3" />
        ))}
        <rect x="0" y={h - 32} width={w} height="32" rx="6" fill="#f08c00" stroke={INK} strokeWidth="7" />
        <path d={`M30 ${HEADER + 20} L80 ${HEADER + 20}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      </Draw>
    </Layer>
  );
});

/** The pulley on the cabin's roof, where the ropes come down: it turns a quarter a second while the lift goes up. */
function Pulley({ arrive }: { arrive: number }) {
  return (
    <Layer
      x={772}
      y={CAR.y - 30}
      w={56}
      h={56}
      className="tm-lift-pulley"
      style={{ "--tm-pulley-turns": Math.max(1, Math.floor(arrive / 1000)) } as CSSProperties}
    >
      <svg viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="25" fill={STEEL} stroke={INK} strokeWidth="5" />
        <path d="M28 6 V50 M6 28 H50" stroke={INK} strokeWidth="5" />
        <circle cx="28" cy="28" r="7" fill="#fcc419" stroke={INK} strokeWidth="4" />
      </svg>
    </Layer>
  );
}

/**
 * Lift to the Top: the sky, the tower sliding down behind the big cabin standing still in the middle, its display
 * counting the floors, and on the roof the flag going up at the end.
 */
export function LiftScene({ total, startedAt, glow, still }: { total: number; startedAt: number; glow: number; still?: boolean }) {
  // A name of its own for each length, so a card's keyframes never take over a run's.
  const name = `tm-lift-${Math.round(total)}`;
  const { arrive } = useMemo(() => liftPlan(total), [total]);
  return (
    <>
      <LiftKeyframes name={name} total={total} />
      <LiftSky />
      <div
        className="tm-layer tm-hop tm-lift-world"
        style={
          {
            left: 0,
            top: 0,
            width: "100%",
            height: `${(WORLD_H / STAGE_H) * 100}%`,
            "--tm-anim": `${name}-world`,
            "--tm-end": "translateY(0%)",
          } as CSSProperties
        }
        aria-hidden
      >
        <Tower />
        <TopDoor name={name} />
        <Flag name={name} />
      </div>
      {/* What is left of the way, lit at a tap (H-51): the shaft above the cabin, up to where the roof will be. */}
      <Layer x={CAR.x} y={0} w={CAR.w} h={CAR.y - 30} className="tm-lift-left">
        <LeftGlow n={glow} />
      </Layer>
      <Pulley arrive={arrive} />
      <Cabin />
      <LiftDisplay startedAt={startedAt} arrive={arrive} still={still} />
    </>
  );
}
