import { Face, INK, Inside, Rider, SKIN, nth } from "../shared";
import { Notes } from "./parts";

// Up in the air above the beach: the little plane with its banner and the kite. Drawn around (0, 0).

const CANOPY = "M-40 -16 Q-30 -40 -4 -38 L6 -16 Z";

/** The little plane pulls a banner: it swoops, the propeller whirls, the banner waves and the pilot waves. */
export function Flugzeug() {
  return (
    <g className="sd-flug-fly">
      {/* Rope and banner behind the plane */}
      <path d="M62 -10 L104 -4" stroke="#868e96" strokeWidth="3" />
      <g className="sd-flug-banner" style={{ transformOrigin: "104px -4px" }}>
        <path d="M104 -26 Q170 -34 236 -26 Q300 -18 340 -26 V20 Q300 28 236 20 Q170 12 104 20 Z" fill="#fff" />
        <path d="M104 -26 V20" stroke="#e63946" strokeWidth="6" />
        <text x="222" y="6" textAnchor="middle" fontSize="30" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#e63946">
          HALLO!
        </text>
      </g>
      <g className="sd-flug-tilt" style={{ transformOrigin: "0px 0px" }}>
        <path d="M30 -12 L58 -42 H70 L66 -6 Z" fill="#e63946" />
        <path d="M-70 0 Q-72 -18 -48 -20 L40 -16 Q66 -14 66 -4 Q40 6 -50 8 Q-70 8 -70 0 Z" fill="#ffd43b" />
        <path d="M-58 -4 H52" stroke="#fab005" strokeWidth="4" />
        <path d={CANOPY} fill="#bde0fe" />
        <Inside d={CANOPY}>
          <Rider cx={-20} cy={-28} shirt="#1d3557" cap="#e63946" />
        </Inside>
        <g className="sd-flug-hand" style={{ transformOrigin: "-8px -28px" }}>
          <path d="M-8 -28 L2 -52" stroke="#1d3557" strokeWidth="7" strokeLinecap="round" />
          <circle cx="3" cy="-55" r="5" fill={SKIN} />
        </g>
        <ellipse cx="-8" cy="2" rx="48" ry="9" fill="#fab005" />
        <path d="M-40 8 L-36 20 M10 8 L14 20" stroke={INK} strokeWidth="3" />
        <circle cx="-36" cy="22" r="5" fill={INK} />
        <circle cx="14" cy="22" r="5" fill={INK} />
        <circle cx="-72" cy="-6" r="6" fill="#868e96" />
        <g className="sd-flug-prop" style={{ transformOrigin: "-74px -6px" }}>
          <rect x="-78" y="-34" width="8" height="56" rx="4" fill="#495057" />
        </g>
      </g>
      <Notes x={-90} y={-50} texts={["Brumm!"]} colour="#fff" size={24} />
    </g>
  );
}

/** The kite: it swoops on the wind, its tail with the bows wiggles, and it smiles. */
export function Drachen() {
  return (
    <g className="sd-drachen-swoop" style={{ transformOrigin: "0px 0px" }}>
      <path d="M0 14 Q-60 120 -40 230" stroke="#495057" strokeWidth="2" fill="none" opacity="0.5" />
      <g className="sd-drachen-tail" style={{ transformOrigin: "0px 60px" }}>
        <path d="M0 60 Q20 90 0 120 Q-20 150 0 180" stroke="#495057" strokeWidth="3" fill="none" />
        {[
          [10, 90, "#e63946"],
          [-8, 130, "#4dabf7"],
          [6, 170, "#ffd43b"],
        ].map(([x, y, colour], i) => (
          <path key={i} d={`M${x} ${y} l-12 -8 v16 Z M${x} ${y} l12 -8 v16 Z`} fill={colour as string} style={nth(i)} />
        ))}
      </g>
      <path d="M0 -66 L-46 -6 L0 -6 Z" fill="#e63946" />
      <path d="M0 -66 L46 -6 L0 -6 Z" fill="#ffd43b" />
      <path d="M-46 -6 L0 60 L0 -6 Z" fill="#4dabf7" />
      <path d="M46 -6 L0 60 L0 -6 Z" fill="#40c057" />
      <path d="M0 -66 V60 M-46 -6 H46" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" />
      <Face cx={0} cy={-10} size={1} />
    </g>
  );
}
