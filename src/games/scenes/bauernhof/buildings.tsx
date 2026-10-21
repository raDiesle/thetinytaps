import { INK, Pane, SKIN, nth } from "../shared";

// Barn, farmhouse, windmill and the water pump. Foot point at (0, 0).

const BARN_WALL = "M-150 0 V-200 L-118 -282 L0 -332 L118 -282 L150 -200 V0 Z";

/** One barn door with its white X; it swings open around its hinge. */
function BarnDoor({ x, hinge }: { x: number; hinge: number }) {
  return (
    <g className="bh-scheune-door" style={{ transformOrigin: `${hinge}px -88px` }}>
      <rect x={x} y="-176" width="86" height="176" fill="#c1121f" stroke="#fff" strokeWidth="8" />
      <path d={`M${x + 6} -170 L${x + 80} -6 M${x + 80} -170 L${x + 6} -6`} stroke="#fff" strokeWidth="7" />
    </g>
  );
}

/** Red barn; the doors swing open, the weathervane turns. The owl sits in its hayloft. */
export function Scheune() {
  return (
    <>
      <path d={BARN_WALL} fill="#d62828" />
      <path
        d={Array.from({ length: 9 }, (_, i) => `M${-120 + i * 30} -12 V${i === 0 || i === 8 ? -220 : -270}`).join(" ")}
        stroke="#b71c1c"
        strokeWidth="3"
        opacity="0.6"
      />
      <path d="M-130 -200 H130" stroke="#fff" strokeWidth="7" />
      <rect x="-150" y="-16" width="300" height="16" fill="#9d0208" />
      <path d="M-170 -192 L-130 -290 L0 -346 L130 -290 L170 -192" stroke="#6a2c1f" strokeWidth="22" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M-160 -200 L-124 -286 L0 -338" stroke="#fff" strokeOpacity="0.25" strokeWidth="5" fill="none" />
      {/* Weathervane */}
      <path d="M0 -356 V-392" stroke={INK} strokeWidth="4" />
      <path className="bh-scheune-vane" d="M-14 -398 q4 -14 14 -12 q6 -10 10 -2 l-6 4 q6 6 -2 12 h-14 q-10 -2 -2 -2 Z" fill={INK} style={{ transformOrigin: "0px -398px" }} />
      {/* Hayloft: the owl sits in here */}
      <rect x="-42" y="-280" width="84" height="70" rx="6" fill="#4a2c2a" stroke="#fff" strokeWidth="6" />
      <path d="M-38 -214 q10 -16 20 -6 q10 -14 22 -4 q10 -14 22 -2 q6 -6 12 -2 V-214 Z" fill="#f4c95d" />
      {/* Inside the doors: hay and a lantern */}
      <rect x="-86" y="-176" width="172" height="176" fill="#3b2418" />
      <path d="M-80 0 Q-60 -70 -10 -64 Q30 -90 80 -40 V0 Z" fill="#e9b949" />
      <path d="M-60 -20 l14 -16 M-20 -40 l10 -18 M30 -30 l16 -14" stroke="#c89b2c" strokeWidth="3" />
      <circle className="bh-scheune-lamp" cx="0" cy="-140" r="10" fill="#ffd166" />
      <BarnDoor x={-86} hinge={-86} />
      <BarnDoor x={0} hinge={86} />
      <circle className="bh-scheune-dust" cx="-30" cy="-60" r="16" fill="#f4c95d" style={nth(0)} />
      <circle className="bh-scheune-dust" cx="20" cy="-80" r="12" fill="#f4c95d" style={nth(1)} />
      <circle className="bh-scheune-dust" cx="50" cy="-40" r="14" fill="#f4c95d" style={nth(2)} />
    </>
  );
}

const SHUTTERS = [20, 92];

