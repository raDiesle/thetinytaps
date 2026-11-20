// Something small and what it becomes, for "Was wird aus mir?" (Z-12): caterpillar and butterfly, egg and chick,
// seed and sunflower, tadpole and frog, acorn and tree, bulb and tulip, pumpkin seed and pumpkin, coconut and palm,
// bud and rose; the eggs of the turtle, crocodile, dinosaur, penguin, snake and fish, the bee's larva, and the seeds of
// carrot, maize, dandelion and strawberry. The small one is drawn in a 200 × 200 box, standing on its bottom edge, in
// two layers: `back` behind what it becomes (an emoji, as on the plates below) and `front` before it (the egg's lower
// shell and the nest, the soil, the pot). The parts with an `ap-grow-…` class move once the box is `.growing`
// (animals.css): the caterpillar climbs up and spins itself in, the eggs wobble and crack (`crackingEgg`), the snake's
// soft egg bulges and splits, the fish wriggles out of its clear egg, the larva is capped in its cell, the seeds, the
// acorn and the bulb sink in and sprout, the dandelion's seed floats down on its umbrella, the tadpole grows legs and
// loses its tail, the coconut sprouts where it lies, the bud swells and opens.

import { byLanguage } from "@/content/texts";
import type { Localized } from "@/lib/language";
import { GROWTHS } from "./growthList";
import type { Growth, GrowthId } from "./growthTypes";

export { GROWTHS };
export type { Growth, GrowthId };

/** Time to watch it become it (after the picked one flew up into it) before the next round comes. */
export const GROW_MS = 3900;
/**
 * Small ones never offered together in one round (`dealGrow`): the grown one of each could, to a child, also come
 * out of the other, so it would be a wrong choice the child could rightly pick. Any two in one group are never dealt
 * together. Every plant is alike to every other: flowers look alike, trees look alike, and no child can see which
 * seed, nut, bulb or bud becomes which plant. A new small one joins a group, or starts one with what it looks like
 * (every egg is alike to every other egg, the bee's larva to the caterpillar); every growth must keep at least three
 * others it is not alike to, for the four choices of the hardest steps (`content.test.ts`).
 */
export const GROW_LOOKALIKES: GrowthId[][] = [
  // Every plant (`plant`).
  ["samen", "eichel", "zwiebel", "kuerbiskern", "kokosnuss", "knospe", "karottensamen", "maiskorn", "schirmchen", "erdbeersamen"],
  // Every egg: a child can't tell which egg the chick, the turtle or the dinosaur comes out of.
  ["ei", "schildkroetenei", "krokodilei", "dinoei", "pinguinei", "schlangenei", "fischei"],
  // The larvae: the caterpillar's and the bee's.
  ["raupe", "larve"],
  // What comes out of the water by the pond or the river: the frog comes from eggs in the water too.
  ["kaulquappe", "fischei", "krokodilei"],
];

/** Whether `a` and `b` are never offered together (`GROW_LOOKALIKES`). */
export const growLookAlike = (a: Growth, b: Growth) => GROW_LOOKALIKES.some((group) => group.includes(a.id) && group.includes(b.id));

/**
 * The small one in its box; `growing` sets it off becoming what it becomes, which shows at the end (`label` names it
 * for screen readers). Without `growing` only the small one shows, as behind a wrong plate.
 */
export function GrowthPicture({ growth, growing = false, label }: { growth: Growth; growing?: boolean; label?: string }) {
  return (
    <span className={`ap-grow-box grow-${growth.id}${growing ? " growing" : ""}`} role="img" aria-label={label} aria-hidden={label ? undefined : true}>
      <svg className="ap-grow-layer" viewBox="0 0 200 200" aria-hidden>
        {growth.back}
      </svg>
      {growing && (
        <span
          className="ap-grow-adult ap-emoji"
          style={{ left: `${growth.spot[0] / 2}%`, top: `${growth.spot[1] / 2}%`, fontSize: `${growth.size * 100}cqw` }}
          aria-hidden
        >
          {growth.emoji}
        </span>
      )}
      {growth.front && (
        <svg className="ap-grow-layer" viewBox="0 0 200 200" aria-hidden>
          {growth.front}
        </svg>
      )}
    </span>
  );
}

const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase("de-DE") + text.slice(1);

/** What "Was wird aus mir?" says, in one language. */
export interface GrowTexts {
  /** The small one's name, for screen readers: "Raupe". */
  young: (g: Growth) => string;
  /** What it becomes, for screen readers: "Schmetterling". */
  adult: (g: Growth) => string;
  /** The question: "Was wird aus der Raupe?". */
  whatBecomes: (g: Growth) => string;
  /** The right pick: "Aus der Raupe wird ein Schmetterling. Toll!". */
  becomes: (g: Growth) => string;
  /** A wrong pick, while the small one it comes from pops up: "Der Frosch kommt aus der Kaulquappe!". */
  comesFrom: (g: Growth) => string;
}

const GERMAN_GROW_TEXTS: GrowTexts = {
  young: (g) => g.young,
  adult: (g) => g.adult,
  whatBecomes: (g) => `Was wird aus ${g.fromThe}?`,
  becomes: (g) => `Aus ${g.fromThe} wird ${g.a}. Toll!`,
  comesFrom: (g) => `${capitalize(g.the)} kommt aus ${g.fromThe}!`,
};

/** The texts of "Was wird aus mir?" by app language (the other languages in content.<lang>.ts, `growth`): `pick(GROW_TEXTS, language.id)`. */
export const GROW_TEXTS: Localized<GrowTexts> = byLanguage((texts) => texts.animals?.growth(GERMAN_GROW_TEXTS), GERMAN_GROW_TEXTS);
