import type { StepId, StepTexts } from "./steps";

// The brushing steps in English: the same pictures, said the way one says it to a toddler: "back teeth", "small circles", "from red to white".

/** Title, hint and spoken cue of the steps in English, by step id; a text missing here is said in German (see stepText). */
export const STEP_TEXTS_EN: Partial<Record<StepId, Partial<StepTexts>>> = {
  "lower-top": {
    title: "⬇️ Lower back teeth",
    hint: "Chewing surfaces below: back and forth",
    cue: "Open wide! On the back teeth at the bottom. Scrub back and forth!",
  },
  "upper-top": {
    title: "⬆️ Upper back teeth",
    hint: "Chewing surfaces above: back and forth",
    cue: "And now on the back teeth at the top. Back and forth!",
  },
  "outer-left": {
    title: "⬅️ Outside, on the side",
    hint: "Outer surfaces: small circles",
    cue: "Teeth together! Outside, on the side. Small circles!",
  },
  "outer-front": {
    title: "😁 Outside, in front",
    hint: "Outer surfaces: small circles",
    cue: "Now in front. Circles, circles, circles!",
  },
  "outer-right": {
    title: "➡️ Outside, on the side",
    hint: "Outer surfaces: small circles",
    cue: "And the other side. Nice circles!",
  },
  "inner-lower": {
    title: "👅 Inside, bottom",
    hint: "Inner surfaces: from red to white",
    cue: "Open wide! Now inside at the bottom, where the tongue is.",
  },
  "inner-upper": {
    title: "👅 Inside, top",
    hint: "Inner surfaces: from red to white",
    cue: "And inside at the top. Almost done!",
  },
};
