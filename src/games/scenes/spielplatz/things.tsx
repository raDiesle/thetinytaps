import { INK, Wheel, nth } from "../shared";
import { Notes, Puffs, Sparkles } from "./parts";

// Things on the playground: the bin, the ball, the toys in the sandpit and the water pump.
// Foot point at (0, 0).

const SAND = "#f1c87a";
const SAND_DARK = "#dba85a";

/** The bin on its post: the lid flaps open, a fly buzzes out, and it closes again. */
export function Muelleimer() {
  return (
    <>
      <rect x="-6" y="-60" width="12" height="60" fill="#495057" />
      <path d="M-36 -120 H36 L30 -54 Q30 -46 22 -46 H-22 Q-30 -46 -30 -54 Z" fill="#2f9e44" />
      <path d="M-30 -104 H30 M-29 -86 H29 M-28 -68 H28" stroke="#40c057" strokeWidth="4" />
      <rect x="-12" y="-96" width="24" height="18" rx="4" fill="#ebfbee" />
      <path d="M-6 -88 l4 5 l8 -10" stroke="#2f9e44" strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="sp-muell-fly">
        <ellipse cx="0" cy="-130" rx="6" ry="4" fill={INK} />
        <ellipse cx="-4" cy="-136" rx="5" ry="3" fill="#e7f5ff" />
        <ellipse cx="4" cy="-136" rx="5" ry="3" fill="#e7f5ff" />
      </g>
      <g className="sp-muell-lid" style={{ transformOrigin: "-38px -122px" }}>
        <path d="M-40 -120 Q-40 -136 0 -138 Q40 -136 40 -120 Z" fill="#2b8a3e" />
        <rect x="-8" y="-146" width="16" height="9" rx="4" fill="#2b8a3e" />
      </g>
    </>
  );
}

/** The beach ball: it bounces high, spins and lands. */
export function Ball() {
  return (
    <>
      <g className="sp-ball-bounce">
        <g className="sp-ball-spin" style={{ transformOrigin: "0px -36px" }}>
          <circle cx="0" cy="-36" r="36" fill="#fff" />
          <path d="M0 -72 Q-30 -36 0 0 Q-44 -6 -36 -36 Q-40 -64 0 -72 Z" fill="#ff6b6b" />
          <path d="M0 -72 Q30 -36 0 0 Q44 -6 36 -36 Q40 -64 0 -72 Z" fill="#4dabf7" />
          <path d="M0 -72 Q10 -36 0 0 Q-10 -36 0 -72 Z" fill="#ffd43b" />
          <circle cx="0" cy="-36" r="6" fill="#fff" />
          <circle cx="-14" cy="-54" r="8" fill="#fff" opacity="0.6" />
        </g>
      </g>
      <Notes x={30} y={-90} texts={["Boing!"]} colour="#ffd43b" size={24} />
    </>
  );
}

/** The red bucket: it tips over, the sand pours out, and it stands up again. */
export function Eimer() {
  return (
    <>
      <Puffs className="sp-eimer-sand" spots={[[58, -14], [80, -8], [70, -28], [96, -18]]} r={11} fill={SAND} />
      <g className="sp-eimer-tip" style={{ transformOrigin: "40px 0px" }}>
        <path d="M-40 -86 H40 L32 -4 Q32 0 26 0 H-26 Q-32 0 -32 -4 Z" fill="#e63946" />
        <ellipse cx="0" cy="-86" rx="40" ry="10" fill="#c92a3a" />
        <ellipse cx="0" cy="-84" rx="32" ry="6" fill={SAND} />
        <path d="M-36 -60 H36" stroke="#ff8787" strokeWidth="5" />
        <path d="M-30 -36 Q-30 -60 -22 -76" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.4" />
        <path d="M-38 -80 Q0 -140 38 -80" stroke="#ffd43b" strokeWidth="5" fill="none" />
      </g>
    </>
  );
}

// Sand moulds: [x, colour, shape].
const MOULDS = [
  [-60, "#4dabf7", "star"],
  [0, "#40c057", "fish"],
  [60, "#be4bdb", "heart"],
] as const;

