import { Face, INK, SKIN, nth } from "../shared";
import { Leaf } from "../weather";

// The people of the autumn picture, foot point at (0, 0). Grandma sits on the bench
// (the cat in animals.tsx shares its coordinates), the farmer stands behind the
// counter of the pumpkin stall (things.tsx).

/** Music notes that show while someone sings or hums. */
function Notes({ className, spots }: { className: string; spots: [number, number][] }) {
  return (
    <g fill={INK}>
      {spots.map(([x, y], i) => (
        <g key={i} className={className} style={nth(i)}>
          <ellipse cx={x} cy={y} rx="6" ry="4.5" />
          <path d={`M${x + 5} ${y} v-16 l7 4`} stroke={INK} strokeWidth="2.4" fill="none" />
        </g>
      ))}
    </g>
  );
}

/** The boy flying the kite. His right hand holds the string at BOY_HAND (34, -128) and stays there. */
export function Junge() {
  return (
    <>
      <g className="he-junge-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-15" y="-48" width="13" height="44" rx="5" fill="#457b9d" />
        <rect x="2" y="-48" width="13" height="44" rx="5" fill="#457b9d" />
        <ellipse cx="-10" cy="-3" rx="11" ry="5" fill="#6b4423" />
        <ellipse cx="10" cy="-3" rx="11" ry="5" fill="#6b4423" />
        <g className="he-junge-wave" style={{ transformOrigin: "-18px -88px" }}>
          <path d="M-18 -88 L-34 -60" stroke="#2a9d8f" strokeWidth="12" strokeLinecap="round" />
          <circle cx="-35" cy="-57" r="7" fill={SKIN} />
        </g>
        <rect x="-24" y="-98" width="48" height="56" rx="16" fill="#2a9d8f" />
        <path d="M0 -94 V-46" stroke="#21867a" strokeWidth="3" />
        <rect x="-18" y="-58" width="12" height="9" rx="3" fill="#21867a" />
        <path d="M18 -88 L34 -126" stroke="#2a9d8f" strokeWidth="12" strokeLinecap="round" />
        <g className="he-junge-scarf" style={{ transformOrigin: "12px -96px" }}>
          <path d="M10 -98 q20 4 32 16 l-6 8 q-12 -10 -28 -12 Z" fill="#e63946" />
          <path d="M22 -94 l4 8 M32 -88 l-2 8" stroke="#fff" strokeWidth="3" />
        </g>
        <rect x="-20" y="-104" width="40" height="11" rx="5" fill="#e63946" />
        <path d="M-12 -104 v11 M0 -104 v11 M12 -104 v11" stroke="#fff" strokeWidth="3" />
        <g className="he-junge-head" style={{ transformOrigin: "0px -104px" }}>
          <circle cx="0" cy="-124" r="20" fill={SKIN} />
          <Face cx={0} cy={-124} size={0.85} />
          <path d="M-21 -128 Q-22 -152 0 -152 Q22 -152 21 -128 Z" fill="#ffd60a" />
          <rect x="-22" y="-134" width="44" height="9" rx="4" fill="#f4a261" />
          <circle className="he-junge-pom" cx="0" cy="-156" r="7" fill="#e63946" style={{ transformOrigin: "0px -152px" }} />
        </g>
      </g>
      <circle cx="34" cy="-128" r="7" fill={SKIN} />
    </>
  );
}