/** Timber-framed farmhouse; lights go on, shutters flap, the farmer's wife waves from the window. */
export function Bauernhaus() {
  return (
    <>
      <rect x="70" y="-342" width="32" height="70" fill="#9c6644" />
      <rect x="66" y="-348" width="40" height="10" rx="3" fill="#7f5539" />
      <path d="M-150 0 V-230 H150 V0 Z" fill="#fff1d6" />
      <rect x="-150" y="-12" width="300" height="12" fill="#e6ccb2" />
      {/* Timber frame */}
      <path
        d="M-150 -230 H150 M-150 -160 H150 M-150 -8 H150 M-150 -230 V0 M150 -230 V0 M-46 -230 V0 M4 -160 V0 M150 -160 L104 -80 M-46 -160 L-10 -80"
        stroke="#8d5a2b"
        strokeWidth="8"
        fill="none"
      />
      <path d="M-178 -218 L0 -372 L178 -218 Z" fill="#bc4b51" />
      <path d="M-178 -218 L0 -372 L178 -218" stroke="#8c2f39" strokeWidth="10" strokeLinejoin="round" fill="none" />
      <path d="M-150 -240 L0 -360" stroke="#fff" strokeOpacity="0.25" strokeWidth="6" />
      <circle cx="0" cy="-286" r="18" fill="#bde0fe" stroke="#8d5a2b" strokeWidth="5" />
      <circle className="bh-haus-light" cx="0" cy="-286" r="16" fill="#ffd166" style={nth(0)} />
      {/* Stork's nest on the chimney */}
      <ellipse cx="86" cy="-346" rx="34" ry="11" fill="#8d6e4f" />
      <path d="M58 -350 l20 6 M72 -352 l26 4 M96 -352 l16 8 M64 -342 l24 -4" stroke="#6b4f36" strokeWidth="3" strokeLinecap="round" />
      {/* Upper windows, the farmer's wife in the middle one */}
      {[-110, -22, 66].map((x, i) => (
        <g key={x}>
          <Pane x={x} y={-214} w={44} h={46} rx={4}>
            {i === 1 && (
              <>
                <rect x={x + 6} y={-184} width="32" height="20" rx="8" fill="#e76f51" />
                <circle cx={x + 22} cy={-196} r="12" fill={SKIN} />
                <path d={`M${x + 9} -198 Q${x + 22} -216 ${x + 35} -198 Q${x + 22} -206 ${x + 9} -198 Z`} fill="#b08968" />
                <circle cx={x + 18} cy={-196} r="1.7" fill="#2b2d42" />
                <circle cx={x + 26} cy={-196} r="1.7" fill="#2b2d42" />
                <path d={`M${x + 18} -191 Q${x + 22} -188 ${x + 26} -191`} stroke="#2b2d42" strokeWidth="1.5" fill="none" />
              </>
            )}
          </Pane>
          {/* The farmer's wife's window stays unlit, so she can be seen waving. */}
          {i !== 1 && <rect className="bh-haus-light" x={x} y={-214} width="44" height="46" rx="4" fill="#ffd166" style={nth(i + 1)} />}
          <rect x={x - 3} y={-170} width="50" height="6" rx="2" fill="#8d5a2b" />
        </g>
      ))}
      <g className="bh-haus-arm" style={{ transformOrigin: "-2px -170px" }}>
        <path d="M-2 -170 L10 -204" stroke={SKIN} strokeWidth="7" strokeLinecap="round" />
        <circle cx="11" cy="-206" r="5" fill={SKIN} />
      </g>
      {/* Lower windows with shutters and flower boxes */}
      {SHUTTERS.map((x, i) => (
        <g key={x}>
          <Pane x={x} y={-148} w={52} h={56} rx={4} />
          <rect className="bh-haus-light" x={x} y={-148} width="52" height="56" rx="4" fill="#ffd166" style={nth(i + 4)} />
          <path d={`M${x + 26} -148 V-92 M${x} -120 H${x + 52}`} stroke="#fff" strokeWidth="4" />
          <rect className="bh-haus-shutter" x={x - 24} y={-150} width="22" height="60" rx="3" fill="#52b788" style={{ transformOrigin: `${x - 2}px -120px` }} />
          <rect className="bh-haus-shutter" x={x + 54} y={-150} width="22" height="60" rx="3" fill="#52b788" style={{ transformOrigin: `${x + 54}px -120px` }} />
          <rect x={x - 4} y={-92} width="60" height="14" rx="3" fill="#bc6c25" />
          {[8, 22, 36, 50].map((dx, j) => (
            <circle key={dx} cx={x + dx} cy={-96} r="6" fill={j % 2 ? "#ff8fa3" : "#e63946"} />
          ))}
        </g>
      ))}
      {/* Door */}
      <path d="M-130 0 V-104 Q-100 -136 -70 -104 V0 Z" fill="#6b4423" />
      <path d="M-122 -6 V-100 Q-100 -124 -78 -100 V-6" stroke="#8d5a2b" strokeWidth="4" fill="none" />
      <circle cx="-80" cy="-56" r="4" fill="#ffd166" />
      <rect x="-140" y="-6" width="80" height="8" rx="3" fill="#adb5bd" />
    </>
  );
}

