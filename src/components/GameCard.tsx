import type { ReactNode } from "react";
import { Link } from "react-router";
import { useT } from "@/lib/language";
import { useTurnPage } from "@/lib/look";
import { preloadPage } from "@/lib/preloadPages";

/** The most games a category card shows in its collage; the count beside it tells how many there are. */
const COLLAGE = 4;

export interface GameCardProps {
  /** Without a link the card is shown greyed out as "coming soon". */
  href?: string;
  emoji: string;
  title: string;
  /** One short line for grown-ups under the title; shown only on tablets and computers with room for it. */
  blurb?: string;
  /** A category's games: their emojis as a collage instead of `emoji`, with how many there are. */
  games?: string[];
  /** A picture behind the lower part of the card (a category's world). */
  scene?: ReactNode;
}

/** A big tappable card for the game and scene menus. */
export function GameCard({ href, emoji, title, blurb, games, scene }: GameCardProps) {
  const t = useT();
  // In the book look the page turns over to the next one.
  const turnPage = useTurnPage(href ?? "", "forward");
  const content = (
    <>
      {scene}
      {games ? (
        <span className="game-emoji game-collage" data-count={Math.min(games.length, COLLAGE)} aria-hidden>
          {games.slice(0, COLLAGE).map((e, i) => (
            <span key={i}>{e}</span>
          ))}
          <span className="game-count">{games.length}</span>
        </span>
      ) : (
        <span className="game-emoji" aria-hidden>
          {emoji}
        </span>
      )}
      <span className="game-title">{title}</span>
      {blurb && <span className="game-blurb">{blurb}</span>}
      {href && (
        <span className="game-go" aria-hidden>
          ▶
        </span>
      )}
    </>
  );
  const className = `game-card${scene ? " has-scene" : ""}`;
  if (href) {
    return (
      // The page starts loading as the finger lands, not only once it is lifted.
      <Link to={href} className={className} onPointerDown={() => preloadPage(href)} onClick={turnPage}>
        {content}
      </Link>
    );
  }
  return (
    <div className={`${className} disabled`} aria-disabled>
      {content}
      <span className="badge">{t({ de: "bald", ru: "скоро", en: "soon", zh: "即将推出", hi: "जल्द ही", es: "pronto", ar: "قريبًا" })}</span>
    </div>
  );
}
