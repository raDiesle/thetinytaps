import { Eye, INK, nth } from "../shared";

// Animals around the playground. Foot point at (0, 0), except the squirrel
// (in the tree's coordinates) and the butterfly (in the flower bed's).

/** A sitting dog by the fence: wags, barks and pricks up its ears. */
export function Hund() {
  return (
    <g className="sp-hund-body" style={{ transformOrigin: "0px 0px" }}>
      <path className="sp-hund-tail" d="M30 -14 Q62 -18 60 -46" stroke="#8d5a2b" strokeWidth="10" strokeLinecap="round" fill="none" style={{ transformOrigin: "30px -14px" }} />
      <ellipse cx="8" cy="-40" rx="34" ry="40" fill="#bc6c25" />
      <ellipse cx="-6" cy="-36" rx="16" ry="28" fill="#f4d58d" />
      <ellipse cx="-14" cy="-4" rx="12" ry="7" fill="#f4d58d" />
      <ellipse cx="14" cy="-4" rx="12" ry="7" fill="#f4d58d" />
      <path d="M-24 -74 Q-4 -66 20 -76" stroke="#3a86ff" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="-2" cy="-66" r="5" fill="#ffd60a" />
      <g className="sp-hund-head" style={{ transformOrigin: "-4px -80px" }}>
        <path className="sp-hund-ear" d="M8 -122 Q30 -116 22 -86 Q10 -96 4 -114 Z" fill="#6f4518" style={{ transformOrigin: "8px -118px" }} />
        <circle cx="-8" cy="-104" r="26" fill="#bc6c25" />
        <ellipse cx="-30" cy="-94" rx="16" ry="12" fill="#f4d58d" />
        <ellipse cx="-44" cy="-100" rx="6" ry="5" fill={INK} />
        <circle cx="-46" cy="-102" r="1.6" fill="#fff" />
        <Eye cx={-16} cy={-110} r={3.6} />
        <path className="sp-hund-ear2" d="M-20 -126 Q-36 -132 -40 -112 Q-30 -112 -18 -118 Z" fill="#6f4518" style={{ transformOrigin: "-20px -124px" }} />
        <path d="M-40 -88 Q-34 -82 -26 -86" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse className="sp-hund-tongue" cx="-33" cy="-80" rx="5" ry="7" fill="#ff5d73" style={{ transformOrigin: "-33px -86px" }} />
        <g className="sp-hund-bark" fill="none" stroke="#bc6c25" strokeWidth="4" strokeLinecap="round">
          <path d="M-58 -116 l-10 -6 M-60 -102 h-12 M-58 -88 l-10 6" />
        </g>
      </g>
    </g>
  );
}

/** A tabby cat on top of the fence: arches its back, the tail goes up, it blinks. */
export function Katze() {
  return (
    <g className="sp-katze-body" style={{ transformOrigin: "0px 0px" }}>
      <path className="sp-katze-tail" d="M26 -10 Q52 -6 50 -40" stroke="#f4a261" strokeWidth="8" strokeLinecap="round" fill="none" style={{ transformOrigin: "26px -10px" }} />
      <g className="sp-katze-back" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="6" cy="-20" rx="30" ry="20" fill="#f4a261" />
        <path d="M-6 -36 l4 10 M8 -38 v10 M20 -36 l-3 10" stroke="#e76f51" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g className="sp-katze-head" style={{ transformOrigin: "-20px -30px" }}>
        <path d="M-38 -54 L-36 -74 L-26 -60 Z M-12 -56 L-12 -76 L-22 -62 Z" fill="#f4a261" />
        <path d="M-35 -58 L-34 -68 L-29 -61 Z M-14 -60 L-14 -70 L-19 -63 Z" fill="#ffb3c1" />
        <circle cx="-24" cy="-46" r="16" fill="#f4a261" />
        <ellipse cx="-24" cy="-40" rx="8" ry="5" fill="#fff3e6" />
        <Eye cx={-30} cy={-48} r={2.6} />
        <Eye cx={-18} cy={-48} r={2.6} />
        <g className="sp-katze-lids" fill="#f4a261">
          <circle cx="-30" cy="-48" r="3.6" />
          <circle cx="-18" cy="-48" r="3.6" />
        </g>
        <path d="M-26.5 -43 H-21.5 L-24 -40.5 Z" fill="#ff8fa3" />
        <path d="M-44 -42 H-33 M-15 -42 H-4" stroke="#6c757d" strokeWidth="1.3" />
      </g>
      <ellipse cx="-14" cy="-2" rx="7" ry="4" fill="#fff3e6" />
      <ellipse cx="2" cy="-2" rx="7" ry="4" fill="#fff3e6" />
    </g>
  );
}

/** Squirrel on the tree trunk, in the tree's coordinates: it climbs up, grabs a nut and comes back. */
export function Eichhoernchen() {
  return (
    <g className="sp-hoernchen-climb">
      <path className="sp-hoernchen-tail" d="M28 -86 Q56 -94 50 -128 Q40 -146 30 -130 Q44 -110 26 -96 Z" fill="#bc6c25" style={{ transformOrigin: "28px -90px" }} />
      <ellipse cx="18" cy="-98" rx="12" ry="16" fill="#d68c45" />
      <ellipse cx="14" cy="-94" rx="6" ry="10" fill="#f4d58d" />
      <circle cx="14" cy="-120" r="10" fill="#d68c45" />
      <path d="M10 -128 l-2 -8 l7 4 Z M18 -128 l2 -8 l3 7 Z" fill="#d68c45" />
      <Eye cx={10} cy={-122} r={2} />
      <circle cx="5" cy="-118" r="1.8" fill={INK} />
      <g className="sp-hoernchen-nut">
        <ellipse cx="6" cy="-104" rx="5" ry="6" fill="#8d5a2b" />
        <path d="M2 -108 Q6 -112 10 -108" stroke="#6f4518" strokeWidth="2" fill="none" />
      </g>
    </g>
  );
}

