import { Face, INK, SKIN } from "../shared";

// Children, drawn the same way everywhere on the playground. `cls` names the moving
// parts (`<cls>-head`, `<cls>-arm-l`, `<cls>-arm-r`, `<cls>-legs`) for the scene's CSS.
// The arms hang at the shoulder; `armL`/`armR` turn them (degrees, 0 = down, 180 = up).

export type Hair = "short" | "pigtails" | "bun" | "curls" | "cap";

interface KidLook {
  cls: string;
  shirt: string;
  pants?: string;
  hair?: string;
  style?: Hair;
  armL?: number;
  armR?: number;
}

/** Hair on a head centred at (0, cy) with radius 18. */
function HairDo({ cy, hair, style }: { cy: number; hair: string; style: Hair }) {
  if (style === "cap") {
    return (
      <>
        <path d={`M-19 ${cy - 2} Q-19 ${cy - 24} 0 ${cy - 24} Q19 ${cy - 24} 19 ${cy - 2} Z`} fill={hair} />
        <rect x="-4" y={cy - 8} width="30" height="6" rx="3" fill={hair} />
      </>
    );
  }
  return (
    <>
      {style === "pigtails" &&
        [-21, 21].map((x) => <circle key={x} cx={x} cy={cy - 2} r="7" fill={hair} />)}
      {style === "bun" && <circle cx="0" cy={cy - 22} r="9" fill={hair} />}
      {style === "curls" &&
        [-16, -6, 6, 16].map((x) => <circle key={x} cx={x} cy={cy - 16 + Math.abs(x) * 0.4} r="8" fill={hair} />)}
      <path d={`M-18 ${cy - 2} Q-19 ${cy - 21} 0 ${cy - 20} Q19 ${cy - 21} 18 ${cy - 2} Q8 ${cy - 12} -18 ${cy - 2} Z`} fill={hair} />
    </>
  );
}

function Arm({ cls, side, x, y, angle, shirt, length = 30 }: { cls: string; side: "l" | "r"; x: number; y: number; angle: number; shirt: string; length?: number }) {
  return (
    <g className={`${cls}-arm-${side}`} style={{ transformOrigin: `${x}px ${y}px` }}>
      <g transform={`rotate(${side === "l" ? angle : -angle} ${x} ${y})`}>
        <path d={`M${x} ${y} V${y + length}`} stroke={shirt} strokeWidth="9" strokeLinecap="round" />
        <circle cx={x} cy={y + length + 3} r="5" fill={SKIN} />
      </g>
    </g>
  );
}

/** A standing child, foot point at (0, 0), about 140 tall. */
export function Kid({ cls, shirt, pants = "#3a86ff", hair = "#6b4423", style = "short", armL = 15, armR = 15 }: KidLook) {
  return (
    <>
      <g className={`${cls}-legs`} style={{ transformOrigin: "0px -50px" }}>
        <rect x="-13" y="-52" width="11" height="48" rx="5" fill={pants} />
        <rect x="2" y="-52" width="11" height="48" rx="5" fill={pants} />
        <ellipse cx="-9" cy="-4" rx="9" ry="5" fill={INK} />
        <ellipse cx="9" cy="-4" rx="9" ry="5" fill={INK} />
      </g>
      <Arm cls={cls} side="l" x={-15} y={-88} angle={armL} shirt={shirt} />
      <Arm cls={cls} side="r" x={15} y={-88} angle={armR} shirt={shirt} />
      <path d="M-18 -46 L-15 -90 Q0 -98 15 -90 L18 -46 Z" fill={shirt} />
      <path d="M-18 -50 H18 V-46 H-18 Z" fill="#000" opacity="0.08" />
      <g className={`${cls}-head`} style={{ transformOrigin: "0px -98px" }}>
        <circle cx="0" cy="-114" r="18" fill={SKIN} />
        <HairDo cy={-114} hair={hair} style={style} />
        <Face cx={0} cy={-112} size={0.64} />
      </g>
    </>
  );
}

/** A sitting child seen from the side, facing right; its seat is at (0, 0). */
export function SitKid({ cls, shirt, pants = "#3a86ff", hair = "#6b4423", style = "short", armL = 60, armR = 60, straight = false }: KidLook & { straight?: boolean }) {
  return (
    <>
      <g className={`${cls}-legs`} style={{ transformOrigin: "6px -4px" }}>
        <path d={straight ? "M-4 -5 H40" : "M-4 -5 H24 L26 20"} stroke={pants} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {straight ? <ellipse cx="46" cy="-9" rx="5" ry="9" fill={INK} /> : <ellipse cx="30" cy="22" rx="9" ry="5" fill={INK} />}
      </g>
      <Arm cls={cls} side="l" x={-4} y={-38} angle={-armL} shirt={shirt} length={24} />
      <rect x="-16" y="-46" width="28" height="44" rx="11" fill={shirt} />
      <Arm cls={cls} side="r" x={4} y={-38} angle={armR} shirt={shirt} length={24} />
      <g className={`${cls}-head`} style={{ transformOrigin: "0px -46px" }}>
        <circle cx="0" cy="-62" r="17" fill={SKIN} />
        <HairDo cy={-62} hair={hair} style={style} />
        <Face cx={4} cy={-60} size={0.6} />
      </g>
    </>
  );
}
