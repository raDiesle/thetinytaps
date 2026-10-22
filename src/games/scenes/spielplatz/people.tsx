import { Face, INK, SKIN, nth } from "../shared";
import { Kid, SitKid } from "./parts";

// People on the playground. Foot point at (0, 0).

function Spokes({ cx, cy, r, cls, fill = INK }: { cx: number; cy: number; r: number; cls: string; fill?: string }) {
  return (
    <g className={cls} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill={fill} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#e9ecef" />
      <path d={`M${cx - r * 0.6} ${cy} H${cx + r * 0.6} M${cx} ${cy - r * 0.6} V${cy + r * 0.6}`} stroke="#adb5bd" strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r={r * 0.18} fill="#adb5bd" />
    </g>
  );
}

/** A child on a balance bike with a helmet; it pushes off and rolls. */
export function Laufrad() {
  return (
    <g className="sp-lr-ride">
      <g className="sp-lr-leg" style={{ transformOrigin: "-6px -66px" }}>
        <path d="M-6 -66 L-22 -32 L-26 -8" stroke="#3a86ff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-28" cy="-6" rx="9" ry="5" fill={INK} />
      </g>
      <Spokes cx={-46} cy={-24} r={24} cls="sp-lr-wheel" />
      <Spokes cx={52} cy={-24} r={24} cls="sp-lr-wheel" />
      <path d="M-46 -24 L-14 -62 H34 L52 -24 M34 -62 L28 -100" stroke="#06d6a0" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 -102 H40" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <rect x="-24" y="-72" width="30" height="9" rx="4" fill={INK} />
      <path d="M-4 -66 L10 -36 L20 -10" stroke="#3a86ff" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <ellipse cx="22" cy="-8" rx="9" ry="5" fill={INK} />
      <rect x="-20" y="-118" width="30" height="52" rx="12" fill="#ff6b6b" />
      <path d="M2 -108 L28 -100" stroke="#ff6b6b" strokeWidth="9" strokeLinecap="round" />
      <circle cx="30" cy="-100" r="5" fill={SKIN} />
      <g className="sp-lr-head" style={{ transformOrigin: "-4px -118px" }}>
        <circle cx="-4" cy="-136" r="18" fill={SKIN} />
        <path d="M-24 -136 Q-24 -162 -4 -162 Q18 -162 18 -138 Z" fill="#4361ee" />
        <path d="M-14 -158 L-10 -146 M-2 -160 V-148 M8 -158 L5 -146" stroke="#4cc9f0" strokeWidth="3" strokeLinecap="round" />
        <Face cx={2} cy={-132} size={0.6} />
      </g>
      <g className="sp-lr-wind" stroke="#fff" strokeWidth="4" strokeLinecap="round">
        <path d="M-80 -90 h-24 M-76 -70 h-30 M-82 -50 h-20" />
      </g>
    </g>
  );
}

/** A child on a red tricycle: pedals round and rings the bell. */
export function Dreirad() {
  return (
    <g className="sp-dr3-ride">
      <Spokes cx={-46} cy={-16} r={16} cls="sp-dr3-wheel" />
      <path d="M-56 -36 H-16 L22 -64" stroke="#e63946" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="-50" y="-60" width="34" height="9" rx="4" fill={INK} />
      <g transform="translate(-34 -62)">
        <SitKid cls="sp-dr3-kid" shirt="#ffd60a" pants="#2a9d8f" hair="#3d2314" style="short" armL={100} armR={100} />
      </g>
      <Spokes cx={30} cy={-28} r={28} cls="sp-dr3-front" />
      <g className="sp-dr3-pedal" style={{ transformOrigin: "30px -28px" }}>
        <path d="M30 -28 L30 -10" stroke="#495057" strokeWidth="4" strokeLinecap="round" />
        <rect x="24" y="-12" width="14" height="5" rx="2" fill="#495057" />
      </g>
      <path d="M22 -64 L30 -28 M14 -84 H34 M24 -84 L22 -64" stroke="#e63946" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="-56" cy="-16" r="16" fill="none" />
      <g className="sp-dr3-bell" style={{ transformOrigin: "36px -88px" }}>
        <circle cx="38" cy="-90" r="6" fill="#ffd60a" />
      </g>
      <g className="sp-dr3-ring" stroke="#ffb703" strokeWidth="3.5" strokeLinecap="round" fill="none">
        <path d="M50 -104 l8 -6 M52 -92 h10 M50 -80 l8 6" />
      </g>
    </g>
  );
}

