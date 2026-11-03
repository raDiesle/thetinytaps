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
    ],
    topics: [],
    games: [],
    excluded: [
      { title: "Traktor und Feuerwehr, Auto und Traktor", why: "Ähnlich kastig, aber das große Hinterrad und die Leiter unterscheiden sie deutlich." },
      { title: "Eule und Pinguin", why: "Farbig und als Schatten gut zu unterscheiden: der Pinguin steht schmal mit Schnabel zur Seite." },
      { title: "Erdbeere und Haus", why: "Der Umrissvergleich hielt sie für am ähnlichsten, das Dach unterscheidet sie aber auf den ersten Blick." },
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
      "Umsetzung wie bei funforboth.com (README): Domain zu Cloudflare, Zonendatei tools/redirect-<domain>.zone, Redirect Rule mit festem Ziel, z. B. https://booksforboth.com/belohnungstafel/ (englisch /en/belohnungstafel/). Eine .de kostet bei INWX und ähnlichen rund 5 € im Jahr, Cloudflare verkauft keine .de, die Nameserver lassen sich aber dorthin stellen; eine .com bei Cloudflare rund 10 $ im Jahr.",
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
    ],
    topics: [],
    games: [],
    excluded: [],
    ideas: [],
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
