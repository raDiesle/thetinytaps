import { Hideout } from "../hideout";
import { INK, Inside, SKIN, nth } from "../shared";
import { SHELF_BOARD_1, SHELF_BOARD_2, SHELF_TOP } from "./layout";
import { Eyes, Notes, Sparkles, Zzz, star } from "./parts";

// Things on the bookshelf (in the shelf's coordinates, SHELF: its foot at (0, 0)) and the
// doll's house (DOLLHOUSE: its foot at (0, 0)).

/** The good-night book standing face-out; it opens, stars fly out, and it closes again. */
export function Buch() {
  const y = SHELF_BOARD_1;
  return (
    <>
      {/* Pages inside: a sleeping sheep on a hill */}
      <rect x="-126" y={y - 100} width="92" height="98" rx="3" fill="#fffaf0" />
      <path d={`M-120 ${y - 20} Q-80 ${y - 44} -40 ${y - 22} V${y - 6} H-120 Z`} fill="#b2f2bb" />
      <g fill="#fff" stroke="#ced4da" strokeWidth="2">
        <circle cx="-86" cy={y - 38} r="10" />
        <circle cx="-74" cy={y - 40} r="11" />
        <circle cx="-62" cy={y - 36} r="9" />
      </g>
      <circle cx="-98" cy={y - 36} r="7" fill="#495057" />
      <path d={`M-58 ${y - 66} h8 l-8 8 h8`} stroke="#7c83c9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <g className="gn-buch-cover" style={{ transformOrigin: `-128px ${y}px` }}>
        <rect x="-128" y={y - 102} width="96" height="102" rx="4" fill="#3b5bdb" />
        <rect x="-128" y={y - 102} width="12" height="102" rx="3" fill="#364fc7" />
        <path d={`M-74 ${y - 82} a16 16 0 1 0 16 22 a12 12 0 1 1 -16 -22 Z`} fill="#ffe066" />
        <path d={star(-98, y - 74, 7)} fill="#fff3bf" />
        <path d={star(-50, y - 86, 5)} fill="#fff3bf" />
        <rect x="-106" y={y - 34} width="62" height="7" rx="3" fill="#fff" opacity="0.85" />
        <rect x="-100" y={y - 22} width="50" height="5" rx="2.5" fill="#fff" opacity="0.6" />
      </g>
      <Sparkles x={-80} y={y - 70} spread={50} count={4} colour="#ffe066" />
    </>
  );
}

/** A music box with a little bear on top; the crank turns, the bear twirls and notes float up. */
export function Spieluhr() {
  const y = SHELF_BOARD_2;
  return (
    <>
      <g className="gn-spieluhr-bear" style={{ transformOrigin: `-70px ${y - 50}px` }}>
        <ellipse cx="-70" cy={y - 66} rx="11" ry="13" fill="#e6b88a" />
        <circle cx="-79" cy={y - 101} r="5" fill="#e6b88a" />
        <circle cx="-61" cy={y - 101} r="5" fill="#e6b88a" />
        <circle cx="-70" cy={y - 90} r="12" fill="#e6b88a" />
        <ellipse cx="-70" cy={y - 86} rx="5" ry="4" fill="#fff4e6" />
        <circle cx="-70" cy={y - 87} r="1.6" fill={INK} />
        <Eyes cx={-70} cy={y - 93} gap={4.5} r={1.8} />
        <path d={`M-82 ${y - 74} Q-70 ${y - 62} -58 ${y - 74}`} stroke="#ff8fa3" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <rect x="-80" y={y - 54} width="20" height="8" rx="2" fill="#fcc419" />
      <ellipse cx="-70" cy={y - 48} rx="26" ry="5" fill="#fcc419" />
      <rect x="-118" y={y - 46} width="96" height="44" rx="6" fill="#f4a6b8" />
      <rect x="-118" y={y - 46} width="96" height="8" rx="4" fill="#fcc419" />
      <path d={`M-108 ${y - 24} q8 -8 16 0 t16 0 t16 0 t16 0 t16 0`} stroke="#fff" strokeWidth="3" fill="none" opacity="0.7" />
      <g className="gn-spieluhr-crank" style={{ transformOrigin: `-18px ${y - 24}px` }}>
        <path d={`M-22 ${y - 24} H-12 V${y - 38}`} stroke="#adb5bd" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="-12" cy={y - 40} r="4" fill="#fcc419" />
      </g>
      <Notes x={-70} y={y - 112} colour="#9775fa" size={0.9} />
      <Zzz x={-50} y={y - 98} size={0.8} />
    </>
  );
}

const BOWL = { x: 70, y: SHELF_TOP - 50, r: 48 };

