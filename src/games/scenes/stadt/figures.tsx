import { Face, INK, Inside, SKIN, nth } from "../shared";

// People and animals. Each drawing has its foot point at (0, 0), except those that sit
// on something else: the cat (house), the sparrow (postbox) and the bird (tree).

/** Grey cat on the windowsill of the house, in the house's coordinates. */
export function Katze() {
  return (
    <g className="st-katze-body" style={{ transformOrigin: "-84px -49px" }}>
      <path
        className="st-katze-tail"
        d="M-70 -54 Q-48 -56 -52 -82"
        stroke="#868e96"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "-70px -54px" }}
      />
      <ellipse cx="-84" cy="-68" rx="17" ry="19" fill="#868e96" />
      <ellipse cx="-84" cy="-62" rx="9" ry="12" fill="#f8f9fa" />
      <ellipse cx="-91" cy="-51" rx="5" ry="3" fill="#f8f9fa" />
      <ellipse className="st-katze-paw" cx="-77" cy="-51" rx="5" ry="3" fill="#f8f9fa" style={{ transformOrigin: "-80px -58px" }} />
      <g className="st-katze-head" style={{ transformOrigin: "-84px -82px" }}>
        <path d="M-98 -94 L-96 -114 L-86 -102 Z M-70 -94 L-72 -114 L-82 -102 Z" fill="#868e96" />
        <path d="M-95 -99 L-94 -108 L-89 -102 Z M-73 -99 L-74 -108 L-79 -102 Z" fill="#ffb3c1" />
        <circle cx="-84" cy="-92" r="15" fill="#868e96" />
        <path d="M-88 -106 l1 5 M-84 -107 v5 M-80 -106 l-1 5" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="-84" cy="-86" rx="8" ry="5" fill="#f8f9fa" />
        <circle cx="-90" cy="-94" r="2.6" fill="#2b2d42" />
        <circle cx="-78" cy="-94" r="2.6" fill="#2b2d42" />
        <circle cx="-89.2" cy="-95" r="0.9" fill="#fff" />
        <circle cx="-77.2" cy="-95" r="0.9" fill="#fff" />
        <g className="st-katze-lids" fill="#868e96">
          <circle cx="-90" cy="-94" r="3.4" />
          <circle cx="-78" cy="-94" r="3.4" />
        </g>
        <path d="M-86.5 -89 H-81.5 L-84 -86.5 Z" fill="#ff8fa3" />
        <path d="M-104 -88 H-93 M-75 -88 H-64" stroke="#495057" strokeWidth="1.3" />
      </g>
    </g>
  );
}

/** Sparrow on top of the postbox, in the postbox's coordinates. */
export function Spatz() {
  return (
    <g className="st-spatz-body" style={{ transformOrigin: "4px -170px" }}>
      <path className="st-spatz-tail" d="M-12 -184 L-30 -194 L-26 -180 Z" fill="#8d5a2b" style={{ transformOrigin: "-12px -184px" }} />
      <path d="M0 -176 V-170 M7 -176 V-170" stroke="#ff8c42" strokeWidth="2.5" />
      <ellipse cx="2" cy="-186" rx="16" ry="12" fill="#bc8a5f" />
      <ellipse cx="7" cy="-182" rx="9" ry="7" fill="#ede0d4" />
      <ellipse className="st-spatz-wing" cx="-3" cy="-188" rx="10" ry="6" fill="#8d5a2b" style={{ transformOrigin: "3px -190px" }} />
      <g className="st-spatz-head" style={{ transformOrigin: "10px -192px" }}>
        <circle cx="14" cy="-198" r="9" fill="#8d5a2b" />
        <ellipse cx="17" cy="-195" rx="5" ry="3.5" fill="#ede0d4" />
        <circle cx="17" cy="-200" r="2.2" fill="#2b2d42" />
        <circle cx="17.7" cy="-200.7" r="0.7" fill="#fff" />
        <path d="M22 -200 L29 -197 L22 -195 Z" fill="#ffb703" />
      </g>
    </g>
  );
}

