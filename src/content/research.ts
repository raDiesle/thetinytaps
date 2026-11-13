// Research for grown-ups, shown on the hidden page /management/ next to the
// ideas: what was looked up, how, what came out and which ideas it led to.
// Newest first. Idea ids and game addresses are checked in content.test.ts.

/** One topic parents search for, and what the app could answer it with. */
export interface ResearchTopic {
  emoji: string;
  title: string;
  /** Searches as people type them (lower case, like Google suggests them). */
  searches: string[];
  /** Ideas this topic led to, e.g. "H-01". */
  ideas: string[];
}

/** A game that already answers searches, with a page title that would match them. */
export interface ResearchGameMatch {
  /** The game's address from the home menu, e.g. "/zaehne/". */
  href: string;
  searches: string[];
  /** Suggested title for Google. */
  title: string;
}

/** Something left out on purpose, so nobody suggests it again without a reason. */
export interface ResearchExclusion {
  title: string;
  why: string;
}

/** One address checked for a domain research: which endings were free, and how well it fits. */
export interface ResearchDomain {
  /** The name without ending, e.g. "tapsiland". */
  name: string;
  /** 1 is the best; same number, same fit. */
  rank: number;
  /** Endings that were free on the research date, e.g. ["de", "com"]. */
  free: string[];
  /** Endings already registered by someone. */
  taken: string[];
  /** Why it is ranked so, in one or two sentences. */
  why: string;
}

/** One piece of research with its results. */
export interface Research {
  id: string;
  /** When it was done, YYYY-MM-DD. */
  date: string;
  emoji: string;
  title: string;
  /** What the question was. */
  question: string;
  /** How the answer was found, and how far to trust it. */
  method: string;
  /** The most important results, one sentence each. */
  findings: string[];
  topics: ResearchTopic[];
  games: ResearchGameMatch[];
  excluded: ResearchExclusion[];
  /** Ideas that came out of it besides those of the topics. */
  ideas: string[];
  sources: { label: string; url: string }[];
  /** For a domain research: the addresses checked, best first. */
  domains?: ResearchDomain[];
}

