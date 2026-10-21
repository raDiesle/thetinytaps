import { CHEEK, Face, INK, SKIN, nth } from "../shared";
import { DARK_RED, FIRE_RED, HelmetHead, Jacket, NAVY, STRIPE, Toot } from "./parts";

// People. Each drawing has its foot point (between the feet, on the ground) at (0, 0).

function Legs({ colour = NAVY, gap = 6 }: { colour?: string; gap?: number }) {
  return (
    <>
      <rect x={-18 - gap / 2} y="-82" width="18" height="72" rx="6" fill={colour} />
      <rect x={gap / 2} y="-82" width="18" height="72" rx="6" fill={colour} />
      <rect x={-18 - gap / 2} y="-52" width="18" height="6" fill={STRIPE} />
      <rect x={gap / 2} y="-52" width="18" height="6" fill={STRIPE} />
      <path d={`M${-22 - gap / 2} 0 v-14 q0 -6 6 -6 h14 v20 Z M${gap / 2} 0 v-20 h14 q8 0 10 8 v12 Z`} fill="#2b2d42" />
    </>
  );
}

/** The firefighter with the hose: the water shoots in a big arc, towards the barbecue. */
export function Feuerwehrfrau() {
  return (
    <>
      <path
        className="fw-frau-jet"
        d="M100 -138 Q130 -330 168 -196"
        pathLength={1}
        stroke="#74c0fc"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />
      <path className="fw-frau-jet-core" d="M100 -138 Q130 -330 168 -196" pathLength={1} stroke="#d0ebff" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g className="fw-frau-splash" fill="#74c0fc">
        {[
          [158, -206],
          [178, -200],
          [168, -220],
          [186, -214],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="7" style={nth(i)} />
        ))}
      </g>
      {/* The hose comes from the hydrant along the ground */}
      <path d="M-150 -4 Q-60 -8 -34 -30 Q-10 -60 40 -112" stroke={FIRE_RED} strokeWidth="11" strokeLinecap="round" fill="none" />
      <g className="fw-frau-body" style={{ transformOrigin: "0px 0px" }}>
        <Legs />
        <path
          className="fw-frau-ponytail"
          d="M-20 -186 Q-46 -176 -42 -144 Q-30 -160 -16 -170 Z"
          fill="#6b4423"
          style={{ transformOrigin: "-20px -184px" }}
        />
        <Jacket x={-30} y={-156} w={60} h={84} />
        <HelmetHead cx={0} cy={-178} r={24} helmet={STRIPE} />
        <g className="fw-frau-nozzle" style={{ transformOrigin: "30px -126px" }}>
          <path d="M18 -144 L48 -122 M-4 -132 L40 -112" stroke={NAVY} strokeWidth="13" strokeLinecap="round" />
          <path d="M40 -112 L100 -138" stroke="#adb5bd" strokeWidth="14" strokeLinecap="round" />
          <path d="M92 -136 L104 -140" stroke="#6c757d" strokeWidth="16" strokeLinecap="round" />
          <circle cx="46" cy="-122" r="8" fill={SKIN} />
          <circle cx="40" cy="-110" r="8" fill={SKIN} />
        </g>
      </g>
    </>
  );
}

/** The firefighter with the whistle: he waves, the visor comes down and he whistles. */
export function Feuerwehrmann() {
  return (
    <g className="fw-mann-body" style={{ transformOrigin: "0px 0px" }}>
      <Legs gap={8} />
      <Jacket x={-34} y={-158} w={68} h={86} />
      <path d="M-30 -146 L-44 -90" stroke={NAVY} strokeWidth="14" strokeLinecap="round" />
      <circle cx="-45" cy="-86" r="8" fill={SKIN} />
      <g className="fw-mann-head" style={{ transformOrigin: "0px -160px" }}>
        <HelmetHead cx={0} cy={-182} r={26} helmet={FIRE_RED} />
        <g className="fw-mann-cheeks" fill={CHEEK}>
          <circle cx="-12" cy="-172" r="7" />
          <circle cx="12" cy="-172" r="7" />
        </g>
        <path className="fw-mann-visor" d="M-26 -212 Q0 -222 26 -212 V-200 Q0 -208 -26 -200 Z" fill="#ffd166" opacity="0.85" style={{ transformOrigin: "0px -212px" }} />
        <g className="fw-mann-whistle">
          <rect x="-4" y="-168" width="22" height="10" rx="4" fill={STRIPE} />
          <circle cx="18" cy="-163" r="6" fill={STRIPE} />
        </g>
        <Toot x={32} y={-166} className="fw-mann-toot" />
      </g>
      <g className="fw-mann-arm" style={{ transformOrigin: "30px -146px" }}>
        <path d="M30 -146 L52 -196" stroke={NAVY} strokeWidth="14" strokeLinecap="round" />
        <circle cx="54" cy="-202" r="9" fill={SKIN} />
      </g>
    </g>
  );
}