/** Blue tit sitting in the park tree, in the tree's coordinates. */
export function Vogel() {
  return (
    <g className="st-vogel-flight">
      <path className="st-vogel-tail" d="M36 -250 L22 -244 L26 -256 Z" fill="#4895ef" style={{ transformOrigin: "36px -250px" }} />
      <g className="st-vogel-notes" fill="#4895ef">
        {[0, 1].map((i) => (
          <g key={i} style={nth(i)}>
            <circle cx={80 + i * 12} cy={-270 - i * 8} r="4" />
            <path d={`M${83.5 + i * 12} -${270 + i * 8} v-14`} stroke="#4895ef" strokeWidth="2" />
          </g>
        ))}
      </g>
      <ellipse cx="48" cy="-252" rx="15" ry="11" fill="#ffd60a" />
      <ellipse className="st-vogel-wing" cx="43" cy="-255" rx="10" ry="6" fill="#4895ef" style={{ transformOrigin: "48px -256px" }} />
      <circle cx="60" cy="-264" r="9" fill="#4895ef" />
      <ellipse cx="62" cy="-262" rx="5.5" ry="4" fill="#fff" />
      <circle cx="63" cy="-265" r="2" fill="#2b2d42" />
      <path d="M68 -266 L74 -264 L68 -262 Z" fill={INK} />
      <path d="M44 -242 V-238 M51 -242 V-238" stroke="#495057" strokeWidth="2" />
    </g>
  );
}

/** Pigeon on the pavement, pecking for crumbs. */
export function Taube() {
  return (
    <g className="st-taube-body">
      <path className="st-taube-tail" d="M-30 -26 L-46 -16 L-30 -12 Z" fill="#868e96" style={{ transformOrigin: "-30px -19px" }} />
      <path d="M-4 -8 V0 M6 -8 V0" stroke="#ff8fa3" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="-6" cy="-24" rx="26" ry="17" fill="#adb5bd" />
      <g className="st-taube-wing" style={{ transformOrigin: "0px -30px" }}>
        <ellipse cx="-12" cy="-26" rx="16" ry="10" fill="#868e96" />
        <path d="M-20 -24 h10 M-18 -20 h10" stroke="#495057" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="st-taube-head" style={{ transformOrigin: "12px -28px" }}>
        <ellipse cx="13" cy="-34" rx="10" ry="12" fill="#6a994e" />
        <ellipse cx="11" cy="-30" rx="7" ry="6" fill="#9d4edd" opacity="0.5" />
        <circle cx="20" cy="-46" r="11" fill="#adb5bd" />
        <circle cx="23" cy="-48" r="3" fill="#ff8c42" />
        <circle cx="23" cy="-48" r="1.6" fill="#2b2d42" />
        <path d="M30 -47 L39 -44 L30 -41 Z" fill="#495057" />
      </g>
      <g className="st-taube-crumbs" fill="#e9c46a">
        <circle cx="42" cy="-3" r="3" style={nth(0)} />
        <circle cx="52" cy="-2" r="2.5" style={nth(1)} />
      </g>
    </g>
  );
}

