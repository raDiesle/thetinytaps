import { CHEEK, INK, Inside, SKIN, nth } from "../shared";
import { Eyes, Heart, Notes, Sparkles, SleepyFace, Zzz, star } from "./parts";

// Things on the back wall and at the door, all drawn in picture coordinates: the fairy
// lights, the picture, the mobile, the cuckoo clock, the curtains, the pyjamas on their hook,
// the night light, the mouse, the door and Mama.

/** Points on a hanging string from (x0, y) to (x1, y), sagging `sag` in the middle. */
function swag(x0: number, x1: number, y: number, sag: number, t: number): [number, number] {
  const mx = (x0 + x1) / 2;
  const cy = y + sag * 2;
  const u = 1 - t;
  return [u * u * x0 + 2 * u * t * mx + t * t * x1, u * u * y + 2 * u * t * cy + t * t * y];
}

const BULBS = ["#ffd43b", "#ff8fa3", "#74c0fc", "#8ce99a", "#ffa94d", "#d0bfff"];
const KETTE = [900, 1060, 1220, 1380];

/** Fairy lights in three swags along the top of the wall; the bulbs glow one after another. */
export function Lichterkette() {
  const bulbs = KETTE.slice(1).flatMap((x1, s) => [0.2, 0.4, 0.6, 0.8].map((t) => swag(KETTE[s], x1, 18, 26, t)));
  return (
    <>
      <path
        d={KETTE.slice(1)
          .map((x1, s) => `M${KETTE[s]} 18 Q${(KETTE[s] + x1) / 2} 70 ${x1} 18`)
          .join(" ")}
        stroke="#6d6875"
        strokeWidth="2.5"
        fill="none"
      />
      {KETTE.map((x) => (
        <circle key={x} cx={x} cy="18" r="4" fill="#b08968" />
      ))}
      <g className="gn-on">
        {bulbs.map(([x, y], i) => (
          <circle key={i} className="gn-kette-glow" style={nth(i % 4)} cx={x} cy={y + 12} r="15" fill={BULBS[i % BULBS.length]} fillOpacity="0.4" />
        ))}
      </g>
      {bulbs.map(([x, y], i) => (
        <g key={i} className="gn-kette-bulb" style={{ ...nth(i % 4), transformOrigin: `${x}px ${y}px` }}>
          <rect x={x - 3.5} y={y - 1} width="7" height="6" rx="1.5" fill="#868e96" />
          <ellipse cx={x} cy={y + 12} rx="6.5" ry="9" fill={BULBS[i % BULBS.length]} />
          <ellipse cx={x - 2} cy={y + 9} rx="2" ry="3.5" fill="#fff" opacity="0.6" />
        </g>
      ))}
    </>
  );
}

const PICTURE = "M80 82 H190 V170 H80 Z";

/** A framed picture of a sunny hill; when it falls asleep the sun sets and a moon comes out. */
export function Bild() {
  return (
    <g className="gn-bild-frame" style={{ transformOrigin: "135px 58px" }}>
      <path d="M135 58 L86 78 M135 58 L184 78" stroke="#8d6e63" strokeWidth="2" />
      <circle cx="135" cy="57" r="4" fill="#adb5bd" />
      <rect x="70" y="72" width="130" height="108" rx="6" fill="#f6bd60" />
      <Inside d={PICTURE}>
        <rect x="80" y="82" width="110" height="88" fill="#6c6fb5" />
        <rect className="gn-on" x="80" y="82" width="110" height="88" fill="#a5d8ff" />
        <path className="gn-bild-moon" d="M110 102 a12 12 0 1 0 12 16 a9 9 0 1 1 -12 -16 Z" fill="#fff3bf" />
        <g className="gn-bild-sun">
          <circle cx="158" cy="110" r="15" fill="#ffd43b" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M158 89 v-6" stroke="#ffd43b" strokeWidth="4" strokeLinecap="round" transform={`rotate(${a} 158 110)`} />
          ))}
          <Eyes cx={158} cy={108} gap={5} r={2} />
          <path d="M154 115 Q158 118 162 115" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
        <path d="M80 150 Q112 126 146 142 Q172 132 190 140 V170 H80 Z" fill="#69db7c" />
        <path d="M80 160 Q130 146 190 156 V170 H80 Z" fill="#51cf66" />
        <rect x="98" y="134" width="20" height="16" fill="#fff" />
        <path d="M95 135 L108 124 L121 135 Z" fill="#e63946" />
      </Inside>
      <rect x="76" y="78" width="118" height="96" rx="2" fill="none" stroke="#e9a84c" strokeWidth="3" />
      <Zzz x={202} y={86} size={0.8} />
    </g>
  );
}

