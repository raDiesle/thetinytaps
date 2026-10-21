import { INK, nth } from "../shared";
import { Lid, Lines, Notes } from "./parts";

// The birds. Each sits on something else and is drawn in its coordinates: the owl in the
// oak's hollow, the cuckoo on the fir, woodpecker and nest on the birch, the raven on the signpost.

const EYE = "#2b2d42";
const OWL = "#a0754f";

/** Tawny owl in the oak's hollow; it turns its head far round, blinks its big eyes, spreads its wings and hoots. */
export function Eule() {
  return (
    <g className="wd-eule-body" style={{ transformOrigin: "0px -128px" }}>
      <g className="wd-eule-wing" style={{ transformOrigin: "-18px -164px" }}>
        <path d="M-18 -168 Q-40 -150 -30 -122 Q-18 -130 -14 -150 Z" fill="#7f5539" />
      </g>
      <g className="wd-eule-wing wd-wing-right" style={{ transformOrigin: "18px -164px" }}>
        <path d="M18 -168 Q40 -150 30 -122 Q18 -130 14 -150 Z" fill="#7f5539" />
      </g>
      <ellipse cx="0" cy="-148" rx="22" ry="27" fill={OWL} />
      <ellipse cx="0" cy="-142" rx="14" ry="18" fill="#e9d8a6" />
      <path d="M-6 -150 l3 3 l3 -3 M2 -140 l3 3 l3 -3 M-8 -134 l3 3 l3 -3" stroke="#b08968" strokeWidth="2" fill="none" />
      <path d="M-8 -122 v6 M-3 -122 v6 M3 -122 v6 M8 -122 v6" stroke="#f4a261" strokeWidth="3" strokeLinecap="round" />
      <g className="wd-eule-head" style={{ transformOrigin: "0px -170px" }}>
        <path d="M-20 -194 L-16 -210 L-6 -198 Z M20 -194 L16 -210 L6 -198 Z" fill="#7f5539" />
        <circle cx="0" cy="-184" r="22" fill={OWL} />
        <circle cx="-9" cy="-184" r="10" fill="#e9d8a6" />
        <circle cx="9" cy="-184" r="10" fill="#e9d8a6" />
        <circle cx="-9" cy="-184" r="7" fill="#ffb703" />
        <circle cx="9" cy="-184" r="7" fill="#ffb703" />
        <g className="wd-eule-pupils">
          <circle cx="-9" cy="-184" r="4" fill={EYE} />
          <circle cx="9" cy="-184" r="4" fill={EYE} />
          <circle cx="-7.6" cy="-185.6" r="1.4" fill="#fff" />
          <circle cx="10.4" cy="-185.6" r="1.4" fill="#fff" />
        </g>
        <path d="M-3 -178 L3 -178 L0 -170 Z" fill="#e76f51" />
        <Lid cx={-9} cy={-184} r={7} fill={OWL} />
        <Lid cx={9} cy={-184} r={7} fill={OWL} />
      </g>
      <Notes x={22} y={-212} texts={["Schu", "hu!"]} size={18} />
    </g>
  );
}

const GREY = "#8d99ae";

/** Cuckoo on a branch of the fir; it bobs, lifts its tail, opens its beak and calls "Kuckuck!" twice. */
export function Kuckuck() {
  return (
    <>
      <g className="wd-kuckuck-body" style={{ transformOrigin: "112px -194px" }}>
        <path className="wd-kuckuck-tail" d="M94 -212 L56 -196 L60 -188 L96 -204 Z" fill="#6c757d" style={{ transformOrigin: "94px -208px" }} />
        <path d="M60 -194 l6 -2 M66 -196 l6 -2" stroke="#fff" strokeWidth="2" />
        <ellipse cx="110" cy="-216" rx="23" ry="14" transform="rotate(-14 110 -216)" fill={GREY} />
        <ellipse cx="114" cy="-208" rx="15" ry="8" fill="#f8f9fa" />
        <path d="M104 -210 h14 M106 -204 h12" stroke="#adb5bd" strokeWidth="2" />
        <path className="wd-kuckuck-wing" d="M96 -222 Q112 -230 122 -216 Q108 -208 96 -222 Z" fill="#6c757d" style={{ transformOrigin: "100px -220px" }} />
        <g className="wd-kuckuck-head" style={{ transformOrigin: "126px -226px" }}>
          <circle cx="130" cy="-234" r="11" fill={GREY} />
          <circle cx="133" cy="-236" r="4" fill="#ffd60a" />
          <circle cx="133.5" cy="-236" r="2.2" fill={EYE} />
          <path d="M140 -236 L152 -233 L140 -231 Z" fill="#495057" />
          <path className="wd-kuckuck-beak" d="M140 -232 L150 -230 L140 -228 Z" fill="#ffb703" style={{ transformOrigin: "140px -231px" }} />
          <Lid cx={133} cy={-236} r={4} fill={GREY} />
        </g>
        <path d="M108 -202 v8 M116 -202 v8" stroke="#ffb703" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <Notes x={140} y={-256} texts={["Kuckuck!", "Kuckuck!"]} size={20} />
    </>
  );
}

