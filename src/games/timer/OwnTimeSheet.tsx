import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Choice } from "@/components/SettingControls";
import { useDevice } from "@/lib/device";
import { useT } from "@/lib/language";
import { OTHER_TIME, tomorrowAt } from "./content";
import {
  clampSeconds,
  clock,
  clockMinutes,
  clockOn,
  dayKey,
  type LengthLanguage,
  lengthLabel,
  lengthWords,
  MAX_SECONDS,
  MIN_SECONDS,
  type OwnTime,
  parseClock,
  parseLength,
  READY_MINUTES,
} from "./time";

/** A number with a big − and + beside it, for a grown-up's finger. */
function Stepper({
  name,
  value,
  onMinus,
  onPlus,
  minus = true,
  plus = true,
}: {
  name: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
  minus?: boolean;
  plus?: boolean;
}) {
  return (
    <div className="tm-stepper" role="group" aria-label={name}>
      <button type="button" className="tm-step" onClick={onMinus} disabled={!minus} aria-label={`${name} −`}>
        −
      </button>
      <output className="tm-step-value">
        <b>{value}</b>
        <small>{name}</small>
      </output>
      <button type="button" className="tm-step" onClick={onPlus} disabled={!plus} aria-label={`${name} +`}>
        +
      </button>
    </div>
  );
}

/** A clock time a little ahead of now, on the next five minutes: where „Bis um“ starts. */
function soon() {
  const now = new Date();
  return clock(Math.ceil((now.getHours() * 60 + now.getMinutes() + 30) / 5) * 5);
}

/**
 * The sheet behind the slip „Andere …“ (H-59, H-60), for grown-ups: any length from 10 seconds to 3 hours with − and +
 * for hours, minutes and seconds and ready slips for times often needed, or a clock time to end at („Bis um“). On a
 * computer the time can be typed too. A clock time already behind us today is never quietly taken as tomorrow's: the
 * sheet asks. It opens over the whole screen, outside the page (a page turning holds a fixed box in).
 */
