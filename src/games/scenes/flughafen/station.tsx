import { Face, GLASS, INK, Inside, Pane, Rider, SKIN, STEEL, Wheel, nth } from "../shared";
import { NAVY, RAIL_RED, Toot } from "./parts";

// The railway: the signal, the train (driving left) and the things on the platform.
// Every drawing has its foot point at (0, 0); the train's is between its bogies on the rail.

/** A bogie wheel that turns while the train rolls (class fh-wheel). */
function RailWheel({ cx }: { cx: number }) {
  return (
    <g className="fh-wheel" style={{ transformOrigin: `${cx}px -17px` }}>
      <Wheel cx={cx} cy={-17} r={16} />
    </g>
  );
}

/** Underframe, bogies and couplings shared by all the train's cars. */
function Chassis({ left, right }: { left: number; right: number }) {
  return (
    <>
      <rect x={left + 10} y="-50" width={right - left - 20} height="16" rx="4" fill="#343a40" />
      <rect x={left - 12} y="-62" width="14" height="10" rx="3" fill={STEEL} />
      <rect x={right - 2} y="-62" width="14" height="10" rx="3" fill={STEEL} />
      {[left + 50, left + 86, right - 86, right - 50].map((x) => (
        <RailWheel key={x} cx={x} />
      ))}
      <path d={`M${left + 40} -26 H${left + 96} M${right - 96} -26 H${right - 40}`} stroke="#495057" strokeWidth="6" />
    </>
  );
}

const LOK_FRONT = "M-150 -126 Q-146 -170 -110 -186 H-80 V-126 Z";

/** The red locomotive: it rolls in, the pantograph rises with a spark, the lights flash and it toots. */
export function Lok() {
  return (
    <g className="fh-roll" style={{ transformOrigin: "0px 0px" }}>
      <ellipse className="fh-lok-beam" cx="-190" cy="-64" rx="30" ry="14" fill="#fff3b0" />
      <g className="fh-lok-panto" style={{ transformOrigin: "20px -200px" }}>
        <path d="M-10 -200 L24 -232 L56 -200" stroke={INK} strokeWidth="4" fill="none" strokeLinejoin="round" />
        <path d="M0 -236 H48" stroke={INK} strokeWidth="6" strokeLinecap="round" />
        <g className="fh-lok-spark" fill="#ffd60a">
          <path d="M24 -250 l4 8 l8 -2 l-6 6 l6 6 l-8 -2 l-4 8 l-4 -8 l-8 2 l6 -6 l-6 -6 l8 2 Z" />
        </g>
      </g>
      <path d="M-120 -200 H140 Q152 -200 152 -188 V-46 H-162 V-110 Q-162 -172 -120 -200 Z" fill={RAIL_RED} />
      <path d="M-162 -92 H152 V-80 H-162 Z" fill="#fff" />
      <path d="M-120 -200 H140 Q152 -200 152 -188 V-184 H-130 Q-126 -194 -120 -200 Z" fill="#c1121f" />
      <path d={LOK_FRONT} fill={GLASS} />
      <Inside d={LOK_FRONT}>
        <g className="fh-lok-driver">
          <Rider cx={-108} cy={-150} shirt={NAVY} cap={NAVY} />
        </g>
      </Inside>
      <path d="M-118 -178 h8 L-132 -132 h-8 Z" fill="#fff" opacity="0.5" />
      <Pane x={-60} y={-170} w={44} h={40} />
      <Pane x={70} y={-170} w={56} h={40} />
      <rect x="2" y="-178" width="44" height="124" rx="5" fill="#495057" />
      <g className="fh-lok-door" style={{ transformOrigin: "2px -116px" }}>
        <rect x="2" y="-178" width="44" height="124" rx="5" fill={RAIL_RED} stroke="#c1121f" strokeWidth="3" />
        <rect x="10" y="-168" width="28" height="30" rx="4" fill={GLASS} />
        <rect x="34" y="-120" width="6" height="18" rx="3" fill="#f8f9fa" />
      </g>
      <circle cx="-154" cy="-64" r="8" fill="#fff4d6" />
      <circle className="fh-lok-lamp" cx="-154" cy="-64" r="8" fill="#ffd60a" />
      <rect x="-60" y="-120" width="44" height="18" rx="4" fill="#fff" opacity="0.9" />
      <path d="M-52 -111 h28" stroke={RAIL_RED} strokeWidth="5" strokeLinecap="round" />
      <Chassis left={-150} right={150} />
      <Toot x={-150} y={-210} dir={-1} className="fh-lok-toot" />
    </g>
  );
}