function mouldPath(shape: string, x: number, y: number, r: number) {
  if (shape === "star") {
    return (
      "M" +
      Array.from({ length: 10 }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const d = i % 2 ? r * 0.5 : r;
        return `${(x + d * Math.cos(a)).toFixed(1)} ${(y + d * Math.sin(a)).toFixed(1)}`;
      }).join(" L") +
      " Z"
    );
  }
  if (shape === "fish") return `M${x - r} ${y} Q${x - r * 0.2} ${y - r} ${x + r * 0.5} ${y} Q${x - r * 0.2} ${y + r} ${x - r} ${y} Z M${x + r * 0.4} ${y} L${x + r} ${y - r * 0.6} V${y + r * 0.6} Z`;
  return `M${x} ${y + r * 0.8} C${x - r * 1.5} ${y - r * 0.2} ${x - r * 0.6} ${y - r * 1.2} ${x} ${y - r * 0.4} C${x + r * 0.6} ${y - r * 1.2} ${x + r * 1.5} ${y - r * 0.2} ${x} ${y + r * 0.8} Z`;
}

/** Three sand moulds upside down: one after the other they lift and a sand cake appears below. */
export function Foermchen() {
  return (
    <>
      {MOULDS.map(([x, colour, shape], i) => (
        <g key={x} style={nth(i)}>
          <path className="sp-form-cake" d={mouldPath(shape, x, -22, 22)} fill={SAND_DARK} style={nth(i)} />
          <g className="sp-form-mould" style={nth(i)}>
            <path d={mouldPath(shape, x, -22, 24)} fill={colour} />
            <path d={mouldPath(shape, x - 3, -25, 10)} fill="#fff" opacity="0.35" />
          </g>
        </g>
      ))}
      <Sparkles className="sp-form-sparkle" spots={[[-60, -60], [0, -60], [60, -60]]} r={9} fill="#fff9db" />
    </>
  );
}

/** The sand castle: the flag waves, the gate opens and a little crab peeks out, sand trickles from a tower. */
export function Sandburg() {
  return (
    <>
      <path d="M-100 0 Q-100 -20 -80 -24 H80 Q100 -20 100 0 Z" fill={SAND_DARK} />
      {/* Towers and wall */}
      <rect x="-72" y="-110" width="44" height="90" fill={SAND} />
      <rect x="28" y="-110" width="44" height="90" fill={SAND} />
      <rect x="-30" y="-80" width="60" height="60" fill={SAND} />
      <rect x="-22" y="-154" width="44" height="80" fill="#f4d58d" />
      {[-72, -58, -44, 28, 42, 56].map((x) => (
        <rect key={x} x={x} y="-122" width="12" height="14" fill={SAND} />
      ))}
      {[-22, -6, 10].map((x) => (
        <rect key={x} x={x} y="-166" width="12" height="14" fill="#f4d58d" />
      ))}
      <path d="M-66 -70 h30 M34 -80 h30 M-16 -120 h30" stroke={SAND_DARK} strokeWidth="3" />
      <circle cx="-50" cy="-86" r="5" fill="#fff" />
      <circle cx="50" cy="-50" r="4" fill="#4dabf7" />
      {/* The crab behind the gate */}
      <g className="sp-burg-crab">
        <ellipse cx="0" cy="-30" rx="15" ry="10" fill="#ff6b6b" />
        <path d="M-14 -34 l-8 -8 M14 -34 l8 -8" stroke="#ff6b6b" strokeWidth="5" strokeLinecap="round" />
        <circle cx="-5" cy="-40" r="3" fill="#fff" />
        <circle cx="5" cy="-40" r="3" fill="#fff" />
        <circle cx="-5" cy="-40" r="1.5" fill={INK} />
        <circle cx="5" cy="-40" r="1.5" fill={INK} />
      </g>
      <g className="sp-burg-gate" style={{ transformOrigin: "-14px -20px" }}>
        <path d="M-14 -20 V-44 Q0 -60 14 -44 V-20 Z" fill="#a0673a" />
        <path d="M-6 -22 V-46 M6 -22 V-46" stroke="#8d5a2b" strokeWidth="2" />
      </g>
      {/* Flag on the middle tower */}
      <path d="M0 -166 V-206" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
      <g className="sp-burg-flag" style={{ transformOrigin: "0px -204px" }}>
        <path d="M0 -206 Q16 -212 32 -202 Q22 -196 32 -188 Q16 -194 0 -190 Z" fill="#e63946" />
      </g>
      <Puffs className="sp-burg-sand" spots={[[-62, -124], [-56, -140], [48, -124]]} r={6} fill={SAND_DARK} />
    </>
  );
}

