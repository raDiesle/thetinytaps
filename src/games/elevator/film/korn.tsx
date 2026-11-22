import type { ReactNode } from "react";
import { INK } from "@/components/drawing";
import { playEngine } from "@/lib/realSounds";
import { playChime, playDing, playDrops, playLeaves, playPop, playPuff, playRecorded, playThump, playTrickle, playWhoosh } from "@/lib/sfx";
import { Kid, KidHead, type Look, type Pose, useHero } from "../kid";
import type { Picture } from "../trail/items";
import type { Point } from "../trail/types";
import { BAKE_CARD, BAKE_ICON, BAKE_SOUND, BAKER, type Bake, Bakery, DOOR_X, home as bakersHome, IN_WINDOW, oven as bakersOven, SHOP_ICON } from "./baecker";
import { Go, route } from "./move";
import { RainCloud, Wheel } from "./parts";
import { Grownup } from "./people";
import { Outdoors, RoundTree } from "./places";
import { type Beat, type Film, GROUND, PACE, type Scene, type SceneProps } from "./types";

// „From grain to bread“ (G-20, a film of something coming to be; written English first): the farmer's tractor sows
// the grain, the child brings the rain cloud and pushes it from the sun, the grain grows green and then golden, the
// combine harvester cuts it and pours the grains into the trailer, at the windmill the grain is tipped out and ground
// into flour, the flour goes to the baker, the child picks what to bake from it (rolls, a pretzel or a cake), and the
// last two scenes are the oven and the breakfast table of „Beim Bäcker“, told with this film's own lines. Many hands
// help: a fox and a vixen farming, a she-bear milling, a bear baking. A calm film: slow machines, soft sounds.

const engine = () => playRecorded("engine", playEngine);

const FAR = 2400;
/** Where the tractor and the combine harvester drive: on the field, a little in front of the grass. */
const LANE = GROUND + 30;
/** Where the people stand on the meadow beside the field. */
const FEET = GROUND + 20;
/** Where the field begins on the left; the meadow lies before it. */
const FIELD_LEFT = 420;

const FARMER: Look = { shirt: "#e8590c", pants: "#1971c2", hair: "#5c3d2e", animal: "fox" };
const FARMHAND: Look = { shirt: "#f783ac", pants: "#2b8a3e", hair: "#a0522d", curly: true, animal: "fox", lashes: true };
const MILLER: Look = { shirt: "#4dabf7", pants: "#868e96", hair: "#e8b04b", curly: true, animal: "bear", lashes: true };

/** The child in its own clothes. */
function Child({ pose, face = 1 }: { pose: Pose; face?: 1 | -1 }) {
  const hero = useHero();
  return <Kid look={hero} pose={pose} holding={null} wear={[]} face={face} />;
}

/** Something that pops in when it appears. */
function Pop({ children }: { children: ReactNode }) {
  return <g className="fm-pop">{children}</g>;
}

/**
 * When a thing moved by `Go` from `from` to `to` passes `x`, as a share of the move's time: `Go` eases in and out
 * (CSS „ease-in-out“), so the share of the way is turned back into the share of the time. Things the vehicle passes
 * (seeds dropped, grain cut) appear or go just as it gets there.
 */
function passing(from: number, to: number, x: number): number {
  const way = Math.min(1, Math.max(0, (x - from) / (to - from)));
  const bezier = (a: number, b: number, u: number) => 3 * (1 - u) * (1 - u) * u * a + 3 * (1 - u) * u * u * b + u * u * u;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (bezier(0, 1, mid) < way) lo = mid;
    else hi = mid;
  }
  return bezier(0.42, 0.58, (lo + hi) / 2);
}

/** A CSS delay of `ms` at the film's pace. */
const delay = (ms: number) => ({ animationDelay: `${(ms * PACE) / 1000}s` });

// ---------- The farm and the field ----------

/** A red barn with a hay loft and its big door, and a silo beside it, standing on (0, 0). */
function Barn() {
  return (
    <g>
      <rect x="170" y="-330" width="90" height="330" rx="10" fill="#ced4da" stroke={INK} strokeWidth="4" />
      <path d="M170 -330 Q215 -380 260 -330 Z" fill="#868e96" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M170 -250 H260 M170 -170 H260 M170 -90 H260" stroke="#adb5bd" strokeWidth="4" />
      <path d="M-150 0 V-210 L-170 -210 L0 -330 L170 -210 L150 -210 V0 Z" fill="#c92a2a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-170 -210 L0 -330 L170 -210" stroke="#fff" strokeWidth="10" fill="none" strokeLinejoin="round" />
      <path d="M-130 -40 H130 M-130 -90 H130 M-130 -140 H130" stroke="#a61e1e" strokeWidth="3" />
      <rect x="-80" y="-150" width="160" height="150" fill="#a61e1e" stroke="#fff" strokeWidth="8" />
      <path d="M-76 -146 L76 -4 M76 -146 L-76 -4" stroke="#fff" strokeWidth="8" />
      <rect x="-30" y="-262" width="60" height="56" fill="#ffe066" stroke="#fff" strokeWidth="7" />
      <path d="M-24 -214 Q0 -236 24 -214" stroke="#e8b04b" strokeWidth="6" fill="none" />
    </g>
  );
}

/** The farm in the back: hills, sky and sun, the barn and a tree; the ground is meadow. */
function Farm({ children }: { children?: ReactNode }) {
  return (
    <g>
      <Outdoors ground="#8ce99a" />
      <g transform={`translate(1900 ${GROUND - 60}) scale(0.8)`}>
        <Barn />
      </g>
      <RoundTree x={120} s={1.05} />
      {children}
    </g>
  );
}

