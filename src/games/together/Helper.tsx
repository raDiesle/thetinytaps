import { type ReactNode, useId } from "react";
import { Arm, BODY, Foot, FoxTail, MASCOT_INK, type MascotKind, MascotHead } from "@/components/Mascot";

// The helpers of "Was gehört zusammen?": the app's fox or bear (the shared head, feet and arms of `Mascot`) dressed
// for its job – a coat in its colour over the body, sleeves on the arms, a hat on its head and a detail on its chest
// (the fire fighter's stripes, the doctor's cross). Its right paw reaches out to our right, where the tool lands.

const INK = MASCOT_INK;

/** What sits on a helper's head. */
export type HatId =
  | "helmet"
  | "cap"
  | "chef"
  | "hardhat"
  | "peaked"
  | "crown"
  | "wizard"
  | "beret"
  | "straw"
  | "beanie"
  | "rainhat"
  | "veil"
  | "bandana"
  | "tophat"
  | "space"
  | "swim"
  | "headband"
  | "tiara"
  | "mitre"
  | "zipfel"
  | "sailor"
  | "biker"
  | "shako"
  | "aviator";

/** What lies on a helper's coat. */
export type DetailId =
  | "stripes"
  | "apron"
  | "cross"
  | "buttons"
  | "tie"
  | "straps"
  | "strap"
  | "badge"
  | "collar"
  | "belt"
  | "dots"
  | "vest"
  | "cape"
  | "scarf"
  | "bowtie"
  | "checks";

/** A helper's clothes: its coat's colour, a hat and a detail, each with a colour of its own where it has one. */
export interface Outfit {
  coat: string;
  hat?: HatId;
  hatColor?: string;
  detail?: DetailId;
  detailColor?: string;
}

/** The shoulders, elbow and paw of the arm that hangs and of the one reaching out for the tool, in the 200 × 300 box. */
const LEFT_ARM = { from: [58, 178], via: [40, 210], to: [46, 238] } satisfies Record<string, [number, number]>;
const RIGHT_ARM = { from: [142, 178], via: [176, 190], to: [182, 214] } satisfies Record<string, [number, number]>;

/** The sleeve over the first half of an arm (`from` to the curve's middle, the first half of its Bézier). */
function Sleeve({ from, via, to, color }: { from: [number, number]; via: [number, number]; to: [number, number]; color: string }) {
  const c = [(from[0] + via[0]) / 2, (from[1] + via[1]) / 2];
  const m = [0.25 * from[0] + 0.5 * via[0] + 0.25 * to[0], 0.25 * from[1] + 0.5 * via[1] + 0.25 * to[1]];
  const d = `M${from[0]} ${from[1]} Q${c[0]} ${c[1]} ${m[0]} ${m[1]}`;
  return (
    <>
      <path d={d} stroke={INK} strokeWidth="32" fill="none" strokeLinecap="round" />
      <path d={d} stroke={color} strokeWidth="24" fill="none" strokeLinecap="round" />
    </>
  );
}