/** A happy dog wagging its tail. */
export function Hund() {
  return (
    <g className="st-hund-body" style={{ transformOrigin: "0px 0px" }}>
      <path
        className="st-hund-tail"
        d="M-56 -62 Q-80 -78 -74 -100"
        stroke="#e9c46a"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "-56px -62px" }}
      />
      {[-48, -26, 24, 44].map((x) => (
        <g key={x}>
          <rect x={x - 7} y="-44" width="14" height="40" rx="6" fill={x < 0 ? "#d9b356" : "#e9c46a"} />
          <ellipse cx={x} cy="-4" rx="9" ry="5" fill="#fff" />
        </g>
      ))}
      <ellipse cx="0" cy="-56" rx="60" ry="28" fill="#e9c46a" />
      <ellipse cx="-20" cy="-64" rx="18" ry="12" fill="#bc6c25" />
      <path d="M44 -74 L52 -50" stroke="#e63946" strokeWidth="8" strokeLinecap="round" />
      <circle cx="50" cy="-46" r="5" fill="#ffd60a" />
      <g className="st-hund-head" style={{ transformOrigin: "52px -72px" }}>
        <circle cx="62" cy="-92" r="26" fill="#e9c46a" />
        <ellipse cx="84" cy="-82" rx="17" ry="12" fill="#f4d58d" />
        <ellipse cx="99" cy="-87" rx="6" ry="5" fill={INK} />
        <circle cx="97" cy="-89" r="1.6" fill="#fff" />
        <path className="st-hund-ear" d="M44 -112 Q30 -100 40 -74 Q52 -84 54 -106 Z" fill="#bc6c25" style={{ transformOrigin: "49px -109px" }} />
        <circle cx="68" cy="-98" r="3.6" fill="#2b2d42" />
        <circle cx="69.2" cy="-99.2" r="1.2" fill="#fff" />
        <circle cx="74" cy="-86" r="4.5" fill="#ff8fa3" opacity="0.5" />
        <path d="M94 -78 Q88 -72 80 -75" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse className="st-hund-tongue" cx="86" cy="-70" rx="5" ry="7" fill="#ff5d73" style={{ transformOrigin: "86px -76px" }} />
        <g className="st-hund-bark" fill="none" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round">
          <path d="M110 -96 l10 -6 M112 -84 h12 M110 -72 l10 6" />
        </g>
      </g>
    </g>
  );
}

/** A mouse peeking out of a drain. */
export function Maus() {
  return (
    <>
      <ellipse cx="0" cy="-10" rx="44" ry="12" fill="#343a40" />
      <path d="M-26 -14 V-6 M-13 -16 V-4 M0 -17 V-3 M13 -16 V-4 M26 -14 V-6" stroke="#212529" strokeWidth="4" />
      <Inside d="M-60 -10 V-140 H60 V-10 Z">
        <g className="st-maus-body">
          <ellipse cx="0" cy="-22" rx="17" ry="15" fill="#adb5bd" />
          {[-12, 12].map((x) => (
            <g key={x} className="st-maus-ear" style={{ transformOrigin: `${x * 0.5}px -44px` }}>
              <circle cx={x} cy="-52" r="9" fill="#adb5bd" />
              <circle cx={x} cy="-52" r="5" fill="#ffb3c1" />
            </g>
          ))}
          <circle cx="0" cy="-38" r="14" fill="#adb5bd" />
          <circle cx="-5" cy="-41" r="2.4" fill="#2b2d42" />
          <circle cx="5" cy="-41" r="2.4" fill="#2b2d42" />
          <circle cx="-4.3" cy="-41.8" r="0.8" fill="#fff" />
          <circle cx="5.7" cy="-41.8" r="0.8" fill="#fff" />
          <g className="st-maus-nose" style={{ transformOrigin: "0px -33px" }}>
            <circle cx="0" cy="-34" r="3" fill="#ff8fa3" />
            <path d="M-4 -33 H-18 M-4 -31 L-16 -27 M4 -33 H18 M4 -31 L16 -27" stroke="#6c757d" strokeWidth="1.2" />
          </g>
          <ellipse cx="-8" cy="-14" rx="5" ry="3.5" fill="#ced4da" />
          <ellipse cx="8" cy="-14" rx="5" ry="3.5" fill="#ced4da" />
        </g>
      </Inside>
      <path d="M-44 -10 A44 12 0 0 0 44 -10" stroke="#868e96" strokeWidth="5" fill="none" />
    </>
  );
}

