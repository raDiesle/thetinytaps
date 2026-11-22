import { type CSSProperties, useEffect, useState } from "react";
import { Choice } from "@/components/SettingControls";
import { useT } from "@/lib/language";
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

/** The play area's class and width for the note in the corner, so the bar along the bottom ends beside it. */
export function noteRoom(shown: TimeShown, total: number): { className: string; style: CSSProperties } {
  return shown === "digits" ? { className: " tm-note-digits", style: { "--tm-note-em": digitsEm(total) } as CSSProperties } : { className: "", style: {} };
}

/**
 * The time left to `endsAt`, shown as `shown` says (nothing when off or once the time is up); `total` is the whole
 * run, which sets what a tally mark stands for: a share of it (`percentMarks`), or a stretch of time (`markUnit`).
 */
export function TimeShownNote({ shown, endsAt, total }: { shown: TimeShown; endsAt: number; total: number }) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (shown === "off") return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 250);
    return () => clearInterval(timer);
  }, [shown]);
  const left = endsAt - now;
  if (shown === "off" || left <= 0) return null;
  const unit = shown === "percent" ? total / percentMarks(total) : markUnit(total);
  return (
    <div className={`tm-shown tm-shown-${shown === "percent" ? "marks" : shown}`} aria-hidden>
      {shown === "digits" ? (
        <b style={{ "--tm-note-em": digitsEm(total) } as CSSProperties}>
          {[...digits(left)].map((ch, i) => (
            <span key={i} className={ch === ":" ? "tm-colon" : undefined}>
              {ch}
            </span>
          ))}
        </b>
      ) : (
        <Tally count={marksLeft(left, unit)} slots={marksLeft(total, unit)} />
      )}
    </div>
  );
}