/** A hat in the head's 100 × 100 box (`MascotHead`): the crown of the head is at about y 22, the eyes at 50. */
function Hat({ hat, color }: { hat: HatId; color?: string }) {
  const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
  switch (hat) {
    case "helmet":
      return (
        <>
          <path d="M16 34 C16 10 32 2 50 2 C68 2 84 10 84 34 Z" fill={color ?? "#e63946"} {...line} />
          <path d="M30 8 Q50 0 70 8" stroke="#fff" strokeWidth="3" opacity="0.5" fill="none" />
          <path d="M8 36 Q50 26 92 36 Q92 42 86 42 Q50 34 14 42 Q8 42 8 36 Z" fill={color ?? "#e63946"} {...line} />
          <path d="M43 12 L50 6 L57 12 L57 24 L50 28 L43 24 Z" fill="#ffd166" {...line} strokeWidth={2.2} />
        </>
      );
    case "cap":
      return (
        <>
          <path d="M20 32 C20 12 34 6 50 6 C66 6 80 12 80 32 Z" fill={color ?? "#1c7ed6"} {...line} />
          <path d="M50 6 L50 32" stroke={INK} strokeWidth="1.8" opacity="0.5" />
          <path d="M24 32 Q50 26 76 32 Q76 42 50 42 Q24 42 24 32 Z" fill={color ?? "#1c7ed6"} {...line} />
          <path d="M28 36 Q50 32 72 36" stroke={INK} strokeWidth="1.6" opacity="0.4" fill="none" />
          <circle cx="50" cy="6" r="3.5" fill={color ?? "#1c7ed6"} {...line} strokeWidth={2} />
        </>
      );
    case "chef":
      return (
        <>
          <path d="M26 30 C10 30 8 6 28 8 C30 -8 48 -10 52 0 C58 -10 76 -6 74 8 C92 6 90 30 74 30 Z" fill={color ?? "#fff"} {...line} />
          <rect x="26" y="24" width="48" height="12" rx="3" fill={color ?? "#fff"} {...line} />
          <path d="M40 10 Q42 18 40 26 M60 10 Q58 18 60 26" stroke="#dee2e6" strokeWidth="2.5" fill="none" />
        </>
      );
    case "hardhat":
      return (
        <>
          <path d="M18 34 C18 12 32 4 50 4 C68 4 82 12 82 34 Z" fill={color ?? "#ffd43b"} {...line} />
          <path d="M42 6 L42 34 M58 6 L58 34" stroke={INK} strokeWidth="2" opacity="0.35" />
          <path d="M10 34 L90 34 Q92 40 86 40 L14 40 Q8 40 10 34 Z" fill={color ?? "#ffd43b"} {...line} />
        </>
      );
    case "peaked":
      return (
        <>
          <path d="M14 10 Q50 -2 86 10 L78 30 L22 30 Z" fill={color ?? "#1d3557"} {...line} />
          <rect x="22" y="26" width="56" height="9" rx="2" fill={INK} />
          <path d="M26 35 Q50 46 74 35 Z" fill="#212529" {...line} strokeWidth={2.4} />
          <path d="M44 14 L50 9 L56 14 L53 21 L47 21 Z" fill="#ffd43b" {...line} strokeWidth={1.8} />
        </>
      );
    case "crown":
      return (
        <>
          <path d="M22 34 L18 6 L34 20 L50 2 L66 20 L82 6 L78 34 Z" fill={color ?? "#ffd43b"} {...line} />
          <circle cx="50" cy="26" r="4" fill="#e63946" stroke={INK} strokeWidth="1.8" />
          <circle cx="33" cy="28" r="3" fill="#4dabf7" stroke={INK} strokeWidth="1.6" />
          <circle cx="67" cy="28" r="3" fill="#69db7c" stroke={INK} strokeWidth="1.6" />
        </>
      );
    case "tiara":
      return (
        <>
          <path d="M26 30 Q50 22 74 30 L68 22 L58 24 L50 10 L42 24 L32 22 Z" fill={color ?? "#ffd43b"} {...line} strokeWidth={2.4} />
          <circle cx="50" cy="20" r="3.4" fill="#f783ac" stroke={INK} strokeWidth="1.6" />
        </>
      );
    case "wizard":
      return (
        <>
          <path d="M22 32 L60 -44 L78 32 Z" fill={color ?? "#5f3dc4"} {...line} />
          <path d="M8 34 Q50 22 92 34 Q92 42 50 40 Q8 42 8 34 Z" fill={color ?? "#5f3dc4"} {...line} />
          <path d="M50 4 L52 9 L57 9 L53 12 L55 17 L50 14 L45 17 L47 12 L43 9 L48 9 Z" fill="#ffd43b" />
          <circle cx="62" cy="-10" r="3" fill="#ffd43b" />
        </>
      );
    case "beret":
      return (
        <>
          <path d="M14 26 C16 8 44 2 66 6 C84 10 90 22 82 30 Q50 38 14 26 Z" fill={color ?? "#c92a2a"} {...line} />
          <path d="M60 4 L64 -2" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "straw":
      return (
        <>
          <path d="M28 30 C28 12 38 6 50 6 C62 6 72 12 72 30 Z" fill={color ?? "#f4d58d"} {...line} />
          <path d="M28 26 L72 26" stroke="#e63946" strokeWidth="5" />
          <ellipse cx="50" cy="32" rx="46" ry="8" fill={color ?? "#f4d58d"} {...line} />
          <path d="M16 31 Q30 29 40 32 M60 32 Q72 29 84 31" stroke="#d4a64a" strokeWidth="1.8" fill="none" />
        </>
      );
    case "beanie":
      return (
        <>
          <path d="M18 34 C18 12 34 6 50 6 C66 6 82 12 82 34 Z" fill={color ?? "#e64980"} {...line} />
          <rect x="16" y="28" width="68" height="11" rx="5" fill={color ?? "#e64980"} {...line} />
          <path d="M26 30 V37 M36 30 V37 M46 30 V37 M56 30 V37 M66 30 V37 M76 30 V37" stroke={INK} strokeWidth="1.5" opacity="0.35" />
          <circle cx="50" cy="5" r="7" fill="#fff" {...line} strokeWidth={2.4} />
        </>
      );
    case "rainhat":
      return (
        <>
          <path d="M24 32 C24 12 36 6 50 6 C64 6 76 12 76 32 Z" fill={color ?? "#ffd43b"} {...line} />
          <path d="M6 44 Q12 30 24 30 L76 30 Q88 30 94 44 Q50 34 6 44 Z" fill={color ?? "#ffd43b"} {...line} />
        </>
      );
    case "veil":
      return (
        <>
          <path d="M28 28 C28 12 38 6 50 6 C62 6 72 12 72 28 Z" fill={color ?? "#f8f9fa"} {...line} />
          <ellipse cx="50" cy="30" rx="44" ry="7" fill={color ?? "#f8f9fa"} {...line} />
          <path d="M10 32 L14 86 Q50 96 86 86 L90 32 Q50 40 10 32 Z" fill="#fff" opacity="0.35" stroke={INK} strokeWidth="2" />
          <path
            d="M22 40 L22 88 M36 40 L36 92 M50 40 L50 94 M64 40 L64 92 M78 40 L78 88 M14 56 Q50 64 86 56 M14 72 Q50 80 86 72"
            stroke={INK}
            strokeWidth="0.9"
            opacity="0.35"
          />
        </>
      );
    case "bandana":
      return (
        <>
          <path d="M16 34 C16 12 32 6 50 6 C68 6 84 12 84 34 Q50 26 16 34 Z" fill={color ?? "#e03131"} {...line} />
          <path d="M82 30 L96 40 L90 46 L80 36 Z M82 30 L94 22 L96 30 Z" fill={color ?? "#e03131"} {...line} strokeWidth={2.4} />
          <circle cx="36" cy="20" r="2.6" fill="#fff" />
          <circle cx="54" cy="16" r="2.6" fill="#fff" />
          <circle cx="66" cy="24" r="2.6" fill="#fff" />
        </>
      );
    case "tophat":
      return (
        <>
          <rect x="28" y="-20" width="44" height="50" rx="3" fill={color ?? "#212529"} {...line} />
          <rect x="28" y="18" width="44" height="8" fill="#e03131" />
          <ellipse cx="50" cy="32" rx="34" ry="6" fill={color ?? "#212529"} {...line} />
        </>
      );
    case "space":
      return (
        <>
          <circle cx="50" cy="54" r="50" fill="#d0ebff" opacity="0.28" stroke={INK} strokeWidth="3" />
          <path d="M22 26 Q34 12 52 10" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M10 84 Q50 108 90 84 L92 100 Q50 116 8 100 Z" fill={color ?? "#f1f3f5"} {...line} />
        </>
      );
    case "swim":
      return (
        <>
          <path d="M16 36 C16 10 32 4 50 4 C68 4 84 10 84 36 Q50 28 16 36 Z" fill={color ?? "#4dabf7"} {...line} />
          <circle cx="37" cy="30" r="8" fill="#a5d8ff" {...line} strokeWidth={2.4} />
          <circle cx="63" cy="30" r="8" fill="#a5d8ff" {...line} strokeWidth={2.4} />
          <path d="M45 30 L55 30" stroke={INK} strokeWidth="2.4" />
        </>
      );
    case "headband":
      return <path d="M16 36 Q50 24 84 36 L84 44 Q50 32 16 44 Z" fill={color ?? "#f03e3e"} {...line} strokeWidth={2.4} />;
    case "mitre":
      // Saint Nicholas's tall hat, with its gold bands.
      return (
        <>
          <path d="M26 34 L26 4 Q30 -24 50 -38 Q70 -24 74 4 L74 34 Q50 28 26 34 Z" fill={color ?? "#e03131"} {...line} />
          <path d="M50 -36 V30 M27 20 Q50 14 73 20" stroke="#ffd43b" strokeWidth="6" fill="none" />
          <path d="M26 4 L26 34 Q50 28 74 34 L74 4" stroke={INK} strokeWidth="3" fill="none" />
        </>
      );
    case "zipfel":
      // A dwarf's long pointed cap, its tip flopping over to the side with a bobble.
      return (
        <>
          <path d="M18 34 Q20 2 54 -16 Q80 -30 100 -8 Q88 -8 80 2 Q84 18 82 34 Q50 26 18 34 Z" fill={color ?? "#e03131"} {...line} />
          <path d="M16 30 Q50 22 84 30 L84 40 Q50 32 16 40 Z" fill="#f1f3f5" {...line} strokeWidth={2.4} />
          <circle cx="100" cy="-8" r="7" fill="#f1f3f5" {...line} strokeWidth={2.4} />
        </>
      );
    case "sailor":
      // A sailor's cap: a flat white top over a dark band, its two ribbons hanging behind.
      return (
        <>
          <path d="M76 32 L90 50 L84 54 L72 36 Z M80 32 L96 44 L92 50 L76 36 Z" fill={color ?? "#1d3557"} {...line} strokeWidth={2} />
          <path d="M22 22 L78 22 L80 36 Q50 30 20 36 Z" fill={color ?? "#1d3557"} {...line} />
          <path d="M12 20 Q50 0 88 20 Q88 28 50 28 Q12 28 12 20 Z" fill="#f8f9fa" {...line} />
        </>
      );
    case "biker":
      // A round motorbike helmet over the head and ears, the visor pushed up.
      return (
        <>
          <path d="M8 62 C6 18 26 -2 50 -2 C74 -2 94 18 92 62 L80 62 C80 44 70 34 50 34 C30 34 20 44 20 62 Z" fill={color ?? "#e03131"} {...line} />
          <path d="M18 36 Q50 20 82 36 L80 44 Q50 30 20 44 Z" fill="#495057" {...line} strokeWidth={2.4} />
          <path d="M30 8 Q44 2 58 4" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
        </>
      );
    case "shako":
      // A marching band's tall hat with a plume.
      return (
        <>
          <path d="M28 34 L30 -14 L70 -14 L72 34 Z" fill={color ?? "#e03131"} {...line} />
          <path d="M29 -2 H71 M29 6 H71" stroke="#ffd43b" strokeWidth="4" />
          <path d="M24 34 Q50 42 76 34 L72 30 Q50 36 28 30 Z" fill="#212529" {...line} strokeWidth={2.4} />
          <path d="M50 -14 Q38 -34 50 -44 Q62 -34 50 -14 Z" fill="#f8f9fa" {...line} strokeWidth={2.4} />
        </>
      );
    case "aviator":
      // An old flyer's leather cap with ear flaps and goggles on the forehead.
      return (
        <>
          <path d="M16 36 C16 10 32 4 50 4 C68 4 84 10 84 36 Z" fill={color ?? "#a0663a"} {...line} />
          <path d="M16 30 Q12 50 20 60 L30 56 Q26 44 28 32 Z M84 30 Q88 50 80 60 L70 56 Q74 44 72 32 Z" fill={color ?? "#a0663a"} {...line} />
          <path d="M18 26 Q50 16 82 26" stroke="#5c3d2e" strokeWidth="5" fill="none" />
          <circle cx="38" cy="22" r="8" fill="#a5d8ff" {...line} strokeWidth={2.4} />
          <circle cx="62" cy="22" r="8" fill="#a5d8ff" {...line} strokeWidth={2.4} />
        </>
      );
  }
}

/** What lies on the coat, in the 200 × 300 box, clipped to the body (`BODY`). */
function Detail({ detail, color }: { detail: DetailId; color?: string }) {
  const line = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const };
  switch (detail) {
    case "stripes":
      return <path d="M30 226 L170 226 M30 252 L170 252" stroke={color ?? "#ffd43b"} strokeWidth="11" />;
    case "apron":
      return <path d="M76 168 L124 168 L132 290 L68 290 Z M70 214 Q100 222 130 214" fill={color ?? "#fff"} {...line} />;
    case "cross":
      return <path d="M114 186 h10 v-10 h10 v10 h10 v10 h-10 v10 h-10 v-10 h-10 Z" fill={color ?? "#e03131"} {...line} strokeWidth={2} />;
    case "buttons":
      return (
        <g fill={color ?? "#ffd43b"} {...line} strokeWidth={2}>
          <circle cx="100" cy="182" r="5" />
          <circle cx="100" cy="210" r="5" />
          <circle cx="100" cy="238" r="5" />
        </g>
      );
    case "tie":
      return (
        <>
          <path d="M84 146 L100 160 L116 146" fill="#fff" {...line} />
          <path d="M100 160 L92 168 L96 220 L100 228 L104 220 L108 168 Z" fill={color ?? "#e03131"} {...line} />
        </>
      );
    case "straps":
      return (
        <>
          <path d="M72 200 L128 200 L132 290 L68 290 Z" fill={color ?? "#1c7ed6"} {...line} />
          <path d="M76 202 L70 150 M124 202 L130 150" stroke={color ?? "#1c7ed6"} strokeWidth="9" />
          <circle cx="78" cy="206" r="4" fill="#ffd43b" stroke={INK} strokeWidth="1.6" />
          <circle cx="122" cy="206" r="4" fill="#ffd43b" stroke={INK} strokeWidth="1.6" />
        </>
      );
    case "strap":
      return (
        <>
          <path d="M66 150 L150 250" stroke={INK} strokeWidth="13" />
          <path d="M66 150 L150 250" stroke={color ?? "#8b5e3c"} strokeWidth="8" />
        </>
      );
    case "badge":
      return <path d="M80 176 L84 186 L95 186 L86 192 L90 203 L80 196 L70 203 L74 192 L65 186 L76 186 Z" fill={color ?? "#ffd43b"} {...line} strokeWidth={2} />;
    case "collar":
      return <path d="M76 144 L100 176 L124 144 L114 142 L100 160 L86 142 Z" fill={color ?? "#fff"} {...line} />;
    case "belt":
      return (
        <>
          <path d="M30 238 L170 238" stroke={INK} strokeWidth="15" />
          <path d="M30 238 L170 238" stroke={color ?? "#5c3d2e"} strokeWidth="10" />
          <rect x="90" y="230" width="20" height="16" rx="2" fill="none" stroke="#ffd43b" strokeWidth="4" />
        </>
      );
    case "dots":
      return (
        <g fill={color ?? "#fff"}>
          {[
            [76, 180],
            [118, 172],
            [96, 206],
            [132, 220],
            [70, 232],
            [108, 248],
            [84, 268],
            [128, 262],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="7" />
          ))}
        </g>
      );
    case "vest":
      return (
        <>
          <path d="M60 156 L94 156 L92 290 L40 290 Z" fill={color ?? "#2b8a3e"} {...line} />
          <path d="M140 156 L106 156 L108 290 L160 290 Z" fill={color ?? "#2b8a3e"} {...line} />
        </>
      );
    case "scarf":
      return (
        <g {...line}>
          <path d="M118 166 L128 204 Q121 209 113 206 L108 172 Z" fill={color ?? "#4dabf7"} />
          <path d="M62 150 Q100 174 138 150 L134 168 Q100 190 66 168 Z" fill={color ?? "#4dabf7"} />
        </g>
      );
    case "bowtie":
      return (
        <g fill={color ?? "#e03131"} {...line} strokeWidth={2}>
          <path d="M82 144 L100 152 L82 162 Z M118 144 L100 152 L118 162 Z" />
          <circle cx="100" cy="152" r="4.5" />
        </g>
      );
    case "checks":
      // A checked shirt, as a woodcutter wears it: dark bands across and down the coat.
      return (
        <path
          d="M40 166 H160 M40 202 H160 M40 238 H160 M40 274 H160 M64 140 V290 M100 140 V290 M136 140 V290"
          stroke={color ?? "#212529"}
          strokeWidth="9"
          opacity="0.4"
        />
      );
    case "cape":
      // Drawn behind the body instead (`Helper`).
      return null;
  }
}

