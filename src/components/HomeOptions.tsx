import { useEffect, useRef, useState, type ReactNode } from "react";
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
 * On the home page, for the grown-ups: small buttons in the top left corner –
 * the play time for all games, the language, fullscreen and the options most
 * games share – each opening its menu only when tapped, so the games fill the
 * screen. All on the left, so the sun in the top right corner stays in sight.
 */
export function HomeOptions() {
  const t = useT();
  const language = useAppLanguage();
  return (
    <nav
      className="home-bar"
      aria-label={t({ de: "Für Erwachsene", ru: "Для взрослых", en: "For grown-ups", zh: "家长专用", hi: "बड़ों के लिए", es: "Para adultos", ar: "للكبار" })}
    >
      <MenuButton
        icon="⏳"
        label={t({ de: "Spielzeit", ru: "Время игры", en: "Play time", zh: "游戏时间", hi: "खेलने का समय", es: "Tiempo de juego", ar: "وقت اللعب" })}
      >
        <PlaytimeOptions />
      </MenuButton>
      {/* The language by its own name, so a grown-up who can't read the other one still finds theirs. */}
      <MenuButton icon="🌐" label={OWN_NAMES[language.id].split(" ")[1]}>
        <AppLanguageOptions />
      </MenuButton>
      <FullscreenButton />
      <MenuButton
        icon="⚙️"
        label={t({
          de: "Einstellungen für alle Spiele",
          ru: "Настройки для всех игр",
          en: "Settings for all games",
          zh: "所有游戏的设置",
          hi: "सभी खेलों की सेटिंग्स",
          es: "Ajustes para todos los juegos",
          ar: "إعدادات كل الألعاب",
        })}
        iconOnly
      >
        <CommonOptions />
      </MenuButton>
    </nav>
  );
}

/**
 * A small button that drops down a menu; on a phone the menu covers the whole
 * screen, with its name and ✕ on top. Tapping outside, ✕ or Escape closes it;
 * the tap that closes it lands on a see-through backdrop, so it never also
 * starts the game underneath. While there is more below, a bar at the bottom
 * says so, so a grown-up knows to scroll.
 */
