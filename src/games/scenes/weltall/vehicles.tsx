import { INK, Pane, STEEL, nth } from "../shared";
import { Dust, Helmet, SUIT, sparklePath } from "./parts";

// Everything with wheels or a motor on the moon: digger, rover, robot and robot dog. Each
// drawing has its foot point at (0, 0) and is placed with `ground`.

/** Spokes through (cx, cy): three lines at 60° from each other. */
function spokes(cx: number, cy: number, r: number) {
  return [0, 60, 120]
    .map((a) => {
      const dx = r * Math.cos((a * Math.PI) / 180);
      const dy = r * Math.sin((a * Math.PI) / 180);
      return `M${(cx - dx).toFixed(1)} ${(cy - dy).toFixed(1)} L${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}`;
    })
    .join(" ");
}

/** A chunky moon wheel with a knobbly tread; it turns while its vehicle moves. */
function MoonWheel({ cx, cy, r, className }: { cx: number; cy: number; r: number; className: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill="#495057" />
      <circle cx={cx} cy={cy} r={r * 0.88} fill="none" stroke="#343a40" strokeWidth={r * 0.22} strokeDasharray={`${r * 0.3} ${r * 0.26}`} />
      <circle cx={cx} cy={cy} r={r * 0.58} fill="#ced4da" />
      <path d={spokes(cx, cy, r * 0.5)} stroke="#868e96" strokeWidth={r * 0.12} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.18} fill="#868e96" />
    </g>
  );
}

/** The little yellow moon digger: it digs moon dust, its wheels turn and the beacon blinks. */
export function Mondbagger() {
  return (
    <>
      <Dust className="wa-bagger-dust" spots={[[150, -18], [122, -6], [180, -8]]} r={16} />
      <g className="wa-bagger-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-120" y="-78" width="214" height="36" rx="10" fill="#ffb703" />
        <rect x="-120" y="-54" width="214" height="12" rx="6" fill="#f4a100" />
        <rect x="-112" y="-154" width="82" height="82" rx="12" fill="#ffb703" />
        <rect x="-116" y="-160" width="90" height="12" rx="6" fill="#f4a100" />
        <Pane x={-102} y={-144} w={60} h={46}>
          <g className="wa-bagger-driver">
            <Helmet cx={-72} cy={-118} r={16} hair="#2b2d42" />
          </g>
        </Pane>
        <rect x="-80" y="-174" width="16" height="14" rx="5" fill="#b5651d" />
        <rect className="wa-bagger-beacon" x="-80" y="-174" width="16" height="14" rx="5" fill="#ffd60a" />
        <rect x="-28" y="-112" width="52" height="36" rx="8" fill="#f4a100" />
        <rect x="-20" y="-126" width="10" height="16" rx="3" fill={INK} />
        <MoonWheel cx={-88} cy={-30} r={28} className="wa-bagger-wheel" />
        <MoonWheel cx={-14} cy={-30} r={28} className="wa-bagger-wheel" />
        <MoonWheel cx={60} cy={-30} r={28} className="wa-bagger-wheel" />
        <g className="wa-bagger-arm" style={{ transformOrigin: "10px -96px" }}>
          <path d="M10 -96 L84 -176 L150 -104" stroke="#f4a100" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M18 -106 L80 -170" stroke="#ffd166" strokeWidth="5" strokeLinecap="round" />
          <circle cx="84" cy="-176" r="8" fill={INK} />
          <g className="wa-bagger-bucket" style={{ transformOrigin: "150px -104px" }}>
            <path d="M140 -108 Q196 -104 184 -56 L144 -56 Q130 -80 140 -108 Z" fill={INK} />
            <path d="M146 -56 l5 10 l5 -10 M160 -56 l5 10 l5 -10 M174 -56 l5 10 l5 -10" fill={INK} />
            <path d="M146 -94 Q164 -104 182 -92" stroke="#ced4da" strokeWidth="7" strokeLinecap="round" fill="none" />
          </g>
          <circle cx="150" cy="-104" r="7" fill={STEEL} />
          <circle cx="10" cy="-96" r="9" fill={INK} />
        </g>
      </g>
    </>
  );
}

/** A wheel with a wire mesh, as on the real moon rover. */
function WireWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="wa-buggy-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill="#495057" />
      <circle cx={cx} cy={cy} r={r * 0.8} fill="#868e96" />
      <path d={spokes(cx, cy, r * 0.8)} stroke="#ced4da" strokeWidth="3" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="#ced4da" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#343a40" />
    </g>
  );
}