/** Pram with a baby: the baby sits up and shakes its rattle. */
export function Kinderwagen() {
  return (
    <g className="sp-kw-rock" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-60 -60 L-74 -112 H-90" stroke="#495057" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-40 -30 L-24 -12 M40 -30 L26 -12" stroke="#495057" strokeWidth="5" />
      <g className="sp-kw-baby" style={{ transformOrigin: "-6px -60px" }}>
        <circle cx="-6" cy="-76" r="15" fill={SKIN} />
        <path d="M-12 -90 q6 -8 12 -2" stroke="#e9c46a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Face cx={-4} cy={-74} size={0.5} />
        <g className="sp-kw-rattle" style={{ transformOrigin: "14px -66px" }}>
          <path d="M14 -66 L22 -84" stroke="#ff8fab" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="-90" r="8" fill="#ffd60a" />
          <circle cx="22" cy="-92" r="2.5" fill="#fff" opacity="0.6" />
          <circle cx="15" cy="-66" r="4.5" fill={SKIN} />
        </g>
      </g>
      <path d="M-62 -66 H62 Q62 -24 22 -24 H-22 Q-62 -24 -62 -66 Z" fill="#8ecae6" />
      <path d="M-56 -60 H56" stroke="#fff" strokeWidth="4" opacity="0.5" />
      <path d="M-62 -66 H62" stroke="#219ebc" strokeWidth="5" strokeLinecap="round" />
      <g className="sp-kw-hood" style={{ transformOrigin: "60px -66px" }}>
        <path d="M60 -66 Q60 -122 10 -116 L30 -66 Z" fill="#219ebc" />
        <path d="M54 -100 L22 -92 M58 -82 L28 -76" stroke="#8ecae6" strokeWidth="3" />
      </g>
      <Spokes cx={-26} cy={-14} r={14} cls="sp-kw-wheel" />
      <Spokes cx={26} cy={-14} r={14} cls="sp-kw-wheel" />
      <g className="sp-kw-notes" fill="#ffb703">
        {[0, 1].map((i) => (
          <circle key={i} cx={40 + i * 16} cy={-112 - i * 10} r="4" style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** Grandma on the bench feeds the sparrows: she throws crumbs and nods. */
export function Oma() {
  return (
    <>
      <rect x="-82" y="-50" width="8" height="50" fill="#495057" />
      <rect x="74" y="-50" width="8" height="50" fill="#495057" />
      <rect x="-92" y="-114" width="184" height="12" rx="3" fill="#2d6a4f" />
      <rect x="-92" y="-94" width="184" height="12" rx="3" fill="#2d6a4f" />
      <path d="M-78 -114 V-56 M78 -114 V-56" stroke="#495057" strokeWidth="6" />
      <rect x="-94" y="-58" width="188" height="12" rx="3" fill="#40916c" />
      {/* Bag of breadcrumbs */}
      <path d="M30 -58 L34 -84 H54 L58 -58 Z" fill="#dda15e" />
      <path d="M34 -84 Q44 -92 54 -84" stroke="#bc6c25" strokeWidth="2" fill="none" />
      {/* Grandma */}
      {[-34, -16].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="-52" width="12" height="46" rx="5" fill="#6c757d" />
          <ellipse cx={x - 2} cy="-6" rx="10" ry="5" fill={INK} />
        </g>
      ))}
      <rect x="-50" y="-66" width="62" height="18" rx="9" fill="#6c757d" />
      <path d="M-50 -58 V-100 Q-50 -122 -24 -122 Q2 -122 2 -100 V-58 Z" fill="#e76f51" />
      <path d="M-24 -120 V-62" stroke="#f4a261" strokeWidth="3" />
      <path d="M-46 -104 Q-40 -76 -26 -70" stroke="#e76f51" strokeWidth="11" strokeLinecap="round" fill="none" />
      <g className="sp-oma-head" style={{ transformOrigin: "-24px -124px" }}>
        <circle cx="-24" cy="-142" r="20" fill={SKIN} />
        <path d="M-45 -140 Q-46 -164 -24 -164 Q-2 -164 -3 -140 Q-6 -154 -24 -154 Q-42 -154 -45 -140 Z" fill="#dee2e6" />
        {/* Hat with a flower */}
        <path d="M-50 -156 H2 Q-4 -182 -24 -182 Q-44 -182 -50 -156 Z" fill="#9d4edd" />
        <g className="sp-oma-flower" style={{ transformOrigin: "-8px -166px" }}>
          <circle cx="-8" cy="-170" r="6" fill="#ffd60a" />
          <circle cx="-8" cy="-170" r="2.5" fill="#e63946" />
        </g>
        <Face cx={-24} cy={-142} size={0.75} />
        <g fill="none" stroke={INK} strokeWidth="2">
          <circle cx="-29.5" cy="-142" r="6" />
          <circle cx="-18.5" cy="-142" r="6" />
        </g>
      </g>
      <g className="sp-oma-arm" style={{ transformOrigin: "-2px -110px" }}>
        <path d="M-2 -110 L20 -88" stroke="#e76f51" strokeWidth="10" strokeLinecap="round" />
        <circle cx="23" cy="-85" r="6" fill={SKIN} />
      </g>
      <g className="sp-oma-crumbs" fill="#e9c46a">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={30} cy={-90} r="3" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** A girl blowing soap bubbles; new bubbles float up and pop. */
export function Seifenblasen() {
  const bubbles = [
    [56, -170, 16],
    [86, -206, 22],
    [40, -236, 12],
    [110, -160, 10],
    [70, -268, 18],
  ];
  return (
    <>
      <Kid cls="sp-sb2-kid" shirt="#c77dff" pants="#4361ee" hair="#f4a261" style="bun" armL={30} armR={130} />
      {/* The wand in front of her mouth, the bottle in her other hand */}
      <g className="sp-sb2-wand" style={{ transformOrigin: "30px -102px" }}>
        <path d="M30 -102 L34 -116" stroke="#ff8fab" strokeWidth="3" />
        <circle cx="35" cy="-122" r="7" stroke="#ff8fab" strokeWidth="3" fill="#e0f2ff" fillOpacity="0.6" />
      </g>
      <rect x="-40" y="-66" width="14" height="22" rx="4" fill="#4cc9f0" />
      <rect x="-37" y="-72" width="8" height="7" rx="2" fill="#ef476f" />
      <g className="sp-sb2-new">
        {bubbles.map(([cx, cy, r], i) => (
          <g key={i} style={nth(i)}>
            <circle cx={cx} cy={cy} r={r} fill="#e0f2ff" fillOpacity="0.45" stroke="#a5d8ff" strokeWidth="2.5" />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.25} fill="#fff" />
          </g>
        ))}
      </g>
      {/* Two bubbles that are always there */}
      <g className="sp-sb2-old">
        {[
          [60, -150, 13],
          [92, -190, 9],
        ].map(([cx, cy, r]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r={r} fill="#e0f2ff" fillOpacity="0.45" stroke="#ffc8dd" strokeWidth="2.5" />
            <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.25} fill="#fff" />
          </g>
        ))}
      </g>
    </>
  );
}