/** The yellow toy digger: its arm digs into the sand and lifts it, the wheels turn a little. */
export function Bagger() {
  return (
    <>
      <Puffs className="sp-bagger-sand" spots={[[118, -18], [134, -30], [104, -32]]} r={8} fill={SAND} />
      <g className="sp-bagger-body">
        <rect x="-70" y="-56" width="104" height="30" rx="8" fill="#fab005" />
        <rect x="-60" y="-104" width="52" height="52" rx="10" fill="#ffd43b" />
        <rect x="-52" y="-96" width="36" height="28" rx="5" fill="#d0ebff" />
        <path d="M-44 -94 l10 0 l-8 24 l-10 0 Z" fill="#fff" opacity="0.6" />
        <rect x="-74" y="-30" width="114" height="10" rx="5" fill="#495057" />
        <g className="sp-bagger-wheel" style={{ transformOrigin: "-48px -16px" }}>
          <Wheel cx={-48} cy={-16} r={16} />
        </g>
        <g className="sp-bagger-wheel" style={{ transformOrigin: "16px -16px" }}>
          <Wheel cx={16} cy={-16} r={16} />
        </g>
        <g className="sp-bagger-arm" style={{ transformOrigin: "20px -60px" }}>
          <path d="M20 -60 L74 -100 L112 -52" stroke="#f59f00" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <g className="sp-bagger-bucket" style={{ transformOrigin: "112px -52px" }}>
            <path d="M104 -58 Q140 -56 132 -22 L104 -22 Q96 -40 104 -58 Z" fill="#e8590c" />
            <ellipse cx="118" cy="-50" rx="12" ry="5" fill={SAND} />
          </g>
          <circle cx="74" cy="-100" r="6" fill={INK} />
          <circle cx="20" cy="-60" r="7" fill={INK} />
        </g>
      </g>
      <Notes x={-90} y={-120} texts={["Brumm!"]} colour="#ffd43b" size={22} />
    </>
  );
}

/** The water pump: the handle goes up and down, water gushes into the little stream and splashes. */
export function Pumpe() {
  return (
    <>
      {/* Water that only flows while pumping */}
      <path className="sp-pumpe-water" d="M50 -106 Q72 -100 76 -60 Q78 -30 74 -10 H60 Q66 -40 60 -70 Q56 -90 44 -96 Z" fill="#74c0fc" opacity="0.85" />
      <g className="sp-pumpe-drops" fill="#4dabf7">
        {[
          [70, -14],
          [88, -22],
          [56, -20],
          [100, -12],
        ].map(([cx, cy], i) => (
          <path key={i} d={`M${cx} ${cy - 8} Q${cx + 6} ${cy} ${cx} ${cy + 4} Q${cx - 6} ${cy} ${cx} ${cy - 8} Z`} style={nth(i)} />
        ))}
      </g>
      <rect x="-26" y="-12" width="52" height="12" rx="4" fill="#868e96" />
      <rect x="-18" y="-140" width="36" height="130" rx="10" fill="#2f9e44" />
      <rect x="-12" y="-136" width="8" height="122" rx="4" fill="#51cf66" opacity="0.6" />
      <path d="M18 -110 H44 Q54 -110 54 -100" stroke="#2b8a3e" strokeWidth="12" strokeLinecap="round" fill="none" />
      <ellipse cx="0" cy="-142" rx="22" ry="8" fill="#2b8a3e" />
      <circle cx="0" cy="-152" r="8" fill="#ffd43b" />
      <g className="sp-pumpe-handle" style={{ transformOrigin: "-14px -136px" }}>
        <path d="M-14 -136 L-90 -170" stroke="#495057" strokeWidth="10" strokeLinecap="round" />
        <rect x="-108" y="-182" width="30" height="20" rx="8" fill="#e63946" transform="rotate(24 -93 -172)" />
      </g>
      <circle cx="-14" cy="-136" r="6" fill={INK} />
      <Notes x={70} y={-130} texts={["Platsch!"]} colour="#a5d8ff" size={22} />
    </>
  );
}
