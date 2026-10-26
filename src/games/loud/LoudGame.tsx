import { useMemo, useRef, useState, type CSSProperties } from "react";
import { GameShell } from "@/components/GameShell";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { useGameSettings } from "@/lib/common";
import { type Localized, useT } from "@/lib/language";
import { unlockAudio } from "@/lib/sfx";
import { createEar, meterAt, useMicPermission, useMicrophone, type Heard } from "./mic";
import { LoudPlay } from "./LoudPlay";
import { DEFAULT_LOUD_SETTINGS, LOUD_SETTINGS_KEY, type LoudLevels, type Sensitivity } from "./settings";
import "./loud.css";

const MODES: { id: string; emoji: string; title: Localized; featured?: boolean }[] = [
  { id: "all", emoji: "🌈", title: { de: "Beides nacheinander", ru: "Оба по очереди" }, featured: true },
  { id: "voice", emoji: "🦁", title: { de: "Löwe und Maus", ru: "Лев и мышка" } },
  { id: "blow", emoji: "🎂", title: { de: "Pusten", ru: "Дуем" } },
];

export function LoudGame() {
  const [settings, update] = useGameSettings(LOUD_SETTINGS_KEY, DEFAULT_LOUD_SETTINGS);
  const t = useT();

  return (
    <GameShell
      title={t({ de: "Laut und leise", ru: "Громко и тихо" })}
      emoji="🦁"
      modes={MODES.map((m) => ({ ...m, title: t(m.title) }))}
      mode={settings.levels}
      onMode={(levels) => update({ levels: levels as LoudLevels })}
      level={
        <Choice<Sensitivity>
          label={t({ de: "Wie laut?", ru: "Насколько громко?" })}
          value={settings.sensitivity}
          onChange={(sensitivity) => update({ sensitivity })}
          options={[
            { value: "low", label: t({ de: "📣 Sehr laut rufen", ru: "📣 Очень громко кричать" }) },
            { value: "mid", label: t({ de: "🦁 Laut rufen", ru: "🦁 Громко кричать" }) },
            { value: "high", label: t({ de: "🗣️ Etwas lauter reden", ru: "🗣️ Говорить чуть громче" }) },
          ]}
        />
      }
      info={
        <>
          <p>
            {t({
              de: "Löwe und Maus: Ruft das Kind laut, brüllt der Löwe und springt. Spricht oder flüstert es leise, piepst die kleine Maus. Nacheinander geht es nach zehn Tönen weiter zum Pusten.",
              ru: "Лев и мышка: если ребёнок громко кричит, лев рычит и подпрыгивает. Если говорит или шепчет тихо, пищит маленькая мышка. В режиме «Оба по очереди» после десяти звуков игра переходит к «Дуем».",
            })}
          </p>
          <p>
            {t({
              de: "Pusten: Ins Mikrofon pusten bläst die Kerzen auf dem Geburtstagskuchen aus, lässt die Schirmchen der Pusteblume fliegen, dreht ein Windrad, bis der Regenbogen fertig ist, und treibt das Segelboot mit der Maus zum Löwen. Lautes Rufen pustet auch; so laut wie für den Löwen ist ganz fest gepustet.",
              ru: "Дуем: если дуть в микрофон, гаснут свечки на праздничном торте, разлетаются пушинки одуванчика, крутится вертушка, пока не появится радуга, и парусник везёт мышку ко льву. Громкий крик тоже дует; так громко, как для льва, — значит, подуть очень сильно.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel misst nur, wie laut es gerade ist – nichts wird aufgenommen, gespeichert oder verschickt. Antippen geht auch: Ein Tipp ist ein kurzer Puster, Finger draufhalten pustet weiter.",
              ru: "Игра только измеряет, насколько сейчас громко, — ничего не записывается, не сохраняется и не отправляется. Нажимать тоже можно: короткое нажатие — короткий порыв ветра, если держать палец, ветер дует дальше.",
            })}
          </p>
          <p>
            {t({
              de: "Mit „Vorlesen“ auf der Startseite sprechen die Tiere („Roaaar! Ich bin der Löwe!“) und laden zum Rufen und Pusten ein.",
              ru: "Если на главной странице включено «Читать вслух», звери говорят («Р-р-р! Я лев!») и зовут кричать и дуть.",
            })}
          </p>
        </>
      }
      settings={
        <SettingsGroup title={t({ de: "Mikrofon", ru: "Микрофон" })}>
          <MicCheck sensitivity={settings.sensitivity} />
        </SettingsGroup>
      }
    >
      <LoudPlay settings={settings} />
    </GameShell>
  );
}

const HEARD_LABEL: Record<Heard, Localized> = {
  loud: { de: "🦁 Laut – der Löwe brüllt!", ru: "🦁 Громко — лев рычит!" },
  quiet: { de: "🐭 Leise – die Maus piepst.", ru: "🐭 Тихо — мышка пищит." },
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
              ? t({ de: "Mikrofon ausprobieren", ru: "Попробовать микрофон" })
              : t({ de: "Mikrofon erlauben und ausprobieren", ru: "Разрешить микрофон и попробовать" })}
          </button>
          {permission === "granted" && (
            <p className="setting-note">{t({ de: "✓ Das Mikrofon ist für diese Seite erlaubt.", ru: "✓ Микрофон для этого сайта разрешён." })}</p>
          )}
          {permission === "denied" && (
            <p className="setting-note">
              {t({
                de: "Das Mikrofon ist für diese Seite blockiert. Bitte in den Browser-Einstellungen erlauben.",
                ru: "Микрофон для этого сайта заблокирован. Пожалуйста, разрешите его в настройках браузера.",
              })}
            </p>
          )}
        </>
      )}
      {testing && mic === "asking" && (
        <p className="setting-note">{t({ de: "Bitte im Browser „Erlauben“ wählen.", ru: "Выберите в браузере «Разрешить»." })}</p>
      )}
      {testing && mic === "denied" && (
        <p className="setting-note">
          {t({
            de: "Das Mikrofon ist blockiert. Bitte in den Browser-Einstellungen für diese Seite erlauben.",
            ru: "Микрофон заблокирован. Пожалуйста, разрешите его в настройках браузера для этого сайта.",
          })}
        </p>
      )}
      {testing && mic === "missing" && <p className="setting-note">{t({ de: "Kein Mikrofon gefunden.", ru: "Микрофон не найден." })}</p>}
      {testing && mic === "on" && (
        <>
          <div ref={barRef} className="mic-check-meter" style={{ "--threshold": meterAt(ear.loudDb(sensitivity)) } as CSSProperties} aria-hidden>
            <span className="mic-check-level" />
            <span className="mic-check-mark">🦁</span>
          </div>
          <p className="mic-check-heard" role="status">
            {heard
              ? t(HEARD_LABEL[heard])
              : t({ de: "Probier mal: leise sprechen, dann laut rufen.", ru: "Попробуйте: сначала сказать тихо, потом крикнуть громко." })}
          </p>
          <button type="button" className="mic-check-button" onClick={() => setTesting(false)}>
            {t({ de: "Fertig", ru: "Готово" })}
          </button>
        </>
      )}
    </div>
  );
}
