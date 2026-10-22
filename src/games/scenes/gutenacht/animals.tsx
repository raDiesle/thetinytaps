import { CHEEK, nth } from "../shared";
import { Eyes, SleepyFace, Yawn, Zzz } from "./parts";

// The animals on the floor: the cuddly bunny, the cat in its basket, the cuddly sheep and
// the cuddly elephant. Each has its foot point at (0, 0) and is placed with ground().

/** A cuddly bunny sitting up; it sniffs, flops an ear and yawns. */
export function Hase() {
  const fur = "#f1f3f5";
  return (
    <>
      <g className="gn-hase" style={{ transformOrigin: "0px 0px" }}>
        {[-1, 1].map((s, i) => (
          <g key={s} className="gn-hase-ear" style={{ ...nth(i), transformOrigin: `${s * 10}px -128px` }}>
            <ellipse cx={s * 13} cy="-160" rx="10" ry="30" fill={fur} transform={`rotate(${s * 8} ${s * 13} -160)`} />
            <ellipse cx={s * 13} cy="-158" rx="5" ry="21" fill="#ffc9de" transform={`rotate(${s * 8} ${s * 13} -158)`} />
          </g>
        ))}
        <ellipse cx="0" cy="-46" rx="32" ry="38" fill={fur} />
        <ellipse cx="0" cy="-40" rx="20" ry="26" fill="#fff" />
        <ellipse cx="-16" cy="-6" rx="15" ry="8" fill="#fff" />
        <ellipse cx="16" cy="-6" rx="15" ry="8" fill="#fff" />
        <path d="M-28 -60 Q-38 -46 -26 -36 M28 -60 Q38 -46 26 -36" stroke={fur} strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="0" cy="-104" r="30" fill={fur} />
        <SleepyFace cx={0} cy={-106} size={1} />
        <ellipse className="gn-hase-nose" style={{ transformOrigin: "0px -98px" }} cx="0" cy="-98" rx="4" ry="3" fill="#f783ac" />
        <path d="M-12 -74 L0 -68 L12 -74 L12 -62 L0 -68 L-12 -62 Z" fill="#74c0fc" />
      </g>
      <Zzz x={26} y={-150} />
    </>
  );
}

const CAT = "#ffa94d";

/** The ginger cat curled up in its basket; it lifts its head, twitches its ears, yawns and swishes its tail. */
export function Katze() {
  return (
    <>
      <ellipse cx="0" cy="-58" rx="84" ry="18" fill="#c68b59" />
      <ellipse cx="0" cy="-56" rx="74" ry="12" fill="#d0bfff" />
      <ellipse cx="14" cy="-64" rx="54" ry="22" fill={CAT} />
      <path d="M4 -84 q4 10 0 20 M24 -84 q4 10 0 20 M44 -80 q3 8 0 16" stroke="#f08c00" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g className="gn-katze-head" style={{ transformOrigin: "-40px -64px" }}>
        {[-1, 1].map((s, i) => (
          <g key={s} className="gn-katze-ear" style={{ ...nth(i), transformOrigin: `${-40 + s * 14}px -100px` }}>
            <path d={`M${-40 + s * 6} -100 L${-40 + s * 22} -122 L${-40 + s * 24} -92 Z`} fill={CAT} />
            <path d={`M${-40 + s * 11} -100 L${-40 + s * 20} -114 L${-40 + s * 21} -96 Z`} fill="#ffc9c9" />
          </g>
        ))}
        <circle cx="-40" cy="-84" r="25" fill={CAT} />
        <path d="M-48 -106 L-46 -96 M-40 -108 V-98 M-32 -106 L-34 -96" stroke="#f08c00" strokeWidth="3" strokeLinecap="round" />
        <SleepyFace cx={-40} cy={-86} size={0.9} />
        <path d="M-54 -78 L-74 -82 M-54 -74 L-72 -70 M-26 -78 L-6 -82 M-26 -74 L-8 -70" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g className="gn-katze-tail" style={{ transformOrigin: "60px -60px" }}>
        <path d="M60 -60 Q84 -62 72 -44 Q60 -32 30 -38" stroke="#f08c00" strokeWidth="11" strokeLinecap="round" fill="none" />
      </g>
      {/* Front of the basket */}
      <path d="M-84 -58 Q-80 0 0 0 Q80 0 84 -58 Q0 -36 -84 -58 Z" fill="#d4a373" />
      <path d="M-78 -40 Q0 -16 78 -40 M-70 -22 Q0 -2 70 -22" stroke="#c68b59" strokeWidth="4" fill="none" />
      <path d="M-84 -58 Q0 -36 84 -58" stroke="#b5835a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="-14" cy="-52" rx="11" ry="7" fill={CAT} />
      <Zzz x={-14} y={-118} />
    </>
  );
}

