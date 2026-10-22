import { GLASS, INK, Inside, Rider, STEEL, nth } from "../shared";
import { Cap, SNOW, SNOW_SHADE, TurningWheel, guard, vars } from "./parts";

// The winter service: the snow plough and the gritter. Both face left and stand with their
// wheels on (0, 0). The classes bs-driver and bs-beacon reuse the Baustelle's driver nod and roof light.

/** An orange roof light; it glows while the item plays (bs-beacon from the Baustelle). */
function Beacon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <>
      <rect x={cx - 10} y={cy - 7} width="20" height="14" rx="6" fill="#b5651d" />
      <rect x={cx - 14} y={cy + 5} width="28" height="4" rx="2" fill={INK} />
      <rect className="bs-beacon" x={cx - 10} y={cy - 7} width="20" height="14" rx="6" fill="#ffb703" />
    </>
  );
}

const PLOUGH = "#ff8c00";
const PLOUGH_DARK = "#e86a00";
const PLOUGH_WINDOW = "M-60 -158 H-112 Q-132 -158 -138 -122 H-60 Z";

/** The snow plough truck: a big blade in front pushes the snow off the road. */
export function Schneepflug() {
  return (
    <>
      <g className="wb-pflug-heap" style={{ transformOrigin: "-248px 0px" }}>
        <path d="M-324 0 Q-322 -38 -296 -46 Q-276 -62 -254 -42 Q-246 -22 -244 0 Z" fill={SNOW} />
        <path d="M-300 -8 Q-290 -30 -270 -34" stroke={SNOW_SHADE} strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <g className="wb-pflug-spray" fill={SNOW} stroke="#c3d6ea" strokeWidth="2">
        {[
          [-276, -66],
          [-300, -58],
          [-258, -80],
          [-312, -40],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={9 + (i % 2) * 3} style={nth(i)} />
        ))}
      </g>
      <g className="wb-pflug-truck">
        <g className="wb-pflug-smoke" fill="#dee2e6">
          {[0, 1, 2].map((i) => (
            <circle key={i} cx="-44" cy="-186" r="9" style={nth(i)} />
          ))}
        </g>
        <rect x="-50" y="-182" width="12" height="40" rx="3" fill={INK} />
        <rect x="-172" y="-68" width="364" height="24" rx="6" fill={INK} />
        {/* The bed full of road salt */}
        <path d="M-30 -154 Q72 -196 178 -154 Z" fill="#e9ecef" />
        <g fill="#adb5bd">
          <circle cx="40" cy="-166" r="3" />
          <circle cx="90" cy="-172" r="3" />
          <circle cx="130" cy="-162" r="3" />
        </g>
        <path d="M-36 -152 H186 L180 -68 H-30 Z" fill={PLOUGH} />
        <rect x="-40" y="-158" width="230" height="12" rx="4" fill={PLOUGH_DARK} />
        <path d="M30 -146 V-68 M100 -146 V-68" stroke={PLOUGH_DARK} strokeWidth="6" />
        <path d="M-24 -124 H18 M44 -124 H86" stroke="#ffb35c" strokeWidth="5" strokeLinecap="round" />
        <rect x="160" y="-142" width="18" height="70" fill="#fff" />
        <path d="M160 -132 L178 -120 V-108 L160 -120 Z M160 -104 L178 -92 V-80 L160 -92 Z" fill="#e63946" />
        {/* Cab */}
        <path d="M-52 -68 V-162 Q-52 -176 -66 -176 H-118 Q-146 -176 -152 -140 L-160 -68 Z" fill={PLOUGH} />
        <path d="M-160 -86 H-52 V-68 H-160 Z" fill={PLOUGH_DARK} />
        <path d="M-110 -168 H-62" stroke="#ffb35c" strokeWidth="5" strokeLinecap="round" />
        <path d={PLOUGH_WINDOW} fill={GLASS} />
        <Inside d={PLOUGH_WINDOW}>
          <g className="bs-driver">
            <Rider cx={-94} cy={-132} shirt="#ff8c42" cap="#264653" />
          </g>
        </Inside>
        <path d="M-86 -156 h9 L-90 -124 h-9 Z" fill="#fff" opacity="0.5" />
        <rect x="-164" y="-104" width="14" height="14" rx="4" fill="#fff4d6" />
        <rect className="wb-pflug-light" x="-164" y="-104" width="14" height="14" rx="4" fill="#ffd60a" />
        <Beacon cx={-96} cy={-184} />
        <Cap x={-78} y={-176} w={20} h={6} />
        <Cap x={-140} y={-172} w={22} h={6} />
        <path d={`${guard(-106, -34, 38)} ${guard(120, -34, 70)}`} stroke="#2b2d42" strokeWidth="8" fill="none" />
        <TurningWheel cx={-106} cy={-30} r={30} className="wb-pflug-wheel" />
        <TurningWheel cx={90} cy={-30} r={30} className="wb-pflug-wheel" />
        <TurningWheel cx={152} cy={-30} r={30} className="wb-pflug-wheel" />
        {/* The blade on its arm */}
        <path d="M-160 -60 L-200 -56 M-150 -100 L-200 -78" stroke={STEEL} strokeWidth="8" strokeLinecap="round" />
        <g className="wb-pflug-blade">
          <path d="M-250 -6 Q-268 -60 -240 -116 L-196 -116 Q-218 -60 -204 -6 Z" fill={PLOUGH} />
          <path d="M-246 -12 Q-262 -60 -236 -110 L-228 -110 Q-252 -60 -238 -12 Z" fill={PLOUGH_DARK} />
          <path d="M-240 -116 H-196 L-199 -102 H-243 Z" fill="#fff" />
          <path d="M-234 -116 h8 l-4 14 h-8 Z M-216 -116 h8 l-4 14 h-8 Z" fill="#e63946" />
          <rect x="-254" y="-10" width="52" height="9" rx="3" fill={INK} />
          <Cap x={-242} y={-116} w={44} h={6} />
        </g>
      </g>
    </>
  );
}

