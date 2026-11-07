import type { CSSProperties } from "react";
import {
  playBells,
  playEngine,
  playGiggle,
  playHonk,
  playLaunch,
  playRing,
  playSaw,
  playSiren,
  playSplash,
  playTweet,
  playWash,
  playWhistle,
} from "@/lib/realSounds";
import {
  playBlow,
  playBoing,
  playBuzz,
  playChime,
  playClap,
  playClick,
  playClonk,
  playCrackle,
  playCreak,
  playCrunch,
  playDing,
  playDoorbell,
  playDrops,
  playDrum,
  playDrumRoll,
  playGlug,
  playHiss,
  playHop,
  playHum,
  playJet,
  playKettle,
  playKnock,
  playKnocks,
  playLeaves,
  playMelody,
  playMunch,
  playMusicbox,
  playPlink,
  playPlop,
  playPoof,
  playPop,
  playPuff,
  playRattle,
  playRip,
  playRotor,
  playRustle,
  playScrub,
  playSizzle,
  playSlide,
  playSnap,
  playSqueak,
  playStamp,
  playSwirl,
  playThump,
  playTick,
  playTrain,
  playTrickle,
  playTrill,
  playTwinkle,
  playWhirr,
  playWhoosh,
  playYum,
} from "@/lib/sfx";
import { BACKDROPS, type BackdropId } from "./backdrops";
import { Helper, type Outfit } from "./Helper";
import type { Layer, Pair, Partner, Rect } from "./pairs";
import { TOPICS, type TopicId } from "./topics";

// Most pairs of "Was gehört zusammen?" are scenes written as data (`SceneSpec`, the files in `scenes/`): a backdrop
// that shows where the thing is (a bathroom, a house front, a building site), the thing itself as a big emoji, a
// few emoji round it for context, and – for a helper – the fox or bear in its role (`Helper`). The picked partner
// then does one of a few motions with the thing (`Act`): lands on it, goes into it, pours over it … and the thing
// answers with a hop. The handmade pairs in `pairs.tsx` have motions of their own.

/** The picture's box: 300 wide, 200 high; everything in a scene is placed in these units. */
export const BOX_W = 300;
export const BOX_H = 200;

/**
 * What the partner does with the thing, each a motion of its own (together.css, `.act-<act>`):
 * - `onto` lands on top of it (lid on a jar, hat on a head, candle on a cake)
 * - `into` goes into it and is gone (letter into a mailbox, coin into a piggy bank, ball into a goal)
 * - `beside` comes beside it and the two lean together (sock and shoe, salt and pepper)
 * - `rub` scrubs to and fro over it (sponge on a plate, brush on a shoe, towel on hands)
 * - `pour` tips over it and drops fall (watering can on seeds, milk on cereal)
 * - `tap` swings down onto it three times (hammer on a nail, stick on a drum)
 * - `turn` turns on it (key in a lock, screwdriver on a screw)
 * - `light` touches it and it lights up (bulb in a lamp, match on a candle)
 * - `hold` stays in the helper's paw and wiggles (only for a helper with no thing to work on)
 */
export type Act = "onto" | "into" | "beside" | "rub" | "pour" | "tap" | "turn" | "light" | "hold";

