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
import { useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding fox and bear in the title this long opens the hidden management page. */
const IDEAS_HOLD_MS = 2000;

/** Where the books (the toy look's cards) lead. */
const HREFS = CATEGORIES.map(categoryHref);

/**
 * For parents at the foot of the home page: no age to start at (each family decides that itself), but the steps
 * from analog to digital, best first, and where this book stands among them – always on the first step into digital,
 * played together.
 */
function MediaSteps() {
  const t = useT();
  return (
    <section className="seo-text media-steps">
      <h2>{t({ de: "Wann ist die richtige Zeit für Bildschirme?" })}</h2>
      <p>
        {t({
          de: "Das entscheiden Sie als Eltern – Sie kennen Ihr Kind am besten. Darum nennen wir kein Alter. Digitale Medien sind für kleine Kinder immer ein Grenzfall, und Analoges ist immer besser. Wenn Ihr Kind anfängt, hilft diese Reihenfolge, von der besten Stufe zur schlechtesten:",
        })}
      </p>
      <ol>
        <li>
          <b>{t({ de: "Die echte Welt und analoge Spiele" })}</b> –{" "}
          {t({ de: "draußen sein, Bücher, Bauklötze, zusammen spielen. Das kommt vor allem Digitalen." })}
        </li>
        <li>
          <b>{t({ de: "Digital zusammen mit Ihnen" })}</b> – {t({ de: "Groß und Klein schauen, tippen und reden gemeinsam." })}
        </li>
        <li>
          <b>{t({ de: "Lernspiele allein" })}</b> – {t({ de: "später spielt Ihr Kind einfache Lernspiele auch ohne Sie." })}
        </li>
        <li>
          <b>{t({ de: "Passiver Medienkonsum" })}</b> – {t({ de: "Videos und Serien, bei denen das Kind nur zuschaut, sind die schlechteste Stufe." })}
        </li>
      </ol>
      <p>
        {t({
          de: "Books for Both bleibt immer auf der ersten Stufe vom Analogen ins Digitale: ein Bilderbuch, das Sie zusammen mit Ihrem Kind anschauen. So bekommt Ihr Kind einen guten Einstieg in den Umgang mit Medien.",
        })}
      </p>
    </section>
  );
}

/** Impressum and Datenschutz, below the first screen, for grown-ups. */
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
        <MediaSteps />
        <p className="home-version">
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
