import type { Place } from "./kita";

// Backgrounds for the kindergarten stories, in stage units: 160 wide, 100
// high, feet at y 90. The drawing reaches far past both sides so the sky and
// ground continue on wide screens.

function Outdoors() {
  return (
    <g>
      <rect x="-160" y="0" width="480" height="100" fill="#c4f1ff" />
      <circle cx="-30" cy="62" r="18" fill="#7cc86a" />
      <rect x="-33" y="68" width="6" height="20" fill="#a0673c" />
      <circle cx="140" cy="54" r="20" fill="#6fc05c" />
      <circle cx="128" cy="62" r="13" fill="#7cc86a" />
      <rect x="137" y="66" width="7" height="24" fill="#a0673c" />
      <ellipse cx="6" cy="88" rx="14" ry="8" fill="#6fc05c" />
      <rect x="-160" y="88" width="480" height="12" fill="#8fd16a" />
      <rect x="-160" y="88" width="480" height="1.5" fill="#6fb24f" />
      {[20, 74, 118, 150, 186].map((x) => (
        <g key={x}>
          <path d={`M${x} 93 v-4`} stroke="#4f9a3a" strokeWidth="1" />
          <circle cx={x} cy="88.5" r="1.8" fill={x % 3 ? "#ff8fa3" : "#ffd23f"} />
        </g>
      ))}
    </g>
  );
}

function Sandbox() {
  return <rect x="18" y="84" width="96" height="12" rx="2" fill="#f6d78b" stroke="#c68a4a" strokeWidth="2.5" />;
}

/** Ladder on the left, platform on top, the chute down to the right. */
function Slide() {
  return (
    <g strokeLinecap="round">
      <path d="M64 46 Q82 48 92 70 Q98 86 112 88" fill="none" stroke="#ff6b6b" strokeWidth="6" />
      <path d="M64 43 Q84 45 94 68 Q100 82 113 85" fill="none" stroke="#2a1e5c" strokeWidth="1.2" opacity="0.4" />
      <rect x="44" y="44" width="21" height="3.5" rx="1" fill="#ffd23f" stroke="#2a1e5c" strokeWidth="1.2" />
      <path d="M44 47 V90 M51 47 V90" stroke="#4cc9f0" strokeWidth="2.2" />
      {[53, 60, 67, 74, 81].map((y) => (
        <path key={y} d={`M44 ${y} H51`} stroke="#4cc9f0" strokeWidth="1.6" />
      ))}
      <path d="M63 47 V90" stroke="#4cc9f0" strokeWidth="2.2" />
    </g>
  );
}

function Room() {
  return (
    <g>
      <rect x="-160" y="0" width="480" height="100" fill="#ffe9c9" />
      <rect x="-160" y="0" width="480" height="8" fill="#ffd9a8" />
      <rect x="10" y="18" width="34" height="28" rx="2" fill="#c4f1ff" stroke="#c68a4a" strokeWidth="2.5" />
      <path d="M27 18 V46 M10 32 H44" stroke="#c68a4a" strokeWidth="2" />
      <rect x="118" y="30" width="26" height="20" rx="2" fill="#fff" stroke="#c68a4a" strokeWidth="2" />
      <path d="M122 46 l6 -9 l5 6 l4 -4 l4 7 z" fill="#3ddc97" />
      <circle cx="137" cy="36" r="3" fill="#ffd23f" />
      <rect x="-160" y="86" width="480" height="14" fill="#e3b07a" />
      <rect x="-160" y="86" width="480" height="1.5" fill="#c68a4a" />
      <ellipse cx="80" cy="92" rx="44" ry="4" fill="#ff8fa3" opacity="0.55" />
    </g>
  );
}

const BLOCK_COLORS = ["#ff6b6b", "#ffd23f", "#3ddc97", "#4cc9f0", "#b388ff"];

/** Five blocks; the stage class "tower-down" knocks them over (see feelings.css). */
function Tower() {
  return (
    <g className="fg-tower">
      {BLOCK_COLORS.map((color, i) => (
        <rect
          key={color}
          className={`fg-block fg-block-${i}`}
          x="72"
          y={81 - i * 9}
          width="12"
          height="9"
          rx="1.2"
          fill={color}
          stroke="#2a1e5c"
          strokeWidth="1.2"
        />
      ))}
    </g>
  );
}

export function PlaceDrawing({ place, tower = place === "room" }: { place: Place; tower?: boolean }) {
  return (
    <svg className="fg-place" viewBox="-160 0 480 100" aria-hidden>
      {place === "room" ? <Room /> : <Outdoors />}
      {place === "sandbox" && <Sandbox />}
      {place === "slide" && <Slide />}
      {tower && <Tower />}
    </svg>
  );
}
