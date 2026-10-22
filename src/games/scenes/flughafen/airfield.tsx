import { Face, GLASS, INK, Inside, SKIN, STEEL, nth } from "../shared";
import { NAVY, RAIL_RED, TurningWheel } from "./parts";

// The airfield at the back: the airliner on the runway, the tower, the hangar, the windsock and
// the runway lights; and the aircraft in the sky. Ground drawings have their foot point at (0, 0),
// sky drawings their middle.

const COCKPIT = "M198 -118 Q228 -116 238 -100 H202 Z";
const WINDOWS = [-110, -78, -46, -14, 18, 50, 82, 114];

/** The airliner on the runway, nose to the right: it rolls off, takes off into the sky and lands again. */
export function Flugzeug() {
  return (
    <g className="fh-flug-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="fh-flug-puffs" fill="#e9ecef">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="-74" cy="-52" r="12" style={nth(i)} />
        ))}
      </g>
      {/* Landing gear: folds up into the plane after take-off */}
      <g className="fh-flug-gear" style={{ transformOrigin: "-20px -60px" }}>
        <path d="M-20 -60 V-20" stroke={STEEL} strokeWidth="7" />
        <TurningWheel cx={-32} cy={-14} r={14} />
        <TurningWheel cx={-6} cy={-14} r={14} />
      </g>
      <g className="fh-flug-gear" style={{ transformOrigin: "184px -62px" }}>
        <path d="M184 -62 V-20" stroke={STEEL} strokeWidth="6" />
        <TurningWheel cx={184} cy={-14} r={13} />
      </g>
      {/* Tail fin with its rudder */}
      <path d="M-206 -122 L-238 -206 H-206 L-140 -124 Z" fill="#3a86ff" />
      <path d="M-228 -192 H-210 L-196 -160 H-214 Z" fill="#fff" opacity="0.8" />
      <path className="fh-flug-rudder" d="M-238 -206 H-252 L-222 -124 H-206 Z" fill="#2667cc" style={{ transformOrigin: "-222px -124px" }} />
      <path d="M-196 -108 L-252 -100 L-246 -92 L-176 -98 Z" fill="#2667cc" />
      {/* Fuselage */}
      <path d="M-218 -128 L-150 -126 H190 Q244 -122 246 -94 Q242 -62 196 -62 H-140 Q-192 -66 -218 -128 Z" fill="#f8f9fa" />
      <path d="M-200 -88 Q-170 -70 -140 -68 H196 Q232 -68 242 -84 L244 -78 Q236 -62 196 -62 H-140 Q-180 -64 -204 -96 Z" fill="#dee2e6" />
      <path d="M-196 -96 H232" stroke="#3a86ff" strokeWidth="7" strokeLinecap="round" />
      <path d={COCKPIT} fill={GLASS} />
      <Inside d={COCKPIT}>
        <g className="fh-flug-pilot">
          <circle cx="218" cy="-104" r="9" fill={SKIN} />
          <path d="M208 -108 Q210 -118 220 -117 Q229 -116 228 -106 Z" fill={NAVY} />
        </g>
      </Inside>
      <path d="M212 -116 l5 0 l-8 14 h-5 Z" fill="#fff" opacity="0.6" />
      {WINDOWS.map((x, i) => {
        const d = `M${x} -122 h16 v18 h-16 Z`;
        return (
          <g key={x}>
            <rect x={x} y="-122" width="16" height="18" rx="7" fill={GLASS} />
            {i % 2 === 0 && (
              <Inside d={d}>
                <g className="fh-flug-guest" style={nth(i / 2)}>
                  <circle cx={x + 8} cy="-108" r="7" fill={SKIN} />
                  <circle cx={x + 5.5} cy="-109" r="1.2" fill={INK} />
                  <circle cx={x + 10.5} cy="-109" r="1.2" fill={INK} />
                </g>
              </Inside>
            )}
          </g>
        );
      })}
      {/* Door with a little window */}
      <rect x="160" y="-122" width="22" height="48" rx="5" fill="none" stroke="#ced4da" strokeWidth="3" />
      <circle cx="171" cy="-108" r="5" fill={GLASS} />
      {/* Wing pointing towards us, with the engine below it */}
      <path d="M-50 -86 H40 L-20 -36 H-86 Z" fill="#ced4da" />
      <path d="M-86 -36 H-20 L-14 -42 H-80 Z" fill="#adb5bd" />
      <rect x="-64" y="-66" width="64" height="26" rx="13" fill="#e9ecef" />
      <ellipse cx="-2" cy="-53" rx="6" ry="12" fill="#495057" />
      <circle className="fh-flug-blink" cx="-84" cy="-38" r="6" fill={RAIL_RED} />
      <circle className="fh-flug-beacon" cx="40" cy="-130" r="6" fill={RAIL_RED} />
    </g>
  );
}

