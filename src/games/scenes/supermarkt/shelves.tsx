import { Hideout } from "../hideout";
import { INK, STEEL, nth } from "../shared";
import { Lines, Mist, Sparkles } from "./parts";

// Shelves, in picture coordinates: the cooling shelf, the milk shelf and the bottle machine at
// the back wall, and the goods on the two aisles' end caps (müsli and pasta on the left, juice
// and sweets on the right).

const COOL_DOORS = [1194, 1260, 1326];

/** Cooling shelf with three glass doors; they open one after the other and cold mist puffs out. */
export function Kuehlregal() {
  return (
    <>
      <rect x="1188" y="118" width="206" height="212" rx="4" fill="#1971c2" />
      <rect x="1194" y="146" width="194" height="178" fill="#e7f5ff" />
      {/* Inside: yoghurt, butter and cheese on three shelves */}
      {[198, 252, 306].map((y, row) => (
        <g key={y}>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 1200 + i * 21;
            const colour = ["#ff8787", "#ffd43b", "#74c0fc", "#b2f2bb", "#ffa94d", "#e599f7"][(i + row * 2) % 6];
            return row === 1 ? (
              <rect key={i} x={x} y={y - 18} width="18" height="18" rx="3" fill={colour} />
            ) : (
              <g key={i}>
                <path d={`M${x} ${y - 22} H${x + 17} L${x + 15} ${y} H${x + 2} Z`} fill="#fff" />
                <rect x={x - 1} y={y - 24} width="19" height="5" rx="2" fill={colour} />
              </g>
            );
          })}
          <rect x="1194" y={y} width="194" height="5" fill="#a5d8ff" />
        </g>
      ))}
      {/* Brrr! Who sits on the yoghurts behind the middle door? */}
      <Hideout x={1262} y={150} w={58} h={102} size={54} />
      {COOL_DOORS.map((x, i) => (
        <g key={x} className="sm-kuehl-door" style={{ ...nth(i), transformOrigin: `${x}px 236px` }}>
          <rect x={x} y="148" width="62" height="174" fill="#d0ebff" fillOpacity="0.4" stroke="#adb5bd" strokeWidth="4" />
          <path d={`M${x + 12} 300 L${x + 40} 170`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
          <rect x={x + 50} y="206" width="5" height="50" rx="2" fill={STEEL} />
        </g>
      ))}
      {/* Header with a snowflake and the light strip */}
      <rect x="1188" y="118" width="206" height="26" fill="#1864ab" />
      <rect className="sm-kuehl-light" x="1196" y="140" width="190" height="5" rx="2" fill="#fff" opacity="0.5" />
      <g stroke="#fff" strokeWidth="3" strokeLinecap="round" transform="translate(1291 131)">
        <path d="M0 -9 V9 M-8 -4.5 L8 4.5 M-8 4.5 L8 -4.5" />
      </g>
      <Mist x={1291} y={318} count={5} spread={40} r={13} />
      <Sparkles x={1291} y={230} spread={70} colour="#fff" />
    </>
  );
}

/** Milk cartons with cow spots on an open shelf; they hop and say "Muh!". */
export function Milch() {
  const shelves = [196, 260, 324];
  return (
    <>
      <rect x="1398" y="148" width="84" height="182" fill="#868e96" />
      <rect x="1402" y="152" width="76" height="174" fill="#f1f3f5" />
      {shelves.map((y, row) => (
        <g key={y}>
          {[0, 1, 2].map((i) => {
            const x = 1406 + i * 24;
            return (
              <g key={i} className="sm-milch-carton" style={{ ...nth(i + row), transformOrigin: `${x + 10}px ${y}px` }}>
                <path d={`M${x} ${y} V${y - 34} L${x + 10} ${y - 42} L${x + 20} ${y - 34} V${y} Z`} fill="#fff" stroke="#dee2e6" strokeWidth="1.5" />
                <path d={`M${x} ${y - 34} L${x + 10} ${y - 42} L${x + 20} ${y - 34} Z`} fill={row === 1 ? "#ff8787" : "#4dabf7"} />
                <ellipse cx={x + 6} cy={y - 22} rx="4" ry="3" fill={INK} />
                <ellipse cx={x + 14} cy={y - 10} rx="3.5" ry="4" fill={INK} />
              </g>
            );
          })}
          <rect x="1402" y={y} width="76" height="4" fill="#adb5bd" />
        </g>
      ))}
      {/* A cow face on the shelf's sign */}
      <rect x="1398" y="148" width="84" height="20" fill="#4dabf7" />
      <g className="sm-milch-cow" style={{ transformOrigin: "1440px 158px" }}>
        <ellipse cx="1440" cy="160" rx="13" ry="10" fill="#fff" />
        <ellipse cx="1440" cy="165" rx="8" ry="5" fill="#ffc9c9" />
        <circle cx="1435" cy="156" r="1.8" fill={INK} />
        <circle cx="1445" cy="156" r="1.8" fill={INK} />
        <path d="M1428 152 l-6 -4 M1452 152 l6 -4" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
      <Lines x={1486} y={182} colour="#868e96" size={0.8} />
    </>
  );
}

