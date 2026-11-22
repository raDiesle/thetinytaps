import { type CSSProperties, memo, useMemo } from "react";
import { type Hop, Hopper, hopKeyframes } from "./hop";
import { type Frame, holdToEnd, keyframes } from "./keyframes";
import { Draw, INK, Layer, LeftGlow, STAGE_H, STAGE_W } from "./scenes";
import { ToyArt, type ToyKind } from "./tidy";

// The road rug (H-122, user request, 22 November 2026: more timers for tidying up): a play rug with a winding road on
// the floor, a little toy car at its start and a toy house with a chequered flag at its end – the goal, seen from the
// start. Toys lie on the road in the car's way. One after the other, from the nearest, a toy hops off the road into the
// toy box standing at the wall, and as it has landed the car drives on to the next one, until the last is gone and the
// car drives home as the time is up: the road coming free is the time gone, the way still blocked the time left. The
// car is the Tidy Up's toy car (`ToyArt`), bigger; it drives on keyframes written for the run along the road's own
// curve, tilting with it, and the toy whose turn comes wiggles once a second while it waits (H-63).

/** The wall's foot: above it the wall, below it the floor. */
const WALL = 400;

/**
 * The road's middle line: from `x0` to `x1` it swings once up and once down round `mid` by `amp`, so it winds across
 * the rug without the car ever tilting more than a little. It goes on a bit at each end, to the rug's edge and the house.
 */
export const ROAD = { x0: 300, x1: 1160, mid: 650, amp: 60, w: 78 } as const;

/** Where the road's middle is at `x`. */
export function roadY(x: number): number {
  return ROAD.mid - ROAD.amp * Math.sin((2 * Math.PI * (x - ROAD.x0)) / (ROAD.x1 - ROAD.x0));
}

/** The road's slope at `x`, as the angle (degrees, clockwise) something standing on it tilts by. */
export function roadTilt(x: number): number {
  const slope = (-ROAD.amp * 2 * Math.PI * Math.cos((2 * Math.PI * (x - ROAD.x0)) / (ROAD.x1 - ROAD.x0))) / (ROAD.x1 - ROAD.x0);
  return (Math.atan(slope) * 180) / Math.PI;
}

/** How far below the road's middle a thing standing on it has its foot, so it stands on the road, not over its edge. */
export const ON_ROAD = 16;

/** The toy house at the road's end: its left wall (the car stops before it), its width, its foot and its roof's top. */
export const HOUSE = { x: 1180, w: 140, foot: 690, top: 520 } as const;

/** The toy box at the wall the toys hop into: its left edge, width, rim and foot. */
export const ROAD_BOX = { x: 660, w: 280, rim: 320, bottom: 470 } as const;

/** How deep the box's opening is seen from above. */
const OPENING = 30;

/** A toy's size on the road and the car's (their layers are square, the foot on the floor). */
export const ROAD_TOY = 84;
export const CAR = 120;

/** How far the car's front reaches past its middle (its drawing spans 6–94 of 100). */
const CAR_FRONT = 0.44 * CAR;

/** How big a toy lies in the box. */
export const IN_BOX = 0.68;

/** The fewest and most toys on the road: five minutes takes eight, one every 37 or 38 seconds. */
export const MIN_ROAD_TOYS = 4;
export const MAX_ROAD_TOYS = 8;

/** How many toys lie on the road for a run of `ms`. */
export function roadToyCount(ms: number): number {
  return Math.max(MIN_ROAD_TOYS, Math.min(MAX_ROAD_TOYS, Math.round(ms / 37_500)));
}

/** The toys on the road, nearest the car first – never the car again, which is the one driving. */
const ROAD_KINDS: readonly ToyKind[] = ["block", "duck", "ball", "rings", "book", "drum", "top", "ball"];

/** Where the car starts (its foot's middle on the road), and where it stops at last, before the house's door. */
export const CAR_START = ROAD.x0;
export const CAR_HOME = HOUSE.x - CAR_FRONT - 6;

/** The gap between the car's front and the toy in its way. */
const STOP_GAP = 8;

/** Where the i-th of `count` toys lies on the road (its foot's middle): from just ahead of the car to before the house. */
export function roadToyX(i: number, count: number): number {
  const first = CAR_START + CAR_FRONT + STOP_GAP + ROAD_TOY / 2;
  const last = CAR_HOME - ROAD_TOY / 2 - 10;
  return first + (i * (last - first)) / (count - 1);
}