/** The goldfish in its bowl; it swims round, blows bubbles and sleeps with its eye shut. */
export function Goldfisch() {
  const { x, y, r } = BOWL;
  const water = `M${x - r} ${y - 22} H${x + r} V${y + r} H${x - r} Z`;
  return (
    <>
      <circle cx={x} cy={y} r={r} fill="#e7f5ff" fillOpacity="0.55" stroke="#a5d8ff" strokeWidth="3" />
      <Inside d={`M${x - r} ${y} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`}>
        <path d={water} fill="#74c0fc" opacity="0.55" />
      </Inside>
      <ellipse cx={x} cy={y + r - 10} rx={r * 0.7} ry="8" fill="#ffd8a8" />
      {[-24, -8, 10, 24].map((dx, i) => (
        <circle key={dx} cx={x + dx} cy={y + r - 12 + (i % 2) * 3} r="4" fill={["#ff8fa3", "#ffe066", "#8ce99a", "#d0bfff"][i]} />
      ))}
      <path className="gn-fisch-plant" style={{ transformOrigin: `${x + 26}px ${y + r - 12}px` }} d={`M${x + 26} ${y + r - 12} q-8 -18 0 -30 q8 -12 0 -24`} stroke="#51cf66" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g className="gn-fisch" style={{ transformOrigin: `${x - 4}px ${y + 6}px` }}>
        <path d={`M${x + 12} ${y + 6} L${x + 28} ${y - 6} Q${x + 24} ${y + 6} ${x + 28} ${y + 18} Z`} fill="#ff922b" />
        <ellipse cx={x - 4} cy={y + 6} rx="18" ry="12" fill="#ffa94d" />
        <path d={`M${x - 2} ${y - 5} q6 -8 12 -2`} fill="#ff922b" />
        <circle className="gn-open" cx={x - 12} cy={y + 3} r="3" fill={INK} />
        <path className="gn-shut" d={`M${x - 15} ${y + 3} q3 3 6 0`} stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d={`M${x - 20} ${y + 9} q2 2 4 0`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </g>
      <g className="gn-fisch-bubbles" fill="none" stroke="#fff" strokeWidth="2">
        {[0, 1, 2].map((i) => (
          <circle key={i} style={nth(i)} cx={x - 24} cy={y - 4 - i * 10} r={3 + i} />
        ))}
      </g>
      <ellipse cx={x} cy={y - r + 4} rx={r * 0.6} ry="6" fill="none" stroke="#a5d8ff" strokeWidth="3" />
      <path d={`M${x - r + 12} ${y - 14} Q${x - r + 10} ${y + 10} ${x - r + 22} ${y + 26}`} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" fill="none" />
      <Zzz x={x + 36} y={y - r - 4} size={0.9} />
    </>
  );
}

const HOUSE_WINDOWS: [number, number][] = [
  [-104, -176],
  [44, -176],
  [-104, -96],
  [44, -96],
];

/** The doll's house: its lit windows go dark one by one, the door opens and a doll waves. */
export function Puppenhaus() {
  return (
    <>
      <rect x="54" y="-284" width="26" height="60" fill="#b5838d" />
      <rect x="50" y="-290" width="34" height="10" rx="3" fill="#9d6b74" />
      <rect x="-140" y="-16" width="280" height="16" rx="4" fill="#c99a70" />
      <rect x="-124" y="-204" width="248" height="190" fill="#f7cad0" />
      <path d="M-124 -60 H124" stroke="#f4acb7" strokeWidth="4" />
      <path d="M-150 -196 L0 -302 L150 -196 Z" fill="#e5989b" />
      <path d="M-150 -196 L0 -302 L150 -196" stroke="#b5838d" strokeWidth="6" strokeLinejoin="round" fill="none" />
      {/* Attic window */}
      <circle cx="0" cy="-238" r="17" fill="#5a4f7d" />
      <circle className="gn-haus-light" style={nth(4)} cx="0" cy="-238" r="17" fill="#ffe066" />
      <path d="M-17 -238 H17 M0 -255 V-221" stroke="#fff" strokeWidth="3" />
      <circle cx="0" cy="-238" r="17" fill="none" stroke="#fff" strokeWidth="4" />
      {HOUSE_WINDOWS.map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="60" height="50" fill="#5a4f7d" />
          <rect className="gn-haus-light" style={nth(i)} x={x} y={y} width="60" height="50" fill="#ffe066" />
          {i === 0 && (
            <Inside d={`M${x} ${y} h60 v50 h-60 Z`}>
              <g className="gn-haus-doll" style={{ transformOrigin: `${x + 30}px ${y + 50}px` }}>
                <rect x={x + 18} y={y + 32} width="24" height="22" rx="8" fill="#74c0fc" />
                <circle cx={x + 30} cy={y + 24} r="12" fill={SKIN} />
                <path d={`M${x + 18} ${y + 22} Q${x + 20} ${y + 8} ${x + 30} ${y + 9} Q${x + 40} ${y + 8} ${x + 42} ${y + 22} Q${x + 30} ${y + 14} ${x + 18} ${y + 22} Z`} fill="#f6bd60" />
                <Eyes cx={x + 30} cy={y + 25} gap={4.5} r={1.8} />
              </g>
            </Inside>
          )}
          <path d={`M${x + 30} ${y} V${y + 50} M${x} ${y + 25} H${x + 60}`} stroke="#fff" strokeWidth="4" />
          <rect x={x} y={y} width="60" height="50" fill="none" stroke="#fff" strokeWidth="5" />
          <rect x={x - 4} y={y + 50} width="68" height="10" rx="3" fill="#90be6d" />
          {[12, 30, 48].map((fx, j) => (
            <circle key={fx} cx={x + fx} cy={y + 49} r="5" fill={["#ff8fa3", "#ffe066", "#ff8fa3"][j]} />
          ))}
        </g>
      ))}
      {/* Door */}
      <rect x="-24" y="-90" width="48" height="76" rx="6" fill="#5a4f7d" />
      <rect className="gn-haus-light" style={nth(2)} x="-24" y="-90" width="48" height="76" rx="6" fill="#ffe066" />
      {/* Who says good night at the door? */}
      <Hideout x={-24} y={-90} w={48} h={76} size={50} />
      <g className="gn-haus-door" style={{ transformOrigin: "-24px -52px" }}>
        <rect x="-24" y="-90" width="48" height="76" rx="6" fill="#b5838d" />
        <circle cx="14" cy="-50" r="4" fill="#fcc419" />
        <path d={star(0, -72, 9)} fill="#fff" opacity="0.7" />
      </g>
      <Zzz x={96} y={-232} size={1.4} />
    </>
  );
}
