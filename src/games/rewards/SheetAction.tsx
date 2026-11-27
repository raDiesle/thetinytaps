import { type EnglishFirst, type Localized, useT } from "@/lib/language";

/** What an action on the sheet does: take its thing away, swap its picture, or open the window to change it. */
export type SheetAct = "delete" | "swap" | "configure";

/**
 * While a chart is made: a small action on what it acts on, a drawn sign with a few small words beside it, always seen
 * (user request, 27 November 2026: „Schritt hinzufügen“, „Bild austauschen“ written small at every action) – 🗑️
 * „Löschen“ takes it away at once, ⇄ „Bild austauschen“ opens the pictures to swap it for, ⚙️ opens its window. Where
 * it sits is its place's CSS: on a card the bin is a tab growing out of the card's frame above its top left corner, the
 * swap sits on the picture's top right corner, part of the picture (`rewards.css`, `planner.css`). Drawn rather than an
 * emoji, so it sits inside its ring (user feedback, November 2026: a 🗑️ emoji in a ring was cut by its circle). Under
 * the mouse its question („„Morgens“ löschen?“) shows and what a 🗑️ would take turns red. Pure markup: `ChartEditor`
 * does the change by `data-edit` and the other data it carries.
 */
export function SheetAction({
  act,
  ask,
  label,
  data,
  side = act === "delete" ? "left" : "right",
}: {
  act: SheetAct;
  /** Its question or whole name, shown under the mouse and read out („Zähne putzen löschen?“). */
  ask: string;
  /** Its few words beside the sign; by default „Löschen“, „Bild austauschen“ or „Ändern“. */
  label?: string;
  /** `data-edit` and what it needs to know (`data-cell`, `data-part`, …). */
  data: Record<`data-${string}`, string | undefined>;
  /** The side it sits on, so its question opens towards the thing and not off the sheet. */
  side?: "left" | "right";
}) {
  const t = useT();
  const words = label ?? t(ACT_LABELS[act]);
  return (
    // An empty title keeps the card's own tooltip (its name) from showing over the question.
    <span className={`rw-act rw-act-${act} rw-act-${side}`} {...data} data-ask={ask} role="button" tabIndex={0} aria-label={ask} title="">
      <span className="rw-act-sign" aria-hidden>
        <ActSign act={act} />
      </span>
      <span className="rw-act-text" aria-hidden>
        {words}
      </span>
    </span>
  );
}

/** The drawn sign of an action: a bin, two arrows going round, or a gear. */
function ActSign({ act }: { act: SheetAct }) {
  return (
    <svg viewBox="0 0 24 24">
      {act === "delete" ? (
        <path d="M4 6.5h16M9.5 6.5V4h5v2.5M6.5 6.5l1 13.5h9l1-13.5M10.2 10.5v6M13.8 10.5v6" />
      ) : act === "swap" ? (
        <path d="M4.5 9.5a7.5 7.5 0 0 1 13.4-3.2M19.5 14.5a7.5 7.5 0 0 1-13.4 3.2M18.6 2.8v3.9h-3.9M5.4 21.2v-3.9h3.9" />
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
  );
}

/** The words beside each action's sign, where its place gives none of its own. */
const ACT_LABELS: Record<SheetAct, EnglishFirst> = {
  delete: { en: "Delete", de: "Löschen", zh: "删除", hi: "मिटाएँ", es: "Borrar", ar: "حذف", ru: "Удалить" },
  swap: { en: "Swap picture", de: "Bild austauschen", zh: "换图片", hi: "तस्वीर बदलें", es: "Cambiar imagen", ar: "تبديل الصورة", ru: "Сменить картинку" },
  configure: { en: "Change", de: "Ändern", zh: "修改", hi: "बदलें", es: "Cambiar", ar: "تغيير", ru: "Изменить" },
};

/**
 * A plus drawn as two strokes in the middle of its box (user feedback, 27 November 2026: the typed ＋ sat off the middle
 * of its round buttons, as a font's plus does) – every ＋ and − to tap on a chart being made is drawn so. `minus` leaves
 * the upright stroke out.
 */
export function PlusSign({ minus = false }: { minus?: boolean }) {
  return (
    <svg className="rw-plus-sign" viewBox="0 0 24 24" aria-hidden>
      <path d={minus ? "M5 12h14" : "M12 5v14M5 12h14"} />
    </svg>
  );
}

/**
 * ⇄ „Belohnung ändern“ on the reward while the chart is made, the plan's and the board's alike. No 🗑️ (user feedback,
 * November 2026): „Ohne Belohnung“ is a reward to pick in its window like the others, so a chart always has one chosen.
 */
export function RewardActions() {
  const t = useT();
  return <SheetAction act="swap" ask={t(CHANGE_REWARD)} label={t(CHANGE_REWARD)} data={{ "data-edit": "reward" }} />;
}

/** The tooltip and read-out name of a tap that opens the rewards on a chart being made. */
export const CHANGE_REWARD: Localized = {
  de: "Belohnung ändern",
  en: "Change reward",
  zh: "修改奖励",
  hi: "इनाम बदलें",
  es: "Cambiar premio",
  ar: "تغيير المكافأة",
  ru: "Изменить награду",
};

/** The tooltip of the small „＋ 🎁 Belohnung“ tag while a chart without a reward is made. */
export const ADD_REWARD: Localized = {
  en: "Add a reward",
  de: "Belohnung hinzufügen",
  zh: "添加奖励",
  hi: "इनाम जोड़ें",
  es: "Añadir un premio",
  ar: "إضافة مكافأة",
  ru: "Добавить награду",
};
