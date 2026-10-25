/** S: a few hours, M: a day or two, L: several days or more. */
export type Effort = "S" | "M" | "L";

export interface Idea {
  /** Area prefix and number, e.g. "N-04". */
  id: string;
  emoji: string;
  title: string;
  /** What it is and how it plays. */
  text: string;
  /** What the child gets out of it, or why it is worth doing. */
  why?: string;
  effort: Effort;
  /** Already on the README roadmap or in the "bald" list. */
  planned?: boolean;
  /** Already in the app. */
  done?: boolean;
  /** Partly in the app: what is there already, so the rest is clear. */
  partial?: string;
  /** Decided against it: stays in the list (and keeps its number) so it isn't suggested again. */
  rejected?: boolean;
}

export type IdeaStatus = "done" | "partial" | "open" | "rejected";

/** A rejected idea counts as rejected even if a part of it is in the app, so nobody builds the rest. */
export const ideaStatus = (idea: Idea): IdeaStatus => (idea.done ? "done" : idea.rejected ? "rejected" : idea.partial ? "partial" : "open");

export interface IdeaArea {
  prefix: string;
  emoji: string;
  title: string;
  /** Short note that holds for every idea of the area. */
  intro?: string;
  ideas: Idea[];
}

export const EFFORT_LABELS: Record<Effort, string> = {
  S: "klein",
  M: "mittel",
  L: "groß",
};
