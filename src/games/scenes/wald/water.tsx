import { INK, nth } from "../shared";
import { Lid, Lines } from "./parts";

// Things at the brook: the bridge, the fish, the frog on its stone and the dragonfly.
// Foot point at (0, 0); the dragonfly floats above the water.

/** Height of the bridge's deck at x: it arches over the brook. */
const deck = (x: number) => -12 - 30 * (1 - (x / 150) ** 2);
const PLANKS = Array.from({ length: 12 }, (_, i) => -150 + i * 25);
const POSTS = [-140, -70, 0, 70, 140];

/** Little wooden bridge over the brook; its planks bounce one after the other, the railing wobbles and water splashes below. */
export function Bruecke() {
  const rail = (lift: number) => POSTS.map((x, i) => `${i ? "L" : "M"}${x} ${deck(x) - 44 - lift}`).join(" ");
  return (
    <>
      {/* Back railing */}
      <g className="wd-bruecke-rail" style={{ transformOrigin: "0px -40px", ...nth(0) }}>
        {POSTS.map((x) => (
          <rect key={x} x={x - 4} y={deck(x) - 58} width="8" height="44" fill="#9c6644" />
        ))}
        <path d={rail(14)} stroke="#b08968" strokeWidth="8" strokeLinecap="round" fill="none" />
      </g>
      <g className="wd-bruecke-splash" fill="#fff">
        {[-60, 0, 60].map((x, i) => (
          <circle key={x} cx={x} cy={8} r="7" style={nth(i)} />
        ))}
      </g>
      <path
        d={`M-150 ${deck(-150)} ${PLANKS.map((x) => `L${x + 25} ${deck(x + 25)}`).join(" ")} V${deck(150) + 18} ${[...PLANKS]
          .reverse()
          .map((x) => `L${x} ${deck(x) + 18}`)
          .join(" ")} Z`}
        fill="#6f4e37"
      />
      {PLANKS.map((x, i) => (
        <rect
          key={x}
          className="wd-bruecke-plank"
          x={x + 1}
          y={deck(x + 12.5) - 9}
          width="23"
          height="16"
          rx="3"
          fill={i % 2 ? "#c49a6c" : "#b08968"}
          style={nth(i)}
        />
      ))}
      {/* Front railing */}
      <g className="wd-bruecke-rail" style={{ transformOrigin: "0px -40px", ...nth(1) }}>
        {POSTS.map((x) => (
          <rect key={x} x={x - 5} y={deck(x) - 46} width="10" height="50" rx="3" fill="#7f5539" />
        ))}
        <path d={rail(0)} stroke="#9c6644" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d={rail(-22)} stroke="#9c6644" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    </>
  );
}

const FISH = "#f77f00";

/** Fish in the brook, half under water; it jumps out in an arc, flaps its tail, splashes and leaves ripples. */
export function Fisch() {
  return (
    <>
      <g className="wd-fisch-rings" fill="none" stroke="#fff" strokeWidth="3">
        {[0, 1].map((i) => (
          <ellipse key={i} cx="0" cy="-2" rx={30 + i * 16} ry={7 + i * 4} style={nth(i)} />
        ))}
      </g>
      <g className="wd-fisch-body" style={{ transformOrigin: "0px -10px" }}>
        <g className="wd-fisch-tail" style={{ transformOrigin: "30px -12px" }}>
          <path d="M28 -12 L52 -30 L48 -12 L52 6 Z" fill="#e85d04" />
        </g>
        <path d="M-6 -26 Q6 -42 18 -26 Z" fill="#e85d04" />
        <ellipse cx="0" cy="-12" rx="34" ry="16" fill={FISH} />
        <path d="M-4 -26 Q-10 -12 -4 2 M8 -26 Q2 -12 8 2" stroke="#ffb703" strokeWidth="3" fill="none" />
        <ellipse cx="-4" cy="-18" rx="18" ry="5" fill="#fff" opacity="0.35" />
        <circle cx="-20" cy="-16" r="5" fill="#fff" />
        <circle cx="-21" cy="-16" r="3" fill={INK} />
        <circle cx="-20" cy="-17" r="1" fill="#fff" />
        <path d="M-32 -8 q4 3 8 0" stroke="#9d0208" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>
      {/* The water in front of the fish's tummy */}
      <path d="M-50 -6 Q-25 -12 0 -6 T50 -6 V10 H-50 Z" fill="#5fb0e5" opacity="0.85" />
      <path d="M-40 -4 q10 -4 20 0 M10 -4 q10 -4 20 0" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" fill="none" />
      <g className="wd-fisch-drops" fill="#bde0fe">
        {[-30, -10, 14, 34].map((x, i) => (
          <circle key={x} cx={x} cy={-10} r="4.5" style={nth(i)} />
        ))}
      </g>
    </>
  );
}

