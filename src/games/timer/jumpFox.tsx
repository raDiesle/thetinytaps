import type { CSSProperties, ReactNode } from "react";
import { Arm, BODY, Foot, FoxTail, MASCOT_COLORS, MASCOT_INK, MascotHead, type MascotEyes, type MascotMouth } from "@/components/Mascot";

// The fox of Up to the Moon (user request, 23 November 2026: „wir ändern das Männchen, dass es ein Fuchs ist – muss aber
// sehr gute Grafik sein“, with arms it uses): the app's own fox, its head the shared `MascotHead`, its body, tail, arms
// and paws those of `Mascot.tsx`, in a blue T-shirt with a yellow star. It is the one doing the run, so it has a pose of
// its own for every way it moves (`FoxPose`): it swims with strokes and kicks behind a diving mask, hops with its arms
// flapping, sits in the cable car's basket waving, points up in the lift, hangs from the balloons and the parachute
// with its legs dangling, flies with the jetpack like a superhero, and drops into the cake cheering. Every pose is a
// layer of its own shown only while it fits (opacity keyframes written for the run); in it the body and the head are
// still drawings, and an arm or leg that moves is a small layer of its own turning at its shoulder or hip once a second
// – never a part moved inside an svg, which a phone would paint anew each frame.

/** How the fox moves at a moment of the run, one drawing each. */
export type FoxPose = "swim" | "hop" | "ride" | "lift" | "hang" | "jet" | "drop";

/** Every pose, in the order their layers lie. */
export const FOX_POSES: readonly FoxPose[] = ["swim", "hop", "ride", "lift", "hang", "jet", "drop"];

const FOX = MASCOT_COLORS.fox;

/** Its T-shirt, and the star on it. */
const SHIRT = "#4dabf7";
const SHIRT_SHADE = "#339af0";
const SHIRT_STAR = "#ffd43b";

/** A point in `Mascot`'s 200 × 300 box, where the fox is drawn; the pose's square box is 300 wide, the fox in its middle. */
type P = [number, number];

/** One arm or leg: from the shoulder or hip through its bend to the paw, and how it swings once a second (degrees, turning at `from`). */
interface LimbSpec {
  from: P;
  via: P;
  to: P;
  swing?: [number, number];
  /** Half a beat later than the other, so arms or legs go in turn. */
  late?: boolean;
}

/** A pose: its arms (left and right as we see them), its legs (feet standing, legs of their own, or hidden in the basket), its face and what it wears. */
interface PoseSpec {
  /** How far the whole fox leans (degrees, forwards in the way it goes): swimming up at a slant, flying with the jetpack. */
  tilt?: number;
  arms: [LimbSpec, LimbSpec];
  legs: "stand" | "none" | [LimbSpec, LimbSpec];
  eyes: MascotEyes;
  mouth: MascotMouth;
  mask?: boolean;
  jetpack?: boolean;
}

/** Legs hanging from the hips with round paws, as an arm hangs. */
const dangling = (swing?: [number, number]): [LimbSpec, LimbSpec] => [
  { from: [84, 252], via: [80, 274], to: [78, 296], swing },
  { from: [116, 252], via: [120, 274], to: [122, 296], swing: swing && [-swing[0], -swing[1]], late: true },
];

