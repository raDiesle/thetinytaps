// Everyday things for the "Alles fällt um" level. Each is drawn standing on
// the floor with its bottom left corner at (0, 0), so it reaches up to y = -h;
// it falls over to the right, turning around its bottom right corner.

import type { ReactNode } from "react";
import { playClonk, playKnock, playRustle, playThump } from "@/lib/sfx";

const INK = "#2a1e5c";
const LINE = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };

export interface Thing {
  kind: string;
  /** Said when speech is on. */
  name: string;
  w: number;
  h: number;
  /** Knock when it hits the next one. */
  sound: () => void;
  draw: () => ReactNode;
}

const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

function crayon(): Thing {
  const color = pick(["#ff5d73", "#3a86ff", "#3ec300", "#ffb703", "#8e7dff"]);
  const w = 28;
  const h = 130;
  return {
    kind: "crayon",
    name: "Buntstift",
    w,
    h,
    sound: () => playKnock(1500),
    draw: () => (
      <>
        <path d={`M0 0 L0 ${-h + 30} L${w} ${-h + 30} L${w} 0 Z`} fill={color} {...LINE} />
        <path d={`M0 ${-h + 30} L${w / 2 - 4} ${-h + 4} L${w / 2 + 4} ${-h + 4} L${w} ${-h + 30} Z`} fill="#f7d9a8" {...LINE} />
        <path d={`M${w / 2 - 4} ${-h + 4} L${w / 2} ${-h} L${w / 2 + 4} ${-h + 4} Z`} fill={color} {...LINE} />
        <rect x="0" y={-h + 44} width={w} height="56" fill="#fff6" />
        <line x1="4" y1={-h + 56} x2={w - 4} y2={-h + 56} stroke={INK} strokeWidth="2" />
        <line x1="4" y1={-h + 88} x2={w - 4} y2={-h + 88} stroke={INK} strokeWidth="2" />
      </>
    ),
  };
}

function block(): Thing {
  const letter = pick(["A", "B", "M", "O"]);
  const color = pick(["#ff5d73", "#3a86ff", "#3ec300", "#8e7dff"]);
  const w = 58;
  const h = 104;
  return {
    kind: "block",
    name: "Bauklotz",
    w,
    h,
    sound: () => playKnock(900),
    draw: () => (
      <>
        <rect x="0" y={-h} width={w} height={h} rx="5" fill="#f4c06a" {...LINE} />
        <rect x="8" y={-h + 8} width={w - 16} height={h - 16} rx="4" fill="none" stroke="#c98a3a" strokeWidth="3" />
        <text x={w / 2} y={-h / 2 + 16} textAnchor="middle" fontSize="46" fontWeight="700" fill={color} stroke={INK} strokeWidth="2">
          {letter}
        </text>
      </>
    ),
  };
}

function toiletRoll(): Thing {
  const w = 74;
  const h = 96;
  return {
    kind: "roll",
    name: "Klopapierrolle",
    w,
    h,
    sound: playThump,
    draw: () => (
      <>
        <rect x="0" y={-h} width={w} height={h} rx="8" fill="#fdfcf7" {...LINE} />
        <ellipse cx={w / 2} cy={-h + 2} rx={w / 2 - 2} ry="9" fill="#fff" {...LINE} />
        <ellipse cx={w / 2} cy={-h + 2} rx="13" ry="4" fill="#d9c39a" stroke={INK} strokeWidth="2" />
        <path d={`M${w} ${-h + 30} L${w + 10} ${-h + 36} L${w + 8} ${-h + 62} L${w} ${-h + 60}`} fill="#fff" {...LINE} />
        {[0.3, 0.55, 0.8].map((k) => (
          <line key={k} x1="6" y1={-h + h * k} x2={w - 6} y2={-h + h * k} stroke="#e3dccb" strokeWidth="2" strokeDasharray="3 6" />
        ))}
      </>
    ),
  };
}

function can(): Thing {
  const color = pick(["#ff5d73", "#3ec300", "#ff8c42"]);
  const w = 60;
  const h = 108;
  return {
    kind: "can",
    name: "Dose",
    w,
    h,
    sound: playClonk,
    draw: () => (
      <>
        <rect x="0" y={-h} width={w} height={h} rx="6" fill="#c9d1db" {...LINE} />
        <rect x="0" y={-h + 22} width={w} height={h - 44} fill={color} {...LINE} />
        <circle cx={w / 2} cy={-h / 2} r="15" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <circle cx={w / 2} cy={-h / 2} r="7" fill={color} />
        <line x1="4" y1={-h + 10} x2={w - 4} y2={-h + 10} stroke="#9aa5b3" strokeWidth="3" />
        <line x1="4" y1={-10} x2={w - 4} y2={-10} stroke="#9aa5b3" strokeWidth="3" />
      </>
    ),
  };
}

function book(): Thing {
  const color = pick(["#ff5d73", "#3a86ff", "#3ec300", "#ffb703", "#8e7dff", "#ff7bd0", "#00b4d8"]);
  const w = pick([34, 40, 46]);
  const h = pick([150, 172, 196, 218]);
  return {
    kind: "book",
    name: "Buch",
    w,
    h,
    sound: () => playKnock(520),
    draw: () => (
      <>
        <rect x="0" y={-h} width={w} height={h} rx="4" fill={color} {...LINE} />
        <rect x="4" y={-h + 14} width={w - 8} height="8" fill="#fff8" />
        <rect x="4" y={-22} width={w - 8} height="8" fill="#fff8" />
        <rect x="7" y={-h / 2 - 22} width={w - 14} height="44" rx="3" fill="#fff" stroke={INK} strokeWidth="2" />
      </>
    ),
  };
}

