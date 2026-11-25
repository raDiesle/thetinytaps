import { memo, useEffect, useMemo, useRef, type PointerEvent, type ReactNode } from "react";
import { playBoing, playKnock, playPlink, playPop, playTrill } from "@/lib/sfx";
import { loadRealSounds, playBark, playBuzz, playCroak, playMeow, playMoo, playOink, playQuack } from "@/lib/realSounds";
import {
  cameraPoint,
  gliding,
  SETTLE_S,
  useAnyKey,
  useFrames,
  useLevelName,
  levelNow,
  useLevelTimers,
  VIEW_H,
  VIEW_W,
  wobble,
  worldHint,
  type LevelProps,
  decay,
} from "./level";
import { TapHint } from "@/components/TapHint";
import { BAR_COLORS, Ball, Sprite, still } from "./parts";
import { BALL_R } from "./path";
import {
  BIN_TOP,
  BIN_W,
  BINS,
  BOARD,
  binAt,
  binCenter,
  clampDrop,
  DIVIDER_R,
  DIVIDERS,
  type Falling,
  FLOOR,
  fall,
  freeSlot,
  keyDropX,
  LADYBUG,
  type Movers,
  moversMoving,
  newFalling,
  PEG_R,
  PEG_ROWS,
  PEGS,
  PILE_ROWS,
  PILE_SLOTS,
  SPAWN_Y,
  STAR,
  STAR_ARMS,
  stepMovers,
  stillMovers,
} from "./pegs";
import { DARK_WOOD, INK, MID_WOOD, Sparkles, WOOD } from "./scenery";
import "./pegs.css";

/** At most this many marbles in the air; a tap beyond it rings the top nails instead. */
const MAX_FALLING = 12;
/** After this many marbles have landed, the level ends. */
const DONE_AFTER = 20;
/** Between the last marble landing and the party: every animal does its trick once more, one after the other. */
const DONE_DELAY_MS = 3000;
/** How far apart the animals start their tricks at the end. */
const FINALE_STEP_MS = 280;
/** Once this many marbles have landed, the ladybug flies in and settles on its vine. */
const BUG_AFTER = 4;
/** How long the ladybug's flight in takes. */
const BUG_FLIGHT_MS = 1800;
/** The marble in a bin that makes its animal do its trick, and the one that fills the first row, so it climbs onto its pile. */
const TRICK_AT = 3;
const CLIMB_AT = PILE_ROWS[0];
/** How long a trick takes, and the climb onto the pile. */
const TRICK_MS = 1300;
const CLIMB_MS = 500;
/** How high an animal stands on its pile, and how far it is lifted while it climbs. */
const CLIMB_H = 2 * BALL_R;
/** The star and the ladybug knock at most this often. */
const KNOCK_GAP_MS = 120;
const BOING_GAP_MS = 220;
/** How long the star's arms and the ladybug glow after a marble hit them. */
const MOVER_GLOW_MS = 400;
/** A marble still falling after this long (it never should) goes straight into the bin below it. */
const STUCK_S = 8;
/** Nails ring at most this often, so twelve marbles at once don't turn into noise. */
const PLINK_GAP_MS = 45;
/** The same animal calls out at most this often; it still hops for every marble. */
const ANIMAL_GAP_MS = 350;
/** How long a marble takes to pop in where it was tapped. */
const SPAWN_S = 0.15;
/** How long a nail glows after it was hit. */
const PEG_GLOW_S = 0.4;

/** A marble on its way down, with its look. */
interface Drop extends Falling {
  id: number;
  color: string;
  spin: number;
  /** The bin it fell into and its place there (-1: the bin was full, it pops), once it is below the dividers' tops. */
  bin: number;
  slot: number;
}

/** A marble lying in a bin, rolling the last bit to its place. */
interface Lying {
  id: number;
  color: string;
  bin: number;
  x: number;
  spin: number;
  slot: number;
}

/** What one animal looks like when it is happy (`happy`) and how far its tail, ears or wings swing (`wag`, degrees). */
type Draw = (p: { happy: boolean; wag: number }) => ReactNode;

/**
 * What an animal does when its pile has grown to `TRICK_AT` marbles (and all
 * together at the end), each its own: the frog's somersault, the dog chasing
 * its tail round, the cat's long stretch, the pig rolling over on the floor,
 * the duck fluttering up and the cow's slow sway.
 */
type Trick = "flip" | "spin" | "stretch" | "roll" | "flutter" | "sway";

/** An animal waiting in a bin: its drawing, its sound, how high it hops for joy, and its trick. */
interface Animal {
  draw: Draw;
  sound: () => void;
  hop: number;
  trick: Trick;
}

/**
 * „Nagelbrett“ (K-13): an upright wooden board full of nails. Wherever the
 * child taps (only the x counts), a marble appears at the top above it and
 * falls, plinking from nail to nail – higher rows, higher notes – past the
 * wooden star in the middle, which it knocks round, into one of five bins,
 * where an animal waits and hops with joy. The board changes as it fills: a
 * ladybug flies in and crawls along the vine over the bins, bouncing marbles
 * off its back; an animal whose pile grows does its own trick and then climbs
 * onto its pile. After twenty marbles every animal does its trick once more
 * and the level ends.
 */
