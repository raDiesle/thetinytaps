import { Hideout } from "../hideout";
import { Face, INK, Pane, Rider, STEEL, Wheel, nth, side, sparklePath } from "../shared";
import { LEAF_COLOURS, Leaf } from "../weather";

// Things standing around in the autumn picture. Foot point at (0, 0).

/** A small pumpkin sitting on (x, y). */
function Pumpkin({ x, y, r = 16, colour = "#f77f00" }: { x: number; y: number; r?: number; colour?: string }) {
  return (
    <>
      <ellipse cx={x} cy={y - r * 0.8} rx={r * 1.15} ry={r * 0.85} fill={colour} />
      <ellipse cx={x} cy={y - r * 0.8} rx={r * 0.45} ry={r * 0.85} fill="#fff" opacity="0.18" />
      <path
        d={`M${x - r * 0.5} ${y - r * 1.5} Q${x - r * 0.7} ${y - r * 0.8} ${x - r * 0.5} ${y - 1} M${x + r * 0.5} ${y - r * 1.5} Q${x + r * 0.7} ${y - r * 0.8} ${x + r * 0.5} ${y - 1}`}
        stroke="#000"
        strokeOpacity="0.15"
        strokeWidth={r * 0.12}
        fill="none"
      />
      <path
        d={`M${x} ${y - r * 1.6} q${r * 0.1} ${-r * 0.4} ${r * 0.4} ${-r * 0.5}`}
        stroke="#6b4423"
        strokeWidth={r * 0.22}
        strokeLinecap="round"
        fill="none"
      />
    </>
  );
}

/** The green garden shed: the door opens (someone peeks out), the window lights up, leaves blow off the roof. */
export function Schuppen() {
  return (
    <>
      <rect x="-96" y="-150" width="192" height="150" fill="#52b788" />
      <path d={Array.from({ length: 7 }, (_, i) => `M${-96 + (i + 1) * 24} -150 V0`).join(" ")} stroke="#40916c" strokeWidth="3" />
      <rect x="70" y="-150" width="26" height="150" fill="#2d6a4f" opacity="0.25" />
      <path d="M-112 -144 L0 -206 L112 -144 Z" fill="#6b4423" />
      <path d="M-112 -144 L0 -206 L112 -144" stroke="#4a2f18" strokeWidth="8" strokeLinejoin="round" fill="none" />
      <g className="he-schuppen-roof">
        {[
          [-50, -170, 0],
          [-10, -192, 2],
          [40, -172, 3],
          [70, -156, 1],
        ].map(([x, y, c], i) => (
          <g key={i} className="he-schuppen-roofleaf" style={nth(i)}>
            <Leaf x={x} y={y} angle={i * 40 - 30} scale={2.4} colour={LEAF_COLOURS[c]} />
          </g>
        ))}
      </g>
      {/* Window with a light inside */}
      <rect x="40" y="-120" width="40" height="38" rx="3" fill="#fefae0" />
      <rect className="he-schuppen-light" x="42" y="-118" width="36" height="34" rx="2" fill="#ffd166" />
      <path d="M60 -120 V-82 M40 -101 H80" stroke="#6b4423" strokeWidth="4" />
      <rect x="36" y="-84" width="48" height="6" rx="2" fill="#6b4423" />
      {/* Door: dark inside, the surprise, then the door on its left hinge */}
      <rect x="-40" y="-112" width="60" height="112" rx="3" fill="#2d3a2e" />
      <Hideout x={-38} y={-110} w={56} h={110} size={62} />
      <g className="he-schuppen-door" style={{ transformOrigin: "-40px -56px" }}>
        <rect x="-40" y="-112" width="60" height="112" rx="3" fill="#bc8a5f" />
        <path d="M-34 -100 L14 -12 M-34 -100 H14 M-34 -12 H14" stroke="#9c6644" strokeWidth="5" />
        <circle cx="12" cy="-56" r="4" fill={INK} />
      </g>
      {/* A rake and a broom leaning on the wall */}
      <path d="M-74 0 L-62 -112 M-84 0 L-92 -96" stroke="#9c6644" strokeWidth="5" strokeLinecap="round" />
      <path d="M-74 -112 h24 M-72 -112 v8 M-66 -112 v8 M-60 -112 v8 M-54 -112 v8" stroke={STEEL} strokeWidth="3" strokeLinecap="round" />
      <path d="M-84 0 l-14 -18 h22 Z" fill="#e9c46a" />
    </>
  );
}