/** A mobile hanging from the ceiling over the bed: a star, a cloud, a sleepy moon and a sheep swing. */
export function Mobile() {
  const hangers = [
    { x: 272, len: 46 },
    { x: 318, len: 64 },
    { x: 372, len: 52 },
    { x: 418, len: 38 },
  ];
  return (
    <>
      <path d="M345 0 V42" stroke="#adb5bd" strokeWidth="2" />
      <g className="gn-mobile-bar" style={{ transformOrigin: "345px 42px" }}>
        <path d="M266 46 Q345 36 424 46" stroke="#c9a27e" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="345" cy="42" r="5" fill="#b08968" />
        {hangers.map(({ x, len }, i) => (
          <g key={x} className="gn-mobile-hang" style={{ ...nth(i), transformOrigin: `${x}px 44px` }}>
            <path d={`M${x} 44 V${44 + len}`} stroke="#adb5bd" strokeWidth="1.6" />
            {i === 0 && <path d={star(x, 44 + len + 14, 16)} fill="#ffd43b" />}
            {i === 1 && (
              <g fill="#fff">
                <circle cx={x - 12} cy={44 + len + 14} r="10" />
                <circle cx={x + 2} cy={44 + len + 8} r="13" />
                <circle cx={x + 15} cy={44 + len + 15} r="9" />
                <rect x={x - 12} y={44 + len + 14} width="27" height="10" rx="5" />
              </g>
            )}
            {i === 2 && (
              <g>
                <path d={`M${x - 4} ${44 + len} a20 20 0 1 0 18 28 a15 15 0 1 1 -18 -28 Z`} fill="#ffe066" />
                <path d={`M${x + 1} ${44 + len + 20} q3 3 6 0`} stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
              </g>
            )}
            {i === 3 && (
              <g>
                <circle cx={x - 6} cy={44 + len + 12} r="8" fill="#f8f9fa" />
                <circle cx={x + 4} cy={44 + len + 10} r="9" fill="#f8f9fa" />
                <circle cx={x + 2} cy={44 + len + 18} r="8" fill="#f8f9fa" />
                <circle cx={x - 12} cy={44 + len + 12} r="5" fill="#495057" />
              </g>
            )}
          </g>
        ))}
      </g>
      <Notes x={345} y={150} colour="#b197fc" size={0.8} />
    </>
  );
}

/** A cuckoo clock: the little door opens, the cuckoo comes out and says good night, the pendulum swings. */
export function Kuckucksuhr() {
  return (
    <>
      {/* Chains and pine-cone weights */}
      {[480, 510].map((x, i) => (
        <g key={x} className="gn-kuckuck-weight" style={{ ...nth(i), transformOrigin: `${x}px 160px` }}>
          <path d={`M${x} 158 V${206 + i * 14}`} stroke="#adb5bd" strokeWidth="2" strokeDasharray="3 2" />
          <path
            d={`M${x - 7} ${206 + i * 14} Q${x - 8} ${226 + i * 14} ${x} ${232 + i * 14} Q${x + 8} ${226 + i * 14} ${x + 7} ${206 + i * 14} Z`}
            fill="#8d6e63"
          />
        </g>
      ))}
      <g className="gn-kuckuck-pendel" style={{ transformOrigin: "495px 156px" }}>
        <path d="M495 156 V196" stroke="#c9a27e" strokeWidth="3" />
        <circle cx="495" cy="200" r="9" fill="#f6bd60" />
      </g>
      {/* House */}
      <rect x="460" y="84" width="70" height="76" rx="4" fill="#a1785c" />
      <path d="M450 88 L495 50 L540 88 Z" fill="#6d4c41" />
      <path d="M456 84 L495 56 L534 84" stroke="#8d6e63" strokeWidth="3" fill="none" />
      <rect x="484" y="86" width="22" height="22" rx="3" fill="#3e2723" />
      <g className="gn-kuckuck-bird" style={{ transformOrigin: "495px 106px" }}>
        <ellipse cx="495" cy="100" rx="11" ry="9" fill="#ffa94d" />
        <circle cx="497" cy="92" r="7" fill="#ffa94d" />
        <path d="M503 92 L511 94 L503 96 Z" fill="#fab005" />
        <circle cx="498" cy="91" r="1.8" fill={INK} />
      </g>
      <g className="gn-kuckuck-door" style={{ transformOrigin: "484px 97px" }}>
        <rect x="484" y="86" width="22" height="22" rx="3" fill="#c9a27e" />
        <circle cx="502" cy="97" r="1.8" fill="#6d4c41" />
      </g>
      <circle cx="495" cy="132" r="18" fill="#fffaf0" />
      {Array.from({ length: 4 }, (_, i) => (
        <circle key={i} cx={495 + 13 * Math.sin((i * Math.PI) / 2)} cy={132 - 13 * Math.cos((i * Math.PI) / 2)} r="1.6" fill={INK} />
      ))}
      <path className="gn-kuckuck-hand" d="M495 132 V120" stroke={INK} strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "495px 132px" }} />
      <path d="M495 132 L503 136" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M466 98 Q474 92 478 104" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.35" fill="none" />
      {[468, 522].map((x) => (
        <path key={x} d={`M${x - 6} 152 q6 -10 12 0`} fill="#8ce99a" />
      ))}
      <Zzz x={527} y={70} size={0.8} />
    </>
  );
}

