import { type Localized, useT } from "@/lib/language";
import { dayKey, weekOf, type Daytime, type WeekLog } from "./daytime";

/** Monday to Sunday, short. */
const DAY_NAMES: Localized<string[]> = {
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  zh: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  hi: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  // Without the article (الاثنين → اثنين), so the columns stay narrow.
  ar: ["اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
};
const SLOTS: { daytime: Daytime; icon: string; label: Localized }[] = [
  { daytime: "morning", icon: "☀️", label: { de: "morgens", en: "in the morning", zh: "早上", hi: "सुबह", es: "por la mañana", ar: "صباحًا", ru: "утром" } },
  { daytime: "evening", icon: "🌙", label: { de: "abends", en: "in the evening", zh: "晚上", hi: "शाम को", es: "por la noche", ar: "مساءً", ru: "вечером" } },
];

/**
 * The week from Monday to Sunday, a sun and a moon for every day. Each
 * brushing finished puts a star there; the one just earned pops in. Today
 * stands out (bigger, „Heute“, coloured for morning or evening) and so does
 * the slot of this brushing, so it is clear which star comes now.
 */
export function Week({ log, today, now }: { log: WeekLog; today: Date; now: Daytime }) {
  const t = useT();
  const dayNames = t(DAY_NAMES);
  const todayKey = dayKey(today);
  return (
    <ol
      className="teeth-week"
      aria-label={t({ de: "Diese Woche", en: "This week", zh: "本周", hi: "यह हफ़्ता", es: "Esta semana", ar: "هذا الأسبوع", ru: "Эта неделя" })}
    >
      {weekOf(today).map((day, i) => {
        const key = dayKey(day);
        const done = log[key] ?? [];
        return (
          <li key={key} className={`teeth-day${key === todayKey ? ` today ${now}` : ""}`}>
            {key === todayKey && (
              <span className="teeth-today-tag">{t({ de: "Heute", en: "Today", zh: "今天", hi: "आज", es: "Hoy", ar: "اليوم", ru: "Сегодня" })}</span>
            )}
            <span className="teeth-day-name">{dayNames[i]}</span>
            {SLOTS.map(({ daytime, icon, label }) => {
              const star = done.includes(daytime);
              const current = key === todayKey && daytime === now;
              const fresh = star && current;
              return (
                <span
                  key={daytime}
                  className={`teeth-slot${star ? " star" : ""}${fresh ? " fresh" : ""}${current ? " now" : ""}`}
                  aria-label={`${dayNames[i]} ${t(label)}: ${star ? t({ de: "geputzt", en: "brushed", zh: "刷过了", hi: "ब्रश हो गया", es: "cepillado", ar: "تم التنظيف", ru: "почищено" }) : t({ de: "noch nicht", en: "not yet", zh: "还没有", hi: "अभी नहीं", es: "todavía no", ar: "ليس بعد", ru: "ещё нет" })}`}
                >
                  {star ? "⭐" : icon}
                </span>
              );
            })}
          </li>
        );
      })}
    </ol>
  );
}
