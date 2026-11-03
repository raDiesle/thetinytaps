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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done", it: "done" },
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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "„Warten auf dem Töpfchen“ von Suno (Oktober 2026), endlos wiederholt; der Text für Suno und für Übersetzungen steht in src/games/potty/musik/suno-lied.md. In allen sieben Sprachen aufgenommen (Oktober 2026). Eine neue Sprache: musik-toepfchen-warten-<Sprache>.mp3 und ihre Schleife in waitMusic.ts (/musik-erzeugen).",
      },
    ],
  },
  {
    href: "/belohnungstafel/",
    note: "Belohnungstafel und Zeitplan auf einer Seite (seit Oktober 2026), mit einem gemeinsamen Assistenten „＋ Neu“; /tagesplan/ öffnet dieselbe Seite. Alles übersetzt am 3. November 2026, auch Urkunde, „Jetzt – Dann“, das Bearbeiten auf der Tafel und der Countdown „Wie oft noch schlafen?“.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/timer/",
    note: "Name, Satz im Regal, die drei Bilder und „Wie lange?“ übersetzt am 3. November 2026. Sagt sonst nichts.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/schnullerfee/",
    note: "Name, Satz auf dem Buchrücken, die Namen der Dinge (nur vorgelesen) und hinter ⚙️ „Abschied der Schnuller“ und „Geschenk der Fee“ mit den acht Geschenken, übersetzt am 3. November 2026. Die Geschichte selbst kommt ohne Worte aus.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/abstillen/",
    recorded: true,
    note: "Die dreizehn Sätze der Geschichte (content.ts), „Weiter“ und „Zurückblättern“ übersetzt am 3. November 2026; noch in keiner Sprache aufgenommen (🎙️ Stimmen, bun run voice make --only abstillen).",
    languages: { de: "text", en: "text", zh: "text", hi: "text", es: "text", ar: "text", ru: "text" },
  },
  {
    href: "/bilder/",
    note: "Viele Namen und Sätze je Bild; jede Sprache in <Sprache>.ts jeder Szene (ru.ts, en.ts …), Satzbau in phrases.ts.",
    parts: [
      {
        label: "🖼️ Bilder und Spielarten",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Mit 🔦 Taschenlampe und 🛣️ Straße malen (übersetzt am 3. November 2026).",
      },
    ],
  },
  {
    href: "/kettenreaktion/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Alle Bahnen und Maschinen, auch Schneebahn, Weltraumbahn, Wasserrutsche, Baustellen-Bahn und „Schranke und Weiche“ (übersetzt am 3. November 2026).",
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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt am 30. Oktober 2026, alle 734 Sätze der anderen Sprachen von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026, 2.881 Credits).",
      },
    ],
  },
  {
    href: "/gefuehle/",
    note: "Übersetzungen in bear.<Sprache>.ts und kita.<Sprache>.ts (auch die Geschichten aus selbst.ts), Schritt für Schritt neben den deutschen Geschichten.",
    parts: [
      {
        label: "Wie geht's dir? und Kindergarten",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
      },
      {
        label: "Zu Hause",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "„Müde am Abend“ (der Bär legt sich selbst schlafen) neu übersetzt am 3. November 2026.",
      },
      {
        label: "Mehr Gefühle",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "24 Geschichten in selbst.ts – enttäuscht, eifersüchtig, Ekel, peinlich, aufgeregt und 19 weitere vom Spielplatz bis zum lauten Knall (Bilder noch geplant) –, alle übersetzt in kita.<Sprache>.ts (3. November 2026).",
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
    href: "/tiere/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Alle Spielarten, auch „Was gibt uns das Tier?“ und „Was wird aus mir?“ (Wörter und Sätze in content.<Sprache>.ts), die Fragen in der Sprechblase und die Einstellungen hinter ⚙️ (übersetzt am 3. November 2026).",
  },
  {
    href: "/zusammen/",
    languages: { de: "done" },
    note: "Neu (November 2026): nur auf Deutsch – die Namen der Dinge und Helfer für Vorleseprogramme, die Fragen in der Sprechblase und die Einstellungen beim Spielen. Gesprochen wird noch nichts; die Sätze warten auf ihre Aufnahme.",
  },
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
    href: "/",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Startseite, Einstellungen und alles für Eltern (🌐 auf der Startseite), auch „Junge / Mädchen“, „Spiel verlassen“, die Schnitzerei „Für Groß & Klein“ mit „mehr …“, „Lernspiele“, „Alltagshelfer“ und „Ein paar Worte von uns“ (übersetzt am 3. November 2026); nur die Management-Seite, Impressum und Datenschutz bleiben Deutsch; die Seiten für Suchmaschinen gibt es auf Deutsch und Englisch (/en/, A-22). „Gute Nacht! Die Spielzeit ist vorbei.“ (alle Spiele) von ElevenLabs gesprochen, in allen sieben Sprachen (30. Oktober 2026). Der Name „Books for Both“ bleibt in allen Sprachen gleich.",
  },
];