/** Mother duck and three ducklings crossing the zebra crossing, walking right. */
export function Enten() {
  return (
    <>
      <g className="st-enten-duck" style={nth(0)}>
        <path d="M44 -2 h8 M58 -2 h8" stroke="#ff8c42" strokeWidth="4" strokeLinecap="round" />
        <path d="M18 -30 L8 -40 L22 -38 Z" fill="#e9ecef" />
        <ellipse cx="46" cy="-26" rx="30" ry="20" fill="#fff" />
        <ellipse className="st-enten-wing" cx="40" cy="-28" rx="16" ry="9" fill="#e9ecef" style={{ transformOrigin: "52px -30px" }} />
        <circle cx="70" cy="-52" r="14" fill="#fff" />
        <path d="M80 -52 L94 -48 L80 -44 Z" fill="#ff8c42" />
        <circle cx="74" cy="-55" r="2.4" fill="#2b2d42" />
        <circle cx="74.7" cy="-55.7" r="0.8" fill="#fff" />
        <g className="st-enten-quack" fill="none" stroke="#ff8c42" strokeWidth="3" strokeLinecap="round">
          <path d="M100 -58 l8 -5 M102 -48 h10 M100 -38 l8 5" />
        </g>
      </g>
      {[-4, -40, -76].map((x, i) => (
        <g key={x} className="st-enten-duck" style={nth(i + 1)}>
          <path d={`M${x - 2} -2 h5 M${x + 6} -2 h5`} stroke="#ff8c42" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx={x} cy="-14" rx="14" ry="10" fill="#ffd60a" />
          <circle cx={x + 11} cy="-28" r="8" fill="#ffd60a" />
          <path d={`M${x + 17} -29 L${x + 25} -27 L${x + 17} -25 Z`} fill="#ff8c42" />
          <circle cx={x + 13} cy="-30" r="1.8" fill="#2b2d42" />
        </g>
      ))}
    </>
  );
}

/** Grandma on a park bench; she waves. */
export function Oma() {
  return (
    <>
      <path className="st-oma-heart" d="M-24 -184 C-24 -196 -40 -196 -40 -184 C-40 -174 -24 -168 -24 -164 C-24 -168 -8 -174 -8 -184 C-8 -196 -24 -196 -24 -184 Z" fill="#ff5d73" />
      <rect x="-82" y="-50" width="8" height="50" fill="#495057" />
      <rect x="74" y="-50" width="8" height="50" fill="#495057" />
      <rect x="-92" y="-114" width="184" height="12" rx="3" fill="#bc6c25" />
      <rect x="-92" y="-94" width="184" height="12" rx="3" fill="#bc6c25" />
      <path d="M-78 -114 V-56 M78 -114 V-56" stroke="#495057" strokeWidth="6" />
      <rect x="-94" y="-58" width="188" height="12" rx="3" fill="#a0522d" />
      <rect x="30" y="-80" width="28" height="24" rx="3" fill="#dda15e" />
      <path d="M30 -74 l6 6 l6 -6 l6 6 l6 -6 l4 4" stroke="#bc6c25" strokeWidth="2" fill="none" />
      {/* Basket: the lid opens and a ball of wool hops out */}
      <circle className="st-oma-wool" cx="44" cy="-84" r="8" fill="#ff8fab" />
      <rect className="st-oma-lid" x="28" y="-84" width="32" height="7" rx="3" fill="#bc6c25" style={{ transformOrigin: "28px -80px" }} />
      {/* Grandma */}
      {[-34, -16].map((x, i) => (
        <g key={x} className="st-oma-leg" style={{ ...nth(i), transformOrigin: `${x}px -50px` }}>
          <rect x={x - 6} y="-52" width="12" height="46" rx="5" fill="#5a189a" />
          <ellipse cx={x + (i ? 2 : -2)} cy="-6" rx="10" ry="5" fill={INK} />
        </g>
      ))}
      <rect x="-50" y="-66" width="62" height="18" rx="9" fill="#5a189a" />
      <path d="M-50 -58 V-100 Q-50 -122 -24 -122 Q2 -122 2 -100 V-58 Z" fill="#9d4edd" />
      <path d="M-24 -120 V-62" stroke="#c77dff" strokeWidth="3" />
      <path d="M-46 -104 Q-40 -76 -26 -70" stroke="#9d4edd" strokeWidth="11" strokeLinecap="round" fill="none" />
      <g className="st-oma-head" style={{ transformOrigin: "-24px -124px" }}>
        <circle cx="-24" cy="-142" r="20" fill={SKIN} />
        <path d="M-45 -140 Q-46 -164 -24 -164 Q-2 -164 -3 -140 Q-6 -154 -24 -154 Q-42 -154 -45 -140 Z" fill="#dee2e6" />
        <circle cx="-24" cy="-168" r="9" fill="#dee2e6" />
        <Face cx={-24} cy={-142} size={0.75} />
        <g fill="none" stroke={INK} strokeWidth="2">
          <circle cx="-29.5" cy="-142" r="6" />
          <circle cx="-18.5" cy="-142" r="6" />
        </g>
      </g>
      <g className="st-oma-arm" style={{ transformOrigin: "-2px -110px" }}>
        <path d="M-2 -110 L6 -74" stroke="#9d4edd" strokeWidth="10" strokeLinecap="round" />
        <circle cx="7" cy="-70" r="6" fill={SKIN} />
      </g>
    </>
  );
}

