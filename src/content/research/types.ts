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
