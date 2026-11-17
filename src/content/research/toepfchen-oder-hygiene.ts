import type { Research } from "./types";

export const toepfchenOderHygiene: Research = {
  id: "toepfchen-oder-hygiene",
  date: "2026-10-26",
  emoji: "🚽",
  title: "Töpfchen oder Hygiene – was wird mehr gesucht?",
  question: "Suchen Eltern bei Google mehr zu „Töpfchen und trocken werden“ oder zu „Hygiene, die das Kind nicht mag“ (Hände, Haare, Nase, Baden)?",
  method:
    "Google Trends war gesperrt (Firmen-Richtlinie im Browser), Zahlen zum Suchvolumen fanden sich im Netz nicht. Stattdessen Google-Autovervollständigung (Deutschland, Deutsch): zehn Eltern-Anfänge wie „kind will nicht“, „kleinkind will nicht“, „kind verweigert“, „kind hasst“, „kind 3 jahre“, je ohne und mit einem Buchstaben a–ü (rund 300 Abfragen), dann die Vorschläge je Thema gezählt; Fremdes wie „trockener husten“ oder „kaut fingernägel“ nicht mitgezählt. Mehr verschiedene und frühere Vorschläge heißen mehr Suchen – ein deutliches Zeichen, aber keine Zahl.",
  findings: [
    "Töpfchen und trocken werden liegt klar vorn: etwa 73 verschiedene Vorschläge gegen etwa 39 für Hygiene, also rund doppelt so viele.",
    "Bei „kleinkind will nicht “ ohne einen Buchstaben schlägt Google schon „aufs töpfchen“ und „auf toilette“ vor, keine Hygiene; bei „kind verweigert “ zweimal Stuhlgang.",
    "Hygiene erscheint ohne Buchstaben nur einmal: „kind hasst haare waschen“ (Platz 4).",
    "Innerhalb der Hygiene führen Baden und Duschen, dann Haare waschen; Hände waschen und Nase putzen kommen seltener.",
    "Eltern suchen beim Töpfchen vor allem das Verweigern: groß machen, Angst vor der Toilette, plötzlich nicht mehr, Windel nicht hergeben.",
  ],
  topics: [
    {
      emoji: "🚽",
      title: "Töpfchen und trocken werden",
      searches: [
        "kleinkind will nicht aufs töpfchen",
        "kind will nicht groß aufs klo",
        "kind angst vor toilette",
        "kleinkind will plötzlich nicht mehr aufs töpfchen",
        "kind will nicht trocken werden",
      ],
      ideas: ["H-06"],
    },
    {
      emoji: "🧼",
      title: "Hygiene, die das Kind nicht mag",
      searches: [
        "kind hasst haare waschen",
        "kind will nicht baden",
        "kind will nicht duschen",
        "kind will nicht hände waschen",
        "kind will nicht nase putzen",
      ],
      ideas: ["H-14", "H-07", "H-08"],
    },
  ],
  games: [],
  excluded: [{ title: "Stuhlgang-Farbe und Verstopfung", why: "Wird oft vorgeschlagen („grüner stuhlgang“), ist aber medizinischer Rat." }],
  ideas: [],
  sources: [],
};
