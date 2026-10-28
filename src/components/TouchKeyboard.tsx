import type { CSSProperties, PointerEvent } from "react";
import { useDevice } from "@/lib/device";
import { useT } from "@/lib/language";
import { BRIGHT_COLORS } from "./Bursts";
import { Choice, SettingsGroup } from "./SettingControls";

/** Show big keys on the screen: only on touch devices without mouse or trackpad ("auto"), always, or never. */
export type TouchKeysMode = "auto" | "on" | "off";

const KEYS_PER_ROW = 10;

/**
 * On a computer without a touch screen the option is hidden and the keys stay off: real keys are easier than clicking.
 * `anyTouch`: "auto" shows the keys on every touch screen, also on a touch laptop or an iPad with keyboard.
 */
export function useTouchKeys(mode: TouchKeysMode, anyTouch = false) {
  const device = useDevice();
  return device.hasTouch && (mode === "on" || (mode === "auto" && (anyTouch || device.touchOnly)));
}

/** Splits keys into rows of ten, like a keyboard. */
export function keyRows(keys: string[]): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < keys.length; i += KEYS_PER_ROW) rows.push(keys.slice(i, i + KEYS_PER_ROW));
  return rows;
}

/**
 * Big on-screen keys for tablets. Pressing one counts like pressing the real
 * key; `highlight` marks the key that is wanted next.
 */
export function TouchKeyboard({
  rows,
  onKey,
  label = (key) => key,
  highlight,
}: {
  rows: string[][];
  onKey: (key: string) => void;
  label?: (key: string) => string;
  highlight?: string;
}) {
  const press = (key: string, e: PointerEvent) => {
    // The play area underneath would otherwise treat this as a tap next to the keys.
    e.stopPropagation();
    onKey(key);
  };

  const t = useT();
  let index = 0;
  return (
    <div className="touch-keyboard" role="group" aria-label={t({ de: "Tasten", ru: "Клавиши", en: "Keys", zh: "按键", hi: "बटन", es: "Teclas", ar: "أزرار" })}>
      {rows.map((row, r) => (
        // An Arabic alphabet runs from right to left, the digits stay as on a keyboard.
        <div key={r} className="touch-row" dir={/\p{Script=Arabic}/u.test(row[0] ?? "") ? "rtl" : undefined}>
          {row.map((key) => {
            const color = BRIGHT_COLORS[index++ % BRIGHT_COLORS.length];
            return (
              <button
                key={key}
                type="button"
                className={`touch-key${key === highlight ? " wanted" : ""}`}
                style={{ "--key": color } as CSSProperties}
                onPointerDown={(e) => press(key, e)}
              >
                {label(key)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** The parents' option for the on-screen keys; not shown on computers without a touch screen. */
export function TouchKeysSetting({ value, onChange, anyTouch = false }: { value: TouchKeysMode; onChange: (mode: TouchKeysMode) => void; anyTouch?: boolean }) {
  const device = useDevice();
  const t = useT();
  if (!device.hasTouch) return null;
  return (
    <SettingsGroup title={t({ de: "Tablet", ru: "Планшет", en: "Tablet", zh: "平板", hi: "टैबलेट", es: "Tableta", ar: "الجهاز اللوحي" })}>
      <Choice<TouchKeysMode>
        label={t({
          de: "Tasten auf dem Bildschirm",
          ru: "Клавиши на экране",
          en: "Keys on the screen",
          zh: "屏幕上的按键",
          hi: "स्क्रीन पर बटन",
          es: "Teclas en la pantalla",
          ar: "أزرار على الشاشة",
        })}
        value={value}
        onChange={onChange}
        options={[
          {
            value: "auto",
            label: anyTouch
              ? t({
                  de: "📱 Auf Touch-Bildschirmen",
                  ru: "📱 На сенсорных экранах",
                  en: "📱 On touch screens",
                  zh: "📱 在触摸屏上",
                  hi: "📱 टच स्क्रीन पर",
                  es: "📱 En pantallas táctiles",
                  ar: "📱 على الشاشات اللمسية",
                })
              : t({
                  de: "📱 Nur auf Tablets",
                  ru: "📱 Только на планшетах",
                  en: "📱 Only on tablets",
                  zh: "📱 只在平板上",
                  hi: "📱 सिर्फ़ टैबलेट पर",
                  es: "📱 Solo en tabletas",
                  ar: "📱 على الأجهزة اللوحية فقط",
                }),
          },
          { value: "on", label: t({ de: "Immer", ru: "Всегда", en: "Always", zh: "总是", hi: "हमेशा", es: "Siempre", ar: "دائما" }) },
          {
            value: "off",
            label: t({
              de: "Nie (mit angeschlossener Tastatur)",
              ru: "Никогда (с подключённой клавиатурой)",
              en: "Never (with a keyboard attached)",
              zh: "从不（已连接键盘）",
              hi: "कभी नहीं (कीबोर्ड लगा हो तो)",
              es: "Nunca (con teclado conectado)",
              ar: "أبدا (مع لوحة مفاتيح موصولة)",
            }),
          },
        ]}
      />
    </SettingsGroup>
  );
}
