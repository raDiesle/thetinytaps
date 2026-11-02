import type { ReactNode } from "react";

// What animals give us, for "Was gibt uns das Tier?" (Z-01). Each one is drawn in a 100 × 100 box, standing on its
// bottom edge. The parts with an `ap-gift-…` class move while the animal makes it (`.ap-made` in animals.css): the
// milk and the honey rise in their glass, the egg drops into the nest, the ball of wool rolls out.

export type GiftId = "milch" | "ei" | "honig" | "wolle";

export interface Gift {
  id: GiftId;
  /** The German name, for screen readers: "Milch". */
  name: string;
  /** With its article, "das Ei", for "Das Ei kommt vom Huhn!". */
  the: string;
  /** What the animal gives us, for "Das Huhn gibt uns Eier.". */
  gives: string;
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

export const GIFTS: Record<GiftId, Gift> = {
  milch: { id: "milch", name: "Milch", the: "die Milch", gives: "Milch", drawing: milch },
  ei: { id: "ei", name: "Ei", the: "das Ei", gives: "Eier", drawing: ei },
  honig: { id: "honig", name: "Honig", the: "der Honig", gives: "Honig", drawing: honig },
  wolle: { id: "wolle", name: "Wolle", the: "die Wolle", gives: "Wolle", drawing: wolle },
};

/** The drawing of `gift`; `label` is its name in the app language, for screen readers. */
export function GiftDrawing({ gift, label }: { gift: Gift; label?: string }) {
  return (
    <svg className="gift-drawing" viewBox="0 0 100 100" role="img" aria-label={label} aria-hidden={label ? undefined : true}>
      {gift.drawing}
    </svg>
  );
}
