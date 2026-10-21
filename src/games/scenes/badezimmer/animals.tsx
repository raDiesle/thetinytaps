import { CHEEK, Eye, INK, nth } from "../shared";
import { Lid, Lines } from "./parts";

// The animals of the bathroom. Cat and dog have their foot point at (0, 0); the spider hangs
// from the ceiling and is drawn in picture coordinates.

const CAT = "#ffa94d";

/** Ginger cat sitting on the bath mat; it twitches its ears, swishes its tail and licks its paw. */
export function Katze() {
  return (
    <>
      <g className="bz-katze-tail" style={{ transformOrigin: "36px -14px" }}>
        <path d="M36 -14 Q78 -10 76 -50 Q74 -72 60 -76" stroke="#f08c00" strokeWidth="14" strokeLinecap="round" fill="none" />
      </g>
      <path d="M-42 0 Q-48 -70 0 -84 Q48 -70 42 0 Z" fill={CAT} />
      <ellipse cx="0" cy="-32" rx="22" ry="28" fill="#ffe8cc" />
      <ellipse cx="-18" cy="-5" rx="13" ry="8" fill="#ffc078" />
      {[
        { d: "M-30 -132 L-28 -170 L-4 -148 Z", inner: "M-25 -138 L-25 -158 L-12 -146 Z", origin: "-18px -142px" },
        { d: "M30 -132 L28 -170 L4 -148 Z", inner: "M25 -138 L25 -158 L12 -146 Z", origin: "18px -142px" },
      ].map(({ d, inner, origin }, i) => (
        <g key={i} className="bz-katze-ear" style={{ ...nth(i), transformOrigin: origin }}>
          <path d={d} fill={CAT} />
          <path d={inner} fill="#ffc9c9" />
        </g>
      ))}
      <circle cx="0" cy="-114" r="36" fill={CAT} />
      <path d="M-8 -148 L-6 -134 M0 -150 V-136 M8 -148 L6 -134" stroke="#f08c00" strokeWidth="4" strokeLinecap="round" />
      <Eye cx={-13} cy={-118} r={4.5} />
      <Eye cx={13} cy={-118} r={4.5} />
      <Lid cx={-13} cy={-118} r={4.5} fill={CAT} />
      <Lid cx={13} cy={-118} r={4.5} fill={CAT} />
      <circle cx="-22" cy="-104" r="6" fill={CHEEK} opacity="0.5" />
      <circle cx="22" cy="-104" r="6" fill={CHEEK} opacity="0.5" />
      <path d="M-4 -109 H4 L0 -104 Z" fill="#ff8fa3" />
      <ellipse className="bz-katze-tongue" cx="2" cy="-95" rx="5" ry="6" fill="#ff8fa3" />
      <path d="M-8 -100 Q-4 -96 0 -100 Q4 -96 8 -100" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M-16 -106 L-40 -110 M-16 -102 L-38 -98 M16 -106 L40 -110 M16 -102 L38 -98" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <g className="bz-katze-paw" style={{ transformOrigin: "12px -56px" }}>
        <path d="M12 -56 L18 -8" stroke={CAT} strokeWidth="16" strokeLinecap="round" />
        <ellipse cx="18" cy="-5" rx="13" ry="8" fill="#ffc078" />
      </g>
    </>
  );
}

const DOG = "#e8c39e";

