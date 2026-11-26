import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { useT } from "@/lib/language";
import { MUSEUM_PATH, TROPHY_ROOM, useMuseumTrophies } from "@/lib/museum";
import { preloadPage } from "@/lib/preloadPages";

/*
 * The way from the bookshelf into the trophy room (user request, November 2026): a little wooden board in 3D with a big
 * golden cup on it, nailed into a compartment's corner with three nails in its corners: on a wide shelf into the top
 * left corner of the speaker's at the bottom of the right column, over the speaker (user request, 26 November 2026), on
 * an upright one into the picture books' bottom right corner, reaching left over the books spine out there. A little in the cup glints now and then, as a trophy does in a
 * game (user request, November 2026: the small cup in a doorway above the loudspeaker was hardly recognised). A tap
 * turns the eye to the right – the room's wall comes round with a door in it (MuseumDoorway) –, the door opens and one
 * walks in. Before the first trophy there is nothing behind it, so the sign isn't there either.
 */

/** How long the walk from the shelf into the trophy room takes; `museum-door-*` in bookshelf.css run exactly this long. */
const DOORWAY_MS = 1900;

/**
 * The sign, the compartment's bottom right corner – its post at `left`, its floor at `top` – in px in the shelf, or
 * with `from: "top"` its top left corner, the wall at its left and the board above at its top; and its width where that
 * compartment sets it (`size`, the speaker's); else the books' height does (`--trophy-sign`).
 */
export function TrophySign({ left, top, size, from }: { left: number; top: number; size?: number; from?: "top" }) {
  const t = useT();
  const navigate = useNavigate();
  const { search } = useLocation();
  const any = useMuseumTrophies().length > 0;
  const [walking, setWalking] = useState(false);
  if (!any) return null;
  const label = t(TROPHY_ROOM);
  // The test view of every trophy (`?alle`) goes on into the room.
  const to = `${MUSEUM_PATH}${search}`;
  return (
    <>
      <button
        type="button"
        className="shelf-trophy-sign"
        data-from={from}
        style={{ left, top, ...(size && { "--trophy-sign": `${size}px` }) } as CSSProperties}
        aria-label={label}
        title={label}
        onPointerDown={(e) => {
          e.stopPropagation();
          preloadPage(MUSEUM_PATH);
        }}
        onClick={(e) => {
          e.currentTarget.blur();
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) navigate(to);
          else setWalking(true);
        }}
      >
        <TrophyArt />
        {/* Two glints on the cup, each a tiny layer of its own, so only they move and the svg is never painted again. */}
        <span className="shelf-trophy-glint" aria-hidden>
          <Glint />
        </span>
        <span className="shelf-trophy-glint" aria-hidden>
          <Glint />
        </span>
      </button>
      {walking && createPortal(<MuseumDoorway onInside={() => navigate(to)} />, document.body)}
    </>
  );
}

/** The sign's picture: a big golden cup with two handles and a star, on a wooden foot, a warm glow behind it. */
function TrophyArt() {
  return (
    <svg className="shelf-trophy-sign-art" viewBox="0 0 48 52" aria-hidden>
      <defs>
        <radialGradient id="trophy-sign-glow" cx="0.5" cy="0.42" r="0.5">
          <stop offset="0" stopColor="#ffe9a0" />
          <stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="trophy-sign-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#fff0a8" />
          <stop offset="0.35" stopColor="#f7c936" />
          <stop offset="0.75" stopColor="#e3a218" />
          <stop offset="1" stopColor="#b97a0c" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="22" rx="23" ry="21" fill="url(#trophy-sign-glow)" />
      <g stroke="#6b3f08" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        {/* Handles behind the bowl. */}
        <path d="M12 9.5 C3 9.5 3.5 22 13.5 23.5 M36 9.5 C45 9.5 44.5 22 34.5 23.5" fill="none" stroke="#6b3f08" strokeWidth="5" />
        <path d="M12 9.5 C3 9.5 3.5 22 13.5 23.5 M36 9.5 C45 9.5 44.5 22 34.5 23.5" fill="none" stroke="#f2bd2c" strokeWidth="2.4" />
        {/* Bowl, its rim, stem, knot and foot. */}
        <path d="M10.5 7 H37.5 C37.5 22 32 29.5 24 30.5 C16 29.5 10.5 22 10.5 7 Z" fill="url(#trophy-sign-gold)" />
        <ellipse cx="24" cy="7" rx="13.5" ry="2.2" fill="#ffe27a" />
        <path d="M21.5 30.3 H26.5 L27.4 36 H20.6 Z" fill="#e3a218" />
        <ellipse cx="24" cy="36.4" rx="5.2" ry="1.8" fill="#f7c936" />
        <path d="M17.5 38 H30.5 L32 41.5 H16 Z" fill="#f2bd2c" />
        <rect x="12.5" y="41.5" width="23" height="8" rx="1.5" fill="#8a5428" />
      </g>
      {/* The star on the bowl, the gold plate on the foot and the light down the bowl's left. */}
      <path
        d="M24 11.5 L25.9 15.4 L30.1 15.9 L27 18.8 L27.8 23 L24 20.9 L20.2 23 L21 18.8 L17.9 15.9 L22.1 15.4 Z"
        fill="#fff3b8"
        stroke="#b97a0c"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <rect x="17" y="43.6" width="14" height="3.8" rx="0.8" fill="#f2c94c" stroke="#6b3f08" strokeWidth="0.7" />
      <path d="M14 10 C14 17 15.5 22.5 19 26.5" stroke="#fffbe6" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

/** A glint: a four-pointed white star with a warm edge. */
function Glint() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden>
      <path d="M10 0 C10.8 7 13 9.2 20 10 C13 10.8 10.8 13 10 20 C9.2 13 7 10.8 0 10 C7 9.2 9.2 7 10 0 Z" fill="#fffef5" stroke="#ffd86b" strokeWidth="0.8" />
    </svg>
  );
}

/**
 * The walk into the trophy room, over the whole screen: the shelf's room turns away to the left as the eye turns right
 * (`data-to-museum` on the root, bookshelf.css), the room's right wall comes round with a door in it, the door swings
 * open on warm light, and one walks in. A tap goes in at once.
 */
function MuseumDoorway({ onInside }: { onInside: () => void }) {
  // Once only, by the tap or at the walk's end, whichever comes first.
  const inside = useRef(() => {});
  const done = useRef(false);
  inside.current = () => {
    if (done.current) return;
    done.current = true;
    onInside();
  };
  // Once, as the walk starts.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.toMuseum = "";
    const timer = setTimeout(() => inside.current(), DOORWAY_MS);
    return () => {
      clearTimeout(timer);
      delete root.dataset.toMuseum;
    };
  }, []);
  return (
    <div className="museum-doorway" aria-hidden onPointerDown={() => inside.current()}>
      <div className="museum-doorway-wall">
        <span className="room-wall" />
        <span className="room-floor" />
        <span className="museum-doorway-frame">
          <span className="museum-doorway-light" />
          <span className="museum-doorway-door">
            <span className="museum-doorway-panel" />
            <span className="museum-doorway-panel" />
            <span className="museum-doorway-knob" />
            <span className="museum-doorway-plate">
              <TrophyArt />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
