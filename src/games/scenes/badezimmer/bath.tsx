import { Eye, Face, SKIN, nth } from "../shared";
import { Bubbles, Lid, Lines, Splash } from "./parts";

// The bathtub and what is in it. All but the shower share the tub's placement (BATH), so they
// are drawn in its coordinates: the tub's foot is at (0, 0), the water line at y -212. The
// things in the tub stand on the water line and hide their lower part in foam.

const FOAM = "#fff";
const FOAM_SHADE = "#e3f2fb";

/** A row of foam puffs from x1 to x2 along the water line, so things look as if they sat in the water. */
function FoamLine({ x1, x2, y = -210 }: { x1: number; x2: number; y?: number }) {
  const count = Math.max(2, Math.round((x2 - x1) / 26));
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = x1 + ((x2 - x1) * (i + 0.5)) / count;
        const r = 14 + (i % 3) * 4;
        return (
          <g key={i}>
            <circle cx={x + 3} cy={y + 2} r={r} fill={FOAM_SHADE} />
            <circle cx={x} cy={y} r={r} fill={FOAM} />
          </g>
        );
      })}
    </>
  );
}

/** White claw-foot bathtub; the water sloshes, the tap pours and drops splash up. */
export function Badewanne() {
  return (
    <>
      {/* Tap on the wall at the right end */}
      <rect x="214" y="-276" width="28" height="22" rx="6" fill="#adb5bd" />
      <path d="M228 -262 Q228 -244 210 -242" stroke="#dee2e6" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M224 -266 Q226 -252 214 -248" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      <g className="bz-wanne-handle" style={{ transformOrigin: "228px -284px" }}>
        <path d="M212 -284 H244 M228 -298 V-270" stroke="#e63946" strokeWidth="8" strokeLinecap="round" />
        <circle cx="228" cy="-284" r="7" fill="#fff" />
      </g>
      <rect className="bz-wanne-stream" x="203" y="-240" width="10" height="30" rx="5" fill="#74c0fc" style={{ transformOrigin: "208px -240px" }} />
      {/* Inside: the back wall of the tub and the water */}
      <path d="M-258 -206 Q-258 -236 -230 -236 H230 Q258 -236 258 -206 Z" fill="#e6eef5" />
      <path d="M-250 -206 Q-248 -222 -226 -222 H226 Q248 -222 250 -206 Z" fill="#8fd8f0" />
      <path
        className="bz-wanne-wave"
        d="M-226 -216 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Feet */}
      {[-196, 196].map((x, i) => (
        <g key={x} className="bz-wanne-foot" style={{ ...nth(i), transformOrigin: `${x}px 0px` }}>
          <path d={`M${x - 26} -4 Q${x - 30} -34 ${x} -40 Q${x + 30} -34 ${x + 26} -4 Q${x + 14} 2 ${x} -4 Q${x - 14} 2 ${x - 26} -4 Z`} fill="#e9c46a" />
          <path d={`M${x - 12} -28 Q${x - 4} -34 ${x + 6} -32`} stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" fill="none" />
        </g>
      ))}
      {/* Body */}
      <path d="M-266 -206 H266 Q264 -72 226 -46 Q204 -30 168 -30 H-168 Q-204 -30 -226 -46 Q-264 -72 -266 -206 Z" fill="#f8fbff" />
      <path d="M-260 -124 Q-252 -64 -222 -48 Q-200 -34 -168 -34 H168 Q200 -34 222 -48 Q252 -64 260 -124 Q246 -82 196 -72 H-196 Q-246 -82 -260 -124 Z" fill="#dbe7f0" />
      <path d="M-238 -150 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t36 0" stroke="#a5d8ff" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M-240 -186 Q-238 -124 -206 -90" stroke="#fff" strokeWidth="10" strokeLinecap="round" fill="none" />
      <rect x="-272" y="-216" width="544" height="18" rx="9" fill="#fff" stroke="#d0dde8" strokeWidth="3" />
      <Splash x={-20} y={-232} count={6} spread={60} className="bz-wanne-splash" />
    </>
  );
}