/** A wet dog after its bath; it shakes itself so drops fly, flaps its ears and wags its tail. */
export function Hund() {
  return (
    <>
      <g className="bz-hund-body" style={{ transformOrigin: "0px 0px" }}>
        <g className="bz-hund-tail" style={{ transformOrigin: "40px -24px" }}>
          <path d="M40 -24 Q74 -40 70 -72" stroke="#c69c6d" strokeWidth="12" strokeLinecap="round" fill="none" />
        </g>
        <path d="M-48 0 Q-56 -80 0 -96 Q56 -80 48 0 Z" fill={DOG} />
        <ellipse cx="0" cy="-56" rx="24" ry="30" fill="#fff4e6" />
        <rect x="-28" y="-44" width="20" height="44" rx="9" fill={DOG} />
        <rect x="8" y="-44" width="20" height="44" rx="9" fill={DOG} />
        <ellipse cx="-18" cy="-4" rx="13" ry="7" fill="#f8e1c7" />
        <ellipse cx="18" cy="-4" rx="13" ry="7" fill="#f8e1c7" />
        <circle cx="0" cy="-128" r="42" fill={DOG} />
        <ellipse cx="0" cy="-108" rx="25" ry="17" fill="#fff4e6" />
        <ellipse cx="0" cy="-118" rx="9" ry="6" fill={INK} />
        <path d="M-8 -104 Q0 -98 0 -106 Q0 -98 8 -104" stroke={INK} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <g className="bz-hund-tongue" style={{ transformOrigin: "0px -100px" }}>
          <path d="M-6 -102 V-90 Q0 -82 6 -90 V-102 Z" fill="#ff8fa3" />
        </g>
        <Eye cx={-15} cy={-134} r={5} />
        <Eye cx={15} cy={-134} r={5} />
        <Lid cx={-15} cy={-134} r={5} fill={DOG} />
        <Lid cx={15} cy={-134} r={5} fill={DOG} />
        <circle cx="-26" cy="-112" r="6" fill={CHEEK} opacity="0.5" />
        <circle cx="26" cy="-112" r="6" fill={CHEEK} opacity="0.5" />
        {[
          { d: "M-30 -160 Q-64 -156 -62 -106 Q-46 -100 -38 -126 Z", origin: "-32px -158px" },
          { d: "M30 -160 Q64 -156 62 -106 Q46 -100 38 -126 Z", origin: "32px -158px" },
        ].map(({ d, origin }, i) => (
          <g key={i} className="bz-hund-ear" style={{ ...nth(i), transformOrigin: origin }}>
            <path d={d} fill="#a47148" />
          </g>
        ))}
        {/* Wet fur: a few drops sitting on it */}
        <path d="M-30 -70 q4 6 0 9 q-4 -3 0 -9 Z M28 -40 q4 6 0 9 q-4 -3 0 -9 Z M10 -160 q4 6 0 9 q-4 -3 0 -9 Z" fill="#74c0fc" />
      </g>
      <g className="bz-hund-drops" fill="#74c0fc">
        {[
          [-80, -150],
          [-90, -90],
          [-76, -30],
          [80, -150],
          [92, -96],
          [78, -34],
          [-30, -192],
          [34, -192],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 9} q7 10 0 14 q-7 -4 0 -14 Z`} style={nth(i % 4)} />
        ))}
      </g>
      <Lines x={50} y={-120} colour="#a47148" />
    </>
  );
}

/** A small friendly spider; it lets itself down on its thread, waves its legs and climbs back. */
export function Spinne() {
  return (
    <>
      <path className="bz-spinne-thread" d="M1385 0 V126" stroke="#adb5bd" strokeWidth="2" style={{ transformOrigin: "1385px 0px" }} />
      <g className="bz-spinne-body">
        <g className="bz-spinne-legs" stroke="#5f3dc4" strokeWidth="3.5" strokeLinecap="round" fill="none" style={{ transformOrigin: "1385px 142px" }}>
          {[-1, 1].map((s) =>
            [0, 1, 2, 3].map((k) => (
              <path key={`${s}${k}`} d={`M${1385 + s * 12} ${134 + k * 5} q${s * 12} ${-12 + k * 6} ${s * 20} ${-2 + k * 8}`} />
            )),
          )}
        </g>
        <circle cx="1385" cy="142" r="16" fill="#7950f2" />
        <circle cx="1379" cy="138" r="5.5" fill="#fff" />
        <circle cx="1391" cy="138" r="5.5" fill="#fff" />
        <Eye cx={1379} cy={139} r={2.8} />
        <Eye cx={1391} cy={139} r={2.8} />
        <path d="M1380 148 Q1385 152 1390 148" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="1374" cy="147" r="2.5" fill={CHEEK} opacity="0.7" />
        <circle cx="1396" cy="147" r="2.5" fill={CHEEK} opacity="0.7" />
      </g>
    </>
  );
}