/** Great spotted woodpecker on the birch trunk; it drums with its beak, wood chips fly, it flicks its tail and blinks. */
export function Specht() {
  return (
    <g className="wd-specht-body" style={{ transformOrigin: "-24px -150px" }}>
      <path className="wd-specht-tail" d="M-36 -146 L-40 -122 L-28 -128 Z" fill={INK} style={{ transformOrigin: "-34px -146px" }} />
      <ellipse cx="-30" cy="-170" rx="14" ry="27" fill={INK} />
      <ellipse cx="-24" cy="-166" rx="7" ry="18" fill="#f8f9fa" />
      <path d="M-40 -180 q-4 10 0 22 M-38 -166 l4 2 M-38 -158 l4 2" stroke="#f8f9fa" strokeWidth="4" strokeLinecap="round" fill="none" />
      <ellipse cx="-26" cy="-146" rx="6" ry="5" fill="#e63946" />
      <path d="M-18 -180 l6 -2 M-18 -158 l6 -2" stroke="#495057" strokeWidth="3" strokeLinecap="round" />
      <g className="wd-specht-head" style={{ transformOrigin: "-30px -192px" }}>
        <circle cx="-26" cy="-202" r="12" fill="#f8f9fa" />
        <path d="M-38 -204 Q-34 -216 -22 -214 Q-14 -212 -16 -206 Q-26 -210 -38 -204 Z" fill={INK} />
        <path d="M-37 -210 Q-36 -218 -28 -218 L-30 -210 Z" fill="#e63946" />
        <path d="M-34 -196 Q-26 -192 -18 -196" stroke={INK} strokeWidth="3" fill="none" />
        <circle cx="-22" cy="-204" r="2.6" fill={EYE} />
        <circle cx="-21.2" cy="-205" r="0.9" fill="#fff" />
        <path d="M-15 -204 L-2 -201 L-15 -198 Z" fill="#495057" />
        <Lid cx={-22} cy={-204} r={2.6} fill="#f8f9fa" />
      </g>
      <g className="wd-specht-chips" fill="#e6c79c">
        {[
          [2, -206],
          [6, -196],
          [0, -190],
        ].map(([x, y], i) => (
          <rect key={y} x={x} y={y} width="6" height="3" rx="1" style={nth(i)} />
        ))}
      </g>
      <Lines x={8} y={-214} colour="#fff" size={0.6} />
    </g>
  );
}

/** Bird's nest in the fork of the birch; the chicks pop up and open their beaks, the mother brings a worm. */
export function Vogelnest() {
  return (
    <>
      {[-18, 0, 18].map((x, i) => (
        <g key={x} className="wd-nest-chick" style={nth(i)}>
          <ellipse cx={x} cy={-322} rx="10" ry="11" fill="#ced4da" />
          <path d={`M${x - 6} ${-332} l2 -6 M${x} ${-333} l0 -7 M${x + 6} ${-332} l-2 -6`} stroke="#ced4da" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx={x - 4} cy={-325} r="2" fill={EYE} />
          <circle cx={x + 4} cy={-325} r="2" fill={EYE} />
          <path d={`M${x - 5} ${-320} L${x} ${-326} L${x + 5} ${-320} Z`} fill="#ffb703" />
          <path className="wd-nest-beak" d={`M${x - 5} ${-320} L${x} ${-312} L${x + 5} ${-320} Z`} fill="#f77f00" style={{ transformOrigin: `${x}px ${-320}px` }} />
        </g>
      ))}
      <path d="M-40 -318 Q0 -278 40 -318 Q0 -308 -40 -318 Z" fill="#9c6644" />
      <path d="M-36 -314 L30 -304 M-30 -304 L36 -314 M-20 -298 L22 -300" stroke="#7f5539" strokeWidth="3" strokeLinecap="round" />
      <path d="M-42 -318 Q0 -310 42 -318" stroke="#b08968" strokeWidth="5" strokeLinecap="round" fill="none" />
      <g className="wd-nest-mama">
        <path d="M60 -372 Q48 -390 40 -380 Q50 -372 60 -372 Z" fill="#e76f51" className="wd-nest-wing" />
        <ellipse cx="60" cy="-366" rx="15" ry="10" fill="#f4a261" />
        <circle cx="48" cy="-374" r="8" fill="#f4a261" />
        <circle cx="46" cy="-376" r="1.8" fill={EYE} />
        <path d="M40 -374 L32 -372 L40 -370 Z" fill="#ffb703" />
        <path d="M33 -371 q-4 6 0 12 q4 4 0 8" stroke="#ff8fab" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

const RAVEN = "#343a40";

/** Raven on top of the signpost; it hops, flaps its wings, tilts its head and calls "Krah!". */
export function Rabe() {
  return (
    <g className="wd-rabe-body" style={{ transformOrigin: "0px -184px" }}>
      <path d="M-20 -202 L-44 -192 L-40 -186 L-18 -194 Z" fill={RAVEN} />
      <ellipse cx="0" cy="-204" rx="24" ry="16" fill={RAVEN} />
      <path className="wd-rabe-wing" d="M-14 -212 Q8 -222 18 -204 Q0 -196 -14 -212 Z" fill="#212529" style={{ transformOrigin: "-10px -210px" }} />
      <path d="M-4 -190 v8 M6 -190 v8" stroke="#ffb703" strokeWidth="3" strokeLinecap="round" />
      <g className="wd-rabe-head" style={{ transformOrigin: "14px -214px" }}>
        <circle cx="20" cy="-222" r="12" fill={RAVEN} />
        <circle cx="24" cy="-225" r="3" fill="#fff" />
        <circle cx="24.6" cy="-225" r="1.8" fill={EYE} />
        <path d="M30 -226 L46 -222 L30 -219 Z" fill="#495057" />
        <path className="wd-rabe-beak" d="M30 -220 L44 -219 L30 -215 Z" fill="#6c757d" style={{ transformOrigin: "30px -219px" }} />
        <Lid cx={24} cy={-225} r={3} fill={RAVEN} />
        <Lines x={52} y={-224} size={0.6} />
      </g>
    </g>
  );
}
