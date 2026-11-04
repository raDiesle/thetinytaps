import type { ReactNode } from "react";

// The app's two mascots, the fox and the bear, drawn once for every game: a head (`MascotHead`) that every drawing of a
// fox or bear uses, whatever its body or clothes, and a whole figure standing (`Mascot`). They follow the families of
// the Gemini pictures (bilder/buch-fuechse.webp, buch-baeren.webp): a soft plum-brown line, the fox's white cheeks in
// tufts, ears with fluff inside, a darker side of fur where the light doesn't reach, brows, eyes with two lights and a
// shiny nose. They are drawn once in a pose and never again per frame; what moves is the HTML layer round them (a hop),
// never a part inside their svg, which a phone would paint anew.

/** The line round the mascots, the plum brown of the Gemini pictures. */
export const MASCOT_INK = "#4a2c33";

/** Which of the app's two mascots. */
export type MascotKind = "fox" | "bear";

/** One mascot's colours: its fur, the fur's shadow and light, the pale fur (fox's white, bear's snout), paws and ears inside. */
export interface MascotColors {
  fur: string;
  shade: string;
  light: string;
  pale: string;
  paleShade: string;
  paw: string;
  earIn: string;
}

/** The colours of fox and bear, for bodies and clothes drawn round a `MascotHead` elsewhere. */
export const MASCOT_COLORS: Record<MascotKind, MascotColors> = {
  fox: { fur: "#ea7a32", shade: "#c35a22", light: "#f8a560", pale: "#fff6ea", paleShade: "#ecd6c0", paw: "#5c3424", earIn: "#9b4520" },
  bear: { fur: "#a8663b", shade: "#87492a", light: "#c58552", pale: "#e9bf8f", paleShade: "#d3a06d", paw: "#87492a", earIn: "#e6b37f" },
};

/** The same path seen in a mirror across the head's middle (x 50 of its 100 × 100 box); only "x y" pairs, no H or V. */
function mirror(d: string): string {
  return d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x: string, y: string) => `${+(100 - Number(x)).toFixed(2)} ${y}`);
}

// The fox's head with its cheek tufts and a tuft on the forehead, its white (cheeks, chin) following the same tufts.
const FOX_HEAD =
  "M50 91 C37 90 27 84 20 75 Q14 75 9 72 Q12 69 14 66 Q10 64 8 60 Q12 58 15 56 C15 42 24 29 40 23 Q44 16 52 14 Q50 18 52 22 Q56 21 60 22 C76 27 85 42 85 56 Q88 58 92 60 Q90 64 86 66 Q88 69 91 72 Q86 75 80 75 C73 84 63 90 50 91 Z";
const FOX_WHITE =
  "M15 56 Q12 58 8 60 Q10 64 14 66 Q12 69 9 72 Q14 75 20 75 C27 84 37 90 50 91 C63 90 73 84 80 75 Q86 75 91 72 Q88 69 86 66 Q90 64 92 60 Q88 58 85 56 C77 53 70 56 65 62 C61 67 56 70 50 70 C44 70 39 67 35 62 C30 56 23 53 15 56 Z";
const FOX_EAR = "M22 46 C17 32 15 17 19 6 Q21 2 25 5 C34 11 42 19 47 28 Z";
const FOX_EAR_IN = "M26 38 C23 28 22 18 24 11 C31 16 37 22 41 29 Z";
const FOX_EAR_FLUFF = "M25 41 Q26 33 24 26 Q29 30 30 35 Q31 28 33 23 Q35 30 34 36 Q37 33 41 31 Q38 37 36 42 Z";
const FOX_EARS = `${FOX_EAR} ${mirror(FOX_EAR)}`;
const FOX_EARS_IN = `${FOX_EAR_IN} ${mirror(FOX_EAR_IN)}`;
const FOX_EARS_FLUFF = `${FOX_EAR_FLUFF} ${mirror(FOX_EAR_FLUFF)}`;
// The far side of the head in shadow, and where the light falls on the forehead.
const FOX_SHADE = "M63 25 C79 31 86 43 85 54 Q83 47 79 42 C76 35 71 29 63 25 Z";

