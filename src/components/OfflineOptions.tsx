import { useEffect, useState } from "react";
import { SettingsGroup } from "@/components/SettingControls";
import { SHELF } from "@/content/games";
import { APP_LANGUAGES, OWN_NAMES, useAppLanguage, useT } from "@/lib/language";
import { type OfflineManifest, sizeOf } from "@/lib/offlineParts";
import { keepsOffline, offlineChoiceOf, setOfflineSettings, usePwa } from "@/lib/pwa";

// For grown-ups, behind „mehr …“ on the shelf: whether the games are kept on the device to play without internet, and
// which (user request, November 2026: „nur für die ausgewählte Sprache runterladen; ggf. könnte der User auswählen, ob
// er auch die Sprachen runterladen will und ggf. pro Spiel (Buch) auswählen, Default: alles“). An installed app keeps
// them by default, a browser tab only when asked. The service worker downloads from the build's list
// (src/lib/offlineParts.ts) only the chosen books with the chosen languages' voices and songs; the sizes come from that
// list, which is fetched only once the choice is opened (it is a couple of MB). German only so far (languageStatus.ts).

/** „84 MB“: a size for grown-ups, rounded. */
const megabytes = (bytes: number) => `${bytes < 10e6 ? (bytes / 1e6).toFixed(1).replace(".", ",") : Math.round(bytes / 1e6)} MB`;

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

/** „Ohne Internet spielen“: keep the games on the device, and which languages and books (behind „mehr …“, RoomNotes). */
export function OfflineOptions() {
  const t = useT();
  const language = useAppLanguage();
  const { offline, offlineManifest, offlineProgress } = usePwa();
  const [open, setOpen] = useState(false);
  const on = keepsOffline(offline);
  const manifest = useManifest(offlineManifest, open);
  const choice = offlineChoiceOf(offline, language.id);
  const size = (languages: string[], skip: string[]) => (manifest ? megabytes(sizeOf(manifest, { ...choice, languages, skip })) : null);

  const toggleLanguage = (id: string) => {
    const languages = choice.languages.includes(id) ? choice.languages.filter((l) => l !== id) : [...choice.languages, id];
    // At least one; back to only the app language means „follow the app language“ again.
    if (languages.length === 0) return;
    setOfflineSettings({ languages: languages.length === 1 && languages[0] === language.id ? null : languages });
  };
  const toggleBook = (id: string) => setOfflineSettings({ skip: offline.skip.includes(id) ? offline.skip.filter((b) => b !== id) : [...offline.skip, id] });

  return (
    <section className="settings offline-options">
      <SettingsGroup title={t({ de: "Ohne Internet spielen" })}>
        <fieldset className="choice">
          <legend>{t({ de: "Spiele auf diesem Gerät speichern" })}</legend>
          <button type="button" className={on ? "selected" : undefined} aria-pressed={on} onClick={() => setOfflineSettings({ on: true })}>
            {t({ de: "Ja" })}
          </button>
          <button type="button" className={on ? undefined : "selected"} aria-pressed={!on} onClick={() => setOfflineSettings({ on: false })}>
            {t({ de: "Nein, nur was gespielt wurde" })}
          </button>
        </fieldset>
        {/* Once all is there, InstallHint says so („Funktioniert auch ohne Internet.“). */}
        {on && offlineProgress && offlineProgress.total > 0 && offlineProgress.done < offlineProgress.total && (
          <p className="offline-state" aria-live="polite">
            {t({ de: `Wird gespeichert: ${megabytes(offlineProgress.done)} von ${megabytes(offlineProgress.total)}` })}
          </p>
        )}
        {on && (
          <details className="offline-pick" onToggle={(event) => setOpen(event.currentTarget.open)}>
            <summary>
              {t({ de: "Welche Sprachen und Bücher?" })}
              {size(choice.languages, choice.skip) && <span className="offline-size"> ({size(choice.languages, choice.skip)})</span>}
            </summary>
            <fieldset className="choice">
              <legend>{t({ de: "Sprachen der Stimmen und Lieder" })}</legend>
              {APP_LANGUAGES.map((id) => {
                const chosen = choice.languages.includes(id);
                return (
                  <button key={id} type="button" className={chosen ? "selected" : undefined} aria-pressed={chosen} onClick={() => toggleLanguage(id)}>
                    {OWN_NAMES[id]}
                  </button>
                );
              })}
            </fieldset>
            <fieldset className="choice">
              <legend>{t({ de: "Bücher" })}</legend>
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
