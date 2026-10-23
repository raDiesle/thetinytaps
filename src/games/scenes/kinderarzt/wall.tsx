import { Cloud, Eye, Face, INK, Inside, SKIN, STEEL, heartPath, nth, side, sparklePath } from "../shared";
import { Bubbles, Lid, Lines, Notes, Plaster, Sparkles } from "./parts";

// Things on the back wall and hanging from the ceiling, all drawn in picture coordinates.

const PANE = "M122 56 H318 V208 H122 Z";

/** The waiting room window; both sashes swing open, the curtains flutter and a bird peeks in. */
export function Fenster() {
  return (
    <>
      <rect x="110" y="44" width="220" height="176" rx="8" fill="#fff" />
      <Inside d={PANE}>
        <rect x="118" y="50" width="206" height="164" fill="#a5d8ff" />
        <circle cx="286" cy="88" r="18" fill="#ffd43b" />
        <Cloud x={150} y={96} scale={0.28} />
        <circle cx="140" cy="210" r="40" fill="#69db7c" />
        <circle cx="210" cy="222" r="36" fill="#51cf66" />
        <circle cx="290" cy="206" r="42" fill="#40c057" />
        <g className="ka-fenster-vogel">
          <path d="M214 194 L198 186 L204 200 Z" fill="#e8590c" />
          <ellipse cx="226" cy="194" rx="16" ry="13" fill="#ff922b" />
          <circle cx="240" cy="180" r="10" fill="#ff922b" />
          <path d="M249 178 L258 182 L249 185 Z" fill="#fab005" />
          <circle cx="243" cy="178" r="2.4" fill={INK} />
          <path d="M218 192 Q226 186 234 194" stroke="#ffc078" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
      </Inside>
      {[
        { d: "M122 56 H220 V208 H122 Z", origin: "122px 132px" },
        { d: "M220 56 H318 V208 H220 Z", origin: "318px 132px" },
      ].map(({ d, origin }, i) => (
        <g key={i} className="ka-fenster-sash" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={d} fill="#d0ebff" fillOpacity="0.3" stroke="#fff" strokeWidth="8" />
          <path d={i ? "M246 190 L286 74" : "M140 190 L180 74"} stroke="#fff" strokeWidth="7" strokeLinecap="round" opacity="0.5" />
          <rect x={i ? 226 : 206} y="124" width="8" height="18" rx="3" fill="#ced4da" />
        </g>
      ))}
      {/* Curtains on both sides */}
      {[
        { d: "M108 40 H152 Q148 130 160 214 Q132 222 108 214 Z", origin: "130px 40px" },
        { d: "M332 40 H288 Q292 130 280 214 Q308 222 332 214 Z", origin: "310px 40px" },
      ].map(({ d, origin }, i) => (
        <g key={i} className="ka-fenster-curtain" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={d} fill="#ffc9de" />
          <path d={i ? "M318 48 Q316 130 304 208" : "M122 48 Q124 130 136 208"} stroke="#fff" strokeWidth="4" strokeDasharray="3 10" strokeLinecap="round" fill="none" opacity="0.8" />
        </g>
      ))}
      <rect x="100" y="34" width="240" height="9" rx="4" fill={STEEL} />
      <rect x="102" y="214" width="236" height="14" rx="5" fill="#fff" />
      <rect x="106" y="224" width="228" height="5" rx="2" fill="#dee2e6" />
      <g className="ka-fenster-breeze" fill="none" stroke="#a5d8ff" strokeWidth="5" strokeLinecap="round">
        {[100, 140, 180].map((y, i) => (
          <path key={y} d={`M226 ${y} q20 -8 40 0 t40 0`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A wooden jumping jack bunny on a nail; the string is pulled and arms and legs fly up. */
export function Hampelmann() {
  return (
    <>
      <circle cx="65" cy="58" r="4" fill={STEEL} />
      <path d="M65 58 V84" stroke="#868e96" strokeWidth="2" />
      <g className="ka-hampel-body" style={{ transformOrigin: "65px 58px" }}>
        {/* Legs behind the body */}
        {[
          { s: 1 as const, x: 57, d: "M57 168 L48 204" },
          { s: -1 as const, x: 73, d: "M73 168 L82 204" },
        ].map(({ s, x, d }, i) => (
          <g key={x} className="ka-hampel-leg" style={{ ...side(s), ...nth(i), transformOrigin: `${x}px 168px` }}>
            <path d={d} stroke="#4dabf7" strokeWidth="13" strokeLinecap="round" />
            <ellipse cx={s === 1 ? 46 : 84} cy="208" rx="10" ry="7" fill="#e64980" />
          </g>
        ))}
        {[
          { s: 1 as const, x: 51, d: "M51 128 L34 160" },
          { s: -1 as const, x: 79, d: "M79 128 L96 160" },
        ].map(({ s, x, d }, i) => (
          <g key={x} className="ka-hampel-arm" style={{ ...side(s), ...nth(i), transformOrigin: `${x}px 128px` }}>
            <path d={d} stroke="#ff8787" strokeWidth="12" strokeLinecap="round" />
            <circle cx={s === 1 ? 32 : 98} cy="164" r="7" fill="#fff" />
          </g>
        ))}
        <ellipse cx="65" cy="146" rx="19" ry="27" fill="#ff8787" />
        <path d="M52 132 Q50 146 54 160" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" />
        <circle cx="65" cy="138" r="3.5" fill="#ffd43b" />
        <circle cx="65" cy="152" r="3.5" fill="#ffd43b" />
        <g className="ka-hampel-ear" style={{ ...nth(0), transformOrigin: "57px 92px" }}>
          <ellipse cx="55" cy="74" rx="7" ry="18" fill="#fff" />
          <ellipse cx="55" cy="76" rx="3.5" ry="12" fill="#ffc9de" />
        </g>
        <g className="ka-hampel-ear" style={{ ...nth(1), transformOrigin: "73px 92px" }}>
          <ellipse cx="75" cy="74" rx="7" ry="18" fill="#fff" />
          <ellipse cx="75" cy="76" rx="3.5" ry="12" fill="#ffc9de" />
        </g>
        <circle cx="65" cy="104" r="20" fill="#fff" />
        <Face cx={65} cy={102} size={0.75} />
        <ellipse cx="65" cy="108" rx="3" ry="2.2" fill="#ff8fa3" />
      </g>
      <g className="ka-hampel-pull">
        <path d="M65 172 V222" stroke="#868e96" strokeWidth="2" />
        <circle cx="65" cy="226" r="7" fill="#fab005" />
      </g>
    </>
  );
}

/** A mobile with a cloud, a star and a moon; it turns, the pieces swing and a tune plays. */
export function Mobile() {
  const pieces = [
    { x: 366, len: 64 },
    { x: 420, len: 92 },
    { x: 474, len: 56 },
  ];
  return (
    <>
      <path d="M420 0 V28" stroke="#868e96" strokeWidth="2.5" />
      <g className="ka-mobile-bar" style={{ transformOrigin: "420px 28px" }}>
        <path d="M362 38 Q420 22 478 38" stroke="#c88b3a" strokeWidth="5" strokeLinecap="round" fill="none" />
        {pieces.map(({ x, len }, i) => (
          <g key={x} className="ka-mobile-piece" style={{ ...nth(i), transformOrigin: `${x}px 34px` }}>
            <path d={`M${x} 34 V${34 + len}`} stroke="#868e96" strokeWidth="2" />
            {i === 0 && (
              <g fill="#fff" stroke="#a5d8ff" strokeWidth="2">
                <path d={`M${x - 22} ${len + 52} a12 12 0 0 1 8 -20 a14 14 0 0 1 26 -2 a11 11 0 0 1 10 22 Z`} />
              </g>
            )}
            {i === 1 && <path d={sparklePath(x, 34 + len + 16, 18)} fill="#ffd43b" stroke="#fab005" strokeWidth="2" />}
            {i === 2 && <path d={`M${x + 6} ${34 + len} a18 18 0 1 0 12 28 a14 14 0 1 1 -12 -28 Z`} fill="#b197fc" />}
          </g>
        ))}
      </g>
      <Notes x={420} y={40} colour="#b197fc" size={0.7} />
    </>
  );
}

/** The orange wall clock over the desk; it wobbles and its hands whirl round. */
export function Uhr() {
  return (
    <>
      <g className="ka-uhr-body" style={{ transformOrigin: "620px 86px" }}>
        <circle cx="620" cy="86" r="42" fill="#ff922b" />
        <circle cx="620" cy="86" r="33" fill="#fff" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={620 + 26 * Math.sin((i * Math.PI) / 6)} cy={86 - 26 * Math.cos((i * Math.PI) / 6)} r={i % 3 ? 1.6 : 3} fill={INK} />
        ))}
        <path d="M610 100 Q620 106 630 100" stroke="#ffa8a8" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="ka-uhr-hour" d="M620 86 L606 78" stroke={INK} strokeWidth="5" strokeLinecap="round" style={{ transformOrigin: "620px 86px" }} />
        <path className="ka-uhr-minute" d="M620 86 V62" stroke="#e03131" strokeWidth="3.5" strokeLinecap="round" style={{ transformOrigin: "620px 86px" }} />
        <circle cx="620" cy="86" r="4" fill={INK} />
        <path d="M592 62 Q602 50 616 48" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      <Lines x={668} y={86} colour="#ff922b" />
    </>
  );
}

/** The door to the practice; someone knocks, the handle turns, it opens and a child and its Mama wave. */
export function Tuer() {
  return (
    <>
      <rect x="770" y="40" width="145" height="292" rx="4" fill="#fff" />
      {/* The hallway behind the door */}
      <rect x="782" y="52" width="121" height="280" fill="#e5dbff" />
      <rect x="782" y="296" width="121" height="36" fill="#d0bfff" />
      <rect x="782" y="52" width="121" height="10" fill="#d0bfff" />
      <g className="ka-tuer-mama">
        <rect x="796" y="166" width="48" height="140" rx="20" fill="#20c997" />
        <rect x="806" y="150" width="14" height="20" fill={SKIN} />
        <circle cx="820" cy="134" r="24" fill={SKIN} />
        <path d="M796 136 Q794 106 820 106 Q846 106 844 136 Q836 116 820 118 Q804 116 796 136 Z" fill="#e8590c" />
        <Face cx={820} cy={134} size={0.85} />
        <g className="ka-tuer-mama-arm" style={{ transformOrigin: "800px 180px" }}>
          <path d="M800 180 L788 136" stroke="#20c997" strokeWidth="13" strokeLinecap="round" />
          <circle cx="787" cy="132" r="8" fill={SKIN} />
        </g>
      </g>
      <g className="ka-tuer-kind">
        <rect x="842" y="240" width="40" height="62" rx="14" fill="#ffd43b" />
        <rect x="848" y="296" width="12" height="30" rx="5" fill="#4dabf7" />
        <rect x="864" y="296" width="12" height="30" rx="5" fill="#4dabf7" />
        <circle cx="862" cy="220" r="21" fill={SKIN} />
        <path d="M841 218 Q842 196 862 196 Q882 196 883 218 Q874 204 862 206 Q850 204 841 218 Z" fill="#6b4423" />
        <Face cx={862} cy={220} size={0.75} />
        <g className="ka-tuer-kind-arm" style={{ transformOrigin: "880px 250px" }}>
          <path d="M880 250 L894 216" stroke="#ffd43b" strokeWidth="11" strokeLinecap="round" />
          <circle cx="895" cy="212" r="7" fill={SKIN} />
        </g>
      </g>
      {/* The door leaf, on its hinge at the left */}
      <g className="ka-tuer-leaf" style={{ transformOrigin: "782px 190px" }}>
        <rect x="782" y="52" width="121" height="280" fill="#74c0fc" />
        <rect x="794" y="168" width="97" height="140" rx="6" fill="none" stroke="#a5d8ff" strokeWidth="5" />
        <circle cx="842" cy="112" r="30" fill="#fff" />
        <circle cx="842" cy="112" r="24" fill="#d0ebff" />
        <path d="M828 104 Q836 92 848 92" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* A sun sign and star stickers */}
        <circle cx="842" cy="214" r="17" fill="#ffd43b" />
        <Face cx={842} cy={212} size={0.6} />
        <path d={sparklePath(812, 270, 9)} fill="#fff" />
        <path d={sparklePath(872, 284, 7)} fill="#ffe066" />
        <path d="M788 56 V328" stroke="#fff" strokeWidth="4" opacity="0.35" />
        <g className="ka-tuer-handle" style={{ transformOrigin: "888px 200px" }}>
          <circle cx="888" cy="200" r="6" fill="#ced4da" />
          <rect x="870" y="196" width="20" height="8" rx="4" fill="#dee2e6" />
        </g>
      </g>
      <Lines x={924} y={210} colour="#74c0fc" />
    </>
  );
}

/** The eye chart with pictures instead of letters; one after another they pop up big. */
export function Sehtafel() {
  const symbols = [
    { x: 980, y: 98, r: 22, kind: "sun" },
    { x: 958, y: 148, r: 14, kind: "house" },
    { x: 1002, y: 148, r: 14, kind: "car" },
    { x: 952, y: 190, r: 9, kind: "fish" },
    { x: 980, y: 190, r: 9, kind: "heart" },
    { x: 1008, y: 190, r: 9, kind: "star" },
    { x: 952, y: 224, r: 6, kind: "ball" },
    { x: 971, y: 224, r: 6, kind: "apple" },
    { x: 990, y: 224, r: 6, kind: "flower" },
    { x: 1009, y: 224, r: 6, kind: "ball2" },
  ];
  return (
    <>
      <g className="ka-tafel-board" style={{ transformOrigin: "980px 56px" }}>
        <path d="M966 56 L980 40 L994 56" stroke={STEEL} strokeWidth="3" fill="none" />
        <circle cx="980" cy="40" r="4" fill={STEEL} />
        <rect x="930" y="56" width="100" height="192" rx="8" fill="#fff" stroke="#a5d8ff" strokeWidth="5" />
        <path d="M940 124 H1020 M940 170 H1020 M940 208 H1020" stroke="#e7f5ff" strokeWidth="3" />
        {symbols.map(({ x, y, r, kind }, i) => (
          <g key={kind} className="ka-tafel-sym" style={nth(i)}>
            {kind === "sun" && (
              <>
                {Array.from({ length: 8 }, (_, k) => (
                  <path
                    key={k}
                    d={`M${x + r * 1.15 * Math.cos((k * Math.PI) / 4)} ${y + r * 1.15 * Math.sin((k * Math.PI) / 4)} L${x + r * 1.5 * Math.cos((k * Math.PI) / 4)} ${y + r * 1.5 * Math.sin((k * Math.PI) / 4)}`}
                    stroke="#fab005"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                ))}
                <circle cx={x} cy={y} r={r} fill="#ffd43b" />
                <Face cx={x} cy={y - 2} size={0.7} />
              </>
            )}
            {kind === "house" && (
              <>
                <path d={`M${x - r} ${y + r} V${y - r * 0.1} L${x} ${y - r} L${x + r} ${y - r * 0.1} V${y + r} Z`} fill="#ff8787" />
                <rect x={x - r * 0.3} y={y + r * 0.2} width={r * 0.6} height={r * 0.8} fill="#fff" />
              </>
            )}
            {kind === "car" && (
              <>
                <path d={`M${x - r * 1.2} ${y + r * 0.5} V${y} L${x - r * 0.6} ${y - r * 0.7} H${x + r * 0.5} L${x + r * 1.2} ${y} V${y + r * 0.5} Z`} fill="#4dabf7" />
                <circle cx={x - r * 0.6} cy={y + r * 0.6} r={r * 0.32} fill={INK} />
                <circle cx={x + r * 0.6} cy={y + r * 0.6} r={r * 0.32} fill={INK} />
              </>
            )}
            {kind === "fish" && (
              <>
                <ellipse cx={x} cy={y} rx={r} ry={r * 0.65} fill="#ff922b" />
                <path d={`M${x + r * 0.8} ${y} L${x + r * 1.5} ${y - r * 0.6} V${y + r * 0.6} Z`} fill="#ff922b" />
              </>
            )}
            {kind === "heart" && <path d={heartPath(x, y, r)} fill="#f06595" />}
            {kind === "star" && <path d={sparklePath(x, y, r * 1.3)} fill="#fab005" />}
            {kind === "ball" && <circle cx={x} cy={y} r={r} fill="#51cf66" />}
            {kind === "apple" && <circle cx={x} cy={y} r={r} fill="#fa5252" />}
            {kind === "flower" && <circle cx={x} cy={y} r={r} fill="#cc5de8" />}
            {kind === "ball2" && <circle cx={x} cy={y} r={r} fill="#339af0" />}
          </g>
        ))}
      </g>
      <Sparkles x={980} y={46} count={3} spread={44} r={9} />
    </>
  );
}

/** The giraffe height chart; the head plate slides down and up, the giraffe nods and blinks. */
export function Messlatte() {
  const spots = [
    [1206, 286, 7],
    [1222, 296, 5],
    [1196, 300, 5],
    [1226, 240, 5],
    [1222, 200, 6],
    [1228, 160, 5],
    [1222, 122, 6],
    [1228, 88, 4],
  ];
  return (
    <>
      {/* Wooden ruler with marks */}
      <rect x="1170" y="24" width="20" height="306" rx="4" fill="#ffe8cc" stroke="#e9b872" strokeWidth="2" />
      {Array.from({ length: 15 }, (_, i) => (
        <path key={i} d={`M1172 ${40 + i * 20} h${i % 2 ? 7 : 13}`} stroke="#c88b3a" strokeWidth="2" />
      ))}
      {/* The giraffe painted on the wall */}
      <g className="ka-giraffe-body">
        <path d="M1194 300 V328 M1212 302 V328 M1232 300 V328" stroke="#fcc419" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="1214" cy="290" rx="30" ry="20" fill="#ffd43b" />
        <path d="M1212 280 L1218 92 L1240 92 L1236 282 Z" fill="#ffd43b" />
        {spots.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#f08c00" opacity="0.8" />
        ))}
        <path className="ka-giraffe-tail" d="M1186 284 Q1176 296 1180 310" stroke="#fcc419" strokeWidth="4" strokeLinecap="round" fill="none" style={{ transformOrigin: "1186px 284px" }} />
      </g>
      <g className="ka-giraffe-head" style={{ transformOrigin: "1230px 96px" }}>
        <path d="M1222 46 V30 M1238 46 V30" stroke="#f08c00" strokeWidth="4" strokeLinecap="round" />
        <circle cx="1222" cy="28" r="4" fill="#e8590c" />
        <circle cx="1238" cy="28" r="4" fill="#e8590c" />
        <g className="ka-giraffe-ear" style={{ ...nth(0), transformOrigin: "1214px 54px" }}>
          <ellipse cx="1206" cy="52" rx="10" ry="5" fill="#fcc419" />
        </g>
        <g className="ka-giraffe-ear" style={{ ...nth(1), transformOrigin: "1246px 54px" }}>
          <ellipse cx="1254" cy="52" rx="10" ry="5" fill="#fcc419" />
        </g>
        <ellipse cx="1230" cy="66" rx="20" ry="24" fill="#ffd43b" />
        <ellipse cx="1230" cy="82" rx="14" ry="10" fill="#ffe066" />
        <circle cx="1225" cy="84" r="2" fill="#c88b3a" />
        <circle cx="1235" cy="84" r="2" fill="#c88b3a" />
        <Eye cx={1222} cy={62} r={3.6} />
        <Eye cx={1238} cy={62} r={3.6} />
        <Lid cx={1222} cy={62} r={3.6} fill="#ffd43b" />
        <Lid cx={1238} cy={62} r={3.6} fill="#ffd43b" />
        <circle cx="1214" cy="74" r="4" fill="#ff8fa3" opacity="0.6" />
        <circle cx="1246" cy="74" r="4" fill="#ff8fa3" opacity="0.6" />
      </g>
      {/* The sliding head plate */}
      <g className="ka-messlatte-plate">
        <rect x="1146" y="18" width="48" height="10" rx="3" fill="#ff922b" />
        <rect x="1186" y="12" width="10" height="22" rx="3" fill="#e8590c" />
      </g>
      <Sparkles x={1170} y={160} count={3} spread={30} r={8} />
    </>
  );
}

