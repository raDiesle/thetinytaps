import type { ReactNode } from "react";

// The animals' homes for "Wer wohnt wo?". Each one is drawn in a 120 × 120 box,
// standing on its bottom edge; flat colours with a darker right side, like the scenes.

export type HomeId =
  | "huette"
  | "nest"
  | "aquarium"
  | "bienenstock"
  | "stall"
  | "hoehle"
  | "teich"
  | "bau"
  | "mauseloch"
  | "koerbchen"
  | "baum"
  | "netz"
  | "eis"
  | "biberburg"
  | "ameisenhaufen"
  | "meer"
  | "wueste"
  | "dschungel"
  | "savanne"
  | "bambuswald";

export interface Home {
  id: HomeId;
  /** The German name; the other languages' names and phrases are in content.<lang>.ts (e.g. RUSSIAN_HOMES). */
  name: string;
  /** "in der Hütte", for "Der Hund wohnt in der Hütte." */
  inPhrase: string;
  /** Where the animal sits once it has moved in, in box units. */
  spot: [number, number];
  /** Size of the animal there, as a share of the home's width. */
  fit: number;
  drawing: ReactNode;
}

const DARK = "#3b2a20";

const huette = (
  <>
    <rect x="22" y="56" width="76" height="58" fill="#e9b872" />
    <rect x="84" y="56" width="14" height="58" fill="#d49a52" />
    {[70, 84, 98].map((y) => (
      <path key={y} d={`M22 ${y} H98`} stroke="#d49a52" strokeWidth="2" />
    ))}
    <path d="M44 114 V86 a16 16 0 0 1 32 0 V114 Z" fill={DARK} />
    <path d="M10 62 L60 22 L110 62 L102 68 L60 34 L18 68 Z" fill="#e63946" />
    <path d="M60 22 L110 62 L102 68 L60 34 Z" fill="#c1121f" />
    <rect x="50" y="60" width="20" height="9" rx="3" fill="#fff" />
    <rect x="4" y="113" width="112" height="5" rx="2.5" fill="#8ac926" />
  </>
);

const nest = (
  <>
    <path d="M2 96 Q40 88 70 98 T118 92" stroke="#8b5e3c" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M92 95 q8 -14 20 -16" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" fill="none" />
    <ellipse cx="108" cy="78" rx="8" ry="4" fill="#8ac926" transform="rotate(-30 108 78)" />
    <path d="M14 70 Q16 98 60 100 Q104 98 106 70 Z" fill="#a47148" />
    <path d="M70 99 Q104 98 106 70 H84 Q84 92 70 99 Z" fill="#8b5e3c" />
    <ellipse cx="60" cy="70" rx="46" ry="12" fill="#c08552" />
    <ellipse cx="60" cy="70" rx="36" ry="7" fill="#6f4e37" />
    {["M20 80 Q40 88 58 82", "M44 92 Q66 86 92 90", "M26 74 Q34 66 46 68", "M76 66 Q90 64 98 72"].map((d) => (
      <path key={d} d={d} stroke="#e0b084" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    ))}
  </>
);

const aquarium = (
  <>
    <rect x="14" y="30" width="92" height="76" rx="8" fill="#e3f6ff" />
    <path d="M14 46 H106 V98 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8 Z" fill="#4cc9f0" />
    <path d="M90 46 H106 V98 a8 8 0 0 1 -8 8 H90 Z" fill="#3aa8d0" />
    <path d="M14 94 Q40 86 60 94 T106 92 V98 a8 8 0 0 1 -8 8 H22 a8 8 0 0 1 -8 -8 Z" fill="#f4d58d" />
    <path d="M30 96 Q24 78 32 62 M30 96 Q38 82 34 70" stroke="#2a9d8f" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M88 96 Q94 80 86 66" stroke="#2a9d8f" strokeWidth="5" strokeLinecap="round" fill="none" />
    {[
      [80, 60, 3],
      [84, 52, 2],
      [44, 56, 2.5],
    ].map(([cx, cy, r]) => (
      <circle key={cx * cy} cx={cx} cy={cy} r={r} fill="#fff" fillOpacity="0.8" />
    ))}
    <rect x="10" y="26" width="100" height="8" rx="4" fill="#8d99ae" />
    <rect x="8" y="106" width="104" height="10" rx="3" fill="#6d597a" />
  </>
);

