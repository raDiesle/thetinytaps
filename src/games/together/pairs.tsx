import type { ReactNode } from "react";
import { MASCOT_COLORS, type MascotKind, MascotHead } from "@/components/Mascot";
import type { Localized } from "@/lib/language";
import { playGiggle, playSplash } from "@/lib/realSounds";
import {
  playClick,
  playClonk,
  playCrackle,
  playCreak,
  playDing,
  playDoorbell,
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
import type { RoundKind } from "./levels";

// What belongs together, for "Was gehört zusammen?": things of the day and their partner (Z-03: toothbrush and
// toothpaste, door and key, pot and lid, flower and watering can, paper and crayon), and helpers with what they need
// (Z-13: fire fighter and hose, doctor and stethoscope, baker and rolls, hairdresser and scissors, postman and parcel),
// the helpers drawn as fox and bear grown-ups in their role. Each picture is a 200 × 200 box of layers, every layer its
// own small svg (drawn in the box's units) or the partner itself: what moves is a whole layer, by its transform or
// opacity (together.css), never a part inside an svg, so a phone repaints nothing while it plays.

/** Time to watch the two do what they are for (after the partner flew up) before the next round comes. */
export const WORK_MS = 3600;

/** Where a layer lies in the 200 × 200 box: x, y, width, height. */
export type Rect = [number, number, number, number];

/** One layer of a picture. */
export interface Layer {
  at: Rect;
  /** Its class: how it moves (`.pair-<id>.working .<cls>` in together.css), or whether it shows only while working. */
  cls: string;
  /** The drawing, in the box's units (the layer's viewBox is `at`). */
  draw?: ReactNode;
  /** The layer is the partner, drawn as on its plate. */
  tool?: true;
}

/** What belongs to the one above, as it lies on its plate below. */
export interface Partner {
  /** Its German name, for screen readers: "Zahnpasta". */
  name: string;
  /** With its article: „die Zahnpasta“. */
  the: string;
  /** With its article as an object: „die Zahnpasta“, „den Schlauch“. */
  acc: string;
  /** An emoji for it, where one shows it plainly … */
  emoji?: string;
  /** … else a drawing in a 100 × 100 box. */
  draw?: ReactNode;
}

export type PairId = "zahnbuerste" | "tuer" | "topf" | "blume" | "papier" | "feuerwehr" | "aerztin" | "baecker" | "friseurin" | "post";

/** The one above and what belongs to it. */
export interface Pair {
  id: PairId;
  kind: RoundKind;
  /** The German name of the one above, for screen readers: "Zahnbürste", "Ärztin". */
  name: string;
  /** With its article: „die Zahnbürste“. */
  the: string;
  /** After „gehört“, for "Was gehört zur Zahnbürste?". */
  toThe: string;
  partner: Partner;
  /** Back to front; one of them is the partner (`tool`), which shows only once it is there. */
  layers: Layer[];
  /** The sounds while the two do what they are for, each after so many ms. */
  sounds: [number, () => void][];
}

const OUT = "#5a4636";

/**
 * A fox or bear standing, drawn in a frame 100 wide and 140 high whose top left lies at `x`, `y`, scaled by `s`;
 * `coat` colours its body, `hat` (in the frame's units) sits on its head, `extra` lies on its body.
 */
function critter(fur: MascotKind, x: number, y: number, s: number, coat: string, hat?: ReactNode, extra?: ReactNode) {
  // A child is drawn smaller (`s`) and gets a child's bigger eyes.
  const small = s < 0.7;
  const paw = MASCOT_COLORS[fur].paw;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M20 140 C20 104 30 82 50 82 C70 82 80 104 80 140 Z" fill={coat} stroke={OUT} strokeWidth="3" />
      {extra}
      <g transform="translate(10 8.8) scale(0.8)">
        <MascotHead kind={fur} child={small} />
      </g>
      {hat}
      <circle cx="36" cy="104" r="8" fill={paw} stroke={OUT} strokeWidth="3" />
      <circle cx="64" cy="104" r="8" fill={paw} stroke={OUT} strokeWidth="3" />
    </g>
  );
}

