import type { ReactNode } from "react";
import { Face, GLASS, INK, Pane, SKIN, nth } from "../shared";

// Houses and street furniture. Each drawing has its foot point at (0, 0).

/** A house window with a white frame and a sill; `light` is the class of the light that goes on when tapped. */
function Window({ x, y, w = 56, h = 66, i = 0, light, children }: { x: number; y: number; w?: number; h?: number; i?: number; light?: string; children?: ReactNode }) {
  return (
    <>
      <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx="6" fill="#fff" />
      <Pane x={x} y={y} w={w} h={h} rx={4}>
        {children}
      </Pane>
      {light && <rect className={light} x={x} y={y} width={w} height={h} rx="4" fill="#ffe066" style={nth(i)} />}
      <path d={`M${x + w / 2} ${y} V${y + h} M${x} ${y + h * 0.45} H${x + w}`} stroke="#fff" strokeWidth="4" />
      <rect x={x - 9} y={y + h + 3} width={w + 18} height="8" rx="3" fill="#dee2e6" />
    </>
  );
}

/** Church with a bell, a clock and a weathercock on its green spire. */
export function Kirche() {
  return (
    <>
      {/* Nave */}
      <rect x="50" y="-190" width="140" height="190" fill="#f1e3c8" />
      <rect x="172" y="-190" width="18" height="190" fill="#e6d3ae" />
      <path d="M40 -190 L120 -252 L200 -190 Z" fill="#c1666b" />
      <path d="M120 -252 L200 -190 H170 Z" fill="#a8545a" />
      {[90, 150].map((x) => (
        <path key={x} d={`M${x - 14} -50 V-112 a14 14 0 0 1 28 0 V-50 Z`} fill={GLASS} stroke="#e2cfa8" strokeWidth="5" />
      ))}
      {/* Tower */}
      <rect x="-60" y="-420" width="120" height="420" fill="#f6ead2" />
      <rect x="38" y="-420" width="22" height="420" fill="#eadbbd" />
      <rect x="-66" y="-426" width="132" height="10" rx="3" fill="#e2cfa8" />
      <path d="M-68 -420 L0 -540 L68 -420 Z" fill="#5e8c61" />
      <path d="M0 -540 L68 -420 H30 Z" fill="#4a7550" />
      <path d="M-30 -440 L-4 -500" stroke="#7fb383" strokeWidth="6" strokeLinecap="round" />
      <g className="st-kirche-hahn" style={{ transformOrigin: "0px -548px" }}>
        <path d="M0 -540 V-562" stroke={INK} strokeWidth="4" />
        <circle cx="0" cy="-548" r="5" fill="#ffc300" />
        <path d="M-10 -572 Q-24 -590 -26 -572 Q-20 -564 -8 -566 Z" fill="#ffc300" />
        <ellipse cx="2" cy="-570" rx="13" ry="8" fill="#ffc300" />
        <circle cx="13" cy="-580" r="6.5" fill="#ffc300" />
        <path d="M9 -586 q2 -6 5 -1 q3 -5 5 1 Z" fill="#e63946" />
        <path d="M19 -581 l7 2 l-7 3 Z" fill="#e85d04" />
        <circle cx="15" cy="-581" r="1.4" fill={INK} />
      </g>
      {/* Clock */}
      <circle cx="0" cy="-360" r="36" fill="#fff" stroke="#c9a227" strokeWidth="6" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={27 * Math.sin((i * Math.PI) / 6)} cy={-360 - 27 * Math.cos((i * Math.PI) / 6)} r={i % 3 ? 1.8 : 3} fill={INK} />
      ))}
      <path className="st-kirche-hour" d="M0 -360 H17" stroke={INK} strokeWidth="6" strokeLinecap="round" style={{ transformOrigin: "0px -360px" }} />
      <path className="st-kirche-minute" d="M0 -360 V-386" stroke={INK} strokeWidth="4" strokeLinecap="round" style={{ transformOrigin: "0px -360px" }} />
      <circle cx="0" cy="-360" r="4" fill="#c9a227" />
      {/* Belfry with the bell */}
      <path d="M-32 -230 V-280 a32 32 0 0 1 64 0 V-230 Z" fill="#5c4033" />
      <g className="st-kirche-bell" style={{ transformOrigin: "0px -300px" }}>
        <path d="M0 -306 V-294" stroke="#3d2b22" strokeWidth="4" />
        <path d="M-20 -244 Q-22 -292 0 -294 Q22 -292 20 -244 Z" fill="#ffc300" />
        <path d="M-10 -252 Q-12 -280 -2 -286" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.5" fill="none" />
        <rect x="-25" y="-248" width="50" height="8" rx="4" fill="#e0a800" />
        <circle cx="0" cy="-236" r="5" fill="#e0a800" />
      </g>
      <rect x="-38" y="-232" width="76" height="8" rx="3" fill="#e2cfa8" />
      {/* Round window and door */}
      <circle cx="0" cy="-160" r="18" fill={GLASS} stroke="#e2cfa8" strokeWidth="5" />
      <path d="M0 -178 V-142 M-18 -160 H18" stroke="#e2cfa8" strokeWidth="3" />
      <path d="M-30 0 V-64 a30 30 0 0 1 60 0 V0 Z" fill="#8d5a2b" />
      <path d="M0 0 V-94" stroke="#6b4423" strokeWidth="4" />
      <circle cx="-8" cy="-40" r="3.5" fill="#ffd60a" />
      <circle cx="8" cy="-40" r="3.5" fill="#ffd60a" />
      <rect x="-42" y="-6" width="84" height="6" rx="2" fill="#dee2e6" />
    </>
  );
}

