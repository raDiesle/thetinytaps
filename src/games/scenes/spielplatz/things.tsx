import { Face, INK, Pane, SKIN, Wheel, nth } from "../shared";

// Things around the playground. Foot point at (0, 0).

const CROWN = [
  [0, -230, 84, "#52b788"],
  [-66, -186, 58, "#40916c"],
  [66, -192, 60, "#40916c"],
  [-24, -286, 48, "#52b788"],
  [34, -270, 40, "#74c69d"],
] as const;

/** Big shady tree; the crown shakes and leaves fall. */
export function Baum() {
  return (
    <>
      <path d="M-18 0 Q-10 -70 -12 -140 H12 Q10 -70 18 0 Z" fill="#8d5a2b" />
      <path d="M-4 -40 Q-2 -70 -6 -100" stroke="#6f4518" strokeWidth="3" fill="none" />
      <path d="M0 -100 L-36 -140 M2 -116 L32 -156" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" />
      {/* Knot hole, the squirrel's home */}
      <ellipse cx="2" cy="-118" rx="6" ry="9" fill="#4a2c0f" />
      <g className="sp-baum-crown" style={{ transformOrigin: "0px -140px" }}>
        {CROWN.map(([cx, cy, r, fill]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx="-34" cy="-296" r="16" fill="#95d5b2" />
        <circle cx="-30" cy="-246" r="24" fill="#95d5b2" opacity="0.5" />
      </g>
      <g className="sp-baum-leaves" fill="#74c69d">
        {[-70, -20, 30, 74].map((x, i) => (
          <ellipse key={x} cx={x} cy="-160" rx="9" ry="5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Garden gate in the fence, with a sign above; it swings open and a child peeks in. */
export function Tor() {
  return (
    <>
      <g className="sp-tor-peek">
        <circle cx="12" cy="-70" r="16" fill={SKIN} />
        <path d="M-4 -72 Q-4 -90 12 -90 Q28 -90 28 -72 Q18 -82 -4 -72 Z" fill="#bc6c25" />
        <Face cx={12} cy={-70} size={0.55} />
      </g>
      <rect x="-54" y="-118" width="12" height="118" rx="3" fill="#a47148" />
      <rect x="42" y="-118" width="12" height="118" rx="3" fill="#a47148" />
      <circle cx="-48" cy="-120" r="8" fill="#c08552" />
      <circle cx="48" cy="-120" r="8" fill="#c08552" />
      <g className="sp-tor-door" style={{ transformOrigin: "-42px 0px" }}>
        {[-34, -18, -2, 14, 30].map((x) => (
          <path key={x} d={`M${x - 6} -6 V-70 L${x} -78 L${x + 6} -70 V-6 Z`} fill="#e6b88a" />
        ))}
        <rect x="-42" y="-64" width="84" height="7" fill="#c08552" />
        <rect x="-42" y="-26" width="84" height="7" fill="#c08552" />
        <circle cx="34" cy="-44" r="4" fill={INK} />
      </g>
      {/* Arch with the playground sign */}
      <path d="M-48 -126 Q0 -164 48 -126" stroke="#a47148" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g className="sp-tor-sign" style={{ transformOrigin: "0px -146px" }}>
        <path d="M-12 -146 V-136 M12 -146 V-136" stroke={INK} strokeWidth="2" />
        <rect x="-30" y="-136" width="60" height="30" rx="6" fill="#ffd60a" />
        <path d="M-20 -112 L-10 -128 V-112 M-10 -128 Q4 -124 18 -112" stroke="#e63946" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="-2" cy="-126" r="3.5" fill="#118ab2" />
      </g>
    </>
  );
}

/** Rubbish bin on a post: the lid opens and a paper ball drops in. */
export function Muelleimer() {
  return (
    <>
      <rect x="-5" y="-60" width="10" height="60" fill="#6c757d" />
      <path d="M-28 -104 H28 L24 -48 H-24 Z" fill="#2d6a4f" />
      <path d="M-22 -96 V-56 M-8 -96 V-56 M8 -96 V-56 M22 -96 V-56" stroke="#1b4332" strokeWidth="3" />
      <path d="M-20 -100 L-18 -52" stroke="#fff" strokeWidth="4" opacity="0.25" strokeLinecap="round" />
      <g className="sp-mu-paper">
        <circle cx="6" cy="-150" r="10" fill="#f8f9fa" />
        <path d="M0 -154 l6 4 l5 -6 M2 -144 l8 -2" stroke="#ced4da" strokeWidth="2" fill="none" />
      </g>
      <g className="sp-mu-lid" style={{ transformOrigin: "-30px -104px" }}>
        <path d="M-32 -104 Q0 -126 32 -104 Z" fill="#40916c" />
        <rect x="-6" y="-122" width="12" height="6" rx="3" fill="#1b4332" />
      </g>
    </>
  );
}

/** Drinking fountain: press the button and water springs up in an arc. */
export function Brunnen() {
  return (
    <>
      <path d="M-22 0 L-16 -96 H16 L22 0 Z" fill="#adb5bd" />
      <path d="M-14 -90 L-18 -6" stroke="#fff" strokeWidth="5" opacity="0.35" strokeLinecap="round" />
      <ellipse cx="0" cy="-98" rx="30" ry="10" fill="#868e96" />
      <ellipse cx="0" cy="-100" rx="22" ry="6" fill="#4dabf7" />
      <rect x="-4" y="-112" width="8" height="12" rx="2" fill="#495057" />
      <g className="sp-br-button" style={{ transformOrigin: "20px -80px" }}>
        <rect x="16" y="-88" width="10" height="16" rx="3" fill="#e63946" />
      </g>
      <path className="sp-br-arc" d="M0 -112 Q14 -160 34 -108" stroke="#4dabf7" strokeWidth="6" strokeLinecap="round" fill="none" />
      <g className="sp-br-drops" fill="#4dabf7">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={30 + i * 6} cy={-104 + i * 4} r="3.5" style={nth(i)} />
        ))}
      </g>
      <g className="sp-br-ripples" fill="none" stroke="#fff" strokeWidth="2">
        <ellipse cx="0" cy="-100" rx="10" ry="3" style={nth(0)} />
        <ellipse cx="0" cy="-100" rx="16" ry="4" style={nth(1)} />
      </g>
    </>
  );
}

/** Ice cream van with a bell: the hatch opens, the ice cream man rings the bell. */
export function Eiswagen() {
  return (
    <>
      <path d="M-120 -30 V-150 Q-120 -170 -100 -170 H70 Q92 -170 100 -150 L124 -90 V-30 Z" fill="#fff0f6" />
      <path d="M-120 -64 H124 V-30 H-120 Z" fill="#ffc8dd" />
      <path d="M-120 -64 H124" stroke="#ff8fab" strokeWidth="5" />
      {/* Cab window with the driver's seat empty, the ice cream man stands in the hatch */}
      <Pane x={72} y={-152} w={34} h={56} rx={8} />
      {/* The hatch: the ice cream man behind the counter */}
      <rect x="-96" y="-150" width="140" height="74" rx="6" fill="#ffe5ec" />
      <g className="sp-ew-man" style={{ transformOrigin: "-30px -80px" }}>
        <rect x="-50" y="-112" width="40" height="36" rx="10" fill="#fff" />
        <circle cx="-30" cy="-124" r="16" fill={SKIN} />
        <path d="M-46 -134 Q-46 -150 -30 -150 Q-14 -150 -14 -134 Z" fill="#fff" />
        <rect x="-48" y="-138" width="36" height="6" rx="3" fill="#ffc8dd" />
        <Face cx={-30} cy={-122} size={0.55} />
      </g>
      <g className="sp-ew-bell" style={{ transformOrigin: "4px -128px" }}>
        <path d="M4 -128 V-118" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M-8 -92 Q-8 -118 4 -118 Q16 -118 16 -92 Z" fill="#ffd60a" />
        <rect x="-11" y="-94" width="30" height="5" rx="2" fill="#f4a261" />
        <circle cx="4" cy="-87" r="3.5" fill="#f4a261" />
      </g>
      <g className="sp-ew-ring" stroke="#ffb703" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M26 -124 l10 -6 M28 -110 h12 M26 -96 l10 6" />
      </g>
      <rect x="-104" y="-80" width="156" height="10" rx="4" fill="#ff8fab" />
      {/* Hatch flap above the counter */}
      <g className="sp-ew-flap" style={{ transformOrigin: "-26px -152px" }}>
        <rect x="-100" y="-160" width="148" height="12" rx="4" fill="#ff5d8f" />
      </g>
      {/* A big ice cream cone on the roof */}
      <g className="sp-ew-cone" style={{ transformOrigin: "-10px -170px" }}>
        <path d="M-24 -200 L-10 -170 L4 -200 Z" fill="#e9c46a" />
        <path d="M-20 -194 l12 12 M-14 -200 l14 14" stroke="#d4a373" strokeWidth="2" />
        <circle cx="-16" cy="-208" r="12" fill="#ff8fab" />
        <circle cx="-2" cy="-208" r="12" fill="#f8f9fa" />
        <circle cx="-10" cy="-222" r="11" fill="#8d5a2b" />
        <circle cx="-10" cy="-236" r="4" fill="#e63946" />
      </g>
      <Wheel cx={-70} cy={-28} r={26} />
      <Wheel cx={80} cy={-28} r={26} />
      <rect x="116" y="-58" width="12" height="10" rx="3" fill="#ffd60a" />
    </>
  );
}

/** A red and white ball; it bounces. */
export function Ball() {
  return (
    <g className="sp-ball-bounce">
      <g className="sp-ball-spin" style={{ transformOrigin: "0px -28px" }}>
        <circle cx="0" cy="-28" r="28" fill="#f8f9fa" />
        <path d="M0 -56 A28 28 0 0 1 28 -28 H0 Z M0 0 A28 28 0 0 1 -28 -28 H0 Z" fill="#e63946" />
        <path d="M0 -56 Q-12 -28 0 0 M-28 -28 Q0 -40 28 -28" stroke="#4361ee" strokeWidth="4" fill="none" />
        <circle cx="-10" cy="-40" r="7" fill="#fff" opacity="0.6" />
      </g>
    </g>
  );
}

const TULIPS = [
  [-80, -66, "#ef476f"],
  [-46, -84, "#ffd60a"],
  [-12, -70, "#ff8fab"],
  [22, -88, "#e63946"],
  [56, -68, "#9d4edd"],
  [88, -80, "#ffd60a"],
] as const;

/** Flower bed with tulips; they sway and open up. */
export function Blumen() {
  return (
    <>
      <ellipse cx="4" cy="-6" rx="120" ry="18" fill="#9c6644" />
      <ellipse cx="4" cy="-10" rx="110" ry="12" fill="#7f5539" />
      {TULIPS.map(([x, h, fill], i) => (
        <g key={x} className="sp-bl-flower" style={{ ...nth(i), transformOrigin: `${x}px -8px` }}>
          <path d={`M${x} -8 V${h + 10}`} stroke="#40916c" strokeWidth="5" />
          <path d={`M${x} -18 Q${x - 18} -30 ${x - 14} ${-44}`} stroke="#52b788" strokeWidth="7" fill="none" strokeLinecap="round" />
          <g className="sp-bl-head" style={{ transformOrigin: `${x}px ${h + 8}px` }}>
            <path d={`M${x - 13} ${h} Q${x - 14} ${h + 16} ${x} ${h + 16} Q${x + 14} ${h + 16} ${x + 13} ${h} L${x + 7} ${h + 6} L${x} ${h - 4} L${x - 7} ${h + 6} Z`} fill={fill} />
            <ellipse cx={x - 5} cy={h + 8} rx="3" ry="5" fill="#fff" opacity="0.4" />
          </g>
        </g>
      ))}
    </>
  );
}

/** A kite with a face high in the sky; its tail bows wave. */
export function Drachen() {
  return (
    <g className="sp-dr-fly" style={{ transformOrigin: "0px 0px" }}>
      <path d="M8 40 Q60 120 40 200 T110 330" stroke="#868e96" strokeWidth="2" fill="none" opacity="0.8" />
      <g className="sp-dr-tail" style={{ transformOrigin: "0px 60px" }}>
        <path d="M0 60 Q-24 90 -6 120 T-20 180" stroke={INK} strokeWidth="2" fill="none" />
        {[
          [-12, 90, "#ffd60a"],
          [-6, 122, "#06d6a0"],
          [-14, 154, "#4cc9f0"],
        ].map(([x, y, fill]) => (
          <path key={y} d={`M${Number(x) - 10} ${Number(y) - 6} L${Number(x) + 10} ${Number(y) + 6} V${Number(y) - 6} L${Number(x) - 10} ${Number(y) + 6} Z`} fill={String(fill)} />
        ))}
      </g>
      <path d="M0 -60 L44 0 L0 60 L-44 0 Z" fill="#ef476f" />
      <path d="M0 -60 L44 0 L0 0 Z M0 0 L-44 0 L0 60 Z" fill="#ffd60a" />
      <path d="M0 -60 V60 M-44 0 H44" stroke="#9d0208" strokeWidth="2.5" />
      <circle cx="0" cy="-6" r="16" fill="#fff" />
      <Face cx={0} cy={-8} size={0.55} />
    </g>
  );
}