/** The ploughed field from `left` to `right`: brown earth with furrows, its top edge a little above the grass's foot. */
function Earth({ left = FIELD_LEFT, right = FAR * 2 }: { left?: number; right?: number }) {
  const top = GROUND - 46;
  return (
    <g>
      <rect x={left} y={top} width={right - left} height={FAR} fill="#9c6b3f" />
      <path d={`M${left} ${top} H${right}`} stroke="#7a4f2a" strokeWidth="5" />
      <path
        d={[GROUND - 18, GROUND + 22, GROUND + 66, GROUND + 118, GROUND + 180].map((y) => `M${left} ${y} H${right}`).join(" ")}
        stroke="#7a4f2a"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="60 18"
      />
    </g>
  );
}

/** The rows the grain grows in, from the back to the front: where each stands and how tall it grows. */
const ROWS = [
  { y: GROUND - 34, h: 118, dx: 0 },
  { y: GROUND - 6, h: 132, dx: 14 },
  { y: GROUND + 24, h: 148, dx: 7 },
];

/** The paths of a stretch of grain from `left` to `right`, built once: stalks, leaves, ears and their awns, the
 * sprouts it starts as and the stubble the harvest leaves. */
function grainPaths(left: number, right: number) {
  let stalks = "";
  let leaves = "";
  let ears = "";
  let awns = "";
  let sprouts = "";
  let stubble = "";
  for (const { y, h, dx } of ROWS) {
    for (let x = left + dx; x < right; x += 26) {
      const bend = ((x * 7) % 11) - 5;
      const t = y - h;
      stalks += `M${x} ${y} Q${x + bend / 2} ${y - h / 2} ${x + bend} ${t} `;
      leaves += `M${x + bend / 4} ${y - h * 0.4} q14 -6 22 -28 `;
      ears += `M${x + bend} ${t} c9 -6 9 -30 0 -40 c-9 10 -9 34 0 40 Z `;
      awns += `M${x + bend} ${t - 34} l-8 -18 M${x + bend} ${t - 36} l2 -20 M${x + bend} ${t - 34} l9 -16 `;
      sprouts += `M${x} ${y} q-8 -10 -10 -22 M${x} ${y} q1 -14 -1 -28 M${x} ${y} q8 -10 12 -20 `;
      stubble += `M${x} ${y} l-2 -16 M${x + 4} ${y} l3 -14 `;
    }
  }
  return { stalks, leaves, ears, awns, sprouts, stubble };
}

type GrainPaths = ReturnType<typeof grainPaths>;

/** Green while it grows, golden once it is ripe. */
const GREEN = { stalk: "#2f9e44", ear: "#8ce99a", line: "#2b8a3e" };
const GOLD = { stalk: "#e0a526", ear: "#fcc419", line: "#b7791f" };

/** Grown grain of one colour. */
function Grain({ p, c }: { p: GrainPaths; c: typeof GOLD }) {
  return (
    <g strokeLinecap="round">
      <path d={p.stalks} stroke={c.stalk} strokeWidth="5" fill="none" />
      <path d={p.leaves} stroke={c.stalk} strokeWidth="6" fill="none" />
      <path d={p.awns} stroke={c.line} strokeWidth="2.5" fill="none" />
      <path d={p.ears} fill={c.ear} stroke={c.line} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  );
}

/** The seeds the drill leaves in the furrows, drawn as little dots along the rows. */
function seedDots(left: number, right: number) {
  let d = "";
  for (const { y, dx } of ROWS) for (let x = left + dx; x < right; x += 26) d += `M${x} ${y} h0.1 `;
  return d;
}

// ---------- The machines ----------

/** The tractor's colours, and where its parts are: it faces right with its wheels on (0, 0). */
const TRACTOR_GREEN = "#37b24d";
const TRACTOR_DARK = "#2b8a3e";
/** Where a trailer or the seed drill hangs on. */
const HITCH: Point = [-200, -60];

/**
 * The green tractor, facing right with its wheels on (0, 0): a big back wheel under its mudguard, the cab with
 * `driver` (and the child beside it, `rider`) behind the glass, the long bonnet with its exhaust and a headlight, a
 * small front wheel. What it pulls (`children`) is drawn behind it, hanging on at `HITCH`.
 */
function Tractor({ driver, rider = false, driving = false, children }: { driver: Look; rider?: boolean; driving?: boolean; children?: ReactNode }) {
  const hero = useHero();
  return (
    <g>
      <ellipse cx="20" cy="2" rx="250" ry="14" fill="#000" opacity="0.15" />
      {children}
      <path d={`M${HITCH[0]} ${HITCH[1]} H-150`} stroke="#495057" strokeWidth="12" strokeLinecap="round" />
      {/* Chassis and bonnet */}
      <rect x="-160" y="-118" width="390" height="44" rx="10" fill="#495057" stroke={INK} strokeWidth="4" />
      <path d="M-10 -96 V-200 H196 Q232 -200 238 -164 V-96 Z" fill={TRACTOR_GREEN} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M8 -186 H190" stroke="#8ce99a" strokeWidth="6" strokeLinecap="round" />
      <path d="M210 -186 V-104 M224 -178 V-104" stroke={TRACTOR_DARK} strokeWidth="5" />
      <circle cx="232" cy="-140" r="11" fill="#ffe066" stroke={INK} strokeWidth="3" />
      <rect x="140" y="-272" width="16" height="74" rx="4" fill="#495057" stroke={INK} strokeWidth="3" />
      <rect x="136" y="-280" width="24" height="12" rx="4" fill="#343a40" stroke={INK} strokeWidth="3" />
      {/* The cab: roof, posts and glass with the driver (and the child) inside */}
      <rect x="-176" y="-322" width="168" height="206" rx="8" fill="#a5d8ff" opacity="0.75" />
      <g transform={`translate(-56 -172) scale(0.52)`}>
        <KidHead look={driver} />
      </g>
      {rider && (
        <g transform={`translate(-124 -164) scale(0.44)`}>
          <KidHead look={hero} />
        </g>
      )}
      <path d="M-176 -116 V-322 H-8 V-116" stroke={TRACTOR_DARK} strokeWidth="10" fill="none" strokeLinejoin="round" />
      <path d="M-162 -300 l26 -10 M-160 -282 l14 -6" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <rect x="-194" y="-344" width="204" height="26" rx="8" fill={TRACTOR_GREEN} stroke={INK} strokeWidth="4" />
      <circle cx="-90" cy="-352" r="9" fill="#ff922b" stroke={INK} strokeWidth="3" />
      {/* The mudguard over the big wheel, and the wheels */}
      <path d="M-196 -100 A110 110 0 0 1 32 -100" stroke={TRACTOR_GREEN} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d="M-196 -100 A110 110 0 0 1 32 -100" stroke={INK} strokeWidth="3" fill="none" />
      <g transform="translate(-82 -94)">
        <Wheel r={94} spin={driving} />
      </g>
      <g transform="translate(166 -56)">
        <Wheel r={56} spin={driving} />
      </g>
    </g>
  );
}

