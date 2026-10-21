import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { GameCard } from "@/components/GameCard";
import { KID_HOME } from "@/components/GameShell";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { useTitle } from "@/lib/title";

const GAMES = [
  { href: "/buchstaben/", emoji: "🔤", title: "Buchstaben & Zahlen", text: "Taste drücken – Bild, Buchstabe und Zahl erscheinen." },
  { href: "/bilder/", emoji: "🖼️", title: "Lebendige Bilder", text: "Wimmelbilder zum Antippen – alles bewegt sich und spricht." },
  { href: "/woerter/", emoji: "✍️", title: "Wörter tippen", text: "Kurze Wörter Buchstabe für Buchstabe tippen." },
];

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
      <ul className="game-list">
        {GAMES.map((g) => (
          <li key={g.title}>
            <GameCard {...g} />
          </li>
        ))}
      </ul>
      <Link to={KID_HOME} className="kid-home-link">
        <span aria-hidden>🧸</span>
        <span>
          <strong>Kinder-Startseite</strong> – nur große Bilder im Vollbild, das Kind wählt selbst
        </span>
      </Link>
    </main>
  );
}
