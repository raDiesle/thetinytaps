import { memo, type ReactNode } from "react";
import type { Sky, StepId } from "./content";

// The story's one room, drawn in SVG (1600 × 900, cut to the screen like a cover picture): a window on the left, Mama
// Fuchs' armchair in the middle, Tapsi's bed on the right. Everything that matters stays inside x 200–1400 and
// y 90–820, since a tablet cuts the sides and a phone on its side the top and bottom. Each step is one still drawing
// (`Scene`); what moves is a short CSS animation that runs a few times when the step begins and then stands still.

export const SCENE_W = 1600;
export const SCENE_H = 900;

const INK = "#3d3045";
const FUR = "#e8843c";
const CREAM = "#fdf3e1";
const BLUSH = "#f3a39a";
const DRESS = "#5fa8a0";
const SWEATER = "#86a85a";
const SHIRT = "#ffcf4d";
const TROUSERS = "#6a8fd0";
const PYJAMA = "#a9bfee";
const CHAIR = "#c8706b";
const CHAIR_LIGHT = "#d9857f";
const WOOD = "#b98458";
const BLANKET = "#8fc1e3";
const HEART = "#ff6f91";

/** Where the figures stand or sit in the room. */
const MAMA = { x: 660, y: 600 };
const STANDING_KIT = { x: 1060, y: 800 };
const PILLOW = { x: 1000, y: 548 };

type Eyes = "open" | "happy" | "sleep" | "sleepy" | "sad";
type Mouth = "smile" | "open" | "sad";
type Point = [number, number];

/** An arm or leg as a bent stroke from the shoulder to the paw: dark outline, sleeve colour, a round paw at the end. */
function Limb({ from, via, to, color, width = 30, paw = 15 }: { from: Point; via: Point; to: Point; color: string; width?: number; paw?: number }) {
  const d = `M${from[0]} ${from[1]} Q${via[0]} ${via[1]} ${to[0]} ${to[1]}`;
  return (
    <g>
      <path d={d} stroke={INK} strokeWidth={width + 10} fill="none" strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" />
      <circle cx={to[0]} cy={to[1]} r={paw} fill={FUR} stroke={INK} strokeWidth="5" />
    </g>
  );
}

/** One eye at `x` (the face's own units, eye height -14). */
function Eye({ x, eyes }: { x: number; eyes: Eyes }) {
  if (eyes === "happy") return <path d={`M${x - 14} -8 Q${x} -28 ${x + 14} -8`} stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />;
  if (eyes === "sleep") return <path d={`M${x - 14} -18 Q${x} -2 ${x + 14} -18`} stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />;
  return (
    <g>
      <ellipse cx={x} cy="-14" rx="12" ry="15" fill={INK} />
      <circle cx={x + 4} cy="-20" r="4.5" fill="#fff" />
      {eyes === "sleepy" && (
        <>
          <path d={`M${x - 17} -12 Q${x} -38 ${x + 17} -12 Z`} fill={FUR} />
          <path d={`M${x - 16} -12 Q${x} -8 ${x + 16} -12`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
        </>
      )}
    </g>
  );
}

/** A fox's head, about 200 units wide round (0, 0): ears, face, cream cheeks, eyes looking `look` sideways. */
function Head({ eyes = "open", mouth = "smile", look = 0, tear = false }: { eyes?: Eyes; mouth?: Mouth; look?: number; tear?: boolean }) {
  const face = "M0 -95 C60 -95 100 -60 104 -10 C106 20 96 40 80 56 C60 80 30 92 0 92 C-30 92 -60 80 -80 56 C-96 40 -106 20 -104 -10 C-100 -60 -60 -95 0 -95 Z";
  return (
    <g>
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          <path d="M-90 -34 L-72 -152 L-14 -84 Z" fill={FUR} stroke={INK} strokeWidth="7" strokeLinejoin="round" />
          <path d="M-76 -58 L-66 -124 L-36 -86 Z" fill={CREAM} />
        </g>
      ))}
      <path d={face} fill={FUR} />
      <path d="M-102 -2 C-80 18 -50 22 -28 16 C-18 40 18 40 28 16 C50 22 80 18 102 -2 C98 42 60 90 0 90 C-60 90 -98 42 -102 -2 Z" fill={CREAM} />
      <path d={face} fill="none" stroke={INK} strokeWidth="7" />
      <circle cx="-66" cy="34" r="14" fill={BLUSH} opacity="0.75" />
      <circle cx="66" cy="34" r="14" fill={BLUSH} opacity="0.75" />
      {eyes === "sad" && (
        <g stroke={INK} strokeWidth="6" strokeLinecap="round">
          <path d={`M${-58 + look} -38 L${-26 + look} -48`} />
          <path d={`M${58 + look} -38 L${26 + look} -48`} />
        </g>
      )}
      <Eye x={-40 + look} eyes={eyes} />
      <Eye x={40 + look} eyes={eyes} />
      <ellipse cx={look / 2} cy="22" rx="16" ry="11" fill={INK} />
      <path d={`M${look / 2} 33 L${look / 2} 42`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
      {mouth === "smile" && (
        <path
          d={`M${look / 2 - 22} 42 Q${look / 2 - 11} 56 ${look / 2} 42 Q${look / 2 + 11} 56 ${look / 2 + 22} 42`}
          stroke={INK}
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mouth === "open" && (
        <path d={`M${look / 2 - 17} 42 Q${look / 2} 76 ${look / 2 + 17} 42 Z`} fill="#8c3b4a" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      )}
      {mouth === "sad" && (
        <path d={`M${look / 2 - 17} 60 Q${look / 2} 46 ${look / 2 + 17} 60`} stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      )}
      {tear && (
        <g transform={`translate(${46 + look} 6)`}>
          <path className="wn-tear" d="M0 0 C-6 12 -8 20 0 24 C8 20 6 12 0 0 Z" fill="#8fd0ff" stroke={INK} strokeWidth="3" />
        </g>
      )}
    </g>
  );
}

