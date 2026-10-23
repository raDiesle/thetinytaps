import { Inside, nth, sparklePath } from "../shared";
import { Cheek, DinoEye, Notes, Smile } from "./parts";

// The smaller animals: pterosaurs, the Urvogel, the swimming saurian, fish, frog, turtle,
// the eggs, the lizard and the little bugs. Each drawing has its foot point at (0, 0),
// except those that sit on something (the nest on the cliff, the Urvogel on its branch,
// the frog on the lily pad, the lizard on the log, the butterfly over the flower), which
// are drawn in the coordinates of what they sit on.

const CREAM = "#fff8e7";
const FLUG = "#ec6a5c";
const FLUG_WING = "#f7a596";

// ---------- Flugsaurier ----------

/** Pterosaur in the sky, centred on (0, 0) and facing right; it flaps and flies a round loop. */
export function Flugsaurier() {
  return (
    <g className="dt-flug-body">
      <g className="dt-flug-wing dt-flug-wing-far" style={{ transformOrigin: "0px -4px" }}>
        <path d="M6 -8 Q62 -54 138 -38 Q112 -18 98 4 Q62 -6 42 8 Q22 0 6 8 Z" fill="#e05a4c" />
      </g>
      <path d="M-10 10 l-8 14 M4 12 l-4 14" stroke="#c44536" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="0" cy="0" rx="28" ry="14" fill={FLUG} />
      <ellipse cx="4" cy="5" rx="18" ry="7" fill="#ffd0c4" />
      <g className="dt-flug-wing" style={{ transformOrigin: "0px -4px" }}>
        <path d="M-6 -8 Q-60 -54 -142 -36 Q-112 -16 -98 6 Q-62 -4 -42 10 Q-22 2 -6 8 Z" fill={FLUG_WING} />
        <path d="M-6 -8 Q-60 -54 -142 -36" stroke="#d9534f" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      <g className="dt-flug-head" style={{ transformOrigin: "24px -10px" }}>
        <path d="M26 -24 Q8 -48 -10 -54 Q8 -36 18 -18 Z" fill="#c44536" />
        <circle cx="34" cy="-14" r="17" fill={FLUG} />
        <path d="M46 -20 Q82 -16 98 -6 Q82 0 46 -6 Z" fill="#ffb347" />
        <path d="M56 -9 Q72 -6 84 -8" stroke="#e08e2b" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <DinoEye cx={34} cy={-18} r={7.5} skin={FLUG} look={1} />
        <Cheek cx={40} cy={-4} r={5} />
      </g>
      <Notes x={70} y={-50} texts={["Krääh!"]} size={22} delays={[0.4]} />
    </g>
  );
}

/** The pterosaur baby in its nest on top of the cliff (cliff coordinates); it pops up, flaps its tiny wings and peeps. */
export function FlugsaurierBaby() {
  return (
    <>
      <ellipse cx="14" cy="-296" rx="50" ry="14" fill="#7f5539" />
      <g className="dt-flugbaby-body">
        <path className="dt-flugbaby-wing" d="M0 -310 Q-24 -326 -32 -304 Q-14 -302 0 -298 Z" fill={FLUG_WING} style={{ transformOrigin: "0px -306px" }} />
        <path className="dt-flugbaby-wing dt-flugbaby-wing-r" d="M28 -310 Q52 -326 60 -304 Q42 -302 28 -298 Z" fill={FLUG_WING} style={{ transformOrigin: "28px -306px" }} />
        <ellipse cx="14" cy="-304" rx="22" ry="18" fill={FLUG} />
        <path d="M20 -338 Q6 -352 -6 -352 Q4 -340 12 -332 Z" fill="#c44536" />
        <circle cx="22" cy="-326" r="16" fill={FLUG} />
        <path className="dt-flugbaby-beak" d="M34 -322 Q50 -318 56 -312 Q46 -310 34 -314 Z" fill="#e08e2b" style={{ transformOrigin: "34px -316px" }} />
        <path d="M34 -330 Q54 -328 62 -320 Q50 -316 34 -320 Z" fill="#ffb347" />
        <DinoEye cx={22} cy={-330} r={7} skin={FLUG} look={1} />
        <Cheek cx={26} cy={-316} r={4.5} />
      </g>
      <path d="M-36 -298 Q-34 -276 14 -274 Q62 -276 64 -298 Q40 -288 14 -288 Q-12 -288 -36 -298 Z" fill="#9c6644" />
      <path d="M-30 -292 L0 -282 M20 -296 L52 -284 M-14 -280 L40 -290" stroke="#b08968" strokeWidth="4" strokeLinecap="round" />
      <Notes x={64} y={-340} texts={["Piep!", "Piep!"]} size={20} delays={[0.3, 0.8]} />
    </>
  );
}

