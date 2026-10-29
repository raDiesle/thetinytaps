import { INK } from "@/games/scenes/shared";
import { HERO, KidHead } from "../kid";
import { Football, type Picture } from "./items";

// What the child thinks at an obstacle without a creature that wants something: what would happen if it went on
// without the right thing (it gets wet, falls into the water, can't see in the dark), or what it could do (dig).
// Each is drawn standing on (0, 0) like the things, for the thought bubble; the child is a big, frowning, still head,
// since the bubble is small.

/** A worry the child can have at an obstacle. */
export type Worry = "wet" | "splash" | "dark" | "dig" | "blocked" | "fall";

/** The child's head, big and frowning, with its chin on (0, 0). */
function Head() {
  return (
    <g className="tl-worry" transform="scale(1.6) translate(0 108)">
      <KidHead look={HERO} />
    </g>
  );
}

/** A drop of water, its tip at (x, y). */
function Drop({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} q-10 18 0 25 q10 -7 0 -25 Z`} fill="#4dabf7" stroke="#1c7ed6" strokeWidth="3" strokeLinejoin="round" />;
}

/** Water dropping onto the child's head and running down beside its face: it gets wet. */
function Wet() {
  const drops: [number, number][] = [
    [-20, -138],
    [24, -132],
    [-72, -96],
    [74, -84],
    [-70, -40],
    [72, -30],
  ];
  return (
    <>
      <Head />
      {drops.map(([x, y]) => (
        <Drop key={`${x}${y}`} x={x} y={y} />
      ))}
    </>
  );
}

/** The child's head just above the water, splashing: it would fall in. */
function Splash() {
  return (
    <>
      <g transform="translate(0 -32)">
        <Head />
      </g>
      <path d="M-90 -40 Q-68 -54 -45 -40 T0 -40 T45 -40 T90 -40 V0 H-90 Z" fill="#4dabf7" stroke="#1c7ed6" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-56 -20 q12 -6 24 0 M24 -16 q12 -6 24 0" stroke="#e7f5ff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g fill="#a5d8ff" stroke="#1c7ed6" strokeWidth="3">
        {[-1, 1].map((s) => (
          <g key={s}>
            <ellipse cx={s * 70} cy="-66" rx="8" ry="15" transform={`rotate(${s * 24} ${s * 70} -66)`} />
            <ellipse cx={s * 92} cy="-54" rx="7" ry="12" transform={`rotate(${s * 40} ${s * 92} -54)`} />
            <circle cx={s * 82} cy="-92" r="6" />
          </g>
        ))}
      </g>
    </>
  );
}

/** All dark around the child: only its wide open eyes can be seen. */
function Dark() {
  return (
    <>
      <rect x="-96" y="-140" width="192" height="140" rx="30" fill="#1b1f3b" stroke={INK} strokeWidth="4" />
      <g opacity="0.25">
        <Head />
      </g>
      <g transform="scale(1.6) translate(0 108)">
        {[-12, 12].map((x) => (
          <g key={x}>
            <circle cx={x} cy="-141" r="8" fill="#fff" />
            <circle cx={x} cy="-140" r="4" fill={INK} />
          </g>
        ))}
      </g>
    </>
  );
}

/** A heap of sand with the football half in it, sand flying off a shovel: the ball can be dug out. */
function Dig() {
  const grains: [number, number][] = [
    [30, -120],
    [52, -138],
    [70, -112],
    [44, -96],
    [84, -130],
  ];
  return (
    <>
      <g transform="translate(-30 -6)">
        <Football />
      </g>
      <path d="M-110 0 Q-70 -50 -20 -26 Q30 -56 100 0 Z" fill="#ffe066" stroke="#e8a317" strokeWidth="4" strokeLinejoin="round" />
      <g transform="translate(40 -30) rotate(40)">
        <rect x="-5" y="-110" width="10" height="80" rx="4" fill="#a0673a" stroke={INK} strokeWidth="3" />
        <path d="M-22 -34 H22 L16 6 Q0 18 -16 6 Z" fill="#4dabf7" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      </g>
      {grains.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="#ffe066" stroke="#e8a317" strokeWidth="2" />
      ))}
    </>
  );
}

/** A thick branch with leaves right across in front of the child's face, bumped into: it can't get past. */
function Blocked() {
  return (
    <>
      <g transform="translate(0 -14)">
        <Head />
      </g>
      <path d="M-104 -52 Q0 -70 104 -46" stroke={INK} strokeWidth="30" strokeLinecap="round" fill="none" />
      <path d="M-104 -52 Q0 -70 104 -46" stroke="#a0673a" strokeWidth="21" strokeLinecap="round" fill="none" />
      <path d="M-70 -58 Q-30 -64 0 -62 M30 -60 Q60 -58 84 -52" stroke="#d9a066" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g fill="#69db7c" stroke={INK} strokeWidth="3">
        <path d="M-60 -64 Q-74 -96 -50 -100 Q-46 -80 -60 -64 Z" />
        <path d="M44 -58 Q58 -90 80 -82 Q68 -62 44 -58 Z" />
        <path d="M70 -40 Q86 -20 70 -6 Q60 -24 70 -40 Z" />
      </g>
      <g fill="#ffd43b" stroke={INK} strokeWidth="3" strokeLinejoin="round">
        {[
          [-86, -134],
          [86, -128],
        ].map(([x, y]) => (
          <path
            key={x}
            d={`M${x} ${y - 16} L${x + 5} ${y - 5} L${x + 16} ${y} L${x + 5} ${y + 5} L${x} ${y + 16} L${x - 5} ${y + 5} L${x - 16} ${y} L${x - 5} ${y - 5} Z`}
          />
        ))}
      </g>
    </>
  );
}

/** Water running over a rocky edge and falling deep down, the child's head falling with it: down it would go. */
function Fall() {
  return (
    <>
      <path d="M-110 -150 H-30 Q-20 -150 -20 -138 V0 H-110 Z" fill="#adb5bd" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path
        d="M-110 -150 H-34 Q4 -150 10 -110 V0 H-20 V-130 Q-24 -140 -34 -140 H-110 Z"
        fill="#4dabf7"
        stroke="#1c7ed6"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M-6 -120 V-20" stroke="#e7f5ff" strokeWidth="4" strokeLinecap="round" />
      <path d="M-40 0 Q-20 -22 0 -8 Q20 -26 40 -6 Q56 -18 70 0 Z" fill="#a5d8ff" stroke="#1c7ed6" strokeWidth="3" strokeLinejoin="round" />
      <g transform="translate(62 -34) rotate(18) scale(0.62)">
        <Head />
      </g>
      <path d="M40 -150 V-122 M64 -158 V-126 M88 -150 V-122" stroke={INK} strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

/** The worries' pictures, sized like the things'. */
export const WORRIES: Record<Worry, Picture> = {
  wet: { w: 170, h: 140, draw: () => <Wet /> },
  splash: { w: 200, h: 145, draw: () => <Splash /> },
  dark: { w: 192, h: 140, draw: () => <Dark /> },
  dig: { w: 210, h: 150, draw: () => <Dig /> },
  blocked: { w: 230, h: 160, draw: () => <Blocked /> },
  fall: { w: 220, h: 165, draw: () => <Fall /> },
};