/** The poses (user request, 23 November 2026: every move should fit what it does, with more difference between them). */
const POSES: Record<FoxPose, PoseSpec> = {
  // Swimming up at a slant: breaststroke arms sweeping out and back, legs kicking in turn, the diving mask on.
  swim: {
    tilt: 26,
    arms: [
      { from: [60, 176], via: [32, 168], to: [12, 138], swing: [-14, 46] },
      { from: [140, 176], via: [168, 168], to: [188, 138], swing: [14, -46] },
    ],
    legs: dangling([-16, 16]),
    eyes: "open",
    mouth: "smile",
    mask: true,
  },
  // Hopping: arms flapping up and down with joy, feet together.
  hop: {
    arms: [
      { from: [58, 178], via: [40, 206], to: [38, 236], swing: [0, 42] },
      { from: [142, 178], via: [160, 206], to: [162, 236], swing: [0, -42] },
    ],
    legs: "stand",
    eyes: "open",
    mouth: "open",
  },
  // In the cable car's basket: one paw on its rim, the other waving; the legs are in the basket.
  ride: {
    arms: [
      { from: [58, 178], via: [36, 190], to: [34, 208] },
      { from: [140, 176], via: [168, 150], to: [184, 110], swing: [-16, 14] },
    ],
    legs: "none",
    eyes: "happy",
    mouth: "open",
  },
  // In the lift: standing, one paw at its side, the other pointing up where it goes, pumping a little.
  lift: {
    arms: [
      { from: [58, 178], via: [40, 210], to: [46, 238] },
      { from: [142, 176], via: [166, 146], to: [182, 104], swing: [0, -12] },
    ],
    legs: "stand",
    eyes: "open",
    mouth: "smile",
  },
  // Hanging from the balloons' strings or the parachute's cords: both arms straight up, legs dangling and kicking.
  hang: {
    arms: [
      { from: [60, 176], via: [32, 150], to: [22, 116] },
      { from: [140, 176], via: [168, 150], to: [178, 116] },
    ],
    legs: dangling([-14, 14]),
    eyes: "open",
    mouth: "open",
  },
  // With the jetpack: leaning into the way, one paw stretched up ahead like a superhero, the other back, legs together.
  jet: {
    tilt: 14,
    arms: [
      { from: [58, 178], via: [42, 206], to: [48, 234] },
      { from: [142, 176], via: [172, 150], to: [194, 112] },
    ],
    legs: [
      { from: [88, 252], via: [88, 276], to: [92, 296] },
      { from: [112, 252], via: [112, 276], to: [108, 296] },
    ],
    eyes: "open",
    mouth: "grin",
    jetpack: true,
  },
  // Leaping off the moon and dropping into the cake: arms up and out, legs apart, laughing.
  drop: {
    arms: [
      { from: [60, 176], via: [34, 152], to: [22, 112] },
      { from: [140, 176], via: [166, 152], to: [178, 112] },
    ],
    legs: [
      { from: [86, 252], via: [70, 270], to: [60, 290] },
      { from: [114, 252], via: [130, 270], to: [140, 290] },
    ],
    eyes: "happy",
    mouth: "open",
  },
};

/** Where the paws of the `hang` pose hold the strings and cords, in the pose's box (0–1 across and down): balloons and parachute meet there. */
export const HANG_PAWS = { left: [(22 + 50) / 300, 116 / 300], right: [(178 + 50) / 300, 116 / 300] } as const;

/** A drawing in the pose's 300 × 300 box, the fox drawn in `Mascot`'s 200 × 300 box in its middle. */
function Part({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return (
    <div className={`tm-jump-part${className ? ` ${className}` : ""}`} style={style}>
      <svg viewBox="0 0 300 300">
        <g transform="translate(50 0)">{children}</g>
      </svg>
    </div>
  );
}

/** The point `d` along the way from `a` to `b`. */
const toward = (a: P, b: P, d: number): P => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  return [a[0] + ((b[0] - a[0]) / len) * d, a[1] + ((b[1] - a[1]) / len) * d];
};

/** An arm with the T-shirt's short sleeve round its top, or a leg; a layer turning at its shoulder or hip when it swings. */
function LimbLayer({ limb, sleeve }: { limb: LimbSpec; sleeve?: boolean }) {
  const end = toward(limb.from, limb.via, 24);
  const art = (
    <>
      <Arm from={limb.from} via={limb.via} to={limb.to} kind="fox" />
      {sleeve && (
        <>
          <path d={`M${limb.from[0]} ${limb.from[1]} L${end[0]} ${end[1]}`} stroke={MASCOT_INK} strokeWidth="38" strokeLinecap="round" />
          <path d={`M${limb.from[0]} ${limb.from[1]} L${end[0]} ${end[1]}`} stroke={SHIRT} strokeWidth="30" strokeLinecap="round" />
        </>
      )}
    </>
  );
  if (!limb.swing) return <Part>{art}</Part>;
  const style = {
    transformOrigin: `${(((limb.from[0] + 50) / 300) * 100).toFixed(1)}% ${((limb.from[1] / 300) * 100).toFixed(1)}%`,
    "--tm-limb-a": `${limb.swing[0]}deg`,
    "--tm-limb-b": `${limb.swing[1]}deg`,
    animationDelay: limb.late ? "-0.5s" : undefined,
  } as CSSProperties;
  return (
    <Part className="tm-jump-limb" style={style}>
      {art}
    </Part>
  );
}

