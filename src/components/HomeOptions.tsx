import { useEffect, useState, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { LanguageSetting, useLanguages } from "@/components/LanguageSetting";
import { Choice, SettingsGroup, Toggle } from "@/components/SettingControls";
import { VoiceSetting } from "@/components/VoiceSetting";
import { sampleLetter } from "@/content/languages";
import { targetLanguageFor } from "@/content/targetLanguages";
import { useCommonSettings } from "@/lib/common";
import { APP_LANGUAGES, OWN_NAMES, setAppLanguage, useAppLanguage, useT } from "@/lib/language";
import { downloadMusic } from "@/lib/musicFile";
import { DEFAULT_PLAYTIME_SETTINGS, playedToday, PLAYTIME_OPTIONS, PLAYTIME_SETTINGS_KEY, resetPlaytime } from "@/lib/playtime";
import { useStoredSettings } from "@/lib/storage";

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

function PlaytimeOptions() {
  const t = useT();
  const [settings, update] = useStoredSettings(PLAYTIME_SETTINGS_KEY, DEFAULT_PLAYTIME_SETTINGS);
  const [played, setPlayed] = useState(() => Math.floor(playedToday() / 60_000));
  const minutes = settings.minutes;
  const left = Math.max(0, minutes - played);

  return (
    <section className="settings">
      <SettingsGroup title={t({ de: "Spielzeit für alle Spiele", ru: "Время игры для всех игр" })}>
        <Choice
          label={t({ de: "Pro Tag", ru: "В день" })}
          value={String(minutes)}
          onChange={(value) => update({ minutes: Number(value) })}
          options={PLAYTIME_OPTIONS.map((m) => ({
            value: String(m),
            label: m ? t({ de: `${m} Min.`, ru: `${m} мин.` }) : t({ de: "∞ Ohne", ru: "∞ Без ограничения" }),
          }))}
        />
        <p className="playtime-status">
          <span>
            {t({ de: `Heute gespielt: ${played} Min.`, ru: `Сегодня сыграно: ${played} мин.` })}
            {minutes > 0 &&
              (left > 0
                ? t({ de: ` – noch ${left} Min.`, ru: ` – осталось ${left} мин.` })
                : t({ de: " – die Spielzeit ist vorbei", ru: " – время игры закончилось" }))}
          </span>
          {played > 0 && (
            <button
              type="button"
              onClick={() => {
                resetPlaytime();
                setPlayed(0);
              }}
            >
              ↺ {t({ de: "Von vorn", ru: "Сначала" })}
            </button>
          )}
        </p>
      </SettingsGroup>
    </section>
  );
}

function CommonOptions() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const languages = useLanguages();
  const pack = languages.language.pack;
  const b = sampleLetter(pack);

  return (
    <section className="settings">
      <LanguageSetting settings={languages.settings} update={languages.update} />
      <p className="setting-note">
        {t({
          de: "Diese Sprache gilt für „Buchstaben & Zahlen“ und „Wörter tippen“; das Bewegungsabenteuer hat seine eigene Sprachwahl. Alle anderen Spiele sprechen die Sprache der App (🌐 oben).",
          ru: "Этот язык действует в «Буквах и цифрах» и «Печатаем слова»; у «Приключений в движении» свой выбор языка. Все остальные игры говорят на языке приложения (🌐 вверху).",
        })}
      </p>

      <SettingsGroup title={t({ de: "Ton", ru: "Звук" })}>
        <Toggle
          label={t({ de: "Vorlesen (Namen, Sätze, Fragen)", ru: "Озвучивание (названия, фразы, вопросы)" })}
          checked={common.speech}
          onChange={(speech) => update({ speech })}
        />
        {common.speech ? (
          <VoiceSetting lang={pack.speechLang} sample={pack.letterSentence(b, b.words[0])} />
        ) : (
          <p className="setting-note">
            {t({
              de: "„Zähne putzen“ sagt seine Ansagen trotzdem – dort lassen sie sich abschalten.",
              ru: "«Чистим зубы» всё равно говорит свои подсказки – их можно выключить там.",
            })}
          </p>
        )}
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
