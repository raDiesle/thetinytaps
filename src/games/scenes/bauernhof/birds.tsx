import { INK, Inside, nth } from "../shared";

// Birds. Each drawing has its foot point at (0, 0), except those that sit on something
// else: the stork (barn roof) and the rooster (hen house roof). The duck's (0, 0) is
// where it floats on the water.

const EYE = "#2b2d42";

/** Stork in its nest on the barn roof, in the barn's coordinates; it throws its head back and clatters. */
export function Storch() {
  return (
    <>
      <g className="bh-storch-body" style={{ transformOrigin: "0px -380px" }}>
        <ellipse cx="-6" cy="-402" rx="32" ry="18" fill="#fff" />
        <path d="M-38 -404 Q-12 -390 22 -398 L16 -388 Q-12 -382 -40 -396 Z" fill={INK} />
        <path d="M-38 -404 L-52 -398 L-38 -394 Z" fill="#fff" />
        <g className="bh-storch-head" style={{ transformOrigin: "10px -414px" }}>
          <path d="M10 -414 Q16 -436 11 -454" stroke="#fff" strokeWidth="13" strokeLinecap="round" fill="none" />
          <circle cx="13" cy="-460" r="12" fill="#fff" />
          <path className="bh-storch-beak-top" d="M20 -466 L64 -459 L20 -458 Z" fill="#f77f00" style={{ transformOrigin: "20px -462px" }} />
          <path className="bh-storch-beak-bottom" d="M20 -458 L62 -457 L20 -453 Z" fill="#e85d04" style={{ transformOrigin: "20px -456px" }} />
          <circle cx="16" cy="-464" r="2.6" fill={EYE} />
          <circle cx="16.8" cy="-464.8" r="0.9" fill="#fff" />
        </g>
      </g>
      <ellipse cx="0" cy="-378" rx="50" ry="16" fill="#7f5539" />
      <path
        d="M-48 -384 L-20 -372 M-40 -370 L-6 -386 M-8 -368 L26 -386 M10 -390 L44 -374 M30 -368 L52 -382"
        stroke="#9c6644"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </>
  );
}

/** Rooster on the ridge of the hen house roof, in the hen house's coordinates; "Kikeriki!" */
export function Hahn() {
  return (
    <g className="bh-hahn-body" style={{ transformOrigin: "0px -212px" }}>
      <path d="M-6 -212 V-230 M6 -212 V-230 M-12 -212 h12 M0 -212 h12" stroke="#ff8c42" strokeWidth="4" strokeLinecap="round" />
      <path d="M-14 -250 Q-56 -290 -44 -314 Q-32 -284 -6 -264 Z" fill="#2d6a4f" />
      <path d="M-16 -246 Q-62 -270 -62 -294 Q-44 -266 -10 -252 Z" fill="#1b4332" />
      <path d="M-16 -240 Q-56 -246 -64 -266 Q-42 -250 -12 -246 Z" fill="#e85d04" />
      <ellipse cx="0" cy="-244" rx="26" ry="20" fill="#bc4749" />
      <ellipse cx="-4" cy="-242" rx="15" ry="9" fill="#9d0208" />
      <g className="bh-hahn-head" style={{ transformOrigin: "10px -258px" }}>
        <path d="M2 -250 Q2 -276 14 -286 Q28 -282 26 -262 Q16 -250 2 -250 Z" fill="#f4a261" />
        <circle cx="18" cy="-284" r="11" fill="#bc4749" />
        <circle cx="11" cy="-296" r="5" fill="#e63946" />
        <circle cx="18" cy="-299" r="6" fill="#e63946" />
        <circle cx="25" cy="-295" r="5" fill="#e63946" />
        <ellipse cx="25" cy="-271" rx="4" ry="6" fill="#e63946" />
        <path d="M27 -288 L40 -284 L27 -281 Z" fill="#ffb703" />
        <path className="bh-hahn-beak" d="M27 -281 L38 -280 L27 -277 Z" fill="#f77f00" style={{ transformOrigin: "27px -280px" }} />
        <circle cx="20" cy="-287" r="2.4" fill={EYE} />
        <circle cx="20.7" cy="-287.7" r="0.8" fill="#fff" />
      </g>
      <g className="bh-hahn-notes" fill={INK} fontSize="26" fontWeight="700">
        <text x="44" y="-292" style={nth(0)}>
          ♪
        </text>
        <text x="58" y="-318" style={nth(1)}>
          ♫
        </text>
      </g>
    </g>
  );
}

/** Brown hen, facing right; she pecks and flaps her wings. */
export function Huhn() {
  return (
    <g className="bh-huhn-body">
      <path d="M-8 -16 V0 M8 -16 V0 M-14 0 h12 M2 0 h12" stroke="#ff8c42" strokeWidth="4" strokeLinecap="round" />
      <path d="M-28 -50 Q-54 -76 -44 -88 Q-36 -66 -18 -60 Z" fill="#bc6c25" />
      <ellipse cx="0" cy="-38" rx="34" ry="26" fill="#dda15e" />
      <ellipse cx="-6" cy="-54" rx="20" ry="5" fill="#fff" opacity="0.35" />
      <g className="bh-huhn-wing" style={{ transformOrigin: "4px -46px" }}>
        <ellipse cx="-6" cy="-38" rx="20" ry="13" fill="#bc6c25" />
        <path d="M-18 -36 q8 6 18 2 M-16 -30 q8 5 16 1" stroke="#a0522d" strokeWidth="2" fill="none" />
      </g>
      <g className="bh-huhn-head" style={{ transformOrigin: "20px -48px" }}>
        <ellipse cx="22" cy="-56" rx="14" ry="16" fill="#dda15e" />
        <circle cx="30" cy="-70" r="14" fill="#dda15e" />
        <circle cx="24" cy="-84" r="5" fill="#e63946" />
        <circle cx="30" cy="-86" r="6" fill="#e63946" />
        <circle cx="36" cy="-83" r="5" fill="#e63946" />
        <path d="M42 -73 L54 -69 L42 -65 Z" fill="#ffb703" />
        <ellipse cx="42" cy="-60" rx="3.5" ry="5" fill="#e63946" />
        <circle cx="34" cy="-73" r="2.4" fill={EYE} />
        <circle cx="34.7" cy="-73.7" r="0.8" fill="#fff" />
      </g>
    </g>
  );
}

