import { useMemo, useRef, useState, type CSSProperties } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { unlockAudio } from "@/lib/sfx";
import { createEar, meterAt, useMicPermission, useMicrophone, type Heard } from "./mic";
import { LoudPlay } from "./LoudPlay";
import { DEFAULT_LOUD_SETTINGS, LOUD_SETTINGS_KEY, type LoudLevel, type Sensitivity } from "./settings";
import "./loud.css";

/** One card per level; „Weiter“ at a level's end goes on with the other. */
const MODES: { id: LoudLevel; emoji: string; title: Localized }[] = [
  {
    id: "voice",
    emoji: "🦁",
    title: { de: "Löwe und Maus", en: "Lion and Mouse", zh: "狮子和老鼠", hi: "शेर और चूहा", es: "El león y el ratón", ar: "الأسد والفأر", ru: "Лев и мышка" },
  },
  { id: "blow", emoji: "🎂", title: { de: "Pusten", en: "Blowing", zh: "吹一吹", hi: "फूँकना", es: "Soplar", ar: "النفخ", ru: "Дуем" } },
];

export function LoudGame() {
  const [settings, update] = useGameSettings(LOUD_SETTINGS_KEY, DEFAULT_LOUD_SETTINGS);
  const t = useT();

  return (
    <GameShell
      title={t({
        de: "Laut und leise",
        en: "Loud and Quiet",
        zh: "大声和小声",
        hi: "ज़ोर से और धीरे",
        es: "Fuerte y bajito",
        ar: "بصوت عالٍ وبهدوء",
        ru: "Громко и тихо",
      })}
      emoji="🦁"
      modes={MODES.map((m) => ({ ...m, title: t(m.title) }))}
      mode={settings.levels}
      onMode={(levels) => update({ levels: levels as LoudLevel })}
      level={
        <Choice<Sensitivity>
          label={t({
            de: "Wie laut?",
            en: "How loud?",
            zh: "要多大声？",
            hi: "कितनी ज़ोर से?",
            es: "¿Qué tan fuerte?",
            ar: "إلى أي حد عالٍ؟",
            ru: "Насколько громко?",
          })}
          value={settings.sensitivity}
          onChange={(sensitivity) => update({ sensitivity })}
          options={[
            {
              value: "low",
              label: t({
                de: "📣 Sehr laut rufen",
                en: "📣 Shout very loud",
                zh: "📣 很大声地喊",
                hi: "📣 बहुत ज़ोर से चिल्लाना",
                es: "📣 Gritar muy fuerte",
                ar: "📣 صراخ عالٍ جدًّا",
                ru: "📣 Очень громко кричать",
              }),
            },
            {
              value: "mid",
              label: t({
                de: "🦁 Laut rufen",
                en: "🦁 Shout loud",
                zh: "🦁 大声喊",
                hi: "🦁 ज़ोर से चिल्लाना",
                es: "🦁 Gritar fuerte",
                ar: "🦁 صراخ عالٍ",
                ru: "🦁 Громко кричать",
              }),
            },
            {
              value: "high",
              label: t({
                de: "🗣️ Etwas lauter reden",
                en: "🗣️ Talk a bit louder",
                zh: "🗣️ 说话稍大声一点",
                hi: "🗣️ थोड़ा ज़ोर से बोलना",
                es: "🗣️ Hablar un poco más fuerte",
                ar: "🗣️ كلام أعلى قليلًا",
                ru: "🗣️ Говорить чуть громче",
              }),
            },
          ]}
        />
      }
      settings={
        <SettingsGroup title={t({ de: "Mikrofon", en: "Microphone", zh: "麦克风", hi: "माइक्रोफ़ोन", es: "Micrófono", ar: "الميكروفون", ru: "Микрофон" })}>
          <MicCheck sensitivity={settings.sensitivity} />
        </SettingsGroup>
      }
    >
      <LoudPlay settings={settings} />
    </GameShell>
  );
}

const HEARD_LABEL: Record<Heard, Localized> = {
  loud: {
    de: "🦁 Laut – der Löwe brüllt!",
    en: "🦁 Loud – the lion roars!",
    zh: "🦁 大声——狮子在吼！",
    hi: "🦁 ज़ोर से – शेर दहाड़ता है!",
    es: "🦁 Fuerte: ¡el león ruge!",
    ar: "🦁 عالٍ – الأسد يزأر!",
    ru: "🦁 Громко — лев рычит!",
  },
  quiet: {
    de: "🐭 Leise – die Maus piepst.",
    en: "🐭 Quiet – the mouse squeaks.",
    zh: "🐭 小声——小老鼠吱吱叫。",
    hi: "🐭 धीरे – चूहा चूँ-चूँ करता है।",
    es: "🐭 Bajito: el ratón chilla.",
    ar: "🐭 هادئ – الفأر يصيء.",
    ru: "🐭 Тихо — мышка пищит.",
  },
};
const HEARD_SHOW_MS = 1500;

/**
 * Lets the grown-up allow the microphone before handing over the device, and
 * try out how loud the child has to be for the lion.
 */
