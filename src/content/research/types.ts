// Research for grown-ups, shown on the hidden page /management/recherchen/ by topic: what was
// looked up, how, what came out and which ideas it led to.
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

/**
 * The topics the research page (/management/recherchen/) groups its studies by, in the order of its contents: a study
 * is found by what it is about, not only by its date (user request, November 2026). A new kind of study gets its topic here.
 */
export const RESEARCH_AREAS = {
  kinder: { emoji: "🧒", title: "Kinder und Erziehung", about: "Was Fachbücher und Fachstellen raten – Grundlage für Geschichten und Spiele." },
  suchen: { emoji: "🔎", title: "Was Eltern suchen", about: "Suchwörter bei Google und YouTube, und welche Spiele sie schon beantworten." },
  youtube: { emoji: "📺", title: "YouTube", about: "Kanal, Rechte und Suchwörter für die Videos aus den Spielen." },
  spiele: { emoji: "🎨", title: "Spiele und Bilder prüfen", about: "Ob Inhalte der Spiele zueinander passen und sich unterscheiden lassen." },
  name: { emoji: "🏷️", title: "Name und Adressen", about: "Domains und Namen, was frei war und warum gewählt." },
  recht: { emoji: "⚖️", title: "Recht und Datenschutz", about: "Was erlaubt ist, was gemessen werden darf und was zu beachten ist." },
  technik: { emoji: "⚙️", title: "Technik und Leistung", about: "Wie schnell und wie groß die Seite ist, und was Google von ihr sieht." },
  geld: { emoji: "💶", title: "Kosten und Geschäft", about: "Was Bilder und Aufnahmen kosten, und was sich verkaufen ließe." },
} as const;

/** Key of a research topic in `RESEARCH_AREAS`. */
export type ResearchArea = keyof typeof RESEARCH_AREAS;

/** One piece of research with its results. */
export interface Research {
  id: string;
  /** What it is about, for the research page's contents. */
  area: ResearchArea;
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
