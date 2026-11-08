import { useEffect, useState } from "react";
import { SettingsGroup } from "@/components/SettingControls";
import { SHELF } from "@/content/games";
import { OWN_NAMES, useAppLanguage, useT } from "@/lib/language";
import { type OfflineManifest, sizeOf } from "@/lib/offlineParts";
import { keepsOffline, offlineChoiceOf, setOfflineSettings, usePwa } from "@/lib/pwa";

// For grown-ups, behind „mehr …“ on the shelf: whether the games are kept on the device to play without internet, and
// which (user request, November 2026: „nur für die ausgewählte Sprache runterladen; ggf. könnte der User auswählen, ob
// er auch die Sprachen runterladen will und ggf. pro Spiel (Buch) auswählen, Default: alles“). An installed app keeps
// them by default, a browser tab only when asked. The language is never chosen here: it is the app language, which 🌐
// decides for everything (user feedback, November 2026) – grown-ups choose only whether the music and the voices come
// along (both by default) and which books (all by default). The service worker downloads from the build's list
// (src/lib/offlineParts.ts); the sizes come from that list, which is fetched only once the books are opened (it is a
// couple of MB).

/** „84 MB“: a size for grown-ups, rounded, its number written as `locale` writes it and with its own `unit`. */
const megabytes = (bytes: number, locale: string, unit: string) =>
  `${(bytes / 1e6).toLocaleString(locale, { maximumFractionDigits: bytes < 10e6 ? 1 : 0, minimumFractionDigits: bytes < 10e6 ? 1 : 0 })} ${unit}`;

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

/** „Ohne Internet spielen“: keep the games on the device, with or without music and voices, and which books (behind „mehr …“, RoomNotes). */
export function OfflineOptions() {
  const t = useT();
  const language = useAppLanguage();
  const { offline, offlineManifest, offlineProgress } = usePwa();
  const [open, setOpen] = useState(false);
  const on = keepsOffline(offline);
  const manifest = useManifest(offlineManifest, open);
  const choice = offlineChoiceOf(offline, language.id);
  const unit = t({ de: "MB", en: "MB", zh: "MB", hi: "एमबी", es: "MB", ar: "ميغابايت", ru: "МБ" });
  const mb = (bytes: number) => megabytes(bytes, language.speechLang, unit);
  const size = manifest ? mb(sizeOf(manifest, choice)) : null;
  const toggleBook = (id: string) => setOfflineSettings({ skip: offline.skip.includes(id) ? offline.skip.filter((b) => b !== id) : [...offline.skip, id] });

  return (
    <section className="settings offline-options">
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
          <legend>
            {t({
              de: "Spiele auf diesem Gerät speichern",
              en: "Save the games on this device",
              zh: "把游戏保存在这台设备上",
              hi: "खेलों को इस डिवाइस पर सेव करें",
              es: "Guardar los juegos en este dispositivo",
              ar: "حفظ الألعاب على هذا الجهاز",
              ru: "Сохранить игры на этом устройстве",
            })}
          </legend>
          <button type="button" className={on ? "selected" : undefined} aria-pressed={on} onClick={() => setOfflineSettings({ on: true })}>
            {t({ de: "Ja", en: "Yes", zh: "是", hi: "हाँ", es: "Sí", ar: "نعم", ru: "Да" })}
          </button>
          <button type="button" className={on ? undefined : "selected"} aria-pressed={!on} onClick={() => setOfflineSettings({ on: false })}>
            {t({
              de: "Nein, nur was gespielt wurde",
              en: "No, only what was played",
              zh: "不，只保存玩过的",
              hi: "नहीं, सिर्फ़ जो खेला गया",
              es: "No, solo lo que se ha jugado",
              ar: "لا، فقط ما تم لعبه",
              ru: "Нет, только то, во что уже играли",
            })}
          </button>
        </fieldset>
        {/* Once all is there, InstallHint says so („Funktioniert auch ohne Internet.“). */}
        {on && offlineProgress && offlineProgress.total > 0 && offlineProgress.done < offlineProgress.total && (
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
        {on && (
          // In the app language only, which is named so grown-ups see whose voices come (🌐 changes it).
          <fieldset className="choice">
            <legend>
              {t({ de: "Dazu speichern", en: "Also save", zh: "同时保存", hi: "साथ में सेव करें", es: "Guardar también", ar: "حفظ أيضًا", ru: "Сохранить также" })}
            </legend>
            <button
              type="button"
              className={offline.music ? "selected" : undefined}
              aria-pressed={offline.music}
              onClick={() => setOfflineSettings({ music: !offline.music })}
            >
              🎵 {t({ de: "Musik", en: "Music", zh: "音乐", hi: "संगीत", es: "Música", ar: "الموسيقى", ru: "Музыка" })}
            </button>
            <button
              type="button"
              className={offline.voices ? "selected" : undefined}
              aria-pressed={offline.voices}
              onClick={() => setOfflineSettings({ voices: !offline.voices })}
            >
              🗣️ {t({ de: "Stimmen", en: "Voices", zh: "语音", hi: "आवाज़ें", es: "Voces", ar: "الأصوات", ru: "Голоса" })} · {OWN_NAMES[language.id]}
            </button>
          </fieldset>
        )}
        {on && (
          <details className="offline-pick" onToggle={(event) => setOpen(event.currentTarget.open)}>
            <summary>
              {t({ de: "Welche Bücher?", en: "Which books?", zh: "哪些书？", hi: "कौन-सी किताबें?", es: "¿Qué libros?", ar: "أي كتب؟", ru: "Какие книги?" })}
              {size && <span className="offline-size"> ({size})</span>}
            </summary>
            <fieldset className="choice" aria-label={t({ de: "Bücher", en: "Books", zh: "书", hi: "किताबें", es: "Libros", ar: "الكتب", ru: "Книги" })}>
              {SHELF.map((entry) => {
                const chosen = !offline.skip.includes(entry.id);
                const thing = entry.game ?? entry.category;
                return (
                  <button key={entry.id} type="button" className={chosen ? "selected" : undefined} aria-pressed={chosen} onClick={() => toggleBook(entry.id)}>
                    <span aria-hidden>{thing.emoji}</span> {t(thing.title)}
                  </button>
                );
              })}
            </fieldset>
          </details>
        )}
      </SettingsGroup>
    </section>
  );
}