function MicCheck({ sensitivity }: { sensitivity: Sensitivity }) {
  const t = useT();
  const permission = useMicPermission();
  const [testing, setTesting] = useState(false);
  const [heard, setHeard] = useState<Heard | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const heardAt = useRef(0);
  const ear = useMemo(createEar, []);

  const mic = useMicrophone(testing, (db, ms) => {
    const now = performance.now();
    const result = ear.hear(db, ms, false, sensitivity);
    barRef.current?.style.setProperty("--level", ear.meter.toFixed(3));
    if (result) {
      heardAt.current = now;
      setHeard(result);
    } else if (now - heardAt.current > HEARD_SHOW_MS) {
      setHeard(null);
    }
  });

  const start = () => {
    unlockAudio();
    setTesting(true);
  };

  return (
    <div className="mic-check">
      {!testing && (
        <>
          <button type="button" className="mic-check-button" onClick={start}>
            🎤{" "}
            {permission === "granted"
              ? t({
                  de: "Mikrofon ausprobieren",
                  en: "Try the microphone",
                  zh: "试试麦克风",
                  hi: "माइक्रोफ़ोन आज़माएँ",
                  es: "Probar el micrófono",
                  ar: "جرّبوا الميكروفون",
                  ru: "Попробовать микрофон",
                })
              : t({
                  de: "Mikrofon erlauben und ausprobieren",
                  en: "Allow the microphone and try it",
                  zh: "允许使用麦克风并试一试",
                  hi: "माइक्रोफ़ोन की अनुमति दें और आज़माएँ",
                  es: "Permitir el micrófono y probarlo",
                  ar: "اسمحوا بالميكروفون وجرّبوه",
                  ru: "Разрешить микрофон и попробовать",
                })}
          </button>
          {permission === "granted" && (
            <p className="setting-note">
              {t({
                de: "✓ Das Mikrofon ist für diese Seite erlaubt.",
                en: "✓ The microphone is allowed for this site.",
                zh: "✓ 本网站已获准使用麦克风。",
                hi: "✓ इस साइट के लिए माइक्रोफ़ोन की अनुमति है।",
                es: "✓ El micrófono está permitido para este sitio.",
                ar: "✓ الميكروفون مسموح به لهذا الموقع.",
                ru: "✓ Микрофон для этого сайта разрешён.",
              })}
            </p>
          )}
          {permission === "denied" && (
            <p className="setting-note">
              {t({
                de: "Das Mikrofon ist für diese Seite blockiert. Bitte in den Browser-Einstellungen erlauben.",
                en: "The microphone is blocked for this site. Please allow it in the browser settings.",
                zh: "本网站的麦克风被阻止了。请在浏览器设置中允许。",
                hi: "इस साइट के लिए माइक्रोफ़ोन ब्लॉक है। कृपया ब्राउज़र की सेटिंग में अनुमति दें।",
                es: "El micrófono está bloqueado para este sitio. Permítalo en la configuración del navegador.",
                ar: "الميكروفون محظور لهذا الموقع. يُرجى السماح به في إعدادات المتصفح.",
                ru: "Микрофон для этого сайта заблокирован. Пожалуйста, разрешите его в настройках браузера.",
              })}
            </p>
          )}
        </>
      )}
      {testing && mic === "asking" && (
        <p className="setting-note">
          {t({
            de: "Bitte im Browser „Erlauben“ wählen.",
            en: "Please choose “Allow” in the browser.",
            zh: "请在浏览器中选择“允许”。",
            hi: "कृपया ब्राउज़र में “अनुमति दें” चुनें।",
            es: "Elija «Permitir» en el navegador.",
            ar: "يُرجى اختيار «السماح» في المتصفح.",
            ru: "Выберите в браузере «Разрешить».",
          })}
        </p>
      )}
      {testing && mic === "denied" && (
        <p className="setting-note">
          {t({
            de: "Das Mikrofon ist blockiert. Bitte in den Browser-Einstellungen für diese Seite erlauben.",
            en: "The microphone is blocked. Please allow it for this site in the browser settings.",
            zh: "麦克风被阻止了。请在浏览器设置中为本网站允许。",
            hi: "माइक्रोफ़ोन ब्लॉक है। कृपया ब्राउज़र की सेटिंग में इस साइट के लिए अनुमति दें।",
            es: "El micrófono está bloqueado. Permítalo para este sitio en la configuración del navegador.",
            ar: "الميكروفون محظور. يُرجى السماح به لهذا الموقع في إعدادات المتصفح.",
            ru: "Микрофон заблокирован. Пожалуйста, разрешите его в настройках браузера для этого сайта.",
          })}
        </p>
      )}
      {testing && mic === "missing" && (
        <p className="setting-note">
          {t({
            de: "Kein Mikrofon gefunden.",
            en: "No microphone found.",
            zh: "没有找到麦克风。",
            hi: "कोई माइक्रोफ़ोन नहीं मिला।",
            es: "No se encontró ningún micrófono.",
            ar: "لم يُعثر على ميكروفون.",
            ru: "Микрофон не найден.",
          })}
        </p>
      )}
      {testing && mic === "on" && (
        <>
          <div ref={barRef} className="mic-check-meter" style={{ "--threshold": meterAt(ear.loudDb(sensitivity)) } as CSSProperties} aria-hidden>
            <span className="mic-check-level" />
            <span className="mic-check-mark">🦁</span>
          </div>
          <p className="mic-check-heard" role="status">
            {heard
              ? t(HEARD_LABEL[heard])
              : t({
                  de: "Probier mal: leise sprechen, dann laut rufen.",
                  en: "Try it: talk quietly, then shout loudly.",
                  zh: "试试看：先小声说话，再大声喊。",
                  hi: "आज़माइए: पहले धीरे बोलें, फिर ज़ोर से चिल्लाएँ।",
                  es: "Pruebe: hable bajito y luego grite fuerte.",
                  ar: "جرّبوا: تكلّموا بهدوء، ثم اصرخوا بصوت عالٍ.",
                  ru: "Попробуйте: сначала сказать тихо, потом крикнуть громко.",
                })}
          </p>
          <button type="button" className="mic-check-button" onClick={() => setTesting(false)}>
            {t({ de: "Fertig", en: "Done", zh: "完成", hi: "हो गया", es: "Listo", ar: "تم", ru: "Готово" })}
          </button>
        </>
      )}
    </div>
  );
}