/** One curtain: gathered at the rod, falling in folds. */
function Curtain({ x, w, flip }: { x: number; w: number; flip: boolean }) {
  const folds = [0.25, 0.5, 0.75].map((t) => x + w * t);
  return (
    <>
      <path d={`M${x} 26 H${x + w} V286 Q${x + w * 0.75} 296 ${x + w / 2} 286 Q${x + w * 0.25} 296 ${x} 286 Z`} fill="#f4a6b8" />
      {folds.map((fx) => (
        <path key={fx} d={`M${fx} 30 V284`} stroke="#e58fa4" strokeWidth="5" />
      ))}
      {[70, 140, 210].map((sy, i) => (
        <path key={sy} d={star(x + w * (flip ? 0.66 - (i % 2) * 0.3 : 0.34 + (i % 2) * 0.3), sy, 7)} fill="#fff" opacity="0.75" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} cx={x + 6 + (i * (w - 12)) / 4} cy="26" r="5" fill="#c9a27e" />
      ))}
    </>
  );
}

/** Pink curtains at both sides of the window; they sway and swing shut for a moment. */
export function Vorhang() {
  return (
    <>
      <g className="gn-vorhang-l" style={{ transformOrigin: "544px 26px" }}>
        <Curtain x={544} w={66} flip={false} />
      </g>
      <g className="gn-vorhang-r" style={{ transformOrigin: "896px 26px" }}>
        <Curtain x={830} w={66} flip />
      </g>
    </>
  );
}

/** Blue pyjamas with stars on a hanger; they swing on their hook and wave a sleeve. */
export function Schlafanzug() {
  return (
    <>
      <path d="M1196 88 q-8 0 -8 8 q0 6 6 6" stroke="#c9a27e" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="1196" cy="86" r="4" fill="#c9a27e" />
      <g className="gn-anzug" style={{ transformOrigin: "1194px 100px" }}>
        <path d="M1194 100 L1164 116 H1224 Z" stroke="#b08968" strokeWidth="4" strokeLinejoin="round" fill="none" />
        {/* Trousers folded over the hanger */}
        <path d="M1176 116 H1212 L1214 220 H1198 L1194 160 L1190 220 H1174 Z" fill="#4c6ef5" />
        {/* Top */}
        <path d="M1168 116 Q1194 108 1220 116 L1222 178 H1166 Z" fill="#74a9f0" />
        <g className="gn-anzug-sleeve" style={{ transformOrigin: "1168px 120px" }}>
          <path d="M1168 116 L1152 164 L1164 168 L1172 134 Z" fill="#74a9f0" />
        </g>
        <g className="gn-anzug-sleeve" style={{ ...nth(1), transformOrigin: "1220px 120px" }}>
          <path d="M1220 116 L1236 164 L1224 168 L1216 134 Z" fill="#74a9f0" />
        </g>
        <path d="M1186 116 L1194 128 L1202 116" stroke="#fff" strokeWidth="3" fill="none" />
        {[
          [1180, 142],
          [1206, 156],
          [1186, 168],
          [1206, 132],
          [1186, 200],
          [1204, 196],
        ].map(([sx, sy]) => (
          <path key={`${sx}-${sy}`} d={star(sx, sy, 5)} fill="#fff3bf" />
        ))}
        {[136, 150, 164].map((by) => (
          <circle key={by} cx="1194" cy={by} r="2.2" fill="#fff" />
        ))}
      </g>
    </>
  );
}

/** A star-shaped night light in the socket: it glows all night, and only closes its eyes. */
export function Nachtlicht() {
  return (
    <>
      <circle className="gn-nacht-halo" cx="783" cy="312" r="42" fill="#fff3bf" fillOpacity="0.45" />
      <rect x="774" y="318" width="18" height="10" rx="3" fill="#dee2e6" />
      <g className="gn-nacht-star" style={{ transformOrigin: "783px 312px" }}>
        <path d={star(783, 310, 26)} fill="#ffe066" stroke="#fcc419" strokeWidth="2" strokeLinejoin="round" />
        <SleepyFace cx={783} cy={308} size={0.6} />
      </g>
      <Sparkles x={783} y={310} spread={40} count={4} colour="#fff3bf" size={0.8} />
    </>
  );
}

