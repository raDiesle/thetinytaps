import { useId, type ReactNode } from "react";
import { INK } from "@/games/scenes/shared";

// The things of the stories. Each drawing has its foot point at (0, 0) and is centred on x = 0.
// The same drawing stands in the room and shows in the thought bubble, so the child can match them.

const WOOD = "#c88b3a";
const WOOD_DARK = "#8d5a2b";

/** The tall fridge in the cellar; its door swings open while someone takes something out. */
export function Fridge({ eggs = true, juice = true }: { eggs?: boolean; juice?: boolean }) {
  return (
    <>
      <rect x="-52" y="-8" width="14" height="8" rx="2" fill="#868e96" />
      <rect x="38" y="-8" width="14" height="8" rx="2" fill="#868e96" />
      <rect x="-62" y="-184" width="124" height="178" rx="14" fill="#dff3ee" stroke="#8fbcb2" strokeWidth="4" />
      {/* Inside, seen when the door is open */}
      <rect x="-54" y="-126" width="108" height="112" rx="6" fill="#fff9db" />
      <rect className="el-fridge-light" x="-54" y="-126" width="108" height="112" rx="6" fill="#fff" />
      <path d="M-54 -88 H54 M-54 -50 H54" stroke="#ced4da" strokeWidth="4" />
      <rect x="-46" y="-122" width="18" height="32" rx="5" fill="#fff" stroke="#adb5bd" strokeWidth="2" />
      <rect x="-46" y="-110" width="18" height="10" fill="#4dabf7" />
      {eggs && (
        <g>
          <rect x="-20" y="-100" width="58" height="12" rx="3" fill="#e9b872" />
          {[-10, 8, 26].map((x) => (
            <ellipse key={x} cx={x} cy="-104" rx="8" ry="10" fill="#fff4e6" stroke="#e8c59a" strokeWidth="2" />
          ))}
        </g>
      )}
      {juice && (
        <g>
          <rect x="12" y="-84" width="20" height="34" rx="6" fill="#ff922b" />
          <rect x="16" y="-92" width="12" height="9" rx="3" fill="#2f9e44" />
          <circle cx="22" cy="-66" r="6" fill="#ffd43b" />
        </g>
      )}
      <path d="M-44 -62 L-20 -50 H-44 Z" fill="#ffd43b" stroke="#fab005" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="-30" cy="-26" r="10" fill="#fa5252" />
      <circle cx="-8" cy="-24" r="10" fill="#82c91e" />
      <circle cx="16" cy="-26" r="10" fill="#fa5252" />
      {/* Freezer door */}
      <rect x="-58" y="-180" width="116" height="50" rx="10" fill="#e6fcf5" stroke="#8fbcb2" strokeWidth="3" />
      <rect x="34" y="-170" width="8" height="30" rx="4" fill="#adb5bd" />
      {/* Main door, hinged on the left */}
      <g className="el-fridge-door" style={{ transformOrigin: "-58px 0px" }}>
        <rect x="-58" y="-128" width="116" height="118" rx="10" fill="#e6fcf5" stroke="#8fbcb2" strokeWidth="3" />
        <rect x="34" y="-118" width="8" height="46" rx="4" fill="#adb5bd" />
        <path d="M-46 -120 V-24" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        {/* A child's drawing held by magnets */}
        <rect x="-28" y="-110" width="44" height="36" fill="#fff" stroke="#dee2e6" strokeWidth="2" transform="rotate(-6 -6 -92)" />
        <circle cx="-14" cy="-94" r="8" fill="#ffd43b" />
        <path d="M-2 -82 L10 -98 L18 -84" stroke="#51cf66" strokeWidth="4" fill="none" strokeLinejoin="round" />
        <circle cx="-26" cy="-108" r="5" fill="#f03e3e" />
        <circle cx="12" cy="-112" r="5" fill="#4c6ef5" />
        <circle cx="-30" cy="-52" r="7" fill="#fab005" />
        <circle cx="-12" cy="-46" r="7" fill="#7950f2" />
      </g>
    </>
  );
}

