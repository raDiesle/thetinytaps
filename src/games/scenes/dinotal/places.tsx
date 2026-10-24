import { Hideout } from "../hideout";
import { Inside, nth, sparklePath } from "../shared";
import { Cheek, DinoEye, Notes, Puff, Smile } from "./parts";

// The volcano, the cliff with its cave, the hollow log, the muddy puddle and the amber.
// Each drawing has its foot point at (0, 0). Openings (cave entrance, log hole) are parts
// of their own, so something can look out of them.

const ROCK = "#a99a8f";

/** The friendly volcano: it rumbles, wobbles, blinks and puffs round smoke clouds and a heart. */
export function Vulkan() {
  return (
    <>
      {/* Only with "Bild bewegt sich auch von allein": a small puff now and then. */}
      <Puff x={10} y={-320} r={26} className="dt-vulkan-idle" />
      <g className="dt-vulkan-smoke">
        {[0, 1, 2].map((i) => (
          <Puff key={i} x={(i - 1) * 26} y={-330} r={30 - i * 3} fill={i === 1 ? "#f1f3f5" : "#fff"} className="dt-vulkan-puff" i={i} />
        ))}
        <path className="dt-vulkan-heart" d="M0 -330 C-34 -350 -24 -384 0 -366 C24 -384 34 -350 0 -330 Z" fill="#ffafcc" />
      </g>
      <g className="dt-vulkan-sparks" fill="#ffd166">
        {[
          [-70, -300],
          [76, -306],
          [-40, -350],
          [50, -356],
        ].map(([x, y], i) => (
          <path key={i} d={sparklePath(x, y, 12)} style={nth(i)} />
        ))}
      </g>
      <g className="dt-vulkan-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-280 0 Q-190 -130 -96 -262 Q0 -300 96 -262 Q190 -130 280 0 Z" fill={ROCK} />
        <path d="M40 -290 Q140 -170 280 0 H130 Q110 -150 40 -290 Z" fill="#8f7f74" opacity="0.55" />
        <path d="M-120 -230 Q-170 -150 -210 -60" stroke="#fff" strokeOpacity="0.25" strokeWidth="14" strokeLinecap="round" fill="none" />
        {/* Green slopes at the foot */}
        <path d="M-280 0 Q-230 -70 -170 -86 Q-100 -60 -40 -70 Q40 -96 120 -70 Q190 -80 240 -50 Q262 -24 280 0 Z" fill="#8cbf78" />
        <path d="M-200 -50 Q-150 -70 -100 -50 M60 -60 Q110 -76 160 -56" stroke="#a7d690" strokeWidth="8" strokeLinecap="round" fill="none" />
        {/* The crater with a warm glow inside */}
        <ellipse cx="0" cy="-276" rx="90" ry="18" fill="#7a6458" />
        <ellipse className="dt-vulkan-glow" cx="0" cy="-278" rx="66" ry="10" fill="#ffb26b" />
        <ellipse cx="0" cy="-272" rx="90" ry="8" fill={ROCK} />
        {/* Friendly face */}
        <DinoEye cx={-44} cy={-170} r={16} skin={ROCK} />
        <DinoEye cx={44} cy={-170} r={16} skin={ROCK} />
        <Cheek cx={-72} cy={-138} r={16} />
        <Cheek cx={72} cy={-138} r={16} />
        <g className="dt-vulkan-mouth" style={{ transformOrigin: "0px -132px" }}>
          <Smile x={-26} y={-138} w={52} d={10} width={6} />
        </g>
      </g>
      <Notes x={110} y={-280} texts={["Puff!", "Puff!"]} size={34} delays={[0.5, 1.2]} />
    </>
  );
}

/** Where the cave entrance is in the cliff, in the cliff's coordinates. */
const CAVE = "M-88 0 Q-96 -112 -14 -126 Q66 -126 72 0 Z";