const bienenstock = (
  <>
    <path d="M58 6 V18" stroke="#8b5e3c" strokeWidth="4" />
    {[
      [28, 24],
      [42, 34],
      [58, 42],
      [74, 46],
      [90, 48],
    ].map(([y, rx], i) => (
      <ellipse key={y} cx="60" cy={y} rx={rx} ry="11" fill={i % 2 ? "#f4a261" : "#f6bd60"} />
    ))}
    <ellipse cx="60" cy="98" rx="46" ry="10" fill="#e9a23b" />
    <path d="M48 100 a12 10 0 0 1 24 0 Z" fill={DARK} />
    <rect x="10" y="106" width="100" height="8" rx="3" fill="#8b5e3c" />
    <path d="M24 114 V120 M96 114 V120" stroke="#8b5e3c" strokeWidth="6" />
  </>
);

const stall = (
  <>
    <rect x="16" y="50" width="88" height="64" fill="#d62828" />
    <rect x="90" y="50" width="14" height="64" fill="#a4161a" />
    <path d="M8 56 L30 24 H90 L112 56 L104 60 L86 32 H34 L16 60 Z" fill="#6d4c41" />
    <path d="M86 32 H90 L112 56 L104 60 Z" fill="#4e342e" />
    <path d="M30 56 L34 32 H86 L90 56 Z" fill="#d62828" />
    <rect x="50" y="36" width="20" height="14" fill="#f4d58d" />
    <path d="M50 36 L70 50 M70 36 L50 50" stroke="#fff" strokeWidth="2.5" />
    <rect x="36" y="70" width="48" height="44" fill={DARK} />
    <rect x="36" y="70" width="48" height="44" fill="none" stroke="#fff" strokeWidth="4" />
    <path d="M18 112 l10 -8 M92 112 l8 -6" stroke="#f4d58d" strokeWidth="3" strokeLinecap="round" />
    <rect x="4" y="113" width="112" height="5" rx="2.5" fill="#8ac926" />
  </>
);

const hoehle = (
  <>
    <path d="M4 116 Q8 52 44 34 Q64 24 84 34 Q114 52 116 116 Z" fill="#9e9e9e" />
    <path d="M84 34 Q114 52 116 116 H96 Q98 64 84 34 Z" fill="#7d7d7d" />
    <path d="M30 116 Q30 70 60 66 Q90 70 90 116 Z" fill="#2b2d42" />
    <ellipse cx="34" cy="50" rx="8" ry="4" fill="#bdbdbd" />
    <ellipse cx="100" cy="94" rx="6" ry="3" fill="#bdbdbd" />
    <path d="M2 112 Q14 102 22 112 M100 112 Q108 100 118 110" stroke="#2d6a4f" strokeWidth="5" strokeLinecap="round" fill="none" />
  </>
);

const teich = (
  <>
    <path d="M16 70 Q14 56 22 44 M22 72 Q26 54 24 38 M102 72 Q106 58 100 46" stroke="#52796f" strokeWidth="3" fill="none" strokeLinecap="round" />
    {[
      [22, 42],
      [24, 36],
      [100, 44],
    ].map(([x, y]) => (
      <rect key={x * y} x={x - 3} y={y - 10} width="6" height="14" rx="3" fill="#8b5e3c" />
    ))}
    <ellipse cx="60" cy="94" rx="56" ry="22" fill="#8ac926" />
    <ellipse cx="60" cy="94" rx="50" ry="17" fill="#4cc9f0" />
    <path d="M24 92 Q40 88 56 92 M70 100 Q84 96 96 100" stroke="#fff" strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M60 90 m-20 0 a20 8 0 1 0 40 0 a20 8 0 1 0 -40 0 Z M60 90 L80 86" fill="#2a9d8f" stroke="#4cc9f0" strokeWidth="2" />
    <circle cx="96" cy="88" r="5" fill="#ff8fab" />
    <circle cx="96" cy="88" r="2" fill="#ffd166" />
  </>
);

