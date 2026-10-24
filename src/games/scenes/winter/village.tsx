import { Lids } from "../baustelle/figures";
import { Hideout } from "../hideout";
import { Face, GLASS, INK, Inside, SKIN, heartPath, nth } from "../shared";
import { Cap, SNOW, SNOW_SHADE, glint } from "../winterbaustelle/parts";

// The red wooden house, the church, the deer feeder, the bench with hot cocoa, a lost mitten
// and the big snowflake. Each drawing stands with its foot point on (0, 0), except the house,
// which uses the coordinates of the icicles hanging from its eaves (../winterbaustelle/things).

const WALL = "#c8553d";
const WOOD = "#8d5a2b";
const WOOD_DARK = "#6f4520";
const TRIM = "#f8f1e5";

// ---------- Holzhaus ----------

/** A window with green shutters; the light goes on and, in the left one, a child looks out. */
function HouseWindow({ x, kid }: { x: number; kid?: boolean }) {
  const glass = `M${x + 2} 530 h48 v52 h-48 Z`;
  return (
    <>
      <g className="wi-haus-shutter" style={{ transformOrigin: `${x - 2}px 556px` }}>
        <rect x={x - 20} y="526" width="18" height="60" rx="2" fill="#2a9d8f" />
        <path d={`M${x - 17} 538 h12 M${x - 17} 550 h12 M${x - 17} 562 h12 M${x - 17} 574 h12`} stroke="#21867a" strokeWidth="3" />
      </g>
      <g className="wi-haus-shutter wi-haus-shutter-r" style={{ transformOrigin: `${x + 54}px 556px` }}>
        <rect x={x + 54} y="526" width="18" height="60" rx="2" fill="#2a9d8f" />
        <path d={`M${x + 57} 538 h12 M${x + 57} 550 h12 M${x + 57} 562 h12 M${x + 57} 574 h12`} stroke="#21867a" strokeWidth="3" />
      </g>
      <rect x={x - 2} y="526" width="56" height="60" rx="3" fill={TRIM} />
      <path d={glass} fill={GLASS} />
      <path className="wi-haus-light" d={glass} fill="#ffd166" />
      {kid && (
        <Inside d={glass}>
          <g className="wi-haus-kid">
            <circle cx={x + 26} cy="604" r="15" fill={SKIN} />
            <Face cx={x + 26} cy={603} size={0.55} />
            <path d={`M${x + 11} 600 Q${x + 10} 582 ${x + 26} 582 Q${x + 42} 582 ${x + 41} 600 Z`} fill="#e63946" />
            <rect x={x + 10} y="596" width="32" height="6" rx="3" fill="#fff" />
            <circle cx={x + 26} cy="579" r="5" fill="#fff" />
          </g>
        </Inside>
      )}
      <path className="wi-haus-curtain" d={`M${x + 2} 530 h16 q-4 22 -16 30 Z`} fill="#ff8fa3" style={{ transformOrigin: `${x + 2}px 530px` }} />
      <path
        className="wi-haus-curtain wi-haus-curtain-r"
        d={`M${x + 50} 530 h-16 q4 22 16 30 Z`}
        fill="#ff8fa3"
        style={{ transformOrigin: `${x + 50}px 530px` }}
      />
      <path d={`M${x + 26} 530 V582 M${x + 2} 556 H${x + 50}`} stroke={TRIM} strokeWidth="4" />
      <path d={`M${x + 8} 576 L${x + 20} 536`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      <rect x={x - 6} y="584" width="64" height="7" rx="2" fill={TRIM} />
      <Cap x={x - 6} y={584} w={64} h={6} />
    </>
  );
}

/** A red wooden house with snow on the roof: smoke puffs, shutters clap, lights go on, the door opens. */
export function Holzhaus() {
  return (
    <>
      {/* Chimney, behind the roof */}
      <rect x="1118" y="350" width="34" height="60" fill="#8d6e63" />
      <rect x="1140" y="350" width="12" height="60" fill="#6d4c41" />
      <rect x="1114" y="342" width="42" height="10" rx="3" fill="#795548" />
      <Cap x={1114} y={342} w={42} h={8} />
      <g fill="#fff" opacity="0.8">
        <circle cx="1138" cy="326" r="9" />
        <circle cx="1148" cy="306" r="12" />
        <circle cx="1164" cy="282" r="14" />
      </g>
      <g className="wi-haus-smoke" fill="#fff">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="1136" cy="330" r={10 + i * 2} style={nth(i)} />
        ))}
      </g>
      {/* Roof, under a thick layer of snow */}
      <path d="M904 488 L966 376 L1154 376 L1216 488 Z" fill="#7a4a35" />
      <path d="M908 484 L968 372 L1152 372 L1212 484 Q1136 468 1060 474 Q984 468 908 484 Z" fill={SNOW} />
      <path d="M1100 372 L1152 372 L1212 484 Q1180 474 1150 472 Z" fill={SNOW_SHADE} />
      <path d="M980 392 Q1060 382 1140 392" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" />
      {/* Walls */}
      <rect x="930" y="490" width="260" height="210" fill={WALL} />
      <path d="M930 520 H1190 M930 548 H1190 M930 576 H1190 M930 604 H1190 M930 632 H1190 M930 660 H1190" stroke="#a8432f" strokeWidth="2" opacity="0.55" />
      <rect x="1150" y="490" width="40" height="210" fill="#2b2d42" opacity="0.08" />
      <rect x="928" y="490" width="10" height="210" fill={TRIM} />
      <rect x="1182" y="490" width="10" height="210" fill={TRIM} />
      <rect x="900" y="480" width="320" height="12" rx="3" fill="#5c3a2e" />
      <Cap x={900} y={480} w={320} h={9} />
      <g className="wi-haus-roofsnow" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        {[
          [918, 496],
          [1204, 498],
          [930, 486],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" style={nth(i)} />
        ))}
      </g>
      <HouseWindow x={952} kid />
      <HouseWindow x={1116} />
      {/* The door, with someone different behind it every time */}
      <rect x="1030" y="598" width="60" height="102" rx="4" fill={TRIM} />
      <rect x="1036" y="604" width="48" height="96" fill="#3b2a20" />
      <rect x="1036" y="604" width="48" height="96" fill="#ffd166" opacity="0.25" />
      <Hideout x={1036} y={606} w={48} h={94} size={62} />
      <g className="wi-haus-door" style={{ transformOrigin: "1036px 652px" }}>
        <rect x="1036" y="604" width="48" height="96" rx="2" fill="#2d6a4f" />
        <rect x="1042" y="652" width="36" height="40" rx="3" fill="#40916c" />
        <circle cx="1077" cy="660" r="3.5" fill="#ffd166" />
        <circle cx="1060" cy="628" r="13" fill="none" stroke="#1b4332" strokeWidth="7" />
        <circle cx="1060" cy="628" r="13" fill="none" stroke="#52b788" strokeWidth="3" strokeDasharray="4 5" />
        <circle cx="1052" cy="620" r="2.5" fill="#e63946" />
        <circle cx="1069" cy="634" r="2.5" fill="#e63946" />
        <path d="M1060 640 l-7 7 M1060 640 l7 7" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
        <path d="M1060 640 c-8 -6 -8 4 0 0 c8 -6 8 4 0 0" fill="#e63946" />
      </g>
      <rect x="1022" y="694" width="76" height="9" rx="3" fill="#cfc3b3" />
      <Cap x={1022} y={694} w={76} h={6} />
      {/* Snow heaped against the walls */}
      <path d="M918 702 Q930 676 960 684 Q990 676 1018 702 Z" fill={SNOW} />
      <path d="M1102 702 Q1130 678 1160 686 Q1190 674 1206 702 Z" fill={SNOW} />
    </>
  );
}