/** The cliff with the cave: inside the dark, two eyes open, blink, and a little dino peeks out and giggles. */
export function Hoehle() {
  return (
    <>
      <g className="dt-hoehle-rock">
        <path d="M-170 0 Q-188 -150 -122 -236 Q-62 -300 20 -294 Q124 -292 162 -200 Q192 -104 172 0 Z" fill={ROCK} />
        <path d="M60 -286 Q150 -260 168 -180 Q190 -90 172 0 H110 Q140 -120 60 -286 Z" fill="#8f7f74" opacity="0.5" />
        <path
          d="M-150 -150 Q-60 -170 40 -150 M-160 -70 Q-120 -80 -96 -76 M90 -100 Q130 -110 160 -100"
          stroke="#8f7f74"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M-120 -226 Q-90 -270 -30 -282" stroke="#fff" strokeOpacity="0.3" strokeWidth="12" strokeLinecap="round" fill="none" />
        {/* Moss on top */}
        <path d="M-120 -240 Q-60 -306 30 -296 Q100 -296 140 -246 Q90 -262 40 -258 Q-30 -266 -120 -240 Z" fill="#8cbf78" />
        <circle cx="-130" cy="-40" r="18" fill="#8cbf78" />
        <circle cx="150" cy="-30" r="14" fill="#8cbf78" />
      </g>
      {/* The cave entrance and who lives inside */}
      <path className="dt-hoehle-entrance" d={CAVE} fill="#3b2f2f" />
      <Inside d={CAVE}>
        <g className="dt-hoehle-eyes">
          <ellipse cx="-36" cy="-70" rx="9" ry="11" fill="#fff3b0" />
          <ellipse cx="0" cy="-70" rx="9" ry="11" fill="#fff3b0" />
          <circle cx="-34" cy="-68" r="5" fill="#2b2d42" />
          <circle cx="2" cy="-68" r="5" fill="#2b2d42" />
        </g>
        <g className="dt-hoehle-peek">
          <ellipse cx="-14" cy="-40" rx="44" ry="38" fill="#b197fc" />
          <ellipse cx="-14" cy="-22" rx="30" ry="18" fill="#d0bfff" />
          <DinoEye cx={-32} cy={-54} r={10} skin="#b197fc" />
          <DinoEye cx={4} cy={-54} r={10} skin="#b197fc" />
          <Cheek cx={-44} cy={-32} r={7} />
          <Cheek cx={16} cy={-32} r={7} />
          <Smile x={-24} y={-30} w={20} d={6} />
          <circle cx="-30" cy="-84" r="8" fill="#9775fa" />
          <circle cx="-8" cy="-88" r="8" fill="#9775fa" />
          <circle cx="12" cy="-82" r="7" fill="#9775fa" />
        </g>
      </Inside>
      <path d="M-88 0 Q-96 -112 -14 -126 Q66 -126 72 0" stroke="#7a6a5f" strokeWidth="8" fill="none" />
      <Notes x={70} y={-120} texts={["Hihi!", "Hallo!"]} size={30} delays={[0.8, 1.2]} />
    </>
  );
}

const WOOD = "#a0714f";