const HELI_BUBBLE = "M-130 -14 Q-128 -60 -74 -62 H-56 V0 H-120 Q-130 -4 -130 -14 Z";

/** A yellow rescue helicopter, flying left: the rotor whirls, it bobs and tips its nose. */
export function Hubschrauber() {
  return (
    <g className="fh-heli-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M50 -26 L178 -36 V-20 L50 -2 Z" fill="#ffc300" />
      <path d="M168 -54 L186 -54 L188 -18 L172 -20 Z" fill="#e5a800" />
      <g className="fh-heli-tail" style={{ transformOrigin: "180px -32px" }}>
        <ellipse cx="180" cy="-32" rx="6" ry="28" fill="#adb5bd" opacity="0.8" />
      </g>
      <path d="M-134 -10 Q-134 -66 -70 -66 H34 Q80 -64 80 -20 Q80 16 26 20 H-100 Q-134 16 -134 -10 Z" fill="#ffd60a" />
      <path d="M-118 4 H56 Q74 2 78 -12 V0 Q72 18 26 20 H-100 Q-116 18 -118 4 Z" fill="#f4a261" />
      <path d={HELI_BUBBLE} fill={GLASS} />
      <Inside d={HELI_BUBBLE}>
        <g className="fh-heli-pilot" style={{ transformOrigin: "-90px -20px" }}>
          <rect x="-104" y="-14" width="28" height="18" rx="7" fill={RAIL_RED} />
          <circle cx="-90" cy="-28" r="13" fill={SKIN} />
          <path d="M-104 -30 Q-104 -44 -90 -44 Q-76 -44 -76 -30 Z" fill="#f8f9fa" />
          <circle cx="-96" cy="-27" r="1.8" fill={INK} />
          <circle cx="-86" cy="-27" r="1.8" fill={INK} />
          <path d="M-95 -21 Q-91 -18 -87 -21" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      </Inside>
      <path d="M-106 -50 q10 -4 20 -4" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" fill="none" />
      <rect x="-40" y="-52" width="56" height="32" rx="6" fill={GLASS} />
      <path d="M-12 -40 h22 M-1 -51 v22" stroke={RAIL_RED} strokeWidth="7" />
      <path d="M-110 30 H56 M-80 20 V30 M26 20 V30" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <circle className="fh-heli-light" cx="78" cy="-6" r="6" fill={RAIL_RED} />
      <rect x="-14" y="-82" width="20" height="18" rx="4" fill="#495057" />
      <g className="fh-heli-rotor" style={{ transformOrigin: "-4px -84px" }}>
        <rect x="-150" y="-90" width="292" height="10" rx="5" fill="#495057" />
      </g>
      <circle cx="-4" cy="-84" r="9" fill={INK} />
    </g>
  );
}

const GONDOLA = "M-52 44 H36 Q44 44 44 54 V64 Q44 74 34 74 H-50 Q-60 74 -60 64 V54 Q-60 44 -52 44 Z";