// ---------- Kirchturm ----------

const STEEPLE = "#4f8a7f";

/** The village church: the bell swings, the clock hands turn, the windows light up and the weather rooster spins. */
export function Kirchturm() {
  return (
    <>
      {/* Nave */}
      <rect x="-118" y="-104" width="122" height="104" fill="#f1e6d6" />
      <path d="M-128 -100 L-104 -150 L-4 -150 L8 -100 Z" fill="#9b2c2c" />
      <path d="M-126 -102 L-103 -148 L-5 -148 L6 -102 Q-30 -114 -60 -108 Q-94 -116 -126 -102 Z" fill={SNOW} />
      {[-96, -54].map((x) => (
        <g key={x}>
          <path d={`M${x} -24 V-60 Q${x + 11} -78 ${x + 22} -60 V-24 Z`} fill="#7da7c9" />
          <path className="wi-kirche-window" d={`M${x} -24 V-60 Q${x + 11} -78 ${x + 22} -60 V-24 Z`} fill="#ffd166" />
          <path d={`M${x + 11} -70 V-24 M${x} -46 H${x + 22}`} stroke="#f1e6d6" strokeWidth="2.5" />
        </g>
      ))}
      {/* Tower */}
      <rect x="0" y="-236" width="66" height="236" fill="#f4eadc" />
      <rect x="46" y="-236" width="20" height="236" fill="#e2d4c0" />
      <path d="M18 0 V-40 Q33 -60 48 -40 V0 Z" fill="#7f5539" />
      <path d="M33 -48 V0" stroke="#6f4520" strokeWidth="2" />
      <circle cx="33" cy="-150" r="19" fill="#fff" stroke="#c9a227" strokeWidth="4" />
      {[0, 90, 180, 270].map((a) => (
        <circle key={a} cx={33 + 13 * Math.sin((a * Math.PI) / 180)} cy={-150 - 13 * Math.cos((a * Math.PI) / 180)} r="1.8" fill={INK} />
      ))}
      <path className="wi-kirche-hour" d="M33 -150 V-161" stroke={INK} strokeWidth="3.5" strokeLinecap="round" style={{ transformOrigin: "33px -150px" }} />
      <path className="wi-kirche-minute" d="M33 -150 H46" stroke={INK} strokeWidth="2.5" strokeLinecap="round" style={{ transformOrigin: "33px -150px" }} />
      <path d="M14 -186 V-208 Q33 -230 52 -208 V-186 Z" fill="#4a3b33" />
      <g className="wi-kirche-bell" style={{ transformOrigin: "33px -216px" }}>
        <path d="M33 -216 V-212" stroke="#c9a227" strokeWidth="3" />
        <path d="M22 -190 Q22 -212 33 -212 Q44 -212 44 -190 Q33 -186 22 -190 Z" fill="#e9c46a" />
        <path d="M26 -192 Q26 -206 31 -208" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" fill="none" />
        <circle cx="33" cy="-187" r="3.5" fill="#c9a227" />
      </g>
      <g className="wi-kirche-ring" stroke="#ffd166" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M6 -214 q-10 14 0 28" style={nth(0)} />
        <path d="M60 -214 q10 14 0 28" style={nth(0)} />
        <path d="M-6 -222 q-16 22 0 44" style={nth(1)} />
        <path d="M72 -222 q16 22 0 44" style={nth(1)} />
      </g>
      <rect x="-5" y="-242" width="76" height="9" rx="2" fill="#d8c8b0" />
      <Cap x={-5} y={-242} w={76} h={6} />
      {/* Spire with a weather rooster */}
      <path d="M-2 -242 L33 -330 L68 -242 Z" fill={STEEPLE} />
      <path d="M33 -330 L68 -242 H33 Z" fill="#3d6f66" />
      <path d="M-2 -242 L33 -330 L26 -300 Q16 -280 8 -256 Z" fill={SNOW} opacity="0.9" />
      <path d="M33 -330 V-344" stroke={INK} strokeWidth="3" />
      <g className="wi-kirche-hahn" style={{ transformOrigin: "33px -350px" }}>
        <path d="M22 -348 Q24 -362 34 -360 L38 -368 L40 -358 Q50 -356 46 -346 Q34 -342 22 -348 Z" fill="#e9c46a" stroke="#c9a227" strokeWidth="1.5" />
        <path d="M22 -350 L16 -347 L22 -345 Z" fill="#c9a227" />
      </g>
    </>
  );
}

