import { Hideout } from "../hideout";
import { Face, Inside, SKIN, nth } from "../shared";
import { Arm, Head, Hearts, Leg, Lid, Notes, Puffs, SAND } from "./parts";

// The big things on the beach: the beach chair with grandpa, the beach tent with the baby,
// the sunshade, the lifeguard tower, the chip shop and the beach hut. Foot point at (0, 0).

const KORB_INSIDE = "M-78 -104 V-190 Q-78 -232 0 -234 Q78 -232 78 -190 V-104 Z";

/** The beach chair: grandpa wakes up, yawns, stretches and lifts his hat; the footrest slides out. */
export function Strandkorb() {
  return (
    <>
      {/* The footrest slides out at the bottom while it plays */}
      <g className="sd-korb-foot">
        <rect x="-70" y="-30" width="140" height="22" rx="6" fill="#c08552" />
        <path d="M-60 -20 H60" stroke="#a0673a" strokeWidth="4" />
      </g>
      <path d="M-100 -4 V-196 Q-100 -262 0 -264 Q100 -262 100 -196 V-4 Q100 4 92 4 H-92 Q-100 4 -100 -4 Z" fill="#d4a373" />
      {/* Wicker weave */}
      <g stroke="#bc8a5f" strokeWidth="4" opacity="0.7">
        {[-20, -40, -60, -80].map((y) => (
          <path key={y} d={`M-96 ${y} H96`} />
        ))}
        {[-130, -160, -190, -220].map((y) => (
          <path key={y} d={`M-96 ${y} H-80 M80 ${y} H96`} />
        ))}
      </g>
      <path d="M-92 -200 Q-90 -252 0 -256" stroke="#e9c49a" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Striped cushion inside */}
      <path d={KORB_INSIDE} fill="#fff" />
      <Inside d={KORB_INSIDE}>
        {[-70, -38, -6, 26, 58].map((x) => (
          <rect key={x} x={x} y="-240" width="16" height="140" fill="#4dabf7" />
        ))}
      </Inside>
      {/* Grandpa */}
      <g className="sd-korb-opa">
        <path d="M-40 -104 Q-42 -150 0 -152 Q42 -150 40 -104 Z" fill="#e76f51" />
        <path d="M-12 -150 L0 -132 L12 -150" fill="#fff" />
        <g className="sd-korb-arm" style={{ transformOrigin: "-34px -136px" }}>
          <Arm x1={-34} y1={-136} x2={-52} y2={-108} sleeve="#e76f51" w={13} />
        </g>
        <g className="sd-korb-arm sd-korb-arm-right" style={{ transformOrigin: "34px -136px" }}>
          <Arm x1={34} y1={-136} x2={52} y2={-108} sleeve="#e76f51" w={13} />
        </g>
        <Head cx={0} cy={-178} r={26} hair="#dee2e6" style="bald" />
        <path d="M-14 -156 Q0 -148 14 -156 Q12 -146 0 -146 Q-12 -146 -14 -156 Z" fill="#f1f3f5" />
        {/* The yawn: a round mouth while it plays */}
        <ellipse className="sd-korb-yawn" cx="0" cy="-163" rx="6" ry="7" fill="#9d0208" />
        <g className="sd-korb-hat" style={{ transformOrigin: "0px -198px" }}>
          <ellipse cx="0" cy="-198" rx="40" ry="9" fill="#f4d58d" />
          <path d="M-22 -198 Q-22 -224 0 -224 Q22 -224 22 -198 Z" fill="#e9c46a" />
          <path d="M-22 -204 H22" stroke="#1d3557" strokeWidth="5" />
        </g>
      </g>
      {/* Seat and legs on the footrest */}
      <rect x="-82" y="-108" width="164" height="24" rx="8" fill="#c08552" />
      <Leg x1={-18} y1={-96} x2={-30} y2={-30} trousers="#f8f9fa" shoe={SKIN} w={14} />
      <Leg x1={18} y1={-96} x2={30} y2={-30} trousers="#f8f9fa" shoe={SKIN} w={14} />
      <path d="M-100 -108 H100" stroke="#a0673a" strokeWidth="6" />
      <Notes x={40} y={-236} texts={["Uaaah!"]} colour="#fff" size={26} />
    </>
  );
}

const TENT = "M-118 0 Q-122 -140 -10 -158 Q100 -150 112 0 Z";
const TENT_DOOR = "M-60 0 Q-58 -96 10 -104 Q70 -96 76 0 Z";

