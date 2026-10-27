import type { TargetLanguageId } from "../targetLanguages";

// Which game speaks which of the wanted languages (targetLanguages.ts), shown on
// the ideas page. Translations and recordings are made only when the grown-up asks
// for them (they cost tokens and credits), so this is the list of what is there and
// what is still missing. Kept by hand: when a game gains a language, or a new part
// comes in German only, mark it here in the same commit. content.test.ts checks the
// rows against the home menu, the language packs of the letters and words games,
// the translations and recordings of the Bewegungsabenteuer stories and the sung
// brushing songs.

/**
 * "done": all of it, recorded too where the part plays recordings; "text": translated,
 * but the recordings are still to make (only in parts that play recordings);
 * "partial": a part of it (say which in `note`).
 */
export type LanguageState = "done" | "text" | "partial";

/** A part of a game that gets its languages on its own, e.g. one story or the sung song. */
export interface LanguageStatusPart {
  /** German name of the part, as the grown-ups see it: "🏝️ Die Schatzinsel". */
  label: string;
  /** Languages it speaks; a language left out is still to do. */
  languages: Partial<Record<TargetLanguageId, LanguageState>>;
  /** It plays recordings (ElevenLabs voice, Suno song), so a language needs them made too; otherwise the browser's voice reads the text. */
  recorded?: boolean;
  /** What is special, e.g. what is missing or what makes the next language hard. */
  note?: string;
}

/** One game (or the home page) and the languages it speaks, as a whole or part by part. */
export interface LanguageStatusRow {
  /** The game's address in the home menu (games.ts), or "/" for the home page and everything for grown-ups. */
  href: string;
  /** Languages of the whole game, when it has no `parts`; a language left out is still to do. */
  languages?: Partial<Record<TargetLanguageId, LanguageState>>;
  /** The whole game plays recordings (see `LanguageStatusPart.recorded`). */
  recorded?: boolean;
  /** Parts with their own languages, when not the whole game has the same; the game's state follows from them. */
  parts?: LanguageStatusPart[];
  /** What is special, e.g. other languages it has or what makes the next one hard. */
  note?: string;
}

/**
 * A whole game in one language: done when every part is done, "text" when every part
 * is at least translated, partial when some part has something, undefined when none has.
 */
export function languageStateOf(row: LanguageStatusRow, language: TargetLanguageId): LanguageState | undefined {
  const states = (row.parts ?? [row]).map((part) => part.languages?.[language]);
  if (states.every((s) => s === "done")) return "done";
  if (states.every((s) => s === "done" || s === "text")) return "text";
  return states.some(Boolean) ? "partial" : undefined;
}

/** Every game of the home menu once, in menu order, then the home page. */
export const LANGUAGE_STATUS: LanguageStatusRow[] = [
  {
    href: "/bilder/",
    languages: { de: "done", ru: "partial" },
    note: "Viele Namen und Sätze je Bild; Russisch in ru.ts jeder Szene. Russisch fehlt (Oktober 2026): der Absatz zu Suchen und Fragen unter „Über das Spiel“ und das Lob für einen Teil in der Farbe („Da ist Rot!“; bis dahin lobt Russisch wie für das ganze Ding).",
  },
  {
    href: "/abenteuer/",
    note: "Tapsis Stimme ist von ElevenLabs aufgenommen (bun run voice make, kostet Credits); ohne Aufnahme liest die Browserstimme. Eine Geschichte ohne Übersetzung spricht Deutsch.",
    parts: [
      {
        label: "🏝️ Die Schatzinsel",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done", it: "done" },
      },
      {
        label: "☁️ Die Wolkenreise",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done", it: "done" },
      },
    ],
  },
  {
    href: "/gefuehle/",
    languages: { de: "done", ru: "partial" },
    note: "Russisch fehlt noch: zu Hause je Gefühl zwei nicht so gute Ideen, beim traurigen Bären alle drei (Runde mit nur zwei Karten, Oktober 2026) und zwei Absätze unter „Über das Spiel“; bis dahin auf Deutsch mit deutscher Stimme. Dazu die Fragen vor jeder Wahl, die sagen, wer handelt („Was machst du?“ / „Was kann der kleine Bär tun?“, Oktober 2026): bis dahin fragt Russisch allgemein („Как ты можешь ему помочь?“, „Что может сделать Мишка?“).",
  },
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
  {
    href: "/zaehne/",
    parts: [
      {
        label: "🪥 Hinweise und Bilder",
        languages: { de: "done", ru: "partial" },
        note: "Russisch fehlt nur „Musik lädt …“ (wenn das Lied nach dem Vorspann noch nicht da ist).",
      },
      {
        label: "🎵 Zahnputzlied (gesungen)",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ru: "done", it: "done" },
        note: "Text und Lied von Suno, eine neue Sprache: /zahnputzlied.",
      },
    ],
  },
  {
    href: "/toepfchen/",
    parts: [
      { label: "🚽 Bilder und Texte", languages: { de: "done" }, note: "Neu im Oktober 2026, nur auf Deutsch." },
      {
        label: "🎵 Warte-Lied (gesungen)",
        recorded: true,
        languages: { de: "done" },
        note: "„Warten auf dem Töpfchen“ von Suno (Oktober 2026), endlos wiederholt; der Text für Suno und für Übersetzungen steht in src/games/potty/musik/suno-lied.md. Eine neue Sprache: musik-toepfchen-warten-<Sprache>.mp3 und ihre Schleife in waitMusic.ts (/musik-erzeugen).",
      },
    ],
  },
  {
    href: "/laut-leise/",
    languages: { de: "done", ru: "partial" },
    note: "Russisch fehlt der Absatz zu Löwe und Maus unter „Über das Spiel“ (mit „Weiter“ zum Pusten, Oktober 2026).",
  },
  {
    href: "/",
    languages: { de: "done", ru: "partial" },
    note: "Startseite, Einstellungen und alles für Eltern (🌐 auf der Startseite); nur Management- und Suchmaschinenseiten bleiben Deutsch. Russisch fehlt: die neuen Texte der Spielzeit (Minuten oder Spiele, Sperre der Menüs) der Untertitel von „Weitere“ (mit Töpfchen) und „Schließen“ und „Weiter unten gibt es mehr“ der Optionen am Handy.",
  },
];
