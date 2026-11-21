import type { Research } from "./types";

export const tagesplan: Research = {
  id: "tagesplan",
  area: "suchen",
  date: "2026-10-28",
  emoji: "🗓️",
  title: "Tagesplan und Strukturtafel – wonach Eltern suchen",
  question: "Suchen Eltern von Zwei- und Dreijährigen nach Tagesplänen in Bildern (Strukturtafel, Tagesablauf, Wochenplan), und in welcher Form?",
  method:
    "Google-Autovervollständigung (Deutschland, Deutsch) für 26 Anfänge wie „tagesablauf kinder“, „strukturtafel“, „wochenplan kinder“, „routinekarten“, „first then board“, „visual schedule toddler“, am 28. Oktober 2026. Sie zeigt, was viele eintippen, aber keine Zahlen.",
  findings: [
    "Gesucht wird in Bildern und zum Ausdrucken: „tagesablauf kindergarten bildkarten (pdf)“, „bildkarten tagesablauf kostenlos ausdrucken“, „piktogramme tagesablauf kinder“, „routinekarten kinder pdf kostenlos“.",
    "Morgen und Abend sind eigene Suchen: „morgenroutine kinder bilder zum ausdrucken“, „abendroutine kinder vorlage“, „ablaufplan morgenroutine kinder“.",
    "Der Wochenplan ist eine Tafel mit Symbolen, oft magnetisch: „wochenplan kinder symbole zum ausdrucken kostenlos“, „wochenplan kinder magnet (selber machen)“, „wochenplaner kinder montessori“.",
    "Nach dem Alter: „tagesablauf kleinkind 2 jahre“, „… 18 monate“, „… 3 jahre“ – Eltern suchen, wie ein Tag in dem Alter aussieht.",
    "„Strukturtafel“ selbst wird kaum gesucht (nur „strukturtafel kinder“); „Erst-dann-Karten“ kennt man vor allem aus METACOM, auf Englisch ist das „first then board“ (printable, autism, ABA) häufig.",
    "Darum: ein Tagesplan mit Vorlagen (Morgen, Abend, Tag mit Kita, Erst–Dann, Wochenplan), auf dem Bildschirm zum Abtippen und gedruckt mit allen Bildern als Karten zum Ausschneiden.",
  ],
  topics: [
    {
      emoji: "🃏",
      title: "Bildkarten zum Ausdrucken",
      searches: [
        "tagesablauf kindergarten bildkarten pdf",
        "bildkarten tagesablauf kostenlos ausdrucken",
        "piktogramme tagesablauf kinder",
        "routinekarten kinder pdf kostenlos",
      ],
      ideas: ["H-03", "T-20", "H-42"],
    },
    {
      emoji: "🌅",
      title: "Morgen- und Abendroutine",
      searches: ["morgenroutine kinder bilder zum ausdrucken", "abendroutine kinder vorlage", "ablaufplan morgenroutine kinder", "routineplan kinder"],
      ideas: ["H-03", "H-43"],
    },
    {
      emoji: "📅",
      title: "Wochenplan mit Symbolen",
      searches: ["wochenplan kinder symbole zum ausdrucken kostenlos", "wochenplan kinder magnet", "wochenplaner kinder montessori", "kinderplaner woche"],
      ideas: ["H-41"],
    },
    {
      emoji: "➡️",
      title: "Erst – Dann",
      searches: ["erst dann karten", "first then board", "first then board printable"],
      ideas: ["H-03"],
    },
  ],
  games: [
    {
      href: "/tagesplan/",
      searches: ["tagesablauf kinder", "tagesplan kinder bilder", "wochenplan kinder", "morgenroutine kinder bilder"],
      title: "Tagesplan für Kinder – Tag und Woche in Bildern",
    },
  ],
  excluded: [
    {
      title: "Uhrzeiten auf den Karten",
      why: "Zweijährige lesen keine Uhr; die Reihenfolge und „Jetzt – Dann“ zählen, die Woche zählt Monde bis zu einem Tag.",
    },
    { title: "Kleine Magnete", why: "Verschluckungsgefahr unter drei Jahren; die gedruckten Karten sind groß und halten mit Klett." },
  ],
  ideas: ["H-41", "H-42", "H-43"],
  sources: [],
};
