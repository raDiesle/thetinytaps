import { Eye, INK, Inside, Pane, Rider, SKIN, nth } from "../shared";
import { Drops, FOAM, Head, Lid, Notes, Puffs, Ripples, SEA } from "./parts";

// Far out on the sea: the lighthouse on its rock, the sailing boat, the big ferry, the
// dolphin, the rowing boat and the buoy. Everything floats with its foot point (0, 0) on
// the water line; parts below it are seen through the water.

/** Half the width of the lighthouse at height y: it gets narrower towards the top. */
const towerHalf = (y: number) => 32 - ((-40 - y) / 210) * 12;
/** A band of the tower between the heights y1 (lower) and y2 (upper). */
const band = (y1: number, y2: number) => `M${-towerHalf(y1)} ${y1} L${-towerHalf(y2)} ${y2} H${towerHalf(y2)} L${towerHalf(y1)} ${y1} Z`;
const LIGHTHOUSE_DOOR = "M-11 -42 V-66 Q0 -78 11 -66 V-42 Z";

/** The lighthouse: its lamp flashes round and round, the keeper opens the door and waves, the sea splashes on the rock. */
export function Leuchtturm() {
  return (
    <>
      <g className="sd-leucht-beams" fill="#fff3b0">
        <path className="sd-leucht-beam-left" d="M0 -281 L-190 -330 V-232 Z" />
        <path className="sd-leucht-beam-right" d="M0 -281 L190 -330 V-232 Z" />
      </g>
      {/* The rock, with the water splashing round its foot */}
      <path d="M-112 6 Q-100 -34 -60 -44 Q-10 -60 44 -48 Q96 -36 112 6 Z" fill="#8d7b68" />
      <path d="M-84 -22 Q-40 -46 10 -46" stroke="#b5a48f" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M40 -40 Q72 -30 88 -8" stroke="#6f5e4d" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d={band(-40, -250)} fill="#fff" />
      <path d={`${band(-86, -118)} ${band(-150, -182)} ${band(-214, -246)}`} fill="#e63946" />
      <path d={`M${-towerHalf(-44) + 8} -44 L${-towerHalf(-246) + 6} -246`} stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" />
      <path d={`M${towerHalf(-44) - 4} -44 L${towerHalf(-246) - 3} -246`} stroke="#000" strokeOpacity="0.08" strokeWidth="8" />
      {/* A little window that lights up */}
      <rect x="-7" y="-140" width="14" height="18" rx="7" fill={INK} />
      <rect className="sd-leucht-window" x="-7" y="-140" width="14" height="18" rx="7" fill="#ffe066" />
      {/* The keeper waits in the dark doorway until the door opens */}
      <path d={LIGHTHOUSE_DOOR} fill={INK} />
      <Inside d={LIGHTHOUSE_DOOR}>
        <g className="sd-leucht-keeper">
          <rect x="-8" y="-50" width="16" height="12" rx="4" fill="#1d3557" />
          <circle cx="0" cy="-57" r="7" fill={SKIN} />
          <path d="M-7 -59 Q0 -68 7 -59 Z" fill="#1d3557" />
          <circle cx="-2.5" cy="-57" r="1.2" fill={INK} />
          <circle cx="2.5" cy="-57" r="1.2" fill={INK} />
        </g>
      </Inside>
      <path className="sd-leucht-door" d={LIGHTHOUSE_DOOR} fill="#9c6644" style={{ transformOrigin: "-11px -54px" }} />
      <circle cx="6" cy="-54" r="2" fill="#ffd43b" />
      {/* Gallery, lamp room and roof */}
      <rect x="-32" y="-262" width="64" height="12" rx="4" fill="#495057" />
      <path d="M-30 -262 V-274 M-18 -262 V-274 M-6 -262 V-274 M6 -262 V-274 M18 -262 V-274 M30 -262 V-274 M-32 -274 H32" stroke="#495057" strokeWidth="3" />
      <rect x="-18" y="-300" width="36" height="38" rx="5" fill="#d0ebff" />
      <circle className="sd-leucht-lamp" cx="0" cy="-281" r="13" fill="#ffd43b" />
      <path d="M-18 -300 V-262 M18 -300 V-262" stroke="#495057" strokeWidth="4" />
      <path d="M-24 -298 Q0 -334 24 -298 Z" fill="#e63946" />
      <circle cx="0" cy="-326" r="5" fill="#495057" />
      <path d="M-10 -306 Q-4 -318 6 -322" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" fill="none" />
      <Puffs
        className="sd-leucht-splash"
        spots={[
          [-100, -8],
          [-80, -20],
          [86, -16],
          [104, -6],
        ]}
        r={10}
        fill={FOAM}
      />
    </>
  );
}

