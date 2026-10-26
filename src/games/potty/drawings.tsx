import type { Animal } from "./content";

// The bathroom and who is in it, all front views drawn in world units: the
// floor is at y = 600, and every thing is drawn with its own bottom centre at
// (0, 0), so PottyPlay places it with one translate. The moving parts carry
// classes that potty.css turns, slides and shows step by step.

/** Where the floor begins, in world units. */
export const FLOOR_Y = 600;

const INK = "#4a3a32";

/** Wall, tiles, floor and door; far wider and taller than the room, so a wide screen never sees an edge. */
export function Bathroom() {
  return (
    <g>
      <defs>
        <pattern id="pt-tiles" width="60" height="60" patternUnits="userSpaceOnUse" x="0" y="330">
          <rect width="60" height="60" fill="#d6eef8" />
          <path d="M0 0.5 H60 M0.5 0 V60" stroke="#b5dcef" strokeWidth="3" />
        </pattern>
        <pattern id="pt-planks" width="240" height="40" patternUnits="userSpaceOnUse" x="0" y={FLOOR_Y}>
          <rect width="240" height="40" fill="#e9c896" />
          <path d="M0 39 H240 M120 0 V40" stroke="#d4ae78" strokeWidth="3" />
        </pattern>
      </defs>
      <rect x={-3000} y={-3000} width={8000} height={3330} fill="#fdf1dc" />
      <rect x={-3000} y={330} width={8000} height={FLOOR_Y - 330} fill="url(#pt-tiles)" />
      <rect x={-3000} y={FLOOR_Y - 8} width={8000} height={10} fill="#c9e3f0" />
      <rect x={-3000} y={FLOOR_Y} width={8000} height={3000} fill="url(#pt-planks)" />
      {/* The door the animal comes in by. */}
      <g transform={`translate(110 ${FLOOR_Y})`}>
        <rect x={-95} y={-372} width={190} height={372} rx={10} fill="#c98b5a" stroke={INK} strokeWidth={4} />
        <rect x={-70} y={-340} width={140} height={130} rx={8} fill="#d9a070" />
        <rect x={-70} y={-180} width={140} height={150} rx={8} fill="#d9a070" />
        <circle cx={66} cy={-190} r={11} fill="#ffd166" stroke={INK} strokeWidth={3} />
      </g>
      {/* A towel on a hook next to the sink, and a round window above. */}
      <g transform="translate(1370 330)">
        <circle cx={0} cy={-12} r={8} fill="#9aa5b1" />
        <path d="M-40 -6 H40 V110 Q0 124 -40 110 Z" fill="#ff9fb2" stroke={INK} strokeWidth={4} />
        <path d="M-40 84 H40" stroke="#fff" strokeWidth={8} />
      </g>
      <g transform="translate(1040 170)">
        <circle r={62} fill="#bfe6ff" stroke={INK} strokeWidth={5} />
        <path d="M-62 0 H62 M0 -62 V62" stroke={INK} strokeWidth={5} />
        <circle cx={-24} cy={-26} r={12} fill="#fff" opacity={0.7} />
      </g>
      {/* A bath mat in front of the sink. */}
      <ellipse cx={1170} cy={FLOOR_Y + 30} rx={130} ry={22} fill="#9ad0a8" />
    </g>
  );
}

/** The potty, pale blue, with the pee inside that shows after the trickle. */
export function Potty() {
  return (
    <g className="pt-potty">
      <path d="M-40 -74 V-120 Q-40 -134 -26 -134 H26 Q40 -134 40 -120 V-74 Z" fill="#7cc3e8" stroke={INK} strokeWidth={4} />
      <path d="M-62 -72 Q-58 -8 -38 0 H38 Q58 -8 62 -72 Z" fill="#9fd8f5" stroke={INK} strokeWidth={4} />
      <path d="M-44 -40 Q0 -28 44 -40" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      <ellipse cx={0} cy={-73} rx={66} ry={16} fill="#c4e9fb" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={-72} rx={50} ry={10} fill="#6cb8de" />
      <ellipse className="pt-pee" cx={0} cy={-71} rx={42} ry={7} fill="#ffe066" />
    </g>
  );
}

