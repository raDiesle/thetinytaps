import { Cloud, Face, INK, Inside, SKIN, nth } from "../shared";
import { Bubbles, Lines } from "./parts";

// Things on and against the back wall. The wall things (window, fan, clock, shelf, toilet
// paper, door) are drawn in picture coordinates; toilet and washing machine have their foot
// at (0, 0) and are placed with TOILET and WASHER.

const WINDOW = "M120 222 V92 Q120 42 170 42 H270 Q320 42 320 92 V222 Z";

/** The window over the tub; both sashes swing open, the curtain flutters and a bird peeks in. */
export function Fenster() {
  return (
    <>
      <Inside d={WINDOW}>
        <rect x="110" y="36" width="220" height="196" fill="#a5d8ff" />
        <circle cx="288" cy="82" r="18" fill="#ffd43b" />
        <Cloud x={150} y={96} scale={0.3} />
        <circle cx="146" cy="222" r="42" fill="#51cf66" />
        <circle cx="210" cy="234" r="38" fill="#69db7c" />
        <circle cx="284" cy="218" r="44" fill="#40c057" />
        <g className="bz-fenster-vogel">
          <path d="M214 200 L198 192 L204 206 Z" fill="#4c6ef5" />
          <ellipse cx="226" cy="200" rx="16" ry="13" fill="#5c7cfa" />
          <circle cx="240" cy="186" r="10" fill="#5c7cfa" />
          <path d="M249 184 L258 188 L249 191 Z" fill="#fab005" />
          <circle cx="243" cy="184" r="2.4" fill={INK} />
          <path d="M218 198 Q226 192 234 200" stroke="#91a7ff" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      </Inside>
      <path d={WINDOW} fill="none" stroke="#fff" strokeWidth="12" />
      {[
        { d: "M120 222 V92 Q120 42 170 42 H220 V222 Z", origin: "120px 130px" },
        { d: "M220 42 H270 Q320 42 320 92 V222 H220 Z", origin: "320px 130px" },
      ].map(({ d, origin }, i) => (
        <g key={i} className="bz-fenster-sash" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={d} fill="#d0ebff" fillOpacity="0.35" stroke="#fff" strokeWidth="8" />
          <path d={i ? "M248 200 L290 70" : "M140 200 L182 70"} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
          <circle cx={i ? 230 : 210} cy="140" r="5" fill="#ced4da" />
        </g>
      ))}
      <g className="bz-fenster-curtain" style={{ transformOrigin: "220px 40px" }}>
        <path
          d="M114 36 H326 V60 q-13 12 -26.5 0 t-26.5 0 t-26.5 0 t-26.5 0 t-26.5 0 t-26.5 0 t-26.5 0 t-26.5 0 Z"
          fill="#ffafcc"
        />
        <path d="M114 44 H326" stroke="#fff" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
      </g>
      <rect x="104" y="220" width="232" height="14" rx="5" fill="#fff" />
      <rect x="108" y="230" width="224" height="5" rx="2" fill="#dee2e6" />
    </>
  );
}