/** A pink house; its windows light up and a child waves from the top floor. */
export function Haus() {
  return (
    <>
      <g className="st-haus-smoke" fill="#e9ecef">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="74" cy="-484" r="12" style={nth(i)} />
        ))}
      </g>
      <rect x="60" y="-470" width="28" height="56" fill="#b5838d" />
      <rect x="54" y="-478" width="40" height="10" rx="3" fill="#9d6b78" />
      <path d="M-140 -366 L-104 -440 H104 L140 -366 Z" fill="#6d6875" />
      <path d="M-96 -430 H96 M-112 -404 H112" stroke="#8e8a99" strokeWidth="5" />
      <circle cx="0" cy="-402" r="20" fill="#fff" />
      <circle cx="0" cy="-402" r="15" fill={GLASS} />
      <path d="M-6 -414 L4 -390" stroke="#fff" strokeWidth="4" opacity="0.6" />
      <rect x="-140" y="-362" width="280" height="362" fill="#ffcad4" />
      <rect x="118" y="-362" width="22" height="362" fill="#f4acb7" />
      <rect x="-148" y="-370" width="296" height="14" rx="4" fill="#e5989b" />
      <rect x="-140" y="-26" width="280" height="26" fill="#e5989b" />
      {/* Top floor; a child waves from the middle window */}
      <Window x={-112} y={-334} light="st-haus-light" i={0} />
      <Window x={-28} y={-334} light="st-haus-light" i={1}>
        <rect x="-14" y="-282" width="28" height="22" rx="8" fill="#4cc9f0" />
        <circle cx="0" cy="-294" r="14" fill={SKIN} />
        <path d="M-14 -296 Q-14 -312 0 -311 Q14 -312 14 -296 Q4 -304 -14 -296 Z" fill="#e9c46a" />
        <Face cx={0} cy={-296} size={0.55} />
        <g className="st-haus-arm" style={{ transformOrigin: "12px -276px" }}>
          <path d="M12 -276 L24 -296" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
          <circle cx="25" cy="-298" r="5" fill={SKIN} />
        </g>
      </Window>
      <Window x={56} y={-334} light="st-haus-light" i={2} />
      {/* First floor with flower boxes */}
      <Window x={-112} y={-226} light="st-haus-light" i={3} />
      <Window x={-28} y={-226} light="st-haus-light" i={4} />
      <Window x={56} y={-226} light="st-haus-light" i={5} />
      {[-84, 84].map((cx) => (
        <g key={cx}>
          <rect x={cx - 30} y="-152" width="60" height="14" rx="4" fill="#a0522d" />
          {[-18, -6, 6, 18].map((dx, i) => (
            <circle key={dx} cx={cx + dx} cy="-155" r="5" fill={i % 2 ? "#ff7bd0" : "#ffd60a"} />
          ))}
        </g>
      ))}
      {/* Ground floor */}
      <Window x={-112} y={-118} h={60} light="st-haus-light" i={6} />
      <Window x={56} y={-118} h={60} light="st-haus-light" i={7} />
      <path d="M-28 -2 V-76 a28 28 0 0 1 56 0 V-2 Z" fill="#3a86ff" />
      <path d="M-16 -70 a16 16 0 0 1 32 0 Z" fill={GLASS} />
      <circle cx="16" cy="-40" r="4" fill="#ffd60a" />
      <rect x="-38" y="-8" width="76" height="8" rx="2" fill="#dee2e6" />
    </>
  );
}