/** The moon rover: it drives off and back, bumping along; the flag waves and the dish turns. */
export function Buggy() {
  return (
    <>
      <Dust className="wa-buggy-dust" spots={[[-140, -12], [-112, -4], [-164, -22]]} r={14} />
      <g className="wa-buggy-body">
        <path d="M-104 -76 V-170" stroke="#868e96" strokeWidth="4" />
        <g className="wa-buggy-flag" style={{ transformOrigin: "-104px -160px" }}>
          <path d="M-104 -170 L-62 -160 L-104 -148 Z" fill="#ff8c42" />
        </g>
        <rect x="-122" y="-104" width="40" height="28" rx="5" fill="#f4c542" />
        <rect x="-64" y="-132" width="12" height="58" rx="5" fill="#495057" />
        <g className="wa-buggy-driver">
          <rect x="-50" y="-112" width="38" height="40" rx="12" fill={SUIT} />
          <g className="wa-buggy-arm" style={{ transformOrigin: "-20px -100px" }}>
            <path d="M-20 -100 L24 -102" stroke={SUIT} strokeWidth="10" strokeLinecap="round" />
          </g>
          <Helmet cx={-31} cy={-130} r={22} />
        </g>
        <path d="M46 -76 L30 -104" stroke="#495057" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="28" cy="-106" rx="10" ry="4" fill="#343a40" />
        <path d="M90 -78 V-108" stroke="#868e96" strokeWidth="4" />
        <g className="wa-buggy-dish" style={{ transformOrigin: "90px -110px" }}>
          <path d="M68 -126 Q90 -102 112 -126 Q90 -118 68 -126 Z" fill="#f1f3f5" stroke="#ced4da" strokeWidth="2" />
        </g>
        <path className="wa-buggy-beam" d="M128 -70 L196 -96 L196 -44 Z" fill="#fff3bf" opacity="0.7" />
        <rect x="-126" y="-80" width="252" height="18" rx="6" fill="#adb5bd" />
        <path d="M-120 -66 H120" stroke="#868e96" strokeWidth="4" />
        <path d="M-134 -60 Q-90 -112 -46 -60 Z M46 -60 Q90 -112 134 -60 Z" fill="#f4c542" />
        <circle className="wa-buggy-lamp" cx="124" cy="-70" r="7" fill="#fff3bf" stroke="#adb5bd" strokeWidth="2" />
        <WireWheel cx={-90} cy={-30} r={30} />
        <WireWheel cx={90} cy={-30} r={30} />
      </g>
    </>
  );
}

const ROBO_LIGHTS = ["#ff6b6b", "#ffd60a", "#69db7c"];

/** The blue robot on its wheel: it rolls, lifts its arms, turns its head and beeps. */
export function Roboter() {
  return (
    <>
      <g className="wa-robo-beeps" fill="#ffd60a">
        {[0, 1, 2].map((i) => (
          <path key={i} d={sparklePath(54 + i * 14, -204 - i * 16, 9 - i)} style={nth(i)} />
        ))}
      </g>
      <g className="wa-robo-body">
        <g className="wa-robo-wheel" style={{ transformOrigin: "0px -24px" }}>
          <circle cx="0" cy="-24" r="24" fill="#495057" />
          <circle cx="0" cy="-24" r="12" fill="#adb5bd" />
          <path d={spokes(0, -24, 20)} stroke="#868e96" strokeWidth="3" />
        </g>
        <path d="M-32 -28 A32 32 0 0 1 32 -28 Z" fill="#339af0" />
        <rect x="-10" y="-58" width="20" height="18" fill="#868e96" />
        <g className="wa-robo-arm" style={{ transformOrigin: "-44px -116px" }}>
          <path d="M-44 -116 Q-72 -110 -70 -80" stroke="#868e96" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M-80 -82 Q-70 -64 -60 -82" stroke="#495057" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
        <g className="wa-robo-arm" style={{ transformOrigin: "44px -116px", ...nth(1) }}>
          <path d="M44 -116 Q72 -110 70 -80" stroke="#868e96" strokeWidth="10" fill="none" strokeLinecap="round" />
          <path d="M60 -82 Q70 -64 80 -82" stroke="#495057" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
        <rect x="-46" y="-132" width="92" height="82" rx="16" fill="#4dabf7" />
        <rect x="-46" y="-66" width="92" height="16" rx="8" fill="#339af0" />
        <rect x="-30" y="-118" width="60" height="32" rx="8" fill="#e7f5ff" />
        {ROBO_LIGHTS.map((colour, i) => (
          <circle key={colour} className="wa-robo-light" cx={-16 + i * 16} cy="-102" r="6" fill={colour} style={nth(i)} />
        ))}
        <circle cx="0" cy="-72" r="7" fill="#ffd60a" />
        <path d="M0 -72 L4 -76" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        <rect x="-8" y="-144" width="16" height="14" fill="#868e96" />
        <g className="wa-robo-head" style={{ transformOrigin: "0px -140px" }}>
          <path d="M0 -192 V-206" stroke="#868e96" strokeWidth="4" />
          <circle className="wa-robo-ant" cx="0" cy="-211" r="7" fill="#ff6b6b" />
          <rect x="-48" y="-176" width="10" height="22" rx="4" fill="#868e96" />
          <rect x="38" y="-176" width="10" height="22" rx="4" fill="#868e96" />
          <rect x="-40" y="-194" width="80" height="54" rx="16" fill="#a5d8ff" />
          <rect x="-30" y="-186" width="60" height="38" rx="10" fill="#343a40" />
          <g className="wa-robo-eyes" style={{ transformOrigin: "0px -172px" }}>
            <rect x="-19" y="-177" width="11" height="11" rx="5.5" fill="#66d9e8" />
            <rect x="8" y="-177" width="11" height="11" rx="5.5" fill="#66d9e8" />
          </g>
          <path d="M-9 -158 Q0 -152 9 -158" stroke="#66d9e8" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M-34 -186 Q-26 -192 -14 -192" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>
      </g>
    </>
  );
}

