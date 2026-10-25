import { useEffect, useMemo, useRef, type PointerEvent, type ReactNode } from "react";
import { playBark, playCroak, playMeow, playMoo, playOink, playPlink, playPop, playQuack } from "@/lib/sfx";
import { useAnyKey, useFrames, VIEW_H, VIEW_W, wobble, type LevelProps } from "./level";
import { BAR_COLORS, Ball } from "./parts";
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
  newFalling,
  PEG_R,
  PEG_ROWS,
  PEGS,
  PILE_SLOTS,
  SPAWN_Y,
} from "./pegs";
import { DARK_WOOD, INK, MID_WOOD, Sparkles, WOOD } from "./scenery";
import "./pegs.css";

/** At most this many marbles in the air; a tap beyond it rings the top nails instead. */
const MAX_FALLING = 12;
/** After this many marbles have landed, the level ends. */
const DONE_AFTER = 10;
/** The short moment between the last marble landing and the party. */
const DONE_DELAY_MS = 1500;
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

/** An animal waiting in a bin: its drawing, its sound and how high it hops for joy. */
interface Animal {
  draw: Draw;
  sound: () => void;
  hop: number;
}

/**
 * „Nagelbrett“ (K-13): an upright wooden board full of nails. Wherever the
 * child taps (only the x counts), a marble appears at the top above it and
 * falls, plinking from nail to nail – higher rows, higher notes – into one of
 * five bins, where an animal waits and hops with joy. After ten marbles the
 * level ends.
 */
export function PegsLevel({ sound, onDone }: LevelProps) {
  const animals = useMemo(() => pickAnimals(BINS), []);
  const svg = useRef<SVGSVGElement>(null);
  const now = useRef(performance.now());
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
  const doneTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(doneTimer.current), []);

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
    if (t - lastCall.current[d.bin] > ANIMAL_GAP_MS) {
      lastCall.current[d.bin] = t;
      sound(animals[d.bin].sound);
    }
    landed.current++;
    if (landed.current === DONE_AFTER) doneTimer.current = setTimeout(onDone, DONE_DELAY_MS);
  };

  /** Once below the dividers' tops, a marble picks its bin and the place in it it will lie. */
  const enterBin = (d: Drop) => {
    d.bin = binAt(d.x);
    d.slot = freeSlot(taken.current[d.bin], d.x - binCenter(d.bin));
    if (d.slot >= 0) taken.current[d.bin][d.slot] = true;
  };

  useFrames((dt, t) => {
    now.current = t;
    const still: Drop[] = [];
    for (const d of falling.current) {
      const x0 = d.x;
      fall(d, dt, Math.random, plink);
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
    for (const m of lying.current) {
      const target = binCenter(m.bin) + PILE_SLOTS[m.slot].x;
      const step = (target - m.x) * (1 - Math.exp(-dt * 9));
      m.x += step;
      m.spin += step / BALL_R;
    }
    pops.current = pops.current.filter((p) => t - p.at < 3000);
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
  return (
    <div className="marble-level pegs-level" onPointerDown={onPointerDown}>
      <svg ref={svg} className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label="Nagelbrett">
        <Board />
        {PEGS.map((p, i) => (
          <Nail key={i} x={p.x} y={p.y} color={BAR_COLORS[p.row % BAR_COLORS.length]} age={(t - pegHit.current[i]) / 1000} />
        ))}
        {animals.map((a, i) => {
          const age = (t - joy.current[i]) / 1000;
          const hop = age >= 0 && age < 0.5 ? a.hop * Math.sin((Math.PI * age) / 0.5) : 0;
          const squash = age >= 0.5 && age < 1.5 ? 0.1 * Math.exp(-(age - 0.5) * 7) * Math.cos((age - 0.5) * 28) : 0;
          return (
            <g key={i} transform={`translate(${binCenter(i)} ${FLOOR - hop}) scale(${1 + squash} ${1 - squash})`}>
              {a.draw({ happy: age >= 0 && age < 1.4, wag: wobble(age, 28, 22, 2.5) })}
            </g>
          );
        })}
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
        {lying.current.map((m) => (
          <Ball key={m.id} color={m.color} x={m.x} y={FLOOR + PILE_SLOTS[m.slot].y} spin={m.spin} />
        ))}
        {pops.current.map((p, i) => (
          <Sparkles key={i} x={p.x} y={p.y} age={(t - p.at) / 1000} n={8} spread={90} />
        ))}
        {falling.current.map((d) => {
          const s = Math.min(1, d.age / SPAWN_S);
          return (
            <g key={d.id} transform={`translate(${d.x} ${d.y}) scale(${s}) translate(${-d.x} ${-d.y})`}>
              <Ball color={d.color} x={d.x} y={d.y} spin={d.spin} />
            </g>
          );
        })}
        <Frame />
        {!started.current && (
          // A still hint: a marble waiting at the top, and a finger under it. Nothing moves before the first tap.
          <g className="pegs-hint" opacity="0.8">
            <Ball color={BAR_COLORS[0]} x={VIEW_W / 2} y={SPAWN_Y} spin={0} />
            <text x={VIEW_W / 2} y={SPAWN_Y + 118} fontSize="80" textAnchor="middle">
              👆
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

/** A nail: a brass head that glows in its row's colour for a moment after a marble hit it. */
function Nail({ x, y, color, age }: { x: number; y: number; color: string; age: number }) {
  const glow = age >= 0 && age < PEG_GLOW_S ? age / PEG_GLOW_S : -1;
  return (
    <g>
      {glow >= 0 && <circle cx={x} cy={y} r={PEG_R + 6 + 24 * glow} fill="none" stroke={color} strokeWidth={8 * (1 - glow)} opacity={1 - glow} />}
      <circle cx={x + 2} cy={y + 3} r={PEG_R} fill="#0002" />
      <circle cx={x} cy={y} r={PEG_R} fill={glow >= 0 && glow < 0.6 ? color : "#f4c542"} stroke={INK} strokeWidth="3" />
      <circle cx={x - 3} cy={y - 3} r="2.5" fill="#fff" opacity="0.85" />
    </g>
  );
}

/** The wall behind, the light wooden board with its grain, the drop strip at the top and the bins' coloured backs. */
function Board() {
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
}

/** The frame's edge drawn over everything, so marbles roll right up to the wood; with a screw in each corner. */
function Frame() {
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
}

/** Five of the six animals, in a new order every round. */
function pickAnimals(n: number): Animal[] {
  const all: Animal[] = [
    { draw: Frog, sound: playCroak, hop: 85 },
    { draw: Cow, sound: playMoo, hop: 40 },
    { draw: Dog, sound: playBark, hop: 55 },
    { draw: Duck, sound: playQuack, hop: 50 },
    { draw: Cat, sound: playMeow, hop: 60 },
    { draw: Pig, sound: playOink, hop: 45 },
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
