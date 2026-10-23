import { Hideout } from "../hideout";
import { Cloud, Eye, INK, Inside, STEEL, nth } from "../shared";
import { CUPBOARD, CUPBOARD_DARK } from "./background";
import { Lines, Notes, Steam } from "./parts";

// Things on the back wall and the fridge, all drawn in picture coordinates.

/** A wall cupboard's door on its hinge at `hinge`; it swings open while the item plays. */
function WallDoor({ x, y, w, h, hinge, cls, i }: { x: number; y: number; w: number; h: number; hinge: "left" | "right"; cls: string; i: number }) {
  const hx = hinge === "left" ? x : x + w;
  return (
    <g className={cls} style={{ ...nth(i), transformOrigin: `${hx}px ${y + h / 2}px` }}>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={CUPBOARD} stroke={CUPBOARD_DARK} strokeWidth="3" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx="5" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" />
      <circle cx={hinge === "left" ? x + w - 16 : x + 16} cy={y + h - 18} r="6" fill="#ffd166" stroke="#e9a23b" strokeWidth="2" />
    </g>
  );
}

/** A mug on a shelf, standing on (x, y). */
function Mug({ x, y, colour }: { x: number; y: number; colour: string }) {
  return (
    <>
      <path d={`M${x + 12} ${y - 22} q12 0 12 10 q0 10 -12 8`} stroke={colour} strokeWidth="5" fill="none" />
      <rect x={x - 14} y={y - 28} width="28" height="28" rx="5" fill={colour} />
      <rect x={x - 9} y={y - 24} width="5" height="18" rx="2" fill="#fff" opacity="0.45" />
    </>
  );
}

/** The wall cupboard on the left; both doors swing open and the mugs and plates clink. */
export function Schrank() {
  return (
    <>
      <rect x="16" y="8" width="320" height="104" rx="6" fill={CUPBOARD_DARK} />
      <rect x="22" y="14" width="308" height="94" fill="#fff9ec" />
      <rect x="22" y="58" width="308" height="6" fill="#e9d8b4" />
      {[60, 110, 160, 210].map((x, i) => (
        <g key={x} className="kc-schrank-cup" style={nth(i)}>
          <Mug x={x} y={58} colour={["#ff6b6b", "#4dabf7", "#ffd43b", "#51cf66"][i]} />
        </g>
      ))}
      <g className="kc-schrank-plates" style={{ transformOrigin: "280px 104px" }}>
        {[0, 1, 2, 3].map((k) => (
          <ellipse key={k} cx="280" cy={102 - k * 8} rx="36" ry="7" fill={k % 2 ? "#fff" : "#a5d8ff"} stroke="#74c0fc" strokeWidth="2" />
        ))}
      </g>
      {[48, 92, 136].map((x, i) => (
        <g key={x} className="kc-schrank-bowl" style={nth(i)}>
          <path d={`M${x - 18} 90 Q${x - 18} 106 ${x} 106 Q${x + 18} 106 ${x + 18} 90 Z`} fill={["#ffa94d", "#da77f2", "#69db7c"][i]} />
        </g>
      ))}
      <WallDoor x={20} y={10} w={154} h={100} hinge="left" cls="kc-schrank-door" i={0} />
      <WallDoor x={178} y={10} w={154} h={100} hinge="right" cls="kc-schrank-door" i={1} />
      <rect x="12" y="2" width="328" height="10" rx="4" fill={CUPBOARD_DARK} />
      <Lines x={344} y={60} colour="#74c0fc" />
    </>
  );
}

const PANE = "M380 30 H560 V166 H380 Z";

