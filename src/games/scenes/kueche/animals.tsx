import { CHEEK, Eye, INK, nth } from "../shared";
import { Hearts, Lid, Lines } from "./parts";

// The pets of the kitchen. Each drawing has its foot point at (0, 0) and is placed with ground().

const CAT = "#adb5bd";

/** A grey cat at its bowl; it bends down to eat, its ears twitch and its tail swishes. */
export function Katze() {
  return (
    <>
      {/* Bowl with food */}
      <path d="M-120 -30 Q-120 0 -78 0 Q-36 0 -36 -30 Z" fill="#ff6b6b" />
      <ellipse cx="-78" cy="-30" rx="42" ry="9" fill="#fa5252" />
      <ellipse cx="-78" cy="-31" rx="34" ry="6" fill="#8d5a3b" />
      <g className="kc-katze-food" fill="#c88b3a">
        {[-96, -78, -60].map((x, i) => (
          <circle key={x} cx={x} cy="-36" r="5" style={nth(i)} />
        ))}
      </g>
      <path d="M-92 -14 Q-80 -24 -66 -14 L-58 -20 V-8 L-66 -14 Q-80 -4 -92 -14 Z" fill="#fff" />
      <circle cx="-84" cy="-15" r="1.8" fill="#fa5252" />
      <g className="kc-katze-tail" style={{ transformOrigin: "36px -14px" }}>
        <path d="M36 -14 Q80 -10 78 -52 Q76 -74 62 -78" stroke="#868e96" strokeWidth="14" strokeLinecap="round" fill="none" />
      </g>
      <path d="M-42 0 Q-48 -70 0 -84 Q48 -70 42 0 Z" fill={CAT} />
      <ellipse cx="0" cy="-32" rx="22" ry="28" fill="#f1f3f5" />
      <ellipse cx="18" cy="-5" rx="13" ry="8" fill="#dee2e6" />
      <g className="kc-katze-head" style={{ transformOrigin: "0px -80px" }}>
        {[
          { d: "M-30 -132 L-28 -170 L-4 -148 Z", inner: "M-25 -138 L-25 -158 L-12 -146 Z", origin: "-18px -142px" },
          { d: "M30 -132 L28 -170 L4 -148 Z", inner: "M25 -138 L25 -158 L12 -146 Z", origin: "18px -142px" },
        ].map(({ d, inner, origin }, i) => (
          <g key={i} className="kc-katze-ear" style={{ ...nth(i), transformOrigin: origin }}>
            <path d={d} fill={CAT} />
            <path d={inner} fill="#ffc9c9" />
          </g>
        ))}
        <circle cx="0" cy="-114" r="36" fill={CAT} />
        <path d="M-8 -148 L-6 -134 M0 -150 V-136 M8 -148 L6 -134" stroke="#868e96" strokeWidth="4" strokeLinecap="round" />
        <Eye cx={-13} cy={-118} r={4.5} />
        <Eye cx={13} cy={-118} r={4.5} />
        <Lid cx={-13} cy={-118} r={4.5} fill={CAT} />
        <Lid cx={13} cy={-118} r={4.5} fill={CAT} />
        <circle cx="-22" cy="-104" r="6" fill={CHEEK} opacity="0.5" />
        <circle cx="22" cy="-104" r="6" fill={CHEEK} opacity="0.5" />
        <path d="M-4 -109 H4 L0 -104 Z" fill="#ff8fa3" />
        <ellipse className="kc-katze-tongue" cx="2" cy="-95" rx="5" ry="6" fill="#ff8fa3" />
        <path d="M-8 -100 Q-4 -96 0 -100 Q4 -96 8 -100" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <path d="M-16 -106 L-40 -110 M-16 -102 L-38 -98 M16 -106 L40 -110 M16 -102 L38 -98" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </g>
      <ellipse cx="-18" cy="-5" rx="13" ry="8" fill="#dee2e6" />
      <Lines x={50} y={-130} colour="#868e96" />
    </>
  );
}

const DOG = "#e8c39e";

