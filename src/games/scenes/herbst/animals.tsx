import { CHEEK, Eye, Face, INK, Inside, nth } from "../shared";
import { Leaf } from "../weather";

// The animals of the autumn picture. Foot point at (0, 0), except the cat, which
// sits on the bench and is drawn in the bench's coordinates (people.tsx).

/** Squirrel with a hazelnut: hops, flicks its tail and nibbles. */
export function Eichhoernchen() {
  return (
    <g className="he-hoernchen-body" style={{ transformOrigin: "0px 0px" }}>
      <g className="he-hoernchen-tail" style={{ transformOrigin: "-12px -14px" }}>
        <path d="M-12 -12 C-62 -10 -68 -74 -38 -96 C-14 -112 8 -98 -6 -82 C-30 -78 -32 -42 -6 -30 Z" fill="#c8553d" />
        <path d="M-30 -30 C-50 -44 -50 -76 -32 -88" stroke="#e07a5f" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="4" cy="-30" rx="20" ry="26" fill="#d9734e" />
      <ellipse cx="11" cy="-26" rx="11" ry="16" fill="#f6d6b8" />
      <ellipse cx="-4" cy="-8" rx="15" ry="9" fill="#c8553d" />
      <ellipse cx="14" cy="-2" rx="11" ry="4" fill="#c8553d" />
      <g className="he-hoernchen-head" style={{ transformOrigin: "12px -52px" }}>
        <path d="M4 -76 L6 -94 L16 -78 Z M20 -78 L26 -96 L30 -76 Z" fill="#c8553d" />
        <circle cx="16" cy="-64" r="17" fill="#d9734e" />
        <ellipse cx="26" cy="-58" rx="9" ry="7" fill="#f6d6b8" />
        <Eye cx={20} cy={-68} r={3.4} />
        <circle cx="34" cy="-60" r="2.6" fill={INK} />
        <circle cx="14" cy="-56" r="4" fill={CHEEK} opacity="0.55" />
      </g>
      <g className="he-hoernchen-paws" style={{ transformOrigin: "18px -40px" }}>
        <ellipse cx="30" cy="-44" rx="8" ry="9" fill="#a47148" />
        <path d="M24 -50 q6 -6 12 0" stroke="#7f5539" strokeWidth="2.5" fill="none" />
        <circle cx="22" cy="-40" r="5" fill="#d9734e" />
        <circle cx="36" cy="-38" r="5" fill="#d9734e" />
      </g>
      <g className="he-hoernchen-crumbs" fill="#a47148">
        <circle cx="42" cy="-50" r="2.5" style={nth(0)} />
        <circle cx="46" cy="-42" r="2" style={nth(1)} />
        <circle cx="38" cy="-36" r="2.2" style={nth(2)} />
      </g>
    </g>
  );
}

/** Spines along the upper half of an ellipse, as one spiky outline. */
function spines(cx: number, cy: number, rx: number, ry: number, n: number) {
  const points = Array.from({ length: n * 2 + 1 }, (_, i) => {
    const a = Math.PI + (i / (n * 2)) * Math.PI;
    const k = i % 2 ? 1.16 : 1;
    return `${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`;
  });
  return `M${points.join(" L")} Z`;
}

