import type { ReactNode } from "react";
import {
  playBlub,
  playCrack,
  playHiss,
  playHop,
  playKnock,
  playLeaves,
  playPlop,
  playPop,
  playRustle,
  playSwirl,
  playThump,
  playTrill,
  playTwinkle,
  playWhoosh,
} from "@/lib/sfx";
import { playBuzz, playCroak, playSplash, playTweet } from "@/lib/realSounds";
import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";

// Something small and what it becomes, for "Was wird aus mir?" (Z-12): caterpillar and butterfly, egg and chick,
// seed and sunflower, tadpole and frog, acorn and tree, bulb and tulip, pumpkin seed and pumpkin, coconut and palm,
// bud and rose; the eggs of the turtle, crocodile, dinosaur, penguin, snake and fish, the bee's larva, and the seeds of
// carrot, maize, dandelion and strawberry. The small one is drawn in a 200 × 200 box, standing on its bottom edge, in
// two layers: `back` behind what it becomes (an emoji, as on the plates below) and `front` before it (the egg's lower
// shell and the nest, the soil, the pot). The parts with an `ap-grow-…` class move once the box is `.growing`
// (animals.css): the caterpillar climbs up and spins itself in, the eggs wobble and crack (`crackingEgg`), the snake's
// soft egg bulges and splits, the fish wriggles out of its clear egg, the larva is capped in its cell, the seeds, the
// acorn and the bulb sink in and sprout, the dandelion's seed floats down on its umbrella, the tadpole grows legs and
// loses its tail, the coconut sprouts where it lies, the bud swells and opens.

/** Time to watch it become it (after the picked one flew up into it) before the next round comes. */
export const GROW_MS = 3900;

export type GrowthId =
  | "raupe"
  | "ei"
  | "samen"
  | "kaulquappe"
  | "eichel"
  | "zwiebel"
  | "kuerbiskern"
  | "kokosnuss"
  | "knospe"
  | "schildkroetenei"
  | "krokodilei"
  | "dinoei"
  | "pinguinei"
  | "schlangenei"
  | "fischei"
  | "larve"
  | "karottensamen"
  | "maiskorn"
  | "schirmchen"
  | "erdbeersamen";

export interface Growth {
  id: GrowthId;
  /** The small one's German name, for screen readers: "Raupe". */
  young: string;
  /** With its article after „aus“, „der Raupe“, for "Was wird aus der Raupe?". */
  fromThe: string;
  /** What it becomes, as on the plates. */
  emoji: string;
  /** Its German name, for screen readers: "Schmetterling". */
  adult: string;
  /** With its article, „der Schmetterling“, for "Der Schmetterling kommt aus der Raupe!". */
  the: string;
  /** With „ein“, „ein Schmetterling“, for "Aus der Raupe wird ein Schmetterling.". */
  a: string;
  /** A plant: alike to every other plant for a child (`GROW_LOOKALIKES`), so never dealt with one. */
  plant?: true;
  /** Where what it becomes stands at the end, in the box's units (its middle), and how wide, as a share of the box. */
  spot: [number, number];
  size: number;
  /** The sounds while it becomes it, each after so many ms of growing. */
  sounds: [number, () => void][];
  back: ReactNode;
  front?: ReactNode;
}

const OUTLINE = "#5a4636";

/** The caterpillar on its leaf, under the twig its chrysalis will hang from. */
const caterpillarBack = (
  <>
    <path d="M6 30 Q100 18 194 32" stroke="#8b5e3c" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M160 27 Q176 6 192 10 Q186 30 160 27 Z" fill="#6ab04c" stroke={OUTLINE} strokeWidth="3" />
    <g className="ap-grow-cocoon">
      <path d="M100 26 C124 42 126 92 100 116 C74 92 76 42 100 26 Z" fill="#a8c66c" stroke={OUTLINE} strokeWidth="3.5" />
      <path d="M84 62 Q100 70 116 62 M82 84 Q100 92 118 84" stroke="#6f8f3a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
    <path d="M10 182 Q50 120 150 134 Q198 142 192 180 Q110 200 10 182 Z" fill="#6ab04c" stroke={OUTLINE} strokeWidth="3.5" />
    <path d="M24 178 Q100 150 184 162" stroke="#4e8a35" strokeWidth="3" fill="none" strokeLinecap="round" />
    <g className="ap-grow-caterpillar">
      {[56, 78, 100, 122].map((x, i) => (
        <g key={x}>
          <path d={`M${x - 5} 162 v8 M${x + 5} 162 v8`} stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
          <circle cx={x} cy={150 - (i % 2) * 6} r="15" fill={i % 2 ? "#9ccc65" : "#7cb342"} stroke={OUTLINE} strokeWidth="3" />
        </g>
      ))}
      <path d="M140 128 L134 110 M152 128 L160 112" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" />
      <circle cx="134" cy="109" r="4" fill="#e63946" />
      <circle cx="161" cy="111" r="4" fill="#e63946" />
      <circle cx="146" cy="140" r="18" fill="#aed581" stroke={OUTLINE} strokeWidth="3" />
      <circle cx="141" cy="136" r="3.5" fill={OUTLINE} />
      <circle cx="153" cy="136" r="3.5" fill={OUTLINE} />
      <path d="M140 146 Q147 152 154 146" stroke={OUTLINE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  </>
);

/** The egg's outline and its two halves meet at this zigzag, where it cracks. */
const ZIGZAG = "L76 96 L88 110 L100 96 L112 110 L124 96 L139.6 105";
const SHELL_TOP = `M60.4 105 ${ZIGZAG} A40 50 0 0 0 60.4 105 Z`;
const SHELL_BOTTOM = `M60.4 105 ${ZIGZAG} A40 50 0 1 1 60.4 105 Z`;

/** The nest's back and the egg's upper half, behind the chick. */
const eggBack = (
  <>
    <ellipse cx="100" cy="150" rx="74" ry="16" fill="#6f4e37" />
    <g className="ap-grow-egg">
      <g className="ap-grow-lid">
        <path d={SHELL_TOP} fill="#fff6e6" />
        <path className="ap-grow-edge" d={SHELL_TOP} fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
        <ellipse cx="86" cy="86" rx="7" ry="11" fill="#fff" />
      </g>
    </g>
  </>
);

/** The egg's lower half and the nest, before the chick; the whole outline and the crack until it opens. */
const eggFront = (
  <>
    <g className="ap-grow-egg">
      <path d={SHELL_BOTTOM} fill="#fff6e6" />
      <path className="ap-grow-edge" d={SHELL_BOTTOM} fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      <ellipse className="ap-grow-whole" cx="100" cy="112" rx="40" ry="50" fill="none" stroke={OUTLINE} strokeWidth="3" />
      <path
        className="ap-grow-crack"
        d={`M70 100 ${ZIGZAG.replace("L139.6 105", "L130 100")}`}
        fill="none"
        stroke={OUTLINE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </g>
    <path d="M22 146 Q28 198 100 198 Q172 198 178 146 Q100 170 22 146 Z" fill="#a47148" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    {["M34 164 Q60 176 92 172", "M104 184 Q136 178 166 162", "M46 184 Q74 192 110 190", "M30 150 Q60 162 86 160"].map((d) => (
      <path key={d} d={d} stroke="#e0b084" strokeWidth="3" strokeLinecap="round" fill="none" />
    ))}
  </>
);

/** The seed on the soil and the stem it grows into, behind the soil and the sunflower's head. */
const seedBack = (
  <>
    <g className="ap-grow-stem">
      <path d="M100 176 C96 140 104 104 100 70" stroke="#4caf50" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M100 136 Q74 112 58 124 Q76 144 100 136 Z" fill="#66bb6a" stroke={OUTLINE} strokeWidth="3" />
      <path d="M101 112 Q128 90 144 102 Q126 122 101 112 Z" fill="#66bb6a" stroke={OUTLINE} strokeWidth="3" />
    </g>
    <g className="ap-grow-seed">
      <path d="M100 112 C124 124 124 156 100 168 C76 156 76 124 100 112 Z" fill="#3d3d3d" stroke={OUTLINE} strokeWidth="3.5" />
      <path d="M92 124 Q88 140 93 158 M108 124 Q112 140 107 158" stroke="#d9d9d9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  </>
);

/** The heap of soil the seed sinks into. */
const seedFront = (
  <>
    <path d="M8 196 Q100 132 192 196 Z" fill="#8b5e3c" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    {[
      [60, 180],
      [128, 176],
      [96, 188],
      [150, 190],
      [42, 192],
    ].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r="4" fill="#6f4e37" />
    ))}
  </>
);