function Bird({ x, y, fill, i }: { x: number; y: number; fill: string; i: number }) {
  return (
    <g className="sp-vg-bird" style={nth(i)}>
      <ellipse cx={x} cy={y} rx="16" ry="10" fill={fill} />
      <path d={`M${x - 14} ${y - 2} L${x - 28} ${y - 8} L${x - 24} ${y + 4} Z`} fill={fill} />
      <circle cx={x + 14} cy={y - 6} r="8" fill={fill} />
      <circle cx={x + 16} cy={y - 8} r="1.8" fill={INK} />
      <path d={`M${x + 21} ${y - 7} L${x + 28} ${y - 4} L${x + 21} ${y - 2} Z`} fill="#ffb703" />
      <path className="sp-vg-wing" d={`M${x - 6} ${y - 4} Q${x} ${y - 30} ${x + 8} ${y - 6} Z`} fill="#fff" opacity="0.85" style={{ transformOrigin: `${x}px ${y - 4}px` }} />
    </g>
  );
}

/** Three little birds flying together; they flap and do a loop. */
export function Voegel() {
  return (
    <g className="sp-vg-flock" style={{ transformOrigin: "40px 0px" }}>
      <Bird x={0} y={0} fill="#4895ef" i={0} />
      <Bird x={56} y={-26} fill="#ef476f" i={1} />
      <Bird x={76} y={22} fill="#ffb703" i={2} />
    </g>
  );
}

/** Snail: it crawls a bit, stretches its feelers and leaves a shiny trail. */
export function Schnecke() {
  return (
    <g className="sp-schnecke-crawl">
      <path className="sp-schnecke-trail" d="M-70 -2 H-30" stroke="#ced4da" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M-34 0 Q-36 -14 -16 -14 H22 Q38 -14 40 -30 Q46 -40 52 -30 Q56 -6 40 0 Z" fill="#ffc8a2" />
      <g className="sp-schnecke-feelers" style={{ transformOrigin: "46px -34px" }}>
        <path d="M42 -34 L36 -54 M50 -34 L56 -54" stroke="#ffc8a2" strokeWidth="4" strokeLinecap="round" />
        <circle cx="36" cy="-56" r="4" fill={INK} />
        <circle cx="56" cy="-56" r="4" fill={INK} />
      </g>
      <circle cx="48" cy="-24" r="1.6" fill={INK} />
      <g className="sp-schnecke-shell" style={{ transformOrigin: "0px -14px" }}>
        <circle cx="2" cy="-34" r="26" fill="#9d4edd" />
        <path d="M2 -34 m-4 0 a4 4 0 1 1 8 0 a8 8 0 1 1 -16 0 a12 12 0 1 1 24 0 a16 16 0 1 1 -32 0" stroke="#c77dff" strokeWidth="4" fill="none" />
        <circle cx="-8" cy="-48" r="5" fill="#fff" opacity="0.5" />
      </g>
    </g>
  );
}

/** Ladybird: she lifts her wing cases, flies a loop and lands again. */
export function Marienkaefer() {
  return (
    <g className="sp-kaefer-body">
      <g className="sp-kaefer-wings" fill="#dee2e6" opacity="0.8">
        <ellipse cx="-12" cy="-22" rx="12" ry="7" />
        <ellipse cx="12" cy="-22" rx="12" ry="7" />
      </g>
      <circle cx="16" cy="-10" r="8" fill="#2b2d42" />
      <circle cx="19" cy="-12" r="1.6" fill="#fff" />
      <g className="sp-kaefer-left" style={{ transformOrigin: "0px -24px" }}>
        <path d="M0 -24 A14 14 0 0 0 0 4 Z" fill="#e63946" />
        <circle cx="-6" cy="-16" r="3" fill="#2b2d42" />
        <circle cx="-7" cy="-4" r="2.5" fill="#2b2d42" />
      </g>
      <g className="sp-kaefer-right" style={{ transformOrigin: "0px -24px" }}>
        <path d="M0 -24 A14 14 0 0 1 0 4 Z" fill="#e63946" />
        <circle cx="6" cy="-14" r="2.5" fill="#2b2d42" />
        <circle cx="7" cy="-3" r="3" fill="#2b2d42" />
      </g>
      <path d="M0 -24 V4" stroke="#2b2d42" strokeWidth="1.5" />
    </g>
  );
}

/** Butterfly above the flower bed, in the bed's coordinates; it flutters from flower to flower. */
export function Schmetterling() {
  return (
    <g className="sp-falter-fly">
      <g className="sp-falter-wings" style={{ transformOrigin: "40px -140px" }}>
        <path d="M40 -140 Q16 -170 14 -148 Q12 -132 40 -140 Z" fill="#ff8fab" />
        <path d="M40 -140 Q64 -170 66 -148 Q68 -132 40 -140 Z" fill="#ff8fab" />
        <path d="M40 -140 Q22 -130 26 -118 Q36 -116 40 -140 Z" fill="#ffd60a" />
        <path d="M40 -140 Q58 -130 54 -118 Q44 -116 40 -140 Z" fill="#ffd60a" />
        <circle cx="24" cy="-150" r="3" fill="#fff" />
        <circle cx="56" cy="-150" r="3" fill="#fff" />
      </g>
      <ellipse cx="40" cy="-138" rx="3" ry="12" fill={INK} />
      <path d="M38 -150 q-4 -10 -10 -12 M42 -150 q4 -10 10 -12" stroke={INK} strokeWidth="1.5" fill="none" />
    </g>
  );
}