/** The girl in the red raincoat with her blue umbrella: jumps into the puddle. */
export function Maedchen() {
  return (
    <>
      <g className="he-maedchen-drops" fill="#74c0fc">
        {[
          [-44, -14],
          [-26, -30],
          [24, -30],
          [44, -14],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" style={nth(i)} />
        ))}
      </g>
      <g className="he-maedchen-body" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-16 -36 h13 v22 h-13 Z M3 -36 h13 v22 h-13 Z" fill="#ffd60a" />
        <path d="M-18 -16 h16 q2 10 -4 14 h-14 Z M2 -16 h16 v14 h-14 q-6 -4 -2 -14 Z" fill="#ffc300" />
        <g className="he-maedchen-wave" style={{ transformOrigin: "-20px -84px" }}>
          <path d="M-20 -84 L-38 -58" stroke="#e63946" strokeWidth="12" strokeLinecap="round" />
          <circle cx="-39" cy="-55" r="7" fill={SKIN} />
        </g>
        <path d="M-22 -96 Q-30 -40 -28 -34 H28 Q30 -40 22 -96 Z" fill="#e63946" />
        <path d="M0 -92 V-36" stroke="#c1121f" strokeWidth="3" />
        <circle cx="-6" cy="-76" r="2.5" fill="#fff" />
        <circle cx="-6" cy="-60" r="2.5" fill="#fff" />
        <g className="he-maedchen-umbrella" style={{ transformOrigin: "26px -92px" }}>
          <path d="M24 -88 V-196" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M24 -88 q0 8 -8 8 q-6 0 -6 -6" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path
            d="M-41 -186 Q24 -256 89 -186 q-11 -8 -22 0 q-11 -8 -21 0 q-11 -8 -22 0 q-11 -8 -22 0 q-11 -8 -21 0 q-11 -8 -21 0 Z"
            fill="#4dabf7"
          />
          <path d="M24 -232 Q4 -214 2 -186 M24 -232 Q44 -214 46 -186" stroke="#339af0" strokeWidth="3" fill="none" />
          <path d="M-20 -200 Q0 -230 20 -232" stroke="#fff" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="24" cy="-234" r="4" fill={INK} />
        </g>
        <path d="M20 -90 L26 -92" stroke="#e63946" strokeWidth="12" strokeLinecap="round" />
        <circle cx="26" cy="-92" r="7" fill={SKIN} />
        <g className="he-maedchen-head" style={{ transformOrigin: "0px -100px" }}>
          <g className="he-maedchen-tails" fill="#6b4423">
            <ellipse cx="-24" cy="-118" rx="7" ry="11" style={{ transformOrigin: "-20px -126px" }} />
            <ellipse cx="24" cy="-118" rx="7" ry="11" style={{ transformOrigin: "20px -126px" }} />
          </g>
          <circle cx="0" cy="-120" r="19" fill={SKIN} />
          <path d="M-19 -122 Q-20 -142 0 -142 Q20 -142 19 -122 Q8 -134 -19 -122 Z" fill="#6b4423" />
          <Face cx={0} cy={-120} size={0.82} />
        </g>
      </g>
    </>
  );
}

/** Child with a St. Martin lantern on a stick: the lantern glows and swings, the child sings. */
export function Laternenkind() {
  return (
    <>
      <circle className="he-laterne-glow" cx="80" cy="-110" r="46" fill="#ffe066" opacity="0.25" style={{ transformOrigin: "80px -110px" }} />
      <g className="he-laterne-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-14" y="-46" width="12" height="42" rx="5" fill="#495057" />
        <rect x="2" y="-46" width="12" height="42" rx="5" fill="#495057" />
        <ellipse cx="-9" cy="-3" rx="10" ry="5" fill="#9c6644" />
        <ellipse cx="9" cy="-3" rx="10" ry="5" fill="#9c6644" />
        <path d="M-18 -86 L-30 -58" stroke="#9b5de5" strokeWidth="12" strokeLinecap="round" />
        <circle cx="-31" cy="-55" r="7" fill={SKIN} />
        <rect x="-23" y="-96" width="46" height="54" rx="15" fill="#9b5de5" />
        <path d="M-16 -50 h32" stroke="#7b2cbf" strokeWidth="4" />
        <g className="he-laterne-head" style={{ transformOrigin: "0px -100px" }}>
          <circle cx="0" cy="-118" r="19" fill="#f7d1a1" />
          <Face cx={0} cy={-118} size={0.82} />
          <ellipse cx="0" cy="-107" rx="4" ry="5" fill="#9d0208" className="he-laterne-mouth" />
          <path d="M-20 -122 Q-20 -146 0 -146 Q20 -146 20 -122 Z" fill="#4dabf7" />
          <rect x="-21" y="-128" width="42" height="8" rx="4" fill="#1c7ed6" />
          <path d="M0 -146 l-4 -10 l8 0 Z" fill="#1c7ed6" />
        </g>
      </g>
      {/* The stick rests in the child's hand; the lantern hangs at its tip. */}
      <path d="M22 -78 L86 -160" stroke="#8d5a2b" strokeWidth="5" strokeLinecap="round" />
      <path d="M18 -84 L26 -76" stroke={SKIN} strokeWidth="12" strokeLinecap="round" />
      <g className="he-laterne-lamp" style={{ transformOrigin: "86px -160px" }}>
        <path d="M86 -160 L80 -140" stroke={INK} strokeWidth="2" />
        <ellipse cx="80" cy="-110" rx="28" ry="30" fill="#ffd166" />
        <path d="M66 -134 Q60 -110 66 -86 M94 -134 Q100 -110 94 -86" stroke="#f4a261" strokeWidth="3" fill="none" />
        <circle className="he-laterne-light" cx="80" cy="-110" r="18" fill="#fff3b0" opacity="0.6" />
        <Face cx={80} cy={-114} size={0.62} />
        <rect x="66" y="-142" width="28" height="7" rx="3" fill="#e63946" />
        <rect x="66" y="-85" width="28" height="7" rx="3" fill="#e63946" />
      </g>
      <Notes className="he-laterne-note" spots={[[-40, -150], [-24, -172], [-4, -186]]} />
    </>
  );
}