/** A grown-up's layer: standing at the box's left, its paws (where what it needs lands) about at 52, 157. */
const GROWN_UP: Rect = [0, 56, 104, 140];
const grownUp = (fur: "fox" | "bear", coat: string, hat?: ReactNode, extra?: ReactNode) => critter(fur, 4, 58, 0.95, coat, hat, extra);

/** A child's layer at `x`: standing on the box's floor, 62 wide. */
const childAt = (x: number): Rect => [x, 100, 66, 96];
const child = (fur: "fox" | "bear", x: number, coat: string) => critter(fur, x + 2, 104, 0.62, coat);

const HEART = "M50 88 C20 65 5 48 5 30 C5 15 17 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C83 5 95 15 95 30 C95 48 80 65 50 88 Z";

/** Hearts (or one) floating up over a happy one: in the box's units, `at` as for a layer. */
const hearts = (at: Rect, count = 2) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <path
        key={i}
        d={HEART}
        fill="#ff5d73"
        stroke={OUT}
        strokeWidth="5"
        transform={`translate(${at[0] + i * (at[2] / count)} ${at[1] + (i % 2) * 8}) scale(${at[2] / count / 100})`}
      />
    ))}
  </>
);

/** A small sparkle at `x`, `y`. */
const sparkle = (x: number, y: number, r: number) => (
  <path
    key={`${x}-${y}`}
    d={`M${x} ${y - r} Q${x + r * 0.2} ${y - r * 0.2} ${x + r} ${y} Q${x + r * 0.2} ${y + r * 0.2} ${x} ${y + r} Q${x - r * 0.2} ${y + r * 0.2} ${x - r} ${y} Q${x - r * 0.2} ${y - r * 0.2} ${x} ${y - r} Z`}
    fill="#ffd43b"
    stroke={OUT}
    strokeWidth="2"
  />
);

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

