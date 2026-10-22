import { GLASS, INK, Inside, nth } from "../shared";
import { Head, Notes } from "./parts";

// Things in the sky above the playground: the kite, the balloon and the little plane.
// Each drawing is centred on (0, 0) and placed with `float`.

/** The kite: it swoops left and right on the wind, its tail of bows wiggles. */
export function Drachen() {
  return (
    <g className="sp-drachen-swoop" style={{ transformOrigin: "0px 120px" }}>
      {/* The string runs down into the crown of the tree */}
      <path d="M0 54 Q-70 110 -170 120" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.8" />
      <g className="sp-drachen-tail" style={{ transformOrigin: "0px 54px" }}>
        <path d="M0 54 Q20 90 -6 120 Q-30 150 -4 186" stroke={INK} strokeWidth="2.5" fill="none" />
        {[
          [8, 86, "#ffd43b"],
          [-12, 128, "#4dabf7"],
          [0, 170, "#40c057"],
        ].map(([x, y, colour], i) => (
          <path key={i} d={`M${Number(x) - 12} ${Number(y) - 7} L${x} ${y} L${Number(x) - 12} ${Number(y) + 7} Z M${Number(x) + 12} ${Number(y) - 7} L${x} ${y} L${Number(x) + 12} ${Number(y) + 7} Z`} fill={String(colour)} />
        ))}
      </g>
      <path d="M0 -70 L48 -6 L0 54 L-48 -6 Z" fill="#e63946" />
      <path d="M0 -70 L48 -6 L0 -6 Z M0 -6 L-48 -6 L0 54 Z" fill="#ffd43b" />
      <path d="M0 -70 V54 M-48 -6 H48" stroke="#a61e2c" strokeWidth="3" />
      <circle cx="-14" cy="-20" r="5" fill="#fff" opacity="0.5" />
    </g>
  );
}

/** The red balloon: it floats up a little, wobbles and drifts back down. */
export function Luftballon() {
  return (
    <g className="sp-ballon-float" style={{ transformOrigin: "0px 80px" }}>
      <path d="M0 40 Q-10 70 6 96 Q20 120 2 150" stroke="#868e96" strokeWidth="2.5" fill="none" />
      <path d="M0 -50 Q38 -50 38 -6 Q38 30 0 40 Q-38 30 -38 -6 Q-38 -50 0 -50 Z" fill="#ff6b6b" />
      <path d="M-6 40 L6 40 L0 48 Z" fill="#e03131" />
      <ellipse cx="-14" cy="-22" rx="8" ry="14" fill="#fff" opacity="0.5" transform="rotate(20 -14 -22)" />
    </g>
  );
}

/** A little propeller plane with a pilot: it flies forward and back, the propeller whirls, it waggles its wings. */
export function Flugzeug() {
  const canopy = "M-16 -18 Q8 -60 46 -18 Z";
  return (
    <g className="sp-flugzeug-fly">
      <g className="sp-flugzeug-tilt" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-100 -8 L-118 -44 L-94 -44 L-74 -14 Z" fill="#1971c2" />
        <path d="M-104 -2 L-128 4 L-100 10 Z" fill="#1971c2" />
        <path d="M-100 -12 Q-60 -26 50 -22 Q78 -20 80 0 Q78 18 50 18 Q-60 20 -100 6 Z" fill="#f8f9fa" />
        <path d="M-96 2 Q-40 12 70 10" stroke="#4dabf7" strokeWidth="6" fill="none" />
        <path d={canopy} fill={GLASS} />
        <Inside d={canopy}>
          <Head cx={14} cy={-30} r={14} hair="#6b4423" cap="#e63946" />
        </Inside>
        <path d="M-20 -2 L-56 44 L-30 44 L12 0 Z" fill="#228be6" />
        <path d="M-20 -6 L-50 -40 L-30 -40 L6 -8 Z" fill="#74c0fc" />
        {[-60, -40, -20].map((x, i) => (
          <circle key={x} cx={x + 70} cy={-4} r="4" fill={GLASS} style={nth(i)} />
        ))}
        <ellipse cx="82" cy="0" rx="6" ry="8" fill="#ffd43b" />
        <g className="sp-flugzeug-prop" style={{ transformOrigin: "86px 0px" }}>
          <ellipse cx="86" cy="-18" rx="4" ry="16" fill="#495057" />
          <ellipse cx="86" cy="18" rx="4" ry="16" fill="#495057" />
        </g>
      </g>
      <Notes x={60} y={-50} texts={["Brumm!"]} colour="#fff" size={22} />
    </g>
  );
}