/** The seed drill the tractor pulls, in the tractor's coordinates: a red seed box on a small wheel with its tines in
 * the earth; while it `sows`, seeds fall from the tines. */
function SeedDrill({ sows }: { sows: boolean }) {
  return (
    <g>
      <path d={`M${HITCH[0]} ${HITCH[1]} L-262 -96`} stroke="#495057" strokeWidth="10" strokeLinecap="round" />
      <path d="M-480 -184 H-252 L-272 -96 H-460 Z" fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="-490" y="-198" width="248" height="20" rx="6" fill="#c92a2a" stroke={INK} strokeWidth="4" />
      <path d="M-450 -150 H-282" stroke="#ff8787" strokeWidth="6" strokeLinecap="round" />
      <path d="M-460 -96 V-12 M-418 -96 V-12 M-376 -96 V-12 M-334 -96 V-12 M-292 -96 V-12" stroke="#495057" strokeWidth="7" strokeLinecap="round" />
      {sows && (
        <g fill="#f4d58d" stroke="#b7791f" strokeWidth="1.5">
          {[-460, -418, -376, -334, -292].map((x, i) => (
            <ellipse key={x} className="fm-kn-drop" style={{ animationDelay: `${i * 0.12}s` }} cx={x} cy="-10" rx="5" ry="3.5" />
          ))}
        </g>
      )}
      <g transform="translate(-370 -34)">
        <Wheel r={34} spin={sows} />
      </g>
    </g>
  );
}

/** Where the trailer's back is, at the bottom: it tips round this to pour its grain out at the back. */
const TRAILER_BACK: Point = [-520, -80];