/** The beach tent: the flap rolls up, the baby inside claps and laughs, hearts fly. */
export function Strandzelt() {
  return (
    <>
      <path d={TENT} fill="#ff922b" />
      <Inside d={TENT}>
        {[-90, -30, 30, 90].map((x) => (
          <path key={x} d={`M${x} 0 Q${x * 0.6} -110 ${x * 0.2 - 10} -170 H${x * 0.2 + 20} Q${x * 0.6 + 30} -110 ${x + 30} 0 Z`} fill="#4dabf7" />
        ))}
      </Inside>
      <path d="M-100 -60 Q-80 -130 -10 -146" stroke="#fff" strokeOpacity="0.35" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d={TENT_DOOR} fill="#ffe8cc" />
      <Inside d={TENT_DOOR}>
        <g className="sd-zelt-baby">
          <ellipse cx="8" cy="-24" rx="30" ry="24" fill="#ffd8e4" />
          <circle cx="8" cy="-62" r="24" fill={SKIN} />
          <path d="M-6 -82 Q8 -96 20 -84" stroke="#e9c46a" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Face cx={8} cy={-64} size={0.85} />
          <Lid cx={2} cy={-64} r={2.7} fill={SKIN} />
          <Lid cx={14} cy={-64} r={2.7} fill={SKIN} />
          <g className="sd-zelt-hand" style={{ transformOrigin: "-14px -30px" }}>
            <circle cx="-14" cy="-38" r="8" fill={SKIN} />
          </g>
          <g className="sd-zelt-hand sd-zelt-hand-right" style={{ transformOrigin: "30px -30px" }}>
            <circle cx="30" cy="-38" r="8" fill={SKIN} />
          </g>
        </g>
      </Inside>
      {/* The flap over the door rolls up from the bottom */}
      <g className="sd-zelt-flap" style={{ transformOrigin: "8px -104px" }}>
        <path d={TENT_DOOR} fill="#ffd43b" />
        <path d="M8 -102 V-2" stroke="#fab005" strokeWidth="4" strokeDasharray="6 4" />
        <circle cx="8" cy="-40" r="5" fill="#e8590c" />
      </g>
      <path d="M-118 0 H112" stroke="#e8590c" strokeWidth="6" strokeLinecap="round" />
      <Hearts
        className="sd-zelt-hearts"
        spots={[
          [-30, -120],
          [10, -140],
          [50, -122],
        ]}
        r={10}
      />
    </>
  );
}

/** The striped sunshade: it spins round, the flaps flutter and it closes and opens again. */
export function Sonnenschirm() {
  const segments = Array.from({ length: 6 }, (_, i) => -150 + i * 50);
  return (
    <>
      <path d="M0 0 V-270" stroke="#f8f9fa" strokeWidth="9" strokeLinecap="round" />
      <path d="M-3 -10 V-260" stroke="#adb5bd" strokeWidth="3" />
      <g className="sd-schirm-top" style={{ transformOrigin: "0px -280px" }}>
        <g className="sd-schirm-spin" style={{ transformOrigin: "0px -250px" }}>
          <path d="M-150 -246 Q-140 -316 0 -326 Q140 -316 150 -246 Z" fill="#fff" />
          {segments
            .filter((_, i) => i % 2 === 0)
            .map((x) => (
              <path key={x} d={`M${x} -246 Q${x * 0.9} -300 0 -326 Q${(x + 50) * 0.9} -300 ${x + 50} -246 Z`} fill="#e63946" />
            ))}
          <g className="sd-schirm-flaps">
            {segments.map((x, i) => (
              <path key={x} d={`M${x} -247 Q${x + 25} -232 ${x + 50} -247 Z`} fill={i % 2 ? "#fff" : "#e63946"} style={nth(i)} />
            ))}
          </g>
          <path d="M-120 -260 Q-90 -306 -20 -318" stroke="#fff" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <circle cx="0" cy="-330" r="8" fill="#ffd43b" />
      </g>
      <Notes x={110} y={-330} texts={["Hui!"]} colour="#fff" size={24} />
    </>
  );
}