/** Three fluffy chicks; they hop one after the other. */
export function Kueken() {
  return (
    <>
      {[-40, 0, 40].map((x, i) => (
        <g key={x} className="bh-kueken-chick" style={nth(i)}>
          <path d={`M${x - 4} -6 V0 M${x + 4} -6 V0`} stroke="#ff8c42" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx={x} cy="-15" rx="15" ry="12" fill="#ffd60a" />
          <ellipse cx={x - 4} cy="-14" rx="7" ry="5" fill="#ffc300" />
          <circle cx={x + 9} cy="-29" r="10" fill="#ffd60a" />
          <path d={`M${x + 6} -38 q2 -6 6 -4 M${x + 9} -38 q4 -5 7 -1`} stroke="#ffc300" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d={`M${x + 18} -31 L${x + 25} -29 L${x + 18} -27 Z`} fill="#ff8c42" />
          <circle cx={x + 12} cy="-31" r="1.9" fill={EYE} />
        </g>
      ))}
    </>
  );
}

/** White goose with a blue bow, facing left; it stretches its neck and flaps its wings. */
export function Gans() {
  return (
    <g className="bh-gans-body">
      <path d="M-2 -18 V-4 M14 -18 V-4" stroke="#ff8c42" strokeWidth="4" />
      <path d="M-12 0 L-2 -6 L6 0 Z M4 0 L14 -6 L22 0 Z" fill="#ff8c42" />
      <path d="M50 -62 L72 -74 L60 -48 Z" fill="#e9ecef" />
      <ellipse cx="14" cy="-44" rx="46" ry="28" fill="#fff" />
      <ellipse cx="14" cy="-26" rx="38" ry="9" fill="#e9ecef" />
      <g className="bh-gans-wing" style={{ transformOrigin: "4px -54px" }}>
        <path d="M-4 -56 Q30 -74 60 -56 Q38 -38 0 -44 Z" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="2" />
        <path d="M24 -52 q12 2 22 -2 M18 -46 q12 2 22 -2" stroke="#dee2e6" strokeWidth="2" fill="none" />
      </g>
      <g className="bh-gans-neck" style={{ transformOrigin: "-12px -56px" }}>
        <path d="M-26 -60 Q-36 -84 -32 -104 L-16 -104 Q-20 -84 -4 -64 Z" fill="#fff" />
        <circle cx="-26" cy="-108" r="14" fill="#fff" />
        <path d="M-36 -112 L-58 -105 L-36 -100 Z" fill="#ff8c42" />
        <circle cx="-37" cy="-112" r="4" fill="#e85d04" />
        <circle cx="-28" cy="-113" r="2.6" fill={EYE} />
        <circle cx="-28.8" cy="-113.8" r="0.9" fill="#fff" />
        <path d="M-34 -78 L-46 -86 L-46 -70 Z M-22 -78 L-10 -86 L-10 -70 Z" fill="#4895ef" />
        <circle cx="-28" cy="-78" r="5" fill="#3a86ff" />
      </g>
    </g>
  );
}

const ABOVE_WATER = "M-90 2 V-130 H100 V2 Z";

/** Mallard on the pond, facing right; it dips its head under water, tail up. */
export function Ente() {
  return (
    <>
      <g className="bh-ente-ripples" stroke="#fff" strokeWidth="3" fill="none">
        {[40, 58].map((rx, i) => (
          <ellipse key={rx} cx="4" cy="0" rx={rx} ry={rx / 5} style={nth(i)} />
        ))}
      </g>
      <Inside d={ABOVE_WATER}>
        <g className="bh-ente-body" style={{ transformOrigin: "6px -4px" }}>
          <path d="M-34 -20 L-50 -32 L-30 -28 Z" fill="#343a40" />
          <path d="M-36 -28 q-4 -8 2 -10" stroke="#343a40" strokeWidth="3" fill="none" strokeLinecap="round" />
          <ellipse cx="0" cy="-14" rx="38" ry="20" fill="#ced4da" />
          <ellipse cx="24" cy="-18" rx="17" ry="16" fill="#7f4f24" />
          <ellipse cx="-6" cy="-22" rx="22" ry="10" fill="#a68a64" />
          <rect x="-16" y="-24" width="14" height="6" rx="2" fill="#3a86ff" />
          <path d="M18 -32 Q30 -26 40 -34" stroke="#fff" strokeWidth="4" fill="none" />
          <path d="M20 -34 Q22 -50 30 -56 L40 -50 Q40 -40 38 -34 Z" fill="#2d6a4f" />
          <circle cx="32" cy="-50" r="14" fill="#2d6a4f" />
          <ellipse cx="28" cy="-56" rx="5" ry="3" fill="#fff" opacity="0.4" />
          <path d="M44 -52 L62 -47 L44 -42 Z" fill="#ffd60a" />
          <circle cx="36" cy="-53" r="2.5" fill={EYE} />
          <circle cx="36.8" cy="-53.8" r="0.8" fill="#fff" />
        </g>
      </Inside>
    </>
  );
}