/** The wall cupboard over the sink; both doors swing open and the bandages and plasters hop. */
export function Schrank() {
  return (
    <>
      <rect x="1275" y="26" width="180" height="126" rx="8" fill="#e9ecef" />
      <rect x="1283" y="34" width="164" height="110" fill="#f8f9fa" />
      <rect x="1283" y="88" width="164" height="5" fill="#dee2e6" />
      {/* Top shelf: bandage rolls and a jar of cotton balls */}
      {[1306, 1336, 1366].map((x, i) => (
        <g key={x} className="ka-schrank-roll" style={nth(i)}>
          <rect x={x - 12} y="56" width="24" height="32" rx="4" fill="#fff" stroke="#ced4da" strokeWidth="2" />
          <path d={`M${x - 12} 66 h24 M${x - 12} 76 h24`} stroke="#e9ecef" strokeWidth="2" />
        </g>
      ))}
      <g className="ka-schrank-jar" style={nth(3)}>
        <rect x="1396" y="50" width="36" height="38" rx="6" fill="#d0ebff" fillOpacity="0.8" stroke="#a5d8ff" strokeWidth="2" />
        {[
          [1406, 76],
          [1420, 78],
          [1412, 64],
          [1424, 64],
        ].map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r="7" fill="#fff" />
        ))}
        <rect x="1394" y="44" width="40" height="8" rx="3" fill="#4dabf7" />
      </g>
      {/* Bottom shelf: plaster boxes */}
      {[
        { x: 1296, w: 40, c: "#ff8787" },
        { x: 1342, w: 34, c: "#ffd43b" },
        { x: 1382, w: 44, c: "#69db7c" },
      ].map(({ x, w, c }, i) => (
        <g key={x} className="ka-schrank-box" style={nth(i)}>
          <rect x={x} y="108" width={w} height="36" rx="4" fill={c} />
          <Plaster x={x + w / 2} y={124} w={w * 0.7} angle={-15} />
        </g>
      ))}
      {/* The doors, each on its hinge */}
      {[
        { x: 1281, hinge: 1281, knob: 1354 },
        { x: 1365, hinge: 1449, knob: 1376 },
      ].map(({ x, hinge, knob }, i) => (
        <g key={x} className="ka-schrank-door" style={{ ...nth(i), transformOrigin: `${hinge}px 89px` }}>
          <rect x={x} y="32" width="84" height="114" rx="5" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
          <rect x={x + 9} y="41" width="66" height="96" rx="4" fill="none" stroke="#e9ecef" strokeWidth="3" />
          <rect x={knob - 3} y="78" width="6" height="22" rx="3" fill={STEEL} />
          {i === 0 ? (
            <path d="M1311 82 h10 v-10 h10 v10 h10 v10 h-10 v10 h-10 v-10 h-10 Z" fill="#40c057" />
          ) : (
            <path d={heartPath(1407, 88, 14)} fill="#ff8787" />
          )}
        </g>
      ))}
      <rect x="1271" y="22" width="188" height="10" rx="4" fill="#ced4da" />
      <Lines x={1466} y={88} colour="#adb5bd" />
    </>
  );
}