export function PegsLevel({ sound, onDone, onGoal }: LevelProps) {
  const label = useLevelName("pegs");
  const animals = useMemo(() => pickAnimals(BINS), []);
  const svg = useRef<SVGSVGElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const now = useRef(levelNow());
  const started = useRef(false);
  const nextId = useRef(0);
  const falling = useRef<Drop[]>([]);
  const lying = useRef<Lying[]>([]);
  const taken = useRef(Array.from({ length: BINS }, () => PILE_SLOTS.map(() => false)));
  /** When each nail was last hit, and each animal was last made happy (ms; -Infinity: never). */
  const pegHit = useRef(PEGS.map(() => -Infinity));
  const joy = useRef(animals.map(() => -Infinity));
  const lastCall = useRef(animals.map(() => -Infinity));
  const lastPlink = useRef(-Infinity);
  /** Sparkles where a marble found its bin full. */
  const pops = useRef<{ x: number; y: number; at: number }[]>([]);
  const landed = useRef(0);
  /** The star's turn and the ladybug, and when the ladybug set off to fly in (ms; Infinity: not yet). */
  const movers = useRef<Movers>(stillMovers());
  const bugFlight = useRef(Infinity);
  /** When the star and the ladybug were last hit and knocked (ms). */
  const starHit = useRef(-Infinity);
  const bugHit = useRef(-Infinity);
  const lastKnock = useRef(-Infinity);
  const lastBoing = useRef(-Infinity);
  /** Marbles landed in each bin; when each animal last started its trick, and when it climbed onto its pile (ms). */
  const inBin = useRef(animals.map(() => 0));
  const trickAt = useRef(animals.map(() => -Infinity));
  const climbAt = useRef(animals.map(() => Infinity));
  // The end is dropped when the level is left before it.
  const { later } = useLevelTimers();

  useEffect(() => loadRealSounds([playBark, playBuzz, playCroak, playMeow, playMoo, playOink, playQuack]), []);

  /** The star or the ladybug was hit: it glows, the star knocks like wood, the ladybug's shell boings. */
  const knock = (part: "star" | "bug") => {
    const t = now.current;
    if (part === "star") {
      starHit.current = t;
      if (t - lastKnock.current < KNOCK_GAP_MS) return;
      lastKnock.current = t;
      sound(() => playKnock(1100));
    } else {
      bugHit.current = t;
      if (t - lastBoing.current < BOING_GAP_MS) return;
      lastBoing.current = t;
      sound(playBoing);
    }
  };

  /** Animal `i` does its trick, calling out as it starts. */
  const doTrick = (i: number) => {
    trickAt.current[i] = now.current;
    lastCall.current[i] = now.current;
    sound(animals[i].sound);
  };

  const plink = (peg: number) => {
    pegHit.current[peg] = now.current;
    if (now.current - lastPlink.current < PLINK_GAP_MS) return;
    lastPlink.current = now.current;
    // The top row rings highest; every row is a note of the pentatonic scale, so any path sounds nice.
    sound(() => playPlink(PEG_ROWS - PEGS[peg].row));
  };

  /** The marble has reached its place in a bin (or popped, the bin being full): the animal there is delighted. */
  const land = (d: Drop) => {
    if (d.slot >= 0) lying.current.push({ id: d.id, color: d.color, bin: d.bin, x: d.x, spin: d.spin, slot: d.slot });
    else pops.current.push({ x: d.x, y: d.y, at: now.current });
    const t = now.current;
    joy.current[d.bin] = t;
    const count = ++inBin.current[d.bin];
    // The pile has grown: the animal does its trick, and with the first row full it climbs on top.
    if (count === TRICK_AT) doTrick(d.bin);
    else if (t - lastCall.current[d.bin] > ANIMAL_GAP_MS) {
      lastCall.current[d.bin] = t;
      sound(animals[d.bin].sound);
    }
    if (count === CLIMB_AT) climbAt.current[d.bin] = t;
    landed.current++;
    // The first marble in a bin wins the level's trophy.
    if (landed.current === 1) onGoal?.();
    if (landed.current === BUG_AFTER) {
      bugFlight.current = t;
      sound(playBuzz);
    }
    if (landed.current === DONE_AFTER) {
      animals.forEach((_, i) => later(() => doTrick(i), 400 + i * FINALE_STEP_MS));
      later(() => sound(playTrill), 400 + animals.length * FINALE_STEP_MS);
      later(onDone, DONE_DELAY_MS);
    }
  };

  /** Once below the dividers' tops, a marble picks its bin and the place in it it will lie. */
  const enterBin = (d: Drop) => {
    d.bin = binAt(d.x);
    d.slot = freeSlot(taken.current[d.bin], d.x - binCenter(d.bin));
    if (d.slot >= 0) taken.current[d.bin][d.slot] = true;
  };

  useFrames((dt, t) => {
    now.current = t;
    const m = movers.current;
    const busy = falling.current.length > 0;
    // The ladybug lands on its vine at the end of its flight; from then on marbles bounce off it.
    if (!m.bug && t - bugFlight.current >= BUG_FLIGHT_MS) {
      m.bug = true;
      sound(() => playKnock(1500));
    }
    stepMovers(m, dt, busy);
    const still: Drop[] = [];
    for (const d of falling.current) {
      const x0 = d.x;
      fall(d, dt, Math.random, plink, m, busy, knock);
      d.spin += (d.x - x0) / BALL_R;
      if (d.bin < 0 && (d.y > BIN_TOP + BALL_R || d.age > STUCK_S)) enterBin(d);
      if (d.bin >= 0) {
        const restY = FLOOR + (d.slot >= 0 ? PILE_SLOTS[d.slot].y : PILE_SLOTS[PILE_SLOTS.length - 1].y);
        if (d.y >= restY || d.age > STUCK_S) {
          d.y = restY;
          land(d);
          continue;
        }
      }
      still.push(d);
    }
    falling.current = still;
    // Lying marbles roll the last bit to their place in the pile.
    let rolling = false;
    for (const m of lying.current) {
      const target = binCenter(m.bin) + PILE_SLOTS[m.slot].x;
      const step = (target - m.x) * (1 - Math.exp(-dt * 9));
      if (gliding(m.x, target)) rolling = true;
      m.x += step;
      m.spin += step / BALL_R;
    }
    pops.current = pops.current.filter((p) => t - p.at < 3000);
    // Still once every marble lies, the star stands, the ladybug sits, and every glow, hop, trick and climb is over.
    const during = (since: number, ms: number) => since >= 0 && since < ms;
    const flying = during(t - bugFlight.current, BUG_FLIGHT_MS);
    const climbing = climbAt.current.some((at) => during(t - at, CLIMB_MS));
    const lastHit = Math.max(lastPlink.current, ...pegHit.current, ...joy.current, ...trickAt.current, starHit.current, bugHit.current);
    return falling.current.length > 0 || rolling || pops.current.length > 0 || moversMoving(m, busy) || flying || climbing || t - lastHit < SETTLE_S * 1000;
  });

  /** One marble from the top, above `x`; with too many in the air, the top nails above `x` ring instead. */
  const drop = (x: number) => {
    started.current = true;
    if (falling.current.length >= MAX_FALLING) {
      const top = PEGS.filter((p) => p.row === 0).reduce((a, b) => (Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a));
      plink(PEGS.indexOf(top));
      return;
    }
    const id = nextId.current++;
    falling.current.push({ ...newFalling(x, Math.random), id, color: BAR_COLORS[id % BAR_COLORS.length], spin: 0, bin: -1, slot: -1 });
    sound(playPop);
  };

  useAnyKey((e) => drop(keyDropX(e.code, Math.random)));

  const onPointerDown = (e: PointerEvent) => {
    const m = svg.current?.getScreenCTM();
    if (!m) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    // A tap on a bin (its animal) drops a marble right above it; anywhere else only the x counts.
    drop(p.y > BIN_TOP && p.x > BOARD.left && p.x < BOARD.right ? binCenter(binAt(p.x)) + (Math.random() - 0.5) * 30 : clampDrop(p.x));
  };

  const t = now.current;
  const at = cameraPoint(box.current, PICTURE, PICTURE);
  // Only the still board is one big picture; everything that moves is a small layer of its own over it (`Sprite`), so a
  // phone moves finished little pictures instead of painting the whole board again in every frame (perf, November 2026).
  return (
    <div className="marble-level pegs-level" ref={box} onPointerDown={onPointerDown}>
      <StillBoard />
      {animals.map((a, i) => {
        const age = (t - joy.current[i]) / 1000;
        const trick = (t - trickAt.current[i]) / TRICK_MS;
        const inTrick = trick >= 0 && trick < 1;
        // A trick takes the place of the hop for joy.
        const hop = !inTrick && age >= 0 && age < 0.5 ? a.hop * Math.sin((Math.PI * age) / 0.5) : 0;
        const squash = !inTrick && age >= 0.5 && age < 1.5 ? 0.1 * decay((age - 0.5) * 7) * Math.cos((age - 0.5) * 28) : 0;
        const climb = Math.max(0, Math.min(1, (t - climbAt.current[i]) / CLIMB_MS));
        const up = CLIMB_H * climb + 30 * Math.sin(Math.PI * climb);
        const happy = inTrick || (age >= 0 && age < 1.4);
        const wag = inTrick ? 26 * Math.sin(trick * 18) : wobble(age, 28, 22, 2.5);
        return (
          <Sprite key={i} at={at} x={binCenter(i)} y={FLOOR - hop - up - ANIMAL_MID} pad={ANIMAL_PAD}>
            <AnimalPose draw={a.draw} happy={happy} wag={wag} squash={squash} pose={inTrick ? trickTransform(a.trick, trick) : ""} />
          </Sprite>
        );
      })}
      <svg ref={svg} className="marble-svg pegs-layer" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label={label}>
        <Dividers />
        {lying.current.map((m) => (
          <Ball key={m.id} color={m.color} x={m.x} y={FLOOR + PILE_SLOTS[m.slot].y} spin={m.spin} />
        ))}
        {pops.current.map((p, i) => (
          <Sparkles key={i} x={p.x} y={p.y} age={(t - p.at) / 1000} n={8} spread={90} />
        ))}
      </svg>
      {PEGS.map((p, i) => {
        const glow = (t - pegHit.current[i]) / 1000 / PEG_GLOW_S;
        return glow >= 0 && glow < 1 ? (
          <Sprite key={`peg${i}`} at={at} x={p.x} y={p.y} pad={PEG_R + 32}>
            <NailGlow color={BAR_COLORS[p.row % BAR_COLORS.length]} glow={glow} />
          </Sprite>
        ) : null;
      })}
      <Sprite at={at} x={STAR.x} y={STAR.y} pad={STAR.r + 30} angle={movers.current.starAngle}>
        <Star glow={settled((t - starHit.current) / MOVER_GLOW_MS)} />
      </Sprite>
      {(movers.current.bug || t >= bugFlight.current) &&
        (() => {
          const { x, y, ...pose } = bugPose(movers.current, (t - bugFlight.current) / BUG_FLIGHT_MS);
          return (
            <Sprite at={at} x={x} y={y} pad={LADYBUG.r + 30}>
              <Ladybug {...pose} glow={(t - bugHit.current) / MOVER_GLOW_MS} />
            </Sprite>
          );
        })()}
      {falling.current.map((d) => (
        <Sprite key={d.id} at={at} x={d.x} y={d.y} pad={BALL_R + 4}>
          <g transform={`scale(${Math.min(1, d.age / SPAWN_S)})`}>
            <Ball color={d.color} x={0} y={0} spin={d.spin} />
          </g>
        </Sprite>
      ))}
      <StillFrame waiting={!started.current} />
      {/* One tap drops one marble, never more, and none drops by itself (user decision, 25 November 2026): while none
          falls and the board isn't full, the hint marks the top again for the next tap. */}
      {falling.current.length === 0 && nextId.current < DONE_AFTER && (
        <TapHint key={`drop${nextId.current}`} {...worldHint(at, { x: VIEW_W / 2, y: SPAWN_Y, r: 52 })} />
      )}
    </div>
  );
}

