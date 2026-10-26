import { Choice, SettingsGroup, Slider } from "@/components/SettingControls";
import { useT } from "@/lib/language";
import {
  EXTRA_MINUTES,
  GAMES_RANGE,
  MINUTES_RANGE,
  morePlaytime,
  type PlaytimeLimit,
  resetPlaytime,
  usePlaytimeSettings,
  usePlaytimeState,
} from "@/lib/playtime";

/**
 * The play time for all games, for the grown-up: no limit, minutes or a number of
 * games per day, each set with a slider; what was played today, and when it is
 * over a little more or a fresh start. On the home page and on the lock over the menus.
 */
export function PlaytimeOptions() {
  const t = useT();
  const [settings, update] = usePlaytimeSettings();
  const { played, over } = usePlaytimeState();
  const playedMinutes = Math.floor(played.ms / 60_000);
  const minutes = (n: number) => t({ de: `${n} Min.`, ru: `${n} мин.` });
  const games = (n: number) => t({ de: n === 1 ? "1 Spiel" : `${n} Spiele` });

  return (
    <section className="settings">
      <SettingsGroup title={t({ de: "Spielzeit für alle Spiele", ru: "Время игры для всех игр" })}>
        <Choice<PlaytimeLimit>
          label={t({ de: "Grenze pro Tag" })}
          value={settings.by}
          onChange={(by) => update({ by })}
          options={[
            { value: "none", label: t({ de: "∞ Ohne", ru: "∞ Без ограничения" }) },
            { value: "time", label: t({ de: "⏱️ Minuten" }) },
            { value: "games", label: t({ de: "🎲 Spiele" }) },
          ]}
        />
        {settings.by === "time" && (
          <Slider label={t({ de: "Minuten pro Tag" })} value={settings.minutes} {...MINUTES_RANGE} format={minutes} onChange={(m) => update({ minutes: m })} />
        )}
        {settings.by === "games" && (
          <>
            <Slider label={t({ de: "Spiele pro Tag" })} value={settings.games} {...GAMES_RANGE} format={games} onChange={(g) => update({ games: g })} />
            <p className="setting-note">
              {t({
                de: "Jedes gestartete Spiel zählt, auch „Nochmal“ und „Weiter“ am Ende. Das letzte läuft bis zu seinem Ende. Spiele ohne Ende (z. B. Tiere, Buchstaben) laufen, bis ihr sie beendet – dafür passt die Grenze in Minuten besser.",
              })}
            </p>
          </>
        )}
        {settings.by !== "none" && (
          <p className="setting-note">
            {t({
              de: "Danach sagt das Spiel „Gute Nacht“, und kein Menü startet mehr ein Spiel – bis ein Erwachsener ⏳ unten drei Sekunden gedrückt hält und hier mehr Zeit gibt.",
            })}
          </p>
        )}
        <p className="playtime-status">
          <span>
            {t({ de: `Heute gespielt: ${minutes(playedMinutes)}, ${games(played.games)}` })}
            {over && t({ de: " – die Spielzeit ist vorbei", ru: " – время игры закончилось" })}
          </span>
          {over && (
            <button type="button" onClick={morePlaytime}>
              + {settings.by === "time" ? minutes(EXTRA_MINUTES) : games(1)}
            </button>
          )}
          {(played.ms > 0 || played.games > 0) && (
            <button type="button" onClick={resetPlaytime}>
              ↺ {t({ de: "Heute von vorn" })}
            </button>
          )}
        </p>
      </SettingsGroup>
    </section>
  );
}