/** A bushy fox tail with a cream tip, growing up and to the right from (0, 0). */
function Tail({ flip = false }: { flip?: boolean }) {
  return (
    <g transform={flip ? "scale(-1 1)" : undefined}>
      <path d="M0 0 C60 -10 110 -60 100 -130 C95 -165 60 -175 50 -150 C70 -100 40 -40 0 -30 Z" fill={FUR} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M100 -130 C95 -165 60 -175 50 -150 C62 -138 82 -126 100 -130 Z" fill={CREAM} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
    </g>
  );
}

/** An apple with a bite out of it, held at (0, 0). */
function Apple() {
  return (
    <g>
      <circle cx="0" cy="0" r="24" fill="#e5484d" stroke={INK} strokeWidth="5" />
      <circle cx="22" cy="-8" r="10" fill={CREAM} />
      <path d="M0 -24 Q2 -34 -2 -40" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M2 -34 Q16 -44 22 -34 Q12 -28 2 -34 Z" fill="#6cbf5a" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/** A child's cup of milk, held at (0, 0). */
function Cup() {
  return (
    <g>
      <path d="M-20 -28 L20 -28 L16 24 Q0 30 -16 24 Z" fill="#7ec4e8" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <ellipse cx="0" cy="-28" rx="20" ry="6" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M20 -16 Q36 -12 34 2 Q32 14 18 12" stroke={INK} strokeWidth="5" fill="none" />
    </g>
  );
}

/** A little teddy bear (the app's other mascot), sitting at (0, 0). */
function Teddy() {
  return (
    <g>
      <ellipse cx="0" cy="26" rx="28" ry="26" fill="#b07a4f" stroke={INK} strokeWidth="5" />
      <circle cx="-22" cy="-24" r="11" fill="#b07a4f" stroke={INK} strokeWidth="5" />
      <circle cx="22" cy="-24" r="11" fill="#b07a4f" stroke={INK} strokeWidth="5" />
      <circle cx="0" cy="-4" r="28" fill="#b07a4f" stroke={INK} strokeWidth="5" />
      <ellipse cx="0" cy="6" rx="13" ry="10" fill={CREAM} />
      <ellipse cx="0" cy="2" rx="5" ry="4" fill={INK} />
      <circle cx="-10" cy="-10" r="3.5" fill={INK} />
      <circle cx="10" cy="-10" r="3.5" fill={INK} />
    </g>
  );
}

/** An open picture book, held at (0, 0) with its spine in the middle. */
function OpenBook() {
  return (
    <g>
      <path d="M-78 -54 L0 -44 L78 -54 L78 14 L0 24 L-78 14 Z" fill="#d1495b" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <path d="M-70 -58 Q-34 -64 0 -48 L0 16 Q-34 2 -70 6 Z" fill="#fffaf0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <path d="M70 -58 Q34 -64 0 -48 L0 16 Q34 2 70 6 Z" fill="#fffaf0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <circle cx="-36" cy="-28" r="12" fill="#ffcf4d" />
      <path d="M14 -22 L58 -26 M14 -8 L52 -12" stroke="#c9b9a6" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

/** Mama's milk as a friendly little drop: it appears when Mama tells about it and floats away when Tapsi waves. */
function MilkDrop() {
  return (
    <g>
      <path d="M0 -62 C22 -32 44 -8 44 16 C44 42 24 58 0 58 C-24 58 -44 42 -44 16 C-44 -8 -22 -32 0 -62 Z" fill="#fffdf6" stroke={INK} strokeWidth="6" />
      <circle cx="-14" cy="12" r="5" fill={INK} />
      <circle cx="14" cy="12" r="5" fill={INK} />
      <path d="M-10 28 Q0 38 10 28" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="-26" cy="26" r="7" fill={BLUSH} opacity="0.7" />
      <circle cx="26" cy="26" r="7" fill={BLUSH} opacity="0.7" />
    </g>
  );
}

/** A heart that rises and fades once, `delay` seconds after the step begins. */
function Heart({ x, y, size = 1, delay = 0 }: { x: number; y: number; size?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path
        className="wn-rise"
        style={{ animationDelay: `${delay}s` }}
        d="M0 18 C-34 -6 -26 -40 0 -24 C26 -40 34 -6 0 18 Z"
        fill={HEART}
        stroke={INK}
        strokeWidth="4"
      />
    </g>
  );
}

/** A music note that rises and fades once. */
function Note({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text className="wn-rise" style={{ animationDelay: `${delay}s` }} fontSize="64" fill={INK} textAnchor="middle">
        ♪
      </text>
    </g>
  );
}

/** Arm poses of the standing Tapsi, written for the right arm (the left one is mirrored): shoulder to paw, in the figure's own units. */
const KIT_ARMS = {
  down: [
    [60, -110],
    [58, -78],
  ],
  up: [
    [78, -190],
    [72, -244],
  ],
  mouth: [
    [56, -120],
    [22, -196],
  ],
} satisfies Record<string, [Point, Point]>;

type KitArm = keyof typeof KIT_ARMS;

/** Tapsi standing with feet at (0, 0), about 330 units tall; `left`/`right` are arm poses, `held` what the right paw holds. */
function StandingKit({
  left = "down",
  right = "down",
  held,
  eyes,
  mouth,
  look,
  waving = false,
}: {
  left?: KitArm;
  right?: KitArm;
  held?: ReactNode;
  eyes?: Eyes;
  mouth?: Mouth;
  look?: number;
  waving?: boolean;
}) {
  const arm = (side: number, pose: KitArm) => {
    const [via, to] = KIT_ARMS[pose];
    return <Limb from={[40 * side, -150]} via={[via[0] * side, via[1]]} to={[to[0] * side, to[1]]} color={SHIRT} width={26} paw={14} />;
  };
  const rightTo = KIT_ARMS[right][1];
  return (
    <g>
      <g transform="translate(34 -62)">
        <Tail />
      </g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side < 0 ? -44 : 6} y="-62" width="38" height="52" rx="14" fill={TROUSERS} stroke={INK} strokeWidth="6" />
          <ellipse cx={side * 30} cy="-6" rx="26" ry="13" fill={FUR} stroke={INK} strokeWidth="6" />
        </g>
      ))}
      <path d="M-50 -46 C-58 -112 -46 -166 0 -172 C46 -166 58 -112 50 -46 Z" fill={SHIRT} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="0" cy="-166" rx="26" ry="10" fill={CREAM} />
      {arm(-1, left)}
      {waving ? (
        <g transform="translate(40 -150)">
          <g className="wn-wave">
            <g transform="translate(-40 150)">{arm(1, right)}</g>
          </g>
        </g>
      ) : (
        arm(1, right)
      )}
      <g transform="translate(0 -238) scale(0.62)">
        <Head eyes={eyes} mouth={mouth} look={look} />
      </g>
      {held && <g transform={`translate(${rightTo[0] - 4} ${rightTo[1] + 4})`}>{held}</g>}
    </g>
  );
}

