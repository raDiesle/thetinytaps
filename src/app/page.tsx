import Link from "next/link";

const GAMES = [
  { href: "/buchstaben/", emoji: "🔤", title: "Buchstaben & Zahlen", text: "Taste drücken – Bild, Buchstabe und Zahl erscheinen." },
  { emoji: "✍️", title: "Wörter tippen", text: "Kurze Wörter Buchstabe für Buchstabe tippen." },
  { emoji: "🏗️", title: "Wimmelbild Baustelle", text: "Bagger, Kran und Co. anklicken und entdecken." },
];

export default function Home() {
  return (
    <main className="home">
      <h1>The Tiny Taps</h1>
      <p className="home-subtitle">Spiele für die Kleinsten (2–3 Jahre)</p>
      <ul className="game-list">
        {GAMES.map((g) => (
          <li key={g.title}>
            {g.href ? (
              <Link href={g.href} className="game-card">
                <GameCardContent {...g} />
              </Link>
            ) : (
              <div className="game-card disabled" aria-disabled>
                <GameCardContent {...g} />
                <span className="badge">bald</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

function GameCardContent({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <>
      <span className="game-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="game-title">{title}</span>
      <span className="game-text">{text}</span>
    </>
  );
}
