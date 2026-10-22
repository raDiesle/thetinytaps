import { INK, STEEL, nth } from "../shared";
import { Lines, Sparkles } from "./parts";

// Fruit and vegetables on the wooden stand (STAND coordinates: the stand's foot is at (0, 0), the
// back shelf at y -164, the front shelf at y -46), and the self-service scale next to it.

/** A wooden crate's front from x to x + w, standing on y. */
function Crate({ x, w, y, h = 50 }: { x: number; w: number; y: number; h?: number }) {
  return (
    <>
      <rect x={x} y={y - h} width={w} height={h} rx="3" fill="#e9b872" />
      <path d={`M${x} ${y - h * 0.5} H${x + w}`} stroke="#c8814a" strokeWidth="4" />
      <path d={`M${x + 8} ${y - h} V${y} M${x + w - 8} ${y - h} V${y}`} stroke="#c8814a" strokeWidth="5" />
      <rect x={x + w / 2 - 14} y={y - h + 10} width="28" height="14" rx="3" fill="#fff" />
    </>
  );
}

/** A price tag with a little picture of the fruit. */
function Tag({ x, y, fill }: { x: number; y: number; fill: string }) {
  return <circle cx={x} cy={y} r="4.5" fill={fill} />;
}

/** Bananas heaped in a crate; the bunches swing and bounce. */
export function Bananen() {
  const bunches = [
    { x: -226, y: -222, r: -8 },
    { x: -168, y: -230, r: 6 },
    { x: -200, y: -244, r: -2 },
  ];
  return (
    <>
      {bunches.map(({ x, y, r }, i) => (
        <g key={x} className="sm-banane" style={{ ...nth(i), transformOrigin: `${x + 32}px ${y + 6}px` }}>
          <g transform={`rotate(${r} ${x + 32} ${y})`}>
            {[0, 1, 2].map((k) => (
              <path
                key={k}
                d={`M${x} ${y + k * 6} Q${x + 30} ${y + 26 + k * 6} ${x + 64} ${y - 4 + k * 6} Q${x + 32} ${y + 12 + k * 6} ${x} ${y + k * 6} Z`}
                fill={k === 1 ? "#fcc419" : "#ffd43b"}
                stroke="#f59f00"
                strokeWidth="1.5"
              />
            ))}
            <path d={`M${x - 2} ${y - 2} l-4 -4`} stroke="#8d5a2b" strokeWidth="5" strokeLinecap="round" />
          </g>
        </g>
      ))}
      <Crate x={-232} w={144} y={-164} />
      <Tag x={-160} y={-197} fill="#ffd43b" />
    </>
  );
}