/** The back wall of the pumpkin stall, drawn with the background behind the farmer. */
export function StandBack() {
  return (
    <>
      <rect x="-112" y="-190" width="224" height="120" fill="#c68b59" />
      <path d={Array.from({ length: 6 }, (_, i) => `M-112 ${-176 + i * 20} H112`).join(" ")} stroke="#a47148" strokeWidth="3" />
    </>
  );
}

/** The pumpkin stall: the awning flaps, the pumpkins hop, the sign swings and the crate lid opens. */
export function Kuerbisstand() {
  return (
    <>
      <path d="M-116 0 V-226 M116 0 V-226" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      {/* Counter with pumpkins on it */}
      <rect x="-120" y="-80" width="240" height="80" rx="4" fill="#d4a373" />
      <path d="M-120 -54 H120 M-120 -28 H120" stroke="#bc8a5f" strokeWidth="4" />
      <rect x="-124" y="-86" width="248" height="10" rx="4" fill="#a47148" />
      {[
        [-94, 15, "#f77f00"],
        [26, 13, "#ffba08"],
        [62, 16, "#f48c06"],
        [96, 12, "#90a955"],
      ].map(([x, r, c], i) => (
        <g key={i} className="he-stand-pumpkin" style={{ transformOrigin: `${x}px -86px`, ...nth(i) }}>
          <Pumpkin x={Number(x)} y={-86} r={Number(r)} colour={String(c)} />
        </g>
      ))}
      <Pumpkin x={-70} y={-6} r={22} />
      <Pumpkin x={-30} y={-4} r={16} colour="#ffba08" />
      {/* Crate on the right: dark inside, the surprise, front, then the lid */}
      <rect x="126" y="-52" width="66" height="52" fill="#5c3d1e" />
      <Hideout x={128} y={-112} w={62} h={60} size={48} />
      <rect x="126" y="-46" width="66" height="46" rx="2" fill="#bc8a5f" />
      <path d="M126 -30 H192 M126 -14 H192" stroke="#9c6644" strokeWidth="3" />
      <g className="he-stand-lid" style={{ transformOrigin: "126px -50px" }}>
        <rect x="122" y="-56" width="74" height="10" rx="3" fill="#a47148" />
      </g>
      {/* Striped awning with a scalloped edge */}
      <g className="he-stand-awning" style={{ transformOrigin: "0px -232px" }}>
        <path d="M-132 -236 H132 L140 -196 H-140 Z" fill="#fff" />
        {[-110, -66, -22, 22, 66, 110].map((x) => (
          <path key={x} d={`M${x - 11} -236 H${x + 11} L${x + 13} -196 H${x - 13} Z`} fill="#f77f00" />
        ))}
        <path d={`M-140 -196 ${Array.from({ length: 10 }, () => "q14 14 28 0").join(" ")} Z`} fill="#f77f00" />
      </g>
      {/* Sign with a pumpkin on it, hanging on the front of the counter */}
      <g className="he-stand-sign" style={{ transformOrigin: "70px -76px" }}>
        <path d="M54 -76 L48 -64 M86 -76 L92 -64" stroke={INK} strokeWidth="2" />
        <rect x="38" y="-66" width="64" height="34" rx="6" fill="#fefae0" stroke="#8d5a2b" strokeWidth="3" />
        <Pumpkin x={56} y={-38} r={10} />
        <path d="M72 -54 h18 M72 -46 h12" stroke="#8d5a2b" strokeWidth="3" strokeLinecap="round" />
      </g>
    </>
  );
}

