import type { ComponentType } from "react";
import {
  playCreak,
  playCroak,
  playDrops,
  playGiggle,
  playKettle,
  playMunch,
  playPlop,
  playPop,
  playQuack,
  playRumble,
  playRustle,
  playScrub,
  playSizzle,
  playSplash,
  playSwirl,
  playThump,
  playTwinkle,
  playYawn,
  recorded,
} from "@/lib/sfx";
import type { Holding, Outfit, PicId, Pose } from "./kid";
import {
  Bad,
  Dachboden,
  Flur,
  Garten,
  Keller,
  Kinderzimmer,
  Kueche,
  Schlafzimmer,
  Terrasse,
  Wohnzimmer,
  type RoomProps,
  type Weather,
} from "./rooms";

// The stories of "Aufzug". A thought bubble shows what the child needs next; the floor where that
// thing is drawn is the one to ride to. Nothing needs to be read – the sentences are only spoken
// when "Vorlesen" is on.

export type Who = "hero" | "buddy";

/** A sound at `ms` after the start of a step's action. */
type Cue = [number, () => void];

export interface Step {
  /** Whose wish it is; the hero's unless the brother wants something. */
  who?: Who;
  /** What the thought bubble shows. */
  wish: PicId;
  floor: number;
  /** Where `who` stands in the room while doing it, and which way it looks. */
  spot: number;
  face: 1 | -1;
  pose: Pose;
  /** The thing in the room that is used: the room draws it open, cooking, gone … */
  prop: string;
  ms: number;
  /** In the hands while doing it (null puts down what was carried) and afterwards. */
  hold?: Holding | null;
  carry?: Holding | null;
  wear?: Outfit;
  /** The child disappears into the bathtub or the bed. */
  hide?: boolean;
  /** The other child, if it is there: where it stands, what it does and holds. */
  otherSpot?: number;
  otherFace?: 1 | -1;
  otherPose?: Pose;
  otherHold?: Holding | null;
  otherCarry?: Holding | null;
  /** The brother comes along from now on. */
  joins?: boolean;
  sounds: Cue[];
  ask: string;
  done: string;
}

export interface Story {
  id: string;
  /** For the picture cards: what the story is about. */
  icon: PicId;
  title: string;
  weather: Weather;
  /** Rooms from the ground floor up. */
  rooms: ComponentType<RoomProps>[];
  /** Where the hero starts: in the room of this floor, at x. */
  start: number;
  startX: number;
  /** The brother, waiting in his room until he joins. */
  buddy?: { floor: number; x: number; face: 1 | -1; pose: Pose };
  /** What the child feels at the start: picture, pose, sound and words. */
  need: { pic: PicId; pose: Pose; sounds: Cue[]; say: string };
  steps: Step[];
  /** The last step ends with a party, or with everybody asleep. */
  ending: "party" | "sleep";
}

const quack = recorded("quack", playQuack);
const croak = recorded("croak", playCroak);
const munch = recorded("munch", playMunch);
const scrub = recorded("scrub", playScrub);
const splash = recorded("splash", playSplash);

/** Recordings to load before the first story. */
export const RECORDINGS = ["quack", "croak", "munch", "scrub", "splash"];

