import type { ReactNode } from "react";
import { GLASS, INK, Inside, Rider, SKIN, nth } from "../shared";
import { BlueLight, DARK_RED, FIRE_RED, HelmetHead, Jacket, NAVY, STRIPE, Toot } from "./parts";

// The fire station: tower, building, its bays, the alarm bell and the flag. The building
// and its bays share one placement; each drawing has its foot point at (0, 0).
// Building: x -695..695, ground floor up to y -300, upper floor up to -500.

const WALL = "#fbf3e4";
const WALL_SHADE = "#efe2cc";
const BRICK = "#c8553d";

/** Bays on the ground floor: left edge and width. */
const BAY_A = [-650, 340] as const;
const BAY_B = [-270, 340] as const;
const BAY_C = [110, 220] as const;
const BAY_TOP = -270;

/** The hose tower: brick, with hoses hanging to dry in the slot at the top. */
export function Turm() {
  return (
    <>
      <rect x="-90" y="-640" width="180" height="640" fill={BRICK} />
      <rect x="62" y="-640" width="28" height="640" fill="#b5482f" />
      <path
        d={Array.from({ length: 15 }, (_, i) => `M-90 ${-40 - i * 40} H90 M${i % 2 ? -30 : 20} ${-40 - i * 40} v40`).join(" ")}
        stroke="#b5482f"
        strokeWidth="3"
      />
      <rect x="-100" y="-680" width="200" height="44" rx="4" fill="#8c3b2a" />
      <path d="M-104 -680 h24 v-16 h24 v16 h24 v-16 h24 v16 h24 v-16 h24 v16 h24 v-16 h16 v16" fill="#8c3b2a" />
      {/* The slot with the hoses hanging to dry */}
      <rect x="-48" y="-610" width="96" height="150" rx="6" fill="#343a40" />
      <path d="M-48 -606 H48" stroke="#6c757d" strokeWidth="6" />
      {["#f8f9fa", "#e9c46a", FIRE_RED, "#f8f9fa"].map((colour, i) => (
        <path
          key={i}
          className="fw-turm-hose"
          d={`M${-30 + i * 20} -604 V${-490 + (i % 2) * 18}`}
          stroke={colour}
          strokeWidth="10"
          strokeLinecap="round"
          style={{ ...nth(i), transformOrigin: `${-30 + i * 20}px -604px` }}
        />
      ))}
      {/* Windows: the lights go on one after the other */}
      {[-400, -300].map((y, i) => (
        <g key={y}>
          <rect x="-26" y={y} width="52" height="62" rx="26" fill={GLASS} stroke="#fff" strokeWidth="5" />
          <rect className="fw-turm-light" x="-21" y={y + 5} width="42" height="52" rx="21" fill="#ffe066" style={nth(i)} />
        </g>
      ))}
      {/* A small door: it opens and a firefighter peeks out */}
      <rect x="-44" y="-170" width="88" height="170" rx="6" fill="#343a40" />
      <g className="fw-turm-peek">
        <HelmetHead cx={-6} cy={-104} r={20} helmet={FIRE_RED} />
        <rect x="-26" y="-82" width="40" height="40" rx="12" fill={NAVY} />
      </g>
      <g className="fw-turm-door" style={{ transformOrigin: "-44px -85px" }}>
        <rect x="-44" y="-170" width="88" height="170" rx="6" fill={FIRE_RED} />
        <rect x="-30" y="-152" width="60" height="50" rx="6" fill={GLASS} />
        <rect x="-30" y="-84" width="60" height="64" rx="4" fill="none" stroke={DARK_RED} strokeWidth="5" />
        <circle cx="30" cy="-86" r="6" fill={STRIPE} />
      </g>
    </>
  );
}