/** The middle of the potty's front, drawn over the animal while it sits, so the potty shows between its knees. */
export function PottyFront() {
  return (
    <g className="pt-potty-front">
      <path d="M-30 -64 Q-32 -8 -22 0 H22 Q32 -8 30 -64 Q0 -56 -30 -64 Z" fill="#9fd8f5" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-18 -36 Q0 -30 18 -36" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}

/** The toilet: tank with the flush button on top, seat and the water that swirls when it flushes. */
export function Toilet() {
  return (
    <g>
      <rect x={-58} y={-262} width={116} height={100} rx={12} fill="#fff" stroke={INK} strokeWidth={4} />
      <g className="pt-flush-button">
        <ellipse cx={0} cy={-264} rx={20} ry={7} fill="#cfd8dc" stroke={INK} strokeWidth={3} />
      </g>
      {/* A rubber duck waits on the tank. */}
      <g transform="translate(-28 -262)">
        <ellipse cx={0} cy={-12} rx={16} ry={12} fill="#ffd23f" stroke={INK} strokeWidth={2.5} />
        <circle cx={10} cy={-26} r={9} fill="#ffd23f" stroke={INK} strokeWidth={2.5} />
        <path d="M18 -26 L26 -23 L18 -20 Z" fill="#ff8c42" />
        <circle cx={12} cy={-28} r={2} fill={INK} />
      </g>
      <path d="M-36 0 Q-30 -40 -48 -70 H48 Q30 -40 36 0 Z" fill="#fff" stroke={INK} strokeWidth={4} />
      <path d="M-74 -150 Q-70 -78 0 -70 Q70 -78 74 -150 Z" fill="#fff" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={-150} rx={76} ry={20} fill="#f4f7f9" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={-149} rx={56} ry={12} fill="#9ad8f5" />
      <g className="pt-swirl">
        <path d="M0 -149 m-40 0 a40 9 0 1 1 40 6 a26 6 0 1 0 -18 -6 a12 3 0 1 1 12 2" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      </g>
      <g className="pt-pour">
        <ellipse cx={-10} cy={-152} rx={12} ry={5} fill="#ffe066" />
        <circle cx={14} cy={-166} r={5} fill="#9ad8f5" />
        <circle cx={-26} cy={-170} r={4} fill="#9ad8f5" />
      </g>
    </g>
  );
}

/** The sink at child height, its tap and soap, the mirror above; water and foam show while washing. */
export function Sink() {
  return (
    <g>
      <rect x={-100} y={-430} width={200} height={170} rx={30} fill="#e6f6ff" stroke={INK} strokeWidth={5} />
      <path d="M-60 -400 L-20 -440 M-30 -390 L10 -430" stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      <rect x={-22} y={-170} width={44} height={170} rx={12} fill="#fff" stroke={INK} strokeWidth={4} />
      <path d="M-92 -196 H92 Q86 -150 0 -146 Q-86 -150 -92 -196 Z" fill="#fff" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={-196} rx={92} ry={14} fill="#f4f7f9" stroke={INK} strokeWidth={4} />
      <path d="M44 -200 V-238 H4 V-224" fill="none" stroke="#9aa5b1" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={44} cy={-244} r={9} fill="#e05a5a" stroke={INK} strokeWidth={3} />
      <rect className="pt-water" x={-2} y={-218} width={12} height={34} rx={6} fill="#8fd3f4" />
      {/* Soap in a pump bottle. */}
      <g transform="translate(-62 -206)">
        <rect x={-16} y={-44} width={32} height={44} rx={8} fill="#ff9fcf" stroke={INK} strokeWidth={3} />
        <path d="M0 -44 V-56 H14" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g className="pt-foam">
        {[
          [-10, -220, 16],
          [12, -214, 12],
          [-32, -206, 12],
          [-18, -236, 10],
          [4, -238, 9],
          [-40, -228, 8],
        ].map(([x, y, r], i) => (
          <circle key={i} className="pt-bubble" cx={x} cy={y} r={r} fill="#fff" stroke="#9ad8f5" strokeWidth={3} style={{ animationDelay: `${i * 70}ms` }} />
        ))}
      </g>
    </g>
  );
}

/** The toilet paper roll on the wall; a strip unrolls and a piece is torn off. */
export function PaperRoll() {
  return (
    <g>
      <path d="M-34 -30 V0 H34 V-30" fill="none" stroke="#9aa5b1" strokeWidth={8} strokeLinecap="round" />
      <rect className="pt-strip" x={-20} y={0} width={40} height={70} fill="#fff" stroke="#c9d3da" strokeWidth={2} />
      <circle cx={0} cy={0} r={26} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={0} cy={0} r={9} fill="#d9b48f" />
      <rect className="pt-piece" x={-20} y={70} width={40} height={36} fill="#fff" stroke="#c9d3da" strokeWidth={2} />
    </g>
  );
}

function Ears({ animal }: { animal: Animal }) {
  const fill = { fill: animal.fur, stroke: animal.dark, strokeWidth: 4 };
  if (animal.ears === "pointy")
    return (
      <>
        {[-1, 1].map((side) => (
          <g key={side} transform={`scale(${side} 1)`}>
            <path d="M-64 -262 L-52 -338 L-14 -296 Z" {...fill} strokeLinejoin="round" />
            <path d="M-54 -276 L-48 -318 L-28 -294 Z" fill={animal.dark} opacity={0.7} />
          </g>
        ))}
      </>
    );
  if (animal.ears === "round")
    return (
      <>
        {[-1, 1].map((side) => (
          <g key={side}>
            <circle cx={side * 50} cy={-288} r={24} {...fill} />
            <circle cx={side * 50} cy={-288} r={12} fill={animal.light} />
          </g>
        ))}
      </>
    );
  return (
    <>
      {[-1, 1].map((side) => (
        <g key={side} transform={`rotate(${side * 10} ${side * 26} -290)`}>
          <ellipse cx={side * 26} cy={-336} rx={18} ry={54} {...fill} />
          <ellipse cx={side * 26} cy={-332} rx={8} ry={40} fill="#ffb3c7" />
        </g>
      ))}
    </>
  );
}

function Tail({ animal }: { animal: Animal }) {
  if (animal.tail === "bushy")
    return (
      <g transform="rotate(-35 70 -110)">
        <ellipse cx={86} cy={-110} rx={58} ry={24} fill={animal.fur} stroke={animal.dark} strokeWidth={4} />
        <ellipse cx={128} cy={-110} rx={20} ry={17} fill={animal.light} />
      </g>
    );
  if (animal.tail === "stub") return <circle cx={52} cy={-84} r={15} fill={animal.fur} stroke={animal.dark} strokeWidth={4} />;
  return <circle cx={54} cy={-86} r={19} fill={animal.light} stroke={animal.dark} strokeWidth={3} />;
}

/**
 * The animal that goes to the potty, front view, feet at (0, 0), about 340 high.
 * potty.css moves its parts: `.pt-upper` sinks when it sits, `.pt-leg` spread,
 * `.pt-pantleg` and `.pt-pants-hip` slide down, `.pt-arm` reach and wave,
 * `.pt-eyes-happy` replaces `.pt-eyes-open`.
 */
export function AnimalDrawing({ animal }: { animal: Animal }) {
  return (
    <g className="pt-animal">
      <Tail animal={animal} />
      {[-1, 1].map((side) => (
        <g key={side} className={`pt-leg ${side < 0 ? "left" : "right"}`}>
          <rect x={side * 24 - 16} y={-84} width={32} height={80} rx={14} fill={animal.fur} stroke={animal.dark} strokeWidth={4} />
          <ellipse cx={side * 28} cy={-6} rx={24} ry={11} fill={animal.dark} />
          <g className="pt-pantleg">
            <rect x={side * 24 - 20} y={-90} width={40} height={68} rx={8} fill={animal.pants} stroke={INK} strokeWidth={4} />
          </g>
        </g>
      ))}
      <g className="pt-upper">
        <ellipse cx={0} cy={-132} rx={56} ry={64} fill={animal.fur} stroke={animal.dark} strokeWidth={4} />
        <ellipse cx={0} cy={-128} rx={34} ry={44} fill={animal.light} />
        <g className="pt-pants-hip">
          <path d="M-56 -112 H56 Q60 -84 44 -70 H-44 Q-60 -84 -56 -112 Z" fill={animal.pants} stroke={INK} strokeWidth={4} />
          <path d="M-52 -104 H52" stroke="#fff" strokeWidth={4} opacity={0.5} />
        </g>
        {[-1, 1].map((side) => (
          <g key={side} transform={`translate(${side * 48} -170)`}>
            <g className={`pt-arm ${side < 0 ? "left" : "right"}`}>
              <rect x={-11} y={-4} width={22} height={70} rx={11} fill={animal.fur} stroke={animal.dark} strokeWidth={4} />
              <circle cx={0} cy={66} r={14} fill={animal.light} stroke={animal.dark} strokeWidth={3} />
            </g>
          </g>
        ))}
        <g className="pt-head">
          <Ears animal={animal} />
          <circle cx={0} cy={-238} r={68} fill={animal.fur} stroke={animal.dark} strokeWidth={4} />
          {animal.id === "fox" && <path d="M-66 -226 Q-40 -186 0 -188 Q40 -186 66 -226 Q50 -170 0 -168 Q-50 -170 -66 -226 Z" fill={animal.light} />}
          <ellipse cx={0} cy={-200} rx={36} ry={26} fill={animal.light} />
          <circle cx={-44} cy={-210} r={10} fill="#ff8fa3" opacity={0.5} />
          <circle cx={44} cy={-210} r={10} fill="#ff8fa3" opacity={0.5} />
          <g className="pt-eyes-open">
            {[-1, 1].map((side) => (
              <g key={side}>
                <circle cx={side * 25} cy={-246} r={12} fill="#2b2b2b" />
                <circle cx={side * 25 + 4} cy={-251} r={4.5} fill="#fff" />
              </g>
            ))}
          </g>
          <g className="pt-eyes-happy">
            {[-1, 1].map((side) => (
              <path
                key={side}
                d={`M${side * 25 - 11} -244 Q${side * 25} -258 ${side * 25 + 11} -244`}
                fill="none"
                stroke="#2b2b2b"
                strokeWidth={5}
                strokeLinecap="round"
              />
            ))}
          </g>
          <ellipse cx={0} cy={-212} rx={11} ry={8} fill={animal.dark} />
          <path d="M-13 -196 Q0 -184 13 -196" fill="none" stroke={animal.dark} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** A thought cloud with a little potty in it: the animal has to go. */
export function ThoughtBubble() {
  return (
    <g className="pt-thought">
      <circle cx={70} cy={-300} r={9} fill="#fff" stroke={INK} strokeWidth={3} />
      <circle cx={94} cy={-330} r={14} fill="#fff" stroke={INK} strokeWidth={3} />
      <ellipse cx={160} cy={-400} rx={78} ry={62} fill="#fff" stroke={INK} strokeWidth={4} />
      <g transform="translate(160 -358) scale(0.75)">
        <Potty />
      </g>
    </g>
  );
}

/** Drops that hop up beside the potty while it trickles. */
export function Drops() {
  return (
    <g className="pt-drops">
      {[
        [-80, -40],
        [80, -50],
        [-96, -70],
        [96, -30],
      ].map(([x, y], i) => (
        <path
          key={i}
          className="pt-drop"
          d={`M${x} ${y - 22} Q${x + 14} ${y} ${x} ${y + 10} Q${x - 14} ${y} ${x} ${y - 22} Z`}
          fill="#8fd3f4"
          style={{ animationDelay: `${i * 240}ms` }}
        />
      ))}
    </g>
  );
}