const WOOL: [number, number, number][] = [
  [-36, -52, 24],
  [-6, -64, 26],
  [26, -56, 24],
  [46, -34, 22],
  [-44, -28, 22],
  [-10, -30, 26],
  [22, -28, 24],
];

/** A cuddly sheep lying down; its wool puffs up, it nods and flops its ears. */
export function Schaf() {
  return (
    <>
      {[-40, -12, 22, 48].map((x) => (
        <rect key={x} x={x - 6} y="-12" width="12" height="12" rx="5" fill="#495057" />
      ))}
      <g className="gn-schaf-wool">
        {WOOL.map(([x, y, r], i) => (
          <g key={i} className="gn-schaf-puff" style={nth(i % 3)}>
            <circle cx={x} cy={y} r={r} fill="#f8f9fa" />
            <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill="#fff" />
          </g>
        ))}
      </g>
      <g className="gn-schaf-head" style={{ transformOrigin: "-56px -48px" }}>
        {[-1, 1].map((s, i) => (
          <g key={s} className="gn-schaf-ear" style={{ ...nth(i), transformOrigin: `${-70 + s * 18}px -66px` }}>
            <ellipse cx={-70 + s * 26} cy="-64" rx="14" ry="7" fill="#495057" transform={`rotate(${s * 20} ${-70 + s * 26} -64)`} />
          </g>
        ))}
        <ellipse cx="-70" cy="-54" rx="22" ry="26" fill="#fff4e6" />
        <circle cx="-76" cy="-80" r="9" fill="#f8f9fa" />
        <circle cx="-64" cy="-82" r="10" fill="#f8f9fa" />
        <SleepyFace cx={-70} cy={-56} size={0.85} />
      </g>
      <Zzz x={-42} y={-98} />
    </>
  );
}

/** A cuddly elephant sitting up; it lifts its trunk and toots softly, and flaps its big ears. */
export function Elefant() {
  const skin = "#a5b4cf";
  return (
    <>
      {[-1, 1].map((s, i) => (
        <g key={s} className="gn-ele-ear" style={{ ...nth(i), transformOrigin: `${s * 30}px -122px` }}>
          <ellipse cx={s * 52} cy="-118" rx="32" ry="36" fill="#91a3c4" />
          <ellipse cx={s * 54} cy="-116" rx="20" ry="24" fill="#f3c4d6" />
        </g>
      ))}
      <ellipse cx="0" cy="-54" rx="50" ry="52" fill={skin} />
      <ellipse cx="0" cy="-46" rx="30" ry="34" fill="#c3cde0" />
      <ellipse cx="-26" cy="-10" rx="19" ry="12" fill={skin} />
      <ellipse cx="26" cy="-10" rx="19" ry="12" fill={skin} />
      {[-34, -26, -18, 18, 26, 34].map((x) => (
        <circle key={x} cx={x} cy="-4" r="3" fill="#fff" />
      ))}
      <circle cx="0" cy="-118" r="40" fill={skin} />
      <circle cx="-22" cy="-108" r="6" fill={CHEEK} opacity="0.5" />
      <circle cx="22" cy="-108" r="6" fill={CHEEK} opacity="0.5" />
      <Eyes cx={0} cy={-126} gap={15} r={3.6} />
      <g className="gn-ele-trunk" style={{ transformOrigin: "0px -106px" }}>
        <path d="M0 -112 Q2 -80 -6 -66 Q-14 -54 -26 -60" stroke={skin} strokeWidth="17" strokeLinecap="round" fill="none" />
        <path d="M-4 -90 h8 M-6 -78 h8" stroke="#91a3c4" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <Yawn cx={18} cy={-94} r={5} />
      <g className="gn-ele-toot" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round">
        <path d="M-62 -132 q-8 -8 -4 -18" style={nth(0)} />
        <path d="M-72 -126 q-14 -10 -8 -28" style={nth(1)} />
      </g>
      <Zzz x={38} y={-158} />
    </>
  );
}
