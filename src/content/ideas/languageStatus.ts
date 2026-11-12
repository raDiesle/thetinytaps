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
    href: "/timer/",
    parts: [
      {
        label: "Bilder und Menü",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Name, Satz im Regal, die drei Bilder und „Wie lange?“ übersetzt am 3. November 2026, alles andere am 5. November 2026: der Zettel „Andere …“ mit seinem Blatt, die Frage nach einer schon vergangenen Uhrzeit, die Restzeit, die Namen der Bilder und bei „Abwechseln“ Spielzeug, „Wer ist dran?“ und „Bis zum Wechsel“. Am 10. November 2026 übersetzt, was noch fehlte: die Zeile auf der Karte „Abwechseln“ („Läuft ohne Ende, jeder ist mal dran“), hinter ⚙️ die Wahl „Zeit im Bild“ (Aus, Zahlen, Striche) und die Namen der Bilder „Sonnenaufgang“, „Wecker“ und „Tennis“.",
      },
      {
        label: "🗣️ Stimme",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        recorded: true,
        note: "Was jedes Bild am Anfang und am Ende sagt, „Gleich ist es so weit!“ zur Glocke, und bei Abwechseln und Tennis „Wer fängt an?“, wer anfängt und „Tauschen! …“ (H-72, voice.ts, 7. November 2026): in alle Sprachen übersetzt (timerSaid) und außer Russisch von ElevenLabs gesprochen (7./8. November 2026); Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin still, keine Browserstimme.",
      },
    ],
  },
  {
    href: "/abstillen/",
    note: "Das Buch „Abstillen“ mit „Tapsis Milchkette“, der Abstillgeschichte in Kapiteln (milkChain.ts): Name, Satz fürs Regal, Kapitel und Sätze in <Sprache>.ts im Ordner, übersetzt auf Wunsch am 9. November 2026. Die Sätze liest ein Erwachsener vor, Aufnahmen gibt es keine.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/schnullerfee/",
    note: "Das Buch „Schnullerfee“ mit „Tapsi und die Schnullerfee“, einer Geschichte in Kapiteln (pacifierStory.ts, November 2026): Name, Satz fürs Regal, Kapitel und Sätze in <Sprache>.ts im Ordner, übersetzt auf Wunsch am 10. November 2026. Die Sätze liest ein Erwachsener vor, Aufnahmen gibt es keine. Die Wörter des Buchs selbst (Kapitel, Weiter) kommen aus ChapterBook.",
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
  },
  {
    href: "/kita/",
    note: "Das Buch „Kita-Start“ mit „Tapsi geht in die Kita“, einer Geschichte in Kapiteln (kitaStory.ts, 11. November 2026): nur Deutsch. Es fehlen Name, Satz fürs Regal (names.ts) und Kapitel und Sätze, als <Sprache>.ts im Ordner wie bei „Schnullerfee“. Die Sätze liest ein Erwachsener vor, Aufnahmen gibt es keine. Die Wörter des Buchs selbst (Kapitel, Weiter) kommen aus ChapterBook; die Texte für Suchmaschinen sind in allen sieben Sprachen da.",
    languages: { de: "done" },
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
    href: "/toepfchen/",
    parts: [
      {
        label: "🚽 Bilder und Texte",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Übersetzt im Oktober 2026; Tapsi heißt „Тапси“, „塔普西“, „टैप्सी“, „تابسي“. Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm.",
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
    ],
  },
  {
    href: "/kettenreaktion/",
    parts: [
      {
        label: "⛓️ Alle Bahnen und Maschinen",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Auch Schneebahn, Weltraumbahn, Wasserrutsche und Baustellen-Bahn (übersetzt am 3. November 2026). Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm.",
      },
      {
        label: "👆 „Mitmachen“ über den Karten",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "Hieß „Schranke und Weiche“ und gilt seit R-03 (3. November 2026) auch für die Stationen der Maschinen; der neue Name übersetzt am 5. November 2026.",
      },
      {
        label: "🎨 Farbenbahn",
        recorded: true,
        languages: { de: "text" },
        note: "Neu seit K-10 (11. November 2026): Name, erster Satz, „Eine rote!“ bis „Fünf blaue!“ und „Die Röhre ist voll!“ nur auf Deutsch und noch nicht gesprochen; bis dahin zählen nur die Töne.",
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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Neu (4. November 2026), übersetzt am 5. November 2026, außer Russisch von ElevenLabs gesprochen (7./8. November 2026); auf Russisch liest bis dahin die Stimme des Browsers.",
      },
      {
        label: "🥨 Beim Bäcker",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Neu (4. November 2026), übersetzt am 5. November 2026, außer Russisch von ElevenLabs gesprochen (7./8. November 2026); auf Russisch liest bis dahin die Stimme des Browsers.",
      },
      {
        label: "🌻 Unser Garten wächst",
        recorded: true,
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Neu (10. November 2026), Titel und Sätze übersetzt auf Wunsch am 11. November 2026. Von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme im zweiten Konto („Tapsi Coach (Klon)“, die Credits des ersten waren aufgebraucht): Englisch am 11., Chinesisch, Hindi, Spanisch und Arabisch am 12. November 2026; Deutsch und Russisch noch nicht aufgenommen: bis dahin liest die Stimme des Browsers.",
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
    note: "Übersetzungen in bear.<Sprache>.ts und kita.<Sprache>.ts (auch die Geschichten aus selbst.ts), Schritt für Schritt neben den deutschen Geschichten.",
    parts: [
      {
        label: "Wie geht's dir? und Kindergarten",
        recorded: true,
        languages: { de: "partial", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Auf Deutsch fehlen noch einige Sätze, die seit dem 4. November 2026 dazukamen (die Namen der Gefühle wie „Traurig“, ein paar Schritte der Geschichten), 92 mit denen der anderen Teile – bis dahin still.",
      },
      {
        label: "Zu Hause",
        recorded: true,
        languages: { de: "partial", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "„Müde am Abend“ (der Bär legt sich selbst schlafen) neu übersetzt am 3. November 2026. Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. „Partyhut wegnehmen“ beim Geburtstag (statt „Geschenk wegnehmen“, 4. November 2026) ist auf Deutsch noch nicht aufgenommen.",
      },
      {
        label: "Mehr Gefühle",
        recorded: true,
        languages: { de: "partial", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "24 Geschichten in selbst.ts – enttäuscht, eifersüchtig, Ekel, peinlich, aufgeregt und 19 weitere vom Spielplatz bis zum lauten Knall –, alle auf Deutsch von ElevenLabs gesprochen und übersetzt in kita.<Sprache>.ts (3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Am 4. November 2026 geändert und am 5. November 2026 übersetzt, auf Deutsch noch nicht aufgenommen: beim lauten Knall der dritte Schritt („Mit dem Fuchs Kuchen essen“) und das Ende, bei „Stolz, ganz oben“ der erste Schritt („„Komm doch auch hoch!“ rufen“) und das Ende, bei der Langeweile am Regentag der erste Schritt („Mit dem Fuchs Kochen spielen“) und das Ende, in „Traurig, Kuschelhase weg“ der „Kuschelhase“ des Bären und der „Kuschelhund“ des Fuchses.",
      },
      {
        label: "Neue Szenen",
        recorded: true,
        languages: { de: "text" },
        note: "31 Szenen aus den Ideen C-37 bis C-72 (alltag.ts, 11. November 2026), vom Puzzle, das nicht passt, bis „Noch nicht ins Bett!“, und die Seiten der Geschichte von Tag 9 bis Tag 15 (days.ts): nur Deutsch, noch nicht gesprochen und noch nicht übersetzt (kita.<Sprache>.ts, days.<Sprache>.ts). Ihre Bilder warten in der Bilder-Queue; bis sie gemacht sind, zeigt die gebaute Seite die Szenen nicht.",
      },
      {
        label: "Buch und Gruppen",
        languages: { de: "done", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
        note: "Die neunte Gruppe „Frust & Warten“ (groups.ts, 11. November 2026) gibt es nur auf Deutsch; sie zeigt erst neue Szenen, deren Bilder noch fehlen. Neu (4. November 2026), übersetzt am 5. November 2026: die Namen „Alltagssituationen“ und die Zeile von „Wie geht's dir?“ (names.ts), die acht Gruppen (groups.ts), „Stimme ausschalten“ / „Stimme einschalten“ des Lautsprechers (VoiceSwitch.tsx) (der Knopf „Text zum Vorlesen“, ReadAlong.tsx, wurde im November 2026 entfernt: der Text steht jetzt unter den Bildern); der Text selbst kommt aus den Szenen in ihrer Sprache.",
      },
      {
        label: "Tagesgeschichten",
        recorded: true,
        languages: { de: "text", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
        note: "Tag 9 bis Tag 15 (11. November 2026, mit den neuen Szenen) gibt es nur auf Deutsch, noch nicht gesprochen. Neu (4. November 2026), übersetzt am 5. November 2026 (days.<Sprache>.ts), außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026): die acht Tage mit ihren Seiten der Geschichte zwischen den Szenen und ihrem Ende (days.ts), die Namen „Tag 1“ … und die Zeile „Geschichten“ mit „📅 Tage“ / „😊 Nach Gefühlen“ (FeelingsGame.tsx).",
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
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Außer Russisch von ElevenLabs gesprochen (Deutsch am 3., die anderen am 7./8. November 2026).",
      },
      {
        label: "Zeile für Erwachsene",
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "done" },
        note: "MOOD_BLURB in names.ts, übersetzt am 5. November 2026.",
      },
      {
        label: "Gefühle und Wie doll ist es?",
        recorded: true,
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Die Namen der acht Gefühle, „Wie doll ist es?“ und die drei Antworten, zugleich die Bildunterschriften (MOODS, STRENGTH_QUESTION, STRENGTH_ANSWERS in mood.ts), übersetzt am 5. November 2026, außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026).",
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
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "NEEDS in needs.ts: Kuscheln, allein sein, toben, trinken und das Lied mit ihren Sätzen übersetzt (5. November 2026), „Was brauchst du jetzt?“, „Stampfen und pusten“, „Etwas essen“ und „Ausruhen“ am 7. November 2026; das gemeinsame Pusten (CALM_LINE, CALM_DONE) übersetzt. Außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026).",
      },
      {
        label: "Grundbedürfnisse: Aufs Töpfchen, Warm anziehen, Ein Pflaster, Frische Luft",
        recorded: true,
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Neu (9. November 2026): vier Karten in NEEDS (needs.ts) mit ihren Sätzen, Bilder gemacht, übersetzt auf Wunsch am 10. November 2026. Von ElevenLabs gesprochen mit dem Klon von Tapsis Stimme im zweiten Konto („Tapsi Coach (Klon)“): Englisch am 11., Chinesisch, Hindi, Spanisch und Arabisch am 12. November 2026; Deutsch und Russisch fehlen noch (bis dahin still).",
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
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Alle Spielarten, auch „Was gibt uns das Tier?“ und „Was wird aus mir?“ (Wörter und Sätze in content.<Sprache>.ts), die Fragen in der Sprechblase und die Einstellungen hinter ⚙️ (übersetzt am 3. November 2026). Was gesagt wird, ist auf Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Auch alles, was am 7. November 2026 dazukam (die neuen Tiere, Zuhause, Futter, Geschenke und Entwicklungen aus GERMAN_ONLY in content.ts), am selben Tag übersetzt; die deutschen Sätze dazu sind noch nicht aufgenommen; „Wer schaut da raus?“ ist zu „Erkennen“ (Schatten finden) umgezogen. Seit 7. November 2026 (Z-24) fragt die Stimme beim Füttern nach „… hat Hunger!“ auch „Was isst der Hase gern?“ (am 7. November 2026 übersetzt) und sagt beim Wechsel der Art der Runde deren Frage („Was esse ich?“). Auf Deutsch fehlen noch 390 Sätze (alles vom 7. November 2026), bis dahin still.",
      },
      {
        label: "🔊 Wer macht das Geräusch? (Z-15) und „Was drankommt“ oben rechts",
        recorded: true,
        languages: { de: "text" },
        note: "Neu am 11. November 2026, nur Deutsch: der Name der Art, ihre Frage, „Hör mal! Wer ist hinter dem Vorhang?“ und die neuen Tiere Hahn, Taube, Truthahn, Pfau, Mücke und Schlange (GERMAN_ONLY in content.ts). „Da ist ja …“ und „Das ist …“ sind die Sätze von „Wer schaut da raus?“. Die Wahl „Was drankommt“ ist übersetzt; ihre Liste stand vorher hinter ⚙️, die „Schwierigkeit“ ist weg.",
      },
    ],
  },
  {
    href: "/zusammen/",
    parts: [
      {
        label: "🤝 Die ersten Paare und Helfer, Fragen und Einstellungen",
        recorded: true,
        languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Übersetzt am 5. November 2026: die neun ersten Paare (Zahnbürste bis Friseurin) mit Namen und Sätzen (content.<Sprache>.ts) und die Einstellungen beim Spielen. Die Sätze spricht Tapsis Stimme von ElevenLabs auf Deutsch (3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm.",
      },
      {
        label: "🗣️ Was jemand vorhat (Z-25): ein Satz je Paar statt der Frage",
        recorded: true,
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Seit 7. November 2026 sagt die Stimme, was jemand vorhat, ohne das Gegenstück zu nennen („Die Blume hat Durst.“, „Die Feuerwehr will das Feuer löschen.“), und er steht klein unter dem Bild – 190 Sätze, für jedes Paar einer, in pairs.tsx und painted/. Am selben Tag in alle sechs Sprachen übersetzt (die `question` in content.<Sprache>.ts und content.scenes.<Sprache>.ts), in jeder Sprache klein unter dem Bild. Außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026); bis dahin bleibt die Frage dort stumm.",
      },
      {
        label: "🎨 Die gemalten Paare und Helfer (painted/)",
        recorded: true,
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Am 7. November 2026 wurden die Emoji-Szenen durch gemalte Paare ersetzt (181, je zwei Bilder von Gemini; sie spielen, sobald ihre Bilder da sind). 108 davon behielten Namen und Gegenstück und damit ihre Übersetzung (content.scenes.<Sprache>.ts). Die übrigen 73, am selben Tag in alle sechs Sprachen übersetzt, sind – darunter Tor – Ball, Haltestelle – Bus, Toaster – Toast, Straßenkehrer, Schäfer, Prinzessin, Sandmann – sowie die mit neuem Gegenstück: Saftpresse – Orange, Feuerstelle – Feuer, Torte – Kerzen, Zahnärztin, Weihnachtsmann, Pizzabäcker, Konditorin, Paketbotin, Krankenpfleger, Polizist, Koch, Eisverkäuferin, Kassierer, Kellnerin, Gärtner. Außer Deutsch und Russisch von ElevenLabs gesprochen (7./8. November 2026). Die sieben Paare, die am 11. November 2026 dazukamen (Astronautin, Hubschrauberpilotin, Koch, Pianistin, Radfahrerin, Fee, Tiefseeforscherin), am 12. November 2026 mit dem Klon von Tapsis Stimme im zweiten Konto („Tapsi Coach (Klon)“), ganze Paare je Stimme.",
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
        note: "Seit dem Umzug von „Wer schaut da raus?“ heißt das Spiel „Erkennen“ (7. November 2026); Name und Zeile im Inhaltsverzeichnis übersetzt auf Wunsch am 10. November 2026.",
      },
      {
        label: "Bilder, Sätze und Stimme",
        recorded: true,
        languages: { de: "text", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
        note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Die 114 neuen Bilder vom 7. November 2026 (20 Tiere, T-Rex, Spinne, Wurm, Grashüpfer, Hummer, 13 Fahrzeuge, 14 Bilder zum Essen, 62 Dinge) am selben Tag übersetzt; ihre deutschen Sätze sind noch nicht aufgenommen.",
      },
    ],
  },

  {
    href: "/socken/",
    recorded: true,
    languages: { de: "done", en: "done", zh: "done", hi: "done", es: "done", ar: "done", ru: "text" },
    note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026). Die anderen Sprachen außer Russisch von ElevenLabs gesprochen am 7./8. November 2026; Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm.",
  },
  {
    href: "/buchstaben/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Deutsch von ElevenLabs gesprochen (Tapsis Stimme, 3. November 2026) bis auf die 361 Zählsätze („drei Äpfel!“, ≈ 1.100 Credits), für die die Credits nicht mehr reichten: bis dahin sagt das Spiel nur die Zahl. Die anderen Sprachen außer Russisch sind ganz von ElevenLabs gesprochen, auch die Zählsätze (7./8. November 2026); Russisch fehlt noch (die Credits des Monats waren aufgebraucht) und bleibt bis dahin stumm. Die Zeile im Inhaltsverzeichnis und der Hinweis unter ⚙️ beim Spielstart („Hier lässt sich viel einstellen …“) übersetzt am 5. November 2026. Auch 🇹🇷 Türkisch und 🇵🇱 Polnisch. Jede Taste tippt den Buchstaben an ihrer Stelle der Tastatur der Sprache: Russisch ЙЦУКЕН, Hindi InScript, Arabisch die arabische Tastatur; Chinesisch tippt Pinyin auf lateinischen Tasten zu chinesischen Wörtern (B – 爸爸).",
  },
  {
    href: "/zaehlen/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Ein Spiel für sich seit November 2026 (vorher „Nur Zahlen“ in „Frei tippen“), mit dessen Zahlen und Texten. Deutsch von ElevenLabs gesprochen bis auf die Zählsätze („drei Äpfel!“): bis dahin sagt es nur die Zahl. Name, Zeile im Inhaltsverzeichnis und der Hinweis unter ⚙️ beim Spielstart übersetzt am 5. November 2026. Die anderen Sprachen außer Russisch sind ganz von ElevenLabs gesprochen, auch die Zählsätze (7./8. November 2026); Russisch fehlt noch.",
  },
  {
    href: "/mitmachen/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Neu (November 2026, L-15), mit den Zahlwörtern und Tu-Wörtern der Sprachpakete: „Hüpf mit!“, „Klatsch mit!“ und die Zahlwörter sind auf Deutsch von ElevenLabs gesprochen, „Stampf mit!“ fehlt noch (bis dahin still). Name, Zeile im Inhaltsverzeichnis und „Stampf mit!“ übersetzt am 5. November 2026. Die anderen Sprachen außer Russisch sind ganz von ElevenLabs gesprochen (7./8. November 2026); Russisch fehlt noch. Hindi hat kein „Klatsch mit!“ (zwei Wörter).",
  },
  {
    href: "/woerter/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", hi: "partial", es: "partial", ar: "partial", ru: "partial" },
    note: "Ein Spiel für sich seit November 2026 (vorher eine Spielart von „Buchstaben & Zahlen“), mit „Wo ist das B?“; Wörter aus den Sprachpaketen wie bei „Frei tippen“. Deutsch von ElevenLabs gesprochen, die anderen Sprachen außer Russisch am 7./8. November 2026; Russisch fehlt noch. Die Zeile im Inhaltsverzeichnis und der Hinweis unter ⚙️ beim Spielstart übersetzt am 5. November 2026.",
  },
  {
    href: "/gross-klein/",
    recorded: true,
    languages: { de: "partial", en: "partial", zh: "partial", es: "partial", ru: "partial" },
    note: "Neu (November 2026, L-23), noch „in Bearbeitung“. Nur Deutsch: der Name „Wo ist das kleine b?“, die Zeile im Inhaltsverzeichnis und die Frage „Wo ist das kleine …?“ (noch nicht aufgenommen, bis dahin still). Der Name des gefundenen Buchstabens und das Lob kommen aus den Aufnahmen von „Buchstaben & Zahlen“, in jeder Sprache. Hindi und Arabisch haben keine Groß- und Kleinbuchstaben: dort spielt es auf Englisch (Deutsch, solange das englische Paket nicht geladen ist).",
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
        label: "🏆 Pokale",
        languages: { de: "done" },
        note: "Die Pokale im Regal (TrophyShelf.tsx, 11. November 2026): nur das Wort „Pokale“ (vorgelesen und über dem Schrank mit allen Pokalen) wartet auf seine Übersetzung; die Namen der Spiele darin sind schon übersetzt.",
      },
    ],
  },
];
