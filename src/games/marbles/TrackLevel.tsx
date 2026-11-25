import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { BRIGHT_COLORS } from "@/components/TapFeedback";
import {
  cameraLayer,
  cameraPoint,
  gliding,
  type LevelProps,
  useAnyKey,
  useFrames,
  useLevelName,
  levelNow,
  useLevelTimers,
  VIEW_H,
  VIEW_W,
  wobble,
  worldHint,
} from "./level";
import { TapHint } from "@/components/TapHint";
import type { BallLook } from "./parts";
import { SITE_TRACK } from "./siteTrack";
import { SLIDE_TRACK } from "./slideTrack";
import { SNOW_TRACK } from "./snowTrack";
import { SPACE_TRACK } from "./spaceTrack";
import { COLOR_TRACK } from "./colorTrack";
import { type ColorSort, INK, TrackLook, type TrackTheme } from "./trackTheme";
import { BALL_R, type Pt } from "./path";
import { useDevice } from "@/lib/device";
import { useAppLanguage, useT } from "@/lib/language";
import { songBeat, songFor } from "./song";
import { shuffle } from "@/lib/random";
import {
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
  playSongNote,
  playSqueak,
  playSwirl,
  playThump,
  playTick,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { loadRealSounds } from "@/lib/realSounds";
import {
  BAR_STEP,
  BARS,
  BASKET_FULL,
  BASKET_SLOTS,
  buildRoutes,
  CHIMES,
  DEFAULT_BUILD,
  DRUMS,
  HOPPER,
  LEDGE,
  SONG_BARS,
  SONG_SPEED,
  LEFT1,
  LEFT2,
  PIECES,
  pointAt,
  ROW1A,
  ROW1B,
  ROW2,
  ROW2B,
  ROW3,
  ROW4,
  ROW5,
  ROW5B,
  ROW6,
  ROW7,
  ROW8,
  ROW9,
  ROLL,
  ROLLER,
  ROLLERS,
  rolled,
  rowY,
  SEESAW,
  seesawSpot,
  SHELF,
  shelfSpot,
  slotBoard,
  SLOTS,
  TRACK_H,
  TUNNEL,
  wheelIn,
  ZIGS,
  type Piece,
  type Roller,
  type Route,
  type TrackEvent,
  type Way,
} from "./track";
import {
  BubblePop,
  Chimes,
  Drum,
  FLAP_DOWN,
  FLAP_UP,
  Gate,
  Hopper,
  inset,
  Loop,
  Peek,
  RollerBody,
  Shelf,
  SHELF_SPOT,
  ShelfKeys,
  Sparkles,
  Spot,
  SpotBoard,
  STAR_GOLD,
  StretchArt,
  Switch,
  TrackRail,
  Tunnel,
  Wall,
  WOODEN,
  Xylophone,
} from "./trackParts";
import "./track.css";

const LAND_MS = 380;
const DONE_AFTER_FULL_MS = 2200;
/** A thing picked from the shelf flies into the hopper first. */
const FLY_MS = 380;
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
/** The switch flips by itself this long after a marble has taken a way (K-01), so the next one takes the other. */
const AUTO_FLIP_MS = 700;
/**
 * One tap lets out one thing, never more, and nothing leaves the shelf by itself (user decision, 25 November 2026: the
 * shelf letting out the next every two seconds looked as if one tap dropped several marbles). Once nothing is on the
 * run any more and the basket isn't full, the camera goes back up to the shelf this long after, where the hint marks
 * the next thing to tap.
 */
const LOOK_UP_AFTER_MS = 2500;

/**
 * What the magic tunnel does to a marble (K-06), in turn from a random start,
 * so each one comes out different: another colour, stripes, a golden star,
 * dots, or an animal looks out. Other things keep their look; for them an
 * animal looks out.
 */
type Magic = "color" | "stripes" | "star" | "peek" | "dots";
const MAGIC: Magic[] = ["color", "stripes", "star", "peek", "dots"];

/** The camera keeps the lowest marble at least this far above the bottom edge, so it sees where it goes. */
const LEAD_ROOM = 260;
/** How quickly the camera catches up, per second. */
const CAMERA_PULL = 4;
/**
 * The camera may go this far above the wall's top, so the shelf and the hopper
 * sit a bit lower in the picture, clear of the top edge and the ✕.
 */
const TOP_ROOM = 160;
/** All of the wall the camera can show, drawn once as a layer of its own that the camera moves. */
const WALL = { x: 0, y: -TOP_ROOM, w: VIEW_W, h: TRACK_H + TOP_ROOM };
/** With the camera's top lower than this on the wall, the shelf is cut off, and the ⬆ button shows. */
const UP_SHOWN_BELOW = 40;

/** Seconds since a hit, held at `SETTLED_S`: by then every wobble and flash is over, so a part nobody hit stops changing and `still` can skip it. */
const SETTLED_S = 8;

/** Half the side, in world units, of the small layer a rolling thing is drawn in: its tap circle (56) and a bit more, since the layer shows what lies outside it too. */
const MARBLE_PAD = 60;

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
  /** The line of the song it plays on row 1 (K-11), counted from the round's first; -1 before its first bar. */
  line: number;
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
 * a whole scale, and goes down its world's own stretch (`trackStretches.ts`: the
 * wooden run's helix tower, step lifter and tipping troughs) into the basket – each its own way: the tennis
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
 * The same run comes in other worlds too (K-18, `look`): colours, snow, space, a water
 * slide and a building site, each with its own wall, things, stretch down the lower wall and end.
 */
function Run({ sound, say, onDone, onGoal, look }: LevelProps & { look: TrackTheme }) {
  const label = useLevelName(look.level);
  // `t` is the time everywhere here, so the translation helper gets another name.
  const tr = useT();
  // What comes a moment after a landing (its note, the end) is dropped when the run is left before it.
  const { later } = useLevelTimers();
  const routes = useMemo(() => buildRoutes(look.stretch), [look]);
  useEffect(() => loadRealSounds([...Object.values(look.release), look.landSound, look.fullSound]), [look]);
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
  /** The tube that got full first, in a run that sorts by colour. */
  const fullTube = useRef(-1);
  /** How long a thing takes from the run's end to where it comes to rest. */
  const landMs = look.sort?.hopMs ?? LAND_MS;
  const bars = useRef(never(BARS.length));
  const bumps = useRef(never(routes.turns.length));
  /** When each cue of the world's own stretch last fired (its tower, ski jump, orbit, …). */
  const cues = useRef(never(look.stretch.cues));
  const drums = useRef(never(DRUMS.length));
  const chimes = useRef(never(CHIMES.length));
  const looped = useRef(-Infinity);
  /** The song row 1 plays (K-11), the one children of the app language know, and the next line to give out. */
  const song = songFor(useAppLanguage().id);
  const songLine = useRef(0);
  const tilt = useRef(SEESAW.rest);
  const seesawTapped = useRef(-Infinity);
  const basketTapped = useRef(-Infinity);
  const glitters = useRef<Glitter[]>([]);
  const peek = useRef({ at: -Infinity, animal: look.peekers[0] });
  const [magicStart] = useState(() => Math.floor(Math.random() * MAGIC.length));
  const svg = useRef<SVGSVGElement>(null);
  const done = useRef(false);
  const now = useRef(levelNow());
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
  // A run that sorts by colour (K-10) always has one marble of each colour there.
  const [firstShelf] = useState<Roller[]>(() => (look.sort ? look.sort.colors.map(() => "marble") : shuffle(ROLLERS).slice(0, SHELF.things.length)));
  const shelf = useRef(firstShelf);
  const filled = useRef(SHELF.things.map(() => -Infinity));
  const turn = useRef(0);
  const pops = useRef<{ id: number; x: number; y: number; at: number }[]>([]);
  /** The key held down just now, so its cap on the screen goes down too (the picture is drawn on every frame anyway). */
  const held = useRef<string | null>(null);
  const { touchOnly } = useDevice();
  /** When a finger last tapped the barrier (K-02), which always stays up: nothing waits behind it for a tap. */
  const gateTapped = useRef(-Infinity);
  /** Since when nothing is on the run (ms; Infinity while something is), for the camera to go back up (`LOOK_UP_AFTER_MS`). */
  const emptySince = useRef(Infinity);
  /** The switch (K-01): the way it is set to, its flap's angle, when a marble last knocked the flap, and when it flips by itself. */
  const way = useRef<Way>("right");
  const flap = useRef(FLAP_UP);
  const flapHit = useRef(-Infinity);
  const flipAt = useRef(Infinity);
  /** When a tap or key last reached the run (ms): what it set off draws until `SETTLED_S` later. */
  const stirred = useRef(-Infinity);
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

  /**
   * „Kugel-Lied“ (K-11): a thing reaching the first bar of row 1 takes the song's next line, and each bar it rolls over
   * plays that line's next beat – a note ringing as long as it is held, or, on a held beat, only the bar lights up. Over
   * these bars it rolls at an even speed (`SONG_SPEED`), so the beat is steady; something heavy plays the line deep.
   * After the bar of the song's last line the whole run dances once (`dance`).
   */
  const singBar = (bar: number, t: number, m: Marble) => {
    if (bar === 0 || m.line < 0) m.line = songLine.current++;
    bars.current[bar] = t;
    const lines = song.lines;
    const line = lines[m.line % lines.length];
    const beat = songBeat(line, bar);
    if (beat) {
      const beatS = BAR_STEP / (SONG_SPEED * ROLLER[m.kind].pace);
      sound(() => playSongNote(beat.freq, beat.beats * beatS, m.kind === "iron"));
    }
    if (bar === SONG_BARS - 1 && m.line % lines.length === lines.length - 1) dance(t);
  };

  /** The song is over: every part of the run sways, swings, flashes or hops once at the same moment, with a soft twinkle. */
  const dance = (t: number) => {
    stirred.current = t;
    bars.current.fill(t);
    drums.current.fill(t);
    chimes.current.fill(t);
    cues.current.fill(t);
    for (const spot of spots.current) spot.hit = t;
    seesawTapped.current = t;
    basketTapped.current = t;
    gateTapped.current = t;
    flapHit.current = t;
    looped.current = t;
    sound(playTwinkle);
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
        if (event.bar < SONG_BARS) singBar(event.bar, t, m);
        else playBar(event.bar, t, kind);
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
      case "cue":
        cues.current[event.cue] = t;
        sound(() => look.cue(event.cue, kind));
        break;
      case "gate":
      case "basket":
        break;
    }
  };

  const land = (m: Marble, t: number) => {
    // The first thing in the basket or a tube wins the level's trophy.
    if (landed.current.length === 0) onGoal?.();
    if (look.sort) {
      landInTube(m, t, look.sort);
      return;
    }
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
      later(onDone, DONE_AFTER_FULL_MS);
    }
  };

  /**
   * A run that sorts by colour (K-10): the marble hops into the tube of its
   * colour, a note one step higher for each marble already in it, and the
   * voice counts „Drei rote!“ – the newest count cutting off the one before,
   * so it never lags behind the tube. The first full tube ends the run.
   */
  const landInTube = (m: Marble, t: number, sort: ColorSort) => {
    const tube = Math.max(0, sort.colors.indexOf(m.color));
    const n = landed.current.filter((l) => l.color === m.color).length;
    const to = sort.landAt(tube, n);
    landed.current.push({ id: m.id, kind: m.kind, color: m.color, look: m.look, from: { x: m.x, y: m.y }, to, at: t });
    sound(playWhoosh);
    later(() => {
      sound(() => {
        look.landSound(m.kind);
        playCountNote(n);
      });
      const line = sort.count(tube, n + 1);
      if (line) say(line, false);
    }, sort.hopMs);
    if (!done.current && n + 1 >= sort.full) {
      done.current = true;
      fullTube.current = tube;
      fullAt.current = t + sort.hopMs;
      later(() => {
        sound(look.fullSound);
        say(look.full);
      }, sort.hopMs);
      later(onDone, sort.hopMs + DONE_AFTER_FULL_MS);
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
    else put(i, PIECES[next], levelNow());
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

  /** A finger on a thing of the world's own stretch: it moves and sounds as when a marble passes (the tap's time is `stirred`, set as the finger landed). */
  const tapCue = (cue: number, e: PointerEvent) => {
    tapped(e);
    cues.current[cue] = stirred.current;
    sound(() => look.cue(cue, "marble"));
  };

  /** A rolling thing gets a little push: a hop with a twirl, and a bit more speed (K-03). */
  const nudge = (m: Marble, t: number) => {
    if (m.fly) return;
    const nearTunnel = m.x > NO_HOP.x0 && m.x < NO_HOP.x1 && Math.abs(m.y - rowY(ROW3, m.x)) < 60;
    const zone = zoneAt(routeOf(m), m.s);
    // Riding a chair or a bucket, or inside a wormhole, it stays where it is.
    if (!nearTunnel && !zone?.carry && !zone?.scale) m.nudged = t;
    if (!zone?.speed && !ROLLER[m.kind].float) m.v = Math.min(ROLL.max, m.v + NUDGE_BOOST);
    sound(playWhoosh);
  };

  /** The switch flips to the other way, „klack“ (K-01); a marble that hasn't got there yet takes the new way. */
  const flip = (to: Way = way.current === "left" ? "right" : "left") => {
    if (to === way.current) {
      flapHit.current = levelNow();
      sound(playClick);
      return;
    }
    way.current = to;
    sound(() => {
      playKnock(900);
      playClick();
    });
  };

  /** A tap on the barrier (K-02), which stays up: it wobbles and rings its little bell. */
  const ringGate = (t: number) => {
    gateTapped.current = t;
    sound(playDing);
  };

  /** A tap on the basket makes the things in it jump, one after the other. */
  const tapBasket = (e: PointerEvent) => {
    tapped(e);
    basketTapped.current = levelNow();
    sound(playPlop);
  };

  useFrames((dt, t) => {
    now.current = t;
    const onWheel = SLOTS.map(() => false);
    let onSeesaw = false;
    backToShelf(t);
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
      const kind = ROLLER[m.kind];
      const zone = zoneAt(routeOf(m), m.s);
      if (zone?.speed) m.v = zone.speed;
      else if (kind.float) m.v = ROLL.float;
      else m.v = rolled(m.v, pointAt(routeOf(m), m.s).slope, dt);
      m.s += m.v * kind.pace * dt;
      m.dist += m.v * kind.pace * dt;
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
          flipAt.current = t + AUTO_FLIP_MS;
        }
      }
      const route = routeOf(m);
      const here = zoneAt(route, m.s);
      const pt = here?.seesaw ? seesawSpot((m.s - here.s0) / (here.s1 - here.s0), tilt.current) : pointAt(route, m.s).pt;
      if (here?.seesaw) onSeesaw = true;
      else if (here?.kind === "wheel") onWheel[spotOf(m.section)] = true;
      // The tennis ball hops along the rows, also over the song's bars, which only set an even speed (K-11).
      m.hop += (((!here || here.kind === "note") && spotOf(m.section) < 0 ? 1 : 0) - m.hop) * Math.min(1, dt * 10);
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
    const panning = follow(dt);
    // Still while nothing is on the run, every part has swung back and the last tap's, key's or landing's wobble is over
    // (`SETTLED_S`); once full, the end draws on, since some ends keep moving (the pool's fountains).
    const lastStir = Math.max(stirred.current, ...cues.current, ...landed.current.map((l) => l.at + landMs));
    return (
      done.current ||
      panning ||
      marbles.current.length > 0 ||
      pops.current.length > 0 ||
      glitters.current.length > 0 ||
      gliding(flap.current * 1000, (way.current === "left" ? FLAP_DOWN : FLAP_UP) * 1000) ||
      gliding(tilt.current * 1000, target * 1000) ||
      spots.current.some((spot) => Math.abs(spot.spin) > 0.001) ||
      t - lastStir < SETTLED_S * 1000
    );
  });

  /**
   * Nothing leaves the shelf by itself: once the run is empty and the basket not yet full, the camera goes back up to the
   * shelf a moment later (`LOOK_UP_AFTER_MS`), quietly, where the hint waits for the next tap.
   */
  const backToShelf = (t: number) => {
    if (done.current || nextId.current === 0 || marbles.current.length > 0 || lookingUp.current) {
      emptySince.current = Infinity;
      return;
    }
    if (emptySince.current === Infinity) emptySince.current = t;
    else if (t - emptySince.current >= LOOK_UP_AFTER_MS) lookUp(false);
  };

  /**
   * The camera: on a tall screen it shows more of the wall. It stays in the
   * middle of the marbles on their way, but low enough for the first one to
   * see where it goes; before the tap it shows the hopper, afterwards the basket.
   */
  const follow = (dt: number) => {
    const cam = camera.current;
    const el = box.current;
    if (el?.clientWidth) cam.h = Math.min(TRACK_H + TOP_ROOM, Math.max(VIEW_H, (VIEW_W * el.clientHeight) / el.clientWidth));
    const ys = marbles.current.filter((m) => m.id >= followFrom.current).map((m) => m.y);
    let middle = landed.current.length && !lookingUp.current ? TRACK_H : -TOP_ROOM;
    if (ys.length && !lookingUp.current) {
      const lowest = Math.max(...ys);
      middle = Math.max((Math.min(...ys) + lowest) / 2, lowest + LEAD_ROOM - cam.h / 2);
    }
    const top = Math.min(TRACK_H - cam.h, Math.max(-TOP_ROOM, middle - cam.h / 2));
    const from = { ...cam };
    cam.y += (top - cam.y) * Math.min(1, dt * CAMERA_PULL);
    cam.y = Math.min(TRACK_H - cam.h, Math.max(-TOP_ROOM, cam.y));
    // Whether the camera is still on its way (or the screen's shape changed it).
    return gliding(from.y, top) || from.h !== cam.h;
  };

  /** The ⬆ button (or the up arrow key, or the run being empty): back up to the shelf, to let out the next thing. */
  const lookUp = (whoosh = true) => {
    if (lookingUp.current) return;
    lookingUp.current = true;
    followFrom.current = nextId.current;
    if (whoosh) sound(playWhoosh);
  };

  /** Lets a thing into the run at the hopper, or first flies it there from the shelf. */
  const release = (kind: Roller, from?: Pt, color?: string) => {
    const id = nextId.current++;
    const start = from ?? HOPPER;
    lookingUp.current = false;
    marbles.current.push({
      id,
      kind,
      color: color ?? BRIGHT_COLORS[id % BRIGHT_COLORS.length],
      look: "plain",
      nudged: -Infinity,
      line: -1,
      fly: from ? { from, at: levelNow() } : null,
      dist: 0,
      hop: 0,
      section: 0,
      piece: build.current[0],
      way: way.current,
      s: 0,
      v: 0,
      next: 0,
      spin: 0,
      x: start.x,
      y: start.y,
    });
    sound(look.release[kind]);
  };

  /** The i-th thing on the shelf goes into the hopper, and something else pops up in its place (sorting by colour, the same again). */
  const take = (i: number) => {
    if (done.current) return;
    if (look.sort) {
      release("marble", shelfSpot(i, "marble"), look.sort.colors[i]);
      filled.current[i] = levelNow();
      return;
    }
    release(shelf.current[i], shelfSpot(i, shelf.current[i]));
    const others = shelf.current.filter((_, j) => j !== i);
    const choices = ROLLERS.filter((r) => r !== shelf.current[i] && !others.includes(r));
    shelf.current[i] = choices[Math.floor(Math.random() * choices.length)];
    filled.current[i] = levelNow();
  };

  /** A key or a tap on the wall: the next thing on the shelf goes, in turn. */
  const open = () => take(turn.current++ % SHELF.things.length);

  /**
   * A key: 1, 2 and 3 let out the thing in that place, any other key the next
   * thing in turn; the space bar rebuilds the run, the up arrow looks up to the shelf.
   */
  useAnyKey((e) => {
    stirred.current = levelNow();
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
      ringGate(levelNow());
    } else if (place >= 0) take(place);
    else open();
  });

  useEffect(() => {
    const onKeyUp = () => {
      stirred.current = levelNow();
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
    sparkle(p.x, p.y, levelNow());
    sound(playTwinkle);
  };

  const t = now.current;
  const started = nextId.current > 0;
  /** What the end needs to draw itself: when each thing arrived, when it got full and when it was tapped. */
  const end = {
    parts: landed.current.map((l) => l.at + landMs).filter((at) => at <= t),
    t,
    fullAge: (t - fullAt.current) / 1000,
    tapAge: (t - basketTapped.current) / 1000,
    fullTube: fullTube.current,
  };
  const spot = (i: number, layer: "back" | "front") => (
    <Spot
      key={i}
      slot={SLOTS[i]}
      piece={build.current[i]}
      age={age(spots.current[i].swapped)}
      hitAge={age(spots.current[i].hit)}
      angle={spots.current[i].angle}
      layer={layer}
    />
  );
  const cam = camera.current;
  const age = (hit: number) => Math.min(SETTLED_S, (t - hit) / 1000);
  const barAges = bars.current.map(age);
  const cueAges = cues.current.map(age);
  const basketAge = age(basketTapped.current);
  const tapBar = (i: number, e: PointerEvent) => {
    tapped(e);
    playBar(i, levelNow());
  };

  const layerBox = `0 ${-TOP_ROOM} ${VIEW_W} ${TRACK_H + TOP_ROOM}`;
  const unit = (Number(cameraLayer(box.current, WALL, { x: 0, y: cam.y, w: VIEW_W, h: cam.h }).width) || VIEW_W) / VIEW_W;
  const layerStyle = cameraLayer(box.current, WALL, { x: 0, y: cam.y, w: VIEW_W, h: cam.h });
  const at = cameraPoint(box.current, WALL, { x: 0, y: cam.y, w: VIEW_W, h: cam.h });
  return (
    <div
      className="run-level"
      ref={box}
      onPointerDown={tapWall}
      // Every tap – also on a part, which stops its event there – draws the run again until its wobble is over.
      onPointerDownCapture={() => {
        stirred.current = levelNow();
      }}
    >
      <TrackLook.Provider value={look}>
        <svg ref={svg} className="marble-camera" viewBox={layerBox} style={layerStyle} aria-label={label}>
          <look.Backdrop />

          {/* The boards the spots sit on */}
          {SLOTS.map((slot, i) => (
            <SpotBoard key={i} slot={slot} />
          ))}

          {/* Rows 1a and 1b with the xylophone */}
          <Xylophone row={ROW1A} ages={barAges} onTap={tapBar} />
          <Xylophone row={ROW1B} ages={barAges} onTap={tapBar} />

          {/* The ledge, the walls the marble turns at, and the rows */}
          <TrackRail a={{ x: LEDGE.x0, y: LEDGE.y }} b={{ x: LEDGE.x1, y: LEDGE.y }} />
          {routes.turns.map((turn, i) => (
            <Wall key={i} turn={turn} index={i} age={age(bumps.current[i])} />
          ))}
          <TrackRail a={{ x: ROW2.from.x + 10, y: ROW2.from.y - 1 }} b={ROW2.to} />
          <TrackRail a={{ x: ROW2B.from.x + 12, y: ROW2B.from.y - 1 }} b={ROW2B.to} />
          {[...ZIGS, ROW4, LEFT2, ROW5, ROW5B, ROW6, ROW7, ROW8].map((row, i) => (
            <TrackRail key={i} a={inset(row.from, row, 10)} b={row.to} />
          ))}
          <Xylophone row={LEFT1} ages={barAges} onTap={tapBar} />
          <g
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              looped.current = levelNow();
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
                playDrum(i, levelNow());
              }}
            >
              <Drum i={i} age={age(drums.current[i])} />
            </g>
          ))}
          <Chimes
            ages={chimes.current.map(age)}
            onTap={(i, e) => {
              tapped(e);
              playChimeAt(i, levelNow());
            }}
          />
          <Xylophone row={ROW9} ages={barAges} onTap={tapBar} />

          {/* The world's own stretch down the lower wall: its rails, and its towers, hills and things */}
          {look.stretch.rails.map((row, i) => (
            <TrackRail key={i} a={inset(row.from, row, 10)} b={row.to} />
          ))}
          <StretchArt layer="back" ages={cueAges} onTap={tapCue} />

          {SLOTS.map((_, i) => spot(i, "back"))}

          {/* Seesaw; a tap tips it */}
          <g
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              seesawTapped.current = levelNow();
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

          {/* The barrier before the funnel, always up: a tap rings it (K-02) */}
          <g
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              ringGate(levelNow());
            }}
          >
            <Gate rang={age(gateTapped.current)} />
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
              const k = Math.min(1, (t - l.at) / landMs);
              // A thing that becomes part of the end (a snowman's ball) is gone once it is there.
              if (look.absorb && k >= 1) return null;
              const bounce = (k < 1 ? 0 : wobble((t - l.at - landMs) / 1000, 6, 20, 8)) + wobble(basketAge - i * 0.06, 22, 16, 6);
              const hop = look.sort?.hop(l.from, l.to, k);
              const x = hop?.x ?? l.from.x + (l.to.x - l.from.x) * k;
              const y =
                (hop?.y ?? l.from.y + (l.to.y - l.from.y) * k * k) - Math.abs(bounce) - (ROLLER[l.kind].r - BALL_R) - (look.pileLift?.(end.fullAge) ?? 0);
              return <RollerBody key={l.id} kind={l.kind} color={l.color} look={l.look} x={x} y={y} spin={0} grow={1} />;
            })}
          </g>
          {/* On a computer the keys 1, 2 and 3 under the shelf; behind the marbles rolling past */}
          {!touchOnly && <ShelfKeys held={held.current} onTake={take} />}
        </svg>
        {/* Each thing rolling on the run is a small layer of its own, moved by a transform: moving inside the big svg made a phone paint all of it again in every frame (A-29) */}
        <div className="marble-camera run-layer" style={layerStyle}>
          {marbles.current.map((m) => {
            const k = (t - m.nudged) / NUDGE_MS;
            // Riding a chair or a bucket (`carry`), or shrinking into a wormhole and growing out of it (`scale`).
            const zone = m.fly ? undefined : zoneAt(routeOf(m), m.s);
            const along = zone ? Math.min(1, Math.max(0, (m.s - zone.s0) / (zone.s1 - zone.s0))) : 0;
            const size = zone?.scale ? zone.scale[0] + (zone.scale[1] - zone.scale[0]) * along : 1;
            const Carrier = zone?.carry ? look.Carrier : undefined;
            return (
              <svg
                key={m.id}
                className="run-marble"
                data-tap
                viewBox={`${-MARBLE_PAD} ${-MARBLE_PAD} ${2 * MARBLE_PAD} ${2 * MARBLE_PAD}`}
                style={{
                  width: 2 * MARBLE_PAD * unit,
                  height: 2 * MARBLE_PAD * unit,
                  transform: `translate3d(${(m.x - MARBLE_PAD) * unit}px, ${(m.y + TOP_ROOM - MARBLE_PAD) * unit}px, 0)`,
                }}
                aria-hidden
                onPointerDown={(e) => {
                  tapped(e);
                  nudge(m, levelNow());
                }}
              >
                <circle r="56" fill="transparent" />
                {Carrier && <Carrier layer="back" />}
                <RollerBody
                  kind={m.kind}
                  color={m.color}
                  look={m.look}
                  x={0}
                  y={0}
                  spin={m.spin + (k >= 0 && k < 1 ? 4 * Math.PI * k : 0)}
                  grow={Math.min(1, m.dist / runLength)}
                  scale={m.fly ? SHELF.scale - (SHELF.scale - 1) * Math.min(1, (t - m.fly.at) / FLY_MS) : size}
                />
                {Carrier && <Carrier layer="front" />}
              </svg>
            );
          })}
          {pops.current.length > 0 && (
            <svg className="marble-camera" viewBox={layerBox} style={layerStyle} aria-hidden>
              {pops.current.map((p) => (
                <BubblePop key={p.id} x={p.x} y={p.y} age={(t - p.at) / POP_MS} />
              ))}
            </svg>
          )}
        </div>
        <svg className="marble-camera run-layer" viewBox={layerBox} style={layerStyle} aria-hidden>
          {/* In front of the marbles */}
          <Hopper />
          {SLOTS.map((_, i) => spot(i, "front"))}
          <g
            data-tap
            onPointerDown={(e) => {
              tapped(e);
              peekOut(levelNow());
            }}
          >
            <Tunnel />
          </g>
          <StretchArt layer="front" ages={cueAges} onTap={tapCue} />
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

          <Shelf
            things={shelf.current}
            filled={filled.current}
            colors={look.sort?.colors ?? shelf.current.map(() => BRIGHT_COLORS[nextId.current % BRIGHT_COLORS.length])}
            t={t}
            onTake={take}
          />
        </svg>
      </TrackLook.Provider>
      {/* Before the first tap and after ⬆: the shared hint on the middle thing on the shelf says „tap me“ */}
      {(!started || lookingUp.current) && <TapHint key={`shelf${nextId.current}`} {...worldHint(at, SHELF_SPOT)} side="right" />}
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

/** „Klingende Kugelbahn“: the wooden run. */
export const TrackLevel = (props: LevelProps) => <Run {...props} look={WOODEN} />;
/** „Schneebahn“: snowballs that grow on the way and build a snowman at the end (K-18). */
export const SnowTrackLevel = (props: LevelProps) => <Run {...props} look={SNOW_TRACK} />;
/** „Weltraumbahn“: planets, moon and stars roll down to the moon; shooting stars at the end (K-18). */
export const SpaceTrackLevel = (props: LevelProps) => <Run {...props} look={SPACE_TRACK} />;
/** „Wasserrutsche“: beach ball, swim ring and rubber duck slide down blue chutes into a pool (K-18). */
export const SlideTrackLevel = (props: LevelProps) => <Run {...props} look={SLIDE_TRACK} />;
/** „Farbenbahn“: the child picks each marble's colour, and the tubes at the end count them (K-10). */
export const ColorTrackLevel = (props: LevelProps) => <Run {...props} look={COLOR_TRACK} />;
/** „Baustellen-Bahn“: tyre, stone and log ride conveyor belts into a skip that the crane lifts (K-18). */
export const SiteTrackLevel = (props: LevelProps) => <Run {...props} look={SITE_TRACK} />;
