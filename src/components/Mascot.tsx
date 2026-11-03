// The app's two mascots as one small drawing, for every game that wants a fox or a bear standing by: the grown-up and
// the child are the same figure, the child smaller and with a scarf. It is drawn once in a pose and never again per
// frame; what moves is the HTML layer round it (a hop), never a part inside its svg, which a phone would paint anew.

const INK = "#3b2a20";

/** Which of the app's two mascots. */
export type MascotKind = "fox" | "bear";

/** How the arms are: both down, the right one raised to wave, or both up in a cheer. */
export type MascotPose = "stand" | "wave" | "cheer";

/**
 * A fox or a bear standing and facing us, 200 × 300, feet at the bottom. Standing, its right arm (`.mascot-arm`,
 * turning at the shoulder) may be waved by the Timer, whose figures are small; elsewhere the pose is drawn still.
 */
export function Mascot({ kind, child = false, pose = "stand" }: { kind: MascotKind; child?: boolean; pose?: MascotPose }) {
  const fox = kind === "fox";
  const fur = fox ? "#f08c3a" : "#a0663a";
  const light = fox ? "#fff8ef" : "#e3b98a";
  const dark = fox ? "#7a3510" : "#6b3f1d";
  return (
    <svg viewBox="0 0 200 300">
      {fox && <path d="M140 250 C200 250 200 170 172 150 C186 190 168 228 136 226 Z" fill={fur} stroke={INK} strokeWidth="4" strokeLinejoin="round" />}
      {fox && <path d="M172 150 C186 172 184 196 176 210 C170 196 168 172 172 150 Z" fill="#fff" />}
      <ellipse cx="78" cy="286" rx="22" ry="13" fill={dark} stroke={INK} strokeWidth="4" />
      <ellipse cx="122" cy="286" rx="22" ry="13" fill={dark} stroke={INK} strokeWidth="4" />
      <ellipse cx="100" cy="212" rx="56" ry="72" fill={fur} stroke={INK} strokeWidth="5" />
      <ellipse cx="100" cy="224" rx="33" ry="48" fill={light} />
      {child && <path d="M64 160 Q100 182 136 160 L132 176 Q100 196 68 176 Z" fill={kind === "fox" ? "#4dabf7" : "#ffd43b"} stroke={INK} strokeWidth="3" />}
      {/* The left arm as we see it hangs (or cheers); the right one hangs, waves or cheers. */}
      <Arm d={pose === "cheer" ? "M56 178 Q30 150 28 112" : "M56 178 Q40 210 46 240"} fur={fur} />
      {pose === "stand" ? (
        <g className="mascot-arm">
          <Arm d="M144 178 Q160 210 154 240" fur={fur} />
        </g>
      ) : (
        <Arm d="M144 178 Q170 150 172 112" fur={fur} />
      )}
      <g transform="translate(40 40) scale(1.2)">
        {fox ? (
          <>
            <path d="M17 50 L21 9 L45 29 Z M83 50 L79 9 L55 29 Z" fill={fur} stroke={INK} strokeWidth="3.4" strokeLinejoin="round" />
            <path d="M24 39 L26 18 L38 30 Z M76 39 L74 18 L62 30 Z" fill={INK} />
            <path d="M13 52 C13 31 31 24 50 24 C69 24 87 31 87 52 C87 72 69 90 50 92 C31 90 13 72 13 52 Z" fill={fur} stroke={INK} strokeWidth="3.4" />
            <path d="M21 61 C33 58 44 63 50 73 C56 63 67 58 79 61 C75 78 63 90 50 92 C37 90 25 78 21 61 Z" fill="#fff" />
          </>
        ) : (
          <>
            <circle cx="22" cy="32" r="12" fill={fur} stroke={INK} strokeWidth="3.4" />
            <circle cx="78" cy="32" r="12" fill={fur} stroke={INK} strokeWidth="3.4" />
            <circle cx="22" cy="32" r="6" fill={light} />
            <circle cx="78" cy="32" r="6" fill={light} />
            <circle cx="50" cy="57" r="35" fill={fur} stroke={INK} strokeWidth="3.4" />
            <ellipse cx="50" cy="71" rx="16" ry="12" fill={light} />
          </>
        )}
        <circle cx="27" cy="67" r="5" fill="#ff8fa3" opacity="0.6" />
        <circle cx="73" cy="67" r="5" fill="#ff8fa3" opacity="0.6" />
        <circle cx="37" cy="53" r="4.6" fill={INK} />
        <circle cx="63" cy="53" r="4.6" fill={INK} />
        <ellipse cx="50" cy={fox ? 72 : 66} rx="5.4" ry="3.8" fill={INK} />
        <path d={fox ? "M50 76 V79 M45 81 Q50 84 55 81" : "M50 70 V73 M44 75 Q50 79 56 75"} stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** One arm from the shoulder: a thick line of fur with the ink round it. */
function Arm({ d, fur }: { d: string; fur: string }) {
  return (
    <>
      <path d={d} stroke={INK} strokeWidth="24" fill="none" strokeLinecap="round" />
      <path d={d} stroke={fur} strokeWidth="16" fill="none" strokeLinecap="round" />
    </>
  );
}

/**
 * A fox or bear child jumping for joy with both arms up, its grown-up beside it waving (D-12): for the end of a game.
 * Each is an HTML layer of its own, so the child's two hops (`mascot-jump`) move only its small picture; then both
 * stand still. It takes the height of its box (`.mascot-family`), the child about two thirds as tall.
 */
export function CheeringFamily({ kind, className }: { kind: MascotKind; className?: string }) {
  return (
    <span className={`mascot-family${className ? ` ${className}` : ""}`} aria-hidden>
      <span className="mascot-grown">
        <Mascot kind={kind} pose="wave" />
      </span>
      <span className="mascot-child">
        <Mascot kind={kind} child pose="cheer" />
      </span>
    </span>
  );
}