/** Hedgehog with leaves and an apple on its spines: sniffs, bristles and hops. */
export function Igel() {
  return (
    <g className="he-igel-body" style={{ transformOrigin: "0px 0px" }}>
      <ellipse cx="-30" cy="-2" rx="9" ry="4" fill="#6b4423" />
      <ellipse cx="18" cy="-2" rx="9" ry="4" fill="#6b4423" />
      <g className="he-igel-spines" style={{ transformOrigin: "-6px -4px" }}>
        <path d={spines(-8, -6, 50, 38, 11)} fill="#7f5539" />
        <path d={spines(-8, -6, 40, 30, 9)} fill="#9c6644" />
        <path d="M-40 -26 l-6 -8 M-24 -36 l-3 -10 M-6 -40 l1 -10 M12 -34 l4 -9" stroke="#5c3d1e" strokeWidth="3" strokeLinecap="round" />
        <g className="he-igel-leaf" style={{ transformOrigin: "-34px -30px" }}>
          <Leaf x={-34} y={-30} angle={-40} scale={2.2} colour="#e9c46a" />
        </g>
        <g className="he-igel-apple" style={{ transformOrigin: "-6px -40px" }}>
          <circle cx="-6" cy="-52" r="13" fill="#e63946" />
          <path d="M-6 -64 q2 -8 6 -10" stroke="#6b4423" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="-10" cy="-56" rx="4" ry="3" fill="#fff" opacity="0.6" />
        </g>
        <Leaf x={20} y={-28} angle={50} scale={2} colour="#e76f51" />
      </g>
      <path d="M24 -34 Q44 -30 58 -12 Q46 -4 26 -4 Z" fill="#e6ccb2" />
      <circle className="he-igel-nose" cx="58" cy="-13" r="4.5" fill={INK} style={{ transformOrigin: "58px -13px" }} />
      <Eye cx={38} cy={-22} r={3} />
      <circle cx="34" cy="-12" r="4" fill={CHEEK} opacity="0.6" />
      <path d="M44 -8 q4 3 8 0" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** A crow on a fence post: flaps, hops up and calls "Krah!". */
export function Kraehe() {
  return (
    <>
      <rect x="-10" y="-72" width="20" height="72" rx="3" fill="#a47148" />
      <rect x="-12" y="-76" width="24" height="8" rx="3" fill="#8d5a2b" />
      <path d="M-4 -60 v20 M4 -30 v14" stroke="#8d5a2b" strokeWidth="2.5" strokeLinecap="round" />
      <g className="he-kraehe-bird" style={{ transformOrigin: "0px -76px" }}>
        <path d="M18 -90 L44 -82 L40 -94 Z" fill="#212529" />
        <ellipse cx="4" cy="-94" rx="24" ry="17" fill="#343a40" />
        <path d="M-4 -78 v6 M8 -78 v6" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
        <g className="he-kraehe-head" style={{ transformOrigin: "-12px -100px" }}>
          <circle cx="-16" cy="-110" r="13" fill="#343a40" />
          <path d="M-27 -114 L-44 -108 L-27 -103 Z" fill="#6c757d" />
          <circle cx="-19" cy="-113" r="4" fill="#fff" />
          <Eye cx={-19} cy={-113} r={2.6} />
        </g>
        <path
          className="he-kraehe-wing"
          d="M-6 -98 Q14 -112 30 -96 Q18 -84 -2 -86 Z"
          fill="#212529"
          style={{ transformOrigin: "-2px -96px" }}
        />
      </g>
      <text className="he-kraehe-call" x="-46" y="-138" fontSize="20" fontWeight="800" fill={INK}>
        Krah!
      </text>
    </>
  );
}

/** The cat on the bench (bench coordinates): bats the ball of wool, which rolls away and back. */
export function Katze() {
  return (
    <>
      <g className="he-katze-ball" style={{ transformOrigin: "118px -71px" }}>
        <circle cx="118" cy="-71" r="10" fill="#e63946" />
        <path d="M110 -76 q8 4 16 0 M110 -68 q8 -4 16 2 M116 -80 q-4 8 0 18" stroke="#9d0208" strokeWidth="1.6" fill="none" />
      </g>
      <g className="he-katze-tail" style={{ transformOrigin: "62px -66px" }}>
        <path d="M62 -66 q-22 2 -24 -18 q0 -14 10 -16" stroke="#e07a2f" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
      <ellipse cx="76" cy="-84" rx="20" ry="22" fill="#f4a261" />
      <ellipse cx="80" cy="-78" rx="10" ry="14" fill="#ffd8a8" />
      <g className="he-katze-paw" style={{ transformOrigin: "88px -84px" }}>
        <path d="M86 -84 Q96 -76 98 -66" stroke="#f4a261" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="99" cy="-65" r="5" fill="#ffd8a8" />
      </g>
      <ellipse cx="68" cy="-64" rx="8" ry="4" fill="#ffd8a8" />
      <g className="he-katze-head" style={{ transformOrigin: "76px -104px" }}>
        <path className="he-katze-ear" d="M62 -128 L60 -146 L74 -134 Z" fill="#f4a261" style={{ transformOrigin: "66px -132px" }} />
        <path d="M90 -128 L92 -146 L78 -134 Z" fill="#f4a261" />
        <path d="M63 -131 L62 -141 L70 -134 Z M89 -131 L90 -141 L82 -134 Z" fill={CHEEK} />
        <circle cx="76" cy="-118" r="18" fill="#f4a261" />
        <path d="M70 -134 q2 6 0 10 M76 -136 v10 M82 -134 q-2 6 0 10" stroke="#e07a2f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <Face cx={76} cy={-118} size={0.7} />
        <path d="M60 -110 h-10 M60 -106 h-9 M92 -110 h10 M92 -106 h9" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <g className="he-katze-blink" fill="#f4a261">
          <rect x="66" y="-123" width="9" height="7" />
          <rect x="77" y="-123" width="9" height="7" />
        </g>
      </g>
    </>
  );
}

/** Dog jumping after a falling leaf: jumps, wags and flaps its ears. */
export function Hund() {
  return (
    <>
      <g className="he-hund-leaf" style={{ transformOrigin: "-54px -132px" }}>
        <Leaf x={-54} y={-132} angle={30} scale={2.6} colour="#e76f51" />
      </g>
      <g className="he-hund-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="he-hund-tail" style={{ transformOrigin: "36px -56px" }}>
          <path d="M36 -56 q16 -8 18 -30" stroke="#b07d4f" strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>
        <rect x="18" y="-40" width="12" height="40" rx="6" fill="#b07d4f" />
        <rect x="-30" y="-40" width="12" height="40" rx="6" fill="#b07d4f" />
        <ellipse cx="0" cy="-48" rx="40" ry="21" fill="#d4a373" />
        <ellipse cx="-10" cy="-40" rx="22" ry="11" fill="#fefae0" />
        <rect x="8" y="-38" width="12" height="38" rx="6" fill="#d4a373" />
        <rect x="-40" y="-38" width="12" height="38" rx="6" fill="#d4a373" />
        <ellipse cx="22" cy="-58" rx="12" ry="9" fill="#b07d4f" />
        <g className="he-hund-head" style={{ transformOrigin: "-30px -62px" }}>
          <path d="M-40 -60 q8 6 22 2" stroke="#e63946" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="-38" cy="-80" r="22" fill="#d4a373" />
          <ellipse cx="-56" cy="-72" rx="13" ry="10" fill="#fefae0" />
          <ellipse cx="-66" cy="-76" rx="5" ry="4" fill={INK} />
          <path d="M-62 -66 q-6 4 -10 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
          <Eye cx={-42} cy={-86} r={3.6} />
          <circle cx="-30" cy="-74" r="4" fill={CHEEK} opacity="0.55" />
          <path className="he-hund-ear" d="M-26 -98 Q-6 -100 -10 -70 Q-20 -72 -26 -84 Z" fill="#9c6644" style={{ transformOrigin: "-24px -96px" }} />
        </g>
      </g>
    </>
  );
}

/** A blackbird on a rose-hip bush: the bush shakes, the bird pecks a berry, hops and sings. */
export function Amsel() {
  return (
    <>
      <g className="he-busch" style={{ transformOrigin: "0px 0px" }}>
        <circle cx="-52" cy="-44" r="44" fill="#588157" />
        <circle cx="50" cy="-46" r="46" fill="#6a994e" />
        <circle cx="0" cy="-70" r="50" fill="#6a994e" />
        <rect x="-90" y="-44" width="180" height="44" rx="22" fill="#588157" />
        <ellipse cx="-14" cy="-96" rx="22" ry="10" fill="#a7c957" opacity="0.6" />
        <ellipse cx="40" cy="-72" rx="14" ry="7" fill="#a7c957" opacity="0.5" />
        {[
          [-60, -50],
          [-30, -24],
          [-6, -64],
          [30, -36],
          [62, -60],
          [70, -24],
          [-74, -20],
          [10, -90],
        ].map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx="6" ry="8" fill="#d62828" />
            <path d={`M${x - 2} ${y - 8} l2 3 l2 -3`} stroke="#2d6a4f" strokeWidth="2" fill="none" />
          </g>
        ))}
      </g>
      <g className="he-amsel" style={{ transformOrigin: "10px -112px" }}>
        <path d="M22 -128 L46 -140 L42 -124 Z" fill="#212529" />
        <ellipse cx="14" cy="-126" rx="20" ry="13" fill="#2b2d42" />
        <path d="M4 -114 v6 M14 -114 v6" stroke="#f77f00" strokeWidth="2.5" strokeLinecap="round" />
        <g className="he-amsel-head" style={{ transformOrigin: "-2px -128px" }}>
          <circle cx="-6" cy="-138" r="11" fill="#2b2d42" />
          <path d="M-16 -140 L-30 -136 L-16 -132 Z" fill="#f77f00" />
          <circle cx="-8" cy="-141" r="4" fill="#ffd60a" />
          <Eye cx={-8} cy={-141} r={2.4} />
          <ellipse className="he-amsel-berry" cx="-28" cy="-134" rx="4" ry="5" fill="#d62828" />
        </g>
        <path className="he-amsel-wing" d="M6 -130 Q22 -138 34 -124 Q20 -116 8 -120 Z" fill="#212529" style={{ transformOrigin: "8px -126px" }} />
      </g>
      <g className="he-amsel-notes" fill={INK}>
        {[
          [-40, -170],
          [-16, -186],
          [10, -172],
        ].map(([x, y], i) => (
          <g key={i} style={nth(i)} className="he-amsel-note">
            <ellipse cx={x} cy={y} rx="6" ry="4.5" />
            <path d={`M${x + 5} ${y} v-16 l7 4`} stroke={INK} strokeWidth="2.4" fill="none" />
          </g>
        ))}
      </g>
    </>
  );
}