/** Carrots standing in a crate; they pop up one after the other and their greens wiggle. */
export function Karotten() {
  return (
    <>
      {[-56, -30, -4, 22, 48].map((x, i) => (
        <g key={x} className="sm-karotte" style={{ ...nth(i), transformOrigin: `${x}px -214px` }}>
          <g className="sm-karotte-leaf" style={{ ...nth(i), transformOrigin: `${x}px -236px` }}>
            <path d={`M${x} -236 q-10 -16 -6 -28 M${x} -236 q0 -18 4 -30 M${x} -236 q10 -14 12 -24`} stroke="#40c057" strokeWidth="5" strokeLinecap="round" fill="none" />
          </g>
          <path d={`M${x - 11} -238 Q${x} -242 ${x + 11} -238 L${x + 2} -190 Q${x} -186 ${x - 2} -190 Z`} fill={i % 2 ? "#ff922b" : "#fd7e14"} />
          <path d={`M${x - 6} -226 h5 M${x + 1} -214 h5 M${x - 4} -204 h4`} stroke="#e8590c" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <Crate x={-76} w={152} y={-164} />
      <Tag x={10} y={-197} fill="#ff922b" />
    </>
  );
}

const TOMATOES: [number, number][] = [
  [104, -222],
  [132, -224],
  [160, -222],
  [188, -224],
  [214, -222],
  [118, -244],
  [146, -246],
  [174, -244],
  [200, -244],
];

/** Tomatoes in a crate; they bounce, and one rolls away and back. */
export function Tomaten() {
  return (
    <>
      {TOMATOES.map(([x, y], i) => (
        <g key={i} className={i === 6 ? "sm-tomate-roll" : "sm-tomate"} style={{ ...nth(i % 4), transformOrigin: `${x}px ${y}px` }}>
          <circle cx={x} cy={y} r="14" fill={i % 3 ? "#fa5252" : "#f03e3e"} />
          <path d={`M${x - 6} ${y - 12} l6 4 l6 -4 M${x} ${y - 8} v-6`} stroke="#2f9e44" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx={x - 5} cy={y - 3} r="3.5" fill="#fff" opacity="0.5" />
        </g>
      ))}
      <Crate x={88} w={144} y={-164} />
      <Tag x={160} y={-197} fill="#fa5252" />
    </>
  );
}

const APPLES: [number, number][] = [
  [-212, -102],
  [-178, -104],
  [-144, -102],
  [-110, -104],
  [-76, -102],
  [-42, -104],
  [-194, -126],
  [-160, -128],
  [-126, -126],
  [-92, -128],
  [-58, -126],
];

/** Red and green apples; they hop, and a little worm peeks out of one and waves. */
export function Aepfel() {
  return (
    <>
      <g className="sm-apfel-wurm" style={{ transformOrigin: "-126px -138px" }}>
        <path d="M-126 -136 Q-130 -150 -122 -158" stroke="#94d82d" strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx="-121" cy="-162" r="7" fill="#94d82d" />
        <circle cx="-123" cy="-163" r="1.6" fill={INK} />
        <circle cx="-118" cy="-163" r="1.6" fill={INK} />
        <path d="M-123 -159 q2 2 4 0" stroke={INK} strokeWidth="1.2" fill="none" />
      </g>
      {APPLES.map(([x, y], i) => (
        <g key={i} className="sm-apfel" style={{ ...nth(i % 5), transformOrigin: `${x}px ${y + 16}px` }}>
          <path d={`M${x} ${y - 12} Q${x + 18} ${y - 20} ${x + 17} ${y} Q${x + 14} ${y + 16} ${x} ${y + 14} Q${x - 14} ${y + 16} ${x - 17} ${y} Q${x - 18} ${y - 20} ${x} ${y - 12} Z`} fill={i % 4 === 3 ? "#94d82d" : "#f03e3e"} />
          <path d={`M${x} ${y - 12} q1 -6 4 -9`} stroke="#8d5a2b" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx={x - 7} cy={y - 4} r="3.5" fill="#fff" opacity="0.45" />
        </g>
      ))}
      <Crate x={-232} w={212} y={-46} />
      <Tag x={-126} y={-79} fill="#f03e3e" />
    </>
  );
}

/** A big striped watermelon and a cut half; the melon wobbles and a slice hops up. */
export function Wassermelone() {
  return (
    <>
      <g className="sm-melone-slice" style={{ transformOrigin: "178px -96px" }}>
        <path d="M146 -100 A34 34 0 0 0 210 -100 Z" transform="rotate(180 178 -100)" fill="#2b8a3e" />
        <path d="M150 -100 A28 28 0 0 0 206 -100 Z" transform="rotate(180 178 -100)" fill="#ff6b6b" />
        {[164, 176, 190, 170, 184].map((x, i) => (
          <ellipse key={i} cx={x} cy={i < 3 ? -112 : -122} rx="2" ry="3" fill={INK} />
        ))}
      </g>
      <g className="sm-melone" style={{ transformOrigin: "84px -60px" }}>
        <ellipse cx="84" cy="-100" rx="66" ry="44" fill="#40c057" />
        {[-40, -16, 8, 32].map((dx) => (
          <path key={dx} d={`M${84 + dx} -142 Q${84 + dx * 1.3 + 6} -100 ${84 + dx} -58`} stroke="#2b8a3e" strokeWidth="7" fill="none" strokeLinecap="round" />
        ))}
        <ellipse cx="62" cy="-120" rx="16" ry="9" fill="#fff" opacity="0.3" />
      </g>
      <Crate x={10} w={222} y={-46} h={40} />
      <Tag x={121} y={-74} fill="#40c057" />
      <Sparkles x={178} y={-122} spread={34} colour="#ffc9c9" size={0.9} />
    </>
  );
}

/** Self-service scale: a banana drops on the tray, the display counts and a price sticker comes out. */
export function Waage() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="36" ry="9" fill="#868e96" />
      <rect x="-6" y="-84" width="12" height="80" fill={STEEL} />
      <rect x="-50" y="-132" width="100" height="54" rx="10" fill="#f8f9fa" stroke="#ced4da" strokeWidth="3" />
      <rect x="-40" y="-124" width="46" height="22" rx="4" fill="#343a40" />
      <rect className="sm-waage-zero" x="-24" y="-118" width="8" height="10" rx="2" fill="none" stroke="#8ce99a" strokeWidth="2.5" />
      <g className="sm-waage-digits" stroke="#8ce99a" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M-32 -118 V-108" style={nth(0)} />
        <path d="M-24 -118 h7 v5 h-7 v5 h7" style={nth(1)} />
        <path d="M-10 -118 h7 v10 M-10 -113 h7" style={nth(2)} />
      </g>
      {[-36, -20, -4].map((x, i) => (
        <g key={x} className={i === 1 ? "sm-waage-btn" : undefined}>
          <rect x={x} y="-98" width="14" height="14" rx="3" fill="#fff" stroke="#ced4da" strokeWidth="2" />
          <circle cx={x + 7} cy="-91" r="4" fill={["#f03e3e", "#ffd43b", "#ff922b"][i]} />
        </g>
      ))}
      <rect x="14" y="-122" width="28" height="7" rx="2" fill="#495057" />
      <g className="sm-waage-zettel" style={{ transformOrigin: "28px -116px" }}>
        <rect x="17" y="-116" width="22" height="26" rx="2" fill="#fff" stroke="#ced4da" strokeWidth="1.5" />
        <circle cx="28" cy="-106" r="5" fill="#ffd43b" />
        <path d="M21 -96 H35" stroke="#adb5bd" strokeWidth="2" />
      </g>
      <g className="sm-waage-tray" style={{ transformOrigin: "0px -138px" }}>
        <rect x="-4" y="-140" width="8" height="10" fill={STEEL} />
        <path d="M-48 -146 Q0 -130 48 -146 Q40 -136 0 -134 Q-40 -136 -48 -146 Z" fill="#ced4da" />
        <ellipse cx="0" cy="-146" rx="48" ry="6" fill="#e9ecef" />
        <g className="sm-waage-banana">
          <path d="M-26 -150 Q0 -136 28 -156 Q2 -144 -26 -150 Z" fill="#ffd43b" stroke="#f59f00" strokeWidth="1.5" />
          <path d="M-28 -152 l-4 -3" stroke="#8d5a2b" strokeWidth="4" strokeLinecap="round" />
        </g>
      </g>
      <Lines x={54} y={-110} colour="#868e96" size={0.8} />
    </>
  );
}
