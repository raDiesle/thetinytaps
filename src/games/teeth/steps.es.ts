import type { StepId, StepTexts } from "./steps";

// The brushing steps in Spanish: the same pictures, said with tú and nothing that changes for a boy or a girl; muelas are the back teeth, "circulitos" the small circles.

/** Title, hint and spoken cue of the steps in Spanish, by step id; a text missing here is said in German (see stepText). */
export const STEP_TEXTS_ES: Partial<Record<StepId, Partial<StepTexts>>> = {
  "lower-top": {
    title: "⬇️ Muelas de abajo",
    hint: "Superficies de masticación de abajo: adelante y atrás",
    cue: "¡Abre bien la boca! Encima de las muelas de abajo. ¡Frota adelante y atrás!",
  },
  "upper-top": {
    title: "⬆️ Muelas de arriba",
    hint: "Superficies de masticación de arriba: adelante y atrás",
    cue: "Y ahora las muelas de arriba. ¡Adelante y atrás!",
  },
  "outer-left": {
    title: "⬅️ Por fuera, a un lado",
    hint: "Superficies exteriores: circulitos",
    cue: "¡Dientes juntos! Por fuera, a un lado. ¡Circulitos!",
  },
  "outer-front": {
    title: "😁 Por fuera, delante",
    hint: "Superficies exteriores: circulitos",
    cue: "Ahora delante. ¡Círculos, círculos, círculos!",
  },
  "outer-right": {
    title: "➡️ Por fuera, al otro lado",
    hint: "Superficies exteriores: circulitos",
    cue: "Y el otro lado. ¡Bonitos círculos!",
  },
  "inner-lower": {
    title: "👅 Por dentro, abajo",
    hint: "Superficies interiores: de rojo a blanco",
    cue: "¡Abre bien la boca! Ahora por dentro, abajo, donde está la lengua.",
  },
  "inner-upper": {
    title: "👅 Por dentro, arriba",
    hint: "Superficies interiores: de rojo a blanco",
    cue: "Y por dentro, arriba. ¡Ya casi está!",
  },
};
