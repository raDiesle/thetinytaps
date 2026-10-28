import { useEffect, useState } from "react";
import { targetLanguageFor } from "@/content/targetLanguages";
import { languageLabel, useAppLanguage, useT } from "@/lib/language";
import { onVoicesChanged, pickVoice, saveVoiceName, speak, voicesFor } from "@/lib/speech";

/** "Eddy (German (Germany))" → "Eddy", "Microsoft Katja Online (Natural) - German (Germany)" → "Microsoft Katja Online (Natural)" */
const shortName = (voice: SpeechSynthesisVoice) =>
  voice.name.replace(/\s*(-|\()\s*(German|Deutsch|English|Englisch|Turkish|Türkisch|Polish|Polnisch|Russian|Russisch|Русский).*$/i, "");

/**
 * Lets parents pick and try the voice. If the browser has no voice for the
 * language, explains that nothing will be read aloud.
 */
export function VoiceSetting({ lang, sample }: { lang: string; sample: string }) {
  // null until the browser has had a chance to load its voices.
  const t = useT();
  const app = useAppLanguage();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[] | null>(null);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    const load = () => {
      const found = voicesFor(lang);
      if (found.length === 0) return;
      setVoices(found);
      setSelected(pickVoice(lang)?.name ?? "");
    };
    load();
    // Chrome loads voices asynchronously; give up waiting after a moment.
    const giveUp = setTimeout(() => setVoices((prev) => prev ?? []), 1500);
    const unsubscribe = onVoicesChanged(load);
    return () => {
      clearTimeout(giveUp);
      unsubscribe();
    };
  }, [lang]);

  if (voices === null) return null;
  if (voices.length === 0) {
    // The language by its speech tag, named on the grown-up's screen ("Russisch" / "Русский").
    const name = languageLabel(targetLanguageFor(lang.slice(0, 2)), app.id).split(" ")[1];
    return (
      <p className="setting-note">
        {t({
          de: `Dieser Browser hat keine Stimme für ${name}, deshalb wird nichts vorgelesen. In Chrome, Edge oder Safari klappt es.`,
          ru: `В этом браузере нет голоса для языка «${name}», поэтому ничего не озвучивается. В Chrome, Edge или Safari получится.`,
          en: `This browser has no voice for ${name}, so nothing is read aloud. It works in Chrome, Edge or Safari.`,
          zh: `此浏览器没有${name}语音，所以不会朗读。在 Chrome、Edge 或 Safari 中可以。`,
          hi: `इस ब्राउज़र में ${name} की आवाज़ नहीं है, इसलिए कुछ भी पढ़कर नहीं सुनाया जाता। Chrome, Edge या Safari में यह चलता है।`,
          es: `Este navegador no tiene voz en ${name.toLowerCase()}, por eso no se lee nada en voz alta. En Chrome, Edge o Safari funciona.`,
          ar: `لا يوجد في هذا المتصفح صوت للغة ${name}، لذلك لا تتم القراءة بصوت عالٍ. يعمل ذلك في Chrome أو Edge أو Safari.`,
        })}
      </p>
    );
  }

  const choose = (name: string) => {
    setSelected(name);
    saveVoiceName(name);
    speak(sample, lang);
  };

  return (
    <div className="voice-setting">
      <label>
        {t({ de: "Stimme", ru: "Голос", en: "Voice", zh: "语音", hi: "आवाज़", es: "Voz", ar: "صوت القراءة" })}{" "}
        <select value={selected} onChange={(e) => choose(e.target.value)}>
          {voices.map((v) => (
            <option key={v.name} value={v.name}>
              {shortName(v)}
              {v.localService ? "" : " (online)"}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={() => speak(sample, lang)}>
        ▶︎ {t({ de: "Probe", ru: "Прослушать", en: "Listen", zh: "试听", hi: "सुनें", es: "Escuchar", ar: "استماع" })}
      </button>
      {lang.startsWith("de") && (
        <p className="setting-note">
          {t({
            de: "Klingt blechern? Auf dem Mac unter Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte eine bessere Stimme laden (z. B. „Anna (Premium)“). In Chrome klingt „Google Deutsch“ am natürlichsten.",
            ru: "Звучит металлически? На Mac загрузите голос получше: Системные настройки → Универсальный доступ → Устный контент (например, «Anna (Premium)»). В Chrome естественнее всего звучит «Google Deutsch».",
            en: "Sounds tinny? On a Mac, load a better voice under System Settings → Accessibility → Spoken Content (e.g. “Anna (Premium)”). In Chrome, “Google Deutsch” sounds most natural.",
            zh: "听起来很生硬？在 Mac 上可在“系统设置 → 辅助功能 → 朗读内容”中下载更好的语音（例如“Anna (Premium)”）。在 Chrome 中，“Google Deutsch”听起来最自然。",
            hi: "आवाज़ मशीनी लगती है? Mac पर सिस्टम सेटिंग्स → एक्सेसिबिलिटी → स्पोकन कंटेंट में बेहतर आवाज़ डाउनलोड करें (जैसे “Anna (Premium)”)। Chrome में “Google Deutsch” सबसे स्वाभाविक लगती है।",
            es: "¿Suena metálica? En un Mac, descargue una voz mejor en Ajustes del Sistema → Accesibilidad → Contenido leído (p. ej., «Anna (Premium)»). En Chrome, «Google Deutsch» suena más natural.",
            ar: "هل يبدو الصوت معدنيًا؟ على Mac يمكنكم تنزيل صوت أفضل من إعدادات النظام ← تسهيلات الاستخدام ← المحتوى المنطوق (مثل «Anna (Premium)»). في Chrome يبدو «Google Deutsch» الأكثر طبيعية.",
          })}
        </p>
      )}
      {lang.startsWith("ru") && (
        <p className="setting-note">
          {t({
            de: "Klingt blechern? Auf dem Mac unter Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte eine russische Stimme laden (z. B. „Milena (Premium)“). In Chrome klingt „Google русский“ am natürlichsten.",
            ru: "Звучит металлически? На Mac загрузите русский голос: Системные настройки → Универсальный доступ → Устный контент (например, «Milena (Premium)»). В Chrome естественнее всего звучит «Google русский».",
            en: "Sounds tinny? On a Mac, load a Russian voice under System Settings → Accessibility → Spoken Content (e.g. “Milena (Premium)”). In Chrome, “Google русский” sounds most natural.",
            zh: "听起来很生硬？在 Mac 上可在“系统设置 → 辅助功能 → 朗读内容”中下载俄语语音（例如“Milena (Premium)”）。在 Chrome 中，“Google русский”听起来最自然。",
            hi: "आवाज़ मशीनी लगती है? Mac पर सिस्टम सेटिंग्स → एक्सेसिबिलिटी → स्पोकन कंटेंट में रूसी आवाज़ डाउनलोड करें (जैसे “Milena (Premium)”)। Chrome में “Google русский” सबसे स्वाभाविक लगती है।",
            es: "¿Suena metálica? En un Mac, descargue una voz rusa en Ajustes del Sistema → Accesibilidad → Contenido leído (p. ej., «Milena (Premium)»). En Chrome, «Google русский» suena más natural.",
            ar: "هل يبدو الصوت معدنيًا؟ على Mac يمكنكم تنزيل صوت روسي من إعدادات النظام ← تسهيلات الاستخدام ← المحتوى المنطوق (مثل «Milena (Premium)»). في Chrome يبدو «Google русский» الأكثر طبيعية.",
          })}
        </p>
      )}
    </div>
  );
}
