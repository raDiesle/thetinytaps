import { useState } from "react";
import { LanguageSetting, useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { sampleLetter } from "@/content/languages";
import { useCommonSettings } from "@/lib/common";
import {
  DEFAULT_PLAYTIME_SETTINGS,
  playedToday,
  PLAYTIME_OPTIONS,
  PLAYTIME_SETTINGS_KEY,
  resetPlaytime,
} from "@/lib/playtime";
import { useStoredSettings } from "@/lib/storage";

/**
 * On the home page, for the grown-ups: the play time for all games together,
 * in plain sight, and the options most games share, folded away.
 */
export function HomeOptions() {
  return (
    <section className="home-options">
      <PlaytimeBar />
      <CommonOptions />
    </section>
  );
}

function PlaytimeBar() {
  const [settings, update] = useStoredSettings(PLAYTIME_SETTINGS_KEY, DEFAULT_PLAYTIME_SETTINGS);
  const [played, setPlayed] = useState(() => Math.floor(playedToday() / 60_000));
  const minutes = settings.minutes;
  const left = Math.max(0, minutes - played);

  return (
    <div className="playtime-bar">
      <h2>
        <span aria-hidden>⏳</span> Spielzeit für alle Spiele
      </h2>
      <Choice
        label="Pro Tag"
        value={String(minutes)}
        onChange={(value) => update({ minutes: Number(value) })}
        options={PLAYTIME_OPTIONS.map((m) => ({ value: String(m), label: m ? `${m} Min.` : "∞ Ohne" }))}
      />
      <p className="playtime-status">
        <span>
          Heute gespielt: {played} Min.
          {minutes > 0 && (left > 0 ? ` – noch ${left} Min.` : " – die Spielzeit ist vorbei")}
        </span>
        {played > 0 && (
          <button
            type="button"
            onClick={() => {
              resetPlaytime();
              setPlayed(0);
            }}
          >
            ↺ Von vorn
          </button>
        )}
      </p>
      <p className="setting-note">
        Es zählt jede Minute in irgendeinem Spiel, zusammengerechnet für den ganzen Tag. In der letzten Minute wird alles dunkler, leiser
        und langsamer. Dann sagt das Spiel „Gute Nacht“ und endet von selbst.
      </p>
    </div>
  );
}

function CommonOptions() {
  const [common, update] = useCommonSettings();
  const languages = useLanguages();
  const pack = languages.language.pack;
  const b = sampleLetter(pack);

  return (
    <details className="settings-panel">
      <summary>
        <span aria-hidden>⚙️</span> Für alle Spiele: Sprache, Vorlesen, Töne, Ruhe
      </summary>
      <section className="settings">
        <LanguageSetting settings={languages.settings} update={languages.update} />
        <p className="setting-note">Die Sprache gilt für „Buchstaben &amp; Zahlen“ und „Wörter tippen“; die anderen Spiele sind auf Deutsch.</p>

        <SettingsGroup title="Ton">
          <Toggle label="Vorlesen (Namen, Sätze, Fragen)" checked={common.speech} onChange={(speech) => update({ speech })} />
          {common.speech ? (
            <VoiceSetting lang={pack.speechLang} sample={pack.letterSentence(b, b.words[0])} />
          ) : (
            <p className="setting-note">„Zähne putzen“ sagt seine Ansagen trotzdem – dort lassen sie sich abschalten.</p>
          )}
          <Toggle label="Töne und Geräusche" checked={common.sounds} onChange={(sounds) => update({ sounds })} />
        </SettingsGroup>

        <SettingsGroup title="Verhalten">
          <Toggle
            label="Ruhiger Modus (leiser, weniger Bewegung, langsamer)"
            checked={common.calm}
            onChange={(calm) => update({ calm })}
          />
        </SettingsGroup>
        <p className="setting-note">Alles Weitere, was nur zu einem Spiel gehört, steht auf dessen Startseite unter „Einstellungen“.</p>
      </section>
    </details>
  );
}
