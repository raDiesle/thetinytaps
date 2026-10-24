import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { GameCard } from "@/components/GameCard";
import { KID_HOME } from "@/components/GameShell";
import { HomeOptions } from "@/components/HomeOptions";
import { InstallHint } from "@/components/InstallHint";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { useTitle } from "@/lib/title";

const GAMES = [
  { href: "/buchstaben/", emoji: "🔤", title: "Buchstaben & Zahlen", text: "Taste drücken – Bild, Buchstabe und Zahl erscheinen." },
  { href: "/bilder/", emoji: "🖼️", title: "Lebendige Bilder", text: "Wimmelbilder zum Antippen – alles bewegt sich und spricht." },
  { href: "/woerter/", emoji: "✍️", title: "Wörter tippen", text: "Kurze Wörter Buchstabe für Buchstabe tippen." },
  { href: "/zaehne/", emoji: "🦷", title: "Zähne putzen", text: "Zwei Minuten putzen, bis alle Zuckermonster weg sind." },
  { href: "/tiere/", emoji: "🐰", title: "Was gehört zum Tier?", text: "Tiere füttern und ihr Zuhause finden." },
  { href: "/schatten/", emoji: "👤", title: "Schatten finden", text: "Welcher Schatten gehört zum Bild? Antippen oder hinziehen." },
  { href: "/laut-leise/", emoji: "🦁", title: "Laut und leise", text: "Laut rufen – der Löwe brüllt. Leise flüstern – die Maus piepst." },
  { href: "/kugelbahn/", emoji: "🎢", title: "Kugelbahn", text: "Tippen – die Kugel rollt, klingelt und plumpst in den Korb. Oder alles fällt um, oder eine ganze Maschine läuft los." },
  { href: "/aufzug/", emoji: "🛗", title: "Aufzug", text: "Bildergeschichten: Die Gedankenblase zeigt, was das Kind braucht – mit dem Aufzug in die richtige Etage." },
  { href: "/abenteuer/", emoji: "🏝️", title: "Bewegungsabenteuer", text: "Mit dem Fuchs Tapsi zur Schatzinsel – paddeln, ducken, ziehen und mitmachen." },
  { href: "/gefuehle/", emoji: "🐻", title: "Gefühle", text: "Den Bären trösten – und üben, was man im Kindergarten tun kann." },
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
      <HomeOptions />
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
      <InstallHint />
    </main>
  );
}
