import { CHEEK, Eye, Face, INK, SKIN, STEEL, Wheel, heartPath, nth, sparklePath } from "../shared";
import { Bubbles, Hearts, Lid, Lines, Notes, Sparkles } from "./parts";

// The waiting room: the water dispenser, Papa, the aquarium, the reception desk with the
// receptionist, the telephone and the sticker jar, and the toys on the rug. Each drawing has
// its foot point at (0, 0) and is placed with ground() (the desk's things with DESK).

/** The water dispenser; the lever is pressed, water drips into a cup and the bottle bubbles. */
export function Wasserspender() {
  return (
    <>
      {/* Water bottle on top */}
      <g className="ka-wasser-bottle" style={{ transformOrigin: "0px -222px" }}>
        <rect x="-18" y="-246" width="36" height="26" rx="6" fill="#74c0fc" />
        <path d="M-50 -246 Q-58 -246 -58 -270 V-356 Q-58 -380 -34 -382 H34 Q58 -380 58 -356 V-270 Q58 -246 50 -246 Z" fill="#a5d8ff" fillOpacity="0.85" />
        <path d="M-58 -300 H58" stroke="#74c0fc" strokeWidth="3" opacity="0.6" />
        <path d="M-42 -360 V-268" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
        <Bubbles x={6} y={-268} count={4} spread={14} r={7} />
      </g>
      {/* Cabinet */}
      <rect x="-66" y="-224" width="132" height="224" rx="12" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="3" />
      <rect x="-44" y="-200" width="88" height="86" rx="10" fill="#ced4da" />
      <rect x="-30" y="-120" width="60" height="10" rx="3" fill="#adb5bd" />
      <path d="M-50 -90 H50 M-50 -60 H50 M-50 -30 H50" stroke="#e9ecef" strokeWidth="4" strokeLinecap="round" />
      {/* Cup holder on the side */}
      <rect x="66" y="-206" width="18" height="78" rx="6" fill="#e9ecef" stroke="#dee2e6" strokeWidth="2" />
      <path d="M70 -196 H80 M70 -176 H80 M70 -156 H80" stroke="#fff" strokeWidth="3" />
      {/* Tap and lever */}
      <rect x="-10" y="-196" width="20" height="22" rx="4" fill="#4dabf7" />
      <rect x="-4" y="-176" width="8" height="10" rx="2" fill="#339af0" />
      <g className="ka-wasser-lever" style={{ transformOrigin: "-10px -192px" }}>
        <rect x="-26" y="-200" width="22" height="9" rx="4" fill="#339af0" />
      </g>
      <g className="ka-wasser-drops" fill="#74c0fc">
        {[0, 1, 2].map((i) => (
          <path key={i} d="M0 -162 q5 7 0 10 q-5 -3 0 -10 Z" style={nth(i)} />
        ))}
      </g>
      {/* The paper cup on the tray */}
      <g className="ka-wasser-cup" style={{ transformOrigin: "0px -120px" }}>
        <path d="M-14 -150 H14 L10 -120 H-10 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <path className="ka-wasser-fill" d="M-12 -140 H12 L10 -122 H-10 Z" fill="#74c0fc" />
      </g>
    </>
  );
}

