import { INK, nth } from "../shared";

// Plants in the park and on the pavement, and the butterfly. Foot point at (0, 0).

const CROWN = [
  [0, -200, 82, "#52b788"],
  [-62, -160, 56, "#40916c"],
  [62, -166, 58, "#40916c"],
  [-22, -252, 46, "#52b788"],
] as const;

/** Apple tree in the park; the crown shakes and leaves fall. */
export function Baum() {
  return (
    <>
      {/* A squirrel hides behind the trunk and peeks out */}
      <g className="st-baum-squirrel">
        <path d="M-4 -40 Q-30 -60 -14 -82 Q2 -70 -4 -40 Z" fill="#bc6c25" />
        <ellipse cx="-6" cy="-36" rx="10" ry="12" fill="#d68c45" />
        <circle cx="-10" cy="-52" r="8" fill="#d68c45" />
        <path d="M-14 -60 l-2 -6 l5 3 Z" fill="#d68c45" />
        <circle cx="-13" cy="-53" r="1.8" fill="#2b2d42" />
      </g>
      <path d="M-14 0 Q-8 -60 -10 -110 H10 Q8 -60 14 0 Z" fill="#8d5a2b" />
      <path d="M0 -70 L-30 -110 M2 -90 L28 -126" stroke="#8d5a2b" strokeWidth="9" strokeLinecap="round" />
      <g className="st-baum-crown" style={{ transformOrigin: "0px -110px" }}>
        {CROWN.map(([cx, cy, r, fill]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={fill} />
        ))}
        <circle cx="-30" cy="-262" r="16" fill="#74c69d" />
        <circle cx="-26" cy="-214" r="22" fill="#74c69d" opacity="0.6" />
        {[
          [-40, -180],
          [30, -210],
          [70, -150],
          [-80, -150],
          [10, -150],
        ].map(([cx, cy]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r="9" fill="#e63946" />
            <circle cx={cx - 3} cy={cy - 3} r="2.5" fill="#fff" opacity="0.6" />
          </g>
        ))}
      </g>
      <g className="st-baum-apple">
        <circle cx="-56" cy="-128" r="9" fill="#e63946" />
        <circle cx="-59" cy="-131" r="2.5" fill="#fff" opacity="0.6" />
      </g>
      <g className="st-baum-leaves" fill="#74c69d">
        {[-60, -10, 40, 80].map((x, i) => (
          <ellipse key={x} cx={x} cy="-130" rx="9" ry="5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const BLOSSOMS = [
  [-34, -96, "#ff7bd0"],
  [0, -118, "#ffd60a"],
  [34, -100, "#8e7dff"],
] as const;

/** Wooden tub with three flowers. */
export function Blumen() {
  return (
    <>
      {BLOSSOMS.map(([cx, cy, color], i) => (
        <g key={cx} className="st-blumen-stem" style={{ ...nth(i), transformOrigin: `${cx}px -48px` }}>
          <path d={`M${cx} -48 V${cy}`} stroke="#40916c" strokeWidth="5" />
          {i > 0 && <path d={`M${cx - 16} -${i === 1 ? 64 : 70} q10 -14 16 -4`} stroke="#40916c" strokeWidth="5" fill="none" />}
          <g className="st-blumen-head" style={nth(i)}>
            {[0, 72, 144, 216, 288].map((a) => (
              <circle key={a} cx={cx} cy={cy - 10} r="8" fill={color} transform={`rotate(${a} ${cx} ${cy})`} />
            ))}
            <circle cx={cx} cy={cy} r="6.5" fill="#fff4d6" />
          </g>
        </g>
      ))}
      {/* A bumblebee visits the flowers */}
      <g className="st-blumen-bee">
        <ellipse cx="-4" cy="-142" rx="5" ry="3.5" fill="#fff" opacity="0.8" />
        <ellipse cx="4" cy="-142" rx="5" ry="3.5" fill="#fff" opacity="0.8" />
        <ellipse cx="0" cy="-136" rx="8" ry="6" fill="#ffd60a" />
        <path d="M-2 -141 V-131 M3 -141 V-131" stroke={INK} strokeWidth="2.5" />
      </g>
      <ellipse cx="0" cy="-48" rx="52" ry="7" fill="#6b4423" />
      <path d="M-56 -48 H56 L48 0 H-48 Z" fill="#bc6c25" />
      <path d="M-54 -36 H54 M-50 -14 H50" stroke="#a0522d" strokeWidth="5" />
    </>
  );
}

/** Butterfly above the flower tub, in the tub's coordinates. */
export function Falter() {
  return (
    <g className="st-falter-flight">
      <g className="st-falter-wings" style={{ transformOrigin: "32px -160px" }}>
        <ellipse cx="20" cy="-168" rx="14" ry="11" fill="#ff7bd0" />
        <ellipse cx="44" cy="-168" rx="14" ry="11" fill="#ff7bd0" />
        <ellipse cx="22" cy="-150" rx="9" ry="8" fill="#ffd60a" />
        <ellipse cx="42" cy="-150" rx="9" ry="8" fill="#ffd60a" />
        <circle cx="20" cy="-168" r="4" fill="#fff" opacity="0.7" />
        <circle cx="44" cy="-168" r="4" fill="#fff" opacity="0.7" />
      </g>
      <ellipse cx="32" cy="-160" rx="3.5" ry="14" fill="#2b2d42" />
      <path
        className="st-falter-antennae"
        d="M30 -173 q-4 -10 -9 -12 M34 -173 q4 -10 9 -12"
        stroke="#2b2d42"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        style={{ transformOrigin: "32px -173px" }}
      />
    </g>
  );
}
