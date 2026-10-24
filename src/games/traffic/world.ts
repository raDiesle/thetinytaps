// The street of "Ampel und Zebrastreifen" without the drawing: where the animals and cars
// are and how they move. TrafficPlay calls toggle() on a tap and step() every frame while
// something moves. Plain objects and pure rules, so the tests can play it through.

/** The picture's size in SVG units. */
export const VIEW_W = 1000;
export const VIEW_H = 700;

/** The street runs on this far past the picture's left and right edge, for wide screens; cars come and go out there. */
export const EDGE = 400;

/** The road between the two pavements. */
export const ROAD_TOP = 230;
export const ROAD_BOTTOM = 430;

/** The zebra crossing. */
export const ZEBRA_L = 400;
export const ZEBRA_R = 600;

/** Where the wheels of each lane touch the road: lane 0 is in front and drives right, lane 1 behind and drives left. */
export const LANE_Y = [420, 320] as const;

/** The car fronts stop here while the cars' light is red: just before the zebra. */
export const STOP_X = [380, 620] as const;

/** Where the animals stand on each pavement (their feet). */
export const SIDE_Y = { near: 580, far: 214 } as const;

/** Each animal walks straight across in its own track. */
export const SLOT_X = [432, 478, 524, 570];

/** How long the cars' light is amber (or red and amber) before the walkers' light changes. */
export const AMBER_MS = 1200;

/** A new tap changes the light only after the last change has been seen for this long. */
export const MIN_PHASE_MS = 1000;

const CAR_SPEED = 280; // px per second
const CAR_ACCEL = 420; // px per second²
/** Braking: the speed is at most this many times the distance left, so cars glide to a stop. */
const BRAKE = 3;
/** Space between two cars waiting in a row. */
const CAR_GAP = 30;
const WALK_SPEED = 120;
/** After the light has turned red, animals still on the road hurry. */
const HURRY = 1.7;
/** One animal after the other steps onto the zebra. */
const WALK_STAGGER_MS = 350;
/** The "tick tick" of the walkers' green light. */
const TICK_MS = 600;
/** The duck forgets to look at every third red light, starting with the first. */
const DUCK_EVERY = 3;
/** From the red light until the duck is called back: the cars get green meanwhile and have to wait for it. */
const DUCK_OUT_MS = 2000;
/** The duck looks left and right this long once it is back. */
const DUCK_LOOK_MS = 1400;

export type AnimalId = "ente" | "hase" | "baer" | "schwein";
export type Side = "near" | "far";
export type CarKind = "auto" | "bus";

/**
 * The light for the walkers, and the cars' light with it:
 * stop = walkers red, cars green; toWalk = cars amber; walk = walkers green, cars red; toStop = cars red and amber.
 */
export type Phase = "stop" | "toWalk" | "walk" | "toStop";

export interface Animal {
  id: AnimalId;
  /** Its track across the zebra; it never changes. */
  x: number;
  /** Where its feet are, and where it walks to. */
  y: number;
  ty: number;
  /** The pavement it stands on, or walks to. */
  side: Side;
  /** Waits this many ms before it starts walking. */
  wait: number;
}

export interface Car {
  /** Counts up; keys the drawing and picks the colour. */
  n: number;
  kind: CarKind;
  lane: 0 | 1;
  /** The front bumper. */
  x: number;
  /** Speed in px per second. */
  v: number;
}

/** The duck that forgets to look: steps onto the road, is called back, comes back and looks left and right. */
export interface DuckTrick {
  stage: "out" | "called" | "look";
  /** Time in this stage. */
  t: number;
}

export interface World {
  phase: Phase;
  /** Time in this phase. */
  phaseT: number;
  /** How often the walkers' light has turned red; picks when the duck forgets to look. */
  reds: number;
  animals: Animal[];
  cars: Car[];
  nextCar: number;
  duck: DuckTrick | null;
  /** The duck's trick is played at all (a setting). */
  duckOn: boolean;
  /** Time since the last tick of the green light. */
  tickT: number;
}

/** Something to hear or say, from a toggle or a step. */
export type TrafficEvent =
  | { type: "change" }
  | { type: "walk" }
  | { type: "stop" }
  | { type: "tick" }
  | { type: "start"; id: AnimalId }
  | { type: "arrive"; id: AnimalId }
  | { type: "duckOut" }
  | { type: "call" }
  | { type: "look" }
  | { type: "thanks" };

/** The order the animals stand in, left to right. */
export const ANIMALS: AnimalId[] = ["baer", "ente", "hase", "schwein"];

export const CAR_LENGTH: Record<CarKind, number> = { auto: 150, bus: 250 };

/** The cars come in this order, again and again. */
const CAR_KINDS: CarKind[] = ["auto", "auto", "bus", "auto", "auto"];