/** Papa waits on a chair and reads; he lowers the book, yawns and stretches. */
export function Papa() {
  return (
    <>
      {/* Legs: thighs on the seat, shins down to the floor */}
      <rect x="-40" y="-150" width="80" height="34" rx="14" fill="#495057" />
      <rect x="-38" y="-124" width="26" height="112" rx="12" fill="#495057" />
      <rect x="12" y="-124" width="26" height="112" rx="12" fill="#495057" />
      <ellipse cx="-28" cy="-10" rx="22" ry="11" fill="#8d5a3b" />
      <ellipse cx="28" cy="-10" rx="22" ry="11" fill="#8d5a3b" />
      <g className="ka-papa-body" style={{ transformOrigin: "0px -140px" }}>
        <rect x="-48" y="-280" width="96" height="140" rx="30" fill="#51cf66" />
        <path d="M-34 -250 H34 M-40 -220 H40 M-42 -190 H42" stroke="#40c057" strokeWidth="5" opacity="0.6" />
        <rect x="-9" y="-296" width="18" height="20" fill={SKIN} />
        <g className="ka-papa-head" style={{ transformOrigin: "0px -290px" }}>
          <circle cx="0" cy="-332" r="42" fill={SKIN} />
          <path d="M-42 -336 Q-44 -380 0 -380 Q44 -380 42 -336 Q34 -360 0 -360 Q-34 -360 -42 -336 Z" fill="#6b4423" />
          <path d="M-36 -318 Q-38 -282 0 -280 Q38 -282 36 -318 Q28 -300 0 -302 Q-28 -300 -36 -318 Z" fill="#8d5a3b" />
          <Eye cx={-14} cy={-336} r={4} />
          <Eye cx={14} cy={-336} r={4} />
          <Lid cx={-14} cy={-336} r={4} fill={SKIN} />
          <Lid cx={14} cy={-336} r={4} fill={SKIN} />
          <circle cx="-28" cy="-320" r="6" fill={CHEEK} opacity="0.5" />
          <circle cx="28" cy="-320" r="6" fill={CHEEK} opacity="0.5" />
          <path d="M-10 -314 Q0 -306 10 -314" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse className="ka-papa-yawn" cx="0" cy="-310" rx="10" ry="12" fill="#862e2e" />
        </g>
        {/* The open picture book, held with both hands */}
        <g className="ka-papa-book" style={{ transformOrigin: "0px -190px" }}>
          <path d="M-62 -244 L0 -232 L62 -244 V-178 L0 -166 L-62 -178 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
          <path d="M0 -232 V-166" stroke="#dee2e6" strokeWidth="3" />
          <path d="M-66 -246 L0 -234 L66 -246 V-176 L0 -162 L-66 -176" stroke="#4dabf7" strokeWidth="5" fill="none" strokeLinejoin="round" />
          <circle cx="-30" cy="-212" r="12" fill="#ffd43b" />
          <path d="M14 -196 Q30 -222 46 -196 Z" fill="#ff8787" />
          <circle cx="-64" cy="-208" r="11" fill={SKIN} />
          <circle cx="64" cy="-208" r="11" fill={SKIN} />
        </g>
      </g>
      <Lines x={54} y={-350} colour="#adb5bd" />
    </>
  );
}

/** The aquarium on its cabinet; the fish swim, the treasure chest opens and the cabinet doors swing. */
export function Aquarium() {
  return (
    <>
      {/* Cabinet with the fish food behind its doors */}
      <rect x="-132" y="-184" width="264" height="184" rx="8" fill="#c88b3a" />
      <rect x="-122" y="-174" width="244" height="164" fill="#8d5a3b" />
      <g className="ka-aqua-food" style={nth(0)}>
        <rect x="-90" y="-80" width="40" height="64" rx="6" fill="#ffd43b" />
        <rect x="-92" y="-88" width="44" height="12" rx="4" fill="#fd7e14" />
        <ellipse cx="-70" cy="-50" rx="10" ry="8" fill="#ff922b" />
      </g>
      <g className="ka-aqua-food" style={nth(1)}>
        <path d="M40 -20 L70 -110" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="78" cy="-124" rx="22" ry="16" fill="#a5d8ff" fillOpacity="0.7" stroke="#4dabf7" strokeWidth="3" />
      </g>
      {[
        { x: -126, hinge: -126, knob: -16 },
        { x: 2, hinge: 126, knob: 16 },
      ].map(({ x, hinge, knob }, i) => (
        <g key={x} className="ka-aqua-door" style={{ ...nth(i), transformOrigin: `${hinge}px -92px` }}>
          <rect x={x} y="-178" width="124" height="172" rx="6" fill="#e9b872" stroke="#c88b3a" strokeWidth="3" />
          <rect x={x + 12} y="-166" width="100" height="148" rx="5" fill="none" stroke="#fff" strokeWidth="3" opacity="0.4" />
          <circle cx={knob} cy="-92" r="7" fill="#ffd166" stroke="#e9a23b" strokeWidth="2" />
          <path d={i ? "M78 -112 q14 -8 28 0 q-14 8 -28 0 Z M106 -112 l10 -8 v16 Z" : "M-100 -112 q14 -8 28 0 q-14 8 -28 0 Z M-72 -112 l10 -8 v16 Z"} fill="#ffa94d" opacity="0.8" />
        </g>
      ))}
      {/* The tank */}
      <rect x="-126" y="-354" width="252" height="172" rx="10" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="4" />
      <rect x="-118" y="-330" width="236" height="144" rx="4" fill="#74c0fc" />
      <rect x="-118" y="-330" width="236" height="16" fill="#a5d8ff" />
      <path d="M-118 -202 Q-80 -214 -40 -204 Q0 -196 40 -206 Q80 -214 118 -202 V-186 H-118 Z" fill="#ffe066" />
      {[-96, -70, 74, 100].map((x, i) => (
        <g key={x} className="ka-aqua-plant" style={{ ...nth(i), transformOrigin: `${x}px -200px` }}>
          <path d={`M${x} -200 Q${x - 14} -236 ${x} -262 Q${x + 12} -286 ${x - 4} -300`} stroke={i % 2 ? "#40c057" : "#69db7c"} strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>
      ))}
      {/* Treasure chest; its lid pops open */}
      <rect x="10" y="-226" width="44" height="26" rx="3" fill="#c88b3a" />
      <rect x="28" y="-222" width="8" height="10" rx="2" fill="#ffd43b" />
      <g className="ka-aqua-lid" style={{ transformOrigin: "10px -226px" }}>
        <path d="M8 -226 Q8 -240 32 -240 Q56 -240 56 -226 Z" fill="#e9b872" stroke="#c88b3a" strokeWidth="2" />
      </g>
      <Bubbles x={32} y={-246} count={3} spread={10} r={6} />
      {/* Fish */}
      <g className="ka-aqua-fish" style={nth(0)}>
        <g className="ka-aqua-fish-body">
          <path d="M-14 -270 L-30 -282 V-258 Z" fill="#fd7e14" />
          <ellipse cx="-44" cy="-270" rx="26" ry="17" fill="#ff922b" />
          <path d="M-50 -286 Q-40 -296 -32 -284 Z" fill="#fd7e14" />
          <Eye cx={-58} cy={-273} r={3.4} />
          <path d="M-44 -282 V-258" stroke="#fff" strokeWidth="4" opacity="0.6" />
        </g>
      </g>
      <g className="ka-aqua-fish" style={nth(1)}>
        <g className="ka-aqua-fish-body">
          <path d="M84 -240 L100 -250 V-230 Z" fill="#7950f2" />
          <ellipse cx="66" cy="-240" rx="20" ry="13" fill="#9775fa" />
          <Eye cx={56} cy={-243} r={3} />
        </g>
      </g>
      <path d="M-110 -340 V-200" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      <rect x="-132" y="-362" width="264" height="12" rx="5" fill="#495057" />
    </>
  );
}