/** Tapsi sitting on Mama's lap, bottom at (0, 0); in the evening in pyjamas. */
function LapKit({ reach = false, eyes, mouth, look, tear }: { reach?: boolean; eyes?: Eyes; mouth?: Mouth; look?: number; tear?: boolean }) {
  return (
    <g>
      <g transform="translate(30 -20) scale(0.8)">
        <Tail />
      </g>
      <path d="M-46 -4 C-54 -70 -42 -126 0 -132 C42 -126 54 -70 46 -4 Z" fill={PYJAMA} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      {[-1, 1].map((side) => (
        <ellipse key={side} cx={side * 28} cy="4" rx="28" ry="18" fill={PYJAMA} stroke={INK} strokeWidth="6" />
      ))}
      {[-1, 1].map((side) => (
        <ellipse key={`f${side}`} cx={side * 36} cy="18" rx="20" ry="12" fill={FUR} stroke={INK} strokeWidth="5" />
      ))}
      {[-24, 4, 26].map((x, i) => (
        <circle key={x} cx={x} cy={-40 - i * 26} r="5" fill="#fff" opacity="0.85" />
      ))}
      {reach
        ? [-1, 1].map((side) => <Limb key={side} from={[38 * side, -112]} via={[62 * side, -160]} to={[56 * side, -206]} color={PYJAMA} width={24} paw={13} />)
        : [-1, 1].map((side) => <Limb key={side} from={[38 * side, -112]} via={[54 * side, -70]} to={[26 * side, -50]} color={PYJAMA} width={24} paw={13} />)}
      <g transform="translate(0 -176) scale(0.58)">
        <Head eyes={eyes} mouth={mouth} look={look} tear={tear} />
      </g>
    </g>
  );
}

