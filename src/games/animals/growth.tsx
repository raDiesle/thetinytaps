import type { ReactNode } from "react";
import { playBlub, playCrack, playHop, playKnock, playLeaves, playPlop, playPop, playRustle, playTrill, playTwinkle, playWhoosh } from "@/lib/sfx";
import { playCroak, playTweet } from "@/lib/realSounds";
import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";

// Something small and what it becomes, for "Was wird aus mir?" (Z-12): caterpillar and butterfly, egg and chick,
// seed and sunflower, tadpole and frog, acorn and tree, bulb and tulip, pumpkin seed and pumpkin, coconut and palm,
// bud and rose. The small one is drawn in a 200 × 200 box, standing on its bottom edge, in two layers: `back` behind
// what it becomes (an emoji, as on the plates below) and `front` before it (the egg's lower shell and the nest, the
// soil, the pot). The parts with an `ap-grow-…` class move once the box is `.growing` (animals.css): the caterpillar
// climbs up and spins itself in, the egg wobbles and cracks, the seeds, the acorn and the bulb sink in and sprout, the
// tadpole grows legs and loses its tail, the coconut sprouts where it lies, the bud swells and opens.

/** Time to watch it become it (after the picked one flew up into it) before the next round comes. */
export const GROW_MS = 3900;

export type GrowthId = "raupe" | "ei" | "samen" | "kaulquappe" | "eichel" | "zwiebel" | "kuerbiskern" | "kokosnuss" | "knospe";

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
];

/**
 * Small ones never offered together in one round (`dealGrow`): the grown one of each could, to a child, also come
 * out of the other, so it would be a wrong choice the child could rightly pick. Any two in one group are never dealt
 * together. Every plant is alike to every other: flowers look alike, trees look alike, and no child can see which
 * seed, nut, bulb or bud becomes which plant. A new small one joins a group, or starts one with what it looks like
 * (a second egg or larva would be alike to the egg or the caterpillar); every growth must keep at least three others
 * it is not alike to, for the four choices of the hardest steps (`content.test.ts`).
 */
export const GROW_LOOKALIKES: GrowthId[][] = [["samen", "eichel", "zwiebel", "kuerbiskern", "kokosnuss", "knospe"]];

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
