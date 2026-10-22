import { CHEEK, Eye, INK, nth } from "../shared";
import { Lid, Notes } from "./parts";

// Animals on the playground. The bird and the squirrel are drawn in the tree's coordinates,
// the cat in the tower's, the butterfly and the ladybird in the flower bed's; the others have
// their foot point at (0, 0).

/** The bird on the branch: it flaps, flies up in a loop and lands again, chirping. */
export function Vogel() {
  return (
    <g className="sp-vogel-fly" style={{ transformOrigin: "144px -204px" }}>
      <path d="M126 -224 L106 -230 L112 -218 Z" fill="#1971c2" />
      <ellipse cx="144" cy="-224" rx="24" ry="18" fill="#4dabf7" />
      <ellipse cx="148" cy="-218" rx="14" ry="10" fill="#d0ebff" />
      <circle cx="162" cy="-240" r="13" fill="#4dabf7" />
      <path d="M173 -242 L186 -238 L173 -234 Z" fill="#ffa94d" />
      <Eye cx={166} cy={-243} r={3} />
      <Lid cx={166} cy={-243} r={3} fill="#4dabf7" />
      <g className="sp-vogel-wing" style={{ transformOrigin: "140px -230px" }}>
        <path d="M140 -230 Q120 -250 112 -228 Q124 -216 140 -222 Z" fill="#1c7ed6" />
      </g>
      <path d="M140 -206 v6 M150 -206 v6" stroke="#ffa94d" strokeWidth="3" strokeLinecap="round" />
      <Notes x={176} y={-262} texts={["♪", "♫"]} colour="#fff" size={22} />
    </g>
  );
}

