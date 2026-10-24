import { nth, sparklePath } from "../shared";
import { Blades, Egg } from "./parts";

// The painted eggs the Easter bunny has hidden all over the garden, each in its own spot:
// in the grass, behind the flower pot, in the hole of the willow, under the forsythia,
// and the Easter nest full of eggs. Foot point at (0, 0) of their placement.

function Sparkles({ className, spots, r = 10, fill = "#ffd60a" }: { className: string; spots: number[][]; r?: number; fill?: string }) {
  return (
    <g className={className} fill={fill}>
      {spots.map(([x, y], i) => (
        <path key={i} d={sparklePath(x, y, r)} style={nth(i)} />
      ))}
    </g>
  );
}

/** The red egg in the grass; behind it the ears of a bunny pop up. */
export function Osterei() {
  return (
    <>
      <Blades xs={[-34, -16, 14, 34]} shade="#40916c" />
      <g className="os-ei-ears" style={{ transformOrigin: "52px -30px" }}>
        <ellipse cx="44" cy="-46" rx="7" ry="20" fill="#f1f3f5" transform="rotate(-12 44 -46)" />
        <ellipse cx="44" cy="-46" rx="3.5" ry="14" fill="#ffc6d0" transform="rotate(-12 44 -46)" />
        <ellipse cx="60" cy="-44" rx="7" ry="20" fill="#f1f3f5" transform="rotate(14 60 -44)" />
        <ellipse cx="60" cy="-44" rx="3.5" ry="14" fill="#ffc6d0" transform="rotate(14 60 -44)" />
      </g>
      <g className="os-ei-egg" style={{ transformOrigin: "0px -4px" }}>
        <Egg cx={0} by={-2} w={62} h={78} fill="#ff6b6b" deco="#fff" pattern="zigzag" />
        <circle cx="0" cy="-64" r="4" fill="#ffd60a" />
        <circle cx="-12" cy="-14" r="3.5" fill="#ffd60a" />
        <circle cx="12" cy="-14" r="3.5" fill="#ffd60a" />
      </g>
      <Blades xs={[-28, -8, 6, 24, 42, 56]} shade="#52b788" />
      <Sparkles className="os-ei-spark" spots={[[-44, -86], [40, -96], [-56, -40], [60, -70]]} />
    </>
  );
}

/** The blue egg with white dots, leaning behind the flower pot (drawn before the pot). */
export function BlauesEi() {
  return (
    <>
      <g className="os-blau-egg" style={{ transformOrigin: "-70px -4px" }}>
        <g transform="rotate(-14 -70 -4)">
          <Egg cx={-70} by={-4} w={56} h={72} fill="#4dabf7" deco="#fff" pattern="dots" />
        </g>
      </g>
      <Blades xs={[-100, -86, -54]} shade="#52b788" height={22} />
      <Sparkles className="os-blau-spark" spots={[[-112, -80], [-40, -96], [-120, -30]]} r={9} />
    </>
  );
}

/** The yellow egg sitting in the hole of the hollow willow (coordinates of the willow). */
export function GelbesEi() {
  return (
    <>
      <g className="os-gelb-egg" style={{ transformOrigin: "0px -14px" }}>
        <Egg cx={0} by={-14} w={54} h={68} fill="#ffd43b" deco="#ff922b" pattern="stripes" />
        <circle cx="-10" cy="-46" r="3" fill="#fff" />
        <circle cx="10" cy="-46" r="3" fill="#fff" />
      </g>
      <Sparkles className="os-gelb-spark" spots={[[-50, -96], [50, -90], [-62, -40], [60, -30]]} r={9} fill="#fff3bf" />
    </>
  );
}

