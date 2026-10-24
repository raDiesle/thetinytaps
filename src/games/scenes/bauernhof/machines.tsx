import { Inside, Pane, Rider, nth } from "../shared";

// Tractor, combine harvester and wheelbarrow. Foot point (on the ground below the
// middle) at (0, 0). The tractor drives right, the combine left.

/** A tyre with a deep tread; it turns around its centre. */
function Tyre({ cx, cy, r, hub = "#ffd166", className }: { cx: number; cy: number; r: number; hub?: string; className: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill="#2b2d42" />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke="#495057" strokeWidth="7" strokeDasharray="8 8" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill={hub} />
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#495057" />
      {[0, 120, 240].map((a) => (
        <circle key={a} cx={cx + r * 0.36 * Math.cos((a * Math.PI) / 180)} cy={cy + r * 0.36 * Math.sin((a * Math.PI) / 180)} r={r * 0.07} fill="#495057" />
      ))}
    </g>
  );
}

/** Red tractor, driving right; it rolls forward, bounces and puffs. */
export function Traktor() {
  return (
    <g className="bh-traktor-drive">
      <g className="bh-traktor-puffs" fill="#dee2e6">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={100} cy={-186} r={12 + i * 3} style={nth(i)} />
        ))}
      </g>
      <g className="bh-traktor-body">
        <rect x="94" y="-176" width="10" height="64" rx="3" fill="#495057" />
        <rect className="bh-traktor-cap" x="92" y="-181" width="14" height="5" rx="2" fill="#343a40" style={{ transformOrigin: "92px -178px" }} />
        <circle className="bh-traktor-beacon" cx="-48" cy="-246" r="20" fill="#ffd166" />
        <path d="M-58 -236 Q-58 -252 -48 -252 Q-38 -252 -38 -236 Z" fill="#ffb703" />
        <rect x="-118" y="-236" width="140" height="14" rx="5" fill="#9d0208" />
        <rect x="-112" y="-224" width="9" height="100" fill="#495057" />
        <rect x="6" y="-224" width="9" height="100" fill="#495057" />
        <Pane x={-103} y={-218} w={109} h={84} rx={4}>
          <g className="bh-driver">
            <Rider cx={-50} cy={-170} shirt="#3a86ff" cap="#2d6a4f" />
          </g>
        </Pane>
        <rect x="-124" y="-136" width="140" height="78" rx="10" fill="#e63946" />
        <path d="M0 -124 H128 Q146 -124 146 -104 V-58 H0 Z" fill="#e63946" />
        <path d="M6 -118 H126" stroke="#fff" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
        <rect x="134" y="-110" width="12" height="44" rx="3" fill="#9d0208" />
        <path d="M138 -104 V-72 M142 -104 V-72" stroke="#6a040f" strokeWidth="2" />
        <circle className="bh-traktor-beam" cx="142" cy="-118" r="18" fill="#fff4d6" />
        <circle cx="142" cy="-118" r="7" fill="#fff4d6" />
        <path d="M-6 -96 h16 M-6 -84 h16" stroke="#9d0208" strokeWidth="4" strokeLinecap="round" />
        <path d="M-132 -60 A70 70 0 0 1 12 -60" stroke="#9d0208" strokeWidth="14" fill="none" />
      </g>
      <Tyre cx={-60} cy={-60} r={60} className="bh-traktor-wheel" />
      <Tyre cx={98} cy={-36} r={36} className="bh-traktor-wheel" />
    </g>
  );
}

const CAB = "M-118 -250 H-34 V-176 H-118 Z";