// ---------- Urvogel ----------

/** The Urvogel on the tree's branch (tree coordinates), facing left; it hops, flaps and peeps. */
export function Urvogel() {
  return (
    <g className="dt-urvogel-body">
      <path className="dt-urvogel-tail" d="M126 -362 Q150 -350 160 -322 Q146 -330 138 -326 Q140 -340 120 -352 Z" fill="#2f9e8f" style={{ transformOrigin: "124px -356px" }} />
      <path d="M104 -346 l-4 10 M114 -346 l2 10" stroke="#e08e2b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="112" cy="-362" rx="22" ry="16" fill="#4cc9a6" />
      <ellipse cx="106" cy="-356" rx="12" ry="8" fill={CREAM} />
      <path d="M86 -396 Q90 -410 100 -404 Q96 -398 92 -392 Z" fill="#ff6b6b" />
      <circle cx="92" cy="-382" r="13" fill="#4cc9a6" />
      <path d="M80 -384 Q70 -382 70 -378 Q76 -376 80 -378 Z" fill="#ffb347" />
      <DinoEye cx={90} cy={-386} r={5.5} skin="#4cc9a6" look={-1} />
      <Cheek cx={96} cy={-376} r={3.5} />
      <g className="dt-urvogel-wing" style={{ transformOrigin: "118px -368px" }}>
        <path d="M100 -370 Q124 -384 140 -366 Q130 -352 108 -356 Z" fill="#2f9e8f" />
        <path d="M108 -362 l-6 -6 M114 -360 l-6 -6" stroke="#e08e2b" strokeWidth="2" strokeLinecap="round" />
      </g>
      <Notes x={54} y={-404} texts={["Piep!"]} size={18} delays={[0.5]} />
    </g>
  );
}

// ---------- Libelle ----------

/** A big dragonfly over the lake, centred on (0, 0); it whirs its wings and zigzags. */
export function Libelle() {
  return (
    <g className="dt-libelle-body">
      <g className="dt-libelle-wings" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="2" opacity="0.9">
        <ellipse cx="-6" cy="-16" rx="12" ry="30" transform="rotate(-60 -6 -16)" />
        <ellipse cx="10" cy="-16" rx="12" ry="30" transform="rotate(60 10 -16)" />
        <ellipse cx="-4" cy="-8" rx="9" ry="22" transform="rotate(-100 -4 -8)" />
        <ellipse cx="8" cy="-8" rx="9" ry="22" transform="rotate(100 8 -8)" />
      </g>
      <path d="M-44 -4 H18" stroke="#339af0" strokeWidth="8" strokeLinecap="round" />
      <path d="M-36 -4 h4 M-24 -4 h4 M-12 -4 h4" stroke="#1c7ed6" strokeWidth="8" />
      <circle cx="26" cy="-6" r="11" fill="#339af0" />
      <circle cx="30" cy="-10" r="5" fill="#51cf66" />
      <circle cx="31" cy="-11" r="2" fill="#fff" />
      <path d="M26 2 q4 3 8 0" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  );
}

// ---------- Wassersaurier ----------

const WS = "#5cc5b0";