/** The reception desk; its dots light up one after another and the drawer slides out with crayons. */
export function Empfang() {
  const dots = ["#ff8787", "#ffd43b", "#69db7c", "#74c0fc", "#b197fc"];
  return (
    <>
      <rect x="-200" y="-284" width="400" height="284" rx="10" fill="#ffd8a8" />
      <rect x="-200" y="-24" width="400" height="24" rx="6" fill="#ffc078" />
      <path d="M-180 -250 V-40" stroke="#fff" strokeWidth="10" strokeLinecap="round" opacity="0.35" />
      {dots.map((c, i) => (
        <g key={c} className="ka-desk-dot" style={nth(i)}>
          <circle cx={-140 + i * 56} cy="-220" r="18" fill={c} />
          <circle cx={-146 + i * 56} cy="-226" r="5" fill="#fff" opacity="0.6" />
        </g>
      ))}
      <path d="M-150 -170 Q-100 -150 -50 -170 T50 -170 T150 -170" stroke="#ffa94d" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Drawer with crayons */}
      <g className="ka-desk-drawer" style={{ transformOrigin: "90px -94px" }}>
        <g className="ka-desk-inside">
          <rect x="34" y="-142" width="112" height="22" rx="3" fill="#e9b872" />
          {["#fa5252", "#fab005", "#40c057", "#339af0", "#7950f2"].map((c, k) => (
            <rect key={c} className="ka-desk-crayon" x={44 + k * 20} y="-150" width="10" height="26" rx="3" fill={c} style={nth(k)} />
          ))}
        </g>
        <rect x="30" y="-124" width="120" height="58" rx="6" fill="#ffa94d" stroke="#f08c00" strokeWidth="3" />
        <rect x="70" y="-100" width="40" height="10" rx="5" fill="#fff" />
      </g>
      <rect x="-122" y="-124" width="120" height="58" rx="6" fill="#ffc078" stroke="#ffa94d" strokeWidth="3" />
      <path d={heartPath(-62, -95, 14)} fill="#ff8787" />
      {/* Counter top */}
      <rect x="-212" y="-300" width="424" height="22" rx="8" fill="#fff" />
      <rect x="-212" y="-284" width="424" height="6" fill="#e9ecef" />
    </>
  );
}