/** Snail after the rain: stretches out, waves its feelers and its shell wobbles. */
export function Schnecke() {
  return (
    <>
      <g className="he-schnecke-foot" style={{ transformOrigin: "-44px 0px" }}>
        <path d="M-46 0 Q-44 -12 -10 -12 L24 -14 Q38 -16 42 -32 Q48 -44 56 -32 Q60 -14 50 -4 Q44 0 30 0 Z" fill="#d6c4a8" />
        <path d="M-40 -2 H40" stroke="#b5a58c" strokeWidth="3" strokeLinecap="round" />
        <g className="he-schnecke-feelers" style={{ transformOrigin: "50px -36px" }}>
          <path d="M46 -36 L42 -60 M54 -36 L60 -58" stroke="#b5a58c" strokeWidth="4" strokeLinecap="round" />
          <circle cx="42" cy="-62" r="5" fill={INK} />
          <circle cx="60" cy="-60" r="5" fill={INK} />
          <circle cx="43" cy="-63.5" r="1.6" fill="#fff" />
          <circle cx="61" cy="-61.5" r="1.6" fill="#fff" />
        </g>
        <path d="M46 -24 q4 3 8 0" stroke={INK} strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="42" cy="-20" r="3.5" fill={CHEEK} opacity="0.6" />
      </g>
      <g className="he-schnecke-shell" style={{ transformOrigin: "-6px -12px" }}>
        <circle cx="-6" cy="-36" r="28" fill="#d4a373" />
        <path d="M-6 -36 m0 4 a4 4 0 1 1 4 -4 a10 10 0 1 1 -10 -10 a16 16 0 1 1 16 16 a22 22 0 0 1 -26 -10" stroke="#9c6644" strokeWidth="4" strokeLinecap="round" fill="none" />
        <ellipse cx="-16" cy="-52" rx="8" ry="5" fill="#fff" opacity="0.45" />
      </g>
      <g className="he-schnecke-drops" fill="#74c0fc">
        {[
          [-22, -78],
          [8, -88],
          [30, -74],
        ].map(([x, y], i) => (
          <path key={i} style={nth(i)} d={`M${x} ${y - 8} q6 8 0 12 q-6 -4 0 -12 Z`} />
        ))}
      </g>
    </>
  );
}