/** A little mouse peeking out of its hole in the skirting; it pops out, twitches its ears and yawns. */
export function Maus() {
  return (
    <>
      <g className="gn-maus" style={{ transformOrigin: "1368px 332px" }}>
        {[-1, 1].map((s, i) => (
          <g key={s} className="gn-maus-ear" style={{ ...nth(i), transformOrigin: `${1368 + s * 8}px 306px` }}>
            <circle cx={1368 + s * 12} cy="300" r="8" fill="#adb5bd" />
            <circle cx={1368 + s * 12} cy="300" r="4.5" fill="#ffc9c9" />
          </g>
        ))}
        <ellipse cx="1368" cy="324" rx="15" ry="11" fill="#adb5bd" />
        <circle cx="1368" cy="312" r="12" fill="#ced4da" />
        <Eyes cx={1368} cy={310} gap={4.5} r={2} />
        <circle cx="1368" cy="317" r="2.6" fill="#ff8fa3" />
        <path d="M1362 318 L1350 316 M1362 320 L1351 322 M1374 318 L1386 316 M1374 320 L1385 322" stroke="#868e96" strokeWidth="1" strokeLinecap="round" />
        <ellipse cx="1361" cy="332" rx="4" ry="2.5" fill="#ffc9c9" />
        <ellipse cx="1375" cy="332" rx="4" ry="2.5" fill="#ffc9c9" />
      </g>
      <Zzz x={1384} y={290} size={0.7} />
    </>
  );
}

/** The door to the hall, left ajar: the warm hall light shines in, and the door swings a little. */
export function Tuer() {
  return (
    <>
      {/* Light from the hall, on the floor of the room too */}
      <g className="gn-on">
        <rect x="1412" y="26" width="166" height="308" fill="#ffe8a3" />
        <path d="M1412 334 H1578 L1620 430 H1380 Z" fill="#ffe8a3" opacity="0.45" />
      </g>
      <g className="gn-tuer-lamp">
        <path d="M1470 26 V40" stroke="#868e96" strokeWidth="2" />
        <path d="M1456 52 Q1470 36 1484 52 Z" fill="#f4a6b8" />
      </g>
      <g className="gn-tuer-leaf" style={{ transformOrigin: "1578px 180px" }}>
        <path d="M1578 26 L1528 40 V320 L1578 334 Z" fill="#f6e7d7" />
        <path d="M1570 52 L1536 60 V160 L1570 156 Z M1570 192 L1536 194 V302 L1570 312 Z" fill="none" stroke="#e3cdb6" strokeWidth="3" />
        <circle cx="1536" cy="178" r="5" fill="#c9a27e" />
      </g>
    </>
  );
}

/** Mama in the doorway in her dressing gown; she waves and blows a good-night kiss. */
export function Mama() {
  return (
    <>
      <g className="gn-mama" style={{ transformOrigin: "1468px 330px" }}>
        {/* Gown, feet */}
        <path d="M1446 130 H1490 L1508 326 H1428 Z" fill="#b197fc" />
        <path d="M1468 130 L1468 326" stroke="#9775fa" strokeWidth="3" />
        <path d="M1446 214 H1490" stroke="#fff" strokeWidth="5" opacity="0.6" />
        <ellipse cx="1452" cy="330" rx="13" ry="5" fill="#f4a6b8" />
        <ellipse cx="1484" cy="330" rx="13" ry="5" fill="#f4a6b8" />
        {/* Arm on the door frame */}
        <path d="M1448 140 Q1430 170 1440 200" stroke="#b197fc" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="1440" cy="204" r="7" fill={SKIN} />
        {/* Head and hair */}
        <rect x="1461" y="114" width="14" height="18" rx="5" fill={SKIN} />
        <circle cx="1468" cy="80" r="16" fill="#8d5524" />
        <circle cx="1468" cy="104" r="22" fill={SKIN} />
        <path d="M1446 102 Q1444 80 1468 80 Q1492 80 1490 102 Q1480 88 1468 90 Q1456 88 1446 102 Z" fill="#8d5524" />
        <circle cx="1458" cy="112" r="4.5" fill={CHEEK} opacity="0.5" />
        <circle cx="1478" cy="112" r="4.5" fill={CHEEK} opacity="0.5" />
        <Eyes cx={1468} cy={104} gap={7} r={2.6} />
        <path d="M1463 115 Q1468 119 1473 115" stroke={INK} strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <g className="gn-mama-kiss">
          <circle cx="1468" cy="116" r="3.2" fill="#e64980" />
        </g>
      </g>
      {/* Waving arm */}
      <g className="gn-mama-arm" style={{ transformOrigin: "1490px 140px" }}>
        <path d="M1488 138 Q1504 128 1508 108" stroke="#b197fc" strokeWidth="13" strokeLinecap="round" fill="none" />
        <circle cx="1508" cy="102" r="8" fill={SKIN} />
      </g>
      <Heart x={1492} y={96} size={0.9} />
    </>
  );
}
