import { INK } from "@/games/scenes/shared";
import { HERO, KidHead } from "../kid";
import { Football, type Picture } from "./items";

// What the child thinks at an obstacle without a creature that wants something: what would happen if it went on
// without the right thing (it gets wet, falls into the water, can't see in the dark), or what it could do (dig).
// Each is drawn standing on (0, 0) like the things, for the thought bubble; the child is a big, frowning, still head,
// since the bubble is small.

/** A worry the child can have at an obstacle. */
export type Worry = "wet" | "splash" | "dark" | "dig";

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

/** A heap of sand with the football half in it, sand flying up off it: the ball can be dug out (by whoever digs –
 * in „Der Ball rollt weg“ the dog, so no tool is drawn). */
function Dig() {
  const grains: [number, number][] = [
    [-84, -44],
    [-104, -82],
    [52, -50],
    [80, -86],
    [36, -104],
    [-70, -112],
  ];
  return (
    <>
      <g transform="translate(-30 -6)">
        <Football />
      </g>
      <path d="M-110 0 Q-70 -50 -20 -26 Q30 -56 100 0 Z" fill="#ffe066" stroke="#e8a317" strokeWidth="4" strokeLinejoin="round" />
      {grains.map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill="#ffe066" stroke="#e8a317" strokeWidth="2" />
      ))}
    </>
  );
}

/** The worries' pictures, sized like the things'. */
export const WORRIES: Record<Worry, Picture> = {
  wet: { w: 170, h: 140, draw: () => <Wet /> },
  splash: { w: 200, h: 145, draw: () => <Splash /> },
  dark: { w: 192, h: 140, draw: () => <Dark /> },
  dig: { w: 210, h: 150, draw: () => <Dig /> },
};