/** The sounds a scene may play, by name: the real recording where there is one (`@/lib/realSounds`), else synthesized. */
export const SOUNDS = {
  blow: playBlow,
  bells: playBells,
  boing: playBoing,
  buzz: playBuzz,
  chime: playChime,
  clap: playClap,
  click: playClick,
  clonk: playClonk,
  crackle: playCrackle,
  creak: playCreak,
  crunch: playCrunch,
  ding: playDing,
  doorbell: playDoorbell,
  drops: playDrops,
  drum: playDrum,
  drumRoll: () => playDrumRoll(0),
  engine: playEngine,
  giggle: playGiggle,
  glug: playGlug,
  hiss: playHiss,
  honk: playHonk,
  hop: playHop,
  hum: playHum,
  jet: playJet,
  kettle: playKettle,
  knock: playKnock,
  knocks: playKnocks,
  launch: playLaunch,
  leaves: playLeaves,
  melody: playMelody,
  munch: playMunch,
  musicbox: playMusicbox,
  plink: () => playPlink(3),
  plop: playPlop,
  poof: playPoof,
  pop: playPop,
  puff: playPuff,
  rattle: playRattle,
  ring: playRing,
  rip: playRip,
  rotor: playRotor,
  rustle: playRustle,
  saw: playSaw,
  scrub: playScrub,
  siren: playSiren,
  sizzle: playSizzle,
  slide: playSlide,
  snap: playSnap,
  splash: playSplash,
  squeak: playSqueak,
  stamp: playStamp,
  swirl: playSwirl,
  thump: playThump,
  tick: playTick,
  train: playTrain,
  trickle: playTrickle,
  trill: playTrill,
  tweet: playTweet,
  twinkle: playTwinkle,
  wash: playWash,
  whirr: playWhirr,
  whistle: playWhistle,
  whoosh: playWhoosh,
  yum: playYum,
} satisfies Record<string, () => void>;

/** A sound's name in `SOUNDS`. */
export type SoundName = keyof typeof SOUNDS;

/** Each motion's own sound, where a scene names none. */
const ACT_SOUNDS: Record<Act, SoundName> = {
  onto: "clonk",
  into: "plop",
  beside: "pop",
  rub: "scrub",
  pour: "drops",
  tap: "knock",
  turn: "click",
  light: "chime",
  hold: "whoosh",
};

/** An emoji placed in the scene for context: the emoji, the middle of it (x, y) and its size, in the box's units. */
export type Prop = [emoji: string, x: number, y: number, size: number];

/** A square in the box: its middle (x, y) and its size. */
export type Spot = [x: number, y: number, size: number];

/** One pair written as data: what stands above, what belongs to it, and the scene round them. */
export interface SceneSpec {
  /** Unique, lower case German without umlauts: "schuh-socke". */
  id: string;
  topic: TopicId;
  /** The German name of the one above, for screen readers: "Schuh", "Malerin". */
  name: string;
  /** With its article: „der Schuh“, „die Malerin“. */
  the: string;
  /** After „gehört“, for „Was gehört zum Schuh?“ (things of the day only; for a helper the same as `the`). */
  toThe: string;
  partner: Partner;
  /** The thing above (things of the day) or what the helper works on (optional for a helper): an emoji. */
  thing?: string;
  /** Where the thing stands, if not in its usual place (`THING_SPOT`, `TARGET_SPOT`). */
  thingAt?: Spot;
  /** Mirrors the thing's emoji, so it faces the other way. */
  flip?: true;
  /** A helper's fox or bear in its role (helpers only). */
  helper?: { fur: "fox" | "bear"; outfit: Outfit; lashes?: true };
  backdrop: BackdropId;
  /** A few emoji round the thing that show where it is or what it is for (never one a child could pick as the answer). */
  props?: Prop[];
  act: Act;
  /** Where the partner does its motion, if not where the act puts it beside the thing (`spotFor`). */
  spot?: Spot;
  /** The sounds of the motion, one after the other, the first as it begins; else the act's own. */
  sounds?: SoundName[];
  /**
   * The ids of other pairs of its kind whose partner fits this one too, or which this one's partner fits (the shower's
   * shower gel and the bathtub's sponge): the two are never in one round. Name every such pair, in any topic.
   */
  alsoFits?: string[];
}

/** Where the thing above stands: big in the middle, on the floor of the scene. */
export const THING_SPOT: Spot = [150, 112, 104];
/** Where what a helper works on stands: right of the helper. */
export const TARGET_SPOT: Spot = [222, 132, 84];
/** Where the helper stands, at the left (its 200 × 300 figure scaled into it). */
export const HELPER_AT: Rect = [4, 28, 112, 168];
/** The helper's paw, where a tool lands first. */
export const PAW: [number, number] = [HELPER_AT[0] + (182 * HELPER_AT[2]) / 200, HELPER_AT[1] + (214 * HELPER_AT[3]) / 300];

