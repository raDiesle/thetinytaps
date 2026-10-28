import type { Daytime, DaytimeTexts } from "./daytime";

/** The morning and evening texts in Spanish; a text missing here is said in German (see daytimeText). */
export const DAYTIME_ES: Record<Daytime, Partial<DaytimeTexts>> = {
  morning: {
    hello: "¡Buenos días!",
    grow: "Por la noche, el azúcar se convierte en monstruos de azúcar.",
    doneTitle: "☀️ ¡Relucientes!",
    after: "¡Ya puede empezar el día!",
  },
  evening: {
    hello: "Pronto es hora de dormir.",
    grow: "Durante todo el día, el azúcar se convierte en monstruos de azúcar.",
    doneTitle: "🌙 ¡Buenas noches!",
    after: "Ahora, a la cama. ¡Buenas noches!",
  },
};
