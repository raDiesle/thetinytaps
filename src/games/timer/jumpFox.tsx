import type { CSSProperties, ReactNode } from "react";
import { Arm, BODY, Foot, FoxTail, MASCOT_COLORS, MASCOT_INK, MascotHead, type MascotEyes, type MascotMouth } from "@/components/Mascot";

// The fox of Up to the Moon (user request, 23 November 2026: „wir ändern das Männchen, dass es ein Fuchs ist – muss aber
// sehr gute Grafik sein“, with arms it uses): the app's own fox, its head the shared `MascotHead`, its body, tail, arms
// and paws those of `Mascot.tsx`, in a blue T-shirt with a yellow star. It is the one doing the run, so it has a pose of
// its own for every way it moves (`FoxPose`): it swims with strokes behind a diving mask and a snorkel, its legs in a
// mermaid's tail fin that beats up and down (user request, 23 November 2026), walks out of the lake swinging arms and
// legs, hops with its arms flapping, sits in the cable car's basket waving, points up in the lift, hangs from the balloons and the parachute
// with its legs dangling, flies with the jetpack like a superhero, and drops into the cake cheering. Every pose is a
// layer of its own shown only while it fits (opacity keyframes written for the run); in it the body and the head are
// still drawings, and an arm or leg that moves is a small layer of its own turning at its shoulder or hip once a second
// – never a part moved inside an svg, which a phone would paint anew each frame.

/** How the fox moves at a moment of the run, one drawing each. */
export type FoxPose = "swim" | "walk" | "hop" | "ride" | "lift" | "hang" | "jet" | "drop";

/** Every pose, in the order their layers lie. */
export const FOX_POSES: readonly FoxPose[] = ["swim", "walk", "hop", "ride", "lift", "hang", "jet", "drop"];

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
  /** Its legs: feet standing, legs of their own, hidden (in the basket), or together in a mermaid's tail fin beating up and down. */
  legs: "stand" | "none" | "fin" | [LimbSpec, LimbSpec];
  eyes: MascotEyes;
  mouth: MascotMouth;
  /** The diving mask and its snorkel. */
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
  // Swimming up at a slant: breaststroke arms sweeping out and back, legs together in a mermaid's tail fin beating up
  // and down, the diving mask and snorkel on.
  swim: {
    tilt: 26,
    arms: [
      { from: [60, 176], via: [32, 168], to: [12, 138], swing: [-14, 46] },
      { from: [140, 176], via: [168, 168], to: [188, 138], swing: [14, -46] },
    ],
    legs: "fin",
    eyes: "open",
    mouth: "smile",
    mask: true,
  },
  // Walking on the meadow: arms and legs swinging in turn, as a child walks.
  walk: {
    arms: [
      { from: [58, 178], via: [46, 208], to: [46, 238], swing: [-22, 22] },
      { from: [142, 178], via: [154, 208], to: [154, 238], swing: [-22, 22], late: true },
    ],
    legs: [
      { from: [86, 248], via: [84, 272], to: [84, 296], swing: [-20, 20], late: true },
      { from: [114, 248], via: [116, 272], to: [116, 296], swing: [-20, 20] },
    ],
    eyes: "open",
    mouth: "smile",
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
      {/* The back plate joining the two tanks, so it is one jetpack while it waits; worn, the body covers it. */}
      <rect x="34" y="160" width="132" height="62" rx="14" fill="#868e96" stroke={MASCOT_INK} strokeWidth="4.5" />
      <path d="M60 176 H140 M60 204 H140" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
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

/** The jetpack alone as it sits on the fox's back in the `jet` pose (leaning as it does): it waits for the fox like this and docks onto it. */
export function FoxJetpack() {
  return (
    <div className="tm-jump-part" style={{ transform: `rotate(${POSES.jet.tilt}deg)`, transformOrigin: TILT_ORIGIN }}>
      <Part>
        <Jetpack />
      </Part>
    </div>
  );
}

/** Where a leaning pose turns, round its middle a little below the head. */
const TILT_ORIGIN = "50% 62%";

/**
 * The legs together in a mermaid's tail (user request, 23 November 2026), turquoise with scales, ending in a wide fin
 * – a layer beating up and down at the hips once a second.
 */
function Fin() {
  const style = {
    transformOrigin: `${((150 / 300) * 100).toFixed(1)}% ${((246 / 300) * 100).toFixed(1)}%`,
    "--tm-limb-a": "-16deg",
    "--tm-limb-b": "16deg",
  } as CSSProperties;
  return (
    <Part className="tm-jump-limb" style={style}>
      <path
        d="M76 240 Q74 274 92 300 Q96 306 100 306 Q104 306 108 300 Q126 274 124 240 Z"
        fill="#38d9a9"
        stroke={MASCOT_INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      {[262, 280].map((y) => (
        <path key={y} d={`M${86 + (y - 262) / 3} ${y} q7 7 14 0 q7 7 14 0`} fill="none" stroke="#0ca678" strokeWidth="3" strokeLinecap="round" />
      ))}
      <path
        d="M100 300 Q78 304 60 330 Q78 326 88 334 Q96 320 100 312 Q104 320 112 334 Q122 326 140 330 Q122 304 100 300 Z"
        fill="#20c997"
        stroke={MASCOT_INK}
        strokeWidth="4.5"
        strokeLinejoin="round"
      />
      <path d="M100 310 L80 326 M100 310 L120 326" stroke="#0ca678" strokeWidth="3" strokeLinecap="round" />
    </Part>
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
              {/* The snorkel: from the mouth past the cheek and up beside the head, its top orange. */}
              <path d="M62 82 Q74 86 84 78 Q90 72 90 60 V8" fill="none" stroke={MASCOT_INK} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M62 82 Q74 86 84 78 Q90 72 90 60 V8" fill="none" stroke="#74c0fc" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M90 22 V8" stroke="#ff922b" strokeWidth="5" strokeLinecap="round" />
              <ellipse cx="61" cy="81" rx="5" ry="4" fill="#1971c2" stroke={MASCOT_INK} strokeWidth="2" />
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
      {spec.legs === "fin" && <Fin />}
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
    <div className="tm-jump-part" style={{ transform: `rotate(${spec.tilt}deg)`, transformOrigin: TILT_ORIGIN }}>
      {inner}
    </div>
  ) : (
    inner
  );
}