/** Where the car stops behind the i-th toy. */
export function carStop(i: number, count: number): number {
  return roadToyX(i, count) - ROAD_TOY / 2 - STOP_GAP - CAR_FRONT;
}

/** Where the j-th toy lies in the box: two rows of four, the second a little higher and shifted, the tops over the rim. */
export function roadBoxSlot(j: number): { x: number; y: number } {
  const row = Math.floor(j / 4);
  const col = j % 4;
  return { x: ROAD_BOX.x + ROAD_BOX.w / 2 + (col - 1.5) * 52 + (row ? 14 : -6), y: ROAD_BOX.rim + 14 - row * 20 };
}

/** How long a hop takes at most, and the car's drive to the next toy (less when things come quickly). */
export const ROAD_HOP_MS = 900;
export const DRIVE_MS = 2400;

/** One toy: its sort and its hop. */
export interface RoadToy {
  kind: ToyKind;
  hop: Hop;
}

/** One drive of the car: from where to where along the road, and when. */
export interface Drive {
  from: number;
  to: number;
  start: number;
  arrive: number;
}

/**
 * Works out a run of `total` ms with `count` toys: each toy has the same share of the time; in it the toy waits, hops
 * into the box, and as it lies there the car drives on to the next toy – or, after the last, home, arriving as the time
 * is up.
 */
export function roadPlan(total: number, count: number): { toys: RoadToy[]; drives: Drive[] } {
  const unit = total / count;
  const driveMs = Math.min(DRIVE_MS, unit * 0.35);
  const hopMs = Math.min(ROAD_HOP_MS, unit * 0.3);
  const pause = Math.min(300, unit * 0.05);
  const toys: RoadToy[] = [];
  const drives: Drive[] = [];
  for (let i = 0; i < count; i++) {
    const end = (i + 1) * unit;
    const land = end - driveMs - pause;
    const start = land - hopMs;
    const x = roadToyX(i, count);
    // It waits its turn from the car's last arrival (or the start), wiggling once a second.
    const since = i * unit + 300;
    toys.push({
      kind: ROAD_KINDS[i % ROAD_KINDS.length],
      hop: {
        from: { x, y: roadY(x) + ON_ROAD },
        to: roadBoxSlot(i),
        scale: IN_BOX,
        start,
        land,
        peak: ROAD_BOX.rim - 90,
        waitFrom: start - since >= 1000 ? since : undefined,
      },
    });
    drives.push({ from: carStop(i, count), to: i + 1 < count ? carStop(i + 1, count) : CAR_HOME, start: end - driveMs, arrive: end });
  }
  return { toys, drives };
}

/** The car's transform at road position `x`, from its start: moved along the road and tilted with it. */
export function carAt(x: number): string {
  const dx = ((x - CAR_START) / CAR) * 100;
  const dy = ((roadY(x) - roadY(CAR_START)) / CAR) * 100;
  return `translate(${dx.toFixed(2)}%, ${dy.toFixed(2)}%) rotate(${roadTilt(x).toFixed(2)}deg)`;
}

/** Every this many stage units of road the car's way gets a keyframe, so it follows the curve. */
const ROAD_STEP = 30;

/** The car's keyframes: standing, then each drive along the road, setting off gently and slowing before it stops. */
export function carFrames(drives: Drive[]): Frame[] {
  const frames: Frame[] = [{ at: 0, transform: carAt(CAR_START), ease: "linear" }];
  for (const drive of drives) {
    frames.push({ at: drive.start, transform: carAt(drive.from), ease: "linear" });
    const steps = Math.max(2, Math.ceil((drive.to - drive.from) / ROAD_STEP));
    for (let s = 1; s <= steps; s++) {
      const share = s / steps;
      // Even steps of road at smoothed moments: slow at the start and the stop, as a car pulls away and brakes.
      const eased = share * share * (3 - 2 * share);
      const at = drive.start + (drive.arrive - drive.start) * eased;
      frames.push({ at, transform: carAt(drive.from + (drive.to - drive.from) * share), ease: "linear" });
    }
  }
  return frames;
}

