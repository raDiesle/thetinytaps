import { CHEEK, Face, INK, SKIN, nth } from "../shared";
import { Hearts, Lid, Notes } from "./parts";

// The family. Each drawing has its foot point at (0, 0) and is placed with ground().

/** Mama in front of the counter, stirring cake batter in a bowl; she sings and her ponytail swings. */
export function Mama() {
  return (
    <>
      <g className="kc-mama-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="-16" cy="-7" rx="17" ry="8" fill="#c92a2a" />
        <ellipse cx="16" cy="-7" rx="17" ry="8" fill="#c92a2a" />
        <rect x="-24" y="-112" width="15" height="104" rx="7" fill={SKIN} />
        <rect x="9" y="-112" width="15" height="104" rx="7" fill={SKIN} />
        <path d="M-34 -252 Q-42 -170 -64 -104 Q0 -90 64 -104 Q42 -170 34 -252 Z" fill="#845ef7" />
        <rect x="-38" y="-322" width="76" height="86" rx="24" fill="#845ef7" />
        <path d="M-28 -304 H28 V-252 Q44 -184 40 -118 Q0 -108 -40 -118 Q-44 -184 -28 -252 Z" fill="#fff" stroke="#ffc9c9" strokeWidth="3" />
        <path d="M0 -146 c-7 -10 -20 -2 -10 8 l10 9 l10 -9 c10 -10 -3 -18 -10 -8 Z" fill="#ff8787" />
        <g className="kc-mama-hair" style={{ transformOrigin: "30px -394px" }}>
          <path d="M30 -396 Q66 -392 62 -344 Q58 -326 50 -324 Q50 -360 30 -380 Z" fill="#8d5a3b" />
          <circle cx="32" cy="-396" r="8" fill="#ff6b6b" />
        </g>
        <rect x="-8" y="-338" width="16" height="20" fill={SKIN} />
        <g className="kc-mama-head" style={{ transformOrigin: "0px -334px" }}>
          <circle cx="0" cy="-372" r="40" fill={SKIN} />
          <path d="M-40 -370 Q-44 -416 0 -416 Q44 -416 40 -370 Q30 -394 6 -392 Q-12 -398 -26 -384 Q-34 -378 -40 -370 Z" fill="#8d5a3b" />
          <Face cx={0} cy={-366} size={1.3} />
          <Lid cx={-9.1} cy={-366} r={4.2} fill={SKIN} />
          <Lid cx={9.1} cy={-366} r={4.2} fill={SKIN} />
          <ellipse className="kc-mama-mouth" cx="0" cy="-350" rx="6" ry="7" fill="#c92a2a" />
        </g>
        {/* Bowl of batter, held with the left arm */}
        <path d="M-36 -312 Q-62 -270 -48 -214" stroke="#845ef7" strokeWidth="18" strokeLinecap="round" fill="none" />
        <path d="M-56 -216 Q-54 -160 0 -160 Q54 -160 56 -216 Z" fill="#ffd43b" />
        <path d="M-44 -206 Q-40 -176 -20 -170" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.5" />
        <ellipse cx="0" cy="-216" rx="56" ry="11" fill="#fab005" />
        <ellipse cx="0" cy="-216" rx="48" ry="8" fill="#fff4e6" />
        <circle cx="-48" cy="-212" r="11" fill={SKIN} />
        {/* Stirring arm with the wooden spoon */}
        <g className="kc-mama-arm" style={{ transformOrigin: "36px -310px" }}>
          <path d="M14 -214 L42 -286" stroke="#c88b3a" strokeWidth="7" strokeLinecap="round" />
          <ellipse cx="10" cy="-216" rx="9" ry="6" fill="#e9b872" />
          <path d="M36 -312 Q62 -280 40 -258" stroke="#845ef7" strokeWidth="18" strokeLinecap="round" fill="none" />
          <circle cx="38" cy="-256" r="11" fill={SKIN} />
        </g>
      </g>
      <Notes x={70} y={-420} colour="#845ef7" />
    </>
  );
}