/** Tapsi as a baby, wrapped in a blanket and asleep, lying across Mama's arms round (0, 0). */
function Baby() {
  return (
    <g transform="rotate(-14)">
      <ellipse cx="18" cy="0" rx="92" ry="46" fill="#fff2b8" stroke={INK} strokeWidth="6" />
      <path d="M-10 -40 Q30 -6 -6 44" stroke={INK} strokeWidth="4" fill="none" opacity="0.5" />
      <g transform="translate(-58 -12) scale(0.4)">
        <Head eyes="sleep" />
      </g>
    </g>
  );
}

/** Mama Fuchs' arms, shoulder to paw (her own units, seat at (0, 0)): one pose per side. */
const MAMA_ARMS = {
  rest: [
    [-112, -140],
    [-66, -40],
  ],
  cradle: [
    [-126, -110],
    [10, -104],
  ],
  cradleTop: [
    [112, -140],
    [52, -168],
  ],
  raise: [
    [140, -200],
    [126, -296],
  ],
  wave: [
    [140, -236],
    [126, -336],
  ],
  hug: [
    [-60, -80],
    [58, -88],
  ],
  holdBack: [
    [168, -196],
    [140, -100],
  ],
  bookLeft: [
    [-96, -70],
    [-30, -84],
  ],
  stroke: [
    [190, -200],
    [238, -70],
  ],
  clap: [
    [-96, -140],
    [-6, -196],
  ],
} satisfies Record<string, [Point, Point]>;

type MamaArm = keyof typeof MAMA_ARMS;

/** The armchair's back and seat, behind Mama (room units). */
function ChairBack() {
  return (
    <g>
      <rect x="470" y="330" width="380" height="320" rx="70" fill={CHAIR} stroke={INK} strokeWidth="7" />
      <rect x="480" y="572" width="360" height="120" rx="30" fill={CHAIR_LIGHT} stroke={INK} strokeWidth="6" />
      <rect x="470" y="690" width="26" height="50" rx="8" fill={WOOD} stroke={INK} strokeWidth="5" />
      <rect x="824" y="690" width="26" height="50" rx="8" fill={WOOD} stroke={INK} strokeWidth="5" />
    </g>
  );
}

