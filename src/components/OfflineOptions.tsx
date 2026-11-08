import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { SettingsGroup } from "@/components/SettingControls";
import { SHELF } from "@/content/games";
import { useAppLanguage, useT } from "@/lib/language";
import { type OfflineManifest, sizeOf } from "@/lib/offlineParts";
import { keepsOffline, offlineChoiceOf, setOfflineSettings, usePwa } from "@/lib/pwa";

// For grown-ups, behind the sign „Offline spielen“ hanging under the shelf (RoomOffline), below installing the app: whether the games are kept on the device to play without internet, and
// which (user request, November 2026: „nur für die ausgewählte Sprache runterladen; ggf. könnte der User auswählen, ob
// er auch die Sprachen runterladen will und ggf. pro Spiel (Buch) auswählen, Default: alles“). An installed app keeps
// them by default, a browser tab only when asked. The language is never chosen here: it is the app language, which 🌐
// decides for everything (user feedback, November 2026) – grown-ups choose only whether the music and the voices come
// along (both by default) and which books (all by default). Compact, one short row each, so it is seen whole without
// scrolling (user feedback, November 2026): the single books show only once „Auswählen“ is picked instead of „Alle“.
// The service worker downloads from the build's list (src/lib/offlineParts.ts); the size comes from that list, which
// is fetched only once this is seen (it is a couple of MB).

/** „84 MB“: a size for grown-ups, rounded, its number written as `locale` writes it and with its own `unit`. */
const megabytes = (bytes: number, locale: string, unit: string) =>
  `${(bytes / 1e6).toLocaleString(locale, { maximumFractionDigits: bytes < 10e6 ? 1 : 0, minimumFractionDigits: bytes < 10e6 ? 1 : 0 })} ${unit}`;

/** Whether `ref`'s element has been on the screen (the panel it stands in may open scrolled). */
function useSeen(ref: RefObject<Element | null>) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (seen || !element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => entries.some((entry) => entry.isIntersecting) && setSeen(true));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, seen]);
  return seen;
}

