import { useEffect, useId, useMemo, useRef, type PointerEvent, type ReactNode } from "react";
import {
  playClick,
  playClonk,
  playHa,
  playHatschi,
  playKnock,
  playLeaves,
  playPlop,
  playPuff,
  playRustle,
  playSniff,
  playSqueak,
  playSwirl,
  playThump,
  playTwinkle,
  playWhoosh,
  playYawn,
} from "@/lib/sfx";
import {
  loadRealSounds,
  playBaa,
  playBark,
  playBlow,
  playBuzz,
  playChatter,
  playGiggle,
  playMeow,
  playMoo,
  playOink,
  playQuack,
  playTrumpet,
  playTweet,
} from "@/lib/realSounds";
import {
  cameraLayer,
  cameraPoint,
  gliding,
  SETTLE_S,
  useAnyKey,
  useFrames,
  useLevelName,
  VIEW_H,
  VIEW_W,
  wobble,
  wobbleSeconds,
  worldHint,
  type LevelProps,
  decay,
} from "./level";
import { TapHint } from "@/components/TapHint";
import { deg, easeIn, easeInOut, easeOut, lerp } from "./machineKit";
import { still } from "./parts";
import type { Pt } from "./path";
import { INK } from "./scenery";
import {
  ACORN_R,
  acornAt,
  BEES,
  beeAt,
  CLOUD,
  FLOWER_R,
  FLOWERS,
  gustAt,
  HIVE,
  hatAt,
  KITE,
  kiteAt,
  kiteTailTip,
  PART2,
  PART2_AFTER_LEAVES_S,
  PART2_STEPS,
  PUFFBALL,
  part2Focus,
  SCARECROW,
  SEEDS_EACH,
  SQUIRREL,
  STRAWS,
  seedAt,
  shellAt,
  sporesAt,
  strawAt,
  TORTOISE,
  TREE_ROOM,
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

/** The things past the tree a child can tap. */
type Thing = "squirrel" | "puffball" | "tortoise" | "hive" | "cloud" | "kite" | "scarecrow";
const THINGS: Thing[] = ["squirrel", "puffball", "tortoise", "hive", "cloud", "kite", "scarecrow"];

/** What a thing past the tree says when it is tapped. */
const THING_VOICE: Record<Thing, () => void> = {
  squirrel: playChatter,
  puffball: playPuff,
  tortoise: playClonk,
  hive: playBuzz,
  cloud: playBlow,
  kite: playSwirl,
  scarecrow: playRustle,
};

/** While one of these goes „ha… ha…“, a tap on it makes it sneeze at once, like an animal of the row. */
const SNEEZERS: Partial<Record<Thing, [number, number]>> = {
  tortoise: [PART2.sniff, PART2.tortoise],
  cloud: [PART2.wake, PART2.cloud],
  scarecrow: [PART2.tickle, PART2.scarecrow],
};

/** Every sound of the second part, at its moment (seconds into it): each link sets off the next with a sound. */
const PART2_SOUNDS: [string, number, () => void][] = [
  ["chatter", PART2.chatter, playChatter],
  ["slip", PART2.slip, playClick],
  ...PART2.bounces.map((at, i): [string, number, () => void] => [`bounce${i}`, at, () => playKnock(700 + 120 * i)]),
  ["puff", PART2.puff, playPuff],
  ["sniff", PART2.sniff, playSniff],
  ["ha", PART2.ha, () => playHa(0.3)],
  ["ha2", PART2.ha2, () => playHa(0.38)],
  ["hide", PART2.hide, playClonk],
  ["tortoise", PART2.tortoise, () => playHatschi(0.45)],
  ["land", PART2.land, playThump],
  ["bees", PART2.bees, playBuzz],
  ["bees2", PART2.flowers[0] - 0.8, playBuzz],
  ["flowers", PART2.flowers[0], playSwirl],
  ["seeds", PART2.flowers[3], playTwinkle],
  ["wake", PART2.wake, playYawn],
  ["cloudHa", PART2.cloudHa, () => playHa(0.65)],
  ["cloudHa2", PART2.cloudHa2, () => playHa(0.75)],
  ["cloud", PART2.cloud, () => playHatschi(0.85)],
  ["gust", PART2.cloud + 0.1, playWhoosh],
  ["lift", PART2.lift, playBlow],
  ["tickle", PART2.tickle, playSniff],
  ["crowHa", PART2.crowHa, () => playHa(0.85)],
  ["crowHa2", PART2.crowHa2, () => playHa(0.92)],
  ["scarecrow", PART2.scarecrow, () => playHatschi(1)],
  ["straw", PART2.scarecrow + 0.15, playRustle],
  ["hat", PART2.hat, playPlop],
  ["laugh", PART2.laugh, playGiggle],
  ["laughChatter", PART2.laugh + 0.2, playChatter],
  ["laugh2", PART2.laugh + 0.8, playGiggle],
  ["trumpet", PART2.laugh + 1.1, playTrumpet],
];

/** The seconds of the second part while everyone past the tree laughs, and a little after. */
const LAUGHING = [PART2.laugh, PART2.laugh + LAUGH_S + 0.1] as const;

/**
 * When each thing past the tree changes, in seconds into the second part (A-44): outside these spans its drawing stays
 * exactly the same, so it is drawn with a held moment (`held`) and React skips it. Drawn with `u` itself, every thing of
 * the second part went through React in every frame, also all through the first part, and the level was 66 % busy on
 * the old phone. `sneezeStill.test.tsx` checks that the held moment draws exactly what `u` itself would.
 */
export const PART2_SPANS = {
  squirrel: [[PART2.chatter, PART2.puff + 0.6], LAUGHING],
  acorn: [[PART2.slip, PART2.puff + 0.6]],
  puffball: [[PART2.puff, PART2.puff + 1.1]],
  spores: [[PART2.puff, PART2.sniff + 0.6]],
  tortoise: [[PART2.sniff, PART2.land + 1.1], LAUGHING],
  hive: [[PART2.land, PART2.land + 3.1]],
  dandelions: [[PART2.flowers[0], PART2.flowers[3] + 3.1]],
  bees: [[PART2.bees, PART2.flowers[3] + 1.2 + 0.25 * BEES + 0.1]],
  seeds: [[PART2.flowers[0], PART2.cloud + 1.5]],
  cloud: [[PART2.wake - 0.4, PART2.cloud + 1.6], LAUGHING],
  gust: [[PART2.cloud, PART2.lift + 0.5]],
  // The kite's tail keeps fluttering once it flies, to the level's end.
  kite: [[PART2.lift, Infinity]],
  // With his hat flying off and landing again and the straw flying out of his sleeves.
  scarecrow: [[PART2.tickle, PART2.hat + 0.1], LAUGHING],
} satisfies Record<string, readonly (readonly [number, number])[]>;

/** The parts of the second part that hold their moment. */
export type Part2Thing = keyof typeof PART2_SPANS;

/** Before the second part, and before a thing's first span, its moment is held at this. */
const BEFORE = -100;

/** `u` where it lies in one of `spans`; else the end of the span before it, or `BEFORE` before the first (A-44). */
export function held(u: number, spans: readonly (readonly [number, number])[]) {
  let at = BEFORE;
  for (const [a, b] of spans) {
    if (u < a) return at;
    if (u <= b) return u;
    at = b;
  }
  return at;
}

/** A tap's age as a thing draws it: every tap's hop, wobble or happy eyes are over after a second. */
const tapAge = (seconds: number) => Math.min(1, seconds);

/** When the tree has stopped shaking after the elephant's sneeze, in seconds. */
const TREE_REST = wobbleSeconds(2.2);

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
  /** How each kind of animal takes its own sneeze: tipping back (degrees), flapping wings or ears, ears shooting up, the cow's bell swinging (degrees). */
  roll: number;
  flap: number;
  ears: number;
  bell: number;
}

