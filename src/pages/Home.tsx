import { type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Bookshelf } from "@/components/Bookshelf";
import { GameCard } from "@/components/GameCard";
import { HomeOptions } from "@/components/HomeOptions";
import { InstallHint } from "@/components/InstallHint";
import { ParentsNote } from "@/components/ParentsNote";
import { SeoText } from "@/components/SeoText";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { hasPage, SHELF } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { isBookLook, useTurnPage } from "@/lib/look";
import { useT } from "@/lib/language";
import { usePreloadPages } from "@/lib/preloadPages";
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding fox and bear in the title this long opens the hidden management page. */
const IDEAS_HOLD_MS = 2000;

/** Where the books (the toy look's cards) lead. */
const HREFS = SHELF.map((entry) => entry.href);

/** Impressum and Datenschutz, below the first screen, for grown-ups. */
function LegalLink({ to, children }: { to: string; children: ReactNode }) {
  const turnPage = useTurnPage(to, "forward");
  return (
    <Link to={to} onClick={turnPage}>
      {children}
    </Link>
  );
}

/**
 * The home page: in the book look a room with a bookshelf, its books the categories (Bookshelf); in the toy look the
 * cards. Below the first screen, for grown-ups, the same in both.
 */
export function Home() {
  useTitle();
  const t = useT();
  useUpdateBetweenGames();
  usePreloadPages(HREFS);
  const secretProps = useSecretHold();
  const book = isBookLook();
  // In the book look the page's words and ours are little books in the shelf (RoomNotes), only the rest stays below.
  const foot = (
    <>
      <InstallHint />
      <SeoText words={!book}>
        {!book && <ParentsNote />}
        <p className="home-version">
          <LegalLink to="/impressum/">{t({ de: "Impressum" })}</LegalLink> · <LegalLink to="/datenschutz/">{t({ de: "Datenschutz" })}</LegalLink>
        </p>
      </SeoText>
    </>
  );
  if (book) return <Bookshelf secretProps={secretProps}>{foot}</Bookshelf>;
  return (
    <main className="home">
      <Sky />
      {/* The top of the page: the buttons for grown-ups and the title. */}
      <div className="home-top">
        <HomeOptions />
        <Logo secretProps={secretProps} />
      </div>
      <CategoryCards />
      {foot}
    </main>
  );
}

/** Holding fox and bear in the title opens the hidden management page: the handlers for them. */
function useSecretHold(): HTMLAttributes<HTMLElement> {
  const navigate = useNavigate();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginHold = () => {
    holdTimer.current = setTimeout(() => navigate("/management/"), IDEAS_HOLD_MS);
  };
  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  useEffect(() => cancelHold, []);

  return {
    onPointerDown: beginHold,
    onPointerUp: cancelHold,
    onPointerLeave: cancelHold,
    onPointerCancel: cancelHold,
    onContextMenu: (e) => e.preventDefault(),
  };
}

/**
 * The toy look's home page (`?buch=aus`): a card per book of the shelf – a category, with a piece of its world and its
 * games as a collage, or a game standing apart.
 */
function CategoryCards() {
  const t = useT();
  const grid = useFitGrid(SHELF.length);
  return (
    <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
      {SHELF.map(({ id, href, category: c, game }) => (
        <li key={id} data-world={c.id}>
          <GameCard
            href={href}
            emoji={game?.emoji ?? c.emoji}
            title={t(game?.title ?? c.title)}
            blurb={t(game?.blurb ?? c.blurb)}
            games={!game && hasPage(c) ? c.games.map((g) => g.emoji) : undefined}
            scene={<WorldCardScene world={c.id as WorldId} />}
          />
        </li>
      ))}
    </ul>
  );
}
