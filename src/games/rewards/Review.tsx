import { useEffect, useRef, useState } from "react";
import { playWhoosh, unlockAudio } from "@/lib/sfx";
import { type Localized, useAppLanguage, useT } from "@/lib/language";
import { type Board, type LinkedDays, reviewKind, reviewPeriods, type StarLog, withKind } from "./board";
import { BoardSheet, SCREEN_LOOK } from "./BoardSheet";
import { TODAY } from "./PlanSheet";
import { type BoardKind, MARK_BY_ID, MARKS } from "./catalog";

/** „📜 Rückblick“: the button on top and the heading of the view. */
export const REVIEW: Localized = { de: "Rückblick", en: "Look back", zh: "回顾", hi: "पीछे देखें", es: "Repaso", ar: "نظرة إلى الوراء", ru: "Взгляд назад" };

/** „Gestern“, on the ‹ › of a board's or plan's day. */
export const YESTERDAY: Localized = { de: "Gestern", en: "Yesterday", zh: "昨天", hi: "बीता कल", es: "Ayer", ar: "أمس", ru: "Вчера" };
/** ‹: to the day, week or month before. */
export const EARLIER: Localized = { de: "Früher", en: "Earlier", zh: "更早", hi: "पहले का", es: "Anterior", ar: "الأقدم", ru: "Раньше" };
/** ›: back towards now. */
export const LATER: Localized = { de: "Später", en: "Later", zh: "更晚", hi: "बाद का", es: "Siguiente", ar: "الأحدث", ru: "Позже" };

/** „Woche vom 12.10.“: a week named by its first day (the date already in the app language's format). */
const WEEK_FROM: Localized<(date: string) => string> = {
  de: (d) => `Woche vom ${d}`,
  en: (d) => `Week of ${d}`,
  zh: (d) => `${d}起的一周`,
  hi: (d) => `${d} से शुरू हफ़्ता`,
  es: (d) => `Semana del ${d}`,
  ar: (d) => `الأسبوع من ${d}`,
  ru: (d) => `Неделя с ${d}`,
};

/** Width / height of a small picture in the strip, as in the gallery. */
const THUMB_ASPECT = 1.45;

/** The name of a day, week or month `back` periods ago: „Diese Woche“, „Letzte Woche“, „Woche vom 12.10.“, „September“. */
export function usePeriodLabel() {
  const t = useT();
  const { speechLang } = useAppLanguage();
  return (kind: BoardKind, back: number, day: Date) =>
    back === 0
      ? t(
          kind === "day"
            ? TODAY
            : kind === "week"
              ? { de: "Diese Woche", en: "This week", zh: "本周", hi: "इस हफ़्ते", es: "Esta semana", ar: "هذا الأسبوع", ru: "Эта неделя" }
              : { de: "Dieser Monat", en: "This month", zh: "本月", hi: "इस महीने", es: "Este mes", ar: "هذا الشهر", ru: "Этот месяц" },
        )
      : back === 1
        ? t(
            kind === "day"
              ? YESTERDAY
              : kind === "week"
                ? { de: "Letzte Woche", en: "Last week", zh: "上周", hi: "पिछले हफ़्ते", es: "La semana pasada", ar: "الأسبوع الماضي", ru: "Прошлая неделя" }
                : { de: "Letzter Monat", en: "Last month", zh: "上个月", hi: "पिछले महीने", es: "El mes pasado", ar: "الشهر الماضي", ru: "Прошлый месяц" },
          )
        : kind === "month"
          ? new Intl.DateTimeFormat(speechLang, { month: "long" }).format(day)
          : kind === "week"
            ? t(WEEK_FROM)(new Intl.DateTimeFormat(speechLang, { day: "numeric", month: "numeric" }).format(day))
            : new Intl.DateTimeFormat(speechLang, { weekday: "short", day: "numeric", month: "numeric" }).format(day);
}

/**
 * „📜 Rückblick“: the last weeks of a board (months of a month board; a day board shows its weeks) to look at together
 * – what already worked. One big, newest first, and below it all of them as small pictures to flip through: a tap on
 * the big one, ‹ › or the arrow keys go on, a small one shows it big. Only weeks with stars, never an empty one, and
 * nothing to change here: forgotten stars are added on the board with ‹.
 */