/** The sailing boat: it rocks, the sails fill with wind, the flag flutters and the sailor waves. */
export function Segelboot() {
  return (
    <g className="sd-segel-rock" style={{ transformOrigin: "0px 0px" }}>
      <path d="M2 -236 V-24" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" />
      <g className="sd-segel-flag" style={{ transformOrigin: "2px -238px" }}>
        <path d="M2 -248 L34 -240 L2 -230 Z" fill="#ffd43b" />
      </g>
      <g className="sd-segel-main" style={{ transformOrigin: "6px -130px" }}>
        <path d="M6 -228 Q70 -150 110 -40 H6 Z" fill="#fff" />
        <path d="M6 -150 H72 M6 -96 H94" stroke="#4dabf7" strokeWidth="10" />
        <path d="M18 -200 Q50 -140 70 -60" stroke="#fff" strokeOpacity="0.8" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g className="sd-segel-jib" style={{ transformOrigin: "-2px -120px" }}>
        <path d="M-2 -206 Q-50 -130 -80 -44 H-2 Z" fill="#ff6b6b" />
        <path d="M-14 -170 Q-40 -120 -54 -60" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      {/* The sailor sits behind the side of the boat */}
      <g className="sd-segel-sailor">
        <rect x="-62" y="-50" width="30" height="26" rx="10" fill="#ffd43b" />
        <Head cx={-47} cy={-62} r={15} hair="#e9c46a" cap="#1d3557" />
        <g className="sd-segel-arm" style={{ transformOrigin: "-36px -44px" }}>
          <path d="M-36 -44 L-20 -76" stroke="#ffd43b" strokeWidth="9" strokeLinecap="round" />
          <circle cx="-19" cy="-79" r="5.5" fill={SKIN} />
        </g>
      </g>
      <path d="M-104 -30 H112 Q100 4 64 10 H-70 Q-96 2 -104 -30 Z" fill="#1d3557" />
      <path d="M-104 -30 H112 L109 -20 H-101 Z" fill="#fff" />
      <path d="M-70 -6 H60" stroke="#fff" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round" />
      <Inside d="M-104 -30 H112 Q100 4 64 10 H-70 Q-96 2 -104 -30 Z">
        <rect x="-110" y="0" width="230" height="20" fill={SEA} opacity="0.5" />
      </Inside>
      <Drops
        className="sd-segel-splash"
        spots={[
          [-110, -24],
          [-96, -36],
          [116, -26],
        ]}
        r={6}
      />
    </g>
  );
}

// The ferry faces left. Windows on its two decks: [x, y, w].
const FERRY_WINDOWS = [
  [-104, -80, 26],
  [-68, -80, 26],
  [-32, -80, 26],
  [4, -80, 26],
  [40, -80, 26],
  [76, -80, 26],
  [-56, -120, 22],
  [-24, -120, 22],
  [8, -120, 22],
];
const FERRY_HULL = "M-196 -42 H186 L176 -4 Q166 18 126 22 H-148 Q-180 10 -196 -42 Z";

