import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router";
import { useT } from "@/lib/language";
import { MUSEUM_PATH, TROPHY_ROOM, useMuseumTrophies } from "@/lib/museum";
import { preloadPage } from "@/lib/preloadPages";

/*
 * The way from the bookshelf into the trophy room (user request, November 2026): a little paper sign like the fullscreen
 * button's, nailed onto the shelf's right side above the loudspeaker, a golden cup in a doorway on it. A tap turns the
 * eye to the right – the room's wall comes round with a door in it (MuseumDoorway) –, the door opens and one walks in.
 * Before the first trophy there is nothing behind it, so the sign isn't there either.
 */

/** How long the walk from the shelf into the trophy room takes; `museum-door-*` in bookshelf.css run exactly this long. */
export const DOORWAY_MS = 1900;

/** The sign on the shelf's right side, `top` px from the shelf's top. */
export function TrophySign({ top }: { top: number }) {
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
        style={{ top }}
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
        <TrophyDoorArt />
      </button>
      {walking && createPortal(<MuseumDoorway onInside={() => navigate(to)} />, document.body)}
    </>
  );
}

/** The sign's picture: a doorway, warm light in it and a golden cup standing there. */
function TrophyDoorArt() {
  return (
    <svg className="shelf-trophy-sign-art" viewBox="0 0 40 46" aria-hidden>
      <path d="M6 44 V17 A14 14 0 0 1 34 17 V44 Z" fill="#7a4a26" />
      <path d="M10 44 V18 A10 10 0 0 1 30 18 V44 Z" fill="#ffe7a8" />
      <path d="M10 44 V18 A10 10 0 0 1 30 18 V44 Z" fill="url(#sign-light)" />
      <defs>
        <radialGradient id="sign-light" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fff8dc" />
          <stop offset="1" stopColor="#f0b85a" />
        </radialGradient>
      </defs>
      {/* The cup: bowl, handles, stem and foot. */}
      <g stroke="#6b4210" strokeWidth="1.1" strokeLinejoin="round">
        <path d="M14.5 21 C12 21 11.5 26 15.5 27.5 M25.5 21 C28 21 28.5 26 24.5 27.5" fill="none" strokeWidth="1.6" />
        <path d="M14 20 H26 C26 27 23.5 30 20 30.5 C16.5 30 14 27 14 20 Z" fill="#f2c230" />
        <path d="M18.6 30.4 H21.4 L22 35 H18 Z" fill="#e0a91f" />
        <rect x="15.5" y="35" width="9" height="3.6" rx="0.8" fill="#9a6a3a" />
      </g>
      <path d="M16 22 C16 25 16.8 27 18 28" stroke="#fff6c8" strokeWidth="1" fill="none" strokeLinecap="round" />
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
              <TrophyDoorArt />
            </span>
          </span>
        </span>
      </div>
    </div>
  );
}