/** The round siren on top of the tower; the drawing goes on above the tower's top (-680). */
export function Sirene() {
  return (
    <>
      <g className="fw-sirene-waves" fill="none" stroke={STRIPE} strokeWidth="8" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <g key={i} style={nth(i)}>
            <path d={`M${-92 - i * 30} ${-770 - i * 14} q${-20 - i * 8} ${22 + i * 14} 0 ${44 + i * 28}`} />
            <path d={`M${92 + i * 30} ${-770 - i * 14} q${20 + i * 8} ${22 + i * 14} 0 ${44 + i * 28}`} />
          </g>
        ))}
      </g>
      <rect x="-8" y="-730" width="16" height="50" fill="#6c757d" />
      <g className="fw-sirene-head" style={{ transformOrigin: "0px -730px" }}>
        <rect x="-62" y="-790" width="124" height="60" rx="14" fill="#adb5bd" />
        <g className="fw-sirene-slats">
          {[-46, -26, -6, 14, 34].map((x) => (
            <rect key={x} x={x} y="-782" width="12" height="44" rx="4" fill="#6c757d" />
          ))}
        </g>
        <path d="M-70 -790 Q-70 -830 0 -834 Q70 -830 70 -790 Z" fill="#ced4da" />
        <path d="M-40 -812 Q0 -828 40 -812" stroke="#fff" strokeOpacity="0.6" strokeWidth="6" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="-842" r="10" fill={DARK_RED} />
        <circle className="fw-sirene-lamp" cx="0" cy="-842" r="10" fill="#ff8fa3" />
      </g>
    </>
  );
}

/** One upper-floor window: the sashes open; `children` sit inside and only show through the glass. */
function Window({ x, i, children }: { x: number; i: number; children?: ReactNode }) {
  const y = -470;
  return (
    <>
      <rect x={x - 6} y={y - 6} width="122" height="112" rx="8" fill="#fff" />
      <rect x={x} y={y} width="110" height="100" rx="4" fill="#495057" />
      <rect className="fw-wache-light" x={x} y={y} width="110" height="100" rx="4" fill="#ffe066" style={nth(i)} />
      {children && <Inside d={`M${x} ${y} h110 v100 h-110 Z`}>{children}</Inside>}
      <g className="fw-wache-sash" style={{ ...nth(i), transformOrigin: `${x}px ${y + 50}px` }}>
        <rect x={x} y={y} width="55" height="100" fill={GLASS} stroke="#fff" strokeWidth="5" />
        <path d={`M${x + 14} ${y + 8} h10 L${x + 10} ${y + 92} h-10 Z`} fill="#fff" opacity="0.5" />
      </g>
      <g className="fw-wache-sash" style={{ ...nth(i), transformOrigin: `${x + 110}px ${y + 50}px` }}>
        <rect x={x + 55} y={y} width="55" height="100" fill={GLASS} stroke="#fff" strokeWidth="5" />
        <path d={`M${x + 70} ${y + 8} h10 L${x + 66} ${y + 92} h-10 Z`} fill="#fff" opacity="0.5" />
      </g>
      <rect x={x - 10} y={y + 100} width="130" height="12" rx="4" fill={WALL_SHADE} />
    </>
  );
}

