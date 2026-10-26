import { useId, useMemo, useRef, type PointerEvent, type ReactNode } from "react";
import {
  playBaa,
  playBark,
  playGiggle,
  playHa,
  playHatschi,
  playLeaves,
  playMeow,
  playMoo,
  playOink,
  playQuack,
  playSniff,
  playSqueak,
  playTrumpet,
  playTweet,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { useAnyKey, useFrames, useLevelName, VIEW_H, VIEW_W, wobble, type LevelProps } from "./level";
import { deg, easeIn, easeInOut, easeOut, lerp } from "./machineKit";
import type { Pt } from "./path";
import { INK } from "./scenery";
import {
  type AnimalId,
  type AnimalKind,
  DONE_AFTER_LAUGH_S,
  FEATHER_S,
  FLOOR,
  haSeconds,
  LAUGH_AFTER_S,
  LAUGH_S,
  type Leaf,
  layOutRow,
  leavesOf,
  noseOf,
  pickAnimals,
  REACT_S,
  type Row,
  type Seat,
  sizeOf,
  TICKLE_S,
  targetOf,
  travelSeconds,
  type Tree,
} from "./sneeze";
import "./sneeze.css";

/** How fast the camera catches up, per second. */
const CAMERA_FOLLOW = 2.2;
/** For the elephant and the tree the camera steps back a little, so the cow laughing along is in the picture too. */
const END_ZOOM = 0.8;

/** What each animal says when the sneeze before it hits it, or when it is tapped while it is still waiting. */
const VOICE: Record<AnimalId, () => void> = {
  mouse: playSqueak,
  chick: playTweet,
  duck: playQuack,
  rabbit: playSniff,
  cat: playMeow,
  dog: playBark,
  pig: playOink,
  sheep: playBaa,
  cow: playMoo,
  elephant: playTrumpet,
};

/** Fur colours: the coat, the lighter belly or muzzle, and the inside of the ears. */
const FUR: Record<AnimalId, { coat: string; light: string; inner: string }> = {
  mouse: { coat: "#c3bccf", light: "#eee8f4", inner: "#ffc2d1" },
  chick: { coat: "#ffd23f", light: "#ffe58a", inner: "#ffbf1f" },
  duck: { coat: "#fffdf5", light: "#ffffff", inner: "#ece6d6" },
  rabbit: { coat: "#efe4d8", light: "#fffaf3", inner: "#ffc2d1" },
  cat: { coat: "#ffa552", light: "#fff1dc", inner: "#ffc2d1" },
  dog: { coat: "#c98b56", light: "#f3dcc0", inner: "#7a4a2b" },
  pig: { coat: "#ffb8c9", light: "#ffd3de", inner: "#ff8fab" },
  sheep: { coat: "#fffaf0", light: "#ffffff", inner: "#5b5470" },
  cow: { coat: "#fffdf5", light: "#ffd1dc", inner: "#ffc2d1" },
  elephant: { coat: "#a9b4c9", light: "#c4cddd", inner: "#ffc2d1" },
};

const MOUTH = "#8a3355";
const BEAK = "#ff8c42";
const FEATHERS = ["#ff8fab", "#8ecbff", "#c9a7ff", "#7fd6a8"];
const LEAF_COLORS = ["#4caf50", "#7cc94e", "#ffd23f", "#ff9f43"];

/** How far an animal is: each moment is in seconds since the tap, Infinity while it hasn't happened yet. */
interface Beast {
  /** Hit by the sneeze before it (or tickled by the feather). */
  hitT: number;
  /** Starts its „ha… ha…“. */
  haT: number;
  /** The second „ha…“ has sounded. */
  ha2: boolean;
  /** HATSCHI! */
  sneezeT: number;
  /** Its sneeze has reached the next animal (or the tree). */
  arriveT: number;
  /** The last tap that made it sniff, giggle or say hello, and which. */
  tapT: number;
  tapKind: "sniff" | "giggle" | "hello";
  /** Taps after its sneeze, so sniffing and giggling take turns. */
  taps: number;
}

/** How an animal looks at a moment. */
interface Pose {
  /** Leaning back for „ha…“, 0 to 1. */
  tilt: number;
  /** The head snapping forward with the sneeze, 0 to 1. */
  jerk: number;
  /** Head shaking, in degrees. */
  shake: number;
  /** Hopping up, in the animal's units. */
  hop: number;
  /** Fur standing up where the sneeze hit, 0 to 1. */
  ruffle: number;
  eyes: "open" | "wide" | "shut" | "happy";
  /** Eyes squeezing for the sneeze, 0 to 1. */
  squeeze: number;
  mouth: "smile" | "o" | "big" | "laugh";
  /** How far the „o“ is open, 0 to 1. */
  open: number;
  /** The nose twitching sideways. */
  wiggle: number;
  /** Red cheeks, 0 to 1. */
  blush: number;
  /** The elephant's trunk: 0 hangs down, 1 points up at the tree. */
  trunk: number;
}

/**
 * „Hatschi-Kette“ (R-09): animals sit on a meadow, small to big, with a tree
 * at the end. A tap lets a feather float down onto the mouse's nose: „ha…
 * ha… hatschi!“, and the sneeze blows over to the next animal, whose fur
 * ruffles until it has to sneeze too, a bit bigger and louder each time. The
 * camera walks along the row. The elephant's sneeze through its trunk blows
 * every leaf off the tree, the leaves whirl down onto everyone and all the
 * animals laugh. Joining in: a tap on an animal going „ha…“ makes it sneeze
 * at once, one that has sneezed sniffs or giggles, one still waiting says
 * hello; any other tap or key hurries the chain on by one step.
 */
export function SneezeLevel({ sound, say, onDone }: LevelProps) {
  const label = useLevelName("sneeze");
  const row = useMemo(() => layOutRow(pickAnimals()), []);
  const feather = useMemo(() => FEATHERS[Math.floor(Math.random() * FEATHERS.length)], []);
  const leaves = useMemo(() => leavesOf(row.tree), [row]);
  const travel = useMemo(() => row.seats.map((seat, i) => travelSeconds(noseOf(seat), targetOf(row, i))), [row]);
  const beasts = useRef<Beast[]>(
    row.seats.map(() => ({ hitT: Infinity, haT: Infinity, ha2: false, sneezeT: Infinity, arriveT: Infinity, tapT: -Infinity, tapKind: "hello", taps: 0 })),
  );
  /** Seconds since the tap; below 0 until then. */
  const clock = useRef(-1);
  /** When the elephant's sneeze reached the tree. */
  const leavesT = useRef(Infinity);
  /** One-off sounds of the ending that have played, and whether the level is done. */
  const fired = useRef(new Set<string>());
  const camera = useRef({ x: 0, z: 1 });
  const ids = useId();
  const last = row.seats.length - 1;

  const sizeAt = (i: number) => sizeOf(row.seats[i].kind);
  const reactOf = (i: number) => (i === 0 ? TICKLE_S : REACT_S);

  const hit = (i: number) => {
    beasts.current[i].hitT = clock.current;
    sound(VOICE[row.seats[i].kind.id]);
  };
  const startHa = (i: number) => {
    beasts.current[i].haT = clock.current;
    sound(() => playHa(sizeAt(i)));
  };
  const sneeze = (i: number) => {
    const b = beasts.current[i];
    b.sneezeT = clock.current;
    b.haT = Math.min(b.haT, clock.current);
    sound(() => playHatschi(sizeAt(i)));
    if (i === last) say({ de: "Hatschi!", ru: "Апчхи!" });
  };
  const arrive = (i: number) => {
    beasts.current[i].arriveT = clock.current;
    if (i < last) hit(i + 1);
    else {
      leavesT.current = clock.current;
      sound(playLeaves);
      sound(playWhoosh);
    }
  };
  const once = (key: string, play: () => void) => {
    if (fired.current.has(key)) return;
    fired.current.add(key);
    play();
  };

  useFrames((dt) => {
    if (clock.current >= 0) {
      clock.current += dt;
      const t = clock.current;
      const all = beasts.current;
      if (all[0].hitT === Infinity && t >= FEATHER_S) hit(0);
      all.forEach((b, i) => {
        const ha = haSeconds(row.seats[i].kind);
        if (b.haT === Infinity && b.sneezeT === Infinity && t >= b.hitT + reactOf(i)) startHa(i);
        if (!b.ha2 && b.sneezeT === Infinity && t >= b.haT + ha * 0.5) {
          b.ha2 = true;
          sound(() => playHa(Math.min(1, sizeAt(i) + 0.08)));
        }
        if (b.sneezeT === Infinity && t >= b.haT + ha) sneeze(i);
        if (b.arriveT === Infinity && t >= b.sneezeT + travel[i]) arrive(i);
      });
      const laughT = leavesT.current + LAUGH_AFTER_S;
      if (t >= laughT) {
        once("laugh", () => {
          sound(playGiggle);
          sound(playTrumpet);
        });
        if (t >= laughT + 0.7) once("laugh2", () => sound(playGiggle));
        if (t >= laughT + DONE_AFTER_LAUGH_S) once("done", onDone);
      }
    }
    // The camera looks between the animal whose turn it is and the next one; from the elephant on, at the end of the row.
    const cur = currentOf(beasts.current);
    const atEnd = cur === last && beasts.current[last].hitT < Infinity;
    const z = atEnd ? END_ZOOM : 1;
    const viewW = VIEW_W / z;
    const next = cur < last ? row.seats[cur + 1].x : row.tree.x;
    const x = atEnd ? row.worldW - viewW : Math.min(row.worldW - viewW, Math.max(0, (row.seats[cur].x + next) / 2 - viewW * 0.42));
    const follow = 1 - Math.exp(-dt * CAMERA_FOLLOW);
    camera.current.x += (x - camera.current.x) * follow;
    camera.current.z += (z - camera.current.z) * follow;
  });

  /** A tap that isn't on an animal, or a key: the chain goes on by one step at once. */
  const hurry = () => {
    const all = beasts.current;
    if (all[0].hitT === Infinity) {
      hit(0);
      return;
    }
    const cur = currentOf(all);
    const b = all[cur];
    if (b.arriveT < Infinity) giggleOrSniff(cur, "giggle");
    else if (b.sneezeT < Infinity) arrive(cur);
    else if (b.haT < Infinity) sneeze(cur);
    else startHa(cur);
  };

  const giggleOrSniff = (i: number, kind?: "sniff" | "giggle") => {
    const b = beasts.current[i];
    b.tapKind = kind ?? (b.taps++ % 2 ? "giggle" : "sniff");
    b.tapT = clock.current;
    sound(b.tapKind === "giggle" ? playGiggle : playSniff);
  };

  const tapAnimal = (i: number) => {
    const b = beasts.current[i];
    if (b.sneezeT < Infinity) giggleOrSniff(i);
    else if (b.hitT < Infinity) sneeze(i);
    else {
      b.tapKind = "hello";
      b.tapT = clock.current;
      sound(VOICE[row.seats[i].kind.id]);
    }
  };

  const start = () => {
    clock.current = 0;
    sound(playTwinkle);
  };

  useAnyKey(() => (clock.current < 0 ? start() : hurry()));

  const onPointerDown = (e: PointerEvent) => {
    if (clock.current < 0) {
      start();
      return;
    }
    const animal = (e.target as Element).closest("[data-animal]");
    if (animal) tapAnimal(Number(animal.getAttribute("data-animal")));
    else hurry();
  };

  const t = clock.current;
  const laughT = leavesT.current + LAUGH_AFTER_S;
  const { x: camX, z: camZ } = camera.current;
  const meadow = useMemo(() => <Meadow worldW={row.worldW} gradient={`${ids}-sky`} />, [row, ids]);

  return (
    <div className="marble-level" onPointerDown={onPointerDown}>
      <svg className="marble-svg" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid meet" aria-label={label}>
        {/* Zooming out keeps the meadow's ground line in the same place on the screen. */}
        <g transform={`translate(0 ${VIEW_H * (1 - camZ)}) scale(${camZ}) translate(${-camX} 0)`}>
          {meadow}
          <TreeDrawing tree={row.tree} age={t - leavesT.current} />
          {row.seats.map((seat, i) => (
            <Animal key={i} index={i} seat={seat} pose={poseAt(beasts.current[i], seat.kind, t, laughT + i * 0.07)} />
          ))}
          {row.seats.map((seat, i) => (
            <Puff key={i} row={row} i={i} b={beasts.current[i]} t={t} travel={travel[i]} size={sizeOf(seat.kind)} />
          ))}
          <Feather seat={row.seats[0]} b={beasts.current[0]} t={t} color={feather} />
          <FallingLeaves leaves={leaves} age={t - leavesT.current} />
        </g>
      </svg>
    </div>
  );
}

/** The animal whose turn it is: the last one that has been hit (the mouse before that). */
function currentOf(all: Beast[]) {
  let cur = 0;
  all.forEach((b, i) => {
    if (b.hitT < Infinity) cur = i;
  });
  return cur;
}

/** How animal `b` looks `t` seconds after the tap; `laughT` is when it starts laughing at the end. */
function poseAt(b: Beast, kind: AnimalKind, t: number, laughT: number): Pose {
  const pose: Pose = { tilt: 0, jerk: 0, shake: 0, hop: 0, ruffle: 0, eyes: "open", squeeze: 0, mouth: "smile", open: 0, wiggle: 0, blush: 0, trunk: 0 };
  const sinceHit = t - b.hitT;
  if (sinceHit >= 0) {
    pose.ruffle = Math.exp(-sinceHit * 2.2) * (sinceHit < 2.5 ? 1 : 0);
    pose.shake = wobble(sinceHit, 7, 30, 4);
    if (t < b.haT) {
      pose.eyes = "wide";
      pose.mouth = "o";
      pose.open = 0.2;
      pose.wiggle = 1.5 * Math.sin(sinceHit * 40);
    }
  }
  if (t >= b.haT && t < b.sneezeT) {
    // „Ha…“ – lean back a bit; „ha…“ – lean back more, the eyes squeeze, the nose twitches.
    const k = (t - b.haT) / haSeconds(kind);
    const lean = k < 0.5 ? 0.6 * easeOut(Math.min(1, k / 0.4)) : 0.6 + 0.4 * easeOut(Math.min(1, (k - 0.5) / 0.4));
    pose.tilt = lean * (1 + 0.04 * Math.sin(t * 50));
    pose.squeeze = lean * 0.85;
    pose.mouth = "o";
    pose.open = lean;
    pose.wiggle = 2 * lean * Math.sin(t * 42);
    pose.blush = lean;
    pose.trunk = lean;
  }
  const sinceSneeze = t - b.sneezeT;
  if (sinceSneeze >= 0) {
    // HATSCHI! The head snaps forward and slowly comes back.
    pose.jerk = sinceSneeze < 0.07 ? sinceSneeze / 0.07 : Math.exp(-(sinceSneeze - 0.07) * 4);
    pose.eyes = sinceSneeze < 0.45 ? "shut" : "open";
    pose.mouth = sinceSneeze < 0.3 ? "big" : "smile";
    pose.blush = Math.max(0, 1 - sinceSneeze);
    pose.trunk = sinceSneeze < 0.8 ? 1 : Math.max(0.15, 1 - (sinceSneeze - 0.8) * 0.9);
  }
  const sinceTap = t - b.tapT;
  if (sinceTap >= 0 && sinceTap < 0.8) {
    const fade = 1 - sinceTap / 0.8;
    if (b.tapKind === "sniff") {
      pose.wiggle = 3 * Math.sin(sinceTap * 45) * fade;
      pose.tilt = Math.max(pose.tilt, 0.25 * Math.sin(Math.min(1, sinceTap * 2.5) * Math.PI));
      pose.trunk = Math.max(pose.trunk, 0.35 + 0.1 * Math.sin(sinceTap * 30));
    } else {
      pose.hop = Math.abs(Math.sin((sinceTap * Math.PI) / 0.32)) * 9 * fade;
      if (b.tapKind === "giggle") {
        pose.eyes = "happy";
        pose.mouth = "laugh";
      } else if (b.tapKind === "hello") pose.eyes = "wide";
    }
  }
  const sinceLaugh = t - laughT;
  if (sinceLaugh >= 0) {
    // Everyone laughs at the leaves, then sits there happily.
    const laughing = sinceLaugh < LAUGH_S;
    pose.eyes = laughing ? "happy" : pose.eyes;
    pose.mouth = laughing ? "laugh" : "smile";
    pose.hop = laughing ? Math.abs(Math.sin(sinceLaugh * 9)) * 7 * (1 - sinceLaugh / LAUGH_S) : pose.hop;
    pose.trunk = laughing ? 0.55 + 0.2 * Math.sin(sinceLaugh * 6) * (1 - sinceLaugh / LAUGH_S) : 0.15;
  }
  return pose;
}

/* ---------- The meadow ---------- */

/** Sky, far hills, clouds, the sun and the grass the animals sit on. Drawn once; it never moves. */
function Meadow({ worldW, gradient }: { worldW: number; gradient: string }) {
  const w = worldW + 1200;
  return (
    <g>
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd5ff" />
          <stop offset="1" stopColor="#e6f7ff" />
        </linearGradient>
      </defs>
      <rect x="-600" y="-500" width={w} height={FLOOR + 400} fill={`url(#${gradient})`} />
      <g transform="translate(170 110)">
        <circle r="62" fill="#ffd23f" stroke="#ffb703" strokeWidth="6" />
      </g>
      {Array.from({ length: Math.ceil(worldW / 800) }, (_, i) => (
        <path
          key={i}
          transform={`translate(${520 + i * 800 + (i % 3) * 90} ${90 + (i % 2) * 80}) scale(${0.8 + (i % 3) * 0.2})`}
          d="M-90 30 Q-110 0 -70 -6 Q-60 -44 -16 -34 Q10 -66 50 -36 Q96 -40 92 0 Q120 20 90 30 Z"
          fill="#fff"
          stroke="#d6ecfa"
          strokeWidth="4"
        />
      ))}
      <path
        d={`M-600 ${FLOOR - 150} ${Array.from({ length: Math.ceil(w / 500) }, (_, i) => `Q${-350 + i * 500} ${FLOOR - 260 - (i % 2) * 60} ${-100 + i * 500} ${FLOOR - 150}`).join(" ")} L${w} ${FLOOR + 400} L-600 ${FLOOR + 400} Z`}
        fill="#a8df7a"
      />
      <rect x="-600" y={FLOOR - 90} width={w} height="700" fill="#7fd34e" />
      <path d={`M-600 ${FLOOR - 90} L${w} ${FLOOR - 90}`} stroke="#5fba38" strokeWidth="5" />
      {Array.from({ length: Math.ceil(w / 120) }, (_, i) => {
        const x = -560 + i * 120 + (i % 4) * 23;
        const y = FLOOR - 50 + (i % 3) * 60;
        return <path key={i} d={`M${x} ${y} q5 -18 10 0 q4 -14 9 0 q5 -16 10 0`} fill="none" stroke="#56b232" strokeWidth="4" strokeLinecap="round" />;
      })}
      {Array.from({ length: Math.ceil(w / 260) }, (_, i) => {
        const x = -480 + i * 260 + (i % 3) * 70;
        const y = FLOOR + 30 + (i % 2) * 45;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={9 * Math.cos((a * Math.PI) / 180)} cy={9 * Math.sin((a * Math.PI) / 180)} r="7" fill={i % 2 ? "#fff" : "#ffd6e0"} />
            ))}
            <circle r="5" fill="#ffd23f" />
          </g>
        );
      })}
    </g>
  );
}

