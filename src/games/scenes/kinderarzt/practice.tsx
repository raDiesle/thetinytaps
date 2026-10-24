import { Hideout } from "../hideout";
import { CHEEK, Eye, Face, INK, SKIN, STEEL, heartPath, nth, side, sparklePath } from "../shared";
import { Hearts, Lid, Lines, Plaster, Sparkles } from "./parts";

// The exam corner: the scale, the sink, the couch with the child, the doctor, the trolley with
// its instruments, the doctor's bag, the teddy and the bin. Each drawing has its foot point at
// (0, 0) and is placed with ground() (the couch's and the trolley's things with COUCH and TROLLEY).

/** The scale with its round dial; the platform sinks, the needle swings and the number shows. */
export function Waage() {
  return (
    <>
      <g className="ka-waage-platform" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-74 -4 L-62 -30 H62 L74 -4 Q74 4 64 4 H-64 Q-74 4 -74 -4 Z" fill="#ced4da" />
        <path d="M-60 -26 H60 L68 -8 H-68 Z" fill="#e9ecef" />
        <ellipse cx="-24" cy="-17" rx="10" ry="5" fill="#ffa8a8" />
        <ellipse cx="24" cy="-17" rx="10" ry="5" fill="#ffa8a8" />
      </g>
      <rect x="-10" y="-336" width="20" height="310" rx="6" fill="#dee2e6" />
      <path d="M-4 -330 V-34" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
      <circle cx="0" cy="-380" r="56" fill="#4dabf7" />
      <circle cx="0" cy="-380" r="46" fill="#fff" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (-120 + i * 30) * (Math.PI / 180);
        return (
          <path
            key={i}
            d={`M${38 * Math.sin(a)} ${-380 - 38 * Math.cos(a)} L${44 * Math.sin(a)} ${-380 - 44 * Math.cos(a)}`}
            stroke={INK}
            strokeWidth={i % 2 ? 2 : 3.5}
            strokeLinecap="round"
          />
        );
      })}
      <g className="ka-waage-needle" style={{ transformOrigin: "0px -380px" }}>
        <path d="M0 -380 L-4 -376 L0 -418 L4 -376 Z" fill="#e03131" stroke="#e03131" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <circle cx="0" cy="-380" r="6" fill={INK} />
      <rect x="-24" y="-362" width="48" height="18" rx="4" fill="#343a40" />
      <g className="ka-waage-digits">
        <text x="0" y="-348" textAnchor="middle" fontSize="15" fontWeight="700" fill="#8ce99a" fontFamily="sans-serif">
          12
        </text>
      </g>
      <path className="ka-waage-heart" d={heartPath(0, -456, 13)} fill="#ff6b8b" />
      <Lines x={64} y={-394} colour="#4dabf7" />
    </>
  );
}