/** The armchair's arms, in front of Mama's body (her units, seat at (0, 0)). */
function ChairArms() {
  return (
    <g>
      <rect x="-220" y="-130" width="80" height="230" rx="38" fill={CHAIR} stroke={INK} strokeWidth="7" />
      <rect x="140" y="-130" width="80" height="230" rx="38" fill={CHAIR} stroke={INK} strokeWidth="7" />
    </g>
  );
}

/**
 * Mama Fuchs sitting in her armchair, seat at (0, 0): legs, dress, tail, the chair's arms, her head, then what sits
 * on her lap (`children`), then her arms in front of it, so a hug lies round Tapsi. Tapsi sits on her right, right
 * before her shoulder, so with `holding` her right arm goes behind Tapsi round its back – in front it crossed Tapsi's face.
 */
function Mama({
  left = "rest",
  right = "rest",
  eyes,
  mouth,
  look = 6,
  tilt = 0,
  waving = false,
  holding = false,
  children,
}: {
  left?: MamaArm;
  right?: MamaArm;
  eyes?: Eyes;
  mouth?: Mouth;
  look?: number;
  tilt?: number;
  waving?: boolean;
  holding?: boolean;
  children?: ReactNode;
}) {
  const arm = (side: number, pose: MamaArm) => {
    const [via, to] = MAMA_ARMS[pose];
    // Poses are written for the side they are named for (the left ones mirrored on the right) unless they reach across.
    const mirror = side > 0 && ["rest", "clap"].includes(pose) ? -1 : 1;
    return <Limb from={[70 * side, -224]} via={[via[0] * mirror, via[1]]} to={[to[0] * mirror, to[1]]} color={DRESS} width={30} paw={16} />;
  };
  return (
    <g transform={`translate(${MAMA.x} ${MAMA.y})`}>
      <g transform="translate(96 -10)">
        <Tail />
      </g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side < 0 ? -78 : 30} y="10" width="48" height="140" rx="20" fill={FUR} stroke={INK} strokeWidth="6" />
          <ellipse cx={side * 58} cy="150" rx="34" ry="15" fill={FUR} stroke={INK} strokeWidth="6" />
        </g>
      ))}
      <path
        d="M-100 20 C-108 -90 -94 -200 -62 -246 C-30 -262 30 -262 62 -246 C94 -200 108 -90 100 20 Z"
        fill={DRESS}
        stroke={INK}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      {[-1, 1].map((side) => (
        <ellipse key={side} cx={side * 52} cy="4" rx="56" ry="30" fill={DRESS} stroke={INK} strokeWidth="6" />
      ))}
      <ellipse cx="0" cy="-250" rx="44" ry="18" fill={CREAM} />
      <ChairArms />
      <g transform={`translate(0 -330) rotate(${tilt}) scale(0.85)`}>
        <Head eyes={eyes} mouth={mouth} look={look} />
      </g>
      {holding && arm(1, "holdBack")}
      {children}
      {arm(-1, left)}
      {holding ? null : waving ? (
        <g transform="translate(70 -224)">
          <g className="wn-wave">
            <g transform="translate(-70 224)">{arm(1, right)}</g>
          </g>
        </g>
      ) : (
        arm(1, right)
      )}
    </g>
  );
}

/** Papa Fuchs standing with feet at (0, 0), cheering with both arms up. */
function Papa() {
  return (
    <g>
      <g transform="translate(70 -120)">
        <Tail />
      </g>
      {[-1, 1].map((side) => (
        <g key={side}>
          <rect x={side < 0 ? -62 : 10} y="-130" width="52" height="118" rx="18" fill="#6b5a7a" stroke={INK} strokeWidth="6" />
          <ellipse cx={side * 40} cy="-8" rx="36" ry="15" fill={FUR} stroke={INK} strokeWidth="6" />
        </g>
      ))}
      <path
        d="M-82 -112 C-94 -220 -82 -340 -52 -382 C-20 -396 20 -396 52 -382 C82 -340 94 -220 82 -112 Z"
        fill={SWEATER}
        stroke={INK}
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <ellipse cx="0" cy="-384" rx="40" ry="16" fill={CREAM} />
      {[-1, 1].map((side) => (
        <Limb key={side} from={[62 * side, -356]} via={[130 * side, -420]} to={[118 * side, -500]} color={SWEATER} width={30} paw={16} />
      ))}
      <g transform="translate(0 -472) scale(0.88)">
        <Head mouth="open" eyes="happy" look={-4} />
      </g>
    </g>
  );
}