/** A sack of flour, centred on (0, 0) in about 70 × 90: white, tied at the top, a wheat ear on it. */
function Sack() {
  return (
    <g>
      <path
        d="M-34 44 Q-40 -10 -26 -32 L-14 -40 Q0 -34 14 -40 L26 -32 Q40 -10 34 44 Q0 52 -34 44 Z"
        fill="#f8f9fa"
        stroke={INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M-16 -40 Q0 -54 16 -40" stroke={INK} strokeWidth="3" fill="#f1f3f5" />
      <path d="M-12 -38 H12" stroke="#c08552" strokeWidth="5" strokeLinecap="round" />
      <path d="M0 30 V-6" stroke="#e0a526" strokeWidth="3" />
      <path
        d="M0 -6 c6 -4 6 -18 0 -24 c-6 6 -6 20 0 24 Z M0 14 c8 -2 12 -12 10 -18 M0 14 c-8 -2 -12 -12 -10 -18"
        fill="#fcc419"
        stroke="#b7791f"
        strokeWidth="2"
      />
    </g>
  );
}

/**
 * The red trailer the tractor pulls, in the tractor's coordinates: an open box on two wheels. `heap` is how full of
 * grain it is (0 to 1), `tip` raises its front so the grain pours out at the back (`pour` shows it falling), `sack`
 * puts a sack of flour on it.
 */
function Trailer({
  heap,
  tip = false,
  pour = false,
  sack = false,
  rolling = false,
}: {
  heap: number;
  tip?: boolean;
  pour?: boolean;
  sack?: boolean;
  rolling?: boolean;
}) {
  return (
    <g>
      <path d={`M${HITCH[0]} ${HITCH[1]} L-246 -70`} stroke="#495057" strokeWidth="10" strokeLinecap="round" />
      <rect x="-510" y="-86" width="260" height="20" rx="6" fill="#495057" stroke={INK} strokeWidth="3" />
      <g className="fm-kn-tip" style={{ transform: tip ? "rotate(-26deg)" : "none", transformOrigin: `${TRAILER_BACK[0]}px ${TRAILER_BACK[1]}px` }}>
        <g className="fm-kn-heap" style={{ transform: `scaleY(${heap})` }}>
          <path d="M-512 -196 Q-470 -270 -380 -276 Q-290 -270 -248 -196 Z" fill="#fcc419" stroke="#b7791f" strokeWidth="3" />
          <path
            d="M-470 -220 h0.1 M-430 -240 h0.1 M-390 -252 h0.1 M-350 -246 h0.1 M-310 -226 h0.1 M-410 -214 h0.1 M-330 -208 h0.1"
            stroke="#e0a526"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </g>
        <rect x="-520" y="-200" width="280" height="120" rx="8" fill="#e8590c" stroke={INK} strokeWidth="4" />
        <path d="M-520 -160 H-240 M-520 -120 H-240" stroke="#c2410c" strokeWidth="4" />
        <path d="M-510 -192 H-250" stroke="#ffa94d" strokeWidth="5" strokeLinecap="round" />
        <rect x="-526" y="-206" width="14" height="128" rx="4" fill="#c2410c" stroke={INK} strokeWidth="3" />
        {sack && (
          <g transform="translate(-380 -244)">
            <Sack />
          </g>
        )}
      </g>
      {pour && (
        <path
          className="fm-kn-pour"
          d={`M${TRAILER_BACK[0] - 50} -170 Q${TRAILER_BACK[0] - 80} -120 ${TRAILER_BACK[0] - 84} -40`}
          stroke="#fcc419"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="14 10"
        />
      )}
      {[-440, -320].map((x) => (
        <g key={x} transform={`translate(${x} -40)`}>
          <Wheel r={40} spin={rolling} />
        </g>
      ))}
    </g>
  );
}

/** Where the combine harvester's pipe pours out, from its wheels' middle. */
const SPOUT: Point = [540, -430];
const COMBINE_RED = "#e03131";

/**
 * The red combine harvester, facing right with its wheels on (0, 0): the cutter at the front with its reel (turning
 * while `driving`), the body on a big front wheel and a small back one, the cab high up front with the farmer and the
 * child, the grain tank behind it filled to `tank` (0 to 1), and the long pipe reaching forward over the cab, the
 * grain pouring from its end while `pour`.
 */
function Combine({ driving, tank, pour }: { driving: boolean; tank: number; pour: boolean }) {
  const hero = useHero();
  return (
    <g>
      <ellipse cx="60" cy="2" rx="330" ry="16" fill="#000" opacity="0.15" />
      {/* The grain tank, its grain heaped up over the top */}
      <g className="fm-kn-heap" style={{ transform: `scaleY(${tank})` }}>
        <path d="M-226 -396 Q-110 -470 6 -396 Z" fill="#fcc419" stroke="#b7791f" strokeWidth="3" />
      </g>
      <rect x="-236" y="-400" width="250" height="70" rx="6" fill="#ffe3e3" stroke={INK} strokeWidth="4" />
      <path d="M-226 -366 H4" stroke="#ffc9c9" strokeWidth="5" />
      {/* The body */}
      <path d="M-262 -96 V-330 H150 V-200 L200 -150 V-96 Z" fill={COMBINE_RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-262 -240 H150" stroke="#ffd43b" strokeWidth="14" />
      <path d="M-262 -240 H150" stroke={INK} strokeWidth="2" strokeOpacity="0.4" />
      <path d="M-246 -316 H130" stroke="#ff8787" strokeWidth="6" strokeLinecap="round" />
      <rect x="-230" y="-208" width="90" height="70" rx="8" fill="#c92a2a" stroke={INK} strokeWidth="3" />
      <path d="M-220 -194 H-150 M-220 -174 H-150 M-220 -154 H-150" stroke="#a61e1e" strokeWidth="4" />
      {/* The cab with the farmer and the child */}
      <rect x="10" y="-470" width="140" height="140" rx="10" fill="#a5d8ff" opacity="0.8" />
      <g transform="translate(96 -320) scale(0.5)">
        <KidHead look={FARMER} />
      </g>
      <g transform="translate(40 -312) scale(0.42)">
        <KidHead look={hero} />
      </g>
      <path d="M10 -330 V-470 H150 V-330" stroke="#c92a2a" strokeWidth="10" fill="none" strokeLinejoin="round" />
      <path d="M24 -452 l26 -10 M26 -434 l14 -6" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      <rect x="0" y="-488" width="160" height="22" rx="8" fill={COMBINE_RED} stroke={INK} strokeWidth="4" />
      <circle cx="80" cy="-496" r="9" fill="#ff922b" stroke={INK} strokeWidth="3" />
      {/* The pipe: up from the tank and forward over the cab, its spout pointing down */}
      <path
        d={`M-110 -400 L-90 -470 L${SPOUT[0] - 20} -506 L${SPOUT[0]} ${SPOUT[1] - 20}`}
        stroke={INK}
        strokeWidth="26"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={`M-110 -400 L-90 -470 L${SPOUT[0] - 20} -506 L${SPOUT[0]} ${SPOUT[1] - 20}`}
        stroke="#ffd43b"
        strokeWidth="18"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pour && (
        <path
          className="fm-kn-pour"
          d={`M${SPOUT[0]} ${SPOUT[1] - 6} V-220`}
          stroke="#fcc419"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="14 10"
        />
      )}
      {/* The cutter: the neck down from the body, the bar along the ground with its points, the reel over it */}
      <path d="M150 -200 L240 -130 V-70 L150 -96 Z" fill="#c92a2a" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="220" y="-116" width="170" height="64" rx="10" fill="#ffd43b" stroke={INK} strokeWidth="4" />
      <path
        d="M232 -52 l8 18 l8 -18 M262 -52 l8 18 l8 -18 M292 -52 l8 18 l8 -18 M322 -52 l8 18 l8 -18 M352 -52 l8 18 l8 -18"
        fill="#adb5bd"
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M300 -150 L300 -96" stroke="#495057" strokeWidth="8" />
      <g transform="translate(300 -160)">
        <g className={driving ? "fm-wheel spin" : "fm-wheel"}>
          <circle r="62" fill="none" stroke="#fab005" strokeWidth="6" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0 0 V-62" stroke="#e8a317" strokeWidth="5" />
              <path d="M-14 -62 H14" stroke={INK} strokeWidth="7" strokeLinecap="round" />
            </g>
          ))}
          <circle r="10" fill="#495057" stroke={INK} strokeWidth="3" />
        </g>
      </g>
      <g transform="translate(-196 -56)">
        <Wheel r={56} spin={driving} />
      </g>
      <g transform="translate(46 -86)">
        <Wheel r={86} spin={driving} />
      </g>
    </g>
  );
}

// ---------- The windmill ----------