/** The big ferry: it toots, smoke puffs from the funnel, the lights go on deck by deck and the captain waves. */
export function Schiff() {
  return (
    <g className="sd-schiff-body" style={{ transformOrigin: "0px 10px" }}>
      <Puffs
        className="sd-schiff-puff"
        spots={[
          [66, -200],
          [80, -224],
          [96, -250],
        ]}
        r={14}
        fill="#f1f3f5"
      />
      {/* Funnel */}
      <path d="M48 -132 L54 -190 H94 L98 -132 Z" fill="#e63946" />
      <path d="M53 -178 H95 L94 -190 H54 Z" fill={INK} />
      <path d="M50 -160 H97" stroke="#fff" strokeWidth="6" />
      {/* Decks */}
      <rect x="-124" y="-94" width="240" height="54" rx="8" fill="#fff" />
      <rect x="-76" y="-134" width="150" height="42" rx="8" fill="#f8f9fa" />
      <path d="M-128 -96 H120 M-80 -136 H78" stroke="#1d3557" strokeWidth="5" strokeLinecap="round" />
      {FERRY_WINDOWS.map(([x, y, w]) => (
        <rect key={`${x}${y}`} x={x} y={y} width={w} height="22" rx="5" fill="#bde0fe" />
      ))}
      {FERRY_WINDOWS.map(([x, y, w], i) => (
        <rect key={`l${x}${y}`} className="sd-schiff-light" x={x} y={y} width={w} height="22" rx="5" fill="#ffe066" style={nth(i)} />
      ))}
      {/* The bridge at the front, with the captain */}
      <path d="M-120 -134 H-80 V-92 H-128 Z" fill="#f8f9fa" />
      <Pane x={-118} y={-128} w={34} h={26} rx={5}>
        <Rider cx={-101} cy={-112} shirt="#1d3557" cap="#fff" />
      </Pane>
      <g className="sd-schiff-arm" style={{ transformOrigin: "-120px -104px" }}>
        <path d="M-120 -104 L-138 -128" stroke="#1d3557" strokeWidth="8" strokeLinecap="round" />
        <circle cx="-140" cy="-131" r="5.5" fill={SKIN} />
      </g>
      {/* Mast and flag at the back */}
      <path d="M150 -42 V-112" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
      <g className="sd-schiff-flag" style={{ transformOrigin: "150px -108px" }}>
        <path d="M150 -112 L182 -104 L150 -94 Z" fill="#4dabf7" />
      </g>
      {/* Hull with portholes; below the water line it is seen through the sea */}
      <path d={FERRY_HULL} fill="#1d3557" />
      <path d="M-196 -42 H186 L183 -32 H-192 Z" fill="#fff" />
      <path d="M-170 -2 H150" stroke="#e63946" strokeWidth="8" strokeLinecap="round" />
      {[-140, -100, -60, -20, 20, 60, 100, 140].map((x) => (
        <circle key={x} cx={x} cy="-18" r="6" fill="#bde0fe" />
      ))}
      <Inside d={FERRY_HULL}>
        <rect x="-200" y="2" width="400" height="24" fill={SEA} opacity="0.5" />
      </Inside>
      <Drops
        className="sd-schiff-wave"
        spots={[
          [-204, -30],
          [-188, -46],
          [-174, -32],
        ]}
        r={7}
      />
      <Notes x={-200} y={-150} texts={["Tuut!", "Tuut!"]} colour="#fff" size={30} />
    </g>
  );
}

/** The dolphin pokes its head out of the water; it leaps in an arc and dives back in. */
export function Delfin() {
  return (
    <>
      <Ripples cx={0} cy={0} rx={64} />
      {/* The part below the water line is hidden; when it leaps, the whole dolphin shows. */}
      <Inside d="M-260 -400 H260 V0 Q200 -6 140 0 Q80 6 20 0 Q-40 -6 -100 0 Q-170 6 -260 0 Z">
        <g className="sd-delfin-jump" style={{ transformOrigin: "0px 0px" }}>
          <g transform="translate(0 -8) rotate(-40)">
            <path d="M-100 -18 Q-94 0 -100 18 L-76 4 V-4 Z" fill="#4f8ec4" />
            <path d="M-12 -26 Q0 -56 22 -52 Q12 -40 14 -26 Z" fill="#4f8ec4" />
            <path d="M-80 0 Q-60 -28 0 -30 Q52 -30 72 -10 L94 -6 Q92 2 72 2 Q52 22 0 20 Q-52 16 -80 0 Z" fill="#6fa8dc" />
            <path d="M-46 10 Q0 24 66 4 Q46 18 0 20 Q-30 18 -46 10 Z" fill="#dbe9fb" />
            <path d="M-50 -14 Q-10 -28 40 -20" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M8 12 L-8 34 L26 16 Z" fill="#4f8ec4" />
            <path d="M74 2 Q62 9 50 4" stroke={INK} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <Eye cx={54} cy={-10} r={4} />
            <Lid cx={54} cy={-10} r={4} fill="#6fa8dc" />
          </g>
        </g>
      </Inside>
      <Drops
        className="sd-delfin-splash"
        spots={[
          [-50, -10],
          [-30, -24],
          [30, -20],
          [52, -8],
        ]}
        r={7}
      />
      <Notes x={70} y={-120} texts={["Ki-ki!"]} colour="#a5d8ff" size={26} />
    </>
  );
}

