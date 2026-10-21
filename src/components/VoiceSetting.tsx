"use client";

import { useEffect, useState } from "react";
import { onVoicesChanged, pickVoice, saveVoiceName, speak, voicesFor } from "@/lib/speech";

/** "Eddy (German (Germany))" → "Eddy", "Microsoft Katja Online (Natural) - German (Germany)" → "Microsoft Katja Online (Natural)" */
const shortName = (voice: SpeechSynthesisVoice) => voice.name.replace(/\s*(-|\()\s*(German|Deutsch).*$/i, "");

/**
 * Lets parents pick and try the voice. If the browser has no voice for the
 * language, explains that nothing will be read aloud.
 */
export function VoiceSetting({ lang, sample }: { lang: string; sample: string }) {
  // null until the browser has had a chance to load its voices.
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
    return (
      <p className="setting-note">
        Dieser Browser hat keine deutsche Stimme, deshalb wird nichts vorgelesen. In Chrome, Edge oder Safari klappt es.
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
        Stimme{" "}
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
        ▶︎ Probe
      </button>
      <p className="setting-note">
        Klingt blechern? Auf dem Mac unter Systemeinstellungen → Bedienungshilfen → Gesprochene Inhalte eine
        bessere Stimme laden (z.&nbsp;B. „Anna (Premium)“). In Chrome klingt „Google Deutsch“ am natürlichsten.
      </p>
    </div>
  );
}