/** An airship floating above the airport: its propeller turns, the people in the gondola wave. */
export function Luftschiff() {
  return (
    <g className="fh-blimp-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="fh-blimp-fin" style={{ transformOrigin: "-120px -10px" }}>
        <path d="M-110 -30 L-162 -70 H-140 L-96 -34 Z" fill={RAIL_RED} />
      </g>
      <g className="fh-blimp-fin" style={{ transformOrigin: "-120px 10px" }}>
        <path d="M-110 30 L-162 70 H-140 L-96 34 Z" fill={RAIL_RED} />
      </g>
      <path d="M-120 0 H-170" stroke={RAIL_RED} strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="0" cy="0" rx="150" ry="52" fill="#f1f3f5" />
      <path d="M-148 10 Q0 40 148 10 Q120 50 0 52 Q-120 50 -148 10 Z" fill="#dee2e6" />
      <path d="M-40 -50 Q-50 0 -40 50 M40 -50 Q50 0 40 50" stroke="#4cc9f0" strokeWidth="14" fill="none" />
      <ellipse cx="-40" cy="-28" rx="60" ry="12" fill="#fff" opacity="0.7" />
      <path d="M-30 44 L-20 52 M20 44 L10 52" stroke={INK} strokeWidth="3" />
      <path d={GONDOLA} fill="#ffb703" />
      {[-44, -14, 16].map((x, i) => (
        <g key={x}>
          <rect x={x} y="48" width="22" height="18" rx="5" fill={GLASS} />
          <Inside d={`M${x} 48 h22 v18 h-22 Z`}>
            <g className="fh-blimp-guest" style={nth(i)}>
              <circle cx={x + 11} cy="62" r="8" fill={SKIN} />
              <circle cx={x + 8} cy="61" r="1.4" fill={INK} />
              <circle cx={x + 14} cy="61" r="1.4" fill={INK} />
            </g>
          </Inside>
        </g>
      ))}
      <circle cx="-62" cy="60" r="5" fill={INK} />
      <g className="fh-blimp-prop" style={{ transformOrigin: "-64px 60px" }}>
        <rect x="-68" y="40" width="8" height="40" rx="4" fill="#495057" />
      </g>
      <g className="fh-blimp-hearts" fill="#ff5d73">
        {[
          [60, 40],
          [90, 20],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} c0 -8 -12 -8 -12 0 c0 6 12 12 12 14 c0 -2 12 -8 12 -14 c0 -8 -12 -8 -12 0 Z`} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

const CAB = "M-74 -460 H74 L64 -384 H-64 Z";

/** The control tower: the radar turns, the light on the mast blinks and the controller waves. */
export function Tower() {
  return (
    <>
      <path d="M-34 0 L-24 -370 H24 L34 0 Z" fill="#f1f3f5" />
      <path d="M10 0 L14 -370 H24 L34 0 Z" fill="#dee2e6" />
      <path d="M-27 -300 H27 M-29 -230 H29 M-31 -160 H31" stroke="#ced4da" strokeWidth="4" />
      {[-270, -200, -130].map((y) => (
        <rect key={y} x="-6" y={y} width="12" height="20" rx="4" fill={GLASS} />
      ))}
      <rect x="-18" y="-58" width="36" height="58" rx="4" fill="#495057" />
      <g className="fh-turm-door" style={{ transformOrigin: "-18px -29px" }}>
        <rect x="-18" y="-58" width="36" height="58" rx="4" fill="#4cc9f0" />
        <circle cx="10" cy="-28" r="3" fill={INK} />
      </g>
      <rect x="-60" y="-384" width="120" height="18" rx="4" fill="#adb5bd" />
      <path d={CAB} fill={GLASS} />
      <Inside d={CAB}>
        <g className="fh-turm-lotse" style={{ transformOrigin: "0px -384px" }}>
          <rect x="-24" y="-410" width="48" height="40" rx="14" fill="#4361ee" />
          <circle cx="0" cy="-428" r="20" fill={SKIN} />
          <path d="M-20 -432 Q-20 -452 0 -452 Q20 -452 20 -432 Q8 -442 -20 -432 Z" fill="#6b4423" />
          <Face cx={0} cy={-427} size={0.6} />
          <path d="M-22 -432 Q-22 -456 0 -456 Q22 -456 22 -432" stroke={INK} strokeWidth="4" fill="none" />
          <rect x="-26" y="-438" width="8" height="14" rx="3" fill={INK} />
          <rect x="18" y="-438" width="8" height="14" rx="3" fill={INK} />
          <path d="M-20 -426 Q-16 -412 -6 -412" stroke={INK} strokeWidth="3" fill="none" />
        </g>
        <g className="fh-turm-arm" style={{ transformOrigin: "24px -400px" }}>
          <path d="M22 -400 L44 -440" stroke="#4361ee" strokeWidth="11" strokeLinecap="round" />
          <circle cx="45" cy="-444" r="7" fill={SKIN} />
        </g>
      </Inside>
      <path d="M-30 -460 L-34 -384 M30 -460 L34 -384" stroke="#adb5bd" strokeWidth="4" />
      <path d="M-56 -456 h10 L-56 -390 h-6 Z" fill="#fff" opacity="0.5" />
      <rect x="-82" y="-474" width="164" height="16" rx="5" fill="#495057" />
      <path d="M0 -474 V-530" stroke="#6c757d" strokeWidth="5" />
      <g className="fh-turm-radar" style={{ transformOrigin: "0px -500px" }}>
        <path d="M-34 -510 Q0 -486 34 -510 L30 -500 Q0 -480 -30 -500 Z" fill="#ced4da" />
      </g>
      <g className="fh-turm-waves" fill="none" stroke="#4cc9f0" strokeWidth="4" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${20 + i * 14} -${560 + i * 6} q${10 + i * 6} ${18 + i * 6} 0 ${36 + i * 12}`} style={nth(i)} />
        ))}
      </g>
      <circle className="fh-turm-glow" cx="0" cy="-534" r="18" fill="#ff8fa3" />
      <circle className="fh-turm-light" cx="0" cy="-534" r="7" fill={RAIL_RED} />
    </>
  );
}

