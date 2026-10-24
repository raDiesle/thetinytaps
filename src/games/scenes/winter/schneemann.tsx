import { CHEEK, Eye, INK, nth } from "../shared";
import type { Placement, SceneItem } from "../types";
import "./schneemann.css";

// The snowman and the Christmas tree from the former winter and Advent extras. They stand on their foot point (0, 0).

// ---------- Tannenbaum ----------

/** The tiers of the tree, and their right halves, which are in the shade. */
const TIERS = [
  "M-100 -62 L-22 -176 L22 -176 L100 -62 Q50 -48 0 -56 Q-50 -48 -100 -62 Z",
  "M-80 -140 L-16 -238 L16 -238 L80 -140 Q40 -128 0 -134 Q-40 -128 -80 -140 Z",
  "M-56 -214 L0 -300 L56 -214 Q28 -204 0 -210 Q-28 -204 -56 -214 Z",
];
const SHADES = [
  "M0 -176 L22 -176 L100 -62 Q50 -48 0 -56 Z",
  "M0 -238 L16 -238 L80 -140 Q40 -128 0 -134 Z",
  "M0 -300 L56 -214 Q28 -204 0 -210 Z",
];

const BALLS: [number, number, string][] = [
  [-56, -78, "#e63946"],
  [40, -84, "#4dabf7"],
  [-6, -112, "#ffd60a"],
  [-38, -160, "#4dabf7"],
  [34, -168, "#e63946"],
  [4, -236, "#e63946"],
];

const LIGHTS: [number, number, string][] = [
  [-72, -70, "#ffd60a"],
  [-24, -66, "#ff8fa3"],
  [22, -66, "#69db7c"],
  [70, -72, "#ffd60a"],
  [-50, -146, "#ff8fa3"],
  [-6, -142, "#ffd60a"],
  [50, -148, "#69db7c"],
  [-30, -222, "#ffd60a"],
  [28, -224, "#ff8fa3"],
  [0, -270, "#69db7c"],
];

const STAR = Array.from({ length: 10 }, (_, i) => {
  const r = i % 2 ? 11 : 26;
  const a = (i * Math.PI) / 5 - Math.PI / 2;
  return `${(r * Math.cos(a)).toFixed(1)} ${(-314 + r * Math.sin(a)).toFixed(1)}`;
}).join(" L");

