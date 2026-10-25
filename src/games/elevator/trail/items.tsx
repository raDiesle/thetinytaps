import type { ReactNode } from "react";
import { INK } from "@/games/scenes/shared";

// The things the child finds on the way and carries in its bag, and the things a level is about
// (the kite that flies away). Each is drawn standing on (0, 0), centred, so the same drawing works
// in the world, in a bag slot and in the thought bubble.

/** A thing that fits into the bag. */
export type ItemId = "ball" | "carrot" | "plank" | "lantern" | "apple" | "pretzel" | "can" | "shovel";

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

/** A pretzel, salted: a brown rope with its arms crossed in the middle. */
export function Pretzel() {
  const rope = "M-34 -14 C-20 -30 20 -48 12 -64 C4 -80 -46 -78 -46 -48 C-46 -22 -12 -8 0 -8 C12 -8 46 -22 46 -48 C46 -78 -4 -80 -12 -64 C-20 -48 20 -30 34 -14";
  return (
    <g>
      <path d={rope} stroke={INK} strokeWidth="22" fill="none" strokeLinecap="round" />
      <path d={rope} stroke="#c8742c" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M-40 -56 Q-36 -70 -20 -72" stroke="#e8a35c" strokeWidth="4" fill="none" strokeLinecap="round" />
      {[
        [-38, -40],
        [-24, -16],
        [30, -20],
        [40, -50],
        [22, -70],
        [-28, -70],
        [0, -36],
      ].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x - 2.5} y={y - 2.5} width="5" height="5" rx="1" fill="#fff" />
      ))}
    </g>
  );
}

/** A watering can, its spout to the right; tilted, it pours. */
export function WateringCan() {
  return (
    <g>
      <path d="M-26 -60 Q-58 -60 -54 -30 Q-52 -14 -34 -14" stroke={INK} strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M-26 -60 Q-58 -60 -54 -30 Q-52 -14 -34 -14" stroke="#339af0" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M24 -36 L64 -72" stroke={INK} strokeWidth="13" strokeLinecap="round" />
      <path d="M24 -36 L64 -72" stroke="#339af0" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="68" cy="-76" rx="9" ry="14" transform="rotate(-48 68 -76)" fill="#74c0fc" stroke={INK} strokeWidth="4" />
      <path d="M-32 -64 H32 V-6 Q32 0 26 0 H-26 Q-32 0 -32 -6 Z" fill="#339af0" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-18 -56 V-12" stroke="#a5d8ff" strokeWidth="6" strokeLinecap="round" />
      <rect x="-36" y="-70" width="72" height="10" rx="4" fill="#1c7ed6" stroke={INK} strokeWidth="4" />
    </g>
  );
}

/** A sand shovel, standing on its blade. */
export function Shovel() {
  return (
    <g>
      <rect x="-6" y="-112" width="12" height="74" rx="5" fill="#e03131" stroke={INK} strokeWidth="4" />
      <rect x="-18" y="-120" width="36" height="14" rx="7" fill="#e03131" stroke={INK} strokeWidth="4" />
      <path d="M-26 -44 H26 Q26 -10 0 0 Q-26 -10 -26 -44 Z" fill="#fcc419" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-14 -36 Q-12 -18 0 -10" stroke="#fff3bf" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A football, black patches on white; it rolls round its middle at (0, -34). */
export function Football() {
  return (
    <g>
      <circle cx="0" cy="-34" r="34" fill="#fff" stroke={INK} strokeWidth="4.5" />
      <path d="M0 -46 L11 -38 L7 -25 H-7 L-11 -38 Z" fill={INK} />
      <path d="M0 -46 V-62 M11 -38 L26 -44 M7 -25 L16 -12 M-7 -25 L-16 -12 M-11 -38 L-26 -44" stroke={INK} strokeWidth="3" />
      <path d="M-8 -66 Q0 -69 8 -66 L5 -60 H-5 Z M22 -56 L31 -46 L28 -40 L22 -46 Z M-22 -56 L-31 -46 L-28 -40 L-22 -46 Z" fill={INK} />
      <path d="M12 -6 L20 -2 L24 -10 L18 -14 Z M-12 -6 L-20 -2 L-24 -10 L-18 -14 Z" fill={INK} />
      <circle cx="-14" cy="-50" r="5" fill="#fff" opacity="0.8" />
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
  pretzel: { w: 104, h: 84, draw: () => <Pretzel /> },
  can: { w: 140, h: 94, draw: () => <WateringCan /> },
  shovel: { w: 56, h: 124, draw: () => <Shovel /> },
};

/** What a level is about: its picture, and how the child carries it in the world. */
export interface Goal extends Picture {
  /** The drawing in the world, when it differs from the picture (the kite with its tail). */
  world?: () => ReactNode;
  /** "string": it flies above the child on a string (the kite); "hands": the child holds it. */
  carry: "string" | "hands";
  /** For a ball: its radius; it turns as it rolls along. */
  roll?: number;
}

export type GoalId = "kite" | "football";

/** Pictures of what a level is about, for its card and the thought bubble, and how they move. */
export const GOALS: Record<GoalId, Goal> = {
  kite: { w: 120, h: 164, draw: () => <Kite tail={false} />, world: () => <Kite />, carry: "string" },
  football: { w: 72, h: 72, draw: () => <Football />, carry: "hands", roll: 34 },
};

/** `picture` scaled to fit a `width` × `height` box around (0, 0). */
export function Fitted({ picture, width, height = width }: { picture: Picture; width: number; height?: number }) {
  const s = Math.min(width / picture.w, height / picture.h);
  return <g transform={`translate(0 ${(picture.h * s) / 2}) scale(${s})`}>{picture.draw()}</g>;
}