/** The station building: upper floor with windows, the sign, the clock and the side door. */
export function Wache() {
  return (
    <>
      <rect x="-695" y="-500" width="1390" height="500" fill={WALL} />
      <rect x="655" y="-500" width="40" height="500" fill={WALL_SHADE} />
      <rect x="-695" y="-26" width="1390" height="26" fill="#d9cbb5" />
      {/* Red band between the floors and the roof edge */}
      <rect x="-695" y="-316" width="1390" height="26" fill={FIRE_RED} />
      <rect x="-705" y="-530" width="1410" height="34" rx="6" fill={FIRE_RED} />
      <rect x="-705" y="-504" width="1410" height="8" fill={DARK_RED} />
      <g className="fw-wache-beacon" style={nth(0)}>
        <BlueLight x={-560} y={-540} w={40} name="roof" />
      </g>
      <g className="fw-wache-beacon" style={nth(1)}>
        <BlueLight x={470} y={-540} w={40} name="roof" />
      </g>

      {/* Windows: a firefighter peeks out, a light goes on, someone waves */}
      <Window x={-650} i={0}>
        <g className="fw-wache-peek" style={nth(0)}>
          <HelmetHead cx={-595} cy={-410} r={24} helmet={FIRE_RED} />
          <rect x="-625" y="-384" width="60" height="40" rx="14" fill={NAVY} />
        </g>
      </Window>
      <Window x={-480} i={1}>
        <path className="fw-wache-curtain" d="M-480 -470 H-430 Q-440 -420 -470 -370 H-480 Z" fill="#ffadad" style={{ transformOrigin: "-480px -470px" }} />
      </Window>
      <Window x={210} i={2}>
        <g className="fw-wache-peek" style={nth(1)}>
          <HelmetHead cx={265} cy={-410} r={24} helmet={STRIPE} hair="#6b4423" />
          <rect x="235" y="-384" width="60" height="40" rx="14" fill={NAVY} />
          <g className="fw-wache-arm" style={{ transformOrigin: "292px -380px" }}>
            <path d="M292 -380 L312 -414" stroke={NAVY} strokeWidth="12" strokeLinecap="round" />
            <circle cx="314" cy="-418" r="8" fill={SKIN} />
          </g>
        </g>
      </Window>
      <Window x={380} i={3}>
        <g className="fw-wache-plant" style={{ transformOrigin: "435px -376px" }}>
          <path d="M435 -380 q-16 -26 -6 -44 M435 -380 q14 -22 6 -40 M435 -380 v-36" stroke="#40916c" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="429" cy="-424" r="8" fill="#ff5d73" />
          <circle cx="441" cy="-420" r="7" fill="#ffd60a" />
        </g>
        <path d="M420 -384 h30 l-4 16 h-22 Z" fill="#bc6c25" />
      </Window>

      {/* The sign */}
      <rect x="-320" y="-478" width="460" height="104" rx="14" fill="#fff" stroke={FIRE_RED} strokeWidth="8" />
      <text x="-90" y="-426" fill={FIRE_RED} fontSize="62" fontWeight="900" textAnchor="middle" dominantBaseline="central" letterSpacing="3">
        FEUERWEHR
      </text>
      <g className="fw-wache-sign-shine">
        <path d="M-300 -470 h40 l-50 88 h-40 Z" fill="#fff" opacity="0.6" />
      </g>

      {/* The clock: the hands go round once */}
      <circle cx="600" cy="-420" r="48" fill="#fff" stroke={INK} strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={600 + 38 * Math.sin((i * Math.PI) / 6)} cy={-420 - 38 * Math.cos((i * Math.PI) / 6)} r="3" fill={INK} />
      ))}
      <path className="fw-wache-hour" d="M600 -420 V-446" stroke={INK} strokeWidth="7" strokeLinecap="round" style={{ transformOrigin: "600px -420px" }} />
      <path className="fw-wache-minute" d="M600 -420 H630" stroke={FIRE_RED} strokeWidth="5" strokeLinecap="round" style={{ transformOrigin: "600px -420px" }} />
      <circle cx="600" cy="-420" r="6" fill={INK} />

      {/* The side door: it opens and a firefighter says hello */}
      <rect x="560" y="-226" width="112" height="226" rx="6" fill="#343a40" />
      <g className="fw-wache-guest">
        <HelmetHead cx={612} cy={-150} r={24} helmet="#f8f9fa" />
        <Jacket x={584} y={-124} w={56} h={124} />
      </g>
      <g className="fw-wache-door" style={{ transformOrigin: "560px -113px" }}>
        <rect x="560" y="-226" width="112" height="226" rx="6" fill={FIRE_RED} />
        <rect x="576" y="-206" width="80" height="80" rx="6" fill={GLASS} />
        <path d="M590 -200 h12 l-14 68 h-12 Z" fill="#fff" opacity="0.5" />
        <rect x="576" y="-104" width="80" height="80" rx="4" fill="none" stroke={DARK_RED} strokeWidth="5" />
        <circle cx="654" cy="-110" r="7" fill={STRIPE} />
      </g>
      <path d="M552 -234 h128" stroke={DARK_RED} strokeWidth="10" strokeLinecap="round" />
    </>
  );
}

const SMALL_CAB = "M-590 -196 H-370 Q-362 -196 -362 -186 V-124 H-598 V-186 Q-598 -196 -590 -196 Z";