/** The light behind the door, a bear grown-up waiting there; the bear child stands in its own layer to hop. */
const doorBack = (
  <>
    <rect x="34" y="18" width="132" height="176" fill="#8b5e3c" stroke={OUT} strokeWidth="3.5" />
    <rect x="40" y="24" width="120" height="170" fill="#ffe8a3" />
    <path d="M40 150 L160 150" stroke="#f4c86b" strokeWidth="4" />
    {critter("bear", 40, 86, 0.76, "#74c0fc")}
  </>
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

/** The ten pairs: five of the day, five helpers. Each partner belongs to its own one above only. */
export const PAIRS: Pair[] = [
  {
    id: "zahnbuerste",
    kind: "pair",
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
      { at: [104, 60, 90, 50], cls: "tg-sparkles", draw: [sparkle(116, 84, 9), sparkle(186, 74, 8), sparkle(150, 66, 6)] },
    ],
    sounds: [
      [500, playPuff],
      [900, playPop],
      [1700, playScrub],
      [2700, playTwinkle],
    ],
  },
  {
    id: "tuer",
    kind: "pair",
    name: "Tür",
    the: "die Tür",
    toThe: "zur Tür",
    partner: { name: "Schlüssel", the: "der Schlüssel", acc: "den Schlüssel", emoji: "🔑" },
    layers: [
      { at: [30, 14, 140, 184], cls: "tg-base", draw: doorBack },
      { at: childAt(104), cls: "tg-child", draw: child("bear", 104, "#ffd43b") },
      { at: [38, 22, 124, 174], cls: "tg-door", draw: door },
      { at: [128, 112, 40, 40], cls: "tg-tool", tool: true },
      { at: [114, 64, 60, 34], cls: "tg-hearts", draw: hearts([114, 64, 60, 34]) },
    ],
    sounds: [
      [200, playClick],
      [800, playClick],
      [1150, playCreak],
      [1900, playGiggle],
      [2700, playTwinkle],
    ],
  },
  {
    id: "topf",
    kind: "pair",
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
  {
    id: "blume",
    kind: "pair",
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
      { at: [56, 24, 92, 50], cls: "tg-sparkles", draw: [sparkle(64, 40, 8), sparkle(140, 34, 9), sparkle(126, 64, 6)] },
    ],
    sounds: [
      [400, playDrops],
      [1000, playDrops],
      [1700, playPop],
      [2200, playTwinkle],
    ],
  },
  {
    id: "papier",
    kind: "pair",
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
  {
    id: "feuerwehr",
    kind: "helper",
    name: "Feuerwehr",
    the: "die Feuerwehr",
    toThe: "zur Feuerwehr",
    partner: { name: "Schlauch", the: "der Schlauch", acc: "den Schlauch", draw: hose },
    layers: [
      { at: [140, 170, 58, 26], cls: "tg-base", draw: logs },
      { at: [146, 120, 46, 64], cls: "tg-fire", draw: fire },
      {
        at: GROWN_UP,
        cls: "tg-helper",
        draw: grownUp(
          "fox",
          "#2b3a55",
          <>
            <path d="M20 40 Q20 10 50 10 Q80 10 80 40 Z" fill="#e63946" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
            <path d="M12 40 L88 40" stroke={OUT} strokeWidth="10" strokeLinecap="round" />
            <path d="M12 40 L88 40" stroke="#e63946" strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="26" r="6" fill="#ffd166" stroke={OUT} strokeWidth="2.5" />
          </>,
          <path d="M23 118 L77 118 M22 128 L78 128" stroke="#ffd43b" strokeWidth="5" />,
        ),
      },
      {
        at: [92, 112, 64, 52],
        cls: "tg-spray",
        draw: (
          <>
            <path d="M96 136 Q126 104 156 150" stroke="#1c7ed6" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M96 136 Q126 104 156 150" stroke="#74c0fc" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="150" cy="158" r="3.5" fill="#74c0fc" />
            <circle cx="142" cy="152" r="3" fill="#74c0fc" />
          </>
        ),
      },
      { at: [56, 130, 44, 44], cls: "tg-tool", tool: true },
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
  {
    id: "aerztin",
    kind: "helper",
    name: "Ärztin",
    the: "die Ärztin",
    toThe: "zur Ärztin",
    partner: { name: "Hörrohr", the: "das Hörrohr", acc: "das Hörrohr", draw: stethoscope },
    layers: [
      {
        at: GROWN_UP,
        cls: "tg-helper",
        draw: grownUp(
          "bear",
          "#f8f9fa",
          <>
            <path d="M22 34 Q50 16 78 34" stroke="#495057" strokeWidth="4" fill="none" />
            <circle cx="50" cy="24" r="9" fill="#e9ecef" stroke={OUT} strokeWidth="3" />
            <circle cx="50" cy="24" r="3.5" fill="#adb5bd" />
          </>,
          <path d="M60 120 h12 M66 114 v12" stroke="#e63946" strokeWidth="4.5" strokeLinecap="round" />,
        ),
      },
      { at: childAt(124), cls: "tg-child", draw: child("fox", 124, "#69db7c") },
      { at: [78, 126, 44, 44], cls: "tg-tool", tool: true },
      {
        at: [140, 70, 34, 30],
        cls: "tg-heart",
        draw: <path d={HEART} fill="#ff5d73" stroke={OUT} strokeWidth="6" transform="translate(140 70) scale(0.34 0.32)" />,
      },
      { at: [120, 54, 70, 34], cls: "tg-hearts", draw: hearts([120, 54, 70, 34]) },
    ],
    sounds: [
      [500, playHeartbeat],
      [1500, playHeartbeat],
      [2500, playGiggle],
      [2800, playTwinkle],
    ],
  },
  {
    id: "baecker",
    kind: "helper",
    name: "Bäcker",
    the: "der Bäcker",
    toThe: "zum Bäcker",
    partner: { name: "Brötchen", the: "das Brötchen", acc: "das Brötchen", draw: roll },
    layers: [
      { at: [110, 78, 88, 118], cls: "tg-base", draw: oven },
      { at: [134, 140, 40, 44], cls: "tg-glow", draw: ovenGlow },
      {
        at: GROWN_UP,
        cls: "tg-helper",
        draw: grownUp(
          "fox",
          "#fff",
          <>
            <path d="M28 30 C12 30 12 6 32 9 C34 -4 66 -4 68 9 C88 6 88 30 72 30 Z" fill="#fff" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
            <rect x="28" y="24" width="44" height="12" rx="2" fill="#fff" stroke={OUT} strokeWidth="3" />
          </>,
          <path d="M36 96 L64 96 L68 136 L32 136 Z" fill="#f1f3f5" stroke={OUT} strokeWidth="2.5" />,
        ),
      },
      { at: [60, 136, 36, 36], cls: "tg-tool", tool: true },
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
  {
    id: "friseurin",
    kind: "helper",
    name: "Friseurin",
    the: "die Friseurin",
    toThe: "zur Friseurin",
    partner: { name: "Schere", the: "die Schere", acc: "die Schere", emoji: "✂️" },
    layers: [
      {
        at: GROWN_UP,
        cls: "tg-helper",
        draw: grownUp("bear", "#f7a1c4", undefined, <rect x="56" y="108" width="18" height="6" rx="2" fill="#6c757d" stroke={OUT} strokeWidth="2" />),
      },
      { at: childAt(122), cls: "tg-child", draw: child("fox", 122, "#74c0fc") },
      {
        at: [132, 84, 46, 38],
        cls: "tg-tuft",
        draw: (
          <path
            d="M136 120 L138 94 L146 110 L152 86 L158 108 L166 90 L168 112 L174 100 L172 122 Z"
            fill="#d9711f"
            stroke={OUT}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        ),
      },
      { at: [104, 86, 36, 36], cls: "tg-tool", tool: true },
      { at: [126, 60, 64, 40], cls: "tg-sparkles", draw: [sparkle(134, 84, 8), sparkle(180, 74, 9), sparkle(160, 66, 6)] },
    ],
    sounds: [
      [300, playSnap],
      [900, playSnap],
      [1300, playWhoosh],
      [2200, playGiggle],
      [2700, playTwinkle],
    ],
  },
  {
    id: "post",
    kind: "helper",
    name: "Postbote",
    the: "der Postbote",
    toThe: "zum Postboten",
    partner: { name: "Paket", the: "das Paket", acc: "das Paket", emoji: "📦" },
    layers: [
      {
        at: GROWN_UP,
        cls: "tg-helper",
        draw: grownUp(
          "fox",
          "#ffd43b",
          <>
            <path d="M22 34 Q22 12 50 12 Q78 12 78 34 Z" fill="#1d4e89" stroke={OUT} strokeWidth="3" strokeLinejoin="round" />
            <path d="M48 34 L90 38" stroke={OUT} strokeWidth="9" strokeLinecap="round" />
            <path d="M48 34 L90 38" stroke="#1d4e89" strokeWidth="5" strokeLinecap="round" />
          </>,
          <path d="M32 86 L74 138" stroke="#8b5e3c" strokeWidth="6" />,
        ),
      },
      { at: childAt(128), cls: "tg-child", draw: child("bear", 128, "#ff8787") },
      { at: [60, 128, 38, 38], cls: "tg-tool", tool: true },
      { at: [126, 62, 68, 36], cls: "tg-hearts", draw: hearts([126, 62, 68, 36]) },
    ],
    sounds: [
      [0, playDoorbell],
      [700, playWhoosh],
      [1500, playPop],
      [1800, playGiggle],
      [2700, playTwinkle],
    ],
  },
];

/** The pairs of one kind. */
export const pairsOf = (kind: RoundKind) => PAIRS.filter((p) => p.kind === kind);

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** What "Was gehört zusammen?" says, in one language (only German so far: its translations wait to be asked for). */
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

/** The texts of "Was gehört zusammen?" by app language: `pick(TOGETHER_TEXTS, language.id)`. */
export const TOGETHER_TEXTS: Localized<TogetherTexts> = {
  de: {
    name: (p) => p.name,
    partner: (p) => p.partner.name,
    question: (p) => (p.kind === "pair" ? `Was gehört ${p.toThe}?` : `Was braucht ${p.the}?`),
    right: (p) => (p.kind === "pair" ? `${capitalize(p.partner.the)} gehört ${p.toThe}. Toll!` : `${capitalize(p.the)} braucht ${p.partner.acc}. Toll!`),
    belongs: (p) => (p.kind === "pair" ? `${capitalize(p.partner.the)} gehört ${p.toThe}!` : `${capitalize(p.the)} braucht ${p.partner.acc}!`),
  },
};