/** The pond with a lily pad, and the tadpole in it, which grows legs and loses its tail. */
const tadpoleBack = (
  <>
    <ellipse cx="100" cy="162" rx="94" ry="34" fill="#74c0fc" stroke={OUTLINE} strokeWidth="3.5" />
    <path d="M34 158 Q48 152 62 158 M120 176 Q134 170 148 176 M70 184 Q82 179 94 184" stroke="#d0ebff" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path
      d="M138 150 m-36 0 a36 13 0 1 0 72 0 a36 13 0 1 0 -72 0 Z M138 150 L170 145 L172 152 Z"
      fill="#69b34c"
      fillRule="evenodd"
      stroke={OUTLINE}
      strokeWidth="3"
    />
    <g className="ap-grow-tadpole">
      <g className="ap-grow-tail">
        <path d="M58 166 Q44 154 28 162 Q40 166 30 174 Q46 178 58 166 Z" fill="#4a4a3a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      <g className="ap-grow-legs">
        <path d="M62 176 l-6 8 M80 176 l6 8" stroke="#4a4a3a" strokeWidth="4" strokeLinecap="round" />
      </g>
      <ellipse cx="70" cy="166" rx="15" ry="12" fill="#4a4a3a" stroke={OUTLINE} strokeWidth="2.5" />
      <circle cx="77" cy="162" r="4" fill="#fff" />
      <circle cx="78" cy="162" r="2" fill="#1a1a1a" />
    </g>
  </>
);

/** An oak leaf with wavy edges, lying along x from 0 to 40: placed and turned with `transform`. */
const OAK_LEAF = "M0 0 Q5 -8 10 -5 Q14 -12 20 -6 Q26 -13 31 -5 Q40 -8 40 0 Q40 8 31 5 Q26 13 20 6 Q14 12 10 5 Q5 8 0 0 Z";

