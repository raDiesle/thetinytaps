import { Face, INK, nth } from "../shared";
import { DARK_RED, FIRE_RED, NAVY, STRIPE } from "./parts";

// The tree, the garden and the things lying around. Foot points at (0, 0).

const CROWN: [number, number, number, string][] = [
  [-80, -210, 80, "#40916c"],
  [80, -220, 84, "#40916c"],
  [0, -300, 96, "#52b788"],
  [-90, -300, 64, "#52b788"],
  [96, -300, 66, "#52b788"],
  [0, -200, 80, "#52b788"],
  [-40, -350, 50, "#74c69d"],
  [50, -340, 46, "#74c69d"],
];

/** The big tree in the garden; the cat sits on its left branch, the squirrel at its trunk. */
export function Baum() {
  return (
    <>
      <path d="M-22 0 Q-12 -80 -14 -170 H14 Q12 -80 22 0 Z" fill="#8d5a2b" />
      <path d="M-6 -60 Q-4 -100 -8 -140" stroke="#6b4423" strokeWidth="4" fill="none" />
      <g className="fw-baum-crown" style={{ transformOrigin: "0px -160px" }}>
        {CROWN.map(([cx, cy, r, fill]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx="-50" cy="-330" r="20" fill="#95d5b2" opacity="0.7" />
        {[
          [-110, -250],
          [60, -270],
          [120, -200],
          [-20, -360],
          [10, -230],
        ].map(([cx, cy]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r="11" fill={FIRE_RED} />
            <circle cx={cx - 3} cy={cy - 4} r="3" fill="#fff" opacity="0.6" />
          </g>
        ))}
      </g>
      {/* The branch the cat sits on */}
      <path d="M-6 -150 Q-60 -170 -150 -182" stroke="#8d5a2b" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M-120 -180 l-12 -18" stroke="#8d5a2b" strokeWidth="6" strokeLinecap="round" />
      <g className="fw-baum-leaves" fill="#74c69d">
        {[-90, -30, 40, 100].map((x, i) => (
          <ellipse key={x} cx={x} cy="-150" rx="11" ry="6" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Grandpa's barbecue: the lid lifts, the sausages hop and a little smoke puffs up. */
export function Grill() {
  return (
    <>
      <g className="fw-grill-smoke" fill="#ced4da">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={-10 + i * 14} cy={-110} r={14 + i * 3} style={nth(i)} />
        ))}
      </g>
      <path d="M-36 -40 L-50 0 M36 -40 L50 0 M0 -40 V0" stroke="#495057" strokeWidth="6" strokeLinecap="round" />
      <circle cx="-50" cy="-2" r="6" fill="#343a40" />
      <circle cx="50" cy="-2" r="6" fill="#343a40" />
      <path d="M-58 -72 H58 Q56 -30 0 -30 Q-56 -30 -58 -72 Z" fill="#2b2d42" />
      <path d="M-40 -62 Q-30 -40 -10 -36" stroke="#fff" strokeOpacity="0.25" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse className="fw-grill-glow" cx="0" cy="-72" rx="54" ry="9" fill="#ff8800" />
      <path d="M-58 -72 H58" stroke="#adb5bd" strokeWidth="4" />
      {[-34, -6, 22].map((x, i) => (
        <g key={x} className="fw-grill-sausage" style={nth(i)}>
          <rect x={x} y="-84" width="26" height="11" rx="5.5" fill="#bc4b51" />
          <path d={`M${x + 6} -80 h14`} stroke="#8c2f39" strokeWidth="2" />
        </g>
      ))}
      <g className="fw-grill-lid" style={{ transformOrigin: "58px -72px" }}>
        <path d="M-58 -74 Q-56 -118 0 -118 Q56 -118 58 -74 Z" fill="#343a40" />
        <rect x="-10" y="-128" width="20" height="10" rx="4" fill="#adb5bd" />
        <path d="M-36 -100 Q-20 -112 0 -112" stroke="#fff" strokeOpacity="0.3" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

/** A flower box in front of the station with red and yellow flowers. */
export function Blumen() {
  const flowers: [number, string][] = [
    [-50, FIRE_RED],
    [-24, STRIPE],
    [2, "#ff8fab"],
    [28, FIRE_RED],
    [52, STRIPE],
  ];
  return (
    <>
      {flowers.map(([x, colour], i) => (
        <g key={x}>
          <path d={`M${x} -40 Q${x + (i % 2 ? 4 : -4)} -70 ${x} -90`} stroke="#40916c" strokeWidth="5" fill="none" />
          <ellipse cx={x + 8} cy="-60" rx="8" ry="4" fill="#52b788" transform={`rotate(-30 ${x + 8} -60)`} />
          <g className="fw-blumen-head" style={{ ...nth(i), transformOrigin: `${x}px -90px` }}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={x + 9 * Math.cos((a * Math.PI) / 180)} cy={-98 + 9 * Math.sin((a * Math.PI) / 180)} r="7" fill={colour} />
            ))}
            <circle cx={x} cy="-98" r="5" fill="#fff3b0" />
          </g>
        </g>
      ))}
      <path d="M-74 -44 H74 L66 0 H-66 Z" fill="#bc6c25" />
      <path d="M-70 -30 H70 M-68 -16 H68" stroke="#a0522d" strokeWidth="3" />
      <rect x="-78" y="-50" width="156" height="10" rx="4" fill="#a0522d" />
    </>
  );
}

/** The hydrant feeding the hose: the valve turns and water bubbles up. */
export function Hydrant() {
  return (
    <>
      <g className="fw-hydrant-water" fill="#74c0fc">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="0" cy="-110" r="7" style={nth(i)} />
        ))}
      </g>
      <rect x="-24" y="-14" width="48" height="14" rx="4" fill={DARK_RED} />
      <g className="fw-hydrant-body" style={{ transformOrigin: "0px -14px" }}>
        <rect x="-17" y="-84" width="34" height="72" rx="8" fill={FIRE_RED} />
        <path d="M-19 -82 Q0 -106 19 -82 Z" fill={DARK_RED} />
        <g className="fw-hydrant-valve" style={{ transformOrigin: "0px -104px" }}>
          <rect x="-4" y="-110" width="8" height="12" rx="2" fill={DARK_RED} />
          <rect x="-12" y="-106" width="24" height="5" rx="2" fill={DARK_RED} />
        </g>
        <rect x="-30" y="-62" width="13" height="13" rx="3" fill={DARK_RED} />
        <rect x="17" y="-62" width="16" height="13" rx="3" fill="#adb5bd" />
        <path d="M-8 -72 V-24" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      </g>
    </>
  );
}

/** The fire extinguisher: it hops and puffs a white cloud of foam. */
export function Feuerloescher() {
  return (
    <>
      <g className="fw-loescher-foam" fill="#fff">
        {[
          [64, -98, 12],
          [84, -110, 15],
          [104, -96, 13],
          [88, -84, 11],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} style={nth(i)} />
        ))}
      </g>
      <g className="fw-loescher-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-26" y="-118" width="52" height="118" rx="20" fill={FIRE_RED} />
        <rect x="-26" y="-74" width="52" height="30" fill="#fff" />
        <path d="M-14 -66 h28 M-14 -56 h20" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M-16 -110 Q-20 -60 -14 -10" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
        <rect x="-8" y="-134" width="16" height="18" rx="3" fill="#495057" />
        <circle cx="-16" cy="-128" r="10" fill="#fff" stroke={INK} strokeWidth="3" />
        <path className="fw-loescher-needle" d="M-16 -128 l6 -5" stroke={FIRE_RED} strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "-16px -128px" }} />
        <path className="fw-loescher-lever" d="M4 -136 L34 -146" stroke="#343a40" strokeWidth="7" strokeLinecap="round" style={{ transformOrigin: "4px -136px" }} />
        <path d="M8 -128 Q50 -128 54 -102" stroke="#2b2d42" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="48" y="-106" width="14" height="12" rx="3" fill="#2b2d42" transform="rotate(-30 55 -100)" />
      </g>
    </>
  );
}

