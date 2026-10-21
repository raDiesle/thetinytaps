import { INK, nth } from "../shared";

// Small creatures. The anthill and the snail stand on the ground with their foot point at
// (0, 0); the stag beetle sits on the log pile, the ladybird on the fern and the butterfly
// above the berry bush, each in their coordinates.

/** A little ant, facing right, centred on (x, y). */
function Ant({ x, y, carry }: { x: number; y: number; carry?: boolean }) {
  return (
    <>
      <path d={`M${x - 6} ${y + 2} l-3 5 M${x} ${y + 2} v6 M${x + 5} ${y + 2} l3 5`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={x - 7} cy={y} r="4" fill={INK} />
      <circle cx={x} cy={y} r="3" fill={INK} />
      <circle cx={x + 6} cy={y - 1} r="3.4" fill={INK} />
      <path d={`M${x + 8} ${y - 4} l4 -5`} stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      {carry && <path d={`M${x - 2} ${y - 6} q8 -12 16 -4 q-8 8 -16 4 Z`} fill="#52b788" />}
    </>
  );
}

/** Anthill of pine needles; it shivers, and a line of ants marches out and round and back in again. */
export function Ameisenhaufen() {
  return (
    <>
      <g className="wd-ameisen-hill" style={{ transformOrigin: "0px 0px" }}>
        <path d="M-92 0 Q-70 -60 -20 -86 Q0 -94 20 -86 Q70 -60 92 0 Z" fill="#b08968" />
        <path d="M-60 -20 l10 -8 M-30 -50 l8 -10 M10 -70 l8 -8 M40 -40 l10 -6 M-10 -30 l6 -10 M60 -16 l10 -6 M-40 -10 l8 -6 M20 -20 l8 -8" stroke="#7f5539" strokeWidth="3" strokeLinecap="round" />
        <path d="M-60 -40 Q-30 -80 10 -84" stroke="#e6ccb2" strokeWidth="5" strokeLinecap="round" opacity="0.5" fill="none" />
        <ellipse cx="0" cy="-60" rx="10" ry="6" fill="#5c4033" />
      </g>
      <Ant x={-40} y={-44} />
      <Ant x={30} y={-62} />
      <g className="wd-ameisen-march">
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} className="wd-ameise" style={nth(i)}>
            <Ant x={0} y={-58} carry={i === 2} />
          </g>
        ))}
      </g>
    </>
  );
}

