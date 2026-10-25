import { useId, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { BRIGHT_COLORS } from "@/components/Bursts";
import { useAnyKey, useFrames, VIEW_H, VIEW_W, wobble } from "@/games/marbles/level";
import { Ball, BAR_COLORS, type BallLook, Rail, STAR_POINTS } from "@/games/marbles/parts";
import { BALL_R, type Pt } from "@/games/marbles/path";
import {
  playBells,
  playBlub,
  playBoing,
  playChime,
  playChimeNote,
  playCountNote,
  playDeepNote,
  playDing,
  playDrumNote,
  playKnock,
  playPlop,
  playPop,
  playRumble,
  playSqueak,
  playSwirl,
  playThump,
  playTick,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import {
  BARS,
  BASKET,
  BASKET_FULL,
  BASKET_SLOTS,
  bellIn,
  buildRoutes,
  CHIME_BEAM,
  CHIMES,
  DEFAULT_BUILD,
  DRUMS,
  funnelIn,
  HOPPER,
  LEDGE,
  LOOP,
  LOOP_OUT,
  PIECES,
  pointAt,
  ROW1A,
  ROW1B,
  ROW2,
  ROW2B,
  ROW3,
  ROW4,
  ROW4B,
  ROW5,
  ROW5B,
  ROW6,
  ROW7,
  ROW8,
  ROW9,
  ROLLER,
  ROLLERS,
  rowY,
  SEESAW,
  seesawSpot,
  SHELF,
  shelfSpot,
  slotBoard,
  slotMiddle,
  SLOTS,
  TRACK_H,
  trampolineIn,
  TUNNEL,
  TURNS,
  turnSide,
  wheelIn,
  ZIGS,
  type Piece,
  type Roller,
  type Route,
  type Row,
  type Slot,
  type TrackEvent,
  type Turn,
} from "./track";

const GRAVITY = 1600;
const FRICTION = 0.3;
const MIN_SPEED = 280;
const MAX_SPEED = 950;
/** After the tap the hopper lets out one marble after the other, this far apart. */
const RELEASE_GAP_MS = 1400;
const LAND_MS = 380;
/** The flag springs up out of the full basket; then the level is done. */
const FLAG_MS = 500;
const DONE_AFTER_FULL_MS = 2200;
/** A thing picked from the shelf flies into the hopper first. */
const FLY_MS = 380;
/** A new thing pops up on the shelf this long after one was taken. */
const REFILL_MS = 250;
/** The soap bubble's even speed, before its pace. */
const FLOAT_SPEED = 330;
/** The tennis ball's hops on the rows: how high, and how far apart. */
const HOP_H = 34;
const HOP_LEN = 130;
/** The soap bubble bursts above the basket. */
const POP_MS = 600;
/** A tapped thing hops this high and this long, twirling, and rolls on a bit faster (K-03). */
const NUDGE_MS = 520;
const NUDGE_H = 70;
const NUDGE_BOOST = 320;
/** Just before and in the tunnel nothing hops, or it would show over the tunnel's roof. */
const NO_HOP = { x0: TUNNEL.x0 - 260, x1: TUNNEL.x1 + BALL_R };
/** A tap on the seesaw holds it tipped this long. */
const SEESAW_TAP_MS = 380;
const GLITTER_MS = 900;
/** An animal looks out over the tunnel's roof this long. */
const PEEK_MS = 1700;

/**
 * What the magic tunnel does to a marble (K-06), in turn from a random start,
 * so each one comes out different: another colour, stripes, a golden star,
 * dots, or an animal looks out. Other things keep their look; for them an
 * animal looks out.
 */
type Magic = "color" | "stripes" | "star" | "peek" | "dots";
const MAGIC: Magic[] = ["color", "stripes", "star", "peek", "dots"];
const PEEKERS = ["🐭", "🐸", "🐰", "🐱", "🐻", "🐥"];
const STAR_GOLD = "#ffd23f";

/** Sections of the run: a fixed one before every spot, the spot, and the fixed one to the basket. */
const LAST_SECTION = SLOTS.length * 2;
/** The camera keeps the lowest marble at least this far above the bottom edge, so it sees where it goes. */
const LEAD_ROOM = 260;
/** How quickly the camera catches up, per second. */
const CAMERA_PULL = 4;

const INK = "#2a1e5c";

/** What each thing sounds like as it goes into the hopper. */
const RELEASE_SOUND: Record<Roller, () => void> = {
  marble: playPop,
  tennis: playBoing,
  iron: playRumble,
  apple: () => playKnock(480),
  bubble: playBlub,
};

/**
 * How far above its path a thing is drawn: bigger things sit higher on the
 * rail, the tennis ball hops along the rows, the apple bumps a little because
 * it isn't round, and the soap bubble floats over the rail, bobbing.
 */
function lift(m: Marble, t: number): number {
  const sit = ROLLER[m.kind].r - BALL_R;
  switch (m.kind) {
    case "tennis":
      return sit + HOP_H * m.hop * Math.abs(Math.sin((m.dist * Math.PI) / HOP_LEN));
    case "apple":
      return sit + 4 * Math.abs(Math.sin(m.spin));
    case "bubble":
      return sit + 14 + 6 * Math.sin(t / 260);
    default:
      return sit;
  }
}

/** The parts in the spots, kept from one round to the next while the game is open. */
let keptBuild = DEFAULT_BUILD;

interface Marble {
  id: number;
  /** What it is; without the shelf always a marble. */
  kind: Roller;
  color: string;
  /** A marble's pattern, which the tunnel changes. */
  look: BallLook;
  /** When it was tapped and hopped (K-03). */
  nudged: number;
  /** Picked from the shelf: it flies from there into the hopper, starting at `at`. */
  fly: { from: Pt; at: number } | null;
  /** Distance rolled in all, for the tennis ball's hops. */
  dist: number;
  /** How much the tennis ball hops just now (0–1): on the rows, not in the parts. */
  hop: number;
  /** Which section of the run it is on: even ones are fixed, odd ones are the spots. */
  section: number;
  /** The part in the spot it is passing through, taken when it got there. */
  piece: Piece;
  /** Distance along the section. */
  s: number;
  v: number;
  /** The next event in the section this marble will fire. */
  next: number;
  /** Rolling turn in radians, for the stripe on the marble. */
  spin: number;
  x: number;
  y: number;
}

interface Landed {
  id: number;
  kind: Roller;
  color: string;
  look: BallLook;
  from: Pt;
  to: Pt;
  at: number;
}

/** What moves in a spot: when its part was last hit and swapped, and how its wheel turns. */
interface SpotState {
  hit: number;
  swapped: number;
  angle: number;
  spin: number;
  /** A part tapped in while a marble was inside; it goes in as soon as the marble is out. */
  pending: Piece | null;
}

/** Sparkles rising from where the wall was tapped, or where a marble leaves the tunnel. */
interface Glitter {
  id: number;
  x: number;
  y: number;
  at: number;
}

/** What the level gets from the game around it. */
export interface TrackLevelProps {
  /** Plays a sound effect, unless sounds are off. */
  sound: (play: () => void) => void;
  /** Says a line, if speech is on. */
  say: (text: string) => void;
  /** The basket is full. */
  onDone: () => void;
  /** Tapping one of the spots swaps its part. */
  rebuild: boolean;
  /** Three things to pick from at the hopper instead of six marbles in a row (K-07). */
  pick: boolean;
}

/** Times something along the way was last hit, one per thing, for its flash or swing. */
const never = (n: number) => Array.from({ length: n }, () => -Infinity);

/**
 * A long wooden marble run down a tall wall. One tap opens the hopper, and the
 * marbles come out one after the other by themselves: each rolls over a
 * xylophone, through spots that hold a bell, a funnel, a paddle wheel or a
 * trampoline, rides the seesaw, goes through the tunnel, zigzags down past
 * bumpers, loops the loop, hops over three drums, knocks the chimes and plays
 * a whole scale before it drops into the basket. The camera follows the
 * marbles down. When the basket is full a flag springs up out of it. If the
 * grown-ups allow it, tapping a spot swaps its part, and the next marble
 * takes the new way.
 *
 * With `pick` (K-07) nothing comes out by itself: three big things lie on a
 * shelf over the first row, and tapping one lets out just that one. Each rolls
 * its own way – the tennis ball hops, the iron ball rumbles slowly with deep
 * notes, the soap bubble floats and bursts above the basket.
 *
 * The child can join in all the time: a tapped thing hops and twirls (K-03;
 * without the shelf a key hops all of them), the bars, seesaw, drums, chimes,
 * looping, tunnel, basket and – if they can't be swapped – the parts in the
 * spots sound and move when tapped, and the bare wall sparkles (K-04). Every
 * marble comes out of the tunnel changed (K-06).
 */
export function TrackLevel({ sound, say, onDone, rebuild, pick }: TrackLevelProps) {
  const routes = useMemo(buildRoutes, []);
  const build = useRef<Piece[]>(rebuild ? [...keptBuild] : [...DEFAULT_BUILD]);
  const spots = useRef<SpotState[]>(SLOTS.map(() => ({ hit: -Infinity, swapped: -Infinity, angle: 0, spin: 0, pending: null })));
  const marbles = useRef<Marble[]>([]);
  const landed = useRef<Landed[]>([]);
  const nextId = useRef(0);
  /** When the tap opened the hopper. */
  const openedAt = useRef<number | null>(null);
  const fullAt = useRef(-Infinity);
  const bars = useRef(never(BARS.length));
  const bumps = useRef(never(TURNS.length));
  const drums = useRef(never(DRUMS.length));
  const chimes = useRef(never(CHIMES.length));
  const looped = useRef(-Infinity);
  const tilt = useRef(SEESAW.rest);
  const seesawTapped = useRef(-Infinity);
  const basketTapped = useRef(-Infinity);
  const glitters = useRef<Glitter[]>([]);
  const peek = useRef({ at: -Infinity, animal: PEEKERS[0] });
  const [magicStart] = useState(() => Math.floor(Math.random() * MAGIC.length));
  /** The bar a key plays when no marble is rolling. */
  const keyBar = useRef(0);
  const svg = useRef<SVGSVGElement>(null);
  const done = useRef(false);
  const now = useRef(performance.now());
  /** The top of the view and its height, in the wall's coordinates. */
  const camera = useRef({ y: 0, h: VIEW_H });
  const box = useRef<HTMLDivElement>(null);
  /** The three things on the shelf, when each was put there, and which a key or a tap on the wall lets out next. */
  const [firstShelf] = useState(() => [...ROLLERS].sort(() => Math.random() - 0.5).slice(0, SHELF.things.length));
  const shelf = useRef(firstShelf);
  const filled = useRef(SHELF.things.map(() => -Infinity));
  const turn = useRef(0);
  const pops = useRef<{ id: number; x: number; y: number; at: number }[]>([]);
  const pegs = useId();

  const routeOf = (m: Marble): Route => (m.section % 2 ? routes.pieces[(m.section - 1) / 2][m.piece] : routes.fixed[m.section / 2]);
  const zoneAt = (route: Route, s: number) => route.zones.find((z) => s >= z.s0 && s < z.s1);

  const playBar = (i: number, t: number, kind: Roller = "marble") => {
    bars.current[i] = t;
    sound(() => (kind === "iron" ? playDeepNote(i) : playCountNote(i)));
  };

  const playDrum = (i: number, t: number) => {
    drums.current[i] = t;
    sound(() => playDrumNote(i));
  };

  const playChimeAt = (i: number, t: number) => {
    chimes.current[i] = t;
    sound(() => playChimeNote(i));
  };

  const sparkle = (x: number, y: number, t: number) => {
    glitters.current = [...glitters.current.filter((g) => t - g.at < GLITTER_MS), { id: t + Math.random(), x, y, at: t }];
  };

  const peekOut = (t: number) => {
    const others = PEEKERS.filter((a) => a !== peek.current.animal);
    peek.current = { at: t, animal: others[Math.floor(Math.random() * others.length)] };
    sound(playSqueak);
  };

  /** In the middle of the tunnel, out of sight, a marble changes; with anything else an animal looks out. */
  const magic = (m: Marble, t: number) => {
    const change = m.kind === "marble" ? MAGIC[(magicStart + m.id) % MAGIC.length] : "peek";
    if (m.kind === "marble") {
      const others = BRIGHT_COLORS.filter((c) => c !== m.color);
      m.color = change === "star" ? STAR_GOLD : others[Math.floor(Math.random() * others.length)];
      if (change === "stripes" || change === "dots" || change === "star") m.look = change;
    }
    if (change === "peek") peekOut(t);
    sparkle(TUNNEL.x1 + 20, rowY(ROW3, TUNNEL.x1) - 30, t);
    sound(playChime);
  };

  const fire = (event: TrackEvent, t: number, m: Marble) => {
    const kind = m.kind;
    switch (event.kind) {
      case "note":
        playBar(event.bar, t, kind);
        break;
      case "bell":
        spots.current[event.slot].hit = t;
        sound(playDing);
        break;
      case "trampoline":
        spots.current[event.slot].hit = t;
        sound(playBoing);
        break;
      case "funnel":
        spots.current[event.slot].hit = t;
        sound(playSwirl);
        break;
      case "wheel":
        sound(playTick);
        break;
      case "seesaw":
        sound(kind === "iron" ? playThump : playBoing);
        break;
      case "bump":
        bumps.current[event.turn] = t;
        sound(() => playKnock(520 + (event.turn % 4) * 130));
        break;
      case "loop":
        looped.current = t;
        sound(playWhoosh);
        break;
      case "drum":
        playDrum(event.drum, t);
        break;
      case "chime":
        playChimeAt(event.chime, t);
        break;
      case "tunnel":
        magic(m, t);
        break;
      case "basket":
        break;
    }
  };

  const land = (m: Marble, t: number) => {
    const slot = Math.min(landed.current.length, BASKET_SLOTS.length - 1);
    landed.current.push({ id: m.id, kind: m.kind, color: m.color, look: m.look, from: { x: m.x, y: m.y }, to: BASKET_SLOTS[slot], at: t });
    sound(m.kind === "iron" ? playThump : playPlop);
    if (!done.current && landed.current.length >= BASKET_FULL) {
      done.current = true;
      fullAt.current = t;
      sound(playBells);
      say("Der Korb ist voll!");
      setTimeout(onDone, DONE_AFTER_FULL_MS);
    }
  };

  const busy = (i: number) => marbles.current.some((m) => m.section === i * 2 + 1);

  const put = (i: number, piece: Piece, t: number) => {
    build.current[i] = piece;
    keptBuild = [...build.current];
    Object.assign(spots.current[i], { pending: null, swapped: t, hit: -Infinity, angle: 0, spin: 0 });
    sound(() => playKnock(520));
  };

  /** A tap on a spot: the next part in turn goes in, or waits until the marble inside has rolled out. */
  const swap = (i: number, e: PointerEvent) => {
    if (done.current) return;
    e.stopPropagation();
    const spot = spots.current[i];
    const next = PIECES[(PIECES.indexOf(spot.pending ?? build.current[i]) + 1) % PIECES.length];
    if (busy(i)) spot.pending = next;
    else put(i, next, performance.now());
  };

  /** Something on the run was tapped: it reacts, and the wall behind doesn't sparkle. Without the shelf the first tap still opens the hopper. */
  const tapped = (e: PointerEvent) => {
    e.stopPropagation();
    if (!pick) open();
  };

  /** A tap on a spot that can't be rebuilt plays its part, with or without a marble (K-04). */
  const playSpot = (i: number, e: PointerEvent) => {
    tapped(e);
    const spot = spots.current[i];
    spot.hit = performance.now();
    switch (build.current[i]) {
      case "bell":
        sound(playDing);
        break;
      case "trampoline":
        sound(playBoing);
        break;
      case "funnel":
        sound(playSwirl);
        break;
      case "wheel":
        spot.spin = (SLOTS[i].dir * 2.5 * 170) / wheelIn(SLOTS[i]).path;
        sound(playTick);
        break;
    }
  };

  /** A rolling thing gets a little push: a hop with a twirl, and a bit more speed (K-03). */
  const nudge = (m: Marble, t: number) => {
    if (m.fly) return;
    const nearTunnel = m.x > NO_HOP.x0 && m.x < NO_HOP.x1 && Math.abs(m.y - rowY(ROW3, m.x)) < 60;
    if (!nearTunnel) m.nudged = t;
    if (!zoneAt(routeOf(m), m.s)?.speed && !ROLLER[m.kind].float) m.v = Math.min(MAX_SPEED, m.v + NUDGE_BOOST);
    sound(playWhoosh);
  };

  /** A tap on the basket makes the things in it jump, one after the other. */
  const tapBasket = (e: PointerEvent) => {
    tapped(e);
    basketTapped.current = performance.now();
    sound(playPlop);
  };

  useFrames((dt, t) => {
    now.current = t;
    if (!pick && openedAt.current !== null && nextId.current < BASKET_FULL && t - openedAt.current >= nextId.current * RELEASE_GAP_MS) release("marble");
    const onWheel = SLOTS.map(() => false);
    let onSeesaw = false;
    for (const m of marbles.current) {
      if (m.fly) {
        const k = (t - m.fly.at) / FLY_MS;
        if (k < 1) {
          // Up out of the shelf and over into the hopper.
          m.x = m.fly.from.x + (HOPPER.x - m.fly.from.x) * k;
          m.y = m.fly.from.y + (HOPPER.y - m.fly.from.y) * k - 90 * Math.sin(Math.PI * k);
          continue;
        }
        m.fly = null;
      }
      const kind = ROLLER[m.kind];
      const zone = zoneAt(routeOf(m), m.s);
      if (zone?.speed) m.v = zone.speed;
      else if (kind.float) m.v = FLOAT_SPEED;
      else {
        const { slope } = pointAt(routeOf(m), m.s);
        m.v = Math.min(MAX_SPEED, Math.max(MIN_SPEED, m.v + (GRAVITY * slope - FRICTION * m.v) * dt));
      }
      m.s += m.v * kind.pace * dt;
      m.dist += m.v * kind.pace * dt;
      // Fire what it passed; at the end of a section go on to the next one, taking the part that is in the spot now.
      for (;;) {
        const route = routeOf(m);
        while (m.next < route.events.length && route.events[m.next].s <= m.s) fire(route.events[m.next++].event, t, m);
        if (m.s < route.total || m.section === LAST_SECTION) break;
        m.s -= route.total;
        m.section++;
        m.next = 0;
        if (m.section % 2) m.piece = build.current[(m.section - 1) / 2];
      }
      const route = routeOf(m);
      const here = zoneAt(route, m.s);
      const pt = here?.seesaw ? seesawSpot((m.s - here.s0) / (here.s1 - here.s0), tilt.current) : pointAt(route, m.s).pt;
      if (here?.seesaw) onSeesaw = true;
      else if (here?.kind === "wheel") onWheel[(m.section - 1) / 2] = true;
      m.hop += ((!here && m.section % 2 === 0 ? 1 : 0) - m.hop) * Math.min(1, dt * 10);
      m.spin += (pt.x - m.x) / kind.r;
      m.x = pt.x;
      const k = (t - m.nudged) / NUDGE_MS;
      m.y = pt.y - lift(m, t) - (k >= 0 && k < 1 ? NUDGE_H * 4 * k * (1 - k) : 0);
    }
    const arrived = marbles.current.filter((m) => m.section === LAST_SECTION && m.s >= routes.fixed[SLOTS.length].total);
    if (arrived.length) {
      marbles.current = marbles.current.filter((m) => !arrived.includes(m));
      arrived.forEach((m) => {
        // The soap bubble doesn't land: "Plopp", and it is gone.
        if (m.kind === "bubble") {
          pops.current.push({ id: m.id, x: m.x, y: m.y, at: t });
          sound(playPop);
        } else land(m, t);
      });
    }
    pops.current = pops.current.filter((p) => t - p.at < POP_MS);
    spots.current.forEach((spot, i) => {
      if (spot.pending && !busy(i)) put(i, spot.pending, t);
      // A wheel turns while a marble rides it, then slowly stops.
      const w = wheelIn(SLOTS[i]);
      spot.spin = onWheel[i] ? (SLOTS[i].dir * 170) / w.path : spot.spin * Math.exp(-dt * 1.2);
      spot.angle += spot.spin * dt;
    });
    // The seesaw tips under a marble and swings back.
    const pushed = onSeesaw || t - seesawTapped.current < SEESAW_TAP_MS;
    const target = pushed ? SEESAW.tipped : SEESAW.rest;
    tilt.current += (target - tilt.current) * Math.min(1, dt * (pushed ? 10 : 4));
    if (glitters.current.some((g) => t - g.at >= GLITTER_MS)) glitters.current = glitters.current.filter((g) => t - g.at < GLITTER_MS);
    follow(dt);
  });

  /**
   * The camera: on a tall screen it shows more of the wall. It stays in the
   * middle of the marbles on their way, but low enough for the first one to
   * see where it goes; before the tap it shows the hopper, afterwards the basket.
   */
  const follow = (dt: number) => {
    const cam = camera.current;
    const el = box.current;
    if (el && el.clientWidth) cam.h = Math.min(TRACK_H, Math.max(VIEW_H, (VIEW_W * el.clientHeight) / el.clientWidth));
    const ys = marbles.current.map((m) => m.y);
    let middle = landed.current.length ? TRACK_H : 0;
    if (ys.length) {
      const lowest = Math.max(...ys);
      middle = Math.max((Math.min(...ys) + lowest) / 2, lowest + LEAD_ROOM - cam.h / 2);
    }
    const top = Math.min(TRACK_H - cam.h, Math.max(0, middle - cam.h / 2));
    cam.y += (top - cam.y) * Math.min(1, dt * CAMERA_PULL);
    cam.y = Math.min(TRACK_H - cam.h, Math.max(0, cam.y));
  };

  /** Lets a thing into the run at the hopper, or first flies it there from the shelf. */
  const release = (kind: Roller, from?: Pt) => {
    const id = nextId.current++;
    const start = from ?? HOPPER;
    marbles.current.push({
      id,
      kind,
      color: BRIGHT_COLORS[id % BRIGHT_COLORS.length],
      look: "plain",
      nudged: -Infinity,
      fly: from ? { from, at: performance.now() } : null,
      dist: 0,
      hop: 0,
      section: 0,
      piece: build.current[0],
      s: 0,
      v: 0,
      next: 0,
      spin: 0,
      x: start.x,
      y: start.y,
    });
    sound(RELEASE_SOUND[kind]);
  };

  /** The i-th thing on the shelf goes into the hopper, and something else pops up in its place. */
  const take = (i: number) => {
    if (done.current) return;
    release(shelf.current[i], shelfSpot(i, shelf.current[i]));
    const others = shelf.current.filter((_, j) => j !== i);
    const choices = ROLLERS.filter((r) => r !== shelf.current[i] && !others.includes(r));
    shelf.current[i] = choices[Math.floor(Math.random() * choices.length)];
    filled.current[i] = performance.now();
  };

  /** A key or a tap on the wall: the hopper opens, or with the shelf the next thing on it goes in turn. */
  const open = () => {
    if (pick) take(turn.current++ % SHELF.things.length);
    else if (openedAt.current === null) openedAt.current = performance.now();
  };

  /**
   * A key: with the shelf the next thing goes in. Without it the first key
   * opens the hopper, later ones hop every rolling marble, or play the next
   * bar when none is rolling.
   */
  useAnyKey(() => {
    const t = performance.now();
    if (pick || openedAt.current === null) open();
    else if (marbles.current.length) marbles.current.forEach((m) => nudge(m, t));
    else {
      playBar(keyBar.current, t);
      keyBar.current = (keyBar.current + 1) % BARS.length;
    }
  });

  /** A tap on the bare wall does what a key does first (opens the hopper, or takes the next thing), and sparkles rise there. */
  const tapWall = (e: PointerEvent) => {
    open();
    const ctm = svg.current?.getScreenCTM();
    if (!ctm) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse());
    sparkle(p.x, p.y, performance.now());
    sound(playTwinkle);
  };

  const t = now.current;
  const started = pick ? nextId.current > 0 : openedAt.current !== null;
  const flagAge = t - fullAt.current;
  const spot = (i: number, layer: "back" | "front") => <Spot key={i} slot={SLOTS[i]} piece={build.current[i]} state={spots.current[i]} t={t} layer={layer} />;
  const cam = camera.current;
  const age = (hit: number) => (t - hit) / 1000;
  const basketAge = age(basketTapped.current);
  const tapBar = (i: number, e: PointerEvent) => {
    tapped(e);
    playBar(i, performance.now());
  };

  return (
    <div className="run-level" ref={box} onPointerDown={tapWall}>
      <svg ref={svg} className="run-svg" viewBox={`0 ${cam.y} ${VIEW_W} ${cam.h}`} preserveAspectRatio="xMidYMid meet" aria-label="Klingende Kugelbahn">
        <defs>
          <pattern id={pegs} width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="4.5" fill="#d7ac72" />
          </pattern>
        </defs>
        <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill="#f3d5a4" />
        <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${pegs})`} />

        {/* The boards the spots sit on, if they may be rebuilt */}
        {rebuild && SLOTS.map((slot, i) => <SpotBoard key={i} slot={slot} />)}

        {/* Rows 1a and 1b with the xylophone */}
        <Xylophone row={ROW1A} hits={bars.current} t={t} onTap={tapBar} />
        <Xylophone row={ROW1B} hits={bars.current} t={t} onTap={tapBar} />

        {/* The ledge, the walls the marble turns at, and the rows */}
        <Rail a={{ x: LEDGE.x0, y: LEDGE.y }} b={{ x: LEDGE.x1, y: LEDGE.y }} />
        {TURNS.map((turn, i) => (
          <Wall key={i} turn={turn} index={i} age={age(bumps.current[i])} />
        ))}
        <Rail a={{ x: ROW2.from.x + 10, y: ROW2.from.y - 1 }} b={ROW2.to} />
        <Rail a={{ x: ROW2B.from.x + 12, y: ROW2B.from.y - 1 }} b={ROW2B.to} />
        {[...ZIGS, ROW4, ROW5, ROW5B, ROW6, ROW7, ROW8].map((row, i) => (
          <Rail key={i} a={inset(row.from, row, 10)} b={row.to} />
        ))}
        <g
          onPointerDown={(e) => {
            tapped(e);
            looped.current = performance.now();
            sound(playWhoosh);
          }}
        >
          <Loop age={age(looped.current)} />
        </g>
        {DRUMS.map((_, i) => (
          <g
            key={i}
            onPointerDown={(e) => {
              tapped(e);
              playDrum(i, performance.now());
            }}
          >
            <Drum i={i} age={age(drums.current[i])} />
          </g>
        ))}
        <Chimes
          hits={chimes.current}
          t={t}
          onTap={(i, e) => {
            tapped(e);
            playChimeAt(i, performance.now());
          }}
        />
        <Xylophone row={ROW9} hits={bars.current} t={t} onTap={tapBar} />

        {SLOTS.map((_, i) => spot(i, "back"))}

        {/* Where a tap plays the part in a spot, if it can't be swapped; marbles in front can still be tapped */}
        {!rebuild &&
          SLOTS.map((slot, i) => {
            const b = slotBoard(slot);
            return (
              <rect
                key={i}
                className="run-spot-tap"
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="28"
                fill="transparent"
                onPointerDown={(e) => playSpot(i, e)}
              />
            );
          })}

        {/* Seesaw; a tap tips it */}
        <g
          onPointerDown={(e) => {
            tapped(e);
            seesawTapped.current = performance.now();
            sound(playBoing);
          }}
        >
          <rect x={SEESAW.cx - SEESAW.half - 10} y={SEESAW.cy - 70} width={SEESAW.half * 2 + 20} height="140" fill="transparent" />
          <path
            d={`M${SEESAW.cx} ${SEESAW.cy} L${SEESAW.cx - 34} ${SEESAW.cy + 62} L${SEESAW.cx + 34} ${SEESAW.cy + 62} Z`}
            fill="#8a5a2b"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <g transform={`translate(${SEESAW.cx} ${SEESAW.cy}) rotate(${tilt.current})`}>
            <rect x={-SEESAW.half} y="-7" width={SEESAW.half * 2} height="14" rx="7" fill="#ffb703" stroke={INK} strokeWidth="3" />
            <rect x={-SEESAW.half + 6} y="-33" width="30" height="26" rx="6" fill="#ff5d73" stroke={INK} strokeWidth="3" />
          </g>
          <circle cx={SEESAW.cx} cy={SEESAW.cy} r="6" fill={INK} />
        </g>

        {/* Row 3, and the back of the basket at the bottom */}
        <Rail a={{ x: ROW3.from.x - 16, y: ROW3.from.y - 1 }} b={ROW3.to} />
        <ellipse cx={(BASKET.x0 + BASKET.x1) / 2} cy={BASKET.rimY} rx={(BASKET.x1 - BASKET.x0) / 2} ry="14" fill="#6b4220" />
        {done.current && <Flag rise={Math.min(1, flagAge / FLAG_MS)} sway={wobble(flagAge / 1000, 10, 9, 1.5)} />}

        {/* An animal looks out of the tunnel, from behind its roof */}
        <Peek animal={peek.current.animal} age={(t - peek.current.at) / PEEK_MS} />

        <g onPointerDown={tapBasket}>
          {landed.current.map((l, i) => {
            const k = Math.min(1, (t - l.at) / LAND_MS);
            const bounce = (k < 1 ? 0 : wobble((t - l.at - LAND_MS) / 1000, 6, 20, 8)) + wobble(basketAge - i * 0.06, 22, 16, 6);
            const x = l.from.x + (l.to.x - l.from.x) * k;
            const y = l.from.y + (l.to.y - l.from.y) * k * k - Math.abs(bounce) - (ROLLER[l.kind].r - BALL_R);
            return <RollerBody key={l.id} kind={l.kind} color={l.color} look={l.look} x={x} y={y} spin={0} />;
          })}
        </g>
        {marbles.current.map((m) => {
          const k = (t - m.nudged) / NUDGE_MS;
          return (
            <g
              key={m.id}
              onPointerDown={(e) => {
                tapped(e);
                nudge(m, performance.now());
              }}
            >
              <circle cx={m.x} cy={m.y} r="56" fill="transparent" />
              <RollerBody
                kind={m.kind}
                color={m.color}
                look={m.look}
                x={m.x}
                y={m.y}
                spin={m.spin + (k >= 0 && k < 1 ? 4 * Math.PI * k : 0)}
                scale={m.fly ? SHELF.scale - (SHELF.scale - 1) * Math.min(1, (t - m.fly.at) / FLY_MS) : 1}
              />
            </g>
          );
        })}
        {pops.current.map((p) => (
          <BubblePop key={p.id} x={p.x} y={p.y} age={(t - p.at) / POP_MS} />
        ))}

        {/* In front of the marbles */}
        <Hopper />
        {SLOTS.map((_, i) => spot(i, "front"))}
        <g
          onPointerDown={(e) => {
            tapped(e);
            peekOut(performance.now());
          }}
        >
          <Tunnel />
        </g>
        <g onPointerDown={tapBasket}>
          <Basket />
        </g>
        {glitters.current.map((g) => (
          <Sparkles key={g.id} x={g.x} y={g.y} age={(t - g.at) / GLITTER_MS} />
        ))}

        {/* Where a tap swaps the part: the whole board, with a wrench in the corner */}
        {rebuild &&
          SLOTS.map((slot, i) => {
            const b = slotBoard(slot);
            const pending = spots.current[i].pending;
            const wx = slot.dir > 0 ? b.x + b.w - 30 : b.x + 30;
            return (
              <g key={i} className="run-spot-tap" onPointerDown={(e) => swap(i, e)}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill="transparent" />
                <circle cx={wx} cy={b.y + 30} r="24" fill="#fff8e8" stroke="#c48a4d" strokeWidth="3" />
                <text x={wx} y={b.y + 41} fontSize="28" textAnchor="middle" className={pending ? "run-wrench busy" : "run-wrench"}>
                  🔧
                </text>
              </g>
            );
          })}

        {pick && <Shelf things={shelf.current} filled={filled.current} color={BRIGHT_COLORS[nextId.current % BRIGHT_COLORS.length]} t={t} onTake={take} />}

        {!started && (
          <text className="run-hint" x={pick ? SHELF.things[1] + 40 : HOPPER.x + 92} y={pick ? SHELF.y + 100 : HOPPER.y + 96} fontSize="90" textAnchor="middle">
            👆
          </text>
        )}
      </svg>
    </div>
  );
}

/** The slightly darker board a spot sits on, with a dashed edge: here something can be swapped. */
function SpotBoard({ slot }: { slot: Slot }) {
  const b = slotBoard(slot);
  return <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill="#e9c08a" stroke="#c48a4d" strokeWidth="4" strokeDasharray="14 10" />;
}

/** A thing on the run (or bigger by `scale`, on the shelf), its middle at `x`, `y`, turned by `spin` as it rolls. */
function RollerBody({
  kind,
  color,
  look,
  x,
  y,
  spin,
  scale = 1,
}: {
  kind: Roller;
  color: string;
  look?: BallLook;
  x: number;
  y: number;
  spin: number;
  scale?: number;
}) {
  const r = ROLLER[kind].r;
  const deg = (spin * 180) / Math.PI;
  let body: ReactNode;
  switch (kind) {
    case "marble":
      body = <Ball color={color} look={look} x={0} y={0} spin={spin} />;
      break;
    case "tennis":
      body = (
        <g>
          <circle r={r} fill="#d8ec3f" stroke={INK} strokeWidth="3" />
          <g transform={`rotate(${deg})`} fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
            <path d={`M${-r * 0.62} ${-r * 0.78} Q${-r * 0.12} 0 ${-r * 0.62} ${r * 0.78}`} />
            <path d={`M${r * 0.62} ${-r * 0.78} Q${r * 0.12} 0 ${r * 0.62} ${r * 0.78}`} />
          </g>
          <circle cx={-r * 0.32} cy={-r * 0.38} r="4.5" fill="#fff" opacity="0.6" />
        </g>
      );
      break;
    case "iron":
      body = (
        <g>
          <circle r={r} fill="#5d6577" stroke={INK} strokeWidth="3.5" />
          <circle cx="3" cy="4" r={r - 6} fill="#4a5161" />
          <g transform={`rotate(${deg})`}>
            {[0, 120, 240].map((a) => (
              <circle key={a} cx={(r - 8) * Math.cos((a * Math.PI) / 180)} cy={(r - 8) * Math.sin((a * Math.PI) / 180)} r="2.8" fill="#2f3440" />
            ))}
          </g>
          <ellipse cx={-r * 0.35} cy={-r * 0.4} rx="7" ry="4.5" transform={`rotate(-35 ${-r * 0.35} ${-r * 0.4})`} fill="#fff" opacity="0.55" />
        </g>
      );
      break;
    case "apple":
      body = (
        <g>
          <g transform={`rotate(${deg})`}>
            <path
              d={`M0 ${-r * 0.7} C${r * 0.5} ${-r * 1.15} ${r * 1.1} ${-r * 0.6} ${r * 0.98} ${r * 0.15} C${r * 0.88} ${r * 0.85} ${r * 0.35} ${r * 1.05} 0 ${r * 0.88} C${-r * 0.35} ${r * 1.05} ${-r * 0.88} ${r * 0.85} ${-r * 0.98} ${r * 0.15} C${-r * 1.1} ${-r * 0.6} ${-r * 0.5} ${-r * 1.15} 0 ${-r * 0.7} Z`}
              fill="#e63946"
              stroke={INK}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path d={`M0 ${-r * 0.68} Q-2 ${-r * 1.05} 3 ${-r * 1.25}`} fill="none" stroke="#6b4220" strokeWidth="4" strokeLinecap="round" />
            <path d={`M2 ${-r * 1.0} Q12 ${-r * 1.4} 22 ${-r * 1.05} Q12 ${-r * 0.82} 2 ${-r * 1.0} Z`} fill="#3ec300" stroke={INK} strokeWidth="2" />
          </g>
          <ellipse cx={-r * 0.42} cy={-r * 0.3} rx="4.5" ry="7" fill="#fff" opacity="0.55" />
        </g>
      );
      break;
    case "bubble":
      body = (
        <g>
          <circle r={r} fill="#d6f1ff" fillOpacity="0.35" stroke="#7fc8f8" strokeWidth="2.5" />
          <path
            d={`M${-r * 0.8} ${r * 0.3} A${r * 0.85} ${r * 0.85} 0 0 0 ${r * 0.3} ${r * 0.8}`}
            fill="none"
            stroke="#ff7bd0"
            strokeWidth="3"
            opacity="0.6"
            strokeLinecap="round"
          />
          <path
            d={`M${r * 0.45} ${-r * 0.62} A${r * 0.78} ${r * 0.78} 0 0 1 ${r * 0.75} ${-r * 0.1}`}
            fill="none"
            stroke="#ffd23f"
            strokeWidth="3"
            opacity="0.6"
            strokeLinecap="round"
          />
          <ellipse cx={-r * 0.38} cy={-r * 0.42} rx="7" ry="4" transform={`rotate(-40 ${-r * 0.38} ${-r * 0.42})`} fill="#fff" opacity="0.9" />
        </g>
      );
      break;
  }
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>{body}</g>;
}

/** The soap bubble bursting, `age` from 0 to 1: a ring that widens and fades, and droplets flying out. */
function BubblePop({ x, y, age }: { x: number; y: number; age: number }) {
  const r = ROLLER.bubble.r;
  return (
    <g transform={`translate(${x} ${y})`} opacity={1 - age}>
      <circle r={r * (1 + age * 0.8)} fill="none" stroke="#7fc8f8" strokeWidth={3 * (1 - age) + 0.5} />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4;
        const d = r + 36 * age;
        return <circle key={i} cx={d * Math.cos(a)} cy={d * Math.sin(a)} r="4" fill="#bde9ff" stroke="#7fc8f8" strokeWidth="1.5" />;
      })}
    </g>
  );
}

/** Little stars flying up and apart from `x`, `y` and fading; `age` goes from 0 to 1. */
function Sparkles({ x, y, age }: { x: number; y: number; age: number }) {
  if (age < 0 || age >= 1) return null;
  const out = 1 - (1 - age) ** 2;
  return (
    <g pointerEvents="none" opacity={1 - age * age}>
      {BAR_COLORS.slice(0, 6).map((color, i) => {
        const a = ((-90 + (i - 2.5) * 30) * Math.PI) / 180;
        const d = 30 + 80 * out;
        return (
          <polygon
            key={color}
            points={STAR_POINTS}
            fill={color}
            stroke={INK}
            strokeWidth="1.5"
            transform={`translate(${x + d * Math.cos(a)} ${y + d * Math.sin(a) - 30 * age}) rotate(${age * 160 * (i % 2 ? 1 : -1)}) scale(${0.8 + 0.4 * Math.sin(Math.PI * age)})`}
          />
        );
      })}
    </g>
  );
}

/** An animal climbing up over the tunnel's roof near its end, waving, and going down again; `age` goes from 0 to 1. */
function Peek({ animal, age }: { animal: string; age: number }) {
  if (age < 0 || age >= 1) return null;
  const x = TUNNEL.x1 - 60;
  const roof = rowY(ROW3, x) - 52;
  const up = 66 * Math.min(1, age * 6, (1 - age) * 6);
  return (
    <text x={x} y={roof + 66 - up} fontSize="64" textAnchor="middle" pointerEvents="none" transform={`rotate(${wobble(age * 1.7, 12, 9, 0.5)} ${x} ${roof})`}>
      {animal}
    </text>
  );
}

/**
 * The shelf over row 1a with three things to pick from (K-07). Tapping one
 * lets it out; the new one in its place pops up from small. A marble on it
 * has `color`, the colour it keeps on the run.
 */
function Shelf({ things, filled, color, t, onTake }: { things: Roller[]; filled: number[]; color: string; t: number; onTake: (i: number) => void }) {
  return (
    <g>
      <rect x={SHELF.x0} y={SHELF.y} width={SHELF.x1 - SHELF.x0} height="13" rx="6" fill="#b8763d" stroke={INK} strokeWidth="3" />
      {things.map((kind, i) => {
        const at = shelfSpot(i, kind);
        const age = (t - filled[i] - REFILL_MS) / 1000;
        const k = age < 0 ? 0 : age < 1.5 ? 1 - Math.exp(-age * 7) * Math.cos(age * 22) : 1;
        return (
          <g
            key={i}
            className="run-shelf-thing"
            onPointerDown={(e: PointerEvent) => {
              e.stopPropagation();
              onTake(i);
            }}
          >
            <rect x={at.x - 58} y="-10" width="116" height={SHELF.y + 26} fill="transparent" />
            <g transform={`translate(${at.x} ${SHELF.y}) scale(${k}) translate(${-at.x} ${-SHELF.y})`}>
              <RollerBody kind={kind} color={color} x={at.x} y={at.y} spin={0} scale={SHELF.scale} />
            </g>
          </g>
        );
      })}
    </g>
  );
}

/** A point `by` px further along `row` from `pt`, so a rail starts a little inside a turn. */
const inset = (pt: Pt, row: Row, by: number): Pt => {
  const x = pt.x + Math.sign(row.to.x - row.from.x) * by;
  return { x, y: rowY(row, x) };
};

/** A row's rails with the beam under its xylophone bars, which light up and dip when hit by a marble or a finger. */
function Xylophone({ row, hits, t, onTap }: { row: Row; hits: number[]; t: number; onTap: (bar: number, e: PointerEvent) => void }) {
  const bars = BARS.map((bar, i) => ({ ...bar, i })).filter((bar) => bar.row === row);
  const first = bars[0];
  const last = bars[bars.length - 1];
  const at = (x: number) => ({ x, y: rowY(row, x) });
  const slope = (Math.atan2(row.to.y - row.from.y, row.to.x - row.from.x) * 180) / Math.PI;
  return (
    <g>
      <Rail a={at(row.from.x - 24)} b={at(first.x - 4)} />
      <line
        x1={first.x - 6}
        y1={rowY(row, first.x) + BALL_R + 26}
        x2={last.x + last.w + 6}
        y2={rowY(row, last.x + last.w) + BALL_R + 26}
        stroke="#8a5a2b"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {bars.map((bar) => {
        const age = (t - hits[bar.i]) / 1000;
        const cx = bar.x + bar.w / 2;
        const dip = age >= 0 && age < 1 ? 5 * Math.exp(-age * 10) : 0;
        return (
          <g key={bar.i} transform={`translate(${cx} ${rowY(row, cx) + BALL_R + 9 + dip}) rotate(${slope})`} onPointerDown={(e) => onTap(bar.i, e)}>
            {/* Taller than the bar, so a small finger finds it */}
            <rect x={-bar.w / 2 + 2} y={-62} width={bar.w - 4} height={100} fill="transparent" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill={BAR_COLORS[bar.i % BAR_COLORS.length]} stroke={INK} strokeWidth="3" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill="#fff" opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 6) : 0} />
            <circle cx={-bar.w / 2 + 10} cy="0" r="3" fill="#fff8" />
            <circle cx={bar.w / 2 - 10} cy="0" r="3" fill="#fff8" />
          </g>
        );
      })}
      <Rail a={at(last.x + last.w + 4)} b={row.to} />
    </g>
  );
}

/**
 * The part in one spot, behind the marbles (`back`) or in front of them
 * (`front`). A part that has just been put in pops up from small.
 */
function Spot({ slot, piece, state, t, layer }: { slot: Slot; piece: Piece; state: SpotState; t: number; layer: "back" | "front" }) {
  const age = (t - state.swapped) / 1000;
  const hitAge = (t - state.hit) / 1000;
  // A funnel wobbles a little when a marble swirls in or a finger taps it.
  const k = (age >= 0 && age < 1.5 ? 1 - 0.45 * Math.exp(-age * 7) * Math.cos(age * 22) : 1) * (piece === "funnel" ? 1 + wobble(hitAge, 0.07, 24, 6) : 1);
  const m = slotMiddle(slot);
  let body: ReactNode = null;
  switch (piece) {
    case "bell": {
      const { pivot } = bellIn(slot);
      body =
        layer === "back" ? (
          <Rail a={slot.from} b={slot.to} />
        ) : (
          <g>
            <line x1={pivot.x} y1={pivot.y - 44} x2={pivot.x} y2={pivot.y} stroke={INK} strokeWidth="5" strokeLinecap="round" />
            <circle cx={pivot.x} cy={pivot.y - 44} r="7" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
            <Bell x={pivot.x} y={pivot.y} angle={wobble(hitAge, 24, 13, 2.2)} />
          </g>
        );
      break;
    }
    case "trampoline":
      body = layer === "back" ? <Trampoline slot={slot} dip={hitAge >= 0 && hitAge < 1 ? 16 * Math.exp(-hitAge * 7) * Math.cos(hitAge * 24) : 0} /> : null;
      break;
    case "funnel": {
      const f = funnelIn(slot);
      body =
        layer === "back" ? (
          <g>
            <ellipse cx={f.cx} cy={f.rimY} rx={f.rx} ry={f.ry} fill="#1b8fc4" opacity="0.45" />
            <Rail a={{ x: f.cx - slot.dir * 20, y: slot.to.y }} b={slot.to} />
          </g>
        ) : (
          <Funnel slot={slot} />
        );
      break;
    }
    case "wheel":
      body = layer === "back" ? <PaddleWheel slot={slot} angle={state.angle} /> : null;
      break;
  }
  if (!body) return null;
  return <g transform={`translate(${m.x} ${m.y}) scale(${k}) translate(${-m.x} ${-m.y})`}>{body}</g>;
}

/** The wall at a turn, with a round bumper where the marble hits it; the bumper flashes `age` seconds after a hit. */
function Wall({ turn, index, age }: { turn: Turn; index: number; age: number }) {
  const side = turnSide(turn);
  const top = turn.from.y - 70;
  const bottom = turn.to.y + 40;
  const y = turn.from.y + 3;
  const flash = age >= 0 && age < 1 ? Math.exp(-age * 6) : 0;
  const squash = age >= 0 && age < 1 ? 5 * Math.exp(-age * 9) * Math.cos(age * 30) : 0;
  return (
    <g>
      <rect x={side > 0 ? turn.x : turn.x - 18} y={top} width="18" height={bottom - top} rx="6" fill="#b8763d" stroke={INK} strokeWidth="3" />
      <ellipse
        cx={turn.x - side * (5 - squash)}
        cy={y}
        rx={9 - squash}
        ry="24"
        fill={BAR_COLORS[(index * 3) % BAR_COLORS.length]}
        stroke={INK}
        strokeWidth="3"
      />
      <ellipse cx={turn.x - side * (5 - squash)} cy={y} rx={9 - squash} ry="24" fill="#fff" opacity={0.8 * flash} />
    </g>
  );
}

/** The looping: a round track the marble rides inside, glowing for a moment after each marble. */
function Loop({ age }: { age: number }) {
  const r = LOOP.r + BALL_R + 7;
  const glow = age >= 0 && age < 2 ? Math.exp(-age * 2) : 0;
  return (
    <g>
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r - 6} fill="#ffd23f" opacity={0.18 + 0.3 * glow} />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r} fill="none" stroke={INK} strokeWidth="18" />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r} fill="none" stroke="#ff5d73" strokeWidth="12" />
      <circle cx={LOOP.cx} cy={LOOP.cy} r={r} fill="none" stroke="#fff" strokeWidth="12" strokeDasharray="22 22" opacity={0.5 + 0.5 * glow} />
      <Rail a={inset(ROW4B.from, ROW4B, 10)} b={ROW4B.to} />
      <Rail a={LOOP_OUT.from} b={LOOP_OUT.to} />
      <rect x={LOOP.cx - 9} y={LOOP.cy + r + 8} width="18" height="70" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** Drum `i`, big to small: its skin sags and the drum jumps a little when a marble hits it. */
function Drum({ i, age }: { i: number; age: number }) {
  const { x, top, r, h } = DRUMS[i];
  const ry = r * 0.3;
  const hit = age >= 0 && age < 1;
  const dip = hit ? 8 * Math.exp(-age * 8) * Math.cos(age * 28) : 0;
  const jump = hit ? Math.abs(4 * Math.exp(-age * 7) * Math.sin(age * 26)) : 0;
  const body = ["#ff5d73", "#3a86ff", "#3ec300"][i % 3];
  return (
    <g transform={`translate(0 ${-jump})`}>
      <path
        d={`M${x - r} ${top} L${x - r} ${top + h} A${r} ${ry} 0 0 0 ${x + r} ${top + h} L${x + r} ${top} Z`}
        fill={body}
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {[-0.6, -0.2, 0.2, 0.6].map((k) => (
        <path
          key={k}
          d={`M${x + k * r} ${top + ry * 0.8} L${x + (k + 0.2) * r} ${top + h} L${x + (k + 0.4) * r} ${top + ry * 0.8}`}
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          opacity="0.8"
        />
      ))}
      <ellipse cx={x} cy={top} rx={r} ry={ry} fill="#fff8e8" stroke={INK} strokeWidth="3" />
      <ellipse cx={x} cy={top + dip * 0.6} rx={r * 0.55} ry={ry * 0.45} fill="#e9dcc0" />
      <rect x={x - r} y={top + h - 8} width={r * 2} height="8" fill="#ffd23f" stroke={INK} strokeWidth="2" />
    </g>
  );
}

/** The chimes hanging from their beam; one swings away and rings when a marble or a finger knocks it. */
function Chimes({ hits, t, onTap }: { hits: number[]; t: number; onTap: (chime: number, e: PointerEvent) => void }) {
  const { x0, x1, y } = CHIME_BEAM;
  return (
    <g>
      <rect x={x0} y={y - 8} width={x1 - x0} height="16" rx="8" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
      {CHIMES.map((chime, i) => {
        const bottom = rowY(ROW7, chime.x) - BALL_R + 4;
        const tubeTop = bottom - chime.length;
        const age = (t - hits[i]) / 1000;
        return (
          <g key={i} transform={`rotate(${wobble(age, 16, 8, 1.6)} ${chime.x} ${y + 6})`} onPointerDown={(e) => onTap(i, e)}>
            <rect x={chime.x - 28} y={tubeTop} width="56" height={chime.length} fill="transparent" />
            <line x1={chime.x} y1={y + 6} x2={chime.x} y2={tubeTop} stroke={INK} strokeWidth="2.5" />
            <rect x={chime.x - 8} y={tubeTop} width="16" height={chime.length} rx="5" fill="#cfd8e3" stroke={INK} strokeWidth="3" />
            <line x1={chime.x - 3} y1={tubeTop + 8} x2={chime.x - 3} y2={bottom - 8} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <rect
              x={chime.x - 8}
              y={tubeTop}
              width="16"
              height={chime.length}
              rx="5"
              fill="#fff"
              opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 5) : 0}
            />
          </g>
        );
      })}
    </g>
  );
}

function Hopper() {
  return (
    <g>
      <path
        d={`M${HOPPER.x - 58} -10 L${HOPPER.x + 58} -10 L${HOPPER.x + 28} 62 L${HOPPER.x - 28} 62 Z`}
        fill="#8e7dff"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d={`M${HOPPER.x - 36} 8 L${HOPPER.x + 36} 8`} stroke="#fff8" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function PaddleWheel({ slot, angle }: { slot: Slot; angle: number }) {
  const WHEEL = wheelIn(slot);
  const deg = (angle * 180) / Math.PI;
  return (
    <g transform={`translate(${WHEEL.cx} ${WHEEL.cy})`}>
      <circle r={WHEEL.r} fill="#bde9ff88" stroke={INK} strokeWidth="4" />
      <g transform={`rotate(${deg})`}>
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 45})`}>
            <line x1="14" y1="0" x2={WHEEL.r - 4} y2="0" stroke="#3a86ff" strokeWidth="9" strokeLinecap="round" />
            <rect x={WHEEL.r - 30} y="-5" width="26" height="22" rx="4" fill="#00b4d8" stroke={INK} strokeWidth="2.5" />
          </g>
        ))}
      </g>
      <circle r="18" fill="#ffb703" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** The flag that springs up out of the full basket: `rise` from 0 to 1, swaying by `sway` degrees. */