const GRITTER = "#e63946";
const GRITTER_WINDOW = "M-38 -132 H-82 Q-98 -132 -104 -102 H-38 Z";

/** A small red gritter: the disc at the back spins and throws grit onto the road. */
export function Streuwagen() {
  return (
    <>
      <g className="wb-streu-grit" fill="#868e96">
        {[
          ["30px", "-6px"],
          ["44px", "8px"],
          ["24px", "18px"],
          ["52px", "-14px"],
          ["38px", "24px"],
          ["18px", "6px"],
        ].map(([dx, dy], i) => (
          <circle key={i} cx="140" cy="-32" r="3.5" style={vars(i, { "--dx": dx, "--dy": dy })} />
        ))}
      </g>
      <g className="wb-streu-truck">
        <rect x="-128" y="-56" width="272" height="18" rx="5" fill={INK} />
        {/* Hopper full of grit */}
        <path d="M-20 -142 Q54 -172 126 -142 Z" fill="#adb5bd" />
        <g fill="#6c757d">
          <circle cx="20" cy="-150" r="2.5" />
          <circle cx="56" cy="-156" r="2.5" />
          <circle cx="88" cy="-150" r="2.5" />
        </g>
        <path d="M-24 -140 H130 L108 -58 H0 Z" fill="#ffd60a" />
        <rect x="-28" y="-146" width="162" height="10" rx="4" fill="#f4b400" />
        <path d="M30 -136 L34 -58 M76 -136 L72 -58" stroke="#f4b400" strokeWidth="5" />
        <path d="M120 -60 L130 -36" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <g className="wb-streu-disc" style={{ transformOrigin: "136px -32px" }}>
          <ellipse cx="136" cy="-32" rx="20" ry="5" fill="#495057" />
          <path d="M120 -32 H152" stroke="#ced4da" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Cab */}
        <path d="M-30 -56 V-132 Q-30 -144 -44 -144 H-86 Q-110 -144 -116 -112 L-122 -56 Z" fill={GRITTER} />
        <path d="M-122 -74 H-30 V-56 H-122 Z" fill="#c1121f" />
        <path d="M-82 -138 H-40" stroke="#ff8fa3" strokeWidth="4" strokeLinecap="round" />
        <path d={GRITTER_WINDOW} fill={GLASS} />
        <Inside d={GRITTER_WINDOW}>
          <g className="bs-driver">
            <Rider cx={-66} cy={-110} shirt="#ffd60a" cap="#ffd60a" />
          </g>
        </Inside>
        <path d="M-62 -130 h8 L-66 -104 h-8 Z" fill="#fff" opacity="0.5" />
        <rect x="-126" y="-90" width="11" height="12" rx="3" fill="#fff4d6" />
        <rect className="wb-streu-light" x="-126" y="-90" width="11" height="12" rx="3" fill="#ffd60a" />
        <Beacon cx={-70} cy={-152} />
        <Cap x={-50} y={-144} w={16} h={5} />
        <path d={`${guard(-78, -30, 32)} ${guard(78, -30, 32)}`} stroke="#2b2d42" strokeWidth="7" fill="none" />
        <TurningWheel cx={-78} cy={-26} r={26} className="wb-streu-wheel" />
        <TurningWheel cx={78} cy={-26} r={26} className="wb-streu-wheel" />
      </g>
    </>
  );
}