const dir = (lane: 0 | 1) => (lane === 0 ? 1 : -1);

/** Everyone on the near pavement, no cars yet, the walkers' light red. */
export function createWorld(duckOn = true): World {
  return {
    phase: "stop",
    phaseT: MIN_PHASE_MS,
    reds: 0,
    animals: ANIMALS.map((id, i) => ({ id, x: SLOT_X[i], y: SIDE_Y.near, ty: SIDE_Y.near, side: "near", wait: 0 })),
    cars: [],
    nextCar: 0,
    duck: null,
    duckOn,
    tickT: 0,
  };
}

const onRoad = (y: number) => y > ROAD_TOP - 12 && y < ROAD_BOTTOM + 12;

/** An animal on the road, or one that has set off towards it. */
const crossing = (a: Animal) => onRoad(a.y) || (a.y !== a.ty && a.wait <= 0);

/** A car's body is on the zebra. */
const onZebra = (c: Car) => {
  const back = c.x - dir(c.lane) * CAR_LENGTH[c.kind];
  return Math.max(c.x, back) > ZEBRA_L - 10 && Math.min(c.x, back) < ZEBRA_R + 10;
};

/** The car's front has passed its stop line, so it drives on whatever the light. */
const passed = (c: Car) => dir(c.lane) * (c.x - STOP_X[c.lane]) > 1;

/** Cars are allowed over the zebra: their light is green and nobody is on it. */
export const roadFree = (w: World) => w.phase === "stop" && !w.animals.some(crossing);

/** Something still moves or is about to, so the frames must go on. */
export function busy(w: World) {
  if (w.phase === "toWalk" || w.phase === "toStop" || w.duck) return true;
  if (w.animals.some((a) => a.y !== a.ty)) return true;
  return w.cars.some((c) => c.v > 1 || passed(c) || roadFree(w));
}

/** The next car in front in the same lane, if any. */
function carAhead(w: World, c: Car) {
  const d = dir(c.lane);
  let best: Car | null = null;
  for (const o of w.cars) {
    if (o === c || o.lane !== c.lane || d * (o.x - c.x) <= 0) continue;
    if (!best || d * (o.x - best.x) < 0) best = o;
  }
  return best;
}

/** A new car behind the last one of its lane, outside the picture. */
function addCar(w: World, lane: 0 | 1) {
  const d = dir(lane);
  const kind = CAR_KINDS[w.nextCar % CAR_KINDS.length];
  let x = d > 0 ? -EDGE : VIEW_W + EDGE;
  for (const c of w.cars) {
    if (c.lane !== lane) continue;
    const behind = c.x - d * (CAR_LENGTH[c.kind] + 120);
    x = d > 0 ? Math.min(x, behind) : Math.max(x, behind);
  }
  w.cars.push({ n: w.nextCar++, kind, lane, x, v: CAR_SPEED });
}

/** Cars come along, but never more than three waiting in a lane. */
function addCars(w: World, perLane: [number, number]) {
  for (const lane of [0, 1] as const) {
    const waiting = w.cars.filter((c) => c.lane === lane && !passed(c)).length;
    for (let i = 0; i < Math.min(perLane[lane], 3 - waiting); i++) addCar(w, lane);
  }
}

/** A tap: the light starts to change, unless it just did; no events if it doesn't. */
export function toggle(w: World): TrafficEvent[] {
  if (w.phaseT < MIN_PHASE_MS) return [];
  if (w.phase === "stop") {
    w.phase = "toWalk";
    w.phaseT = 0;
    // A car comes to each lane and has to wait at the red light.
    addCars(w, [1, 1]);
    return [{ type: "change" }];
  }
  if (w.phase === "walk") {
    w.phase = "toStop";
    w.phaseT = 0;
    // Who hasn't set off yet stays where it is.
    for (const a of w.animals) {
      if (a.wait > 0) {
        a.wait = 0;
        a.ty = a.y;
        a.side = a.side === "near" ? "far" : "near";
      }
    }
    const events: TrafficEvent[] = [{ type: "change" }];
    forgetToLook(w, events);
    return events;
  }
  return [];
}

/** The walkers' light has turned green: everyone crosses to the other side, one after the other. */
function startWalking(w: World, events: TrafficEvent[]) {
  w.duck = null;
  w.tickT = 0;
  w.animals.forEach((a, i) => {
    a.side = a.side === "near" ? "far" : "near";
    a.ty = SIDE_Y[a.side];
    a.wait = i * WALK_STAGGER_MS;
    if (i === 0) events.push({ type: "start", id: a.id });
  });
}

/**
 * The walkers' light has just turned red: now and then the duck walks off anyway, before the
 * cars get green, so they wait for it.
 */