/** The receptionist behind the desk; she waves, nods and hums a little tune. */
export function Arzthelferin() {
  return (
    <>
      <g className="ka-helferin-body" style={{ transformOrigin: "0px -290px" }}>
        <rect x="-54" y="-420" width="108" height="150" rx="34" fill="#f783ac" />
        <path d="M-20 -420 L0 -392 L20 -420" stroke="#fff" strokeWidth="5" fill="none" strokeLinejoin="round" />
        <rect x="18" y="-392" width="22" height="14" rx="3" fill="#fff" />
        <rect x="-10" y="-438" width="20" height="22" fill={SKIN} />
        <g className="ka-helferin-tail" style={{ transformOrigin: "32px -500px" }}>
          <path d="M30 -502 Q72 -496 66 -446 Q62 -428 52 -426 Q54 -466 30 -486 Z" fill="#fcc419" />
          <circle cx="34" cy="-500" r="8" fill="#20c997" />
        </g>
        <g className="ka-helferin-head" style={{ transformOrigin: "0px -432px" }}>
          <circle cx="0" cy="-470" r="42" fill={SKIN} />
          <path d="M-42 -468 Q-46 -516 0 -516 Q46 -516 42 -468 Q32 -492 8 -490 Q-14 -496 -28 -482 Q-36 -476 -42 -468 Z" fill="#fcc419" />
          <Face cx={0} cy={-464} size={1.3} />
          <Lid cx={-9.1} cy={-464} r={4.2} fill={SKIN} />
          <Lid cx={9.1} cy={-464} r={4.2} fill={SKIN} />
          <ellipse className="ka-helferin-mouth" cx="0" cy="-448" rx="6" ry="7" fill="#c92a2a" />
        </g>
        <path d="M-46 -404 Q-70 -350 -52 -300" stroke="#f783ac" strokeWidth="20" strokeLinecap="round" fill="none" />
        <circle cx="-50" cy="-298" r="12" fill={SKIN} />
        <g className="ka-helferin-arm" style={{ transformOrigin: "44px -404px" }}>
          <path d="M44 -404 Q70 -360 56 -304" stroke="#f783ac" strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="56" cy="-300" r="12" fill={SKIN} />
        </g>
      </g>
      <Notes x={70} y={-520} colour="#f06595" />
    </>
  );
}

/** The telephone on the desk; it rings, the receiver jumps and the cord wobbles. */
export function Telefon() {
  return (
    <>
      <g className="ka-telefon-base" style={{ transformOrigin: "-148px -300px" }}>
        <path d="M-190 -300 L-176 -340 H-120 L-106 -300 Z" fill="#fa5252" />
        <path d="M-180 -306 L-172 -332" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        {[-160, -148, -136].map((x, i) =>
          [-326, -314].map((y) => <circle key={`${x}${y}`} cx={x + (y === -314 ? (i - 1) * 2 : 0)} cy={y} r="3.5" fill="#fff" />),
        )}
        <path d="M-108 -310 q10 6 4 14 q-8 6 -2 14 q8 6 0 12" stroke="#c92a2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g className="ka-telefon-receiver" style={{ transformOrigin: "-148px -344px" }}>
        <path d="M-192 -344 Q-194 -362 -176 -360 H-120 Q-102 -362 -104 -344 Q-108 -336 -118 -338 L-124 -348 H-172 L-178 -338 Q-188 -336 -192 -344 Z" fill="#e03131" />
      </g>
      <Lines x={-96} y={-360} colour="#fa5252" />
      <Lines x={-200} y={-360} dir={-1} colour="#fa5252" />
    </>
  );
}

/** The sticker jar on the desk; the lid pops off and stars and hearts fly out. */
export function Aufkleber() {
  const stickers = [
    { x: 126, y: -330, c: "#ffd43b", kind: "star" },
    { x: 150, y: -318, c: "#ff8787", kind: "heart" },
    { x: 140, y: -346, c: "#74c0fc", kind: "dot" },
    { x: 160, y: -340, c: "#69db7c", kind: "star" },
    { x: 124, y: -308, c: "#b197fc", kind: "dot" },
  ];
  const shape = (x: number, y: number, kind: string, c: string, r = 10) =>
    kind === "star" ? <path d={sparklePath(x, y, r * 1.2)} fill={c} /> : kind === "heart" ? <path d={heartPath(x, y, r)} fill={c} /> : <circle cx={x} cy={y} r={r * 0.8} fill={c} />;
  return (
    <>
      <g className="ka-sticker-jar" style={{ transformOrigin: "142px -300px" }}>
        <rect x="108" y="-372" width="68" height="72" rx="12" fill="#e7f5ff" fillOpacity="0.85" stroke="#a5d8ff" strokeWidth="3" />
        {stickers.map(({ x, y, c, kind }) => (
          <g key={`${x}${y}`}>{shape(x, y, kind, c)}</g>
        ))}
        <path d="M116 -362 V-310" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
      </g>
      <g className="ka-sticker-lid" style={{ transformOrigin: "106px -378px" }}>
        <rect x="102" y="-388" width="80" height="16" rx="6" fill="#ff922b" />
        <path d={sparklePath(142, -380, 6)} fill="#fff" />
      </g>
      <g className="ka-sticker-fly">
        {stickers.slice(0, 3).map(({ c, kind }, i) => (
          <g key={i} style={nth(i)}>
            {shape(142 + (i - 1) * 4, -360, kind, c, 13)}
          </g>
        ))}
      </g>
      <Sparkles x={142} y={-420} count={3} spread={36} r={9} />
    </>
  );
}

