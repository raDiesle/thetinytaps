import type { ComponentType } from "react";
import {
  playClonk,
  playCrack,
  playCreak,
  playCroak,
  playDrops,
  playFlush,
  playGiggle,
  playGlug,
  playKettle,
  playKnock,
  playMunch,
  playPlop,
  playPoof,
  playPop,
  playPuff,
  playQuack,
  playRumble,
  playRustle,
  playScrub,
  playSizzle,
  playSplash,
  playSwirl,
  playThump,
  playWhirr,
  playWhoosh,
  playYawn,
  recorded,
} from "@/lib/sfx";
import type { Holding, Outfit, PicId, Pose } from "./kid";
import { Bad, Dachboden, Flur, Garten, Keller, Kinderzimmer, Kueche, Schlafzimmer, Terrasse, Wohnzimmer, type RoomProps, type Weather } from "./rooms";

// The stories of "Aufzug". A thought bubble shows what the child needs next; the floor where that
// thing is drawn is the one to ride to. There the first move happens by itself, then the action button
// lights up: every tap (or click, or key) cracks an egg, pours a pancake, puts on a boot … At most two
// taps in a row, see the rules in CLAUDE.md. Nothing needs to be read – the sentences are only spoken
// when "Vorlesen" is on.

export type Who = "hero" | "buddy";

/** A sound at `ms` after the start of a step's action. */
type Cue = [number, () => void];

/** Something done in the room: each tap on the action button does it once more, and the room draws how far it is.
 * An `auto` task does itself, as the first move in a room or between two runs of taps. */
export interface Task {
  /** The taps are counted under this name; the rooms draw from the counts. */
  name: string;
  taps: number;
  /** Happens by itself, without waiting for a tap. */
  auto?: boolean;
  /** Walks there first, and looks that way. */
  spot?: number;
  face?: 1 | -1;
  /** The move and the sound of one tap; it lasts `beat` ms (700 if not given). */
  pose: Pose;
  /** The pose between taps (standing if not given). */
  rest?: Pose;
  sound: () => void;
  beat?: number;
  /** The other child does it too. */
  together?: boolean;
  /** In the hands, and put on, with the last tap. */
  hold?: Holding | null;
  wear?: Outfit;
  ask: string;
  done?: string;
  /** After the last tap: waiting so long with these sounds, e.g. while the pancake bakes. */
  wait?: number;
  sounds?: Cue[];
}

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
  /** After the action, what the child does (by tapping, or by itself), one after the other. */
  tasks?: Task[];
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
const flush = recorded("flush", playFlush);
const clink = () => playKnock(2000);
const tock = () => playKnock(900);

/** Recordings to load before the first story. */
export const RECORDINGS = ["quack", "croak", "munch", "scrub", "splash", "flush"];

