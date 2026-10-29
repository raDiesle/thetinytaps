import { useEffect, useRef, useState } from "react";
import { playWhoosh, unlockAudio } from "@/lib/sfx";
import { useAppLanguage, useT } from "@/lib/language";
import { type Board, type LinkedDays, reviewKind, reviewPeriods, type StarLog, withKind } from "./board";
import { BoardSheet, SCREEN_LOOK } from "./BoardSheet";
import { type BoardKind, MARK_BY_ID, MARKS } from "./catalog";

/** Width / height of a small picture in the strip, as in the gallery. */
const THUMB_ASPECT = 1.45;

/** The name of a day, week or month `back` periods ago: „Diese Woche“, „Letzte Woche“, „Woche vom 12.10.“, „September“. */
export function usePeriodLabel() {
  const t = useT();
  const { speechLang } = useAppLanguage();
  return (kind: BoardKind, back: number, day: Date) =>
    back === 0
      ? t(kind === "day" ? { de: "Heute" } : kind === "week" ? { de: "Diese Woche" } : { de: "Dieser Monat" })
      : back === 1
        ? t(kind === "day" ? { de: "Gestern" } : kind === "week" ? { de: "Letzte Woche" } : { de: "Letzter Monat" })
        : kind === "month"
          ? new Intl.DateTimeFormat(speechLang, { month: "long" }).format(day)
          : kind === "week"
            ? `${t({ de: "Woche vom" })} ${new Intl.DateTimeFormat(speechLang, { day: "numeric", month: "numeric" }).format(day)}`
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
    <section className="rw-review" aria-label={t({ de: "Rückblick" })}>
      <header className="rw-review-head">
        <h2 className="rw-panel-title">📜 {t({ de: "Rückblick" })}</h2>
        {current && (
          <span className="rw-review-now">
            {label(kind, current.back, current.day)} · <span aria-hidden>{mark.emoji}</span> {current.count}
          </span>
        )}
        <button type="button" className="rw-review-close" onClick={onClose}>
          ✕ {t({ de: "Zur Tafel" })}
        </button>
      </header>
      {current ? (
        <>
          <div className="rw-review-stage">
            <button type="button" className="rw-review-arrow" aria-label={t({ de: "Später" })} disabled={periods.length < 2} onClick={() => go(pick - 1)}>
              ‹
            </button>
            {/* The big one: a tap flips to the week before, so a child can look through them too. */}
            <button type="button" className="rw-review-sheet" aria-label={t({ de: "Weiterblättern" })} onClick={() => go(pick + 1)}>
              <BoardSheet board={shown} stars={stars} linked={linked} today={today} day={current.day} look={SCREEN_LOOK} aspect={1.6} />
            </button>
            <button type="button" className="rw-review-arrow" aria-label={t({ de: "Früher" })} disabled={periods.length < 2} onClick={() => go(pick + 1)}>
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
          })}
        </p>
      )}
    </section>
  );
}
