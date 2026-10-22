import { INK, nth } from "../shared";
import { Eyes, SleepyFace, Sparkles, Yawn, Zzz, star } from "./parts";

// What is seen through the window, in picture coordinates: the moon with its nightcap,
// the stars, the fireflies over the hills and the owl on its branch.

/** The round moon in a nightcap; it rocks, yawns and swings its pompom. */
export function Mond() {
  return (
    <>
      <circle className="gn-mond-halo" cx="654" cy="100" r="46" fill="#fff9db" fillOpacity="0.25" />
      <g className="gn-mond" style={{ transformOrigin: "654px 100px" }}>
        <circle cx="654" cy="100" r="34" fill="#ffe066" />
        <circle cx="640" cy="118" r="6" fill="#fcc419" opacity="0.5" />
        <circle cx="672" cy="84" r="4" fill="#fcc419" opacity="0.5" />
        <path d="M630 90 Q636 74 650 70" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
        <SleepyFace cx={656} cy={102} size={1.2} />
        {/* Nightcap */}
        <path d="M624 86 Q636 64 666 66 Q684 58 698 60 Q692 74 686 82 Q656 72 624 86 Z" fill="#5c7cfa" />
        <path d="M624 86 Q656 72 686 82" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
        <g className="gn-mond-pompom" style={{ transformOrigin: "696px 62px" }}>
          <circle cx="700" cy="66" r="7" fill="#fff" />
        </g>
      </g>
      <Zzz x={692} y={120} size={0.8} colour="#fff3bf" />
    </>
  );
}

const STARS = [
  { x: 788, y: 76, r: 22, face: true },
  { x: 740, y: 110, r: 13, face: false },
  { x: 818, y: 130, r: 11, face: false },
];

/** Three stars outside; they twinkle one after another, the big one has a face. */
export function Sterne() {
  return (
    <>
      {STARS.map(({ x, y, r, face }, i) => (
        <g key={x} className="gn-stern" style={{ ...nth(i), transformOrigin: `${x}px ${y}px` }}>
          <path d={star(x, y, r)} fill="#ffe066" stroke="#fcc419" strokeWidth="1.5" strokeLinejoin="round" />
          {face && (
            <>
              <Eyes cx={x} cy={y} gap={5} r={2} />
              <path d={`M${x - 3} ${y + 5} Q${x} ${y + 8} ${x + 3} ${y + 5}`} stroke={INK} strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </>
          )}
          <circle className="gn-on" cx={x - r * 0.25} cy={y - r * 0.3} r={r * 0.15} fill="#fff" />
        </g>
      ))}
      <Sparkles x={780} y={96} spread={46} count={4} colour="#fff" size={0.7} />
    </>
  );
}

const FLIES = [
  { x: 634, y: 214 },
  { x: 678, y: 194 },
  { x: 712, y: 238 },
];

/** Fireflies over the hills; their tails glow and they fly little loops. */
export function Gluehwuermchen() {
  return (
    <>
      {FLIES.map(({ x, y }, i) => (
        <g key={x} className="gn-fly" style={nth(i)}>
          <circle className="gn-on" cx={x + 8} cy={y + 3} r="12" fill="#d8f5a2" fillOpacity="0.45" />
          <ellipse cx={x + 7} cy={y + 3} rx="5" ry="4" fill="#d8f5a2" />
          <ellipse cx={x} cy={y} rx="6" ry="4.5" fill="#495057" />
          <circle cx={x - 6} cy={y - 1} r="3.5" fill="#343a40" />
          <g className="gn-fly-wings" style={{ transformOrigin: `${x}px ${y - 3}px` }}>
            <ellipse cx={x - 2} cy={y - 7} rx="5" ry="3" fill="#e7f5ff" opacity="0.8" transform={`rotate(-25 ${x - 2} ${y - 7})`} />
            <ellipse cx={x + 4} cy={y - 7} rx="5" ry="3" fill="#e7f5ff" opacity="0.8" transform={`rotate(25 ${x + 4} ${y - 7})`} />
          </g>
        </g>
      ))}
    </>
  );
}

/** A brown owl on the branch; it flaps its wings, turns its head and blinks its big eyes. */
export function Eule() {
  return (
    <>
      {[-1, 1].map((s, i) => (
        <g key={s} className="gn-eule-wing" style={{ ...nth(i), transformOrigin: `${796 + s * 16}px 196px` }}>
          <path d={`M${796 + s * 16} 190 Q${796 + s * 32} 206 ${796 + s * 20} 228 Q${796 + s * 12} 214 ${796 + s * 14} 196 Z`} fill="#6d4c41" />
        </g>
      ))}
      <ellipse cx="796" cy="208" rx="21" ry="26" fill="#8d6e63" />
      <ellipse cx="796" cy="214" rx="13" ry="17" fill="#d7ccc8" />
      <path d="M790 206 q3 3 6 0 M796 214 q3 3 6 0 M788 220 q3 3 6 0" stroke="#a1887f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M788 232 v4 M792 232 v4 M800 232 v4 M804 232 v4" stroke="#fab005" strokeWidth="2.5" strokeLinecap="round" />
      <g className="gn-eule-head" style={{ transformOrigin: "796px 196px" }}>
        <path d="M776 172 L780 160 L788 170 Z M816 172 L812 160 L804 170 Z" fill="#6d4c41" />
        <ellipse cx="796" cy="182" rx="22" ry="19" fill="#8d6e63" />
        <circle cx="786" cy="181" r="9" fill="#fff8e1" />
        <circle cx="806" cy="181" r="9" fill="#fff8e1" />
        <Eyes cx={796} cy={181} gap={10} r={4.2} />
        <path d="M792 188 L796 196 L800 188 Z" fill="#fab005" />
        <Yawn cx={796} cy={194} r={4} />
      </g>
      <g className="gn-eule-hoot" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
        <path d="M822 176 q6 6 0 12" style={nth(0)} />
        <path d="M828 170 q10 12 0 24" style={nth(1)} />
      </g>
      <Zzz x={818} y={164} size={0.7} colour="#fff3bf" />
    </>
  );
}