/** Round fan in the wall; its blades whirl and blow the steam away. */
export function Luefter() {
  return (
    <>
      <circle cx="54" cy="62" r="38" fill="#f1f3f5" stroke="#ced4da" strokeWidth="3" />
      <circle cx="54" cy="62" r="30" fill="#868e96" />
      <g className="bz-luefter-blades" style={{ transformOrigin: "54px 62px" }} fill="#ced4da">
        {[0, 90, 180, 270].map((a) => (
          <ellipse key={a} cx="54" cy="46" rx="8" ry="15" transform={`rotate(${a} 54 62)`} />
        ))}
      </g>
      <g fill="none" stroke="#f1f3f5" strokeWidth="3">
        <circle cx="54" cy="62" r="22" />
        <circle cx="54" cy="62" r="13" />
        <path d="M24 62 H84 M54 32 V92" />
      </g>
      <circle cx="54" cy="62" r="6" fill="#f8f9fa" />
      <g className="bz-luefter-air" stroke="#d0ebff" strokeWidth="5" strokeLinecap="round" fill="none">
        {[34, 54, 74].map((x, i) => (
          <path key={x} d={`M${x} 108 q-8 10 0 20 t0 20`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Orange wall clock; it wobbles and its hands go round once. */
export function Uhr() {
  return (
    <>
      <g className="bz-uhr-body" style={{ transformOrigin: "1235px 75px" }}>
        <circle cx="1235" cy="75" r="40" fill="#ff9f1c" />
        <circle cx="1235" cy="75" r="32" fill="#fff" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={1235 + 25 * Math.sin((i * Math.PI) / 6)} cy={75 - 25 * Math.cos((i * Math.PI) / 6)} r={i % 3 ? 1.6 : 3} fill={INK} />
        ))}
        <path className="bz-uhr-hour" d="M1235 75 L1221 66" stroke={INK} strokeWidth="5" strokeLinecap="round" style={{ transformOrigin: "1235px 75px" }} />
        <path className="bz-uhr-minute" d="M1235 75 V52" stroke="#e63946" strokeWidth="3.5" strokeLinecap="round" style={{ transformOrigin: "1235px 75px" }} />
        <circle cx="1235" cy="75" r="4" fill={INK} />
        <path d="M1208 52 Q1218 40 1232 38" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      <Lines x={1282} y={75} colour="#ff9f1c" />
    </>
  );
}

/** A red shampoo bottle on the shelf; it is squeezed, the cap opens and bubbles come out. */
export function Shampoo() {
  return (
    <>
      <g className="bz-shampoo-bottle" style={{ transformOrigin: "1030px 196px" }}>
        <rect x="1022" y="122" width="16" height="14" rx="3" fill="#f1f3f5" />
        <path d="M1010 196 V148 Q1010 134 1022 132 H1038 Q1050 134 1050 148 V196 Z" fill="#e63946" />
        <rect x="1016" y="156" width="28" height="26" rx="5" fill="#fff" />
        <circle cx="1024" cy="166" r="4" fill="#74c0fc" />
        <circle cx="1034" cy="172" r="5" fill="#a5d8ff" />
        <circle cx="1030" cy="162" r="2.5" fill="#74c0fc" />
        <path d="M1016 144 V190" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
      </g>
      <g className="bz-shampoo-cap" style={{ transformOrigin: "1040px 124px" }}>
        <rect x="1019" y="112" width="22" height="13" rx="4" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      </g>
      <Bubbles x={1030} y={104} count={3} spread={16} r={8} />
    </>
  );
}

/** A plant in a pot on the shelf; its leaves rustle and a flower opens. */
export function Pflanze() {
  return (
    <>
      {[-50, -24, 0, 24, 50].map((a, i) => (
        <g key={a} className="bz-pflanze-leaf" style={{ ...nth(i), transformOrigin: "1128px 162px" }}>
          <path d="M1128 162 Q1112 134 1128 104 Q1144 134 1128 162 Z" fill={i % 2 ? "#40c057" : "#51cf66"} transform={`rotate(${a} 1128 162)`} />
          <path d="M1128 158 V114" stroke="#2f9e44" strokeWidth="2" transform={`rotate(${a} 1128 162)`} />
        </g>
      ))}
      <g className="bz-pflanze-flower" style={{ transformOrigin: "1128px 100px" }}>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="1128" cy="88" r="8" fill="#ff8fab" transform={`rotate(${a} 1128 100)`} />
        ))}
        <circle cx="1128" cy="100" r="7" fill="#ffd43b" />
      </g>
      <rect x="1100" y="158" width="56" height="12" rx="4" fill="#c8553d" />
      <path d="M1104 168 H1152 L1146 196 H1110 Z" fill="#e07a5f" />
      <path d="M1112 176 L1114 190" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
    </>
  );
}

/** The toilet paper roll on its holder; it turns and the paper rolls down and up again. */
export function Klopapier() {
  return (
    <>
      <g className="bz-klopapier-sheet" style={{ transformOrigin: "1150px 262px" }}>
        <rect x="1140" y="262" width="22" height="34" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path d="M1140 280 H1162" stroke="#dee2e6" strokeWidth="2" strokeDasharray="3 3" />
      </g>
      <g className="bz-klopapier-roll" style={{ transformOrigin: "1162px 262px" }}>
        <circle cx="1162" cy="262" r="22" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <circle cx="1162" cy="262" r="15" fill="none" stroke="#f1f3f5" strokeWidth="3" />
        <circle cx="1162" cy="262" r="7" fill="#ced4da" />
        <circle cx="1162" cy="246" r="3" fill="#a5d8ff" />
        <circle cx="1176" cy="270" r="3" fill="#ffc9c9" />
      </g>
    </>
  );
}

