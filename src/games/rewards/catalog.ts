import type { Localized } from "@/lib/language";

// What grown-ups pick from when they make a board: tasks, rewards, the mark that
// goes into a field, colours and ready-made boards. Emoji for now; every task and
// reward has a picture prompt in bilder/prompts.ts, so generated pictures can
// replace the emoji later (checked in rewards.test.ts).

/** A game whose own end puts a star on the board by itself. */
export type LinkedGame = "teeth" | "potty";

/** What a grown-up makes on the page: a reward chart (stars) or a picture schedule (the steps of a day). */
export type ChartType = "board" | "plan";

/** The two kinds of chart, the first choice of the wizard, each with one line for grown-ups. */
export const CHART_TYPES: { id: ChartType; emoji: string; label: Localized; hint: Localized }[] = [
  { id: "board", emoji: "🌟", label: { de: "Belohnungstafel" }, hint: { de: "Sterne sammeln für das, was klappen soll – bis zur Belohnung" } },
  { id: "plan", emoji: "🗓️", label: { de: "Tagesplan" }, hint: { de: "Bilder zeigen, was jetzt kommt und was danach – das Kind hakt selbst ab" } },
];

/** A time of day a task can have its own field for: brushing teeth in the morning and in the evening. */
export type Slot = "morning" | "noon" | "evening";

/** The times of day in the order of the day, with the picture that marks their field. */
export const SLOTS: { id: Slot; emoji: string; label: Localized }[] = [
  { id: "morning", emoji: "☀️", label: { de: "Morgens" } },
  { id: "noon", emoji: "🌤️", label: { de: "Mittags" } },
  { id: "evening", emoji: "🌙", label: { de: "Abends" } },
];

export const SLOT_BY_ID = new Map(SLOTS.map((s) => [s.id, s]));

/** A habit a board can ask for. */
export interface CatalogTask {
  id: string;
  emoji: string;
  label: Localized;
  /** The game that gives this task its star by itself (Zähne putzen, Aufs Töpfchen). */
  linked?: LinkedGame;
  /** A field for each of these times of day instead of one a day, when the task is picked. */
  slots?: Slot[];
}