/** One pancake: a tap pours the batter into the pan, it bakes, and flips itself onto the plate. */
const pancake = (n: number): Task[] => [
  {
    name: "pour",
    taps: 1,
    ...(n === 0 && { spot: 720, face: -1 as const }),
    pose: "reach",
    sound: playGlug,
    ask: n === 0 ? "Teig in die Pfanne!" : "Noch einer!",
    done: "Brutzel, brutzel.",
    wait: 2400,
    sounds: [
      [0, playSizzle],
      [1200, playSizzle],
    ],
  },
  {
    name: "flip",
    taps: 1,
    auto: true,
    pose: "reach",
    sound: playWhoosh,
    ask: "Umdrehen, auf den Teller!",
    done: n === 2 ? "Drei Pfannkuchen!" : "Hopp!",
    wait: 700,
  },
];

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
        wish: "chefhat",
        floor: 2,
        spot: 880,
        face: 1,
        pose: "reach",
        prop: "chefhat",
        ms: 300,
        sounds: [],
        ask: "Ich backe Pfannkuchen! Wo ist meine Kochmütze?",
        done: "Da ist sie!",
        tasks: [{ name: "chefhat", taps: 1, auto: true, pose: "reach", sound: playPop, wear: "chef", ask: "Mütze auf!", done: "Ich bin der Koch!" }],
      },
      {
        wish: "fridge",
        floor: 0,
        spot: 420,
        face: -1,
        pose: "reach",
        prop: "eggs",
        ms: 1000,
        sounds: [[0, playCreak]],
        ask: "Was ist im Kühlschrank?",
        done: "Kühlschrank auf!",
        tasks: [{ name: "eggs", taps: 1, pose: "reach", sound: playPlop, hold: "eggs", ask: "Eier und Milch, bitte!", done: "Eier und Milch!" }],
      },
      {
        wish: "bowl",
        floor: 1,
        spot: 630,
        face: -1,
        pose: "reach",
        prop: "bowl",
        ms: 900,
        hold: null,
        carry: "breakfast",
        sounds: [[100, playClonk]],
        ask: "Ab in die Küche, zur Schüssel!",
        done: "Jetzt wird gebacken!",
        tasks: [
          { name: "crack", taps: 2, pose: "reach", sound: playCrack, ask: "Eier aufschlagen!", done: "Knack, knack!" },
          { name: "milk", taps: 1, auto: true, pose: "reach", sound: playGlug, beat: 1100, ask: "Milch dazu!" },
          { name: "flour", taps: 1, auto: true, pose: "reach", sound: playPoof, beat: 1100, ask: "Und Mehl!" },
          {
            name: "mix",
            taps: 1,
            pose: "stir",
            sound: playWhirr,
            beat: 1800,
            ask: "Rühren mit dem Mixer!",
            done: "Der Teig ist fertig!",
          },
          ...pancake(0),
          ...pancake(1),
          ...pancake(2),
        ],
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
        ms: 1000,
        otherSpot: 540,
        otherFace: -1,
        sounds: [[0, playCreak]],
        ask: "Ich habe Durst! Saft, bitte!",
        done: "Kühlschrank auf!",
        tasks: [{ name: "juice", taps: 1, pose: "reach", sound: playPlop, hold: "juice", ask: "Den Saft!", done: "Orangensaft!" }],
      },
      {
        wish: "table",
        floor: 3,
        spot: 500,
        face: 1,
        pose: "sit",
        prop: "feast",
        ms: 1400,
        hold: null,
        otherSpot: 780,
        otherFace: -1,
        otherPose: "sit",
        otherHold: null,
        sounds: [[200, playClonk]],
        ask: "Jetzt essen wir zusammen!",
        done: "Alles auf den Tisch!",
        tasks: [
          { name: "lid", taps: 1, auto: true, pose: "serve", rest: "sit", sound: playPop, ask: "Glas aufdrehen!" },
          { name: "spread", taps: 2, pose: "serve", rest: "sit", sound: playPlop, ask: "Marmelade drauf!" },
          { name: "bite", taps: 1, auto: true, pose: "eat", rest: "sit", together: true, sound: munch, beat: 1500, ask: "Guten Appetit!" },
          {
            name: "bite",
            taps: 2,
            pose: "eat",
            rest: "sit",
            together: true,
            sound: munch,
            beat: 1500,
            ask: "Noch ein Bissen!",
            done: "Mmmh, lecker!",
          },
        ],
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
        ms: 2200,
        sounds: [
          [200, splash],
          [1300, quack],
        ],
        ask: "Erst in die Badewanne.",
        done: "Plitsch, platsch!",
        tasks: [
          { name: "soap", taps: 2, pose: "stand", sound: scrub, ask: "Einseifen!", done: "Lauter Schaum!" },
          { name: "duck", taps: 1, auto: true, pose: "stand", sound: quack, ask: "Die Quietsch-Ente!" },
        ],
      },
      {
        wish: "pyjama",
        floor: 3,
        spot: 720,
        face: -1,
        pose: "reach",
        prop: "pyjama",
        ms: 300,
        sounds: [],
        ask: "Jetzt den Schlafanzug.",
        done: "Da liegt er!",
        tasks: [
          { name: "pyjama", taps: 1, auto: true, pose: "reach", sound: playRustle, wear: "pyjama", ask: "Anziehen!", done: "Schlafanzug an!" },
          { name: "slippers", taps: 2, spot: 470, face: -1, pose: "reach", sound: playPlop, ask: "Und die Hausschuhe!", done: "Kuschelig!" },
        ],
      },
      {
        wish: "mug",
        floor: 1,
        spot: 790,
        face: -1,
        pose: "reach",
        prop: "milk",
        ms: 2600,
        carry: null,
        sounds: [
          [0, playKettle],
          [1700, playSwirl],
        ],
        ask: "Eine warme Milch, bitte.",
        done: "Die Milch wird warm.",
        tasks: [
          { name: "milkpour", taps: 1, auto: true, spot: 880, face: -1, pose: "reach", sound: playGlug, ask: "In die Tasse!" },
          { name: "stir", taps: 1, auto: true, pose: "stir", sound: clink, beat: 1000, ask: "Umrühren!" },
          { name: "blow", taps: 2, pose: "blow", sound: playPuff, hold: "mug", ask: "Pusten, die Milch ist heiß!" },
          { name: "sip", taps: 1, auto: true, pose: "drink", sound: playGlug, beat: 1400, ask: "Trinken!", done: "Mmmh, warm." },
        ],
      },
      {
        wish: "toothcup",
        floor: 2,
        spot: 690,
        face: 1,
        pose: "reach",
        prop: "teeth",
        ms: 1200,
        hold: "toothbrush",
        sounds: [[200, playPop]],
        ask: "Zähne putzen!",
        done: "Zahnpasta drauf!",
        tasks: [
          { name: "scrub", taps: 2, pose: "brush", sound: scrub, beat: 900, ask: "Schrubb, schrubb!" },
          { name: "rinse", taps: 1, auto: true, pose: "reach", sound: splash, hold: null, ask: "Ausspülen!", done: "Blitzeblank!" },
          { name: "toilet", taps: 1, spot: 900, face: 1, pose: "reach", sound: flush, ask: "Und noch aufs Klo.", done: "Wusch!", wait: 1200 },
        ],
      },
      {
        wish: "teddy",
        floor: 0,
        spot: 640,
        face: -1,
        pose: "shake",
        prop: "toys",
        ms: 1200,
        sounds: [],
        ask: "Wo ist mein Teddy?",
        done: "Oh, erst aufräumen!",
        tasks: [
          { name: "tidy", taps: 2, pose: "reach", sound: tock, ask: "Aufräumen! Ab in die Kiste.", done: "Fertig aufgeräumt!" },
          { name: "teddy", taps: 1, auto: true, pose: "reach", sound: playGiggle, hold: "teddy", ask: "Da ist mein Teddy!", done: "Da bist du ja!" },
        ],
      },
      {
        wish: "bed",
        floor: 3,
        spot: 720,
        face: -1,
        pose: "stand",
        prop: "bed",
        hide: true,
        ms: 1800,
        hold: null,
        sounds: [[0, playYawn]],
        ask: "Ab ins Bett.",
        done: "Kuschelig.",
        tasks: [{ name: "light", taps: 1, pose: "stand", sound: () => playKnock(1600), ask: "Licht aus!", done: "Gute Nacht!" }],
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
        ms: 500,
        sounds: [],
        ask: "Erst die Gummistiefel.",
        done: "Da sind sie!",
        tasks: [{ name: "boots", taps: 2, pose: "reach", sound: playThump, wear: "boots", ask: "Rein in die Stiefel!", done: "Stiefel an!" }],
      },
      {
        wish: "coat",
        floor: 2,
        spot: 800,
        face: 1,
        pose: "reach",
        prop: "coat",
        ms: 300,
        sounds: [],
        ask: "Jetzt die Regenjacke.",
        done: "Da hängt sie!",
        tasks: [{ name: "coat", taps: 1, auto: true, pose: "reach", sound: playRustle, wear: "coat", ask: "Jacke an!", done: "Jacke an!" }],
      },
      {
        wish: "umbrella",
        floor: 3,
        spot: 720,
        face: -1,
        pose: "reach",
        prop: "umbrella",
        ms: 300,
        sounds: [],
        ask: "Und der Regenschirm!",
        done: "Da ist er!",
        tasks: [
          { name: "umbrella", taps: 1, auto: true, pose: "reach", sound: playPop, wear: "umbrella", ask: "Schirm nehmen!" },
          { name: "open", taps: 1, pose: "cheer", sound: playWhoosh, beat: 1200, ask: "Schirm auf!", done: "Mein Schirm!" },
        ],
      },
      {
        wish: "hat",
        floor: 1,
        spot: 380,
        face: -1,
        pose: "reach",
        prop: "hat",
        ms: 300,
        sounds: [],
        ask: "Mein Regenhut!",
        done: "Am Haken!",
        tasks: [
          { name: "hat", taps: 1, auto: true, pose: "reach", sound: playPop, wear: "hat", ask: "Hut auf!" },
          { name: "mirror", taps: 1, spot: 480, face: -1, pose: "cheer", sound: playGiggle, ask: "Schau in den Spiegel!", done: "Fertig für den Regen!" },
        ],
      },
      {
        wish: "boat",
        floor: 2,
        spot: 640,
        face: 1,
        pose: "reach",
        prop: "paper",
        ms: 500,
        sounds: [[0, playRustle]],
        ask: "Mein Schiffchen!",
        done: "Erst falten.",
        tasks: [{ name: "fold", taps: 2, pose: "reach", sound: playRustle, hold: "boat", ask: "Falten!", done: "Ein Schiffchen!" }],
      },
      {
        wish: "rain",
        floor: 0,
        spot: 560,
        face: 1,
        pose: "jump",
        prop: "splash",
        ms: 2000,
        sounds: [
          [300, splash],
          [1300, splash],
        ],
        ask: "Ab in den Garten!",
        done: "Platsch! Platsch!",
        tasks: [
          { name: "jump", taps: 2, pose: "jump", sound: splash, beat: 1000, ask: "Hüpf in die Pfütze!" },
          { name: "sail", taps: 1, auto: true, spot: 470, face: 1, pose: "reach", sound: playPlop, hold: null, ask: "Das Schiffchen ins Wasser!" },
          { name: "puff", taps: 2, pose: "blow", sound: playPuff, ask: "Puste das Schiffchen!" },
          { name: "frog", taps: 1, auto: true, pose: "cheer", sound: croak, beat: 1000, ask: "Da ist ein Frosch!", done: "Quak!" },
        ],
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