/** The toys' hops and the car's drives as keyframes made for this run. */
function RoadKeyframes({ total, toys, drives }: { total: number; toys: RoadToy[]; drives: Drive[] }) {
  const rules = toys.flatMap((toy, i) => hopKeyframes(`tm-road-toy-${i}`, total, toy.hop, ROAD_TOY));
  rules.push(keyframes("tm-road-car", total, holdToEnd(carFrames(drives), total)));
  return <style>{rules.join("\n")}</style>;
}

/** The road's middle line from `a` to `b` as an SVG path. */
function roadPath(a: number, b: number): string {
  const points: string[] = [];
  for (let x = a; x <= b; x += 10) points.push(`${x.toFixed(0)} ${roadY(x).toFixed(1)}`);
  return `M${points.join(" L")}`;
}

/** The room – a wall with soft wallpaper and the floorboards – and the play rug lying on it; drawn once. */
const RoadBackdrop = memo(function RoadBackdrop() {
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H} className="tm-back">
      <Draw w={STAGE_W} h={STAGE_H}>
        <rect width={STAGE_W} height={WALL} fill="#e7f5ff" />
        {Array.from({ length: 27 }, (_, i) => (
          <circle key={i} cx={40 + (i % 9) * 190 + (Math.floor(i / 9) % 2) * 95} cy={70 + Math.floor(i / 9) * 110} r="10" fill="#d0ebff" />
        ))}
        <rect y={WALL} width={STAGE_W} height={STAGE_H - WALL} fill="#e2ad74" />
        {[470, 560, 670, 790].map((y) => (
          <path key={y} d={`M0 ${y} H${STAGE_W}`} stroke="#cf9558" strokeWidth="4" />
        ))}
        <rect y={WALL - 24} width={STAGE_W} height="28" fill="#fff" stroke="#c5dcef" strokeWidth="3" />
        {/* The play rug, grass green, with a dotted seam round it. */}
        <rect x="200" y="490" width="1200" height="320" rx="40" fill="#b2f2bb" stroke="#69db7c" strokeWidth="8" />
        <rect x="224" y="512" width="1152" height="276" rx="30" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="18 14" />
        {/* Little trees and a pond printed on the rug beside the road. */}
        {[
          [330, 560],
          [610, 770],
          [960, 560],
          [1250, 770],
        ].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="22" fill="#51cf66" stroke="#2b8a3e" strokeWidth="4" />
            <circle cx={x - 8} cy={y - 6} r="7" fill="#8ce99a" />
          </g>
        ))}
        <ellipse cx="760" cy="560" rx="54" ry="22" fill="#74c0fc" stroke="#1c7ed6" strokeWidth="4" />
        {/* The box's dark inside, behind the toys landing in it. */}
        <path
          d={`M${ROAD_BOX.x} ${ROAD_BOX.rim} L${ROAD_BOX.x + 16} ${ROAD_BOX.rim - OPENING} H${ROAD_BOX.x + ROAD_BOX.w - 16} L${ROAD_BOX.x + ROAD_BOX.w} ${ROAD_BOX.rim} Z`}
          fill="#7a3e10"
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </Draw>
    </Layer>
  );
});

/**
 * The road and its goal, kept bright from afar (it is the way the time goes): grey with a white dashed middle, a start
 * line where the car stands, and the toy house at its end with a chequered flag on its roof; drawn once.
 */