/**
 * A fox or bear helper standing, 200 × 300 like `Mascot`, dressed in `outfit`, its right paw (at 182, 214) held
 * out to our right for its tool.
 */
export function Helper({ kind, outfit, lashes = false, children }: { kind: MascotKind; outfit: Outfit; lashes?: boolean; children?: ReactNode }) {
  const clip = useId();
  const fox = kind === "fox";
  const { coat, hat, hatColor, detail, detailColor } = outfit;
  return (
    <svg viewBox="0 0 200 300" overflow="visible" aria-hidden>
      <defs>
        <clipPath id={clip}>
          <path d={BODY} />
        </clipPath>
      </defs>
      <ellipse cx="100" cy="292" rx="66" ry="7" fill="#3a2418" opacity="0.14" />
      {detail === "cape" && (
        <path d="M64 150 L136 150 L176 288 Q100 300 24 288 Z" fill={detailColor ?? "#c92a2a"} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      )}
      {fox && <FoxTail />}
      <Foot x={78} kind={kind} />
      <Foot x={122} kind={kind} />
      <path d={BODY} fill={coat} />
      <path d="M130 152 C151 168 159 196 157 222 C155 247 144 267 121 275 C138 252 144 226 142 200 C140 180 136 164 130 152 Z" fill="#000" opacity="0.1" />
      {detail && detail !== "cape" && (
        <g clipPath={`url(#${clip})`}>
          <Detail detail={detail} color={detailColor} />
        </g>
      )}
      <path d={BODY} fill="none" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
      <Arm {...LEFT_ARM} kind={kind} />
      <Sleeve {...LEFT_ARM} color={coat} />
      <Arm {...RIGHT_ARM} kind={kind} />
      <Sleeve {...RIGHT_ARM} color={coat} />
      {children}
      <g transform="translate(40 40) scale(1.2)">
        <MascotHead kind={kind} lashes={lashes}>
          {hat && <Hat hat={hat} color={hatColor} />}
        </MascotHead>
      </g>
    </svg>
  );
}
