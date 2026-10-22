import { INK, Inside, SAND, nth } from "../shared";
import { Kid, SitKid } from "./parts";

// The things to play on. Foot point at (0, 0); tower, slide and bridge share the
// tower's coordinates (see TOWER in layout.ts).

const WOOD = "#c68a4e";
const WOOD_DARK = "#9c6232";

/** Climbing tower: a child waves from the deck, the flag flutters and the bell rings. */
export function Kletterturm() {
  return (
    <>
      {/* Back posts, a little darker */}
      <rect x="-60" y="-344" width="12" height="332" fill={WOOD_DARK} />
      <rect x="72" y="-344" width="12" height="332" fill={WOOD_DARK} />
      {/* Climbing wall under the deck */}
      <rect x="-62" y="-146" width="124" height="140" rx="4" fill="#4cc9f0" />
      <rect x="-62" y="-146" width="124" height="14" fill="#000" opacity="0.08" />
      {[
        [-34, -116, "#ff6b6b"],
        [20, -104, "#ffd60a"],
        [-14, -78, "#06d6a0"],
        [34, -60, "#ff8fab"],
        [-38, -40, "#ffd60a"],
        [8, -28, "#ff6b6b"],
      ].map(([x, y, fill]) => (
        <g key={`${x}-${y}`}>
          <ellipse cx={x} cy={y} rx="9" ry="7" fill={String(fill)} />
          <ellipse cx={Number(x) - 2} cy={Number(y) - 2} rx="3" ry="2" fill="#fff" opacity="0.5" />
        </g>
      ))}
      {/* The child on the deck, behind the railing */}
      <g transform="translate(-18 -152)">
        <Kid cls="sp-kt-kid" shirt="#ff8c42" pants="#3a0ca3" hair="#f4a261" style="pigtails" armL={20} armR={150} />
      </g>
      {/* Deck and railing with a porthole */}
      <rect x="-82" y="-158" width="176" height="14" rx="3" fill={WOOD} />
      <rect x="-82" y="-146" width="176" height="4" fill={WOOD_DARK} opacity="0.5" />
      <rect x="-70" y="-206" width="140" height="50" rx="8" fill="#ff6b6b" />
      <rect x="-70" y="-166" width="140" height="10" rx="4" fill="#e63946" />
      <circle cx="36" cy="-182" r="15" fill="#bde0fe" />
      <path d="M28 -190 l8 -4 M30 -184 l12 -6" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <g className="sp-kt-shutter" style={{ transformOrigin: "21px -182px" }}>
        <circle cx="36" cy="-182" r="15" fill="#ffd60a" />
        <path d="M24 -182 H48" stroke="#f4a261" strokeWidth="2" />
      </g>
      <circle cx="36" cy="-182" r="15" stroke="#fff" strokeWidth="4" fill="none" />
      {/* Front posts */}
      <rect x="-82" y="-326" width="14" height="326" rx="3" fill={WOOD} />
      <rect x="68" y="-326" width="14" height="326" rx="3" fill={WOOD} />
      <rect x="-78" y="-326" width="4" height="326" fill="#fff" opacity="0.25" />
      {/* The bell under the roof */}
      <g className="sp-kt-bell" style={{ transformOrigin: "50px -300px" }}>
        <path d="M50 -300 V-290" stroke={INK} strokeWidth="2.5" />
        <path d="M38 -266 Q38 -292 50 -292 Q62 -292 62 -266 Z" fill="#ffd60a" />
        <rect x="35" y="-268" width="30" height="5" rx="2" fill="#f4a261" />
        <circle cx="50" cy="-261" r="4" fill="#f4a261" />
        <path d="M43 -286 Q42 -276 43 -270" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none" />
      </g>
      <g className="sp-kt-ring" stroke="#ffb703" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M72 -284 l12 -6 M74 -270 h14 M72 -256 l12 6" />
      </g>
      {/* Roof and flag */}
      <path d="M-104 -316 L6 -396 L116 -316 Z" fill="#4361ee" />
      <path d="M6 -396 L116 -316 H60 Z" fill="#3a0ca3" opacity="0.35" />
      <path d="M-104 -316 H116" stroke="#3a0ca3" strokeWidth="8" strokeLinecap="round" />
      <path d="M6 -396 V-448" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path className="sp-kt-flag" d="M8 -446 L48 -434 L8 -420 Z" fill="#ffd60a" style={{ transformOrigin: "8px -433px" }} />
    </>
  );
}

