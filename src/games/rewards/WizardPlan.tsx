import { useState } from "react";
import { type Localized, useT } from "@/lib/language";
import { weekday } from "./board";
import { ACTIVITIES, DAY_NAMES, TASKS, THEMES } from "./catalog";
import { CHILD_NAME, COLORS, LOOK, NAME_EXAMPLE, Pick } from "./pageParts";
import { ItemPic } from "./pictures";
import { MAX_STEPS, type Plan, type PlanStep, stepFromCatalog, withSame, withSteps } from "./plan";
import { PlanThumb } from "./PlanGallery";
import { useStepLabel } from "./PlanSheet";
import type { WizardStep } from "./Wizard";

/** A plan's own steps in the wizard, after the kind, the view and the Vorlage. */
export const PLAN_STEPS: WizardStep[] = [
  { id: "cards", label: { de: "Bilder", en: "Pictures", zh: "图片", hi: "तस्वीरें", es: "Imágenes", ar: "الصور", ru: "Картинки" } },
  { id: "look", label: LOOK },
];

/** „Zähneputzen entfernen“: the ✕ on a card in the row (the card's words already in the app language). */
const REMOVE: Localized<(card: string) => string> = {
  de: (card) => `${card} entfernen`,
  en: (card) => `Remove ${card}`,
  zh: (card) => `移除“${card}”`,
  hi: (card) => `${card} हटाएँ`,
  es: (card) => `Quitar ${card}`,
  ar: (card) => `إزالة ${card}`,
  ru: (card) => `Убрать: ${card}`,
};

/** „Welche Tage?“: the same plan every day or one for each weekday. */
const WHICH_DAYS: Localized = { de: "Welche Tage?", en: "Which days?", zh: "哪几天？", hi: "कौन-से दिन?", es: "¿Qué días?", ar: "أي أيام؟", ru: "Какие дни?" };

/** Cards a plan offers: the day's activities first, then the tasks of the Belohnungstafel (as under Gestalten). */
const OFFERED = [...ACTIVITIES, ...TASKS];

/**
 * One of a plan's steps in the wizard, every choice as a picture: the same day every day or one for each weekday, the
 * cards of a day as a row in their order with big picture cards to add, the colours as the plan in each colour.
 */