const COACH_BODY = "M-150 -196 H150 Q160 -196 160 -184 V-46 H-160 V-184 Q-160 -196 -150 -196 Z";

const COACH_GUESTS = [
  { x: -146, shirt: "#ff5d73", hair: "#e9c46a" },
  { x: -96, shirt: "#06d6a0", hair: "#2b2d42" },
  { x: 16, shirt: "#9d4edd", hair: "#dee2e6" },
  { x: 66, shirt: "#ffb703", hair: "#bc6c25" },
  { x: 116, shirt: "#ff8fab", hair: "#6b4423" },
];

/** A blue passenger coach: the door slides open, someone gets out and waves, the people inside look out. */
export function Wagen() {
  return (
    <g className="fh-roll" style={{ transformOrigin: "0px 0px" }}>
      <path d={COACH_BODY} fill="#3a86ff" />
      <path d="M-160 -92 H160 V-82 H-160 Z" fill="#ffd60a" />
      <path d="M-150 -196 H150 Q160 -196 160 -184 V-182 H-160 V-184 Q-160 -196 -150 -196 Z" fill="#2667cc" />
      {COACH_GUESTS.map(({ x, shirt, hair }, i) => (
        <Pane key={x} x={x} y={-170} w={40} h={46} rx={8}>
          <g className="fh-wagen-guest" style={nth(i)}>
            <Rider cx={x + 20} cy={-140} shirt={shirt} hair={hair} />
          </g>
        </Pane>
      ))}
      {/* Behind the door: a traveller with a backpack, getting off */}
      <Inside d="M-44 -178 h50 v124 h-50 Z">
        <rect x="-44" y="-178" width="50" height="124" fill="#495057" />
        <g className="fh-wagen-traveller">
          <rect x="-36" y="-130" width="34" height="60" rx="12" fill="#06d6a0" />
          <rect x="-40" y="-126" width="12" height="40" rx="5" fill="#bc6c25" />
          <circle cx="-19" cy="-146" r="15" fill={SKIN} />
          <path d="M-34 -148 Q-34 -164 -19 -163 Q-4 -164 -4 -148 Q-12 -156 -34 -148 Z" fill="#e9c46a" />
          <Face cx={-19} cy={-146} size={0.5} />
          <g className="fh-wagen-wave" style={{ transformOrigin: "-4px -120px" }}>
            <path d="M-4 -120 L10 -150" stroke="#06d6a0" strokeWidth="9" strokeLinecap="round" />
            <circle cx="11" cy="-153" r="6" fill={SKIN} />
          </g>
        </g>
      </Inside>
      <g className="fh-wagen-door" style={{ transformOrigin: "-44px -116px" }}>
        <rect x="-44" y="-178" width="50" height="124" rx="4" fill="#4cc9f0" stroke="#2667cc" strokeWidth="3" />
        <rect x="-36" y="-168" width="34" height="40" rx="5" fill={GLASS} />
        <rect x="-8" y="-112" width="5" height="16" rx="2" fill="#f8f9fa" />
      </g>
      <circle className="fh-wagen-lamp" cx="-19" cy="-188" r="5" fill="#ffd60a" />
      <Chassis left={-160} right={160} />
    </g>
  );
}

/** The soft reflection of a window, drawn over the people behind it. */
function Glint({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <path d={`M${x + w * 0.3} ${y + 3} h${w * 0.18} L${x + w * 0.26} ${y + h - 3} h${-w * 0.18} Z`} fill="#fff" opacity="0.35" />
      <path d={`M${x + w * 0.56} ${y + 3} h${w * 0.07} L${x + w * 0.41} ${y + h - 3} h${-w * 0.07} Z`} fill="#fff" opacity="0.25" />
    </>
  );
}