/** The window over the sink; both sashes swing open and the curtain flutters in the breeze. */
export function Fenster() {
  return (
    <>
      <rect x="366" y="16" width="208" height="164" rx="6" fill="#fff" />
      <Inside d={PANE}>
        <rect x="376" y="26" width="190" height="146" fill="#a5d8ff" />
        <circle cx="530" cy="62" r="18" fill="#ffd43b" />
        <Cloud x={400} y={70} scale={0.28} />
        {/* Garden: hedge and an apple tree */}
        <circle cx="400" cy="172" r="36" fill="#69db7c" />
        <circle cx="470" cy="180" r="34" fill="#51cf66" />
        <circle cx="540" cy="168" r="40" fill="#40c057" />
        <g className="kc-fenster-leaves" style={{ transformOrigin: "376px 150px" }}>
          <path d="M376 150 Q420 140 466 152" stroke="#8d5a3b" strokeWidth="7" strokeLinecap="round" fill="none" />
          {[392, 420, 448].map((x, i) => (
            <ellipse key={x} cx={x} cy={140 - (i % 2) * 6} rx="11" ry="6" fill="#2f9e44" transform={`rotate(-25 ${x} ${140 - (i % 2) * 6})`} />
          ))}
        </g>
      </Inside>
      {[
        { d: "M380 30 H470 V166 H380 Z", origin: "380px 98px" },
        { d: "M470 30 H560 V166 H470 Z", origin: "560px 98px" },
      ].map(({ d, origin }, i) => (
        <g key={i} className="kc-fenster-sash" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={d} fill="#d0ebff" fillOpacity="0.25" stroke="#fff" strokeWidth="8" />
          <path d={i ? "M500 150 L530 50" : "M396 150 L426 50"} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
          <circle cx={i ? 482 : 458} cy="100" r="4.5" fill="#ced4da" />
        </g>
      ))}
      {/* Curtains on a rod */}
      <rect x="352" y="8" width="236" height="7" rx="3" fill="#c8553d" />
      <g className="kc-fenster-curtain" style={{ ...nth(0), transformOrigin: "372px 12px" }}>
        <path d="M356 12 H404 Q398 60 404 108 Q380 116 356 108 Z" fill="#ff8787" />
        <path d="M366 16 V104 M384 16 Q380 60 386 108" stroke="#ffc9c9" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      </g>
      <g className="kc-fenster-curtain" style={{ ...nth(1), transformOrigin: "568px 12px" }}>
        <path d="M584 12 H536 Q542 60 536 108 Q560 116 584 108 Z" fill="#ff8787" />
        <path d="M574 16 V104 M556 16 Q560 60 554 108" stroke="#ffc9c9" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" fill="none" />
      </g>
      {/* Window sill */}
      <rect x="356" y="166" width="228" height="12" rx="4" fill="#fff" />
      <rect x="360" y="175" width="220" height="4" rx="2" fill="#dee2e6" />
      <g className="kc-fenster-breeze" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none">
        {[60, 90, 120].map((y, i) => (
          <path key={y} d={`M430 ${y} q14 -8 28 0 t28 0`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A little yellow bird on the branch outside the window; it hops, flaps and sings. */
export function Vogel() {
  return (
    <>
      <Inside d={PANE}>
        <g transform="translate(-10 0)">
        <g className="kc-vogel-body" style={{ transformOrigin: "430px 144px" }}>
          <path d="M412 132 L396 128 L404 140 Z" fill="#fab005" />
          <ellipse cx="424" cy="132" rx="16" ry="13" fill="#ffd43b" />
          <circle cx="438" cy="118" r="10" fill="#ffd43b" />
          <path d="M430 110 Q438 104 446 112" stroke="#4dabf7" strokeWidth="6" strokeLinecap="round" fill="none" />
          <g className="kc-vogel-beak" style={{ transformOrigin: "447px 118px" }}>
            <path d="M446 115 L456 118 L446 121 Z" fill="#f76707" />
          </g>
          <Eye cx={441} cy={116} r={2.4} />
          <g className="kc-vogel-wing" style={{ transformOrigin: "424px 126px" }}>
            <path d="M412 128 Q424 118 434 130 Q424 142 412 128 Z" fill="#fcc419" />
          </g>
          <path d="M422 145 V150 M430 145 V150" stroke="#f76707" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        </g>
      </Inside>
      <Notes x={452} y={84} colour="#f59f00" size={0.7} />
    </>
  );
}

/** A flower pot on the window sill; the leaves rustle and the flower opens. */
export function Blume() {
  return (
    <>
      {[-40, -14, 14, 40].map((a, i) => (
        <g key={a} className="kc-blume-leaf" style={{ ...nth(i), transformOrigin: "538px 146px" }}>
          <path d="M538 146 Q526 126 538 104 Q550 126 538 146 Z" fill={i % 2 ? "#40c057" : "#51cf66"} transform={`rotate(${a} 538 146)`} />
        </g>
      ))}
      <path d="M538 146 V100" stroke="#2f9e44" strokeWidth="3" />
      <g className="kc-blume-flower" style={{ transformOrigin: "538px 98px" }}>
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx="538" cy="88" r="7" fill="#f783ac" transform={`rotate(${a} 538 98)`} />
        ))}
        <circle cx="538" cy="98" r="6" fill="#ffd43b" />
      </g>
      <rect x="518" y="140" width="40" height="9" rx="3" fill="#c8553d" />
      <path d="M521 148 H555 L551 168 H525 Z" fill="#e07a5f" />
      <path d="M528 152 L529 164" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.35" />
    </>
  );
}

/** The kitchen clock: a round red clock that wobbles while its hands go round once. */
export function Uhr() {
  const cx = 646;
  const cy = 62;
  return (
    <>
      <g className="kc-uhr-body" style={{ transformOrigin: `${cx}px ${cy - 34}px` }}>
        <circle cx={cx} cy={cy} r="36" fill="#ff6b6b" />
        <circle cx={cx} cy={cy} r="29" fill="#fff" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={cx + 23 * Math.sin((i * Math.PI) / 6)} cy={cy - 23 * Math.cos((i * Math.PI) / 6)} r={i % 3 ? 1.5 : 2.8} fill={INK} />
        ))}
        <path className="kc-uhr-hour" d={`M${cx} ${cy} L${cx + 12} ${cy - 7}`} stroke={INK} strokeWidth="4.5" strokeLinecap="round" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <path className="kc-uhr-minute" d={`M${cx} ${cy} V${cy - 21}`} stroke="#4dabf7" strokeWidth="3.2" strokeLinecap="round" style={{ transformOrigin: `${cx}px ${cy}px` }} />
        <circle cx={cx} cy={cy} r="3.5" fill={INK} />
        <path d={`M${cx - 25} ${cy - 20} Q${cx - 16} ${cy - 31} ${cx - 3} ${cy - 33}`} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      <Lines x={cx + 44} y={cy} colour="#ff6b6b" />
    </>
  );
}

