import { Eye, INK, nth } from "../shared";
import { RAIL_RED } from "./parts";

// Animals. Each drawing has its foot point at (0, 0).

/** A rabbit on the airfield's grass: it twitches its nose and ears and hops. */
export function Hase() {
  return (
    <g className="fh-hase-body" style={{ transformOrigin: "0px 0px" }}>
      <circle cx="30" cy="-34" r="11" fill="#fff" />
      <ellipse cx="4" cy="-30" rx="32" ry="26" fill="#c8a27a" />
      <ellipse cx="20" cy="-8" rx="16" ry="8" fill="#b08968" />
      <ellipse cx="-24" cy="-6" rx="12" ry="6" fill="#b08968" />
      <g className="fh-hase-ear" style={{ transformOrigin: "-26px -70px" }}>
        <ellipse cx="-34" cy="-96" rx="8" ry="26" fill="#c8a27a" transform="rotate(-12 -34 -96)" />
        <ellipse cx="-34" cy="-94" rx="4" ry="18" fill="#ffafcc" transform="rotate(-12 -34 -94)" />
      </g>
      <g className="fh-hase-ear fh-hase-ear-r" style={{ transformOrigin: "-18px -70px" }}>
        <ellipse cx="-14" cy="-98" rx="8" ry="26" fill="#b08968" transform="rotate(10 -14 -98)" />
      </g>
      <circle cx="-26" cy="-58" r="20" fill="#c8a27a" />
      <Eye cx={-32} cy={-62} r={3.4} />
      <circle cx="-30" cy="-50" r="5" fill="#ff8fa3" opacity="0.5" />
      <ellipse className="fh-hase-nose" cx="-45" cy="-56" rx="4" ry="3" fill="#ff8fa3" />
      <path d="M-44 -52 l-12 -2 M-44 -50 l-12 4" stroke="#7f5539" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

/** The sparrow's little cousin: a pigeon. `dir` 1 looks right, -1 left. */
function Pigeon({ x, dir, i }: { x: number; dir: 1 | -1; i: number }) {
  return (
    <g transform={`translate(${x} 0) scale(${dir} 1)`}>
      <g className="fh-taube-bird" style={{ transformOrigin: "0px 0px", ...nth(i) }}>
        <path d="M-8 -6 v6 M6 -6 v6" stroke="#f4a261" strokeWidth="3" strokeLinecap="round" />
        <path d="M-40 -30 L-56 -40 L-50 -24 Z" fill="#6c757d" />
        <ellipse cx="-6" cy="-24" rx="32" ry="20" fill="#adb5bd" />
        <path className="fh-taube-wing" d="M-30 -30 Q-10 -46 10 -30 Q-10 -18 -30 -30 Z" fill="#868e96" style={{ transformOrigin: "-10px -30px" }} />
        <g className="fh-taube-head" style={{ transformOrigin: "18px -30px" }}>
          <circle cx="24" cy="-44" r="13" fill="#7d8597" />
          <path d="M18 -34 Q26 -30 30 -36" stroke="#52b788" strokeWidth="4" fill="none" />
          <path d="M36 -46 l9 3 l-9 3 Z" fill="#f4a261" />
          <Eye cx={28} cy={-47} r={2.6} />
        </g>
      </g>
    </g>
  );
}

/** Two pigeons pecking crumbs; they flap up a little and land again. */
export function Tauben() {
  return (
    <>
      <g className="fh-taube-crumbs" fill="#e9c46a">
        {[-20, 4, 26, 50].map((x, i) => (
          <circle key={x} cx={x} cy={-3} r="4" style={nth(i)} />
        ))}
      </g>
      <Pigeon x={-50} dir={1} i={0} />
      <Pigeon x={56} dir={-1} i={1} />
    </>
  );
}

/** The cat in its carrier box on the luggage trolley: it peeks out of the door and meows. */
export function Katze() {
  return (
    <>
      <rect x="-44" y="-178" width="88" height="62" rx="12" fill="#f4a261" />
      <rect x="-44" y="-178" width="88" height="12" rx="6" fill="#e76f51" />
      <rect x="-14" y="-190" width="28" height="14" rx="6" fill="none" stroke="#e76f51" strokeWidth="5" />
      <rect x="-30" y="-162" width="60" height="42" rx="8" fill="#343a40" />
      <g className="fh-katze-face" style={{ transformOrigin: "0px -120px" }}>
        <path d="M-22 -150 L-18 -168 L-6 -156 Z M22 -150 L18 -168 L6 -156 Z" fill="#adb5bd" />
        <circle cx="0" cy="-140" r="20" fill="#ced4da" />
        <Eye cx={-8} cy={-144} r={3.4} />
        <Eye cx={8} cy={-144} r={3.4} />
        <path d="M-3 -136 h6 l-3 3 Z" fill="#ff8fa3" />
        <path d="M0 -133 q-4 4 -8 2 M0 -133 q4 4 8 2" stroke={INK} strokeWidth="1.6" fill="none" />
        <path d="M-12 -134 l-14 -2 M-12 -131 l-14 3 M12 -134 l14 -2 M12 -131 l14 3" stroke="#6c757d" strokeWidth="1.4" />
      </g>
      <g className="fh-katze-door" style={{ transformOrigin: "-30px -141px" }}>
        <rect x="-30" y="-162" width="60" height="42" rx="8" fill="none" stroke="#adb5bd" strokeWidth="4" />
        <path d="M-15 -162 V-120 M0 -162 V-120 M15 -162 V-120" stroke="#adb5bd" strokeWidth="3" />
      </g>
      <g className="fh-katze-meow" fill="none" stroke={RAIL_RED} strokeWidth="3" strokeLinecap="round">
        <path d="M52 -170 l10 -6 M54 -158 h12 M52 -146 l10 6" />
      </g>
    </>
  );
}

/** The pilot's dog on its lead: it jumps up, wags its tail and barks. */
export function Hund() {
  return (
    <g className="fh-hund-body" style={{ transformOrigin: "-140px 0px" }}>
      <path d="M-92 -62 Q-30 -30 32 -104" stroke={RAIL_RED} strokeWidth="4" fill="none" strokeLinecap="round" />
      <g transform="translate(-140 0)">
        <path
          className="fh-hund-tail"
          d="M-56 -62 Q-80 -78 -74 -100"
          stroke="#fff"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          style={{ transformOrigin: "-56px -62px" }}
        />
        {[-48, -26, 24, 44].map((x) => (
          <g key={x}>
            <rect x={x - 7} y="-44" width="14" height="40" rx="6" fill={x < 0 ? "#e9ecef" : "#f8f9fa"} />
            <ellipse cx={x} cy="-4" rx="9" ry="5" fill="#495057" />
          </g>
        ))}
        <ellipse cx="0" cy="-56" rx="60" ry="28" fill="#f8f9fa" />
        <ellipse cx="-16" cy="-62" rx="16" ry="11" fill="#495057" />
        <ellipse cx="20" cy="-44" rx="10" ry="7" fill="#495057" />
        <path d="M44 -74 L52 -50" stroke={RAIL_RED} strokeWidth="8" strokeLinecap="round" />
        <circle cx="50" cy="-46" r="5" fill="#ffd60a" />
        <g className="fh-hund-head" style={{ transformOrigin: "52px -72px" }}>
          <circle cx="62" cy="-92" r="26" fill="#f8f9fa" />
          <ellipse cx="84" cy="-82" rx="17" ry="12" fill="#e9ecef" />
          <ellipse cx="99" cy="-87" rx="6" ry="5" fill={INK} />
          <circle cx="97" cy="-89" r="1.6" fill="#fff" />
          <path className="fh-hund-ear" d="M44 -112 Q30 -100 40 -74 Q52 -84 54 -106 Z" fill="#495057" style={{ transformOrigin: "49px -109px" }} />
          <circle cx="66" cy="-100" r="9" fill="#495057" />
          <Eye cx={68} cy={-98} r={3.6} />
          <circle cx="74" cy="-86" r="4.5" fill="#ff8fa3" opacity="0.5" />
          <path d="M94 -78 Q88 -72 80 -75" stroke="#2b2d42" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse className="fh-hund-tongue" cx="86" cy="-70" rx="5" ry="7" fill="#ff5d73" />
          <g className="fh-hund-bark" fill="none" stroke="#adb5bd" strokeWidth="4" strokeLinecap="round">
            <path d="M110 -116 l10 -6 M112 -104 h12 M110 -92 l10 6" />
          </g>
        </g>
      </g>
    </g>
  );
}