/** The bed's frame, mattress and pillow (behind whoever lies in it). */
function Bed() {
  return (
    <g>
      <path d="M890 690 L890 470 Q890 430 930 430 Q960 430 960 470 L960 690 Z" fill={WOOD} stroke={INK} strokeWidth="7" />
      <rect x="1340" y="500" width="44" height="200" rx="16" fill={WOOD} stroke={INK} strokeWidth="7" />
      <rect x="930" y="560" width="430" height="90" rx="22" fill="#fffaf0" stroke={INK} strokeWidth="6" />
      <rect x="920" y="640" width="450" height="34" rx="10" fill={WOOD} stroke={INK} strokeWidth="6" />
      <ellipse cx={PILLOW.x} cy={PILLOW.y} rx="70" ry="32" fill="#fffaf0" stroke={INK} strokeWidth="6" />
    </g>
  );
}

/** The blanket: flat and folded back while the bed is empty, over Tapsi up to the chin when Tapsi lies in it. */
function Blanket({ occupied }: { occupied: boolean }) {
  const d = occupied
    ? "M968 600 Q1000 560 1060 566 Q1160 540 1250 566 L1346 574 Q1360 620 1346 652 L978 652 Q960 630 968 600 Z"
    : "M1070 566 L1346 566 Q1360 610 1346 652 L1070 652 Z";
  return (
    <g>
      <path d={d} fill={BLANKET} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      {[1110, 1190, 1270].map((x, i) => (
        <path key={x} d={`M${x} ${598 + (i % 2) * 22} l6 12 l13 2 l-10 9 l3 13 l-12 -7 l-12 7 l3 -13 l-10 -9 l13 -2 Z`} fill="#fff6c2" opacity="0.9" />
      ))}
    </g>
  );
}

/** Tapsi lying in bed, head on the pillow, the teddy in the crook of its arm. */
function KitInBed({ eyes }: { eyes: Eyes }) {
  return (
    <g>
      <g transform={`translate(${PILLOW.x + 6} ${PILLOW.y - 30}) rotate(-12) scale(0.58)`}>
        <Head eyes={eyes} look={-6} />
      </g>
      <Blanket occupied />
      <g transform="translate(1102 560) rotate(8) scale(0.9)">
        <Teddy />
      </g>
    </g>
  );
}

const WALL: Record<Sky, string> = { day: "#fbeed2", night: "#d9cfe6", morning: "#fde7cf" };
const FLOOR: Record<Sky, string> = { day: "#d9a66b", night: "#b79173", morning: "#dba26a" };