/** Bay 1: the gate rolls up and the little fire engine inside blinks and waves. */
export function Tor() {
  const [x, w] = BAY_A;
  return (
    <>
      <rect x={x} y={BAY_TOP} width={w} height={-BAY_TOP} fill="#343a40" />
      <rect x={x} y={BAY_TOP} width={w} height="40" fill="#212529" />
      {/* The little fire engine, seen from the front */}
      <g className="fw-tor-engine" style={{ transformOrigin: "-480px 0px" }}>
        <BlueLight x={-530} y={-208} w={34} name="tor" />
        <BlueLight x={-430} y={-208} w={34} name="tor" />
        <rect x="-610" y="-204" width="260" height="190" rx="22" fill={FIRE_RED} />
        <path d={SMALL_CAB} fill={GLASS} />
        <Inside d={SMALL_CAB}>
          <g className="fw-tor-driver">
            <Rider cx={-520} cy={-148} shirt={NAVY} cap={STRIPE} />
          </g>
          <g className="fw-tor-mate" style={{ transformOrigin: "-436px -130px" }}>
            <Rider cx={-436} cy={-148} shirt={NAVY} cap={FIRE_RED} />
          </g>
        </Inside>
        <path d="M-560 -190 h14 l-24 62 h-14 Z M-420 -190 h10 l-24 62 h-10 Z" fill="#fff" opacity="0.5" />
        <rect x="-610" y="-112" width="260" height="14" fill="#fff" />
        <rect x="-540" y="-88" width="120" height="44" rx="6" fill={DARK_RED} />
        <path d="M-530 -78 H-430 M-530 -66 H-430 M-530 -54 H-430" stroke="#9d0208" strokeWidth="4" />
        <circle cx="-578" cy="-66" r="18" fill="#fff4d6" />
        <circle cx="-382" cy="-66" r="18" fill="#fff4d6" />
        <circle className="fw-tor-lamp" cx="-578" cy="-66" r="26" fill="#fff3b0" />
        <circle className="fw-tor-lamp" cx="-382" cy="-66" r="26" fill="#fff3b0" />
        <rect x="-620" y="-34" width="280" height="22" rx="8" fill="#adb5bd" />
        <rect x="-500" y="-32" width="40" height="18" rx="3" fill="#fff" />
        <text x="-480" y="-23" fill={INK} fontSize="14" fontWeight="800" textAnchor="middle" dominantBaseline="central">
          112
        </text>
        <rect x="-600" y="-14" width="40" height="14" rx="4" fill="#2b2d42" />
        <rect x="-400" y="-14" width="40" height="14" rx="4" fill="#2b2d42" />
      </g>
      {/* The gate rolls up and comes down again */}
      <g className="fw-tor-gate" style={{ transformOrigin: `${x + w / 2}px ${BAY_TOP}px` }}>
        <rect x={x} y={BAY_TOP} width={w} height={-BAY_TOP} fill={FIRE_RED} />
        <path d={Array.from({ length: 12 }, (_, i) => `M${x} ${BAY_TOP + 22 + i * 22} h${w}`).join(" ")} stroke={DARK_RED} strokeWidth="5" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={x + 22 + i * 78} y={BAY_TOP + 52} width="60" height="34" rx="5" fill={GLASS} />
        ))}
        <rect x={x + w / 2 - 30} y="-30" width="60" height="12" rx="5" fill="#adb5bd" />
      </g>
      <path d={`M${x - 8} 0 V${BAY_TOP - 8} H${x + w + 8} V0`} stroke={DARK_RED} strokeWidth="16" fill="none" />
      <circle cx={x + w / 2} cy={BAY_TOP - 30} r="18" fill={FIRE_RED} />
      <text x={x + w / 2} y={BAY_TOP - 30} fill="#fff" fontSize="22" fontWeight="900" textAnchor="middle" dominantBaseline="central">
        1
      </text>
    </>
  );
}