/** Long-necked swimmer in the lake (foot = water line); it dives, pops up again with a splash and smiles. */
export function Wassersaurier() {
  return (
    <>
      <Inside d="M-140 -260 H160 V2 H-140 Z">
        <g className="dt-ws-body">
          <ellipse cx="-56" cy="4" rx="62" ry="24" fill={WS} />
          <ellipse cx="-70" cy="-8" rx="10" ry="5" fill="#8fe0cf" />
          <ellipse cx="-40" cy="-12" rx="8" ry="4" fill="#8fe0cf" />
          <path className="dt-ws-flipper" d="M-100 -2 Q-130 -14 -136 2 Q-120 6 -100 4 Z" fill="#45ad99" style={{ transformOrigin: "-100px 0px" }} />
          <g className="dt-ws-neck" style={{ transformOrigin: "4px 0px" }}>
            <path d="M-16 4 Q-30 -80 0 -130 Q18 -158 12 -182 L42 -180 Q48 -150 28 -122 Q6 -80 22 4 Z" fill={WS} />
            <path d="M2 -150 Q-14 -110 -6 -60" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" fill="none" />
            <ellipse cx="38" cy="-188" rx="32" ry="21" fill={WS} />
            <circle cx="64" cy="-196" r="2.5" fill="#2b2d42" />
            <DinoEye cx={32} cy={-196} r={9} skin={WS} look={1} />
            <Cheek cx={48} cy={-176} r={6} />
            <Smile x={50} y={-182} w={16} d={4} width={2.6} />
          </g>
        </g>
      </Inside>
      <g fill="#fff" opacity="0.7">
        <ellipse cx="4" cy="2" rx="30" ry="5" />
        <ellipse cx="-56" cy="4" rx="64" ry="5" />
      </g>
      <g className="dt-ws-rings" fill="none" stroke="#fff" strokeWidth="3">
        {[0, 1].map((i) => (
          <ellipse key={i} cx="4" cy="2" rx={30 + i * 22} ry={6 + i * 4} style={nth(i)} />
        ))}
      </g>
      <g className="dt-ws-drops" fill="#bfe9f7" stroke="#fff" strokeWidth="2">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-6 + i * 10} cy={-6} r={6} style={nth(i)} />
        ))}
      </g>
      <Notes x={60} y={-212} texts={["Platsch!"]} size={24} delays={[1.3]} />
    </>
  );
}

// ---------- Fisch ----------

