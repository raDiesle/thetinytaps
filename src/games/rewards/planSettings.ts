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

/** The first plan: a morning routine, the same every day. A fixed id, so its ticks stay before anything is saved. */
const FIRST: Plan = { ...planFromTemplate(PLAN_TEMPLATES[0]), id: "erster-plan" };

export const DEFAULT_PLANNER_SETTINGS: PlannerSettings = {
  plans: [FIRST],
  current: FIRST.id,
  print: { orientation: "auto", color: true, cards: true },
  speech: false,
  sounds: true,
};

/** Plans and print options; the ticks live with the Belohnungstafel's stars (`REWARDS_STARS_KEY`), by plan id. */
export const PLANNER_SETTINGS_KEY = "tinytaps.planner.v1";