function juice(): Thing {
  const w = 64;
  const h = 150;
  return {
    kind: "juice",
    name: "Saftpackung",
    w,
    h,
    sound: playThump,
    draw: () => (
      <>
        <path d={`M0 0 L0 ${-h + 26} L${w / 2} ${-h + 6} L${w} ${-h + 26} L${w} 0 Z`} fill="#fff3d1" {...LINE} />
        <line x1={w - 16} y1={-h + 16} x2={w - 4} y2={-h - 2} stroke="#ff5d73" strokeWidth="6" strokeLinecap="round" />
        <rect x="0" y={-h + 40} width={w} height="70" fill="#ff8c42" {...LINE} />
        <circle cx={w / 2} cy={-h + 75} r="20" fill="#ffb703" stroke={INK} strokeWidth="2.5" />
        <path d={`M${w / 2} ${-h + 55} q8 -10 14 -6`} stroke="#3ec300" strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    ),
  };
}

function bottle(): Thing {
  const w = 56;
  const h = 210;
  const neck = 16;
  return {
    kind: "bottle",
    name: "Flasche",
    w,
    h,
    sound: playClonk,
    draw: () => (
      <>
        <path
          d={`M4 0 Q0 0 0 -8 L0 ${-h + 80} Q0 ${-h + 52} ${w / 2 - neck / 2} ${-h + 34} L${w / 2 - neck / 2} ${-h + 18} L${w / 2 + neck / 2} ${-h + 18} L${w / 2 + neck / 2} ${-h + 34} Q${w} ${-h + 52} ${w} ${-h + 80} L${w} -8 Q${w} 0 ${w - 4} 0 Z`}
          fill="#bde9ff"
          {...LINE}
        />
        <path d={`M2 ${-h + 100} L${w - 2} ${-h + 100} L${w - 2} -6 L2 -6 Z`} fill="#4cc9f0" opacity="0.6" />
        <rect x="0" y={-h + 112} width={w} height="44" fill="#3ec300" {...LINE} />
        <rect x={w / 2 - neck / 2 - 3} y={-h} width={neck + 6} height="20" rx="4" fill="#3a86ff" {...LINE} />
        <line x1="10" y1={-h + 90} x2="10" y2={-20} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </>
    ),
  };
}

function cereal(): Thing {
  const w = 94;
  const h = 236;
  return {
    kind: "cereal",
    name: "Müslipackung",
    w,
    h,
    sound: playRustle,
    draw: () => (
      <>
        <rect x="0" y={-h} width={w} height={h} rx="4" fill="#ffd23f" {...LINE} />
        <rect x="0" y={-h} width={w} height="46" fill="#ff5d73" {...LINE} />
        <path d={`M14 ${-h + 24} q10 -14 20 0 t20 0 t20 0`} stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d={`M12 -78 Q${w / 2} -20 ${w - 12} -78 Z`} fill="#fff" {...LINE} />
        {[22, 34, 47, 60, 72].map((x, i) => (
          <circle key={x} cx={x} cy={-82 - (i % 2) * 8} r="7" fill="#e09f3e" stroke={INK} strokeWidth="2" />
        ))}
      </>
    ),
  };
}

function umbrella(): Thing {
  const color = pick(["#ff5d73", "#3a86ff", "#8e7dff"]);
  const w = 40;
  const h = 300;
  return {
    kind: "umbrella",
    name: "Regenschirm",
    w,
    h,
    sound: () => playKnock(600),
    draw: () => (
      <>
        <path d={`M${w / 2} 0 L${w / 2 - 4} -14 L4 ${-h + 120} Q${w / 2} ${-h + 104} ${w - 4} ${-h + 120} L${w / 2 + 4} -14 Z`} fill={color} {...LINE} />
        <line x1={w / 2} y1="-14" x2={w / 2} y2={-h + 108} stroke="#0003" strokeWidth="3" />
        <rect x={w / 2 - 5} y={-h + 46} width="10" height="66" fill="#8a5a2b" {...LINE} />
        <path
          d={`M${w / 2} ${-h + 48} L${w / 2} ${-h + 22} Q${w / 2} ${-h + 4} ${w / 2 + 14} ${-h + 4} Q${w} ${-h + 4} ${w} ${-h + 20}`}
          fill="none"
          stroke={INK}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={`M${w / 2} ${-h + 48} L${w / 2} ${-h + 22} Q${w / 2} ${-h + 4} ${w / 2 + 14} ${-h + 4} Q${w} ${-h + 4} ${w} ${-h + 20}`}
          fill="none"
          stroke="#b8763d"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </>
    ),
  };
}

const SMALL = [crayon, block, toiletRoll, can];
const MIDDLE = [juice, bottle, cereal, umbrella];

const shuffle = <T,>(list: T[]) =>
  list
    .map((item) => ({ item, key: Math.random() }))
    .sort((a, b) => a.key - b.key)
    .map(({ item }) => item);

/**
 * A new row of things, in `groups` runs from small to tall, so each one can
 * reach the next: two small ones, two books, and two or three of the bigger
 * things. The tall end of one run falls onto the small start of the next.
 */
export function pickThings(groups = 1): Thing[] {
  return Array.from({ length: groups }, () => {
    const makers = [...shuffle(SMALL).slice(0, 2), book, book, ...shuffle(MIDDLE).slice(0, pick([2, 3]))];
    return makers.map((make) => make()).sort((a, b) => a.h - b.h);
  }).flat();
}