/** The pram with the baby; it rocks, the wheels turn, the toy swings and the baby giggles. */
export function Kinderwagen() {
  return (
    <>
      <g className="ka-wagen-body" style={{ transformOrigin: "-15px -44px" }}>
        {/* Frame and handle */}
        <path d="M-100 -46 L-60 -110 M70 -46 L40 -110 M-60 -110 H80" stroke={STEEL} strokeWidth="7" strokeLinecap="round" fill="none" />
        <path d="M100 -190 L150 -310" stroke={STEEL} strokeWidth="8" strokeLinecap="round" />
        <rect x="132" y="-324" width="44" height="16" rx="8" fill="#495057" />
        {/* Baby, seen above the tub's edge */}
        <g className="ka-wagen-baby" style={{ transformOrigin: "10px -200px" }}>
          <circle cx="10" cy="-222" r="30" fill={SKIN} />
          <path d="M-22 -222 Q-24 -262 10 -262 Q44 -262 42 -222 Q34 -248 10 -248 Q-14 -248 -22 -222 Z" fill="#ffc9de" />
          <circle cx="10" cy="-264" r="7" fill="#ffc9de" />
          <Face cx={10} cy={-222} size={0.9} />
          <ellipse className="ka-wagen-mouth" cx="10" cy="-209" rx="5" ry="6" fill="#c92a2a" />
          {[-1, 1].map((s, i) => (
            <g key={s} className="ka-wagen-hand" style={{ ...nth(i), transformOrigin: `${10 + s * 32}px -196px` }}>
              <circle cx={10 + s * 36} cy="-206" r="9" fill={SKIN} />
            </g>
          ))}
        </g>
        {/* Tub */}
        <path d="M-150 -196 H112 Q122 -100 40 -92 H-82 Q-152 -100 -150 -196 Z" fill="#9775fa" />
        <path d="M-150 -196 H112" stroke="#b197fc" strokeWidth="10" strokeLinecap="round" />
        <path d="M-128 -170 Q-120 -120 -80 -110" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.35" />
        <circle cx="-20" cy="-140" r="16" fill="#ffd43b" />
        {/* Hood */}
        <g className="ka-wagen-hood" style={{ transformOrigin: "-40px -196px" }}>
          <path d="M-152 -196 Q-156 -312 -40 -316 Q-32 -260 -40 -196 Z" fill="#7950f2" />
          <path d="M-128 -200 Q-130 -284 -64 -298 M-100 -200 Q-98 -272 -52 -290" stroke="#9775fa" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
        {/* The toy hanging from the hood */}
        <g className="ka-wagen-toy" style={{ transformOrigin: "-40px -300px" }}>
          <path d="M-40 -300 Q-20 -296 -4 -282" stroke="#868e96" strokeWidth="2" fill="none" />
          <circle cx="0" cy="-276" r="10" fill="none" stroke="#ffd43b" strokeWidth="5" />
          <path d={sparklePath(0, -258, 9)} fill="#ff8787" />
        </g>
      </g>
      <g className="ka-wagen-wheel" style={{ transformOrigin: "-100px -46px" }}>
        <Wheel cx={-100} cy={-46} r={44} />
      </g>
      <g className="ka-wagen-wheel" style={{ transformOrigin: "70px -46px" }}>
        <Wheel cx={70} cy={-46} r={44} />
      </g>
      <Hearts x={10} y={-320} count={2} spread={40} r={11} />
    </>
  );
}