/** An animal (or a thing with a face) sitting still and smiling. */
const restPose = (): Pose => ({
  tilt: 0,
  jerk: 0,
  shake: 0,
  hop: 0,
  ruffle: 0,
  eyes: "open",
  squeeze: 0,
  mouth: "smile",
  open: 0,
  wiggle: 0,
  blush: 0,
  trunk: 0,
  roll: 0,
  flap: 0,
  ears: 0,
  bell: 0,
});

/**
 * Each kind of animal takes its sneeze its own way, `since` seconds after it:
 * the mouse and the pig tip over backwards and sit up again, the birds flap,
 * the rabbit's ears shoot up, the cat and the sheep puff up, the dog shakes
 * its head, the cow's bell swings and the elephant's ears flap.
 */
function flourish(pose: Pose, id: AnimalId, since: number) {
  if (since < 0 || since > 1.4) return;
  const fade = decay(since * 3);
  const back = Math.sin(Math.min(1, since / 1.1) * Math.PI);
  if (id === "mouse") pose.roll = -26 * back;
  else if (id === "pig") pose.roll = -16 * back;
  else if (id === "chick" || id === "duck") pose.flap = Math.abs(Math.sin(since * 22)) * fade;
  else if (id === "rabbit") pose.ears = fade;
  else if (id === "cat" || id === "sheep") pose.ruffle = Math.max(pose.ruffle, fade);
  else if (id === "dog") pose.shake += wobble(since, 18, 24, 3);
  else if (id === "cow") pose.bell = wobble(since, 35, 9, 2);
  else if (id === "elephant") pose.flap = Math.abs(Math.sin(since * 12)) * fade;
}

/** The face of something past the tree that sneezes: tickled at `at.hit`, „ha… ha…“ from `at.ha`, HATSCHI at `at.sneeze`; `laugh` and `tap` are seconds since the laughing and since the last tap. */
function facePose(u: number, at: { hit: number; ha: number; sneeze: number } | null, laugh: number, tap: number): Pose {
  const pose = restPose();
  if (at && u >= at.hit && u < at.ha) {
    pose.eyes = "wide";
    pose.mouth = "o";
    pose.open = 0.2;
    pose.wiggle = 1.5 * Math.sin(u * 40);
    pose.shake = wobble(u - at.hit, 6, 30, 4);
  }
  if (at && u >= at.ha && u < at.sneeze) {
    const lean = easeOut(Math.min(1, (u - at.ha) / ((at.sneeze - at.ha) * 0.8)));
    pose.tilt = lean;
    pose.squeeze = 0.85 * lean;
    pose.mouth = "o";
    pose.open = lean;
    pose.wiggle = 2 * lean * Math.sin(u * 42);
    pose.blush = lean;
  }
  const since = at ? u - at.sneeze : -1;
  if (since >= 0 && since < 1.5) {
    pose.jerk = since < 0.07 ? since / 0.07 : decay((since - 0.07) * 4);
    pose.eyes = since < 0.45 ? "shut" : "open";
    pose.mouth = since < 0.3 ? "big" : "smile";
    pose.blush = Math.max(0, 1 - since);
  }
  if (tap >= 0 && tap < 0.8) {
    pose.hop = Math.abs(Math.sin((tap * Math.PI) / 0.32)) * 9 * (1 - tap / 0.8);
    pose.eyes = "happy";
  }
  if (laugh >= 0 && laugh < LAUGH_S) {
    pose.eyes = "happy";
    pose.mouth = "laugh";
    pose.hop = Math.abs(Math.sin(laugh * 9)) * 7 * (1 - laugh / LAUGH_S);
  }
  return pose;
}

/**
 * „Hatschi-Kette“ (R-09): animals sit on a meadow, small to big, with a tree
 * at the end. A tap lets a feather float down onto the mouse's nose: „ha…
 * ha… hatschi!“, and the sneeze blows over to the next animal, whose fur
 * ruffles until it has to sneeze too, a bit bigger and louder each time, and
 * each kind takes its sneeze its own way (`flourish`). The camera walks along
 * the row. The elephant's sneeze through its trunk blows every leaf off the
 * tree, the leaves whirl down onto everyone and all the animals laugh. Then
 * the chain goes on past the tree (`PART2` in sneeze.ts): a squirrel the
 * leaves uncovered drops its acorn onto a puffball, the spores make a
 * tortoise sneeze inside its shell, the shell hops against a beehive, the bees
 * fly through the dandelions, their seeds tickle a sleeping cloud awake, its
 * sneeze lifts a kite, whose tail tickles the scarecrow, and his sneeze blows
 * his hat off. Joining in: a tap on an animal (or on the tortoise, the cloud
 * or the scarecrow) going „ha…“ makes it sneeze at once, one that has sneezed
 * sniffs or giggles, one still waiting says hello, a thing past the tree
 * answers with its own sound; any other tap or key hurries the chain on by
 * one step.
 */
