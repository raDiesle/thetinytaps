import { CHEEK, Eye, INK, nth } from "../shared";

// The farm animals. Each drawing has its foot point at (0, 0), except those that sit on
// something else: the owl (barn), the stork and the cat (farmhouse), the duck (water line)
// and the swallow (in the sky, centred on its body).

const EYE = "#2b2d42";

/** Owl in the hayloft, in the barn's coordinates. */
export function Eule() {
  return (
    <g className="bh-eule-body" style={{ transformOrigin: "0px -214px" }}>
      <g className="bh-eule-wing" style={{ transformOrigin: "-16px -236px" }}>
        <ellipse cx="-20" cy="-228" rx="9" ry="16" fill="#7f5539" />
      </g>
      <g className="bh-eule-wing bh-eule-wing-right" style={{ transformOrigin: "16px -236px" }}>
        <ellipse cx="20" cy="-228" rx="9" ry="16" fill="#7f5539" />
      </g>
      <ellipse cx="0" cy="-232" rx="21" ry="22" fill="#a47148" />
      <ellipse cx="0" cy="-226" rx="12" ry="14" fill="#e6ccb2" />
      <path d="M-5 -230 l3 3 l3 -3 M-5 -222 l3 3 l3 -3 M1 -226 l3 3 l3 -3" stroke="#b08968" strokeWidth="1.5" fill="none" />
      <g className="bh-eule-head" style={{ transformOrigin: "0px -250px" }}>
        <path d="M-20 -262 L-18 -280 L-8 -266 Z M20 -262 L18 -280 L8 -266 Z" fill="#7f5539" />
        <ellipse cx="0" cy="-256" rx="21" ry="16" fill="#a47148" />
        <circle cx="-9" cy="-257" r="9" fill="#fefae0" />
        <circle cx="9" cy="-257" r="9" fill="#fefae0" />
        <Eye cx={-9} cy={-257} r={4.5} />
        <Eye cx={9} cy={-257} r={4.5} />
        <g className="bh-eule-lids" fill="#a47148">
          <circle cx="-9" cy="-257" r="9.5" />
          <circle cx="9" cy="-257" r="9.5" />
        </g>
        <path d="M-4 -250 L0 -242 L4 -250 Z" fill="#f4a261" />
      </g>
      <path d="M-8 -210 v4 M-3 -210 v4 M3 -210 v4 M8 -210 v4" stroke="#f4a261" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/** Stork in its nest on the chimney, in the farmhouse's coordinates. */
export function Storch() {
  return (
    <g className="bh-storch-body" style={{ transformOrigin: "86px -346px" }}>
      <path d="M80 -348 V-386 M92 -348 L96 -384" stroke="#f3722c" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="82" cy="-398" rx="30" ry="18" fill="#fff" />
      <path d="M54 -400 L44 -392 L58 -390 Z" fill="#fff" />
      <g className="bh-storch-wing" style={{ transformOrigin: "86px -404px" }}>
        <path d="M58 -398 Q70 -416 104 -406 Q90 -386 58 -392 Z" fill={INK} />
        <path d="M62 -400 Q76 -412 100 -405" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g className="bh-storch-head" style={{ transformOrigin: "100px -406px" }}>
        <path d="M100 -408 Q112 -424 108 -440" stroke="#fff" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="110" cy="-442" r="11" fill="#fff" />
        <Eye cx={113} cy={-445} r={2.4} />
        <path className="bh-storch-beak-top" d="M118 -446 L156 -440 L118 -440 Z" fill="#f3722c" style={{ transformOrigin: "118px -443px" }} />
        <path className="bh-storch-beak-bottom" d="M118 -440 L154 -438 L118 -436 Z" fill="#e85d04" style={{ transformOrigin: "118px -438px" }} />
      </g>
    </g>
  );
}

/** Ginger cat sitting by the farmhouse door, in the farmhouse's coordinates. */
export function Katze() {
  return (
    <g className="bh-katze-body" style={{ transformOrigin: "-30px 0px" }}>
      <path className="bh-katze-tail" d="M-14 -6 Q8 -6 10 -30" stroke="#f4a261" strokeWidth="7" strokeLinecap="round" fill="none" style={{ transformOrigin: "-14px -6px" }} />
      <ellipse cx="-30" cy="-26" rx="19" ry="26" fill="#f4a261" />
      <path d="M-44 -34 h8 M-46 -24 h8 M-16 -34 h-8 M-14 -24 h-8" stroke="#e76f51" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="-30" cy="-22" rx="9" ry="14" fill="#fff4e6" />
      <ellipse cx="-38" cy="-3" rx="6" ry="4" fill="#fff4e6" />
      <ellipse cx="-22" cy="-3" rx="6" ry="4" fill="#fff4e6" />
      <g className="bh-katze-head" style={{ transformOrigin: "-30px -48px" }}>
        <path d="M-46 -66 L-44 -88 L-34 -74 Z M-14 -66 L-16 -88 L-26 -74 Z" fill="#f4a261" />
        <path d="M-43 -71 L-42 -81 L-37 -74 Z M-17 -71 L-18 -81 L-23 -74 Z" fill="#ffb3c1" />
        <circle cx="-30" cy="-62" r="17" fill="#f4a261" />
        <path d="M-34 -76 l1 5 M-30 -77 v5 M-26 -76 l-1 5" stroke="#e76f51" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="-30" cy="-55" rx="8" ry="5" fill="#fff4e6" />
        <Eye cx={-36} cy={-64} r={2.6} />
        <Eye cx={-24} cy={-64} r={2.6} />
        <path d="M-32.5 -58 H-27.5 L-30 -55.5 Z" fill="#ff8fa3" />
        <path d="M-50 -57 H-39 M-21 -57 H-10" stroke="#6c757d" strokeWidth="1.3" />
      </g>
    </g>
  );
}

/** Brown horse on the pasture, facing right; it rears up and neighs. */
export function Pferd() {
  return (
    <g className="bh-pferd-body" style={{ transformOrigin: "-50px 0px" }}>
      <path className="bh-pferd-tail" d="M-90 -156 Q-120 -130 -108 -64" stroke="#5e3a1f" strokeWidth="18" strokeLinecap="round" fill="none" style={{ transformOrigin: "-90px -156px" }} />
      {[-66, -40, 48, 74].map((x) => (
        <g key={x}>
          <rect x={x - 9} y="-130" width="18" height="118" rx="7" fill={x === -40 || x === 74 ? "#a0522d" : "#8b4513"} />
          <rect x={x - 10} y="-16" width="20" height="16" rx="4" fill="#3d2b1f" />
        </g>
      ))}
      <ellipse cx="0" cy="-146" rx="98" ry="46" fill="#a0522d" />
      <ellipse cx="-14" cy="-166" rx="60" ry="14" fill="#fff" opacity="0.18" />
      <path d="M44 -170 L92 -246 L132 -230 L96 -136 Z" fill="#a0522d" />
      <g className="bh-pferd-head" style={{ transformOrigin: "110px -232px" }}>
        <path d="M104 -254 L110 -282 L122 -256 Z" fill="#8b4513" />
        <path d="M90 -252 Q110 -276 132 -256 L176 -208 Q184 -188 164 -182 L142 -186 Q120 -200 98 -226 Z" fill="#a0522d" />
        <path d="M114 -258 L162 -204 L154 -198 L108 -250 Z" fill="#fff" opacity="0.9" />
        <ellipse cx="164" cy="-196" rx="17" ry="13" fill="#c68a5a" />
        <ellipse cx="172" cy="-198" rx="3" ry="2.4" fill="#3d2b1f" />
        <path d="M156 -186 Q164 -182 172 -186" stroke="#3d2b1f" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Eye cx={118} cy={-238} r={4} />
      </g>
      <path d="M86 -268 Q66 -232 44 -176 L60 -172 Q84 -224 104 -256 Z" fill="#5e3a1f" />
    </g>
  );
}

const COW_SPOTS = "M-60 -186 Q-30 -196 -20 -170 Q-30 -140 -62 -150 Z M20 -150 Q50 -170 70 -140 Q60 -110 26 -120 Z M60 -190 Q84 -190 96 -168 Q74 -164 60 -190 Z";

/** Black-and-white cow on the pasture, facing left; she nods and her bell rings. */
export function Kuh() {
  return (
    <g className="bh-kuh-body">
      <g className="bh-kuh-tail" style={{ transformOrigin: "96px -170px" }}>
        <path d="M96 -170 Q116 -130 108 -80" stroke="#f8f9fa" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="108" cy="-74" rx="7" ry="11" fill={INK} />
      </g>
      {[-64, -40, 44, 68].map((x) => (
        <g key={x}>
          <rect x={x - 10} y="-120" width="20" height="108" rx="8" fill={x === -40 || x === 68 ? "#f8f9fa" : "#e9ecef"} />
          <rect x={x - 11} y="-16" width="22" height="16" rx="4" fill="#495057" />
        </g>
      ))}
      <ellipse cx="34" cy="-94" rx="22" ry="12" fill="#ffc8dd" />
      <rect x="-100" y="-200" width="200" height="112" rx="50" fill="#f8f9fa" />
      <path d={COW_SPOTS} fill={INK} />
      <path d="M-80 -194 H70" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <g className="bh-kuh-head" style={{ transformOrigin: "-96px -164px" }}>
        <path d="M-146 -212 Q-160 -236 -144 -244 M-114 -212 Q-100 -236 -116 -244" stroke="#e9c46a" strokeWidth="8" strokeLinecap="round" fill="none" />
        <ellipse cx="-168" cy="-196" rx="16" ry="8" fill="#f8f9fa" transform="rotate(-20 -168 -196)" />
        <ellipse cx="-92" cy="-196" rx="16" ry="8" fill="#f8f9fa" transform="rotate(20 -92 -196)" />
        <ellipse cx="-130" cy="-180" rx="34" ry="38" fill="#f8f9fa" />
        <path d="M-150 -212 Q-128 -214 -130 -190 Q-150 -184 -158 -198 Z" fill={INK} />
        <ellipse cx="-130" cy="-148" rx="32" ry="20" fill="#ffc8dd" />
        <ellipse cx="-142" cy="-148" rx="4" ry="5" fill="#e5989b" />
        <ellipse cx="-118" cy="-148" rx="4" ry="5" fill="#e5989b" />
        <Eye cx={-144} cy={-186} r={4.2} />
        <Eye cx={-116} cy={-186} r={4.2} />
        <g className="bh-kuh-bell" style={{ transformOrigin: "-130px -128px" }}>
          <path d="M-150 -132 Q-130 -122 -110 -132" stroke="#bc6c25" strokeWidth="5" fill="none" />
          <path d="M-140 -126 H-120 L-116 -104 H-144 Z" fill="#ffd166" />
          <circle cx="-130" cy="-102" r="4" fill="#bc6c25" />
        </g>
      </g>
    </g>
  );
}

/** Cock on a fence post, facing right; he stretches and crows. */
export function Hahn() {
  return (
    <>
      <rect x="-12" y="-96" width="24" height="96" fill="#8d5a2b" />
      <rect x="-14" y="-100" width="28" height="8" rx="3" fill="#7f5539" />
      <g className="bh-hahn-body" style={{ transformOrigin: "0px -100px" }}>
        <path d="M-6 -100 V-114 M8 -100 V-114" stroke="#ffb703" strokeWidth="4" strokeLinecap="round" />
        <path d="M-18 -128 Q-66 -160 -48 -204" stroke="#264653" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M-18 -128 Q-50 -142 -60 -180" stroke="#2a9d8f" strokeWidth="11" strokeLinecap="round" fill="none" />
        <path d="M-18 -126 Q-44 -126 -58 -150" stroke="#e9c46a" strokeWidth="10" strokeLinecap="round" fill="none" />
        <ellipse cx="0" cy="-132" rx="30" ry="24" fill="#d9480f" />
        <g className="bh-hahn-wing" style={{ transformOrigin: "-2px -140px" }}>
          <ellipse cx="-4" cy="-132" rx="18" ry="12" fill="#9c3a0e" />
        </g>
        <g className="bh-hahn-head" style={{ transformOrigin: "14px -148px" }}>
          <ellipse cx="16" cy="-152" rx="13" ry="18" fill="#f4a261" />
          <path d="M10 -184 q2 -10 8 -4 q4 -10 9 -2 q6 -6 7 4 Z" fill="#e63946" />
          <circle cx="22" cy="-172" r="13" fill="#f4a261" />
          <ellipse cx="30" cy="-156" rx="4.5" ry="7" fill="#e63946" />
          <path className="bh-hahn-beak" d="M33 -176 L46 -171 L33 -167 Z" fill="#ffb703" style={{ transformOrigin: "33px -171px" }} />
          <Eye cx={26} cy={-175} r={2.6} />
        </g>
      </g>
      <g className="bh-hahn-notes" fill={INK}>
        {[0, 1, 2].map((i) => (
          <g key={i} style={nth(i)}>
            <circle cx={60 + i * 18} cy={-178 - i * 14} r="5" />
            <path d={`M${65 + i * 18} ${-178 - i * 14} V${-200 - i * 14}`} stroke={INK} strokeWidth="2.5" />
          </g>
        ))}
      </g>
    </>
  );
}

const WOOL = [
  [-38, -66, 22],
  [-18, -82, 24],
  [8, -84, 24],
  [32, -72, 22],
  [-30, -46, 20],
  [0, -50, 24],
  [28, -48, 20],
];

/** Fluffy sheep on the meadow, facing right; it hops. */
export function Schaf() {
  return (
    <g className="bh-schaf-body" style={{ transformOrigin: "0px 0px" }}>
      {[-30, -12, 18, 34].map((x) => (
        <rect key={x} x={x - 4.5} y="-44" width="9" height="44" rx="4" fill="#343a40" />
      ))}
      <g className="bh-schaf-wool" style={{ transformOrigin: "0px -40px" }}>
        {WOOL.map(([cx, cy, r]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill="#f8f9fa" />
        ))}
        <ellipse cx="0" cy="-52" rx="44" ry="20" fill="#e9ecef" opacity="0.6" />
        <circle cx="-14" cy="-90" r="8" fill="#fff" />
      </g>
      <g className="bh-schaf-head" style={{ transformOrigin: "42px -70px" }}>
        <ellipse cx="44" cy="-74" rx="10" ry="5" fill="#343a40" transform="rotate(30 44 -74)" />
        <ellipse cx="58" cy="-70" rx="16" ry="20" fill="#343a40" />
        <ellipse cx="72" cy="-80" rx="10" ry="5" fill="#343a40" transform="rotate(-30 72 -80)" />
        <circle cx="52" cy="-90" r="9" fill="#f8f9fa" />
        <circle cx="62" cy="-92" r="8" fill="#f8f9fa" />
        <circle cx="54" cy="-74" r="3" fill="#fff" />
        <circle cx="54" cy="-74" r="1.6" fill={EYE} />
        <circle cx="66" cy="-74" r="3" fill="#fff" />
        <circle cx="66" cy="-74" r="1.6" fill={EYE} />
        <path d="M56 -58 Q60 -55 64 -58" stroke="#adb5bd" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Goat with a little beard, facing left; it stands up on its hind legs. */
export function Ziege() {
  return (
    <g className="bh-ziege-body" style={{ transformOrigin: "40px 0px" }}>
      <path d="M50 -96 L64 -112 L60 -92 Z" fill="#c8a27a" />
      {[-38, -22, 26, 42].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="-74" width="12" height="66" rx="5" fill={x < 0 ? "#c8a27a" : "#b08968"} />
          <rect x={x - 7} y="-10" width="14" height="10" rx="3" fill="#495057" />
        </g>
      ))}
      <ellipse cx="2" cy="-86" rx="58" ry="30" fill="#c8a27a" />
      <ellipse cx="-4" cy="-74" rx="36" ry="14" fill="#f8f9fa" opacity="0.7" />
      <g className="bh-ziege-head" style={{ transformOrigin: "-44px -100px" }}>
        <path d="M-44 -100 L-58 -128 L-34 -118 Z" fill="#c8a27a" />
        <path d="M-56 -138 Q-46 -158 -26 -150 M-64 -138 Q-58 -160 -38 -158" stroke="#868e96" strokeWidth="6" strokeLinecap="round" fill="none" />
        <ellipse cx="-44" cy="-132" rx="14" ry="6" fill="#b08968" transform="rotate(-20 -44 -132)" />
        <path d="M-60 -144 Q-48 -144 -50 -126 L-76 -100 Q-90 -96 -88 -108 Z" fill="#c8a27a" />
        <path d="M-80 -98 Q-78 -80 -70 -86 Q-72 -94 -74 -100 Z" fill="#f8f9fa" />
        <Eye cx={-62} cy={-128} r={3} />
        <ellipse cx="-84" cy="-104" rx="3" ry="2" fill="#495057" />
      </g>
    </g>
  );
}

/** White goose on the dirt road, facing left; it stretches its neck and flaps. */
export function Gans() {
  return (
    <g className="bh-gans-body" style={{ transformOrigin: "4px 0px" }}>
      <path d="M-6 -20 V-4 M10 -20 V-4" stroke="#f77f00" strokeWidth="4" />
      <path d="M-16 0 h16 l-6 -6 Z M2 0 h16 l-6 -6 Z" fill="#f77f00" />
      <path d="M44 -48 L64 -62 L50 -34 Z" fill="#e9ecef" />
      <ellipse cx="10" cy="-40" rx="40" ry="24" fill="#f8f9fa" />
      <g className="bh-gans-wing" style={{ transformOrigin: "34px -48px" }}>
        <ellipse cx="18" cy="-44" rx="26" ry="13" fill="#dee2e6" />
        <path d="M2 -40 h26 M6 -34 h22" stroke="#ced4da" strokeWidth="2" />
      </g>
      <g className="bh-gans-neck" style={{ transformOrigin: "-16px -46px" }}>
        <path d="M-18 -46 Q-24 -74 -30 -98" stroke="#f8f9fa" strokeWidth="16" strokeLinecap="round" fill="none" />
        <ellipse cx="-32" cy="-104" rx="14" ry="11" fill="#f8f9fa" />
        <path d="M-44 -108 L-64 -102 L-44 -97 Z" fill="#f77f00" />
        <Eye cx={-34} cy={-108} r={2.4} />
      </g>
    </g>
  );
}

/** Black-and-white farm dog on the dirt road, facing right; it jumps and barks. */
export function Hund() {
  return (
    <g className="bh-hund-body" style={{ transformOrigin: "0px 0px" }}>
      <path className="bh-hund-tail" d="M-48 -70 Q-74 -76 -80 -102" stroke={INK} strokeWidth="12" strokeLinecap="round" fill="none" style={{ transformOrigin: "-48px -70px" }} />
      {[-40, -22, 26, 44].map((x) => (
        <rect key={x} x={x - 6} y="-54" width="12" height="54" rx="5" fill={x < 0 ? "#e9ecef" : "#f8f9fa"} />
      ))}
      <ellipse cx="0" cy="-64" rx="56" ry="25" fill={INK} />
      <ellipse cx="34" cy="-56" rx="22" ry="18" fill="#f8f9fa" />
      <path d="M-30 -84 Q0 -94 30 -84" stroke="#fff" strokeOpacity="0.2" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g className="bh-hund-head" style={{ transformOrigin: "44px -82px" }}>
        <circle cx="58" cy="-98" r="23" fill={INK} />
        <path d="M54 -122 L62 -96 L68 -122 Z" fill="#f8f9fa" opacity="0.9" />
        <ellipse cx="74" cy="-88" rx="17" ry="12" fill="#f8f9fa" />
        <ellipse cx="88" cy="-92" rx="5.5" ry="4.5" fill={EYE} />
        <path d="M40 -114 Q30 -104 38 -84 Q48 -92 50 -110 Z" fill="#212529" />
        <Eye cx={64} cy={-104} r={3.4} />
        <circle cx="70" cy="-92" r="4" fill={CHEEK} opacity="0.5" />
        <path d="M84 -82 Q78 -76 70 -79" stroke={EYE} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse className="bh-hund-tongue" cx="76" cy="-74" rx="5" ry="7" fill="#ff5d73" style={{ transformOrigin: "76px -80px" }} />
      </g>
    </g>
  );
}

/** A pig; the piglet is the same pig, smaller and turned round. */
function Pig() {
  return (
    <g className="bh-schwein-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-62 -64 q-16 -4 -12 -16 q6 -8 10 0" stroke="#f4a3c1" strokeWidth="4" fill="none" strokeLinecap="round" />
      {[-40, -22, 26, 44].map((x) => (
        <g key={x}>
          <rect x={x - 8} y="-30" width="16" height="30" rx="5" fill={x < 0 ? "#f4a3c1" : "#ffafcc"} />
          <rect x={x - 8} y="-8" width="16" height="8" rx="3" fill="#c9778f" />
        </g>
      ))}
      <ellipse cx="0" cy="-54" rx="66" ry="40" fill="#ffafcc" />
      <ellipse cx="-12" cy="-76" rx="38" ry="10" fill="#fff" opacity="0.35" />
      <ellipse cx="-26" cy="-36" rx="14" ry="8" fill="#8d6e4f" opacity="0.8" />
      <ellipse cx="22" cy="-28" rx="10" ry="6" fill="#8d6e4f" opacity="0.7" />
      <g className="bh-schwein-head" style={{ transformOrigin: "50px -62px" }}>
        <circle cx="64" cy="-66" r="30" fill="#ffafcc" />
        <path d="M48 -88 L50 -112 L66 -94 Z" fill="#f78fb3" />
        <path d="M70 -94 L84 -110 L84 -88 Z" fill="#f78fb3" />
        <ellipse cx="92" cy="-60" rx="12" ry="14" fill="#f78fb3" />
        <ellipse cx="90" cy="-64" rx="2.6" ry="4" fill="#c9778f" />
        <ellipse cx="96" cy="-56" rx="2.6" ry="4" fill="#c9778f" />
        <Eye cx={74} cy={-76} r={3.6} />
        <circle cx="66" cy="-58" r="6" fill={CHEEK} opacity="0.5" />
        <path d="M70 -44 Q78 -40 84 -44" stroke={EYE} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
      <g className="bh-schwein-splash" fill="#8d6e4f">
        {[
          [-50, -10, 8],
          [-10, -6, 10],
          [36, -8, 7],
          [70, -10, 6],
        ].map(([cx, cy, r], i) => (
          <circle key={cx} cx={cx} cy={cy} r={r} style={nth(i)} />
        ))}
      </g>
    </g>
  );
}

/** Pig in the mud puddle, facing right; it rolls about and splashes. */
export function Schwein() {
  return <Pig />;
}

/** Piglet next to the pig, facing left. */
export function Ferkel() {
  return (
    <g transform="scale(-0.58 0.58)">
      <Pig />
    </g>
  );
}

/** Brown hen, facing left; she pecks grains and lays an egg. */
export function Huhn() {
  return (
    <g className="bh-huhn-body" style={{ transformOrigin: "0px 0px" }}>
      <ellipse className="bh-huhn-egg" cx="40" cy="-10" rx="9" ry="11" fill="#fff8e7" />
      <path d="M-6 -20 V0 M8 -20 V0" stroke="#ffb703" strokeWidth="4" strokeLinecap="round" />
      <path d="M26 -50 Q54 -80 40 -98 Q34 -72 18 -62 Z" fill="#7f4f24" />
      <ellipse cx="6" cy="-44" rx="34" ry="28" fill="#c97b4a" />
      <g className="bh-huhn-wing" style={{ transformOrigin: "24px -50px" }}>
        <ellipse cx="14" cy="-44" rx="20" ry="13" fill="#a0522d" />
      </g>
      <g className="bh-huhn-head" style={{ transformOrigin: "-16px -58px" }}>
        <path d="M-32 -88 q2 -10 8 -4 q4 -8 8 0 q4 2 2 6 Z" fill="#e63946" />
        <circle cx="-24" cy="-74" r="15" fill="#c97b4a" />
        <ellipse cx="-34" cy="-62" rx="4" ry="6" fill="#e63946" />
        <path d="M-38 -78 L-50 -74 L-38 -70 Z" fill="#ffb703" />
        <Eye cx={-28} cy={-78} r={2.6} />
      </g>
      <g fill="#e9c46a">
        <circle cx="-54" cy="-3" r="3" />
        <circle cx="-64" cy="-4" r="2.5" />
        <circle cx="-46" cy="-2" r="2.5" />
      </g>
    </g>
  );
}

/** Chick next to its eggshell, facing left; it hops and peeps. */
export function Kueken() {
  return (
    <>
      <path d="M22 0 Q20 -30 38 -30 Q56 -30 54 0 Z" fill="#fff8e7" />
      <path d="M22 -16 l6 -8 l6 8 l6 -8 l6 8 l6 -8 l2 4" stroke="#e9ecef" strokeWidth="2" fill="none" />
      <g className="bh-kueken-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-4 -6 V0 M6 -6 V0" stroke="#f77f00" strokeWidth="3" strokeLinecap="round" />
        <circle cx="0" cy="-24" r="20" fill="#ffd60a" />
        <ellipse className="bh-kueken-wing" cx="6" cy="-24" rx="10" ry="7" fill="#ffc300" style={{ transformOrigin: "12px -26px" }} />
        <circle cx="-10" cy="-46" r="14" fill="#ffd60a" />
        <path d="M-12 -60 q0 -8 6 -8 M-8 -60 q4 -6 8 -2" stroke="#ffc300" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M-22 -48 L-32 -45 L-22 -42 Z" fill="#f77f00" />
        <Eye cx={-14} cy={-50} r={2.4} />
        <circle cx="-8" cy="-42" r="3" fill={CHEEK} opacity="0.5" />
      </g>
    </>
  );
}

/** Snail with a red shell, facing left; it pulls its eyes in and slides on. */
export function Schnecke() {
  return (
    <g className="bh-schnecke-body">
      <path d="M-44 0 Q-46 -14 -32 -18 H30 Q46 -14 46 0 Z" fill="#d4a373" />
      <path d="M-40 -2 H40" stroke="#e9c46a" strokeWidth="3" opacity="0.6" />
      <path d="M-32 -16 Q-36 -30 -32 -40" stroke="#d4a373" strokeWidth="14" strokeLinecap="round" fill="none" />
      <g className="bh-schnecke-eyes" style={{ transformOrigin: "-32px -42px" }}>
        <path d="M-34 -42 L-42 -62 M-30 -42 L-24 -64" stroke="#d4a373" strokeWidth="4" strokeLinecap="round" />
        <circle cx="-42" cy="-64" r="4" fill={EYE} />
        <circle cx="-24" cy="-66" r="4" fill={EYE} />
      </g>
      <path d="M-38 -32 Q-34 -28 -30 -32" stroke={EYE} strokeWidth="2" fill="none" strokeLinecap="round" />
      <g className="bh-schnecke-shell" style={{ transformOrigin: "8px -18px" }}>
        <circle cx="8" cy="-40" r="26" fill="#e76f51" />
        <path d="M8 -40 m-4 0 a4 4 0 1 1 8 0 a10 10 0 1 1 -18 -4 a16 16 0 1 1 28 14" stroke="#bc4b51" strokeWidth="4" fill="none" strokeLinecap="round" />
        <circle cx="-4" cy="-54" r="5" fill="#fff" opacity="0.5" />
      </g>
    </g>
  );
}

/** Rabbit sitting by a carrot, facing left; it hops, wiggles its ears and sniffs. */
export function Hase() {
  return (
    <>
      <path d="M-74 -4 L-52 -14 L-46 -2 Z" fill="#f77f00" />
      <path d="M-52 -14 l6 -14 M-50 -12 l12 -8 M-48 -10 l2 -16" stroke="#40916c" strokeWidth="3" strokeLinecap="round" />
      <g className="bh-hase-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="10" cy="-4" rx="26" ry="7" fill="#9c6644" />
        <circle cx="38" cy="-28" r="10" fill="#fff" />
        <ellipse cx="6" cy="-36" rx="34" ry="32" fill="#b08968" />
        <ellipse cx="-4" cy="-26" rx="16" ry="18" fill="#e6ccb2" />
        <ellipse cx="-16" cy="-6" rx="8" ry="5" fill="#e6ccb2" />
        <g className="bh-hase-head" style={{ transformOrigin: "-12px -60px" }}>
          <g className="bh-hase-ears" style={{ transformOrigin: "-14px -90px" }}>
            <ellipse cx="-26" cy="-118" rx="9" ry="28" fill="#b08968" transform="rotate(-10 -26 -118)" />
            <ellipse cx="-26" cy="-116" rx="4" ry="20" fill="#ffb3c1" transform="rotate(-10 -26 -116)" />
            <ellipse cx="-4" cy="-116" rx="9" ry="28" fill="#b08968" transform="rotate(12 -4 -116)" />
            <ellipse cx="-4" cy="-114" rx="4" ry="20" fill="#ffb3c1" transform="rotate(12 -4 -114)" />
          </g>
          <circle cx="-20" cy="-76" r="22" fill="#b08968" />
          <ellipse cx="-34" cy="-68" rx="10" ry="8" fill="#e6ccb2" />
          <ellipse className="bh-hase-nose" cx="-42" cy="-72" rx="4" ry="3" fill="#ff8fa3" />
          <rect x="-38" y="-62" width="6" height="6" rx="1" fill="#fff" />
          <Eye cx={-26} cy={-82} r={3.2} />
          <circle cx="-18" cy="-70" r="4" fill={CHEEK} opacity="0.45" />
        </g>
      </g>
    </>
  );
}

/** Bee at the sunflower, in the sunflower's coordinates; it flies a loop. */
export function Biene() {
  return (
    <g className="bh-biene-flight">
      <g className="bh-biene-wings" style={{ transformOrigin: "30px -244px" }}>
        <ellipse cx="22" cy="-252" rx="9" ry="12" fill="#fff" opacity="0.75" transform="rotate(-20 22 -252)" />
        <ellipse cx="36" cy="-252" rx="9" ry="12" fill="#fff" opacity="0.75" transform="rotate(20 36 -252)" />
      </g>
      <path d="M48 -234 L56 -232 L48 -230 Z" fill={INK} />
      <ellipse cx="32" cy="-234" rx="17" ry="12" fill="#ffd60a" />
      <path d="M26 -245 V-223 M36 -245 V-223" stroke={INK} strokeWidth="5" />
      <circle cx="14" cy="-236" r="9" fill={INK} />
      <circle cx="11" cy="-238" r="2" fill="#fff" />
      <path d="M12 -244 q-4 -8 -10 -8 M16 -244 q0 -8 4 -10" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** White duck on the pond, facing left; it dips its head and makes ripples. */
export function Ente() {
  return (
    <>
      <g className="bh-ente-ripples" fill="none" stroke="#fff">
        {[0, 1].map((i) => (
          <ellipse key={i} cx="0" cy="2" rx="60" ry="10" strokeWidth="3" style={nth(i)} />
        ))}
      </g>
      <g className="bh-ente-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-40 0 Q-46 -38 0 -40 Q30 -40 48 -56 Q48 -20 40 0 Z" fill="#f8f9fa" />
        <g className="bh-ente-wing" style={{ transformOrigin: "24px -26px" }}>
          <ellipse cx="10" cy="-22" rx="24" ry="12" fill="#e9ecef" />
        </g>
        <g className="bh-ente-head" style={{ transformOrigin: "-26px -34px" }}>
          <path d="M-30 -34 Q-36 -46 -32 -56" stroke="#f8f9fa" strokeWidth="16" strokeLinecap="round" fill="none" />
          <circle cx="-30" cy="-60" r="16" fill="#f8f9fa" />
          <path d="M-42 -62 Q-62 -62 -60 -54 Q-50 -50 -42 -54 Z" fill="#f77f00" />
          <Eye cx={-34} cy={-64} r={2.6} />
        </g>
      </g>
      <ellipse cx="0" cy="1" rx="52" ry="5" fill="#74c0fc" opacity="0.85" />
    </>
  );
}

/** Green frog on a lily pad; it jumps and puffs its throat. */
export function Frosch() {
  return (
    <>
      <path d="M-46 -2 A46 12 0 1 0 0 -14 L-4 -2 Z" fill="#40916c" />
      <path d="M-34 -4 Q-10 -12 20 -6" stroke="#52b788" strokeWidth="3" fill="none" />
      <g className="bh-frosch-body" style={{ transformOrigin: "0px -6px" }}>
        <ellipse cx="-22" cy="-12" rx="12" ry="7" fill="#55a630" />
        <ellipse cx="22" cy="-12" rx="12" ry="7" fill="#55a630" />
        <ellipse cx="0" cy="-26" rx="26" ry="20" fill="#80b918" />
        <ellipse className="bh-frosch-throat" cx="0" cy="-16" rx="14" ry="8" fill="#d4e09b" style={{ transformOrigin: "0px -16px" }} />
        <circle cx="-12" cy="-44" r="10" fill="#80b918" />
        <circle cx="12" cy="-44" r="10" fill="#80b918" />
        <circle cx="-12" cy="-45" r="6" fill="#fff" />
        <circle cx="12" cy="-45" r="6" fill="#fff" />
        <Eye cx={-12} cy={-45} r={3.4} />
        <Eye cx={12} cy={-45} r={3.4} />
        <path d="M-14 -28 Q0 -20 14 -28" stroke="#2b9348" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="-16" cy="-24" r="3.5" fill={CHEEK} opacity="0.5" />
        <circle cx="16" cy="-24" r="3.5" fill={CHEEK} opacity="0.5" />
      </g>
    </>
  );
}

/** Swallow in the sky, centred on its body, facing left; it swoops down and back. */
export function Schwalbe() {
  return (
    <g className="bh-schwalbe-flight">
      <path d="M16 -2 L54 -12 L38 2 L56 14 Z" fill="#1d3557" />
      <g className="bh-schwalbe-wings" style={{ transformOrigin: "4px -4px" }}>
        <path d="M-4 -4 Q14 -36 48 -40 Q26 -16 12 0 Z" fill="#1d3557" />
      </g>
      <ellipse cx="0" cy="0" rx="22" ry="10" fill="#1d3557" />
      <ellipse cx="2" cy="4" rx="16" ry="5" fill="#fff" />
      <circle cx="-20" cy="-2" r="9" fill="#1d3557" />
      <circle cx="-22" cy="4" r="5" fill="#e63946" />
      <path d="M-28 -4 L-36 -2 L-28 0 Z" fill={INK} />
      <circle cx="-22" cy="-5" r="1.8" fill="#fff" />
    </g>
  );
}