/** One of the windmill's four sails, pointing up from the hub at (0, 0): a long spar with a lattice to one side. */
function Sail() {
  return (
    <g>
      <path d="M0 0 V-250" stroke="#8d5a3b" strokeWidth="12" strokeLinecap="round" />
      <rect x="4" y="-246" width="58" height="192" fill="#fff9db" stroke="#8d5a3b" strokeWidth="5" />
      <path d="M4 -214 H62 M4 -182 H62 M4 -150 H62 M4 -118 H62 M4 -86 H62 M33 -246 V-54" stroke="#c08552" strokeWidth="3" />
    </g>
  );
}

/** The windmill standing on (0, 0): a whitewashed tower of stones, a brown cap, a door with a step, small windows
 * and the four sails on their hub at (0, -480), turning while `turning`. Sacks of flour wait beside the door. */
function Windmill({ turning }: { turning: boolean }) {
  return (
    <g>
      <path d="M-150 0 L-100 -450 H100 L150 0 Z" fill="#fff4e6" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d="M-138 -100 H138 M-127 -200 H127 M-116 -300 H116 M-105 -400 H105 M-60 -100 V-50 M40 -200 V-150 M-30 -300 V-250 M70 -50 V0"
        stroke="#e9c9a0"
        strokeWidth="4"
      />
      <rect x="-26" y="-340" width="52" height="60" rx="26" fill="#74c0fc" stroke={INK} strokeWidth="4" />
      <path d="M0 -340 V-280" stroke={INK} strokeWidth="3" />
      <rect x="-80" y="-220" width="40" height="44" rx="6" fill="#74c0fc" stroke={INK} strokeWidth="4" />
      <path d="M-56 -128 Q-56 -186 0 -186" fill="none" />
      {/* The door with its step */}
      <path d="M-46 0 V-100 Q-46 -136 0 -136 Q46 -136 46 -100 V0 Z" fill="#8d5a3b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M0 -136 V0 M-46 -60 H46" stroke="#6b3f22" strokeWidth="4" />
      <circle cx="30" cy="-56" r="5" fill="#ffd43b" />
      <rect x="-62" y="-8" width="124" height="14" rx="4" fill="#adb5bd" stroke={INK} strokeWidth="3" />
      {/* The cap */}
      <path d="M-122 -440 Q-110 -540 0 -548 Q110 -540 122 -440 Z" fill="#8d5a3b" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-90 -480 Q0 -520 90 -480" stroke="#a0522d" strokeWidth="6" fill="none" />
      {/* The sails */}
      <g transform="translate(0 -480)">
        <g className={turning ? "fm-kn-sails turn" : "fm-kn-sails"}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <Sail />
            </g>
          ))}
          <circle r="24" fill="#6b3f22" stroke={INK} strokeWidth="4" />
        </g>
      </g>
      {/* Sacks waiting by the wall */}
      {[-200, -150].map((x, i) => (
        <g key={x} transform={`translate(${x} ${-46 + i * 4}) scale(${0.9 - i * 0.08})`}>
          <Sack />
        </g>
      ))}
    </g>
  );
}

// ---------- Small pictures: the strip of scenes ----------

const pic = (w: number, h: number, draw: () => ReactNode): Picture => ({ w, h, draw });

const SOW_ICON = pic(760, 400, () => (
  <g transform="translate(140 0)">
    <Tractor driver={FARMER}>
      <SeedDrill sows={false} />
    </Tractor>
  </g>
));
const GROW_P = grainPaths(-150, 150);
const GROW_ICON = pic(320, 300, () => (
  <g>
    <circle cx="90" cy="-230" r="44" fill="#ffe066" stroke="#fab005" strokeWidth="6" />
    <g transform={`translate(0 ${-(GROUND + 24)})`}>
      <Grain p={GROW_P} c={GOLD} />
    </g>
  </g>
));
const COMBINE_ICON = pic(880, 560, () => (
  <g transform="translate(-140 0)">
    <Combine driving={false} tank={1} pour={false} />
  </g>
));
const MILL_ICON = pic(520, 840, () => (
  <g transform="translate(0 0)">
    <Windmill turning={false} />
  </g>
));

// ---------- Sowing ----------

const SOW_FROM = 820;
const SOW_TO = 3200;
const SOW_MS = 6000;
/** Where the drill's tines are, from the tractor: what they pass is sown. */
const TINES = -380;
/** The field sown in stretches, each appearing as the drill passes it. */
const SEED_STRETCHES = Array.from({ length: 26 }, (_, i) => {
  const left = FIELD_LEFT + i * 78;
  return { d: seedDots(left, left + 78), at: passing(SOW_FROM, SOW_TO, left + 39 - TINES) * SOW_MS };
});

function SowDraw({ step, busy }: SceneProps) {
  const tractor = route<Point[]>(step, [
    [0, [[SOW_FROM, LANE]]],
    [
      2,
      [
        [SOW_FROM, LANE],
        [SOW_TO, LANE],
      ],
    ],
  ]);
  const sowing = busy && step === 2;
  return (
    <Farm>
      <Earth />
      {step >= 2 && (
        <g stroke="#f4d58d" strokeWidth="9" strokeLinecap="round">
          {SEED_STRETCHES.map((s) => (
            <path key={s.at} className="fm-kn-sow" style={delay(s.at)} d={s.d} />
          ))}
        </g>
      )}
      <Go path={tractor} ms={SOW_MS}>
        <Tractor driver={FARMER} rider driving={sowing}>
          <SeedDrill sows={sowing} />
        </Tractor>
      </Go>
    </Farm>
  );
}

const sow: Scene = {
  id: "saeen",
  icon: SOW_ICON,
  focus: [100, 360, 1400, 500],
  Draw: SowDraw,
  beats: [
    { ms: 3800, say: "This is the farmer's field. Today we sow grain." },
    {
      tap: { at: [SOW_FROM + 10, LANE - 200], r: 150 },
      ask: "Start the tractor!",
      sounds: [[0, engine]],
      say: "The tractor puts the seeds into the earth.",
      ms: 6600,
    },
    { ms: 3200, say: "Now the seeds sleep in the earth." },
  ],
};

