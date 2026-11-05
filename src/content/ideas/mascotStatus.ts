import type { Effort } from "./types";

// Where the app's two mascots, the fox and the bear, could still turn up (D-18), game by game, shown
// on the management page like the language table. Not every game needs them: they are a motif that
// comes back, not a fox in every corner. The motif is always a grown-up with a child (Mama, Papa, Oma or
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
  /** Already in the app; "partial" when only some of it is. */
  state?: "done" | "partial";
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
      { label: "Tapsi putzt klein in der Ecke mit, Mama, Papa, Oma oder Opa Fuchs putzt nach", work: "drawing", effort: "M" },
      {
        label: "Tapsi und sein Großer jubeln bei Medaille und Wochenplan",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "Am Ende neben Wochenplan und Knöpfen: Tapsi springt mit hochgerissenen Armen, Mama oder Papa Fuchs winkt (CheeringFamily).",
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
    note: "Alles SVG: beim Zug wartet die Bärenfamilie am Bahnhof, beim Apfelbaum hält das Bärenkind den Korb, bei der Sanduhr und der roten Scheibe steht die Fuchsfamilie daneben, bei der Raupe fliegt der Schmetterling zum Fuchskind, bei der Blume gießt das Bärenkind, bei der Kerze pustet das Bärenkind sie aus, beim Sonnenuntergang gähnt die Fuchsfamilie am Ende, bei der Pizza steht die Fuchsfamilie daneben, bei der Ameisenstraße schaut die Fuchsfamilie zu und das Fuchskind lacht am Ende, beim Abwechseln stehen beide Familien, und das Spielzeug wandert zwischen Fuchskind und Bärenkind; am Ende winken alle.",
    tasks: [{ label: "Fuchs- oder Bärenfamilie in jedem Bild, sie winkt am Ende", work: "drawing", effort: "S", state: "done" }],
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
    note: "Alles SVG. Viele Menschen: Fahrer, Erzieherin, Ärztin, Feuerwehr, Pilotin, Kassiererin, Bäckerin, Förster, Bauer, Mama, Papa, Oma, Opa. Fuchs und Bär gibt es nur als Tiere im Wald und im Winter.",
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
        state: "partial",
        note: "Mit `MascotFace` (scenes/shared.tsx), dem geteilten Kopf an Stelle eines Menschenkopfs: im Supermarkt ist die Bäckerin eine Bärin mit Kochmütze und die Kassiererin eine Füchsin mit Schleife am Ohr, in der Kita liest eine Füchsin mit runder Brille vor, beim Kinderarzt ist die Ärztin eine Bärin mit Brille (wie in der Belohnungstafel), im Wald die Försterin eine Bärin (der wilde Fuchs bleibt ein Fuchs), in der Feuerwache der Feuerwehrmann mit der Pfeife ein Fuchs unter dem Helm (die Feuerwehrfrau bleibt ein Mensch), im Zoo die Tierpflegerin eine Füchsin, auf dem Bauernhof der Bauer ein Bär (ein Fuchs bei den Hühnern wäre der falsche), am Flughafen die Pilotin eine Bärin mit Mütze zwischen den Ohren. Offen: Eisverkäufer, Einweiser, Schaffner … Szene für Szene, nicht alle – Menschen dürfen bleiben, die Kinder bleiben Kinder.",
      },
      {
        label: "Ein Fuchs- oder Bärenkind mit Mama, Papa, Oma oder Opa in jeder Szene (Hand in Hand, auf den Schultern, auf der Bank daneben)",
        work: "drawing",
        effort: "M",
        state: "partial",
        note: "`WalkingFamily` (scenes/family.tsx): Großer und Kind Hand in Hand, flach wie die Menschen der Bilder, mit dem geteilten Kopf; ein Ding des Hintergrunds, das beim Antippen hüpft, ohne Worte (so verliert kein Bild seine Übersetzungen). In der Stadt Papa Bär auf dem Gehweg, am Strand Mama Fuchs in Badesachen, auf dem Spielplatz Opa Bär hinten bei der Bank. Offen: Kita, Herbst, Winter, Ostern.",
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
      { label: "Ein Fuchs- oder Bärenkind mit Mama, Papa, Oma oder Opa geht ein Stück mit auf den Wegen", work: "drawing", effort: "M" },
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
    href: "/wie-gehts-dir/",
    note: "Acht Gefühle als Fuchs- oder Bärenkind mit Mama oder Papa (C-30); das Gesicht zum Nachmachen ist der gemeinsame MascotHead. Danach spielen die Szenen von „Alltagssituationen“.",
    tasks: [
      {
        label: "Fuchs- oder Bärenkind macht das Gesicht des Gefühls groß vor und pustet mit (MascotHead)",
        work: "drawing",
        effort: "S",
        idea: "C-35",
        state: "done",
      },
      {
        label: "Fuchs- oder Bärenkind mit Mama oder Papa zeigt, wie es ihm geht (statt Wetter), und wird in den Arm genommen",
        work: "picture",
        pictures: 16,
        effort: "M",
        idea: "C-30",
        state: "done",
        note: "Gebaut, die 16 Bilder (gesicht-…) gemacht am 4. November 2026.",
      },
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
        note: "Zu entscheiden: ein anderes Tier (Waschbär?) übernimmt Schubsen, Treten, Wegnehmen, Umwerfen (kita.ts und rund 56 Bilder); Fuchs und Bär, die Maskottchen, helfen und trösten.",
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
      { label: "Fuchs- oder Bärenkind schaut bei „Wer schaut da raus?“ aus dem Busch, sein Großer winkt daneben", work: "drawing", effort: "S" },
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
        state: "partial",
        note: "Tapsi und Mama Fuchs stehen neben der großen Waschmaschine, solange sie wäscht, und gehen, wenn die Socken herauspurzeln. Im Wäschekorb und an der Leine nicht: die Körbe decken Socken zu (wie Memory), und die Leine braucht die ganze Breite.",
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
        note: "Offen: das Spiel hat weder Startbild noch Ende (es spielt sofort und läuft frei weiter); bräuchte einen anderen Platz, etwa ein Bild zu „Fuchs“ beim F.",
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
        state: "done",
        note: "Unten links stehen Großer und Kind still (`PointingFamily`), das Kind zeigt auf die Dinge; Fuchs oder Bär bei jedem Besuch zufällig.",
      },
    ],
  },
  {
    href: "/mitmachen/",
    note: "Neu (L-15): das Fuchs- oder Bärenkind hüpft, klatscht und stampft die Zahl, sein Großer steht daneben (Mascot, Pose „clap“).",
    tasks: [{ label: "Fuchs- oder Bärenkind macht die Zahl vor, sein Großer steht daneben", work: "drawing", effort: "S", state: "done" }],
  },
  {
    href: "/woerter/",
    note: "Teilt die Bildwörter mit „Frei tippen“.",
    tasks: [
      {
        label: "Fuchs- oder Bärenkind tippt, sein Großer zeigt auf das Bild",
        work: "drawing",
        effort: "S",
        state: "done",
        note: "Unten links steht das Kind, sein Großer zeigt auf das Bild (`PointingFamily`, Pose „point“); beide still. Nicht bei „Wo ist das B?“.",
      },
    ],
  },
  {
    href: "/",
    note: "Cover und Familien neben dem Bücherregal sind Gemini-Bilder (components/bilder) mit Fuchs- und Bärenfamilie – so bleibt es; im Titel „Books for Both“ ist das o von „Both“ ein Gemini-Bild: Papa Fuchs sitzt auf dem Buchstaben, sein Kind auf dem Schoß, und liest ihm vor; eine große und eine kleine Fußspur führen unter dem Namen zu ihnen.",
    tasks: [
      { label: "Titel „Books for Both“ auf Startseite, Cover, Manifest, Suchmaschinen", work: "drawing", effort: "S", idea: "D-16", state: "done" },
      { label: "Startseite als Wald mit Fuchsbau und Bärenhöhle, Fuchs oder Bär mit seinem Kind in jeder Welt", work: "drawing", effort: "M", idea: "D-17" },
      {
        label: "Fuchs- oder Bärenkind und sein Großer klatschen am Ende jedes Spiels (GameEnd)",
        work: "drawing",
        effort: "S",
        idea: "D-12",
        state: "done",
        note: "CheeringFamily (components/Mascot.tsx) neben „Menü“, „Nochmal“, „Weiter“; das Kind springt zweimal, dann steht alles still. Nicht bei `corners` und beim Timer (`noFamily`), deren Bild die Familie schon zeigt.",
      },
      {
        label: "Alle gezeichneten Füchse und Bären bekommen einen schöneren, detaillierten Kopf und Körper im Stil der Gemini-Familienbilder",
        work: "drawing",
        effort: "M",
        state: "done",
        note: "Ein Kopf für alle (`MascotHead` in components/Mascot.tsx): Fellbüschel an den Wangen, Flausch in den Ohren, Schattenseite, Brauen, Augen mit brauner Iris und zwei Lichtern etwas unter der Kopfmitte (beim Kind größer und tiefer), weiches Licht im Stirnfell statt Glanzfleck, glänzende Nase, runder lachender Mund; der Körper rundlich mit dicken Armen, runden Pfoten mit Zehen, beim Fuchs dunkle Unterarme wie bei echten Füchsen, und ein weicher Schatten unter den Füßen (November 2026 knuddeliger gemacht). Ihn nutzen Spielende, Timer, Fahrer in Lebendige Bilder, Schnullerfee, Sticker im Regal, die Helfer in „Was gehört zusammen?“, Baustelle und Zirkus in Kettenreaktion. Ein neuer Fuchs oder Bär nimmt ihn auch.",
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
  return rows.flatMap((row) => row.tasks).reduce((sum, task) => sum + (task.work === "picture" && task.state !== "done" ? (task.pictures ?? 1) : 0), 0);
}
