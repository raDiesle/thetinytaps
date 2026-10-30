import { useEffect, useId, useImperativeHandle, useReducer, useRef, type ComponentType, type PointerEvent as ReactPointerEvent, type Ref } from "react";
import "./lanes.css";
import {
  addPoint,
  bendTo,
  KEY_START,
  LANE_KINDS,
  LANE_SPEED,
  laneD,
  laneLength,
  MAX_LANES,
  MIN_LANE,
  PICK_REACH,
  poseAt,
  vehicleScale,
  vehicleTransform,
  WAKE_REACH,
  type LaneKind,
  type Point,
} from "./lanes";
import { playSound } from "./sounds";
import { itemsNear, type SceneItem } from "./types";

// "Straße malen" (idea N-43), drawn over the picture: the roads the child draws and the vehicles driving on them.
// An HTML layer of its own above the picture's svg, so a moving vehicle never repaints the big drawing.

/** A drawn road; `drawing` while the finger is still on it, so its vehicle waits at the end instead of honking. */
interface Lane {
  id: number;
  kind: LaneKind;
  points: Point[];
  length: number;
  drawing: boolean;
}

/** A vehicle on its road: how far along, whether it still drives, and the items it is passing right now. */
interface Vehicle {
  kind: LaneKind;
  lane: Lane;
  s: number;
  driving: boolean;
  /** When it got its road; when all three are out, the one that has had its road longest takes the next. */
  since: number;
  /** Counts its honks, so the hop starts again with each one. */
  honks: number;
  pose: { x: number; y: number; angle: number };
  near: Set<string>;
}

/** What ScenePlay can ask of the layer: a key press sends a vehicle to the item of that key. */
export interface LaneControl {
  driveTo: (to: Point) => void;
}

const DRIVE_SOUND = "engine";
const HONK: Record<LaneKind, "honk" | "train"> = { car: "honk", tractor: "honk", train: "train" };

/**
 * The roads and vehicles over the picture. Pointers are read on the picture itself (the layer's parent) without
 * stopping them, so a tap still does what it does in "Freies Entdecken"; only a line longer than a tap becomes a road.
 * `onPass` wakes an item a vehicle drives past.
 */