const bau = (
  <>
    <path d="M2 116 Q10 60 60 54 Q110 60 118 116 Z" fill="#8ac926" />
    <path d="M86 58 Q110 66 118 116 H100 Q98 76 86 58 Z" fill="#6a994e" />
    <path d="M28 116 Q30 84 60 82 Q90 84 92 116 Z" fill="#8b5e3c" />
    <path d="M36 116 Q38 92 60 90 Q82 92 84 116 Z" fill={DARK} />
    {[20, 46, 74, 98].map((x) => (
      <path key={x} d={`M${x} 64 l2 -8 l2 8 l2 -6 l2 6`} stroke="#6a994e" strokeWidth="2" fill="none" strokeLinejoin="round" />
    ))}
    <circle cx="100" cy="76" r="4" fill="#ffd166" />
    <circle cx="20" cy="88" r="4" fill="#fff" />
  </>
);

const mauseloch = (
  <>
    <rect x="4" y="8" width="112" height="98" rx="4" fill="#f2e8cf" />
    {[30, 60, 90].map((x) => (
      <path key={x} d={`M${x} 8 V98`} stroke="#e6d5ad" strokeWidth="4" />
    ))}
    <rect x="4" y="98" width="112" height="18" rx="2" fill="#bc6c25" />
    <rect x="4" y="98" width="112" height="5" fill="#a0561c" />
    <path d="M36 116 V90 a24 24 0 0 1 48 0 V116 Z" fill="#a0561c" />
    <path d="M42 116 V92 a18 18 0 0 1 36 0 V116 Z" fill={DARK} />
  </>
);

const koerbchen = (
  <>
    <ellipse cx="60" cy="74" rx="54" ry="16" fill="#c08552" />
    <path d="M6 74 Q8 108 60 110 Q112 108 114 74 Z" fill="#c08552" />
    <path d="M78 109 Q112 106 114 74 H96 Q96 100 78 109 Z" fill="#a47148" />
    {[82, 92, 102].map((y) => (
      <path key={y} d={`M10 ${y} Q60 ${y + 12} 110 ${y}`} stroke="#8b5e3c" strokeWidth="2.5" fill="none" />
    ))}
    <ellipse cx="60" cy="74" rx="46" ry="11" fill="#ff8fab" />
    <ellipse cx="54" cy="72" rx="20" ry="4" fill="#ffc2d1" />
  </>
);

const baum = (
  <>
    <path d="M44 116 Q50 80 48 54 H72 Q70 80 76 116 Z" fill="#8b5e3c" />
    <path d="M64 54 H72 Q70 80 76 116 H66 Q66 80 64 54 Z" fill="#6f4e37" />
    <circle cx="60" cy="34" r="30" fill="#52b788" />
    <circle cx="30" cy="48" r="20" fill="#52b788" />
    <circle cx="90" cy="48" r="20" fill="#40916c" />
    <circle cx="74" cy="22" r="16" fill="#40916c" />
    <circle cx="40" cy="26" r="6" fill="#e63946" />
    <circle cx="86" cy="40" r="5" fill="#e63946" />
    <ellipse cx="60" cy="84" rx="11" ry="14" fill={DARK} />
    <ellipse cx="60" cy="84" rx="11" ry="14" fill="none" stroke="#6f4e37" strokeWidth="3" />
    <rect x="4" y="113" width="112" height="5" rx="2.5" fill="#8ac926" />
  </>
);

/** Spokes and rings of a spider web around (60, 58). */
const WEB_CENTRE: [number, number] = [60, 58];
const SPOKES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4 + Math.PI / 8);
const ring = (r: number) => `${SPOKES.map((a, i) => `${i ? "L" : "M"}${WEB_CENTRE[0] + r * Math.cos(a)} ${WEB_CENTRE[1] + r * Math.sin(a)}`).join(" ")} Z`;

