import { type ReactNode, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { BookCover } from "@/components/BookCover";
import { BookFamily } from "@/components/BookFamily";
import { Bookshelf } from "@/components/Bookshelf";
import { GameCard } from "@/components/GameCard";
import { HomeOptions } from "@/components/HomeOptions";
import { InstallHint } from "@/components/InstallHint";
import { SeoText } from "@/components/SeoText";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { CATEGORIES, categoryHref, hasPage } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { isBookLook, useTurnPage } from "@/lib/look";
import { useT } from "@/lib/language";
import { usePreloadPages } from "@/lib/preloadPages";
import { buildDate, useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding fox and bear in the title this long opens the hidden management page. */
const IDEAS_HOLD_MS = 2000;

/** Where the books (the toy look's cards) lead. */
const HREFS = CATEGORIES.map(categoryHref);

/** Impressum and Datenschutz, below the first screen with the version, for grown-ups. */
function LegalLink({ to, children }: { to: string; children: ReactNode }) {
  const turnPage = useTurnPage(to, "forward");
  return (
    <Link to={to} onClick={turnPage}>
      {children}
    </Link>
  );
}

export function Home() {
  useTitle();
  const t = useT();
  useUpdateBetweenGames();
  usePreloadPages(HREFS);
  const navigate = useNavigate();
  const shelf = isBookLook();
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginHold = () => {
    holdTimer.current = setTimeout(() => navigate("/management/"), IDEAS_HOLD_MS);
  };
  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
  };

  useEffect(() => cancelHold, []);

  return (
    <main className="home">
      <Sky />
      {/* The top of the page: the buttons for grown-ups and the title – in the book look one row on a phone, the title
          in the top left, and the animal families beside the title where there is room. */}
      <div className="home-top">
        <HomeOptions />
        <BookFamily family="fox" />
        <Logo
          secretProps={{
            onPointerDown: beginHold,
            onPointerUp: cancelHold,
            onPointerLeave: cancelHold,
            onPointerCancel: cancelHold,
            onContextMenu: (e) => e.preventDefault(),
          }}
        />
        <BookFamily family="bear" />
      </div>
      {shelf ? <Bookshelf /> : <CategoryCards />}
      <InstallHint />
      <BookCover />
      <SeoText>
        <p className="home-version">
          {t({ de: "Stand", ru: "Версия от", en: "Version", zh: "版本", hi: "संस्करण", es: "Versión", ar: "الإصدار" })} {buildDate()} ·{" "}
          <LegalLink to="/impressum/">{t({ de: "Impressum" })}</LegalLink> · <LegalLink to="/datenschutz/">{t({ de: "Datenschutz" })}</LegalLink>
        </p>
      </SeoText>
    </main>
  );
}

/** The toy look's home page (`?buch=aus`): a card per category, a piece of its world and its games as a collage. */
function CategoryCards() {
  const t = useT();
  const grid = useFitGrid(CATEGORIES.length);
  return (
    <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
      {CATEGORIES.map((c) => (
        <li key={c.id} data-world={c.id}>
          <GameCard
            href={categoryHref(c)}
            emoji={c.emoji}
            title={t(c.title)}
            blurb={t(c.blurb)}
            games={hasPage(c) ? c.games.map((g) => g.emoji) : undefined}
            scene={<WorldCardScene world={c.id as WorldId} />}
          />
        </li>
      ))}
    </ul>
  );
}