/** Green combine harvester in the wheat field, driving left; the reel turns and grain pours out. */
export function Maehdrescher() {
  return (
    <g className="bh-drescher-body">
      <g className="bh-drescher-grain" fill="#ffd166">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={190} cy={-238} r={7} style={nth(i)} />
        ))}
      </g>
      <path d="M100 -200 L120 -244 H196" stroke="#2d6a4f" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="-24" y="-222" width="140" height="56" rx="8" fill="#40916c" />
      <path d="M-24 -222 H116" stroke="#ffd166" strokeWidth="6" />
      <rect x="-126" y="-176" width="280" height="124" rx="16" fill="#52b788" />
      <rect x="-126" y="-110" width="280" height="12" fill="#ffd166" />
      <path d="M-110 -168 H140" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
      <path d={CAB} fill="#bde0fe" />
      <Inside d={CAB}>
        <g className="bh-driver">
          <Rider cx={-76} cy={-212} shirt="#e76f51" cap="#ffb703" />
        </g>
      </Inside>
      <path d={CAB} stroke="#2d6a4f" strokeWidth="6" fill="none" />
      <path d="M-104 -246 h16 L-108 -180 h-8 Z" fill="#fff" opacity="0.5" />
      <rect x="-126" y="-262" width="100" height="14" rx="5" fill="#2d6a4f" />
      <circle className="bh-drescher-beacon" cx="-76" cy="-270" r="20" fill="#ffd166" />
      <path d="M-86 -262 Q-86 -278 -76 -278 Q-66 -278 -66 -262 Z" fill="#ffb703" />
      <g className="bh-drescher-straw" fill="#e9c46a">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={160} cy={-80 + i * 10} r={12 - i * 2} style={nth(i)} />
        ))}
      </g>
      {/* Header with the turning reel in front */}
      <path d="M-226 -20 L-214 -70 H-126 V-20 Z" fill="#ffd166" />
      <path d="M-220 -30 H-130 M-216 -46 H-130 M-212 -62 H-130" stroke="#e9b949" strokeWidth="4" />
      <path d="M-126 -60 L-180 -100" stroke="#2d6a4f" strokeWidth="8" strokeLinecap="round" />
      <g className="bh-drescher-reel" style={{ transformOrigin: "-180px -100px" }}>
        <circle cx="-180" cy="-100" r="40" fill="none" stroke="#e63946" strokeWidth="5" />
        {[0, 60, 120].map((a) => (
          <path key={a} d="M-220 -100 H-140" stroke="#e63946" strokeWidth="5" transform={`rotate(${a} -180 -100)`} />
        ))}
        <circle cx="-180" cy="-100" r="8" fill="#9d0208" />
      </g>
      <Tyre cx={-60} cy={-48} r={48} className="bh-drescher-wheel" />
      <Tyre cx={110} cy={-32} r={32} className="bh-drescher-wheel" />
    </g>
  );
}

/** Wheelbarrow with two pumpkins; it tips forward and the pumpkins hop. */
export function Schubkarre() {
  return (
    <g className="bh-karre-body" style={{ transformOrigin: "64px -22px" }}>
      <path d="M-30 -36 L-36 0 M10 -36 L16 0" stroke="#6c757d" strokeWidth="7" strokeLinecap="round" />
      <path d="M-96 -82 L60 -40" stroke="#8d5a2b" strokeWidth="8" strokeLinecap="round" />
      {[
        [-26, -84, 26],
        [16, -80, 22],
      ].map(([cx, cy, r], i) => (
        <g key={cx} className="bh-karre-pumpkin" style={nth(i)}>
          <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.82} fill="#f77f00" />
          <path
            d={`M${cx - r * 0.4} ${cy - r * 0.7} Q${cx - r * 0.55} ${cy} ${cx - r * 0.4} ${cy + r * 0.7} M${cx + r * 0.4} ${cy - r * 0.7} Q${cx + r * 0.55} ${cy} ${cx + r * 0.4} ${cy + r * 0.7}`}
            stroke="#d65f00"
            strokeWidth="3"
            fill="none"
          />
          <path d={`M${cx} ${cy - r * 0.8} q2 -10 8 -12`} stroke="#6a994e" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      ))}
      <path d="M-62 -70 H58 L40 -30 H-44 Z" fill="#4895ef" />
      <path d="M-58 -64 H54" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" />
      <path d="M-100 -84 h-14" stroke="#6b4423" strokeWidth="10" strokeLinecap="round" />
      <g className="bh-karre-wheel" style={{ transformOrigin: "64px -22px" }}>
        <circle cx="64" cy="-22" r="22" fill="#2b2d42" />
        <path d="M64 -40 V-4 M46 -22 H82" stroke="#495057" strokeWidth="4" />
        <circle cx="64" cy="-22" r="9" fill="#ced4da" />
      </g>
      <g className="bh-karre-dirt" fill="#b08968">
        {[0, 1].map((i) => (
          <circle key={i} cx={84 + i * 10} cy={-6} r={8} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}