/** A little orange fish in the lake (foot = water line); it jumps out in an arc and dives back in. */
export function Fisch() {
  return (
    <>
      <g className="dt-fisch-body">
        <path d="M-20 -6 L-42 -20 Q-36 -6 -42 8 Z" fill="#f76707" />
        <path d="M-6 -18 Q4 -30 16 -18 Z" fill="#f76707" />
        <ellipse cx="0" cy="-6" rx="26" ry="14" fill="#ff922b" />
        <path d="M-6 -16 Q-12 -6 -6 4" stroke="#ffc078" strokeWidth="3" strokeLinecap="round" fill="none" />
        <DinoEye cx={12} cy={-9} r={5} skin="#ff922b" look={1} />
        <path d="M18 0 q4 2 7 -1" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="-4" cy="2" rx="40" ry="8" fill="#7ccbed" opacity="0.6" />
      <g className="dt-fisch-rings" fill="none" stroke="#fff" strokeWidth="2.5">
        {[0, 1].map((i) => (
          <ellipse key={i} cx="40" cy="0" rx={12 + i * 12} ry={3 + i * 3} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Seerose und Frosch ----------

/** A lily pad on the lake with a pink water lily; its petals open wide and it bobs. */
export function Seerose() {
  return (
    <g className="dt-rose-pad">
      <path d="M0 0 L-6 -16 A72 18 0 1 0 14 -17 Z" fill="#52b788" />
      <ellipse cx="-10" cy="-6" rx="54" ry="9" fill="#74c69d" opacity="0.6" />
      <g transform="translate(36 -12)">
        {[-50, -20, 20, 50].map((a, i) => (
          <g key={a} transform={`rotate(${a})`}>
            <ellipse className="dt-rose-petal" cx="0" cy="-14" rx="8" ry="16" fill={i % 3 ? "#ffafcc" : "#ffc8dd"} style={{ ...nth(i), transformOrigin: "0px 0px" }} />
          </g>
        ))}
        <ellipse cx="0" cy="-12" rx="7" ry="15" fill="#ffc8dd" />
        <circle cx="0" cy="-10" r="5" fill="#ffd60a" />
      </g>
      <g className="dt-rose-sparks" fill="#fff">
        {[0, 1, 2].map((i) => (
          <path key={i} d={sparklePath(16 + i * 22, -46 + (i % 2) * 10, 7)} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

const FROG = "#74c69d";

/** The frog on the lily pad (pad coordinates); it puffs its throat, croaks and hops. */
export function Frosch() {
  return (
    <g className="dt-frosch-body">
      <ellipse cx="-50" cy="-8" rx="12" ry="5" fill="#52b788" />
      <ellipse cx="-6" cy="-8" rx="12" ry="5" fill="#52b788" />
      <ellipse cx="-28" cy="-22" rx="24" ry="17" fill={FROG} />
      <ellipse className="dt-frosch-sac" cx="-28" cy="-12" rx="11" ry="8" fill="#d8f3dc" />
      <circle cx="-38" cy="-38" r="9" fill={FROG} />
      <circle cx="-18" cy="-38" r="9" fill={FROG} />
      <DinoEye cx={-38} cy={-39} r={6} skin={FROG} />
      <DinoEye cx={-18} cy={-39} r={6} skin={FROG} />
      <Smile x={-38} y={-24} w={20} d={4} width={2.4} />
      <Cheek cx={-46} cy={-22} r={4} />
      <Cheek cx={-10} cy={-22} r={4} />
      <Notes x={-14} y={-56} texts={["Quak!"]} size={18} delays={[0.4]} />
    </g>
  );
}

// ---------- Schildkröte ----------

const TURTLE = "#b5d99c";

/** The turtle sunbathing on a stone at the shore; she pulls in her head, peeks out again and paddles her legs. */
export function Schildkroete() {
  return (
    <>
      <ellipse cx="0" cy="-12" rx="72" ry="22" fill="#a39b93" />
      <ellipse cx="-12" cy="-20" rx="40" ry="7" fill="#fff" opacity="0.3" />
      {[-30, 34].map((x, i) => (
        <ellipse key={x} className="dt-turtle-leg" cx={x} cy="-28" rx="12" ry="8" fill={TURTLE} style={nth(i)} />
      ))}
      <g className="dt-turtle-head" style={{ transformOrigin: "-40px -40px" }}>
        <path d="M-30 -42 Q-44 -46 -50 -44 L-46 -32 Q-36 -32 -30 -34 Z" fill={TURTLE} />
        <circle cx="-58" cy="-46" r="15" fill={TURTLE} />
        <DinoEye cx={-62} cy={-50} r={5.5} skin={TURTLE} look={-1} />
        <Cheek cx={-58} cy={-38} r={4} />
        <path d="M-72 -40 q5 3 10 0" stroke="#2b2d42" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </g>
      <g className="dt-turtle-shell" style={{ transformOrigin: "4px -28px" }}>
        <path d="M-42 -28 Q-38 -78 4 -80 Q46 -78 50 -28 Z" fill="#7fae5b" />
        <path d="M-42 -28 Q4 -20 50 -28 Q46 -22 4 -18 Q-38 -22 -42 -28 Z" fill="#d4a373" />
        <g fill="#9cc97a">
          <path d="M4 -70 l13 8 v14 l-13 8 l-13 -8 v-14 Z" />
          <circle cx="-22" cy="-46" r="8" />
          <circle cx="30" cy="-46" r="8" />
        </g>
        <path d="M-26 -62 Q-10 -76 10 -76" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

// ---------- Eier ----------

/** A spotted egg in two halves along a zigzag line; somebody small sits inside and peeks out when the top lifts. */
function Egg({ x, y, rx, ry, baby, i, cls }: { x: number; y: number; rx: number; ry: number; baby: string; i: number; cls: string }) {
  const z = y - ry * 0.12;
  const zig = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1].map((t, k) => `${x + t * rx} ${z + (k % 2 ? ry * 0.12 : -ry * 0.06)}`);
  const top = `M${zig[0]} Q${x - rx} ${y - ry} ${x} ${y - ry} Q${x + rx} ${y - ry} ${zig[6]} L${zig.slice(0, 6).reverse().join(" L")} Z`;
  const bottom = `M${zig[0]} L${zig.slice(1).join(" L")} Q${x + rx} ${y + ry} ${x} ${y + ry} Q${x - rx} ${y + ry} ${zig[0]} Z`;
  return (
    <g className={`${cls}-egg`} style={nth(i)}>
      <g className={`${cls}-baby`}>
        <circle cx={x} cy={y - ry * 0.25} r={rx * 0.7} fill={baby} />
        <circle cx={x - rx * 0.26} cy={y - ry * 0.32} r={rx * 0.14} fill="#2b2d42" />
        <circle cx={x + rx * 0.26} cy={y - ry * 0.32} r={rx * 0.14} fill="#2b2d42" />
        <circle cx={x - rx * 0.22} cy={y - ry * 0.36} r={rx * 0.05} fill="#fff" />
        <circle cx={x + rx * 0.3} cy={y - ry * 0.36} r={rx * 0.05} fill="#fff" />
      </g>
      <path d={bottom} fill={CREAM} />
      <g className={`${cls}-cap`}>
        <path d={top} fill={CREAM} />
        <circle cx={x - rx * 0.4} cy={y - ry * 0.55} r={rx * 0.14} fill="#a5d8ff" />
        <circle cx={x + rx * 0.3} cy={y - ry * 0.7} r={rx * 0.1} fill="#a5d8ff" />
        <path d={`M${x - rx * 0.5} ${y - ry * 0.4} Q${x - rx * 0.6} ${y - ry * 0.8} ${x - rx * 0.1} ${y - ry * 0.9}`} stroke="#fff" strokeWidth={rx * 0.12} strokeLinecap="round" fill="none" />
      </g>
      <circle cx={x + rx * 0.45} cy={y + ry * 0.4} r={rx * 0.12} fill="#a5d8ff" />
      <circle cx={x - rx * 0.3} cy={y + ry * 0.55} r={rx * 0.09} fill="#a5d8ff" />
    </g>
  );
}

/** The nest with three eggs: they wobble, knock, and little eyes peek out from under the tops. */
export function Nest() {
  return (
    <>
      <ellipse cx="0" cy="-26" rx="96" ry="22" fill="#7f5539" />
      <Egg x={-44} y={-42} rx={24} ry={30} baby="#b2f2bb" i={0} cls="dt-nest" />
      <Egg x={44} y={-40} rx={24} ry={30} baby="#d0bfff" i={2} cls="dt-nest" />
      <Egg x={0} y={-48} rx={25} ry={31} baby="#ffd8a8" i={1} cls="dt-nest" />
      <path d="M-100 -28 Q-96 4 0 6 Q96 4 100 -28 Q60 -12 0 -12 Q-60 -12 -100 -28 Z" fill="#9c6644" />
      <path d="M-88 -16 L-40 -4 M-20 -2 L40 -10 M30 2 L84 -14 M-70 -2 L-10 -12" stroke="#b08968" strokeWidth="5" strokeLinecap="round" />
      <Notes x={90} y={-70} texts={["Tock!", "Tock!"]} size={20} delays={[0.3, 0.9]} />
    </>
  );
}

const BABY = "#96e6a1";

/** The big egg on its own: it wobbles, cracks, the top pops off and a baby dino waves hello. */
export function DinoEi() {
  return (
    <>
      <g className="dt-ei-bits" fill={CREAM}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-10 + i * 10} -96 l8 -4 l4 8 Z`} style={nth(i)} />
        ))}
      </g>
      <g className="dt-ei-egg">
        <g className="dt-ei-baby">
          <path className="dt-ei-arm" d="M-24 -56 Q-44 -64 -46 -80 Q-38 -84 -34 -74 Q-30 -66 -20 -64 Z" fill={BABY} style={{ transformOrigin: "-22px -60px" }} />
          <path className="dt-ei-arm dt-ei-arm-r" d="M24 -56 Q44 -64 46 -80 Q38 -84 34 -74 Q30 -66 20 -64 Z" fill={BABY} style={{ transformOrigin: "22px -60px" }} />
          <circle cx="0" cy="-66" r="27" fill={BABY} />
          <circle cx="-10" cy="-94" r="6" fill="#69db7c" />
          <circle cx="4" cy="-96" r="6" fill="#69db7c" />
          <DinoEye cx={-10} cy={-70} r={8} skin={BABY} />
          <DinoEye cx={10} cy={-70} r={8} skin={BABY} />
          <Cheek cx={-18} cy={-56} r={5} />
          <Cheek cx={18} cy={-56} r={5} />
          <Smile x={-7} y={-56} w={14} d={4} width={2.4} />
        </g>
        <path d="M-40 -56 L-28 -48 L-14 -60 L0 -48 L14 -60 L28 -48 L40 -56 Q42 0 0 0 Q-42 0 -40 -56 Z" fill="#e6fcf5" />
        <g className="dt-ei-cap" style={{ transformOrigin: "0px -56px" }}>
          <path d="M-40 -56 Q-38 -104 0 -104 Q38 -104 40 -56 L28 -48 L14 -60 L0 -48 L-14 -60 L-28 -48 Z" fill="#e6fcf5" />
          <path d="M-26 -60 Q-30 -90 -6 -96" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="16" cy="-84" r="6" fill="#63e6be" />
          <circle cx="-14" cy="-74" r="4" fill="#63e6be" />
        </g>
        <path className="dt-ei-crack" d="M-40 -56 L-28 -48 L-14 -60 L0 -48 L14 -60 L28 -48 L40 -56" stroke="#adb5bd" strokeWidth="3" strokeLinejoin="round" fill="none" />
        <circle cx="20" cy="-26" r="7" fill="#63e6be" />
        <circle cx="-18" cy="-18" r="5" fill="#63e6be" />
        <circle cx="-4" cy="-36" r="4" fill="#63e6be" />
      </g>
      <Notes x={30} y={-110} texts={["Knack!", "Hallo!"]} size={22} delays={[0.6, 1.3]} />
    </>
  );
}

// ---------- Eidechse ----------

const LIZARD = "#f6bd60";

/** A lizard sunbathing on the log (log coordinates), facing left; she does push-ups, flicks her tongue and curls her tail. */
export function Eidechse() {
  return (
    <g className="dt-echse-body">
      <path className="dt-echse-tail" d="M-30 -96 Q0 -100 10 -112 Q20 -124 8 -128 Q2 -122 6 -116 Q-6 -104 -30 -104 Z" fill={LIZARD} style={{ transformOrigin: "-28px -100px" }} />
      <path d="M-60 -88 l-6 4 M-38 -88 l-4 5 M-80 -90 l-4 6" stroke="#e09f3e" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="-52" cy="-98" rx="30" ry="9" fill={LIZARD} />
      <g fill="#e09f3e">
        <circle cx="-56" cy="-102" r="2.5" />
        <circle cx="-44" cy="-100" r="2.5" />
        <circle cx="-34" cy="-102" r="2" />
      </g>
      <path className="dt-echse-tongue" d="M-104 -98 q-6 -1 -9 -4 M-104 -98 q-6 1 -9 4" stroke="#ff6b8b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <ellipse cx="-88" cy="-102" rx="16" ry="11" fill={LIZARD} />
      <DinoEye cx={-90} cy={-106} r={5} skin={LIZARD} look={-1} />
      <path d="M-102 -98 q4 3 8 0" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" fill="none" />
      <Cheek cx={-84} cy={-96} r={3} />
    </g>
  );
}

// ---------- Schnecke, Käfer, Schmetterling ----------

/** A little snail with a pink spiral shell; her eye stalks stretch, she crawls forward and back. */
export function Schnecke() {
  return (
    <g className="dt-schnecke-body">
      <path d="M-46 0 Q-50 -16 -34 -18 H40 Q56 -16 56 0 Z" fill="#ffe08a" />
      <g className="dt-schnecke-eyes" style={{ transformOrigin: "46px -16px" }}>
        <path d="M44 -16 L40 -40 M50 -16 L56 -38" stroke="#ffe08a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="40" cy="-42" r="5.5" fill="#fff" />
        <circle cx="56" cy="-40" r="5.5" fill="#fff" />
        <circle cx="41" cy="-42" r="3" fill="#2b2d42" />
        <circle cx="57" cy="-40" r="3" fill="#2b2d42" />
      </g>
      <path d="M50 -6 q4 3 8 0" stroke="#2b2d42" strokeWidth="2" strokeLinecap="round" fill="none" />
      <g className="dt-schnecke-shell" style={{ transformOrigin: "-4px -14px" }}>
        <circle cx="-4" cy="-36" r="28" fill="#f4a6c4" />
        <path d="M-4 -36 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 1 1 12 12 a18 18 0 1 1 -18 -18" stroke="#d6336c" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M-26 -50 Q-18 -64 -4 -64" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** A red beetle; it opens its wing cases, whirs its wings and lifts off for a little hop. */
export function Kaefer() {
  return (
    <g className="dt-kaefer-body">
      <path d="M-20 -10 l-10 8 M0 -8 v10 M20 -10 l10 8" stroke="#2b2d42" strokeWidth="3.5" strokeLinecap="round" />
      <g className="dt-kaefer-wings" fill="#e7f5ff" opacity="0.85">
        <ellipse cx="-20" cy="-36" rx="10" ry="22" transform="rotate(-40 -20 -36)" />
        <ellipse cx="20" cy="-36" rx="10" ry="22" transform="rotate(40 20 -36)" />
      </g>
      <circle cx="0" cy="-36" r="11" fill="#2b2d42" />
      <circle cx="-4" cy="-38" r="3" fill="#fff" />
      <circle cx="5" cy="-38" r="3" fill="#fff" />
      <path className="dt-kaefer-case" d="M0 -30 Q-26 -30 -24 -14 Q-20 -2 0 -2 Z" fill="#e03131" style={{ transformOrigin: "0px -28px" }} />
      <path className="dt-kaefer-case dt-kaefer-case-r" d="M0 -30 Q26 -30 24 -14 Q20 -2 0 -2 Z" fill="#f03e3e" style={{ transformOrigin: "0px -28px" }} />
      <circle cx="-11" cy="-16" r="3.5" fill="#2b2d42" />
      <circle cx="11" cy="-16" r="3.5" fill="#2b2d42" />
    </g>
  );
}

/** A yellow butterfly over the flower (flower coordinates); it flaps and flutters a little loop. */
export function Schmetterling() {
  return (
    <g className="dt-falter-body">
      <g className="dt-falter-wings" style={{ transformOrigin: "34px -170px" }}>
        <path d="M34 -170 Q12 -200 6 -180 Q4 -164 34 -168 Z" fill="#ffd43b" />
        <path d="M34 -168 Q14 -160 16 -150 Q26 -146 34 -166 Z" fill="#ffa94d" />
        <path d="M34 -170 Q56 -200 62 -180 Q64 -164 34 -168 Z" fill="#ffd43b" />
        <path d="M34 -168 Q54 -160 52 -150 Q42 -146 34 -166 Z" fill="#ffa94d" />
        <circle cx="18" cy="-180" r="3.5" fill="#fff" opacity="0.8" />
        <circle cx="50" cy="-180" r="3.5" fill="#fff" opacity="0.8" />
      </g>
      <ellipse cx="34" cy="-166" rx="3.5" ry="11" fill="#5c4033" />
      <path d="M33 -176 q-4 -8 -8 -10 M35 -176 q4 -8 8 -10" stroke="#5c4033" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  );
}