/** The toy box; it wobbles, the lid opens, a bunny on a spring jumps out and a ball hops. */
export function Spielkiste() {
  return (
    <>
      {/* Toys inside, hidden by the front until the lid opens */}
      <g className="ka-kiste-bunny">
        <path d="M-50 -60 l14 -8 l-14 -8 l14 -8 l-14 -8 l14 -8 l-14 -8 l14 -8 l-14 -8 l14 -8" stroke={STEEL} strokeWidth="4" fill="none" strokeLinejoin="round" />
        <ellipse cx="-56" cy="-188" rx="8" ry="22" fill="#fff" />
        <ellipse cx="-30" cy="-188" rx="8" ry="22" fill="#fff" />
        <ellipse cx="-56" cy="-186" rx="4" ry="14" fill="#ffc9de" />
        <ellipse cx="-30" cy="-186" rx="4" ry="14" fill="#ffc9de" />
        <circle cx="-43" cy="-150" r="28" fill="#fff" />
        <Face cx={-43} cy={-152} size={0.85} />
        <ellipse cx="-43" cy="-144" rx="3.5" ry="2.5" fill="#ff8fa3" />
      </g>
      <g className="ka-kiste-ball">
        <circle cx="64" cy="-150" r="26" fill="#4dabf7" />
        <path d="M40 -150 H88 M64 -176 Q48 -150 64 -124" stroke="#fff" strokeWidth="5" fill="none" />
      </g>
      <g className="ka-kiste-duck">
        <ellipse cx="10" cy="-140" rx="22" ry="16" fill="#ffd43b" />
        <circle cx="22" cy="-160" r="13" fill="#ffd43b" />
        <path d="M33 -160 l12 3 l-12 4 Z" fill="#fd7e14" />
        <Eye cx={25} cy={-163} r={2.6} />
      </g>
      <g className="ka-kiste-box" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-142" y="-170" width="284" height="170" rx="12" fill="#ff922b" />
        <rect x="-142" y="-24" width="284" height="24" rx="8" fill="#e8590c" />
        <rect x="-126" y="-154" width="252" height="120" rx="8" fill="none" stroke="#ffc078" strokeWidth="6" />
        <path d={sparklePath(-80, -96, 22)} fill="#ffe066" />
        <circle cx="0" cy="-96" r="20" fill="#74c0fc" />
        <path d={heartPath(80, -96, 20)} fill="#ff8787" />
      </g>
      <g className="ka-kiste-lid" style={{ transformOrigin: "-146px -178px" }}>
        <rect x="-150" y="-190" width="300" height="26" rx="10" fill="#fd7e14" />
        <path d="M-130 -184 H120" stroke="#ffc078" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <rect x="-18" y="-170" width="36" height="12" rx="4" fill="#ffd43b" />
      </g>
      <Sparkles x={0} y={-260} count={3} spread={70} r={12} />
    </>
  );
}

/** A big plant in a pot; its leaves rustle and a ladybird crawls out. */
export function Pflanze() {
  const leaves = [-34, -20, -7, 7, 20, 34];
  return (
    <>
      {leaves.map((a, i) => (
        <g key={a} className="ka-pflanze-leaf" style={{ ...nth(i), transformOrigin: "0px -110px" }}>
          <g transform={`rotate(${a} 0 -110)`}>
            <path d="M0 -110 V-260" stroke="#2f9e44" strokeWidth="5" />
            <path d={`M0 -250 Q-44 -290 0 ${-350 + (i % 2) * 24} Q44 -290 0 -250 Z`} fill={i % 2 ? "#40c057" : "#51cf66"} />
            <path d={`M0 -254 V${-336 + (i % 2) * 24}`} stroke="#2b8a3e" strokeWidth="3" />
          </g>
        </g>
      ))}
      <g className="ka-pflanze-bug">
        <circle cx="30" cy="-150" r="11" fill="#e03131" />
        <path d="M30 -161 V-139" stroke={INK} strokeWidth="2" />
        <circle cx="26" cy="-152" r="2.4" fill={INK} />
        <circle cx="34" cy="-146" r="2.4" fill={INK} />
        <circle cx="30" cy="-164" r="5" fill={INK} />
      </g>
      <rect x="-64" y="-118" width="128" height="22" rx="6" fill="#c8553d" />
      <path d="M-56 -98 H56 L46 0 H-46 Z" fill="#e07a5f" />
      <path d="M-40 -84 L-34 -14" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
    </>
  );
}

/** The rocking horse; it rocks, nods its head, its mane and tail fly. */
export function Schaukelpferd() {
  return (
    <>
      <g className="ka-pferd-rock" style={{ transformOrigin: "0px -300px" }}>
        <path d="M-170 -46 Q0 26 170 -46" stroke="#c92a2a" strokeWidth="16" strokeLinecap="round" fill="none" />
        <path d="M-160 -40 Q0 22 160 -40" stroke="#ff8787" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M-80 -150 L-96 -24 M-48 -150 L-56 -14 M48 -150 L56 -14 M80 -150 L96 -24" stroke="#e9b872" strokeWidth="16" strokeLinecap="round" />
        <g className="ka-pferd-tail" style={{ transformOrigin: "-96px -176px" }}>
          <path d="M-96 -176 Q-140 -170 -146 -110 Q-128 -140 -112 -134 Q-128 -120 -126 -96 Q-104 -130 -96 -160 Z" fill="#8d5a3b" />
        </g>
        <ellipse cx="0" cy="-168" rx="104" ry="44" fill="#ffd8a8" />
        <path d="M-80 -190 Q0 -214 80 -190" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d="M-34 -204 Q0 -218 34 -204 L28 -150 H-28 Z" fill="#e03131" />
        <circle cx="-12" cy="-144" r="7" fill="#ffd43b" />
        <g className="ka-pferd-head" style={{ transformOrigin: "70px -190px" }}>
          <path d="M50 -196 L92 -276 L130 -258 L96 -176 Z" fill="#ffd8a8" />
          <g className="ka-pferd-mane" style={{ transformOrigin: "86px -270px" }}>
            <path d="M88 -284 Q60 -270 62 -236 Q52 -220 54 -194 Q70 -214 74 -232 Q82 -252 96 -264 Z" fill="#8d5a3b" />
          </g>
          <ellipse cx="132" cy="-262" rx="44" ry="28" fill="#ffd8a8" transform="rotate(18 132 -262)" />
          <ellipse cx="160" cy="-248" rx="16" ry="14" fill="#ffc078" />
          <circle cx="164" cy="-250" r="3" fill="#8d5a3b" />
          <path d="M102 -290 L96 -318 L118 -296 Z" fill="#ffc078" />
          <Eye cx={128} cy={-272} r={5} />
          <Lid cx={128} cy={-272} r={5} fill="#ffd8a8" />
          <circle cx="140" cy="-254" r="6" fill={CHEEK} opacity="0.5" />
          <path d="M120 -268 H146" stroke="#e03131" strokeWidth="5" strokeLinecap="round" />
          <rect x="104" y="-246" width="30" height="8" rx="4" fill="#c88b3a" />
        </g>
      </g>
    </>
  );
}

