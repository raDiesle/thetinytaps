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
    note: "Viele Namen und Sätze je Bild; jede Sprache in <Sprache>.ts jeder Szene (ru.ts, en.ts …), Satzbau in phrases.ts.",
    parts: [
      { label: "🖼️ Bilder und Spielarten", languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" } },
      {
        label: "🔦 Taschenlampe",
        languages: { de: "done" },
        note: "Nur der Name der Spielart im Menü (SCENE_MODES in settings.ts) ist neu; das Spiel selbst sagt nur, was die Bilder schon sagen.",
      },
      {
        label: "🛣️ Straße malen",
        languages: { de: "done" },
        note: "Neu sind nur der Name der Spielart (SCENE_MODES) und der Hinweis „Mal eine Straße!“ (roadPrompts in phrases.ts); sonst sprechen nur die Bilder.",
      },
    ],
  },
  {
    href: "/abenteuer/",
    note: "Tapsis Stimme ist von ElevenLabs aufgenommen (bun run voice make, kostet Credits); ohne Aufnahme bleibt der Satz stumm (keine Browserstimme). Eine Geschichte ohne Übersetzung spricht Deutsch.",
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
      {
        label: "🎢 Klingende Kugelbahn und die Maschinen",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
      },
      {
        label: "☃️ Schneebahn, 🪐 Weltraumbahn, 🛟 Wasserrutsche, 🏗️ Baustellen-Bahn",
        languages: { de: "done" },
        note: "Name, erster Satz und der Satz am Ende jeder Bahn (Oktober 2026) gibt es nur auf Deutsch; die Teile, die sie mit der Holzbahn teilen, sprechen alle Sprachen.",
      },
      {
        label: "🚧 Schranke und Weiche der Kugelbahn",
        languages: { de: "done" },
        note: "Die Wahl „Schranke und Weiche: 👆 Kind tippt / 🔄 Von selbst“ und der Satz „Achtung, fertig – los!“ (K-01, K-02, Oktober 2026) gibt es nur auf Deutsch.",
      },
    ],
  },
  {
    href: "/kleine-abenteuer/",
    parts: [
      {
        label: "🛗 Aufzug-Geschichten und die ersten vier Wege",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Alle Sätze von ElevenLabs gesprochen (Tapsis Stimme, 30. Oktober 2026).",
      },
      {
        label: "🏖️ Die fünf neueren Wege und 🚒 Die Feuerwehr",
        recorded: true,
        languages: { de: "done", en: "text", zh: "text", hi: "text", es: "text", ar: "text", ru: "text" },
        note: "Deutsch aufgenommen; übersetzt am 30. Oktober 2026, die 734 Sätze der anderen Sprachen (≈ 2.600 Credits) warten auf ihre Aufnahme: bun run voice make --only kleine-abenteuer. Bis dahin sind diese Sätze in den anderen Sprachen still.",
      },
    ],
  },
  { href: "/tiere/", languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" } },
  {
    href: "/schatten/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/socken/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/buchstaben/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Mit „Wörter tippen“. Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch. Jede Taste tippt den Buchstaben an ihrer Stelle der Tastatur der Sprache: Russisch ЙЦУКЕН, Hindi InScript, Arabisch die arabische Tastatur; Chinesisch tippt Pinyin auf lateinischen Tasten zu chinesischen Wörtern (B – 爸爸).",
  },
  {
    href: "/zaehne/",
    parts: [
      {
        label: "🪥 Hinweise und Bilder",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Was vor dem Putzen und am Ende gesagt wird, von ElevenLabs gesprochen (Tapsis Stimme, 30. Oktober 2026); die Putzschritte auch, für den Fall, dass das Lied nicht lädt.",
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
      {
        label: "🚽 Bilder und Texte",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt im Oktober 2026; Tapsi heißt „Тапси“, „塔普西“, „टैप्सी“, „تابسي“.",
      },
      {
        label: "🎵 Warte-Lied (gesungen)",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "text", ru: "done" },
        note: "„Warten auf dem Töpfchen“ von Suno (Oktober 2026), endlos wiederholt; der Text für Suno und für Übersetzungen steht in src/games/potty/musik/suno-lied.md. Russisch, Spanisch, Englisch, Chinesisch und Hindi aufgenommen (Oktober 2026); Arabisch: Text für Suno fertig, noch nicht aufgenommen. Eine neue Sprache: musik-toepfchen-warten-<Sprache>.mp3 und ihre Schleife in waitMusic.ts (/musik-erzeugen).",
      },
    ],
  },
  {
    href: "/belohnungstafel/",
    note: "Belohnungstafel und Tagesplan auf einer Seite (seit Oktober 2026), mit einem gemeinsamen Assistenten „＋ Neu“; /tagesplan/ öffnet dieselbe Seite.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/laut-leise/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/",
    languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Startseite, Einstellungen und alles für Eltern (🌐 auf der Startseite); nur die Management-Seite bleibt Deutsch; die Seiten für Suchmaschinen gibt es auf Deutsch und Englisch (/en/, A-22). „Gute Nacht! Die Spielzeit ist vorbei.“ (alle Spiele) von ElevenLabs gesprochen, in allen sieben Sprachen (30. Oktober 2026). Neu und nur Deutsch: das Menü „Junge / Mädchen“ (👦 / 👧, HomeOptions.tsx), das Buch „Für jeden Tag“ im Bücherregal (Titel und Zeile, games.ts) der Name des Regals für Vorleseprogramme (Bookshelf.tsx) und unten auf der Startseite „Wann ist die richtige Zeit für Bildschirme?“ (die Stufen von analog zu digital, Home.tsx). Der Name „Books for Both“ bleibt in allen Sprachen gleich.",
  },
];
