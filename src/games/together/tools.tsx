// The helpers' tools that have no emoji, or only one too new for older phones (🛟 and 🛞 came in 2021), drawn in the
// partners' 100 × 100 box in the picture book's plum-brown line: big and plain, so each is known at the size of a
// choice. Used by the scene files (`partner.draw`).

const OUT = "#5a4636";
const line = { stroke: OUT, strokeWidth: 3, strokeLinejoin: "round" as const };

/** A yellow digger on its tracks, its arm reaching up and the bucket hanging down at the front. */
export const digger = (
  <g {...line}>
    <path d="M60 58 L76 22 L92 40" fill="none" stroke={OUT} strokeWidth="13" strokeLinecap="round" />
    <path d="M60 58 L76 22 L92 40" fill="none" stroke="#fcc419" strokeWidth="7" strokeLinecap="round" />
    <path d="M84 42 H100 L98 60 Q90 68 82 58 Z" fill="#868e96" />
    <rect x="6" y="74" width="64" height="18" rx="9" fill="#495057" />
    {[16, 30, 44, 58].map((x) => (
      <circle key={x} cx={x} cy="83" r="4.5" fill="#adb5bd" strokeWidth="2" />
    ))}
    <rect x="8" y="52" width="60" height="24" rx="4" fill="#fcc419" />
    <path d="M12 52 V28 Q12 24 16 24 H40 Q44 24 44 28 V52 Z" fill="#fcc419" />
    <rect x="17" y="29" width="22" height="18" rx="2" fill="#d0ebff" strokeWidth="2.4" />
    <path d="M50 60 H64" stroke={OUT} strokeWidth="2" opacity="0.5" />
  </g>
);

/** A paint roller: the fluffy roller wet with light blue, its bent wire and a red handle. */
export const paintRoller = (
  <g {...line} transform="rotate(-12 50 50)">
    <path d="M78 26 H86 V52 H52 V62" fill="none" stroke={OUT} strokeWidth="6" strokeLinecap="round" />
    <path d="M78 26 H86 V52 H52 V62" fill="none" stroke="#ced4da" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="12" y="12" width="68" height="28" rx="10" fill="#74c0fc" />
    <path d="M22 18 V34 M34 18 V34 M46 18 V34 M58 18 V34 M70 18 V34" stroke="#4dabf7" strokeWidth="2.5" />
    <rect x="45" y="60" width="14" height="36" rx="6" fill="#e03131" />
  </g>
);

/** A pair of orange swimming armbands. */
export const armbands = (
  <g {...line}>
    {[
      [30, -8],
      [70, 8],
    ].map(([x, turn]) => (
      <g key={x} transform={`rotate(${turn} ${x} 50)`}>
        <rect x={x - 18} y="18" width="36" height="64" rx="17" fill="#ff922b" />
        <path d={`M${x - 18} 50 H${x + 18}`} stroke={OUT} strokeWidth="2" opacity="0.5" />
        <ellipse cx={x} cy="22" rx="10" ry="4" fill="#fff4e6" strokeWidth="2" />
        <path d={`M${x - 10} 30 Q${x - 12} 42 ${x - 9} 46`} stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <rect x={x + 6} y="58" width="5" height="8" rx="2" fill="#fff" strokeWidth="1.8" />
      </g>
    ))}
  </g>
);

/** A barbell: a long bar with big round weights at both ends. */
export const barbell = (
  <g {...line}>
    <rect x="4" y="46" width="92" height="8" rx="4" fill="#adb5bd" />
    {[
      [12, "#e03131"],
      [22, "#212529"],
      [78, "#212529"],
      [88, "#e03131"],
    ].map(([x, fill]) => (
      <rect key={x} x={(x as number) - 5} y="22" width="10" height="56" rx="4" fill={fill as string} />
    ))}
    <path d="M18 30 V40 M84 30 V40" stroke="#fff" strokeWidth="2" opacity="0.5" />
  </g>
);

/** A surfboard standing askew, with a stripe along it and its fin. */
export const surfboard = (
  <g {...line} transform="rotate(34 50 50)">
    <path d="M62 82 L70 92 L60 92 Z" fill="#1c7ed6" />
    <path d="M50 2 C66 18 68 56 62 86 Q50 96 38 86 C32 56 34 18 50 2 Z" fill="#ffd43b" />
    <path d="M50 8 C58 26 58 60 50 92" stroke="#ff6b6b" strokeWidth="6" fill="none" />
  </g>
);