export function OwnTimeSheet({ start, onDone, onClose }: { start: OwnTime | null; onDone: (time: OwnTime) => void; onClose: () => void }) {
  const t = useT();
  const { touchOnly } = useDevice();
  const [kind, setKind] = useState<OwnTime["kind"]>(start?.kind ?? "for");
  const [seconds, setSeconds] = useState(start?.kind === "for" ? start.seconds : 20 * 60);
  const [at, setAt] = useState(start?.kind === "until" ? start.at : soon);
  const [typed, setTyped] = useState("");
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const addSeconds = (step: number) => {
    setSeconds((s) => clampSeconds(s + step));
    setTyped("");
  };
  const addMinutes = (step: number) => {
    setAt((a) => clock(clockMinutes(a) + step));
    setTyped("");
    setAsking(false);
  };
  const type = (text: string) => {
    setTyped(text);
    setAsking(false);
    if (kind === "for") {
      const length = parseLength(text);
      if (length) setSeconds(length);
    } else {
      const time = parseClock(text);
      if (time) setAt(time);
    }
  };
  const typedWrong = typed.trim() !== "" && (kind === "for" ? parseLength(typed) : parseClock(typed)) === null;

  const done = () => {
    if (kind === "for") return onDone({ kind, seconds });
    const now = new Date();
    if (clockOn(at, now) > now.getTime()) return onDone({ kind, at });
    setAsking(true);
  };

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  /** The length set, written in `language`. */
  const len = (language: LengthLanguage) => lengthLabel(seconds, language);

  return createPortal(
    <div className="tm-sheet" role="dialog" aria-modal aria-label={t(OTHER_TIME)}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: a tap beside the sheet closes it; Esc does the same */}
      <div className="tm-sheet-backdrop" onClick={onClose} />
      <section className="settings tm-sheet-panel">
        <Choice<OwnTime["kind"]>
          label={t({ de: "Zeit", en: "Time", zh: "时间", hi: "समय", es: "Tiempo", ar: "الوقت", ru: "Время" })}
          value={kind}
          onChange={(k) => {
            setKind(k);
            setTyped("");
            setAsking(false);
          }}
          options={[
            {
              value: "for",
              label: t({ de: "Wie lange", en: "How long", zh: "多长时间", hi: "कितनी देर", es: "Cuánto tiempo", ar: "كم من الوقت", ru: "Сколько" }),
            },
            { value: "until", label: t({ de: "Bis um", en: "Until", zh: "到几点", hi: "कितने बजे तक", es: "Hasta las", ar: "حتى الساعة", ru: "До" }) },
          ]}
        />
        {kind === "for" ? (
          <>
            <div className="tm-steppers">
              <Stepper
                name={t({ de: "Std.", en: "hr", zh: "小时", hi: "घंटे", es: "h", ar: "ساعة", ru: "ч" })}
                value={String(h)}
                onMinus={() => addSeconds(-3600)}
                onPlus={() => addSeconds(3600)}
                minus={seconds - 3600 >= MIN_SECONDS}
                plus={seconds + 3600 <= MAX_SECONDS}
              />
              <Stepper
                name={t({ de: "Min.", en: "min", zh: "分钟", hi: "मिनट", es: "min", ar: "دقيقة", ru: "мин" })}
                value={String(m)}
                onMinus={() => addSeconds(-60)}
                onPlus={() => addSeconds(60)}
                minus={seconds - 60 >= MIN_SECONDS}
                plus={seconds + 60 <= MAX_SECONDS}
              />
              <Stepper
                name={t({ de: "Sek.", en: "sec", zh: "秒", hi: "सेकंड", es: "s", ar: "ثانية", ru: "сек" })}
                value={String(s)}
                onMinus={() => addSeconds(-10)}
                onPlus={() => addSeconds(10)}
                minus={seconds - 10 >= MIN_SECONDS}
                plus={seconds + 10 <= MAX_SECONDS}
              />
            </div>
            <div className="choice tm-ready">
              {READY_MINUTES.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={seconds === minutes * 60 ? "selected" : undefined}
                  aria-pressed={seconds === minutes * 60}
                  onClick={() => {
                    setSeconds(minutes * 60);
                    setTyped("");
                  }}
                >
                  {t(lengthWords(minutes * 60))}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="tm-steppers">
            <Stepper
              name={t({ de: "Uhr", en: "Hour", zh: "点", hi: "बजे", es: "Hora", ar: "الساعة", ru: "Час" })}
              value={at.slice(0, 2)}
              onMinus={() => addMinutes(-60)}
              onPlus={() => addMinutes(60)}
            />
            <span className="tm-colon" aria-hidden>
              :
            </span>
            <Stepper
              name={t({ de: "Min.", en: "min", zh: "分钟", hi: "मिनट", es: "min", ar: "دقيقة", ru: "мин" })}
              value={at.slice(3)}
              onMinus={() => addMinutes(-5)}
              onPlus={() => addMinutes(5)}
            />
          </div>
        )}
        {!touchOnly && (
          <label className="tm-type">
            {t({ de: "Oder eintippen:", en: "Or type:", zh: "或者输入：", hi: "या टाइप करें:", es: "O escriba:", ar: "أو اكتبوا:", ru: "Или введите:" })}
            <input
              value={typed}
              inputMode="numeric"
              placeholder={
                kind === "for"
                  ? t({ de: "7:30 oder 45", en: "7:30 or 45", zh: "7:30 或 45", hi: "7:30 या 45", es: "7:30 o 45", ar: "7:30 أو 45", ru: "7:30 или 45" })
                  : "17:30"
              }
              aria-invalid={typedWrong}
              onChange={(e) => type(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !typedWrong) done();
              }}
            />
          </label>
        )}
        {asking ? (
          <div className="tm-sheet-ask">
            <p>
              {t({
                de: `Heute ist es schon nach ${at}.`,
                en: `It's already past ${at} today.`,
                zh: `今天已经过了 ${at}。`,
                hi: `आज ${at} बज चुके हैं।`,
                es: `Hoy ya son más de las ${at}.`,
                ar: `تجاوزت الساعة ${at} اليوم بالفعل.`,
                ru: `Сегодня уже позже ${at}.`,
              })}
            </p>
            <div className="tm-sheet-actions">
              <button type="button" className="tm-sheet-secondary" onClick={() => setAsking(false)}>
                {t({ de: "Andere Uhrzeit", en: "Different time", zh: "换个时间", hi: "दूसरा समय", es: "Otra hora", ar: "وقت آخر", ru: "Другое время" })}
              </button>
              <button type="button" className="tm-sheet-ok" onClick={() => onDone({ kind: "until", at, tomorrowFrom: dayKey(new Date()) })}>
                {t(tomorrowAt(at))}
              </button>
            </div>
          </div>
        ) : (
          <div className="tm-sheet-actions">
            <button type="button" className="tm-sheet-secondary" onClick={onClose}>
              {t({ de: "Abbrechen", en: "Cancel", zh: "取消", hi: "रद्द करें", es: "Cancelar", ar: "إلغاء", ru: "Отмена" })}
            </button>
            <button type="button" className="tm-sheet-ok" onClick={done} disabled={typedWrong}>
              {kind === "for"
                ? t({
                    de: `${len("de")} – fertig`,
                    en: `${len("en")} – done`,
                    zh: `${len("zh")}，好了`,
                    hi: `${len("hi")} – हो गया`,
                    es: `${len("es")}: listo`,
                    ar: `${len("ar")} – تمّ`,
                    ru: `${len("ru")} – готово`,
                  })
                : t({
                    de: `Bis ${at} – fertig`,
                    en: `Until ${at} – done`,
                    zh: `到 ${at}，好了`,
                    hi: `${at} बजे तक – हो गया`,
                    es: `Hasta las ${at}: listo`,
                    ar: `حتى ${at} – تمّ`,
                    ru: `До ${at} – готово`,
                  })}
            </button>
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
}
