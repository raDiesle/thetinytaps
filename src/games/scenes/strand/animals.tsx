import { CHEEK, Eye, Face, INK, side } from "../shared";
import { Lid, Notes, Puffs, Sparkles } from "./parts";

// Animals on the sand: the cheeky gull, the crab, the starfish and the shell. Foot point at (0, 0).

/** The gull faces left, towards the chips: it hops over, grabs a chip, flaps up and lands again. */
export function Moewe() {
  return (
    <g className="sd-moewe-body">
      <path d="M2 -40 V-4 M20 -40 V-4" stroke="#ff922b" strokeWidth="5" strokeLinecap="round" />
      <path d="M-8 -2 H10 M10 -2 H28" stroke="#ff922b" strokeWidth="6" strokeLinecap="round" />
      <path d="M44 -66 L84 -78 L78 -50 Z" fill="#868e96" />
      <ellipse cx="10" cy="-60" rx="46" ry="27" fill="#fff" />
      <path d="M-24 -50 Q10 -34 46 -52" stroke="#e9ecef" strokeWidth="6" strokeLinecap="round" fill="none" />
      <g className="sd-moewe-wing" style={{ transformOrigin: "0px -70px" }}>
        <path d="M-6 -72 Q30 -92 74 -70 Q40 -48 -2 -56 Z" fill="#adb5bd" />
        <path d="M56 -78 Q68 -76 74 -70 Q64 -62 54 -60 Z" fill="#343a40" />
      </g>
      <circle cx="-30" cy="-92" r="23" fill="#fff" />
      <path d="M-52 -96 L-84 -90 L-52 -84 Z" fill="#ffd43b" />
      <circle cx="-62" cy="-87" r="2.6" fill="#e63946" />
      {/* The stolen chip in its beak */}
      <rect className="sd-moewe-chip" x="-96" y="-93" width="30" height="8" rx="3" fill="#ffd43b" transform="rotate(-12 -80 -89)" />
      <Eye cx={-36} cy={-98} r={3.6} />
      <Lid cx={-36} cy={-98} r={3.6} fill="#fff" />
      <Notes x={-90} y={-130} texts={["Kriäh!"]} colour="#fff" size={24} />
    </g>
  );
}

/** The crab: it runs sideways to and fro, snaps its claws and blinks on its eye stalks. */
export function Krebs() {
  return (
    <>
      <Puffs
        className="sd-krebs-sand"
        spots={[
          [-70, -6],
          [-50, -2],
          [50, -2],
          [70, -6],
        ]}
        r={8}
        fill="#e2b46a"
      />
      <g className="sd-krebs-run">
        <g stroke="#e8590c" strokeWidth="6" strokeLinecap="round" fill="none">
          {[-1, 1].map((s) => (
            <g key={s} className="sd-krebs-legs" style={{ ...side(s as 1 | -1), transformOrigin: `${s * 30}px -24px` }}>
              <path d={`M${s * 30} -24 l${s * 28} 10 l${s * 6} 12`} />
              <path d={`M${s * 30} -16 l${s * 24} 12 l${s * 2} 8`} />
              <path d={`M${s * 26} -10 l${s * 16} 10`} />
            </g>
          ))}
        </g>
        {[-1, 1].map((s) => (
          <g key={s} className="sd-krebs-claw" style={{ ...side(s as 1 | -1), transformOrigin: `${s * 38}px -40px` }}>
            <path d={`M${s * 38} -40 Q${s * 60} -50 ${s * 64} -70`} stroke="#fa5252" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d={`M${s * 64} -70 Q${s * 90} -84 ${s * 82} -104 Q${s * 70} -96 ${s * 70} -84 Z`} fill="#ff6b6b" />
            <g className="sd-krebs-pincer" style={{ ...side(s as 1 | -1), transformOrigin: `${s * 66}px -74px` }}>
              <path d={`M${s * 64} -72 Q${s * 50} -92 ${s * 58} -108 Q${s * 66} -94 ${s * 70} -84 Z`} fill="#fa5252" />
            </g>
          </g>
        ))}
        <path d="M-12 -52 V-76 M12 -52 V-76" stroke="#fa5252" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="0" cy="-32" rx="46" ry="28" fill="#ff6b6b" />
        <path d="M-30 -46 Q0 -58 30 -46" stroke="#fff" strokeOpacity="0.4" strokeWidth="5" strokeLinecap="round" fill="none" />
        <circle cx="-12" cy="-80" r="9" fill="#fff" />
        <circle cx="12" cy="-80" r="9" fill="#fff" />
        <Eye cx={-11} cy={-80} r={4.4} />
        <Eye cx={13} cy={-80} r={4.4} />
        <Lid cx={-11} cy={-80} r={4.4} fill="#ff6b6b" />
        <Lid cx={13} cy={-80} r={4.4} fill="#ff6b6b" />
        <path d="M-10 -26 Q0 -18 10 -26" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
        <circle cx="-22" cy="-26" r="5" fill={CHEEK} opacity="0.6" />
        <circle cx="22" cy="-26" r="5" fill={CHEEK} opacity="0.6" />
      </g>
      <Notes x={70} y={-110} texts={["Zwick!", "Zwack!"]} colour="#ffa8a8" size={22} />
    </>
  );
}

