import { Hideout } from "../hideout";
import { INK, STEEL, nth } from "../shared";
import { CUPBOARD, CUPBOARD_DARK } from "./background";
import { Bubbles, Lines, Steam } from "./parts";

// The counter's fronts and what is built into it, drawn in picture coordinates: the dishwasher,
// the sink with its tap and the washing-up liquid, the oven with its knobs, and the drawers.

/** The dishwasher; its lights blink, the door folds down, steam rises and the plates shine. */
export function Geschirrspueler() {
  return (
    <>
      {/* Inside: the rack with plates and cups */}
      <rect x="186" y="298" width="150" height="110" fill="#495057" />
      <path d="M192 352 H330 M192 400 H330" stroke="#adb5bd" strokeWidth="3" />
      {[204, 226, 248, 270, 292, 314].map((x, i) => (
        <ellipse key={x} cx={x} cy="332" rx="8" ry="20" fill={i % 2 ? "#fff" : "#a5d8ff"} stroke="#dee2e6" strokeWidth="2" />
      ))}
      {[206, 246, 286].map((x, i) => (
        <path key={x} d={`M${x} 396 V376 Q${x} 370 ${x + 6} 370 H${x + 24} Q${x + 30} 370 ${x + 30} 376 V396 Z`} fill={["#ffd43b", "#ff8787", "#69db7c"][i]} />
      ))}
      <g className="kc-spueler-sparkle" fill="#fff">
        {[
          [214, 312],
          [290, 318],
          [262, 382],
        ].map(([x, y], i) => (
          <path
            key={i}
            style={nth(i)}
            d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3} Z`}
          />
        ))}
      </g>
      {/* Control strip */}
      <rect x="184" y="274" width="154" height="22" rx="4" fill="#ced4da" />
      {[200, 216, 232].map((x, i) => (
        <circle key={x} className="kc-spueler-light" cx={x} cy="285" r="4.5" fill="#69db7c" style={nth(i)} />
      ))}
      <rect x="290" y="279" width="38" height="12" rx="3" fill="#343a40" />
      <g className="kc-spueler-door" style={{ transformOrigin: "261px 410px" }}>
        <rect x="184" y="298" width="154" height="112" rx="4" fill="#e9ecef" stroke="#ced4da" strokeWidth="3" />
        <rect x="216" y="306" width="90" height="10" rx="5" fill={STEEL} />
        <path d="M196 326 V396" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
      </g>
      <Steam x={261} y={286} count={3} spread={34} r={13} />
    </>
  );
}

/** The sink in the worktop with the cupboard below; water fills up, foam bubbles and the doors open. */
export function Spuele() {
  return (
    <>
      {/* Basin */}
      <path d="M384 204 H538 Q546 204 546 212 V242 Q546 252 536 252 H386 Q376 252 376 242 V212 Q376 204 384 204 Z" fill="#ced4da" />
      <path d="M392 210 H530 Q536 210 536 216 V240 Q536 246 530 246 H392 Q386 246 386 240 V216 Q386 210 392 210 Z" fill="#868e96" />
      <g className="kc-spuele-water" style={{ transformOrigin: "461px 246px" }}>
        <path d="M392 216 H530 Q536 216 536 222 V240 Q536 246 530 246 H392 Q386 246 386 240 V222 Q386 216 392 216 Z" fill="#74c0fc" />
        <path d="M400 222 H470" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      </g>
      <g className="kc-spuele-foam" fill="#fff">
        {[404, 430, 462, 494, 520].map((x, i) => (
          <circle key={x} cx={x} cy={216 - (i % 2) * 4} r={10 + (i % 3) * 3} style={nth(i)} />
        ))}
      </g>
      <Bubbles x={460} y={196} count={4} spread={30} r={9} />
      {/* Cupboard below: bucket and brush inside */}
      <rect x="352" y="276" width="216" height="130" fill="#6f9b7d" />
      <path d="M396 400 L402 350 H446 L452 400 Z" fill="#4dabf7" />
      <path d="M398 352 Q424 330 450 352" stroke="#1c7ed6" strokeWidth="4" fill="none" />
      <rect x="490" y="370" width="50" height="16" rx="6" fill="#ffd43b" />
      <path d="M494 386 v10 M504 386 v10 M514 386 v10 M524 386 v10 M534 386 v10" stroke="#e67700" strokeWidth="3" />
      <Hideout x={400} y={290} w={120} h={110} size={72} />
      {[
        { x: 352, hinge: "left" as const },
        { x: 462, hinge: "right" as const },
      ].map(({ x, hinge }, i) => (
        <g key={x} className="kc-spuele-door" style={{ ...nth(i), transformOrigin: `${hinge === "left" ? x : x + 106}px 340px` }}>
          <rect x={x} y="276" width="106" height="130" rx="6" fill={CUPBOARD} stroke={CUPBOARD_DARK} strokeWidth="3" />
          <rect x={x + 10} y="286" width="86" height="110" rx="5" fill="none" stroke="#fff" strokeWidth="3" opacity="0.5" />
          <circle cx={hinge === "left" ? x + 88 : x + 18} cy="300" r="6" fill="#ffd166" stroke="#e9a23b" strokeWidth="2" />
        </g>
      ))}
    </>
  );
}

/** The tap over the sink; the lever goes up, water runs, drops splash and the lever goes down again. */
export function Wasserhahn() {
  return (
    <>
      <path className="kc-hahn-stream" d="M480 168 V236" stroke="#74c0fc" strokeWidth="7" strokeLinecap="round" />
      <g className="kc-hahn-drops" fill="#74c0fc">
        {[-16, 0, 16].map((dx, i) => (
          <path key={dx} style={nth(i)} d={`M${480 + dx} 226 q5 7 0 10 q-5 -3 0 -10 Z`} />
        ))}
      </g>
      <ellipse className="kc-hahn-ripple" cx="480" cy="238" rx="24" ry="5" fill="none" stroke="#fff" strokeWidth="3" />
      <rect x="430" y="198" width="28" height="10" rx="4" fill="#adb5bd" />
      <path d="M444 202 V146 Q444 124 464 124 Q484 124 484 146 V160" stroke="#ced4da" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M440 196 V148" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <rect x="474" y="158" width="20" height="10" rx="3" fill={STEEL} />
      <g className="kc-hahn-lever" style={{ transformOrigin: "444px 178px" }}>
        <path d="M444 178 L420 168" stroke="#adb5bd" strokeWidth="8" strokeLinecap="round" />
        <circle cx="444" cy="178" r="7" fill="#ced4da" />
      </g>
    </>
  );
}

/** The yellow washing-up liquid; it is squeezed and bubbles fly out. */
export function Spuelmittel() {
  return (
    <>
      <g className="kc-spuelmittel-bottle" style={{ transformOrigin: "560px 248px" }}>
        <rect x="554" y="184" width="12" height="12" rx="3" fill="#ff6b6b" />
        <path d="M544 248 V204 Q544 194 554 194 H566 Q576 194 576 204 V248 Z" fill="#ffd43b" />
        <rect x="548" y="214" width="24" height="20" rx="4" fill="#fff" />
        <path d="M560 218 q4 6 0 9 q-4 -3 0 -9 Z" fill="#4dabf7" />
        <path d="M549 200 V242" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </g>
      <Bubbles x={560} y={170} count={3} spread={16} r={8} />
    </>
  );
}

/** The oven under the hob; the knobs turn, the light goes on, the cake rises and the door opens. */
export function Backofen() {
  return (
    <>
      {/* Control panel */}
      <rect x="784" y="274" width="256" height="24" rx="4" fill="#dee2e6" />
      {[812, 846, 978, 1012].map((x, i) => (
        <g key={x} className="kc-ofen-knob" style={{ ...nth(i), transformOrigin: `${x}px 286px` }}>
          <circle cx={x} cy="286" r="9" fill="#fff" stroke="#adb5bd" strokeWidth="2" />
          <path d={`M${x} 286 V278`} stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}
      <rect x="884" y="278" width="56" height="16" rx="3" fill="#343a40" />
      <text className="kc-ofen-display" x="912" y="291" fontSize="13" fontWeight="700" fontFamily="sans-serif" textAnchor="middle" fill="#69db7c">
        180°
      </text>
      {/* Inside: the cake on its tray */}
      <rect x="790" y="302" width="244" height="104" fill="#5c3d2e" />
      <rect className="kc-ofen-glow" x="790" y="302" width="244" height="104" fill="#ffa94d" />
      <rect x="820" y="378" width="184" height="6" rx="2" fill="#adb5bd" />
      <g className="kc-ofen-cake" style={{ transformOrigin: "912px 378px" }}>
        <path d="M868 378 V352 Q868 336 912 334 Q956 336 956 352 V378 Z" fill="#e9b872" />
        <path d="M868 352 Q890 344 912 350 Q934 344 956 352" stroke="#c88b3a" strokeWidth="3" fill="none" />
        <circle cx="900" cy="344" r="3" fill="#ff6b6b" />
        <circle cx="922" cy="342" r="3" fill="#ff6b6b" />
      </g>
      <g className="kc-ofen-door" style={{ transformOrigin: "912px 408px" }}>
        <path d="M790 302 H1034 V408 H790 Z M818 322 V386 H1006 V322 Z" fill="#f1f3f5" fillRule="evenodd" stroke="#ced4da" strokeWidth="3" />
        <rect x="818" y="322" width="188" height="64" rx="4" fill="#212529" fillOpacity="0.35" />
        <path d="M830 380 L862 328 M852 380 L884 328" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.3" />
        <rect x="808" y="306" width="208" height="10" rx="5" fill={STEEL} />
      </g>
      <Steam x={912} y={290} count={3} spread={40} r={13} />
      <Lines x={1046} y={318} colour="#ffa94d" />
    </>
  );
}

/** Three drawers next to the oven; they slide out one after another and the spoons rattle. */
export function Schubladen() {
  const drawers = [276, 320, 364];
  return (
    <>
      <rect x="1062" y="274" width="178" height="136" fill="#6f9b7d" />
      {drawers.map((y, i) => (
        <g key={y} className="kc-schublade" style={{ ...nth(i), transformOrigin: `1151px ${y + 40}px` }}>
          {/* What is inside, seen once the drawer is out */}
          <g className="kc-schublade-inside">
            <rect x="1072" y={y - 14} width="158" height="16" rx="3" fill="#e9d8b4" />
            {i === 0 && <path d={`M1086 ${y - 6} h40 M1094 ${y - 10} h44 M1150 ${y - 6} h50`} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />}
            {i === 1 &&
              [1090, 1124, 1158, 1192].map((x, k) => <circle key={x} cx={x} cy={y - 6} r="6" fill={["#ff8787", "#ffd43b", "#74c0fc", "#69db7c"][k]} />)}
            {i === 2 && <path d={`M1090 ${y - 6} h120`} stroke="#c88b3a" strokeWidth="7" strokeLinecap="round" />}
          </g>
          <rect x="1064" y={y} width="174" height="40" rx="5" fill={CUPBOARD} stroke={CUPBOARD_DARK} strokeWidth="3" />
          <rect x="1126" y={y + 15} width="50" height="9" rx="4" fill="#ffd166" stroke="#e9a23b" strokeWidth="2" />
        </g>
      ))}
    </>
  );
}