/** A red apple with a worm living in it: the worm comes out, looks around, waves and slips back in. */
export function Wurm() {
  return (
    <g className="he-apfel" style={{ transformOrigin: "0px 0px" }}>
      <circle cx="0" cy="-34" r="34" fill="#e63946" />
      <path d="M8 -66 A34 34 0 0 1 8 -2 A30 34 0 0 0 8 -66 Z" fill="#c1121f" />
      <ellipse cx="-14" cy="-48" rx="9" ry="6" fill="#fff" opacity="0.55" />
      <path d="M0 -66 q2 -12 8 -16" stroke="#6b4423" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path className="he-apfel-leaf" d="M4 -76 q14 -12 26 -4 q-12 10 -26 4 Z" fill="#52b788" style={{ transformOrigin: "4px -76px" }} />
      <ellipse cx="18" cy="-42" rx="9" ry="7" fill="#6b1d1d" />
      <Inside d="M0 -140 H80 V-42 H0 Z">
        <g className="he-wurm" style={{ transformOrigin: "18px -42px" }}>
          <path d="M18 -36 Q16 -60 30 -72" stroke="#ff8fa3" strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M14 -48 h10 M16 -58 h10" stroke="#f26b8a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="34" cy="-78" r="11" fill="#ff8fa3" />
          <Eye cx={31} cy={-80} r={2.4} />
          <Eye cx={39} cy={-80} r={2.4} />
          <path d="M32 -73 q3 3 6 0" stroke={INK} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path className="he-wurm-hat" d="M26 -88 h16 l-3 -8 h-10 Z" fill="#4dabf7" />
        </g>
      </Inside>
    </g>
  );
}