const netz = (
  <>
    <path d="M2 8 Q60 2 118 10" stroke="#8b5e3c" strokeWidth="7" strokeLinecap="round" fill="none" />
    <ellipse cx="104" cy="16" rx="8" ry="4" fill="#8ac926" transform="rotate(30 104 16)" />
    <path d="M20 8 L36 30 M100 10 L86 30 M60 4 V12" stroke="#adb5bd" strokeWidth="1.5" />
    {SPOKES.map((a) => (
      <path key={a} d={`M60 58 L${60 + 54 * Math.cos(a)} ${58 + 54 * Math.sin(a)}`} stroke="#adb5bd" strokeWidth="1.8" />
    ))}
    {[12, 24, 36, 48].map((r) => (
      <path key={r} d={ring(r)} stroke="#adb5bd" strokeWidth="1.8" fill="none" />
    ))}
    <circle cx="82" cy="92" r="2.5" fill="#bde0fe" />
    <circle cx="30" cy="44" r="2" fill="#bde0fe" />
  </>
);

const eis = (
  <>
    <ellipse cx="60" cy="100" rx="58" ry="16" fill="#4cc9f0" />
    <path d="M10 98 L18 74 H100 L110 98 Q60 108 10 98 Z" fill="#e3f6ff" />
    <path d="M100 74 L110 98 Q100 101 90 102 L92 74 Z" fill="#bde0fe" />
    <path d="M18 74 L26 66 H94 L100 74 Z" fill="#fff" />
    <path d="M60 70 m-26 0 a26 26 0 0 1 52 0 Z" fill="#fff" />
    <path d="M60 70 m-26 0 a26 26 0 0 1 52 0" stroke="#bde0fe" strokeWidth="2" fill="none" />
    <path d="M38 58 H82 M48 48 H72 M48 58 V70 M72 58 V70 M60 48 V58" stroke="#bde0fe" strokeWidth="2" />
    <path d="M50 70 V64 a10 10 0 0 1 20 0 V70 Z" fill="#2b2d42" />
    <path d="M16 104 Q30 100 44 106 M76 106 Q92 100 106 104" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </>
);

const biberburg = (
  <>
    <path d="M10 104 Q14 50 60 40 Q106 50 110 104 Z" fill="#a47148" />
    <path d="M72 42 Q106 54 110 104 H90 Q92 62 72 42 Z" fill="#8b5e3c" />
    {["M18 92 L52 70", "M24 76 L60 58", "M40 52 L84 74", "M64 50 L100 66", "M70 90 L104 80", "M14 100 L44 86", "M50 46 L76 46", "M84 96 L108 94"].map((d) => (
      <path key={d} d={d} stroke="#6f4e37" strokeWidth="4" strokeLinecap="round" />
    ))}
    {["M30 64 L36 40", "M56 44 L52 26", "M78 46 L92 30", "M98 70 L114 60", "M8 86 L22 78"].map((d) => (
      <path key={d} d={d} stroke="#8b5e3c" strokeWidth="3.5" strokeLinecap="round" />
    ))}
    <path d="M42 104 V96 a18 16 0 0 1 36 0 V104 Z" fill={DARK} />
    <path d="M0 102 H120 V118 H0 Z" fill="#4cc9f0" />
    <path d="M86 102 H120 V118 H86 Z" fill="#3aa8d0" />
    <path d="M8 110 Q20 106 32 110 M70 112 Q84 108 98 112" stroke="#fff" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </>
);

/** A tiny ant drawn on the anthill, at (x, y), facing right. */
const ant = (x: number, y: number) => (
  <g key={`${x} ${y}`} transform={`translate(${x} ${y})`}>
    <path d="M-3 0 l-2 3 M0 0 l0 3.5 M3 0 l2 3 M-3 0 l-2 -3 M3 0 l2 -3" stroke={DARK} strokeWidth="1" strokeLinecap="round" />
    <circle cx="-4" cy="0" r="2.2" fill={DARK} />
    <circle cx="0" cy="0" r="1.6" fill={DARK} />
    <circle cx="3.6" cy="-0.4" r="1.8" fill={DARK} />
  </g>
);

