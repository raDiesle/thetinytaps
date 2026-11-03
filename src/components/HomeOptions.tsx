import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Choice, SettingsGroup } from "@/components/SettingControls";
import { targetLanguageFor } from "@/content/targetLanguages";
import { type Leave, useCommonSettings } from "@/lib/common";
import { APP_LANGUAGES, OWN_NAMES, setAppLanguage, useAppLanguage, useT } from "@/lib/language";
import { downloadMusic } from "@/lib/musicFile";

/*
 * The grown-ups' menus of the home page, opened from the things in the bookshelf (RoomOptions.tsx): how a game is left,
 * the language, and the music's switch.
 */

/**
 * A thing in the bookshelf's room that opens a menu; on a phone the menu covers the whole
 * screen, with its name and ✕ on top. Tapping outside, ✕ or Escape closes it;
 * the tap that closes it lands on a see-through backdrop, so it never also
 * starts the game underneath. While there is more below, a bar at the bottom
 * says so, so a grown-up knows to scroll.
 */
export function MenuButton({
  icon,
  label,
  art,
  className,
  keep = false,
  children,
}: {
  /** The menu's sign beside its name, on top of it. */
  icon: string;
  /** The thing's name, read out and on top of its menu. */
  label: string;
  /** What the thing looks like in the shelf. */
  art: ReactNode;
  className: string;
  /** Text that stays in the page while closed, unseen: words search engines are to find (RoomNotes). */
  keep?: boolean;
  children: ReactNode;
}) {
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

  const sheet = open && (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: a tap beside the menu closes it; Esc does the same */}
      <div className="home-menu-backdrop" onClick={() => setOpen(false)} />
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
    </>
  );

  return (
    <div className="home-menu">
      <button type="button" className={className} aria-expanded={open} title={label} aria-label={label} onClick={() => setOpen(!open)}>
        {art}
      </button>
      {/* The bookshelf's 3D room opens the menu outside it, over the whole screen (a transform would hold it in). */}
      {sheet && createPortal(<div className="room-menu">{sheet}</div>, document.body)}
      {keep && !open && <div hidden>{children}</div>}
    </div>
  );
}

/**
 * How a game is left with its ✕ (the page's corner), for all games: one tap, or held for a moment so a
 * child's tap can't end it. Beside the play time (⏳), the other rule grown-ups set for playing alone; not on the lock
 * over the menus, which only gives more time.
 */
export function LeaveOptions() {
  const t = useT();
  const [common, update] = useCommonSettings();
  return (
    <section className="settings">
      <SettingsGroup
        title={t({
          de: "Spiel verlassen",
          ru: "Выход из игры",
          en: "Leaving a game",
          zh: "退出游戏",
          hi: "खेल से बाहर निकलना",
          es: "Salir del juego",
          ar: "الخروج من اللعبة",
        })}
      >
        <Choice<Leave>
          label={t({
            de: "✕ zum Verlassen eines Spiels",
            ru: "✕ для выхода из игры",
            en: "✕ to leave a game",
            zh: "用 ✕ 退出游戏",
            hi: "खेल से बाहर निकलने के लिए ✕",
            es: "✕ para salir de un juego",
            ar: "✕ للخروج من اللعبة",
          })}
          value={common.leave}
          onChange={(leave) => update({ leave })}
          options={[
            { value: "tap", label: t({ de: "Antippen", ru: "Нажать", en: "Tap", zh: "轻点", hi: "टैप करें", es: "Tocar", ar: "النقر" }) },
            {
              value: "hold",
              label: t({ de: "Gedrückt halten", ru: "Удерживать", en: "Hold", zh: "按住", hi: "दबाए रखें", es: "Mantener pulsado", ar: "الضغط المطوّل" }),
            },
          ]}
        />
        <p className="setting-note">
          {t({
            de: "Gedrückt halten: Ihr Kind beendet ein Spiel nicht aus Versehen. Esc muss immer gehalten werden.",
            ru: "Удерживать: ваш ребёнок не закончит игру случайно. Esc всегда нужно удерживать.",
            en: "Hold: your child won’t end a game by accident. Esc always has to be held.",
            zh: "按住：孩子不会不小心结束游戏。Esc 键始终需要按住。",
            hi: "दबाए रखें: आपका बच्चा गलती से खेल बंद नहीं करेगा। Esc को हमेशा दबाए रखना होता है।",
            es: "Mantener pulsado: su peque no termina un juego sin querer. Esc siempre hay que mantenerla pulsada.",
            ar: "الضغط المطوّل: لن ينهي طفلكم اللعبة عن غير قصد. يجب دائمًا الضغط مطوّلًا على Esc.",
          })}
        </p>
      </SettingsGroup>
    </section>
  );
}

/** The language of the whole app: the grown-ups' screens and what the games say, where a game speaks it. */
export function AppLanguageOptions() {
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

/** The background music's switch for all games: whether it is on, its name and tooltip, and one tap to switch it. */
export function useMusicSwitch() {
  const t = useT();
  const [common, update] = useCommonSettings();
  const label = t({ de: "Musik", ru: "Музыка", en: "Music", zh: "音乐", hi: "संगीत", es: "Música", ar: "الموسيقى" });
  const title = common.music
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
      });
  const toggle = (e: MouseEvent<HTMLElement>) => {
    // Not left focused: a child's space bar would switch it again.
    e.currentTarget.blur();
    // Switched back on: fetch the song now, so it is there when the game starts.
    if (!common.music) void downloadMusic();
    update({ music: !common.music });
  };
  return { on: common.music, label, title, toggle };
}