/** The green egg under the forsythia; a few yellow twigs hang over it (coordinates of the bush). */
export function GruenesEi() {
  return (
    <>
      <g className="os-gruen-egg" style={{ transformOrigin: "-40px -30px" }}>
        <Egg cx={-40} by={6} w={52} h={66} fill="#69db7c" deco="#ffe066" pattern="waves" />
      </g>
      {/* Twigs of the bush hanging in front of the egg */}
      <g className="os-gruen-twig" style={{ transformOrigin: "-10px -80px" }}>
        <path d="M-10 -80 Q-40 -66 -72 -40" stroke="#a47148" strokeWidth="4" fill="none" strokeLinecap="round" />
        {[
          [-26, -72],
          [-44, -60],
          [-60, -50],
          [-72, -38],
        ].map(([x, y], i) => (
          <g key={i} fill="#ffd43b">
            <ellipse cx={x} cy={y + 6} rx="5" ry="8" />
            <ellipse cx={x - 6} cy={y + 2} rx="7" ry="4" fill="#ffe066" />
          </g>
        ))}
      </g>
      <Blades xs={[-70, -54, -18, -2]} shade="#40916c" height={24} />
      <Sparkles className="os-gruen-spark" spots={[[-86, -60], [6, -50], [-96, -6]]} r={9} />
    </>
  );
}

/** A woven basket with green paper grass, full of painted eggs and a chocolate egg in foil. */
export function Osternest() {
  const eggs: [number, number, number, number, string, string, "zigzag" | "dots" | "stripes" | "waves" | "hearts"][] = [
    [-50, -34, 40, 52, "#b197fc", "#fff", "hearts"],
    [-14, -38, 42, 56, "#ff8fab", "#fff", "dots"],
    [24, -36, 40, 52, "#74c0fc", "#ffe066", "zigzag"],
    [58, -32, 38, 48, "#ffd43b", "#ff6b6b", "stripes"],
  ];
  return (
    <>
      {/* Back of the basket */}
      <ellipse cx="0" cy="-40" rx="92" ry="20" fill="#b07d4f" />
      {/* Paper grass */}
      <g className="os-nest-grass" style={{ transformOrigin: "0px -40px" }}>
        <Blades xs={[-80, -64, -44, -26, -6, 12, 30, 48, 66, 82]} shade="#8ce99a" height={30} />
      </g>
      <g transform="translate(0 -32)">
        <Blades xs={[-70, -50, -30, -10, 10, 30, 50, 70]} shade="#69db7c" height={24} />
      </g>
      {eggs.map(([cx, by, w, h, fill, deco, pattern], i) => (
        <g key={i} className="os-nest-egg" style={{ ...nth(i), transformOrigin: `${cx}px ${by}px` }}>
          <Egg cx={cx} by={by} w={w} h={h} fill={fill} deco={deco} pattern={pattern} />
        </g>
      ))}
      {/* Chocolate egg in shiny red foil */}
      <g className="os-nest-choc" style={{ transformOrigin: "-30px -26px" }}>
        <ellipse cx="-30" cy="-34" rx="16" ry="20" fill="#e03131" transform="rotate(-30 -30 -34)" />
        <path d="M-42 -46 L-34 -36 M-36 -50 L-28 -40" stroke="#ffa8a8" strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Front of the basket, woven */}
      <path d="M-96 -40 Q-92 0 -60 2 H60 Q92 0 96 -40 Q0 -14 -96 -40 Z" fill="#c68b59" />
      <path d="M-92 -26 Q0 -2 92 -26 M-80 -10 Q0 10 80 -10" stroke="#a0673d" strokeWidth="4" fill="none" />
      <path d="M-60 -30 V0 M-30 -22 V2 M0 -20 V2 M30 -22 V2 M60 -30 V0" stroke="#a0673d" strokeWidth="3" />
      <path d="M-96 -40 Q0 -14 96 -40" stroke="#d9a066" strokeWidth="8" strokeLinecap="round" fill="none" />
      <Sparkles className="os-nest-spark" spots={[[-80, -90], [0, -110], [84, -84], [-40, -120]]} r={10} />
    </>
  );
}
