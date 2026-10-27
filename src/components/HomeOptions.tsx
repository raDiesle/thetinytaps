import { useEffect, useState, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { sampleLetter, useLanguagePack } from "@/content/languages";
import { targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { APP_LANGUAGES, OWN_NAMES, setAppLanguage, useAppLanguage, useT } from "@/lib/language";
import { downloadMusic } from "@/lib/musicFile";

/**
 * On the home page, for the grown-ups: small buttons at the top – the play
 * time for all games on the left, fullscreen and the options most games share
 * on the right – each opening its menu only when tapped, so the games fill the screen.
 */
export function HomeOptions() {
  const t = useT();
  const language = useAppLanguage();
  return (
    <nav className="home-bar" aria-label={t({ de: "Für Erwachsene", ru: "Для взрослых" })}>
      <MenuButton icon="⏳" label={t({ de: "Spielzeit", ru: "Время игры" })} side="left">
        <PlaytimeOptions />
      </MenuButton>
      <div className="home-bar-right">
        {/* The language by its own name, so a grown-up who can't read the other one still finds theirs. */}
        <MenuButton icon="🌐" label={OWN_NAMES[language.id].split(" ")[1]} side="right">
          <AppLanguageOptions />
        </MenuButton>
        <FullscreenButton />
        <MenuButton icon="⚙️" label={t({ de: "Einstellungen für alle Spiele", ru: "Настройки для всех игр" })} iconOnly side="right">
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

/** The language of the whole app: the grown-ups' screens and what the games say, where a game speaks it. */
function AppLanguageOptions() {
  const t = useT();
  const language = useAppLanguage();
  return (
    <section className="settings">
      <SettingsGroup title={t({ de: "Sprache", ru: "Язык" })}>
        <Choice
          label={t({ de: "Sprache der App und der Spiele", ru: "Язык приложения и игр" })}
          value={language.id}
          onChange={(id) => setAppLanguage(targetLanguageFor(id).id)}
          options={APP_LANGUAGES.map((id) => ({ value: id, label: OWN_NAMES[id] }))}
        />
      </SettingsGroup>
    </section>
  );
}

function CommonOptions() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const pack = useLanguagePack();
  const b = sampleLetter(pack);

  return (
    <section className="settings">
      <SettingsGroup title={t({ de: "Ton", ru: "Звук" })}>
        <Toggle
          label={t({ de: "Vorlesen (Namen, Sätze, Fragen)", ru: "Читать вслух (названия, фразы, вопросы)" })}
          checked={common.speech}
          onChange={(speech) => update({ speech })}
        />
        {common.speech && <VoiceSetting lang={pack.speechLang} sample={pack.letterSentence(b, b.words[0])} />}
        <Toggle label={t({ de: "Töne und Geräusche", ru: "Звуки и шумы" })} checked={common.sounds} onChange={(sounds) => update({ sounds })} />
        <Toggle
          label={t({ de: "🎵 Musik", ru: "🎵 Музыка" })}
          checked={common.music}
          onChange={(music) => {
            // Switched back on: fetch the song now, so it is there when the game starts.
            if (music) void downloadMusic();
            update({ music });
          }}
        />
        <p className="setting-note">
          {common.music
            ? t({
                de: "Leise Musik im Hintergrund, ab dem ersten Tippen im Spiel. Spiele mit eigener Musik spielen ihre eigene.",
                ru: "Тихая музыка на фоне – с первого касания в игре. Игры со своей музыкой играют свою.",
              })
            : t({
                de: "Keine Musik in allen Spielen – sie wird dann auch nicht heruntergeladen.",
                ru: "Без музыки во всех играх – тогда она и не скачивается.",
              })}
        </p>
      </SettingsGroup>

      <p className="setting-note">
        {t({
          de: "Alles Weitere, was nur zu einem Spiel gehört, steht auf dessen Startseite unter „Einstellungen“.",
          ru: "Всё остальное, что относится только к одной игре, – на её стартовой странице в разделе «Настройки».",
        })}
      </p>
    </section>
  );
}
