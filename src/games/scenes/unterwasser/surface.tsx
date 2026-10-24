import type { CSSProperties } from "react";
import { Eye, INK, Inside, Pane, Rider, SKIN, nth } from "../shared";
import { ANCHOR, BOAT } from "./layout";
import { Bubbles, Lid, Lines, Sand } from "./parts";

// Up at the surface: the lighthouse on its island, the gull, the fishing boat and its anchor
// down on the sea floor. The lighthouse and the boat have their origin on the waterline, the
// gull in its middle, the anchor at its foot.

const LIGHTHOUSE_DOOR = "M-6 -62 h12 v20 h-12 Z";

/** Lighthouse on a little rock island; its lamp shines, the keeper opens the door and waves splash. */
export function Leuchtturm() {
  return (
    <>
      <g className="uw-leucht-beams" fill="#fff3b0">
        <path d="M0 -150 L-170 -196 V-110 Z" />
        <path d="M0 -150 L170 -196 V-110 Z" />
      </g>
      <path d="M-92 4 Q-74 -40 -22 -46 Q40 -52 72 -28 Q90 -12 96 4 Z" fill="#a98467" />
      <path d="M-62 -30 Q-22 -46 30 -42" stroke="#c9ada7" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.7" />
      <path d="M-22 -40 L-16 -130 H16 L22 -40 Z" fill="#fff" />
      <path d="M-20.6 -60 L-19.3 -80 H19.3 L20.6 -60 Z M-18 -100 L-16.8 -118 H16.8 L18 -100 Z" fill="#e63946" />
      <rect x="-6" y="-62" width="12" height="20" rx="6" fill={INK} />
      {/* The keeper stands in the dark doorway, hidden by the door until it opens. */}
      <Inside d={LIGHTHOUSE_DOOR}>
        <g className="uw-leucht-keeper">
          <rect x="-5" y="-46" width="10" height="6" rx="2" fill="#457b9d" />
          <circle cx="0" cy="-50" r="4.5" fill={SKIN} />
          <path d="M-5 -52 Q0 -58 5 -52 Z" fill="#1d3557" />
        </g>
      </Inside>
      <rect className="uw-leucht-door" x="-6" y="-62" width="12" height="20" rx="3" fill="#9c6644" style={{ transformOrigin: "-6px -52px" }} />
      <rect x="-3.5" y="-96" width="7" height="9" rx="2" fill={INK} />
      <rect className="uw-glow" x="-3.5" y="-96" width="7" height="9" rx="2" fill="#ffe066" />
      <rect x="-25" y="-138" width="50" height="9" rx="4" fill={INK} />
      <rect className="uw-leucht-lamp" x="-13" y="-162" width="26" height="25" rx="5" fill="#ffe066" />
      <path d="M-18 -161 Q0 -182 18 -161 Z" fill="#e63946" />
      <path d="M-8 -126 L-12 -46" stroke="#dee2e6" strokeWidth="5" strokeLinecap="round" />
      <g className="uw-leucht-splash" fill="#e7f5ff">
        {[-92, -76, 80, 96].map((x, i) => (
          <circle key={x} cx={x} cy={-2 - (i % 2) * 8} r={7 - (i % 2) * 2} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Seagull flying to the right; it flaps and circles. */
export function Moewe() {
  return (
    <g className="uw-moewe-body">
      <g className="uw-moewe-wing" style={{ transformOrigin: "-6px -6px" }}>
        <path d="M-6 -6 Q-30 -40 -64 -34 Q-40 -20 -28 2 Z" fill="#dee2e6" />
        <path d="M-50 -37 Q-60 -37 -64 -34 Q-58 -28 -52 -27 Z" fill="#495057" />
      </g>
      <path d="M-28 2 L-52 -6 L-50 10 Z" fill="#dee2e6" />
      <ellipse cx="0" cy="0" rx="34" ry="15" fill="#fff" />
      <circle cx="28" cy="-10" r="14" fill="#fff" />
      <path className="uw-moewe-jaw" d="M40 -6 L58 -5 L40 -1 Z" fill="#f4a261" style={{ transformOrigin: "40px -4px" }} />
      <path d="M40 -11 L60 -6 L40 -6 Z" fill="#ffb703" />
      <Eye cx={32} cy={-13} r={2.8} />
      <Lid cx={32} cy={-13} r={2.8} fill="#fff" />
      <Lines x={66} y={-6} dir={1} size={0.7} />
      <g className="uw-moewe-wing uw-moewe-wing-front" style={{ transformOrigin: "0px -4px" }}>
        <path d="M0 -4 Q18 -44 50 -50 Q36 -24 24 2 Z" fill="#e9ecef" />
        <path d="M40 -48 Q46 -50 50 -50 Q46 -42 42 -36 Z" fill="#495057" />
      </g>
    </g>
  );
}

const HULL = "M-112 -30 H114 Q110 10 80 36 H-70 Q-102 12 -112 -30 Z";

/** Little red fishing boat with the captain in the wheelhouse; it rocks and toots. */
export function Boot() {
  return (
    <g className="uw-boot-body" style={{ transformOrigin: "0px 20px" }}>
      <g className="uw-boot-puffs" fill="#f1f3f5">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={56} cy={-134} r={12 + i * 3} style={nth(i)} />
        ))}
      </g>
      <rect x="44" y="-126" width="22" height="42" rx="4" fill={INK} />
      <rect x="44" y="-114" width="22" height="8" fill="#e63946" />
      <rect x="-12" y="-98" width="92" height="72" rx="10" fill="#fff" />
      <path d="M-18 -98 H86 L78 -112 H-10 Z" fill="#457b9d" />
      <Pane x={0} y={-86} w={40} h={34} rx={6}>
        <g className="uw-boot-captain">
          <Rider cx={20} cy={-66} shirt="#ffd166" cap="#e63946" />
        </g>
      </Pane>
      <Pane x={48} y={-86} w={24} h={34} rx={6} />
      <rect className="uw-glow" x={48} y={-86} width={24} height={34} rx={6} fill="#ffe066" style={{ "--i": 1 } as CSSProperties} />
      {/* The captain's hand waves out of the window. */}
      <g className="uw-boot-hand" style={{ transformOrigin: "40px -64px" }}>
        <path d="M40 -64 L46 -92" stroke="#ffd166" strokeWidth="8" strokeLinecap="round" />
        <circle cx="47" cy="-96" r="6" fill={SKIN} />
      </g>
      <path
        className="uw-boot-flag"
        d="M66 -126 V-150 L88 -143 L66 -136"
        fill="#ffd60a"
        stroke={INK}
        strokeWidth="2"
        strokeLinejoin="round"
        style={{ transformOrigin: "66px -143px" }}
      />
      <Lines x={74} y={-120} dir={1} size={0.9} delay={0.2} />
      <path d={HULL} fill="#e63946" />
      <path d="M-112 -30 H114 L112 -18 H-108 Z" fill="#fff" />
      <circle cx="-62" cy="-2" r="10" fill="#fff" />
      <circle cx="-62" cy="-2" r="5" fill="#e63946" />
      {/* The part below the waterline is seen through the water */}
      <Inside d={HULL}>
        <rect x="-120" y="0" width="240" height="40" fill="#4cc9f0" opacity="0.4" />
      </Inside>
      <path d="M-100 -26 H60" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <g className="uw-boot-splash" fill="#e7f5ff">
        {[-118, -104, 112, 126].map((x, i) => (
          <circle key={x} cx={x} cy={-30 - (i % 2) * 10} r={8 - (i % 2) * 2} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

// The chain hangs from the bottom of the boat's hull down to the anchor's ring.
const CHAIN_TOP_X = (BOAT.x - ANCHOR.x) / ANCHOR.scale;
const CHAIN_TOP_Y = (BOAT.y + 30 * BOAT.scale - ANCHOR.y) / ANCHOR.scale;

/** The boat's anchor on the sea floor, on its long chain; it is pulled up a little and drops again. */
export function Anker() {
  return (
    <>
      <g className="uw-anker-sand" fill="#e9d8a6">
        {[-40, 0, 40].map((x, i) => (
          <circle key={x} cx={x} cy={-8} r={14} style={nth(i)} />
        ))}
      </g>
      <g className="uw-anker-body">
        <path className="uw-anker-chain" d={`M0 -114 L${CHAIN_TOP_X} ${CHAIN_TOP_Y}`} stroke="#6c757d" strokeWidth="8" strokeDasharray="14 6" />
        <circle cx="0" cy="-104" r="12" stroke="#495057" strokeWidth="7" fill="none" />
        <rect x="-7" y="-94" width="14" height="90" rx="5" fill="#6c757d" />
        <rect x="-38" y="-82" width="76" height="12" rx="6" fill="#495057" />
        <path d="M-46 -40 Q-44 -2 0 -2 Q44 -2 46 -40" stroke="#6c757d" strokeWidth="13" fill="none" strokeLinecap="round" />
        <path d="M-46 -54 L-60 -30 L-36 -34 Z M46 -54 L60 -30 L36 -34 Z" fill="#495057" />
        <path d="M-2 -88 V-20" stroke="#fff" strokeWidth="3" opacity="0.4" />
        <path
          className="uw-anker-weed"
          d="M30 -20 q6 -14 0 -26 M36 -18 q8 -10 6 -22"
          stroke="#52b788"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{ transformOrigin: "33px -19px" }}
        />
      </g>
      <Bubbles x={-30} y={-20} count={3} size={6} delay={0.4} />
      <Sand xs={[-56, 56]} y={-6} r={9} className="uw-anker-dust" />
    </>
  );
}
