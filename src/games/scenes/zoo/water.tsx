import { CHEEK, Eye, INK, Inside, nth } from "../shared";

// Animals at the water at the front: the penguin pool, the seal's rock and the hippo river.
// Each drawing has its foot point at (0, 0), except the penguin on top of the ice rock (in
// the rock's coordinates) and the fish and the hippo (on the water line).

const PENGUIN = "#2b2d42";

/** Penguin on top of the ice rock (in the rock's coordinates), facing right; it slides down into the pool. */
export function Pinguin() {
  return (
    <>
      <g className="zo-pinguin-body" style={{ transformOrigin: "10px -222px" }}>
        <path d="M-2 -222 h-10 M22 -222 h12" stroke="#f77f00" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="10" cy="-262" rx="25" ry="40" fill={PENGUIN} />
        <ellipse cx="16" cy="-256" rx="16" ry="30" fill="#fff" />
        <path className="zo-pinguin-flipper" d="M-10 -270 Q-26 -250 -22 -232 Q-12 -244 -8 -258 Z" fill={PENGUIN} style={{ transformOrigin: "-10px -270px" }} />
        <path d="M32 -282 L48 -278 L32 -274 Z" fill="#f77f00" />
        <circle cx="24" cy="-270" r="4" fill="#ffd166" opacity="0.8" />
        <circle cx="25" cy="-287" r="5" fill="#fff" />
        <Eye cx={26} cy={-287} r={2.6} />
      </g>
      <g className="zo-pinguin-splash" fill="#a5d8ff">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={240 + i * 18} cy={-6 - (i % 2) * 14} r={9 - i} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** Fluffy grey penguin chick by the pool, facing left; it waddles and flaps. */
export function Pinguinkueken() {
  return (
    <g className="zo-kueken-body" style={{ transformOrigin: "0px 0px" }}>
      <path d="M-10 -2 h-8 M10 -2 h-6" stroke="#f77f00" strokeWidth="5" strokeLinecap="round" />
      <g className="zo-kueken-flipper" style={{ transformOrigin: "22px -40px" }}>
        <path d="M22 -40 Q36 -24 30 -12 Q22 -22 20 -32 Z" fill="#adb5bd" />
      </g>
      <g className="zo-kueken-flipper zo-kueken-flipper-left" style={{ transformOrigin: "-22px -40px" }}>
        <path d="M-22 -40 Q-36 -24 -30 -12 Q-22 -22 -20 -32 Z" fill="#adb5bd" />
      </g>
      <ellipse cx="0" cy="-32" rx="26" ry="30" fill="#ced4da" />
      <circle cx="-8" cy="-50" r="8" fill="#e9ecef" />
      <circle cx="0" cy="-66" r="18" fill="#6c757d" />
      <ellipse cx="-4" cy="-64" rx="12" ry="11" fill="#f8f9fa" />
      <path d="M-14 -64 L-24 -61 L-14 -58 Z" fill={INK} />
      <Eye cx={-7} cy={-67} r={2.6} />
      <circle cx="-2" cy="-58" r="3.5" fill={CHEEK} opacity="0.5" />
    </g>
  );
}

/** Blue fish at the surface of the penguin pool, facing left; it jumps out and splashes. */
export function Fisch() {
  return (
    <>
      <g className="zo-fisch-ripples" stroke="#fff" strokeWidth="3" fill="none">
        <ellipse cx="0" cy="0" rx="40" ry="8" style={nth(0)} />
        <ellipse cx="0" cy="0" rx="60" ry="12" style={nth(1)} />
      </g>
      <g className="zo-fisch-jump" style={{ transformOrigin: "0px -10px" }}>
        <path className="zo-fisch-tail" d="M28 -12 L50 -28 L46 -10 L50 6 Z" fill="#1c7ed6" style={{ transformOrigin: "28px -12px" }} />
        <ellipse cx="0" cy="-12" rx="32" ry="17" fill="#4dabf7" />
        <path d="M-24 -6 Q0 6 26 -6" stroke="#a5d8ff" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M-4 -28 Q8 -38 16 -26 Z" fill="#1c7ed6" />
        <path d="M2 -24 Q8 -12 2 -2 M10 -22 Q16 -12 10 -4" stroke="#1c7ed6" strokeWidth="2" fill="none" />
        <Eye cx={-18} cy={-16} r={3.4} />
        <path d="M-31 -8 Q-27 -5 -24 -8" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
    </>
  );
}

/** Seal on its rock with a ball on its nose, facing left; the ball bounces and it claps. */
export function Seehund() {
  return (
    <g>
      <ellipse cx="0" cy="-16" rx="86" ry="22" fill="#adb5bd" />
      <ellipse cx="-20" cy="-26" rx="50" ry="8" fill="#ced4da" />
      <g className="zo-seehund-body" style={{ transformOrigin: "0px -30px" }}>
        <path d="M50 -34 L80 -50 L74 -30 Z" fill="#6c757d" />
        <path d="M60 -30 Q20 -20 -16 -40 Q-40 -60 -36 -110 Q-30 -140 -6 -138 Q14 -130 12 -100 Q14 -60 60 -42 Z" fill="#868e96" />
        <path d="M-24 -100 Q-24 -70 -6 -54" stroke="#adb5bd" strokeWidth="10" fill="none" strokeLinecap="round" />
        <g className="zo-seehund-flipper" style={{ transformOrigin: "-14px -74px" }}>
          <path d="M-14 -74 Q-40 -66 -50 -50 Q-30 -50 -12 -62 Z" fill="#6c757d" />
        </g>
        <g className="zo-seehund-head" style={{ transformOrigin: "-14px -130px" }}>
          <ellipse cx="-22" cy="-138" rx="24" ry="20" fill="#868e96" />
          <ellipse cx="-42" cy="-134" rx="12" ry="9" fill="#adb5bd" />
          <ellipse cx="-50" cy="-138" rx="3.5" ry="2.6" fill={INK} />
          <path d="M-46 -128 h-12 M-46 -130 l-12 -5 M-40 -127 l-10 6" stroke="#495057" strokeWidth="1.3" />
          <Eye cx={-28} cy={-146} r={3.8} />
          <circle cx="-30" cy="-132" r="4" fill={CHEEK} opacity="0.45" />
        </g>
      </g>
      <g className="zo-seehund-ball" style={{ transformOrigin: "-54px -172px" }}>
        <circle cx="-54" cy="-172" r="20" fill="#fff" />
        <path d="M-74 -172 A20 20 0 0 1 -54 -192 V-172 Z" fill="#e63946" />
        <path d="M-34 -172 A20 20 0 0 1 -54 -152 V-172 Z" fill="#3a86ff" />
        <path d="M-54 -192 A20 20 0 0 1 -34 -172 H-54 Z" fill="#ffd60a" />
        <circle cx="-62" cy="-182" r="5" fill="#fff" opacity="0.6" />
      </g>
    </g>
  );
}

const CROC = "#52b788";
const CROC_DARK = "#2d6a4f";

/** Crocodile on the river bank, facing left; it snaps its jaw twice and swishes its tail. */
export function Krokodil() {
  return (
    <g className="zo-krokodil-body">
      <g className="zo-krokodil-tail" style={{ transformOrigin: "80px -24px" }}>
        <path d="M70 -40 Q140 -40 190 -14 Q140 -8 70 -10 Z" fill={CROC} />
        <path d="M100 -38 l8 -10 l8 10 M130 -32 l7 -9 l7 9 M158 -24 l6 -8 l6 8" fill={CROC_DARK} />
      </g>
      {[-40, 40].map((x) => (
        <path key={x} d={`M${x - 12} -14 L${x - 18} 0 H${x + 10} L${x + 6} -14 Z`} fill={CROC_DARK} />
      ))}
      <ellipse cx="10" cy="-28" rx="86" ry="24" fill={CROC} />
      <path d="M-50 -48 l8 -10 l8 10 M-20 -50 l8 -10 l8 10 M10 -50 l8 -10 l8 10 M40 -48 l8 -10 l8 10" fill={CROC_DARK} />
      <ellipse cx="0" cy="-16" rx="70" ry="8" fill="#b7e4c7" opacity="0.7" />
      <path d="M-150 -18 Q-110 -6 -60 -12 L-60 -26 Q-110 -20 -150 -24 Z" fill={CROC} />
      <g className="zo-krokodil-jaw" style={{ transformOrigin: "-70px -30px" }}>
        <path d="M-60 -46 Q-110 -44 -156 -34 Q-164 -28 -152 -22 L-60 -22 Z" fill={CROC} />
        <path d="M-150 -22 l4 6 l4 -6 M-130 -22 l4 6 l4 -6 M-110 -22 l4 6 l4 -6 M-90 -22 l4 6 l4 -6" fill="#fff" />
        <circle cx="-152" cy="-36" r="3" fill={CROC_DARK} />
        <circle cx="-64" cy="-58" r="13" fill={CROC} />
        <circle cx="-64" cy="-60" r="8" fill="#fff" />
        <Eye cx={-66} cy={-60} r={4.2} />
      </g>
      <path d="M-148 -22 Q-110 -16 -66 -22" stroke={CROC_DARK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Tortoise by the flowers, facing right; it pulls its head in and pokes it out again. */
export function Schildkroete() {
  return (
    <g className="zo-schildi-body" style={{ transformOrigin: "0px 0px" }}>
      {[-28, 24].map((x) => (
        <g key={x} className="zo-schildi-leg" style={{ transformOrigin: `${x}px -14px` }}>
          <rect x={x - 9} y="-18" width="18" height="18" rx="7" fill="#95d5b2" />
        </g>
      ))}
      <g className="zo-schildi-head" style={{ transformOrigin: "40px -26px" }}>
        <path d="M30 -30 Q50 -40 62 -32" stroke="#95d5b2" strokeWidth="16" strokeLinecap="round" fill="none" />
        <circle cx="66" cy="-36" r="14" fill="#95d5b2" />
        <Eye cx={70} cy={-40} r={2.8} />
        <path d="M68 -30 Q73 -27 78 -31" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="62" cy="-31" r="3.5" fill={CHEEK} opacity="0.5" />
      </g>
      <path d="M-56 -18 Q-54 -70 0 -72 Q54 -70 56 -18 Z" fill="#40916c" />
      <path d="M-30 -24 L-20 -52 L0 -60 L20 -52 L30 -24 M-20 -52 L-44 -30 M20 -52 L44 -30 M0 -60 V-24" stroke="#2d6a4f" strokeWidth="4" fill="none" strokeLinejoin="round" />
      <path d="M-58 -18 H58" stroke="#2d6a4f" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="-14" cy="-60" rx="18" ry="5" fill="#fff" opacity="0.3" />
    </g>
  );
}

const HIPPO = "#b5838d";
const HIPPO_DARK = "#9a6b76";

/** Hippo in the river, mostly under water; it rises and opens its mouth wide. */
export function Nilpferd() {
  return (
    <g>
      <g className="zo-nilpferd-ripples" stroke="#fff" strokeWidth="3" fill="none">
        <ellipse cx="-40" cy="-2" rx="150" ry="16" style={nth(0)} />
        <ellipse cx="-40" cy="-2" rx="190" ry="22" style={nth(1)} />
      </g>
      <g className="zo-nilpferd-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="40" cy="-24" rx="96" ry="40" fill={HIPPO} />
        <ellipse cx="30" cy="-52" rx="56" ry="8" fill="#fff" opacity="0.25" />
        <g className="zo-nilpferd-head" style={{ transformOrigin: "-40px -44px" }}>
          <ellipse cx="-62" cy="-20" rx="64" ry="24" fill={HIPPO_DARK} />
          <g className="zo-nilpferd-mouth" style={{ transformOrigin: "-30px -30px" }}>
            <path d="M-126 -30 Q-126 30 -60 40 Q-10 34 -6 -30 Z" fill="#ff8fa3" />
            <path d="M-110 -30 Q-104 10 -66 20 Q-30 12 -22 -30 Z" fill="#e5989b" />
            <rect x="-112" y="-30" width="12" height="18" rx="5" fill="#fff" />
            <rect x="-36" y="-30" width="12" height="18" rx="5" fill="#fff" />
          </g>
          <g className="zo-nilpferd-top" style={{ transformOrigin: "-30px -40px" }}>
            <ellipse cx="-30" cy="-50" rx="46" ry="30" fill={HIPPO} />
            <ellipse cx="-90" cy="-36" rx="44" ry="26" fill={HIPPO} />
            <ellipse cx="-104" cy="-50" rx="6" ry="4" fill={HIPPO_DARK} />
            <ellipse cx="-80" cy="-52" rx="6" ry="4" fill={HIPPO_DARK} />
            <g className="zo-nilpferd-ear" style={{ transformOrigin: "-4px -76px" }}>
              <ellipse cx="-4" cy="-82" rx="7" ry="10" fill={HIPPO_DARK} />
            </g>
            <g className="zo-nilpferd-ear" style={{ transformOrigin: "-40px -78px" }}>
              <ellipse cx="-40" cy="-82" rx="7" ry="10" fill={HIPPO_DARK} />
            </g>
            <circle cx="-20" cy="-70" r="10" fill={HIPPO} />
            <circle cx="-48" cy="-70" r="10" fill={HIPPO} />
            <Eye cx={-20} cy={-70} r={4} />
            <Eye cx={-48} cy={-70} r={4} />
            <circle cx="-70" cy="-30" r="7" fill={CHEEK} opacity="0.4" />
          </g>
        </g>
      </g>
      {/* The water hides everything below the water line */}
      <path d="M-196 -4 Q-140 -12 -80 -4 T40 -4 T150 -4 Q176 14 150 34 H-170 Q-206 16 -196 -4 Z" fill="#62bab4" opacity="0.92" />
      <path d="M-170 6 h50 M-40 10 h60 M90 4 h40" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </g>
  );
}

/** Pelican on a post at the river, facing left; it catches a fish in its big beak. */
export function Pelikan() {
  return (
    <g>
      <rect x="-12" y="-80" width="24" height="80" fill="#8d5a2b" />
      <ellipse cx="0" cy="-80" rx="12" ry="4" fill="#b08968" />
      <path d="M-6 -80 V-92 M6 -80 V-92" stroke="#f4a261" strokeWidth="4" strokeLinecap="round" />
      <g className="zo-pelikan-body" style={{ transformOrigin: "0px -90px" }}>
        <path d="M30 -112 L52 -100 L28 -98 Z" fill="#dee2e6" />
        <ellipse cx="6" cy="-116" rx="34" ry="26" fill="#f8f9fa" />
        <path d="M0 -128 Q30 -132 40 -110 Q20 -104 0 -112 Z" fill="#ced4da" />
        <path d="M-14 -130 Q-26 -150 -18 -174" stroke="#f8f9fa" strokeWidth="14" strokeLinecap="round" fill="none" />
        <g className="zo-pelikan-head" style={{ transformOrigin: "-18px -176px" }}>
          <circle cx="-18" cy="-178" r="14" fill="#f8f9fa" />
          <path d="M-14 -190 Q-6 -198 2 -192" stroke="#ffd166" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M-28 -182 L-86 -170 L-30 -170 Z" fill="#ffb703" />
          <g className="zo-pelikan-pouch" style={{ transformOrigin: "-30px -170px" }}>
            <path d="M-30 -170 L-84 -170 Q-70 -146 -40 -148 Z" fill="#fb8500" />
          </g>
          <Eye cx={-22} cy={-182} r={2.8} />
        </g>
      </g>
      <g className="zo-pelikan-fish" fill="#4dabf7">
        <ellipse cx="-110" cy="-200" rx="12" ry="6" />
        <path d="M-100 -200 l10 -6 v12 Z" />
      </g>
    </g>
  );
}

const MEERKAT = "#d4a373";

/** Meerkat in front of its burrow; it ducks into the hole, pops up again and looks around. */
export function Erdmaennchen() {
  return (
    <g>
      <ellipse cx="0" cy="-4" rx="60" ry="16" fill="#c9a27a" />
      <ellipse cx="0" cy="-6" rx="30" ry="8" fill="#5e3a1f" />
      <Inside d="M-40 -200 H40 V-6 H-40 Z">
        <g className="zo-erdmann-body" style={{ transformOrigin: "0px -6px" }}>
          <ellipse cx="0" cy="-48" rx="16" ry="38" fill={MEERKAT} />
          <ellipse cx="2" cy="-44" rx="9" ry="26" fill="#f1dcc0" />
          <path d="M-10 -64 Q-2 -58 4 -62 M10 -64 Q2 -58 -4 -62" stroke={MEERKAT} strokeWidth="6" strokeLinecap="round" fill="none" />
          <g className="zo-erdmann-head" style={{ transformOrigin: "0px -92px" }}>
            <circle cx="-12" cy="-98" r="4" fill="#9c6644" />
            <circle cx="12" cy="-98" r="4" fill="#9c6644" />
            <circle cx="0" cy="-92" r="14" fill={MEERKAT} />
            <ellipse cx="-4" cy="-84" rx="7" ry="5" fill="#f1dcc0" />
            <circle cx="-9" cy="-84" r="2" fill={INK} />
            <ellipse cx="-6" cy="-95" rx="4.5" ry="5.5" fill="#6f4518" />
            <ellipse cx="6" cy="-95" rx="4.5" ry="5.5" fill="#6f4518" />
            <circle cx="-6" cy="-95" r="2" fill="#fff" />
            <circle cx="6" cy="-95" r="2" fill="#fff" />
          </g>
        </g>
      </Inside>
      <path d="M-30 -6 Q0 6 30 -6 Q36 4 0 10 Q-36 4 -30 -6 Z" fill="#c9a27a" />
    </g>
  );
}
