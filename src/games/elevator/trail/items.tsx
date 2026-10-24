import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";

// The things the child finds on the way and carries in its bag, and the things a level is about
// (the kite that flies away). Each is drawn standing on (0, 0), centred, so the same drawing works
// in the world, in a bag slot and in the thought bubble.

/** A thing that fits into the bag. */
export type ItemId = "ball" | "carrot" | "plank" | "lantern" | "apple";

/** A drawing and its size, to fit it into a slot, a bubble or a card. */
export interface Picture {
  w: number;
  h: number;
  draw: () => ReactNode;
}

export function Ball() {
  return (
    <g>
      <circle cx="0" cy="-30" r="30" fill="#ff6b6b" stroke={INK} strokeWidth="4" />
      <path d="M-30 -30 Q0 -14 30 -30" stroke="#fff" strokeWidth="8" fill="none" />
      <path d="M-14 -56 Q-4 -30 -14 -4" stroke="#4dabf7" strokeWidth="7" fill="none" />
      <circle cx="-11" cy="-44" r="6" fill="#fff" opacity="0.7" />
    </g>
  );
}

export function Carrot() {
  return (
    <g>
      <g fill="#51cf66" stroke="#2b8a3e" strokeWidth="3" strokeLinejoin="round">
        <path d="M0 -84 Q-26 -112 -20 -128 Q-4 -112 0 -88 Z" />
        <path d="M0 -86 Q2 -124 12 -134 Q18 -110 4 -86 Z" />
        <path d="M2 -84 Q26 -106 34 -104 Q22 -88 4 -82 Z" />
      </g>
      <path d="M-16 -86 Q0 -92 16 -86 Q8 -40 0 0 Q-8 -40 -16 -86 Z" fill="#ff922b" stroke="#d9480f" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-9 -66 h8 M3 -50 h7 M-6 -32 h6" stroke="#d9480f" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** A board, lying flat; leaning against the shed it is rotated. */
export function Plank() {
  return (
    <g>
      <rect x="-110" y="-26" width="220" height="26" rx="6" fill="#ffe3a3" stroke={INK} strokeWidth="5" />
      <path d="M-90 -15 Q-40 -20 0 -14 T80 -15" stroke="#d9a066" strokeWidth="3" fill="none" />
      <circle cx="-96" cy="-13" r="3.5" fill={INK} />
      <circle cx="96" cy="-13" r="3.5" fill={INK} />
    </g>
  );
}

/** A lantern on its ring; `lit` makes it glow. */
export function Lantern({ lit = false }: { lit?: boolean }) {
  return (
    <g>
      {lit && <circle className="tl-lantern-glow" cx="0" cy="-44" r="70" fill="#ffe066" opacity="0.35" />}
      <circle cx="0" cy="-104" r="12" fill="none" stroke={INK} strokeWidth="5" />
      <path d="M-26 -78 L0 -96 L26 -78 Z" fill="#e03131" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <rect x="-22" y="-78" width="44" height="64" rx="6" fill={lit ? "#ffe066" : "#fff3bf"} stroke={INK} strokeWidth="4" />
      <path d="M0 -76 V-16 M-20 -46 H20" stroke={INK} strokeWidth="3" opacity="0.5" />
      <ellipse cx="0" cy="-42" rx="7" ry="11" fill="#ff922b" />
      <rect x="-28" y="-16" width="56" height="16" rx="5" fill="#e03131" stroke={INK} strokeWidth="4" />
    </g>
  );
}

export function Apple() {
  return (
    <g>
      <path d="M0 -50 Q-4 -62 -2 -70" stroke="#8d5a3b" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M0 -62 Q14 -76 26 -66 Q14 -56 0 -62 Z" fill="#51cf66" stroke="#2b8a3e" strokeWidth="3" />
      <path
        d="M0 -48 Q-12 -58 -24 -50 Q-36 -38 -28 -16 Q-20 2 -8 0 Q0 -4 8 0 Q20 2 28 -16 Q36 -38 24 -50 Q12 -58 0 -48 Z"
        fill="#fa5252"
        stroke="#c92a2a"
        strokeWidth="3.5"
      />
      <ellipse cx="-14" cy="-34" rx="5" ry="9" fill="#fff" opacity="0.6" />
    </g>
  );
}

/** The kite: the string is tied to (0, 0), the bottom tip; the tail hangs from there. */
export function Kite({ tail = true }: { tail?: boolean }) {
  return (
    <g>
      {tail && (
        <g className="tl-kite-tail">
          <path d="M0 0 Q-24 30 0 60 Q24 90 0 120" stroke={INK} strokeWidth="3" fill="none" />
          {[
            [-10, 30, "#ffd43b"],
            [8, 72, "#51cf66"],
            [-4, 108, "#4dabf7"],
          ].map(([x, y, c]) => (
            <path key={y} d={`M${x} ${y} l-14 -9 v18 Z M${x} ${y} l14 -9 v18 Z`} fill={c as string} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          ))}
        </g>
      )}
      <path d="M0 -160 L58 -96 L0 0 L-58 -96 Z" fill="#ff6b6b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M0 -160 L58 -96 L0 -96 Z M0 -96 L-58 -96 L0 0 Z" fill="#ffd43b" />
      <path d="M0 -160 V0 M-58 -96 H58" stroke={INK} strokeWidth="4" />
      <path d="M0 -160 L58 -96 L0 0 L-58 -96 Z" fill="none" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </g>
  );
}

/** The things of the bag, for the slots and the throws. */
export const ITEMS: Record<ItemId, Picture> = {
  ball: { w: 64, h: 64, draw: () => <Ball /> },
  carrot: { w: 70, h: 134, draw: () => <Carrot /> },
  plank: { w: 224, h: 30, draw: () => <Plank /> },
  lantern: { w: 60, h: 118, draw: () => <Lantern /> },
  apple: { w: 64, h: 72, draw: () => <Apple /> },
};

/** Pictures of what a level is about, for its card and the thought bubble. */
export const GOALS = {
  kite: { w: 120, h: 164, draw: () => <Kite tail={false} /> },
} satisfies Record<string, Picture>;

export type GoalId = keyof typeof GOALS;

/** `picture` scaled to fit a `width` × `height` box around (0, 0). */
export function Fitted({ picture, width, height = width }: { picture: Picture; width: number; height?: number }) {
  const s = Math.min(width / picture.w, height / picture.h);
  return <g transform={`translate(0 ${(picture.h * s) / 2}) scale(${s})`}>{picture.draw()}</g>;
}
