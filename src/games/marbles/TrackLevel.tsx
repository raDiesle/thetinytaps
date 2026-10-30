import { memo, useContext, useEffect, useId, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { BRIGHT_COLORS } from "@/components/Bursts";
import { type LevelProps, useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, wobble } from "./level";
import { Ball, BAR_COLORS, type BallLook, Rail, STAR_POINTS } from "./parts";
import { SITE_TRACK } from "./siteTrack";
import { SLIDE_TRACK } from "./slideTrack";
import { SNOW_TRACK } from "./snowTrack";
import { SPACE_TRACK } from "./spaceTrack";
import { type EndProps, INK, type ThingProps, TrackLook, type TrackTheme } from "./trackTheme";
import { BALL_R, type Pt } from "./path";
import { useDevice } from "@/lib/device";
import { useT } from "@/lib/language";
import {
  playBells,
  playBlub,
  playBoing,
  playChime,
  playChimeNote,
  playClick,
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
  GATE,
  HOPPER,
  LEDGE,
  LEFT1,
  LEFT2,
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
  SWITCH,
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
  type Way,
} from "./track";

const GRAVITY = 1600;
const FRICTION = 0.3;
const MIN_SPEED = 280;
const MAX_SPEED = 950;
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
/** „Achtung, fertig – los!“: the barrier's arm goes up over this long, with a note on each word, then the waiting marbles rush off (K-02). */
const GO_MS = 1100;
/** How fast the waiting marbles set off when the barrier is up. */
const RUSH_SPEED = 420;
/** The barrier comes down again this long after it went up, once no marble is under it. */
const CLOSE_AFTER_MS = 1400;
/** On its own („Von selbst“), the switch flips this long after a marble has taken a way (K-01). */
const AUTO_FLIP_MS = 700;
/** The switch's flap: lifted to the right (degrees), or hanging down in the marble's way. */
const FLAP_UP = -90;
const FLAP_DOWN = 0;

/**
 * What the magic tunnel does to a marble (K-06), in turn from a random start,
 * so each one comes out different: another colour, stripes, a golden star,
 * dots, or an animal looks out. Other things keep their look; for them an
 * animal looks out.
 */
type Magic = "color" | "stripes" | "star" | "peek" | "dots";
const MAGIC: Magic[] = ["color", "stripes", "star", "peek", "dots"];
const STAR_GOLD = "#ffd23f";

/** The camera keeps the lowest marble at least this far above the bottom edge, so it sees where it goes. */
const LEAD_ROOM = 260;
/** How quickly the camera catches up, per second. */
const CAMERA_PULL = 4;
/**
 * The camera may go this far above the wall's top, so the shelf and the hopper
 * sit a bit lower in the picture, clear of the top edge and the ✕.
 */
const TOP_ROOM = 160;
/** With the camera's top lower than this on the wall, the shelf is cut off, and the ⬆ button shows. */
const UP_SHOWN_BELOW = 40;

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
  /** Which section of the run it is on (`Routes.sections`). */
  section: number;
  /** The part in the spot it is passing through, taken when it got there. */
  piece: Piece;
  /** The way it takes at the switch, taken when it got there. */
  way: Way;
  /** It waits behind the closed barrier. */
  waiting: boolean;
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

/** Times something along the way was last hit, one per thing, for its flash or swing. */
const never = (n: number) => Array.from({ length: n }, () => -Infinity);

/**
 * A long wooden marble run down a tall wall. Three big things lie on a shelf
 * over the first row (K-07), and tapping one lets out just that one. Each rolls
 * over a xylophone, through spots that hold a bell, a funnel, a paddle wheel or
 * a trampoline, rides the seesaw, goes through the tunnel, zigzags down past
 * bumpers, loops the loop, hops over three drums, knocks the chimes and plays
 * a whole scale before it drops into the basket – each its own way: the tennis
 * ball hops, the iron ball rumbles slowly with deep notes, the soap bubble
 * floats and bursts above the basket. The camera follows them down. When the
 * basket is full a flag springs up out of it. Tapping a spot swaps its part,
 * and the next thing takes the new way.
 *
 * The child can join in all the time: a tapped thing hops and twirls (K-03),
 * the bars, seesaw, drums, chimes, looping, tunnel and basket sound and move
 * when tapped, and the bare wall sparkles (K-04). Every marble comes out of
 * the tunnel changed (K-06).
 *
 * The same run comes in other worlds too (K-18, `look`): snow, space, a water
 * slide and a building site, each with its own wall, things and end.
 */
function Run({ sound, say, onDone, watch = false, look }: LevelProps & { look: TrackTheme }) {
  const label = useLevelName(look.level);
  // `t` is the time everywhere here, so the translation helper gets another name.
  const tr = useT();
  const routes = useMemo(buildRoutes, []);
  /** How long the whole run is with the parts it starts with, for how much of it lies behind a thing. */
  const runLength = useMemo(
    () =>
      routes.sections.reduce(
        (sum, sec) =>
          sum +
          (sec.kind === "fixed"
            ? sec.route.total
            : sec.kind === "spot"
              ? routes.pieces[sec.spot][DEFAULT_BUILD[sec.spot]].total
              : Math.min(routes.ways.left.total, routes.ways.right.total)),
        0,
      ),
    [routes],
  );
  const build = useRef<Piece[]>([...keptBuild]);
  const spots = useRef<SpotState[]>(SLOTS.map(() => ({ hit: -Infinity, swapped: -Infinity, angle: 0, spin: 0, pending: null })));
  const marbles = useRef<Marble[]>([]);
  const landed = useRef<Landed[]>([]);
  const nextId = useRef(0);
  const fullAt = useRef(Infinity);
  const bars = useRef(never(BARS.length));
  const bumps = useRef(never(TURNS.length));
  const drums = useRef(never(DRUMS.length));
  const chimes = useRef(never(CHIMES.length));
  const looped = useRef(-Infinity);
  const tilt = useRef(SEESAW.rest);
  const seesawTapped = useRef(-Infinity);
  const basketTapped = useRef(-Infinity);
  const glitters = useRef<Glitter[]>([]);
  const peek = useRef({ at: -Infinity, animal: look.peekers[0] });
  const [magicStart] = useState(() => Math.floor(Math.random() * MAGIC.length));
  const svg = useRef<SVGSVGElement>(null);
  const done = useRef(false);
  const now = useRef(performance.now());
  /** The top of the view and its height, in the wall's coordinates. */
  const camera = useRef({ y: -TOP_ROOM, h: VIEW_H });
  /**
   * The ⬆ button was pressed: the camera stays up at the shelf until the next
   * thing is let out, and from then on follows only the things let out since.
   */
  const lookingUp = useRef(false);
  const followFrom = useRef(0);
  const box = useRef<HTMLDivElement>(null);
  /** The three things on the shelf, when each was put there, and which a key or a tap on the wall lets out next. */
  const [firstShelf] = useState(() => [...ROLLERS].sort(() => Math.random() - 0.5).slice(0, SHELF.things.length));
  const shelf = useRef(firstShelf);
  const filled = useRef(SHELF.things.map(() => -Infinity));
  const turn = useRef(0);
  const pops = useRef<{ id: number; x: number; y: number; at: number }[]>([]);
  /** The key held down just now, so its cap on the screen goes down too (the picture is drawn on every frame anyway). */
  const held = useRef<string | null>(null);
  const { touchOnly } = useDevice();
  /**
   * The barrier (K-02): when it was last told to go up, how far up its arm is
   * (0 down, 1 up), whether marbles can pass, how far „Achtung, fertig – los!“
   * has got (three notes, then 4 once the marbles are off), and when a finger
   * last tapped it. With „Von selbst“ it stays up.
   */
  const gate = useRef({ openedAt: -Infinity, lift: watch ? 1 : 0, open: watch, step: 4, tapped: -Infinity });
  /** The things waiting behind the barrier, the first one first. */
  const queue = useRef<Marble[]>([]);
  /** The switch (K-01): the way it is set to, its flap's angle, when a marble last knocked the flap, and when it flips by itself. */
  const way = useRef<Way>("right");
  const flap = useRef(FLAP_UP);
  const flapHit = useRef(-Infinity);
  const flipAt = useRef(Infinity);
  const lastSection = routes.sections.length - 1;

  const routeOf = (m: Marble): Route => {
    const sec = routes.sections[m.section];
    return sec.kind === "fixed" ? sec.route : sec.kind === "spot" ? routes.pieces[sec.spot][m.piece] : routes.ways[m.way];
  };
  /** The spot a section holds, or -1. */
  const spotOf = (section: number) => {
    const sec = routes.sections[section];
    return sec.kind === "spot" ? sec.spot : -1;
  };
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
    const others = look.peekers.filter((a) => a !== peek.current.animal);
    peek.current = { at: t, animal: others[Math.floor(Math.random() * others.length)] };
    sound(playSqueak);
  };

  /** In the middle of the tunnel, out of sight, a marble changes; with anything else (or in another world) an animal looks out. */
  const magic = (m: Marble, t: number) => {
    const changes = look.magic && m.kind === "marble";
    const change = changes ? MAGIC[(magicStart + m.id) % MAGIC.length] : "peek";
    if (changes) {
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
      case "flap":
        flapHit.current = t;
        sound(() => playKnock(760));
        break;
      case "gate":
      case "basket":
        break;
    }
  };

  const land = (m: Marble, t: number) => {
    const slot = Math.min(landed.current.length, BASKET_SLOTS.length - 1);
    const to = look.landAt?.(landed.current.length) ?? BASKET_SLOTS[slot];
    landed.current.push({ id: m.id, kind: m.kind, color: m.color, look: m.look, from: { x: m.x, y: m.y }, to, at: t });
    sound(() => look.landSound(m.kind));
    if (!done.current && landed.current.length >= BASKET_FULL) {
      done.current = true;
      // Full once the last thing is in, not when it sets off from the run.
      fullAt.current = t + LAND_MS;
      sound(look.fullSound);
      say(look.full);
      setTimeout(onDone, DONE_AFTER_FULL_MS);
    }
  };

  const busy = (i: number) => marbles.current.some((m) => spotOf(m.section) === i);

  const put = (i: number, piece: Piece, t: number) => {
    build.current[i] = piece;
    keptBuild = [...build.current];
    Object.assign(spots.current[i], { pending: null, swapped: t, hit: -Infinity, angle: 0, spin: 0 });
    sound(() => playKnock(520));
  };

  /** The next part in turn goes into spot i, or waits until the marble inside has rolled out. True when it is back at the first part. */
  const advance = (i: number) => {
    const spot = spots.current[i];
    const next = (PIECES.indexOf(spot.pending ?? build.current[i]) + 1) % PIECES.length;
    if (busy(i)) spot.pending = PIECES[next];
    else put(i, PIECES[next], performance.now());
    return next === 0;
  };

  /** A tap on a spot swaps its part. */
  const swap = (i: number, e: PointerEvent) => {
    if (done.current) return;
    e.stopPropagation();
    advance(i);
  };

  /**
   * The space bar (on a computer) rebuilds the run to the next of all its
   * builds, counting like a car's mileage: the first spot takes its next part,
   * and each time it comes back to the first part the next spot moves on too.
   */
  const rebuildNext = () => {
    if (done.current) return;
    let i = 0;
    while (i < SLOTS.length && advance(i)) i++;
  };

  /** Something on the run was tapped: it reacts, and the wall behind doesn't sparkle. */
  const tapped = (e: PointerEvent) => e.stopPropagation();

  /** A rolling thing gets a little push: a hop with a twirl, and a bit more speed (K-03). */
  const nudge = (m: Marble, t: number) => {
    if (m.fly) return;
    const nearTunnel = m.x > NO_HOP.x0 && m.x < NO_HOP.x1 && Math.abs(m.y - rowY(ROW3, m.x)) < 60;
    if (!nearTunnel) m.nudged = t;
    if (!zoneAt(routeOf(m), m.s)?.speed && !ROLLER[m.kind].float) m.v = Math.min(MAX_SPEED, m.v + NUDGE_BOOST);
    sound(playWhoosh);
  };

  /** The switch flips to the other way, „klack“ (K-01); a marble that hasn't got there yet takes the new way. */
  const flip = (to: Way = way.current === "left" ? "right" : "left") => {
    if (to === way.current) {
      flapHit.current = performance.now();
      sound(playClick);
      return;
    }
    way.current = to;
    sound(() => {
      playKnock(900);
      playClick();
    });
  };

  /**
   * A tap on the barrier (K-02): „Achtung, fertig – los!“ – its arm goes up and
   * the waiting marbles rush off together. While it is up (always with „Von
   * selbst“) a tap rings its little bell.
   */
  const openGate = (t: number) => {
    const g = gate.current;
    g.tapped = t;
    if (g.open || g.step < 4) {
      sound(playDing);
      return;
    }
    g.openedAt = t;
    g.step = 0;
    say({ de: "Achtung, fertig – los!" });
  };

  /** A tap on the basket makes the things in it jump, one after the other. */
  const tapBasket = (e: PointerEvent) => {
    tapped(e);
    basketTapped.current = performance.now();
    sound(playPlop);
  };

  useFrames((dt, t) => {
    now.current = t;
    const onWheel = SLOTS.map(() => false);
    let onSeesaw = false;
    stepGate(t, dt);
    if (t >= flipAt.current) {
      flipAt.current = Infinity;
      flip();
    }
    flap.current += ((way.current === "left" ? FLAP_DOWN : FLAP_UP) - flap.current) * Math.min(1, dt * 14);
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
      if (m.waiting) continue;
      const kind = ROLLER[m.kind];
      const before = m.s;
      const zone = zoneAt(routeOf(m), m.s);
      if (zone?.speed) m.v = zone.speed;
      else if (kind.float) m.v = FLOAT_SPEED;
      else {
        const { slope } = pointAt(routeOf(m), m.s);
        m.v = Math.min(MAX_SPEED, Math.max(MIN_SPEED, m.v + (GRAVITY * slope - FRICTION * m.v) * dt));
      }
      m.s += m.v * kind.pace * dt;
      m.dist += m.v * kind.pace * dt;
      waitAtGate(m, before, t);
      // Fire what it passed; at the end of a section go on to the next one, taking the part that is in the spot, or the way the switch is set to, now.
      for (;;) {
        const route = routeOf(m);
        while (m.next < route.events.length && route.events[m.next].s <= m.s) fire(route.events[m.next++].event, t, m);
        if (m.s < route.total || m.section === lastSection) break;
        m.s -= route.total;
        m.section++;
        m.next = 0;
        const sec = routes.sections[m.section];
        if (sec.kind === "spot") m.piece = build.current[sec.spot];
        else if (sec.kind === "switch") {
          m.way = way.current;
          if (watch) flipAt.current = t + AUTO_FLIP_MS;
        }
      }
      const route = routeOf(m);
      const here = zoneAt(route, m.s);
      const pt = here?.seesaw ? seesawSpot((m.s - here.s0) / (here.s1 - here.s0), tilt.current) : pointAt(route, m.s).pt;
      if (here?.seesaw) onSeesaw = true;
      else if (here?.kind === "wheel") onWheel[spotOf(m.section)] = true;
      m.hop += ((!here && spotOf(m.section) < 0 ? 1 : 0) - m.hop) * Math.min(1, dt * 10);
      m.spin += (pt.x - m.x) / kind.r;
      m.x = pt.x;
      const k = (t - m.nudged) / NUDGE_MS;
      m.y = pt.y - lift(m, t) - (k >= 0 && k < 1 ? NUDGE_H * 4 * k * (1 - k) : 0);
    }
    const arrived = marbles.current.filter((m) => m.section === lastSection && m.s >= routeOf(m).total);
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
   * While the barrier is down, a thing rolling up to it stops with its front at
   * the barrier, or behind the last one waiting, „klick“. When the row would
   * reach back to the turn above, the barrier goes up by itself.
   */
  const waitAtGate = (m: Marble, before: number, t: number) => {
    const g = gate.current;
    if (g.open || m.section !== routes.gate.section || before >= routes.gate.s) return;
    const r = ROLLER[m.kind].r;
    const ahead = queue.current[queue.current.length - 1];
    const stop = ahead ? ahead.s - ROLLER[ahead.kind].r - r - 2 : routes.gate.s - r;
    if (m.s < stop) return;
    m.s = stop;
    m.v = 0;
    m.waiting = true;
    queue.current.push(m);
    sound(playClick);
    if (stop - r < routes.gate.start + 2 * BALL_R) openGate(t);
  };

  /**
   * The barrier: the three notes of „Achtung, fertig – los!“ while its arm goes
   * up, then the waiting marbles rush off together and the little bell rings;
   * a while later, once none is under it, it comes down again.
   */
  const stepGate = (t: number, dt: number) => {
    const g = gate.current;
    const k = (t - g.openedAt) / GO_MS;
    while (g.step < 3 && k >= g.step / 3) {
      const note = [0, 2, 4][g.step++];
      sound(() => playCountNote(note));
    }
    if (g.step === 3 && k >= 1) {
      g.step = 4;
      g.open = true;
      for (const m of queue.current) {
        m.waiting = false;
        m.v = RUSH_SPEED;
      }
      queue.current = [];
      sound(() => {
        playCountNote(7);
        playDing();
        playWhoosh();
      });
    }
    const nearGate = marbles.current.some((m) => m.section === routes.gate.section && Math.abs(m.s - routes.gate.s) < 3 * BALL_R);
    if (!watch && g.open && t - g.openedAt > GO_MS + CLOSE_AFTER_MS && !nearGate) {
      g.open = false;
      sound(() => playKnock(640));
    }
    const target = g.open ? 1 : g.step < 4 ? 1 - (1 - k) ** 2 : 0;
    g.lift += (target - g.lift) * Math.min(1, dt * (target > g.lift ? 30 : 10));
  };

  /**
   * The camera: on a tall screen it shows more of the wall. It stays in the
   * middle of the marbles on their way, but low enough for the first one to
   * see where it goes; before the tap it shows the hopper, afterwards the basket.
   */
  const follow = (dt: number) => {
    const cam = camera.current;
    const el = box.current;
    if (el && el.clientWidth) cam.h = Math.min(TRACK_H + TOP_ROOM, Math.max(VIEW_H, (VIEW_W * el.clientHeight) / el.clientWidth));
    // Things waiting behind the barrier aren't followed: the camera stays up there with them and the shelf.
    const ys = marbles.current.filter((m) => m.id >= followFrom.current && !m.waiting).map((m) => m.y);
    let middle = landed.current.length && !lookingUp.current && !queue.current.length ? TRACK_H : -TOP_ROOM;
    if (ys.length && !lookingUp.current) {
      const lowest = Math.max(...ys);
      middle = Math.max((Math.min(...ys) + lowest) / 2, lowest + LEAD_ROOM - cam.h / 2);
    }
    const top = Math.min(TRACK_H - cam.h, Math.max(-TOP_ROOM, middle - cam.h / 2));
    cam.y += (top - cam.y) * Math.min(1, dt * CAMERA_PULL);
    cam.y = Math.min(TRACK_H - cam.h, Math.max(-TOP_ROOM, cam.y));
  };

  /** The ⬆ button (or the up arrow key): back up to the shelf, to let out the next thing. */
  const lookUp = () => {
    if (lookingUp.current) return;
    lookingUp.current = true;
    followFrom.current = nextId.current;
    sound(playWhoosh);
  };

  /** Lets a thing into the run at the hopper, or first flies it there from the shelf. */
  const release = (kind: Roller, from?: Pt) => {
    const id = nextId.current++;
    const start = from ?? HOPPER;
    lookingUp.current = false;
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
      way: way.current,
      waiting: false,
      s: 0,
      v: 0,
      next: 0,
      spin: 0,
      x: start.x,
      y: start.y,
    });
    sound(look.release[kind]);
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

  /** A key or a tap on the wall: the next thing on the shelf goes, in turn. */
  const open = () => take(turn.current++ % SHELF.things.length);

  /**
   * A key: 1, 2 and 3 let out the thing in that place, any other key the next
   * thing in turn; the space bar rebuilds the run, the up arrow looks up to the shelf.
   */
  useAnyKey((e) => {
    held.current = e.key;
    const place = SHELF.things.findIndex((_, i) => e.key === `${i + 1}`);
    if (e.key === " ") {
      e.preventDefault();
      rebuildNext();
    } else if (e.key === "ArrowUp" && camera.current.y > UP_SHOWN_BELOW) {
      e.preventDefault();
      lookUp();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      flip(e.key === "ArrowLeft" ? "left" : "right");
    } else if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      openGate(performance.now());
    } else if (place >= 0) take(place);
    else open();
  });

  useEffect(() => {
    const onKeyUp = () => {
      held.current = null;
    };
    window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, []);

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
  const started = nextId.current > 0;
  /** What the end needs to draw itself: when each thing arrived, when it got full and when it was tapped. */
  const end = {
    parts: landed.current.map((l) => l.at + LAND_MS).filter((at) => at <= t),
    t,
    fullAge: (t - fullAt.current) / 1000,
    tapAge: (t - basketTapped.current) / 1000,
  };
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
      <TrackLook.Provider value={look}>
        <svg ref={svg} className="run-svg" viewBox={`0 ${cam.y} ${VIEW_W} ${cam.h}`} preserveAspectRatio="xMidYMid meet" aria-label={label}>
          <look.Backdrop />

          {/* The boards the spots sit on */}
          {SLOTS.map((slot, i) => (
            <SpotBoard key={i} slot={slot} />
          ))}

          {/* Rows 1a and 1b with the xylophone */}
          <Xylophone row={ROW1A} hits={bars.current} t={t} onTap={tapBar} />
          <Xylophone row={ROW1B} hits={bars.current} t={t} onTap={tapBar} />

          {/* The ledge, the walls the marble turns at, and the rows */}
          <TrackRail a={{ x: LEDGE.x0, y: LEDGE.y }} b={{ x: LEDGE.x1, y: LEDGE.y }} />
          {TURNS.map((turn, i) => (
            <Wall key={i} turn={turn} index={i} age={age(bumps.current[i])} />
          ))}
          <TrackRail a={{ x: ROW2.from.x + 10, y: ROW2.from.y - 1 }} b={ROW2.to} />
          <TrackRail a={{ x: ROW2B.from.x + 12, y: ROW2B.from.y - 1 }} b={ROW2B.to} />
          {[...ZIGS, ROW4, LEFT2, ROW5, ROW5B, ROW6, ROW7, ROW8].map((row, i) => (
            <TrackRail key={i} a={inset(row.from, row, 10)} b={row.to} />
          ))}
          <Xylophone row={LEFT1} hits={bars.current} t={t} onTap={tapBar} />
          <g
            data-tap
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
              data-tap
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

          {/* Seesaw; a tap tips it */}
          <g
            data-tap
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

          {/* The barrier before the funnel: a tap lifts it (K-02) */}
          <g
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              openGate(performance.now());
            }}
          >
            <Gate
              lift={gate.current.lift}
              open={gate.current.open}
              rang={age(gate.current.tapped)}
              glow={!watch && queue.current.length > 0 && gate.current.step === 4}
            />
          </g>

          {/* The switch at the end of row 3: a tap flips it (K-01) */}
          <g
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              flip();
            }}
          >
            <Switch angle={flap.current + wobble(age(flapHit.current), 7, 30, 7)} />
          </g>

          {/* Row 3, and the back of the end at the bottom (with the flag, the snowman, …) */}
          <TrackRail a={{ x: ROW3.from.x - 16, y: ROW3.from.y - 1 }} b={ROW3.to} />
          <g data-tap onPointerDown={tapBasket}>
            <look.End layer="back" {...end} />
          </g>

          {/* An animal looks out of the tunnel, from behind its roof */}
          <Peek animal={peek.current.animal} age={(t - peek.current.at) / PEEK_MS} />

          <g data-tap onPointerDown={tapBasket}>
            {landed.current.map((l, i) => {
              const k = Math.min(1, (t - l.at) / LAND_MS);
              // A thing that becomes part of the end (a snowman's ball) is gone once it is there.
              if (look.absorb && k >= 1) return null;
              const bounce = (k < 1 ? 0 : wobble((t - l.at - LAND_MS) / 1000, 6, 20, 8)) + wobble(basketAge - i * 0.06, 22, 16, 6);
              const x = l.from.x + (l.to.x - l.from.x) * k;
              const y = l.from.y + (l.to.y - l.from.y) * k * k - Math.abs(bounce) - (ROLLER[l.kind].r - BALL_R) - (look.pileLift?.(end.fullAge) ?? 0);
              return <RollerBody key={l.id} kind={l.kind} color={l.color} look={l.look} x={x} y={y} spin={0} grow={1} />;
            })}
          </g>
          {/* On a computer the keys 1, 2 and 3 under the shelf; behind the marbles rolling past */}
          {!touchOnly && <ShelfKeys held={held.current} onTake={take} />}
          {marbles.current.map((m) => {
            const k = (t - m.nudged) / NUDGE_MS;
            // Waiting behind the barrier, it can't keep still.
            const fidget = m.waiting ? { x: 1.8 * Math.sin(t / 55 + m.id * 1.7), y: 3 * Math.abs(Math.sin(t / 120 + m.id)) } : { x: 0, y: 0 };
            return (
              <g
                key={m.id}
                data-tap
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
                  x={m.x + fidget.x}
                  y={m.y - fidget.y}
                  spin={m.spin + fidget.x / 20 + (k >= 0 && k < 1 ? 4 * Math.PI * k : 0)}
                  grow={Math.min(1, m.dist / runLength)}
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
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              peekOut(performance.now());
            }}
          >
            <Tunnel />
          </g>
          <g data-tap onPointerDown={tapBasket}>
            <look.End layer="front" {...end} />
          </g>
          {glitters.current.map((g) => (
            <Sparkles key={g.id} x={g.x} y={g.y} age={(t - g.at) / GLITTER_MS} />
          ))}

          {/* Where a tap swaps the part: the whole board, with a wrench in the corner */}
          {SLOTS.map((slot, i) => {
            const b = slotBoard(slot);
            const pending = spots.current[i].pending;
            const wx = slot.dir > 0 ? b.x + b.w - 30 : b.x + 30;
            return (
              <g key={i} className="run-spot-tap" data-tap onPointerDown={(e) => swap(i, e)}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill="transparent" />
                <circle cx={wx} cy={b.y + 30} r="24" fill="#fff8e8" stroke="#c48a4d" strokeWidth="3" />
                <text x={wx} y={b.y + 41} fontSize="28" textAnchor="middle" className={pending ? "run-wrench busy" : "run-wrench"}>
                  🔧
                </text>
              </g>
            );
          })}

          <Shelf things={shelf.current} filled={filled.current} color={BRIGHT_COLORS[nextId.current % BRIGHT_COLORS.length]} t={t} onTake={take} />

          {/* Before the first tap and after ⬆: a big hand on the middle thing on the shelf says „tap me“ */}
          {(!started || lookingUp.current) && <ShelfHint />}
          {/* Until the barrier has first been lifted, a big hand points at it while things wait there */}
          {!watch && queue.current.length > 0 && gate.current.openedAt === -Infinity && <GateHint />}
        </svg>
      </TrackLook.Provider>
      {/* Down the run, the ⬆ button in the bottom left corner takes the camera back up to the shelf */}
      {!done.current && !lookingUp.current && cam.y > UP_SHOWN_BELOW && (
        <button
          type="button"
          className="run-up"
          data-tap
          aria-label={tr({ de: "Nach oben", en: "Back up", zh: "回到上面", hi: "ऊपर चलें", es: "Arriba", ar: "إلى الأعلى", ru: "Наверх" })}
          onPointerDown={(e) => {
            e.stopPropagation();
            lookUp();
          }}
        >
          <svg viewBox="-32 -32 64 64" aria-hidden>
            <path className="run-up-arrow" d="M0 -26 L24 2 H10 V26 H-10 V2 H-24 Z" />
          </svg>
        </button>
      )}
      {/* On a computer the space bar at the bottom rebuilds the run */}
      {!touchOnly && !done.current && (
        <button
          type="button"
          className={`run-space${held.current === " " ? " down" : ""}`}
          aria-label={tr({ de: "Leertaste", en: "Space", zh: "空格键", hi: "स्पेस", es: "Espacio", ar: "مسافة", ru: "Пробел" })}
          onPointerDown={(e) => {
            e.stopPropagation();
            rebuildNext();
          }}
        >
          <span className="run-space-wrench" aria-hidden>
            🔧
          </span>
          <svg className="run-space-bar" viewBox="-40 -14 80 28" aria-hidden>
            <path d="M-34 -8 V8 H34 V-8" />
          </svg>
        </button>
      )}
    </div>
  );
}

