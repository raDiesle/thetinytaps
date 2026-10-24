import { CHEEK, Eye, SKIN, nth, sparklePath } from "../shared";
import { Arm, Head, Leg, Lid, Notes } from "../spielplatz/parts";
import { Blades, Egg } from "./parts";

// The Easter bunny and the children looking for eggs. Foot point at (0, 0).

function Sparkles({ className, spots, r = 10, fill = "#fff3bf" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={sparklePath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

const FUR = "#c8a07a";
const LIGHT = "#fff4e6";

/** A wicker basket standing on (cx, by), w wide, with green grass and eggs: [x offset, colour, pattern]. */
function Basket({ cx, by, w, eggs }: { cx: number; by: number; w: number; eggs: [number, string, "dots" | "zigzag" | "stripes" | "waves" | "hearts"][] }) {
  const h = w * 0.5;
  return (
    <>
      <path d={`M${cx - w * 0.46} ${by - h} Q${cx} ${by - h * 2.5} ${cx + w * 0.46} ${by - h}`} stroke="#a0673d" strokeWidth={w * 0.07} fill="none" />
      <g transform={`translate(${cx} ${by - h + 2})`}>
        <Blades xs={[-w * 0.4, -w * 0.2, 0, w * 0.2, w * 0.4]} shade="#69db7c" height={w * 0.24} />
      </g>
      {eggs.map(([dx, fill, pattern], i) => (
        <Egg key={i} cx={cx + dx * w} by={by - h + 6} w={w * 0.28} h={w * 0.36} fill={fill} deco="#fff" pattern={pattern} />
      ))}
      <path d={`M${cx - w / 2} ${by - h} H${cx + w / 2} L${cx + w * 0.4} ${by} H${cx - w * 0.4} Z`} fill="#c68b59" />
      <path
        d={`M${cx - w * 0.47} ${by - h * 0.62} H${cx + w * 0.47} M${cx - w * 0.43} ${by - h * 0.26} H${cx + w * 0.43} M${cx - w * 0.2} ${by - h} V${by} M${cx + w * 0.2} ${by - h} V${by}`}
        stroke="#a0673d"
        strokeWidth={w * 0.04}
      />
      <rect x={cx - w * 0.52} y={by - h - w * 0.05} width={w * 1.04} height={w * 0.1} rx={w * 0.05} fill="#d9a066" />
    </>
  );
}

// ---------- Osterhase ----------

/** The Easter bunny with his basket: he hops twice, waves, wiggles his ears, and an egg jumps out of the basket. */
export function Osterhase() {
  return (
    <g className="os-hase-body" style={{ transformOrigin: "0px 0px" }}>
      <circle cx="-50" cy="-56" r="18" fill="#fff" />
      <ellipse cx="-30" cy="-10" rx="32" ry="14" fill={LIGHT} />
      <ellipse cx="30" cy="-10" rx="32" ry="14" fill={LIGHT} />
      <ellipse cx="-30" cy="-8" rx="10" ry="6" fill="#ffc9d6" />
      <ellipse cx="30" cy="-8" rx="10" ry="6" fill="#ffc9d6" />
      <ellipse cx="0" cy="-84" rx="54" ry="66" fill={FUR} />
      <ellipse cx="0" cy="-74" rx="34" ry="48" fill={LIGHT} />
      <path d="M40 -120 Q56 -80 44 -40 Q60 -80 48 -124 Z" fill="#b08968" opacity="0.6" />
      {/* Right arm with the basket */}
      <path d="M38 -128 L72 -108" stroke={FUR} strokeWidth="20" strokeLinecap="round" />
      <g className="os-hase-egg" style={{ transformOrigin: "84px -70px" }}>
        <Egg cx={84} by={-66} w={28} h={36} fill="#ff6b6b" deco="#ffe066" pattern="dots" />
      </g>
      <Basket
        cx={78}
        by={-26}
        w={74}
        eggs={[
          [-0.26, "#74c0fc", "zigzag"],
          [0.24, "#b197fc", "stripes"],
        ]}
      />
      <circle cx="74" cy="-104" r="12" fill={LIGHT} />
      {/* Bow tie */}
      <path d="M0 -140 L-22 -152 V-128 Z M0 -140 L22 -152 V-128 Z" fill="#4dabf7" />
      <circle cx="0" cy="-140" r="6" fill="#1c7ed6" />
      {/* Left arm waves */}
      <g className="os-hase-arm" style={{ transformOrigin: "-38px -126px" }}>
        <path d="M-38 -126 L-74 -152" stroke={FUR} strokeWidth="20" strokeLinecap="round" />
        <circle cx="-78" cy="-156" r="13" fill={LIGHT} />
      </g>
      <g className="os-hase-head" style={{ transformOrigin: "0px -146px" }}>
        <g className="os-hase-ear-l" style={{ transformOrigin: "-18px -214px" }}>
          <ellipse cx="-28" cy="-262" rx="16" ry="52" fill={FUR} transform="rotate(-12 -28 -262)" />
          <ellipse cx="-28" cy="-258" rx="8" ry="38" fill="#ffc9d6" transform="rotate(-12 -28 -258)" />
        </g>
        <g className="os-hase-ear-r" style={{ transformOrigin: "18px -214px" }}>
          <ellipse cx="28" cy="-262" rx="16" ry="52" fill={FUR} transform="rotate(12 28 -262)" />
          <ellipse cx="28" cy="-258" rx="8" ry="38" fill="#ffc9d6" transform="rotate(12 28 -258)" />
        </g>
        <circle cx="0" cy="-184" r="46" fill={FUR} />
        <ellipse cx="-14" cy="-164" rx="18" ry="14" fill={LIGHT} />
        <ellipse cx="14" cy="-164" rx="18" ry="14" fill={LIGHT} />
        <rect x="-7" y="-156" width="14" height="10" rx="3" fill="#fff" stroke="#dee2e6" strokeWidth="1.5" />
        <path d="M0 -156 V-147" stroke="#dee2e6" strokeWidth="1.5" />
        <ellipse cx="0" cy="-174" rx="8" ry="6" fill="#ff8fa3" />
        <path d="M-30 -168 h-24 M-30 -162 l-22 6 M30 -168 h24 M30 -162 l22 6" stroke="#6b4423" strokeWidth="2" strokeLinecap="round" />
        <Eye cx={-17} cy={-194} r={6.5} />
        <Eye cx={17} cy={-194} r={6.5} />
        <Lid cx={-17} cy={-194} r={6.5} fill={FUR} />
        <Lid cx={17} cy={-194} r={6.5} fill={FUR} />
        <circle cx="-32" cy="-176" r="7" fill={CHEEK} opacity="0.5" />
        <circle cx="32" cy="-176" r="7" fill={CHEEK} opacity="0.5" />
      </g>
      <Sparkles
        className="os-hase-spark"
        spots={[
          [-110, -200],
          [120, -150],
          [-100, -60],
          [130, -230],
        ]}
        r={12}
      />
      <Notes x={60} y={-260} texts={["Hopp!", "Hopp!"]} colour="#fff" size={30} />
    </g>
  );
}

// ---------- Korbkind ----------

/** A girl with a basket who has found an egg: she lifts it up high and laughs. */
export function Korbkind() {
  return (
    <g className="os-kind-body" style={{ transformOrigin: "0px 0px" }}>
      <Leg x1={-12} y1={-74} x2={-14} y2={-10} trousers={SKIN} shoe="#7950f2" w={14} />
      <Leg x1={12} y1={-74} x2={16} y2={-10} trousers={SKIN} shoe="#7950f2" w={14} />
      <path d="M-24 -150 Q-36 -110 -48 -64 Q0 -54 48 -64 Q36 -110 24 -150 Z" fill="#ff8fab" />
      <g fill="#fff" opacity="0.8">
        <circle cx="-18" cy="-100" r="4" />
        <circle cx="12" cy="-116" r="4" />
        <circle cx="22" cy="-84" r="4" />
        <circle cx="-30" cy="-74" r="4" />
        <circle cx="0" cy="-80" r="4" />
      </g>
      <path d="M-16 -150 Q0 -138 16 -150" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Left arm with the basket */}
      <Arm x1={-22} y1={-140} x2={-42} y2={-112} sleeve="#ff8fab" w={13} />
      <Basket
        cx={-44}
        by={-60}
        w={62}
        eggs={[
          [-0.22, "#ffd43b", "zigzag"],
          [0.22, "#69db7c", "dots"],
        ]}
      />
      <circle cx="-43" cy="-111" r="7" fill={SKIN} />
      {/* Right arm holds the found egg; it goes up high */}
      <g className="os-kind-arm" style={{ transformOrigin: "22px -140px" }}>
        <Arm x1={22} y1={-140} x2={44} y2={-104} sleeve="#ff8fab" w={13} />
        <Egg cx={48} by={-86} w={26} h={32} fill="#4dabf7" deco="#ffe066" pattern="stripes" />
        <circle cx="44" cy="-100" r="7" fill={SKIN} />
      </g>
      <g className="os-kind-head" style={{ transformOrigin: "0px -150px" }}>
        <Head cx={0} cy={-180} r={30} hair="#e9a23b" style="pigtails" />
        <circle cx="20" cy="-206" r="7" fill="#ffd43b" />
        <circle cx="20" cy="-206" r="3" fill="#ff922b" />
      </g>
      <Sparkles
        className="os-kind-spark"
        spots={[
          [70, -230],
          [30, -250],
          [96, -190],
        ]}
        r={11}
      />
      <Notes x={-90} y={-230} texts={["Ein Ei!"]} colour="#fff" size={28} />
    </g>
  );
}

// ---------- Eierlauf ----------

/** A boy with bunny ears runs the egg-and-spoon race: the egg wobbles, jumps up and lands back on the spoon. */
export function Eierlauf() {
  return (
    <g className="os-lauf-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="os-lauf-leg-a" style={{ transformOrigin: "-8px -72px" }}>
        <Leg x1={-8} y1={-72} x2={-30} y2={-10} trousers="#495057" shoe="#e03131" w={15} />
      </g>
      <g className="os-lauf-leg-b" style={{ transformOrigin: "8px -72px" }}>
        <Leg x1={8} y1={-72} x2={24} y2={-10} trousers="#495057" shoe="#e03131" w={15} />
      </g>
      <path d="M-24 -148 Q-28 -110 -24 -66 H24 Q28 -110 24 -148 Z" fill="#69db7c" />
      <path d="M-26 -110 H26" stroke="#fff" strokeWidth="8" />
      <rect x="-26" y="-74" width="52" height="12" rx="5" fill="#495057" />
      <Arm x1={-18} y1={-138} x2={28} y2={-112} sleeve="#69db7c" w={13} />
      <g className="os-lauf-spoon" style={{ transformOrigin: "34px -114px" }}>
        <path d="M34 -114 L80 -122" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="92" cy="-124" rx="15" ry="7" fill="#ced4da" />
        <ellipse cx="90" cy="-126" rx="9" ry="3" fill="#f1f3f5" />
        <g className="os-lauf-egg" style={{ transformOrigin: "92px -126px" }}>
          <Egg cx={92} by={-126} w={26} h={33} fill="#fff8e7" />
        </g>
      </g>
      <Arm x1={18} y1={-138} x2={36} y2={-114} sleeve="#69db7c" w={13} />
      <g className="os-lauf-head" style={{ transformOrigin: "0px -148px" }}>
        <g className="os-lauf-ears" style={{ transformOrigin: "0px -200px" }}>
          <ellipse cx="-14" cy="-226" rx="9" ry="26" fill="#fff" transform="rotate(-14 -14 -226)" />
          <ellipse cx="-14" cy="-224" rx="4.5" ry="18" fill="#ffc9d6" transform="rotate(-14 -14 -224)" />
          <ellipse cx="16" cy="-226" rx="9" ry="26" fill="#fff" transform="rotate(16 16 -226)" />
          <ellipse cx="16" cy="-224" rx="4.5" ry="18" fill="#ffc9d6" transform="rotate(16 16 -224)" />
        </g>
        <Head cx={0} cy={-174} r={28} hair="#6b4423" />
        <path d="M-27 -186 Q0 -214 27 -186" stroke="#f783ac" strokeWidth="5" fill="none" />
        <circle cx="12" cy="-158" r="3.5" fill="#ff8fa3" />
      </g>
      <Notes x={70} y={-200} texts={["Huch!", "Puh!"]} colour="#fff" size={26} />
    </g>
  );
}
