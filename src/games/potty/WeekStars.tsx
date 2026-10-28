import { dayKey, weekOf } from "@/games/teeth/daytime";
import { type Localized, useT } from "@/lib/language";
import type { StarLog } from "./stars";

/** More stars than this on one day are shown as a number. */
const MAX_SHOWN = 4;

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

/**
 * This week's stars, a column per day with today's marked, at the end of the story: the star of this round (`fresh`)
 * pops in on top of today's. Days without a star stay plain, never a field that says „not done“.
 */
export function WeekStars({ log, fresh }: { log: StarLog; fresh: boolean }) {
  const t = useT();
  const today = new Date();
  const todayKey = dayKey(today);
  const dayNames = t(DAY_NAMES);

  return (
    <ol
      className="pt-week"
      aria-label={t({
        de: "Sterne dieser Woche",
        en: "This week's stars",
        zh: "本周的星星",
        hi: "इस हफ़्ते के तारे",
        es: "Estrellas de esta semana",
        ar: "نجوم هذا الأسبوع",
        ru: "Звёздочки этой недели",
      })}
    >
      {weekOf(today).map((day, i) => {
        const key = dayKey(day);
        const isToday = key === todayKey;
        const count = log[key] ?? 0;
        return (
          <li key={key} className={`pt-day${isToday ? " today" : ""}`}>
            {isToday && <span className="pt-today-tag">{t({ de: "Heute", en: "Today", zh: "今天", hi: "आज", es: "Hoy", ar: "اليوم", ru: "Сегодня" })}</span>}
            <span className="pt-day-name">{dayNames[i]}</span>
            <span className="pt-day-stars" aria-label={`${count} ⭐`}>
              {count > MAX_SHOWN ? (
                <span className={isToday && fresh ? "pt-star fresh" : "pt-star"}>⭐×{count}</span>
              ) : (
                Array.from({ length: count }, (_, k) => (
                  <span key={k} className={isToday && fresh && k === count - 1 ? "pt-star fresh" : "pt-star"}>
                    ⭐
                  </span>
                ))
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
