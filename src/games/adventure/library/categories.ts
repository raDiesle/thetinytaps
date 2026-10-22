import type { MovementCategory } from "./types";

// Result A: the final categories. The six starting ones are kept; the new ones
// each cover movements the six could not hold without stretching. "Arms and
// legs together" is no category of its own: every movement says its bodyZone.

export const CATEGORIES: MovementCategory[] = [
  {
    id: "push_pull",
    name: "Drücken und Ziehen",
    emoji: "🚪",
    description: "Mit den Händen gegen etwas drücken, etwas schieben oder zu sich heranziehen – Türen, Seile, Hebel, Wolken.",
    notIncluded: "Werkzeuge, die man hält und bewegt (Pumpe, Schaufel), stehen bei „Werkzeuge nachmachen“.",
  },
  {
    id: "dodge_lean",
    name: "Ausweichen und Neigen",
    emoji: "🌀",
    description: "Den Oberkörper zur Seite oder nach vorn neigen, sich ducken und wieder aufrichten; die Füße bleiben stehen.",
    notIncluded: "Wenn die Füße mitgehen, ist es „Seitwärts treten“; sich ganz klein machen ohne Ausweichen ist „Strecken und Klein machen“.",
  },
  {
    id: "side_steps",
    name: "Seitwärts treten",
    emoji: "👣",
    description: "Kleine Schritte zur Seite, Antippen mit dem Fuß, gezielt auf eine Stelle treten.",
    notIncluded: "Auf der Stelle gehen ist „Marschieren und Stampfen“; Tiergänge wie der Pinguin sind „Tiere nachmachen“.",
  },
  {
    id: "hop_bounce",
    name: "Federn und Hüpfen",
    emoji: "🦘",
    description: "In den Knien federn, kleine Sprünge – immer mit einer Variante ohne Sprung.",
    notIncluded: "Tiere, die hüpfen (Frosch, Känguru), stehen bei „Tiere nachmachen“ und haben dieselbe Sprung-Kennzeichnung.",
  },
  {
    id: "shake_dance",
    name: "Schütteln und Tanzen",
    emoji: "💃",
    description: "Hände, Arme, Schultern oder den ganzen Körper locker schütteln, wackeln, zur Musik tanzen, jubeln.",
    notIncluded: "Tanzen mit Einfrieren gehört zu „Stopp und Los“.",
  },
  {
    id: "animal_mimicry",
    name: "Tiere nachmachen",
    emoji: "🐘",
    description: "Ein Tier mit dem ganzen Körper spielen: seine Gangart, seine typische Geste, sein Geräusch.",
    notIncluded: "Reine Körperformen ohne Tier (Stern, Rakete) stehen bei „Strecken und Klein machen“.",
  },
  {
    id: "reach_point",
    name: "Greifen, Zeigen und Wischen",
    emoji: "✋",
    description: "Mit einer oder beiden Händen nach etwas greifen, darauf zeigen, es antippen oder wegwischen.",
    notIncluded: "Etwas loslassen, das fliegt, ist „Werfen und Fangen“.",
  },
  {
    id: "throw_catch",
    name: "Werfen und Fangen",
    emoji: "🎣",
    description: "Ausholen und werfen, streuen, auswerfen – oder die Arme öffnen und etwas auffangen.",
    notIncluded: "Ohne Gegenstand in der Luft (nur zeigen, tippen) ist es „Greifen, Zeigen und Wischen“.",
  },
  {
    id: "stretch_curl",
    name: "Strecken und Klein machen",
    emoji: "🌱",
    description: "Sich ganz groß strecken, ganz klein zusammenrollen, Körperformen bilden (Stern, Blume, Regenbogen).",
    notIncluded: "Sich ducken, um etwas auszuweichen, ist „Ausweichen und Neigen“.",
  },
  {
    id: "march_stomp",
    name: "Marschieren und Stampfen",
    emoji: "🥁",
    description: "Auf der Stelle gehen, die Knie heben, stampfen, Treppen steigen – Beine abwechselnd.",
    notIncluded: "Vorsichtiges, langsames Gehen auf Zehen oder einer Linie ist „Balancieren“.",
  },
  {
    id: "balance",
    name: "Balancieren",
    emoji: "🦩",
    description: "Langsam und vorsichtig: auf Zehenspitzen, kurz auf einem Bein, Fuß vor Fuß, etwas Gedachtes ruhig tragen.",
    notIncluded: "Alles mit Schwung oder Tempo; Balance-Bewegungen sind immer gekennzeichnet (needs.balance).",
  },
  {
    id: "turn",
    name: "Drehen und Umschauen",
    emoji: "🎠",
    description: "Sich langsam auf der Stelle umdrehen oder nur den Oberkörper drehen, um sich umzuschauen.",
    notIncluded: "Schnelles Kreiseln gibt es nicht (Schwindel, Sturz).",
  },
  {
    id: "stop_go",
    name: "Stopp und Los",
    emoji: "🚦",
    description: "Bewegen und auf ein klares Zeichen einfrieren, ganz still sein, dann weiter – Rhythmus und Selbstbeherrschung.",
    notIncluded: "Reines Tanzen ohne Stopp ist „Schütteln und Tanzen“.",
  },
  {
    id: "travel_strokes",
    name: "Paddeln, Rudern, Schwimmen, Fliegen",
    emoji: "🛶",
    description: "Wiederkehrende Armzüge, die in der Fantasie vorwärts bringen: paddeln, rudern, schwimmen, fliegen, lenken.",
    notIncluded: "Flattern wie ein bestimmter Vogel ist „Tiere nachmachen“.",
  },
  {
    id: "tool_mimicry",
    name: "Werkzeuge nachmachen",
    emoji: "🔨",
    description: "Ein gedachtes Ding in der Hand benutzen: Hammer, Schaufel, Gießkanne, Zauberstab, Trommel, Pumpe.",
    notIncluded: "Große Dinge, die man mit dem Körper bewegt (Tür, Truhe), sind „Drücken und Ziehen“.",
  },
];
