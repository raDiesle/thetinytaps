import type { Localized } from "@/lib/language";

// What grown-ups pick from when they make a board: tasks, rewards, the mark that
// goes into a field, colours and ready-made boards. Emoji for now; every task and
// reward has a picture prompt in bilder/prompts.ts, so generated pictures can
// replace the emoji later (checked in rewards.test.ts).

/** A game whose own end puts a star on the board by itself. */
export type LinkedGame = "teeth" | "potty";

/** A habit a board can ask for. */
export interface CatalogTask {
  id: string;
  emoji: string;
  label: Localized;
  /** The game that gives this task its star by itself (Zähne putzen, Aufs Töpfchen). */
  linked?: LinkedGame;
}

/** Tasks for two- and three-year-olds, the most asked for first. */
export const TASKS: CatalogTask[] = [
  { id: "zaehne", emoji: "🪥", label: { de: "Zähne putzen" }, linked: "teeth" },
  { id: "toepfchen", emoji: "🚽", label: { de: "Aufs Töpfchen" }, linked: "potty" },
  { id: "anziehen", emoji: "👕", label: { de: "Anziehen" } },
  { id: "bett", emoji: "🛏️", label: { de: "Im eigenen Bett schlafen" } },
  { id: "haende", emoji: "🧼", label: { de: "Hände waschen" } },
  { id: "aufraeumen", emoji: "🧸", label: { de: "Aufräumen" } },
  { id: "schuhe", emoji: "👟", label: { de: "Schuhe anziehen" } },
  { id: "jacke", emoji: "🧥", label: { de: "Jacke anziehen" } },
  { id: "probieren", emoji: "🥦", label: { de: "Etwas Neues probieren" } },
  { id: "essen", emoji: "🥄", label: { de: "Allein essen" } },
  { id: "tisch", emoji: "🍽️", label: { de: "Tisch decken helfen" } },
  { id: "baden", emoji: "🛁", label: { de: "Baden" } },
  { id: "haare", emoji: "🚿", label: { de: "Haare waschen" } },
  { id: "nase", emoji: "🤧", label: { de: "Nase putzen" } },
  { id: "eincremen", emoji: "🧴", label: { de: "Eincremen" } },
  { id: "anschnallen", emoji: "🚗", label: { de: "Anschnallen" } },
  { id: "hand", emoji: "✋", label: { de: "An der Hand gehen" } },
  { id: "abschied", emoji: "👋", label: { de: "Tschüss sagen in der Kita" } },
  { id: "helfen", emoji: "🤝", label: { de: "Helfen" } },
];

/** Something to look forward to: time together first, as parents' guides advise, sweets last. */
export interface CatalogReward {
  id: string;
  emoji: string;
  label: Localized;
}

export const REWARDS: CatalogReward[] = [
  { id: "spielplatz", emoji: "🛝", label: { de: "Spielplatz" } },
  { id: "buch", emoji: "📖", label: { de: "Lieblingsbuch lesen" } },
  { id: "backen", emoji: "🧁", label: { de: "Zusammen backen" } },
  { id: "kuscheln", emoji: "🤗", label: { de: "Extra kuscheln" } },
  { id: "hoehle", emoji: "🏕️", label: { de: "Höhle bauen" } },
  { id: "seifenblasen", emoji: "🫧", label: { de: "Seifenblasen" } },
  { id: "tanzen", emoji: "💃", label: { de: "Tanzparty" } },
  { id: "malen", emoji: "🎨", label: { de: "Zusammen malen" } },
  { id: "picknick", emoji: "🧺", label: { de: "Picknick" } },
  { id: "laufrad", emoji: "🚲", label: { de: "Laufrad fahren" } },
  { id: "freunde", emoji: "👫", label: { de: "Freunde treffen" } },
  { id: "zoo", emoji: "🦒", label: { de: "In den Zoo" } },
  { id: "schwimmen", emoji: "🏊", label: { de: "Schwimmbad" } },
  { id: "eis", emoji: "🍦", label: { de: "Ein Eis" } },
];

/** What fills a field: an emoji on screen and on colour prints, an outline to colour in where there is one. */
export interface CatalogMark {
  id: string;
  emoji: string;
  label: Localized;
  /** An outline in a 100×100 box, printed to colour in; without one the emoji is printed pale instead. */
  outline?: string;
}

export const MARKS: CatalogMark[] = [
  { id: "stern", emoji: "⭐", label: { de: "Stern" }, outline: "M50 5 L61 38 L96 38 L68 59 L79 93 L50 72 L21 93 L32 59 L4 38 L39 38 Z" },
  {
    id: "herz",
    emoji: "❤️",
    label: { de: "Herz" },
    outline: "M50 88 C20 65 5 48 5 30 C5 15 17 5 30 5 C40 5 47 11 50 18 C53 11 60 5 70 5 C83 5 95 15 95 30 C95 48 80 65 50 88 Z",
  },
  {
    id: "blume",
    emoji: "🌸",
    label: { de: "Blume" },
    outline:
      "M50 38 A12 12 0 1 1 50 62 A12 12 0 1 1 50 38 Z M50 36 C38 10 62 10 50 36 Z M64 46 C90 34 90 58 64 54 Z M58 64 C70 90 46 94 46 66 Z M42 64 C30 90 6 76 34 58 Z M36 46 C10 34 18 10 44 38 Z",
  },
  {
    id: "sonne",
    emoji: "☀️",
    label: { de: "Sonne" },
    outline:
      "M50 28 A22 22 0 1 1 50 72 A22 22 0 1 1 50 28 Z M50 4 L50 18 M50 82 L50 96 M4 50 L18 50 M82 50 L96 50 M17 17 L27 27 M73 73 L83 83 M17 83 L27 73 M73 27 L83 17",
  },
  { id: "kaefer", emoji: "🐞", label: { de: "Marienkäfer" } },
  { id: "schmetterling", emoji: "🦋", label: { de: "Schmetterling" } },
  { id: "pfote", emoji: "🐾", label: { de: "Pfote" } },
  { id: "smiley", emoji: "😊", label: { de: "Lachgesicht" } },
];