/** The hangar: the big doors slide open and a little plane rolls out to say hello. */
export function Hangar() {
  return (
    <>
      <path d="M-196 -122 Q0 -270 196 -122 Z" fill="#adb5bd" />
      <path d="M-120 -170 Q-112 -200 -100 -210 M-40 -196 V-224 M40 -196 V-224 M120 -170 Q112 -200 100 -210" stroke="#ced4da" strokeWidth="5" fill="none" />
      <rect x="-188" y="-130" width="376" height="130" fill="#dee2e6" />
      <rect x="-188" y="-130" width="376" height="10" fill="#ced4da" />
      <rect x="-140" y="-118" width="280" height="118" fill="#495057" />
      <g className="fh-hangar-plane" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-12 -86 L-4 -112 H4 L12 -86 Z" fill={RAIL_RED} />
        <rect x="-96" y="-70" width="192" height="16" rx="8" fill={RAIL_RED} />
        <circle cx="0" cy="-62" r="30" fill="#fff" />
        <Face cx={0} cy={-68} size={0.8} />
        <path d="M-12 -38 L-30 -16 M12 -38 L30 -16" stroke={STEEL} strokeWidth="5" />
        <circle cx="-30" cy="-12" r="11" fill={INK} />
        <circle cx="30" cy="-12" r="11" fill={INK} />
        <circle cx="0" cy="-50" r="5" fill="#ffd60a" />
        <g className="fh-hangar-prop" style={{ transformOrigin: "0px -50px" }}>
          <rect x="-4" y="-80" width="8" height="60" rx="4" fill={INK} opacity="0.8" />
        </g>
      </g>
      <g className="fh-hangar-door" style={{ transformOrigin: "-140px -60px" }}>
        <rect x="-140" y="-118" width="140" height="118" fill="#e9ecef" />
        <path d="M-140 -94 H0 M-140 -70 H0 M-140 -46 H0 M-140 -22 H0" stroke="#ced4da" strokeWidth="3" />
        <rect x="-16" y="-66" width="8" height="20" rx="3" fill="#adb5bd" />
      </g>
      <g className="fh-hangar-door fh-hangar-door-r" style={{ transformOrigin: "140px -60px" }}>
        <rect x="0" y="-118" width="140" height="118" fill="#e9ecef" />
        <path d="M0 -94 H140 M0 -70 H140 M0 -46 H140 M0 -22 H140" stroke="#ced4da" strokeWidth="3" />
        <rect x="8" y="-66" width="8" height="20" rx="3" fill="#adb5bd" />
      </g>
      <path d="M0 -118 V0" stroke="#adb5bd" strokeWidth="3" />
      <rect x="-60" y="-160" width="120" height="26" rx="6" fill="#3a86ff" />
      <path d="M-40 -147 h22 l8 -6 v12 l-8 -6 M8 -147 h34" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle className="fh-hangar-lamp" cx="-164" cy="-110" r="8" fill="#fff3b0" />
      <circle className="fh-hangar-lamp" cx="164" cy="-110" r="8" fill="#fff3b0" />
    </>
  );
}

