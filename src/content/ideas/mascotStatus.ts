import type { Effort } from "./types";

// Where the app's two mascots, the fox and the bear, could still turn up (D-18), game by game, shown
// on the management page like the language table. Not every game needs them: they are a motif that
// comes back, not a fox in every corner – and only where it belongs to the game (user feedback, November 2026): a figure
// the game shows and that does something in it, or a role the picture already has; never decoration standing by
// (a family watching, pointing, walking through a picture, cheering at the end), which children want to tap and which
// only adds things to look at. Such tasks are kept as "removed", so nobody builds them again. The motif is always a grown-up with a child (Mama, Papa, Oma or
// Opa with the fox or bear child), since grown-up and child look at the book together: the child does the
// thing, the grown-up is beside it. Only a fox or bear in a role (the baker) stands alone. A drawing is code and can be done any time; a picture from
// Gemini waits here until the grown-up asks for them, and then all waiting ones are made in one batch,
// which costs less than one by one. Kept by hand: when a game gets its fox or bear, mark the task here
// in the same commit; a new game or picture adds its row or task. content.test.ts checks the rows
// against the home menu.

/** How a fox or bear gets in: drawn in code (SVG), or a picture made with Gemini (`bun run image`, waits for a batch). */
export type MascotWork = "drawing" | "picture";

/** One change that brings the fox or the bear into a game. */
export interface MascotTask {
  /** What changes, in German for the grown-up: "Bäckerin wird Füchsin oder Bärin". */
  label: string;
  work: MascotWork;
  effort: Effort;
  /** For a picture: how many Gemini pictures it needs (with second frames), so the batch's size shows. */
  pictures?: number;
  /** The idea it belongs to, when it has its own (else D-18). */
  idea?: string;
  /** Already in the app; "partial" when only some of it is; "removed" when it was only decoration and was taken out. */
  state?: "done" | "partial" | "removed";
  /** What is special or still to decide. */
  note?: string;
}

/** One game (or the home page and book) and its mascot tasks. */
export interface MascotStatusRow {
  /** The game's address in the home menu (games.ts), or "/" for the home page, cover and menus. */
  href: string;
  /** What foxes and bears are there already, or why few fit. */
  note?: string;
  tasks: MascotTask[];
}

