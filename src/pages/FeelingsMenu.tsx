import { Link } from "react-router";
import { FullscreenExit } from "@/components/FullscreenButton";
import { GameCard } from "@/components/GameCard";
import { Sky } from "@/components/Sky";
import { categoryHref, categoryOf } from "@/content/games";
import { PLACES } from "@/games/feelings/places";
import { useFitGrid } from "@/lib/fitGrid";
import { useTitle } from "@/lib/title";

const CATEGORY = categoryOf("/gefuehle/");

/** The first menu of Gefühle: where the stories happen. */
export function FeelingsMenu() {
  useTitle("Gefühle");
  const grid = useFitGrid(PLACES.length);
  return (
    <main className="home">
      <Sky />
      <FullscreenExit />
      <Link to={CATEGORY ? categoryHref(CATEGORY) : "/"} className="back-link">
        ← {CATEGORY?.title ?? "Alle Spiele"}
      </Link>
      <h1 className="menu-title">
        <span aria-hidden>🐻</span> Gefühle
      </h1>
      <p className="home-subtitle">Wo spielt die Geschichte?</p>
      <ul ref={grid.ref} className={`game-list ${grid.className}`} style={grid.style}>
        {PLACES.map((p) => (
          <li key={p.id}>
            <GameCard href={`/gefuehle/${p.id}/`} emoji={p.emoji} title={p.title} />
          </li>
        ))}
      </ul>
    </main>
  );
}
