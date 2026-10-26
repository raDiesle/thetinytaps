import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocation } from "react-router";
import { useDevice } from "@/lib/device";
import { canFullscreen, enterFullscreen, useFullscreen } from "@/lib/fullscreen";
import { isStandalone } from "@/lib/pwa";

const PORTRAIT = "(orientation: portrait)";

function subscribePortrait(onChange: () => void) {
  const query = matchMedia(PORTRAIT);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** Whether the screen is taller than wide, updated when the device turns. */
function usePortrait(): boolean {
  return useSyncExternalStore(subscribePortrait, () => matchMedia(PORTRAIT).matches);
}

/**
 * For the grown-up on phones and tablets, over menus and games: a note to hold
 * the device sideways while it stands upright, and once per visit the question
 * whether to play in fullscreen (a browser only allows fullscreen after a tap).
 * Computers get neither: a game goes into fullscreen when it starts anyway.
 */
export function ScreenHint() {
  const device = useDevice();
  const portrait = usePortrait();
  const fullscreen = useFullscreen();
  const { pathname } = useLocation();
  const [asked, setAsked] = useState(false);
  const fullscreenPossible = canFullscreen() && !fullscreen && !isStandalone();

  // Once the page has been in fullscreen (a game started), leaving it isn't a reason to ask.
  useEffect(() => {
    if (fullscreen) setAsked(true);
  }, [fullscreen]);

  // The management page is for grown-ups reading, not a menu or a game.
  if (!device.touchOnly || pathname.startsWith("/management") || pathname.startsWith("/ideen")) return null;

  const goFullscreen = () => {
    setAsked(true);
    void enterFullscreen();
  };

  if (portrait) {
    return (
      <div className="screen-hint" role="dialog" aria-modal aria-label="Bitte quer halten">
        <svg className="screen-hint-phone" viewBox="0 0 120 120" aria-hidden>
          <path className="screen-hint-arrow" d="M28 30 A44 44 0 0 1 92 28 M84 18 L93 28 L80 34" />
          <g className="screen-hint-turn">
            <rect x="38" y="30" width="44" height="76" rx="8" />
            <circle cx="60" cy="98" r="3" />
          </g>
        </svg>
        <p className="screen-hint-title">Bitte quer halten</p>
        {fullscreenPossible && (
          <button type="button" className="screen-hint-button" onClick={goFullscreen}>
            <FullscreenIcon /> Vollbild
          </button>
        )}
      </div>
    );
  }

  if (fullscreenPossible && !asked) {
    return (
      <div className="screen-hint" role="dialog" aria-modal aria-label="Im Vollbild spielen?">
        <p className="screen-hint-title">Im Vollbild spielen?</p>
        <div className="screen-hint-buttons">
          <button type="button" className="screen-hint-button" onClick={goFullscreen}>
            <FullscreenIcon /> Vollbild
          </button>
          <button type="button" className="screen-hint-button secondary" onClick={() => setAsked(true)}>
            Nein
          </button>
        </div>
      </div>
    );
  }

  return null;
}

/** The four corners of the fullscreen button on the home page. */
function FullscreenIcon() {
  return (
    <svg className="fullscreen-icon" viewBox="0 0 24 24" aria-hidden>
      <path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" />
    </svg>
  );
}
