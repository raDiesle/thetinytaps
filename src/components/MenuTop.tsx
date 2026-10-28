import { useLayoutEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";

/** Room between the corner and the title, in px. */
const CORNER_GAP = 16;

/**
 * The top left corner of every menu but the home page: the way back and, for
 * grown-ups, the fullscreen button next to it – both on the left, so the sun in
 * the top right corner stays in sight.
 */
export function MenuTop({ to, children }: { to: string; children: ReactNode }) {
  return (
    <div className="menu-top">
      <Link to={to} className="back-link">
        ← {children}
      </Link>
      <FullscreenCorner />
    </div>
  );
}

/**
 * The top of a menu: the corner (MenuTop), the title centred next to it and, below
 * the title, `children` such as a start screen's small buttons for grown-ups. A computer
 * keeps the corner fixed while the page scrolls, so it takes no room of its own: the
 * title's column starts where the corner ends (`--corner`), and the title moves right
 * or wraps rather than hide under it.
 */
export function MenuHead({ to, back, title, children }: { to: string; back: ReactNode; title: ReactNode; children?: ReactNode }) {
  const head = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = head.current;
    const corner = el?.querySelector(".menu-top");
    if (!el || !corner) return;
    const measure = () =>
      el.style.setProperty("--corner", `${Math.max(0, corner.getBoundingClientRect().right - el.getBoundingClientRect().left + CORNER_GAP)}px`);
    measure();
    // The back link's width changes with the font and the language; the head moves with the window.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    observer.observe(corner);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div ref={head} className="menu-head">
      <MenuTop to={to}>{back}</MenuTop>
      <h1 className="menu-title">{title}</h1>
      {children}
    </div>
  );
}