// ---------- Rain and sun ----------

const FIELD_P = grainPaths(FIELD_LEFT, FAR * 2);
const SEEDS_D = seedDots(FIELD_LEFT, FAR * 2);
const CLOUD_REST: Point = [620, 340];
const CLOUD_RAIN: Point = [1000, 360];
const CLOUD_GONE: Point = [2200, 200];
const KID_EDGE = 170;
const FARMER_EDGE = 300;

/** The grain coming up: each stage grows out of the earth as the one before fades. */
function GrowingGrain({ stage }: { stage: number }) {
  const layer = (n: number, child: ReactNode) => (
    <g className="fm-kn-grow" style={{ transform: stage >= n ? "scaleY(1)" : "scaleY(0.2)", opacity: stage === n ? 1 : 0 }}>
      {child}
    </g>
  );
  return (
    <g>
      {layer(1, <path d={FIELD_P.sprouts} stroke="#51cf66" strokeWidth="5" strokeLinecap="round" fill="none" />)}
      {layer(2, <Grain p={FIELD_P} c={GREEN} />)}
      {layer(3, <Grain p={FIELD_P} c={GOLD} />)}
    </g>
  );
}

function GrowDraw({ step, busy }: SceneProps) {
  const cloud = route<Point[]>(step, [
    [0, [CLOUD_REST]],
    [2, [CLOUD_REST, CLOUD_RAIN]],
    [4, [CLOUD_RAIN, CLOUD_GONE]],
  ]);
  // The shoots come after the rain, the grain grows green in the sun and turns golden.
  const stage = step >= 5 ? 3 : step >= 4 ? 2 : step >= 3 ? 1 : 0;
  const happy = busy && (step === 3 || step === 5);
  return (
    <Farm>
      {step >= 4 && (
        <g transform="translate(1420 110)">
          <circle className="fm-gt-shine" r="100" fill="none" stroke="#ffe066" strokeWidth="18" />
        </g>
      )}
      <Earth />
      <path d={SEEDS_D} stroke="#f4d58d" strokeWidth="9" strokeLinecap="round" opacity={stage === 0 ? 1 : 0} className="fm-gt-turn" />
      <GrowingGrain stage={stage} />
      <g transform={`translate(${FARMER_EDGE} ${FEET})`}>
        <Grownup look={FARMER} pose={happy ? "cheer" : "stand"} wear={["farmer"]} face={1} />
      </g>
      <g transform={`translate(${KID_EDGE} ${FEET})`}>
        <Child pose={happy ? "cheer" : "stand"} />
      </g>
      <Go path={cloud} ms={step >= 4 ? 3000 : 1800}>
        <RainCloud raining={step === 2} />
      </Go>
    </Farm>
  );
}

const grow: Scene = {
  id: "wachsen",
  icon: GROW_ICON,
  focus: [100, 220, 1300, 640],
  Draw: GrowDraw,
  beats: [
    { ms: 3000, say: "The seeds need rain and sun." },
    {
      tap: { at: CLOUD_REST, r: 110 },
      ask: "Bring the rain cloud!",
      sounds: [[1500, playDrops]],
      say: "Pitter patter. Rain falls on the field.",
      ms: 4600,
    },
    { ms: 3000, sounds: [[500, playPop]], say: "Look! Little green shoots." },
    {
      tap: { at: CLOUD_RAIN, r: 110 },
      ask: "Push the cloud away!",
      sounds: [[400, playChime]],
      say: "The sun is warm. The grain grows and grows.",
      ms: 4400,
    },
    { ms: 4000, sounds: [[800, playLeaves]], say: "Now the grain is golden and ripe." },
  ],
};

// ---------- The harvest ----------

const HARVEST_FROM = 280;
const HARVEST_TO = 1030;
const HARVEST_MS = 5000;
const HARVEST_LEFT = 690;
const HARVEST_RIGHT = 1380;
/** Where the reel meets the grain, from the combine's wheels: what it passes is cut. */
const CUTTER = 300;
/** The ripe field cut in stretches, each gone as the cutter passes it; the stubble stays. */
const CUT_STRETCHES = Array.from({ length: 9 }, (_, i) => {
  const left = HARVEST_LEFT + i * 77;
  return { p: grainPaths(left, left + 77), at: passing(HARVEST_FROM, HARVEST_TO, left + 38 - CUTTER) * HARVEST_MS };
});
const STUBBLE = grainPaths(HARVEST_LEFT, HARVEST_RIGHT).stubble;
/** The tractor waits with its trailer behind the field; its trailer's middle lies under the combine's spout. */
const WAIT_X = HARVEST_TO + SPOUT[0] + 380;

function HarvestDraw({ step, busy }: SceneProps) {
  const combine = route<Point[]>(step, [
    [0, [[HARVEST_FROM, LANE]]],
    [
      2,
      [
        [HARVEST_FROM, LANE],
        [HARVEST_TO, LANE],
      ],
    ],
  ]);
  const tractor = route<Point[]>(step, [
    [0, [[WAIT_X, LANE]]],
    [
      4,
      [
        [WAIT_X, LANE],
        [WAIT_X + 1600, LANE],
      ],
    ],
  ]);
  const pouring = busy && step === 3;
  return (
    <Farm>
      <Earth left={HARVEST_LEFT - 20} right={HARVEST_RIGHT + 20} />
      <path d={STUBBLE} stroke="#d9a441" strokeWidth="4" strokeLinecap="round" />
      {CUT_STRETCHES.map((s) => (
        <g key={s.at} className={step >= 2 ? "fm-kn-cut" : undefined} style={step >= 2 ? delay(s.at) : undefined}>
          <Grain p={s.p} c={GOLD} />
        </g>
      ))}
      <Go path={tractor} ms={3400}>
        <Tractor driver={FARMHAND} driving={busy && step === 4}>
          <Trailer heap={step >= 3 ? 1 : 0} rolling={busy && step === 4} />
        </Tractor>
      </Go>
      <Go path={combine} ms={HARVEST_MS}>
        <Combine driving={busy && step === 2} tank={step >= 3 ? 0 : step >= 2 ? 1 : 0} pour={pouring} />
      </Go>
    </Farm>
  );
}