/** The slightly darker board a spot sits on, with a dashed edge: here something can be swapped. */
function SpotBoard({ slot }: { slot: Slot }) {
  const { board } = useLook();
  const b = slotBoard(slot);
  return <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="28" fill={board.fill} stroke={board.edge} strokeWidth="4" strokeDasharray="14 10" />;
}

/** A thing on the run (or bigger by `scale`, on the shelf), its middle at `x`, `y`, turned by `spin` as it rolls; the run's world draws it. */
function RollerBody({
  kind,
  color,
  look,
  x,
  y,
  spin,
  scale = 1,
  grow = 0,
}: {
  kind: Roller;
  color: string;
  look?: BallLook;
  x: number;
  y: number;
  spin: number;
  scale?: number;
  /** How much of the run lies behind it (0–1). */
  grow?: number;
}) {
  const { Thing } = useLook();
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Thing kind={kind} color={color} look={look} spin={spin} grow={grow} />
    </g>
  );
}

/** The wooden run's things: a marble, a tennis ball, an iron ball, an apple and a soap bubble. */
function WoodenThing({ kind, color, look, spin }: ThingProps) {
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
  return body;
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
  const { shelf } = useLook();
  return (
    <g>
      {/* A sunny glow behind each place, so the things read as buttons: these are to be tapped */}
      {SHELF.things.map((x, i) => (
        <circle key={i} cx={x} cy={SHELF.y - 38} r="54" fill="#fff3a6" stroke={STAR_GOLD} strokeWidth="7" />
      ))}
      <rect x={SHELF.x0} y={SHELF.y} width={SHELF.x1 - SHELF.x0} height="13" rx="6" fill={shelf} stroke={INK} strokeWidth="3" />
      {things.map((kind, i) => {
        const at = shelfSpot(i, kind);
        const age = (t - filled[i] - REFILL_MS) / 1000;
        const k = age < 0 ? 0 : age < 1.5 ? 1 - Math.exp(-age * 7) * Math.cos(age * 22) : 1;
        return (
          <g
            key={i}
            className="run-shelf-thing"
            data-tap
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

/**
 * Says „tap a thing on the shelf, and it rolls“: a big hand points down at the
 * middle thing from the room above the wall, so it covers nothing. It stands
 * still, like every hint here.
 */
function ShelfHint() {
  return (
    <text className="run-hint" x={SHELF.things[1] + 18} y="-26" fontSize="100" textAnchor="middle">
      👇
    </text>
  );
}

/** Under each place on the shelf its number key, which lets out the thing there; it goes down while `held`. */
function ShelfKeys({ held, onTake }: { held: string | null; onTake: (i: number) => void }) {
  return (
    <g>
      {SHELF.things.map((x, i) => (
        <g
          key={i}
          className={`run-key${held === `${i + 1}` ? " down" : ""}`}
          data-tap
          onPointerDown={(e: PointerEvent) => {
            e.stopPropagation();
            onTake(i);
          }}
        >
          <rect x={x - 22} y={SHELF.y + 20} width="44" height="40" rx="10" className="run-key-base" />
          <g className="run-key-top">
            <rect x={x - 22} y={SHELF.y + 16} width="44" height="38" rx="10" className="run-key-face" stroke={INK} strokeWidth="3.5" />
            <text x={x} y={SHELF.y + 45} fontSize="28" fontWeight="800" textAnchor="middle" fill={INK}>
              {i + 1}
            </text>
          </g>
        </g>
      ))}
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
  // Left to right on the wall, whichever way the marble rolls; the rail reaches a bit past where it comes in.
  const right = row.to.x > row.from.x;
  const [lo, hi] = right ? [at(row.from.x - 24), row.to] : [row.to, inset(row.from, row, 10)];
  const slope = (Math.atan((row.to.y - row.from.y) / (row.to.x - row.from.x)) * 180) / Math.PI;
  return (
    <g>
      <TrackRail a={lo} b={at(first.x - 4)} />
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
          <g key={bar.i} transform={`translate(${cx} ${rowY(row, cx) + BALL_R + 9 + dip}) rotate(${slope})`} data-tap onPointerDown={(e) => onTap(bar.i, e)}>
            {/* Taller than the bar, so a small finger finds it */}
            <rect x={-bar.w / 2 + 2} y={-62} width={bar.w - 4} height={100} fill="transparent" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill={BAR_COLORS[bar.i % BAR_COLORS.length]} stroke={INK} strokeWidth="3" />
            <rect x={-bar.w / 2} y={-9} width={bar.w} height={18} rx={6} fill="#fff" opacity={age >= 0 && age < 1 ? 0.7 * Math.exp(-age * 6) : 0} />
            <circle cx={-bar.w / 2 + 10} cy="0" r="3" fill="#fff8" />
            <circle cx={bar.w / 2 - 10} cy="0" r="3" fill="#fff8" />
          </g>
        );
      })}
      <TrackRail a={at(last.x + last.w + 4)} b={hi} />
    </g>
  );
}

/**
 * The switch at the end of row 3 (K-01): a flap on a hinge, lifted to the right
 * or hanging down in the marble's way (`angle` in degrees), and a thick lever
 * with a red knob that leans towards the way the marble will go.
 */
function Switch({ angle }: { angle: number }) {
  const { hinge, length } = SWITCH;
  const down = (angle - FLAP_UP) / (FLAP_DOWN - FLAP_UP);
  const lever = 35 - 70 * down;
  return (
    <g>
      <circle cx={hinge.x} cy={hinge.y - 40} r="95" fill="transparent" />
      <g transform={`translate(${hinge.x} ${hinge.y}) rotate(${lever})`}>
        <rect x="-9" y="-86" width="18" height="86" rx="9" fill="#8a5a2b" stroke={INK} strokeWidth="3" />
        <circle cy="-92" r="24" fill="#ff5d73" stroke={INK} strokeWidth="4" />
        <circle cx="-8" cy="-100" r="7" fill="#fff" opacity="0.7" />
      </g>
      <g transform={`translate(${hinge.x} ${hinge.y}) rotate(${angle})`}>
        <rect x="-9" y="-4" width="18" height={length} rx="8" fill="#ffb703" stroke={INK} strokeWidth="3" />
      </g>
      <circle cx={hinge.x} cy={hinge.y} r="13" fill="#b8763d" stroke={INK} strokeWidth="3" />
      <circle cx={hinge.x} cy={hinge.y} r="4" fill={INK} />
    </g>
  );
}

/** Where the barrier's arm hangs from: just in front of the first waiting marble, high enough for every thing to pass under the lifted arm. */
const gatePivot = (): Pt => ({ x: GATE.x - 8, y: rowY(ROW2, GATE.x) - 100 });

/**
 * The barrier before the funnel (K-02): a red-and-white arm hanging from a
 * round sign on the wall down onto the rail, swinging up to the left by `lift`
 * (0–1). The sign is red with a bar until the marbles can pass and green with a
 * tick while they can, and wobbles `rang` seconds after a tap; while things wait, a sunny
 * `glow` behind it marks it as what to tap.
 */
function Gate({ lift, open, rang, glow }: { lift: number; open: boolean; rang: number; glow: boolean }) {
  const p = gatePivot();
  const length = 118;
  return (
    <g>
      <rect x={GATE.x - 85} y={p.y - 80} width="95" height="210" fill="transparent" />
      {glow && <circle cx={p.x} cy={p.y} r="54" fill="#fff3a6" stroke={STAR_GOLD} strokeWidth="7" />}
      <g transform={`translate(${p.x} ${p.y}) rotate(${90 * lift + wobble(rang, 6, 20, 5)})`}>
        <rect x="-8" y="-4" width="16" height={length} rx="8" fill="#fff" stroke={INK} strokeWidth="3" />
        {[14, 46, 78].map((y) => (
          <rect key={y} x="-6.5" y={y} width="13" height="16" fill="#ff5d73" />
        ))}
        <rect x="-8" y="-4" width="16" height={length} rx="8" fill="none" stroke={INK} strokeWidth="3" />
      </g>
      <g transform={`translate(${p.x} ${p.y}) rotate(${wobble(rang, 14, 16, 3)})`}>
        <circle r="30" fill={open ? "#3ec300" : "#ff5d73"} stroke={INK} strokeWidth="4" />
        {open ? (
          <path d="M-13 1 L-4 10 L14 -9" fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <rect x="-17" y="-5" width="34" height="10" rx="4" fill="#fff" />
        )}
      </g>
    </g>
  );
}

/** A big still hand pointing at the barrier from the left while things wait behind it, until it is first lifted. */
function GateHint() {
  const p = gatePivot();
  return (
    <text className="run-hint" x={p.x - 88} y={p.y + 28} fontSize="76" textAnchor="middle">
      👉
    </text>
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
          <TrackRail a={slot.from} b={slot.to} />
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
            <TrackRail a={{ x: f.cx - slot.dir * 20, y: slot.to.y }} b={slot.to} />
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
  const { post } = useLook();
  const side = turnSide(turn);
  const top = turn.from.y - 70;
  const bottom = turn.bottom ?? turn.to.y + 40;
  const y = turn.from.y + 3;
  const flash = age >= 0 && age < 1 ? Math.exp(-age * 6) : 0;
  const squash = age >= 0 && age < 1 ? 5 * Math.exp(-age * 9) * Math.cos(age * 30) : 0;
  return (
    <g>
      <rect x={side > 0 ? turn.x : turn.x - 18} y={top} width="18" height={bottom - top} rx="6" fill={post} stroke={INK} strokeWidth="3" />
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
      <TrackRail a={inset(ROW4B.from, ROW4B, 10)} b={ROW4B.to} />
      <TrackRail a={LOOP_OUT.from} b={LOOP_OUT.to} />
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
          <g key={i} transform={`rotate(${wobble(age, 16, 8, 1.6)} ${chime.x} ${y + 6})`} data-tap onPointerDown={(e) => onTap(i, e)}>
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
  const { hopper } = useLook();
  return (
    <g>
      <path
        d={`M${HOPPER.x - 58} -10 L${HOPPER.x + 58} -10 L${HOPPER.x + 28} 62 L${HOPPER.x - 28} 62 Z`}
        fill={hopper}
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
  const { tunnel } = useLook();
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
        fill={tunnel.fill}
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {[0.25, 0.5, 0.75].map((k) => {
        const x = x0 + (x1 - x0) * k;
        return <line key={k} x1={x} y1={y(x) - 52} x2={x} y2={y(x) + BALL_R + 16} stroke={tunnel.lines} strokeWidth="6" />;
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

/** The end of the wooden run: the basket, and the flag springing up out of it when it is full. */
function WoodenEnd({ layer, fullAge }: EndProps) {
  if (layer === "front") return <Basket />;
  return (
    <g>
      <ellipse cx={(BASKET.x0 + BASKET.x1) / 2} cy={BASKET.rimY} rx={(BASKET.x1 - BASKET.x0) / 2} ry="14" fill="#6b4220" />
      {fullAge >= 0 && <Flag rise={Math.min(1, (fullAge * 1000) / FLAG_MS)} sway={wobble(fullAge, 10, 9, 1.5)} />}
    </g>
  );
}

/** The wooden wall with its rows of pegs, drawn once. */
const WoodenBackdrop = memo(function WoodenBackdrop() {
  const pegs = useId();
  return (
    <g>
      <defs>
        <pattern id={pegs} width="50" height="50" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="4.5" fill="#d7ac72" />
        </pattern>
      </defs>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill="#f3d5a4" />
      <rect x="-400" y="-200" width={VIEW_W + 800} height={TRACK_H + 400} fill={`url(#${pegs})`} />
    </g>
  );
});

/** The wooden run, the first and plainest world. */
export const WOODEN: TrackTheme = {
  level: "track",
  Backdrop: WoodenBackdrop,
  Rail,
  board: { fill: "#e9c08a", edge: "#c48a4d" },
  post: "#b8763d",
  shelf: "#b8763d",
  hopper: "#8e7dff",
  tunnel: { fill: "#3ec300", lines: "#2a9100" },
  Thing: WoodenThing,
  release: { marble: playPop, tennis: playBoing, iron: playRumble, apple: () => playKnock(480), bubble: playBlub },
  landSound: (kind) => (kind === "iron" ? playThump() : playPlop()),
  fullSound: playBells,
  full: {
    de: "Der Korb ist voll!",
    en: "The basket is full!",
    zh: "篮子满啦！",
    hi: "टोकरी भर गई!",
    es: "¡La cesta está llena!",
    ar: "السلة ممتلئة!",
    ru: "Корзина полна!",
  },
  peekers: ["🐭", "🐸", "🐰", "🐱", "🐻", "🐥"],
  magic: true,
  End: WoodenEnd,
};

/** The run's world, inside the run. */
function useLook(): TrackTheme {
  return useContext(TrackLook) ?? WOODEN;
}

/** A rail in the run's world. */
function TrackRail(props: { a: Pt; b: Pt }) {
  const { Rail: WorldRail } = useLook();
  return <WorldRail {...props} />;
}

/** „Klingende Kugelbahn“: the wooden run. */
export const TrackLevel = (props: LevelProps) => <Run {...props} look={WOODEN} />;
/** „Schneebahn“: snowballs that grow on the way and build a snowman at the end (K-18). */
export const SnowTrackLevel = (props: LevelProps) => <Run {...props} look={SNOW_TRACK} />;
/** „Weltraumbahn“: planets, moon and stars roll down to the moon; shooting stars at the end (K-18). */
export const SpaceTrackLevel = (props: LevelProps) => <Run {...props} look={SPACE_TRACK} />;
/** „Wasserrutsche“: beach ball, swim ring and rubber duck slide down blue chutes into a pool (K-18). */
export const SlideTrackLevel = (props: LevelProps) => <Run {...props} look={SLIDE_TRACK} />;
/** „Baustellen-Bahn“: tyre, stone and log ride conveyor belts into a skip that the crane lifts (K-18). */
export const SiteTrackLevel = (props: LevelProps) => <Run {...props} look={SITE_TRACK} />;