/** The acorn in its cap on the meadow, and the little oak it sprouts into before the tree stands there. */
const acornBack = (
  <>
    <g className="ap-grow-sapling">
      <path d="M100 172 C98 150 102 132 100 110" stroke="#7a5230" strokeWidth="6" strokeLinecap="round" fill="none" />
      {[
        [100, 142, -160],
        [100, 124, -20],
        [100, 112, -100],
      ].map(([x, y, turn]) => (
        <g key={turn} transform={`translate(${x} ${y}) rotate(${turn})`}>
          <path d={OAK_LEAF} fill="#66bb6a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M2 0 H34" stroke="#3f8a3a" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </g>
    <g className="ap-grow-acorn">
      <g transform="translate(100 168) scale(1.25) translate(-100 -168)">
        <path d="M80 128 C80 152 92 164 100 168 C108 164 120 152 120 128 Z" fill="#c98a3c" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
        <ellipse cx="90" cy="146" rx="4" ry="9" fill="#e3b06a" />
        <path d="M100 116 Q101 104 110 100" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M74 132 C72 110 128 110 126 132 C114 137 86 137 74 132 Z" fill="#8a5a2e" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M84 120 l6 8 M96 116 l6 9 M108 116 l6 8 M90 129 l6 -9 M103 130 l6 -10 M115 128 l5 -7" stroke="#6b4220" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  </>
);

/** The meadow with a patch of dug soil the acorn sinks into. */
const acornFront = (
  <>
    <path d="M0 200 V172 C60 158 140 158 200 172 V200 Z" fill="#7cc457" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <ellipse cx="100" cy="168" rx="26" ry="6" fill="#8b5e3c" />
    {[
      [20, 174],
      [46, 170],
      [146, 170],
      [172, 174],
    ].map(([x, y]) => (
      <path key={x} d={`M${x} ${y} l4 -10 l4 10`} stroke="#4e8a35" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    ))}
  </>
);

/** The tulip bulb on the soil in its pot, and the two long leaves that come out of the soil. */
const bulbBack = (
  <>
    <ellipse cx="100" cy="136" rx="52" ry="9" fill="#5b3a26" stroke={OUTLINE} strokeWidth="3" />
    <g className="ap-grow-blades">
      <path d="M96 138 C76 118 70 94 80 62 C90 90 98 110 104 138 Z" fill="#5aa845" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      <path d="M104 138 C124 118 130 94 120 62 C110 90 102 110 96 138 Z" fill="#5aa845" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    </g>
    <g className="ap-grow-bulb">
      <path d="M100 86 Q97 76 102 68" stroke="#5aa845" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path
        d="M100 84 C104 96 126 104 128 122 C129 136 116 142 100 142 C84 142 71 136 72 122 C74 104 96 96 100 84 Z"
        fill="#c79a6b"
        stroke={OUTLINE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M100 90 Q90 110 92 138 M100 90 Q110 110 108 138" stroke="#9c6f45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="84" cy="118" rx="4" ry="9" fill="#e2bf93" />
    </g>
  </>
);

/** The flower pot the bulb sinks into. */
const bulbFront = (
  <>
    <path d="M58 148 L142 148 L132 196 L68 196 Z" fill="#d9744a" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M62 172 Q100 178 137 172" stroke="#b85a34" strokeWidth="3" strokeLinecap="round" fill="none" />
    <rect x="44" y="134" width="112" height="20" rx="6" fill="#e8895c" stroke={OUTLINE} strokeWidth="3.5" />
    <path d="M54 140 H96" stroke="#f4b08c" strokeWidth="3" strokeLinecap="round" />
  </>
);

/** A round pumpkin leaf with three lobes, its stalk at 0 0. */
const PUMPKIN_LEAF = "M0 0 C-20 -2 -26 -20 -14 -28 C-12 -40 4 -42 8 -32 C22 -32 26 -12 0 0 Z";

/** The pumpkin seed standing in the bed, and the vine that creeps out along the ground. */
const pipBack = (
  <>
    <g className="ap-grow-vine">
      <path
        d="M100 172 C80 176 60 164 38 170 C26 173 20 166 24 160 M100 172 C122 176 142 164 164 170 C176 173 182 164 176 158"
        stroke="#4e8a35"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {[
        [56, 168, -10],
        [146, 168, 10],
        [80, 172, -30],
      ].map(([x, y, turn]) => (
        <g key={x} transform={`translate(${x} ${y}) rotate(${turn})`}>
          <path d={PUMPKIN_LEAF} fill="#5aa845" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M0 0 L-8 -24 M0 0 L8 -26" stroke="#3f8a3a" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
    </g>
    <g className="ap-grow-pip">
      <g transform="translate(100 176) scale(1.35) translate(-100 -176) rotate(-12 100 150)">
        <path d="M100 120 C118 130 120 160 100 178 C80 160 82 130 100 120 Z" fill="#f6e7b8" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M100 129 C111 138 112 160 100 170 C88 160 89 138 100 129 Z" fill="none" stroke="#d8c08a" strokeWidth="2.5" />
      </g>
    </g>
  </>
);

/** The garden bed the pumpkin seed sinks into. */
const pipFront = (
  <>
    <path d="M0 200 V180 C50 168 150 168 200 180 V200 Z" fill="#8b5e3c" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    {[
      [30, 186],
      [70, 190],
      [118, 184],
      [160, 192],
      [184, 186],
    ].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r="4" fill="#6f4e37" />
    ))}
  </>
);

/** The sea behind the beach the coconut lies on. */
const coconutBack = (
  <>
    <path d="M0 160 C30 152 60 164 100 158 C140 152 170 164 200 158 V200 H0 Z" fill="#74c0fc" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M18 170 Q30 165 42 170 M150 168 Q162 163 174 168" stroke="#d0ebff" strokeWidth="3" fill="none" strokeLinecap="round" />
  </>
);

/** The sand, the coconut lying on it and the shoot it sprouts; the palm grows up from behind it. */
const coconutFront = (
  <>
    <path d="M0 200 V184 C40 166 160 166 200 184 V200 Z" fill="#f2d58a" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <g className="ap-grow-coco">
      <ellipse cx="100" cy="162" rx="30" ry="22" fill="#8b5a2b" stroke={OUTLINE} strokeWidth="3.5" />
      <path
        d="M78 154 Q88 148 96 154 M100 172 Q110 166 120 172 M80 170 Q88 165 96 170 M102 150 Q110 145 116 149"
        stroke="#6b4220"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="88" cy="150" rx="7" ry="3" fill="#ab7744" />
      {[
        [118, 158],
        [124, 163],
        [117, 166],
      ].map(([x, y]) => (
        <circle key={y} cx={x} cy={y} r="3" fill="#3b2412" />
      ))}
    </g>
    <g className="ap-grow-shoot">
      <path d="M100 142 Q88 126 78 120 Q96 124 104 141 Z" fill="#5aa845" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 142 Q100 120 104 106 Q112 124 105 142 Z" fill="#66bb6a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M103 142 Q114 124 126 118 Q118 134 107 143 Z" fill="#5aa845" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  </>
);

/** The rose's stem with its thorns and leaves, the closed bud on top, its green sepals around it. */
const budBack = (
  <g className="ap-grow-bush">
    <path d="M100 196 C96 164 104 128 100 96" stroke="#3f8a3a" strokeWidth="7" strokeLinecap="round" fill="none" />
    <path d="M98 170 l-9 -1 l8 -7 Z M102 140 l9 -1 l-8 -7 Z M98 116 l-8 -2 l8 -6 Z" fill="#3f8a3a" stroke={OUTLINE} strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M99 154 Q74 134 58 146 Q78 164 99 154 Z" fill="#5aa845" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    <path d="M101 128 Q126 110 142 122 Q122 140 101 128 Z" fill="#5aa845" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    <path d="M97 152 Q80 146 64 147 M103 127 Q120 120 136 122" stroke="#3f8a3a" strokeWidth="2" strokeLinecap="round" fill="none" />
    <g className="ap-grow-bud">
      <path d="M100 42 C117 56 119 80 100 96 C81 80 83 56 100 42 Z" fill="#e63950" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M100 50 Q110 66 100 88 M93 60 Q90 74 96 86" stroke="#b3203a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path
        className="ap-grow-sepal-l"
        d="M100 98 C82 94 78 74 86 56 C90 76 95 88 100 98 Z"
        fill="#5aa845"
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        className="ap-grow-sepal-r"
        d="M100 98 C118 94 122 74 114 56 C110 76 105 88 100 98 Z"
        fill="#5aa845"
        stroke={OUTLINE}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </g>
  </g>
);

/** The bit of lawn the rose stands in. */
const budFront = (
  <>
    <path d="M0 200 V190 C60 182 140 182 200 190 V200 Z" fill="#7cc457" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    {[62, 84, 112, 134].map((x) => (
      <path key={x} d={`M${x} 190 l4 -11 l4 11`} stroke="#4e8a35" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    ))}
  </>
);

/** A number rounded to a tenth, for paths worked out from an egg's size. */
const tenth = (n: number) => Math.round(n * 10) / 10;

/** An egg to crack, as the hen's: where it stands, how big, its colour and its spots ([x, y, r], kept clear of the crack). */
interface EggLook {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  spots?: [number, number, number][];
  spotFill?: string;
}

/**
 * An egg that cracks like the hen's (the same classes, so the same wobble, crack and lid in animals.css), drawn
 * anywhere and at any size: `lid` is its upper half for the `back` layer, `shell` its lower half, outline and crack
 * for the `front` one. They turn round the egg's own bottom and middle.
 */
function crackingEgg({ cx, cy, rx, ry, fill, spots = [], spotFill = "#c9b28a" }: EggLook) {
  const k = ry / 50;
  const y0 = cy - 7 * k;
  const end = rx * Math.sqrt(1 - ((y0 - cy) / ry) ** 2);
  const [left, right] = [tenth(cx - end), tenth(cx + end)];
  const teeth = [-0.6, -0.3, 0, 0.3, 0.6].map((f, i) => `L${tenth(cx + rx * f)} ${tenth(y0 + (i % 2 ? 5 : -9) * k)}`).join(" ");
  const top = `M${left} ${tenth(y0)} ${teeth} L${right} ${tenth(y0)} A${rx} ${ry} 0 0 0 ${left} ${tenth(y0)} Z`;
  const bottom = `M${left} ${tenth(y0)} ${teeth} L${right} ${tenth(y0)} A${rx} ${ry} 0 1 1 ${left} ${tenth(y0)} Z`;
  const crack = `M${tenth(cx - 0.75 * rx)} ${tenth(y0 - 5 * k)} ${teeth} L${tenth(cx + 0.75 * rx)} ${tenth(y0 - 5 * k)}`;
  const wobble = { transformOrigin: `${cx}px ${cy + ry}px` };
  const dots = (upper: boolean) =>
    spots.filter(([, y]) => y < y0 === upper).map(([x, y, r]) => <ellipse key={`${x} ${y}`} cx={x} cy={y} rx={r} ry={r * 0.8} fill={spotFill} />);
  return {
    lid: (
      <g className="ap-grow-egg" style={wobble}>
        <g className="ap-grow-lid" style={{ transformOrigin: `${cx}px ${tenth(y0 - 0.3 * ry)}px` }}>
          <path d={top} fill={fill} />
          {dots(true)}
          <path className="ap-grow-edge" d={top} fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx={tenth(cx - 0.35 * rx)} cy={tenth(cy - 0.5 * ry)} rx={tenth(0.17 * rx)} ry={tenth(0.22 * ry)} fill="#fff" opacity="0.8" />
        </g>
      </g>
    ),
    shell: (
      <g className="ap-grow-egg" style={wobble}>
        <path d={bottom} fill={fill} />
        {dots(false)}
        <path className="ap-grow-edge" d={bottom} fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
        <ellipse className="ap-grow-whole" cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={OUTLINE} strokeWidth="3" />
        <path className="ap-grow-crack" d={crack} fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      </g>
    ),
  };
}

/** A five-pointed star round `x y`, for the starfish on the beach. */
const star = (x: number, y: number, r: number) =>
  `M${Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const reach = i % 2 ? r * 0.45 : r;
    return `${tenth(x + reach * Math.cos(angle))} ${tenth(y + reach * Math.sin(angle))}`;
  }).join(" L")} Z`;

const turtleEgg = crackingEgg({ cx: 62, cy: 146, rx: 27, ry: 29, fill: "#fbf6ea" });

/** The sea behind the beach, the sand with the pit the turtle's egg lies in, and the egg's upper half. */
const turtleBack = (
  <>
    <path d="M0 84 C34 76 66 90 100 82 C134 74 166 88 200 80 V130 H0 Z" fill="#74c0fc" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M24 96 Q36 91 48 96 M130 92 Q142 87 154 92" stroke="#d0ebff" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M0 200 V116 C50 104 150 106 200 118 V200 Z" fill="#f2d58a" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <ellipse cx="62" cy="170" rx="38" ry="9" fill="#d9b464" />
    {turtleEgg.lid}
  </>
);

/** The egg's lower half, the sand heaped round it, and a starfish. */
const turtleFront = (
  <>
    {turtleEgg.shell}
    <path d="M16 178 Q62 160 108 178 Q110 194 62 196 Q14 194 16 178 Z" fill="#f2d58a" />
    <path d="M18 178 Q62 161 106 178" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d={star(24, 186, 11)} fill="#f4a261" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
    {[
      [86, 190],
      [150, 188],
      [176, 170],
    ].map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r="2.5" fill="#d9b464" />
    ))}
  </>
);

const crocEgg = crackingEgg({ cx: 100, cy: 140, rx: 23, ry: 31, fill: "#f4efe2" });

/** A bulrush in the reeds by the river, standing at `x`. */
const bulrush = (x: number, top: number) => (
  <g key={x}>
    <path d={`M${x} 142 Q${x + 4} ${(142 + top) / 2} ${x + 2} ${top}`} stroke="#5aa845" strokeWidth="4" strokeLinecap="round" fill="none" />
    <rect x={x - 3} y={top + 4} width="10" height="22" rx="5" fill="#8b5a2b" stroke={OUTLINE} strokeWidth="2.5" />
  </g>
);

/** The river with its reeds, the muddy bank, the back of the nest the crocodile's egg lies in, and its upper half. */
const crocBack = (
  <>
    <path d="M0 86 C40 78 80 94 120 86 C160 78 180 90 200 84 V140 H0 Z" fill="#8cc7c4" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M60 100 Q72 95 84 100 M118 104 Q130 99 142 104" stroke="#d6f0ee" strokeWidth="3" fill="none" strokeLinecap="round" />
    {[bulrush(12, 52), bulrush(28, 66), bulrush(170, 62), bulrush(186, 50)]}
    <path d="M0 200 V128 C60 116 140 118 200 130 V200 Z" fill="#a98b62" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M42 158 C54 130 80 122 100 122 C120 122 146 130 158 158 Z" fill="#7a5a3a" />
    <path d="M42 158 C54 130 80 122 100 122 C120 122 146 130 158 158" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" fill="none" />
    {crocEgg.lid}
  </>
);

/** The egg's lower half and the nest's front, a mound of mud and dry leaves. */
const crocFront = (
  <>
    {crocEgg.shell}
    <ellipse cx="100" cy="190" rx="84" ry="7" fill="#8a6e4c" />
    <path d="M18 190 C28 162 68 152 100 152 C132 152 172 162 182 190 Z" fill="#8b6a45" />
    <path d="M18 190 C28 162 68 152 100 152 C132 152 172 162 182 190" stroke={OUTLINE} strokeWidth="3.5" strokeLinecap="round" fill="none" />
    {["M50 170 L68 162", "M80 178 L96 170", "M112 172 L130 178", "M140 164 L156 172", "M64 186 L84 184", "M118 188 L138 184"].map((d) => (
      <path key={d} d={d} stroke="#d4ad72" strokeWidth="3" strokeLinecap="round" />
    ))}
  </>
);

const dinoEgg = crackingEgg({
  cx: 96,
  cy: 130,
  rx: 36,
  ry: 46,
  fill: "#e8f0d6",
  spots: [
    [80, 100, 6],
    [104, 94, 5],
    [114, 106, 4.5],
    [84, 152, 6],
    [112, 160, 5],
    [70, 140, 4],
    [122, 140, 4.5],
  ],
  spotFill: "#9cc36b",
});

/** A fern leaning out from `x`, its leaflets in pairs up the stem. */
const fern = (x: number, lean: number) => (
  <g key={x}>
    <path d={`M${x} 152 Q${x + lean / 3} 110 ${x + lean} 76`} stroke="#4e8a35" strokeWidth="4" strokeLinecap="round" fill="none" />
    {[0.15, 0.32, 0.5, 0.68, 0.84].map((t) => {
      const px = x + lean * t * t;
      const py = 152 - 76 * t;
      const reach = 18 * (1 - t * 0.6);
      return (
        <path
          key={t}
          d={`M${tenth(px)} ${tenth(py)} q${tenth(-reach)} -2 ${tenth(-reach)} -9 M${tenth(px)} ${tenth(py)} q${tenth(reach)} -2 ${tenth(reach)} -9`}
          stroke="#66bb6a"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      );
    })}
  </g>
);

/** A volcano far off with a puff of smoke, ferns, the meadow and the big spotted egg's upper half. */
const dinoBack = (
  <>
    <path d="M116 132 L146 60 Q154 54 162 60 L194 132 Z" fill="#a1887f" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M146 62 Q154 70 162 62" stroke="#e57c3a" strokeWidth="4" strokeLinecap="round" fill="none" />
    {[
      [156, 42, 9],
      [146, 30, 7],
      [160, 20, 6],
    ].map(([x, y, r]) => (
      <circle key={y} cx={x} cy={y} r={r} fill="#ebe7e2" stroke={OUTLINE} strokeWidth="2.5" />
    ))}
    <path d="M0 200 V140 C60 130 140 130 200 140 V200 Z" fill="#a5c46e" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    {[fern(30, -12), fern(170, 10)]}
    {dinoEgg.lid}
  </>
);

/** The egg's lower half and a ring of stones round its foot. */
const dinoFront = (
  <>
    {dinoEgg.shell}
    {[
      [58, 174, 11],
      [78, 182, 12],
      [102, 184, 12],
      [124, 181, 11],
      [140, 172, 10],
    ].map(([x, y, r]) => (
      <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.6} fill="#b8b0a4" stroke={OUTLINE} strokeWidth="3" />
    ))}
  </>
);

const penguinEgg = crackingEgg({ cx: 100, cy: 142, rx: 22, ry: 28, fill: "#eef2e2" });

/** The cold sea with an iceberg, the ice the penguin's egg lies on, and its upper half. */
const penguinBack = (
  <>
    <path d="M0 112 C40 106 80 118 120 110 C160 102 180 112 200 108 V152 H0 Z" fill="#5b9bd5" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M8 118 L24 70 L38 84 L54 58 L74 118 Z" fill="#f4fbff" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    <path d="M54 58 L48 90 L62 118 M24 70 L30 96" stroke="#bfe0f5" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M0 200 V150 C50 140 150 140 200 150 V200 Z" fill="#eef8fc" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M22 170 L40 166 L52 174 M150 168 L166 176 L182 170" stroke="#bfe0f5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {penguinEgg.lid}
  </>
);

/** The egg's lower half and the snow heaped round it. */
const penguinFront = (
  <>
    {penguinEgg.shell}
    <path d="M60 178 Q100 160 140 178 Q140 188 100 189 Q60 188 60 178 Z" fill="#fdfefe" />
    <path d="M60 178 Q100 160 140 178" stroke={OUTLINE} strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M76 180 Q88 176 96 179" stroke="#d6ecf8" strokeWidth="3" strokeLinecap="round" fill="none" />
  </>
);

/** A fallen leaf lying at `x y`, turned by `turn` degrees. */
const leaf = (x: number, y: number, turn: number, fill: string) => (
  <g key={`${x} ${y}`} transform={`translate(${x} ${y}) rotate(${turn})`}>
    <path d="M-12 0 Q0 -9 12 0 Q0 9 -12 0 Z" fill={fill} stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M-12 0 H10" stroke={OUTLINE} strokeWidth="1.5" strokeLinecap="round" />
  </g>
);

/** The forest floor with a mossy log behind; the snake comes out of its egg in front. */
const snakeBack = (
  <>
    <path d="M0 200 V148 C60 138 140 138 200 148 V200 Z" fill="#9c7a54" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    <rect x="6" y="108" width="74" height="36" rx="18" fill="#8b5a2b" stroke={OUTLINE} strokeWidth="3.5" />
    <ellipse cx="72" cy="126" rx="10" ry="17" fill="#d4a373" stroke={OUTLINE} strokeWidth="3" />
    <ellipse cx="72" cy="126" rx="4" ry="8" fill="none" stroke="#a87a4a" strokeWidth="2" />
    <path d="M14 112 Q30 102 44 110 Q54 102 64 110" stroke="#7cb342" strokeWidth="6" strokeLinecap="round" fill="none" />
    {[160, 176, 188].map((x, i) => (
      <path
        key={x}
        d={`M${x} 146 q-4 -${14 + i * 4} -10 -${20 + i * 4} M${x} 146 q4 -${16 + i * 3} 10 -${22 + i * 3}`}
        stroke="#5aa845"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    ))}
  </>
);

/** The snake's leathery egg, which bulges, gets a slit and sags once the snake is out, and fallen leaves before it. */
const snakeFront = (
  <>
    <g className="ap-grow-sack">
      <ellipse cx="96" cy="158" rx="33" ry="21" fill="#f3ecd9" stroke={OUTLINE} strokeWidth="3.5" />
      <ellipse cx="82" cy="150" rx="9" ry="5" fill="#fff" opacity="0.8" />
      <path d="M78 168 Q92 172 108 168" stroke="#e0d4b8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path className="ap-grow-slit" d="M108 144 Q118 156 110 170" stroke={OUTLINE} strokeWidth="4" strokeLinecap="round" fill="none" />
    </g>
    {[leaf(34, 182, -20, "#e9a03b"), leaf(58, 192, 15, "#c96f3a"), leaf(168, 188, 30, "#e9c03b")]}
  </>
);

/** The pond seen from the side: the water, the sandy bottom, water weed with a little bunch of eggs on it. */
const fishBack = (
  <>
    <path
      d="M4 64 C40 54 70 72 100 62 C130 52 160 70 196 60 V188 Q196 198 186 198 H14 Q4 198 4 188 Z"
      fill="#9bd4f5"
      stroke={OUTLINE}
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path d="M6 176 C60 166 140 168 194 176 V188 Q194 196 186 196 H14 Q6 196 6 188 Z" fill="#f2d58a" />
    <path d="M6 176 C60 166 140 168 194 176" stroke="#d9b464" strokeWidth="3" fill="none" />
    <path d="M40 176 C30 150 52 130 40 104 C30 84 46 72 42 62" stroke="#4e8a35" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M58 176 C68 156 52 142 62 120" stroke="#66bb6a" strokeWidth="5" strokeLinecap="round" fill="none" />
    {[
      [152, 92, 5],
      [162, 80, 3.5],
      [150, 72, 3],
    ].map(([x, y, r]) => (
      <circle key={y} cx={x} cy={y} r={r} fill="none" stroke="#e7f5ff" strokeWidth="2.5" />
    ))}
    {[
      [64, 140, 9],
      [56, 156, 8],
      [72, 158, 7],
    ].map(([x, y, r]) => (
      <g key={y}>
        <circle cx={x} cy={y} r={r} fill="#eaf7ff" fillOpacity="0.7" stroke={OUTLINE} strokeWidth="2" />
        <path d={`M${x - 4} ${y + 3} Q${x - 3} ${y - 4} ${x + 3} ${y - 3}`} stroke="#9a8a62" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx={x + 2.5} cy={y - 3} r="1.3" fill="#1a1a1a" />
      </g>
    ))}
    <g className="ap-grow-roe">
      <circle cx="92" cy="124" r="21" fill="#eaf7ff" fillOpacity="0.7" stroke={OUTLINE} strokeWidth="3" />
      <ellipse cx="84" cy="114" rx="5" ry="3.5" fill="#fff" />
    </g>
    <g className="ap-grow-fry">
      <path d="M80 130 Q82 114 98 116 Q108 122 100 132" stroke="#9a8a62" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="97" cy="118" r="3.5" fill="#1a1a1a" />
    </g>
  </>
);

/** Water weed and pebbles before the water. */
const fishFront = (
  <>
    <path d="M176 192 C168 172 184 158 176 136" stroke="#4e8a35" strokeWidth="6" strokeLinecap="round" fill="none" />
    {[
      [120, 188, 9],
      [140, 191, 6],
      [24, 190, 7],
    ].map(([x, y, r]) => (
      <ellipse key={x} cx={x} cy={y} rx={r} ry={r * 0.65} fill="#b8b0a4" stroke={OUTLINE} strokeWidth="2.5" />
    ))}
  </>
);

/** A cell of the honeycomb with six sides, its middle at `x y`. */
const hexagon = (x: number, y: number, r: number) =>
  `M${Array.from({ length: 6 }, (_, i) => `${tenth(x + r * Math.cos((Math.PI / 3) * i))} ${tenth(y + r * Math.sin((Math.PI / 3) * i))}`).join(" L")} Z`;

/** The honeycomb's cells round the middle one: honey in some, wax lids on others. */
const COMB: [number, number, "honey" | "lid"][] = [
  [100, 75.5, "lid"],
  [142, 99.8, "honey"],
  [142, 148.3, "lid"],
  [100, 172.5, "honey"],
  [58, 148.3, "lid"],
  [58, 99.8, "honey"],
];

/** The honeycomb with the bee's larva curled in its middle cell, and the wax lid the bees put on it. */
const larvaBack = (
  <>
    {COMB.map(([x, y, kind]) => (
      <g key={`${x} ${y}`}>
        <path d={hexagon(x, y, 28)} fill="#f6c453" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
        <path d={hexagon(x, y, 19)} fill={kind === "honey" ? "#f0a020" : "#fbe3a0"} stroke="#c98a2a" strokeWidth="2" strokeLinejoin="round" />
        {kind === "honey" ? <ellipse cx={x - 6} cy={y - 6} rx="4" ry="6" fill="#ffd27a" /> : <ellipse cx={x - 5} cy={y - 7} rx="6" ry="3.5" fill="#fff4cf" />}
      </g>
    ))}
    <path d={hexagon(100, 124, 28)} fill="#f6c453" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    <path d={hexagon(100, 124, 19)} fill="#c98a2a" stroke="#a86f1c" strokeWidth="2" strokeLinejoin="round" />
    <g className="ap-grow-larva">
      <path d="M89 118 C86 134 108 140 113 126" stroke={OUTLINE} strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M89 118 C86 134 108 140 113 126" stroke="#fffaf0" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M91 128 l4 -3 M98 133 l2 -4 M106 133 l-1 -4" stroke="#e0d6c0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="88" cy="117" r="1.8" fill={OUTLINE} />
    </g>
    <g className="ap-grow-cap">
      <path d={hexagon(100, 124, 20)} fill="#f3d27a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="95" cy="117" rx="6" ry="3.5" fill="#fff4cf" />
    </g>
  </>
);

/** The garden bed's soil, which the seeds sink into. */
const bed = (top: number, clods: [number, number][]) => (
  <>
    <path d={`M0 200 V${top} C60 ${top - 10} 140 ${top - 10} 200 ${top} V200 Z`} fill="#8b5e3c" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    {clods.map(([x, y]) => (
      <circle key={x} cx={x} cy={y} r="4" fill="#6f4e37" />
    ))}
  </>
);

/** The carrot's seed on the bed, and the feathery green that comes up before the carrot itself is pulled out. */
const carrotBack = (
  <>
    <g className="ap-grow-greens">
      {[
        [78, 90],
        [100, 80],
        [122, 92],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M100 166 Q${(100 + x) / 2} ${(166 + y) / 2 + 6} ${x} ${y}`} stroke="#4e8a35" strokeWidth="4" strokeLinecap="round" fill="none" />
          {[0.35, 0.55, 0.75, 0.92].map((t) => {
            const px = 100 + (x - 100) * t;
            const py = 166 + (y - 166) * t;
            return (
              <path
                key={t}
                d={`M${tenth(px)} ${tenth(py)} l-9 -7 M${tenth(px)} ${tenth(py)} l9 -7`}
                stroke="#66bb6a"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
            );
          })}
        </g>
      ))}
    </g>
    <g className="ap-grow-seed">
      <g transform="translate(100 146) rotate(-20)">
        <ellipse rx="9" ry="14" fill="#b07d4f" stroke={OUTLINE} strokeWidth="3" />
        <path d="M-4 -8 V8 M3 -9 V9" stroke="#e2bf93" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  </>
);

const carrotFront = bed(166, [
  [30, 180],
  [64, 188],
  [138, 182],
  [172, 190],
]);

/** The maize kernel on the field, and the tall stalk with its long leaves and tassel that grows from it. */
const cornBack = (
  <>
    <g className="ap-grow-stalk">
      <path d="M100 178 C98 132 102 90 100 42" stroke="#7cb342" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M100 150 C80 120 56 116 32 132 C58 130 82 140 100 164 Z" fill="#7cb342" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 120 C122 90 148 88 170 104 C144 102 120 112 100 136 Z" fill="#8bc34a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 90 C84 64 64 58 44 70 C66 70 86 82 100 104 Z" fill="#8bc34a" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 44 L90 22 M100 44 L100 16 M100 44 L110 24 M100 50 L118 36" stroke="#e0c060" strokeWidth="3.5" strokeLinecap="round" />
    </g>
    <g className="ap-grow-seed">
      <path d="M90 140 Q100 132 110 140 L107 158 Q100 165 93 158 Z" fill="#f6c945" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="96" cy="145" rx="3" ry="5" fill="#fbe39a" />
    </g>
  </>
);

/** The field, with a furrow. */
const cornFront = (
  <>
    {bed(172, [
      [26, 186],
      [70, 192],
      [140, 186],
    ])}
    <path d="M110 186 Q140 182 176 186" stroke="#6f4e37" strokeWidth="3" strokeLinecap="round" fill="none" />
  </>
);

/** A dandelion leaf with teeth along it, lying from 0 0 out to the left: placed and turned with `transform`. */
const DANDELION_LEAF = "M0 0 L-12 -6 L-14 -1 L-26 -10 L-28 -3 L-42 -14 L-44 -5 L-58 -12 Q-52 2 0 4 Z";

/** The dandelion's seed on its little umbrella in the air, and the leaves and the stem that grow where it lands. */
const fluffBack = (
  <>
    <g className="ap-grow-rosette">
      {[
        [96, 178, 8],
        [104, 178, 172],
        [98, 180, -12],
      ].map(([x, y, turn]) => (
        <path
          key={turn}
          transform={`translate(${x} ${y}) rotate(${turn})`}
          d={DANDELION_LEAF}
          fill={turn === -12 ? "#4e9a3a" : "#5aa845"}
          stroke={OUTLINE}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      ))}
    </g>
    <g className="ap-grow-dstem">
      <path d="M100 178 C98 140 102 110 100 80" stroke="#7cb342" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
    <g className="ap-grow-fluff">
      {[-160, -138, -116, -90, -64, -42, -20].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = tenth(100 + 24 * Math.cos(rad));
        const y = tenth(40 + 24 * Math.sin(rad));
        return (
          <g key={angle}>
            <path d={`M100 40 L${x} ${y}`} stroke="#a89c86" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx={x} cy={y} r="4" fill="#fff" stroke={OUTLINE} strokeWidth="1.5" />
          </g>
        );
      })}
      <path d="M100 40 V62" stroke="#a89c86" strokeWidth="2" strokeLinecap="round" />
      <path d="M100 60 L96 70 L100 80 L104 70 Z" fill="#8b5e3c" stroke={OUTLINE} strokeWidth="2.5" strokeLinejoin="round" />
    </g>
  </>
);

/** The lawn the seed lands in. */
const fluffFront = (
  <>
    <path d="M0 200 V180 C60 172 140 172 200 180 V200 Z" fill="#7cc457" stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round" />
    {[30, 52, 148, 170].map((x) => (
      <path key={x} d={`M${x} 182 l4 -11 l4 11`} stroke="#4e8a35" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    ))}
  </>
);

/** A strawberry leaf of three rounded leaflets at the end of a stalk from `x y`. */
const strawberryLeaf = (x: number, y: number, turn: number) => (
  <g key={turn}>
    <path d={`M100 176 Q${(100 + x) / 2} ${y + 20} ${x} ${y}`} stroke="#4e8a35" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      {[-50, 0, 50].map((spread) => (
        <g key={spread} transform={`rotate(${spread})`}>
          <ellipse cx="0" cy="-12" rx="8" ry="12" fill="#5aa845" stroke={OUTLINE} strokeWidth="2.5" />
          <path d="M0 -2 V-20" stroke="#3f8a3a" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      ))}
    </g>
  </g>
);

/** The strawberry's seed on the bed, its plant with a white flower, where the berry grows once the flower has gone. */
const strawberryBack = (
  <>
    <g className="ap-grow-plant">
      {[strawberryLeaf(62, 128, -40), strawberryLeaf(96, 112, -5), strawberryLeaf(78, 150, -70)]}
      <path d="M100 176 C118 160 136 146 146 124" stroke="#4e8a35" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </g>
    <g className="ap-grow-flower">
      {[0, 72, 144, 216, 288].map((turn) => (
        <circle
          key={turn}
          cx={tenth(146 + 9 * Math.cos((turn * Math.PI) / 180))}
          cy={tenth(124 + 9 * Math.sin((turn * Math.PI) / 180))}
          r="7.5"
          fill="#fff"
          stroke={OUTLINE}
          strokeWidth="2"
        />
      ))}
      <circle cx="146" cy="124" r="6" fill="#f6c945" stroke={OUTLINE} strokeWidth="2" />
    </g>
    <g className="ap-grow-seed">
      <path d="M100 136 Q108 146 100 158 Q92 146 100 136 Z" fill="#e8b94a" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    </g>
  </>
);

/** The bed, with straw laid on it as under strawberries. */
const strawberryFront = (
  <>
    {bed(170, [
      [40, 190],
      [150, 192],
    ])}
    {["M14 168 L40 174", "M50 176 L76 168", "M120 170 L148 176", "M160 168 L188 174", "M88 182 L112 178"].map((d) => (
      <path key={d} d={d} stroke="#e8c86a" strokeWidth="3.5" strokeLinecap="round" />
    ))}
  </>
);

/** The small ones and what they become; which of them are never offered together is `GROW_LOOKALIKES`. */
export const GROWTHS: Growth[] = [
  {
    id: "raupe",
    young: "Raupe",
    fromThe: "der Raupe",
    emoji: "🦋",
    adult: "Schmetterling",
    the: "der Schmetterling",
    a: "ein Schmetterling",
    spot: [100, 70],
    size: 0.4,
    sounds: [
      [0, playRustle],
      [2200, playPop],
      [2500, playWhoosh],
      [3100, playTwinkle],
    ],
    back: caterpillarBack,
  },
  {
    id: "ei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🐥",
    adult: "Küken",
    the: "das Küken",
    a: "ein Küken",
    spot: [100, 104],
    size: 0.46,
    sounds: [
      [900, playCrack],
      [1500, playPop],
      [1800, playTweet],
      [2700, playTweet],
    ],
    back: eggBack,
    front: eggFront,
  },
  {
    id: "samen",
    young: "Samen",
    fromThe: "dem Samen",
    emoji: "🌻",
    adult: "Sonnenblume",
    plant: true,
    the: "die Sonnenblume",
    a: "eine Sonnenblume",
    spot: [100, 54],
    size: 0.46,
    sounds: [
      [200, playPlop],
      [700, playTrill],
      [2100, playPop],
      [2300, playTwinkle],
    ],
    back: seedBack,
    front: seedFront,
  },
  {
    id: "kaulquappe",
    young: "Kaulquappe",
    fromThe: "der Kaulquappe",
    emoji: "🐸",
    adult: "Frosch",
    the: "der Frosch",
    a: "ein Frosch",
    spot: [138, 122],
    size: 0.42,
    sounds: [
      [100, playBlub],
      [1100, playBlub],
      [2200, playPop],
      [2500, playCroak],
    ],
    back: tadpoleBack,
  },
  {
    id: "eichel",
    young: "Eichel",
    fromThe: "der Eichel",
    emoji: "🌳",
    adult: "Baum",
    plant: true,
    the: "der Baum",
    a: "ein Baum",
    spot: [100, 108],
    size: 0.62,
    sounds: [
      [0, () => playHop()],
      [500, playPlop],
      [2100, playLeaves],
      [2800, playTwinkle],
    ],
    back: acornBack,
    front: acornFront,
  },
  {
    id: "zwiebel",
    young: "Zwiebel",
    fromThe: "der Zwiebel",
    emoji: "🌷",
    adult: "Tulpe",
    plant: true,
    the: "die Tulpe",
    a: "eine Tulpe",
    spot: [100, 90],
    size: 0.56,
    sounds: [
      [0, playRustle],
      [700, playPlop],
      [1000, playTrill],
      [1900, playPop],
      [2300, playTwinkle],
    ],
    back: bulbBack,
    front: bulbFront,
  },
  {
    id: "kuerbiskern",
    young: "Kürbiskern",
    fromThe: "dem Kürbiskern",
    emoji: "🎃",
    adult: "Kürbis",
    plant: true,
    the: "der Kürbis",
    a: "ein Kürbis",
    spot: [100, 130],
    size: 0.44,
    sounds: [
      [500, playPlop],
      [700, playRustle],
      [1700, playPop],
      [2900, playTwinkle],
    ],
    back: pipBack,
    front: pipFront,
  },
  {
    id: "kokosnuss",
    young: "Kokosnuss",
    fromThe: "der Kokosnuss",
    emoji: "🌴",
    adult: "Palme",
    plant: true,
    the: "die Palme",
    a: "eine Palme",
    spot: [100, 92],
    size: 0.66,
    sounds: [
      [0, () => playKnock(400)],
      [400, () => playKnock(400)],
      [800, playTrill],
      [1900, playLeaves],
      [2700, playTwinkle],
    ],
    back: coconutBack,
    front: coconutFront,
  },
  {
    id: "knospe",
    young: "Knospe",
    fromThe: "der Knospe",
    emoji: "🌹",
    adult: "Rose",
    plant: true,
    the: "die Rose",
    a: "eine Rose",
    spot: [100, 116],
    size: 0.7,
    sounds: [
      [0, playRustle],
      [900, playPop],
      [1500, playTwinkle],
    ],
    back: budBack,
    front: budFront,
  },
  {
    id: "schildkroetenei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🐢",
    adult: "Schildkröte",
    the: "die Schildkröte",
    a: "eine Schildkröte",
    spot: [132, 140],
    size: 0.4,
    sounds: [
      [900, playCrack],
      [1400, playPop],
      [1900, playRustle],
      [2600, playRustle],
      [3300, playSplash],
    ],
    back: turtleBack,
    front: turtleFront,
  },
  {
    id: "krokodilei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🐊",
    adult: "Krokodil",
    the: "das Krokodil",
    a: "ein Krokodil",
    spot: [100, 100],
    size: 0.5,
    sounds: [
      [900, playCrack],
      [1400, playPop],
      [2300, playSplash],
      [3000, playBlub],
    ],
    back: crocBack,
    front: crocFront,
  },
  {
    id: "dinoei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🦕",
    adult: "Dinosaurier",
    the: "der Dinosaurier",
    a: "ein Dinosaurier",
    spot: [96, 92],
    size: 0.6,
    sounds: [
      [100, playThump],
      [500, playThump],
      [900, playCrack],
      [1400, playPop],
      [2300, playTrill],
      [3100, playTwinkle],
    ],
    back: dinoBack,
    front: dinoFront,
  },
  {
    id: "pinguinei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🐧",
    adult: "Pinguin",
    the: "der Pinguin",
    a: "ein Pinguin",
    spot: [100, 128],
    size: 0.36,
    sounds: [
      [900, playCrack],
      [1400, playPop],
      [2600, () => playHop()],
      [2900, () => playHop()],
      [3300, playTwinkle],
    ],
    back: penguinBack,
    front: penguinFront,
  },
  {
    id: "schlangenei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🐍",
    adult: "Schlange",
    the: "die Schlange",
    a: "eine Schlange",
    spot: [140, 118],
    size: 0.42,
    sounds: [
      [200, playRustle],
      [900, playCrack],
      [1300, playPop],
      [2000, playHiss],
      [3000, playTwinkle],
    ],
    back: snakeBack,
    front: snakeFront,
  },
  {
    id: "fischei",
    young: "Ei",
    fromThe: "dem Ei",
    emoji: "🐟",
    adult: "Fisch",
    the: "der Fisch",
    a: "ein Fisch",
    spot: [132, 102],
    size: 0.34,
    sounds: [
      [0, playBlub],
      [800, playBlub],
      [1300, playPop],
      [2100, playSwirl],
      [3000, playTwinkle],
    ],
    back: fishBack,
    front: fishFront,
  },
  {
    id: "larve",
    young: "Larve",
    fromThe: "der Larve",
    emoji: "🐝",
    adult: "Biene",
    the: "die Biene",
    a: "eine Biene",
    spot: [152, 46],
    size: 0.32,
    sounds: [
      [0, playRustle],
      [800, playPop],
      [1700, playCrack],
      [2000, playBuzz],
      [3200, playTwinkle],
    ],
    back: larvaBack,
  },
  {
    id: "karottensamen",
    young: "Samen",
    fromThe: "dem Samen",
    emoji: "🥕",
    adult: "Karotte",
    the: "die Karotte",
    a: "eine Karotte",
    plant: true,
    spot: [100, 118],
    size: 0.46,
    sounds: [
      [200, playPlop],
      [700, playTrill],
      [2000, playRustle],
      [2700, playPop],
      [3200, playTwinkle],
    ],
    back: carrotBack,
    front: carrotFront,
  },
  {
    id: "maiskorn",
    young: "Maiskorn",
    fromThe: "dem Maiskorn",
    emoji: "🌽",
    adult: "Mais",
    the: "der Mais",
    a: "Mais",
    plant: true,
    spot: [124, 108],
    size: 0.3,
    sounds: [
      [200, playPlop],
      [700, playTrill],
      [1600, playLeaves],
      [2400, playPop],
      [3100, playTwinkle],
    ],
    back: cornBack,
    front: cornFront,
  },
  {
    id: "schirmchen",
    young: "Schirmchen",
    fromThe: "dem Schirmchen",
    emoji: "🌼",
    adult: "Löwenzahn",
    the: "der Löwenzahn",
    a: "ein Löwenzahn",
    plant: true,
    spot: [100, 70],
    size: 0.36,
    sounds: [
      [0, playWhoosh],
      [1500, playPlop],
      [1800, playTrill],
      [2600, playPop],
      [3200, playTwinkle],
    ],
    back: fluffBack,
    front: fluffFront,
  },
  {
    id: "erdbeersamen",
    young: "Samen",
    fromThe: "dem Samen",
    emoji: "🍓",
    adult: "Erdbeere",
    the: "die Erdbeere",
    a: "eine Erdbeere",
    plant: true,
    spot: [146, 134],
    size: 0.28,
    sounds: [
      [200, playPlop],
      [600, playTrill],
      [1400, playPop],
      [2500, playRustle],
      [3200, playTwinkle],
    ],
    back: strawberryBack,
    front: strawberryFront,
  },
];

/**
 * Small ones never offered together in one round (`dealGrow`): the grown one of each could, to a child, also come
 * out of the other, so it would be a wrong choice the child could rightly pick. Any two in one group are never dealt
 * together. Every plant is alike to every other: flowers look alike, trees look alike, and no child can see which
 * seed, nut, bulb or bud becomes which plant. A new small one joins a group, or starts one with what it looks like
 * (every egg is alike to every other egg, the bee's larva to the caterpillar); every growth must keep at least three
 * others it is not alike to, for the four choices of the hardest steps (`content.test.ts`).
 */
export const GROW_LOOKALIKES: GrowthId[][] = [
  // Every plant (`plant`).
  ["samen", "eichel", "zwiebel", "kuerbiskern", "kokosnuss", "knospe", "karottensamen", "maiskorn", "schirmchen", "erdbeersamen"],
  // Every egg: a child can't tell which egg the chick, the turtle or the dinosaur comes out of.
  ["ei", "schildkroetenei", "krokodilei", "dinoei", "pinguinei", "schlangenei", "fischei"],
  // The larvae: the caterpillar's and the bee's.
  ["raupe", "larve"],
  // What comes out of the water by the pond or the river: the frog comes from eggs in the water too.
  ["kaulquappe", "fischei", "krokodilei"],
];

/** Whether `a` and `b` are never offered together (`GROW_LOOKALIKES`). */
export const growLookAlike = (a: Growth, b: Growth) => GROW_LOOKALIKES.some((group) => group.includes(a.id) && group.includes(b.id));

/**
 * The small one in its box; `growing` sets it off becoming what it becomes, which shows at the end (`label` names it
 * for screen readers). Without `growing` only the small one shows, as behind a wrong plate.
 */
export function GrowthPicture({ growth, growing = false, label }: { growth: Growth; growing?: boolean; label?: string }) {
  return (
    <span className={`ap-grow-box grow-${growth.id}${growing ? " growing" : ""}`} role="img" aria-label={label} aria-hidden={label ? undefined : true}>
      <svg className="ap-grow-layer" viewBox="0 0 200 200" aria-hidden>
        {growth.back}
      </svg>
      {growing && (
        <span
          className="ap-grow-adult ap-emoji"
          style={{ left: `${growth.spot[0] / 2}%`, top: `${growth.spot[1] / 2}%`, fontSize: `${growth.size * 100}cqw` }}
          aria-hidden
        >
          {growth.emoji}
        </span>
      )}
      {growth.front && (
        <svg className="ap-grow-layer" viewBox="0 0 200 200" aria-hidden>
          {growth.front}
        </svg>
      )}
    </span>
  );
}

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** What "Was wird aus mir?" says, in one language. */
export interface GrowTexts {
  /** The small one's name, for screen readers: "Raupe". */
  young: (g: Growth) => string;
  /** What it becomes, for screen readers: "Schmetterling". */
  adult: (g: Growth) => string;
  /** The question: "Was wird aus der Raupe?". */
  whatBecomes: (g: Growth) => string;
  /** The right pick: "Aus der Raupe wird ein Schmetterling. Toll!". */
  becomes: (g: Growth) => string;
  /** A wrong pick, while the small one it comes from pops up: "Der Frosch kommt aus der Kaulquappe!". */
  comesFrom: (g: Growth) => string;
}

const GERMAN_GROW_TEXTS: GrowTexts = {
  young: (g) => g.young,
  adult: (g) => g.adult,
  whatBecomes: (g) => `Was wird aus ${g.fromThe}?`,
  becomes: (g) => `Aus ${g.fromThe} wird ${g.a}. Toll!`,
  comesFrom: (g) => `${capitalize(g.the)} kommt aus ${g.fromThe}!`,
};

/** The texts of "Was wird aus mir?" by app language (the other languages in content.<lang>.ts, `growth`): `pick(GROW_TEXTS, language.id)`. */
export const GROW_TEXTS: Localized<GrowTexts> = byLanguage((texts) => texts.animals?.growth(GERMAN_GROW_TEXTS), GERMAN_GROW_TEXTS);