/** The cooker: an oven with a window, knobs, a pan on the left and a pot on the right; `pancake` is one baking in the pan. */
export function Stove({ cooking = null, pancake = false }: { cooking?: "pan" | "pot" | null; pancake?: boolean }) {
  return (
    <>
      <rect x="-74" y="-104" width="148" height="104" rx="8" fill="#f8f9fa" stroke="#adb5bd" strokeWidth="4" />
      <rect x="-74" y="-104" width="148" height="20" rx="6" fill="#dee2e6" />
      {[-48, -20, 20, 48].map((x) => (
        <g key={x}>
          <circle cx={x} cy="-94" r="7" fill="#495057" />
          <path d={`M${x} -99 V-94`} stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
      <rect x="-56" y="-74" width="112" height="56" rx="8" fill="#343a40" />
      <rect className={`el-oven-glow${cooking ? " on" : ""}`} x="-50" y="-68" width="100" height="44" rx="6" fill="#ff922b" />
      <rect x="-50" y="-68" width="100" height="44" rx="6" fill="#fff" opacity="0.12" />
      <rect x="-40" y="-82" width="80" height="6" rx="3" fill="#adb5bd" />
      <rect x="-70" y="-110" width="140" height="8" rx="3" fill="#343a40" />
      {/* Flames under the pan and the pot */}
      {(["pan", "pot"] as const).map((which) => (
        <g key={which} className={`el-flames${cooking === which ? " on" : ""}`} fill="#4dabf7">
          {[-12, 0, 12].map((dx) => (
            <path key={dx} d={`M${(which === "pan" ? -36 : 36) + dx} -110 q-5 -8 0 -16 q5 8 0 16 Z`} />
          ))}
        </g>
      ))}
      {/* Pan with the pancake */}
      <path d="M-64 -118 H-10 Q-12 -110 -20 -110 H-54 Q-62 -110 -64 -118 Z" fill="#495057" />
      <rect x="-104" y="-121" width="44" height="7" rx="3.5" fill={WOOD_DARK} />
      {pancake && (
        <g className="el-pancake">
          <ellipse cx="-37" cy="-121" rx="22" ry="5" fill="#ffe8a3" stroke="#f4b860" strokeWidth="2" />
          {[-46, -34, -26].map((x, i) => (
            <circle key={x} className="el-batter-bubble" cx={x} cy={-122 + (i % 2)} r="2" fill="#f4b860" style={{ animationDelay: `${i * 0.3}s` }} />
          ))}
        </g>
      )}
      {/* Pot with lid */}
      <path d="M8 -160 V-118 Q8 -110 16 -110 H56 Q64 -110 64 -118 V-160 Z" fill="#e03131" />
      <path d="M18 -152 V-120" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.35" />
      <path d="M2 -150 H8 M64 -150 H70" stroke="#343a40" strokeWidth="6" strokeLinecap="round" />
      <g className="el-pot-lid" style={{ transformOrigin: "8px -162px" }}>
        <ellipse cx="36" cy="-162" rx="32" ry="6" fill="#ced4da" />
        <rect x="30" y="-172" width="12" height="7" rx="3" fill="#343a40" />
      </g>
      <Steam x={36} y={-180} className={cooking === "pot" ? "el-steam on" : "el-steam"} />
      <Steam x={-37} y={-136} className={cooking === "pan" ? "el-steam on" : "el-steam"} />
    </>
  );
}

/** Puffs of steam rising from (x, y); hidden until the parent switches them on. */
export function Steam({ x, y, className = "el-steam on" }: { x: number; y: number; className?: string }) {
  return (
    <g className={className} fill="#fff">
      {[-12, 0, 12].map((dx, i) => (
        <circle key={dx} className="el-puff" cx={x + dx} cy={y - (i % 2) * 8} r={8 - (i % 2) * 2} style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
    </g>
  );
}

/** A plate of `count` pancakes: with syrup and butter as on the picture card, or `plain` with `jam` blobs on top. */
export function Pancakes({ count = 3, plain = false, jam = 0 }: { count?: number; plain?: boolean; jam?: number }) {
  const top = -17 - (count - 1) * 9;
  return (
    <>
      <ellipse cx="0" cy="-6" rx="44" ry="9" fill="#fff" stroke="#ced4da" strokeWidth="3" />
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <ellipse cx="0" cy={-14 - i * 9} rx="32" ry="8" fill="#d9902f" />
          <ellipse cx="0" cy={-17 - i * 9} rx="32" ry="7" fill="#f4b860" />
        </g>
      ))}
      {!plain && count === 3 && (
        <>
          <path d="M-20 -36 Q-22 -26 -16 -24 Q-12 -30 -8 -36 Z" fill="#a0522d" opacity="0.85" />
          <ellipse cx="0" cy="-37" rx="20" ry="4.5" fill="#a0522d" opacity="0.85" />
          <rect x="-6" y="-46" width="14" height="8" rx="2" fill="#fff3bf" stroke="#fcc419" strokeWidth="2" />
        </>
      )}
      {count > 0 &&
        [-14, 2, 16].slice(0, jam).map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={top - 1} rx="10" ry="4" fill="#e03131" />
            <circle cx={x - 3} cy={top - 2} r="1.8" fill="#fff" opacity="0.6" />
          </g>
        ))}
    </>
  );
}

/** The plate of pancakes and the jam jar, carried together to the table. */
export function Breakfast() {
  return (
    <>
      <Pancakes plain />
      <g transform="translate(34 -8) scale(0.7)">
        <JamJar />
      </g>
    </>
  );
}

/** A jar of strawberry jam; `open`, its lid lies beside it. */
export function JamJar({ open = false }: { open?: boolean }) {
  return (
    <>
      <rect x="-17" y="-40" width="34" height="40" rx="8" fill="#e03131" stroke="#c92a2a" strokeWidth="2.5" />
      <rect x="-11" y="-30" width="22" height="16" rx="3" fill="#fff" />
      <path d="M-5 -24 Q-6 -18 0 -16 Q6 -18 5 -24 Z" fill="#fa5252" />
      <path d="M-4 -25 L0 -28 L4 -25" stroke="#40c057" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M-11 -36 V-30" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      {open ? (
        <ellipse cx="30" cy="-3" rx="13" ry="4" fill="#fff" stroke="#ff8787" strokeWidth="2.5" />
      ) : (
        <g>
          <rect x="-19" y="-49" width="38" height="11" rx="3" fill="#fff" stroke="#ff8787" strokeWidth="2.5" />
          {[-11, 0, 11].map((x) => (
            <circle key={x} cx={x} cy="-43.5" r="2.5" fill="#ff8787" />
          ))}
        </g>
      )}
    </>
  );
}