/** A glow's progress while it shows (0 to 1), else -1, so a part at rest gets the same props and is skipped. */
const settled = (k: number) => (k >= 0 && k < 1 ? k : -1);

/**
 * An animal's sprite: its middle `ANIMAL_MID` above its feet and `ANIMAL_PAD` round that, just round the animal (about
 * 170 tall), since a phone rasters the whole sprite again while the animal wags; a trick reaching out of it still shows.
 */
const ANIMAL_MID = 85;
const ANIMAL_PAD = 100;

/**
 * An animal in its sprite, feet `ANIMAL_MID` below its middle: its hop and climb move the sprite, while squash, trick (`pose`, a transform) and
 * wag are drawn here. Its props are numbers, so a resting animal is skipped by React and its layer stays as it is.
 */
const AnimalPose = still(function AnimalPose({ draw, happy, wag, squash, pose }: { draw: Draw; happy: boolean; wag: number; squash: number; pose: string }) {
  return (
    <g transform={`translate(0 ${ANIMAL_MID}) scale(${1 + squash} ${1 - squash})`}>
      <g transform={pose || undefined}>{draw({ happy, wag })}</g>
    </g>
  );
});

/** The board behind everything, with its vine and every nail at rest: drawn once. */
const StillBoard = memo(function StillBoard() {
  return (
    <svg className="marble-svg pegs-layer" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
      <Board />
      <Vine />
      {PEGS.map((p, i) => (
        <Nail key={i} x={p.x} y={p.y} />
      ))}
      <circle cx={STAR.x + 3} cy={STAR.y + 5} r={STAR.r * 0.35} fill="#0002" />
    </svg>
  );
});