/** The big tree at the end of the row; `age` seconds after the elephant's sneeze reached it, it shakes and its crown is gone. */
function TreeDrawing({ tree, age }: { tree: Tree; age: number }) {
  const { x, crown, r } = tree;
  const shake = age >= 0 ? wobble(age, 4, 14, 2.2) : 0;
  const leafy = age < 0 ? 1 : Math.max(0, 1 - age / 0.25);
  const bark = "#a0673a";
  return (
    <g transform={`rotate(${shake} ${x} ${FLOOR})`}>
      <path
        d={`M${x - 70} ${FLOOR + 6} Q${x - 38} ${FLOOR - 40} ${x - 40} ${FLOOR - 140} L${x - 30} ${crown.y + 40} L${x + 30} ${crown.y + 40} L${x + 40} ${FLOOR - 140} Q${x + 38} ${FLOOR - 40} ${x + 70} ${FLOOR + 6} Z`}
        fill={bark}
        stroke={INK}
        strokeWidth="5"
      />
      {/* Bare branches, seen once the leaves have flown */}
      {[
        [x - 10, crown.y + 80, x - 150, crown.y - 40],
        [x + 10, crown.y + 60, x + 150, crown.y - 60],
        [x, crown.y + 50, x - 20, crown.y - 150],
        [x - 90, crown.y + 5, x - 170, crown.y + 40],
        [x + 90, crown.y - 15, x + 190, crown.y + 10],
      ].map(([x1, y1, x2, y2], i) => (
        <g key={i}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={i < 3 ? 25 : 15} strokeLinecap="round" />
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={bark} strokeWidth={i < 3 ? 17 : 8} strokeLinecap="round" />
        </g>
      ))}
      {leafy > 0 && (
        <g opacity={leafy}>
          {[
            [0, 20, r * 0.8],
            [-r * 0.55, 60, r * 0.5],
            [r * 0.55, 55, r * 0.52],
            [-r * 0.35, -r * 0.45, r * 0.55],
            [r * 0.4, -r * 0.4, r * 0.55],
            [0, -r * 0.7, r * 0.45],
          ].map(([dx, dy, rr], i) => (
            <circle key={i} cx={crown.x + dx} cy={crown.y + dy} r={rr} fill="#4caf50" stroke={INK} strokeWidth="5" />
          ))}
          <circle cx={crown.x} cy={crown.y} r={r * 0.82} fill="#4caf50" />
          <circle cx={crown.x + 50} cy={crown.y - 60} r={r * 0.35} fill="#6cc95a" />
          <circle cx={crown.x - 80} cy={crown.y + 40} r={r * 0.25} fill="#6cc95a" />
        </g>
      )}
    </g>
  );
}