/** The jetpack on its back: two silver tanks with red caps, showing at both sides of the body. */
function Jetpack() {
  return (
    <>
      {[16, 154].map((x) => (
        <g key={x}>
          <rect x={x} y="148" width="30" height="86" rx="14" fill="#ced4da" stroke={MASCOT_INK} strokeWidth="4.5" />
          <path d={`M${x + 6} 160 V220`} stroke="#f8f9fa" strokeWidth="5" strokeLinecap="round" />
          <path d={`M${x} 166 Q${x + 15} 132 ${x + 30} 166 Z`} fill="#e03131" stroke={MASCOT_INK} strokeWidth="4.5" strokeLinejoin="round" />
          <rect x={x + 6} y="230" width="18" height="14" rx="3" fill="#495057" stroke={MASCOT_INK} strokeWidth="3.5" />
        </g>
      ))}
    </>
  );
}

/** The flames under the jetpack's two nozzles, flickering once a second (a small layer of their own). */
function Flames() {
  return (
    <Part className="tm-jump-flame">
      {[31, 169].map((x) => (
        <g key={x}>
          <path
            d={`M${x - 12} 244 Q${x - 16} 272 ${x - 4} 300 Q${x} 284 ${x + 4} 300 Q${x + 16} 272 ${x + 12} 244 Z`}
            fill="#ffa94d"
            stroke="#e8590c"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d={`M${x - 6} 244 Q${x - 6} 264 ${x} 280 Q${x + 6} 264 ${x + 6} 244 Z`} fill="#ffe066" />
        </g>
      ))}
    </Part>
  );
}

/** The body: the tail behind, the feet when standing, the round furry body in its T-shirt with the star, its pale belly below. */
function Body({ spec }: { spec: PoseSpec }) {
  return (
    <Part>
      {spec.jetpack && <Jetpack />}
      <FoxTail />
      {spec.legs === "stand" && (
        <>
          <Foot x={80} kind="fox" />
          <Foot x={120} kind="fox" />
        </>
      )}
      <path d={BODY} fill={FOX.fur} stroke={MASCOT_INK} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M76 238 Q100 250 124 238 C128 256 116 270 100 270 C84 270 72 256 76 238 Z" fill={FOX.pale} />
      {/* The T-shirt over the chest and the round belly, its hem, a shadow on its far side and the star. */}
      <path
        d="M100 142 C68 142 47 170 43 208 Q42 222 45 234 Q100 250 155 234 Q158 222 157 208 C153 170 132 142 100 142 Z"
        fill={SHIRT}
        stroke={MASCOT_INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M132 156 C150 172 158 200 155 232 Q146 236 136 238 C146 210 144 180 132 156 Z" fill={SHIRT_SHADE} />
      <path
        d="M100 176 L106 190 L121 191 L109 200 L113 215 L100 207 L87 215 L91 200 L79 191 L94 190 Z"
        fill={SHIRT_STAR}
        stroke={MASCOT_INK}
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </Part>
  );
}

/** The head, the app's shared fox head as a child's, with the diving mask over its eyes while it swims. */
function Head({ spec }: { spec: PoseSpec }) {
  return (
    <Part>
      <g transform="translate(32.5 28) scale(1.35)">
        <MascotHead kind="fox" child eyes={spec.eyes} mouth={spec.mouth}>
          {spec.mask && (
            <g>
              <path d="M8 55 H92" stroke="#1971c2" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="21" y="43" width="58" height="25" rx="11" fill="#a5d8ff" fillOpacity="0.45" stroke="#1971c2" strokeWidth="3.5" />
              <path d="M50 45 V66" stroke="#1971c2" strokeWidth="3" />
              <path d="M27 49 Q31 46 36 46" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
            </g>
          )}
        </MascotHead>
      </g>
    </Part>
  );
}

/** One pose of the fox: legs, body, arms and head as layers, the arms and legs that move turning on their own. */
export function FoxPoseArt({ pose }: { pose: FoxPose }) {
  const spec = POSES[pose];
  const legs = Array.isArray(spec.legs) ? spec.legs : [];
  const inner = (
    <>
      {legs.map((leg, i) => (
        <LimbLayer key={`leg${i}`} limb={leg} />
      ))}
      {spec.jetpack && <Flames />}
      <Body spec={spec} />
      {spec.arms.map((arm, i) => (
        <LimbLayer key={`arm${i}`} limb={arm} sleeve />
      ))}
      <Head spec={spec} />
    </>
  );
  return spec.tilt ? (
    <div className="tm-jump-part" style={{ transform: `rotate(${spec.tilt}deg)`, transformOrigin: "50% 62%" }}>
      {inner}
    </div>
  ) : (
    inner
  );
}
