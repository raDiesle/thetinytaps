import type { CSSProperties, ReactNode } from "react";
import { Mascot, type MascotKind } from "@/components/Mascot";
import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";
import { playGiggle, playSplash } from "@/lib/realSounds";
import {
  playClick,
  playClonk,
  playCrackle,
  playCreak,
  playDing,
  playDrops,
  playHeartbeat,
  playHiss,
  playPop,
  playPuff,
  playRattle,
  playScrub,
  playSnap,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { BACKDROPS, type BackdropId } from "./backdrops";
import { Helper, type Outfit } from "./Helper";
import type { RoundKind } from "./levels";
import { PAINTED } from "./painted";
import { type Act, fromPainted, fromScene, type Prop } from "./scene";
import { SCENES } from "./scenes";
import type { TopicId } from "./topics";

// What belongs together, for "Was gehört zusammen?": things of the day and their partner (Z-03), and helpers with
// what they need (Z-13), the helpers drawn as fox and bear grown-ups in their role. Each picture is a 300 × 200 box
// of layers, every layer its own small svg (drawn in the box's units) or the partner itself: what moves is a whole
// layer, by its transform or opacity (together.css), never a part inside an svg, so a phone repaints nothing while it
// plays. The first nine pairs here are handmade, each with motions of its own; all the others are scenes written as
// data (scene.tsx, `scenes/`), with a backdrop and a few motions every scene shares.

/** Time to watch the two do what they are for (after the partner flew up) before the next round comes. */
export const WORK_MS = 3600;

/** Where a layer lies in the 300 × 200 box: x, y, width, height. */
export type Rect = [number, number, number, number];

/** One layer of a picture. */
export interface Layer {
  at: Rect;
  /** Its class: how it moves (`.pair-<id>.working .<cls>` in together.css), or whether it shows only while working. */
  cls: string;
  /** A drawing in the box's units (the layer's viewBox is `at`) … */
  draw?: ReactNode;
  /** … or an HTML layer's content filling it (a figure with its own svg) … */
  html?: ReactNode;
  /** … or an emoji filling it (the thing above of a scene), mirrored with `flip` … */
  emoji?: string;
  flip?: boolean;
  /** … or emoji placed in the box for context … */
  props?: Prop[];
  /** … or the partner, drawn as on its plate. */
  tool?: true;
  /** Values its motion reads (`--from-x`). */
  style?: CSSProperties;
}

/** What belongs to the one above, as it lies on its plate below. */
export interface Partner {
  /** Its German name, for screen readers and the line under its plate: "Zahnpasta". */
  name: string;
  /** With its article: „die Zahnpasta“. */
  the: string;
  /** With its article as an object: „die Zahnpasta“, „den Schlauch“. */
  acc: string;
  /** Said in the plural („die Socken gehören …“). */
  plural?: true;
  /** An emoji for it, where one shows it plainly … */
  emoji?: string;
  /** … or a drawing in a 100 × 100 box … */
  draw?: ReactNode;
  /** … or a painted picture: a painted pair's `part`, by the pair's id in `bilder/teile/` (`partImage`). */
  image?: string;
}

/** The one above and what belongs to it. */
export interface Pair {
  /** Unique, lower case German without umlauts. */
  id: string;
  kind: RoundKind;
  topic: TopicId;
  /** The German name of the one above, for screen readers: "Zahnbürste", "Ärztin". */
  name: string;
  /** With its article: „die Zahnbürste“. */
  the: string;
  /** After „gehört“, for "Was gehört zur Zahnbürste?". */
  toThe: string;
  partner: Partner;
  /** Back to front; one of them is the partner (`tool`), which shows only once it is there. */
  layers: Layer[];
  /** A painted pair's two frames, before and after (`painted/`, `framesOf`), shown instead of layers. */
  frames?: [string, string];
  /** A scene's shared motion (scene.tsx); a handmade pair has none and moves by its own rules. */
  act?: Act;
  /** A scene's time from the partner's arrival to its motion, in ms (`--t`). */
  start?: number;
  /** The sounds while the two do what they are for, each after so many ms. */
  sounds: [number, () => void][];
  /** Pairs whose partner fits this one too (the sponge of the bathtub fits the shower): never dealt together with it. */
  alsoFits?: string[];
}

const OUT = "#5a4636";

/** A grown-up helper's layer: standing at the left of the handmade 200 × 200 picture, its paw (where what it needs lands) at about 95, 151. */
const GROWN_UP: Rect = [0, 40, 104, 156];
const grownUp = (kind: MascotKind, outfit: Outfit, lashes?: true): Layer => ({
  at: GROWN_UP,
  cls: "tg-helper",
  html: <Helper kind={kind} outfit={outfit} lashes={lashes} />,
});

/** A fox or bear child (the shared `Mascot`) standing at `x`, its feet on the floor (or lower down at `y`, sitting). */
const childLayer = (kind: MascotKind, x: number, y = 100): Layer => ({ at: [x, y, 64, 96], cls: "tg-child", html: <Mascot kind={kind} child /> });

const HEART = "M50 88 C20 65 5 48 5 30 C5 15 17 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C83 5 95 15 95 30 C95 48 80 65 50 88 Z";

// ---------- The partners on their plates (100 × 100) ----------

const toothpaste = (
  <>
    <path d="M8 34 L64 26 L64 74 L8 66 Z" fill="#fff" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M8 32 L8 68" stroke={OUT} strokeWidth="7" strokeLinecap="round" />
    <path d="M28 31 L28 69 M40 29.5 L40 70.5" stroke="#e63946" strokeWidth="6" />
    <rect x="64" y="38" width="12" height="24" fill="#fff" stroke={OUT} strokeWidth="3.5" />
    <rect x="76" y="35" width="16" height="30" rx="4" fill="#4dabf7" stroke={OUT} strokeWidth="3.5" />
  </>
);

const lid = (
  <>
    <path d="M6 62 Q50 26 94 62 Z" fill="#ced4da" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
    <ellipse cx="50" cy="62" rx="46" ry="10" fill="#adb5bd" stroke={OUT} strokeWidth="3.5" />
    <rect x="40" y="30" width="20" height="12" rx="5" fill={OUT} />
    <path d="M24 50 Q38 40 52 38" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
  </>
);

const wateringCan = (
  <>
    <path d="M26 42 Q40 14 56 42" stroke="#2f9e44" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M60 56 L90 34" stroke="#40c057" strokeWidth="9" strokeLinecap="round" />
    <path d="M84 26 L98 40 L92 44 L80 32 Z" fill="#2f9e44" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M16 42 L66 42 L62 86 L20 86 Z" fill="#40c057" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M24 52 L58 52" stroke="#8ce99a" strokeWidth="4" strokeLinecap="round" />
  </>
);

const hose = (
  <>
    <circle cx="40" cy="58" r="30" fill="none" stroke={OUT} strokeWidth="14" />
    <circle cx="40" cy="58" r="30" fill="none" stroke="#e63946" strokeWidth="9" />
    <circle cx="40" cy="58" r="14" fill="none" stroke={OUT} strokeWidth="14" />
    <circle cx="40" cy="58" r="14" fill="none" stroke="#e63946" strokeWidth="9" />
    <path d="M70 58 Q76 40 84 32" stroke={OUT} strokeWidth="14" fill="none" strokeLinecap="round" />
    <path d="M70 58 Q76 40 84 32" stroke="#e63946" strokeWidth="9" fill="none" strokeLinecap="round" />
    <path d="M80 28 L90 14 L100 22 L90 36 Z" fill="#b0b7c3" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
  </>
);

const stethoscope = (
  <>
    <path d="M28 10 Q22 42 50 54 Q78 42 72 10 M50 54 Q50 76 64 80" stroke={OUT} strokeWidth="11" fill="none" strokeLinecap="round" />
    <path d="M28 10 Q22 42 50 54 Q78 42 72 10 M50 54 Q50 76 64 80" stroke="#364fc7" strokeWidth="6" fill="none" strokeLinecap="round" />
    <circle cx="28" cy="10" r="6" fill="#adb5bd" stroke={OUT} strokeWidth="3" />
    <circle cx="72" cy="10" r="6" fill="#adb5bd" stroke={OUT} strokeWidth="3" />
    <circle cx="74" cy="80" r="15" fill="#dee2e6" stroke={OUT} strokeWidth="3.5" />
    <circle cx="74" cy="80" r="7" fill="#868e96" />
  </>
);

const roll = (
  <>
    <ellipse cx="50" cy="56" rx="42" ry="28" fill="#e0a458" stroke={OUT} strokeWidth="3.5" />
    <path d="M24 44 Q50 30 76 44" stroke="#f4c98a" strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M30 58 Q50 46 70 58" stroke="#b5793a" strokeWidth="4" fill="none" strokeLinecap="round" />
  </>
);

// ---------- The pictures ----------

/** The frame and the warm light behind the door; the bear family waiting there stand in layers of their own. */
const doorBack = (
  <>
    <rect x="34" y="18" width="132" height="176" fill="#8b5e3c" stroke={OUT} strokeWidth="3.5" />
    <rect x="40" y="24" width="120" height="170" fill="#ffe8a3" />
    <path d="M40 150 L160 150" stroke="#f4c86b" strokeWidth="4" />
  </>
);

/** The salon chair the fox child sits in, in front of it: its back hides the child's body, and it stands on one foot. */
const salonChair = (
  <>
    <rect x="150" y="174" width="9" height="16" fill="#adb5bd" stroke={OUT} strokeWidth="2.5" />
    <ellipse cx="154" cy="192" rx="24" ry="5" fill="#868e96" stroke={OUT} strokeWidth="2.5" />
    <rect x="113" y="154" width="15" height="10" rx="4" fill="#343a40" stroke={OUT} strokeWidth="2.5" />
    <rect x="180" y="154" width="15" height="10" rx="4" fill="#343a40" stroke={OUT} strokeWidth="2.5" />
    <path d="M122 140 Q154 132 186 140 L184 176 L124 176 Z" fill="#495057" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
    <path d="M132 146 Q154 140 176 146" stroke="#868e96" strokeWidth="3" fill="none" strokeLinecap="round" />
  </>
);

/** The fox child's wild locks on top of its head, which the scissors cut. */
const locks = (
  <g fill="#ea7a32" stroke={OUT} strokeWidth="2.2" strokeLinejoin="round">
    <path d="M146 113 C139 105 141 97 146 93 C148 100 151 106 152 113 Z" />
    <path d="M151 113 C149 102 153 94 160 90 C158 98 159 106 158 113 Z" />
    <path d="M157 113 C159 104 164 99 170 99 C166 104 164 109 162 113 Z" />
  </g>
);

const door = (
  <>
    <rect x="40" y="24" width="120" height="170" rx="3" fill="#b5651d" stroke={OUT} strokeWidth="3.5" />
    <rect x="54" y="38" width="92" height="60" rx="6" fill="#c97a32" stroke={OUT} strokeWidth="3" />
    <rect x="54" y="112" width="92" height="66" rx="6" fill="#c97a32" stroke={OUT} strokeWidth="3" />
    <circle cx="146" cy="108" r="6" fill="#ffd166" stroke={OUT} strokeWidth="3" />
    <rect x="140" y="120" width="12" height="26" rx="6" fill="#ffd166" stroke={OUT} strokeWidth="3" />
    <circle cx="146" cy="129" r="3" fill={OUT} />
    <path d="M146 131 L146 139" stroke={OUT} strokeWidth="3" strokeLinecap="round" />
  </>
);

const toothbrush = (
  <>
    <path d="M22 146 L122 140" stroke={OUT} strokeWidth="18" strokeLinecap="round" />
    <path d="M22 146 L122 140" stroke="#4dabf7" strokeWidth="12" strokeLinecap="round" />
    <rect x="118" y="130" width="64" height="16" rx="8" fill="#4dabf7" stroke={OUT} strokeWidth="3" />
    <rect x="126" y="114" width="50" height="18" rx="3" fill="#fff" stroke={OUT} strokeWidth="3" />
    <path d="M136 116 V130 M146 116 V130 M156 116 V130 M166 116 V130" stroke="#a5d8ff" strokeWidth="3" />
  </>
);

const pot = (
  <>
    <rect x="16" y="168" width="168" height="24" rx="6" fill="#adb5bd" stroke={OUT} strokeWidth="3.5" />
    <path d="M60 168 Q70 160 80 168 M120 168 Q130 160 140 168" stroke="#ff8c42" strokeWidth="4" fill="none" />
    <path d="M44 108 L28 102 M156 108 L172 102" stroke={OUT} strokeWidth="9" strokeLinecap="round" />
    <path d="M46 96 L154 96 L148 166 L52 166 Z" fill="#e63946" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
    <ellipse cx="100" cy="95" rx="56" ry="8" fill="#f4a261" stroke={OUT} strokeWidth="3.5" />
    <path d="M64 124 Q100 132 136 124" stroke="#ff8787" strokeWidth="5" fill="none" strokeLinecap="round" />
  </>
);

const steam = (
  <>
    {[72, 100, 128].map((x) => (
      <path key={x} d={`M${x} 84 Q${x - 9} 72 ${x} 60 Q${x + 9} 48 ${x} 36`} stroke="#ced4da" strokeWidth="6" fill="none" strokeLinecap="round" />
    ))}
  </>
);

const flowerPot = (
  <>
    <path d="M72 150 L128 150 L120 194 L80 194 Z" fill="#d9822b" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
    <rect x="64" y="142" width="72" height="14" rx="5" fill="#e8964a" stroke={OUT} strokeWidth="3.5" />
  </>
);

/** A flower of five petals round a yellow middle, at `x`, `y`. */
const flowerHead = (x: number, y: number, r: number, petal: string) => (
  <>
    {[0, 72, 144, 216, 288].map((deg) => (
      <ellipse key={deg} cx={x} cy={y - r} rx={r * 0.55} ry={r * 0.8} fill={petal} stroke={OUT} strokeWidth="3" transform={`rotate(${deg} ${x} ${y})`} />
    ))}
    <circle cx={x} cy={y} r={r * 0.5} fill="#ffd43b" stroke={OUT} strokeWidth="3" />
  </>
);

const droopingFlower = (
  <>
    <path d="M100 144 C98 112 112 92 132 104" stroke="#69a84f" strokeWidth="7" fill="none" strokeLinecap="round" />
    <path d="M100 130 Q80 128 74 140 Q90 142 100 130 Z" fill="#8bb06f" stroke={OUT} strokeWidth="3" />
    {flowerHead(136, 120, 13, "#e7b8c8")}
  </>
);

const uprightFlower = (
  <>
    <path d="M100 144 L100 70" stroke="#4caf50" strokeWidth="7" strokeLinecap="round" />
    <path d="M100 124 Q76 112 68 126 Q86 136 100 124 Z M100 104 Q124 92 132 106 Q114 116 100 104 Z" fill="#66bb6a" stroke={OUT} strokeWidth="3" />
    {flowerHead(100, 58, 18, "#ff6b9a")}
  </>
);

const paper = (
  <>
    <rect x="34" y="44" width="140" height="140" rx="4" fill="#dee2e6" />
    <rect x="28" y="38" width="140" height="140" rx="4" fill="#fff" stroke={OUT} strokeWidth="3.5" />
  </>
);

const HEART_LEFT = "M98 160 C62 132 54 110 60 94 C66 78 90 76 98 96";
const HEART_RIGHT = "M98 96 C106 76 130 78 136 94 C142 110 134 132 98 160";
const HEART_WHOLE = `${HEART_LEFT} ${HEART_RIGHT.slice(HEART_RIGHT.indexOf("C"))} Z`;

const oven = (
  <>
    <path d="M112 192 L112 126 Q154 80 196 126 L196 192 Z" fill="#c0603a" stroke={OUT} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M118 140 H190 M116 160 H192 M134 120 V140 M174 120 V140 M124 140 V160 M184 140 V160" stroke="#9c4a2a" strokeWidth="3" />
    <path d="M134 184 L134 160 Q154 140 174 160 L174 184 Z" fill="#3b2a20" stroke={OUT} strokeWidth="3" />
  </>
);

const ovenGlow = (
  <>
    <path d="M134 184 L134 160 Q154 140 174 160 L174 184 Z" fill="#ff8c42" />
    <path d="M140 184 L140 164 Q154 150 168 164 L168 184 Z" fill="#ffd43b" />
  </>
);

/** The logs stay when the fire is out. */
const logs = (
  <>
    <path d="M148 190 L192 178 M146 178 L190 190" stroke={OUT} strokeWidth="10" strokeLinecap="round" />
    <path d="M148 190 L192 178 M146 178 L190 190" stroke="#8b5e3c" strokeWidth="6" strokeLinecap="round" />
  </>
);

const fire = (
  <>
    <path
      d="M170 180 C152 176 150 154 160 142 C162 154 168 156 170 146 C172 136 168 130 172 126 C186 140 192 160 186 172 C183 178 176 182 170 180 Z"
      fill="#ff8c42"
      stroke="#e63946"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M170 178 C162 174 162 162 168 156 C170 164 174 160 176 154 C182 164 182 174 170 178 Z" fill="#ffd43b" />
  </>
);

const puff = (x: number, y: number, r: number) => (
  <g key={`${x}-${y}`} fill="#e9ecef" stroke="#adb5bd" strokeWidth="3">
    <circle cx={x - r * 0.6} cy={y} r={r * 0.7} />
    <circle cx={x + r * 0.6} cy={y} r={r * 0.7} />
    <circle cx={x} cy={y - r * 0.5} r={r * 0.8} />
  </g>
);

/**
 * A handmade pair, drawn in a 200 × 200 picture, placed in the middle of the wide box with its backdrop round it
 * (each layer moved 50 to the right, its drawing with it).
 */
function handmade(pair: Omit<Pair, "layers"> & { layers: Layer[] }, backdrop: BackdropId): Pair {
  const shifted = pair.layers.map(
    (l): Layer => ({ ...l, at: [l.at[0] + 50, l.at[1], l.at[2], l.at[3]], draw: l.draw && <g transform="translate(50 0)">{l.draw}</g> }),
  );
  return { ...pair, layers: [{ at: [0, 0, 300, 200], cls: "tg-backdrop", draw: BACKDROPS[backdrop]() }, ...shifted] };
}

/** The handmade pairs: four of the day, four helpers, each with motions of its own (together.css). */
const HANDMADE: Pair[] = [
  handmade(
    {
      id: "zahnbuerste",
      kind: "pair",
      topic: "bad",
      name: "Zahnbürste",
      the: "die Zahnbürste",
      toThe: "zur Zahnbürste",
      partner: { name: "Zahnpasta", the: "die Zahnpasta", acc: "die Zahnpasta", draw: toothpaste },
      layers: [
        { at: [0, 0, 200, 200], cls: "tg-base", draw: <rect x="8" y="152" width="184" height="16" rx="4" fill="#e9ecef" stroke={OUT} strokeWidth="3.5" /> },
        { at: [12, 108, 176, 52], cls: "tg-brush", draw: toothbrush },
        {
          at: [126, 94, 54, 24],
          cls: "tg-paste",
          draw: (
            <>
              <path d="M128 116 Q130 98 144 104 Q152 92 160 104 Q172 96 178 114 Z" fill="#fff" stroke="#74c0fc" strokeWidth="3.5" strokeLinejoin="round" />
              <path d="M136 110 Q146 102 156 108 Q164 104 170 110" stroke="#e63946" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </>
          ),
        },
        { at: [112, 22, 64, 64], cls: "tg-tool", tool: true },
      ],
      sounds: [
        [500, playPuff],
        [900, playPop],
        [1700, playScrub],
        [2700, playTwinkle],
      ],
    },
    "bad",
  ),
  handmade(
    {
      id: "tuer",
      kind: "pair",
      topic: "zuhause",
      name: "Tür",
      the: "die Tür",
      toThe: "zur Tür",
      partner: { name: "Schlüssel", the: "der Schlüssel", acc: "den Schlüssel", emoji: "🔑" },
      layers: [
        { at: [30, 14, 140, 184], cls: "tg-base", draw: doorBack },
        { at: [44, 80, 76, 114], cls: "tg-base-grown", html: <Mascot kind="bear" /> },
        childLayer("bear", 102),
        { at: [38, 22, 124, 174], cls: "tg-door", draw: door },
        { at: [128, 112, 40, 40], cls: "tg-tool", tool: true },
      ],
      sounds: [
        [200, playClick],
        [800, playClick],
        [1150, playCreak],
        [1900, playGiggle],
        [2700, playTwinkle],
      ],
    },
    "hausfront",
  ),
  handmade(
    {
      id: "topf",
      kind: "pair",
      topic: "kueche",
      name: "Topf",
      the: "der Topf",
      toThe: "zum Topf",
      partner: { name: "Deckel", the: "der Deckel", acc: "den Deckel", draw: lid },
      layers: [
        { at: [0, 0, 200, 200], cls: "tg-base", draw: pot },
        { at: [56, 30, 88, 60], cls: "tg-steam", draw: steam },
        { at: [40, 18, 120, 120], cls: "tg-tool", tool: true },
        { at: [10, 54, 180, 40], cls: "tg-puffs", draw: [puff(26, 80, 12), puff(174, 80, 12)] },
      ],
      sounds: [
        [0, playClonk],
        [900, playRattle],
        [1100, playPuff],
        [1800, playRattle],
        [2700, playTwinkle],
      ],
    },
    "kueche",
  ),
  handmade(
    {
      id: "blume",
      kind: "pair",
      topic: "garten",
      name: "Blume",
      the: "die Blume",
      toThe: "zur Blume",
      partner: { name: "Gießkanne", the: "die Gießkanne", acc: "die Gießkanne", draw: wateringCan },
      layers: [
        { at: [60, 138, 80, 60], cls: "tg-base", draw: flowerPot },
        { at: [64, 84, 94, 64], cls: "tg-droop", draw: droopingFlower },
        { at: [60, 30, 80, 118], cls: "tg-upright", draw: uprightFlower },
        {
          at: [104, 60, 36, 40],
          cls: "tg-drops",
          draw: [0, 1, 2].map((i) => <ellipse key={i} cx={110 + i * 10} cy={66 + (i % 2) * 14} rx="4" ry="6" fill="#4dabf7" stroke={OUT} strokeWidth="2" />),
        },
        { at: [16, 4, 96, 96], cls: "tg-tool", tool: true },
      ],
      sounds: [
        [400, playDrops],
        [1000, playDrops],
        [1700, playPop],
        [2200, playTwinkle],
      ],
    },
    "fensterbank",
  ),
  handmade(
    {
      id: "papier",
      kind: "pair",
      topic: "spielen",
      name: "Papier",
      the: "das Papier",
      toThe: "zum Papier",
      partner: { name: "Stift", the: "der Stift", acc: "den Stift", emoji: "🖍️" },
      layers: [
        { at: [0, 0, 200, 200], cls: "tg-base", draw: paper },
        { at: [54, 72, 88, 92], cls: "tg-line1", draw: <path d={HEART_LEFT} stroke="#e63946" strokeWidth="7" fill="none" strokeLinecap="round" /> },
        { at: [54, 72, 88, 92], cls: "tg-line2", draw: <path d={HEART_RIGHT} stroke="#e63946" strokeWidth="7" fill="none" strokeLinecap="round" /> },
        { at: [54, 72, 88, 92], cls: "tg-fill", draw: <path d={HEART_WHOLE} fill="#ff8787" opacity="0.7" /> },
        { at: [80, 52, 40, 40], cls: "tg-tool", tool: true },
      ],
      sounds: [
        [300, playScrub],
        [1100, playScrub],
        [2000, playPop],
        [2400, playTwinkle],
      ],
    },
    "maltisch",
  ),
  handmade(
    {
      id: "feuerwehr",
      kind: "helper",
      topic: "rettung",
      name: "Feuerwehr",
      the: "die Feuerwehr",
      toThe: "zur Feuerwehr",
      partner: { name: "Schlauch", the: "der Schlauch", acc: "den Schlauch", draw: hose },
      layers: [
        { at: [140, 170, 58, 26], cls: "tg-base", draw: logs },
        { at: [146, 120, 46, 64], cls: "tg-fire", draw: fire },
        grownUp("fox", { coat: "#2b3a55", hat: "helmet", detail: "stripes" }),
        {
          at: [108, 112, 56, 52],
          cls: "tg-spray",
          draw: (
            <>
              <path d="M112 134 Q136 104 158 150" stroke="#1c7ed6" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M112 134 Q136 104 158 150" stroke="#74c0fc" strokeWidth="5" fill="none" strokeLinecap="round" />
              <circle cx="152" cy="158" r="3.5" fill="#74c0fc" />
              <circle cx="144" cy="152" r="3" fill="#74c0fc" />
            </>
          ),
        },
        { at: [74, 126, 44, 44], cls: "tg-tool", tool: true },
        { at: [140, 90, 50, 44], cls: "tg-smoke", draw: [puff(160, 118, 14), puff(176, 102, 10)] },
      ],
      sounds: [
        [0, playCrackle],
        [300, playWhoosh],
        [500, playSplash],
        [1500, playHiss],
        [2700, playTwinkle],
      ],
    },
    "feuer",
  ),
  handmade(
    {
      id: "aerztin",
      kind: "helper",
      topic: "gesundheit",
      name: "Ärztin",
      the: "die Ärztin",
      toThe: "zur Ärztin",
      partner: { name: "Hörrohr", the: "das Hörrohr", acc: "das Hörrohr", draw: stethoscope },
      layers: [
        grownUp("bear", { coat: "#f8f9fa", detail: "cross" }, true),
        childLayer("fox", 124),
        { at: [78, 126, 44, 44], cls: "tg-tool", tool: true },
        {
          at: [140, 70, 34, 30],
          cls: "tg-heart",
          draw: <path d={HEART} fill="#ff5d73" stroke={OUT} strokeWidth="6" transform="translate(140 70) scale(0.34 0.32)" />,
        },
      ],
      sounds: [
        [500, playHeartbeat],
        [1500, playHeartbeat],
        [2500, playGiggle],
        [2800, playTwinkle],
      ],
    },
    "praxis",
  ),
  handmade(
    {
      id: "baecker",
      kind: "helper",
      topic: "laden",
      name: "Bäcker",
      the: "der Bäcker",
      toThe: "zum Bäcker",
      partner: { name: "Brötchen", the: "das Brötchen", acc: "das Brötchen", draw: roll },
      layers: [
        { at: [110, 78, 88, 118], cls: "tg-base", draw: oven },
        { at: [134, 140, 40, 44], cls: "tg-glow", draw: ovenGlow },
        grownUp("fox", { coat: "#fff", hat: "chef", detail: "buttons", detailColor: "#dee2e6" }),
        { at: [78, 132, 36, 36], cls: "tg-tool", tool: true },
        {
          at: [116, 168, 76, 28],
          cls: "tg-tray",
          draw: (
            <>
              <rect x="118" y="186" width="72" height="8" rx="3" fill="#868e96" stroke={OUT} strokeWidth="3" />
              {[134, 154, 174].map((x) => (
                <g key={x}>
                  <ellipse cx={x} cy="178" rx="11" ry="8" fill="#c97a32" stroke={OUT} strokeWidth="2.5" />
                  <path d={`M${x - 5} 176 Q${x} 172 ${x + 5} 176`} stroke="#8b5e3c" strokeWidth="2" fill="none" />
                </g>
              ))}
            </>
          ),
        },
        {
          at: [120, 112, 70, 50],
          cls: "tg-smoke",
          draw: [0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${136 + i * 18} 160 Q${130 + i * 18} 148 ${136 + i * 18} 136 Q${142 + i * 18} 126 ${136 + i * 18} 116`}
              stroke="#ced4da"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
          )),
        },
      ],
      sounds: [
        [300, playWhoosh],
        [900, playCrackle],
        [2100, playDing],
        [2500, playPop],
        [2900, playTwinkle],
      ],
    },
    "baeckerei",
  ),
  handmade(
    {
      id: "friseurin",
      kind: "helper",
      topic: "berufe",
      name: "Friseurin",
      the: "die Friseurin",
      toThe: "zur Friseurin",
      partner: { name: "Schere", the: "die Schere", acc: "die Schere", emoji: "✂️" },
      layers: [
        grownUp("bear", { coat: "#f7a1c4", detail: "apron", detailColor: "#495057" }, true),
        // The chair stands behind the child sitting on it.
        { at: [112, 130, 84, 66], cls: "tg-base", draw: salonChair },
        childLayer("fox", 122, 92),
        { at: [138, 88, 34, 27], cls: "tg-tuft", draw: locks },
        { at: [120, 84, 32, 32], cls: "tg-tool", tool: true },
      ],
      sounds: [
        [300, playSnap],
        [900, playSnap],
        [1300, playWhoosh],
        [2200, playGiggle],
        [2700, playTwinkle],
      ],
    },
    "salon",
  ),
];

/** Every pair: the handmade ones, the scenes (`scenes/`) and the painted pairs whose pictures are made (`painted/`). Each partner belongs to its own one above only. */
export const PAIRS: Pair[] = [...HANDMADE, ...SCENES.map(fromScene), ...PAINTED.flatMap((p) => fromPainted(p) ?? [])];

/** The pairs of one kind. */
export const pairsOf = (kind: RoundKind) => PAIRS.filter((p) => p.kind === kind);

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** What "Was gehört zusammen?" says, in one language. */
export interface TogetherTexts {
  /** The one above, for screen readers: "Zahnbürste". */
  name: (p: Pair) => string;
  /** Its partner, for screen readers: "Zahnpasta". */
  partner: (p: Pair) => string;
  /** The question: "Was gehört zur Zahnbürste?", "Was braucht die Ärztin?". */
  question: (p: Pair) => string;
  /** The right pick: "Die Zahnpasta gehört zur Zahnbürste. Toll!". */
  right: (p: Pair) => string;
  /** A wrong pick, while the one it belongs to pops up: "Der Schlüssel gehört zur Tür!". */
  belongs: (p: Pair) => string;
}

/** What belongs to what, in German: „Die Zahnpasta gehört zur Zahnbürste“, „Die Socken gehören zum Schuh“, „Die Ärztin braucht das Hörrohr“. */
const GERMAN_SAYS = (p: Pair) =>
  p.kind === "pair" ? `${capitalize(p.partner.the)} ${p.partner.plural ? "gehören" : "gehört"} ${p.toThe}` : `${capitalize(p.the)} braucht ${p.partner.acc}`;

const GERMAN_TEXTS: TogetherTexts = {
  name: (p) => p.name,
  partner: (p) => p.partner.name,
  question: (p) => (p.kind === "pair" ? `Was gehört ${p.toThe}?` : `Was braucht ${p.the}?`),
  right: (p) => `${GERMAN_SAYS(p)}. Toll!`,
  belongs: (p) => `${GERMAN_SAYS(p)}!`,
};

/**
 * One pair in another language (`content.<lang>.ts`), written out sentence by sentence rather than built from words:
 * there are only a few translated, and each language's grammar (cases, the partner's gender in its verb) is then plain to see.
 */
export interface PairTranslation {
  /** The one above, for screen readers. */
  name: string;
  /** Its partner, for screen readers. */
  partner: string;
  /** The question, as `TogetherTexts.question`. */
  question: string;
  /** The right pick, with the praise, as `TogetherTexts.right`. */
  right: string;
  /** The partner belongs to the one above, said when it was picked wrongly, as `TogetherTexts.belongs`. */
  belongs: string;
}

/** A language's sentences, every pair's; one without an entry is said in German. */
export type TogetherTranslation = Partial<Record<string, PairTranslation>>;

/** A language's texts from its sentences, German where a pair has none. */
const textsOf = (sentences: TogetherTranslation): TogetherTexts => ({
  name: (p) => sentences[p.id]?.name ?? GERMAN_TEXTS.name(p),
  partner: (p) => sentences[p.id]?.partner ?? GERMAN_TEXTS.partner(p),
  question: (p) => sentences[p.id]?.question ?? GERMAN_TEXTS.question(p),
  right: (p) => sentences[p.id]?.right ?? GERMAN_TEXTS.right(p),
  belongs: (p) => sentences[p.id]?.belongs ?? GERMAN_TEXTS.belongs(p),
});

/** Each language's sentences, filled as the language's texts load (`src/content/texts/texts-<lang>.ts`). */
export const TOGETHER_TRANSLATIONS = byLanguage((texts) => texts.together);

/** The texts of "Was gehört zusammen?" by app language: `pick(TOGETHER_TEXTS, language.id)`. */
export const TOGETHER_TEXTS: Localized<TogetherTexts> = byLanguage((texts) => texts.together && textsOf(texts.together), GERMAN_TEXTS);