/** The sink; the tap turns, water splashes, and the cupboard doors open on towels and a duck. */
export function Waschbecken() {
  return (
    <>
      <rect x="-100" y="-174" width="200" height="174" rx="8" fill="#e9ecef" />
      <rect x="-92" y="-166" width="184" height="158" fill="#adb5bd" />
      {/* Inside the cupboard */}
      <g className="ka-becken-stuff" style={nth(0)}>
        {[-60, -26].map((x, k) => (
          <g key={x}>
            <rect x={x - 26} y={-60 - k * 2} width="52" height="50" rx="10" fill={k ? "#74c0fc" : "#ffa8a8"} />
            <path d={`M${x - 26} ${-44 - k * 2} h52`} stroke="#fff" strokeWidth="4" opacity="0.6" />
          </g>
        ))}
      </g>
      <Hideout x={-92} y={-160} w={96} h={100} size={80} />
      <g className="ka-becken-duck" style={nth(1)}>
        <ellipse cx="46" cy="-28" rx="22" ry="16" fill="#ffd43b" />
        <circle cx="58" cy="-50" r="13" fill="#ffd43b" />
        <path d="M69 -50 l12 3 l-12 4 Z" fill="#fd7e14" />
        <Eye cx={61} cy={-53} r={2.6} />
      </g>
      {[
        { x: -96, hinge: -96, knob: -12 },
        { x: 2, hinge: 96, knob: 12 },
      ].map(({ x, hinge, knob }, i) => (
        <g key={x} className="ka-becken-door" style={{ ...nth(i), transformOrigin: `${hinge}px -86px` }}>
          <rect x={x} y="-168" width="94" height="162" rx="6" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
          <rect x={x + 10} y="-156" width="74" height="138" rx="5" fill="none" stroke="#e9ecef" strokeWidth="3" />
          <rect x={knob - 3} y="-104" width="6" height="22" rx="3" fill={STEEL} />
        </g>
      ))}
      {/* Basin */}
      <path d="M-112 -186 H112 V-172 Q112 -164 104 -164 H-104 Q-112 -164 -112 -172 Z" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
      <ellipse cx="0" cy="-186" rx="96" ry="10" fill="#e9ecef" />
      <ellipse cx="0" cy="-186" rx="80" ry="6" fill="#dee2e6" />
      {/* Tap */}
      <path d="M0 -190 V-250 Q0 -270 22 -270 Q42 -270 42 -250 V-238" stroke="#ced4da" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-4 -192 V-246" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <g className="ka-hahn-lever" style={{ transformOrigin: "0px -256px" }}>
        <rect x="-30" y="-262" width="34" height="10" rx="5" fill="#4dabf7" />
      </g>
      <rect className="ka-hahn-stream" x="37" y="-238" width="10" height="50" rx="5" fill="#74c0fc" />
      <g className="ka-hahn-splash" fill="#74c0fc">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${30 + i * 6} -196 q5 7 0 10 q-5 -3 0 -10 Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

/** The exam couch; the paper roll turns, the headrest lifts and the drawer slides out. */
export function Liege() {
  return (
    <>
      {/* Base cabinet with the drawer */}
      <rect x="-256" y="-160" width="512" height="146" rx="10" fill="#e9ecef" />
      <rect x="-256" y="-30" width="512" height="16" fill="#ced4da" />
      <rect x="-240" y="-14" width="30" height="14" rx="4" fill={STEEL} />
      <rect x="210" y="-14" width="30" height="14" rx="4" fill={STEEL} />
      <rect x="-220" y="-140" width="150" height="90" rx="8" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      <g className="ka-liege-drawer" style={{ transformOrigin: "-20px -96px" }}>
        <g className="ka-liege-inside">
          <rect x="-48" y="-150" width="160" height="22" rx="4" fill="#dee2e6" />
          <path d="M-36 -146 Q-10 -164 20 -146 Z" fill="#ffc9de" />
          <rect x="36" y="-152" width="60" height="18" rx="6" fill="#74c0fc" />
        </g>
        <rect x="-60" y="-140" width="184" height="90" rx="8" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
        <rect x="12" y="-104" width="40" height="10" rx="5" fill={STEEL} />
      </g>
      <rect x="138" y="-140" width="96" height="90" rx="8" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
      {/* Cushion with the paper sheet */}
      <rect x="-270" y="-202" width="540" height="48" rx="20" fill="#63e6be" />
      <path d="M-250 -196 H250" stroke="#96f2d7" strokeWidth="6" strokeLinecap="round" />
      <g className="ka-liege-paper" style={{ transformOrigin: "-200px -200px" }}>
        <rect x="-200" y="-206" width="400" height="14" rx="4" fill="#fff" />
        <path d="M-150 -199 h20 M-60 -199 h20 M30 -199 h20 M120 -199 h20" stroke="#e9ecef" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Headrest at the left end, with the paper roll */}
      <g className="ka-liege-head" style={{ transformOrigin: "-150px -196px" }}>
        <path d="M-150 -200 L-276 -250 Q-290 -256 -286 -240 L-280 -214 Q-276 -200 -260 -196 L-150 -176 Z" fill="#38d9a9" />
        <path d="M-170 -196 L-268 -236" stroke="#96f2d7" strokeWidth="5" strokeLinecap="round" />
        <g className="ka-liege-roll" style={{ transformOrigin: "-280px -258px" }}>
          <circle cx="-280" cy="-258" r="18" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
          <circle cx="-280" cy="-258" r="6" fill="#ced4da" />
          <path d="M-288 -264 L-272 -252" stroke="#e9ecef" strokeWidth="3" />
        </g>
      </g>
      <Sparkles x={-60} y={-250} count={3} spread={80} r={10} colour="#96f2d7" />
    </>
  );
}

/** The child on the couch; it swings its legs, cheers with both arms and giggles. */
export function Kind() {
  return (
    <>
      <g className="ka-kind-body" style={{ transformOrigin: "40px -200px" }}>
        {/* Legs over the edge of the couch */}
        {[-1, 1].map((s, i) => (
          <g key={s} className="ka-kind-leg" style={{ ...nth(i), transformOrigin: `${40 + s * 20}px -186px` }}>
            <rect x={40 + s * 20 - 13} y="-196" width="26" height="96" rx="12" fill="#4dabf7" />
            <rect x={40 + s * 20 - 12} y="-136" width="24" height="34" rx="10" fill={SKIN} />
            {s === 1 && <Plaster x={60} y={-128} w={22} angle={-10} />}
            <ellipse cx={40 + s * 22} cy="-98" rx="17" ry="11" fill="#ff6b6b" />
            <path d={`M${40 + s * 22 - 10} -102 h20`} stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
        <rect x="-4" y="-338" width="88" height="140" rx="30" fill="#ffd43b" />
        <path d={sparklePath(40, -270, 20)} fill="#fff" opacity="0.85" />
        <rect x="32" y="-352" width="16" height="18" fill={SKIN} />
        <g className="ka-kind-head" style={{ transformOrigin: "40px -344px" }}>
          <circle cx="40" cy="-386" r="44" fill={SKIN} />
          <path d="M-4 -388 Q-6 -434 40 -434 Q86 -434 84 -388 Q80 -414 58 -410 Q40 -424 22 -410 Q2 -414 -4 -388 Z" fill="#e8590c" />
          <Face cx={40} cy={-382} size={1.3} />
          <Lid cx={30.9} cy={-382} r={4.2} fill={SKIN} />
          <Lid cx={49.1} cy={-382} r={4.2} fill={SKIN} />
          <ellipse className="ka-kind-mouth" cx="40" cy="-366" rx="8" ry="8" fill="#c92a2a" />
        </g>
        {[
          { s: 1 as const, x: 0, d: "M0 -320 Q-28 -270 -14 -218", hand: [-14, -214] },
          { s: -1 as const, x: 80, d: "M80 -320 Q108 -270 94 -218", hand: [94, -214] },
        ].map(({ s, x, d, hand }, i) => (
          <g key={x} className="ka-kind-arm" style={{ ...side(s), ...nth(i), transformOrigin: `${x}px -320px` }}>
            <path d={d} stroke="#ffd43b" strokeWidth="20" strokeLinecap="round" fill="none" />
            <circle cx={hand[0]} cy={hand[1]} r="12" fill={SKIN} />
          </g>
        ))}
      </g>
      <Hearts x={40} y={-460} count={3} spread={44} />
    </>
  );
}

/** The doctor; she waves, nods, blinks behind her glasses and her clipboard tilts. */
export function Aerztin() {
  return (
    <>
      <g className="ka-aerztin-body" style={{ transformOrigin: "0px 0px" }}>
        {/* Legs and shoes */}
        <rect x="-34" y="-150" width="26" height="140" rx="12" fill="#364fc7" />
        <rect x="8" y="-150" width="26" height="140" rx="12" fill="#364fc7" />
        <ellipse cx="-26" cy="-10" rx="22" ry="11" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        <ellipse cx="26" cy="-10" rx="22" ry="11" fill="#fff" stroke="#dee2e6" strokeWidth="2" />
        {/* White coat over a teal shirt */}
        <path d="M-60 -420 Q-74 -260 -76 -126 H76 Q74 -260 60 -420 Z" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
        <path d="M-26 -424 H26 L18 -250 H-18 Z" fill="#3bc9db" />
        <path d="M-26 -424 L-4 -340 L-40 -330 Z M26 -424 L4 -340 L40 -330 Z" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="2" strokeLinejoin="round" />
        <path d="M0 -250 V-130" stroke="#dee2e6" strokeWidth="3" />
        <rect x="30" y="-300" width="30" height="34" rx="4" fill="#f1f3f5" stroke="#dee2e6" strokeWidth="2" />
        <path d="M38 -300 V-318 M48 -300 V-314" stroke="#4dabf7" strokeWidth="4" strokeLinecap="round" />
        <rect x="-56" y="-330" width="34" height="20" rx="4" fill="#ffd43b" />
        <path d={heartPath(-39, -321, 6)} fill="#ff6b6b" />
        <rect x="-10" y="-440" width="20" height="22" fill={SKIN} />
        <g className="ka-aerztin-head" style={{ transformOrigin: "0px -436px" }}>
          <circle cx="0" cy="-484" r="44" fill={SKIN} />
          <circle cx="0" cy="-540" r="20" fill="#5c3d2e" />
          <path d="M-44 -480 Q-46 -530 0 -530 Q46 -530 44 -480 Q34 -506 0 -504 Q-34 -506 -44 -480 Z" fill="#5c3d2e" />
          <Face cx={0} cy={-478} size={1.3} />
          <Lid cx={-9.1} cy={-478} r={4.2} fill={SKIN} />
          <Lid cx={9.1} cy={-478} r={4.2} fill={SKIN} />
          <circle cx="-12" cy="-478" r="12" fill="#fff" fillOpacity="0.25" stroke="#7950f2" strokeWidth="3" />
          <circle cx="12" cy="-478" r="12" fill="#fff" fillOpacity="0.25" stroke="#7950f2" strokeWidth="3" />
          <path d="M0 -478 H0" stroke="#7950f2" strokeWidth="3" />
          <path d="M-24 -480 H-40 M24 -480 H40" stroke="#7950f2" strokeWidth="3" />
        </g>
        {/* Arm with the clipboard */}
        <path d="M-58 -404 Q-92 -330 -58 -282" stroke="#fff" strokeWidth="26" strokeLinecap="round" fill="none" />
        <g className="ka-aerztin-board" style={{ transformOrigin: "-40px -280px" }}>
          <rect x="-74" y="-340" width="60" height="80" rx="6" fill="#c88b3a" />
          <rect x="-68" y="-330" width="48" height="64" rx="3" fill="#fff" />
          <rect x="-56" y="-346" width="24" height="12" rx="3" fill={STEEL} />
          <circle cx="-44" cy="-306" r="10" fill="#ffd43b" />
          <path d="M-62 -282 H-26" stroke="#74c0fc" strokeWidth="4" strokeLinecap="round" />
        </g>
        <circle cx="-48" cy="-282" r="12" fill={SKIN} />
        {/* Waving arm */}
        <g className="ka-aerztin-arm" style={{ transformOrigin: "56px -406px" }}>
          <path d="M56 -406 Q84 -340 70 -276" stroke="#fff" strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M56 -406 Q84 -340 70 -276" stroke="#dee2e6" strokeWidth="2" fill="none" opacity="0.6" />
          <circle cx="70" cy="-270" r="13" fill={SKIN} />
        </g>
      </g>
      <Hearts x={0} y={-590} count={3} spread={50} />
    </>
  );
}

/** The instrument trolley; its drawers slide out one after another and the castors turn. */
export function Rollwagen() {
  const drawers = [
    { y: -262, inside: "cotton" },
    { y: -198, inside: "plasters" },
    { y: -134, inside: "sticks" },
  ];
  return (
    <>
      <g className="ka-roll-body" style={{ transformOrigin: "0px -20px" }}>
        <path d="M-122 -290 V-34 M122 -290 V-34" stroke="#ced4da" strokeWidth="10" strokeLinecap="round" />
        <rect x="-112" y="-270" width="224" height="210" rx="8" fill="#74c0fc" />
        <rect x="-122" y="-62" width="244" height="14" rx="5" fill="#ced4da" />
        {[...drawers].reverse().map(({ y, inside }) => {
          const i = drawers.findIndex((d) => d.y === y);
          return (
            <g key={y} className="ka-roll-drawer" style={{ ...nth(i), transformOrigin: `0px ${y + 58}px` }}>
              <g className="ka-roll-inside">
                <rect x="-96" y={y - 20} width="192" height="22" rx="3" fill="#e7f5ff" />
                {inside === "cotton" &&
                  [-60, -30, 0, 30, 60].map((x) => <circle key={x} cx={x} cy={y - 10} r="10" fill="#fff" stroke="#dee2e6" strokeWidth="2" />)}
                {inside === "plasters" &&
                  [-54, 0, 54].map((x, k) => <Plaster key={x} x={x} y={y - 10} w={42} angle={(k - 1) * 12} colour={["#ffa8a8", "#ffe066", "#8ce99a"][k]} />)}
                {inside === "sticks" && (
                  <path d={`M-70 ${y - 10} h50 M-10 ${y - 12} h50 M50 ${y - 8} h30`} stroke="#e9b872" strokeWidth="8" strokeLinecap="round" />
                )}
              </g>
              <rect x="-104" y={y} width="208" height="58" rx="7" fill="#e7f5ff" stroke="#a5d8ff" strokeWidth="3" />
              <rect x="-24" y={y + 22} width="48" height="12" rx="6" fill="#4dabf7" />
            </g>
          );
        })}
        {/* Top tray */}
        <rect x="-134" y="-298" width="268" height="24" rx="8" fill="#fff" stroke="#dee2e6" strokeWidth="3" />
        <path d="M-120 -290 H120" stroke="#f1f3f5" strokeWidth="4" />
      </g>
      {[-112, 112].map((x, i) => (
        <g key={x}>
          <rect x={x - 6} y="-48" width="12" height="14" fill={STEEL} />
          <g className="ka-roll-castor" style={{ ...nth(i), transformOrigin: `${x}px -18px` }}>
            <circle cx={x} cy="-18" r="18" fill="#495057" />
            <circle cx={x} cy="-18" r="7" fill="#ced4da" />
            <path d={`M${x} -32 V-4`} stroke="#868e96" strokeWidth="3" />
          </g>
        </g>
      ))}
    </>
  );
}

/** The stethoscope on the trolley; the chest piece hops and a big heart beats: bumbum! */
export function Stethoskop() {
  return (
    <>
      <g className="ka-stetho-tube" style={{ transformOrigin: "-90px -300px" }}>
        <path d="M-124 -362 Q-128 -330 -108 -322 M-100 -364 Q-96 -332 -108 -322" stroke="#495057" strokeWidth="5" fill="none" strokeLinecap="round" />
        <circle cx="-124" cy="-364" r="5" fill="#868e96" />
        <circle cx="-100" cy="-366" r="5" fill="#868e96" />
        <path d="M-108 -322 Q-112 -302 -86 -302 Q-62 -302 -64 -318" stroke="#4dabf7" strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      <g className="ka-stetho-piece" style={{ transformOrigin: "-58px -310px" }}>
        <circle cx="-58" cy="-322" r="18" fill="#ced4da" stroke="#868e96" strokeWidth="3" />
        <circle cx="-58" cy="-322" r="10" fill="#f1f3f5" />
        <circle cx="-62" cy="-326" r="3" fill="#fff" />
      </g>
      <g className="ka-stetho-heart" style={{ transformOrigin: "-80px -416px" }}>
        <path d={heartPath(-80, -416, 26)} fill="#ff6b8b" />
        <path d="M-96 -424 Q-92 -434 -84 -432" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>
      <Lines x={-30} y={-416} colour="#ff6b8b" />
      <Lines x={-130} y={-416} dir={-1} colour="#ff6b8b" />
    </>
  );
}

/** The otoscope, the little lamp for looking into ears; it lifts, tilts and its light goes on. */
export function Ohrenlampe() {
  return (
    <>
      <rect x="-18" y="-322" width="36" height="26" rx="6" fill="#ced4da" />
      <g className="ka-ohr-lamp" style={{ transformOrigin: "0px -330px" }}>
        <rect x="-10" y="-384" width="20" height="62" rx="7" fill="#364fc7" />
        <path d="M-10 -370 H10 M-10 -358 H10 M-10 -346 H10" stroke="#4c6ef5" strokeWidth="3" />
        <rect x="-15" y="-404" width="30" height="22" rx="6" fill="#343a40" />
        <path d="M6 -402 L34 -420 L38 -412 L14 -390 Z" fill="#f1f3f5" stroke="#adb5bd" strokeWidth="2" strokeLinejoin="round" />
        <g className="ka-ohr-light">
          <path d="M36 -416 L80 -444 L86 -400 Z" fill="#fff3bf" opacity="0.8" />
          <circle cx="38" cy="-416" r="9" fill="#ffe066" />
        </g>
        <rect x="-6" y="-396" width="12" height="8" rx="2" fill="#ffe066" opacity="0.7" />
      </g>
      <Sparkles x={76} y={-440} count={3} spread={20} r={7} colour="#ffd43b" />
    </>
  );
}

/** The plaster box on the trolley; the lid flips open and colourful plasters fly out. */
export function Pflasterbox() {
  return (
    <>
      <g className="ka-pflaster-box" style={{ transformOrigin: "86px -296px" }}>
        <rect x="50" y="-344" width="72" height="48" rx="6" fill="#ff8787" />
        <rect x="58" y="-334" width="56" height="28" rx="4" fill="#fff" opacity="0.9" />
        <Plaster x={86} y={-320} w={40} angle={-12} />
      </g>
      <g className="ka-pflaster-fly">
        {[
          { c: "#ffe066", a: -20 },
          { c: "#8ce99a", a: 10 },
          { c: "#a5d8ff", a: 30 },
        ].map(({ c, a }, i) => (
          <g key={c} style={nth(i)}>
            <Plaster x={86} y={-352} w={44} angle={a} colour={c} />
          </g>
        ))}
      </g>
      <g className="ka-pflaster-lid" style={{ transformOrigin: "48px -348px" }}>
        <rect x="46" y="-354" width="80" height="14" rx="5" fill="#fa5252" />
        <path d={heartPath(86, -347, 5)} fill="#fff" />
      </g>
    </>
  );
}

/** The pedal bin; the pedal is pressed, the lid flips up and a paper ball lands inside. */
export function Muelleimer() {
  return (
    <>
      <path d="M-50 -150 H50 L42 -8 Q42 0 34 0 H-34 Q-42 0 -42 -8 Z" fill="#69db7c" />
      <path d="M-34 -136 L-28 -16" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.35" />
      <path d="M-46 -100 H46" stroke="#51cf66" strokeWidth="4" />
      <g className="ka-eimer-pedal" style={{ transformOrigin: "0px -4px" }}>
        <rect x="-24" y="-16" width="48" height="12" rx="5" fill={STEEL} />
      </g>
      <g className="ka-eimer-ball">
        <circle cx="-70" cy="-230" r="14" fill="#f8f9fa" stroke="#ced4da" strokeWidth="2" />
        <path d="M-78 -236 l8 4 l6 -6 M-74 -222 l6 -4" stroke="#ced4da" strokeWidth="2" fill="none" />
      </g>
      <g className="ka-eimer-lid" style={{ transformOrigin: "-54px -156px" }}>
        <rect x="-56" y="-164" width="112" height="16" rx="8" fill="#40c057" />
        <rect x="-12" y="-172" width="24" height="10" rx="4" fill="#2f9e44" />
      </g>
    </>
  );
}

/** The doctor's bag; the handle lifts, the bag opens wide and a toy hammer and a plaster pop out. */
export function Arzttasche() {
  return (
    <>
      {/* What pops out */}
      <g className="ka-tasche-hammer">
        <path d="M-20 -110 L-34 -190" stroke="#868e96" strokeWidth="6" strokeLinecap="round" />
        <path d="M-52 -186 Q-56 -206 -36 -208 L-14 -200 Q-6 -186 -20 -180 Z" fill="#ff6b6b" />
      </g>
      <g className="ka-tasche-plaster">
        <Plaster x={30} y={-160} w={50} angle={20} colour="#8ce99a" />
      </g>
      <path d="M-110 -110 L-100 -10 Q-98 0 -86 0 H86 Q98 0 100 -10 L110 -110 Z" fill="#c92a2a" />
      <path d="M-96 -96 L-88 -18" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
      <path d="M-110 -54 H110" stroke="#a61e4d" strokeWidth="5" opacity="0.5" />
      <path d={heartPath(0, -58, 22)} fill="#fff" />
      {/* The two halves of the frame */}
      <g className="ka-tasche-jaw" style={{ ...side(1), transformOrigin: "-112px -112px" }}>
        <path d="M-114 -112 Q-112 -138 -86 -140 H0 V-110 H-114 Z" fill="#e03131" />
        <rect x="-20" y="-142" width="20" height="12" rx="3" fill="#ffd43b" />
      </g>
      <g className="ka-tasche-jaw" style={{ ...side(-1), transformOrigin: "112px -112px" }}>
        <path d="M114 -112 Q112 -138 86 -140 H0 V-110 H114 Z" fill="#e03131" />
        <rect x="0" y="-142" width="20" height="12" rx="3" fill="#ffd43b" />
      </g>
      <g className="ka-tasche-handle" style={{ transformOrigin: "0px -140px" }}>
        <path d="M-40 -140 Q-40 -186 0 -186 Q40 -186 40 -140" stroke="#862e2e" strokeWidth="12" strokeLinecap="round" fill="none" />
      </g>
      <Sparkles x={0} y={-210} count={3} spread={60} r={10} />
    </>
  );
}

/** The teddy with a bandage round its head and arm; it waves, tilts its head and hearts rise. */
export function Teddy() {
  const fur = "#c08552";
  const muzzle = "#e6b88a";
  return (
    <>
      <g className="ka-teddy-body" style={{ transformOrigin: "0px 0px" }}>
        <ellipse cx="-38" cy="-16" rx="24" ry="17" fill={fur} />
        <ellipse cx="38" cy="-16" rx="24" ry="17" fill={fur} />
        <ellipse cx="-42" cy="-14" rx="12" ry="9" fill={muzzle} />
        <ellipse cx="42" cy="-14" rx="12" ry="9" fill={muzzle} />
        <ellipse cx="0" cy="-66" rx="50" ry="56" fill={fur} />
        <ellipse cx="0" cy="-58" rx="30" ry="34" fill={muzzle} />
        <Plaster x={10} y={-60} w={36} angle={-20} />
        <path d="M-44 -94 Q-68 -72 -54 -50" stroke={fur} strokeWidth="22" strokeLinecap="round" fill="none" />
        {/* The bandaged arm waves */}
        <g className="ka-teddy-arm" style={{ transformOrigin: "40px -96px" }}>
          <path d="M40 -96 Q66 -80 60 -54" stroke={fur} strokeWidth="22" strokeLinecap="round" fill="none" />
          <path d="M50 -88 Q62 -80 62 -62" stroke="#fff" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M52 -80 l10 4 M56 -70 l10 2" stroke="#dee2e6" strokeWidth="2" />
        </g>
        <g className="ka-teddy-head" style={{ transformOrigin: "0px -110px" }}>
          {[
            { cx: -34, origin: "-30px -176px" },
            { cx: 34, origin: "30px -176px" },
          ].map(({ cx, origin }, i) => (
            <g key={cx} className="ka-teddy-ear" style={{ ...nth(i), transformOrigin: origin }}>
              <circle cx={cx} cy="-184" r="17" fill={fur} />
              <circle cx={cx} cy="-184" r="9" fill={muzzle} />
            </g>
          ))}
          <circle cx="0" cy="-150" r="44" fill={fur} />
          {/* Bandage round the head with a little bow */}
          <path d="M-43 -166 Q0 -184 43 -166 L42 -150 Q0 -168 -42 -150 Z" fill="#fff" />
          <path d="M-30 -168 l4 14 M-10 -174 l2 15 M12 -174 l-1 15 M32 -168 l-4 14" stroke="#e9ecef" strokeWidth="2" />
          <path d="M38 -164 l16 -10 l-2 18 Z M38 -160 l18 6 l-14 10 Z" fill="#fff" stroke="#e9ecef" strokeWidth="1.5" />
          <ellipse cx="0" cy="-134" rx="19" ry="14" fill={muzzle} />
          <ellipse cx="0" cy="-140" rx="7" ry="5" fill={INK} />
          <path d="M-7 -130 Q0 -123 7 -130" stroke={INK} strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <Eye cx={-15} cy={-148} r={4.6} />
          <Eye cx={15} cy={-148} r={4.6} />
          <Lid cx={-15} cy={-148} r={4.6} fill={fur} />
          <Lid cx={15} cy={-148} r={4.6} fill={fur} />
          <circle cx="-26" cy="-132" r="6" fill={CHEEK} opacity="0.5" />
          <circle cx="26" cy="-132" r="6" fill={CHEEK} opacity="0.5" />
        </g>
      </g>
      <Hearts x={0} y={-230} count={3} spread={40} />
    </>
  );
}