/** Where the partner does its motion, by the act, round the thing at `[x, y, size]`. */
export function spotFor(act: Act, [x, y, s]: Spot): Spot {
  const t = s * 0.62;
  switch (act) {
    case "onto":
      return [x, y - s * 0.4, t];
    case "into":
      return [x, y - s * 0.22, t];
    case "beside":
      return [x + s * 0.66, y + s * 0.16, t];
    case "rub":
    case "turn":
      return [x + s * 0.08, y - s * 0.04, t];
    case "pour":
      return [x + s * 0.52, y - s * 0.6, t];
    case "tap":
      return [x + s * 0.48, y - s * 0.4, t];
    case "light":
      return [x + s * 0.6, y - s * 0.12, t];
    case "hold":
      return [PAW[0] + 2, PAW[1] - 10, 50];
  }
}

const rect = ([x, y, s]: Spot): Rect => [x - s / 2, y - s / 2, s, s];
const r1 = (n: number) => Math.round(n * 10) / 10;

/** The time from the partner's arrival until it starts its motion: at once, or after it went from the helper's paw to the thing. */
const startOf = (spec: SceneSpec) => (spec.helper && spec.act !== "hold" ? 1100 : 350);

/** A scene's pair, with its picture's layers built from the spec. */
export function fromScene(spec: SceneSpec): Pair {
  const { helper, act } = spec;
  const thingSpot = spec.thingAt ?? (helper ? TARGET_SPOT : THING_SPOT);
  const spot = spec.spot ?? spotFor(act, thingSpot);
  const toolAt = rect(spot);
  const layers: Layer[] = [{ at: [0, 0, BOX_W, BOX_H], cls: "tg-backdrop", draw: BACKDROPS[spec.backdrop]() }];
  if (spec.props?.length) layers.push({ at: [0, 0, BOX_W, BOX_H], cls: "tg-props", props: spec.props });
  if (helper) layers.push({ at: HELPER_AT, cls: "tg-helper", html: <Helper kind={helper.fur} outfit={helper.outfit} lashes={helper.lashes} /> });
  if (spec.thing) {
    const [x, y, s] = thingSpot;
    // The light round the thing, as big as fits in the box round it.
    const glow = Math.min(s * 1.7, 2 * Math.min(x, BOX_W - x, y, BOX_H - y));
    if (act === "light") layers.push({ at: rect([x, y, glow]), cls: "tg-shine", html: <span className="tg-shine-glow" /> });
    layers.push({ at: rect(thingSpot), cls: "tg-thing", emoji: spec.thing, flip: spec.flip });
  }
  if (act === "pour") {
    const [x, y, s] = spot;
    layers.push({
      at: [x - s * 0.7, y + s * 0.1, s * 0.5, s * 0.9],
      cls: "tg-pour",
      draw: [0, 1, 2].map((i) => (
        <ellipse
          key={i}
          cx={x - s * 0.55 + i * s * 0.12}
          cy={y + s * (0.3 + (i % 2) * 0.3)}
          rx={s * 0.04}
          ry={s * 0.065}
          fill="#4dabf7"
          stroke="#5a4636"
          strokeWidth="1.2"
        />
      )),
    });
  }
  // A helper's tool lands in its paw first and goes from there to the thing (`--from-x`, in its own size).
  const from: CSSProperties | undefined =
    helper && act !== "hold"
      ? ({ "--from-x": `${r1(((PAW[0] - spot[0]) / spot[2]) * 100)}%`, "--from-y": `${r1(((PAW[1] - 10 - spot[1]) / spot[2]) * 100)}%` } as CSSProperties)
      : undefined;
  layers.push({ at: toolAt, cls: "tg-tool", tool: true, style: from });

  const start = startOf(spec);
  const names = spec.sounds ?? [ACT_SOUNDS[act]];
  return {
    id: spec.id,
    kind: TOPICS[spec.topic].kind,
    topic: spec.topic,
    name: spec.name,
    the: spec.the,
    toThe: spec.toThe,
    partner: spec.partner,
    layers,
    act,
    start,
    sounds: names.map((name, i) => [start + 100 + i * 650, SOUNDS[name]] as [number, () => void]),
    alsoFits: spec.alsoFits,
  };
}