/** The bins' dividers, in front of the animals. */
const Dividers = memo(function Dividers() {
  return (
    <>
      {DIVIDERS.map((x) => (
        <rect
          key={x}
          x={x - DIVIDER_R}
          y={BIN_TOP - DIVIDER_R}
          width={DIVIDER_R * 2}
          height={FLOOR - BIN_TOP + DIVIDER_R}
          rx={DIVIDER_R}
          fill={WOOD}
          stroke={INK}
          strokeWidth="3"
        />
      ))}
    </>
  );
});

/** The frame drawn over everything, and before the first tap a marble waiting at the top for the shared hint. */
const StillFrame = memo(function StillFrame({ waiting }: { waiting: boolean }) {
  return (
    <svg className="marble-svg pegs-layer pegs-front" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-hidden>
      <Frame />
      {waiting && (
        <g opacity="0.8">
          <Ball color={BAR_COLORS[0]} x={VIEW_W / 2} y={SPAWN_Y} spin={0} />
        </g>
      )}
    </svg>
  );
});

/** The whole board, as the svg shows it (`preserveAspectRatio` meet). */
const PICTURE = { x: 0, y: 0, w: VIEW_W, h: VIEW_H };

const easeInOut = (k: number) => (k < 0.5 ? 2 * k * k : 1 - 2 * (1 - k) * (1 - k));

/** An animal's trick `k` of the way through (0 to 1), as a transform of its drawing (feet at 0, 0, about 170 tall). */
function trickTransform(trick: Trick, k: number) {
  const up = Math.sin(Math.PI * k);
  switch (trick) {
    case "flip":
      return `translate(0 ${-170 * up}) rotate(${-360 * easeInOut(k)} 0 -80)`;
    case "spin":
      return `translate(0 ${-24 * Math.abs(Math.sin(4 * Math.PI * k))}) scale(${Math.cos(4 * Math.PI * k)} 1)`;
    case "stretch":
      return `scale(${1 - 0.1 * up} ${1 + 0.28 * up})`;
    case "roll":
      return `translate(${40 * up} 0) rotate(${360 * easeInOut(k)} 0 -60)`;
    case "flutter":
      return `translate(0 ${-110 * up}) rotate(${10 * Math.sin(k * 30) * up} 0 -60)`;
    case "sway":
      return `rotate(${14 * Math.sin(4 * Math.PI * k) * (1 - k)} 0 0) translate(0 ${-10 * Math.abs(Math.sin(4 * Math.PI * k))})`;
  }
}