/** A wicker basket full of apples: the apples hop out one after the other and drop back in. */
export function Apfelkorb() {
  return (
    <>
      <path className="he-korb-handle" d="M-42 -50 Q0 -110 42 -50" stroke="#a47148" strokeWidth="7" fill="none" />
      {[
        [-26, -54, "#e63946"],
        [0, -60, "#90be6d"],
        [26, -54, "#e63946"],
        [-12, -46, "#ffd60a"],
        [14, -46, "#e63946"],
      ].map(([x, y, c], i) => (
        <g key={i} className="he-korb-apple" style={{ transformOrigin: `${x}px ${y}px`, ...nth(i) }}>
          <circle cx={Number(x)} cy={Number(y)} r="13" fill={String(c)} />
          <ellipse cx={Number(x) - 4} cy={Number(y) - 5} rx="4" ry="3" fill="#fff" opacity="0.55" />
          <path d={`M${x} ${Number(y) - 12} l2 -6`} stroke="#6b4423" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <path d="M-50 -46 H50 L40 0 H-40 Z" fill="#c68b59" />
      <path d="M-46 -32 H46 M-43 -18 H43 M-24 -46 L-20 0 M0 -46 V0 M24 -46 L20 0" stroke="#a47148" strokeWidth="3" />
      <rect x="-54" y="-50" width="108" height="9" rx="4" fill="#a47148" />
    </>
  );
}

/** The red handcart loaded with pumpkins: rolls forward and back, the wheels turn and the pumpkins bounce. */
export function Bollerwagen() {
  return (
    <g className="he-wagen-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="he-wagen-handle" style={{ transformOrigin: "-92px -40px" }}>
        <path d="M-92 -40 L-150 -96" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <path d="M-160 -90 L-140 -104" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      </g>
      {[
        [-50, 22, "#f77f00"],
        [6, 26, "#f48c06"],
        [56, 18, "#ffba08"],
      ].map(([x, r, c], i) => (
        <g key={i} className="he-wagen-load" style={{ transformOrigin: `${x}px -78px`, ...nth(i) }}>
          <Pumpkin x={Number(x)} y={-74} r={Number(r)} colour={String(c)} />
        </g>
      ))}
      <rect x="-94" y="-84" width="188" height="56" rx="6" fill="#e63946" />
      <rect x="-94" y="-84" width="188" height="10" rx="5" fill="#ff6b6b" />
      <path d="M-60 -74 V-30 M-20 -74 V-30 M20 -74 V-30 M60 -74 V-30" stroke="#c1121f" strokeWidth="4" />
      {[-56, 56].map((x) => (
        <g key={x} className="he-wagen-wheel" style={{ transformOrigin: `${x}px -24px` }}>
          <Wheel cx={x} cy={-24} r={24} />
        </g>
      ))}
    </g>
  );
}

/** Leaves of the pile: [x, y, angle, colour]; back rows first. */
const PILE_LEAVES = Array.from({ length: 46 }, (_, i) => {
  const row = Math.floor(i / 9);
  const k = i % 9;
  const half = 104 - row * 18;
  const x = -half + (k * 2 * half) / 8 + ((i * 7) % 9) - 4;
  const top = 74 - row * 4;
  const y = -10 - (1 - (x / 112) ** 2) * top + row * 14 + ((i * 5) % 7);
  return [x, Math.min(-6, y), (i * 47) % 360, i % 5] as const;
});

/** The big leaf pile: leaves whirl up and fall back, and something peeks out of the top. */
export function Laubhaufen() {
  return (
    <>
      <path d="M-112 0 Q-104 -70 0 -82 Q104 -70 112 0 Z" fill="#c8553d" />
      <path d="M-90 -6 Q-80 -54 0 -64 Q80 -54 90 -6 Z" fill="#e07a5f" opacity="0.6" />
      <Hideout x={-40} y={-150} w={80} h={84} size={64} />
      <g className="he-pile-heap" style={{ transformOrigin: "0px 0px" }}>
        {PILE_LEAVES.map(([x, y, a, c], i) => (
          <Leaf key={i} x={x} y={y} angle={a} scale={2.6} colour={LEAF_COLOURS[c]} />
        ))}
      </g>
      <g className="he-pile-burst">
        {[-70, -40, -14, 14, 40, 70, -26, 28].map((x, i) => (
          <g key={i} className="he-pile-leaf" style={{ ...nth(i), ...side(x < 0 ? -1 : 1) }}>
            <Leaf x={x} y={-60} angle={i * 45} scale={2.8} colour={LEAF_COLOURS[i % 5]} />
          </g>
        ))}
      </g>
    </>
  );
}

/** A muddy puddle with a leaf boat: rings spread, drops splash up and the leaf bobs. */
export function Pfuetze() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="132" ry="27" fill="#8d6e63" opacity="0.45" />
      <ellipse cx="0" cy="-1" rx="124" ry="23" fill="#74a9cf" />
      <ellipse cx="-6" cy="-4" rx="96" ry="14" fill="#a5cbe6" />
      <path d="M-80 -8 h40 M30 6 h50" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
      <g className="he-pfuetze-rings" fill="none" stroke="#fff" strokeWidth="3">
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx="-60" cy="0" rx="20" ry="5" style={nth(i)} />
        ))}
      </g>
      <g className="he-pfuetze-boat" style={{ transformOrigin: "-74px 0px" }}>
        <path d="M-96 -4 Q-74 10 -52 -4 Q-74 0 -96 -4 Z" fill="#e76f51" />
        <path d="M-74 -2 V-26 L-60 -10 Z" fill="#fefae0" />
        <path d="M-74 -2 V-28" stroke="#6b4423" strokeWidth="2" />
      </g>
      <g className="he-pfuetze-drops" fill="#74c0fc">
        {[
          [-100, 1],
          [-60, 1],
          [60, 1],
          [100, 1],
        ].map(([x], i) => (
          <circle key={i} cx={x} cy={-6} r="7" style={{ ...nth(i), ...side(x < 0 ? -1 : 1) }} />
        ))}
      </g>
    </>
  );
}