/** Papa on a chair at the table; he bites a cookie, crumbs fly, and he gives a thumbs up. */
export function Papa() {
  return (
    <>
      {/* Chair */}
      <rect x="-56" y="-330" width="112" height="16" rx="6" fill="#c88b3a" />
      <path d="M-46 -320 V-150 M46 -320 V-150" stroke="#c88b3a" strokeWidth="12" strokeLinecap="round" />
      <path d="M-46 -260 H46" stroke="#e9b872" strokeWidth="8" />
      <path d="M-52 -140 L-58 0 M52 -140 L58 0" stroke="#a0662f" strokeWidth="12" strokeLinecap="round" />
      <path d="M-30 -140 L-34 -24 M30 -140 L34 -24" stroke="#c88b3a" strokeWidth="9" strokeLinecap="round" />
      <path d="M-64 -150 H64 L58 -134 H-58 Z" fill="#e9b872" />
      <g className="kc-papa-body" style={{ transformOrigin: "0px -140px" }}>
        {/* Legs */}
        <rect x="-42" y="-168" width="84" height="34" rx="16" fill="#4c6ef5" />
        <rect x="-38" y="-140" width="26" height="120" rx="12" fill="#4c6ef5" />
        <rect x="12" y="-140" width="26" height="120" rx="12" fill="#4c6ef5" />
        <g className="kc-papa-foot" style={{ ...nth(0), transformOrigin: "-25px -24px" }}>
          <ellipse cx="-28" cy="-14" rx="20" ry="11" fill="#495057" />
        </g>
        <g className="kc-papa-foot" style={{ ...nth(1), transformOrigin: "25px -24px" }}>
          <ellipse cx="28" cy="-14" rx="20" ry="11" fill="#495057" />
        </g>
        {/* Body and head */}
        <rect x="-46" y="-290" width="92" height="132" rx="28" fill="#40c057" />
        <path d="M-30 -262 H30 M-36 -234 H36 M-38 -206 H38" stroke="#2f9e44" strokeWidth="5" opacity="0.5" />
        <rect x="-9" y="-306" width="18" height="20" fill={SKIN} />
        <g className="kc-papa-head" style={{ transformOrigin: "0px -300px" }}>
          <circle cx="0" cy="-344" r="44" fill={SKIN} />
          <path d="M-44 -348 Q-46 -394 0 -394 Q46 -394 44 -348 Q36 -372 0 -372 Q-36 -372 -44 -348 Z" fill="#495057" />
          <path d="M-38 -332 Q-40 -292 0 -290 Q40 -292 38 -332 Q30 -310 0 -312 Q-30 -310 -38 -332 Z" fill="#6b4423" />
          <circle cx="-15" cy="-346" r="12" fill="#fff" fillOpacity="0.4" stroke={INK} strokeWidth="3" />
          <circle cx="15" cy="-346" r="12" fill="#fff" fillOpacity="0.4" stroke={INK} strokeWidth="3" />
          <path d="M-3 -346 H3" stroke={INK} strokeWidth="3" />
          <circle cx="-15" cy="-346" r="4" fill={INK} />
          <circle cx="15" cy="-346" r="4" fill={INK} />
          <Lid cx={-15} cy={-346} r={4} fill={SKIN} />
          <Lid cx={15} cy={-346} r={4} fill={SKIN} />
          <circle cx="-30" cy="-326" r="6" fill={CHEEK} opacity="0.5" />
          <circle cx="30" cy="-326" r="6" fill={CHEEK} opacity="0.5" />
          <path className="kc-papa-smile" d="M-12 -320 Q0 -310 12 -320" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <ellipse className="kc-papa-mouth" cx="0" cy="-318" rx="10" ry="8" fill="#862e2e" />
        </g>
        {/* Arm with the mug resting on his knee */}
        <path d="M-44 -270 Q-70 -210 -40 -176" stroke="#40c057" strokeWidth="20" strokeLinecap="round" fill="none" />
        <path d="M-58 -196 h28 v26 q0 8 -8 8 h-12 q-8 0 -8 -8 Z" fill="#ffd43b" />
        <path d="M-30 -188 q10 0 10 8 q0 8 -10 6" stroke="#ffd43b" strokeWidth="4" fill="none" />
        <circle cx="-40" cy="-176" r="11" fill={SKIN} />
        {/* Arm with the cookie: it goes up to his mouth */}
        <g className="kc-papa-arm" style={{ transformOrigin: "40px -272px" }}>
          <path d="M40 -272 Q72 -230 50 -200" stroke="#40c057" strokeWidth="20" strokeLinecap="round" fill="none" />
          <circle cx="48" cy="-196" r="11" fill={SKIN} />
          <circle cx="56" cy="-212" r="16" fill="#e9b872" stroke="#c88b3a" strokeWidth="3" />
          <circle cx="52" cy="-216" r="2.5" fill="#6b4423" />
          <circle cx="60" cy="-208" r="2.5" fill="#6b4423" />
        </g>
        <g className="kc-papa-crumbs" fill="#c88b3a">
          {[
            [-26, -300],
            [24, -296],
            [-10, -280],
            [12, -276],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" style={nth(i)} />
          ))}
        </g>
      </g>
      <Hearts x={0} y={-420} count={2} spread={50} />
    </>
  );
}