/** A basket with eggs and a small bottle of milk. */
export function EggBasket({ eggs = 2, milk = true }: { eggs?: number; milk?: boolean }) {
  return (
    <>
      <path d="M-28 -32 Q-28 -66 0 -66 Q28 -66 28 -32" stroke={WOOD_DARK} strokeWidth="5" fill="none" />
      {milk && (
        <>
          <rect x="10" y="-58" width="16" height="30" rx="5" fill="#fff" stroke="#adb5bd" strokeWidth="2" />
          <rect x="10" y="-48" width="16" height="8" fill="#4dabf7" />
        </>
      )}
      {[-18, -4].slice(0, eggs).map((x) => (
        <ellipse key={x} cx={x} cy="-36" rx="9" ry="11" fill="#fff4e6" stroke="#e8c59a" strokeWidth="2" />
      ))}
      <path d="M-34 -32 H34 L28 -2 Q27 0 24 0 H-24 Q-27 0 -28 -2 Z" fill={WOOD} />
      <path d="M-31 -22 H31 M-29 -12 H29" stroke={WOOD_DARK} strokeWidth="3" />
      <path d="M-18 -32 V0 M0 -32 V0 M18 -32 V0" stroke={WOOD_DARK} strokeWidth="2" opacity="0.6" />
    </>
  );
}

