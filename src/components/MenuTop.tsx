import type { ReactNode } from "react";
import { Link } from "react-router";
import { BookFamily } from "@/components/BookFamily";
import { FullscreenCorner } from "@/components/FullscreenButton";
import { PageCornerArt } from "@/components/PageCornerArt";
import { useTurnPage } from "@/lib/look";

/**
 * The way back from a menu: a big round arrow without words (`back` names where it leads, for screen readers and as
 * a tooltip), with `children` – small round buttons for grown-ups such as ℹ️ – right next to it.
 */
export function MenuTop({ to, back, children }: { to: string; back: string; children?: ReactNode }) {
  const turnPage = useTurnPage(to, "back");
  return (
    <div className="menu-top">
      <Link to={to} className="back-link" aria-label={back} title={back} onClick={turnPage}>
        <svg className="back-arrow" viewBox="0 0 24 24" aria-hidden>
          <path d="M20 12H5M11 5l-7 7 7 7" />
        </svg>
      </Link>
      {children}
    </div>
  );
}

/**
 * The top of a menu: the way back (MenuTop, with `tools` next to it) right left of the centred title, close to the
 * cards where a grown-up looks, and the fullscreen button on the right, across from the sun in the top left corner.
 * `children`, such as a start screen's labelled buttons for grown-ups, go in a row of their own under the title.
 * In the book look the way back is the corner of the page before, at the spine, instead (PageCorner), and where the page has no room for
 * them beside the cards, the animal families sit in the row's free room.
 */
export function MenuHead({ to, back, title, tools, children }: { to: string; back: string; title: ReactNode; tools?: ReactNode; children?: ReactNode }) {
  return (
    <div className="menu-head">
      <BookFamily family="fox" />
      <MenuTop to={to} back={back}>
        {tools}
      </MenuTop>
      <h1 className="menu-title">{title}</h1>
      <BookFamily family="bear" />
      <FullscreenCorner />
      <PageCorner to={to} back={back} />
      {children}
    </div>
  );
}

/**
 * The way back in the book look: the corner of the page before stands up at the spine, the page's top left, with a
 * little arrow on it, and a tap on it turns that page back over to the right – the corner touched is the page that
 * turns (user feedback, October 2026; in the top right it turned the other page, and grown-ups didn't look there).
 * Big, so a grown-up finds it at once; `back` names where it leads, as tooltip and for screen readers. Hidden in the
 * toy look, which keeps the round arrow.
 */
function PageCorner({ to, back }: { to: string; back: string }) {
  const turnPage = useTurnPage(to, "back");
  return (
    <Link to={to} className="page-corner" aria-label={back} title={back} onClick={turnPage} data-tap>
      <PageCornerArt sign="back" />
    </Link>
  );
}
