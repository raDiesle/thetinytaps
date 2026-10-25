import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { GameCard } from "@/components/GameCard";
import { HomeOptions } from "@/components/HomeOptions";
import { InstallHint } from "@/components/InstallHint";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { CATEGORIES, categoryHref } from "@/content/games";
import { useFitGrid } from "@/lib/fitGrid";
import { buildDate, useUpdateBetweenGames } from "@/lib/pwa";
import { useTitle } from "@/lib/title";

/** Holding the "p" in the title this long opens the hidden idea collection. */
const IDEAS_HOLD_MS = 2000;

export function Home() {
  useTitle();
  useUpdateBetweenGames();
  const navigate = useNavigate();
  const grid = useFitGrid(CATEGORIES.length);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginHold = () => {
    holdTimer.current = setTimeout(() => navigate("/ideen/"), IDEAS_HOLD_MS);
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
      <p className="home-subtitle">Spiele für die Kleinsten (2–3 Jahre)</p>
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <GameCard href={categoryHref(c)} emoji={c.emoji} title={c.title} />
          </li>
        ))}
      </ul>
      <InstallHint />
      <p className="home-version">Stand {buildDate()}</p>
    </main>
  );
}
