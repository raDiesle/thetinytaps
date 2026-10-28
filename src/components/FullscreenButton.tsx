import { useT } from "@/lib/language";
import { canFullscreen, enterFullscreen, enterKidMode, exitFullscreen, useFullscreen } from "@/lib/fullscreen";

/**
 * Small round button for the grown-ups: puts the whole app, menus included,
 * into fullscreen or back out. Hidden where the browser can't (iPhone).
 * While playing (`playing`) it also locks the keyboard again, as starting the game did.
 */
export function FullscreenButton({ className = "home-menu-button icon-only", playing = false }: { className?: string; playing?: boolean }) {
  const on = useFullscreen();
  const t = useT();
  if (!canFullscreen()) return null;
  const label = on ? t({ de: "Vollbild beenden", ru: "Выйти из полноэкранного режима" }) : t({ de: "Vollbild", ru: "Полный экран" });
  return (
    <button
      type="button"
      // "on" lets the styles hide it in fullscreen where only entering is wanted (a game on a tablet).
      className={`${className}${on ? " on" : ""}`}
      aria-label={label}
      title={label}
      // The game underneath must not take the click for a tap.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        // Not left focused: a child's space bar would toggle it again.
        e.currentTarget.blur();
        void (on ? exitFullscreen() : playing ? enterKidMode() : enterFullscreen());
      }}
    >
      <svg className="fullscreen-icon" viewBox="0 0 24 24" aria-hidden>
        {/* Four corners pointing out, or in once the page is in fullscreen. */}
        <path d={on ? "M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" : "M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"} />
      </svg>
    </button>
  );
}

/**
 * The same button next to the back link of the other menus, always: the browser
 * leaves fullscreen when a phone switches to another app and back, so the
 * grown-up gets it back right there, or leaves it, without going to the home page first.
 */
export function FullscreenCorner() {
  return (
    <div className="fullscreen-corner">
      <FullscreenButton />
    </div>
  );
}