const ameisenhaufen = (
  <>
    <path d="M4 114 Q8 74 34 52 Q60 30 86 52 Q112 74 116 114 Z" fill="#b5835a" />
    <path d="M78 46 Q112 70 116 114 H92 Q94 72 78 46 Z" fill="#94653f" />
    {[
      [30, 92],
      [44, 70],
      [62, 54],
      [54, 96],
      [76, 80],
      [22, 104],
      [74, 104],
      [52, 44],
      [88, 98],
      [36, 80],
      [86, 64],
      [100, 104],
    ].map(([x, y], i) => (
      <path key={x * y} d={`M${x} ${y} l${i % 2 ? 6 : -6} -3`} stroke={i % 3 ? "#e0b084" : "#6f4e37"} strokeWidth="2.5" strokeLinecap="round" />
    ))}
    <ellipse cx="40" cy="62" rx="4" ry="3" fill={DARK} />
    <ellipse cx="84" cy="76" rx="4" ry="3" fill={DARK} />
    <path d="M46 114 V104 a14 12 0 0 1 28 0 V114 Z" fill={DARK} />
    {[ant(28, 70), ant(62, 70), ant(96, 92), ant(20, 96)]}
    <rect x="4" y="113" width="112" height="5" rx="2.5" fill="#8ac926" />
  </>
);

const meer = (
  <>
    <path d="M24 6 V28 H8 Z" fill="#fff" />
    <path d="M27 8 V28 H42 Z" fill="#e3f6ff" />
    <path d="M24 4 V30" stroke="#8b5e3c" strokeWidth="2.5" />
    <path d="M6 30 H44 L38 38 H12 Z" fill="#e63946" />
    <path d="M38 30 H44 L38 38 H34 Z" fill="#c1121f" />
    <path d="M2 40 Q17 30 32 40 T62 40 T92 40 T118 38 V116 H2 Z" fill="#4cc9f0" />
    <path d="M2 84 Q30 78 60 84 T118 82 V116 H2 Z" fill="#3aa8d0" />
    <path d="M2 40 Q17 30 32 40 T62 40 T92 40 T118 38" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path
      d="M10 62 Q22 56 34 62 M70 58 Q82 52 94 58 M30 80 Q42 74 54 80"
      stroke="#fff"
      strokeOpacity="0.6"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path d="M2 104 Q30 96 60 104 T118 102 V116 H2 Z" fill="#f4d58d" />
    <path d="M14 104 Q8 88 16 76 M18 104 Q26 92 20 82" stroke="#2a9d8f" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M100 112 l3 -8 l3 8 l8 0 l-6 5 l2 6 l-7 -4 l-7 4 l2 -6 l-6 -5 Z" fill="#f4845f" transform="translate(-6 -6)" />
    <path d="M30 112 a7 7 0 0 1 14 0 Z" fill="#ffc2d1" />
  </>
);

const wueste = (
  <>
    <circle cx="24" cy="24" r="12" fill="#ffd166" />
    <path d="M2 116 V84 Q40 58 82 84 Q100 74 118 80 V116 Z" fill="#f6bd60" />
    <path d="M82 84 Q100 74 118 80 V116 H96 Q96 92 82 84 Z" fill="#e9a23b" />
    <path d="M2 116 V98 Q50 82 118 100 V116 Z" fill="#f4d58d" />
    <path d="M84 116 Q100 98 118 100 V116 Z" fill="#f6bd60" />
    <path d="M86 112 V54 a7 7 0 0 1 14 0 V112 Z" fill="#52b788" />
    <path d="M94 112 V50 a6 7 0 0 1 6 4 V112 Z" fill="#40916c" />
    <path d="M86 84 H78 a4 4 0 0 1 -4 -4 V68 a4 4 0 0 1 8 0 V76 H86 Z" fill="#52b788" />
    <path d="M100 76 H106 V62 a4 4 0 0 1 8 0 V76 a6 6 0 0 1 -6 6 H100 Z" fill="#40916c" />
    <path d="M90 64 V70 M90 86 V92 M96 76 V82" stroke="#2d6a4f" strokeWidth="1.8" strokeLinecap="round" />
  </>
);

