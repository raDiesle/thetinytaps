import { Link } from "react-router";
import { type Localized, useT } from "@/lib/language";
import { useTurnPage } from "@/lib/look";
import { preloadPage } from "@/lib/preloadPages";

/** The page marker on a card or a table of contents' line still being built (`GameMode.unfinished`, `Game.unfinished`). */
export const UNFINISHED_LABEL: Localized = {
  de: "in Bearbeitung",
  ru: "в работе",
  en: "in progress",
  zh: "制作中",
  hi: "तैयार हो रहा है",
  es: "en preparación",
  ar: "قيد الإعداد",
};

/** The previews' size in pixels (`tools/previews.ts` makes them so): 3 : 2, like the cards and lines that show them. */
export const PREVIEW_SIZE = { width: 480, height: 320 } as const;

/**
 * The class a card adds whose picture fills it with the name lying on it in a small paper box (`GameShell
 * labelOnPicture`, Kettenreaktion's machines, user request, November 2026). Every other card shows its framed picture
 * above its name, never under it (user feedback, November 2026: pictures lay over the words).
 */
export const pictureCard = (picture: string | undefined) => (picture ? " picture-card" : "");

/**
 * The print on a menu's card or line: a cut of the game as it looks (`picture`, from a `vorschau/` folder, made by `bun
 * run previews` as 3 : 2 pictures, `PREVIEW_SIZE`), else its emoji (user request, November 2026: pictures
 * instead of emojis in every menu). The picture is framed like a photo pasted in, above the card's name or beside the
 * table of contents' line's, as big as the room allows and never over the words. It is a small still image, decoded off the main thread, never the game's
 * drawing: an svg scene in every card would cost a phone as much as playing them all at once.
 */
export function CardPicture({ emoji, picture, className = "game-emoji" }: { emoji: string; picture?: string; className?: string }) {
  return (
    <span className={picture ? `${className} with-picture` : className} aria-hidden>
      {picture ? (
        <img className="menu-picture" src={picture} alt="" width={PREVIEW_SIZE.width} height={PREVIEW_SIZE.height} decoding="async" draggable={false} />
      ) : (
        emoji
      )}
    </span>
  );
}

export interface GameCardProps {
  /** Without a link the card is shown greyed out as "coming soon". */
  href?: string;
  emoji: string;
  /** A framed cut of what the card opens, in place of the emoji (`CardPicture`). */
  picture?: string;
  title: string;
  /** What `bun run previews` names its picture by: the scene's id. */
  id?: string;
}

/**
 * A big tappable card for the scene menu: a picture taped onto the page. It has no ▶ on it, the whole card is what is
 * tapped (user feedback, October 2026), and the page turns over to the next one.
 */
export function GameCard({ href, emoji, picture, title, id }: GameCardProps) {
  const t = useT();
  const turnPage = useTurnPage(href ?? "", "forward");
  const content = (
    <>
      <CardPicture emoji={emoji} picture={picture} />
      <span className="game-title">{title}</span>
    </>
  );
  if (href) {
    return (
      // The page starts loading as the finger lands, not only once it is lifted.
      <Link to={href} className="game-card" data-mode={id} onPointerDown={() => preloadPage(href)} onClick={turnPage}>
        {content}
      </Link>
    );
  }
  return (
    <div className="game-card disabled" aria-disabled>
      {content}
      <span className="badge">{t({ de: "bald", ru: "скоро", en: "soon", zh: "即将推出", hi: "जल्द ही", es: "pronto", ar: "قريبًا" })}</span>
    </div>
  );
}