export const STORIES: Story[] = [
  {
    id: "hunger",
    icon: "pancakes",
    title: "Pfannkuchen",
    weather: "day",
    rooms: [Keller, Kueche, Kinderzimmer, Terrasse],
    start: 3,
    startX: 420,
    buddy: { floor: 2, x: 590, face: -1, pose: "build" },
    need: {
      pic: "plate",
      pose: "tummy",
      sounds: [
        [0, playRumble],
        [1300, playRumble],
      ],
      say: "Mein Bauch knurrt! Ich habe Hunger.",
    },
    steps: [
      {
        wish: "fridge",
        floor: 0,
        spot: 420,
        face: -1,
        pose: "reach",
        prop: "eggs",
        ms: 3200,
        carry: "eggs",
        sounds: [
          [0, playCreak],
          [1500, playPlop],
          [2700, playCreak],
        ],
        ask: "Was ist im Kühlschrank?",
        done: "Eier und Milch!",
      },
      {
        wish: "stove",
        floor: 1,
        spot: 790,
        face: -1,
        pose: "reach",
        prop: "pancakes",
        ms: 5400,
        hold: null,
        carry: "pancakes",
        sounds: [
          [0, playSizzle],
          [1350, playSwirl],
          [2000, playSizzle],
          [3350, playSwirl],
          [4000, playSizzle],
        ],
        ask: "Ab zum Herd!",
        done: "Pfannkuchen backen!",
      },
      {
        wish: "brother",
        floor: 2,
        spot: 720,
        face: -1,
        pose: "stand",
        prop: "tower",
        ms: 2800,
        otherFace: 1,
        otherPose: "cheer",
        joins: true,
        sounds: [
          [200, playGiggle],
          [1400, playGiggle],
        ],
        ask: "Wo ist mein kleiner Bruder?",
        done: "Komm, es gibt Pfannkuchen!",
      },
      {
        who: "buddy",
        wish: "juice",
        floor: 0,
        spot: 410,
        face: -1,
        pose: "reach",
        prop: "juice",
        ms: 2800,
        carry: "juice",
        otherSpot: 540,
        otherFace: -1,
        sounds: [
          [0, playCreak],
          [1700, playPlop],
        ],
        ask: "Ich habe Durst! Saft, bitte!",
        done: "Orangensaft!",
      },
      {
        wish: "table",
        floor: 3,
        spot: 500,
        face: 1,
        pose: "eat",
        prop: "feast",
        ms: 5200,
        hold: null,
        otherSpot: 780,
        otherFace: -1,
        otherPose: "eat",
        otherHold: null,
        sounds: [
          [400, munch],
          [1900, munch],
          [3400, munch],
        ],
        ask: "Jetzt essen wir zusammen!",
        done: "Mmmh, lecker!",
      },
    ],
    ending: "party",
  },
  {
    id: "gutenacht",
    icon: "moon",
    title: "Gute Nacht",
    weather: "evening",
    rooms: [Wohnzimmer, Kueche, Bad, Schlafzimmer],
    start: 0,
    startX: 760,
    need: {
      pic: "moon",
      pose: "yawn",
      sounds: [[0, playYawn]],
      say: "Uaaah. Ich bin müde.",
    },
    steps: [
      {
        wish: "tub",
        floor: 2,
        spot: 490,
        face: -1,
        pose: "stand",
        prop: "bath",
        hide: true,
        ms: 5000,
        wear: "pyjama",
        sounds: [
          [200, splash],
          [1700, quack],
          [2800, splash],
          [4200, playTwinkle],
        ],
        ask: "Erst in die Badewanne.",
        done: "Plitsch, platsch!",
      },
      {
        wish: "mug",
        floor: 1,
        spot: 790,
        face: -1,
        pose: "drink",
        prop: "milk",
        ms: 4200,
        hold: "mug",
        carry: null,
        sounds: [
          [0, playKettle],
          [2200, playSwirl],
        ],
        ask: "Eine warme Milch, bitte.",
        done: "Mmmh, warm.",
      },
      {
        wish: "toothcup",
        floor: 2,
        spot: 690,
        face: 1,
        pose: "brush",
        prop: "teeth",
        ms: 4200,
        hold: "toothbrush",
        carry: null,
        sounds: [
          [0, scrub],
          [1400, scrub],
          [2800, scrub],
        ],
        ask: "Zähne putzen!",
        done: "Schrubb, schrubb, schrubb.",
      },
      {
        wish: "teddy",
        floor: 0,
        spot: 620,
        face: -1,
        pose: "reach",
        prop: "teddy",
        ms: 2400,
        carry: "teddy",
        sounds: [
          [300, playPop],
          [1300, playGiggle],
        ],
        ask: "Wo ist mein Teddy?",
        done: "Da bist du ja!",
      },
      {
        wish: "bed",
        floor: 3,
        spot: 720,
        face: -1,
        pose: "stand",
        prop: "bed",
        hide: true,
        ms: 2600,
        hold: null,
        sounds: [[0, playYawn]],
        ask: "Ab ins Bett.",
        done: "Gute Nacht!",
      },
    ],
    ending: "sleep",
  },
  {
    id: "pfuetzen",
    icon: "rain",
    title: "Pfützen",
    weather: "rain",
    rooms: [Garten, Flur, Kinderzimmer, Dachboden],
    start: 2,
    startX: 300,
    need: {
      pic: "rain",
      pose: "hop",
      sounds: [
        [0, playDrops],
        [1200, playDrops],
      ],
      say: "Es regnet! Ich will in die Pfützen springen!",
    },
    steps: [
      {
        wish: "boots",
        floor: 1,
        spot: 770,
        face: -1,
        pose: "reach",
        prop: "boots",
        ms: 2600,
        wear: "boots",
        sounds: [
          [500, playThump],
          [1500, playThump],
        ],
        ask: "Erst die Gummistiefel.",
        done: "Stiefel an!",
      },
      {
        wish: "coat",
        floor: 2,
        spot: 800,
        face: 1,
        pose: "reach",
        prop: "coat",
        ms: 2600,
        wear: "coat",
        sounds: [
          [400, playRustle],
          [1400, playRustle],
        ],
        ask: "Jetzt die Regenjacke.",
        done: "Jacke an!",
      },
      {
        wish: "umbrella",
        floor: 3,
        spot: 720,
        face: -1,
        pose: "reach",
        prop: "umbrella",
        ms: 2400,
        wear: "umbrella",
        sounds: [[600, playPop]],
        ask: "Und der Regenschirm!",
        done: "Mein Schirm!",
      },
      {
        wish: "boat",
        floor: 2,
        spot: 680,
        face: -1,
        pose: "reach",
        prop: "boat",
        ms: 2400,
        carry: "boat",
        sounds: [[500, playGiggle]],
        ask: "Mein Schiffchen!",
        done: "Das kommt mit!",
      },
      {
        wish: "rain",
        floor: 0,
        spot: 560,
        face: 1,
        pose: "jump",
        prop: "splash",
        ms: 5200,
        hold: null,
        sounds: [
          [300, splash],
          [1300, splash],
          [2100, croak],
          [3300, splash],
          [4300, splash],
        ],
        ask: "Ab in den Garten!",
        done: "Platsch! Platsch!",
      },
    ],
    ending: "party",
  },
];

export const texts = {
  wrong: "Hier nicht.",
  sleep: "Schlaf gut!",
  party: "Hurra!",
};
