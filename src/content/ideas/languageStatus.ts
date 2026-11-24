import type { TargetLanguageId } from "../targetLanguages";

// Which game speaks which of the wanted languages (targetLanguages.ts), shown on
// the ideas page. New and changed texts are translated into every app language at
// once (user decision, 22 November 2026), while recordings cost credits and are made
// only when the grown-up asks, so a translated but unrecorded part is "text"; older
// parts may still miss a language. This is the list of what is there and what is
// still missing. Kept by hand: when a game gains a language or a recording, or a new
// part comes, mark it here in the same commit. content.test.ts checks the
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
  /**
   * Source files that are this part's alone (a page of the shared screens written English first): their inline texts are
   * checked against this part's languages, and the row's other files against its other parts (`inlineTexts.test.ts`).
   */
  files?: string[];
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
    href: "/timer/",
    parts: [
      {
        label: "Bilder und Menü",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Name, Satz im Regal, die drei Bilder und „Wie lange?“ übersetzt am 3. November 2026, alles andere am 5. November 2026: der Zettel „Andere …“ mit seinem Blatt, die Frage nach einer schon vergangenen Uhrzeit, die Restzeit, die Namen der Bilder und bei „Abwechseln“ Spielzeug, „Wer ist dran?“ und „Bis zum Wechsel“. Am 10. November 2026 übersetzt, was noch fehlte: die Zeile auf der Karte „Abwechseln“ („Läuft ohne Ende, jeder ist mal dran“), hinter ⚙️ die Wahl „Zeit im Bild“ (Aus, Zahlen, Striche) und die Namen der Bilder „Sonnenaufgang“, „Wecker“ und „Tennis“.",
      },
      {
        label: "⚖️ Wippe",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Das Bild „Wippe“ in der Gruppe Abwechseln (H-109, 21. November 2026): nur sein Name („Seesaw“, Tooltip und Vorlesen) ist neuer Text, englisch zuerst, am 22. November 2026 in alle anderen Sprachen übersetzt („Wippe“). Es sagt dieselben Sätze wie Abwechseln, die schon in allen Sprachen aufgenommen sind.",
      },
      {
        label: "🗣️ Stimme",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        recorded: true,
        note: "Was jedes Bild am Anfang und am Ende sagt, „Gleich ist es so weit!“ zur Glocke, und bei Abwechseln „Wer fängt an?“, wer anfängt und „Tauschen! …“ (H-72, voice.ts, 7. November 2026): in alle Sprachen übersetzt (timerSaid) und außer Russisch von ElevenLabs gesprochen (7./8. November 2026); Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin still, keine Browserstimme. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
      },
      {
        label: "🧸 Tidy Up",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        recorded: true,
        note: "Das Bild fürs Aufräumen mit dem Spielzeugkran (H-118, tidy.tsx, 21. November 2026), Englisch zuerst geschrieben: sein Name „Tidy Up“ und seine zwei Sätze am Anfang und am Ende (tidyNames.ts). Am 22. November 2026 in alle anderen Sprachen übersetzt („Aufräumen“). Beide Sätze am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“ – beide Sätze eines Bildes aus einer Stimme. Die Texte für Suchmaschinen nennen es in allen sieben Sprachen.",
        files: ["src/games/timer/tidyNames.ts"],
      },
      {
        label: "📦 Five Boxes",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        recorded: true,
        note: "Das Bild mit den fünf Kisten, in die die Spielsachen Sorte für Sorte hüpfen (H-120, boxes.tsx, 22. November 2026), Englisch zuerst geschrieben und gleich in alle Sprachen übersetzt: sein Name „Five Boxes“ („Fünf Kisten“) und seine zwei Sätze am Anfang und am Ende (boxesNames.ts). Beide Sätze am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“ – beide Sätze eines Bildes aus einer Stimme. Die Texte für Suchmaschinen nennen es in allen sieben Sprachen.",
        files: ["src/games/timer/boxesNames.ts"],
      },
      {
        label: "🧱 Block House",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        recorded: true,
        note: "Das Bild im Stil eines Klötzchen-Bauspiels, in dem Klötze aus einem Durcheinander an ihren Platz in einem Haus hüpfen (H-125, blocks.tsx, 22. November 2026), Englisch zuerst geschrieben und gleich in alle Sprachen übersetzt: sein Name „Block House“ („Klötzchenhaus“) und seine zwei Sätze am Anfang und am Ende (blocksNames.ts). Beide Sätze am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“ – beide Sätze eines Bildes aus einer Stimme. Die Texte für Suchmaschinen nennen es in allen sieben Sprachen.",
        files: ["src/games/timer/blocksNames.ts"],
      },
      {
        label: "⛏️ Treasure Tunnel",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        recorded: true,
        note: "Das zweite Bild im Stil einer Klötzchenwelt, in dem eine Spitzhacke Klotz für Klotz einen Tunnel zur Schatzkiste gräbt (H-126, tunnel.tsx, 22. November 2026), Englisch zuerst geschrieben und gleich in alle Sprachen übersetzt: sein Name „Treasure Tunnel“ („Schatztunnel“) und seine zwei Sätze am Anfang und am Ende (tunnelNames.ts). Beide Sätze am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“ – beide Sätze eines Bildes aus einer Stimme. Die Texte für Suchmaschinen nennen es in allen sieben Sprachen.",
        files: ["src/games/timer/tunnelNames.ts"],
      },
      {
        label: "🚀 Up to the Moon",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        recorded: true,
        note: "Das dritte Spiel-Video-Bild und das erste, das keine Klötzchenwelt ist: ein Jump'n'Run nach oben, in dem ein kleiner Hüpfer vom Grund eines Sees bis zum Mond schwimmt, hüpft, klettert und fliegt und am Ende in eine Torte springt (H-127, jump.tsx; am 23. November 2026 neu gebaut statt „Hop to the Flag“), Englisch zuerst geschrieben und gleich in alle Sprachen übersetzt: sein Name „Up to the Moon“ („Hoch bis zum Mond“) und seine zwei Sätze am Anfang und am Ende (jumpNames.ts). Beide Sätze am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“ – beide Sätze eines Bildes aus einer Stimme, wie bei den anderen Bildern. Die Texte für Suchmaschinen nennen es in allen sieben Sprachen.",
        files: ["src/games/timer/jumpNames.ts"],
      },
    ],
  },
  {
    href: "/abstillen/",
    note: "Das Buch „Abstillen“ mit drei Geschichten in Kapiteln, die Tapsis Stimme vorliest (ChapterBook, 13. November 2026); unten rechts über ▶ schaltet ein Lautsprecher sie für Erwachsene aus, die selbst vorlesen. Die Wörter des Buchs selbst (Kapitel, Weiter) kommen aus ChapterBook, die der Wahl am Anfang („Ganze Geschichte“, „Kurzfassung“, „Lesen“, „N Bilder · ca. M Min.“) stehen in allen sieben Sprachen in MilkChainGame.tsx (22. November 2026).",
    parts: [
      {
        label: "🤱 Tapsis Milchkette",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Die Abstillgeschichte in Kapiteln (milkChain.ts): Name, Satz fürs Regal, Kapitel und Sätze in <Sprache>.ts im Ordner, übersetzt auf Wunsch am 9. November 2026. Vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, jede Geschichte ganz aus einer Stimme.",
      },
      {
        label: "🌙 The Milk Sleeps at Night",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: 'Die Geschichte fürs nächtliche Abstillen (H-104, nightMilk.ts, /abstillen/nachts/, 21. November 2026), Englisch zuerst geschrieben (ChapterBook first="en"): Titel, Name in der Auswahl des Buchs (names.ts), Kapitel und Sätze. Am 22. November 2026 in alle sechs anderen Sprachen übersetzt, Deutsch eingeschlossen: Kapitel und Sätze in <Sprache>.ts im Ordner, geladen über texts-<Sprache>.ts, wie bei „Haare waschen“. Vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, jede Geschichte ganz aus einer Stimme. Die Texte für Suchmaschinen sind in allen sieben Sprachen da. Seit dem 21. November 2026 mit allen Bildern veröffentlicht; seit dem 22. November 2026 ist „Abstillen“ wieder ein Buch, das auf der Wahl zwischen „Ganz abstillen“ und „Nachts abstillen“ aufgeht.',
        files: ["src/games/nightmilk/names.ts", "src/games/nightmilk/story.ts", "src/games/nightmilk/nightMilk.ts", "src/games/nightmilk/nightMilkPictures.ts"],
      },
      {
        label: "🎂 Three More Sleeps",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: 'Ganz abstillen an einem festen Tag mit Abschiedsfest (H-143, goodbyeMilk.ts, /abstillen/abschied/, 22. November 2026), Englisch zuerst geschrieben (ChapterBook first="en") und am selben Tag in alle sechs anderen Sprachen übersetzt, Deutsch eingeschlossen: Titel und Name in der Wahl (names.ts), Kapitel und Sätze in <Sprache>.ts im Ordner, geladen über texts-<Sprache>.ts. Vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, jede Geschichte ganz aus einer Stimme. Die Texte für Suchmaschinen sind in allen sieben Sprachen da. Die zwölf Bilder sind gemacht (Claude Cloud, 22. November 2026), die Geschichte ist veröffentlicht und steht in den Suchtexten von /abstillen/ und im Untertitel des Buchs. Die Kurzfassung der Milchkette (/abstillen/kurz/) braucht nichts Eigenes: dieselben Seiten, Texte und Aufnahmen.',
        files: [
          "src/games/milkgoodbye/names.ts",
          "src/games/milkgoodbye/story.ts",
          "src/games/milkgoodbye/goodbyeMilk.ts",
          "src/games/milkgoodbye/goodbyeMilkPictures.ts",
        ],
      },
    ],
  },
  {
    href: "/flaeschchen/",
    note: 'Das Buch „Flasche abgewöhnen“ mit „Tschüss, Fläschchen!“, einer Geschichte in Kapiteln vom Fläschchen zum Becher (bottleStory.ts, Idee H-105, 21. November 2026), Englisch zuerst geschrieben (ChapterBook first="en") und am selben Tag auf Wunsch in alle Sprachen übersetzt, Deutsch als eine davon (de.ts, geladen mit texts-de.ts): Name, Satz fürs Regal (names.ts), Kapitel und Sätze. Tapsis Stimme liest jede Seite vor, vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, jede Geschichte ganz aus einer Stimme. Die Wörter des Buchs selbst (Kapitel, Weiter) kommen aus ChapterBook; die Texte für Suchmaschinen sind in allen sieben Sprachen da.',
    recorded: true,
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/schnullerfee/",
    note: "Das Buch „Schnullerfee“ mit zwei Geschichten in Kapiteln, jede ganz und als Kurzfassung (StoryChoice, 23. November 2026), die Tapsis Stimme vorliest; unten rechts über ▶ schaltet ein Lautsprecher sie für Erwachsene aus, die selbst vorlesen. Die Wörter des Buchs selbst (Kapitel, Weiter, die Wahl) kommen aus ChapterBook und StoryChoice.",
    parts: [
      {
        label: "🧚 Tapsi und die Schnullerfee",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Die Geschichte von der Schnullerfee in Kapiteln (pacifierStory.ts, November 2026): Name, Satz fürs Regal, Kapitel und Sätze in <Sprache>.ts im Ordner, übersetzt auf Wunsch am 10. November 2026. Ganz vorgelesen am 23. November 2026 von ElevenLabs mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, die Geschichte ganz aus einer Stimme. Ihr Name in der Wahl des Buchs („Mit der Schnullerfee“, names.ts) ist seit dem 23. November 2026 in allen sieben Sprachen da.",
      },
      {
        label: "🌳 Tapsi and the Pacifier Tree",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: 'Die zweite Geschichte ohne Fee: Tapsi bindet die drei Schnuller an den Schnullerbaum im Park (H-145, pacifierTree.ts, /schnullerfee/baum/ und /schnullerfee/baum/kurz/, 23. November 2026), Englisch zuerst geschrieben (ChapterBook first="en") und am selben Tag in alle sechs anderen Sprachen übersetzt, Deutsch eingeschlossen: Titel und Name in der Wahl (names.ts), Kapitel und Sätze in <Sprache>.ts im Ordner, geladen über texts-<Sprache>.ts. Ganz vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, die Geschichte ganz aus einer Stimme. Die Texte für Suchmaschinen sind in allen sieben Sprachen da. Die zwanzig Bilder am 23. November 2026 mit Gemini gemacht (Claude Cloud) – seitdem veröffentlicht.',
        files: [
          "src/games/pacifiertree/names.ts",
          "src/games/pacifiertree/story.ts",
          "src/games/pacifiertree/pacifierTree.ts",
          "src/games/pacifiertree/pacifierTreePictures.ts",
        ],
      },
    ],
  },
  {
    href: "/kita/",
    note: "Das Buch „Kita-Start“ mit zwei Geschichten in Kapiteln, jede ganz und als Kurzfassung (StoryChoice, 23. November 2026), die Tapsis Stimme vorliest; unten rechts über ▶ schaltet ein Lautsprecher sie für Erwachsene aus, die selbst vorlesen. Die Wörter des Buchs selbst (Kapitel, Weiter, die Wahl) kommen aus ChapterBook und StoryChoice.",
    parts: [
      {
        label: "🏫 Tapsi geht in die Kita",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Die Geschichte in der Kita (kitaStory.ts, 11. November 2026): Name, Satz fürs Regal (names.ts), Kapitel und Sätze in <Sprache>.ts im Ordner, übersetzt auf Wunsch am 19. November 2026. Ganz vorgelesen am 23. November 2026 von ElevenLabs mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, die Geschichte ganz aus einer Stimme. Ihr Name in der Wahl des Buchs („In der Kita“, names.ts) ist seit dem 23. November 2026 in allen sieben Sprachen da; die Texte für Suchmaschinen auch.",
      },
      {
        label: "🏡 Tapsi Goes to Lotta's",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: 'Die zweite Geschichte bei der Tagesmutter, für Familien in der Kindertagespflege (H-147, childminder.ts, /kita/tagesmutter/ und /kita/tagesmutter/kurz/, 23. November 2026), Englisch zuerst geschrieben (ChapterBook first="en") und am selben Tag in alle sechs anderen Sprachen übersetzt, Deutsch eingeschlossen: Titel und Name in der Wahl (names.ts), Kapitel und Sätze in <Sprache>.ts im Ordner, geladen über texts-<Sprache>.ts. Ganz vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, die Geschichte ganz aus einer Stimme. Die Texte für Suchmaschinen sind in allen sieben Sprachen da. Die achtundzwanzig Bilder am 23. November 2026 mit Gemini gemacht (Claude Cloud) – seitdem veröffentlicht.',
        files: [
          "src/games/childminder/names.ts",
          "src/games/childminder/story.ts",
          "src/games/childminder/childminder.ts",
          "src/games/childminder/childminderPictures.ts",
        ],
      },
    ],
  },
  {
    href: "/haare-waschen/",
    note: "Das Buch „Haare waschen“ mit zwei Geschichten in Kapiteln, jede ganz und als Kurzfassung (StoryChoice, 23. November 2026), die Tapsis Stimme vorliest; unten rechts über ▶ schaltet ein Lautsprecher sie für Erwachsene aus, die selbst vorlesen. Die Wörter des Buchs selbst (Kapitel, Weiter, die Wahl) kommen aus ChapterBook und StoryChoice.",
    parts: [
      {
        label: "🛁 Tapsi und die Schaumkrone",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: 'Die Geschichte in der Badewanne (hairStory.ts, 13. November 2026): das erste Kapitelbuch, das Englisch zuerst geschrieben ist (ChapterBook first="en"), am selben Tag in alle Sprachen übersetzt, Deutsch als eine davon (de.ts, geladen mit texts-de.ts): Name, Satz fürs Regal (names.ts), Kapitel und Sätze. Ganz vorgelesen am 23. November 2026 von ElevenLabs mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, die Geschichte ganz aus einer Stimme. Ihr Name in der Wahl des Buchs („In der Badewanne“, names.ts) ist seit dem 23. November 2026 in allen sieben Sprachen da; die Texte für Suchmaschinen auch.',
      },
      {
        label: "🚿 Tapsi and the Warm Rain",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: 'Die zweite Geschichte unter der Dusche, für Familien ohne Badewanne (H-146, hairShower.ts, /haare-waschen/dusche/ und /haare-waschen/dusche/kurz/, 23. November 2026), Englisch zuerst geschrieben (ChapterBook first="en") und am selben Tag in alle sechs anderen Sprachen übersetzt, Deutsch eingeschlossen: Titel und Name in der Wahl (names.ts), Kapitel und Sätze in <Sprache>.ts im Ordner, geladen über texts-<Sprache>.ts. Ganz vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, die Geschichte ganz aus einer Stimme. Die Texte für Suchmaschinen sind in allen sieben Sprachen da. Die zwanzig Bilder am 23. November 2026 mit Gemini gemacht (Claude Cloud) – seitdem veröffentlicht.',
        files: [
          "src/games/hairshower/names.ts",
          "src/games/hairshower/story.ts",
          "src/games/hairshower/hairShower.ts",
          "src/games/hairshower/hairShowerPictures.ts",
        ],
      },
    ],
  },
  {
    href: "/grosses-bett/",
    note: 'Das Buch „Großes Bett“ mit „Tapsi\'s Big Bed“, einer Geschichte in Kapiteln (bedStory.ts, 21. November 2026), Englisch zuerst geschrieben (ChapterBook first="en"): Name, Satz fürs Regal (names.ts), Kapitel und Sätze; am 22. November 2026 in alle sechs anderen Sprachen übersetzt, Deutsch eingeschlossen (<Sprache>.ts im Ordner, geladen über texts-<Sprache>.ts). Tapsis Stimme liest jede Seite vor, Vorgelesen am 23. November 2026 von ElevenLabs gesprochen mit den Klonen von Tapsis Stimme im zweiten Konto: Englisch, Chinesisch, Hindi, Spanisch und Arabisch mit „Tapsi Coach (Klon)“, Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“, jede Geschichte ganz aus einer Stimme. Die Texte für Suchmaschinen sind in allen sieben Sprachen da.',
    recorded: true,
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done", it: "done" },
        note: "Text und Lied von Suno, eine neue Sprache: /zahnputzlied.",
      },
    ],
  },
  {
    href: "/haende-waschen/",
    note: "Hände waschen (H-136, 22. November 2026), Englisch zuerst und gleich in allen sieben Sprachen: Name, Satz fürs Regal (names.ts), die Namen der Schritte in der Leiste (steps.ts) und die Beschreibung des Bilds. Auf dem Bild steht nichts, und gesprochen wird nichts. Das gesungene Lied fehlt noch in allen Sprachen (H-142, mit Suno wie das Zahnputzlied); bis dahin spielt eine Platzhalter-Melodie.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/toepfchen/",
    parts: [
      {
        label: "🚽 Bilder und Texte",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt im Oktober 2026; Tapsi heißt „Тапси“, „塔普西“, „टैप्सी“, „تابسي“. Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
      },
      {
        label: "🎵 Warte-Lied (gesungen)",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "„Warten auf dem Töpfchen“ von Suno (Oktober 2026), endlos wiederholt; der Text für Suno und für Übersetzungen steht in src/games/potty/musik/suno-lied.md. In allen sieben Sprachen aufgenommen (Oktober 2026). Eine neue Sprache: musik-toepfchen-warten-<Sprache>.mp3 und ihre Schleife in waitMusic.ts (/musik-erzeugen).",
      },
      {
        label: "📺 Kapitelnamen der Videos",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        files: ["src/games/potty/videoChapters.ts"],
        note: "Die Namen der Kapitelmarken für die Beschreibung der Töpfchen-Videos auf YouTube (Y-26, 21. November 2026), englisch zuerst, am 22. November 2026 in alle anderen Sprachen übersetzt. Im Video „Nur Sitzen“ heißen die Kapitel nach den Gedanken, deren Zeilen es schon in jeder Sprache gibt.",
      },
      {
        label: "👪 Video für Eltern (Zeilen neben dem Tablet)",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        files: ["src/games/potty/parentsScript.ts", "src/games/potty/ParentsVideo.tsx"],
        note: "Die zehn kurzen Zeilen für Eltern im Elternvideo (/management/video-toepfchen-eltern/, Y-29, 21. November 2026), englisch zuerst, am 22. November 2026 in alle anderen Sprachen übersetzt (Erwachsene förmlich angesprochen). Name und Adresse am Ende brauchen keine.",
      },
    ],
  },
  {
    href: "/belohnungstafel/",
    note: "Belohnungstafel und Zeitplan auf einer Seite (seit Oktober 2026), mit einem gemeinsamen Assistenten „＋ Neu“; /tagesplan/ öffnet dieselbe Seite.",
    parts: [
      {
        label: "📅 Tafel, Zeitplan und Druck",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Alles übersetzt am 3. November 2026, auch Urkunde, „Jetzt – Dann“, das Bearbeiten auf der Tafel und der Countdown „Wie oft noch schlafen?“.",
      },
      {
        label: "🖍️ Schwarz-weiß zum Ausmalen beworben",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 4. November 2026: die Wahl „🎨 In Farbe / 🖍️ Schwarz-weiß zum Ausmalen“ beim Drucken und die Zeile im Druck-Stempel des Assistenten, übersetzt am 5. November 2026.",
      },
      {
        label: "🌙 Buch „Wie lange warten?“ (Countdown)",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 4. November 2026 (H-05): der Name des dritten Buchs im Schuber (names.ts), übersetzt am 5. November 2026; die Seite für Suchmaschinen gibt es wie alle in allen sieben Sprachen (seo.ts, seo.<Sprache>.ts). Was das Kind hört („Noch 3-mal schlafen, dann …“) war schon übersetzt.",
      },
      {
        label: "🛏️ Countdown direkt auf dem Blatt (Nachtbilder, ＋, 🗑️, Überschrift, Löschen)",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 5. November 2026: jede Nacht ein Feld mit dem Kind im Bett und einem Sternkreis, „Einmal schlafen“, „Eine Nacht mehr / weniger?“, „Bild der Nächte“ mit seinen fünf Bildern, „Diesen Plan ganz löschen?“, der Druckhinweis und die Zeile der Vorlage „Wie oft noch schlafen?“ (deren alte Übersetzungen sprachen von Monden und sind gelöscht). Übersetzt am 7. November 2026.",
      },
      {
        label: "📆 Woche und Monat direkt auf dem Blatt (4 Wochen, Darstellungen, Tageszeiten, Kreise je Tag)",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 6. November 2026: „Monat als: 4 Wochen / Kalendermonat“, „Darstellung“ (Kalender, Tabelle, Wochen; „Eine Karte je Zeile“, „Bild über jedem Kreis“), „1. Woche“ bis „4. Woche“, die Spalte „Kreise“ und „Tauschen gegen“. Übersetzt am 7. November 2026.",
      },
      {
        label: "🌅 Tageszeiten und ihre Zeichen, Karten einfügen",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 6. November 2026: „Tageszeiten“ (Ganzer Tag, Früh & Abend, Früh, Mittag & Abend), „Zeichen“ (Ohne, Himmel, Bilder, Sonne & Mond, Landschaft, Hahn, Teller, Bett) und die ＋ am Kartenrand („Karte links davor einfügen“ … „Karte darunter einfügen“). Übersetzt am 7. November 2026.",
      },
      {
        label: "🏆 Sammeln: ein Weg je Aufgabe, Überschrift und ihr Zeichen",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 6. November 2026: „⇄ Tauschen“ über Bild und Belohnung, „Kreise“, „＋ Noch ein Weg – für eine andere Aufgabe“, „Ohne Belohnung“ als erste Wahl, „Zeichen vor der Überschrift ändern“ und „Ohne Zeichen“. Übersetzt am 7. November 2026.",
      },
      {
        label: "💛 Rituale (Mutmach-Sätze, Erzählen, Wie geht's dir?, Gute-Nacht-Sätze)",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 4. November 2026 (H-58, C-33): die vier Ritual-Karten mit ihren Worten für Eltern (rituals.ts), ihre Auswahl im Editor, „Gemacht“ und die Vorlage „Mein Tag mit Ritualen“, übersetzt am 5. November 2026. Die Sätze des Kindes sind so gefasst, dass sie für Jungen und Mädchen gleich lauten.",
      },
    ],
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
      {
        label: "🦊🐻 Familie Fuchs und Familie Bär in den Verstecken",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "„Da ist ja Familie Fuchs!“ und „Da ist ja Familie Bär!“ (4. November 2026), übersetzt am 5. November 2026.",
      },
      {
        label: "🔊 Geräusch-Rätsel",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu seit B-02 (21. November 2026), englisch zuerst, am 22. November 2026 in alle anderen Sprachen übersetzt („🔊 Geräusche“): der Name der Spielart in der Zeile über den Bildern („🔊 Sounds“) und die nur vorgelesene Frage „Who makes this sound?“ (soundRiddle.ts). Die Geräusche selbst brauchen keine Sprache; ihre Aufnahmen von ElevenLabs sind seit dem 22. November 2026 da. Die Texte für Suchmaschinen nennen den Modus schon in allen sieben Sprachen.",
        files: ["src/games/scenes/soundRiddle.ts"],
      },
    ],
  },
  {
    href: "/kettenreaktion/",
    parts: [
      {
        label: "⛓️ Alle Bahnen und Maschinen",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Auch Schneebahn, Weltraumbahn, Wasserrutsche und Baustellen-Bahn (übersetzt am 3. November 2026). Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
      },
      {
        label: "🎨 Farbenbahn",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu seit K-10 (11. November 2026): Name, erster Satz, „Eine rote!“ bis „Fünf blaue!“ und „Die Röhre ist voll!“. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Auf Wunsch übersetzt am 19. November 2026 (die Zählsätze je Sprache mit Zahl und Farbe passend, COUNTS in colors.ts); in den anderen Sprachen fehlen die Aufnahmen noch, bis dahin zählen dort nur die Töne. Die anderen Sprachen am 23. November 2026 von ElevenLabs gesprochen, ganze Bahn je Stimme: mit „Tapsi Coach (Klon)“ (Englisch, Chinesisch, Hindi, Spanisch, Arabisch) und Russisch mit „Tapsi Coach (Klon ru)“.",
      },
      {
        label: "⏱️ Die Level werden eine Minute lang",
        recorded: true,
        languages: { de: "text", en: "text", zh: "text", hi: "text", es: "text", ar: "text", ru: "done" },
        note: "Vier neue Sätze der längeren Maschinen (22. November 2026), englisch zuerst und am selben Tag in alle sieben Sprachen übersetzt, noch in keiner aufgenommen (bis dahin bleiben sie stumm): Licht-Kette „Look, a rainbow!“ (light.ts), Badezimmer „The washing machine walks off!“ (bath.ts), Große Maschine „Oh, a parachute!“ (machine.ts), Verrückte Küche „Pop! There goes the cork!“ (kitchen.ts). Das „Überspringen“ der Pause (nur vorgelesen, kein Satz der Stimme) steht in allen sieben Sprachen in PauseVeil.tsx. Russisch am 23. November 2026 mit „Tapsi Coach (Klon ru)“ aufgenommen, wie alle russischen Sätze der Kettenreaktion. In den anderen Sprachen bleiben sie mit Absicht stumm: aufgenommen hätte sie nur ein Klon, mitten unter Tapsis echten Sätzen ihres Levels (die Aufnahmen vom 23. November 2026 wurden wieder gelöscht); sie kommen erst mit Tapsis eigener Stimme im ersten Konto.",
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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt am 30. Oktober 2026, alle 734 Sätze der anderen Sprachen von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026, 2.881 Credits).",
      },
      {
        label: "✉️ Ein Brief für Oma",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu (4. November 2026), übersetzt am 5. November 2026, außer Russisch von ElevenLabs gesprochen (7./8. November 2026); auf Russisch liest bis dahin die Stimme des Browsers. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
      },
      {
        label: "🥨 Beim Bäcker",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu (4. November 2026), übersetzt am 5. November 2026, außer Russisch von ElevenLabs gesprochen (7./8. November 2026); auf Russisch liest bis dahin die Stimme des Browsers. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
      },
      {
        label: "🌻 Unser Garten wächst",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu (10. November 2026), Titel und Sätze übersetzt auf Wunsch am 11. November 2026. Von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme im zweiten Konto („Tapsi Coach (Klon)“, die Credits des ersten waren aufgebraucht): Englisch am 11., Chinesisch, Hindi, Spanisch und Arabisch am 12. November 2026; Deutsch und Russisch noch nicht aufgenommen: bis dahin liest die Stimme des Browsers. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
      },
      {
        label: "🚑 The ambulance",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "New (16 November 2026), English first. Title and lines translated on request on 19 November 2026 into German, Chinese, Hindi, Spanish, Arabic and Russian (German in the game's own `de.ts`); recorded on 23 November 2026 with the clones of Tapsi's voice on the second account, the whole route in one voice per language: „Tapsi Coach (Klon)“ for English, Chinese, Hindi, Spanish and Arabic, „Tapsi Coach (Klon de)“ for German, „Tapsi Coach (Klon ru)“ for Russian (lines said word for word as in „Beim Bäcker“ or „Unser Garten wächst“ keep those recordings).",
      },
      {
        label: "🌾 From grain to bread",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "New (18 November 2026, G-20), English first. Title and lines translated on request on 19 November 2026 into German, Chinese, Hindi, Spanish, Arabic and Russian (German in the game's own `de.ts`); recorded on 23 November 2026 with the clones of Tapsi's voice on the second account, the whole route in one voice per language: „Tapsi Coach (Klon)“ for English, Chinese, Hindi, Spanish and Arabic, „Tapsi Coach (Klon de)“ for German, „Tapsi Coach (Klon ru)“ for Russian (lines said word for word as in „Beim Bäcker“ or „Unser Garten wächst“ keep those recordings).",
      },
      {
        label: "🏡 We build a house",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "New (18 November 2026, G-36), English first. Title and lines translated on request on 19 November 2026 into German, Chinese, Hindi, Spanish, Arabic and Russian (German in the game's own `de.ts`); recorded on 23 November 2026 with the clones of Tapsi's voice on the second account, the whole route in one voice per language: „Tapsi Coach (Klon)“ for English, Chinese, Hindi, Spanish and Arabic, „Tapsi Coach (Klon de)“ for German, „Tapsi Coach (Klon ru)“ for Russian (lines said word for word as in „Beim Bäcker“ or „Unser Garten wächst“ keep those recordings).",
      },
      {
        label: "🚛 The rubbish truck",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "New (19 November 2026, G-27), English first. Title and lines translated on request on 19 November 2026 into German, Chinese, Hindi, Spanish, Arabic and Russian (German in the game's own `de.ts`); recorded on 23 November 2026 with the clones of Tapsi's voice on the second account, the whole route in one voice per language: „Tapsi Coach (Klon)“ for English, Chinese, Hindi, Spanish and Arabic, „Tapsi Coach (Klon de)“ for German, „Tapsi Coach (Klon ru)“ for Russian (lines said word for word as in „Beim Bäcker“ or „Unser Garten wächst“ keep those recordings).",
      },
    ],
  },
  {
    href: "/abenteuer/",
    note: "Tapsis Stimme ist von ElevenLabs aufgenommen (bun run voice make, kostet Credits); ohne Aufnahme bleibt der Satz stumm (keine Browserstimme). Eine Geschichte ohne Übersetzung spricht Englisch, dann Deutsch.",
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
      {
        label: "🚒 Fire Rescue",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu (13. November 2026), zuerst auf Englisch geschrieben; Tapsis Sätze, Titel und Schrittnamen auf Wunsch übersetzt am 19. November 2026 (Deutsch, Chinesisch, Hindi, Spanisch, Arabisch, Russisch, lines.<Sprache>.ts). Am 23. November 2026 in allen sieben Sprachen von ElevenLabs gesprochen, die ganze Geschichte je Sprache aus einer Stimme: mit „Tapsi Coach (Klon)“ (Englisch, Chinesisch, Hindi, Spanisch, Arabisch), Deutsch mit „Tapsi Coach (Klon de)“, Russisch mit „Tapsi Coach (Klon ru)“. Noch „in Bearbeitung“.",
      },
    ],
  },
  {
    href: "/gefuehle/",
    note: "Übersetzungen in bear.<Sprache>.ts und kita.<Sprache>.ts (auch die Geschichten aus selbst.ts), Schritt für Schritt neben den deutschen Geschichten.",
    parts: [
      {
        label: "Wie geht's dir? und Kindergarten",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Auf Deutsch fehlen noch einige Sätze, die seit dem 4. November 2026 dazukamen (die Namen der Gefühle wie „Traurig“, ein paar Schritte der Geschichten), 92 mit denen der anderen Teile – bis dahin still. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "Zu Hause",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "„Müde am Abend“ (der Bär legt sich selbst schlafen) neu übersetzt am 3. November 2026. Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. „Partyhut wegnehmen“ beim Geburtstag (statt „Geschenk wegnehmen“, 4. November 2026) ist auf Deutsch noch nicht aufgenommen. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "Mehr Gefühle",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "24 Geschichten in selbst.ts – enttäuscht, eifersüchtig, Ekel, peinlich, aufgeregt und 19 weitere vom Spielplatz bis zum lauten Knall –, alle auf Deutsch von ElevenLabs gesprochen und übersetzt in kita.<Sprache>.ts (3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Am 4. November 2026 geändert und am 5. November 2026 übersetzt, auf Deutsch noch nicht aufgenommen: beim lauten Knall der dritte Schritt („Mit dem Fuchs Kuchen essen“) und das Ende, bei „Stolz, ganz oben“ der erste Schritt („„Komm doch auch hoch!“ rufen“) und das Ende, bei der Langeweile am Regentag der erste Schritt („Mit dem Fuchs Kochen spielen“) und das Ende, in „Traurig, Kuschelhase weg“ der „Kuschelhase“ des Bären und der „Kuschelhund“ des Fuchses. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "Neue Szenen",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "31 Szenen aus den Ideen C-37 bis C-72 (alltag.ts, 11. November 2026), vom Puzzle, das nicht passt, bis „Noch nicht ins Bett!“, und die Seiten der Geschichte von Tag 9 bis Tag 15 (days.ts): übersetzt auf Wunsch am 19. November 2026 (kita.<Sprache>.ts, days.<Sprache>.ts), außer auf Deutsch noch nicht gesprochen. Ihre Bilder warten in der Bilder-Queue; bis sie gemacht sind, zeigt die gebaute Seite die Szenen nicht. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Die anderen Sprachen am 23. November 2026 von ElevenLabs gesprochen, ganze Szenen und Tage je Stimme: mit „Tapsi Coach (Klon)“ (Englisch, Chinesisch, Hindi, Spanisch, Arabisch) und Russisch mit „Tapsi Coach (Klon ru)“.",
      },
      {
        label: "Buch und Gruppen",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Die neunte Gruppe „Frust & Warten“ (groups.ts, 11. November 2026), übersetzt auf Wunsch am 19. November 2026; sie zeigt erst neue Szenen, deren Bilder noch fehlen. Neu (4. November 2026), übersetzt am 5. November 2026: die Namen „Alltagssituationen“ und die Zeile von „Wie geht's dir?“ (names.ts), die acht Gruppen (groups.ts), „Stimme ausschalten“ / „Stimme einschalten“ des Lautsprechers (VoiceSwitch.tsx) (der Knopf „Text zum Vorlesen“, ReadAlong.tsx, wurde im November 2026 entfernt: der Text steht jetzt unter den Bildern); der Text selbst kommt aus den Szenen in ihrer Sprache.",
      },
      {
        label: "Tagesgeschichten",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Tag 9 bis Tag 15 (11. November 2026, mit den neuen Szenen), übersetzt auf Wunsch am 19. November 2026, außer auf Deutsch noch nicht gesprochen. Neu (4. November 2026), übersetzt am 5. November 2026 (days.<Sprache>.ts), außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026): die acht Tage mit ihren Seiten der Geschichte zwischen den Szenen und ihrem Ende (days.ts), die Namen „Tag 1“ … und die Zeile „Geschichten“ mit „📅 Tage“ / „😊 Nach Gefühlen“ (FeelingsGame.tsx). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Die anderen Sprachen am 23. November 2026 von ElevenLabs gesprochen, ganze Szenen und Tage je Stimme: mit „Tapsi Coach (Klon)“ (Englisch, Chinesisch, Hindi, Spanisch, Arabisch) und Russisch mit „Tapsi Coach (Klon ru)“.",
      },
    ],
  },
  {
    href: "/wie-gehts-dir/",
    note: "Im Buch „Gefühle“ (4. November 2026); seit dem 6. November 2026 die Gefühlskarten und „Wie doll ist es?“ mit drei Bildern. Seit 9. November 2026 ist „Was brauche ich?“ die zweite Karte seiner Startseite (ein Untermenü, früher ein eigenes Spiel); dessen Zeilen stehen unten. Teilt die Aufnahmen (stimme/) mit „Alltagssituationen“.",
    parts: [
      {
        label: "Frage „Wie geht's dir heute?“",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Außer Russisch von ElevenLabs gesprochen (Deutsch am 3., die anderen am 7./8. November 2026). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "Zeile für Erwachsene",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "MOOD_BLURB in names.ts, übersetzt am 5. November 2026.",
      },
      {
        label: "Gefühle und Wie doll ist es?",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Die Namen der acht Gefühle, „Wie doll ist es?“ und die drei Antworten, zugleich die Bildunterschriften (MOODS, STRENGTH_QUESTION, STRENGTH_ANSWERS in mood.ts), übersetzt am 5. November 2026, außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "Gruppen „Angenehme / Unangenehme Gefühle“",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu (6. November 2026): die kleinen Namen über den beiden Gruppen für Erwachsene (PLEASANT, UNPLEASANT in mood.ts), übersetzt am 7. November 2026.",
      },
      {
        label: "Name und Zeile für Erwachsene",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "NEEDS_TITLE, NEEDS_BLURB in needs.ts, übersetzt am 7. November 2026.",
      },
      {
        label: "Frage und was guttut",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "NEEDS in needs.ts: Kuscheln, allein sein, toben, trinken und das Lied mit ihren Sätzen übersetzt (5. November 2026), „Was brauchst du jetzt?“, „Stampfen und pusten“, „Etwas essen“ und „Ausruhen“ am 7. November 2026; das gemeinsame Pusten (CALM_LINE, CALM_DONE) übersetzt. Außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "Grundbedürfnisse: Aufs Töpfchen, Warm anziehen, Ein Pflaster, Frische Luft",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu (9. November 2026): vier Karten in NEEDS (needs.ts) mit ihren Sätzen, Bilder gemacht, übersetzt auf Wunsch am 10. November 2026. Von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme im zweiten Konto („Tapsi Coach (Klon)“): Englisch am 11., Chinesisch, Hindi, Spanisch und Arabisch am 12. November 2026; Deutsch und Russisch fehlen noch (bis dahin still). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
    ],
  },
  {
    href: "/was-ist-passiert/",
    parts: [
      {
        label: "Name, Zeile und „Was ist passiert?“",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Name und Zeile in names.ts, die Frage in scenes.ts (CAUSE_QUESTION), übersetzt auf Wunsch am 10. November 2026. Die Texte für Suchmaschinen gibt es in allen sieben Sprachen (seo.<Sprache>.ts).",
      },
      {
        label: "Die 30 Szenen",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Neu geschrieben am 10. November 2026 (scenes.ts): was der Bär zeigt, die beiden Fragen unter den Bildern und warum. Übersetzt auf Wunsch am 11. November 2026 (scenes.<Sprache>.ts, nach Id). Keine Stimme.",
      },
    ],
  },
  {
    href: "/tiere/",
    parts: [
      {
        label: "Füttern, Was gibt uns das Tier?, Wer wohnt wo?, Was wird aus mir?",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Alle Spielarten, auch „Was gibt uns das Tier?“ und „Was wird aus mir?“ (Wörter und Sätze in content.<Sprache>.ts), die Fragen in der Sprechblase und die Einstellungen hinter ⚙️ (übersetzt am 3. November 2026). Was gesagt wird, ist auf Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Auch alles, was am 7. November 2026 dazukam (die neuen Tiere, Zuhause, Futter, Geschenke und Entwicklungen aus GERMAN_ONLY in content.ts), am selben Tag übersetzt; die deutschen Sätze dazu sind noch nicht aufgenommen; „Wer schaut da raus?“ ist zu „Erkennen“ (Schatten finden) umgezogen. Seit 7. November 2026 (Z-24) fragt die Stimme beim Füttern nach „… hat Hunger!“ auch „Was isst der Hase gern?“ (am 7. November 2026 übersetzt) und sagt beim Wechsel der Art der Runde deren Frage („Was esse ich?“). Auf Deutsch fehlen noch 390 Sätze (alles vom 7. November 2026), bis dahin still. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "🔊 Wer macht das Geräusch? (Z-15) und „Was drankommt“ oben rechts",
        recorded: true,
        languages: { de: "done", en: "text", zh: "text", hi: "text", es: "text", ar: "text", ru: "done" },
        note: "Neu am 11. November 2026: der Name der Art, ihre Frage, „Hör mal! Wer ist hinter dem Vorhang?“ und die neuen Tiere Hahn, Taube, Truthahn, Pfau, Mücke und Schlange, am 12. November 2026 Küken und Fliege. Auf Wunsch übersetzt am 19. November 2026 (die Tiere in content.<Sprache>.ts, die Sätze in deren `sound`; GERMAN_ONLY ist wieder leer); in den anderen Sprachen fehlen die Aufnahmen noch, bis dahin still. „Da ist ja …“ und „Das ist …“ sind die Sätze von „Wer schaut da raus?“. Die Wahl „Was drankommt“ ist übersetzt; ihre Liste stand vorher hinter ⚙️, die „Schwierigkeit“ ist weg. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 mit „Tapsi Coach (Klon ru)“ aufgenommen, wie das ganze russische Spiel. Englisch, Chinesisch, Hindi, Spanisch und Arabisch bleiben mit Absicht ohne Aufnahme: der Klon spräche dort mitten unter Tapsis echten Sätzen des Spiels („Da ist ja …“); sie kommen erst mit Tapsis eigener Stimme im ersten Konto.",
      },
    ],
  },
  {
    href: "/zusammen/",
    parts: [
      {
        label: "🤝 Die ersten Paare und Helfer, Fragen und Einstellungen",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt am 5. November 2026: die neun ersten Paare (Zahnbürste bis Friseurin) mit Namen und Sätzen (content.<Sprache>.ts) und die Einstellungen beim Spielen. Die Sätze spricht Tapsis Stimme von ElevenLabs auf Deutsch (3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "🗣️ Was jemand vorhat (Z-25): ein Satz je Paar statt der Frage",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit 7. November 2026 sagt die Stimme, was jemand vorhat, ohne das Gegenstück zu nennen („Die Blume hat Durst.“, „Die Feuerwehr will das Feuer löschen.“), und er steht klein unter dem Bild – 190 Sätze, für jedes Paar einer, in pairs.tsx und painted/. Am selben Tag in alle sechs Sprachen übersetzt (die `question` in content.<Sprache>.ts und content.scenes.<Sprache>.ts), in jeder Sprache klein unter dem Bild. Außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026); bis dahin bleibt die Frage dort stumm. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "🎨 Die gemalten Paare und Helfer (painted/)",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Am 7. November 2026 wurden die Emoji-Szenen durch gemalte Paare ersetzt (181, je zwei Bilder von Gemini; sie spielen, sobald ihre Bilder da sind). 108 davon behielten Namen und Gegenstück und damit ihre Übersetzung (content.scenes.<Sprache>.ts). Die übrigen 73, am selben Tag in alle sechs Sprachen übersetzt, sind – darunter Tor – Ball, Haltestelle – Bus, Toaster – Toast, Straßenkehrer, Schäfer, Prinzessin, Sandmann – sowie die mit neuem Gegenstück: Saftpresse – Orange, Feuerstelle – Feuer, Torte – Kerzen, Zahnärztin, Weihnachtsmann, Pizzabäcker, Konditorin, Paketbotin, Krankenpfleger, Polizist, Koch, Eisverkäuferin, Kassierer, Kellnerin, Gärtner. Außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026). Die sieben Paare, die am 11. November 2026 dazukamen (Astronautin, Hubschrauberpilotin, Koch, Pianistin, Radfahrerin, Fee, Tiefseeforscherin), am 12. November 2026 mit dem Klon von Tapsis Stimme im zweiten Konto („Tapsi Coach (Klon)“), ganze Paare je Stimme. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
      {
        label: "🗂️ Die Namen der Themen",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Übersetzt am 7. November 2026 (topics.ts): „Im Bad“, „Berufe“, „Unterwegs“ … – für eine spätere Wahl der Themen hinter ⚙️.",
      },
    ],
  },
  {
    href: "/schatten/",
    parts: [
      {
        label: "Name und Zeile des Spiels",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Seit dem Umzug von „Wer schaut da raus?“ heißt das Spiel „Erkennen“ (7. November 2026); Name und Zeile im Inhaltsverzeichnis übersetzt auf Wunsch am 10. November 2026. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto).",
      },
      {
        label: "Bilder, Sätze und Stimme",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Die 114 neuen Bilder vom 7. November 2026 (20 Tiere, T-Rex, Spinne, Wurm, Grashüpfer, Hummer, 13 Fahrzeuge, 14 Bilder zum Essen, 62 Dinge) am selben Tag übersetzt; ihre deutschen Sätze sind noch nicht aufgenommen. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 23. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ganz, wie die anderen Spiele schon seit dem 12. November 2026.",
      },
    ],
  },

  {
    href: "/socken/",
    recorded: true,
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
    note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto).",
  },
  {
    href: "/buchstaben/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026) bis auf die 361 Zählsätze („drei Äpfel!“, ≈ 1.100 Credits), für die die Credits nicht mehr reichten: bis dahin sagt das Spiel nur die Zahl. Die anderen Sprachen außer Russisch sind ganz von ElevenLabs gesprochen, auch die Zählsätze (7./8. November 2026); Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Die Zeile im Inhaltsverzeichnis und der Hinweis unter ⚙️ beim Spielstart („Hier lässt sich viel einstellen …“) übersetzt am 5. November 2026. Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch. Jede Taste tippt den Buchstaben an ihrer Stelle der Tastatur der Sprache: Russisch ЙЦУКЕН, Hindi InScript, Arabisch die arabische Tastatur; Chinesisch tippt Pinyin auf lateinischen Tasten zu chinesischen Wörtern (B – 爸爸). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ohne die Tags, wie ein Satz gesagt wird („[warmly]“), da die Credits nur so reichten – ganz, auch die Zählsätze (die Aufnahmen von „Buchstaben & Zahlen“ gelten für alle Spiele dieses Buchs). Zweistellige Zahlen (21. November 2026, Schalter unter ⚙️) kommen nur auf Englisch: der Schalter und die Zahlwörter 10–99 („twenty-three!“), noch nicht aufgenommen – bis dahin bleibt die zweistellige Zahl still, auf Deutsch fehlt beides. Ebenso der Schalter für die dunkle Seite (21. November 2026), nur auf Englisch.",
  },
  {
    href: "/zaehlen/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Ein Spiel für sich seit November 2026 (vorher „Nur Zahlen“ in „Frei tippen“), mit dessen Zahlen und Texten. Deutsch von ElevenLabs gesprochen bis auf die Zählsätze („drei Äpfel!“): bis dahin sagt es nur die Zahl. Name, Zeile im Inhaltsverzeichnis und der Hinweis unter ⚙️ beim Spielstart übersetzt am 5. November 2026. Die anderen Sprachen außer Russisch sind ganz von ElevenLabs gesprochen, auch die Zählsätze (7./8. November 2026); Russisch fehlt noch. Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ohne die Tags, wie ein Satz gesagt wird („[warmly]“), da die Credits nur so reichten – ganz, auch die Zählsätze (die Aufnahmen von „Buchstaben & Zahlen“ gelten für alle Spiele dieses Buchs). Zweistellige Zahlen (21. November 2026, Schalter unter ⚙️) kommen nur auf Englisch: der Schalter und die Zahlwörter 10–99 („twenty-three!“), noch nicht aufgenommen – bis dahin bleibt die zweistellige Zahl still, auf Deutsch fehlt beides. „Wo ist die 3?“ (L-17, 21. November 2026, Wahl unter ⚙️) kommt nur auf Englisch: die Wahl („What to play?“), der Satz im Hinweis unter ⚙️ und die Frage „How many? Find the number!“, noch nicht aufgenommen – bis dahin still; die gefundene Zahl sagt ihren aufgenommenen Zählsatz.",
  },
  {
    href: "/zaehlturm/",
    recorded: true,
    languages: { en: "partial", de: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Neu (21. November 2026, L-18), englisch zuerst: Name, Zeile im Inhaltsverzeichnis, die Namen der zehn Ziele (für „Weiter“ und die Pokale) und die Texte hinter ⚙️ („Start at“, „From 1“) nur auf Englisch, bis Übersetzungen gewünscht sind. Gezählt wird mit den Zahlwörtern eins bis neun aus den Aufnahmen von „Buchstaben & Zahlen“, in jeder Sprache; 10 bis 99 sind die englischen zweistelligen Zahlwörter von „Buchstaben & Zahlen“ und „one hundred!“ eigenes Englisch, alle noch nicht aufgenommen – bis dahin bleiben diese Klötze still. Die Texte für Suchmaschinen gibt es in allen sieben Sprachen.",
  },
  {
    href: "/mitmachen/",
    recorded: true,
    languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Neu (November 2026, L-15), mit den Zahlwörtern und Tu-Wörtern der Sprachpakete: „Hüpf mit!“, „Klatsch mit!“ und die Zahlwörter sind auf Deutsch von ElevenLabs gesprochen, „Stampf mit!“ fehlt noch (bis dahin still). Name, Zeile im Inhaltsverzeichnis und „Stampf mit!“ übersetzt am 5. November 2026. Die anderen Sprachen außer Russisch sind ganz von ElevenLabs gesprochen (7./8. November 2026); Russisch fehlt noch. Hindi hat kein „Klatsch mit!“ (zwei Wörter). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ohne die Tags, wie ein Satz gesagt wird („[warmly]“), da die Credits nur so reichten – ganz, auch die Zählsätze (die Aufnahmen von „Buchstaben & Zahlen“ gelten für alle Spiele dieses Buchs).",
  },
  {
    href: "/woerter/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Die großen Tasten auf Touch-Bildschirmen (W-02, 21. November 2026): ihre Auswahl unter ⚙️ („How many keys“, „Big keys, 3 to 6 by themselves“, „All letters“) nur auf Englisch. Ein Spiel für sich seit November 2026 (vorher eine Spielart von „Buchstaben & Zahlen“), mit „Wo ist das B?“; Wörter aus den Sprachpaketen wie bei „Frei tippen“. Deutsch von ElevenLabs gesprochen, die anderen Sprachen außer Russisch am 7./8. November 2026; Russisch fehlt noch. Die Zeile im Inhaltsverzeichnis und der Hinweis unter ⚙️ beim Spielstart übersetzt am 5. November 2026. Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ohne die Tags, wie ein Satz gesagt wird („[warmly]“), da die Credits nur so reichten – ganz, auch die Zählsätze (die Aufnahmen von „Buchstaben & Zahlen“ gelten für alle Spiele dieses Buchs).",
  },
  {
    href: "/gross-klein/",
    recorded: true,
    languages: { de: "done", en: "text", zh: "text", hi: "partial", es: "text", ar: "partial", ru: "done" },
    note: "Neu (November 2026, L-23), für alle spielbar. Der Name „Wo ist das kleine b?“, die Zeile im Inhaltsverzeichnis und die Frage „Wo ist das kleine …?“ auf Wunsch übersetzt am 19. November 2026 (Name und Zeile auch auf Hindi und Arabisch, wie die Seiten für Suchmaschinen sie nennen; Chinesisch nennt den Pinyin-Buchstaben wie seine Kinder, „小写的玻在哪里？“); die Frage ist außer auf Deutsch noch nicht aufgenommen, bis dahin still. Der Name des gefundenen Buchstabens und das Lob kommen aus den Aufnahmen von „Buchstaben & Zahlen“, in jeder Sprache. Hindi und Arabisch („partial“: Name und Zeile übersetzt, mehr gibt es dort nicht zu übersetzen) haben keine Groß- und Kleinbuchstaben: dort spielt es auf Englisch (Deutsch, solange das englische Paket nicht geladen ist). Deutsch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren deutschen Aufnahmen („Tapsi Coach (Klon de)“, zweites Konto). Russisch am 12. November 2026 von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme aus ihren russischen Aufnahmen („Tapsi Coach (Klon ru)“, zweites Konto), ohne die Tags, wie ein Satz gesagt wird („[warmly]“), da die Credits nur so reichten – ganz, auch die Zählsätze (die Aufnahmen von „Buchstaben & Zahlen“ gelten für alle Spiele dieses Buchs). Die russische Frage „Где маленькая буква …?“ am 23. November 2026 mit demselben Klon aufgenommen. Englisch, Chinesisch und Spanisch bleiben mit Absicht ohne Aufnahme der Frage: dort spräche der Klon mitten unter Tapsis echten Buchstaben-Aufnahmen; sie kommt erst mit Tapsis eigener Stimme im ersten Konto.",
  },
  {
    href: "/",
    parts: [
      {
        label: "Startseite, Menüs und alles für Eltern",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Startseite, Einstellungen und alles für Eltern (🌐 auf der Startseite), auch „Junge / Mädchen“, „Spiel verlassen“, die Schnitzerei „Für Groß & Klein“ mit „mehr …“, „Lernspiele“, „Alltagshelfer“ und „Ein paar Worte von uns“ (übersetzt am 3. November 2026); nur die Management-Seite, Impressum und Datenschutz bleiben Deutsch; die Seiten für Suchmaschinen gibt es in allen sieben Sprachen (/en/, /zh/, /hi/, /es/, /ar/, /ru/, A-22; die fünf weiteren seit 7. November 2026). „Gute Nacht! Die Spielzeit ist vorbei.“ (alle Spiele) von ElevenLabs gesprochen, in allen sieben Sprachen (30. Oktober 2026). „Nochmal oder weiter?“ und „Nochmal?“ am Ende eines Levels (alle Spiele, A-24) in allen sieben Sprachen geschrieben (7. November 2026) und außer Russisch von ElevenLabs gesprochen (7./8. November 2026). Der Name „Fun for Both“ bleibt in allen Sprachen gleich. „Wer spielt?“ über dem Fuchs-Sticker im Regal (Bookshelf.tsx) übersetzt am 5. November 2026; auf Hindi „किसकी बारी?“, da „wer spielt“ dort nach Junge oder Mädchen ginge. „Ohne Internet spielen“ hinter „mehr …“ (OfflineOptions.tsx: speichern ja/nein, Musik und Stimmen, Bücher) übersetzt am 8. November 2026. „Feedback“ unten links auf der Startseite (RoomOptions.tsx: „Schreiben Sie uns“, „E-Mail schreiben“) übersetzt am 8. November 2026.",
      },
      {
        label: "📱 Hinweis „Bitte quer halten“",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Der Satz unter „Bitte quer halten“ (was die Seite bietet und warum quer, 10. November 2026) übersetzt auf Wunsch am 11. November 2026, wie Titel, „Vollbild“ und „Trotzdem hochkant“.",
      },
      {
        label: "🏆 Pokal am Ende eines Levels",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "„Geschafft!“ unter dem großen Pokal am Ende eines Levels (GameEnd.tsx, 12. November 2026), auf Wunsch übersetzt am 19. November 2026. Die Zahl der Siege auf dem Fuß des Pokals („3×“, 13. November 2026) braucht keine.",
      },
      {
        label: "🏆 Pokalzimmer",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        files: [
          "src/lib/museum.ts",
          "src/components/TrophyMuseum.tsx",
          "src/components/TrophySign.tsx",
          "src/components/trophyNames.ts",
          "src/pages/TrophyRoomPage.tsx",
        ],
        note: "Das Pokalzimmer neben dem Regal (/pokale/, 13. November 2026), englisch zuerst: „Trophy room“ (Schild am Regal, Raumname, Seitentitel, auch am Pokal am Ende eines Levels), „Bookshelf“, „Hall“, der Plan der Räume („Plan of the trophy rooms“, „You are here“, „Close“), „Put it back“ und „First won“, auf Wunsch übersetzt am 19. November 2026, Deutsch eingeschlossen. „Zurück zum Bücherregal“ ist schon in allen Sprachen da, ebenso die Namen der Spiele und Level auf den Schildern der Sockel; „Tag“ und „Runde“ mit ihrer Zahl (trophyNames.ts) stehen in allen sieben Sprachen.",
      },
      {
        label: "📚 Abspann der YouTube-Videos",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        files: ["src/video/outro/content.ts"],
        note: "Die Wörter auf der Karte am Ende jedes Videos (/management/video-outro/, Y-04 und Y-05, 21. November 2026), englisch zuerst: die fünf Zeichen „Free“, „No ads“, „Plays offline“, „7 languages“, „Play-time limit“ und „Scan to play“ über dem QR-Code. Am 22. November 2026 in alle anderen Sprachen übersetzt; die Adresse des Codes folgt schon der Sprache (/en/). Name und Adresse brauchen keine. Tapsi sagt die Adresse noch nicht (bezahlte Aufnahme).",
      },
    ],
  },
];