/** The slide on the right of the tower; a child slides down when it's tapped. */
export function Rutsche() {
  const slide = "M84 -152 Q150 -150 204 -92 Q254 -34 304 -20 L340 -18";
  return (
    <>
      <path d="M232 -58 V0 M300 -22 V0" stroke="#adb5bd" strokeWidth="9" strokeLinecap="round" />
      <path d={slide} stroke="#f59f00" strokeWidth="34" strokeLinecap="round" fill="none" />
      <path d={slide} stroke="#ffd60a" strokeWidth="24" strokeLinecap="round" fill="none" transform="translate(0 -4)" />
      <path d={slide} stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" transform="translate(-3 -11)" />
      <g className="sp-rt-shine" fill="#fff">
        {[
          [130, -150],
          [196, -108],
          [258, -50],
        ].map(([x, y], i) => (
          <path key={x} d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3} Z`} style={nth(i)} />
        ))}
      </g>
      <g className="sp-rt-ride">
        <g transform="translate(96 -164) rotate(8)">
          <SitKid cls="sp-rt-kid" shirt="#06d6a0" pants="#ef476f" hair="#2b2d42" style="curls" armL={150} armR={160} straight />
        </g>
      </g>
      <g className="sp-rt-dust" fill={SAND}>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={340 + i * 10} cy={-14 - (i % 2) * 10} r={8 - i} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const PLANKS = Array.from({ length: 9 }, (_, i) => {
  const t = (i + 0.5) / 9;
  return { x: -292 + t * 206, y: -128 - 22 * t + 26 * 4 * t * (1 - t) };
});

/** Height of the hand rope (M-294 -186 Q-190 -146 -82 -206) at t along the bridge. */
const handRope = (t: number) => (1 - t) ** 2 * -186 + 2 * (1 - t) * t * -146 + t ** 2 * -206;

/** The wobbly bridge from the tower to the little platform, where a child jumps. */
export function Haengebruecke() {
  return (
    <>
      {/* Little platform with a rope net down to the ground */}
      <rect x="-366" y="-226" width="10" height="226" fill={WOOD_DARK} />
      <rect x="-304" y="-226" width="10" height="226" fill={WOOD_DARK} />
      <path d="M-356 -124 L-304 -4 M-332 -124 L-366 -40 M-304 -124 L-366 -10 M-356 -80 L-304 -60" stroke="#e9c46a" strokeWidth="3" />
      <g className="sp-hb-jump">
        <g transform="translate(-330 -134)">
          <Kid cls="sp-hb-kid" shirt="#8338ec" pants="#ffb703" hair="#2b2d42" style="cap" armL={140} armR={140} />
        </g>
      </g>
      <rect x="-372" y="-136" width="84" height="12" rx="3" fill={WOOD} />
      <path d="M-366 -190 H-294" stroke="#e9c46a" strokeWidth="5" strokeLinecap="round" />
      {/* The bridge: planks hang in a curve between the two decks */}
      <g className="sp-hb-ropes" style={{ transformOrigin: "-190px -180px" }}>
        <path d="M-294 -186 Q-190 -146 -82 -206" stroke="#e9c46a" strokeWidth="5" fill="none" strokeLinecap="round" />
        {PLANKS.filter((_, i) => i % 2 === 0).map(({ x, y }) => (
          <path key={x} d={`M${x} ${y} V${handRope((x + 294) / 212)}`} stroke="#e9c46a" strokeWidth="2.5" />
        ))}
      </g>
      {PLANKS.map(({ x, y }, i) => (
        <g key={x} className="sp-hb-plank" style={nth(i)}>
          <rect x={x - 10} y={y - 4} width="20" height="9" rx="2" fill={i % 2 ? WOOD : "#d4a373"} />
          <rect x={x - 10} y={y + 3} width="20" height="2" fill={WOOD_DARK} opacity="0.6" />
        </g>
      ))}
      <path d="M-292 -128 Q-190 -96 -84 -150" stroke="#b08968" strokeWidth="3" fill="none" />
    </>
  );
}

/** Swing frame with a child on one swing; the other seat swings along. */
export function Schaukel() {
  return (
    <>
      <path d="M-134 0 L-110 -206 L-86 0 M86 0 L110 -206 L134 0" stroke="#e63946" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-118 -206 H118" stroke="#c1121f" strokeWidth="13" strokeLinecap="round" />
      <path d="M-114 -209 H114" stroke="#fff" strokeWidth="2" opacity="0.4" />
      <g className="sp-sw-seat2" style={{ transformOrigin: "50px -204px" }}>
        <path d="M30 -204 V-62 M70 -204 V-62" stroke="#868e96" strokeWidth="3" />
        <rect x="24" y="-66" width="52" height="10" rx="4" fill="#118ab2" />
      </g>
      <g className="sp-sw-seat1" style={{ transformOrigin: "-50px -204px" }}>
        <path d="M-70 -204 V-62 M-30 -204 V-62" stroke="#868e96" strokeWidth="3" />
        <g transform="translate(-52 -66)">
          <SitKid cls="sp-sw-kid" shirt="#ffd60a" pants="#e63946" hair="#6b4423" style="short" armL={170} armR={170} />
        </g>
        <rect x="-76" y="-66" width="52" height="10" rx="4" fill="#06d6a0" />
      </g>
    </>
  );
}

/** Seesaw with two children; one goes up, the other down. */
export function Wippe() {
  return (
    <>
      {[-150, 150].map((x) => (
        <g key={x} className={x < 0 ? "sp-wp-tyre-l" : "sp-wp-tyre-r"} style={{ transformOrigin: `${x}px 0px` }}>
          <ellipse cx={x} cy="-6" rx="24" ry="12" fill="#343a40" />
          <ellipse cx={x} cy="-8" rx="12" ry="5" fill="#6c757d" />
        </g>
      ))}
      <path d="M-26 0 L0 -50 L26 0 Z" fill="#118ab2" />
      <path d="M0 -50 L26 0 H10 Z" fill="#073b4c" opacity="0.3" />
      <g className="sp-wp-beam" style={{ transformOrigin: "0px -50px" }}>
        <rect x="-170" y="-58" width="340" height="14" rx="6" fill="#ffb703" />
        <rect x="-166" y="-56" width="332" height="3" rx="1" fill="#fff" opacity="0.5" />
        <path d="M-118 -58 V-92 H-104 M118 -58 V-92 H104" stroke="#e63946" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="-162" y="-66" width="36" height="9" rx="3" fill="#e63946" />
        <rect x="126" y="-66" width="36" height="9" rx="3" fill="#e63946" />
        <g transform="translate(-142 -66)">
          <SitKid cls="sp-wp-kid1" shirt="#ef476f" pants="#073b4c" hair="#e9c46a" style="bun" armL={70} armR={70} />
        </g>
        <g transform="translate(142 -66) scale(-1 1)">
          <SitKid cls="sp-wp-kid2" shirt="#4361ee" pants="#495057" hair="#3d2314" style="short" armL={70} armR={70} />
        </g>
      </g>
      <circle cx="0" cy="-50" r="7" fill="#073b4c" />
    </>
  );
}

const STRIPES = ["#ff6b6b", "#ffd60a", "#4cc9f0", "#06d6a0"];

/** Merry-go-round: the rim turns, the children go round and round. */
export function Karussell() {
  return (
    <>
      {/* Platform rim, its coloured stripes run round */}
      <ellipse cx="0" cy="-8" rx="134" ry="26" fill="#000" opacity="0.08" />
      <Inside d="M-130 -34 A130 28 0 0 0 130 -34 V-16 A130 28 0 0 1 -130 -16 Z">
        <g className="sp-ks-stripes">
          {Array.from({ length: 14 }, (_, i) => (
            <rect key={i} x={-160 + i * 40} y="-70" width="40" height="70" fill={STRIPES[i % 4]} />
          ))}
        </g>
      </Inside>
      <ellipse cx="0" cy="-34" rx="130" ry="28" fill="#f8f9fa" />
      <ellipse cx="0" cy="-34" rx="104" ry="20" fill="#e9ecef" />
      {/* Centre pole with a steering wheel */}
      <rect x="-7" y="-150" width="14" height="118" fill="#adb5bd" />
      <g className="sp-ks-wheel" style={{ transformOrigin: "0px -112px" }}>
        <ellipse cx="0" cy="-112" rx="34" ry="9" stroke="#e63946" strokeWidth="6" fill="none" />
        <path d="M-34 -112 H34" stroke="#e63946" strokeWidth="4" />
      </g>
      <g className="sp-ks-rider">
        <g transform="translate(-72 -40)">
          <SitKid cls="sp-ks-kid1" shirt="#ff8fab" pants="#8338ec" hair="#bc6c25" style="pigtails" armL={120} armR={110} />
        </g>
      </g>
      <g className="sp-ks-rider sp-ks-rider2">
        <g transform="translate(70 -38) scale(-1 1)">
          <SitKid cls="sp-ks-kid2" shirt="#4cc9f0" pants="#3d405b" hair="#2b2d42" style="curls" armL={120} armR={110} />
        </g>
      </g>
      {/* Little roof on top */}
      <path d="M-46 -150 Q0 -196 46 -150 Z" fill="#ffd60a" />
      <path className="sp-ks-top" d="M0 -186 V-208" stroke={INK} strokeWidth="3" />
      <circle cx="0" cy="-210" r="7" fill="#e63946" />
    </>
  );
}

/** Climbing frame; a child hangs upside down from the top bar and swings. */
export function Klettergeruest() {
  const bars = ["#ff6b6b", "#ffd60a", "#06d6a0", "#4cc9f0"];
  return (
    <>
      {[-100, -34, 34, 100].map((x, i) => (
        <rect key={x} x={x - 5} y="-180" width="10" height="180" rx="4" fill={bars[i]} />
      ))}
      {[-60, -120].map((y) => (
        <path key={y} d={`M-100 ${y} H100`} stroke="#ced4da" strokeWidth="7" strokeLinecap="round" />
      ))}
      <path d="M-104 -178 H104" stroke="#8338ec" strokeWidth="9" strokeLinecap="round" />
      {/* Climbing rope with a knot */}
      <g className="sp-kg-rope" style={{ transformOrigin: "-66px -178px" }}>
        <path d="M-66 -178 V-50" stroke="#e9c46a" strokeWidth="5" strokeLinecap="round" />
        <circle cx="-66" cy="-50" r="7" fill="#e9c46a" />
      </g>
      <g className="sp-kg-swing" style={{ transformOrigin: "40px -176px" }}>
        <g transform="translate(40 -178) rotate(180)">
          <Kid cls="sp-kg-kid" shirt="#ffb703" pants="#118ab2" hair="#6b4423" style="short" armL={6} armR={6} />
        </g>
        <path d="M30 -182 Q40 -170 50 -182" stroke="#118ab2" strokeWidth="10" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

/** Trampoline: the child bounces high, the mat dips. */
export function Trampolin() {
  return (
    <>
      <path d="M-90 0 Q-76 -24 -62 0 M62 0 Q76 -24 90 0 M-14 0 Q0 -24 14 0" stroke="#495057" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M-76 -40 V-12 M76 -40 V-12 M0 -36 V-12" stroke="#495057" strokeWidth="7" />
      <ellipse cx="0" cy="-48" rx="116" ry="26" fill="#4361ee" />
      <g className="sp-tr-mat" style={{ transformOrigin: "0px -50px" }}>
        <ellipse cx="0" cy="-50" rx="96" ry="18" fill="#2b2d42" />
        <ellipse cx="-20" cy="-54" rx="40" ry="6" fill="#fff" opacity="0.12" />
      </g>
      <g className="sp-tr-jump">
        <g transform="translate(0 -52)">
          <Kid cls="sp-tr-kid" shirt="#ef476f" pants="#ffd60a" hair="#3d2314" style="curls" armL={130} armR={130} />
        </g>
      </g>
      {/* Padding on the front of the frame */}
      <path d="M-116 -48 A116 26 0 0 0 116 -48 A116 22 0 0 1 -116 -48 Z" fill="#4cc9f0" />
      <g className="sp-tr-stars" fill="#ffd60a">
        {[
          [-70, -190],
          [72, -200],
          [0, -230],
        ].map(([x, y], i) => (
          <path key={x} d={`M${x} ${y - 12} L${x + 4} ${y - 4} L${x + 12} ${y} L${x + 4} ${y + 4} L${x} ${y + 12} L${x - 4} ${y + 4} L${x - 12} ${y} L${x - 4} ${y - 4} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Zip line: a child on the round seat whizzes down the rope and back. */
export function Seilbahn() {
  return (
    <>
      <path d="M-262 0 L-232 -240 L-202 0 M206 0 L228 -170 L250 0" stroke={WOOD} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M-232 -236 L228 -166" stroke="#495057" strokeWidth="4" />
      {/* Buffer at the low end */}
      <circle cx="200" cy="-170" r="10" fill="#e63946" />
      <g className="sp-sb-ride">
        <g className="sp-sb-swing" style={{ transformOrigin: "-180px -226px" }}>
          <rect x="-196" y="-238" width="32" height="14" rx="5" fill="#adb5bd" />
          <path d="M-180 -224 V-122" stroke="#868e96" strokeWidth="3" />
          <g transform="translate(-186 -116)">
            <SitKid cls="sp-sb-kid" shirt="#f72585" pants="#4361ee" hair="#e9c46a" style="pigtails" armL={175} armR={175} />
          </g>
          <ellipse cx="-180" cy="-114" rx="26" ry="7" fill="#e63946" />
          <ellipse cx="-180" cy="-116" rx="20" ry="4" fill="#ff6b6b" />
        </g>
      </g>
    </>
  );
}

/** Spring rider: a horse on a big spring, a child rocks and calls "Hüh!". */
export function Federwippe() {
  return (
    <>
      <ellipse cx="0" cy="-2" rx="34" ry="8" fill="#868e96" />
      <g className="sp-fw-spring" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-16 -4 Q20 -10 -16 -16 Q20 -22 -16 -28 Q20 -34 -16 -40 Q20 -46 -16 -52 Q20 -58 0 -60" stroke="#adb5bd" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <g className="sp-fw-rock" style={{ transformOrigin: "0px -40px" }}>
        <path className="sp-fw-tail" d="M-54 -96 Q-84 -92 -80 -58 Q-70 -76 -54 -84 Z" fill="#6b4423" style={{ transformOrigin: "-54px -90px" }} />
        <ellipse cx="0" cy="-86" rx="58" ry="28" fill="#f8f9fa" />
        <ellipse cx="-20" cy="-82" rx="14" ry="10" fill="#ced4da" />
        <ellipse cx="18" cy="-74" rx="10" ry="7" fill="#ced4da" />
        <path d="M30 -102 L56 -150 L80 -136 L56 -96 Z" fill="#f8f9fa" />
        <g className="sp-fw-head" style={{ transformOrigin: "60px -140px" }}>
          <path className="sp-fw-ear" d="M60 -168 L64 -186 L72 -168 Z" fill="#f8f9fa" style={{ transformOrigin: "66px -168px" }} />
          <ellipse cx="72" cy="-154" rx="22" ry="17" fill="#f8f9fa" />
          <ellipse cx="90" cy="-146" rx="12" ry="10" fill="#ffc8dd" />
          <circle cx="94" cy="-148" r="2" fill={INK} />
          <circle cx="70" cy="-158" r="3.6" fill="#2b2d42" />
          <circle cx="71.2" cy="-159.2" r="1.2" fill="#fff" />
          <path d="M66 -172 Q52 -160 50 -130 Q42 -120 36 -104" stroke="#6b4423" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M74 -146 L80 -130" stroke="#e63946" strokeWidth="3" />
        </g>
        {/* Handles */}
        <path d="M56 -148 h-14" stroke="#e63946" strokeWidth="6" strokeLinecap="round" />
        <g transform="translate(-6 -108)">
          <SitKid cls="sp-fw-kid" shirt="#06d6a0" pants="#ef476f" hair="#f4a261" style="bun" armL={70} armR={75} />
        </g>
        <path d="M-30 -112 Q0 -104 30 -112 L28 -100 Q0 -94 -28 -100 Z" fill="#e63946" />
      </g>
      <g className="sp-fw-call" fill="none" stroke="#e63946" strokeWidth="4" strokeLinecap="round">
        <path d="M110 -182 l12 -8 M112 -166 h14 M110 -150 l12 8" />
      </g>
    </>
  );
}
