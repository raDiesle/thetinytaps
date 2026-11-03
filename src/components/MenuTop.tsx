import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";
import { PageCornerArt } from "@/components/PageCornerArt";
import { useTurnPage } from "@/lib/look";

/**
 * The way back from a page that is no book's page (Impressum, Datenschutz, the management page): a big round arrow
 * without words (`back` names where it leads, for screen readers and as a tooltip).
 */
export function MenuTop({ to, back }: { to: string; back: string }) {
  const turnPage = useTurnPage(to, "back");
  return (
    <div className="menu-top">
      <Link to={to} className="back-link" aria-label={back} title={back} onClick={turnPage}>
        <svg className="back-arrow" viewBox="0 0 24 24" aria-hidden>
          <path d="M20 12H5M11 5l-7 7 7 7" />
        </svg>
      </Link>
    </div>
  );
}

/**
 * The top of a menu: the centred title, the way back as the page's corner in the top left (PageCorner), and the
 * fullscreen button and `tools` (⚙️) as paper notes clipped onto the page's top edge in the top right (`book.css`).
 * `children`, such as a start screen's labelled buttons for grown-ups, go in a row of their own under the title.
 */
export function MenuHead({ to, back, title, tools, children }: { to: string; back: string; title: string; tools?: ReactNode; children?: ReactNode }) {
  return (
    <div className="menu-head">
      <div className="menu-top">{tools}</div>
      <h1 className="menu-title">{title}</h1>
      <FullscreenCorner />
      <PageCorner to={to} back={back} />
      {children}
    </div>
  );
}

/**
 * The way back from a menu: the corner of the page before stands up at the spine, the page's top left, with a
 * little arrow on it, and a tap on it turns that page back over to the right – the corner touched is the page that
 * turns (user feedback, October 2026; in the top right it turned the other page, and grown-ups didn't look there).
 * Back to the shelf no page turns but the book closes and goes back (bookTravel.ts), so there it is the book's ribbon
 * hanging over the page's top edge, a shelf on it, instead. Big, so a grown-up finds it at once; `back` names where it
 * leads, as tooltip and for screen readers.
 */
function PageCorner({ to, back }: { to: string; back: string }) {
  const turnPage = useTurnPage(to, "back");
  const corner = (
    <Link to={to} className={to === "/" ? "page-corner page-ribbon" : "page-corner"} aria-label={back} title={back} onClick={turnPage} data-tap>
      <PageCornerArt sign={to === "/" ? "shelf" : "back"} />
    </Link>
  );
  // The ribbon lies on the paper and scrolls with it, placed from the page's top left (`#root`, which the page turns
  // with), never from a menu's own boxes, which some screens position.
  return to === "/" ? createPortal(corner, document.getElementById("root") ?? document.body) : corner;
}