/** A child visiting the fire station, with a toy helmet; the balloon's string is in the raised hand. */
export function Kind() {
  return (
    <g className="fw-kind-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-16" y="-50" width="13" height="44" rx="5" fill="#4361ee" />
      <rect x="3" y="-50" width="13" height="44" rx="5" fill="#4361ee" />
      <ellipse cx="-11" cy="-5" rx="11" ry="6" fill="#f8f9fa" />
      <ellipse cx="11" cy="-5" rx="11" ry="6" fill="#f8f9fa" />
      <rect x="-24" y="-102" width="48" height="58" rx="16" fill="#06d6a0" />
      <path d="M-24 -84 H24 M-24 -68 H24" stroke="#fff" strokeWidth="6" />
      <path d="M-20 -94 L-36 -120" stroke="#06d6a0" strokeWidth="11" strokeLinecap="round" />
      <circle cx="-37" cy="-124" r="7" fill={SKIN} />
      <g className="fw-kind-arm" style={{ transformOrigin: "20px -94px" }}>
        <path d="M20 -94 L36 -66" stroke="#06d6a0" strokeWidth="11" strokeLinecap="round" />
        <circle cx="37" cy="-62" r="7" fill={SKIN} />
      </g>
      <g className="fw-kind-head" style={{ transformOrigin: "0px -104px" }}>
        <circle cx="0" cy="-124" r="22" fill={SKIN} />
        <Face cx={0} cy={-122} size={0.8} />
        <path d="M-24 -130 Q-24 -156 0 -156 Q24 -156 24 -130 Z" fill={FIRE_RED} />
        <rect x="-28" y="-134" width="56" height="7" rx="3" fill={DARK_RED} />
        <circle cx="0" cy="-146" r="6" fill={STRIPE} />
      </g>
      <g className="fw-kind-hearts" fill="#ff5d73">
        {[
          [30, -158],
          [48, -134],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} c0 -8 -12 -8 -12 0 c0 6 12 12 12 14 c0 -2 12 -8 12 -14 c0 -8 -12 -8 -12 0 Z`} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** The yellow balloon held by the child (same placement); it bobs and tugs at its string. */
export function Luftballon() {
  return (
    <g className="fw-ballon-body" style={{ transformOrigin: "-37px -124px" }}>
      <path d="M-37 -124 Q-60 -200 -52 -262" stroke={INK} strokeWidth="2.5" fill="none" />
      <path d="M-52 -262 l-6 10 h12 Z" fill="#f4a261" />
      <ellipse cx="-52" cy="-302" rx="34" ry="42" fill={STRIPE} />
      <ellipse cx="-64" cy="-318" rx="9" ry="14" fill="#fff" opacity="0.55" />
      <Face cx={-52} cy={-304} size={0.7} />
    </g>
  );
}

/** Grandpa at the barbecue next door (faces left): he turns the sausages and laughs. */
export function Opa() {
  return (
    <g className="fw-opa-body" style={{ transformOrigin: "0px 0px" }}>
      <rect x="-20" y="-70" width="17" height="64" rx="6" fill="#6c757d" />
      <rect x="4" y="-70" width="17" height="64" rx="6" fill="#6c757d" />
      <ellipse cx="-16" cy="-5" rx="13" ry="6" fill="#6b4423" />
      <ellipse cx="12" cy="-5" rx="13" ry="6" fill="#6b4423" />
      <rect x="-34" y="-142" width="68" height="84" rx="22" fill="#4cc9f0" />
      <path d="M-24 -132 H24 L28 -60 H-28 Z" fill="#f8f9fa" />
      <path d="M-20 -110 H20" stroke={FIRE_RED} strokeWidth="5" />
      <path d="M24 -128 L36 -84" stroke="#4cc9f0" strokeWidth="13" strokeLinecap="round" />
      <circle cx="37" cy="-80" r="8" fill={SKIN} />
      <g className="fw-opa-head" style={{ transformOrigin: "0px -144px" }}>
        <circle cx="0" cy="-166" r="24" fill={SKIN} />
        <path d="M-24 -172 Q-26 -150 -18 -146 M24 -172 Q26 -150 18 -146" stroke="#dee2e6" strokeWidth="7" strokeLinecap="round" fill="none" />
        <Face cx={-2} cy={-168} size={0.8} />
        <path className="fw-opa-moustache" d="M-14 -158 Q-8 -152 -2 -158 Q4 -152 10 -158 Q4 -148 -2 -154 Q-8 -148 -14 -158 Z" fill="#dee2e6" style={{ transformOrigin: "-2px -156px" }} />
        <g className="fw-opa-hat" style={{ transformOrigin: "0px -188px" }}>
          <rect x="-22" y="-200" width="44" height="14" rx="4" fill="#fff" />
          <circle cx="-14" cy="-210" r="13" fill="#fff" />
          <circle cx="4" cy="-216" r="15" fill="#fff" />
          <circle cx="18" cy="-206" r="11" fill="#fff" />
        </g>
      </g>
      <g className="fw-opa-arm" style={{ transformOrigin: "-24px -126px" }}>
        <path d="M-24 -126 L-52 -98" stroke="#4cc9f0" strokeWidth="13" strokeLinecap="round" />
        <circle cx="-55" cy="-95" r="8" fill={SKIN} />
        <path d="M-58 -92 L-104 -84 M-58 -96 L-102 -96" stroke="#adb5bd" strokeWidth="5" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** The soft practice dummy on its spring stand: it wobbles and flops its arms. */
export function Puppe() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="40" ry="10" fill="#6c757d" />
      <path className="fw-puppe-spring" d="M0 -10 l-12 -6 l24 -8 l-24 -8 l24 -8 l-12 -6" stroke="#adb5bd" strokeWidth="5" fill="none" strokeLinejoin="round" />
      <g className="fw-puppe-body" style={{ transformOrigin: "0px -44px" }}>
        <rect x="-28" y="-118" width="56" height="76" rx="22" fill="#f77f00" />
        <rect x="-28" y="-80" width="56" height="8" fill="#dee2e6" />
        <path d="M-6 -116 V-44" stroke="#d66a00" strokeWidth="3" strokeDasharray="6 5" />
        <g className="fw-puppe-arm" style={{ transformOrigin: "-24px -108px", ...nth(0) }}>
          <path d="M-24 -108 Q-50 -96 -54 -70" stroke="#f77f00" strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="-54" cy="-66" r="9" fill="#f4d58d" />
        </g>
        <g className="fw-puppe-arm fw-puppe-arm-r" style={{ transformOrigin: "24px -108px", ...nth(1) }}>
          <path d="M24 -108 Q50 -96 54 -70" stroke="#f77f00" strokeWidth="14" strokeLinecap="round" fill="none" />
          <circle cx="54" cy="-66" r="9" fill="#f4d58d" />
        </g>
        <g className="fw-puppe-head" style={{ transformOrigin: "0px -118px" }}>
          <circle cx="0" cy="-142" r="26" fill="#f4d58d" />
          <circle cx="-9" cy="-146" r="4" fill={INK} />
          <circle cx="9" cy="-146" r="4" fill={INK} />
          <path d="M-10 -134 Q0 -126 10 -134" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M-14 -134 l2 3 M14 -134 l-2 3" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <circle cx="-16" cy="-136" r="5" fill={CHEEK} opacity="0.6" />
          <circle cx="16" cy="-136" r="5" fill={CHEEK} opacity="0.6" />
          <path d="M-26 -150 Q-26 -174 0 -174 Q26 -174 26 -150 Z" fill={NAVY} />
          <rect x="-30" y="-154" width="60" height="7" rx="3" fill={NAVY} />
        </g>
      </g>
    </>
  );
}
