import { useT } from "@/lib/language";

/** What a corner action does: take its thing away, or open the window to change it. */
export type SheetAct = "delete" | "configure";

/**
 * While a chart is made: a small round action in a corner of what it acts on – 🗑️ takes it away at once, ⚙️ opens its
 * window – on every card, the reward and a part's sign (user feedback, November 2026: a 🗑️ emoji in a ring was cut by
 * its circle and didn't read as an action). Drawn rather than an emoji, so it sits inside its ring. Under the mouse its
 * question („Morgens löschen?“) shows beside it and what a 🗑️ would take turns red (`rewards.css`). Pure markup:
 * `ChartEditor` does the change by `data-edit` and the other data it carries.
 */
export function SheetAction({
  act,
  ask,
  data,
  side = act === "delete" ? "right" : "left",
}: {
  act: SheetAct;
  /** Its question or name, shown under the mouse and read out („Zähne putzen löschen?“). */
  ask: string;
  /** `data-edit` and what it needs to know (`data-cell`, `data-part`, …). */
  data: Record<`data-${string}`, string | undefined>;
  /** The corner it sits in, so its question opens towards the thing and not off the sheet. */
  side?: "left" | "right";
}) {
  return (
    // An empty title keeps the card's own tooltip (its name) from showing over the question.
    <span className={`rw-act rw-act-${act} rw-act-${side}`} {...data} data-ask={ask} role="button" tabIndex={0} aria-label={ask} title="">
      <svg viewBox="0 0 24 24" aria-hidden>
        {act === "delete" ? (
          <path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5M10.2 10.5v6M13.8 10.5v6" />
        ) : (
          <>
            <circle cx="12" cy="12" r="5.4" />
            <circle cx="12" cy="12" r="1.8" />
            <path
              className="rw-act-teeth"
              d="M12 2.8v3.4M12 17.8v3.4M2.8 12h3.4M17.8 12h3.4M5.5 5.5l2.4 2.4M16.1 16.1l2.4 2.4M5.5 18.5l2.4-2.4M16.1 7.9l2.4-2.4"
            />
          </>
        )}
      </svg>
    </span>
  );
}

/**
 * ⚙️ in the reward's corner while the chart is made, the plan's and the board's alike. No 🗑️ (user feedback, November
 * 2026): „Ohne Belohnung“ is a reward to pick in its window like the others, so a chart always has one chosen.
 */
export function RewardActions() {
  const t = useT();
  return (
    <SheetAction
      act="configure"
      ask={t({
        de: "Belohnung ändern",
        en: "Change reward",
        zh: "修改奖励",
        hi: "इनाम बदलें",
        es: "Cambiar premio",
        ar: "تغيير المكافأة",
        ru: "Изменить награду",
      })}
      data={{ "data-edit": "reward" }}
    />
  );
}