const DINER_WINDOW = "M-146 -172 h120 v52 h-120 Z";
const DINER_GUESTS = "M2 -172 h140 v52 h-140 Z";

/** The green dining car: the cook flips a pancake, the guests eat and the coffee steams. */
export function Speisewagen() {
  return (
    <g className="fh-roll" style={{ transformOrigin: "0px 0px" }}>
      <path d={COACH_BODY} fill="#2a9d8f" />
      <path d="M-160 -92 H160 V-82 H-160 Z" fill="#f8f9fa" />
      <path d="M-150 -196 H150 Q160 -196 160 -184 V-182 H-160 V-184 Q-160 -196 -150 -196 Z" fill="#21867a" />
      <rect x="-146" y="-172" width="120" height="52" rx="8" fill="#fff3e0" />
      <Inside d={DINER_WINDOW}>
        <g className="fh-speise-cook" style={{ transformOrigin: "-90px -120px" }}>
          <rect x="-110" y="-136" width="40" height="30" rx="10" fill="#fff" />
          <circle cx="-90" cy="-148" r="14" fill={SKIN} />
          <Face cx={-90} cy={-149} size={0.48} />
          <rect x="-102" y="-164" width="24" height="8" rx="3" fill="#fff" />
          <circle cx="-98" cy="-170" r="8" fill="#fff" />
          <circle cx="-84" cy="-172" r="9" fill="#fff" />
        </g>
        <path d="M-74 -130 L-48 -130" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <ellipse className="fh-speise-pancake" cx="-46" cy="-134" rx="12" ry="4" fill="#e9c46a" />
        <path d="M-140 -126 H-120" stroke="#adb5bd" strokeWidth="6" />
      </Inside>
      <Glint x={-146} y={-172} w={120} h={52} />
      <rect x="2" y="-172" width="140" height="52" rx="8" fill="#fff3e0" />
      <Inside d={DINER_GUESTS}>
        {[
          [36, "#ff5d73", "#6b4423"],
          [108, "#4361ee", "#2b2d42"],
        ].map(([x, shirt, hair], i) => (
          <g key={i} className="fh-speise-guest" style={{ transformOrigin: `${x}px -120px`, ...nth(i) }}>
            <Rider cx={Number(x)} cy={-150} shirt={String(shirt)} hair={String(hair)} />
          </g>
        ))}
        <rect x="2" y="-128" width="140" height="10" fill="#f8f9fa" />
        <path d="M66 -136 h14 v8 h-14 Z M80 -134 q6 0 4 5" fill="#f8f9fa" stroke="#e76f51" strokeWidth="2" />
        <circle cx="72" cy="-144" r="4" fill="#ff5d73" />
        <path d="M72 -140 v8" stroke="#2a9d8f" strokeWidth="2" />
      </Inside>
      <Glint x={2} y={-172} w={140} h={52} />
      <g className="fh-speise-steam" fill="#fff">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="72" cy="-142" r="5" style={nth(i)} />
        ))}
      </g>
      <circle cx="-14" cy="-108" r="12" fill="#ffd60a" />
      <path d="M-18 -116 v14 M-10 -116 v6 q0 4 -2 4 v4" stroke="#21867a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <Chassis left={-160} right={160} />
    </g>
  );
}

