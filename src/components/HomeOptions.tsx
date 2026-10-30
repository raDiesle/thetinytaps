import { useEffect, useRef, useState, type ReactNode } from "react";
import { FullscreenButton } from "@/components/FullscreenButton";
import { PlaytimeOptions } from "@/components/PlaytimeOptions";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { targetLanguageFor } from "@/content/targetLanguages";
import { type Figure, useCommonSettings } from "@/lib/common";
import { APP_LANGUAGES, OWN_NAMES, setAppLanguage, useAppLanguage, useT } from "@/lib/language";
import { downloadMusic } from "@/lib/musicFile";

/**
 * On the home page, for the grown-ups: small buttons in the top right corner –
 * the play time for all games, the language and the child's figure (boy or girl), each
 * opening its menu only when tapped, so the games fill the screen, then music and fullscreen (last, where
 * every menu has it), switched by one tap. All on the right, so the sun in the
 * top left corner stays in sight.
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
      <FigureMenu />
      <MusicButton />
      <FullscreenButton />
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
function MenuButton({ icon, label, children }: { icon: string; label: string; children: ReactNode }) {
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
      <button type="button" className="home-menu-button" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span aria-hidden>{icon}</span>
        {label}
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

/**
 * Whether the figure that stands for the child is a boy or a girl: chosen once here, it holds for every game
 * (`useFigure`). A menu rather than one tap that switches, so a child's tap on the bar doesn't change it.
 */
function FigureMenu() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const figures: { id: Figure; emoji: string; name: string }[] = [
    { id: "boy", emoji: "👦", name: t({ de: "Junge" }) },
    { id: "girl", emoji: "👧", name: t({ de: "Mädchen" }) },
  ];
  const shown = figures.find((f) => f.id === common.figure) ?? figures[0];
  return (
    <MenuButton icon={shown.emoji} label={shown.name}>
      <section className="settings">
        <SettingsGroup title={t({ de: "Junge oder Mädchen" })}>
          <div className="home-figures">
            {figures.map((f) => (
              <button key={f.id} type="button" className="home-figure" aria-pressed={common.figure === f.id} onClick={() => update({ figure: f.id })}>
                <span aria-hidden>{f.emoji}</span>
                {f.name}
              </button>
            ))}
          </div>
          <p className="setting-note">
            {t({
              de: "Die Figur, die für Ihr Kind steht, ist ein Junge oder ein Mädchen – in Kleine Abenteuer und im Spiegel beim Zähneputzen –, und die Menüs bekommen ihre Farben. Tiere und die Leute in den Bildern bleiben, wie sie sind.",
            })}
          </p>
        </SettingsGroup>
      </section>
    </MenuButton>
  );
}

/**
 * The background song in every game, on or off with one tap – no menu: read aloud and
 * sounds are no switches any more (`src/lib/common.ts`), so music is all there is to set.
 */
function MusicButton() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const label = t({ de: "Musik", ru: "Музыка", en: "Music", zh: "音乐", hi: "संगीत", es: "Música", ar: "الموسيقى" });
  return (
    <button
      type="button"
      className="home-menu-button home-music"
      aria-pressed={common.music}
      title={
        common.music
          ? t({
              de: "Leise Musik im Hintergrund aller Spiele. Tippen schaltet sie aus.",
              ru: "Тихая музыка на фоне во всех играх. Нажмите, чтобы выключить.",
              en: "Soft background music in every game. Tap to turn it off.",
              zh: "所有游戏都有轻柔的背景音乐。点按可关闭。",
              hi: "सभी खेलों में हल्का बैकग्राउंड संगीत। बंद करने के लिए टैप करें।",
              es: "Música suave de fondo en todos los juegos. Toque para apagarla.",
              ar: "موسيقى هادئة في خلفية كل الألعاب. انقروا لإيقافها.",
            })
          : t({
              de: "Keine Musik in allen Spielen – sie wird dann auch nicht heruntergeladen. Tippen schaltet sie ein.",
              ru: "Без музыки во всех играх – тогда она и не скачивается. Нажмите, чтобы включить.",
              en: "No music in any game – then it isn’t downloaded either. Tap to turn it on.",
              zh: "所有游戏都不放音乐——也就不会下载音乐。点按可打开。",
              hi: "किसी भी खेल में संगीत नहीं – तब वह डाउनलोड भी नहीं होता। चालू करने के लिए टैप करें।",
              es: "Sin música en ningún juego; así tampoco se descarga. Toque para encenderla.",
              ar: "لا موسيقى في أي لعبة – وعندها لا يتم تنزيلها أيضًا. انقروا لتشغيلها.",
            })
      }
      onClick={(e) => {
        // Not left focused: a child's space bar would switch it again.
        e.currentTarget.blur();
        // Switched back on: fetch the song now, so it is there when the game starts.
        if (!common.music) void downloadMusic();
        update({ music: !common.music });
      }}
    >
      <span aria-hidden>{common.music ? "🎵" : "🔇"}</span>
      {label}
    </button>
  );
}