/** The squirrel on the trunk: it scurries up, flicks its bushy tail and nibbles a nut. */
export function Eichhoernchen() {
  return (
    <g className="sp-eich-climb">
      <g transform="translate(0 -40) scale(0.7)">
        <g className="sp-eich-tail" style={{ transformOrigin: "-6px -96px" }}>
          <path d="M-6 -96 Q-46 -90 -48 -130 Q-50 -170 -14 -170 Q-30 -150 -24 -128 Q-18 -108 -6 -104 Z" fill="#d9480f" />
          <path d="M-36 -150 Q-38 -132 -26 -118" stroke="#ff8a3d" strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
        <ellipse cx="4" cy="-116" rx="16" ry="24" fill="#e8590c" />
        <ellipse cx="8" cy="-112" rx="8" ry="15" fill="#ffd8a8" />
        <circle cx="6" cy="-146" r="14" fill="#e8590c" />
        <path d="M-2 -158 L-2 -170 L6 -160 Z M12 -158 L14 -170 L18 -158 Z" fill="#e8590c" />
        <Eye cx={11} cy={-148} r={2.6} />
        <Lid cx={11} cy={-148} r={2.6} fill="#e8590c" />
        <circle cx="19" cy="-143" r="2.4" fill={INK} />
        <g className="sp-eich-nut">
          <ellipse cx="22" cy="-128" rx="7" ry="8" fill="#a0673a" />
          <path d="M15 -132 Q22 -140 29 -132" fill="#6b4423" />
        </g>
        <path d="M-6 -96 l-6 10 M10 -94 l4 10" stroke="#d9480f" strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** The cat on the tower roof: it gets a fright, jumps up with its fur on end, then sits down and licks its paw. */
export function Katze() {
  return (
    <g className="sp-katze-jump" style={{ transformOrigin: "96px -318px" }}>
      <g className="sp-katze-tail" style={{ transformOrigin: "80px -326px" }}>
        <path d="M80 -326 Q50 -330 54 -364 Q58 -380 70 -376" stroke="#495057" strokeWidth="9" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="96" cy="-340" rx="22" ry="26" fill="#495057" />
      <ellipse cx="100" cy="-334" rx="11" ry="16" fill="#f1f3f5" />
      <path d="M86 -318 v6 M104 -318 v6" stroke="#495057" strokeWidth="8" strokeLinecap="round" />
      <g className="sp-katze-head" style={{ transformOrigin: "100px -360px" }}>
        <path d="M84 -374 L82 -396 L96 -382 Z M112 -374 L118 -396 L104 -382 Z" fill="#495057" />
        <path d="M86 -378 L85 -390 L93 -382 Z M112 -378 L115 -390 L107 -382 Z" fill="#ffc9c9" />
        <circle cx="100" cy="-370" r="19" fill="#495057" />
        <ellipse cx="94" cy="-372" rx="4" ry="5" fill="#ffd43b" />
        <ellipse cx="108" cy="-372" rx="4" ry="5" fill="#ffd43b" />
        <ellipse cx="94" cy="-372" rx="1.6" ry="4" fill={INK} />
        <ellipse cx="108" cy="-372" rx="1.6" ry="4" fill={INK} />
        <Lid cx={94} cy={-372} r={4.2} fill="#495057" />
        <Lid cx={108} cy={-372} r={4.2} fill="#495057" />
        <path d="M98 -364 h4 l-2 3 Z" fill="#ff8fa3" />
        <path d="M84 -364 h-12 M84 -360 h-11 M116 -364 h12 M116 -360 h11" stroke="#dee2e6" strokeWidth="1.5" />
      </g>
      <Notes x={124} y={-388} texts={["Miau!"]} colour="#fff" size={22} />
    </g>
  );
}

/** The dog: it jumps up, wags its tail, flaps its ears and barks. */
export function Hund() {
  return (
    <g className="sp-hund-jump" style={{ transformOrigin: "0px 0px" }}>
      <g className="sp-hund-tail" style={{ transformOrigin: "-54px -64px" }}>
        <path d="M-54 -64 Q-80 -80 -74 -110" stroke="#c9844a" strokeWidth="11" strokeLinecap="round" fill="none" />
      </g>
      <path d="M-44 -46 V-6 M-22 -46 V-6 M24 -46 V-6 M44 -46 V-6" stroke="#c9844a" strokeWidth="13" strokeLinecap="round" />
      <path d="M-50 -4 h12 M-28 -4 h12 M18 -4 h12 M38 -4 h12" stroke="#a0673a" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="0" cy="-60" rx="62" ry="28" fill="#dda15e" />
      <ellipse cx="-14" cy="-66" rx="20" ry="12" fill="#fefae0" opacity="0.6" />
      <path d="M40 -76 Q44 -66 52 -64" stroke="#e63946" strokeWidth="7" strokeLinecap="round" fill="none" />
      <g className="sp-hund-head" style={{ transformOrigin: "52px -80px" }}>
        <circle cx="66" cy="-100" r="30" fill="#dda15e" />
        <ellipse cx="88" cy="-90" rx="18" ry="13" fill="#fefae0" />
        <ellipse cx="102" cy="-96" rx="7" ry="5.5" fill={INK} />
        <path d="M86 -80 Q94 -74 102 -82" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        <path className="sp-hund-tongue" d="M92 -80 q2 14 8 12 q6 -2 2 -12 Z" fill="#ff8fa3" />
        <Eye cx={72} cy={-108} r={4} />
        <Lid cx={72} cy={-108} r={4} fill="#dda15e" />
        <circle cx="80" cy="-96" r="5" fill={CHEEK} opacity="0.4" />
        <g className="sp-hund-ear" style={{ transformOrigin: "52px -122px" }}>
          <path d="M52 -126 Q30 -122 34 -86 Q50 -96 60 -118 Z" fill="#a0673a" />
        </g>
      </g>
      <g className="sp-hund-bark" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round">
        <path d="M114 -110 q8 10 0 20" style={nth(0)} />
        <path d="M126 -118 q12 18 0 36" style={nth(1)} />
      </g>
      <Notes x={110} y={-130} texts={["Wau!"]} colour="#fff" size={24} />
    </g>
  );
}

/** One pigeon, facing right; `className` lets the two of them move differently. */
function Taube({ x, className }: { x: number; className: string }) {
  return (
    <g className={className}>
      <path d={`M${x - 34} -34 L${x - 54} -26 L${x - 34} -22 Z`} fill="#495057" />
      <ellipse cx={x - 8} cy="-32" rx="30" ry="20" fill="#adb5bd" />
      <path d={`M${x - 30} -38 Q${x - 6} -50 ${x + 10} -32 Q${x - 10} -22 ${x - 30} -38 Z`} fill="#868e96" />
      <path d={`M${x - 24} -32 h18 M${x - 20} -26 h16`} stroke="#495057" strokeWidth="3" strokeLinecap="round" />
      <path d={`M${x - 6} 0 v-12 M${x + 4} 0 v-12`} stroke="#ff8787" strokeWidth="3.5" strokeLinecap="round" />
      <g className="sp-taube-head" style={{ transformOrigin: `${x + 10}px -40px` }}>
        <path d={`M${x + 4} -46 Q${x + 18} -40 ${x + 14} -28 Q${x + 2} -30 ${x + 4} -46 Z`} fill="#63e6be" opacity="0.8" />
        <circle cx={x + 16} cy="-56" r="13" fill="#868e96" />
        <path d={`M${x + 27} -58 L${x + 37} -54 L${x + 27} -51 Z`} fill="#495057" />
        <circle cx={x + 26} cy="-58" r="2" fill="#fff" />
        <Eye cx={x + 20} cy={-59} r={2.6} />
        <Lid cx={x + 20} cy={-59} r={2.6} fill="#868e96" />
      </g>
    </g>
  );
}

/** Two pigeons on the path: they peck at crumbs, coo, and one flutters up and lands again. */
export function Tauben() {
  return (
    <>
      <g className="sp-tauben-crumbs" fill="#e9c46a">
        {[
          [44, -2],
          [58, 2],
          [100, -2],
          [116, 1],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" style={nth(i)} />
        ))}
      </g>
      <Taube x={10} className="sp-taube-a" />
      <g transform="translate(160 0) scale(-1 1)">
        <Taube x={0} className="sp-taube-b" />
      </g>
      <Notes x={20} y={-80} texts={["Gurr!"]} colour="#fff" size={22} />
    </>
  );
}

/** The snail: it stretches out, its eye stalks grow long and wiggle, its shell rocks. */
export function Schnecke() {
  return (
    <>
      <g className="sp-schnecke-body" style={{ transformOrigin: "-40px 0px" }}>
        <path d="M-56 0 Q-60 -14 -40 -16 H40 Q60 -16 66 -30 Q74 -20 70 -6 Q66 0 54 0 Z" fill="#ffd8a8" />
        <g className="sp-schnecke-eyes" style={{ transformOrigin: "62px -26px" }}>
          <path d="M62 -26 L56 -54 M66 -26 L76 -52" stroke="#ffd8a8" strokeWidth="5" strokeLinecap="round" />
          <circle cx="56" cy="-56" r="5" fill="#ffd8a8" />
          <circle cx="76" cy="-54" r="5" fill="#ffd8a8" />
          <circle cx="57" cy="-56" r="2.4" fill={INK} />
          <circle cx="77" cy="-54" r="2.4" fill={INK} />
        </g>
        <path d="M58 -18 q6 4 12 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <g className="sp-schnecke-shell" style={{ transformOrigin: "0px -16px" }}>
        <circle cx="0" cy="-46" r="34" fill="#e8590c" />
        <path d="M0 -46 m0 -6 a6 6 0 1 1 -6 6 a12 12 0 0 1 12 -12 a18 18 0 0 1 18 18 a24 24 0 0 1 -24 24 a30 30 0 0 1 -30 -30" stroke="#ffa94d" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="-12" cy="-64" r="6" fill="#fff" opacity="0.4" />
      </g>
    </>
  );
}

/** The butterfly above the flowers: it flaps its wings and flies a loop. */
export function Schmetterling() {
  return (
    <g className="sp-falter-fly" style={{ transformOrigin: "-40px -180px" }}>
      <g className="sp-falter-wings" style={{ transformOrigin: "-40px -180px" }}>
        <path d="M-40 -180 Q-76 -214 -80 -186 Q-82 -168 -40 -180 Z" fill="#cc5de8" />
        <path d="M-40 -180 Q-70 -170 -66 -152 Q-56 -144 -40 -180 Z" fill="#f783ac" />
        <path d="M-40 -180 Q-4 -214 0 -186 Q2 -168 -40 -180 Z" fill="#cc5de8" />
        <path d="M-40 -180 Q-10 -170 -14 -152 Q-24 -144 -40 -180 Z" fill="#f783ac" />
        <circle cx="-62" cy="-188" r="5" fill="#fff" opacity="0.7" />
        <circle cx="-18" cy="-188" r="5" fill="#fff" opacity="0.7" />
      </g>
      <ellipse cx="-40" cy="-176" rx="4" ry="14" fill={INK} />
      <path d="M-42 -190 q-6 -12 -12 -14 M-38 -190 q6 -12 12 -14" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** The ladybird on its leaf: it opens its red wing cases, buzzes up and lands again. */
export function Marienkaefer() {
  return (
    <g className="sp-kaefer-fly" style={{ transformOrigin: "164px -34px" }}>
      <g className="sp-kaefer-wings" fill="#e7f5ff" opacity="0.8">
        <ellipse cx="150" cy="-50" rx="12" ry="7" transform="rotate(-30 150 -50)" />
        <ellipse cx="178" cy="-50" rx="12" ry="7" transform="rotate(30 178 -50)" />
      </g>
      <circle cx="178" cy="-36" r="7" fill={INK} />
      <g className="sp-kaefer-case-l" style={{ transformOrigin: "164px -46px" }}>
        <path d="M164 -46 A14 14 0 0 0 150 -32 A14 12 0 0 0 164 -22 Z" fill="#e63946" />
        <circle cx="157" cy="-36" r="3" fill={INK} />
      </g>
      <g className="sp-kaefer-case-r" style={{ transformOrigin: "164px -46px" }}>
        <path d="M164 -46 A14 14 0 0 1 178 -32 A14 12 0 0 1 164 -22 Z" fill="#e63946" />
        <circle cx="171" cy="-32" r="3" fill={INK} />
      </g>
      <circle cx="181" cy="-38" r="1.6" fill="#fff" />
    </g>
  );
}
