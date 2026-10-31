import type { Effort } from "./types";

// Where the app's foxes still have to go (D-18), game by game, shown on
// the management page like the language table. A drawing is code and can be done any
// time; a picture from Gemini waits here until the grown-up asks for them, and then all
// waiting ones are made in one batch, which costs less than one by one. Kept by hand:
// when a game gets its foxes, mark the task here in the same commit; a new game or
// picture adds its row or task. content.test.ts checks the rows against the home menu.

/** How a fox gets in: drawn in code (SVG), or a picture made with Gemini (`bun run image`, waits for a batch). */
export type FoxWork = "drawing" | "picture";

/** One change that brings foxes into a game. */
export interface FoxTask {
  /** What changes, in German for the grown-up: "Bäckerin wird Füchsin". */
  label: string;
  work: FoxWork;
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

/** One game (or the home page and book) and its fox tasks. */
export interface FoxStatusRow {
  /** The game's address in the home menu (games.ts), or "/" for the home page, cover and menus. */
  href: string;
  /** What foxes are there already, or why few fit. */
  note?: string;
  tasks: FoxTask[];
}

/** Every game of the home menu once, in menu order, then the home page. */
export const FOX_STATUS: FoxStatusRow[] = [
  {
    href: "/bilder/",
    note: "Alles SVG. Viele Menschen: Fahrer, Erzieherin, Ärztin, Feuerwehr, Pilotin, Kassiererin, Bäckerin, Förster, Bauer, Mama, Papa, Oma, Opa. Füchse gibt es nur als Tier im Wald und im Winter.",
    tasks: [
      {
        label: "Fahrer, Mitfahrer und Pilotinnen werden Füchse",
        work: "drawing",
        effort: "S",
        note: "Ein Kopf für alle: Rider in scenes/shared.tsx zeichnet etwa 33 Köpfe in Fahrzeugen.",
      },
      {
        label: "Fuchskind schaut aus den Verstecken",
        work: "drawing",
        effort: "S",
        note: "Ein Fuchs zu Katze, Maus, Hase … in hideout.tsx, dann in jeder Szene.",
      },
      {
        label: "Erwachsene werden Füchse: Erzieherin, Ärztin, Feuerwehr, Kassiererin, Bäckerin, Tierpfleger, Förster, Bauer …",
        work: "drawing",
        effort: "L",
        note: "Jede Szene zeichnet ihre eigenen Leute; Szene für Szene, die Kinder bleiben Kinder. Mama, Papa, Oma, Opa ebenso.",
      },
      {
        label: "Ein Fuchskind unter den Kindern jeder Szene",
        work: "drawing",
        effort: "M",
        note: "Kita, Spielplatz, Stadt, Strand, Herbst, Winter, Ostern.",
      },
    ],
  },
  {
    href: "/abenteuer/",
    note: "Tapsi ist schon der Held in 3D und spricht. Der leuchtende Tänzer steht für das Kind und bleibt.",
    tasks: [{ label: "Tapsi zeigt die Bewegungen", work: "drawing", effort: "S", state: "done" }],
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
        note: "Zu entscheiden: ein anderes Tier (Waschbär?) übernimmt Schubsen, Treten, Wegnehmen, Umwerfen (kita.ts und rund 56 Bilder); der Fuchs wird der, der hilft und tröstet.",
      },
      { label: "Der Fuchs tröstet oder hilft in den Geschichten", work: "picture", pictures: 8, effort: "M" },
    ],
  },
  {
    href: "/kettenreaktion/",
    note: "SVG. Ein 🦊 schaut schon auf der Schneebahn hervor.",
    tasks: [
      { label: "🦊 statt 👷 auf der Baustellenbahn, 🦊 bei den Gucker-Tieren jeder Bahn", work: "drawing", effort: "S", state: "partial" },
      { label: "Fahrer der Baumaschinen werden Füchse", work: "drawing", effort: "S" },
      { label: "Die Clownpuppe im Zirkus wird eine Fuchspuppe", work: "drawing", effort: "S" },
    ],
  },
  {
    href: "/kleine-abenteuer/",
    note: "SVG. Das Kind (Junge / Mädchen) bleibt, bis D-19 entschieden ist.",
    tasks: [
      {
        label: "Feuerwehr, Nachbarin, Bewohner und Fahrer im Feuerwehr-Film werden Füchse",
        work: "drawing",
        effort: "M",
        note: "Ein Fuchskopf in Grownup (film/people.tsx).",
      },
      { label: "Ein Fuchs geht neben dem Hund mit auf den Wegen", work: "drawing", effort: "M" },
      { label: "Das Kind als Fuchskind", work: "drawing", effort: "M", idea: "D-19", note: "Erst entscheiden." },
    ],
  },
  {
    href: "/tiere/",
    note: "Emoji; der Fuchs mit seinem Bau ist schon dabei.",
    tasks: [{ label: "Fuchs und Fuchsbau", work: "drawing", effort: "S", state: "done" }],
  },
  {
    href: "/schatten/",
    note: "Emoji, Verstecke als SVG.",
    tasks: [
      { label: "🦊 bei den Tieren", work: "drawing", effort: "S" },
      { label: "Ein Fuchs schaut bei „Wer schaut da raus?“ aus dem Busch", work: "drawing", effort: "S" },
    ],
  },
  {
    href: "/socken/",
    note: "SVG: Waschmaschine, Socken, Klammern, Korb.",
    tasks: [
      { label: "Socken mit Fuchsmuster", work: "drawing", effort: "S" },
      { label: "Tapsi schaut aus dem Wäschekorb und freut sich", work: "drawing", effort: "M" },
    ],
  },
  {
    href: "/buchstaben/",
    note: "Emoji-Wörter zum Lernen (Mama, Oma, Junge …) bleiben Menschen. „Fuchs 🦊“ gibt es beim F.",
    tasks: [{ label: "Tapsi auf Start und Ende", work: "drawing", effort: "S" }],
  },
  {
    href: "/zaehne/",
    note: "SVG. Das Gesicht im Spiegel ist das Kind und bleibt; die Stimme ist schon Tapsi.",
    tasks: [
      { label: "Tapsi putzt klein in der Ecke mit", work: "drawing", effort: "M" },
      { label: "Tapsi jubelt bei Medaille und Wochenplan", work: "drawing", effort: "S" },
    ],
  },
  {
    href: "/toepfchen/",
    note: "Hier kommt Tapsi her: Gemini-Bilder mit Tapsi, Mama und Papa Fuchs – die Vorlage für alle anderen Füchse.",
    tasks: [{ label: "Tapsi und Familie in allen Bildern", work: "picture", pictures: 126, effort: "L", state: "done" }],
  },
  {
    href: "/belohnungstafel/",
    note: "Gemini-Bilder mit Tapsi, Mama, Papa und Oma Fuchs; die Ärztin ist ein Bär, Freunde sind Hase und Bär.",
    tasks: [
      { label: "Tapsi und Familie in den Aufgabenbildern", work: "picture", pictures: 130, effort: "L", state: "done" },
      { label: "Die Bärenärztin wird eine Füchsin", work: "picture", pictures: 2, effort: "S", note: "Mit Linienbild." },
    ],
  },
  {
    href: "/laut-leise/",
    note: "SVG: Löwe und Maus (das Thema des Spiels, sie bleiben), Kerzen, Pusteblume, Windrad, Boot.",
    tasks: [{ label: "Tapsi pustet mit (Kerzen, Pusteblume)", work: "drawing", effort: "M" }],
  },
  {
    href: "/",
    note: "Cover und Familien neben dem Bücherregal sind Gemini-Bilder (components/bilder); der Titel „Books for Both“ hat Tapsi über einem Buch als Vignette (SVG).",
    tasks: [
      { label: "Cover nur mit der Fuchsfamilie", work: "picture", pictures: 1, effort: "S", idea: "D-14" },
      { label: "Oma oder Opa Fuchs mit Fuchskind statt der Bären", work: "picture", pictures: 1, effort: "S", idea: "D-15" },
      { label: "Titel „Books for Both“ auf Startseite, Cover, Manifest, Suchmaschinen", work: "drawing", effort: "S", idea: "D-16", state: "done" },
      { label: "Startseite als Fuchswald, ein Fuchs in jeder Welt", work: "drawing", effort: "M", idea: "D-17" },
      { label: "Tapsi klatscht am Ende jedes Spiels (GameEnd)", work: "drawing", effort: "S", idea: "D-12" },
    ],
  },
];

/** The Gemini pictures still to make, for the batch: the sum over every task that is a picture and not done. */
export function waitingFoxPictures(rows: FoxStatusRow[] = FOX_STATUS): number {
  return rows.flatMap((row) => row.tasks).reduce((sum, task) => sum + (task.work === "picture" && task.state !== "done" ? (task.pictures ?? 1) : 0), 0);
}