const dschungel = (
  <>
    <circle cx="30" cy="30" r="26" fill="#40916c" />
    <circle cx="90" cy="30" r="26" fill="#2d6a4f" />
    <circle cx="60" cy="20" r="22" fill="#52b788" />
    <path d="M52 116 Q56 70 54 30 H68 Q66 70 72 116 Z" fill="#8b5e3c" />
    <path d="M62 30 H68 Q66 70 72 116 H64 Q62 70 62 30 Z" fill="#6f4e37" />
    {[
      ["M22 46 Q18 64 24 82", 24, 82],
      ["M106 50 Q112 64 106 78", 106, 78],
    ].map(([d, x, y]) => (
      <g key={String(d)}>
        <path d={String(d)} stroke="#6a994e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx={Number(x)} cy={Number(y)} rx="6" ry="3.5" fill="#6a994e" />
      </g>
    ))}
    <path d="M88 44 q6 4 4 12 q-6 -2 -4 -12 Z M94 44 q8 2 8 10 q-6 0 -8 -10 Z M84 46 q2 8 -4 12 q-2 -8 4 -12 Z" fill="#ffd166" />
    <path d="M90 40 V45" stroke="#6f4e37" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M2 116 Q0 82 30 88 Q40 100 46 116 Z" fill="#52b788" />
    <path d="M30 88 Q40 100 46 116 H36 Q32 98 30 88 Z" fill="#40916c" />
    <path d="M118 116 Q120 80 90 90 Q80 102 76 116 Z" fill="#40916c" />
    <path d="M118 116 Q120 80 90 90 Q106 96 106 116 Z" fill="#2d6a4f" />
    <path d="M8 104 Q20 96 32 98 M84 102 Q100 94 112 96" stroke="#2d6a4f" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="16" cy="60" r="4" fill="#ff8fab" />
    <circle cx="16" cy="60" r="1.6" fill="#ffd166" />
  </>
);

const savanne = (
  <>
    <circle cx="96" cy="26" r="12" fill="#ffb703" />
    <path d="M58 104 Q60 80 54 58 H62 Q66 80 66 104 Z" fill="#8b5e3c" />
    <path d="M62 58 Q66 80 66 104 H62 Q62 80 58 58 Z" fill="#6f4e37" />
    <path d="M56 64 L40 50 M62 66 L80 50" stroke="#8b5e3c" strokeWidth="4" strokeLinecap="round" />
    <path d="M14 50 Q20 34 44 36 Q60 26 80 36 Q102 34 108 50 Z" fill="#6a994e" />
    <path d="M80 36 Q102 34 108 50 H88 Q88 42 80 36 Z" fill="#52794a" />
    <path d="M2 116 V96 Q60 86 118 96 V116 Z" fill="#e9c46a" />
    <path d="M94 92 Q108 93 118 96 V116 H98 Z" fill="#d4a94f" />
    {[10, 30, 82, 104].map((x) => (
      <path key={x} d={`M${x} 98 l3 -10 l3 10 l3 -8 l3 8`} stroke="#c9a03f" strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
    ))}
  </>
);

const bambuswald = (
  <>
    {[
      [14, 20, "#8ac926", "#6a994e"],
      [38, 6, "#6a994e", "#52794a"],
      [74, 12, "#8ac926", "#6a994e"],
      [98, 26, "#6a994e", "#52794a"],
    ].map(([x, top, light, dark]) => (
      <g key={String(x)}>
        <rect x={Number(x)} y={Number(top)} width="10" height={114 - Number(top)} rx="3" fill={String(light)} />
        <rect x={Number(x) + 6} y={Number(top)} width="4" height={114 - Number(top)} rx="2" fill={String(dark)} />
        {[0, 1, 2, 3]
          .map((i) => Number(top) + 18 + i * 24)
          .filter((y) => y < 106)
          .map((y) => (
            <rect key={y} x={Number(x) - 1} y={y} width="12" height="3" rx="1.5" fill={String(dark)} />
          ))}
      </g>
    ))}
    {[
      [24, 34, -30],
      [36, 54, 30],
      [48, 22, -20],
      [84, 30, -30],
      [72, 50, 30],
      [108, 44, -25],
      [96, 64, 30],
      [12, 72, 25],
    ].map(([x, y, a]) => (
      <ellipse key={x * y} cx={x} cy={y} rx="11" ry="3.5" fill="#52b788" transform={`rotate(${a} ${x} ${y})`} />
    ))}
    <rect x="4" y="113" width="112" height="5" rx="2.5" fill="#8ac926" />
  </>
);