/** The bottle machine: a bottle goes into the round hole, the lights blink and a receipt comes out. */
export function Pfandautomat() {
  return (
    <>
      <rect x="1488" y="160" width="106" height="170" rx="6" fill="#dee2e6" />
      <rect x="1488" y="160" width="106" height="20" rx="6" fill="#2b8a3e" />
      <path d="M1500 170 H1582" stroke="#fff" strokeWidth="3" strokeDasharray="6 5" strokeLinecap="round" opacity="0.7" />
      {/* Screen */}
      <rect x="1500" y="190" width="40" height="28" rx="4" fill="#343a40" />
      <g className="sm-pfand-screen">
        <rect x="1503" y="193" width="34" height="22" rx="3" fill="#8ce99a" />
        <path d="M1512 202 q8 8 16 0" stroke="#2b8a3e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="1513" cy="198" r="1.8" fill="#2b8a3e" />
        <circle cx="1527" cy="198" r="1.8" fill="#2b8a3e" />
      </g>
      {/* The round hole for bottles */}
      <circle cx="1541" cy="258" r="30" fill="#adb5bd" />
      <circle className="sm-pfand-ring" cx="1541" cy="258" r="25" fill="none" stroke="#69db7c" strokeWidth="5" opacity="0.35" />
      <circle cx="1541" cy="258" r="19" fill="#343a40" />
      <g className="sm-pfand-bottle" style={{ transformOrigin: "1541px 258px" }}>
        <rect x="1533" y="244" width="16" height="30" rx="5" fill="#69db7c" stroke="#2b8a3e" strokeWidth="1.5" />
        <rect x="1537" y="236" width="8" height="10" rx="2" fill="#69db7c" stroke="#2b8a3e" strokeWidth="1.5" />
        <rect x="1533" y="254" width="16" height="9" fill="#fff" />
      </g>
      {/* Receipt slot */}
      <rect x="1552" y="196" width="30" height="6" rx="2" fill="#495057" />
      <g className="sm-pfand-bon" style={{ transformOrigin: "1567px 199px" }}>
        <rect x="1556" y="199" width="22" height="26" fill="#fff" stroke="#ced4da" strokeWidth="1.5" />
        <path d="M1560 206 H1574 M1560 212 H1570 M1560 218 H1574" stroke="#adb5bd" strokeWidth="2" />
      </g>
      <rect x="1494" y="302" width="94" height="22" rx="4" fill="#ced4da" />
      <path d="M1500 312 H1582" stroke="#adb5bd" strokeWidth="3" />
      <circle className="sm-pfand-lamp" cx="1580" cy="212" r="5" fill="#ffa8a8" />
    </>
  );
}

const CEREAL = [
  { x: 388, fill: "#ff922b", sun: "#ffe066" },
  { x: 422, fill: "#4dabf7", sun: "#fff" },
  { x: 456, fill: "#e64980", sun: "#ffe066" },
  { x: 490, fill: "#40c057", sun: "#fff" },
];