/** Every game of the home menu once, in menu order, then the home page. */
export const MASCOT_STATUS: MascotStatusRow[] = [
  {
    href: "/zaehne/",
    note: "SVG. Das Gesicht im Spiegel ist das Kind und bleibt; die Stimme ist schon Tapsi.",
    tasks: [
      {
        label: "Tapsi putzt klein in der Ecke mit, Mama, Papa, Oma oder Opa Fuchs putzt nach",
        work: "drawing",
        effort: "M",
        state: "removed",
        note: "Nicht bauen (Feedback November 2026): nur Deko neben dem Spiegel.",
      },
      {
        label: "Tapsi und sein Großer jubeln bei Medaille und Wochenplan",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/toepfchen/",
    note: "Hier kommt Tapsi her: Gemini-Bilder mit Tapsi, Mama und Papa Fuchs – die Vorlage für alle anderen Füchse (für Bären: buch-baeren.webp).",
    tasks: [{ label: "Tapsi und Familie in allen Bildern", work: "picture", pictures: 126, effort: "L", state: "done" }],
  },
  {
    href: "/belohnungstafel/",
    note: "Gemini-Bilder mit Tapsi, Mama, Papa und Oma Fuchs; die Ärztin ist ein Bär, Freunde sind Hase und Bär – Fuchs und Bär sind schon beide da.",
    tasks: [{ label: "Tapsi und Familie in den Aufgabenbildern", work: "picture", pictures: 130, effort: "L", state: "done" }],
  },
  {
    href: "/timer/",
    note: "SVG. Ein Fuchs- oder Bärenkind nur, wo es selbst etwas tut: beim Apfelbaum hält das Bärenkind den Korb, bei der Blume gießt es, bei der Kerze pustet es sie aus, beim Abwechseln wandert das Spielzeug zwischen Fuchskind und Bärenkind (`Child`).",
    tasks: [
      { label: "Fuchs- oder Bärenkind, wo es im Bild etwas tut (Korb, Gießkanne, Kerze, Abwechseln)", work: "drawing", effort: "S", state: "done" },
      {
        label: "Fuchs- oder Bärenfamilie steht in jedem Bild daneben und winkt am Ende",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/schnullerfee/",
    note: "SVG. Tapsi und Mama Fuchs im Kinderzimmer; die Schnullerfee ist eine kleine Bärin mit Flügeln – Fuchs und Bär sind beide da.",
    tasks: [{ label: "Tapsi, Mama Fuchs und die Bärenfee in der Geschichte", work: "drawing", effort: "M", state: "done" }],
  },
  {
    href: "/abstillen/",
    note: "SVG. Tapsi mit Mama Fuchs durch die ganze Geschichte, am Morgen jubelt Papa Fuchs mit; ein Teddybär liegt im Bett und steht im Regal.",
    tasks: [{ label: "Tapsi, Mama und Papa Fuchs in allen Bildern", work: "drawing", effort: "M", state: "done" }],
  },
  {
    href: "/bilder/",
    note: "Alles SVG. Viele Menschen: Fahrer, Erzieherin, Ärztin, Feuerwehr, Pilotin, Kassiererin, Bäckerin, Förster, Bauer, Mama, Papa, Oma, Opa. Fuchs und Bär gibt es als Tiere im Wald und im Winter, als Fahrer und Erwachsene in Rollen und als Überraschung im Versteck.",
    tasks: [
      {
        label: "Fahrer, Mitfahrer und Pilotinnen werden Füchse oder Bären",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "Rider in scenes/shared.tsx hat einen Fuchs- und einen Bärenkopf (`animal`, mit Mütze klein zwischen den Ohren). 24 der 33 Fahrer und Mitfahrer sind jetzt Füchse oder Bären, einige Menschen bleiben; im Stadtbus sitzt ein Bär mit seinem Kind, im Flughafenbus und im Reisebus Fuchs und Fuchskind (`child`).",
      },
      {
        label: "Fuchs- oder Bärenkind schaut aus den Verstecken, Mama, Papa, Oma oder Opa gleich dahinter",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "Familie Fuchs und Familie Bär sind zwei der Überraschungen in hideout.tsx (neben Katze, Maus, Hase …), also in jeder Szene mit Versteck: das Kind vorn mit den Pfoten am Rand, Mama Fuchs oder Papa Bär größer dahinter. „Da ist ja Familie Fuchs!“ gibt es erst auf Deutsch.",
      },
      {
        label: "Einige Erwachsene werden Füchse oder Bären: Erzieherin, Ärztin, Feuerwehr, Kassiererin, Bäckerin, Tierpfleger, Förster, Bauer …",
        work: "drawing",
        effort: "L",
        state: "done",
        note: "Mit `MascotFace` (scenes/shared.tsx), dem geteilten Kopf an Stelle eines Menschenkopfs: im Supermarkt ist die Bäckerin eine Bärin mit Kochmütze und die Kassiererin eine Füchsin mit Schleife am Ohr, in der Kita liest eine Füchsin mit runder Brille vor, beim Kinderarzt ist die Ärztin eine Bärin mit Brille (wie in der Belohnungstafel), im Wald die Försterin eine Bärin (der wilde Fuchs bleibt ein Fuchs), in der Feuerwache der Feuerwehrmann mit der Pfeife ein Fuchs unter dem Helm (die Feuerwehrfrau bleibt ein Mensch), im Zoo die Tierpflegerin eine Füchsin, auf dem Bauernhof der Bauer ein Bär (ein Fuchs bei den Hühnern wäre der falsche), am Flughafen die Pilotin eine Bärin mit Mütze zwischen den Ohren und der Schaffner am Bahnsteig ein Fuchs mit roter Mütze, auf dem Spielplatz der Eismann ein Fuchs mit Papierhut (6. November 2026). Menschen bleiben mit Absicht: der Einweiser, der Verkäufer auf der Leiter, die Feuerwehrfrau, Mama, Papa, Oma und Opa neben Menschenkindern; die Kinder bleiben Kinder.",
      },
      {
        label: "Ein Fuchs- oder Bärenkind mit Mama, Papa, Oma oder Opa in jeder Szene (Hand in Hand, auf den Schultern, auf der Bank daneben)",
        work: "drawing",
        effort: "M",
        state: "removed",
        note: "`WalkingFamily` (scenes/family.tsx): Großer und Kind Hand in Hand, flach wie die Menschen der Bilder, mit dem geteilten Kopf; ein Ding des Hintergrunds, das beim Antippen hüpft, ohne Worte (so verliert kein Bild seine Übersetzungen). In der Stadt Papa Bär auf dem Gehweg, am Strand Mama Fuchs in Badesachen, auf dem Spielplatz Opa Bär hinten bei der Bank, im Herbst Mama Fuchs auf dem Sandweg, im Winter Papa Bär auf dem Eis (Bären, weil dort der wilde Fuchs läuft), zu Ostern Mama Fuchs gleich hinter dem Gartentor, und in der Kita kommt Papa Bär draußen im Garten hinter dem Zaun zum Abholen (im Fenster, 6. November 2026). Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel; ein Ding mehr im Wimmelbild.",
      },
    ],
  },
  {
    href: "/kettenreaktion/",
    note: "SVG. Aus dem Tunnel schauen 🦊 und 🐻 auf der Kugelbahn und der Baustellenbahn, 🦊 und 🐻‍❄️ auf der Schneebahn; Bagger, Walze und Kran fahren ein Fuchs und zwei Bären, und die Zirkuspuppe ist ein Fuchs im Clownskostüm.",
    tasks: [
      {
        label: "🦊 statt 👷 auf der Baustellenbahn, 🦊 bei den Gucker-Tieren jeder Bahn",
        work: "drawing",
        effort: "S",
        state: "partial",
        note: "Kugelbahn, Baustellen- und Schneebahn haben Fuchs und Bär; Weltraum (Außerirdische) und Wasserrutsche (Wassertiere) bleiben bei ihren Tieren.",
      },
      {
        label: "Fahrer der Baumaschinen werden Füchse oder Bären",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "CabDriver in scenery.tsx, auch für weitere Fahrzeuge.",
      },
      { label: "Die Clownpuppe im Zirkus wird eine Fuchs- oder Bärenpuppe", work: "drawing", effort: "S", state: "done" },
    ],
  },
  {
    href: "/kleine-abenteuer/",
    note: "SVG. Das Kind (Junge / Mädchen) bleibt, bis D-19 entschieden ist.",
    tasks: [
      {
        label: "Feuerwehr, Nachbarin, Bewohner und Fahrer im Feuerwehr-Film werden Füchse oder Bären",
        work: "drawing",
        effort: "M",
        state: "done",
        note: "`animal` im Look (kid.tsx) gibt einem Großen den geteilten Kopf und Pfoten: die Crew ist ein Fuchs und eine Bärin, die Nachbarin mit der Katze eine Füchsin, der Bewohner ein Bär. Der Fahrer im Graben bleibt ein Mensch – Menschen dürfen bleiben.",
      },
      {
        label: "Mama oder Papa, die Briefträgerin und Oma im Brief-Film werden Füchse oder Bären",
        work: "drawing",
        effort: "S",
        state: "partial",
        note: "Die Briefträgerin ist eine Bärin. Mama oder Papa und Oma sind die Familie des Kindes, das ein Mensch bleibt: sie warten auf D-19 (ein Menschenkind mit Fuchs-Mama passt nicht).",
      },
      {
        label: "Der Bäcker im Bäcker-Film ist ein Fuchs oder Bär",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "Der Bäcker ist ein Bär mit weißer Jacke und Bäckermütze. Mama oder Papa und der Bruder sind die Familie des Kindes und warten auf D-19.",
      },
      {
        label: "Ein Fuchs- oder Bärenkind mit Mama, Papa, Oma oder Opa geht ein Stück mit auf den Wegen",
        work: "drawing",
        effort: "M",
        state: "removed",
        note: "Nicht bauen (Feedback November 2026): nur Deko neben dem Weg des Kindes.",
      },
      { label: "Das Kind als Fuchs- oder Bärenkind", work: "drawing", effort: "M", idea: "D-19", note: "Erst entscheiden." },
    ],
  },
  {
    href: "/abenteuer/",
    note: "Tapsi ist schon der Held in 3D und spricht. Der leuchtende Tänzer steht für das Kind und bleibt.",
    tasks: [
      { label: "Tapsi zeigt die Bewegungen", work: "drawing", effort: "S", state: "done" },
      { label: "Mama, Papa, Oma oder Opa Fuchs macht bei Bewegungen zu zweit mit Tapsi vor", work: "drawing", effort: "M", idea: "M-05" },
    ],
  },
  {
    href: "/gefuehle/",
    note: "Gemini-Bilder mit Tierkindern (Bär, Fuchs, Hase, Igel). Im Kita-Teil ist der Fuchs der, der schubst, tritt, wegnimmt und umwirft.",
    tasks: [
      {
        label: "Der Fuchs ist nicht mehr der Störenfried",
        work: "picture",
        pictures: 56,
        effort: "L",
        note: "Entschieden (5. November 2026): ein Waschbär übernimmt Schubsen, Treten, Wegnehmen, Umwerfen; Fuchs und Bär, die Maskottchen, helfen und trösten. Neue Geschichten nehmen gleich den Waschbären. Die vorhandenen rund 56 Bilder und die Sätze in kita.ts (mit Übersetzungen und Aufnahmen) bleiben vorerst beim Fuchs, weil neue Bilder Geld kosten – erst neu machen, wenn der Große es sagt.",
      },
      {
        label: "Mama, Papa, Oma oder Opa Fuchs bzw. Bär tröstet oder hilft dem Kind in den Geschichten",
        work: "picture",
        pictures: 8,
        effort: "M",
        state: "done",
        note: "Kam mit den Geschichten selbst, ohne eigene Bilder: der große Bär (Mama oder Papa des kleinen Bären) drückt ihn beim Abschied, kuschelt ihn mit dem Baby, hilft bei der Jacke, wartet am Spielplatztor und an der Kasse, spielt im Schnee und nimmt ihn in den Arm, als Oma Bär wegfährt; Füchsinnen helfen als Ärztin, Kassiererin und Besuch (gesehen am 5. November 2026).",
      },
    ],
  },
  {
    href: "/wie-gehts-dir/",
    note: "Immer derselbe kleine Bär, allein, in T-Shirt und Hose (6. November 2026): auf jeder Gefühlskarte in einem Moment, der das Gefühl bringt, und auf drei Bildern daraus, die zeigen, wie stark es ist (ein bisschen, schon ziemlich, ganz doll).",
    tasks: [
      {
        label: "Fuchs- oder Bärenkind mit Mama oder Papa zeigt, wie es ihm geht (statt Wetter), und wird in den Arm genommen",
        work: "picture",
        pictures: 16,
        effort: "M",
        idea: "C-30",
        state: "done",
        note: "Gebaut, die 16 Bilder (gesicht-…) gemacht am 4. November 2026; seit dem 6. November 2026 ersetzt durch die Karten des kleinen Bären allein (die Bilder bleiben für später).",
      },
      {
        label: "Der kleine Bär allein in T-Shirt und Hose, nah und groß, in einem Moment jedes Gefühls (Geburtstagskuchen, Turm, offene Tür …)",
        work: "picture",
        pictures: 8,
        effort: "M",
        idea: "C-30",
        state: "done",
        note: "Wunsch vom 6. November 2026, gemacht am selben Tag (gefuehl-…).",
      },
      {
        label: "Der kleine Bär (MascotHead in T-Shirt und Hose) zeigt mit dem Regler, wie stark das Gefühl ist",
        work: "drawing",
        effort: "S",
        idea: "C-36",
        state: "done",
        note: "Seit dem 6. November 2026 ersetzt durch die drei Bilder des nächsten Punkts (Wunsch).",
      },
      {
        label: "Jedes Gefühl ein bisschen und ganz doll, aus seiner Karte gezeichnet – deutlich schwächer und deutlich stärker",
        work: "picture",
        pictures: 16,
        effort: "M",
        idea: "C-36",
        state: "done",
        note: "Wunsch vom 6. November 2026, gemacht am selben Tag (gefuehl-…-wenig, gefuehl-…-doll).",
      },
    ],
  },
  {
    href: "/was-brauche-ich/",
    note: "Der kleine Bär tut, was er gerade braucht; ein Erwachsener nur dort, wo es dazugehört (in den Arm nehmen), angezogen.",
    tasks: [
      {
        label: "Der kleine Bär in T-Shirt und Hose tut, was er braucht (kuscheln, allein sein, toben, trinken, essen, ausruhen, Lied)",
        work: "picture",
        pictures: 7,
        effort: "M",
        idea: "C-31",
        state: "done",
        note: "Wunsch vom 6. November 2026, gemacht am selben Tag (brauche-…); die alten hilft-… Bilder bleiben für später.",
      },
      { label: "Bärenkind pustet mit (MascotHead)", work: "drawing", effort: "S", idea: "C-31", state: "done" },
    ],
  },
  {
    href: "/tiere/",
    note: "Emoji; der Fuchs mit seinem Bau ist schon dabei.",
    tasks: [{ label: "Fuchs und Fuchsbau", work: "drawing", effort: "S", state: "done" }],
  },
  {
    href: "/zusammen/",
    note: "SVG. Die fünf Helfer sind Fuchs- und Bär-Große in ihrer Rolle, beim Arzt, beim Friseur und beim Postboten ist ein Fuchs- oder Bärenkind dabei, und hinter der Tür warten ein Bär und sein Kind.",
    tasks: [{ label: "Helfer als Fuchs und Bär, Kinder als Kunden", work: "drawing", effort: "M", state: "done" }],
  },
  {
    href: "/schatten/",
    note: "Emoji, Verstecke als SVG.",
    tasks: [
      {
        label: "🦊 und 🐻 bei den Tieren",
        work: "drawing",
        effort: "S",
        note: "Offen: 🦊 und 🐻 sind als Emoji nur Köpfe, Schatten finden nimmt aber ganze Körper (ein Kopf ist ein runder Fleck). Bräuchte eine eigene Zeichnung statt Emoji.",
      },
      {
        label: "Fuchs- oder Bärenkind schaut bei „Wer schaut da raus?“ aus dem Busch, sein Großer winkt daneben",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Großer und Kind standen neben dem Busch und zeigten darauf (6. November 2026). Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/socken/",
    note: "SVG: Waschmaschine, Socken, Handschuhe, Gummistiefel, Hausschuhe, Klammern, Korb.",
    tasks: [
      { label: "Hausschuhe mit Bärenkopf in der neuen Wäsche (Z-10)", work: "drawing", effort: "S", state: "done" },
      {
        label: "Socken mit Fuchs- und Bärenmuster",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "Zwei neue Muster mit Gesichtern (Augen und Nase), damit kein Fuchskopf wie ein Herz aussieht; in einer Wäsche nur Füchse oder Bären, nie beide.",
      },
      {
        label: "Tapsi schaut aus dem Wäschekorb, Mama, Papa, Oma oder Opa Fuchs hängt lachend Wäsche auf",
        work: "drawing",
        effort: "M",
        state: "removed",
        note: "Tapsi und Mama Fuchs standen neben der großen Waschmaschine. Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/buchstaben/",
    note: "Emoji-Wörter zum Lernen (Mama, Oma, Junge …) bleiben Menschen. „Fuchs 🦊“ gibt es beim F.",
    tasks: [
      {
        label: "Tapsi mit Mama, Papa, Oma oder Opa Fuchs auf Start und Ende",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Nicht bauen (Feedback November 2026): nur Deko. „Fuchs 🦊“ beim F bleibt, das ist ein Wort des Spiels.",
      },
    ],
  },
  {
    href: "/zaehlen/",
    note: "Teilt die Dinge zum Zählen mit „Frei tippen“.",
    tasks: [
      {
        label: "Fuchs- oder Bärenkind zählt mit seinem Großen die Dinge mit",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Großer und Kind standen unten links und zeigten auf die Dinge. Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/mitmachen/",
    note: "L-15: das Fuchs- oder Bärenkind hüpft, klatscht und stampft die Zahl (Mascot, Pose „clap“) – es ist das Spiel.",
    tasks: [
      { label: "Fuchs- oder Bärenkind macht die Zahl vor", work: "drawing", effort: "S", state: "done" },
      {
        label: "Sein Großer steht still daneben",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/woerter/",
    note: "Teilt die Bildwörter mit „Frei tippen“.",
    tasks: [
      {
        label: "Fuchs- oder Bärenkind tippt, sein Großer zeigt auf das Bild",
        work: "drawing",
        effort: "S",
        state: "removed",
        note: "Großer und Kind standen unten links, der Große zeigte auf das Bild. Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
    ],
  },
  {
    href: "/",
    note: "Cover und Familien neben dem Bücherregal sind Gemini-Bilder (components/bilder) mit Fuchs- und Bärenfamilie – so bleibt es; im Titel „Fun for Both“ ist das o von „Both“ ein Gemini-Bild: Papa Fuchs sitzt auf dem Buchstaben, sein Kind auf dem Schoß, und liest ihm vor; eine große und eine kleine Fußspur führen unter dem Namen zu ihnen.",
    tasks: [
      { label: "Titel „Fun for Both“ auf Startseite, Cover, Manifest, Suchmaschinen", work: "drawing", effort: "S", idea: "D-16", state: "done" },
      { label: "Startseite als Wald mit Fuchsbau und Bärenhöhle, Fuchs oder Bär mit seinem Kind in jeder Welt", work: "drawing", effort: "M", idea: "D-17" },
      {
        label: "Fuchs- oder Bärenkind und sein Großer klatschen am Ende jedes Spiels (GameEnd)",
        work: "drawing",
        effort: "S",
        idea: "D-12",
        state: "removed",
        note: "Stand neben „Nochmal“ und „Weiter“, das Kind sprang zweimal. Rausgenommen (Feedback November 2026): nur Deko – Kinder wollten draufdrücken und dachten, sie gehöre zum Spiel.",
      },
      {
        label: "Alle gezeichneten Füchse und Bären bekommen einen schöneren, detaillierten Kopf und Körper im Stil der Gemini-Familienbilder",
        work: "drawing",
        effort: "M",
        state: "done",
        note: "Ein Kopf für alle (`MascotHead` in components/Mascot.tsx): Fellbüschel an den Wangen, Flausch in den Ohren, Schattenseite, Brauen, Augen mit brauner Iris und zwei Lichtern etwas unter der Kopfmitte (beim Kind größer und tiefer), weiches Licht im Stirnfell statt Glanzfleck, glänzende Nase, runder lachender Mund; der Körper rundlich mit dicken Armen, runden Pfoten mit Zehen, beim Fuchs dunkle Unterarme wie bei echten Füchsen, und ein weicher Schatten unter den Füßen (November 2026 knuddeliger gemacht). Ihn nutzen Timer, Mitmachen, Fahrer in Lebendige Bilder, Schnullerfee, Sticker im Regal, die Helfer in „Was gehört zusammen?“, Baustelle und Zirkus in Kettenreaktion. Ein neuer Fuchs oder Bär nimmt ihn auch.",
      },
      {
        label: "Oma und Opa Fuchs, Oma und Opa Bär mit dem Kind neben den Karten (BookFamily)",
        work: "picture",
        pictures: 4,
        effort: "S",
        idea: "D-21",
        state: "done",
        note: "Unten auf den Menüseiten lesen von Besuch zu Besuch abwechselnd die Eltern, Oma oder Opa mit dem Kind (READERS in BookFamily.tsx), links Füchse, rechts Bären – nie dieselben Großen auf beiden Seiten.",
      },
    ],
  },
];

/** The Gemini pictures still to make, for the batch: the sum over every task that is a picture and not done. */
export function waitingMascotPictures(rows: MascotStatusRow[] = MASCOT_STATUS): number {
  return rows
    .flatMap((row) => row.tasks)
    .reduce((sum, task) => sum + (task.work === "picture" && task.state !== "done" && task.state !== "removed" ? (task.pictures ?? 1) : 0), 0);
}