/** The light signal by the track: red turns into green, then back to red. */
export function Signal() {
  return (
    <>
      <rect x="-26" y="-12" width="52" height="12" rx="4" fill="#868e96" />
      <rect x="-7" y="-196" width="14" height="186" fill="#adb5bd" />
      <path d="M-7 -170 h14 M-7 -130 h14 M-7 -90 h14 M-7 -50 h14" stroke="#868e96" strokeWidth="4" />
      <path d="M-34 -184 L34 -184" stroke="#868e96" strokeWidth="6" strokeLinecap="round" />
      <rect x="-28" y="-276" width="56" height="96" rx="20" fill="#2b2d42" />
      <path d="M-28 -248 h-8 q0 -14 8 -16 M-28 -208 h-8 q0 -14 8 -16 M28 -248 h8 q0 -14 -8 -16 M28 -208 h8 q0 -14 -8 -16" fill="#2b2d42" />
      <circle cx="0" cy="-252" r="15" fill="#ff5d73" />
      <circle cx="-5" cy="-257" r="5" fill="#fff" opacity="0.6" />
      <circle className="fh-signal-redoff" cx="0" cy="-252" r="15" fill="#6c1d24" />
      <circle cx="0" cy="-204" r="15" fill="#1b4332" />
      <circle className="fh-signal-glow" cx="0" cy="-204" r="30" fill="#b7f7c8" />
      <circle className="fh-signal-green" cx="0" cy="-204" r="15" fill="#52e07a" />
      <path d="M-14 -296 h28 l-14 -16 Z" fill="#ffd60a" className="fh-signal-sign" style={{ transformOrigin: "0px -296px" }} />
    </>
  );
}

const TICKS = Array.from({ length: 12 }, (_, i) => i * 30);

/** The station clock: the hands race round once, and the red second hand spins along. */
export function Uhr() {
  return (
    <>
      <rect x="-26" y="-10" width="52" height="10" rx="4" fill="#495057" />
      <rect x="-6" y="-206" width="12" height="198" fill="#6c757d" />
      <g className="fh-uhr-head" style={{ transformOrigin: "0px -206px" }}>
        <circle cx="0" cy="-250" r="48" fill="#495057" />
        <circle cx="0" cy="-250" r="42" fill="#fff" />
        {TICKS.map((a) => (
          <line key={a} x1="0" y1="-288" x2="0" y2={a % 90 ? -282 : -278} stroke={INK} strokeWidth={a % 90 ? 3 : 5} transform={`rotate(${a} 0 -250)`} />
        ))}
        <g className="fh-uhr-hour" style={{ transformOrigin: "0px -250px" }}>
          <path d="M0 -250 L-16 -262" stroke={INK} strokeWidth="7" strokeLinecap="round" />
        </g>
        <g className="fh-uhr-min" style={{ transformOrigin: "0px -250px" }}>
          <path d="M0 -250 V-284" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        </g>
        <g className="fh-uhr-sec" style={{ transformOrigin: "0px -250px" }}>
          <path d="M0 -240 V-274" stroke={RAIL_RED} strokeWidth="2.5" />
          <circle cx="0" cy="-276" r="6" fill={RAIL_RED} />
        </g>
        <circle cx="0" cy="-250" r="4" fill={INK} />
        <g className="fh-uhr-ring" fill="none" stroke="#ffd60a" strokeWidth="4" strokeLinecap="round">
          <path d="M-56 -276 q-8 10 0 20" style={nth(0)} />
          <path d="M56 -276 q8 10 0 20" style={nth(1)} />
        </g>
      </g>
    </>
  );
}

/** The sparrow sitting on top of the station clock: it hops, flaps and chirps. */
export function Spatz() {
  return (
    <g className="fh-spatz-body" style={{ transformOrigin: "0px -298px" }}>
      <path d="M-22 -310 L-36 -318 L-34 -306 Z" fill="#8d5a2b" />
      <ellipse cx="-4" cy="-310" rx="20" ry="13" fill="#a47148" />
      <ellipse cx="0" cy="-304" rx="12" ry="7" fill="#e9d8c4" />
      <path className="fh-spatz-wing" d="M-16 -314 Q-4 -326 6 -312 Q-4 -306 -16 -314 Z" fill="#7f5539" style={{ transformOrigin: "-4px -314px" }} />
      <circle cx="14" cy="-322" r="11" fill="#a47148" />
      <path d="M24 -324 l8 3 l-8 3 Z" fill="#f4a261" />
      <circle cx="17" cy="-325" r="2.4" fill={INK} />
      <circle cx="17.8" cy="-325.8" r="0.8" fill="#fff" />
      <path d="M-4 -298 v6 M4 -298 v6" stroke="#f4a261" strokeWidth="2.5" strokeLinecap="round" />
      <g className="fh-spatz-notes" fill={INK}>
        <path d="M30 -346 v-14 l8 3 v4 l-6 -2 v10 a4 3 0 1 1 -2 -1 Z" style={nth(0)} />
        <path d="M44 -330 v-12 l7 3 v3 l-5 -2 v9 a4 3 0 1 1 -2 -1 Z" style={nth(1)} />
      </g>
    </g>
  );
}