/** Swing with a child on it. */
export function Schaukel() {
  return (
    <>
      <g className="st-schaukel-swing" style={{ transformOrigin: "0px -172px" }}>
        <path d="M-24 -172 V-52 M24 -172 V-52" stroke="#8d5a2b" strokeWidth="3" />
        <g className="st-schaukel-legs" style={{ transformOrigin: "0px -50px" }}>
          <path d="M-8 -50 V-22 M8 -50 V-22" stroke="#3a86ff" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="-9" cy="-19" rx="7" ry="4" fill={INK} />
          <ellipse cx="9" cy="-19" rx="7" ry="4" fill={INK} />
        </g>
        <rect x="-32" y="-54" width="64" height="9" rx="3" fill="#ffb703" />
        <rect x="-16" y="-92" width="32" height="42" rx="12" fill="#06d6a0" />
        <path d="M-14 -84 L-23 -98 M14 -84 L23 -98" stroke="#06d6a0" strokeWidth="8" strokeLinecap="round" />
        <circle cx="-24" cy="-100" r="4.5" fill={SKIN} />
        <circle cx="24" cy="-100" r="4.5" fill={SKIN} />
        <g className="st-schaukel-head" style={{ transformOrigin: "0px -94px" }}>
          <circle cx="0" cy="-110" r="17" fill={SKIN} />
          <path d="M-17 -112 Q-18 -130 0 -129 Q18 -130 17 -112 Q8 -122 -17 -112 Z" fill="#2b2d42" />
          <Face cx={0} cy={-110} size={0.62} />
        </g>
      </g>
      <path d="M-112 0 L-92 -176 L-72 0 M72 0 L92 -176 L112 0" stroke="#e63946" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-96 -174 H96" stroke="#e63946" strokeWidth="10" strokeLinecap="round" />
    </>
  );
}

/** A child on a scooter. */
export function Roller() {
  return (
    <g className="st-roller-ride">
      <path d="M36 -14 L28 -124" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" />
      <path d="M14 -124 H42" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <g className="st-roller-leg" style={{ transformOrigin: "0px -70px" }}>
        <path d="M2 -70 L-20 -32 L-30 -8" stroke="#3a86ff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <ellipse cx="-32" cy="-6" rx="9" ry="5" fill={INK} />
      </g>
      <rect x="-50" y="-22" width="88" height="9" rx="4" fill="#06d6a0" />
      {[-42, 34].map((cx) => (
        <g key={cx} className="st-roller-wheel" style={{ transformOrigin: `${cx}px -10px` }}>
          <circle cx={cx} cy="-10" r="10" fill={INK} />
          <path d={`M${cx - 6} -10 H${cx + 6}`} stroke="#adb5bd" strokeWidth="3" />
        </g>
      ))}
      <path d="M-6 -70 L-8 -26" stroke="#3a86ff" strokeWidth="12" strokeLinecap="round" />
      <ellipse cx="-4" cy="-24" rx="10" ry="5" fill={INK} />
      <rect x="-18" y="-118" width="34" height="54" rx="14" fill="#ff5d73" />
      <path d="M10 -108 L26 -122" stroke="#ff5d73" strokeWidth="9" strokeLinecap="round" />
      <circle cx="28" cy="-124" r="5" fill={SKIN} />
      <g className="st-roller-head" style={{ transformOrigin: "0px -120px" }}>
        <circle cx="0" cy="-140" r="20" fill={SKIN} />
        <path d="M-21 -142 Q-21 -166 0 -166 Q21 -166 21 -142 Z" fill="#ffd60a" />
        <rect x="-23" y="-146" width="46" height="6" rx="3" fill="#ffc300" />
        <Face cx={4} cy={-136} size={0.7} />
      </g>
    </g>
  );
}