function forgetToLook(w: World, events: TrafficEvent[]) {
  w.reds++;
  const duck = w.animals.find((a) => a.id === "ente");
  if (w.duckOn && duck && !w.animals.some((a) => a.y !== a.ty) && (w.reds - 1) % DUCK_EVERY === 0) {
    duck.ty = duck.side === "near" ? ROAD_BOTTOM - 22 : ROAD_TOP + 36;
    duck.wait = 400;
    w.duck = { stage: "out", t: 0 };
    events.push({ type: "duckOut" });
  }
}

/** The cars' light has turned green: more cars come. */
function startDriving(w: World) {
  addCars(w, [2, 1]);
}

function moveAnimals(w: World, dt: number, events: TrafficEvent[]) {
  const zebraBlocked = w.cars.some(onZebra);
  for (const a of w.animals) {
    // The duck dawdles onto the road and back; the others hurry once it is red.
    const duck = a.id === "ente";
    const speed = (w.phase === "walk" || (duck && w.duck) ? WALK_SPEED : WALK_SPEED * HURRY) / 1000;
    if (a.y === a.ty) continue;
    if (a.wait > 0) {
      a.wait -= dt;
      if (a.wait > 0) continue;
      a.wait = 0;
      events.push({ type: "start", id: a.id });
    }
    // Nobody steps onto the road while a car is still on the zebra.
    if (zebraBlocked && !onRoad(a.y) && onRoad(a.y + Math.sign(a.ty - a.y) * 20)) continue;
    const step = speed * dt * (duck ? 0.85 : 1);
    a.y = Math.abs(a.ty - a.y) <= step ? a.ty : a.y + Math.sign(a.ty - a.y) * step;
    if (a.y === a.ty && !w.duck) events.push({ type: "arrive", id: a.id });
  }
}

function moveCars(w: World, dt: number) {
  const free = roadFree(w);
  const s = dt / 1000;
  for (const c of w.cars) {
    const d = dir(c.lane);
    // Measured along the lane, so both directions work alike.
    const p = d * c.x;
    let limit = Infinity;
    if (!passed(c) && !free) limit = d * STOP_X[c.lane];
    const ahead = carAhead(w, c);
    if (ahead) limit = Math.min(limit, d * ahead.x - CAR_LENGTH[ahead.kind] - CAR_GAP);
    c.v = Math.max(0, Math.min(c.v + CAR_ACCEL * s, CAR_SPEED, (limit - p) * BRAKE));
    c.x = d * Math.min(p + c.v * s, limit);
  }
  w.cars = w.cars.filter((c) => {
    const back = c.x - dir(c.lane) * CAR_LENGTH[c.kind];
    return dir(c.lane) > 0 ? back < VIEW_W + EDGE : back > -EDGE;
  });
}

function moveDuck(w: World, dt: number, events: TrafficEvent[]) {
  const trick = w.duck;
  const duck = w.animals.find((a) => a.id === "ente");
  if (!trick || !duck) return;
  trick.t += dt;
  if (trick.stage === "out" && duck.y === duck.ty && trick.t > DUCK_OUT_MS) {
    duck.ty = SIDE_Y[duck.side];
    w.duck = { stage: "called", t: 0 };
    events.push({ type: "call" });
  } else if (trick.stage === "called" && duck.y === duck.ty) {
    w.duck = { stage: "look", t: 0 };
    events.push({ type: "look" });
  } else if (trick.stage === "look" && trick.t > DUCK_LOOK_MS) {
    w.duck = null;
    events.push({ type: "thanks" });
  }
}

/** The duck is tapped while it stands on the road: it is called back at once. */
export function callDuck(w: World): TrafficEvent[] {
  const duck = w.animals.find((a) => a.id === "ente");
  if (w.duck?.stage !== "out" || !duck) return [];
  duck.wait = 0;
  duck.ty = SIDE_Y[duck.side];
  w.duck = { stage: "called", t: 0 };
  return [{ type: "call" }];
}

/** Moves everything on by `dt` ms; returns what happened. */
export function step(w: World, dt: number): TrafficEvent[] {
  const events: TrafficEvent[] = [];
  w.phaseT += dt;
  if (w.phase === "toWalk" && w.phaseT >= AMBER_MS) {
    w.phase = "walk";
    w.phaseT = 0;
    events.push({ type: "walk" });
    startWalking(w, events);
  } else if (w.phase === "toStop" && w.phaseT >= AMBER_MS) {
    w.phase = "stop";
    w.phaseT = 0;
    events.push({ type: "stop" });
    startDriving(w);
  }
  moveAnimals(w, dt, events);
  moveCars(w, dt);
  moveDuck(w, dt, events);
  if (w.phase === "walk" && w.animals.some((a) => a.y !== a.ty)) {
    w.tickT += dt;
    if (w.tickT >= TICK_MS) {
      w.tickT -= TICK_MS;
      events.push({ type: "tick" });
    }
  }
  return events;
}