/** Stag beetle on top of the log pile, facing right; it opens and shuts its big jaws, lifts its wing cases and turns. */
export function Hirschkaefer() {
  return (
    <g className="wd-kaefer-body" style={{ transformOrigin: "0px -170px" }}>
      <path d="M-14 -172 l-8 6 M-2 -172 l-2 7 M10 -172 l4 6 M-10 -186 l-10 -4 M4 -186 l2 -6" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
      <g className="wd-kaefer-wing" style={{ transformOrigin: "10px -186px" }}>
        <path d="M-2 -186 Q-28 -210 -40 -186 Q-26 -180 -2 -186 Z" fill="#dee2e6" opacity="0.8" />
      </g>
      <g className="wd-kaefer-case" style={{ transformOrigin: "8px -186px" }}>
        <ellipse cx="-8" cy="-182" rx="22" ry="12" fill="#6b2e14" />
        <path d="M-28 -182 H12" stroke="#4a1f0d" strokeWidth="2" />
        <ellipse cx="-12" cy="-188" rx="9" ry="3" fill="#fff" opacity="0.35" />
      </g>
      <ellipse cx="18" cy="-182" rx="9" ry="8" fill="#3d1c0c" />
      <circle cx="22" cy="-186" r="1.8" fill="#fff" />
      <g className="wd-kaefer-jaw" style={{ transformOrigin: "24px -184px" }}>
        <path d="M24 -186 Q38 -202 50 -196 M40 -199 l-2 -7" stroke="#a63c13" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
      <g className="wd-kaefer-jaw wd-jaw-low" style={{ transformOrigin: "24px -180px" }}>
        <path d="M24 -180 Q40 -170 50 -178 M42 -174 l1 -7" stroke="#a63c13" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
}

/** Ladybird on the fern leaf; it opens its wing cases, flies a little loop and lands again. */
export function Marienkaefer() {
  return (
    <g className="wd-mk-flight">
      <g className="wd-mk-wings" fill="#e7f5ff" opacity="0.85">
        <ellipse cx="62" cy="-128" rx="12" ry="6" transform="rotate(-30 62 -128)" />
        <ellipse cx="82" cy="-128" rx="12" ry="6" transform="rotate(30 82 -128)" />
      </g>
      <circle cx="84" cy="-116" r="6" fill={INK} />
      <g className="wd-mk-case" style={{ transformOrigin: "78px -122px" }}>
        <ellipse cx="72" cy="-114" rx="13" ry="11" fill="#e63946" />
        <path d="M72 -125 V-103" stroke={INK} strokeWidth="1.6" />
        <circle cx="66" cy="-118" r="2.6" fill={INK} />
        <circle cx="78" cy="-118" r="2.6" fill={INK} />
        <circle cx="66" cy="-108" r="2.2" fill={INK} />
        <circle cx="78" cy="-108" r="2.2" fill={INK} />
        <ellipse cx="68" cy="-121" rx="4" ry="2" fill="#fff" opacity="0.6" />
      </g>
      <circle cx="87" cy="-117" r="1.4" fill="#fff" />
    </g>
  );
}

/** Banded snail with a yellow shell, facing right; it hides in its shell, comes out again, waves its eye stalks and its trail glistens. */
export function Schnecke() {
  return (
    <>
      <path className="wd-schnecke-trail" d="M-44 -2 H-100" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 8" />
      <g className="wd-schnecke-foot" style={{ transformOrigin: "0px -10px" }}>
        <path d="M-40 0 Q-40 -12 -20 -12 H30 Q44 -14 46 -30 Q50 -38 56 -34 Q62 -20 52 -6 Q46 0 30 0 Z" fill="#c9ada7" />
        <g className="wd-schnecke-stalks" style={{ transformOrigin: "51px -34px" }}>
          <path d="M48 -34 L46 -52 M54 -34 L60 -50" stroke="#c9ada7" strokeWidth="4" strokeLinecap="round" />
          <circle cx="46" cy="-53" r="4.5" fill="#c9ada7" />
          <circle cx="60" cy="-51" r="4.5" fill="#c9ada7" />
          <circle cx="46.5" cy="-53" r="2" fill={INK} />
          <circle cx="60.5" cy="-51" r="2" fill={INK} />
        </g>
        <path d="M50 -20 q4 3 8 0" stroke="#9a8c98" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      <g className="wd-schnecke-shell" style={{ transformOrigin: "0px -10px" }}>
        <circle cx="0" cy="-32" r="27" fill="#ffd166" />
        <path d="M2 -32 m-5 0 a5 5 0 1 1 10 0 a10 10 0 1 1 -20 0 a15 15 0 1 1 30 0 a20 20 0 1 1 -40 0" stroke="#9c6644" strokeWidth="4.5" fill="none" />
        <ellipse cx="-10" cy="-50" rx="8" ry="4" fill="#fff" opacity="0.5" />
      </g>
    </>
  );
}

/** Blue butterfly above the berry bush; it flutters a loop, wiggles its antennae and leaves a sparkle trail. */
export function Schmetterling() {
  return (
    <>
      <g className="wd-falter-dust" fill="#fff">
        {[
          [-10, -170],
          [60, -150],
          [30, -210],
        ].map(([cx, cy], i) => (
          <circle key={cx} cx={cx} cy={cy} r="4" style={nth(i)} />
        ))}
      </g>
      <g className="wd-falter-flight">
        <g className="wd-falter-wings" style={{ transformOrigin: "20px -188px" }}>
          <path d="M20 -190 Q2 -218 -6 -196 Q-8 -180 20 -188 Z M20 -190 Q38 -218 46 -196 Q48 -180 20 -188 Z" fill="#4dabf7" />
          <path d="M20 -186 Q4 -178 6 -168 Q14 -166 20 -184 Z M20 -186 Q36 -178 34 -168 Q26 -166 20 -184 Z" fill="#339af0" />
          <circle cx="6" cy="-200" r="3.5" fill="#fff" />
          <circle cx="34" cy="-200" r="3.5" fill="#fff" />
          <path d="M-4 -198 Q4 -214 16 -206 M44 -198 Q36 -214 24 -206" stroke="#1c7ed6" strokeWidth="2" fill="none" />
        </g>
        <ellipse cx="20" cy="-188" rx="3" ry="12" fill={INK} />
        <path
          className="wd-falter-antenna"
          d="M18 -199 q-4 -10 -9 -12 M22 -199 q4 -10 9 -12"
          stroke={INK}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ transformOrigin: "20px -199px" }}
        />
      </g>
    </>
  );
}