const ROWING_HULL = "M-118 -36 H112 Q102 0 70 12 H-80 Q-108 -2 -118 -36 Z";

/** The rowing boat: it rocks on the waves, the fisher rows, and a fish hangs on the line. */
export function Boot() {
  return (
    <g className="sd-boot-rock" style={{ transformOrigin: "0px 0px" }}>
      {/* The fishing rod with its line; the fish is only there while it plays */}
      <g className="sd-boot-rod" style={{ transformOrigin: "64px -40px" }}>
        <path d="M64 -40 L150 -170" stroke="#6b4423" strokeWidth="5" strokeLinecap="round" />
        <path d="M150 -170 V-30" stroke="#868e96" strokeWidth="2" />
        <g className="sd-boot-fish">
          <path d="M150 -46 Q166 -30 150 -12 Q134 -30 150 -46 Z" fill="#ffa94d" />
          <path d="M150 -14 L140 0 H160 Z" fill="#ff922b" />
          <circle cx="147" cy="-36" r="2" fill={INK} />
        </g>
        <circle cx="150" cy="-30" r="5" fill="#e63946" />
      </g>
      {/* The fisher in a yellow raincoat */}
      <rect x="-30" y="-84" width="44" height="52" rx="14" fill="#ffd43b" />
      <path d="M-30 -60 H14" stroke="#fab005" strokeWidth="4" />
      <Head cx={-8} cy={-102} r={20} hair="#adb5bd" cap="#ffd43b" />
      <path d="M-26 -88 Q-8 -72 10 -88 Q8 -76 -8 -74 Q-24 -76 -26 -88 Z" fill="#dee2e6" />
      <g className="sd-boot-oar" style={{ transformOrigin: "-20px -56px" }}>
        <path d="M-20 -56 L-104 12" stroke="#a0673a" strokeWidth="7" strokeLinecap="round" />
        <path d="M-96 2 L-124 24 L-112 34 L-86 12 Z" fill="#c98b4f" />
        <circle cx="-20" cy="-56" r="6" fill={SKIN} />
      </g>
      <path d={ROWING_HULL} fill="#c98b4f" />
      <path d="M-114 -24 H108 M-104 -10 H100" stroke="#a0673a" strokeWidth="4" />
      <path d="M-118 -36 H112" stroke="#8d5a2b" strokeWidth="7" strokeLinecap="round" />
      <Inside d={ROWING_HULL}>
        <rect x="-120" y="0" width="240" height="20" fill={SEA} opacity="0.5" />
      </Inside>
      <Drops
        className="sd-boot-splash"
        spots={[
          [-120, 0],
          [-104, -12],
          [-134, -10],
          [150, -12],
        ]}
        r={6}
      />
    </g>
  );
}

/** The red buoy: it bobs and tilts, its bell swings and rings. */
export function Boje() {
  return (
    <>
      <Ripples cx={0} cy={0} rx={50} />
      <g className="sd-boje-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-30 -110 H30 M-30 -110 L-6 -150 M30 -110 L6 -150 M0 -150 V-110" stroke="#495057" strokeWidth="5" strokeLinecap="round" />
        <g className="sd-boje-bell" style={{ transformOrigin: "0px -148px" }}>
          <path d="M-14 -116 Q-14 -144 0 -144 Q14 -144 14 -116 Z" fill="#fab005" />
          <circle cx="0" cy="-114" r="4" fill="#e67700" />
        </g>
        <path d="M-42 -8 L-30 -110 H30 L42 -8 Q0 4 -42 -8 Z" fill="#e63946" />
        <path d="M-37 -50 L-34 -76 H34 L37 -50 Z" fill="#fff" />
        <path d="M-24 -100 L-30 -20" stroke="#fff" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
        <Inside d="M-42 -8 L-30 -110 H30 L42 -8 Q0 4 -42 -8 Z">
          <rect x="-50" y="-6" width="100" height="14" fill={SEA} opacity="0.5" />
        </Inside>
      </g>
      <Notes x={24} y={-160} texts={["Bing!", "Bong!"]} colour="#ffd43b" size={24} />
    </>
  );
}
