import type { IdeaArea } from "./types";

/** F: Junge oder Mädchen – the child's own figure and the colours, split into tasks of one session each. */
export const figureIdeas: IdeaArea = {
  prefix: "F",
  emoji: "👧",
  title: "Junge oder Mädchen",
  intro:
    "Eltern wählen einmal in den Einstellungen auf der Startseite (⚙️), ob die Spielfigur ein Junge oder ein Mädchen ist. Standard bleibt der Junge – so ist alles bisher gebaut. Gemeint ist nur die Figur, die für das Kind selbst steht, und die Farben drumherum; Tiere (Tapsi, die Gefühle-Tiere) und die Leute in den Wimmelbildern bleiben, wie sie sind. Jede Idee hier ist eine Aufgabe für eine Sitzung; F-01 zuerst, dann F-02 bis F-04 in beliebiger Reihenfolge (auch gleichzeitig), F-05 zuletzt.",
  ideas: [
    {
      id: "F-01",
      emoji: "⚙️",
      title: "Einstellung „Junge / Mädchen“",
      text: "In den gemeinsamen Einstellungen (src/lib/common.ts) ein neues Feld, z. B. figure (boy oder girl), Standard boy (alte gespeicherte Werte brauchen keine Umstellung). In HomeOptions.tsx eine Wahl mit zwei großen Bildern 👦 / 👧. Dazu ein kleiner Hook wie useFigure(), den jedes Spiel fragt. Im Spiel ändert sich noch nichts – das machen F-02 bis F-05.",
      why: "Grundlage für alle F-Ideen; einmal einstellen, gilt für alle Spiele.",
      effort: "S",
    },
    {
      id: "F-02",
      emoji: "🎨",
      title: "Farben fürs Mädchen",
      text: "Mit „Mädchen“ bekommen Startseite, Kinder-Startseite und die Startbildschirme der Spiele eine zweite Farbwelt: die gemeinsamen Farben (--accent in src/styles/base.css und was die Menüs sonst teilen) als Variablen, die ein Attribut am html-Element umschaltet. Nicht einfach alles rosa – ein warmes Lila/Pink-Paar, das genauso freundlich ist. Mit „Junge“ bleibt alles wie jetzt. Braucht F-01.",
      why: "Das Kind sieht sofort: Das ist meins.",
      effort: "S",
    },
    {
      id: "F-03",
      emoji: "🛗",
      title: "Kleine Abenteuer: das Kind als Mädchen",
      text: "Die Hauptfigur HERO in src/games/elevator/kid.tsx (im Haus mit dem Aufzug und auf den Weg-Abenteuern in trail/TrailPlay.tsx) bekommt eine zweite Gestalt: längere Haare oder zwei Zöpfe, eigene Kleiderfarben, gleiche Größe und gleiche Posen, damit alle Bewegungen und Kleider (Schlafanzug, Stiefel, Mantel …) weiter passen. Der Bruder bleibt. Auch die Bilder auf den Karten und der Kachel im Menü, falls dort die Figur zu sehen ist. Braucht F-01.",
      why: "Das Spiel, in dem das Kind am deutlichsten sich selbst sieht.",
      effort: "M",
    },
    {
      id: "F-04",
      emoji: "🪥",
      title: "Zähne putzen: das Gesicht im Spiegel",
      text: "Das Kindergesicht im Spiegel (src/games/teeth/mouth.tsx, der Pony bewegt sich mit dem Kopf) bekommt mit „Mädchen“ eine andere Frisur, z. B. Zöpfe oder eine Haarspange, die sich genauso mitbewegt. Mund, Zähne und Monster bleiben gleich. Prüfen, ob der Text oder das gesungene Lied irgendwo „Junge“ sagt. Braucht F-01.",
      why: "Im Spiegel soll das Kind sich selbst erkennen.",
      effort: "S",
    },
    {
      id: "F-05",
      emoji: "🔎",
      title: "Alle Spiele durchsehen und Regel aufschreiben",
      text: "Alle Spiele nach Stellen durchgehen, an denen das Kind selbst gezeigt oder angesprochen wird (Zeichnungen, Bilder, gesprochene Sätze in allen Sprachen, „braver Junge“ o. Ä.), und die übrigen Stellen umstellen. Danach eine Regel in die CLAUDE.md im Hauptordner und in /neues-spiel: „Eine Figur, die für das Kind steht, folgt der Einstellung Junge/Mädchen“. Am besten mit einem Test, der das prüft. Zuletzt, wenn F-02 bis F-04 fertig sind.",
      why: "Damit kein neues Spiel die Einstellung vergisst.",
      effort: "S",
    },
  ],
};