/** The bathroom door (picture coordinates); someone knocks, the door opens and Mama waves. */
export function Tuer() {
  return (
    <>
      <rect x="1416" y="-10" width="178" height="348" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="3" />
      <Inside d="M1428 0 H1582 V336 H1428 Z">
        <rect x="1428" y="0" width="154" height="336" fill="#ffe8cc" />
        <rect x="1428" y="296" width="154" height="40" fill="#e9b872" />
        <rect x="1530" y="90" width="40" height="50" rx="4" fill="#fff" stroke="#e9b872" strokeWidth="4" />
        <circle cx="1550" cy="112" r="10" fill="#ffd43b" />
        <g className="bz-tuer-mama">
          <path d="M1446 336 V236 Q1446 212 1478 212 Q1510 212 1510 236 V336 Z" fill="#9775fa" />
          <circle cx="1478" cy="182" r="30" fill={SKIN} />
          <path d="M1448 182 Q1446 148 1478 148 Q1510 148 1508 182 Q1498 162 1478 164 Q1458 162 1448 182 Z" fill="#6b4423" />
          <circle cx="1478" cy="146" r="13" fill="#6b4423" />
          <Face cx={1478} cy={184} size={1} />
          <g className="bz-tuer-hand" style={{ transformOrigin: "1508px 246px" }}>
            <path d="M1508 246 L1532 214" stroke="#9775fa" strokeWidth="14" strokeLinecap="round" />
            <circle cx="1534" cy="208" r="10" fill={SKIN} />
          </g>
        </g>
      </Inside>
      <g className="bz-tuer-leaf" style={{ transformOrigin: "1582px 0px" }}>
        <rect x="1428" y="0" width="154" height="336" fill="#e7c8a0" stroke="#d4a373" strokeWidth="3" />
        <rect x="1446" y="20" width="118" height="130" rx="6" fill="none" stroke="#d4a373" strokeWidth="5" />
        <rect x="1446" y="180" width="118" height="136" rx="6" fill="none" stroke="#d4a373" strokeWidth="5" />
        {/* Bathrobe on its hook */}
        <circle cx="1540" cy="70" r="5" fill="#adb5bd" />
        <path d="M1518 72 Q1540 62 1562 72 L1572 196 Q1540 206 1508 196 Z" fill="#ffafcc" />
        <path d="M1540 70 L1532 196" stroke="#ff8fab" strokeWidth="4" />
        <path d="M1510 150 H1570" stroke="#ff8fab" strokeWidth="6" strokeLinecap="round" />
        <g className="bz-tuer-knob" style={{ transformOrigin: "1446px 190px" }}>
          <circle cx="1446" cy="190" r="8" fill="#ffd166" />
          <rect x="1446" y="186" width="22" height="8" rx="4" fill="#ffd166" />
        </g>
      </g>
      <g className="bz-tuer-knock" fill="none" stroke="#a0522d" strokeWidth="4" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${1470 + i * 16} ${236 - i * 4} q8 -10 16 0`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** White toilet; the button is pressed, the lid opens and the water swirls away. */
export function Toilette() {
  return (
    <>
      <rect x="-72" y="-250" width="144" height="84" rx="10" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      <path d="M-58 -238 V-182" stroke="#f1f3f5" strokeWidth="8" strokeLinecap="round" />
      <g className="bz-klo-tanklid" style={{ transformOrigin: "0px -254px" }}>
        <rect x="-80" y="-262" width="160" height="16" rx="6" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      </g>
      <rect className="bz-klo-button" x="-16" y="-271" width="32" height="10" rx="4" fill="#74c0fc" />
      <rect x="-22" y="-170" width="44" height="14" fill="#e9ecef" />
      <ellipse cx="0" cy="-6" rx="50" ry="8" fill="#e9ecef" />
      <path d="M-78 -142 Q-80 -80 -46 -40 L-40 -8 H40 L46 -40 Q80 -80 78 -142 Z" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      <path d="M-60 -120 Q-56 -76 -32 -50" stroke="#f1f3f5" strokeWidth="8" strokeLinecap="round" fill="none" />
      <ellipse cx="0" cy="-146" rx="84" ry="26" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="3" />
      <ellipse cx="0" cy="-144" rx="58" ry="16" fill="#e9ecef" />
      <ellipse cx="0" cy="-142" rx="48" ry="11" fill="#a5d8ff" />
      <g transform="translate(0 -142) scale(1 0.24)">
        <g className="bz-klo-swirl">
          <path d="M0 0 m-6 0 a6 6 0 1 1 12 0 a14 14 0 1 1 -28 0 a24 24 0 1 1 48 0 a34 34 0 1 1 -68 0" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g className="bz-klo-lid" style={{ transformOrigin: "0px -146px" }}>
        <ellipse cx="0" cy="-146" rx="86" ry="28" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
        <ellipse cx="-24" cy="-154" rx="30" ry="7" fill="#f8f9fa" />
        <circle cx="34" cy="-142" r="7" fill="#ffd43b" />
        <circle cx="39" cy="-148" r="4" fill="#ffd43b" />
        <path d="M42 -148 l4 1 l-4 2 Z" fill="#fb8500" />
      </g>
    </>
  );
}

/** Washing machine; the lights blink, the drum turns, it shakes and the door opens. */
export function Waschmaschine() {
  const drum = "M-50 -100 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0 Z";
  return (
    <g className="bz-wm-body">
      <rect x="-82" y="-14" width="22" height="14" rx="4" fill="#868e96" />
      <rect x="60" y="-14" width="22" height="14" rx="4" fill="#868e96" />
      <rect x="-92" y="-226" width="184" height="216" rx="14" fill="#f8f9fa" stroke="#dee2e6" strokeWidth="3" />
      <path d="M-92 -186 H92" stroke="#dee2e6" strokeWidth="3" />
      <rect x="-80" y="-216" width="50" height="22" rx="4" fill="#e9ecef" stroke="#dee2e6" strokeWidth="2" />
      {[8, 24, 40].map((x, i) => (
        <circle key={x} className="bz-wm-light" cx={x} cy="-206" r="5" fill="#69db7c" style={nth(i)} />
      ))}
      <g className="bz-wm-knob" style={{ transformOrigin: "68px -206px" }}>
        <circle cx="68" cy="-206" r="12" fill="#ced4da" stroke="#adb5bd" strokeWidth="2" />
        <path d="M68 -206 V-216" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="0" cy="-100" r="64" fill="#dee2e6" />
      <Inside d={drum}>
        <rect x="-52" y="-152" width="104" height="104" fill="#495057" />
        <g className="bz-wm-drum" style={{ transformOrigin: "0px -100px" }}>
          <path d="M-30 -130 h16 v26 q0 10 10 10 h8 v14 h-22 q-12 0 -12 -12 Z" fill="#e63946" />
          <path d="M6 -134 h30 l10 10 l-8 8 l-4 -4 v26 h-26 v-26 l-4 4 l-8 -8 Z" fill="#ffd43b" />
          <path d="M-20 -78 h34 v30 h-14 v-14 h-6 v14 h-14 Z" fill="#51cf66" />
          <circle cx="30" cy="-74" r="10" fill="#fff" opacity="0.7" />
        </g>
        <rect x="-52" y="-92" width="104" height="44" fill="#4dabf7" opacity="0.55" />
      </Inside>
      <g className="bz-wm-door" style={{ transformOrigin: "-64px -100px" }}>
        <circle cx="0" cy="-100" r="56" fill="#d0ebff" fillOpacity="0.3" stroke="#adb5bd" strokeWidth="12" />
        <path d="M-30 -130 Q-16 -146 6 -148" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.7" />
        <rect x="52" y="-114" width="12" height="28" rx="5" fill="#868e96" />
      </g>
      <Bubbles x={-55} y={-232} count={3} spread={20} r={10} />
    </g>
  );
}