export const HOMES: Record<HomeId, Home> = {
  huette: { id: "huette", name: "Hütte", inPhrase: "in der Hütte", spot: [60, 98], fit: 0.3, drawing: huette },
  nest: { id: "nest", name: "Nest", inPhrase: "im Nest", spot: [60, 60], fit: 0.38, drawing: nest },
  aquarium: { id: "aquarium", name: "Aquarium", inPhrase: "im Aquarium", spot: [58, 72], fit: 0.34, drawing: aquarium },
  bienenstock: { id: "bienenstock", name: "Bienenstock", inPhrase: "im Bienenstock", spot: [60, 88], fit: 0.2, drawing: bienenstock },
  stall: { id: "stall", name: "Stall", inPhrase: "im Stall", spot: [60, 94], fit: 0.36, drawing: stall },
  hoehle: { id: "hoehle", name: "Höhle", inPhrase: "in der Höhle", spot: [60, 96], fit: 0.42, drawing: hoehle },
  teich: { id: "teich", name: "Teich", inPhrase: "im Teich", spot: [60, 82], fit: 0.3, drawing: teich },
  bau: { id: "bau", name: "Bau", inPhrase: "im Bau", spot: [60, 102], fit: 0.32, drawing: bau },
  mauseloch: { id: "mauseloch", name: "Mauseloch", inPhrase: "im Mauseloch", spot: [60, 104], fit: 0.26, drawing: mauseloch },
  koerbchen: { id: "koerbchen", name: "Körbchen", inPhrase: "im Körbchen", spot: [60, 64], fit: 0.4, drawing: koerbchen },
  baum: { id: "baum", name: "Baum", inPhrase: "im Baum", spot: [60, 82], fit: 0.24, drawing: baum },
  netz: { id: "netz", name: "Netz", inPhrase: "im Netz", spot: [60, 58], fit: 0.26, drawing: netz },
  eis: { id: "eis", name: "Eis", inPhrase: "auf dem Eis", spot: [60, 68], fit: 0.3, drawing: eis },
  biberburg: { id: "biberburg", name: "Biberburg", inPhrase: "in der Biberburg", spot: [60, 96], fit: 0.26, drawing: biberburg },
  ameisenhaufen: { id: "ameisenhaufen", name: "Ameisenhaufen", inPhrase: "im Ameisenhaufen", spot: [60, 104], fit: 0.16, drawing: ameisenhaufen },
  meer: { id: "meer", name: "Meer", inPhrase: "im Meer", spot: [62, 72], fit: 0.4, drawing: meer },
  wueste: { id: "wueste", name: "Wüste", inPhrase: "in der Wüste", spot: [44, 94], fit: 0.38, drawing: wueste },
  dschungel: { id: "dschungel", name: "Dschungel", inPhrase: "im Dschungel", spot: [62, 72], fit: 0.3, drawing: dschungel },
  savanne: { id: "savanne", name: "Savanne", inPhrase: "in der Savanne", spot: [38, 94], fit: 0.36, drawing: savanne },
  bambuswald: { id: "bambuswald", name: "Bambuswald", inPhrase: "im Bambuswald", spot: [58, 94], fit: 0.36, drawing: bambuswald },
};

/** The drawing of `home`; `label` is its name in the app language, for screen readers. */
export function HomeDrawing({ home, label }: { home: Home; label: string }) {
  return (
    <svg className="home-drawing" viewBox="0 0 120 120" role="img" aria-label={label}>
      {home.drawing}
    </svg>
  );
}
