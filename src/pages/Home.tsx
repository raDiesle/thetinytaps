import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { GameCard } from "@/components/GameCard";
import { HomeOptions } from "@/components/HomeOptions";
import { InstallHint } from "@/components/InstallHint";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { CATEGORIES, categoryHref } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { useT } from "@/lib/language";
import { buildDate, useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding the "p" in the title this long opens the hidden idea collection. */
const IDEAS_HOLD_MS = 2000;

export function Home() {
  useTitle();
  const t = useT();
  useUpdateBetweenGames();
  const navigate = useNavigate();
  const grid = useFitGrid(CATEGORIES.length);
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
      <HomeOptions />
      <Logo
        secretProps={{
          onPointerDown: beginHold,
          onPointerUp: cancelHold,
          onPointerLeave: cancelHold,
          onPointerCancel: cancelHold,
          onContextMenu: (e) => e.preventDefault(),
        }}
      />
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <GameCard href={categoryHref(c)} emoji={c.emoji} title={t(c.title)} />
          </li>
        ))}
      </ul>
      <InstallHint />
      <p className="home-version">
        {t({ de: "Stand", ru: "Версия от", en: "Version", zh: "版本", hi: "संस्करण", es: "Versión", ar: "الإصدار" })} {buildDate()}
      </p>
    </main>
  );
}
