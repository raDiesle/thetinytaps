import { CHEEK, Eye, nth, side } from "../shared";
import type { Placement, SceneItem } from "../types";
import { LEAF_COLOURS, Leaf } from "../weather";
import "./kuerbis.css";

// The pumpkin with a mouse behind it, from the former autumn extras. It stands on its foot point (0, 0).

const PILE = [
  [-92, -6, 20, 0],
  [-74, -3, -40, 3],
  [-104, -2, 70, 1],
  [-60, -8, 110, 4],
  [-84, -12, -10, 2],
  [76, -4, 30, 1],
  [96, -3, -60, 3],
];

export function Kuerbis() {
  return (
    <>
      {/* A mouse lives behind the pumpkin and peeks out when it hops. */}
      <g className="he-kuerbis-mouse">
        <circle cx="42" cy="-80" r="9" fill="#adb5bd" />
        <circle cx="42" cy="-80" r="5" fill="#ffc6d0" />
        <circle cx="64" cy="-80" r="9" fill="#adb5bd" />
        <circle cx="64" cy="-80" r="5" fill="#ffc6d0" />
        <ellipse cx="53" cy="-66" rx="16" ry="14" fill="#ced4da" />
        <Eye cx={47} cy={-68} r={2.6} />
        <Eye cx={59} cy={-68} r={2.6} />
        <circle cx="53" cy="-60" r="3" fill={CHEEK} />
      </g>
      <g className="he-kuerbis-body" style={{ transformOrigin: "0px 0px" }}>
        <path className="he-kuerbis-vine" d="M8 -92 C24 -110 44 -100 38 -88 C33 -80 24 -88 32 -94" stroke="#52b788" strokeWidth="3.5" strokeLinecap="round" fill="none" style={{ transformOrigin: "8px -92px" }} />
        <ellipse cx="0" cy="-48" rx="64" ry="48" fill="#f77f00" />
        <ellipse cx="-34" cy="-48" rx="30" ry="46" fill="#f8961e" />
        <ellipse cx="34" cy="-48" rx="30" ry="46" fill="#f3722c" />
        <ellipse cx="0" cy="-48" rx="26" ry="48" fill="#fb8b24" />
        <path d="M-14 -94 Q-20 -48 -14 -2 M14 -94 Q20 -48 14 -2" stroke="#d9620f" strokeWidth="2.5" fill="none" opacity="0.6" />
        <path d="M-50 -76 Q-56 -60 -54 -44" stroke="#fff" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M-6 -92 Q-4 -108 6 -114 L12 -110 Q6 -104 6 -92 Z" fill="#6b4423" />
        <path className="he-kuerbis-leafy" d="M4 -100 C-14 -116 -34 -108 -36 -96 C-20 -94 -8 -96 4 -100 Z" fill="#40916c" style={{ transformOrigin: "4px -100px" }} />
      </g>
      <g className="he-kuerbis-pile">
        {PILE.map(([x, y, angle, c], i) => (
          <g key={i} className="he-kuerbis-leaf" style={{ ...nth(i), ...side(x < 0 ? -1 : 1) }}>
            <Leaf x={x} y={y} angle={angle} scale={1.6} colour={LEAF_COLOURS[c]} />
          </g>
        ))}
      </g>
    </>
  );
}

export function kuerbis(place: Placement): SceneItem {
  return {
    id: "kuerbis",
    name: "der Kürbis",
    sentences: ["Der Kürbis hüpft! Raschel, raschel!", "Der Kürbis ist dick und rund.", "Hinter dem Kürbis wohnt eine Maus."],
    sound: "boing",
    box: [-110, -116, 220, 116],
    hitAreas: [[-64, -112, 128, 112]],
    place,
    shadow: [0, 0, 66],
    durationMs: 2000,
    Art: Kuerbis,
  };
}