export const RESEARCH: Research[] = [
  {
    id: "haare-waschen",
    date: "2026-11-13",
    emoji: "🛁",
    title: "Haare waschen ohne Drama: Was raten Fachstellen bei Kleinkindern?",
    question:
      "Für das Buch „Hair Washing“ („Tapsi and the Foam Crown“, eine Geschichte in Kapiteln wie „Kita-Start“, Idee H-14): Was raten Fachstellen, wenn ein Kleinkind Angst vor dem Haarewaschen hat oder sich wehrt, und in welcher Reihenfolge?",
    method:
      "Eine Runde am 13. November 2026, die Seiten selbst gelesen: die Seite „Hair washing“ der Kinder-Ergotherapie des NHS-Gesundheitsbezirks Cwm Taf Morgannwg, das Heft „Personal hygiene – five steps to function“ des Kinderkrankenhauses Alder Hey, AAP/HealthyChildren „Bathing Your Newborn“ (nur Babys; eine Seite der AAP zum Haarewaschen bei Kleinkindern fand sich nicht), zwei Seiten von Zero to Three zu Ängsten von Kleinkindern (allgemein, nichts übers Baden), „Parenting. Give it time“ der walisischen Regierung (Bath time), Apotheken Umschau und DAK zur Körperpflege bei Kindern, t-online mit der Bundeskonferenz für Erziehungsberatung, das Expertenforum von rund-ums-baby. Raising Children Network nur aus Zusammenfassungen (die Seite ließ sich nicht lesen); bei der BZgA (kindergesundheit-info.de) fand sich keine Seite dazu, bei Renz-Polster, Imlau, Graf & Seide und Juul nichts Lesbares zum Haarewaschen.",
    findings: [
      "Die Schritte, wie die Quellen sie geben, sind die Kapitel des Buchs: vorher erzählen, was kommt und in welcher Reihenfolge (Zero to Three, CTM); vorher an einer Puppe oder einem Kuscheltier üben und das Kind einem Erwachsenen die Haare waschen lassen (CTM, Alder Hey, Zero to Three, Apotheken Umschau); das Kind wählen und mitmachen lassen – Shampoo aussuchen, selbst einreiben, selbst spülen (Alder Hey, CTM); die Augen schützen; aufhören, wenn es zu viel wird; ein warmes Handtuch und Lob danach (Welsh Government, Zero to Three).",
      "Erst herausfinden, was das Kind daran nicht mag: Shampoo in den Augen, Wasser über dem Gesicht, die Haltung nach hinten oder ein Machtkampf (Alder Hey, CTM). In der Geschichte sagt Tapsi es selbst, und Mama hört zu.",
      "Die Augen trocken halten: ein Waschlappen, den das Kind selbst hält, ein Schild oder eine Taucherbrille (Alder Hey, CTM, DAK); eine Hand an der Stirn, damit der Schaum zur Seite läuft (AAP); mit Becher, Kanne oder ausgedrücktem Waschlappen spülen statt mit der Brause (Alder Hey, CTM); Kopf in den Nacken und nach oben auf ein Bild oder einen Aufkleber an der Decke schauen (Alder Hey). In der Geschichte: Tapsis Waschlappen, der rote Becher, die Sonne an der Decke.",
      "Jedes Mal dieselbe Reihenfolge, mit Lied oder Zählen, damit das Kind weiß, was kommt und wann es vorbei ist (CTM, Alder Hey); mildes Shampoo ohne Brennen, lauwarmes Wasser, mit dem Handgelenk geprüft (AAP, DAK, Welsh Government). In der Geschichte zählt Mama „eins, zwei, drei“, sobald Tapsi „Jetzt!“ sagt.",
      "Bei Kleinkindern reicht Haarewaschen einmal bis zweimal die Woche (Alder Hey, DAK), und nicht jedes Baden ist ein Haarewaschabend (Alder Hey); ist es sehr belastend, seltener (CTM). In der Geschichte: „Not every night – just tonight.“",
      "Nicht zwingen, nicht ausreden, nicht schimpfen oder auslachen, nicht über die Not hinweg weitermachen, keinen Machtkampf daraus machen (Zero to Three, Alder Hey, Ritzer-Sachs bei t-online). Ein Kind nie allein in der Wanne lassen, auch nicht kurz (Welsh Government, AAP) – in jedem Bild in der Wanne ist Mama dabei (geprüft).",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Festhalten und schnell durchziehen, oder die Brause von oben",
        why: "Alle gelesenen Quellen raten davon ab; die Geschichte bleibt wahr und sanft, Tapsi gibt das Zeichen und darf aufhören.",
      },
      {
        title: "Ein Badesitz",
        why: "Die AAP warnt davor, die walisische Regierung schlägt ihn vor – die Quellen widersprechen sich, die Geschichte zeigt keinen.",
      },
      {
        title: "Eine Taucherbrille oder ein Haarwaschschild",
        why: "Raten mehrere Quellen; „Komm Haare waschen, Buddy Bär“ erzählt schon von einer Taucherbrille. Tapsi hält stattdessen den Waschlappen, den jede Familie hat.",
      },
    ],
    ideas: ["H-14"],
    sources: [
      {
        label: "NHS Cwm Taf Morgannwg, Kinder-Ergotherapie: Hair washing",
        url: "https://ctmuhb.nhs.wales/services/occupational-therapy-for-children/hair-washing/",
      },
      {
        label: "Alder Hey Children's Hospital: Personal hygiene – five steps to function",
        url: "https://www.alderhey.nhs.uk/conditions/patient-information-leaflets/personal-hygiene-five-steps-to-function-booklet",
      },
      {
        label: "AAP HealthyChildren: Bathing Your Newborn",
        url: "https://www.healthychildren.org/English/ages-stages/baby/bathing-skin-care/Pages/Bathing-Your-Newborn.aspx",
      },
      {
        label: "Zero to Three: I'm Scared – Responding to Your Toddler's Fears",
        url: "https://www.zerotothree.org/resource/im-scared-responding-to-your-toddlers-fears/",
      },
      { label: "Zero to Three: Childhood Fears", url: "https://www.zerotothree.org/resource/childhood-fears/" },
      {
        label: "Welsh Government, Parenting. Give it time: Bath time",
        url: "https://www.gov.wales/parenting-give-it-time/guidance-and-advice/tricky-moments-and-behaviours/bath-time",
      },
      {
        label: "Apotheken Umschau: Körperpflege für Kinder leicht gemacht",
        url: "https://www.apotheken-umschau.de/gesund-bleiben/vorsorge/bei-kindern/koerperpflege-fuer-kinder-leicht-gemacht-790555.html",
      },
      { label: "DAK: Körperpflege bei Kindern", url: "https://www.dak.de/dak/gesundheit/familie-leben/kind/koerperpflege-bei-kindern_18124" },
      {
        label: "t-online: Körperliche Grenzen bei Kindern",
        url: "https://www.t-online.de/leben/id_82507470/koerperliche-grenzen-bei-kindern-was-ist-erlaubt-.html",
      },
    ],
  },
  {
    id: "gemini-bildpreise",
    date: "2026-11-11",
    emoji: "🍌",
    title: "Gemini-Bilder: Gibt es günstigere Modelle oder Wege, und was haben wir bisher ausgegeben?",
    question:
      "Stimmen die Preise, mit denen `bun run image` rechnet, noch? Gibt es neue Modelle oder Preisstufen, die günstiger sind und trotzdem gut genug für die Bilderbuch-Bilder, und andere Wege, beim Bildermachen weiter zu sparen?",
    method:
      "Am 11. November 2026 Googles Preisseite der Gemini API (ai.google.dev/gemini-api/docs/pricing, leitet jetzt auf aistudio.google.com/docs/pricing weiter) gelesen, etwa drei Viertel davon wörtlich, den Rest (Gemini 2.5 Flash Image) nur zusammengefasst; die Modellseiten von Nano Banana 2.1 und Nano Banana 2 Lite ganz und den Anfang der Anleitung zur Bilderzeugung. Mit unserem Schlüssel die Liste der Modelle abgefragt (kostenlos). Unsere bisherigen Anfragen aus den Batch-Notizen in .git/image-batches/ gezählt (nur Batches; was mit `--now` lief, steht dort nicht). Wie viel Nano Banana 2.1 „denkt“ und was das kostet, sagen die Quellen widersprüchlich – das ist nur durch einen Versuch zu klären. Testberichte zur Bildqualität von 2.1 stammen fast nur aus Googles eigenen Angaben. Ob die 300 $ Startguthaben von Google Cloud für die Gemini API gelten, nur aus Blogs und einem Forumsbeitrag, keine Seite von Google.",
    findings: [
      "Unser Modell gemini-3.1-flash-lite-image (Nano Banana 2 Lite) kostet weiter 0,0336 $ je 1K-Bild, im Batch 0,0168 $ – die 0,017 $ in REQUEST_PRICE stimmen. Es kann nur 1K, Eingaben kosten 0,125 $ je Million Token im Batch.",
      "Neu seit 6. Oktober 2026: gemini-nano-banana-2.1 (Nano Banana 2.1), ein Update von Nano Banana 2, das Google für alle neuen Projekte empfiehlt. Je 1K-Bild kostet es dasselbe wie Lite (0,0336 $, Batch 0,0168 $), dazu 2K für 0,0504 $ (Batch 0,0252 $) und 4K für 0,113 $ (Batch 0,0567 $). Laut Google besser in Bildqualität, Treue zum Prompt und gleichbleibenden Figuren über mehrere Bilder, bis zu 14 Vorlagen (4 Figuren, 10 Dinge). Unser Schlüssel kann es schon nutzen.",
      "Der Haken an 2.1: Eingaben kosten 0,75 $ je Million Token im Batch (sechsmal Lite), und es denkt immer, standardmäßig „medium“, abschaltbar nur bis „minimal“; Denk-Token kosten wie Text-Ausgabe 3,75 $ je Million im Batch. Wie viele es sind, steht nirgends verlässlich. Ein einzelnes 1K-Bild wird mit 2.1 darum etwas teurer als mit Lite, nicht billiger.",
      "Der eigentliche Hebel ist 2K: ein 2K-Bild hat viermal so viele Pixel wie ein 1K-Bild und kostet nur das Anderthalbfache. Ein 2x2-Bogen in 2K hat vier Felder etwa so groß wie heute ein ganzes 1K-Bild – vier Karten oder Geschichtsbilder für 0,0252 $, also etwa 0,0063 $ je Bild statt 0,0168 $ (plus Eingabe und Denken). Kleine Freisteller (512 px) passen zu 16 auf einen 2K-Bogen statt zu 4 auf einen 1K-Bogen.",
      "Die anderen Modelle sind nicht günstiger: Nano Banana 2 (gemini-3.1-flash-image) 0,067 $ je 1K-Bild, 512 px für 0,045 $, ohne Batch-Preis; Nano Banana Pro (gemini-3-pro-image) 0,134 $; das alte Gemini 2.5 Flash Image 0,0195 $ im Batch – es ist abgekündigt, aber erst am 15. März 2027 abgeschaltet (der Skill nannte es schon abgeschaltet). Imagen steht nicht mehr auf der Preisseite. Für keines der Bildmodelle gibt es eine kostenlose Stufe, Flex-Preise oder Rabatte auf zwischengespeicherte Eingaben.",
      "Bisher (Batches vom Oktober und November 2026): 1 890 Anfragen für 2 449 Bilder, alle mit Lite, also etwa 32 $ (601 Anfragen im Oktober, 1 289 im November). 1 447 Anfragen brachten ein Bild allein (920 davon 1200×900, 121 mit 1376 px), 386 einen 1x2-Bogen, 56 einen 2x2-Bogen; 1 808 Anfragen hatten mindestens eine Vorlage dabei.",
      "Hätten dieselben Bilder auf 2K-Bögen zu viert gelegen, wo sie es dürfen, wären es grob 13 bis 16 $ gewesen statt 32 $ – etwa die Hälfte. Wie viel davon wirklich geht, hängt daran, wie viele Bilder einen Bogen teilen dürfen (Geschichtsbilder mit Vorlagen und eigenem Raum stehen heute bewusst allein, ALONE_REASONS) und ob 2.1 vier Felder so sauber malt wie Lite ein Bild.",
      "Die 300 $ Startguthaben von Google Cloud: Blogs und ein Forumsbeitrag berichten, dass sie seit März 2026 nicht mehr für die Gemini API gelten. Nicht von Google bestätigt, darum nicht damit rechnen.",
      "Empfehlung vor dem Versuch: Lite bleibt vorerst das Standardmodell. Nano Banana 2.1 einmal ausprobieren (A-33), für etwa 0,03 $: ein 2K-2x2-Bogen mit vier wartenden Bildern, Denken auf „minimal“, die Token aus der Antwort lesen und die Bilder neben Lite legen. Einzelne 1K-Bilder lohnen mit 2.1 nicht.",
      "Versuch am 11. November 2026 mit den sieben Bildern von „Heimweh, die erste Nacht bei Oma“ (Gefühle), jedes nach dem ersten Bild der Geschichte als Vorlage: zwei 2K-Bögen mit 2.1 (vier Felder je Bogen, Denken „minimal“) und dieselben Bilder einzeln mit Lite. Die Token-Zahlen aus der Antwort (das Skript schreibt sie jetzt zu jedem Batch): ein 2.1-Bogen etwa 1 970 Token Eingabe, 1 680 Bild-Token, 610 bis 750 Text-Token, 0 Denk-Token – 0,029 $ für vier Bilder, 0,0073 $ je Bild. Lite: je Bild etwa 1 550 Token Eingabe, 1 120 Bild-Token, 355 Text-Token – 0,0173 $ je Bild. Der Bogen kostet also 58 % weniger. Der 2K-Bogen ist 2400×1792 Pixel, ein Feld knapp 1150×860, für 1200×900 um 4 % vergrößert.",
      "Die Bilder des Bogens sind sauber gezeichnet und halten den Raum, aber nicht, was in jedem Bild bleiben muss: Der Kuschelhase, den jedes Bild der Geschichte zeigen soll, fehlte in sechs von acht Feldern, auch als die zweite Fassung des Prompts „EVERY panel, each on its own, contains all of this“ sagte. Im ersten Bogen zoomte die Kamera leicht hinein, und beim „Nachtlicht runterwerfen“ leuchtete das Licht weiter, wo es aus sein sollte; die Aktionen fielen zahmer aus (Oma wegschubsen). Lite hielt in allen sieben Bildern den Hasen, die Kamera und die Aktionen. Die Lite-Bilder sind in die Geschichte gekommen.",
      "Ergebnis: Bilder einer Geschichte, die nach einer Vorlage den Raum und dessen Dinge halten müssen, bleiben einzeln mit Lite (der Grund „story picture“ in ALONE_REASONS bestätigt). Ob 2K-Bögen von 2.1 bei Bildern ohne Vorlage taugen, die ohnehin einen Bogen teilen (Karten, kleine Freisteller), ist noch offen (A-33).",
      "Entscheidung am 12. November 2026 (A-33, Auftrag: nie ein Bild allein, immer am günstigsten, außer es soll schneller gehen): Die Warteschlange wählt für jeden Bogen, was seine Bilder am günstigsten macht und groß genug ist. Kleine Bilder und Freisteller kommen zu viert auf einen 1K-Bogen von Lite (0,017 $, etwa 0,004 $ je Bild – billiger als ein 2K-Bogen von 2.1 mit 0,0073 $ je Bild), große Bilder und ganze Bilder ohne feste Größe zu viert auf einen 2K-Bogen von 2.1 mit Denken „minimal“ (ein Feld hat so viele Pixel wie ein ganzes 1K-Bild). Allein mit Lite bleiben nur Bilder mit einem bewiesenen Grund (das zweite Bild einer Bewegung, die späteren Bilder einer Geschichte), auch sie zusammen in einem Batch. Ein zweiter Versuch mit Geschichtenbildern auf 2.1-Bögen (jedes Feld mit seiner eigenen Liste, was bleiben muss; Denken „medium“ gegen „minimal“) war vorbereitet, aber das Guthaben bei Google war aufgebraucht (Fehler 402). Bei den 50 Geschichtenbildern, die gerade warten, ginge es um 0,85 $ gegen etwa 0,37 $ – zu wenig, um Bilder zu riskieren, die nachgezeichnet werden müssten.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Ein anderer Anbieter (OpenAI, Flux und andere)",
        why: "Nicht geprüft: 2 449 Bilder stehen schon im Stil von Gemini, und Geschichten halten ihre Figuren über Vorlagen. Ein anderer Anbieter müsste diesen Stil und die Figuren treffen, bevor ein Preis zählt.",
      },
      {
        title: "Nano Banana 2 oder Pro als Standard",
        why: "Kosten das Vier- bzw. Achtfache von Lite im Batch und bringen für die einfachen Bilderbuch-Bilder nichts, was 2.1 nicht zum Preis von Lite verspricht.",
      },
    ],
    ideas: ["A-33"],
    sources: [
      { label: "Google: Gemini API – Preise", url: "https://ai.google.dev/gemini-api/docs/pricing" },
      { label: "Google: Gemini Nano Banana 2.1", url: "https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1" },
      { label: "Google: Bilderzeugung mit Gemini", url: "https://ai.google.dev/gemini-api/docs/image-generation" },
      { label: "Android Authority: Nano Banana 2.1", url: "https://www.androidauthority.com/google-launches-nano-banana-2-1-3719823/" },
      {
        label: "Google-Forum: Startguthaben nicht für die Gemini API verwendet",
        url: "https://discuss.ai.google.dev/t/free-trial-credit-300-not-applied-to-gemini-api-usage-charged-from-prepay-balance-instead/180745",
      },
    ],
  },
  {
    id: "kita-eingewoehnung",
    date: "2026-11-11",
    emoji: "🎒",
    title: "Kita-Eingewöhnung und Abschied am Morgen: Welche Schritte, und was hilft?",
    question:
      "Für das Buch „Kita-Start“ („Tapsi geht in die Kita“, eine Geschichte in Kapiteln wie „Abstillen“, Idee H-10): In welchen Schritten raten Fachleute, ein Kleinkind in der Kita einzugewöhnen, und wie sieht ein guter Abschied am Morgen aus?",
    method:
      "Eine Runde am 11. November 2026, die Quellen selbst gelesen: die Lexikon-Artikel von socialnet zum Berliner Modell (nach Laewen, Andres und Hédervári, „Ohne Eltern geht es nicht“ – das Buch selbst nicht) und zum Münchener Modell, die Präsentationsnotizen des Papilio-U3-Moduls 6 (Berliner, Münchener Modell, Ahnert), Renz-Polsters „Kita-Eingewöhnung: Abbrechen oder Durchhalten?“, vier Seiten von Zero to Three (Trennungsangst, Monat 36, erster Babysitter, zurück in die Betreuung), Nora Imlaus Kolumne in der Apotheken Umschau, der BZgA-Elternbrief für 34–36 Monate und ihre Broschüre „Das Baby“ (beide ohne eigene Schritte zum Abschied) und kita.de als Portal. Zu Graf & Seide, Juul und Siegel & Bryson fand sich nichts Lesbares zum Abschied in der Kita.",
    findings: [
      "Die Schritte des Berliner Modells sind die Kapitel des Buchs: vorher erzählen; die Grundphase, in der ein Elternteil ein bis zwei Stunden im Raum bleibt, als sicherer Hafen, und mit dem Kind wieder geht; am vierten Tag die erste kurze Trennung (nicht nach einem Wochenende); die Stabilisierung, in der die Erzieherin Füttern, Wickeln und Trösten übernimmt, erst neben dem Elternteil, und die Trennungen länger werden; dann ist das Elternteil nur noch erreichbar (socialnet, Papilio).",
      "Die erste Trennung: das Elternteil verabschiedet sich, geht aus dem Raum, bleibt aber im Haus; weint das Kind untröstlich, nur zwei bis drei Minuten (Papilio nach Braukhane & Knobeloch). Im Münchener Modell erklärt das Elternteil vorher, warum es geht.",
      "Eingewöhnt ist ein Kind, wenn es sich von der Erzieherin trösten lässt – nicht, wenn es nicht mehr weint (Berliner Modell). Abschiedstränen sind normal, „Trennungsschmerz ist ein Teil von Bindung“ (Renz-Polster). In der Geschichte weint Tapsi, und Mia tröstet.",
      "Ein kurzes, immer gleiches Abschiedsritual hilft: Kuss, Kuscheln, Übergabe, Winken (Zero to Three); ein Kuscheltier oder Foto erinnert daran, dass Mama wiederkommt. In der Geschichte kommt Tapsis Kuschelhase mit.",
      "Nie heimlich wegschleichen, kein langer Abschied an der Tür, nicht wieder hineinlaufen (Zero to Three, Imlau, kita.de); sagen, wann man wiederkommt, in den Worten des Tages statt der Uhr (kita.de: „nach dem Spielen“). In der Geschichte: „nach dem Mittagsschlaf“.",
      "Die Eingewöhnung braucht zwei bis vier Wochen und mehr, anfangs nur halbtags (Papilio), Schritt für Schritt, manchmal Monate (Imlau); der Stress sinkt oft erst nach Monaten ganz (Ahnert). Die Geschichte nennt darum keine Tage, nur „ein paar Tage später“ und „jeden Tag ein bisschen länger“.",
      "Ein Winkefenster und das Wiedersehen beim Abholen standen in keiner gelesenen Quelle; beides kommt aus der Idee H-10 und aus dem Kita-Alltag, nicht aus der Literatur.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Das Kind vom Arm nehmen und schnell gehen, oder heimlich, während es spielt",
        why: "Alle gelesenen Quellen raten davon ab (Zero to Three, Imlau, Renz-Polster); die Geschichte bleibt wahr und sanft.",
      },
      {
        title: "Ein fester Stufenplan mit Tagen",
        why: "Renz-Polster warnt vor Zeitdruck und starren Plänen, und Kitas machen es verschieden; die Geschichte nennt keine Zahlen.",
      },
    ],
    ideas: ["H-10"],
    sources: [
      { label: "socialnet Lexikon: Berliner Eingewöhnungsmodell", url: "https://www.socialnet.de/lexikon/Berliner-Eingewoehnungsmodell" },
      { label: "socialnet Lexikon: Münchener Eingewöhnungsmodell", url: "https://www.socialnet.de/lexikon/Muenchener-Eingewoehnungsmodell" },
      {
        label: "Papilio-U3, Modul 6: Präsentationsnotizen zur Eingewöhnung",
        url: "https://akademie.papilio.de/wp-content/uploads/2026/02/U3_06_Modul_Praesentationsnotizen.pdf",
      },
      {
        label: "Herbert Renz-Polster: Kita-Eingewöhnung – Abbrechen oder Durchhalten?",
        url: "https://www.kinder-verstehen.de/wp-content/uploads/kita-eingewoehnung-abbrechen-oder-durchhalten.pdf",
      },
      { label: "Zero to Three: Separation Anxiety", url: "https://www.zerotothree.org/resource/separation-anxiety/" },
      { label: "Zero to Three: From Baby to Big Kid, Month 36", url: "https://zerotothree.org/resources/1277-from-baby-to-big-kid-month-36" },
      {
        label: "Zero to Three: What Comes Next – Back to Child Care",
        url: "https://www.zerotothree.org/resource/what-comes-next-back-to-child-care-following-shelter-in-place/",
      },
      {
        label: "Apotheken Umschau, liebe NORA!: Wie lasse ich mein Kind gut los? (Nora Imlau)",
        url: "https://www.apotheken-umschau.de/print/el/el25-09/liebe-nora-wie-lasse-ich-mein-kind-gut-los-1393577.html",
      },
      { label: "BZgA/BIÖG: Elternbrief 34.–36. Lebensmonat", url: "https://www.kindergesundheit-info.de/elternbriefe-online/u7a-34-36-lebensmonat/" },
      { label: "kita.de: Berliner und Münchner Eingewöhnungsmodell", url: "https://www.kita.de/wissen/kita-eingewoehnung-berliner-und-muenchner-modell/" },
    ],
  },
  {
    id: "schnullerfee-kapitel",
    date: "2026-11-10",
    emoji: "🧚",
    title: "Schnuller abgewöhnen in Kapiteln: Welche Schritte empfehlen Fachstellen?",
    question:
      "Für das Buch „Schnullerfee“ („Tapsi und die Schnullerfee“, eine Geschichte in Kapiteln wie „Abstillen“): In welchen Schritten raten Fachstellen, einem Kleinkind den Schnuller sanft abzugewöhnen, und was hilft ihm in den ersten Nächten?",
    method:
      "Eine kurze Runde am 10. November 2026, nur aus Zusammenfassungen von Suchergebnissen – kein Buch, keine Leseprobe und kein Faltblatt selbst gelesen. Gesucht: die Seite der BZgA (kindergesundheit-info.de) – sie kam in den Ergebnissen nicht vor, nur ein Hinweis auf ihren Elternratgeber „Das Baby“ –, Faltblätter der Gesundheitsämter Frankfurt, Lübeck und des Kreises Soest zur Schnullerentwöhnung, Apotheken Umschau, aponet (ein Kinderarzt), Öko-Test, kita.de, das Expertenforum Erziehung von rund-ums-baby. Bevor eine Entscheidung auf dem Alter oder einem Zahnbefund ruht, sind das BZgA-Faltblatt und die Faltblätter der Gesundheitsämter selbst nachzulesen.",
    findings: [
      "Die Schritte, wie die Ratgeber sie geben, sind die Kapitel des Buchs: vorher erzählen, was kommt und warum; den Schnuller erst auf das Einschlafen begrenzen (am Tag bleibt er im Bett, trösten, spielen und erzählen gehen ohne ihn); den Tag mit dem Kind aussuchen und darauf hinfiebern; das Kind sammelt die Schnuller selbst und gibt sie ab, mit einem kleinen Abschied; die ersten Nächte begleiten; der Tausch gegen ein kleines Geschenk; dabei bleiben, wenn das Kind den Schnuller vermisst.",
      "Rituale wie die Schnullerfee oder der Schnullerbaum gelten als sanfter Weg; wichtig sei, dem Kind vorher zu sagen, was kommt, und es dann durchzuhalten – kein Schnuller kommt zurück. In der Geschichte bleibt er bei den Babys.",
      "Ein Kuscheltier kann beim Einschlafen die Rolle des Schnullers übernehmen (Öko-Test); darum ist das Geschenk der Fee ein Kuschelhase, der danach beim Einschlafen hilft.",
      "Spielen, Spazierengehen, Turnen und Vorlesen gehen ohne Schnuller (Gesundheitsamt Frankfurt); mit Schnuller im Mund spricht ein Kind schlechter – in der Geschichte versteht Mama nur „Mmm-mmm“, und am Ende jedes Wort.",
      "Zum Alter widersprechen sich die Quellen (um zwei, zwischen zwei und vier, spätestens um drei Jahre); dauernd genutzt, kann ein Schnuller ab etwa zwei Jahren Zahnfehlstellungen begünstigen. Die Geschichte nennt kein Alter und sagt nur, dass der Schnuller auf die Zähne drückt.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Den Schnuller heimlich wegnehmen, abschneiden oder schlechtmachen",
        why: "Die Ratgeber für einen sanften Abschied raten, das Kind einzubeziehen und vorzubereiten; ein Trick widerspricht der Regel, dass die Geschichte wahr und sanft bleibt.",
      },
    ],
    ideas: ["H-11"],
    sources: [
      {
        label: "Apotheken Umschau: So gewöhnen sich Kinder den Schnuller ab",
        url: "https://www.apotheken-umschau.de/familie/entwicklung/meilensteine/so-gewoehnen-sich-kinder-den-schnuller-ab-790433.html",
      },
      {
        label: "aponet: Schnuller abgewöhnen – das rät ein Kinderarzt",
        url: "https://www.aponet.de/artikel/schnuller-abgewoehnen-das-raet-ein-kinderarzt-32612",
      },
      {
        label: "Gesundheitsamt Frankfurt: Faltblatt Schnuller",
        url: "https://frankfurt.de/-/media/frankfurtde/frankfurt-themen/gesundheit/zahngesundheit/pdf/schnuller-flyer-2021.pdf",
      },
      {
        label: "Gesundheitsamt Lübeck: Elterninfo Schnullerentwöhnung",
        url: "https://luebeck.de/files/rathaus/verwaltung/Gesundheitsamt/Elterninfo Schnullerentwöhnung.pdf",
      },
      {
        label: "Kreis Soest: Faltblatt Schnuller",
        url: "https://kreis-soest.de/fileadmin/user_upload/01_kreis-soest.de/Soziales_und_Gesundheit/Gesundheit/PDF/7_Flyer_Schnuller.pdf",
      },
      {
        label: "Öko-Test: Schnuller abgewöhnen – Tschüss, geliebter Nuckel",
        url: "https://www.oekotest.de/kinder-familie/Schnuller-abgewoehnen-Tschuess-geliebter-Nuckel_11985_1.html",
      },
      { label: "kita.de: Schnuller abgewöhnen", url: "https://www.kita.de/wissen/schnuller-abgewoehnen/" },
      { label: "kita.de: Schnullerfee", url: "https://www.kita.de/wissen/schnullerfee/" },
      {
        label: "rund-ums-baby, Expertenforum Erziehung: Schnuller abgewöhnen",
        url: "https://www.rund-ums-baby.de/experten-forum/erziehung/schnuller-abgewoehnen__946643",
      },
    ],
  },
  {
    id: "abstillen-kapitel",
    date: "2026-11-09",
    emoji: "🤱",
    title: "Abstillen in Kapiteln: In welcher Reihenfolge, und was hilft dem Kind?",
    question:
      "Für eine zweite, tiefere Abstillgeschichte („Tapsis Milchkette“): Welche Stillmahlzeit fällt nach Ratgebern zuerst weg, welche zuletzt, und was empfehlen sie, damit ein Kind von etwa zwei Jahren versteht, was passiert, traurig sein darf und etwas anderes bekommt?",
    method:
      "Eine kurze Runde am 9. November 2026, nur aus Zusammenfassungen von Suchergebnissen – kein Buch und keine Leseprobe selbst gelesen. Gesucht: Ratgeber zum sanften Abstillen von Kleinkindern (Apotheken Umschau mit einer IBCLC-Stillberaterin, AOK, das Expertenforum Stillberatung von rund-ums-baby, La Leche League UK), Bilderbücher dazu, und Renz-Polster und Imlau, „Schlaf gut, Baby!“ (nur die Presseinformation gefunden, nichts zu ihrem Inhalt übers nächtliche Abstillen). Die Seite der La Leche League International zum Abstillen war nicht abrufbar (Weiterleitung). Was LLL in „How Weaning Happens“ (Diane Bengson) über Techniken schreibt, ist nur aus dem Gedächtnis bekannt und vor einer Entscheidung, die darauf ruht, nachzulesen. Eine zweite Runde am selben Tag, ebenfalls nur aus Zusammenfassungen, suchte die Schritte des sanften Abstillens (familienzauber.at, stillkinder.de, rockmysleep.com zum Einschlafstillen, gewuenschtestes-wunschkind.de zum nächtlichen Stillen), nach denen die Kapitel nun geordnet sind.",
    findings: [
      "Die Schritte des sanften Abstillens, wie die Ratgeber sie geben: vorbereiten und dem Kind erzählen, was kommt; nicht mehr anbieten, aber auch nicht verweigern; hinauszögern, verkürzen und auf einen Ort zu Hause begrenzen; eine Stillzeit nach der anderen ersetzen; das Einschlafen vom Stillen lösen; nachts abstillen; die letzte Stillzeit bewusst verabschieden; danach das Vermissen begleiten. Jeder Schritt ist ein Kapitel der Milchkette.",
      "Reihenfolge: zuerst die Stillmahlzeit, die das Kind am wenigsten vermisst und die sich am leichtesten ersetzen lässt – meist eine am Tag; die zum Einschlafen und in der Nacht fallen schwerer, und die am Morgen (im Bett, nach der Nacht) bleibt oft am längsten. Fürs Einschlafen raten die Ratgeber, das Stillen erst an den Anfang des Abendrituals zu legen und dann Buch und Lied übernehmen zu lassen, bevor nachts abgestillt wird. Die Geschichte nimmt darum Tag, Abend, Nacht und zuletzt den Morgen.",
      "Langsam: eine Mahlzeit nach der anderen, die übrigen ein paar Tage unverändert lassen, statt mehrere auf einmal wegzunehmen.",
      "Das Kind nicht allein lassen mit seinem Unmut: zuerst trösten, dann ablenken. Kleinkinder wissen genau, was sie wollen, und lassen sich schwer ablenken; die Brust einfach durch eine Flasche zu ersetzen klappt meist nicht.",
      "Oft hilft eine andere Person: Wenn das Kind am Tag oder nachts trinken möchte, übernimmt der andere Elternteil das Trösten oder Ablenken. In der Geschichte trägt Papa Tapsi nachts.",
      "Das Einschlafritual vom Stillen lösen: andere Rituale (Buch, Lied, Kuscheln) treten an seine Stelle. Kein Schlaftraining mit langem Alleinweinen (La Leche League; Renz-Polster warnt mit Hüther vor der Ferber-Methode).",
      "Fürs nächtliche Abstillen gibt es ein Bilderbuch mit der Bedingung „Milch, wenn die Sonne scheint“ (Havener, „Nursies When the Sun Shines“) und einen Stufenplan von Jay Gordon über einige Nächte; dessen Einzelheiten widersprechen sich in den Quellen. Die Geschichte nimmt nur das Bild: „Nachts schläft die Milch.“",
      "Ein deutsches Bilderbuch nennt die Brust beim Namen („Ula und Frau Brust“, Roberta Russi) – Kinderbücher zum Abstillen zeigen und sagen, worum es geht. Darum sagt die Geschichte „Brust“ und zeigt Tapsi beim Trinken an Mamas Brust.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Alles an einem Tag wegnehmen oder das Kind nachts schreien lassen",
        why: "Kein Ratgeber für sanftes Abstillen empfiehlt es; es widerspricht der Regel, dass immer ein Erwachsener nah ist.",
      },
    ],
    ideas: ["H-44"],
    sources: [
      {
        label: "Apotheken Umschau: Abstillen – wie geht das?",
        url: "https://www.apotheken-umschau.de/familie/kinderernaehrung/stillen/abstillen-wie-geht-das-793307.html",
      },
      { label: "AOK: Abstillen ohne Stress", url: "https://www.aok.de/pk/magazin/familie/baby-kleinkind/abstillen-ohne-stress-wie-die-entwoehnung-gelingt/" },
      {
        label: "rund-ums-baby, Expertenforum Stillberatung: Kleinkind abstillen",
        url: "https://www.rund-ums-baby.de/experten-forum/stillberatung/kleinkind-abstillen__788959",
      },
      { label: "La Leche League GB: Beiträge zum älteren Baby", url: "https://laleche.org.uk/tag/older-baby/page/2/" },
      { label: "babyartikel.de: Kleinkind (nachts) abstillen", url: "https://www.babyartikel.de/magazin/?p=53907" },
      { label: "familienzauber.at: Abstillen", url: "https://www.familienzauber.at/familienguide/wochenbett/stillen-flaeschchen/abstillen/" },
      {
        label: "stillkinder.de: 8 Tipps für liebevolles Abstillen nach dem 1. Lebensjahr",
        url: "https://stillkinder.de/8-tipps-fuer-liebevolles-abstillen-nach-dem-1-lebensjahr/",
      },
      {
        label: "rockmysleep.com: Einschlafstillen abgewöhnen",
        url: "https://rockmysleep.com/blogs/magazin/einschlafstillen-abgewoehnen-sanfte-wege-ohne-traenen-und-schlechtes-gewissen",
      },
      {
        label: "gewuenschtestes-wunschkind.de: Nächtliches Dauerstillen",
        url: "https://www.gewuenschtestes-wunschkind.de/2014/10/naechtliches-dauerstillen-tipps-zur-verringerung-der-stillfrequenz-und-zum-abstillen-in-der-nacht.html",
      },
      { label: "kinder-verstehen.de: Presseinformation „Schlaf gut, Baby!“", url: "https://www.kinder-verstehen.de/pdf/schlaf-gut-baby-presseinformation" },
      {
        label: "Roberta Russi: Ula und Frau Brust",
        url: "https://www.exlibris.ch/de/buecher-buch/deutschsprachige-buecher/roberta-russi/ula-und-frau-brust/id/9783759777027/",
      },
    ],
  },
  {
    id: "besucher-verhalten",
    date: "2026-11-07",
    emoji: "📊",
    title: "Womit sehen, was Besucher in der App tun – ohne Cookie-Banner?",
    question:
      "Cloudflare Web Analytics zählt Besuche und Seiten, aber keine Ereignisse (Level fertig, „Nochmal“ oder „Weiter“, Sprache gewechselt, Musik aus). Welches Werkzeug zeigt das ohne Cookies und ohne Einwilligungs-Banner, und lässt sich Umami Cloud kostenlos nutzen?",
    method:
      "Selbst gelesen am 7. November 2026: die Preisseite von Umami (umami.is/pricing), sein Auftragsverarbeitungsvertrag (umami.is/dpa), seine Datenschutzerklärung und die Erklärung seiner Kennzahlen. Nicht gelesen: Umamis Anleitung zum Einbau des Skripts (ob es etwas im Browser speichert) und die Preisseiten von Plausible, Pirsch und GoatCounter – deren Angaben unten stammen aus dem Gedächtnis und sind vor einer Entscheidung nachzulesen. Was Google Analytics' Consent Mode und das TDDDG verlangen, ist eine Einschätzung aus bekannten Quellen, keine Rechtsberatung.",
    findings: [
      "Was es schon gibt: Cloudflare Web Analytics folgt den Seitenwechseln in der App, und jedes Spiel hat eine eigene Adresse – welche Spiele und Menüs wie oft geöffnet werden, ist also schon zu sehen. Es fehlen eigene Ereignisse; Cloudflare stichprobt und filtert wenig.",
      "Google Analytics setzt Cookies und braucht darum ein Banner. Sein Consent Mode ohne Einwilligung setzt keine Cookies, schickt aber weiter Daten an Google; die Berichte zeigen daraus kaum etwas, weil Google nur hochrechnet, wenn genug Besucher zugestimmt haben, und die deutschen Aufsichtsbehörden sehen auch diese Daten als einwilligungspflichtig. Für eine App ohne Banner taugt er nicht.",
      "Umami Cloud kostenlos („Hobby“, 0 $): bis 100 000 Ereignisse im Monat, eine Website, 6 Monate Aufbewahrung, keine Teammitglieder. Eigene Ereignisse und ihre Eigenschaften stehen in der Tabelle ohne Strich, sind also wohl dabei. Nicht dabei: API, Session-Aufzeichnungen, Heatmaps, zusätzliche Ereignisse.",
      "Was über 100 000 Ereignissen im Hobby-Plan passiert, sagt die Seite nicht klar: Die Fragen-Antworten versprechen, dass nichts verloren geht, und rechnen darüber hinaus pro Ereignis ab – der Hobby-Plan hat aber keine zusätzlichen Ereignisse. Seitenaufrufe zählen mit; schickt man sie Umami nicht, weil Cloudflare sie schon zählt, bleiben die 100 000 für Ereignisse.",
      "Nächste Stufe: Pro für 20 $ im Monat mit 1 Million Ereignissen, 20 Websites, 2 Jahren Aufbewahrung.",
      "Umami setzt keine Cookies: Ein Besucher wird über einen Hash aus Website, IP-Adresse, Browser und einem monatlich wechselnden Salz erkannt; die IP wird nicht als Feld gespeichert. Die Server stehen laut Umami in den USA und der EU – ob man die EU wählen kann, steht nirgends. Die Firma sitzt in San Francisco; der Auftragsverarbeitungsvertrag gilt mit dem Konto automatisch, für jeden Plan, mit EU-Standardvertragsklauseln.",
      "Andere ohne Cookies (nicht nachgelesen): Plausible (EU, bezahlt), Pirsch (Deutschland, bezahlt), GoatCounter (kostenlos, sehr schlicht), Umami selbst betrieben (kostenlos, braucht aber einen Server, den die App sonst nicht hat).",
      "Entschieden und eingebaut (7. November 2026): Umami Cloud im kostenlosen Plan. Umami zählt die Seitenaufrufe selbst (Einstieg, Ausstieg, Absprünge, Dauer eines Besuchs); die App meldet dazu die Zeit auf jeder Seite (ohne Zeit im Hintergrund, ab 3 Sekunden), das Ende eines Levels mit „Nochmal“ oder „Weiter“, abgelaufene und verlängerte Spielzeit, Einstellungen für alle Spiele und Installationen (src/lib/analytics.ts). Cloudflare Web Analytics bleibt daneben.",
      "Wer eines davon einbaut, ändert im selben Commit die Datenschutzerklärung und ihr PRIVACY_UPDATED, die Regel in CLAUDE.md und tracking.test.ts (beide erlauben bisher nur Cloudflare), und schickt nur grobe Dinge (Spiel, Level, Sprache) über eine kleine gemeinsame Funktion aus GameShell und GameEnd.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Session-Aufzeichnungen und Heatmaps (Aufzeichnungsdienste, auch die von PostHog oder Umami)",
        why: "Brauchen in der EU eine Einwilligung, und Kinder beim Spielen aufzuzeichnen passt nicht zu einer App, die Eltern vertrauen sollen.",
      },
      { title: "Google Analytics, auch im Consent Mode", why: "Cookies und Banner, oder ohne Einwilligung kaum Zahlen und trotzdem heikel (siehe oben)." },
    ],
    ideas: [],
    sources: [
      { label: "Umami – Preise", url: "https://umami.is/pricing" },
      { label: "Umami – Auftragsverarbeitungsvertrag", url: "https://umami.is/dpa" },
      { label: "Umami – Datenschutz", url: "https://umami.is/privacy" },
      { label: "Umami – Kennzahlen", url: "https://docs.umami.is/docs/metric-definitions" },
    ],
  },
  {
    id: "gefuehle-gruppen",
    date: "2026-11-04",
    emoji: "🗂️",
    title: "Gefühle: Welche Gruppen fürs Menü, und welche Szenen fehlen?",
    question:
      "Wie ordnen bekannte Erziehungsliteratur, Kita-Programme und Fachleute die Gefühle kleiner Kinder in Gruppen, und taugen diese Gruppen für die Karten von „Alltagssituationen“? Welche typischen Alltagsszenen fehlen noch, damit jede Gruppe etwa gleich viele Schritte hat?",
    method:
      "Selbst gelesen: das Elternheft von Papilio-U3 („Gefühle: Bitte übertreiben!“, Kita-Programm für unter Dreijährige), die Seite von Zero to Three zu 24 bis 36 Monaten und das Inhaltsverzeichnis von Baer und Frick-Baer, „Das große Buch der Gefühle“ (Beltz, Leseprobe). Nach Verlagstexten, Leseproben, Interviews und Zusammenfassungen (nicht die Bücher selbst): Gottman, „Raising an Emotionally Intelligent Child“; Siegel und Bryson, „The Whole-Brain Child“; Graf und Seide, „Das gewünschteste Wunschkind aller Zeiten“; Imlau, „So viel Freude, so viel Wut“; Petermann und Wiedebusch, „Emotionale Kompetenz bei Kindern“ (Hogrefe); Lewis zu den selbstbezogenen Gefühlen. Dazu Kita- und Schulmaterial zu Papilios Kistenkobolden, Zones of Regulation, RULER und dem Farbenmonster, und die Google-Autovervollständigung für 66 Suchanfänge (4. November 2026, deutsch). Nicht lesbar waren das Elternblatt des Staates New York (403) und eine Papilio-Seite zu den Kistenkobolden (nicht gefunden). Die bestehenden 42 Szenen gezählt: jede hat drei Schritte, die Gruppen hatten 2 bis 7 Szenen (6 bis 21 Runden).",
    findings: [
      "Papilio-U3 beschreibt fünf angeborene Vorläufer der Gefühle – Unbehagen, Interesse, Wohlbehagen, Erschrecken/Furcht und Ekel –, aus denen sich Ärger, Freude, Traurigkeit und Angst entwickeln. Mit 18 bis 24 Monaten werden „komplexe Gefühle“ erkennbar, Kinder benennen Gefühle mit Wörtern, verstehen, dass andere anders fühlen, und zeigen erste Empathie; schon mit eineinhalb sprechen sie über Gefühle mit.",
      "Dieselben vier Gefühle stehen am Anfang fast aller Programme: Papilios Kistenkobolde (Freudibold, Heulibold, Zornibold, Bibberbold) für Kinder ab drei, RULER für die Vorschule („happy, sad, calm, angry“) und das Farbenmonster (Freude, Traurigkeit, Wut, Angst und Ruhe). Das sind die vier ersten Karten.",
      "Erschrecken gehört für Papilio zur Furcht: Sein Beispiel für Angst ist ein lautes Geräusch, bei dem das Kind zusammenzuckt. „Erschrocken, ein lauter Knall“ bleibt also bei Angst. Ekel ist von Anfang an ein eigenes Gefühl und trägt „Igitt & Hoppla“.",
      "Zero to Three nennt für 24 bis 36 Monate wütend, traurig, eifersüchtig, ängstlich, frustriert und verletzt und, sobald das Kind sich als eigene Person begreift, Verlegenheit und Scham. Als typische Momente: mit einem Spielkameraden teilen müssen, ein neues Baby, die Trennung, wenn der Babysitter kommt, der Bruder nimmt den Pinsel, die Fäustlinge gehen nicht an, eifersüchtig auf den Muffin eines anderen. Gegen starke Gefühle: Papier zerreißen, stampfen, hüpfen, einen weichen Ball werfen.",
      "Baer und Frick-Baer geben Müdigkeit, Geborgenheit, Sehnsucht und Langeweile (neben Neugier) eigene Kapitel, gleichrangig mit Angst, Trauer, Wut, Scham, Schuld, Freude, Mitgefühl und Eifersucht. Das stützt „Müde & zu viel“ als eigene Gruppe.",
      "Die Ratgeber sind sich einig: Es gibt keine guten und schlechten Gefühle, nur Wege, mit ihnen umzugehen. Gottman: Gefühle früh ansprechen, solange sie klein sind, und als Gelegenheit zur Nähe sehen (sein erstes Beispiel ist ein Dreijähriger, der die Jacke für die Kita nicht anziehen will). Siegel und Bryson: Gefühle benennen („Name it to tame it“), Erschreckendes nacherzählen, bei großen Gefühlen erst den Körper bewegen. Graf und Seide: Wutanfälle kommen von unreifer Gefühlsregulation, nicht von Trotz; als Mittel tief atmen, zählen, laut singen, ins Wutkissen boxen, stampfen. Imlau: Gefühlsstarke Kinder erleben Freude so heftig wie Wut. Das passt zur Regel des Spiels, dass das Gefühl nie die nicht so gute Karte ist, und zu den Mitteln der Szenen.",
      "Zones of Regulation und das Mood Meter ordnen nach Energie und Wohlgefühl in vier Farben: Blau (müde, traurig, gelangweilt, krank), Grün (ruhig, froh), Gelb (aufgeregt, albern, frustriert), Rot (Wut, Panik). Für die Jüngsten empfehlen sie nur die Farben ohne Achsen; „Wie geht's dir?“ macht das schon mit dem Wetter. Für „Müde & zu viel“ heißt das: Kranksein und Erschöpfung nach dem Kindergarten gehören dazu, für „Freude“ auch albern und aufgeregt.",
      "Selbstbezogene Gefühle (Verlegenheit, Eifersucht, Mitgefühl) beginnen gegen Ende des zweiten Lebensjahrs, Stolz, Scham und Schuld etwa ab drei (Lewis). Schuld zeigt sich darin, dass das Kind etwas wiedergutmachen will – wie in „Ups, aus Versehen“ (C-43), wo der Bär sich entschuldigt und hilft.",
      "Gebaut sind die Gruppen ungleich: Angst 21 Runden, Traurig, Wütend, Streit und Freunde & Familie je 18, Freude & Stolz und Müde & zu viel je 9, Igitt & Hoppla 6. Die am selben Tag gesammelten Szenen C-37 bis C-51 füllen vor allem Wütend und Angst; ordnet man alle ein, hätte Wütend elf Szenen. Mit einer neunten Karte „Frust & Warten“ (die Zones of Regulation und Zero to Three nennen Frust eigens) und den neuen Szenen für Freude, Müde und Igitt hat jede Gruppe sechs bis acht Szenen (C-54).",
      "Eltern suchen genau diese fehlenden Momente: „kind aufgeregt vor urlaub“, „kind aufgeregt vor geburtstag“, „kind zu aufgeregt zum schlafen“, „kleinkind freut sich nicht beim abholen“, „kind will morgens nicht aufstehen“, „kleinkind übermüdet schreit“, „kind will nach kita nicht nach hause“, „reizüberflutung kindergarten“, „kind überfordert mit kindergarten“, „kleinkind mag keine schmutzigen hände“, „kind schämt sich“.",
      "Häufig gesucht, aber schon im Spiel oder in anderen Spielen: Angst vor Haare waschen und Friseur, vor lauten Geräuschen, vor Hunden, vor dem Dunkeln; „kind will nicht zähne putzen“ (Zähne putzen); „kind hat angst vor dem klo“ (Aufs Töpfchen); „kind will nicht teilen“ und „kleinkind beißt andere kinder“ (Streit im Kindergarten). Streit mit Geschwistern zu Hause fehlt (C-67).",
    ],
    topics: [
      {
        emoji: "🌞",
        title: "Freude: Wiedersehen, albern, staunen",
        searches: ["kind aufgeregt vor urlaub", "kind aufgeregt vor geburtstag", "kind zu aufgeregt zum schlafen", "kleinkind freut sich nicht beim abholen"],
        ideas: ["C-55", "C-56", "C-57", "C-66"],
      },
      {
        emoji: "🌙",
        title: "Müde & zu viel: Morgen, nach der Kita, krank",
        searches: [
          "kind will morgens nicht aufstehen",
          "kleinkind übermüdet schreit",
          "kind will nach kita nicht nach hause",
          "reizüberflutung kindergarten",
          "kind überfordert mit kindergarten",
        ],
        ideas: ["C-58", "C-59", "C-60", "C-61"],
      },
      {
        emoji: "🤢",
        title: "Igitt & Hoppla: Ekel, Missgeschick, Schuld",
        searches: ["kleinkind mag keine schmutzigen hände", "kleinkind mag keine dreckigen hände", "kleinkind ekelt sich vor essen", "kind schämt sich"],
        ideas: ["C-62", "C-63", "C-64", "C-65"],
      },
      {
        emoji: "🖌️",
        title: "Streit mit Geschwistern",
        searches: ["kind will nicht teilen", "kind eifersüchtig auf baby"],
        ideas: ["C-67"],
      },
    ],
    games: [
      {
        href: "/gefuehle/",
        searches: ["gefühle kinder kita", "gefühle benennen kleinkind", "kind aufgeregt vor urlaub"],
        title: "Alltagssituationen – Gefühle für Kleinkinder mit dem kleinen Bären",
      },
    ],
    excluded: [
      {
        title: "Gruppen nach Farbzonen oder Energie (Zones of Regulation, Mood Meter)",
        why: "Für die Jüngsten empfehlen die Programme selbst nur Farben ohne Achsen; „Wie geht's dir?“ macht das schon mit dem Wetter. Die Karten von „Alltagssituationen“ bleiben Gefühlswörter.",
      },
      {
        title: "Erschrecken als eigene Gruppe oder bei „Igitt & Hoppla“",
        why: "Papilio-U3 zählt Erschrecken zur Furcht und zeigt Angst gerade an einem lauten Geräusch; „Erschrocken, ein lauter Knall“ bleibt bei Angst.",
      },
      {
        title: "Eine eigene Gruppe für Scham und Schuld",
        why: "Kommt erst um drei und fühlt sich für kleine Kinder schwer an; ein Missgeschick mit Wiedergutmachen passt leichter verpackt zu „Igitt & Hoppla“.",
      },
      {
        title: "Enttäuscht vom Geschenk",
        why: "Wird gesucht, aber vor allem um Weihnachten und für ältere Kinder; „Enttäuscht, Keks zerbrochen“ zeigt dasselbe Gefühl schon.",
      },
      {
        title: "Lachen, wenn sich jemand wehtut",
        why: "Wird oft gesucht („kind lacht wenn sich jemand weh tut“), ist aber Verlegenheit oder Unsicherheit, die ein Bild nicht zeigen kann, ohne dass es wie Auslachen aussieht.",
      },
    ],
    ideas: ["C-54"],
    sources: [
      {
        label: "Papilio-U3 – Elternschätze: Gefühle: Bitte übertreiben! (Praxisheft Emotion Talk)",
        url: "https://www.papilio.de/files/papilio/red/download/papilio-elternschaetze_praxisheft_emotiontalk.pdf",
      },
      { label: "Papilio-U3", url: "https://www.papilio.de/unser-angebot/papilio-u3/" },
      {
        label: "Zero to Three – 24–36 Months: Social-Emotional Development",
        url: "https://zerotothree.org/resource/24-36-months-social-emotional-development",
      },
      { label: "Baer & Frick-Baer – Das große Buch der Gefühle (Leseprobe)", url: "https://content.e-bookshelf.de/media/reading/L-17797486-0b1d4b1212.pdf" },
      {
        label: "Gottman Institute – Raising an Emotionally Intelligent Child",
        url: "https://www.gottman.com/product/raising-an-emotionally-intelligent-child/",
      },
      {
        label: "MSU Extension – Upstairs and downstairs brain (Siegel & Bryson)",
        url: "https://www.canr.msu.edu/news/understanding_the_upstairs_and_downstairs_brain",
      },
      {
        label: "prisma – Interview mit Danielle Graf: Auch Wutzwergen eine Chance geben",
        url: "https://www.prisma.de/magazin/themen/Auch-Wutzwergen-eine-Chance-geben,21706544",
      },
      {
        label: "kindaling – Interview mit Nora Imlau: Gefühlsstarke Kinder",
        url: "https://kindaling.de/magazin/gefuehlsstarke-kinder-bestseller-autorin-nora-imlau-im-interview",
      },
      {
        label: "Hogrefe – Petermann & Wiedebusch, Emotionale Kompetenz bei Kindern",
        url: "https://www.hogrefe.com/de/shop/emotionale-kompetenz-bei-kindern-74794.html",
      },
      {
        label: "Guilford – Lewis, The Rise of Consciousness and the Development of Emotional Life",
        url: "https://www.guilford.com/books/The-Rise-Consciousness-Development-Emotional-Life/Michael-Lewis/9781462512522/summary",
      },
      {
        label: "Emotion Researcher – The Development of Guilt as Repair in Childhood",
        url: "https://emotionresearcher.com/the-development-of-guilt-as-repair-in-childhood/",
      },
      { label: "Deutscher Bildungsserver – Papilio", url: "https://www.bildungsserver.de/innovationsportal/bildungplusartikel.html?artid=910" },
      {
        label: "NAEYC – Teaching Emotional Intelligence in Early Childhood",
        url: "https://naeyc.org/resources/pubs/yc/mar2017/teaching-emotional-intelligence",
      },
      { label: "NHS Borders – Zones of Regulation", url: "https://nhsborders.scot.nhs.uk/media/1001858/Zones-of-Regulation.pdf" },
      { label: "Stiftung Lesen – Vorleseideen Monster (Farbenmonster)", url: "https://www.stiftunglesen.de/fileadmin/PDFs/Vorleseideen/2022_01_Monster.pdf" },
    ],
  },
  {
    id: "rituale",
    date: "2026-11-04",
    emoji: "💛",
    title: "Rituale für den Tagesplan: Erzählen nach der Kita, Mutmach- und Gute-Nacht-Sätze",
    question:
      "Welche festen Rituale empfehlen Eltern-Ratgeber für den Morgen, nach Kita oder Schule und vor dem Schlafen – und mit welchen Worten genau? Die Fragen nach dem Guten, dem Blöden und dem Neuen des Tages, und Sätze wie „Ich bin gut so, wie ich bin“ und „Ich schaffe das“.",
    method:
      "Websuche auf Deutsch und Englisch (Fragen nach der Schule, Rose/Thorn/Bud, Affirmationen für Kinder, Abendrituale), gelesen wurden Ratgeberseiten, Elternblogs und Pressetexte, die eine Fachperson zitieren. Belastbare Studien zu Affirmationen für Kleinkinder fanden sich nicht; was dazu gesagt wird, stammt aus Blogs. Aus der Fachliteratur bekannt (nicht neu gelesen): Selbstaussagen können bei Menschen mit wenig Selbstwert nach hinten losgehen (Wood u. a. 2009). Darum stehen auf den Karten bedingungslose Sätze („gut so, wie ich bin“, „geliebt“) und „Ich schaffe das“ immer mit „hilft mir jemand“.",
    findings: [
      "Gut, schlecht, neu ist als Rose, Thorn, Bud (Rose, Dorn, Knospe) oder „Highs and Lows“ ein verbreitetes Familienritual am Abendbrottisch; eine feste deutsche Formulierung gibt es nicht. Auf der Karte: „Was war heute schön? … blöd? … neu?“.",
      "Statt „Wie war's?“ lieber konkret fragen (Prof. Tina Kretschmer, zitiert bei echo24), das Kind erst ankommen lassen, zu einer festen Zeit fragen und selbst auch vom eigenen Tag erzählen (Famigros).",
      "Mutmach-Sätze für Kinder (Affirmationen) sind kurz, im Präsens und positiv: „Ich bin gut so, wie ich bin“, „Ich bin mutig“, „Ich kann das schaffen, auch wenn es schwer ist“, „Ich darf Fehler machen“. Die Ratgeber betonen: jeden Tag dieselben, lieber regelmäßig als viele, vor dem Spiegel oder mit der Hand aufs Herz, und das Kind nie zum Nachsprechen zwingen.",
      "Vor dem Schlafen: ein Moment des Dankes („Worüber hast du dich heute gefreut?“), Zuneigung ohne Bedingung („Ich hab dich lieb, genau so, wie du bist“) und Sätze wie „Ich bin geliebt“ und „Morgen ist ein neuer Tag“; gleich jeden Abend, leise beim Kuscheln.",
      "Daraus: vier Ritualkarten im Zeitplan mit den Worten für die Eltern (H-58) und „Wie geht's dir?“ morgens und abends mit dem Vergleich am Abend (C-33), zusammen in der Vorlage „Mein Tag mit Ritualen“.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Sätze, die Leistung versprechen („Ich bin der Beste“, „Ich kann alles“)",
        why: "Sie stimmen für ein Kind oft nicht und können dann eher entmutigen; die Karten sagen, dass das Kind geliebt ist und Hilfe bekommt.",
      },
    ],
    ideas: ["H-58", "C-33"],
    sources: [
      {
        label: "echo24 – Viele Eltern stellen nach der Schule die falschen Fragen",
        url: "https://www.echo24.de/welt/viele-eltern-stellen-ihren-kindern-nach-der-schule-die-falschen-fragen-zr-94467210.html",
      },
      {
        label: "Famigros – Kinder zum Reden bringen",
        url: "https://famigros.migros.ch/de/kinder-und-jugendliche/schule-und-ausbildung/schulanfang/kinder-zum-reden-bringen",
      },
      {
        label: "Rose, Thorn, Bud am Familientisch",
        url: "https://de.parent.com/blogs/conversations/2025-rose-thorn-bud-5-dinner-table-gratitude-games-for-kids",
      },
      {
        label: "Stefanie Stahl Akademie – Affirmationen für Kinder",
        url: "https://stefaniestahlakademie.de/affirmationen-fuer-kinder-10-wege-ihr-selbstwertgefuehl-zu-staerken/",
      },
      { label: "Daddylicious – Affirmationen für Kinder", url: "https://www.daddylicious.de/affirmationen-fuer-kinder/" },
      {
        label: "Saarpfalz-Kreis – Abendritual: Gute-Nacht-Box (PDF)",
        url: "https://www.saarpfalz-kreis.de/images/Kinder_Jugend_Familie/Familien-_und_Jugendhilfe/Familienhilfezentren/Abendritual_-_Gute_Nacht_Box.pdf",
      },
    ],
  },
  {
    id: "website-download",
    date: "2026-11-03",
    emoji: "📶",
    title: "Wie viel lädt ein Besuch der Startseite herunter?",
    question:
      "Chrome zeigte beim Öffnen der Startseite 5,6 MB übertragene Daten. Was davon braucht ein Besuch wirklich, und was lädt der Service Worker für die Offline-Nutzung, die die wenigsten verwenden?",
    method:
      "Den Build (bun run build) gemessen: welche Dateien der Service Worker beim ersten Besuch lädt (seine Liste in out/sw.js, Größen auf der Platte und gzip-gepackt), und im Vorschau-Browser mit leerem Cache, was die Startseite selbst lädt (Resource Timing). Danach dasselbe mit dem umgebauten Service Worker, und offline geprüft, indem der Server gestoppt und ein vorher gespieltes Spiel neu geladen wurde.",
    findings: [
      "Der Service Worker lud bei jedem ersten Besuch nach dem Laden der Seite alle 1885 Dateien der Seite herunter, 42 MB (gepackt 37 MB): die Bilder (18 MB) und Töne (17 MB) aller Spiele, den Code aller Spiele und die Seiten für Suchmaschinen. Nach jedem neuen Build lud er alles noch einmal, für jeden wiederkehrenden Besuch.",
      "Die Startseite selbst lädt rund 1,2 MB Code (27 Teile, davon die Seiten hinter den Büchern im Regal vorab, damit ein Tippen sofort weiterblättert), 160 KB Styles mit der Schrift darin, 170 KB Bilder und – bei eingeschalteter Musik – das Hintergrundlied mit 2,5 MB. Das Lied ist der größte Posten eines Besuchs.",
      "Jedes Spiel wird schon getrennt nachgeladen (eigene JS- und CSS-Teile je Seite); die Masse kam allein vom Service Worker.",
      "Umgebaut behält der Service Worker nur, was ein Besuch benutzt: beim Start 20 Dateien (900 KB, gepackt 520 KB, die die Seite ohnehin geladen hat), dann jedes Spiel, sobald es gespielt wird – auch das läuft danach offline. Alles lädt er nur für eine installierte App. Ein neuer Build übernimmt, was sich nicht geändert hat, statt alles neu zu laden.",
      "Mit Datensparmodus (Save-Data) oder auf 2G lädt die Startseite weder die Seiten hinter den Büchern noch das Lied vorab; sie kommen mit dem ersten Tippen.",
      "Weitere Hebel, nicht umgesetzt: das Lied kleiner kodieren oder erst beim ersten Tippen laden (dann spielt es dort später), und die Schrift aus dem Stylesheet lösen, das vor dem ersten Bild geladen sein muss.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Spiele einzeln nachladen",
        why: "Ist schon so: jede Spielseite ist ein eigener Teil (App.tsx lädt sie lazy), nur der Service Worker holte trotzdem alles.",
      },
    ],
    ideas: [],
    sources: [],
  },
  {
    id: "aehnliche-umrisse",
    date: "2026-11-03",
    emoji: "☝️",
    title: "Schatten und Verstecke: Welche Bilder sehen sich zu ähnlich?",
    question:
      "Bei Schatten finden und Wer schaut da raus? soll immer genau eine Antwort passen (X-14). Welche Bilder kann ein Kind als schwarzen Schatten oder als Teil, der aus dem Busch schaut, nicht auseinanderhalten?",
    method:
      "Im Browser jedes der 65 Bilder von Schatten finden in Apples Emojis (iPhone, Mac) und in Googles Noto Color Emoji (Android, von Google Fonts geladen) gezeichnet. Für die Schatten: der Umriss jedes Paars verglichen (Überdeckung, auf gleiche Größe gebracht) und die ähnlichsten Paare in beiden Schriften schwarz nebeneinander angesehen – die Zahl allein taugt nicht, sie hält alle runden Bilder für ähnlich (Erdbeere und Haus). Für Wer schaut da raus?: der sichtbare Teil (oben, links, rechts, bei 20 %) farbig in jeder Gruppe von PEEK_LOOKS verglichen (Umriss mal Farbe), dazu die Durchschnittsfarbe jedes Tiers für die Gucklöcher im Laub; die ähnlichsten groß angesehen. Entschieden nach Augenschein, ob ein Kind sie auseinanderhält.",
    findings: [
      "Schatten, die sich nicht unterscheiden lassen: Schwein, Schaf und Schildkröte (auf Android drei runde Kleckse auf kurzen Beinen), Schnecke und Schildkröte, Katze und Hund (auf dem iPhone), Hund und Elefant, Hund und Teddy, Eule und Teddy (auf Android), Apfel, Birne und Erdbeere, Pilz und Baum.",
      "Teile, die aus dem Busch gleich aussehen: der hellbraune Schwanz mit Hinterbein von Katze und Hund, das Grau von Elefant neben Kuh oder Schaf, das grauweiße Fell von Hase und Maus und das Braun von Eichhörnchen und Igel durch die Gucklöcher.",
      "Diese Paare kommen nie zusammen zur Auswahl (SHADOW_LOOKALIKES, PEEK_LOOKALIKES); die übrigen ähnlichen Bilder einer Art bleiben, damit die schweren Stufen schwer bleiben.",
      "Nachtrag 7. November 2026, 35 weitere Tiere ebenso geprüft (headless Chrome, Apple Color Emoji und Noto Color Emoji von Google Fonts, Umriss-Überdeckung jedes neuen Tiers mit allen Bildern, die nächsten schwarz nebeneinander; sichtbare Teile oben, links, rechts bei 25 % und die Durchschnittsfarbe je Gruppe): 20 kamen dazu. Gleiche Schatten: Zebra und Kuh, Nilpferd und Schwein, Pfau und Baum (auf Android), Affe und Eichhörnchen. Gleiche Teile: einfarbig braunes Fell durch die Gucklöcher (Affe, Hirsch, Känguru, Kamel, Ziege, Pferd), Grau (Nashorn, Elefant, Gorilla; Robbe und Nilpferd aus dem Teich), Schwarz-Weiß (Zebra, Kuh), weiße Wolle (Schaf, Lama), Orange mit dunklen Flecken (Tiger, Giraffe), Grün (Pfau und Papagei; Schildkröte, Eidechse und Raupe), die gelb-schwarzen Ringe von Raupe und Biene, der gebogene Schwanz von Affe und Hund und ein blauer Rücken mit Flosse aus dem Wasser (Delfin, Fisch).",
      "Nachtrag 7. November 2026, zweite Runde: rund 190 Emojis aus Fahrzeugen, Essen, Dingen und Tieren ebenso geprüft (im Browser in Apple Color Emoji und Noto Color Emoji gezeichnet, Umriss-Überdeckung mit allen Bildern, die nächsten schwarz nebeneinander); 94 kamen dazu (13 Fahrzeuge, 14 zum Essen, 62 Dinge, 5 Tiere). Was am häufigsten scheitert: Apples Fahrzeuge schräg von vorn sind alle derselbe Kasten (Bus, Lastwagen, Feuerwehr, Straßenbahn, Polizeiauto, Auto, Krankenwagen), Essen in Schachtel oder Becher wird ein Kasten (Pommes, Popcorn, Becher, Saft), und vieles ist ein runder Kopf auf kurzem Stiel (Spiegelei, Lutscher, Ballon, Glühbirne, Baum, Pfau). Neue gleiche Schatten: diese Kästen untereinander, Schuhe und Socke (Stiefel, Rollschuh, Schlittschuh), Torte und Muffin, Kuchenstück mit Käse und Haus, Eimer, Korb und Geschenk, Stift, Flip-Flop und Raupe, Zahnbürste und Möhre, Geige und Gitarre, Karussell und Pferd, Zelt und Berg, Regenbogen und Mond, Tropfen mit Birne und Feuer, das Ahornblatt mit Stern und Tanne, Sonne, Schneeflocke und Sonnenblume, Fallschirm und Schirm, Spinne und Marienkäfer, Teekanne und Fisch. Gleiche Teile: T-Rex und Dino (grün), Spinne mit Ameise, Marienkäfer und Grashüpfer (dünne dunkle Beine), Grashüpfer und Schnecke (braun), Hummer mit Krebs und Tintenfisch (rot aus dem Teich).",
    ],
    topics: [],
    games: [],
    excluded: [
      { title: "Traktor und Feuerwehr, Auto und Traktor", why: "Ähnlich kastig, aber das große Hinterrad und die Leiter unterscheiden sie deutlich." },
      { title: "Eule und Pinguin", why: "Farbig und als Schatten gut zu unterscheiden: der Pinguin steht schmal mit Schnabel zur Seite." },
      { title: "Erdbeere und Haus", why: "Der Umrissvergleich hielt sie für am ähnlichsten, das Dach unterscheidet sie aber auf den ersten Blick." },
      {
        title: "Leopard, Dromedar, Hai, Otter, Stier, Bison, Taube und Adler",
        why: "Haben denselben Umriss wie ein anderes Tier (Tiger, Kamel, Delfin, Robbe, Kuh, Schwein, untereinander) – von zweien gleich aussehenden kam nur eins dazu.",
      },
      {
        title: "Küken, Frosch, Fledermaus, Faultier, Schlange, Truthahn",
        why: "Küken und Frosch sind Gesichter oder runde Kleckse; die anderen kennen kleine Kinder weniger oder wären in ihrer Gruppe allen anderen zu ähnlich (die grüne Schlange).",
      },
      {
        title: "Krankenwagen, Pickup, Kleinbus, Fähre, Gondel, Schnellzug",
        why: "Auf dem iPhone derselbe Kasten wie Bus, Lastwagen, Feuerwehr oder Polizeiauto, die Gondel wie die Seilbahn, die Fähre wie das Schiff; der Schnellzug ist ein Keil, den kein Kind erkennt.",
      },
      {
        title:
          "Zitrone, Orange, Tomate, Avocado, Paprika, Kartoffel, Ei, Zwiebel, Kiwi, Burger, Brot, Pfannkuchen, Sandwich, Hotdog, Schokolade, Gurke, Waffel, Pudding, Blaubeeren",
        why: "Als Schatten runde oder längliche Kleckse ohne eigenen Umriss.",
      },
      {
        title: "Pommes, Popcorn, Lutscher, Croissant, Honig, Baguette, Fleisch",
        why: "Pommes und Popcorn sind auf dem iPhone ein Kasten wie Eimer und Geschenk, der Lutscher ein Kreis am Stiel wie Spiegelei und Ballon, das Croissant auf Android ein Klumpen wie Brokkoli, Honig ein runder Topf wie der Apfel, das Baguette ein Stab wie der Stift, das Fleisch wie die Hähnchenkeule.",
      },
      {
        title: "Fernseher, Telefon, Kamera, Radio, Koffer, Rucksack, Klopapier, Vorhängeschloss, Pflaster, Mikrofon, Wachsmalstift, Pinsel",
        why: "Kästen, Kleckse oder Stäbe (der Pinsel wie Zahnbürste und Möhre); das alte Telefon kennen kleine Kinder nicht, und „Schloss“ wäre neben der Burg doppeldeutig.",
      },
      {
        title: "Magnet, Pokal, Planet, Welle, Schraubenschlüssel, Anker, Schleife, Kleeblatt, Wanderschuh",
        why: "Kennen kleine Kinder kaum, oder der Umriss gleicht einem Bild, das schon da ist (der Wanderschuh dem Schuh).",
      },
      {
        title: "Qualle, Esel, Gans, Widder, Käfer, Vogel, Kugelfisch, Biber",
        why: "Die Qualle ist auf dem iPhone halb durchsichtig und ihr Schatten grau; Esel, Gans, Widder und Käfer stehen wie Zebra, Ente, Schaf und Marienkäfer, der Vogel ist auf dem iPhone ein Gesicht, Kugelfisch und Biber sind Kleckse.",
      },
    ],
    ideas: ["X-14"],
    sources: [],
  },
  {
    id: "gefuehle-selbst-regulieren",
    date: "2026-11-02",
    emoji: "🐻",
    title: "Gefühle: Was ein Kleinkind selbst tun kann",
    question:
      "Welche Situationen bringen Zwei- und Dreijährige typischerweise aus dem Gleichgewicht, und was kann das Kind selbst tun, um sein Gefühl zu lenken (nicht die Eltern)? Daraus: neue Szenen für das Spiel Gefühle.",
    method:
      "Zehn Websuchen (Deutsch und Englisch: Studien zur Gefühlsregulation von Zweijährigen, Auslöser von Wutanfällen, typische Ängste, Atemübungen, Eifersucht, Kuschelecken und Übergangsobjekte, Hunde-Sicherheit) und eine Studie selbst gelesen (Ratcliff u. a. 2021, Autorenfassung bei PMC). Die Studie von Ponzetti u. a. (2023) war nicht abrufbar (403), sie ist nur nach Kurzfassungen aus der Suche zitiert. Dazu die Google-Autovervollständigung für 27 Suchanfänge abgefragt (2. November 2026, deutsch). Die meisten Ratgeber zu einzelnen Mitteln (Pusten, Kuschelecke) sind Praxismaterial, keine Studien – sie zeigen, was üblich ist, nicht, was nachweislich wirkt. Die bestehenden Szenen (Zu Hause, Kita) sind gegengelesen, damit nichts doppelt kommt.",
    findings: [
      "Selbstregulation wächst im dritten Lebensjahr: Vorher lenken vor allem Erwachsene das Gefühl, ab etwa zwei beginnt das Kind, eigene Mittel zu benutzen – mit dem Körper zuerst, dann mit Worten (auch leisem Selbstgespräch).",
      "Das häufigste und erfolgreichste Mittel von Zweijährigen ist, sich aktiv mit etwas anderem zu beschäftigen (Grolnick, Bridges und Connell 1996: 37 Zweijährige beim Warten und bei der Trennung; „active engagement with substitute objects“ kam am meisten vor und ging mit dem wenigsten Kummer einher).",
      "Mit dem Alter ändern sich die Mittel (Ratcliff, Vazquez, Lunkenheimer und Cole 2021, 120 Kinder von 24 Monaten bis 5 Jahre beim Warten auf ein Geschenk): Sich selbst beruhigen nimmt ab, sich ablenken nimmt zu, sich an die Mutter wenden steigt bis drei und fällt dann. Wer mit fünf mehr ablenkte, galt als besser reguliert, wer sich vor allem an die Mutter wandte, als weniger.",
      "Bei Angst nutzen Kleinkinder eher Mittel für sich selbst, bei Wut eher den Weg zu anderen (Ponzetti u. a. 2023, 24 und 30 Monate; nur aus der Kurzfassung). Für die Szenen heißt das: bei Angst Kuscheltier, Ohren zuhalten, Verkriechen; bei Wut „Ich bin sauer!“ sagen, „Stopp!“, Hilfe holen.",
      "Hilfe holen ist gut, darf aber nicht das einzige Mittel sein: Die Szenen sollen vor allem zeigen, was das Kind selbst tun kann – mit dem Körper (stampfen, pusten, Fäuste drücken, Kuscheltier drücken), mit Worten (das Gefühl sagen, „Stopp!“, „Hilf mir bitte“) und mit etwas anderem (weiterspielen, helfen, singen).",
      "Häufigste Auslöser von Wutanfällen (eine Erhebung und viele Ratgeber): etwas nicht bekommen, etwas aufhören oder wechseln müssen (91,5 % in der Erhebung), Müdigkeit und Hunger, und Frust, wenn etwas allein nicht klappt. Davon fehlen im Spiel noch: Spielplatz verlassen, Bildschirm aus, Nein im Laden, Anziehen, Warten aufs Essen.",
      "Typische Ängste mit zwei und drei: laute Dinge, die man nicht versteht (Staubsauger, Föhn), Tiere (Hunde), Dunkelheit und Alleinsein, Arzt, Haare waschen. Ratgeber raten, Angst nicht kleinzureden, sondern dem Kind etwas in die Hand zu geben – ein Nachtlicht, das es selbst anknipst, ein Knopf, den es selbst drückt.",
      "Kuscheltiere und Schmusedecken sind zwischen etwa 18 Monaten und drei Jahren am wichtigsten und helfen besonders bei Übergängen (DGUV); viele Kitas haben Ruheräume oder Kuschelecken, um Selbstregulation zu üben.",
      "Atemübungen („an der Blume riechen, die Kerze auspusten“, ein Kuscheltier auf dem Bauch heben und senken) sind in Kitas verbreitet; man soll sie in ruhigen Momenten üben und im Ernstfall nur noch daran erinnern. Belege gibt es kaum, eine kleine Studie mit Fünf- bis Sechsjährigen fand ruhigeren Herzschlag nach acht Wochen.",
      "Bei Hunden lehren Programme gegen Hundebisse „Steh wie ein Baum“: Füße fest, Arme an den Körper, ganz still (Doggone Safe) – ein Mittel gegen Angst, das zugleich schützt.",
      "Eltern suchen nach genau diesen Momenten (Autovervollständigung): „kind will nicht vom spielplatz weg“, „kind wutanfall beim anziehen“, „kind wutanfall supermarkt“, „kind 2 jahre hat angst vor staubsauger“, „kind hat angst vor hunden was tun“, „kleinkind angst vor arzt“, „kind 2 jahre angst vorm haare waschen“, „kind eifersüchtig auf baby“, „kind darf in kita nicht mitspielen“, „überreiztes kleinkind beruhigen“, „kleinkind schnell frustriert“. „Kind kann nicht verlieren“ wird erst für Vier- bis Zehnjährige gesucht.",
      "Für das Spiel folgt eine Regel für alle neuen Szenen (Bereich C): Der Bär handelt selbst; das Gefühl ist nie die nicht so gute Karte, nur was wehtut oder kaputt macht; jede Szene hat ein Mittel mit dem Körper und eines, bei dem der Bär etwas anderes tut; Hilfe holen höchstens in einem Schritt.",
    ],
    topics: [
      {
        emoji: "🌋",
        title: "Wut: aufhören, Nein, klappt nicht",
        searches: [
          "kind will nicht vom spielplatz weg",
          "kind wutanfall supermarkt",
          "kind wutanfall beim anziehen",
          "kleinkind schnell frustriert",
          "kleinkind frustrationstoleranz",
          "wütendes kleinkind beruhigen",
        ],
        ideas: ["C-01", "C-02", "C-03", "C-04", "C-06"],
      },
      {
        emoji: "😨",
        title: "Angst: laut, Tiere, Arzt, Dunkel",
        searches: [
          "kind 2 jahre hat angst vor staubsauger",
          "kind hat angst vor föhn",
          "kind hat angst vor hunden was tun",
          "kleinkind angst vor arzt",
          "kleinkind angst vor impfung",
          "kind 2 jahre angst vorm haare waschen",
          "kind angst vor dunkelheit nehmen",
          "kleinkind nachts beruhigen",
        ],
        ideas: ["C-07", "C-08", "C-09", "C-10", "C-11"],
      },
      {
        emoji: "💧",
        title: "Traurig, eifersüchtig, ausgeschlossen",
        searches: ["kind eifersüchtig auf baby", "kind 3 jahre eifersüchtig auf baby", "kind kuscheltier verloren", "kind darf in kita nicht mitspielen"],
        ideas: ["C-05", "C-12", "C-13", "C-14"],
      },
      {
        emoji: "🎈",
        title: "Zu viel, Ekel, Scham, große Freude",
        searches: ["überreiztes kleinkind beruhigen", "kleinkind schnell überreizt", "kind mag kein gemüse was tun"],
        ideas: ["C-15", "C-16", "C-17", "C-18"],
      },
      {
        emoji: "🧰",
        title: "Mittel lernen und wiedererkennen",
        searches: ["kind gefühle regulieren", "kind helfen gefühle zu regulieren", "kleinkind beruhigen"],
        ideas: ["C-19", "C-20", "C-21", "C-22", "H-09"],
      },
    ],
    games: [
      {
        href: "/gefuehle/",
        searches: ["kind gefühle regulieren", "kind helfen gefühle zu regulieren", "wütendes kleinkind beruhigen"],
        title: "Gefühle für Kleinkinder – was der kleine Bär selbst tun kann",
      },
    ],
    excluded: [
      {
        title: "Weinen, Angst oder Wut als nicht so gute Karte",
        why: "Gefühle sollen nicht weggeredet werden; nicht so gut ist nur, was wehtut oder kaputt macht. Sich verkriechen oder die Ohren zuhalten ist ein gutes Mittel.",
      },
      {
        title: "Auszeit, stille Treppe, Strafen",
        why: "Kein Mittel des Kindes, sondern eine Maßnahme der Eltern; Ratgeber raten bei Wut zur Begleitung statt Strafe.",
      },
      {
        title: "Süßigkeit oder Bildschirm als Trost",
        why: "Lenkt das Gefühl nicht, sondern überdeckt es; im Spiel ist das Tablet schon ein nicht so guter Weg (Müde am Abend).",
      },
      { title: "Verlieren können", why: "Wird erst für Vier- bis Zehnjährige gesucht und passt nicht zu einer App ohne Gewinnen und Verlieren." },
      {
        title: "Schwere Themen: Tod, Trennung, Krankenhaus, Verlaufen",
        why: "Gehören in Bücher, die ein Erwachsener mit dem Kind liest, nicht in ein Spiel, das ein Zweijähriges allein spielt.",
      },
      { title: "Aufessen müssen", why: "Bei Ekel zeigt die Szene „Nein, danke“ und Riechen ohne Druck, nie, dass man aufessen muss." },
    ],
    ideas: ["C-19", "C-20", "C-21", "C-22"],
    sources: [
      { label: "Grolnick, Bridges & Connell 1996 – Emotion regulation in two-year-olds", url: "https://commons.clarku.edu/faculty_psychology/490" },
      { label: "Ratcliff u. a. 2021 – Longitudinal changes in young children's strategy use", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8694582" },
      { label: "Ponzetti u. a. 2023 – Emotion regulation in toddlerhood (Children)", url: "https://www.mdpi.com/2227-9067/10/5/878/htm" },
      { label: "Happiest Baby – Toddler tantrum triggers", url: "https://happiestbaby.com/blogs/toddler/toddler-tantrum-triggers" },
      { label: "An-Najah – Erhebung zu Auslösern von Wutanfällen", url: "https://journals.najah.edu/journal/pmpj/first-online/article/2416" },
      {
        label: "Famigros – Ängste bei Kindern",
        url: "https://famigros.migros.ch/de/baby-und-kleinkind/babyentwicklung/babys-viertes-jahr/aengste-bei-kindern",
      },
      { label: "kita.de – Angstzustände bei Kindern", url: "https://www.kita.de/wissen/angstzustaende-bei-kindern/" },
      { label: "UCF – Smell the flower, blow the pinwheel", url: "https://tats.ucf.edu/wp-content/uploads/sites/9/2020/03/Smell-Blow.pdf" },
      { label: "Nebraska Extension – Atemübungen für Kinder", url: "https://extensionpubs.unl.edu/publication/g2287/html/view" },
      { label: "DGUV – Nicht ohne den Teddy", url: "https://dguv.de/de/mediencenter/pm/pressemitteilung_487557.jsp" },
      { label: "Katholische Kita – Ruheraum", url: "https://www.katholische-kindergaerten.de/sites/default/files/kitas/hJYspA/2025_info_ueber_ruheraum.pdf" },
      { label: "DAK – Eifersucht unter Geschwistern", url: "https://www.dak.de/dak/gesundheit/familie-leben/erziehung/eifersucht-unter-geschwistern_18598" },
      { label: "Doggone Safe – Be a Tree", url: "https://doggonesafe.com" },
      { label: "Ecampus Ontario – Emotional development in toddlerhood", url: "https://ecampusontario.pressbooks.pub/childgrowthanddevelopment/?p=423" },
    ],
  },
  {
    id: "tafel-verkaufen",
    date: "2026-10-31",
    emoji: "💶",
    title: "Wochenplaner und Belohnungstafel zum Kaufen – ein Geschäft?",
    question:
      "Lohnt es sich, Tagesplan, Wochenplaner und Belohnungstafel auch gedruckt zu verkaufen – z. B. 100 Tischkalender bei Saxoprint, alle Ansichten auf den Seiten, Bildkarten getrennt gedruckt, Klett dazu, zugeschnitten zum Umklappen?",
    method:
      "Vier Websuchen (Magnet- und Klett-Tafeln bei Amazon, Etsy und Händlern, Vorschriften für Kinderprodukte, Saxoprint) und die Saxoprint-Seite zu Tischkalendern gelesen, 31. Oktober 2026. Die Preise der Druckerei stehen nur im Konfigurator, der hier nicht zu öffnen war; den Kalenderpreis hat der Betreiber dort abgelesen (100 Stück 160 €, 250 Stück 180 €), Karten, Klett und Zeit sind geschätzt. Keine Rechtsberatung – was für Spielzeug gilt, vor dem Verkauf mit IHK oder Händlerbund klären.",
    findings: [
      "Der Markt ist voll und billig: Magnetische Wochenplaner mit 150 bis 250 Magneten kosten bei Amazon und Händlern etwa 7 bis 30 € (Likarto, MeinSchlaufuchs, Yourganize, Momsiv; Action hat einen eigenen). Handgemachte Klett-Sets mit Namen gibt es bei Etsy für rund 40 € (eines: über 300 Karten, CA$ 59), Vorlagen zum Selbstdrucken für 4 bis 14 $.",
      "Saxoprint druckt Tischkalender ab 1 Stück: 297 × 105 mm quer, 13 Blatt, Wire-O-Ringbindung mit Aufsteller, bis 300 g/m², auf Wunsch mit Folie (Cellophanierung). Die Seite spricht nur von Kalenderblättern; ob 13 Seiten mit Tagesplan statt Monaten gehen, ist dort nicht gesagt – vermutlich ja, da jede Seite frei gestaltet wird, aber vorher fragen.",
      "Der Kalender kostet fast nichts: 100 Stück 160 € (1,60 € je Stück), 250 Stück 180 € (0,72 €) – die 150 weiteren kosten nur 20 €, fast der ganze Preis ist das Einrichten. Das Risiko einer Auflage sind also rund 180 €, nicht die Menge. Je Klett-Set kommen geschätzt 30 Bildkarten mit Folie (1 bis 2 €) und 30 Paar Klettpunkte (2 bis 3 €) dazu, zusammen 4 bis 7 € Material; Porto zahlt meist der Käufer, Etsy nimmt etwa 10 %. Bei 25 bis 35 € bleiben 16 bis 28 € je Set, bei 100 verkauften 1.600 bis 2.800 €.",
      "Das Material ist also nicht das Problem, sondern Zeit und Verkauf: 30 Klettpunkte kleben, Karten zuschneiden, packen – geschätzt 20 bis 30 Minuten je Set, bei 100 Sets 35 bis 50 Stunden (wenn alle verkauft werden, 35 bis 80 € die Stunde). Schwerer ist, 100 oder 250 überhaupt zu verkaufen: Die Seiten der App sind neu und bringen noch kaum Besucher, Käufer kämen über Etsy, Kleinanzeigen oder Kita und Freunde.",
      "Das Wichtigste dagegen: Die App ist für Zwei- und Dreijährige, und Klettpunkte (1 bis 2 cm) lösen sich – sie passen in den Kleinteile-Zylinder (31,7 mm) und sind für Unter-Dreijährige verschluckbar, wie die Magnete der Magnettafeln (Recherche „Belohnungstafel“). Gilt der Plan als Spielzeug, braucht er CE-Kennzeichnung, Prüfung nach EN 71 und technische Unterlagen; gilt er nicht als Spielzeug, die Pflichten der Produktsicherheitsverordnung (GPSR). Ein Warnhinweis „nicht für Kinder unter 36 Monaten“ widerspräche genau der Zielgruppe.",
      "Weitere Pflichten beim Verkauf: Gewerbe anmelden, Verpackungsregister LUCID und ein Dualsystem vor dem ersten Paket, Impressum und Datenschutz für den Shop (Adressen, Zahlungen – die Datenschutzerklärung der App ändert sich dann, PRIVACY_UPDATED), Widerrufsrecht (entfällt für Sets mit Namen, weil persönlich gefertigt).",
      "Was die Pflichten kosten (Websuche 31. Oktober 2026, Ratgeber- und Anbieterangaben): Gewerbeanmeldung einmal 15 bis 65 € je nach Stadt (Berlin online 15 €, Hamburg etwa 20 €, München etwa 47 €). LUCID-Registrierung kostenlos, die Pflicht-Lizenz bei einem dualen System für kleine Mengen ab etwa 39 bis 59 € im Jahr (Etsy und Amazon verlangen die LUCID-Nummer). IHK-Beitrag entfällt bei Kleingewerbe bis 5.200 € Gewinn, Umsatzsteuer mit der Kleinunternehmerregelung (bis 25.000 € Umsatz im Vorjahr). Spielzeugrecht: Ist der Kalender kein Spielzeug, sondern ein Verbraucherprodukt (GPSR), kostet es nur Arbeit – Risikobewertung, Herstellerangabe auf dem Produkt; ist er Spielzeug, braucht er CE und Prüfung nach EN 71 (Teile 1 bis 3), ein Laborbericht kostet einmal einige hundert Euro (ein Labor in China nennt 290 $, deutsche Labore nennen ihre Preise nur auf Anfrage).",
      "Spielzeug oder nicht (Leitfaden Nr. 9 der EU-Kommission zu Büchern, 2013, selbst gelesen; nicht bindend, im Einzelfall entscheidet die Marktaufsicht): Spielzeug ist, was dafür gestaltet ist, dass Kinder unter 14 damit spielen, und was Kinder vernünftigerweise damit tun, zählt mehr als das, was der Hersteller sagt. Der Leitfaden prüft Seitenzahl, Material, Sinneselemente, Detailreichtum und Farbkontrast und ordnet ein: „Buch, wenige Seiten, einfache Bilder“ und „Buch mit Klappelementen, wenige Seiten, einfache Bilder“ sind Spielzeug für unter drei Jahre, Stickerbücher Spielzeug ab drei. Keine Spielzeuge sind gewöhnliche Lese- und Lernbücher und Bücher, die Eltern Kleinkindern vorlesen – auch mit dicken Seiten und einfachen Bildern. Ein Kalender, dessen 13 große, einfache Bilder ein Zweijähriges selbst umklappen soll, liegt beim Spielzeug für unter drei Jahre; eine Belohnungstafel mit Stickern oder Klett-Karten ebenso. Die Liste der Spielzeugrichtlinie, was kein Spielzeug ist, nennt Kalender und Papier nicht.",
      "Darum besser als Spielzeug für unter drei Jahre behandeln: CE-Zeichen, Sicherheitsbewertung, technische Unterlagen und EU-Konformitätserklärung, geprüft nach EN 71-1 (Mechanik), EN 71-2 (Brennbarkeit) und EN 71-3 (Schwermetalle in Farben und Papier). Mit den harmonisierten Normen darf der Hersteller das selbst erklären, eine Prüfstelle ist nicht vorgeschrieben – ein Laborbericht ist aber der Beleg. Gute Nachricht: Papier bis 400 g/m² zählt nach EN 71-1 nicht als verschluckbares Kleinteil, die Seiten mit 300 g/m² sind also kein Problem. Zu prüfen bleiben die Metall-Ringbindung (scharfe Enden, lässt sie sich aufbiegen?), eine Folie, die sich ablösen könnte, Ecken und die Druckfarben – die Druckerei nach Erklärungen zu EN 71-3 fragen und ein Labor um ein Angebot für das fertige Stück bitten. Ab 1. August 2030 gilt statt der Richtlinie die Spielzeugverordnung (EU) 2025/2509 mit strengeren Pflichten (nach einer Kanzlei-Zusammenfassung, der Text selbst war nicht abrufbar).",
      "Die Bilder: Was gedruckt verkauft wird, sollte aus den eigenen Bildern der App sein (Gemini), nicht aus Emojis – die Emojis von Apple dürfen nicht verkauft werden, nur offen lizenzierte wie Noto. KI-Bilder sind kaum urheberrechtlich geschützt, Nachahmer können sie übernehmen.",
      "Was die App wirklich anders macht, ist dasselbe Bild auf dem Tablet und auf dem Tisch (die Lücke aus der Recherche „Belohnungstafel“: Bildschirm und Papier genau gleich) – mit Masse und Preis gegen die Magnettafeln anzutreten wäre aussichtslos.",
      "Besser als Klett: Der Tischkalender selbst ist der Plan. Jede Seite ein Schritt (Anziehen, Zähne, Schuhe), das Kind klappt die Seite um, wenn er geschafft ist; oder eine Seite pro Wochentag. Keine losen Teile, keine Handarbeit – die Druckerei liefert fertig, für 0,72 € das Stück bei 250 gleichen. 13 Blatt reichen für ein Deckblatt, 6 Schritte am Morgen und 6 am Abend. Eine Auflage ist ein Inhalt; einzeln mit Namen und eigenen Bildern ginge auch (ab 1 Stück), der Einzelpreis ist noch nicht nachgesehen (Idee T-28). Seine Seiten bis 400 g/m² zählen nicht als Kleinteile; ein Spielzeug für unter drei Jahre ist er trotzdem (siehe unten).",
      "Fazit: Bei 180 € für 250 Kalender ist ein Versuch billig – verloren wären höchstens diese 180 € und die Arbeit am Entwurf. Die Klett-Sets lohnen trotzdem weniger: viel Handarbeit und Kleinteile für Unter-Dreijährige. Der Umklapp-Kalender ohne Klett ist der bessere Versuch: ein Entwurf (Morgen und Abend), 100 bis 250 gleiche, mit Freunden und der eigenen Familie ausprobieren, dann über Etsy, Kleinanzeigen oder die Kita anbieten. Vorher klären: Spielzeug oder nicht (IHK, Händlerbund), Gewerbe, LUCID. Ob es ein Geschäft wird, entscheidet der Verkauf, nicht der Druckpreis.",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "100 Sets auf Vorrat mit Klettpunkten",
        why: "Kleinteile für Unter-Dreijährige und 35 bis 50 Stunden Handarbeit; der Umklapp-Kalender kommt ohne beides aus.",
      },
      { title: "Magnete statt Klett", why: "Verschluckungsgefahr unter drei Jahren, schon in der Recherche „Belohnungstafel“ ausgeschlossen." },
    ],
    ideas: ["T-28"],
    sources: [
      { label: "Saxoprint – Tischkalender", url: "https://www.saxoprint.de/kalender/tischkalender" },
      { label: "selbststaendigkeit.de – Gewerbe anmelden: Kosten", url: "https://selbststaendigkeit.de/gewerbe-anmelden/gewerbe-anmelden-kosten/" },
      { label: "Lizenzero – Verpackungslizenz ab 39 € im Jahr", url: "https://www.lizenzero.de/lizenzkosten/" },
      { label: "JJR Lab – Was ein EN-71-Prüfbericht kostet", url: "https://www.jjrlab.com/news/wie-viel-kostet-ein-en-71-testbericht.html" },
      {
        label: "EU-Kommission – Leitfaden Nr. 9: Bücher als Spielzeug",
        url: "https://webgate.ec.europa.eu/circabc-ewpp/rest/download/9a17b140-1d04-47f5-9fef-658adb872e04",
      },
      { label: "Spielzeugrichtlinie 2009/48/EG, Anhang I (keine Spielzeuge)", url: "https://www.legislation.gov.uk/eudr/2009/48/annex/I" },
      { label: "Franßen & Nusser – Die neue Spielzeugverordnung", url: "https://fn.legal/en/client-information-regulation-on-the-safety-of-toys/" },
      {
        label: "EU-Kommission – Leitfaden zur Abgrenzung von Spielzeug",
        url: "https://ec.europa.eu/docsroom/documents/4624/attachments/1/translations/de/renditions/pdf",
      },
      {
        label: "kita.de – Magnetische Wochenplaner im Vergleich",
        url: "https://www.kita.de/ratgeber/haushalt/buero/bueroartikel/magnetischer-wochenplaner-fuer-kinder/",
      },
      { label: "Action – Magnetischer Wochenplaner", url: "https://www.action.com/de-at/p/3220634/magnetischer-wochenplaner/" },
      { label: "Etsy – Wochenplaner mit Klett und Namen", url: "https://www.etsy.com/listing/4376533776" },
      {
        label: "Händlerbund – Spielzeug rechtssicher verkaufen",
        url: "https://ohn.haendlerbund.de/recht/rechtsfragen/rechtssicher-spielzeug-verkaufen-leitfaden-small-business-haendlerinnen",
      },
      {
        label: "EU-Kommission – Leitfaden Spielzeug unter und über 36 Monaten",
        url: "https://ec.europa.eu/docsroom/documents/5849/attachments/1/translations/de/renditions/pdf",
      },
    ],
  },
  {
    id: "domain-tafel",
    date: "2026-10-31",
    emoji: "🔗",
    title: "Adressen für Belohnungstafel und Tagesplan",
    question:
      "Gibt es noch Domains wie belohnungstafel, wochenplaner oder tagesplan (Deutsch als .de, Englisch als .com), die direkt auf die Tafel und den Plan verlinken könnten – und was bringen sie?",
    method:
      "Rund 50 deutsche Namen bei DENIC (whois.denic.de: „free“ oder „connect“) und rund 50 englische als .com bei Verisign (RDAP: 404 heißt nicht registriert) abgefragt, Stand 31. Oktober 2026; die vergebenen deutschen Kurzformen im Browser aufgerufen. „Frei“ heißt nur: nicht registriert – Premium-Preise zeigt das nicht. Keine Suchvolumen, keine Markenregister.",
    findings: [
      "Die kurzen deutschen Wörter sind vergeben: belohnungstafel.de (eine geparkte Seite bei Sedo, vielleicht zu kaufen, Preis unbekannt), tagesplan.de (bei domainname.de zu verkaufen, Preis nur auf Anfrage), wochenplaner.de und wochenplan.de (Server antwortet nicht), tagesplaner.de, tagesablauf.de, morgenroutine.de, abendroutine.de, wochenplaner-kinder.de, wochenplan-kinder.de, kinderplaner.de.",
      "Frei ohne Bindestrich, also leicht zu sagen: kinderbelohnungstafel.de, kindertagesplan.de, kinderwochenplan.de, kinderwochenplaner.de, kindertagesplaner.de, belohnungskalender.de, belohnungsplan.de, sternetafel.de, strukturtafel.de, belohnungstafeln.de; dazu belohnungstafel.com. Mit Bindestrich ist fast alles frei (belohnungstafel-kinder.de, tagesplan-kinder.de, tagesablauf-kinder.de …), aber am Telefon oder im Gespräch muss man den Bindestrich mitsagen.",
      "Auf Englisch sind die kurzen .com vergeben: rewardchart(s), kidsrewardchart, myrewardchart, rewardchartmaker, stickerchart, starchart, visualschedule(s), pictureschedule, kidsschedule, kidsroutine(s), kidsroutinechart, routinechart, firstthenboard. Frei sind: kidsrewardcharts, rewardchartforkids, kidsstarchart, kidsstickerchart, starchartforkids, kidsvisualschedule, visualscheduleforkids, kidspictureschedule, kidsdailyschedule, kidsweeklyplanner, weeklyplannerforkids, morningroutinechart, bedtimeroutinechart, routinechartforkids.",
      "Bei Google bringt eine solche Domain nichts: Wörter in der Domain sind kein Rankingfaktor (Recherche „Welche Domain?“), und eine Weiterleitung von einer Adresse, auf die niemand verlinkt, gibt nichts weiter. Gefunden wird die Tafel über Titel und Text ihrer Seite auf booksforboth.com, die es auf Deutsch und Englisch schon gibt.",
      "Was sie bringt: eine Adresse, die man sagen, auf einen Zettel schreiben oder in einer Elterngruppe posten kann und die ohne Umweg zur Tafel oder zum Plan führt, nicht erst zum Bücherregal.",
      "Darum nur weiterleiten, keine eigene Seite (anders als T-19): Auf einer eigenen Adresse hätte die Tafel einen eigenen Speicher – Tafeln, Sterne und die installierte App wären dort und auf booksforboth.com getrennt –, und derselbe Inhalt auf zwei Adressen schadet bei Google eher.",
      "Wochenplaner: Der Wochenplan ist in der App eine Ansicht des Tagesplans (Tag/Woche), eine Wochen-Adresse würde also auf /tagesplan/ zeigen.",
      "Umsetzung wie bei funforboth.com (README): Domain zu Cloudflare, Zonendatei tools/redirect-<domain>.zone, Redirect Rule mit festem Ziel, z. B. https://www.funforboth.com/belohnungstafel/ (englisch /en/belohnungstafel/). Eine .de kostet bei INWX und ähnlichen rund 5 € im Jahr, Cloudflare verkauft keine .de, die Nameserver lassen sich aber dorthin stellen; eine .com bei Cloudflare rund 10 $ im Jahr.",
      "Am 30. Oktober 2026 war entschieden: erst einmal eine .com und keine .de, keine Umleitungen (Recherche „Welche Domain?“). Diese Adressen wären eine Ausnahme davon – das entscheidet der Betreiber.",
      "Empfehlung, wenn überhaupt: wenige und ohne Bindestrich – kinderbelohnungstafel.de und kindertagesplan.de, auf Englisch kidsrewardcharts.com und kidsvisualschedule.com (Idee T-27). Nicht kaufen: Mehrzahl, Bindestrich-Varianten und Lobwörter (freerewardchart, printablerewardchart) – sie versprechen etwas, statt den Ort zu nennen, und kein Name mit „toddler“ (wie für alle Adressen der App).",
    ],
    topics: [],
    games: [],
    excluded: [
      {
        title: "Eine eigene Website für die Tafel auf der neuen Adresse",
        why: "Getrennter Speicher (Tafeln und Sterne wären auf zwei Adressen verteilt) und doppelter Inhalt bei Google; eine Weiterleitung leistet dasselbe für Eltern.",
      },
      { title: "Namen mit „toddler“ oder „baby“ (toddlerrewardchart …)", why: "Die Adressen der App nennen kein Alter (Entscheidung 31. Oktober 2026)." },
    ],
    ideas: ["T-27"],
    sources: [
      { label: "DENIC – whois für .de", url: "https://www.denic.de/service/whois-service/" },
      { label: "Verisign RDAP – .com-Abfrage", url: "https://rdap.verisign.com/com/v1/" },
      { label: "Cloudflare – Redirect Rules", url: "https://developers.cloudflare.com/rules/url-forwarding/single-redirects/" },
    ],
    domains: [
      {
        name: "kinderbelohnungstafel",
        rank: 1,
        free: ["de"],
        taken: [],
        why: "Sagt genau, was dort ist, ohne Bindestrich; das Wort, nach dem Eltern suchen, mit „Kinder“ davor. 21 Buchstaben – lang, aber leicht zu buchstabieren.",
      },
      {
        name: "kindertagesplan",
        rank: 1,
        free: ["de"],
        taken: [],
        why: "Kurz und klar, führt zu /tagesplan/, wo auch der Wochenplan und die Morgen- und Abendroutine sind.",
      },
      {
        name: "kidsrewardcharts",
        rank: 1,
        free: ["com"],
        taken: [],
        why: "Die englische Suche „reward chart“ mit „kids“ davor; kidsrewardchart.com (Einzahl) ist vergeben, darum nur zweite Wahl beim Hören.",
      },
      {
        name: "kidsvisualschedule",
        rank: 1,
        free: ["com"],
        taken: [],
        why: "„Visual schedule“ ist der englische Fachbegriff für den Tagesplan in Bildern; führt zu /en/tagesplan/.",
      },
      {
        name: "belohnungstafel",
        rank: 2,
        free: ["com"],
        taken: ["de"],
        why: "Die .de wäre die beste Adresse, ist aber geparkt (Sedo, Preis unbekannt); eine deutsche Wort-Domain auf .com wirkt fremd.",
      },
      {
        name: "tagesplan",
        rank: 2,
        free: [],
        taken: ["de", "com"],
        why: "tagesplan.de steht bei domainname.de zum Verkauf, Preis nur auf Anfrage (nicht nachgefragt).",
      },
      {
        name: "kinderwochenplan",
        rank: 2,
        free: ["de"],
        taken: [],
        why: "Für wen „Wochenplan“ sucht; zeigt aber auf denselben Tagesplan, eine zweite Adresse für dieselbe Seite.",
      },
      {
        name: "kidsweeklyplanner",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Nennt nur die Woche; „planner“ klingt nach Kalender für Große, nicht nach Bildern zum Abtippen (eingeschätzt, nicht nachgesucht).",
      },
      {
        name: "morningroutinechart",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Trifft nur die Morgen-Vorlage; bedtimeroutinechart.com ebenso frei für den Abend.",
      },
      {
        name: "wochenplaner",
        rank: 3,
        free: [],
        taken: ["de"],
        why: "Vergeben, Server antwortet nicht; wochenplaner-kinder.de ist auch vergeben.",
      },
      {
        name: "rewardchart",
        rank: 3,
        free: [],
        taken: ["com"],
        why: "Vergeben, ebenso rewardcharts, myrewardchart, stickerchart und starchart.",
      },
    ],
  },
  {
    id: "domain-kids",
    date: "2026-10-31",
    emoji: "📖",
    title: "Eine Domain ohne „toddler“: kids, Buch, gemeinsam",
    question:
      "Entschieden (31. Oktober 2026): Kein „toddler“ (und kein „toddle“) im Namen – Spiele am Bildschirm ausdrücklich für Kleinkinder anzubieten ist heikel, und der Name soll das nicht ausstellen. Welcher englische .com-Name mit „kids“, dem Buch oder dem gemeinsamen Spielen von Eltern und Kind ist frei und trägt alles, was die App kann?",
    method:
      "Fünfte Runde der Domain-Suche: rund 480 Namen aus „kids“/„kid“, tiny, book, booklet, catalog, pages, story, tales, playbook, together, side by side, for two, for both, lap, big & little, cub, paw, fox als .com bei Verisign abgefragt (RDAP, die Favoriten zusätzlich im Verisign-whois), Stand 31. Oktober 2026. „Frei“ heißt nur: nicht registriert – Premium-Preise zeigt das nicht. Dazu Google-Autovervollständigung auf Englisch (USA) für rund 45 Namen und Websuchen nach gleichnamigen Apps und Marken. Markenregister sind nicht durchsucht.",
    findings: [
      "Fast alles Kurze mit „kids“ ist vergeben: kidsbook, kidbook, kidspages, kidpages, kidstory, kidsstory, kidstales, kidtales, kidsplaybook, kidslibrary, kidsnook, kidsfox, kidfox, foxkids.",
      "Fast alles zum Gemeinsam-Machen auch: readtogether, playtogether, togetherbook, togethertales, readwithme, playwithme, tapwithme, youandmebook, ourbook, ourlittlebook, ourstorybook, familybook, sidebyside, handinhand, bigandlittle, bigandsmall, cuddlebook, snugglebook, cozybook, sofabook, bookbuddies, bookpals.",
      "„Bookforboth“ ist frei und passt am besten: „ein Buch für euch beide“ – Eltern und Kind, und der Buch-Look der App. 11 Buchstaben, nur Wörter aus dem Englischunterricht, kein Wort, das ein Alter nennt. Google kennt den Namen nicht (zu „book for both“ nur Fremdes wie Prüfungsbücher), und keine App heißt so. Haken: Wer es hört, tippt vielleicht „book4both“ (auch frei) – als Weiterleitung billig zu haben.",
      "Ähnlich wie bookforboth (nachgefragt): Mit „for both“ sind fast alle frei – pagesforboth, talesforboth, storiesforboth, funforboth, gamesforboth, playforboth, tapsforboth, booksforboth, bookforbothofus, bookforyouandme, bookforbigandsmall; mit „for two“ nur pagesfortwo, tapsfortwo und storybookfortwo (bookfortwo, playfortwo, storyfortwo, talesfortwo sind vergeben). Am besten passt „pagesforboth“: Seiten zum Umblättern für euch beide, Google ergänzt dazu gar nichts. „Funforboth“ ist mit 10 Buchstaben am kürzesten, und Google ergänzt es zu „fun activities for both kids and adults“ – genau was Eltern suchen –, sagt aber nichts vom Buch und ist kaum als Marke zu schützen. Durchgefallen: playforboth (Fußball, „play for both teams“), pagesfortwo („coloring pages for two year olds“ nennt wieder das Alter), tapsforboth und tapsfortwo (Wasserhähne), twoandabook („Two and a Half Men“), gamesforboth („for both boys and girls“, „PC and mobile“). Wer bookforboth nimmt, sollte booksforboth (auch frei) dazukaufen, weil man die Mehrzahl beim Hören nicht unterscheidet.",
      "„Cubbook“ ist der kürzeste freie Name (7 Buchstaben): „cub“ ist das Tierkind, wie die Fuchs- und Bärenkinder auf dem Umschlag, und das Kind, mit dem gelesen wird. Aber „cub“ kennen Nicht-Muttersprachler kaum, Google macht aus „cub book“ Würfelregale („cube bookshelf“), und in den USA sind „Cubs“ die Pfadfinder und das Baseballteam; beim Hören bleibt offen, ob „cub“, „cup“ oder „club“.",
      "Mit „kids“ und dem Fuchs Tapsi ist kidsfoxbook frei (auch kidfoxbook, foxkidbook, kidsbookfox), aber Google ergänzt „kids fox book“ zur Kinderbuchreihe „Fox Kid“ von Adrian Beck, und „Fox Kids“ war ein bekannter Kinderfernsehsender – zu nah an fremden Namen.",
      "Weitere freie: foxstorybook (12 Buchstaben, Google denkt an „Little Fox“, eine Englisch-Lernplattform für Kinder), tapabook („tap a book“, 8 Buchstaben, frei und unbekannt – sagt aber weder kids noch gemeinsam), biglittlefox (groß und klein zusammen, aber „Big Fox Little Fox“ ist ein Kinderlied), foxfamilybook, playbookfortwo, booksfortwo, readfortwo, twoofusbook, kidsplaypages, kidsbooktime, kidspicturepages.",
      "„Tiny“ mit Buch (nachgefragt): tinybooklet, tinybooklets, tinybook, tinybooks, tinystorybook, tinyplaybook, tinyreads, tinyfolio, tinyalbum, tinycatalog, littlebook und littlebooklet sind vergeben. Frei ist „tinyfoxbook“ (11 Buchstaben): klein, der Fuchs Tapsi und das Buch, und „tiny“ bleibt vom alten Namen „The Tiny Taps“. Google macht daraus „little fox books“ – Buchläden namens Little Fox, nichts für Kinder-Apps. Dazu frei: foxbooklet (Google kennt nur die Hefte des Predigers Emmet Fox), kidsbooklet und kidbooklet (Google denkt an Bastelvorlagen, „kids booklet template“), tapbooklet, wonderbooklet, tinypicturebook (15 Buchstaben).",
      "„Catalog“ mit „kids“ (nachgefragt): kidscatalog, kidcatalog, kidscatalogs und kidscatalogue sind vergeben; frei sind catalogkids, catalogforkids, kidsplaycatalog, kidsgamecatalog und kidsbookcatalog. Davon passt keiner: Google denkt bei „catalog kids“ an Spielzeug- und Kleiderkataloge und Kindermodels, und beim Hören bleibt offen, ob „catalog“ (amerikanisch) oder „catalogue“ (britisch).",
      "Alle Namen mit „lap“ (Schoß – lapandplay, lapandread, lapfriends, lapstories frei; lapbook, laptime vergeben) fallen durch: Google ergänzt „lap“ zu „laptop“, und Nicht-Muttersprachler lesen es auch so.",
      "Schon gekauft und in Betrieb ist toddlerfox.com (30. Oktober 2026, Build und DNS stehen darauf). Ein Wechsel heißt: neue Domain kaufen, SITE_ORIGIN und die Zonendatei umstellen; toddlerfox.com kann ein Jahr lang weiterleiten. Je früher, desto weniger Gespeichertes bleibt bei der alten Adresse zurück.",
      "Gekauft (31. Oktober 2026): funforboth.com bei Cloudflare, nur als Weiterleitung.",
      "Favorit des Betreibers (31. Oktober 2026): booksforboth.com, die Mehrzahl – weil die App viele Bücher sein soll: jede Kategorie ein Buch im Regal, jedes Level eine Seite darin, und die Alltagshilfen ein eigenes Buch (Idee D-20; D-16 bringt den Namen in Titel und Cover). Am 31. Oktober noch frei; bookforboth.com (ebenfalls frei) wäre dann die Weiterleitung für wen es in der Einzahl hört, funforboth.com auch.",
      "Umgestellt (5. November 2026): www.funforboth.com ist jetzt die Hauptadresse und „Fun for Both“ der Name der App (Entscheidung des Betreibers) – Build, Deploy, Datenschutz und DNS (tools/funforboth.com.zone) stehen darauf, booksforboth.com und toddlerfox.com leiten über Cloudflare weiter (tools/redirect-*.zone, README). Was Besucher auf booksforboth.com gespeichert haben (Einstellungen, Tafeln), bleibt dort: der Speicher des Browsers gehört zur Adresse.",
      "Gekauft (31. Oktober 2026): booksforboth.com bei Cloudflare – der neue Name der App, funforboth.com leitet später dorthin weiter. Umgezogen am selben Tag: Build, Deploy, Datenschutz und DNS (tools/booksforboth.com.zone) stehen auf booksforboth.com, toddlerfox.com und funforboth.com leiten über Cloudflare weiter (tools/redirect-*.zone, README). Am selben Tag umbenannt: Titel, Cover, Manifest und Suchmaschinen heißen „Books for Both“ (D-16), die Startseite ist ein Bücherregal (D-20). bookforboth.com (Einzahl) ist noch frei und als Weiterleitung zu empfehlen.",
      "Empfehlung dazu: bookforboth.com (am 31. Oktober noch frei, ebenso booksforboth.com) zusätzlich kaufen und zur Adresse der App machen, funforboth.com leitet dorthin weiter. bookforboth ist eigen und als Marke zu schützen, sagt das Buch, das die App zeigt, und hebt sich von Hunderten „fun“-Seiten ab; dass Google „fun for both“ zu dem ergänzt, was Eltern suchen, bringt der Domain keinen Vorsprung (Wörter in der Domain sind kein Rankingfaktor, Recherche „Domain“) – diese Wörter gehören in Titel und Texte.",
    ],
    topics: [
      {
        emoji: "🔎",
        title: "Google-Autovervollständigung zu den Favoriten",
        searches: ["book for both", "cub book", "kids fox book", "kid fox book", "fox storybook", "fox playbook", "lap and play", "big little fox"],
        ideas: [],
      },
    ],
    games: [],
    excluded: [
      {
        title: "Namen mit „toddler“ oder „toddle“ (toddlerfox, toddlebook, toddlerparadise …)",
        why: "Entschieden (31. Oktober 2026): Bildschirmspiele ausdrücklich für Kleinkinder anzubieten ist heikel – der Name soll das Alter nicht ausstellen. Das Alter steht höchstens in Seitentexten.",
      },
      { title: "Namen mit „baby“", why: "Aus demselben Grund wie „toddler“, nur noch jünger." },
      { title: "Namen mit „lap“ (Schoß)", why: "Google und Nicht-Muttersprachler lesen „laptop“." },
      {
        title: "Fremde Marken im Namen (foxkidsbook, foxplaybook, minimepages)",
        why: "„Fox Kids“ war ein Kindersender, „Fox Playbook“ ist eine App von Fox Sports, „Mini-Me“ eine Filmfigur.",
      },
      { title: "togetherpages, tapstogether, familytaps, foxtaps", why: "Google denkt an PDF-Seiten zusammenfügen, Wasserhähne und Bars." },
    ],
    ideas: ["D-20"],
    sources: [
      { label: "Verisign RDAP – .com-Abfrage", url: "https://rdap.verisign.com/com/v1/" },
      { label: "Wikipedia – Fox Kids", url: "https://en.wikipedia.org/wiki/Fox_Kids" },
      { label: "App Store – An Adventure of Our Own (Eltern und Kind lesen gemeinsam)", url: "https://apps.apple.com/au/app/id1183087354" },
    ],
    domains: [
      {
        name: "booksforboth",
        rank: 1,
        free: [],
        taken: ["com"],
        why: "Gekauft am 31. Oktober 2026, der neue Name. Favorit des Betreibers: viele Bücher für Groß und Klein – jede Kategorie ein Buch, jedes Level eine Seite (D-20). 12 Buchstaben, Google kennt es nicht; bookforboth fängt die Einzahl ab.",
      },
      {
        name: "bookforboth",
        rank: 1,
        free: ["com"],
        taken: [],
        why: "Ein Buch für Eltern und Kind zusammen, passt zum Buch-Look und zu allen Spielen; einfache Wörter, kein Alter, Google und App Stores kennen es nicht.",
      },
      {
        name: "pagesforboth",
        rank: 2,
        free: ["com"],
        taken: [],
        why: "Seiten zum Umblättern für euch beide, wie der Buch-Look; 12 Buchstaben, Google ergänzt nichts, nichts Gleichnamiges.",
      },
      {
        name: "funforboth",
        rank: 2,
        free: [],
        taken: ["com"],
        why: "Gekauft am 31. Oktober 2026. Am kürzesten (10 Buchstaben), und Google ergänzt es zu „fun activities for both kids and adults“; sagt aber nichts vom Buch und ist als Lobwort kaum als Marke zu schützen.",
      },
      {
        name: "talesforboth",
        rank: 2,
        free: ["com"],
        taken: [],
        why: "Geschichten für euch beide, Google kennt es nicht; „tales“ kennen Nicht-Muttersprachler weniger als „book“, und erzählt wird nur in zwei Spielen.",
      },
      {
        name: "cubbook",
        rank: 2,
        free: ["com"],
        taken: [],
        why: "Kurz und eigen, das Tierkind wie auf dem Umschlag – aber „cub“ kennen wenige, es klingt wie „cup“ und „club“, Google denkt an Würfelregale, und die Mehrzahl cubbooks.com ist vergeben.",
      },
      {
        name: "tinyfoxbook",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Klein, der Fuchs und das Buch, jedes Wort bekannt, „tiny“ wie im alten Namen; 11 Buchstaben, Google denkt an Buchläden namens Little Fox. tinybooklet.com ist vergeben.",
      },
      {
        name: "foxbooklet",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Das Heft mit dem Fuchs, 10 Buchstaben, nichts Gleichnamiges für Kinder; „booklet“ klingt aber nach dünnem Prospekt.",
      },
      {
        name: "foxstorybook",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Fuchs Tapsi und das Bilderbuch, jedes Wort bekannt; aber 12 Buchstaben, und erzählt wird nur in zwei Spielen.",
      },
      {
        name: "tapabook",
        rank: 4,
        free: ["com"],
        taken: [],
        why: "„Tap a book“ – ein Buch, das man antippt; 8 Buchstaben, nichts Gleichnamiges, sagt aber nichts vom Gemeinsamen.",
      },
      {
        name: "kidsfoxbook",
        rank: 5,
        free: ["com"],
        taken: [],
        why: "Kids, Fuchs und Buch – aber Google landet bei der Buchreihe „Fox Kid“, und „Fox Kids“ war ein Kindersender.",
      },
      {
        name: "biglittlefox",
        rank: 6,
        free: ["com"],
        taken: [],
        why: "Groß und klein mit dem Fuchs; „Big Fox Little Fox“ ist aber schon ein Kinderlied.",
      },
      {
        name: "playbookfortwo",
        rank: 7,
        free: ["com"],
        taken: [],
        why: "Spielbuch für zwei – 14 Buchstaben, und „playbook“ heißt auf Englisch vor allem Spielzug-Plan.",
      },
      { name: "kidsbooktime", rank: 8, free: ["com"], taken: [], why: "Klar, aber beschreibend und kaum als Marke zu schützen." },
      { name: "kidsbooklet", rank: 8, free: ["com"], taken: [], why: "Frei, aber beschreibend, und Google denkt an Bastel- und Lernheft-Vorlagen." },
      {
        name: "catalogkids",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Die freie Form von kidscatalog (vergeben) – Google denkt an Spielzeug- und Kleiderkataloge, und „catalog“ oder „catalogue“ bleibt beim Hören offen.",
      },
    ],
  },
  {
    id: "leistung-alte-handys",
    date: "2026-10-30",
    emoji: "🐢",
    title: "Laufen die Spiele flüssig auf einem zehn Jahre alten Android-Handy?",
    question:
      "„Zähne putzen“ ruckelte auf Handys. Wie flüssig laufen alle Spiele auf einem etwa zehn Jahre alten Android-Handy (Galaxy S7, Moto G4, 2016), wo hakt es, und wie lässt sich das regelmäßig prüfen?",
    method:
      "Neues Werkzeug `bun run perf` (tools/perf.ts): spielt jedes Spiel im Chrome des Computers ohne Fenster, so wie ein altes Handy es sähe – Prozessor 6-mal langsamer (DevTools „Low-end mobile“), Bildschirm 640×360 mit 3-fach so vielen Pixeln, Berührung statt Maus –, tippt und drückt Tasten wie ein Kind und misst Bilder pro Sekunde, Ruckler (Bilder über 50 ms), wie lange das langsamste Zwanzigstel der Bilder dauert und wie beschäftigt der Hauptfaden ist; mit --profile die Funktionen, die am meisten Zeit kosten. Das ist eine Nachbildung, kein echtes Handy: Die Grafikkarte wird nicht gebremst, WebGL (Bewegungsabenteuer) zeichnet ohne Fenster sogar auf dem Prozessor und wirkt dadurch langsamer als auf einem Handy. Gemessen am 30. Oktober 2026, ein Durchgang je Spiel.",
    findings: [
      "Der größte Fund betraf alle Spiele: Die Version für Spieler enthielt Reacts Entwicklungs-Code (jedes Bild lief durch zusätzliche Prüfungen). Mit dem Produktions-Code ist das JavaScript rund 1 MB kleiner, und z. B. „Zähne putzen“ braucht beim Putzen ein Viertel statt vier Fünftel der Rechenzeit. Ein Test hält das fest.",
      "„Zähne putzen“ ruckelte vor allem, weil die Zahnbürste mit jedem Bild neu gezeichnet und der ganze Spiegel bei jedem Takt neu aufgebaut wurde: vorher 44–46 Bilder pro Sekunde mit bis zu 20 Rucklern in 5 Sekunden, jetzt in allen neun gemessenen Abschnitten 53–60 Bilder pro Sekunde ohne Ruckler.",
      "Innerhalb der Grenzen (höchstens 34 ms fürs langsamste Zwanzigstel, höchstens einen Ruckler alle zwei Sekunden, Hauptfaden höchstens 60 % beschäftigt): Menüs und Umblättern, Buchstaben & Zahlen, Tiere, Lebendige Bilder, Aufs Töpfchen, Sterne & Tagesplan, Schatten, Socken-Paare, Laut & Leise, Kettenreaktion, Kleine Abenteuer.",
      "Knapp: Lebendige Bilder (Flughafen) ist zur Hälfte beschäftigt, fast nur mit Malen – viele kleine Bewegungen in einem großen Bild. Gefühle hatte in einem von zwei Durchgängen 9 kurze Hänger beim Bildwechsel (große Bilder werden entpackt), im zweiten nur einen.",
      "Über der Grenze: Bewegungsabenteuer (three.js) – rund 2 200 Teile der 3D-Welt werden in jedem Bild neu berechnet (Tapsi allein 322), mit 350 Zeichenaufrufen; der Hauptfaden ist zu 70 % beschäftigt.",
      "Bewegungsabenteuer danach (31. Oktober 2026): Requisiten zusammengebacken, nur Bewegtes neu berechnet, die Vögel als ein Schwarm, unsichtbare Schatten weggelassen, Tapsis Arme und Beine als je eine Haut über den Gelenken – 1 013 statt 2 186 Teile, an den Trommeln 396 statt 549 Zeichenaufrufe je Bild, Pixel für Pixel gleiches Bild. Der Anfang ist jetzt zu rund 47 % beschäftigt (innerhalb der Grenze), die leuchtenden Trommeln zu 85–90 %; beide laufen mit 60 Bildern pro Sekunde. Entschieden: Die Trommeln bleiben so und dürfen über 60 % liegen (eigene Grenze in tools/perfScenarios.ts), statt auf langsamen Handys mit 30 Bildern pro Sekunde zu laufen – ein Viertel der gemessenen Zeit ist WebGL auf dem Prozessor, das ein Handy auf seiner Grafikkarte rechnet.",
      "Messung vom 2. November 2026: alle 25 von 25 Abschnitten im Budget, keiner schlechter als in der Woche davor; über dem Budget: keiner; neu als Aufgabe: keine. Besser geworden sind Gefühle (0 statt 8 Ruckler) und Bewegungsabenteuer (51 statt 73 % beschäftigt). Das Menü-Szenario tippt jetzt ein Buch im Regal an statt einer Karte und misst dabei neu das Herausnehmen des Buchs (einmal 3 Ruckler, beim Wiederholen 1 – im Budget).",
      "Prüfung vom 3. November 2026, weil ein Spielehandy bei „Zähne putzen“, der Kugelbahn und beim Herausnehmen eines Buchs ruckelte, während das Werkzeug alles im Budget sah: Das Werkzeug war blind. Es malte nur mit einfachen statt dreifachen Pixeln und zählte die Sekunden, in denen es seine Messdaten einsammelte, als ruhige Zeit mit – Hänger verschwanden im Durchschnitt. Und es maß gar nicht, was die Grafikkarte eines Handys tut: wie viel vom Bildschirm in jeder Sekunde neu gemalt (gerastert) wird. Jetzt malt es mit dreifachen Pixeln, misst nur den Abschnitt selbst und hat eine neue Grenze: höchstens 30 ganze Bildschirme neu gemalt pro Sekunde (ein Spielehandy mit 120 Hz verdoppelt das). Zahlen ab diesem Tag sind darum nicht mit den früheren vergleichbar.",
      "Was das Malen teuer machte: Animationen von Dingen *in* einem SVG (die Monster im Spiegel wiegen sich, ein Leuchten pulsiert über den Zähnen) lassen das Handy das ganze SVG in jedem Bild neu malen – hier fast den ganzen Bildschirm. Und ein Handy malt eine geänderte Ebene in Streifen so breit wie der Bildschirm. Behoben: Die Monster und Pfeile in „Zähne putzen“ sind kleine eigene Ebenen, die sich als Ganzes bewegen; die Zahnbürste ist nur noch so groß wie sie selbst und ändert ihre Form nur an jeder Putzstelle, dazwischen gleitet sie nur; nichts blinzelt mehr im Spiegel. Die Kamera der Kugelbahn und der Maschinen schiebt das ganze Bild als Ebene, statt bei jedem Bild den Bildausschnitt (viewBox) zu ändern. Beim Umblättern schiebt sich der Schatten nicht mehr als Maske über die Seite, und während ein Buch fliegt oder eine Seite sich wendet, lädt nichts anderes nach.",
      "Vorher und nachher auf dem nachgebildeten alten Android: „Zähne putzen“ beim Putzen vorher 64–71 % beschäftigt mit bis zu 6 Rucklern und 38–76 Bildschirmen pro Sekunde, jetzt 41–51 %, keine Ruckler, 37–56 Bildschirme. Umblättern von 45 auf 9 Bildschirme pro Sekunde, Buch herausnehmen von 23 auf 12 (noch ein kurzer Hänger beim Anheben). Die Kugelbahn-Kamera läuft mit 60 Bildern pro Sekunde, 36 % beschäftigt; die große Maschine 25 %.",
      "Gesamtlauf vom 3. November 2026 (neue Messung, tools/perf-history/2026-11-03.json): 18 von 28 Abschnitten im Budget, alle mit 52–60 Bildern pro Sekunde. Über der neuen Malgrenze, ohne zu ruckeln: „Zähne putzen“ in sechs Abschnitten (am meisten, wenn der Kopf sich dreht und der Mund zugeht – dort wird das Gesicht mit Absicht in jedem Bild neu gezeichnet – und am Ende), Buchstaben & Zahlen beim Tippen (47), Socken paaren (37) und die Kugelbahn-Kamera (37). Lebendige Bilder (Flughafen) ist jetzt ehrlich gemessen zu 78 % beschäftigt, fast nur mit Malen. Bewegungsabenteuer bleibt wie entschieden über 60 %.",
      "Messung vom 9. November 2026 (tools/perf-history/2026-11-09.json, 50 Abschnitte, neu dabei die Timer, Zählen, Wörter, Mitmachen, Was gehört zusammen?, Schnullerfee und Abstillen – alle im Budget): 40 von 50 Abschnitten im Budget; über dem Budget nach einer Wiederholung: „Zähne putzen“ beim Putzen und in „Süßes“ (32–47 Bildschirme pro Sekunde neu gemalt), das Herausnehmen eines Buchs aus dem Regal (2 Hänger), Buchstaben & Zahlen beim Tippen (32), Lebendige Bilder am Flughafen (77–90 % beschäftigt) und die Kugelbahn-Kamera (30–42); besser geworden sind Socken paaren (7 statt 37 Bildschirme) und Bewegungsabenteuer (1 statt 5 Ruckler), schlechter keiner. Zwei Gefühle-Abschnitte maßen nicht mehr (ein Link führte weiter, das Pusten-Bild gibt es nicht mehr) und wurden angepasst; neu als Aufgabe: A-25 (Zähne putzen), A-26 (Buch aus dem Regal), A-27 (Buchstaben & Zahlen), A-28 (Lebendige Bilder), A-29 (Kugelbahn).",
      "Leistung und Größe aller Spiele am 10. November 2026 (alle 52 Abschnitte gemessen, dazu die Größe jedes Spiels im Download): 43 von 52 Abschnitten im Budget. Über dem Budget: „Zähne putzen“ beim Kopfdrehen, Mund-Zumachen, in „Süßes“ und am Ende (31–47 Bildschirme pro Sekunde neu gemalt), das Herausnehmen eines Buchs (bis 367 ms Hänger), Lebendige Bilder am Flughafen (91 % beschäftigt, fast nur Malen), die Kugelbahn (44 Bildschirme pro Sekunde) und Bewegungsabenteuer, wenn Tapsi sich bewegt (5 Ruckler). Der größte Brocken beim Herunterladen waren die Lebendigen Bilder: Alle 23 Bilder steckten in einem Stück Code von 1,6 MB (415 KB gepackt), das schon das Menü der Bilder und jedes einzelne Bild erst laden und ausführen musste. Jetzt ist jedes Bild ein eigenes Stück, das erst beim Spielen kommt (das Menü lädt sie in ruhigen Momenten vor): das Menü braucht 10 statt 1 611 KB (5 statt 415 KB gepackt), ein Bild samt Spiel 211–376 statt 1 683 KB (67–106 statt 444 KB gepackt). Danach gemessen: Buch herausnehmen langsamstes Zwanzigstel 33 statt 150 ms, längster Hänger 183 statt 367 ms; Umblättern längster Hänger 83 statt 267 ms (je ein Durchgang). Der Flughafen bleibt mit 84 % beschäftigt über der Grenze – das kostet das Malen im großen SVG, nicht der Code (A-28).",
      "„Zähne putzen“ am 10. November 2026 (A-25, `bun run perf zaehne --profile --shots`, vorher einmal, nachher zweimal gemessen): Vorher waren „Süßes“ (36 Bildschirme pro Sekunde) und das Kopfdrehen (42) über der Malgrenze von 30, das Mund-Zumachen knapp darunter (29, an anderen Tagen 44–47). Zwei Ursachen. Im Spiegel bekam jedes der vier bildschirmgroßen SVG übereinander (Gesicht und Zähne, Leuchten, Lippen, Rahmen und Glas) in jedem Bild der Drehung einen neuen Bildausschnitt und wurde darum ganz neu gemalt. Jetzt ist der Rahmen mit dem Glas in Bildschirm-Pixeln gezeichnet (er bleibt ja stehen), das Leuchten wartet, bis der Kopf stillsteht, und die Lippen mit den wartenden Monstern liegen solange im Gesicht – ein Bildschirm je Bild statt vier; die Sternchen am Ende funkeln als kleine eigene Ebenen. In der Geschichte bewegten sich die Süßigkeiten, Pupillen, Brauen, Wangen, Herzen und der kauende Mund *in* einem bildschirmgroßen SVG; jetzt ist jedes davon eine kleine HTML-Ebene über dem stillen Bild (Piece in origin.tsx), Bild für Bild gleich wie vorher (im Browser neben local main verglichen). Nachher in beiden Durchgängen 9 von 9 Abschnitten im Budget: „Süßes“ 20–21, Kopfdrehen 20–23, Mund zu 23, innen 11–13, Ende 10–11 Bildschirme pro Sekunde. Knapp bleibt, wie beschäftigt der Hauptfaden beim Kopfdrehen ist (52–58 %, Grenze 60 %): Das Gesicht wird dort mit Absicht in jedem Bild neu berechnet (roundedPath, fmt, turn).",
      "Lebendige Bilder danach (A-28, 10. November 2026): Jedes Ding eines Bildes, was ein Tippen auf den Hintergrund hervorbringt, das Überbild und die Zeichen (Tasten, Ring, Schild) liegen jetzt je in einem eigenen SVG genau über dem stillen Hintergrund, statt alle in einem; was gerade spielt, ist dabei eine eigene Ebene der Grafikkarte. So malt das Handy nur das Ding neu, das sich bewegt, nie mehr das ganze Bild. Dasselbe Antippen wie zuvor, je zehn Sekunden: Flughafen vorher 84–96 % beschäftigt mit rund 810 Malvorgängen pro Sekunde, jetzt 43–53 % mit 126–154 (vier Durchgänge, ±5 Punkte Streuung); Wald 91 → 46 %, Küche 80 → 40 %, Stadt 92 → 52 %, Baustelle 66 → 44 %, alle mit 58–60 Bildern pro Sekunde und höchstens 4 statt bis 22 Bildschirmen pro Sekunde neu gemalt. Ausprobiert und verworfen: jedes Ding in einem SVG nur so groß wie es selbst (54–62 %, schlechter) und die Ebenen ohne eigene Ebene der Grafikkarte (ähnlich beschäftigt, aber 12–13 statt 3 Bildschirme pro Sekunde gerastert). Beim großen Tanz am Ende bekommen die Dinge keine eigenen Ebenen, damit nicht Dutzende auf einmal Speicher brauchen. Noch nicht gemessen: Antippen des Hintergrunds – ein Windstoß wiegt Bäume und Wolken im Hintergrund-SVG und lässt es so gut eine Sekunde lang ganz neu malen.",
      "Buch aus dem Regal nehmen (A-26, 10. November 2026), untersucht mit dem neuen `bun run perf --trace`, das Chromes Aufzeichnung jedes Abschnitts für das Performance-Fenster der DevTools speichert (mit `--trace` auch, welche Regel welches Element neu berechnen lässt): Vorher 2–4 Hänger von bis zu 367 ms in den ersten 0,4 s, das Umblättern danach malte 42–47 Bildschirme pro Sekunde neu, weil die Arbeit vom Herausnehmen hineinreichte. Drei Ursachen: (1) Alles Schwere geschah, während das Buch schon flog – die Kopie des Zimmers, das Abdrucken der neuen Seite auf die linke Buchseite, das Laden. Jetzt kommt es vorher, solange das Buch noch in seiner Lücke steht und sich auf dem Bildschirm nichts ändert: die Kopie des Zimmers im selben Bild, in dem die neue Seite das Zimmer ersetzt (unsichtbare Texte wie die für Suchmaschinen, 40 % des Zimmers, kommen nicht mit), dann der Abdruck, und erst dann hebt sich das Buch mit seinem Geräusch; die Animationen entstehen erst beim Losfliegen (pausierte Animationen ließen Chrome zwischendurch in falscher Größe rastern). Zwei andere Reihenfolgen (Kopie ein Bild vor dem Seitenwechsel, oder Kopie und Seitenwechsel sofort im Tipp) waren gemessen schlechter. (2) CSS-Regeln mit einem Attribut in `:has()` (`:has([aria-label=…])` in der Kugelbahn, `:has(.pl-ring-step[data-edit=…])` in der Belohnungstafel) und (3) eine Regel mit `*` hinter `:has()` (`.pl-wrow:has(…) > *`): Bei ihnen kann Chrome nicht wissen, welche Elemente betroffen sind, und berechnet bei jedem eingefügten Element die ganze Seite neu – auch auf dem Regal, weil es den Code aller Spiele und damit ihr CSS vorlädt. In einer Testseite kostete jedes Einfügen damit 56–73 statt unter 1 ms. Ersetzt durch Klassen und `data-level`; css.test.ts verbietet beides. Nebenbei: Die Kugelbahn-Regeln hingen am deutschen Namen der Bahn und galten in den anderen sechs Sprachen gar nicht. Nachher (Produktions-Build, acht Durchgänge): Buch herausnehmen in 7 von 8 Durchgängen im Budget mit einem Hänger von 67–100 ms – dem Bild, in dem die neue Seite das Zimmer ersetzt, bevor sich das Buch bewegt –, einmal 2; 14–19 statt 19–21 % beschäftigt; Umblättern in 8 von 8 im Budget, 8–11 statt 42–47 Bildschirme pro Sekunde.",
    ],
    topics: [],
    games: [],
    excluded: [],
    ideas: ["A-28"],
    sources: [],
  },
  {
    id: "seo-pruefung",
    date: "2026-10-30",
    emoji: "🔎",
    title: "SEO-Prüfung: Was Google von toddlerfox.com sieht",
    question: "Passen Seitentitel, Beschreibungen, Sitemap, robots.txt und Ladezeit? Sollten die Spiele Meta-Keywords oder Beschreibungen bekommen?",
    method:
      "Die gebaute Seite (bun run build) Datei für Datei angesehen: Kopf jeder Seite, sitemap.xml, robots.txt, Größe der Dateien, die eine Seite vor dem ersten Bild lädt. Dann /zaehne/ im Browser mit englischer Browsersprache geöffnet und angesehen, was nach dem Start der App im Dokument steht – das ist, was Google aufnimmt. Gemessen ohne Drosselung auf dem eigenen Rechner; PageSpeed Insights ließ sich nicht starten (die API ohne Schlüssel war für den Tag aufgebraucht, pagespeed.web.dev im Browser gesperrt). Echte Werte für Handys gibt erst PageSpeed Insights oder die Search Console.",
    findings: [
      "Die Grundlage stimmt: Jede Spiel-, Kategorie- und Wimmelbildseite (40) hat eine eigene index.html mit Titel, Beschreibung, canonical-Link und Vorschau-Tags, alle stehen in der sitemap.xml, und content.test.ts prüft Länge und Einmaligkeit der Texte.",
      'Größter Fehler (behoben): Google liest die Seite, nachdem die App gelaufen ist, und zwar mit einem englischen Browser. Die App sprach darum Englisch: Titel „Brushing Teeth – The Tiny Taps“, <html lang="en">, englische Knöpfe – aber deutsche Beschreibung und deutsche Adresse. Jetzt spielen Suchmaschinen (Googlebot, Bingbot und andere, isCrawler in src/lib/locale.ts) auf Deutsch, der Sprache der gebauten Seiten. Spielerinnen und Spieler sind nicht betroffen.',
      "Zweitgrößter Punkt (umgesetzt, A-21): Der Text aus seo.ts und die Links zu den anderen Spielen stehen nur in der gebauten HTML-Datei. Sobald die App startet, ersetzt sie ihn – auf /zaehne/ bleiben danach vier Wörter („Zähne putzen“, „Los geht’s!“) und zwei Links. Google nimmt die Seite nach dem Start auf und findet darum kaum Text, an dem es sie einordnen kann. Die Links findet Google zwar noch im HTML, der Text zählt aber kaum. Jetzt steht er auf jedem Menü und Startbildschirm unter der ersten Bildschirmseite auf einem hellen Feld (SeoText), in der Sprache der App, wo es ihn gibt (Deutsch, Englisch). Spiele, die gleich losgehen (ein Wimmelbild, Aufs Töpfchen), haben keinen Platz dafür: Dort bleibt der Text nur in der gebauten Seite.",
      'Meta-Keywords nicht einsetzen: Google wertet <meta name="keywords"> seit 2009 gar nicht aus, Bing hat 2011 gesagt, ein vollgestopftes Keywords-Feld sehe es eher als Zeichen für Spam. Die gesuchten Wörter gehören in Titel, Beschreibung und sichtbaren Text – das macht seo.ts schon.',
      "Beschreibungen gibt es schon für jede Seite (80 bis 160 Zeichen, nach dem, was Eltern suchen). Google zeigt sie oft, schreibt sie aber auch selbst um, wenn die Seite zu wenig Text hat – noch ein Grund für A-21.",
      "robots.txt (behoben): Impressum und Datenschutz waren per Disallow gesperrt. So kann Google das noindex nicht lesen, und eine gesperrte, aber verlinkte Seite (das Impressum ist von der Startseite verlinkt) erscheint trotzdem als nackte Adresse in den Ergebnissen. Dazu kamen sie über 404.html mit Fehlercode 404. Jetzt hat jede dieser Seiten eine eigene index.html mit noindex, und robots.txt sperrt nichts mehr.",
      "Sitemap (behoben): Jede Adresse trug als <lastmod> das Baudatum, bei jedem Deploy neu. Google nutzt lastmod nur, wo es verlässlich stimmt, und lernt sonst, es zu übergehen. Es fällt weg, bis es ein echtes Datum pro Seite gibt.",
      "Vorschaubild (behoben): Wer einen Link per WhatsApp oder Messenger teilt, sah das kleine App-Symbol. Jetzt zeigt die Vorschau einen Ausschnitt des Buch-Covers (Fuchs- und Bärenfamilie, 1200 × 630, public/images/vorschau.jpg) als großes Bild.",
      "Seitenname (behoben): Die Startseite sagt Google jetzt mit WebSite-Daten, wie die Seite heißt. Der Name war noch „The Tiny Taps“, die Adresse toddlerfox.com – in den Ergebnissen passte das nicht zusammen, und „TinyTap“ ist die Marke einer anderen Kinder-App (Recherche „Domain“). Seit 31. Oktober 2026 heißen Name (SITE_NAME in seo.ts) und Adresse gleich: Books for Both, booksforboth.com.",
      "Ladezeit: Vor dem ersten Bild lädt eine Seite rund 250 KB (gepackt): das Programm 133 KB und 42 KB, kleine Teile, und das Stylesheet 62 KB, das das Bild aufhält. Fast die Hälfte des Stylesheets ist die Schrift Fredoka, als Text eingebettet – darunter eine hebräische Schrift (12 KB), die keine Sprache der App braucht. Umgesetzt (A-23): Nur die lateinischen Teile werden eingebettet (src/styles/font.css), das Stylesheet ist jetzt 53 statt 62 KB groß. Das Spiel selbst (z. B. Zähne putzen 105 KB + 17 KB) kommt danach. Die Hintergrundmusik (2,4 MB) lädt erst nach dem Laden der Seite und hält das erste Bild nicht auf.",
      "Für den Betreiber zu tun (nicht im Code): toddlerfox.com in der Google Search Console als Domain bestätigen (TXT-Eintrag bei Cloudflare), die Sitemap https://toddlerfox.com/sitemap.xml einreichen und mit „URL-Prüfung“ für /zaehne/ ansehen, was Google nach dem Rendern sieht; Bing Webmaster Tools kann die Search Console übernehmen. PageSpeed Insights für / und /zaehne/ auf dem Handy laufen lassen.",
      "Seiten auf Englisch (umgesetzt, A-22): Die Adresse ist englisch, die App spricht sieben Sprachen, aber Google fand nur deutsche Seiten. Jetzt hat jede der 40 Seiten eine englische Fassung unter /en/ (/en/zaehne/), mit Titeln nach dem, was englische Eltern suchen („toddler games“, „games for 2 year olds“, „free, no ads, offline“, „look-and-find“ für Wimmelbild, „visual schedule“ für Tagesplan), hreflang-Verweisen zwischen beiden und Englisch als Standard für alle anderen Sprachen (x-default). Die Sitemap hat 80 Adressen. Wer über /en/ kommt, spielt trotzdem in der Sprache seines Browsers; nur Suchmaschinen spielen in der Sprache der Adresse.",
    ],
    topics: [],
    games: [],
    excluded: [
      { title: "Meta-Keywords", why: "Google liest sie seit 2009 nicht, Bing sieht darin eher Spam. Die Wörter gehören in Titel, Beschreibung und Text." },
      {
        title: "Inhalt nur für Google (versteckter Text, eigene Seite für Bots)",
        why: "Google wertet Text ab, den Menschen nicht sehen, und eine andere Seite für Bots als für Menschen ist Cloaking. Suchmaschinen bekommen dieselbe deutsche Seite wie deutsche Eltern.",
      },
    ],
    ideas: ["A-21", "A-22", "A-23"],
    sources: [
      {
        label: "Google Search Central – Google nutzt das Keywords-Meta-Tag nicht (2009)",
        url: "https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag",
      },
      {
        label: "Google Search Central – Grundlagen zu JavaScript und SEO",
        url: "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics",
      },
      {
        label: "Google Search Central – Sprachabhängige Seiten (Googlebot und Browsersprache)",
        url: "https://developers.google.com/search/docs/specialty/international/locale-adaptive-pages",
      },
      {
        label: "Google Search Central – Seiten mit noindex aus der Suche halten",
        url: "https://developers.google.com/search/docs/crawling-indexing/block-indexing",
      },
      {
        label: "Google Search Central – Sitemaps erstellen (lastmod)",
        url: "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap",
      },
      { label: "Google Search Central – Websitenamen in der Suche", url: "https://developers.google.com/search/docs/appearance/site-names" },
    ],
  },
  {
    id: "domain",
    date: "2026-10-30",
    emoji: "🌐",
    title: "Welche Domain? Ein englischer Name auf .com",
    question:
      "Entschieden (30. Oktober 2026): Erst einmal gibt es genau eine Domain, eine .com mit englischem Namen – keine .de und keine Umleitungen. Der Name soll für alles stehen, nicht für einen Teil. Welcher englische Name passt zu allem, was die App kann (Wimmelbilder, Bewegungsabenteuer mit dem Fuchs Tapsi, Gefühle, Kettenreaktion, Zuordnen, Buchstaben und Zahlen, Zähne putzen, Töpfchen, Belohnungstafel, Tagesplan, Laut und leise – offline, ohne Werbung, Abo und Konto, in sieben Sprachen), hilft bei Google, bleibt Eltern im Kopf und ist als .com noch frei?",
    method:
      "Vier Runden am selben Tag: erst rund 80, dann rund 170 weitere, dann rund 170 allgemeine Namen für kleine Kinder, zuletzt – nachdem die App wie ein Bilderbuch aussieht – rund 230 Namen rund ums Buch (book, pages, story, tales, verse, shelf, library, chapters) als .com bei Verisign abgefragt (RDAP, die Favoriten zusätzlich im Verisign-whois), Stand 30. Oktober 2026. „Frei“ heißt nur: nicht registriert – Premium-Preise zeigt das nicht, und frei ist es nur, bis jemand anderes kauft. Dazu Google-Autovervollständigung auf Englisch (USA) und Deutsch und rund 20 Websuchen nach gleichnamigen Apps, Spielen und Marken sowie nach Googles Aussagen über Domains. Markenregister (USPTO, EUIPO, DPMA) sind nicht durchsucht – das steht vor dem Kauf noch aus. Eine erste Runde am 29. Oktober empfahl tapsiland.de; sie ist durch die Entscheidung für eine englische .com ersetzt.",
    findings: [
      "Eine .com passt zur App: Sie spricht sieben Sprachen, und .com gilt bei Google als Adresse ohne Land, also für alle gleich. Eine .de würde bei Google auf Deutschland zielen.",
      "Wörter in der Domain bringen bei Google keinen Vorsprung: John Mueller (Google) sagt seit 2011 immer wieder, eine Keyword-Domain sei kein Rankingfaktor; das EMD-Update 2012 hat dünne Keyword-Domains sogar abgewertet. Was zählt, sind die Seiten selbst und Erwähnungen – ein Name, den Eltern sich merken und wieder eintippen, baut genau das auf.",
      "Englische Eltern suchen genau das, was die App anders macht: „toddler games online free“, „toddler games for 2 year olds“, „toddler apps that work offline“, „toddler apps without subscription“, „toddler apps without in app purchases“, „toddler apps that are actually free“. Diese Wörter gehören in Seitentitel und Texte, nicht in die Domain.",
      "Fast jeder kurze englische Name rund um Kleinkind und Tippen ist als .com vergeben: taptots, tapling(s), tinytappers, littletaps, toddlerplay, toddlergames, toddlertaps, tappytots, toddleland, toddletown und viele mehr.",
      "„Toddlefox“ ist frei und passte nach drei Runden am besten: „to toddle“ ist im Englischen genau das tapsige Laufen von Zweijährigen (daher „toddler“), und der Fuchs ist Tapsi, der durch Bewegungsabenteuer, Zähne putzen und Töpfchen führt – Tapsi kann so heißen bleiben. 9 Buchstaben, ohne Bindestrich, man schreibt es, wie man es hört; keine App und kein Spiel trägt den Namen.",
      "Zwei Haken bei Toddlefox: Wer „toddler fox“ sucht, landet bei Kinderkleidung der Motocross-Marke Fox Racing, und „Toddle“ heißt eine Lernplattform für Schulen (toddleapp.com). Beides ist eine andere Welt.",
      "„Tapsi“ ist kein englisches Wort: Englisch ergänzt Google es zu „tapsilog“ (ein philippinisches Frühstück) und „Taapsee Pannu“ (eine indische Schauspielerin – gerade für Hindi verwirrend). Darum Tapsi im Spiel, aber nicht in der Adresse.",
      "„Tappy“ ist schon ein Fuchs: Tapps Games hat eine Reihe von Kinderspielen um den Fuchs Tappy („Tappy Escape“, „Run Tappy Run“). tappyfox.com ist zwar frei, wäre aber eine Verwechslung.",
      "Zweite Runde: Kurze Kunstwörter (tappo, tapino, tapsu, foxi, toddo, boopi …) sind als .com alle vergeben; frei sind fast nur Zusammensetzungen aus zwei Wörtern.",
      "Toddlefox bleibt vorn: Auch die zweite Runde fand kein Produkt mit dem Namen. Füchse sind bei Kinder-Apps aber beliebt (das Studio Fox & Sheep, „Foxie“, „Tim the Fox“, „Little Fox“) – unterscheidbar macht ihn erst „toddle“.",
      "Neu dahinter: toddlehop.com (Kleinkinder hüpfen, passt zum Bewegungsabenteuer; nichts Gleichnamiges, Google denkt nur an Hüpfspielzeug) und foxlets.com (kleine Füchse, nur 7 Buchstaben; nichts Gleichnamiges, aber lesbar als „fox lets“, und die Verkleinerung „-let“ kennen Nicht-Muttersprachler kaum).",
      "In der zweiten Runde ausgeschieden: tiptapfox (Tipitap macht schon Kinder-Apps, und auf Deutsch ist „Tip Tap“ ein bekannter Kanal mit Tiervideos für Babys), giggletaps (es gibt die App GiggleTap), hoppyfox (ein Pub und ein Spiel), wigglefox (zu nah an der Kinderband The Wiggles), boopland (Google denkt an Betty Boop), tappyden (wieder der Fuchs Tappy), toddleden (liest sich „toddled en“), pitterfox („pitter-patter“ kennen Nicht-Muttersprachler nicht).",
      "Dritte Runde: Der Name muss für alles stehen, was die App kann – Spiele, Zähne putzen, Töpfchen, Belohnungstafel, Tagesplan, Gefühle –, nicht für eine Tätigkeit. toddlehop (nur Bewegung) und toddlegames (Belohnungstafel und Tagesplan sind keine Spiele) fallen darum heraus. Toddlefox besteht: Er nennt nur das Alter und den Fuchs.",
      "Allgemein und frei sind vor allem „toddle“ + ein Wort: toddlestar (Sterne sammelt das Kind beim Zähneputzen, auf dem Töpfchen und auf der Belohnungstafel, und „little star“ kennt jeder), toddlehome, toddleville, toddlegarden, toddlesmile. toddledays, tinydays, littleones, tinyworld, tinytown und fast alle Wörter mit tiny, little und tot davor sind vergeben.",
      "Was Google aus „toddle“ + Wort macht, entscheidet mit: toddlespot wird zu Hautflecken bei Kleinkindern („toddler spots“), toddlepals zu „toddler palsy“ (Zerebralparese), toddlenook zu einem Kinderbett namens Toddler Nook, „toddle home“ zur Anmeldeseite der Schulplattform Toddle; „tiny fox den“ führt zu Kitas und Zahnärzten namens Little Fox Den, „tot room“ zu „toy room“.",
      "„Toddle“ benutzen schon mehrere: die Schulplattform Toddle, die australische Kita-Suche toddle.com.au, das Musikprogramm Toddle Tunes und die Familien-App ToddleBop. Das betrifft jeden Namen mit „toddle“ – die Markensuche nach „Toddle“ in Klasse 41 zählt darum für alle Favoriten.",
      "Vierte Runde, das Buch: Seit die App wie ein Bilderbuch aussieht, das Eltern und Kind zusammen lesen (A-20), hat der Name ein Bild, das wirklich alles umfasst – in ein Buch passen Spiele, Zähne putzen, Töpfchen, Tafel und Tagesplan, und „book“ versteht man in allen sieben Sprachen. Der Umschlag zeigt Fuchs- und Bärenfamilie; „fox“ nennt nur eine davon.",
      "Das r fällt durch den Radio-Test: Wer „toddle“ hört, schreibt „toddler“ – das ist beim Besprechen der Favoriten selbst passiert (toddlerbook statt toddlebook). Darum zählt, ob auch die Form mit r frei ist. toddlerbook.com gehört seit 2007 jemand anderem, toddlerbooks.com steht bei HugeDomains für rund 7.600 $ zum Verkauf, toddlerpages, toddlerstory und toddlerstar sind vergeben. Frei in beiden Formen sind nur toddlefox/toddlerfox, toddlehome/toddlerhome und toddleshelf/toddlershelf.",
      "Darum heißt der Name besser gleich „toddler“: Das Verb „to toddle“ kennen nur wenige, auch Muttersprachler schreiben „toddler“. Frei mit „toddler“ sind vor allem toddlerfox, toddlerhome, toddlershelf, toddlerforest, toddlerhug, toddlerpaws, toddlercubs, toddlerstorybook, toddlerlibrary; bei fast allen denkt Google an Kinderkleidung und Fanartikel (toddler cubs: Chicago Cubs, toddler burrow: Joe Burrow, toddler island: Stühle, toddler forest: Waldkita). toddlerstorybook wäre das Buch, aber 16 Buchstaben, und die Mehrzahl toddlerstorybooks.com ist vergeben. Toddlerfox bleibt: kurz, beide Wörter bekannt, das Tier der App.",
      "Orte nach „toddler“ (paradise, castle, treehouse, oasis, hideaway, meadow): Mit und ohne s frei sind toddler(s)paradise, -castle, -treehouse, -meadow, -forest, -oasis, -hideaway und -hollow; vergeben sind wonderland, kingdom, world, land, planet, galaxy, haven, heaven, playland, corner, den, nest und universe. Solche Namen sind lang (toddlersparadise: 16 Buchstaben), beim Hören bleibt offen, ob mit s, und sie klingen wie Kitas und Spielplätze: Google ergänzt „toddlers paradise“ zu „nursery school“, und der Spielplatzbauer Kompan verkauft ein Spielplatzkonzept „Toddler’s Paradise“; castle, treehouse und hideaway werden zu Kinderbetten, oasis zu T-Shirts der Band. Ein allgemeines Lobwort ist zudem kaum als Marke zu schützen.",
      "„Toddlebook“ ist frei und passt zum Buch-Look am besten: „das Buch für Kleinkinder“, 10 Buchstaben, keine App und kein Buch trägt den Namen. Google ergänzt „toddle book“ zu „toddler books“, „toddler book subscription“ und „toddler books about feelings“ – genau Eltern, die für ihr Kleinkind etwas Gutes suchen. Der Haken ist derselbe wie bei jedem „toddle“-Namen: die Schulplattform Toddle.",
      "Gleich dahinter: toddlepages (Seiten zum Umblättern; Google denkt an Ausmalbilder, „toddler pages to color“) und toddlestory (Google denkt an Vorlesestunden in der Bücherei, „toddler story time“). Beide frei, nichts Gleichnamiges, aber 11 Buchstaben, und eine Geschichte erzählen nur Kleine Abenteuer und Bewegungsabenteuer.",
      "„Toddlerverse“ ist als .com vergeben (dahinter antwortet eine Website), „toddleverse“ auch, und ein Mastodon-Nutzer entwirft unter „Toddlerverse“ gerade einen werbefreien Online-Raum für Kleinkinder – fast dieselbe Idee. Frei sind nur thetoddlerverse, toddlerverses und toddleverses: „the“ wird beim Tippen vergessen, die Mehrzahl hört man nicht. Dazu heißt „-verse“ vor allem Universum (Metaverse, Spider-Verse) und passt eher zu Welten als zum Buch; den Doppelsinn „Vers“ hören Nicht-Muttersprachler kaum.",
      "„Toddler Book Collection“ ist als Adresse zu lang (21 Buchstaben, toddlerbookcollection.com wäre frei), sagt aber gut, was die App ist: als Untertitel im Seitentitel und auf dem Umschlag, nicht in der Domain.",
      "Rund ums Buch ist fast alles Kurze vergeben: toddletales, toddlertales, tinytales, foxtales, storytots, toddlerbook, toddlerstories, toddlerbookclub, tinybookclub, tinypages, littlepages (bei HugeDomains für rund 7.900 $ zu haben), tapbook, foxbook, bookfox, wonderbook, toddlerpedia.",
      "In der vierten Runde ausgeschieden: storytoddler (Google macht daraus „Toddlers & Tiaras“), toddlerhymes (liest sich „toddler hymes“, und „toddler rhymes“ sind Kinderlieder-Videos auf YouTube), booktots (klingt wie BookTok), toddlefable (Fable heißen schon zwei Geschichten-Apps für Kinder, und „fable“ kennen Nicht-Muttersprachler wenig), laptales (liest sich wie „laptop“), tapsitales (Tapsi ist kein Englisch).",
      "Der jetzige Name ist inzwischen mehrfach besetzt: Seit April 2026 gibt es im App Store „Tiny Taps Baby“, ein werbefreies Tipp-Spiel für Kleinkinder, unter tinytaps.pages.dev eine Seite „TinyTaps“ und dazu die App „Little Taps“ – das trifft auch littletappers.",
      "Der jetzige Name passt schlecht: „TinyTap“ ist eine bekannte Lern-App für Kinder (TinyTap Ltd., seit 2022 bei Animoca Brands) mit eingetragener US-Wortmarke für Software und Bildung (Klassen 9 und 41, seit 2014) – „The Tiny Taps“ liegt einen Buchstaben daneben. thetinytaps.com ist frei, „the“ wird beim Tippen vergessen, und Google ergänzt „tiny taps“ zu einer Bar und zu Zapfanlagen.",
      "Umzug früh machen: Gespeichertes hängt an der Adresse – Einstellungen, Sterne der Belohnungstafel, Spielzeit und die installierte App bleiben bei radiesle.github.io zurück und fangen auf der neuen Domain leer an. Technisch reicht in GitHub Pages die eigene Domain (GitHub leitet die alte Adresse um) und im Bau SITE_ORIGIN mit PUBLIC_BASE_PATH „/“ statt „/<repo>“.",
      "toddlebook.com nachgeprüft: Verisign-whois meldet „No match“, also nicht registriert; toddlebooks.com (die Mehrzahl, falls jemand ein s anhängt) ist auch frei, und .org, .net, .app und .de haben keine Nameserver. Eine Websuche fand kein Produkt und keine Marke „Toddlebook“, nur Bücher, die „Toddler Book“ im Titel tragen. In den USA hat aber die Schulplattform Toddle (Teacher Tools Private Limited) 2024 die Marke „TODDLE“ angemeldet, und „TODDLE DODDLE“ ist für gedruckte Kinderbücher angemeldet – darum vor dem Kauf im Register nachsehen, ob „Toddle“ allein für Software und Bücher geschützt ist.",
      "Wo kaufen: bei Cloudflare Registrar zum Einkaufspreis ohne Aufschlag (nur was Verisign und ICANN verlangen), Whois-Schutz kostenlos, Bezahlung mit Kreditkarte oder PayPal; die Nameserver liegen dann bei Cloudflare, was für GitHub Pages reicht (Einträge dort nur „DNS only“, ohne Proxy, damit GitHub das HTTPS-Zertifikat ausstellt). Gleich gut und ohne diese Bindung: Porkbun. Nicht bei Anbietern mit billigem ersten Jahr und teurer Verlängerung. Verisign erhöht den .com-Preis am 1. November 2026 von 10,26 auf 10,97 $ im Jahr und plant weitere rund 7 % jährlich.",
      "Was kaufen (Stand 30. Oktober 2026 alles frei): toddlerfox.com als Adresse der App und toddlefox.com, die dorthin weiterleitet (für wen den Namen ohne r gelesen hat). Sinnvoll dazu: toddlerfox.de, weil die App zuerst für deutsche Eltern ist und eine .de wenig kostet – sie leitet nur weiter; Cloudflare verkauft meines Wissens keine .de, Porkbun oder INWX schon. Nicht nötig: Mehrzahl (toddlefoxes), Tippfehler (toddlfox, toddelfox) und .net, .org, .app – die tippt niemand, und vor Nachahmern schützt eine Marke besser als viele Domains.",
      "Am 31. Oktober 2026 verworfen: kein „toddler“ im Namen – die neuen Vorschläge stehen in der Recherche „Eine Domain ohne ‚toddler‘“.",
      "Gekauft (30. Oktober 2026): toddlerfox.com bei Cloudflare. Die App zieht dorthin um – GitHub Pages mit eigener Domain, der Bau ohne Unterordner „/thetinytaps“, die DNS-Einträge in tools/toddlerfox.com.zone.",
      "Vor dem Kauf noch prüfen: Wortmarken „Toddlerfox“, „Toddlefox“, „Toddlebook“ und „Toddle“ bei USPTO, EUIPO und DPMA (Klassen 9, 28, 41), und ob der Name in den App-Stores und sozialen Netzen frei ist.",
    ],
    topics: [
      {
        emoji: "🔎",
        title: "Was englische Eltern suchen (gehört in Titel, nicht in die Domain)",
        searches: [
          "toddler games online free",
          "toddler games for 2 year olds",
          "toddler apps that work offline",
          "toddler apps without subscription",
          "toddler apps without in app purchases",
          "toddler apps that are actually free",
        ],
        ideas: [],
      },
      {
        emoji: "📚",
        title: "Was Google zu den Buch-Namen ergänzt",
        searches: ["toddler books", "toddler book subscription", "toddler books about feelings", "toddler pages to color", "toddler story time"],
        ideas: [],
      },
      {
        emoji: "🏷️",
        title: "Namen, die schon jemand trägt",
        searches: [
          "tinytap",
          "tiny taps baby",
          "toddler spots",
          "toddler palsy",
          "toddler nook",
          "little fox den",
          "tappy fox game",
          "toddler fox",
          "tapsi",
          "toddle app",
          "tip tap baby tiere",
          "hoppy fox game",
          "wiggle fox",
          "betty boop land",
          "toddlerverse",
          "story toddler",
          "toddler rhymes",
        ],
        ideas: [],
      },
    ],
    games: [],
    excluded: [
      { title: "Eine .de oder weitere Endungen", why: "Entschieden: erst einmal eine .com – höchstens die Schreibweise mit r dazu, die nur weiterleitet." },
      { title: "Deutsche Namen (tapsiland, tapsiwelt, kleinkindspiele)", why: "Die App spricht sieben Sprachen; der Name soll auf Englisch funktionieren." },
      {
        title: "Ein Name für nur einen Teil (toddlehop, toddlegames)",
        why: "Der Name soll für alles stehen, was die App kann, nicht nur für Bewegung oder Spiele.",
      },
      {
        title: "Wörter, die Nicht-Muttersprachler kaum kennen (kidlet, bitty, teeny, pitter-patter)",
        why: "Eltern in sieben Sprachen sollen den Namen hören und richtig tippen können.",
      },
      {
        title: "Lange Sammelnamen (toddlerbookcollection, toddlepicturebook)",
        why: "Was die App ist, sagt der Seitentitel; die Adresse muss kurz genug sein, um sie nach einmal Hören zu tippen.",
      },
      { title: "Bindestriche und Zahlen", why: "Fallen beim Vorlesen durch – wer den Namen einmal hört, tippt ihn falsch." },
      { title: "Namen mit „TinyTap“", why: "Fast die Marke einer bekannten Kinder-Lern-App – Verwechslung und Ärger, keine Suchplätze." },
    ],
    ideas: [],
    sources: [
      {
        label: "Google Search Central – Mehrsprachige und regionale Websites",
        url: "https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites",
      },
      {
        label: "Search Engine Roundtable – Keywords in der Domain sind nicht nötig (Mueller)",
        url: "https://www.seroundtable.com/google-keywords-domain-unnecessary-18667.html",
      },
      { label: "Search Engine Journal – Ist der Domainname ein Rankingfaktor?", url: "https://www.searchenginejournal.com/ranking-factors/domain-name/" },
      { label: "Saw.com – Der Radio-Test für Domainnamen", url: "https://saw.com/blog/en/articles/saw-video-the-radio-test" },
      { label: "Trademark-Verzeichnis – TINYTAP (US 85972963)", url: "https://trademarkdir.com/trademark/tinytap-85972963" },
      { label: "App Store – TinyTap: Kids' Learning Games", url: "https://apps.apple.com/DE/app/id493868874" },
      { label: "TouchArcade – Tappy Dig, ein Fuchs-Spiel von Tapps Games", url: "https://toucharcade.com/games/tappy-dig-virtual-pet-fox-game" },
      { label: "Toddle – Lernplattform für Schulen", url: "https://support.toddleapp.com/en/articles/8612269-platforms-supported-by-toddle-for-students" },
      { label: "App Store – Tiny Taps Baby", url: "https://apps.apple.com/app/id6761378690" },
      { label: "App Store – Little Taps", url: "https://apps.apple.com/us/app/id6762163912" },
      { label: "toddle.com.au – Kita-Suche in Australien", url: "https://toddle.com.au/" },
      { label: "App Store – GiggleTap", url: "https://apps.apple.com/sg/app/giggletap/id6757404486" },
      {
        label: "Hackers.pub – Entwurf „Toddlerverse“ eines Mastodon-Nutzers",
        url: "https://hackers.pub/@reiver@mastodon.social/019ab5bb-da03-7c71-ab1e-edd79b4f5f97/quotes",
      },
      { label: "App Store – Fable: Kids' Stories & Reading", url: "https://apps.apple.com/us/app/-/id6469246006" },
      { label: "Trademarkdir – TODDLE (US 98678264, Teacher Tools)", url: "https://trademarkdir.com/trademark/toddle-98678264" },
      { label: "Justia – TODDLE DODDLE (US 99044891, Kinderbücher)", url: "https://trademark.justia.com/990/44/toddle-99044891.html" },
      {
        label: "Domain Name Wire – Verisign erhöht den .com-Preis (August 2026)",
        url: "https://domainnamewire.com/2026/08/27/verisign-announces-net-price-increase/",
      },
      { label: "Porkbun – Warum .com teurer wird", url: "https://kb.porkbun.com/article/201-why-did-com-prices-go-up-and-how-high-will-they-go" },
      { label: "Kompan – Spielplatzkonzept „Toddler’s Paradise“", url: "https://kompan.com/en/us/inspiration/design-ideas/toddlers-paradise" },
    ],
    domains: [
      {
        name: "toddlerfox",
        rank: 1,
        free: ["com", "de"],
        taken: [],
        why: "Zwei Wörter, die jeder Elternteil kennt und so schreibt, wie er sie hört – „toddler“ statt des seltenen „toddle“; nennt das Alter und den Fuchs Tapsi, also passt alles darunter; 10 Buchstaben, kein gleichnamiges Produkt. Google denkt bei „toddler fox“ an Kinderkleidung von Fox Racing, „toddlerfox“ in einem Wort ergänzt es zu nichts.",
      },
      {
        name: "toddlefox",
        rank: 2,
        free: ["com", "de"],
        taken: [],
        why: "Nur als zweite Adresse, die zu toddlerfox weiterleitet, für wen es so geschrieben sah: „toddle“ kennen wenige, fast jeder schreibt „toddler“.",
      },
      {
        name: "toddlebook",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Das Buch für Kleinkinder, passt am besten zum Buch-Look – aber wer es hört, tippt „toddlerbook“, und toddlerbook.com gehört seit 2007 jemand anderem (toddlerbooks.com steht für rund 7.600 $ zum Verkauf).",
      },
      {
        name: "toddlepages",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Seiten zum Umblättern, wie im Buch-Look; nichts Gleichnamiges, aber 11 Buchstaben, und Google denkt bei „toddler pages“ an Ausmalbilder.",
      },
      {
        name: "toddlestory",
        rank: 3,
        free: ["com"],
        taken: [],
        why: "Freundlich und frei, Google ergänzt es zu Vorlesestunden („toddler story time“); aber Geschichten erzählen nur zwei der Spiele.",
      },
      {
        name: "toddlestar",
        rank: 4,
        free: ["com"],
        taken: [],
        why: "Sterne sammelt das Kind überall in der App, und „star“ versteht jeder; 10 Buchstaben, nichts Gleichnamiges. Google macht aus „toddle star“ nur „toddle startup“.",
      },
      {
        name: "toddlehome",
        rank: 5,
        free: ["com"],
        taken: [],
        why: "Das einfachste Wort für „hier ist alles für dich“ – aber „toddle home“ führt bei Google zur Anmeldeseite der Schulplattform Toddle.",
      },
      {
        name: "foxlets",
        rank: 6,
        free: ["com"],
        taken: [],
        why: "Die Kinder sind die kleinen Füchse – allgemein, nur 7 Buchstaben, nichts Gleichnamiges; aber lesbar als „fox lets“, und „-let“ kennen Nicht-Muttersprachler kaum.",
      },
      {
        name: "toddleville",
        rank: 7,
        free: ["com"],
        taken: [],
        why: "Eine kleine Stadt für Kleine, verspielt und allgemein; 11 Buchstaben, und Kitas heißen schon „Toddlerville“.",
      },
      {
        name: "toddleshelf",
        rank: 7,
        free: ["com"],
        taken: [],
        why: "Ein Bücherregal voller Spiele, frei; aber Google denkt bei „toddler bookshelf“ an Möbel (IKEA, Montessori).",
      },
      {
        name: "toddlelibrary",
        rank: 7,
        free: ["com"],
        taken: [],
        why: "Eine ganze Bücherei, frei; aber 13 Buchstaben, und „toddler library“ heißen die Kleinkind-Termine in echten Büchereien.",
      },
      {
        name: "thetoddlerverse",
        rank: 8,
        free: ["com"],
        taken: [],
        why: "Die freie Form von „Toddlerverse“ (vergeben) – aber „the“ wird vergessen, 15 Buchstaben, und „-verse“ meint eher eine Welt als ein Buch.",
      },
      {
        name: "toddlerverses",
        rank: 8,
        free: ["com"],
        taken: [],
        why: "Frei, aber wer „Toddlerverse“ hört, tippt es ohne s und landet bei der vergebenen Adresse.",
      },
      {
        name: "littletappers",
        rank: 8,
        free: ["com"],
        taken: [],
        why: "Sofort klar, aber 13 Buchstaben, „tappers“ heißt auch Stepptanz-Kurse, und es gibt schon die App „Little Taps“.",
      },
      { name: "tappytoddler", rank: 8, free: ["com"], taken: [], why: "Klar und freundlich, aber 12 Buchstaben, und beim Hören unklar, wie viele p und d." },
      { name: "toddlesmile", rank: 9, free: ["com"], taken: [], why: "Freundlich und allgemein, aber 11 Buchstaben und klingt nach Zahnarzt." },
      { name: "toddlegarden", rank: 9, free: ["com"], taken: [], why: "Allgemein, aber 12 Buchstaben, und Google denkt an Gartenspielzeug." },
      {
        name: "toddlerparadise",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Die natürliche englische Form („toddler“ als Bestimmungswort wie in „toddler bed“; mit s nur als „toddlers’ paradise“ mit Apostroph, den eine Domain nicht kennt). Frei, auch mit s (toddlersparadise), jedes Wort bekannt – aber 15 Buchstaben, beim Hören unklar, ob mit s, und Google denkt an Kitas und an Kompans Spielplatz „Toddler’s Paradise“; als Lobwort kaum als Marke zu schützen.",
      },
      {
        name: "toddlertreehouse",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Frei, auch mit s, ein Ort zum Spielen und Lesen – aber 16 Buchstaben, und Google denkt an Kinderbetten und Spieltürme.",
      },
      {
        name: "toddleradise",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Ein Kunstwort aus „toddler“ und „paradise“, die sich das r teilen: frei, eigen, als Marke zu schützen, Google kennt es nicht. Aber „-adise“ ist kein bekannter Baustein wie „-verse“: Wer es hört, weiß nicht, wie man es schreibt (toddlaradise, toddlerparadise – alle frei, man bräuchte mehrere), und Eltern in sieben Sprachen erkennen das Paradies kaum darin.",
      },
      {
        name: "foxbearbook",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Das Buch der Fuchs- und der Bärenfamilie vom Umschlag; frei, aber drei Hauptwörter hintereinander, und wer es hört, tippt leicht „foxandbearbook“.",
      },
      {
        name: "toddlechapters",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Frei und ohne Treffer bei Google, aber 14 Buchstaben, und Kapitel hat ein Kleinkinderbuch nicht.",
      },
      {
        name: "toddlereads",
        rank: 9,
        free: ["com"],
        taken: [],
        why: "Frei, aber das Kind liest nicht selbst, und es liest sich auch „toddler eads“.",
      },
      { name: "toddlehop", rank: 10, free: ["com"], taken: [], why: "Steht nur für Bewegung, nicht für Zähne, Töpfchen, Tafel und Tagesplan." },
      {
        name: "toddlegames",
        rank: 10,
        free: ["com"],
        taken: [],
        why: "Steht nur für Spiele, ohne Vorsprung bei Google, eins von Dutzenden „Toddler Games“, nicht als Marke zu schützen.",
      },
      {
        name: "tapsiland",
        rank: 10,
        free: ["com"],
        taken: [],
        why: "Trägt den Namen des Fuchses, ist aber kein Englisch; Google ergänzt „tapsi“ zu einem philippinischen Gericht und einer indischen Schauspielerin.",
      },
      {
        name: "toddlerbookcollection",
        rank: 10,
        free: ["com"],
        taken: [],
        why: "Sagt genau, was die App ist, aber 21 Buchstaben – gehört als Untertitel in den Seitentitel, nicht in die Adresse.",
      },
      {
        name: "toddler-book",
        rank: 11,
        free: ["com"],
        taken: [],
        why: "Frei (wie toddler-books und toddle-book), aber wer „toddler book“ hört, tippt es ohne Bindestrich und landet auf toddlerbook.com, die jemand anderem gehört; dazu nur ein allgemeiner Ausdruck, den keine Marke schützt.",
      },
      { name: "storytoddler", rank: 11, free: ["com"], taken: [], why: "Frei, aber Google macht aus „story toddler“ die Fernsehshow „Toddlers & Tiaras“." },
      {
        name: "toddlerhymes",
        rank: 11,
        free: ["com"],
        taken: [],
        why: "Frei, aber es liest sich „toddler hymes“, und „toddler rhymes“ sind Kinderlieder-Videos auf YouTube.",
      },
      { name: "booktots", rank: 11, free: ["com"], taken: [], why: "Frei und kurz, aber klingt wie BookTok, und „tot“ kennen Nicht-Muttersprachler kaum." },
      {
        name: "toddlefable",
        rank: 11,
        free: ["com"],
        taken: [],
        why: "Frei, aber „Fable“ heißen schon zwei Geschichten-Apps für Kinder, und „fable“ kennt nicht jeder.",
      },
      { name: "laptales", rank: 11, free: ["com"], taken: [], why: "Geschichten auf dem Schoß – schön, aber man liest „laptop“ heraus." },
      { name: "tapsitales", rank: 11, free: ["com"], taken: [], why: "Frei, aber Tapsi ist kein Englisch, wie bei tapsiland." },
      { name: "toddlespot", rank: 11, free: ["com"], taken: [], why: "Frei, aber Google macht daraus Hautflecken bei Kleinkindern." },
      { name: "toddlepals", rank: 11, free: ["com"], taken: [], why: "Frei, aber Google macht daraus „toddler palsy“." },
      { name: "toddlenook", rank: 11, free: ["com"], taken: [], why: "Frei, aber Toddler Nook ist ein Kinderbett." },
      { name: "tinyfoxden", rank: 11, free: ["com"], taken: [], why: "Frei, aber Little Fox Den heißen Kitas und Zahnärzte." },
      {
        name: "tiptapfox",
        rank: 11,
        free: ["com"],
        taken: [],
        why: "Frei, aber Tipitap macht schon Kinder-Apps, und „Tip Tap“ ist auf Deutsch ein Kanal mit Tiervideos für Babys.",
      },
      { name: "giggletaps", rank: 11, free: ["com"], taken: [], why: "Frei, aber es gibt die App GiggleTap." },
      { name: "hoppyfox", rank: 11, free: ["com"], taken: [], why: "Frei, aber Google kennt „Hoppy Fox“ als Pub und als Spiel." },
      { name: "wigglefox", rank: 11, free: ["com"], taken: [], why: "Frei, aber zu nah an der Kinderband The Wiggles." },
      { name: "boopland", rank: 11, free: ["com"], taken: [], why: "Frei, aber bei „boop“ denkt Google an Betty Boop." },
      { name: "tappyfox", rank: 12, free: ["com"], taken: [], why: "Frei, aber Tappy ist schon der Fuchs in Kinderspielen von Tapps Games." },
      {
        name: "thetinytaps",
        rank: 12,
        free: ["com"],
        taken: [],
        why: "Der jetzige Name, frei – aber nah an TinyTap, und seit 2026 gibt es „Tiny Taps Baby“ und eine Seite „TinyTaps“.",
      },
      { name: "toddledays", rank: 13, free: [], taken: ["com"], why: "Vergeben, wie tinydays, littleones, tinyworld und tinytown." },
      { name: "taptots", rank: 13, free: [], taken: ["com"], why: "Vergeben." },
      { name: "tinytappers", rank: 13, free: [], taken: ["com"], why: "Vergeben." },
      { name: "toddlergames", rank: 13, free: [], taken: ["com"], why: "Vergeben." },
      { name: "toddlerplay", rank: 13, free: [], taken: ["com"], why: "Vergeben." },
      { name: "foxcub", rank: 13, free: [], taken: ["com"], why: "Vergeben, wie fast alle kurzen Fuchs-Namen (tinyfox, foxling, kitfox)." },
      { name: "tinytaps", rank: 13, free: [], taken: ["com"], why: "Vergeben, und noch näher an TinyTap." },
      {
        name: "toddlerverse",
        rank: 13,
        free: [],
        taken: ["com"],
        why: "Vergeben (dahinter antwortet eine Website), wie toddleverse, tinyverse und foxverse; unter dem Namen entwirft jemand einen werbefreien Online-Raum für Kleinkinder.",
      },
      {
        name: "toddleruniverse",
        rank: 13,
        free: [],
        taken: ["com"],
        why: "Seit 2011 vergeben, dahinter antwortet eine Website; toddlersuniverse.com auch. Frei wären nur Umwege (toddleuniverse, thetoddleruniverse), und Google denkt an „Steven Universe“ und Freizeitparks.",
      },
      { name: "toddletales", rank: 13, free: [], taken: ["com"], why: "Vergeben, wie toddlertales, tinytales und foxtales." },
      { name: "toddlerbook", rank: 13, free: [], taken: ["com"], why: "Vergeben, wie toddlerstories, toddlerbookclub und tinypages." },
      { name: "storytots", rank: 13, free: [], taken: ["com"], why: "Vergeben." },
      {
        name: "littlepages",
        rank: 13,
        free: [],
        taken: ["com"],
        why: "Seit 2003 vergeben, steht aber bei HugeDomains zum Verkauf (die Seite nennt rund 7.900 $). Sagt nichts über das Alter, Google denkt an ein Möbelgeschäft in Baltimore, und „Little Pages“ heißen schon Ausmal- und Geschichtenbücher zum Ausdrucken. toddlepages ist frei und sagt mehr.",
      },
    ],
  },
  {
    id: "tagesplan",
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
  },
  {
    id: "belohnungstafel",
    date: "2026-10-28",
    emoji: "🌟",
    title: "Belohnungstafel – was Eltern brauchen",
    question:
      "Was erwarten Eltern von einer Wochen- oder Tagestafel für Zwei- und Dreijährige, was bieten Vorlagen, Magnettafeln und Apps, und was raten Fachleute – auch dagegen?",
    method:
      "Rund 17 Websuchen (Deutsch und Englisch: Vorlagen zum Ausdrucken, Magnettafeln, Belohnungs-Apps, Ratgeber, Kritik) und 12 gelesene Seiten von Elternmagazinen, Herstellern, App-Seiten und einem Psychologie-Lexikon. Keine Zahlen zum Suchvolumen und keine Befragung: was „häufig“ heißt, ist aus den Angeboten gezählt, nicht gemessen.",
    findings: [
      "Fast alle Tafeln sind eins von wenigen Mustern: Wochenraster (Aufgaben × Tage), N Sterne sammeln (meist 5 oder 10), ein Weg oder Zug zum Ziel, Morgen- und Abendstreifen, ein Glas zum Füllen.",
      "Üblich sind ein Feld für den Namen, ein Thema zum Auswählen und ein Kästchen oder Menü für die Belohnung; wiederverwendbar heißt magnetisch, abwischbar oder laminiert.",
      "Magnettafeln haben kleine Teile – für Unter-Dreijährige eine Verschluckungsgefahr.",
      "Apps zielen auf Kinder ab vier, meist mit Konto, Abo oder Werbung; für Zweijährige zum selbst Tippen gibt es kaum etwas.",
      "Ratgeber für Kleine: ein bis drei klare Aufgaben, eine davon leicht; der Stern sofort, die Belohnung bald (täglich oder nach etwa fünf Sternen) – eine ganze Woche ist zu lang; Bilder statt Wörter; das Kind klebt selbst.",
      "Nie Sterne wegnehmen, nie strafen; als Belohnung am besten gemeinsame Zeit, und die Tafel nach einer Weile ausklingen lassen.",
      "Kritik: Belohnungen können lenken statt verbinden (Juul) und eigene Freude verdrängen (Überrechtfertigungs-Effekt, Lepper, Greene und Nisbett 1973); Lob für Mühe statt Können (Dweck); für Grundbedürfnisse wie Töpfchen raten manche ganz ab.",
      "Lücken, die kein gefundenes Angebot füllt: Ausmalen statt Aufkleber, ein tintensparender Schwarz-weiß-Druck, Bildschirm und Papier genau gleich, und eine Tafel, auf der ein Zweijähriger seinen Stern selbst antippt.",
      "Monatstafeln werden gesucht (Google-Autovervollständigung, 28. Oktober 2026): „belohnungskalender kinder (zum ausdrucken)“, „belohnungskalender toilette“, „monthly reward chart printable“, „monthly sticker reward chart“ – auf Deutsch eher als Kalender als als „belohnungstafel monat“. Tag und Woche: „daily reward chart“, „tagesplan kinder“, „belohnungstafel kinder wochenplan“. Darum bleiben Tag, Woche und Monat die drei Ansichten.",
    ],
    topics: [
      {
        emoji: "🖨️",
        title: "Zum Ausdrucken, selbst gestaltet",
        searches: [
          "belohnungstafel zum ausdrucken",
          "belohnungstafel kinder pdf kostenlos",
          "belohnungstafel selbst gestalten",
          "wochenplan kinder zum ausdrucken",
          "reward chart printable toddler",
        ],
        ideas: ["T-04", "T-05", "T-06", "T-07", "T-08", "T-20", "T-24", "T-25"],
      },
      {
        emoji: "⭐",
        title: "Für die Kleinsten: schnell und selbst",
        searches: ["belohnungssystem kinder 2 jahre", "belohnungstafel kleinkind", "sticker chart toddler", "belohnungssystem kinder 3 jahre"],
        ideas: ["T-02", "T-03", "T-09", "T-14"],
      },
      {
        emoji: "📅",
        title: "Wochen- und Tagesroutine",
        searches: [
          "belohnungstafel woche",
          "belohnungskalender kinder",
          "monthly reward chart",
          "morgenroutine kinder bilder",
          "abendroutine kinder bilder",
          "routine chart toddler",
        ],
        ideas: ["T-01", "T-03", "T-17", "T-18", "T-22", "T-26"],
      },
      {
        emoji: "🪥",
        title: "Zähne putzen und Töpfchen",
        searches: ["belohnungstafel zähneputzen", "belohnungstafel töpfchen", "töpfchentraining belohnung", "potty training reward chart"],
        ideas: ["T-10", "T-23", "H-06"],
      },
      {
        emoji: "🌱",
        title: "Belohnung, die verbindet – und das Ende",
        searches: ["belohnungssystem kinder sinnvoll", "belohnungssystem kinder kritik", "belohnung ohne süßigkeiten kinder", "belohnungssystem beenden"],
        ideas: ["T-14", "T-15", "T-16"],
      },
    ],
    games: [
      {
        href: "/belohnungstafel/",
        searches: ["belohnungstafel zum ausdrucken", "belohnungstafel kinder", "belohnungstafel selbst gestalten"],
        title: "Belohnungstafel für Kinder – gestalten und drucken",
      },
      { href: "/zaehne/", searches: ["belohnungstafel zähneputzen", "zähneputzen kinder motivieren"], title: "Zähne putzen mit Tapsi – Lied und Sternentafel" },
    ],
    excluded: [
      { title: "Sterne abziehen oder Strafen", why: "Ratgeber raten klar davon ab; auf der Tafel kann ein Stern nur kurz nach einem Vertippen zurück." },
      { title: "Bildschirmzeit als Belohnung", why: "Passt nicht zu Kleinkindern und nicht zur Spielzeit-Grenze der App (T-21 abgelehnt)." },
      { title: "Süßigkeiten als Standard", why: "Ein Eis steht als letzte Wahl im Katalog; vorne stehen gemeinsame Zeit und Erlebnisse." },
      { title: "Konto, Cloud oder Abo", why: "Alles bleibt auf dem Gerät; der Name des Kindes verlässt den Browser nie." },
      { title: "Magnet-Teile zum Nachbauen", why: "Verschluckungsgefahr unter drei Jahren; der Ausdruck nimmt Ausmalen oder Papier-Sterne mit Klebestift." },
    ],
    ideas: ["H-01", "H-02", "T-12", "T-13", "T-19"],
    sources: [
      {
        label: "familie.de – Belohnungssystem für Kinder: 10 Tipps",
        url: "https://www.familie.de/schulkind/entwicklung-beziehung/belohnungssystem-fuer-kinder-10-tipps-wie-es-funktioniert/",
      },
      {
        label: "familie.de – Belohnungstafel im Test",
        url: "https://www.familie.de/testberichte/belohnungstafel-fuer-kinder-so-funktioniert-das-belohnungssystem--01HDR410GMVDREKD2X7ETVDR75",
      },
      { label: "kita.de – Belohnungssysteme für Kinder", url: "https://www.kita.de/wissen/belohnungssysteme-fuer-kinder/" },
      {
        label: "babyartikel.de – Töpfchentraining mit Belohnung? Lieber nicht",
        url: "https://www.babyartikel.de/magazin/toepfchentraining-mit-belohnung-lieber-nicht%EF%BB%BF",
      },
      { label: "Help Kids Thrive – Seven tips for making a sticker chart", url: "https://helpkidsthrive.substack.com/p/seven-tips-for-making-a-sticker-chart" },
      { label: "Happiest Baby – Reward charts for kids", url: "https://www.happiestbaby.com/blogs/toddler/reward-charts-kids" },
      { label: "Melissa & Doug – Magnetic Responsibility Chart", url: "https://www.melissaanddoug.com/products/magnetic-responsibility-chart" },
      { label: "Joon – Reward ideas for kids", url: "https://joonapp.io/post/10-fun-and-creative-reward-ideas-for-kids" },
      { label: "PottyWhiz – Töpfchen-Belohnungstafel zum Ausdrucken", url: "https://pottywhiz.app/tools/free-printable-potty-training-reward-chart?locale=de" },
      {
        label: "Spektrum Lexikon der Psychologie – Rechtfertigung, übermäßige",
        url: "https://www.spektrum.de/lexikon/psychologie/rechtfertigung-uebermaessige/12591",
      },
    ],
  },
  {
    id: "toepfchen-oder-hygiene",
    date: "2026-10-26",
    emoji: "🚽",
    title: "Töpfchen oder Hygiene – was wird mehr gesucht?",
    question: "Suchen Eltern bei Google mehr zu „Töpfchen und trocken werden“ oder zu „Hygiene, die das Kind nicht mag“ (Hände, Haare, Nase, Baden)?",
    method:
      "Google Trends war gesperrt (Firmen-Richtlinie im Browser), Zahlen zum Suchvolumen fanden sich im Netz nicht. Stattdessen Google-Autovervollständigung (Deutschland, Deutsch): zehn Eltern-Anfänge wie „kind will nicht“, „kleinkind will nicht“, „kind verweigert“, „kind hasst“, „kind 3 jahre“, je ohne und mit einem Buchstaben a–ü (rund 300 Abfragen), dann die Vorschläge je Thema gezählt; Fremdes wie „trockener husten“ oder „kaut fingernägel“ nicht mitgezählt. Mehr verschiedene und frühere Vorschläge heißen mehr Suchen – ein deutliches Zeichen, aber keine Zahl.",
    findings: [
      "Töpfchen und trocken werden liegt klar vorn: etwa 73 verschiedene Vorschläge gegen etwa 39 für Hygiene, also rund doppelt so viele.",
      "Bei „kleinkind will nicht “ ohne einen Buchstaben schlägt Google schon „aufs töpfchen“ und „auf toilette“ vor, keine Hygiene; bei „kind verweigert “ zweimal Stuhlgang.",
      "Hygiene erscheint ohne Buchstaben nur einmal: „kind hasst haare waschen“ (Platz 4).",
      "Innerhalb der Hygiene führen Baden und Duschen, dann Haare waschen; Hände waschen und Nase putzen kommen seltener.",
      "Eltern suchen beim Töpfchen vor allem das Verweigern: groß machen, Angst vor der Toilette, plötzlich nicht mehr, Windel nicht hergeben.",
    ],
    topics: [
      {
        emoji: "🚽",
        title: "Töpfchen und trocken werden",
        searches: [
          "kleinkind will nicht aufs töpfchen",
          "kind will nicht groß aufs klo",
          "kind angst vor toilette",
          "kleinkind will plötzlich nicht mehr aufs töpfchen",
          "kind will nicht trocken werden",
        ],
        ideas: ["H-06"],
      },
      {
        emoji: "🧼",
        title: "Hygiene, die das Kind nicht mag",
        searches: [
          "kind hasst haare waschen",
          "kind will nicht baden",
          "kind will nicht duschen",
          "kind will nicht hände waschen",
          "kind will nicht nase putzen",
        ],
        ideas: ["H-14", "H-07", "H-08"],
      },
    ],
    games: [],
    excluded: [{ title: "Stuhlgang-Farbe und Verstopfung", why: "Wird oft vorgeschlagen („grüner stuhlgang“), ist aber medizinischer Rat." }],
    ideas: [],
    sources: [],
  },
  {
    id: "google-eltern",
    date: "2026-10-26",
    emoji: "🔍",
    title: "Was Eltern von Kleinkindern bei Google suchen",
    question:
      "Welche Themen und Suchbegriffe von Eltern passen zur App – für neue Spiele, für Werkzeuge für Eltern (z. B. eine Belohnungstafel) und damit Eltern die App finden?",
    method:
      "Google-Autovervollständigung (Deutschland, Deutsch) für rund 70 Anfänge wie „kind will nicht“, „belohnungstafel“, „töpfchen“, „zähne putzen kind“. Sie zeigt, was viele tatsächlich eintippen, aber keine Zahlen; die Reihenfolge der Themen ist eine Einschätzung. Echte Suchvolumen bräuchten den Google Keyword Planner oder ein SEO-Werkzeug.",
    findings: [
      "Google kennt wohl nur die Startseite: Jede Spielseite kommt über 404.html mit Fehlercode 404, und alle Seiten haben denselben Titel und dieselbe Beschreibung (A-19).",
      "Vieles, was Eltern suchen, gibt es schon: Zähne putzen, Bewegungsspiele für drinnen, Tiergeräusche, Gefühle, Lernspiele ab 2.",
      "„zum ausdrucken pdf kostenlos“ hängt an fast jedem Alltags-Thema: Belohnungstafel, Abendroutine, Wochenplan, Schnullerfee-Brief (H-02).",
      "Die großen Alltags-Themen mit zwei bis drei: Routinen, Belohnung, Töpfchen, Warten, Wut, Abschied in der Kita, Schnuller, Geschwisterchen, Arzt.",
      "„kostenlos, ohne Werbung, offline, ab 2“ ist ein Vorteil, den Eltern sogar mitsuchen („einschlafmusik baby ohne werbung“).",
      "Belohnungssysteme sind umstritten (z. B. Jesper Juul). Darum heißt Belohnung hier Mitfreuen: keine Strafen, nichts geht verloren.",
    ],
    topics: [
      {
        emoji: "🌟",
        title: "Belohnung",
        searches: ["belohnungstafel kinder zum ausdrucken pdf kostenlos", "belohnungssystem kinder 3 jahre", "belohnungstafel app"],
        ideas: ["H-01"],
      },
      {
        emoji: "🖨️",
        title: "Zum Ausdrucken",
        searches: ["abendroutine kinder vorlage pdf", "wochenplan kinder symbole zum ausdrucken kostenlos", "schnullerfee brief zum ausdrucken kostenlos"],
        ideas: ["H-02"],
      },
      {
        emoji: "🛁",
        title: "Routinen und Tagesablauf",
        searches: ["abendroutine kinder bilder zum ausdrucken", "tagesablauf kleinkind 2 jahre", "kind will nicht schlafen"],
        ideas: ["H-03"],
      },
      {
        emoji: "⏳",
        title: "Warten und Zeit",
        searches: ["visueller timer kinder online", "sanduhr kinder", "countdown kinder geburtstag", "countdown kindergartenstart"],
        ideas: ["H-04", "H-05"],
      },
      {
        emoji: "🚽",
        title: "Töpfchen und trocken werden",
        searches: ["töpfchen lied", "töpfchen app", "töpfchen mit applaus", "töpfchentraining ab wann", "belohnungssystem kinder toilette"],
        ideas: ["H-06"],
      },
      {
        emoji: "🧼",
        title: "Hygiene, die das Kind nicht mag",
        searches: ["kind verweigert hände waschen", "nase putzen kinder lernen", "kind haare waschen drama"],
        ideas: ["H-07", "H-08", "H-14"],
      },
      {
        emoji: "🎈",
        title: "Wut und Beruhigen",
        searches: ["wutanfall kleinkind 2 jahre", "kind beruhigen bei wutanfall", "atemübungen kinder wut"],
        ideas: ["H-09"],
      },
      {
        emoji: "👋",
        title: "Kita und Abschied",
        searches: ["kita eingewöhnung 2 jährige", "kind weint beim abschied kita", "kind will nicht in den kindergarten"],
        ideas: ["H-10"],
      },
      {
        emoji: "🧚",
        title: "Große Umbrüche",
        searches: ["schnullerfee brief pdf", "kind 2 jahre schnuller abgewöhnen", "geschwisterchen bekommen buch", "kind angst arzt", "kind impfung angst"],
        ideas: ["H-11", "H-12", "H-13"],
      },
      {
        emoji: "🌡️",
        title: "Kleidung nach Temperatur",
        searches: ["kind anziehen 20 grad", "kind anziehen nachts 22 grad", "kind schlafen 22 grad"],
        ideas: ["H-15"],
      },
      {
        emoji: "✈️",
        title: "Unterwegs",
        searches: ["beschäftigung kleinkind flugzeug", "beschäftigung kleinkind auto", "spiele für 2 jährige im flugzeug"],
        ideas: ["H-16"],
      },
      {
        emoji: "🚒",
        title: "Zahnputzlieder",
        searches: ["zahnputzlied feuerwehr", "zahnputzlied krokodil", "zahnputzlied kinder 3 minuten"],
        ideas: ["X-13", "X-01"],
      },
    ],
    games: [
      {
        href: "/zaehne/",
        searches: ["zähne putzen kinder app", "zahnputzlied kinder", "timer kinder zähneputzen"],
        title: "Zähneputzen für Kinder – Zahnputzlied mit Timer",
      },
      {
        href: "/abenteuer/",
        searches: ["bewegungsspiele kleinkinder drinnen", "bewegungsspiele kleinkind 2 jahre", "kinderlieder zum tanzen"],
        title: "Bewegungsspiele für Kleinkinder drinnen",
      },
      { href: "/tiere/", searches: ["tiergeräusche für kinder", "tiergeräusche anhören"], title: "Tiergeräusche für Kinder – Was gehört zum Tier?" },
      { href: "/bilder/", searches: ["tiergeräusche für kinder", "lernspiele für 2 jährige"], title: "Wimmelbilder zum Antippen für Kinder ab 2" },
      { href: "/gefuehle/", searches: ["gefühle kinder erklären", "gefühle kinder material"], title: "Gefühle Kindern erklären – Spiel ab 2" },
      { href: "/buchstaben/", searches: ["zahlen lernen kinder", "kinder lern app ab 2 jahre"], title: "Buchstaben und Zahlen lernen ab 2" },
      { href: "/socken/", searches: ["lernspiele für 2 jährige", "spiele für 2 jährige"], title: "Socken-Paare – erstes Zuordnen ab 2" },
    ],
    excluded: [
      {
        title: "Krankheit (Fieber, Durchfall, Erbrechen)",
        why: "Steht bei „kleinkind …“ ganz oben, ist aber medizinischer Rat und passt nicht zur App.",
      },
      { title: "Aufräumen", why: "„aufräumlied“ wird oft gesucht, das Spiel Aufräumen (N-28) ist aber abgelehnt." },
      { title: "Anziehen fürs Wetter als Spiel", why: "Das Spiel (N-16) ist abgelehnt; H-15 ist nur ein Werkzeug für Eltern." },
    ],
    ideas: ["A-19"],
    sources: [
      {
        label: "familie.de: Belohnungstafel für Kinder",
        url: "https://www.familie.de/testberichte/belohnungstafel-fuer-kinder-so-funktioniert-das-belohnungssystem--01HDR410GMVDREKD2X7ETVDR75",
      },
      { label: "VocoVision: Most Googled Parenting Questions (USA)", url: "https://www.vocovision.com/blog/the-most-googled-parenting-questions-in-america/" },
      { label: "Motherly: Top parenting Google searches 2024 (USA)", url: "https://mother.ly/parenting/top-parenting-google-searches-2024/" },
      { label: "Baby Chick: Top googled parenting questions (USA)", url: "https://www.baby-chick.com/top-googled-parenting-questions/" },
    ],
  },
];