const FROG = "#70b33b";

/** Frog on a mossy stone in the brook; it puffs up its throat, blinks, jumps, catches a fly with its tongue and croaks. */
export function Frosch() {
  return (
    <>
      <ellipse cx="0" cy="-6" rx="44" ry="14" fill="#adb5bd" />
      <path d="M-40 -10 Q-20 -24 4 -20 Q-14 -12 -40 -10 Z" fill="#74c69d" />
      <ellipse cx="10" cy="-12" rx="14" ry="4" fill="#fff" opacity="0.4" />
      <g className="wd-frosch-fly">
        <ellipse cx="-34" cy="-82" rx="6" ry="4" fill="#fff" opacity="0.85" />
        <circle cx="-36" cy="-76" r="4.5" fill={INK} />
      </g>
      <g className="wd-frosch-body">
        <ellipse cx="-20" cy="-16" rx="13" ry="8" fill="#55a630" />
        <ellipse cx="20" cy="-16" rx="13" ry="8" fill="#55a630" />
        <ellipse cx="0" cy="-30" rx="24" ry="19" fill={FROG} />
        <ellipse cx="0" cy="-24" rx="14" ry="11" fill="#d4e09b" />
        <ellipse className="wd-frosch-sac" cx="0" cy="-26" rx="11" ry="8" fill="#e9f5db" />
        <circle cx="-12" cy="-48" r="10" fill={FROG} />
        <circle cx="12" cy="-48" r="10" fill={FROG} />
        <circle cx="-12" cy="-49" r="6.5" fill="#fff" />
        <circle cx="12" cy="-49" r="6.5" fill="#fff" />
        <circle cx="-13" cy="-49" r="3.6" fill="#2b2d42" />
        <circle cx="11" cy="-49" r="3.6" fill="#2b2d42" />
        <circle cx="-12" cy="-50.4" r="1.2" fill="#fff" />
        <circle cx="12" cy="-50.4" r="1.2" fill="#fff" />
        <path d="M-14 -36 Q0 -28 14 -36" stroke="#2b9348" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="-17" cy="-33" r="3.5" fill="#ff8fa3" opacity="0.5" />
        <circle cx="17" cy="-33" r="3.5" fill="#ff8fa3" opacity="0.5" />
        <path className="wd-frosch-tongue" d="M-4 -34 Q-20 -50 -34 -76" stroke="#ff5d73" strokeWidth="4" strokeLinecap="round" fill="none" />
        <Lid cx={-12} cy={-49} r={6.5} fill={FROG} />
        <Lid cx={12} cy={-49} r={6.5} fill={FROG} />
        <Lines x={28} y={-34} size={0.6} />
      </g>
    </>
  );
}

/** Blue dragonfly over the brook, facing right; it darts to and fro with whirring wings. */
export function Libelle() {
  return (
    <g className="wd-libelle-flight">
      <g className="wd-libelle-wings" style={{ transformOrigin: "10px -6px" }}>
        <ellipse cx="-4" cy="-20" rx="26" ry="8" transform="rotate(-14 -4 -20)" fill="#e7f5ff" opacity="0.85" stroke="#a5d8ff" strokeWidth="1.5" />
        <ellipse cx="24" cy="-20" rx="24" ry="8" transform="rotate(14 24 -20)" fill="#e7f5ff" opacity="0.85" stroke="#a5d8ff" strokeWidth="1.5" />
      </g>
      <path d="M-44 -2 Q-10 -8 18 -6" stroke="#1c7ed6" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M-30 -4 v-4 M-18 -5 v-4 M-6 -6 v-4" stroke="#74c0fc" strokeWidth="2" />
      <ellipse cx="22" cy="-6" rx="10" ry="7" fill="#1971c2" />
      <circle cx="36" cy="-8" r="8" fill="#4dabf7" />
      <circle cx="39" cy="-10" r="3" fill={INK} />
      <circle cx="40" cy="-11" r="1" fill="#fff" />
      <g className="wd-libelle-wings wd-wings-back" style={{ transformOrigin: "10px -6px" }}>
        <ellipse cx="-2" cy="-8" rx="22" ry="6" transform="rotate(12 -2 -8)" fill="#e7f5ff" opacity="0.7" stroke="#a5d8ff" strokeWidth="1.5" />
        <ellipse cx="22" cy="-8" rx="20" ry="6" transform="rotate(-12 22 -8)" fill="#e7f5ff" opacity="0.7" stroke="#a5d8ff" strokeWidth="1.5" />
      </g>
    </g>
  );
}