/** A pair of red rain boots with white dots: they hop one after the other, and someone peeks out of the right one. */
export function Gummistiefel() {
  const boot = (x: number) => (
    <>
      <path d={`M${x} -84 h40 v62 q0 6 6 8 l14 4 q8 4 8 10 v0 h-68 Z`} fill="#e63946" />
      <rect x={x} y="-8" width="68" height="8" rx="3" fill="#9d0208" />
      <path d={`M${x + 8} -76 v40`} stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" />
      {[
        [x + 26, -66],
        [x + 14, -46],
        [x + 30, -30],
        [x + 50, -12],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" fill="#fff" />
      ))}
    </>
  );
  return (
    <>
      <g className="he-stiefel" style={{ transformOrigin: "-46px 0px", ...nth(0) }}>
        <ellipse cx="-34" cy="-84" rx="20" ry="6" fill="#6a040f" />
        {boot(-54)}
        <ellipse cx="-34" cy="-84" rx="20" ry="6" fill="none" stroke="#c1121f" strokeWidth="3" />
      </g>
      <g className="he-stiefel" style={{ transformOrigin: "24px 0px", ...nth(1) }}>
        <ellipse cx="22" cy="-84" rx="20" ry="6" fill="#6a040f" />
        <Hideout x={2} y={-146} w={40} h={62} size={46} />
        {boot(2)}
        <ellipse cx="22" cy="-84" rx="20" ry="6" fill="none" stroke="#c1121f" strokeWidth="3" />
      </g>
      <g className="he-stiefel-drops" fill="#74c0fc">
        {[
          [-60, -60],
          [80, -40],
          [-10, -96],
        ].map(([x, y], i) => (
          <path key={i} style={nth(i)} d={`M${x} ${y - 8} q6 8 0 12 q-6 -4 0 -12 Z`} />
        ))}
      </g>
    </>
  );
}