/** A hot-air balloon in red and yellow stripes, with its basket hanging below. */
export const hotAirBalloon = (
  <g {...line}>
    <path d="M38 66 L42 80 M62 66 L58 80" stroke={OUT} strokeWidth="2" />
    <path d="M50 4 C76 4 88 24 84 42 C80 56 66 64 62 68 H38 C34 64 20 56 16 42 C12 24 24 4 50 4 Z" fill="#ffd43b" />
    <path d="M50 4 C40 14 36 40 42 68 H58 C64 40 60 14 50 4 Z" fill="#e03131" />
    <path d="M30 10 C18 24 18 46 30 62 L36 66 C26 48 24 26 30 10 Z M70 10 C82 24 82 46 70 62 L64 66 C74 48 76 26 70 10 Z" fill="#e03131" />
    <rect x="38" y="78" width="24" height="16" rx="3" fill="#c08552" />
    <path d="M38 86 H62 M46 78 V94 M54 78 V94" stroke={OUT} strokeWidth="1.5" opacity="0.5" />
  </g>
);

/** An orange rubbish lorry: the cab at the left, the round tank behind with its stripes, and its wheels. */
export const binLorry = (
  <g {...line}>
    <path d="M38 30 H88 Q96 30 96 40 V76 H38 Z" fill="#fd7e14" />
    <path d="M52 32 V76 M70 32 V76 M84 32 V76" stroke="#ffd8a8" strokeWidth="4" />
    <path d="M4 76 V52 L12 36 H38 V76 Z" fill="#fd7e14" />
    <path d="M12 52 L17 40 H32 V52 Z" fill="#d0ebff" strokeWidth="2.4" />
    <rect x="2" y="70" width="96" height="10" rx="3" fill="#868e96" />
    {[20, 62, 82].map((x) => (
      <g key={x}>
        <circle cx={x} cy="82" r="10" fill="#343a40" />
        <circle cx={x} cy="82" r="4" fill="#adb5bd" strokeWidth="2" />
      </g>
    ))}
  </g>
);

/** A red vacuum cleaner on its wheels, its hose curving up and over to the long tube and the nozzle on the floor. */
export const vacuum = (
  <g {...line}>
    <path d="M30 56 C30 20 70 10 76 30 L84 78" fill="none" stroke={OUT} strokeWidth="11" strokeLinecap="round" />
    <path d="M30 56 C30 20 70 10 76 30" fill="none" stroke="#868e96" strokeWidth="6" strokeLinecap="round" />
    <path d="M76 30 L84 78" stroke="#ced4da" strokeWidth="5" strokeLinecap="round" />
    <path d="M70 80 H96 Q98 88 92 90 H70 Q66 86 70 80 Z" fill="#495057" />
    <path d="M6 82 C4 60 14 50 30 50 C46 50 56 60 54 82 Z" fill="#e03131" />
    <path d="M14 62 Q22 56 30 56" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
    <circle cx="16" cy="84" r="6" fill="#343a40" />
    <circle cx="44" cy="84" r="6" fill="#343a40" />
  </g>
);

/** A wooden recorder held askew: the beak at the top, the holes down its front. */
export const recorder = (
  <g {...line} transform="rotate(-38 50 50)">
    <path d="M44 8 Q50 2 56 8 L56 22 H44 Z" fill="#b5835a" />
    <rect x="44" y="20" width="12" height="62" rx="4" fill="#e9c08f" />
    <path d="M42 82 H58 L60 96 H40 Z" fill="#b5835a" />
    <rect x="47" y="12" width="6" height="4" rx="1" fill={OUT} stroke="none" />
    {[34, 44, 54, 64, 74].map((y) => (
      <circle key={y} cx="50" cy={y} r="2.6" fill={OUT} stroke="none" />
    ))}
  </g>
);

/** A straw beehive (a skep): golden rings stacked into a dome, the little door at the bottom. */
export const beehive = (
  <g {...line}>
    <path d="M12 86 C10 40 28 10 50 10 C72 10 90 40 88 86 Z" fill="#f2c45a" />
    {[26, 40, 54, 68].map((y) => (
      <path key={y} d={`M${y < 30 ? 30 : 16} ${y} Q50 ${y + 8} ${y < 30 ? 70 : 84} ${y}`} stroke="#c99a2e" strokeWidth="3" fill="none" />
    ))}
    <path d="M42 86 Q42 74 50 74 Q58 74 58 86 Z" fill="#5c3d2e" />
    <rect x="4" y="84" width="92" height="10" rx="3" fill="#c08552" />
  </g>
);