const SIGNAL = "#ff6b35";

/** The windsock on its mast: it fills with wind and flutters. */
export function Windsack() {
  const stripes = [0, 1, 2, 3, 4];
  return (
    <>
      <rect x="-5" y="-206" width="10" height="206" rx="4" fill="#ced4da" />
      <path d="M-5 -190 h10 M-5 -150 h10 M-5 -110 h10" stroke={RAIL_RED} strokeWidth="8" />
      <ellipse cx="0" cy="-2" rx="16" ry="5" fill="#868e96" />
      <g className="fh-sack-wind" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-60 - i * 10} ${-226 + i * 24} q20 -8 40 0 t40 0`} style={nth(i)} />
        ))}
      </g>
      <g className="fh-sack-sock" style={{ transformOrigin: "6px -196px" }}>
        {stripes.map((i) => {
          const x1 = 6 + i * 24;
          const x2 = x1 + 24;
          const h1 = 18 - i * 2.4;
          const h2 = 18 - (i + 1) * 2.4;
          return (
            <path
              key={i}
              d={`M${x1} ${-196 - h1} L${x2} ${-196 - h2 + 6 + i * 2} V${-196 + h2 + 6 + i * 2} L${x1} ${-196 + h1} Z`}
              fill={i % 2 ? "#f8f9fa" : SIGNAL}
            />
          );
        })}
        <ellipse cx="6" cy="-196" rx="5" ry="18" fill="#adb5bd" />
      </g>
      <circle cx="0" cy="-208" r="6" fill="#868e96" />
    </>
  );
}

const LAMPS = [-160, -80, 0, 80, 160];

/** The runway lights: they light up one after the other, like a path for the planes. */
export function Lichter() {
  return (
    <>
      {LAMPS.map((x, i) => (
        <g key={x}>
          <circle className="fh-licht-glow" cx={x} cy="-30" r="24" fill="#fff3b0" style={nth(i)} />
          <rect x={x - 3} y="-24" width="6" height="24" fill="#868e96" />
          <rect x={x - 12} y="-4" width="24" height="6" rx="3" fill="#6c757d" />
          <circle cx={x} cy="-30" r="10" fill="#ced4da" />
          <circle className="fh-licht-lamp" cx={x} cy="-30" r="10" fill="#ffd60a" style={nth(i)} />
        </g>
      ))}
    </>
  );
}