// ---------- Futterkrippe ----------

/** A wooden feeding rack for the deer with hay and carrots; hay drops out and the snow slides off the roof. */
export function Futterkrippe() {
  return (
    <>
      <path d="M-86 2 Q0 -14 86 2 Z" fill={SNOW} />
      <rect x="-58" y="-122" width="9" height="114" fill={WOOD_DARK} />
      <rect x="49" y="-122" width="9" height="114" fill={WOOD_DARK} />
      <g className="wi-krippe-rack" style={{ transformOrigin: "0px -62px" }}>
        <path d="M-62 -116 L62 -116 L38 -62 L-38 -62 Z" fill="#6f4520" />
        <path d="M-58 -112 Q-52 -134 -38 -118 Q-26 -140 -12 -118 Q2 -142 16 -118 Q30 -138 42 -116 Q54 -132 58 -112 Z" fill="#e9c46a" />
        <path d="M-40 -122 l6 -10 M-6 -124 l-4 -12 M24 -122 l6 -10" stroke="#d4a017" strokeWidth="3" strokeLinecap="round" />
        <path d="M-58 -112 L58 -112 L36 -66 L-36 -66 Z" fill="#e9c46a" opacity="0.7" />
        {[-4, -2, 0, 2, 4].map((i) => (
          <path key={i} d={`M${i * 13} -116 L${i * 8} -62`} stroke={WOOD} strokeWidth="5" strokeLinecap="round" />
        ))}
      </g>
      <g className="wi-krippe-hay" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round">
        {[-30, -8, 14, 32].map((x, i) => (
          <path key={x} d={`M${x} -64 l6 6`} style={nth(i)} />
        ))}
      </g>
      <rect x="-52" y="-48" width="104" height="18" rx="3" fill="#a0522d" />
      <path d="M-46 -48 H46" stroke="#e9c46a" strokeWidth="4" />
      <path d="M-30 -52 L-6 -50 L-30 -46 Z" fill="#f77f00" />
      <path d="M-30 -50 l-6 -4 M-30 -50 l-6 2" stroke="#2d6a4f" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="18" cy="-52" r="7" fill="#e63946" />
      <path d="M18 -59 l2 -4" stroke={WOOD_DARK} strokeWidth="2" />
      <rect x="-70" y="-126" width="11" height="126" fill={WOOD} />
      <rect x="59" y="-126" width="11" height="126" fill={WOOD} />
      <path d="M-70 -4 Q-64 -14 -58 -4 Z M58 -4 Q64 -14 70 -4 Z" fill={SNOW} />
      {/* Roof with snow */}
      <path d="M-88 -116 L0 -168 L88 -116 Z" fill="#7a4a35" />
      <path d="M-94 -114 Q-92 -124 -82 -126 L0 -176 L82 -126 Q92 -124 94 -114 Q80 -108 70 -118 L0 -160 L-70 -118 Q-80 -108 -94 -114 Z" fill={SNOW} />
      <path d="M0 -176 L82 -126 Q92 -124 94 -114 Q86 -112 78 -118 L0 -164 Z" fill={SNOW_SHADE} />
      <g className="wi-krippe-lump" fill={SNOW}>
        {[
          [-62, -128],
          [52, -132],
        ].map(([cx, cy], i) => (
          <ellipse key={cx} cx={cx} cy={cy} rx="12" ry="7" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Parkbank and Kakao ----------

/** A park bench under snow; the snow on the backrest plops down. */
export function Parkbank() {
  return (
    <>
      <g className="wi-bank-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-90" y="-46" width="8" height="46" rx="2" fill={INK} />
        <rect x="82" y="-46" width="8" height="46" rx="2" fill={INK} />
        <rect x="-88" y="-104" width="7" height="60" fill={INK} />
        <rect x="81" y="-104" width="7" height="60" fill={INK} />
        <rect x="-100" y="-100" width="200" height="12" rx="3" fill="#a0703f" />
        <rect x="-100" y="-80" width="200" height="12" rx="3" fill="#a0703f" />
        <rect x="-100" y="-50" width="200" height="9" rx="2" fill="#b5804a" />
        <rect x="-100" y="-41" width="200" height="7" rx="2" fill="#8d5a2b" />
        <Cap x={-100} y={-100} w={200} h={8} />
        <Cap x={-100} y={-50} w={116} h={8} />
      </g>
      <g className="wi-bank-lump" fill={SNOW} stroke={SNOW_SHADE} strokeWidth="2">
        <ellipse cx="-36" cy="-108" rx="28" ry="10" />
      </g>
      <g className="wi-bank-puff" fill={SNOW}>
        {[-56, -36, -16].map((x, i) => (
          <circle key={x} cx={x} cy="-6" r="9" style={nth(i)} />
        ))}
      </g>
      <g className="wi-bank-glint" fill="#fff">
        <path d={glint(-80, -120, 9)} style={nth(0)} />
        <path d={glint(70, -116, 7)} style={nth(1)} />
      </g>
    </>
  );
}

/** A thermos flask and a mug of hot cocoa on the bench (in the bench's coordinates). */
export function Kakao() {
  return (
    <>
      <g className="wi-kakao-steam" fill="#fff">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={74 + i * 5} cy="-78" r="5" style={nth(i)} />
        ))}
      </g>
      <path className="wi-kakao-heart" d={heartPath(80, -104, 7)} fill="#ff5d8f" />
      <rect x="36" y="-92" width="22" height="42" rx="6" fill="#e63946" />
      <rect x="36" y="-80" width="22" height="6" fill="#fff" opacity="0.8" />
      <rect x="40" y="-88" width="4" height="30" rx="2" fill="#fff" opacity="0.35" />
      <g className="wi-kakao-cap" style={{ transformOrigin: "36px -92px" }}>
        <rect x="34" y="-100" width="26" height="10" rx="3" fill="#adb5bd" />
      </g>
      <g className="wi-kakao-mug" style={{ transformOrigin: "78px -50px" }}>
        <path d="M86 -70 q10 0 10 8 q0 8 -10 8" stroke="#4dabf7" strokeWidth="4" fill="none" />
        <rect x="66" y="-74" width="22" height="24" rx="4" fill="#4dabf7" />
        <ellipse cx="77" cy="-73" rx="10" ry="2.6" fill="#7f4f24" />
        <circle cx="74" cy="-74" r="2.4" fill="#fff" />
        <circle cx="80" cy="-73" r="2" fill="#fff" />
        <path d="M70 -66 v10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      </g>
    </>
  );
}

// ---------- Handschuh ----------

/** A lost red mitten lying in the snow, its open cuff towards us; every time something else peeks out. */
export function Handschuh() {
  return (
    <>
      <path d="M-62 0 Q0 -20 62 0 Z" fill={SNOW} />
      <g className="wi-mitten" style={{ transformOrigin: "0px 0px" }}>
        <g className="wi-mitten-thumb" style={{ transformOrigin: "34px -40px" }}>
          <ellipse cx="46" cy="-56" rx="13" ry="20" fill="#c1121f" transform="rotate(30 46 -56)" />
        </g>
        <path d="M-40 -26 Q-46 -84 0 -88 Q46 -84 40 -26 Z" fill="#e63946" />
        <path d="M14 -84 Q40 -80 40 -26 H24 Q28 -70 14 -84 Z" fill="#c1121f" opacity="0.6" />
        <path d="M-22 -70 l8 -8 l8 8 l8 -8 l8 8 l8 -8" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M-6 -56 h12 M0 -62 v12 M-4 -60 l8 8 M4 -60 l-8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="0" cy="-24" rx="40" ry="20" fill="#fff" />
        <ellipse cx="0" cy="-25" rx="30" ry="13" fill="#7a1c24" />
        <Hideout x={-30} y={-78} w={60} h={54} size={44} />
        {/* Front half of the cuff, so whoever is inside sits in the mitten */}
        <path d="M-40 -24 A40 20 0 0 0 40 -24 L30 -25 A30 13 0 0 1 -30 -25 Z" fill="#fff" />
        <path d="M-36 -16 v8 M-24 -10 v8 M-12 -8 v8 M0 -7 v8 M12 -8 v8 M24 -10 v8 M36 -16 v8" stroke="#dbe7f3" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="wi-mitten-glint" fill="#fff">
        <path d={glint(-50, -78, 9)} style={nth(0)} />
        <path d={glint(58, -26, 7)} style={nth(1)} />
      </g>
    </>
  );
}

// ---------- Schneeflocke ----------

/** A big snowflake with a little face; it spins and glitters. */
export function Schneeflocke() {
  const arm = "M0 -14 V-48 M0 -28 L-12 -38 M0 -28 L12 -38 M0 -40 L-8 -48 M0 -40 L8 -48";
  return (
    <>
      <g className="wi-flocke-glint" fill="#fff">
        {[
          [-56, -40],
          [52, -48],
          [48, 46],
          [-50, 44],
        ].map(([x, y], i) => (
          <path key={x} d={glint(x, y, 10)} style={nth(i)} />
        ))}
      </g>
      <g className="wi-flocke-arms" style={{ transformOrigin: "0px 0px" }}>
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} transform={`rotate(${a})`} strokeLinecap="round" fill="none">
            <path d={arm} stroke="#a5d8ff" strokeWidth="10" />
            <path d={arm} stroke="#fff" strokeWidth="6" />
          </g>
        ))}
      </g>
      <g className="wi-flocke-face" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="0" cy="0" r="19" fill="#fff" stroke="#a5d8ff" strokeWidth="3" />
        <Face cx={0} cy={-3} size={0.62} />
        <Lids
          eyes={[
            [-4.34, -3],
            [4.34, -3],
          ]}
          r={2.6}
          fill="#fff"
        />
      </g>
    </>
  );
}
