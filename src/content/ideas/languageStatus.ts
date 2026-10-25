import type { TargetLanguageId } from "../targetLanguages";

// Which game speaks which of the wanted languages (targetLanguages.ts), shown on
// the ideas page. Kept by hand: when a game gains a language, mark it here in the
// same commit. content.test.ts checks the rows against the home menu and the
// language packs of the letters and words games.

/** "done": the whole game in that language; "partial": a part of it (say which in `note`). */
export type LanguageState = "done" | "partial";

/** One game (or the home page) and the languages it speaks. */
export interface LanguageStatusRow {
  /** The game's address in the home menu (games.ts), or "/" for the home page and everything for grown-ups. */
  href: string;
  /** Languages it speaks; a language left out is still to do. */
  languages: Partial<Record<TargetLanguageId, LanguageState>>;
  /** What is special, e.g. other languages it has or what makes the next one hard. */
  note?: string;
}

/** Every game of the home menu once, in menu order, then the home page. */
export const LANGUAGE_STATUS: LanguageStatusRow[] = [
  { href: "/bilder/", languages: { de: "done" }, note: "Viele Namen und Sätze je Bild (content.ts jeder Szene)." },
  {
    href: "/abenteuer/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "partial", it: "partial" },
    note: "Tapsis Stimme ist von ElevenLabs aufgenommen. Russisch und Italienisch sind übersetzt, aber noch nicht aufgenommen (Credits); bis dahin liest die Browserstimme.",
  },
  { href: "/gefuehle/", languages: { de: "done" } },
  { href: "/kettenreaktion/", languages: { de: "done" } },
  { href: "/kleine-abenteuer/", languages: { de: "done" } },
  { href: "/tiere/", languages: { de: "done" } },
  { href: "/schatten/", languages: { de: "done" } },
  { href: "/socken/", languages: { de: "done" } },
  {
    href: "/buchstaben/",
    languages: { de: "done", en: "done" },
    note: "Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch. Chinesisch, Hindi, Arabisch und Russisch haben eine andere Schrift und Tastatur.",
  },
  {
    href: "/woerter/",
    languages: { de: "done", en: "done" },
    note: "Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch, dieselben Sprachpakete wie „Buchstaben & Zahlen“.",
  },
  { href: "/zaehne/", languages: { de: "done" }, note: "Das gesungene Zahnputzlied gibt es nur auf Deutsch (/zahnputzlied)." },
  { href: "/laut-leise/", languages: { de: "done" } },
  { href: "/", languages: { de: "done" }, note: "Startseite, Einstellungen und alles für Eltern." },
];