const harvest: Scene = {
  id: "ernte",
  icon: COMBINE_ICON,
  focus: [80, 200, 1620, 640],
  Draw: HarvestDraw,
  beats: [
    { ms: 3600, say: "The grain is ripe. Here is the combine harvester." },
    {
      tap: { at: [HARVEST_FROM + 90, LANE - 250], r: 150 },
      ask: "Start the combine harvester!",
      sounds: [[0, engine]],
      say: "It cuts the grain and keeps the grains inside.",
      ms: 5800,
    },
    {
      tap: { at: [WAIT_X - 380, LANE - 150], r: 110 },
      ask: "Pour the grain into the trailer!",
      sounds: [[600, playTrickle]],
      say: "Look at all the grain!",
      ms: 4400,
    },
    { ms: 3800, sounds: [[0, engine]], say: "The tractor takes the grain to the mill." },
  ],
};

// ---------- The mill ----------

const MILL_X = 300;
const HUB: Point = [MILL_X, GROUND - 480];
const HOPPER_X = 520;
const MILL_STOP = 1120;
const MILLER_AT = 395;
/** The sack in the miller's arms, and where it goes on the trailer. */
const IN_ARMS: Point = [MILLER_AT, GROUND - 122];
const ON_TRAILER: Point = [MILL_STOP - 380, LANE - 244];

/** The wooden hopper beside the mill, standing on (0, 0): a funnel the grain is tipped into, with a chute into the
 * mill's wall. */
function Hopper() {
  return (
    <g>
      <path d="M-30 -10 L-110 -6" stroke="#8d5a3b" strokeWidth="18" strokeLinecap="round" />
      <rect x="-14" y="-60" width="10" height="60" fill="#6b3f22" />
      <rect x="40" y="-60" width="10" height="60" fill="#6b3f22" />
      <path d="M-60 -110 H100 L50 -50 H-10 Z" fill="#c08552" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M-50 -98 H90" stroke="#e8b678" strokeWidth="5" />
      <rect x="-10" y="-52" width="60" height="30" fill="#a0522d" stroke={INK} strokeWidth="3" />
    </g>
  );
}

function MillDraw({ step, busy }: SceneProps) {
  const tractor = route<Point[]>(step, [
    [0, [[-700, LANE]]],
    [
      1,
      [
        [-700, LANE],
        [MILL_STOP, LANE],
      ],
    ],
  ]);
  // The miller goes into the mill while it grinds and comes back with the flour.
  const miller = route<Point[]>(step, [
    [0, [[MILLER_AT, GROUND]]],
    [
      3,
      [
        [MILLER_AT, GROUND],
        [MILL_X, GROUND],
      ],
    ],
    [
      4,
      [
        [MILL_X, GROUND],
        [MILLER_AT, GROUND],
      ],
    ],
  ]);
  const sack = route<Point[]>(step, [
    [0, [IN_ARMS]],
    [5, [IN_ARMS, [IN_ARMS[0] + 120, IN_ARMS[1] - 140], ON_TRAILER]],
  ]);
  const inside = step === 3;
  const carrying = step === 4;
  const millerPose = carrying ? "hold" : busy && inside ? "walk" : step >= 5 ? "cheer" : "stand";
  return (
    <Farm>
      <g transform={`translate(${MILL_X} ${GROUND})`}>
        <Windmill turning={step >= 3} />
      </g>
      <g transform={`translate(${HOPPER_X} ${GROUND})`}>
        <Hopper />
      </g>
      <Go path={miller} ms={1800} className={inside ? "fm-kn-inside" : undefined}>
        <Grownup look={MILLER} pose={millerPose} face={inside ? -1 : 1} holding={carrying ? <Sack /> : undefined} />
      </Go>
      <Go path={tractor} ms={3800}>
        <Tractor driver={FARMHAND} rider driving={busy && step === 1}>
          <Trailer heap={step >= 2 ? 0 : 1} tip={step === 2} pour={busy && step === 2} rolling={busy && step === 1} />
        </Tractor>
      </Go>
      {step === 4 && (
        <g transform={`translate(${MILL_X} ${GROUND - 70})`} fill="#f8f9fa" stroke="#dee2e6" strokeWidth="3">
          {[
            [-40, -10, 30],
            [0, -40, 38],
            [44, -12, 28],
            [10, 20, 26],
          ].map(([x, y, r]) => (
            <circle key={x} className="fm-kn-dust" cx={x} cy={y} r={r} />
          ))}
        </g>
      )}
      {step >= 5 && (
        <Go path={sack} ms={1600}>
          <Sack />
        </Go>
      )}
    </Farm>
  );
}

const mill: Scene = {
  id: "muehle",
  icon: MILL_ICON,
  focus: [100, 150, 1300, 700],
  Draw: MillDraw,
  beats: [
    { ms: 4400, sounds: [[0, engine]], say: "Here is the mill. The miller is waiting." },
    {
      tap: { at: [MILL_STOP - 380, LANE - 150], r: 100 },
      ask: "Tip the grain out!",
      sounds: [[800, playTrickle]],
      say: "Whoosh! The grain goes into the mill.",
      ms: 4400,
    },
    {
      tap: { at: HUB, r: 130 },
      ask: "Now the wind! Tap the sails!",
      sounds: [[0, playWhoosh]],
      say: "Round and round. The stones grind the grain into flour.",
      ms: 5600,
    },
    { ms: 3400, sounds: [[1600, playPuff]], say: "Look, soft white flour!" },
    {
      tap: { at: IN_ARMS, r: 80 },
      ask: "Put the flour on the trailer!",
      sounds: [[1500, playThump]],
      say: "Now off to the baker!",
      ms: 3600,
    },
  ],
};