/** A wooden marble run; a marble rolls down all three ramps and lands in the tray. */
export function Kugelbahn() {
  const ramps = [
    { y1: -236, y2: -206, c: "#ff6b6b" },
    { y1: -156, y2: -126, c: "#fcc419", left: true },
    { y1: -86, y2: -56, c: "#4dabf7" },
  ];
  return (
    <>
      <path d="M-96 -16 V-262 M96 -16 V-262" stroke="#c88b3a" strokeWidth="14" strokeLinecap="round" />
      <path d="M-100 -262 V-30" stroke="#e9b872" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {ramps.map(({ y1, y2, c, left }) => (
        <g key={y1}>
          <path d={left ? `M88 ${y1} L-88 ${y2}` : `M-88 ${y1} L88 ${y2}`} stroke={c} strokeWidth="14" strokeLinecap="round" />
          <path d={left ? `M88 ${y1 - 6} L-88 ${y2 - 6}` : `M-88 ${y1 - 6} L88 ${y2 - 6}`} stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
        </g>
      ))}
      <rect x="-116" y="-22" width="232" height="22" rx="8" fill="#e9b872" />
      <path d="M-110 -22 H110" stroke="#c88b3a" strokeWidth="4" />
      <rect x="20" y="-42" width="92" height="22" rx="6" fill="#ffd8a8" stroke="#c88b3a" strokeWidth="3" />
      {[
        { x: 44, c: "#69db7c" },
        { x: 84, c: "#b197fc" },
      ].map(({ x, c }, i) => (
        <g key={x} className="ka-kugel-rest" style={nth(i)}>
          <circle cx={x} cy="-46" r="13" fill={c} />
          <circle cx={x - 4} cy="-50" r="4" fill="#fff" opacity="0.6" />
        </g>
      ))}
      {/* The marble waiting at the top; it rolls all the way down */}
      <g className="ka-kugel-ball">
        <circle cx="-76" cy="-254" r="13" fill="#ff922b" />
        <circle cx="-80" cy="-258" r="4" fill="#fff" opacity="0.6" />
      </g>
      <Lines x={124} y={-60} colour="#c88b3a" />
    </>
  );
}

/** A tower of wooden blocks; it wobbles block by block and the roof hops. */
export function Bauklotz() {
  return (
    <>
      <g className="ka-klotz" style={{ ...nth(0), transformOrigin: "0px 0px" }}>
        <rect x="-72" y="-74" width="144" height="74" rx="8" fill="#fa5252" />
        <path d={sparklePath(0, -37, 22)} fill="#fff" opacity="0.85" />
        <g className="ka-klotz" style={{ ...nth(1), transformOrigin: "0px -74px" }}>
          <rect x="-60" y="-140" width="120" height="66" rx="8" fill="#fcc419" />
          <circle cx="0" cy="-107" r="20" fill="#fff" opacity="0.85" />
          <g className="ka-klotz" style={{ ...nth(2), transformOrigin: "0px -140px" }}>
            <rect x="-50" y="-196" width="100" height="56" rx="8" fill="#4dabf7" />
            <path d={heartPath(0, -168, 16)} fill="#fff" opacity="0.85" />
            <g className="ka-klotz-roof" style={{ transformOrigin: "0px -196px" }}>
              <path d="M-52 -196 L0 -250 L52 -196 Z" fill="#51cf66" strokeLinejoin="round" stroke="#51cf66" strokeWidth="6" />
            </g>
          </g>
        </g>
      </g>
    </>
  );
}