/** Where the ladybug start its flight in: over the frame's top right corner. */
const BUG_FROM = { x: BOARD.right + 70, y: 30 };

/** Where the ladybug is and how it looks: crawling on its vine, or `k` of the way through its flight in. */
function bugPose(m: Movers, k: number) {
  if (m.bug) return { x: m.bugX, y: LADYBUG.y, dir: m.bugDir, wings: 0, step: m.bugX / 6 };
  const e = easeInOut(Math.max(0, Math.min(1, k)));
  const to = { x: m.bugX, y: LADYBUG.y };
  const via = { x: 1250, y: 520 };
  const x = (1 - e) * (1 - e) * BUG_FROM.x + 2 * e * (1 - e) * via.x + e * e * to.x;
  const y = (1 - e) * (1 - e) * BUG_FROM.y + 2 * e * (1 - e) * via.y + e * e * to.y;
  return { x, y: y - 40 * Math.sin(k * 14) * (1 - e), dir: -1 as const, wings: k < 0.93 ? 1 : 0, step: x * 0.13 };
}

/**
 * The ladybug: a red shell with black dots, a black head looking the way it
 * crawls and six little legs stepping; flying, its shell halves open and its
 * wings whirr. It glows for a moment when a marble bounces off it.
 */
function Ladybug({ dir, wings, step, glow }: { dir: 1 | -1; wings: number; step: number; glow: number }) {
  const r = LADYBUG.r;
  const lit = glow >= 0 && glow < 1;
  const flap = wings ? 0.6 + 0.4 * Math.sin(step * 7) : 0;
  return (
    <g transform={`scale(${dir} 1)`} {...LINE} strokeWidth="2.5">
      {lit && <circle r={r + 8 + 14 * glow} fill="none" stroke="#ff5d73" strokeWidth={6 * (1 - glow)} opacity={1 - glow} />}
      {[-10, 0, 10].map((lx, i) => (
        <path key={lx} d={`M${lx} ${r - 6} l${-4 + 4 * Math.sin(step + i * 2)} 9`} fill="none" />
      ))}
      {wings > 0 &&
        [-1, 1].map((side) => (
          <ellipse
            key={side}
            cx={-6}
            cy={-r * 0.5}
            rx={22 * flap}
            ry={10}
            transform={`rotate(${side * 35 - 20})`}
            fill="#e9f6ff"
            opacity="0.8"
            strokeWidth="1.5"
          />
        ))}
      <circle cx={r * 0.85} cy={2} r={r * 0.5} fill={INK} />
      <circle cx={r * 1.05} cy={-1} r={2.2} fill="#fff" stroke="none" />
      <g transform={wings ? `rotate(-12 ${r} 0)` : undefined}>
        <circle r={r} fill={lit && glow < 0.5 ? "#ff8a9b" : "#e63946"} />
        <path d={`M${r * 0.75} ${-r * 0.65} L${-r} 0`} fill="none" strokeWidth="2" />
        {[
          [-6, -9],
          [5, 8],
          [-9, 6],
          [6, -6],
        ].map(([dx, dy]) => (
          <circle key={`${dx} ${dy}`} cx={dx} cy={dy} r="3.6" fill={INK} stroke="none" />
        ))}
        <circle cx={-5} cy={-r * 0.55} r="3" fill="#fff" opacity="0.7" stroke="none" />
      </g>
    </g>
  );
}

/** The vine painted along the board above the bins, with little leaves: where the ladybug crawls. */
const Vine = memo(function Vine() {
  const y = LADYBUG.y + LADYBUG.r + 3;
  const { left, right } = BOARD;
  const d = `M${left} ${y} ${Array.from({ length: 10 }, (_, i) => `q${(right - left) / 20} ${i % 2 ? 7 : -7} ${(right - left) / 10} 0`).join(" ")}`;
  return (
    <g>
      <path d={d} fill="none" stroke="#3f8f2a" strokeWidth="6" strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const lx = left + ((right - left) * (i + 0.5)) / 9 + 30;
        return <path key={i} d={`M${lx} ${y} q10 ${i % 2 ? 14 : -14} 24 ${i % 2 ? 8 : -8} q-14 ${i % 2 ? -4 : 4} -24 ${i % 2 ? -8 : 8} z`} fill="#6cc24a" />;
      })}
    </g>
  );
});

/**
 * The wooden star in the middle of the board, drawn round 0, 0 in its own sprite, which turns it: five rounded arms in
 * the rainbow's colours round a brass axle; it glows for a moment when hit. Its shadow lies on the still board.
 */
