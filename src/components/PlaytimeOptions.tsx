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

/** „Игра“ in Russian by the plural rule of the number before it: 1 игра, 2 игры, 5 игр. */
const RU_GAMES: Partial<Record<Intl.LDMLPluralRule, string>> = { one: "игра", few: "игры", many: "игр" };

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
  const games = (n: number) => t({ de: n === 1 ? "1 Spiel" : `${n} Spiele`, ru: `${n} ${RU_GAMES[new Intl.PluralRules("ru").select(n)] ?? "игр"}` });

  return (
    <section className="settings">
      <SettingsGroup title={t({ de: "Spielzeit für alle Spiele", ru: "Время игры для всех игр" })}>
        <Choice<PlaytimeLimit>
          label={t({ de: "Grenze pro Tag", ru: "Ограничение в день" })}
          value={settings.by}
          onChange={(by) => update({ by })}
          options={[
            { value: "none", label: t({ de: "∞ Ohne", ru: "∞ Без ограничения" }) },
            { value: "time", label: t({ de: "⏱️ Minuten", ru: "⏱️ Минуты" }) },
            { value: "games", label: t({ de: "🎲 Spiele", ru: "🎲 Игры" }) },
          ]}
        />
        {settings.by === "time" && (
          <Slider
            label={t({ de: "Minuten pro Tag", ru: "Минут в день" })}
            value={settings.minutes}
            {...MINUTES_RANGE}
            format={minutes}
            onChange={(m) => update({ minutes: m })}
          />
        )}
        {settings.by === "games" && (
          <>
            <Slider
              label={t({ de: "Spiele pro Tag", ru: "Игр в день" })}
              value={settings.games}
              {...GAMES_RANGE}
              format={games}
              onChange={(g) => update({ games: g })}
            />
            <p className="setting-note">
              {t({
                de: "Jedes gestartete Spiel zählt, auch „Nochmal“ und „Weiter“ am Ende. Das letzte läuft bis zu seinem Ende. Spiele ohne Ende (z. B. Tiere, Buchstaben) laufen, bis ihr sie beendet – dafür passt die Grenze in Minuten besser.",
                ru: "Считается каждая начатая игра, и «Ещё раз» и «Дальше» в конце тоже. Последняя идёт до своего конца. Игры без конца (например, «Что нужно зверюшке?», «Буквы и цифры») идут, пока вы их не закончите, – для них лучше подходит ограничение в минутах.",
              })}
            </p>
          </>
        )}
        {settings.by !== "none" && (
          <p className="setting-note">
            {t({
              de: "Danach sagt das Spiel „Gute Nacht“, und kein Menü startet mehr ein Spiel – bis ein Erwachsener ⏳ unten drei Sekunden gedrückt hält und hier mehr Zeit gibt.",
              ru: "Потом игра говорит «Спокойной ночи», и ни одно меню больше не запускает игру – пока взрослый не удержит ⏳ внизу три секунды и не добавит здесь времени.",
            })}
          </p>
        )}
        <p className="playtime-status">
          <span>
            {t({
              de: `Heute gespielt: ${minutes(playedMinutes)}, ${games(played.games)}`,
              ru: `Сегодня сыграно: ${minutes(playedMinutes)}, ${games(played.games)}`,
            })}
            {over && t({ de: " – die Spielzeit ist vorbei", ru: " – время игры закончилось" })}
          </span>
          {over && (
            <button type="button" onClick={morePlaytime}>
              + {settings.by === "time" ? minutes(EXTRA_MINUTES) : games(1)}
            </button>
          )}
          {(played.ms > 0 || played.games > 0) && (
            <button type="button" onClick={resetPlaytime}>
              ↺ {t({ de: "Heute von vorn", ru: "Сегодня заново" })}
            </button>
          )}
        </p>
      </SettingsGroup>
    </section>
  );
}