/** A child bathing in the foam; it waves with both arms and sings. */
export function Kind() {
  return (
    <>
      <g className="bz-kind-body" style={{ transformOrigin: "-130px -210px" }}>
        {[
          { d: "M-160 -238 L-194 -282", hand: [-196, -286], origin: "-160px -238px" },
          { d: "M-100 -238 L-66 -282", hand: [-64, -286], origin: "-100px -238px" },
        ].map(({ d, hand, origin }, i) => (
          <g key={i} className="bz-kind-arm" style={{ ...nth(i), transformOrigin: origin }}>
            <path d={d} stroke={SKIN} strokeWidth="16" strokeLinecap="round" />
            <circle cx={hand[0]} cy={hand[1]} r="11" fill={SKIN} />
          </g>
        ))}
        <path d="M-174 -204 Q-174 -248 -130 -250 Q-86 -248 -86 -204 Z" fill={SKIN} />
        <circle cx="-130" cy="-286" r="36" fill={SKIN} />
        <path d="M-166 -290 Q-168 -324 -130 -324 Q-92 -324 -94 -290 Q-104 -308 -130 -306 Q-156 -308 -166 -290 Z" fill="#8d5524" />
        <circle cx="-166" cy="-286" r="8" fill={SKIN} />
        <circle cx="-94" cy="-286" r="8" fill={SKIN} />
        <Face cx={-130} cy={-288} size={1.2} />
        <Lid cx={-138.4} cy={-288} r={3.84} fill={SKIN} />
        <Lid cx={-121.6} cy={-288} r={3.84} fill={SKIN} />
        <ellipse className="bz-kind-mouth" cx="-130" cy="-273" rx="6" ry="7" fill="#9d0208" />
        <g className="bz-kind-crown" style={{ transformOrigin: "-128px -318px" }}>
          <circle cx="-148" cy="-320" r="12" fill={FOAM} />
          <circle cx="-128" cy="-330" r="15" fill={FOAM} />
          <circle cx="-108" cy="-320" r="11" fill={FOAM} />
          <circle cx="-132" cy="-336" r="4" fill="#d0ebff" />
        </g>
      </g>
      <FoamLine x1={-204} x2={-56} />
      <g className="bz-kind-notes" fill="#5f3dc4">
        {[
          [-74, -322],
          [-52, -344],
        ].map(([x, y], i) => (
          <g key={i} style={nth(i)}>
            <circle cx={x} cy={y} r="6" />
            <path d={`M${x + 5} ${y} V${y - 22} l10 4`} stroke="#5f3dc4" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </>
  );
}

/** Yellow rubber duck; it bobs on the waves and squeaks. */
export function Ente() {
  return (
    <>
      <g className="bz-ente-ripple" fill="none" stroke="#fff" strokeWidth="3">
        <ellipse cx="-5" cy="-212" rx="56" ry="8" style={nth(0)} />
        <ellipse cx="-5" cy="-212" rx="56" ry="8" style={nth(1)} />
      </g>
      <g className="bz-ente-body" style={{ transformOrigin: "-5px -212px" }}>
        <path d="M-50 -232 Q-60 -260 -40 -252 Q-22 -246 0 -246 Q36 -246 40 -226 Q38 -210 -2 -210 Q-46 -210 -50 -232 Z" fill="#ffd60a" />
        <path d="M-46 -222 Q-30 -212 -2 -212 Q32 -212 38 -224 Q36 -208 -2 -208 Q-40 -208 -46 -222 Z" fill="#f4b400" />
        <path d="M-24 -236 Q-4 -248 14 -232 Q-4 -220 -24 -236 Z" fill="#f4c20d" />
        <circle cx="22" cy="-266" r="22" fill="#ffd60a" />
        <circle cx="14" cy="-276" r="6" fill="#fff" opacity="0.5" />
        <path d="M38 -260 Q56 -258 54 -252 Q44 -249 38 -254 Z" fill="#f77f00" />
        <g className="bz-ente-beak" style={{ transformOrigin: "40px -261px" }}>
          <path d="M38 -270 Q62 -268 58 -259 Q46 -257 38 -259 Z" fill="#fb8500" />
        </g>
        <Eye cx={26} cy={-272} r={3.6} />
        <Lid cx={26} cy={-272} r={3.6} fill="#ffd60a" />
        <circle cx="30" cy="-258" r="4" fill="#ff8fa3" opacity="0.6" />
      </g>
      <path d="M-56 -210 q14 -7 28 0 t28 0 t28 0 t28 0" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="#8fd8f0" />
      <Lines x={66} y={-266} colour="#ffb703" />
    </>
  );
}

/** A mountain of foam; it grows, the top hops off and bubbles float away. */
export function Schaumberg() {
  const puffs = [
    [70, -226, 26],
    [102, -246, 30],
    [144, -250, 32],
    [180, -226, 24],
    [120, -282, 28],
    [154, -284, 22],
  ];
  return (
    <>
      <g className="bz-schaum-pile" style={{ transformOrigin: "127px -210px" }}>
        {puffs.map(([x, y, r]) => (
          <circle key={`s${x}`} cx={x + 4} cy={y + 4} r={r} fill={FOAM_SHADE} />
        ))}
        {puffs.map(([x, y, r]) => (
          <circle key={x} cx={x} cy={y} r={r} fill={FOAM} />
        ))}
        <circle cx="96" cy="-270" r="8" fill="#ffd6e7" opacity="0.8" />
        <circle cx="166" cy="-260" r="7" fill="#d0ebff" />
        <circle cx="138" cy="-238" r="5" fill="#d3f9d8" />
      </g>
      <g className="bz-schaum-top" style={{ transformOrigin: "136px -306px" }}>
        <circle cx="140" cy="-306" r="18" fill={FOAM_SHADE} />
        <circle cx="136" cy="-310" r="18" fill={FOAM} />
        <circle cx="130" cy="-316" r="4" fill="#d0ebff" />
      </g>
      <FoamLine x1={58} x2={196} />
      <Bubbles x={127} y={-332} count={4} spread={30} r={11} />
    </>
  );
}

/** The shower on its rail above the tub (drawn in picture coordinates); it wiggles and sprays. */
export function Dusche() {
  return (
    <>
      <rect x="501" y="104" width="8" height="196" rx="4" fill="#ced4da" />
      <rect x="496" y="98" width="18" height="10" rx="4" fill="#adb5bd" />
      <rect x="496" y="294" width="18" height="10" rx="4" fill="#adb5bd" />
      <path d="M505 148 C552 190 530 244 492 264" stroke="#adb5bd" strokeWidth="6" strokeLinecap="round" fill="none" />
      <g className="bz-dusche-spray" stroke="#74c0fc" strokeWidth="4" strokeLinecap="round">
        {[
          [452, 120],
          [460, 124],
          [468, 126],
          [446, 114],
          [476, 126],
        ].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l${-6 + i * 2} 16`} style={nth(i)} />
        ))}
      </g>
      <g className="bz-dusche-head" style={{ transformOrigin: "505px 140px" }}>
        <rect x="494" y="132" width="22" height="16" rx="5" fill="#adb5bd" />
        <path d="M505 140 L478 114" stroke="#dee2e6" strokeWidth="11" strokeLinecap="round" />
        <g transform="rotate(-35 466 106)">
          <ellipse cx="466" cy="106" rx="24" ry="14" fill="#e9ecef" stroke="#adb5bd" strokeWidth="3" />
          {[-10, 0, 10].map((dx) => (
            <circle key={dx} cx={466 + dx} cy="110" r="2.4" fill="#74c0fc" />
          ))}
        </g>
      </g>
    </>
  );
}
