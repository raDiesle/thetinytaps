import { Hideout } from "../hideout";
import { CHEEK, Eye, INK, Inside, Pane, SKIN, heartPath, nth, sparklePath } from "../shared";
import { Lid, Notes, Puffs } from "../spielplatz/parts";
import { Blossom, Egg } from "./parts";

// Things in the Easter garden: the shed, the gate, the nest box, the wheelbarrow, the bird
// bath, the egg-painting table with the chocolate bunny, the flower pot, the watering can,
// the handcart and the garden gnome. Foot point at (0, 0).

function Sparkles({ className, spots, r = 10, fill = "#fff3bf" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={sparklePath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** A wheel with spokes that can turn around its centre. */
function SpokeWheel({ cx, cy, r, className, rim = "#495057", hub = "#ffd43b" }: { cx: number; cy: number; r: number; className: string; rim?: string; hub?: string }) {
  return (
    <g className={className} style={{ transformOrigin: `${cx}px ${cy}px` }}>
      <circle cx={cx} cy={cy} r={r} fill={rim} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="#f1f3f5" />
      <path d={`M${cx - r * 0.72} ${cy} H${cx + r * 0.72} M${cx} ${cy - r * 0.72} V${cy + r * 0.72}`} stroke={rim} strokeWidth={r * 0.14} />
      <circle cx={cx} cy={cy} r={r * 0.24} fill={hub} />
    </g>
  );
}

// ---------- Gartenhaus ----------

/** The garden shed: the door swings open (someone else is inside every time), the shutters close and open, the garland swings. */
export function Gartenhaus() {
  return (
    <>
      <rect x="-170" y="-222" width="340" height="222" fill="#a5d8ff" />
      <path d={Array.from({ length: 14 }, (_, i) => `M${-170 + (i + 1) * 24} -222 V0`).join(" ")} stroke="#8ec5f0" strokeWidth="3" />
      <rect x="140" y="-222" width="30" height="222" fill={INK} opacity="0.08" />
      <rect x="-176" y="-12" width="352" height="12" rx="3" fill="#ced4da" />
      {/* Roof with red tiles */}
      <path d="M-200 -206 L-150 -330 H150 L200 -206 Z" fill="#e8590c" />
      {[-300, -270, -240].map((y, i) => {
        const inset = 150 + ((y + 330) / 124) * 50;
        return <path key={y} d={`M${-inset} ${y} H${inset}`} stroke="#d9480f" strokeWidth="4" strokeDasharray={i % 2 ? "26 6" : "18 6"} />;
      })}
      <rect x="-156" y="-338" width="312" height="14" rx="6" fill="#c92a2a" />
      <rect x="-204" y="-212" width="408" height="12" rx="5" fill="#d9480f" />
      {/* Egg garland under the eaves */}
      <path d="M-180 -198 Q-90 -168 0 -196 Q90 -168 180 -198" stroke="#fff" strokeWidth="2.5" fill="none" />
      {[
        [-140, -186, "#ff8fab"],
        [-90, -180, "#ffd43b"],
        [-40, -186, "#74c0fc"],
        [40, -186, "#69db7c"],
        [90, -180, "#b197fc"],
        [140, -186, "#ffa94d"],
      ].map(([x, y, fill], i) => (
        <g key={i} className="os-haus-garland" style={{ ...nth(i), transformOrigin: `${x}px ${y}px` }}>
          <Egg cx={Number(x)} by={Number(y) + 26} w={18} h={24} fill={String(fill)} deco="#fff" pattern={i % 2 ? "dots" : "zigzag"} />
        </g>
      ))}
      {/* Door: dark inside, the hidden surprise, then the door on its left hinge */}
      <rect x="-142" y="-160" width="84" height="160" fill="#4a3b35" />
      <Hideout x={-142} y={-160} w={84} h={156} size={92} />
      <g className="os-haus-door" style={{ transformOrigin: "-142px -80px" }}>
        <rect x="-142" y="-160" width="84" height="160" rx="4" fill="#f4a261" />
        <path d="M-136 -150 L-64 -20 M-136 -150 H-64 M-136 -20 H-64" stroke="#e07a3f" strokeWidth="5" fill="none" />
        <path d={heartPath(-100, -112, 12)} fill="#4a3b35" />
        <circle cx="-68" cy="-78" r="5" fill="#ffd43b" />
      </g>
      <rect x="-148" y="-166" width="96" height="8" rx="3" fill="#74c0fc" />
      {/* Window with curtain and a lamp that goes on */}
      <Pane x={0} y={-160} w={110} h={76}>
        <rect className="os-haus-light" x="0" y="-160" width="110" height="76" fill="#ffe8a3" />
        <path d="M0 -160 H110 V-150 Q92 -134 74 -150 Q55 -134 36 -150 Q18 -134 0 -150 Z" fill="#ff8fab" />
      </Pane>
      <path d="M55 -160 V-84 M0 -122 H110" stroke="#fff" strokeWidth="5" />
      <rect x="-4" y="-164" width="118" height="84" rx="3" fill="none" stroke="#fff" strokeWidth="5" />
      <g className="os-haus-shutter-l" style={{ transformOrigin: "-4px -122px" }}>
        <rect x="-38" y="-164" width="34" height="84" rx="3" fill="#4dabf7" />
        <path d="M-32 -150 H-10 M-32 -136 H-10 M-32 -122 H-10 M-32 -108 H-10 M-32 -94 H-10" stroke="#339af0" strokeWidth="3" />
      </g>
      <g className="os-haus-shutter-r" style={{ transformOrigin: "114px -122px" }}>
        <rect x="114" y="-164" width="34" height="84" rx="3" fill="#4dabf7" />
        <path d="M120 -150 H142 M120 -136 H142 M120 -122 H142 M120 -108 H142 M120 -94 H142" stroke="#339af0" strokeWidth="3" />
      </g>
      {/* Flower box */}
      {[
        [8, -86, "#ff6b6b"],
        [32, -90, "#ffd43b"],
        [56, -86, "#f783ac"],
        [80, -90, "#ffd43b"],
        [102, -86, "#b197fc"],
      ].map(([x, y, fill], i) => (
        <Blossom key={i} x={Number(x)} y={Number(y)} r={11} fill={String(fill)} className="os-haus-flower" i={i} />
      ))}
      <rect x="-6" y="-80" width="122" height="18" rx="3" fill="#a0673d" />
      {/* A rake leaning against the wall */}
      <path d="M150 -4 L176 -180" stroke="#a47148" strokeWidth="6" strokeLinecap="round" />
      <path d="M160 -186 L194 -178 M164 -186 l-2 12 M172 -184 l-2 12 M180 -182 l-2 12 M188 -180 l-2 12" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

// ---------- Gartentor ----------

/** The garden gate in the picket fence, with an Easter wreath; it swings open and someone peeks in. */
export function Gartentor() {
  return (
    <>
      <Hideout x={-70} y={-130} w={140} h={128} size={100} />
      <g className="os-tor-gate" style={{ transformOrigin: "-70px -70px" }}>
        <rect x="-70" y="-106" width="140" height="10" fill="#e9ecef" />
        <rect x="-70" y="-40" width="140" height="10" fill="#e9ecef" />
        <path d="M-66 -40 L64 -100" stroke="#e9ecef" strokeWidth="8" />
        {[-62, -38, -14, 10, 34, 58].map((x) => (
          <path key={x} d={`M${x - 8} -6 V-118 L${x} -130 L${x + 8} -118 V-6 Z`} fill="#fff" />
        ))}
        {/* Easter wreath of twigs with little eggs */}
        <circle cx="0" cy="-72" r="26" fill="none" stroke="#a47148" strokeWidth="9" />
        <circle cx="0" cy="-72" r="26" fill="none" stroke="#8ce99a" strokeWidth="3" strokeDasharray="6 8" />
        {[
          [-22, -86, "#ff8fab"],
          [22, -84, "#ffd43b"],
          [-16, -50, "#74c0fc"],
          [18, -52, "#b197fc"],
        ].map(([x, y, fill], i) => (
          <Egg key={i} cx={Number(x)} by={Number(y) + 9} w={13} h={17} fill={String(fill)} />
        ))}
        <path d="M0 -46 L-10 -34 M0 -46 L10 -34" stroke="#ffd43b" strokeWidth="4" strokeLinecap="round" />
      </g>
      {[-80, 80].map((x) => (
        <g key={x}>
          <rect x={x - 10} y="-140" width="20" height="140" fill="#f8f9fa" />
          <rect x={x + 4} y="-140" width="6" height="140" fill="#dee2e6" />
          <circle cx={x} cy="-148" r="12" fill="#fff" />
        </g>
      ))}
    </>
  );
}

// ---------- Nistkasten ----------

const NK_HOLE = "M-14 -266 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 Z";

/** A blue nest box on a pole: a blue tit pops out of the hole and chirps. */
export function Nistkasten() {
  return (
    <>
      <rect x="-7" y="-224" width="14" height="224" fill="#a47148" />
      <rect x="-38" y="-306" width="76" height="92" rx="4" fill="#4dabf7" />
      <rect x="22" y="-306" width="16" height="92" fill="#339af0" />
      <path d={NK_HOLE} fill="#1d3557" />
      <Inside d={NK_HOLE}>
        <g className="os-nk-bird" style={{ transform: "translateY(30px)" }}>
          <circle cx="0" cy="-262" r="13" fill="#fff" />
          <path d="M-13 -264 Q0 -284 13 -264 Z" fill="#339af0" />
          <path d="M-13 -260 H13" stroke="#1d3557" strokeWidth="3" />
          <circle cx="-5" cy="-266" r="2.4" fill={INK} />
          <circle cx="5" cy="-266" r="2.4" fill={INK} />
          <path d="M-3 -260 L0 -255 L3 -260 Z" fill="#495057" />
          <rect x="-13" y="-250" width="26" height="14" fill="#ffd43b" />
        </g>
      </Inside>
      <rect x="-4" y="-246" width="8" height="18" rx="3" fill="#a47148" />
      <g className="os-nk-roof" style={{ transformOrigin: "-46px -306px" }}>
        <path d="M-50 -300 L0 -340 L50 -300 Z" fill="#e03131" />
        <path d="M-50 -300 L0 -340 L50 -300" stroke="#c92a2a" strokeWidth="6" strokeLinejoin="round" fill="none" />
      </g>
      <Notes x={20} y={-330} texts={["Zi-zi!"]} colour="#fff" size={22} />
    </>
  );
}

// ---------- Schubkarre ----------

/** The green wheelbarrow with soil and little flower pots: it tips up and rolls a bit. */
export function Schubkarre() {
  return (
    <g className="os-karre-body" style={{ transformOrigin: "80px -30px" }}>
      <path d="M-40 -46 L-48 0 M-10 -46 L-16 0" stroke="#495057" strokeWidth="7" strokeLinecap="round" />
      <path d="M-56 -78 L-136 -56" stroke="#495057" strokeWidth="8" strokeLinecap="round" />
      <rect x="-150" y="-62" width="22" height="12" rx="6" fill={INK} transform="rotate(-16 -139 -56)" />
      <ellipse cx="10" cy="-100" rx="84" ry="14" fill="#7f5539" />
      {[
        [-36, "#ff6b6b"],
        [10, "#b197fc"],
        [54, "#ffd43b"],
      ].map(([x, fill], i) => (
        <g key={i} className="os-karre-pot" style={{ ...nth(i), transformOrigin: `${x}px -100px` }}>
          <path d={`M${Number(x) - 14} -124 H${Number(x) + 14} L${Number(x) + 10} -100 H${Number(x) - 10} Z`} fill="#e07a5f" />
          <rect x={Number(x) - 16} y="-128" width="32" height="7" rx="2" fill="#d1603d" />
          <ellipse cx={Number(x) - 8} cy="-132" rx="8" ry="5" fill="#40916c" />
          <ellipse cx={Number(x) + 8} cy="-132" rx="8" ry="5" fill="#52b788" />
          <Blossom x={Number(x)} y={-140} r={11} fill={String(fill)} />
        </g>
      ))}
      <path d="M-76 -104 H98 L72 -42 H-52 Z" fill="#40c057" />
      <path d="M-66 -78 H88 L72 -42 H-52 Z" fill="#2f9e44" />
      <path d="M-80 -104 H102" stroke="#2f9e44" strokeWidth="7" strokeLinecap="round" />
      <path d="M72 -42 L80 -30" stroke="#495057" strokeWidth="6" />
      <SpokeWheel cx={80} cy={-30} r={30} className="os-karre-wheel" rim="#343a40" />
      <Puffs className="os-karre-dust" spots={[[40, -6], [110, -4], [130, -14]]} r={10} fill="#e9ecef" />
    </g>
  );
}

// ---------- Vogelbad ----------

/** A stone bird bath: the sparrow dips its head, splashes and shakes off the drops. */
export function Vogelbad() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="34" ry="8" fill="#adb5bd" />
      <path d="M-16 -4 L-10 -86 H10 L16 -4 Z" fill="#ced4da" />
      <path d="M6 -86 L10 -4 H16 L10 -86 Z" fill="#adb5bd" />
      <path d="M-64 -100 Q0 -50 64 -100 Z" fill="#ced4da" />
      <ellipse cx="0" cy="-100" rx="66" ry="13" fill="#e9ecef" />
      <ellipse cx="0" cy="-100" rx="54" ry="8" fill="#74c0fc" />
      <g className="os-bad-ripple" fill="none" stroke="#e7f5ff" strokeWidth="3">
        <ellipse cx="-10" cy="-100" rx="16" ry="4" style={nth(0)} />
        <ellipse cx="-10" cy="-100" rx="30" ry="6" style={nth(1)} />
      </g>
      <g className="os-spatz" style={{ transformOrigin: "40px -104px" }}>
        <path d="M58 -124 L76 -112 L60 -112 Z" fill="#7f5539" />
        <ellipse cx="44" cy="-122" rx="20" ry="15" fill="#b08968" />
        <ellipse cx="38" cy="-116" rx="12" ry="8" fill="#ede0d4" />
        <g className="os-spatz-wing" style={{ transformOrigin: "52px -128px" }}>
          <path d="M40 -128 Q58 -138 68 -120 Q52 -116 40 -128 Z" fill="#7f5539" />
        </g>
        <circle cx="26" cy="-136" r="12" fill="#9c6644" />
        <circle cx="24" cy="-134" r="7" fill="#ede0d4" />
        <Eye cx={22} cy={-139} r={2.4} />
        <path d="M14 -136 L4 -132 L14 -130 Z" fill="#495057" />
        <path d="M40 -108 V-100 M48 -108 V-100" stroke="#f08c00" strokeWidth="3" />
      </g>
      <Puffs className="os-bad-drop" spots={[[-30, -120], [-6, -130], [16, -124], [-44, -110], [6, -116]]} r={6} fill="#74c0fc" />
      <Notes x={-70} y={-150} texts={["Plitsch!"]} colour="#e7f5ff" size={22} />
    </>
  );
}

// ---------- Maltisch und Schokohase ----------

/** The garden table with the egg-painting things: the brush dips in the paint and paints the egg in its cup. */
export function Maltisch() {
  return (
    <>
      <path d="M-128 -136 L-120 0 M118 -136 L110 0" stroke="#c68b59" strokeWidth="12" strokeLinecap="round" />
      <path d="M-100 -136 L-96 -10 M92 -136 L88 -10" stroke="#a0673d" strokeWidth="9" strokeLinecap="round" />
      {/* Checked table cloth */}
      <rect x="-146" y="-158" width="292" height="20" rx="4" fill="#fff" />
      <path d="M-146 -138 H146 L140 -112 L124 -126 L108 -112 L92 -126 L76 -112 L60 -126 L44 -112 L28 -126 L12 -112 L-4 -126 L-20 -112 L-36 -126 L-52 -112 L-68 -126 L-84 -112 L-100 -126 L-116 -112 L-132 -126 L-140 -112 Z" fill="#fff" />
      <path d="M-130 -158 V-118 M-98 -158 V-118 M-66 -158 V-118 M-34 -158 V-118 M-2 -158 V-118 M30 -158 V-118 M62 -158 V-118 M94 -158 V-118 M126 -158 V-118 M-146 -148 H146 M-146 -128 H146" stroke="#a5d8ff" strokeWidth="8" opacity="0.8" />
      {/* Water jar */}
      <rect x="-128" y="-198" width="34" height="42" rx="6" fill="#d0ebff" opacity="0.9" />
      <rect x="-128" y="-182" width="34" height="26" rx="5" fill="#a5d8ff" />
      {/* Paint pots */}
      {[
        [-76, "#ff6b6b"],
        [-50, "#ffd43b"],
        [-24, "#4dabf7"],
      ].map(([x, fill]) => (
        <g key={x}>
          <rect x={Number(x) - 11} y="-174" width="22" height="18" rx="4" fill="#f1f3f5" />
          <ellipse cx={x} cy="-174" rx="11" ry="4" fill={String(fill)} />
        </g>
      ))}
      {/* Egg cup with the egg that gets painted */}
      <path d="M2 -158 H34 L28 -170 Q18 -176 8 -170 Z" fill="#ffd43b" />
      <g className="os-mal-egg" style={{ transformOrigin: "18px -166px" }}>
        <Egg cx={18} by={-166} w={34} h={44} fill="#fff8e7" />
        <Inside d="M1 -190 Q2 -210 18 -210 Q34 -210 35 -190 Q36 -166 18 -166 Q0 -166 1 -190 Z">
          <rect className="os-mal-paint" x="0" y="-202" width="36" height="7" fill="#ff6b6b" style={nth(0)} />
          <rect className="os-mal-paint" x="0" y="-190" width="36" height="7" fill="#ffd43b" style={nth(1)} />
          <rect className="os-mal-paint" x="0" y="-178" width="36" height="7" fill="#4dabf7" style={nth(2)} />
        </Inside>
      </g>
      {/* A finished egg lying next to it */}
      <g transform="rotate(80 56 -166)">
        <Egg cx={56} by={-150} w={24} h={32} fill="#b197fc" deco="#fff" pattern="dots" />
      </g>
      {/* The brush: stands in the jar and goes over to the egg */}
      <g className="os-mal-brush" style={{ transformOrigin: "-110px -176px" }}>
        <path d="M-110 -176 L-104 -238" stroke="#ffd43b" strokeWidth="6" strokeLinecap="round" />
        <path d="M-110 -176 L-109 -188" stroke="#868e96" strokeWidth="7" />
        <path d="M-114 -176 Q-111 -164 -108 -176 Z" fill="#e03131" />
      </g>
      <Sparkles className="os-mal-spark" spots={[[-6, -214], [44, -204], [18, -232]]} r={9} />
      <Notes x={-140} y={-230} texts={["Bunt!"]} colour="#ff8fab" size={24} />
    </>
  );
}

/** A chocolate bunny in golden foil with a red ribbon and a little bell, sitting on the table. */
export function Schokohase() {
  return (
    <>
      <g className="os-schoko-body" style={{ transformOrigin: "98px -158px" }}>
        <ellipse cx="86" cy="-268" rx="8" ry="24" fill="#f4c430" transform="rotate(-10 86 -268)" />
        <ellipse cx="108" cy="-268" rx="8" ry="24" fill="#e0ad1c" transform="rotate(10 108 -268)" />
        <ellipse cx="98" cy="-190" rx="32" ry="34" fill="#f4c430" />
        <path d="M112 -220 Q132 -190 120 -160 Q128 -190 110 -214 Z" fill="#d4a017" />
        <circle cx="96" cy="-232" r="22" fill="#f4c430" />
        <path d="M80 -244 Q84 -252 92 -250 M86 -206 Q80 -190 84 -172" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.7" fill="none" />
        <path d="M100 -216 l6 6 M74 -196 l5 -3 M112 -180 l6 2 M90 -176 l-4 6" stroke="#d4a017" strokeWidth="2" strokeLinecap="round" />
        <circle cx="89" cy="-234" r="3" fill="#7f4f24" />
        <circle cx="103" cy="-234" r="3" fill="#7f4f24" />
        <path d="M91 -224 q5 4 10 0" stroke="#7f4f24" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <ellipse cx="96" cy="-228" rx="3" ry="2" fill="#c92a2a" />
        <ellipse cx="98" cy="-160" rx="34" ry="5" fill="#d4a017" />
        {/* Ribbon and bell */}
        <path d="M76 -214 Q96 -204 118 -214" stroke="#e03131" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M110 -212 l10 -10 l2 14 Z M110 -212 l14 4 l-10 8 Z" fill="#e03131" />
        <g className="os-schoko-bell" style={{ transformOrigin: "96px -207px" }}>
          <path d="M89 -194 Q89 -208 96 -208 Q103 -208 103 -194 Z" fill="#ffd43b" stroke="#f59f00" strokeWidth="2" />
          <circle cx="96" cy="-192" r="2.5" fill="#f59f00" />
        </g>
      </g>
      <Sparkles className="os-schoko-spark" spots={[[60, -270], [134, -250], [140, -186], [58, -196]]} r={10} />
    </>
  );
}

// ---------- Blumentopf ----------

/** A clay pot with primroses: it rocks and the flowers nod. The blue egg leans behind it. */
export function Blumentopf() {
  return (
    <g className="os-topf-body" style={{ transformOrigin: "0px 0px" }}>
      {[
        [-26, -90, 20],
        [24, -92, 18],
        [-6, -104, 22],
        [-36, -76, 14],
        [36, -76, 14],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} fill={i % 2 ? "#40916c" : "#52b788"} transform={`rotate(${x / 2} ${x} ${y})`} />
      ))}
      {[
        [-26, -110, "#9775fa"],
        [0, -124, "#ffd43b"],
        [26, -108, "#f783ac"],
        [-12, -96, "#ff6b6b"],
        [16, -92, "#fff"],
      ].map(([x, y, fill], i) => (
        <Blossom key={i} x={Number(x)} y={Number(y)} r={15} fill={String(fill)} className="os-topf-flower" i={i} />
      ))}
      <path d="M-40 -70 H40 L30 0 H-30 Z" fill="#e07a5f" />
      <path d="M18 -70 H40 L30 0 H14 Z" fill="#c8553d" opacity="0.5" />
      <rect x="-46" y="-82" width="92" height="16" rx="4" fill="#d1603d" />
      <path d={heartPath(-6, -36, 10)} fill="#ffd8a8" />
    </g>
  );
}

// ---------- Gießkanne ----------

/** The green watering can: it tips forward and water drips from the rose. */
export function Giesskanne() {
  return (
    <>
      <g className="os-kanne-body" style={{ transformOrigin: "44px 0px" }}>
        <path d="M-60 -40 Q-82 -74 -50 -96" stroke="#2f9e44" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M-44 -112 Q0 -150 40 -112" stroke="#2f9e44" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M30 -40 L108 -100" stroke="#40c057" strokeWidth="14" strokeLinecap="round" />
        <g transform="rotate(-38 112 -104)">
          <rect x="100" y="-122" width="24" height="36" rx="8" fill="#2f9e44" />
          <ellipse cx="124" cy="-104" rx="6" ry="18" fill="#69db7c" />
          <g fill="#2b8a3e">
            <circle cx="125" cy="-112" r="1.8" />
            <circle cx="125" cy="-104" r="1.8" />
            <circle cx="125" cy="-96" r="1.8" />
          </g>
        </g>
        <rect x="-56" y="-114" width="100" height="114" rx="16" fill="#51cf66" />
        <rect x="14" y="-114" width="30" height="114" rx="12" fill="#40c057" />
        <ellipse cx="-6" cy="-112" rx="44" ry="8" fill="#2f9e44" />
        <path d="M-40 -90 V-20" stroke="#fff" strokeOpacity="0.5" strokeWidth="8" strokeLinecap="round" />
        <path d={heartPath(-6, -60, 12)} fill="#ffd43b" />
      </g>
      <g className="os-kanne-drop" fill="#4dabf7">
        {[
          [150, -50],
          [158, -30],
          [142, -20],
          [166, -10],
          [150, 0],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 10} Q${x + 6} ${y} ${x} ${y + 4} Q${x - 6} ${y} ${x} ${y - 10} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

// ---------- Bollerwagen ----------

/** The red handcart with a basket of eggs and a flower pot: it rolls forward and back. */
export function Bollerwagen() {
  return (
    <g className="os-boller-cart">
      <g className="os-boller-handle" style={{ transformOrigin: "-96px -58px" }}>
        <path d="M-96 -58 L-176 -120" stroke="#495057" strokeWidth="7" strokeLinecap="round" />
        <path d="M-190 -112 L-162 -128" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      </g>
      <g className="os-boller-load">
        <path d="M-80 -104 Q-50 -150 -20 -104" stroke="#a0673d" strokeWidth="6" fill="none" />
        <Egg cx={-64} by={-98} w={26} h={34} fill="#ff8fab" deco="#fff" pattern="dots" />
        <Egg cx={-40} by={-100} w={26} h={34} fill="#74c0fc" deco="#fff" pattern="zigzag" />
        <Egg cx={-52} by={-96} w={24} h={30} fill="#ffd43b" deco="#ff922b" pattern="stripes" />
        <rect x="-86" y="-110" width="72" height="20" rx="8" fill="#c68b59" />
        <path d="M-82 -100 H-18" stroke="#a0673d" strokeWidth="3" />
        <path d="M24 -104 H62 L56 -86 H30 Z" fill="#e07a5f" />
        <ellipse cx="34" cy="-112" rx="12" ry="7" fill="#52b788" />
        <ellipse cx="52" cy="-112" rx="12" ry="7" fill="#40916c" />
        <Blossom x={36} y={-124} r={12} fill="#f783ac" />
        <Blossom x={54} y={-128} r={12} fill="#ffd43b" />
      </g>
      <rect x="-100" y="-96" width="200" height="54" rx="8" fill="#e03131" />
      <rect x="-100" y="-96" width="200" height="10" rx="5" fill="#ff6b6b" />
      <path d="M-60 -86 V-46 M-20 -86 V-46 M20 -86 V-46 M60 -86 V-46" stroke="#c92a2a" strokeWidth="4" />
      <SpokeWheel cx={-60} cy={-30} r={30} className="os-boller-wheel" />
      <SpokeWheel cx={62} cy={-30} r={30} className="os-boller-wheel" />
    </g>
  );
}

// ---------- Gartenzwerg ----------

/** The garden gnome with an Easter egg: he yawns, stretches, and his hat wobbles. */
export function Gartenzwerg() {
  return (
    <>
      <ellipse cx="-14" cy="-4" rx="14" ry="8" fill="#343a40" />
      <ellipse cx="16" cy="-4" rx="14" ry="8" fill="#343a40" />
      <path d="M-34 -10 L-26 -96 H26 L34 -10 Z" fill="#4dabf7" />
      <rect x="-30" y="-50" width="60" height="9" fill="#7f5539" />
      <rect x="-7" y="-52" width="14" height="13" rx="2" fill="#ffd43b" />
      {/* The right arm holds a red egg */}
      <path d="M22 -86 L40 -58" stroke="#4dabf7" strokeWidth="12" strokeLinecap="round" />
      <Egg cx={44} by={-38} w={24} h={30} fill="#ff6b6b" deco="#fff" pattern="zigzag" />
      <circle cx="40" cy="-56" r="7" fill={SKIN} />
      <g className="os-zwerg-arm" style={{ transformOrigin: "-22px -86px" }}>
        <path d="M-22 -86 L-40 -58" stroke="#4dabf7" strokeWidth="12" strokeLinecap="round" />
        <circle cx="-41" cy="-55" r="7" fill={SKIN} />
      </g>
      <g className="os-zwerg-head" style={{ transformOrigin: "0px -96px" }}>
        <circle cx="0" cy="-114" r="22" fill={SKIN} />
        <path d="M-24 -110 Q-30 -70 0 -56 Q30 -70 24 -110 Q12 -96 0 -98 Q-12 -96 -24 -110 Z" fill="#f8f9fa" />
        <ellipse className="os-zwerg-mouth" cx="0" cy="-94" rx="7" ry="8" fill="#862e2e" style={{ transformOrigin: "0px -98px" }} />
        <circle cx="-8" cy="-118" r="3" fill={INK} />
        <circle cx="8" cy="-118" r="3" fill={INK} />
        <Lid cx={-8} cy={-118} r={3} fill={SKIN} />
        <Lid cx={8} cy={-118} r={3} fill={SKIN} />
        <circle cx="0" cy="-106" r="8" fill="#ffa8a8" />
        <circle cx="-14" cy="-108" r="4" fill={CHEEK} opacity="0.5" />
        <circle cx="14" cy="-108" r="4" fill={CHEEK} opacity="0.5" />
        <g className="os-zwerg-hat" style={{ transformOrigin: "0px -128px" }}>
          <path d="M-26 -124 Q-20 -170 6 -200 Q14 -206 16 -196 Q14 -160 26 -124 Z" fill="#e03131" />
          <path d="M-26 -126 Q0 -136 26 -126" stroke="#c92a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <Notes x={30} y={-170} texts={["Uaah!"]} colour="#fff" size={24} />
    </>
  );
}