/** Bay 2 is open (its truck stands outside): jackets and helmets hang ready. */
export function Helme() {
  const [x, w] = BAY_B;
  const hooks = [-210, -100, 10];
  const helmets = [FIRE_RED, STRIPE, "#f8f9fa"];
  return (
    <>
      <rect x={x} y={BAY_TOP} width={w} height={-BAY_TOP} fill="#6c757d" />
      <rect x={x} y="-60" width={w} height="60" fill="#868e96" />
      <path d={`M${x} -60 L${x + 40} -90 H${x + w - 40} L${x + w} -60`} fill="#7b838b" />
      <rect className="fw-helme-glow" x={x} y={BAY_TOP} width={w} height={-BAY_TOP} fill="#fff3b0" />
      <rect x={x + w / 2 - 50} y={BAY_TOP} width="100" height="10" rx="4" fill="#dee2e6" />
      <rect x={x + 10} y="-206" width={w - 20} height="8" rx="3" fill="#adb5bd" />
      {hooks.map((hx, i) => (
        <g key={hx}>
          <g className="fw-helme-jacket" style={{ ...nth(i), transformOrigin: `${hx}px -200px` }}>
            <path d={`M${hx} -202 v12`} stroke="#495057" strokeWidth="5" />
            <path d={`M${hx - 34} -186 Q${hx} -200 ${hx + 34} -186 L${hx + 40} -96 H${hx - 40} Z`} fill={NAVY} />
            <rect x={hx - 40} y="-136" width="80" height="10" fill={STRIPE} />
            <rect x={hx - 40} y="-118" width="80" height="6" fill="#dee2e6" />
            <path d={`M${hx} -192 V-96`} stroke="#000" strokeOpacity="0.2" strokeWidth="3" />
          </g>
          <g className="fw-helme-helmet" style={nth(i)}>
            <path d={`M${hx - 28} -214 Q${hx - 28} -250 ${hx} -250 Q${hx + 28} -250 ${hx + 28} -214 Z`} fill={helmets[i]} />
            <rect x={hx - 32} y="-218" width="64" height="8" rx="3" fill={helmets[i]} />
            <path d={`M${hx - 22} -228 Q${hx} -236 ${hx + 22} -228`} stroke="#dee2e6" strokeWidth="4" fill="none" />
            <path d={`M${hx - 14} -244 q8 -4 14 -2`} stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          <g className="fw-helme-sparkle" style={nth(i)}>
            <path d={`M${hx + 26} -262 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 Z`} fill="#fff" />
          </g>
        </g>
      ))}
      {/* A bench with two pairs of boots under the jackets */}
      <rect x={x + 20} y="-52" width={w - 40} height="12" rx="4" fill="#bc6c25" />
      {[-230, -190, 20, 60].map((bx, i) => (
        <g key={bx} className="fw-helme-boot" style={nth(i)}>
          <path d={`M${bx} -40 h26 v30 h12 v10 h-38 Z`} fill="#2b2d42" />
          <rect x={bx} y="-34" width="26" height="6" fill={STRIPE} />
        </g>
      ))}
      <path d={`M${x - 8} 0 V${BAY_TOP - 8} H${x + w + 8} V0`} stroke={DARK_RED} strokeWidth="16" fill="none" />
      <circle cx={x + w / 2} cy={BAY_TOP - 30} r="18" fill={FIRE_RED} />
      <text x={x + w / 2} y={BAY_TOP - 30} fill="#fff" fontSize="22" fontWeight="900" textAnchor="middle" dominantBaseline="central">
        2
      </text>
    </>
  );
}

const POLE_BAY = `M${BAY_C[0]} ${BAY_TOP} h${BAY_C[1]} v${-BAY_TOP} h${-BAY_C[1]} Z`;

