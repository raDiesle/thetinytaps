import { Lids } from "../baustelle/figures";
import { Eye, Face, INK, SKIN, nth } from "../shared";
import { SNOW, SNOW_SHADE } from "../winterbaustelle/parts";

// The horse sleigh on the path, facing left: a brown horse with bells on its collar pulls a red
// sleigh with Papa and a child. It stands with its foot point (the middle of the runners) on (0, 0).

const HORSE = "#9c6b3c";
const HORSE_DARK = "#7a5230";
const MANE = "#4a2c17";

/** One leg of the horse from the hip at (x, -100) down to the hoof. */
function Leg({ x, fill }: { x: number; fill: string }) {
  return (
    <>
      <rect x={x - 6.5} y="-104" width="13" height="94" rx="6" fill={fill} />
      <rect x={x - 8} y="-22" width="16" height="10" rx="4" fill="#f1e3d3" />
      <rect x={x - 8} y="-12" width="16" height="12" rx="3" fill="#3d2b1f" />
    </>
  );
}

const BELLS = [
  [-196, -146],
  [-186, -134],
  [-176, -124],
] as const;

export function Pferdeschlitten() {
  return (
    <>
      <g className="wi-ps-snow" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [-200, -8],
          [-122, -8],
          [196, -10],
          [210, -22],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" style={nth(i)} />
        ))}
      </g>
      <g className="wi-ps-ride" style={{ transformOrigin: "0px 0px" }}>
        {/* Legs on the far side */}
        <g className="wi-pferd-leg-b" style={{ transformOrigin: "-184px -100px" }}>
          <Leg x={-184} fill={HORSE_DARK} />
        </g>
        <g className="wi-pferd-leg-a" style={{ transformOrigin: "-110px -100px" }}>
          <Leg x={-110} fill={HORSE_DARK} />
        </g>
        <g className="wi-pferd-tail" style={{ transformOrigin: "-92px -124px" }}>
          <path d="M-92 -128 Q-58 -132 -60 -94 Q-62 -70 -72 -60 Q-74 -96 -94 -112 Z" fill={MANE} />
        </g>
        <ellipse cx="-150" cy="-112" rx="64" ry="32" fill={HORSE} />
        <path d="M-200 -100 Q-150 -76 -96 -100 Q-120 -82 -150 -82 Q-182 -82 -200 -100 Z" fill={HORSE_DARK} opacity="0.5" />
        <path d="M-172 -140 Q-148 -150 -116 -138 L-120 -104 Q-148 -98 -176 -106 Z" fill="#e63946" />
        <path d="M-176 -106 Q-148 -98 -120 -104" stroke="#ffd166" strokeWidth="4" fill="none" />
        {/* Legs on the near side */}
        <g className="wi-pferd-leg-a" style={{ transformOrigin: "-196px -100px" }}>
          <Leg x={-196} fill={HORSE} />
        </g>
        <g className="wi-pferd-leg-b" style={{ transformOrigin: "-122px -100px" }}>
          <Leg x={-122} fill={HORSE} />
        </g>
        {/* Neck, mane and head */}
        <path d="M-198 -126 Q-206 -168 -222 -186 L-196 -202 Q-176 -170 -160 -134 Z" fill={HORSE} />
        <path d="M-206 -206 Q-192 -186 -182 -160 Q-174 -142 -164 -134 L-158 -142 Q-168 -160 -176 -180 Q-186 -200 -196 -210 Z" fill={MANE} />
        <g className="wi-pferd-head" style={{ transformOrigin: "-204px -176px" }}>
          <path d="M-212 -210 L-206 -228 L-200 -206 Z" fill={HORSE_DARK} />
          <path d="M-226 -200 Q-250 -194 -262 -168 Q-266 -154 -252 -150 Q-236 -152 -220 -168 Q-204 -186 -210 -200 Q-216 -206 -226 -200 Z" fill={HORSE} />
          <path d="M-224 -206 L-222 -226 L-212 -206 Z" fill={HORSE} />
          <ellipse cx="-254" cy="-160" rx="11" ry="9" fill="#c68b59" />
          <circle cx="-259" cy="-162" r="2.5" fill="#3d2b1f" />
          <path d="M-222 -204 Q-230 -214 -220 -216 Q-214 -208 -222 -204 Z" fill={MANE} />
          <path d="M-244 -186 L-226 -166 M-250 -176 L-232 -182" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
          <Eye cx={-230} cy={-184} r={4} />
          <Lids eyes={[[-230, -184]]} r={5} fill={HORSE} />
          <path d="M-258 -154 Q-252 -150 -246 -153" stroke="#3d2b1f" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
        {/* Collar with bells */}
        <path d="M-204 -150 Q-180 -170 -166 -128" stroke="#e63946" strokeWidth="12" strokeLinecap="round" fill="none" />
        {BELLS.map(([cx, cy], i) => (
          <g key={cx} className="wi-pferd-bell" style={{ ...nth(i), transformOrigin: `${cx}px ${cy - 5}px` }}>
            <circle cx={cx} cy={cy} r="6" fill="#ffd166" stroke="#c9a227" strokeWidth="1.5" />
            <circle cx={cx - 2} cy={cy - 2} r="1.8" fill="#fff" />
          </g>
        ))}
        {/* Shaft and reins */}
        <path d="M-44 -62 L-170 -116" stroke="#6f4520" strokeWidth="5" strokeLinecap="round" />
        <path className="wi-ps-reins" d="M-238 -172 Q-100 -150 18 -100" stroke="#5c3a2e" strokeWidth="2.5" fill="none" />

        {/* Papa and the child sit in the sleigh, behind its side */}
        <g className="wi-ps-driver" style={{ transformOrigin: "40px -70px" }}>
          <path d="M18 -70 Q14 -112 40 -116 Q66 -112 62 -70 Z" fill="#2d6a4f" />
          <path d="M24 -104 L12 -96" stroke="#2d6a4f" strokeWidth="11" strokeLinecap="round" />
          <circle cx="12" cy="-97" r="6.5" fill="#7f4f24" />
          <rect x="24" y="-120" width="32" height="8" rx="4" fill="#e63946" />
          <circle cx="40" cy="-138" r="19" fill={SKIN} />
          <Face cx={40} cy={-139} size={0.7} />
          <Lids
            eyes={[
              [35.1, -139],
              [44.9, -139],
            ]}
            r={2.9}
            fill={SKIN}
          />
          <path d="M28 -128 Q40 -120 52 -128 Q48 -122 40 -122 Q32 -122 28 -128 Z" fill="#7f4f24" />
          <path d="M20 -142 Q20 -164 40 -164 Q60 -164 60 -142 Z" fill={INK} />
          <rect x="18" y="-146" width="44" height="7" rx="3.5" fill="#495057" />
        </g>
        <g className="wi-ps-child" style={{ transformOrigin: "122px -70px" }}>
          <path d="M104 -70 Q102 -104 122 -106 Q142 -104 140 -70 Z" fill="#ffd60a" />
          <g className="wi-ps-wave" style={{ transformOrigin: "134px -98px" }}>
            <path d="M134 -98 L152 -124" stroke="#ffd60a" strokeWidth="9" strokeLinecap="round" />
            <circle cx="154" cy="-127" r="6" fill="#4dabf7" />
          </g>
          <circle cx="122" cy="-122" r="15" fill={SKIN} />
          <Face cx={122} cy={-123} size={0.55} />
          <Lids
            eyes={[
              [118.15, -123],
              [125.85, -123],
            ]}
            r={2.3}
            fill={SKIN}
          />
          <path d="M106 -126 Q105 -144 122 -144 Q139 -144 138 -126 Z" fill="#4dabf7" />
          <rect x="105" y="-129" width="34" height="6" rx="3" fill="#fff" />
          <circle className="wi-bobble" cx="122" cy="-148" r="5.5" fill="#fff" />
        </g>

        {/* The sleigh */}
        <path d="M184 -6 H-36 Q-68 -6 -68 -30 Q-68 -50 -50 -50" stroke="#c9a227" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-16 -6 V-40 M56 -6 V-40 M128 -6 V-40" stroke="#8d5a2b" strokeWidth="5" />
        <path d="M-46 -40 Q-62 -68 -46 -92 Q-34 -104 -22 -96 Q-32 -76 -10 -70 H130 Q138 -128 172 -140 Q194 -142 192 -122 Q182 -110 186 -40 Z" fill="#e63946" />
        <path d="M-46 -40 H186 V-30 Q70 -24 -42 -30 Z" fill="#c1121f" />
        <path d="M-10 -70 H130" stroke="#fff" strokeWidth="4" opacity="0.35" />
        <path d="M-24 -54 Q16 -64 56 -54 Q96 -44 136 -54 Q160 -60 176 -74" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M172 -126 q-14 -2 -12 10 q2 10 12 4" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M-34 -88 q-8 6 0 12" stroke="#ffd166" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M134 -100 Q150 -136 176 -138" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.35" fill="none" />
      </g>
    </>
  );
}
