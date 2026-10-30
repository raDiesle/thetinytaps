import { INK } from "@/games/scenes/shared";
import { KidHead, useHero } from "../kid";
import { Football, type Picture } from "./items";

// What the child thinks at an obstacle without a creature that wants something: what would happen if it went on
// without the right thing (it gets wet, falls into the water, can't see in the dark, burns its
// bare feet on hot sand, gets stuck in the snow, slips on the ice), or what it could do (dig).
// Each is drawn standing on (0, 0) like the things, for the thought bubble; the child is a big, frowning, still head,
// since the bubble is small.

/** A worry the child can have at an obstacle. */
export type Worry = "wet" | "splash" | "dark" | "dig" | "hot" | "blocked" | "fall" | "stuck" | "slip";

/** The child's head, big and frowning, with its chin on (0, 0). */
function Head() {
  const hero = useHero();
  return (
    <g className="tl-worry" transform="scale(1.6) translate(0 108)">
      <KidHead look={hero} />
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

/** Glowing hot sand under the child, the heat rising round its head, the sun above: barefoot, it would burn. */
function Hot() {
  return (
    <>
      <circle cx="78" cy="-122" r="20" fill="#ffd43b" stroke="#f08c00" strokeWidth="4" />
      <g transform="translate(0 -30)">
        <Head />
      </g>
      <path d="M-96 -6 Q-60 -36 -20 -22 Q24 -40 96 -6 V0 H-96 Z" fill="#ff922b" stroke="#e8590c" strokeWidth="4" strokeLinejoin="round" />
      {[-70, -30, 18, 62].map((x) => (
        <circle key={x} cx={x} cy={-12 + (x % 3) * 2} r="3.5" fill="#e03131" />
      ))}
      <g stroke="#f03e3e" strokeWidth="5" fill="none" strokeLinecap="round">
        {[-84, -62, 62, 84].map((x) => (
          <path key={x} d={`M${x} -34 q-9 -10 0 -20 q9 -10 0 -20 q-9 -10 0 -20`} />
        ))}
      </g>
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
  hot: { w: 200, h: 150, draw: () => <Hot /> },
  blocked: { w: 230, h: 160, draw: () => <Blocked /> },
  fall: { w: 220, h: 165, draw: () => <Fall /> },
  stuck: { w: 210, h: 150, draw: () => <Stuck /> },
  slip: { w: 210, h: 150, draw: () => <Slip /> },
};