/** Bay 3: a firefighter climbs up through the ceiling and slides down the pole. */
export function Rutschstange() {
  const [x, w] = BAY_C;
  return (
    <>
      <rect x={x} y={BAY_TOP} width={w} height={-BAY_TOP} fill="#495057" />
      <rect x={x} y="-50" width={w} height="50" fill="#6c757d" />
      <ellipse cx="220" cy={BAY_TOP + 6} rx="56" ry="14" fill="#212529" />
      {/* A soft mat at the bottom of the pole */}
      <ellipse cx="220" cy="-14" rx="70" ry="14" fill="#e63946" opacity="0.85" />
      <rect className="fw-pole-pole" x="214" y={BAY_TOP} width="12" height={-BAY_TOP - 14} rx="5" fill="#ced4da" />
      <path d={`M216 ${BAY_TOP} V-20`} stroke="#fff" strokeWidth="3" opacity="0.7" />
      <Inside d={POLE_BAY}>
        <g className="fw-pole-man">
          <g className="fw-pole-legs">
            <rect x="172" y="-70" width="16" height="60" rx="6" fill={NAVY} />
            <rect x="192" y="-70" width="16" height="60" rx="6" fill={NAVY} />
            <rect x="168" y="-16" width="24" height="12" rx="5" fill="#2b2d42" />
            <rect x="190" y="-16" width="24" height="12" rx="5" fill="#2b2d42" />
          </g>
          <Jacket x={164} y={-136} w={52} h={72} />
          <path d="M212 -126 L222 -150" stroke={NAVY} strokeWidth="12" strokeLinecap="round" />
          <circle cx="222" cy="-152" r="8" fill={SKIN} />
          <HelmetHead cx={190} cy={-160} r={22} helmet={FIRE_RED} />
          <g className="fw-pole-wave" style={{ transformOrigin: "168px -126px" }}>
            <path d="M168 -126 L148 -150" stroke={NAVY} strokeWidth="12" strokeLinecap="round" />
            <circle cx="146" cy="-154" r="8" fill={SKIN} />
          </g>
        </g>
      </Inside>
      <path d={`M${x + 30} ${BAY_TOP + 8} h20 l-40 ${-BAY_TOP - 16} h-20 Z`} fill="#fff" opacity="0.18" />
      <circle className="fw-pole-lamp" cx={x + w - 28} cy={BAY_TOP + 26} r="12" fill="#ff5d73" />
      <path d={`M${x - 8} 0 V${BAY_TOP - 8} H${x + w + 8} V0`} stroke={DARK_RED} strokeWidth="16" fill="none" />
    </>
  );
}

/** The red alarm bell on the wall: it shakes and rings. */
export function Glocke() {
  return (
    <>
      <Toot x={530} y={-254} className="fw-glocke-ring" colour={FIRE_RED} />
      <Toot x={370} y={-254} dir={-1} className="fw-glocke-ring" colour={FIRE_RED} />
      <rect x="436" y="-300" width="28" height="26" rx="5" fill="#495057" />
      <g className="fw-glocke-bell" style={{ transformOrigin: "450px -282px" }}>
        <circle className="fw-glocke-clapper" cx="450" cy="-214" r="9" fill="#6c757d" style={{ transformOrigin: "450px -260px" }} />
        <path d="M398 -218 Q398 -282 450 -284 Q502 -282 502 -218 Z" fill={FIRE_RED} />
        <rect x="392" y="-226" width="116" height="12" rx="6" fill={DARK_RED} />
        <path d="M420 -262 Q432 -274 448 -276" stroke="#fff" strokeOpacity="0.6" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="450" cy="-284" r="7" fill="#495057" />
      </g>
    </>
  );
}

/** The flag pole in front of the station; the flag waves and goes up and down once. */
export function Fahne() {
  return (
    <>
      <rect x="-30" y="-14" width="60" height="14" rx="4" fill="#adb5bd" />
      <rect x="-6" y="-420" width="12" height="408" rx="4" fill="#ced4da" />
      <path d="M-3 -416 V-20" stroke="#fff" strokeWidth="3" opacity="0.6" />
      <circle cx="0" cy="-424" r="11" fill={STRIPE} />
      <path className="fw-fahne-rope" d="M8 -404 Q16 -250 8 -40" stroke="#868e96" strokeWidth="3" fill="none" style={{ transformOrigin: "8px -404px" }} />
      <g className="fw-fahne-hoist">
        <g className="fw-fahne-cloth" style={{ transformOrigin: "6px -360px" }}>
          <path d="M6 -406 Q76 -420 146 -400 V-314 Q76 -334 6 -320 Z" fill={FIRE_RED} />
          <path d="M6 -376 Q76 -390 146 -370 V-344 Q76 -364 6 -350 Z" fill="#fff" />
          <circle cx="76" cy="-362" r="22" fill={STRIPE} />
          <path d="M60 -362 Q60 -380 76 -380 Q92 -380 92 -362 Z" fill={FIRE_RED} />
          <rect x="56" y="-364" width="40" height="6" rx="3" fill={FIRE_RED} />
        </g>
      </g>
    </>
  );
}