// ---------- At the bakery ----------

const KID_SHOP = 170;
const HAND_SHOP = 340;
/** The sack in the farmer's arms, and then in the baker's. */
const FARMER_ARMS: Point = [HAND_SHOP, GROUND - 122];
const BAKER_ARMS: Point = [DOOR_X, GROUND - 122];

function ShopDraw({ step, busy }: SceneProps) {
  const kid = route<Point[]>(step, [
    [0, [[-300, GROUND]]],
    [
      1,
      [
        [-300, GROUND],
        [KID_SHOP, GROUND],
      ],
    ],
  ]);
  const farmer = route<Point[]>(step, [
    [0, [[-120, GROUND]]],
    [
      1,
      [
        [-120, GROUND],
        [HAND_SHOP, GROUND],
      ],
    ],
  ]);
  const sack = route<Point[]>(step, [
    [0, [[-120, FARMER_ARMS[1]]]],
    [
      1,
      [
        [-120, FARMER_ARMS[1]],
        [HAND_SHOP, FARMER_ARMS[1]],
      ],
    ],
    [3, [FARMER_ARMS, [(FARMER_ARMS[0] + BAKER_ARMS[0]) / 2, FARMER_ARMS[1] - 90], BAKER_ARMS]],
  ]);
  const walking = busy && step === 1;
  const open = step >= 2;
  const handed = step >= 3;
  return (
    <g>
      <Outdoors />
      <RoundTree x={1460} s={1.05} />
      <Bakery open={open} />
      <rect x={-FAR} y={GROUND} width={FAR * 3} height="24" fill="#dee2e6" stroke={INK} strokeWidth="3" />
      <path d={`M${-FAR} ${GROUND + 12} H${FAR * 2}`} stroke="#adb5bd" strokeWidth="20" strokeDasharray="3 117" />
      {open && (
        <g transform={`translate(${DOOR_X} ${GROUND})`}>
          <Pop>
            <Grownup look={BAKER} pose={handed && !(busy && step === 3) ? "hold" : "stand"} wear={["baker"]} face={-1} />
          </Pop>
        </g>
      )}
      <Go path={farmer} ms={3000}>
        <Grownup look={FARMHAND} pose={walking ? "walk" : handed ? "stand" : "hold"} wear={["farmer"]} face={1} />
      </Go>
      <Go path={kid} ms={3000}>
        <Child pose={walking ? "walk" : busy && step === 4 ? "cheer" : "stand"} />
      </Go>
      <Go path={sack} ms={step === 3 ? 1600 : 3000}>
        <Sack />
      </Go>
    </g>
  );
}

const shop: Scene = {
  id: "baeckerei",
  icon: SHOP_ICON,
  focus: [100, 180, 1300, 640],
  Draw: ShopDraw,
  beats: [
    { ms: 3600, say: "Now we bring the flour to the baker." },
    {
      tap: { at: [DOOR_X, GROUND - 110], r: 90 },
      ask: "Ring the bell!",
      sounds: [[0, playDing]],
      say: "Ding-a-ling. Here comes the baker.",
      ms: 2800,
    },
    {
      tap: { at: FARMER_ARMS, r: 80 },
      ask: "Give the flour to the baker!",
      sounds: [[1300, playThump]],
      say: "Thank you! I make dough from your flour.",
      ms: 3800,
    },
    { ms: 2800, say: "Come in, we bake together!" },
  ],
  choice: {
    ask: "What shall we bake from the flour?",
    options: (["broetchen", "brezel", "kuchen"] as Bake[]).map((bake) => ({
      id: bake,
      picture: BAKE_ICON[bake],
      card: BAKE_CARD[bake],
      sounds: BAKE_SOUND[bake],
      at: IN_WINDOW[bake],
      r: 68,
      say: { broetchen: "Rolls!", brezel: "A pretzel!", kuchen: "A cake!" }[bake],
    })),
  },
};

// ---------- The oven and breakfast: the scenes of „Beim Bäcker“ with this film's lines ----------

/** A scene of „Beim Bäcker“ told with this film's own English lines, beat for beat (its taps and sounds stay). */
function retold(scene: Scene, lines: Pick<Beat, "ask" | "say">[]): Scene {
  return { ...scene, beats: scene.beats.map((beat, i) => ({ ...beat, ask: lines[i]?.ask, say: lines[i]?.say })) };
}

const bake = retold(bakersOven, [
  { ask: "Open the oven!", say: "Into the oven!" },
  { say: "It is warm in the oven. Look, it turns brown!" },
  { say: "Ding! All done." },
  { ask: "Take it out of the oven!", say: "Mmm, that smells good!" },
]);

const breakfast = retold(bakersHome, [
  { say: "At home the table is already laid." },
  { ask: "Put it on the table!", say: "Made from our own grain!" },
  { ask: "Let's eat!", say: "Mmm, yummy!" },
  { say: "Everyone is full and happy." },
]);

/** „From grain to bread“: from the seed in the field through the harvest and the mill to the baker and breakfast. */
export const KORN: Film = {
  id: "korn",
  first: "en",
  title: "From grain to bread",
  end: "The farmer, the miller and the baker all helped. Thank you!",
  scenes: (picks) => (picks[0] ? [sow, grow, harvest, mill, shop, bake, breakfast] : [sow, grow, harvest, mill, shop]),
};
