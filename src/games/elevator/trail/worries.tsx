import { INK } from "@/games/scenes/shared";
import { HERO, KidHead } from "../kid";
import { Football, type Picture } from "./items";

// What the child thinks at an obstacle without a creature that wants something: what would happen if it went on
// without the right thing (it gets wet, falls into the water, can't see in the dark, gets stuck in the snow, slips on
// the ice), or what it could do (dig).
// Each is drawn standing on (0, 0) like the things, for the thought bubble; the child is a big, frowning, still head,
// since the bubble is small.

/** A worry the child can have at an obstacle. */
export type Worry = "wet" | "splash" | "dark" | "dig" | "stuck" | "slip";

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

/** A snowflake: a small white star with blue edges. */
function Flake({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 9} ${y} H${x + 9} M${x - 5} ${y - 8} L${x + 5} ${y + 8} M${x + 5} ${y - 8} L${x - 5} ${y + 8}`}
      stroke="#74c0fc"
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}

/** The child's head deep in a heap of snow, snow on its hair and flakes round it: it would get stuck. */
function Stuck() {
  const flakes: [number, number][] = [
    [-80, -120],
    [78, -112],
    [-92, -70],
    [90, -64],
  ];
  return (
    <>
      <g transform="translate(0 -6)">
        <Head />
      </g>
      <path d="M-34 -122 Q0 -150 34 -122 Q20 -114 0 -118 Q-20 -114 -34 -122 Z" fill="#fff" stroke="#74c0fc" strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M-104 0 Q-100 -50 -60 -46 Q-40 -66 -14 -40 Q10 -62 36 -42 Q64 -64 82 -40 Q106 -38 104 0 Z"
        fill="#fff"
        stroke="#74c0fc"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {flakes.map(([x, y]) => (
        <Flake key={`${x}${y}`} x={x} y={y} />
      ))}
    </>
  );
}

/** The child's head tipping over on shiny ice, with swish lines: it would slip and fall. */
function Slip() {
  return (
    <>
      <ellipse cx="0" cy="-14" rx="100" ry="14" fill="#a5d8ff" stroke="#1c7ed6" strokeWidth="4" />
      <path d="M-66 -16 H-30 M16 -12 H60" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <g transform="translate(-6 -22) rotate(-28)">
        <Head />
      </g>
      <path d="M58 -110 q22 6 30 26 M66 -136 q30 8 38 34" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      {[
        [-82, -112],
        [-96, -80],
      ].map(([x, y]) => (
        <path
          key={x}
          d={`M${x} ${y - 10} L${x + 3} ${y - 3} L${x + 10} ${y} L${x + 3} ${y + 3} L${x} ${y + 10} L${x - 3} ${y + 3} L${x - 10} ${y} L${x - 3} ${y - 3} Z`}
          fill="#ffd43b"
          stroke="#f08c00"
          strokeWidth="2"
          strokeLinejoin="round"
        />
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
  stuck: { w: 210, h: 150, draw: () => <Stuck /> },
  slip: { w: 210, h: 150, draw: () => <Slip /> },
};