function MenuButton({ icon, label, iconOnly = false, children }: { icon: string; label: string; iconOnly?: boolean; children: ReactNode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [more, setMore] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Whether anything is hidden below: checked on scrolling and whenever the menu or its content changes size.
  useEffect(() => {
    const box = panel.current;
    if (!open || !box) return;
    const check = () => setMore(box.scrollTop + box.clientHeight < box.scrollHeight - 8);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(box);
    for (const child of box.children) observer.observe(child);
    box.addEventListener("scroll", check, { passive: true });
    return () => {
      observer.disconnect();
      box.removeEventListener("scroll", check);
    };
  }, [open]);

  const scrollDown = () => {
    const box = panel.current;
    box?.scrollBy({ top: box.clientHeight * 0.7, behavior: "smooth" });
  };

  return (
    <div className="home-menu">
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
      {open && (
        <div ref={panel} className="home-menu-panel">
          <div className="home-menu-head">
            <span className="home-menu-name">
              <span aria-hidden>{icon}</span> {label}
            </span>
            <button
              type="button"
              className="home-menu-close"
              aria-label={t({ de: "Schließen", ru: "Закрыть", en: "Close", zh: "关闭", hi: "बंद करें", es: "Cerrar", ar: "إغلاق" })}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="home-menu-body">{children}</div>
          {more && (
            <button type="button" className="home-menu-more" onClick={scrollDown}>
              <span aria-hidden>▼</span>{" "}
              {t({
                de: "Weiter unten gibt es mehr",
                ru: "Ниже есть ещё",
                en: "There’s more further down",
                zh: "下面还有更多",
                hi: "नीचे और भी है",
                es: "Hay más abajo",
                ar: "يوجد المزيد في الأسفل",
              })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** The language of the whole app: the grown-ups' screens and what the games say, where a game speaks it. */
function AppLanguageOptions() {
  const t = useT();
  const language = useAppLanguage();
  return (
    <section className="settings">
      <SettingsGroup title={t({ de: "Sprache", ru: "Язык", en: "Language", zh: "语言", hi: "भाषा", es: "Idioma", ar: "اللغة" })}>
        <Choice
          label={t({
            de: "Sprache der App und der Spiele",
            ru: "Язык приложения и игр",
            en: "Language of the app and the games",
            zh: "应用和游戏的语言",
            hi: "ऐप और खेलों की भाषा",
            es: "Idioma de la app y de los juegos",
            ar: "لغة التطبيق والألعاب",
          })}
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
      <SettingsGroup title={t({ de: "Ton", ru: "Звук", en: "Sound", zh: "声音", hi: "ध्वनि", es: "Sonido", ar: "الصوت" })}>
        <Toggle
          label={t({
            de: "Vorlesen (Namen, Sätze, Fragen)",
            ru: "Читать вслух (названия, фразы, вопросы)",
            en: "Read aloud (names, sentences, questions)",
            zh: "朗读（名称、句子、问题）",
            hi: "पढ़कर सुनाना (नाम, वाक्य, सवाल)",
            es: "Leer en voz alta (nombres, frases, preguntas)",
            ar: "القراءة بصوت عالٍ (الأسماء، الجمل، الأسئلة)",
          })}
          checked={common.speech}
          onChange={(speech) => update({ speech })}
        />
        {common.speech && <VoiceSetting lang={pack.speechLang} sample={pack.letterSentence(b, b.words[0])} />}
        <Toggle
          label={t({
            de: "Töne und Geräusche",
            ru: "Звуки и шумы",
            en: "Sounds and noises",
            zh: "声音和音效",
            hi: "आवाज़ें और ध्वनि प्रभाव",
            es: "Sonidos y ruidos",
            ar: "الأصوات والمؤثرات",
          })}
          checked={common.sounds}
          onChange={(sounds) => update({ sounds })}
        />
        <Toggle
          label={t({ de: "🎵 Musik", ru: "🎵 Музыка", en: "🎵 Music", zh: "🎵 音乐", hi: "🎵 संगीत", es: "🎵 Música", ar: "🎵 الموسيقى" })}
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
                en: "Soft music in the background, from the first tap in the game. Games with their own music play their own.",
                zh: "轻柔的背景音乐，从游戏里第一次点按开始。有自己音乐的游戏播放自己的音乐。",
                hi: "हल्का बैकग्राउंड संगीत, खेल में पहले टैप से। जिन खेलों का अपना संगीत है, वे अपना ही बजाते हैं।",
                es: "Música suave de fondo desde el primer toque en el juego. Los juegos con música propia tocan la suya.",
                ar: "موسيقى هادئة في الخلفية من أول لمسة في اللعبة. الألعاب التي لها موسيقاها تشغّل موسيقاها الخاصة.",
              })
            : t({
                de: "Keine Musik in allen Spielen – sie wird dann auch nicht heruntergeladen.",
                ru: "Без музыки во всех играх – тогда она и не скачивается.",
                en: "No music in any game – then it isn’t downloaded either.",
                zh: "所有游戏都不放音乐——也就不会下载音乐。",
                hi: "किसी भी खेल में संगीत नहीं – तब वह डाउनलोड भी नहीं होता।",
                es: "Sin música en ningún juego; así tampoco se descarga.",
                ar: "لا موسيقى في أي لعبة – وعندها لا يتم تنزيلها أيضًا.",
              })}
        </p>
      </SettingsGroup>

      <p className="setting-note">
        {t({
          de: "Alles Weitere, was nur zu einem Spiel gehört, steht auf dessen Startseite unter „Einstellungen“.",
          ru: "Всё остальное, что относится только к одной игре, – на её стартовой странице в разделе «Настройки».",
          en: "Everything else that belongs to just one game is on that game’s start page under “Settings”.",
          zh: "只属于某一个游戏的其他选项，在该游戏开始页的“设置”里。",
          hi: "बाकी सब कुछ जो सिर्फ़ एक खेल से जुड़ा है, उस खेल के शुरुआती पेज पर “सेटिंग्स” में है।",
          es: "Todo lo demás que pertenece a un solo juego está en su página de inicio, en «Ajustes».",
          ar: "كل ما يخص لعبة واحدة فقط موجود في صفحة بدايتها تحت «الإعدادات».",
        })}
      </p>
    </section>
  );
}