/** A five-armed star around (0, -36), squashed a little as it lies on the sand. */
function starPath(r: number, inner: number) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const d = i % 2 ? inner : r;
    return [d * Math.cos(a), -36 + d * Math.sin(a) * 0.8];
  });
  // Rounded tips: a quadratic curve through every inner corner.
  return (
    `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)} ` +
    points
      .map((_, i) => {
        const p = points[(i + 1) % 10];
        const q = points[(i + 2) % 10];
        return i % 2 === 0 ? `Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}` : "";
      })
      .join(" ") +
    " Z"
  );
}

/** The starfish: it wiggles, does a little jump and its face beams; sparkles pop up. */
export function Seestern() {
  return (
    <>
      <g className="sd-stern-wiggle" style={{ transformOrigin: "0px -30px" }}>
        <path d={starPath(54, 22)} fill="#ff922b" />
        <path d={starPath(30, 12)} fill="#ffa94d" />
        {[0, 1, 2, 3, 4].map((i) => {
          const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          return <circle key={i} cx={34 * Math.cos(a)} cy={-36 + 34 * Math.sin(a) * 0.8} r="3.5" fill="#fff" opacity="0.6" />;
        })}
        <Face cx={0} cy={-38} size={0.8} />
        <Lid cx={-5.6} cy={-38} r={2.6} fill="#ffa94d" />
        <Lid cx={5.6} cy={-38} r={2.6} fill="#ffa94d" />
      </g>
      <Sparkles
        className="sd-stern-sparkle"
        spots={[
          [-56, -80],
          [0, -100],
          [56, -80],
        ]}
        r={10}
        fill="#fff9db"
      />
    </>
  );
}

/** The scallop shell: its top opens and a shiny pearl peeks out; then it closes again. */
export function Muschel() {
  const ribs = [-36, -18, 0, 18, 36];
  return (
    <>
      <path d="M-46 -6 Q-50 -30 0 -32 Q50 -30 46 -6 Q40 4 0 4 Q-40 4 -46 -6 Z" fill="#ffc9c9" />
      <path d="M-38 -14 Q0 -24 38 -14" stroke="#ffa8a8" strokeWidth="4" fill="none" />
      <g className="sd-muschel-pearl">
        <circle cx="0" cy="-22" r="12" fill="#f1f3f5" />
        <circle cx="-4" cy="-26" r="4" fill="#fff" />
      </g>
      <g className="sd-muschel-top" style={{ transformOrigin: "0px -10px" }}>
        <path d="M-48 -12 Q-50 -62 0 -66 Q50 -62 48 -12 Q24 -22 0 -20 Q-24 -22 -48 -12 Z" fill="#ffa8a8" />
        {ribs.map((x) => (
          <path
            key={x}
            d={`M${x * 0.2} -22 Q${x * 0.9} -40 ${x * 1.1} -${56 - Math.abs(x) * 0.4}`}
            stroke="#ff8787"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        ))}
        <path d="M-34 -42 Q-20 -58 0 -60" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M-12 -14 L0 -2 L12 -14 Z" fill="#ff8787" />
      </g>
      <Sparkles
        className="sd-muschel-sparkle"
        spots={[
          [-30, -70],
          [34, -76],
          [0, -90],
        ]}
        r={9}
        fill="#fff"
      />
    </>
  );
}