/** The child in its high chair; it shakes its rattle, kicks its feet and laughs. */
export function Kind() {
  return (
    <>
      {/* High chair: legs, footrest and seat */}
      <path d="M-36 -250 L-56 -24 M36 -250 L56 -24" stroke="#ffa94d" strokeWidth="10" strokeLinecap="round" opacity="0.7" />
      <path d="M-46 -250 L-80 0 M46 -250 L80 0" stroke="#ff922b" strokeWidth="13" strokeLinecap="round" />
      <path d="M-64 -100 H64" stroke="#ff922b" strokeWidth="10" strokeLinecap="round" />
      <rect x="-60" y="-436" width="120" height="180" rx="30" fill="#ffc078" />
      <path d="M-44 -420 V-280" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
      <g className="kc-kind-body" style={{ transformOrigin: "0px -270px" }}>
        {/* Legs dangle below the tray */}
        {[-1, 1].map((s, i) => (
          <g key={s} className="kc-kind-leg" style={{ ...nth(i), transformOrigin: `${s * 18}px -262px` }}>
            <rect x={s * 18 - 9} y="-268" width="18" height="70" rx="8" fill="#74c0fc" />
            <ellipse cx={s * 18} cy="-196" rx="12" ry="9" fill="#fff" />
          </g>
        ))}
        <rect x="-38" y="-370" width="76" height="96" rx="26" fill="#ffd43b" />
        <path d="M-22 -366 Q0 -330 22 -366 Z" fill="#fff" />
        <circle cx="0" cy="-350" r="5" fill="#ff8787" />
        <rect x="-8" y="-384" width="16" height="16" fill={SKIN} />
        <g className="kc-kind-head" style={{ transformOrigin: "0px -380px" }}>
          <circle cx="0" cy="-416" r="40" fill={SKIN} />
          <path d="M-6 -456 Q4 -474 14 -458 Q8 -462 4 -454 Z" fill="#e9b872" stroke="#c88b3a" strokeWidth="2" />
          <path d="M-36 -426 Q-30 -456 0 -456 Q30 -456 36 -426 Q20 -440 0 -440 Q-20 -440 -36 -426 Z" fill="#e9b872" />
          <Face cx={0} cy={-412} size={1.3} />
          <Lid cx={-9.1} cy={-412} r={4.2} fill={SKIN} />
          <Lid cx={9.1} cy={-412} r={4.2} fill={SKIN} />
          <ellipse className="kc-kind-mouth" cx="0" cy="-396" rx="8" ry="8" fill="#c92a2a" />
        </g>
        {/* Arm on the tray */}
        <path d="M-36 -350 Q-58 -322 -40 -300" stroke="#ffd43b" strokeWidth="16" strokeLinecap="round" fill="none" />
        <circle cx="-40" cy="-298" r="10" fill={SKIN} />
        {/* Arm with the rattle */}
        <g className="kc-kind-arm" style={{ transformOrigin: "34px -352px" }}>
          <path d="M34 -352 Q66 -360 70 -394" stroke="#ffd43b" strokeWidth="16" strokeLinecap="round" fill="none" />
          <circle cx="70" cy="-398" r="10" fill={SKIN} />
          <path d="M70 -400 V-430" stroke="#ff8787" strokeWidth="7" strokeLinecap="round" />
          <circle cx="70" cy="-446" r="20" fill="#ff8787" />
          <circle cx="64" cy="-452" r="5" fill="#fff" opacity="0.7" />
          <circle cx="70" cy="-446" r="20" fill="none" stroke="#fa5252" strokeWidth="3" />
        </g>
      </g>
      {/* Tray with a bowl and a spoon */}
      <rect x="-86" y="-300" width="172" height="20" rx="8" fill="#fff" stroke="#ffc078" strokeWidth="3" />
      <path d="M8 -300 Q10 -320 32 -320 Q54 -320 56 -300 Z" fill="#69db7c" />
      <path d="M-70 -292 L-14 -300" stroke="#adb5bd" strokeWidth="5" strokeLinecap="round" />
      <Hearts x={-10} y={-490} count={3} spread={40} colour="#ff8787" />
    </>
  );
}