export function SneezeLevel({ sound, say, onDone }: LevelProps) {
  const label = useLevelName("sneeze");
  useEffect(
    () => loadRealSounds([playBaa, playBark, playBlow, playBuzz, playChatter, playGiggle, playMeow, playMoo, playOink, playQuack, playTrumpet, playTweet]),
    [],
  );
  const row = useMemo(() => layOutRow(pickAnimals()), []);
  const feather = useMemo(() => FEATHERS[Math.floor(Math.random() * FEATHERS.length)], []);
  const leaves = useMemo(() => leavesOf(row.tree), [row]);
  /** When the last leaf lies in the grass. */
  const fallen = useMemo(() => Math.max(...leaves.map((leaf) => leaf.fall)), [leaves]);
  const travel = useMemo(() => row.seats.map((seat, i) => travelSeconds(noseOf(seat), targetOf(row, i))), [row]);
  const beasts = useRef<Beast[]>(
    row.seats.map(() => ({ hitT: Infinity, haT: Infinity, ha2: false, sneezeT: Infinity, arriveT: Infinity, tapT: -Infinity, tapKind: "hello", taps: 0 })),
  );
  /** Seconds since the tap; below 0 until then. */
  const clock = useRef(-1);
  /** When the elephant's sneeze reached the tree. */
  const leavesT = useRef(Infinity);
  /** When the second part past the tree starts, in seconds since the tap; a tap that hurries it on moves it earlier. */
  const part2T = useRef(Infinity);
  /** The last tap on each thing past the tree, in seconds since the tap. */
  const thingTaps = useRef<Record<Thing, number>>(Object.fromEntries(THINGS.map((thing) => [thing, -Infinity])) as Record<Thing, number>);
  /** One-off sounds of the ending that have played, and whether the level is done. */
  const fired = useRef(new Set<string>());
  /** When the level was done, in seconds since the tap. */
  const doneAt = useRef(Infinity);
  const camera = useRef({ x: 0, z: 1 });
  const box = useRef<HTMLDivElement>(null);
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
    if (i === last) say({ de: "Hatschi!", en: "Achoo!", zh: "阿嚏！", hi: "आछू!", es: "¡Achís!", ar: "أتشو!", ru: "Апчхи!" });
  };
  const arrive = (i: number) => {
    beasts.current[i].arriveT = clock.current;
    if (i < last) hit(i + 1);
    else {
      leavesT.current = clock.current;
      part2T.current = clock.current + PART2_AFTER_LEAVES_S;
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
      }
      // Past the tree: each moment's sound once, and done once everyone there has laughed.
      const u = t - part2T.current;
      for (const [key, at, play] of PART2_SOUNDS) if (u >= at) once(`p2:${key}`, () => sound(play));
      if (u >= PART2.laugh + DONE_AFTER_LAUGH_S)
        once("done", () => {
          doneAt.current = t;
          onDone();
        });
    }
    // The camera looks between the animal whose turn it is and the next one; from the elephant on, at the end of the
    // row, and past the tree it follows the second part's things.
    const cur = currentOf(beasts.current);
    const atEnd = cur === last && beasts.current[last].hitT < Infinity;
    const z = atEnd ? END_ZOOM : 1;
    const viewW = VIEW_W / z;
    const next = cur < last ? row.seats[cur + 1].x : row.tree.x;
    const rowEnd = row.tree.x + TREE_ROOM - viewW;
    const focus = part2Focus(clock.current - part2T.current);
    const x =
      focus !== null
        ? Math.min(row.worldW - viewW, Math.max(rowEnd, row.tree.x + focus - viewW / 2))
        : atEnd
          ? rowEnd
          : Math.min(rowEnd, Math.max(0, (row.seats[cur].x + next) / 2 - viewW * 0.42));
    const follow = 1 - Math.exp(-dt * CAMERA_FOLLOW);
    const panning = gliding(camera.current.x, x) || gliding(camera.current.z * 1000, z * 1000);
    camera.current.x += (x - camera.current.x) * follow;
    camera.current.z += (z - camera.current.z) * follow;
    // Still before the tap, and once everyone past the tree has laughed and the last tap's hop or giggle has faded.
    const t = clock.current;
    const lastTap = Math.max(...beasts.current.map((b) => b.tapT), ...THINGS.map((thing) => thingTaps.current[thing]));
    const settled = fired.current.has("done") && t - Math.max(doneAt.current, lastTap) > SETTLE_S;
    return (t >= 0 && !settled) || panning;
  });

  /** A tap that isn't on an animal, or a key: the chain goes on by one step at once. */
  const hurry = () => {
    const all = beasts.current;
    if (all[0].hitT === Infinity) {
      hit(0);
      return;
    }
    if (part2T.current < Infinity) {
      hurryPart2();
      return;
    }
    const cur = currentOf(all);
    const b = all[cur];
    if (b.sneezeT < Infinity) arrive(cur);
    else if (b.haT < Infinity) sneeze(cur);
    else startHa(cur);
  };

  /**
   * Past the tree a tap or key jumps to the next moment where something new
   * starts; the sounds of the moments jumped over stay silent, so nothing
   * piles up. After the last one the scarecrow just rustles.
   */
  const hurryPart2 = () => {
    const u = clock.current - part2T.current;
    const next = u < 0 ? 0 : PART2_STEPS.find((at) => at > u + 0.05);
    if (next === undefined) {
      tapThing("scarecrow");
      return;
    }
    for (const [key, at] of PART2_SOUNDS) if (at < next) fired.current.add(`p2:${key}`);
    part2T.current = clock.current - next;
  };

  const tapThing = (thing: Thing) => {
    const u = clock.current - part2T.current;
    const sneezing = SNEEZERS[thing];
    if (sneezing && u >= sneezing[0] && u < sneezing[1]) {
      hurryPart2();
      return;
    }
    thingTaps.current[thing] = clock.current;
    sound(THING_VOICE[thing]);
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
    const thing = (e.target as Element).closest("[data-thing]");
    if (animal) tapAnimal(Number(animal.getAttribute("data-animal")));
    else if (thing) tapThing(thing.getAttribute("data-thing") as Thing);
    else hurry();
  };

  const t = clock.current;
  const laughT = leavesT.current + LAUGH_AFTER_S;
  // Seconds into the second part (far below 0 before it, so no drawing meets an infinity).
  const u = Math.max(-100, t - part2T.current);
  const tapped = (thing: Thing) => t - thingTaps.current[thing];
  const X = row.tree.x;
  const { x: camX, z: camZ } = camera.current;
  const meadow = useMemo(() => <Meadow worldW={row.worldW} cloudsTo={row.tree.x} gradient={`${ids}-sky`} />, [row, ids]);
  const still = useMemo(() => <StillThings x={row.tree.x} />, [row]);

  // Zooming out keeps the meadow's ground line in the same place on the screen.
  const cameraStyle = cameraLayer(box.current, { x: 0, y: 0, w: row.worldW, h: VIEW_H }, { x: camX, y: VIEW_H - VIEW_H / camZ, w: VIEW_W, h: VIEW_H }, camZ);
  return (
    <div className="marble-level" ref={box} onPointerDown={onPointerDown}>
      {/* The meadow and what never moves are a layer of their own, painted once and only moved by the camera: in the
          animals' svg the phone painted them again in every frame (perf, A-36). */}
      <svg className="marble-camera" viewBox={`0 0 ${row.worldW} ${VIEW_H}`} style={cameraStyle} aria-hidden>
        {meadow}
        {still}
      </svg>
      <svg className="marble-camera" viewBox={`0 0 ${row.worldW} ${VIEW_H}`} style={cameraStyle} aria-label={label}>
        <g>
          {/* Each part gets only the numbers it draws, held while it rests, so React skips what doesn't change (A-44). */}
          <TreeDrawing
            tree={row.tree}
            age={t < leavesT.current ? -1 : Math.min(TREE_REST, t - leavesT.current)}
            squirrel={{ u: held(u, PART2_SPANS.squirrel), woken: t >= leavesT.current, tap: tapAge(tapped("squirrel")) }}
          />
          {row.seats.map((seat, i) => (
            <Animal key={i} index={i} seat={seat} pose={poseAt(beasts.current[i], seat.kind, t, laughT + i * 0.07)} />
          ))}
          {row.seats.map((seat, i) => (
            <Puff key={i} row={row} i={i} b={beasts.current[i]} t={t} travel={travel[i]} size={sizeOf(seat.kind)} />
          ))}
          <Feather seat={row.seats[0]} {...featherTimes(beasts.current[0], t)} color={feather} />
          <FallingLeaves leaves={leaves} age={t < leavesT.current ? -1 : Math.min(fallen, t - leavesT.current)} />
          <PastTheTree x={X} u={u} tapped={(thing) => tapAge(tapped(thing))} />
        </g>
      </svg>
      {t < 0 && (
        <TapHint
          key="feather"
          {...worldHint(
            cameraPoint(box.current, { x: 0, y: 0, w: row.worldW, h: VIEW_H }, { x: camX, y: VIEW_H - VIEW_H / camZ, w: VIEW_W, h: VIEW_H }, camZ),
            {
              ...featherStart(row.seats[0]),
              y: featherStart(row.seats[0]).y - 30,
              r: 70,
            },
          )}
        />
      )}
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
  const pose = restPose();
  const sinceHit = t - b.hitT;
  if (sinceHit >= 0) {
    pose.ruffle = decay(sinceHit * 2.2) * (sinceHit < 2.5 ? 1 : 0);
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
    pose.jerk = sinceSneeze < 0.07 ? sinceSneeze / 0.07 : decay((sinceSneeze - 0.07) * 4);
    pose.eyes = sinceSneeze < 0.45 ? "shut" : "open";
    pose.mouth = sinceSneeze < 0.3 ? "big" : "smile";
    pose.blush = Math.max(0, 1 - sinceSneeze);
    pose.trunk = sinceSneeze < 0.8 ? 1 : Math.max(0.15, 1 - (sinceSneeze - 0.8) * 0.9);
    flourish(pose, kind.id, sinceSneeze);
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
function Meadow({ worldW, cloudsTo, gradient }: { worldW: number; cloudsTo: number; gradient: string }) {
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
      {/* Clouds only over the row: past the tree the sky is the sleeping cloud's. */}
      {Array.from({ length: Math.ceil(cloudsTo / 800) }, (_, i) => (
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

/**
 * The big tree at the end of the row; `age` seconds after the elephant's sneeze reached it, it shakes and its crown is
 * gone. The squirrel sits on a branch, hidden by the crown until the leaves fly; it comes as numbers, not as an
 * element, so the tree is drawn again only when it or the squirrel changes.
 */
const TreeDrawing = still(function TreeDrawing({ tree, age, squirrel }: { tree: Tree; age: number; squirrel: { u: number; woken: boolean; tap: number } }) {
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
      {/* What sits on a branch, hidden by the crown until the leaves fly */}
      <Squirrel x={x + SQUIRREL.x} y={SQUIRREL.y} {...squirrel} />
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
});

/** The leaves blown off the tree, `age` seconds after: up in a whirl, then see-sawing down until they lie still in the grass. */
const FallingLeaves = still(function FallingLeaves({ leaves, age }: { leaves: Leaf[]; age: number }) {
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
});

/* ---------- The feather and the sneezes ---------- */

/** Where the feather hangs in the air before the tap: right above the first animal. */
const featherStart = (seat: Seat) => ({ x: seat.x + 110, y: FLOOR - 330 });

/** The moments the feather draws from: held before the tap and once it lies in the grass, so it is drawn only while it moves. */
const featherTimes = (b: Beast, t: number) => ({ t: t < 0 ? -1 : Math.min(t, b.haT + FEATHER_DROP_S), hitT: b.hitT, haT: b.haT });
/** How long the feather takes to drop from the nose to the grass, in seconds. */
const FEATHER_DROP_S = 1.1;

/** The feather: still in the air before the tap, then floating down onto the mouse's nose, tickling it, and dropping to the grass. */
const Feather = still(function Feather({ seat, t, hitT, haT, color }: { seat: Seat; t: number; hitT: number; haT: number; color: string }) {
  const start = featherStart(seat);
  const nose = noseOf(seat);
  const onNose = { x: nose.x + 14, y: nose.y - 8 };
  let at: Pt;
  let turn: number;
  if (t < 0 || hitT === Infinity) {
    const k = Math.max(0, t) / FEATHER_S;
    const swing = Math.sin(k * 3 * Math.PI) * 70 * (1 - k);
    at = { x: lerp(start.x, onNose.x, easeInOut(k)) + swing, y: lerp(start.y, onNose.y, easeInOut(k)) };
    turn = 30 + 35 * Math.sin(k * 3 * Math.PI);
  } else if (t < haT) {
    const tickle = Math.sin((t - hitT) * 30);
    at = { x: onNose.x + 6 * tickle, y: onNose.y - 2 * Math.abs(tickle) };
    turn = -15 + 18 * tickle;
  } else {
    const k = Math.min(1, (t - haT) / FEATHER_DROP_S);
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
    </g>
  );
});

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
const Animal = still(function Animal({ index, seat, pose }: { index: number; seat: Seat; pose: Pose }) {
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
      <g transform={`translate(0 ${-pose.hop}) rotate(${pose.roll} ${-kind.body.rx} 0)`}>
        <Body kind={kind} lw={lw} pose={pose} />
        <g transform={head}>
          <Head kind={kind} lw={lw} pose={pose} />
          <Tufts kind={kind} lw={lw} ruffle={pose.ruffle} />
        </g>
      </g>
    </g>
  );
});

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
          <ellipse cx={-rx + 2} cy={-ry - 2} rx="9" ry="16" transform={`rotate(${20 + 10 * pose.ruffle + 55 * pose.flap} ${-rx + 2} ${-ry - 12})`} />
          <ellipse cx={rx - 2} cy={-ry - 2} rx="9" ry="16" transform={`rotate(${-20 - 10 * pose.ruffle - 55 * pose.flap} ${rx - 2} ${-ry - 12})`} />
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
  if (id === "cow") {
    // The bell hangs from the collar and swings with the cow's sneeze.
    const hook = -kind.head.y + kind.head.r - 1;
    parts.push(
      <g key="bell" transform={`rotate(${pose.bell} 0 ${hook})`}>
        <line x1="0" y1={hook} x2="0" y2={hook + 4} />
        <circle cx="0" cy={hook + 9} r="6" fill="#ffd23f" />
      </g>,
    );
  }
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
  const flap = 1 + 0.12 * pose.ruffle * Math.sin(pose.shake) + 0.3 * pose.flap;

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
          <g key={side} transform={`translate(0 ${-6 * pose.ears}) rotate(${side * (8 + 6 * pose.ruffle) * (1 - pose.ears)} ${side * 9} ${H - r + 4})`}>
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

/* ---------- Past the tree ---------- */

const SQUIRREL_FUR = "#d98b4a";
const SKIN = "#b9d98a";
const STRAW = "#f2c94c";
const BURLAP = "#ecd7a6";

/** What stands past the tree and never moves: the kite's stake and the dandelions' leaves. Drawn once. */
function StillThings({ x }: { x: number }) {
  const stake = x + KITE.stake;
  return (
    <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <path
        d={`M${stake - 7} ${FLOOR + 8} L${stake - 7} ${FLOOR - 30} L${stake} ${FLOOR - 40} L${stake + 7} ${FLOOR - 30} L${stake + 7} ${FLOOR + 8} Z`}
        fill="#a0673a"
      />
      {FLOWERS.map((f) => (
        <g key={f.x} fill="#6dbb45">
          <path d={`M${x + f.x} ${FLOOR + 4} q-18 -6 -34 -2 l8 -6 l-10 -4 q20 -4 36 8 Z`} />
          <path d={`M${x + f.x} ${FLOOR + 4} q18 -6 34 -2 l-8 -6 l10 -4 q-20 -4 -36 8 Z`} />
        </g>
      ))}
    </g>
  );
}

/**
 * Everything past the tree, `u` seconds into the second part; `tapped` says how long ago a thing was tapped (at most a
 * second). Each thing is a `still` part drawn at its own held moment (`PART2_SPANS`), so only what moves goes through
 * React; with `hold` false each is drawn at `u` itself, which the test compares it with.
 */
export function PastTheTree({ x, u, tapped, hold = true }: { x: number; u: number; tapped: (thing: Thing) => number; hold?: boolean }) {
  const at = (thing: Part2Thing) => (hold ? held(u, PART2_SPANS[thing]) : u);
  return (
    <g>
      <Puffball x={x + PUFFBALL.x} age={at("puffball") - PART2.puff} tap={tapped("puffball")} />
      <FallingAcorn x={x} u={at("acorn")} />
      <Spores x={x} u={at("spores")} />
      <Tortoise x={x} u={at("tortoise")} tap={tapped("tortoise")} />
      <Hive x={x} u={at("hive")} tap={tapped("hive")} />
      <Dandelions x={x} u={at("dandelions")} />
      <Bees x={x} u={at("bees")} />
      <SleepyCloud x={x} u={at("cloud")} tap={tapped("cloud")} />
      <Seeds x={x} u={at("seeds")} />
      <Gust x={x} u={at("gust")} />
      <ScarecrowAndHat x={x} u={at("scarecrow")} tap={tapped("scarecrow")} />
      <Kite x={x} u={at("kite")} tap={tapped("kite")} />
    </g>
  );
}

/** The acorn once it has slipped from the squirrel's paws: bouncing into the puffball. */
const FallingAcorn = still(function FallingAcorn({ x, u }: { x: number; u: number }) {
  if (u < PART2.slip) return null;
  const acorn = acornAt(u);
  return (
    <g transform={`translate(${x + acorn.x} ${acorn.y})`}>
      <Acorn turn={acorn.turn} />
    </g>
  );
});

/** The bees out of the hive, each flying the way it looks. */
const Bees = still(function Bees({ x, u }: { x: number; u: number }) {
  return (
    <g>
      {Array.from({ length: BEES }, (_, j) => {
        const at = beeAt(j, u);
        const ahead = beeAt(j, u + 0.05);
        return at && <Bee key={j} x={x + at.x} y={at.y} dir={ahead && ahead.x < at.x ? -1 : 1} u={u} />;
      })}
    </g>
  );
});

/** The dandelions' seeds, from their clocks up under the cloud and away with its sneeze. */
const Seeds = still(function Seeds({ x, u }: { x: number; u: number }) {
  return (
    <g>
      {FLOWERS.map((_, i) =>
        Array.from({ length: SEEDS_EACH }, (_, n) => {
          const seed = seedAt(i, n, u);
          return seed && seed.fade > 0 && <Seed key={`${i}-${n}`} x={x + seed.x} y={seed.y} fade={seed.fade} />;
        }),
      )}
    </g>
  );
});

/** The scarecrow with his hat, on his head or flying, and the straw his sneeze blows out of his sleeves. */
const ScarecrowAndHat = still(function ScarecrowAndHat({ x, u, tap }: { x: number; u: number; tap: number }) {
  const hat = hatAt(u);
  const seated = u < PART2.scarecrow || u >= PART2.hat;
  return (
    <g>
      <Scarecrow x={x} u={u} laugh={u - PART2.laugh} tap={tap}>
        {seated && <Hat x={x + hat.x} y={hat.y} turn={hat.turn} />}
      </Scarecrow>
      {!seated && <Hat x={x + hat.x} y={hat.y} turn={hat.turn} />}
      {Array.from({ length: STRAWS }, (_, n) => {
        const bit = strawAt(n, u);
        return (
          bit && (
            <g key={n} transform={`translate(${x + bit.x} ${bit.y}) rotate(${bit.turn})`}>
              <line x1="-12" y1="0" x2="12" y2="0" stroke={INK} strokeWidth="8" strokeLinecap="round" />
              <line x1="-12" y1="0" x2="12" y2="0" stroke={STRAW} strokeWidth="4" strokeLinecap="round" />
            </g>
          )
        );
      })}
    </g>
  );
});

/** An acorn with its cap, its middle at 0 0, turned as it rolls. */
function Acorn({ turn }: { turn: number }) {
  return (
    <g transform={`rotate(${deg(turn)})`} stroke={INK} strokeWidth="3">
      <ellipse cx="0" cy="2" rx={ACORN_R - 2} ry={ACORN_R - 1} fill="#c58a45" />
      <path d={`M${-ACORN_R} -2 Q0 ${-ACORN_R - 4} ${ACORN_R} -2 Q0 3 ${-ACORN_R} -2 Z`} fill="#7a5230" />
      <line x1="0" y1={-ACORN_R + 1} x2="2" y2={-ACORN_R - 5} />
    </g>
  );
}

/**
 * The squirrel the leaves uncover on the tree's right branch, its feet at
 * `x y`: startled, it scolds the row, its acorn slips, and it laughs along
 * at the end.
 */
function Squirrel({ x, y, u, woken, tap }: { x: number; y: number; u: number; woken: boolean; tap: number }) {
  const pose = facePose(u, null, u - PART2.laugh, tap);
  const scared = woken && u < PART2.chatter;
  const scolding = u >= PART2.chatter && u < PART2.slip;
  const watching = u >= PART2.slip && u < PART2.puff + 0.6;
  if (scared || watching) {
    pose.eyes = "wide";
    pose.mouth = "o";
    pose.open = 0.5;
  }
  if (scolding) {
    pose.mouth = Math.sin(u * 30) > 0 ? "big" : "o";
    pose.open = 0.6;
    pose.hop = Math.abs(Math.sin(u * 14)) * 5;
  }
  const puffed = scared ? 1.15 : 1;
  return (
    <g data-thing="squirrel" transform={`translate(${x} ${y})`} stroke={INK} strokeWidth="3" strokeLinejoin="round">
      <rect x="-34" y="-100" width="80" height="104" fill="transparent" stroke="none" />
      <g transform={`translate(0 ${-pose.hop})`}>
        <path
          transform={`translate(10 -10) scale(${puffed}) translate(-10 10)`}
          d="M10 -10 C48 -14 56 -64 32 -84 C20 -94 4 -86 12 -72 C26 -62 22 -40 4 -30 Z"
          fill="#c8743a"
        />
        <ellipse cx="0" cy="-26" rx="17" ry="22" fill={SQUIRREL_FUR} />
        <ellipse cx="0" cy="-22" rx="10" ry="14" fill="#f6dcb8" stroke="none" />
        {[-1, 1].map((side) => (
          <g key={side}>
            <ellipse cx={side * 9} cy="-2" rx="8" ry="4" fill={SQUIRREL_FUR} />
            <path d={`M${side * 5} -72 L${side * 12} -86 L${side * 15} -68 Z`} fill={SQUIRREL_FUR} />
          </g>
        ))}
        <circle cx="0" cy="-58" r="17" fill={SQUIRREL_FUR} />
        <ellipse cx="0" cy="-52" rx="9" ry="6" fill="#f6dcb8" stroke="none" />
        <g transform="translate(0 -58) scale(0.7)">
          <Cheeks x={13} y={8} blush={pose.blush} />
          <Eyes x={9} y={-4} r={4} pose={pose} light={false} />
          <ellipse cx="0" cy="6" rx="3" ry="2.4" fill="#5b3a29" stroke="none" />
          <Mouth y={12} pose={pose} light={false} />
        </g>
        {u < PART2.slip ? (
          <g>
            <g transform="translate(2 -30)">
              <Acorn turn={0} />
            </g>
            <ellipse cx="-9" cy="-30" rx="5" ry="6" fill={SQUIRREL_FUR} />
            <ellipse cx="12" cy="-30" rx="5" ry="6" fill={SQUIRREL_FUR} />
          </g>
        ) : (
          <g>
            <ellipse cx="-14" cy="-36" rx="5" ry="6" fill={SQUIRREL_FUR} />
            <ellipse cx="14" cy="-36" rx="5" ry="6" fill={SQUIRREL_FUR} />
          </g>
        )}
      </g>
    </g>
  );
}

/** The puffball on the grass: it squashes when the acorn bumps it (`age` seconds after) or a finger taps it. */
const Puffball = still(function Puffball({ x, age, tap }: { x: number; age: number; tap: number }) {
  const bump = (a: number, amp: number) => (a >= 0 && a < 1 ? amp * decay(a * 4) * Math.cos(a * 16) : 0);
  const squash = bump(age, 0.22) + bump(tap, 0.12);
  const { r } = PUFFBALL;
  return (
    <g data-thing="puffball" transform={`translate(${x} ${FLOOR}) scale(${1 + squash} ${1 - squash})`} stroke={INK} strokeWidth="4">
      <ellipse cx="0" cy={-r + 6} rx={r + 4} ry={r} fill="#efe3c6" />
      {[
        [-22, -50],
        [14, -66],
        [26, -36],
        [-6, -24],
        [-30, -26],
      ].map(([cx, cy]) => (
        <circle key={`${cx}`} cx={cx} cy={cy} r="4" fill="#d8c69c" stroke="none" />
      ))}
      <ellipse cx="0" cy={-2 * r + 9} rx="8" ry="4" fill="#8a7a55" strokeWidth="3" />
    </g>
  );
});

/** The cloud of spores from the puffball, drifting to the tortoise's nose. */
const Spores = still(function Spores({ x, u }: { x: number; u: number }) {
  const cloud = sporesAt(u);
  if (!cloud) return null;
  return (
    <g fill="#d4b25c" opacity={0.8 * cloud.fade}>
      {Array.from({ length: 14 }, (_, n) => {
        const a = n * 2.4 + u * 1.2;
        const d = cloud.spread * (0.25 + ((n * 7) % 10) / 13);
        return <circle key={n} cx={x + cloud.x + d * Math.cos(a)} cy={cloud.y + d * 0.7 * Math.sin(a)} r={4 + (n % 3)} />;
      })}
    </g>
  );
});

/**
 * The tortoise, seen from the side and looking back at the puffball: the
 * spores make it sniff and go „ha… ha…“, it pulls its head in and sneezes
 * inside its shell, which hops, turning once, against the beehive's stool.
 */
const Tortoise = still(function Tortoise({ x, u, tap }: { x: number; u: number; tap: number }) {
  const laugh = u - PART2.laugh;
  const shell = shellAt(u);
  const between = (a: number, b: number) => Math.min(1, Math.max(0, (u - a) / (b - a)));
  const tuck = u < PART2.land + 0.4 ? between(PART2.hide, PART2.hide + 0.3) : 1 - between(PART2.land + 0.4, PART2.land + 0.8);
  const landed = u - PART2.land;
  const squash = landed >= 0 && landed < 1 ? 0.12 * decay(landed * 5) * Math.cos(landed * 20) : 0;
  const pose = facePose(u, { hit: PART2.sniff, ha: PART2.ha, sneeze: PART2.tortoise }, laugh, tap);
  const head = { x: TORTOISE.nose.dx + 10, y: TORTOISE.nose.y - FLOOR - 4 };
  const neck = `M-70 -26 L${head.x + 12} ${head.y + 6}`;
  return (
    <g
      data-thing="tortoise"
      transform={`translate(${x + shell.x} ${FLOOR - shell.lift}) rotate(${shell.turn} 0 -45) scale(${1 + squash} ${1 - squash}) translate(0 ${-pose.hop})`}
      stroke={INK}
      strokeWidth="4"
      strokeLinejoin="round"
    >
      <rect x={-TORTOISE.rx - 50} y={-TORTOISE.h - 20} width={2 * TORTOISE.rx + 60} height={TORTOISE.h + 26} fill="transparent" stroke="none" />
      <g transform={`scale(${1 - 0.8 * tuck})`}>
        {[-62, -26, 26, 62].map((lx) => (
          <ellipse key={lx} cx={lx} cy="-8" rx="13" ry="12" fill={SKIN} />
        ))}
      </g>
      <path d={`M${TORTOISE.rx} -20 L${TORTOISE.rx + 18} -12 L${TORTOISE.rx} -8 Z`} fill={SKIN} />
      <g transform={`translate(${45 * tuck} 0) rotate(${-18 * pose.tilt + 12 * pose.jerk + pose.shake} -80 -30)`} opacity={1 - tuck}>
        <path d={neck} strokeWidth="26" strokeLinecap="round" />
        <path d={neck} stroke={SKIN} strokeWidth="18" strokeLinecap="round" />
        <circle cx={head.x} cy={head.y} r="24" fill={SKIN} />
        <g transform={`translate(${head.x - 4 + pose.wiggle} ${head.y - 2}) scale(0.8)`}>
          <Cheeks x={12} y={8} blush={pose.blush} />
          <Eyes x={8} y={-6} r={4} pose={pose} light={false} />
          <Mouth y={12} pose={pose} light={false} />
        </g>
      </g>
      <path d={`M-92 -14 Q-90 ${-TORTOISE.h - 14} 0 ${-TORTOISE.h - 14} Q90 ${-TORTOISE.h - 14} 92 -14 Z`} fill="#6fae4f" />
      {[
        [0, -66, 22],
        [-50, -44, 16],
        [50, -44, 16],
      ].map(([cx, cy, r]) => (
        <path
          key={cx}
          d={`${Array.from({ length: 6 }, (_, i) => `${i ? "L" : "M"}${cx + r * Math.cos((i * Math.PI) / 3)} ${cy + r * 0.8 * Math.sin((i * Math.PI) / 3)}`).join(" ")} Z`}
          fill="#9bd16f"
          strokeWidth="3"
        />
      ))}
      <rect x="-98" y="-22" width="196" height="14" rx="7" fill="#c9a36a" />
    </g>
  );
});

/** The straw beehive on its stool: it rocks when the tortoise's shell lands against the stool, and the bees come out. */
const Hive = still(function Hive({ x, u, tap }: { x: number; u: number; tap: number }) {
  const hx = x + HIVE.x;
  const base = FLOOR - HIVE.stool;
  const landed = u - PART2.land;
  const rock = (landed >= 0 && landed < 3 ? wobble(landed, 7, 16, 2.4) : 0) + (tap >= 0 && tap < 1 ? wobble(tap, 4, 18, 4) : 0);
  const { rx, h } = HIVE;
  const top = base - 12;
  return (
    <g data-thing="hive" stroke={INK} strokeWidth="4" strokeLinejoin="round">
      {[-1, 1].map((side) => (
        <g key={side}>
          <line x1={hx + side * HIVE.legs} y1={base} x2={hx + side * (HIVE.legs + 8)} y2={FLOOR + 4} strokeWidth="14" strokeLinecap="round" />
          <line x1={hx + side * HIVE.legs} y1={base} x2={hx + side * (HIVE.legs + 8)} y2={FLOOR + 4} stroke="#b07a45" strokeWidth="7" strokeLinecap="round" />
        </g>
      ))}
      <rect x={hx - 88} y={top} width="176" height="14" rx="5" fill="#b07a45" />
      <g transform={`rotate(${rock} ${hx} ${top})`}>
        <path
          d={`M${hx - rx} ${top} C${hx - rx - 6} ${top - h * 0.75} ${hx - rx * 0.55} ${top - h} ${hx} ${top - h} C${hx + rx * 0.55} ${top - h} ${hx + rx + 6} ${top - h * 0.75} ${hx + rx} ${top} Z`}
          fill="#e9b949"
        />
        {[1, 2, 3, 4].map((i) => {
          const y = top - i * 27;
          const w = rx * Math.sqrt(Math.max(0, 1 - ((i * 27) / h) ** 2)) + 2;
          return <path key={i} d={`M${hx - w} ${y} Q${hx} ${y + 9} ${hx + w} ${y}`} fill="none" stroke="#c48f2a" strokeWidth="4" />;
        })}
        <path d={`M${hx - 16} ${top} L${hx - 16} ${top - 14} Q${hx} ${top - 32} ${hx + 16} ${top - 14} L${hx + 16} ${top} Z`} fill="#5b3a29" />
      </g>
    </g>
  );
});

/** A bee, flying towards `dir` (1 right, -1 left), its wings beating. */
function Bee({ x, y, dir, u }: { x: number; y: number; dir: 1 | -1; u: number }) {
  const beat = 0.5 + 0.5 * Math.abs(Math.sin(u * 50));
  return (
    <g transform={`translate(${x} ${y}) scale(${dir} 1)`} stroke={INK} strokeWidth="3">
      {[-5, 5].map((wx) => (
        <ellipse key={wx} cx={wx} cy={-10} rx="6" ry={10 * beat} fill="#ffffff" opacity="0.85" strokeWidth="2" />
      ))}
      <ellipse cx="0" cy="0" rx="13" ry="9" fill="#ffd23f" />
      <path d="M-3 -8 L-3 8 M4 -8 L4 8" strokeWidth="4" />
      <circle cx="9" cy="-2" r="1.8" fill={INK} stroke="none" />
    </g>
  );
}

/** The dandelions: white clocks until a bee flies through them, then bare, their stems swaying. */
const Dandelions = still(function Dandelions({ x, u }: { x: number; u: number }) {
  return (
    <g>
      {FLOWERS.map((f, i) => {
        const fx = x + f.x;
        const age = u - PART2.flowers[i];
        const sway = age >= 0 && age < 3 ? wobble(age, 12, 12, 2.5) : 0;
        const head = FLOOR - f.h;
        const stem = `M${fx} ${FLOOR + 4} Q${fx - 10} ${FLOOR - f.h / 2} ${fx} ${head}`;
        return (
          <g key={f.x} transform={`rotate(${sway} ${fx} ${FLOOR})`}>
            <path d={stem} fill="none" stroke={INK} strokeWidth="8" />
            <path d={stem} fill="none" stroke="#6dbb45" strokeWidth="4" />
            {age < 0 ? (
              <g>
                <circle cx={fx} cy={head} r={FLOWER_R} fill="#ffffff" stroke="#c9d3d9" strokeWidth="3" />
                {Array.from({ length: 10 }, (_, n) => {
                  const a = (n / 10) * 2 * Math.PI;
                  return (
                    <line
                      key={n}
                      x1={fx + 5 * Math.cos(a)}
                      y1={head + 5 * Math.sin(a)}
                      x2={fx + (FLOWER_R - 4) * Math.cos(a)}
                      y2={head + (FLOWER_R - 4) * Math.sin(a)}
                      stroke="#d9dee2"
                      strokeWidth="2"
                    />
                  );
                })}
                <circle cx={fx} cy={head} r="5" fill="#c8b45a" />
              </g>
            ) : (
              <circle cx={fx} cy={head} r="7" fill="#c8b45a" stroke={INK} strokeWidth="3" />
            )}
          </g>
        );
      })}
    </g>
  );
});

/** A dandelion seed floating on its little umbrella. */
function Seed({ x, y, fade }: { x: number; y: number; fade: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={fade} stroke="#8f8a70" strokeWidth="2" strokeLinecap="round">
      <line x1="0" y1="0" x2="0" y2="14" />
      {[-60, -30, 0, 30, 60].map((a) => (
        <line key={a} x1="0" y1="0" x2={9 * Math.sin((a * Math.PI) / 180)} y2={-9 * Math.cos((a * Math.PI) / 180)} stroke="#c9d3d9" />
      ))}
      <circle cx="0" cy="-6" r="7" fill="#ffffff" opacity="0.8" stroke="none" />
    </g>
  );
}

/**
 * The cloud sleeping over the meadow: the seeds tickle it awake, it goes
 * „ha… ha…“, swelling up, and sneezes a gust down onto the kite.
 */
const SleepyCloud = still(function SleepyCloud({ x, u, tap }: { x: number; u: number; tap: number }) {
  const laugh = u - PART2.laugh;
  const pose = facePose(u, { hit: PART2.wake, ha: PART2.cloudHa, sneeze: PART2.cloud }, laugh, tap);
  if (u < PART2.wake && !(tap >= 0 && tap < 0.8)) {
    // Asleep: eyes shut, a little smile; the seeds arriving make its face twitch.
    pose.squeeze = 1;
    if (u >= PART2.wake - 0.4) pose.wiggle = 1.5 * Math.sin(u * 30);
  }
  const swell = 1 + 0.06 * pose.tilt;
  return (
    <g
      data-thing="cloud"
      transform={`translate(${x + CLOUD.x + 14 * pose.jerk} ${CLOUD.y + 8 * pose.jerk - pose.hop}) scale(${swell + 0.08 * pose.jerk} ${swell - 0.04 * pose.jerk})`}
    >
      {[
        [-95, 10, 52],
        [-40, -22, 62],
        [32, -30, 66],
        [98, 4, 52],
        [0, 15, 60],
        [-58, 24, 46],
        [60, 24, 46],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx} ${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" stroke="#cfe3f2" strokeWidth="5" />
      ))}
      <ellipse cx="0" cy="10" rx="128" ry="52" fill="#ffffff" />
      <g transform={`translate(${pose.wiggle} 8) scale(2.4)`} stroke={INK} strokeWidth="1.6" strokeLinecap="round">
        <Cheeks x={14} y={6} blush={pose.blush} />
        <Eyes x={11} y={-4} r={3.6} pose={pose} light={false} />
        <Mouth y={6} pose={pose} light={false} />
      </g>
    </g>
  );
});

/** The gust the cloud sneezes down onto the kite: whoosh lines round a little swirl. */
const Gust = still(function Gust({ x, u }: { x: number; u: number }) {
  const gust = gustAt(u);
  if (!gust) return null;
  const from = { x: x + CLOUD.x + CLOUD.rx * 0.7, y: CLOUD.y + CLOUD.ry * 0.6 };
  const at = { x: x + gust.x, y: gust.y };
  const len = Math.hypot(at.x - from.x, at.y - from.y) || 1;
  const back = { x: (from.x - at.x) / len, y: (from.y - at.y) / len };
  const side = { x: -back.y, y: back.x };
  const fade = 1 - Math.max(0, (gust.k - 0.7) / 0.3);
  return (
    <g opacity={fade} fill="none" stroke="#a9d8f7" strokeWidth="8" strokeLinecap="round">
      {[-1, 0, 1].map((off) => {
        const p = { x: at.x + back.x * 26 + side.x * off * 22, y: at.y + back.y * 26 + side.y * off * 22 };
        const l = off ? 90 : 140;
        const q = { x: p.x + back.x * l, y: p.y + back.y * l };
        return <path key={off} d={`M${p.x} ${p.y} Q${(p.x + q.x) / 2 + side.x * off * 18} ${(p.y + q.y) / 2 + side.y * off * 18} ${q.x} ${q.y}`} />;
      })}
      <path d={`M${at.x + 14} ${at.y} A14 14 0 1 1 ${at.x} ${at.y - 14} A8 8 0 1 1 ${at.x - 4} ${at.y + 2}`} />
    </g>
  );
});

/** The kite: lying in the grass tied to its stake, then lifted by the gust; its tail tickles the scarecrow's nose. */
const Kite = still(function Kite({ x, u, tap }: { x: number; u: number; tap: number }) {
  const kite = kiteAt(u);
  const turn = kite.turn + (tap >= 0 && tap < 1 ? wobble(tap, 12, 14, 4) : 0);
  const squash = 1 - 0.7 * kite.flat;
  const r = (turn * Math.PI) / 180;
  const kx = x + kite.x;
  const half = KITE.h / 2;
  const bottom = { x: kx - half * squash * Math.sin(r), y: kite.y + half * squash * Math.cos(r) };
  const tip = kiteTailTip(u);
  const end = { x: x + tip.x, y: tip.y };
  const bend = 24 * Math.sin(u * 4) * (1 - kite.flat);
  const mid = { x: (bottom.x + end.x) / 2 + bend, y: (bottom.y + end.y) / 2 };
  const point = (k: number) => ({
    x: (1 - k) * (1 - k) * bottom.x + 2 * k * (1 - k) * mid.x + k * k * end.x,
    y: (1 - k) * (1 - k) * bottom.y + 2 * k * (1 - k) * mid.y + k * k * end.y,
  });
  const stake = { x: x + KITE.stake, y: FLOOR - 36 };
  const cross = { x: kx, y: kite.y - 10 * squash };
  const sag = 0.12 * Math.hypot(cross.x - stake.x, cross.y - stake.y) * (1 - kite.flat);
  return (
    <g stroke={INK} strokeLinejoin="round" strokeLinecap="round">
      <path d={`M${stake.x} ${stake.y} Q${(stake.x + cross.x) / 2} ${(stake.y + cross.y) / 2 + sag} ${cross.x} ${cross.y}`} fill="none" strokeWidth="2.5" />
      <path d={`M${bottom.x} ${bottom.y} Q${mid.x} ${mid.y} ${end.x} ${end.y}`} fill="none" strokeWidth="3" stroke="#5b5470" />
      {[0.35, 0.68, 1].map((k, i) => {
        const p = point(k);
        return (
          <g key={k} transform={`translate(${p.x} ${p.y})`} fill={i % 2 ? "#ffd23f" : "#ff6b6b"} strokeWidth="2.5">
            <path d="M0 0 L-12 -7 L-12 7 Z" />
            <path d="M0 0 L12 -7 L12 7 Z" />
          </g>
        );
      })}
      <g data-thing="kite" transform={`translate(${kx} ${kite.y}) rotate(${turn}) scale(1 ${squash})`} strokeWidth="4">
        <rect x="-60" y="-80" width="120" height="160" fill="transparent" stroke="none" />
        <path d="M0 -60 L-42 -12 L0 -12 Z" fill="#ff6b6b" />
        <path d="M0 -60 L42 -12 L0 -12 Z" fill="#ffd23f" />
        <path d="M-42 -12 L0 60 L0 -12 Z" fill="#ffd23f" />
        <path d="M42 -12 L0 60 L0 -12 Z" fill="#ff6b6b" />
        <path d="M0 -60 L0 60 M-42 -12 L42 -12" fill="none" strokeWidth="3" />
      </g>
    </g>
  );
});

/** The straw hat, its brim's middle at `x y`. */
function Hat({ x, y, turn }: { x: number; y: number; turn: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`} stroke={INK} strokeWidth="4" strokeLinejoin="round">
      <path d="M-36 0 Q-36 -46 0 -46 Q36 -46 36 0 Z" fill="#e9c46a" />
      <rect x="-36" y="-16" width="72" height="11" fill="#e76f51" />
      <ellipse cx="0" cy="0" rx="64" ry="12" fill="#e9c46a" />
    </g>
  );
}

/**
 * The scarecrow at the end of the meadow: the kite's tail tickles his nose,
 * he goes „ha… ha…“ and sneezes so hard that straw flies out of his sleeves
 * and his hat flies off. `children` is the hat while it sits on his head.
 */
function Scarecrow({ x, u, laugh, tap, children }: { x: number; u: number; laugh: number; tap: number; children: ReactNode }) {
  const sx = x + SCARECROW.x;
  const pose = facePose(u, { hit: PART2.tickle, ha: PART2.crowHa, sneeze: PART2.scarecrow }, laugh, tap);
  const sway = laugh >= 0 && laugh < LAUGH_S ? 3 * Math.sin(laugh * 10) * (1 - laugh / LAUGH_S) : 0;
  const lean = -3 * pose.tilt + 5 * pose.jerk + sway + (tap >= 0 && tap < 1 ? wobble(tap, 4, 14, 4) : 0);
  const neck = FLOOR - 258;
  const { arms, reach, head, r } = SCARECROW;
  const tuft = (cx: number, cy: number, dir: number) =>
    [-40, -20, 0, 20, 40].map((a) => {
      const rad = ((a + dir) * Math.PI) / 180;
      return <line key={a} x1={cx} y1={cy} x2={cx + 20 * Math.cos(rad)} y2={cy + 20 * Math.sin(rad)} stroke={STRAW} strokeWidth="5" />;
    });
  return (
    <g data-thing="scarecrow" transform={`rotate(${lean} ${sx} ${FLOOR})`} stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
      <rect x={sx - 130} y={head - r - 60} width="260" height={FLOOR - head + r + 66} fill="transparent" stroke="none" />
      <rect x={sx - 7} y={neck} width="14" height={FLOOR - neck + 6} fill="#a0673a" />
      {tuft(sx - reach, arms, 180)}
      {tuft(sx + reach, arms, 0)}
      {tuft(sx, FLOOR - 122, 90)}
      <path
        d={`M${sx - reach} ${arms - 18} L${sx + reach} ${arms - 18} L${sx + reach} ${arms + 18} L${sx + 48} ${arms + 18} L${sx + 56} ${FLOOR - 120} L${sx - 56} ${FLOOR - 120} L${sx - 48} ${arms + 18} L${sx - reach} ${arms + 18} Z`}
        fill="#6c8fd6"
      />
      <rect x={sx + 12} y={FLOOR - 196} width="26" height="24" fill="#ffb84d" strokeWidth="3" />
      <line x1={sx - 52} y1={FLOOR - 150} x2={sx + 52} y2={FLOOR - 150} stroke="#c49a5a" strokeWidth="6" />
      <g transform={`rotate(${-10 * pose.tilt + 14 * pose.jerk + pose.shake} ${sx} ${neck})`}>
        {tuft(sx, neck, -90)}
        <circle cx={sx} cy={head} r={r} fill={BURLAP} />
        <path d={`M${sx - r + 6} ${head - 6} q6 4 12 0 M${sx + r - 18} ${head + 16} q6 -4 12 0`} fill="none" stroke="#c4a877" strokeWidth="3" />
        <g transform={`translate(${sx} ${head}) scale(1.6)`} strokeWidth="2.5">
          <Cheeks x={14} y={6} blush={pose.blush} />
          <Eyes x={10} y={-6} r={4} pose={pose} light={false} />
          <path d={`M${-3 + pose.wiggle} 1 L${3 + pose.wiggle} 1 L${pose.wiggle} 9 Z`} fill="#ff8c42" />
          <Mouth y={13} pose={pose} light={false} />
        </g>
        {children}
      </g>
    </g>
  );
}
