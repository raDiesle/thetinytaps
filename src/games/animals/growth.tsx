import type { ReactNode } from "react";
import { playBlub, playCrack, playPlop, playPop, playRustle, playTrill, playTwinkle, playWhoosh } from "@/lib/sfx";
import { playCroak, playTweet } from "@/lib/realSounds";
import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";

// Something small and what it becomes, for "Was wird aus mir?" (Z-12): caterpillar and butterfly, egg and chick,
// seed and sunflower, tadpole and frog. The small one is drawn in a 200 × 200 box, standing on its bottom edge, in
// two layers: `back` behind what it becomes (an emoji, as on the plates below) and `front` before it (the egg's lower
// shell and the nest, the soil). The parts with an `ap-grow-…` class move once the box is `.growing` (animals.css):
// the caterpillar climbs up and spins itself in, the egg wobbles and cracks, the seed sinks in and sprouts, the
// tadpole grows legs and loses its tail.

/** Time to watch it become it (after the picked one flew up into it) before the next round comes. */
export const GROW_MS = 3900;

export type GrowthId = "raupe" | "ei" | "samen" | "kaulquappe";

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

/** The four small ones and what they become; each becomes something none of the others does. */
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
];

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
