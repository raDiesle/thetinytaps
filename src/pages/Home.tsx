import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { BookCover } from "@/components/BookCover";
import { BookFamily } from "@/components/BookFamily";
import { GameCard } from "@/components/GameCard";
import { HomeOptions } from "@/components/HomeOptions";
import { InstallHint } from "@/components/InstallHint";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { type WorldId, WorldCardScene } from "@/components/Worlds";
import { CATEGORIES, categoryHref, hasPage } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { useT } from "@/lib/language";
import { usePreloadPages } from "@/lib/preloadPages";
import { buildDate, useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding the "p" in the title this long opens the hidden idea collection. */
const IDEAS_HOLD_MS = 2000;

/** The categories behind a card of their own. */
const CARDS = CATEGORIES.filter((c) => !c.onHome);
/** The categories whose games stand right on the home page, each on a frame named after it. */
const FRAMED = CATEGORIES.filter((c) => c.onHome);
/** How many cards each group on the page has: first the category cards, then each framed category's games. */
const GROUPS = [CARDS.length, ...FRAMED.map((c) => c.games.length)];
/** The page of the book each card's chapter starts on, in the book look: the contents page lists them in order. */
const pageOf = (card: number) => 3 + card * 4;
/** Where all cards of the page lead. */
const HREFS = [...CARDS.map(categoryHref), ...FRAMED.flatMap((c) => c.games.map((g) => g.href))];

export function Home() {
  useTitle();
  const t = useT();
  useUpdateBetweenGames();
  usePreloadPages(HREFS);
  const navigate = useNavigate();
  const grid = useFitGrid(
    GROUPS.reduce((a, b) => a + b, 0),
    GROUPS,
  );
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
      <ul ref={grid.ref} className={`game-list mode-list ${grid.className}`} style={grid.style}>
        {/* The category cards stand on no frame: a group of their own only so the framed games keep together. */}
        <li className="mode-group mode-group-bare" style={grid.places?.[0]}>
          <ul className="mode-group-cards">
            {/* Each card shows a piece of its category's world, and the games behind it as a collage. */}
            {CARDS.map((c, i) => (
              <li key={c.id} data-world={c.id}>
                <GameCard
                  href={categoryHref(c)}
                  emoji={c.emoji}
                  title={t(c.title)}
                  blurb={c.blurb && t(c.blurb)}
                  games={hasPage(c) ? c.games.map((g) => g.emoji) : undefined}
                  scene={<WorldCardScene world={c.id as WorldId} />}
                  page={pageOf(i)}
                />
              </li>
            ))}
          </ul>
        </li>
        {FRAMED.map((c, i) => (
          <li key={c.id} className="mode-group" data-world={c.id} style={grid.places?.[i + 1]}>
            <span className="mode-group-label">
              <span aria-hidden>{c.emoji}</span> {t(c.title)}
            </span>
            <ul className="mode-group-cards" aria-label={t(c.title)}>
              {c.games.map((g, j) => (
                <li key={g.href}>
                  <GameCard
                    href={g.href}
                    emoji={g.emoji}
                    title={t(g.title)}
                    blurb={t(g.blurb)}
                    page={pageOf(CARDS.length + FRAMED.slice(0, i).reduce((n, f) => n + f.games.length, 0) + j)}
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <InstallHint />
      <BookCover />
      <p className="home-version">
        {t({ de: "Stand", ru: "Версия от", en: "Version", zh: "版本", hi: "संस्करण", es: "Versión", ar: "الإصدار" })} {buildDate()}
      </p>
    </main>
  );
}