const DOG_LIGHTS = ["#ff6b6b", "#ffd60a", "#69db7c"];

/** The little robot dog: it hops and barks, wags its antenna tail, flips its ears and blinks. */
export function Roboterhund() {
  return (
    <>
      <g className="wa-rh-bark" stroke={INK} strokeWidth="4" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${118 + i * 2} ${-104 + i * 12} l16 ${-8 + i * 8}`} style={nth(i)} />
        ))}
      </g>
      <g className="wa-rh-body">
        <g className="wa-rh-tail" style={{ transformOrigin: "-54px -66px" }}>
          <path d="M-54 -66 L-80 -104" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
          <circle cx="-82" cy="-107" r="7" fill="#ff6b6b" />
        </g>
        {[-38, -16, 22, 44].map((x, i) => (
          <g key={x} className="wa-rh-leg" style={{ transformOrigin: `${x + 6}px -32px`, ...nth(i) }}>
            <rect x={x} y="-36" width="12" height="30" rx="4" fill="#adb5bd" />
            <rect x={x - 3} y="-9" width="18" height="9" rx="4" fill="#495057" />
          </g>
        ))}
        <rect x="-58" y="-80" width="116" height="52" rx="18" fill="#ced4da" />
        <rect x="-58" y="-44" width="116" height="16" rx="8" fill="#adb5bd" />
        <path d="M-44 -72 H20" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        {DOG_LIGHTS.map((colour, i) => (
          <circle key={colour} className="wa-rh-light" cx={-30 + i * 18} cy="-56" r="5" fill={colour} style={nth(i)} />
        ))}
        <g className="wa-rh-head" style={{ transformOrigin: "52px -74px" }}>
          <g className="wa-rh-ear" style={{ transformOrigin: "62px -118px" }}>
            <path d="M52 -116 L60 -142 L72 -116 Z" fill="#868e96" />
          </g>
          <g className="wa-rh-ear" style={{ transformOrigin: "88px -118px", ...nth(1) }}>
            <path d="M78 -116 L88 -142 L98 -116 Z" fill="#868e96" />
          </g>
          <rect x="42" y="-122" width="64" height="54" rx="14" fill="#e9ecef" />
          <rect x="52" y="-112" width="46" height="28" rx="8" fill="#343a40" />
          <g className="wa-rh-eyes" style={{ transformOrigin: "75px -100px" }}>
            <rect x="60" y="-105" width="9" height="9" rx="4.5" fill="#66d9e8" />
            <rect x="80" y="-105" width="9" height="9" rx="4.5" fill="#66d9e8" />
          </g>
          <path d="M66 -90 Q75 -86 84 -90" stroke="#66d9e8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <rect x="100" y="-92" width="14" height="16" rx="6" fill="#ced4da" />
          <circle cx="112" cy="-88" r="4.5" fill={INK} />
        </g>
      </g>
    </>
  );
}
