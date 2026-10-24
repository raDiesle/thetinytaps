import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { GameCard } from "@/components/GameCard";
import { KID_HOME } from "@/components/GameShell";
import { InstallHint } from "@/components/InstallHint";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { CATEGORIES, categoryHref } from "@/content/games";
import { useTitle } from "@/lib/title";

/** Holding the "p" in the title this long opens the hidden idea collection. */
const IDEAS_HOLD_MS = 2000;

export function Home() {
  useTitle();
  const navigate = useNavigate();
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
      <ul className="game-list category-list">
        {CATEGORIES.map((c) => (
          <li key={c.id}>
            <GameCard
              href={categoryHref(c)}
              emoji={c.emoji}
              title={c.title}
              text={c.games.map((g) => g.title).join(" · ")}
            />
          </li>
        ))}
      </ul>
      <Link to={KID_HOME} className="kid-home-link">
        <span aria-hidden>🧸</span>
        <span>
          <strong>Kinder-Startseite</strong> – nur große Bilder im Vollbild, das Kind wählt selbst
        </span>
      </Link>
      <InstallHint />
    </main>
  );
}