/** An open picture book on the floor; two pages turn over and back. */
export function Bilderbuch() {
  const right = "M0 -66 Q50 -82 104 -70 L114 -10 Q56 -20 0 -6 Z";
  const left = "M0 -66 Q-50 -82 -104 -70 L-114 -10 Q-56 -20 0 -6 Z";
  return (
    <>
      <path d="M-120 -4 L-110 -72 Q-56 -86 0 -72 Q56 -86 110 -72 L120 -4 Q60 -14 0 2 Q-60 -14 -120 -4 Z" fill="#e64980" />
      <path d={left} fill="#fff" />
      <circle cx="-56" cy="-44" r="16" fill="#ffd43b" />
      <path d="M-90 -26 Q-56 -40 -24 -24" stroke="#69db7c" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={right} fill="#fff" />
      <path d="M30 -30 Q50 -60 72 -30 Z" fill="#74c0fc" />
      <circle cx="51" cy="-28" r="5" fill="#fff" />
      {[0, 1].map((i) => (
        <g key={i} className="ka-buch-page" style={{ ...nth(i), transformOrigin: "0px -36px" }}>
          <path d={right} fill={i ? "#fff9db" : "#f8f9fa"} stroke="#e9ecef" strokeWidth="2" />
          {i === 0 ? <path d={heartPath(56, -40, 14)} fill="#ff8787" /> : <path d={sparklePath(56, -40, 16)} fill="#fab005" />}
        </g>
      ))}
      <path d="M0 -72 V0" stroke="#dee2e6" strokeWidth="3" />
      <Sparkles x={0} y={-104} count={3} spread={50} r={9} />
    </>
  );
}

/** The toy fire engine; it drives to and fro, the blue light blinks and the ladder lifts. */
export function Feuerwehr() {
  return (
    <>
      <g className="ka-feuer-drive">
        <g className="ka-feuer-ladder" style={{ transformOrigin: "-90px -112px" }}>
          <path d="M-96 -112 H40 M-96 -128 H40" stroke="#dee2e6" strokeWidth="6" strokeLinecap="round" />
          <path d="M-80 -112 V-128 M-56 -112 V-128 M-32 -112 V-128 M-8 -112 V-128 M16 -112 V-128" stroke="#dee2e6" strokeWidth="4" />
        </g>
        <rect x="-112" y="-104" width="224" height="66" rx="12" fill="#e03131" />
        <path d="M40 -104 V-132 Q40 -142 52 -142 H92 Q110 -142 112 -120 V-104 Z" fill="#e03131" />
        <rect x="54" y="-134" width="40" height="26" rx="5" fill="#d0ebff" />
        <circle cx="74" cy="-124" r="8" fill={SKIN} />
        <rect x="-100" y="-90" width="120" height="16" rx="4" fill="#fff" opacity="0.9" />
        <path d="M-108 -60 H108" stroke="#c92a2a" strokeWidth="5" />
        <rect x="66" y="-156" width="18" height="14" rx="5" fill="#4dabf7" />
        <ellipse className="ka-feuer-light" cx="75" cy="-150" rx="22" ry="16" fill="#74c0fc" />
        <rect x="104" y="-70" width="12" height="10" rx="3" fill="#ffd43b" />
        <g className="ka-feuer-wheel" style={{ transformOrigin: "-66px -32px" }}>
          <Wheel cx={-66} cy={-32} r={30} />
        </g>
        <g className="ka-feuer-wheel" style={{ transformOrigin: "66px -32px" }}>
          <Wheel cx={66} cy={-32} r={30} />
        </g>
      </g>
      <Lines x={124} y={-150} colour="#4dabf7" />
    </>
  );
}

/** A big colourful ball; it bounces twice and squishes. */
export function Ball() {
  return (
    <>
      <g className="ka-ball" style={{ transformOrigin: "0px 0px" }}>
        <g className="ka-ball-spin" style={{ transformOrigin: "0px -56px" }}>
          <circle cx="0" cy="-56" r="56" fill="#ffd43b" />
          <path d="M0 -112 A56 56 0 0 1 56 -56 H0 Z" fill="#ff6b6b" />
          <path d="M0 0 A56 56 0 0 1 -56 -56 H0 Z" fill="#4dabf7" />
          <path d="M-56 -56 A56 56 0 0 1 0 -112 V-56 Z" fill="#69db7c" />
          <circle cx="0" cy="-56" r="14" fill="#fff" />
        </g>
        <path d="M-34 -84 Q-22 -100 -4 -104" stroke="#fff" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.5" />
      </g>
    </>
  );
}