/** Tasks for two- and three-year-olds, the most asked for first. */
export const TASKS: CatalogTask[] = [
  { id: "zaehne", emoji: "🪥", label: { de: "Zähne putzen" }, linked: "teeth", slots: ["morning", "evening"] },
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

/** The kinds of board, which are also the views of one board: day, week and month share its stars. */
export type BoardKind = "day" | "week" | "month" | "collect";

/** A kind of board with what it is for, in one line for grown-ups. */
export interface KindInfo {
  id: BoardKind;
  emoji: string;
  label: Localized;
  hint: Localized;
}

/**
 * In the order of the switch above the board: day, week and month are the main views (the same stars, seen
 * for a shorter or longer time), collecting comes last and apart – it counts stars, not days.
 */
export const KINDS: KindInfo[] = [
  { id: "day", emoji: "☀️", label: { de: "Tag" }, hint: { de: "Heute: die Aufgaben als große Bilder" } },
  { id: "week", emoji: "📅", label: { de: "Woche" }, hint: { de: "Aufgaben und Wochentage, Montag bis Sonntag" } },
  { id: "month", emoji: "🗓️", label: { de: "Monat" }, hint: { de: "Ein Kalender für den ganzen Monat" } },
  { id: "collect", emoji: "🐾", label: { de: "Sammeln" }, hint: { de: "Ein Weg mit 3 bis 30 Sternen bis zur Belohnung" } },
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
  /** Times of day of a task, where they differ from the catalogue's (Mein Morgen brushes only in the morning). */
  slots?: Record<string, Slot[]>;
  /** One line for grown-ups under its picture in the gallery and the wizard. */
  hint: Localized;
}

/** Shown in the gallery of Vorlagen and the wizard, in the order of KINDS; the first is the board a new visitor sees. */
export const TEMPLATES: Template[] = [
  {
    id: "zaehne-woche",
    emoji: "🪥",
    label: { de: "Zähne-Woche" },
    kind: "week",
    tasks: ["zaehne"],
    goal: 10,
    reward: "buch",
    mark: "stern",
    theme: "meer",
    hint: { de: "Morgens und abends ein Stern – nach „Zähne putzen“ kommt er von selbst" },
  },
  {
    id: "morgen",
    emoji: "🌅",
    label: { de: "Mein Morgen" },
    kind: "day",
    tasks: ["anziehen", "zaehne", "schuhe"],
    slots: { zaehne: ["morning"] },
    goal: 3,
    reward: null,
    mark: "sonne",
    theme: "sonne",
    title: { de: "Mein Morgen" },
    hint: { de: "Anziehen, Zähne, Schuhe – jeden Morgen neu" },
  },
  {
    id: "abend",
    emoji: "🌙",
    label: { de: "Mein Abend" },
    kind: "day",
    tasks: ["baden", "zaehne", "aufraeumen"],
    slots: { zaehne: ["evening"] },
    goal: 3,
    reward: "buch",
    mark: "stern",
    theme: "nacht",
    title: { de: "Mein Abend" },
    hint: { de: "Baden, Zähne, Aufräumen – dann eine Geschichte" },
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
    hint: { de: "Ein Stern an jedem Tag mit Töpfchen" },
  },
  {
    id: "woche",
    emoji: "📅",
    label: { de: "Woche mit drei Aufgaben" },
    kind: "week",
    tasks: ["zaehne", "anziehen", "aufraeumen"],
    goal: 15,
    reward: "zoo",
    mark: "stern",
    theme: "sonne",
    hint: { de: "Zähne morgens und abends, Anziehen, Aufräumen" },
  },
  {
    id: "zaehne-monat",
    emoji: "🗓️",
    label: { de: "Zähne-Monat" },
    kind: "month",
    tasks: ["zaehne"],
    goal: 40,
    reward: "zoo",
    mark: "stern",
    theme: "meer",
    hint: { de: "Ein ganzer Monat Zähneputzen, morgens und abends" },
  },
  {
    id: "monat",
    emoji: "📆",
    label: { de: "Monat mit zwei Aufgaben" },
    kind: "month",
    tasks: ["toepfchen", "bett"],
    goal: 30,
    reward: "schwimmen",
    mark: "herz",
    theme: "beere",
    hint: { de: "Töpfchen und eigenes Bett, für größere Ziele" },
  },
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
    hint: { de: "Kurz und bald: für die Kleinsten" },
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
    hint: { de: "Jede Nacht im eigenen Bett ein Herz" },
  },
];

/**
 * What a day is made of, for the Tagesplan: meals, Kita, sleep, outings. Not habits to reward but steps of a day; a
 * plan takes these and the tasks above (Zähne putzen, Anziehen …). Ids differ from the tasks' (one map holds both).
 */
export const ACTIVITIES: CatalogTask[] = [
  { id: "aufstehen", emoji: "🌅", label: { de: "Aufstehen" } },
  { id: "fruehstueck", emoji: "🥣", label: { de: "Frühstück" } },
  { id: "kita", emoji: "🏫", label: { de: "Kita" } },
  { id: "mittagessen", emoji: "🍲", label: { de: "Mittagessen" } },
  { id: "mittagsschlaf", emoji: "💤", label: { de: "Mittagsschlaf" } },
  { id: "draussen", emoji: "🌳", label: { de: "Draußen spielen" } },
  { id: "spielplatz", emoji: "🛝", label: { de: "Spielplatz" } },
  { id: "spielen", emoji: "🧱", label: { de: "Spielen" } },
  { id: "malen", emoji: "🎨", label: { de: "Malen" } },
  { id: "abendessen", emoji: "🍝", label: { de: "Abendessen" } },
  { id: "vorlesen", emoji: "📖", label: { de: "Buch lesen" } },
  { id: "schlafen", emoji: "😴", label: { de: "Schlafen" } },
  { id: "oma", emoji: "👵", label: { de: "Oma und Opa" } },
  { id: "freunde", emoji: "👫", label: { de: "Freunde" } },
  { id: "einkaufen", emoji: "🛒", label: { de: "Einkaufen" } },
  { id: "ausflug", emoji: "🎒", label: { de: "Ausflug" } },
  { id: "schwimmen", emoji: "🏊", label: { de: "Schwimmen" } },
  { id: "turnen", emoji: "🤸", label: { de: "Turnen" } },
  { id: "musik", emoji: "🎵", label: { de: "Musik" } },
  { id: "arzt", emoji: "🩺", label: { de: "Zum Arzt" } },
];

/** The two views of a plan: today's steps as big cards one after the other, or the whole week. */
export type PlanView = "day" | "week";