/** A colourful pinwheel stuck in the grass: it spins. */
export function Windrad() {
  const blade = (rot: number, colour: string) => <path key={rot} d="M0 0 L0 -40 Q30 -36 30 -6 Z" fill={colour} transform={`rotate(${rot})`} />;
  return (
    <>
      {/* Wind lines that only show while it spins */}
      <g className="he-windrad-gusts" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none">
        {[-150, -128, -106].map((y, i) => (
          <path key={y} className="he-windrad-gust" style={nth(i)} d={`M-96 ${y} q16 -8 32 0 t32 0`} />
        ))}
      </g>
      <g className="he-windrad-sway" style={{ transformOrigin: "0px 0px" }}>
        <path className="he-windrad-stick" d="M0 0 V-128" stroke="#9c6644" strokeWidth="6" strokeLinecap="round" />
        <path
          className="he-windrad-ribbon"
          d="M0 -116 q10 6 4 18 q-6 10 4 20"
          stroke="#e63946"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          style={{ transformOrigin: "0px -116px" }}
        />
        <g transform="translate(0 -130)">
          <g className="he-windrad-blades">
            {blade(0, "#e63946")}
            {blade(90, "#ffd60a")}
            {blade(180, "#4dabf7")}
            {blade(270, "#52b788")}
          </g>
          <circle cx="0" cy="0" r="6" fill="#fff" stroke={INK} strokeWidth="2" />
        </g>
      </g>
    </>
  );
}

const PILZE = [
  [-48, 0, 0.8],
  [0, 0, 1.1],
  [46, 4, 0.65],
] as const;

/** Three ceps in the moss: they pop up one after the other. */
export function Steinpilze() {
  return (
    <>
      <ellipse cx="0" cy="0" rx="80" ry="10" fill="#6a994e" opacity="0.6" />
      {PILZE.map(([x, y, s], i) => (
        <g key={x} className="he-pilz" style={{ transformOrigin: `${x}px ${y}px`, ...nth(i) }}>
          <g transform={`translate(${x} ${y}) scale(${s})`}>
            <path d="M-18 0 Q-24 -30 -14 -54 H14 Q24 -30 18 0 Z" fill="#f1e3c8" />
            <path d="M6 -50 Q14 -28 10 -4" stroke="#d6c4a8" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M-40 -50 Q-40 -88 0 -88 Q40 -88 40 -50 Q20 -42 0 -42 Q-20 -42 -40 -50 Z" fill="#8d5a2b" />
            <path d="M-26 -72 Q-14 -84 4 -82" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" fill="none" />
          </g>
        </g>
      ))}
      <g className="he-pilz-sparkle" fill="#ffd60a">
        <path d={sparklePath(-70, -80, 9)} style={nth(0)} />
        <path d={sparklePath(64, -70, 8)} style={nth(1)} />
      </g>
    </>
  );
}