/** The dog sits up and begs; it wags its tail, flaps its ears, licks its nose and a heart pops up. */
export function Hund() {
  return (
    <>
      <g className="kc-hund-tail" style={{ transformOrigin: "40px -20px" }}>
        <path d="M40 -20 Q74 -36 70 -68" stroke="#c69c6d" strokeWidth="12" strokeLinecap="round" fill="none" />
      </g>
      <g className="kc-hund-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-48 0 Q-56 -80 0 -96 Q56 -80 48 0 Z" fill={DOG} />
        <ellipse cx="0" cy="-56" rx="24" ry="30" fill="#fff4e6" />
        <ellipse cx="-22" cy="-4" rx="15" ry="8" fill="#f8e1c7" />
        <ellipse cx="22" cy="-4" rx="15" ry="8" fill="#f8e1c7" />
        {/* Begging paws */}
        {[-1, 1].map((s, i) => (
          <g key={s} className="kc-hund-paw" style={{ ...nth(i), transformOrigin: `${s * 16}px -84px` }}>
            <path d={`M${s * 16} -84 L${s * 18} -58`} stroke={DOG} strokeWidth="16" strokeLinecap="round" />
            <ellipse cx={s * 18} cy="-54" rx="10" ry="8" fill="#f8e1c7" />
          </g>
        ))}
        <rect x="-26" y="-98" width="52" height="10" rx="5" fill="#e03131" />
        <circle cx="0" cy="-86" r="7" fill="#ffd43b" />
        <g className="kc-hund-head" style={{ transformOrigin: "0px -96px" }}>
          <circle cx="0" cy="-132" r="42" fill={DOG} />
          <ellipse cx="0" cy="-112" rx="25" ry="17" fill="#fff4e6" />
          <ellipse cx="0" cy="-122" rx="9" ry="6" fill={INK} />
          <path d="M-8 -108 Q0 -102 0 -110 Q0 -102 8 -108" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <g className="kc-hund-tongue" style={{ transformOrigin: "0px -104px" }}>
            <path d="M-6 -106 V-94 Q0 -86 6 -94 V-106 Z" fill="#ff8fa3" />
          </g>
          <Eye cx={-15} cy={-138} r={5} />
          <Eye cx={15} cy={-138} r={5} />
          <Lid cx={-15} cy={-138} r={5} fill={DOG} />
          <Lid cx={15} cy={-138} r={5} fill={DOG} />
          <circle cx="-26" cy="-116" r="6" fill={CHEEK} opacity="0.5" />
          <circle cx="26" cy="-116" r="6" fill={CHEEK} opacity="0.5" />
          {[
            { d: "M-30 -164 Q-64 -160 -62 -110 Q-46 -104 -38 -130 Z", origin: "-32px -162px" },
            { d: "M30 -164 Q64 -160 62 -110 Q46 -104 38 -130 Z", origin: "32px -162px" },
          ].map(({ d, origin }, i) => (
            <g key={i} className="kc-hund-ear" style={{ ...nth(i), transformOrigin: origin }}>
              <path d={d} fill="#a47148" />
            </g>
          ))}
          <ellipse cx="18" cy="-150" rx="12" ry="9" fill="#a47148" opacity="0.6" />
        </g>
      </g>
      <Hearts x={0} y={-200} count={2} spread={44} />
    </>
  );
}

/** A little mouse in front of its hole; it sniffs, twitches its whiskers, squeaks and hops. */
export function Maus() {
  return (
    <>
      <g className="kc-maus-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="kc-maus-tail" style={{ transformOrigin: "26px -8px" }}>
          <path d="M26 -8 Q52 -4 56 -24 Q60 -40 76 -36" stroke="#f783ac" strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
        <ellipse cx="4" cy="-22" rx="30" ry="22" fill="#ced4da" />
        <ellipse cx="0" cy="-16" rx="16" ry="12" fill="#f1f3f5" />
        <circle cx="-22" cy="-38" r="18" fill="#ced4da" />
        <g className="kc-maus-ear" style={{ ...nth(0), transformOrigin: "-34px -48px" }}>
          <circle cx="-38" cy="-56" r="12" fill="#ced4da" />
          <circle cx="-38" cy="-56" r="7" fill="#ffc9c9" />
        </g>
        <g className="kc-maus-ear" style={{ ...nth(1), transformOrigin: "-10px -50px" }}>
          <circle cx="-6" cy="-58" r="12" fill="#ced4da" />
          <circle cx="-6" cy="-58" r="7" fill="#ffc9c9" />
        </g>
        <Eye cx={-28} cy={-40} r={3.4} />
        <Eye cx={-16} cy={-40} r={3.4} />
        <g className="kc-maus-nose" style={{ transformOrigin: "-24px -30px" }}>
          <circle cx="-24" cy="-29" r="4" fill="#f783ac" />
          <path d="M-30 -30 L-50 -34 M-30 -27 L-50 -24 M-18 -30 L2 -34 M-18 -27 L2 -24" stroke="#868e96" strokeWidth="1.6" strokeLinecap="round" />
        </g>
        <ellipse cx="-12" cy="-2" rx="8" ry="4" fill="#f783ac" />
        <ellipse cx="14" cy="-2" rx="8" ry="4" fill="#f783ac" />
      </g>
      <Lines x={-58} y={-44} dir={-1} colour="#868e96" size={0.7} />
    </>
  );
}