const Star = still(function Star({ glow }: { glow: number }) {
  const lit = glow >= 0 && glow < 1;
  return (
    <g>
      {lit && <circle r={STAR.r + 8 + 18 * glow} fill="none" stroke="#ffd23f" strokeWidth={8 * (1 - glow)} opacity={1 - glow} />}
      {Array.from({ length: STAR_ARMS }, (_, i) => (
        <g key={i} transform={`rotate(${(i * 360) / STAR_ARMS})`}>
          <path
            d={`M-12 0 L-10 ${-STAR.r + 12} Q0 ${-STAR.r - 4} 10 ${-STAR.r + 12} L12 0 Z`}
            fill={BAR_COLORS[(i * 2) % BAR_COLORS.length]}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cy={-STAR.r + 14} r="4" fill="#fff" opacity={lit ? 0.95 : 0.6} />
        </g>
      ))}
      <circle r="15" fill="#f4c542" stroke={INK} strokeWidth="3" />
      <circle r="5" fill={DARK_WOOD} />
    </g>
  );
});

/** A nail at rest: a brass head on the still board. */
function Nail({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x + 2} cy={y + 3} r={PEG_R} fill="#0002" />
      <circle cx={x} cy={y} r={PEG_R} fill="#f4c542" stroke={INK} strokeWidth="3" />
      <circle cx={x - 3} cy={y - 3} r="2.5" fill="#fff" opacity="0.85" />
    </g>
  );
}

/** A nail just hit, round 0, 0 in its own sprite: a ring in its row's colour spreading out, its head lit at first (`glow` 0 to 1). */
function NailGlow({ color, glow }: { color: string; glow: number }) {
  return (
    <g>
      <circle r={PEG_R + 6 + 24 * glow} fill="none" stroke={color} strokeWidth={8 * (1 - glow)} opacity={1 - glow} />
      {glow < 0.6 && (
        <>
          <circle r={PEG_R} fill={color} stroke={INK} strokeWidth="3" />
          <circle cx={-3} cy={-3} r="2.5" fill="#fff" opacity="0.85" />
        </>
      )}
    </g>
  );
}

