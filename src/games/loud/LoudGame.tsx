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
      info={
        <>
          <p>
            {t({
              de: "Löwe und Maus: Ruft das Kind laut, brüllt der Löwe und springt. Spricht oder flüstert es leise, piepst die kleine Maus. Nach zehn Tönen geht es mit „Weiter“ zum Pusten.",
              en: "Lion and Mouse: when the child shouts loudly, the lion roars and jumps. When the child talks or whispers quietly, the little mouse squeaks. After ten sounds, “Next” goes on to Blowing.",
              zh: "狮子和老鼠：孩子大声喊，狮子就吼叫着跳起来；孩子小声说话或轻声耳语，小老鼠就吱吱叫。十个声音之后，点“继续”就进入“吹一吹”。",
              hi: "शेर और चूहा: बच्चा ज़ोर से चिल्लाए तो शेर दहाड़ता है और उछलता है। धीरे से बोले या फुसफुसाए तो छोटा चूहा चूँ-चूँ करता है। दस आवाज़ों के बाद “आगे” से “फूँकना” शुरू होता है।",
              es: "El león y el ratón: si el niño o la niña grita fuerte, el león ruge y salta. Si habla o susurra bajito, chilla el ratoncito. Después de diez sonidos, «Siguiente» lleva a Soplar.",
              ar: "الأسد والفأر: عندما يصرخ الطفل بصوت عالٍ يزأر الأسد ويقفز. وعندما يتكلم أو يهمس بهدوء يصيء الفأر الصغير. بعد عشرة أصوات ينتقل «التالي» إلى النفخ.",
              ru: "Лев и мышка: если ребёнок громко кричит, лев рычит и прыгает. Если говорит или шепчет тихо, пищит маленькая мышка. После десяти звуков «Дальше» ведёт к игре «Дуем».",
            })}
          </p>
          <p>
            {t({
              de: "Pusten: Ins Mikrofon pusten bläst die Kerzen auf dem Geburtstagskuchen aus, lässt die Schirmchen der Pusteblume fliegen, dreht ein Windrad, bis der Regenbogen fertig ist, und treibt das Segelboot mit der Maus zum Löwen. Lautes Rufen pustet auch; so laut wie für den Löwen ist ganz fest gepustet.",
              en: "Blowing: blowing into the microphone blows out the candles on the birthday cake, makes the dandelion fluff fly, spins a pinwheel until the rainbow is done, and drives the sailboat with the mouse to the lion. Loud shouting blows too; as loud as for the lion means blowing really hard.",
              zh: "吹一吹：对着麦克风吹气，可以吹灭生日蛋糕上的蜡烛，吹飞蒲公英的小伞，吹转风车直到彩虹画好，还能把载着小老鼠的帆船吹到狮子那里。大声喊也算吹；像让狮子吼那么大声，就是用力吹。",
              hi: "फूँकना: माइक्रोफ़ोन में फूँकने से जन्मदिन के केक की मोमबत्तियाँ बुझती हैं, सिंहपर्णी के रुएँ उड़ते हैं, फिरकी तब तक घूमती है जब तक इंद्रधनुष पूरा न हो, और पाल वाली नाव चूहे को शेर के पास ले जाती है। ज़ोर से चिल्लाना भी फूँक गिना जाता है; शेर जितनी ज़ोर से, यानी बहुत ज़ोर से फूँकना।",
              es: "Soplar: al soplar en el micrófono se apagan las velas del pastel de cumpleaños, vuelan las semillitas del diente de león, gira un molinillo hasta que el arcoíris está completo y el velero lleva al ratón hasta el león. Gritar fuerte también sopla; tan fuerte como para el león es soplar muy fuerte.",
              ar: "النفخ: النفخ في الميكروفون يطفئ شموع كعكة عيد الميلاد، ويُطيّر مظلات زهرة الهندباء، ويُدير مروحة ورقية حتى يكتمل قوس قزح، ويدفع المركب الشراعي بالفأر إلى الأسد. الصراخ العالي ينفخ أيضًا؛ وبقدر علوّ الصوت للأسد يكون النفخ قويًّا جدًّا.",
              ru: "Дуем: если дуть в микрофон, гаснут свечки на праздничном торте, разлетаются пушинки одуванчика, крутится вертушка, пока не появится радуга, и парусник везёт мышку ко льву. Громкий крик тоже дует; так громко, как для льва, — значит, подуть очень сильно.",
            })}
          </p>
          <p>
            {t({
              de: "Das Spiel misst nur, wie laut es gerade ist – nichts wird aufgenommen, gespeichert oder verschickt. Antippen geht auch: Ein Tipp ist ein kurzer Puster, Finger draufhalten pustet weiter.",
              en: "The game only measures how loud it is right now – nothing is recorded, saved or sent. Tapping works too: a tap is a short puff, holding a finger down keeps blowing.",
              zh: "游戏只测量当前有多大声——不录音、不保存、不发送任何内容。点屏幕也可以：点一下是短短吹一口，按住不放就一直吹。",
              hi: "खेल सिर्फ़ यह मापता है कि अभी कितनी आवाज़ है – कुछ भी रिकॉर्ड, सेव या भेजा नहीं जाता। टैप करना भी चलता है: एक टैप एक छोटी फूँक है, उँगली दबाए रखने से फूँक चलती रहती है।",
              es: "El juego solo mide qué tan fuerte suena en este momento: no se graba, guarda ni envía nada. También se puede tocar: un toque es un soplido corto, y mantener el dedo sigue soplando.",
              ar: "اللعبة تقيس فقط مدى علوّ الصوت الآن – لا يُسجَّل شيء ولا يُحفظ ولا يُرسل. اللمس يعمل أيضًا: اللمسة نفخة قصيرة، وإبقاء الإصبع ضاغطًا يواصل النفخ.",
              ru: "Игра только измеряет, насколько сейчас громко, — ничего не записывается, не сохраняется и не отправляется. Нажимать тоже можно: короткое нажатие — короткий порыв ветра, если держать палец, ветер дует дальше.",
            })}
          </p>
          <p>
            {t({
              de: "Mit „Vorlesen“ auf der Startseite sprechen die Tiere („Roaaar! Ich bin der Löwe!“) und laden zum Rufen und Pusten ein.",
              en: "With “Read aloud” on the home page, the animals talk (“Roaaar! I'm the lion!”) and invite the child to shout and blow.",
              zh: "在首页打开“朗读”后，动物们会说话（“嗷呜！我是狮子！”），还会邀请孩子喊和吹。",
              hi: "मुख्य पेज पर “पढ़कर सुनाओ” चालू हो तो जानवर बोलते हैं (“गर्र्र! मैं शेर हूँ!”) और चिल्लाने व फूँकने को बुलाते हैं।",
              es: "Con «Leer en voz alta» en la página de inicio, los animales hablan («¡Grrraaau! ¡Soy el león!») e invitan a gritar y soplar.",
              ar: "عند تشغيل «القراءة بصوت عالٍ» في الصفحة الرئيسية تتكلم الحيوانات («غرررر! أنا الأسد!») وتدعو إلى الصراخ والنفخ.",
              ru: "Если на главной странице включено «Читать вслух», звери говорят («Р-р-р! Я лев!») и зовут кричать и дуть.",
            })}
          </p>
        </>
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
