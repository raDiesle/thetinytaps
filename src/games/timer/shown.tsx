import { type CSSProperties, useEffect, useState } from "react";
import { Choice } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import { useRunClock } from "./pause";
import { markUnit, marksLeft, percentMarks } from "./pieces";
import type { TimeShown } from "./settings";
import { digits } from "./time";

// „Zeit im Bild“ (user requests, November 2026): the time left stands in the picture's bottom right corner, by default
// as minutes and seconds. Behind ⚙️ grown-ups may switch to tally marks that go one by one – a full row of them, each a
// share of the run, or each a stretch of time – or off. A small paper note of its own outside the stage, ticking once
// a second, so the big drawing is never painted again.

/** The choice behind ⚙️ while a timer runs: the time left in the picture or not, and how. */
export function TimeShownChoice({ value, onChange }: { value: TimeShown; onChange: (shown: TimeShown) => void }) {
  const t = useT();
  return (
    <Choice
      label={t({
        de: "Zeit im Bild",
        en: "Time in the picture",
        zh: "画面中的时间",
        hi: "तस्वीर में समय",
        es: "Tiempo en la imagen",
        ar: "الوقت في الصورة",
        ru: "Время на картинке",
      })}
      value={value}
      onChange={(v) => onChange(v as TimeShown)}
      options={[
        { value: "digits", label: t({ de: "Zahlen", en: "Numbers", zh: "数字", hi: "अंक", es: "Números", ar: "أرقام", ru: "Цифры" }) },
        {
          value: "percent",
          label: t({
            de: "Striche in %",
            en: "Marks in %",
            zh: "刻线（百分比）",
            hi: "निशान, प्रतिशत में",
            es: "Rayas en %",
            ar: "خطوط بالنسبة المئوية",
            ru: "Чёрточки в %",
          }),
        },
        {
          value: "marks",
          label: t({
            de: "Striche in Zeit",
            en: "Marks in time",
            zh: "刻线（时间）",
            hi: "निशान, समय में",
            es: "Rayas por tiempo",
            ar: "خطوط بالوقت",
            ru: "Чёрточки по времени",
          }),
        },
        { value: "off", label: t({ de: "Aus", en: "Off", zh: "关", hi: "बंद", es: "Apagado", ar: "إيقاف", ru: "Выкл." }) },
      ]}
    />
  );
}

/**
 * The marks in bundles of five, as tallies are written: four upright, the fifth across them. Room stays for the
 * `slots` marks of the start, the gone ones left empty, so the note keeps its size while its marks go.
 */
function Tally({ count, slots }: { count: number; slots: number }) {
  const bundles = Array.from({ length: Math.ceil(Math.max(count, slots) / 5) }, (_, i) => Math.max(0, Math.min(5, count - i * 5)));
  return (
    <span className="tm-tally">
      {bundles.map((n, i) => (
        <svg key={i} viewBox="0 0 48 40" aria-hidden style={n ? undefined : { visibility: "hidden" }}>
          {Array.from({ length: Math.min(n, 4) }, (_, k) => (
            <path key={k} d={`M${8 + k * 10} 4 V36`} />
          ))}
          {n === 5 && <path d="M2 30 L46 10" />}
        </svg>
      ))}
    </span>
  );
}

/** How wide a digit and a colon of the note are, in ems: each sits in a cell of its own, so no second changes its width. */
const DIGIT_EM = 0.64;
const COLON_EM = 0.34;

/**
 * How wide the digits of a run of `total` ms are on the note, in ems: as wide as at its start, the most they get, so the
 * note keeps one width the whole run (user feedback, 22 November 2026: it changed its width all the time). The play
 * area gets it too (`--tm-note-em`), so the bar along the bottom ends beside the note.
 */
export function digitsEm(total: number): number {
  return [...digits(total)].reduce((w, ch) => w + (ch === ":" ? COLON_EM : DIGIT_EM), 0);
}

/** How big the whole length after the time left is, against the note's digits (`TotalTime`). */
const TOTAL_SCALE = 0.6;

/** How wide the whole length after the time left is, in ems of the note's digits: a gap, a slash and its digits, smaller. */
export function totalEm(total: number): number {
  return 0.3 + (0.5 + digitsEm(total)) * TOTAL_SCALE;
}

/**
 * The play area's class and width for the note in the corner, so the bar along the bottom ends beside it – with the
 * whole length after the time left where `withTotal` (taking turns).
 */
export function noteRoom(shown: TimeShown, total: number, withTotal = false): { className: string; style: CSSProperties } {
  const em = digitsEm(total) + (withTotal ? totalEm(total) : 0);
  return shown === "digits" ? { className: " tm-note-digits", style: { "--tm-note-em": em } as CSSProperties } : { className: "", style: {} };
}

/**
 * The time left to `endsAt`, shown as `shown` says (nothing when off); `total` is the whole run, which sets what a tally
 * mark stands for: a share of it (`percentMarks`), or a stretch of time (`markUnit`). Once the time is up (`up`) it
 * stays, as 0:00 in red, blinking (user request, 23 November 2026: the end should be plain to see, in every timer) –
 * in digits also where marks were shown, since no marks left says less than 0:00. With `withTotal` (taking turns, user
 * request, 25 November 2026) the digits have the whole turn's length beside them, smaller: „3:12 / 5:00“.
 */
export function TimeShownNote({ shown, endsAt, total, up, withTotal }: { shown: TimeShown; endsAt: number; total: number; up?: boolean; withTotal?: boolean }) {
  // On the run's clock, so it stands still while the timer is paused.
  const clock = useRunClock();
  const [now, setNow] = useState(clock.now);
  const ticking = shown !== "off" && !up && !clock.paused;
  useEffect(() => {
    if (!ticking) return;
    const tick = () => setNow(clock.now());
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [ticking, clock]);
  if (shown === "off") return null;
  const left = up ? 0 : endsAt - now;
  if (up || left <= 0)
    return (
      <div className={`tm-shown tm-shown-digits tm-shown-up${withTotal ? " tm-shown-with-total" : ""}`} aria-hidden>
        <Digits text={digits(0)} total={total} />
        {withTotal && <TotalTime total={total} />}
      </div>
    );
  const unit = shown === "percent" ? total / percentMarks(total) : markUnit(total);
  return (
    <div className={`tm-shown tm-shown-${shown === "percent" ? "marks" : shown}${withTotal && shown === "digits" ? " tm-shown-with-total" : ""}`} aria-hidden>
      {shown === "digits" ? <Digits text={digits(left)} total={total} /> : <Tally count={marksLeft(left, unit)} slots={marksLeft(total, unit)} />}
      {withTotal && shown === "digits" && <TotalTime total={total} />}
    </div>
  );
}

/** The digits of the note, each in a cell of its own, the note as wide as the run's longest text. */
function Digits({ text, total }: { text: string; total: number }) {
  return (
    <b style={{ "--tm-note-em": digitsEm(total) } as CSSProperties}>
      {[...text].map((ch, i) => (
        <span key={i} className={ch === ":" ? "tm-colon" : undefined}>
          {ch}
        </span>
      ))}
    </b>
  );
}

/** The whole length beside the time left, smaller and lighter: „/ 5:00“. */
function TotalTime({ total }: { total: number }) {
  return <i className="tm-shown-total">/ {digits(total)}</i>;
}
