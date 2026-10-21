import { GameCard } from "@/components/GameCard";
import { Logo } from "@/components/Logo";
import { Sky } from "@/components/Sky";
import { useTitle } from "@/lib/title";

const GAMES = [
  { href: "/buchstaben/", emoji: "🔤", title: "Buchstaben & Zahlen", text: "Taste drücken – Bild, Buchstabe und Zahl erscheinen." },
  { href: "/bilder/", emoji: "🖼️", title: "Lebendige Bilder", text: "Wimmelbilder zum Antippen – alles bewegt sich und spricht." },
  { href: "/woerter/", emoji: "✍️", title: "Wörter tippen", text: "Kurze Wörter Buchstabe für Buchstabe tippen." },
];

export function Home() {
  useTitle();
  return (
    <main className="home">
      <Sky />
      <Logo />
      <p className="home-subtitle">Spiele für die Kleinsten (2–3 Jahre)</p>
      <ul className="game-list">
        {GAMES.map((g) => (
          <li key={g.title}>
            <GameCard {...g} />
          </li>
        ))}
      </ul>
    </main>
  );
}
