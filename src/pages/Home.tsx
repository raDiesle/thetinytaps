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
 * For parents at the foot of the home page, a few words from us as parents: why no age is named (each family decides
 * when screens come in), that the real world comes first, then playing on a screen together, a learning game alone
 * later, and plain watching least – and that this book means to be that first step together.
 */
function ParentsNote() {
  const t = useT();
  return (
    <section className="seo-text parents-note">
      <h2>{t({ de: "Ein paar Worte von uns" })}</h2>
      <p>
        {t({
          de: "Wir sind selbst Eltern und haben Books for Both gemacht, weil wir uns immer wieder dieselbe Frage gestellt haben: Wie viel Bildschirm tut einem kleinen Kind eigentlich gut? Eine Altersangabe finden Sie hier deshalb nicht. Wann Ihr Kind die ersten Schritte ins Digitale macht, wissen Sie selbst am besten – jedes Kind ist anders, und jede Familie auch.",
        })}
      </p>
      <p>
        {t({
          de: "Ehrlich gesagt ist das Schönste ohnehin nicht digital. In Pfützen springen, Türme bauen und wieder umwerfen, ein Bilderbuch so oft vorlesen, bis alle es auswendig können – die echte Welt bleibt der beste Spielplatz, und kein Bildschirm kommt da heran.",
        })}
      </p>
      <p>
        {t({
          de: "Kommt der Bildschirm doch dazu, dann am liebsten zusammen: auf dem Schoß, ein kleiner Finger auf dem Bild, viel Staunen und Erzählen dazwischen. Später darf ein Kind auch mal allein ein kleines Lernspiel spielen. Am wenigsten halten wir vom bloßen Zuschauen, ein Video nach dem anderen, ohne selbst etwas zu tun.",
        })}
      </p>
      <p>
        {t({
          de: "Genau für diesen ersten gemeinsamen Schritt ist Books for Both gedacht: ein Bilderbuch, das Sie zusammen aufschlagen, das auf jedes Antippen antwortet – und das sich genauso gut wieder zuklappen lässt, um draußen weiterzuspielen. Wir wünschen Ihnen und Ihrem Kind viele schöne Momente damit, auf dem Bildschirm und noch viel mehr daneben.",
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
        <ParentsNote />
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