/** A view of a plan with what it shows, in one line for grown-ups. */
export interface PlanViewInfo {
  id: PlanView;
  emoji: string;
  label: Localized;
  hint: Localized;
}

export const PLAN_VIEWS: PlanViewInfo[] = [
  { id: "day", emoji: "☀️", label: { de: "Tag" }, hint: { de: "Heute: Schritt für Schritt, was jetzt kommt und was danach" } },
  { id: "week", emoji: "📅", label: { de: "Woche" }, hint: { de: "Was an welchem Tag ist – und wie oft noch schlafen" } },
];

/** A ready-made plan: catalogue ids per weekday (Monday first), or one list for every day. */
export interface PlanTemplate {
  id: string;
  emoji: string;
  label: Localized;
  view: PlanView;
  /** One list for every day, or seven (Monday first). */
  days: string[] | string[][];
  /** The time of day a linked step belongs to: a morning routine's brushing is the morning one. */
  slots?: Record<string, Slot>;
  theme: string;
  title?: Localized;
  /** One line for grown-ups under its picture. */
  hint: Localized;
}

const KITA_DAY = ["fruehstueck", "kita", "mittagessen", "mittagsschlaf", "spielplatz", "abendessen", "schlafen"];
const HOME_DAY = ["fruehstueck", "ausflug", "mittagessen", "mittagsschlaf", "spielen", "abendessen", "schlafen"];

/** The gallery of the Tagesplan, day plans first; the first is the plan a new visitor sees. */
export const PLAN_TEMPLATES: PlanTemplate[] = [
  {
    id: "morgenroutine",
    emoji: "🌅",
    label: { de: "Morgenroutine" },
    view: "day",
    days: ["aufstehen", "anziehen", "fruehstueck", "zaehne", "schuhe"],
    slots: { zaehne: "morning" },
    theme: "sonne",
    title: { de: "Mein Morgen" },
    hint: { de: "Aufstehen, Anziehen, Frühstück, Zähne, Schuhe – jeden Morgen gleich" },
  },
  {
    id: "abendroutine",
    emoji: "🌙",
    label: { de: "Abendroutine" },
    view: "day",
    days: ["abendessen", "baden", "zaehne", "vorlesen", "schlafen"],
    slots: { zaehne: "evening" },
    theme: "nacht",
    title: { de: "Mein Abend" },
    hint: { de: "Essen, Baden, Zähne, Buch, Schlafen – ruhig in den Schlaf" },
  },
  {
    id: "erst-dann",
    emoji: "➡️",
    label: { de: "Erst – Dann" },
    view: "day",
    days: ["schuhe", "spielplatz"],
    theme: "wiese",
    title: { de: "Erst – Dann" },
    hint: { de: "Zwei große Karten: erst das eine, dann das Schöne" },
  },
  {
    id: "kita-tag",
    emoji: "🏫",
    label: { de: "Tagesablauf mit Kita" },
    view: "day",
    days: [KITA_DAY, KITA_DAY, KITA_DAY, KITA_DAY, KITA_DAY, HOME_DAY, HOME_DAY],
    theme: "meer",
    title: { de: "Mein Tag" },
    hint: { de: "Der ganze Tag in Bildern, am Wochenende ohne Kita" },
  },
  {
    id: "wochenplan",
    emoji: "📅",
    label: { de: "Wochenplan" },
    view: "week",
    days: [
      ["kita", "turnen"],
      ["kita", "oma"],
      ["kita", "schwimmen"],
      ["kita", "musik"],
      ["kita", "freunde"],
      ["einkaufen", "ausflug"],
      ["oma", "spielplatz"],
    ],
    theme: "beere",
    title: { de: "Meine Woche" },
    hint: { de: "Was ist wann? Kita, Oma, Schwimmen – und noch wie oft schlafen" },
  },
];

export const TASK_BY_ID = new Map(TASKS.map((t) => [t.id, t]));
/** Tasks and activities: everything a plan's step can come from. */
export const STEP_BY_ID = new Map([...ACTIVITIES, ...TASKS].map((t) => [t.id, t]));
export const REWARD_BY_ID = new Map(REWARDS.map((r) => [r.id, r]));
export const MARK_BY_ID = new Map(MARKS.map((m) => [m.id, m]));
export const THEME_BY_ID = new Map(THEMES.map((t) => [t.id, t]));
