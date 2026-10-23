import { Hideout } from "../hideout";
import { INK, Inside, SKIN } from "../shared";
import { Arm, Head, Hearts, Leg, Lid, Notes, Puffs } from "./parts";

// The playground equipment: climbing tower and slide, swing, seesaw, roundabout and spring
// horse. Each drawing has its foot point at (0, 0); children play on all of them.

const WOOD = "#c98b4f";
const WOOD_DARK = "#a86b35";
const WOOD_LIGHT = "#e0a96d";

/** Ship's wheel with eight handles around (cx, cy). */
function ShipWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g className="sp-turm-wheel" style={{ transformOrigin: `${cx}px ${cy}px` }}>
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx} y2={cy - r * 1.3} stroke={WOOD_DARK} strokeWidth="5" strokeLinecap="round" transform={`rotate(${i * 45} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e63946" strokeWidth="7" />
      <circle cx={cx} cy={cy} r={6} fill="#ffd60a" />
    </g>
  );
}

/**
 * The climbing tower: a wooden platform on posts with a red roof, a ladder, a porthole and a
 * ship's wheel. The flag waves, the wheel turns, someone peeks out of the porthole and the
 * ladder wobbles.
 */
export function Kletterturm() {
  const porthole = "M-56 -206 a28 28 0 1 0 56 0 a28 28 0 1 0 -56 0 Z";
  return (
    <>
      {/* Back posts, a little lighter */}
      <rect x="-76" y="-312" width="14" height="300" rx="4" fill={WOOD_LIGHT} />
      <rect x="96" y="-312" width="14" height="300" rx="4" fill={WOOD_LIGHT} />
      <path d="M-70 -20 L104 -150 M104 -20 L-70 -150" stroke={WOOD_LIGHT} strokeWidth="6" opacity="0.8" />
      {/* Front posts */}
      <rect x="-100" y="-306" width="18" height="306" rx="5" fill={WOOD} />
      <rect x="82" y="-306" width="18" height="306" rx="5" fill={WOOD} />
      <rect x="-100" y="-306" width="6" height="306" rx="3" fill={WOOD_LIGHT} opacity="0.7" />
      <rect x="82" y="-306" width="6" height="306" rx="3" fill={WOOD_LIGHT} opacity="0.7" />
      {/* Platform */}
      <path d="M-108 -176 L-84 -192 H120 L100 -176 Z" fill={WOOD_LIGHT} />
      <rect x="-108" y="-178" width="216" height="16" rx="4" fill={WOOD_DARK} />
      {/* Railing panel with the porthole and the ship's wheel */}
      <rect x="-100" y="-252" width="200" height="74" rx="6" fill="#4dabf7" />
      <rect x="-100" y="-252" width="200" height="12" rx="6" fill="#74c0fc" />
      <rect x="-100" y="-190" width="200" height="12" fill="#339af0" />
      <path d={porthole} fill="#d0ebff" />
      {/* Who peeks out of the porthole? Someone else every time. */}
      <Inside d={porthole}>
        <Hideout x={-56} y={-234} w={56} h={56} size={46} />
      </Inside>
      <path d={porthole} fill="none" stroke="#ffd60a" strokeWidth="7" />
      <path d="M-46 -218 q8 -10 18 -10" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
      <ShipWheel cx={48} cy={-214} r={20} />
      {/* Roof with a flag on top */}
      <g className="sp-turm-flag" style={{ transformOrigin: "0px -392px" }}>
        <path d="M0 -392 Q24 -400 50 -388 Q36 -378 50 -366 Q24 -376 0 -370 Z" fill="#ffd60a" />
      </g>
      <path d="M0 -360 V-396" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M-128 -298 L0 -370 L128 -298 Z" fill="#e63946" />
      <path d="M0 -370 L128 -298 H70 Z" fill="#c92a3a" />
      <path d="M-128 -298 H128" stroke="#a61e2c" strokeWidth="8" strokeLinecap="round" />
      <path d="M-88 -318 L-20 -356" stroke="#ff8787" strokeWidth="6" strokeLinecap="round" />
      {/* Ladder on the left */}
      <g className="sp-turm-ladder" style={{ transformOrigin: "-120px 0px" }}>
        <path d="M-178 0 L-120 -186 M-138 0 L-84 -186" stroke={WOOD_DARK} strokeWidth="8" strokeLinecap="round" />
        {[0, 1, 2, 3, 4].map((i) => {
          const y = -24 - i * 34;
          const t = -y / 186;
          return <path key={i} d={`M${-178 + 58 * t} ${y} H${-138 + 54 * t}`} stroke={WOOD} strokeWidth="7" strokeLinecap="round" />;
        })}
      </g>
      <Notes x={-150} y={-280} texts={["Ahoi!"]} colour="#ffd60a" />
    </>
  );
}

const SLIDE_TOP = "M98 -186 Q200 -170 248 -88 Q282 -26 352 -24 L352 -4 Q270 -4 232 -70 Q190 -146 98 -160 Z";

/** The slide on the tower: a child whooshes down, sand puffs up at the bottom, then it climbs up again. */
export function Rutsche() {
  return (
    <>
      <path d="M330 -10 V0 M300 -16 V0" stroke="#868e96" strokeWidth="7" strokeLinecap="round" />
      <path d={SLIDE_TOP} fill="#ffd43b" />
      <path d="M98 -186 Q200 -170 248 -88 Q282 -26 352 -24" stroke="#f59f00" strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M108 -174 Q196 -158 238 -84 Q272 -22 340 -14" stroke="#fff3bf" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M98 -160 Q190 -146 232 -70 Q270 -4 352 -4" stroke="#e67700" strokeWidth="7" strokeLinecap="round" fill="none" />
      <g className="sp-rutsche-kid">
        <g className="sp-rutsche-tilt" style={{ transformOrigin: "120px -184px" }}>
          <Leg x1={120} y1={-190} x2={152} y2={-182} trousers="#5c7cfa" shoe="#fab005" />
          <Leg x1={116} y1={-188} x2={148} y2={-176} trousers="#5c7cfa" shoe="#fab005" />
          <rect x="100" y="-232" width="30" height="46" rx="12" fill="#e64980" />
          <g className="sp-rutsche-arms" style={{ transformOrigin: "118px -224px" }}>
            <Arm x1={110} y1={-224} x2={96} y2={-256} sleeve="#e64980" w={9} />
            <Arm x1={124} y1={-224} x2={140} y2={-256} sleeve="#e64980" w={9} />
          </g>
          <Head cx={116} cy={-250} r={18} hair="#e9c46a" style="pigtails" />
        </g>
      </g>
      <Puffs className="sp-rutsche-sand" spots={[[350, -12], [372, -24], [330, -28], [386, -8]]} r={11} fill="#f3d8a2" />
      <Notes x={250} y={-180} texts={["Hui!"]} colour="#ffd43b" />
    </>
  );
}

/** A swing seat on two chains hanging from (x, top) down to the seat at seatY. */
function Seat({ x, top, seatY, colour }: { x: number; top: number; seatY: number; colour: string }) {
  return (
    <>
      <path d={`M${x - 28} ${top} L${x - 30} ${seatY} M${x + 28} ${top} L${x + 30} ${seatY}`} stroke="#adb5bd" strokeWidth="4" strokeDasharray="7 3" />
      <rect x={x - 38} y={seatY - 4} width="76" height="14" rx="7" fill={colour} />
      <rect x={x - 34} y={seatY - 3} width="68" height="4" rx="2" fill="#fff" opacity="0.4" />
    </>
  );
}

/** The swing: a child swings high and kicks its legs, the empty seat sways along, the frame wobbles a little. */
export function Schaukel() {
  return (
    <>
      <g className="sp-schaukel-frame" style={{ transformOrigin: "0px 0px" }}>
        {/* Legs: an A on each side, the back legs lighter */}
        <path d="M-196 0 L-222 -320 M222 0 L196 -320" stroke="#4dabf7" strokeWidth="13" strokeLinecap="round" opacity="0.6" />
        <path d="M-260 0 L-222 -320 L-184 0 M260 0 L222 -320 L184 0" stroke="#228be6" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M-248 -60 H-196 M196 -60 H248" stroke="#1c7ed6" strokeWidth="8" strokeLinecap="round" />
        <rect x="-240" y="-334" width="480" height="24" rx="12" fill="#1971c2" />
        <rect x="-232" y="-330" width="464" height="7" rx="3.5" fill="#74c0fc" opacity="0.7" />
        <circle cx="-222" cy="-322" r="10" fill="#ffd60a" />
        <circle cx="222" cy="-322" r="10" fill="#ffd60a" />
      </g>
      <g className="sp-schaukel-empty" style={{ transformOrigin: "110px -312px" }}>
        <Seat x={110} top={-312} seatY={-66} colour="#e63946" />
      </g>
      <g className="sp-schaukel-swing" style={{ transformOrigin: "-110px -312px" }}>
        <Seat x={-110} top={-312} seatY={-66} colour="#40c057" />
        {/* The child sits on the seat and holds the chains */}
        <g className="sp-schaukel-legs" style={{ transformOrigin: "-96px -66px" }}>
          <Leg x1={-98} y1={-66} x2={-74} y2={-24} trousers="#1864ab" shoe="#e63946" />
          <Leg x1={-90} y1={-66} x2={-64} y2={-26} trousers="#1864ab" shoe="#e63946" />
        </g>
        <rect x="-128" y="-122" width="36" height="58" rx="13" fill="#ffd43b" />
        <path d="M-124 -112 L-138 -150 M-96 -112 L-82 -150" stroke="#ffd43b" strokeWidth="10" strokeLinecap="round" />
        <circle cx="-138" cy="-152" r="6" fill={SKIN} />
        <circle cx="-82" cy="-152" r="6" fill={SKIN} />
        <Head cx={-110} cy={-144} r={20} hair="#8d5524" />
        <Notes x={-60} y={-180} texts={["Hui!", "Hoch!"]} colour="#ffd43b" />
      </g>
    </>
  );
}

/** A child sitting on one end of the seesaw, holding the handle; `dir` is the way it faces. */
function SeesawKid({ x, dir, shirt, hair, style, cap }: { x: number; dir: 1 | -1; shirt: string; hair: string; style: "short" | "pigtails"; cap?: string }) {
  return (
    <>
      <Leg x1={x} y1={-66} x2={x + 22 * dir} y2={-30} trousers="#495057" shoe="#4dabf7" w={10} />
      <rect x={x - 17} y="-120" width="34" height="56" rx="13" fill={shirt} />
      <Arm x1={x + 6 * dir} y1={-108} x2={x + 34 * dir} y2={-86} sleeve={shirt} w={9} />
      <Head cx={x} cy={-140} r={19} hair={hair} style={style} cap={cap} />
    </>
  );
}

/** The seesaw: two children go up and down, laugh, and little hearts fly up. */
export function Wippe() {
  return (
    <>
      <path d="M-34 0 L0 -60 L34 0 Z" fill="#e63946" />
      <path d="M0 -60 L34 0 H14 Z" fill="#c92a3a" />
      <g transform="rotate(-9 0 -60)">
        <g className="sp-wippe-plank" style={{ transformOrigin: "0px -60px" }}>
          <rect x="-196" y="-68" width="392" height="16" rx="8" fill={WOOD} />
          <rect x="-190" y="-66" width="380" height="5" rx="2.5" fill={WOOD_LIGHT} />
          <path d="M-146 -68 V-98 M146 -68 V-98" stroke="#ffd60a" strokeWidth="8" strokeLinecap="round" />
          <path d="M-154 -98 H-138 M138 -98 H154" stroke="#ffd60a" strokeWidth="8" strokeLinecap="round" />
          <rect x="-196" y="-56" width="30" height="10" rx="5" fill="#495057" />
          <rect x="166" y="-56" width="30" height="10" rx="5" fill="#495057" />
          <SeesawKid x={-176} dir={1} shirt="#9775fa" hair="#e9c46a" style="pigtails" />
          <SeesawKid x={176} dir={-1} shirt="#40c057" hair="#2b2d42" style="short" cap="#e63946" />
        </g>
      </g>
      <circle cx="0" cy="-60" r="10" fill="#ffd60a" />
      <Hearts className="sp-wippe-hearts" spots={[[-176, -186], [176, -186], [0, -110]]} r={11} />
      <Notes x={-40} y={-170} texts={["Hoch!", "Runter!"]} colour="#e599f7" />
    </>
  );
}

/** A child on the roundabout; the class picks where it starts on the way round. */
function RideKid({ className, x, shirt, hair, style }: { className: string; x: number; shirt: string; hair: string; style: "short" | "pigtails" | "curly" }) {
  return (
    <g className={className}>
      <Leg x1={x - 6} y1={-70} x2={x - 14} y2={-46} trousers="#343a40" shoe="#fab005" w={10} />
      <Leg x1={x + 6} y1={-70} x2={x + 14} y2={-46} trousers="#343a40" shoe="#fab005" w={10} />
      <rect x={x - 17} y="-124" width="34" height="56" rx="13" fill={shirt} />
      <Arm x1={x - 12} y1={-112} x2={x - 30} y2={-136} sleeve={shirt} w={9} />
      <Arm x1={x + 12} y1={-112} x2={x + 30} y2={-136} sleeve={shirt} w={9} />
      <Head cx={x} cy={-144} r={19} hair={hair} style={style} />
    </g>
  );
}

/** The roundabout: its coloured rim turns, two children go round and round and laugh, the flag flutters. */
export function Karussell() {
  return (
    <>
      <ellipse cx="0" cy="-18" rx="160" ry="40" fill="#adb5bd" />
      <ellipse cx="0" cy="-30" rx="160" ry="40" fill="#e9ecef" />
      {/* The rim is a dashed ring: moving the dashes makes it look as if it turns. */}
      <ellipse cx="0" cy="-30" rx="148" ry="34" fill="none" stroke="#ffd43b" strokeWidth="20" />
      <ellipse className="sp-karussell-rim" cx="0" cy="-30" rx="148" ry="34" fill="none" stroke="#ff6b6b" strokeWidth="20" strokeDasharray="58 58" />
      <ellipse cx="0" cy="-32" rx="112" ry="24" fill="#f8f9fa" />
      <RideKid className="sp-karussell-back" x={0} shirt="#ff922b" hair="#2b2d42" style="curly" />
      {/* Pole with a ring of handles */}
      <rect x="-7" y="-176" width="14" height="148" rx="7" fill="#868e96" />
      <ellipse cx="0" cy="-130" rx="74" ry="14" fill="none" stroke="#4dabf7" strokeWidth="8" />
      <path d="M-74 -130 V-40 M74 -130 V-40" stroke="#4dabf7" strokeWidth="7" strokeLinecap="round" />
      <g className="sp-karussell-flag" style={{ transformOrigin: "0px -196px" }}>
        <path d="M0 -196 Q22 -204 44 -192 Q32 -184 44 -172 Q22 -180 0 -176 Z" fill="#40c057" />
      </g>
      <path d="M0 -172 V-200" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <RideKid className="sp-karussell-front" x={0} shirt="#4dabf7" hair="#e9c46a" style="pigtails" />
      <Notes x={110} y={-150} texts={["Hihi!", "Hui!"]} colour="#ffd43b" />
    </>
  );
}

/** The spring horse: it rocks back and forth on its spring, the child rides, the mane and tail fly. */
export function Schaukelpferd() {
  return (
    <>
      <ellipse cx="0" cy="-4" rx="40" ry="9" fill="#868e96" />
      <g className="sp-pferd-rock" style={{ transformOrigin: "0px -10px" }}>
        <path d="M-18 -10 Q18 -18 -18 -26 Q18 -34 -18 -42 Q18 -50 -18 -58 Q18 -66 -10 -74" stroke="#868e96" strokeWidth="9" strokeLinecap="round" fill="none" />
        <g className="sp-pferd-tail" style={{ transformOrigin: "-74px -112px" }}>
          <path d="M-74 -112 Q-108 -104 -102 -64 Q-90 -86 -74 -96 Z" fill="#7950f2" />
        </g>
        <ellipse cx="0" cy="-104" rx="80" ry="34" fill="#f8f9fa" />
        <ellipse cx="0" cy="-88" rx="70" ry="16" fill="#e9ecef" />
        <circle cx="-30" cy="-112" r="9" fill="#ffd8a8" opacity="0.9" />
        <circle cx="20" cy="-96" r="7" fill="#ffd8a8" opacity="0.9" />
        {/* Head and neck */}
        <path d="M44 -120 Q60 -170 92 -186 Q122 -190 126 -164 Q120 -146 96 -146 Q86 -126 70 -96 Z" fill="#f8f9fa" />
        <ellipse cx="118" cy="-160" rx="14" ry="11" fill="#ffc9c9" />
        <circle cx="122" cy="-162" r="2.4" fill={INK} />
        <path d="M84 -186 L80 -206 L96 -190 Z" fill="#f8f9fa" />
        <g className="sp-pferd-mane" style={{ transformOrigin: "80px -184px" }}>
          <path d="M84 -190 Q60 -184 52 -150 Q46 -128 40 -116 Q66 -132 70 -160 Q78 -178 96 -186 Z" fill="#7950f2" />
        </g>
        <circle cx="100" cy="-170" r="4.4" fill={INK} />
        <circle cx="101.5" cy="-171.5" r="1.4" fill="#fff" />
        <Lid cx={100} cy={-170} r={4.2} fill="#f8f9fa" />
        <path d="M86 -152 H112" stroke="#e63946" strokeWidth="5" strokeLinecap="round" />
        {/* The child holds the handles */}
        <Leg x1={-6} y1={-128} x2={10} y2={-84} trousers="#1864ab" shoe="#e63946" w={11} />
        <rect x="-26" y="-184" width="36" height="58" rx="13" fill="#ff6b6b" />
        <Arm x1={4} y1={-170} x2={60} y2={-150} sleeve="#ff6b6b" w={9} />
        <Head cx={-6} cy={-204} r={20} hair="#6b4423" cap="#4dabf7" />
      </g>
      <Notes x={60} y={-220} texts={["Hü!", "Hopp!"]} colour="#e599f7" />
    </>
  );
}
