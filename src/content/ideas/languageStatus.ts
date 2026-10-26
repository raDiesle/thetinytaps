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
  { href: "/bilder/", languages: { de: "done", ru: "done" }, note: "Viele Namen und Sätze je Bild; Russisch in ru.ts jeder Szene." },
  {
    href: "/abenteuer/",
    languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "done", it: "partial" },
    note: "Tapsis Stimme ist von ElevenLabs aufgenommen. Beide Geschichten sprechen Russisch (aufgenommen); die Schatzinsel auch Englisch, Chinesisch, Hindi, Spanisch und Arabisch (aufgenommen) und Italienisch (übersetzt, noch die Browserstimme); die Wolkenreise sonst nur Deutsch.",
  },
  { href: "/gefuehle/", languages: { de: "done", ru: "done" } },
  { href: "/kettenreaktion/", languages: { de: "done", ru: "done" } },
  { href: "/kleine-abenteuer/", languages: { de: "done", ru: "done" } },
  { href: "/tiere/", languages: { de: "done", ru: "done" } },
  { href: "/schatten/", languages: { de: "done", ru: "done" } },
  { href: "/socken/", languages: { de: "done", ru: "done" } },
  {
    href: "/buchstaben/",
    languages: { de: "done", en: "done", ru: "done" },
    note: "Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch. Russisch tippt jede Taste als den kyrillischen Buchstaben an ihrer Stelle (ЙЦУКЕН); Chinesisch, Hindi und Arabisch haben eine andere Schrift und Tastatur.",
  },
  {
    href: "/woerter/",
    languages: { de: "done", en: "done", ru: "done" },
    note: "Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch, dieselben Sprachpakete wie „Buchstaben & Zahlen“.",
  },
  { href: "/zaehne/", languages: { de: "done" }, note: "Das gesungene Zahnputzlied gibt es nur auf Deutsch (/zahnputzlied)." },
  { href: "/laut-leise/", languages: { de: "done" } },
  {
    href: "/",
    languages: { de: "done", ru: "done" },
    note: "Startseite, Einstellungen und alles für Eltern (🌐 auf der Startseite); nur die Ideenseite bleibt Deutsch.",
  },
];
