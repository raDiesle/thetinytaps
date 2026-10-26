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
        {t({ de: "Stimme", ru: "Голос" })}{" "}
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
        ▶︎ {t({ de: "Probe", ru: "Прослушать" })}
      </button>
      {lang.startsWith("de") && (
        <p className="setting-note">
          {t({
            de: "Klingt blechern? Auf dem Mac unter Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte eine bessere Stimme laden (z. B. „Anna (Premium)“). In Chrome klingt „Google Deutsch“ am natürlichsten.",
            ru: "Звучит металлически? На Mac загрузите голос получше: Системные настройки → Универсальный доступ → Устный контент (например, «Anna (Premium)»). В Chrome естественнее всего звучит «Google Deutsch».",
          })}
        </p>
      )}
      {lang.startsWith("ru") && (
        <p className="setting-note">
          {t({
            de: "Klingt blechern? Auf dem Mac unter Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte eine russische Stimme laden (z. B. „Milena (Premium)“). In Chrome klingt „Google русский“ am natürlichsten.",
            ru: "Звучит металлически? На Mac загрузите русский голос: Системные настройки → Универсальный доступ → Устный контент (например, «Milena (Premium)»). В Chrome естественнее всего звучит «Google русский».",
          })}
        </p>
      )}
    </div>
  );
}