/** The leaves blown off the tree, `age` seconds after: up in a whirl, then see-sawing down until they lie still in the grass. */
function FallingLeaves({ leaves, age }: { leaves: Leaf[]; age: number }) {
  if (age < 0) return null;
  return (
    <g>
      {leaves.map((leaf, i) => {
        const u = Math.min(1, age / leaf.fall);
        const x = lerp(leaf.from.x, leaf.to.x, easeInOut(u)) + leaf.swing * Math.sin(age * 4 + leaf.phase) * (1 - u);
        const y = lerp(leaf.from.y, leaf.to.y, easeIn(u)) - leaf.lift * 4 * u * (1 - u);
        const turn = deg(leaf.spin * age * (1 - u)) + deg(leaf.phase);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${turn})`}>
            <path d="M-20 0 Q0 -14 20 0 Q0 14 -20 0 Z" fill={LEAF_COLORS[leaf.color]} stroke={INK} strokeWidth="3" />
            <line x1="-16" y1="0" x2="16" y2="0" stroke={INK} strokeWidth="2" opacity="0.5" />
          </g>
        );
      })}
    </g>
  );
}

/* ---------- The feather and the sneezes ---------- */

/** The feather: still in the air before the tap, then floating down onto the mouse's nose, tickling it, and dropping to the grass. */
function Feather({ seat, b, t, color }: { seat: Seat; b: Beast; t: number; color: string }) {
  const start = { x: seat.x + 110, y: FLOOR - 330 };
  const nose = noseOf(seat);
  const onNose = { x: nose.x + 14, y: nose.y - 8 };
  let at: Pt;
  let turn: number;
  if (t < 0 || b.hitT === Infinity) {
    const k = Math.max(0, t) / FEATHER_S;
    const swing = Math.sin(k * 3 * Math.PI) * 70 * (1 - k);
    at = { x: lerp(start.x, onNose.x, easeInOut(k)) + swing, y: lerp(start.y, onNose.y, easeInOut(k)) };
    turn = 30 + 35 * Math.sin(k * 3 * Math.PI);
  } else if (t < b.haT) {
    const tickle = Math.sin((t - b.hitT) * 30);
    at = { x: onNose.x + 6 * tickle, y: onNose.y - 2 * Math.abs(tickle) };
    turn = -15 + 18 * tickle;
  } else {
    const k = Math.min(1, (t - b.haT) / 1.1);
    at = { x: lerp(onNose.x, seat.x + 90, k) + 20 * Math.sin(k * 2 * Math.PI) * (1 - k), y: lerp(onNose.y, FLOOR + 18, easeIn(k)) };
    turn = lerp(-15, 75, k);
  }
  return (
    <g>
      <g transform={`translate(${at.x} ${at.y}) rotate(${turn}) scale(1.1)`}>
        <path d="M0 0 Q14 -26 6 -70 Q-16 -40 0 0 Z" fill={color} stroke={INK} strokeWidth="3" />
        <path d="M0 0 Q4 -34 6 -66" fill="none" stroke={INK} strokeWidth="2.5" />
        <path d="M2 -20 l-8 -6 M4 -36 l-9 -8 M4 -30 l8 -8 M3 -48 l7 -9" stroke={INK} strokeWidth="2" opacity="0.5" />
      </g>
      {/* A still finger: tap here. It stays put, so nothing moves before the child does something. */}
      {t < 0 && (
        <text className="sneeze-hint" x={start.x + 90} y={start.y + 120} fontSize="90" textAnchor="middle">
          👆
        </text>
      )}
    </g>
  );
}

/**
 * The sneeze of animal `i`: a little cloud with whoosh lines and a few
 * glittering droplets that flies to the next animal (or to the tree), growing
 * with the animal, and melts away when it gets there.
 */
function Puff({ row, i, b, t, travel, size }: { row: Row; i: number; b: Beast; t: number; travel: number; size: number }) {
  const age = t - b.sneezeT;
  if (age < 0) return null;
  const fade = b.arriveT < Infinity ? 1 - (t - b.arriveT) / 0.5 : 1;
  if (fade <= 0) return null;
  const from = noseOf(row.seats[i]);
  const to = targetOf(row, i);
  const k = b.arriveT < Infinity ? 1 : Math.min(1, age / travel);
  const e = easeOut(k);
  const r = (30 + 80 * size + (i === row.seats.length - 1 ? 50 : 0)) * (0.45 + 0.55 * e) * (b.arriveT < Infinity ? 1 + 0.6 * (1 - fade) : 1);
  const at = { x: lerp(from.x, to.x, e), y: lerp(from.y, to.y, e) - 40 * size * Math.sin(Math.PI * k) };
  const a = Math.atan2(to.y - from.y, to.x - from.x);
  const back = { x: -Math.cos(a), y: -Math.sin(a) };
  const side = { x: -back.y, y: back.x };
  const streak = (off: number, len: number) => {
    const p = { x: at.x + back.x * r * 0.8 + side.x * off * r, y: at.y + back.y * r * 0.8 + side.y * off * r };
    const q = { x: p.x + back.x * len * r, y: p.y + back.y * len * r };
    return `M${p.x} ${p.y} Q${(p.x + q.x) / 2 + side.x * off * r * 0.3} ${(p.y + q.y) / 2 + side.y * off * r * 0.3} ${q.x} ${q.y}`;
  };
  return (
    <g opacity={fade}>
      {[-0.5, 0, 0.5].map((off) => (
        <path
          key={off}
          d={streak(off, off ? 1.1 : 1.6)}
          fill="none"
          stroke="#9fd3f5"
          strokeWidth={3 + 5 * size}
          strokeLinecap="round"
          opacity={0.85 * (1 - k * 0.5)}
        />
      ))}
      <g transform={`translate(${at.x} ${at.y}) scale(${r / 40})`}>
        {[
          [-18, 6, 20],
          [0, -10, 24],
          [20, 4, 20],
          [2, 12, 18],
        ].map(([cx, cy, cr], j) => (
          <circle key={j} cx={cx} cy={cy} r={cr} fill="#fff" stroke="#bfe0f5" strokeWidth={4} />
        ))}
        <circle cx="0" cy="2" r="22" fill="#fff" />
        {[0, 1, 2, 3, 4].map((j) => {
          const ang = j * 1.3 + age * 3;
          const d = 46 + 10 * Math.sin(age * 8 + j);
          return (
            <path
              key={j}
              transform={`translate(${d * Math.cos(ang)} ${d * Math.sin(ang) * 0.7}) scale(${0.5 + 0.3 * Math.sin(age * 10 + j)})`}
              d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z"
              fill="#bfe8ff"
              stroke="#6fb8e6"
              strokeWidth="1.5"
            />
          );
        })}
      </g>
    </g>
  );
}

/* ---------- The animals ---------- */

/**
 * One animal sitting in the row, facing us, drawn in its own units (100 high,
 * standing on y 0) and scaled to its size. Strokes are set on the group in
 * the animal's units, so every animal gets the same line width in the picture.
 */
function Animal({ index, seat, pose }: { index: number; seat: Seat; pose: Pose }) {
  const { kind, x, s } = seat;
  const lw = 3.6 / s;
  const H = -kind.head.y;
  const r = kind.head.r;
  // The head turns about the chin: back for „ha…“, forward and towards the next animal for „hatschi!“.
  const headTurn = -8 * pose.tilt + 14 * pose.jerk + pose.shake;
  const head = `translate(${5 * pose.jerk} ${-5 * pose.tilt + 3 * pose.jerk}) rotate(${headTurn} 0 ${H + r * 0.9})`;
  const half = Math.max(kind.width / 2, 55 / s);
  const tall = Math.max(104, 120 / s);
  return (
    <g transform={`translate(${x} ${FLOOR}) scale(${s})`} data-animal={index} stroke={INK} strokeWidth={lw} strokeLinejoin="round" strokeLinecap="round">
      {/* A bigger target than the drawing, so small fingers find the small animals. */}
      <rect x={-half} y={-tall} width={2 * half} height={tall + 6} fill="transparent" stroke="none" />
      <g transform={`translate(0 ${-pose.hop})`}>
        <Body kind={kind} lw={lw} pose={pose} />
        <g transform={head}>
          <Head kind={kind} lw={lw} pose={pose} />
          <Tufts kind={kind} lw={lw} ruffle={pose.ruffle} />
        </g>
      </g>
    </g>
  );
}

/** Body, feet, tail and whatever an animal has on it (wings, wool, spots). */
function Body({ kind, lw, pose }: { kind: AnimalKind; lw: number; pose: Pose }) {
  const { rx, ry } = kind.body;
  const fur = FUR[kind.id];
  const id = kind.id;
  const bird = id === "chick" || id === "duck";
  const fluff = 1 + 0.06 * pose.ruffle;
  const parts: ReactNode[] = [];
  // Behind the body: tails.
  if (id === "mouse") parts.push(<Tail key="tail" d="M18 -6 Q44 -2 42 -22 Q40 -38 28 -40" lw={lw} color={fur.inner} w={1.4} />);
  if (id === "cat") parts.push(<Tail key="tail" d="M20 -8 Q46 -10 42 -38 Q40 -54 30 -52" lw={lw} color={fur.coat} w={3} />);
  if (id === "dog") parts.push(<Tail key="tail" d={`M22 -14 Q34 -18 ${36 + 2 * Math.sin(pose.hop)} -32`} lw={lw} color={fur.coat} w={2.6} />);
  if (id === "pig") parts.push(<Tail key="tail" d="M28 -12 q10 -2 9 -10 q-1 -6 -6 -3 q-3 3 2 6 q6 2 9 -4" lw={lw} color={fur.inner} w={1.2} />);
  if (id === "cow") parts.push(<Tail key="tail" d="M22 -8 Q40 -6 38 -30" lw={lw} color={fur.coat} w={1.4} />);
  if (id === "elephant") parts.push(<Tail key="tail" d="M28 -8 Q44 -6 44 -22" lw={lw} color={fur.coat} w={1.4} />);
  parts.push(
    <g key="body" transform={`translate(0 ${-ry}) scale(${fluff} ${1 / fluff}) translate(0 ${ry})`}>
      {id === "sheep" ? (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * 2 * Math.PI;
            return <circle key={i} cx={rx * 0.86 * Math.cos(a)} cy={-ry + ry * 0.86 * Math.sin(a)} r="11" fill={fur.coat} />;
          })}
          <ellipse cx="0" cy={-ry} rx={rx * 0.9} ry={ry * 0.9} fill={fur.coat} stroke="none" />
        </g>
      ) : (
        <ellipse cx="0" cy={-ry} rx={rx} ry={ry} fill={fur.coat} />
      )}
      {!bird && id !== "sheep" && id !== "cow" && <ellipse cx="0" cy={-ry * 0.85} rx={rx * 0.58} ry={ry * 0.68} fill={fur.light} stroke="none" />}
      {id === "cow" && (
        <g fill="#3a3350" stroke="none">
          <path d="M-26 -40 q8 -12 18 -4 q6 10 -6 14 q-10 2 -12 -10 Z" />
          <path d="M14 -22 q10 -8 14 4 q2 12 -10 10 q-8 -2 -4 -14 Z" />
        </g>
      )}
      {bird && (
        <g fill={id === "duck" ? "#f3eee0" : fur.inner}>
          <ellipse cx={-rx + 2} cy={-ry - 2} rx="9" ry="16" transform={`rotate(${20 + 10 * pose.ruffle} ${-rx + 2} ${-ry - 2})`} />
          <ellipse cx={rx - 2} cy={-ry - 2} rx="9" ry="16" transform={`rotate(${-20 - 10 * pose.ruffle} ${rx - 2} ${-ry - 2})`} />
        </g>
      )}
    </g>,
  );
  // Feet: orange toes for the birds, round feet for the others, the elephant's with toenails.
  if (bird) {
    parts.push(
      <g key="feet" fill={BEAK}>
        {[-11, 11].map((fx) => (
          <path key={fx} d={`M${fx - 8} 0 L${fx} -6 L${fx + 8} 0 Z`} />
        ))}
      </g>,
    );
  } else {
    const fw = id === "elephant" ? 13 : 9;
    parts.push(
      <g key="feet">
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse
              cx={side * rx * 0.45}
              cy={-fw * 0.45}
              rx={fw}
              ry={fw * 0.55}
              fill={id === "sheep" ? FUR.sheep.inner : id === "pig" ? fur.inner : fur.coat}
            />
            {id === "elephant" && [-6, 0, 6].map((n) => <circle key={n} cx={side * rx * 0.45 + n} cy={-3} r="2.4" fill="#fffaf0" strokeWidth={lw * 0.5} />)}
          </g>
        ))}
      </g>,
    );
  }
  if (id === "cow") parts.push(<circle key="bell" cx="0" cy={-kind.head.y + kind.head.r + 5} r="6" fill="#ffd23f" />);
  return <g>{parts}</g>;
}

/** A tail: an inked stroke with a coloured one on top, `w` times as thick as a line. */
function Tail({ d, lw, color, w }: { d: string; lw: number; color: string; w: number }) {
  return (
    <g fill="none">
      <path d={d} strokeWidth={lw * (w + 2)} />
      <path d={d} stroke={color} strokeWidth={lw * w} />
    </g>
  );
}

/** Little tufts of fur standing up round the head where the sneeze hit it. */
function Tufts({ kind, lw, ruffle }: { kind: AnimalKind; lw: number; ruffle: number }) {
  if (ruffle < 0.05) return null;
  const H = -kind.head.y;
  const r = kind.head.r + (kind.id === "sheep" ? 4 : 0);
  return (
    <g opacity={Math.min(1, ruffle * 1.5)} fill={FUR[kind.id].coat} strokeWidth={lw * 0.8}>
      {[150, 175, 200, 225, 250, 275].map((a) => {
        const at = (da: number, d: number) => {
          const rad = ((a + da) * Math.PI) / 180;
          return `${d * Math.cos(rad)} ${H + d * Math.sin(rad)}`;
        };
        return <path key={a} d={`M${at(-7, r - 2)} L${at(0, r + 4 + 7 * ruffle)} L${at(7, r - 2)}`} />;
      })}
    </g>
  );
}

/** The head: ears, the head itself, and the face of each kind of animal. */
function Head({ kind, lw, pose }: { kind: AnimalKind; lw: number; pose: Pose }) {
  const id = kind.id;
  const fur = FUR[id];
  const H = -kind.head.y;
  const r = kind.head.r;
  // Looking up for „ha…“ moves the face up a little.
  const lift = -3 * pose.tilt + 2 * pose.jerk;
  const eyeY = H - 0.15 * r + lift;
  const noseY = H + 0.18 * r + lift;
  const mouthY = H + 0.5 * r + lift;
  const nose = `translate(${pose.wiggle} 0)`;
  const bird = id === "chick" || id === "duck";
  const flap = 1 + 0.12 * pose.ruffle * Math.sin(pose.shake);

  return (
    <g>
      {/* Behind the head */}
      {id === "mouse" &&
        [-1, 1].map((side) => (
          <g key={side}>
            <circle cx={side * 20} cy={H - 17} r="13" fill={fur.coat} />
            <circle cx={side * 20} cy={H - 17} r="8" fill={fur.inner} stroke="none" />
          </g>
        ))}
      {id === "rabbit" &&
        [-1, 1].map((side) => (
          <g key={side} transform={`rotate(${side * (8 + 6 * pose.ruffle)} ${side * 9} ${H - r + 4})`}>
            <ellipse cx={side * 9} cy={H - r - 8} rx="7" ry="17" fill={fur.coat} />
            <ellipse cx={side * 9} cy={H - r - 7} rx="3.5" ry="12" fill={fur.inner} stroke="none" />
          </g>
        ))}
      {id === "cat" &&
        [-1, 1].map((side) => (
          <g key={side}>
            <path d={`M${side * 6} ${H - r + 3} L${side * 21} ${H - r - 10} L${side * 25} ${H - 6} Z`} fill={fur.coat} />
            <path d={`M${side * 10} ${H - r + 6} L${side * 19} ${H - r - 3} L${side * 21} ${H - 9} Z`} fill={fur.inner} stroke="none" />
          </g>
        ))}
      {id === "pig" &&
        [-1, 1].map((side) => <path key={side} d={`M${side * 8} ${H - r + 5} L${side * 24} ${H - r - 6} L${side * 25} ${H - r + 14} Z`} fill={fur.inner} />)}
      {id === "cow" &&
        [-1, 1].map((side) => (
          <g key={side}>
            <path
              d={`M${side * 10} ${H - r + 5} Q${side * 14} ${H - r - 8} ${side * 20} ${H - r - 10} Q${side * 20} ${H - r} ${side * 16} ${H - r + 7} Z`}
              fill="#fff1c4"
            />
            <ellipse cx={side * 31} cy={H - 5} rx="11" ry="6" fill={fur.coat} transform={`rotate(${side * 20} ${side * 31} ${H - 5})`} />
            <ellipse cx={side * 32} cy={H - 5} rx="6" ry="3" fill={fur.inner} stroke="none" transform={`rotate(${side * 20} ${side * 32} ${H - 5})`} />
          </g>
        ))}
      {id === "sheep" &&
        [-1, 1].map((side) => (
          <ellipse key={side} cx={side * 24} cy={H - 4} rx="10" ry="5" fill={fur.inner} transform={`rotate(${side * 18} ${side * 24} ${H - 4})`} />
        ))}
      {id === "elephant" &&
        [-1, 1].map((side) => (
          <g key={side} transform={`translate(${side * 36} ${H + 2}) scale(${flap} 1)`}>
            <ellipse rx="23" ry="29" fill={fur.coat} />
            <ellipse cx={side * 3} rx="14" ry="20" fill={fur.inner} stroke="none" />
          </g>
        ))}

      {/* The head */}
      {id === "sheep" ? (
        <g>
          <ellipse cx="0" cy={H + 2} rx="17" ry="22" fill={fur.inner} />
          {[-9, 0, 9].map((dx) => (
            <circle key={dx} cx={dx} cy={H - 19 + Math.abs(dx) * 0.3} r="8" fill={fur.coat} />
          ))}
        </g>
      ) : (
        <circle cx="0" cy={H} r={r} fill={fur.coat} />
      )}
      {id === "duck" && <path d={`M-2 ${H - r} q-2 -10 6 -12 q-6 6 0 10`} fill={fur.coat} />}
      {id === "chick" && <path d={`M-6 ${H - r + 1} q-2 -11 4 -12 M0 ${H - r} q2 -12 10 -9`} fill="none" stroke={BEAK} strokeWidth={lw * 1.2} />}
      {id === "cat" && <path d={`M-6 ${H - r + 5} l0 7 M0 ${H - r + 3} l0 8 M6 ${H - r + 5} l0 7`} stroke="#e07a2e" strokeWidth={lw * 1.1} />}
      {id === "cow" && <path d={`M4 ${H - r + 2} q12 -2 14 10 q-2 8 -12 4 q-6 -6 -2 -14 Z`} fill="#3a3350" stroke="none" />}
      {id === "dog" && <ellipse cx={-9} cy={eyeY} rx="8" ry="8" fill="#a86b3c" stroke="none" />}

      {/* The face */}
      <Cheeks y={mouthY - 4} x={0.5 * r} blush={pose.blush} />
      <Eyes x={0.38 * r} y={eyeY} r={id === "elephant" ? 4 : 4.2} pose={pose} light={id === "sheep"} />
      {(id === "mouse" || id === "rabbit" || id === "cat") && (
        <g transform={nose}>
          <path d={`M-4 ${noseY - 2} L4 ${noseY - 2} L0 ${noseY + 3} Z`} fill={id === "mouse" ? "#ff8fab" : "#ff9fb8"} />
          <path d={`M-6 ${noseY + 2} l-16 -4 M-6 ${noseY + 4} l-16 3 M6 ${noseY + 2} l16 -4 M6 ${noseY + 4} l16 3`} strokeWidth={lw * 0.5} opacity="0.7" />
        </g>
      )}
      {id === "rabbit" && pose.mouth !== "laugh" && <rect x="-3" y={mouthY + 1} width="6" height="5" rx="1" fill="#fff" strokeWidth={lw * 0.6} />}
      {id === "dog" && (
        <g>
          <ellipse cx="0" cy={noseY + 4} rx="13" ry="10" fill={fur.light} />
          <ellipse cx="0" cy={noseY} rx="6" ry="4.5" fill={INK} transform={nose} />
        </g>
      )}
      {id === "pig" && (
        <g transform={nose}>
          <ellipse cx="0" cy={noseY + 1} rx="11" ry="8" fill={fur.inner} />
          <ellipse cx="-4" cy={noseY + 1} rx="2" ry="3" fill={MOUTH} stroke="none" />
          <ellipse cx="4" cy={noseY + 1} rx="2" ry="3" fill={MOUTH} stroke="none" />
        </g>
      )}
      {id === "cow" && (
        <g transform={nose}>
          <ellipse cx="0" cy={noseY + 6} rx="16" ry="10" fill={fur.light} />
          <ellipse cx="-6" cy={noseY + 5} rx="2.2" ry="3" fill={MOUTH} stroke="none" />
          <ellipse cx="6" cy={noseY + 5} rx="2.2" ry="3" fill={MOUTH} stroke="none" />
        </g>
      )}
      {id === "sheep" && <ellipse cx="0" cy={noseY + 2} rx="4" ry="2.5" fill="#ff9fb8" stroke="none" transform={nose} />}
      {bird ? (
        <Beak duck={id === "duck"} y={noseY} pose={pose} nose={nose} />
      ) : id === "elephant" ? (
        <>
          <Mouth y={mouthY + 6} pose={pose} light={false} />
          <Trunk y={noseY} lift={pose.trunk} wiggle={pose.wiggle} lw={lw} color={fur.coat} />
        </>
      ) : (
        <Mouth y={id === "cow" ? mouthY + 8 : id === "dog" ? mouthY + 4 : mouthY} pose={pose} light={id === "sheep"} />
      )}
    </g>
  );
}

/** Two eyes, open, wide with surprise, squeezed for the sneeze, shut tight („> <“) or laughing („^ ^“). */
function Eyes({ x, y, r, pose, light }: { x: number; y: number; r: number; pose: Pose; light: boolean }) {
  return (
    <g>
      {[-1, 1].map((side) => {
        const cx = side * x;
        if (pose.eyes === "shut")
          return (
            <path key={side} d={`M${cx - side * r} ${y - r} L${cx + side * r} ${y} L${cx - side * r} ${y + r}`} fill="none" stroke={light ? "#fff" : INK} />
          );
        if (pose.eyes === "happy")
          return <path key={side} d={`M${cx - r} ${y + 1} Q${cx} ${y - r * 1.8} ${cx + r} ${y + 1}`} fill="none" stroke={light ? "#fff" : INK} />;
        const big = pose.eyes === "wide" ? 1.25 : 1;
        const ry = r * big * (1 - 0.85 * pose.squeeze);
        return (
          <g key={side}>
            {light && <circle cx={cx} cy={y} r={r * 1.5} fill="#fff" stroke="none" />}
            <ellipse cx={cx} cy={y} rx={r * big} ry={ry} fill={INK} stroke="none" />
            {pose.squeeze < 0.4 && <circle cx={cx + r * 0.35} cy={y - r * 0.35} r={r * 0.35} fill="#fff" stroke="none" />}
          </g>
        );
      })}
    </g>
  );
}

/** Rosy cheeks, redder while the sneeze builds up. */
function Cheeks({ x, y, blush }: { x: number; y: number; blush: number }) {
  return (
    <g fill="#ff8fab" stroke="none" opacity={0.35 + 0.5 * blush}>
      <ellipse cx={-x - 2} cy={y} rx="4.5" ry="2.8" />
      <ellipse cx={x + 2} cy={y} rx="4.5" ry="2.8" />
    </g>
  );
}

/** The mouth: a smile, an „o“ for „ha…“, wide open for „hatschi!“, or laughing. */
function Mouth({ y, pose, light }: { y: number; pose: Pose; light: boolean }) {
  if (pose.mouth === "o") return <ellipse cx="0" cy={y + 1} rx={2.5 + 2 * pose.open} ry={2.5 + 3.5 * pose.open} fill={MOUTH} stroke={light ? "#fff" : INK} />;
  if (pose.mouth === "big") return <ellipse cx="0" cy={y + 1} rx="7" ry="5" fill={MOUTH} stroke={light ? "#fff" : INK} />;
  if (pose.mouth === "laugh") return <path d={`M-7 ${y - 1} Q0 ${y + 12} 7 ${y - 1} Z`} fill={MOUTH} stroke={light ? "#fff" : INK} />;
  return <path d={`M-5 ${y} Q0 ${y + 4} 5 ${y}`} fill="none" stroke={light ? "#fff" : INK} />;
}

/** A beak (the chick's) or a bill (the duck's), opening for „ha…“ and wide for „hatschi!“ and laughing. */
function Beak({ duck, y, pose, nose }: { duck: boolean; y: number; pose: Pose; nose: string }) {
  const open = pose.mouth === "big" || pose.mouth === "laugh" ? 1 : pose.mouth === "o" ? pose.open * 0.7 : 0;
  const w = duck ? 12 : 7;
  return (
    <g transform={nose} fill={BEAK}>
      <path d={`M${-w} ${y + 3 + open * 4} Q0 ${y + 10 + open * 8} ${w} ${y + 3 + open * 4} Z`} fill="#ff6b3d" />
      <path
        d={
          duck
            ? `M-12 ${y + 3} Q-12 ${y - 4} 0 ${y - 4} Q12 ${y - 4} 12 ${y + 3} Q0 ${y + 7} -12 ${y + 3} Z`
            : `M-7 ${y + 3} L0 ${y - 5} L7 ${y + 3} Q0 ${y + 6} -7 ${y + 3} Z`
        }
      />
    </g>
  );
}

/** The elephant's trunk: hanging down with a little curl (`lift` 0), or raised up and pointing at the tree (`lift` 1). */
function Trunk({ y, lift, wiggle, lw, color }: { y: number; lift: number; wiggle: number; lw: number; color: string }) {
  // Where the trunk's curve goes when it hangs down and when it is raised; the tip of the raised one is the sneeze's start (`noseOf`).
  const down = [0, y + 16, -3, y + 30, 8, -16];
  const up = [26, y + 4, 46, -80, 54, -94];
  const [c1x, c1y, c2x, c2y, ex, ey] = down.map((d, i) => lerp(d, up[i], lift) + (i % 2 === 0 && i > 0 ? wiggle * 0.6 : 0));
  const d = `M0 ${y} C${c1x} ${c1y} ${c2x} ${c2y} ${ex} ${ey}`;
  return (
    <g fill="none">
      <path d={d} strokeWidth={13 + 2 * lw} />
      <path d={d} stroke={color} strokeWidth={13} />
      <ellipse cx={ex} cy={ey} rx="5" ry="3.5" fill="#7d879c" stroke="none" transform={`rotate(${deg(Math.atan2(ey - c2y, ex - c2x)) + 90} ${ex} ${ey})`} />
    </g>
  );
}