/** The lamp hanging over the table; it swings, switches on and shines on the table. */
export function Lampe() {
  return (
    <>
      <g className="kc-lampe-swing" style={{ transformOrigin: "760px 4px" }}>
        <path d="M760 4 V110" stroke={INK} strokeWidth="3" />
        <path className="kc-lampe-light" d="M722 158 L640 330 H880 L798 158 Z" fill="#fff3bf" />
        <circle className="kc-lampe-glow" cx="760" cy="160" r="26" fill="#ffe066" />
        <circle cx="760" cy="158" r="12" fill="#fff9db" />
        <path d="M714 160 Q714 112 760 108 Q806 112 806 160 Z" fill="#ff922b" />
        <path d="M712 156 H808" stroke="#f76707" strokeWidth="6" strokeLinecap="round" />
        <path d="M730 148 Q732 124 752 118" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
        <rect x="752" y="100" width="16" height="12" rx="3" fill="#e8590c" />
      </g>
    </>
  );
}

/** The cooker hood over the stove; its light goes on and it sucks the steam away. */
export function Haube() {
  return (
    <>
      <Steam x={914} y={150} count={3} spread={34} r={12} />
      <rect x="882" y="0" width="64" height="66" fill="#ced4da" />
      <rect x="888" y="0" width="10" height="66" fill="#fff" opacity="0.4" />
      <path d="M826 112 L862 62 H966 L1002 112 Z" fill="#dee2e6" />
      <path d="M842 104 L870 70" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
      <rect x="820" y="106" width="188" height="16" rx="4" fill="#adb5bd" />
      <g fill="#868e96">
        {[880, 900, 920, 940].map((x) => (
          <rect key={x} x={x} y="78" width="8" height="22" rx="3" />
        ))}
      </g>
      <circle className="kc-haube-button" cx="990" cy="114" r="4" fill="#51cf66" />
      <ellipse className="kc-haube-light" cx="914" cy="124" rx="70" ry="10" fill="#fff3bf" />
      <g className="kc-haube-air" stroke="#a5d8ff" strokeWidth="4" strokeLinecap="round" fill="none">
        {[890, 914, 938].map((x, i) => (
          <path key={x} d={`M${x} 60 q-6 -10 0 -20 t0 -20`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The wall cupboard on the right; its doors open, the cookie jar's lid lifts and a cookie hops out. */
export function Keksschrank() {
  return (
    <>
      <rect x="1064" y="8" width="240" height="104" rx="6" fill={CUPBOARD_DARK} />
      <rect x="1070" y="14" width="228" height="94" fill="#fff9ec" />
      <rect x="1070" y="58" width="228" height="6" fill="#e9d8b4" />
      {/* Upper shelf: jam jars and a cereal box */}
      {[1092, 1122].map((x, i) => (
        <g key={x}>
          <rect x={x - 12} y="34" width="24" height="24" rx="4" fill={i ? "#ff8787" : "#da77f2"} />
          <rect x={x - 13} y="30" width="26" height="7" rx="2" fill="#fff" stroke="#dee2e6" />
        </g>
      ))}
      <rect x="1240" y="18" width="40" height="40" rx="3" fill="#ffa94d" />
      <circle cx="1260" cy="36" r="9" fill="#ffd43b" />
      {/* Lower shelf: the cookie jar */}
      <g className="kc-keks-cookie" style={{ transformOrigin: "1184px 80px" }}>
        <circle cx="1184" cy="80" r="11" fill="#e9b872" stroke="#c88b3a" strokeWidth="2" />
        <circle cx="1180" cy="77" r="2" fill="#6b4423" />
        <circle cx="1188" cy="82" r="2" fill="#6b4423" />
        <circle cx="1184" cy="86" r="1.6" fill="#6b4423" />
      </g>
      <path d="M1160 80 H1208 V104 Q1208 108 1204 108 H1164 Q1160 108 1160 104 Z" fill="#e7f5ff" fillOpacity="0.85" stroke="#74c0fc" strokeWidth="2.5" />
      <circle cx="1176" cy="96" r="7" fill="#e9b872" />
      <circle cx="1194" cy="98" r="7" fill="#e9b872" />
      <g className="kc-keks-lid" style={{ transformOrigin: "1162px 80px" }}>
        <rect x="1156" y="74" width="56" height="8" rx="3" fill="#ff8787" />
        <circle cx="1184" cy="72" r="5" fill="#ff8787" />
      </g>
      <rect x="1226" y="76" width="56" height="32" rx="3" fill="#74c0fc" />
      {/* Who wants a cookie, too? */}
      <Hideout x={1072} y={64} w={84} h={44} size={40} />
      <path d="M1236 86 H1272" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <WallDoor x={1068} y={10} w={114} h={100} hinge="left" cls="kc-keks-door" i={0} />
      <WallDoor x={1186} y={10} w={114} h={100} hinge="right" cls="kc-keks-door" i={1} />
      <rect x="1060" y="2" width="248" height="10" rx="4" fill={CUPBOARD_DARK} />
    </>
  );
}

const FRIDGE = "#a5d8ff";

/** The fridge; its doors open, the light goes on, cold air puffs out and the jelly wobbles. */
export function Kuehlschrank() {
  return (
    <>
      {/* Top and side seen from the front left */}
      <path d="M1318 32 L1400 80 H1590 L1484 32 Z" fill="#d0ebff" />
      <path d="M1318 32 L1400 80 V262 L1318 190 Z" fill="#74c0fc" />
      {/* Inside, behind the doors */}
      <rect x="1404" y="84" width="182" height="332" rx="6" fill="#f8f9fa" />
      <rect className="kc-fridge-light" x="1404" y="84" width="182" height="332" rx="6" fill="#fff3bf" />
      {[164, 236, 312].map((y) => (
        <rect key={y} x="1408" y={y} width="174" height="6" fill="#dee2e6" />
      ))}
      {/* Freezer: ice cubes and an ice cream */}
      <rect x="1420" y="128" width="20" height="18" rx="3" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="2" />
      <rect x="1444" y="138" width="20" height="18" rx="3" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="2" />
      <path d="M1520 126 L1532 160 L1544 126 Z" fill="#e9b872" />
      <circle cx="1532" cy="120" r="12" fill="#ffc9c9" />
      {/* Brr! Someone is hiding in the freezer. */}
      <Hideout x={1466} y={90} w={52} h={74} size={48} />
      {/* Milk, cheese, eggs */}
      <path d="M1428 236 V200 L1438 188 H1452 L1462 200 V236 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      <rect x="1430" y="206" width="30" height="12" fill="#4dabf7" />
      <path d="M1486 236 L1540 236 L1540 216 Z" fill="#ffd43b" />
      <circle cx="1522" cy="228" r="3" fill="#fab005" />
      {[1500, 1520, 1540, 1560].map((x) => (
        <ellipse key={x} cx={x} cy="304" rx="8" ry="10" fill="#fff4e6" stroke="#e9d8b4" strokeWidth="2" />
      ))}
      <path d="M1424 312 Q1428 290 1448 292 L1474 312 Z" fill="#ff922b" />
      {/* The jelly wobbles */}
      <g className="kc-fridge-jelly" style={{ transformOrigin: "1470px 412px" }}>
        <path d="M1446 412 L1452 376 Q1470 368 1488 376 L1494 412 Z" fill="#ff6b6b" />
        <ellipse cx="1470" cy="376" rx="18" ry="5" fill="#ffa8a8" />
        <circle cx="1470" cy="368" r="5" fill="#c92a2a" />
      </g>
      <path d="M1520 412 V364 H1560 V412 Z" fill="#69db7c" />
      <rect x="1526" y="356" width="28" height="10" rx="3" fill="#2f9e44" />
      {/* Doors, hinged on the left */}
      <g className="kc-fridge-door" style={{ ...nth(0), transformOrigin: "1402px 126px" }}>
        <rect x="1400" y="80" width="190" height="90" rx="10" fill={FRIDGE} />
        <rect x="1408" y="86" width="12" height="76" rx="5" fill="#fff" opacity="0.45" />
        <rect x="1556" y="104" width="12" height="44" rx="6" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="2" />
      </g>
      <g className="kc-fridge-door" style={{ ...nth(1), transformOrigin: "1402px 294px" }}>
        <rect x="1400" y="172" width="190" height="246" rx="10" fill={FRIDGE} />
        <rect x="1408" y="180" width="12" height="230" rx="5" fill="#fff" opacity="0.45" />
        <rect x="1556" y="190" width="12" height="70" rx="6" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="2" />
        {/* A child's drawing with magnets */}
        <rect x="1440" y="212" width="86" height="70" rx="2" fill="#fff" transform="rotate(-4 1483 247)" />
        <circle cx="1460" cy="236" r="10" fill="#ffd43b" />
        <path d="M1478 270 L1496 246 L1514 270 Z" fill="#ff8787" />
        <path d="M1444 274 H1520" stroke="#51cf66" strokeWidth="4" strokeLinecap="round" />
        <circle cx="1446" cy="214" r="6" fill="#ff6b6b" />
        <circle cx="1520" cy="210" r="6" fill="#51cf66" />
        {/* Letter magnets */}
        <text x="1440" y="340" fontSize="30" fontWeight="800" fontFamily="sans-serif" fill="#ff6b6b">A</text>
        <text x="1470" y="352" fontSize="30" fontWeight="800" fontFamily="sans-serif" fill="#fab005">B</text>
        <text x="1500" y="336" fontSize="30" fontWeight="800" fontFamily="sans-serif" fill="#7950f2">C</text>
      </g>
      <g className="kc-fridge-cold" stroke="#d0ebff" strokeWidth="5" strokeLinecap="round" fill="none">
        {[220, 270, 320].map((y, i) => (
          <path key={y} d={`M1380 ${y} q-12 -8 -24 0 t-24 0`} style={nth(i)} />
        ))}
      </g>
      <rect x="1404" y="416" width="16" height="9" rx="2" fill={STEEL} />
      <rect x="1570" y="416" width="16" height="9" rx="2" fill={STEEL} />
    </>
  );
}