export function Tannenbaum() {
  return (
    <>
      <g className="wi-baum-tree" style={{ transformOrigin: "0px -40px" }}>
        <rect x="-12" y="-66" width="24" height="30" fill="#7f5539" />
        {TIERS.map((d, i) => (
          <g key={i}>
            <path d={d} fill={["#2d6a4f", "#40916c", "#52b788"][i]} />
            <path d={SHADES[i]} fill="#1b4332" opacity="0.25" />
          </g>
        ))}
        <path d="M-86 -82 Q0 -100 84 -96 M-66 -158 Q0 -176 64 -170 M-42 -232 Q0 -246 40 -240" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" fill="none" />
        {BALLS.map(([cx, cy, fill], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill={fill} />
            <circle cx={cx - 3} cy={cy - 3} r="3" fill="#fff" opacity="0.6" />
          </g>
        ))}
        {LIGHTS.map(([cx, cy, fill], i) => (
          <g key={i} className="wi-baum-light" style={nth(i)}>
            <circle cx={cx} cy={cy} r="11" fill={fill} opacity="0.35" />
            <circle cx={cx} cy={cy} r="5" fill={fill} />
            <circle cx={cx - 1.5} cy={cy - 1.5} r="1.6" fill="#fff" />
          </g>
        ))}
      </g>
      <g className="wi-baum-shine" style={{ transformOrigin: "0px -314px" }}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1="-350" x2="0" y2="-362" stroke="#ffd60a" strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 45} 0 -314)`} />
        ))}
      </g>
      <g className="wi-baum-star" style={{ transformOrigin: "0px -314px" }}>
        <path d={`M${STAR} Z`} fill="#ffd60a" stroke="#f4a100" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="-6" cy="-322" r="4" fill="#fff" opacity="0.6" />
      </g>
      {/* Pot and presents. */}
      <path d="M-34 -40 H34 L28 0 H-28 Z" fill="#c1121f" />
      <rect x="-38" y="-46" width="76" height="10" rx="4" fill="#e63946" />
      <rect x="-104" y="-44" width="52" height="44" rx="4" fill="#4dabf7" />
      <rect x="-82" y="-44" width="8" height="44" fill="#ffd60a" />
      <g className="wi-baum-lid" style={{ transformOrigin: "-106px -44px" }}>
        <rect x="-108" y="-54" width="60" height="12" rx="4" fill="#339af0" />
        <rect x="-82" y="-54" width="8" height="12" fill="#ffd60a" />
        <path d="M-78 -54 C-92 -70 -100 -56 -78 -54 C-64 -70 -56 -56 -78 -54 Z" fill="#ffd60a" />
      </g>
      <g className="wi-baum-surprise" style={{ transformOrigin: "-78px -50px" }}>
        <path d={`M${STAR} Z`} fill="#ffd60a" transform="translate(-78 -50) scale(0.5) translate(0 314)" />
      </g>
      <rect x="54" y="-34" width="44" height="34" rx="4" fill="#e63946" />
      <rect x="72" y="-34" width="8" height="34" fill="#fff" />
      <rect x="50" y="-40" width="52" height="9" rx="3" fill="#d62828" />
      <path d="M76 -40 C64 -54 56 -42 76 -40 C88 -54 96 -42 76 -40 Z" fill="#fff" />
    </>
  );
}

// ---------- Schneemann ----------

const FLAKES = [
  [-80, -230],
  [70, -250],
  [-96, -150],
  [92, -120],
  [-60, -60],
  [80, -40],
];

export function Schneemann() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="70" ry="14" fill="#fff" />
      <g className="wi-schneemann-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-36 -134 L-84 -168 M-66 -156 L-76 -178 M-66 -156 L-90 -156" stroke="#7f5539" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path className="wi-schneemann-arm" d="M34 -134 L84 -172 M68 -160 L74 -182 M68 -160 L92 -162" stroke="#7f5539" strokeWidth="5" strokeLinecap="round" fill="none" style={{ transformOrigin: "34px -134px" }} />
        <circle cx="0" cy="-52" r="52" fill="#fff" />
        <path d="M-50 -38 A52 52 0 0 0 50 -38 A60 50 0 0 1 -50 -38 Z" fill="#dbe9fb" />
        <circle cx="0" cy="-130" r="38" fill="#fff" />
        <path d="M-36 -120 A38 38 0 0 0 36 -120 A44 36 0 0 1 -36 -120 Z" fill="#dbe9fb" />
        {[-140, -122, -104].map((cy) => (
          <circle key={cy} cx="0" cy={cy} r="4.5" fill={INK} />
        ))}
        <circle cx="0" cy="-192" r="30" fill="#fff" />
        <path d="M-26 -184 A30 30 0 0 0 26 -184 A34 28 0 0 1 -26 -184 Z" fill="#dbe9fb" />
        <Eye cx={-10} cy={-198} r={4} />
        <Eye cx={10} cy={-198} r={4} />
        <circle cx="-18" cy="-184" r="5" fill={CHEEK} opacity="0.5" />
        <circle cx="18" cy="-184" r="5" fill={CHEEK} opacity="0.5" />
        <path className="wi-schneemann-nose" d="M0 -194 L30 -188 L0 -184 Z" fill="#f77f00" style={{ transformOrigin: "0px -189px" }} />
        {[-10, -4, 3, 9].map((x, i) => (
          <circle key={x} cx={x} cy={-177 + (i === 0 || i === 3 ? -2 : 0)} r="2.2" fill={INK} />
        ))}
        <g className="wi-schneemann-scarf" style={{ transformOrigin: "14px -162px" }}>
          <path d="M14 -164 L26 -128 L12 -126 L4 -160 Z" fill="#e63946" />
          <path d="M18 -146 L20 -140 M14 -138 L16 -132" stroke="#fff" strokeWidth="2.5" />
        </g>
        <rect x="-32" y="-168" width="64" height="14" rx="7" fill="#e63946" />
        <path d="M-20 -168 V-154 M-4 -168 V-154 M12 -168 V-154" stroke="#fff" strokeWidth="2.5" />
        <g className="wi-schneemann-hat" style={{ transformOrigin: "0px -216px" }}>
          <rect x="-34" y="-224" width="68" height="10" rx="5" fill={INK} />
          <rect x="-22" y="-262" width="44" height="40" rx="4" fill={INK} />
          <rect x="-22" y="-234" width="44" height="8" fill="#4dabf7" />
          <rect x="-16" y="-258" width="6" height="22" rx="3" fill="#fff" opacity="0.2" />
        </g>
      </g>
      <g className="wi-schneemann-flakes" fill="#fff" stroke="#a5d8ff" strokeWidth="1.5">
        {FLAKES.map(([x, y], i) => (
          <circle key={i} className="wi-schneemann-flake" cx={x} cy={y} r="7" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

export function tannenbaum(place: Placement): SceneItem {
  return {
    id: "tannenbaum",
    name: "der Tannenbaum",
    sentences: ["Der Tannenbaum leuchtet!", "Oben auf dem Baum ist ein Stern.", "Unter dem Baum liegen Geschenke."],
    sound: "twinkle",
    traits: ["green"],
    box: [-108, -342, 216, 342],
    place,
    shadow: [0, 0, 100],
    durationMs: 2400,
    Art: Tannenbaum,
  };
}

export function schneemann(place: Placement): SceneItem {
  return {
    id: "schneemann",
    name: "der Schneemann",
    sentences: ["Der Schneemann winkt!", "Der Schneemann hat eine Möhrennase.", "Brrr, ist das kalt!"],
    sound: "whoosh",
    box: [-92, -264, 184, 264],
    hitAreas: [[-70, -264, 140, 264]],
    place,
    durationMs: 2400,
    Art: Schneemann,
  };
}