export function PlanStepView({ step, plan, onChange }: { step: string; plan: Plan; onChange: (plan: Plan) => void }) {
  const t = useT();
  const stepLabel = useStepLabel();
  const [editDay, setEditDay] = useState(() => weekday(new Date()));
  const steps = (plan.same ? plan.days[0] : plan.days[editDay]) ?? [];
  const setSteps = (next: PlanStep[]) => onChange(withSteps(plan, editDay, next));
  const move = (index: number, by: number) => {
    const next = [...steps];
    const [moved] = next.splice(index, 1);
    next.splice(index + by, 0, moved);
    setSteps(next);
  };
  const toggle = (catalogId: string) => {
    const own = steps.find((s) => s.catalog === catalogId);
    if (own) setSteps(steps.filter((s) => s !== own));
    else if (steps.length < MAX_STEPS) setSteps([...steps, stepFromCatalog(catalogId)]);
  };

  if (step === "cards")
    return (
      <>
        <h2>
          {t({
            de: "Was kommt nacheinander?",
            en: "What comes in what order?",
            zh: "按什么顺序来？",
            hi: "क्या किसके बाद आता है?",
            es: "¿Qué viene después de qué?",
            ar: "ما الذي يأتي بالترتيب؟",
            ru: "Что за чем идёт?",
          })}
        </h2>
        <h3 className="rw-wizard-sub">{t(WHICH_DAYS)}</h3>
        <div className="rw-picks rw-picks-tiles" role="group" aria-label={t(WHICH_DAYS)}>
          <Pick
            selected={plan.same}
            onClick={() => onChange(withSame(plan, true, editDay))}
            emoji="🔁"
            label={t({
              de: "Jeden Tag gleich",
              en: "Same every day",
              zh: "每天都一样",
              hi: "हर दिन एक जैसा",
              es: "Igual todos los días",
              ar: "كل يوم بالشكل نفسه",
              ru: "Каждый день одинаково",
            })}
          />
          <Pick
            selected={!plan.same}
            onClick={() => onChange(withSame(plan, false, editDay))}
            emoji="📅"
            label={t({
              de: "Jeder Wochentag eigen",
              en: "Each weekday its own",
              zh: "每天各不相同",
              hi: "हर दिन अलग",
              es: "Cada día distinto",
              ar: "لكل يوم خطته",
              ru: "Свой план на каждый день",
            })}
          />
        </div>
        {!plan.same && (
          <div
            className="rw-chips pl-day-chips"
            role="group"
            aria-label={t({ de: "Tag bearbeiten", en: "Edit day", zh: "编辑哪一天", hi: "दिन बदलें", es: "Editar día", ar: "تعديل اليوم", ru: "Изменить день" })}
          >
            {t(DAY_NAMES).map((name, i) => (
              <button key={name} type="button" className={i === editDay ? "selected" : undefined} aria-pressed={i === editDay} onClick={() => setEditDay(i)}>
                {name} <span className="pl-day-count">{plan.days[i].map((s) => s.emoji).join("")}</span>
              </button>
            ))}
          </div>
        )}
        {steps.length > 0 ? (
          <ol className="rw-wizard-row" aria-label={t({ de: "Reihenfolge", en: "Order", zh: "顺序", hi: "क्रम", es: "Orden", ar: "الترتيب", ru: "Порядок" })}>
            {steps.map((s, i) => (
              <li key={s.id}>
                <span className="rw-wizard-card">
                  <span className="rw-wizard-card-number" aria-hidden>
                    {i + 1}
                  </span>
                  <span className="rw-pick-emoji" aria-hidden>
                    <ItemPic item={s} />
                  </span>
                  <span className="rw-wizard-card-label">{stepLabel(s)}</span>
                </span>
                <span className="rw-wizard-card-buttons">
                  <button
                    type="button"
                    disabled={i === 0}
                    aria-label={t({ de: "Früher", en: "Move earlier", zh: "往前移", hi: "पहले करें", es: "Mover antes", ar: "تقديم", ru: "Раньше" })}
                    onClick={() => move(i, -1)}
                  >
                    ‹
                  </button>
                  <button type="button" aria-label={t(REMOVE)(stepLabel(s))} onClick={() => setSteps(steps.filter((own) => own !== s))}>
                    ✕
                  </button>
                  <button
                    type="button"
                    disabled={i === steps.length - 1}
                    aria-label={t({ de: "Später", en: "Move later", zh: "往后移", hi: "बाद में करें", es: "Mover después", ar: "تأخير", ru: "Позже" })}
                    onClick={() => move(i, 1)}
                  >
                    ›
                  </button>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rw-wizard-empty">
            {t({
              de: "Noch keine Karte – unten antippen, was als Erstes kommt.",
              en: "No card yet – tap below what comes first.",
              zh: "还没有卡片——在下面点选最先要做的事。",
              hi: "अभी कोई कार्ड नहीं – नीचे चुनें कि सबसे पहले क्या आता है।",
              es: "Aún no hay tarjetas: toque abajo lo que va primero.",
              ar: "لا توجد بطاقة بعد – انقروا في الأسفل على ما يأتي أولًا.",
              ru: "Пока нет карточек – выберите внизу, что идёт первым.",
            })}
          </p>
        )}
        <div
          className="rw-picks rw-picks-tiles"
          role="group"
          aria-label={t({
            de: "Karte dazu",
            en: "Add a card",
            zh: "添加卡片",
            hi: "कार्ड जोड़ें",
            es: "Añadir tarjeta",
            ar: "إضافة بطاقة",
            ru: "Добавить карточку",
          })}
        >
          {OFFERED.map((item) => {
            const on = steps.some((s) => s.catalog === item.id);
            return (
              <Pick
                key={item.id}
                selected={on}
                disabled={!on && steps.length >= MAX_STEPS}
                onClick={() => toggle(item.id)}
                emoji={<ItemPic item={{ emoji: item.emoji, catalog: item.id }} />}
                label={t(item.label)}
              />
            );
          })}
        </div>
        <p className="setting-note">
          {t({
            de: "Drei bis sechs Bilder reichen für Zwei- und Dreijährige. Antippen nimmt eine Karte dazu oder wieder weg, ‹ › ändern die Reihenfolge. Eigene Karten und eigene Wörter gibt es danach unter „Gestalten“.",
            en: "Three to six pictures are enough for two- and three-year-olds. A tap adds a card or takes it away, ‹ › change the order. Your own cards and words can be added later under “Design”.",
            zh: "对两三岁的孩子来说，三到六张图就够了。点一下添加或移除卡片，‹ › 调整顺序。自定义卡片和文字之后可在“设计”里添加。",
            hi: "दो-तीन साल के बच्चों के लिए तीन से छह तस्वीरें काफ़ी हैं। टैप करने से कार्ड जुड़ता या हटता है, ‹ › से क्रम बदलता है। अपने कार्ड और अपने शब्द बाद में „डिज़ाइन“ में जोड़ें।",
            es: "De tres a seis imágenes bastan para niños de dos y tres años. Al tocar una tarjeta, se añade o se quita; ‹ › cambian el orden. Las tarjetas y palabras propias se añaden después en «Diseñar».",
            ar: "تكفي من ثلاث إلى ست صور للأطفال في عمر سنتين وثلاث سنوات. النقر يضيف بطاقة أو يزيلها، و‹ › تغيّران الترتيب. يمكن إضافة بطاقات وكلمات خاصة لاحقًا في «تصميم».",
            ru: "Для двух- и трёхлеток хватает трёх–шести картинок. Касание добавляет карточку или убирает её, ‹ › меняют порядок. Свои карточки и слова можно добавить потом в разделе «Оформление».",
          })}
        </p>
      </>
    );

  return (
    <>
      <h2>
        {t({
          de: "Für wen ist der Plan?",
          en: "Who is the plan for?",
          zh: "这份日程表是给谁的？",
          hi: "यह योजना किसके लिए है?",
          es: "¿Para quién es el plan?",
          ar: "لمن هذه الخطة؟",
          ru: "Для кого план?",
        })}
      </h2>
      <label className="rw-input">
        <span>{t(CHILD_NAME)}</span>
        <input
          type="text"
          value={plan.childName}
          maxLength={24}
          placeholder={t(NAME_EXAMPLE)}
          onChange={(e) => onChange({ ...plan, childName: e.target.value })}
        />
      </label>
      <h3 className="rw-wizard-sub">{t(COLORS)}</h3>
      <div className="rw-picks rw-picks-small" role="group" aria-label={t(COLORS)}>
        {THEMES.map((theme) => (
          <Pick
            key={theme.id}
            selected={theme.id === plan.theme}
            onClick={() => onChange({ ...plan, theme: theme.id })}
            picture={<PlanThumb plan={{ ...plan, theme: theme.id }} />}
            label={t(theme.label)}
          />
        ))}
      </div>
    </>
  );
}
