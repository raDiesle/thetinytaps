import { GLASS, Inside, Pane, Rider, nth } from "../shared";
import { Dust, Helmet, SUIT, Sparkles, ellipsePath, starPath } from "./parts";

// The things at the horizon and the greenhouse: rocket, flag, lander, solar panels, moon base,
// dish and greenhouse. Each drawing has its foot point at (0, 0) and is placed with `ground`.

/** The red and white rocket: it rumbles, flies up out of the picture and lands again. */
export function Rakete() {
  const window = ellipsePath(0, -300, 20);
  return (
    <>
      <Dust className="wa-rakete-smoke" spots={[[-96, -14], [-56, -4], [0, 4], [56, -4], [96, -14]]} r={30} />
      <g className="wa-rakete-body">
        <g className="wa-rakete-flame" style={{ transformOrigin: "0px -40px" }}>
          <path d="M-28 -42 Q-20 30 0 70 Q20 30 28 -42 Z" fill="#ff8c42" />
          <path d="M-16 -42 Q-10 10 0 36 Q10 10 16 -42 Z" fill="#ffd60a" />
        </g>
        <path d="M-46 -160 Q-92 -110 -88 -40 L-46 -70 Z" fill="#e63946" />
        <path d="M46 -160 Q92 -110 88 -40 L46 -70 Z" fill="#c1121f" />
        <path d="M-32 -64 L32 -64 L40 -40 L-40 -40 Z" fill="#6c757d" />
        <path d="M-46 -64 V-380 Q-46 -440 0 -512 Q46 -440 46 -380 V-64 Z" fill="#f8f9fa" />
        <path d="M18 -64 V-380 Q22 -450 0 -512 Q46 -440 46 -380 V-64 Z" fill="#dee2e6" />
        <path d="M-41 -410 Q-30 -455 0 -512 Q30 -455 41 -410 Z" fill="#e63946" />
        <path d="M14 -410 Q12 -470 0 -512 Q30 -455 41 -410 Z" fill="#c1121f" />
        <rect x="-46" y="-132" width="92" height="18" fill="#e63946" />
        <rect x="-46" y="-104" width="92" height="8" fill="#e63946" />
        <path d="M-8 -150 L8 -150 L10 -40 L-10 -40 Z" fill="#c1121f" />
        <path d="M-32 -380 V-150" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
        <circle cx="0" cy="-300" r="27" fill="#adb5bd" />
        <circle cx="0" cy="-300" r="20" fill={GLASS} />
        <Inside d={window}>
          <g className="wa-rakete-pilot" style={{ transformOrigin: "0px -286px" }}>
            <Helmet cx={0} cy={-298} r={17} />
          </g>
        </Inside>
        <path d="M-12 -314 Q-4 -320 6 -318" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />
        {[-220, -200, -180].map((y, i) => (
          <circle key={y} className="wa-rakete-light" cx="0" cy={y} r="6" fill={["#ffd60a", "#69db7c", "#4dabf7"][i]} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The flag on its pole: it flutters and its star sparkles. */
export function Flagge() {
  return (
    <>
      <ellipse cx="0" cy="-2" rx="22" ry="6" fill="#a9abbf" />
      <g className="wa-flagge-pole" style={{ transformOrigin: "0px 0px" }}>
        <path d="M0 0 V-186" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
        <path d="M0 -180 H100" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round" />
        <circle cx="0" cy="-190" r="6" fill="#ffd60a" />
        <g className="wa-flagge-cloth" style={{ transformOrigin: "0px -150px" }}>
          <path d="M2 -178 Q50 -172 98 -178 V-118 Q50 -112 2 -120 Z" fill="#e63946" />
          <path d="M2 -128 Q50 -122 98 -128 V-118 Q50 -112 2 -120 Z" fill="#c1121f" />
          <path d={starPath(50, -150, 18)} fill="#ffd60a" />
        </g>
        <Sparkles className="wa-flagge-sparkle" spots={[[50, -150], [86, -176]]} r={14} />
      </g>
    </>
  );
}

/** The golden moon lander: it bounces on its legs, the hatch opens and an astronaut looks out. */
export function Landefaehre() {
  const hatch = "M6 -204 h40 v42 h-40 Z";
  return (
    <>
      <Dust className="wa-lander-dust" spots={[[-124, -8], [-64, 0], [64, 0], [124, -8]]} r={18} />
      <path d="M-60 -110 L-96 -10 M60 -110 L96 -10" stroke="#ced4da" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="-96" cy="-8" rx="14" ry="4" fill="#ced4da" />
      <ellipse cx="96" cy="-8" rx="14" ry="4" fill="#ced4da" />
      <g className="wa-lander-body">
        <path d="M-76 -104 L-124 -10 M76 -104 L124 -10" stroke="#adb5bd" strokeWidth="9" strokeLinecap="round" />
        <path d="M-84 -100 L-104 -50 M84 -100 L104 -50" stroke="#ced4da" strokeWidth="4" />
        <ellipse cx="-124" cy="-6" rx="20" ry="6" fill="#adb5bd" />
        <ellipse cx="124" cy="-6" rx="20" ry="6" fill="#adb5bd" />
        <path d="M-22 -96 L22 -96 L30 -70 L-30 -70 Z" fill="#6c757d" />
        <path d="M-86 -160 H86 L80 -96 H-80 Z" fill="#f4c542" />
        <path d="M-82 -110 H82 L80 -96 H-80 Z" fill="#e0a800" />
        <path
          d="M-70 -148 L-50 -136 L-30 -150 L-6 -134 L20 -152 L44 -136 L70 -150 M-66 -122 L-40 -112 L-16 -124 L12 -110 L40 -124 L66 -114"
          stroke="#e0a800"
          strokeWidth="3"
          fill="none"
          strokeLinejoin="round"
        />
        <rect x="-82" y="-220" width="10" height="16" rx="3" fill="#868e96" />
        <rect x="72" y="-220" width="10" height="16" rx="3" fill="#868e96" />
        <Dust className="wa-lander-puff" spots={[[-94, -212], [94, -212]]} r={10} />
        <path d="M-62 -160 L-72 -206 L-46 -246 H46 L72 -206 L62 -160 Z" fill="#e9ecef" />
        <path d="M30 -246 H46 L72 -206 L62 -160 H44 Z" fill="#dee2e6" />
        <Pane x={-48} y={-232} w={36} h={30} rx={6}>
          <g className="wa-lander-pilot">
            <Rider cx={-30} cy={-212} shirt={SUIT} />
          </g>
        </Pane>
        <path d={hatch} fill="#343a40" />
        <Inside d={hatch}>
          <g className="wa-lander-peek">
            <Helmet cx={26} cy={-180} r={17} hair="#2b2d42" />
          </g>
        </Inside>
        <g className="wa-lander-hatch" style={{ transformOrigin: "6px -183px" }}>
          <path d={hatch} fill="#ced4da" stroke="#adb5bd" strokeWidth="3" />
          <circle cx="38" cy="-183" r="3.5" fill="#868e96" />
        </g>
        <path d="M30 -246 L40 -266" stroke="#868e96" strokeWidth="3" />
        <g className="wa-lander-dish" style={{ transformOrigin: "40px -268px" }}>
          <path d="M24 -274 Q40 -258 56 -274 Q40 -282 24 -274 Z" fill="#f1f3f5" stroke="#ced4da" strokeWidth="2" />
        </g>
        <circle className="wa-lander-light" cx="-36" cy="-250" r="6" fill="#ff6b6b" />
      </g>
    </>
  );
}

/** Two solar panels on a stand: they turn to the sun, a gleam runs over them and the lamp blinks. */
export function Solarzellen() {
  return (
    <>
      <path d="M0 0 V-66" stroke="#868e96" strokeWidth="8" />
      <path d="M26 -14 Q60 -4 92 -2" stroke="#495057" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="-26" y="-32" width="52" height="32" rx="5" fill="#ced4da" />
      <rect x="-26" y="-10" width="52" height="10" rx="4" fill="#adb5bd" />
      <circle className="wa-solar-lamp" cx="12" cy="-20" r="5" fill="#69db7c" />
      <g className="wa-solar-panel" style={{ transformOrigin: "0px -70px" }}>
        <rect x="-114" y="-70" width="228" height="7" rx="3" fill="#868e96" />
        <rect x="-112" y="-124" width="106" height="56" rx="4" fill="#3a6fd8" />
        <rect x="6" y="-124" width="106" height="56" rx="4" fill="#3a6fd8" />
        <path d="M-112 -96 H-6 M6 -96 H112 M-77 -124 V-68 M-41 -124 V-68 M41 -124 V-68 M77 -124 V-68" stroke="#74a7ff" strokeWidth="3" />
        <Inside d="M-112 -124 h106 v56 h-106 Z M6 -124 h106 v56 h-106 Z">
          <path className="wa-solar-shine" d="M-164 -62 L-140 -130 L-116 -130 L-140 -62 Z" fill="#fff" opacity="0.65" />
        </Inside>
      </g>
      <Sparkles className="wa-solar-sparkle" spots={[[-70, -142], [70, -142]]} r={11} fill="#fff3bf" />
    </>
  );
}

const BASE_WINDOWS = [
  [-10, -82, 16],
  [44, -42, 13],
  [174, -30, 14],
];

/** The moon base with its big dome: the door opens, someone waves, the windows light up and the beacon blinks. */
export function Mondbasis() {
  const door = "M-96 0 V-52 A26 26 0 0 1 -44 -52 V0 Z";
  const peek = ellipsePath(-10, -82, 12);
  return (
    <>
      <g className="wa-basis-ant" style={{ transformOrigin: "-40px -128px" }}>
        <path d="M-40 -128 V-168 M-52 -156 H-28" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
        <circle className="wa-basis-beacon" cx="-40" cy="-172" r="7" fill="#ff6b6b" />
      </g>
      <rect x="66" y="-48" width="60" height="34" rx="15" fill="#ced4da" />
      <path d="M86 -48 V-14 M106 -48 V-14" stroke="#adb5bd" strokeWidth="3" />
      <path d="M112 0 A62 62 0 0 1 236 0 Z" fill="#e9ecef" />
      <path d="M200 -56 A62 62 0 0 1 236 0 H210 Q212 -30 200 -56 Z" fill="#dee2e6" />
      <path d="M126 -24 Q150 -56 176 -60" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M-170 0 A130 130 0 0 1 90 0 Z" fill="#f1f3f5" />
      <path d="M40 -120 A130 130 0 0 1 90 0 H54 Q62 -64 40 -120 Z" fill="#e3e5ea" />
      <path d="M-40 -130 V0 M-124 -100 Q-40 -86 44 -100 M-160 -50 Q-40 -36 80 -50" stroke="#dee2e6" strokeWidth="4" fill="none" />
      <path d="M-142 -58 Q-112 -108 -64 -122" stroke="#fff" strokeWidth="10" strokeLinecap="round" fill="none" opacity="0.9" />
      <rect x="-176" y="-12" width="272" height="12" rx="4" fill="#adb5bd" />
      <rect x="106" y="-10" width="136" height="10" rx="4" fill="#adb5bd" />
      {BASE_WINDOWS.map(([x, y, r], i) => (
        <g key={x}>
          <circle cx={x} cy={y} r={r + 4} fill="#adb5bd" />
          <circle cx={x} cy={y} r={r} fill={GLASS} />
          {i === 0 && (
            <Inside d={peek}>
              <g className="wa-basis-face">
                <circle cx={x} cy={y + 2} r="10" fill="#f1c27d" />
                <circle cx={x - 3.5} cy={y} r="1.6" fill="#2b2d42" />
                <circle cx={x + 3.5} cy={y} r="1.6" fill="#2b2d42" />
                <path d={`M${x - 3} ${y + 5} Q${x} ${y + 8} ${x + 3} ${y + 5}`} stroke="#2b2d42" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </g>
            </Inside>
          )}
          <circle className="wa-basis-light" cx={x} cy={y} r={r} fill="#ffe066" style={nth(i)} />
          <path d={`M${x - r * 0.5} ${y - r * 0.4} Q${x - r * 0.1} ${y - r * 0.75} ${x + r * 0.35} ${y - r * 0.6}`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      ))}
      <path d={door} fill="#343a40" />
      <Inside d={door}>
        <g className="wa-basis-person">
          <rect x="-88" y="-34" width="36" height="40" rx="12" fill={SUIT} />
          <g className="wa-basis-wave" style={{ transformOrigin: "-56px -26px" }}>
            <path d="M-56 -26 L-50 -50" stroke={SUIT} strokeWidth="9" strokeLinecap="round" />
          </g>
          <Helmet cx={-70} cy={-50} r={18} hair="#d9480f" />
        </g>
      </Inside>
      <g className="wa-basis-door" style={{ transformOrigin: "-96px -30px" }}>
        <path d={door} fill="#ced4da" stroke="#adb5bd" strokeWidth="3" />
        <circle cx="-70" cy="-54" r="9" fill={GLASS} stroke="#adb5bd" strokeWidth="3" />
        <circle cx="-52" cy="-26" r="3.5" fill="#868e96" />
      </g>
    </>
  );
}

/** The big dish antenna: it turns and sends signals to the earth, its lamp blinks. */
export function Schuessel() {
  return (
    <>
      <g className="wa-dish-waves" stroke="#ffe066" strokeWidth="5" fill="none" strokeLinecap="round">
        {[24, 44, 64].map((r, i) => (
          <path key={r} d={`M${-40 - r * 0.985} ${-162 - r * 0.174} A${r} ${r} 0 0 1 ${-40 - r * 0.174} ${-162 - r * 0.985}`} style={nth(i)} />
        ))}
      </g>
      <path d="M0 -84 L-36 0 M0 -84 L36 0 M0 -84 V0" stroke="#adb5bd" strokeWidth="7" strokeLinecap="round" />
      <g className="wa-dish-turn" style={{ transformOrigin: "0px -84px" }}>
        <path d="M0 -84 L-14 -114" stroke="#868e96" strokeWidth="9" strokeLinecap="round" />
        <g transform="rotate(-35 -14 -124)">
          <ellipse cx="-14" cy="-124" rx="64" ry="24" fill="#f1f3f5" />
          <ellipse cx="-14" cy="-120" rx="52" ry="16" fill="#dee2e6" />
          <path d="M-70 -128 Q-14 -150 42 -128" stroke="#fff" strokeWidth="4" fill="none" opacity="0.8" />
        </g>
        <path d="M-14 -124 L-40 -160" stroke="#868e96" strokeWidth="3" />
        <circle cx="-40" cy="-162" r="6" fill="#adb5bd" />
      </g>
      <rect x="-16" y="-98" width="32" height="26" rx="6" fill="#ced4da" />
      <circle className="wa-dish-lamp" cx="7" cy="-85" r="4" fill="#69db7c" />
    </>
  );
}

/** The greenhouse dome: it rains inside, the plants grow, the sunflower turns and the door swings open. */
export function Gewaechshaus() {
  const glass = "M-110 -16 A110 110 0 0 1 110 -16 Z";
  return (
    <>
      <rect x="-120" y="-18" width="240" height="18" rx="5" fill="#adb5bd" />
      <Inside d={glass}>
        <rect x="-110" y="-126" width="220" height="110" fill="#e6fcf5" />
        <path d="M-72 -100 H72" stroke="#adb5bd" strokeWidth="3" />
        <g className="wa-gh-drops" fill="#4dabf7">
          {[-60, -30, 0, 30, 60].map((x, i) => (
            <ellipse key={x} cx={x} cy="-94" rx="3" ry="5" style={nth(i)} />
          ))}
        </g>
        <g className="wa-gh-plant" style={nth(0)}>
          <path d="M-64 -16 V-82" stroke="#2f9e44" strokeWidth="5" />
          <path d="M-64 -40 Q-86 -50 -90 -34 Q-74 -30 -64 -40 Z M-64 -60 Q-42 -72 -38 -56 Q-54 -52 -64 -60 Z" fill="#51cf66" />
          <circle cx="-78" cy="-58" r="9" fill="#fa5252" />
          <circle cx="-50" cy="-76" r="8" fill="#fa5252" />
          <circle cx="-72" cy="-86" r="7" fill="#ff8787" />
        </g>
        <g className="wa-gh-plant" style={nth(1)}>
          <path d="M44 -16 V-78" stroke="#2f9e44" strokeWidth="5" />
          <path d="M44 -36 Q66 -48 70 -32 Q54 -28 44 -36 Z" fill="#51cf66" />
          <g className="wa-gh-flower">
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx="44" cy="-98" rx="6" ry="11" fill="#ffd43b" transform={`rotate(${i * 45} 44 -86)`} />
            ))}
            <circle cx="44" cy="-86" r="9" fill="#a0522d" />
          </g>
        </g>
        <g className="wa-gh-plant" style={nth(2)}>
          <ellipse cx="86" cy="-26" rx="16" ry="11" fill="#69db7c" />
          <ellipse cx="74" cy="-22" rx="10" ry="8" fill="#40c057" />
          <ellipse cx="96" cy="-22" rx="9" ry="7" fill="#40c057" />
        </g>
      </Inside>
      <path d={glass} fill={GLASS} opacity="0.4" />
      <path d="M0 -126 V-16 M-55 -16 A55 110 0 0 1 55 -16 M-104 -50 Q0 -36 104 -50" stroke="#ced4da" strokeWidth="4" fill="none" />
      <path d={glass} fill="none" stroke="#adb5bd" strokeWidth="5" />
      <path d="M-84 -66 Q-66 -100 -26 -114" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.75" />
      <rect x="-22" y="-70" width="44" height="54" rx="4" fill="#c3fae8" />
      <g className="wa-gh-door" style={{ transformOrigin: "-22px -43px" }}>
        <rect x="-22" y="-70" width="44" height="54" rx="4" fill={GLASS} stroke="#adb5bd" strokeWidth="3" />
        <circle cx="13" cy="-42" r="3" fill="#868e96" />
      </g>
    </>
  );
}
