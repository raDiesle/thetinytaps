import type { StarLog } from "./board";
import { PLAN_TEMPLATES } from "./catalog";
import { type Plan, planFromTemplate } from "./plan";
import type { PlanPrintOptions } from "./PlanPrint";

export interface PlannerSettings {
  plans: Plan[];
  /** Id of the plan shown. */
  current: string;
  print: PlanPrintOptions;
  speech: boolean;
  sounds: boolean;
}

/** The plan older versions showed before anything was saved (a morning routine, fixed id): kept only where it has ticks. */
const OLD_FIRST: Plan = { ...planFromTemplate(PLAN_TEMPLATES[0]), id: "erster-plan" };

/** No plan yet: the page opens with the wizard until a board or plan is made. */
export const DEFAULT_PLANNER_SETTINGS: PlannerSettings = {
  plans: [],
  current: "",
  print: { orientation: "auto", color: true, cards: true },
  speech: false,
  sounds: true,
};

/** The defaults on this device: none, or the old first plan while its ticks are kept and nothing was saved over it. */
export const plannerDefaults = (log: StarLog): PlannerSettings =>
  log[OLD_FIRST.id] ? { ...DEFAULT_PLANNER_SETTINGS, plans: [OLD_FIRST], current: OLD_FIRST.id } : DEFAULT_PLANNER_SETTINGS;

/** Plans and print options; the ticks live with the Belohnungstafel's stars (`REWARDS_STARS_KEY`), by plan id. */
export const PLANNER_SETTINGS_KEY = "tinytaps.planner.v1";
