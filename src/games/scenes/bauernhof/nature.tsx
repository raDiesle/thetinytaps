import type { CSSProperties } from "react";
import { nth } from "../shared";

// Apple tree and hay bale. Foot point at (0, 0).

const CROWN = [
  [0, -206, 84, "#52b788"],
  [-66, -164, 58, "#40916c"],
  [64, -170, 60, "#40916c"],
  [-24, -258, 48, "#52b788"],
  [34, -246, 44, "#40916c"],
] as const;

// Apples: x, y. They fall down to the ground (y = 0) and pop back into the tree.
const APPLES = [
  [-44, -186],
  [34, -214],
  [72, -150],
  [-86, -150],
  [8, -146],
  [-12, -250],
];

/** Apple tree; the crown shakes and the apples fall into the grass. */
export function Baum() {
  return (
    <>
      <path d="M-16 0 Q-8 -60 -11 -120 H11 Q8 -60 16 0 Z" fill="#8d5a2b" />
      <path d="M-4 -24 Q0 -60 -2 -100" stroke="#6b4423" strokeWidth="3" fill="none" />
      <path d="M0 -76 L-34 -120 M2 -96 L30 -132" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      <g className="bh-baum-crown" style={{ transformOrigin: "0px -120px" }}>
        {CROWN.map(([cx, cy, r, fill]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx="-32" cy="-270" r="16" fill="#74c69d" />
        <circle cx="-30" cy="-222" r="24" fill="#74c69d" opacity="0.6" />
      </g>
      {APPLES.map(([cx, cy], i) => (
        <g key={cx} className="bh-baum-apple" style={{ ...nth(i), "--fall": `${-cy - 8}px` } as CSSProperties}>
          <circle cx={cx} cy={cy} r="10" fill="#e63946" />
          <circle cx={cx - 3} cy={cy - 3} r="3" fill="#fff" opacity="0.6" />
          <path d={`M${cx} ${cy - 9} l2 -6`} stroke="#6b4423" strokeWidth="2" />
        </g>
      ))}
    </>
  );
}

/** Round hay bale; it rolls away a little and back. */
export function Heuballen() {
  return (
    <g className="bh-heu-roll" style={{ transformOrigin: "0px -58px" }}>
      <circle cx="0" cy="-58" r="58" fill="#e9b949" />
      <circle cx="0" cy="-58" r="58" fill="none" stroke="#c89b2c" strokeWidth="4" />
      <path d="M0 -58 m-6 0 a6 6 0 1 1 12 0 a16 16 0 1 1 -28 -6 a28 28 0 1 1 48 18 a40 40 0 1 1 -66 -28" stroke="#c89b2c" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M-30 -104 a54 54 0 0 1 40 -10" stroke="#fff" strokeOpacity="0.5" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M-56 -40 l-10 4 M-50 -90 l-10 -6 M50 -94 l10 -6 M56 -36 l10 4" stroke="#e9b949" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}