/** Grandpa raking leaves: the rake scratches to and fro, leaves fly, he lifts his cap. */
export function Opa() {
  return (
    <>
      <g className="he-opa-leaves">
        {[
          [100, -14, "#e76f51"],
          [118, -10, "#e9c46a"],
          [86, -8, "#d62828"],
        ].map(([x, y, c], i) => (
          <g key={i} className="he-opa-leaf" style={nth(i)}>
            <Leaf x={Number(x)} y={Number(y)} angle={i * 60} scale={2.4} colour={String(c)} />
          </g>
        ))}
      </g>
      <g className="he-opa-body" style={{ transformOrigin: "0px 0px" }}>
        <rect x="-20" y="-80" width="17" height="76" rx="6" fill="#7f5539" />
        <rect x="3" y="-80" width="17" height="76" rx="6" fill="#7f5539" />
        <ellipse cx="-12" cy="-4" rx="14" ry="6" fill={INK} />
        <ellipse cx="12" cy="-4" rx="14" ry="6" fill={INK} />
        <rect x="-30" y="-150" width="60" height="82" rx="18" fill="#52796f" />
        <path d="M0 -146 V-72" stroke="#354f52" strokeWidth="3" />
        <circle cx="-6" cy="-128" r="3" fill="#354f52" />
        <circle cx="-6" cy="-108" r="3" fill="#354f52" />
        <circle cx="-6" cy="-88" r="3" fill="#354f52" />
        <g className="he-opa-head" style={{ transformOrigin: "0px -150px" }}>
          <circle cx="0" cy="-172" r="22" fill={SKIN} />
          <path d="M-22 -168 q-4 -12 4 -18 M22 -168 q4 -12 -4 -18" stroke="#dee2e6" strokeWidth="7" strokeLinecap="round" fill="none" />
          <Face cx={0} cy={-174} size={0.9} />
          <path d="M-12 -162 q6 -6 12 -1 q6 -5 12 1 q-6 6 -12 2 q-6 4 -12 -2 Z" fill="#f1f3f5" />
          <g className="he-opa-cap" style={{ transformOrigin: "-18px -190px" }}>
            <path d="M-22 -184 Q-22 -204 2 -204 Q24 -204 24 -188 Z" fill="#8d6e63" />
            <path d="M-4 -186 Q20 -192 34 -184 Q22 -180 -4 -182 Z" fill="#6d4c41" />
          </g>
        </g>
        <g className="he-opa-rake" style={{ transformOrigin: "0px -120px" }}>
          <path d="M-14 -138 L118 -4" stroke="#bc8a5f" strokeWidth="6" strokeLinecap="round" />
          <path d="M96 -8 L140 -2" stroke="#6c757d" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 -6 v10 M108 -5 v10 M116 -4 v10 M124 -3 v10 M132 -2 v10" stroke="#6c757d" strokeWidth="3" strokeLinecap="round" />
          <path d="M-24 -136 L10 -114 M24 -136 L48 -84" stroke="#52796f" strokeWidth="13" strokeLinecap="round" />
          <circle cx="12" cy="-112" r="8" fill={SKIN} />
          <circle cx="50" cy="-82" r="8" fill={SKIN} />
        </g>
      </g>
    </>
  );
}