/** The room around the story: wall, floor, window with the sky of the moment, a lamp, a shelf of books, the rug. Built once per sky. */
const Room = memo(function Room({ sky }: { sky: Sky }) {
  return (
    <g>
      <defs>
        <linearGradient id="wn-sky-day" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd3ff" />
          <stop offset="1" stopColor="#d6f1ff" />
        </linearGradient>
        <linearGradient id="wn-sky-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2a5c" />
          <stop offset="1" stopColor="#3b4a8a" />
        </linearGradient>
        <linearGradient id="wn-sky-morning" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffb3a7" />
          <stop offset="1" stopColor="#ffe6a0" />
        </linearGradient>
        <radialGradient id="wn-glow">
          <stop offset="0" stopColor="#fff2b0" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff2b0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={SCENE_W} height={SCENE_H} fill={WALL[sky]} />
      <rect y="520" width={SCENE_W} height="14" fill="#000" opacity="0.06" />
      <rect y="640" width={SCENE_W} height="260" fill={FLOOR[sky]} />
      {[700, 770, 850].map((y) => (
        <path key={y} d={`M0 ${y} L${SCENE_W} ${y}`} stroke="#000" strokeOpacity="0.08" strokeWidth="4" />
      ))}
      <rect y="628" width={SCENE_W} height="18" fill="#fff3dc" stroke={INK} strokeWidth="4" />
      {/* The window, its sky telling the time of day. */}
      <rect x="200" y="110" width="270" height="290" rx="14" fill="#fff8ec" stroke={INK} strokeWidth="7" />
      <rect x="218" y="128" width="234" height="254" rx="6" fill={`url(#wn-sky-${sky})`} stroke={INK} strokeWidth="4" />
      {sky === "day" && (
        <g>
          <circle cx="396" cy="190" r="34" fill="#ffd23f" stroke={INK} strokeWidth="5" />
          <path d="M240 300 q20 -30 50 -14 q24 -24 50 4 q22 0 18 22 h-122 q-14 -8 4 -12 Z" fill="#fff" stroke={INK} strokeWidth="4" />
        </g>
      )}
      {sky === "night" && (
        <g>
          <path d="M404 160 a44 44 0 1 0 22 78 a36 36 0 1 1 -22 -78 Z" fill="#fff3b0" stroke={INK} strokeWidth="5" />
          {[
            [254, 168],
            [300, 230],
            [262, 300],
            [350, 330],
            [420, 300],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path className="wn-twinkle" style={{ animationDelay: `${i * 0.25}s` }} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="#fff6c2" />
            </g>
          ))}
        </g>
      )}
      {sky === "morning" && <circle cx="335" cy="382" r="52" fill="#ffd23f" stroke={INK} strokeWidth="5" />}
      <path d="M335 128 L335 382 M218 255 L452 255" stroke="#fff8ec" strokeWidth="12" />
      <path d="M335 128 L335 382 M218 255 L452 255" stroke={INK} strokeWidth="3" strokeOpacity="0.5" />
      <path d="M186 96 Q236 250 196 420 L150 420 Q160 250 150 96 Z" fill="#f2c46d" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <path d="M484 96 Q434 250 474 420 L520 420 Q510 250 520 96 Z" fill="#f2c46d" stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <rect x="140" y="84" width="390" height="16" rx="8" fill={WOOD} stroke={INK} strokeWidth="5" />
      {/* A shelf of picture books over the bed. */}
      <rect x="1060" y="330" width="280" height="16" rx="6" fill={WOOD} stroke={INK} strokeWidth="5" />
      {[
        [1080, 40, "#d1495b"],
        [1124, 34, "#5fa8a0"],
        [1162, 44, "#ffcf4d"],
        [1210, 30, "#8e7dff"],
      ].map(([x, w, color]) => (
        <rect key={x as number} x={x as number} y={330 - 70} width={w as number} height="70" rx="5" fill={color as string} stroke={INK} strokeWidth="5" />
      ))}
      <g transform="translate(1290 302)">
        <Teddy />
      </g>
      {/* The lamp over the armchair; lit at night. */}
      <path d="M880 0 L880 140" stroke={INK} strokeWidth="5" />
      {sky === "night" && <circle cx="880" cy="200" r="230" fill="url(#wn-glow)" />}
      <path d="M830 196 Q880 120 930 196 Z" fill={sky === "night" ? "#ffe27a" : "#f6a7b8"} stroke={INK} strokeWidth="6" strokeLinejoin="round" />
      <ellipse cx="820" cy="790" rx="460" ry="72" fill="#e9b9c4" stroke={INK} strokeWidth="5" />
      <ellipse cx="820" cy="790" rx="400" ry="50" fill="none" stroke="#fff" strokeOpacity="0.6" strokeWidth="5" strokeDasharray="18 14" />
      <ChairBack />
      <Bed />
    </g>
  );
});