const ROWS = [
  { y: -244, w: 120, colour: "#ffd60a" },
  { y: -218, w: 150, colour: "#f8f9fa" },
  { y: -192, w: 96, colour: "#f8f9fa" },
];

/** The departure board: the flaps flip over, a little train runs across and the speaker says "ding dong". */
export function Tafel() {
  return (
    <>
      <rect x="-104" y="-170" width="10" height="170" fill="#6c757d" />
      <rect x="94" y="-170" width="10" height="170" fill="#6c757d" />
      <rect x="-124" y="-268" width="248" height="112" rx="10" fill={NAVY} />
      <rect x="-116" y="-260" width="232" height="96" rx="6" fill="#14213d" />
      {ROWS.map(({ y, w, colour }, i) => (
        <g key={y} className="fh-tafel-row" style={{ transformOrigin: `0px ${y + 6}px`, ...nth(i) }}>
          <rect x="-104" y={y} width="34" height="12" rx="2" fill="#ffd60a" />
          <rect x="-62" y={y} width={w} height="12" rx="2" fill={colour} opacity="0.9" />
        </g>
      ))}
      <g className="fh-tafel-train">
        <rect x="-102" y="-178" width="28" height="10" rx="4" fill={RAIL_RED} />
        <rect x="-72" y="-178" width="20" height="10" rx="3" fill="#4cc9f0" />
      </g>
      <rect x="-6" y="-292" width="12" height="24" fill="#6c757d" />
      <path d="M-20 -300 h18 l16 -10 v28 l-16 -10 h-18 Z" fill="#adb5bd" />
      <g className="fh-tafel-waves" fill="none" stroke="#4cc9f0" strokeWidth="4" strokeLinecap="round">
        <path d="M22 -306 q8 10 0 20" style={nth(0)} />
        <path d="M34 -312 q12 16 0 32" style={nth(1)} />
      </g>
    </>
  );
}

/** The ticket machine: the screen lights up, the buttons blink and a ticket slides out. */
export function Automat() {
  return (
    <>
      <rect x="-54" y="-206" width="108" height="14" rx="5" fill="#adb5bd" />
      <rect x="-48" y="-194" width="96" height="194" rx="8" fill={RAIL_RED} />
      <rect x="20" y="-194" width="28" height="194" rx="8" fill="#c1121f" />
      <rect x="-36" y="-180" width="72" height="50" rx="6" fill="#14213d" />
      <g className="fh-auto-screen">
        <rect x="-36" y="-180" width="72" height="50" rx="6" fill="#4cc9f0" />
        <Face cx={0} cy={-160} size={0.8} />
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <circle cx={-24 + (i % 3) * 24} cy={-112 + Math.floor(i / 3) * 20} r="7" fill="#f8f9fa" />
          <circle className="fh-auto-btn" cx={-24 + (i % 3) * 24} cy={-112 + Math.floor(i / 3) * 20} r="7" fill="#ffd60a" style={nth(i)} />
        </g>
      ))}
      <rect x="-24" y="-64" width="48" height="8" rx="3" fill="#343a40" />
      <g className="fh-auto-ticket" style={{ transformOrigin: "0px -60px" }}>
        <rect x="-18" y="-62" width="36" height="40" rx="3" fill="#fff" stroke="#ced4da" strokeWidth="2" />
        <path d="M-10 -50 h20 M-10 -40 h14" stroke={RAIL_RED} strokeWidth="3" />
      </g>
      <rect x="-32" y="-14" width="64" height="8" rx="3" fill="#c1121f" />
    </>
  );
}
