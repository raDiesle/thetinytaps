import { Link } from "react-router";
import { useT } from "@/lib/language";

export interface GameCardProps {
  /** Without a link the card is shown greyed out as "coming soon". */
  href?: string;
  emoji: string;
  title: string;
}

/** A big tappable card for the game and scene menus. */
export function GameCard({ href, emoji, title }: GameCardProps) {
  const t = useT();
  const content = (
    <>
      <span className="game-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="game-title">{title}</span>
      {href && (
        <span className="game-go" aria-hidden>
          ▶
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link to={href} className="game-card">
        {content}
      </Link>
    );
  }
  return (
    <div className="game-card disabled" aria-disabled>
      {content}
      <span className="badge">{t({ de: "bald", ru: "скоро" })}</span>
    </div>
  );
}
