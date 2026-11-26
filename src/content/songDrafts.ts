// Drafts of songs for the timer, to be made on suno.com: their words, the copy-paste texts for each Suno field and how
// they fit the timer's lengths. Shown on the hidden page /management/lieder/, where the user reads them in peace and
// picks one before a session makes it with /musik-erzeugen (user request, 26 November 2026). Nothing here plays in the
// app yet: once a song is chosen and made, its words go into the game in every app language like any other text.

/** A language a draft is written in so far: English first, German to read and to sing. */
export type DraftLanguage = "en" | "de";

/** The languages of the drafts, in the order the page shows them. */
export const DRAFT_LANGUAGES: { id: DraftLanguage; label: string; sungIn: string }[] = [
  { id: "en", label: "English", sungIn: "sung in English" },
  { id: "de", label: "Deutsch", sungIn: "sung in German" },
];

/**
 * The words of one song in one language, built as the timer needs them: a start always sung first, then five blocks of
 * about a minute each – a chorus singing the minutes left, a verse, an instrumental break while hands are busy – then a
 * count from five to one and the end. Only the last verse and the start know where in the run they are, so a shorter
 * timer plays the start and then the last blocks (3 minutes: the chorus „three more minutes“ and on).
 */
export interface SongWords {
  /** Sung once at the very start of every run, whatever its length. */
  start: string[];
  /** The chorus of a block, with the minutes left put in. */
  chorus: (left: string) => string[];
  /** The minutes left at the start of each block, five down to one, as sung. */
  left: [string, string, string, string, string];
  /** One verse per block; only the fifth knows it is the last minute. */
  verses: [string[], string[], string[], string[], string[]];
  /** The count before the end, sung over the last bars. */
  countdown: string;
  /** Sung as the time is up, then the final chord. */
  end: string[];
}

/** One way to have Suno play a song: its tempo and the texts for „Style of Music“ and „Exclude Styles“. */
export interface SongStyle {
  /** „schnell“ or „ruhig“, as the page names it. */
  label: string;
  bpm: number;
  /** The one to try first with these words. */
  recommended?: boolean;
  /** „Style of Music“ without its language; the page adds „sung in …“. */
  style: string;
  exclude: string;
}

/** A song drafted for the timer. */
export interface SongDraft {
  id: string;
  emoji: string;
  /** Its name on the page. */
  title: string;
  /** The ideas it belongs to, e.g. "H-119". */
  ideas: string[];
  /** What it is and for which timer, for the user reading it. */
  about: string;
  /** Suno's „Title“ field per language. */
  names: Record<DraftLanguage, string>;
  words: Record<DraftLanguage, SongWords>;
  styles: SongStyle[];
}

/** The lines of a section of the guide on the page. */
export interface GuideSection {
  id: string;
  title: string;
  points: string[];
}

const FAST: Omit<SongStyle, "recommended"> = {
  label: "schnell",
  bpm: 128,
  style:
    "upbeat children's sing-along, 128 BPM, steady driving beat, C major, one warm friendly lead voice, ukulele, glockenspiel, marimba, hand claps, toy piano, bouncy bass, playful like a fun race, clear simple words, every chorus and verse block about one minute, short instrumental breaks, same tempo all the way, ends with a sung count from five to one and a big happy final chord, about 5 minutes",
  exclude: "rap, heavy drums, electric guitar, distortion, dubstep, choir, sad, scary, tempo changes, long intro, fade out",
};

const CALM: Omit<SongStyle, "recommended"> = {
  label: "ruhig",
  bpm: 96,
  style:
    "gentle children's song, 96 BPM, calm steady pulse, F major, one soft warm lead voice, fingerpicked acoustic guitar, marimba, soft glockenspiel, light shaker, cozy and reassuring, clear simple words, every chorus and verse block about one minute, short instrumental breaks, same tempo all the way, ends with a soft count from five to one and a warm final chord, about 5 minutes",
  exclude: "rap, loud drums, electric guitar, distortion, fast tempo, choir, sad, scary, tempo changes, long intro, fade out",
};