// The bear's round head with small tufts at the cheeks and one on top.
const BEAR_HEAD =
  "M56 21 C74 23 86 35 87 52 Q90 55 93 60 Q89 61 87 63 C84 80 69 92 50 92 C31 92 16 80 13 63 Q11 61 7 60 Q10 55 13 52 C14 34 27 22 44 21 Q47 15 53 14 Q50 18 56 21 Z";
const BEAR_SHADE = "M64 24 C79 30 87 41 87 52 Q85 46 80 41 C76 33 71 28 64 24 Z";
const BEAR_SNOUT_SHADE = "M33 73 Q50 88 67 73 Q65 82 50 83.5 Q35 82 33 73 Z";

// A few strokes of fur on the forehead and the temples.
const FUR_FLICKS = "M47 27 Q49 31 48 34 M53 28 Q54 31 53 33 M22 47 Q25 49 25 52 M78 47 Q75 49 75 52";

// Brows, lashes and the mouth's lines, for the left side (as we see it) and mirrored.
const BROW = "M31 44 Q36 41 41 43";
const LASH = "M32 48 L28.5 45.5 M34 46.5 L32 43";

/** How the eyes are: open, shut in sleep, or laughing (two arcs up). */
export type MascotEyes = "open" | "shut" | "happy";

/** The mouth: a little smile, or open with the tongue when cheering or laughing. */
export type MascotMouth = "smile" | "open";

/**
 * A fox's or a bear's head facing us in a 100 × 100 box (the head's middle at about 50, 56, its ears up to the top), to be
 * placed with a transform in any drawing; what is drawn as `children` (a hat, a bow, glasses) lies over it in the same box.
 * `child` has bigger eyes; `lashes` are for Mama, Oma or a girl; without `outline` it fits pictures drawn without lines.
 */
export function MascotHead({
  kind,
  child = false,
  eyes = "open",
  mouth = "smile",
  lashes = false,
  outline = true,
  children,
}: {
  kind: MascotKind;
  child?: boolean;
  eyes?: MascotEyes;
  mouth?: MascotMouth;
  lashes?: boolean;
  outline?: boolean;
  children?: ReactNode;
}) {
  const fox = kind === "fox";
  const c = MASCOT_COLORS[kind];
  const line = outline ? { stroke: MASCOT_INK, strokeWidth: 3.2, strokeLinejoin: "round" as const } : {};
  const head = fox ? FOX_HEAD : BEAR_HEAD;
  // The nose sits a little higher on the bear's short snout than on the fox's.
  const noseY = fox ? 0 : -1;
  return (
    <g>
      {fox ? (
        <>
          <path d={FOX_EARS} fill={c.fur} {...line} />
          <path d={FOX_EARS_IN} fill={c.earIn} />
          <path d={FOX_EARS_FLUFF} fill={c.pale} />
        </>
      ) : (
        <>
          <circle cx="23" cy="29" r="13" fill={c.fur} {...line} />
          <circle cx="77" cy="29" r="13" fill={c.fur} {...line} />
          <circle cx="24.5" cy="31" r="7.5" fill={c.earIn} />
          <circle cx="75.5" cy="31" r="7.5" fill={c.earIn} />
          <path d="M18.5 33 Q20 26 27 25" fill="none" stroke={c.paleShade} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M81.5 33 Q80 26 73 25" fill="none" stroke={c.paleShade} strokeWidth="2.4" strokeLinecap="round" />
        </>
      )}
      <path d={head} fill={c.fur} />
      <path d={fox ? FOX_SHADE : BEAR_SHADE} fill={c.shade} opacity="0.75" />
      <ellipse cx="37" cy="33" rx="10" ry="5" transform="rotate(-22 37 33)" fill={c.light} opacity="0.7" />
      <path d={FUR_FLICKS} fill="none" stroke={c.shade} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      {fox ? (
        <>
          <path d={FOX_WHITE} fill={c.pale} />
          <path d="M66 63 C72 58 78 56 84 57 Q80 62 76 63 C72 68 66 72 60 72 Q64 68 66 63 Z" fill={c.paleShade} opacity="0.8" />
        </>
      ) : (
        <>
          <ellipse cx="50" cy="70" rx="18" ry="13.5" fill={c.pale} />
          <path d={BEAR_SNOUT_SHADE} fill={c.paleShade} opacity="0.8" />
        </>
      )}
      {outline && <path d={head} fill="none" {...line} />}
      <ellipse cx="26" cy="67" rx="5.5" ry="3.6" fill="#ff8f8f" opacity="0.45" />
      <ellipse cx="74" cy="67" rx="5.5" ry="3.6" fill="#ff8f8f" opacity="0.45" />
      <path d={`${BROW} ${mirror(BROW)}`} fill="none" stroke={c.shade} strokeWidth="2.4" strokeLinecap="round" />
      <Eyes eyes={eyes} child={child} bear={!fox} />
      {lashes && eyes === "open" && <path d={`${LASH} ${mirror(LASH)}`} fill="none" stroke={MASCOT_INK} strokeWidth="1.8" strokeLinecap="round" />}
      {fox && (
        <g fill={c.paleShade}>
          <circle cx="40" cy="70" r="0.9" />
          <circle cx="37" cy="73" r="0.9" />
          <circle cx="60" cy="70" r="0.9" />
          <circle cx="63" cy="73" r="0.9" />
        </g>
      )}
      <g transform={`translate(0 ${noseY})`}>
        <Mouth mouth={mouth} bear={!fox} />
        <path d={fox ? "M44 64 Q50 61 56 64 Q55 69 50 70 Q45 69 44 64 Z" : "M41.5 63 Q50 58.5 58.5 63 Q57 70 50 71.5 Q43 70 41.5 63 Z"} fill={MASCOT_INK} />
        <ellipse cx={fox ? 47.6 : 47} cy={fox ? 63.8 : 62.6} rx={fox ? 2 : 2.6} ry="1.1" fill="#fff" opacity="0.75" />
      </g>
      {children}
    </g>
  );
}

