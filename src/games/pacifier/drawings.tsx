import { memo } from "react";
import { STAR_PATH } from "@/components/Bursts";

// The drawings of „Die Schnullerfee“, each in its own small svg: the room is drawn once and stands still, everything
// that moves or changes (pacifiers, box, balloon, lamp, Tapsi, Mama, the fairy, the present) is a layer of its own
// over it (PacifierPlay), so a phone only moves those.

const FOX = "#e8743b";
const FOX_DARK = "#c65a26";
const MUZZLE = "#fff6ec";
const INK = "#3b2a22";

/** A fox's head in a 100 × 100 box: ears, a white muzzle, eyes open or shut in sleep. */
function FoxHead({ asleep = false }: { asleep?: boolean }) {
  return (
    <g>
      <path fill={FOX} d="M17 50 L21 9 L45 29 Z M83 50 L79 9 L55 29 Z" />
      <path fill="#f7c9a8" d="M24 39 L26 18 L38 30 Z M76 39 L74 18 L62 30 Z" />
      <path fill={FOX} d="M13 52 C13 31 31 24 50 24 C69 24 87 31 87 52 C87 72 69 90 50 92 C31 90 13 72 13 52 Z" />
      <path fill={MUZZLE} d="M21 61 C33 58 44 63 50 73 C56 63 67 58 79 61 C75 78 63 90 50 92 C37 90 25 78 21 61 Z" />
      <circle fill="#ff9e9e" opacity="0.6" cx="27" cy="66" r="5" />
      <circle fill="#ff9e9e" opacity="0.6" cx="73" cy="66" r="5" />
      {asleep ? (
        <path d="M31 52 Q37 57 43 52 M57 52 Q63 57 69 52" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      ) : (
        <>
          <circle fill={INK} cx="37" cy="52" r="4.6" />
          <circle fill={INK} cx="63" cy="52" r="4.6" />
          <circle fill="#fff" cx="38.5" cy="50.5" r="1.4" />
          <circle fill="#fff" cx="64.5" cy="50.5" r="1.4" />
        </>
      )}
      <ellipse fill={INK} cx="50" cy="72" rx="5.4" ry="3.8" />
      <path d="M50 76 V79 M45 81 Q50 84 55 81" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

/** The room in the evening light, drawn once: wall with a hole where the window's sky shows, floor, rug, bed, bedside table, curtains, toy shelf. */
export const Room = memo(function Room() {
  return (
    <svg className="sf-room" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
      {/* The wall, with the window's glass left out so the sky layers behind show through */}
      <path fill="#f1e2cc" fillRule="evenodd" d="M0 0 H1600 V640 H0 Z M915 145 H1165 V415 H915 Z" />
      <g fill="#e6d1b4">
        {[
          [120, 120],
          [330, 90],
          [560, 160],
          [760, 80],
          [1300, 120],
          [1480, 220],
          [140, 330],
          [560, 330],
        ].map(([x, y], i) => (
          <path key={i} d={STAR_PATH} transform={`translate(${x} ${y}) scale(0.32)`} />
        ))}
      </g>
      {/* A picture over the bed: a moon over a hill */}
      <rect x="300" y="200" width="160" height="120" rx="6" fill="#fff8ec" stroke="#b77b52" strokeWidth="10" />
      <path d="M305 300 Q380 250 455 300 V315 H305 Z" fill="#9fd39a" />
      <circle cx="410" cy="245" r="20" fill="#ffd166" />
      <circle cx="420" cy="238" r="18" fill="#fff8ec" />
      {/* Skirting and floor */}
      <rect x="0" y="620" width="1600" height="280" fill="#d9a878" />
      <g stroke="#c4925f" strokeWidth="3">
        <path d="M0 690 H1600 M0 770 H1600 M0 850 H1600" />
        <path d="M300 620 V690 M820 690 V770 M1250 620 V690 M520 770 V850 M1100 770 V850" />
      </g>
      <rect x="0" y="612" width="1600" height="16" fill="#c9b39a" />
      <ellipse cx="830" cy="790" rx="340" ry="68" fill="#9ec5e8" />
      <ellipse cx="830" cy="790" rx="300" ry="52" fill="none" stroke="#fff" strokeWidth="6" strokeDasharray="18 14" />
      {/* Window: frame, bars, sill, curtains */}
      <rect x="907" y="137" width="266" height="286" fill="none" stroke="#fff" strokeWidth="16" />
      <rect x="1034" y="145" width="12" height="270" fill="#fff" />
      <rect x="915" y="274" width="250" height="12" fill="#fff" />
      <rect x="880" y="423" width="320" height="22" rx="4" fill="#fffaf2" />
      <rect x="888" y="445" width="304" height="10" fill="#000" opacity="0.08" />
      <rect x="850" y="100" width="380" height="10" rx="5" fill="#b77b52" />
      <path d="M852 108 C890 108 910 108 914 108 C900 220 925 360 890 480 C875 480 860 480 852 480 Z" fill="#ff9e9e" />
      <path d="M1228 108 C1190 108 1170 108 1166 108 C1180 220 1155 360 1190 480 C1205 480 1220 480 1228 480 Z" fill="#ff9e9e" />
      <path d="M870 140 C878 260 872 380 866 470 M1210 140 C1202 260 1208 380 1214 470" fill="none" stroke="#f07c7c" strokeWidth="5" />
      {/* Toy shelf at the right */}
      <rect x="1420" y="380" width="170" height="270" rx="8" fill="#b77b52" />
      <rect x="1435" y="395" width="140" height="110" fill="#8c5a3c" />
      <rect x="1435" y="520" width="140" height="115" fill="#8c5a3c" />
      <rect x="1450" y="465" width="40" height="40" fill="#3ec300" />
      <rect x="1495" y="445" width="40" height="60" fill="#00b4d8" />
      <circle cx="1510" cy="600" r="32" fill="#ff5d73" />
      <path d="M1478 600 Q1510 580 1542 600" fill="none" stroke="#fff" strokeWidth="5" />
      {/* Bed: headboard, mattress, pillow, blanket, foot board */}
      <rect x="205" y="380" width="48" height="275" rx="14" fill="#8c5a3c" />
      <rect x="235" y="585" width="390" height="45" rx="8" fill="#a8704b" />
      <rect x="240" y="518" width="370" height="78" rx="18" fill="#fffdf8" />
      <ellipse cx="310" cy="510" rx="64" ry="30" fill="#ffffff" stroke="#e8e0d4" strokeWidth="3" />
      <path d="M345 505 Q470 490 610 505 L612 600 L345 600 Z" fill="#ffe08a" />
      <g fill="#ffc94a">
        <circle cx="400" cy="545" r="7" />
        <circle cx="470" cy="575" r="7" />
        <circle cx="540" cy="540" r="7" />
        <circle cx="580" cy="580" r="7" />
      </g>
      <rect x="598" y="470" width="40" height="185" rx="12" fill="#8c5a3c" />
      <rect x="240" y="628" width="20" height="30" fill="#6e4329" />
      <rect x="590" y="628" width="20" height="30" fill="#6e4329" />
      {/* Bedside table (its lamp is a layer of its own, it switches off) */}
      <rect x="648" y="540" width="112" height="112" rx="8" fill="#b77b52" />
      <rect x="660" y="565" width="88" height="40" rx="5" fill="#a26a44" />
      <circle cx="704" cy="585" r="6" fill="#ffd166" />
    </svg>
  );
});

/** What the window shows: the evening glow, the night with moon and stars, or the morning sun. */
export function WindowSky({ time }: { time: "evening" | "night" | "morning" }) {
  return (
    <svg viewBox="0 0 250 270" preserveAspectRatio="none" aria-hidden>
      {time === "evening" && (
        <>
          <defs>
            <linearGradient id="sf-sky-evening" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#7d6bc4" />
              <stop offset="0.55" stopColor="#d58bb8" />
              <stop offset="1" stopColor="#ffb37a" />
            </linearGradient>
          </defs>
          <rect width="250" height="270" fill="url(#sf-sky-evening)" />
          <path d={STAR_PATH} transform="translate(160 40) scale(0.22)" fill="#fff6c7" />
          <path d="M0 240 Q60 215 130 235 T250 225 V270 H0 Z" fill="#6a5a9e" />
        </>
      )}
      {time === "night" && (
        <>
          <rect width="250" height="270" fill="#17204a" />
          <circle cx="70" cy="70" r="30" fill="#fff3b0" />
          <circle cx="84" cy="60" r="27" fill="#17204a" />
          {[
            [150, 40],
            [205, 90],
            [175, 150],
            [40, 170],
            [110, 120],
            [220, 30],
          ].map(([x, y], i) => (
            <path key={i} d={STAR_PATH} transform={`translate(${x} ${y}) scale(${i % 2 ? 0.12 : 0.18})`} fill="#fff6c7" />
          ))}
          <path d="M0 240 Q60 215 130 235 T250 225 V270 H0 Z" fill="#0d1430" />
        </>
      )}
      {time === "morning" && (
        <>
          <rect width="250" height="270" fill="#a8dcff" />
          <circle cx="175" cy="80" r="34" fill="#ffd84d" />
          <g stroke="#ffd84d" strokeWidth="6" strokeLinecap="round">
            <path d="M175 30 V18 M175 130 V142 M125 80 H113 M225 80 H237 M140 45 L131 36 M210 115 L219 124 M210 45 L219 36 M140 115 L131 124" />
          </g>
          <g fill="#fff">
            <ellipse cx="60" cy="150" rx="40" ry="18" />
            <ellipse cx="85" cy="138" rx="26" ry="20" />
          </g>
          <path d="M0 240 Q60 215 130 235 T250 225 V270 H0 Z" fill="#8fd17e" />
        </>
      )}
    </svg>
  );
}

/** The bedside lamp, lit (its shade glows) or switched off. */
export function Lamp({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 110 150" aria-hidden>
      <path d="M22 18 H88 L106 84 H4 Z" fill={on ? "#ffe9a8" : "#c9b48a"} stroke={on ? "#ffc94a" : "#a8936c"} strokeWidth="4" />
      <rect x="50" y="84" width="10" height="46" fill="#8c5a3c" />
      <ellipse cx="55" cy="136" rx="32" ry="10" fill="#8c5a3c" />
      <path d="M78 84 V104" stroke="#a8936c" strokeWidth="2.5" />
      <circle cx="78" cy="107" r="4" fill="#ffd166" />
    </svg>
  );
}

/** A pacifier seen from the front: ring on top, shield with its button. */
export function Pacifier({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden>
      <PacifierShape colour={colour} />
    </svg>
  );
}

function PacifierShape({ colour }: { colour: string }) {
  return (
    <g>
      <circle cx="50" cy="26" r="17" fill="none" stroke={colour} strokeWidth="8" />
      <path d="M10 60 C10 38 90 38 90 60 C90 82 10 82 10 60 Z" fill={colour} stroke="#00000022" strokeWidth="3" />
      <ellipse cx="27" cy="60" rx="6" ry="8" fill="#00000022" />
      <ellipse cx="73" cy="60" rx="6" ry="8" fill="#00000022" />
      <circle cx="50" cy="60" r="12" fill="#fffaf2" />
    </g>
  );
}

/** The pacifier box: open with the rings of the pacifiers already in it peeking out, or shut with a bow. */
export function PacifierBox({ inside, shut }: { inside: string[]; shut: boolean }) {
  return (
    <svg viewBox="0 0 140 120" aria-hidden>
      {!shut && <path d="M14 52 L24 8 L132 8 L126 52 Z" fill="#f08bb4" stroke="#d9658f" strokeWidth="3" />}
      {!shut && inside.map((colour, i) => <circle key={i} cx={42 + i * 28} cy={44} r={12} fill="none" stroke={colour} strokeWidth="6" />)}
      <rect x="10" y="50" width="120" height="66" rx="10" fill="#ffb3d1" stroke="#d9658f" strokeWidth="3" />
      {!shut && <rect x="14" y="48" width="112" height="8" rx="3" fill="#b8466f" />}
      <path
        d="M70 102 C52 90 46 82 46 74 C46 67 52 63 58 63 C63 63 67 66 70 70 C73 66 77 63 82 63 C88 63 94 67 94 74 C94 82 88 90 70 102 Z"
        fill="#fff"
        opacity="0.85"
      />
      {shut && (
        <>
          <rect x="4" y="36" width="132" height="20" rx="6" fill="#f08bb4" stroke="#d9658f" strokeWidth="3" />
          <rect x="63" y="36" width="14" height="80" fill="#ffd166" />
          <path d="M70 36 C52 14 40 26 50 36 Z M70 36 C88 14 100 26 90 36 Z" fill="#ffd166" stroke="#e0a800" strokeWidth="2.5" />
          <circle cx="70" cy="35" r="6" fill="#ffc94a" />
        </>
      )}
    </svg>
  );
}

/** Where the pacifiers tied on hang from the balloon's string. */
const TIED = [
  [26, 292],
  [94, 322],
  [32, 360],
];

/** A red balloon floating on its long string, the pacifiers already tied on hanging from it. */
export function Balloon({ tied }: { tied: string[] }) {
  return (
    <svg viewBox="0 0 180 440" aria-hidden>
      <path d="M90 186 C70 240 110 290 90 340 C80 370 95 385 92 400" fill="none" stroke="#7a6a5f" strokeWidth="3" />
      {tied.map((colour, i) => (
        <g key={i}>
          <path d={`M90 ${TIED[i][1] + 2} L${TIED[i][0] + 30} ${TIED[i][1] + 10}`} stroke="#7a6a5f" strokeWidth="2" />
          <g transform={`translate(${TIED[i][0]} ${TIED[i][1]}) scale(0.6)`}>
            <PacifierShape colour={colour} />
          </g>
        </g>
      ))}
      <ellipse cx="90" cy="96" rx="70" ry="86" fill="#ff5d73" />
      <ellipse cx="62" cy="62" rx="13" ry="24" fill="#fff" opacity="0.45" transform="rotate(-25 62 62)" />
      <path d="M83 180 H97 L90 190 Z" fill="#e0465c" />
    </svg>
  );
}

/** Tapsi the fox child in pyjamas, standing. */
export function TapsiStanding() {
  return (
    <svg viewBox="0 0 160 320" aria-hidden>
      <path d="M112 228 C168 218 178 150 146 118 C152 170 132 200 104 212 Z" fill={FOX} />
      <path d="M146 118 C162 134 168 150 162 162 C157 147 150 136 138 128 Z" fill={MUZZLE} />
      <rect x="52" y="228" width="24" height="64" rx="10" fill="#8ec5f0" />
      <rect x="86" y="228" width="24" height="64" rx="10" fill="#8ec5f0" />
      <ellipse cx="62" cy="298" rx="19" ry="10" fill={FOX_DARK} />
      <ellipse cx="100" cy="298" rx="19" ry="10" fill={FOX_DARK} />
      <path d="M44 132 Q80 118 116 132 L124 234 Q80 246 36 234 Z" fill="#8ec5f0" />
      <g fill="#fff">
        <circle cx="62" cy="170" r="4" />
        <circle cx="96" cy="160" r="4" />
        <circle cx="80" cy="205" r="4" />
        <circle cx="106" cy="214" r="4" />
      </g>
      <path d="M50 142 L28 204 M110 142 L132 204" stroke="#8ec5f0" strokeWidth="20" strokeLinecap="round" />
      <circle cx="27" cy="208" r="11" fill={FOX} />
      <circle cx="133" cy="208" r="11" fill={FOX} />
      <g transform="translate(20 14) scale(1.2)">
        <FoxHead />
      </g>
    </svg>
  );
}

/** Tapsi asleep in the bed: his head on the pillow, the blanket over him, the tip of his tail peeking out at the end. */
export function TapsiAsleep() {
  return (
    <svg viewBox="0 0 420 230" aria-hidden>
      <path d="M372 112 C400 92 418 104 412 124 C404 114 390 112 378 120 Z" fill={FOX} />
      <path d="M404 100 C414 104 418 112 414 122 C410 114 406 110 398 106 Z" fill={MUZZLE} />
      <g transform="translate(44 28) rotate(-14 50 60)">
        <FoxHead asleep />
      </g>
      <path d="M128 118 Q200 78 290 92 Q360 100 404 118 L404 198 L128 198 Z" fill="#ffe08a" />
      <path d="M128 118 Q200 78 290 92 Q360 100 404 118" fill="none" stroke="#f2c14e" strokeWidth="6" />
      <g fill="#ffc94a">
        <circle cx="200" cy="140" r="7" />
        <circle cx="270" cy="170" r="7" />
        <circle cx="330" cy="130" r="7" />
      </g>
      <circle cx="150" cy="120" r="12" fill={FOX} />
    </svg>
  );
}

/** Mama Fuchs in a green dress, a flower at her ear. */
export function MamaFox() {
  return (
    <svg viewBox="0 0 200 440" aria-hidden>
      <path d="M140 330 C202 320 216 238 180 198 C186 258 166 298 128 310 Z" fill={FOX} />
      <path d="M180 198 C198 216 204 236 198 248 C192 232 184 220 170 210 Z" fill={MUZZLE} />
      <rect x="72" y="362" width="22" height="58" rx="10" fill={FOX} />
      <rect x="106" y="362" width="22" height="58" rx="10" fill={FOX} />
      <ellipse cx="82" cy="424" rx="20" ry="10" fill={FOX_DARK} />
      <ellipse cx="118" cy="424" rx="20" ry="10" fill={FOX_DARK} />
      <path d="M62 166 Q100 148 138 166 L178 368 Q100 388 22 368 Z" fill="#6cbf84" />
      <path d="M74 160 Q100 182 126 160 Q100 170 74 160 Z" fill="#fff" />
      <path d="M44 340 Q100 356 156 340" fill="none" stroke="#fff" strokeWidth="6" opacity="0.7" />
      <path d="M68 180 L36 288 M132 180 L164 288" stroke="#6cbf84" strokeWidth="22" strokeLinecap="round" />
      <circle cx="34" cy="294" r="13" fill={FOX} />
      <circle cx="166" cy="294" r="13" fill={FOX} />
      <g transform="translate(25 6) scale(1.5)">
        <FoxHead />
        <circle cx="76" cy="26" r="6" fill="#ff7bd0" />
        <circle cx="76" cy="26" r="2.5" fill="#ffd166" />
      </g>
    </svg>
  );
}

/** The pacifier fairy: a little bear with wings, a crown and a star wand, glowing in the dark; with the balloon, holding its string. */
export function Fairy({ balloon }: { balloon: boolean }) {
  return (
    <svg viewBox="0 0 220 240" aria-hidden>
      <defs>
        <radialGradient id="sf-fairy-glow">
          <stop offset="0" stopColor="#fff9d6" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#ffe98a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffe98a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="120" r="110" fill="url(#sf-fairy-glow)" />
      <g fill="#ece4ff" stroke="#b9a6ff" strokeWidth="3" opacity="0.92">
        <ellipse cx="70" cy="104" rx="32" ry="46" transform="rotate(-28 70 104)" />
        <ellipse cx="150" cy="104" rx="32" ry="46" transform="rotate(28 150 104)" />
        <ellipse cx="80" cy="152" rx="18" ry="26" transform="rotate(30 80 152)" />
        <ellipse cx="140" cy="152" rx="18" ry="26" transform="rotate(-30 140 152)" />
      </g>
      {balloon && (
        <>
          <path d="M160 156 C175 130 172 108 186 84" fill="none" stroke="#7a6a5f" strokeWidth="2.5" />
          <ellipse cx="190" cy="56" rx="21" ry="27" fill="#ff5d73" />
          <path d="M185 82 H195 L190 89 Z" fill="#e0465c" />
        </>
      )}
      <path d="M110 116 L152 204 Q110 218 68 204 Z" fill="#ff9ec4" />
      <path d="M78 196 Q110 206 142 196" fill="none" stroke="#fff" strokeWidth="4" />
      <circle cx="98" cy="212" r="7" fill="#a8714a" />
      <circle cx="122" cy="212" r="7" fill="#a8714a" />
      <path d="M96 136 L62 118 M124 136 L160 156" stroke="#a8714a" strokeWidth="10" strokeLinecap="round" />
      <path d="M62 118 L30 70" stroke="#c9a227" strokeWidth="4" strokeLinecap="round" />
      <path d={STAR_PATH} transform="translate(13 50) scale(0.34)" fill="#ffe066" stroke="#e0a800" strokeWidth="5" />
      <circle cx="88" cy="62" r="12" fill="#a8714a" />
      <circle cx="132" cy="62" r="12" fill="#a8714a" />
      <circle cx="88" cy="62" r="6" fill="#e3b48c" />
      <circle cx="132" cy="62" r="6" fill="#e3b48c" />
      <circle cx="110" cy="88" r="32" fill="#a8714a" />
      <ellipse cx="110" cy="101" rx="14" ry="10" fill="#e3c19c" />
      <ellipse cx="110" cy="96" rx="5" ry="3.6" fill={INK} />
      <path d="M104 104 Q110 109 116 104" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <circle cx="99" cy="84" r="3.8" fill={INK} />
      <circle cx="121" cy="84" r="3.8" fill={INK} />
      <circle cx="90" cy="96" r="4.5" fill="#ff9e9e" opacity="0.6" />
      <circle cx="130" cy="96" r="4.5" fill="#ff9e9e" opacity="0.6" />
      <path d="M96 60 L101 46 L110 56 L119 46 L124 60 Z" fill="#ffd166" stroke="#e0a800" strokeWidth="2" />
    </svg>
  );
}

/** The present on the windowsill: a purple box with a yellow ribbon, without its lid (`PresentLid`, which flies off). */
export function Present() {
  return (
    <svg viewBox="0 0 140 120" aria-hidden>
      <rect x="15" y="52" width="110" height="64" rx="6" fill="#8e7dff" />
      <rect x="64" y="52" width="12" height="64" fill="#ffd166" />
    </svg>
  );
}

/** The present's lid with its bow, in the same 140 × 120 as the present. */
export function PresentLid() {
  return (
    <svg viewBox="0 0 140 120" aria-hidden>
      <rect x="7" y="36" width="126" height="20" rx="5" fill="#a596ff" />
      <rect x="64" y="36" width="12" height="20" fill="#ffd166" />
      <path d="M70 36 C50 12 38 24 50 36 Z M70 36 C90 12 102 24 90 36 Z" fill="#ffd166" stroke="#e0a800" strokeWidth="2.5" />
    </svg>
  );
}