const EN_LEFT: SongWords["left"] = ["Five more minutes", "Four more minutes", "Three more minutes", "Two more minutes", "One more minute"];
const DE_LEFT: SongWords["left"] = ["Noch fünf Minuten", "Noch vier Minuten", "Noch drei Minuten", "Noch zwei Minuten", "Noch eine Minute"];

/**
 * The drafts. Tidying songs stay general (user feedback, 26 November 2026): nobody knows what lies in a child's room,
 * so they sing of „things“, „everything“ and its place, never of blocks, cars or teddies (`songDrafts.test.ts`).
 */
export const SONG_DRAFTS: SongDraft[] = [
  {
    id: "aufraeum-rennen",
    emoji: "🏁",
    title: "Aufräumlied „Das Aufräum-Rennen“ (schnell)",
    ideas: ["H-119", "H-135"],
    about:
      "Das fröhliche, flotte Aufräumlied: Das Kind räumt um die Wette mit dem Lied („Wir sind schneller!“), ohne dass jemand schimpft oder drängt. Es singt von Sachen und ihrem Platz, nie von bestimmten Spielsachen, und folgt dem Aufräumen: erst umschauen, dann tragen, in Ecken gucken, der Boden kommt hervor, fast geschafft, fünf bis eins, geschafft.",
    names: { en: "The Tidy-Up Race", de: "Das Aufräum-Rennen" },
    words: {
      en: {
        start: ["Tidy-up time! Tidy-up time!", "What's on the floor? Let's see!", "Everything has a place to go –", "ready, steady – go!"],
        chorus: (left) => ["Pick it up and put it back,", "quick little hands, clickety-clack!", `${left} on the clock –`, "we are faster, tick and tock!"],
        left: EN_LEFT,
        verses: [
          ["One thing here and one thing there,", "on the rug and by the chair,", "every thing we pick up fast", "finds its home again at last!"],
          [
            "Big things, small things, soft and round,",
            "pick them up from off the ground!",
            "Carry, carry, one, two, three,",
            "look how quick our hands can be!",
          ],
          ["Peek in corners, peek down low,", "under the bed and on tiptoe!", "Is there something left to find?", "Bring it home, don't leave it behind!"],
          ["Look, the floor is peeking through,", "there's more room for me and you!", "Keep on going, hop, hop, hop,", "carry on and never stop!"],
          [
            "Almost there, just a little more,",
            "the very last things from the floor!",
            "Hands are quick and the room is bright,",
            "everything's back where it fits just right!",
          ],
        ],
        countdown: "Five, four, three, two, one –",
        end: ["We did it! We did it! The tidy-up's done!", "Everything's home – and that was fun!"],
      },
      de: {
        start: ["Aufräumzeit! Aufräumzeit!", "Was liegt denn da herum?", "Jedes Ding hat seinen Platz –", "Achtung, fertig – los!"],
        chorus: (left) => ["Heb es auf und räum es ein,", "flinke Hände, groß und klein!", `${left} auf der Uhr –`, "wir sind schneller, schau doch nur!"],
        left: DE_LEFT,
        verses: [
          [
            "Eins liegt hier und eins liegt dort,",
            "husch, husch, husch, und schon ist's fort!",
            "Jedes Ding will heim, ganz schnell –",
            "bring es hin, zur rechten Stell'!",
          ],
          ["Große Sachen, kleine Sachen,", "aufheben und weiterlachen!", "Trag es hin, eins, zwei und drei,", "flinke Hände sind dabei!"],
          ["Guck in Ecken, guck ganz tief,", "unters Bett, ob da was schlief!", "Ist da noch was, groß und klein?", "Bring es heim und räum es ein!"],
          ["Guck, der Boden kommt heraus,", "Platz zum Spielen, Platz im Haus!", "Weiter, weiter, hopp, hopp, hopp,", "flitzen, tragen, ohne Stopp!"],
          ["Fast geschafft, nur noch ein Stück,", "die letzten Sachen – zack, zurück!", "Flinke Hände, Zimmer hell,", "alles da, und das ging schnell!"],
        ],
        countdown: "Fünf, vier, drei, zwei, eins –",
        end: ["Geschafft! Geschafft! Wir sind so weit,", "alles daheim – vorbei die Aufräumzeit!"],
      },
    },
    styles: [{ ...FAST, recommended: true }, CALM],
  },
  {
    id: "alles-hat-ein-zuhaus",
    emoji: "🏡",
    title: "Aufräumlied „Alles hat ein Zuhaus“ (ruhig)",
    ideas: ["H-119", "H-135"],
    about:
      "Das ruhige Aufräumlied für Kinder, die ein flottes Lied eher aufdreht, oder für den Abend: Stück für Stück findet jedes Ding heim, Groß und Klein räumen zusammen, einmal tief atmen, ein leises Fünf bis Eins. Gleicher Aufbau wie das Aufräum-Rennen, nur sanfte Worte.",
    names: { en: "Everything Has a Home", de: "Alles hat ein Zuhaus" },
    words: {
      en: {
        start: ["Tidy time, it's tidy time,", "look around, so much to see.", "Every thing goes home, one at a time –", "come and tidy up with me."],
        chorus: (left) => ["Everything has a home, a home,", "nothing has to stay alone.", `${left}, here we go,`, "step by step and row by row."],
        left: EN_LEFT,
        verses: [
          ["Little hands can lift and bring", "one more thing and one more thing.", "Big hands helping, side by side,", "putting every thing inside."],
          ["Let's take one and carry it near", "to its place – it's happy here.", "One more here and one more there,", "gently, gently, with such care."],
          ["Something hiding, way down low,", "under the bed, in a corner? Oh!", "Gently find it, bring it out,", "take it home – that's what it's about."],
          ["See the floor come peeking through,", "room for me and room for you.", "Breathe in deep and breathe out slow,", "on we go, and on we go."],
          ["Nearly finished, look and see", "how tidy all our things can be.", "One last thing and one last look,", "every toy in its own little nook."],
        ],
        countdown: "Five, four, three, two, one.",
        end: ["All done, all done, the room is neat,", "time to rest our hands and feet."],
      },
      de: {
        start: ["Aufräumzeit, nun ist es so weit,", "schau dich um, was wartet da?", "Komm, wir räumen auf, zu zweit,", "Stück für Stück, mal fern, mal nah."],
        chorus: (left) => ["Jedes Ding hat ein Zuhaus,", "keins bleibt liegen, keins bleibt draus.", `${left}, Stück für Stück,`, "alles findet heim zurück."],
        left: DE_LEFT,
        verses: [
          ["Kleine Hände, große Hände", "räumen auf bis an die Wände.", "Hier ein Ding und dort ein Ding,", "sanft getragen wie ein Schmetterling."],
          ["Nimm ein Ding und trag es hin", "an den Platz, da wohnt es drin.", "Eins nach dem andern, ganz in Ruh',", "und noch eins, und noch eins dazu."],
          ["Liegt da etwas, ganz versteckt,", "unterm Bett, in einer Eck'?", "Hol es sacht hervor ans Licht,", "bring es heim, vergiss es nicht."],
          ["Sieh, der Boden kommt hervor,", "Platz zum Sitzen, wie zuvor.", "Atme ein und atme aus,", "weiter geht's – nach Haus, nach Haus."],
          ["Fast geschafft, ein letztes Stück,", "schau dich um und schau zurück:", "Jedes Ding an seinem Ort,", "eins noch hin – und dann ist's fort."],
        ],
        countdown: "Fünf, vier, drei, zwei, eins.",
        end: ["Fertig, fertig, alles fein,", "jetzt darf alles ruhig sein."],
      },
    },
    styles: [{ ...CALM, recommended: true }, FAST],
  },
  {
    id: "noch-fuenf-minuten",
    emoji: "⏱️",
    title: "Countdown-Lied „Noch fünf Minuten“ (allgemein)",
    ideas: ["H-134"],
    about:
      "Das allgemeine Lied für jeden Timer und jedes Bild: Es singt nur, wie viel Zeit noch bleibt, und macht Mut, nie wofür – passt zum Aufräumen, Anziehen, „noch fünf Minuten spielen“ und Warten. Flott und flink („flink wie ein Fuchs“), aber ohne zu drängen. In beiden Tempi gleich gut denkbar.",
    names: { en: "Five More Minutes", de: "Noch fünf Minuten" },
    words: {
      en: {
        start: ["Tick, tock, the clock's begun,", "here we go, let's get it done!"],
        chorus: (left) => [
          `${left}, ${left.toLowerCase()},`,
          "tick, tock, tick, we're right in it!",
          "Hands are busy, feet are too,",
          "we can do it, me and you!",
        ],
        left: EN_LEFT,
        verses: [
          ["Step by step and bit by bit,", "look at us, we're doing it!", "Every step gets us along,", "sing with me our ticking song!"],
          ["Busy, busy, here and there,", "little bits of everywhere.", "Take a breath, then on we run,", "doing things can be such fun."],
          [
            "Quick like a rabbit, quick like a fox,",
            "tick goes the clock and tock goes the clock.",
            "Nothing that we cannot do,",
            "me and you, and me and you!",
          ],
          ["Look how much is done today,", "hip, hip, hip, hooray, hooray!", "Keep it up, we're coming through,", "just a little more to do."],
          ["Last one now, the very last,", "see how all the time has passed.", "Almost time – it's nearly here,", "count with me, loud and clear:"],
        ],
        countdown: "Five, four, three, two, one –",
        end: ["Time is up! Hooray, we're done!", "We did it all – and that was fun!"],
      },
      de: {
        start: ["Tick, tack, die Uhr fängt an,", "los geht's, jetzt sind wir dran!"],
        chorus: (left) => [
          `${left}, ${left.toLowerCase()},`,
          "tick, tack, tick – wir wollen uns sputen!",
          "Hände flink und Füße schnell,",
          "du und ich, wir sind zur Stell'!",
        ],
        left: DE_LEFT,
        verses: [
          ["Stück für Stück und Schritt für Schritt,", "schau mal her, wir machen mit!", "Jeder Schritt bringt uns voran,", "schau, was man schon sehen kann!"],
          ["Fleißig, fleißig, hier und da,", "überall ein bisschen, ja!", "Einmal atmen, weiter dann,", "weil man so viel schaffen kann."],
          [
            "Flink wie ein Fuchs, schnell wie ein Hase,",
            "weiter, weiter, ohne Pause!",
            "Nichts ist uns zu schwer, nein, nein,",
            "wir sind groß und wir sind klein.",
          ],
          [
            "Schau, wie viel schon fertig ist,",
            "wie flink und fleißig du doch bist!",
            "Hipp, hipp, hurra, wir sind schon weit,",
            "nur noch ein bisschen bis zur Zeit.",
          ],
          [
            "Letzte Minute, jetzt geht's los,",
            "was wir geschafft, ist riesengroß.",
            "Gleich ist es so weit, gleich ist es da,",
            "zählt mit mir, laut und klar:",
          ],
        ],
        countdown: "Fünf, vier, drei, zwei, eins –",
        end: ["Die Zeit ist um! Hurra, geschafft!", "Das haben wir zusammen gemacht!"],
      },
    },
    styles: [{ ...FAST, recommended: true }, CALM],
  },
];