export function Review({ board, log, linked, sounds, onClose }: { board: Board; log: StarLog; linked: LinkedDays; sounds: boolean; onClose: () => void }) {
  const t = useT();
  const label = usePeriodLabel();
  const today = new Date();
  const kind = reviewKind(board.kind);
  const shown = withKind(board, kind);
  const stars = log[board.id];
  const periods = reviewPeriods(board, stars, linked, today);
  const mark = MARK_BY_ID.get(board.mark) ?? MARKS[0];
  const [pick, setPick] = useState(0);
  const strip = useRef<HTMLUListElement>(null);
  const current = periods[Math.min(pick, periods.length - 1)];

  // Another board or view starts with the newest week again.
  useEffect(() => setPick(0), [board.id, kind]);

  const go = (index: number) => {
    if (periods.length < 2) return;
    unlockAudio();
    if (sounds) playWhoosh();
    setPick((index + periods.length) % periods.length);
  };

  // The picked one stays in sight in the strip.
  useEffect(() => {
    strip.current?.querySelector("[aria-current='true']")?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [pick]);

  // ← older is to the right in the strip, so → goes back in time and ← towards now.
  const pickRef = useRef(pick);
  pickRef.current = pick;
  const goRef = useRef(go);
  goRef.current = go;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || (e.target instanceof Element && e.target.closest("input, textarea"))) return;
      if (e.key === "ArrowRight") goRef.current(pickRef.current + 1);
      else if (e.key === "ArrowLeft") goRef.current(pickRef.current - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <section className="rw-review" aria-label={t(REVIEW)}>
      <header className="rw-review-head">
        <h2 className="rw-panel-title">📜 {t(REVIEW)}</h2>
        {current && (
          <span className="rw-review-now">
            {label(kind, current.back, current.day)} · <span aria-hidden>{mark.emoji}</span> {current.count}
          </span>
        )}
        <button type="button" className="rw-review-close" onClick={onClose}>
          ✕{" "}
          {t({
            de: "Zur Tafel",
            en: "Back to the chart",
            zh: "返回奖励表",
            hi: "चार्ट पर वापस",
            es: "Volver a la tabla",
            ar: "العودة إلى اللوحة",
            ru: "К таблице",
          })}
        </button>
      </header>
      {current ? (
        <>
          <div className="rw-review-stage">
            <button type="button" className="rw-review-arrow" aria-label={t(LATER)} disabled={periods.length < 2} onClick={() => go(pick - 1)}>
              ‹
            </button>
            {/* The big one: a tap flips to the week before, so a child can look through them too. */}
            <button
              type="button"
              className="rw-review-sheet"
              aria-label={t({
                de: "Weiterblättern",
                en: "Turn the page",
                zh: "翻页",
                hi: "आगे पलटें",
                es: "Pasar página",
                ar: "قلب الصفحة",
                ru: "Листать дальше",
              })}
              onClick={() => go(pick + 1)}
            >
              <BoardSheet board={shown} stars={stars} linked={linked} today={today} day={current.day} look={SCREEN_LOOK} aspect={1.6} />
            </button>
            <button type="button" className="rw-review-arrow" aria-label={t(EARLIER)} disabled={periods.length < 2} onClick={() => go(pick + 1)}>
              ›
            </button>
          </div>
          {periods.length > 1 && (
            <ul ref={strip} className="rw-review-strip">
              {periods.map((period, i) => (
                <li key={period.back}>
                  <button
                    type="button"
                    className={`rw-tpl${period === current ? " selected" : ""}`}
                    aria-current={period === current}
                    onClick={() => i !== pick && go(i)}
                  >
                    <span className="rw-thumb" aria-hidden>
                      <BoardSheet board={shown} stars={stars} linked={linked} today={today} day={period.day} look={SCREEN_LOOK} aspect={THUMB_ASPECT} />
                    </span>
                    <span className="rw-tpl-name">
                      {label(kind, period.back, period.day)} · <span aria-hidden>{mark.emoji}</span> {period.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="rw-review-empty">
          {t({
            de: "Noch keine Sterne. Hier sehen Sie später die letzten Wochen als kleine Bilder – zum gemeinsamen Anschauen, was schon geklappt hat.",
            en: "No stars yet. Later you will see the last weeks here as small pictures – to look at together what has already worked.",
            zh: "还没有星星。以后这里会用小图显示最近几周——可以和孩子一起看看哪些已经做到了。",
            hi: "अभी कोई सितारा नहीं है। बाद में यहाँ पिछले हफ़्ते छोटी तस्वीरों में दिखेंगे – साथ मिलकर देखने के लिए कि क्या-क्या हो चुका है।",
            es: "Aún no hay estrellas. Más adelante verá aquí las últimas semanas en pequeñas imágenes, para mirar juntos lo que ya ha salido bien.",
            ar: "لا توجد نجوم بعد. لاحقًا ستظهر هنا الأسابيع الأخيرة كصور صغيرة – لتنظروا معًا إلى ما نجح بالفعل.",
            ru: "Пока нет звёзд. Позже здесь появятся последние недели маленькими картинками – чтобы вместе посмотреть, что уже получилось.",
          })}
        </p>
      )}
    </section>
  );
}