/** A girl holding a red balloon. */
export function Luftballon() {
  return (
    <g className="st-ballon-kid" style={{ transformOrigin: "0px 0px" }}>
      <g className="st-ballon-balloon" style={{ transformOrigin: "14px -100px" }}>
        <path d="M14 -100 Q30 -170 22 -224" stroke="#adb5bd" strokeWidth="2" fill="none" />
        <ellipse cx="22" cy="-258" rx="30" ry="36" fill="#e63946" />
        <path d="M18 -223 L22 -218 L26 -223 Z" fill="#c1121f" />
        <ellipse cx="12" cy="-272" rx="8" ry="12" fill="#fff" opacity="0.5" />
      </g>
      <rect x="-14" y="-44" width="11" height="40" rx="5" fill={SKIN} />
      <rect x="3" y="-44" width="11" height="40" rx="5" fill={SKIN} />
      <ellipse cx="-10" cy="-4" rx="9" ry="5" fill="#e63946" />
      <ellipse cx="10" cy="-4" rx="9" ry="5" fill="#e63946" />
      <path d="M-26 -42 L-16 -96 H16 L26 -42 Z" fill="#ffb703" />
      <g className="st-ballon-arm" style={{ transformOrigin: "-16px -88px" }}>
        <path d="M-16 -88 L-28 -62" stroke="#ffb703" strokeWidth="8" strokeLinecap="round" />
        <circle cx="-29" cy="-58" r="5" fill={SKIN} />
      </g>
      <path d="M12 -90 L14 -100" stroke="#ffb703" strokeWidth="8" strokeLinecap="round" />
      <circle cx="14" cy="-102" r="5" fill={SKIN} />
      <circle cx="0" cy="-116" r="18" fill={SKIN} />
      {[-20, 20].map((x) => (
        <circle key={x} className="st-ballon-tail" cx={x} cy="-120" r="7" fill="#6b4423" style={{ transformOrigin: `${x / 2}px -122px` }} />
      ))}
      <path d="M-18 -116 Q-19 -136 0 -135 Q19 -136 18 -116 Q8 -126 -18 -116 Z" fill="#6b4423" />
      <Face cx={0} cy={-114} size={0.65} />
    </g>
  );
}

/** Ladybird; she opens her wings and flies a loop. */
export function Marienkaefer() {
  return (
    <g className="st-kaefer-body">
      <g className="st-kaefer-wings" fill="#dee2e6" opacity="0.8">
        <ellipse cx="-12" cy="-22" rx="12" ry="7" />
        <ellipse cx="12" cy="-22" rx="12" ry="7" />
      </g>
      <path className="st-kaefer-antenna" d="M20 -16 q4 -8 10 -8 M22 -12 q6 -4 12 -2" stroke="#2b2d42" strokeWidth="1.8" fill="none" strokeLinecap="round" style={{ transformOrigin: "20px -14px" }} />
      <circle cx="16" cy="-10" r="8" fill="#2b2d42" />
      <circle cx="19" cy="-12" r="1.6" fill="#fff" />
      <g className="st-kaefer-left" style={{ transformOrigin: "0px -24px" }}>
        <path d="M0 -24 A14 14 0 0 0 0 4 Z" fill="#e63946" />
        <circle cx="-6" cy="-16" r="3" fill="#2b2d42" />
        <circle cx="-7" cy="-4" r="2.5" fill="#2b2d42" />
      </g>
      <g className="st-kaefer-right" style={{ transformOrigin: "0px -24px" }}>
        <path d="M0 -24 A14 14 0 0 1 0 4 Z" fill="#e63946" />
        <circle cx="6" cy="-14" r="2.5" fill="#2b2d42" />
        <circle cx="7" cy="-3" r="3" fill="#2b2d42" />
      </g>
      <path d="M0 -24 V4" stroke="#2b2d42" strokeWidth="1.5" />
    </g>
  );
}