/** The soap dispenser next to the sink; the lever is pressed and soap foam comes out. */
export function Seifenspender() {
  return (
    <>
      <rect x="1270" y="174" width="22" height="8" rx="3" fill={STEEL} />
      <g className="ka-seife-body" style={{ transformOrigin: "1281px 182px" }}>
        <rect x="1262" y="180" width="38" height="62" rx="9" fill="#fff" stroke="#dee2e6" strokeWidth="2.5" />
        <rect x="1270" y="192" width="22" height="30" rx="5" fill="#fcc2d7" />
        <rect x="1270" y="206" width="22" height="16" rx="4" fill="#f783ac" />
        <path d="M1274 196 V218" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <rect x="1277" y="242" width="8" height="8" rx="2" fill="#ced4da" />
      </g>
      <g className="ka-seife-lever" style={{ transformOrigin: "1264px 236px" }}>
        <rect x="1262" y="234" width="38" height="8" rx="4" fill="#74c0fc" />
      </g>
      <g className="ka-seife-foam">
        <circle cx="1281" cy="258" r="7" fill="#fff" stroke="#fcc2d7" strokeWidth="2" />
        <circle cx="1275" cy="262" r="5" fill="#fff" stroke="#fcc2d7" strokeWidth="2" />
        <circle cx="1288" cy="262" r="5" fill="#fff" stroke="#fcc2d7" strokeWidth="2" />
      </g>
      <Bubbles x={1281} y={190} count={3} spread={14} r={6} />
    </>
  );
}

