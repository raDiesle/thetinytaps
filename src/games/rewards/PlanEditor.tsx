import { useState } from "react";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { newId, weekday } from "./board";
import { ACTIVITIES, DAY_NAMES, SLOTS, STEP_BY_ID, TASKS, THEMES } from "./catalog";
import { ItemPic } from "./pictures";
import { MAX_STEPS, type Plan, type PlanStep, stepFromCatalog, stepsOn, withSame, withSteps } from "./plan";
import { usePlanTitle, useStepLabel } from "./PlanSheet";

/** Steps a plan offers to add: the day's activities first, then the tasks of the Belohnungstafel. */
const OFFERED = [...ACTIVITIES, ...TASKS];

/**
 * Everything a grown-up can change on a plan: name and heading, every day the same or each weekday its own, the steps
 * of a day (from pictures or their own, in order), when a brushing counts, colours – and starting today over or
 * removing the plan.
 */
export function PlanEditor({
  plan,
  day,
  onChange,
  onRestartToday,
  onRemove,
}: {
  plan: Plan;
  /** The day shown: its weekday is edited first. */
  day: Date;
  onChange: (plan: Plan) => void;
  onRestartToday: () => void;
  /** Missing when it is the only plan. */
  onRemove?: () => void;
}) {
  const t = useT();
  const stepLabel = useStepLabel();
  const autoTitle = usePlanTitle()({ ...plan, title: "" });
  const [editDay, setEditDay] = useState(weekday(day));
  const dayNames = t(DAY_NAMES);
  // The weekday edited and Monday–Friday, in the app language's short names.
  const edited = dayNames[editDay];
  const workdays = `${dayNames[0]}–${dayNames[4]}`;
  const steps = plan.same ? plan.days[0] : plan.days[editDay];
  const setSteps = (next: PlanStep[]) => onChange(withSteps(plan, editDay, next));
  const setStep = (id: string, patch: Partial<PlanStep>) => setSteps(steps.map((step) => (step.id === id ? { ...step, ...patch } : step)));
  const move = (index: number, by: number) => {
    const next = [...steps];
    const [step] = next.splice(index, 1);
    next.splice(index + by, 0, step);
    setSteps(next);
  };
  const add = (step: PlanStep) => steps.length < MAX_STEPS && setSteps([...steps, step]);
  /** This day's steps on other weekdays too (fresh ids, the ticks of those days are their own anyway). */
  const copyTo = (days: number[]) =>
    onChange({ ...plan, days: plan.days.map((list, i) => (days.includes(i) && i !== editDay ? steps.map((step) => ({ ...step })) : list)) });

  return (
    <section className="settings rw-editor pl-editor">
      <SettingsGroup
        title={t({
          de: "Name und Überschrift",
          en: "Name and heading",
          zh: "名字和标题",
          hi: "नाम और शीर्षक",
          es: "Nombre y título",
          ar: "الاسم والعنوان",
          ru: "Имя и заголовок",
        })}
      >
        <label className="rw-input">
          <span>
            {t({
              de: "Name des Kindes (steht in der Überschrift, bleibt auf diesem Gerät)",
              en: "Child’s name (shown in the heading, stays on this device)",
              zh: "孩子的名字（显示在标题里，只保存在本设备上）",
              hi: "बच्चे का नाम (शीर्षक में दिखेगा, इसी डिवाइस पर रहेगा)",
              es: "Nombre del peque (aparece en el título y se queda en este dispositivo)",
              ar: "اسم الطفل (يظهر في العنوان ويبقى على هذا الجهاز)",
              ru: "Имя ребёнка (стоит в заголовке, хранится только на этом устройстве)",
            })}
          </span>
          <input
            type="text"
            value={plan.childName}
            maxLength={24}
            placeholder={t({
              de: "z. B. Lena",
              en: "e.g. Emma",
              zh: "例如：小美",
              hi: "जैसे: मीरा",
              es: "p. ej., Lucía",
              ar: "مثلًا: ليلى",
              ru: "например, Лена",
            })}
            onChange={(e) => onChange({ ...plan, childName: e.target.value })}
          />
        </label>
        <label className="rw-input">
          <span>{t({ de: "Überschrift", en: "Heading", zh: "标题", hi: "शीर्षक", es: "Título", ar: "العنوان", ru: "Заголовок" })}</span>
          <input type="text" value={plan.title} maxLength={40} placeholder={autoTitle} onChange={(e) => onChange({ ...plan, title: e.target.value })} />
        </label>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Schritte", en: "Steps", zh: "步骤", hi: "कदम", es: "Pasos", ar: "الخطوات", ru: "Шаги" })}>
        <Choice
          label={t({ de: "Welche Tage?", en: "Which days?", zh: "哪几天？", hi: "कौन-से दिन?", es: "¿Qué días?", ar: "أيّ الأيام؟", ru: "Какие дни?" })}
          value={plan.same ? "same" : "own"}
          onChange={(value) => onChange(withSame(plan, value === "same", editDay))}
          options={[
            {
              value: "same",
              label: t({
                de: "Jeden Tag gleich",
                en: "The same every day",
                zh: "每天都一样",
                hi: "हर दिन एक जैसा",
                es: "Igual cada día",
                ar: "كل يوم بالشكل نفسه",
                ru: "Каждый день одинаково",
              }),
            },
            {
              value: "own",
              label: t({
                de: "Jeder Wochentag eigen",
                en: "Each weekday its own",
                zh: "每天各不相同",
                hi: "हर दिन का अपना",
                es: "Cada día de la semana distinto",
                ar: "لكل يوم من الأسبوع خطته",
                ru: "Свой план на каждый день",
              }),
            },
          ]}
        />
        {!plan.same && (
          <>
            <div
              className="rw-chips pl-day-chips"
              role="group"
              aria-label={t({
                de: "Tag bearbeiten",
                en: "Edit a day",
                zh: "编辑哪一天",
                hi: "दिन बदलें",
                es: "Editar día",
                ar: "تعديل اليوم",
                ru: "Изменить день",
              })}
            >
              {dayNames.map((name, i) => (
                <button key={name} type="button" className={i === editDay ? "selected" : undefined} aria-pressed={i === editDay} onClick={() => setEditDay(i)}>
                  {name} <span className="pl-day-count">{plan.days[i].map((step) => step.emoji).join("")}</span>
                </button>
              ))}
            </div>
            <div className="rw-chips">
              <button type="button" onClick={() => copyTo([0, 1, 2, 3, 4])}>
                {t({
                  de: `${edited} auch für ${workdays}`,
                  en: `Copy ${edited} to ${workdays}`,
                  zh: `把${edited}复制到${workdays}`,
                  hi: `${edited} को ${workdays} पर भी लगाएँ`,
                  es: `Copiar ${edited} a ${workdays}`,
                  ar: `نسخ ${edited} إلى ${workdays}`,
                  ru: `${edited} – также на ${workdays}`,
                })}
              </button>
              <button type="button" onClick={() => copyTo([0, 1, 2, 3, 4, 5, 6])}>
                {t({
                  de: `${edited} für alle Tage`,
                  en: `Copy ${edited} to every day`,
                  zh: `把${edited}复制到每一天`,
                  hi: `${edited} को सभी दिनों पर लगाएँ`,
                  es: `Copiar ${edited} a todos los días`,
                  ar: `نسخ ${edited} إلى كل الأيام`,
                  ru: `${edited} – на все дни`,
                })}
              </button>
            </div>
          </>
        )}
        <ol className="rw-tasks">
          {steps.map((step, i) => {
            const catalog = step.catalog ? STEP_BY_ID.get(step.catalog) : undefined;
            return (
              <li key={step.id} className="rw-task-edit">
                <span className="pl-edit-number" aria-hidden>
                  {i + 1}
                </span>
                <input
                  type="text"
                  className="rw-emoji-input"
                  value={step.emoji}
                  maxLength={8}
                  aria-label={t({
                    de: "Bild (Emoji)",
                    en: "Picture (emoji)",
                    zh: "图片（表情符号）",
                    hi: "तस्वीर (इमोजी)",
                    es: "Imagen (emoji)",
                    ar: "صورة (إيموجي)",
                    ru: "Картинка (эмодзи)",
                  })}
                  onChange={(e) => setStep(step.id, { emoji: e.target.value })}
                />
                <input
                  type="text"
                  className="rw-label-input"
                  value={step.label ?? ""}
                  maxLength={32}
                  placeholder={
                    catalog
                      ? t(catalog.label)
                      : t({
                          de: "Was kommt?",
                          en: "What’s next?",
                          zh: "接下来是什么？",
                          hi: "आगे क्या है?",
                          es: "¿Qué toca?",
                          ar: "ماذا يأتي؟",
                          ru: "Что дальше?",
                        })
                  }
                  aria-label={t({
                    de: "Wort zum Schritt",
                    en: "Words for the step",
                    zh: "步骤名称",
                    hi: "कदम का नाम",
                    es: "Nombre del paso",
                    ar: "اسم الخطوة",
                    ru: "Название шага",
                  })}
                  onChange={(e) => setStep(step.id, { label: e.target.value || undefined })}
                />
                <span className="rw-task-buttons">
                  <button
                    type="button"
                    disabled={i === 0}
                    aria-label={t({ de: "Früher", en: "Earlier", zh: "提前", hi: "पहले", es: "Antes", ar: "أبكر", ru: "Раньше" })}
                    onClick={() => move(i, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={i === steps.length - 1}
                    aria-label={t({ de: "Später", en: "Later", zh: "推后", hi: "बाद में", es: "Después", ar: "لاحقًا", ru: "Позже" })}
                    onClick={() => move(i, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    aria-label={t({
                      de: `${stepLabel(step)} entfernen`,
                      en: `Remove ${stepLabel(step)}`,
                      zh: `删除“${stepLabel(step)}”`,
                      hi: `${stepLabel(step)} हटाएँ`,
                      es: `Quitar ${stepLabel(step)}`,
                      ar: `إزالة ${stepLabel(step)}`,
                      ru: `Убрать: ${stepLabel(step)}`,
                    })}
                    onClick={() => setSteps(steps.filter((own) => own.id !== step.id))}
                  >
                    ✕
                  </button>
                </span>
                {step.linked === "teeth" && (
                  <div
                    className="rw-chips rw-slot-chips"
                    role="group"
                    aria-label={t({
                      de: "Welches Putzen hakt ab?",
                      en: "Which brushing ticks it off?",
                      zh: "哪次刷牙算完成？",
                      hi: "कौन-सा ब्रश करना निशान लगाता है?",
                      es: "¿Qué cepillado la marca?",
                      ar: "أيّ تنظيف يضع العلامة؟",
                      ru: "Какая чистка отмечает карточку?",
                    })}
                  >
                    <button
                      type="button"
                      className={step.slot ? undefined : "selected"}
                      aria-pressed={!step.slot}
                      onClick={() => setStep(step.id, { slot: undefined })}
                    >
                      🪥{" "}
                      {t({
                        de: "Jedes Putzen",
                        en: "Any brushing",
                        zh: "每次刷牙",
                        hi: "कोई भी ब्रश",
                        es: "Cualquier cepillado",
                        ar: "أيّ تنظيف",
                        ru: "Любая чистка",
                      })}
                    </button>
                    {SLOTS.filter((slot) => slot.id !== "noon").map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        className={step.slot === slot.id ? "selected" : undefined}
                        aria-pressed={step.slot === slot.id}
                        onClick={() => setStep(step.id, { slot: slot.id })}
                      >
                        {slot.emoji} {t(slot.label)}
                      </button>
                    ))}
                  </div>
                )}
                {step.linked === "teeth" && (
                  <div
                    className="rw-chips rw-slot-chips"
                    role="group"
                    aria-label={t({
                      de: "Was macht ein Tippen auf die Karte?",
                      en: "What does tapping the card do?",
                      zh: "点卡片会怎样？",
                      hi: "कार्ड पर टैप करने से क्या होता है?",
                      es: "¿Qué hace un toque en la tarjeta?",
                      ar: "ماذا يفعل النقر على البطاقة؟",
                      ru: "Что делает касание карточки?",
                    })}
                  >
                    <button
                      type="button"
                      className={step.noGame ? undefined : "selected"}
                      aria-pressed={!step.noGame}
                      onClick={() => setStep(step.id, { noGame: undefined })}
                    >
                      🦷{" "}
                      {t({
                        de: "Öffnet „Zähne putzen“",
                        en: "Opens “Brushing Teeth”",
                        zh: "打开“刷牙”",
                        hi: "“दाँत साफ़ करना” खोलता है",
                        es: "Abre «Lavarse los dientes»",
                        ar: "يفتح «تنظيف الأسنان»",
                        ru: "Открывает «Чистим зубы»",
                      })}
                    </button>
                    <button
                      type="button"
                      className={step.noGame ? "selected" : undefined}
                      aria-pressed={!!step.noGame}
                      onClick={() => setStep(step.id, { noGame: true })}
                    >
                      ✓{" "}
                      {t({
                        de: "Nur abhaken",
                        en: "Just tick off",
                        zh: "只打勾",
                        hi: "सिर्फ़ निशान लगाएँ",
                        es: "Solo marcar",
                        ar: "وضع علامة فقط",
                        ru: "Только отметить",
                      })}
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
        <p className="setting-note">
          {t({
            de: "Drei bis sechs Bilder reichen für Zwei- und Dreijährige. Ist die Zähne-Karte dran, öffnet ein Tippen das Spiel „Zähne putzen“; danach geht es zurück zum Plan, und die Karte ist geschafft. Wer ohne das Spiel putzt, wählt „Nur abhaken“. Aufs Töpfchen hakt sich nach einem Haken im Töpfchen-Spiel ab.",
            en: "Three to six pictures are enough for two- and three-year-olds. When the teeth card is up, a tap opens the game “Brushing Teeth”; afterwards it goes back to the plan and the card is done. If you brush without the game, choose “Just tick off”. The potty card ticks itself off after a tick in the game “Potty Time”.",
            zh: "两三岁的孩子用三到六张图片就够了。轮到刷牙卡片时，点一下会打开游戏“刷牙”；刷完后回到日程表，这张卡片就完成了。不用游戏刷牙的话，请选“只打勾”。在游戏“坐便盆”里打勾后，便盆卡片会自动完成。",
            hi: "दो-तीन साल के बच्चों के लिए तीन से छह तस्वीरें काफ़ी हैं। दाँतों वाले कार्ड की बारी आने पर टैप करने से खेल “दाँत साफ़ करना” खुलता है; उसके बाद योजना पर वापस आते हैं और कार्ड पूरा हो जाता है। अगर आप खेल के बिना ब्रश करते हैं, तो “सिर्फ़ निशान लगाएँ” चुनें। पॉटी वाला कार्ड खेल “पॉटी पर चलो” में निशान लगाने के बाद अपने-आप पूरा होता है।",
            es: "Para peques de dos y tres años bastan de tres a seis imágenes. Cuando le toca a la tarjeta de los dientes, un toque abre el juego «Lavarse los dientes»; después se vuelve al plan y la tarjeta queda hecha. Si se cepillan sin el juego, elija «Solo marcar». La tarjeta del orinal se marca sola tras una marca en el juego «Al orinal».",
            ar: "تكفي من ثلاث إلى ست صور للأطفال في سن الثانية والثالثة. عندما يحين دور بطاقة الأسنان، يفتح النقر لعبة «تنظيف الأسنان»؛ ثم نعود إلى الخطة وتكون البطاقة قد أُنجزت. إن كنتم تنظّفون الأسنان دون اللعبة فاختاروا «وضع علامة فقط». وبطاقة النونية تُعلَّم وحدها بعد وضع علامة في لعبة «إلى النونية».",
            ru: "Для двух- и трёхлеток хватает трёх–шести картинок. Когда подходит очередь карточки с зубами, касание открывает игру «Чистим зубы»; потом вы вернётесь к плану, и карточка выполнена. Если чистите зубы без игры, выберите «Только отметить». Карточка горшка отмечается сама после галочки в игре «На горшок».",
          })}
        </p>
        <div
          className="rw-chips"
          role="group"
          aria-label={t({ de: "Schritt hinzufügen", en: "Add a step", zh: "添加步骤", hi: "कदम जोड़ें", es: "Añadir paso", ar: "إضافة خطوة", ru: "Добавить шаг" })}
        >
          {OFFERED.map((item) => (
            <button key={item.id} type="button" disabled={steps.length >= MAX_STEPS} onClick={() => add(stepFromCatalog(item.id))}>
              ＋ <ItemPic item={{ emoji: item.emoji, catalog: item.id }} /> {t(item.label)}
            </button>
          ))}
          <button type="button" disabled={steps.length >= MAX_STEPS} onClick={() => add({ id: newId(), emoji: "⭐", label: "" })}>
            ＋ {t({ de: "Eigene Karte", en: "Own card", zh: "自定义卡片", hi: "अपना कार्ड", es: "Tarjeta propia", ar: "بطاقة خاصة", ru: "Своя карточка" })}
          </button>
        </div>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Farben", en: "Colours", zh: "颜色", hi: "रंग", es: "Colores", ar: "الألوان", ru: "Цвета" })}>
        <div className="rw-chips" role="group" aria-label={t({ de: "Farben", en: "Colours", zh: "颜色", hi: "रंग", es: "Colores", ar: "الألوان", ru: "Цвета" })}>
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={plan.theme === theme.id ? "selected" : undefined}
              aria-pressed={plan.theme === theme.id}
              onClick={() => onChange({ ...plan, theme: theme.id })}
            >
              {t(theme.label)}
            </button>
          ))}
        </div>
      </SettingsGroup>

      <SettingsGroup title={t({ de: "Von vorn", en: "Start again", zh: "重新开始", hi: "फिर से शुरू", es: "Otra vez", ar: "من جديد", ru: "Сначала" })}>
        <div className="rw-chips">
          <button type="button" disabled={stepsOn(plan, new Date()).length === 0} onClick={onRestartToday}>
            ↺{" "}
            {t({
              de: "Heute noch einmal von vorn",
              en: "Start today again",
              zh: "今天从头再来",
              hi: "आज फिर से शुरू करें",
              es: "Empezar hoy otra vez",
              ar: "البدء اليوم من جديد",
              ru: "Начать сегодня заново",
            })}
          </button>
          {onRemove && (
            <button type="button" onClick={onRemove}>
              🗑️ {t({ de: "Plan löschen", en: "Delete plan", zh: "删除日程表", hi: "योजना मिटाएँ", es: "Borrar plan", ar: "حذف الخطة", ru: "Удалить план" })}
            </button>
          )}
        </div>
      </SettingsGroup>
    </section>
  );
}