/** Colours of a board, on screen and in colour prints. */
export interface Theme {
  id: string;
  label: Localized;
  /** The page behind the board. */
  paper: string;
  /** Fields, headings, the goal. */
  main: string;
  /** Lines and text on `main`. */
  ink: string;
}

export const THEMES: Theme[] = [
  { id: "sonne", label: { de: "☀️ Sonne" }, paper: "#fff8e1", main: "#ffd23f", ink: "#7a4b00" },
  { id: "meer", label: { de: "🌊 Meer" }, paper: "#e8f6ff", main: "#7cc8f2", ink: "#0f4c81" },
  { id: "wiese", label: { de: "🌿 Wiese" }, paper: "#eefbe6", main: "#9bd77a", ink: "#2f6b1f" },
  { id: "beere", label: { de: "🍓 Beere" }, paper: "#fff0f6", main: "#ffa8cc", ink: "#8c1b4f" },
  { id: "nacht", label: { de: "🌙 Nacht" }, paper: "#f1efff", main: "#b3a8ff", ink: "#3d2f8f" },
];

/** The three kinds of board. */
export type BoardKind = "week" | "day" | "collect";

export const KINDS: { id: BoardKind; emoji: string; label: Localized; hint: Localized }[] = [
  {
    id: "collect",
    emoji: "🐾",
    label: { de: "Sterne sammeln" },
    hint: { de: "Ein Weg aus Feldern bis zur Belohnung, ohne Wochentage. Am besten für den Anfang: wenige Felder, bald ein Fest." },
  },
  {
    id: "day",
    emoji: "☀️",
    label: { de: "Tagestafel" },
    hint: { de: "Die Aufgaben von heute als große Bilder, jeden Tag neu – zum Beispiel morgens oder abends der Reihe nach." },
  },
  {
    id: "week",
    emoji: "📅",
    label: { de: "Wochentafel" },
    hint: { de: "Aufgaben in Zeilen, Wochentage in Spalten. Jede Woche beginnt von selbst eine neue." },
  },
];

/** A ready-made board to start from; the grown-up changes what they like afterwards. */
export interface Template {
  id: string;
  emoji: string;
  label: Localized;
  kind: BoardKind;
  /** Catalogue task ids. */
  tasks: string[];
  /** Stars until the reward (fields of a collecting board). */
  goal: number;
  reward: string | null;
  mark: string;
  theme: string;
  title?: Localized;
}

export const TEMPLATES: Template[] = [
  { id: "zaehne-woche", emoji: "🪥", label: { de: "Zähne-Woche" }, kind: "week", tasks: ["zaehne"], goal: 5, reward: "buch", mark: "stern", theme: "meer" },
  {
    id: "fuenf",
    emoji: "⭐",
    label: { de: "5 Sterne bis zum Spielplatz" },
    kind: "collect",
    tasks: ["anziehen"],
    goal: 5,
    reward: "spielplatz",
    mark: "stern",
    theme: "sonne",
  },
  {
    id: "toepfchen",
    emoji: "🚽",
    label: { de: "Töpfchen-Woche" },
    kind: "week",
    tasks: ["toepfchen"],
    goal: 5,
    reward: "seifenblasen",
    mark: "stern",
    theme: "wiese",
  },
  {
    id: "morgen",
    emoji: "🌅",
    label: { de: "Mein Morgen" },
    kind: "day",
    tasks: ["anziehen", "zaehne", "schuhe"],
    goal: 3,
    reward: null,
    mark: "sonne",
    theme: "sonne",
    title: { de: "Mein Morgen" },
  },
  {
    id: "abend",
    emoji: "🌙",
    label: { de: "Mein Abend" },
    kind: "day",
    tasks: ["baden", "zaehne", "aufraeumen"],
    goal: 3,
    reward: "buch",
    mark: "stern",
    theme: "nacht",
    title: { de: "Mein Abend" },
  },
  {
    id: "bett",
    emoji: "🛏️",
    label: { de: "7 Nächte im eigenen Bett" },
    kind: "collect",
    tasks: ["bett"],
    goal: 7,
    reward: "backen",
    mark: "herz",
    theme: "nacht",
  },
  {
    id: "woche",
    emoji: "📅",
    label: { de: "Wochentafel mit drei Aufgaben" },
    kind: "week",
    tasks: ["zaehne", "anziehen", "aufraeumen"],
    goal: 10,
    reward: "zoo",
    mark: "stern",
    theme: "sonne",
  },
];

export const TASK_BY_ID = new Map(TASKS.map((t) => [t.id, t]));
export const REWARD_BY_ID = new Map(REWARDS.map((r) => [r.id, r]));
export const MARK_BY_ID = new Map(MARKS.map((m) => [m.id, m]));
export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