const PRETZEL = (cx: number, cy: number) =>
  `M${cx} ${cy - 6} C${cx - 26} ${cy - 30} ${cx - 34} ${cy + 18} ${cx - 8} ${cy + 18} C${cx + 4} ${cy + 18} ${cx + 6} ${cy + 2} ${cx} ${cy - 6} ` +
  `C${cx - 6} ${cy + 2} ${cx - 4} ${cy + 18} ${cx + 8} ${cy + 18} C${cx + 34} ${cy + 18} ${cx + 26} ${cy - 30} ${cx} ${cy - 6}`;

/** The bakery: striped awning, bread in the window, a pretzel sign and the baker in the door. */
export function Baeckerei() {
  return (
    <>
      <g className="st-baecker-steam" fill="#f8f9fa">
        {[0, 1, 2].map((i) => (
          <circle key={i} cx="-67" cy="-432" r="12" style={nth(i)} />
        ))}
      </g>
      <rect x="-80" y="-420" width="26" height="50" fill="#a98467" />
      <rect x="-86" y="-426" width="38" height="10" rx="3" fill="#8b6c55" />
      <path d="M-140 -326 L-110 -392 H110 L140 -326 Z" fill="#bc6c25" />
      <path d="M-104 -380 H104 M-122 -354 H122" stroke="#d68c45" strokeWidth="5" />
      <rect x="-140" y="-322" width="280" height="322" fill="#fff1d6" />
      <rect x="118" y="-322" width="22" height="322" fill="#f6dfb8" />
      <rect x="-148" y="-330" width="296" height="12" rx="4" fill="#dda15e" />
      <Window x={-112} y={-298} h={56} />
      <Window x={56} y={-298} h={56} />
      {/* Sign board with a loaf */}
      <rect x="-40" y="-292" width="80" height="48" rx="8" fill="#fff" stroke="#dda15e" strokeWidth="4" />
      <ellipse cx="0" cy="-268" rx="24" ry="13" fill="#d4a373" />
      <path d="M-12 -276 l6 12 M0 -279 l6 12 M12 -276 l5 10" stroke="#a0522d" strokeWidth="3" strokeLinecap="round" />
      {/* Striped awning */}
      {Array.from({ length: 8 }, (_, i) => {
        const x = -146 + i * 36.5;
        const color = i % 2 ? "#fff" : "#e63946";
        return (
          <g key={i} fill={color}>
            <rect x={x} y="-206" width="36.5" height="32" />
            <path d={`M${x} -175 a18.25 13 0 0 0 36.5 0 Z`} />
          </g>
        );
      })}
      <rect x="-150" y="-212" width="300" height="10" rx="4" fill="#c1121f" />
      {/* Shop window with bread that jumps */}
      <rect x="-130" y="-156" width="156" height="130" rx="4" fill="#fff" />
      <Pane x={-124} y={-150} w={144} h={118} rx={3}>
        <rect x="-124" y="-104" width="144" height="6" fill="#dda15e" />
        <rect x="-124" y="-44" width="144" height="12" fill="#dda15e" />
        <g className="st-baecker-bread">
          <g style={nth(0)}>
            <ellipse cx="-96" cy="-116" rx="20" ry="11" fill="#d4a373" />
            <path d="M-106 -120 l5 8 M-96 -122 l5 8 M-86 -120 l4 7" stroke="#a0522d" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g style={nth(1)}>
            <circle cx="-56" cy="-116" r="12" fill="#e9c46a" />
            <circle cx="-30" cy="-116" r="12" fill="#e9c46a" />
          </g>
          <g style={nth(2)}>
            <path d={PRETZEL(-92, -64)} stroke="#b5651d" strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
          <g style={nth(3)}>
            <path d="M-56 -46 Q-38 -82 -18 -46 Q-38 -56 -56 -46 Z" fill="#e9a03b" />
            <path d="M-46 -52 L-40 -68 M-32 -52 L-36 -68" stroke="#c47a2c" strokeWidth="2.5" />
          </g>
          <g style={nth(4)}>
            <ellipse cx="2" cy="-56" rx="14" ry="11" fill="#8d5a2b" />
          </g>
        </g>
      </Pane>
      {/* Door with the baker behind its glass */}
      <rect x="40" y="-156" width="72" height="156" rx="4" fill="#6b4423" />
      <Pane x={50} y={-146} w={52} h={74} rx={4}>
        <g className="st-baecker-baker">
          <rect x="60" y="-86" width="32" height="30" rx="10" fill="#fff" />
          <circle cx="76" cy="-100" r="14" fill={SKIN} />
          <Face cx={76} cy={-102} size={0.55} />
          <circle cx="66" cy="-122" r="8" fill="#fff" />
          <circle cx="76" cy="-126" r="10" fill="#fff" />
          <circle cx="86" cy="-122" r="8" fill="#fff" />
          <rect x="63" y="-120" width="26" height="8" rx="3" fill="#fff" />
        </g>
      </Pane>
      <circle cx="100" cy="-48" r="4" fill="#ffd60a" />
      <rect x="34" y="-6" width="84" height="6" rx="2" fill="#dee2e6" />
      {/* Pretzel sign on a bracket */}
      <path d="M-140 -242 H-186 M-150 -242 Q-160 -258 -176 -248" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      <g className="st-baecker-sign" style={{ transformOrigin: "-172px -242px" }}>
        <path d="M-172 -242 V-232" stroke={INK} strokeWidth="3" />
        <path d={PRETZEL(-172, -214)} stroke="#c47a2c" strokeWidth="9" fill="none" strokeLinecap="round" />
        <g fill="#fff">
          <circle cx="-186" cy="-222" r="1.8" />
          <circle cx="-160" cy="-224" r="1.8" />
          <circle cx="-178" cy="-200" r="1.8" />
        </g>
      </g>
    </>
  );
}