/** A bottle of orange juice. */
export function Juice() {
  return (
    <>
      <path d="M-16 -50 Q-16 -60 -8 -64 V-74 H8 V-64 Q16 -60 16 -50 V-4 Q16 0 12 0 H-12 Q-16 0 -16 -4 Z" fill="#ff922b" stroke="#e8590c" strokeWidth="2.5" />
      <rect x="-10" y="-84" width="20" height="12" rx="3" fill="#2f9e44" />
      <rect x="-16" y="-40" width="32" height="24" fill="#fff" />
      <circle cx="0" cy="-28" r="9" fill="#ffa94d" stroke="#fd7e14" strokeWidth="2" />
      <path d="M0 -37 V-19 M-9 -28 H9 M-6 -34 L6 -22 M6 -34 L-6 -22" stroke="#fff3bf" strokeWidth="1.5" />
      <path d="M-10 -56 V-46" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

/** A blue mug with a heart; full of milk unless `empty`, with a spoon while it is stirred. */
export function Mug({ steam = false, empty = false, spoon = false }: { steam?: boolean; empty?: boolean; spoon?: boolean }) {
  return (
    <>
      <path d="M16 -30 Q32 -30 32 -18 Q32 -6 16 -8" stroke="#4c6ef5" strokeWidth="6" fill="none" />
      {spoon && (
        <g className="el-spoon" style={{ transformOrigin: "-1px -36px" }}>
          <path d="M-1 -36 L10 -64" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      <path d="M-20 -38 H18 V-8 Q18 0 10 0 H-12 Q-20 0 -20 -8 Z" fill="#4c6ef5" />
      <ellipse cx="-1" cy="-38" rx="19" ry="4" fill={empty ? "#364fc7" : "#fff4e6"} />
      <path d="M-1 -14 c-4 -6 -12 -1 -6 5 l6 5 l6 -5 c6 -6 -2 -11 -6 -5 Z" fill="#fff" />
      {steam && <Steam x={-1} y={-48} />}
    </>
  );
}

/** An empty plate with a fork and a knife: "I want to eat". */
export function EmptyPlate() {
  return (
    <>
      <ellipse cx="0" cy="-14" rx="48" ry="14" fill="#fff" stroke="#ced4da" strokeWidth="3" />
      <ellipse cx="0" cy="-15" rx="30" ry="8" fill="#f1f3f5" />
      <path d="M-64 -40 V-6 M-70 -40 V-28 Q-70 -22 -64 -22 Q-58 -22 -58 -28 V-40" stroke="#868e96" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M64 -6 V-42 Q72 -34 70 -20 H64" stroke="#868e96" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="#adb5bd" />
    </>
  );
}

/** How far the stools stand left and right of the table. */
const STOOL_X = 140;
/** Side and seat height of the stools: the hero's, and the lower one for the little brother. */
const STOOLS: [number, number][] = [
  [-1, 50],
  [1, 40],
];

/** A heart around (x, y). */
const heart = (x: number, y: number) => `M${x} ${y - 4} c-4 -6 -12 -1 -6 5 l6 5 l6 -5 c6 -6 -2 -11 -6 -5 Z`;

/** A child's plate with one pancake, with jam once it is spread; every bite takes a piece until only crumbs are left. */
function PlatePancake({ x, jam, bites, eating }: { x: number; jam: boolean; bites: number; eating: boolean }) {
  const id = useId();
  return (
    <g transform={`translate(${x} -86)`}>
      <ellipse cx="0" cy="0" rx="26" ry="7" fill="#fff" stroke="#ced4da" strokeWidth="2.5" />
      <ellipse cx="0" cy="-1" rx="16" ry="4" fill="#f1f3f5" />
      {bites >= 3 ? (
        <g key="crumbs" className="el-crumbs" fill="#d9902f">
          <circle cx="-8" cy="-2" r="2" />
          <circle cx="5" cy="0" r="1.6" />
          <circle cx="10" cy="-3" r="2.2" />
        </g>
      ) : (
        <g>
          <mask id={id}>
            <rect x="-30" y="-20" width="60" height="30" fill="#fff" />
            {bites >= 1 && <circle className="el-bite" cx="-17" cy="-5" r="7" fill="#000" />}
            {bites >= 2 && <circle className="el-bite" cx="15" cy="-6" r="8" fill="#000" />}
          </mask>
          <g mask={`url(#${id})`}>
            <ellipse cx="0" cy="-3" rx="19" ry="6" fill="#d9902f" />
            <ellipse cx="0" cy="-6" rx="19" ry="5.5" fill="#f4b860" />
            {jam && <path className="el-pop-in" d="M-8 -7 Q0 -11 9 -7 Q4 -3 -2 -4 Q-6 -2 -8 -7 Z" fill="#e03131" />}
          </g>
        </g>
      )}
      {eating && [0, 1].map((i) => <path key={i} className="el-yum" d={heart(-6 + i * 14, -22)} fill="#ff6b6b" style={{ animationDelay: `${i * 0.8}s` }} />)}
    </g>
  );
}

/** The round table on the roof terrace with two stools. At the feast the pancakes, the jam and the juice stand on it,
 * and each child has a plate: `jam` is how many plates got jam, `bites` how often the children have bitten. */
export function Table({ feast = false, jam = 0, bites = 0, open = false }: { feast?: boolean; jam?: number; bites?: number; open?: boolean }) {
  const scallops = Array.from({ length: 14 }, (_, i) => {
    const x = 112 - i * 16;
    return `Q${x - 8} -50 ${x - 16} -58`;
  }).join(" ");
  return (
    <>
      {STOOLS.map(([s, h]) => (
        <g key={s} transform={`translate(${s * STOOL_X} 0)`}>
          <path d={`M-22 ${-h + 10} L-28 0 M22 ${-h + 10} L28 0 M-25 ${-h / 2} H25`} stroke={WOOD_DARK} strokeWidth="7" strokeLinecap="round" />
          <rect x="-38" y={-h} width="76" height="14" rx="7" fill="#ff6b6b" />
          <rect x="-32" y={-h + 2} width="64" height="4" rx="2" fill="#ffa8a8" />
        </g>
      ))}
      <path d="M-8 -82 H8 L14 0 H-14 Z" fill={WOOD_DARK} />
      <ellipse cx="0" cy="-2" rx="38" ry="6" fill={WOOD_DARK} />
      <path d={`M-106 -88 H106 L112 -58 ${scallops} Z`} fill="#fff" stroke="#ff8787" strokeWidth="3" />
      {[-78, -52, -26, 0, 26, 52, 78].map((x) => (
        <circle key={x} cx={x} cy="-74" r="6" fill="#ff8787" />
      ))}
      <ellipse cx="0" cy="-88" rx="106" ry="11" fill="#fff" stroke="#ff8787" strokeWidth="3" />
      {feast ? (
        <g>
          <g transform="translate(26 -94) scale(0.55)">
            <Juice />
          </g>
          <g transform="translate(-18 -86) scale(0.6)">
            <Pancakes plain />
          </g>
          <Steam x={-18} y={-124} className={bites < 3 ? "el-steam on" : "el-steam"} />
          <g transform="translate(6 -88) scale(0.5)">
            <JamJar open={open} />
          </g>
          {[-1, 1].map((s) => (
            <path key={s} d={`M${s * 50 - 8} -106 L${s * 50 - 6} -86 H${s * 50 + 6} L${s * 50 + 8} -106 Z`} fill="#ffc078" stroke="#adb5bd" strokeWidth="2" />
          ))}
          <PlatePancake x={-78} jam={jam >= 1} bites={bites} eating={bites > 0 && bites < 3} />
          <PlatePancake x={78} jam={jam >= 2} bites={bites} eating={bites > 0 && bites < 3} />
        </g>
      ) : (
        <path d="M-12 -92 Q0 -120 12 -92 Z" fill="#ffd43b" stroke="#fab005" strokeWidth="2" />
      )}
    </>
  );
}

/** A sleepy crescent moon with stars: "I am tired". */
export function SleepyMoon() {
  return (
    <>
      <path d="M10 -104 A52 52 0 1 0 50 -12 A42 42 0 1 1 10 -104 Z" fill="#ffe066" stroke="#fab005" strokeWidth="3" />
      <path d="M-6 -60 q6 5 12 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="-12" cy="-44" r="5" fill="#ff8fa3" opacity="0.6" />
      <path d="M2 -38 q5 3 10 0" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      {[
        [46, -92, 10],
        [62, -56, 7],
        [30, -110, 6],
      ].map(([x, y, r]) => (
        <path key={x} d={star(x, y, r)} fill="#fff3bf" stroke="#fab005" strokeWidth="1.5" />
      ))}
    </>
  );
}

/** A five-pointed star path around (x, y). */
export function star(x: number, y: number, r: number) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const radius = i % 2 ? r * 0.45 : r;
    return `${(x + radius * Math.cos(angle)).toFixed(1)} ${(y + radius * Math.sin(angle)).toFixed(1)}`;
  });
  return `M${points.join(" L")} Z`;
}

/** The bathtub with foam and a rubber duck; while bathing, the child's head peeks out of the foam. `soap` adds foam, `quack` makes the duck jump. */
export function Tub({ bather, soap = 0, quack = 0 }: { bather?: ReactNode; soap?: number; quack?: number }) {
  return (
    <>
      {[-80, 80].map((x) => (
        <path key={x} d={`M${x - 10} -18 Q${x} 0 ${x + 10} -18 Z`} fill="#fab005" />
      ))}
      {bather}
      <g className="el-foam" fill="#fff" stroke="#d0ebff" strokeWidth="2">
        {[-80, -56, -30, 30, 56, 82].map((x, i) => (
          <circle key={x} cx={x} cy={-88 - (i % 2) * 8} r={14 + (i % 3) * 3} />
        ))}
        {[-66, 70, -8, -42, 44, 14].slice(0, soap * 3).map((x, i) => (
          <circle key={`s${x}`} className="el-pop-in" cx={x} cy={-100 - (i % 3) * 12} r={13 + (i % 2) * 5} />
        ))}
      </g>
      <path d="M-112 -88 H112 Q110 -40 92 -24 Q80 -14 60 -14 H-60 Q-80 -14 -92 -24 Q-110 -40 -112 -88 Z" fill="#f8f9fa" stroke="#a5d8ff" strokeWidth="4" />
      <rect x="-118" y="-94" width="236" height="12" rx="6" fill="#fff" stroke="#a5d8ff" strokeWidth="3" />
      <path d="M-92 -70 Q-86 -40 -64 -30" stroke="#d0ebff" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M106 -94 V-128 Q106 -138 96 -138 H84" stroke="#adb5bd" strokeWidth="7" strokeLinecap="round" fill="none" />
      <g key={quack} className={quack ? "el-jump-once" : undefined}>
        <g className="el-duck" style={{ transformOrigin: "60px -96px" }}>
          <ellipse cx="60" cy="-104" rx="16" ry="10" fill="#ffd43b" />
          <circle cx="70" cy="-118" r="9" fill="#ffd43b" />
          <path d="M78 -118 L88 -115 L78 -112 Z" fill="#ff922b" />
          <circle cx="72" cy="-120" r="2" fill={INK} />
        </g>
      </g>
    </>
  );
}

/** A cup with a toothbrush and a tube of toothpaste. */
export function ToothCup({ brush = true }: { brush?: boolean }) {
  return (
    <>
      {brush && (
        <g transform="rotate(-12 0 -30)">
          <Toothbrush />
        </g>
      )}
      <path d="M-15 -36 H15 L12 -2 Q12 0 9 0 H-9 Q-12 0 -12 -2 Z" fill="#63e6be" stroke="#20c997" strokeWidth="2.5" />
      <path d="M24 0 H48 V-8 L44 -12 H28 L24 -8 Z" fill="#fff" stroke="#ced4da" strokeWidth="2" />
      <rect x="48" y="-7" width="5" height="6" fill="#4dabf7" />
    </>
  );
}

/** A toothbrush standing on its handle end, the bristles at the top. */
export function Toothbrush() {
  return (
    <>
      <rect x="-4" y="-76" width="8" height="66" rx="4" fill="#ff6b6b" />
      <rect x="-6" y="-92" width="12" height="18" rx="3" fill="#fff" stroke="#adb5bd" strokeWidth="2" />
      <path d="M-5 -92 q5 -8 10 0" fill="#74c0fc" />
    </>
  );
}

/** The teddy bear, sitting. */
export function Teddy() {
  const fur = "#b5763a";
  return (
    <>
      <ellipse cx="-18" cy="-8" rx="14" ry="9" fill={fur} />
      <ellipse cx="18" cy="-8" rx="14" ry="9" fill={fur} />
      <ellipse cx="-18" cy="-8" rx="7" ry="5" fill="#f3d2a2" />
      <ellipse cx="18" cy="-8" rx="7" ry="5" fill="#f3d2a2" />
      <ellipse cx="0" cy="-34" rx="26" ry="28" fill={fur} />
      <ellipse cx="0" cy="-30" rx="15" ry="17" fill="#e0a96d" />
      <ellipse cx="-27" cy="-38" rx="9" ry="16" fill={fur} transform="rotate(20 -27 -38)" />
      <ellipse cx="27" cy="-38" rx="9" ry="16" fill={fur} transform="rotate(-20 27 -38)" />
      <circle cx="-20" cy="-88" r="10" fill={fur} />
      <circle cx="20" cy="-88" r="10" fill={fur} />
      <circle cx="-20" cy="-88" r="5" fill="#e0a96d" />
      <circle cx="20" cy="-88" r="5" fill="#e0a96d" />
      <circle cx="0" cy="-72" r="23" fill={fur} />
      <ellipse cx="0" cy="-64" rx="11" ry="8" fill="#f3d2a2" />
      <ellipse cx="0" cy="-68" rx="4.5" ry="3.5" fill={INK} />
      <path d="M-4 -61 Q0 -58 4 -61" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="-8" cy="-78" r="3" fill={INK} />
      <circle cx="8" cy="-78" r="3" fill={INK} />
      <path d="M-12 -52 L0 -48 L-12 -42 Z M12 -52 L0 -48 L12 -42 Z" fill="#e64980" />
      <circle cx="0" cy="-47" r="3.5" fill="#c2255c" />
    </>
  );
}

/** The bed with a star blanket; `sleeper` is drawn on the pillow. */
export function Bed({ sleeper }: { sleeper?: ReactNode }) {
  return (
    <>
      <rect x="-124" y="-126" width="22" height="126" rx="8" fill={WOOD} />
      <path d="M-128 -126 Q-113 -146 -98 -126 Z" fill={WOOD} />
      <rect x="104" y="-74" width="20" height="74" rx="8" fill={WOOD} />
      <rect x="-104" y="-54" width="210" height="30" rx="6" fill={WOOD_DARK} />
      <rect x="-104" y="-70" width="208" height="20" rx="8" fill="#fff" />
      <ellipse cx="-70" cy="-80" rx="32" ry="16" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      {sleeper}
      <path d="M-46 -94 Q20 -102 106 -86 V-56 Q100 -46 90 -48 H-46 Q-52 -70 -46 -94 Z" fill="#748ffc" />
      <path d="M-46 -94 Q-56 -74 -46 -50" stroke="#5c7cfa" strokeWidth="6" fill="none" />
      {[
        [-14, -78],
        [24, -66],
        [56, -82],
        [84, -64],
      ].map(([x, y]) => (
        <path key={x} d={star(x, y, 8)} fill="#ffe066" />
      ))}
      <rect x="-112" y="-24" width="10" height="24" fill={WOOD_DARK} />
      <rect x="100" y="-24" width="10" height="24" fill={WOOD_DARK} />
    </>
  );
}

/** A pair of yellow rubber boots; `left`/`right` false leaves that one out. */
export function Boots({ left = true, right = true }: { left?: boolean; right?: boolean }) {
  return (
    <>
      {[...(left ? [-20] : []), ...(right ? [22] : [])].map((x) => (
        <g key={x}>
          <path
            d={`M${x - 14} -58 H${x + 10} V-16 H${x + 22} Q${x + 30} -14 ${x + 30} -6 V0 H${x - 14} Z`}
            fill="#ffd43b"
            stroke="#f59f00"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x={x - 16} y="-62" width="28" height="8" rx="3" fill="#fab005" />
          <rect x={x - 14} y="-6" width="44" height="6" rx="2" fill="#495057" />
          <path d={`M${x - 8} -50 V-22`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
        </g>
      ))}
    </>
  );
}

/** The yellow rain jacket on a hanger. */
export function Raincoat() {
  return (
    <>
      <path d="M0 -128 q-6 -10 0 -14 q8 -4 8 4" stroke="#868e96" strokeWidth="3" fill="none" />
      <path d="M-34 -110 L0 -126 L34 -110" stroke="#868e96" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M-14 -126 Q0 -140 14 -126 Q14 -112 0 -108 Q-14 -112 -14 -126 Z" fill="#fab005" />
      <path
        d="M-32 -116 L-50 -40 H-34 L-30 -78 L-30 0 H30 L30 -78 L34 -40 H50 L32 -116 Q16 -104 0 -104 Q-16 -104 -32 -116 Z"
        fill="#ffd43b"
        stroke="#f59f00"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M0 -104 V0" stroke="#f59f00" strokeWidth="3" />
      {[-80, -56, -32].map((y) => (
        <circle key={y} cx="7" cy={y} r="4" fill="#e8590c" />
      ))}
      <path d="M-26 -30 H-10 M10 -30 H26" stroke="#f59f00" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

/** The closed umbrella, standing on its tip with the hook at the top. */
export function Umbrella() {
  return (
    <>
      <path d="M0 -120 V-134 Q0 -146 10 -146 Q20 -146 20 -136" stroke={WOOD_DARK} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M0 -122 Q14 -100 10 -24 L0 0 L-10 -24 Q-14 -100 0 -122 Z" fill="#e03131" />
      <path d="M0 -118 Q4 -70 2 -14" stroke="#c92a2a" strokeWidth="3" fill="none" />
      {[-96, -70, -44].map((y, i) => (
        <circle key={y} cx={i % 2 ? 5 : -4} cy={y} r="3.5" fill="#fff" />
      ))}
      <path d="M-6 -108 L0 -116 L6 -108" stroke="#fff" strokeWidth="3" fill="none" />
    </>
  );
}

/** The open umbrella; the hand holds it at (0, 0) and the canopy is above. */
export function OpenUmbrella() {
  return (
    <>
      <path d="M0 0 V-66" stroke={WOOD_DARK} strokeWidth="5" strokeLinecap="round" />
      <path d="M0 0 Q0 10 -8 10" stroke={WOOD_DARK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path
        d="M-70 -60 Q-66 -108 0 -112 Q66 -108 70 -60 Q58 -70 46 -60 Q36 -70 24 -60 Q12 -70 0 -60 Q-12 -70 -24 -60 Q-36 -70 -46 -60 Q-58 -70 -70 -60 Z"
        fill="#e03131"
      />
      <path d="M0 -112 Q-14 -90 -24 -60 M0 -112 Q14 -90 24 -60 M0 -112 V-60" stroke="#c92a2a" strokeWidth="3" fill="none" />
      {[
        [-46, -80],
        [-14, -92],
        [16, -84],
        [46, -78],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="5" fill="#fff" />
      ))}
      <circle cx="0" cy="-114" r="4" fill={WOOD_DARK} />
    </>
  );
}

/** A folded paper boat. */
export function Boat() {
  return (
    <>
      <path d="M-40 -22 H40 L28 0 H-28 Z" fill="#fff" stroke="#74c0fc" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-24 -22 L0 -60 L24 -22 Z" fill="#e7f5ff" stroke="#74c0fc" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-14 -12 H14 M-8 -32 H8" stroke="#a5d8ff" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

/** A puddle on the ground; it splashes while someone jumps in it. */
export function Puddle({ width = 150, boat = false, drift = 3 }: { width?: number; boat?: boolean; drift?: number }) {
  const w = width / 2;
  return (
    <>
      <ellipse cx="0" cy="-6" rx={w} ry="15" fill="#74c0fc" stroke="#4dabf7" strokeWidth="3" />
      <path d={`M${-w * 0.6} -8 H${-w * 0.2} M${w * 0.1} -3 H${w * 0.5}`} stroke="#e7f5ff" strokeWidth="4" strokeLinecap="round" />
      {boat && (
        <g className="el-drift" style={{ transform: `translateX(${w * (drift * 0.3 - 0.35)}px)` }}>
          <g className="el-boat-float" style={{ transformOrigin: "0px -8px" }}>
            <g transform="translate(0 -6) scale(0.7)">
              <Boat />
            </g>
          </g>
        </g>
      )}
      <g className="el-splash" fill="#a5d8ff" stroke="#4dabf7" strokeWidth="2">
        {[-1, 1].map((s) =>
          [0, 1].map((i) => (
            <ellipse
              key={`${s}${i}`}
              cx={s * (20 + i * 22)}
              cy={-26 - i * 12}
              rx="7"
              ry="10"
              transform={`rotate(${s * 30} ${s * (20 + i * 22)} ${-26 - i * 12})`}
            />
          )),
        )}
      </g>
    </>
  );
}

/** A tower of wooden blocks; it wobbles while the brother cheers. */
export function Blocks() {
  const blocks: [number, number, string][] = [
    [-30, 0, "#ff6b6b"],
    [6, 0, "#4dabf7"],
    [-12, -32, "#ffd43b"],
    [-12, -64, "#51cf66"],
  ];
  return (
    <g className="el-tower" style={{ transformOrigin: "-12px 0px" }}>
      {blocks.map(([x, y, colour]) => (
        <g key={`${x}${y}`}>
          <rect x={x} y={y - 32} width="32" height="32" rx="4" fill={colour} stroke="#00000026" strokeWidth="3" />
          <circle cx={x + 16} cy={y - 16} r="7" fill="#fff" opacity="0.5" />
        </g>
      ))}
      <path d="M-12 -96 L4 -122 L20 -96 Z" fill="#cc5de8" stroke="#00000026" strokeWidth="3" strokeLinejoin="round" />
    </g>
  );
}

/** The white chef's hat. */
export function ChefHat() {
  return (
    <>
      <path d="M-24 -20 Q-44 -34 -28 -52 Q-24 -72 -4 -66 Q12 -80 26 -60 Q46 -50 26 -20 Z" fill="#fff" stroke="#ced4da" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-10 -24 Q-12 -40 -6 -50 M10 -24 Q12 -40 6 -52" stroke="#e9ecef" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="-26" y="-24" width="52" height="24" rx="5" fill="#fff" stroke="#ced4da" strokeWidth="3" />
    </>
  );
}

/** The yellow rain hat with its wide brim. */
export function RainHat() {
  return (
    <>
      <path d="M-30 -12 Q-30 -48 0 -48 Q30 -48 30 -12 Z" fill="#ffd43b" stroke="#f59f00" strokeWidth="3" />
      <path d="M-14 -40 Q-20 -30 -18 -18" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      <path d="M-52 -4 Q0 -24 52 -4 Q58 4 44 6 Q0 -6 -44 6 Q-58 4 -52 -4 Z" fill="#fab005" stroke="#f59f00" strokeWidth="3" strokeLinejoin="round" />
    </>
  );
}

/** The bowl's front, from the near half of its rim down to its foot; its opening is an ellipse, as seen a little from above. */
const BOWL = "M-56 -56 A56 14 0 0 0 56 -56 Q54 -8 24 -3 H-24 Q-54 -8 -56 -56 Z";

/** The mixing bowl, seen a little from above, so the child sees what goes in, tap by tap: `eggs` (yolks), `milk`,
 * `flour` (a white heap); `mixed` stirs it all into yellow batter, and every pancake `poured` lowers it. `children`
 * (the mixer) dip into it. The bowl itself is solid: what is in it shows in its opening, never through its side. */
export function Bowl({
  eggs = 0,
  milk = false,
  flour = 0,
  mixed = 0,
  poured = 0,
  children,
}: {
  eggs?: number;
  milk?: boolean;
  flour?: number;
  mixed?: number;
  poured?: number;
  children?: ReactNode;
}) {
  const clip = useId();
  /** The top of what is in the bowl: yolks lie on the bottom or on the milk; the batter sinks with every pancake. */
  const yolkY = milk ? -57 : -51;
  const batterTop = -55 + poured * 4;
  return (
    <>
      <clipPath id={clip}>
        <ellipse cx="0" cy="-56" rx="54" ry="12" />
      </clipPath>
      {/* The inside, lighter than the outside, with the bottom further down */}
      <ellipse cx="0" cy="-56" rx="56" ry="14" fill="#d0bfff" stroke="#495057" strokeWidth="4" />
      <ellipse cx="0" cy="-50" rx="32" ry="6" fill="#b197fc" />
      <g clipPath={`url(#${clip})`}>
        {mixed > 0 ? (
          poured < 3 && (
            <g className="el-blend">
              <ellipse cx="0" cy={batterTop} rx="56" ry="13" fill="#ffd43b" />
              <path d={`M-20 ${batterTop} Q0 ${batterTop + 5} 20 ${batterTop}`} stroke="#fab005" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )
        ) : (
          <>
            {milk && <ellipse cx="0" cy="-55" rx="56" ry="12" fill="#fff" />}
            {[-16, 14].slice(0, eggs).map((x) => (
              <g key={x}>
                <ellipse cx={x} cy={yolkY} rx="13" ry="5" fill="#fff" stroke="#e9ecef" strokeWidth="2" />
                <circle cx={x} cy={yolkY - 1} r="7" fill="#fab005" />
              </g>
            ))}
          </>
        )}
      </g>
      {flour > 0 && !mixed && <path d={`M-32 ${yolkY + 2} Q-6 ${yolkY - 30} 32 ${yolkY + 2} Z`} fill="#fff" stroke="#adb5bd" strokeWidth="2.5" />}
      {children}
      {/* The solid front, purple so it stands out from the yellow wall, the green tiles and the blue worktop */}
      <path d={BOWL} fill="#9775fa" stroke="#495057" strokeWidth="4" strokeLinejoin="round" />
      <path d="M-44 -40 Q-42 -20 -26 -12" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.6" />
      <rect x="-22" y="-4" width="44" height="6" rx="3" fill="#495057" />
    </>
  );
}

/** A red hand mixer standing on its heel; its beaters whirl while `spinning`. */
export function Mixer({ spinning = false }: { spinning?: boolean }) {
  return (
    <>
      <g className={spinning ? "el-beaters on" : "el-beaters"}>
        {[-9, 9].map((x) => (
          <path key={x} d={`M${x} -34 V-16 Q${x - 7} -8 ${x} 0 Q${x + 7} -8 ${x} -16`} stroke="#adb5bd" strokeWidth="3" strokeLinejoin="round" fill="none" />
        ))}
      </g>
      <path d="M-24 -34 H24 Q34 -34 34 -46 V-52 Q34 -62 22 -62 H-22 Q-30 -62 -30 -52 V-44 Q-30 -34 -24 -34 Z" fill="#ff6b6b" />
      <path d="M-18 -62 Q-16 -86 4 -86 H20 Q30 -86 28 -62" stroke="#fa5252" strokeWidth="9" strokeLinecap="round" fill="none" />
      <circle cx="-14" cy="-48" r="5" fill="#fff" />
      <rect x="0" y="-52" width="22" height="7" rx="3.5" fill="#ffc9c9" />
    </>
  );
}

/** A paper bag of flour with a red band and an ear of wheat on it; the dark outline keeps it apart from white tiles. */
export function FlourBag() {
  return (
    <>
      <path d="M-26 0 Q-32 -30 -24 -58 L-16 -66 H16 L24 -58 Q32 -30 26 0 Z" fill="#fff" stroke="#495057" strokeWidth="3" strokeLinejoin="round" />
      <path d="M-28 -44 H28 Q30 -30 28 -14 H-28 Q-30 -30 -28 -44 Z" fill="#e03131" />
      <path d="M-16 -66 L-10 -76 H10 L16 -66" fill="#f1f3f5" stroke="#495057" strokeWidth="3" strokeLinejoin="round" />
      <path d="M0 -18 V-50" stroke="#ffd43b" strokeWidth="3" strokeLinecap="round" />
      {[-46, -38, -30, -22].map((y) => (
        <g key={y} fill="#ffd43b">
          <ellipse cx="-5" cy={y} rx="3.5" ry="6" transform={`rotate(-30 -5 ${y})`} />
          <ellipse cx="5" cy={y} rx="3.5" ry="6" transform={`rotate(30 5 ${y})`} />
        </g>
      ))}
    </>
  );
}

/** Pyjamas folded up: the trousers and the top with a star. */
export function Pyjama() {
  return (
    <>
      <rect x="-36" y="-16" width="72" height="16" rx="5" fill="#a5d8ff" />
      <path d="M-36 -8 H36" stroke="#74c0fc" strokeWidth="4" />
      <path
        d="M-32 -16 Q-36 -40 -20 -44 L-8 -38 Q0 -33 8 -38 L20 -44 Q36 -40 32 -16 Z"
        fill="#a5d8ff"
        stroke="#74c0fc"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M-30 -24 H30 M-31 -32 H31" stroke="#74c0fc" strokeWidth="4" />
      <path d={star(0, -28, 8)} fill="#ffe066" stroke="#fab005" strokeWidth="1.5" />
    </>
  );
}

/** The toilet, seen from the front; while `flushing` the water swirls. */
export function Toilet({ flushing = false }: { flushing?: boolean }) {
  return (
    <>
      <rect x="-24" y="-118" width="48" height="52" rx="7" fill="#fff" stroke="#ced4da" strokeWidth="3" />
      <rect className={flushing ? "el-flush on" : "el-flush"} x="-9" y="-126" width="18" height="9" rx="3" fill="#74c0fc" />
      <path d="M-36 -58 H36 Q34 -28 14 -20 L12 0 H-12 L-14 -20 Q-34 -28 -36 -58 Z" fill="#fff" stroke="#ced4da" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="0" cy="-60" rx="40" ry="8" fill="#ffd8a8" stroke="#e9b872" strokeWidth="3" />
      {flushing && (
        <g className="el-whirl" style={{ transformOrigin: "0px -60px" }}>
          <ellipse cx="0" cy="-60" rx="24" ry="4" fill="#a5d8ff" />
          <path d="M-14 -61 Q0 -66 14 -60" stroke="#fff" strokeWidth="2.5" fill="none" />
        </g>
      )}
    </>
  );
}

/** A sheet of paper folded into a boat, tap by tap: flat, folded in half, a hat, then the boat. */
export function PaperFold({ stage }: { stage: number }) {
  if (stage >= 3) return <Boat />;
  if (stage === 2) return <path d="M-30 0 L0 -44 L30 0 Z" fill="#fff" stroke="#74c0fc" strokeWidth="3" strokeLinejoin="round" />;
  if (stage === 1) return <rect x="-30" y="-24" width="60" height="24" rx="2" fill="#fff" stroke="#74c0fc" strokeWidth="3" />;
  return (
    <>
      <rect x="-30" y="-44" width="60" height="44" rx="2" fill="#fff" stroke="#74c0fc" strokeWidth="3" />
      <path d="M-20 -32 H20 M-20 -22 H20 M-20 -12 H12" stroke="#d0ebff" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

/** A wooden toy block with a dot, standing on its foot point. */
export function Block({ colour }: { colour: string }) {
  return (
    <>
      <rect x="-16" y="-32" width="32" height="32" rx="4" fill={colour} stroke="#00000026" strokeWidth="3" />
      <circle cx="0" cy="-16" r="7" fill="#fff" opacity="0.5" />
    </>
  );
}