/** Müsli boxes on the left end cap; they wobble and flakes fly out of the top. */
export function Muesli() {
  return (
    <>
      {CEREAL.map(({ x, fill, sun }, i) => (
        <g key={x} className="sm-muesli-box" style={{ ...nth(i), transformOrigin: `${x + 14}px 449px` }}>
          <rect x={x} y="399" width="28" height="50" rx="2" fill={fill} />
          <rect x={x} y="399" width="28" height="7" fill="#fff" opacity="0.35" />
          <path d={`M${x + 4} 436 Q${x + 14} 446 ${x + 24} 436 Z`} fill="#fff" />
          <circle cx={x + 10} cy="432" r="2.5" fill="#e03131" />
          <circle cx={x + 17} cy="433" r="2.5" fill="#fab005" />
          <circle cx={x + 14} cy="418" r="6" fill={sun} />
        </g>
      ))}
      <g className="sm-muesli-flakes" fill="#f3c582">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={432 + i * 6} cy={398} rx="4" ry="2.6" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Pasta: bags of spirals and shells and a tall spaghetti pack; they hop and the spaghetti wiggle. */
export function Nudeln() {
  return (
    <>
      {[388, 424, 460].map((x, i) => (
        <g key={x} className="sm-nudel-bag" style={{ ...nth(i), transformOrigin: `${x + 15}px 521px` }}>
          <path d={`M${x} 521 V478 Q${x + 15} 470 ${x + 30} 478 V521 Z`} fill="#fff9db" stroke="#ffd43b" strokeWidth="2" />
          <rect x={x} y="472" width="30" height="8" rx="2" fill={i === 1 ? "#4dabf7" : "#fa5252"} />
          {[0, 1, 2].map((k) =>
            i === 1 ? (
              <path key={k} d={`M${x + 3 + k * 8} ${500 + (k % 2) * 8} q4 -8 8 0 Z`} fill="#fab005" />
            ) : (
              <path key={k} d={`M${x + 7 + k * 8} 488 q4 4 0 8 q-4 4 0 8 q4 4 0 8`} stroke="#fab005" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            ),
          )}
        </g>
      ))}
      <g className="sm-nudel-spaghetti" style={{ transformOrigin: "506px 470px" }}>
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${499 + k * 4} 470 V${452 + (k % 2) * 4}`} stroke="#fcc419" strokeWidth="2.5" strokeLinecap="round" />
        ))}
      </g>
      <g className="sm-nudel-box" style={{ transformOrigin: "506px 521px" }}>
        <rect x="495" y="468" width="22" height="53" rx="2" fill="#1c7ed6" />
        <rect x="499" y="480" width="14" height="24" rx="2" fill="#fff" />
        <path d="M501 486 V500 M505 486 V500 M509 486 V500" stroke="#fcc419" strokeWidth="2" />
      </g>
    </>
  );
}

const JUICES = [
  { x: 1086, fill: "#ff922b", cap: "#e8590c" },
  { x: 1118, fill: "#fab005", cap: "#2b8a3e" },
  { x: 1150, fill: "#e03131", cap: "#c92a2a" },
  { x: 1182, fill: "#ff922b", cap: "#e8590c" },
];

/** Juice bottles on the right end cap; they sway, the juice sloshes and bubbles rise. */
export function Saft() {
  return (
    <>
      {JUICES.map(({ x, fill, cap }, i) => (
        <g key={x} className="sm-saft-bottle" style={{ ...nth(i), transformOrigin: `${x + 13}px 449px` }}>
          <path d={`M${x} 449 V414 Q${x} 406 ${x + 8} 404 V398 H${x + 18} V404 Q${x + 26} 406 ${x + 26} 414 V449 Z`} fill="#f1f3f5" fillOpacity="0.9" />
          <path className="sm-saft-juice" d={`M${x + 2} 447 V420 Q${x + 13} 416 ${x + 24} 420 V447 Z`} fill={fill} style={{ transformOrigin: `${x + 13}px 447px` }} />
          <rect x={x + 7} y="394" width="12" height="6" rx="2" fill={cap} />
          <rect x={x + 3} y="426" width="20" height="12" rx="2" fill="#fff" />
          <circle cx={x + 13} cy="432" r="4" fill={fill} />
          <path d={`M${x + 5} 414 V444`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        </g>
      ))}
      <g className="sm-saft-bubbles" fill="#fff">
        {JUICES.map(({ x }, i) => (
          <circle key={x} cx={x + 13} cy="420" r="2.5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const SWEETS = ["#ff6b6b", "#ffd43b", "#4dabf7", "#69db7c", "#da77f2", "#ff922b"];

/** Two big jars of sweets; the lids lift, sweets jump out and fall back, and they sparkle. */
export function Bonbons() {
  return (
    <>
      {[1088, 1152].map((x, j) => (
        <g key={x}>
          <path d={`M${x} 521 V478 Q${x} 470 ${x + 8} 470 H${x + 48} Q${x + 56} 470 ${x + 56} 478 V521 Z`} fill="#e7f5ff" fillOpacity="0.7" stroke="#a5d8ff" strokeWidth="2.5" />
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={x + 9 + (i % 5) * 9.5} cy={512 - Math.floor(i / 5) * 12 - (i % 2) * 3} r="5.5" fill={SWEETS[(i + j * 3) % SWEETS.length]} />
          ))}
          <path d={`M${x + 8} 482 V514`} stroke="#fff" strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
          <g className="sm-bonbon-jump">
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={x + 16 + i * 12} cy="482" r="5.5" fill={SWEETS[(i * 2 + j) % SWEETS.length]} style={nth(i + j)} />
            ))}
          </g>
          <g className="sm-bonbon-lid" style={{ ...nth(j), transformOrigin: `${x + 4}px 466px` }}>
            <rect x={x + 2} y="462" width="52" height="9" rx="4" fill={j ? "#e64980" : "#7950f2"} />
            <rect x={x + 22} y="456" width="12" height="7" rx="3" fill={j ? "#e64980" : "#7950f2"} />
          </g>
        </g>
      ))}
      <Sparkles x={1152} y={474} spread={50} colour="#ffd43b" size={0.8} />
    </>
  );
}
