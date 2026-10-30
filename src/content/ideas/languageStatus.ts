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
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Viele Namen und Sätze je Bild; jede Sprache in <Sprache>.ts jeder Szene (ru.ts, en.ts …), Satzbau in phrases.ts.",
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
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Übersetzungen in bear.<Sprache>.ts und kita.<Sprache>.ts, Schritt für Schritt neben den deutschen Geschichten.",
  },
  {
    href: "/kettenreaktion/",
    parts: [
      { label: "🎢 Die anderen zwölf Level", languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" } },
      { label: "🛁 Badezimmer", languages: { de: "done" }, note: "Name, erster Satz und zwei Sätze der Maschine nur auf Deutsch (R-05)." },
      { label: "🐓 Bauernhof", languages: { de: "done" }, note: "Name, erster Satz und zwei Sätze unterwegs nur auf Deutsch." },
      { label: "🌙 Gute-Nacht-Maschine", languages: { de: "done" }, note: "Name, erster Satz und Gute-Nacht-Sätze nur auf Deutsch (R-07, Oktober 2026)." },
      { label: "🧸 Aufräum-Maschine", languages: { de: "done" }, note: "Name, erster Satz und „Alles aufgeräumt!“ nur auf Deutsch (R-08, Oktober 2026)." },
    ],
  },
  {
    href: "/kleine-abenteuer/",
    parts: [
      { label: "🧭 Die anderen sieben Geschichten", languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" } },
      {
        label: "🏖️ Die Sandburg",
        languages: { de: "done" },
        note: "Name und alle Sätze nur auf Deutsch (G-05, Oktober 2026); bis zur Übersetzung spricht das Level ganz Deutsch.",
      },
      {
        label: "🧺 Picknick im Wald",
        languages: { de: "done" },
        note: "Name und alle Sätze nur auf Deutsch (G-07, Oktober 2026); bis zur Übersetzung spricht das Level ganz Deutsch.",
      },
      {
        label: "⛵ Das Floß",
        languages: { de: "done" },
        note: "Name und alle Sätze nur auf Deutsch (G-08, Oktober 2026), ebenso der Kartenhinweis „🛶 Paddeln“; bis zur Übersetzung spricht das Level ganz Deutsch.",
      },
      {
        label: "🐈 Wo ist die Katze?",
        languages: { de: "done" },
        note: "Name und alle Sätze nur auf Deutsch (G-04, Oktober 2026); bis zur Übersetzung spricht das Level ganz Deutsch.",
      },
      {
        label: "⛄ Der Schneemann",
        languages: { de: "done" },
        note: "Name und alle Sätze nur auf Deutsch (G-06, Oktober 2026); bis zur Übersetzung spricht das Level ganz Deutsch.",
      },
    ],
  },
  { href: "/tiere/", languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" } },
  {
    href: "/schatten/",
    languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Gespielt wird ganz übersetzt; nur drei Absätze in „Über das Spiel“ (wie gespielt wird, wie die Schwierigkeit mitwächst, der Knopf für die Bilder) sind noch deutsch.",
  },
  {
    href: "/socken/",
    languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Gespielt wird ganz übersetzt; nur zwei Absätze in „Über das Spiel“ (Waschmaschine von selbst, wie die Schwierigkeit mitwächst) sind noch deutsch.",
  },
  {
    href: "/buchstaben/",
    languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Gespielt wird ganz übersetzt; noch deutsch sind seit den Optionen im Spiel (Oktober 2026) „Weiter spielen“, „Spielart“, „Was tippen?“, „Nur Zahlen“, „Ziffer erst zeigen, …“ und drei Absätze in „Über das Spiel“ (Optionen im Spiel, Nur Zahlen, Erster Buchstabe). Mit „Wörter tippen“. Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch. Jede Taste tippt den Buchstaben an ihrer Stelle der Tastatur der Sprache: Russisch ЙЦУКЕН, Hindi InScript, Arabisch die arabische Tastatur; Chinesisch tippt Pinyin auf lateinischen Tasten zu chinesischen Wörtern (B – 爸爸).",
  },
  {
    href: "/zaehne/",
    parts: [
      { label: "🪥 Hinweise und Bilder", languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" } },
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
      {
        label: "🚽 Bilder und Texte",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt im Oktober 2026; Tapsi heißt „Тапси“, „塔普西“, „टैप्सी“, „تابسي“.",
      },
      {
        label: "🎵 Warte-Lied (gesungen)",
        recorded: true,
        languages: { de: "done", en: "text", es: "done", ru: "done" },
        note: "„Warten auf dem Töpfchen“ von Suno (Oktober 2026), endlos wiederholt; der Text für Suno und für Übersetzungen steht in src/games/potty/musik/suno-lied.md. Russisch und Spanisch aufgenommen (Oktober 2026); Englisch: Text für Suno fertig, noch nicht aufgenommen. Eine neue Sprache: musik-toepfchen-warten-<Sprache>.mp3 und ihre Schleife in waitMusic.ts (/musik-erzeugen).",
      },
    ],
  },
  {
    href: "/belohnungstafel/",
    note: "Belohnungstafel und Tagesplan auf einer Seite (seit Oktober 2026), mit einem gemeinsamen Assistenten „＋ Neu“; /tagesplan/ öffnet dieselbe Seite.",
    parts: [
      {
        label: "🌟 Belohnungstafel",
        languages: { de: "done" },
        note: "Neu im Oktober 2026, nur auf Deutsch: Tafel, Gestalten, Drucken und der Katalog (catalog.ts). Für eine Sprache: die Labels im Katalog und die t()-Texte; Wochentage und Überschriften (possessive) brauchen je Sprache eine eigene Form.",
      },
      {
        label: "🗓️ Tagesplan",
        languages: { de: "done" },
        note: "Neu im Oktober 2026, nur auf Deutsch: Plan, Gestalten, Drucken und die Tagesschritte im Katalog (ACTIVITIES in src/games/rewards/catalog.ts).",
      },
      {
        label: "🧭 Assistent „＋ Neu“",
        languages: { de: "done" },
        note: "Nur auf Deutsch: Wizard.tsx, WizardBoard.tsx, WizardPlan.tsx und CHART_TYPES im Katalog.",
      },
    ],
  },
  {
    href: "/laut-leise/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Startseite, Einstellungen und alles für Eltern (🌐 auf der Startseite); nur Management- und Suchmaschinenseiten bleiben Deutsch.",
  },
];