function Flag({ rise, sway }: { rise: number; sway: number }) {
  const x = (BASKET.x0 + BASKET.x1) / 2;
  // A little past the top, then back.
  const up = 250 * (1 - (1 - rise) ** 3) + 18 * Math.sin(Math.PI * rise);
  return (
    <g transform={`translate(${x} ${BASKET.rimY - up + 30}) rotate(${sway})`}>
      <rect x="-5" y="0" width="10" height="240" rx="5" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
      <path d="M5 4 L120 34 L5 66 Z" fill="#ff5d73" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <path d="M5 24 L60 34 L5 46 Z" fill="#ffd23f" />
      <circle cx="0" cy="-4" r="11" fill="#ffd23f" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A bell hanging from `x`, `y`, swinging by `angle` degrees. */
function Bell({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        d="M-4 0 L4 0 L5 12 C22 16 28 34 30 58 L34 64 L-34 64 L-30 58 C-28 34 -22 16 -5 12 Z"
        fill="#ffc93c"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-18 28 C-16 22 -12 19 -8 18" stroke="#fff9" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="0" cy="70" r="7" fill="#c98a00" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A little trampoline on four legs; its mat sags by `dip` when a marble lands. */
function Trampoline({ slot, dip }: { slot: Slot; dip: number }) {
  const { x, y, half } = trampolineIn(slot);
  return (
    <g>
      {[-half + 10, half - 10].map((dx) => (
        <line key={dx} x1={x + dx} y1={y} x2={x + dx * 1.15} y2={y + 34} stroke={INK} strokeWidth="6" strokeLinecap="round" />
      ))}
      <path d={`M${x - half} ${y} Q${x} ${y + 2 * dip} ${x + half} ${y}`} fill="none" stroke="#3a86ff" strokeWidth="9" strokeLinecap="round" />
      {[-half, half].map((dx) => (
        <circle key={dx} cx={x + dx} cy={y} r="8" fill="#ff5d73" stroke={INK} strokeWidth="3" />
      ))}
    </g>
  );
}

function Funnel({ slot }: { slot: Slot }) {
  const { cx, rimY, rx, ry, spoutY, spoutW } = funnelIn(slot);
  const half = spoutW / 2;
  return (
    <g>
      <path
        d={`M${cx - rx} ${rimY} A${rx} ${ry} 0 0 0 ${cx + rx} ${rimY} L${cx + half} ${spoutY - 24} L${cx + half} ${spoutY + 12} L${cx - half} ${spoutY + 12} L${cx - half} ${spoutY - 24} Z`}
        fill="#4cc9f0"
        opacity="0.38"
      />
      <path
        d={`M${cx - rx} ${rimY} L${cx - half} ${spoutY - 24} L${cx - half} ${spoutY + 12} L${cx + half} ${spoutY + 12} L${cx + half} ${spoutY - 24} L${cx + rx} ${rimY}`}
        fill="none"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <ellipse cx={cx} cy={rimY} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth="4" />
      <path d={`M${cx - rx + 28} ${rimY + 26} L${cx - half - 4} ${spoutY - 30}`} stroke="#fffa" strokeWidth="6" strokeLinecap="round" />
    </g>
  );
}

function Tunnel() {
  const { x0, x1 } = TUNNEL;
  const y = (x: number) => ROW3.from.y + ((x - ROW3.from.x) * (ROW3.to.y - ROW3.from.y)) / (ROW3.to.x - ROW3.from.x);
  const top0 = y(x0) - 52;
  const top1 = y(x1) - 52;
  const base0 = y(x0) + BALL_R + 16;
  const base1 = y(x1) + BALL_R + 16;
  return (
    <g>
      <path
        d={`M${x0} ${base0} L${x0} ${top0 + 26} Q${x0} ${top0} ${x0 + 26} ${top0} L${x1 - 26} ${top1} Q${x1} ${top1} ${x1} ${top1 + 26} L${x1} ${base1} Z`}
        fill="#3ec300"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0.25, 0.5, 0.75].map((k) => {
        const x = x0 + (x1 - x0) * k;
        return <line key={k} x1={x} y1={y(x) - 52} x2={x} y2={y(x) + BALL_R + 16} stroke="#2a9100" strokeWidth="6" />;
      })}
    </g>
  );
}

function Basket() {
  const { x0, x1, rimY, bottomY } = BASKET;
  return (
    <g>
      <path
        d={`M${x0} ${rimY} L${x1} ${rimY} L${x1 - 14} ${bottomY} L${x0 + 14} ${bottomY} Z`}
        fill="#c98a4b"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0, 1, 2].map((i) => {
        const yy = rimY + 14 + i * 15;
        return <line key={i} x1={x0 + 6} y1={yy} x2={x1 - 6} y2={yy} stroke="#9b6330" strokeWidth="4" />;
      })}
      {Array.from({ length: 9 }, (_, i) => {
        const xx = x0 + 24 + i * 23;
        return <line key={i} x1={xx} y1={rimY + 4} x2={xx + (xx < (x0 + x1) / 2 ? 3 : -3)} y2={bottomY - 4} stroke="#9b6330" strokeWidth="3" />;
      })}
      <rect x={x0 - 8} y={rimY - 8} width={x1 - x0 + 16} height="16" rx="8" fill="#e0a868" stroke={INK} strokeWidth="4" />
    </g>
  );
}