/** The list of the offline copy, fetched once `wanted`; null until it is there (or without a service worker). */
function useManifest(url: string | null, wanted: boolean) {
  const [manifest, setManifest] = useState<OfflineManifest | null>(null);
  useEffect(() => {
    if (!url || !wanted || manifest) return;
    let alive = true;
    fetch(new URL(url, document.baseURI))
      .then((response) => (response.ok ? response.json() : null))
      .then((data: OfflineManifest | null) => alive && data && setManifest(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [url, wanted, manifest]);
  return manifest;
}

/** One choice of a row: its words marked by the highlighter while on (`.choice-label`, book.css). */
function Pick({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" className={on ? "selected" : undefined} aria-pressed={on} onClick={onClick}>
      <span className="choice-label">{children}</span>
    </button>
  );
}

/** „Ohne Internet spielen“: keep the games on the device, with or without music and voices, and which books (behind „Offline spielen“, RoomOffline). */
export function OfflineOptions() {
  const t = useT();
  const language = useAppLanguage();
  const { offline, offlineManifest, offlineProgress } = usePwa();
  const on = keepsOffline(offline);
  const section = useRef<HTMLElement>(null);
  const manifest = useManifest(offlineManifest, useSeen(section) && on);
  // The single books show while picking them, and whenever some are left out.
  const [picking, setPicking] = useState(offline.skip.length > 0);
  const choice = offlineChoiceOf(offline, language.id);
  const unit = t({ de: "MB", en: "MB", zh: "MB", hi: "एमबी", es: "MB", ar: "ميغابايت", ru: "МБ" });
  const mb = (bytes: number) => megabytes(bytes, language.speechLang, unit);
  const toggleBook = (id: string) => setOfflineSettings({ skip: offline.skip.includes(id) ? offline.skip.filter((b) => b !== id) : [...offline.skip, id] });
  const saving = on && offlineProgress && offlineProgress.total > 0 && offlineProgress.done < offlineProgress.total;

  return (
    <section ref={section} className="settings offline-options">
      <SettingsGroup
        title={t({
          de: "Ohne Internet spielen",
          en: "Play without internet",
          zh: "不联网也能玩",
          hi: "बिना इंटरनेट के खेलें",
          es: "Jugar sin internet",
          ar: "اللعب بدون إنترنت",
          ru: "Играть без интернета",
        })}
      >
        <fieldset className="choice">
          <legend>{t({ de: "Speichern", en: "Save", zh: "保存", hi: "सेव करें", es: "Guardar", ar: "الحفظ", ru: "Сохранять" })}</legend>
          <Pick on={on} onClick={() => setOfflineSettings({ on: true })}>
            {t({ de: "Ja", en: "Yes", zh: "是", hi: "हाँ", es: "Sí", ar: "نعم", ru: "Да" })}
          </Pick>
          <Pick on={!on} onClick={() => setOfflineSettings({ on: false })}>
            {t({
              de: "Nur Gespieltes",
              en: "Only what was played",
              zh: "只保存玩过的",
              hi: "सिर्फ़ खेले गए",
              es: "Solo lo jugado",
              ar: "ما تم لعبه فقط",
              ru: "Только сыгранное",
            })}
          </Pick>
        </fieldset>
        {on && (
          // In the app language, which 🌐 decides; both on by default.
          <fieldset className="choice">
            <legend>{t({ de: "Dazu", en: "Also", zh: "另外", hi: "साथ में", es: "Además", ar: "أيضًا", ru: "Также" })}</legend>
            <Pick on={offline.music} onClick={() => setOfflineSettings({ music: !offline.music })}>
              🎵 {t({ de: "Musik", en: "Music", zh: "音乐", hi: "संगीत", es: "Música", ar: "الموسيقى", ru: "Музыка" })}
            </Pick>
            <Pick on={offline.voices} onClick={() => setOfflineSettings({ voices: !offline.voices })}>
              🗣️ {t({ de: "Stimmen", en: "Voices", zh: "语音", hi: "आवाज़ें", es: "Voces", ar: "الأصوات", ru: "Голоса" })}
            </Pick>
          </fieldset>
        )}
        {on && (
          <fieldset className="choice">
            <legend>{t({ de: "Bücher", en: "Books", zh: "书", hi: "किताबें", es: "Libros", ar: "الكتب", ru: "Книги" })}</legend>
            <Pick
              on={!picking}
              onClick={() => {
                setPicking(false);
                setOfflineSettings({ skip: [] });
              }}
            >
              {t({ de: "Alle", en: "All", zh: "全部", hi: "सभी", es: "Todos", ar: "الكل", ru: "Все" })}
            </Pick>
            <Pick on={picking} onClick={() => setPicking(true)}>
              {t({ de: "Auswählen", en: "Choose", zh: "选择", hi: "चुनें", es: "Elegir", ar: "اختيار", ru: "Выбрать" })}
            </Pick>
            {manifest && !saving && <span className="offline-size">{mb(sizeOf(manifest, choice))}</span>}
          </fieldset>
        )}
        {on && picking && (
          <fieldset
            className="choice offline-books"
            aria-label={t({ de: "Bücher", en: "Books", zh: "书", hi: "किताबें", es: "Libros", ar: "الكتب", ru: "Книги" })}
          >
            {SHELF.map((entry) => {
              const thing = entry.game ?? entry.category;
              return (
                <Pick key={entry.id} on={!offline.skip.includes(entry.id)} onClick={() => toggleBook(entry.id)}>
                  <span aria-hidden>{thing.emoji}</span> {t(thing.title)}
                </Pick>
              );
            })}
          </fieldset>
        )}
        {/* Once all is there, InstallHint says so („Funktioniert auch ohne Internet.“). */}
        {saving && offlineProgress && (
          <p className="offline-state" aria-live="polite">
            {t({
              de: `Wird gespeichert: ${mb(offlineProgress.done)} von ${mb(offlineProgress.total)}`,
              en: `Saving: ${mb(offlineProgress.done)} of ${mb(offlineProgress.total)}`,
              zh: `正在保存：${mb(offlineProgress.done)} / ${mb(offlineProgress.total)}`,
              hi: `सेव हो रहा है: ${mb(offlineProgress.total)} में से ${mb(offlineProgress.done)}`,
              es: `Guardando: ${mb(offlineProgress.done)} de ${mb(offlineProgress.total)}`,
              ar: `جارٍ الحفظ: ${mb(offlineProgress.done)} من ${mb(offlineProgress.total)}`,
              ru: `Сохраняется: ${mb(offlineProgress.done)} из ${mb(offlineProgress.total)}`,
            })}
          </p>
        )}
      </SettingsGroup>
    </section>
  );
}