const RoadWay = memo(function RoadWay() {
  const d = roadPath(ROAD.x0 - 60, HOUSE.x + 20);
  const startY = roadY(CAR_START);
  const h = HOUSE;
  const roofTop = h.top;
  const wallTop = h.top + 70;
  return (
    <Layer x={0} y={0} w={STAGE_W} h={STAGE_H}>
      <Draw w={STAGE_W} h={STAGE_H}>
        <path d={d} fill="none" stroke={INK} strokeWidth={ROAD.w + 12} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#868e96" strokeWidth={ROAD.w} strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="26 22" strokeLinecap="round" />
        {/* The start line, chequered, behind the car. */}
        {[0, 1, 2, 3].map((n) => (
          <rect key={n} x={CAR_START - CAR / 2 - 22} y={startY - ROAD.w / 2 + n * (ROAD.w / 4)} width="14" height={ROAD.w / 4} fill={n % 2 ? "#fff" : INK} />
        ))}
        {/* The toy house at the road's end: walls, a red roof, a door the road leads to, a window. */}
        <rect x={h.x} y={wallTop} width={h.w} height={h.foot - wallTop} rx="6" fill="#fff4e6" stroke={INK} strokeWidth="6" />
        <path
          d={`M${h.x - 14} ${wallTop + 4} L${h.x + h.w / 2} ${roofTop} L${h.x + h.w + 14} ${wallTop + 4} Z`}
          fill="#fa5252"
          stroke={INK}
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <rect x={h.x + 18} y={h.foot - 64} width="40" height="64" rx="8" fill="#e8590c" stroke={INK} strokeWidth="5" />
        <rect x={h.x + 78} y={wallTop + 24} width="40" height="36" rx="5" fill="#ffe066" stroke={INK} strokeWidth="5" />
        {/* The chequered flag on the roof: the goal, seen from the start. */}
        <path d={`M${h.x + h.w / 2} ${roofTop + 4} V${roofTop - 74}`} stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <rect x={h.x + h.w / 2 + 2} y={roofTop - 74} width="56" height="38" fill="#fff" stroke={INK} strokeWidth="4" />
        <rect x={h.x + h.w / 2 + 2} y={roofTop - 74} width="28" height="19" fill={INK} />
        <rect x={h.x + h.w / 2 + 30} y={roofTop - 55} width="28" height="19" fill={INK} />
      </Draw>
    </Layer>
  );
});

/** The toy box's front, over the toys in it: a wooden box with a lighter rim and a painted star; drawn once. */
const RoadBoxFront = memo(function RoadBoxFront() {
  const h = ROAD_BOX.bottom - ROAD_BOX.rim + 6;
  return (
    <Layer x={ROAD_BOX.x} y={ROAD_BOX.rim - 4} w={ROAD_BOX.w} h={h}>
      <Draw w={ROAD_BOX.w} h={h}>
        <rect x="3" y="6" width={ROAD_BOX.w - 6} height={h - 9} rx="12" fill="#e8892b" stroke={INK} strokeWidth="6" />
        {[42, 84].map((y) => (
          <path key={y} d={`M10 ${y} H${ROAD_BOX.w - 10}`} stroke="#c06414" strokeWidth="4" />
        ))}
        <rect x="0" y="0" width={ROAD_BOX.w} height="22" rx="10" fill="#ffa94d" stroke={INK} strokeWidth="6" />
        <path
          d={`M${ROAD_BOX.w / 2} 46 l9 18 20 3 -14 14 3 20 -18 -9 -18 9 3 -20 -14 -14 20 -3 Z`}
          fill="#ffe066"
          stroke={INK}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </Draw>
    </Layer>
  );
});

/** The little car on its drives, its foot's middle at the start line; it tilts with the road round its foot. */
const RoadCar = memo(function RoadCar({ drives }: { drives: Drive[] }) {
  const end = carAt(drives.at(-1)?.to ?? CAR_START);
  return (
    <Layer
      x={CAR_START - CAR / 2}
      y={roadY(CAR_START) + ON_ROAD - CAR}
      w={CAR}
      h={CAR}
      className="tm-hop tm-road-car"
      style={{ "--tm-anim": "tm-road-car", "--tm-end": end } as CSSProperties}
    >
      <ToyArt kind="car" />
    </Layer>
  );
});

/** The toys on the road, each on its hop; while it lies there a tap lights it (H-51: what is left). */
const RoadToys = memo(function RoadToys({ toys, glow }: { toys: RoadToy[]; glow: number }) {
  return (
    <>
      {toys.map((toy, i) => (
        <Hopper key={i} name={`tm-road-toy-${i}`} hop={toy.hop} size={ROAD_TOY} extra={<LeftGlow n={glow} />}>
          <ToyArt kind={toy.kind} />
        </Hopper>
      ))}
    </>
  );
});

/** The whole picture: the room and rug, the road and house, the car, the toys and the box's front over those in it. */
export function RoadScene({ count, total, glow }: { count: number; total: number; glow: number }) {
  // Worked out once for the run, so the memoised parts are not drawn again when a tap lights the toys.
  const { toys, drives } = useMemo(() => roadPlan(total, count), [total, count]);
  return (
    <>
      <RoadBackdrop />
      <RoadWay />
      <RoadKeyframes total={total} toys={toys} drives={drives} />
      <RoadCar drives={drives} />
      <RoadToys toys={toys} glow={glow} />
      <RoadBoxFront />
    </>
  );
}