/** The hollow log on its side: it rocks, eyes blink in its hole, the mushroom on it bounces. */
export function Baumstamm() {
  return (
    <g className="dt-stamm-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-120 -8 Q-130 -50 -110 -86 H106 Q126 -50 116 -8 Z" fill={WOOD} />
      <path d="M-110 -86 H106 Q114 -74 116 -60 H-122 Q-120 -74 -110 -86 Z" fill="#b98760" />
      <path d="M-80 -30 H60 M-60 -52 H40 M-90 -70 H-20" stroke="#7f5539" strokeWidth="5" strokeLinecap="round" />
      <path d="M-120 -8 H116 Q100 4 -100 2 Z" fill="#7f5539" />
      {/* Moss and a little mushroom on top */}
      <path d="M-70 -86 Q-50 -100 -20 -92 Q0 -102 20 -88 Z" fill="#7cb862" />
      <g className="dt-stamm-pilz" style={{ transformOrigin: "50px -86px" }}>
        <rect x="45" y="-104" width="10" height="18" rx="4" fill="#f8f1e5" />
        <path d="M34 -102 Q50 -128 66 -102 Z" fill="#e76f51" />
        <circle cx="46" cy="-110" r="3" fill="#fff" />
        <circle cx="56" cy="-108" r="2.5" fill="#fff" />
      </g>
      {/* The round end with the hole, where somebody lives */}
      <ellipse cx="112" cy="-47" rx="30" ry="42" fill="#d4a373" />
      <path d="M112 -76 a20 29 0 1 1 -0.1 0 M112 -64 a12 17 0 1 1 -0.1 0" stroke="#b5835a" strokeWidth="3" fill="none" />
      <ellipse className="dt-stamm-hole" cx="114" cy="-44" rx="18" ry="26" fill="#3b2f2f" />
      {/* Somebody else looks out of the hole every time */}
      <Hideout x={99} y={-66} w={30} h={46} size={40} />
      <g className="dt-stamm-leaves" fill="#6bb26f">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx={-40 + i * 40} cy={-92} rx="9" ry="5" style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** Three-toed footprints leading into a muddy puddle: they light up step by step, then the puddle splashes. */
export function Pfuetze() {
  return (
    <>
      {[
        [-110, -6, -12],
        [-60, -18, 10],
      ].map(([x, y, a], i) => (
        <g key={i} className="dt-pfuetze-step" style={nth(i)} transform={`translate(${x} ${y}) rotate(${a})`}>
          <g fill="#a07850" opacity="0.75">
            <ellipse cx="0" cy="0" rx="14" ry="9" />
            <ellipse cx="-14" cy="-12" rx="5.5" ry="8" transform="rotate(-25 -14 -12)" />
            <ellipse cx="0" cy="-17" rx="5.5" ry="8" />
            <ellipse cx="14" cy="-12" rx="5.5" ry="8" transform="rotate(25 14 -12)" />
          </g>
        </g>
      ))}
      <ellipse cx="40" cy="-10" rx="90" ry="22" fill="#9c7a54" />
      <ellipse className="dt-pfuetze-water" cx="40" cy="-12" rx="76" ry="16" fill="#8cc5e3" />
      <ellipse cx="18" cy="-16" rx="32" ry="5" fill="#fff" opacity="0.5" />
      <g className="dt-pfuetze-rings" fill="none" stroke="#fff" strokeWidth="3">
        {[0, 1].map((i) => (
          <ellipse key={i} cx="44" cy="-12" rx={20 + i * 16} ry={5 + i * 4} style={nth(i)} />
        ))}
      </g>
      <g className="dt-pfuetze-drops" fill="#8cc5e3" stroke="#fff" strokeWidth="2">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={30 + i * 10} cy={-16} r={6} style={nth(i)} />
        ))}
      </g>
      <Notes x={90} y={-50} texts={["Platsch!"]} size={26} delays={[1]} />
    </>
  );
}

/** A piece of golden amber with a leaf inside: it hops, shines and sparkles. */
export function Bernstein() {
  return (
    <>
      <g className="dt-bernstein-body">
        <path d="M-34 -6 Q-42 -40 -14 -56 Q14 -66 32 -42 Q44 -18 30 -4 Q0 6 -34 -6 Z" fill="#f4a72a" />
        <path d="M-20 -14 Q-28 -40 -8 -48 Q12 -54 24 -36 Q30 -18 20 -10 Q0 -4 -20 -14 Z" fill="#ffc44d" />
        <path d="M-6 -20 Q2 -36 12 -34 Q8 -22 -6 -20 Z M-6 -20 L-12 -14" stroke="#7a9a3a" strokeWidth="2" fill="#9bbf4a" />
        <path d="M-22 -36 Q-18 -48 -6 -52" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="-40" r="3" fill="#fff" opacity="0.8" />
      </g>
      <g className="dt-bernstein-sparkle" fill="#fff6c2">
        {[
          [-44, -60],
          [40, -66],
          [50, -20],
        ].map(([x, y], i) => (
          <path key={i} d={sparklePath(x, y, 10)} style={nth(i)} />
        ))}
      </g>
    </>
  );
}