/** A little man made of chestnuts with an acorn cap: he dances, waves and his cap pops up. */
export function Kastanienmann() {
  return (
    <g className="he-kmann-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-10 -36 L-20 -2 M10 -36 L20 -2" stroke="#d4a373" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="-22" cy="-2" rx="9" ry="5" fill="#6b4423" />
      <ellipse cx="22" cy="-2" rx="9" ry="5" fill="#6b4423" />
      {([-1, 1] as const).map((s) => (
        <g key={s} className="he-kmann-arm" style={{ transformOrigin: `${s * 18}px -62px`, ...side(s) }}>
          <path d={`M${s * 18} -62 L${s * 44} -44`} stroke="#d4a373" strokeWidth="5" strokeLinecap="round" />
          <circle cx={s * 46} cy={-43} r="5" fill="#6b4423" />
        </g>
      ))}
      <ellipse cx="0" cy="-54" rx="26" ry="24" fill="#7f4f24" />
      <path d="M-20 -40 Q0 -28 20 -40 Q14 -32 0 -32 Q-14 -32 -20 -40 Z" fill="#e6ccb2" />
      <ellipse cx="-10" cy="-64" rx="8" ry="5" fill="#fff" opacity="0.4" />
      <circle cx="0" cy="-94" r="18" fill="#8d5a2b" />
      <Face cx={0} cy={-94} size={0.72} />
      <ellipse cx="-6" cy="-104" rx="5" ry="3" fill="#fff" opacity="0.35" />
      <g className="he-kmann-hat" style={{ transformOrigin: "0px -108px" }}>
        <path d="M-18 -106 Q-18 -126 0 -126 Q18 -126 18 -106 Z" fill="#a98467" />
        <path d="M-14 -112 h28 M-16 -118 h32" stroke="#7f5539" strokeWidth="2.5" />
        <path d="M0 -126 v-8" stroke="#6b4423" strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Blue tractor ploughing the field far back: puffs, the wheels turn, it rolls forward and back. */
export function Traktor() {
  return (
    <>
      <g className="he-trak-puffs" fill="#dee2e6">
        {[0, 1, 2].map((i) => (
          <circle key={i} className="he-trak-puff" cx="-34" cy="-110" r={8 + i * 3} style={nth(i)} />
        ))}
      </g>
      <g className="he-trak-body" style={{ transformOrigin: "0px 0px" }}>
        {/* The plough behind it */}
        <path d="M84 -40 L140 -20" stroke={STEEL} strokeWidth="7" strokeLinecap="round" />
        <path d="M110 -30 l14 28 l10 -4 Z M130 -24 l14 26 l10 -4 Z" fill="#adb5bd" />
        <rect x="-38" y="-96" width="8" height="34" rx="3" fill="#495057" />
        <path d="M-84 -66 Q-84 -78 -70 -78 H20 V-30 H-84 Z" fill="#1c7ed6" />
        <path d="M-80 -66 H16" stroke="#4dabf7" strokeWidth="6" strokeLinecap="round" />
        <rect x="-86" y="-58" width="8" height="12" rx="3" fill="#ffd60a" />
        <rect x="10" y="-124" width="76" height="94" rx="8" fill="#1971c2" />
        <Pane x={20} y={-116} w={56} h={44}>
          <Rider cx={46} cy={-92} shirt="#e63946" cap="#2b2d42" />
        </Pane>
        {[
          [-56, -22, 22],
          [48, -34, 34],
        ].map(([x, y, r]) => (
          <g key={x} className="he-trak-wheel" style={{ transformOrigin: `${x}px ${y}px` }}>
            <Wheel cx={x} cy={y} r={r} />
          </g>
        ))}
        <path d="M14 -64 Q48 -82 82 -64" stroke="#1864ab" strokeWidth="8" fill="none" />
      </g>
    </>
  );
}

/** Spider's web between two fence posts, with dew drops: the web trembles, the drops sparkle and the spider abseils down. */
export function Spinnennetz() {
  const rings = [12, 22, 32, 42].map((r) =>
    Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return `${(Math.cos(a) * r).toFixed(1)} ${(-60 + Math.sin(a) * r).toFixed(1)}`;
    }),
  );
  return (
    <>
      <rect x="-62" y="-104" width="12" height="104" rx="3" fill="#a47148" />
      <rect x="50" y="-104" width="12" height="104" rx="3" fill="#a47148" />
      <rect x="-70" y="-22" width="140" height="10" rx="3" fill="#bc8a5f" />
      <g className="he-netz-web" style={{ transformOrigin: "0px -60px" }} stroke="#fff" strokeWidth="1.8" fill="none" opacity="0.95">
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4;
          return <path key={i} d={`M0 -60 L${(Math.cos(a) * 50).toFixed(1)} ${(-60 + Math.sin(a) * 50).toFixed(1)}`} />;
        })}
        {rings.map((points, i) => (
          <path key={i} d={`M${points.join(" L")} Z`} />
        ))}
        <path d="M-50 -60 H-56 M50 -60 H56 M-35 -95 L-50 -100 M35 -95 L50 -100" />
      </g>
      {[
        [-22, -82],
        [30, -50],
        [-12, -32],
        [40, -88],
      ].map(([x, y], i) => (
        <circle key={i} className="he-netz-dew" cx={x} cy={y} r="3.5" fill="#d0ebff" stroke="#fff" strokeWidth="1" style={nth(i)} />
      ))}
      <path className="he-netz-thread" d="M14 -60 V-44" stroke="#fff" strokeWidth="1.5" style={{ transformOrigin: "14px -60px" }} />
      <g className="he-netz-spider">
        <path d="M14 -46 v-4" stroke={INK} strokeWidth="2" />
        <path d="M6 -42 l-8 -6 M6 -38 l-9 0 M6 -34 l-8 6 M22 -42 l8 -6 M22 -38 l9 0 M22 -34 l8 6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="-38" r="8" fill={INK} />
        <circle cx="11" cy="-40" r="2" fill="#fff" />
        <circle cx="17" cy="-40" r="2" fill="#fff" />
      </g>
    </>
  );
}
