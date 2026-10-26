import { useT } from "@/lib/language";
import { canFullscreen, enterFullscreen, exitFullscreen, useFullscreen } from "@/lib/fullscreen";

/**
 * Small round button for the grown-ups: puts the whole app, menus included,
 * into fullscreen or back out. Hidden where the browser can't (iPhone).
 */
export function FullscreenButton({ className = "home-menu-button icon-only" }: { className?: string }) {
  const on = useFullscreen();
  const t = useT();
  if (!canFullscreen()) return null;
  const label = on ? t({ de: "Vollbild beenden", ru: "Выйти из полноэкранного режима" }) : t({ de: "Vollbild", ru: "Полный экран" });
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      title={label}
      // The game underneath must not take the click for a tap.
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        // Not left focused: a child's space bar would toggle it again.
        e.currentTarget.blur();
        void (on ? exitFullscreen() : enterFullscreen());
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
 * The same button in the top right corner of the other menus: always on
 * computers, elsewhere only in fullscreen, so the grown-up can leave it right
 * there without going back to the home page first.
 */
export function FullscreenCorner() {
  const on = useFullscreen();
  return (
    <div className={`fullscreen-corner${on ? " on" : ""}`}>
      <FullscreenButton />
    </div>
  );
}
