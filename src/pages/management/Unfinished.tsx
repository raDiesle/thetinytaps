import { Link } from "react-router";
import { UNFINISHED } from "@/content/games";
import { pick } from "@/lib/language";

/**
 * The games still being built (`Game.unfinished`): in no search result, and most on no shelf either, so linked here;
 * those already in their book with the label „in Bearbeitung“ (`"labelled"`) are said to be.
 */
export function Unfinished() {
  if (UNFINISHED.length === 0) return null;
  return (
    <section id="in-arbeit" className="ideas-panel">
      <h2>🚧 In Arbeit: Spiele, die noch nicht fertig sind</h2>
      <p className="ideas-hint">
        Nur von hier erreichbar, bis sie fertig sind; ✕ führt hierher zurück – außer bei denen, die schon mit dem Schild „in Bearbeitung“ im Buch stehen (dort
        nur auf diesem Rechner spielbar). Fertig: <code>unfinished</code> in games.ts entfernen.
      </p>
      <ul className="ideas-next-list">
        {UNFINISHED.map((game) => (
          <li key={game.href}>
            <Link to={game.href}>
              {game.emoji} {pick(game.title, "de")}
            </Link>
            <span className="ideas-hint">
              {pick(game.blurb, "de")}
              {game.unfinished === "labelled" && " · steht im Buch mit „in Bearbeitung“"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
