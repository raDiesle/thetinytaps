import type { CSSProperties } from "react";
import { Face, SKIN, nth } from "../shared";
import { Lid } from "./animals";

// The farmer and the scarecrow. Foot point at (0, 0).

/** Farmer in blue dungarees with a straw hat and a pitchfork; he waves. */
export function Bauer() {
  return (
    <g className="bh-bauer-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="bh-bauer-fork" style={{ transformOrigin: "44px -94px" }}>
        <path d="M44 -6 V-176" stroke="#8d5a2b" strokeWidth="6" strokeLinecap="round" />
        <path d="M32 -176 V-206 M44 -176 V-210 M56 -176 V-206 M30 -178 H58" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
      </g>
      <rect x="-24" y="-70" width="20" height="62" rx="6" fill="#3a86ff" />
      <rect x="4" y="-70" width="20" height="62" rx="6" fill="#3a86ff" />
      <path d="M-30 0 V-12 Q-30 -16 -24 -16 H-2 V0 Z M2 0 V-16 H24 Q30 -16 30 -12 V0 Z" fill="#2b9348" />
      <rect x="-28" y="-130" width="56" height="70" rx="14" fill="#e63946" />
      <path d="M-28 -110 H28 M-28 -90 H28 M-12 -130 V-60 M12 -130 V-60" stroke="#c1121f" strokeWidth="3" opacity="0.6" />
      <path d="M-24 -110 H24 V-64 Q24 -56 16 -56 H-16 Q-24 -56 -24 -64 Z" fill="#3a86ff" />
      <path d="M-20 -110 L-20 -130 M20 -110 L20 -130" stroke="#3a86ff" strokeWidth="6" />
      <circle cx="-16" cy="-106" r="3" fill="#ffd166" />
      <circle cx="16" cy="-106" r="3" fill="#ffd166" />
      <rect x="-10" y="-96" width="20" height="14" rx="3" fill="#2f6fd6" />
      <path d="M26 -122 Q40 -110 42 -96" stroke="#e63946" strokeWidth="13" strokeLinecap="round" fill="none" />
      <circle cx="44" cy="-94" r="8" fill={SKIN} />
      <g className="bh-bauer-arm" style={{ transformOrigin: "-24px -122px" }}>
        <path d="M-24 -122 Q-44 -136 -48 -160" stroke="#e63946" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="-48" cy="-166" r="9" fill={SKIN} />
      </g>
      <circle cx="0" cy="-152" r="24" fill={SKIN} />
      <circle cx="-23" cy="-150" r="5" fill={SKIN} />
      <circle cx="23" cy="-150" r="5" fill={SKIN} />
      <Face cx={0} cy={-154} size={1.05} />
      <Lid cx={-7.35} cy={-154} r={4.4} fill={SKIN} />
      <Lid cx={7.35} cy={-154} r={4.4} fill={SKIN} />
      <path d="M-10 -138 Q0 -132 10 -138" stroke="#8d5a2b" strokeWidth="4" fill="none" strokeLinecap="round" />
      <g className="bh-bauer-hat" style={{ transformOrigin: "0px -172px" }}>
        <ellipse cx="0" cy="-170" rx="40" ry="9" fill="#e9c46a" />
        <path d="M-22 -172 Q-22 -196 0 -196 Q22 -196 22 -172 Z" fill="#e9c46a" />
        <rect x="-22" y="-180" width="44" height="7" fill="#e63946" />
        <path d="M-34 -168 H34" stroke="#d4a017" strokeWidth="2" />
      </g>
    </g>
  );
}

/** Scarecrow in the field; it wobbles and its hat hops. */
export function Vogelscheuche() {
  return (
    <g className="bh-scheuche-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M0 0 V-200" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      <g className="bh-scheuche-arms" style={{ transformOrigin: "0px -148px" }}>
        <path d="M-84 -148 H84" stroke="#8d5a2b" strokeWidth="8" strokeLinecap="round" />
        <path d="M-84 -148 l-14 -8 M-84 -148 l-16 2 M-84 -148 l-12 10 M84 -148 l14 -8 M84 -148 l16 2 M84 -148 l12 10" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
        <path d="M-74 -160 H74 L64 -134 H-64 Z" fill="#4895ef" />
      </g>
      <path d="M-34 -164 H34 L40 -80 Q0 -70 -40 -80 Z" fill="#4895ef" />
      <rect x="10" y="-130" width="18" height="18" rx="2" fill="#ffd166" />
      <rect x="-30" y="-108" width="16" height="16" rx="2" fill="#e63946" />
      <path d="M10 -130 l18 18 M-30 -108 l16 16" stroke="#fff" strokeWidth="2" opacity="0.6" />
      <path d="M-40 -80 l-6 14 M-30 -76 l-2 14 M30 -76 l2 14 M40 -80 l6 14" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="0" cy="-188" r="26" fill="#e6ccb2" />
      <circle cx="-9" cy="-192" r="3.5" fill="#2b2d42" />
      <circle cx="9" cy="-192" r="3.5" fill="#2b2d42" />
      <path d="M-12 -178 Q0 -168 12 -178" stroke="#2b2d42" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M-8 -175 v-6 M0 -172 v-6 M8 -175 v-6" stroke="#2b2d42" strokeWidth="1.5" />
      <circle cx="-14" cy="-182" r="4" fill="#ff8fa3" opacity="0.5" />
      <circle cx="14" cy="-182" r="4" fill="#ff8fa3" opacity="0.5" />
      <g className="bh-scheuche-hat" style={{ transformOrigin: "0px -208px" }}>
        <path d="M-26 -210 l-6 8 M24 -210 l8 6" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="0" cy="-208" rx="44" ry="9" fill="#bc6c25" />
        <path d="M-24 -210 Q-22 -240 0 -240 Q22 -240 24 -210 Z" fill="#bc6c25" />
        <rect x="-24" y="-218" width="48" height="7" fill="#6a994e" />
        <circle cx="18" cy="-216" r="7" fill="#ff7bd0" />
      </g>
      <g className="bh-scheuche-straw" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round">
        {[-30, 4, 34].map((x, i) => (
          <path key={x} d={`M${x} -84 l4 10`} style={nth(i)} />
        ))}
      </g>
      {[-1, 1].map((dir, i) => (
        <g key={dir} className="bh-scheuche-bird" style={{ ...nth(i), "--dir": dir } as CSSProperties}>
          <path d={`M${dir * 70 - 12} -164 q6 -10 12 -2 q6 -8 12 2 q-12 -2 -24 0 Z`} fill="#2b2d42" />
        </g>
      ))}
    </g>
  );
}