/** An orange traffic cone: it hops and spins. */
export function Huetchen() {
  return (
    <g className="fw-huetchen-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-46" y="-12" width="92" height="12" rx="4" fill="#e85d04" />
      <path d="M-34 -12 L-8 -118 Q0 -126 8 -118 L34 -12 Z" fill="#f77f00" />
      <path d="M-26 -44 L-19 -72 H19 L26 -44 Z" fill="#fff" />
      <path d="M-13 -96 L-10 -108 H10 L13 -96 Z" fill="#fff" />
      <path d="M-16 -20 L-4 -110" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
      <g className="fw-huetchen-face">
        <Face cx={0} cy={-30} size={0.55} />
      </g>
    </g>
  );
}

/** Boots with the trousers already around them, ready to jump into; they stamp. */
export function Stiefel() {
  return (
    <>
      {[-38, 44].map((x, i) => (
        <g key={x} className="fw-stiefel-boot" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <path d={`M${x - 24} -122 H${x + 24} V-22 H${x + 40} Q${x + 46} -22 ${x + 46} -12 V0 H${x - 24} Z`} fill="#2b2d42" />
          <rect x={x - 24} y="-40" width="48" height="8" fill={STRIPE} />
          <ellipse cx={x} cy="-122" rx="24" ry="6" fill="#141414" />
          <path d={`M${x - 16} -110 V-50`} stroke="#fff" strokeOpacity="0.25" strokeWidth="5" strokeLinecap="round" />
          {/* The trousers lie bunched up around the boot */}
          <path d={`M${x - 32} -104 Q${x} -90 ${x + 32} -104 L${x + 30} -76 Q${x} -64 ${x - 30} -76 Z`} fill={NAVY} />
          <path d={`M${x - 30} -90 Q${x} -78 ${x + 30} -90`} stroke={STRIPE} strokeWidth="5" fill="none" />
        </g>
      ))}
      <path className="fw-stiefel-braces" d="M-30 -100 Q4 -150 36 -100" stroke={FIRE_RED} strokeWidth="5" fill="none" />
    </>
  );
}