/** The lifeguard tower: the lifeguard blows her whistle and waves, the flag flies and the ring swings. */
export function Rettungsturm() {
  return (
    <>
      {/* Stilts and ladder */}
      <path d="M-70 0 L-56 -170 M70 0 L56 -170 M-62 -60 L62 -110 M62 -60 L-62 -110" stroke="#c08552" strokeWidth="10" strokeLinecap="round" />
      <path d="M86 0 L60 -170 M110 0 L84 -170" stroke="#a0673a" strokeWidth="6" strokeLinecap="round" />
      {[-30, -64, -98, -132].map((y) => (
        <path key={y} d={`M${86 + (y / -170) * -26 + 2} ${y} H${110 + (y / -170) * -26 - 2}`} stroke="#a0673a" strokeWidth="5" />
      ))}
      {/* The cabin with its roof */}
      <rect x="-80" y="-182" width="160" height="16" rx="5" fill="#a0673a" />
      <rect x="-70" y="-266" width="140" height="86" rx="8" fill="#fff" />
      <path d="M-70 -236 H70 M-70 -206 H70" stroke="#e63946" strokeWidth="12" />
      <rect x="-40" y="-262" width="80" height="44" rx="6" fill="#bde0fe" />
      <Inside d="M-40 -262 h80 v44 h-80 Z">
        <g className="sd-turm-guard">
          <rect x="-24" y="-226" width="48" height="30" rx="12" fill="#e63946" />
          <Head cx={0} cy={-242} r={18} hair="#ffd43b" style="bun" cap="#e63946" />
          <path className="sd-turm-whistle" d="M4 -232 h16 v6 h-16 Z" fill="#ffd43b" />
        </g>
      </Inside>
      <path d="M-14 -258 h10 L-24 -220 h-10 Z" fill="#fff" opacity="0.45" />
      <path d="M-86 -262 L0 -300 L86 -262 Z" fill="#e63946" />
      <path d="M-86 -262 H86" stroke="#c92a2a" strokeWidth="6" strokeLinecap="round" />
      <g className="sd-turm-arm" style={{ transformOrigin: "40px -226px" }}>
        <path d="M40 -226 L60 -262" stroke="#e63946" strokeWidth="10" strokeLinecap="round" />
        <circle cx="62" cy="-266" r="7" fill={SKIN} />
      </g>
      {/* Flag on its pole */}
      <path d="M-60 -296 V-380" stroke="#868e96" strokeWidth="5" strokeLinecap="round" />
      <g className="sd-turm-flag" style={{ transformOrigin: "-60px -374px" }}>
        <path d="M-60 -380 H-10 L-18 -362 L-10 -344 H-60 Z" fill="#ffd43b" />
        <path d="M-60 -362 H-14" stroke="#e63946" strokeWidth="12" />
      </g>
      {/* The life ring hangs on the front */}
      <g className="sd-turm-ring" style={{ transformOrigin: "-50px -172px" }}>
        <circle cx="-50" cy="-138" r="24" fill="none" stroke="#ff6b6b" strokeWidth="13" />
        <circle cx="-50" cy="-138" r="24" fill="none" stroke="#fff" strokeWidth="13" strokeDasharray="18.8 18.8" />
        <path d="M-50 -172 V-162" stroke="#495057" strokeWidth="3" />
      </g>
      <Notes x={60} y={-300} texts={["Trillll!"]} colour="#ffd43b" size={26} />
    </>
  );
}

const HATCH = "M-80 -176 h160 v70 h-160 Z";

/** The chip shop: the shutter rolls up, the cook waves with a cone of chips, the fryer steams and the sign wobbles. */
export function Pommesbude() {
  return (
    <>
      <rect x="-114" y="-200" width="228" height="200" rx="10" fill="#ffd8a8" />
      {[-90, -60, -30, 0, 30, 60, 90].map((x) => (
        <path key={x} d={`M${x} -96 V-4`} stroke="#fcc419" strokeWidth="4" opacity="0.6" />
      ))}
      <path d={HATCH} fill="#495057" />
      <Inside d={HATCH}>
        <rect x="-80" y="-176" width="160" height="70" fill="#868e96" />
        <rect x="30" y="-150" width="40" height="44" rx="4" fill="#adb5bd" />
        <Puffs
          className="sd-bude-steam"
          spots={[
            [44, -156],
            [56, -168],
            [40, -176],
          ]}
          r={9}
          fill="#fff"
        />
        <g className="sd-bude-cook">
          <rect x="-46" y="-130" width="56" height="40" rx="16" fill="#fff" />
          <Head cx={-18} cy={-146} r={20} hair="#6b4423" />
          <path d="M-36 -160 Q-38 -186 -18 -184 Q2 -186 0 -160 Z" fill="#fff" />
          <ellipse cx="-18" cy="-162" rx="20" ry="5" fill="#f1f3f5" />
        </g>
      </Inside>
      <g className="sd-bude-arm" style={{ transformOrigin: "6px -118px" }}>
        <path d="M6 -118 L30 -136" stroke="#fff" strokeWidth="10" strokeLinecap="round" />
        <g className="sd-bude-cone">
          <path d="M26 -150 L36 -122 L46 -150 Z" fill="#e63946" />
          {[28, 33, 38, 43].map((x, i) => (
            <rect key={x} x={x - 2} y={-166 + (i % 2) * 4} width="4.5" height="20" rx="2" fill="#ffd43b" />
          ))}
        </g>
        <circle cx="34" cy="-136" r="6" fill={SKIN} />
      </g>
      {/* The shutter rolls up into its box */}
      <g className="sd-bude-shutter" style={{ transformOrigin: "0px -176px" }}>
        <rect x="-80" y="-176" width="160" height="70" fill="#4dabf7" />
        {[-160, -146, -132, -118].map((y) => (
          <path key={y} d={`M-80 ${y} H80`} stroke="#339af0" strokeWidth="4" />
        ))}
      </g>
      <rect x="-86" y="-186" width="172" height="12" rx="4" fill="#339af0" />
      <rect x="-96" y="-106" width="192" height="14" rx="4" fill="#fff" />
      <path d="M-120 -200 L-100 -230 H100 L120 -200 Z" fill="#e63946" />
      <path d="M-100 -230 H100" stroke="#fff" strokeWidth="5" />
      {/* The sign on the roof: a big cone of chips */}
      <g className="sd-bude-sign" style={{ transformOrigin: "0px -232px" }}>
        <rect x="-76" y="-280" width="152" height="46" rx="12" fill="#ffd43b" stroke="#fab005" strokeWidth="5" />
        <text x="0" y="-246" textAnchor="middle" fontSize="30" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#e63946">
          POMMES
        </text>
      </g>
      <rect x="-104" y="-30" width="208" height="30" rx="4" fill="#ffc078" />
      <Notes x={70} y={-180} texts={["Brutzel!"]} colour="#ffd43b" size={22} />
    </>
  );
}

