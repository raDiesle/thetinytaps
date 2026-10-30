import { type ReactNode, useId } from "react";
import { Link } from "react-router";
import { BookFamily } from "@/components/BookFamily";
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
 * In the book look the way back is the page's turned-up corner instead (PageCorner), and where the page has no room for
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
 * The way back in the book look (user decision, October 2026): the page's top right corner stands up as if a finger
 * had lifted it, its back showing with a little arrow on it, and a tap on it turns the page back. Big, so a grown-up
 * finds it at once; `back` names where it leads, as tooltip and for screen readers. Hidden in the toy look, which keeps
 * the round arrow.
 */
function PageCorner({ to, back }: { to: string; back: string }) {
  const turnPage = useTurnPage(to, "back");
  const id = useId();
  return (
    <Link to={to} className="page-corner" aria-label={back} title={back} onClick={turnPage} data-tap>
      <svg viewBox="0 0 100 100" aria-hidden>
        <defs>
          {/* Under the lifted corner: the next page's paper, in the corner's shadow towards the fold. */}
          <linearGradient id={`${id}u`} x1="1" y1="0" x2="0.5" y2="0.5">
            <stop offset="0" stopColor="#efe4ca" />
            <stop offset="1" stopColor="#cdbb93" />
          </linearGradient>
          {/* The corner's back: lit where it bends at the fold, darker towards its tip. */}
          <linearGradient id={`${id}b`} x1="0.5" y1="0.5" x2="0" y2="1">
            <stop offset="0" stopColor="#d8c8a2" />
            <stop offset="0.18" stopColor="#fffaf0" />
            <stop offset="0.7" stopColor="#f3e8cf" />
            <stop offset="1" stopColor="#dfd0ac" />
          </linearGradient>
        </defs>
        <path d="M0 0H100V100Z" fill={`url(#${id}u)`} />
        <path d="M100 100L96 0" stroke="#c9b68f" strokeWidth="1.5" />
        {/* The corner's shadow on the page, then the corner itself, curling a little at its tip. */}
        <path className="page-corner-shadow" d="M0 0L100 100Q56 93 14 100Q6 56 0 0Z" />
        <path className="page-corner-back" d="M0 0L100 100Q58 90 9 95Q3 52 0 0Z" fill={`url(#${id}b)`} />
        <path className="page-corner-arrow" d="M58 80Q40 82 28 68M28 68l1 11M28 68l11 1" />
      </svg>
    </Link>
  );
}