/** The wall behind, the light wooden board with its grain, the drop strip at the top and the bins' coloured backs. */
const Board = memo(function Board() {
  const { left, right, top } = BOARD;
  return (
    <g>
      <rect x="-400" y="-200" width={VIEW_W + 800} height={VIEW_H + 400} fill="#bfe3f5" />
      <rect x={left - 40} y={top - 26} width={right - left + 80} height={FLOOR - top + 52} rx="28" fill={MID_WOOD} stroke={INK} strokeWidth="5" />
      <rect x={left} y={top} width={right - left} height={FLOOR - top} fill="#f6d3a0" />
      <rect x={left} y={top} width={right - left} height="100" fill="#efc289" />
      {[150, 300, 420, 560].map((y, i) => (
        <path
          key={y}
          d={`M${left} ${y} q${200 + i * 30} ${-18 + i * 9} 420 0 t420 0 t440 0`}
          fill="none"
          stroke="#e9bb80"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      {Array.from({ length: BINS }, (_, i) => (
        <rect
          key={i}
          x={left + i * BIN_W}
          y={BIN_TOP - 10}
          width={BIN_W}
          height={FLOOR - BIN_TOP + 10}
          fill={BAR_COLORS[(i * 2) % BAR_COLORS.length]}
          opacity="0.28"
        />
      ))}
    </g>
  );
});

/** The frame's edge drawn over everything, so marbles roll right up to the wood; with a screw in each corner. */
const Frame = memo(function Frame() {
  const { left, right, top } = BOARD;
  return (
    <g pointerEvents="none">
      <rect x={left} y={top} width={right - left} height={FLOOR - top} fill="none" stroke={DARK_WOOD} strokeWidth="6" />
      <line x1={left} y1={FLOOR} x2={right} y2={FLOOR} stroke={INK} strokeWidth="5" />
      {[left - 20, right + 20].flatMap((x) =>
        [top - 6, FLOOR + 6].map((y) => (
          <g key={`${x} ${y}`}>
            <circle cx={x} cy={y} r="8" fill="#f4c542" stroke={INK} strokeWidth="2.5" />
            <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke={INK} strokeWidth="2" />
          </g>
        )),
      )}
    </g>
  );
});

/** Five of the six animals, in a new order every round. */
function pickAnimals(n: number): Animal[] {
  const all: Animal[] = [
    { draw: Frog, sound: playCroak, hop: 85, trick: "flip" },
    { draw: Cow, sound: playMoo, hop: 40, trick: "sway" },
    { draw: Dog, sound: playBark, hop: 55, trick: "spin" },
    { draw: Duck, sound: playQuack, hop: 50, trick: "flutter" },
    { draw: Cat, sound: playMeow, hop: 60, trick: "stretch" },
    { draw: Pig, sound: playOink, hop: 45, trick: "roll" },
  ];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, n);
}

// The animals, each standing with its feet at 0, 0 and about 170 px tall.

const LINE = { stroke: INK, strokeWidth: 3.5, strokeLinejoin: "round", strokeLinecap: "round" } as const;

/** Two eyes `dx` from the middle: round with a shine, or happy arcs. */
function Eyes({ dx, y, r = 8, happy }: { dx: number; y: number; r?: number; happy: boolean }) {
  if (happy)
    return (
      <path d={`M${-dx - r} ${y + 3} q${r} ${-r * 1.8} ${2 * r} 0 M${dx - r} ${y + 3} q${r} ${-r * 1.8} ${2 * r} 0`} fill="none" {...LINE} strokeWidth="4.5" />
    );
  return (
    <g>
      {[-dx, dx].map((x) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r} fill={INK} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.38} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

/** A smile, or a wide open happy mouth. */
function Mouth({ y, w, happy }: { y: number; w: number; happy: boolean }) {
  if (happy) return <path d={`M${-w} ${y} q${w} ${w * 1.6} ${2 * w} 0 z`} fill="#e84a5f" {...LINE} strokeWidth="3" />;
  return <path d={`M${-w * 0.7} ${y} q${w * 0.7} ${w * 0.6} ${w * 1.4} 0`} fill="none" {...LINE} />;
}

/** Pink cheeks `dx` from the middle. */
function Cheeks({ dx, y }: { dx: number; y: number }) {
  return (
    <g fill="#ff7b9c" opacity="0.45">
      <circle cx={-dx} cy={y} r="9" />
      <circle cx={dx} cy={y} r="9" />
    </g>
  );
}

/** A sitting body with two front paws. */
function Body({ fill, belly, rx = 62 }: { fill: string; belly: string; rx?: number }) {
  return (
    <g>
      <ellipse cx="0" cy="-50" rx={rx} ry="48" fill={fill} {...LINE} />
      <ellipse cx="0" cy="-40" rx={rx * 0.6} ry="30" fill={belly} />
      <ellipse cx="-26" cy="-7" rx="18" ry="10" fill={fill} {...LINE} />
      <ellipse cx="26" cy="-7" rx="18" ry="10" fill={fill} {...LINE} />
    </g>
  );
}

/** „Quak!“ – a green frog with big eyes on top; it hops highest. */
const Frog: Draw = ({ happy }) => (
  <g>
    <ellipse cx="-58" cy="-18" rx="30" ry="18" fill="#4cb82f" {...LINE} />
    <ellipse cx="58" cy="-18" rx="30" ry="18" fill="#4cb82f" {...LINE} />
    <ellipse cx="0" cy="-62" rx="74" ry="58" fill="#5cc93b" {...LINE} />
    <ellipse cx="0" cy="-42" rx="46" ry="32" fill="#c8f29a" />
    <circle cx="-36" cy="-116" r="27" fill="#5cc93b" {...LINE} />
    <circle cx="36" cy="-116" r="27" fill="#5cc93b" {...LINE} />
    <circle cx="-36" cy="-118" r="17" fill="#fff" />
    <circle cx="36" cy="-118" r="17" fill="#fff" />
    <Eyes dx={36} y={-118} r={9} happy={happy} />
    <Mouth y={-80} w={30} happy={happy} />
    <Cheeks dx={56} y={-74} />
    <ellipse cx="-26" cy="-6" rx="17" ry="8" fill="#4cb82f" {...LINE} />
    <ellipse cx="26" cy="-6" rx="17" ry="8" fill="#4cb82f" {...LINE} />
  </g>
);

/** „Muh!“ – a white cow with dark patches, little horns and a pink muzzle; she swishes her tail. */
const Cow: Draw = ({ happy, wag }) => (
  <g>
    <g transform={`rotate(${wag} 58 -60)`}>
      <path d="M58 -60 q34 -10 30 -50" fill="none" {...LINE} strokeWidth="5" />
      <ellipse cx="88" cy="-112" rx="8" ry="12" fill="#3b3355" />
    </g>
    <Body fill="#fff" belly="#ffe3ea" rx={66} />
    <path d="M-50 -78 q20 -14 34 4 q-6 22 -30 18 z M24 -36 q18 -16 36 0 q-4 18 -26 16 z" fill="#3b3355" />
    <path d="M-24 -156 Q-34 -182 -54 -186 Q-46 -168 -40 -150 Z M24 -156 Q34 -182 54 -186 Q46 -168 40 -150 Z" fill="#fff3c4" {...LINE} strokeWidth="3" />
    <ellipse cx="-58" cy="-130" rx="20" ry="10" transform="rotate(-20 -58 -130)" fill="#fff" {...LINE} />
    <ellipse cx="58" cy="-130" rx="20" ry="10" transform="rotate(20 58 -130)" fill="#fff" {...LINE} />
    <ellipse cx="0" cy="-118" rx="50" ry="46" fill="#fff" {...LINE} />
    <ellipse cx="-24" cy="-140" rx="16" ry="12" fill="#3b3355" />
    <Eyes dx={20} y={-126} r={7} happy={happy} />
    <ellipse cx="0" cy="-92" rx="38" ry="22" fill="#ffc2d1" {...LINE} />
    <circle cx="-13" cy="-95" r="4" fill={INK} />
    <circle cx="13" cy="-95" r="4" fill={INK} />
    {happy && <Mouth y={-84} w={11} happy />}
  </g>
);

/** „Wau!“ – a brown dog with floppy ears; it wags its tail. */
const Dog: Draw = ({ happy, wag }) => (
  <g>
    <path d="M54 -48 q36 -6 34 -50" fill="none" {...LINE} stroke={INK} strokeWidth="16" transform={`rotate(${wag} 54 -48)`} />
    <path d="M54 -48 q36 -6 34 -50" fill="none" {...LINE} stroke="#c98a4b" strokeWidth="10" transform={`rotate(${wag} 54 -48)`} />
    <Body fill="#c98a4b" belly="#f3d2a2" />
    <circle cx="0" cy="-118" r="50" fill="#c98a4b" {...LINE} />
    <ellipse cx="-50" cy="-112" rx="16" ry="34" transform={`rotate(${18 + wag / 3} -50 -140)`} fill={DARK_WOOD} {...LINE} />
    <ellipse cx="50" cy="-112" rx="16" ry="34" transform={`rotate(${-18 + wag / 3} 50 -140)`} fill={DARK_WOOD} {...LINE} />
    <ellipse cx="0" cy="-96" rx="30" ry="22" fill="#f3d2a2" />
    <Eyes dx={20} y={-130} r={8} happy={happy} />
    <ellipse cx="0" cy="-108" rx="11" ry="8" fill={INK} />
    <Mouth y={-92} w={12} happy={happy} />
  </g>
);

/** „Quak, quak!“ – a yellow duck with an orange beak; it flaps its wing. */
const Duck: Draw = ({ happy, wag }) => (
  <g>
    <path d="M-30 -2 l-14 8 h28 z M30 -2 l-14 8 h28 z" fill="#ff8c42" {...LINE} strokeWidth="3" />
    <path d="M50 -70 L88 -92 L66 -40 Z" fill="#ffd23f" {...LINE} />
    <ellipse cx="0" cy="-48" rx="68" ry="46" fill="#ffd23f" {...LINE} />
    <ellipse cx="16" cy="-52" rx="34" ry="20" transform={`rotate(${-12 - Math.abs(wag)} -14 -60)`} fill="#f4b400" {...LINE} />
    <circle cx="0" cy="-122" r="42" fill="#ffd23f" {...LINE} />
    <Eyes dx={16} y={-132} r={7} happy={happy} />
    {happy ? (
      <g>
        <path d="M-26 -106 q26 -14 52 0 q-26 6 -52 0 z" fill="#ff8c42" {...LINE} strokeWidth="3" />
        <path d="M-22 -100 q22 22 44 0 z" fill="#e84a5f" {...LINE} strokeWidth="3" />
      </g>
    ) : (
      <ellipse cx="0" cy="-104" rx="28" ry="11" fill="#ff8c42" {...LINE} strokeWidth="3" />
    )}
    <Cheeks dx={30} y={-112} />
  </g>
);

/** „Miau!“ – an orange cat with pointy ears and whiskers; it swings its tail. */
const Cat: Draw = ({ happy, wag }) => (
  <g>
    <path d="M52 -26 q44 -10 30 -70" fill="none" {...LINE} strokeWidth="16" transform={`rotate(${wag} 52 -26)`} />
    <path d="M52 -26 q44 -10 30 -70" fill="none" {...LINE} stroke="#ff9f43" strokeWidth="10" transform={`rotate(${wag} 52 -26)`} />
    <Body fill="#ff9f43" belly="#ffe0b8" rx={58} />
    <path d="M-46 -136 L-38 -184 L-8 -160 Z M46 -136 L38 -184 L8 -160 Z" fill="#ff9f43" {...LINE} />
    <path d="M-38 -146 L-35 -170 L-20 -158 Z M38 -146 L35 -170 L20 -158 Z" fill="#ffc2d1" />
    <circle cx="0" cy="-116" r="48" fill="#ff9f43" {...LINE} />
    <path d="M-12 -162 v12 M0 -164 v14 M12 -162 v12" {...LINE} stroke="#e07b1f" strokeWidth="5" />
    <Eyes dx={20} y={-122} r={8} happy={happy} />
    <path d="M-6 -106 h12 l-6 7 z" fill="#ff7b9c" {...LINE} strokeWidth="2.5" />
    {happy ? <Mouth y={-96} w={10} happy /> : <path d="M-12 -95 q6 7 12 0 q6 7 12 0" fill="none" {...LINE} strokeWidth="3" />}
    <path d="M-20 -102 h-30 M-20 -96 l-28 6 M20 -102 h30 M20 -96 l28 6" {...LINE} strokeWidth="2" />
  </g>
);

/** „Oink!“ – a pink pig with a big snout; it curls its little tail. */
const Pig: Draw = ({ happy, wag }) => (
  <g>
    <path d="M58 -54 q18 -4 14 -18 q-6 -10 -14 0 q-4 10 10 12" fill="none" {...LINE} strokeWidth="5" stroke="#ff8fab" transform={`rotate(${wag} 58 -54)`} />
    <Body fill="#ffb3c7" belly="#ffd6e0" rx={66} />
    <path d="M-40 -148 L-50 -178 L-14 -162 Z M40 -148 L50 -178 L14 -162 Z" fill="#ff8fab" {...LINE} />
    <circle cx="0" cy="-116" r="50" fill="#ffb3c7" {...LINE} />
    <Eyes dx={22} y={-130} r={7} happy={happy} />
    <ellipse cx="0" cy="-102" rx="24" ry="16" fill="#ff8fab" {...LINE} strokeWidth="3" />
    <ellipse cx="-8" cy="-102" rx="4" ry="6" fill={INK} />
    <ellipse cx="8" cy="-102" rx="4" ry="6" fill={INK} />
    <Mouth y={-80} w={12} happy={happy} />
    <Cheeks dx={34} y={-92} />
  </g>
);