/** Fire station with a tower; the big gate rolls up. */
export function Feuerwache() {
  return (
    <>
      {/* Tower with flag and lamp */}
      <path d="M-122 -390 V-452" stroke={INK} strokeWidth="4" />
      <path className="st-wache-flag" d="M-122 -452 L-84 -442 L-122 -430 Z" fill="#ffd60a" style={{ transformOrigin: "-122px -441px" }} />
      <circle className="st-wache-glow" cx="-146" cy="-398" r="20" fill="#4cc9f0" />
      <rect x="-160" y="-390" width="76" height="390" fill="#c8553d" />
      <rect x="-100" y="-390" width="16" height="390" fill="#b5482f" />
      <path d="M-164 -390 h12 v-12 h12 v12 h12 v-12 h12 v12 h12 v-12 h12 v12 h4" fill="#8c3b2a" />
      <path className="st-wache-lamp" d="M-154 -398 a8 8 0 0 1 16 0 Z" fill="#3a86ff" />
      {[-350, -270, -190].map((y) => (
        <rect key={y} x="-132" y={y} width="20" height="36" rx="10" fill={GLASS} stroke="#fff" strokeWidth="3" />
      ))}
      {/* Main building */}
      <rect x="-84" y="-250" width="244" height="250" fill="#d1603d" />
      <rect x="140" y="-250" width="20" height="250" fill="#b5482f" />
      <path d="M-70 -210 h30 M10 -224 h30 M110 -204 h30 M-60 -20 h-16 M150 -40 h-10" stroke="#b5482f" strokeWidth="4" strokeLinecap="round" />
      <rect x="-90" y="-258" width="256" height="14" rx="4" fill="#8c3b2a" />
      <rect x="-30" y="-238" width="136" height="30" rx="6" fill="#fff" />
      <text x="38" y="-222" fill="#e63946" fontSize="21" fontWeight="800" textAnchor="middle" dominantBaseline="central" letterSpacing="1">
        FEUERWEHR
      </text>
      {/* Behind the gate: helmets and a hose */}
      <rect x="-64" y="-192" width="204" height="192" fill="#343a40" />
      <rect x="-64" y="-36" width="204" height="36" fill="#495057" />
      {[-30, 10].map((x) => (
        <path key={x} d={`M${x - 16} -136 Q${x - 16} -160 ${x} -160 Q${x + 16} -160 ${x + 16} -136 Z`} fill="#ffd60a" />
      ))}
      <circle cx="96" cy="-120" r="26" fill="none" stroke="#e63946" strokeWidth="9" />
      <circle cx="96" cy="-120" r="12" fill="none" stroke="#e63946" strokeWidth="7" />
      <g className="st-wache-gate" style={{ transformOrigin: "38px -192px" }}>
        <rect x="-64" y="-192" width="204" height="192" fill="#e9ecef" />
        <path d={Array.from({ length: 9 }, (_, i) => `M-64 ${-172 + i * 20} H140`).join(" ")} stroke="#ced4da" strokeWidth="4" />
        {[-48, 2, 52, 102].map((x) => (
          <rect key={x} x={x} y="-150" width="34" height="20" rx="3" fill={GLASS} />
        ))}
        <rect x="24" y="-24" width="28" height="8" rx="3" fill="#adb5bd" />
      </g>
      <path d="M-64 0 V-192 H140 V0" stroke="#8c3b2a" strokeWidth="8" fill="none" />
    </>
  );
}

