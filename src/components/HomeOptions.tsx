import { useEffect, useState, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { LanguageSetting, useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { sampleLetter } from "@/content/languages";
import { downloadMusic } from "@/lib/musicFile";
import { useCommonSettings } from "@/lib/common";
import { DEFAULT_PLAYTIME_SETTINGS, playedToday, PLAYTIME_OPTIONS, PLAYTIME_SETTINGS_KEY, resetPlaytime } from "@/lib/playtime";
import { useStoredSettings } from "@/lib/storage";

/**
 * On the home page, for the grown-ups: small buttons at the top – the play
 * time for all games on the left, fullscreen and the options most games share
 * on the right – each opening its menu only when tapped, so the games fill the screen.
 */
export function HomeOptions() {
  return (
    <nav className="home-bar" aria-label="Für Erwachsene">
      <MenuButton icon="⏳" label="Spielzeit" side="left">
        <PlaytimeOptions />
      </MenuButton>
      <div className="home-bar-right">
        <FullscreenButton />
        <MenuButton icon="⚙️" label="Einstellungen für alle Spiele" iconOnly side="right">
          <CommonOptions />
        </MenuButton>
      </div>
    </nav>
  );
}

/**
 * A small button that drops down a menu. Tapping outside or Escape closes it;
 * the tap that closes it lands on a see-through backdrop, so it never also
 * starts the game underneath.
 */
function MenuButton({
  icon,
  label,
  iconOnly = false,
  side,
  children,
}: {
  icon: string;
  label: string;
  iconOnly?: boolean;
  side: "left" | "right";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={`home-menu ${side}`}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: a tap beside the menu closes it; Esc does the same */}
      {open && <div className="home-menu-backdrop" onClick={() => setOpen(false)} />}
      <button
        type="button"
        className={`home-menu-button${iconOnly ? " icon-only" : ""}`}
        aria-expanded={open}
        aria-label={iconOnly ? label : undefined}
        title={iconOnly ? label : undefined}
        onClick={() => setOpen(!open)}
      >
        <span aria-hidden>{icon}</span>
        {!iconOnly && label}
      </button>
      {open && <div className="home-menu-panel">{children}</div>}
    </div>
  );
}

function PlaytimeOptions() {
  const [settings, update] = useStoredSettings(PLAYTIME_SETTINGS_KEY, DEFAULT_PLAYTIME_SETTINGS);
  const [played, setPlayed] = useState(() => Math.floor(playedToday() / 60_000));
  const minutes = settings.minutes;
  const left = Math.max(0, minutes - played);

  return (
    <section className="settings">
      <SettingsGroup title="Spielzeit für alle Spiele">
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
      </SettingsGroup>
    </section>
  );
}

function CommonOptions() {
  const [common, update] = useCommonSettings();
  const languages = useLanguages();
  const pack = languages.language.pack;
  const b = sampleLetter(pack);

  return (
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
        <Toggle
          label="🎵 Musik"
          checked={common.music}
          onChange={(music) => {
            // Switched back on: fetch the song now, so it is there when the game starts.
            if (music) void downloadMusic();
            update({ music });
          }}
        />
        <p className="setting-note">
          {common.music
            ? "Leise Musik im Hintergrund, ab dem ersten Tippen im Spiel. Spiele mit eigener Musik spielen ihre eigene."
            : "Keine Musik in allen Spielen – sie wird dann auch nicht heruntergeladen."}
        </p>
      </SettingsGroup>

      <p className="setting-note">Alles Weitere, was nur zu einem Spiel gehört, steht auf dessen Startseite unter „Einstellungen“.</p>
    </section>
  );
}
