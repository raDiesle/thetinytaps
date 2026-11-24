import { toothKey, type Surface, type ToothId } from "./jaw";
import { STEPS } from "./steps";

// The teeth start a little yellow and grey and turn white as they are brushed (user request, November 2026): every face
// a step brushes is stained until the brush has taken all of its monsters off.

/** A face of a tooth and its surface, the key a stained face goes by. */
export const faceKey = (id: ToothId, surface: Surface) => `${toothKey(id)}:${surface}`;

/** What a stain needs to know of a monster: which step brushes it and on which tooth it sits. */
export interface MonsterOnTooth {
  step: number;
  tooth: ToothId;
}

/**
 * The faces not brushed yet (`faceKey`): those of the steps still to come, and of the step running now (`phase`) those
 * whose monsters are not all `gone`. Before the brushing (`phase` -1) every face a step brushes; once it is done
 * (`phase` past the last step) none.
 */
export function dirtyFaces<M extends MonsterOnTooth>(phase: number, monsters: readonly M[], gone: (m: M) => boolean): string[] {
  return STEPS.flatMap((step, k) =>
    k < phase
      ? []
      : step.teeth
          .filter((tooth) => k > phase || monsters.some((m) => m.step === k && toothKey(m.tooth) === toothKey(tooth) && !gone(m)))
          .map((tooth) => faceKey(tooth, step.surface)),
  );
}
