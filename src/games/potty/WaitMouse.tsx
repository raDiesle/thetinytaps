import { useEffect, useState } from "react";
import { MOUSE_AGAIN_MS, MOUSE_FIRST_MS } from "./content";

const INK = "#2a1e5c";

/**
 * A little grey mouse that runs across the bathroom floor now and then while Tapsi sits (user request, November 2026),
 * something to look at while everybody waits. It comes in from the right, stops in front of the potty to sniff, and
 * runs off to the left. The track is a layer cut like the pictures (`.pt-scene`), so the floor is where the picture's
 * floor is on every screen; the mouse is an HTML layer round its own small svg, moved by a CSS transform, so a phone
 * only moves a finished picture (root CLAUDE.md). It makes no sound: the waiting song plays alone. While `paused`
 * it stands still, and the time until the next one only runs while not paused.
 */
export function WaitMouse({ paused }: { paused: boolean }) {
  /** How many mice have run in so far; each new one starts its run anew (its `key`). */
  const [runs, setRuns] = useState(0);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setRuns((n) => n + 1), runs === 0 ? MOUSE_FIRST_MS : MOUSE_AGAIN_MS);
    return () => clearTimeout(timer);
  }, [paused, runs]);

  if (runs === 0) return null;
  return (
    <div className="pt-scene pt-mouse-track" aria-hidden>
      <div key={runs} className="pt-mouse">
        <div className="pt-mouse-trot">
          <MouseDrawing />
        </div>
      </div>
    </div>
  );
}

/** The mouse seen from the side, facing left where it runs: round grey body, a big round ear, a pink nose and a long tail. */
function MouseDrawing() {
  return (
    <svg className="pt-mouse-svg" viewBox="0 0 120 70" aria-hidden>
      {/* The tail curls up behind it. */}
      <path d="M92 52 C108 54 116 44 112 32 C110 26 104 26 103 31" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M92 52 C108 54 116 44 112 32 C110 26 104 26 103 31" fill="none" stroke="#f4a9b8" strokeWidth="1.6" strokeLinecap="round" />
      {/* Feet under the body. */}
      <ellipse cx="38" cy="62" rx="7" ry="4" fill="#f4a9b8" stroke={INK} strokeWidth="2.5" />
      <ellipse cx="74" cy="62" rx="7" ry="4" fill="#f4a9b8" stroke={INK} strokeWidth="2.5" />
      {/* Body and head in one round shape, the snout pointing left. */}
      <path
        d="M12 46 C14 34 26 24 44 22 C64 20 88 26 94 42 C98 54 88 62 70 62 L34 62 C22 62 10 56 12 46 Z"
        fill="#b9b3c4"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* A lighter tummy. */}
      <path d="M30 58 C40 54 66 54 80 58" fill="none" stroke="#e4e0ea" strokeWidth="5" strokeLinecap="round" />
      {/* The big round ear with its pink inside. */}
      <circle cx="44" cy="20" r="13" fill="#b9b3c4" stroke={INK} strokeWidth="3.5" />
      <circle cx="44" cy="21" r="7.5" fill="#f4a9b8" />
      {/* Eye with a light, pink nose, whiskers. */}
      <circle cx="27" cy="36" r="4.2" fill={INK} />
      <circle cx="25.8" cy="34.6" r="1.4" fill="#fff" />
      <circle cx="11.5" cy="45" r="4.5" fill="#f08aa0" stroke={INK} strokeWidth="2" />
      <g stroke={INK} strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 44 L2 38" />
        <path d="M16 47 L1 48" />
        <path d="M17 50 L4 56" />
      </g>
      <circle cx="33" cy="44" r="3.5" fill="#f4a9b8" opacity="0.7" />
    </svg>
  );
}