export function LaneLayer({
  width,
  height,
  items,
  sounds,
  onPass,
  ref,
}: {
  width: number;
  height: number;
  items: readonly SceneItem[];
  sounds: boolean;
  onPass: (item: SceneItem) => void;
  ref?: Ref<LaneControl>;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const world = useRef({ lanes: [] as Lane[], vehicles: [] as Vehicle[], nextLane: 0, turn: 0 });
  /** The line under the finger: its pointer and the lane it becomes, put into the picture once it is long enough. */
  const pen = useRef<{ pointerId: number; lane: Lane; shown: boolean } | null>(null);
  const [, render] = useReducer((n: number) => n + 1, 0);
  const frame = useRef(0);
  const props = useRef({ items, sounds, onPass });
  props.current = { items, sounds, onPass };
  const maskId = `lane-${useId().replace(/[^\w-]/g, "")}`;

  const sound = (name: Parameters<typeof playSound>[0]) => props.current.sounds && playSound(name);

  const honk = (vehicle: Vehicle) => {
    vehicle.honks++;
    sound(HONK[vehicle.kind]);
  };

  /** Moves every driving vehicle on, wakes what it passes, and honks at the end of a finished road. */
  const tick = (now: number, last: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    let busy = false;
    for (const vehicle of world.current.vehicles) {
      if (!vehicle.driving) continue;
      const { lane } = vehicle;
      vehicle.s = Math.min(lane.length, vehicle.s + LANE_SPEED * dt);
      vehicle.pose = poseAt(lane.points, vehicle.s);
      // Its middle, a little above the road, is what comes close to the items.
      const near = itemsNear(props.current.items, vehicle.pose.x, vehicle.pose.y - 30 * vehicleScale(vehicle.pose.y), WAKE_REACH);
      for (const item of near) if (!vehicle.near.has(item.id)) props.current.onPass(item);
      vehicle.near = new Set(near.map((item) => item.id));
      if (vehicle.s < lane.length || lane.drawing) busy = true;
      else {
        vehicle.driving = false;
        honk(vehicle);
      }
    }
    render();
    frame.current = busy ? requestAnimationFrame((next) => tick(next, now)) : 0;
  };

  const run = () => {
    if (!frame.current) frame.current = requestAnimationFrame((now) => tick(now, now));
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  /** The road goes into the picture, and a vehicle takes it: a waiting one near its start, else the next one in turn. */
  const startLane = (lane: Lane) => {
    const { vehicles } = world.current;
    const [sx, sy] = lane.points[0];
    const distance = (v: Vehicle) => Math.hypot(v.pose.x - sx, v.pose.y - sy);
    const waiting = vehicles.filter((v) => !v.driving && distance(v) < PICK_REACH).sort((a, b) => distance(a) - distance(b));
    let vehicle = waiting[0];
    if (!vehicle) {
      const free = LANE_KINDS.filter((kind) => !vehicles.some((v) => v.kind === kind));
      if (free.length) {
        // The kinds take turns: car, tractor, train.
        const kind = LANE_KINDS.map((_, i) => LANE_KINDS[(world.current.turn + i) % LANE_KINDS.length]).find((k) => free.includes(k))!;
        world.current.turn = LANE_KINDS.indexOf(kind) + 1;
        vehicle = { kind, lane, s: 0, driving: true, since: 0, honks: 0, pose: poseAt(lane.points, 0), near: new Set() };
        vehicles.push(vehicle);
      } else vehicle = vehicles.reduce((a, b) => (b.since < a.since ? b : a));
    }
    Object.assign(vehicle, { lane, s: 0, driving: true, since: performance.now(), pose: poseAt(lane.points, 0), near: new Set() });
    lane.kind = vehicle.kind;
    const { lanes } = world.current;
    lanes.push(lane);
    // Old roads go, but never one a vehicle still drives on.
    while (lanes.length > MAX_LANES) {
      const old = lanes.findIndex((l) => !vehicles.some((v) => v.driving && v.lane === l));
      if (old < 0) break;
      lanes.splice(old, 1);
    }
    sound(DRIVE_SOUND);
    run();
  };

  const newLane = (points: Point[], drawing: boolean): Lane => ({
    id: world.current.nextLane++,
    kind: "car",
    points,
    length: laneLength(points),
    drawing,
  });

  useImperativeHandle(ref, () => ({
    driveTo: (to) => {
      // From where the last vehicle waits, else from the bottom middle.
      const waiting = world.current.vehicles.filter((v) => !v.driving).sort((a, b) => b.since - a.since)[0];
      const from: Point = waiting ? [waiting.pose.x, waiting.pose.y] : KEY_START;
      if (Math.hypot(to[0] - from[0], to[1] - from[1]) < MIN_LANE) {
        if (waiting) honk(waiting);
        render();
        return;
      }
      startLane(newLane(bendTo(from, to), false));
    },
  }));

  useEffect(() => {
    const picture = layerRef.current?.parentElement;
    if (!picture) return;
    const toPicture = (e: PointerEvent): Point | null => {
      const matrix = svgRef.current?.getScreenCTM();
      if (!matrix) return null;
      const { x, y } = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
      return [Math.min(width, Math.max(0, x)), Math.min(height, Math.max(0, y))];
    };
    const down = (e: PointerEvent) => {
      if (pen.current || e.button > 0) return;
      // Buttons (⌨️, the end's „Nochmal“) keep their taps.
      if (e.target instanceof Element && e.target.closest("button, a, [data-tap-root]")) return;
      const p = toPicture(e);
      if (p) pen.current = { pointerId: e.pointerId, lane: newLane([p], true), shown: false };
    };
    const move = (e: PointerEvent) => {
      const line = pen.current;
      if (!line || line.pointerId !== e.pointerId) return;
      const p = toPicture(e);
      const points = p && addPoint(line.lane.points, p);
      if (!points || points === line.lane.points) return;
      line.lane.points = points;
      line.lane.length = laneLength(points);
      if (!line.shown && line.lane.length >= MIN_LANE) {
        line.shown = true;
        startLane(line.lane);
      }
      if (line.shown) {
        render();
        run();
      }
    };
    const up = (e: PointerEvent) => {
      const line = pen.current;
      if (!line || line.pointerId !== e.pointerId) return;
      pen.current = null;
      line.lane.drawing = false;
      if (line.shown) run();
    };
    picture.addEventListener("pointerdown", down, { capture: true });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      picture.removeEventListener("pointerdown", down, { capture: true });
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [width, height]);

  /** A tap on a vehicle makes it honk and hop; a line drawn from it is its next road. */
  const tapVehicle = (vehicle: Vehicle, e: ReactPointerEvent) => {
    e.stopPropagation();
    if (vehicle.driving) return;
    honk(vehicle);
    render();
  };

  const { lanes, vehicles } = world.current;
  return (
    <div ref={layerRef} className="lane-layer">
      <svg ref={svgRef} className="lane-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <g aria-hidden>
          {lanes.map((lane) => (
            <LaneRoad key={lane.id} lane={lane} maskId={`${maskId}-${lane.id}`} width={width} height={height} />
          ))}
        </g>
        {vehicles.map((vehicle) => {
          const Art = VEHICLES[vehicle.kind];
          return (
            <g key={vehicle.kind} className="lane-vehicle" transform={vehicleTransform(vehicle.pose)} data-tap="" onPointerDown={(e) => tapVehicle(vehicle, e)}>
              <g key={vehicle.honks} className={vehicle.honks ? "lane-honk" : undefined}>
                <g className={vehicle.driving ? "lane-art lane-driving" : "lane-art"}>
                  <Art />
                </g>
                <rect className="scene-hit" data-tap-area x={-86} y={-112} width={172} height={114} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** One road, by what drives on it: asphalt with a dashed middle line, a dirt track, or rails on sleepers. */
function LaneRoad({ lane, maskId, width, height }: { lane: Lane; maskId: string; width: number; height: number }) {
  const d = laneD(lane.points);
  if (lane.kind === "train")
    return (
      <g className="lane-road lane-rails">
        <mask id={maskId} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
          <path d={d} stroke="#fff" strokeWidth={34} />
          <path d={d} stroke="#000" strokeWidth={22} />
        </mask>
        <path className="lane-bed" d={d} />
        <path className="lane-sleepers" d={d} />
        <path className="lane-rail" d={d} mask={`url(#${maskId})`} />
      </g>
    );
  return (
    <g className={`lane-road lane-${lane.kind === "car" ? "asphalt" : "track"}`}>
      <path className="lane-edge" d={d} />
      <path className="lane-top" d={d} />
      <path className="lane-mark" d={d} />
    </g>
  );
}

/** A wheel at (x, y) with radius r; its hub has a spoke, so it can be seen turning. */
function Wheel({ x, y, r, hub = "#dee2e6" }: { x: number; y: number; r: number; hub?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="lane-wheel">
        <circle r={r} fill="#3d405b" />
        <circle r={r * 0.5} fill={hub} />
        <path d={`M${-r * 0.5} 0 H${r * 0.5}`} />
      </g>
    </g>
  );
}

/** A small red car, facing right, standing on its origin. */
function Car() {
  return (
    <>
      <path d="M-72 -16 V-34 Q-72 -44 -60 -46 L-36 -48 L-20 -72 Q-16 -76 -8 -76 H30 Q38 -76 42 -70 L56 -48 L66 -46 Q76 -44 76 -32 V-16 Z" fill="#e63946" />
      <path d="M-28 -48 L-14 -68 H6 V-48 Z" fill="#a8dadc" />
      <path d="M14 -48 V-68 H30 Q34 -68 36 -64 L46 -48 Z" fill="#a8dadc" />
      <circle cx={69} cy={-36} r={5} fill="#ffd60a" />
      <Wheel x={-42} y={-16} r={16} />
      <Wheel x={44} y={-16} r={16} />
    </>
  );
}

/** A green tractor with a big back wheel, facing right. */
function Tractor() {
  return (
    <>
      <rect x={28} y={-84} width={7} height={26} fill="#6c757d" />
      <path d="M-8 -60 H56 Q66 -60 66 -50 V-28 H-8 Z" fill="#52b788" />
      <path d="M-62 -40 V-104 H-12 L-6 -40 Z" fill="#52b788" />
      <path d="M-54 -66 V-96 H-18 L-14 -66 Z" fill="#a8dadc" />
      <rect x={-70} y={-112} width={66} height={10} rx={3} fill="#2d6a4f" />
      <Wheel x={-36} y={-32} r={32} hub="#ffd60a" />
      <Wheel x={46} y={-18} r={18} hub="#ffd60a" />
    </>
  );
}

/** A little steam engine, facing right. */
function Train() {
  return (
    <>
      <path d="M34 -76 L30 -102 H50 L46 -76 Z" fill="#3d405b" />
      <rect x={-30} y={-76} width={96} height={46} rx={14} fill="#457b9d" />
      <rect x={0} y={-86} width={20} height={12} rx={6} fill="#ffd60a" />
      <rect x={-78} y={-96} width={52} height={66} rx={4} fill="#e63946" />
      <rect x={-68} y={-86} width={32} height={24} rx={3} fill="#a8dadc" />
      <rect x={-84} y={-106} width={64} height={11} rx={3} fill="#3d405b" />
      <rect x={-82} y={-34} width={156} height={10} rx={3} fill="#3d405b" />
      <path d="M70 -30 L88 -2 H66 Z" fill="#ffd60a" />
      <Wheel x={-54} y={-14} r={14} />
      <Wheel x={-16} y={-14} r={14} />
      <Wheel x={24} y={-14} r={14} />
    </>
  );
}

const VEHICLES: Record<LaneKind, ComponentType> = { car: Car, tractor: Tractor, train: Train };
