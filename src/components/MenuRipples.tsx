import { useEffect } from "react";
import { useLocation } from "react-router";
import { playTwinkle } from "@/lib/sfx";
import { repeatPause } from "@/lib/spacing";
import { spinSunAt } from "./Sky";
import { FeedbackLayer, useTapFeedback } from "./TapFeedback";

/** Pages for grown-ups only, which are no book's pages: a tap on their text stays a tap on text. */
const GROWN_UP_PAGES = ["/management", "/ideen", "/impressum", "/datenschutz"];

/** What already answers a tap by itself: links, buttons, a game's play area, a filler book that rocks. */
const ANSWERS = "a, button, input, select, textarea, label, summary, [role='button'], [role='dialog'], [data-tap], [data-tap-root], .play-area, .shelf-box";

/** Whether a tap on this element sets something off, so the ripple would only be in its way. */
export function answersTap(target: Element): boolean {
  if (target.closest(ANSWERS)) return true;
  // Anything styled as tappable (a hold to open, a card drawn as a div) answers too.
  for (let el: Element | null = target; el && el !== document.body; el = el.parentElement) {
    if (getComputedStyle(el).cursor === "pointer") return true;
  }
  return false;
}

/** The sun tapped again and again twinkles again only after a pause (root CLAUDE.md), while its rays turn at every tap. */
const sunRepeat = repeatPause();

/**
 * Soft rings as on water where a tap in a menu, a start screen or the bookshelf sets nothing off, so a child sees its
 * tap was felt, just like in the games (`TapFeedback.tsx`). Games draw their own feedback in their play area. A tap on the
 * sky's sun turns its rays clockwise (`spinSunAt`).
 * Mounted once in `index.tsx`.
 */
export function MenuRipples() {
  const { effects, ripple, glow } = useTapFeedback();
  const { pathname } = useLocation();
  const grownUps = GROWN_UP_PAGES.some((page) => pathname.startsWith(page));

  useEffect(() => {
    if (grownUps) return;
    const onDown = (e: PointerEvent) => {
      if (!e.isPrimary || !(e.target instanceof Element) || answersTap(e.target)) return;
      // The sun in the sky behind the page answers a tap by turning its rays, with a warm light and a twinkle.
      if (spinSunAt(e.clientX, e.clientY)) {
        glow(e.clientX, e.clientY);
        if (sunRepeat.pass("sun")) playTwinkle();
        return;
      }
      ripple(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [grownUps, ripple, glow]);

  return <FeedbackLayer effects={effects} fixed />;
}
