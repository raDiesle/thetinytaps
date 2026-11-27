import type { Daytime } from "@/lib/days";
import type { DaytimeTexts } from "./daytime";

/** The morning and evening texts in Spanish; a text missing here is said in German (see daytimeText). */
export const DAYTIME_ES: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "¡Buenos días!",
    after: "¡Ya puede empezar el día!",
  },
  evening: {
    hello: "Pronto es hora de dormir.",
    after: "Ahora, a la cama. ¡Buenas noches!",
  },
};