/**
 * The words of a song as they go into Suno's „Lyrics“ field: sections in [brackets], which Suno reads as directions
 * and does not sing (Instrumental off, see /musik-erzeugen).
 */
export function lyricsOf(words: SongWords): string {
  const section = (tag: string, lines: string[]) => [`[${tag}]`, ...lines].join("\n");
  const blocks = words.verses.map((verse, i) =>
    [section(`Chorus – ${words.left[i]}`, words.chorus(words.left[i])), section(`Verse ${i + 1}`, verse), "[Instrumental Break – 8 bars]"].join("\n\n"),
  );
  return [
    "[Steady tempo, no tempo changes]",
    "[Intro – 2 bars]",
    section("Start", words.start),
    ...blocks,
    section("Countdown", [words.countdown]),
    section("Outro", words.end),
    "[Final chord]\n[End]",
  ].join("\n\n");
}

/** How to make the songs on suno.com and fit them to the timer's lengths, shown above the songs. */
export const SONG_GUIDE: GuideSection[] = [
  {
    id: "suno",
    title: "So geht's bei Suno",
    points: [
      "Suno macht mit den Modellen v6, v6-wild und v6-mini bis zu 8 Minuten in einem Durchgang (Suno-Hilfe „How long will my song be?“, gelesen am 26. November 2026); 5 Minuten gehen also auf einmal, länger mit „Extend“ (macht an einer gewählten Stelle weiter).",
      "Eine Länge auf die Sekunde lässt sich nicht bestellen (der Längen-Regler von v5.5 gilt als veraltet), und gesungene Lieder halten keine Takte ein. Darum folgt der Timer dem Lied: die Strophen werden gemessen (`bun run song:verses`), ein Lied von 5:07 ist ein Timer von 5:07.",
      "Nur mit Pro oder Premier: Herunterladen geht nur im Abo, und nur dann darf das Lied auch auf YouTube (Recherche „YouTube: Was dürfen wir zeigen?“). Ein Lied aus dem Gratis-Plan wird durch ein späteres Abo nicht nutzbar.",
      "Create → Custom, „Instrumental“ aus. Die Blöcke unten einfügen: Lyrics, Style of Music, Exclude Styles, Title. Jede Sprache ist ein eigenes Lied.",
      "Mehrere Fassungen erzeugen und anhören: Wird jede Minute deutlich gesungen? Hält das Tempo? Kommt am Ende Fünf bis Eins und ein Schlussakkord? Ist es ungefähr 5 Minuten lang? Zu kurz → „Extend“ ab dem letzten Refrain; zu lang → „Crop“.",
      "Die beste als WAV herunterladen und einer neuen Claude-Session mit /musik-erzeugen den Pfad geben: Sie misst das Lied und baut es in den Timer ein.",
    ],
  },
  {
    id: "laengen",
    title: "2, 3, 5 oder 10 Minuten",
    points: [
      "Jede Minute ist ein Block: Refrain mit der verbleibenden Zeit („Noch drei Minuten …“), eine Strophe, eine Pause zum Weiterräumen. So hört das Kind, wie weit es ist, lange bevor es eine Uhr lesen kann.",
      "Ein Lied von 5 Minuten reicht für 1 bis 5 Minuten: Der Timer spielt immer den Anfang („Aufräumzeit!“) und dann die letzten Blöcke – 3 Minuten beginnen mit „Noch drei Minuten“, 2 Minuten mit „Noch zwei Minuten“. Darum wissen nur der Anfang und die letzte Strophe, wo im Lauf sie stehen; die Strophen dazwischen passen an jede Stelle.",
      "10 Minuten wären ein eigenes Lied mit zehn Blöcken (etwa 8 Minuten erzeugen, dann „Extend“), das dann auch alle Längen von 1 bis 10 Minuten abdeckt. Lange Lieder wiederholen sich bei Suno leicht; erst wenn ein 5-Minuten-Lied gut ist, die Strophen für 10 bis 6 dazuschreiben.",
      "Kein Lied pro Länge: Das spart Downloads (Pro: 20 im Monat). Zwei Lieder in zwei Tempi in sieben Sprachen wären schon 28.",
    ],
  },
  {
    id: "tempo",
    title: "Schnell oder ruhig, und welche Sprachen",
    points: [
      "Jedes Lied hat zwei Stil-Texte: schnell (128 BPM, Ukulele, Klatschen, wie ein Wettlauf) und ruhig (96 BPM, Gitarre, Marimba, gemütlich). Die Worte bleiben dieselben; ⭐ markiert, womit man anfangen sollte.",
      "Das Kind soll flink sein (Wunsch des Nutzers, 26. November 2026): Die schnelle Fassung macht das über die Musik und den Wettlauf mit dem Lied – „Wir sind schneller!“, „flink wie ein Fuchs“ –, nie mit Schimpfen oder „schnell, schnell“.",
      "Die Aufräumlieder sind allgemein (Wunsch des Nutzers, 26. November 2026): Niemand weiß, was im Kinderzimmer liegt, also singen sie von Sachen, Dingen und ihrem Platz, nie von Bausteinen, Autos oder Kuscheltieren.",
      "Die Texte stehen erst auf Englisch (die erste Sprache für Neues) und Deutsch. Sobald ein Lied gewählt ist, schreibt die Session, die es macht, die anderen fünf Sprachen dazu – singbar nachgedichtet, nicht wörtlich übersetzt.",
    ],
  },
];