const HUT_DOOR = "M-36 -10 V-118 Q-36 -132 -22 -132 H22 Q36 -132 36 -118 V-10 Z";

/** The beach hut: the door opens and a girl in a swimsuit peeks out and waves, the window shutters swing, the pennants flutter. */
export function Strandhaus() {
  return (
    <>
      <rect x="-104" y="-200" width="208" height="200" fill="#fff" />
      {[-104, -56, -8, 40, 88].map((x) => (
        <rect key={x} x={x} y="-200" width="24" height="200" fill="#74c0fc" />
      ))}
      <path d="M-122 -196 L0 -276 L122 -196 Z" fill="#1d3557" />
      <path d="M-122 -196 H122" stroke="#16304d" strokeWidth="8" strokeLinecap="round" />
      {/* Pennants under the roof */}
      <path d="M-100 -188 Q0 -168 100 -188" stroke="#868e96" strokeWidth="2" fill="none" />
      <g className="sd-haus-pennants">
        {[-80, -48, -16, 16, 48, 80].map((x, i) => (
          <path
            key={x}
            d={`M${x - 10} ${-186 + Math.abs(x) * -0.06 + 6} h20 l-10 18 Z`}
            fill={["#e63946", "#ffd43b", "#40c057"][i % 3]}
            style={{ ...nth(i), transformOrigin: `${x}px ${-180 + Math.abs(x) * -0.06}px` }}
          />
        ))}
      </g>
      {/* Little window in the gable with two shutters */}
      <rect x="-18" y="-244" width="36" height="30" rx="4" fill="#bde0fe" />
      <rect className="sd-haus-light" x="-18" y="-244" width="36" height="30" rx="4" fill="#ffe066" />
      <rect className="sd-haus-shutter" x="-20" y="-246" width="20" height="34" rx="3" fill="#ffd43b" style={{ transformOrigin: "-20px -229px" }} />
      <rect className="sd-haus-shutter" x="0" y="-246" width="20" height="34" rx="3" fill="#fcc419" style={{ transformOrigin: "20px -229px" }} />
      {/* Door frame, someone else behind the door every time, and the door itself */}
      <path d="M-42 -4 V-122 Q-42 -138 -24 -138 H24 Q42 -138 42 -122 V-4 Z" fill="#ffd43b" />
      <path d={HUT_DOOR} fill="#2b2d42" />
      <Hideout x={-36} y={-132} w={72} h={122} size={84} />
      <g className="sd-haus-door" style={{ transformOrigin: "-36px -70px" }}>
        <path d={HUT_DOOR} fill="#e63946" />
        <rect x="-24" y="-118" width="48" height="40" rx="8" fill="#ff8787" />
        <path d="M-20 -60 H20 M-20 -44 H20 M-20 -28 H20" stroke="#c92a2a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="24" cy="-66" r="5" fill="#ffd43b" />
      </g>
      {/* Steps */}
      <rect x="-54" y="-10" width="108" height="12" rx="3" fill="#c08552" />
      {/* Towel hanging on a hook */}
      <g className="sd-haus-towel" style={{ transformOrigin: "-78px -150px" }}>
        <path d="M-92 -150 H-64 V-80 Q-78 -74 -92 -80 Z" fill="#ffd43b" />
        <path d="M-92 -110 H-64 M-92 -96 H-64" stroke="#e63946" strokeWidth="5" />
      </g>
      <circle cx="-78" cy="-152" r="4" fill="#495057" />
      <path d="M60 -10 Q56 -30 70 -36 Q86 -30 82 -10 Z" fill={SAND} />
      <Notes x={60} y={-140} texts={["Hallo!"]} colour="#fff" size={24} />
    </>
  );
}