const SAILS = [20, 110, 200, 290];

/** Windmill on the hill; the sails turn. */
export function Windmuehle() {
  return (
    <>
      <path d="M-62 0 L-42 -250 H42 L62 0 Z" fill="#f1e3c8" />
      <path d="M30 -250 H42 L62 0 H42 Z" fill="#e0cba8" />
      <path d="M-58 -60 H58 M-50 -150 H50" stroke="#e0cba8" strokeWidth="5" />
      <path d="M-18 0 V-46 Q0 -64 18 -46 V0 Z" fill="#7f5539" />
      <rect x="-12" y="-196" width="24" height="30" rx="10" fill="#bde0fe" stroke="#7f5539" strokeWidth="4" />
      <path d="M-54 -246 Q0 -312 54 -246 Z" fill="#6c584c" />
      <rect x="-56" y="-252" width="112" height="10" rx="4" fill="#5a4a40" />
      <g className="bh-muehle-sails" style={{ transformOrigin: "0px -270px" }}>
        {SAILS.map((a) => (
          <g key={a} transform={`rotate(${a} 0 -270)`}>
            <path d="M0 -270 V-438" stroke="#7f5539" strokeWidth="7" strokeLinecap="round" />
            <rect x="4" y="-432" width="30" height="140" rx="3" fill="#fdfcdc" stroke="#9c6644" strokeWidth="3" />
            <path d="M4 -397 H34 M4 -362 H34 M4 -327 H34 M19 -432 V-292" stroke="#c9b28c" strokeWidth="2" />
          </g>
        ))}
        <circle cx="0" cy="-270" r="13" fill="#5a4a40" />
        <circle cx="-3" cy="-273" r="4" fill="#fff" opacity="0.4" />
      </g>
    </>
  );
}

/** Green hand pump over a bucket; the handle goes up and down and water splashes. */
export function Pumpe() {
  return (
    <>
      <path d="M-40 0 L-34 -22 H34 L40 0 Z" fill="#adb5bd" />
      <path d="M-34 -22 H34" stroke="#ced4da" strokeWidth="4" />
      <path d="M36 0 L40 -40 H84 L88 0 Z" fill="#8d99ae" />
      <ellipse cx="62" cy="-40" rx="22" ry="5" fill="#4dabf7" />
      <path d="M40 -34 Q62 -20 84 -34" stroke="#6c757d" strokeWidth="3" fill="none" />
      <rect x="-16" y="-150" width="32" height="130" rx="8" fill="#2d6a4f" />
      <rect x="-8" y="-146" width="7" height="120" rx="3" fill="#fff" opacity="0.25" />
      <path d="M16 -108 H56 Q66 -108 66 -96 V-90" stroke="#2d6a4f" strokeWidth="14" strokeLinecap="round" fill="none" />
      <rect x="-22" y="-162" width="44" height="16" rx="6" fill="#1b4332" />
      <circle cx="0" cy="-170" r="8" fill="#1b4332" />
      <g className="bh-pumpe-handle" style={{ transformOrigin: "0px -164px" }}>
        <path d="M0 -164 L-72 -126" stroke="#1b4332" strokeWidth="10" strokeLinecap="round" />
        <circle cx="-74" cy="-125" r="9" fill="#1b4332" />
      </g>
      <g className="bh-pumpe-water" fill="#4dabf7">
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="66" cy="-84" r={6 - i * 0.6} style={nth(i)} />
        ))}
      </g>
    </>
  );
}
