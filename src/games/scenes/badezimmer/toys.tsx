import { CHEEK, Eye, INK, nth } from "../shared";
import { Lid, Lines } from "./parts";

// Bath toys on the floor. Each drawing has its foot point at (0, 0).

/** A green frog; it hops, puffs its cheeks and squirts water. */
export function Frosch() {
  return (
    <>
      <g className="bz-frosch" style={{ transformOrigin: "0px 0px" }}>
        <g className="bz-frosch-legs" style={{ transformOrigin: "0px -4px" }}>
          <ellipse cx="-40" cy="-12" rx="22" ry="12" fill="#40c057" />
          <ellipse cx="40" cy="-12" rx="22" ry="12" fill="#40c057" />
        </g>
        <ellipse cx="0" cy="-34" rx="42" ry="30" fill="#51cf66" />
        <ellipse cx="0" cy="-24" rx="27" ry="18" fill="#d3f9d8" />
        <ellipse cx="-16" cy="-4" rx="11" ry="6" fill="#40c057" />
        <ellipse cx="16" cy="-4" rx="11" ry="6" fill="#40c057" />
        {[-18, 18].map((x) => (
          <g key={x}>
            <circle cx={x} cy="-62" r="15" fill="#51cf66" />
            <circle cx={x} cy="-63" r="9.5" fill="#fff" />
            <Eye cx={x} cy={-63} r={5} />
            <Lid cx={x} cy={-63} r={7} fill="#51cf66" />
          </g>
        ))}
        <g className="bz-frosch-cheek" style={{ transformOrigin: "0px -40px" }}>
          <circle cx="-26" cy="-40" r="6" fill={CHEEK} opacity="0.6" />
          <circle cx="26" cy="-40" r="6" fill={CHEEK} opacity="0.6" />
        </g>
        <path d="M-18 -42 Q0 -30 18 -42" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
      <g className="bz-frosch-squirt" fill="#74c0fc">
        {[
          [30, -66],
          [52, -82],
          [76, -84],
          [96, -72],
          [110, -52],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={6 - i * 0.6} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A green rubber crocodile facing left; it snaps its jaw and wags its tail. */
export function Kroko() {
  return (
    <>
      <g className="bz-kroko-tail" style={{ transformOrigin: "60px -24px" }}>
        <path d="M56 -40 Q112 -44 132 -12 Q100 -16 56 -10 Z" fill="#40c057" />
      </g>
      <ellipse cx="-24" cy="-4" rx="12" ry="7" fill="#2f9e44" />
      <ellipse cx="42" cy="-4" rx="12" ry="7" fill="#2f9e44" />
      <ellipse cx="10" cy="-26" rx="64" ry="24" fill="#51cf66" />
      <path d="M-36 -14 Q10 -6 60 -16" stroke="#d8f5a2" strokeWidth="8" strokeLinecap="round" fill="none" />
      {[-26, -6, 14, 34, 52].map((x) => (
        <circle key={x} cx={x} cy="-48" r="6" fill="#40c057" />
      ))}
      <path d="M-50 -22 L-112 -18 Q-118 -8 -106 -6 L-48 -10 Z" fill="#40c057" />
      <path d="M-100 -16 l4 -6 l4 6 M-86 -16 l4 -6 l4 6 M-72 -17 l4 -6 l4 6" fill="#fff" />
      <g className="bz-kroko-jaw" style={{ transformOrigin: "-46px -24px" }}>
        <path d="M-46 -42 Q-82 -46 -114 -30 Q-118 -20 -106 -20 L-46 -20 Z" fill="#51cf66" />
        <path d="M-102 -21 l4 6 l4 -6 M-88 -21 l4 6 l4 -6 M-74 -21 l4 6 l4 -6" fill="#fff" />
        <circle cx="-106" cy="-34" r="2.5" fill={INK} />
        <circle cx="-40" cy="-46" r="13" fill="#51cf66" />
        <circle cx="-40" cy="-48" r="8" fill="#fff" />
        <Eye cx={-42} cy={-48} r={4.2} />
        <Lid cx={-42} cy={-48} r={6} fill="#51cf66" />
      </g>
      <circle cx="-30" cy="-26" r="5" fill={CHEEK} opacity="0.5" />
      <Lines x={-124} y={-30} dir={-1} colour="#2f9e44" />
    </>
  );
}

/** A little red sailing boat in a puddle; it rocks, its sail puffs up and its flag flutters. */
export function Schiffchen() {
  return (
    <>
      <g className="bz-boot" style={{ transformOrigin: "0px -6px" }}>
        <path d="M0 -30 V-130" stroke="#8d5524" strokeWidth="5" strokeLinecap="round" />
        <g className="bz-boot-flag" style={{ transformOrigin: "0px -128px" }}>
          <path d="M2 -130 L26 -123 L2 -116 Z" fill="#4dabf7" />
        </g>
        <g className="bz-boot-sail" style={{ transformOrigin: "4px -80px" }}>
          <path d="M6 -124 L6 -38 L56 -38 Q44 -80 6 -124 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
          <path d="M16 -60 H40" stroke="#ffd43b" strokeWidth="5" strokeLinecap="round" />
        </g>
        <path d="M-4 -108 L-4 -40 L-40 -40 Q-30 -76 -4 -108 Z" fill="#ffd43b" />
        <path d="M-62 -32 H62 Q52 -4 36 -2 H-36 Q-52 -4 -62 -32 Z" fill="#e63946" />
        <path d="M-56 -22 H56" stroke="#fff" strokeWidth="5" />
        <circle cx="-24" cy="-14" r="4" fill="#fff" />
        <circle cx="0" cy="-14" r="4" fill="#fff" />
        <circle cx="24" cy="-14" r="4" fill="#fff" />
      </g>
      <path d="M-74 -2 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
      <Lines x={32} y={-140} colour="#e63946" />
    </>
  );
}

/** A blue toy whale facing right; it rocks, wags its tail and blows a fountain from its back. */
export function Wal() {
  return (
    <>
      <g className="bz-wal-fountain" fill="#74c0fc">
        <path d="M2 -72 Q-2 -112 6 -134 Q14 -112 10 -72 Z" style={{ transformOrigin: "6px -72px" }} />
        {[
          [-26, -128],
          [-14, -146],
          [6, -152],
          [26, -146],
          [38, -128],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} style={nth(i)} />
        ))}
      </g>
      <g className="bz-wal" style={{ transformOrigin: "0px -4px" }}>
        <g className="bz-wal-tail" style={{ transformOrigin: "-58px -30px" }}>
          <path d="M-56 -30 Q-82 -40 -92 -68 Q-74 -62 -70 -50 Q-78 -70 -64 -84 Q-60 -56 -46 -40 Z" fill="#339af0" />
        </g>
        <path d="M-62 -26 Q-62 -76 6 -76 Q70 -76 72 -26 Q72 -2 40 -2 H-36 Q-62 -2 -62 -26 Z" fill="#4dabf7" />
        <path d="M-50 -18 Q6 -4 66 -18 Q62 -2 40 -2 H-36 Q-50 -4 -50 -18 Z" fill="#d0ebff" />
        <path d="M2 -76 q4 -6 8 0" stroke="#1c7ed6" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="2" cy="-24" rx="16" ry="7" fill="#339af0" transform="rotate(-20 2 -24)" />
        <Eye cx={40} cy={-42} r={5} />
        <Lid cx={40} cy={-42} r={6} fill="#4dabf7" />
        <circle cx="52" cy="-30" r="5" fill={CHEEK} opacity="0.6" />
        <path d="M46 -22 Q56 -18 66 -26" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
      <path d="M-84 -2 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
    </>
  );
}