/** Yellow postbox; a letter jumps out. A sparrow sits on top (see figures). */
export function Briefkasten() {
  return (
    <>
      <g className="st-post-letter">
        <rect x="-16" y="-170" width="32" height="22" rx="2" fill="#fff" stroke="#ced4da" strokeWidth="2" />
        <path d="M-16 -170 L0 -158 L16 -170" stroke="#ced4da" strokeWidth="2" fill="none" />
        <rect x="6" y="-168" width="7" height="7" fill="#ff5d73" />
      </g>
      <rect x="-5" y="-80" width="10" height="80" fill="#495057" />
      <rect x="-38" y="-170" width="76" height="96" rx="12" fill="#ffd60a" />
      <rect x="22" y="-170" width="16" height="96" rx="8" fill="#ffc300" />
      <rect x="-30" y="-166" width="50" height="6" rx="3" fill="#fff" opacity="0.5" />
      <rect x="-22" y="-148" width="44" height="7" rx="3" fill="#2b2d42" />
      <rect className="st-post-flap" x="-24" y="-154" width="48" height="8" rx="3" fill="#ffc300" style={{ transformOrigin: "0px -154px" }} />
      {/* Post horn */}
      <circle cx="-4" cy="-108" r="12" stroke="#2b2d42" strokeWidth="4" fill="none" />
      <path d="M8 -110 L22 -120 V-96 Z" fill="#2b2d42" />
    </>
  );
}

/** Old-fashioned street lamp. */
export function Laterne() {
  return (
    <>
      <circle className="st-laterne-glow" cx="0" cy="-260" r="48" fill="#fff3b0" />
      <path d="M0 0 V-232" stroke="#2b2d42" strokeWidth="8" />
      <rect x="-12" y="-28" width="24" height="28" rx="5" fill="#2b2d42" />
      <rect x="-9" y="-150" width="18" height="8" rx="3" fill="#2b2d42" />
      <path d="M-20 -236 H20 L14 -282 H-14 Z" fill="#e9ecef" stroke="#2b2d42" strokeWidth="4" strokeLinejoin="round" />
      <path className="st-laterne-light" d="M-20 -236 H20 L14 -282 H-14 Z" fill="#ffd60a" stroke="#2b2d42" strokeWidth="4" strokeLinejoin="round" />
      <path d="M0 -282 V-236" stroke="#2b2d42" strokeWidth="3" />
      <path d="M-26 -282 L0 -300 L26 -282 Z" fill="#2b2d42" />
      <circle cx="0" cy="-304" r="4" fill="#2b2d42" />
    </>
  );
}

/** Red fire hydrant; water sprays from the side. */
export function Hydrant() {
  return (
    <>
      <g className="st-hydrant-water" fill="#74c0fc">
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx="30" cy="-54" r="6" style={nth(i)} />
        ))}
      </g>
      <rect x="-22" y="-12" width="44" height="12" rx="4" fill="#c1121f" />
      <rect x="-16" y="-80" width="32" height="70" rx="8" fill="#e63946" />
      <path d="M-18 -78 Q0 -102 18 -78 Z" fill="#c1121f" />
      <rect x="-4" y="-104" width="8" height="10" rx="2" fill="#c1121f" />
      <rect x="-28" y="-60" width="12" height="12" rx="3" fill="#c1121f" />
      <rect x="16" y="-60" width="12" height="12" rx="3" fill="#c1121f" />
      <path d="M-8 -70 V-24" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    </>
  );
}