/** What a step shows besides the room. */
function Figures({ step }: { step: StepId }) {
  const kit = (node: ReactNode, hop = false) => (
    <g transform={`translate(${STANDING_KIT.x} ${STANDING_KIT.y})`}>
      <g className={hop ? "wn-hop" : undefined}>{node}</g>
    </g>
  );
  const lap = (node: ReactNode) => <g transform="translate(74 -10)">{node}</g>;
  switch (step) {
    case "baby":
      return (
        <g>
          <Mama left="cradle" right="cradleTop" eyes="happy" look={-4} tilt={-6}>
            <g transform="translate(-4 -136)">
              <g className="wn-rock">
                <Baby />
              </g>
            </g>
          </Mama>
          <Heart x={560} y={190} delay={0.3} />
          <Heart x={770} y={170} size={0.8} delay={0.8} />
        </g>
      );
    case "grow":
      return (
        <g>
          <Mama left="clap" right="clap" eyes="happy" mouth="open" />
          {kit(<StandingKit left="up" right="up" mouth="open" eyes="happy" />, true)}
        </g>
      );
    case "eat":
      return (
        <g>
          <Mama />
          {kit(
            <StandingKit
              right="mouth"
              mouth="open"
              look={-4}
              held={
                <g className="wn-chew">
                  <Apple />
                </g>
              }
            />,
          )}
        </g>
      );
    case "cup":
      return (
        <g>
          <Mama eyes="happy" />
          {kit(
            <StandingKit
              right="mouth"
              eyes="happy"
              held={
                <g className="wn-sip">
                  <Cup />
                </g>
              }
            />,
          )}
        </g>
      );
    case "tell":
      return (
        <g>
          <Mama right="raise" mouth="open" />
          {kit(<StandingKit look={-8} />)}
          <g transform="translate(880 330)">
            <g className="wn-appear">
              <MilkDrop />
            </g>
          </g>
        </g>
      );
    case "goodbye":
      return (
        <g>
          <Mama right="wave" waving eyes="happy" />
          {kit(<StandingKit right="up" waving mouth="open" look={-10} />)}
          <g transform="translate(880 330)">
            <g className="wn-away">
              <MilkDrop />
            </g>
          </g>
          <Heart x={840} y={240} size={0.7} delay={0.4} />
        </g>
      );
    case "evening":
      return (
        <Mama left="hug" holding eyes="open" look={10} tilt={8}>
          {lap(<LapKit reach eyes="sleepy" mouth="open" look={-10} />)}
        </Mama>
      );
    case "sad":
      return (
        <Mama left="hug" holding tilt={10} look={10}>
          {lap(<LapKit eyes="sad" mouth="sad" tear look={-4} />)}
        </Mama>
      );
    case "cuddle":
      return (
        <g>
          <Mama left="hug" holding eyes="happy" tilt={12}>
            {lap(<LapKit eyes="happy" />)}
          </Mama>
          <Heart x={600} y={160} delay={0.2} />
          <Heart x={820} y={190} size={0.8} delay={0.7} />
          <Heart x={700} y={110} size={0.6} delay={1.2} />
        </g>
      );
    case "book":
      return (
        <Mama left="bookLeft" holding mouth="open" look={12} tilt={6}>
          {lap(<LapKit eyes="open" look={-2} />)}
          <g transform="translate(56 -84) scale(0.9)">
            <OpenBook />
          </g>
        </Mama>
      );
    case "bed":
      return (
        <g>
          <Mama mouth="open" eyes="happy" look={10} tilt={6} />
          <KitInBed eyes="sleepy" />
          <Note x={800} y={220} delay={0.2} />
          <Note x={880} y={260} delay={1} />
          <Note x={760} y={300} delay={1.8} />
        </g>
      );
    case "sleep":
      return (
        <g>
          <Mama right="stroke" eyes="happy" look={10} tilt={8} />
          <KitInBed eyes="sleep" />
          <Heart x={1000} y={420} size={0.6} delay={0.6} />
        </g>
      );
    case "morning":
      return (
        <g>
          <Mama left="clap" right="clap" eyes="happy" mouth="open" />
          <g transform="translate(1270 812)">
            <Papa />
          </g>
          {kit(<StandingKit left="up" right="up" mouth="open" eyes="happy" />, true)}
        </g>
      );
  }
}

/** One step of the story as a picture that covers its box like a cover image; `memory` shows the baby time faded like an old photo. */
export const Scene = memo(function Scene({ step, sky }: { step: StepId; sky: Sky }) {
  return (
    <svg className={`wn-scene${step === "baby" ? " wn-memory" : ""}`} viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
      <Room sky={sky} />
      <Figures step={step} />
    </svg>
  );
});