/** The exam lamp on its swing arm over the couch; it swings down and its light goes on. */
export function Lampe() {
  return (
    <>
      <rect x="1584" y="42" width="16" height="36" rx="4" fill={STEEL} />
      <g className="ka-lampe-arm" style={{ transformOrigin: "1592px 60px" }}>
        <path d="M1592 60 L1534 78" stroke="#ced4da" strokeWidth="9" strokeLinecap="round" />
        <circle cx="1534" cy="78" r="7" fill={STEEL} />
        <g className="ka-lampe-head" style={{ transformOrigin: "1534px 78px" }}>
          <path d="M1534 78 L1508 108" stroke="#ced4da" strokeWidth="8" strokeLinecap="round" />
          <g className="ka-lampe-light">
            <path d="M1474 150 L1420 268 H1556 L1520 150 Z" fill="#fff9db" opacity="0.6" />
          </g>
          <path d="M1468 150 Q1468 108 1500 104 Q1530 104 1528 150 Z" fill="#4dabf7" />
          <path d="M1478 136 Q1482 116 1498 112" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.5" />
          <ellipse cx="1498" cy="150" rx="30" ry="8" fill="#e7f5ff" />
          <ellipse className="ka-lampe-bulb" cx="1498" cy="150" rx="22" ry="5" fill="#ffe066" />
        </g>
      </g>
      <Sparkles x={1498} y={176} count={3} spread={34} r={8} colour="#ffe066" />
    </>
  );
}
