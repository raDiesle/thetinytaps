import { nth } from "../shared";
import type { Placement, SceneItem } from "../types";
import "./osterei.css";

// The hidden egg with the bunny's ears behind it, from the former Easter extra. It stands on its foot point (0, 0).

const EGG = "M0 -78 C24 -78 32 -42 30 -28 C28 -10 15 -2 0 -2 C-15 -2 -28 -10 -30 -28 C-32 -42 -24 -78 0 -78 Z";

function Blades({ xs, shade }: { xs: number[]; shade: string }) {
  return (
    <>
      {xs.map((x, i) => (
        <path key={x} d={`M${x - 6} 0 Q${x - 2} ${-24 - (i % 3) * 8} ${x + (i % 2 ? 8 : -6)} ${-36 - (i % 3) * 8} Q${x + 2} -18 ${x + 6} 0 Z`} fill={shade} />
      ))}
    </>
  );
}

export function Osterei() {
  return (
    <>
      <Blades xs={[-34, -16, 14, 34]} shade="#40916c" />
      {/* The Easter bunny is hiding behind the grass and wiggles its ears. */}
      <g className="os-ei-ears" style={{ transformOrigin: "52px -30px" }}>
        <ellipse cx="44" cy="-46" rx="7" ry="20" fill="#f1f3f5" transform="rotate(-12 44 -46)" />
        <ellipse cx="44" cy="-46" rx="3.5" ry="14" fill="#ffc6d0" transform="rotate(-12 44 -46)" />
        <ellipse cx="60" cy="-44" rx="7" ry="20" fill="#f1f3f5" transform="rotate(14 60 -44)" />
        <ellipse cx="60" cy="-44" rx="3.5" ry="14" fill="#ffc6d0" transform="rotate(14 60 -44)" />
      </g>
      <g className="os-ei-egg" style={{ transformOrigin: "0px -4px" }}>
        <path d={EGG} fill="#ffadad" />
        <path d="M-29 -40 L-20 -48 L-10 -40 L0 -48 L10 -40 L20 -48 L29 -40" stroke="#fff" strokeWidth="5" strokeLinejoin="round" fill="none" />
        <path d="M-30 -28 H30" stroke="#a0c4ff" strokeWidth="6" />
        {[
          [-10, -62],
          [10, -62],
          [0, -70],
          [-14, -14],
          [14, -14],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill={i < 3 ? "#ffd60a" : "#caffbf"} />
        ))}
        <path d="M-16 -68 Q-22 -58 -22 -48" stroke="#fff" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>
      <Blades xs={[-28, -8, 6, 24, 42, 56]} shade="#52b788" />
      <g className="os-ei-sparkles" fill="#ffd60a">
        {[
          [-44, -86],
          [40, -96],
          [-56, -40],
          [60, -70],
        ].map(([x, y], i) => (
          <path key={i} className="os-ei-spark" d={`M${x} ${y - 10} Q${x} ${y} ${x + 10} ${y} Q${x} ${y} ${x} ${y + 10} Q${x} ${y} ${x - 10} ${y} Q${x} ${y} ${x} ${y - 10} Z`} style={nth(i)} />
        ))}
      </g>
    </>
  );
}

export function osterei(place: Placement): SceneItem {
  return {
    id: "osterei",
    name: "das Osterei",
    sentences: ["Da ist ein Osterei versteckt!", "Das Osterei ist bunt.", "Der Osterhase hat es versteckt."],
    sound: "pop",
    traits: ["small"],
    box: [-44, -80, 108, 80],
    hitAreas: [[-60, -96, 130, 100]],
    place,
    durationMs: 2000,
    Art: Osterei,
  };
}