/** Pedestrian light: red man, then green man. */
export function Ampel() {
  return (
    <>
      <rect x="-4" y="-152" width="8" height="152" fill="#495057" />
      <rect x="-10" y="-6" width="20" height="6" rx="2" fill="#495057" />
      <rect x="-11" y="-100" width="22" height="30" rx="5" fill="#ffd60a" />
      <circle cx="0" cy="-85" r="5" fill={INK} />
      <rect x="-26" y="-248" width="52" height="98" rx="10" fill="#2b2d42" />
      <rect x="-18" y="-240" width="36" height="40" rx="6" fill="#5a1e1e" />
      <rect x="-18" y="-196" width="36" height="40" rx="6" fill="#1e3a24" />
      <g className="st-ampel-red" fill="#ff3b3b">
        <circle cx="0" cy="-230" r="5" />
        <rect x="-6" y="-224" width="12" height="15" rx="3" />
        <rect x="-10" y="-223" width="4" height="12" rx="2" />
        <rect x="6" y="-223" width="4" height="12" rx="2" />
        <rect x="-6" y="-210" width="5" height="8" rx="2" />
        <rect x="1" y="-210" width="5" height="8" rx="2" />
      </g>
      <g className="st-ampel-green" fill="#3ec300" stroke="#3ec300" strokeWidth="4" strokeLinecap="round">
        <circle cx="2" cy="-186" r="5" stroke="none" />
        <path d="M1 -178 L-1 -168 M-1 -168 L-7 -160 M-1 -168 L5 -160 M0 -176 L-7 -170 M1 -176 L7 -172" fill="none" />
      </g>
      <rect x="-22" y="-244" width="8" height="90" rx="4" fill="#fff" opacity="0.12" />
    </>
  );
}

/** Street bin on a post; rubbish hops out. */
export function Muelleimer() {
  return (
    <>
      <g className="st-eimer-junk">
        <circle cx="-8" cy="-130" r="9" fill="#f8f9fa" stroke="#ced4da" strokeWidth="2" style={nth(0)} />
        <path d="M10 -128 q-2 -16 8 -20 q2 10 -2 20 Z" fill="#ffd60a" style={nth(1)} />
        <rect x="-22" y="-134" width="12" height="16" rx="2" fill="#4cc9f0" style={nth(2)} />
      </g>
      <rect x="-4" y="-60" width="8" height="60" fill="#495057" />
      <g className="st-eimer-bin" style={{ transformOrigin: "0px -60px" }}>
        <path d="M6 -124 l10 -10 l6 8 Z" fill="#f8f9fa" />
        <rect x="-30" y="-126" width="60" height="70" rx="10" fill="#ff8c42" />
        <rect x="-34" y="-132" width="68" height="10" rx="5" fill="#f77f00" />
        <path d="M-14 -110 V-70 M0 -110 V-70 M14 -110 V-70" stroke="#f77f00" strokeWidth="4" strokeLinecap="round" />
      </g>
    </>
  );
}

/** Round fountain; tapped, the water shoots up high. */
export function Brunnen() {
  return (
    <>
      <ellipse cx="0" cy="-62" rx="132" ry="24" fill="#adb5bd" />
      <ellipse cx="0" cy="-60" rx="122" ry="19" fill="#74c0fc" />
      <g className="st-brunnen-ripples" fill="none" stroke="#d0ebff" strokeWidth="3">
        <ellipse cx="-50" cy="-58" rx="22" ry="5" style={nth(0)} />
        <ellipse cx="56" cy="-60" rx="22" ry="5" style={nth(1)} />
      </g>
      <rect x="-12" y="-130" width="24" height="72" fill="#ced4da" />
      <g className="st-brunnen-big" stroke="#a5d8ff" fill="none" strokeLinecap="round">
        <path d="M0 -136 V-236" strokeWidth="10" />
        <path d="M0 -232 Q-50 -250 -86 -74 M0 -232 Q50 -250 86 -74" strokeWidth="6" />
      </g>
      <g className="st-brunnen-jet" stroke="#a5d8ff" fill="none" strokeLinecap="round" strokeWidth="5">
        <path d="M0 -138 V-162 M0 -160 Q-20 -170 -34 -138 M0 -160 Q20 -170 34 -138" />
      </g>
      <path d="M-48 -136 Q0 -108 48 -136 Z" fill="#ced4da" />
      <ellipse cx="0" cy="-136" rx="48" ry="7" fill="#74c0fc" />
      <path d="M-132 -62 V-26 Q-132 -2 0 -2 Q132 -2 132 -26 V-62 Q132 -38 0 -38 Q-132 -38 -132 -62 Z" fill="#ced4da" />
      <path d="M-120 -50 Q0 -28 120 -50" stroke="#e9ecef" strokeWidth="5" fill="none" />
      <path d="M-88 -36 V-6 M-30 -32 V-2 M30 -32 V-2 M88 -36 V-6" stroke="#adb5bd" strokeWidth="3" />
    </>
  );
}
