import type { ReactNode } from "react";

// What animals give us, for "Was gibt uns das Tier?" (Z-01). Each one is drawn in a 100 × 100 box, standing on its
// bottom edge. The parts with an `ap-gift-…` class move while the animal makes it (`.ap-made` in animals.css): the
// milk and the honey rise in their glass, the egg drops into the nest, the ball of wool rolls out, the cheese drops onto
// its board.

export type GiftId = "milch" | "ei" | "honig" | "wolle" | "kaese";

export interface Gift {
  id: GiftId;
  /** The German name, for screen readers: "Milch". */
  name: string;
  /** With its article, "das Ei", for "Das Ei kommt vom Huhn!". */
  the: string;
  /** What the animal gives us, for "Das Huhn gibt uns Eier.". */
  gives: string;
  /**
   * The id of the animal it comes from, the best-known one (the hen's egg, not the duck's): it pops up when the gift is
   * given to another animal, „Das Ei kommt vom Huhn!“ (`giverOf`).
   */
  giver: string;
  drawing: ReactNode;
}

const OUTLINE = "#5a4636";

const milch = (
  <>
    <path d="M26 14 H74 L68 94 H32 Z" fill="#bfe3fa" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    <path className="ap-gift-stream" d="M50 -30 V40" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
    <g className="ap-gift-fill">
      <path d="M29 30 H71 L67.5 92 H32.5 Z" fill="#fff" />
      <path d="M58 30 H71 L67.5 92 H56 Z" fill="#e4edf4" />
      <ellipse cx="50" cy="30" rx="21" ry="4" fill="#f2f6f9" />
    </g>
    <path d="M60 22 L56 84" stroke="#fff" strokeOpacity="0.9" strokeWidth="4" strokeLinecap="round" />
    <path d="M26 14 H74 L68 94 H32 Z" fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
  </>
);

const ei = (
  <>
    <path d="M6 70 Q8 96 50 97 Q92 96 94 70 Z" fill="#a47148" />
    <path d="M62 96 Q92 95 94 70 H76 Q76 90 62 96 Z" fill="#8b5e3c" />
    <g className="ap-gift-egg">
      <ellipse cx="50" cy="52" rx="21" ry="27" fill="#fff6e6" stroke={OUTLINE} strokeWidth="3" />
      <ellipse cx="42" cy="42" rx="5" ry="8" fill="#fff" />
    </g>
    <ellipse cx="50" cy="70" rx="44" ry="10" fill="#c08552" />
    <path d="M14 70 Q30 80 50 79 Q70 80 86 70" stroke="#6f4e37" strokeWidth="3" fill="none" />
    {["M12 80 Q30 88 48 84", "M40 92 Q62 86 86 88", "M20 70 Q30 64 40 66", "M62 65 Q76 63 86 70"].map((d) => (
      <path key={d} d={d} stroke="#e0b084" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    ))}
  </>
);

const honig = (
  <>
    <path className="ap-gift-stream" d="M50 -30 V40" stroke="#f4a259" strokeWidth="6" strokeLinecap="round" />
    <rect x="22" y="28" width="56" height="66" rx="14" fill="#fff4d6" stroke={OUTLINE} strokeWidth="3" />
    <rect className="ap-gift-fill" x="25" y="40" width="50" height="51" rx="11" fill="#f4a259" />
    <path d="M30 52 Q32 74 30 84" stroke="#ffd27f" strokeWidth="4" strokeLinecap="round" fill="none" />
    <rect x="22" y="28" width="56" height="66" rx="14" fill="none" stroke={OUTLINE} strokeWidth="3" />
    <rect x="18" y="16" width="64" height="14" rx="5" fill="#e63946" stroke={OUTLINE} strokeWidth="3" />
    <path d="M28 16 V30 M40 16 V30 M52 16 V30 M64 16 V30 M74 16 V30" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" />
  </>
);

const wolle = (
  <g className="ap-gift-ball">
    <path d="M78 82 Q90 90 98 80" stroke="#b99766" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="60" r="36" fill="#f3e3c3" stroke={OUTLINE} strokeWidth="3" />
    {["M22 44 Q50 34 78 50", "M16 62 Q48 50 84 70", "M24 82 Q52 66 80 84", "M38 26 Q30 60 44 94", "M62 26 Q74 60 60 95"].map((d) => (
      <path key={d} d={d} stroke="#b99766" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    ))}
  </g>
);

// A wedge of cheese with its holes, on a round wooden board; the wedge drops onto the board.
const kaese = (
  <>
    <ellipse cx="50" cy="86" rx="46" ry="10" fill="#8b5e3c" />
    <ellipse cx="50" cy="82" rx="46" ry="10" fill="#c08552" stroke={OUTLINE} strokeWidth="3" />
    <path d="M14 80 Q50 90 86 80" stroke="#e0b084" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <g className="ap-gift-cheese">
      <path d="M64 54 L94 24 V56 L64 86 Z" fill="#f4a72c" />
      <path d="M8 46 L64 54 V86 L8 78 Z" fill="#ffd04d" />
      <path d="M8 46 L94 24 L64 54 Z" fill="#ffe589" />
      <ellipse cx="24" cy="63" rx="7" ry="5" fill="#e3a92f" />
      <ellipse cx="45" cy="74" rx="5" ry="4" fill="#e3a92f" />
      <ellipse cx="52" cy="61" rx="3.5" ry="3" fill="#e3a92f" />
      <ellipse cx="17" cy="75" rx="3" ry="2.5" fill="#e3a92f" />
      <ellipse cx="62" cy="38" rx="7" ry="2.6" fill="#efc24c" />
      <ellipse cx="38" cy="44" rx="4" ry="1.8" fill="#efc24c" />
      <path d="M78 32 Q84 36 86 30" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M8 46 L94 24 V56 L64 86 L8 78 Z M64 54 V86 M8 46 L64 54 L94 24" fill="none" stroke={OUTLINE} strokeWidth="3" strokeLinejoin="round" />
    </g>
  </>
);

export const GIFTS: Record<GiftId, Gift> = {
  milch: { id: "milch", name: "Milch", the: "die Milch", gives: "Milch", giver: "kuh", drawing: milch },
  ei: { id: "ei", name: "Ei", the: "das Ei", gives: "Eier", giver: "huhn", drawing: ei },
  honig: { id: "honig", name: "Honig", the: "der Honig", gives: "Honig", giver: "biene", drawing: honig },
  wolle: { id: "wolle", name: "Wolle", the: "die Wolle", gives: "Wolle", giver: "schaf", drawing: wolle },
  kaese: { id: "kaese", name: "Käse", the: "der Käse", gives: "Käse", giver: "kuh", drawing: kaese },
};

/** The drawing of `gift`; `label` is its name in the app language, for screen readers. */
export function GiftDrawing({ gift, label }: { gift: Gift; label?: string }) {
  return (
    <svg className="gift-drawing" viewBox="0 0 100 100" role="img" aria-label={label} aria-hidden={label ? undefined : true}>
      {gift.drawing}
    </svg>
  );
}
