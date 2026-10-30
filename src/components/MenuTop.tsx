import type { ReactNode } from "react";
import { Link } from "react-router";
import { FullscreenCorner } from "@/components/FullscreenButton";
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
 */
export function MenuHead({ to, back, title, tools, children }: { to: string; back: string; title: ReactNode; tools?: ReactNode; children?: ReactNode }) {
  return (
    <div className="menu-head">
      <MenuTop to={to} back={back}>
        {tools}
      </MenuTop>
      <h1 className="menu-title">{title}</h1>
      <FullscreenCorner />
      {children}
    </div>
  );
}
