import { GameShell } from "@/components/GameShell";
import { de } from "@/content/de";
import { useGameSettings } from "@/lib/common";
import { MarblePlay } from "./MarblePlay";
import { DEFAULT_MARBLE_SETTINGS, MARBLE_SETTINGS_KEY, type MarbleLevels } from "./settings";

export function MarbleGame() {
  const [settings, update] = useGameSettings(MARBLE_SETTINGS_KEY, DEFAULT_MARBLE_SETTINGS);

  return (
    <GameShell
      title="Kugelbahn"
      emoji="🎢"
      modes={[
        { id: "all", emoji: "🌈", title: "Alle nacheinander", text: "Eine Bahn nach der anderen." },
        { id: "machines", emoji: "🛠️", title: "Alle Maschinen", text: "Nur die sechs großen Maschinen, nacheinander." },
        {
          id: "track",
          emoji: "🎢",
          title: "Kugelbahn",
          text: "Jedes Tippen lässt eine Kugel los: Xylophon, Glocke, Trichter, Wippe – bis der Korb voll ist.",
        },
        {
          id: "topple",
          emoji: "📚",
          title: "Alles fällt um",
          text: "Buntstift, Bauklotz, Bücher … ein Tipp, und eins fällt nach dem anderen um.",
        },
        {
          id: "machine",
          emoji: "⚙️",
          title: "Große Maschine",
          text: "Kugel, Dominosteine, Auto im Looping, Zug und Springteufel – eine halbe Minute lang.",
        },
        { id: "kitchen", emoji: "🍳", title: "Verrückte Küche", text: "Bis der Toaster den Toast zum Hasen schießt." },
        { id: "garden", emoji: "🌻", title: "Im Garten", text: "Gießkanne, Wasserrad, Rasensprenger – bis die Sonnenblume blüht." },
        { id: "building", emoji: "🚧", title: "Baustelle", text: "Bis der Kran das Dach auf das Haus setzt." },
        { id: "circus", emoji: "🎪", title: "Zirkus", text: "Bis der Clown ins Netz fliegt und der Vorhang aufgeht." },
        { id: "space", emoji: "🚀", title: "Raketenstart", text: "3, 2, 1 – und die Rakete fliegt zum Mond." },
      ]}
      mode={settings.levels === "both" ? "all" : settings.levels}
      onMode={(levels) => update({ levels: levels as MarbleLevels })}
      settings={
        <p className="setting-note">
          Jede Maschine läuft nach einem Tipp etwa eine halbe Minute, und das Bild fährt mit. Bei der Kugelbahn dürfen mehrere Kugeln
          gleichzeitig rollen; ist der Korb voll, kommt die nächste Bahn.
        </p>
      }
    >
      <MarblePlay speechLang={de.speechLang} settings={settings} />
    </GameShell>
  );
}