/** The park bench with grandma, who knits a long red scarf. The cat (animals.tsx) sits on the right. */
export function Oma() {
  return (
    <>
      {/* Bench: iron legs, wooden seat and back */}
      <path d="M-120 0 v-60 M120 0 v-60 M-112 -64 l-8 -78 M112 -64 l8 -78" stroke="#2d6a4f" strokeWidth="8" strokeLinecap="round" />
      {[-140, -120, -100].map((y) => (
        <rect key={y} x="-132" y={y} width="264" height="14" rx="5" fill="#bc8a5f" />
      ))}
      <rect x="-140" y="-70" width="280" height="14" rx="5" fill="#a47148" />
      <rect x="-140" y="-70" width="280" height="5" rx="2.5" fill="#d4a373" />
      {/* Grandma */}
      <rect x="-70" y="-62" width="14" height="58" rx="6" fill="#6d597a" />
      <rect x="-46" y="-62" width="14" height="58" rx="6" fill="#6d597a" />
      <ellipse cx="-64" cy="-4" rx="12" ry="5" fill={INK} />
      <ellipse cx="-38" cy="-4" rx="12" ry="5" fill={INK} />
      <path d="M-82 -70 h56 q4 -10 -6 -14 h-44 q-10 4 -6 14 Z" fill="#6d597a" />
      <rect x="-80" y="-140" width="56" height="74" rx="20" fill="#b5838d" />
      <path d="M-52 -136 V-74" stroke="#9d6b75" strokeWidth="3" />
      <g className="he-oma-head" style={{ transformOrigin: "-52px -140px" }}>
        <circle cx="-52" cy="-182" r="13" fill="#f1f3f5" />
        <circle cx="-52" cy="-160" r="20" fill={SKIN} />
        <path d="M-72 -160 Q-74 -182 -52 -182 Q-30 -182 -32 -160 Q-42 -172 -72 -160 Z" fill="#f1f3f5" />
        <Face cx={-52} cy={-158} size={0.8} />
        <g fill="none" stroke={INK} strokeWidth="2">
          <circle cx="-58" cy="-158" r="6.5" />
          <circle cx="-46" cy="-158" r="6.5" />
          <path d="M-51.5 -158 h-1" />
        </g>
      </g>
      {/* Knitting: the scarf hangs from the needles and grows */}
      <g className="he-oma-scarf" style={{ transformOrigin: "-40px -104px" }}>
        <path d="M-50 -104 h22 v40 l-4 6 h-14 l-4 -6 Z" fill="#e63946" />
        <path d="M-50 -94 h22 M-50 -84 h22 M-50 -74 h22" stroke="#fff" strokeWidth="3" />
      </g>
      <path d="M-72 -120 L-46 -104 M-18 -120 L-34 -104" stroke="#b5838d" strokeWidth="12" strokeLinecap="round" />
      <path className="he-oma-needle" d="M-56 -122 L-26 -98" stroke="#adb5bd" strokeWidth="3.5" strokeLinecap="round" style={{ transformOrigin: "-42px -106px" }} />
      <path className="he-oma-needle" d="M-26 -122 L-54 -98" stroke="#adb5bd" strokeWidth="3.5" strokeLinecap="round" style={{ transformOrigin: "-40px -108px", ...nth(1) }} />
      <circle cx="-46" cy="-104" r="7" fill={SKIN} />
      <circle cx="-34" cy="-104" r="7" fill={SKIN} />
      {/* A basket of wool next to the bench */}
      <path d="M-128 0 h40 l4 -26 h-48 Z" fill="#c68b59" />
      <circle cx="-116" cy="-30" r="9" fill="#4dabf7" />
      <circle cx="-98" cy="-30" r="9" fill="#ffd60a" />
      <Notes className="he-oma-note" spots={[[-86, -196], [-70, -214], [-48, -222]]} />
    </>
  );
}

/** The farmer behind the counter of the pumpkin stall: holds up a pumpkin and waves. Drawn behind the counter. */
export function Baeuerin() {
  return (
    <g className="he-baeuerin" style={{ transformOrigin: "-30px -80px" }}>
      <rect x="-58" y="-128" width="56" height="70" rx="18" fill="#2a9d8f" />
      <rect x="-48" y="-112" width="36" height="50" rx="8" fill="#fefae0" />
      <g className="he-baeuerin-arm" style={{ transformOrigin: "-4px -118px" }}>
        <path d="M-6 -118 L18 -140" stroke="#2a9d8f" strokeWidth="12" strokeLinecap="round" />
        <circle cx="20" cy="-142" r="7" fill={SKIN} />
        <ellipse cx="26" cy="-160" rx="17" ry="14" fill="#f77f00" />
        <ellipse cx="20" cy="-160" rx="7" ry="13" fill="#f8961e" />
        <path d="M26 -174 v-8" stroke="#6b4423" strokeWidth="4" strokeLinecap="round" />
      </g>
      <path d="M-54 -118 L-68 -94" stroke="#2a9d8f" strokeWidth="12" strokeLinecap="round" />
      <g className="he-baeuerin-head" style={{ transformOrigin: "-30px -128px" }}>
        <circle cx="-30" cy="-150" r="21" fill={SKIN} />
        <Face cx={-30} cy={-150} size={0.88} />
        <path d="M-52 -150 Q-54 -176 -30 -176 Q-6 -176 -8 -150 Q-18 -164 -52 -150 Z" fill="#e63946" />
        <circle cx="-38" cy="-166" r="2.5" fill="#fff" />
        <circle cx="-24" cy="-168" r="2.5" fill="#fff" />
        <circle cx="-14" cy="-160" r="2.5" fill="#fff" />
        <path d="M-50 -152 l-8 10 l10 -2 Z" fill="#e63946" />
      </g>
    </g>
  );
}