/** Both eyes: dark with a big and a small light, a child's bigger; or shut, or laughing. */
function Eyes({ eyes, child, bear }: { eyes: MascotEyes; child: boolean; bear: boolean }) {
  if (eyes !== "open") {
    const d = eyes === "shut" ? "M31 52 Q37 57 43 52" : "M31 54 Q37 47 43 54";
    return <path d={`${d} ${mirror(d)}`} fill="none" stroke={MASCOT_INK} strokeWidth="2.8" strokeLinecap="round" />;
  }
  const rx = (child ? 5.4 : 4.6) - (bear ? 0.4 : 0);
  const ry = (child ? 6.2 : 5.4) - (bear ? 0.5 : 0);
  return (
    <>
      {[37, 63].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="52" rx={rx} ry={ry} fill="#2e1a14" />
          <circle cx={cx + rx * 0.35} cy={52 - ry * 0.38} r={rx * 0.42} fill="#fff" />
          <circle cx={cx - rx * 0.35} cy={52 + ry * 0.4} r={rx * 0.18} fill="#fff" opacity="0.85" />
        </g>
      ))}
    </>
  );
}

/** The mouth under the nose: a soft „w“ smile, or open with a pink tongue. */
function Mouth({ mouth, bear }: { mouth: MascotMouth; bear: boolean }) {
  const top = bear ? 74.5 : 73;
  const under = bear ? 71 : 69.5;
  if (mouth === "open") {
    return (
      <>
        <path
          d={`M42.5 ${top} Q50 ${top + 1.5} 57.5 ${top} Q56.5 ${top + 11} 50 ${top + 11} Q43.5 ${top + 11} 42.5 ${top} Z`}
          fill="#7a2c2e"
          stroke={MASCOT_INK}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d={`M45.5 ${top + 7.5} Q50 ${top + 4.5} 54.5 ${top + 7.5} Q53.5 ${top + 10.5} 50 ${top + 10.5} Q46.5 ${top + 10.5} 45.5 ${top + 7.5} Z`}
          fill="#f07b85"
        />
        <path d={`M50 ${under} L50 ${top}`} stroke={MASCOT_INK} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }
  return (
    <path
      d={`M50 ${under} L50 ${top} M43.5 ${top} Q47 ${top + 4} 50 ${top} Q53 ${top + 4} 56.5 ${top}`}
      fill="none"
      stroke={MASCOT_INK}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

/** How the arms are: both down, the right one raised to wave, or both up in a cheer. */
export type MascotPose = "stand" | "wave" | "cheer";

/**
 * A fox or a bear standing and facing us, 200 × 300, feet at the bottom; a child has a bigger head and a scarf. Standing,
 * its right arm (`.mascot-arm`, turning at the shoulder) may be waved by the Timer, whose figures are small; elsewhere
 * the pose is drawn still. Cheering, it laughs with its mouth open.
 */
export function Mascot({ kind, child = false, pose = "stand" }: { kind: MascotKind; child?: boolean; pose?: MascotPose }) {
  const fox = kind === "fox";
  const c = MASCOT_COLORS[kind];
  // A child's head is bigger for its body, like a small child's.
  const head = child ? "translate(32.5 28) scale(1.35)" : "translate(40 40) scale(1.2)";
  return (
    <svg viewBox="0 0 200 300">
      {fox && <FoxTail />}
      <Foot x={78} kind={kind} />
      <Foot x={122} kind={kind} />
      <path d={BODY} fill={c.fur} stroke={MASCOT_INK} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M128 152 C148 168 156 196 154 222 C152 246 142 266 120 274 C136 252 142 226 140 200 C138 180 134 164 128 152 Z" fill={c.shade} opacity="0.7" />
      <path d={fox ? FOX_BELLY : BEAR_BELLY} fill={c.pale} />
      <path
        d="M118 176 C126 192 128 214 126 236 C124 252 116 262 106 266 C116 248 120 226 118 206 C117 194 118 184 118 176 Z"
        fill={c.paleShade}
        opacity="0.8"
      />
      <path d={BODY} fill="none" stroke={MASCOT_INK} strokeWidth="4.5" strokeLinejoin="round" />
      {child && <Scarf color={fox ? "#4dabf7" : "#ffd43b"} stripe={fox ? "#d0ebff" : "#fff3bf"} />}
      {/* The left arm as we see it hangs (or cheers); the right one hangs, waves or cheers. */}
      {pose === "cheer" ? (
        <Arm from={[60, 176]} via={[34, 152]} to={[30, 114]} kind={kind} />
      ) : (
        <Arm from={[58, 178]} via={[40, 210]} to={[46, 238]} kind={kind} />
      )}
      {pose === "stand" ? (
        <g className="mascot-arm">
          <Arm from={[142, 178]} via={[160, 210]} to={[154, 238]} kind={kind} />
        </g>
      ) : (
        <Arm from={[140, 176]} via={[166, 152]} to={[170, 114]} kind={kind} />
      )}
      <g transform={head}>
        <MascotHead kind={kind} child={child} mouth={pose === "cheer" ? "open" : "smile"} />
      </g>
    </svg>
  );
}

// The body, a soft pear from the neck to the feet, and the pale belly on it: the fox's white chest in tufts, the bear's round.
const BODY = "M100 142 C70 142 50 170 46 206 C42 246 58 276 100 278 C142 276 158 246 154 206 C150 170 130 142 100 142 Z";
const FOX_BELLY = "M82 150 Q90 160 100 156 Q110 160 118 150 C128 170 132 194 130 220 C128 248 116 266 100 266 C84 266 72 248 70 220 C68 194 72 170 82 150 Z";
const BEAR_BELLY = "M100 168 C120 168 132 190 132 218 C132 246 118 264 100 264 C82 264 68 246 68 218 C68 190 80 168 100 168 Z";

/** The fox's big bushy tail behind it on the right, with its white tip in tufts and its far side in shadow. */
function FoxTail() {
  const c = MASCOT_COLORS.fox;
  const tail = "M128 256 C176 258 198 218 188 176 Q187 160 179 146 Q174 152 169 150 Q167 158 161 160 C168 196 158 222 128 230 Z";
  return (
    <>
      <path d={tail} fill={c.fur} />
      <path d="M161 160 C168 196 158 222 128 230 L130 244 C162 238 176 206 170 168 Z" fill={c.shade} opacity="0.75" />
      <path
        d="M188 176 Q187 160 179 146 Q174 152 169 150 Q167 158 161 160 C163 168 165 174 166 181 Q171 177 175 181 Q179 175 183 179 Q185 175 188 176 Z"
        fill={c.pale}
      />
      <path d={tail} fill="none" stroke={MASCOT_INK} strokeWidth="4" strokeLinejoin="round" />
    </>
  );
}

/** One foot at `x`: the fox's dark paw with its toes, the bear's with pale pads on its sole. */
function Foot({ x, kind }: { x: number; kind: MascotKind }) {
  const c = MASCOT_COLORS[kind];
  return (
    <g>
      <ellipse cx={x} cy="284" rx="23" ry="13" fill={kind === "fox" ? c.paw : c.fur} stroke={MASCOT_INK} strokeWidth="4" />
      {kind === "fox" ? (
        <path d={`M${x - 7} 292 L${x - 7} 285 M${x + 7} 292 L${x + 7} 285`} stroke={MASCOT_INK} strokeWidth="2.4" strokeLinecap="round" />
      ) : (
        <g fill={c.pale}>
          <ellipse cx={x} cy="287" rx="10" ry="6" />
          <circle cx={x - 12} cy="280" r="3.4" />
          <circle cx={x} cy="277" r="3.4" />
          <circle cx={x + 12} cy="280" r="3.4" />
        </g>
      )}
    </g>
  );
}

/** One arm from the shoulder `from` bending through `via` to the paw at `to`: fur with the line round it, and a paw. */
function Arm({ from, via, to, kind }: { from: [number, number]; via: [number, number]; to: [number, number]; kind: MascotKind }) {
  const c = MASCOT_COLORS[kind];
  const d = `M${from[0]} ${from[1]} Q${via[0]} ${via[1]} ${to[0]} ${to[1]}`;
  return (
    <>
      <path d={d} stroke={MASCOT_INK} strokeWidth="25" fill="none" strokeLinecap="round" />
      <path d={d} stroke={c.fur} strokeWidth="17" fill="none" strokeLinecap="round" />
      <circle cx={to[0]} cy={to[1]} r="12.5" fill={kind === "fox" ? c.paw : c.fur} stroke={MASCOT_INK} strokeWidth="4" />
      {kind === "bear" && <ellipse cx={to[0]} cy={to[1] + 2} rx="6.5" ry="5" fill={c.pale} />}
      {kind === "fox" && <circle cx={to[0] - 3.5} cy={to[1] - 4} r="3" fill="#fff" opacity="0.18" />}
    </>
  );
}

/** The child's scarf round its neck, striped, with one end hanging down. */
function Scarf({ color, stripe }: { color: string; stripe: string }) {
  return (
    <g stroke={MASCOT_INK} strokeWidth="3" strokeLinejoin="round">
      <path d="M118 170 L128 204 Q121 209 113 206 L108 176 Z" fill={color} />
      <path d="M62 154 Q100 178 138 154 L134 172 Q100 194 66 172 Z" fill={color} />
      <path d="M80 168 L77 183 M100 172 L100 188 M120 168 L123 183 M112 190 L124 188" fill="none" stroke={stripe} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/**
 * A fox or bear child jumping for joy with both arms up, its grown-up beside it waving (D-12): for the end of a game.
 * Each is an HTML layer of its own, so the child's two hops (`mascot-jump`) move only its small picture; then both
 * stand still. It takes the height of its box (`.mascot-family`), the child about two thirds as tall.
 */
export function CheeringFamily({ kind, className }: { kind: MascotKind; className?: string }) {
  return (
    <span className={`mascot-family${className ? ` ${className}` : ""}`} aria-hidden>
      <span className="mascot-grown">
        <Mascot kind={kind} pose="wave" />
      </span>
      <span className="mascot-child">
        <Mascot kind={kind} child pose="cheer" />
      </span>
    </span>
  );
}
